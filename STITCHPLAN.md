# StitchIt — Production Plan

Two developers: **Backend Dev** (Spring Boot, infra, APIs) and **Frontend Dev** (Next.js, UI, testing).

---

## Audit Issues

### Critical Bugs

| ID | Issue | Assigned | File | Status |
|----|-------|----------|------|--------|
| C1 | Booking wizard Step 4 always shows "No saved addresses" — AddressController missing | Backend Dev | `AlterationController.java` | **Fixed** |
| C2 | Admin users page 404s — `GET /admin/users` endpoint missing | Backend Dev | `AdminController` | **Fixed** |
| C3 | Admin users page crashes — `UserResponse` has no `createdAt` field but UI renders it | Backend Dev | `UserResponse.java` | **Fixed** |
| C4 | `cookie.setSecure(false)` hardcoded — breaks HTTPS auth in production | Backend Dev | `CookieUtils.java` | **Fixed** |
| C5 | Order date display has timezone bug — `new Date(order.scheduledDate).toLocaleDateString()` interprets UTC as local | Frontend Dev | `alterations/orders/[id]/page.tsx` | Open |
| C6 | Admin cannot freely override order status — hits same sequential `validateStatusTransition()` as tailor | Backend Dev | `AlterationOrderService.java` | **Fixed** |
| C7 | `RateLimitFilter` rate-limited `/auth/me` and `/auth/refresh` — blocked normal page loads | Backend Dev | `RateLimitFilter.java` | **Fixed** |

### Security Issues

| ID | Issue | Assigned | File | Status |
|----|-------|----------|------|--------|
| S1 | `/actuator/**` fully public — exposes heap dumps, env vars, beans | Backend Dev | `SecurityConfig.java` | **Fixed** |
| S2 | No input sanitization on `specialInstructions` field | Backend Dev | `AlterationOrderService.java` | **Fixed** |
| S3 | `CORS_ORIGINS` uses `System.getenv()` instead of `@Value` — silent null on misconfiguration | Backend Dev | `SecurityConfig.java` | **Fixed** |
| S4 | `X-Forwarded-For` blindly trusted in rate limiter — IP spoofable | Backend Dev | `RateLimitFilter.java` | **Fixed** |
| S5 | No CSRF protection on cookie-based auth endpoints | Backend Dev | `OriginValidationFilter.java` | **Fixed** |

### Missing Features

| ID | Feature | Assigned | Status |
|----|---------|----------|--------|
| M1 | AddressController + AddressService — full CRUD for saved addresses | Backend Dev | **Done** |
| M2 | Photo upload — before/after garment photos (S3 or local storage) | Backend Dev | Open |
| M3 | Payment integration (Razorpay or Stripe) | Backend Dev | Open |
| M4 | Push/email notifications — booking confirmed, tailor assigned, delivered | Backend Dev | Open |
| M5 | Tailor assignment UI in admin — currently raw ID input | Frontend Dev | Open |
| M6 | Pagination in all listing pages — hardcoded size | Frontend Dev | Open |
| M7 | Customer profile page — edit name, phone, manage addresses | Frontend Dev | Open |
| M8 | Tailor earnings/payout dashboard | Frontend Dev | Open |
| M9 | Admin analytics — revenue charts, order trends | Frontend Dev | Open |
| M10 | Search and filter on admin alterations list | Frontend Dev | Open |

### Code Quality

| ID | Issue | Assigned | File | Status |
|----|-------|----------|------|--------|
| Q1 | Status colors/labels duplicated across 3 pages — extract to shared constant | Frontend Dev | Multiple | Open |
| Q2 | `getServicesByCategory()` makes 2 DB calls — combine into one | Backend Dev | `AlterationOrderService.java` | **Fixed** |
| Q3 | `validateStatusTransition()` allows `BOOKED → BOOKED` no-op | Backend Dev | `AlterationOrderService.java` | **Fixed** |
| Q4 | All listing pages use hardcoded `size` — no pagination support | Frontend Dev | Multiple | Open |
| Q5 | Admin revenue calculated client-side from all loaded orders — move to backend | Backend Dev | `admin/alterations/page.tsx` | **Backend done** — `GET /admin/alterations/revenue-summary`; frontend must switch to it |
| Q6 | `refetchInterval: 30s` on tailor portal — should be configurable or use WebSocket | Backend Dev | `tailor/alterations/page.tsx` | Open |
| Q7 | No loading skeletons on order detail page | Frontend Dev | `orders/[id]/page.tsx` | Open |
| Q8 | Error boundaries missing on all pages | Frontend Dev | All pages | Open |
| Q9 | No optimistic updates on status change | Frontend Dev | Tailor portal | Open |
| Q10 | `@stitchit/api-client` has no request timeout configured | Backend Dev | `endpoints.ts` | Open |

---

## AI Integration (Claude API)

| ID | Feature | Where | Assigned |
|----|---------|-------|----------|
| AI1 | Garment description assistant — customer describes garment in plain text, AI suggests matching services | Booking wizard Step 2 | Frontend Dev |
| AI2 | Photo analysis — upload before photo, AI identifies garment type and flags visible issues | Photo upload step | Backend Dev |
| AI3 | Smart tailor assignment — AI scores tailors by skill match, proximity, and current load | Admin assign flow | Backend Dev |
| AI4 | Alteration price estimator — AI estimates cost range before booking is confirmed | Booking summary step | Backend Dev |
| AI5 | Customer support chatbot — answers "where is my order", "how long will it take" | Customer app | Frontend Dev |
| AI6 | Personalised email generation — booking confirmation and delivery emails written by AI | Notification service | Backend Dev |
| AI7 | Quality check assistant — tailor uploads after photo, AI compares before/after and flags issues | Tailor portal | Backend Dev |

