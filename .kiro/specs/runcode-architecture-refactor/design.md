# Design Document

## Overview

Данный документ описывает архитектурное решение для рефакторинга платформы RunCode. Проект включает реорганизацию файловой структуры, создание модульной системы компонентов, улучшение UX с современными анимациями GSAP, и реализацию продвинутых функций для решения задач.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Features   │  │   Layout     │  │   Shared     │      │
│  │              │  │              │  │              │      │
│  │ • Auth       │  │ • Header     │  │ • Providers  │      │
│  │ • Tasks      │  │ • Footer     │  │ • LightRays  │      │
│  │ • Profile    │  │ • Sidebar    │  │ • Animations │      │
│  │ • Terminal   │  │ • ActionBar  │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Stores     │  │    Hooks     │  │     API      │      │
│  │              │  │              │  │              │      │
│  │ • Auth       │  │ • useGSAP    │  │ • NextAuth   │      │
│  │ • Tasks      │  │ • useTerminal│  │ • Prisma     │      │
│  │ • UI         │  │ • useResize  │  │ • REST       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   PostgreSQL     │
                    │   (via Prisma)   │
                    └──────────────────┘
```

### New Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes
│   │   ├── page.tsx             # Home page
│   │   ├── tasks/               # Tasks pages
│   │   │   ├── page.tsx         # Tasks list
│   │   │   └── [id]/            # Task solution page
│   │   │       └── page.tsx
│   │   ├── rating/              # Rating page
│   │   │   └── page.tsx
│   │   └── profile/             # Profile pages
│   │       ├── page.tsx         # Own profile
│   │       └── [id]/            # User profile
│   │           └── page.tsx
│   ├── (admin)/                 # Admin routes (protected)
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── api/                     # API routes
│   │   ├── auth/
│   │   ├── tasks/
│   │   └── users/
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/
│   ├── features/                # Feature-specific components
│   │   ├── auth/
│   │   │   ├── AuthModal.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── index.ts
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskFilter.tsx
│   │   │   ├── TaskProgress.tsx
│   │   │   ├── SolutionPage/
│   │   │   │   ├── SolutionPage.tsx
│   │   │   │   ├── DescriptionPanel.tsx
│   │   │   │   ├── EditorPanel.tsx
│   │   │   │   ├── ConsolePanel.tsx
│   │   │   │   ├── ResizableLayout.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── ProfileStats.tsx
│   │   │   ├── ActivityHeatmap.tsx
│   │   │   ├── RecentSolutions.tsx
│   │   │   ├── Achievements.tsx
│   │   │   └── index.ts
│   │   ├── rating/
│   │   │   ├── RatingTable.tsx
│   │   │   ├── RatingFilters.tsx
│   │   │   ├── UserRatingCard.tsx
│   │   │   └── index.ts
│   │   └── terminal/
│   │       ├── Terminal.tsx
│   │       ├── TerminalInput.tsx
│   │       ├── TerminalOutput.tsx
│   │       ├── TerminalCommands.ts
│   │       └── index.ts
│   │
│   ├── layout/                  # Layout components
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   └── index.ts
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   └── index.ts
│   │   └── ActionBar/
│   │       ├── ActionBar.tsx
│   │       ├── ActionButton.tsx
│   │       ├── ActionContent.tsx
│   │       └── index.ts
│   │
│   ├── ui/                      # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Modal/
│   │   ├── Dropdown/
│   │   ├── Tabs/
│   │   ├── Tooltip/
│   │   ├── Progress/
│   │   └── index.ts
│   │
│   └── shared/                  # Shared components
│       ├── Providers.tsx
│       ├── LightRays.tsx
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── index.ts
│
├── features/                    # Business logic by feature
│   ├── auth/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useAuthModal.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── utils/
│   │       └── validation.ts
│   ├── tasks/
│   │   ├── hooks/
│   │   │   ├── useTasks.ts
│   │   │   ├── useTaskSolution.ts
│   │   │   └── useCodeEditor.ts
│   │   ├── types/
│   │   │   └── tasks.types.ts
│   │   └── utils/
│   │       ├── codeExecution.ts
│   │       └── testRunner.ts
│   ├── profile/
│   │   ├── hooks/
│   │   │   ├── useProfile.ts
│   │   │   └── useActivity.ts
│   │   ├── types/
│   │   │   └── profile.types.ts
│   │   └── utils/
│   │       └── activityCalculator.ts
│   └── terminal/
│       ├── hooks/
│       │   └── useTerminal.ts
│       ├── types/
│       │   └── terminal.types.ts
│       └── utils/
│           └── commandParser.ts
│
├── hooks/                       # Global custom hooks
│   ├── useOptimizedGSAP.ts
│   ├── useScrollAnimation.ts
│   ├── useFadeIn.ts
│   ├── useSlideIn.ts
│   ├── useResizable.ts
│   ├── useLocalStorage.ts
│   └── index.ts
│
├── store/                       # Zustand stores
│   ├── authStore.ts
│   ├── tasksStore.ts
│   ├── uiStore.ts
│   ├── terminalStore.ts
│   └── index.ts
│
├── lib/                         # Utilities and helpers
│   ├── auth.ts
│   ├── prisma.ts
│   ├── utils.ts
│   ├── api.ts
│   └── constants.ts
│
├── types/                       # Global TypeScript types
│   ├── global.d.ts
│   ├── api.types.ts
│   └── index.ts
│
└── constants/                   # Application constants
    ├── routes.ts
    ├── colors.ts
    ├── animations.ts
    └── index.ts
```

