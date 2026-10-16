import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
//#region extensions/telegram/src/command-config.ts
const TELEGRAM_COMMAND_NAME_PATTERN = /^[a-z0-9_]{1,32}$/;
function normalizeTelegramCommandName(value) {
	const withoutSlash = value.trim().replace(/^\//, "");
	return (normalizeOptionalLowercaseString(withoutSlash) ?? "").replace(/-/g, "_");
}
function normalizeTelegramCommandDescription(value) {
	return value.trim();
}
function resolveTelegramCustomCommands(params) {
	const entries = Array.isArray(params.commands) ? params.commands : [];
	const reserved = params.reservedCommands ?? /* @__PURE__ */ new Set();
	const checkReserved = params.checkReserved !== false;
	const checkDuplicates = params.checkDuplicates !== false;
	const seen = /* @__PURE__ */ new Set();
	const resolved = [];
	const issues = [];
	for (let index = 0; index < entries.length; index += 1) {
		const entry = entries[index];
		const normalized = normalizeTelegramCommandName(entry?.command ?? "");
		const commandIssue = !normalized ? "Telegram custom command is missing a command name." : !TELEGRAM_COMMAND_NAME_PATTERN.test(normalized) ? `Telegram custom command "/${normalized}" is invalid (use a-z, 0-9, underscore; max 32 chars).` : checkReserved && reserved.has(normalized) ? `Telegram custom command "/${normalized}" conflicts with a native command.` : checkDuplicates && seen.has(normalized) ? `Telegram custom command "/${normalized}" is duplicated.` : void 0;
		if (commandIssue) {
			issues.push({
				index,
				field: "command",
				message: commandIssue
			});
			continue;
		}
		const description = normalizeTelegramCommandDescription(entry?.description ?? "");
		if (!description) {
			issues.push({
				index,
				field: "description",
				message: `Telegram custom command "/${normalized}" is missing a description.`
			});
			continue;
		}
		if (checkDuplicates) seen.add(normalized);
		resolved.push({
			command: normalized,
			description
		});
	}
	return {
		commands: resolved,
		issues
	};
}
//#endregion
export { resolveTelegramCustomCommands as i, normalizeTelegramCommandDescription as n, normalizeTelegramCommandName as r, TELEGRAM_COMMAND_NAME_PATTERN as t };
