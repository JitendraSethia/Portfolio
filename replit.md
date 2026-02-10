# Jitendra Sethia Portfolio

## Overview

A modern, single-page portfolio website showcasing Jitendra Sethia's professional profile, skills, projects, and experience. Built as a personal portfolio for a 3rd-year B.Tech Computer Science & Engineering student seeking internship and remote opportunities in Software Engineering and Product Development. The application features a responsive, dark-mode-first design with smooth animations and professional aesthetics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18+** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR and optimized production builds
- **Wouter** for lightweight client-side routing (single-page application)
- **TanStack Query (React Query)** for server state management and data fetching

**UI Component System**
- **shadcn/ui** component library based on Radix UI primitives
- Custom component configuration via `components.json` with "new-york" style
- Path aliases configured for clean imports: `@/components`, `@/lib`, `@/hooks`, `@/ui`

**Styling Approach**
- **Tailwind CSS** for utility-first styling with custom design system
- **Dark-mode-first** design with CSS variables for theming
- Custom color palette using HSL values for consistent theming
- Responsive breakpoints: mobile-first approach with md, lg, xl breakpoints
- Design guidelines documented in `design_guidelines.md` specifying spacing, typography, and component patterns

**Animation & Interactions**
- **Framer Motion** for smooth page transitions, scroll animations, and micro-interactions
- Stagger animations for list items and cards
- Scroll-triggered viewport animations using `whileInView`
- Custom page loader with animated transitions

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for API routing and middleware
- Custom Vite middleware integration for development mode
- Static file serving in production
- Error handling middleware with status code management

**Storage Layer**
- **In-memory storage implementation** (`MemStorage`) as default storage interface
- Abstracted storage interface (`IStorage`) for future database integration
- User CRUD operations defined (ready for authentication features)

**Database Configuration** (Prepared but not actively used)
- **Drizzle ORM** configured for PostgreSQL
- **Neon Database** serverless driver (`@neondatabase/serverless`)
- Schema defined in `shared/schema.ts` with Zod validation
- Migration system configured via `drizzle.config.ts`

### Design System

**Color System**
- Background: Dark slate tones (240 23% 9%)
- Text: High contrast white/light gray
- Accents: Teal (192 91% 54%) or Indigo (238 83% 63%)
- Card backgrounds with subtle borders
- CSS custom properties for dynamic theming

**Typography Scale**
- System sans-serif font stack (Inter loaded from Google Fonts)
- Headlines: 4xl to 6xl with bold weight
- Section titles: 3xl to 4xl with semibold
- Body text: Base to lg with relaxed leading
- Responsive font sizing with md and lg breakpoints

**Layout Patterns**
- Fixed navigation with backdrop blur glass-morphism
- Full viewport hero section with centered content
- Consistent section padding: 16-32 vertical spacing units
- Max-width container (6xl) with horizontal padding
- Grid and flexbox layouts with gap-based spacing

### Page Structure

**Single Page Application Sections**
1. **Hero** - Full-screen introduction with profile image and CTA buttons
2. **About Me** - Personal bio with highlights and profile image
3. **Education** - Academic background and coursework
4. **Passions** - Core interests and motivations (grid of cards)
5. **Skills** - Technical skills with infinite scroll animation
6. **Projects** - Portfolio projects with status badges and links
7. **Contact** - LinkedIn and email CTAs
8. **Footer** - Copyright and credits

## External Dependencies

### UI & Component Libraries
- **Radix UI** - Headless component primitives (dialogs, dropdowns, navigation, etc.)
- **shadcn/ui** - Pre-built accessible components
- **Lucide React** - Icon library for consistent iconography
- **class-variance-authority** - Type-safe variant styling
- **clsx** & **tailwind-merge** - Conditional className utilities

### Animation & Motion
- **Framer Motion** - Declarative animations and gestures
- **Embla Carousel** - Touch-friendly carousel component

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@hookform/resolvers** - Zod integration for forms

### Development Tools
- **TypeScript** - Static type checking
- **ESBuild** - Server-side bundling for production
- **PostCSS** & **Autoprefixer** - CSS processing
- **Replit Plugins** - Development banners, error overlay, and cartographer

### Database & ORM (Configured)
- **Drizzle ORM** - Type-safe SQL query builder
- **Drizzle Kit** - Schema migrations and push commands
- **Drizzle Zod** - Schema to Zod validation integration
- **@neondatabase/serverless** - Serverless PostgreSQL driver
- **Neon Database** - Hosting (via DATABASE_URL environment variable)

### State Management
- **TanStack Query** - Server state, caching, and data synchronization
- **Wouter** - Minimalist routing solution

### Assets
- Static images stored in `attached_assets/` directory
- Vite alias configured as `@assets` for asset imports
- Profile and cover images for hero section