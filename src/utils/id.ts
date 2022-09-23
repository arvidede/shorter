import shortId from "shortid";
import { DB } from "./db";

export const generateId = (db: DB): string => {
  const id = shortId();
  if (db.has(id)) return generateId(db);
  return id;
};
