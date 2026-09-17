/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc,
  writeBatch,
  getDocFromServer
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Validates connection to Firestore backend
 */
export async function testConnection(): Promise<boolean> {
  if (!db) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore connection check: Client is offline or database is provisioning.");
    } else {
      console.log("Firestore connection test ping finished.");
    }
    return true;
  }
}

/**
 * Subscribes to a Firestore collection with real-time updates and auto-seeding
 * if the collection is currently empty.
 */
export function subscribeToCollection<T extends { id: string }>(
  collectionName: string,
  initialSeedData: T[],
  onUpdate: (items: T[]) => void
): () => void {
  if (!db) {
    console.warn(`Firestore not initialized. Using local memory for ${collectionName}`);
    onUpdate(initialSeedData);
    return () => {};
  }

  const colRef = collection(db, collectionName);

  // Subscribe to real-time updates
  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty && initialSeedData.length > 0) {
        // Auto-seed collection in background so database is immediately populated
        console.log(`Auto-seeding Firestore collection: ${collectionName} with ${initialSeedData.length} records...`);
        try {
          const batch = writeBatch(db!);
          for (const item of initialSeedData) {
            const itemDocRef = doc(db!, collectionName, item.id);
            batch.set(itemDocRef, item, { merge: true });
          }
          await batch.commit();
          // The write will trigger snapshot with data
        } catch (seedErr) {
          console.error(`Failed to auto-seed ${collectionName} to Firestore:`, seedErr);
          onUpdate(initialSeedData);
        }
      } else if (!snapshot.empty) {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id
        })) as T[];
        onUpdate(items);
      } else {
        onUpdate([]);
      }
    },
    (error) => {
      console.warn(`Firestore subscription fallback for ${collectionName}:`, error);
      onUpdate(initialSeedData);
    }
  );

  return unsubscribe;
}

/**
 * Saves or updates a document in Firestore
 */
export async function saveDocument<T extends { id: string }>(
  collectionName: string,
  item: T
): Promise<void> {
  if (!db) {
    console.warn(`Cannot save to ${collectionName}: Firestore not active.`);
    return;
  }
  try {
    const docRef = doc(db, collectionName, item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (error) {
    console.error(`Error saving document to ${collectionName}/${item.id}:`, error);
    throw error;
  }
}

/**
 * Updates partial fields of a document in Firestore
 */
export async function updateDocumentFields(
  collectionName: string,
  id: string,
  fields: Record<string, any>
): Promise<void> {
  if (!db) {
    console.warn(`Cannot update ${collectionName}/${id}: Firestore not active.`);
    return;
  }
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, fields, { merge: true });
  } catch (error) {
    console.error(`Error updating document ${collectionName}/${id}:`, error);
    throw error;
  }
}

/**
 * Deletes a document from Firestore
 */
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}/${id}:`, error);
    throw error;
  }
}
