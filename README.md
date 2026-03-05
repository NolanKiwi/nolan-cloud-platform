# ☁️ Nolan Cloud Platform (NCP)

A lightweight, AWS-like cloud platform simulation built with Node.js, Express, Docker, and SQLite.

## 🚀 Features
- **Compute (N-EC2)**: Manage Docker containers as virtual instances.
- **Storage (N-S3)**: Object storage with buckets, ACLs, and presigned URLs.
- **Network**: Manage Docker networks.
- **Identity (N-IAM)**: User authentication (JWT) and API Keys.
- **Dashboard**: Web-based simple UI for managing instances and storage.
- **CLI**: Command-line interface (`ncp`) for managing resources.
- **Monitoring**: Background jobs for resource tracking.

## 🛠️ Prerequisites
- **Node.js** (v18+)
- **Docker** (Desktop or Engine) running locally
- **Git**

## 📦 Installation & Setup

You can use the provided setup script:
```bash
git clone https://github.com/NolanKiwi/nolan-cloud-platform.git
cd nolan-cloud-platform
chmod +x install.sh
./install.sh
```

Or manually:

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

## 📖 Full Usage Guide

### 1. Web Dashboard
Once the server is running, open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

From there, you can:
- **Sign up / Login**
- **Manage Instances**: Start, stop, and view stats of your running instances (Docker containers).
- **Manage Storage**: Access your buckets and upload files.

### 2. NCP CLI (`ncp-cli`)
NCP comes with a CLI tool for managing your resources from the terminal.

#### Setup CLI
```bash
cd ncp-cli
npm install -g .
ncp config --url http://localhost:3000 --key YOUR_API_KEY
```

#### CLI Commands
- **Compute (Instances)**
  - `ncp ps`: List your instances
  - `ncp run <image>`: Start a new instance
  - `ncp stop <id>`: Stop an instance

- **Storage (Buckets & Objects)**
  - `ncp s3 mb <bucket_name>`: Create a new bucket
  - `ncp s3 cp <local_file> <bucket_name>`: Upload a file to your bucket

### 3. API Documentation
Visit the **Swagger UI** to explore and test APIs directly:
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

#### Quick Start with curl
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
