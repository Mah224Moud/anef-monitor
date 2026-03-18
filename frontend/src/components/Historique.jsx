import { HiCalendar, HiDocumentText } from "react-icons/hi";
import { formatDate } from "../utils/formatDate";

const Historique = ({ droits }) => {
  if (!droits || !Array.isArray(droits) || droits.length === 0) return null;

  // Sort by date (most recent first)
  const sortedDroits = [...droits].sort((a, b) =>
    new Date(b.date_debut_validite) - new Date(a.date_debut_validite)
  );

  return (
    <div className="card fade-in transition-colors" style={{ animationDelay: '0.3s' }}>
      <h3 className="text-base font-bold tracking-tight mb-5 text-slate-900 dark:text-white transition-colors">Historique des titres</h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700 transition-colors"></div>

        <ul className="space-y-6">
          {sortedDroits.map((droit, index) => {
            const isCurrent = index === 0;
            // Use nature_titre if available, fallback to nature
            const typeLabel = droit.nature_titre || droit.nature || '—';
            const isVisa = droit.nature === 'VLS-TS';
            const isRecepisse = droit.nature?.toLowerCase().includes('récépissé');
            const originLabel = droit.demande_origine?._cls?.replace('Demande', '') || null;

            return (
              <li key={(droit.numero || '') + index} className="relative flex gap-5 pl-1">
                {/* Dot */}
                <div className={`relative z-10 mt-0.5 w-[10px] h-[10px] rounded-full border-2 flex-shrink-0 transition-colors ${isCurrent ? 'bg-blue-600 border-blue-600 ring-4 ring-blue-100 dark:ring-blue-900' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}></div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1 transition-colors">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{typeLabel}</span>

                    {droit.numero && (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">N° {droit.numero}</span>
                    )}

                    {isCurrent && (
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full transition-colors">actuel</span>
                    )}

                    {isVisa && (
                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full transition-colors">Visa</span>
                    )}

                    {isRecepisse && (
                      <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded-full transition-colors">Récépissé</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1 transition-colors">
                    <HiCalendar className="w-3.5 h-3.5" />
                    <span>{formatDate(droit.date_debut_validite)} → {formatDate(droit.date_fin_validite)}</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{droit.motif_delivrance || "—"}</p>

                  {/* Extra API info */}
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 transition-colors">
                    {droit.date_delivrance && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        Délivré le {formatDate(droit.date_delivrance, true)}
                      </span>
                    )}
                    {originLabel && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <HiDocumentText className="w-3 h-3" />
                        Origine : {originLabel}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Historique;
