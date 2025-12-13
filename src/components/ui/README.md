# Vyxo Codex UI Component Library

> Professional, accessible, and consistent UI components following the Vyxo Codex design system.

**Design Philosophy:** Clarity over beauty. Structure over creativity. Confidence over wow effect.

---

## 📦 Installation

All components are already part of the Vyxo Codex project. Import them from `@/components/ui`:

```tsx
import { Button, Card, Table } from '@/components/ui';
```

---

## 🎨 Design Tokens

Design tokens are defined in `/src/styles/tokens.css` and integrated with Tailwind config.

### Key Variables

```css
/* Colors */
--background-primary: #0A0E14;
--text-primary: #E6E9F0;
--accent-primary: #3B82F6;
--status-success: #10B981;
--status-warning: #F59E0B;
--status-error: #EF4444;

/* Spacing (8pt grid) */
--space-4: 16px;
--space-6: 24px;

/* Typography */
--text-base: 16px;
--leading-base: 24px;
```

---

## 🧩 Components

### Button

Professional action buttons with multiple variants.

```tsx
import { Button } from '@/components/ui';

// Primary action
<Button variant="primary">Validate Skill</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// With icon
<Button leftIcon={<SaveIcon />}>Save Changes</Button>

// Loading state
<Button isLoading>Processing...</Button>

// Full width (mobile-friendly)
<Button fullWidth>Continue</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'destructive' | 'ghost'
- `size`: 'sm' | 'default' | 'lg'
- `fullWidth`: boolean
- `isLoading`: boolean
- `leftIcon`, `rightIcon`: ReactNode

---

### Card

Elevated surfaces for content grouping.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter, StatCard } from '@/components/ui';

// Standard card
<Card>
  <CardHeader>
    <CardTitle>Team Progress</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>

// Interactive card (clickable)
<Card interactive onClick={handleClick}>
  <CardContent>Click me</CardContent>
</Card>

// Stat card (for KPIs)
<StatCard
  value="78%"
  label="Completion Rate"
  trend={{ value: "+5%", direction: "up" }}
  icon={<TrendIcon />}
/>

// Alert card
<AlertCard variant="warning" title="Action Required">
  3 team members have expiring certifications
</AlertCard>
```

---

### Table

Responsive data tables (desktop) with automatic mobile card adaptation.

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Pagination } from '@/components/ui';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Progress</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>Operator</TableCell>
      <TableCell>78%</TableCell>
    </TableRow>
  </TableBody>
</Table>

{/* Pagination */}
<Pagination
  currentPage={1}
  totalPages={10}
  pageSize={20}
  totalItems={200}
  onPageChange={(page) => console.log(page)}
/>
```

**Mobile Adaptation:**

On mobile (<640px), use `MobileTableCard` for better UX:

```tsx
<MobileTableCard
  title="John Doe"
  subtitle="Operator • Team Alpha"
  fields={[
    { label: "Progress", value: "78%" },
    { label: "Status", value: <StatusBadge status="validated" /> },
  ]}
  actions={<Button size="sm">View</Button>}
/>
```

---

### Form Components

Accessible, clear form inputs.

```tsx
import { FormField, Input, Select, Checkbox, Radio } from '@/components/ui';

// Complete form field with label, error, helper text
<FormField
  label="Email Address"
  required
  error={errors.email}
  helperText="We'll never share your email"
>
  <Input
    type="email"
    placeholder="name@example.com"
    error={!!errors.email}
  />
</FormField>

// Input with icon
<Input
  leftAddon={<SearchIcon />}
  placeholder="Search..."
/>

// Select
<Select>
  <option>Choose option</option>
  <option value="1">Option 1</option>
</Select>

// Checkbox
<Checkbox label="I agree to terms" />

// Radio
<Radio name="role" value="operator" label="Operator" />
```

---

### Modal

Overlay-based modals with accessibility.

```tsx
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui';

<Modal open={isOpen} onClose={() => setIsOpen(false)} size="md">
  <ModalHeader onClose={() => setIsOpen(false)}>
    <ModalTitle>Confirm Action</ModalTitle>
  </ModalHeader>
  <ModalBody>
    <p>Are you sure you want to proceed?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>

{/* Quick confirmation dialog */}
<ConfirmDialog
  open={isOpen}
  title="Delete User"
  message="This action cannot be undone."
  variant="destructive"
  onConfirm={handleDelete}
  onCancel={() => setIsOpen(false)}
/>
```

---

### Toast Notifications

Bottom-right toast notifications with auto-dismiss.

```tsx
import { useToast } from '@/components/ui';

function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      success('Skill validated successfully');
    } catch (err) {
      error('Failed to save changes', 'Error');
    }
  };

  return <Button onClick={handleSave}>Save</Button>;
}

// Wrap app with ToastProvider
import { ToastProvider } from '@/components/ui';

<ToastProvider>
  <App />
</ToastProvider>
```

**Auto-dismiss:**
- Success/Info: 5 seconds
- Warning/Error: Manual dismiss only

---

### Progress Components

Progress bars, badges, and circular indicators.

```tsx
import { ProgressBar, CircularProgress, Badge, StatusBadge, Spinner } from '@/components/ui';

