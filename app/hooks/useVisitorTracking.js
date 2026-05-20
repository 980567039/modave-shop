import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';

// Initialize Firebase app here if not done elsewhere in your app

export async function trackVisitor(userId) {
  if (!userId) {
    console.error("userId is required");
    return;
  }

  const db = getFirestore();
  const isNewVisitor = !(await checkExistingVisitor(userId));

  const visitorRef = doc(db, 'visitors', userId);
  const visitorDoc = await getDoc(visitorRef);

  if (visitorDoc.exists()) {
    // Existing visitor
    await updateDoc(visitorRef, {
      lastVisit: new Date().toISOString(),
      visitCount: increment(1)
    });
  } else {
    // New visitor
    await setDoc(visitorRef, {
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      visitCount: 1
    });
  }

  // Update total visitor counts
  const statsRef = doc(db, 'visitorStats', 'overall');
  const statsDoc = await getDoc(statsRef);

  if (statsDoc.exists()) {
    await updateDoc(statsRef, {
      uniqueVisitors: increment(isNewVisitor ? 1 : 0),
      newVisitors: increment(isNewVisitor ? 1 : 0)
    });
  } else {
    await setDoc(statsRef, {
      uniqueVisitors: isNewVisitor ? 1 : 0,
      newVisitors: isNewVisitor ? 1 : 0
    });
  }
}

async function checkExistingVisitor(userId) {
  const db = getFirestore();
  const visitorRef = doc(db, 'visitors', userId);
  const visitorDoc = await getDoc(visitorRef);
  return visitorDoc.exists();
}

export async function getVisitorStats() {
  const db = getFirestore();
  const statsRef = doc(db, 'visitorStats', 'overall');
  const statsDoc = await getDoc(statsRef);
  return statsDoc.exists() ? statsDoc.data() : { uniqueVisitors: 0, newVisitors: 0 };
}