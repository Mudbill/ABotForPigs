import { Client, Message, PermissionsBitField } from "discord.js";
import { Arguments, Options } from "yargs-parser";

declare global {
  type Command = {
    alias: string;
    permission: bigint;
    argOptions?: Options;
    exec: (message: Message, argv: Arguments) => Promise<any> | any;
  };

  type Listener = (client: Client) => Promise<void> | void;

  type Phrase = {
    serverId: string;
    trigger: string;
    chance: number;
    reply: string;
    channels?: Array<string>;
    blacklist?: boolean;
    flash?: boolean;
  };
}

export {};
