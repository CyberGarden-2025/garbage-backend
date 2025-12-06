# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS backend application using TypeScript, Prisma ORM with PostgreSQL, and Swagger for API documentation. The application is structured as a modular NestJS application with a custom Prisma client generation path.

## Development Commands

### Setup

```bash
npm install
```

### Database Operations

```bash
# Generate Prisma client (outputs to generated/prisma)
npm run db:generate

# Run migrations in development (creates and applies migrations)
npm run db:migrate:dev

# Deploy migrations to production
npm run db:migrate

# Reset database (WARNING: deletes all data)
npm run db:migrate:reset
```

### Running the Application

```bash
# Development mode with watch
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

### Building and Formatting

```bash
# Build the application
npm run build

# Format code with Prettier
npm run format
```

## Architecture

### Custom Prisma Setup

- Prisma client is generated to `generated/prisma` (not the default `node_modules/.prisma/client`)
- All imports from Prisma should use: `import { ... } from '../../generated/prisma'`
- After schema changes, always run `npm run db:generate` to regenerate the client

### Module Structure

The application follows NestJS modular architecture:

- **AppModule** ([src/app/app.module.ts](src/app/app.module.ts)) - Root module that imports:
  - AuthModule - Authentication and user registration
  - ConfigModule - Global environment configuration (loads from `.env`)
  - PrismaModule - Global database service

- **PrismaModule** ([src/prisma/](src/prisma/)) - Provides PrismaService for database access
  - PrismaService extends PrismaClient and handles connection on module init
  - Imported by feature modules that need database access

- **AuthModule** ([src/auth/](src/auth/)) - Handles authentication
  - Uses bcrypt for password hashing
  - Currently implements registration endpoint
  - Uses AuthMapper to transform database entities to response DTOs

### Global Configuration

The application is configured in [src/main.ts](src/main.ts) with:

- Global validation pipe (whitelist, forbidNonWhitelisted, transform enabled)
- Global exception filter (AllExceptionsFilter)
- Global logging interceptor (LoggingInterceptor)
- CORS enabled for all origins
- Swagger documentation available at `/{SWAGGER_PATH}` (default: `/docs`)

### Shared Infrastructure

- **Filters** ([src/shared/filters/](src/shared/filters/)) - Global exception handling
  - AllExceptionsFilter catches all exceptions and formats error responses uniformly

- **Interceptors** ([src/shared/interceptors/](src/shared/interceptors/)) - Request/response processing
  - LoggingInterceptor logs all HTTP requests with method, URL, status code, and response time

- **Utils** ([src/shared/utils/](src/shared/utils/)) - Shared utilities
  - password.utils.ts contains bcrypt hashing utilities

### Database Schema

The Prisma schema ([prisma/schema.prisma](prisma/schema.prisma)) currently defines:

- **Point** model - Represents a point/location entity with authentication
  - id (UUID)
  - name (unique)
  - login (unique)
  - hashedPassword
  - createdAt, updatedAt timestamps

### Environment Configuration

Required environment variables (see [.env.example](.env.example)):

- `NODE_ENV` - Environment (development/production)
- `APPLICATION_PORT` - Port for the application (default: 4000)
- `SWAGGER_URL` - Base URL for Swagger docs
- `SWAGGER_PATH` - Path for Swagger UI
- `DATABASE_URL` - PostgreSQL connection string

### TypeScript Configuration

- Uses `nodenext` module resolution
- Decorators enabled (required for NestJS)
- Strict null checks enabled
- Output directory: `dist/`
- Source maps enabled
