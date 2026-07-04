from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base


class ProviderProfile(Base):
    __tablename__ = "provider_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    business_name = Column(String(150), nullable=False)
    skill_category = Column(String(80), nullable=False)
    city = Column(String(80), nullable=False, default="Addis Ababa")
    approval_status = Column(String(30), nullable=False, default="pending")
    bio = Column(String(500), nullable=True)
    experience_years = Column(Integer, nullable=False, default=0)
    service_area = Column(String(200), nullable=True)
    availability = Column(String(120), nullable=True)
    contact_phone = Column(String(30), nullable=True)
    id_verification_status = Column(String(30), nullable=False, default="not_submitted")
    admin_notes = Column(String(500), nullable=True)

    rating = Column(Float, default=0.0)
    completed_tasks = Column(Integer, default=0)
    response_time_minutes = Column(Integer, default=60)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
