"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Command, Copy, Paperclip, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageText,
  ChatMessageActions,
  ChatMessageAction,
  ChatMessageTimestamp,
} from "@/components/ui/chat-message"
import {
  ChatConversation,
  ChatConversationEmpty,
} from "@/components/ui/chat-conversation"
import { ChatReasoning } from "@/components/ui/chat-reasoning"
import {
  ChatToolCall,
  ChatToolCallInput,
  ChatToolCallOutput,
} from "@/components/ui/chat-tool-call"
import { ChatCodeBlock } from "@/components/ui/chat-code-block"
import {
  ChatPromptInput,
  ChatPromptInputTextarea,
  ChatPromptInputBody,
  ChatPromptInputToolbar,
  ChatPromptInputToolbarLeft,
  ChatPromptInputToolbarRight,
  ChatPromptInputAction,
  ChatPromptInputSubmit,
  ChatPromptInputStop,
} from "@/components/ui/chat-prompt-input"
import {
  ChatAttachments,
  ChatAttachment,
} from "@/components/ui/chat-attachments"
import {
  ChatSuggestions,
  ChatSuggestion,
} from "@/components/ui/chat-suggestions"
import {
  ChatTypingIndicator,
  ChatStreamingText,
  ChatSpinner,
} from "@/components/ui/chat-typing-indicator"
import { ChatSources, ChatSource } from "@/components/ui/chat-sources"
import { ChatBranch } from "@/components/ui/chat-branch"
import { ChatMarkdown } from "@/components/ui/chat-markdown"
import {
  ChatActionBar,
  ChatActionBarCopy,
  ChatActionBarEdit,
  ChatActionBarReload,
  ChatActionBarFeedbackPositive,
  ChatActionBarFeedbackNegative,
} from "@/components/ui/chat-action-bar"
import { ChatError } from "@/components/ui/chat-error"
import { ChatQuote } from "@/components/ui/chat-quote"
import { ChatInProgress } from "@/components/ui/chat-in-progress"
import {
  Plan,
  ProgressTracker,
  ApprovalCard,
  CodeBlock as ToolCodeBlock,
  DataTable,
  StatsDisplay,
  Chart,
  OrderSummary,
  LinkPreview,
  WeatherWidget,
  QuestionFlow,
  PreferencesPanel,
  GeoMap,
  Audio,
  MessageDraft,
  InstagramPost,
  XPost,
  ItemCarousel,
} from "@/packages/tool-ui/src"

