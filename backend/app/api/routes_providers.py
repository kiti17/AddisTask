from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.provider import ProviderProfile
from app.models.task import Task
from app.models.user import User
from app.schemas.provider import ProviderApprovalUpdate, ProviderCreate, ProviderUpdate
from app.core.security import get_current_admin_user, get_current_user

router = APIRouter(prefix="/api/providers", tags=["providers"])


def provider_to_dict(provider: ProviderProfile):
    return {
        "id": provider.id,
        "user_id": provider.user_id,
        "business_name": provider.business_name,
        "skill_category": provider.skill_category,
        "city": provider.city,
        "bio": provider.bio,
        "experience_years": provider.experience_years,
        "service_area": provider.service_area,
        "availability": provider.availability,
        "contact_phone": provider.contact_phone,
        "id_verification_status": provider.id_verification_status,
        "admin_notes": provider.admin_notes,
        "rating": provider.rating,
        "completed_tasks": provider.completed_tasks,
        "response_time_minutes": provider.response_time_minutes,
        "approval_status": provider.approval_status
    }


def calculate_score(provider: ProviderProfile, task: Task | None = None):
    score = 0

    # Provider quality
    score += provider.rating * 20
    score += provider.completed_tasks * 2
    score -= provider.response_time_minutes * 0.2

    # Task matching
    if task:
        if provider.skill_category.lower() == task.category.lower():
            score += 30

        if provider.city.lower() == task.location.lower():
            score += 20

    return round(score, 2)


@router.post("/")
def create_provider(
    provider: ProviderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_provider = db.query(ProviderProfile).filter(
        ProviderProfile.user_id == current_user.id
    ).first()

    if existing_provider:
        raise HTTPException(
            status_code=400,
            detail="Provider profile already exists for this user"
        )

    new_provider = ProviderProfile(
        user_id=current_user.id,
        business_name=provider.business_name,
        skill_category=provider.skill_category,
        city=provider.city,
        bio=provider.bio,
        experience_years=max(provider.experience_years, 0),
        service_area=provider.service_area,
        availability=provider.availability,
        contact_phone=provider.contact_phone,
        id_verification_status="submitted" if provider.contact_phone else "not_submitted",
        approval_status="pending",
        rating=4.5,
        completed_tasks=10,
        response_time_minutes=30
    )

    db.add(new_provider)
    db.commit()
    db.refresh(new_provider)

    return new_provider


@router.get("/me")
def get_my_provider_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    provider = db.query(ProviderProfile).filter(
        ProviderProfile.user_id == current_user.id
    ).first()

    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")

    return provider_to_dict(provider)


@router.patch("/me")
def update_my_provider_profile(
    provider_update: ProviderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    provider = db.query(ProviderProfile).filter(
        ProviderProfile.user_id == current_user.id
    ).first()

    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")

    provider.business_name = provider_update.business_name
    provider.skill_category = provider_update.skill_category
    provider.city = provider_update.city
    provider.bio = provider_update.bio
    provider.experience_years = max(provider_update.experience_years, 0)
    provider.service_area = provider_update.service_area
    provider.availability = provider_update.availability
    provider.contact_phone = provider_update.contact_phone
    provider.id_verification_status = (
        "submitted" if provider_update.contact_phone else "not_submitted"
    )
    provider.approval_status = "pending"
    provider.admin_notes = None

    db.commit()
    db.refresh(provider)

    return provider_to_dict(provider)


@router.get("/verification-queue")
def get_provider_verification_queue(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    providers = db.query(ProviderProfile).filter(
        ProviderProfile.approval_status == "pending"
    ).all()

    return [provider_to_dict(provider) for provider in providers]


@router.patch("/{provider_id}/approval")
def update_provider_approval_status(
    provider_id: int,
    review: ProviderApprovalUpdate | None = None,
    status: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    approval_status = review.status if review else status
    admin_notes = review.admin_notes if review else None

    if approval_status not in ["pending", "approved", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be pending, approved, or rejected"
        )

    provider = db.query(ProviderProfile).filter(
        ProviderProfile.id == provider_id
    ).first()

    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")

    provider.approval_status = approval_status
    provider.admin_notes = admin_notes.strip() if admin_notes else None
    db.commit()
    db.refresh(provider)

    return {
        "id": provider.id,
        "approval_status": provider.approval_status,
        "admin_notes": provider.admin_notes
    }


@router.get("/ranked")
def get_ranked_providers(db: Session = Depends(get_db)):
    providers = db.query(ProviderProfile).filter(
        ProviderProfile.approval_status == "approved"
    ).all()

    ranked = sorted(
        providers,
        key=lambda p: calculate_score(p),
        reverse=True
    )

    return [
        {
            "business_name": p.business_name,
            "rating": p.rating,
            "score": calculate_score(p)
        }
        for p in ranked
    ]

@router.get("/match/{task_id}")
def match_providers_for_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    providers = db.query(ProviderProfile).filter(
    ProviderProfile.skill_category.ilike(task.category),
    ProviderProfile.city.ilike(task.location),
    ProviderProfile.approval_status == "approved"
    ).all()
    
    ranked = sorted(
        providers,
        key=lambda p: calculate_score(p, task),
        reverse=True
    )

    return [
        {
            "provider_id": p.id,
            "business_name": p.business_name,
            "skill_category": p.skill_category,
            "city": p.city,
            "rating": p.rating,
            "bio": p.bio,
            "experience_years": p.experience_years,
            "service_area": p.service_area,
            "availability": p.availability,
            "id_verification_status": p.id_verification_status,
            "completed_tasks": p.completed_tasks,
            "response_time_minutes": p.response_time_minutes,
            "approval_status": p.approval_status,
            "match_score": calculate_score(p, task),
            "category_match": p.skill_category.lower() == task.category.lower(),
            "city_match": p.city.lower() == task.location.lower()
        }
        for p in ranked
    ]

@router.get("/")
def get_providers(db: Session = Depends(get_db)):
    providers = db.query(ProviderProfile).all()

    return [provider_to_dict(p) for p in providers]
