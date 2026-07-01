# StitchIt Codebase Documentation

StitchIt is a cloth alteration platform. Customers book tailor visits for garment alterations. Tailors manage assigned jobs and update status. Admins have full oversight.

See `STITCHPLAN.md` for the issue tracker, bug assignments, and sprint plan.

---

## 1. Monorepo Structure

Managed with Turborepo and npm workspaces.

```
StitchIt/
├── apps/
│   ├── customer-web/       Next.js 15, port 3000 — customer-facing app
│   ├── tailor-portal/      Next.js 15, port 3001 — tailor dashboard
│   └── admin-dashboard/    Next.js 15, port 3002 — admin panel
├── packages/
│   ├── ui/                 @stitchit/ui — shared React components
│   ├── types/              @stitchit/types — shared TypeScript interfaces
│   └── api-client/         @stitchit/api-client — API methods + Zod schemas
├── backend/                Spring Boot 3.3 REST API, port 8080
├── STITCHPLAN.md           Issue tracker + sprint plan
├── turbo.json
└── package.json
```

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS, Framer Motion |
| State | Zustand (auth), TanStack Query (server state) |
| Backend | Spring Boot 3.3, Java 21 |
| Database | PostgreSQL (Supabase) — schema managed by Flyway V1, V7, V8 |
| Cache | Redis — refresh token JTI revocation + rate limiting |
| Auth | JWT in httpOnly cookies (15 min + 7 day refresh) + Google OAuth2 |
| Monorepo | Turborepo + npm workspaces |

---

## 3. Backend Architecture

**Stack:** Spring Boot 3.3, Java 21, Spring Security 6, Spring Data JPA, Spring Data Redis, Spring OAuth2 Client, Flyway, JJWT 0.12.3.

**Package layout:**

```
backend/src/main/java/com/stitchit/
├── controller/
│   ├── AuthController.java
│   └── AlterationController.java
├── service/
│   ├── AuthService.java
│   └── AlterationOrderService.java
├── entity/
│   ├── User.java
│   ├── Role.java
│   ├── Address.java
│   ├── AlterationCategory.java
│   ├── AlterationService.java
│   ├── AlterationOrder.java
│   ├── AlterationOrderItem.java
│   ├── AlterationStatus.java
│   └── SlotTime.java
├── repository/
│   ├── UserRepository.java
│   ├── AddressRepository.java
│   ├── AlterationCategoryRepository.java
│   ├── AlterationServiceRepository.java
│   └── AlterationOrderRepository.java
├── dto/               # Request/response DTOs
├── security/
│   ├── JwtService.java
│   ├── JwtAuthenticationFilter.java
│   ├── RateLimitFilter.java
│   ├── CookieUtils.java
│   ├── OAuth2UserService.java
│   ├── OAuth2AuthenticationSuccessHandler.java
│   └── UserPrincipal.java
├── config/
│   ├── SecurityConfig.java
│   ├── AuthenticationConfig.java
│   ├── DevDataInitializer.java
│   └── OpenApiConfig.java
└── exception/
    └── GlobalExceptionHandler.java
```

**Two Security Filter Chains:**

1. **Order 1 — OAuth2 chain** — matches `/oauth2/**` and `/login/oauth2/**`. Session-based so Spring Security can hold the OAuth2 state parameter across the redirect.
2. **Order 2 — API chain** — matches all other paths. Stateless. Adds `RateLimitFilter` then `JwtAuthenticationFilter` before the standard auth filter.

---

## 4. Authentication & Authorization

### JWT Cookies

Tokens are stored in httpOnly cookies, never in JS-accessible storage.

| Cookie | Path | Lifetime | Purpose |
|--------|------|----------|---------|
| `jwt` | `/api` | 15 minutes | Access token sent on every API call |
| `refresh_token` | `/api/v1/auth` | 7 days | Used to rotate the access token; JTI stored in Redis for revocation |

`CookieUtils` centralises cookie creation — `SameSite=Lax`, `Secure` flag driven by `app.cookie.secure` property (false in dev/local, true in prod).

### Auth Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Creates CUSTOMER account, sets cookies |
| POST | `/api/v1/auth/login` | Authenticates, sets cookies |
| POST | `/api/v1/auth/logout` | Revokes JTI in Redis, clears cookies |
| POST | `/api/v1/auth/refresh` | Rotates both tokens |
| GET | `/api/v1/auth/me` | Returns current user from JWT principal |

