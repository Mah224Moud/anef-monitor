import { HiDocumentText, HiClock, HiCheckCircle, HiInboxIn } from "react-icons/hi";
import { formatDate, getRelativeTime } from "../utils/formatDate";

const DemandeSejourCard = ({ demande }) => {
  if (!demande || Object.keys(demande).length === 0 || !demande.statut) {
    return (
      <div className="card border-l-4 border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between opacity-80 fade-in transition-colors" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-300 dark:border-slate-700 transition-colors">
            <HiInboxIn className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 tracking-tight transition-colors">Dossier en préfecture</h3>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-0.5 font-medium transition-colors">Aucune demande en cours pour le moment</p>
          </div>
        </div>
      </div>
    );
  }

  const formatStatut = (statut) => {
    return (statut || '').replace(/_/g, ' ');
  };

  const getStatusColor = (statut) => {
    if (statut === 'A_TRAITER') return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50';
    if (statut === 'EN_ATTENTE_PIECE') return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
    if (statut === 'VALIDEE' || statut === 'CLOTUREE') return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50';
    return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
  };

  return (
    <div className="card fade-in border-t-4 border-amber-500 shadow-lg relative overflow-hidden transition-colors" style={{ animationDelay: '0.3s' }}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl transition-colors" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm border border-amber-200 dark:border-amber-800/50 transition-colors">
            <HiDocumentText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Demande en cours</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize transition-colors">
                {demande.type_demande_sejour?.replace(/_/g, ' ').toLowerCase() || 'Demande de séjour'}
              </p>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors"></span>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors cursor-help" title={formatDate(demande._updated, false, true)}>
                MAJ {getRelativeTime(demande._updated).toLowerCase()}
              </p>
            </div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border self-start shadow-sm transition-colors ${getStatusColor(demande.statut)}`}>
          <HiClock className="w-4 h-4" />
          Statut : {formatStatut(demande.statut)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="rounded-xl p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition-colors">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1 line-clamp-1">N° Demande</p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{demande.numero_demande || '—'}</p>
        </div>
        <div className="rounded-xl p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition-colors">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1 line-clamp-1">Formulaire</p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{demande.formulaire || '—'}</p>
        </div>
        <div className="rounded-xl p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition-colors">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1 line-clamp-1">Date de dépôt</p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{formatDate(demande.date_depot) || '—'}</p>
        </div>
        <div className="rounded-xl p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition-colors">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1 line-clamp-1">Dernière MAJ</p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">
            {formatDate(demande._updated, false, true)}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-4 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition-colors">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1 line-clamp-1">Catégorie Juridique</p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{demande.categorie_juridique || '—'}</p>
        </div>
      </div>
    </div>
  );
};

export default DemandeSejourCard;
