import { openDB } from 'idb';

const DB_NAME = 'chat-db';
const STORE_NAME = 'messages';

export async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveMessages(sessionId: string, messages: any[]) {
  const db = await getDb();
  await db.put(STORE_NAME, messages, sessionId);
}

export async function loadMessages(sessionId: string) {
  const db = await getDb();
  return (await db.get(STORE_NAME, sessionId)) || [];
}

export async function clearMessages(sessionId: string) {
  const db = await getDb();
  await db.delete(STORE_NAME, sessionId);
}
