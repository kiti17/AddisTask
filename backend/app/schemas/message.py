from pydantic import BaseModel, Field


class MessageCreate(BaseModel):
    body: str = Field(min_length=1, max_length=1000)


class MessageResponse(BaseModel):
    id: int
    task_id: int
    sender_id: int
    recipient_id: int
    body: str

    class Config:
        from_attributes = True
