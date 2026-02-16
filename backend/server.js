//Complete Backend with MongoDB, Auth, Reviews, WhatsApp
// Complete Express server setup

// import express from 'express'
// import mongoose from 'mongoose'
// import cors from 'cors'
// import dotenv from 'dotenv'

// // Import routes
// import authRoutes from './routes/auth.js'
// import resourceRoutes from './routes/resources.js'

// // Load environment variables
// dotenv.config()

// const app = express()
// const PORT = process.env.PORT || 5000

// // Middleware
// app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use("/api/auth", authRoutes);  ///
// app.use("/api/resources", resourceRoutes);//

// // Request logging
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
//   next()
// })

// // Database connection
// const connectDB = async () => {
//   try {
//     await mongoose.connect(
//       process.env.MONGODB_URI || 'mongodb://localhost:27017/bangalore-bachelor'
//     )
//     console.log('✅ MongoDB Connected Successfully')
//   } catch (error) {
//     console.error('❌ MongoDB Connection Error:', error.message)
//     process.exit(1)
//   }
// }

// // Routes
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Bangalore Bachelor API',
//     version: '1.0.0',
//     endpoints: {
//       auth: '/api/auth',
//       resources: '/api/resources',
//     },
//   })
// })

// app.use('/api/auth', authRoutes)
// app.use('/api/resources', resourceRoutes)

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`,
//   })
// })

// // Error handler
// app.use((err, req, res, next) => {
//   console.error('Error:', err.stack)
//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//   })
// })

// // Start server
// const startServer = async () => {
//   await connectDB()
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`)
//     console.log(`📡 API: http://localhost:${PORT}/api`)
//   })
// }

// startServer()

// export default app

//Complete Backend with MongoDB, Auth, Reviews, WhatsApp
// Complete Express server setup

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth.js";
import resourceRoutes from "./routes/resources.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (MOVED BEFORE ROUTES)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/bangalore-bachelor",
    );
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Bangalore Bachelor API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      resources: "/api/resources",
    },
  });
});

// API Routes (ONLY ONE REGISTRATION)
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
  });
};

startServer();

export default app;
