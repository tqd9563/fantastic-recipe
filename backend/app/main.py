from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import os
import shutil
import uuid
import uvicorn
from PIL import Image

from models.recipe import Recipe, RecipeCreate, Ingredient
from models.plan import Plan, PlanCreate
from backend.app.database import get_db, RecipeDB, init_db, PlanDB

# 获取项目根目录
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FRONTEND_STATIC_DIR = os.path.join(BASE_DIR, "frontend", "dist", "assets")
FRONTEND_TEMPLATE_DIR = os.path.join(BASE_DIR, "frontend", "dist")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads", "recipes")

# 确保上传目录存在
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 初始化数据库
init_db()

app = FastAPI(title="食谱管理 API", version="1.0.0")

# 配置 CORS，允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载静态文件
app.mount("/assets", StaticFiles(directory=FRONTEND_STATIC_DIR), name="assets")
app.mount("/uploads", StaticFiles(directory=os.path.join(BASE_DIR, "uploads")), name="uploads")


@app.get("/api/recipes", response_model=List[Recipe])
async def get_recipes(
    skip: int = 0, 
    limit: int = 100, 
    tag: Optional[str] = None,
    rating: Optional[int] = None,
    mastery_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取所有食谱"""
    query = db.query(RecipeDB)
    
    if rating:
        query = query.filter(RecipeDB.rating == rating)
        
    if mastery_level:
        query = query.filter(RecipeDB.mastery_level == mastery_level)
    
    recipes = query.offset(skip).limit(limit).all()
    
    if tag:
        # In-memory filtering for tags
        recipes = [r for r in recipes if tag in r.tags]
        
    return recipes


@app.get("/api/recipes/{recipe_id}", response_model=Recipe)
async def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    """获取单个食谱"""
    recipe = db.query(RecipeDB).filter(RecipeDB.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="食谱不存在")
    return recipe


def save_uploaded_image(file: UploadFile) -> str:
    """保存上传的图片并返回URL"""
    # 生成唯一文件名
    filename_str = file.filename or ""
    file_ext = os.path.splitext(filename_str)[1] or ".jpg"
    filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # 保存文件
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 压缩图片（可选，减小文件大小）
    try:
        img = Image.open(file_path)
        # 如果图片太大，调整大小
        if img.width > 1920 or img.height > 1920:
            img.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
            img.save(file_path, optimize=True, quality=85)
    except Exception as e:
        print(f"图片处理错误: {e}")
    
    # 返回相对URL
    return f"/uploads/recipes/{filename}"


@app.post("/api/recipes", response_model=Recipe)
async def create_recipe(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    ingredients: str = Form("[]"),  # JSON 字符串
    seasonings: str = Form("[]"),  # JSON 字符串
    steps: str = Form("[]"),  # JSON 字符串
    cooking_time: Optional[int] = Form(None),
    servings: Optional[int] = Form(None),
    difficulty: Optional[str] = Form(None),
    tags: str = Form("[]"),  # JSON 字符串
    mastery_level: Optional[str] = Form("never_tried"),
    rating: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """创建新食谱"""
    import json
    
    # 解析JSON字符串
    try:
        ingredients_list = json.loads(ingredients)
        seasonings_list = json.loads(seasonings)
        steps_list = json.loads(steps)
        tags_list = json.loads(tags)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="JSON 格式错误")
    
    # 处理图片上传
    image_url = None
    if image and image.filename:
        image_url = save_uploaded_image(image)
    
    db_recipe = RecipeDB(
        name=name,
        description=description,
        ingredients=ingredients_list,
        seasonings=seasonings_list,
        steps=steps_list,
        cooking_time=cooking_time,
        servings=servings,
        difficulty=difficulty,
        tags=tags_list,
        mastery_level=mastery_level,
        rating=rating,
        image_url=image_url,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe


@app.put("/api/recipes/{recipe_id}", response_model=Recipe)
async def update_recipe(
    recipe_id: int,
    name: str = Form(...),
    description: Optional[str] = Form(None),
    ingredients: str = Form("[]"),
    seasonings: str = Form("[]"),
    steps: str = Form("[]"),
    cooking_time: Optional[int] = Form(None),
    servings: Optional[int] = Form(None),
    difficulty: Optional[str] = Form(None),
    tags: str = Form("[]"),
    mastery_level: Optional[str] = Form("never_tried"),
    rating: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """更新食谱"""
    import json
    
    db_recipe = db.query(RecipeDB).filter(RecipeDB.id == recipe_id).first()
    if not db_recipe:
        raise HTTPException(status_code=404, detail="食谱不存在")
    
    # 解析JSON字符串
    try:
        ingredients_list = json.loads(ingredients)
        seasonings_list = json.loads(seasonings)
        steps_list = json.loads(steps)
        tags_list = json.loads(tags)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="JSON 格式错误")
    
    # 处理图片上传
    if image and image.filename:
        # 删除旧图片（如果存在）
        if db_recipe.image_url:
            old_image_path = os.path.join(BASE_DIR, db_recipe.image_url.lstrip("/"))
            if os.path.exists(old_image_path):
                try:
                    os.remove(old_image_path)
                except Exception:
                    pass
        image_url = save_uploaded_image(image)
        db_recipe.image_url = image_url
    
    db_recipe.name = name
    db_recipe.description = description
    db_recipe.ingredients = ingredients_list
    db_recipe.seasonings = seasonings_list
    db_recipe.steps = steps_list
    db_recipe.cooking_time = cooking_time
    db_recipe.servings = servings
    db_recipe.difficulty = difficulty
    db_recipe.tags = tags_list
    db_recipe.mastery_level = mastery_level
    db_recipe.rating = rating
    db_recipe.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_recipe)
    return db_recipe


@app.delete("/api/recipes/{recipe_id}")
async def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    """删除食谱"""
    db_recipe = db.query(RecipeDB).filter(RecipeDB.id == recipe_id).first()
    if not db_recipe:
        raise HTTPException(status_code=404, detail="食谱不存在")
    
    # 删除关联的图片
    if db_recipe.image_url:
        image_path = os.path.join(BASE_DIR, db_recipe.image_url.lstrip("/"))
        if os.path.exists(image_path):
            try:
                os.remove(image_path)
            except Exception:
                pass
    
    db.delete(db_recipe)
    db.commit()
    return {"message": "食谱已删除"}


@app.get("/api/plans", response_model=List[Plan])
async def get_plans(start_date: str, end_date: str, db: Session = Depends(get_db)):
    """获取日期范围内的计划"""
    plans = db.query(PlanDB).filter(PlanDB.date >= start_date, PlanDB.date <= end_date).all()
    return plans

@app.post("/api/plans", response_model=Plan)
async def create_plan(plan: PlanCreate, db: Session = Depends(get_db)):
    """创建计划"""
    db_plan = PlanDB(**plan.dict())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

@app.delete("/api/plans/{plan_id}")
async def delete_plan(plan_id: int, db: Session = Depends(get_db)):
    """删除计划"""
    db.query(PlanDB).filter(PlanDB.id == plan_id).delete()
    db.commit()
    return {"message": "deleted"}

@app.post("/api/plans/generate")
async def generate_plan(days: int = 7, db: Session = Depends(get_db)):
    """随机生成未来几天的计划"""
    import random
    from datetime import date, timedelta
    
    today = date.today()
    recipes = db.query(RecipeDB).all()
    if not recipes:
        raise HTTPException(status_code=400, detail="没有足够的食谱来生成计划")
        
    generated_plans = []
    # 清除未来几天的现有计划？暂时不清除，直接追加
    
    for i in range(days):
        current_date = (today + timedelta(days=i)).isoformat() # 从今天开始
        
        # Lunch
        lunch_recipe = random.choice(recipes)
        lunch_plan = PlanDB(date=current_date, recipe_id=lunch_recipe.id, type="lunch")
        db.add(lunch_plan)
        generated_plans.append(lunch_plan)
        
        # Dinner
        dinner_recipe = random.choice(recipes)
        dinner_plan = PlanDB(date=current_date, recipe_id=dinner_recipe.id, type="dinner")
        db.add(dinner_plan)
        generated_plans.append(dinner_plan)
        
    db.commit()
    return {"message": f"Generated plans for {days} days", "count": len(generated_plans)}


@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    """为所有非API路由提供React应用"""
    index_path = os.path.join(FRONTEND_TEMPLATE_DIR, "index.html")
    if not os.path.exists(index_path):
        raise HTTPException(status_code=404, detail="Frontend build not found. Run 'npm run build' in frontend-react directory.")
    return FileResponse(index_path)


if __name__ == "__main__":
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

