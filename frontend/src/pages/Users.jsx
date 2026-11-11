
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useCallback } from "react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
const emptyForm = {
  matricule: "",
  nom: "",
  prenom: "",
  motDePasse: "",
  role: "TECHNICIEN",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message, id: Date.now() });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);      
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      const data = response.data;
      setUsers(Array.isArray(data) ? data : data.users || data.utilisateurs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setSelected(null);
    setError("");
    setModal("create");
  };

  const openEdit = (user) => {
    setSelected(user);
    setForm({
      matricule: user._id || user.matricule,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      motDePasse: "",
    });
    setError("");
    setModal("edit");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (modal === "create") {
        await api.post("/users", form);
      } else {
        await api.put(`/users/${selected._id || selected.matricule}`, {
          nom: form.nom,
          prenom: form.prenom,
          role: form.role,
        });
      }

      setModal("");
showToast(
  "success",
  modal === "create"
    ? "Utilisateur créé avec succès."
    : "Utilisateur modifié avec succès."
);
loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    }
  };

  const toggleStatus = (user) => {
  setConfirmation({
    user,
    action: user.actif ? "deactivate" : "activate",
  });
};

const confirmStatusChange = async () => {
  const { user, action } = confirmation;
  const matricule = user._id || user.matricule;

  try {
    await api.patch(`/users/${matricule}/${action}`);

    setConfirmation(null);
    showToast(
      "success",
      action === "activate"
        ? "Utilisateur activé avec succès."
        : "Utilisateur désactivé avec succès."
    );

    loadUsers();
  } catch (err) {
    setConfirmation(null);
    showToast(
      "error",
      err.response?.data?.message || "Une erreur est survenue."
    );
  }
};

  const openReset = (user) => {
    setSelected(user);
    setNewPassword("");
    setError("");
    setModal("reset");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const matricule = selected._id || selected.matricule;

      await api.patch(`/users/${matricule}/reset-password`, {
        nouveauMotDePasse: newPassword,
      });

      setModal("");
      showToast("success", "Mot de passe réinitialisé avec succès.");    } catch (err) {
      setError(err.response?.data?.message || "Impossible de réinitialiser le mot de passe.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      String(user._id || user.matricule).toLowerCase().includes(value) ||
      user.nom?.toLowerCase().includes(value) ||
      user.prenom?.toLowerCase().includes(value)
    );
  });

  const closeModal = () => {
    setModal("");
    setError("");
  };

  return (
    <div className="users-page">
      <header className="topbar">
        <div>
          <h2>Gestion des utilisateurs</h2>
          <p>Administration des comptes AssetTrack</p>
        </div>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Déconnexion
        </button>
      </header>

      <main className="content">
        <div className="page-heading">
          <div>
            <h1>Utilisateurs</h1>
            <p>Gérez les administrateurs et les techniciens.</p>
          </div>
          <button className="primary-btn" onClick={openCreate}>
            + Ajouter un utilisateur
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Total utilisateurs</span>
            <strong>{users.length}</strong>
          </div>
          <div className="stat-card">
            <span>Actifs</span>
            <strong>{users.filter((u) => u.actif).length}</strong>
          </div>
          <div className="stat-card">
            <span>Techniciens</span>
            <strong>{users.filter((u) => u.role === "TECHNICIEN").length}</strong>
          </div>
        </div>

        <section className="table-card">
          <div className="table-toolbar">
            <h3>Liste des utilisateurs</h3>
            <input
              className="search-input"
              placeholder="Rechercher par matricule ou nom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {error && !modal && <div className="error-message">{error}</div>}

          {loading ? (
            <p className="loading">Chargement...</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Matricule</th>
                    <th>Nom complet</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id || user.matricule}>
                      <td>{user._id || user.matricule}</td>
                      <td>{user.prenom} {user.nom}</td>
                      <td>
                        <span className="role-badge">{user.role}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.actif ? "active" : "inactive"}`}>
                          {user.actif ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="action-btn edit" onClick={() => openEdit(user)}>
                            Modifier
                          </button>
                          <button className="action-btn reset" onClick={() => openReset(user)}>
                            Mot de passe
                          </button>
                          <button
                            className={`action-btn ${user.actif ? "deactivate" : "activate"}`}
                            onClick={() => toggleStatus(user)}
                          >
                            {user.actif ? "Désactiver" : "Activer"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>

            {modal === "reset" ? (
              <>
                <h2>Réinitialiser le mot de passe</h2>
                <p className="subtitle">
                  Utilisateur : {selected?.prenom} {selected?.nom}
                </p>
                <form onSubmit={handleResetPassword}>
                  <label>Nouveau mot de passe</label>
                  <input
                    type="password"
                    minLength="8"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Minimum 8 caractères"
                  />
                  {error && <div className="error-message">{error}</div>}
                  <button className="primary-btn full-btn">Réinitialiser</button>
                </form>
              </>
            ) : (
              <>
                <h2>{modal === "create" ? "Ajouter un utilisateur" : "Modifier l'utilisateur"}</h2>
                <form onSubmit={handleSubmit}>
                  {modal === "create" && (
                    <>
                      <label>Matricule</label>
                      <input
                        value={form.matricule}
                        onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                        pattern="[0-9]+"
                        required
                        placeholder="Exemple : 68124"
                      />
                    </>
                  )}

                  <label>Nom</label>
                  <input
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    required
                  />

                  <label>Prénom</label>
                  <input
                    value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                    required
                  />

                  {modal === "create" && (
                    <>
                      <label>Mot de passe</label>
                      <input
                        type="password"
                        minLength="8"
                        value={form.motDePasse}
                        onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
                        required
                        placeholder="Minimum 8 caractères"
                      />
                    </>
                  )}

                  <label>Rôle</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="TECHNICIEN">Technicien</option>
                    <option value="ADMINISTRATEUR">Administrateur</option>
                  </select>

                  {error && <div className="error-message">{error}</div>}
                  <button className="primary-btn full-btn">
                    {modal === "create" ? "Créer l'utilisateur" : "Enregistrer"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      <Toast toast={toast} onClose={closeToast} />

<ConfirmModal
  open={!!confirmation}
  title={
    confirmation?.action === "deactivate"
      ? "Désactiver cet utilisateur ?"
      : "Activer cet utilisateur ?"
  }
  message={
    confirmation?.action === "deactivate"
      ? "Cet utilisateur ne pourra plus se connecter à AssetTrack."
      : "Cet utilisateur pourra de nouveau accéder à AssetTrack."
  }
  confirmText={
    confirmation?.action === "deactivate" ? "Désactiver" : "Activer"
  }
  danger={confirmation?.action === "deactivate"}
  onConfirm={confirmStatusChange}
  onCancel={() => setConfirmation(null)}
/>
    </div>
  );
}
