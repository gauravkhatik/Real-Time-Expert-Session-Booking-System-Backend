# Real-Time-Expert-Session-Booking-System-Backend

# 🚀 Real-Time Expert Session Booking - Backend

This is the backend API for the Real-Time Expert Session Booking System.  
Built using Node.js, Express, MongoDB, and Socket.io.

---

## 🏗️ Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.io
- CORS
- Dotenv

---

## 📂 Project Structure

backend/
├── api/server.js
├── models/
├── controllers/
├── routes/
├── scripts/seed.js
└── package.json

---

## ⚙️ Features

RESTful API  
 Expert listing with pagination & filters  
 Booking creation & status tracking  
 Duplicate booking prevention (unique index)  
 Real-time updates via Socket.io  
 Serverless MongoDB connection caching (Vercel optimized)

---

## Database Models

### Expert

- name
- category
- experience
- rating

### Booking

- expert (ObjectId reference)
- name
- email
- phone
- date
- timeSlot
- notes
- status (Pending → Confirmed → Completed)

Unique Index:
Prevents double booking using:
expert + date + timeSlot

---

## 🔧 Installation (Local Setup)

1️⃣ Install dependencies

```bash
npm install

2️⃣ Create .env file

MONGO_URI=your_mongodb_connection_string
FRONTEND_ORIGIN=http://localhost:3000

3️⃣ Run backend

npm run dev
```

API Endpoints
Experts

GET /api/experts
GET /api/experts/categories
GET /api/experts/:id
GET /api/experts/:id/slots

Bookings

POST /api/bookings
GET /api/bookings?email=user@email.com

PATCH /api/bookings/:id/status
