# 💈 Salon Management Portal — AFWT Project

A full-stack **Salon Management System** built with **React (Vite)** on the frontend and **Node.js + Express + MongoDB** on the backend. It supports multiple roles: Admin, Receptionist, Barber, and Customer.

---

## 📁 Project Structure

```
AFWT/
├── Projact/                        # Frontend (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/             # Reusable UI & dashboard components
│   │   ├── pages/                  # Route-level pages (admin, barber, customer, receptionist)
│   │   ├── routes/                 # React Router configuration
│   │   ├── services/               # API service helpers
│   │   ├── styles/                 # Global CSS styles
│   │   └── theme/                  # Theme/color tokens
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── Salon_management_BackEnd-master/ # Backend (Express.js + MongoDB)
│   ├── src/
│   │   ├── config/                 # DB connection, Swagger config
│   │   ├── controllers/            # Route handler logic
│   │   ├── middleware/             # Auth, validation middleware
│   │   ├── models/                 # Mongoose schemas
│   │   ├── routes/                 # Express API routes
│   │   ├── seed.js                 # Database seeder
│   │   └── server.js               # App entry point
│   ├── .env.example
│   └── package.json
│
└── 2501CS401_AFWT_Project.pdf      # Project documentation
```

---

## 🛠️ Technologies Used

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Vite 8, React Router 7, Bootstrap 5, Tailwind CSS 3 |
| Backend   | Node.js, Express 4, Mongoose 8, JWT, bcryptjs  |
| Database  | MongoDB (local or Atlas)                        |
| API Docs  | Swagger UI (`/api-docs`)                       |
| Auth      | JWT (JSON Web Tokens)                          |

---

## ⚙️ Environment Variables

### Backend (`Salon_management_BackEnd-master/.env`)

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable       | Description                        | Example                                      |
|----------------|------------------------------------|----------------------------------------------|
| `PORT`         | Port the server runs on            | `5000`                                       |
| `MONGODB_URI`  | MongoDB connection string          | `mongodb://localhost:27017/salon_management` |
| `JWT_SECRET`   | Secret key for signing JWTs        | `your_strong_secret_here`                    |
| `JWT_EXPIRE`   | JWT token expiry duration          | `7d`                                         |
| `NODE_ENV`     | Runtime environment                | `development`                                |

> ⚠️ **Never commit your real `.env` file. It is excluded by `.gitignore`.**

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **MongoDB** running locally, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI

---

### 1. Backend Setup

```bash
cd Salon_management_BackEnd-master

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# (Optional) Seed the database with sample data
npm run seed

# Start development server
npm run dev
```

The backend runs at: **http://localhost:5000**  
Swagger API docs: **http://localhost:5000/api-docs**

---

### 2. Frontend Setup

```bash
cd Projact

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs at: **http://localhost:5173**

> Make sure the backend is running first so API calls work correctly.

---

## 👥 User Roles

| Role          | Access                                                  |
|---------------|---------------------------------------------------------|
| **Admin**     | Full access — manage staff, services, inventory, reports |
| **Receptionist** | Manage appointments, customers, and daily operations |
| **Barber**    | View assigned appointments and schedules               |
| **Customer**  | Book and manage personal appointments                  |

---

## 🔌 API Endpoints Overview

| Resource       | Base Path              |
|----------------|------------------------|
| Auth           | `/api/auth`            |
| Users          | `/api/users`           |
| Services       | `/api/services`        |
| Appointments   | `/api/appointments`    |
| Staff          | `/api/staff`           |
| Wages          | `/api/wages`           |
| Inventory      | `/api/inventory`       |
| Products       | `/api/products`        |
| Orders         | `/api/orders`          |
| Analytics      | `/api/analytics`       |
| Dashboard      | `/api/dashboard`       |

Full interactive API documentation available at `/api-docs` when the backend is running.

---

## 🏗️ Build for Production

```bash
# Frontend — build static files
cd Projact
npm run build
# Output in: Projact/dist/

# Backend — run in production mode
cd Salon_management_BackEnd-master
NODE_ENV=production npm start
```

---

## 🗄️ Database Seeding

The backend includes a seed script to populate the database with initial data:

```bash
cd Salon_management_BackEnd-master
npm run seed
```

---

## 📄 License

ISC — See [package.json](Salon_management_BackEnd-master/package.json) for details.
