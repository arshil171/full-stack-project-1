import { Inngest } from "inngest";
import { Dbconnect } from "./db.js";
import { userModel } from "../models/User.js";

export const inngest = new Inngest({
  id: "interviewX",
  apiKey: process.env.INNGEST_EVENT_KEY,
});

// Sync user when created
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await Dbconnect();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await userModel.create(newUser);
  }
);

// Delete user from DB
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await Dbconnect();

    const { id } = event.data;

    await userModel.deleteOne({ clerkId: id });
  }
);

export const functions = [syncUser, deleteUserFromDB];
