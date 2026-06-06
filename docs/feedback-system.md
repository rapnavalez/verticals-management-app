# Feedback System

Reference guide for surfacing feedback to dashboard users. Covers the four patterns in use, when to reach for each, and the exact shadcn components that back them.

All four patterns are already installed. The only setup step still pending is adding `<Toaster>` to the root layout (see §1).

---

## Quick-reference

| Pattern | Component | When to use |
|---|---|---|
| **Toast** | `sonner` → `toast()` | Non-blocking confirmation of a completed action |
| **Inline message** | `Alert` | Form-level or section-level error/warning tied to a specific element |
| **Banner / Callout** | `Alert` (full-width) | Page-level status that persists until resolved (billing, unverified email, etc.) |
| **Modal / Dialog** | `Dialog` | Focused task that needs its own context — forms, detail views |
| **Confirmation dialog** | `AlertDialog` | Destructive or irreversible action that requires explicit consent |

---

## 1. Toast

**Component:** `components/ui/sonner.tsx` — wraps [Sonner](https://sonner.emilkowal.ski/) with Remixicon icons and theme support.

### Setup

`<Toaster>` must be rendered once at the app root. Add it to `app/layout.tsx`:

```tsx
import { Toaster } from "@/components/ui/sonner"

// Inside RootLayout, alongside ThemeProvider:
<ThemeProvider>
  <Toaster />
  {children}
</ThemeProvider>
```

### Usage

Call `toast()` from `sonner` directly — no hook needed.

```tsx
import { toast } from "sonner"

// Success (most common)
toast.success("Appointment confirmed")

// With description
toast.success("Appointment confirmed", {
  description: "Juan dela Cruz · Today at 2:00 PM",
})

// Error (for unexpected/system failures only — see §2 for form errors)
toast.error("Something went wrong. Please try again.")

// Loading → resolve pattern (long async ops)
const id = toast.loading("Saving changes…")
// after await:
toast.success("Changes saved", { id })

// Undo action
toast("Appointment cancelled", {
  action: { label: "Undo", onClick: () => restoreAppointment(id) },
})
```

### When to use toasts

- Confirming a completed mutation (saved, deleted, sent, cancelled)
- Background operation results the user didn't actively wait for
- Undo affordance on soft-deletes

### When NOT to use toasts

- Form validation errors → use inline `Alert` inside the form
- Errors requiring user action → use inline `Alert` or `AlertDialog`
- Status that must persist across navigations → use a banner

---

## 2. Inline Message

**Component:** `components/ui/alert.tsx` — exports `Alert`, `AlertTitle`, `AlertDescription`, `AlertAction`.

Variants: `default` (neutral/info) and `destructive` (error/warning).

### Usage

```tsx
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert"
import { RiErrorWarningLine, RiInformationLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"

// Form-level error (e.g. loginAction returns an error string)
{error && (
  <Alert variant="destructive">
    <RiErrorWarningLine />
    <AlertTitle>Sign-in failed</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}

// Info with action
<Alert>
  <RiInformationLine />
  <AlertTitle>Email not verified</AlertTitle>
  <AlertDescription>Check your inbox to verify your address.</AlertDescription>
  <AlertAction>
    <Button variant="outline" size="sm" onClick={resendEmail}>
      Resend
    </Button>
  </AlertAction>
</Alert>
```

### When to use inline messages

- Authentication / Server Action errors rendered inside a form
- Field-group level warnings (e.g. "No staff assigned to this service")
- Contextual tips scoped to a card or section

---

## 3. Banner / Callout

Same `Alert` component, placed full-width above page content or inside a layout shell.

### Usage

```tsx
// In a layout or page — rendered above the main content area
<Alert className="rounded-none border-x-0 border-t-0">
  <RiErrorWarningLine />
  <AlertTitle>Your trial ends in 3 days</AlertTitle>
  <AlertDescription>
    Upgrade to keep access to all features.
  </AlertDescription>
  <AlertAction>
    <Button size="sm">Upgrade now</Button>
  </AlertAction>
</Alert>
```

### When to use banners

- Account-level conditions that affect the whole session (trial expiry, unverified email, suspended account)
- Maintenance or downtime notices
- Conditions that must remain visible until resolved — do not use a toast for these

---

## 4. Dialog (Modal)

**Component:** `components/ui/dialog.tsx`

Blocks the underlying page but allows the user to dismiss freely. Use for focused tasks: editing a record, viewing details, filling a sub-form.

### Usage

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Edit service</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit service</DialogTitle>
      <DialogDescription>Update the name, duration, and price.</DialogDescription>
    </DialogHeader>

    {/* form fields */}

    <DialogFooter showCloseButton>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

`DialogContent` renders a close button (×) by default. Pass `showCloseButton={false}` to remove it. `DialogFooter` accepts `showCloseButton` to render a labelled "Close" button alongside action buttons.

### When to use Dialog

- Create / edit forms that are too complex for an inline expand
- Detail view panels (appointment notes, customer history)
- Any multi-step flow that benefits from isolation

---

## 5. Confirmation Dialog (AlertDialog)

**Component:** `components/ui/alert-dialog.tsx`

Does **not** allow dismissal by clicking the overlay or pressing Escape — the user must choose an action. Use only for destructive or irreversible operations.

Exports: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogMedia`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogAction`, `AlertDialogCancel`.

`AlertDialogContent` accepts `size="sm"` (stacked buttons, centered text) or `size="default"` (side-by-side buttons, left-aligned text on desktop).

### Usage

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { RiDeleteBinLine } from "@remixicon/react"

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete service</Button>
  </AlertDialogTrigger>
  <AlertDialogContent size="sm">
    <AlertDialogHeader>
      <AlertDialogMedia>
        <RiDeleteBinLine />
      </AlertDialogMedia>
      <AlertDialogTitle>Delete service?</AlertDialogTitle>
      <AlertDialogDescription>
        This will remove the service and all associated schedule data. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive" onClick={handleDelete}>
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

`AlertDialogAction` and `AlertDialogCancel` accept `variant` and `size` from the `Button` component.

### When to use AlertDialog

- Deleting any record (service, staff member, appointment, customer)
- Cancelling a confirmed appointment
- Revoking access or changing a role to a lower permission
- Any action described as "this cannot be undone"

### When NOT to use AlertDialog

- Saving or submitting a form — use `Dialog` instead
- Warnings that are informational — use `Alert`
- Anything the user can recover from — `toast` with an undo action is less disruptive

---

## Decision flowchart

```
Did the action just complete?
└─ Yes → Toast (success/error)

Is the error tied to a specific form or section?
└─ Yes → Inline Alert (variant="destructive")

Does the status need to persist across the whole session?
└─ Yes → Banner Alert (full-width)

Does the user need to do a focused sub-task?
└─ Yes → Dialog

Is the action destructive / irreversible?
└─ Yes → AlertDialog
└─ No  → Dialog or inline, depending on complexity
```
