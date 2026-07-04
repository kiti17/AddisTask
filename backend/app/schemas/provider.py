from pydantic import BaseModel


class ProviderCreate(BaseModel):
    business_name: str
    skill_category: str
    city: str
    bio: str | None = None
    experience_years: int = 0
    service_area: str | None = None
    availability: str | None = None
    contact_phone: str | None = None


class ProviderUpdate(ProviderCreate):
    pass


class ProviderResponse(BaseModel):
    id: int
    business_name: str
    skill_category: str
    city: str
    rating: float
    bio: str | None = None
    experience_years: int = 0
    service_area: str | None = None
    availability: str | None = None
    contact_phone: str | None = None
    id_verification_status: str = "not_submitted"
    admin_notes: str | None = None
    approval_status: str = "pending"

    class Config:
        from_attributes = True


class ProviderApprovalUpdate(BaseModel):
    status: str
    admin_notes: str | None = None
