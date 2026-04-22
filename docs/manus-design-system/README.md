# Manus.im 视觉设计规范

基于 manus.im 网站源码提取的完整设计系统文档。

## 文件索引

| 文件 | 内容 |
|------|------|
| [01-colors.md](./01-colors.md) | 色彩系统 — 文本、背景、边框、功能色、填充、阴影、渐变（Light/Dark） |
| [02-typography.md](./02-typography.md) | 字体排印 — 字体栈、字号层级（Title/Headline/Body/Label）、字重、行高 |
| [03-spacing-layout.md](./03-spacing-layout.md) | 圆角、间距、尺寸、布局模式、响应式断点 |
| [04-components-basic.md](./04-components-basic.md) | 基础组件 — 按钮、输入框、卡片 |
| [05-components-overlay.md](./05-components-overlay.md) | 浮层组件 — Dialog、Popover、Tooltip、Menu、Tabs、Overlay |
| [06-components-micro.md](./06-components-micro.md) | 微组件 — 表单控件、Badge、Avatar、Spinner、Skeleton、Table |
| [07-animations.md](./07-animations.md) | 动画与交互 — 关键帧、过渡、Reduced Motion |
| [08-design-principles.md](./08-design-principles.md) | 设计原则、配色速查表、间距速查、技术栈 |

## 快速开始

核心设计 token 起始于 `01-colors.md`，组件样式从 `04-components-basic.md` 开始阅读。

所有色值均提供 Light/Dark 双模式。CSS 变量名与 manus.im 源码完全一致，可直接在 Tailwind 中引用 `var(--xxx)`。