---

## Sprint Plan

### Week 1 — Core Fixes + Address API

**Backend Dev**
- [x] Fix C4: `cookie.setSecure()` now driven by `app.cookie.secure` env property via `CookieUtils`
- [x] Fix C7: `RateLimitFilter.shouldNotFilter()` now only applies to `/auth/login` and `/auth/register`
- [x] Fix S4: `X-Forwarded-For` only trusted from IPs listed in `app.rate-limit.trusted-proxies`
- [x] Fix Q3: patch `validateStatusTransition()` — remove `BOOKED → BOOKED` no-op case
- [x] Fix C6: add admin role bypass in status update — skip sequential validation for `ADMIN`
- [x] Fix S1: lock down `/actuator/**` to `ADMIN` role or localhost only
- [x] Fix S3: replace `System.getenv()` with `@Value` for CORS origins
- [ ] Build M1: `AddressController` + `AddressService` — `GET /addresses`, `POST /addresses`, `PUT /addresses/{id}`, `DELETE /addresses/{id}`, `PUT /addresses/{id}/default`
- [ ] Fix C3: add `createdAt` to `UserResponse` and expose from `AuthService.toUserResponse()`
- [ ] Build C2: `GET /admin/users` endpoint

**Frontend Dev**
- [ ] Fix C5: use `new Date(date + 'T00:00:00')` or UTC-aware formatting on all date displays
- [ ] Fix Q1: extract status color/label map to `packages/types/src/alteration-status.ts`, import everywhere
- [ ] Add error boundaries on all three apps' root layouts (Q8)
- [ ] Add loading skeletons to order detail page (Q7)

---

### Week 2 — Payments + Notifications

**Backend Dev**
- [ ] Fix S5: enable CSRF protection for cookie-authenticated endpoints
- [ ] Fix S2: sanitize `specialInstructions` — strip HTML, limit length
- [ ] Build M3: payment integration — create order → payment intent → webhook to confirm booking
- [ ] Fix Q2: merge `getServicesByCategory()` into single JOIN query
- [ ] Fix Q5: add `GET /admin/alterations/revenue-summary` endpoint, remove client-side revenue calculation
- [ ] Build M4: notification service — booking confirmed, tailor assigned, out for delivery, delivered emails

**Frontend Dev**
- [ ] Build M5: tailor assignment UI in admin — searchable tailor dropdown instead of raw ID input
- [ ] Build M6: pagination component in `@stitchit/ui`, wire into all listing pages
- [ ] Build M7: customer profile page at `/profile` — edit name, phone, address management
- [ ] Fix Q9: optimistic UI update on tailor portal status advance

---

### Week 3 — AI Features + Photo Upload

**Backend Dev**
- [ ] Build M2: photo upload endpoint (`POST /alterations/{id}/photos`) — S3 or local storage with pre-signed URLs
- [ ] Build AI2: photo analysis on upload — call Claude Vision API, return garment type + issue flags
- [ ] Build AI3: smart tailor assignment scoring endpoint — skill match + load + proximity
- [ ] Build AI4: price estimator endpoint — takes selected services, returns estimated range
- [ ] Build AI6: AI-generated booking confirmation and delivery emails in notification service
- [ ] Fix Q6: switch tailor portal from polling to SSE (`GET /alterations/stream`) or increase interval

**Frontend Dev**
- [ ] Build AI1: garment description assistant in booking wizard Step 2 — textarea with AI suggestion chip
- [ ] Build AI5: customer support chatbot widget — floating button, Claude API streaming
- [ ] Build M8: tailor earnings dashboard — weekly/monthly breakdown
- [ ] Build M9: admin analytics page — revenue chart, order volume by status, busiest days

---

### Week 4 — Testing + Production Hardening

**Backend Dev**
- [ ] Write integration tests for `AuthController`, `AlterationController`, `AddressController`
- [ ] Add `@Valid` input validation to all request DTOs (name length, phone format, date range)
- [ ] Set up rate limiting on payment endpoints separately from auth
- [ ] Configure production `application-prod.properties` — real secrets via env, Kafka enabled
- [ ] Add Flyway V9 migration: indexes on `alteration_orders(user_id)`, `alteration_orders(tailor_id)`, `alteration_orders(status)`
- [ ] Set up health check — expose `/actuator/health` (public, read-only) and lock down the rest
- [ ] Fix Q10: add `connectTimeout` and `readTimeout` to `ApiEndpoints` HTTP client

**Frontend Dev**
- [ ] Write Playwright e2e tests: register → book alteration → view order (happy path)
- [ ] Add `<Suspense>` boundaries around all `useSearchParams()` calls
- [ ] Audit all `any` types in the three apps — replace with proper types from `@stitchit/types`
- [ ] Build M10: search + filter on admin alterations — by status, tailor, date range
- [ ] Build AI7: before/after photo comparison view with AI quality check result in tailor portal
- [ ] Performance audit — check bundle sizes, add `next/image` where missing, lazy-load heavy components
- [ ] Run Lighthouse on all three apps, fix score blockers

---

## Definition of Done

- No TypeScript errors (`npm run typecheck`)
- No console errors in browser
- All API calls handle loading, error, and empty states
- All new backend endpoints have at least one integration test
- Cookies are secure + httpOnly in production
- No hardcoded secrets — all via environment variables
