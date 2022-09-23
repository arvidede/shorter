import fs from "fs";
import path from "path";

const file = path.resolve("../../", "dump.txt");

const promisify = async (fn: () => void) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(fn());
    } catch (e: unknown) {
      reject();
    }
  });
};

export class DB<T = string> {
  db: Map<string, T>;
  constructor() {
    this.db = new Map();
    this.load();
  }

  get(key: string) {
    return this.db.get(key);
  }

  set(key: string, value: T) {
    try {
      this.db.set(key, value);
      this.save();
      return true;
    } catch (e: unknown) {
      console.error("Failed to save to db:", e);
      return false;
    }
  }

  has(key: string): boolean {
    return this.db.has(key);
  }

  private async load() {
    return promisify(() => {
      if (fs.existsSync(file)) {
        this.db = new Map(
          JSON.parse(fs.readFileSync(file, { encoding: "utf-8" }))
        );
      }
    });
  }

  private async save() {
    return promisify(() => {
      fs.writeFileSync(file, JSON.stringify(Array.from(this.db.entries())));
    });
  }
}

let db: DB;
export const getDB = () => {
  if (!db) db = new DB();
  return db;
};
