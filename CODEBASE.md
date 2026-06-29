# StitchIt Codebase Documentation

StitchIt is an online cloth tailoring platform that lets customers browse fabric catalogs, place bespoke tailoring orders, book garment alteration pickups, and track everything end-to-end. The platform has a Spring Boot REST API backend and three separate Next.js 15 frontends sharing a monorepo.

---

## 1. Project Overview

StitchIt offers two core services:

**Tailoring** — Customers browse a fabric and style catalog, place an order, and a tailor visits them for measurements. The garment is stitched and delivered.

**Alter My Cloth** — Customers book a pickup slot. A tailor visits to collect garments, performs alterations (hemming, resizing, repairs, etc.), and delivers them back.

The system supports three user roles:

- **CUSTOMER** — browses catalog, places orders, books alterations
- **TAILOR** — manages assigned tailoring and alteration jobs, updates status
- **ADMIN** — full visibility, assigns tailors, views revenue analytics

---

## 2. Monorepo Structure

The project is managed with Turborepo and npm workspaces.

```
StitchIt/
├── apps/
│   ├── customer-web/       Next.js 15, port 3000 — customer-facing app
│   ├── tailor-portal/      Next.js 15, port 3001 — tailor dashboard
│   └── admin-dashboard/    Next.js 15, port 3002 — admin panel
├── packages/
│   ├── @stitchit/ui        Shared React component library (Button, Input, Toast)
│   ├── @stitchit/types     Shared TypeScript interfaces and type unions
│   └── @stitchit/api-client  API client, Zod schemas, endpoint definitions
├── backend/                Spring Boot 3.3 REST API
├── docker-compose.yml      PostgreSQL, Redis, Kafka infrastructure
├── turbo.json              Turborepo pipeline config
└── package.json            Workspace root with shared dev dependencies
```

All three frontends import from `@stitchit/ui`, `@stitchit/types`, and `@stitchit/api-client` via npm workspace symlinks. Turborepo caches build outputs and runs tasks in dependency order.

---

## 3. Backend Architecture

**Stack:** Spring Boot 3.3, Java 21, Spring Security 6, Spring Data JPA, Spring Data Redis, Spring OAuth2 Client, Flyway, JJWT 0.12.3.

**Database:** H2 in-memory for development (Flyway disabled), PostgreSQL for production (Flyway enabled, `ddl-auto=validate`).

**Application layers:**

```
HTTP Request
    → Spring Security Filter Chain (rate limiting, JWT validation, OAuth2)
    → Controller (@RestController, @PreAuthorize)
    → Service (business logic, transaction management)
    → Repository (Spring Data JPA)
    → Entity (JPA, mapped to database tables)
    → Response DTO (returned to client)
```

**Entry point:** `StitchItApplication.java` with `@EnableMethodSecurity` for `@PreAuthorize` annotations.

**Two Security Filter Chains** are registered:

1. **Order(1) — OAuth2 chain** matches `/oauth2/**` and `/login/oauth2/**`. Session-based so Spring Security can manage the OAuth2 state parameter across the redirect dance.

2. **Order(2) — API chain** matches all other paths. Stateless (`STATELESS` session policy). Adds `RateLimitFilter` then `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`. CORS configured with `allowCredentials=true`.

---

## 4. Authentication & Authorization

### JWT Cookie Architecture

All tokens are stored in httpOnly cookies, never in JavaScript-accessible storage.

- **Access token** — 15 minutes lifetime, sent as `access_token` httpOnly cookie on every response after login
- **Refresh token** — 7 days lifetime, sent as `refresh_token` httpOnly cookie, JTI stored in Redis for revocation

The `JwtService` generates tokens with:
- `sub` = userId
- `role` claim for the user's role
- `type` claim: `"access"` or `"refresh"`
- `jti` = random UUID (used for refresh token revocation in Redis)

