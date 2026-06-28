# StitchIt - Project Context for AI Agents

## Project Overview

StitchIt is a premium online cloth tailoring platform that connects customers with professional tailors. Customers browse fabric collections and clothing styles, place orders, and have tailors visit their location for measurements. Tailors submit measurements via a dedicated portal, stitch the garments, and the finished products are shipped back to customers.

## Architecture

### Monorepo Structure (Turborepo)

```
stitchit/
├── apps/
│   ├── customer-web/          # Next.js 15 - Customer-facing portal
│   ├── tailor-portal/         # Next.js 15 - Tailor management portal
│   └── admin-dashboard/       # Next.js 15 - Admin operations dashboard
├── packages/
│   ├── ui/                    # Shared React components (shadcn/ui style)
│   ├── types/                 # Shared TypeScript type definitions
│   └── api-client/            # Shared API client library
├── backend/                   # Spring Boot 3.x backend
├── package.json               # Root package.json (Turborepo)
├── turbo.json                 # Turborepo pipeline configuration
└── .gitignore
```

## Technology Stack

### Frontend (All Apps)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Server State**: React Query (@tanstack/react-query)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Custom components in `@stitchit/ui` (shadcn/ui pattern)

### Backend
- **Framework**: Spring Boot 3.2
- **Language**: Java 21
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA (Hibernate)
- **Cache**: Redis
- **Message Queue**: Apache Kafka
- **Security**: Spring Security + JWT + OAuth2 (Google)
- **Email**: SendGrid
- **SMS**: Twilio
- **Payment**: Razorpay/Stripe

### Shared Packages
- **@stitchit/ui**: Reusable React components (Button, Input, Card, Badge, etc.)
- **@stitchit/types**: TypeScript interfaces for all domain entities
- **@stitchit/api-client**: Typed API client with endpoint methods

## Actors & Portals

### 1. Customer Portal (customer-web)
**Port**: 3000
**Purpose**: Browse catalog, manage cart, checkout, track orders, profile management

**Key Features**:
- Fabric and style browsing with filters
- Shopping cart management
- Checkout with payment integration
- Order tracking with real-time status timeline
- Profile and address management
- Size history
- Reviews and ratings

**Key Pages**:
- `/` - Home page
- `/catalog` - Fabric and style catalog
- `/cart` - Shopping cart
- `/checkout` - Checkout flow
- `/orders` - Order history
- `/orders/[id]` - Order details
- `/profile` - User profile
- `/profile/addresses` - Address management

### 2. Tailor Portal (tailor-portal)
**Port**: 3001
**Purpose**: View assigned orders, schedule visits, submit measurements, update order status

**Key Features**:
- Dashboard with assigned orders
- Map view of customer addresses
- Visit scheduling with calendar picker
- Dynamic measurement forms per garment type
- Photo upload for measurements
- Order status updates
- Earnings tracking

**Key Pages**:
- `/` - Dashboard
- `/orders` - Assigned orders
- `/orders/[id]` - Order details with measurement form
- `/visits` - Scheduled visits
- `/earnings` - Earnings dashboard

### 3. Admin Dashboard (admin-dashboard)
**Port**: 3002
**Purpose**: Order management, tailor assignment, inventory, analytics, dispute resolution

**Key Features**:
- Order management with status transitions
- Tailor onboarding and management
- Proximity-based tailor assignment algorithm
- Inventory management
- Analytics dashboard (charts, metrics)
- Dispute resolution
- User management

**Key Pages**:
- `/` - Overview dashboard
- `/orders` - All orders
- `/tailors` - Tailor management
- `/inventory` - Inventory management
- `/analytics` - Analytics and reports
- `/users` - User management
- `/disputes` - Dispute resolution

## Core Business Flows

### Order Lifecycle
1. **Customer places order** → Status: PLACED
2. **Admin assigns tailor** → Status: TAILOR_ASSIGNED
3. **Tailor schedules visit** → Status: VISIT_SCHEDULED
4. **Tailor takes measurements** → Status: MEASUREMENTS_TAKEN
5. **Tailor stitches garment** → Status: STITCHING
6. **Quality check** → Status: QC_PENDING
7. **Shipping initiated** → Status: SHIPPED
8. **Delivery confirmed** → Status: DELIVERED
9. **Return (optional)** → Status: RETURNED

### Order State Machine
```
PLACED → TAILOR_ASSIGNED → VISIT_SCHEDULED → MEASUREMENTS_TAKEN → STITCHING → QC_PENDING → SHIPPED → DELIVERED → (optionally) RETURNED
```

## Database Schema

### Core Entities

#### User & Auth
- **User**: id, email, name, phone, role, createdAt, updatedAt
- **Role**: CUSTOMER, TAILOR, ADMIN
- **Address**: id, userId, street, city, state, postalCode, country, latitude, longitude, isDefault

#### Catalog
- **Fabric**: id, name, type, description, pricePerMeter, imageUrl, inStock
- **Style**: id, name, category (shirt, sherwani, pants, jacket, dress), description, basePrice, imageUrl
- **CustomizationOption**: id, name, type (collar, sleeve, fit, length, button)
- **CustomizationChoice**: id, name, priceAdjustment

#### Orders
- **Order**: id, customerId, tailorId, status, totalAmount, shippingAddress, createdAt, updatedAt, estimatedDelivery
- **OrderItem**: id, orderId, styleId, fabricId, quantity, price, customizations (JSON)
- **CartItem**: id, userId, styleId, fabricId, quantity, customizations

#### Tailor Operations
- **TailorVisit**: id, orderId, tailorId, scheduledDate, actualVisitDate, status, notes
- **Measurement**: id, orderId, garmentType, measurements (JSON), photos (array), submittedAt, submittedBy

