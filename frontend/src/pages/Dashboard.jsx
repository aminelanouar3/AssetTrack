
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="users-page">
      <header className="topbar">
        <div>
          <h2>AssetTrack</h2>
          <p>Espace technicien</p>
        </div>
        <button className="logout-btn" onClick={logout}>
          Déconnexion
        </button>
      </header>

      <main className="content">
        <h1>Bienvenue, {user.prenom} {user.nom}</h1>
        <p className="subtitle">
          Vous êtes connecté avec le rôle Technicien.
        </p>

        <div className="stat-card" style={{ marginTop: 25 }}>
          <strong>Votre espace de travail</strong>
          <p style={{ marginTop: 10, color: "#8290a5" }}>
            Les fonctionnalités de gestion du matériel seront disponibles ici.
          </p>
        </div>
      </main>
    </div>
  );
}
