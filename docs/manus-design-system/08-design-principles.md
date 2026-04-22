# 08 - 设计原则与 CSS 变量速查

## 8.1 设计原则

### 1. 克制用色
以暖灰 `#f8f8f7` 和白 `#ffffff` 为主基底，蓝色 `#0081f2` 为唯一强调色（Dark: `#1a93fe`）。功能色严格限于 Error/Success/Warning 三色。

### 2. 超大圆角
核心交互元素（输入框、主按钮）使用 `22px` 圆角 — 接近胶囊形但不完全，传递柔和感的同时保留可识别的矩形边界。胶囊元素使用 `100px`。

### 3. 极淡边框
默认边框仅 6% 透明度（`#0000000f`），几乎不可见但保持结构分区。强调边框才升至 12%（`#0000001f`）。

### 4. 双层字体架构
**UI 无衬线** — 系统原生 + Segoe UI；**展示衬线** — Libre Baskerville + Noto Serif SC/JP/TC。标题字重 590 是品牌标志。

### 5. 微阴影层次
卡片阴影极轻（`rgba(0,0,0,0.02)`），接近扁平但有层次。四级投影（drop-1~4）提供精确的深度控制。

### 6. 完整暗色模式
所有 CSS 变量均有 Light/Dark 双模式映射，通过 `html.dark` 类切换。暖灰色调统一偏暖（`#f8f8f7` 而非纯 `#f5f5f5`）。

### 7. 原子化 CSS 驱动
Tailwind CSS + 自定义 CSS 变量桥接。语义化 class（`.text-title-primary`）确保一致的排版层级。

### 8. 容器查询响应式
Dialog 组件使用 `@container dialog (min-width: 560px)` 实现内容驱动响应式，而非依赖视口断点。

## 8.2 核心配色速查表

### Light 模式核心色

```
主背景:  #f8f8f7    卡片/白:  #ffffff    主文字:  #34322d
次文字:  #5e5e5b    三级:     #858481    禁用:    #b9b9b7
品牌蓝:  #0081f2    错误:     #f25a5a    成功:    #25ba3b
警告:    #efa201    主按钮:   #1a1a19    边框:    #0000000f
```

### Dark 模式核心色

```
主背景:  #171717    卡片/面:  #1f1f1f    主文字:  #dadada
次文字:  #acacac    三级:     #7f7f7f    禁用:    #5f5f5f
品牌蓝:  #1a93fe    错误:     #eb4d4d    成功:    #5eb92d
警告:    #ffbf36    主按钮:   #fffffff2  边框:    #ffffff0f
```

## 8.3 阴影速查

| 级别 | Light | 用途 |
|------|-------|------|
| XS | `0 0 #0000000f` | 极微妙分隔线 |
| S | `0 0 #00000014` | 小组件阴影 |
| M | `0 0 #0000001f` | 卡片/面板 |
| L | `0 0 #0000003d` | 浮层/对话框 |
| Card | `0px 12px 32px 0px rgba(0,0,0,0.02)` | 内容卡片 |

## 8.4 间距速查

```
4px ─── 紧凑内间距 / 图标与文字
6px ─── 图标间 / 微间距
8px ─── 基础单位 / Tailwind gap-2
12px ── 元素内边距 / gap-3
14px ── 按钮水平内边距（胶囊）
16px ── 区块内边距 / gap-4
20px ── 中等外边距
22px ── 核心圆角值 / 输入框高度参考
24px ── 区域内边距 / gap-6
28px ── Dialog 内边距（宽屏）
32px ── 大区块 / 按钮高度
40px ── 页面段落间距
56px ── 主输入框/大按钮高度
100px ── Hero 区留白
```

## 8.5 技术栈

- **CSS 框架**: Tailwind CSS (原子化) + 自定义 CSS 变量
- **UI 组件**: Radix UI (Popover, Dialog, Switch, Tabs 等) + Ant Design (Select)
- **框架**: Next.js (App Router)
- **暗色模式**: `html.dark` 类切换
- **容器查询**: `@container dialog`
- **动画**: Framer Motion + CSS Keyframes + `prefers-reduced-motion` 无障碍