// Progress bar
<ProgressBar
  value={78}
  showLabel
  fraction={{ current: 7, total: 9 }}
  variant="default"
/>

// Circular progress (for maturity scores)
<CircularProgress
  value={75}
  size={120}
  label="IMO"
  variant="default"
/>

// Badge
<Badge variant="success">Validated</Badge>

// Status badge
<StatusBadge status="validated" />
<StatusBadge status="pending" />
<StatusBadge status="expired" />

// Loading spinner
<Spinner size="md" label="Loading..." />

// Skeleton loader
<Skeleton variant="text" width="100%" />
<Skeleton variant="circular" width={40} height={40} />
```

---

### Navigation

Role-based navigation for desktop and mobile.

```tsx
import { Header, Sidebar, BottomNav, Breadcrumbs } from '@/components/ui';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: <HomeIcon /> },
  { label: 'Learning', href: '/learning', icon: <BookIcon />, badge: 3 },
  { label: 'Profile', href: '/profile', icon: <UserIcon /> },
];

// Desktop header
<Header
  logo={<Logo />}
  navItems={navItems}
  searchComponent={<SearchBar />}
  notificationButton={<NotificationButton count={5} />}
  userMenu={<UserMenu />}
/>

// Desktop sidebar
<Sidebar
  navItems={navItems}
  collapsed={false}
  onCollapseToggle={() => setCollapsed(!collapsed)}
/>

// Mobile bottom navigation
<BottomNav navItems={navItems} />

// Breadcrumbs
<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Teams', href: '/teams' },
    { label: 'Team Alpha' },
  ]}
/>
```

---

## 🎯 Usage Patterns

### Dashboard Layout (Operator)

```tsx
import { Card, StatCard, ProgressBar, Button } from '@/components/ui';

function OperatorDashboard() {
  return (
    <div className="space-y-6 p-4">
      {/* Priority actions */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Your Priority Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AlertCard variant="warning">
            Complete "Hazmat Basics" Module - Due in 3 days
          </AlertCard>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Learning in Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar value={75} fraction={{ current: 6, total: 8 }} showLabel />
          <Button className="mt-4" fullWidth>Continue Module</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Form Example

```tsx
import { FormField, Input, Select, Button } from '@/components/ui';

function UserForm() {
  const [errors, setErrors] = useState({});

  return (
    <form className="space-y-5">
      <FormField label="Full Name" required error={errors.name}>
        <Input placeholder="John Doe" error={!!errors.name} />
      </FormField>

      <FormField label="Role" required>
        <Select>
          <option value="">Select role</option>
          <option value="operator">Operator</option>
          <option value="manager">Manager</option>
        </Select>
      </FormField>

      <div className="flex gap-3">
        <Button variant="secondary" fullWidth>Cancel</Button>
        <Button variant="primary" fullWidth>Save</Button>
      </div>
    </form>
  );
}
```

---

## ♿ Accessibility

All components follow WCAG 2.1 AA standards:

- **Keyboard navigation**: All interactive elements are keyboard-accessible
- **Focus indicators**: Clear 2px outline on focus
- **ARIA labels**: Proper ARIA attributes on all components
- **Screen reader support**: Semantic HTML and ARIA live regions
- **Color contrast**: Minimum 4.5:1 ratio for text
- **Touch targets**: Minimum 44×44px for mobile

---

## 📱 Responsive Design

### Breakpoints

```css
mobile:  640px  /* Show desktop nav, hide mobile bottom nav */
tablet:  1024px /* Full sidebar visible */
desktop: 1280px /* Wider layouts */
```

### Mobile-First Approach

- Tables convert to card lists
- Bottom navigation on mobile
- Full-width buttons on mobile
- Simplified layouts with vertical stacking

---

## 🎨 Customization

### Tailwind Classes

All components accept `className` prop for additional styling:

```tsx
<Button className="mt-4 bg-custom-color">Custom Button</Button>
```

### Override Styles

Use Tailwind's arbitrary values:

```tsx
<Card className="p-8 bg-[#1a1a1a]">Custom Card</Card>
```

---

## 📖 Best Practices

### DO ✅

- Use semantic HTML elements
- Provide clear, descriptive labels
- Show loading states for async actions
- Use status colors consistently
- Keep mobile users in mind

### DON'T ❌

- Use custom colors outside design tokens
- Nest interactive elements (button in button)
- Rely on color alone for status
- Use placeholder text as labels
- Create deeply nested components

---

## 🐛 Troubleshooting

### Component not styled correctly

Ensure `globals.css` is imported in your root layout:

```tsx
// app/layout.tsx
import '@/styles/globals.css';
```

### Tailwind classes not working

Check that Tailwind config includes component paths:

```js
// tailwind.config.ts
content: [
  './src/components/**/*.{js,ts,jsx,tsx}',
],
```

### Modal/Toast not appearing

Wrap your app with providers:

```tsx
import { ToastProvider } from '@/components/ui';

<ToastProvider>
  <App />
</ToastProvider>
```

---

## 📚 Resources

- **Design System Spec**: See parent directory README for complete UX/UI specifications
- **Storybook**: (Coming soon) Interactive component playground
- **Figma**: (Coming soon) Design files

---

Built with ❤️ for operational excellence.
