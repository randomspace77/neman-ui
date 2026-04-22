# 06 - 组件：表单 / 微组件 / 动画

## 6.1 表单控件

### Switch / Toggle 开关

```
/* 开启态 */
[data-state=on]:
  background: var(--fill-white)  /* #ffffff light */
  color: var(--text-primary)
  box-shadow: 0px 0px 2px 0px var(--shadow-S)
  /* 外阴影制造 3D 凸起效果 */
```

### 复选框 / 单选 (Checkbox / Radio)

```
/* 未明确CSS定义，遵循系统主题 */
/* 推测使用圆角方框 + 选中态蓝色填充 */
```

### Select 下拉框 (Ant Design 覆盖)

```
.ant-select-selector:
  border-radius: 8px !important
  border-width: 1.5px !important
  border-color: transparent !important  /* 默认态 */
  background: var(--fill-tsp-white-light) !important
  box-shadow: none !important

/* 焦点态 */
.ant-select-focused .ant-select-selector:
  border-color: transparent !important  /* 正常焦点 */

/* 错误态 */
.ant-select-focused .ant-select-selector:
  border-color: var(--function-error) !important  /* #f25a5a */

/* 内部文本 */
font-size: 13px !important
line-height: 18px !important
color: var(--text-secondary)
```

### Slider 滑块

```
/* 未发现显式样式定义 */
/* 推测：使用品牌蓝 #0081f2 作为活跃轨道颜色 */
```

## 6.2 Badge 徽章

```
border-radius: rounded-[100px] 或 rounded-full  /* 胶囊形 */
background: var(--fill-tsp-white-light)  /* 默认 */
             var(--fill-blue)             /* 信息蓝 */
             var(--function-error-tsp)    /* 错误红 */
             var(--function-warning-tsp)  /* 警告黄 */
             var(--function-success-tsp)  /* 成功绿 */
font-size: 12px (text-label-primary)
line-height: 16px
padding: 0 8px (gap-[4px] ~ gap-1)
```

## 6.3 Avatar 头像

```
/* 尺寸 */
小: h-8 w-8 (32px) — 紧凑列表
标准: h-10 w-? (40px) — 默认

border-radius: rounded-full (50%)
/* 或 rounded-[500px] 用于更圆润效果 */

/* 头像组叠加 */
 Avatar Group: -space-x 或 margin-left 负偏移
```

## 6.4 Spinner 加载指示器

### CSS 变量

| 变量 | 值 | 说明 |
|------|-----|------|
| `--bprogress-spinner-size` | 18px | 旋转图标大小 |
| `--bprogress-spinner-border-size` | 2px | 边框粗细 |
| `--bprogress-spinner-animation-duration` | 400ms | 旋转动画时长 |
| `--bprogress-spinner-top` | 15px | 顶部定位 |
| `--bprogress-spinner-bottom` | auto | 底部定位 |
| `--bprogress-spinner-left` | auto | 左侧定位 |
| `--bprogress-spinner-right` | 15px | 右侧定位 |

### 进度条

| 变量 | 说明 |
|------|------|
| `--bprogress-color` | 进度条颜色 |
| `--bprogress-height` | 进度条高度 |
| `--bprogress-box-shadow` | 进度条阴影 |
| `--bprogress-z-index` | 层级 |

```css
@keyframes progress-fill {
  0% { width: 0; }
  100% { width: 100%; }
}
/* 时长: 8000ms (8秒), linear */
```

## 6.5 Skeleton / Shimmer 骨架屏

```css
/* 闪烁动画 */
@keyframes shimmer {
  0% { background-position: 250% 0; }
  /* 背景：渐变条形从左扫到右 */
}

/* 呼吸动效 */
@keyframes breathe {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.05; }
}
/* 极淡呼吸，几乎不可见 */

/* 加载脉冲 */
@keyframes pulse {
  50% { opacity: 0.5; }
}

/* 闪烁（半透明闪烁） */
@keyframes loading-blink {
  0% { opacity: 0.2; }
  /* 约定 50% opacity: 1 交替 */
}
```

## 6.6 Table 表格

```
border-collapse: collapse
border-color: inherit

/* 行悬浮 */
table:hover .group-hover/table:opacity-100:
  opacity: 1

/* 滚动条 */
--simplebar-scrollbar-width: 6px（自定义属性）
simplebar-scrollbar:
  width: var(--simplebar-scrollbar-width)
  opacity: 0 (默认) → 1 (hover)
  hover-bg: var(--text-tertiary) → var(--text-disable)

/* 选择高亮 */
background: var(--background-selection)  /* #b8d3f8 light, #6580a5 dark */
border-radius: 4px (锚点高亮)
```

## 6.7 Toast / Alert 通知

```
/* 未发现显式 Toast 组件定义 */
/* 基于 Radix UI Toast 模式 */
/* 推测样式: */
border-radius: 12px ~ 16px
background: var(--background-menu-white)
shadow: var(--shadows-drop-3)
max-height: 300px
z-index: 1050+
font-size: 14px / line-height: 20px
```

## 6.8 表单验证状态

| 状态 | 边框色 | 背景 |
|------|--------|------|
| 默认 | `transparent` (通过 border-main) | `var(--fill-tsp-white-light)` |
| 聚焦 | `transparent` (内部样式) | — |
| 错误 | `var(--function-error)` — `#f25a5a` | — |
| 错误 hover | `var(--function-error)` | — |
| 禁用 | — | `var(--fill-tsp-white-dark)` |