# Database Schema & ERD Specification

Spesifikasi skema basis data PostgreSQL / MySQL untuk **Aplikasi Pencatatan Keuangan Personal & Rumah Tangga Modern** dengan sistem pengelolaan multi-saldo dan autentikasi Google OAuth 2.0.

---

## 1. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ ACCOUNTS : owns
    USERS ||--o{ CATEGORIES : creates
    USERS ||--o{ TRANSACTIONS : logs
    USERS ||--o{ TRANSFERS : executes
    ACCOUNTS ||--o{ TRANSACTIONS : source_account
    ACCOUNTS ||--o{ TRANSFERS : from_account
    ACCOUNTS ||--o{ TRANSFERS : to_account
    CATEGORIES ||--o{ TRANSACTIONS : classifies

    USERS {
        uuid id PK
        string google_id UK
        string email UK
        string name
        string avatar_url
        timestamp last_login_at
        timestamp created_at
    }

    ACCOUNTS {
        uuid id PK
        uuid user_id FK
        string type "PRIMARY | HOUSEHOLD_SUB | PERSONAL_SUB"
        string name
        decimal balance
        string currency
        timestamp updated_at
    }

    CATEGORIES {
        uuid id PK
        uuid user_id FK
        string scope "INCOME | HOUSEHOLD_EXPENSE | PERSONAL_EXPENSE"
        string name
        string icon
        string color
        boolean is_default
    }

    TRANSACTIONS {
        uuid id PK
        uuid user_id FK
        uuid account_id FK
        uuid category_id FK
        string type "INCOME | EXPENSE | ALLOCATION"
        decimal amount
        date date
        string description
        timestamp created_at
    }

    TRANSFERS {
        uuid id PK
        uuid user_id FK
        uuid from_account_id FK
        uuid to_account_id FK
        decimal amount
        date date
        string notes
        timestamp created_at
    }
```

---

## 2. Table Schemas & Data DDL (PostgreSQL)

### 2.1 Table `users` (Google Account Authenticated)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique user identifier |
| `google_id` | VARCHAR(255) | UNIQUE | Google OAuth `sub` ID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Google Account Email |
| `name` | VARCHAR(150) | NOT NULL | Display name from Google Profile |
| `avatar_url` | TEXT | | Google Profile Picture URL |
| `last_login_at` | TIMESTAMPTZ | DEFAULT `CURRENT_TIMESTAMP` | Last authentication timestamp |
| `created_at` | TIMESTAMPTZ | DEFAULT `CURRENT_TIMESTAMP` | Account creation timestamp |

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    last_login_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```