### Google OAuth2 Flow

1. `/oauth2/authorization/google` → Google → `/login/oauth2/code/google`
2. `OAuth2UserService` finds or creates a `CUSTOMER` with `provider=GOOGLE`
3. `OAuth2AuthenticationSuccessHandler` sets cookies, redirects to `/auth/callback?oauth=true`
4. `/auth/callback` page calls `/me` to hydrate Zustand

### Rate Limiting

`RateLimitFilter` — sliding-window (Redis sorted set, Lua script), 10 requests per 60 seconds per IP. Applies to `/api/v1/auth/login` and `/api/v1/auth/register` only. Trusted proxy IPs configurable via `app.rate-limit.trusted-proxies`. Fails open with ERROR log if Redis is unavailable.

### Role Enforcement

`@PreAuthorize("hasRole('TAILOR')")` etc. on controller methods. Frontend portals also check role after login and reject wrong-role accounts.

### Dev Seed Accounts

`DevDataInitializer` runs on `dev` and `local` profiles only, seeds on startup if emails don't exist:

| Role | Email | Password |
|------|-------|----------|
| ADMIN | `admin@stitchit.com` | `Admin@123` |
| TAILOR | `tailor@stitchit.com` | `Tailor@123` |

---

## 5. Database Migrations (Flyway)

Migrations in `backend/src/main/resources/db/migration/`:

| Version | Contents |
|---------|---------|
| V1 | `users`, `addresses` |
| V7 | `provider`/`provider_account_id` on users; all alteration tables |
| V8 | Seed — 8 alteration categories, 40+ services with INR prices |

Database: Supabase PostgreSQL. Connection via `DB_PASSWORD` env var (see Local Development).

---

## 6. Alter My Cloth Feature

### Entities

- **AlterationCategory** — garment type group (PANT, SHIRT, KURTA, JACKET, SAREE_BLOUSE, SUIT, DRESS, OTHER)
- **AlterationService** — specific alteration (e.g. "Waist In/Out ₹199"), belongs to a category
- **AlterationOrder** — customer booking; links customer, tailor (nullable), address, items, slot, photos, notes
- **AlterationOrderItem** — line item; references service + records price at time of booking

### Status Machine

```
BOOKED → TAILOR_ASSIGNED → TAILOR_VISITED → GARMENT_COLLECTED
       → IN_ALTERATION → QUALITY_CHECK → OUT_FOR_DELIVERY → DELIVERED
```

Enforced in `AlterationOrderService.validateStatusTransition()`.

Known bugs: `BOOKED → BOOKED` no-op allowed (Q3); admin cannot bypass sequential rules (C6).

