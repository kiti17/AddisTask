from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func
from app.db.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), unique=True, nullable=False)
    provider_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    status_note = Column(String(120), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