### Auth Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Creates CUSTOMER account, returns UserResponse + sets cookies |
| POST | `/api/v1/auth/login` | Authenticates, returns UserResponse + sets cookies |
| POST | `/api/v1/auth/logout` | Revokes refresh token JTI in Redis, clears both cookies |
| POST | `/api/v1/auth/refresh` | Validates refresh token type+JTI, rotates both tokens |
| GET | `/api/v1/auth/me` | Returns current authenticated user from JWT principal |

### Google OAuth2 Flow

1. Customer clicks "Continue with Google" → navigated to `GET /oauth2/authorization/google`
2. Spring Security redirects to Google with state parameter (stored in session via Order(1) chain)
3. Google redirects back to `/login/oauth2/code/google`
4. `OAuth2UserService` extracts Google attributes, finds or creates a User with CUSTOMER role and `provider=GOOGLE`
5. `OAuth2AuthenticationSuccessHandler` issues access + refresh tokens, sets httpOnly cookies, redirects to `${frontend.customer-url}/auth/callback?oauth=true`
6. `/auth/callback` page in customer-web calls `/me` to hydrate Zustand store

### Rate Limiting

`RateLimitFilter` fires on all `/api/v1/auth/**` requests. Redis key `rate_limit:auth:{clientIp}` is incremented with a 60-second TTL. After 10 requests in the window, a 429 JSON response is returned. If Redis is unavailable, the filter fails open (request proceeds).

### Role-Based Access

`@PreAuthorize("hasRole('CUSTOMER')")` etc. on controller methods. The tailor portal login page checks `user.role !== 'TAILOR'` after a successful login and refuses entry if the role doesn't match. Same pattern in admin-dashboard for ADMIN.

---

## 5. Database Schema & Migrations

Flyway migrations live in `backend/src/main/resources/db/migration/`:

| Version | Description |
|---------|-------------|
| V1 | `users` and `addresses` tables |
| V2 | `fabrics`, `styles`, `customization_options` |
| V3 | `cart_items` |
| V4 | `orders`, `order_items` |
| V5 | `tailor_visits`, `measurements` |
| V6 | `shipments`, `reviews` |
| V7 | `provider`/`provider_account_id` columns on users, all alteration tables |
| V8 | Seed data: 8 alteration categories, 40+ services with INR prices |

The `users` table has `password` as nullable to support OAuth2 users who have no local password.

Key foreign key relationships:
- `alteration_orders.customer_id` → `users.id`
- `alteration_orders.tailor_id` → `users.id` (nullable)
- `alteration_order_items.alteration_order_id` → `alteration_orders.id`
- `alteration_order_items.alteration_service_id` → `alteration_services.id`
- `alteration_services.category_id` → `alteration_categories.id`

---

## 6. Alter My Cloth Feature

### Entities

**AlterationCategory** — Groups services by garment type. Types: PANT, SHIRT, KURTA, JACKET, SAREE_BLOUSE, SUIT, DRESS, OTHER. Each has a displayName, icon emoji, description, and sortOrder.

**AlterationService** — A specific alteration that can be booked (e.g., "Waist In/Out ₹199", "Zipper Replacement ₹299"). Each belongs to a category and has a basePrice, estimatedDays, and optional icon.

**AlterationOrder** — A customer's booking. Links to: customer (User), tailor (User, nullable), address (Address), one or more AlterationOrderItems. Has scheduledDate, scheduledSlot (MORNING_9_11, AFTERNOON_12_2, AFTERNOON_3_5, EVENING_6_8), specialInstructions, tailorNotes, before/after photo URLs, and a totalPrice computed from items.

**AlterationOrderItem** — A line item. References an AlterationService and stores the price at time of booking plus optional garmentDescription and customerNotes from the customer.

### Status Machine (8 states)

```
BOOKED → TAILOR_ASSIGNED → TAILOR_VISITED → GARMENT_COLLECTED
     → IN_ALTERATION → QUALITY_CHECK → OUT_FOR_DELIVERY → DELIVERED
```

