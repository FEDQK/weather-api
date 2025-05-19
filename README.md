# Weather Forecast API

A Node.js application that provides weather forecasts and allows users to subscribe to weather updates for their cities. Built with Fastify, TypeScript, and PostgreSQL.

## Features

- Get current weather for any city
- Subscribe to weather updates (hourly or daily)
- API documentation with Swagger
- Database migrations
- Docker support

## Prerequisites

- Node.js 22.x or later
- PostgreSQL 16.x
- Docker and Docker Compose (optional)

## Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update the following variables in your `.env` file:

```env
# Weather API
WEATHER_API_KEY=your_api_key_here        # Get from weatherapi.com
WEATHER_API_BASE_URL=https://api.weatherapi.com/v1/current.json

# Database
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_HOST=localhost        # Use 'db' for Docker
DATABASE_PORT=5432
DATABASE_NAME=weather_api

# Application
APP_URL=http://localhost:3000

# SMTP (Example using Mailtrap)
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=Weather Service <your-email@example.com>
```

## Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma client:
```bash
npm run prisma:generate
```

3. Start PostgreSQL database:
```bash
npm run docker:db
```

4. Push database schema:
```bash
npm run prisma:push
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at http://localhost:3000

## Docker Setup

1. Make sure you have Docker and Docker Compose installed

2. Build and start the containers:
```bash
docker compose up -d
```

The API will be available at http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push database schema
- `npm run prisma:reset` - Reset database (caution: data loss)
- `npm run docker:db` - Start PostgreSQL in Docker
- `npm run docker:app` - Start application in Docker

## API Documentation

Once the server is running, visit:
- http://localhost:3000/documentation - Swagger UI
- http://localhost:3000/subscribe.html - Subscription page

## API Endpoints

### Weather
- `GET /api/weather?city={city}` - Get current weather for a city

### Subscriptions
- `POST /api/subscribe` - Subscribe to weather updates
- `GET /api/confirm/{token}` - Confirm subscription
- `GET /api/unsubscribe/{token}` - Unsubscribe from updates

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.