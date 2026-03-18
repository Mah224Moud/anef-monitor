import { HiCalendar, HiExclamationCircle, HiCheckCircle, HiBadgeCheck, HiLocationMarker, HiIdentification, HiDatabase } from "react-icons/hi";
import { formatDate, getDaysRemaining } from "../utils/formatDate";

const StatutCard = ({ data }) => {
  if (!data || !data.statut_actuel) return null;

  const { usager, statut_actuel, blocking, dossier_en_cours, demande_nat_en_cours, agdref_type_document, date_entree_france, is_know_by_sejour_for_cds, has_demande_nat_with_children_en_cours, fprnsis_resultat } = data;
  const daysRemaining = getDaysRemaining(statut_actuel.date_fin_validite);

  const isExpired = daysRemaining < 0;
  const isUrgent = daysRemaining >= 0 && daysRemaining < 30;
  const isWarning = daysRemaining >= 30 && daysRemaining < 90;

  const statusClass = isExpired || isUrgent ? 'status-danger' : isWarning ? 'status-warning' : 'status-valid';
  const statusLabel = isExpired
    ? 'Expiré'
    : isUrgent ? `Expire dans ${daysRemaining}j`
    : isWarning ? `Expire dans ${daysRemaining}j`
    : `Valide — ${daysRemaining}j restants`;

  const titreLabel = statut_actuel.titre || statut_actuel.nature_titre;

  return (
    <div className="fade-in space-y-4" style={{ animationDelay: '0.1s' }}>
      
      {/* ─── 1. STATUT ACTUEL ─── */}
      <div className="card border-t-4 border-t-blue-500 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 dark:bg-blue-900/30 dark:text-blue-400">
              <HiBadgeCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{titreLabel}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{statut_actuel.motif_delivrance || '—'}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border self-start ${statusClass}`}>
            {isExpired ? <HiExclamationCircle className="w-4 h-4" /> : <HiCheckCircle className="w-4 h-4" />}
            {statusLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <InfoBox label="Nature Titre" value={statut_actuel.nature_titre} />
          <InfoBox label="Durée" value={statut_actuel.duration} />
          <InfoBox label="Début validité" value={formatDate(statut_actuel.date_debut_validite)} />
          <InfoBox label="Fin validité" value={formatDate(statut_actuel.date_fin_validite)} />
          
          <InfoBox label="Réf. réglementaire" value={statut_actuel.num_reference_reglementaire || '—'} />
          <InfoBox label="Motif. réf." value={statut_actuel.motif_reference_reglementaire || '—'} />
          <InfoBox label="Mention réf." value={statut_actuel.mention_reference_reglementaire || '—'} />
          <InfoBox label="Formulaire renouv." value={statut_actuel.code_formulaire_renouvellement || '—'} />
          
          <InfoBox label="Variables Titre" value={statut_actuel.variables_titre || '—'} />
          <InfoBox label="Réf. Actif ?" value={statut_actuel.is_reference_reglementaire_actif ? 'Oui' : 'Non'} />
          <InfoBox label="Est conjoint ?" value={statut_actuel.is_conjoint ? 'Oui' : 'Non'} />
          <InfoBox label="Type doc AGDREF" value={agdref_type_document || '—'} />
        </div>
      </div>

      {/* ─── 2. INFORMATIONS PERSONNELLES (USAGER) ─── */}
      {usager && (
        <div className="card shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <HiIdentification className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            Identité de l'usager
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            <InfoBox label="N° AGDREF" value={usager.identifiant_agdref} highlight />
            <InfoBox label="Sexe" value={usager.sexe === 'M' ? 'Masculin' : usager.sexe === 'F' ? 'Féminin' : usager.sexe} />
            <InfoBox label="Date naissance (exacte?)" value={`${formatDate(usager.date_naissance)} ${usager.date_naissance_approximative ? '(approx)' : ''}`} />
            <InfoBox label="Lieu de naissance" value={`${usager.ville_naissance || '—'} (${usager.pays_naissance?.code || ''})`} />
            
            <InfoBox label="Nationalité" value={usager.nationalites?.[0]?.libelle || '—'} />
            <InfoBox label="Situation familiale" value={usager.situation_familiale || '—'} />
            <InfoBox label="Entrée en France" value={date_entree_france || usager.date_entree_en_france ? formatDate(date_entree_france || usager.date_entree_en_france) : '—'} />
            <InfoBox label="Email" value={usager.email || '—'} />
            
            <InfoBox label="Téléphone" value={usager.telephone || '—'} />
            <InfoBox label="Mdp à changer ?" value={usager.change_password_next_login ? 'Oui' : 'Non'} />
            <InfoBox label="FPRNSIS Résultat" value={usager.fprnsis_resultat ? 'Positif' : 'Négatif (ou null)'} />
            <InfoBox label="FPRNSIS Date" value={usager.fprnsis_resultat_date_consultation ? formatDate(usager.fprnsis_resultat_date_consultation) : '—'} />
          </div>

          {usager.adresse && (usager.adresse.voie || usager.adresse.ville) && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 flex items-start gap-2 border border-slate-100 dark:border-slate-700/50">
              <HiLocationMarker className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Adresse postale</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                  {[usager.adresse.numero_voie, usager.adresse.voie, usager.adresse.code_postal, usager.adresse.ville].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── 3. DOSSIERS ET ALERTES SYSTÈME ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Dossiers en cours */}
        <div className="card shadow-sm flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <HiDatabase className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            Dossiers Séjour & Nationalité
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <InfoBox label="Dossier en cours ?" value={dossier_en_cours?.has_dossier_en_cours ? `Oui (ID: ${dossier_en_cours.id_dossier_en_cours})` : 'Non'} />
            <InfoBox label="Demande Nat. ?" value={demande_nat_en_cours?.has_demande_nat_en_cours ? `Oui (ID: ${demande_nat_en_cours.id_dossier_en_cours})` : 'Non'} />
            <InfoBox label="Nat. avec enfants ?" value={demande_nat_en_cours?.has_demande_nat_with_children_en_cours || has_demande_nat_with_children_en_cours ? 'Oui' : 'Non'} />
            <InfoBox label="Known by SEJOUR CDS?" value={is_know_by_sejour_for_cds ? 'Oui' : 'Non'} />
          </div>
        </div>

        {/* Blocking System */}
        <div className="card shadow-sm flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <HiExclamationCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
            Statut de Blocage (Blocking)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <InfoBox 
              label="Should Be Blocked?" 
              value={blocking?.should_be_blocked ? 'Oui' : 'Non'} 
              highlight={blocking?.should_be_blocked}
            />
            <InfoBox 
              label="TSE Expire / TVE Instr." 
              value={blocking?.tse_expire_tve_instruction ? 'Oui' : 'Non'} 
            />
          </div>
          {blocking?.should_be_blocked && (
            <div className="mt-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-2.5 rounded text-xs font-semibold border border-red-200 dark:border-red-900/50">
              ⚠️ Attention : Le système ANEF indique un blocage de dossier.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

/** Simple info box subcomponent */
const InfoBox = ({ label, value, highlight = false }) => (
  <div className={`rounded-lg p-2.5 transition-colors ${highlight ? 'bg-blue-50/50 border border-blue-200 shadow-sm dark:bg-blue-900/10 dark:border-blue-900/50' : 'bg-slate-50 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-700/50'}`}>
    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1 opacity-80 leading-tight line-clamp-1" title={label}>{label}</p>
    <p className={`text-sm font-semibold truncate ${highlight ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`} title={value}>{value || '—'}</p>
  </div>
);

export default StatutCard;
