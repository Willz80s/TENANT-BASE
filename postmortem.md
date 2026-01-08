# Postmortem: Prisma & Docker Setup Issues

## Incident Summary
During the initial infrastructure setup, Prisma migrations were not being applied to the PostgreSQL database—even though all Docker containers appeared to be running successfully. At first glance, everything looked “up,” but the database told a very different story.

---

## Impact
This issue caused several blockers during verification:

- No database tables were created in PostgreSQL  
- Prisma Studio was unreachable from the host  
- Prisma CLI errors created false signals during debugging  

Together, these made it difficult to confidently confirm whether the data layer was working as expected.

---

## Root Causes

### 1. Prisma v7 Breaking Change
Prisma v7 introduced a breaking change that invalidated assumptions from older documentation and tutorials:

- `datasource.url` is no longer allowed in `schema.prisma`
- Database connection configuration must now live in `prisma.config.ts`

This caused silent misconfiguration during startup.

---

### 2. Missing `prisma` Package
While the Prisma CLI was accessible via `npx`, the actual `prisma` npm package was not installed:

- CLI commands appeared to work
- `prisma/config` imports failed at runtime
- This led to misleading error output during validation

---

### 3. Docker Networking Assumptions
Docker networking behavior introduced additional confusion:

- Prisma Studio was bound to container `localhost`
- Required ports were not exposed to the host machine
- This resulted in repeated “unable to connect” errors despite healthy containers

---

### 4. Migrations Were Never Explicitly Applied
Although PostgreSQL itself was healthy:

- Prisma migrations never reached the database
- The `_prisma_migrations` table did not exist
- Successful container startup logs masked the underlying issue

---

## Resolution
The issue was resolved through a combination of configuration fixes and direct verification:

- Explicitly installed Prisma v7:
  ```bash
  npm install -D prisma@latest

Moved all database connection logic to prisma.config.ts

Re-ran migrations from within the application container

Verified the schema directly using psql instead of relying on UI tools



## Lessons Learned
This incident reinforced several important engineering principles:

Tooling versions matter more than tutorials

Docker changes what “localhost” really means

Always verify databases at the SQL level

Successful startup logs do not guarantee successful migrations

Terminal-based verification is often more reliable than UI tools

##  Preventive Measures

To avoid similar issues in the future:

Terminal-based verification steps are documented

Docker-first networking assumptions are written down


## Final Outcome
•	Database schema successfully deployed
•	Multi-tenant constraints verified
•	Infrastructure stabilized
•	Project ready for authentication layer
