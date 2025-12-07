# UI 设计风格指南 (Style Guide)

## 核心设计理念
**"Modern Fresh Kitchen" (现代清新厨房)**
风格关键词：**温润、清新、现代、去油腻、呼吸感**。
旨在激发用户的食欲和使用欲望，同时保持工具的高效与条理。

---

## 1. 配色方案 (Color Palette)

### 主色调 (Primary)
用于强调、主按钮、选中状态、Logo。
- **Sage Green (鼠尾草绿)**
  - HEX: `#6B9080` (主色)
  - HEX: `#A4C3B2` (浅色变体，用于Hover或背景)
  - 语义：健康、有机、新鲜、平静。

### 辅助色 (Secondary)
用于高亮、评分、重要提示、动效点缀。
- **Warm Orange (暖橙色)**
  - HEX: `#F4A261`
  - HEX: `#E9C46A` (偏黄，用于星级评分)
  - 语义：食欲、温暖、活力、灶火。

### 中性色 (Neutrals)
- **背景 (Background)**
  - **Cream (奶油白)**: `#F6F7F2` 或 `#FAFAF9` (全站主背景，护眼，有温度)
  - **Pure White (纯白)**: `#FFFFFF` (卡片背景，内容承载)
- **文本 (Typography)**
  - **Charcoal (炭灰)**: `#264653` (主标题，强对比但柔和)
  - **Slate (板岩灰)**: `#556B75` (正文，次级信息)
  - **Light Gray (浅灰)**: `#E0E0E0` (分割线，边框)

### 语义色 (Semantic)
- **Error (错误/删除)**: `#E76F51` (比如删除食谱)
- **Success (成功/完成)**: `#2A9D8F` (比如完成计划)

---

## 2. 视觉元素 (Visual Elements)

### 卡片 (Cards)
全站核心容器。
- **圆角**: `rounded-xl` (12px) 或 `rounded-2xl` (16px)。
- **阴影**: 轻微悬浮感。
  - 默认: `shadow-sm` (0 1px 2px 0 rgb(0 0 0 / 0.05))
  - Hover: `shadow-md` (0 4px 6px -1px rgb(0 0 0 / 0.1))
- **边框**: 可选极细的浅色描边 `border border-gray-100`，增加精致感。

### 图片 (Imagery)
- **比例**: 保持大图展示，画廊模式下尽量铺满。
- **填充模式**: `object-cover`。
- **圆角**: 图片圆角应与卡片圆角呼应，或略小于卡片圆角。

### 字体 (Typography)
- **字体族**: 无衬线字体 (Sans-serif)。推荐 `Inter`, `Nunito` (偏圆润，适合美食), 或系统默认字体。
- **层级**:
  - **H1/Page Title**: Bold, Size 24px+, Color: Charcoal.
  - **H2/Section Title**: Semi-Bold, Size 18px-20px, Color: Charcoal.
  - **Body**: Regular, Size 14px-16px, Color: Slate.
  - **Caption/Meta**: Regular, Size 12px, Color: Light Slate.

---

## 3. 组件风格 (Component Styles)

### 按钮 (Buttons)
- **Primary Button**: 鼠尾草绿背景 + 白色文字。圆角较大 (Pill shape 或 rounded-lg)。Hover 时颜色加深或稍微上浮。
- **Secondary Button**: 透明背景 + 鼠尾草绿文字 + 细边框。
- **Icon Button**: 纯图标，Hover 时出现圆形浅色背景。

### 标签 (Tags/Chips)
- **样式**: 浅色背景 + 深色文字。
- **示例**:
  - 荤菜: 背景 `#FEE2E2` (浅红), 文字 `#991B1B`.
  - 素菜: 背景 `#DCFCE7` (浅绿), 文字 `#166534`.
  - 默认: 背景 `#F3F4F6` (浅灰), 文字 `#374151`.

### 导航/侧边栏 (Navigation)
- **风格**: 可以选择深色侧边栏 (`#264653`) 形成视觉锚点，或者使用磨砂玻璃效果 (Glassmorphism) 的顶部导航栏。

---

## 4. 交互动效 (Interactions)
- **Hover**: 任何可点击的卡片，Hover 时应有 `transform: translateY(-2px)` 的上浮效果。
- **Transition**: 所有颜色变化、阴影变化应有 `duration-200` 的平滑过渡。
- **Feedback**: 重要操作（如完成计划、保存食谱）应有明显的反馈动画（如 Checkmark 动画、Confetti 撒花）。