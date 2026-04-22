# 01 - 色彩系统

## 1.1 文本色阶（Light）

| Token | 色值 | 用途 |
|-------|------|------|
| `--text-primary` | `#34322d` | 主文本（暖碳黑） |
| `--text-secondary` | `#5e5e5b` | 次要文本/描述 |
| `--text-tertiary` | `#858481` | 三级文本/占位符 |
| `--text-disable` | `#b9b9b7` | 禁用态文本 |
| `--text-blue` | `#0081f2` | 链接/行动点 |
| `--text-onblack` | `#ffffff` | 深色背景上的文本 |
| `--text-white` | `#ffffff` | 白色文本 |
| `--text-white-tsp` | `#ffffff60` | 弱提示白字（40%透明） |
| `--text-shining` | `#e5e5e5` | 闪烁/加载态 |
| `--text-blue-dark` | `#005fb3` | 蓝色深色变体 |

## 1.2 文本色阶（Dark）

| Token | 色值 | 变化 |
|-------|------|------|
| `--text-primary` | `#dadada` | ↑ 亮化 |
| `--text-secondary` | `#acacac` | ↑ 亮化 |
| `--text-tertiary` | `#7f7f7f` | ↑ 亮化 |
| `--text-disable` | `#5f5f5f` | ↑ 亮化 |
| `--text-blue` | `#1a93fe` | ↑ 亮化 |
| `--text-onblack` | `#000000e5` | 深色背景反转 |
| `--text-white-tsp` | `#ffffff99` | 更强透明度 |

## 1.3 背景色（Light）

| Token | 色值 | 用途 |
|-------|------|------|
| `--background-gray-main` | `#f8f8f7` | 全局底色（暖灰） |
| `--background-menu-white` | `#ffffff` | 卡片/菜单/面板背景 |
| `--background-menu-gray` | `#f8f8f7` | 灰色区域背景 |
| `--background-card` | `#fafafa` | 卡片背景 |
| `--background-nav` | `#ebebeb` | 导航区域 |
| `--background-canvas-bg` | `#f0f0ef` | 画布/编辑器背景 |
| `--background-code-bg` | `#f0f0ef` | 代码块背景 |
| `--background-gray-login` | `#f8f8f7` | 登录页背景 |
| `--background-preview-mask` | `#000000d9` | 预览遮罩 |
| `--background-mask-black` | `#000000a6` | 通用黑色遮罩 |
| `--background-mask-white` | `#f8f8f7a6` | 白色遮罩 |
| `--background-selection` | `#b8d3f8` | 文本选中高亮 |

## 1.4 背景色（Dark）

| Token | 色值 |
|-------|------|
| `--background-gray-main` | `#171717` |
| `--background-menu-white` | `#1f1f1f` |
| `--background-menu-gray` | `#1a1a1a` |
| `--background-card` | `#1c1c1c` |
| `--background-nav` | `#1c1c1c` |
| `--background-canvas-bg` | `#1c1c1c` |
| `--background-code-bg` | `#1c1c1c` |
| `--background-selection` | `#6580a5` |

## 1.5 边框色

| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `--border-main` | `#0000000f` (6%) | `#ffffff0f` | 默认边框 |
| `--border-light` | `#0000000a` (4%) | `#ffffff08` | 极淡分割线 |
| `--border-dark` | `#0000001f` (12%) | `#ffffff1a` | 强调边框 |
| `--border-white` | `#ffffff33` (20%) | `#00000014` | 深色模式上用 |
| `--border-blue` | `#0081f247` | `#1a93fe47` | 聚焦边框 |
| `--border-input-active` | `#0000004d` | `#ffffff52` | 输入框激活 |

## 1.6 功能色（Light / Dark）

| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `--function-error` | `#f25a5a` | `#eb4d4d` | 错误/危险 |
| `--function-success` | `#25ba3b` | `#5eb92d` | 成功/确认 |
| `--function-warning` | `#efa201` | `#ffbf36` | 警告 |
| `--function-error-tsp` | `#f25a5a14` | `#eb4d4d1f` | 错误背景 |
| `--function-success-tsp` | `#25ba3b14` | `#5eb92d1f` | 成功背景 |
| `--function-warning-tsp` | `#efa2011f` | `#ffbf361f` | 警告背景 |

