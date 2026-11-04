
const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: ["Laptop", "Desktop", "Printer", "Monitor", "Other"]
        },

        brand: {
            type: String,
            trim: true
        },

        model: {
            type: String,
            trim: true
        },

        serialNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        purchaseDate: {
            type: Date
        },

        purchasePrice: {
            type: Number,
            min: 0
        },

        status: {
            type: String,
            enum: ["AVAILABLE", "ASSIGNED", "MAINTENANCE", "RETIRED"],
            default: "AVAILABLE"
        },

        specifications: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        isArchived: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Asset", assetSchema);
