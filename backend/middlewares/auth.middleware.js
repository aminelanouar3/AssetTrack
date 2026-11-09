const jwt = require("jsonwebtoken");
const Utilisateur = require("../modules/auth/auth.model");

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Accès refusé. Token manquant."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const utilisateur = await Utilisateur.findById(decoded.matricule);

        if (!utilisateur || !utilisateur.actif) {
            return res.status(401).json({
                message: "Compte inexistant ou désactivé."
            });
        }

        req.utilisateur = {
            matricule: utilisateur._id,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            role: utilisateur.role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token invalide ou expiré."
        });
    }
};

module.exports = verifyToken;