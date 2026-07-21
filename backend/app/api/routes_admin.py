import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.security import get_current_admin_user
from app.db.database import get_db
from app.models.admin_audit import AdminAuditLog
from app.models.application import Application
from app.models.message import TaskMessage
from app.models.provider import ProviderProfile
from app.models.review import Review
from app.models.task import Task
from app.models.user import User


router = APIRouter(prefix="/api/admin", tags=["admin"])

ARCHIVED_TASK_STATUS = "archived"
RESTORABLE_TASK_STATUSES = {"open", "assigned", "completed"}


class TaskArchiveRequest(BaseModel):
    reason: str | None = None


class ProviderReminderRequest(BaseModel):
    message: str | None = None


WORKFLOW_TEST_USER_NAMES = {
    "Identity Test User",
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
}

WORKFLOW_TEST_TASK_TITLES = {"Test apartment cleaning"}
WORKFLOW_TEST_PROVIDER_NAMES = {
    "Workflow Test Cleaning",
    "Workflow Test Cleaning Updated",
}


def parse_audit_details(details):
    if not details:
        return {}

    try:
        return json.loads(details)
    except json.JSONDecodeError:
        return {}


def provider_missing_trust_requirements(provider: ProviderProfile):
    missing = []

    if not provider.bio or len(provider.bio.strip()) < 20:
        missing.append("Profile bio")

    if (provider.experience_years or 0) <= 0:
        missing.append("Experience")

    if not provider.service_area or not provider.service_area.strip():
        missing.append("Service areas")

    if not provider.availability or not provider.availability.strip():
        missing.append("Availability")

    if not provider.contact_phone or not provider.contact_phone.strip():
        missing.append("Contact phone")

    if provider.id_verification_status != "submitted":
        missing.append("ID submitted")

    return missing


def id_list(query):
    return [item_id for (item_id,) in query.all()]


def get_workflow_test_candidates(db: Session):
    user_ids = id_list(
        db.query(User.id).filter(User.full_name.in_(WORKFLOW_TEST_USER_NAMES))
    )

    task_filters = [Task.title.in_(WORKFLOW_TEST_TASK_TITLES)]
    provider_filters = [ProviderProfile.business_name.in_(WORKFLOW_TEST_PROVIDER_NAMES)]

    if user_ids:
        task_filters.append(Task.customer_id.in_(user_ids))
        provider_filters.append(ProviderProfile.user_id.in_(user_ids))

    task_ids = id_list(db.query(Task.id).filter(or_(*task_filters)))
    provider_ids = id_list(db.query(ProviderProfile.id).filter(or_(*provider_filters)))

    application_filters = []
    message_filters = []
    review_filters = []

    if task_ids:
        application_filters.append(Application.task_id.in_(task_ids))
        message_filters.append(TaskMessage.task_id.in_(task_ids))
        review_filters.append(Review.task_id.in_(task_ids))

    if provider_ids:
        application_filters.append(Application.provider_id.in_(provider_ids))
        review_filters.append(Review.provider_id.in_(provider_ids))

    if user_ids:
        message_filters.extend([
            TaskMessage.sender_id.in_(user_ids),
            TaskMessage.recipient_id.in_(user_ids),
        ])
        review_filters.append(Review.customer_id.in_(user_ids))

    application_ids = (
        id_list(db.query(Application.id).filter(or_(*application_filters)))
        if application_filters
        else []
    )
    message_ids = (
        id_list(db.query(TaskMessage.id).filter(or_(*message_filters)))
        if message_filters
        else []
    )
    review_ids = (
        id_list(db.query(Review.id).filter(or_(*review_filters)))
        if review_filters
        else []
    )

    return {
        "users": user_ids,
        "tasks": task_ids,
        "providers": provider_ids,
        "applications": application_ids,
        "messages": message_ids,
        "reviews": review_ids,
    }


def candidate_counts(candidates):
    return {key: len(value) for key, value in candidates.items()}


def data_summary(db: Session):
    return {
        "users": db.query(User).count(),
        "tasks": db.query(Task).count(),
        "active_tasks": db.query(Task).filter(Task.status != ARCHIVED_TASK_STATUS).count(),
        "archived_tasks": db.query(Task).filter(Task.status == ARCHIVED_TASK_STATUS).count(),
        "providers": db.query(ProviderProfile).count(),
        "applications": db.query(Application).count(),
        "messages": db.query(TaskMessage).count(),
        "reviews": db.query(Review).count(),
        "open_tasks": db.query(Task).filter(Task.status == "open").count(),
        "assigned_tasks": db.query(Task).filter(Task.status == "assigned").count(),
        "completed_tasks": db.query(Task).filter(Task.status == "completed").count(),
        "pending_providers": db.query(ProviderProfile).filter(
            ProviderProfile.approval_status == "pending"
        ).count(),
        "approved_providers": db.query(ProviderProfile).filter(
            ProviderProfile.approval_status == "approved"
        ).count(),
    }


def create_admin_audit_log(
    db: Session,
    current_user: User,
    action: str,
    entity_type: str,
    entity_id: int | None,
    details: dict,
):
    audit_log = AdminAuditLog(
        admin_id=current_user.id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=json.dumps(details),
    )
    db.add(audit_log)
    return audit_log


def latest_task_archive_log(db: Session, task_id: int):
    return (
        db.query(AdminAuditLog)
        .filter(
            AdminAuditLog.entity_type == "task",
            AdminAuditLog.entity_id == task_id,
            AdminAuditLog.action == "archive_task",
        )
        .order_by(AdminAuditLog.created_at.desc(), AdminAuditLog.id.desc())
        .first()
    )


