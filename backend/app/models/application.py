from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)

    status = Column(String(30), nullable=False, default="pending")

    created_at = Column(DateTime(timezone=True), server_default=func.now())