import time

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserPasswordChange
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)


router = APIRouter(prefix="/api/auth", tags=["auth"])

MAX_FAILED_LOGIN_ATTEMPTS = 5
FAILED_LOGIN_WINDOW_SECONDS = 15 * 60

failed_login_attempts = {}


def normalize_phone(phone: str) -> str:
    return (phone or "").strip()


def get_failed_login_record(phone: str):
    now = time.monotonic()
    record = failed_login_attempts.get(phone)

    if record and now - record["first_attempt_at"] <= FAILED_LOGIN_WINDOW_SECONDS:
        return record

    failed_login_attempts.pop(phone, None)
    return None


def is_login_limited(phone: str) -> bool:
    record = get_failed_login_record(phone)
    return bool(record and record["count"] >= MAX_FAILED_LOGIN_ATTEMPTS)


def record_failed_login(phone: str):
    now = time.monotonic()
    record = get_failed_login_record(phone)

    if not record:
        failed_login_attempts[phone] = {
            "count": 1,
            "first_attempt_at": now,
        }
        return

    record["count"] += 1


def clear_failed_login_attempts(phone: str):
    failed_login_attempts.pop(phone, None)


def reset_auth_rate_limits():
    failed_login_attempts.clear()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    clean_phone = normalize_phone(user.phone)
    existing_user = db.query(User).filter(User.phone == clean_phone).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Phone already registered")

    new_user = User(
        full_name=user.full_name.strip(),
        phone=clean_phone,
        hashed_password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    clean_phone = normalize_phone(user.phone)

    if is_login_limited(clean_phone):
        raise HTTPException(
            status_code=429,
            detail="Too many failed login attempts. Try again later.",
        )

    db_user = db.query(User).filter(User.phone == clean_phone).first()

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        record_failed_login(clean_phone)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    clear_failed_login_attempts(clean_phone)
    token = create_access_token({"sub": str(db_user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": db_user.id,
        "full_name": db_user.full_name,
        "phone": db_user.phone,
        "role": db_user.role
    }


@router.patch("/password")
def change_password(
    password_change: UserPasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(
        password_change.current_password,
        current_user.hashed_password,
    ):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if verify_password(
        password_change.new_password,
        current_user.hashed_password,
    ):
        raise HTTPException(status_code=400, detail="New password must be different")

    current_user.hashed_password = hash_password(password_change.new_password)
    db.commit()

    return {"message": "Password updated successfully"}


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "user_id": current_user.id,
        "full_name": current_user.full_name,
        "phone": current_user.phone,
        "role": current_user.role
    }
