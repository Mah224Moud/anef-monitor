Tu es un expert React/Tailwind/Flowbite. Je veux que tu crées une interface mobile-first 
pour afficher les données de mon dossier de titre de séjour français (ANEF).

---

## Stack
- React + Vite
- Tailwind CSS
- Flowbite (composants UI)
- Pas de backend pour l'instant — les données arrivent en props ou via un fetch sur /api/check

---

## Données disponibles (format JSON réel)

### 1. /api/usager/moi
```json
{
  "usager": {
    "nom": "string",
    "prenoms": ["string"],
    "sexe": "M",
    "date_naissance": "1997-08-16T00:00:00+00:00",
    "nationalites": [{ "code": "GIN", "libelle": "guinéenne (rép. de guinée)" }],
    "adresse": { "numero_voie": "2", "voie": "string", "code_postal": "string", "ville": "string" },
    "email": "string",
    "telephone": "string"
  },
  "statut_actuel": {
    "date_debut_validite": "2024-04-11T00:00:00+00:00",
    "date_fin_validite": "2025-04-10T00:00:00+00:00",
    "nature_titre": "CSP",
    "duration": "X ans Y mois",
    "motif_delivrance": "string"
  },
  "blocking": {
    "should_be_blocked": false
  },
  "dossier_en_cours": {
    "has_dossier_en_cours": false,
    "id_dossier_en_cours": null
  }
}
```

### 2. /api/notifications
```json
{
  "_items": [
    {
      "id": "string",
      "type_notification": "string",
      "motif_notification": "string",
      "lu": true,
      "_created": "2024-04-11T00:00:00+00:00",
      "_updated": "2024-04-11T00:00:00+00:00"
    }
  ],
  "_meta": { "page": 1, "per_page": 3, "total": 13 }
}
```

### 3. /api/sejour/historique-droit-sejour
```json
{
  "droits": [
    {
      "date_debut_validite": "2020-01-01T00:00:00+00:00",
      "date_fin_validite": "2021-01-01T00:00:00+00:00",
      "motif_delivrance": "string",
      "nature": "VLS-TS",
      "nature_titre": "CSP",
      "numero": "002",
      "date_delivrance": "2020-01-01T00:00:00+00:00"
    }
  ]
}
```

### 4. /api/sejour/usager/statut/demande_sejour
```json
{
  "statut": "string",
  "etape": "string",
  "date_depot": "2024-01-01T00:00:00+00:00"
}
```

---

## Ce que tu dois créer

### Composants React

**`<Dashboard />`** — composant racine, fetche les 4 endpoints, gère le loading/erreur

**`<StatutCard />`** — carte principale avec :
- Badge coloré selon nature_titre (CSP = bleu, CST = orange, VLS-TS = gris)
- Date de fin de validité en gros avec calcul "expire dans X jours" (rouge si < 30 jours, orange si < 90 jours, vert sinon)
- Indicateur de blocage (alerte rouge si should_be_blocked = true)
- Indicateur dossier en cours (badge vert si has_dossier_en_cours = true)

**`<Notifications />`** — liste des notifications avec :
- Badge rouge pour les non lues
- Icône selon type_notification
- Date formatée en français (ex: "11 avr. 2024")
- Pagination ou "voir tout"

**`<Historique />`** — timeline verticale de tous les titres avec :
- Chaque entrée : nature_titre + numéro + dates début/fin
- Le titre actuel mis en évidence
- Tri du plus récent au plus ancien

**`<RefreshButton />`** — bouton "Vérifier maintenant" qui retrigger le fetch, avec spinner pendant le chargement et timestamp "Dernière vérif : il y a X minutes"

---

## UX rules
- Mobile-first, max-width 480px centré sur desktop
- Toutes les dates ISO doivent être formatées en français : JJ/MM/AAAA ou "11 avr. 2024"
- Skeleton loading sur chaque carte pendant le fetch
- Gestion d'erreur claire si le backend est down
- Pas de défilement horizontal
- Flowbite pour : Badge, Card, Spinner, Alert, Timeline, Button
- Tailwind pour tout le reste

---

## Structure de fichiers attendue

```
src/
  components/
    StatutCard.jsx
    Notifications.jsx
    Historique.jsx
    RefreshButton.jsx
  utils/
    formatDate.js      ← formate les dates ISO en français
    getBadgeColor.js   ← retourne la couleur Tailwind selon nature_titre
  App.jsx              ← importe Dashboard
  Dashboard.jsx        ← logique principale, fetch, state
```

---

## Comportement du fetch

Pour l'instant les données viennent d'un objet JS local (mock) 
— prévoir un flag `USE_MOCK = true` en haut de Dashboard.jsx 
pour basculer facilement vers les vrais appels API plus tard.

Format mock :
```js
const MOCK_DATA = {
  usager: { ... },
  notifications: { ... },
  historique: { ... },
  statut_demande: { ... }
}
```
```

---

## Mono repo ou pas ?

Mono repo. Voici pourquoi et comment :

```
anef-monitor/              ← racine du projet (déjà créé)
  ├── backend/
  │   ├── lib/checker.js   ← ton script Puppeteer actuel
  │   ├── local.js
  │   ├── api/check.js     ← fonction Netlify future
  │   └── package.json     ← puppeteer
  │
  ├── frontend/
  │   ├── src/
  │   │   ├── components/
  │   │   ├── Dashboard.jsx
  │   │   └── App.jsx
  │   ├── package.json     ← react + vite + tailwind + flowbite
  │   └── vite.config.js
  │
  └── README.md
```

Deux `package.json` séparés — le backend a ses dépendances lourdes (Puppeteer), le frontend a les siennes (React). Pas de mélange. Netlify déploie le frontend depuis `/frontend` et les fonctions depuis `/backend/api`.

**Pour démarrer le frontend :**
```bash
cd frontend
npm create vite@latest . -- --template react
npm install flowbite flowbite-react tailwindcss @tailwindcss/vite
```
