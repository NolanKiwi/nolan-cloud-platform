# ☁️ Nolan Cloud Platform (NCP)

A lightweight, AWS-like cloud platform simulation built with Node.js, Express, Docker, and SQLite.

## 🚀 Features
- **Compute (N-EC2)**: Manage Docker containers as virtual instances.
- **Storage (N-S3)**: Object storage with buckets, ACLs, and presigned URLs.
- **Network**: Manage Docker networks.
- **Identity (N-IAM)**: User authentication (JWT) and API Keys.
- **Monitoring**: Background jobs for resource tracking.

## 🛠️ Prerequisites
- **Node.js** (v18+)
- **Docker** (Desktop or Engine) running locally
- **Git**

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/NolanKiwi/nolan-cloud-platform.git
    cd nolan-cloud-platform
    ```

2.  **Install Dependencies**
    ```bash
    cd server
    npm install
    ```

3.  **Database Setup (SQLite)**
    The project uses SQLite for simplicity. Run migrations to initialize the DB:
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Start the Server**
    ```bash
    npm run dev
    ```
    The server will start at `http://localhost:3000`.

## 📖 Usage (API Documentation)

Once the server is running, visit the **Swagger UI** to explore and test APIs:
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Quick Start with curl
1.  **Sign Up**
    ```bash
    curl -X POST http://localhost:3000/api/auth/signup \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com", "password":"password123", "name":"Tester"}'
    ```
2.  **Login (Get Token)**
    ```bash
    curl -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com", "password":"password123"}'
    ```
3.  **List Containers (with Token)**
    ```bash
    curl -H "Authorization: Bearer <YOUR_TOKEN>" http://localhost:3000/api/containers
    ```

## 🏗️ Architecture
- **Server**: Express.js
- **Database**: SQLite (via Prisma ORM)
- **Container Engine**: Dockerode (Docker API)
- **Storage**: Local filesystem (`storage_data/`)

## 📅 Roadmap
See [ROADMAP.md](./ROADMAP.md) for daily progress.