function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-[56px] max-w-[1080px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Command className="size-4" />
          </div>
          <span className="text-title-secondary font-[590]">Neman</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {[
            { label: "Docs", href: "/docs" },
            { label: "Components", href: "/components" },
            { label: "AI", href: "/ai" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-[8px] px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors duration-150 hover:bg-fill-subtle hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs">Get Started</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

// ─── Demo: Chat Messages ──────────────────────────────────────────

function DemoMessages() {
  return (
    <div className="space-y-6">
      {/* User message */}
      <ChatMessage from="user">
        <ChatMessageContent from="user">
          <ChatMessageText>
            Can you help me write a function that calculates the Fibonacci sequence?
          </ChatMessageText>
        </ChatMessageContent>
      </ChatMessage>

      {/* Assistant message */}
      <ChatMessage from="assistant">
        <ChatMessageAvatar>
          <Sparkles className="size-4" />
        </ChatMessageAvatar>
        <ChatMessageContent from="assistant">
          <ChatMessageText>
            Sure! Here&apos;s a clean implementation of the Fibonacci sequence:
          </ChatMessageText>
          <ChatCodeBlock language="typescript" filename="fibonacci.ts">
{`function fibonacci(n: number): number[] {
  const sequence: number[] = [0, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return sequence.slice(0, n);
}

// Usage
console.log(fibonacci(10));
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`}
          </ChatCodeBlock>
          <ChatMessageText>
            This uses an iterative approach which is O(n) time and O(n) space. For very large numbers, you might want a matrix exponentiation approach instead.
          </ChatMessageText>
          <div className="flex items-center justify-between pt-1">
            <ChatMessageTimestamp>Just now</ChatMessageTimestamp>
            <ChatMessageActions>
              <ChatMessageAction title="Copy">
                <Copy className="size-3.5" />
              </ChatMessageAction>
            </ChatMessageActions>
          </div>
        </ChatMessageContent>
      </ChatMessage>

      {/* User follow-up */}
      <ChatMessage from="user">
        <ChatMessageContent from="user">
          <ChatMessageText>What about a memoized recursive version?</ChatMessageText>
        </ChatMessageContent>
      </ChatMessage>
    </div>
  )
}

// ─── Demo: Reasoning ──────────────────────────────────────────────

function DemoReasoning() {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-4">
      <ChatReasoning
        open={open}
        onOpenChange={setOpen}
        duration={3}
      >
        To find the optimal memoized Fibonacci implementation, I need to consider: (1) base cases
        for n=0 and n=1, (2) a memoization cache to avoid redundant calculations, and (3) proper
        TypeScript typing. The recursive approach with memoization gives us O(n) time complexity
        while maintaining the clarity of the mathematical definition.
      </ChatReasoning>

      <ChatReasoning isStreaming>
        Analyzing the problem structure and considering edge cases...
      </ChatReasoning>
    </div>
  )
}

// ─── Demo: Tool Calls ─────────────────────────────────────────────

function DemoToolCalls() {
  return (
    <div className="space-y-4">
      <ChatToolCall title="search_web" state="output-available">
        <ChatToolCallInput>
          <div className="space-y-1.5">
            <div className="text-label-secondary-bold text-muted-foreground">Parameters</div>
            <div className="rounded-[6px] bg-[var(--code-surface)] p-3 text-[13px] leading-[20px] text-[var(--code-surface-foreground)]">
              {`{ "query": "fibonacci memoization typescript" }`}
            </div>
          </div>
        </ChatToolCallInput>
        <div className="mt-3">
          <ChatToolCallOutput>
            Found 847 results for &quot;fibonacci memoization typescript&quot;. Top result:
            Dynamic Programming approach using a Map cache...
          </ChatToolCallOutput>
        </div>
      </ChatToolCall>

      <ChatToolCall title="run_code" state="output-error">
        <ChatToolCallOutput variant="error">
          TypeError: Cannot read property &apos;length&apos; of undefined at fibonacci (line 4)
        </ChatToolCallOutput>
      </ChatToolCall>
    </div>
  )
}

// ─── Demo: Loading States ─────────────────────────────────────────

function DemoLoadingStates() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <ChatMessageAvatar>
          <Sparkles className="size-4" />
        </ChatMessageAvatar>
        <div className="space-y-3">
          <ChatTypingIndicator />
        </div>
      </div>

      <ChatMessage from="assistant">
        <ChatMessageAvatar>
          <Sparkles className="size-4" />
        </ChatMessageAvatar>
        <ChatMessageContent from="assistant">
          <ChatMessageText>
            Here is the streaming response with a
            <ChatStreamingText> blinking cursor</ChatStreamingText>
          </ChatMessageText>
        </ChatMessageContent>
      </ChatMessage>

      <div className="flex items-center gap-3">
        <ChatSpinner />
        <span className="text-label-secondary text-muted-foreground">Processing...</span>
      </div>
    </div>
  )
}

// ─── Demo: Prompt Input ───────────────────────────────────────────

function DemoPromptInput() {
  const [message, setMessage] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="rounded-[22px] border border-border/50 bg-card shadow-[var(--shadow-card)] transition-all duration-300 focus-within:border-foreground/20 focus-within:shadow-[var(--shadow-drop-3)]">
        {/* Attachments area */}
        <ChatAttachments variant="inline">
          <ChatAttachment
            name="requirements.pdf"
            type="file"
            size="2.4 MB"
            onRemove={() => {}}
          />
          <ChatAttachment
            name="screenshot.png"
            type="image"
            onRemove={() => {}}
          />
        </ChatAttachments>

        <ChatPromptInput onSubmit={(e) => { e.preventDefault(); setIsStreaming(true) }}>
          <ChatPromptInputBody>
            <ChatPromptInputTextarea
              placeholder="Send a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </ChatPromptInputBody>
          <ChatPromptInputToolbar>
            <ChatPromptInputToolbarLeft>
              <ChatPromptInputAction title="Attach file">
                <Paperclip className="size-4" />
              </ChatPromptInputAction>
              <ChatPromptInputAction title="Search web">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.5 10.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </ChatPromptInputAction>
            </ChatPromptInputToolbarLeft>
            <ChatPromptInputToolbarRight>
              {isStreaming ? (
                <ChatPromptInputStop onClick={() => setIsStreaming(false)} />
              ) : (
                <ChatPromptInputSubmit />
              )}
            </ChatPromptInputToolbarRight>
          </ChatPromptInputToolbar>
        </ChatPromptInput>
      </div>

      {/* Suggestions */}
      <div className="mt-3">
        <ChatSuggestions>
          <ChatSuggestion onClick={() => setMessage("Explain recursion")}>Explain recursion</ChatSuggestion>
          <ChatSuggestion onClick={() => setMessage("Write a sort function")}>Write a sort function</ChatSuggestion>
          <ChatSuggestion onClick={() => setMessage("Debug my code")}>Debug my code</ChatSuggestion>
        </ChatSuggestions>
      </div>
    </div>
  )
}

