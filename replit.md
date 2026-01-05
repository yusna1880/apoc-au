# 아포AU - Post-Apocalyptic Story Game

## Overview

A post-apocalyptic storytelling game called "아포AU - 2026" built with React and Express. The application features an immersive start screen with interactive effects (parallax, dust particles, sparkles), background music, and video transitions. The design follows The Last of Us aesthetic with a dark, gritty atmosphere and strategic red accent colors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Build Tool**: Vite with React plugin

The frontend lives in `client/src/` with the entry point at `main.tsx`. Pages are in `pages/`, reusable UI components in `components/ui/`. Path aliases are configured (`@/` maps to `client/src/`, `@shared/` to `shared/`, `@assets/` to `attached_assets/`).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Pattern**: RESTful routes prefixed with `/api`
- **Build**: esbuild bundles server code into `dist/index.cjs`

Server code is in `server/` with `index.ts` as entry point. Routes are registered in `routes.ts`, static file serving in `static.ts`, and Vite dev server integration in `vite.ts`.

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's table builders
- **Migrations**: Output to `migrations/` directory via `drizzle-kit push`
- **Current Storage**: In-memory storage class (`MemStorage`) as fallback when database isn't configured

The storage layer uses an interface pattern (`IStorage`) allowing easy swapping between memory and database implementations.

### Design System
- **Theme**: Dark post-apocalyptic aesthetic with red primary color (#DC2626)
- **Typography**: Industrial sans-serif fonts (Rajdhani, Orbitron)
- **Effects**: Mouse parallax, floating dust particles, click sparkles
- **Media**: Background images, looping audio, video transitions

Design specifications are documented in `design_guidelines.md`.

## External Dependencies

### Database
- PostgreSQL (configured via `DATABASE_URL` environment variable)
- connect-pg-simple for session storage

### UI Libraries
- Radix UI primitives for accessible components
- Embla Carousel for carousels
- Recharts for charts
- react-day-picker for calendar
- Vaul for drawer component
- cmdk for command palette

### Key Runtime Dependencies
- express-session for session management
- zod for validation
- drizzle-zod for schema-to-Zod integration
- wouter for client-side routing
- class-variance-authority for component variants
- tailwind-merge for className merging

### Development Tools
- Vite with HMR
- Replit-specific plugins for error overlay and dev banner
- TypeScript with strict mode
- PostCSS with Tailwind and Autoprefixer