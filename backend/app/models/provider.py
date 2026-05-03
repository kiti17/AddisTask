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

    rating = Column(Float, default=0.0)
    completed_tasks = Column(Integer, default=0)
    response_time_minutes = Column(Integer, default=60)

    created_at = Column(DateTime(timezone=True), server_default=func.now())