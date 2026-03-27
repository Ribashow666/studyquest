from fastapi import APIRouter, Depends

from app.schemas.user import UserResponse
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return UserResponse.from_orm_with_computed(current_user)
