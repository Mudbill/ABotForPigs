import AboutCommand from "./commands/about";
import GitCommand from "./commands/git";
import HelpCommand from "./commands/help";
import ImgCommand from "./commands/img";
import PhraseCommand from "./commands/phrase";
import PinLimitCommand from "./commands/pinlimit";
import PingCommand from "./commands/ping";
import RestartCommand from "./commands/restart";
import SayCommand from "./commands/say";
import YtCommand from "./commands/yt";
import { Command } from "./types";
import { ReactionCommand } from "./commands/reaction";
import { GoodMorningService } from "./services/good-morning-service";
import { CommandService } from "./services/command-service";
import { PhraseService } from "./services/phrase-service";
import { EmojiService } from "./services/emoji-service";
import { ReactionService } from "./services/react-service";
import { GeminiService } from "./services/gemini-service";

export const commands = new Map<string, Command>([
  ["phrase", PhraseCommand],
  ["about", AboutCommand],
  ["git", GitCommand],
  ["help", HelpCommand],
  ["img", ImgCommand],
  ["yt", YtCommand],
  ["restart", RestartCommand],
  ["ping", PingCommand],
  ["say", SayCommand],
  ["pinlimit", PinLimitCommand],
  ["reaction", ReactionCommand],
]);

export const services = [
  CommandService,
  PhraseService,
  EmojiService,
  GoodMorningService,
  ReactionService,
  GeminiService,
];
