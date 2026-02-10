# 📅 Nolan Cloud Platform (NCP) 4-Week Development Roadmap

This roadmap defines the daily tasks for the autonomous agent to execute.
Each day at 11:00 AM, the agent will check this file, pick the task for the current day (relative to start date 2026-02-06), implement it, and push to GitHub.

## ✅ Week 1: Core Infrastructure & Compute Engine (Docker)
*Goal: Establish the API server and complete Docker container management.*

- [x] **Day 1 (2/6)**: Project Setup, Express Server Skeleton, GitHub Repo Init.
- [x] **Day 2 (2/7)**: Controller-Service Architecture, Container List/Stats APIs.
- [x] **Day 3 (2/8)**: Container Lifecycle APIs (Start/Stop/Restart).
- [x] **Day 4 (2/9)**: Image Management API
    - List local images (`docker images`)
    - Pull image from registry (`docker pull`)
    - Delete image (`docker rmi`)
- [x] **Day 5 (2/10)**: Volume Management API
    - Create/List/Remove Docker volumes (preparation for Storage service).
- [ ] **Day 6 (2/11)**: Network Management API
    - Create/List/Remove Docker networks.
    - Port mapping logic refinement.
- [ ] **Day 7 (2/12)**: API Documentation & Refactoring
    - Setup Swagger/OpenAPI (`swagger-ui-express`).
    - Document existing APIs.
    - Code cleanup.

## 🚧 Week 2: Persistence & Identity (Database)
*Goal: Introduce PostgreSQL to manage users and persistent resource state.*

- [ ] **Day 8 (2/13)**: Database Setup
    - Add `postgres` service to `docker-compose.yml`.
    - Initialize Prisma ORM.
- [ ] **Day 9 (2/14)**: User Authentication (Part 1)
    - Define `User` schema.
    - Implement Signup/Login API (JWT based).
- [ ] **Day 10 (2/15)**: User Authentication (Part 2)
    - Auth Middleware (JWT Verify).
    - Protect existing Container APIs (require login).
- [ ] **Day 11 (2/16)**: Resource Ownership
    - Define `Instance` schema (sync with Docker containers).
    - Link containers to specific users (Ownership).
- [ ] **Day 12 (2/17)**: API Key System
    - Implement API Key generation for CLI usage.
    - Middleware to support both Bearer Token and x-api-key.
- [ ] **Day 13 (2/18)**: Request Validation & Error Handling
    - Add `joi` or `zod` for input validation.
    - Global Error Handler middleware.
- [ ] **Day 14 (2/19)**: Unit Testing
    - Setup Jest.
    - Write tests for AuthService and ContainerService.

## 📦 Week 3: Storage Service (N-S3)
*Goal: Build a simplified object storage service compatible with basic S3 operations.*

- [ ] **Day 15 (2/20)**: Storage Service Foundation
    - Define `Bucket` and `Object` schemas in DB.
    - Create file system structure for storage (`./storage_data`).
- [ ] **Day 16 (2/21)**: Bucket Operations
    - Create/List/Delete Buckets API.
    - Enforce bucket naming uniqueness.
- [ ] **Day 17 (2/22)**: File Upload (PutObject)
    - Implement `multer` for file uploads.
    - Save files to disk and metadata to DB.
- [ ] **Day 18 (2/23)**: File Download (GetObject)
    - Stream files back to client.
    - Handle MIME types.
- [ ] **Day 19 (2/24)**: File Permissions (ACL)
    - Public/Private read access control.
    - Presigned URL generation (simulation).
- [ ] **Day 20 (2/25)**: Resource Monitoring
    - Background job (cron) to sync actual Docker state with DB.
    - Calculate disk usage per user.
- [ ] **Day 21 (2/26)**: Webhook System
    - Notify external URL when container state changes.

## 💻 Week 4: CLI & Dashboard (Client)
*Goal: Provide user interfaces to interact with the platform.*

- [ ] **Day 22 (2/27)**: CLI Tool Init
    - Create `ncp-cli` project (Node.js).
    - Implement `ncp config` (save API URL and Key).
- [ ] **Day 23 (2/28)**: CLI Compute Commands
    - `ncp run <image>`, `ncp ps`, `ncp stop <id>`.
- [ ] **Day 24 (3/1)**: CLI Storage Commands
    - `ncp s3 mb` (make bucket), `ncp s3 cp` (upload).
- [ ] **Day 25 (3/2)**: Simple Dashboard (Part 1)
    - Setup simple HTML/JS frontend (or React).
    - Login page & Dashboard overview.
- [ ] **Day 26 (3/3)**: Simple Dashboard (Part 2)
    - Instance list & control UI.
    - File browser UI.
- [ ] **Day 27 (3/4)**: Final Polish
    - Update `README.md` with full usage guide.
    - Create setup script (`install.sh`).
- [ ] **Day 28 (3/5)**: Release v1.0
    - Tag release on GitHub.
    - Final demo scenario run.

---
*Last Updated: 2026-02-09*
