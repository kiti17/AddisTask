from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import or_

from app.api.routes_auth import reset_auth_rate_limits
from app.db.database import SessionLocal
from app.main import app
from app.models.admin_audit import AdminAuditLog
from app.models.application import Application
from app.models.message import TaskMessage
from app.models.provider import ProviderProfile
from app.models.review import Review
from app.models.task import Task
from app.models.user import User


client = TestClient(app)

TEST_USER_NAMES = {
    "Identity Test User",
    "Password Change User",
    "Password Change Blocked User",
    "Login Rate Limit User",
    "Normal Approval User",
    "Pending Provider User",
    "Customer Approval Flow",
    "Provider Approval Flow",
    "Admin Approval Flow",
    "Provider Resubmit Flow",
    "Admin Resubmit Flow",
    "Customer Accept Flow",
    "Provider Accept Flow",
    "Admin Accept Flow",
    "Customer Payment Flow",
    "Provider Payment Flow",
    "Admin Payment Flow",
    "Customer Invalid Payment",
    "Customer Complete Owner",
    "Other Complete User",
    "Provider Complete Flow",
    "Admin Complete Flow",
    "Customer Message Pending",
    "Provider Message Pending",
    "Message Outsider",
    "Admin Message Pending",
    "Customer Assigned Flow",
    "Provider Assigned Flow",
    "Admin Assigned Flow",
    "Self Apply User",
    "Self Apply Admin",
    "Customer Archive Flow",
    "Admin Archive Flow",
    "Incomplete Trust Provider",
    "Trust Approval Admin",
    "Match Visibility Customer",
    "Legacy Incomplete Match Provider",
    "Ready Match Provider",
}

TEST_TASK_TITLES = {"Test apartment cleaning"}
TEST_PROVIDER_NAMES = {
    "Workflow Test Cleaning",
    "Workflow Test Cleaning Updated",
    "Workflow Test Incomplete Approved",
    "Workflow Test Ready Match",
}


def cleanup_workflow_test_data():
    db = SessionLocal()

    try:
        user_ids = [
            user_id
            for (user_id,) in db.query(User.id)
            .filter(User.full_name.in_(TEST_USER_NAMES))
            .all()
        ]
        task_ids = [
            task_id
            for (task_id,) in db.query(Task.id)
            .filter(
                (Task.title.in_(TEST_TASK_TITLES))
                | (Task.customer_id.in_(user_ids))
            )
            .all()
        ]
        provider_ids = [
            provider_id
            for (provider_id,) in db.query(ProviderProfile.id)
            .filter(
                (ProviderProfile.business_name.in_(TEST_PROVIDER_NAMES))
                | (ProviderProfile.user_id.in_(user_ids))
            )
            .all()
        ]

        audit_filters = []

        if task_ids:
            audit_filters.append(
                (AdminAuditLog.entity_type == "task")
                & (AdminAuditLog.entity_id.in_(task_ids))
            )

        if provider_ids:
            audit_filters.append(
                (AdminAuditLog.entity_type == "provider")
                & (AdminAuditLog.entity_id.in_(provider_ids))
            )

        if user_ids:
            audit_filters.append(AdminAuditLog.admin_id.in_(user_ids))

        if audit_filters:
            db.query(AdminAuditLog).filter(or_(*audit_filters)).delete(
                synchronize_session=False
            )

        if task_ids:
            db.query(TaskMessage).filter(TaskMessage.task_id.in_(task_ids)).delete(
                synchronize_session=False
            )
            db.query(Review).filter(Review.task_id.in_(task_ids)).delete(
                synchronize_session=False
            )

        if provider_ids:
            db.query(Review).filter(Review.provider_id.in_(provider_ids)).delete(
                synchronize_session=False
            )

        if user_ids:
            db.query(TaskMessage).filter(
                (TaskMessage.sender_id.in_(user_ids))
                | (TaskMessage.recipient_id.in_(user_ids))
            ).delete(synchronize_session=False)
            db.query(Review).filter(Review.customer_id.in_(user_ids)).delete(
                synchronize_session=False
            )

        if task_ids or provider_ids:
            query = db.query(Application)

            if task_ids and provider_ids:
                query = query.filter(
                    (Application.task_id.in_(task_ids))
                    | (Application.provider_id.in_(provider_ids))
                )
            elif task_ids:
                query = query.filter(Application.task_id.in_(task_ids))
            else:
                query = query.filter(Application.provider_id.in_(provider_ids))

            query.delete(synchronize_session=False)

        if provider_ids:
            db.query(ProviderProfile).filter(ProviderProfile.id.in_(provider_ids)).delete(
                synchronize_session=False
            )

        if task_ids:
            db.query(Task).filter(Task.id.in_(task_ids)).delete(
                synchronize_session=False
            )

        if user_ids:
            db.query(User).filter(User.id.in_(user_ids)).delete(
                synchronize_session=False
            )

        db.commit()
    finally:
        db.close()


