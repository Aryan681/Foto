import { init } from "@instantdb/react";
import schema from "./instantDb.schema";

export const db = init({
  appId: import.meta.env.VITE_INSTANTDB_APP_ID,
  schema, // ✅ This tells InstantDB how to handle 'interactions'
});