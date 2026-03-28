from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.task import TaskCreate, TaskResponse, TaskCompleteResponse
from app.services.task_service import create_task, list_tasks, complete_task
from app.dependencies import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create(
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = create_task(db, current_user.id, data)
    return TaskResponse.from_orm(task)


@router.get("", response_model=list[TaskResponse])
def list_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tasks = list_tasks(db, current_user.id)
    return [TaskResponse.from_orm(t) for t in tasks]


@router.patch("/{task_id}/complete", response_model=TaskCompleteResponse)
def complete(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return complete_task(db, task_id, current_user)