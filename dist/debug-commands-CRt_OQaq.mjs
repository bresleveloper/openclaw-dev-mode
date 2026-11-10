import { a as parseSlashCommandOrNull } from "./commands-registry.data-CPKKYobJ.mjs";
import { t as parseConfigValue } from "./config-value-D3ZQtrA8.mjs";
//#region src/auto-reply/reply/commands-setunset.ts
/** Shared parsing helpers for commands with set/unset subcommands. */
/** Parses a slash command whose actions include set/unset plus custom actions. */
function parseSlashCommandWithSetUnset(params) {
	const parsed = parseSlashCommandOrNull(params.raw, params.slash);
	if (!parsed) return null;
	const error = (message) => ({
		action: "error",
		message
	});
	const { action, args } = parsed;
	if (action === "unset") return args ? {
		action: "unset",
		path: args
	} : error(`Usage: ${params.slash} unset path`);
	if (action === "set") {
		const equalsIndex = args.indexOf("=");
		const path = equalsIndex > 0 ? args.slice(0, equalsIndex).trim() : "";
		if (!path) return error(`Usage: ${params.slash} set path=value`);
		const value = parseConfigValue(args.slice(equalsIndex + 1));
		return value.error ? error(value.error) : {
			action: "set",
			path,
			value: value.value
		};
	}
	return params.onKnownAction(action, args) || error(params.usageMessage);
}
//#endregion
//#region src/auto-reply/reply/config-commands.ts
function parseConfigCommand(raw) {
	return parseSlashCommandWithSetUnset({
		raw,
		slash: "/config",
		usageMessage: "Usage: /config show|set|unset",
		onKnownAction: (action, args) => {
			if (action === "show" || action === "get") return {
				action: "show",
				path: args || void 0
			};
		}
	});
}
//#endregion
//#region src/auto-reply/reply/debug-commands.ts
function parseDebugCommand(raw) {
	return parseSlashCommandWithSetUnset({
		raw,
		slash: "/debug",
		usageMessage: "Usage: /debug show|set|unset|reset",
		onKnownAction: (action) => action === "show" || action === "reset" ? { action } : void 0
	});
}
//#endregion
export { parseConfigCommand as n, parseSlashCommandWithSetUnset as r, parseDebugCommand as t };
