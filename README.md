## Fastify High-Performance URL Shortener

This document outlines the architecture, setup, and usage of the URL shortening service built with **Fastify**, designed for speed and reliability using **Redis** and **PostgreSQL**.

-----

### Key Features

  * **Low Latency Redirects:** Achieved through an **L1 Redis Cache** lookup before falling back to the database.
  * **Unique ID Generation:** Uses **Base62 encoding** of sequential PostgreSQL IDs for guaranteed uniqueness without collision checks.
  * **Layered Architecture:** Strict Separation of Concerns using Fastify's core plugin and routing system.
  * **Asynchronous Analytics:** Click counting is handled non-blocking in the background to ensure fast redirection.
  * **Schema Validation:** Fastify's built-in JSON Schema validation is used for robust input validation.

-----

### Architecture Overview

The system employs a **Layered Architecture** where each component has a single, isolated responsibility.

| Layer | Responsibility | Example Files |
| :--- | :--- | :--- |
| **Entry** | Initiation and Configuration Loading. | `server.js`, `app.js` |
| **Interface** | HTTP Request/Response handling and Input Validation. | `src/routes` |
| **Core Logic** | Business Algorithms (Base62 conversion, Cache/DB Fallback). | `src/services` |
| **Infrastructure** | External Connection Management and Sharing (Decorators). | `src/plugins` |
| **Data** | Persistence and High-Speed Cache. | PostgreSQL, Redis |

-----

### Local Setup

This project requires **Node.js** and **Docker Compose** for local infrastructure.

#### 1\. Dependencies and Infrastructure

```bash
npm install
docker-compose up -d
```

#### 2\. Database Schema

Connect to the PostgreSQL instance and execute the table creation script:

```sql
CREATE TABLE links (
    id BIGSERIAL PRIMARY KEY,
    long_url TEXT NOT NULL,
    short_code VARCHAR(10) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    clicks INTEGER DEFAULT 0
);
```

#### 3\. Run Application

```bash
node server.js
```

-----

### API Endpoints

All link creation endpoints are versioned under `/api/v1`.

#### 1\. Shorten URL (Create)

  * **Method:** `POST`
  * **Endpoint:** `/api/v1/shorten`
  * **Body:** `{"url": "YOUR_LONG_URL"}`
  * **Success Response (201):** `{"short_code": "4VaF"}`

#### 2\. Redirect Link (Redeem)

  * **Method:** `GET`
  * **Endpoint:** `/:shortCode` (e.g., `/4VaF`)
  * **Action:** Server issues a **302 Redirect** to the original URL. Click count is updated asynchronously.

#### 3\. Health Check

  * **Method:** `GET`
  * **Endpoint:** `/health`
  * **Action:** Returns connection status for the server, DB, and Redis.