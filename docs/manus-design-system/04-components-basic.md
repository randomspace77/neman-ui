# 04 - 组件：按钮 / 输入 / 卡片

## 4.1 按钮 (Button)

### 主按钮 — Primary (Black)

```
bg: var(--Button-black)  /* #1a1a19 light, #fffffff2 dark */
color: var(--text-onblack)  /* #ffffff light, #000000e5 dark */
border-radius: 22px 或 rounded-full
height: 56px (h-[56px]) 或 40px (h-10)
padding: 0 24px (px-[24px])
font-weight: 500 (font-medium)
hover: opacity-80
active: opacity-50, scale-[0.98]
transition: all, duration-300, ease-out
```

### 胶囊按钮 — Secondary / Ghost

```
bg: var(--fill-tsp-white-light)  /* hover: var(--fill-tsp-white-main) */
color: var(--text-primary)
border-radius: 100px (rounded-[100px])
height: 40px (h-10)
padding: 0 14px (px-[14px])
font-weight: 500 (font-medium)
border: none
hover: bg -> var(--fill-tsp-white-main)
active: opacity-80
```

### 蓝色按钮 — Brand Blue

```
bg: var(--Button-blue)  /* #0081f2 light, #1a93fe dark */
color: #ffffff
border-radius: 22px
disabled: bg -> var(--Button-blue-disabled)  /* #7cbdf5 */
```

### 按钮尺寸参考

| 尺寸 | 高度 | 内边距 | 圆角 |
|------|------|--------|------|
| Small | 32px (h-[32px]) | px-[8px] | 8px |
| Medium | 40px (h-10) | px-[14px] | 100px |
| Large | 56px (h-[56px]) | px-[24px] | 22px |

### Popover 触发按钮 (Card-like)

```
border-radius: 10px
hover: -translate-y-[1px], scale-[1.03]~[1.1]
hover border: var(--Button-blue) / var(--border-dark)
animation: scale-button 0.2s ease-in-out
active: cursor-pointer
disabled: cursor-not-allowed, opacity-100
```

## 4.2 输入框 (Input / Textarea)

### 主输入框

```
height: 56px (h-[56px])
min-height: 46px (min-h-[46px])
border-radius: 22px
background: var(--fill-tsp-white-light)  /* #37352f0a */
border: 1px solid var(--border-main)  /* #0000000f */
placeholder-color: var(--text-disable)  /* #b9b9b7 */
padding: 0 8px 0 16px (ps-4 pe-2)

/* Focus 状态 */
focus-border: black/20% (light) / var(--border-dark) (dark)
focus-border-width: 1px (via border class)

/* 禁用状态 */
disabled-bg: var(--fill-tsp-white-dark)  /* #37352f14 */
disabled-opacity: 100 (not reduced)
```

### Search 输入框（Hero 区）

```
height: 56px
border-radius: 22px
max-width: 1080px
font-size: 15px
```

### Ant Design Select 覆盖样式

```
.ant-select-selector:
  border-radius: 8px !important
  border-width: 1.5px !important
  background: var(--fill-tsp-white-light) !important
  box-shadow: none !important

  /* Focus/Error 状态 */
  .ant-select-focused .ant-select-selector:
    border-color: var(--function-error) !important  /* error */
    OR
    border-color: transparent !important  /* normal focus */

  /* Hover 状态 */
  .ant-select-selector:hover:
    border-color: var(--function-error) !important  /* error hover */
    OR
    border-color: transparent !important  /* normal hover */
```

## 4.3 卡片 (Card)

### 标准卡片

```
background: var(--background-menu-white)  /* #ffffff */
border: 1px solid var(--border-main)  /* #0000000f */
border-radius: 12px ~ 22px
box-shadow: 0px 12px 32px 0px rgba(0,0,0,0.02)
padding: varies (通常 p-3 ~ p-6)
```

### 卡片悬浮交互

```
/* 悬浮 */
hover: -translate-y-[1px]
hover: scale-[1.03] ~ scale-[1.05]
hover: shadow 增强或边框加深
transition: duration-300, ease-out

/* Popover 触发卡片 */
hover-z-index: 10
hover: border-color -> var(--border-dark)
hover: bg -> var(--fill-tsp-white-main)
```