## Components and Interfaces

### 1. Authentication System

#### AuthModal Component

```typescript
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

**Features:**
- Modal overlay with backdrop blur
- Tabs for Login/Register
- Form validation with error messages
- Loading states during authentication
- Success/error notifications
- Close on Escape or outside click
- GSAP animations for modal appearance

#### Implementation Details:
- Use Zustand store for modal state
- NextAuth for authentication
- React Hook Form for form management
- Zod for validation
- GSAP for animations

### 2. Action Bar System

#### ActionBar Component

```typescript
interface ActionBarConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  color: ColorVariant;
}

interface ActionContentProps {
  isActive: boolean;
  content: React.ReactNode;
}
```

**Content Sections:**
1. **О нас** - Platform introduction, mission, team
2. **Возможности** - Features list with icons and descriptions
3. **Как начать** - Step-by-step guide with numbered steps
4. **Сообщество** - Community stats, links, social media

**Animation Flow:**
1. User clicks button → Button highlights
2. Previous content slides down and fades out (GSAP timeline)
3. New content slides up and fades in
4. Smooth height transition for container

### 3. Terminal Component

#### Terminal Interface

```typescript
interface TerminalCommand {
  command: string;
  output: string | React.ReactNode;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
}

interface TerminalState {
  history: TerminalCommand[];
  currentInput: string;
  historyIndex: number;
  isProcessing: boolean;
}

interface BuiltInCommand {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<string | React.ReactNode>;
}
```

**Built-in Commands:**
- `help` - Show available commands
- `clear` - Clear terminal
- `echo <text>` - Print text
- `calc <expression>` - Calculate math expression
- `date` - Show current date/time
- `whoami` - Show current user
- `tasks` - List available tasks
- `solve <taskId>` - Open task solution page
- `profile` - Open user profile
- `rating` - Show rating table

**Features:**
- Command history navigation (↑/↓)
- Tab autocomplete
- Typing animation for output
- Color-coded output
- Command suggestions
- Error handling

### 4. Solution Page

#### Resizable Layout System

```typescript
interface PanelConfig {
  id: string;
  component: React.ComponentType;
  minSize: number;
  defaultSize: number;
  order: number;
}

