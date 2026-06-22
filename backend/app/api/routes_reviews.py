from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.application import Application
from app.models.provider import ProviderProfile
from app.models.review import Review
from app.models.task import Task
from app.models.user import User
from app.schemas.review import ReviewCreate


router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.post("/")
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == review.task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.customer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the task owner can review this provider"
        )

    if task.status != "completed":
        raise HTTPException(
            status_code=400,
            detail="Only completed tasks can be reviewed"
        )

    existing_review = db.query(Review).filter(
        Review.task_id == review.task_id
    ).first()

    if existing_review:
        raise HTTPException(
            status_code=400,
            detail="This task already has a review"
        )

    accepted_application = db.query(Application).filter(
        Application.task_id == review.task_id,
        Application.status == "accepted"
    ).first()

    if not accepted_application:
        raise HTTPException(
            status_code=400,
            detail="No accepted provider found for this task"
        )

    provider = db.query(ProviderProfile).filter(
        ProviderProfile.id == accepted_application.provider_id
    ).first()

    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    new_review = Review(
        task_id=review.task_id,
        provider_id=provider.id,
        customer_id=current_user.id,
        rating=review.rating,
        comment=review.comment,
        status_note=review.status_note
    )

    db.add(new_review)
    db.flush()

    average_rating = db.query(func.avg(Review.rating)).filter(
        Review.provider_id == provider.id
    ).scalar()

    provider.rating = round(float(average_rating), 2)

    db.commit()
    db.refresh(new_review)

    return new_review


@router.get("/provider/{provider_id}")
def get_provider_reviews(
    provider_id: int,
    db: Session = Depends(get_db)
):
    reviews = db.query(Review).filter(
        Review.provider_id == provider_id
    ).order_by(Review.created_at.desc()).all()

    return reviews
