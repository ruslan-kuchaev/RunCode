# Technology Stack

## Framework & Runtime
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Node.js** - Runtime environment

## Database & ORM
- **Prisma 6.15.0** - Database ORM with client generation
- **PostgreSQL** - Primary database (configured via DATABASE_URL)
- **Prisma Accelerate** - Database connection pooling and caching

## 3D Graphics & Animation
- **Three.js 0.180.0** - 3D graphics library
- **@react-three/fiber 9.3.0** - React renderer for Three.js
- **@react-three/drei 10.7.6** - Useful helpers for R3F
- **GSAP 3.13.0** - Animation library

## Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library (New York style)
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management

## State Management
- **Zustand 5.0.8** - Lightweight state management

## Development Tools
- **ESLint 9** - Code linting
- **tsx** - TypeScript execution

## Common Commands

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open Prisma Studio GUI
```

## Environment Setup
- Requires `.env` file with `DATABASE_URL` for PostgreSQL connection
- Prisma client generates to `src/app/generated/prisma/`