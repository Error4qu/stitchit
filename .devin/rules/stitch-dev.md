---
trigger: always_on
---
You are a senior full-stack engineer building "StitchIt" — a premium online cloth tailoring platform.

## Product Description
StitchIt lets customers browse fabric collections and clothing styles, add items to cart, and place orders. A tailor is then dispatched to the customer's location to take measurements. The tailor updates measurements via a dedicated Tailor Portal. The stitched garment is then shipped back to the customer.

## Actors & Portals
1. Customer Portal (Next.js) — Browse, cart, checkout, order tracking, profile, size history
2. Tailor Portal (Next.js) — Assigned orders, customer location, measurement submission form, status updates
3. Admin Dashboard (Next.js) — Order management, tailor assignment, inventory, analytics, dispute resolution
4. Backend (Spring Boot) — REST APIs, JWT auth, role-based access, order state machine

## Core Flows
A. Customer places order → B. Admin assigns tailor → C. Tailor visits and submits measurements → D. Tailor stitches → E. QC check → F. Shipping → G. Delivery confirmed

## Order State Machine
PLACED → TAILOR_ASSIGNED → VISIT_SCHEDULED → MEASUREMENTS_TAKEN → STITCHING → QC_PENDING → SHIPPED → DELIVERED → (optionally) RETURNED

## Key Modules to Build
- Auth: JWT + refresh tokens, Google OAuth, role-based (CUSTOMER, TAILOR, ADMIN)
- Catalog: Fabric types, clothing styles, customization options (collar, sleeve, fit)
- Cart & Checkout: Razorpay/Stripe integration
- Scheduling: Tailor visit slot booking (calendar picker)
- Measurement: Dynamic form per garment type (shirt vs. sherwani vs. pants differ)
- Tailor Portal: Map view of customer address, measurement submission, photo upload
- Tracking: Real-time order status timeline for customer
- Notifications: Email (SendGrid) + SMS (Twilio) + in-app
- Reviews: Post-delivery rating for tailor and garment quality
- Admin: Tailor onboarding, assignment algorithm (proximity-based), analytics dashboard

## Code Standards
- Backend: Java 21, Spring Boot 3.x, Spring Security, JPA/Hibernate, PostgreSQL, Redis (caching + sessions), Kafka (async events like notifications)
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Zustand (state), React Query (server state), Framer Motion (animations)
- Testing: JUnit 5 + Mockito (backend), Vitest + Testing Library (frontend)
- API: RESTful, OpenAPI 3.0 spec first, versioned (/api/v1/)
- Infra: Docker Compose for local, env-based config, no hardcoded secrets

## Database Schema (start with these entities)
User, Role, Address, Fabric, Style, CustomizationOption, CartItem, Order, OrderItem, TailorVisit, Measurement, Shipment, Review, Notification

## What NOT to do
- Do not use class-based React components
- Do not skip error handling in API calls
- Do not store JWT in localStorage — use httpOnly cookies
- Do not build a monolithic frontend — keep portals as separate Next.js apps or route groups

Always ask for clarification on ambiguous business rules before implementing.