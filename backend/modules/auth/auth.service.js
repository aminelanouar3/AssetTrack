const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Utilisateur = require("./auth.model");

const login = async (matricule, motDePasse) => {
    const utilisateur = await Utilisateur.findById(matricule);

    if (!utilisateur || !utilisateur.actif) {
        throw new Error("Matricule ou mot de passe incorrect.");
    }

    const passwordValide = await bcrypt.compare(
        motDePasse,
        utilisateur.motDePasse
    );

    if (!passwordValide) {
        throw new Error("Matricule ou mot de passe incorrect.");
    }

    const token = jwt.sign(
        {
            matricule: utilisateur._id,
            role: utilisateur.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );

    return {
        token,
        utilisateur: {
            matricule: utilisateur._id,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            role: utilisateur.role
        }
    };
};

module.exports = { login };