Transitions are validated in `AlterationOrderService.validateStatusTransition()` using a Java switch expression. Invalid transitions throw a 400 error. ADMIN can set any status; TAILOR can only advance to the next state in sequence.

### REST Endpoints

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/alterations/categories` | Public |
| GET | `/api/v1/alterations/categories/{id}/services` | Public |
| POST | `/api/v1/alterations/orders` | CUSTOMER |
| GET | `/api/v1/alterations/orders` | CUSTOMER — their own orders |
| GET | `/api/v1/alterations/orders/{id}` | Authenticated — owner/tailor/admin |
| GET | `/api/v1/alterations/orders/tailor` | TAILOR — assigned to them |
| GET | `/api/v1/alterations/orders/admin` | ADMIN — all orders |
| PATCH | `/api/v1/alterations/orders/{id}/status` | TAILOR or ADMIN |
| POST | `/api/v1/alterations/orders/{id}/photos` | TAILOR or ADMIN |
| POST | `/api/v1/alterations/orders/{id}/assign?tailorId=` | ADMIN |

---

## 7. Shared Packages

### @stitchit/types

Pure TypeScript type definitions. No runtime code. Exports:

- `User`, `UserRole`, `Address`
- `Fabric`, `Style`, `CustomizationOption`, `Order`, `OrderItem`, `OrderStatus`
- `TailorVisit`, `Measurement`, `Shipment`, `Review`
- `AlterationCategory`, `AlterationService`, `AlterationOrder`, `AlterationOrderItem`
- `AlterationStatus`, `AlterationCategoryType`, `SlotTime`
- `ApiResponse<T>`, `PaginatedResponse<T>` (Spring Page format)

### @stitchit/api-client

Contains three exports:

**ApiClient** — Thin fetch wrapper. Uses `process.env.NEXT_PUBLIC_API_URL` (default: `http://localhost:8080/api/v1`). Sends `credentials: 'include'` on every request so cookies travel with cross-origin calls. Handles 204 No Content, unwraps `ApiResponse<T>.data`, throws `ApiRequestError` on non-2xx responses.

**ApiEndpoints** — All API calls as typed methods. Auth, profile, addresses, catalog, cart, orders, tailor visits, measurements, shipments, reviews, notifications, admin, and the full alterations API.

**Zod Schemas** — `loginSchema`, `registerSchema`, `alterationOrderSchema` with derived TypeScript types `LoginFormData`, `RegisterFormData`, `AlterationOrderFormData`.

### @stitchit/ui

Shared React components:

**Button** — `variant: 'primary' | 'secondary' | 'ghost'`, `size: 'sm' | 'md' | 'lg'`

**Input** — Styled text input forwarded with `React.forwardRef`

**ToastProvider / useToast** — Context-based toast system with `success()`, `error()`, `warning()`, `info()` shorthand methods and a `toast(message, variant)` general method. Framer Motion `AnimatePresence` for slide-in/out animations. Max 5 toasts stacked, auto-dismissed after 4 seconds.

---

## 8. Frontend Architecture

All three Next.js apps share the same architectural patterns:

### State Management

**Zustand** stores auth state: `{ user: User | null, isLoading: boolean }` with `setUser`, `setLoading`, `clearAuth` actions.

**TanStack Query** handles all server state (caching, deduplication, background refetch). The `['auth', 'me']` query key is the source of truth for the current user. Zustand syncs from TanStack Query via `useEffect` in `useCurrentUser()`.

### Auth Hooks

`useCurrentUser()` — Runs the `/me` query, syncs result to Zustand, handles 401 by setting user to null.

`useLogin()` — Mutation calling `/auth/login`, on success sets user in Zustand and populates TanStack Query cache.

`useLogout()` — Mutation calling `/auth/logout`, on settle clears Zustand, clears entire QueryClient cache, redirects to `/login`.

`useRegister()` — Mutation calling `/auth/register`, on success same as login.

