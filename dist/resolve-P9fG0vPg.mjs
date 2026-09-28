import { F as resolveTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CLj0HTDM.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-QODkv80i.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { a as runtimeMediaModelSecretOwnerId, r as resolveEffectiveMediaEntryCapabilities } from "./entry-capabilities-DIuRkXhI.mjs";
import { a as DEFAULT_TIMEOUT_SECONDS, i as DEFAULT_PROMPT, n as DEFAULT_MAX_BYTES, r as DEFAULT_MAX_CHARS_BY_CAPABILITY } from "./defaults.constants-Cof2g8lZ.mjs";
//#region src/media-understanding/scope.ts
function normalizeDecision(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "allow") return "allow";
	if (normalized === "deny") return "deny";
}
/** Normalizes channel/direct chat type aliases used by media-understanding scope rules. */
function normalizeMediaUnderstandingChatType(raw) {
	return normalizeChatType(raw ?? void 0);
}
/** Evaluates ordered media-understanding scope rules against channel, chat type, and session key. */
function resolveMediaUnderstandingScope(params) {
	const scope = params.scope;
	if (!scope) return "allow";
	const channel = normalizeOptionalLowercaseString(params.channel);
	const chatType = normalizeMediaUnderstandingChatType(params.chatType);
	const sessionKey = normalizeOptionalLowercaseString(params.sessionKey) ?? "";
	for (const rule of scope.rules ?? []) {
		if (!rule) continue;
		const action = normalizeDecision(rule.action) ?? "allow";
		const match = rule.match ?? {};
		const matchChannel = normalizeOptionalLowercaseString(match.channel);
		const matchChatType = normalizeMediaUnderstandingChatType(match.chatType);
		const matchPrefix = normalizeOptionalLowercaseString(match.keyPrefix);
		if (matchChannel && matchChannel !== channel) continue;
		if (matchChatType && matchChatType !== chatType) continue;
		if (matchPrefix && !sessionKey.startsWith(matchPrefix)) continue;
		return action;
	}
	return normalizeDecision(scope.default) ?? "allow";
}
//#endregion
//#region src/media-understanding/resolve.ts
var MediaCliModelUnavailableError = class extends Error {
	constructor(reason, message) {
		super(`${reason}; ${message}`);
		this.reason = reason;
	}
};
/** Resolve executable CLI inputs without making invalid media config startup-fatal. */
function resolveCliModelEntry(entry) {
	const command = normalizeOptionalString(entry.command);
	if (!command) return err(new MediaCliModelUnavailableError("cli-missing-command", "Set command to the media executable and args to pass the attachment, for example [\"{{AttachmentPath}}\"]."));
	const args = entry.args;
	if (!Array.isArray(args) || args.length === 0) return err(new MediaCliModelUnavailableError("cli-missing-attachment-arg", "Set args to pass the attachment, for example [\"{{AttachmentPath}}\"]. CLI stdin is not supplied."));
	return ok({
		command,
		args
	});
}
/** Default per-provider media-understanding runtime timeout in milliseconds. */
const DEFAULT_MEDIA_RUNTIME_TIMEOUT_MS = 3e4;
const MIN_MEDIA_TIMEOUT_MS = 1e3;
/** Converts configured timeout seconds into a timer-safe millisecond deadline. */
function resolveTimeoutMs(seconds, fallbackSeconds) {
	const value = typeof seconds === "number" && Number.isFinite(seconds) ? seconds : fallbackSeconds;
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return MIN_MEDIA_TIMEOUT_MS;
	const timeoutMs = Math.floor(value * 1e3);
	return resolveTimerTimeoutMs(Number.isFinite(timeoutMs) ? timeoutMs : MAX_TIMER_TIMEOUT_MS, MIN_MEDIA_TIMEOUT_MS, MIN_MEDIA_TIMEOUT_MS);
}
/** Clamps an already-millisecond runtime timeout to the shared timer bounds. */
function resolveMediaRuntimeTimeoutMs(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, DEFAULT_MEDIA_RUNTIME_TIMEOUT_MS);
}
/** Resolves the provider prompt and appends length guidance for non-audio outputs. */
function resolvePrompt(capability, prompt, maxChars) {
	const base = prompt?.trim() || DEFAULT_PROMPT[capability];
	if (!maxChars || capability === "audio") return base;
	return `${base} Respond in at most ${maxChars} characters.`;
}
/** Resolves the effective max response characters for a model entry and capability. */
function resolveMaxChars(params) {
	const { capability, entry, cfg } = params;
	const configured = entry.maxChars ?? params.config?.maxChars ?? cfg.tools?.media?.[capability]?.maxChars;
	if (typeof configured === "number") return configured;
	return DEFAULT_MAX_CHARS_BY_CAPABILITY[capability];
}
/** Resolves the effective input byte cap for a model entry and capability. */
function resolveMaxBytes(params) {
	const configured = params.entry.maxBytes ?? params.config?.maxBytes ?? params.cfg.tools?.media?.[params.capability]?.maxBytes;
	if (typeof configured === "number") return configured;
	return DEFAULT_MAX_BYTES[params.capability];
}
function resolveEntryRunOptions(params) {
	const { capability, entry, cfg } = params;
	const maxBytes = resolveMaxBytes({
		capability,
		entry,
		cfg,
		config: params.config
	});
	const maxChars = resolveMaxChars({
		capability,
		entry,
		cfg,
		config: params.config
	});
	const timeoutMs = resolveTimeoutMs(entry.timeoutSeconds ?? params.config?.timeoutSeconds ?? cfg.tools?.media?.[capability]?.timeoutSeconds, DEFAULT_TIMEOUT_SECONDS[capability]);
	const configuredPrompt = entry.prompt ?? params.config?.prompt ?? cfg.tools?.media?.[capability]?.prompt;
	return {
		maxBytes,
		maxChars,
		timeoutMs,
		prompt: resolvePrompt(capability, configuredPrompt, maxChars),
		hasConfiguredPrompt: Boolean(configuredPrompt?.trim())
	};
}
/** Maps the message context to an allow/deny decision for configured media scope rules. */
function resolveScopeDecision(params) {
	return resolveMediaUnderstandingScope({
		scope: params.scope,
		sessionKey: params.ctx.SessionKey,
		channel: params.ctx.Surface ?? params.ctx.Provider,
		chatType: normalizeMediaUnderstandingChatType(params.ctx.ChatType)
	});
}
/** Resolves configured model entries that can handle the requested media capability. */
function resolveModelEntries(params) {
	const { cfg, capability, config } = params;
	const sharedModels = cfg.tools?.media?.models ?? [];
	const entries = [];
	sharedModels.forEach((entry, index) => {
		const caps = resolveEffectiveMediaEntryCapabilities({
			entry,
			providerRegistry: params.providerRegistry
		});
		if (!caps || caps.length === 0) {
			if (shouldLogVerbose()) logVerbose(`Skipping shared media model without capabilities: ${entry.provider ?? entry.command ?? "unknown"}`);
			return;
		}
		if (caps.includes(capability)) entries.push({
			entry,
			secretOwnerId: runtimeMediaModelSecretOwnerId(index)
		});
	});
	const preferred = config?.preferredModel?.trim();
	if (preferred) entries.sort((left, right) => preferredMediaModelRank(right.entry, preferred) - preferredMediaModelRank(left.entry, preferred));
	return entries;
}
function preferredMediaModelRank(entry, preferred) {
	if (entry.type === "cli" || entry.command) return preferred === `cli:${entry.command ?? ""}` ? 2 : 0;
	const model = entry.model?.trim();
	if (!model) return preferred === `provider:${entry.provider?.trim() ?? ""}` ? 2 : 0;
	if (preferred === `${entry.provider?.trim() ?? ""}/${model}`) return 2;
	return preferred === model ? 1 : 0;
}
/** Resolves the bounded media-understanding task concurrency from config. */
function resolveConcurrency(cfg) {
	const configured = cfg.tools?.media?.concurrency;
	if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) return Math.floor(configured);
	return 2;
}
//#endregion
export { resolveMediaRuntimeTimeoutMs as a, resolveTimeoutMs as c, resolveMaxBytes as i, resolveConcurrency as n, resolveModelEntries as o, resolveEntryRunOptions as r, resolveScopeDecision as s, resolveCliModelEntry as t };
