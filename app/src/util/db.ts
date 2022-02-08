import { Datastore } from "nedb-async-await";
import { databaseFile } from "../../config";
import { console } from "../util/log";

console.info(`Creating database instance...`);
const db = Datastore({
  autoload: true,
  filename: databaseFile,
});

export async function getPhrases() {
  return await db.find({ type: "phrase" });
}

export async function addPhrase(data: {
  trigger: string;
  chance: number;
  reply: string;
}) {
  return await db.insert({ type: "phrase", ...data });
}

export async function removePhrase(_id: string) {
  return await db.remove({ _id });
}

export default db;
