import { CreateTaskData } from "@/types";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  OAuthProvider,
  Permission,
  Query,
  Role,
  Storage,
} from "react-native-appwrite";

export const config = {
  platform: "com.delani.tasker",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  taskId: process.env.EXPO_PUBLIC_APPWRITE_TASK_TABLE_ID,
  tagId: process.env.EXPO_PUBLIC_APPWRITE_TAG_TABLE_ID,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_TASK_IMAGES_BUCKET_ID,
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const login = async () => {
  try {
    const redirectUri = Linking.createURL("/");
    const res = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!res) throw new Error("failed to login");
    const browserResult = await openAuthSessionAsync(
      res?.toString(),
      redirectUri
    );
    if (browserResult?.type !== "success") throw new Error("failed to login");
    const url = new URL(browserResult.url);
    const secret = url?.searchParams?.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("failed to login");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("failed to login");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const logout = async () => {
  try {
    const res = await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await account.get();
    if (res && typeof res.$id === "string" && res.$id.length > 0) {
      const userAvatar = await avatar.getInitials(res?.name);
      return { ...res, avatar: userAvatar };
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserTasks = async ({
  userId,
}: {
  userId: string | undefined;
}) => {
  if (!userId) return [];
  try {
    const res = await databases?.listDocuments(
      config?.databaseId!,
      config?.taskId!,
      [Query.equal("userId", userId)],
    );
    return res?.documents;
  } catch (error) {
    console.error(error);
  }
};

export const getSingleTask = async ({ taskId }: { taskId: string }) => {
  if (!taskId) return [];
  try {
    const res = await databases?.getDocument(
      config?.databaseId!,
      config?.taskId!,
      taskId,
      [Query.select(["*"]), Query.select(["tagId.tagName", "tagId.$id", "tagId.description"])]
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const uploadFile = async (
  fileUri: string,
  mimeType: string,
  userId: string
): Promise<string | null> => {
  if (!config.bucketId) {
    console.error("Appwrite bucket ID is not configured.");
    return null;
  }

  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const file = {
      uri: fileUri,
      name: fileUri.split("/").pop() || "image",
      type: mimeType,
      size: 10,
    };

    const uploadedFile = await storage.createFile(
      config.bucketId,
      ID.unique(),
      file,
      [Permission.delete(Role.user(userId))]
    );

    return uploadedFile.$id;
  } catch (error) {
    console.error("Error uploading file to Appwrite Storage:", error);
    return null;
  }
};

export const getFileUrl = (fileId: string): string => {
  if (!config.bucketId) {
    console.error("Appwrite bucket ID is not configured.");
    return "";
  }
  return `${config.endpoint}/storage/buckets/${config.bucketId}/files/${fileId}/view?project=${config.projectId}`;
};

export const createTask = async (task: CreateTaskData) => {
  try {
    if (!task) return false;

    const payload = {
      ...task,
      imageUri: task.imageUri ? getFileUrl(task.imageUri) : null,
    };

    const res = await databases?.createDocument(
      config?.databaseId!,
      config?.taskId!,
      ID.unique(),
      payload
    );

    return true;
  } catch (error) {
    console.error("Error creating task document:", error);
    return false;
  }
};

export const updateTask = async (taskId: string, task: CreateTaskData) => {
  try {
    if (!task || !taskId) return false;

    const res = await databases?.updateDocument(
      config?.databaseId!,
      config?.taskId!,
      taskId,
      task
    );

    return true;
  } catch (error) {
    console.error("Error creating task document:", error);
    return false;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    if (!taskId) return false;

    const res = await databases?.updateDocument(
      config?.databaseId!,
      config?.taskId!,
      taskId
    );

    return true;
  } catch (error) {
    console.error("Error creating task document:", error);
    return false;
  }
};

export const getTags = async () => {
  try {
    const res = await databases?.listDocuments(
      config?.databaseId!,
      config?.tagId!
    );
    return res?.documents;
  } catch (error) {
    console.error(error);
  }
};
