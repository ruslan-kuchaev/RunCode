# Project Structure

## Root Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration with `@/*` path mapping to `src/*`
- `next.config.ts` - Next.js configuration
- `components.json` - shadcn/ui configuration (New York style)
- `prisma/schema.prisma` - Database schema definition
- `.env` - Environment variables (DATABASE_URL)

## Source Code Organization (`src/`)

### App Directory (`src/app/`)
- **Next.js App Router structure**
- `layout.tsx` - Root layout component
- `page.tsx` - Home page component
- `globals.css` - Global styles and Tailwind imports
- `generated/prisma/` - Auto-generated Prisma client (do not edit manually)

### Components (`src/components/`)
- **Organized by feature/type:**
  - `animate/` - Animation components (GSAP-based)
  - `main/header/` - Header and navigation components
    - `FixedMenu/` - Fixed navigation with left menu and nav menu
  - `shadcn/` - shadcn/ui components and customizations
  - `threejs/` - Three.js/R3F components
    - `stiker/` - 3D sticker components

### Libraries (`src/lib/`)
- `utils.ts` - Utility functions (includes cn() for class merging)
- `three-utils.ts` - Three.js specific utilities

### State Management (`src/store/`)
- Zustand stores for global state
- `AnimationCenter.ts` - Animation state management
- `Arrayicon.tsx` - Icon array state (mixed .tsx/.ts naming)

## Public Assets (`public/`)
- 3D models: `.glb`, `.gltf`, `.bin` files
- HDR environments: `hdr/` directory
- Images: `.png`, `.svg`, `.gif`, `.mp4` files
- Texture maps: `*_uv.png` files for 3D materials

## Naming Conventions
- **Components**: PascalCase with descriptive folder structure
- **Files**: Use `.tsx` for React components, `.ts` for utilities
- **Imports**: Use `@/` alias for src imports
- **3D Assets**: Descriptive names with file type suffixes

## Architecture Patterns
- **Component Composition**: Nested folder structure for related components
- **Client Components**: Use `"use client"` directive for interactive components
- **Database**: Prisma models follow singular naming with plural table mapping
- **Styling**: Tailwind utility classes with shadcn/ui component system