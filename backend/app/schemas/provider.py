from pydantic import BaseModel


class ProviderCreate(BaseModel):
    business_name: str
    skill_category: str
    city: str


class ProviderResponse(BaseModel):
    id: int
    business_name: str
    skill_category: str
    city: str
    rating: float

    class Config:
        from_attributes = True