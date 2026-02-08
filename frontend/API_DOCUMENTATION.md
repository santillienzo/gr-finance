# API Documentation - Sistema GR

Base URL: `/api` (configurable via `REACT_APP_API_URL`)

**Authentication:**
This API uses Bearer Token authentication. 
The `Authorization` header must be set to `Bearer <token>` for all endpoints except `/auth/login`.

## 0. Authentication

### POST /auth/login
Authenticates a user and returns a JWT token.

**Payload:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response JSON:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "name": "Administrador"
  }
}
```

---

## Common Types (Typescript Interfaces)

The frontend expects data to match these structures.

```typescript
// Box Types
enum BoxType {
  EFECTIVO = 'EFECTIVO',
  CHEQUES = 'CHEQUES',
  TRANSFERENCIAS = 'TRANSFERENCIAS'
}

interface Box {
  id: string;
  name: string;
  type: BoxType;
  balance: number;
}

// Entity (Client/Provider)
interface Entity {
  id: string;
  name: string;
  type: 'CLIENT' | 'PROVIDER';
  balance: number; // Client: Positive = they owe us. Provider: Positive = we owe them.
}

// Transaction
interface Transaction {
  id: string;
  date: string; // ISO 8601 String
  type: 'SALE' | 'COLLECTION' | 'PURCHASE' | 'PAYMENT' | 'TRANSFER' | 'INCOME' | 'EXPENSE' | 'INITIAL_BALANCE';
  amount: number;
  description: string;
  boxId?: string;       // Source Box ID
  targetBoxId?: string; // Destination Box ID (for transfers)
  entityId?: string;    // Client or Provider ID
}
```

---

## 1. Transactions (Movimientos)

### GET /transactions
Retrieves the history of all transactions.
**Response JSON:**
```json
[
  {
    "id": "tx_1",
    "date": "2023-10-27T10:00:00.000Z",
    "type": "SALE",
    "amount": 15000.50,
    "description": "Venta Factura A-001",
    "entityId": "client_1"
  },
  {
    "id": "tx_2",
    "date": "2023-10-27T11:30:00.000Z",
    "type": "COLLECTION",
    "amount": 5000,
    "description": "Cobro parcial",
    "entityId": "client_1",
    "boxId": "box_1"
  }
]
```

### POST /transactions
Creates a new transaction.
**Payload:**
```json
{
  "type": "SALE",
  "amount": 15000.50,
  "description": "Factura A-1234",
  "entityId": "client_uuid_123"
}
```

---

## 2. Clients (Clientes)

### GET /clients
Returns a list of clients.
**Response JSON:**
```json
[
  {
    "id": "client_1",
    "name": "Cliente Generico S.A.",
    "type": "CLIENT",
    "balance": 10500.50
  },
  {
    "id": "client_2",
    "name": "Juan Perez",
    "type": "CLIENT",
    "balance": 0
  }
]
```

### POST /clients
Registers a new client.
**Payload:** `{"name": "New Client Name"}`
**Response:** Returns the created `Entity` object.

### DELETE /clients/:id
Removes a client.

---

## 3. Providers (Proveedores)

### GET /providers
Returns a list of providers.
**Response JSON:**
```json
[
  {
    "id": "prov_1",
    "name": "Distribuidora Mayorista",
    "type": "PROVIDER",
    "balance": 50000.00
  }
]
```

### POST /providers
Registers a new provider.
**Payload:** `{"name": "New Provider Name"}`
**Response:** Returns the created `Entity` object.

### DELETE /providers/:id
Removes a provider.

---

## 4. Boxes (Cajas)

### GET /boxes
Returns the list of money boxes.
**Response JSON:**
```json
[
  {
    "id": "box_1",
    "name": "Caja Efectivo",
    "type": "EFECTIVO",
    "balance": 250000.00
  },
  {
    "id": "box_2",
    "name": "Caja Cheques",
    "type": "CHEQUES",
    "balance": 120000.00
  }
]
```

---

## 5. Configuration (Configuración)

### POST /initial-balance
Force-sets a balance.
**Payload:**
```json
{
  "entityId": "uuid",
  "type": "BOX" | "CLIENT" | "PROVIDER",
  "amount": 100000
}
```
