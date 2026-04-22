"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function ComponentsPage() {
  const [switchChecked, setSwitchChecked] = useState(false)

  return (
    <div className="min-h-svh bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-3">
          <Link href="/" className="text-title-secondary font-[590]">Neman UI</Link>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-label-secondary text-muted-foreground hover:text-foreground transition-colors duration-150">Docs</Link>
            <Link href="/components" className="text-label-secondary text-muted-foreground hover:text-foreground transition-colors duration-150">Components</Link>
            <Link href="/ai" className="text-label-secondary text-muted-foreground hover:text-foreground transition-colors duration-150">AI</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1080px] px-6 py-12">
        <h1 className="text-headline-tertiary font-[590] mb-2">Components</h1>
        <p className="text-body-secondary text-muted-foreground mb-12">
          All Neman UI components with the warm, ultra-rounded, refined aesthetic.
        </p>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Button</h2>
          <div className="rounded-2xl border border-border p-6 space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Primary</Button>
              <Button variant="blue">Blue</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button variant="blue" disabled>Disabled Blue</Button>
            </div>
          </div>
        </section>

        {/* Input */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Input</h2>
          <div className="rounded-2xl border border-border p-6 space-y-4 max-w-md">
            <Input placeholder="Search..." />
            <Input type="email" placeholder="Email address" />
            <Input disabled value="Disabled input" />
            <Textarea placeholder="Write something..." />
          </div>
        </section>

        {/* Card */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Card</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-body-primary">Push notifications</span>
                  <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm">Save Changes</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Invite your team members.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-fill-subtle flex items-center justify-center text-label-primary font-[590]">A</div>
                  <div>
                    <div className="text-body-primary font-[590]">Alex Chen</div>
                    <div className="text-label-primary text-muted-foreground">alex@example.com</div>
                  </div>
                  <Badge variant="blue" className="ml-auto">Admin</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-fill-subtle flex items-center justify-center text-label-primary font-[590]">B</div>
                  <div>
                    <div className="text-body-primary font-[590]">Bella Kim</div>
                    <div className="text-label-primary text-muted-foreground">bella@example.com</div>
                  </div>
                  <Badge variant="secondary" className="ml-auto">Member</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badge */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Badge</h2>
          <div className="rounded-2xl border border-border p-6">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="blue">Blue</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Tabs</h2>
          <div className="rounded-2xl border border-border p-6">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <p className="text-body-primary text-muted-foreground">This is the overview tab content. The tabs use rounded-full for the pill shape.</p>
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <p className="text-body-primary text-muted-foreground">Analytics data and charts would go here.</p>
              </TabsContent>
              <TabsContent value="settings" className="mt-4">
                <p className="text-body-primary text-muted-foreground">Settings and configuration options.</p>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Dialog */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Dialog</h2>
          <div className="rounded-2xl border border-border p-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>Make changes to your profile here. Click save when done.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder="Display name" />
                  <Textarea placeholder="Bio" />
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="blue">Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Dropdown Menu */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Dropdown Menu</h2>
          <div className="rounded-2xl border border-border p-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Select */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Select</h2>
          <div className="rounded-2xl border border-border p-6 max-w-xs">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Form Controls */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Form Controls</h2>
          <div className="rounded-2xl border border-border p-6 space-y-4 max-w-md">
            <div className="flex items-center gap-3">
              <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
              <span className="text-body-primary">Enable notifications</span>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-body-primary cursor-pointer">Accept terms and conditions</label>
            </div>
            <div className="space-y-2">
              <label className="text-body-primary font-[590]">Volume</label>
              <Slider defaultValue={[50]} />
            </div>
          </div>
        </section>

        {/* Tooltip */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Tooltip</h2>
          <div className="rounded-2xl border border-border p-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a tooltip</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        {/* Table */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Table</h2>
          <div className="rounded-2xl border border-border">
            <Table>
              <TableCaption>A list of recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>INV001</TableCell>
                  <TableCell><Badge variant="success">Paid</Badge></TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INV002</TableCell>
                  <TableCell><Badge variant="warning">Pending</Badge></TableCell>
                  <TableCell>PayPal</TableCell>
                  <TableCell className="text-right">$150.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INV003</TableCell>
                  <TableCell><Badge variant="destructive">Overdue</Badge></TableCell>
                  <TableCell>Bank Transfer</TableCell>
                  <TableCell className="text-right">$350.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Skeleton & Spinner */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Skeleton & Spinner</h2>
          <div className="rounded-2xl border border-border p-6 space-y-4 max-w-md">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Spinner />
              <span className="text-body-primary text-muted-foreground">Loading...</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}