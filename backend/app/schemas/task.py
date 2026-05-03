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

    class Config:
        from_attributes = True