interface LayoutState {
  panels: PanelConfig[];
  sizes: Record<string, number>;
  orientation: 'horizontal' | 'vertical';
}
```

**Panels:**
1. **Description Panel**
   - Task title and difficulty
   - Problem description
   - Input/Output examples
   - Constraints
   - Test cases

2. **Editor Panel**
   - Monaco Editor integration
   - Language selector (JS, Python, C++, Java)
   - Syntax highlighting
   - Auto-completion
   - Code formatting
   - Theme switcher (light/dark)

3. **Console Panel**
   - Test results display
   - Error messages
   - Execution time
   - Memory usage
   - Custom test input

**Resizing Features:**
- Drag handles between panels
- Min/max size constraints
- Snap to grid
- Save layout preferences
- Reset to default layout
- Keyboard shortcuts for layout changes

**Implementation:**
- Use `react-resizable-panels` or custom implementation
- LocalStorage for layout persistence
- GSAP for smooth transitions
- Virtualization for large outputs

### 5. Profile Page

#### Activity Heatmap

```typescript
interface ActivityData {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // Activity intensity
}

interface HeatmapProps {
  data: ActivityData[];
  startDate: Date;
  endDate: Date;
  colorScheme: string[];
}
```

**Features:**
- GitHub-style heatmap
- Hover tooltips with details
- Click to see day's activity
- Color intensity based on activity
- Responsive grid layout
- Animation on load

**Stats Display:**
- Total solved tasks
- Current streak
- Longest streak
- Rating points
- Rank position
- Languages used (pie chart)
- Difficulty distribution (bar chart)

### 6. Tasks Page

#### Task Card Component

```typescript
interface Task {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  tags: string[];
  acceptanceRate: number;
  totalSubmissions: number;
  isSolved: boolean;
  isAttempted: boolean;
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}
```

**Features:**
- Card hover animations
- Difficulty color coding
- Status icons (solved/attempted/new)
- Tag chips
- Acceptance rate progress bar
- Bookmark functionality
- Quick preview on hover

**Filters:**
- Difficulty filter (multi-select)
- Tag filter (multi-select)
- Status filter (solved/unsolved/attempted)
- Search by title
- Sort by (difficulty, acceptance rate, recent)

### 7. Rating Page

#### Rating Table

```typescript
interface UserRating {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  rating: number;
  solvedTasks: number;
  streak: number;
  change: number; // Position change
}

interface RatingTableProps {
  users: UserRating[];
  currentUserId?: string;
  period: 'week' | 'month' | 'all';
}
```

**Features:**
- Virtualized list for performance
- Highlight current user
- Animated rank changes
- Avatar with fallback
- Click to view profile
- Period filter
- Pagination or infinite scroll

## Data Models

### User Model

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  rating: number;
  rank: number;
  solvedTasks: number;
  streak: number;
  longestStreak: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Task Model

```typescript
interface Task {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  tags: string[];
  examples: Example[];
  constraints: string[];
  testCases: TestCase[];
  starterCode: Record<string, string>; // language -> code
  solution?: string;
  acceptanceRate: number;
  totalSubmissions: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}
```

### Submission Model

```typescript
interface Submission {
  id: string;
  userId: string;
  taskId: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded';
  runtime?: number;
  memory?: number;
  testsPassed: number;
  totalTests: number;
  createdAt: Date;
}
```

### Activity Model

```typescript
interface Activity {
  id: string;
  userId: string;
  date: Date;
  type: 'submission' | 'task_solved' | 'streak';
  metadata: Record<string, any>;
}
```

## Error Handling

### Error Boundaries

```typescript
interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
```

**Implementation:**
- Global error boundary in root layout
- Feature-specific error boundaries
- Error logging to external service
- User-friendly error messages
- Retry mechanisms

### API Error Handling

```typescript
interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

interface APIResponse<T> {
  data?: T;
  error?: APIError;
  success: boolean;
}
```

**Error Types:**
- Authentication errors (401, 403)
- Validation errors (400)
- Not found errors (404)
- Server errors (500)
- Network errors

## Testing Strategy

### Unit Tests
- Component rendering tests
- Hook behavior tests
- Utility function tests
- Store action tests

### Integration Tests
- Authentication flow
- Task submission flow
- Profile update flow
- Terminal command execution

### E2E Tests
- User registration and login
- Solving a task end-to-end
- Profile navigation
- Rating page interaction

### Performance Tests
- Page load times
- Animation performance
- Large list rendering
- Code editor responsiveness

**Testing Tools:**
- Jest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests
- Lighthouse for performance audits

## Animation Strategy

### GSAP Implementation

#### Animation Hooks

```typescript
// useScrollAnimation.ts
interface ScrollAnimationOptions {
  trigger: string;
  start?: string;
  end?: string;
  scrub?: boolean;
  markers?: boolean;
}