// ─── Demo: Sources ────────────────────────────────────────────────

function DemoSources() {
  return (
    <ChatSources count={3}>
      <ChatSource title="MDN: Array.prototype.reduce()" url="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce" />
      <ChatSource title="TypeScript Handbook: Generics" url="https://www.typescriptlang.org/docs/handbook/2/generics.html" />
      <ChatSource title="Stack Overflow: Memoization patterns" url="https://stackoverflow.com/questions/1234567" />
    </ChatSources>
  )
}

// ─── Demo: Branching ──────────────────────────────────────────────

function DemoMarkdown() {
  const markdown = `Here's a quick reference for TypeScript patterns:

## Key Concepts

TypeScript adds **static typing** to JavaScript. You can define interfaces, use generics, and leverage type narrowing.

### Code Example

\`\`\`typescript
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
\`\`\`

### Comparison Table

| Approach | Time | Space | Readability |
|---|---|---|---|
| Recursive | O(2^n) | O(n) | High |
| Memoized | O(n) | O(n) | Medium |
| Iterative | O(n) | O(1) | Medium |

> Memoization trades space for time — cache results to avoid redundant computation.

- Use \`const\` by default, \`let\` only when reassignment is needed
- Prefer **interfaces** over type aliases for object shapes
- Use [TypeScript docs](https://www.typescriptlang.org/docs/) for reference

___`

  return (
    <div className="max-w-[600px]">
      <ChatMessage from="assistant">
        <ChatMessageAvatar>
          <Sparkles className="size-4" />
        </ChatMessageAvatar>
        <ChatMessageContent from="assistant">
          <ChatMarkdown>{markdown}</ChatMarkdown>
        </ChatMessageContent>
      </ChatMessage>
    </div>
  )
}

function DemoBranching() {
  const [branch, setBranch] = useState(0)
  const responses = [
    "The iterative approach is generally preferred for Fibonacci due to its O(n) time complexity.",
    "A recursive approach with memoization maintains mathematical clarity while achieving O(n) performance.",
    "Using matrix exponentiation, you can achieve O(log n) time for single Fibonacci number calculations.",
  ]

  return (
    <div className="space-y-2">
      <ChatBranch
        branchCount={3}
        currentBranch={branch}
        onBranchChange={setBranch}
      />
      <p className="text-body-primary text-foreground">{responses[branch]}</p>
    </div>
  )
}

// ─── Demo: Conversation ────────────────────────────────────────────

