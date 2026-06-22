from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    task_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = None
    status_note: str | None = None


class ReviewResponse(BaseModel):
    id: int
    task_id: int
    provider_id: int
    customer_id: int
    rating: int
    comment: str | None
    status_note: str | None

    class Config:
        from_attributes = True
