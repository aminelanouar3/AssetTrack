const authService = require("./auth.service");

const login = async (req, res) => {
    try {
        const { matricule, motDePasse } = req.body;

        if (!matricule || !motDePasse) {
            return res.status(400).json({
                message: "Le matricule et le mot de passe sont obligatoires."
            });
        }

        const result = await authService.login(matricule, motDePasse);

        return res.status(200).json({
            message: "Connexion réussie.",
            ...result
        });

    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};

module.exports = { login };