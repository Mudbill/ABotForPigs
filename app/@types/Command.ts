import { Message, PermissionResolvable } from "discord.js";

export default interface Command {
	command: string,
	permission: PermissionResolvable,
	description?: string,
	exec: (args: string[], msg: Message) => any;
}