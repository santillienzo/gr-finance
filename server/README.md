# GR Financial Control - Server

API Server for the GR Financial Control System built with Node.js, TypeScript, Express, and PostgreSQL.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure your PostgreSQL database in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=gr_financial
JWT_SECRET=your_super_secret_jwt_key
```

4. Create the database in PostgreSQL:
```sql
CREATE DATABASE gr_financial;
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Default Credentials

On first run, the server creates a default admin user:
- **Username:** `admin`
- **Password:** `admin123`

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| GET | `/api/boxes` | Get all boxes | Yes |
| GET | `/api/clients` | Get all clients | Yes |
| POST | `/api/clients` | Create client | Yes |
| DELETE | `/api/clients/:id` | Delete client | Yes |
| GET | `/api/providers` | Get all providers | Yes |
| POST | `/api/providers` | Create provider | Yes |
| DELETE | `/api/providers/:id` | Delete provider | Yes |
| GET | `/api/transactions` | Get all transactions | Yes |
| POST | `/api/transactions` | Create transaction | Yes |
| POST | `/api/initial-balance` | Set initial balance | Yes |

## Project Structure

```
src/
├── config/          # Database and environment configuration
├── controllers/     # Request handlers
├── entities/        # TypeORM entities (database models)
├── middlewares/     # Express middlewares
├── routes/          # API routes
├── types/           # TypeScript types and enums
└── utils/           # Utility functions
```

## Database Migrations

```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```
