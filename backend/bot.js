require('dotenv').config();
const admin = require('firebase-admin');
const { checkANEF } = require('./lib/checker');

// Initialisation de Firebase via la variable d'environnement (Secret GitHub)
const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!rawServiceAccount) {
  console.error("ERREUR CRITIQUE : Variable d'environnement FIREBASE_SERVICE_ACCOUNT manquante.");
  process.exit(1);
}

let serviceAccount;
try {
  // On teste si c'est du JSON pur
  serviceAccount = JSON.parse(rawServiceAccount);
} catch (e) {
  // Sinon on suppose que c'est encodé en base64 (plus malin pour GitHub Actions)
  serviceAccount = JSON.parse(Buffer.from(rawServiceAccount, 'base64').toString('utf-8'));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function runScraper() {
  const id = process.env.ANEF_ID;
  const password = process.env.ANEF_PASSWORD;
  
  if (!id || !password) {
    console.error("ERREUR CRITIQUE : Identifiants ANEF manquants (ANEF_ID, ANEF_PASSWORD).");
    process.exit(1);
  }

  try {
    console.log("🚀 Démarrage du robot de scraping ANEF...");
    const rawData = await checkANEF(id, password);
    
    // Structuration propre du JSON
    const result = {
      usager_info: rawData["/api/usager/moi"] || {},
      notifications: rawData["/api/notifications"] || { _items: [], _meta: { total: 0 } },
      notifications_non_lu: rawData["/api/notifications/non-lu"] || { _items: [], _meta: { total: 0 } },
      historique: rawData["/api/sejour/historique-droit-sejour"] || { droits: [] },
      demande_sejour: rawData["/api/sejour/usager/statut/demande_sejour"] || {},
      last_updated: admin.firestore.FieldValue.serverTimestamp() // Timestamp Firebase natif
    };
    
    console.log("🔥 Enregistrement dans Firebase (collection: anef_data, document: latest)...");
    await db.collection("anef_data").doc("latest").set(result);
    
    console.log("✅ Mise à jour réussie avec succès !");
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Erreur durant le scraping :", error);
    process.exit(1);
  }
}

runScraper();
