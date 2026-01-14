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
    // Сначала находим user_id по telegram_id
    const usersRef = ref(database, "users");
    const usersSnapshot = await get(usersRef);

    let userKey: string | null = null;
    if (usersSnapshot.exists()) {
      const usersData = usersSnapshot.val();
      // Ищем пользователя по telegram_id
      for (const [key, userData] of Object.entries(usersData)) {
        if ((userData as any).telegram_id === telegramId) {
          userKey = key;
          break;
        }
      }
    }

    if (!userKey) {
      return [];
    }

    // Получаем все links из корня
    const linksRef = ref(database, "links");
    const linksSnapshot = await get(linksRef);

    if (linksSnapshot.exists()) {
      const linksData = linksSnapshot.val();
      // Фильтруем links по user_id и преобразуем в массив
      return Object.entries(linksData)
        .filter(([, link]: [string, any]) => link.user_id === userKey)
        .map(([linkId, link]: [string, any]) => ({
          id: linkId,
          type: link.content_type || "note",
          content: link.url || "",
          title: link.title || "",
          createdAt: link.created_at || Date.now(),
          url: link.url,
          content_type: link.content_type,
          ...link,
        })) as Memory[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching user links:", error);
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