### REST Endpoints

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/v1/alterations/categories` | Public |
| GET | `/api/v1/alterations/categories/{id}/services` | Public |
| POST | `/api/v1/alterations/orders` | CUSTOMER |
| GET | `/api/v1/alterations/orders` | CUSTOMER — own orders |
| GET | `/api/v1/alterations/orders/{id}` | Owner / TAILOR / ADMIN |
| GET | `/api/v1/alterations/orders/tailor` | TAILOR — assigned to them |
| GET | `/api/v1/alterations/orders/admin` | ADMIN — all orders |
| PATCH | `/api/v1/alterations/orders/{id}/status` | TAILOR or ADMIN |
| POST | `/api/v1/alterations/orders/{id}/photos` | TAILOR or ADMIN |
| POST | `/api/v1/alterations/orders/{id}/assign?tailorId=` | ADMIN |

---

## 7. Shared Packages

### @stitchit/types

Pure TypeScript type definitions. Exports: `User`, `UserRole`, `Address`, `AlterationCategory`, `AlterationService`, `AlterationOrder`, `AlterationOrderItem`, `AlterationStatus`, `SlotTime`, `ApiResponse<T>`, `PaginatedResponse<T>`.

### @stitchit/api-client

```
packages/api-client/src/
├── api-client.ts    # Fetch wrapper — base URL, credentials: 'include'
├── endpoints.ts     # ApiEndpoints — all typed API method mappings
├── schemas.ts       # Zod schemas: loginSchema, registerSchema, alterationOrderSchema
├── types.ts         # Re-exports
└── index.ts
```

**Endpoints:**

| Method | Backend route |
|--------|--------------|
| `login(email, password)` | `POST /auth/login` |
| `register(data)` | `POST /auth/register` |
| `logout()` | `POST /auth/logout` |
| `me()` | `GET /auth/me` |
| `getAddresses()` | `GET /addresses` — **AddressController not built yet (C1)** |
| `getAllUsers()` | `GET /admin/users` — **endpoint missing (C2)** |
| `getAlterationCategories()` | `GET /alterations/categories` |
| `getAlterationServices(id)` | `GET /alterations/categories/{id}/services` |
| `createAlterationOrder(data)` | `POST /alterations/orders` |
| `getMyAlterationOrders()` | `GET /alterations/orders` |
| `getTailorAlterationOrders()` | `GET /alterations/orders/tailor` |
| `getAllAlterationOrders()` | `GET /alterations/orders/admin` |
| `getAlterationOrder(id)` | `GET /alterations/orders/{id}` |
| `updateAlterationStatus(id, status)` | `PATCH /alterations/orders/{id}/status` |
| `uploadAlterationPhotos(id, type, urls)` | `POST /alterations/orders/{id}/photos` |
| `assignAlterationTailor(orderId, tailorId)` | `POST /alterations/orders/{id}/assign?tailorId=` |

### @stitchit/ui

```
packages/ui/src/components/
├── button.tsx     # variant: primary | secondary | ghost
├── input.tsx      # label, error, helper text
├── card.tsx
├── badge.tsx
├── modal.tsx
└── toast.tsx      # ToastProvider + useToast()
```

**Toast API:** `const { toast, success, error, warning, info } = useToast()`

---

## 8. Frontend Architecture (all three apps)

### State Management

- **Zustand** — auth store: `{ user: User | null, isLoading: boolean, setUser, setLoading, clearAuth }`
- **TanStack Query** — server state. `['auth', 'me']` is the source of truth; Zustand syncs via `useEffect` in `useCurrentUser()`

### Auth Hooks

- `useCurrentUser()` — queries `/me`, syncs to Zustand, clears on 401
- `useLogin()` — mutation, on success sets Zustand + populates cache
- `useLogout()` — mutation, clears Zustand + entire QueryClient cache, redirects `/login`
- `useRegister()` — mutation, same post-success flow as login

### Protected Routes

`<ProtectedRoute>` calls `useCurrentUser()`, shows spinner while loading, redirects to `/login` if no user. Tailor portal also enforces `role === 'TAILOR'`; admin dashboard enforces `role === 'ADMIN'`.

---

## 9. customer-web (port 3000)

| Route | Description |
|-------|-------------|
| `/` | Hero section + How It Works — static, links to `/alterations` |
| `/login` | Email/password + Google OAuth |
| `/register` | Name, email, password, phone |
| `/auth/callback` | OAuth2 redirect handler |
| `/alterations` | 7-step booking wizard (protected) |
| `/alterations/orders` | Customer's order list (protected) |
| `/alterations/orders/[id]` | Order detail + 8-step status timeline (protected) |

**Booking wizard steps:**
1. Category selection
2. Service multi-select
3. Schedule — date + time slot
4. Address selection — **broken until AddressController built (C1)**
5. Special instructions + summary
6. Confirmation with order ID

**Navbar** — links: Home, Alter My Cloth. Auth state: Sign In button or user dropdown (My Alterations, Sign Out).

---

## 10. tailor-portal (port 3001)

| Route | Description |
|-------|-------------|
| `/login` | Tailor sign-in — rejects CUSTOMER role |
| `/dashboard` | Overview stats |
| `/dashboard/alterations` | Job list — expand per order, advance status, add notes |

Auto-refreshes every 30 seconds. Status advance button disabled on DELIVERED.

---

## 11. admin-dashboard (port 3002)

| Route | Description |
|-------|-------------|
| `/login` | Admin sign-in — rejects non-ADMIN |
| `/dashboard` | Overview metrics |
| `/dashboard/alterations` | All orders, revenue breakdown, assign tailor (raw ID), override status |
| `/dashboard/users` | User table — **broken, `GET /admin/users` missing (C2)** |

---

## 12. Brand Colors

| Name | Hex |
|------|-----|
| Navy | `#0F1B2D` |
| Cream | `#F8F5F0` |
| Gold | `#C9A84C` |
| Body text | `#2D2D2D` |

---

## 13. Local Development

### Spring Profiles

- **`local`** — Supabase PostgreSQL, Flyway enabled, Redis on localhost, Kafka excluded
- **`dev`** — H2 in-memory, no external dependencies needed

