---
name: css-theming
description: CSS theming and styling patterns for Hope project. Use when working with theme switching, CSS variables, or styling UI components.
---

# CSS Theming Skill

## CSS Variables (Hope Project)

```css
:root {
  /* Colors - Dark mode */
  --color-bg-primary: #0a0a0a;
  --color-text-primary: #f0f0f0;
  --color-text-secondary: #8a8a8a;
  --color-accent: #4a9eff;
  
  /* Colors - Light mode */
  --color-text-primary-light: #0f172a;
  --color-text-secondary-light: #1e293b;
  --color-accent-light: #e07f50;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  
  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
}
```

## Theme Switching Pattern

```css
/* Default (dark) */
.element {
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
}

/* Light theme via body class */
body.hope-mode .element {
  color: var(--color-text-primary-light);
  background: rgba(255, 255, 255, 0.85);
}
```

## Text Visibility on Light Backgrounds

For text that needs to remain readable on bright backgrounds:

```css
body.hope-mode .text-element {
  color: #0a1628;                         /* Very dark text */
  font-weight: 500;                       /* Slightly bold */
  background: rgba(255, 255, 255, 0.85);  /* Semi-opaque white */
  padding: 0.75em 1.5em;                  /* Comfortable padding */
  border-radius: var(--radius-xl);        /* Rounded pill */
  backdrop-filter: blur(12px);            /* Frosted glass */
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5);
}
```

## Visibility Helpers

```css
.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.visible {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
```

## Animation Patterns

```css
.element {
  transition: all 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation: fadeIn 0.5s ease forwards;
}
```
