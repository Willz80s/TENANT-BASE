# Tenant Base

Tenant Base is a **multi-tenant SaaS admin platform** built with a **production-first mindset**.  
It demonstrates full-stack engineering, containerized development, and real-world database design.

The project is designed to scale from a single organization to many tenants while maintaining:

- Strict data isolation
- Role-based access control (RBAC)
- Operational reliability

---

## Tech Stack

### Core
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**

### Backend / Data
- **PostgreSQL 16**
- **Prisma ORM (v7)**
- **Single database, shared schema multi-tenancy**
- **Dockerized Postgres**

### Infrastructure
- **Docker**
- **Docker Compose**
- **Environment-based configuration**
- **Zero local database setup required**

---
---

## Multi-Tenancy Strategy

Tenant Base uses a **single-database, shared-schema** approach.

### Why This Approach?
- Cost-efficient
- Simple to operate
- Industry standard for early-to-mid stage SaaS
- Easy to migrate to sharding or isolated databases later

### Tenant Isolation
- Every tenant has a unique `tenantId`
- All tenant-scoped data references `tenantId`
- Cross-tenant access is prevented at the **data model level**

---

## Database Schema (v1)

### Core Models
- **Tenant**  
  Represents an organization
- **User**  
  Global identity (email-based)
- **Membership**  
  Joins users to tenants with roles
- **AuditLog**  
  Records user actions per tenant

### Roles
- `OWNER`
- `EDITOR`
- `VIEWER`

Uniqueness and data integrity are enforced directly at the **database level**.

---

## Local Development Setup

### Prerequisites
- Docker
- Docker Compose

> No local Node.js or PostgreSQL installation required.


###  Start the Project
docker compose up --build

### The application will be available at:
http://localhost:3000


### Run Database Migrations
docker compose exec app npx prisma migrate dev --name init


### Verify Database (Terminal)
docker compose exec db psql -U tenantbase -d tenantbase


### List all tables within the public shema
\dt public.*
