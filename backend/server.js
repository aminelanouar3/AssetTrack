
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./modules/auth/auth.routes");
const usersRoutes = require("./modules/users/users.routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/api", (req, res) => {
    res.json({
        message: "Bienvenue sur AssetTrack API",
        status: "Running",
        database: "MongoDB"
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

// Database connection
connectDB();

app.listen(PORT, () => {
    console.log(`AssetTrack server running on port ${PORT}`);
});
