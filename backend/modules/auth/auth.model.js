const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            trim: true
        },

        nom: {
            type: String,
            required: true,
            trim: true
        },

        prenom: {
            type: String,
            required: true,
            trim: true
        },

        motDePasse: {
            type: String,
            required: true
        },

        role: {
            type: String,
            required: true,
            enum: ["ADMINISTRATEUR", "TECHNICIEN"]
        },

        actif: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: { createdAt: "dateCreation", updatedAt: false },
        versionKey: false
    }
);

module.exports = mongoose.model(
    "Utilisateur",
    utilisateurSchema,
    "utilisateurs"
);