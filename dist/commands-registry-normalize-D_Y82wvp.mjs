import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as getChatCommands } from "./commands-registry.data-BiPUfkcQ.mjs";
//#region src/auto-reply/commands-registry-normalize.ts
/** Normalizes and detects slash commands through their canonical aliases. */
let cachedTextAliases;
const ARGUMENT_PRESERVING_COMMAND_KEYS = /* @__PURE__ */ new Set(["goal", "steer"]);
const TARGETED_COMMAND_BODY_RE = /^\/([^\s@]+)@([A-Za-z0-9_]+)(?=$|\s|[.!?！？…,，。;；:：'"’”)\]}])([\s\S]*)$/u;
function appendMultilineTail(head, tail, spec) {
	if (!tail) return head;
	if (!spec || spec.command.key === "skill" || spec.command.key === "learn") return `${head}\n${head.split(/\s+/, 3).length - 1 >= (spec?.command.key === "skill" ? 2 : 1) && spec?.command.key !== "learn" ? tail : tail.trimStart()}`;
	if (spec.command.key === "reset") {
		const flattened = tail.replace(/\s+/g, " ").trim();
		return flattened ? `${head} ${flattened}` : head;
	}
	return head;
}
function getTextAliases() {
	if (cachedTextAliases) return cachedTextAliases;
	const aliases = /* @__PURE__ */ new Map();
	for (const command of getChatCommands()) {
		const canonical = normalizeOptionalString(command.textAliases[0]) || `/${command.key}`;
		const acceptsArgs = Boolean(command.acceptsArgs);
		for (const alias of command.textAliases) {
			const normalized = normalizeOptionalLowercaseString(alias);
			if (!normalized) continue;
			if (!aliases.has(normalized)) aliases.set(normalized, {
				command,
				canonical,
				acceptsArgs
			});
		}
	}
	cachedTextAliases = aliases;
	return aliases;
}
/** Normalizes command text to canonical aliases, removing bot mentions when appropriate. */
function normalizeCommandBody(raw, options) {
	const trimmed = options?.preserveArguments ? raw.trimStart() : raw.trim();
	if (!trimmed.startsWith("/")) return trimmed;
	const commandAlias = trimmed.match(/^\/[^\s@:]+/u)?.[0]?.toLowerCase();
	const commandSpec = commandAlias ? getTextAliases().get(commandAlias) : void 0;
	const preserveArguments = options?.preserveArguments || commandSpec !== void 0 && ARGUMENT_PRESERVING_COMMAND_KEYS.has(commandSpec.command.key);
	const newline = preserveArguments ? -1 : trimmed.indexOf("\n");
	const singleLine = newline === -1 ? trimmed : trimmed.slice(0, newline).trim();
	const multilineTail = newline === -1 ? void 0 : trimmed.slice(newline + 1);
	const normalized = singleLine.replace(/^\/([^\s:]+)\s*:([\s\S]*)$/, (_, command, rest) => {
		const normalizedRest = preserveArguments ? rest : rest.trimStart();
		return normalizedRest ? `/${command}${/^\s/.test(normalizedRest) ? "" : " "}${normalizedRest}` : `/${command}`;
	});
	const normalizedBotUsername = normalizeOptionalLowercaseString(options?.botUsername);
	const mentionMatch = normalized.match(TARGETED_COMMAND_BODY_RE);
	const targetBotUsername = normalizeOptionalLowercaseString(mentionMatch?.[2]);
	const targetMatchesBot = normalizedBotUsername !== void 0 && targetBotUsername === normalizedBotUsername;
	const resolveBeforeIdentity = normalizedBotUsername === void 0 && options?.targetedCommandMode === "pre-identity";
	const commandBody = mentionMatch && (targetMatchesBot || resolveBeforeIdentity) ? `/${mentionMatch[1]}${mentionMatch[3] ?? ""}` : normalized;
	const lowered = normalizeLowercaseStringOrEmpty(commandBody);
	const textAliasMap = getTextAliases();
	const exact = textAliasMap.get(lowered);
	if (exact) return appendMultilineTail(exact.canonical, multilineTail, exact);
	const tokenMatch = commandBody.match(/^\/([^\s]+)(?:\s+([\s\S]+))?$/);
	if (!tokenMatch) return appendMultilineTail(commandBody, multilineTail);
	const [, token, rest] = tokenMatch;
	const tokenKey = `/${normalizeLowercaseStringOrEmpty(token)}`;
	const tokenSpec = textAliasMap.get(tokenKey);
	if (!tokenSpec) return appendMultilineTail(commandBody, multilineTail);
	if (rest && !tokenSpec.acceptsArgs) return commandBody;
	const normalizedRest = rest?.trimStart();
	return appendMultilineTail(preserveArguments ? `${tokenSpec.canonical}${commandBody.slice(tokenKey.length)}` : normalizedRest ? `${tokenSpec.canonical} ${normalizedRest}` : tokenSpec.canonical, multilineTail, tokenSpec);
}
/** Resolves a raw text command to the matching normalized alias when known. */
function maybeResolveTextAlias(raw, _cfg) {
	const trimmed = normalizeCommandBody(raw).trim();
	if (!trimmed.startsWith("/")) return null;
	const normalized = normalizeLowercaseStringOrEmpty(trimmed);
	const aliases = getTextAliases();
	const tokenMatch = normalized.match(/^\/([^\s:]+)(?:\s|$)/);
	if (!tokenMatch) return null;
	const tokenKey = `/${tokenMatch[1]}`;
	const spec = aliases.get(tokenKey);
	if (!spec) return null;
	const tail = normalized.slice(tokenKey.length);
	return !tail || spec.acceptsArgs || /^\s*:\s*$/.test(tail) ? tokenKey : null;
}
/** Resolves a raw text command into its command definition and raw argument tail. */
function resolveTextCommand(raw, cfg) {
	const trimmed = normalizeCommandBody(raw).trim();
	const alias = maybeResolveTextAlias(trimmed, cfg);
	if (!alias) return null;
	const spec = getTextAliases().get(alias);
	if (!spec) return null;
	if (!spec.acceptsArgs) return { command: spec.command };
	const args = trimmed.slice(alias.length).trim();
	return {
		command: spec.command,
		args: args || void 0
	};
}
//#endregion
export { normalizeCommandBody as n, resolveTextCommand as r, maybeResolveTextAlias as t };
