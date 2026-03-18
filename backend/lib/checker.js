const puppeteer = require("puppeteer");

const LOGIN_URL =
  "https://sso.anef.dgef.interieur.gouv.fr/auth/realms/anef-usagers/protocol/openid-connect/auth?client_id=anef-usagers&theme=portail-anef&redirect_uri=https%3A%2F%2Fadministration-etrangers-en-france.interieur.gouv.fr%2Fparticuliers%2F%23&response_mode=fragment&response_type=code&scope=openid";
const COMPTE_URL =
  "https://administration-etrangers-en-france.interieur.gouv.fr/particuliers/#/espace-personnel/mon-compte";

const URLS_CIBLES = [
  "/api/usager/moi",
  "/api/notifications/non-lu",
  "/api/notifications",
  "/api/sejour/historique-droit-sejour",
  "/api/sejour/usager/statut/demande_sejour",
];

/**
 * Scrape ANEF data using provided credentials.
 * @param {string} email - Numéro étranger (identifiant)
 * @param {string} password - Mot de passe ANEF
 * @returns {object} - Captured API responses
 */
async function checkANEF(email, password) {
  if (!email || !password) {
    throw new Error("Identifiants manquants");
  }

  const browser = await puppeteer.launch({ 
    headless: true, 
    slowMo: 50,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  const requetes = {};

  page.on("response", async (response) => {
    const url = response.url();
    const contentType = response.headers()["content-type"] || "";

    const estCible = URLS_CIBLES.some((cible) => url.includes(cible));
    if (!estCible || !contentType.includes("application/json")) return;

    try {
      const data = await response.json();
      // Find the most specific matching key (longest match first)
      const matchingKeys = URLS_CIBLES.filter((c) => url.includes(c));
      const cle = matchingKeys.sort((a, b) => b.length - a.length)[0];
      
      // Preserve the response with the most items to avoid overwriting with empty pagination requests
      if (!requetes[cle]) {
        requetes[cle] = data;
      } else if (data._items && requetes[cle]._items) {
        if (data._items.length > requetes[cle]._items.length) {
          requetes[cle] = data;
        }
      } else {
        // Fallback merge for non-array responses
        requetes[cle] = { ...requetes[cle], ...data };
      }

      console.log("Capturé :", cle, "←", url, data._items ? `(${data._items.length} items)` : '');
    } catch (e) {}
  });

  console.log("Ouverture page de connexion SSO...");
  await page.goto(LOGIN_URL, { waitUntil: "networkidle2", timeout: 60000 });

  console.log("Saisie des identifiants...");
  await page.waitForSelector('input[name="username"], input[type="email"]', {
    timeout: 20000,
  });
  await page.type('input[name="username"], input[type="email"]', email, {
    delay: 50,
  });
  await page.type('input[type="password"]', password, { delay: 50 });
  await page.click('input[type="submit"], button[type="submit"]');
  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 });

  console.log("Connecté !");

  console.log("Navigation vers mon-compte...");
  await page.goto(COMPTE_URL, { waitUntil: "networkidle2", timeout: 60000 });

  console.log("Récupération de l'historique complet des notifications...");
  // Trigger an explicit fetch inside the page to capture up to 50 notifications instantly
  await page.evaluate(async () => {
    try {
      await fetch('/api/notifications?per_page=50&page=1');
    } catch (e) {}
  });

  // Wait for API calls to complete
  await new Promise((r) => setTimeout(r, 6000));


  console.log(`${Object.keys(requetes).length}/${URLS_CIBLES.length} URL(s) capturée(s)`);

  // Close the browser automatically
  await browser.close();
  console.log("Navigateur fermé.");

  return requetes;
}

module.exports = { checkANEF };
