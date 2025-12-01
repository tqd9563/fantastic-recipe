#!/usr/bin/env python3
"""
快速启动脚本
从项目根目录运行: uv run python run.py
"""
import uvicorn
import sys
import os

# 添加后端目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

if __name__ == "__main__":
    
    print("=" * 50)
    print("Fantastic Recipe - 食谱管理应用")
    print("=" * 50)
    print(f"访问地址: http://localhost:8000")
    print(f"API 文档: http://localhost:8000/docs")
    print("=" * 50)
    print("按 Ctrl+C 停止服务器")
    print()
    
    # 使用字符串引用应用，以支持 reload
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)