#### Shipping & Reviews
- **Shipment**: id, orderId, trackingNumber, carrier, status, shippedAt, deliveredAt
- **Review**: id, orderId, customerId, tailorRating, garmentRating, comment, createdAt

#### Notifications
- **Notification**: id, userId, type, title, message, read, createdAt

## API Design

### RESTful Conventions
- Base URL: `/api/v1/`
- Versioned endpoints
- JSON request/response
- JWT authentication via Authorization header
- Role-based access control

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/register` - New user registration
- `POST /api/v1/auth/google` - Google OAuth
- `POST /api/v1/auth/refresh` - Refresh JWT token

#### Catalog
- `GET /api/v1/fabrics` - List fabrics (paginated)
- `GET /api/v1/fabrics/:id` - Get fabric details
- `GET /api/v1/styles` - List styles (paginated, filterable)
- `GET /api/v1/styles/:id` - Get style details

#### Cart
- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart` - Add item to cart
- `PATCH /api/v1/cart/:id` - Update cart item
- `DELETE /api/v1/cart/:id` - Remove item
- `DELETE /api/v1/cart` - Clear cart

#### Orders
- `GET /api/v1/orders` - List orders (paginated, filterable by status)
- `GET /api/v1/orders/:id` - Get order details
- `POST /api/v1/orders` - Create order from cart

#### Tailor Operations
- `POST /api/v1/visits` - Schedule tailor visit
- `GET /api/v1/visits` - List visits
- `PATCH /api/v1/visits/:id` - Update visit
- `POST /api/v1/measurements` - Submit measurements
- `GET /api/v1/orders/:id/measurements` - Get order measurements

#### Admin
- `GET /api/v1/admin/users` - List all users
- `POST /api/v1/admin/orders/:id/assign` - Assign tailor to order
- `PATCH /api/v1/admin/orders/:id/status` - Update order status
- `GET /api/v1/admin/analytics` - Get analytics data

## Code Standards

### Frontend
- **No class-based React components** - Use functional components with hooks
- **Error handling in all API calls** - Use try-catch with proper error UI
- **JWT in httpOnly cookies** - Never store in localStorage
- **Separate portals** - Keep customer, tailor, and admin as separate apps/route groups
- **TypeScript strict mode** - All code must be type-safe
- **Component organization** - Group by feature, not by type

### Backend
- **Java 21 features** - Use modern Java syntax
- **Spring Boot 3.x** - Latest Spring Boot conventions
- **OpenAPI 3.0 spec first** - Document all endpoints
- **Environment-based config** - No hardcoded secrets
- **Service layer pattern** - Business logic in service classes
- **DTO pattern** - Separate DTOs from entities
- **Global exception handling** - Centralized error responses

### Testing
- **Backend**: JUnit 5 + Mockito
- **Frontend**: Vitest + Testing Library
- **E2E**: Playwright (to be added)

## Development Workflow

### Running the Project

```bash
# Install dependencies
npm install

# Run all apps in development
npm run dev

# Run specific app
cd apps/customer-web && npm run dev
cd apps/tailor-portal && npm run dev
cd apps/admin-dashboard && npm run dev

# Run backend
cd backend && ./mvnw spring-boot:run

# Build all
npm run build

# Run tests
npm run test

# Lint
npm run lint
```

### Environment Setup

Each app has its own `.env.example` file. Copy to `.env` and configure:

**Frontend Apps**:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay key ID

**Backend**:
- Database connection (PostgreSQL)
- Redis connection
- JWT secret
- Google OAuth credentials
- SendGrid API key
- Twilio credentials
- Razorpay credentials

## Key Business Rules

### Tailor Assignment
- Assign tailor based on proximity to customer address
- Consider tailor's current workload and availability
- Prioritize tailors with higher ratings

### Measurement Forms
- Dynamic form fields based on garment type:
  - **Shirt**: chest, shoulder, sleeve length, neck, waist
  - **Sherwani**: chest, shoulder, sleeve length, length, waist, hips
  - **Pants**: waist, hips, inseam, thigh, knee

### Order Status Transitions
- Only admins can assign tailors
- Only assigned tailors can schedule visits
- Only after visit completion can measurements be submitted
- QC check required before shipping
- Customer can request returns within 7 days of delivery

### Notifications
- Email notifications for all order status changes
- SMS notifications for visit scheduling
- In-app notifications for real-time updates

## Important Notes for AI Agents

1. **Always follow the code standards** - No class components, proper error handling, httpOnly cookies for JWT
2. **Use shared packages** - Don't duplicate types or components
3. **Keep portals separate** - Customer, tailor, and admin should remain distinct
4. **Ask for clarification** - If business rules are ambiguous, ask before implementing
5. **Test thoroughly** - Write unit tests for critical business logic
6. **Document changes** - Update relevant documentation when adding features
7. **Security first** - Never expose sensitive data, always validate inputs
8. **Performance matters** - Use caching (Redis) for frequently accessed data
9. **Scalability** - Design for horizontal scaling (stateless services)
10. **User experience** - Focus on smooth, intuitive interfaces

## Current Status

This is the initial monorepo setup. The following has been created:
- Turborepo configuration
- Three Next.js 15 app skeletons (customer-web, tailor-portal, admin-dashboard)
- Shared packages (ui, types, api-client)
- Spring Boot backend skeleton with configuration
- Basic project structure and documentation

## Next Steps

1. Set up database schema in PostgreSQL
2. Implement authentication (JWT + OAuth2)
3. Build catalog API and frontend
4. Implement cart and checkout flow
5. Create order management system
6. Build tailor portal features
7. Implement measurement submission
8. Add notification system
9. Create admin dashboard
10. Add payment integration
11. Implement shipping tracking
12. Add review system