function DemoFullConversation() {
  return (
    <div className="mx-auto w-full max-w-[640px] rounded-[22px] border border-border bg-card shadow-[var(--shadow-card)]">
      <ChatConversation className="h-[520px]">
        <ChatMessage from="user">
          <ChatMessageContent from="user">
            <ChatMessageText>
              What are the differences between O(n log n) and O(n²) sorting algorithms?
            </ChatMessageText>
          </ChatMessageContent>
        </ChatMessage>

        <ChatMessage from="assistant">
          <ChatMessageAvatar>
            <Sparkles className="size-4" />
          </ChatMessageAvatar>
          <ChatMessageContent from="assistant">
            <ChatMessageText>Let me think about this comparison...</ChatMessageText>
            <div className="mt-2">
              <ChatReasoning duration={2}>
                I need to compare the time complexity, practical performance, and use cases of
                O(n log n) algorithms (like merge sort, quicksort) vs O(n²) algorithms (like
                bubble sort, insertion sort). The key insight is that O(n log n) scales
                significantly better for large datasets.
              </ChatReasoning>
            </div>
            <div className="mt-2">
              <ChatSources count={2}>
                <ChatSource title="Big O Cheat Sheet" url="https://www.bigocheatsheet.com" />
                <ChatSource title="Algorithm Design Manual" url="https://algorithm.design.manual.com" />
              </ChatSources>
            </div>
            <ChatMessageText className="mt-2">
              Here&apos;s a quick comparison:
            </ChatMessageText>
            <ChatCodeBlock language="typescript" filename="sorting-comparison.ts">
{`// O(n log n) - Merge Sort
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

// O(n²) - Insertion Sort
function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`}
            </ChatCodeBlock>
            <ChatMessageActions>
              <ChatMessageAction title="Copy">
                <Copy className="size-3.5" />
              </ChatMessageAction>
            </ChatMessageActions>
          </ChatMessageContent>
        </ChatMessage>

        <ChatMessage from="user">
          <ChatMessageContent from="user">
            <ChatMessageText>Which one should I use for small arrays?</ChatMessageText>
          </ChatMessageContent>
        </ChatMessage>

        <ChatMessage from="assistant">
          <ChatMessageAvatar>
            <Sparkles className="size-4" />
          </ChatMessageAvatar>
          <ChatMessageContent from="assistant">
            <ChatTypingIndicator />
          </ChatMessageContent>
        </ChatMessage>
      </ChatConversation>

      {/* Input area below */}
      <div className="border-t border-border/30 p-4">
        <div className="rounded-[18px] border border-border/50 bg-fill-subtle/60 transition-all duration-300 focus-within:border-foreground/20 focus-within:shadow-[var(--shadow-drop-2)]">
          <ChatPromptInput>
            <ChatPromptInputBody>
              <ChatPromptInputTextarea placeholder="Ask a follow-up question..." />
            </ChatPromptInputBody>
            <ChatPromptInputToolbar>
              <ChatPromptInputToolbarLeft />
              <ChatPromptInputToolbarRight>
                <ChatPromptInputSubmit />
              </ChatPromptInputToolbarRight>
            </ChatPromptInputToolbar>
          </ChatPromptInput>
        </div>
      </div>
    </div>
  )
}

// ─── Demo: Action Bar ────────────────────────────────────────────

function DemoActionBar() {
  const [copied, setCopied] = useState(false)
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <p className="text-label-secondary text-muted-foreground">Action bar with all actions:</p>
        <ChatActionBar>
          <ChatActionBarCopy value="Hello, world!" />
          <ChatActionBarEdit onClick={() => {}} />
          <ChatActionBarReload onClick={() => {}} />
          <ChatActionBarFeedbackPositive onClick={() => {}} />
          <ChatActionBarFeedbackNegative onClick={() => {}} />
        </ChatActionBar>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-label-secondary text-muted-foreground">Minimal action bar:</p>
        <ChatActionBar>
          <ChatActionBarCopy value="Copy this text" />
          <ChatActionBarReload onClick={() => {}} />
        </ChatActionBar>
      </div>
    </div>
  )
}

// ─── Demo: Error & Quote ──────────────────────────────────────────

function DemoErrorAndQuote() {
  return (
    <div className="space-y-4">
      <ChatError error="Failed to generate response. The model encountered an unexpected error." onRetry={() => {}} />
      <ChatError error={new Error("Network request timed out after 30 seconds")} onRetry={() => {}} />
      <ChatQuote onDismiss={() => {}}>
        The iterative approach is generally preferred for Fibonacci due to its O(n) time complexity and O(1) space usage.
      </ChatQuote>
    </div>
  )
}

// ─── Demo: In Progress ──────────────────────────────────────────

function DemoInProgress() {
  return (
    <div className="space-y-3">
      <ChatInProgress />
      <p className="text-label-secondary text-muted-foreground">Shows alongside an assistant message while streaming.</p>
    </div>
  )
}

// ─── Demo: Tool UI Components ──────────────────────────────────────

