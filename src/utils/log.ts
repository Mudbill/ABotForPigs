import chalk from "chalk";
import { Message } from "discord.js";

const logger = {
  info: (msg: any, ...obj: any) => {
    console.info(`${chalk.greenBright("[INFO]")}`, msg, ...obj);
  },
  warn: (msg: any, ...obj: any) => {
    console.error(`${chalk.yellowBright("[WARN]")}`, msg, chalk.red(...obj));
  },
  error: (msg: any, ...obj: any) => {
    console.error(`${chalk.redBright("[ERROR]")}`, msg, chalk.red(...obj));
  },
  fatal: (msg: any, ...obj: any) => {
    console.error(`${chalk.redBright("[FATAL]")}`, msg, chalk.red(...obj));
  },
};

const channel = {
  info: (message: Message, text: any) => {
    message.channel.isSendable() && message.channel.send(text);
  },
  warn: (message: Message, text: any, exception: Error) => {
    message.channel.isSendable() && message.channel.send(text);
  },
  error: (message: Message, text: any, exception: Error) => {
    message.channel.isSendable() && message.channel.send(text);
  },
};

export { logger, channel };
