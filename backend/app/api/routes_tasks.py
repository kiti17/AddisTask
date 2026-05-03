from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate

from app.models.user import User
from app.core.security import get_current_user

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


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
    return db.query(Task).all()