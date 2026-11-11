
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [matricule, setMatricule] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        matricule,
        motDePasse,
      });

      const data = response.data;
      const user = data.utilisateur || data.user;

      if (!data.token || !user) {
        throw new Error("Réponse invalide du serveur.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "ADMINISTRATEUR") {
        navigate("/users");
      } else if (user.role === "TECHNICIEN") {
        navigate("/dashboard");
      } else {
        localStorage.clear();
        setError("Rôle utilisateur non reconnu.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Matricule ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">A</div>
          <h1>AssetTrack</h1>
          <p>Gestion du parc informatique</p>
        </div>

        <h2>Bienvenue</h2>
        <p className="subtitle">Connectez-vous à votre espace.</p>

        <form onSubmit={handleLogin}>
          <label>Matricule</label>
          <input
            type="text"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            placeholder="Votre matricule"
            required
          />

          <label>Mot de passe</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="Votre mot de passe"
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button className="primary-btn login-btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="login-footer">AssetTrack © 2026</p>
      </div>
    </div>
  );
}
