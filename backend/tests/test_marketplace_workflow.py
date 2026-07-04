from uuid import uuid4

from fastapi.testclient import TestClient

from app.db.database import SessionLocal
from app.main import app
from app.models.user import User


client = TestClient(app)


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
    return body


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
