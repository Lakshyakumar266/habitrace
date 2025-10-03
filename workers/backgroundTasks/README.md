# Background Tasks Service

A Node.js background task processing service built with TypeScript, Redis, and Brevo email integration.

## What is this?

This service handles background task processing using Redis as a message queue and Brevo for email notifications. It's designed to run asynchronously and process tasks independently from your main application.

## Prerequisites

- Node.js (v18 or higher recommended)
- Docker (for running Redis)
- A Brevo account (for email functionality)

## Getting Started

### 1. Start Redis with Docker

First, start a Redis instance using Docker:

```bash
docker run -d -p 6379:6379 redis:latest
```

Or if you prefer using docker-compose, create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
```

Then run:

```bash
docker-compose up -d
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory with your configuration:

```env
REDIS_URL=redis://localhost:6379
BREVO_API_KEY=your_brevo_api_key_here
```

### 4. Development

Start the development server with hot reload:

```bash
npm run dev
```

### 5. Build for Production

Compile TypeScript to JavaScript:

```bash
npm run build
```

### 6. Run in Production

```bash
npm start
```

## Tech Stack

- **TypeScript**: Type-safe development
- **Redis**: Message queue and caching
- **Brevo**: Email service integration
- **ts-node**: TypeScript execution for development

## Scripts

- `npm run dev` - Run in development mode with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled production build