
const express = require("express");
const router = express.Router();

const Asset = require("../models/Asset");

// POST : Ajouter un équipement
router.post("/", async (req, res) => {
    try {
        const newAsset = new Asset(req.body);

        const savedAsset = await newAsset.save();

        res.status(201).json({
            message: "Asset created successfully",
            asset: savedAsset
        });

    } catch (error) {
        res.status(400).json({
            message: "Error creating asset",
            error: error.message
        });
    }
});

module.exports = router;
