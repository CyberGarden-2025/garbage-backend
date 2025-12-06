# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS backend application for a garbage recycling gamification system. It uses TypeScript, Prisma ORM with PostgreSQL for persistence, Redis for quest state management, and integrates with an external ML API for image categorization. The application features a quest system with daily/weekly challenges and scheduled jobs.

## Development Commands

### Setup and Dependencies

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

### Docker Services

The application requires PostgreSQL and Redis. Start them with:

```bash
docker compose up -d
```

- PostgreSQL: exposed on port 5433 (maps to container port 5432)
- Redis: exposed on port 6379

## Architecture

### Custom Prisma Setup

- Prisma client is generated to `generated/prisma` (not the default `node_modules/.prisma/client`)
- All imports from Prisma must use: `import { ... } from '../../generated/prisma'`
- After schema changes, always run `npm run db:generate` to regenerate the client

### Path Aliases

The project uses TypeScript path aliases configured in tsconfig.json:

- `@/*` maps to `src/*`
- Example: `import { RedisModule } from '@/redis/redis.module'`

### Module Architecture

The application follows NestJS modular architecture with these key modules:

- **AppModule** - Root module that imports all feature modules and global services
- **PrismaModule** - Global database service provider
- **RedisModule** - Global Redis service provider for quest state management
- **PointsModule** - User (garbage collection point) management and authentication
- **QuestsModule** - Daily/weekly quest system with scheduled generation
- **DisposalsModule** - Garbage disposal tracking and coin rewards
- **CategorizeModule** - ML API integration for garbage image categorization

### Quest System Architecture

The quest system is a core feature that uses Redis for temporary state and scheduled jobs:

- **Quest Generation**: Cron jobs generate new daily quests at midnight (`@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)`) and weekly quests every week (`@Cron(CronExpression.EVERY_WEEK)`)
- **Quest Storage**: Quest configurations are stored in Redis with TTL (1 day for daily, 1 week for weekly)
- **Progress Tracking**: User progress is tracked in Redis using keys like `quests:daily:{pointId}:progress:{questId}`
- **Rewards**: When quests are completed, coins are added to user balance via Prisma and completion state is stored in Redis
- **Reset Logic**: Progress is automatically reset when new quests are generated using Redis pattern deletion

### External ML API Integration

The CategorizeService integrates with an external ML API for garbage classification:

- Images are sent via multipart/form-data POST request
- API returns a task_id for async processing
- Service polls the API (default: 100 attempts, 10s delay) until status is 'DONE'
- Result contains garbage type/subtype classification used for disposal tracking

### Global Configuration

The application is configured in [src/main.ts](src/main.ts) with:

- Global validation pipe (whitelist, forbidNonWhitelisted, transform enabled)
- Global exception filter (AllExceptionsFilter)
- Global logging interceptor (LoggingInterceptor)
- CORS enabled for all origins
- Swagger documentation with Bearer authentication support
- Swagger available at `/{SWAGGER_PATH}` (default: `/docs`)

### Shared Infrastructure

- **Filters** - Global exception handling with AllExceptionsFilter
- **Interceptors** - LoggingInterceptor logs all HTTP requests with method, URL, status code, and response time
- **Constants** - Shared constants for garbage types, subtypes, quest goals, and coin rewards
- **Utils** - Utilities for password hashing (bcrypt) and time conversion

### Database Schema

The Prisma schema defines:

- **User** - Garbage collection points with authentication, balance, and admin flag
  - id (UUID), name (unique), login (unique), hashedPassword
  - balance (Int, default 0), isAdmin (Boolean, default false)
  - One-to-many relationship with GarbageHistory

- **GarbageHistory** - Tracks garbage disposal events
  - id (UUID), userId, garbageType, garbageSubtype, garbageState, coinAmount
  - Many-to-one relationship with User
  - Indexed on userId for efficient queries

### Environment Configuration

Required environment variables (see [.env.example](.env.example)):

- `NODE_ENV` - Environment (development/production)
- `APPLICATION_PORT` - Port for the application (default: 4000)
- `SWAGGER_URL` - Base URL for Swagger docs
- `SWAGGER_PATH` - Path for Swagger UI
- `POSTGRES_URL` - PostgreSQL connection string (note: uses POSTGRES_URL, not DATABASE_URL)
- `ML_API_URL` - External ML API endpoint for image categorization
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_USER`, `REDIS_PASSWORD` - Redis connection details

### TypeScript Configuration

- Uses `nodenext` module resolution
- Decorators enabled (required for NestJS)
- Path aliases: `@/*` maps to `src/*`
- Strict null checks enabled
- Output directory: `dist/`
- Source maps enabled
