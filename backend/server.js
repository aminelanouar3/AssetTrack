
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(express.json());
const assetRoutes = require("./routes/assetRoutes");
app.use("/api/assets", assetRoutes);

const PORT = process.env.PORT || 3000;

// Connexion à MongoDB
connectDB();

// Route de test
app.get("/api", (req, res) => {
    res.json({
        message: "Bienvenue sur AssetTrack API",
        status: "Running",
        database: "MongoDB"
    });
});

app.listen(PORT, () => {
    console.log(`AssetTrack server running on port ${PORT}`);
});
