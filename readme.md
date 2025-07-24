# German Learning Application

## Overview

This is a full-stack German learning application built with Express.js, React, and TypeScript. The application provides a comprehensive platform for learning German through flashcards, vocabulary management, interactive exercises, and voice conversations. It features a modern UI built with shadcn/ui components and Tailwind CSS

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **State Management**: React Context API for global state (Auth, Vocabulary)
- **Data Fetching**: TanStack React Query for server state management
- **Routing**: React Router for client-side navigation
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture

- **Framework**: Express.js with TypeScript
- **Build System**: ESBuild for production builds
- **Development**: tsx for TypeScript execution in development

### Data Storage Solutions

- **Primary Database**:
- **Schema Management**:
- **Local Storage**:
- **Session Management**:
- **In-Memory Storage**:

## Key Components

### Authentication & Authorization

- Simple context-based authentication system
- Hardcoded demo credentials for development (demo@german-learning.com / Demo123!)
- Form validation using Zod schemas with security best practices
- Rate limiting for login attempts and API calls
- Input sanitization and XSS protection

### Vocabulary Management

- Custom word creation with categories, sample sentences, and learning history
- Fuzzy search functionality for word discovery
- Drag-and-drop interface for exercise creation
- Photo-based word extraction (simulated with sample data)
- Anki export functionality for spaced repetition
- Vocabulary context provider for global state management

### Exercise System

- Multiple exercise types: Gap-fill, Multiple Choice, Translation, Matching, Word Formation, etc.
- OpenAI API integration for dynamic exercise generation
- Exercise history tracking and progress monitoring
- PDF export functionality for offline practice
- Service-based architecture for exercise data management

### UI/UX Components

- Responsive sidebar navigation with collapsible sections
- Dark/light theme support with system preference detection
- Toast notifications for user feedback
- Loading states and error handling
- Accessible form components with proper validation feedback

## Data Flow

1. **User Authentication**: Client authenticates with hardcoded credentials, session stored server-side
2. **Vocabulary Management**: Words stored in context, persisted to localStorage, eventually to PostgreSQL
3. **Exercise Generation**: User selects words → Service manages exercise data → OpenAI generates content → Results displayed
4. **Learning Progress**: Exercise results tracked in vocabulary context and stored in user's learning history

## External Dependencies

### Core Libraries

- **UI Components**: Radix UI primitives for accessibility and functionality
- **Styling**: Tailwind CSS for utility-first styling
- **Database**:
- **AI Integration**: OpenAI API for exercise content generation
- **PDF Generation**: jsPDF for creating downloadable exercise sheets
- **Form Validation**: Zod for type-safe schema validation

### Development Tools

- **TypeScript**: Full type safety across frontend and backend
- **ESLint & Prettier**: Code quality and formatting (implied by structure)

## Deployment Strategy

### Development

- Vite dev server for frontend with HMR
- tsx for backend TypeScript execution
- Replit-specific middleware for development features
- Environment-based configuration for database connections

### Build Process

1. Frontend: `vite build` → static assets in `dist/public`
