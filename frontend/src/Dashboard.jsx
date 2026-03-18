import { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";
import { HiShieldCheck, HiOutlineLogout } from "react-icons/hi";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { getRelativeTime } from "./utils/formatDate";
import StatutCard from "./components/StatutCard";
import DemandeSejourCard from "./components/DemandeSejourCard";
import Notifications from "./components/Notifications";
import Historique from "./components/Historique";
import ThemeToggle from "./components/ThemeToggle";

const Dashboard = ({ onLogout }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    // Écoute en temps réel du document 'latest' dans la collection 'anef_data'
    const docRef = doc(db, "anef_data", "latest");

    console.log("Connexion à Firebase en cours...");

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        setData(firestoreData);

        let updateTime = new Date();
        if (firestoreData.last_updated && firestoreData.last_updated.toDate) {
          updateTime = firestoreData.last_updated.toDate();
        }

        setLastRefresh(updateTime);
        setError(null);
      } else {
        setError("Aucune donnée ANEF trouvée dans la base. Le robot n'a peut-être pas encore tourné.");
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore error:", err);
      setError("Erreur de connexion à Firebase. Assurez-vous que vos variables d'environnement sont correctes.");
      setLoading(false);
    });

    // Nettoyage à la destruction du composant
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors z-[9999] p-6 text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse tracking-wide uppercase">
          Vérification en cours…
        </p>
      </div>
    );
  }

  // Si pas de data, on affiche l'erreur
  if (!data && error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl p-6 text-sm font-medium text-red-700 dark:text-red-400 max-w-lg text-center shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  const usager = data?.usager_info?.usager || {};
  const displayName = usager.prenoms?.[0] || '';
  const displayNom = usager.nom && usager.nom !== '-' ? usager.nom : '';
  const nationalite = usager.nationalites?.[0]?.libelle || '';

  return (
    <div className="min-h-screen flex flex-col transition-colors bg-slate-50 dark:bg-slate-900">
      {/* ─── Top Nav ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="container-app flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <HiShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            <span className="font-bold text-base tracking-tight dark:text-white">ANEF Monitor</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle className="cursor-pointer" />

            <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="w-8 h-8 bg-slate-900 dark:bg-slate-800 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700">
                {displayName[0] || '?'}{displayNom[0] || ''}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">{displayName}</span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
              title="Déconnexion"
            >
              <HiOutlineLogout className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <main className="flex-1 container-app py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 fade-in">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Bonjour{displayName ? `, ${displayName}` : ''} 👋
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Voici le récapitulatif de votre situation administrative.
              </p>
              <div className="flex items-center gap-3">
                {usager.identifiant_agdref && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 shadow-sm transition-colors">
                    AGDREF : {usager.identifiant_agdref}
                  </span>
                )}
                {nationalite && <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider transition-colors">{nationalite}</span>}
              </div>
            </div>
          </div>
          {lastRefresh && (
            <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/30 shadow-sm self-start sm:self-auto transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Mis à jour {getRelativeTime(lastRefresh)} ({lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl p-4 text-sm font-medium text-red-700 dark:text-red-400 mb-6 shadow-sm transition-colors">
            {error}
          </div>
        )}

        {/* ─── Cards Layout ─── */}
        <div className="flex flex-col gap-6">
          <DemandeSejourCard demande={data.demande_sejour} />
          <StatutCard data={data.usager_info} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Notifications notifications={data.notifications} nonLuCount={data.notifications_non_lu?._meta?.total || 0} />
          <Historique droits={data.historique?.droits} />
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-100 dark:border-slate-800 py-10 transition-colors bg-white/30 dark:bg-slate-900/30">
        <div className="container-app text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-widest uppercase">
            ANEF MONITOR • DONNÉES SYNCHRONISÉES DEPUIS LE PORTAIL OFFICIEL
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