### Environment Variables

All secrets are read from environment variables — **never hardcode them in
properties files or commit them to git**. Set them in the same PowerShell
window before starting the backend (`$env:` variables live only in that
window and die when it closes).

| Variable | Required | What it is | Where to get it |
|----------|----------|------------|-----------------|
| `DB_PASSWORD` | yes (local profile) | Supabase Postgres password | Supabase dashboard → Settings → Database |
| `GOOGLE_CLIENT_SECRET` | for Google login | OAuth2 client secret (`GOCSPX-...`) | Google Cloud console → APIs & Services → Credentials |
| `GOOGLE_CLIENT_ID` | no (default committed) | OAuth2 client id (public) | Same page as the secret |
| `PAYMENT_PROVIDER` | no (defaults to `mock`) | `mock` = fake payments that auto-succeed; `razorpay` = real gateway | — |
| `RAZORPAY_KEY_ID` | if provider=razorpay | `rzp_test_...` (test) or `rzp_live_...` | Razorpay dashboard → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | if provider=razorpay | Key secret shown once at generation | Same page — regenerate if lost |

Notes:
- The Google **client id** is public (it appears in every OAuth redirect URL) and is committed as a default in `application-local.properties`. The **secret** is not.
- Razorpay **test keys** never charge real money. Test card: `4111 1111 1111 1111`, any future expiry/CVV. Test UPI: `success@razorpay`.
- If a secret ever leaks (committed, pasted publicly), rotate it at the source — Google console / Razorpay dashboard / Supabase settings.

### Start Backend

```powershell
cd backend

# minimal — mock payments, no Google login
$env:DB_PASSWORD="<supabase-password>"
./mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"

# full — Google login + real Razorpay test-mode payments
$env:DB_PASSWORD="<supabase-password>"
$env:GOOGLE_CLIENT_SECRET="GOCSPX-..."
$env:PAYMENT_PROVIDER="razorpay"
$env:RAZORPAY_KEY_ID="rzp_test_..."
$env:RAZORPAY_KEY_SECRET="<razorpay-secret>"
./mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"

# dev profile (H2, no DB needed)
./mvnw.cmd spring-boot:run
```

The startup log confirms what's active: look for `PAYMENT_PROVIDER=RAZORPAY`
(or the `PAYMENT_PROVIDER=MOCK` warning) right before `Started StitchItApplication`.

### Start Frontends

```bash
npm install        # from repo root
npm run dev        # starts all three apps via Turborepo
```

Frontend env (`.env.local` in each app):
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Ports: customer-web `3000` · tailor-portal `3001` · admin-dashboard `3002` · backend `8080`

### Dev Accounts (seeded automatically on dev/local startup)

- Admin — `admin@stitchit.com` / `Admin@123`
- Tailor — `tailor@stitchit.com` / `Tailor@123`

---

## 14. Payments

Provider-agnostic gateway behind the `PaymentProvider` strategy interface
(`backend/src/main/java/com/stitchit/payment/`):

- **`MockPaymentProvider`** (default) — no external calls, every payment
  succeeds. Lets the full booking→paid flow run without any account.
- **`RazorpayPaymentProvider`** — real Orders API + HMAC-SHA256 signature
  verification. Selected with `PAYMENT_PROVIDER=razorpay` + key env vars.

Flow: wizard creates order (UNPAID) → `POST /api/v1/payments/checkout`
creates a `payments` row + gateway order → frontend opens Razorpay modal
(or mock pay button) → `POST /api/v1/payments/verify` checks the signature
and flips the order's `payment_status` to PAID. Verify is idempotent and
ownership-checked; checkout reuses an open payment row on retry.

**Known gap:** no webhook handler yet — if a user pays and closes the tab
before verify fires, the order stays UNPAID (money captured on gateway).
Razorpay `payment.captured` webhook is the planned fix before go-live.

---

## 15. Known Issues

Full details and assignments in `STITCHPLAN.md`. All Week-1 backend issues
(C1–C4, C6, C7, S1–S5, Q2, Q3, Q10, M1, M3) are fixed as of July 2026.

**Still open:**
- **C5** — Date timezone bug on order detail page (frontend)
- **Q1/Q4–Q9** — frontend code-quality items (shared status map, pagination, skeletons, error boundaries)
- Payments webhook (see section 14)
