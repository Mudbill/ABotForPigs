import Datastore from "nedb-promises";
import botConfig from "./config/bot.config";
import { logger } from "./util/log";

logger.info("Creating database instance");

export const db = Datastore.create(botConfig.database);
db.load();

export async function getPhrases() {
  return await db.find<Phrase>({ type: "phrase" });
}

export async function addPhrase(data: Phrase) {
  return await db.insert({ type: "phrase", ...data });
}

export async function removePhrase(_id: string, serverId: string) {
  return await db.remove({ _id, serverId }, {});
}
