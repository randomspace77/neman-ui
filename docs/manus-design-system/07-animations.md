# 07 - 动画与交互

## 7.1 关键帧动画 (Keyframe Animations)

### scale-button — 按钮按压缩放

```css
@keyframes scale-button {
  0% { transform: scale(1); }
  /* ~50%: scale(0.98) 按下 */
  100% { transform: scale(1); }
}
/* 用法: 0.2s ease-in-out */
```

### menu-slide-down — 菜单下拉

```css
@keyframes menu-slide-down {
  0% { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}
/* 用法: 0.35s cubic-bezier(0.32, 0.72, 0, 1) */
```

### tipIn — Tooltip 进入

```css
@keyframes tipIn {
  0% {
    opacity: 0;
    transform: translate(-50%, calc(-100% + 8px)) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1);
  }
}
```

### highlightAnimation — 菜单锚点高亮

```css
@keyframes highlightAnimation {
  0% { background-color: transparent; }
  11.5% { background-color: var(--fill-blue); }
  88.5% { background-color: var(--fill-blue); }
  100% { background-color: transparent; }
}
/* 时长: 2.6s ease-in-out forwards */
```

### breathe — 呼吸

```css
@keyframes breathe {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.05; }
}
/* 极淡呼吸，用于背景装饰 */
```

### loading-blink — 闪烁

```css
@keyframes loading-blink {
  0% { opacity: 0.2; }
  /* 50%: opacity: 1 */
}
```

### spin — 旋转

```css
@keyframes spin {
  to { transform: rotate(1turn); }
}
/* 用于 Spinner */
```

### bounce-dot — 弹跳点

```css
@keyframes bounce-dot {
  0%, 70% { transform: translateY(0); }
  /* 40%: translateY(-30%) */
}
```

### progress-fill — 进度条填充

```css
@keyframes progress-fill {
  0% { width: 0; }
  100% { width: 100%; }
}
/* 时长: 8000ms (8s), linear */
```

### fade-in — 淡入

```css
@keyframes fade-in {
  0% { opacity: 0; visibility: hidden; }
  100% { opacity: 1; visibility: visible; }
}
```

### header-fade-in — 头部淡入

```css
@keyframes header-fade-in {
  0% { opacity: 0; transform: translateY(-30px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

### home-view-show — 首页视图进入

```css
@keyframes home-view-show {
  0% { opacity: 0; transform: translateY(150px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

### home-view-hidden — 首页视图退出

```css
@keyframes home-view-hidden {
  0% { display: flex; opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(0); /* 或向上移动 */ }
}
```

### text-fade-in — 文本淡入上移

```css
@keyframes text-fade-in {
  0% { opacity: 0; transform: translateY(50px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

### gridFadeIn — 网格淡入

```css
@keyframes gridFadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
```

### scale-fade-in — 缩放淡入

```css
@keyframes scale-fade-in {
  0% { opacity: 0; visibility: hidden; width: 100px; height: 100px; }
  100% { opacity: 1; visibility: visible; }
}
```

### shimmer — 扫光

```css
@keyframes shimmer {
  0% { background-position: 250% 0; }
  /* 100%: background-position 回到始位 */
}
/* 用于骨架屏加载效果 */
```

## 7.2 过渡 (Transitions)

### 交互过渡

```css
/* 按钮悬浮 — 通用 */
transition: all 300ms ease-out;

/* 颜色过渡 — 背景/文字色 */
transition: colors 150ms ~ 300ms;

/* 变换过渡 — 位移/缩放 */
transition: transform 300ms ease-out;
```

### 悬浮状态映射

| 状态 | 效果 | 缓动 |
|------|------|------|
| hover | `opacity-80` / `opacity-90` | 300ms ease-out |
| hover (card) | `translateY(-1px)` + `scale(1.03~1.1)` | 300ms ease-out |
| hover (link) | `underline` | colors 快速 |
| active | `opacity-50` + `scale(0.98)` | 即时 |
| disabled | `opacity-100` (被子样式覆盖) | — |

## 7.3 视差与滚动

```
/* 无限滚动（如品牌 Logo 展示） */
@keyframes marquee / financeScrollLeft / financeScrollRight
  0%: translateX(0)
  100%: translateX(-50%)  /* 双倍内容无缝循环 */
```

## 7.4 Reduced Motion 无障碍

```css
@media (prefers-reduced-motion: reduce) {
  .motion-reduce\:hidden { display: none; }
  .motion-reduce\:opacity-100 { opacity: 1; }
}
```

Manus 完整尊重 `prefers-reduced-motion`，在减少动画模式下：
- 隐藏装饰动画元素
- 将动效透明度修正为 100%