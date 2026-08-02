const crypto = require('crypto');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { levelFromXp, achievementsForLabCount } = require('./gamification');

const db = () => admin.firestore();

function sha256(input) {
  return crypto.createHash('sha256').update(input.trim().toLowerCase()).digest('hex');
}

function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

exports.submitFlag = onCall({ region: 'us-central1' }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'You must be logged in to submit a flag.');
  }

  const { labId, flag } = request.data || {};
  if (!labId || typeof flag !== 'string' || !flag.trim()) {
    throw new HttpsError('invalid-argument', 'labId and flag are required.');
  }

  const firestore = db();
  const [flagSnap, labSnap, userSnap] = await Promise.all([
    firestore.doc(`labFlags/${labId}`).get(),
    firestore.doc(`labs/${labId}`).get(),
    firestore.doc(`users/${uid}`).get(),
  ]);

  if (!flagSnap.exists || !labSnap.exists) {
    throw new HttpsError('not-found', 'This lab does not exist.');
  }
  if (!userSnap.exists) {
    throw new HttpsError('not-found', 'User profile not found.');
  }

  const flagData = flagSnap.data();
  const labData = labSnap.data();
  const userData = userSnap.data();

  const correct = safeEqual(sha256(flag), flagData.hash);
  const alreadySolved = (userData.completedLabs || []).includes(labId);

  // Always log the attempt for the user's own history / anti-abuse.
  await firestore.collection('submissions').add({
    uid,
    labId,
    correct,
    submittedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (!correct) {
    return { correct: false, alreadySolved: false, xpAwarded: 0, newXp: userData.xp || 0, newCoins: userData.coins || 0, unlockedAchievements: [] };
  }

  if (alreadySolved) {
    return {
      correct: true,
      alreadySolved: true,
      xpAwarded: 0,
      newXp: userData.xp || 0,
      newCoins: userData.coins || 0,
      unlockedAchievements: [],
    };
  }

  const xpAwarded = labData.xp || 0;
  const coinsAwarded = Math.round(xpAwarded / 5);
  const newXp = (userData.xp || 0) + xpAwarded;
  const newCoins = (userData.coins || 0) + coinsAwarded;
  const newLevel = levelFromXp(newXp);
  const newCompletedLabs = [...(userData.completedLabs || []), labId];

  const priorAchievements = new Set(userData.achievements || []);
  const earnedFromCount = achievementsForLabCount(newCompletedLabs.length);
  const unlockedAchievements = earnedFromCount.filter((a) => !priorAchievements.has(a));
  const newAchievements = [...(userData.achievements || []), ...unlockedAchievements];

  await firestore.doc(`users/${uid}`).update({
    xp: newXp,
    coins: newCoins,
    level: newLevel,
    completedLabs: admin.firestore.FieldValue.arrayUnion(labId),
    achievements: newAchievements,
    lastLogin: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    correct: true,
    alreadySolved: false,
    xpAwarded,
    newXp,
    newCoins,
    unlockedAchievements,
  };
});