@pytest.fixture(autouse=True)
def isolate_workflow_test_data():
    cleanup_workflow_test_data()
    reset_auth_rate_limits()
    yield
    reset_auth_rate_limits()
    cleanup_workflow_test_data()


def unique_phone(prefix: str) -> str:
    return f"{prefix}{uuid4().hex[:10]}"


def register_and_login(name: str, phone_prefix: str = "09"):
    phone = unique_phone(phone_prefix)
    password = "secret123"

    register_response = client.post(
        "/api/auth/register",
        json={
            "full_name": name,
            "phone": phone,
            "password": password,
        },
    )
    assert register_response.status_code == 200

    login_response = client.post(
        "/api/auth/login",
        json={
            "phone": phone,
            "password": password,
        },
    )
    assert login_response.status_code == 200

    body = login_response.json()
    assert body["access_token"]
    assert body["role"] == "customer"

    return {
        "phone": phone,
        "password": password,
        "token": body["access_token"],
        "user_id": body["user_id"],
    }


def auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}


def promote_user_to_admin(user_id: int):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        assert user is not None
        user.role = "admin"
        db.commit()
    finally:
        db.close()


def create_task(customer_token: str):
    response = client.post(
        "/api/tasks/",
        headers=auth_headers(customer_token),
        json={
            "title": "Test apartment cleaning",
            "description": "Test task for marketplace workflow",
            "category": "Cleaning",
            "location": "Bole",
            "budget": 1800,
        },
    )
    assert response.status_code == 200
    return response.json()


