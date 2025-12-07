from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class Ingredient(BaseModel):
    """食材模型"""
    name: str
    amount: str  # 用量，如 "200g", "2个"


class RecipeCreate(BaseModel):
    """创建食谱的请求模型"""
    name: str
    description: Optional[str] = None
    ingredients: List[Ingredient] = []
    seasonings: List[str] = []  # 配料表
    steps: List[str] = []  # 烹饪步骤
    cooking_time: Optional[int] = None  # 烹饪时间（分钟）
    servings: Optional[int] = None  # 份数
    difficulty: Optional[str] = None  # 难度：简单、中等、困难
    tags: List[str] = []  # 标签
    mastery_level: Optional[str] = "never_tried"  # 熟练度
    rating: Optional[int] = None  # 评分

class Recipe(RecipeCreate):
    """食谱模型（包含ID和创建时间）"""
    id: int
    image_url: Optional[str] = None  # 图片URL
    cook_count: int = 0  # 总制作次数
    last_cooked_at: Optional[datetime] = None  # 末次食用时间
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

