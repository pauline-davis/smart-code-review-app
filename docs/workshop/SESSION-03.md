# Session 03: Frontend Development with AI

**Duration:** 75 minutes

## Learning Objectives

By the end of this session, you will:
- Build React components with Copilot assistance
- Understand how to use Copilot with TypeScript
- Connect the frontend to your backend API
- Style components with Tailwind CSS

---

## Part 1: Understanding the Frontend Structure (15 minutes)

### Project Overview

Open `src/frontend/` and explore:

```
src/frontend/
├── src/
│   ├── components/
│   │   ├── CodeInput.tsx      # Code input form
│   │   └── ReviewResults.tsx  # Results display
│   ├── services/
│   │   └── api.ts             # Backend API client
│   ├── App.tsx                # Main application
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind imports
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### Start the Frontend

In a new terminal:

```bash
cd src/frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Review the Components

Open each component and understand:
- `App.tsx` - State management and layout
- `CodeInput.tsx` - Form handling
- `ReviewResults.tsx` - Conditional rendering

---

## Part 2: Building Components with Copilot (30 minutes)

### Exercise 1: Add Language Detection

Let's add automatic language detection to the CodeInput component.

Open `src/frontend/src/components/CodeInput.tsx`:

1. Add a new function before the component:
```typescript
// Function to detect programming language from code content
// Checks for common patterns: def/class for Python, function/const for JavaScript, etc.
```

2. Let Copilot generate the detection logic

3. Use it to set the default language when code changes

### Exercise 2: Add Loading States

The current loading state is basic. Let's enhance it.

In `App.tsx`, add a loading skeleton:

1. Type this comment:
```typescript
// Component to show a skeleton loader while waiting for review results
```

2. Accept Copilot's suggestion for a `SkeletonLoader` component

3. Use it in the `ReviewResults` conditional

### Exercise 3: Add Copy to Clipboard

Let's add a button to copy suggestions:

In `ReviewResults.tsx`:

1. After each suggestion, add a copy button:
```typescript
// Add a copy button that copies the suggestion text to clipboard
// Show a "Copied!" message briefly after clicking
```

2. Use Copilot to generate the copy functionality with `navigator.clipboard`

---

## Part 3: Styling with Tailwind (15 minutes)

### Understanding Tailwind Classes

Tailwind uses utility classes instead of CSS files:

```tsx
// Traditional CSS approach:
<div className="card">  // Requires separate .card CSS

// Tailwind approach:
<div className="bg-white rounded-lg shadow-lg p-6">  // All styling inline
```

### Exercise 4: Improve the Design

Use Copilot Chat to improve styling:

1. Select the `CodeInput` component
2. Ask: "Add hover effects and transitions to make this more polished"

Try these prompts:
- "Add a dark mode version of this component"
- "Make this responsive for mobile screens"
- "Add focus states for accessibility"

### Exercise 5: Add Animations

In `ReviewResults.tsx`, add an animation when results appear:

```typescript
// Add a fade-in animation when new results are displayed
// Use Tailwind's animation classes
```

---

## Part 4: Connecting Frontend to Backend (15 minutes)

### Understanding the API Service

Open `src/frontend/src/services/api.ts`:

```typescript
const API_BASE = '/api'  // Proxied to localhost:8000 by Vite

export async function reviewCode(code: string, language: string) {
  const response = await fetch(`${API_BASE}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language }),
  })
  // ...
}
```

### Exercise 6: Add the Suggest Endpoint

The `getSuggestions` function exists but isn't used. Let's integrate it:

1. In `App.tsx`, add a "Get More Suggestions" button
2. Call `getSuggestions` when clicked
3. Display additional suggestions in the results

Use Copilot:
```typescript
// Add a button to fetch additional suggestions
// Append new suggestions to the existing results
```

### Test the Integration

1. Make sure backend is running on port 8000
2. Make sure frontend is running on port 5173
3. Enter some code and click "Review Code"
4. Verify results appear correctly

---

## Key Takeaways

1. **Copilot understands React patterns** - Hooks, components, props
2. **TypeScript helps Copilot** - Better type inference = better suggestions
3. **Tailwind + Copilot = fast styling** - Just describe what you want
4. **Component comments guide generation** - JSDoc and inline comments work great

---

## Next Session Preview

In Session 04, we'll:
- Add proper error boundaries
- Implement tests for components
- Handle edge cases and loading states
- Prepare for deployment

---

<details>
<summary><strong>Deep Dive: React Patterns with Copilot</strong></summary>

### Effective Component Comments

Copilot responds well to specific React terminology:

```typescript
// Custom hook to debounce API calls with 300ms delay
// Returns the debounced value and a loading state

// Higher-order component that adds error boundary to any component

// Context provider for managing global theme state
// Includes useTheme hook for consuming components
```

### TypeScript Tips for Better Suggestions

1. **Define interfaces first** - Copilot uses them for prop suggestions
2. **Use generics** - `useState<ReviewResult | null>(null)`
3. **Export types** - Shared types improve cross-file suggestions

### Common Patterns Copilot Handles Well

- Form validation with controlled components
- Data fetching with useEffect
- Custom hooks for reusable logic
- Context + reducer patterns
- Memoization with useMemo/useCallback

</details>
