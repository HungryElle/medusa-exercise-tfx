# Design Spelunker - Medusa Backend

This repository contains the custom backend implementation for **Design Spelunker**, built on top of [Medusa v2](https://medusajs.com/).

> **Note:**
> This repository is related to Project 6 exercises. Working on stretch goals on the `project6-dev` branch (to be merged to main later). No blocking issues.

## Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v20 or higher)
- **PostgreSQL** (Running locally, e.g., on port `5433`)
- **Redis** (Optional, falls back to an in-memory instance locally if not provided)
- **npm** (comes with Node.js)

## Local Setup Instructions

### 1. Clone the repository
Clone the codebase and navigate into the `design-spelunker` directory:
```bash
git clone <your-repo-url>
cd medusa-exercise-tfx/design-spelunker
```

### 2. Install Dependencies
Install all required Node modules:
```bash
npm install
```

### 3. Environment Variables
You will need a `.env` file at the root of the `design-spelunker` directory. You can create one and add the following default configuration for local development:

```env
# CORS Configuration
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com

# Database and Redis
DATABASE_URL=postgres://postgres@localhost:5433/medusa-design-spelunker
REDIS_URL=redis://localhost:6379

# Secrets
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret

# Payload CMS Sync Secret
PAYLOAD_SIGNATURE_KEY=supersecret

# Emails / SMTP (Ethereal test credentials)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=benjamin.wilkinson@ethereal.email
SMTP_PASS=Nexbxg1Rq2PkJqE6jB

# File paths
MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=design-spelunker-storefront
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
```

> **Important**: Ensure you have a standard PostgreSQL instance running locally matching the `DATABASE_URL` credentials. You may need to create the `medusa-design-spelunker` database manually via psql first (`CREATE DATABASE "medusa-design-spelunker";`).

### 4. Database Migrations
Before running the project, make sure the database schema is up-to-date and run migrations across the modules:
```bash
npx medusa db:migrate
```

### 5. Start the Development Server
Once the database is ready, you can spin up the development server:
```bash
npm run dev
```
The server will start on `http://localhost:9000`.
- **Medusa Admin Dashboard**: `http://localhost:9000/app`

---

## Important Custom Endpoints

### Payload CMS Design Sync Waitlist Webhook
- **Method:** `POST`
- **Path:** `/admin/payload-sync/design`
- **Headers:** `x-payload-signature` (HMAC SHA-256 base64 signature from Payload)
- **Description:** Receives webhook events from payload CMS to synchronize design records with Medusa. Validates the signature using `PAYLOAD_SIGNATURE_KEY` from the environment variables before processing via `payloadSyncWorkflow`.

## Available Scripts

From the inside of the `design-spelunker` directory, you can run:

- `npm run dev` - Starts the development server with live-reloading.
- `npm run build` - Builds the Medusa application.
- `npm run start` - Starts the built application.
- `npm run seed` - Runs the local seed script to populate the database with test data.
- `npm run test:unit` - Run unit tests.

## Notes:
- This banch implement till project 7 