function DemoToolUI() {
  const [prefValues, setPrefValues] = useState<Record<string, string | boolean | number>>({})
  const [qAnswers, setQAnswers] = useState<Record<string, string | string[] | boolean>>({})

  return (
    <div className="space-y-8">
      {/* Plan */}
      <Plan
        steps={[
          { id: "1", title: "Analyze requirements", status: "complete" },
          { id: "2", title: "Design architecture", status: "complete" },
          { id: "3", title: "Implement core features", status: "running" },
          { id: "4", title: "Write tests", status: "pending" },
          { id: "5", title: "Deploy to production", status: "pending" },
        ]}
      />

      {/* Progress Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressTracker.Horizontal
          steps={[
            { id: "1", label: "Upload", status: "complete" },
            { id: "2", label: "Process", status: "running" },
            { id: "3", label: "Review", status: "pending" },
            { id: "4", label: "Done", status: "pending" },
          ]}
        />
        <ProgressTracker.Vertical
          steps={[
            { id: "1", label: "Clone repository", status: "complete" },
            { id: "2", label: "Install dependencies", status: "complete" },
            { id: "3", label: "Run build", status: "running" },
            { id: "4", label: "Deploy", status: "pending" },
          ]}
        />
      </div>

      {/* Approval Card */}
      <ApprovalCard
        title="Deploy to Production"
        description="This will push the latest build to production. All tests have passed."
        onApprove={() => {}}
        onDeny={() => {}}
      />

      {/* Stats Display */}
      <StatsDisplay
        title="Analytics Overview"
        stats={[
          { label: "Users", value: 12847, change: 12.5 },
          { label: "Revenue", value: "$48.2K", change: 8.3 },
          { label: "Conversion", value: "3.2%", change: -1.4 },
          { label: "Sessions", value: 45021, change: 15.7 },
        ]}
      />

      {/* Chart */}
      <Chart
        type="bar"
        title="Monthly Revenue"
        labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
        datasets={[{ name: "Revenue", data: [
          { label: "Jan", value: 4200 },
          { label: "Feb", value: 5800 },
          { label: "Mar", value: 4900 },
          { label: "Apr", value: 7200 },
          { label: "May", value: 6100 },
          { label: "Jun", value: 8400 },
        ]}]}
      />

      {/* Order Summary */}
      <OrderSummary
        orderId="ORD-2847"
        title="Order Summary"
        lines={[
          { id: "1", label: "Pro Plan", quantity: 1, unitPrice: 29.00, total: 29.00, status: "confirmed" },
          { id: "2", label: "Extra Storage", description: "100 GB additional", quantity: 2, unitPrice: 5.00, total: 10.00 },
          { id: "3", label: "Priority Support", description: "24/7 chat & email", quantity: 1, unitPrice: 9.99, total: 9.99, status: "pending" },
        ]}
        subtotal={48.99}
        tax={4.41}
        total={53.40}
        currency="USD"
        status="confirmed"
      />

      {/* Link Preview */}
      <LinkPreview
        url="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
        title="JavaScript | MDN"
        description="Comprehensive JavaScript documentation including guides, references, and tutorials."
        domain="developer.mozilla.org"
        image="https://avatars.githubusercontent.com/mdn"
      />

      {/* Weather Widget */}
      <div className="max-w-sm">
        <WeatherWidget
          location="San Francisco, CA"
          currentTemp={18}
          condition="partly_cloudy"
          high={22}
          low={14}
          humidity={72}
          windSpeed={18}
          feelsLike={16}
          units="celsius"
          daily={[
            { day: "Mon", high: 22, low: 14, condition: "partly_cloudy" },
            { day: "Tue", high: 20, low: 13, condition: "cloudy" },
            { day: "Wed", high: 17, low: 11, condition: "rainy" },
            { day: "Thu", high: 19, low: 12, condition: "sunny" },
            { day: "Fri", high: 23, low: 15, condition: "sunny" },
          ]}
        />
      </div>

      {/* Question Flow */}
      <QuestionFlow
        title="Project Setup"
        questions={[
          { id: "framework", type: "select", question: "Which framework?", options: ["React", "Vue", "Svelte", "Angular"], required: true },
          { id: "typescript", type: "confirm", question: "Use TypeScript?", description: "Recommended for all new projects" },
          { id: "name", type: "text", question: "Project name", placeholder: "my-project", required: true },
        ]}
        answers={qAnswers}
        onAnswersChange={setQAnswers}
       receipt={undefined}
      />

      {/* Preferences Panel */}
      <PreferencesPanel
        title="Preferences"
        preferences={[
          { type: "toggle", key: "darkMode", label: "Dark Mode", description: "Use dark theme", defaultValue: true },
          { type: "select", key: "language", label: "Language", options: [{ label: "English", value: "en" }, { label: "Japanese", value: "ja" }, { label: "Spanish", value: "es" }], defaultValue: "en" },
          { type: "slider", key: "fontSize", label: "Font Size", min: 12, max: 24, step: 1, unit: "px", defaultValue: 16 },
        ]}
        values={prefValues}
        onValuesChange={setPrefValues}
      />

      {/* Data Table */}
      <DataTable
        title="Team Members"
        columns={[
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status", format: "status" },
        ]}
        rows={[
          { name: "Alice Chen", role: "Engineer", status: "active" },
          { name: "Bob Rivera", role: "Designer", status: "active" },
          { name: "Carol Wu", role: "PM", status: "away" },
          { name: "Dave Park", role: "Engineer", status: "offline" },
        ]}
      />

      {/* Audio */}
      <Audio
        src="/audio-sample.mp3"
        title="Design Review Notes"
        artist="AI Assistant"
        duration={245}
        waveformData={[0.3, 0.6, 0.8, 0.4, 0.2, 0.5, 0.9, 0.7, 0.3, 0.5, 0.8, 0.6, 0.4, 0.7, 0.5, 0.3, 0.6, 0.8, 0.4, 0.2, 0.5, 0.7, 0.9, 0.6, 0.3, 0.5, 0.7, 0.4, 0.2, 0.6, 0.8, 0.5, 0.3, 0.7, 0.4, 0.6, 0.8, 0.3, 0.5, 0.7]}
      />
    </div>
  )
}

