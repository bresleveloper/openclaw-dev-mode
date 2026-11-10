import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { d as normalizeStringEntries, i as normalizeAtHashSlug } from "./string-normalization-D6DKCpwE.mjs";
import { n as CHAT_CHANNEL_ORDER } from "./ids-DhLNdNuz.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import { r as isDevMode } from "./globals-XVSoVbNQ.mjs";
import { c as shouldUseFromAsSenderFallback } from "./command-auth-D8Y1MxJm.mjs";
import "./elevated-unavailable-Czag2DfL.mjs";
//#region src/auto-reply/reply/get-reply-exec-overrides.ts
function resolveReplyExecOverrides(params) {
	const host = params.directives?.execHost ?? params.sessionEntry?.execHost ?? params.agentExecDefaults?.host;
	const security = params.directives?.execSecurity ?? params.agentExecDefaults?.security;
	const ask = params.directives?.execAsk ?? params.agentExecDefaults?.ask;
	const node = params.directives?.execNode ?? params.sessionEntry?.execNode ?? params.agentExecDefaults?.node;
	const nodeCwd = node && node === params.sessionEntry?.execNode ? params.sessionEntry.execCwd : void 0;
	if (!host && !security && !ask && !node && !nodeCwd) return;
	return {
		host,
		security,
		ask,
		node,
		...nodeCwd ? { nodeCwd } : {}
	};
}
//#endregion
//#region src/auto-reply/reply/elevated-allowlist-matcher.ts
const INTERNAL_ALLOWLIST_CHANNEL = "webchat";
const EXPLICIT_ELEVATED_ALLOW_FIELDS = /* @__PURE__ */ new Set([
	"id",
	"from",
	"e164",
	"name",
	"username",
	"tag"
]);
const SENDER_PREFIXES = [
	...CHAT_CHANNEL_ORDER,
	INTERNAL_ALLOWLIST_CHANNEL,
	"user",
	"group",
	"channel"
];
const SENDER_PREFIX_RE = new RegExp(`^(${SENDER_PREFIXES.join("|")}):`, "i");
/** Parses explicit elevated allowlist entries such as `id:telegram:123`. */
function parseExplicitElevatedAllowEntry(entry) {
	const separatorIndex = entry.indexOf(":");
	if (separatorIndex <= 0) return null;
	const fieldRaw = normalizeLowercaseStringOrEmpty(entry.slice(0, separatorIndex));
	if (!EXPLICIT_ELEVATED_ALLOW_FIELDS.has(fieldRaw)) return null;
	const value = entry.slice(separatorIndex + 1).trim();
	if (!value) return null;
	return {
		field: fieldRaw,
		value
	};
}
function addTokenVariants(tokens, value) {
	if (!value) return;
	tokens.add(value);
	const normalized = normalizeLowercaseStringOrEmpty(value);
	if (normalized) tokens.add(normalized);
}
/** Builds the channel-formatted identity variants used on both sides of matching. */
function buildFormattedTokens(params) {
	const tokens = /* @__PURE__ */ new Set();
	const values = params.includeStripped ? [params.value, params.value.trim().replace(SENDER_PREFIX_RE, "")].filter(Boolean) : [params.value];
	for (const entry of params.formatAllowFrom(values)) addTokenVariants(tokens, entry);
	return tokens;
}
/** Checks a value against formatted identity tokens. */
function matchesFormattedTokens(params) {
	for (const token of buildFormattedTokens(params)) if (params.tokens.has(token)) return true;
	return false;
}
function buildMutableTokenVariants(value) {
	const tokens = /* @__PURE__ */ new Set();
	addTokenVariants(tokens, value);
	addTokenVariants(tokens, normalizeAtHashSlug(value));
	return tokens;
}
/** Builds normalized variants for mutable labels such as names and tags. */
function buildMutableTokens(value) {
	return buildMutableTokenVariants(normalizeOptionalString(value) ?? "");
}
/** Checks mutable label text against normalized token variants. */
function matchesMutableTokens(value, tokens) {
	if (!value || tokens.size === 0) return false;
	for (const probe of buildMutableTokenVariants(value)) if (tokens.has(probe)) return true;
	return false;
}
//#endregion
//#region src/auto-reply/reply/reply-elevated.ts
function resolveAllowFromFormatter(params) {
	const normalizedProvider = normalizeAnyChannelId(params.provider);
	const formatAllowFrom = normalizedProvider ? getChannelPlugin(normalizedProvider)?.config?.formatAllowFrom : void 0;
	if (!formatAllowFrom) return normalizeStringEntries;
	return (values) => formatAllowFrom({
		cfg: params.cfg,
		accountId: params.accountId,
		allowFrom: values
	}).map((entry) => normalizeOptionalString(entry) ?? "").filter(Boolean);
}
function isApprovedElevatedSender(params) {
	const configuredAllow = params.allowFrom?.[params.provider];
	const allowTokens = normalizeStringEntries(Array.isArray(configuredAllow) ? configuredAllow : params.fallbackAllowFrom);
	if (allowTokens.length === 0) return false;
	if (allowTokens.some((entry) => entry === "*")) return true;
	const senderId = normalizeOptionalString(params.ctx.SenderId);
	const senderFrom = normalizeOptionalString(params.ctx.From);
	const senderE164 = normalizeOptionalString(params.ctx.SenderE164);
	const identityTokens = (value, includeStripped) => value ? buildFormattedTokens({
		formatAllowFrom: params.formatAllowFrom,
		value,
		includeStripped
	}) : /* @__PURE__ */ new Set();
	const fieldTokens = {
		id: identityTokens(senderId, true),
		from: identityTokens(senderFrom && shouldUseFromAsSenderFallback({
			from: senderFrom,
			chatType: params.ctx.ChatType
		}) ? senderFrom : void 0, true),
		e164: identityTokens(senderE164, false),
		name: buildMutableTokens(params.ctx.SenderName),
		username: buildMutableTokens(params.ctx.SenderUsername),
		tag: buildMutableTokens(params.ctx.SenderTag)
	};
	const senderIdentityTokens = /* @__PURE__ */ new Set([
		...fieldTokens.id,
		...fieldTokens.from,
		...fieldTokens.e164
	]);
	return allowTokens.some((entry) => {
		const explicitEntry = parseExplicitElevatedAllowEntry(entry);
		if (!explicitEntry) return matchesFormattedTokens({
			formatAllowFrom: params.formatAllowFrom,
			value: entry,
			includeStripped: true,
			tokens: senderIdentityTokens
		});
		const { field, value } = explicitEntry;
		const tokens = fieldTokens[field];
		return field === "name" || field === "username" || field === "tag" ? matchesMutableTokens(value, tokens) : matchesFormattedTokens({
			formatAllowFrom: params.formatAllowFrom,
			value,
			includeStripped: field !== "e164",
			tokens
		});
	});
}
function resolveElevatedPermissions(params) {
	if (isDevMode()) {
		if (((resolveAgentConfig(params.cfg, params.agentId)?.tools)?.profile ?? params.cfg.tools?.profile) === "full") return {
			enabled: true,
			allowed: true,
			failures: []
		};
	}
	const globalConfig = params.cfg.tools?.elevated;
	const agentConfig = resolveAgentConfig(params.cfg, params.agentId)?.tools?.elevated;
	const globalEnabled = globalConfig?.enabled !== false;
	const agentEnabled = agentConfig?.enabled !== false;
	const enabled = globalEnabled && agentEnabled;
	const failures = [];
	if (!globalEnabled) failures.push({
		gate: "enabled",
		key: "tools.elevated.enabled"
	});
	if (!agentEnabled) failures.push({
		gate: "enabled",
		key: "agents.entries.*.tools.elevated.enabled"
	});
	if (!enabled) return {
		enabled,
		allowed: false,
		failures
	};
	if (!params.provider) {
		failures.push({
			gate: "provider",
			key: "ctx.Provider"
		});
		return {
			enabled,
			allowed: false,
			failures
		};
	}
	const normalizedProvider = normalizeAnyChannelId(params.provider);
	const fallbackAllowFrom = normalizedProvider ? getChannelPlugin(normalizedProvider)?.elevated?.allowFromFallback?.({
		cfg: params.cfg,
		accountId: params.ctx.AccountId
	}) : void 0;
	const formatAllowFrom = resolveAllowFromFormatter({
		cfg: params.cfg,
		provider: params.provider,
		accountId: params.ctx.AccountId
	});
	const isAllowed = (allowFrom) => isApprovedElevatedSender({
		provider: params.provider,
		ctx: params.ctx,
		formatAllowFrom,
		allowFrom,
		fallbackAllowFrom
	});
	if (!isAllowed(globalConfig?.allowFrom)) {
		failures.push({
			gate: "allowFrom",
			key: `tools.elevated.allowFrom.${params.provider}`
		});
		return {
			enabled,
			allowed: false,
			failures
		};
	}
	const agentAllowed = agentConfig?.allowFrom ? isAllowed(agentConfig.allowFrom) : true;
	if (!agentAllowed) failures.push({
		gate: "allowFrom",
		key: `agents.entries.*.tools.elevated.allowFrom.${params.provider}`
	});
	return {
		enabled,
		allowed: agentAllowed,
		failures
	};
}
//#endregion
export { resolveReplyExecOverrides as n, resolveElevatedPermissions as t };
