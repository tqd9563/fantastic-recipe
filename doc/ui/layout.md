# 全局布局架构 (Global Layout)

为了确保用户在不同功能模块间高效切换，我们采用 **响应式导航架构**。

- **桌面端 (Desktop)**: 左侧固定侧边栏 (Left Sidebar)。
- **移动端 (Mobile)**: 底部固定导航栏 (Bottom Tab Bar)。

---

## 1. 桌面端布局 (Desktop)

采用经典的 **Sidebar + Main Content** 结构。

### 布局网格
- **侧边栏 (Sidebar)**: 固定宽度 `240px` - `260px`，高度 `100vh`，固定在左侧。
- **主内容区 (Main)**: 占据剩余宽度 (`flex-1`)，高度 `100vh`，内部支持滚动 (`overflow-y-auto`)。

### 侧边栏设计 (Sidebar Design)
- **背景**: 推荐使用深色背景 (`#264653` Charcoal) 或浅色背景 (`#F6F7F2` Cream)，取决于个人喜好。基于 `style.md` 的清新风格，**浅色背景 + 深色文字** 可能更协调，或者用深色侧边栏作为视觉锚点。
- **内容结构**:
  1.  **Logo 区 (顶部)**
      -   APP 名称: "Fantastic Recipe" (Bold, 20px)
      -   高度: `64px`，垂直居中。
  2.  **核心导航 (Main Nav)**
      -   垂直排列的菜单项。
      -   **交互**:
          -   默认: 透明背景，文字颜色 Slate (`#556B75`)。
          -   Hover: 浅绿背景 (`#F0FDF4`)。
          -   **Active (选中)**: 鼠尾草绿背景 (`#6B9080`)，白色文字，圆角 (`rounded-lg`)。
      -   **菜单项**:
          -   🏠 **首页 (Dashboard)**
          -   📚 **食谱库 (Recipe Library)**
          -   📅 **计划 (Planning)**
          -   🔭 **发现 (Discovery)**
          -   📊 **统计 (Stats)**
  3.  **底部工具 (Footer)**
      -   ⚙️ 设置 (Settings)
      -   🌙/☀️ 主题切换

---

## 2. 移动端布局 (Mobile)

当屏幕宽度小于 `768px` 时，侧边栏隐藏，转为底部导航栏。

### 底部导航栏 (Bottom Tab Bar)
- **位置**: 固定在屏幕底部 (`fixed bottom-0`)。
- **高度**: `60px` - `64px`。
- **背景**: 纯白 (`#FFFFFF`) + 顶部细边框 (`border-t`).
- **内容**: 仅展示图标 + 极小文字 (或仅图标)。
  -   [🏠] [📚] [📅] [🔭] [📊]
- **交互**:
  -   **Active**: 图标变为实心，颜色为主色 (`#6B9080`)。

---

## 3. 页面层级结构 (Component Hierarchy)

```jsx
<AppLayout>
  {/* 导航层 */}
  <ResponsiveNavigation /> 
  
  {/* 内容层 */}
  <main className="flex-1 overflow-y-auto bg-cream-50">
    <Outlet /> {/* 路由出口: Dashboard, RecipeLibrary, etc. */}
  </main>
</AppLayout>
```


## 4. 其他注意事项
1. 移动端默认单列布局，复杂组件（如日历）在移动端需简化或水平滚动。
2. 尽量避免多层模态覆盖。如果已经有一个抽屉，新的详情最好在当前抽屉内跳转，或者关闭前一个。