import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { C as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { r as runCommandWithTimeout } from "./exec-CIJxrT1J.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { i as stripAssistantInternalScaffolding } from "./assistant-visible-text-C9MYLVs-.js";
import "./media-runtime-BGWQwoXi.js";
import "./number-runtime-DBLVDypr.js";
import "./runtime-config-snapshot-BJVEWeUQ.js";
import "./string-coerce-runtime-BiZzULo_.js";
import "./text-chunking-nijjGL3g.js";
import "./core-BbmhFA6e.js";
import { t as detectBinary } from "./detect-binary-BOttq7rY.js";
import "./setup-CzvlhT1K.js";
import "./process-runtime-C6XwD0zp.js";
import "./status-helpers-DjJ0OuL_.js";
import "./channel-status-CxP0h-5H.js";
import { t as createIMessageRpcClient } from "./client-tfL3dsE6.js";
import { r as setCachedIMessagePrivateApiStatus, t as getCachedIMessagePrivateApiStatus } from "./private-api-status-DBgq8x0h.js";
import { c as parseIMessageTarget, o as normalizeIMessageHandle } from "./targets-ClqZDav8.js";
import "./normalize-C2UJdO1F.js";
import path from "node:path";
//#region extensions/imessage/src/probe.ts
const RPC_SUPPORT_CACHE_TTL_MS = 300 * 1e3;
const PRIVATE_API_NEGATIVE_TTL_MS = 10 * 1e3;
const rpcSupportCache = /* @__PURE__ */ new Map();
function cacheIMessagePrivateApiStatus(cliPath, status) {
	if (status.available) {
		setCachedIMessagePrivateApiStatus(cliPath, status, 0);
		return;
	}
	const expiresAt = resolveExpiresAtMsFromDurationMs(PRIVATE_API_NEGATIVE_TTL_MS);
	if (expiresAt !== void 0) setCachedIMessagePrivateApiStatus(cliPath, status, expiresAt);
}
function getCachedRpcSupport(cliPath) {
	const cached = rpcSupportCache.get(cliPath);
	if (!cached) return;
	const now = asDateTimestampMs(Date.now());
	if (now === void 0 || cached.expiresAt <= now) {
		rpcSupportCache.delete(cliPath);
		return;
	}
	return cached.result;
}
function setCachedRpcSupport(cliPath, result) {
	const expiresAt = resolveExpiresAtMsFromDurationMs(RPC_SUPPORT_CACHE_TTL_MS);
	if (expiresAt === void 0) return;
	rpcSupportCache.set(cliPath, {
		result,
		expiresAt
	});
}
function isDefaultLocalIMessageCliPath(cliPath) {
	const trimmed = cliPath.trim();
	return trimmed === "imsg" || !trimmed.includes("/") && path.basename(trimmed) === "imsg";
}
function resolveIMessageNonMacHostError(cliPath, platform = process.platform) {
	if (platform === "darwin" || !isDefaultLocalIMessageCliPath(cliPath)) return;
	return "iMessage via the default imsg CLI must run on macOS. Run OpenClaw on the signed-in Messages Mac, or set channels.imessage.cliPath to an SSH wrapper that runs imsg on that Mac.";
}
async function probeRpcSupport(cliPath, timeoutMs) {
	const cached = getCachedRpcSupport(cliPath);
	if (cached) return cached;
	try {
		const result = await runCommandWithTimeout([
			cliPath,
			"rpc",
			"--help"
		], { timeoutMs });
		const combined = `${result.stdout}\n${result.stderr}`.trim();
		const normalized = normalizeLowercaseStringOrEmpty(combined);
		if (normalized.includes("unknown command") && normalized.includes("rpc")) {
			const fatal = {
				supported: false,
				fatal: true,
				error: "imsg CLI does not support the \"rpc\" subcommand (update imsg)"
			};
			setCachedRpcSupport(cliPath, fatal);
			return fatal;
		}
		if (result.code === 0) {
			const supported = { supported: true };
			setCachedRpcSupport(cliPath, supported);
			return supported;
		}
		return {
			supported: false,
			error: combined || `imsg rpc --help failed (code ${String(result.code ?? "unknown")})`
		};
	} catch (err) {
		return {
			supported: false,
			error: String(err)
		};
	}
}
function parseStatusPayload(stdout) {
	const lines = normalizeStringEntries(stdout.split(/\r?\n/));
	for (const line of lines.toReversed()) try {
		const value = JSON.parse(line);
		if (value && typeof value === "object" && !Array.isArray(value)) return { payload: value };
	} catch {}
	return {
		payload: null,
		firstLineSnippet: lines[0]?.slice(0, 120)
	};
}
function selectorsFromPayload(payload) {
	const raw = payload.selectors;
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	const selectors = {};
	for (const [key, value] of Object.entries(raw)) if (typeof value === "boolean") selectors[key] = value;
	return selectors;
}
function rpcMethodsFromPayload(payload) {
	const raw = payload.rpc_methods;
	if (!Array.isArray(raw)) return [];
	return raw.filter((entry) => typeof entry === "string");
}
async function probeSendRichSupportsAttachment(cliPath, timeoutMs) {
	try {
		const result = await runCommandWithTimeout([
			cliPath,
			"send-rich",
			"--help"
		], { timeoutMs });
		if (result.code !== 0) return false;
		const combined = `${result.stdout}\n${result.stderr}`;
		return /(?:^|\s)--file\b/m.test(combined);
	} catch {
		return false;
	}
}
async function probeIMessagePrivateApi(cliPath, timeoutMs, options = {}) {
	const key = cliPath.trim() || "imsg";
	if (!options.forceRefresh) {
		const cached = getCachedIMessagePrivateApiStatus(key);
		if (cached) return cached;
	}
	try {
		const result = await runCommandWithTimeout([
			key,
			"status",
			"--json"
		], { timeoutMs });
		const combined = `${result.stdout}\n${result.stderr}`.trim();
		const { payload, firstLineSnippet } = parseStatusPayload(result.stdout);
		const selectors = payload ? selectorsFromPayload(payload) : {};
		const rpcMethods = payload ? rpcMethodsFromPayload(payload) : [];
		const advancedFeatures = payload?.advanced_features === true;
		const v2Ready = payload?.v2_ready === true;
		const statusMessage = typeof payload?.message === "string" ? payload.message : void 0;
		const sendRichSupportsAttachment = await probeSendRichSupportsAttachment(key, timeoutMs);
		const status = {
			available: result.code === 0 && advancedFeatures && v2Ready,
			v2Ready,
			selectors,
			rpcMethods,
			cliCapabilities: { sendRichSupportsAttachment },
			...statusMessage ? { statusMessage } : {},
			...result.code === 0 ? !payload && firstLineSnippet ? { error: `imsg status --json returned no parseable JSONL (first line: "${firstLineSnippet}") — output schema may have changed` } : {} : { error: combined || `imsg status --json failed (code ${String(result.code)})` }
		};
		cacheIMessagePrivateApiStatus(key, status);
		return status;
	} catch (err) {
		const status = {
			available: false,
			v2Ready: false,
			selectors: {},
			rpcMethods: [],
			cliCapabilities: { sendRichSupportsAttachment: false },
			error: String(err)
		};
		cacheIMessagePrivateApiStatus(key, status);
		return status;
	}
}
/**
* Probe iMessage RPC availability.
* @param timeoutMs - Explicit timeout in ms. If undefined, uses config or default.
* @param opts - Additional options (cliPath, dbPath, runtime).
*/
async function probeIMessage(timeoutMs, opts = {}) {
	const cfg = opts.cliPath || opts.dbPath ? void 0 : getRuntimeConfig();
	const cliPath = opts.cliPath?.trim() || cfg?.channels?.imessage?.cliPath?.trim() || "imsg";
	const dbPath = opts.dbPath?.trim() || cfg?.channels?.imessage?.dbPath?.trim();
	const effectiveTimeout = timeoutMs ?? cfg?.channels?.imessage?.probeTimeoutMs ?? 1e4;
	const nonMacHostError = resolveIMessageNonMacHostError(cliPath, opts.platform);
	if (nonMacHostError) return {
		ok: false,
		fatal: true,
		error: nonMacHostError
	};
	if (!await detectBinary(cliPath)) return {
		ok: false,
		error: `imsg not found (${cliPath})`
	};
	const rpcSupport = await probeRpcSupport(cliPath, effectiveTimeout);
	if (!rpcSupport.supported) return {
		ok: false,
		error: rpcSupport.error ?? "imsg rpc unavailable",
		fatal: rpcSupport.fatal
	};
	const privateApi = await probeIMessagePrivateApi(cliPath, effectiveTimeout);
	const client = await createIMessageRpcClient({
		cliPath,
		dbPath,
		runtime: opts.runtime
	});
	try {
		await client.request("chats.list", { limit: 1 }, { timeoutMs: effectiveTimeout });
		return {
			ok: true,
			privateApi
		};
	} catch (err) {
		return {
			ok: false,
			error: String(err),
			privateApi
		};
	} finally {
		await client.stop();
	}
}
//#endregion
//#region extensions/imessage/src/conversation-id-core.ts
function normalizeIMessageAcpConversationId(conversationId) {
	const trimmed = conversationId.trim();
	if (!trimmed) return null;
	try {
		const parsed = parseIMessageTarget(trimmed);
		if (parsed.kind === "handle") {
			const handle = normalizeIMessageHandle(parsed.to);
			return handle ? { conversationId: handle } : null;
		}
		if (parsed.kind === "chat_id") return { conversationId: String(parsed.chatId) };
		if (parsed.kind === "chat_guid") return { conversationId: parsed.chatGuid };
		return { conversationId: parsed.chatIdentifier };
	} catch {
		const handle = normalizeIMessageHandle(trimmed);
		return handle ? { conversationId: handle } : null;
	}
}
function matchIMessageAcpConversation(params) {
	const binding = normalizeIMessageAcpConversationId(params.bindingConversationId);
	const conversation = normalizeIMessageAcpConversationId(params.conversationId);
	if (!binding || !conversation) return null;
	if (binding.conversationId !== conversation.conversationId) return null;
	return {
		conversationId: conversation.conversationId,
		matchPriority: 2
	};
}
function resolveIMessageConversationIdFromTarget(target) {
	return normalizeIMessageAcpConversationId(target)?.conversationId;
}
//#endregion
//#region extensions/imessage/src/conversation-id.ts
function resolveIMessageInboundConversationId(params) {
	if (params.isGroup) return params.chatId != null && Number.isFinite(params.chatId) ? String(params.chatId) : void 0;
	return normalizeIMessageHandle(params.sender) || void 0;
}
//#endregion
//#region extensions/imessage/src/monitor/sanitize-outbound.ts
/**
* Patterns that indicate assistant-internal metadata leaked into text.
* These must never reach a user-facing channel.
*/
const INTERNAL_SEPARATOR_RE = /(?:#\+){2,}#?/g;
const ASSISTANT_ROLE_MARKER_RE = /\bassistant\s+to\s*=\s*\w+/gi;
const ROLE_TURN_MARKER_RE = /\b(?:user|system|assistant)\s*:\s*$/gm;
/**
* Strip all assistant-internal scaffolding from outbound text before delivery.
* Applies reasoning/thinking tag removal, memory tag removal, and
* model-specific internal separator stripping.
*/
function sanitizeOutboundText(text) {
	if (!text) return text;
	let cleaned = stripAssistantInternalScaffolding(text);
	cleaned = cleaned.replace(INTERNAL_SEPARATOR_RE, "");
	cleaned = cleaned.replace(ASSISTANT_ROLE_MARKER_RE, "");
	cleaned = cleaned.replace(ROLE_TURN_MARKER_RE, "");
	cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();
	return cleaned;
}
//#endregion
export { resolveIMessageConversationIdFromTarget as a, normalizeIMessageAcpConversationId as i, resolveIMessageInboundConversationId as n, probeIMessage as o, matchIMessageAcpConversation as r, probeIMessagePrivateApi as s, sanitizeOutboundText as t };
