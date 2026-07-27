# 🍽️ Advanced Feedback System

A full-stack AI-powered restaurant feedback platform with real-time WebSocket updates, JWT authentication, and Gemini AI sentiment analysis.

**Live Demo:** [Frontend on Vercel](#) · [Backend on Render](#)

---

## ✨ Features

- 🔐 **JWT Authentication** — Register/Login with secure token-based auth
- 🤖 **Gemini AI Analysis** — Every review is analyzed for sentiment, key items, and urgency
- ⚡ **Real-time Updates** — Admin dashboard receives new feedback instantly via Socket.io WebSockets
- 📊 **Admin Dashboard** — Live feed with stats, sentiment breakdown, and urgent action flags
- 👤 **Review History** — Logged-in users can view all their past submissions
- 🔒 **Role-based Access** — Admin seeded via environment variables, cannot be registered via UI

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4     |
| Backend   | Node.js, Express 5                  |
| Database  | MongoDB (Mongoose)                  |
| AI        | Google Gemini 2.5 Flash             |
| Realtime  | Socket.io                           |
| Auth      | JWT (jsonwebtoken + bcryptjs)       |
| Deploy    | Vercel (frontend) + Render (backend)|

---

## 📁 Project Structure

```
Advanced-Feedback-System/
├── backend/
│   ├── middleware/
│   │   └── verifyToken.js       # JWT auth + admin guard
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Feedback.js          # Feedback schema
│   ├── routes/
│   │   ├── auth.js              # POST /api/register, POST /api/login
│   │   └── feedback.js          # POST /api/feedback, GET /api/feedback/my-feedback
│   ├── server.js                # Express + Socket.io + admin seeding
│   ├── .env.example             # Environment variable template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PublicFeedback.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json              # Vercel SPA routing config
│   ├── .env.example             # Environment variable template
│   └── package.json
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/Atanu-1234/Advanced-Feedback-System.git
cd Advanced-Feedback-System
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/feedback_db
JWT_SECRET=your_strong_random_secret
GEMINI_API_KEY=your_gemini_api_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@1234
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

Backend runs at `http://localhost:8000`

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🌐 Deployment Guide

### Backend → Render (Free Tier)

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo → select the `backend` folder as root directory
3. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add all environment variables from `backend/.env.example` in the Render dashboard:

| Variable         | Value                                      |
|------------------|--------------------------------------------|
| `PORT`           | `8000`                                     |
| `MONGO_URI`      | Your MongoDB Atlas connection string       |
| `JWT_SECRET`     | A long random string                       |
| `GEMINI_API_KEY` | Your Google Gemini API key                 |
| `ADMIN_USERNAME` | `admin`                                    |
| `ADMIN_PASSWORD` | A strong password                          |
| `FRONTEND_URL`   | Your Vercel frontend URL (after deploying) |

5. Deploy — note your backend URL (e.g. `https://your-app.onrender.com`)

---

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo → set **Root Directory** to `frontend`
3. Framework preset: **Vite**
4. Add environment variable in Vercel dashboard:

| Variable            | Value                                  |
|---------------------|----------------------------------------|
| `VITE_API_BASE_URL` | Your Render backend URL                |

5. Deploy

> ⚠️ After deploying frontend, go back to Render and update `FRONTEND_URL` to your Vercel URL, then redeploy the backend.

---

## 🔑 API Endpoints

| Method | Endpoint                      | Auth     | Description                        |
|--------|-------------------------------|----------|------------------------------------|
| POST   | `/api/register`               | None     | Register a new customer account    |
| POST   | `/api/login`                  | None     | Login and receive JWT token        |
| POST   | `/api/feedback`               | Optional | Submit a review (anonymous or user)|
| GET    | `/api/feedback/my-feedback`   | User     | Get logged-in user's review history|
| GET    | `/api/insights`               | Admin    | Get all feedback with AI analysis  |

---

## 🔐 Environment Variables Reference

### Backend (`backend/.env`)

| Variable         | Required | Description                              |
|------------------|----------|------------------------------------------|
| `PORT`           | No       | Server port (default: 8000)              |
| `MONGO_URI`      | Yes      | MongoDB connection string                |
| `JWT_SECRET`     | Yes      | Secret key for signing JWT tokens        |
| `GEMINI_API_KEY` | Yes      | Google Gemini AI API key                 |
| `ADMIN_USERNAME` | Yes      | Admin account username (seeded on start) |
| `ADMIN_PASSWORD` | Yes      | Admin account password                   |
| `FRONTEND_URL`   | Yes      | Allowed CORS origin (your frontend URL)  |

### Frontend (`frontend/.env`)

| Variable            | Required | Description              |
|---------------------|----------|--------------------------|
| `VITE_API_BASE_URL` | Yes      | Backend API base URL     |

---

## 👤 Default Admin Access

The admin account is **automatically created** on first server start using your `.env` values. You cannot register as admin through the UI.

```
Username: (value of ADMIN_USERNAME in .env)
Password: (value of ADMIN_PASSWORD in .env)
```

---

## 📸 Screenshots

| Register | Login | Feedback | Admin Dashboard |
|----------|-------|----------|-----------------|
| ![Register](#) | ![Login](#) | ![Feedback](#) | ![Dashboard](#) |

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 🙋 Author

**Atanu** — [GitHub](https://github.com/Atanu-1234)
