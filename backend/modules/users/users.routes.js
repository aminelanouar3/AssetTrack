const express = require("express");
const router = express.Router();

const usersController = require("./users.controller");

const verifyToken = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

// Toutes les routes nécessitent une authentification et le rôle ADMINISTRATEUR
router.use(verifyToken, authorizeRoles("ADMINISTRATEUR"));

// Créer un utilisateur
router.post("/", usersController.createUser);

// Consulter tous les utilisateurs
router.get("/", usersController.getAllUsers);

// Consulter un utilisateur
router.get("/:matricule", usersController.getUserById);

// Modifier un utilisateur
router.put("/:matricule", usersController.updateUser);

// Activer un compte
router.patch("/:matricule/activate", usersController.activateUser);

// Désactiver un compte
router.patch("/:matricule/deactivate", usersController.deactivateUser);

module.exports = router;