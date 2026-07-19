from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    full_name: str
    phone: str
    password: str = Field(..., min_length=6, max_length=72)


class UserLogin(BaseModel):
    phone: str
    password: str = Field(..., min_length=6, max_length=72)


class UserPasswordChange(BaseModel):
    current_password: str = Field(..., min_length=6, max_length=72)
    new_password: str = Field(..., min_length=6, max_length=72)


class UserResponse(BaseModel):
    id: int
    full_name: str
    phone: str

    class Config:
        from_attributes = True
