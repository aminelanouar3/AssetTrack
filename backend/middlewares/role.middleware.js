const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!req.utilisateur) {
            return res.status(401).json({
                message: "Authentification requise."
            });
        }

        if (!roles.includes(req.utilisateur.role)) {
            return res.status(403).json({
                message: "Accès interdit. Permissions insuffisantes."
            });
        }

        next();
    };
};

module.exports = authorizeRoles;