def serialize_archived_task(db: Session, task: Task):
    archive_log = latest_task_archive_log(db, task.id)
    details = parse_audit_details(archive_log.details if archive_log else None)

    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "category": task.category,
        "location": task.location,
        "budget": task.budget,
        "status": task.status,
        "payment_status": task.payment_status,
        "customer_id": task.customer_id,
        "created_at": task.created_at,
        "archive_reason": details.get("reason") or "No reason provided",
        "previous_status": details.get("previous_status") or "open",
        "archived_at": archive_log.created_at if archive_log else None,
        "archived_by": archive_log.admin_id if archive_log else None,
    }


@router.get("/data-health")
def get_admin_data_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    candidates = get_workflow_test_candidates(db)

    return {
        "summary": data_summary(db),
        "workflow_test_candidates": candidate_counts(candidates),
    }


@router.get("/tasks/archived")
def get_archived_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    tasks = (
        db.query(Task)
        .filter(Task.status == ARCHIVED_TASK_STATUS)
        .order_by(Task.created_at.desc(), Task.id.desc())
        .all()
    )

    return [serialize_archived_task(db, task) for task in tasks]


@router.get("/audit-log")
def get_admin_audit_log(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    safe_limit = min(max(limit, 1), 50)
    logs = (
        db.query(AdminAuditLog)
        .order_by(AdminAuditLog.created_at.desc(), AdminAuditLog.id.desc())
        .limit(safe_limit)
        .all()
    )

    return [
        {
            "id": log.id,
            "admin_id": log.admin_id,
            "action": log.action,
            "entity_type": log.entity_type,
            "entity_id": log.entity_id,
            "details": parse_audit_details(log.details),
            "created_at": log.created_at,
        }
        for log in logs
    ]


@router.post("/providers/{provider_id}/reminder")
def record_provider_reminder(
    provider_id: int,
    reminder_request: ProviderReminderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    provider = db.query(ProviderProfile).filter(ProviderProfile.id == provider_id).first()

    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")

    message = (reminder_request.message or "").strip() or "Provider reminder sent"
    audit_log = create_admin_audit_log(
        db,
        current_user,
        "remind_provider",
        "provider",
        provider.id,
        {
            "business_name": provider.business_name,
            "message": message,
            "missing_trust_requirements": provider_missing_trust_requirements(provider),
            "admin_name": current_user.full_name,
        },
    )
    db.commit()
    db.refresh(audit_log)

    return {
        "id": audit_log.id,
        "admin_id": audit_log.admin_id,
        "action": audit_log.action,
        "entity_type": audit_log.entity_type,
        "entity_id": audit_log.entity_id,
        "details": parse_audit_details(audit_log.details),
        "created_at": audit_log.created_at,
    }


@router.patch("/tasks/{task_id}/archive")
def archive_task(
    task_id: int,
    archive_request: TaskArchiveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.status == ARCHIVED_TASK_STATUS:
        raise HTTPException(status_code=400, detail="Task is already archived")

    previous_status = task.status
    reason = (archive_request.reason or "").strip() or "Archived by admin"

    task.status = ARCHIVED_TASK_STATUS
    create_admin_audit_log(
        db,
        current_user,
        "archive_task",
        "task",
        task.id,
        {
            "title": task.title,
            "previous_status": previous_status,
            "reason": reason,
            "admin_name": current_user.full_name,
        },
    )
    db.commit()
    db.refresh(task)

    return {
        "task": serialize_archived_task(db, task),
        "summary": data_summary(db),
    }


@router.patch("/tasks/{task_id}/restore")
def restore_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.status != ARCHIVED_TASK_STATUS:
        raise HTTPException(status_code=400, detail="Only archived tasks can be restored")

    archive_log = latest_task_archive_log(db, task.id)
    archive_details = parse_audit_details(archive_log.details if archive_log else None)
    restored_status = archive_details.get("previous_status", "open")

    if restored_status not in RESTORABLE_TASK_STATUSES:
        restored_status = "open"

    task.status = restored_status
    create_admin_audit_log(
        db,
        current_user,
        "restore_task",
        "task",
        task.id,
        {
            "title": task.title,
            "restored_status": restored_status,
            "admin_name": current_user.full_name,
        },
    )
    db.commit()
    db.refresh(task)

    return {
        "task": task,
        "summary": data_summary(db),
    }


@router.post("/cleanup-workflow-tests")
def cleanup_workflow_tests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    candidates = get_workflow_test_candidates(db)
    deleted = {}

    delete_order = [
        ("audit_logs", AdminAuditLog),
        ("messages", TaskMessage),
        ("reviews", Review),
        ("applications", Application),
        ("providers", ProviderProfile),
        ("tasks", Task),
        ("users", User),
    ]

    for key, model in delete_order:
        if key == "audit_logs":
            audit_filters = []
            deleted[key] = 0

            if candidates["tasks"]:
                audit_filters.append(
                    (model.entity_type == "task")
                    & (model.entity_id.in_(candidates["tasks"]))
                )

            if candidates["providers"]:
                audit_filters.append(
                    (model.entity_type == "provider")
                    & (model.entity_id.in_(candidates["providers"]))
                )

            if candidates["users"]:
                audit_filters.append(model.admin_id.in_(candidates["users"]))

            if audit_filters:
                deleted[key] = db.query(model).filter(or_(*audit_filters)).delete(
                    synchronize_session=False
                )

            continue

        ids = candidates[key]
        deleted[key] = 0

        if ids:
            deleted[key] = db.query(model).filter(model.id.in_(ids)).delete(
                synchronize_session=False
            )

    db.commit()

    return {
        "deleted": deleted,
        "summary": data_summary(db),
        "workflow_test_candidates": candidate_counts(get_workflow_test_candidates(db)),
    }
