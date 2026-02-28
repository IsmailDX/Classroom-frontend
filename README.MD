Here is your **updated README.md**, fully formatted and ready to copy-paste directly into GitHub:

---

# Classroom Management Platform

A full-stack classroom management platform for schools and training programs, built with a modern React + TypeScript frontend and an Express + PostgreSQL backend. It supports role-based access (student / teacher / admin), class and subject management, and secure student enrollments.

> ⚠️ **Important:** This is the **frontend** repo. It **requires the backend** to run.
> Backend repo: **[https://github.com/IsmailDX/Classroom-backend](https://github.com/IsmailDX/Classroom-backend)**

---

## ✨ Features

* **Role-based access control** – separate views and permissions for students, teachers, and admins.
* **Classroom & subject management** – create, update, and browse classes, departments, subjects, and faculty.
* **Student enrollments**

  * Enroll by selecting a class from a list.
  * Join via invite code generated per class.
* **Secure authentication**

  * Email/password auth with Better Auth.
  * OAuth login with Google/GitHub.
* **Production-ready**

  * Arcjet for API security (bot detection & rate limiting).
  * Site24x7 for uptime and performance monitoring.
* **Admin dashboard** – CRUD with search, filters, and pagination using Refine.

---

## 🧱 Tech Stack

### Frontend

* React + TypeScript
* Refine
* Vite
* Shadcn/UI
* Tailwind-style utility classes

### Backend

* Node.js + Express
* PostgreSQL
* Drizzle ORM
* Better Auth
* Arcjet

### Infrastructure / DX

* Site24x7
* Cloudinary

---

## 🏗️ Architecture Overview

The project is split into two apps:

### Backend (`Classroom-backend`)

* Exposes REST APIs under `/api/*` (e.g. `/api/classes`, `/api/enrollments`).
* Handles auth, authorization, business rules, and database persistence.
* Source: **[https://github.com/IsmailDX/Classroom-backend](https://github.com/IsmailDX/Classroom-backend)**

### Frontend (`Classroom-frontend`)

* Consumes the backend via `VITE_BACKEND_BASE_URL`.
* Uses Refine’s `dataProvider` and `authProvider`.
* Provides dashboards and operational UI.

### High-Level Flow

1. Users sign up / sign in (Better Auth: email or Google/GitHub).
2. Admins create departments, subjects, and classes.
3. Students enroll via class picker or invite code.
4. Backend validates enrollments (no duplicates, valid foreign keys).

---

# 🚀 Getting Started

## 1️⃣ Prerequisites

* Node.js (LTS recommended)
* PostgreSQL instance
* pnpm / npm / yarn

Clone both repositories locally:

* Backend → [https://github.com/IsmailDX/Classroom-backend](https://github.com/IsmailDX/Classroom-backend)
* Frontend → This repository

---

# 🖥️ Backend Setup (Classroom-backend)

> Full instructions are also available in the backend repository.

## 2.1 Install Dependencies

```bash
cd Classroom-backend
pnpm install   # or npm install / yarn
```

---

## 2.2 Configure Environment Variables

Create a `.env` file in the backend root:

```env
BETTER_AUTH_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173

DATABASE_URL=postgres://user:password@localhost:5432/classroom_db

ARCJET_KEY=your_arcjet_api_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

## 2.3 Run Database Migrations (Drizzle)

```bash
pnpm drizzle:push
```

---

## 2.4 Start the Backend

```bash
pnpm dev   # or npm run dev
```

Backend runs at:

```
http://localhost:8000
```

---

# 🎨 Frontend Setup (Classroom-frontend)

## 3.1 Install Dependencies

```bash
cd Classroom-frontend
pnpm install   # or npm install / yarn
```

---

## 3.2 Configure Environment Variables

Create a `.env` or `.env.local` file in the frontend root:

```env
VITE_BACKEND_BASE_URL=http://localhost:8000/api/
VITE_API_URL=http://localhost:8000/api

VITE_ACCESS_TOKEN_KEY=access_token
VITE_REFRESH_TOKEN_KEY=refresh_token

VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/<cloud_name>/image/upload
VITE_CLOUDINARY_CLOUD_NAME=<cloud_name>
VITE_CLOUDINARY_UPLOAD_PRESET=<unsigned_preset>
```

---

## 3.3 Start the Frontend

```bash
pnpm dev
```

Frontend runs at:

```
http://localhost:5173
```

> 🔗 **Reminder:** The backend must be running, or the frontend will not function.

---

# 🔐 Authentication & Roles

### Authentication

* Better Auth (email/password)
* Google OAuth
* GitHub OAuth

### Roles

* `student`
* `teacher`
* `admin`

**Default role on registration:** `student`

---

# 🧮 Core Modules

### 🏫 Departments & Subjects

* Create and list departments.
* Attach subjects to departments.

### 📚 Classes

* Assign subjects and teachers.
* Generate invite codes.
* Define capacity and schedule.

### 📝 Enrollments

* Enroll via class picker.
* Join via invite code.
* Backend prevents duplicate enrollments.

### 👩‍🏫 Faculty

* List and view teachers.
* Filter/search by role or name.

---

# 🛡️ Production-Ready Features

### Arcjet

* Bot detection
* Basic rate limiting
* API abuse protection

### Site24x7

* Uptime monitoring
* Performance tracking
* Downtime alerts

These integrations move the project closer to real-world production deployment.

---

# 📁 Project Structure (Frontend)

```
src/
  components/
    refine-ui/
      form/
      layout/
      views/
    ui/

  pages/
    login/
    register/
    subjects/
    departments/
    classes/
    enrollments/
    faculty/
    dashboard.tsx

  providers/
    auth.ts
    data.ts

  lib/
    auth-client.ts
    schema.ts
    utils.ts

  types/
    index.ts
```

---

# 🧪 Scripts

## Backend

```bash
pnpm dev      # development
pnpm build    # production build
pnpm start    # run production server
```

## Frontend

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm preview  # preview production build
```

---

# 🗺️ Roadmap

* Student dashboard (schedule + upcoming work)
* Teacher grading & announcements
* Department-level admin permissions
* Audit logs for admin actions
* Notification system (email / in-app)

---

## ⭐ If you find this project useful, consider starring the repository!
