from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    task_id: int


class ApplicationResponse(BaseModel):
    id: int
    task_id: int
    provider_id: int
    status: str

    class Config:
        from_attributes = True