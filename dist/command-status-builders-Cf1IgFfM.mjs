import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { t as isCommandFlagEnabled } from "./commands.flags-D0cD2TME.mjs";
import { n as listChatCommands, r as listChatCommandsForConfig } from "./commands-registry-list-DrLhyfgr.mjs";
import "./commands-registry-DcFr3mpT.mjs";
import { n as listPluginCommands } from "./commands-ECfi7M74.mjs";
//#region src/auto-reply/command-status-builders.ts
/** Formats /help and /commands output for text and native command-list surfaces. */
const COMMAND_CATEGORIES = [
	["session", "Session"],
	["options", "Options"],
	["status", "Status"],
	["management", "Management"],
	["media", "Media"],
	["tools", "Tools"]
];
/** Builds the compact slash-command help text shown by `/help`. */
function buildHelpMessage(cfg) {
	const optionParts = [
		"/think <level|default>",
		"/model <id>",
		"/fast status|auto|on|off|ultrafast|default",
		"/verbose on|off|full",
		"/trace on|off|raw"
	];
	if (isCommandFlagEnabled(cfg, "config")) optionParts.push("/config");
	if (isCommandFlagEnabled(cfg, "debug")) optionParts.push("/debug");
	return [
		"ℹ️ Help",
		"",
		"Session",
		"  /new  |  /reset  |  /compact [instructions]  |  /stop",
		"",
		"Options",
		`  ${optionParts.join("  |  ")}`,
		"",
		"Status",
		"  /status  |  /whoami  |  /context",
		"",
		"Skills",
		"  /skill <name> [input]",
		"",
		"More: /commands for full list, /tools for available capabilities"
	].join("\n");
}
const COMMANDS_PER_PAGE = 8;
function formatCommandEntry(command) {
	const primary = command.nativeName ? `/${command.nativeName}` : normalizeOptionalString(command.textAliases[0]) || `/${command.key}`;
	const aliases = dedupeByKey(command.textAliases.map((alias) => alias.trim()).filter(Boolean).filter((alias) => normalizeLowercaseStringOrEmpty(alias) !== normalizeLowercaseStringOrEmpty(primary)), normalizeLowercaseStringOrEmpty);
	return `${primary}${aliases.length ? ` (${aliases.join(", ")})` : ""}${command.scope === "text" ? " [text]" : ""} - ${command.description}`;
}
function buildCommandItems(commands, pluginCommands) {
	const grouped = /* @__PURE__ */ new Map();
	for (const command of commands) {
		const category = command.category === "docks" ? "tools" : command.category ?? "tools";
		const list = grouped.get(category) ?? [];
		list.push(command);
		grouped.set(category, list);
	}
	const items = [];
	for (const [category, label] of COMMAND_CATEGORIES) for (const command of grouped.get(category) ?? []) items.push({
		label,
		text: formatCommandEntry(command)
	});
	for (const command of pluginCommands) {
		const pluginLabel = command.pluginId ? ` (${command.pluginId})` : "";
		const commandName = command.name.includes("-") ? `\`/${command.name}\`` : `/${command.name}`;
		items.push({
			label: "Plugins",
			text: `${commandName}${pluginLabel} - ${command.description}`
		});
	}
	return items;
}
function formatCommandList(items) {
	const lines = [];
	let currentLabel = null;
	for (const item of items) {
		if (item.label !== currentLabel) {
			if (lines.length > 0) lines.push("");
			lines.push(item.label);
			currentLabel = item.label;
		}
		lines.push(`  ${item.text}`);
	}
	return lines.join("\n");
}
/** Builds `/commands` text, returning only the rendered message body. */
function buildCommandsMessage(cfg, skillCommands, options) {
	return buildCommandsMessagePaginated(cfg, skillCommands, options).text;
}
/** Builds `/commands` text and pagination metadata for surfaces with native list controls. */
function buildCommandsMessagePaginated(cfg, skillCommands, options) {
	const page = Math.max(1, options?.page ?? 1);
	const surface = normalizeOptionalLowercaseString(options?.surface);
	const prefersPaginatedList = options?.forcePaginatedList === true || Boolean(surface && getChannelPlugin(surface)?.commands?.buildCommandsListChannelData);
	const items = buildCommandItems(cfg ? listChatCommandsForConfig(cfg, { skillCommands }) : listChatCommands({ skillCommands }), listPluginCommands());
	const totalPages = prefersPaginatedList ? Math.max(1, Math.ceil(items.length / COMMANDS_PER_PAGE)) : 1;
	const currentPage = prefersPaginatedList ? Math.min(page, totalPages) : 1;
	const startIndex = (currentPage - 1) * COMMANDS_PER_PAGE;
	const pageItems = prefersPaginatedList ? items.slice(startIndex, startIndex + COMMANDS_PER_PAGE) : items;
	const lines = [
		prefersPaginatedList ? `ℹ️ Commands (${currentPage}/${totalPages})` : "ℹ️ Slash commands",
		"",
		formatCommandList(pageItems)
	];
	if (!prefersPaginatedList) lines.push("", "More: /tools for available capabilities");
	return {
		text: lines.join("\n").trim(),
		totalPages,
		currentPage,
		hasNext: currentPage < totalPages,
		hasPrev: currentPage > 1
	};
}
//#endregion
export { buildCommandsMessagePaginated as n, buildHelpMessage as r, buildCommandsMessage as t };
