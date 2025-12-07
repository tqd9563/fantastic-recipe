from pydantic import BaseModel
from typing import Optional
from .recipe import Recipe

class PlanCreate(BaseModel):
    date: str
    recipe_id: int
    type: str = "dinner"
    is_completed: bool = False

class Plan(PlanCreate):
    id: int
    recipe: Optional[Recipe] = None

    class Config:
        from_attributes = True

