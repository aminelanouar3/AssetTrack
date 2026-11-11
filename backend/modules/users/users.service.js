const bcrypt = require("bcryptjs");
const Utilisateur = require("../auth/auth.model");

// Créer un utilisateur
const createUser = async (data) => {
    const { matricule, nom, prenom, motDePasse, role } = data;

    if (!/^\d+$/.test(matricule)) {
        throw new Error("Le matricule doit contenir uniquement des chiffres.");
    }

    if (!nom || !prenom || !motDePasse || !role) {
        throw new Error("Tous les champs obligatoires doivent être remplis.");
    }

    if (!["ADMINISTRATEUR", "TECHNICIEN"].includes(role)) {
        throw new Error("Rôle invalide.");
    }

    const existingUser = await Utilisateur.findById(matricule);

    if (existingUser) {
        throw new Error("Ce matricule existe déjà.");
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const utilisateur = new Utilisateur({
        _id: matricule,
        nom,
        prenom,
        motDePasse: hashedPassword,
        role
    });

    return await utilisateur.save();
};

// Consulter tous les utilisateurs
const getAllUsers = async () => {
    return await Utilisateur.find().select("-motDePasse");
};

// Consulter un utilisateur
const getUserById = async (matricule) => {
    const utilisateur = await Utilisateur.findById(matricule)
        .select("-motDePasse");

    if (!utilisateur) {
        throw new Error("Utilisateur introuvable.");
    }

    return utilisateur;
};

// Modifier les informations d'un utilisateur
const updateUser = async (matricule, data) => {
    const { nom, prenom, role } = data;

    if (role && !["ADMINISTRATEUR", "TECHNICIEN"].includes(role)) {
        throw new Error("Rôle invalide.");
    }

    const utilisateur = await Utilisateur.findById(matricule);

    if (!utilisateur) {
        throw new Error("Utilisateur introuvable.");
    }

    if (nom !== undefined) utilisateur.nom = nom;
    if (prenom !== undefined) utilisateur.prenom = prenom;
    if (role !== undefined) utilisateur.role = role;

    return await utilisateur.save();
};

// Activer ou désactiver un compte
const setUserStatus = async (matricule, actif) => {
    const utilisateur = await Utilisateur.findById(matricule);

    if (!utilisateur) {
        throw new Error("Utilisateur introuvable.");
    }

    utilisateur.actif = actif;

    return await utilisateur.save();
};

// Réinitialiser le mot de passe d'un utilisateur
const resetUserPassword = async (matricule, nouveauMotDePasse) => {
    if (!nouveauMotDePasse || nouveauMotDePasse.length < 8) {
        throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
    }

    const utilisateur = await Utilisateur.findById(matricule);

    if (!utilisateur) {
        throw new Error("Utilisateur introuvable.");
    }

    utilisateur.motDePasse = await bcrypt.hash(nouveauMotDePasse, 10);

    await utilisateur.save();

    return true;
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    setUserStatus,
    resetUserPassword
};