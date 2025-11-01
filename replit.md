# Antriksh Dashboard

## Overview

Antriksh Dashboard is a modern task management and productivity platform built with React and Express. The application features a clean, minimal interface with Kanban-style boards, message inbox management, third-party integrations, and user settings. It provides a comprehensive workspace for organizing tasks, managing communications, and connecting with external services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Client-side routing implemented with Wouter, a lightweight React router. The application follows a single-page application (SPA) pattern with the following routes:
- `/` - Dashboard (overview and statistics)
- `/boards` - Kanban board view for task management
- `/inbox` - Message management interface
- `/integrations` - Third-party service connections
- `/settings` - User preferences and configuration

**State Management**: 
- TanStack Query (React Query) for server state management, data fetching, and caching
- React Context API for theme management (light/dark mode)
- Form state managed by React Hook Form with Zod validation

**UI Component Library**: Shadcn/ui (Radix UI primitives) with Tailwind CSS for styling. The design system follows a "New York" style variant with custom CSS variables for theming and a neutral color palette as the base.

**Design System**:
- Custom theme system supporting light and dark modes through CSS variables
- Consistent spacing using Tailwind's spacing scale (primarily p-4, p-6, p-8)
- Typography hierarchy with defined text sizes (text-2xl for titles, text-xl for sections, text-lg for cards)
- Animation system using Framer Motion for smooth transitions and micro-interactions
- Elevation system with hover states (hover-elevate, active-elevate-2) for interactive elements

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Design**: RESTful API with JSON payloads. Key endpoints include:
- `/api/tasks` - CRUD operations for task management
- `/api/messages` - Message inbox operations including conversion to tasks
- `/api/integrations` - Third-party integration status management
- `/api/activities` - Activity log tracking
- `/api/settings` - User settings management

**Request/Response Handling**: All API responses are JSON formatted. The server includes custom middleware for request logging that captures method, path, status code, duration, and response body (truncated to 80 characters).

**Data Storage Strategy**: The application uses an in-memory storage implementation (`MemStorage` class) as the default storage mechanism. This provides a simple key-value store using JavaScript Maps for tasks, messages, integrations, and settings. The storage layer is abstracted through an `IStorage` interface, allowing for easy swapping to persistent storage solutions.

**Validation**: Schema validation using Zod for both client and server-side data validation. Shared schema definitions ensure type safety across the full stack.

### Data Storage Solutions

**Current Implementation**: In-memory storage using JavaScript Maps. Data is stored in the following collections:
- Tasks - Keyed by task ID
- Messages - Keyed by message ID
- Activities - Array-based log
- Integrations - Keyed by integration ID
- Settings - Single settings object

**Database Configuration**: Drizzle ORM is configured with PostgreSQL support via `@neondatabase/serverless` driver. The configuration expects a `DATABASE_URL` environment variable and uses migrations stored in the `./migrations` directory. The schema is defined in `./shared/schema.ts`.

**Migration Strategy**: Drizzle Kit is configured for schema management with the `db:push` script available for pushing schema changes to the database.

**Future Persistence**: The architecture supports migration to PostgreSQL through the configured Drizzle ORM setup. The `IStorage` interface abstraction allows implementing a database-backed storage class without changing application logic.

### Authentication and Authorization

**Current State**: The application currently does not implement authentication or authorization mechanisms. All API endpoints are publicly accessible.

**Session Management**: The application includes `connect-pg-simple` as a dependency for PostgreSQL-backed session storage, indicating planned session management implementation.

### External Dependencies

**UI and Styling**:
- Radix UI - Comprehensive set of accessible UI primitives (@radix-ui/react-*)
- Tailwind CSS - Utility-first CSS framework with PostCSS processing
- Framer Motion - Animation library for smooth transitions
- class-variance-authority - CVA for managing component variants
- Lucide React - Icon library
- React Icons - Additional icons (specifically for integration logos like Gmail, Slack)

**Data Management**:
- TanStack Query (@tanstack/react-query) - Server state management and caching
- React Hook Form - Form state management
- Zod - Schema validation and TypeScript type inference
- date-fns - Date manipulation and formatting

**Database and ORM**:
- Drizzle ORM - TypeScript ORM with Zod integration
- @neondatabase/serverless - Neon PostgreSQL serverless driver
- connect-pg-simple - PostgreSQL session store for Express sessions

**Build and Development Tools**:
- Vite - Frontend build tool and dev server
- TypeScript - Type safety across the stack
- esbuild - Server-side bundling for production
- tsx - TypeScript execution for development
- @replit/* plugins - Replit-specific development enhancements (cartographer, dev banner, runtime error modal)

**Carousel/Embla**: embla-carousel-react for carousel/slider components

**Command Palette**: cmdk for command palette interface components

The application uses a monorepo structure with shared TypeScript types and schemas between client and server, enabling full-stack type safety.