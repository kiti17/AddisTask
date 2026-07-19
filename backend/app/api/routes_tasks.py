from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskPaymentUpdate

from fastapi import HTTPException
from app.models.application import Application
from app.models.provider import ProviderProfile
from app.models.user import User
from app.core.security import get_current_user

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


PAYMENT_STATUSES = {"unpaid", "cash_agreed", "paid", "disputed"}


@router.post("/")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_task = Task(
        title=task.title,
        description=task.description,
        category=task.category,
        location=task.location,
        budget=task.budget,
        customer_id=current_user.id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@router.get("/")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).filter(Task.status != "archived").all()


@router.patch("/{task_id}/complete")
def complete_task(
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
            detail="Only the task owner can complete this task"
        )

    if task.status != "assigned":
        raise HTTPException(
            status_code=400,
            detail="Only assigned tasks can be completed"
        )

    accepted_application = db.query(Application).filter(
        Application.task_id == task.id,
        Application.status == "accepted"
    ).first()

    if accepted_application:
        provider = db.query(ProviderProfile).filter(
            ProviderProfile.id == accepted_application.provider_id
        ).first()

        if provider:
            provider.completed_tasks = (provider.completed_tasks or 0) + 1

    task.status = "completed"
    db.commit()
    db.refresh(task)

    return task


@router.patch("/{task_id}/payment-status")
def update_task_payment_status(
    task_id: int,
    payment: TaskPaymentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if payment.payment_status not in PAYMENT_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Payment status must be unpaid, cash_agreed, paid, or disputed"
        )

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.customer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the task owner can update payment status"
        )

    task.payment_status = payment.payment_status
    db.commit()
    db.refresh(task)

    return task