function useScrollAnimation(
  animation: gsap.TweenVars,
  options: ScrollAnimationOptions
): void;

// useFadeIn.ts
interface FadeInOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

function useFadeIn(
  ref: React.RefObject<HTMLElement>,
  options?: FadeInOptions
): void;

// useSlideIn.ts
interface SlideInOptions {
  direction?: 'left' | 'right' | 'top' | 'bottom';
  duration?: number;
  delay?: number;
  distance?: number;
}

function useSlideIn(
  ref: React.RefObject<HTMLElement>,
  options?: SlideInOptions
): void;
```

#### Animation Patterns

1. **Page Transitions**
   - Fade in on mount
   - Slide out on unmount
   - Smooth route transitions

2. **Scroll Animations**
   - Parallax effects
   - Reveal on scroll
   - Progress indicators

3. **Interactive Animations**
   - Hover effects
   - Click feedback
   - Loading states

4. **Modal Animations**
   - Scale and fade in
   - Backdrop blur
   - Smooth close

**Performance Optimization:**
- Use `will-change` CSS property
- Prefer `transform` and `opacity`
- Use `requestAnimationFrame`
- Debounce scroll events
- Kill animations on unmount

## Security Considerations

### Authentication
- Secure password hashing (bcrypt)
- JWT tokens with expiration
- CSRF protection
- Rate limiting on auth endpoints
- Email verification

### Code Execution
- Sandboxed execution environment
- Time and memory limits
- Input sanitization
- Output size limits
- No file system access

### Data Protection
- Input validation on all forms
- SQL injection prevention (Prisma)
- XSS protection
- CORS configuration
- Environment variable security

## Performance Optimization

### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports for heavy libraries

### Caching
- API response caching
- Static asset caching
- Browser caching headers
- Service worker for offline support

### Image Optimization
- Next.js Image component
- WebP format
- Lazy loading
- Responsive images

### Bundle Optimization
- Tree shaking
- Minification
- Compression (gzip/brotli)
- Remove unused dependencies

## Accessibility

### WCAG 2.1 Compliance
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### Color Contrast
- Minimum 4.5:1 ratio for text
- Color-blind friendly palette
- Dark mode support

### Interactive Elements
- Focus indicators
- Touch targets (min 44x44px)
- Skip links
- Error announcements

## Responsive Design

### Breakpoints
```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
};
```

### Mobile Adaptations
- Hamburger menu for navigation
- Vertical panel layout for solution page
- Touch-friendly controls
- Reduced animations
- Optimized images

### Tablet Adaptations
- Hybrid layout (mix of mobile/desktop)
- Collapsible sidebar
- Adjusted font sizes
- Optimized spacing

## Deployment Strategy

### Build Process
1. Type checking (TypeScript)
2. Linting (ESLint)
3. Testing (Jest)
4. Build (Next.js)
5. Bundle analysis
6. Deploy to Vercel

### Environment Variables
```
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_API_URL=
```

### Monitoring
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring (Vercel Analytics)
- User feedback collection

## Migration Plan

### Phase 1: Structure Setup
1. Create new directory structure
2. Set up barrel exports (index.ts)
3. Configure path aliases

### Phase 2: Component Migration
1. Move UI components
2. Move layout components
3. Move feature components
4. Update imports

### Phase 3: Feature Implementation
1. Implement AuthModal
2. Implement new ActionBar
3. Enhance Terminal
4. Build Solution Page
5. Build Profile Page
6. Build Rating Page

### Phase 4: Testing & Optimization
1. Write tests
2. Performance optimization
3. Accessibility audit
4. Browser testing

### Phase 5: Deployment
1. Staging deployment
2. User testing
3. Production deployment
4. Monitoring and fixes