### Protected Routes

`ProtectedRoute` component: calls `useCurrentUser()` to hydrate, reads Zustand `isLoading`, redirects to `/login` if unauthenticated. Tailor portal additionally checks `user.role !== 'TAILOR'` and redirects with `?error=role`. Admin dashboard does the same for `user.role !== 'ADMIN'`.

### Toast Integration

Each app's root `Providers` component wraps children with `<ToastProvider>`. Components call `const { toast, error } = useToast()` and show feedback on API success/error.

### Framer Motion

Login and register pages use `motion.div` with `initial={{ opacity: 0, y: 16 }}` / `animate={{ opacity: 1, y: 0 }}` entry animation. The alteration booking wizard wraps each step in `AnimatePresence` with `x: ±20` slide transitions. Toasts use `AnimatePresence` with vertical slide + scale exit.

---

## 9. Customer Web (`apps/customer-web`, port 3000)

**Route structure:**

```
/                         Landing page with catalog preview and "Alter My Cloth" section
/login                    Email/password + Google OAuth sign-in
/register                 Account registration with Zod validation
/auth/callback            OAuth2 redirect handler — calls /me, hydrates Zustand
/catalog                  Fabric catalog grid
/catalog/[id]             Fabric detail
/cart                     Shopping cart
/alterations              7-step alteration booking wizard (protected)
/alterations/orders       Order history list (protected)
/alterations/orders/[id]  Order detail with 8-step status timeline (protected)
```

**7-Step Alteration Booking Wizard:**

1. **Category** — Grid of garment category cards (PANT, SHIRT, KURTA, etc.)
2. **Services** — Multi-select services from the chosen category with prices and descriptions
3. **Item Details** — Per-service form: garment description + optional notes
4. **Schedule** — Date picker (min: tomorrow) + time slot selection (4 options)
5. **Address** — Select from saved addresses; shows error if none exist
6. **Summary** — Full review of all selections + optional special instructions field
7. **Confirmation** — Animated success screen with order ID and links to orders list

The `Navbar` shows auth state: unauthenticated = "Sign In" button; authenticated = user first name with dropdown (My Alterations, Sign Out).

---

## 10. Tailor Portal (`apps/tailor-portal`, port 3001)

Protected with TAILOR role check. Dashboard-style layout with a dark sidebar.

**Pages:**

