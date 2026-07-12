from datetime import datetime

from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: str
    category: str
    location: str
    budget: float | None = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    location: str
    budget: float | None
    status: str
    payment_status: str = "unpaid"
    customer_id: int
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class TaskPaymentUpdate(BaseModel):
    payment_status: str
