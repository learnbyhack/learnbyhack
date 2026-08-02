/**
 * Seeds the `labs` (public metadata) and `labFlags` (private hash) collections
 * so that the submitFlag Cloud Function has something to check against.
 *
 * Usage:
 *   cd functions
 *   npm install
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node seed/seedLabFlags.js
 *
 * Or, if you're logged in with `firebase login` and have the right project
 * selected, `firebase login:ci` credentials also work via applicationDefault().
 */
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

function sha256(input) {
  return crypto.createHash('sha256').update(input.trim().toLowerCase()).digest('hex');
}

// id + xp must match client/src/data/labs.ts exactly.
// The `flag` value here is what a solver needs to submit — change these to
// whatever your real lab environments expect.
const LABS = [
  { id: 'lab-sqli-login', xp: 100, flag: 'LBH{s0_th4ts_h0w_y0u_1n}' },
  { id: 'lab-xss-comments', xp: 100, flag: 'LBH{alert_1_wasnt_enough}' },
  { id: 'lab-idor-invoices', xp: 200, flag: 'LBH{just_change_the_number}' },
  { id: 'lab-ssrf-thumbnail', xp: 220, flag: 'LBH{metadata_service_says_hi}' },
  { id: 'lab-priv-esc-cron', xp: 250, flag: 'LBH{r00t_via_cr0ntab}' },
  { id: 'lab-jwt-alg-none', xp: 320, flag: 'LBH{alg_none_strikes_again}' },
  { id: 'lab-buffer-overflow-classic', xp: 380, flag: 'LBH{st4ck_sm4shed_cl34n}' },
  { id: 'lab-forensics-pcap', xp: 230, flag: 'LBH{f0ll0w_th4t_stre4m}' },
  { id: 'lab-osint-username', xp: 120, flag: 'LBH{r3used_us3rn4mes_l3ak}' },
  { id: 'lab-cloud-bucket', xp: 140, flag: 'LBH{bucket_wasnt_s0_privat3}' },
  { id: 'lab-re-keygen', xp: 500, flag: 'LBH{r3vers3d_th3_ch3ck}' },
  { id: 'lab-crypto-padding', xp: 350, flag: 'LBH{p4dding_0racle_p0pped}' },
];

async function run() {
  const batch = db.batch();
  for (const lab of LABS) {
    batch.set(db.doc(`labs/${lab.id}`), { xp: lab.xp }, { merge: true });
    batch.set(db.doc(`labFlags/${lab.id}`), { hash: sha256(lab.flag) });
  }
  await batch.commit();
  console.log(`Seeded ${LABS.length} lab flag hashes.`);
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
