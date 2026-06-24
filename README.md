# Multi-Tenant Feature Flag Management System

## Overview

A SaaS-style feature flag management system that allows a software host to manage organizations, organization administrators to manage feature flags, and end users to check whether specific features are enabled for their organization.

---

## Features

### Super Admin

* Login using static credentials
* Create organizations
* View all organizations

### Organization Admin

* Sign up under an organization
* Login using email and password
* Create feature flags
* Enable or disable feature flags
* Delete feature flags
* View all feature flags belonging to their organization

### End User

* Select an organization
* View available feature flags
* Check whether a feature is enabled or disabled

---

## Tech Stack

### Backend

* Node.js
* Express.js
* SQLite
* Drizzle ORM
* JWT Authentication
* bcryptjs

### Frontend

* HTML
* CSS
* JavaScript

---

## Project Structure

```text
project/
│
├── backend/
│   ├── db/
│   │   ├── index.js
│   │   └── schema.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── organization.js
│   │   └── featureFlag.js
│   │
│   ├── app.js
│   ├── package.json
│   ├── drizzle.config.js
│   └── dev.db
│
└── frontend/
    ├── super-admin/
    │   ├── login.html
    │   ├── create_org.html
    │   └── org_list.html
    │
    ├── admin/
    │   ├── signup.html
    │   ├── login.html
    │   └── feature_flags.html
    │
    └── user/
        └── check_feature.html
```

---

## Database Schema

### Organizations

```text
id
name
```

### Users

```text
id
email
password
role
organization_id
```

### Feature Flags

```text
id
feature_key
enabled
organization_id
```

---

## API Endpoints

### Authentication

```http
POST /auth/super-admin/login
POST /auth/admin/signup
POST /auth/admin/login
```

### Organizations

```http
POST /org/create
GET  /org/list
GET  /org/list/public
```

### Feature Flags

```http
POST   /flags/create
GET    /flags/list
PUT    /flags/update/:id
DELETE /flags/delete/:id
GET    /flags/check/:featureKey
GET    /flags/list/public/:orgId
GET    /flags/check/public/:orgId/:featureKey
```

---

## Authentication

JWT-based authentication is used for protected routes.

### Roles

#### Super Admin

Can:

* Create organizations
* View organizations

#### Admin

Can:

* Manage feature flags within their organization

#### End User

Can:

* Check feature availability

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Vetrivelhp/multi-tenant-feature-flag-system
```

### Navigate to Backend

```bash
cd multi-tenant-feature-flag-system
cd backend
```

### Install Dependencies

```bash
npm install
```

### Start Server

```bash
node app.js
```

Server runs on:

```text
http://localhost:3000
```

---

## Frontend Pages

### Super Admin

```text
http://localhost:3000/super_admin/login.html

http://localhost:3000/super_admin/create_org.html

http://localhost:3000/super_admin/org_list.html
```

### Admin

```text
http://localhost:3000/admin/signup.html

http://localhost:3000/admin/login.html

http://localhost:3000/admin/feature_flags.html
```

### End User

```text
http://localhost:3000/user/check_feature.html
```

---

## Multi-Tenant Design

Feature flags are isolated by organization.

Each organization manages its own set of feature flags, and administrators can only access and modify feature flags belonging to their organization.

This prevents cross-organization access and demonstrates tenant-level data isolation.

---

## Security

* Password hashing using bcryptjs
* JWT authentication
* Role-based authorization
* Organization-scoped feature flag management
* Protected administrative endpoints

---

