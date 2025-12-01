from sqlalchemy import create_engine, String, Integer, DateTime, JSON
from sqlalchemy.orm import declarative_base, sessionmaker, Mapped, mapped_column
from datetime import datetime
from typing import List, Optional, Any
import os

# 获取项目根目录
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")
DB_PATH = os.path.join(DATA_DIR, "recipes.db")

# 数据库文件路径
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class RecipeDB(Base):
    """数据库模型"""
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    ingredients: Mapped[List[Any]] = mapped_column(JSON, nullable=False, default=list)
    seasonings: Mapped[List[Any]] = mapped_column(JSON, nullable=False, default=list)
    steps: Mapped[List[Any]] = mapped_column(JSON, nullable=False, default=list)
    cooking_time: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    servings: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    difficulty: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# 创建数据库表
def init_db():
    # 确保数据目录存在
    os.makedirs(DATA_DIR, exist_ok=True)
    Base.metadata.create_all(bind=engine)


# 获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
