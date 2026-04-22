# 02 - 字体排印

## 2.1 字体栈

```css
/* Sans-serif — UI 正文 */
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI Variable Display",
  "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif;

/* System UI — 通用 */
--font-system: ui-sans-serif, system-ui, sans-serif,
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

/* Serif — 展示/标题 */
--font-serif: "Libre Baskerville", Georgia, Cambria, ui-serif,
  "Times New Roman", Times, serif;

/* CJK Serif — 中日韩标题 */
--font-serif-sc: var(--font-noto-serif-sc), "Libre Baskerville", Georgia,
  Cambria, ui-serif, "Times New Roman", Times, serif;
--font-serif-jp: var(--font-noto-serif-jp), "Libre Baskerville", Georgia,
  Cambria, ui-serif, "Times New Roman", Times, serif;
--font-serif-tc: var(--font-noto-serif-tc), "Libre Baskerville", Georgia,
  Cambria, ui-serif, "Times New Roman", Times, serif;

/* Display — 品牌展示 */
--font-display: "SF Pro", "SF Pro:Medium", sans-serif;

/* Monospace — 代码 */
--font-mono: ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas,
  "Liberation Mono", "Courier New", monospace;
```

## 2.2 字号层级（语义化 class）

### 标题类 (Title)

| Class | Font Size | Font Weight | Line Height | Letter Spacing |
|-------|-----------|-------------|-------------|----------------|
| `.text-title-primary` | 14px | 590 | 20px | — |
| `.text-title-secondary` | 16px | 590 | 22px | — |
| `.text-title-tertiary` | 18px | 590 | 24px | — |

### 标题类 (Headline)

| Class | Font Size | Font Weight | Line Height | Letter Spacing |
|-------|-----------|-------------|-------------|----------------|
| `.text-headline-primary` | 20px | 590 | 25px | — |
| `.text-headline-secondary` | 24px | 590 | 30px | — |
| `.text-headline-tertiary` | 28px | 590 | 34px | — |

### 正文类 (Body)

| Class | Font Size | Font Weight | Line Height | Letter Spacing |
|-------|-----------|-------------|-------------|----------------|
| `.text-body-primary` | 14px | 400 | 22px | -0.154px |
| `.text-body-secondary` | 16px | 400 | 24px | -0.304px |
| `.text-body-tertiary` | 18px | 400 | 28px | — |

### 标签类 (Label)

| Class | Font Size | Font Weight | Line Height | Letter Spacing |
|-------|-----------|-------------|-------------|----------------|
| `.text-label-primary` | 12px | 400 | 16px | — |
| `.text-label-primary-bold` | 12px | 600 | 16px | — |
| `.text-label-secondary` | 13px | 400 | 18px | -0.091px |
| `.text-label-secondary-bold` | 13px | 590 | 18px | — |

## 2.3 字重参考

| Weight | Class / 用途 |
|--------|-------------|
| 400 (normal) | 正文、标签 primary |
| 500 (medium) | 强调文本 |
| 590 | 标题、标签 secondary-bold (Manus 特有字重) |
| 600 (semibold) | 标签 primary-bold |

> **注意**: `590` 是 Manus 的标志性字重，介于 Regular (400) 和 Semibold (600) 之间，用于标题和强调元素。

## 2.4 Hero 区标题

```
font-size: 36px (text-[36px])
line-height: 44px (leading-[44px])
```

## 2.5 行高参考

| 值 | 场景 |
|----|------|
| 16px | 12px 字号（label-primary） |
| 18px | 14px 字号（title-primary / label-secondary） |
| 20px | 14px 字号标题（title-primary） |
| 22px | 14px 正文（body-primary） |
| 24px | 16px 正文（body-secondary） |
| 25px | 20px 标题（headline-primary） |
| 30px | 24px 标题（headline-secondary） |
| 34px | 28px 标题（headline-tertiary） |
| 44px | Hero 大标题（36px 字号） |