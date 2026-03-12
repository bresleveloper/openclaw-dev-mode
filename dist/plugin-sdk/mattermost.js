import { $ as resolveDefaultSecretProviderAlias, A as isTrustedProxyAddress, At as consumeRootOptionToken, B as MarkdownConfigSchema, C as readLocalFileSafely, Ct as DEFAULT_ACCOUNT_ID, D as createPinnedDispatcher, Dt as logVerbose, E as closeDispatcher, Et as createSubsystemLogger, F as loadConfig, G as createAsyncLock, H as createConfigRuntimeEnv, I as projectConfigOntoRuntimeSourceSnapshot, J as listChannelDocks, K as buildWorkspaceSkillCommandSpecs, L as BlockStreamingCoalesceSchema, M as resolveSecretRefString, Mt as resolveStateDir, N as encodeJsonPointerToken, Nt as resolveRequiredHomeDir, O as resolvePinnedHostnameWithPolicy, Ot as shouldLogVerbose, P as getRuntimeConfigSourceSnapshot, Q as isValidFileSecretRefId, R as DmPolicySchema, S as SafeOpenError, St as resolveThreadSessionKeys, T as SsrFBlockedError, Tt as resolveThreadParentSessionKey, V as requireOpenAllowFrom, W as resolveOpenClawAgentDir, X as formatExecSecretRefIdValidationMessage, Y as SECRET_PROVIDER_ALIAS_PATTERN, Z as isValidExecSecretRefId, _ as rawDataToString, _t as logWarn, a as resolveModelRefFromString, at as deleteAccountFromConfigSection, b as kindFromMime, bt as resolveUserPath, c as isNonSecretApiKeyMarker, ct as ENV_SECRET_REF_ID_RE, d as parseStrictPositiveInteger, dt as normalizeResolvedSecretInputString, et as getActivePluginRegistry, f as resolveStorePath, ft as normalizeSecretInputString, g as resizeToJpeg, gt as resolveAgentWorkspaceDir, h as optimizeImageToPng, ht as resolveAgentSkillsFilter, i as resolveDefaultModelForAgent, it as formatPairingApproveHint, j as resolveClientIp, jt as resolveOAuthDir, k as isLoopbackHost, kt as resolvePreferredOpenClawTmpDir, l as listThinkingLevels, lt as hasConfiguredSecretInput, m as hasAlphaChannel, mt as resolveAgentConfig, n as buildModelAliasIndex, nt as findOverlappingPluginHttpRoute, o as normalizeProviders, ot as setAccountEnabledInConfigSection, p as convertHeicToJpeg, pt as listAgentIds, q as getChannelPlugin, r as normalizeProviderId, rt as normalizePluginHttpPath, s as resolveImplicitProviders, st as createAccountListHelpers, t as buildAllowedModelSet, tt as requireActivePluginRegistry, u as loadSessionStore, ut as isValidEnvSecretRefId, v as detectMime, vt as normalizeStringEntries, w as hasProxyEnvConfigured, wt as normalizeAccountId, x as maxBytesForKind, xt as safeParseJson, y as extensionForMime, yt as isRecord, z as GroupPolicySchema } from "./model-selection-DOtovUSQ.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import fs$1 from "node:fs/promises";
import { fileURLToPath } from "node:url";
import "chokidar";
import "node:crypto";
import { z } from "zod";
import { EnvHttpProxyAgent } from "undici";
//#region src/auto-reply/envelope.ts
function formatInboundFromLabel(params) {
	if (params.isGroup) {
		const label = params.groupLabel?.trim() || params.groupFallback || "Group";
		const id = params.groupId?.trim();
		return id ? `${label} id:${id}` : label;
	}
	const directLabel = params.directLabel.trim();
	const directId = params.directId?.trim();
	if (!directId || directId === directLabel) return directLabel;
	return `${directLabel} id:${directId}`;
}
//#endregion
//#region src/channels/allowlist-match.ts
function compileAllowlist(entries) {
	const set = new Set(entries.filter(Boolean));
	return {
		set,
		wildcard: set.has("*")
	};
}
function compileSimpleAllowlist(entries) {
	return compileAllowlist(entries.map((entry) => String(entry).trim().toLowerCase()).filter(Boolean));
}
function resolveAllowlistCandidates(params) {
	for (const candidate of params.candidates) {
		if (!candidate.value) continue;
		if (params.compiledAllowlist.set.has(candidate.value)) return {
			allowed: true,
			matchKey: candidate.value,
			matchSource: candidate.source
		};
	}
	return { allowed: false };
}
function resolveAllowlistMatchSimple(params) {
	const allowFrom = compileSimpleAllowlist(params.allowFrom);
	if (allowFrom.set.size === 0) return { allowed: false };
	if (allowFrom.wildcard) return {
		allowed: true,
		matchKey: "*",
		matchSource: "wildcard"
	};
	const senderId = params.senderId.toLowerCase();
	const senderName = params.senderName?.toLowerCase();
	return resolveAllowlistCandidates({
		compiledAllowlist: allowFrom,
		candidates: [{
			value: senderId,
			source: "id"
		}, ...params.allowNameMatching === true && senderName ? [{
			value: senderName,
			source: "name"
		}] : []]
	});
}
//#endregion
//#region src/auto-reply/reply/mentions.ts
const CURRENT_MESSAGE_MARKER = "[Current message - respond to this]";
//#endregion
//#region src/auto-reply/reply/history.ts
const HISTORY_CONTEXT_MARKER = "[Chat messages since your last reply - for context]";
const DEFAULT_GROUP_HISTORY_LIMIT = 50;
/** Maximum number of group history keys to retain (LRU eviction when exceeded). */
const MAX_HISTORY_KEYS = 1e3;
/**
* Evict oldest keys from a history map when it exceeds MAX_HISTORY_KEYS.
* Uses Map's insertion order for LRU-like behavior.
*/
function evictOldHistoryKeys(historyMap, maxKeys = MAX_HISTORY_KEYS) {
	if (historyMap.size <= maxKeys) return;
	const keysToDelete = historyMap.size - maxKeys;
	const iterator = historyMap.keys();
	for (let i = 0; i < keysToDelete; i++) {
		const key = iterator.next().value;
		if (key !== void 0) historyMap.delete(key);
	}
}
function buildHistoryContext(params) {
	const { historyText, currentMessage } = params;
	const lineBreak = params.lineBreak ?? "\n";
	if (!historyText.trim()) return currentMessage;
	return [
		HISTORY_CONTEXT_MARKER,
		historyText,
		"",
		CURRENT_MESSAGE_MARKER,
		currentMessage
	].join(lineBreak);
}
function appendHistoryEntry(params) {
	const { historyMap, historyKey, entry } = params;
	if (params.limit <= 0) return [];
	const history = historyMap.get(historyKey) ?? [];
	history.push(entry);
	while (history.length > params.limit) history.shift();
	if (historyMap.has(historyKey)) historyMap.delete(historyKey);
	historyMap.set(historyKey, history);
	evictOldHistoryKeys(historyMap);
	return history;
}
function recordPendingHistoryEntry(params) {
	return appendHistoryEntry(params);
}
function recordPendingHistoryEntryIfEnabled(params) {
	if (!params.entry) return [];
	if (params.limit <= 0) return [];
	return recordPendingHistoryEntry({
		historyMap: params.historyMap,
		historyKey: params.historyKey,
		entry: params.entry,
		limit: params.limit
	});
}
function buildPendingHistoryContextFromMap(params) {
	if (params.limit <= 0) return params.currentMessage;
	return buildHistoryContextFromEntries({
		entries: params.historyMap.get(params.historyKey) ?? [],
		currentMessage: params.currentMessage,
		formatEntry: params.formatEntry,
		lineBreak: params.lineBreak,
		excludeLast: false
	});
}
function clearHistoryEntries(params) {
	params.historyMap.set(params.historyKey, []);
}
function clearHistoryEntriesIfEnabled(params) {
	if (params.limit <= 0) return;
	clearHistoryEntries({
		historyMap: params.historyMap,
		historyKey: params.historyKey
	});
}
function buildHistoryContextFromEntries(params) {
	const lineBreak = params.lineBreak ?? "\n";
	const entries = params.excludeLast === false ? params.entries : params.entries.slice(0, -1);
	if (entries.length === 0) return params.currentMessage;
	return buildHistoryContext({
		historyText: entries.map(params.formatEntry).join(lineBreak),
		currentMessage: params.currentMessage,
		lineBreak
	});
}
createSubsystemLogger("gateway/skills");
createAsyncLock();
createSubsystemLogger("gateway/skills-remote");
const remoteNodes = /* @__PURE__ */ new Map();
function isMacPlatform(platform, deviceFamily) {
	const platformNorm = String(platform ?? "").trim().toLowerCase();
	const familyNorm = String(deviceFamily ?? "").trim().toLowerCase();
	if (platformNorm.includes("mac")) return true;
	if (platformNorm.includes("darwin")) return true;
	if (familyNorm === "mac") return true;
	return false;
}
function supportsSystemRun(commands) {
	return Array.isArray(commands) && commands.includes("system.run");
}
function getRemoteSkillEligibility() {
	const macNodes = [...remoteNodes.values()].filter((node) => isMacPlatform(node.platform, node.deviceFamily) && supportsSystemRun(node.commands));
	if (macNodes.length === 0) return;
	const bins = /* @__PURE__ */ new Set();
	for (const node of macNodes) for (const bin of node.bins) bins.add(bin);
	const labels = macNodes.map((node) => node.displayName ?? node.nodeId).filter(Boolean);
	return {
		platforms: ["darwin"],
		hasBin: (bin) => bins.has(bin),
		hasAnyBin: (required) => required.some((bin) => bins.has(bin)),
		note: labels.length > 0 ? `Remote macOS node available (${labels.join(", ")}). Run macOS-only skills via nodes.run on that node.` : "Remote macOS node available. Run macOS-only skills via nodes.run on that node."
	};
}
//#endregion
//#region src/auto-reply/commands-args.ts
function normalizeArgValue(value) {
	if (value == null) return;
	let text;
	if (typeof value === "string") text = value.trim();
	else if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") text = String(value).trim();
	else if (typeof value === "symbol") text = value.toString().trim();
	else if (typeof value === "function") text = value.toString().trim();
	else text = JSON.stringify(value);
	return text ? text : void 0;
}
function formatActionArgs(values, params) {
	const action = normalizeArgValue(values.action)?.toLowerCase();
	const path = normalizeArgValue(values.path);
	const value = normalizeArgValue(values.value);
	if (!action) return;
	const knownAction = params.formatKnownAction(action, path);
	if (knownAction) return knownAction;
	return formatSetUnsetArgAction(action, {
		path,
		value
	});
}
const formatConfigArgs = (values) => formatActionArgs(values, { formatKnownAction: (action, path) => {
	if (action === "show" || action === "get") return path ? `${action} ${path}` : action;
} });
const formatDebugArgs = (values) => formatActionArgs(values, { formatKnownAction: (action) => {
	if (action === "show" || action === "reset") return action;
} });
function formatSetUnsetArgAction(action, params) {
	if (action === "unset") return params.path ? `${action} ${params.path}` : action;
	if (action === "set") {
		if (!params.path) return action;
		if (!params.value) return `${action} ${params.path}`;
		return `${action} ${params.path}=${params.value}`;
	}
	return action;
}
const formatQueueArgs = (values) => {
	const mode = normalizeArgValue(values.mode);
	const debounce = normalizeArgValue(values.debounce);
	const cap = normalizeArgValue(values.cap);
	const drop = normalizeArgValue(values.drop);
	const parts = [];
	if (mode) parts.push(mode);
	if (debounce) parts.push(`debounce:${debounce}`);
	if (cap) parts.push(`cap:${cap}`);
	if (drop) parts.push(`drop:${drop}`);
	return parts.length > 0 ? parts.join(" ") : void 0;
};
const formatExecArgs = (values) => {
	const host = normalizeArgValue(values.host);
	const security = normalizeArgValue(values.security);
	const ask = normalizeArgValue(values.ask);
	const node = normalizeArgValue(values.node);
	const parts = [];
	if (host) parts.push(`host=${host}`);
	if (security) parts.push(`security=${security}`);
	if (ask) parts.push(`ask=${ask}`);
	if (node) parts.push(`node=${node}`);
	return parts.length > 0 ? parts.join(" ") : void 0;
};
const COMMAND_ARG_FORMATTERS = {
	config: formatConfigArgs,
	debug: formatDebugArgs,
	queue: formatQueueArgs,
	exec: formatExecArgs
};
//#endregion
//#region src/auto-reply/commands-registry.data.ts
function defineChatCommand(command) {
	const aliases = (command.textAliases ?? (command.textAlias ? [command.textAlias] : [])).map((alias) => alias.trim()).filter(Boolean);
	const scope = command.scope ?? (command.nativeName ? aliases.length ? "both" : "native" : "text");
	const acceptsArgs = command.acceptsArgs ?? Boolean(command.args?.length);
	const argsParsing = command.argsParsing ?? (command.args?.length ? "positional" : "none");
	return {
		key: command.key,
		nativeName: command.nativeName,
		description: command.description,
		acceptsArgs,
		args: command.args,
		argsParsing,
		formatArgs: command.formatArgs,
		argsMenu: command.argsMenu,
		textAliases: aliases,
		scope,
		category: command.category
	};
}
function defineDockCommand(dock) {
	return defineChatCommand({
		key: `dock:${dock.id}`,
		nativeName: `dock_${dock.id}`,
		description: `Switch to ${dock.id} for replies.`,
		textAliases: [`/dock-${dock.id}`, `/dock_${dock.id}`],
		category: "docks"
	});
}
function registerAlias(commands, key, ...aliases) {
	const command = commands.find((entry) => entry.key === key);
	if (!command) throw new Error(`registerAlias: unknown command key: ${key}`);
	const existing = new Set(command.textAliases.map((alias) => alias.trim().toLowerCase()));
	for (const alias of aliases) {
		const trimmed = alias.trim();
		if (!trimmed) continue;
		const lowered = trimmed.toLowerCase();
		if (existing.has(lowered)) continue;
		existing.add(lowered);
		command.textAliases.push(trimmed);
	}
}
function assertCommandRegistry(commands) {
	const keys = /* @__PURE__ */ new Set();
	const nativeNames = /* @__PURE__ */ new Set();
	const textAliases = /* @__PURE__ */ new Set();
	for (const command of commands) {
		if (keys.has(command.key)) throw new Error(`Duplicate command key: ${command.key}`);
		keys.add(command.key);
		const nativeName = command.nativeName?.trim();
		if (command.scope === "text") {
			if (nativeName) throw new Error(`Text-only command has native name: ${command.key}`);
			if (command.textAliases.length === 0) throw new Error(`Text-only command missing text alias: ${command.key}`);
		} else if (!nativeName) throw new Error(`Native command missing native name: ${command.key}`);
		else {
			const nativeKey = nativeName.toLowerCase();
			if (nativeNames.has(nativeKey)) throw new Error(`Duplicate native command: ${nativeName}`);
			nativeNames.add(nativeKey);
		}
		if (command.scope === "native" && command.textAliases.length > 0) throw new Error(`Native-only command has text aliases: ${command.key}`);
		for (const alias of command.textAliases) {
			if (!alias.startsWith("/")) throw new Error(`Command alias missing leading '/': ${alias}`);
			const aliasKey = alias.toLowerCase();
			if (textAliases.has(aliasKey)) throw new Error(`Duplicate command alias: ${alias}`);
			textAliases.add(aliasKey);
		}
	}
}
let cachedCommands = null;
let cachedRegistry = null;
function buildChatCommands() {
	const commands = [
		defineChatCommand({
			key: "help",
			nativeName: "help",
			description: "Show available commands.",
			textAlias: "/help",
			category: "status"
		}),
		defineChatCommand({
			key: "commands",
			nativeName: "commands",
			description: "List all slash commands.",
			textAlias: "/commands",
			category: "status"
		}),
		defineChatCommand({
			key: "skill",
			nativeName: "skill",
			description: "Run a skill by name.",
			textAlias: "/skill",
			category: "tools",
			args: [{
				name: "name",
				description: "Skill name",
				type: "string",
				required: true
			}, {
				name: "input",
				description: "Skill input",
				type: "string",
				captureRemaining: true
			}]
		}),
		defineChatCommand({
			key: "status",
			nativeName: "status",
			description: "Show current status.",
			textAlias: "/status",
			category: "status"
		}),
		defineChatCommand({
			key: "allowlist",
			description: "List/add/remove allowlist entries.",
			textAlias: "/allowlist",
			acceptsArgs: true,
			scope: "text",
			category: "management"
		}),
		defineChatCommand({
			key: "approve",
			nativeName: "approve",
			description: "Approve or deny exec requests.",
			textAlias: "/approve",
			acceptsArgs: true,
			category: "management"
		}),
		defineChatCommand({
			key: "context",
			nativeName: "context",
			description: "Explain how context is built and used.",
			textAlias: "/context",
			acceptsArgs: true,
			category: "status"
		}),
		defineChatCommand({
			key: "export-session",
			nativeName: "export-session",
			description: "Export current session to HTML file with full system prompt.",
			textAliases: ["/export-session", "/export"],
			acceptsArgs: true,
			category: "status",
			args: [{
				name: "path",
				description: "Output path (default: workspace)",
				type: "string",
				required: false
			}]
		}),
		defineChatCommand({
			key: "tts",
			nativeName: "tts",
			description: "Control text-to-speech (TTS).",
			textAlias: "/tts",
			category: "media",
			args: [{
				name: "action",
				description: "TTS action",
				type: "string",
				choices: [
					{
						value: "on",
						label: "On"
					},
					{
						value: "off",
						label: "Off"
					},
					{
						value: "status",
						label: "Status"
					},
					{
						value: "provider",
						label: "Provider"
					},
					{
						value: "limit",
						label: "Limit"
					},
					{
						value: "summary",
						label: "Summary"
					},
					{
						value: "audio",
						label: "Audio"
					},
					{
						value: "help",
						label: "Help"
					}
				]
			}, {
				name: "value",
				description: "Provider, limit, or text",
				type: "string",
				captureRemaining: true
			}],
			argsMenu: {
				arg: "action",
				title: "TTS Actions:\n• On – Enable TTS for responses\n• Off – Disable TTS\n• Status – Show current settings\n• Provider – Set voice provider (edge, elevenlabs, openai)\n• Limit – Set max characters for TTS\n• Summary – Toggle AI summary for long texts\n• Audio – Generate TTS from custom text\n• Help – Show usage guide"
			}
		}),
		defineChatCommand({
			key: "whoami",
			nativeName: "whoami",
			description: "Show your sender id.",
			textAlias: "/whoami",
			category: "status"
		}),
		defineChatCommand({
			key: "session",
			nativeName: "session",
			description: "Manage session-level settings (for example /session idle).",
			textAlias: "/session",
			category: "session",
			args: [{
				name: "action",
				description: "idle | max-age",
				type: "string",
				choices: ["idle", "max-age"]
			}, {
				name: "value",
				description: "Duration (24h, 90m) or off",
				type: "string",
				captureRemaining: true
			}],
			argsMenu: "auto"
		}),
		defineChatCommand({
			key: "subagents",
			nativeName: "subagents",
			description: "List, kill, log, spawn, or steer subagent runs for this session.",
			textAlias: "/subagents",
			category: "management",
			args: [
				{
					name: "action",
					description: "list | kill | log | info | send | steer | spawn",
					type: "string",
					choices: [
						"list",
						"kill",
						"log",
						"info",
						"send",
						"steer",
						"spawn"
					]
				},
				{
					name: "target",
					description: "Run id, index, or session key",
					type: "string"
				},
				{
					name: "value",
					description: "Additional input (limit/message)",
					type: "string",
					captureRemaining: true
				}
			],
			argsMenu: "auto"
		}),
		defineChatCommand({
			key: "acp",
			nativeName: "acp",
			description: "Manage ACP sessions and runtime options.",
			textAlias: "/acp",
			category: "management",
			args: [{
				name: "action",
				description: "Action to run",
				type: "string",
				preferAutocomplete: true,
				choices: [
					"spawn",
					"cancel",
					"steer",
					"close",
					"sessions",
					"status",
					"set-mode",
					"set",
					"cwd",
					"permissions",
					"timeout",
					"model",
					"reset-options",
					"doctor",
					"install",
					"help"
				]
			}, {
				name: "value",
				description: "Action arguments",
				type: "string",
				captureRemaining: true
			}],
			argsMenu: "auto"
		}),
		defineChatCommand({
			key: "focus",
			nativeName: "focus",
			description: "Bind this thread (Discord) or topic/conversation (Telegram) to a session target.",
			textAlias: "/focus",
			category: "management",
			args: [{
				name: "target",
				description: "Subagent label/index or session key/id/label",
				type: "string",
				captureRemaining: true
			}]
		}),
		defineChatCommand({
			key: "unfocus",
			nativeName: "unfocus",
			description: "Remove the current thread (Discord) or topic/conversation (Telegram) binding.",
			textAlias: "/unfocus",
			category: "management"
		}),
		defineChatCommand({
			key: "agents",
			nativeName: "agents",
			description: "List thread-bound agents for this session.",
			textAlias: "/agents",
			category: "management"
		}),
		defineChatCommand({
			key: "kill",
			nativeName: "kill",
			description: "Kill a running subagent (or all).",
			textAlias: "/kill",
			category: "management",
			args: [{
				name: "target",
				description: "Label, run id, index, or all",
				type: "string"
			}],
			argsMenu: "auto"
		}),
		defineChatCommand({
			key: "steer",
			nativeName: "steer",
			description: "Send guidance to a running subagent.",
			textAlias: "/steer",
			category: "management",
			args: [{
				name: "target",
				description: "Label, run id, or index",
				type: "string"
			}, {
				name: "message",
				description: "Steering message",
				type: "string",
				captureRemaining: true
			}]
		}),
		defineChatCommand({
			key: "config",
			nativeName: "config",
			description: "Show or set config values.",
			textAlias: "/config",
			category: "management",
			args: [
				{
					name: "action",
					description: "show | get | set | unset",
					type: "string",
					choices: [
						"show",
						"get",
						"set",
						"unset"
					]
				},
				{
					name: "path",
					description: "Config path",
					type: "string"
				},
				{
					name: "value",
					description: "Value for set",
					type: "string",
					captureRemaining: true
				}
			],
			argsParsing: "none",
			formatArgs: COMMAND_ARG_FORMATTERS.config
		}),
		defineChatCommand({
			key: "debug",
			nativeName: "debug",
			description: "Set runtime debug overrides.",
			textAlias: "/debug",
			category: "management",
			args: [
				{
					name: "action",
					description: "show | reset | set | unset",
					type: "string",
					choices: [
						"show",
						"reset",
						"set",
						"unset"
					]
				},
				{
					name: "path",
					description: "Debug path",
					type: "string"
				},
				{
					name: "value",
					description: "Value for set",
					type: "string",
					captureRemaining: true
				}
			],
			argsParsing: "none",
			formatArgs: COMMAND_ARG_FORMATTERS.debug
		}),
		defineChatCommand({
			key: "usage",
			nativeName: "usage",
			description: "Usage footer or cost summary.",
			textAlias: "/usage",
			category: "options",
			args: [{
				name: "mode",
				description: "off, tokens, full, or cost",
				type: "string",
				choices: [
					"off",
					"tokens",
					"full",
					"cost"
				]
			}],
			argsMenu: "auto"
		}),
		defineChatCommand({
			key: "stop",
			nativeName: "stop",
			description: "Stop the current run.",
			textAlias: "/stop",
			category: "session"
		}),
		defineChatCommand({
			key: "restart",
			nativeName: "restart",
			description: "Restart OpenClaw.",
			textAlias: "/restart",
			category: "tools"
		}),
		defineChatCommand({
			key: "activation",
			nativeName: "activation",
			description: "Set group activation mode.",
			textAlias: "/activation",
			category: "management",
			args: [{
				name: "mode",
				description: "mention or always",
				type: "string",
				choices: ["mention", "always"]
			}],
			argsMenu: "auto"
		}),
		defineChatCommand({
			key: "send",
			nativeName: "send",
			description: "Set send policy.",
			textAlias: "/send",
			category: "management",
			args: [{
				name: "mode",
				description: "on, off, or inherit",
				type: "string",
				choices: [
					"on",
					"off",
					"inherit"
				]
			}],
			argsMenu: "auto"
		}),
		defineChatCommand({
			key: "reset",
			nativeName: "reset",
			description: "Reset the current session.",
			textAlias: "/reset",
			acceptsArgs: true,
			category: "session"
		}),
		defineChatCommand({
			key: "new",
			nativeName: "new",
			description: "Start a new session.",
			textAlias: "/new",
			acceptsArgs: true,
			category: "session"
		}),
		defineChatCommand({
			key: "compact",
			nativeName: "compact",
			description: "Compact the session context.",
			textAlias: "/compact",
			category: "session",
			args: [{
				name: "instructions",
				description: "Extra compaction instructions",
				type: "string",
				captureRemaining: true
			}]
		}),
		defineChatCommand({
			key: "think",
			nativeName: "think",
			description: "Set thinking level.",
			textAlias: "/think",
			category: "options",
			args: [{
				name: "level",
				description: "off, minimal, low, medium, high, xhigh",
				type: "string",
				choices: ({ provider, model }) => listThinkingLevels(provider, model)
			}],
			argsMenu: "auto"
		}),
		defineChatCommand({
			key: "verbose",
			nativeName: "verbose",
			description: "Toggle verbose mode.",
			textAlias: "/verbose",
			category: "options",
			args: [{
				name: "mode",
				description: "on or off",
				type: "string",
				choices: ["on", "off"]
			}],
			argsMenu: "auto"
		}),
		defineChatCommand({
			key: "reasoning",
			nativeName: "reasoning",
			description: "Toggle reasoning visibility.",
			textAlias: "/reasoning",
			category: "options",
			args: [{
				name: "mode",
				description: "on, off, or stream",
				type: "string",
				choices: [
					"on",
					"off",
					"stream"
				]
			}],
			argsMenu: "auto"
		}),
		defineChatCommand({
			key: "elevated",
			nativeName: "elevated",
			description: "Toggle elevated mode.",
			textAlias: "/elevated",
			category: "options",
			args: [{
				name: "mode",
				description: "on, off, ask, or full",
				type: "string",
				choices: [
					"on",
					"off",
					"ask",
					"full"
				]
			}],
			argsMenu: "auto"
		}),
		defineChatCommand({
			key: "exec",
			nativeName: "exec",
			description: "Set exec defaults for this session.",
			textAlias: "/exec",
			category: "options",
			args: [
				{
					name: "host",
					description: "sandbox, gateway, or node",
					type: "string",
					choices: [
						"sandbox",
						"gateway",
						"node"
					]
				},
				{
					name: "security",
					description: "deny, allowlist, or full",
					type: "string",
					choices: [
						"deny",
						"allowlist",
						"full"
					]
				},
				{
					name: "ask",
					description: "off, on-miss, or always",
					type: "string",
					choices: [
						"off",
						"on-miss",
						"always"
					]
				},
				{
					name: "node",
					description: "Node id or name",
					type: "string"
				}
			],
			argsParsing: "none",
			formatArgs: COMMAND_ARG_FORMATTERS.exec
		}),
		defineChatCommand({
			key: "model",
			nativeName: "model",
			description: "Show or set the model.",
			textAlias: "/model",
			category: "options",
			args: [{
				name: "model",
				description: "Model id (provider/model or id)",
				type: "string"
			}]
		}),
		defineChatCommand({
			key: "models",
			nativeName: "models",
			description: "List model providers or provider models.",
			textAlias: "/models",
			argsParsing: "none",
			acceptsArgs: true,
			category: "options"
		}),
		defineChatCommand({
			key: "queue",
			nativeName: "queue",
			description: "Adjust queue settings.",
			textAlias: "/queue",
			category: "options",
			args: [
				{
					name: "mode",
					description: "queue mode",
					type: "string",
					choices: [
						"steer",
						"interrupt",
						"followup",
						"collect",
						"steer-backlog"
					]
				},
				{
					name: "debounce",
					description: "debounce duration (e.g. 500ms, 2s)",
					type: "string"
				},
				{
					name: "cap",
					description: "queue cap",
					type: "number"
				},
				{
					name: "drop",
					description: "drop policy",
					type: "string",
					choices: [
						"old",
						"new",
						"summarize"
					]
				}
			],
			argsParsing: "none",
			formatArgs: COMMAND_ARG_FORMATTERS.queue
		}),
		defineChatCommand({
			key: "bash",
			description: "Run host shell commands (host-only).",
			textAlias: "/bash",
			scope: "text",
			category: "tools",
			args: [{
				name: "command",
				description: "Shell command",
				type: "string",
				captureRemaining: true
			}]
		}),
		...listChannelDocks().filter((dock) => dock.capabilities.nativeCommands).map((dock) => defineDockCommand(dock))
	];
	registerAlias(commands, "whoami", "/id");
	registerAlias(commands, "think", "/thinking", "/t");
	registerAlias(commands, "verbose", "/v");
	registerAlias(commands, "reasoning", "/reason");
	registerAlias(commands, "elevated", "/elev");
	registerAlias(commands, "steer", "/tell");
	assertCommandRegistry(commands);
	return commands;
}
function getChatCommands() {
	const registry = getActivePluginRegistry();
	if (cachedCommands && registry === cachedRegistry) return cachedCommands;
	const commands = buildChatCommands();
	cachedCommands = commands;
	cachedRegistry = registry;
	return commands;
}
//#endregion
//#region src/auto-reply/commands-registry.ts
function buildSkillCommandDefinitions(skillCommands) {
	if (!skillCommands || skillCommands.length === 0) return [];
	return skillCommands.map((spec) => ({
		key: `skill:${spec.skillName}`,
		nativeName: spec.name,
		description: spec.description,
		textAliases: [`/${spec.name}`],
		acceptsArgs: true,
		argsParsing: "none",
		scope: "both"
	}));
}
function listChatCommands(params) {
	const commands = getChatCommands();
	if (!params?.skillCommands?.length) return [...commands];
	return [...commands, ...buildSkillCommandDefinitions(params.skillCommands)];
}
//#endregion
//#region src/auto-reply/skill-commands.ts
function listReservedChatSlashCommandNames(extraNames = []) {
	const reserved = /* @__PURE__ */ new Set();
	for (const command of listChatCommands()) {
		if (command.nativeName) reserved.add(command.nativeName.toLowerCase());
		for (const alias of command.textAliases) {
			const trimmed = alias.trim();
			if (!trimmed.startsWith("/")) continue;
			reserved.add(trimmed.slice(1).toLowerCase());
		}
	}
	for (const name of extraNames) {
		const trimmed = name.trim().toLowerCase();
		if (trimmed) reserved.add(trimmed);
	}
	return reserved;
}
function dedupeBySkillName(commands) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const cmd of commands) {
		const key = cmd.skillName.trim().toLowerCase();
		if (key && seen.has(key)) continue;
		if (key) seen.add(key);
		out.push(cmd);
	}
	return out;
}
function listSkillCommandsForAgents(params) {
	const mergeSkillFilters = (existing, incoming) => {
		if (existing === void 0 || incoming === void 0) return;
		if (existing.length === 0) return Array.from(new Set(incoming));
		if (incoming.length === 0) return Array.from(new Set(existing));
		return Array.from(new Set([...existing, ...incoming]));
	};
	const agentIds = params.agentIds ?? listAgentIds(params.cfg);
	const used = listReservedChatSlashCommandNames();
	const entries = [];
	const workspaceFilters = /* @__PURE__ */ new Map();
	for (const agentId of agentIds) {
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		if (!fs.existsSync(workspaceDir)) {
			logVerbose(`Skipping agent "${agentId}": workspace does not exist: ${workspaceDir}`);
			continue;
		}
		let canonicalDir;
		try {
			canonicalDir = fs.realpathSync(workspaceDir);
		} catch {
			logVerbose(`Skipping agent "${agentId}": cannot resolve workspace: ${workspaceDir}`);
			continue;
		}
		const skillFilter = resolveAgentSkillsFilter(params.cfg, agentId);
		const existing = workspaceFilters.get(canonicalDir);
		if (existing) {
			existing.skillFilter = mergeSkillFilters(existing.skillFilter, skillFilter);
			continue;
		}
		workspaceFilters.set(canonicalDir, {
			workspaceDir,
			skillFilter
		});
	}
	for (const { workspaceDir, skillFilter } of workspaceFilters.values()) {
		const commands = buildWorkspaceSkillCommandSpecs(workspaceDir, {
			config: params.cfg,
			skillFilter,
			eligibility: { remote: getRemoteSkillEligibility() },
			reservedNames: used
		});
		for (const command of commands) {
			used.add(command.name.toLowerCase());
			entries.push(command);
		}
	}
	return dedupeBySkillName(entries);
}
//#endregion
//#region src/channels/command-gating.ts
function resolveCommandAuthorizedFromAuthorizers(params) {
	const { useAccessGroups, authorizers } = params;
	const mode = params.modeWhenAccessGroupsOff ?? "allow";
	if (!useAccessGroups) {
		if (mode === "allow") return true;
		if (mode === "deny") return false;
		if (!authorizers.some((entry) => entry.configured)) return true;
		return authorizers.some((entry) => entry.configured && entry.allowed);
	}
	return authorizers.some((entry) => entry.configured && entry.allowed);
}
function resolveControlCommandGate(params) {
	const commandAuthorized = resolveCommandAuthorizedFromAuthorizers({
		useAccessGroups: params.useAccessGroups,
		authorizers: params.authorizers,
		modeWhenAccessGroupsOff: params.modeWhenAccessGroupsOff
	});
	return {
		commandAuthorized,
		shouldBlock: params.allowTextCommands && params.hasControlCommand && !commandAuthorized
	};
}
//#endregion
//#region src/channels/logging.ts
function logInboundDrop(params) {
	const target = params.target ? ` target=${params.target}` : "";
	params.log(`${params.channel}: drop ${params.reason}${target}`);
}
function logTypingFailure(params) {
	const target = params.target ? ` target=${params.target}` : "";
	const action = params.action ? ` action=${params.action}` : "";
	params.log(`${params.channel} typing${action} failed${target}: ${String(params.error)}`);
}
//#endregion
//#region src/agents/models-config.merge.ts
function isPositiveFiniteTokenLimit(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function resolvePreferredTokenLimit(params) {
	if (params.explicitPresent && isPositiveFiniteTokenLimit(params.explicitValue)) return params.explicitValue;
	if (isPositiveFiniteTokenLimit(params.implicitValue)) return params.implicitValue;
	return isPositiveFiniteTokenLimit(params.explicitValue) ? params.explicitValue : void 0;
}
function getProviderModelId(model) {
	if (!model || typeof model !== "object") return "";
	const id = model.id;
	return typeof id === "string" ? id.trim() : "";
}
function mergeProviderModels(implicit, explicit) {
	const implicitModels = Array.isArray(implicit.models) ? implicit.models : [];
	const explicitModels = Array.isArray(explicit.models) ? explicit.models : [];
	if (implicitModels.length === 0) return {
		...implicit,
		...explicit
	};
	const implicitById = new Map(implicitModels.map((model) => [getProviderModelId(model), model]).filter(([id]) => Boolean(id)));
	const seen = /* @__PURE__ */ new Set();
	const mergedModels = explicitModels.map((explicitModel) => {
		const id = getProviderModelId(explicitModel);
		if (!id) return explicitModel;
		seen.add(id);
		const implicitModel = implicitById.get(id);
		if (!implicitModel) return explicitModel;
		const contextWindow = resolvePreferredTokenLimit({
			explicitPresent: "contextWindow" in explicitModel,
			explicitValue: explicitModel.contextWindow,
			implicitValue: implicitModel.contextWindow
		});
		const maxTokens = resolvePreferredTokenLimit({
			explicitPresent: "maxTokens" in explicitModel,
			explicitValue: explicitModel.maxTokens,
			implicitValue: implicitModel.maxTokens
		});
		return {
			...explicitModel,
			input: implicitModel.input,
			reasoning: "reasoning" in explicitModel ? explicitModel.reasoning : implicitModel.reasoning,
			...contextWindow === void 0 ? {} : { contextWindow },
			...maxTokens === void 0 ? {} : { maxTokens }
		};
	});
	for (const implicitModel of implicitModels) {
		const id = getProviderModelId(implicitModel);
		if (!id || seen.has(id)) continue;
		seen.add(id);
		mergedModels.push(implicitModel);
	}
	return {
		...implicit,
		...explicit,
		models: mergedModels
	};
}
function mergeProviders(params) {
	const out = params.implicit ? { ...params.implicit } : {};
	for (const [key, explicit] of Object.entries(params.explicit ?? {})) {
		const providerKey = key.trim();
		if (!providerKey) continue;
		const implicit = out[providerKey];
		out[providerKey] = implicit ? mergeProviderModels(implicit, explicit) : explicit;
	}
	return out;
}
function resolveProviderApi(entry) {
	if (typeof entry?.api !== "string") return;
	return entry.api.trim() || void 0;
}
function resolveModelApiSurface(entry) {
	if (!Array.isArray(entry?.models)) return;
	const apis = entry.models.flatMap((model) => {
		if (!model || typeof model !== "object") return [];
		const api = model.api;
		return typeof api === "string" && api.trim() ? [api.trim()] : [];
	}).toSorted();
	return apis.length > 0 ? JSON.stringify(apis) : void 0;
}
function resolveProviderApiSurface(entry) {
	return resolveProviderApi(entry) ?? resolveModelApiSurface(entry);
}
function shouldPreserveExistingApiKey(params) {
	const { providerKey, existing, nextEntry, secretRefManagedProviders } = params;
	const nextApiKey = typeof nextEntry.apiKey === "string" ? nextEntry.apiKey : "";
	if (nextApiKey && isNonSecretApiKeyMarker(nextApiKey)) return false;
	return !secretRefManagedProviders.has(providerKey) && typeof existing.apiKey === "string" && existing.apiKey.length > 0 && !isNonSecretApiKeyMarker(existing.apiKey, { includeEnvVarName: false });
}
function shouldPreserveExistingBaseUrl(params) {
	const { providerKey, existing, nextEntry, explicitBaseUrlProviders } = params;
	if (explicitBaseUrlProviders.has(providerKey) || typeof existing.baseUrl !== "string" || existing.baseUrl.length === 0) return false;
	const existingApi = resolveProviderApiSurface(existing);
	const nextApi = resolveProviderApiSurface(nextEntry);
	return !existingApi || !nextApi || existingApi === nextApi;
}
function mergeWithExistingProviderSecrets(params) {
	const { nextProviders, existingProviders, secretRefManagedProviders, explicitBaseUrlProviders } = params;
	const mergedProviders = {};
	for (const [key, entry] of Object.entries(existingProviders)) mergedProviders[key] = entry;
	for (const [key, newEntry] of Object.entries(nextProviders)) {
		const existing = existingProviders[key];
		if (!existing) {
			mergedProviders[key] = newEntry;
			continue;
		}
		const preserved = {};
		if (shouldPreserveExistingApiKey({
			providerKey: key,
			existing,
			nextEntry: newEntry,
			secretRefManagedProviders
		})) preserved.apiKey = existing.apiKey;
		if (shouldPreserveExistingBaseUrl({
			providerKey: key,
			existing,
			nextEntry: newEntry,
			explicitBaseUrlProviders
		})) preserved.baseUrl = existing.baseUrl;
		mergedProviders[key] = {
			...newEntry,
			...preserved
		};
	}
	return mergedProviders;
}
//#endregion
//#region src/agents/models-config.plan.ts
async function resolveProvidersForModelsJson(params) {
	const { cfg, agentDir, env } = params;
	const explicitProviders = cfg.models?.providers ?? {};
	return mergeProviders({
		implicit: await resolveImplicitProviders({
			agentDir,
			config: cfg,
			env,
			explicitProviders
		}),
		explicit: explicitProviders
	});
}
function resolveExplicitBaseUrlProviders(providers) {
	return new Set(Object.entries(providers?.providers ?? {}).map(([key, provider]) => [key.trim(), provider]).filter(([key, provider]) => Boolean(key) && typeof provider?.baseUrl === "string" && provider.baseUrl.trim()).map(([key]) => key));
}
async function resolveProvidersForMode(params) {
	if (params.mode !== "merge") return params.providers;
	const existing = params.existingParsed;
	if (!isRecord(existing) || !isRecord(existing.providers)) return params.providers;
	const existingProviders = existing.providers;
	return mergeWithExistingProviderSecrets({
		nextProviders: params.providers,
		existingProviders,
		secretRefManagedProviders: params.secretRefManagedProviders,
		explicitBaseUrlProviders: params.explicitBaseUrlProviders
	});
}
async function planOpenClawModelsJson(params) {
	const { cfg, agentDir, env } = params;
	const providers = await resolveProvidersForModelsJson({
		cfg,
		agentDir,
		env
	});
	if (Object.keys(providers).length === 0) return { action: "skip" };
	const mode = cfg.models?.mode ?? "merge";
	const secretRefManagedProviders = /* @__PURE__ */ new Set();
	const normalizedProviders = normalizeProviders({
		providers,
		agentDir,
		env,
		secretDefaults: cfg.secrets?.defaults,
		secretRefManagedProviders
	}) ?? providers;
	const mergedProviders = await resolveProvidersForMode({
		mode,
		existingParsed: params.existingParsed,
		providers: normalizedProviders,
		secretRefManagedProviders,
		explicitBaseUrlProviders: resolveExplicitBaseUrlProviders(cfg.models)
	});
	const nextContents = `${JSON.stringify({ providers: mergedProviders }, null, 2)}\n`;
	if (params.existingRaw === nextContents) return { action: "noop" };
	return {
		action: "write",
		contents: nextContents
	};
}
//#endregion
//#region src/agents/models-config.ts
const MODELS_JSON_WRITE_LOCKS = /* @__PURE__ */ new Map();
async function readExistingModelsFile(pathname) {
	try {
		const raw = await fs$1.readFile(pathname, "utf8");
		return {
			raw,
			parsed: JSON.parse(raw)
		};
	} catch {
		return {
			raw: "",
			parsed: null
		};
	}
}
async function ensureModelsFileMode(pathname) {
	await fs$1.chmod(pathname, 384).catch(() => {});
}
async function writeModelsFileAtomic(targetPath, contents) {
	const tempPath = `${targetPath}.${process.pid}.${Date.now()}.tmp`;
	await fs$1.writeFile(tempPath, contents, { mode: 384 });
	await fs$1.rename(tempPath, targetPath);
}
function resolveModelsConfigInput(config) {
	const runtimeSource = getRuntimeConfigSourceSnapshot();
	if (!config) return runtimeSource ?? loadConfig();
	if (!runtimeSource) return config;
	return projectConfigOntoRuntimeSourceSnapshot(config);
}
async function withModelsJsonWriteLock(targetPath, run) {
	const prior = MODELS_JSON_WRITE_LOCKS.get(targetPath) ?? Promise.resolve();
	let release = () => {};
	const gate = new Promise((resolve) => {
		release = resolve;
	});
	const pending = prior.then(() => gate);
	MODELS_JSON_WRITE_LOCKS.set(targetPath, pending);
	try {
		await prior;
		return await run();
	} finally {
		release();
		if (MODELS_JSON_WRITE_LOCKS.get(targetPath) === pending) MODELS_JSON_WRITE_LOCKS.delete(targetPath);
	}
}
async function ensureOpenClawModelsJson(config, agentDirOverride) {
	const cfg = resolveModelsConfigInput(config);
	const agentDir = agentDirOverride?.trim() ? agentDirOverride.trim() : resolveOpenClawAgentDir();
	const targetPath = path.join(agentDir, "models.json");
	return await withModelsJsonWriteLock(targetPath, async () => {
		const env = createConfigRuntimeEnv(cfg);
		const existingModelsFile = await readExistingModelsFile(targetPath);
		const plan = await planOpenClawModelsJson({
			cfg,
			agentDir,
			env,
			existingRaw: existingModelsFile.raw,
			existingParsed: existingModelsFile.parsed
		});
		if (plan.action === "skip") return {
			agentDir,
			wrote: false
		};
		if (plan.action === "noop") {
			await ensureModelsFileMode(targetPath);
			return {
				agentDir,
				wrote: false
			};
		}
		await fs$1.mkdir(agentDir, {
			recursive: true,
			mode: 448
		});
		await writeModelsFileAtomic(targetPath, plan.contents);
		await ensureModelsFileMode(targetPath);
		return {
			agentDir,
			wrote: true
		};
	});
}
//#endregion
//#region src/agents/model-catalog.ts
const log = createSubsystemLogger("model-catalog");
let modelCatalogPromise = null;
let hasLoggedModelCatalogError = false;
const defaultImportPiSdk = () => import("./pi-model-discovery-BmRBqNWF.js");
let importPiSdk = defaultImportPiSdk;
const CODEX_PROVIDER = "openai-codex";
const OPENAI_PROVIDER = "openai";
const OPENAI_GPT54_MODEL_ID = "gpt-5.4";
const OPENAI_GPT54_PRO_MODEL_ID = "gpt-5.4-pro";
const OPENAI_CODEX_GPT53_MODEL_ID = "gpt-5.3-codex";
const OPENAI_CODEX_GPT53_SPARK_MODEL_ID = "gpt-5.3-codex-spark";
const OPENAI_CODEX_GPT54_MODEL_ID = "gpt-5.4";
const NON_PI_NATIVE_MODEL_PROVIDERS = new Set(["kilocode"]);
const SYNTHETIC_CATALOG_FALLBACKS = [
	{
		provider: OPENAI_PROVIDER,
		id: OPENAI_GPT54_MODEL_ID,
		templateIds: ["gpt-5.2"]
	},
	{
		provider: OPENAI_PROVIDER,
		id: OPENAI_GPT54_PRO_MODEL_ID,
		templateIds: ["gpt-5.2-pro", "gpt-5.2"]
	},
	{
		provider: CODEX_PROVIDER,
		id: OPENAI_CODEX_GPT54_MODEL_ID,
		templateIds: ["gpt-5.3-codex", "gpt-5.2-codex"]
	},
	{
		provider: CODEX_PROVIDER,
		id: OPENAI_CODEX_GPT53_SPARK_MODEL_ID,
		templateIds: [OPENAI_CODEX_GPT53_MODEL_ID]
	}
];
function applySyntheticCatalogFallbacks(models) {
	const findCatalogEntry = (provider, id) => models.find((entry) => entry.provider.toLowerCase() === provider.toLowerCase() && entry.id.toLowerCase() === id.toLowerCase());
	for (const fallback of SYNTHETIC_CATALOG_FALLBACKS) {
		if (findCatalogEntry(fallback.provider, fallback.id)) continue;
		const template = fallback.templateIds.map((templateId) => findCatalogEntry(fallback.provider, templateId)).find((entry) => entry !== void 0);
		if (!template) continue;
		models.push({
			...template,
			id: fallback.id,
			name: fallback.id
		});
	}
}
function normalizeConfiguredModelInput(input) {
	if (!Array.isArray(input)) return;
	const normalized = input.filter((item) => item === "text" || item === "image" || item === "document");
	return normalized.length > 0 ? normalized : void 0;
}
function readConfiguredOptInProviderModels(config) {
	const providers = config.models?.providers;
	if (!providers || typeof providers !== "object") return [];
	const out = [];
	for (const [providerRaw, providerValue] of Object.entries(providers)) {
		const provider = providerRaw.toLowerCase().trim();
		if (!NON_PI_NATIVE_MODEL_PROVIDERS.has(provider)) continue;
		if (!providerValue || typeof providerValue !== "object") continue;
		const configuredModels = providerValue.models;
		if (!Array.isArray(configuredModels)) continue;
		for (const configuredModel of configuredModels) {
			if (!configuredModel || typeof configuredModel !== "object") continue;
			const idRaw = configuredModel.id;
			if (typeof idRaw !== "string") continue;
			const id = idRaw.trim();
			if (!id) continue;
			const rawName = configuredModel.name;
			const name = (typeof rawName === "string" ? rawName : id).trim() || id;
			const contextWindowRaw = configuredModel.contextWindow;
			const contextWindow = typeof contextWindowRaw === "number" && contextWindowRaw > 0 ? contextWindowRaw : void 0;
			const reasoningRaw = configuredModel.reasoning;
			const reasoning = typeof reasoningRaw === "boolean" ? reasoningRaw : void 0;
			const input = normalizeConfiguredModelInput(configuredModel.input);
			out.push({
				id,
				name,
				provider,
				contextWindow,
				reasoning,
				input
			});
		}
	}
	return out;
}
function mergeConfiguredOptInProviderModels(params) {
	const configured = readConfiguredOptInProviderModels(params.config);
	if (configured.length === 0) return;
	const seen = new Set(params.models.map((entry) => `${entry.provider.toLowerCase().trim()}::${entry.id.toLowerCase().trim()}`));
	for (const entry of configured) {
		const key = `${entry.provider.toLowerCase().trim()}::${entry.id.toLowerCase().trim()}`;
		if (seen.has(key)) continue;
		params.models.push(entry);
		seen.add(key);
	}
}
async function loadModelCatalog(params) {
	if (params?.useCache === false) modelCatalogPromise = null;
	if (modelCatalogPromise) return modelCatalogPromise;
	modelCatalogPromise = (async () => {
		const models = [];
		const sortModels = (entries) => entries.sort((a, b) => {
			const p = a.provider.localeCompare(b.provider);
			if (p !== 0) return p;
			return a.name.localeCompare(b.name);
		});
		try {
			const cfg = params?.config ?? loadConfig();
			await ensureOpenClawModelsJson(cfg);
			const piSdk = await importPiSdk();
			const agentDir = resolveOpenClawAgentDir();
			const { join } = await import("node:path");
			const authStorage = piSdk.discoverAuthStorage(agentDir);
			const registry = new piSdk.ModelRegistry(authStorage, join(agentDir, "models.json"));
			const entries = Array.isArray(registry) ? registry : registry.getAll();
			for (const entry of entries) {
				const id = String(entry?.id ?? "").trim();
				if (!id) continue;
				const provider = String(entry?.provider ?? "").trim();
				if (!provider) continue;
				const name = String(entry?.name ?? id).trim() || id;
				const contextWindow = typeof entry?.contextWindow === "number" && entry.contextWindow > 0 ? entry.contextWindow : void 0;
				const reasoning = typeof entry?.reasoning === "boolean" ? entry.reasoning : void 0;
				const input = Array.isArray(entry?.input) ? entry.input : void 0;
				models.push({
					id,
					name,
					provider,
					contextWindow,
					reasoning,
					input
				});
			}
			mergeConfiguredOptInProviderModels({
				config: cfg,
				models
			});
			applySyntheticCatalogFallbacks(models);
			if (models.length === 0) modelCatalogPromise = null;
			return sortModels(models);
		} catch (error) {
			if (!hasLoggedModelCatalogError) {
				hasLoggedModelCatalogError = true;
				log.warn(`Failed to load model catalog: ${String(error)}`);
			}
			modelCatalogPromise = null;
			if (models.length > 0) return sortModels(models);
			return [];
		}
	})();
	return modelCatalogPromise;
}
//#endregion
//#region src/auto-reply/reply/commands-models.ts
/**
* Build provider/model data from config and catalog.
* Exported for reuse by callback handlers.
*/
async function buildModelsProviderData(cfg, agentId) {
	const resolvedDefault = resolveDefaultModelForAgent({
		cfg,
		agentId
	});
	const allowed = buildAllowedModelSet({
		cfg,
		catalog: await loadModelCatalog({ config: cfg }),
		defaultProvider: resolvedDefault.provider,
		defaultModel: resolvedDefault.model
	});
	const aliasIndex = buildModelAliasIndex({
		cfg,
		defaultProvider: resolvedDefault.provider
	});
	const byProvider = /* @__PURE__ */ new Map();
	const add = (p, m) => {
		const key = normalizeProviderId(p);
		const set = byProvider.get(key) ?? /* @__PURE__ */ new Set();
		set.add(m);
		byProvider.set(key, set);
	};
	const addRawModelRef = (raw) => {
		const trimmed = raw?.trim();
		if (!trimmed) return;
		const resolved = resolveModelRefFromString({
			raw: trimmed,
			defaultProvider: resolvedDefault.provider,
			aliasIndex
		});
		if (!resolved) return;
		add(resolved.ref.provider, resolved.ref.model);
	};
	const addModelConfigEntries = () => {
		const modelConfig = cfg.agents?.defaults?.model;
		if (typeof modelConfig === "string") addRawModelRef(modelConfig);
		else if (modelConfig && typeof modelConfig === "object") {
			addRawModelRef(modelConfig.primary);
			for (const fallback of modelConfig.fallbacks ?? []) addRawModelRef(fallback);
		}
		const imageConfig = cfg.agents?.defaults?.imageModel;
		if (typeof imageConfig === "string") addRawModelRef(imageConfig);
		else if (imageConfig && typeof imageConfig === "object") {
			addRawModelRef(imageConfig.primary);
			for (const fallback of imageConfig.fallbacks ?? []) addRawModelRef(fallback);
		}
	};
	for (const entry of allowed.allowedCatalog) add(entry.provider, entry.id);
	for (const raw of Object.keys(cfg.agents?.defaults?.models ?? {})) addRawModelRef(raw);
	add(resolvedDefault.provider, resolvedDefault.model);
	addModelConfigEntries();
	return {
		byProvider,
		providers: [...byProvider.keys()].toSorted(),
		resolvedDefault
	};
}
//#endregion
//#region src/infra/backoff.ts
function computeBackoff(policy, attempt) {
	const base = policy.initialMs * policy.factor ** Math.max(attempt - 1, 0);
	const jitter = base * policy.jitter * Math.random();
	return Math.min(policy.maxMs, Math.round(base + jitter));
}
//#endregion
//#region src/agents/context.ts
const CONFIG_LOAD_RETRY_POLICY = {
	initialMs: 1e3,
	maxMs: 6e4,
	factor: 2,
	jitter: 0
};
function applyDiscoveredContextWindows(params) {
	for (const model of params.models) {
		if (!model?.id) continue;
		const contextWindow = typeof model.contextWindow === "number" ? Math.trunc(model.contextWindow) : void 0;
		if (!contextWindow || contextWindow <= 0) continue;
		const existing = params.cache.get(model.id);
		if (existing === void 0 || contextWindow < existing) params.cache.set(model.id, contextWindow);
	}
}
function applyConfiguredContextWindows(params) {
	const providers = params.modelsConfig?.providers;
	if (!providers || typeof providers !== "object") return;
	for (const provider of Object.values(providers)) {
		if (!Array.isArray(provider?.models)) continue;
		for (const model of provider.models) {
			const modelId = typeof model?.id === "string" ? model.id : void 0;
			const contextWindow = typeof model?.contextWindow === "number" ? model.contextWindow : void 0;
			if (!modelId || !contextWindow || contextWindow <= 0) continue;
			params.cache.set(modelId, contextWindow);
		}
	}
}
const MODEL_CACHE = /* @__PURE__ */ new Map();
let loadPromise = null;
let configuredConfig;
let configLoadFailures = 0;
let nextConfigLoadAttemptAtMs = 0;
function getCommandPathFromArgv(argv) {
	const args = argv.slice(2);
	const tokens = [];
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (!arg || arg === "--") break;
		const consumed = consumeRootOptionToken(args, i);
		if (consumed > 0) {
			i += consumed - 1;
			continue;
		}
		if (arg.startsWith("-")) continue;
		tokens.push(arg);
		if (tokens.length >= 2) break;
	}
	return tokens;
}
function shouldSkipEagerContextWindowWarmup(argv = process.argv) {
	const [primary, secondary] = getCommandPathFromArgv(argv);
	return primary === "config" && secondary === "validate";
}
function primeConfiguredContextWindows() {
	if (configuredConfig) return configuredConfig;
	if (Date.now() < nextConfigLoadAttemptAtMs) return;
	try {
		const cfg = loadConfig();
		applyConfiguredContextWindows({
			cache: MODEL_CACHE,
			modelsConfig: cfg.models
		});
		configuredConfig = cfg;
		configLoadFailures = 0;
		nextConfigLoadAttemptAtMs = 0;
		return cfg;
	} catch {
		configLoadFailures += 1;
		const backoffMs = computeBackoff(CONFIG_LOAD_RETRY_POLICY, configLoadFailures);
		nextConfigLoadAttemptAtMs = Date.now() + backoffMs;
		return;
	}
}
function ensureContextWindowCacheLoaded() {
	if (loadPromise) return loadPromise;
	const cfg = primeConfiguredContextWindows();
	if (!cfg) return Promise.resolve();
	loadPromise = (async () => {
		try {
			await ensureOpenClawModelsJson(cfg);
		} catch {}
		try {
			const { discoverAuthStorage, discoverModels } = await import("./pi-model-discovery-BmRBqNWF.js");
			const agentDir = resolveOpenClawAgentDir();
			const modelRegistry = discoverModels(discoverAuthStorage(agentDir), agentDir);
			applyDiscoveredContextWindows({
				cache: MODEL_CACHE,
				models: typeof modelRegistry.getAvailable === "function" ? modelRegistry.getAvailable() : modelRegistry.getAll()
			});
		} catch {}
		applyConfiguredContextWindows({
			cache: MODEL_CACHE,
			modelsConfig: cfg.models
		});
	})().catch(() => {});
	return loadPromise;
}
if (!shouldSkipEagerContextWindowWarmup()) ensureContextWindowCacheLoaded();
//#endregion
//#region src/auto-reply/reply/model-selection.ts
function resolveModelOverrideFromEntry(entry) {
	const model = entry?.modelOverride?.trim();
	if (!model) return null;
	return {
		provider: entry?.providerOverride?.trim() || void 0,
		model
	};
}
function resolveParentSessionKeyCandidate(params) {
	const explicit = params.parentSessionKey?.trim();
	if (explicit && explicit !== params.sessionKey) return explicit;
	const derived = resolveThreadParentSessionKey(params.sessionKey);
	if (derived && derived !== params.sessionKey) return derived;
	return null;
}
function resolveStoredModelOverride(params) {
	const direct = resolveModelOverrideFromEntry(params.sessionEntry);
	if (direct) return {
		...direct,
		source: "session"
	};
	const parentKey = resolveParentSessionKeyCandidate({
		sessionKey: params.sessionKey,
		parentSessionKey: params.parentSessionKey
	});
	if (!parentKey || !params.sessionStore) return null;
	const parentEntry = params.sessionStore[parentKey];
	const parentOverride = resolveModelOverrideFromEntry(parentEntry);
	if (!parentOverride) return null;
	return {
		...parentOverride,
		source: "parent"
	};
}
//#endregion
//#region src/channels/plugins/config-schema.ts
const AllowFromEntrySchema = z.union([z.string(), z.number()]);
z.array(AllowFromEntrySchema).optional();
function buildChannelConfigSchema(schema) {
	const schemaWithJson = schema;
	if (typeof schemaWithJson.toJSONSchema === "function") return { schema: schemaWithJson.toJSONSchema({
		target: "draft-07",
		unrepresentable: "any"
	}) };
	return { schema: {
		type: "object",
		additionalProperties: true
	} };
}
//#endregion
//#region src/channels/plugins/media-limits.ts
const MB$1 = 1024 * 1024;
function resolveChannelMediaMaxBytes(params) {
	const accountId = normalizeAccountId(params.accountId);
	const channelLimit = params.resolveChannelLimitMb({
		cfg: params.cfg,
		accountId
	});
	if (channelLimit) return channelLimit * MB$1;
	if (params.cfg.agents?.defaults?.mediaMaxMb) return params.cfg.agents.defaults.mediaMaxMb * MB$1;
}
//#endregion
//#region src/secrets/provider-env-vars.ts
const PROVIDER_ENV_VARS = {
	openai: ["OPENAI_API_KEY"],
	anthropic: ["ANTHROPIC_API_KEY"],
	google: ["GEMINI_API_KEY"],
	minimax: ["MINIMAX_API_KEY"],
	"minimax-cn": ["MINIMAX_API_KEY"],
	moonshot: ["MOONSHOT_API_KEY"],
	"kimi-coding": ["KIMI_API_KEY", "KIMICODE_API_KEY"],
	synthetic: ["SYNTHETIC_API_KEY"],
	venice: ["VENICE_API_KEY"],
	zai: ["ZAI_API_KEY", "Z_AI_API_KEY"],
	xiaomi: ["XIAOMI_API_KEY"],
	openrouter: ["OPENROUTER_API_KEY"],
	"cloudflare-ai-gateway": ["CLOUDFLARE_AI_GATEWAY_API_KEY"],
	litellm: ["LITELLM_API_KEY"],
	"vercel-ai-gateway": ["AI_GATEWAY_API_KEY"],
	opencode: ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
	"opencode-go": ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
	together: ["TOGETHER_API_KEY"],
	huggingface: ["HUGGINGFACE_HUB_TOKEN", "HF_TOKEN"],
	qianfan: ["QIANFAN_API_KEY"],
	xai: ["XAI_API_KEY"],
	mistral: ["MISTRAL_API_KEY"],
	kilocode: ["KILOCODE_API_KEY"],
	modelstudio: ["MODELSTUDIO_API_KEY"],
	volcengine: ["VOLCANO_ENGINE_API_KEY"],
	byteplus: ["BYTEPLUS_API_KEY"]
};
const EXTRA_PROVIDER_AUTH_ENV_VARS = [
	"VOYAGE_API_KEY",
	"GROQ_API_KEY",
	"DEEPGRAM_API_KEY",
	"CEREBRAS_API_KEY",
	"NVIDIA_API_KEY",
	"COPILOT_GITHUB_TOKEN",
	"GH_TOKEN",
	"GITHUB_TOKEN",
	"ANTHROPIC_OAUTH_TOKEN",
	"CHUTES_OAUTH_TOKEN",
	"CHUTES_API_KEY",
	"QWEN_OAUTH_TOKEN",
	"QWEN_PORTAL_API_KEY",
	"MINIMAX_OAUTH_TOKEN",
	"OLLAMA_API_KEY",
	"VLLM_API_KEY"
];
const KNOWN_SECRET_ENV_VARS = [...new Set(Object.values(PROVIDER_ENV_VARS).flatMap((keys) => keys))];
[...new Set([...KNOWN_SECRET_ENV_VARS, ...EXTRA_PROVIDER_AUTH_ENV_VARS])];
//#endregion
//#region src/commands/auth-choice.apply-helpers.ts
function formatErrorMessage(error) {
	if (error instanceof Error && typeof error.message === "string" && error.message.trim()) return error.message;
	return String(error);
}
function resolveDefaultProviderEnvVar(provider) {
	return PROVIDER_ENV_VARS[provider]?.find((candidate) => candidate.trim().length > 0);
}
function resolveDefaultFilePointerId(provider) {
	return `/providers/${encodeJsonPointerToken(provider)}/apiKey`;
}
async function promptSecretRefForOnboarding(params) {
	const defaultEnvVar = params.preferredEnvVar ?? resolveDefaultProviderEnvVar(params.provider) ?? "";
	const defaultFilePointer = resolveDefaultFilePointerId(params.provider);
	let sourceChoice = "env";
	while (true) {
		const source = await params.prompter.select({
			message: params.copy?.sourceMessage ?? "Where is this API key stored?",
			initialValue: sourceChoice,
			options: [{
				value: "env",
				label: "Environment variable",
				hint: "Reference a variable from your runtime environment"
			}, {
				value: "provider",
				label: "Configured secret provider",
				hint: "Use a configured file or exec secret provider"
			}]
		}) === "provider" ? "provider" : "env";
		sourceChoice = source;
		if (source === "env") {
			const envVarRaw = await params.prompter.text({
				message: params.copy?.envVarMessage ?? "Environment variable name",
				initialValue: defaultEnvVar || void 0,
				placeholder: params.copy?.envVarPlaceholder ?? "OPENAI_API_KEY",
				validate: (value) => {
					const candidate = value.trim();
					if (!isValidEnvSecretRefId(candidate)) return params.copy?.envVarFormatError ?? "Use an env var name like \"OPENAI_API_KEY\" (uppercase letters, numbers, underscores).";
					if (!process.env[candidate]?.trim()) return params.copy?.envVarMissingError?.(candidate) ?? `Environment variable "${candidate}" is missing or empty in this session.`;
				}
			});
			const envCandidate = String(envVarRaw ?? "").trim();
			const envVar = envCandidate && isValidEnvSecretRefId(envCandidate) ? envCandidate : defaultEnvVar;
			if (!envVar) throw new Error(`No valid environment variable name provided for provider "${params.provider}".`);
			const ref = {
				source: "env",
				provider: resolveDefaultSecretProviderAlias(params.config, "env", { preferFirstProviderForSource: true }),
				id: envVar
			};
			const resolvedValue = await resolveSecretRefString(ref, {
				config: params.config,
				env: process.env
			});
			await params.prompter.note(params.copy?.envValidatedMessage?.(envVar) ?? `Validated environment variable ${envVar}. OpenClaw will store a reference, not the key value.`, "Reference validated");
			return {
				ref,
				resolvedValue
			};
		}
		const externalProviders = Object.entries(params.config.secrets?.providers ?? {}).filter(([, provider]) => provider?.source === "file" || provider?.source === "exec");
		if (externalProviders.length === 0) {
			await params.prompter.note(params.copy?.noProvidersMessage ?? "No file/exec secret providers are configured yet. Add one under secrets.providers, or select Environment variable.", "No providers configured");
			continue;
		}
		const defaultProvider = resolveDefaultSecretProviderAlias(params.config, "file", { preferFirstProviderForSource: true });
		const selectedProvider = await params.prompter.select({
			message: "Select secret provider",
			initialValue: externalProviders.find(([providerName]) => providerName === defaultProvider)?.[0] ?? externalProviders[0]?.[0],
			options: externalProviders.map(([providerName, provider]) => ({
				value: providerName,
				label: providerName,
				hint: provider?.source === "exec" ? "Exec provider" : "File provider"
			}))
		});
		const providerEntry = params.config.secrets?.providers?.[selectedProvider];
		if (!providerEntry || providerEntry.source !== "file" && providerEntry.source !== "exec") {
			await params.prompter.note(`Provider "${selectedProvider}" is not a file/exec provider.`, "Invalid provider");
			continue;
		}
		const idPrompt = providerEntry.source === "file" ? "Secret id (JSON pointer for json mode, or 'value' for singleValue mode)" : "Secret id for the exec provider";
		const idDefault = providerEntry.source === "file" ? providerEntry.mode === "singleValue" ? "value" : defaultFilePointer : `${params.provider}/apiKey`;
		const idRaw = await params.prompter.text({
			message: idPrompt,
			initialValue: idDefault,
			placeholder: providerEntry.source === "file" ? "/providers/openai/apiKey" : "openai/api-key",
			validate: (value) => {
				const candidate = value.trim();
				if (!candidate) return "Secret id cannot be empty.";
				if (providerEntry.source === "file" && providerEntry.mode !== "singleValue" && !isValidFileSecretRefId(candidate)) return "Use an absolute JSON pointer like \"/providers/openai/apiKey\".";
				if (providerEntry.source === "file" && providerEntry.mode === "singleValue" && candidate !== "value") return "singleValue mode expects id \"value\".";
				if (providerEntry.source === "exec" && !isValidExecSecretRefId(candidate)) return formatExecSecretRefIdValidationMessage();
			}
		});
		const id = String(idRaw ?? "").trim() || idDefault;
		const ref = {
			source: providerEntry.source,
			provider: selectedProvider,
			id
		};
		try {
			const resolvedValue = await resolveSecretRefString(ref, {
				config: params.config,
				env: process.env
			});
			await params.prompter.note(params.copy?.providerValidatedMessage?.(selectedProvider, id, providerEntry.source) ?? `Validated ${providerEntry.source} reference ${selectedProvider}:${id}. OpenClaw will store a reference, not the key value.`, "Reference validated");
			return {
				ref,
				resolvedValue
			};
		} catch (error) {
			await params.prompter.note([
				`Could not validate provider reference ${selectedProvider}:${id}.`,
				formatErrorMessage(error),
				"Check your provider configuration and try again."
			].join("\n"), "Reference check failed");
		}
	}
}
async function resolveSecretInputModeForEnvSelection(params) {
	if (params.explicitMode) return params.explicitMode;
	if (typeof params.prompter.select !== "function") return "plaintext";
	return await params.prompter.select({
		message: params.copy?.modeMessage ?? "How do you want to provide this API key?",
		initialValue: "plaintext",
		options: [{
			value: "plaintext",
			label: params.copy?.plaintextLabel ?? "Paste API key now",
			hint: params.copy?.plaintextHint ?? "Stores the key directly in OpenClaw config"
		}, {
			value: "ref",
			label: params.copy?.refLabel ?? "Use external secret provider",
			hint: params.copy?.refHint ?? "Stores a reference to env or configured external secret providers"
		}]
	}) === "ref" ? "ref" : "plaintext";
}
//#endregion
//#region src/plugin-sdk/onboarding.ts
async function promptAccountId$1(params) {
	const existingIds = params.listAccountIds(params.cfg);
	const initial = params.currentId?.trim() || params.defaultAccountId || "default";
	const choice = await params.prompter.select({
		message: `${params.label} account`,
		options: [...existingIds.map((id) => ({
			value: id,
			label: id === "default" ? "default (primary)" : id
		})), {
			value: "__new__",
			label: "Add a new account"
		}],
		initialValue: initial
	});
	if (choice !== "__new__") return normalizeAccountId(choice);
	const entered = await params.prompter.text({
		message: `New ${params.label} account id`,
		validate: (value) => value?.trim() ? void 0 : "Required"
	});
	const normalized = normalizeAccountId(String(entered));
	if (String(entered).trim() !== normalized) await params.prompter.note(`Normalized account id to "${normalized}".`, `${params.label} account`);
	return normalized;
}
//#endregion
//#region src/channels/plugins/setup-helpers.ts
function channelHasAccounts(cfg, channelKey) {
	const base = cfg.channels?.[channelKey];
	return Boolean(base?.accounts && Object.keys(base.accounts).length > 0);
}
function shouldStoreNameInAccounts(params) {
	if (params.alwaysUseAccounts) return true;
	if (params.accountId !== "default") return true;
	return channelHasAccounts(params.cfg, params.channelKey);
}
function applyAccountNameToChannelSection(params) {
	const trimmed = params.name?.trim();
	if (!trimmed) return params.cfg;
	const accountId = normalizeAccountId(params.accountId);
	const baseConfig = params.cfg.channels?.[params.channelKey];
	const base = typeof baseConfig === "object" && baseConfig ? baseConfig : void 0;
	if (!shouldStoreNameInAccounts({
		cfg: params.cfg,
		channelKey: params.channelKey,
		accountId,
		alwaysUseAccounts: params.alwaysUseAccounts
	}) && accountId === "default") {
		const safeBase = base ?? {};
		return {
			...params.cfg,
			channels: {
				...params.cfg.channels,
				[params.channelKey]: {
					...safeBase,
					name: trimmed
				}
			}
		};
	}
	const baseAccounts = base?.accounts ?? {};
	const existingAccount = baseAccounts[accountId] ?? {};
	const baseWithoutName = accountId === "default" ? (({ name: _ignored, ...rest }) => rest)(base ?? {}) : base ?? {};
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channelKey]: {
				...baseWithoutName,
				accounts: {
					...baseAccounts,
					[accountId]: {
						...existingAccount,
						name: trimmed
					}
				}
			}
		}
	};
}
function migrateBaseNameToDefaultAccount(params) {
	if (params.alwaysUseAccounts) return params.cfg;
	const base = params.cfg.channels?.[params.channelKey];
	const baseName = base?.name?.trim();
	if (!baseName) return params.cfg;
	const accounts = { ...base?.accounts };
	const defaultAccount = accounts["default"] ?? {};
	if (!defaultAccount.name) accounts[DEFAULT_ACCOUNT_ID] = {
		...defaultAccount,
		name: baseName
	};
	const { name: _ignored, ...rest } = base ?? {};
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channelKey]: {
				...rest,
				accounts
			}
		}
	};
}
function applySetupAccountConfigPatch(params) {
	return patchScopedAccountConfig({
		cfg: params.cfg,
		channelKey: params.channelKey,
		accountId: params.accountId,
		patch: params.patch
	});
}
function patchScopedAccountConfig(params) {
	const accountId = normalizeAccountId(params.accountId);
	const channelConfig = params.cfg.channels?.[params.channelKey];
	const base = typeof channelConfig === "object" && channelConfig ? channelConfig : void 0;
	const ensureChannelEnabled = params.ensureChannelEnabled ?? true;
	const ensureAccountEnabled = params.ensureAccountEnabled ?? ensureChannelEnabled;
	const patch = params.patch;
	const accountPatch = params.accountPatch ?? patch;
	if (accountId === "default") return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channelKey]: {
				...base,
				...ensureChannelEnabled ? { enabled: true } : {},
				...patch
			}
		}
	};
	const accounts = base?.accounts ?? {};
	const existingAccount = accounts[accountId] ?? {};
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channelKey]: {
				...base,
				...ensureChannelEnabled ? { enabled: true } : {},
				accounts: {
					...accounts,
					[accountId]: {
						...existingAccount,
						...ensureAccountEnabled ? { enabled: typeof existingAccount.enabled === "boolean" ? existingAccount.enabled : true } : {},
						...accountPatch
					}
				}
			}
		}
	};
}
//#endregion
//#region src/channels/plugins/onboarding/helpers.ts
const promptAccountId = async (params) => {
	return await promptAccountId$1(params);
};
async function resolveAccountIdForConfigure(params) {
	const override = params.accountOverride?.trim();
	let accountId = override ? normalizeAccountId(override) : params.defaultAccountId;
	if (params.shouldPromptAccountIds && !override) accountId = await promptAccountId({
		cfg: params.cfg,
		prompter: params.prompter,
		label: params.label,
		currentId: accountId,
		listAccountIds: params.listAccountIds,
		defaultAccountId: params.defaultAccountId
	});
	return accountId;
}
function buildSingleChannelSecretPromptState(params) {
	return {
		accountConfigured: params.accountConfigured,
		hasConfigToken: params.hasConfigToken,
		canUseEnv: params.allowEnv && Boolean(params.envValue?.trim()) && !params.hasConfigToken
	};
}
async function promptSingleChannelToken(params) {
	const promptToken = async () => String(await params.prompter.text({
		message: params.inputPrompt,
		validate: (value) => value?.trim() ? void 0 : "Required"
	})).trim();
	if (params.canUseEnv) {
		if (await params.prompter.confirm({
			message: params.envPrompt,
			initialValue: true
		})) return {
			useEnv: true,
			token: null
		};
		return {
			useEnv: false,
			token: await promptToken()
		};
	}
	if (params.hasConfigToken && params.accountConfigured) {
		if (await params.prompter.confirm({
			message: params.keepPrompt,
			initialValue: true
		})) return {
			useEnv: false,
			token: null
		};
	}
	return {
		useEnv: false,
		token: await promptToken()
	};
}
async function runSingleChannelSecretStep(params) {
	const promptState = buildSingleChannelSecretPromptState({
		accountConfigured: params.accountConfigured,
		hasConfigToken: params.hasConfigToken,
		allowEnv: params.allowEnv,
		envValue: params.envValue
	});
	if (!promptState.accountConfigured && params.onMissingConfigured) await params.onMissingConfigured();
	const result = await promptSingleChannelSecretInput({
		cfg: params.cfg,
		prompter: params.prompter,
		providerHint: params.providerHint,
		credentialLabel: params.credentialLabel,
		secretInputMode: params.secretInputMode,
		accountConfigured: promptState.accountConfigured,
		canUseEnv: promptState.canUseEnv,
		hasConfigToken: promptState.hasConfigToken,
		envPrompt: params.envPrompt,
		keepPrompt: params.keepPrompt,
		inputPrompt: params.inputPrompt,
		preferredEnvVar: params.preferredEnvVar
	});
	if (result.action === "use-env") return {
		cfg: params.applyUseEnv ? await params.applyUseEnv(params.cfg) : params.cfg,
		action: result.action,
		resolvedValue: params.envValue?.trim() || void 0
	};
	if (result.action === "set") return {
		cfg: params.applySet ? await params.applySet(params.cfg, result.value, result.resolvedValue) : params.cfg,
		action: result.action,
		resolvedValue: result.resolvedValue
	};
	return {
		cfg: params.cfg,
		action: result.action
	};
}
async function promptSingleChannelSecretInput(params) {
	if (await resolveSecretInputModeForEnvSelection({
		prompter: params.prompter,
		explicitMode: params.secretInputMode,
		copy: {
			modeMessage: `How do you want to provide this ${params.credentialLabel}?`,
			plaintextLabel: `Enter ${params.credentialLabel}`,
			plaintextHint: "Stores the credential directly in OpenClaw config",
			refLabel: "Use external secret provider",
			refHint: "Stores a reference to env or configured external secret providers"
		}
	}) === "plaintext") {
		const plainResult = await promptSingleChannelToken({
			prompter: params.prompter,
			accountConfigured: params.accountConfigured,
			canUseEnv: params.canUseEnv,
			hasConfigToken: params.hasConfigToken,
			envPrompt: params.envPrompt,
			keepPrompt: params.keepPrompt,
			inputPrompt: params.inputPrompt
		});
		if (plainResult.useEnv) return { action: "use-env" };
		if (plainResult.token) return {
			action: "set",
			value: plainResult.token,
			resolvedValue: plainResult.token
		};
		return { action: "keep" };
	}
	if (params.hasConfigToken && params.accountConfigured) {
		if (await params.prompter.confirm({
			message: params.keepPrompt,
			initialValue: true
		})) return { action: "keep" };
	}
	const resolved = await promptSecretRefForOnboarding({
		provider: params.providerHint,
		config: params.cfg,
		prompter: params.prompter,
		preferredEnvVar: params.preferredEnvVar,
		copy: {
			sourceMessage: `Where is this ${params.credentialLabel} stored?`,
			envVarPlaceholder: params.preferredEnvVar ?? "OPENCLAW_SECRET",
			envVarFormatError: "Use an env var name like \"OPENCLAW_SECRET\" (uppercase letters, numbers, underscores).",
			noProvidersMessage: "No file/exec secret providers are configured yet. Add one under secrets.providers, or select Environment variable."
		}
	});
	return {
		action: "set",
		value: resolved.ref,
		resolvedValue: resolved.resolvedValue
	};
}
//#endregion
//#region src/plugin-sdk/channel-lifecycle.ts
function createAccountStatusSink(params) {
	return (patch) => {
		params.setStatus({
			accountId: params.accountId,
			...patch
		});
	};
}
//#endregion
//#region src/plugin-sdk/status-helpers.ts
function buildBaseAccountStatusSnapshot(params) {
	const { account, runtime, probe } = params;
	return {
		accountId: account.accountId,
		name: account.name,
		enabled: account.enabled,
		configured: account.configured,
		...buildRuntimeAccountStatusSnapshot({
			runtime,
			probe
		}),
		lastInboundAt: runtime?.lastInboundAt ?? null,
		lastOutboundAt: runtime?.lastOutboundAt ?? null
	};
}
function buildComputedAccountStatusSnapshot(params) {
	const { accountId, name, enabled, configured, runtime, probe } = params;
	return buildBaseAccountStatusSnapshot({
		account: {
			accountId,
			name,
			enabled,
			configured
		},
		runtime,
		probe
	});
}
function buildRuntimeAccountStatusSnapshot(params) {
	const { runtime, probe } = params;
	return {
		running: runtime?.running ?? false,
		lastStartAt: runtime?.lastStartAt ?? null,
		lastStopAt: runtime?.lastStopAt ?? null,
		lastError: runtime?.lastError ?? null,
		probe
	};
}
//#endregion
//#region src/agents/identity.ts
function resolveAgentIdentity(cfg, agentId) {
	return resolveAgentConfig(cfg, agentId)?.identity;
}
function resolveIdentityNamePrefix(cfg, agentId) {
	const name = resolveAgentIdentity(cfg, agentId)?.name?.trim();
	if (!name) return;
	return `[${name}]`;
}
/** Returns just the identity name (without brackets) for template context. */
function resolveIdentityName(cfg, agentId) {
	return resolveAgentIdentity(cfg, agentId)?.name?.trim() || void 0;
}
function resolveMessagePrefix(cfg, agentId, opts) {
	const configured = opts?.configured ?? cfg.messages?.messagePrefix;
	if (configured !== void 0) return configured;
	if (opts?.hasAllowFrom === true) return "";
	return resolveIdentityNamePrefix(cfg, agentId) ?? opts?.fallback ?? "[openclaw]";
}
/** Helper to extract a channel config value by dynamic key. */
function getChannelConfig(cfg, channel) {
	const value = cfg.channels?.[channel];
	return typeof value === "object" && value !== null ? value : void 0;
}
function resolveResponsePrefix(cfg, agentId, opts) {
	if (opts?.channel && opts?.accountId) {
		const accountPrefix = (getChannelConfig(cfg, opts.channel)?.accounts)?.[opts.accountId]?.responsePrefix;
		if (accountPrefix !== void 0) {
			if (accountPrefix === "auto") return resolveIdentityNamePrefix(cfg, agentId);
			return accountPrefix;
		}
	}
	if (opts?.channel) {
		const channelPrefix = getChannelConfig(cfg, opts.channel)?.responsePrefix;
		if (channelPrefix !== void 0) {
			if (channelPrefix === "auto") return resolveIdentityNamePrefix(cfg, agentId);
			return channelPrefix;
		}
	}
	const configured = cfg.messages?.responsePrefix;
	if (configured !== void 0) {
		if (configured === "auto") return resolveIdentityNamePrefix(cfg, agentId);
		return configured;
	}
}
function resolveEffectiveMessagesConfig(cfg, agentId, opts) {
	return {
		messagePrefix: resolveMessagePrefix(cfg, agentId, {
			hasAllowFrom: opts?.hasAllowFrom,
			fallback: opts?.fallbackMessagePrefix
		}),
		responsePrefix: resolveResponsePrefix(cfg, agentId, {
			channel: opts?.channel,
			accountId: opts?.accountId
		})
	};
}
//#endregion
//#region src/auto-reply/reply/response-prefix-template.ts
/**
* Extract short model name from a full model string.
*
* Strips:
* - Provider prefix (e.g., "openai/" from "openai/gpt-5.2")
* - Date suffixes (e.g., "-20260205" from "claude-opus-4-6-20260205")
* - Common version suffixes (e.g., "-latest")
*
* @example
* extractShortModelName("openai-codex/gpt-5.2") // "gpt-5.2"
* extractShortModelName("claude-opus-4-6-20260205") // "claude-opus-4-6"
* extractShortModelName("gpt-5.2-latest") // "gpt-5.2"
*/
function extractShortModelName(fullModel) {
	const slash = fullModel.lastIndexOf("/");
	return (slash >= 0 ? fullModel.slice(slash + 1) : fullModel).replace(/-\d{8}$/, "").replace(/-latest$/, "");
}
//#endregion
//#region src/channels/reply-prefix.ts
function createReplyPrefixContext(params) {
	const { cfg, agentId } = params;
	const prefixContext = { identityName: resolveIdentityName(cfg, agentId) };
	const onModelSelected = (ctx) => {
		prefixContext.provider = ctx.provider;
		prefixContext.model = extractShortModelName(ctx.model);
		prefixContext.modelFull = `${ctx.provider}/${ctx.model}`;
		prefixContext.thinkingLevel = ctx.thinkLevel ?? "off";
	};
	return {
		prefixContext,
		responsePrefix: resolveEffectiveMessagesConfig(cfg, agentId, {
			channel: params.channel,
			accountId: params.accountId
		}).responsePrefix,
		responsePrefixContextProvider: () => prefixContext,
		onModelSelected
	};
}
function createReplyPrefixOptions(params) {
	const { responsePrefix, responsePrefixContextProvider, onModelSelected } = createReplyPrefixContext(params);
	return {
		responsePrefix,
		responsePrefixContextProvider,
		onModelSelected
	};
}
//#endregion
//#region src/channels/typing-lifecycle.ts
function createTypingKeepaliveLoop(params) {
	let timer;
	let tickInFlight = false;
	const tick = async () => {
		if (tickInFlight) return;
		tickInFlight = true;
		try {
			await params.onTick();
		} finally {
			tickInFlight = false;
		}
	};
	const start = () => {
		if (params.intervalMs <= 0 || timer) return;
		timer = setInterval(() => {
			tick();
		}, params.intervalMs);
	};
	const stop = () => {
		if (!timer) return;
		clearInterval(timer);
		timer = void 0;
		tickInFlight = false;
	};
	const isRunning = () => timer !== void 0;
	return {
		tick,
		start,
		stop,
		isRunning
	};
}
//#endregion
//#region src/channels/typing-start-guard.ts
function createTypingStartGuard(params) {
	const maxConsecutiveFailures = typeof params.maxConsecutiveFailures === "number" && params.maxConsecutiveFailures > 0 ? Math.floor(params.maxConsecutiveFailures) : void 0;
	let consecutiveFailures = 0;
	let tripped = false;
	const isBlocked = () => {
		if (params.isSealed()) return true;
		if (tripped) return true;
		return params.shouldBlock?.() === true;
	};
	const run = async (start) => {
		if (isBlocked()) return "skipped";
		try {
			await start();
			consecutiveFailures = 0;
			return "started";
		} catch (err) {
			consecutiveFailures += 1;
			params.onStartError?.(err);
			if (params.rethrowOnError) throw err;
			if (maxConsecutiveFailures && consecutiveFailures >= maxConsecutiveFailures) {
				tripped = true;
				params.onTrip?.();
				return "tripped";
			}
			return "failed";
		}
	};
	return {
		run,
		reset: () => {
			consecutiveFailures = 0;
			tripped = false;
		},
		isTripped: () => tripped
	};
}
//#endregion
//#region src/channels/typing.ts
function createTypingCallbacks(params) {
	const stop = params.stop;
	const keepaliveIntervalMs = params.keepaliveIntervalMs ?? 3e3;
	const maxConsecutiveFailures = Math.max(1, params.maxConsecutiveFailures ?? 2);
	const maxDurationMs = params.maxDurationMs ?? 6e4;
	let stopSent = false;
	let closed = false;
	let ttlTimer;
	const startGuard = createTypingStartGuard({
		isSealed: () => closed,
		onStartError: params.onStartError,
		maxConsecutiveFailures,
		onTrip: () => {
			keepaliveLoop.stop();
		}
	});
	const fireStart = async () => {
		await startGuard.run(() => params.start());
	};
	const keepaliveLoop = createTypingKeepaliveLoop({
		intervalMs: keepaliveIntervalMs,
		onTick: fireStart
	});
	const startTtlTimer = () => {
		if (maxDurationMs <= 0) return;
		clearTtlTimer();
		ttlTimer = setTimeout(() => {
			if (!closed) {
				console.warn(`[typing] TTL exceeded (${maxDurationMs}ms), auto-stopping typing indicator`);
				fireStop();
			}
		}, maxDurationMs);
	};
	const clearTtlTimer = () => {
		if (ttlTimer) {
			clearTimeout(ttlTimer);
			ttlTimer = void 0;
		}
	};
	const onReplyStart = async () => {
		if (closed) return;
		stopSent = false;
		startGuard.reset();
		keepaliveLoop.stop();
		clearTtlTimer();
		await fireStart();
		if (startGuard.isTripped()) return;
		keepaliveLoop.start();
		startTtlTimer();
	};
	const fireStop = () => {
		closed = true;
		keepaliveLoop.stop();
		clearTtlTimer();
		if (!stop || stopSent) return;
		stopSent = true;
		stop().catch((err) => (params.onStopError ?? params.onStartError)(err));
	};
	return {
		onReplyStart,
		onIdle: fireStop,
		onCleanup: fireStop
	};
}
//#endregion
//#region src/config/dangerous-name-matching.ts
function isDangerousNameMatchingEnabled(config) {
	return config?.dangerouslyAllowNameMatching === true;
}
//#endregion
//#region src/config/runtime-group-policy.ts
function resolveRuntimeGroupPolicy(params) {
	const configuredFallbackPolicy = params.configuredFallbackPolicy ?? "open";
	const missingProviderFallbackPolicy = params.missingProviderFallbackPolicy ?? "allowlist";
	return {
		groupPolicy: params.providerConfigPresent ? params.groupPolicy ?? params.defaultGroupPolicy ?? configuredFallbackPolicy : params.groupPolicy ?? missingProviderFallbackPolicy,
		providerMissingFallbackApplied: !params.providerConfigPresent && params.groupPolicy === void 0
	};
}
function resolveDefaultGroupPolicy(cfg) {
	return cfg.channels?.defaults?.groupPolicy;
}
/**
* Strict provider runtime policy:
* - configured provider fallback: allowlist
* - missing provider fallback: allowlist (fail-closed)
*/
function resolveAllowlistProviderRuntimeGroupPolicy(params) {
	return resolveRuntimeGroupPolicy({
		providerConfigPresent: params.providerConfigPresent,
		groupPolicy: params.groupPolicy,
		defaultGroupPolicy: params.defaultGroupPolicy,
		configuredFallbackPolicy: "allowlist",
		missingProviderFallbackPolicy: "allowlist"
	});
}
const warnedMissingProviderGroupPolicy = /* @__PURE__ */ new Set();
function warnMissingProviderGroupPolicyFallbackOnce(params) {
	if (!params.providerMissingFallbackApplied) return false;
	const key = `${params.providerKey}:${params.accountId ?? "*"}`;
	if (warnedMissingProviderGroupPolicy.has(key)) return false;
	warnedMissingProviderGroupPolicy.add(key);
	const blockedLabel = params.blockedLabel?.trim() || "group messages";
	params.log(`${params.providerKey}: channels.${params.providerKey} is missing; defaulting groupPolicy to "allowlist" (${blockedLabel} blocked until explicitly configured).`);
	return true;
}
//#endregion
//#region src/plugin-sdk/secret-input-schema.ts
function buildSecretInputSchema() {
	const providerSchema = z.string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\").");
	return z.union([z.string(), z.discriminatedUnion("source", [
		z.object({
			source: z.literal("env"),
			provider: providerSchema,
			id: z.string().regex(ENV_SECRET_REF_ID_RE, "Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")
		}),
		z.object({
			source: z.literal("file"),
			provider: providerSchema,
			id: z.string().refine(isValidFileSecretRefId, "File secret reference id must be an absolute JSON pointer (example: \"/providers/openai/apiKey\"), or \"value\" for singleValue mode.")
		}),
		z.object({
			source: z.literal("exec"),
			provider: providerSchema,
			id: z.string().refine(isValidExecSecretRefId, formatExecSecretRefIdValidationMessage())
		})
	])]);
}
//#endregion
//#region src/infra/map-size.ts
function pruneMapToMaxSize(map, maxSize) {
	const limit = Math.max(0, Math.floor(maxSize));
	if (limit <= 0) {
		map.clear();
		return;
	}
	while (map.size > limit) {
		const oldest = map.keys().next();
		if (oldest.done) break;
		map.delete(oldest.value);
	}
}
//#endregion
//#region src/infra/dedupe.ts
function createDedupeCache(options) {
	const ttlMs = Math.max(0, options.ttlMs);
	const maxSize = Math.max(0, Math.floor(options.maxSize));
	const cache = /* @__PURE__ */ new Map();
	const touch = (key, now) => {
		cache.delete(key);
		cache.set(key, now);
	};
	const prune = (now) => {
		const cutoff = ttlMs > 0 ? now - ttlMs : void 0;
		if (cutoff !== void 0) {
			for (const [entryKey, entryTs] of cache) if (entryTs < cutoff) cache.delete(entryKey);
		}
		if (maxSize <= 0) {
			cache.clear();
			return;
		}
		pruneMapToMaxSize(cache, maxSize);
	};
	const hasUnexpired = (key, now, touchOnRead) => {
		const existing = cache.get(key);
		if (existing === void 0) return false;
		if (ttlMs > 0 && now - existing >= ttlMs) {
			cache.delete(key);
			return false;
		}
		if (touchOnRead) touch(key, now);
		return true;
	};
	return {
		check: (key, now = Date.now()) => {
			if (!key) return false;
			if (hasUnexpired(key, now, true)) return true;
			touch(key, now);
			prune(now);
			return false;
		},
		peek: (key, now = Date.now()) => {
			if (!key) return false;
			return hasUnexpired(key, now, false);
		},
		clear: () => {
			cache.clear();
		},
		size: () => cache.size
	};
}
//#endregion
//#region src/plugins/http-registry.ts
function registerPluginHttpRoute(params) {
	const registry = params.registry ?? requireActivePluginRegistry();
	const routes = registry.httpRoutes ?? [];
	registry.httpRoutes = routes;
	const normalizedPath = normalizePluginHttpPath(params.path, params.fallbackPath);
	const suffix = params.accountId ? ` for account "${params.accountId}"` : "";
	if (!normalizedPath) {
		params.log?.(`plugin: webhook path missing${suffix}`);
		return () => {};
	}
	const routeMatch = params.match ?? "exact";
	const overlappingRoute = findOverlappingPluginHttpRoute(routes, {
		path: normalizedPath,
		match: routeMatch
	});
	if (overlappingRoute && overlappingRoute.auth !== params.auth) {
		params.log?.(`plugin: route overlap denied at ${normalizedPath} (${routeMatch}, ${params.auth})${suffix}; overlaps ${overlappingRoute.path} (${overlappingRoute.match}, ${overlappingRoute.auth}) owned by ${overlappingRoute.pluginId ?? "unknown-plugin"} (${overlappingRoute.source ?? "unknown-source"})`);
		return () => {};
	}
	const existingIndex = routes.findIndex((entry) => entry.path === normalizedPath && entry.match === routeMatch);
	if (existingIndex >= 0) {
		const existing = routes[existingIndex];
		if (!existing) return () => {};
		if (!params.replaceExisting) {
			params.log?.(`plugin: route conflict at ${normalizedPath} (${routeMatch})${suffix}; owned by ${existing.pluginId ?? "unknown-plugin"} (${existing.source ?? "unknown-source"})`);
			return () => {};
		}
		if (existing.pluginId && params.pluginId && existing.pluginId !== params.pluginId) {
			params.log?.(`plugin: route replacement denied for ${normalizedPath} (${routeMatch})${suffix}; owned by ${existing.pluginId}`);
			return () => {};
		}
		const pluginHint = params.pluginId ? ` (${params.pluginId})` : "";
		params.log?.(`plugin: replacing stale webhook path ${normalizedPath} (${routeMatch})${suffix}${pluginHint}`);
		routes.splice(existingIndex, 1);
	}
	const entry = {
		path: normalizedPath,
		handler: params.handler,
		auth: params.auth,
		match: routeMatch,
		pluginId: params.pluginId,
		source: params.source
	};
	routes.push(entry);
	return () => {
		const index = routes.indexOf(entry);
		if (index >= 0) routes.splice(index, 1);
	};
}
//#endregion
//#region src/plugins/config-schema.ts
function error(message) {
	return {
		success: false,
		error: { issues: [{
			path: [],
			message
		}] }
	};
}
function emptyPluginConfigSchema() {
	return {
		safeParse(value) {
			if (value === void 0) return {
				success: true,
				data: void 0
			};
			if (!value || typeof value !== "object" || Array.isArray(value)) return error("expected config object");
			if (Object.keys(value).length > 0) return error("config must be empty");
			return {
				success: true,
				data: value
			};
		},
		jsonSchema: {
			type: "object",
			additionalProperties: false,
			properties: {}
		}
	};
}
//#endregion
//#region src/channels/allow-from.ts
function mergeDmAllowFromSources(params) {
	const storeEntries = params.dmPolicy === "allowlist" ? [] : params.storeAllowFrom ?? [];
	return [...params.allowFrom ?? [], ...storeEntries].map((value) => String(value).trim()).filter(Boolean);
}
function resolveGroupAllowFromSources(params) {
	const explicitGroupAllowFrom = Array.isArray(params.groupAllowFrom) && params.groupAllowFrom.length > 0 ? params.groupAllowFrom : void 0;
	return (explicitGroupAllowFrom ? explicitGroupAllowFrom : params.fallbackToAllowFrom === false ? [] : params.allowFrom ?? []).map((value) => String(value).trim()).filter(Boolean);
}
//#endregion
//#region src/channels/plugins/pairing.ts
function getPairingAdapter(channelId) {
	return getChannelPlugin(channelId)?.pairing ?? null;
}
//#endregion
//#region src/plugin-sdk/json-store.ts
async function readJsonFileWithFallback(filePath, fallback) {
	try {
		const parsed = safeParseJson(await fs.promises.readFile(filePath, "utf-8"));
		if (parsed == null) return {
			value: fallback,
			exists: true
		};
		return {
			value: parsed,
			exists: true
		};
	} catch (err) {
		if (err.code === "ENOENT") return {
			value: fallback,
			exists: false
		};
		return {
			value: fallback,
			exists: false
		};
	}
}
const allowFromReadCache = /* @__PURE__ */ new Map();
function resolveCredentialsDir(env = process.env) {
	return resolveOAuthDir(env, resolveStateDir(env, () => resolveRequiredHomeDir(env, os.homedir)));
}
/** Sanitize channel ID for use in filenames (prevent path traversal). */
function safeChannelKey(channel) {
	const raw = String(channel).trim().toLowerCase();
	if (!raw) throw new Error("invalid pairing channel");
	const safe = raw.replace(/[\\/:*?"<>|]/g, "_").replace(/\.\./g, "_");
	if (!safe || safe === "_") throw new Error("invalid pairing channel");
	return safe;
}
function safeAccountKey(accountId) {
	const raw = String(accountId).trim().toLowerCase();
	if (!raw) throw new Error("invalid pairing account id");
	const safe = raw.replace(/[\\/:*?"<>|]/g, "_").replace(/\.\./g, "_");
	if (!safe || safe === "_") throw new Error("invalid pairing account id");
	return safe;
}
function resolveAllowFromPath(channel, env = process.env, accountId) {
	const base = safeChannelKey(channel);
	const normalizedAccountId = typeof accountId === "string" ? accountId.trim() : "";
	if (!normalizedAccountId) return path.join(resolveCredentialsDir(env), `${base}-allowFrom.json`);
	return path.join(resolveCredentialsDir(env), `${base}-${safeAccountKey(normalizedAccountId)}-allowFrom.json`);
}
async function readJsonFile(filePath, fallback) {
	return await readJsonFileWithFallback(filePath, fallback);
}
function normalizePairingAccountId(accountId) {
	return accountId?.trim().toLowerCase() || "";
}
function shouldIncludeLegacyAllowFromEntries(normalizedAccountId) {
	return !normalizedAccountId || normalizedAccountId === "default";
}
function resolveAllowFromAccountId(accountId) {
	return normalizePairingAccountId(accountId) || "default";
}
function normalizeAllowEntry(channel, entry) {
	const trimmed = entry.trim();
	if (!trimmed) return "";
	if (trimmed === "*") return "";
	const adapter = getPairingAdapter(channel);
	const normalized = adapter?.normalizeAllowEntry ? adapter.normalizeAllowEntry(trimmed) : trimmed;
	return String(normalized).trim();
}
function normalizeAllowFromList(channel, store) {
	return dedupePreserveOrder((Array.isArray(store.allowFrom) ? store.allowFrom : []).map((v) => normalizeAllowEntry(channel, String(v))).filter(Boolean));
}
function dedupePreserveOrder(entries) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const entry of entries) {
		const normalized = String(entry).trim();
		if (!normalized || seen.has(normalized)) continue;
		seen.add(normalized);
		out.push(normalized);
	}
	return out;
}
async function readAllowFromStateForPath(channel, filePath) {
	return (await readAllowFromStateForPathWithExists(channel, filePath)).entries;
}
function cloneAllowFromCacheEntry(entry) {
	return {
		exists: entry.exists,
		mtimeMs: entry.mtimeMs,
		size: entry.size,
		entries: entry.entries.slice()
	};
}
function setAllowFromReadCache(filePath, entry) {
	allowFromReadCache.set(filePath, cloneAllowFromCacheEntry(entry));
}
function resolveAllowFromReadCacheHit(params) {
	const cached = allowFromReadCache.get(params.filePath);
	if (!cached) return null;
	if (cached.exists !== params.exists) return null;
	if (!params.exists) return cloneAllowFromCacheEntry(cached);
	if (cached.mtimeMs !== params.mtimeMs || cached.size !== params.size) return null;
	return cloneAllowFromCacheEntry(cached);
}
function resolveAllowFromReadCacheOrMissing(filePath, stat) {
	const cached = resolveAllowFromReadCacheHit({
		filePath,
		exists: Boolean(stat),
		mtimeMs: stat?.mtimeMs ?? null,
		size: stat?.size ?? null
	});
	if (cached) return {
		entries: cached.entries,
		exists: cached.exists
	};
	if (!stat) {
		setAllowFromReadCache(filePath, {
			exists: false,
			mtimeMs: null,
			size: null,
			entries: []
		});
		return {
			entries: [],
			exists: false
		};
	}
	return null;
}
async function readAllowFromStateForPathWithExists(channel, filePath) {
	let stat = null;
	try {
		stat = await fs.promises.stat(filePath);
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
	const cachedOrMissing = resolveAllowFromReadCacheOrMissing(filePath, stat);
	if (cachedOrMissing) return cachedOrMissing;
	if (!stat) return {
		entries: [],
		exists: false
	};
	const { value, exists } = await readJsonFile(filePath, {
		version: 1,
		allowFrom: []
	});
	const entries = normalizeAllowFromList(channel, value);
	setAllowFromReadCache(filePath, {
		exists,
		mtimeMs: stat.mtimeMs,
		size: stat.size,
		entries
	});
	return {
		entries,
		exists
	};
}
async function readNonDefaultAccountAllowFrom(params) {
	const scopedPath = resolveAllowFromPath(params.channel, params.env, params.accountId);
	return await readAllowFromStateForPath(params.channel, scopedPath);
}
async function readChannelAllowFromStore(channel, env = process.env, accountId) {
	const resolvedAccountId = resolveAllowFromAccountId(accountId);
	if (!shouldIncludeLegacyAllowFromEntries(resolvedAccountId)) return await readNonDefaultAccountAllowFrom({
		channel,
		env,
		accountId: resolvedAccountId
	});
	const scopedEntries = await readAllowFromStateForPath(channel, resolveAllowFromPath(channel, env, resolvedAccountId));
	const legacyEntries = await readAllowFromStateForPath(channel, resolveAllowFromPath(channel, env));
	return dedupePreserveOrder([...scopedEntries, ...legacyEntries]);
}
//#endregion
//#region src/plugin-sdk/group-access.ts
function evaluateMatchedGroupAccessForPolicy(params) {
	if (params.groupPolicy === "disabled") return {
		allowed: false,
		groupPolicy: params.groupPolicy,
		reason: "disabled"
	};
	if (params.groupPolicy === "allowlist") {
		if (params.requireMatchInput && !params.hasMatchInput) return {
			allowed: false,
			groupPolicy: params.groupPolicy,
			reason: "missing_match_input"
		};
		if (!params.allowlistConfigured) return {
			allowed: false,
			groupPolicy: params.groupPolicy,
			reason: "empty_allowlist"
		};
		if (!params.allowlistMatched) return {
			allowed: false,
			groupPolicy: params.groupPolicy,
			reason: "not_allowlisted"
		};
	}
	return {
		allowed: true,
		groupPolicy: params.groupPolicy,
		reason: "allowed"
	};
}
function evaluateSenderGroupAccessForPolicy(params) {
	if (params.groupPolicy === "disabled") return {
		allowed: false,
		groupPolicy: params.groupPolicy,
		providerMissingFallbackApplied: Boolean(params.providerMissingFallbackApplied),
		reason: "disabled"
	};
	if (params.groupPolicy === "allowlist") {
		if (params.groupAllowFrom.length === 0) return {
			allowed: false,
			groupPolicy: params.groupPolicy,
			providerMissingFallbackApplied: Boolean(params.providerMissingFallbackApplied),
			reason: "empty_allowlist"
		};
		if (!params.isSenderAllowed(params.senderId, params.groupAllowFrom)) return {
			allowed: false,
			groupPolicy: params.groupPolicy,
			providerMissingFallbackApplied: Boolean(params.providerMissingFallbackApplied),
			reason: "sender_not_allowlisted"
		};
	}
	return {
		allowed: true,
		groupPolicy: params.groupPolicy,
		providerMissingFallbackApplied: Boolean(params.providerMissingFallbackApplied),
		reason: "allowed"
	};
}
//#endregion
//#region src/security/dm-policy-shared.ts
function resolveEffectiveAllowFromLists(params) {
	const allowFrom = Array.isArray(params.allowFrom) ? params.allowFrom : void 0;
	const groupAllowFrom = Array.isArray(params.groupAllowFrom) ? params.groupAllowFrom : void 0;
	return {
		effectiveAllowFrom: normalizeStringEntries(mergeDmAllowFromSources({
			allowFrom,
			storeAllowFrom: Array.isArray(params.storeAllowFrom) ? params.storeAllowFrom : void 0,
			dmPolicy: params.dmPolicy ?? void 0
		})),
		effectiveGroupAllowFrom: normalizeStringEntries(resolveGroupAllowFromSources({
			allowFrom,
			groupAllowFrom,
			fallbackToAllowFrom: params.groupAllowFromFallbackToAllowFrom ?? void 0
		}))
	};
}
const DM_GROUP_ACCESS_REASON = {
	GROUP_POLICY_ALLOWED: "group_policy_allowed",
	GROUP_POLICY_DISABLED: "group_policy_disabled",
	GROUP_POLICY_EMPTY_ALLOWLIST: "group_policy_empty_allowlist",
	GROUP_POLICY_NOT_ALLOWLISTED: "group_policy_not_allowlisted",
	DM_POLICY_OPEN: "dm_policy_open",
	DM_POLICY_DISABLED: "dm_policy_disabled",
	DM_POLICY_ALLOWLISTED: "dm_policy_allowlisted",
	DM_POLICY_PAIRING_REQUIRED: "dm_policy_pairing_required",
	DM_POLICY_NOT_ALLOWLISTED: "dm_policy_not_allowlisted"
};
async function readStoreAllowFromForDmPolicy(params) {
	if (params.shouldRead === false || params.dmPolicy === "allowlist") return [];
	return await (params.readStore ?? ((provider, accountId) => readChannelAllowFromStore(provider, process.env, accountId)))(params.provider, params.accountId).catch(() => []);
}
function resolveDmGroupAccessDecision(params) {
	const dmPolicy = params.dmPolicy ?? "pairing";
	const groupPolicy = params.groupPolicy === "open" || params.groupPolicy === "disabled" ? params.groupPolicy : "allowlist";
	const effectiveAllowFrom = normalizeStringEntries(params.effectiveAllowFrom);
	const effectiveGroupAllowFrom = normalizeStringEntries(params.effectiveGroupAllowFrom);
	if (params.isGroup) {
		const groupAccess = evaluateMatchedGroupAccessForPolicy({
			groupPolicy,
			allowlistConfigured: effectiveGroupAllowFrom.length > 0,
			allowlistMatched: params.isSenderAllowed(effectiveGroupAllowFrom)
		});
		if (!groupAccess.allowed) {
			if (groupAccess.reason === "disabled") return {
				decision: "block",
				reasonCode: DM_GROUP_ACCESS_REASON.GROUP_POLICY_DISABLED,
				reason: "groupPolicy=disabled"
			};
			if (groupAccess.reason === "empty_allowlist") return {
				decision: "block",
				reasonCode: DM_GROUP_ACCESS_REASON.GROUP_POLICY_EMPTY_ALLOWLIST,
				reason: "groupPolicy=allowlist (empty allowlist)"
			};
			if (groupAccess.reason === "not_allowlisted") return {
				decision: "block",
				reasonCode: DM_GROUP_ACCESS_REASON.GROUP_POLICY_NOT_ALLOWLISTED,
				reason: "groupPolicy=allowlist (not allowlisted)"
			};
		}
		return {
			decision: "allow",
			reasonCode: DM_GROUP_ACCESS_REASON.GROUP_POLICY_ALLOWED,
			reason: `groupPolicy=${groupPolicy}`
		};
	}
	if (dmPolicy === "disabled") return {
		decision: "block",
		reasonCode: DM_GROUP_ACCESS_REASON.DM_POLICY_DISABLED,
		reason: "dmPolicy=disabled"
	};
	if (dmPolicy === "open") return {
		decision: "allow",
		reasonCode: DM_GROUP_ACCESS_REASON.DM_POLICY_OPEN,
		reason: "dmPolicy=open"
	};
	if (params.isSenderAllowed(effectiveAllowFrom)) return {
		decision: "allow",
		reasonCode: DM_GROUP_ACCESS_REASON.DM_POLICY_ALLOWLISTED,
		reason: `dmPolicy=${dmPolicy} (allowlisted)`
	};
	if (dmPolicy === "pairing") return {
		decision: "pairing",
		reasonCode: DM_GROUP_ACCESS_REASON.DM_POLICY_PAIRING_REQUIRED,
		reason: "dmPolicy=pairing (not allowlisted)"
	};
	return {
		decision: "block",
		reasonCode: DM_GROUP_ACCESS_REASON.DM_POLICY_NOT_ALLOWLISTED,
		reason: `dmPolicy=${dmPolicy} (not allowlisted)`
	};
}
function resolveDmGroupAccessWithLists(params) {
	const { effectiveAllowFrom, effectiveGroupAllowFrom } = resolveEffectiveAllowFromLists({
		allowFrom: params.allowFrom,
		groupAllowFrom: params.groupAllowFrom,
		storeAllowFrom: params.storeAllowFrom,
		dmPolicy: params.dmPolicy,
		groupAllowFromFallbackToAllowFrom: params.groupAllowFromFallbackToAllowFrom
	});
	return {
		...resolveDmGroupAccessDecision({
			isGroup: params.isGroup,
			dmPolicy: params.dmPolicy,
			groupPolicy: params.groupPolicy,
			effectiveAllowFrom,
			effectiveGroupAllowFrom,
			isSenderAllowed: params.isSenderAllowed
		}),
		effectiveAllowFrom,
		effectiveGroupAllowFrom
	};
}
//#endregion
//#region src/plugin-sdk/agent-media-payload.ts
function buildAgentMediaPayload(mediaList) {
	const first = mediaList[0];
	const mediaPaths = mediaList.map((media) => media.path);
	const mediaTypes = mediaList.map((media) => media.contentType).filter(Boolean);
	return {
		MediaPath: first?.path,
		MediaType: first?.contentType ?? void 0,
		MediaUrl: first?.path,
		MediaPaths: mediaPaths.length > 0 ? mediaPaths : void 0,
		MediaUrls: mediaPaths.length > 0 ? mediaPaths : void 0,
		MediaTypes: mediaTypes.length > 0 ? mediaTypes : void 0
	};
}
//#endregion
//#region src/utils/fetch-timeout.ts
/**
* Relay abort without forwarding the Event argument as the abort reason.
* Using .bind() avoids closure scope capture (memory leak prevention).
*/
function relayAbort() {
	this.abort();
}
/** Returns a bound abort relay for use as an event listener. */
function bindAbortRelay(controller) {
	return relayAbort.bind(controller);
}
//#endregion
//#region src/infra/net/fetch-guard.ts
const GUARDED_FETCH_MODE = {
	STRICT: "strict",
	TRUSTED_ENV_PROXY: "trusted_env_proxy"
};
const DEFAULT_MAX_REDIRECTS = 3;
const CROSS_ORIGIN_REDIRECT_SAFE_HEADERS = new Set([
	"accept",
	"accept-encoding",
	"accept-language",
	"cache-control",
	"content-language",
	"content-type",
	"if-match",
	"if-modified-since",
	"if-none-match",
	"if-unmodified-since",
	"pragma",
	"range",
	"user-agent"
]);
function withStrictGuardedFetchMode(params) {
	return {
		...params,
		mode: GUARDED_FETCH_MODE.STRICT
	};
}
function resolveGuardedFetchMode(params) {
	if (params.mode) return params.mode;
	if (params.proxy === "env" && params.dangerouslyAllowEnvProxyWithoutPinnedDns === true) return GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY;
	return GUARDED_FETCH_MODE.STRICT;
}
function isRedirectStatus(status) {
	return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
function retainSafeHeadersForCrossOriginRedirect(init) {
	if (!init?.headers) return init;
	const incoming = new Headers(init.headers);
	const headers = new Headers();
	for (const [key, value] of incoming.entries()) if (CROSS_ORIGIN_REDIRECT_SAFE_HEADERS.has(key.toLowerCase())) headers.set(key, value);
	return {
		...init,
		headers
	};
}
function buildAbortSignal(params) {
	const { timeoutMs, signal } = params;
	if (!timeoutMs && !signal) return {
		signal: void 0,
		cleanup: () => {}
	};
	if (!timeoutMs) return {
		signal,
		cleanup: () => {}
	};
	const controller = new AbortController();
	const timeoutId = setTimeout(controller.abort.bind(controller), timeoutMs);
	const onAbort = bindAbortRelay(controller);
	if (signal) if (signal.aborted) controller.abort();
	else signal.addEventListener("abort", onAbort, { once: true });
	const cleanup = () => {
		clearTimeout(timeoutId);
		if (signal) signal.removeEventListener("abort", onAbort);
	};
	return {
		signal: controller.signal,
		cleanup
	};
}
async function fetchWithSsrFGuard(params) {
	const fetcher = params.fetchImpl ?? globalThis.fetch;
	if (!fetcher) throw new Error("fetch is not available");
	const maxRedirects = typeof params.maxRedirects === "number" && Number.isFinite(params.maxRedirects) ? Math.max(0, Math.floor(params.maxRedirects)) : DEFAULT_MAX_REDIRECTS;
	const mode = resolveGuardedFetchMode(params);
	const { signal, cleanup } = buildAbortSignal({
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
	let released = false;
	const release = async (dispatcher) => {
		if (released) return;
		released = true;
		cleanup();
		await closeDispatcher(dispatcher ?? void 0);
	};
	const visited = /* @__PURE__ */ new Set();
	let currentUrl = params.url;
	let currentInit = params.init ? { ...params.init } : void 0;
	let redirectCount = 0;
	while (true) {
		let parsedUrl;
		try {
			parsedUrl = new URL(currentUrl);
		} catch {
			await release();
			throw new Error("Invalid URL: must be http or https");
		}
		if (!["http:", "https:"].includes(parsedUrl.protocol)) {
			await release();
			throw new Error("Invalid URL: must be http or https");
		}
		let dispatcher = null;
		try {
			const pinned = await resolvePinnedHostnameWithPolicy(parsedUrl.hostname, {
				lookupFn: params.lookupFn,
				policy: params.policy
			});
			if (mode === GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY && hasProxyEnvConfigured()) dispatcher = new EnvHttpProxyAgent();
			else if (params.pinDns !== false) dispatcher = createPinnedDispatcher(pinned);
			const init = {
				...currentInit ? { ...currentInit } : {},
				redirect: "manual",
				...dispatcher ? { dispatcher } : {},
				...signal ? { signal } : {}
			};
			const response = await fetcher(parsedUrl.toString(), init);
			if (isRedirectStatus(response.status)) {
				const location = response.headers.get("location");
				if (!location) {
					await release(dispatcher);
					throw new Error(`Redirect missing location header (${response.status})`);
				}
				redirectCount += 1;
				if (redirectCount > maxRedirects) {
					await release(dispatcher);
					throw new Error(`Too many redirects (limit: ${maxRedirects})`);
				}
				const nextParsedUrl = new URL(location, parsedUrl);
				const nextUrl = nextParsedUrl.toString();
				if (visited.has(nextUrl)) {
					await release(dispatcher);
					throw new Error("Redirect loop detected");
				}
				if (nextParsedUrl.origin !== parsedUrl.origin) currentInit = retainSafeHeadersForCrossOriginRedirect(currentInit);
				visited.add(nextUrl);
				response.body?.cancel();
				await closeDispatcher(dispatcher);
				currentUrl = nextUrl;
				continue;
			}
			return {
				response,
				finalUrl: currentUrl,
				release: async () => release(dispatcher)
			};
		} catch (err) {
			if (err instanceof SsrFBlockedError) logWarn(`security: blocked URL fetch (${params.auditContext ?? "url-fetch"}) target=${parsedUrl.origin}${parsedUrl.pathname} reason=${err.message}`);
			await release(dispatcher);
			throw err;
		}
	}
}
//#endregion
//#region src/media/read-response-with-limit.ts
async function readChunkWithIdleTimeout(reader, chunkTimeoutMs) {
	let timeoutId;
	let timedOut = false;
	return await new Promise((resolve, reject) => {
		const clear = () => {
			if (timeoutId !== void 0) {
				clearTimeout(timeoutId);
				timeoutId = void 0;
			}
		};
		timeoutId = setTimeout(() => {
			timedOut = true;
			clear();
			reader.cancel().catch(() => void 0);
			reject(/* @__PURE__ */ new Error(`Media download stalled: no data received for ${chunkTimeoutMs}ms`));
		}, chunkTimeoutMs);
		reader.read().then((result) => {
			clear();
			if (!timedOut) resolve(result);
		}, (err) => {
			clear();
			if (!timedOut) reject(err);
		});
	});
}
async function readResponseWithLimit(res, maxBytes, opts) {
	const onOverflow = opts?.onOverflow ?? ((params) => /* @__PURE__ */ new Error(`Content too large: ${params.size} bytes (limit: ${params.maxBytes} bytes)`));
	const chunkTimeoutMs = opts?.chunkTimeoutMs;
	const body = res.body;
	if (!body || typeof body.getReader !== "function") {
		const fallback = Buffer.from(await res.arrayBuffer());
		if (fallback.length > maxBytes) throw onOverflow({
			size: fallback.length,
			maxBytes,
			res
		});
		return fallback;
	}
	const reader = body.getReader();
	const chunks = [];
	let total = 0;
	try {
		while (true) {
			const { done, value } = chunkTimeoutMs ? await readChunkWithIdleTimeout(reader, chunkTimeoutMs) : await reader.read();
			if (done) break;
			if (value?.length) {
				total += value.length;
				if (total > maxBytes) {
					try {
						await reader.cancel();
					} catch {}
					throw onOverflow({
						size: total,
						maxBytes,
						res
					});
				}
				chunks.push(value);
			}
		}
	} finally {
		try {
			reader.releaseLock();
		} catch {}
	}
	return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), total);
}
//#endregion
//#region src/media/fetch.ts
var MediaFetchError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "MediaFetchError";
	}
};
function stripQuotes(value) {
	return value.replace(/^["']|["']$/g, "");
}
function parseContentDispositionFileName(header) {
	if (!header) return;
	const starMatch = /filename\*\s*=\s*([^;]+)/i.exec(header);
	if (starMatch?.[1]) {
		const cleaned = stripQuotes(starMatch[1].trim());
		const encoded = cleaned.split("''").slice(1).join("''") || cleaned;
		try {
			return path.basename(decodeURIComponent(encoded));
		} catch {
			return path.basename(encoded);
		}
	}
	const match = /filename\s*=\s*([^;]+)/i.exec(header);
	if (match?.[1]) return path.basename(stripQuotes(match[1].trim()));
}
async function readErrorBodySnippet(res, maxChars = 200) {
	try {
		const text = await res.text();
		if (!text) return;
		const collapsed = text.replace(/\s+/g, " ").trim();
		if (!collapsed) return;
		if (collapsed.length <= maxChars) return collapsed;
		return `${collapsed.slice(0, maxChars)}…`;
	} catch {
		return;
	}
}
async function fetchRemoteMedia(options) {
	const { url, fetchImpl, requestInit, filePathHint, maxBytes, maxRedirects, readIdleTimeoutMs, ssrfPolicy, lookupFn } = options;
	let res;
	let finalUrl = url;
	let release = null;
	try {
		const result = await fetchWithSsrFGuard(withStrictGuardedFetchMode({
			url,
			fetchImpl,
			init: requestInit,
			maxRedirects,
			policy: ssrfPolicy,
			lookupFn
		}));
		res = result.response;
		finalUrl = result.finalUrl;
		release = result.release;
	} catch (err) {
		throw new MediaFetchError("fetch_failed", `Failed to fetch media from ${url}: ${String(err)}`);
	}
	try {
		if (!res.ok) {
			const statusText = res.statusText ? ` ${res.statusText}` : "";
			const redirected = finalUrl !== url ? ` (redirected to ${finalUrl})` : "";
			let detail = `HTTP ${res.status}${statusText}`;
			if (!res.body) detail = `HTTP ${res.status}${statusText}; empty response body`;
			else {
				const snippet = await readErrorBodySnippet(res);
				if (snippet) detail += `; body: ${snippet}`;
			}
			throw new MediaFetchError("http_error", `Failed to fetch media from ${url}${redirected}: ${detail}`);
		}
		const contentLength = res.headers.get("content-length");
		if (maxBytes && contentLength) {
			const length = Number(contentLength);
			if (Number.isFinite(length) && length > maxBytes) throw new MediaFetchError("max_bytes", `Failed to fetch media from ${url}: content length ${length} exceeds maxBytes ${maxBytes}`);
		}
		let buffer;
		try {
			buffer = maxBytes ? await readResponseWithLimit(res, maxBytes, {
				onOverflow: ({ maxBytes, res }) => new MediaFetchError("max_bytes", `Failed to fetch media from ${res.url || url}: payload exceeds maxBytes ${maxBytes}`),
				chunkTimeoutMs: readIdleTimeoutMs
			}) : Buffer.from(await res.arrayBuffer());
		} catch (err) {
			if (err instanceof MediaFetchError) throw err;
			throw new MediaFetchError("fetch_failed", `Failed to fetch media from ${res.url || url}: ${String(err)}`);
		}
		let fileNameFromUrl;
		try {
			const parsed = new URL(finalUrl);
			fileNameFromUrl = path.basename(parsed.pathname) || void 0;
		} catch {}
		const headerFileName = parseContentDispositionFileName(res.headers.get("content-disposition"));
		let fileName = headerFileName || fileNameFromUrl || (filePathHint ? path.basename(filePathHint) : void 0);
		const filePathForMime = headerFileName && path.extname(headerFileName) ? headerFileName : filePathHint ?? finalUrl;
		const contentType = await detectMime({
			buffer,
			headerMime: res.headers.get("content-type"),
			filePath: filePathForMime
		});
		if (fileName && !path.extname(fileName) && contentType) {
			const ext = extensionForMime(contentType);
			if (ext) fileName = `${fileName}${ext}`;
		}
		return {
			buffer,
			contentType: contentType ?? void 0,
			fileName
		};
	} finally {
		if (release) await release();
	}
}
//#endregion
//#region src/media/local-roots.ts
let cachedPreferredTmpDir;
function resolveCachedPreferredTmpDir() {
	if (!cachedPreferredTmpDir) cachedPreferredTmpDir = resolvePreferredOpenClawTmpDir();
	return cachedPreferredTmpDir;
}
function buildMediaLocalRoots(stateDir, options = {}) {
	const resolvedStateDir = path.resolve(stateDir);
	return [
		options.preferredTmpDir ?? resolveCachedPreferredTmpDir(),
		path.join(resolvedStateDir, "media"),
		path.join(resolvedStateDir, "agents"),
		path.join(resolvedStateDir, "workspace"),
		path.join(resolvedStateDir, "sandboxes")
	];
}
function getDefaultMediaLocalRoots() {
	return buildMediaLocalRoots(resolveStateDir());
}
//#endregion
//#region src/web/media.ts
function resolveWebMediaOptions(params) {
	if (typeof params.maxBytesOrOptions === "number" || params.maxBytesOrOptions === void 0) return {
		maxBytes: params.maxBytesOrOptions,
		optimizeImages: params.optimizeImages,
		ssrfPolicy: params.options?.ssrfPolicy,
		localRoots: params.options?.localRoots
	};
	return {
		...params.maxBytesOrOptions,
		optimizeImages: params.optimizeImages ? params.maxBytesOrOptions.optimizeImages ?? true : false
	};
}
var LocalMediaAccessError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "LocalMediaAccessError";
	}
};
function getDefaultLocalRoots() {
	return getDefaultMediaLocalRoots();
}
async function assertLocalMediaAllowed(mediaPath, localRoots) {
	if (localRoots === "any") return;
	const roots = localRoots ?? getDefaultLocalRoots();
	let resolved;
	try {
		resolved = await fs$1.realpath(mediaPath);
	} catch {
		resolved = path.resolve(mediaPath);
	}
	if (localRoots === void 0) {
		const workspaceRoot = roots.find((root) => path.basename(root) === "workspace");
		if (workspaceRoot) {
			const stateDir = path.dirname(workspaceRoot);
			const rel = path.relative(stateDir, resolved);
			if (rel && !rel.startsWith("..") && !path.isAbsolute(rel)) {
				if ((rel.split(path.sep)[0] ?? "").startsWith("workspace-")) throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
			}
		}
	}
	for (const root of roots) {
		let resolvedRoot;
		try {
			resolvedRoot = await fs$1.realpath(root);
		} catch {
			resolvedRoot = path.resolve(root);
		}
		if (resolvedRoot === path.parse(resolvedRoot).root) throw new LocalMediaAccessError("invalid-root", `Invalid localRoots entry (refuses filesystem root): ${root}. Pass a narrower directory.`);
		if (resolved === resolvedRoot || resolved.startsWith(resolvedRoot + path.sep)) return;
	}
	throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
}
const HEIC_MIME_RE = /^image\/hei[cf]$/i;
const HEIC_EXT_RE = /\.(heic|heif)$/i;
const MB = 1024 * 1024;
function formatMb(bytes, digits = 2) {
	return (bytes / MB).toFixed(digits);
}
function formatCapLimit(label, cap, size) {
	return `${label} exceeds ${formatMb(cap, 0)}MB limit (got ${formatMb(size)}MB)`;
}
function formatCapReduce(label, cap, size) {
	return `${label} could not be reduced below ${formatMb(cap, 0)}MB (got ${formatMb(size)}MB)`;
}
function isHeicSource(opts) {
	if (opts.contentType && HEIC_MIME_RE.test(opts.contentType.trim())) return true;
	if (opts.fileName && HEIC_EXT_RE.test(opts.fileName.trim())) return true;
	return false;
}
function toJpegFileName(fileName) {
	if (!fileName) return;
	const trimmed = fileName.trim();
	if (!trimmed) return fileName;
	const parsed = path.parse(trimmed);
	if (!parsed.ext || HEIC_EXT_RE.test(parsed.ext)) return path.format({
		dir: parsed.dir,
		name: parsed.name || trimmed,
		ext: ".jpg"
	});
	return path.format({
		dir: parsed.dir,
		name: parsed.name,
		ext: ".jpg"
	});
}
function logOptimizedImage(params) {
	if (!shouldLogVerbose()) return;
	if (params.optimized.optimizedSize >= params.originalSize) return;
	if (params.optimized.format === "png") {
		logVerbose(`Optimized PNG (preserving alpha) from ${formatMb(params.originalSize)}MB to ${formatMb(params.optimized.optimizedSize)}MB (side≤${params.optimized.resizeSide}px)`);
		return;
	}
	logVerbose(`Optimized media from ${formatMb(params.originalSize)}MB to ${formatMb(params.optimized.optimizedSize)}MB (side≤${params.optimized.resizeSide}px, q=${params.optimized.quality})`);
}
async function optimizeImageWithFallback(params) {
	const { buffer, cap, meta } = params;
	if ((meta?.contentType === "image/png" || meta?.fileName?.toLowerCase().endsWith(".png")) && await hasAlphaChannel(buffer)) {
		const optimized = await optimizeImageToPng(buffer, cap);
		if (optimized.buffer.length <= cap) return {
			...optimized,
			format: "png"
		};
		if (shouldLogVerbose()) logVerbose(`PNG with alpha still exceeds ${formatMb(cap, 0)}MB after optimization; falling back to JPEG`);
	}
	return {
		...await optimizeImageToJpeg(buffer, cap, meta),
		format: "jpeg"
	};
}
async function loadWebMediaInternal(mediaUrl, options = {}) {
	const { maxBytes, optimizeImages = true, ssrfPolicy, localRoots, sandboxValidated = false, readFile: readFileOverride } = options;
	mediaUrl = mediaUrl.replace(/^\s*MEDIA\s*:\s*/i, "");
	if (mediaUrl.startsWith("file://")) try {
		mediaUrl = fileURLToPath(mediaUrl);
	} catch {
		throw new LocalMediaAccessError("invalid-file-url", `Invalid file:// URL: ${mediaUrl}`);
	}
	const optimizeAndClampImage = async (buffer, cap, meta) => {
		const originalSize = buffer.length;
		const optimized = await optimizeImageWithFallback({
			buffer,
			cap,
			meta
		});
		logOptimizedImage({
			originalSize,
			optimized
		});
		if (optimized.buffer.length > cap) throw new Error(formatCapReduce("Media", cap, optimized.buffer.length));
		const contentType = optimized.format === "png" ? "image/png" : "image/jpeg";
		const fileName = optimized.format === "jpeg" && meta && isHeicSource(meta) ? toJpegFileName(meta.fileName) : meta?.fileName;
		return {
			buffer: optimized.buffer,
			contentType,
			kind: "image",
			fileName
		};
	};
	const clampAndFinalize = async (params) => {
		const cap = maxBytes !== void 0 ? maxBytes : maxBytesForKind(params.kind ?? "document");
		if (params.kind === "image") {
			const isGif = params.contentType === "image/gif";
			if (isGif || !optimizeImages) {
				if (params.buffer.length > cap) throw new Error(formatCapLimit(isGif ? "GIF" : "Media", cap, params.buffer.length));
				return {
					buffer: params.buffer,
					contentType: params.contentType,
					kind: params.kind,
					fileName: params.fileName
				};
			}
			return { ...await optimizeAndClampImage(params.buffer, cap, {
				contentType: params.contentType,
				fileName: params.fileName
			}) };
		}
		if (params.buffer.length > cap) throw new Error(formatCapLimit("Media", cap, params.buffer.length));
		return {
			buffer: params.buffer,
			contentType: params.contentType ?? void 0,
			kind: params.kind,
			fileName: params.fileName
		};
	};
	if (/^https?:\/\//i.test(mediaUrl)) {
		const defaultFetchCap = maxBytesForKind("document");
		const { buffer, contentType, fileName } = await fetchRemoteMedia({
			url: mediaUrl,
			maxBytes: maxBytes === void 0 ? defaultFetchCap : optimizeImages ? Math.max(maxBytes, defaultFetchCap) : maxBytes,
			ssrfPolicy
		});
		return await clampAndFinalize({
			buffer,
			contentType,
			kind: kindFromMime(contentType),
			fileName
		});
	}
	if (mediaUrl.startsWith("~")) mediaUrl = resolveUserPath(mediaUrl);
	if ((sandboxValidated || localRoots === "any") && !readFileOverride) throw new LocalMediaAccessError("unsafe-bypass", "Refusing localRoots bypass without readFile override. Use sandboxValidated with readFile, or pass explicit localRoots.");
	if (!(sandboxValidated || localRoots === "any")) await assertLocalMediaAllowed(mediaUrl, localRoots);
	let data;
	if (readFileOverride) data = await readFileOverride(mediaUrl);
	else try {
		data = (await readLocalFileSafely({ filePath: mediaUrl })).buffer;
	} catch (err) {
		if (err instanceof SafeOpenError) {
			if (err.code === "not-found") throw new LocalMediaAccessError("not-found", `Local media file not found: ${mediaUrl}`, { cause: err });
			if (err.code === "not-file") throw new LocalMediaAccessError("not-file", `Local media path is not a file: ${mediaUrl}`, { cause: err });
			throw new LocalMediaAccessError("invalid-path", `Local media path is not safe to read: ${mediaUrl}`, { cause: err });
		}
		throw err;
	}
	const mime = await detectMime({
		buffer: data,
		filePath: mediaUrl
	});
	const kind = kindFromMime(mime);
	let fileName = path.basename(mediaUrl) || void 0;
	if (fileName && !path.extname(fileName) && mime) {
		const ext = extensionForMime(mime);
		if (ext) fileName = `${fileName}${ext}`;
	}
	return await clampAndFinalize({
		buffer: data,
		contentType: mime,
		kind,
		fileName
	});
}
async function loadWebMedia(mediaUrl, maxBytesOrOptions, options) {
	return await loadWebMediaInternal(mediaUrl, resolveWebMediaOptions({
		maxBytesOrOptions,
		options,
		optimizeImages: true
	}));
}
async function optimizeImageToJpeg(buffer, maxBytes, opts = {}) {
	let source = buffer;
	if (isHeicSource(opts)) try {
		source = await convertHeicToJpeg(buffer);
	} catch (err) {
		throw new Error(`HEIC image conversion failed: ${String(err)}`, { cause: err });
	}
	const sides = [
		2048,
		1536,
		1280,
		1024,
		800
	];
	const qualities = [
		80,
		70,
		60,
		50,
		40
	];
	let smallest = null;
	for (const side of sides) for (const quality of qualities) try {
		const out = await resizeToJpeg({
			buffer: source,
			maxSide: side,
			quality,
			withoutEnlargement: true
		});
		const size = out.length;
		if (!smallest || size < smallest.size) smallest = {
			buffer: out,
			size,
			resizeSide: side,
			quality
		};
		if (size <= maxBytes) return {
			buffer: out,
			optimizedSize: size,
			resizeSide: side,
			quality
		};
	} catch {}
	if (smallest) return {
		buffer: smallest.buffer,
		optimizedSize: smallest.size,
		resizeSide: smallest.resizeSide,
		quality: smallest.quality
	};
	throw new Error("Failed to optimize image");
}
//#endregion
//#region src/plugin-sdk/outbound-media.ts
async function loadOutboundMediaFromUrl(mediaUrl, options = {}) {
	return await loadWebMedia(mediaUrl, {
		maxBytes: options.maxBytes,
		localRoots: options.mediaLocalRoots
	});
}
//#endregion
//#region src/plugin-sdk/pairing-access.ts
function createScopedPairingAccess(params) {
	const resolvedAccountId = normalizeAccountId(params.accountId);
	return {
		accountId: resolvedAccountId,
		readAllowFromStore: () => params.core.channel.pairing.readAllowFromStore({
			channel: params.channel,
			accountId: resolvedAccountId
		}),
		readStoreForDmPolicy: (provider, accountId) => params.core.channel.pairing.readAllowFromStore({
			channel: provider,
			accountId: normalizeAccountId(accountId)
		}),
		upsertPairingRequest: (input) => params.core.channel.pairing.upsertPairingRequest({
			channel: params.channel,
			accountId: resolvedAccountId,
			...input
		})
	};
}
//#endregion
export { BlockStreamingCoalesceSchema, DEFAULT_ACCOUNT_ID, DEFAULT_GROUP_HISTORY_LIMIT, DM_GROUP_ACCESS_REASON, DmPolicySchema, GroupPolicySchema, MarkdownConfigSchema, applyAccountNameToChannelSection, applySetupAccountConfigPatch, buildAgentMediaPayload, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, buildModelsProviderData, buildPendingHistoryContextFromMap, buildSecretInputSchema, buildSingleChannelSecretPromptState, clearHistoryEntriesIfEnabled, createAccountListHelpers, createAccountStatusSink, createDedupeCache, createReplyPrefixOptions, createScopedPairingAccess, createTypingCallbacks, deleteAccountFromConfigSection, emptyPluginConfigSchema, evaluateSenderGroupAccessForPolicy, formatInboundFromLabel, formatPairingApproveHint, hasConfiguredSecretInput, isDangerousNameMatchingEnabled, isLoopbackHost, isTrustedProxyAddress, listSkillCommandsForAgents, loadOutboundMediaFromUrl, loadSessionStore, logInboundDrop, logTypingFailure, migrateBaseNameToDefaultAccount, normalizeAccountId, normalizeProviderId, normalizeResolvedSecretInputString, normalizeSecretInputString, parseStrictPositiveInteger, promptAccountId, promptSingleChannelSecretInput, rawDataToString, readStoreAllowFromForDmPolicy, recordPendingHistoryEntryIfEnabled, registerPluginHttpRoute, requireOpenAllowFrom, resolveAccountIdForConfigure, resolveAllowlistMatchSimple, resolveAllowlistProviderRuntimeGroupPolicy, resolveChannelMediaMaxBytes, resolveClientIp, resolveControlCommandGate, resolveDefaultGroupPolicy, resolveDmGroupAccessWithLists, resolveEffectiveAllowFromLists, resolveStorePath, resolveStoredModelOverride, resolveThreadSessionKeys, runSingleChannelSecretStep, setAccountEnabledInConfigSection, warnMissingProviderGroupPolicyFallbackOnce };
