# 快速启动指南

## 开发模式启动

需要打开两个终端窗口。

### 终端 1：启动后端

```bash
# 安装 Python 依赖
uv sync

# 启动后端服务器
uv run python run.py
```
后端将运行在 http://localhost:8000

### 终端 2：启动前端

```bash
cd frontend-react

# 安装 Node.js 依赖
npm install

# 启动 React 开发服务器
npm run dev
```
前端将运行在 http://localhost:5173（或自动分配的端口）。

## 生产环境构建

如果需要部署：

1. 构建前端：
   ```bash
   cd frontend-react
   npm run build
   ```
   构建产物在 `frontend-react/dist` 目录。

2. 配置 FastAPI 托管静态文件：
   修改 `backend/app/main.py`，将静态文件目录指向 `frontend-react/dist`。
