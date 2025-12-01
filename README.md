# Fantastic Recipe - 食谱管理 Web 应用

一个简单易用的食谱管理 Web 应用，支持添加、编辑、查看和搜索食谱，**支持上传菜品照片**。

## 技术栈

### 后端
- **FastAPI** - 现代化的 Python Web 框架
- **SQLAlchemy** - ORM 数据库工具
- **SQLite** - 轻量级数据库（默认）
- **Pillow** - 图片处理库

### 前端 (React)
- **React** - 现代前端框架
- **Vite** - 极速前端构建工具
- **React Bootstrap** - UI 组件库
- **Axios** - HTTP 客户端

## 功能特性

✅ **食谱管理**
- 添加新食谱（支持上传菜品照片）
- 编辑现有食谱
- 查看食谱详情
- 删除食谱
- 搜索食谱

✅ **食谱信息**
- 菜品名称
- 菜品照片（支持上传和预览）
- 菜品描述
- 食材用料（名称 + 用量）
- 配料表
- 烹饪步骤
- 烹饪时间
- 份数
- 难度等级

## 项目结构

```
fantastic-recipe/
├── backend/          # FastAPI 后端
├── frontend-react/   # React 前端源代码
├── frontend/         # 旧版原生 JS 前端（已弃用）
├── data/            # 数据库文件
├── uploads/         # 上传的图片
├── run.py          # 后端启动脚本
└── pyproject.toml  # 依赖配置
```

## 快速开始

### 1. 启动后端

确保已安装 Python 依赖（见下方"依赖管理"）。

```bash
# 启动 FastAPI 后端（运行在 http://localhost:8000）
uv run python run.py
```

### 2. 启动前端

你需要安装 Node.js。

```bash
cd frontend-react

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问终端中显示的地址（通常是 http://localhost:5173）即可使用应用。

## 依赖管理 (Python)

本项目使用 [uv](https://github.com/astral-sh/uv) 管理 Python 依赖。

```bash
# 安装依赖
uv sync
```

## 常见问题

### Q: 如何同时运行前后端？

A: 你需要打开两个终端窗口，一个运行后端 (`uv run python run.py`)，另一个运行前端 (`npm run dev`)。

### Q: 端口被占用？

- 后端：修改 `run.py` 中的端口。
- 前端：Vite 会自动寻找下一个可用端口。

## 许可证

MIT License
