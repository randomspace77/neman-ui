# 03 - 圆角 / 间距 / 布局

## 3.1 圆角系统 (Border Radius)

### 语义化圆角

| 值 | 用途 |
|----|------|
| `4px` | 小型元素（锚点高亮、代码片段） |
| `8px` | Select 下拉框、小按钮 |
| `10px` | Popover 触发区 |
| `12px` | 卡片、对话框、Toast |
| `14px` | 中型卡片/面板 |
| `16px` | 大卡片、侧面板 |
| `18~24px` | 大面板/底部弹窗 |
| `22px` | **主交互圆角** — 搜索框、输入组、主按钮 |
| `100px` | 胶囊按钮、Pill 标签 |
| `9999px` | 圆形头像、完全圆形元素 |

### Tailwind 对应

| Tailwind Class | 值 |
|----------------|-----|
| `rounded-sm` | 2px |
| `rounded` | 4px |
| `rounded-md` | 6px |
| `rounded-lg` | 8px |
| `rounded-xl` | 12px |
| `rounded-2xl` | 16px |
| `rounded-full` | 9999px |
| `rounded-[8px]` | 8px |
| `rounded-[22px]` | 22px（核心交互圆角） |
| `rounded-[100px]` | 100px（胶囊） |

## 3.2 间距系统

### 内边距 (Padding)

| 值 | 场景 |
|----|------|
| `p-0` | 无内边距 |
| `p-1` (4px) | 紧凑元素 |
| `px-3` (12px) | 小型按钮水平内边距 |
| `px-[8px]` | 标签/小型pill |
| `px-[14px]` | 胶囊按钮水平内边距 |
| `px-[24px]` | 主按钮水平内边距 |
| `px-6` (24px) | 区域内边距 |
| `py-[7px]` | 按钮/输入垂直内边距 |
| `py-1.5` (6px) | 紧凑按钮垂直 |
| `py-[12px]` | 卡片垂直内边距 |
| `py-[100px]` | Hero 区大幅留白 |
| `p-[28px]` | 对话框内边距 |

### 间隙 (Gap)

| 值 | 场景 |
|----|------|
| `gap-[4px]` | 极紧凑排列（图标组） |
| `gap-1` (4px) | 紧凑型 Flex 间距 |
| `gap-1.5` (6px) | 小型 Flex 间距 |
| `gap-2` (8px) | 基础 Flex 间距 |
| `gap-2.5` (10px) | 中型 Flex 间距 |
| `gap-3` (12px) | 卡片内间距 |
| `gap-4` (16px) | 区块间距 |
| `gap-6` (24px) | 大区块间距 |
| `gap-[40px]` | 页面级大间距 |

### 外边距 (Margin)

| 值 | 场景 |
|----|------|
| `mt-[20vh]` | Hero 区顶部弹性留白 |
| `mt-[24px]` | 区块下间距 |
| `mb-[34px]` | 底部留白 |
| `mx-auto` | 居中布局 |

## 3.3 尺寸系统

### 高度

| 值 | 场景 |
|----|------|
| `h-[32px]` | 小型按钮/输入 |
| `h-8` (32px) | 紧凑按钮 |
| `h-9` (36px) | 中按钮 |
| `h-10` (40px) | 标准按钮 |
| `h-[46px]` | 输入框（最小高度） |
| `h-[56px]` | 主输入框/大按钮 |

### 宽度

| 值 | 场景 |
|----|------|
| `w-8` (32px) | 图标按钮 |
| `min-w-[64px]` | 最小按钮宽度 |
| `max-w-[1080px]` | 内容区最大宽度 |
| `sm:max-w-[768px]` | 小屏幕最大宽度 |
| `sm:min-w-[360px]` | 小屏幕最小宽度 |
| `max-h-[300px]` | 下拉菜单最大高度 |

## 3.4 布局模式

### 页面容器

```css
max-width: 1080px;
margin: 0 auto;
```

### Hero 区

```css
padding: 100px 0;
text-align: center;
font-size: 36px;
line-height: 44px;
margin-top: 20vh; /* 弹性顶部留白 */
```

### 导航

```css
position: sticky;
top: 28px;
z-index: 40;
max-width: 1080px;
margin: 0 auto;
```

### Flex 布局

```
主轴: flex-col, items-center, gap-6
Grid: grid-cols-2, md:grid-cols-7
```

### 响应式断点

| 断点 | 值 |
|------|-----|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |