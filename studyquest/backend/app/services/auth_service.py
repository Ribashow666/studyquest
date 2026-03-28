import secrets
from datetime import timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from app.models.user import User
from app.schemas.user import RegisterRequest, LoginRequest, TokenResponse
from app.services.email_service import send_verification_email


def register_user(db: Session, data: RegisterRequest) -> User:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Não foi possível criar a conta. Verifique os dados e tente novamente.",
        )

    verification_token = secrets.token_urlsafe(32)

    user = User(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
        character_class=data.character_class,
        is_verified=False,
        verification_token=verification_token,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    try:
        send_verification_email(user.email, user.name, verification_token)
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")

    return user


def verify_email(db: Session, token: str) -> None:
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de verificação inválido ou expirado.",
        )
    user.is_verified = True
    user.verification_token = None
    db.commit()


def login_user(db: Session, data: LoginRequest) -> TokenResponse:
    user = db.query(User).filter(User.email == data.email).first()
    dummy_hash = "$2b$12$KIXnqe2m2y1GNT5vPbFmkuV7VJCkGtGBaXKHYwGRF0EVoY9NGbhhy"
    password_ok = verify_password(data.password, user.hashed_password if user else dummy_hash)

    if not user or not password_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Confirme seu email antes de fazer login. Verifique sua caixa de entrada.",
        )

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return TokenResponse(access_token=access_token)


def get_user_by_id(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
    return user