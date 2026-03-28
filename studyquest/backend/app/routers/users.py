from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.user import UserResponse, UpdateProfileRequest, UpdatePasswordRequest
from app.dependencies import get_current_user
from app.models.user import User, CharacterClass
from app.core.database import get_db
from app.core.security import verify_password, hash_password

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return UserResponse.from_orm_with_computed(current_user)


@router.patch("/me", response_model=UserResponse)
def update_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.name is not None:
        if len(data.name.strip()) < 2:
            raise HTTPException(status_code=400, detail="Nome deve ter ao menos 2 caracteres")
        current_user.name = data.name.strip()

    if data.email is not None:
        existing = db.query(User).filter(
            User.email == data.email,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail="Email já cadastrado")
        current_user.email = data.email

    if data.character_class is not None:
        current_user.character_class = data.character_class

    db.commit()
    db.refresh(current_user)
    return UserResponse.from_orm_with_computed(current_user)


@router.patch("/me/password", status_code=204)
def update_password(
    data: UpdatePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Senha atual incorreta")
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Nova senha deve ter ao menos 6 caracteres")
    current_user.hashed_password = hash_password(data.new_password)
    db.commit()