const { checkANEF } = require("./lib/checker");
(async () => {
  console.log("Démarrage...\n");
  try {
    const r = await checkANEF();
    console.log(`Terminé. ${r.length} requête(s) capturée(s).`);
  } catch (e) {
    console.error("Erreur: ", e.message);
  }
})();
