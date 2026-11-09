require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Utilisateur = require("./modules/auth/auth.model");

const createAdmin = async () => {
    try {
        await connectDB();

        const matricule = "ADMIN001";
        const motDePasse = "Admin123";

        const existingAdmin = await Utilisateur.findById(matricule);

        if (existingAdmin) {
            console.log("Cet administrateur existe déjà.");
            return;
        }

        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        const admin = new Utilisateur({
            _id: matricule,
            nom: "Administrateur",
            prenom: "Principal",
            motDePasse: hashedPassword,
            role: "ADMINISTRATEUR"
        });

        await admin.save();

        console.log("Administrateur créé avec succès.");
        console.log("Matricule :", matricule);
        console.log("Mot de passe :", motDePasse);

    } catch (error) {
        console.error("Erreur :", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();