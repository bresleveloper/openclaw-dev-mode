import { _ as __exportAll, a as FeishuChannelConfigSchema, c as normalizeFeishuExternalKey, d as listEnabledFeishuAccounts, f as listFeishuAccountIds, g as resolveFeishuRuntimeAccount, h as resolveFeishuAccount, m as resolveDefaultFeishuAccountId, n as legacyConfigRules, o as DEFAULT_FEISHU_WEBHOOK_PATH, p as mergeFeishuAccountConfig, r as normalizeCompatibilityConfig, s as normalizeFeishuWebhookPath, u as inspectFeishuCredentials, v as __reExport } from "./doctor-contract-DyOo8NvC.mjs";
import { a as parseFeishuTargetId, c as looksLikeFeishuId, i as parseFeishuDirectConversationId, l as normalizeFeishuTarget, n as buildFeishuModelOverrideParentCandidates, o as resolveConfiguredFeishuGroupSessionScope, r as parseFeishuConversationId, t as buildFeishuConversationId, u as resolveReceiveIdType } from "./conversation-id-C1ofUfU8.mjs";
import { $ as cleanupAmbientCommentTypingReaction, A as sendMessageFeishu, Ct as readFeishuChatInfoWithAuthorization, G as deliverCommentThreadText, H as buildFeishuMediaFallbackText, M as toFeishuMessageSendResult, Nt as normalizeFeishuChatType, Ot as resolveFeishuGroupConfig, Pt as resolveFeishuChatType, S as sendMediaFeishu, St as isFeishuGroupReadEnabled, T as chunkFeishuCardMarkdown, W as resolveFeishuIdentityHeaderTitle, _ as renderFeishuPresentationPayload, _t as assertFeishuChatReadAllowed, b as withinCardTableLimit, bt as canEnumerateAllFeishuPeers, c as buildFeishuPayloadCard, ct as parseFeishuCommentTarget, d as consumeFeishuPresentationFallbackMarker, dt as chunkFeishuMarkdown, f as feishuCardWithinTableLimit, ft as chunkFeishuPostMarkdown, g as renderFeishuPresentationFallbackText, h as readNativeFeishuCard, ht as shouldUseFeishuCard, j as sendStructuredCardFeishu, jt as resolveFeishuGroupToolPolicy, k as sendCardFeishu, l as buildFeishuPresentationCard, lt as readNativeFeishuCardJson, m as markRenderedFeishuCard, n as createFeishuReplyDeliveryResult, o as FEISHU_PRESENTATION_CAPABILITIES, p as isFeishuCardWithinEnvelope, pt as materializeFeishuPostMarkdownSoftBreaks, s as assertFeishuCardWithinEnvelope, t as createFeishuPartialReplyDeliveryError, u as buildFeishuPresentationFallback, vt as authorizeFeishuChatMemberRead, w as shouldSuppressFeishuTextForVoiceMedia, wt as resolveFeishuChatReadPreliminaryAuthorization, xt as isFeishuGroupReadAllowed, y as resolveFeishuRichReply, yt as canEnumerateAllFeishuGroups } from "./reply-delivery-result-laBNOmBu.mjs";
import { t as messageActionTargetAliases } from "./message-action-contract-Bhxj8Zrf.mjs";
import { l as withFeishuRequestContext, r as createFeishuClient, u as withFeishuSendContext } from "./client-CcxmEkoy.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-CI1wCr9i.mjs";
import { t as collectFeishuSecurityAuditFindings } from "./security-audit-b86aSgH2.mjs";
import { t as resolveFeishuSessionConversation } from "./session-conversation-C53IEUWt.mjs";
import { createLazyRuntimeModule, createLazyRuntimeNamedExport } from "openclaw/plugin-sdk/lazy-runtime";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-resolution";
import { resolveAgentConfig } from "openclaw/plugin-sdk/agent-scope-runtime";
import { formatAllowFromLowercase } from "openclaw/plugin-sdk/allow-from";
import { ToolAuthorizationError, createActionGate } from "openclaw/plugin-sdk/channel-actions";
import { adaptScopedAccountAccessor, createHybridChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
import { buildChannelOutboundSessionRoute, createChatChannelPlugin, stripChannelTargetPrefix } from "openclaw/plugin-sdk/channel-core";
import { createAccountStatusSink, createMessageReceiptFromOutboundResults, createReplyToFanout, createRuntimeOutboundDelegates, defineChannelMessageAdapter } from "openclaw/plugin-sdk/channel-outbound";
import { createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { createAllowlistProviderGroupPolicyWarningCollector, createConditionalWarningCollector } from "openclaw/plugin-sdk/channel-policy";
import { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
import { getSessionBindingService } from "openclaw/plugin-sdk/conversation-runtime";
import { applyDirectoryQueryAndLimit, createChannelDirectoryAdapter, createRuntimeDirectoryLiveAdapter, listDirectoryGroupEntriesFromMapKeysAndAllowFrom, listDirectoryUserEntriesFromAllowFrom, listDirectoryUserEntriesFromAllowFromAndMapKeys } from "openclaw/plugin-sdk/directory-runtime";
import { PlatformMessageNotDispatchedError } from "openclaw/plugin-sdk/error-runtime";
import { resolveLegacyInteractiveTextFallback } from "openclaw/plugin-sdk/interactive-runtime";
import { parseStrictPositiveInteger } from "openclaw/plugin-sdk/number-runtime";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, createSetupTranslator, formatDocsLink, hasConfiguredSecretInput, mergeAllowFromEntries, patchScopedAccountConfig, patchTopLevelChannelConfigSection, promptSingleChannelSecretInput, setSetupChannelEnabled, splitSetupEntries } from "openclaw/plugin-sdk/setup";
import { buildProbeChannelStatusSummary, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { convertMarkdownTables, sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { textResult } from "openclaw/plugin-sdk/tool-results";
import { createChannelApprovalAuth } from "openclaw/plugin-sdk/approval-auth-runtime";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { safeStatSync } from "@openclaw/fs-safe/path";
import { isPathStrictlyInside } from "openclaw/plugin-sdk/file-access-runtime";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import { deleteSessionEntry, isValidAgentHarnessSessionStoreEntry, listSessionEntries, loadTranscriptEventsSync, resolveSessionStoreBackupPaths, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
import { resolveChunkMode, resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-chunking";
import { isChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { attachChannelToResult, createAttachedChannelResultAdapter } from "openclaw/plugin-sdk/channel-send-result";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { getReplyPayloadTtsSupplement, resolvePayloadMediaUrls, sendPayloadMediaSequenceAndFinalize, sendTextMediaPayload } from "openclaw/plugin-sdk/reply-payload";
import { statRegularFileSync } from "openclaw/plugin-sdk/security-runtime";
import { readStringParam } from "openclaw/plugin-sdk/param-readers";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
//#region extensions/feishu/src/approval-auth.ts
function normalizeFeishuApproverId(value) {
	const normalized = normalizeFeishuTarget(String(value));
	const trimmed = normalizeOptionalLowercaseString(normalized);
	return trimmed?.startsWith("ou_") ? trimmed : void 0;
}
const feishuApprovalAuth = createChannelApprovalAuth({
	channelLabel: "Feishu",
	resolveInputs: ({ cfg, accountId }) => {
		return { allowFrom: resolveFeishuAccount({
			cfg,
			accountId
		}).config.allowFrom };
	},
	normalizeApprover: normalizeFeishuApproverId
}).approvalAuth;
//#endregion
//#region extensions/feishu/src/directory.static.ts
async function listFeishuDirectoryPeers(params) {
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return listDirectoryUserEntriesFromAllowFromAndMapKeys({
		allowFrom: account.config.allowFrom,
		map: account.config.dms,
		query: params.query,
		limit: params.limit,
		normalizeAllowFromId: (entry) => normalizeFeishuTarget(entry) ?? entry,
		normalizeMapKeyId: (entry) => normalizeFeishuTarget(entry) ?? entry
	}).map(({ id }) => ({
		kind: "user",
		id
	}));
}
async function listFeishuDirectoryGroups(params) {
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return listDirectoryGroupEntriesFromMapKeysAndAllowFrom({
		groups: account.config.groups,
		allowFrom: account.config.groupAllowFrom,
		query: params.query,
		limit: params.limit
	}).map(({ id }) => ({
		kind: "group",
		id
	}));
}
async function listAuthorizedFeishuDirectoryPeers(params) {
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return listDirectoryUserEntriesFromAllowFrom({
		allowFrom: account.config.allowFrom,
		query: params.query,
		limit: params.limit,
		normalizeId: (entry) => normalizeFeishuTarget(entry) ?? entry
	}).map(({ id }) => ({
		kind: "user",
		id
	}));
}
async function listAuthorizedFeishuDirectoryGroups(params) {
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const enabledGroups = Object.fromEntries(Object.entries(account.config.groups ?? {}).filter(([, group]) => group?.enabled !== false));
	const authorizedEntries = listDirectoryGroupEntriesFromMapKeysAndAllowFrom({
		groups: enabledGroups,
		allowFrom: account.config.groupAllowFrom
	}).filter((entry) => isFeishuGroupReadAllowed(params.cfg, account, entry.id, false));
	return applyDirectoryQueryAndLimit(authorizedEntries.map((entry) => entry.id), params).map((id) => ({
		kind: "group",
		id
	}));
}
//#endregion
//#region extensions/feishu/src/doctor-agent-roster.ts
function collectFeishuDoctorAgentIds(cfg) {
	const agents = isRecord(cfg) && isRecord(cfg.agents) ? cfg.agents : void 0;
	if (isRecord(agents?.entries)) {
		const ids = Object.keys(agents.entries).map(normalizeAgentId);
		return [...new Set(ids.length > 0 ? ids : ["main"])].toSorted();
	}
	const entries = Object.prototype.propertyIsEnumerable.call(agents ?? {}, "list") && Array.isArray(agents?.list) ? agents.list.filter(isRecord) : [];
	const chosen = entries.find((entry) => entry.default === true) ?? entries[0];
	const ids = /* @__PURE__ */ new Set([normalizeAgentId(typeof chosen?.id === "string" && chosen.id.trim() ? chosen.id : "main")]);
	for (const entry of entries) if (typeof entry.id === "string" && entry.id.trim()) ids.add(normalizeAgentId(entry.id));
	return [...ids].toSorted();
}
//#endregion
//#region src/gateway/gateway-http-route-contracts.ts
const GATEWAY_PROBE_ROUTES = /* @__PURE__ */ new Map([
	["/health", "live"],
	["/healthz", "live"],
	["/ready", "ready"],
	["/readyz", "ready"],
	["/startup", "startup"],
	["/startupz", "startup"]
]);
function classifyGatewayProbePath(pathname) {
	for (const [root, status] of GATEWAY_PROBE_ROUTES) {
		if (pathname === root) return status;
		if (pathname.startsWith(`${root}/`)) return "namespace";
	}
	return "outside";
}
//#endregion
//#region packages/normalization-core/src/string-coerce.ts
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString$1(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString$1(value) {
	return normalizeNullableString$1(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString$1(value) {
	return normalizeOptionalString$1(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty$1(value) {
	return normalizeOptionalLowercaseString$1(value) ?? "";
}
//#endregion
//#region src/plugins/http-path-prefix.ts
function prefixMatchPath(pathname, prefix) {
	return pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}%`);
}
//#endregion
//#region src/gateway/security-path.ts
const MAX_PATH_DECODE_PASSES = 32;
function normalizePathSeparators(pathname) {
	const collapsed = pathname.replace(/\/{2,}/g, "/");
	if (collapsed.length <= 1) return collapsed;
	return collapsed.replace(/\/+$/, "");
}
function resolveDotSegments(pathname) {
	try {
		return new URL(pathname, "http://localhost").pathname;
	} catch {
		return pathname;
	}
}
function normalizePathForSecurity(pathname) {
	return normalizePathSeparators(normalizeLowercaseStringOrEmpty$1(resolveDotSegments(pathname))) || "/";
}
function buildCanonicalPathCandidates(pathname, maxDecodePasses = MAX_PATH_DECODE_PASSES) {
	const candidates = /* @__PURE__ */ new Set([normalizePathForSecurity(pathname)]);
	let decoded = pathname;
	let malformedEncoding = false;
	let decodePasses = 0;
	for (let pass = 0; pass < maxDecodePasses; pass++) {
		let nextDecoded;
		try {
			nextDecoded = decodeURIComponent(decoded);
		} catch {
			malformedEncoding = true;
			break;
		}
		if (nextDecoded === decoded) break;
		decodePasses += 1;
		decoded = nextDecoded;
		candidates.add(normalizePathForSecurity(decoded));
	}
	let decodePassLimitReached = false;
	if (!malformedEncoding) try {
		decodePassLimitReached = decodeURIComponent(decoded) !== decoded;
	} catch {
		malformedEncoding = true;
	}
	return {
		candidates: [...candidates],
		decodePasses,
		decodePassLimitReached,
		malformedEncoding
	};
}
function canonicalizePathForSecurity(pathname) {
	const { candidates, decodePasses, decodePassLimitReached, malformedEncoding } = buildCanonicalPathCandidates(pathname);
	return {
		canonicalPath: candidates[candidates.length - 1] ?? "/",
		candidates,
		decodePasses,
		decodePassLimitReached,
		malformedEncoding,
		rawNormalizedPath: normalizePathSeparators(normalizeLowercaseStringOrEmpty$1(pathname)) || "/"
	};
}
const PROTECTED_PLUGIN_ROUTE_PREFIXES = ["/api/channels"];
//#endregion
//#region src/gateway/server/plugins-http/path-context.ts
function normalizeProtectedPrefix(prefix) {
	const collapsed = normalizeLowercaseStringOrEmpty$1(prefix).replace(/\/{2,}/g, "/");
	if (collapsed.length <= 1) return collapsed || "/";
	return collapsed.replace(/\/+$/, "");
}
const NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES = PROTECTED_PLUGIN_ROUTE_PREFIXES.map(normalizeProtectedPrefix);
/** Returns true when any decoded path candidate targets a protected route. */
function isProtectedPluginRoutePathFromContext(context) {
	if (context.candidates.some((candidate) => NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) => prefixMatchPath(candidate, prefix)))) return true;
	if (context.decodePassLimitReached) return true;
	if (!context.malformedEncoding) return false;
	return NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) => prefixMatchPath(context.rawNormalizedPath, prefix));
}
/** Builds all security-relevant decoded path candidates for a request path. */
function resolvePluginRoutePathContext(pathname) {
	const canonical = canonicalizePathForSecurity(pathname);
	return {
		pathname,
		canonicalPath: canonical.canonicalPath,
		candidates: canonical.candidates,
		malformedEncoding: canonical.malformedEncoding,
		decodePassLimitReached: canonical.decodePassLimitReached,
		rawNormalizedPath: canonical.rawNormalizedPath
	};
}
//#endregion
//#region \0openclaw:bundled-sdk:openclaw/plugin-sdk/gateway-config-runtime
var gateway_config_runtime_exports = /* @__PURE__ */ __exportAll({
	classifyGatewayProbePath: () => classifyGatewayProbePath,
	isProtectedPluginRoutePathFromContext: () => isProtectedPluginRoutePathFromContext,
	resolvePluginRoutePathContext: () => resolvePluginRoutePathContext
});
import * as import_openclaw_plugin_sdk_gateway_config_runtime from "openclaw/plugin-sdk/gateway-config-runtime";
__reExport(gateway_config_runtime_exports, import_openclaw_plugin_sdk_gateway_config_runtime);
//#endregion
//#region extensions/feishu/src/webhook-route.ts
function resolveFeishuLegacyWebhookListener(config) {
	const listener = config.legacyWebhook;
	return listener ? {
		port: listener.port,
		host: listener.host ?? "127.0.0.1"
	} : void 0;
}
function describeFeishuWebhookPathConflict(path) {
	const normalized = normalizeFeishuWebhookPath(path);
	if (!normalized) return;
	const pathname = new URL(normalized, "http://localhost").pathname;
	const probe = classifyGatewayProbePath(pathname);
	let reason;
	if (probe !== "outside" && probe !== "namespace") reason = "is reserved for Gateway probes";
	else if (isProtectedPluginRoutePathFromContext(resolvePluginRoutePathContext(pathname))) reason = "requires Gateway authentication";
	else return;
	return `webhookPath ${JSON.stringify(path)} ${reason}. Set webhookPath to ${DEFAULT_FEISHU_WEBHOOK_PATH} and update the Feishu callback URL or reverse-proxy path to match.`;
}
function collectFeishuWebhookNotes({ cfg, env }) {
	const infoNotes = [];
	const warningNotes = [];
	for (const accountId of listFeishuAccountIds(cfg)) {
		const account = mergeFeishuAccountConfig(cfg, accountId);
		if (cfg.channels?.feishu?.enabled === false || account.enabled === false || account.connectionMode !== "webhook") continue;
		const route = account.webhookPath ?? "/feishu/events";
		const legacyListener = resolveFeishuLegacyWebhookListener(account);
		const pathConflict = describeFeishuWebhookPathConflict(route);
		if (pathConflict) {
			warningNotes.push(`Feishu account "${accountId}" ${pathConflict} ${legacyListener ? "The legacyWebhook listener keeps the old path working. Move webhookPath and the callback or proxy before removing the legacyWebhook pin." : "Webhook startup is blocked until the path is changed."} Use Gateway port ${(0, gateway_config_runtime_exports.resolveGatewayPort)(cfg, env)}.`);
			continue;
		}
		const upstream = `Gateway port ${(0, gateway_config_runtime_exports.resolveGatewayPort)(cfg, env)}, path ${route}`;
		infoNotes.push(`Feishu account "${accountId}" uses ${upstream}. Point the Feishu callback URL or reverse-proxy upstream there; accounts sharing a path need distinct encrypt keys. ${legacyListener ? `The legacy listener on ${legacyListener.host}:${legacyListener.port} forwards into that same route. After verifying delivery through the Gateway, remove the legacyWebhook pin; use legacyWebhook:false to override an inherited endpoint.` : "No legacy listener is configured; callbacks use the Gateway route."}`);
	}
	return {
		infoNotes,
		warningNotes
	};
}
//#endregion
//#region extensions/feishu/src/doctor.ts
const FEISHU_STATE_DIR = "feishu";
const BACKUP_PREFIX = "feishu-state-repair";
const BLANK_USER_MESSAGE_REPAIR_THRESHOLD = 3;
const SESSION_FILE_INSPECTION_MAX_BYTES = 16777216;
function timestampForPath(now = /* @__PURE__ */ new Date()) {
	return now.toISOString().replaceAll(":", "-");
}
function toFeishuSessionEntry(value) {
	if (!isRecord(value)) return {};
	return {
		sessionId: value.sessionId,
		sessionFile: value.sessionFile
	};
}
function countLabel(count, singular, plural = `${singular}s`) {
	return `${count} ${count === 1 ? singular : plural}`;
}
function existsDir(dir) {
	return safeStatSync(dir)?.isDirectory() ?? false;
}
function existsFile(filePath) {
	return safeStatSync(filePath)?.isFile() ?? false;
}
function resolveFeishuAgentSessionsDir(agentId) {
	return path.join(resolveStateDir(), "agents", normalizeAgentId(agentId), "sessions");
}
function safeReadDir(dir) {
	try {
		return fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return [];
	}
}
function formatDisplayPath(filePath) {
	const home = os.homedir();
	const resolved = path.resolve(filePath);
	return resolved === home || resolved.startsWith(`${home}${path.sep}`) ? `~${resolved.slice(home.length)}` : resolved;
}
function formatFinding(finding) {
	switch (finding.kind) {
		case "corrupt-state-json": return `- Feishu local JSON state is corrupt: ${formatDisplayPath(finding.path)}`;
		case "missing-session-transcript": return `- Feishu session ${finding.sessionKey} points to a missing transcript in ${formatDisplayPath(finding.storePath)}`;
		case "invalid-session-transcript": return `- Feishu session ${finding.sessionKey} has an invalid transcript (${finding.reason}): ${formatDisplayPath(finding.path)}`;
		case "blank-user-message-run": return `- Feishu session ${finding.sessionKey} contains ${finding.count} blank user messages: ${formatDisplayPath(finding.path)}`;
	}
	return finding;
}
function isFeishuSessionStoreKey(key) {
	const normalized = key.trim().toLowerCase();
	return /^agent:[^:]+:feishu(?::|$)/.test(normalized) || /^feishu(?::|$)/.test(normalized);
}
function isFeishuAcpBindingSessionKey(key) {
	return /^agent:[^:]+:acp:binding:feishu(?::|$)/.test(key.trim().toLowerCase());
}
function isFeishuSessionEntry(key, value) {
	if (isFeishuAcpBindingSessionKey(key)) return false;
	if (isFeishuSessionStoreKey(key)) return true;
	if (!isRecord(value)) return false;
	if (normalizeLowercaseStringOrEmpty(value.channel) === "feishu" || normalizeLowercaseStringOrEmpty(value.lastChannel) === "feishu") return true;
	const route = isRecord(value.route) ? value.route : null;
	if (normalizeLowercaseStringOrEmpty(route?.channel) === "feishu") return true;
	const deliveryContext = isRecord(value.deliveryContext) ? value.deliveryContext : null;
	if (normalizeLowercaseStringOrEmpty(deliveryContext?.channel) === "feishu") return true;
	const pendingDeliveryContext = isRecord(value.pendingFinalDeliveryContext) ? value.pendingFinalDeliveryContext : null;
	if (normalizeLowercaseStringOrEmpty(pendingDeliveryContext?.channel) === "feishu") return true;
	const origin = isRecord(value.origin) ? value.origin : null;
	const originProvider = normalizeLowercaseStringOrEmpty(origin?.provider);
	const originSurface = normalizeLowercaseStringOrEmpty(origin?.surface);
	const originFrom = normalizeLowercaseStringOrEmpty(origin?.from);
	return originProvider === "feishu" || originSurface.startsWith("feishu") || originFrom.startsWith("feishu:");
}
function collectFeishuSessionTargets(params) {
	const byStorePath = /* @__PURE__ */ new Map();
	const addTarget = (target) => {
		const resolvedStorePath = path.resolve(target.storePath);
		byStorePath.set(`${normalizeAgentId(target.agentId)}\0${resolvedStorePath}`, {
			...target,
			agentId: normalizeAgentId(target.agentId),
			storePath: resolvedStorePath
		});
	};
	for (const agentId of collectFeishuDoctorAgentIds(params.cfg)) addTarget({
		agentId,
		storePath: resolveStorePath(params.cfg.session?.store, {
			agentId,
			env: params.env
		})
	});
	const agentsDir = path.join(params.stateDir, "agents");
	for (const agentDir of safeReadDir(agentsDir)) {
		if (!agentDir.isDirectory()) continue;
		const agentId = normalizeAgentId(agentDir.name);
		const storePath = path.join(agentsDir, agentDir.name, "sessions", "sessions.json");
		if (existsFile(storePath)) addTarget({
			agentId,
			storePath
		});
	}
	return [...byStorePath.values()].toSorted((left, right) => left.storePath.localeCompare(right.storePath));
}
function collectJsonFiles(rootDir, limit = 200) {
	const files = [];
	const visit = (dir) => {
		if (files.length >= limit) return;
		for (const entry of safeReadDir(dir).toSorted((left, right) => left.name.localeCompare(right.name))) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				visit(fullPath);
				continue;
			}
			if (entry.isFile() && entry.name.endsWith(".json")) files.push(fullPath);
			if (files.length >= limit) return;
		}
	};
	if (existsDir(rootDir)) visit(rootDir);
	return files;
}
function collectCorruptFeishuStateJsonFindings(feishuStateDir) {
	const findings = [];
	for (const filePath of collectJsonFiles(feishuStateDir)) try {
		JSON.parse(fs.readFileSync(filePath, "utf-8"));
	} catch {
		findings.push({
			kind: "corrupt-state-json",
			path: filePath
		});
	}
	return findings;
}
function resolveSessionTranscriptCandidates(params) {
	const candidate = params.entry.sessionFile;
	if (typeof candidate !== "string" || !candidate.trim()) return [];
	const sessionsDir = path.dirname(params.storePath);
	const agentSessionsDir = resolveFeishuAgentSessionsDir(params.agentId);
	const trimmed = candidate.trim();
	const resolved = path.isAbsolute(trimmed) ? path.resolve(trimmed) : path.resolve(sessionsDir, trimmed);
	return resolved !== sessionsDir && resolved !== agentSessionsDir && (isPathStrictlyInside(sessionsDir, resolved) || isPathStrictlyInside(agentSessionsDir, resolved)) ? [resolved] : [];
}
function isSessionHeader(value) {
	return isRecord(value) && value.type === "session" && typeof value.id === "string";
}
function isBlankUserMessage(value) {
	if (!isUserMessage(value)) return false;
	const content = value.message.content;
	if (typeof content === "string") return content.trim().length === 0;
	return Array.isArray(content) && content.length === 0;
}
function isUserMessage(value) {
	return isRecord(value) && value.type === "message" && isRecord(value.message) && value.message.role === "user";
}
function inspectTranscriptEntries(params) {
	let blankUserMessageRun = 0;
	let maxBlankUserMessageRun = 0;
	for (const entry of params.entries) if (isBlankUserMessage(entry)) {
		blankUserMessageRun += 1;
		maxBlankUserMessageRun = Math.max(maxBlankUserMessageRun, blankUserMessageRun);
	} else if (isUserMessage(entry)) blankUserMessageRun = 0;
	if (params.entries.length === 0 && params.allowMissingSessionHeader) return null;
	const firstEntry = params.entries[0];
	const invalidReason = params.entries.length === 0 ? "empty transcript" : !isSessionHeader(firstEntry) && (!params.allowMissingSessionHeader || !isUserMessage(firstEntry)) ? "invalid session header" : (params.malformedLines ?? 0) > 0 ? `${params.malformedLines} malformed JSONL line(s)` : void 0;
	if (invalidReason) return {
		kind: "invalid-session-transcript",
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		path: params.transcriptPath,
		reason: invalidReason
	};
	if (maxBlankUserMessageRun >= BLANK_USER_MESSAGE_REPAIR_THRESHOLD) return {
		kind: "blank-user-message-run",
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		path: params.transcriptPath,
		count: maxBlankUserMessageRun
	};
	return null;
}
function inspectSessionTranscript(params) {
	const stat = safeStatSync(params.transcriptPath);
	if (!stat) return null;
	if (!stat.isFile()) return {
		kind: "invalid-session-transcript",
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		path: params.transcriptPath,
		reason: "not a file"
	};
	if (stat.size > SESSION_FILE_INSPECTION_MAX_BYTES) return null;
	let raw;
	try {
		raw = fs.readFileSync(params.transcriptPath, "utf-8");
	} catch {
		return {
			kind: "invalid-session-transcript",
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			path: params.transcriptPath,
			reason: "unreadable"
		};
	}
	const entries = [];
	let malformedLines = 0;
	for (const line of raw.split(/\r?\n/)) {
		if (!line.trim()) continue;
		try {
			const entry = JSON.parse(line);
			entries.push(entry);
		} catch {
			malformedLines += 1;
		}
	}
	return inspectTranscriptEntries({
		...params,
		entries,
		malformedLines
	});
}
function inspectCanonicalSessionTranscript(params) {
	let entries;
	try {
		entries = loadTranscriptEventsSync({
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
	} catch {
		return {
			kind: "invalid-session-transcript",
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			path: params.storePath,
			reason: "unreadable"
		};
	}
	return inspectTranscriptEntries({
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		transcriptPath: params.storePath,
		allowMissingSessionHeader: true,
		entries
	});
}
function collectFeishuSessionFindings(params) {
	const sessionId = typeof params.entry.sessionId === "string" ? params.entry.sessionId.trim() : "";
	if (sessionId) {
		const finding = inspectCanonicalSessionTranscript({
			agentId: params.agentId,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
		return finding ? [finding] : [];
	}
	const transcriptCandidates = resolveSessionTranscriptCandidates(params);
	const existing = transcriptCandidates.filter(existsFile);
	if (transcriptCandidates.length > 0 && existing.length === 0) return [{
		kind: "missing-session-transcript",
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}];
	const findings = [];
	for (const transcriptPath of existing) {
		const finding = inspectSessionTranscript({
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			transcriptPath
		});
		if (finding) findings.push(finding);
	}
	return findings;
}
function hasCorruptFeishuStateJsonFinding(inspection) {
	return inspection.findings.some((finding) => finding.kind === "corrupt-state-json");
}
function sessionEntryId(storePath, key) {
	return `${path.resolve(storePath)}\0${key}`;
}
function collectRepairSessionEntries(inspection) {
	const entriesById = new Map(inspection.sessionEntries.map((entry) => [sessionEntryId(entry.storePath, entry.key), entry]));
	const repairEntries = [];
	for (const finding of inspection.findings) {
		if (finding.kind === "corrupt-state-json") continue;
		const id = sessionEntryId(finding.storePath, finding.sessionKey);
		const entry = entriesById.get(id);
		if (entry) {
			repairEntries.push(entry);
			entriesById.delete(id);
		}
	}
	return repairEntries.toSorted((left, right) => left.storePath.localeCompare(right.storePath) || left.key.localeCompare(right.key));
}
function inspectFeishuDoctorState(params) {
	const env = params.env ?? process.env;
	const stateDir = resolveStateDir(env, os.homedir);
	const feishuStateDir = path.join(stateDir, FEISHU_STATE_DIR);
	const findings = collectCorruptFeishuStateJsonFindings(feishuStateDir);
	const sessionEntries = [];
	for (const target of collectFeishuSessionTargets({
		cfg: params.cfg,
		env,
		stateDir
	})) for (const { sessionKey: key, entry } of listSessionEntries({
		agentId: target.agentId,
		storePath: target.storePath
	}).filter(({ sessionKey, entry: sessionEntry }) => !isValidAgentHarnessSessionStoreEntry(sessionKey, sessionEntry) && isFeishuSessionEntry(sessionKey, sessionEntry)).toSorted((left, right) => left.sessionKey.localeCompare(right.sessionKey))) {
		const sessionEntry = toFeishuSessionEntry(entry);
		sessionEntries.push({
			key,
			storePath: target.storePath,
			agentId: target.agentId,
			entry: sessionEntry
		});
		findings.push(...collectFeishuSessionFindings({
			sessionKey: key,
			storePath: target.storePath,
			agentId: target.agentId,
			entry: sessionEntry
		}));
	}
	return {
		stateDir,
		feishuStateDir,
		findings,
		sessionEntries
	};
}
function ensureBackupDir(stateDir, now) {
	const backupDir = path.join(stateDir, "backups", `${BACKUP_PREFIX}-${timestampForPath(now)}`);
	fs.mkdirSync(backupDir, {
		recursive: true,
		mode: 448
	});
	return backupDir;
}
function resolveUniquePath(candidate) {
	if (!fs.existsSync(candidate)) return candidate;
	for (let index = 1; index < 1e3; index += 1) {
		const next = `${candidate}.${index}`;
		if (!fs.existsSync(next)) return next;
	}
	throw new Error(`Unable to resolve unique path for ${candidate}`);
}
function movePathToBackup(params) {
	if (!fs.existsSync(params.sourcePath)) return false;
	const targetPath = resolveUniquePath(path.join(params.backupDir, params.relativeTarget));
	fs.mkdirSync(path.dirname(targetPath), {
		recursive: true,
		mode: 448
	});
	fs.renameSync(params.sourcePath, targetPath);
	return true;
}
function copyStoreBackup(params) {
	const targetDir = path.join(params.backupDir, "session-stores", params.agentId);
	for (const sourcePath of resolveSessionStoreBackupPaths({
		agentId: params.agentId,
		storePath: params.storePath
	})) {
		if (!existsFile(sourcePath)) continue;
		const targetPath = path.join(targetDir, path.basename(sourcePath));
		fs.mkdirSync(path.dirname(targetPath), {
			recursive: true,
			mode: 448
		});
		fs.copyFileSync(sourcePath, resolveUniquePath(targetPath));
	}
}
function collectSessionArtifactPaths(params) {
	const artifacts = /* @__PURE__ */ new Set();
	for (const transcriptPath of resolveSessionTranscriptCandidates(params)) {
		artifacts.add(transcriptPath);
		if (transcriptPath.endsWith(".jsonl")) {
			const base = transcriptPath.slice(0, -6);
			artifacts.add(`${base}.trajectory.jsonl`);
			artifacts.add(`${base}.trajectory-path.json`);
		}
	}
	return [...artifacts].toSorted();
}
function archiveSessionArtifacts(params) {
	const seen = /* @__PURE__ */ new Set();
	let archived = 0;
	for (const entry of params.entries) for (const artifactPath of collectSessionArtifactPaths({
		storePath: params.storePath,
		agentId: entry.agentId,
		entry: entry.entry
	})) {
		if (seen.has(artifactPath) || !existsFile(artifactPath)) continue;
		seen.add(artifactPath);
		const archivedPath = resolveUniquePath(`${artifactPath}.deleted.${params.archiveTimestamp}`);
		fs.renameSync(artifactPath, archivedPath);
		archived += 1;
	}
	return archived;
}
async function repairFeishuDoctorState(params) {
	const env = params.env ?? process.env;
	const now = params.now ?? /* @__PURE__ */ new Date();
	const inspection = params.inspection ?? inspectFeishuDoctorState({
		cfg: params.cfg,
		env
	});
	const backupDir = ensureBackupDir(inspection.stateDir, now);
	const archiveTimestamp = timestampForPath(now);
	const warnings = [];
	const stateDirRepairAttempted = hasCorruptFeishuStateJsonFinding(inspection);
	let rebuiltStateDir = false;
	if (stateDirRepairAttempted) try {
		rebuiltStateDir = movePathToBackup({
			sourcePath: inspection.feishuStateDir,
			backupDir,
			relativeTarget: FEISHU_STATE_DIR
		});
		fs.mkdirSync(inspection.feishuStateDir, {
			recursive: true,
			mode: 448
		});
	} catch (error) {
		warnings.push(`- Failed to rebuild Feishu local state: ${String(error)}`);
	}
	const entriesByStore = /* @__PURE__ */ new Map();
	for (const entry of collectRepairSessionEntries(inspection)) {
		const entries = entriesByStore.get(entry.storePath) ?? [];
		entries.push(entry);
		entriesByStore.set(entry.storePath, entries);
	}
	let removedSessionEntries = 0;
	let touchedSessionStores = 0;
	let archivedSessionArtifacts = 0;
	for (const [storePath, entries] of [...entriesByStore.entries()].toSorted(([left], [right]) => left.localeCompare(right))) {
		const agentId = entries[0].agentId;
		try {
			copyStoreBackup({
				storePath,
				backupDir,
				agentId
			});
			const removedEntries = [];
			for (const entry of entries) {
				const { key } = entry;
				const currentEntry = listSessionEntries({
					agentId,
					storePath
				}).find((candidate) => candidate.sessionKey === key)?.entry;
				if (!currentEntry || isValidAgentHarnessSessionStoreEntry(key, currentEntry)) continue;
				if (!await deleteSessionEntry({
					agentId,
					archiveTranscript: true,
					sessionKey: key,
					storePath
				})) continue;
				removedEntries.push(entry);
			}
			const removed = removedEntries.length;
			removedSessionEntries += removed;
			if (removed > 0) {
				touchedSessionStores += 1;
				archivedSessionArtifacts += archiveSessionArtifacts({
					storePath,
					entries: removedEntries.map((entry) => ({
						agentId,
						entry: entry.entry
					})),
					archiveTimestamp
				});
			}
		} catch (error) {
			warnings.push(`- Failed to archive Feishu sessions in ${formatDisplayPath(storePath)}: ${String(error)}`);
		}
	}
	return {
		backupDir,
		stateDirRepairAttempted,
		rebuiltStateDir,
		removedSessionEntries,
		touchedSessionStores,
		archivedSessionArtifacts,
		warnings
	};
}
function formatPreviewWarning(inspection) {
	const previewFindings = inspection.findings.slice(0, 5).map(formatFinding);
	const remaining = inspection.findings.length - previewFindings.length;
	const repairActions = [];
	if (hasCorruptFeishuStateJsonFinding(inspection)) repairActions.push(`archive ${formatDisplayPath(inspection.feishuStateDir)}`);
	const repairSessionEntries = collectRepairSessionEntries(inspection);
	if (repairSessionEntries.length > 0) repairActions.push(`archive artifacts and remove ${countLabel(repairSessionEntries.length, "flagged Feishu-scoped session entry", "flagged Feishu-scoped session entries")}`);
	const repairSummary = repairActions.length > 0 ? repairActions.join(" and ") : "apply targeted Feishu state cleanup";
	return [
		"- Feishu local channel state may need repair.",
		...previewFindings,
		...remaining > 0 ? [`- ...and ${remaining} more Feishu state finding(s).`] : [],
		`- Repair will ${repairSummary}, while preserving Feishu App ID/secret config and healthy session entries.`,
		"- Run \"openclaw doctor --fix\" to rebuild Feishu local state."
	].join("\n");
}
function formatRepairChange(report) {
	const stateRepairStatus = report.stateDirRepairAttempted ? report.rebuiltStateDir ? "yes" : "no existing state" : "not needed";
	return [
		"Feishu local state repaired.",
		`- Backup dir: ${formatDisplayPath(report.backupDir)}`,
		`- Rebuilt Feishu runtime state: ${stateRepairStatus}`,
		`- Removed ${countLabel(report.removedSessionEntries, "Feishu-scoped session entry", "Feishu-scoped session entries")} from ${countLabel(report.touchedSessionStores, "session store")}.`,
		`- Archived ${countLabel(report.archivedSessionArtifacts, "session artifact file")}.`,
		"- Preserved Feishu App ID/secret config."
	].join("\n");
}
async function runFeishuDoctorSequence(params) {
	const notes = collectFeishuWebhookNotes(params);
	const inspection = params.cfg.channels?.feishu ? inspectFeishuDoctorState(params) : void 0;
	if (!inspection || inspection.findings.length === 0) return {
		changeNotes: [],
		...notes
	};
	if (!params.shouldRepair) return {
		changeNotes: [],
		...notes,
		warningNotes: [...notes.warningNotes, formatPreviewWarning(inspection)]
	};
	const report = await repairFeishuDoctorState({
		cfg: params.cfg,
		env: params.env,
		inspection
	});
	return {
		changeNotes: [formatRepairChange(report)],
		...notes,
		warningNotes: [...notes.warningNotes, ...report.warnings]
	};
}
const feishuDoctor = {
	legacyConfigRules,
	normalizeCompatibilityConfig,
	runConfigSequence: runFeishuDoctorSequence
};
//#endregion
//#region extensions/feishu/src/gateway.ts
const feishuGatewayAdapter = { startAccount: async (ctx) => {
	const { monitorFeishuProvider } = await import("./monitor-DgINjfrS.mjs");
	const account = resolveFeishuRuntimeAccount({
		cfg: ctx.cfg,
		accountId: ctx.accountId
	}, { requireEventSecrets: true });
	const port = account.config?.connectionMode === "webhook" ? (0, gateway_config_runtime_exports.resolveGatewayPort)(ctx.cfg) : null;
	ctx.setStatus({
		accountId: ctx.accountId,
		port
	});
	ctx.log?.info(`starting feishu[${ctx.accountId}] (mode: ${account.config?.connectionMode ?? "websocket"})`);
	const statusSink = createAccountStatusSink({
		accountId: ctx.accountId,
		setStatus: ctx.setStatus
	});
	return monitorFeishuProvider({
		config: ctx.cfg,
		runtime: ctx.runtime,
		channelRuntime: ctx.channelRuntime,
		abortSignal: ctx.abortSignal,
		accountId: ctx.accountId,
		statusSink
	});
} };
//#endregion
//#region extensions/feishu/src/comment-send.ts
async function sendCommentThreadReply(params) {
	const target = parseFeishuCommentTarget(params.to);
	if (!target) return null;
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const client = createFeishuClient(account);
	const replyId = params.replyId?.trim();
	try {
		const result = await deliverCommentThreadText(client, {
			file_token: target.fileToken,
			file_type: target.fileType,
			comment_id: target.commentId,
			content: params.text
		});
		return {
			messageId: (result.delivery_mode === "reply_comment" ? result.reply_id : result.comment_id) ?? "",
			chatId: target.commentId,
			result
		};
	} finally {
		if (replyId) cleanupAmbientCommentTypingReaction({
			client,
			deliveryContext: {
				channel: "feishu",
				to: params.to,
				threadId: replyId
			}
		});
	}
}
//#endregion
//#region extensions/feishu/src/outbound.ts
const FEISHU_PROPAGATE_MEDIA_UPLOAD_FAILURE_MARKER = "__openclawPropagateMediaUploadFailure";
const FEISHU_TEXT_CHUNK_LIMIT = 4e3;
function normalizePossibleLocalImagePath(text) {
	const raw = text?.trim();
	if (!raw) return null;
	if (/\s/.test(raw)) return null;
	if (/^(https?:\/\/|data:|file:\/\/)/i.test(raw)) return null;
	const ext = normalizeLowercaseStringOrEmpty(path.extname(raw));
	if (![
		".jpg",
		".jpeg",
		".png",
		".gif",
		".webp",
		".bmp",
		".ico",
		".heic",
		".tif",
		".tiff"
	].includes(ext)) return null;
	if (!path.isAbsolute(raw)) return null;
	try {
		if (statRegularFileSync(raw).missing) return null;
	} catch {
		return null;
	}
	return raw;
}
function toFeishuOutboundResult(result) {
	const { chatId, ...delivery } = result;
	return {
		...delivery,
		target: {
			kind: "chat",
			id: chatId
		}
	};
}
async function reportFeishuOutboundDelivery(result, onDeliveryResult) {
	await onDeliveryResult?.(attachChannelToResult("feishu", toFeishuOutboundResult(result)));
	return result;
}
function aggregateFeishuSendResult(result, results) {
	return {
		...result,
		receipt: {
			...createMessageReceiptFromOutboundResults({ results }),
			primaryPlatformMessageId: result.messageId
		}
	};
}
function partialFeishuSendError(error, results) {
	if (results.length === 0 && error instanceof Error) return error;
	const accepted = isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
	return createFeishuPartialReplyDeliveryError(error, {
		...accepted,
		...createFeishuReplyDeliveryResult({
			results: [...results, accepted],
			visibleReplySent: results.length > 0 || accepted !== void 0
		})
	});
}
function readFeishuPropagateMediaUploadFailure(payload) {
	return (isRecord(payload.channelData?.feishu) ? payload.channelData.feishu : void 0)?.[FEISHU_PROPAGATE_MEDIA_UPLOAD_FAILURE_MARKER] === true;
}
function resolveFeishuReplyMode(params) {
	const replyToMessageId = params.replyToId?.trim();
	if (replyToMessageId) return {
		normalizedReplyToId: replyToMessageId,
		replyToMessageId,
		replyInThread: false
	};
	const threadId = params.threadId == null ? void 0 : String(params.threadId).trim();
	return threadId ? {
		normalizedReplyToId: void 0,
		replyToMessageId: threadId,
		replyInThread: true
	} : {
		normalizedReplyToId: void 0,
		replyToMessageId: void 0,
		replyInThread: false
	};
}
function createFeishuReplyFanout(ctx) {
	return createReplyToFanout({
		replyToId: resolveFeishuReplyMode(ctx).normalizedReplyToId,
		replyToIdSource: ctx.replyToIdSource,
		replyToMode: ctx.replyToMode
	});
}
async function sendOutboundText(params) {
	const { cfg, to, text, accountId, replyToMessageId, replyInThread, onDeliveryResult } = params;
	const commentResult = await sendCommentThreadReply({
		cfg,
		to,
		text,
		replyId: replyToMessageId,
		accountId
	});
	if (commentResult) return await reportFeishuOutboundDelivery(commentResult, onDeliveryResult);
	const renderMode = resolveFeishuAccount({
		cfg,
		accountId
	}).config?.renderMode ?? "auto";
	const useCard = (renderMode === "card" || renderMode === "auto" && shouldUseFeishuCard(text)) && withinCardTableLimit(text);
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "feishu"
	});
	const normalizedText = useCard ? text : materializeFeishuPostMarkdownSoftBreaks(convertMarkdownTables(text, tableMode));
	const chunkOptions = {
		text: normalizedText,
		limit: resolveTextChunkLimit(cfg, "feishu", accountId, { fallbackLimit: FEISHU_TEXT_CHUNK_LIMIT }),
		mode: resolveChunkMode(cfg, "feishu", accountId)
	};
	const subChunks = useCard ? chunkFeishuCardMarkdown({
		...chunkOptions,
		header: params.header
	}) : chunkFeishuPostMarkdown(chunkOptions);
	const results = [];
	const preserveThread = replyInThread === true;
	const nextReplyToMessageId = createReplyToFanout({
		replyToId: replyToMessageId,
		replyToIdSource: params.replyToIdSource,
		replyToMode: params.replyToMode ?? "first"
	});
	for (const [i, chunk] of (subChunks.length ? subChunks : [normalizedText]).entries()) try {
		const sendParams = {
			cfg,
			to,
			text: chunk,
			accountId,
			replyToMessageId: preserveThread ? replyToMessageId : nextReplyToMessageId(),
			replyInThread: preserveThread ? true : i === 0 ? replyInThread : void 0
		};
		const result = useCard ? await sendStructuredCardFeishu({
			...sendParams,
			header: params.header
		}) : await sendMessageFeishu({
			...sendParams,
			preparedPostText: true
		});
		results.push(result);
		await reportFeishuOutboundDelivery(result, onDeliveryResult);
	} catch (error) {
		throw partialFeishuSendError(error, results);
	}
	return aggregateFeishuSendResult(results.at(-1), results);
}
async function sendFeishuFallbackPayload(params) {
	const propagateMediaUploadFailure = readFeishuPropagateMediaUploadFailure(params.payload);
	const ctx = {
		...params.ctx,
		payload: params.payload
	};
	const mediaUrls = normalizeStringEntries(resolvePayloadMediaUrls(params.payload));
	const text = params.payload.text ?? "";
	const textChunks = text ? chunkFeishuMarkdown(text, FEISHU_TEXT_CHUNK_LIMIT) : [];
	if (!(mediaUrls.length > 0 && (propagateMediaUploadFailure || params.separateMediaAndText === true || textChunks.length > 1))) return await sendTextMediaPayload({
		channel: "feishu",
		ctx,
		adapter: feishuOutbound
	});
	const nextReplyToId = createFeishuReplyFanout(ctx);
	const sendMedia = feishuOutbound.sendMedia;
	const sendText = feishuOutbound.sendText;
	if (!sendMedia || !sendText) throw new Error("Feishu fallback delivery is not available.");
	let lastResult;
	for (const mediaUrl of mediaUrls) lastResult = await sendMedia({
		...ctx,
		text: "",
		mediaUrl,
		replyToId: nextReplyToId(),
		audioAsVoice: params.payload.audioAsVoice ?? ctx.audioAsVoice,
		...propagateMediaUploadFailure ? { propagateMediaUploadFailure: true } : {}
	});
	for (const chunk of textChunks) lastResult = await sendText({
		...ctx,
		text: chunk,
		replyToId: nextReplyToId()
	});
	return lastResult;
}
async function sendFeishuTtsSupplementPayload(params) {
	const sendMedia = feishuOutbound.sendMedia;
	const sendText = feishuOutbound.sendText;
	if (!sendMedia || !sendText) throw new Error("Feishu TTS supplement delivery is not available.");
	const nextReplyToId = createFeishuReplyFanout(params.ctx);
	const ctx = {
		...params.ctx,
		payload: params.payload
	};
	let lastResult;
	if (params.sendVisiblePayload) {
		lastResult = await params.sendVisiblePayload(nextReplyToId());
		await ctx.onDeliveryResult?.(lastResult);
	} else if (params.hasVisiblePresentationFallback || params.supplement.visibleTextAlreadyDelivered !== true) {
		const text = params.payload.text?.trim() ? params.payload.text : params.supplement.spokenText;
		for (const chunk of chunkFeishuMarkdown(text, FEISHU_TEXT_CHUNK_LIMIT)) lastResult = await sendText({
			...ctx,
			text: chunk,
			replyToId: nextReplyToId()
		});
	}
	for (const mediaUrl of normalizeStringEntries(resolvePayloadMediaUrls(params.payload))) lastResult = await sendMedia({
		...ctx,
		text: "",
		mediaUrl,
		replyToId: nextReplyToId(),
		audioAsVoice: params.payload.audioAsVoice ?? ctx.audioAsVoice
	});
	return lastResult ?? {
		channel: "feishu",
		messageId: ""
	};
}
function withFeishuOutboundSendContext(adapter) {
	const { sendText, sendMedia, sendPayload } = adapter;
	return {
		...adapter,
		...sendText ? { sendText: async (ctx) => withFeishuSendContext(ctx, () => sendText(ctx)) } : {},
		...sendMedia ? { sendMedia: async (ctx) => withFeishuSendContext(ctx, () => sendMedia(ctx)) } : {},
		...sendPayload ? { sendPayload: async (ctx) => withFeishuSendContext(ctx, () => sendPayload(ctx)) } : {}
	};
}
const feishuOutbound = withFeishuOutboundSendContext({
	deliveryMode: "direct",
	chunker: chunkFeishuMarkdown,
	chunkerMode: "markdown",
	textChunkLimit: FEISHU_TEXT_CHUNK_LIMIT,
	presentationCapabilities: FEISHU_PRESENTATION_CAPABILITIES,
	renderPresentation: renderFeishuPresentationPayload,
	sendPayload: async (ctx) => {
		const { payload, presentationFallback } = consumeFeishuPresentationFallbackMarker(ctx.payload);
		const ttsSupplement = getReplyPayloadTtsSupplement(payload);
		if (parseFeishuCommentTarget(ctx.to)) {
			const { presentation } = resolveFeishuRichReply(payload);
			const textCard = readNativeFeishuCardJson(payload.text);
			const fallbackSourceText = textCard ? void 0 : payload.text;
			const { commentText: text, fallbackText } = buildFeishuPresentationFallback({
				text: fallbackSourceText,
				presentation,
				fallbackHasCommand: isRecord(payload.channelData?.feishu) && payload.channelData.feishu.fallbackHasCommand === true
			});
			const hasFallbackMedia = normalizeStringEntries(resolvePayloadMediaUrls(payload)).length > 0;
			if (!fallbackText.trim() && !hasFallbackMedia && (textCard || readNativeFeishuCard(payload))) throw new Error("Feishu native cards cannot be sent to document comments without a text or media fallback.");
			return await sendFeishuFallbackPayload({
				ctx,
				payload: {
					...payload,
					text,
					interactive: void 0,
					presentation: void 0,
					channelData: void 0
				},
				separateMediaAndText: true
			});
		}
		const card = buildFeishuPayloadCard({
			payload,
			text: ctx.text,
			identity: ctx.identity
		});
		if (!card) {
			const { presentation } = resolveFeishuRichReply(payload);
			const fallbackPayload = presentation ? {
				...payload,
				text: renderFeishuPresentationFallbackText({
					text: readNativeFeishuCardJson(payload.text) ? void 0 : payload.text,
					presentation
				}, "markdown"),
				presentation: void 0,
				interactive: void 0
			} : payload;
			if (ttsSupplement) return await sendFeishuTtsSupplementPayload({
				ctx,
				payload: fallbackPayload,
				supplement: ttsSupplement,
				hasVisiblePresentationFallback: presentationFallback?.hasVisibleContent ?? Boolean(renderFeishuPresentationFallbackText({ presentation }).trim())
			});
			return await sendFeishuFallbackPayload({
				ctx,
				payload: fallbackPayload,
				separateMediaAndText: presentationFallback !== void 0 || presentation !== void 0
			});
		}
		if (ttsSupplement) return await sendFeishuTtsSupplementPayload({
			ctx,
			payload,
			supplement: ttsSupplement,
			sendVisiblePayload: async (replyToId) => {
				const { replyToMessageId, replyInThread } = resolveFeishuReplyMode({
					replyToId,
					threadId: ctx.threadId
				});
				return attachChannelToResult("feishu", toFeishuOutboundResult(await sendCardFeishu({
					cfg: ctx.cfg,
					to: ctx.to,
					card,
					replyToMessageId,
					replyInThread,
					accountId: ctx.accountId ?? void 0
				})));
			}
		});
		const nextReplyToId = createFeishuReplyFanout(ctx);
		const nextReplyMode = () => resolveFeishuReplyMode({
			replyToId: nextReplyToId(),
			threadId: ctx.threadId
		});
		const mediaUrls = normalizeStringEntries(resolvePayloadMediaUrls(payload));
		return attachChannelToResult("feishu", toFeishuOutboundResult(await sendPayloadMediaSequenceAndFinalize({
			text: payload.text ?? "",
			mediaUrls,
			onResult: async (deliveryResult) => {
				await ctx.onDeliveryResult?.(attachChannelToResult("feishu", toFeishuOutboundResult(deliveryResult)));
			},
			send: async ({ mediaUrl }) => {
				const { replyToMessageId, replyInThread } = nextReplyMode();
				return await sendMediaFeishu({
					cfg: ctx.cfg,
					to: ctx.to,
					mediaUrl,
					accountId: ctx.accountId ?? void 0,
					mediaAccess: ctx.mediaAccess,
					mediaLocalRoots: ctx.mediaLocalRoots,
					mediaReadFile: ctx.mediaReadFile,
					replyToMessageId,
					replyInThread,
					...payload.audioAsVoice === true || ctx.audioAsVoice === true ? { audioAsVoice: true } : {}
				});
			},
			finalize: async () => {
				const { replyToMessageId, replyInThread } = nextReplyMode();
				return await sendCardFeishu({
					cfg: ctx.cfg,
					to: ctx.to,
					card,
					replyToMessageId,
					replyInThread,
					accountId: ctx.accountId ?? void 0
				});
			}
		})));
	},
	...createAttachedChannelResultAdapter({
		channel: "feishu",
		sendText: async (ctx) => {
			const { cfg, to, text, identity, onDeliveryResult } = ctx;
			const { replyToMessageId, replyInThread } = resolveFeishuReplyMode(ctx);
			const sendParams = {
				cfg,
				to,
				accountId: ctx.accountId ?? void 0,
				replyToMessageId,
				replyInThread
			};
			const deliveryOptions = {
				replyToIdSource: ctx.replyToIdSource,
				replyToMode: ctx.replyToMode,
				onDeliveryResult
			};
			const localImagePath = normalizePossibleLocalImagePath(text);
			if (localImagePath) {
				let mediaResult;
				try {
					mediaResult = await sendMediaFeishu({
						...sendParams,
						mediaUrl: localImagePath,
						mediaAccess: ctx.mediaAccess,
						mediaLocalRoots: ctx.mediaLocalRoots,
						mediaReadFile: ctx.mediaReadFile
					});
				} catch (err) {
					if (isChannelPartialDeliveryError(err)) throw err;
					console.error(`[feishu] local image path auto-send failed:`, err);
					return toFeishuOutboundResult(await sendOutboundText({
						...sendParams,
						text: await buildFeishuMediaFallbackText({}),
						...deliveryOptions
					}));
				}
				return toFeishuOutboundResult(await reportFeishuOutboundDelivery(mediaResult, onDeliveryResult));
			}
			if (parseFeishuCommentTarget(to)) return toFeishuOutboundResult(await sendOutboundText({
				...sendParams,
				text,
				...deliveryOptions
			}));
			const card = readNativeFeishuCardJson(text);
			if (card) {
				assertFeishuCardWithinEnvelope(card, "Feishu native card");
				return toFeishuOutboundResult(await reportFeishuOutboundDelivery(await sendCardFeishu({
					...sendParams,
					card: markRenderedFeishuCard(card)
				}), onDeliveryResult));
			}
			const title = identity ? resolveFeishuIdentityHeaderTitle(identity) : void 0;
			return toFeishuOutboundResult(await sendOutboundText({
				...sendParams,
				text,
				header: title ? {
					title,
					template: "blue"
				} : void 0,
				...deliveryOptions
			}));
		},
		sendMedia: async (ctx) => {
			const { cfg, to, text, mediaUrl, audioAsVoice, onDeliveryResult, threadId, mediaAccess, mediaLocalRoots, mediaReadFile, propagateMediaUploadFailure } = ctx;
			const sendParams = {
				cfg,
				to,
				accountId: ctx.accountId ?? void 0
			};
			const nextReplyToId = createFeishuReplyFanout(ctx);
			const nextReplyMode = () => {
				const { replyToMessageId, replyInThread } = resolveFeishuReplyMode({
					replyToId: nextReplyToId(),
					threadId
				});
				return {
					replyToMessageId,
					replyInThread
				};
			};
			const deliveryOptions = {
				replyToIdSource: ctx.replyToIdSource,
				replyToMode: ctx.replyToMode,
				onDeliveryResult
			};
			if (parseFeishuCommentTarget(to)) {
				const commentText = mediaUrl?.trim() ? await buildFeishuMediaFallbackText({
					text,
					mediaUrl,
					mediaLinkStyle: "plain"
				}) : text?.trim() ?? "";
				return toFeishuOutboundResult(await sendOutboundText({
					...sendParams,
					text: commentText,
					...nextReplyMode(),
					...deliveryOptions
				}));
			}
			if (!mediaUrl) return toFeishuOutboundResult(await sendOutboundText({
				...sendParams,
				text: text ?? "",
				...nextReplyMode(),
				...deliveryOptions
			}));
			const suppressTextForVoiceMedia = shouldSuppressFeishuTextForVoiceMedia({
				mediaUrl,
				audioAsVoice
			});
			let captionResult;
			if (text?.trim() && !suppressTextForVoiceMedia) captionResult = await sendOutboundText({
				...sendParams,
				text,
				...nextReplyMode(),
				...deliveryOptions
			});
			const results = captionResult ? [captionResult] : [];
			let mediaResult;
			const mediaReplyMode = nextReplyMode();
			try {
				mediaResult = await sendMediaFeishu({
					...sendParams,
					mediaUrl,
					mediaAccess,
					mediaLocalRoots,
					mediaReadFile,
					...mediaReplyMode,
					...audioAsVoice === true ? { audioAsVoice: true } : {}
				});
			} catch (err) {
				if (isChannelPartialDeliveryError(err)) throw partialFeishuSendError(err, results);
				if (propagateMediaUploadFailure) {
					if (captionResult) throw partialFeishuSendError(err, results);
					throw new Error(`Feishu send could not deliver the requested media attachment: ${err instanceof Error ? err.message : String(err)}`, { cause: err });
				}
				console.error(`[feishu] sendMediaFeishu failed:`, err);
				const fallbackText = await buildFeishuMediaFallbackText({
					text: captionResult ? void 0 : text,
					mediaUrl
				});
				try {
					const fallbackResult = await sendOutboundText({
						...sendParams,
						text: fallbackText,
						...captionResult ? nextReplyMode() : mediaReplyMode,
						...deliveryOptions
					});
					return toFeishuOutboundResult(aggregateFeishuSendResult(fallbackResult, [...results, fallbackResult]));
				} catch (error) {
					throw partialFeishuSendError(error, results);
				}
			}
			results.push(mediaResult);
			try {
				await reportFeishuOutboundDelivery(mediaResult, onDeliveryResult);
				if (mediaResult.voiceIntentDegradedToFile && text?.trim()) results.push(await sendOutboundText({
					...sendParams,
					text,
					...nextReplyMode(),
					...deliveryOptions
				}));
			} catch (error) {
				throw partialFeishuSendError(error, results);
			}
			return toFeishuOutboundResult(aggregateFeishuSendResult(mediaResult, results));
		}
	})
});
//#endregion
//#region extensions/feishu/src/session-route.ts
function resolveFeishuOutboundSessionRoute(params) {
	const rawTarget = stripChannelTargetPrefix(params.target, "feishu", "lark");
	const target = normalizeFeishuTarget(rawTarget);
	if (!target) return null;
	const isGroup = resolveReceiveIdType(rawTarget) === "chat_id";
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const groupSessionScope = isGroup ? resolveConfiguredFeishuGroupSessionScope({
		groupConfig: resolveFeishuGroupConfig({
			cfg: account.config,
			groupId: target
		}),
		feishuCfg: account.config
	}) : void 0;
	const recipientSessionExact = isGroup ? target.startsWith("oc_") && groupSessionScope === "group" : target.startsWith("ou_");
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "feishu",
		accountId: params.accountId,
		recipientSessionExact,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: target
		},
		chatType: isGroup ? "group" : "direct",
		from: isGroup ? `feishu:group:${target}` : `feishu:${target}`,
		to: target
	});
}
//#endregion
//#region extensions/feishu/src/setup-core.ts
function setFeishuNamedAccountEnabled(cfg, accountId, enabled) {
	const feishuCfg = cfg.channels?.feishu;
	return patchTopLevelChannelConfigSection({
		cfg,
		channel: "feishu",
		patch: { accounts: {
			...feishuCfg?.accounts,
			[accountId]: {
				...feishuCfg?.accounts?.[accountId],
				enabled
			}
		} }
	});
}
const feishuSetupAdapter = {
	resolveAccountId: ({ cfg, accountId }) => accountId?.trim() || resolveDefaultFeishuAccountId(cfg),
	applyAccountConfig: ({ cfg, accountId }) => {
		if (!accountId || accountId === DEFAULT_ACCOUNT_ID$1) return setSetupChannelEnabled(cfg, "feishu", true);
		return setFeishuNamedAccountEnabled(cfg, accountId, true);
	}
};
const feishuSetupContract = defineChannelSetupContract({
	fields: {},
	legacyAdapter: feishuSetupAdapter
});
//#endregion
//#region extensions/feishu/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "feishu";
const SCAN_TO_CREATE_TP = "ob_cli_app";
const FEISHU_SETUP_FLOW_KEY = "_flow";
function isFeishuConfigured(cfg) {
	const feishuCfg = cfg.channels?.feishu;
	const isAppIdConfigured = (value) => {
		if (normalizeOptionalString(value)) return true;
		if (!value || typeof value !== "object") return false;
		const rec = value;
		const source = normalizeOptionalString(rec.source)?.toLowerCase();
		const id = normalizeOptionalString(rec.id);
		if (source === "env" && id) return Boolean(normalizeOptionalString(process.env[id]));
		return hasConfiguredSecretInput(value);
	};
	const isConfigured = (account) => isAppIdConfigured(account?.appId) && hasConfiguredSecretInput(account?.appSecret);
	return isConfigured(feishuCfg) || Object.values(feishuCfg?.accounts ?? {}).some((account) => account && typeof account === "object" && isConfigured({
		...feishuCfg,
		...account
	}));
}
function patchFeishuConfig(cfg, accountId, patch) {
	return patchScopedAccountConfig({
		cfg,
		channelKey: channel,
		accountId,
		patch: {
			enabled: true,
			...patch
		}
	});
}
function resolveFeishuSetupAccount(cfg, requestedAccountId) {
	const accountId = requestedAccountId ?? resolveDefaultFeishuAccountId(cfg);
	const feishuCfg = cfg.channels?.feishu;
	const account = accountId === DEFAULT_ACCOUNT_ID$1 ? void 0 : feishuCfg?.accounts?.[accountId];
	return {
		accountId,
		config: {
			dmPolicy: account?.dmPolicy ?? feishuCfg?.dmPolicy,
			allowFrom: account?.allowFrom ?? feishuCfg?.allowFrom
		}
	};
}
async function promptFeishuAllowFrom(params) {
	const account = resolveFeishuSetupAccount(params.cfg, params.accountId);
	const existingAllowFrom = account.config.allowFrom ?? [];
	await params.prompter.note([
		t("wizard.feishu.allowlistIntro"),
		t("wizard.feishu.allowlistFindUser"),
		t("wizard.feishu.examples"),
		"- ou_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"- on_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
	].join("\n"), t("wizard.feishu.allowlistTitle"));
	const entry = await params.prompter.text({
		message: t("wizard.feishu.allowFromPrompt"),
		placeholder: "ou_xxxxx, ou_yyyyy",
		initialValue: existingAllowFrom.length > 0 ? existingAllowFrom.map(String).join(", ") : void 0
	});
	const mergedAllowFrom = mergeAllowFromEntries(existingAllowFrom, splitSetupEntries(entry));
	return patchFeishuConfig(params.cfg, account.accountId, { allowFrom: mergedAllowFrom });
}
async function noteFeishuCredentialHelp(prompter) {
	await prompter.note([
		t("wizard.feishu.credentialsStepOpenPlatform"),
		t("wizard.feishu.credentialsStepCreateApp"),
		t("wizard.feishu.credentialsStepGetCredentials"),
		t("wizard.feishu.credentialsStepPermissions"),
		t("wizard.feishu.credentialsStepPublish"),
		t("wizard.feishu.credentialsEnvTip"),
		t("wizard.channels.docs", { link: formatDocsLink("/channels/feishu", "feishu") })
	].join("\n"), t("wizard.feishu.credentialsTitle"));
}
const feishuDmPolicy = createChannelDmPolicy({
	label: "Feishu",
	channel,
	resolveAccount: resolveFeishuSetupAccount,
	resolveAllowFrom: ({ policy }) => policy === "open" ? ["*"] : void 0,
	applyPatch: ({ cfg, account, patch }) => patchFeishuConfig(cfg, account.accountId, patch),
	promptAllowFrom: promptFeishuAllowFrom
});
const loadAppRegistrationModule = createLazyRuntimeModule(() => import("./app-registration-BB6TubaW.mjs"));
async function runScanToCreate(prompter, domain, beforePersistentEffect) {
	const { beginAppRegistration, initAppRegistration, pollAppRegistration, printQrCode } = await loadAppRegistrationModule();
	try {
		await initAppRegistration(domain);
	} catch {
		await prompter.note(t("wizard.feishu.scanUnavailable"), t("wizard.feishu.setupTitle"));
		return null;
	}
	await beforePersistentEffect?.();
	const begin = await beginAppRegistration(domain);
	await prompter.note(t("wizard.feishu.scanQr"), t("wizard.feishu.scanTitle"));
	await printQrCode(begin.qrUrl);
	const progress = prompter.progress(t("wizard.feishu.fetchingConfig"));
	const outcome = await pollAppRegistration({
		deviceCode: begin.deviceCode,
		interval: begin.interval,
		expireIn: begin.expireIn,
		initialDomain: domain,
		tp: SCAN_TO_CREATE_TP
	});
	let message;
	switch (outcome.status) {
		case "success":
			message = t("wizard.feishu.scanCompleted");
			break;
		case "access_denied":
			message = t("wizard.feishu.scanDenied");
			break;
		case "expired":
			message = t("wizard.feishu.scanExpired");
			break;
		case "timeout":
			message = t("wizard.feishu.scanTimedOut");
			break;
		case "error": message = t("wizard.feishu.scanError", { error: outcome.message });
	}
	progress.stop(message);
	return outcome.status === "success" ? outcome.result : null;
}
async function runNewAppFlow(params) {
	const { prompter, options } = params;
	let next = params.cfg;
	const targetAccountId = resolveDefaultFeishuAccountId(next);
	let appId;
	let appSecret = null;
	let appSecretProbeValue = null;
	let scanOpenId;
	const currentDomain = (next.channels?.feishu)?.domain ?? "feishu";
	const setupMethod = await prompter.select({
		message: t("wizard.feishu.setupMethodPrompt"),
		options: [{
			value: "manual",
			label: t("wizard.feishu.setupMethodManual")
		}, {
			value: "scan",
			label: t("wizard.feishu.setupMethodScan")
		}],
		initialValue: "manual"
	});
	const selectedDomain = await prompter.select({
		message: t("wizard.feishu.domainPrompt"),
		options: [{
			value: "feishu",
			label: t("wizard.feishu.domainFeishu")
		}, {
			value: "lark",
			label: t("wizard.feishu.domainLark")
		}],
		initialValue: currentDomain
	});
	let scanDomain = selectedDomain;
	const scanResult = setupMethod === "scan" ? await runScanToCreate(prompter, selectedDomain, options?.beforePersistentEffect) : null;
	if (scanResult) {
		appId = scanResult.appId;
		appSecret = scanResult.appSecret;
		scanDomain = scanResult.domain;
		scanOpenId = scanResult.openId;
	} else {
		await noteFeishuCredentialHelp(prompter);
		appId = (await prompter.text({
			message: t("wizard.feishu.appIdPrompt"),
			initialValue: normalizeOptionalString(process.env.FEISHU_APP_ID),
			validate: (value) => value?.trim() ? void 0 : t("common.required")
		})).trim();
		const appSecretResult = await promptSingleChannelSecretInput({
			cfg: next,
			prompter,
			providerHint: "feishu",
			credentialLabel: "App Secret",
			secretInputMode: options?.secretInputMode,
			accountConfigured: false,
			canUseEnv: false,
			hasConfigToken: false,
			envPrompt: "",
			keepPrompt: t("wizard.feishu.appSecretKeep"),
			inputPrompt: t("wizard.feishu.appSecretPrompt"),
			preferredEnvVar: "FEISHU_APP_SECRET"
		});
		if (appSecretResult.action === "set") {
			appSecret = appSecretResult.value;
			appSecretProbeValue = appSecretResult.resolvedValue;
		}
		if (appId && appSecretProbeValue) {
			const { getAppOwnerOpenId } = await loadAppRegistrationModule();
			scanOpenId = await getAppOwnerOpenId({
				appId,
				appSecret: appSecretProbeValue,
				domain: selectedDomain
			});
		}
	}
	const groupPolicy = await prompter.select({
		message: t("wizard.feishu.groupPolicyPrompt"),
		options: [
			{
				value: "allowlist",
				label: t("wizard.feishu.groupPolicyAllowlist")
			},
			{
				value: "open",
				label: t("wizard.feishu.groupPolicyOpen")
			},
			{
				value: "disabled",
				label: t("wizard.feishu.groupPolicyDisabled")
			}
		],
		initialValue: "allowlist"
	});
	const configProgress = prompter.progress(t("wizard.feishu.configuring"));
	await new Promise((resolve) => {
		setTimeout(resolve, 50);
	});
	next = patchFeishuConfig(next, targetAccountId, {
		...appId && appSecret ? {
			appId,
			appSecret,
			connectionMode: "websocket"
		} : {},
		...scanDomain ? { domain: scanDomain } : {},
		...scanOpenId ? {
			dmPolicy: "allowlist",
			allowFrom: [scanOpenId]
		} : {},
		groupPolicy,
		...groupPolicy === "open" ? { requireMention: true } : {}
	});
	configProgress.stop(t("wizard.feishu.botConfigured"));
	return { cfg: next };
}
async function runEditFlow(params) {
	const { cfg, prompter, options } = params;
	const feishuCfg = cfg.channels?.feishu;
	const resolveAppIdLabel = (value) => {
		const asString = normalizeOptionalString(value);
		if (asString) return asString;
		if (value && typeof value === "object") {
			const rec = value;
			if (normalizeOptionalString(rec.source) && normalizeOptionalString(rec.id)) return normalizeOptionalString(process.env[rec.id]) ?? `env:${String(rec.id)}`;
			if (hasConfiguredSecretInput(value)) return "(configured)";
		}
	};
	const existingAppId = resolveAppIdLabel(feishuCfg?.appId) ?? Object.values(feishuCfg?.accounts ?? {}).reduce((found, account) => {
		if (found) return found;
		if (account && typeof account === "object") return resolveAppIdLabel(account.appId);
	}, void 0);
	if (!existingAppId || !await prompter.confirm({
		message: t("wizard.feishu.existingBotPrompt", { appId: existingAppId }),
		initialValue: true
	})) return runNewAppFlow({
		cfg,
		prompter,
		options
	});
	await prompter.note(t("wizard.feishu.botConfigured"), "");
	return { cfg };
}
async function runFeishuLogin(params) {
	const { cfg, prompter } = params;
	return (await (isFeishuConfigured(cfg) ? runEditFlow : runNewAppFlow)({
		cfg,
		prompter,
		options: {}
	})).cfg;
}
const feishuSetupWizard = {
	channel,
	resolveAccountIdForConfigure: ({ accountOverride, defaultAccountId, cfg }) => (typeof accountOverride === "string" && accountOverride.trim() ? accountOverride.trim() : void 0) ?? resolveDefaultFeishuAccountId(cfg) ?? defaultAccountId,
	resolveShouldPromptAccountIds: () => false,
	status: {
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsAppCredentials"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusNeedsAppCreds"),
		configuredScore: 2,
		unconfiguredScore: 0,
		resolveConfigured: ({ cfg }) => isFeishuConfigured(cfg),
		resolveStatusLines: async ({ cfg, accountId, configured }) => {
			const account = resolveFeishuAccount({
				cfg,
				accountId
			});
			let probeResult = null;
			if (configured && account.configured) try {
				const { probeFeishu } = await import("./probe-BjSykXB8.mjs").then((n) => n.n);
				probeResult = await probeFeishu(account);
			} catch {}
			if (!configured) return [`Feishu: ${t("wizard.channels.statusNeedsAppCredentials")}`];
			if (probeResult?.ok) return [`Feishu: ${t("wizard.channels.statusConnectedAs", { name: probeResult.botName ?? probeResult.botOpenId ?? "bot" })}`];
			return [`Feishu: ${t("wizard.channels.statusConfiguredConnectionNotVerified")}`];
		}
	},
	prepare: async ({ cfg, credentialValues }) => ({ credentialValues: {
		...credentialValues,
		[FEISHU_SETUP_FLOW_KEY]: isFeishuConfigured(cfg) ? "edit" : "new"
	} }),
	credentials: [],
	finalize: async ({ cfg, prompter, options, credentialValues }) => {
		return ((credentialValues[FEISHU_SETUP_FLOW_KEY] ?? "new") === "edit" ? runEditFlow : runNewAppFlow)({
			cfg,
			prompter,
			options
		});
	},
	dmPolicy: feishuDmPolicy,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
//#region extensions/feishu/src/sticker-catalog.ts
const STICKER_QUERY_PATTERN = /^[^\p{Cs}]{1,128}$/u;
function fitsStickerSearchResult(stickers) {
	return Buffer.byteLength(JSON.stringify({
		stickers,
		truncated: false
	}), "utf8") <= 3072;
}
function resolveFeishuStickerSet(cfg, account) {
	const sets = (cfg.channels?.feishu)?.stickerSets;
	const set = sets && account.appId && Object.hasOwn(sets, account.appId) ? sets[account.appId] : void 0;
	return set ? Object.entries(set) : [];
}
function searchFeishuStickerSet(entries, params) {
	const query = readStringParam(params, "query", { required: true });
	if (!STICKER_QUERY_PATTERN.test(query)) throw new Error("Feishu sticker-search query must contain 1–128 Unicode characters.");
	const limit = params.limit === void 0 ? 5 : params.limit;
	if (typeof limit !== "number" || !Number.isInteger(limit) || limit < 1 || limit > 10) throw new Error("Feishu sticker-search limit must be an integer from 1 through 10.");
	const needle = query.toLowerCase();
	const stickers = [];
	for (const [fileId, keywords] of entries) {
		const keyword = keywords.find((label) => label.toLowerCase().includes(needle));
		if (keyword === void 0) continue;
		const match = {
			fileId,
			keyword
		};
		if (stickers.length === limit || !fitsStickerSearchResult([...stickers, match])) return {
			stickers,
			truncated: true
		};
		stickers.push(match);
	}
	return {
		stickers,
		truncated: false
	};
}
//#endregion
//#region extensions/feishu/src/channel.ts
function resolveFeishuSendAttachmentMedia(params) {
	const sourceKeys = [
		"media",
		"mediaUrl",
		"path",
		"filePath",
		"fileUrl",
		"image"
	];
	const candidates = [];
	let unsupportedPayload = false;
	let unsupportedFile = false;
	let malformed = false;
	const read = (record, key) => {
		if (Object.hasOwn(record, key)) return record[key];
		const snakeKey = key.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
		return snakeKey !== key && Object.hasOwn(record, snakeKey) ? record[snakeKey] : void 0;
	};
	const inspect = (record, nested = false) => {
		const keys = nested ? [
			...sourceKeys.slice(0, -1),
			"url",
			"image"
		] : sourceKeys;
		for (const key of keys) {
			const value = read(record, key);
			if (value === void 0) continue;
			if (typeof value !== "string") {
				malformed = true;
				continue;
			}
			const normalized = normalizeOptionalString(value);
			if (normalized) candidates.push(normalized);
		}
		const multiple = read(record, "mediaUrls");
		if (multiple !== void 0) for (const value of Array.isArray(multiple) ? multiple : [multiple]) {
			if (typeof value !== "string") {
				malformed = true;
				continue;
			}
			const normalized = normalizeOptionalString(value);
			if (normalized) candidates.push(normalized);
		}
		for (const key of ["buffer", "base64"]) {
			const value = read(record, key);
			unsupportedPayload ||= value !== void 0 && (typeof value !== "string" || Boolean(normalizeOptionalString(value)));
		}
		const file = read(record, "file");
		unsupportedFile ||= file !== void 0 && (typeof file !== "string" || Boolean(normalizeOptionalString(file)));
	};
	inspect(params);
	const attachments = params.attachments;
	if (attachments !== void 0 && !Array.isArray(attachments)) malformed = true;
	else if (Array.isArray(attachments)) for (const attachment of attachments) if (!isRecord(attachment)) malformed = true;
	else inspect(attachment, true);
	if (unsupportedPayload) throw new Error("Feishu send supports media attachments through media, mediaUrl, path, filePath, fileUrl, image, mediaUrls, or attachments[] with one of those fields; buffer/base64 payloads are not supported.");
	if (malformed) throw new Error("Feishu send supports media attachments through media, mediaUrl, path, filePath, fileUrl, image, mediaUrls, or attachments[] with one of those fields; a present malformed media source value is not supported — use a string path/URL (or a string array for mediaUrls) instead.");
	if (unsupportedFile) throw new Error("Feishu send supports media attachments through media, mediaUrl, path, filePath, fileUrl, image, mediaUrls, or attachments[] with one of those fields; the `file` attachment-intent parameter is not supported — use one of the supported media sources instead.");
	const urls = [...new Set(candidates)];
	if (urls.length > 1) throw new Error("Feishu send supports a single media attachment.");
	return urls[0];
}
function readBooleanParam(params, keys) {
	for (const key of keys) {
		const value = params[key];
		if (typeof value === "boolean") return value;
	}
}
function hasLegacyFeishuCardCommandValue(actionValue) {
	return isRecord(actionValue) && actionValue.oc !== "ocf1" && (Boolean(typeof actionValue.command === "string" && actionValue.command.trim()) || Boolean(typeof actionValue.text === "string" && actionValue.text.trim()));
}
function containsLegacyFeishuCardCommandValue(node) {
	if (Array.isArray(node)) return node.some((item) => containsLegacyFeishuCardCommandValue(item));
	if (!isRecord(node)) return false;
	if (node.tag === "button" && hasLegacyFeishuCardCommandValue(node.value)) return true;
	if (node.tag === "button" && Array.isArray(node.behaviors) && node.behaviors.some((behavior) => isRecord(behavior) && hasLegacyFeishuCardCommandValue(behavior.value))) return true;
	return Object.values(node).some((value) => containsLegacyFeishuCardCommandValue(value));
}
const meta = {
	id: "feishu",
	label: "Feishu",
	selectionLabel: "Feishu/Lark (飞书)",
	docsPath: "/channels/feishu",
	docsLabel: "feishu",
	blurb: "飞书/Lark enterprise messaging.",
	aliases: ["lark"],
	order: 70,
	preferSessionLookupForAnnounceTarget: true
};
const loadFeishuChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-C2OKAiq-.mjs"), "feishuChannelRuntime");
async function resolveFeishuMessageSender(params) {
	try {
		const sender = params.resolve(await loadFeishuChannelRuntime());
		if (sender) return sender;
		throw new Error(params.unavailableMessage);
	} catch (error) {
		if (error instanceof PlatformMessageNotDispatchedError) throw error;
		throw new PlatformMessageNotDispatchedError(params.unavailableMessage, { cause: error });
	}
}
const resolveFeishuTextSender = () => resolveFeishuMessageSender({
	resolve: (runtime) => runtime.feishuOutbound.sendText,
	unavailableMessage: "Feishu text sending is not available."
});
const resolveFeishuMediaSender = () => resolveFeishuMessageSender({
	resolve: (runtime) => runtime.feishuOutbound.sendMedia,
	unavailableMessage: "Feishu media sending is not available."
});
const feishuMessageAdapter = defineChannelMessageAdapter({
	id: "feishu",
	durableFinal: { capabilities: {
		text: true,
		media: true
	} },
	send: {
		lifecycle: { beforeSendAttempt: async (ctx) => {
			if (ctx.kind === "text") await resolveFeishuTextSender();
			else if (ctx.kind === "media") await resolveFeishuMediaSender();
		} },
		text: async (ctx) => {
			const sendText = await resolveFeishuTextSender();
			const { onDeliveryResult, ...outboundCtx } = ctx;
			const result = await sendText({
				...outboundCtx,
				...onDeliveryResult ? { onDeliveryResult: async (progress) => {
					await onDeliveryResult(toFeishuMessageSendResult(progress, "text"));
				} } : {}
			});
			return toFeishuMessageSendResult(result, "text");
		},
		media: async (ctx) => {
			const sendMedia = await resolveFeishuMediaSender();
			const { onDeliveryResult, ...outboundCtx } = ctx;
			const result = await sendMedia({
				...outboundCtx,
				...onDeliveryResult ? { onDeliveryResult: async (progress) => {
					await onDeliveryResult(toFeishuMessageSendResult(progress, "media"));
				} } : {}
			});
			return toFeishuMessageSendResult(result, "media");
		}
	}
});
async function createFeishuActionClient(account) {
	const { createFeishuClient } = await import("./client-CcxmEkoy.mjs").then((n) => n.t);
	return createFeishuClient(account);
}
async function resolveFeishuChatTypeById(params) {
	const client = await createFeishuActionClient(params.account);
	const chat = await params.runtime.getChatInfo(client, params.chatId);
	return resolveFeishuChatType(chat);
}
async function resolveFeishuMessageChatType(params) {
	const knownChatType = normalizeFeishuChatType(params.message.chatType);
	if (knownChatType) return knownChatType;
	return resolveFeishuChatTypeById({
		account: params.account,
		chatId: params.message.chatId,
		runtime: params.runtime
	});
}
const collectFeishuSecurityWarnings = createAllowlistProviderGroupPolicyWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.feishu !== void 0,
	resolveGroupPolicy: ({ cfg, accountId }) => resolveFeishuAccount({
		cfg,
		accountId
	}).config?.groupPolicy,
	collect: ({ cfg, accountId, groupPolicy }) => {
		if (groupPolicy !== "open") return [];
		return [`- Feishu[${resolveFeishuAccount({
			cfg,
			accountId
		}).accountId}] groups: groupPolicy="open" allows any member to trigger (mention-gated). Set channels.feishu.groupPolicy="allowlist" + channels.feishu.groupAllowFrom to restrict senders.`];
	}
});
const collectFeishuOpenGroupFindings = createConditionalWarningCollector.findings({
	collectWarnings: collectFeishuSecurityWarnings,
	checkId: "channels.feishu.groups.open",
	severity: "warn",
	title: "Feishu security warning"
});
function describeFeishuMessageTool({ cfg, accountId }) {
	const enabledAccounts = accountId ? [resolveFeishuAccount({
		cfg,
		accountId
	})].filter((account) => account.enabled && account.configured) : listEnabledFeishuAccounts(cfg);
	const enabled = enabledAccounts.length > 0 || !accountId && cfg.channels?.feishu?.enabled !== false && Boolean(inspectFeishuCredentials(cfg.channels?.feishu, cfg));
	if (enabledAccounts.length === 0) return {
		actions: [],
		capabilities: enabled ? ["presentation"] : []
	};
	const actions = /* @__PURE__ */ new Set([
		"send",
		"read",
		"edit",
		"thread-reply",
		"pin",
		"list-pins",
		"unpin",
		"member-info",
		"channel-info",
		"channel-list"
	]);
	if (enabledAccounts.some((account) => isFeishuActionEnabled(account, "reactions"))) {
		actions.add("react");
		actions.add("reactions");
	}
	if (enabledAccounts.some((account) => isFeishuActionEnabled(account, "sticker"))) actions.add("sticker");
	const selectedAccount = resolveFeishuAccount({
		cfg,
		accountId
	});
	if (isFeishuActionEnabled(selectedAccount, "sticker") && resolveFeishuStickerSet(cfg, selectedAccount).length > 0) actions.add("sticker-search");
	return {
		actions: Array.from(actions),
		capabilities: enabled ? ["presentation"] : []
	};
}
const feishuConfigAdapter = createHybridChannelConfigAdapter({
	sectionKey: "feishu",
	listAccountIds: listFeishuAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveFeishuAccount),
	defaultAccountId: resolveDefaultFeishuAccountId,
	clearBaseFields: [],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({ allowFrom })
});
function isFeishuActionEnabled(account, action) {
	if (!account.enabled || !account.configured) return false;
	return createActionGate(account.config.actions)(action, action === "reactions");
}
function isFeishuGroupTopicSessionKey(sessionKey) {
	if (typeof sessionKey !== "string" || !sessionKey) return false;
	const parsed = parseFeishuConversationId({ conversationId: sessionKey });
	return parsed?.scope === "group_topic" || parsed?.scope === "group_topic_sender";
}
function resolveFeishuTopicAutoThreadAnchor(ctx, accountId) {
	const currentTarget = ctx.toolContext?.currentMessagingTarget ?? ctx.toolContext?.currentChannelId;
	const target = resolveFeishuActionTarget(ctx);
	if (!isFeishuGroupTopicSessionKey(ctx.sessionKey) || ctx.params.topLevel === true || ctx.params.threadId === null || ctx.requesterAccountId && ctx.requesterAccountId !== accountId || ctx.toolContext?.currentChannelProvider && ctx.toolContext.currentChannelProvider !== "feishu" || !currentTarget || !target || normalizeFeishuTarget(currentTarget) !== normalizeFeishuTarget(target)) return;
	const inbound = ctx.toolContext?.currentMessageId;
	return typeof inbound === "string" && inbound.length > 0 ? inbound : void 0;
}
function buildFeishuSendReplyAnchor(ctx, accountId) {
	if (ctx.action === "thread-reply") return {
		replyToMessageId: resolveFeishuMessageId(ctx.params),
		replyInThread: true
	};
	const threadId = readFirstString(ctx.params, ["threadId"]) ?? resolveFeishuTopicAutoThreadAnchor(ctx, accountId);
	return resolveFeishuReplyMode({
		replyToId: ctx.reply ? ctx.reply.source === "implicit" && threadId ? void 0 : ctx.reply.replyToId : readFirstString(ctx.params, ["replyTo", "reply_to"]),
		threadId
	});
}
function isSupportedFeishuDirectConversationId(conversationId) {
	const trimmed = conversationId.trim();
	if (!trimmed || trimmed.includes(":")) return false;
	if (trimmed.startsWith("oc_") || trimmed.startsWith("on_")) return false;
	return true;
}
function normalizeFeishuAcpConversationId(conversationId) {
	const parsed = parseFeishuConversationId({ conversationId });
	if (!parsed || parsed.scope !== "group_topic" && parsed.scope !== "group_topic_sender" && !isSupportedFeishuDirectConversationId(parsed.canonicalConversationId)) return null;
	return {
		conversationId: parsed.canonicalConversationId,
		parentConversationId: parsed.scope === "group_topic" || parsed.scope === "group_topic_sender" ? parsed.chatId : void 0
	};
}
function matchFeishuAcpConversation(params) {
	const binding = normalizeFeishuAcpConversationId(params.bindingConversationId);
	if (!binding) return null;
	const incoming = parseFeishuConversationId({
		conversationId: params.conversationId,
		parentConversationId: params.parentConversationId
	});
	if (!incoming || incoming.scope !== "group_topic" && incoming.scope !== "group_topic_sender" && !isSupportedFeishuDirectConversationId(incoming.canonicalConversationId)) return null;
	const matchesCanonicalConversation = binding.conversationId === incoming.canonicalConversationId;
	const matchesParentTopicForSenderScopedConversation = incoming.scope === "group_topic_sender" && binding.parentConversationId === incoming.chatId && binding.conversationId === `${incoming.chatId}:topic:${incoming.topicId}`;
	if (!matchesCanonicalConversation && !matchesParentTopicForSenderScopedConversation) return null;
	return {
		conversationId: matchesParentTopicForSenderScopedConversation ? binding.conversationId : incoming.canonicalConversationId,
		parentConversationId: incoming.scope === "group_topic" || incoming.scope === "group_topic_sender" ? incoming.chatId : void 0,
		matchPriority: matchesCanonicalConversation ? 2 : 1
	};
}
function resolveFeishuSenderScopedCommandConversation(params) {
	const parentConversationId = params.parentConversationId?.trim();
	const threadId = params.threadId?.trim();
	const senderId = params.senderId?.trim();
	if (!parentConversationId || !threadId || !senderId) return;
	const expectedScopePrefix = `feishu:group:${normalizeLowercaseStringOrEmpty(parentConversationId)}:topic:${normalizeLowercaseStringOrEmpty(threadId)}:sender:`;
	const isSenderScopedSession = [params.sessionKey, params.parentSessionKey].some((candidate) => {
		const normalized = normalizeLowercaseStringOrEmpty(candidate ?? "");
		if (!normalized) return false;
		return normalized.replace(/^agent:[^:]+:/, "").startsWith(expectedScopePrefix);
	});
	const senderScopedConversationId = buildFeishuConversationId({
		chatId: parentConversationId,
		scope: "group_topic_sender",
		topicId: threadId,
		senderOpenId: senderId
	});
	if (isSenderScopedSession) return senderScopedConversationId;
	if (!params.sessionKey?.trim()) return;
	return getSessionBindingService().listBySession(params.sessionKey).find((binding) => {
		if (binding.conversation.channel !== "feishu" || binding.conversation.accountId !== params.accountId) return false;
		return binding.conversation.conversationId === senderScopedConversationId;
	})?.conversation.conversationId;
}
function resolveFeishuCommandConversation(params) {
	if (params.threadId) {
		const parentConversationId = parseFeishuTargetId(params.originatingTo) ?? parseFeishuTargetId(params.commandTo) ?? parseFeishuTargetId(params.fallbackTo);
		if (!parentConversationId) return null;
		return {
			conversationId: resolveFeishuSenderScopedCommandConversation({
				accountId: params.accountId,
				parentConversationId,
				threadId: params.threadId,
				senderId: params.senderId,
				sessionKey: params.sessionKey,
				parentSessionKey: params.parentSessionKey
			}) ?? buildFeishuConversationId({
				chatId: parentConversationId,
				scope: "group_topic",
				topicId: params.threadId
			}),
			parentConversationId
		};
	}
	const conversationId = parseFeishuDirectConversationId(params.originatingTo) ?? parseFeishuDirectConversationId(params.commandTo) ?? parseFeishuDirectConversationId(params.fallbackTo);
	return conversationId ? { conversationId } : null;
}
function jsonActionResult(details) {
	return textResult(JSON.stringify(details), details);
}
function readFirstString(params, keys, fallback) {
	for (const key of keys) {
		const value = normalizeOptionalString(params[key]);
		if (value) return value;
	}
	return normalizeOptionalString(fallback);
}
const UNRESOLVED_RESPONSE_PREFIX_VAR_PATTERN = /\{[a-zA-Z][a-zA-Z0-9.]*\}/;
function resolveFeishuMessageActionResponsePrefix(ctx) {
	const channel = ctx.cfg.channels?.feishu;
	const configured = (ctx.accountId ? channel?.accounts?.[ctx.accountId]?.responsePrefix : void 0) ?? channel?.responsePrefix ?? (channel === void 0 ? ctx.cfg.messages?.responsePrefix : void 0);
	if (!configured) return;
	const identityName = resolveAgentConfig(ctx.cfg, ctx.agentId ?? "main")?.identity?.name?.trim();
	const resolved = configured === "auto" ? identityName ? `[${identityName}]` : void 0 : configured.replace(/\{(?:identity\.name|identityname)\}/gi, identityName ?? "$&");
	return resolved && !UNRESOLVED_RESPONSE_PREFIX_VAR_PATTERN.test(resolved) ? resolved : void 0;
}
function readOptionalPositiveInteger(params, keys) {
	for (const key of keys) {
		const parsed = parseStrictPositiveInteger(params[key]);
		if (parsed !== void 0) return parsed;
	}
}
function resolveFeishuActionTarget(ctx) {
	return readFirstString(ctx.params, ["to", "target"], ctx.toolContext?.currentChannelId);
}
function resolveFeishuChatId(ctx) {
	const raw = readFirstString(ctx.params, [
		"chatId",
		"chat_id",
		"channelId",
		"channel_id",
		"to",
		"target"
	], ctx.toolContext?.currentChannelId);
	if (!raw) return;
	if (/^(user|dm|open_id):/i.test(raw)) return;
	if (/^(chat|group|channel):/i.test(raw)) return normalizeFeishuTarget(raw) ?? void 0;
	return raw;
}
function resolveFeishuMessageId(params) {
	return readFirstString(params, [
		"messageId",
		"message_id",
		"replyTo",
		"reply_to"
	]);
}
function resolveFeishuMessageReadTarget(ctx) {
	const explicitChatId = resolveFeishuChatId({ params: ctx.params });
	const currentChatId = resolveFeishuChatId({
		params: {},
		toolContext: ctx.toolContext
	});
	const chatId = explicitChatId ?? currentChatId;
	if (!chatId) return;
	const normalizedChatId = normalizeFeishuTarget(chatId) ?? chatId.trim();
	if (normalizedChatId !== (currentChatId ? normalizeFeishuTarget(currentChatId) ?? currentChatId.trim() : void 0)) return { chatId: normalizedChatId };
	return {
		chatId: normalizedChatId,
		chatType: ctx.toolContext?.currentChatType === "direct" ? "p2p" : ctx.toolContext?.currentChatType === "group" || ctx.toolContext?.currentChatType === "channel" ? "group" : void 0
	};
}
function assertFeishuMessageMatchesReadTarget(params) {
	if ((normalizeFeishuTarget(params.messageChatId) ?? params.messageChatId.trim()) !== params.authorizedChatId) throw new ToolAuthorizationError("Feishu message target is not allowed.");
}
async function authorizeFeishuMessageReadTarget(params) {
	const authorize = (chatType) => assertFeishuChatReadAllowed({
		cfg: params.ctx.cfg,
		account: params.account,
		chatId: params.target.chatId,
		chatType,
		ctx: params.ctx
	});
	if (params.target.chatType) return authorize(params.target.chatType);
	const preliminary = resolveFeishuChatReadPreliminaryAuthorization({
		cfg: params.ctx.cfg,
		account: params.account,
		chatId: params.target.chatId,
		ctx: params.ctx
	});
	if (preliminary.decision === "allow") return preliminary.chatId;
	if (preliminary.decision === "deny") throw new ToolAuthorizationError("Feishu read target is not allowed.");
	await getAuthorizedFeishuChatInfo({
		ctx: params.ctx,
		account: params.account,
		runtime: params.runtime,
		chatId: params.target.chatId
	});
	return preliminary.chatId;
}
async function getAuthorizedFeishuChatInfo(params) {
	const preliminary = resolveFeishuChatReadPreliminaryAuthorization({
		cfg: params.ctx.cfg,
		account: params.account,
		chatId: params.chatId,
		ctx: params.ctx
	});
	if (preliminary.decision === "deny") throw new ToolAuthorizationError("Feishu read target is not allowed.");
	const client = await createFeishuActionClient(params.account);
	return {
		chat: await readFeishuChatInfoWithAuthorization({
			cfg: params.ctx.cfg,
			account: params.account,
			ctx: params.ctx,
			preliminary
		}, (chatId) => params.runtime.getChatInfo(client, chatId)),
		client
	};
}
async function getAuthorizedFeishuMessage(params) {
	const target = resolveFeishuMessageReadTarget(params.ctx);
	if (!target && params.ctx.conversationReadOrigin !== "direct-operator") throw new ToolAuthorizationError("Feishu message reads require a chat target or current conversation.");
	const authorizedChatId = target ? await authorizeFeishuMessageReadTarget({
		ctx: params.ctx,
		account: params.account,
		runtime: params.runtime,
		target
	}) : void 0;
	const message = await params.runtime.getMessageFeishu({
		cfg: params.ctx.cfg,
		messageId: params.messageId,
		accountId: params.ctx.accountId ?? void 0
	});
	if (!message) return null;
	if (authorizedChatId) assertFeishuMessageMatchesReadTarget({
		authorizedChatId,
		messageChatId: message.chatId
	});
	assertFeishuChatReadAllowed({
		cfg: params.ctx.cfg,
		account: params.account,
		chatId: message.chatId,
		chatType: await resolveFeishuMessageChatType({
			account: params.account,
			message,
			runtime: params.runtime
		}),
		ctx: params.ctx
	});
	return message;
}
async function requireAuthorizedFeishuMessage(params) {
	const message = await getAuthorizedFeishuMessage(params);
	params.ctx.assertDirectAdapterHandoff?.();
	if (!message) throw new Error(`Feishu message not found: ${params.messageId}`);
	return message;
}
function resolveFeishuMemberId(params) {
	return readFirstString(params, [
		"memberId",
		"member_id",
		"userId",
		"user_id",
		"openId",
		"open_id",
		"unionId",
		"union_id"
	]);
}
function resolveRequestedFeishuMemberIdType(params) {
	const raw = readFirstString(params, [
		"memberIdType",
		"member_id_type",
		"userIdType",
		"user_id_type"
	]);
	if (raw === "open_id" || raw === "user_id" || raw === "union_id") return raw;
	if (readFirstString(params, ["userId", "user_id"]) && !readFirstString(params, [
		"openId",
		"open_id",
		"unionId",
		"union_id"
	])) return "user_id";
	if (readFirstString(params, ["unionId", "union_id"]) && !readFirstString(params, ["openId", "open_id"])) return "union_id";
	if (readFirstString(params, ["openId", "open_id"])) return "open_id";
}
const feishuPlugin = createChatChannelPlugin({
	base: {
		id: "feishu",
		meta,
		capabilities: {
			chatTypes: ["direct", "channel"],
			polls: false,
			threads: true,
			media: true,
			tts: { voice: {
				synthesisTarget: "voice-note",
				transcodesAudio: true
			} },
			reactions: true,
			edit: true,
			reply: true
		},
		agentPrompt: { messageToolHints: ({ cfg, accountId }) => {
			const actions = describeFeishuMessageTool({
				cfg,
				accountId: accountId ?? void 0
			}).actions;
			return [
				"- Feishu targeting: omit `target` to reply to the current conversation (auto-inferred). Explicit targets: `user:open_id` or `chat:chat_id`.",
				"- Feishu supports interactive cards plus native image, file, audio, and video/media delivery.",
				"- Feishu supports `send`, `read`, `edit`, `thread-reply`, pins, and channel/member lookup, plus reactions when enabled.",
				...actions?.includes("sticker") ? ["- Feishu stickers: use `action=sticker` with `fileId` (or the first `stickerId`) from a sticker this bot previously received. Sticker upload is not supported."] : [],
				...actions?.includes("sticker-search") ? ["- Feishu `action=sticker-search`: configured keyword lookup only, not store search or learned/visual matching. Supply `query` (1–128 characters) and optional `limit` (1–10, default 5); send a returned `fileId` with `action=sticker` on the same account. If `truncated` is true, narrow the query."] : []
			];
		} },
		groups: { resolveToolPolicy: resolveFeishuGroupToolPolicy },
		conversationBindings: {
			bindingStore: "adapter",
			defaultTopLevelPlacement: "current",
			buildModelOverrideParentCandidates: ({ parentConversationId }) => buildFeishuModelOverrideParentCandidates(parentConversationId)
		},
		mentions: { stripPatterns: () => ["<at user_id=\"[^\"]*\">[^<]*</at>"] },
		reload: {
			configPrefixes: ["channels.feishu"],
			noopPrefixes: ["messages.inbound"]
		},
		doctor: feishuDoctor,
		configSchema: FeishuChannelConfigSchema,
		config: {
			...feishuConfigAdapter,
			deleteAccount: ({ cfg, accountId }) => {
				if (accountId === DEFAULT_ACCOUNT_ID) {
					const next = { ...cfg };
					const nextChannels = { ...cfg.channels };
					delete nextChannels.feishu;
					if (Object.keys(nextChannels).length > 0) next.channels = nextChannels;
					else delete next.channels;
					return next;
				}
				const accounts = { ...(cfg.channels?.feishu)?.accounts };
				delete accounts[accountId];
				return patchTopLevelChannelConfigSection({
					cfg,
					channel: "feishu",
					patch: { accounts: Object.keys(accounts).length > 0 ? accounts : void 0 }
				});
			},
			isConfigured: (account) => account.configured,
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: account.configured,
				extra: {
					appId: account.appId,
					domain: account.domain
				}
			})
		},
		approvalCapability: feishuApprovalAuth,
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		actions: {
			providerOwnedReadGates: true,
			readAuthorityActions: [
				"read",
				"reactions",
				"list-pins",
				"member-info",
				"channel-info",
				"channel-list",
				"sticker-search"
			],
			messageActionTargetAliases,
			describeMessageTool: describeFeishuMessageTool,
			handleAction: async (ctx) => {
				const { assertDirectAdapterHandoff } = ctx;
				const account = resolveFeishuAccount({
					cfg: ctx.cfg,
					accountId: ctx.accountId ?? void 0
				});
				if ((ctx.action === "react" || ctx.action === "reactions") && !isFeishuActionEnabled(account, "reactions")) throw new Error("Feishu reactions are disabled via actions.reactions.");
				if (ctx.action === "sticker" || ctx.action === "sticker-search") {
					if (!isFeishuActionEnabled(account, "sticker")) throw new Error("Feishu stickers are disabled; enable actions.sticker for a configured account.");
					if (ctx.action === "sticker-search") {
						const stickers = resolveFeishuStickerSet(ctx.cfg, account);
						if (stickers.length === 0) throw new Error("Feishu sticker-search requires a nonempty channels.feishu.stickerSets entry for this account's appId.");
						return jsonActionResult(searchFeishuStickerSet(stickers, ctx.params));
					}
					const to = resolveFeishuActionTarget(ctx);
					if (!to) throw new Error("Feishu sticker requires a target (to).");
					const fileKey = normalizeFeishuExternalKey(readFirstString(ctx.params, ["fileId"]) ?? (Array.isArray(ctx.params.stickerId) ? ctx.params.stickerId[0] : void 0));
					if (!fileKey) throw new Error("Feishu sticker requires fileId (or first stickerId): use the file_key of a sticker this bot previously received.");
					const anchor = buildFeishuSendReplyAnchor(ctx, account.accountId);
					return jsonActionResult({
						ok: true,
						channel: "feishu",
						action: "sticker",
						...await (await loadFeishuChannelRuntime()).sendStickerFeishu({
							cfg: ctx.cfg,
							to,
							fileKey,
							accountId: ctx.accountId ?? void 0,
							replyToMessageId: anchor.replyToMessageId,
							replyInThread: anchor.replyInThread
						})
					});
				}
				if (ctx.action === "send" || ctx.action === "thread-reply") {
					const sendContext = {
						assertDirectAdapterHandoff,
						onPlatformSendDispatch: ctx.onPlatformSendDispatch
					};
					const to = resolveFeishuActionTarget(ctx);
					if (!to) throw new Error(`Feishu ${ctx.action} requires a target (to).`);
					const { replyToMessageId, replyInThread } = buildFeishuSendReplyAnchor(ctx, account.accountId);
					if (ctx.action === "thread-reply" && !replyToMessageId) throw new Error("Feishu thread-reply requires messageId.");
					const text = readFirstString(ctx.params, ["text", "message"]);
					const textCard = readNativeFeishuCardJson(text, { responsePrefix: resolveFeishuMessageActionResponsePrefix(ctx) });
					const { interactive, presentation } = resolveFeishuRichReply(ctx.params);
					const mediaUrl = resolveFeishuSendAttachmentMedia(ctx.params);
					const audioAsVoice = readBooleanParam(ctx.params, ["asVoice", "audioAsVoice"]);
					if (textCard && !presentation) assertFeishuCardWithinEnvelope(textCard, "Feishu native card");
					const generatedCard = presentation ? buildFeishuPresentationCard({
						presentation,
						fallbackText: textCard ? void 0 : resolveLegacyInteractiveTextFallback({
							text,
							interactive
						})
					}) : void 0;
					const presentationCard = generatedCard && feishuCardWithinTableLimit(generatedCard) && isFeishuCardWithinEnvelope(generatedCard) ? generatedCard : void 0;
					const presentationFellBack = Boolean(generatedCard && !presentationCard);
					const card = presentation ? presentationCard : textCard;
					if (card && mediaUrl) throw new Error(`Feishu ${ctx.action} does not support card with media.`);
					if (!card && !text && !mediaUrl && !presentationFellBack) throw new Error(`Feishu ${ctx.action} requires text/message, media, or card.`);
					const runtime = await loadFeishuChannelRuntime();
					const maybeSendMedia = runtime.feishuOutbound.sendMedia;
					if (mediaUrl && !maybeSendMedia) throw new Error("Feishu media sending is not available.");
					const sendMedia = maybeSendMedia;
					const outboundContext = {
						...sendContext,
						cfg: ctx.cfg,
						to,
						text: text ?? "",
						accountId: ctx.accountId ?? void 0,
						...ctx.mediaAccess ? { mediaAccess: ctx.mediaAccess } : {},
						mediaLocalRoots: ctx.mediaLocalRoots,
						...ctx.mediaReadFile ? { mediaReadFile: ctx.mediaReadFile } : {},
						...replyInThread ? { threadId: replyToMessageId } : { replyToId: replyToMessageId }
					};
					let result;
					if (presentationFellBack && presentation) {
						const sendPayload = runtime.feishuOutbound.sendPayload;
						if (!sendPayload) throw new Error("Feishu presentation fallback delivery is not available.");
						const fallbackText = textCard ? void 0 : text;
						result = await sendPayload({
							...outboundContext,
							text: fallbackText ?? "",
							payload: {
								text: fallbackText,
								presentation,
								...mediaUrl ? { mediaUrl } : {},
								...audioAsVoice === void 0 ? {} : { audioAsVoice },
								...ctx.action === "send" ? { channelData: { feishu: { [FEISHU_PROPAGATE_MEDIA_UPLOAD_FAILURE_MARKER]: true } } } : {}
							},
							...audioAsVoice === void 0 ? {} : { audioAsVoice }
						});
					} else if (card) {
						if (containsLegacyFeishuCardCommandValue(card)) throw new Error("Feishu card buttons that trigger text or commands must use structured interaction envelopes.");
						result = await withFeishuSendContext(sendContext, () => runtime.sendCardFeishu({
							cfg: ctx.cfg,
							to,
							card,
							accountId: ctx.accountId ?? void 0,
							replyToMessageId,
							replyInThread
						}));
					} else if (mediaUrl) result = await sendMedia({
						...outboundContext,
						mediaUrl,
						...audioAsVoice === true ? { audioAsVoice: true } : {},
						...ctx.action === "send" ? { propagateMediaUploadFailure: true } : {}
					});
					else {
						const { target, ...delivery } = await (await resolveFeishuTextSender())(outboundContext);
						result = {
							...delivery,
							chatId: target?.id
						};
					}
					return jsonActionResult({
						ok: true,
						channel: "feishu",
						action: ctx.action,
						...result
					});
				}
				if (ctx.action === "read") {
					const messageId = resolveFeishuMessageId(ctx.params);
					if (!messageId) throw new Error("Feishu read requires messageId.");
					const message = await getAuthorizedFeishuMessage({
						ctx,
						account,
						runtime: await loadFeishuChannelRuntime(),
						messageId
					});
					if (!message) return {
						isError: true,
						...jsonActionResult({ error: `Feishu read failed or message not found: ${messageId}` })
					};
					return jsonActionResult({
						ok: true,
						channel: "feishu",
						action: "read",
						message
					});
				}
				if (ctx.action === "edit" || ctx.action === "pin" || ctx.action === "unpin") return withFeishuRequestContext(assertDirectAdapterHandoff, async () => {
					const messageId = resolveFeishuMessageId(ctx.params);
					if (!messageId) throw new Error(`Feishu ${ctx.action} requires messageId.`);
					const text = ctx.action === "edit" ? readFirstString(ctx.params, ["text", "message"]) : void 0;
					const card = ctx.action === "edit" && ctx.params.card && typeof ctx.params.card === "object" ? ctx.params.card : void 0;
					const runtime = await loadFeishuChannelRuntime();
					await requireAuthorizedFeishuMessage({
						ctx,
						account,
						runtime,
						messageId
					});
					const messageParams = {
						cfg: ctx.cfg,
						messageId,
						accountId: ctx.accountId ?? void 0
					};
					let result;
					if (ctx.action === "edit") result = await runtime.editMessageFeishu({
						...messageParams,
						text,
						card
					});
					else if (ctx.action === "pin") result = { pin: await runtime.createPinFeishu(messageParams) };
					else {
						await runtime.removePinFeishu(messageParams);
						result = { messageId };
					}
					return jsonActionResult({
						ok: true,
						channel: "feishu",
						action: ctx.action,
						...result
					});
				});
				if (ctx.action === "list-pins") {
					const chatId = resolveFeishuChatId(ctx);
					if (!chatId) throw new Error("Feishu list-pins requires chatId or channelId.");
					const runtime = await loadFeishuChannelRuntime();
					await getAuthorizedFeishuChatInfo({
						ctx,
						account,
						runtime,
						chatId
					});
					return jsonActionResult({
						ok: true,
						channel: "feishu",
						action: "list-pins",
						...await runtime.listPinsFeishu({
							cfg: ctx.cfg,
							chatId,
							startTime: readFirstString(ctx.params, ["startTime", "start_time"]),
							endTime: readFirstString(ctx.params, ["endTime", "end_time"]),
							pageSize: readOptionalPositiveInteger(ctx.params, ["pageSize", "page_size"]),
							pageToken: readFirstString(ctx.params, ["pageToken", "page_token"]),
							accountId: ctx.accountId ?? void 0
						})
					});
				}
				if (ctx.action === "channel-info" || ctx.action === "member-info") {
					let runtime = ctx.action === "member-info" ? await loadFeishuChannelRuntime() : void 0;
					const memberId = ctx.action === "member-info" ? resolveFeishuMemberId(ctx.params) : void 0;
					const chatId = resolveFeishuChatId(ctx);
					if (!chatId) throw new Error(ctx.action === "channel-info" ? "Feishu channel-info requires chatId or channelId." : memberId ? "Feishu member-info requires chatId or channelId when memberId is provided." : "Feishu member-info requires memberId or chatId/channelId.");
					runtime ??= await loadFeishuChannelRuntime();
					const { chat, client } = await getAuthorizedFeishuChatInfo({
						ctx,
						account,
						runtime,
						chatId
					});
					const channelResult = {
						ok: true,
						provider: "feishu",
						action: "channel-info",
						channel: chat
					};
					if (ctx.action === "channel-info" && ctx.params.includeMembers !== true && ctx.params.members !== true) return jsonActionResult(channelResult);
					const requestedMemberIdType = resolveRequestedFeishuMemberIdType(ctx.params);
					const memberIdType = requestedMemberIdType ?? "open_id";
					const authorization = authorizeFeishuChatMemberRead({
						cfg: ctx.cfg,
						account,
						chatId,
						chatType: resolveFeishuChatType(chat),
						ctx,
						...memberId ? { memberId } : {},
						memberIdType: requestedMemberIdType
					});
					if (memberId) {
						if (authorization.kind === "group") await runtime.assertFeishuChatMember(client, chatId, memberId, memberIdType);
						return jsonActionResult({
							ok: true,
							channel: "feishu",
							action: "member-info",
							member: await runtime.getFeishuMemberInfo(client, authorization.kind === "direct" ? authorization.memberId : memberId, authorization.kind === "direct" ? authorization.memberIdType : memberIdType)
						});
					}
					const members = authorization.kind === "direct" ? runtime.buildFeishuDirectChatMembers(authorization) : await runtime.getChatMembers(client, chatId, readOptionalPositiveInteger(ctx.params, ["pageSize", "page_size"]), readFirstString(ctx.params, ["pageToken", "page_token"]), memberIdType);
					return jsonActionResult(ctx.action === "channel-info" ? {
						...channelResult,
						members
					} : {
						ok: true,
						channel: "feishu",
						action: "member-info",
						...members
					});
				}
				if (ctx.action === "channel-list") {
					const runtime = await loadFeishuChannelRuntime();
					const query = readFirstString(ctx.params, ["query"]);
					const limit = readOptionalPositiveInteger(ctx.params, ["limit"]);
					const scope = readFirstString(ctx.params, ["scope", "kind"]) ?? "all";
					const directOperator = ctx.conversationReadOrigin === "direct-operator";
					const listGroups = directOperator || canEnumerateAllFeishuGroups(ctx.cfg, account) ? runtime.listFeishuDirectoryGroupsLive : listAuthorizedFeishuDirectoryGroups;
					const listPeers = directOperator || canEnumerateAllFeishuPeers(account) ? runtime.listFeishuDirectoryPeersLive : listAuthorizedFeishuDirectoryPeers;
					const directoryParams = {
						cfg: ctx.cfg,
						query,
						limit,
						accountId: ctx.accountId ?? void 0,
						fallbackToStatic: false
					};
					const groupDirectoryParams = {
						...directoryParams,
						filter: directOperator ? (group) => isFeishuGroupReadEnabled(ctx.cfg, account, group.id) : canEnumerateAllFeishuGroups(ctx.cfg, account) ? (group) => isFeishuGroupReadAllowed(ctx.cfg, account, group.id, false) : void 0
					};
					const groupsOnly = [
						"groups",
						"group",
						"channels",
						"channel"
					].includes(scope);
					const peersOnly = [
						"peers",
						"peer",
						"members",
						"member",
						"users",
						"user"
					].includes(scope);
					const [groups, peers] = await Promise.all([peersOnly ? void 0 : listGroups(groupDirectoryParams), groupsOnly ? void 0 : listPeers(directoryParams)]);
					return jsonActionResult({
						ok: true,
						channel: "feishu",
						action: "channel-list",
						...peersOnly ? {} : { groups },
						...groupsOnly ? {} : { peers }
					});
				}
				if (ctx.action === "react") return withFeishuRequestContext(assertDirectAdapterHandoff, async () => {
					const messageId = resolveFeishuMessageId(ctx.params);
					if (!messageId) throw new Error("Feishu reaction requires messageId.");
					const emoji = typeof ctx.params.emoji === "string" ? ctx.params.emoji.trim() : "";
					const remove = ctx.params.remove === true;
					const clearAll = ctx.params.clearAll === true;
					if (!emoji) {
						if (remove) throw new Error("Emoji is required to remove a Feishu reaction.");
						if (!clearAll) throw new Error("Emoji is required to add a Feishu reaction. Set clearAll=true to remove all bot reactions.");
					}
					const runtime = await loadFeishuChannelRuntime();
					await requireAuthorizedFeishuMessage({
						ctx,
						account,
						runtime,
						messageId
					});
					if (remove || !emoji) {
						const ownReactions = (await runtime.listReactionsFeishu({
							cfg: ctx.cfg,
							messageId,
							...remove ? { emojiType: emoji } : {},
							accountId: ctx.accountId ?? void 0
						})).filter((entry) => entry.operatorType === "app" && Boolean(account.appId) && entry.operatorId === account.appId);
						const selected = remove ? ownReactions.slice(0, 1) : ownReactions;
						for (const reaction of selected) await runtime.removeReactionFeishu({
							cfg: ctx.cfg,
							messageId,
							reactionId: reaction.reactionId,
							accountId: ctx.accountId ?? void 0
						});
						return jsonActionResult({
							ok: true,
							removed: remove ? selected.length > 0 ? emoji : null : selected.length
						});
					}
					await runtime.addReactionFeishu({
						cfg: ctx.cfg,
						messageId,
						emojiType: emoji,
						accountId: ctx.accountId ?? void 0
					});
					return jsonActionResult({
						ok: true,
						added: emoji
					});
				});
				if (ctx.action === "reactions") {
					const messageId = resolveFeishuMessageId(ctx.params);
					if (!messageId) throw new Error("Feishu reactions lookup requires messageId.");
					const runtime = await loadFeishuChannelRuntime();
					await requireAuthorizedFeishuMessage({
						ctx,
						account,
						runtime,
						messageId
					});
					return jsonActionResult({
						ok: true,
						reactions: await runtime.listReactionsFeishu({
							cfg: ctx.cfg,
							messageId,
							accountId: ctx.accountId ?? void 0
						})
					});
				}
				throw new Error(`Unsupported Feishu action: "${ctx.action}"`);
			}
		},
		bindings: {
			compileConfiguredBinding: ({ conversationId }) => normalizeFeishuAcpConversationId(conversationId),
			matchInboundConversation: ({ compiledBinding, conversationId, parentConversationId }) => matchFeishuAcpConversation({
				bindingConversationId: compiledBinding.conversationId,
				conversationId,
				parentConversationId
			}),
			resolveCommandConversation: resolveFeishuCommandConversation
		},
		auth: { login: async ({ cfg }) => {
			const { createClackPrompter } = await import("openclaw/plugin-sdk/setup-runtime");
			const { replaceConfigFile } = await import("openclaw/plugin-sdk/config-mutation");
			const nextCfg = await runFeishuLogin({
				cfg,
				prompter: createClackPrompter()
			});
			if (nextCfg !== cfg) await replaceConfigFile({
				nextConfig: nextCfg,
				afterWrite: { mode: "auto" }
			});
		} },
		setupContract: feishuSetupContract,
		setupWizard: feishuSetupWizard,
		messaging: {
			targetPrefixes: ["feishu", "lark"],
			normalizeTarget: (raw) => normalizeFeishuTarget(raw) ?? void 0,
			inferTargetChatType: ({ to }) => resolveReceiveIdType(to) === "chat_id" ? "group" : "direct",
			resolveDeliveryTarget: ({ conversationId, parentConversationId }) => {
				const directId = parseFeishuDirectConversationId(conversationId);
				if (directId) return { to: `user:${directId}` };
				const parsed = parseFeishuConversationId({
					conversationId,
					parentConversationId
				});
				if (parsed?.topicId) return {
					to: `chat:${parentConversationId?.trim() || parsed.chatId}`,
					threadId: parsed.topicId
				};
				return { to: `chat:${parsed?.chatId ?? conversationId.trim()}` };
			},
			resolveSessionConversation: resolveFeishuSessionConversation,
			resolveOutboundSessionRoute: resolveFeishuOutboundSessionRoute,
			targetResolver: {
				looksLikeId: looksLikeFeishuId,
				hint: "<chatId|user:openId|chat:chatId>"
			}
		},
		directory: createChannelDirectoryAdapter({
			listPeers: listFeishuDirectoryPeers,
			listGroups: listFeishuDirectoryGroups,
			...createRuntimeDirectoryLiveAdapter({
				getRuntime: loadFeishuChannelRuntime,
				listPeersLive: (runtime) => runtime.listFeishuDirectoryPeersLive,
				listGroupsLive: (runtime) => runtime.listFeishuDirectoryGroupsLive
			})
		}),
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID, { port: null }),
			buildChannelSummary: ({ snapshot }) => buildProbeChannelStatusSummary(snapshot, { port: snapshot.port ?? null }),
			probeAccount: async ({ account }) => await (await loadFeishuChannelRuntime()).probeFeishu(account),
			resolveAccountSnapshot: ({ account, runtime }) => ({
				accountId: account.accountId,
				enabled: account.enabled,
				configured: account.configured,
				name: account.name,
				extra: {
					appId: account.appId,
					domain: account.domain,
					port: runtime?.port ?? null
				}
			})
		}),
		gateway: feishuGatewayAdapter,
		message: feishuMessageAdapter
	},
	security: {
		collectWarnings: ({ cfg, accountId }) => collectFeishuOpenGroupFindings({
			cfg,
			accountId
		}),
		collectAuditFindings: ({ cfg }) => collectFeishuSecurityAuditFindings({ cfg })
	},
	pairing: { text: {
		idLabel: "feishuUserId",
		message: PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: createPairingPrefixStripper(/^(feishu|user|open_id):/i),
		notify: async ({ cfg, id, message, accountId }) => {
			const { sendMessageFeishu } = await loadFeishuChannelRuntime();
			await sendMessageFeishu({
				cfg,
				to: id,
				text: message,
				accountId
			});
		}
	} },
	threading: {
		matchesToolContextTarget: ({ target, toolContext }) => {
			const normalizedTarget = normalizeFeishuTarget(target);
			if (!normalizedTarget) return false;
			return [toolContext.currentChannelId, toolContext.currentMessagingTarget].some((currentTarget) => currentTarget !== void 0 && normalizeFeishuTarget(currentTarget) === normalizedTarget);
		},
		buildToolContext: ({ context, hasRepliedRef }) => ({
			currentChannelId: normalizeOptionalString(context.NativeChannelId) ?? normalizeOptionalString(context.To),
			currentChatType: context.ChatType === "direct" || context.ChatType === "group" || context.ChatType === "channel" ? context.ChatType : void 0,
			currentMessagingTarget: normalizeOptionalString(context.To),
			currentThreadTs: context.MessageThreadId != null ? String(context.MessageThreadId) : void 0,
			hasRepliedRef
		})
	},
	outbound: {
		deliveryMode: "direct",
		chunker: chunkFeishuMarkdown,
		chunkerMode: "markdown",
		textChunkLimit: 4e3,
		sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
		presentationCapabilities: FEISHU_PRESENTATION_CAPABILITIES,
		...createRuntimeOutboundDelegates({
			getRuntime: loadFeishuChannelRuntime,
			renderPresentation: { resolve: (runtime) => runtime.feishuOutbound.renderPresentation },
			sendPayload: {
				resolve: (runtime) => runtime.feishuOutbound.sendPayload,
				unavailableMessage: "Feishu payload sending is not available."
			},
			sendText: { resolve: (runtime) => runtime.feishuOutbound.sendText },
			sendMedia: { resolve: (runtime) => runtime.feishuOutbound.sendMedia }
		})
	}
});
//#endregion
export { setFeishuNamedAccountEnabled as a, resolveFeishuLegacyWebhookListener as c, listFeishuDirectoryPeers as d, feishuSetupAdapter as i, gateway_config_runtime_exports as l, feishuSetupWizard as n, feishuOutbound as o, runFeishuLogin as r, describeFeishuWebhookPathConflict as s, feishuPlugin as t, listFeishuDirectoryGroups as u };
