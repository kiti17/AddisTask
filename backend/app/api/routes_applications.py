from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.application import Application
from app.models.provider import ProviderProfile
from app.models.task import Task
from app.models.user import User
from app.schemas.application import ApplicationCreate
from app.core.security import get_current_user


router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.post("/")
def apply_to_task(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    provider = db.query(ProviderProfile).filter(
        ProviderProfile.user_id == current_user.id
    ).first()

    if not provider:
        raise HTTPException(
            status_code=400,
            detail="You must create a provider profile before applying to tasks"
        )

    if provider.approval_status != "approved":
        raise HTTPException(
            status_code=403,
            detail="Your provider profile must be approved before you can apply to tasks"
        )

    task = db.query(Task).filter(Task.id == application.task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.customer_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot apply to your own task"
        )

    if task.status != "open":
        raise HTTPException(
            status_code=400,
            detail="Providers can only apply to open tasks"
        )

    if provider.skill_category.lower() != task.category.lower():
        raise HTTPException(
            status_code=400,
            detail="Provider skill does not match this task category"
        )

    existing_application = db.query(Application).filter(
        Application.task_id == application.task_id,
        Application.provider_id == provider.id
    ).first()

    if existing_application:
        raise HTTPException(
            status_code=400,
            detail="You already applied to this task"
        )

    new_application = Application(
        task_id=application.task_id,
        provider_id=provider.id,
        status="pending"
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application


@router.get("/customer/me")
def get_my_customer_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tasks = db.query(Task).filter(Task.customer_id == current_user.id).all()
    task_ids = [task.id for task in tasks]

    if not task_ids:
        return []

    applications = db.query(Application).filter(
        Application.task_id.in_(task_ids)
    ).all()

    result = []

    for app in applications:
        task = next((item for item in tasks if item.id == app.task_id), None)
        provider = db.query(ProviderProfile).filter(
            ProviderProfile.id == app.provider_id
        ).first()

        result.append({
            "application_id": app.id,
            "task_id": app.task_id,
            "status": app.status,
            "task_title": task.title if task else None,
            "task_status": task.status if task else None,
            "task_payment_status": task.payment_status if task else None,
            "provider_id": provider.id if provider else None,
            "business_name": provider.business_name if provider else None,
            "skill_category": provider.skill_category if provider else None,
            "city": provider.city if provider else None,
            "rating": provider.rating if provider else None,
            "completed_tasks": provider.completed_tasks if provider else None,
            "response_time_minutes": provider.response_time_minutes if provider else None,
            "created_at": app.created_at
        })

    return result


@router.get("/provider/me")
def get_my_provider_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    provider = db.query(ProviderProfile).filter(
        ProviderProfile.user_id == current_user.id
    ).first()

    if not provider:
        raise HTTPException(
            status_code=400,
            detail="Create a provider profile before viewing applications"
        )

    applications = db.query(Application).filter(
        Application.provider_id == provider.id
    ).all()

    result = []

    for app in applications:
        task = db.query(Task).filter(Task.id == app.task_id).first()

        result.append({
            "application_id": app.id,
            "task_id": app.task_id,
            "status": app.status,
            "task_title": task.title if task else None,
            "task_category": task.category if task else None,
            "task_location": task.location if task else None,
            "task_budget": task.budget if task else None,
            "task_status": task.status if task else None,
            "task_payment_status": task.payment_status if task else None,
            "created_at": app.created_at
        })

    return result


@router.get("/task/{task_id}")
def get_applications_for_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.customer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the task owner can view applications for this task"
        )

    applications = db.query(Application).filter(
        Application.task_id == task_id
    ).all()

    result = []

    for app in applications:
        provider = db.query(ProviderProfile).filter(
            ProviderProfile.id == app.provider_id
        ).first()

        result.append({
            "application_id": app.id,
            "task_id": app.task_id,
            "status": app.status,
            "provider_id": provider.id if provider else None,
            "business_name": provider.business_name if provider else None,
            "skill_category": provider.skill_category if provider else None,
            "city": provider.city if provider else None,
            "rating": provider.rating if provider else None,
            "completed_tasks": provider.completed_tasks if provider else None,
            "response_time_minutes": provider.response_time_minutes if provider else None
        })

    return result


@router.patch("/{application_id}/status")
def update_application_status(
    application_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    task = db.query(Task).filter(Task.id == application.task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.customer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the task owner can update application status"
        )

    if status not in ["pending", "accepted", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be pending, accepted, or rejected"
        )

    if status == "accepted" and task.status != "open":
        raise HTTPException(
            status_code=400,
            detail="Only open tasks can accept a provider"
        )

    application.status = status

    if status == "accepted":
        task.status = "assigned"
        other_applications = db.query(Application).filter(
            Application.task_id == application.task_id,
            Application.id != application.id,
            Application.status == "pending"
        ).all()

        for other_application in other_applications:
            other_application.status = "rejected"

    db.commit()
    db.refresh(application)

    return {
        "application_id": application.id,
        "task_id": application.task_id,
        "provider_id": application.provider_id,
        "status": application.status,
        "task_status": task.status
    }
