import {StreamChat} from "stream-chat"
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.log("Stream Api key or Secret is missing")
}

export const chatClient = StreamChat.getInstance(apiKey,apiSecret)

export const upsertStreamUser = async (userData) => {
  try {
    const response = await chatClient.upsertUser(userData);
    console.log("Stream user upserted successfully", userData);
    return response;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
    throw error;
  }
};


export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully", userId);
    return { id: userId, deleted: true };
  } catch (error) {
    console.error("Error deleting Stream user:", error);
    throw error;
  }
};


// todo: add another method