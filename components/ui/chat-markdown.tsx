"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { cn } from "@/lib/utils"
import { ChatCodeBlock } from "@/components/ui/chat-code-block"

// ─── Markdown renderer for chat messages ──────────────────────────

function ChatMarkdown({
  children,
  className,
  ...props
}: {
  children: string
  className?: string
} & Omit<React.ComponentProps<typeof ReactMarkdown>, "className" | "children">) {
  return (
    <div
      className={cn("text-body-primary text-foreground", className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Paragraphs: no extra spacing in message bubbles
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 leading-[22px]">{children}</p>
          ),
          // Headings
          h1: ({ children }) => (
            <h1 className="text-headline-primary mb-4 mt-6 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-headline-secondary mb-3 mt-5 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-title-tertiary mb-2 mt-4 first:mt-0">{children}</h3>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="mb-3 list-disc pl-5 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal pl-5 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="mb-1 leading-[22px]">{children}</li>
          ),
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="mb-3 border-l-2 border-brand/30 pl-3 text-muted-foreground italic last:mb-0">
              {children}
            </blockquote>
          ),
          // Code blocks (triple backtick) and inline code
          code: ({ className: codeClassName, children: codeChildren, ...codeProps }) => {
            const match = /language-(\w+)/.exec(codeClassName || "")
            const language = match ? match[1] : undefined

            // Block code (has language class or inside <pre>)
            if (match) {
              const text = String(codeChildren).replace(/\n$/, "")
              return (
                <ChatCodeBlock language={language}>
                  {text}
                </ChatCodeBlock>
              )
            }

            // Inline code
            return (
              <code
                className="rounded-[4px] bg-fill-medium px-1.5 py-0.5 text-[13px] font-mono text-foreground/90"
                {...codeProps}
              >
                {codeChildren}
              </code>
            )
          },
          // Pre tag: render children directly since we handle code blocks above
          pre: ({ children }) => <>{children}</>,
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline decoration-brand/30 underline-offset-2 transition-colors hover:decoration-brand"
            >
              {children}
            </a>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="my-4 border-border/50" />
          ),
          // Tables
          table: ({ children }) => (
            <div className="mb-3 overflow-x-auto last:mb-0">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-border/50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-label-secondary-bold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border-t border-border/30 text-body-primary">{children}</td>
          ),
          // Strong / emphasis
          strong: ({ children }) => (
            <strong className="font-[590]">{children}</strong>
          ),
          em: ({ children }) => (
            <em>{children}</em>
          ),
          // Images
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || ""}
              className="mb-3 max-w-full rounded-[6px] last:mb-0"
            />
          ),
        }}
        {...props}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

export { ChatMarkdown }