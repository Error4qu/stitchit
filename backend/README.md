# StitchIt Backend

Spring Boot backend for the StitchIt premium cloth tailoring platform.

## Tech Stack

- Java 21
- Spring Boot 3.2
- Spring Security (JWT + OAuth2)
- Spring Data JPA (Hibernate)
- PostgreSQL
- Redis (caching + sessions)
- Kafka (async events)
- SendGrid (email)
- Twilio (SMS)

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/stitchit/
│   │   │   ├── config/          # Security, Redis, Kafka configs
│   │   │   ├── controller/      # REST API controllers
│   │   │   ├── service/         # Business logic
│   │   │   ├── repository/      # JPA repositories
│   │   │   ├── model/           # Entity models
│   │   │   ├── dto/             # Data transfer objects
│   │   │   ├── security/        # JWT, OAuth2, filters
│   │   │   ├── exception/       # Global exception handling
│   │   │   └── util/            # Utility classes
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       └── application-prod.properties
│   └── test/
└── pom.xml
```

## Running the Application

### Prerequisites

- Java 21
- Maven 3.9+
- PostgreSQL 15+
- Redis 7+

### Development

```bash
# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Run with Maven
./mvnw spring-boot:run

# Or run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Production

```bash
# Build JAR
./mvnw clean package

# Run JAR
java -jar target/stitchit-backend-1.0.0.jar --spring.profiles.active=prod
```

## API Documentation

API endpoints follow RESTful conventions and are versioned at `/api/v1/`.

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/google` - Google OAuth
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Key Endpoints

- `/api/v1/users/*` - User management
- `/api/v1/catalog/*` - Fabric and style catalog
- `/api/v1/orders/*` - Order management
- `/api/v1/visits/*` - Tailor visit scheduling
- `/api/v1/measurements/*` - Measurement submission
- `/api/v1/admin/*` - Admin operations

## Database Schema

Key entities:
- User, Role, Address
- Fabric, Style, CustomizationOption
- CartItem, Order, OrderItem
- TailorVisit, Measurement
- Shipment, Review, Notification
