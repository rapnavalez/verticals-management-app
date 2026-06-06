# Loading System

Reference guide for communicating loading and in-progress states. Covers spinners, skeletons, and progress bars — plus how they connect to Next.js Suspense boundaries and Server Action pending states.

---

## Quick-reference

| Pattern | Component | When to use |
|---|---|---|
| **Spinner** | `Spinner` | Button/action pending state; small inline loaders |
| **Skeleton** | `Skeleton` | Content area loading — mirrors the shape of what will appear |
| **Progress bar** | `Progress` | Multi-step flows or file uploads with a known percentage |
| **Route skeleton** | `app/.../loading.tsx` | Full-page or layout-level Suspense boundary |

---

## 1. Spinner

**Component:** `components/ui/spinner.tsx` — wraps `RiLoaderLine` with `animate-spin`. Accepts all SVG props except `children`.

### Usage

```tsx
import { Spinner } from "@/components/ui/spinner"

// Standalone
<Spinner className="size-5 text-muted-foreground" />

// Inside a button during a Server Action (useActionState pattern)
const [error, action, isPending] = useActionState(loginAction, null)

<Button type="submit" disabled={isPending}>
  {isPending ? <Spinner className="size-4" /> : null}
  {isPending ? "Saving…" : "Save"}
</Button>

// Centered full-area loader (e.g. inside a card while data fetches)
<div className="flex h-40 items-center justify-center">
  <Spinner className="size-6 text-muted-foreground" />
</div>
```

### When to use spinners

- A button that triggers an async action (submit, save, delete)
- A small inline area (dropdown, combobox) that is fetching data
- As a fallback inside a `<Suspense>` boundary when a skeleton would be disproportionate

### When NOT to use spinners

- Full content areas that will render a list or table → use Skeleton
- File uploads or multi-step flows with measurable progress → use Progress

---

## 2. Skeleton

**Component:** `components/ui/skeleton.tsx` — an `animate-pulse` div. Mirror the layout of the content it replaces using `className` for size and shape.

### Usage

```tsx
import { Skeleton } from "@/components/ui/skeleton"

// Card header: avatar + two lines of text
<div className="flex items-center gap-3">
  <Skeleton className="size-10 rounded-full" />
  <div className="flex flex-col gap-2">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-3 w-20" />
  </div>
</div>

// Table rows
{Array.from({ length: 5 }).map((_, i) => (
  <div key={i} className="flex items-center gap-4 py-3">
    <Skeleton className="h-4 w-1/4" />
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-4 w-1/5" />
    <Skeleton className="ml-auto h-4 w-16" />
  </div>
))}

// Stat card
<div className="flex flex-col gap-2 p-4">
  <Skeleton className="h-3 w-24" />
  <Skeleton className="h-8 w-16" />
</div>
```

### Composing skeleton screens

Build a skeleton that matches the visual weight of the real content — same number of rows, similar column widths. The goal is to reduce layout shift when data arrives.

Name skeleton components after the thing they stand in for:

```tsx
// components/appointments/appointments-table-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function AppointmentsTableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="ml-auto h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}
```

### When to use skeletons

- Any content area that fetches data asynchronously (tables, lists, cards, dashboards)
- As the fallback inside a `<Suspense>` boundary wrapping async Server Components

### When NOT to use skeletons

- Buttons or small inline actions → use Spinner
- Content that loads in under ~300 ms — a flash of skeleton is worse than nothing

---

## 3. Progress Bar

**Component:** `components/ui/progress.tsx` — Radix UI `Progress.Root` + `Progress.Indicator`. `value` is 0–100.

### Usage

```tsx
import { Progress } from "@/components/ui/progress"

// Static value
<Progress value={60} />

// Controlled during a multi-step flow
const [step, totalSteps] = [2, 4]
<Progress value={(step / totalSteps) * 100} />

// File upload with known bytes
<Progress value={(uploaded / total) * 100} />

// Indeterminate (animates indefinitely) — omit value or pass null
<Progress />
```

`Progress` defaults to `h-3` and full width. Adjust height and width via `className`:

```tsx
// Thin progress in a page header
<Progress value={progress} className="h-1 rounded-none" />
```

### When to use progress bars

- Onboarding flows with discrete steps (e.g. "Step 2 of 4 — Add your services")
- File or image uploads where bytes transferred are known
- Bulk operations (importing customers, syncing schedules) with a countable item count

### When NOT to use progress bars

- Actions with unknown duration → use Spinner
- Page-level route loading → use `loading.tsx` with Skeleton

---

## 4. Route-level loading (`loading.tsx`)

Next.js App Router automatically wraps each `loading.tsx` in a React `<Suspense>` boundary. The file renders instantly while the page's async Server Components resolve.

### Convention

Place `loading.tsx` alongside `page.tsx` for any route that fetches data:

```
app/
  (dashboard)/
    appointments/
      loading.tsx   ← shown while page.tsx awaits
      page.tsx
    customers/
      loading.tsx
      page.tsx
```

### Pattern

Use a named skeleton component as the loading UI rather than a generic spinner:

```tsx
// app/(dashboard)/appointments/loading.tsx
import { AppointmentsTableSkeleton } from "@/components/appointments/appointments-table-skeleton"

export default function AppointmentsLoading() {
  return <AppointmentsTableSkeleton />
}
```

For nested layouts, place `loading.tsx` only at the level where data is fetched — not in every segment.

---

## 5. Suspense boundaries inside pages

For components that fetch independently within a page (e.g. a stats widget alongside a table), wrap them in explicit `<Suspense>` rather than relying on the route-level `loading.tsx`:

```tsx
import { Suspense } from "react"
import { AppointmentsTable } from "@/components/appointments/appointments-table"
import { AppointmentsTableSkeleton } from "@/components/appointments/appointments-table-skeleton"
import { StatsSkeleton } from "@/components/dashboard/stats-skeleton"
import { StatsCards } from "@/components/dashboard/stats-cards"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>
      <Suspense fallback={<AppointmentsTableSkeleton />}>
        <AppointmentsTable />
      </Suspense>
    </div>
  )
}
```

This lets each section stream in independently rather than blocking the whole page on the slowest query.

---

## Decision flowchart

```
Is the progress measurable (0–100%)?
└─ Yes → Progress bar

Is it a button or small inline action?
└─ Yes → Spinner (inside/beside the button)

Is it a full content area (list, table, cards)?
└─ Yes → Skeleton screen
   └─ Via Next.js route? → loading.tsx + Skeleton
   └─ Via Suspense inside a page? → <Suspense fallback={<Skeleton />}>

Is it a tiny area where a skeleton would be disproportionate?
└─ Yes → Spinner (centered in the area)
```
