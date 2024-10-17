import { Client, Message } from "discord.js";
import { Arguments, Options } from "yargs-parser";

export type Command = {
  alias: string;
  permission: bigint;
  argOptions?: Options;
  exec: (message: Message, argv: Arguments) => Promise<any> | any;
};

export type Service = (client: Client) => Promise<void>;

export type Listener = (client: Client) => Promise<void> | void;
