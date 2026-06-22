from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.application import Application
from app.models.message import TaskMessage
from app.models.provider import ProviderProfile
from app.models.task import Task
from app.models.user import User
from app.schemas.message import MessageCreate


router = APIRouter(prefix="/api/messages", tags=["messages"])


def get_task_participants(task_id: int, db: Session):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    accepted_application = db.query(Application).filter(
        Application.task_id == task_id,
        Application.status == "accepted"
    ).first()

    if not accepted_application:
        raise HTTPException(
            status_code=400,
            detail="Messages are available after a provider is accepted"
        )

    provider = db.query(ProviderProfile).filter(
        ProviderProfile.id == accepted_application.provider_id
    ).first()

    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    return task, provider


def ensure_message_participant(task_id: int, current_user: User, db: Session):
    task, provider = get_task_participants(task_id, db)
    participant_ids = {task.customer_id, provider.user_id}

    if current_user.id not in participant_ids:
        raise HTTPException(
            status_code=403,
            detail="Only the task customer and accepted provider can use messages"
        )

    recipient_id = provider.user_id if current_user.id == task.customer_id else task.customer_id

    return task, recipient_id


@router.get("/task/{task_id}")
def get_task_messages(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_message_participant(task_id, current_user, db)

    return db.query(TaskMessage).filter(
        TaskMessage.task_id == task_id
    ).order_by(TaskMessage.created_at.asc()).all()


@router.post("/task/{task_id}")
def create_task_message(
    task_id: int,
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task, recipient_id = ensure_message_participant(task_id, current_user, db)

    new_message = TaskMessage(
        task_id=task.id,
        sender_id=current_user.id,
        recipient_id=recipient_id,
        body=message.body.strip()
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return new_message
