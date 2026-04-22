# 05 - 组件：弹窗 / 下拉 / 提示 / 菜单 / 标签页

## 5.1 对话框 / 模态 (Dialog / Modal)

### 容器变量

```css
.dialog-vars {
  --dp: 20px;              /* 对话框内边距 */
  --dp-header-end: 16px;    /* 头部末尾内边距 */
}

/* 宽屏适配 */
@container dialog (min-width: 560px) {
  .dialog-vars {
    --dp: 24px;
    --dp-header-end: 20px;
  }
}
```

### 基本样式

```
max-height: calc(100vh - 80px) / calc(100svh - 80px) / calc(100dvh - 80px)
/* 使用三个视口单位确保兼容性 */
```

## 5.2 下拉 / 弹出层 (Popover)

### 触发器交互

```
/* 默认态 */
[data-popover-trigger]:
  bg: var(--fill-tsp-white-light)
  border-radius: 10px

/* 悬浮态 — 小位移效果 */
[data-popover-trigger=true]:not([data-no-popover-hover]):
  transform: translateY(-1px)  /* -translate-y-[1px] */
  scale: 1.03 ~ 1.1           /* scale-[1.03] / scale-105 / scale-[1.1] */
  z-index: 10
  cursor: pointer
  animation: scale-button 0.2s ease-in-out

/* 悬浮边框色 */
hover-border: var(--Button-blue) / var(--border-dark) / var(--icon-blue)

/* 激活态 — 缩小pressed效果 */
pressed: scale-[0.98]

/* 禁用态 */
disabled: cursor-not-allowed, opacity-100

/* 箭头旋转（展开时） */
[data-popover-trigger] .group-data-[popover-trigger]:rotate-180
```

### 内容层

```
background: var(--background-menu-white)
border-radius: 12px ~ 16px
border: 1px solid var(--border-main)
box-shadow: var(--shadows-drop-3) ~ var(--shadows-drop-4)
```

## 5.3 Tooltip 提示

```
z-index: 999
background: var(--background-menu-tooltips)  /* #000000e6 — 90%黑色 */
color: var(--text-white)
border-radius: 4px ~ 8px
animation: tipIn
  0%: opacity-0, translate(-50%, calc(-100% + 8px)), scale(0.92)
  100%: visible, scale(1)
```

## 5.4 菜单 (Menu)

### 下拉动画

```css
@keyframes menu-slide-down {
  0% {
    opacity: 0;
    transform: translateY(-8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
  /* 时长: 0.35s, 缓动: cubic-bezier(0.32, 0.72, 0, 1) */
}
```

### 菜单背景

```
background: var(--background-menu-white)  /* #ffffff */
/* 或渐变背景 */
background: linear-gradient(153deg, var(--background-menu-white) 0%, var(--background-nav) 100%)
/* 顶部渐变遮罩 */
background: linear-gradient(0deg, rgba(248,248,247,0), #f8f8f7 45.05%)
```

### 菜单项悬浮

```
hover: bg -> var(--background-menu-white) 或 var(--background-tsp-menu-white)
transition: colors 150ms ~ 300ms
```

## 5.5 标签页 (Tabs)

### 标签页 Token

| Token | Light | Dark |
|-------|-------|------|
| `--tab-fill` | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.06)` |
| `--tab-active-black` | `#1a1a19` | `#ffffff` |
| `--tab-active-white` | `#ffffff73` | `#ffffff73` |

### 标签页样式

```
/* 激活态 */
[data-active]:
  color: var(--tab-active-black)  /* #1a1a19 */
  font-weight: 500
  text-shadow: 0 0 0.5px currentColor  /* 微描边增强可读性 */

/* 未激活态 */
color: var(--text-secondary)  /* #5e5e5b */

/* 禁用态 */
[data-disabled]:
  color: var(--text-secondary)
  opacity: 0.5
  cursor: not-allowed

/* 开关/切换激活态 */
[data-state=on]:
  background: var(--fill-white)  /* #ffffff */
  color: var(--text-primary)
  box-shadow: 0px 0px 2px 0px var(--shadow-S)
```

## 5.6 遮罩层 (Overlay / Backdrop)

| Token | Light | 用途 |
|-------|-------|------|
| `--background-mask-black` | `#000000a6` (65%) | 模态遮罩 |
| `--background-mask-white` | `#f8f8f7a6` | 白色半透明遮罩 |
| `--background-preview-mask` | `#000000d9` (85%) | 预览遮罩（更不透明）|

### Popup 遮罩

```
background: var(--background-mask-black)
pointer-events: auto / none (切换)
```