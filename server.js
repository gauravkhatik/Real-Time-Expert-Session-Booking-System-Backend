<<<<<<< HEAD
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const expertRoutes = require("./routes/expertRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});


app.use("/api/experts", expertRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running 🚀" });
});

module.exports = app;
=======
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));

// ================= MongoDB Connection =================
mongoose.connect(
  process.env.MONGO_URI || 
  'mongodb+srv://gauravkhatik806_db_user:ldJ71dfghLcyy2W9@cluster0.xwaoi5k.mongodb.net/',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error', err);
});

// ================= Socket.io Setup =================
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || '*',
  },
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinExpert', (expertId) => {
    socket.join(`expert_${expertId}`);
  });

  socket.on('leaveExpert', (expertId) => {
    socket.leave(`expert_${expertId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ================= Routes =================
app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

// ================= Server Start =================
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> a3e606f (push 11)
