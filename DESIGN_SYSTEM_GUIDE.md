# Wachemo University Design System Guide

## Color Palette

### Primary Brand Colors
- **Maroon** (`#7a0a2d`) - Primary university color, used for main branding
- **Ink** (`#0e2336`) - Dark text color for headings
- **Text** (`#1b2430`) - Body text color
- **Muted** (`#f4f6f8`) - Light background color
- **Line** (`#e9eef2`) - Border and divider color

### Module-Specific Colors
Each system module has its own color for easy identification:

| Module | Color | Hex Code | Usage |
|--------|-------|----------|-------|
| Student Portal | Maroon | `#7a0a2d` | Primary brand color |
| Faculty Portal | Green | `#059669` | Faculty-related features |
| Admin Portal | Amber | `#f59e0b` | Administrative functions |
| Online Exams | Blue | `#1e40af` | Examination system |
| Cafeteria | Red | `#dc2626` | Food services |
| ID System | Purple | `#7c3aed` | Identity management |
| Clearance | Orange | `#ea580c` | Clearance processes |
| Library | Cyan | `#0891b2` | Library services |
| Dormitory | Brown | `#7c2d12` | Housing services |
| E-Payment | Dark Green | `#365314` | Financial transactions |
| HR Management | Dark Purple | `#581c87` | Human resources |
| News & Announcements | Pink | `#be185d` | Communication |
| Partnerships | Dark Gray | `#1f2937` | External relations |

### Status Colors
- **Success** (`#10b981`) - Positive actions, completed states
- **Warning** (`#f59e0b`) - Caution, pending states
- **Danger** (`#ef4444`) - Errors, critical states
- **Info** (`#3b82f6`) - Information, neutral states

## Typography

### Font Families
- **UI Font**: Inter - Clean, modern interface font
- **Display Font**: DM Serif Display - Elegant headings and titles

### Font Weights
- Regular (400) - Body text
- Medium (500) - Emphasized text
- Semibold (600) - Subheadings
- Bold (700) - Buttons, important text
- Black (900) - Main headings

## Component Guidelines

### Buttons
```css
.btn.primary    /* Maroon background, white text */
.btn.secondary  /* Navy blue background */
.btn.success    /* Green background */
.btn.warning    /* Amber background, dark text */
.btn.danger     /* Red background */
.btn.info       /* Blue background */
.btn.white      /* White background, maroon text */
.btn.ghost      /* Transparent background, colored border */
```

### Cards
- White background with subtle shadow
- 14px border radius
- 1px border using `--line` color
- Hover effect: slight lift and stronger shadow

### Navigation
- Header uses animated maroon gradient
- Sticky positioning with backdrop blur on scroll
- Module-specific navbar colors for different portals

### Forms
- 8px border radius for inputs
- Focus state uses primary color with 25% opacity shadow
- Consistent padding and typography

## Module Theming

Each module can be themed using CSS classes:
```css
.student-theme    /* Uses maroon color scheme */
.faculty-theme    /* Uses green color scheme */
.admin-theme      /* Uses amber color scheme */
.exam-theme       /* Uses blue color scheme */
/* ... and so on for each module */
```

## Implementation

### CSS Variables
All colors are defined as CSS custom properties in `wcu-design-system.css`:
```css
:root {
  --maroon: #7a0a2d;
  --primary-color: #7a0a2d;
  --student-color: var(--maroon);
  --faculty-color: #059669;
  /* ... etc */
}
```

### Usage in Components
```css
/* Use semantic names */
.primary-button {
  background-color: var(--primary-color);
}

/* Use module-specific colors */
.faculty-dashboard {
  border-top: 4px solid var(--faculty-color);
}
```

## Responsive Design

### Breakpoints
- Mobile: `max-width: 768px`
- Tablet: `max-width: 1100px`
- Desktop: `min-width: 1101px`

### Mobile Adaptations
- Smaller button padding
- Stacked layouts instead of grids
- Simplified navigation
- Touch-friendly interaction areas

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio minimum)
- Interactive elements have sufficient contrast
- Focus states are clearly visible

### Color Independence
- Information is not conveyed by color alone
- Icons and text labels accompany color coding
- Status indicators use multiple visual cues

## File Structure

```
ui-design/
├── css/
│   ├── wcu-design-system.css  # Core design system
│   ├── style.css              # Main styles
│   ├── dashboard.css          # Dashboard-specific styles
│   └── exam.css               # Exam interface styles
├── index.html                 # Main landing page
├── digital-campus-landing.html # Enhanced landing page
├── student-dashboard.html     # Student portal
├── faculty-dashboard.html     # Faculty portal
├── admin-dashboard.html       # Admin portal
└── exam-interface.html        # Online exam system
```

## Best Practices

1. **Always use CSS variables** instead of hardcoded colors
2. **Include the design system CSS** as the first stylesheet
3. **Use semantic color names** (primary, success, warning) over specific colors
4. **Test color combinations** for accessibility compliance
5. **Maintain consistency** across all modules and interfaces
6. **Document any new colors** added to the system

## Future Enhancements

- Dark mode support using CSS custom properties
- High contrast mode for accessibility
- Color customization for different university branches
- Automated color palette generation tools

This design system ensures visual consistency across all 14 modules while maintaining the beautiful original design aesthetic of Wachemo University.