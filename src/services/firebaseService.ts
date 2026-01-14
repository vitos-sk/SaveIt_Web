import { ref, get, remove } from "firebase/database";
import { database } from "../firebase/config";
import { UserData, Memory } from "../types";

export async function getUserData(telegramId: number): Promise<UserData | null> {
  try {
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const usersData = snapshot.val();
      // Ищем пользователя по telegram_id
      for (const [key, userData] of Object.entries(usersData)) {
        if ((userData as any).telegram_id === telegramId) {
          return {
            userId: key,
            ...(userData as any),
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function getUserMemories(telegramId: number): Promise<Memory[]> {
  try {
    // Новая структура: savedItems/{telegramId}/{itemId}
    const savedRef = ref(database, `savedItems/${telegramId}`);
    const snapshot = await get(savedRef);

    if (snapshot.exists()) {
      const itemsData = snapshot.val();
      return Object.entries(itemsData).map(([itemId, item]: [string, any]) => ({
        id: itemId,
        telegramId,
        // category = пользовательская категория (idea/task/...) для фильтра и бейджей
        category: item.category || "note",
        // type/mediaType = тип вложения (photo/document/...) для отображения медиа
        type: item.type || item.mediaType || "other",
        content: item.url || "",
        title: item.title || "",
        createdAt: item.createdAt || item.created_at || Date.now(),
        chatId: item.chatId,
        messageId: item.messageId,
        mediaType: item.mediaType,
        mediaFileId: item.mediaFileId,
        ...item,
      })) as Memory[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching user savedItems:", error);
    throw error;
  }
}

export async function getAllUserData(): Promise<Record<string, UserData>> {
  try {
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error("Error fetching all user data:", error);
    throw error;
  }
}

export async function getDatabaseStructure(): Promise<any> {
  try {
    const rootRef = ref(database);
    const snapshot = await get(rootRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching database structure:", error);
    throw error;
  }
}

export async function deleteLink(linkId: string): Promise<void> {
  try {
    const linkRef = ref(database, `links/${linkId}`);
    await remove(linkRef);
  } catch (error) {
    console.error("Error deleting link:", error);
    throw error;
  }
}

export async function deleteSavedItem(telegramId: number, itemId: string): Promise<void> {
  try {
    const itemRef = ref(database, `savedItems/${telegramId}/${itemId}`);
    await remove(itemRef);
  } catch (error) {
    console.error("Error deleting savedItem:", error);
    throw error;
  }
}