// ─── Demo: Social Posts ──────────────────────────────────────────

function DemoSocialPosts() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InstagramPost
          username="neman.design"
          displayName="Neman Design"
          verified
          images={["https://picsum.photos/seed/neman1/400/400"]}
          caption="New component library dropping this week. 22px radius everywhere."
          likes={2847}
          comments={142}
          timestamp="2025-01-15T10:30:00Z"
          location="San Francisco, CA"
        />

        <XPost
          username="neman_ui"
          handle="neman_ui"
          verified
          content="Introducing 28 tool-UI components with Zod validation, receipt states, and neman design tokens. Every component you need for rich AI interactions."
          likes={512}
          retweets={89}
          replies={34}
          views={12400}
          timestamp="2h"
        />
      </div>

      <ItemCarousel
        title="Recommended Resources"
        layout="horizontal"
        items={[
          { id: "1", title: "React Docs", description: "Official React documentation", badge: "Free", image: "https://picsum.photos/seed/react/200/200" },
          { id: "2", title: "TypeScript Handbook", description: "Complete TypeScript guide", image: "https://picsum.photos/seed/ts/200/200" },
          { id: "3", title: "Tailwind CSS", description: "Utility-first CSS framework", badge: "Popular", image: "https://picsum.photos/seed/tw/200/200" },
          { id: "4", title: "Next.js Guide", description: "Full-stack React framework", image: "https://picsum.photos/seed/next/200/200" },
          { id: "5", title: "Radix UI", description: "Accessible component primitives", badge: "New", image: "https://picsum.photos/seed/radix/200/200" },
        ]}
      />
    </div>
  )
}

// ─── Demo: Message Draft ──────────────────────────────────────────

function DemoMessageDraft() {
  const [draft, setDraft] = useState("Hi team, I wanted to follow up on our discussion about the Q2 roadmap...")
  return (
    <div className="space-y-4">
      <MessageDraft
        title="Email Draft"
        body={draft}
        onChange={(body: string) => setDraft(body)}
        recipient="Product Team"
        tone="professional"
        maxLength={500}
      />
    </div>
  )
}

// ─── Demo: GeoMap ──────────────────────────────────────────────────