def create_provider(provider_token: str):
    response = client.post(
        "/api/providers/",
        headers=auth_headers(provider_token),
        json={
            "business_name": "Workflow Test Cleaning",
            "skill_category": "Cleaning",
            "city": "Bole",
            "bio": "Experienced cleaner for apartments and small offices.",
            "experience_years": 3,
            "service_area": "Bole, CMC",
            "availability": "Weekdays and weekends",
            "contact_phone": "0912345678",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["approval_status"] == "pending"
    assert body["experience_years"] == 3
    assert body["id_verification_status"] == "submitted"
    assert body["trust_ready"] is True
    assert body["trust_score"] == 100
    return body


def create_assigned_task_flow():
    customer = register_and_login("Customer Assigned Flow", "080")
    provider_user = register_and_login("Provider Assigned Flow", "079")
    admin = register_and_login("Admin Assigned Flow", "078")
    promote_user_to_admin(admin["user_id"])

    task = create_task(customer["token"])
    provider = create_provider(provider_user["token"])

    approval_response = client.patch(
        f"/api/providers/{provider['id']}/approval?status=approved",
        headers=auth_headers(admin["token"]),
    )
    assert approval_response.status_code == 200

    application_response = client.post(
        "/api/applications/",
        headers=auth_headers(provider_user["token"]),
        json={"task_id": task["id"]},
    )
    assert application_response.status_code == 200

    accept_response = client.patch(
        f"/api/applications/{application_response.json()['id']}/status?status=accepted",
        headers=auth_headers(customer["token"]),
    )
    assert accept_response.status_code == 200

    return {
        "customer": customer,
        "provider_user": provider_user,
        "provider": provider,
        "task": task,
    }


def test_login_returns_user_identity_and_role():
    user = register_and_login("Identity Test User", "091")

    response = client.get(
        "/api/auth/me",
        headers=auth_headers(user["token"]),
    )

    assert response.status_code == 200
    body = response.json()
    assert body["user_id"] == user["user_id"]
    assert body["role"] == "customer"


def test_logged_in_user_can_change_password():
    user = register_and_login("Password Change User", "070")

    response = client.patch(
        "/api/auth/password",
        headers=auth_headers(user["token"]),
        json={
            "current_password": user["password"],
            "new_password": "newsecret123",
        },
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Password updated successfully"

    old_login_response = client.post(
        "/api/auth/login",
        json={
            "phone": user["phone"],
            "password": user["password"],
        },
    )
    assert old_login_response.status_code == 401

    new_login_response = client.post(
        "/api/auth/login",
        json={
            "phone": user["phone"],
            "password": "newsecret123",
        },
    )
    assert new_login_response.status_code == 200


def test_password_change_requires_current_password_and_new_value():
    user = register_and_login("Password Change Blocked User", "071")

    wrong_current_response = client.patch(
        "/api/auth/password",
        headers=auth_headers(user["token"]),
        json={
            "current_password": "wrongsecret",
            "new_password": "newsecret123",
        },
    )

    assert wrong_current_response.status_code == 400
    assert wrong_current_response.json()["detail"] == "Current password is incorrect"

    same_password_response = client.patch(
        "/api/auth/password",
        headers=auth_headers(user["token"]),
        json={
            "current_password": user["password"],
            "new_password": user["password"],
        },
    )

    assert same_password_response.status_code == 400
    assert same_password_response.json()["detail"] == "New password must be different"


def test_repeated_failed_logins_are_temporarily_limited():
    user = register_and_login("Login Rate Limit User", "072")

    for _ in range(5):
        response = client.post(
            "/api/auth/login",
            json={
                "phone": user["phone"],
                "password": "wrongsecret",
            },
        )
        assert response.status_code == 401

    limited_response = client.post(
        "/api/auth/login",
        json={
            "phone": user["phone"],
            "password": user["password"],
        },
    )

    assert limited_response.status_code == 429
    assert (
        limited_response.json()["detail"]
        == "Too many failed login attempts. Try again later."
    )


def test_provider_approval_requires_admin():
    normal_user = register_and_login("Normal Approval User", "092")
    provider_user = register_and_login("Pending Provider User", "093")
    provider = create_provider(provider_user["token"])

    queue_response = client.get(
        "/api/providers/verification-queue",
        headers=auth_headers(normal_user["token"]),
    )
    assert queue_response.status_code == 403

    approval_response = client.patch(
        f"/api/providers/{provider['id']}/approval?status=approved",
        headers=auth_headers(normal_user["token"]),
    )
    assert approval_response.status_code == 403


def test_admin_data_health_requires_admin():
    normal_user = register_and_login("Normal Approval User", "092")

    response = client.get(
        "/api/admin/data-health",
        headers=auth_headers(normal_user["token"]),
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_admin_can_scan_and_clean_workflow_test_data():
    customer = register_and_login("Customer Payment Flow", "087")
    provider_user = register_and_login("Provider Payment Flow", "088")
    admin = register_and_login("Admin Payment Flow", "086")
    promote_user_to_admin(admin["user_id"])

    task = create_task(customer["token"])
    provider = create_provider(provider_user["token"])

    approval_response = client.patch(
        f"/api/providers/{provider['id']}/approval?status=approved",
        headers=auth_headers(admin["token"]),
    )
    assert approval_response.status_code == 200

    application_response = client.post(
        "/api/applications/",
        headers=auth_headers(provider_user["token"]),
        json={"task_id": task["id"]},
    )
    assert application_response.status_code == 200

    health_response = client.get(
        "/api/admin/data-health",
        headers=auth_headers(admin["token"]),
    )
    assert health_response.status_code == 200
    candidates = health_response.json()["workflow_test_candidates"]
    assert candidates["users"] == 3
    assert candidates["tasks"] == 1
    assert candidates["providers"] == 1
    assert candidates["applications"] == 1

    cleanup_response = client.post(
        "/api/admin/cleanup-workflow-tests",
        headers=auth_headers(admin["token"]),
    )
    assert cleanup_response.status_code == 200
    deleted = cleanup_response.json()["deleted"]
    assert deleted["users"] == 3
    assert deleted["tasks"] == 1
    assert deleted["providers"] == 1
    assert deleted["applications"] == 1
    assert cleanup_response.json()["workflow_test_candidates"]["users"] == 0


def test_admin_can_archive_and_restore_task_without_deleting_it():
    customer = register_and_login("Customer Archive Flow", "083")
    admin = register_and_login("Admin Archive Flow", "082")
    promote_user_to_admin(admin["user_id"])

    task = create_task(customer["token"])

    forbidden_response = client.patch(
        f"/api/admin/tasks/{task['id']}/archive",
        headers=auth_headers(customer["token"]),
        json={"reason": "Customer should not archive marketplace records."},
    )
    assert forbidden_response.status_code == 403

    archive_response = client.patch(
        f"/api/admin/tasks/{task['id']}/archive",
        headers=auth_headers(admin["token"]),
        json={"reason": "Duplicate customer request."},
    )
    assert archive_response.status_code == 200
    archived_task = archive_response.json()["task"]
    assert archived_task["status"] == "archived"
    assert archived_task["archive_reason"] == "Duplicate customer request."
    assert archive_response.json()["summary"]["archived_tasks"] >= 1

    marketplace_response = client.get("/api/tasks/")
    assert marketplace_response.status_code == 200
    marketplace_task_ids = {task["id"] for task in marketplace_response.json()}
    assert task["id"] not in marketplace_task_ids

    archived_response = client.get(
        "/api/admin/tasks/archived",
        headers=auth_headers(admin["token"]),
    )
    assert archived_response.status_code == 200
    archived_task_ids = {task["id"] for task in archived_response.json()}
    assert task["id"] in archived_task_ids

    audit_response = client.get(
        "/api/admin/audit-log?limit=5",
        headers=auth_headers(admin["token"]),
    )
    assert audit_response.status_code == 200
    assert any(log["action"] == "archive_task" for log in audit_response.json())

    restore_response = client.patch(
        f"/api/admin/tasks/{task['id']}/restore",
        headers=auth_headers(admin["token"]),
    )
    assert restore_response.status_code == 200
    assert restore_response.json()["task"]["status"] == "open"

    restored_marketplace_response = client.get("/api/tasks/")
    assert restored_marketplace_response.status_code == 200
    restored_marketplace_task_ids = {
        task["id"] for task in restored_marketplace_response.json()
    }
    assert task["id"] in restored_marketplace_task_ids


def test_pending_provider_cannot_apply_until_admin_approves():
    customer = register_and_login("Customer Approval Flow", "094")
    provider_user = register_and_login("Provider Approval Flow", "095")
    admin = register_and_login("Admin Approval Flow", "096")
    promote_user_to_admin(admin["user_id"])

    task = create_task(customer["token"])
    provider = create_provider(provider_user["token"])

    pending_apply_response = client.post(
        "/api/applications/",
        headers=auth_headers(provider_user["token"]),
        json={"task_id": task["id"]},
    )
    assert pending_apply_response.status_code == 403

    approval_response = client.patch(
        f"/api/providers/{provider['id']}/approval",
        headers=auth_headers(admin["token"]),
        json={
            "status": "approved",
            "admin_notes": "Profile has enough trust details for approval.",
        },
    )
    assert approval_response.status_code == 200
    assert approval_response.json()["approval_status"] == "approved"
    assert approval_response.json()["admin_notes"] == "Profile has enough trust details for approval."

    apply_response = client.post(
        "/api/applications/",
        headers=auth_headers(provider_user["token"]),
        json={"task_id": task["id"]},
    )
    assert apply_response.status_code == 200
    assert apply_response.json()["status"] == "pending"


def test_admin_cannot_approve_provider_missing_trust_details():
    provider_user = register_and_login("Incomplete Trust Provider", "077")
    admin = register_and_login("Trust Approval Admin", "076")
    promote_user_to_admin(admin["user_id"])

    provider_response = client.post(
        "/api/providers/",
        headers=auth_headers(provider_user["token"]),
        json={
            "business_name": "Incomplete Trust Profile",
            "skill_category": "Cleaning",
            "city": "Bole",
            "bio": "",
            "experience_years": 0,
            "service_area": "",
            "availability": "",
            "contact_phone": "",
        },
    )
    assert provider_response.status_code == 200
    provider = provider_response.json()
    assert provider["trust_ready"] is False
    assert provider["trust_score"] < 100
    assert "Contact phone" in provider["missing_trust_requirements"]

    approval_response = client.patch(
        f"/api/providers/{provider['id']}/approval",
        headers=auth_headers(admin["token"]),
        json={
            "status": "approved",
            "admin_notes": "Trying to approve before trust details are complete.",
        },
    )
    assert approval_response.status_code == 400
    assert (
        approval_response.json()["detail"]
        == "Provider profile needs trust details before approval"
    )


def test_smart_match_only_returns_approved_trust_ready_providers():
    customer = register_and_login("Match Visibility Customer", "073")
    incomplete_provider_user = register_and_login(
        "Legacy Incomplete Match Provider", "072"
    )
    ready_provider_user = register_and_login("Ready Match Provider", "071")
    admin = register_and_login("Trust Approval Admin", "076")
    promote_user_to_admin(admin["user_id"])

    task = create_task(customer["token"])

    incomplete_response = client.post(
        "/api/providers/",
        headers=auth_headers(incomplete_provider_user["token"]),
        json={
            "business_name": "Workflow Test Incomplete Approved",
            "skill_category": "Cleaning",
            "city": "Bole",
            "bio": "",
            "experience_years": 0,
            "service_area": "",
            "availability": "",
            "contact_phone": "",
        },
    )
    assert incomplete_response.status_code == 200
    incomplete_provider = incomplete_response.json()
    assert incomplete_provider["trust_ready"] is False

    db = SessionLocal()
    try:
        legacy_provider = db.query(ProviderProfile).filter(
            ProviderProfile.id == incomplete_provider["id"]
        ).first()
        assert legacy_provider is not None
        legacy_provider.approval_status = "approved"
        db.commit()
    finally:
        db.close()

    ready_provider_response = client.post(
        "/api/providers/",
        headers=auth_headers(ready_provider_user["token"]),
        json={
            "business_name": "Workflow Test Ready Match",
            "skill_category": "Cleaning",
            "city": "Bole",
            "bio": "Experienced cleaner for apartments and small offices.",
            "experience_years": 3,
            "service_area": "Bole, CMC",
            "availability": "Weekdays and weekends",
            "contact_phone": "0912345678",
        },
    )
    assert ready_provider_response.status_code == 200
    ready_provider = ready_provider_response.json()
    assert ready_provider["trust_ready"] is True

    approval_response = client.patch(
        f"/api/providers/{ready_provider['id']}/approval",
        headers=auth_headers(admin["token"]),
        json={
            "status": "approved",
            "admin_notes": "Complete profile ready for matching.",
        },
    )
    assert approval_response.status_code == 200

    match_response = client.get(f"/api/providers/match/{task['id']}")
    assert match_response.status_code == 200
    matches = match_response.json()
    provider_names = {provider["business_name"] for provider in matches}

    assert "Workflow Test Ready Match" in provider_names
    assert "Workflow Test Incomplete Approved" not in provider_names
    assert all(provider["trust_ready"] is True for provider in matches)


def test_rejected_provider_can_resubmit_profile_for_review():
    provider_user = register_and_login("Provider Resubmit Flow", "0961")
    admin = register_and_login("Admin Resubmit Flow", "0962")
    promote_user_to_admin(admin["user_id"])

    provider = create_provider(provider_user["token"])

    rejection_response = client.patch(
        f"/api/providers/{provider['id']}/approval",
        headers=auth_headers(admin["token"]),
        json={
            "status": "rejected",
            "admin_notes": "Please add a stronger service area and contact details.",
        },
    )
    assert rejection_response.status_code == 200
    assert rejection_response.json()["approval_status"] == "rejected"

    resubmit_response = client.patch(
        "/api/providers/me",
        headers=auth_headers(provider_user["token"]),
        json={
            "business_name": "Workflow Test Cleaning Updated",
            "skill_category": "Cleaning",
            "city": "Bole",
            "bio": "Updated profile with more detail and customer references.",
            "experience_years": 5,
            "service_area": "Bole, CMC, Megenagna",
            "availability": "Weekdays, weekends, and evenings",
            "contact_phone": "0912999999",
        },
    )

    assert resubmit_response.status_code == 200
    body = resubmit_response.json()
    assert body["approval_status"] == "pending"
    assert body["admin_notes"] is None
    assert body["business_name"] == "Workflow Test Cleaning Updated"
    assert body["experience_years"] == 5


def test_customer_accepts_application_and_task_becomes_assigned():
    customer = register_and_login("Customer Accept Flow", "097")
    provider_user = register_and_login("Provider Accept Flow", "098")
    admin = register_and_login("Admin Accept Flow", "099")
    promote_user_to_admin(admin["user_id"])

    task = create_task(customer["token"])
    provider = create_provider(provider_user["token"])

    client.patch(
        f"/api/providers/{provider['id']}/approval?status=approved",
        headers=auth_headers(admin["token"]),
    )

    apply_response = client.post(
        "/api/applications/",
        headers=auth_headers(provider_user["token"]),
        json={"task_id": task["id"]},
    )
    assert apply_response.status_code == 200

    applications_response = client.get(
        f"/api/applications/task/{task['id']}",
        headers=auth_headers(customer["token"]),
    )
    assert applications_response.status_code == 200
    applications = applications_response.json()
    assert len(applications) == 1
    assert applications[0]["status"] == "pending"

    accept_response = client.patch(
        f"/api/applications/{applications[0]['application_id']}/status?status=accepted",
        headers=auth_headers(customer["token"]),
    )

    assert accept_response.status_code == 200
    assert accept_response.json()["status"] == "accepted"
    assert accept_response.json()["task_status"] == "assigned"


def test_full_task_flow_includes_completion_and_payment_tracking():
    customer = register_and_login("Customer Payment Flow", "087")
    provider_user = register_and_login("Provider Payment Flow", "088")
    admin = register_and_login("Admin Payment Flow", "086")
    promote_user_to_admin(admin["user_id"])

    task = create_task(customer["token"])
    provider = create_provider(provider_user["token"])

    approval_response = client.patch(
        f"/api/providers/{provider['id']}/approval?status=approved",
        headers=auth_headers(admin["token"]),
    )
    assert approval_response.status_code == 200

    apply_response = client.post(
        "/api/applications/",
        headers=auth_headers(provider_user["token"]),
        json={"task_id": task["id"]},
    )
    assert apply_response.status_code == 200

    application_id = apply_response.json()["id"]

    accept_response = client.patch(
        f"/api/applications/{application_id}/status?status=accepted",
        headers=auth_headers(customer["token"]),
    )
    assert accept_response.status_code == 200
    assert accept_response.json()["task_status"] == "assigned"

    provider_activity_response = client.get(
        "/api/applications/provider/me",
        headers=auth_headers(provider_user["token"]),
    )
    assert provider_activity_response.status_code == 200
    provider_activity = provider_activity_response.json()
    assert provider_activity[0]["status"] == "accepted"
    assert provider_activity[0]["task_payment_status"] == "unpaid"

    complete_response = client.patch(
        f"/api/tasks/{task['id']}/complete",
        headers=auth_headers(customer["token"]),
    )
    assert complete_response.status_code == 200
    assert complete_response.json()["status"] == "completed"

    provider_payment_response = client.patch(
        f"/api/tasks/{task['id']}/payment-status",
        headers=auth_headers(provider_user["token"]),
        json={"payment_status": "paid"},
    )
    assert provider_payment_response.status_code == 403

    payment_response = client.patch(
        f"/api/tasks/{task['id']}/payment-status",
        headers=auth_headers(customer["token"]),
        json={"payment_status": "paid"},
    )
    assert payment_response.status_code == 200
    assert payment_response.json()["payment_status"] == "paid"

    updated_provider_activity_response = client.get(
        "/api/applications/provider/me",
        headers=auth_headers(provider_user["token"]),
    )
    assert updated_provider_activity_response.status_code == 200
    assert updated_provider_activity_response.json()[0]["task_status"] == "completed"
    assert updated_provider_activity_response.json()[0]["task_payment_status"] == "paid"


def test_payment_status_rejects_invalid_values():
    customer = register_and_login("Customer Invalid Payment", "085")
    task = create_task(customer["token"])

    response = client.patch(
        f"/api/tasks/{task['id']}/payment-status",
        headers=auth_headers(customer["token"]),
        json={"payment_status": "refunded"},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Payment status must be unpaid, cash_agreed, paid, or disputed"


def test_non_owner_cannot_complete_customer_task():
    customer = register_and_login("Customer Complete Owner", "084")
    other_user = register_and_login("Other Complete User", "083")
    provider_user = register_and_login("Provider Complete Flow", "082")
    admin = register_and_login("Admin Complete Flow", "081")
    promote_user_to_admin(admin["user_id"])

    task = create_task(customer["token"])
    provider = create_provider(provider_user["token"])

    client.patch(
        f"/api/providers/{provider['id']}/approval?status=approved",
        headers=auth_headers(admin["token"]),
    )

    application = client.post(
        "/api/applications/",
        headers=auth_headers(provider_user["token"]),
        json={"task_id": task["id"]},
    )
    assert application.status_code == 200

    accept_response = client.patch(
        f"/api/applications/{application.json()['id']}/status?status=accepted",
        headers=auth_headers(customer["token"]),
    )
    assert accept_response.status_code == 200

    response = client.patch(
        f"/api/tasks/{task['id']}/complete",
        headers=auth_headers(other_user["token"]),
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Only the task owner can complete this task"


def test_messages_require_accepted_provider_and_participants():
    customer = register_and_login("Customer Message Pending", "077")
    provider_user = register_and_login("Provider Message Pending", "076")
    outsider = register_and_login("Message Outsider", "075")
    admin = register_and_login("Admin Message Pending", "074")
    promote_user_to_admin(admin["user_id"])

    task = create_task(customer["token"])
    provider = create_provider(provider_user["token"])

    client.patch(
        f"/api/providers/{provider['id']}/approval?status=approved",
        headers=auth_headers(admin["token"]),
    )

    pending_message_response = client.get(
        f"/api/messages/task/{task['id']}",
        headers=auth_headers(customer["token"]),
    )
    assert pending_message_response.status_code == 400
    assert pending_message_response.json()["detail"] == "Messages are available after a provider is accepted"

    application_response = client.post(
        "/api/applications/",
        headers=auth_headers(provider_user["token"]),
        json={"task_id": task["id"]},
    )
    assert application_response.status_code == 200

    accept_response = client.patch(
        f"/api/applications/{application_response.json()['id']}/status?status=accepted",
        headers=auth_headers(customer["token"]),
    )
    assert accept_response.status_code == 200

    outsider_response = client.get(
        f"/api/messages/task/{task['id']}",
        headers=auth_headers(outsider["token"]),
    )
    assert outsider_response.status_code == 403
    assert outsider_response.json()["detail"] == "Only the task customer and accepted provider can use messages"

    customer_message_response = client.post(
        f"/api/messages/task/{task['id']}",
        headers=auth_headers(customer["token"]),
        json={"body": "Please arrive after 10 AM."},
    )
    assert customer_message_response.status_code == 200
    assert customer_message_response.json()["body"] == "Please arrive after 10 AM."

    provider_messages_response = client.get(
        f"/api/messages/task/{task['id']}",
        headers=auth_headers(provider_user["token"]),
    )
    assert provider_messages_response.status_code == 200
    assert provider_messages_response.json()[0]["body"] == "Please arrive after 10 AM."


def test_review_requires_completed_task_and_only_once():
    flow = create_assigned_task_flow()
    customer = flow["customer"]
    provider_user = flow["provider_user"]
    provider = flow["provider"]
    task = flow["task"]

    early_review_response = client.post(
        "/api/reviews/",
        headers=auth_headers(customer["token"]),
        json={
            "task_id": task["id"],
            "rating": 5,
            "comment": "Too early",
            "status_note": "Not completed yet",
        },
    )
    assert early_review_response.status_code == 400
    assert early_review_response.json()["detail"] == "Only completed tasks can be reviewed"

    complete_response = client.patch(
        f"/api/tasks/{task['id']}/complete",
        headers=auth_headers(customer["token"]),
    )
    assert complete_response.status_code == 200

    provider_review_response = client.post(
        "/api/reviews/",
        headers=auth_headers(provider_user["token"]),
        json={
            "task_id": task["id"],
            "rating": 5,
            "comment": "Provider cannot review own work",
            "status_note": "Wrong user",
        },
    )
    assert provider_review_response.status_code == 403
    assert provider_review_response.json()["detail"] == "Only the task owner can review this provider"

    review_response = client.post(
        "/api/reviews/",
        headers=auth_headers(customer["token"]),
        json={
            "task_id": task["id"],
            "rating": 5,
            "comment": "Great communication and clean work.",
            "status_note": "Customer confirmed completion",
        },
    )
    assert review_response.status_code == 200
    assert review_response.json()["provider_id"] == provider["id"]
    assert review_response.json()["rating"] == 5

    provider_reviews_response = client.get(f"/api/reviews/provider/{provider['id']}")
    assert provider_reviews_response.status_code == 200
    assert provider_reviews_response.json()[0]["comment"] == "Great communication and clean work."

    duplicate_review_response = client.post(
        "/api/reviews/",
        headers=auth_headers(customer["token"]),
        json={
            "task_id": task["id"],
            "rating": 4,
            "comment": "Trying again",
            "status_note": "Duplicate",
        },
    )
    assert duplicate_review_response.status_code == 400
    assert duplicate_review_response.json()["detail"] == "This task already has a review"


def test_user_cannot_apply_to_own_task():
    user = register_and_login("Self Apply User", "090")
    admin = register_and_login("Self Apply Admin", "089")
    promote_user_to_admin(admin["user_id"])

    task = create_task(user["token"])
    provider = create_provider(user["token"])

    client.patch(
        f"/api/providers/{provider['id']}/approval?status=approved",
        headers=auth_headers(admin["token"]),
    )

    response = client.post(
        "/api/applications/",
        headers=auth_headers(user["token"]),
        json={"task_id": task["id"]},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "You cannot apply to your own task"