## 1.7 按钮色

| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `--Button-black` | `#1a1a19` | `#fffffff2` | 主按钮 |
| `--Button-white` | `#ffffff` | `#ffffff14` | 反白按钮 |
| `--Button-blue` | `#0081f2` | `#1a93fe` | 品牌蓝按钮 |
| `--Button-blue-disabled` | `#7cbdf5` | `#215d93` | 蓝色禁用 |
| `--Button-secondary-blue` | `#0081f21a` | `#1a93fe1f` | 蓝色次级填充 |
| `--Button-border-error` | `#f25a5a80` | `#eb4d4d29` | 错误边框 |
| `--Button-border-secondary` | `#0000001f` | `#ffffff1f` | 次级边框 |

## 1.8 填充色

| Token | Light | Dark | 透明度 |
|-------|-------|------|--------|
| `--fill-tsp-white-main` | `#37352f0f` | `#ffffff0f` | ~4%/6% |
| `--fill-tsp-white-dark` | `#37352f14` | `#ffffff14` | ~8% |
| `--fill-tsp-white-light` | `#37352f0a` | `#ffffff0a` | ~4% |
| `--fill-tsp-gray-main` | `#37352f0a` | `#00000033` | ~4%/20% |
| `--fill-tsp-gray-dark` | `#37352f14` | `#0000004d` | ~8%/30% |
| `--fill-tsp-gray-light` | `#37352f05` | `#0000001f` | ~2%/12% |
| `--fill-blue` | `#0081f214` | `#1a93fe1f` | ~8% |
| `--fill-white` | `#ffffff` | `#1f1f1f` | 实色 |
| `--fill-black` | `#28282973` | `#28282973` | 45% |
| `--fill-gray` | `#f8f8f7` | `#1c1c1c` | 实色 |

## 1.9 图标色

| Token | Light | Dark |
|-------|-------|------|
| `--icon-primary` | `#34322d` | `#dadada` |
| `--icon-secondary` | `#5e5e5b` | `#acacac` |
| `--icon-tertiary` | `#858481` | `#7f7f7f` |
| `--icon-disable` | `#b9b9b7` | `#5f5f5f` |
| `--icon-blue` | `#0081f2` | `#1a93fe` |

## 1.10 阴影系统

| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `--shadow-XS` | `#0000000f` | `#0000001f` | 极小阴影 |
| `--shadow-S` | `#00000014` | `#00000029` | 小阴影 |
| `--shadow-M` | `#0000001f` | `#0000003d` | 中阴影 |
| `--shadow-L` | `#0000003d` | `#00000066` | 大阴影 |
| `--shadows-drop-1` | `#16191d08` | `#0000001f` | 投影1 |
| `--shadows-drop-2` | `#16191d0a` | `#00000033` | 投影2 |
| `--shadows-drop-3` | `#16191d14` | `#00000047` | 投影3 |
| `--shadows-drop-4` | `#16191d1f` | `#0000005c` | 投影4 |
| `--shadows-inner-1` | `#16191d14` | `#ffffff14` | 内阴影1 |
| `--shadows-inner-2` | `#16191d1f` | `#ffffff1f` | 内阴影2 |

## 1.11 渐变

| 名称 | Light | 用途 |
|------|-------|------|
| 背景 App 横幅 | `linear-gradient(180deg, #f7f7f7, #ececec)` | 顶部 App 通知条 |
| 背景 思考态 | `linear-gradient(90deg, --text-primary 0%, #d9d8d8 50.48%, --text-primary 99.04%)` | AI 思考动画 |
| 背景 工具使用 | `linear-gradient(176deg, rgba(255,255,255,0) 5.88%, rgba(255,255,255,0.6) 51.28%, rgba(255,255,255,0) 94.95%)` | 工具调用条 |
| 背景 推广 | `linear-gradient(90deg, #EDF7FF, #E9F6FD)` | 推广横幅 |