function DemoGeoMap() {
  return (
    <div className="max-w-lg">
      <GeoMap
        title="Office Locations"
        markers={[
          { position: { lat: 37.7749, lng: -122.4194 }, label: "SF HQ", description: "Main headquarters" },
          { position: { lat: 40.7128, lng: -74.006 }, label: "NYC Office", description: "East coast hub" },
          { position: { lat: 51.5074, lng: -0.1278 }, label: "London", description: "European operations", color: "var(--color-success)" },
        ]}
        interactive
      />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────

export default function AIPage() {
  const sections = [
    { id: "messages", label: "Messages" },
    { id: "reasoning", label: "Reasoning" },
    { id: "tools", label: "Tool Calls" },
    { id: "loading", label: "Loading" },
    { id: "input", label: "Input" },
    { id: "sources", label: "Sources" },
    { id: "branching", label: "Branching" },
    { id: "action-bar", label: "Action Bar" },
    { id: "error-quote", label: "Error & Quote" },
    { id: "tool-ui", label: "Tool UI" },
    { id: "social", label: "Social Posts" },
    { id: "draft", label: "Message Draft" },
    { id: "map", label: "Geo Map" },
    { id: "full", label: "Full Chat" },
  ]

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-fill-subtle">
          <div className="mx-auto max-w-[1080px] px-6 py-16">
            <Badge variant="blue" className="mb-4">AI Components</Badge>
            <h1 className="neman-hero-title mb-4 text-[36px] leading-[44px] text-foreground">
              Chat interfaces,<br />beautifully crafted.
            </h1>
            <p className="max-w-[600px] text-body-secondary text-muted-foreground">
              A comprehensive set of AI chat components built with the Neman design language.
              Messages, reasoning, tool calls, code blocks, streaming, and more — all with
              22px radius, weight 590, and micro-shadow depth.
            </p>
          </div>
        </section>

        {/* Section nav */}
        <div className="sticky top-[56px] z-30 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1080px] gap-1 overflow-x-auto px-6 py-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors duration-150 hover:bg-fill-subtle hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-[1080px] px-6 py-16 space-y-24">

          {/* Messages */}
          <section id="messages">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Chat Messages</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                User and assistant message bubbles with avatars, actions, and timestamps.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoMessages />
            </div>
          </section>

          {/* Reasoning */}
          <section id="reasoning">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Reasoning</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Collapsible thinking/reasoning panels that auto-expand during streaming.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoReasoning />
            </div>
          </section>

          {/* Tool Calls */}
          <section id="tools">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Tool Calls</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Collapsible tool call panels with status badges, parameter inputs, and result outputs.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoToolCalls />
            </div>
          </section>

          {/* Loading States */}
          <section id="loading">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Loading States</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Typing indicators, streaming text with cursor, and spinners.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoLoadingStates />
            </div>
          </section>

          {/* Prompt Input */}
          <section id="input">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Prompt Input</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Rich input area with auto-growing textarea, file attachments, toolbar actions, and suggestion chips.
              </p>
            </div>
            <DemoPromptInput />
          </section>

          {/* Sources */}
          <section id="sources">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Sources</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Collapsible references with source links and hostname display.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoSources />
            </div>
          </section>

          {/* Markdown Rendering */}
          <section id="markdown">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Markdown</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Rich markdown rendering with GFM tables, syntax highlighting, and Neman styling.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoMarkdown />
            </div>
          </section>

          {/* Branching */}
          <section id="branching">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Branching</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Navigate between alternative model responses with previous/next controls.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoBranching />
            </div>
          </section>

          {/* Action Bar */}
          <section id="action-bar">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Action Bar</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Floating action bars that appear on message hover — copy, edit, regenerate, and feedback.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoActionBar />
            </div>
          </section>

          {/* Error & Quote */}
          <section id="error-quote">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Error & Quote</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Error states with retry and quoted reply blocks for context.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoErrorAndQuote />
            </div>
          </section>

          {/* Tool UI */}
          <section id="tool-ui">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Tool UI Components</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Rich tool call renderers — plans, progress trackers, approvals, data tables, charts, order summaries, and more.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoToolUI />
            </div>
          </section>

          {/* Social Posts */}
          <section id="social">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Social Posts & Carousels</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Render social media posts and item carousels with full visual fidelity.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoSocialPosts />
            </div>
          </section>

          {/* Message Draft */}
          <section id="draft">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Message Draft</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Compose and edit messages with tone selection, character counting, and recipients.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoMessageDraft />
            </div>
          </section>

          {/* Geo Map */}
          <section id="map">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Geo Map</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                Interactive map visualization with markers, labels, and coordinate display.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <DemoGeoMap />
            </div>
          </section>

          {/* Full Conversation */}
          <section id="full">
            <div className="mb-8">
              <h2 className="text-title-tertiary font-[590] text-foreground">Full Conversation</h2>
              <p className="mt-2 text-body-secondary text-muted-foreground">
                All components composed together: messages, reasoning, code blocks, sources, branching, and input.
              </p>
            </div>
            <DemoFullConversation />
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-fill-subtle">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-8">
          <span className="text-sm text-muted-foreground">
            © 2025 Neman UI. Built with Radix UI and Tailwind CSS.
          </span>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground">
              Home
            </Link>
            <Link href="/components" className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground">
              Components
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}