- `/login` — Tailor sign-in form. After successful authentication, checks `user.role`. If CUSTOMER, shows error and refuses entry. Redirects TAILOR to `/dashboard`.
- `/dashboard` — Overview with stat cards (active jobs, delivered, today's visits) and recent orders table.
- `/dashboard/alterations` — Main work interface. Tab filter (Active / Delivered / All). Each order is an expandable accordion showing: customer details, pickup address, services, special instructions warning, a tailor notes textarea, and a "Mark as [NextStatus]" button. Auto-refreshes every 30 seconds.

The status advance button calculates the next valid state from a `STATUS_TRANSITIONS` map and is disabled on `DELIVERED` orders.

---

## 11. Admin Dashboard (`apps/admin-dashboard`, port 3002)

Protected with ADMIN role check. Dashboard-style layout with a dark sidebar.

**Pages:**

- `/login` — Admin sign-in. Rejects non-ADMIN accounts with a clear error message.
- `/dashboard` — Overview metrics: active alterations count, delivered count, total orders, total alteration revenue (delivered orders only). Recent orders table.
- `/dashboard/alterations` — Full alteration order management. Revenue breakdown at top (total revenue, delivered count, avg order value). Status filter chips across all 8 states. Each order row is expandable with: assign tailor by ID, free-form status override (any state via dropdown). Refreshes every 30 seconds.
- `/dashboard/orders` — Placeholder for tailoring order management.
- `/dashboard/users` — User table via `GET /admin/users`: name, email, role badge, join date.

---

## 12. Infrastructure & Local Development

**Docker Compose** (`docker-compose.yml`) starts:
- PostgreSQL 15 on port 5432
- Redis 7 on port 6379
- Kafka + Zookeeper (for future use)

**Development mode** (`application-dev.properties`):
- H2 in-memory database (no Docker needed for quick iteration)
- Flyway disabled (JPA creates schema from entities)
- Redis with 500ms connection timeout — fails open if not running
- Kafka autoconfiguration excluded to prevent startup failure
- OAuth2 client ID/secret default to empty strings (set via env vars to enable)

**Production mode** (`application-prod.properties`):
- PostgreSQL via `DATABASE_URL` env var
- Flyway enabled, `ddl-auto=validate`
- All secrets via environment variables: `JWT_SECRET`, `REDIS_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CORS_ORIGINS`, `FRONTEND_CUSTOMER_URL`

**Starting locally:**

```bash
# Start backend (H2 mode, no Docker needed)
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Install all frontend dependencies
npm install

# Start all three Next.js apps in parallel
npm run dev         # from monorepo root via Turborepo
```

Frontend environment variables (`.env.local` in each app):
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## 13. Security Considerations

**httpOnly cookies** — Both access and refresh tokens are httpOnly, preventing XSS access to tokens. `SameSite=Lax` prevents CSRF on same-origin navigation.

**Refresh token rotation** — Each call to `/refresh` issues a new JTI, invalidates the old one in Redis. A stolen refresh token can only be used once.

**Redis rate limiting** — 10 auth requests per 60 seconds per IP prevents brute-force attacks. The filter extracts the real client IP from `X-Forwarded-For` → `X-Real-IP` → `remoteAddr` (in that priority order).

**Role enforcement at two layers** — Spring Security `@PreAuthorize` on every controller method is the authoritative check. Frontend portal login pages also check role after login and show a user-facing error for wrong-role access (defense in depth).

**OAuth2 state parameter** — Handled by Spring Security's session-based Order(1) filter chain. The stateless API chain (Order(2)) does not interfere because filter chain matching is exclusive by path.

**Password handling** — BCrypt via `BCryptPasswordEncoder` (Spring Security default). OAuth2 users have `null` password in the database (column is nullable since V7 migration).

**CORS** — Configured via `CORS_ORIGINS` environment variable with `allowCredentials=true` and `maxAge=3600`. Origin must be explicitly listed; wildcard is not allowed when credentials are included.

---

## 14. Known Limitations & Future Work

**Kafka** — Kafka is scaffolded in Docker Compose and excluded from autoconfiguration in dev mode. No producers or consumers are implemented yet. Intended for order status notifications and event streaming.

**Photo upload** — The `uploadAlterationPhotos` endpoint accepts URL arrays (assumes photos are pre-uploaded to a CDN/S3). There is no upload endpoint for binary files. A file upload service with pre-signed S3 URLs would need to be added.

**Address management UI** — Customers must have at least one address to complete the alteration booking flow. There is currently no address creation UI in customer-web. The addresses are created via the API directly. An address management page at `/profile/addresses` would complete this flow.

**Alteration booking requires addresses** — If a customer has no saved addresses, the booking wizard shows an error on Step 5. This is by design but the UX could guide them to create one inline.

**Admin tailor assignment** — The admin assigns tailors by entering a raw User ID. A tailor selection dropdown (populated from `GET /admin/users` filtered by TAILOR role) would be a cleaner UX.

**Notification system** — The `Notification` entity and `NotificationType` types are defined but no notification sending is implemented. This would integrate with Kafka once producers are wired.

**Measurement flow** — The tailoring order measurement submission (`/measurements`) endpoint is defined in the API client but no UI exists for tailors to submit measurements via the portal. This is the next major feature needed for the tailoring (non-alteration) flow.

**Testing** — Vitest is configured in all three Next.js apps. Backend has Spring Boot Test on the classpath. No test files are written yet. The recommended starting point is integration tests for `AlterationOrderService` and auth flows.
