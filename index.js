import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';  // Import CORS middleware
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "*", credentials: true })); // Allow all origins (for testing)
app.use(express.json());
app.use(cookieParser());

// APIS
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(process.env.PORT || 5500, "0.0.0.0", () => {
  console.log(`Server is running on port ${process.env.PORT || 5500}`);
});
