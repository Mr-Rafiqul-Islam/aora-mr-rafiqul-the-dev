import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.mr-rafiqulthedev.aora",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
  videoCollectionId: process.env.EXPO_PUBLIC_APPWRITE_VIDEO_COLLECTION_ID,
  storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID,
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        username,
        email,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    throw new Error(error);
  }
};

// Function to check if there is an active session

export const checkActiveSession = async () => {
  try {
    const session = await account.getSession('current'); // Get the current session
    return session !== null; // Return true if there is an active session
  } catch (error) {
    // If there's an error (e.g., no active session), handle it appropriately
    if (error.code === 401) {
      return false; // No active session
    }
    throw error; // Re-throw other unexpected errors
  }
};


// Function to delete all sessions for the current user

export const deleteSessions = async () => {
  try {
    // Get the list of all sessions
    const sessions = await account.listSessions();

    // Delete each session
    await Promise.all(
      sessions.sessions.map(async (session) => {
        await account.deleteSession(session.$id);
      })
    );

    console.log('All sessions deleted successfully');
  } catch (error) {
    console.error('Error deleting sessions:', error.message);
    throw error; // Re-throw the error for further handling
  }
};