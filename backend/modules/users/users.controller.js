const usersService = require("./users.service");
const sanitizeUser = (user) => {
    const data = user.toObject();
    delete data.motDePasse;
    return data;
};
// Créer un utilisateur
const createUser = async (req, res) => {
    try {
        const utilisateur = await usersService.createUser(req.body);

        res.status(201).json({
            message: "Utilisateur créé avec succès.",
            utilisateur:sanitizeUser(utilisateur)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Consulter tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const utilisateurs = await usersService.getAllUsers();

        res.status(200).json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Consulter un utilisateur
const getUserById = async (req, res) => {
    try {
        const utilisateur = await usersService.getUserById(
            req.params.matricule
        );

        res.status(200).json(utilisateur);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Modifier un utilisateur
const updateUser = async (req, res) => {
    try {
        const utilisateur = await usersService.updateUser(
            req.params.matricule,
            req.body
        );

        res.status(200).json({
            message: "Utilisateur modifié avec succès.",
            utilisateur:sanitizeUser(utilisateur)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Activer un compte
const activateUser = async (req, res) => {
    try {
        const utilisateur = await usersService.setUserStatus(
            req.params.matricule,
            true
        );

        res.status(200).json({
            message: "Compte activé avec succès.",
            utilisateur:sanitizeUser(utilisateur)
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Désactiver un compte
const deactivateUser = async (req, res) => {
    try {
        const utilisateur = await usersService.setUserStatus(
            req.params.matricule,
            false
        );

        res.status(200).json({
            message: "Compte désactivé avec succès.",
            utilisateur:sanitizeUser(utilisateur)
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
// Réinitialiser le mot de passe
const resetUserPassword = async (req, res) => {
    try {
        await usersService.resetUserPassword(
            req.params.matricule,
            req.body.nouveauMotDePasse
        );

        res.status(200).json({
            message: "Mot de passe réinitialisé avec succès."
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    activateUser,
    deactivateUser,
    resetUserPassword
};