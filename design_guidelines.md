# Antriksh Dashboard - Design Guidelines

## Design Approach
**Modern Minimal Dashboard** - Clean, functional interface prioritizing usability and subtle animations. Focus on information hierarchy and smooth interactions without visual clutter.

## Layout System

### Structure
- **Sidebar Navigation**: Fixed left sidebar (w-64) with navigation links
- **Top Navbar**: Full-width header with search and user profile
- **Main Content Area**: Flexible content region with responsive padding
- **Spacing Units**: Use Tailwind spacing scale - primarily p-4, p-6, p-8, gap-4, gap-6 for consistency

### Grid Patterns
- **Dashboard**: 2-column grid on desktop (grid-cols-2), single column on mobile
- **Boards**: 3-column Kanban layout (grid-cols-1 md:grid-cols-3)
- **Integrations**: 3-4 cards per row (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- **Inbox**: Single column list layout with full-width message cards

## Typography

### Hierarchy
- **Page Titles**: text-2xl font-bold
- **Section Headers**: text-xl font-semibold
- **Card Titles**: text-lg font-medium
- **Body Text**: text-base
- **Metadata/Labels**: text-sm text-gray-600

### Font Family
Use system font stack (Tailwind default sans-serif)

## Core Components

### Sidebar
- Width: w-64
- Fixed positioning on desktop, collapsible on mobile
- Navigation items with icons and labels
- Active state indication with background highlight
- Padding: p-4 for container, p-3 for nav items

### Navbar
- Height: h-16
- Flexbox layout with search bar (center) and profile (right)
- Search input: rounded-lg with focus states
- Profile avatar: rounded-full, clickable

### TaskCard
- Rounded corners: rounded-lg
- Padding: p-4
- Shadow: shadow-sm with hover:shadow-md transition
- Structure: Title, description, priority badge, due date
- Action buttons at bottom

### Button
- Primary: Solid background with white text
- Secondary: Outlined with transparent background
- Sizes: Small (px-3 py-1.5 text-sm), Medium (px-4 py-2), Large (px-6 py-3)
- Rounded: rounded-md
- States handled by component's own hover/active implementations

### Modal
- Overlay: Fixed backdrop with backdrop-blur-sm
- Content: Centered, max-w-lg, rounded-xl
- Padding: p-6
- Close button: Absolute top-right

## Page-Specific Layouts

### Dashboard Page
- **Task Overview Section**: 4-5 task cards in grid (grid-cols-1 md:grid-cols-2 gap-4)
- **Recent Activity**: List format with timestamps and action descriptions
- Spacing: Space-y-6 between sections

### Boards Page
- **Kanban Columns**: 3 columns with headers ("To Do", "In Progress", "Done")
- **Task Cards**: 2-3 cards per column, vertically stacked with gap-3
- **Column Styling**: Rounded backgrounds, p-4, min-height for empty states
- Drag indicators on hover (cursor-move)

### Inbox Page
- **Message List**: Full-width cards with sender, subject, preview
- **Action Buttons**: "Convert to Task" and "Delete" inline at message bottom
- **Unread Indicator**: Dot or bold text for unread items
- Spacing: Space-y-3 between messages

### Integrations Page
- **Integration Cards**: Logo, app name, description, connection status
- **Connect Button**: Toggle between "Connect" (outlined) and "Connected" (solid with checkmark)
- **Grid Layout**: 3-column grid with gap-6
- Card padding: p-6

### Settings Page
- **Section Groups**: Profile Info, Preferences (dark mode, notifications)
- **Form Layout**: Label-input pairs with space-y-4
- **Toggle Switches**: Custom Tailwind toggle for dark mode/notifications
- **Save Button**: Fixed or sticky at bottom

## Animation Guidelines

### Framer Motion Usage (Minimal)
- **Hover Effects**: scale(1.02) on cards, translateY(-2px) with shadow increase
- **Fade-In**: Initial opacity 0, animate to 1 with duration 0.3s
- **Page Transitions**: Staggered children animation for lists (stagger 0.05s)
- **Button Feedback**: Scale pulse on click (scale 0.95)
- **Modal**: Fade + scale animation (initial scale 0.95)

### Transition Timing
- Fast: 150ms for hovers and small interactions
- Medium: 300ms for fade-ins and slides
- Slow: Use sparingly (500ms) for modal entries only

## Responsive Behavior

- **Mobile (<768px)**: Sidebar collapses to hamburger menu, single column grids, reduced padding
- **Tablet (768px-1024px)**: 2-column grids where applicable, sidebar visible
- **Desktop (>1024px)**: Full 3-column layouts, fixed sidebar, all features visible

## States & Interactions

- **Hover**: Subtle shadow increase, slight lift (2px)
- **Active/Selected**: Background tint, border accent
- **Loading**: Skeleton screens or pulse animation
- **Empty States**: Centered message with icon, muted text
- **Success/Error**: Toast notifications (top-right, auto-dismiss)

## Visual Hierarchy

1. Primary actions (CTAs) - prominent buttons
2. Task/content cards - medium emphasis
3. Metadata and labels - low emphasis, muted
4. Background containers - minimal borders, subtle shadows

This design creates a clean, functional dashboard that prioritizes usability while maintaining visual polish through subtle animations and consistent spacing patterns.