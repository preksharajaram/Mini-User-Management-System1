Mini User Management System
# PurpleMerit Admin Panel Assignment

## Project Overview
This project is a full-stack admin panel built using:
- React.js (Frontend)
- Node.js + Express.js (Backend)
- MongoDB (Database)
- JWT Authentication

The application allows an admin to log in and manage users with role-based access control.

---

## Features Implemented
- Admin authentication using JWT
- Secure password hashing using bcrypt
- Role-based access (Admin only routes)
- User listing with pagination
- Activate / Deactivate users
- Protected backend APIs
- React-based admin dashboard

---

## Project Structure
- `purplemerit-backend/` → Backend API
- `purplemerit-frontend/` → Frontend UI

Frontend and backend are intentionally kept separate as per best practices.

---

## How to Run the Project

### Backend
```bash
cd purplemerit-backend
npm install
node server.js
