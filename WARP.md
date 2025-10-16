# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an **Acquisitions API Service** - a Node.js/Express REST API with JWT authentication, role-based access control, and security features powered by Arcjet. The application uses Drizzle ORM with Neon PostgreSQL database and includes Docker configurations for both development and production environments.

## Development Commands

### Local Development
```bash
npm run dev              # Start with Node.js --watch flag (hot reload)
npm run start           # Production start (no hot reload)
```

### Docker Development
```bash
npm run dev:docker      # Starts Docker compose with Neon Local database proxy
sh ./Scripts/dev.sh     # Same as above - starts full dev environment
```

### Database Commands
```bash
npm run db:generate     # Generate Drizzle migrations from schema
npm run db:migrate      # Apply migrations to database
npm run db:push         # Push schema directly without migration files
npm run db:studio       # Open Drizzle Studio (database GUI)
```

### Code Quality
```bash
npm run lint           # Check code with ESLint
npm run lint:fix       # Auto-fix ESLint issues
npm run format         # Format code with Prettier
npm run format:check   # Check if code is formatted
```

## Architecture

### Import Aliases
The project uses Node.js subpath imports (defined in `package.json`) for clean imports:
- `#src/*` → `./src/*`
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

**Important:** Some files use relative imports (e.g., `./Routes/auth.routes.js`) due to case sensitivity issues in the file structure. When adding new imports, prefer the alias style but be aware of this inconsistency.

### Request Flow
1. **Entry Point**: `src/index.js` → loads environment and starts `src/server.js`
2. **Server**: `src/server.js` → imports Express app and starts listening on PORT
3. **App Configuration**: `src/app.js` → sets up middleware chain:
   - Security headers (Helmet)
   - CORS
   - Body parsing (JSON, URL-encoded)
   - Cookie parsing
   - Request logging (Morgan → Winston)
   - **Health check endpoint** (`/health`) - bypasses security middleware
   - **Arcjet security middleware** - applied to all routes except `/health`
4. **Routes**: Mounted at `/api/auth` and `/api/users`
5. **Controllers**: Handle request/response, validate input with Zod
6. **Services**: Business logic (auth, user operations, password hashing)
7. **Models**: Drizzle ORM schema definitions

### Security Architecture

**Arcjet Integration** (`src/config/arcjet.js` and `src/middleware/security.middleware.js`):
- Bot detection (allows search engines, blocks others)
- Shield protection against SQL injection and common attacks
- Role-based rate limiting:
  - **Admin**: 20 requests/minute
  - **User**: 10 requests/minute
  - **Guest**: 10 requests/minute
- The `/health` endpoint explicitly bypasses security middleware for container health checks

### Authentication Flow

**JWT + HTTP-only Cookies:**
1. User signs up/signs in via `/api/auth/sign-up` or `/api/auth/sign-in`
2. Password is hashed with bcrypt (10 rounds)
3. JWT token generated with payload: `{id, email, role}`
4. Token stored in HTTP-only cookie (secure in production, 24h expiration)
5. User signs out via `/api/auth/sign-out` which clears the cookie

**Validation:** All auth routes use Zod schemas (`src/Validations/auth.validation.js`) with custom error formatting (`src/Utils/format.js`)

### Database

**Drizzle ORM + Neon PostgreSQL:**
- Schema defined in `src/models/*.js` (currently only `user.model.js`)
- Development uses **Neon Local** - an ephemeral database proxy that runs in Docker
- Production connects directly to Neon cloud database
- Database URL configured differently by environment:
  - **Development**: Routes through `http://neon-local:5432/sql` (see `src/config/database.js`)
  - **Production**: Direct Neon connection string

**Users Table Schema:**
```javascript
{
  id: serial (primary key),
  name: varchar(256),
  email: varchar(256) unique,
  password: varchar(256) hashed,
  role: varchar(50) default 'user',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Docker Setup

**Development** (`docker-compose.dev.yml`):
- **neon-local service**: Ephemeral database proxy on port 5432
- **app service**: Runs with hot reload, mounts `./src` directory
- Both services connected via `acquisition-network`

**Production** (`docker-compose.prod.yml`):
- Single app service with resource limits (512M memory, 0.5 CPU)
- No local database (connects to cloud Neon)
- Health checks via Node.js HTTP request to `/health`

**Multi-stage Dockerfile:**
- `base`: Node 20 Alpine with dumb-init
- `development`: Includes devDependencies, runs `npm run dev`
- `build`: Production dependencies only
- `production`: Minimal image, runs as non-root user `nextjs`

## Environment Variables

Required environment variables (see `.env.example`):
- `PORT` - Server port (default 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Winston logging level
- `DATABASE_URL` - Neon PostgreSQL connection string
- `ARCJET_KEY` - Arcjet API key for security features
- `JWT_SECRET` - Secret for signing JWT tokens (not in example, must be added)

## Code Style

**ESLint Configuration:**
- ES2022 syntax, ES modules
- 2-space indentation, single quotes, semicolons required
- Unix line endings
- Prefer `const`, no `var`, arrow functions, object shorthand
- Unused vars allowed if prefixed with underscore (`_`)

**Prettier**: Configured via `.prettierrc` (format on save recommended)

## Logging

**Winston logger** (`src/config/logger.js`) integrated with Morgan:
- Development: Console output with colors
- Production: File-based logging in `./logs/`
- Morgan HTTP logs piped to Winston

## Testing

**No test framework currently configured.** The `npm test` script exits with an error. When adding tests, integrate with the existing ESLint test globals configuration (already set up for Jest in `eslint.config.js`).
