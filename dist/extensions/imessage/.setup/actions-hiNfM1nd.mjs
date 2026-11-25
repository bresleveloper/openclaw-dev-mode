import { l as parseIMessageTarget } from "./targets-C7CIWJ0k.mjs";
import { l as resolveIMessageRemoteHost, n as hasExclusiveIMessageLocalDatabase, o as resolveIMessageAccount, u as expandIMessageUserPath } from "./accounts-C1Ypv3Wn.mjs";
import { a as setCachedIMessagePrivateApiStatus, n as getCachedIMessagePrivateApiStatus, o as IMESSAGE_ACTIONS, r as imessageRpcSupportsMethod, s as IMESSAGE_ACTION_NAMES, t as describeIMessageMessageTool } from "./message-tool-api-DtZ1wKbT.mjs";
import { i as resolveIMessageChatMatch, t as chatContextFromIMessageTarget } from "./chat-context-fTfJVqAi.mjs";
import { n as createIMessageRpcClient, r as normalizeIMessageAutomationError } from "./client-Be3-fl6b.mjs";
import { n as getOptionalIMessageRuntime, t as getIMessageRuntime } from "./runtime-BRQCPuAD.mjs";
import { l as isAutoManagedIMessageCliPath, n as IMESSAGE_UPDATE_COMMAND, t as IMESSAGE_INSTALL_COMMAND } from "./setup-core-B1_P_t4T.mjs";
import { filterStringEntries, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createLazyRuntimeNamedExport } from "openclaw/plugin-sdk/lazy-runtime";
import path from "node:path";
import { readBooleanParam } from "openclaw/plugin-sdk/boolean-param";
import { createActionGate, jsonResult, readNonNegativeIntegerParam, readPositiveIntegerParam, readReactionParams, readStringArrayParam, readStringParam } from "openclaw/plugin-sdk/channel-actions";
import { canonicalizeBase64 } from "openclaw/plugin-sdk/media-runtime";
import { normalizePollInput } from "openclaw/plugin-sdk/poll-runtime";
import { createSubsystemLogger, logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { extractToolSend } from "openclaw/plugin-sdk/tool-send";
import { createHash } from "node:crypto";
import { runCommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import { captureRuntimeConfigAsyncReader } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { detectBinary } from "openclaw/plugin-sdk/setup";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
// extensions/imessage/src/message-action-reference.ts
async function resolveAuthorizedIMessageActionReference(params) {
	const options = {
		chatContext: params.inputChatContext,
		...params.requireFromMe ? { requireFromMe: true } : {}
	};
	const rawMessageId = params.messageId ?? params.resolveFallbackMessageId(params.inputChatContext);
	const messageId = await params.resolveMessageId(rawMessageId, options);
	const authorize = (authorizedMessageId, chatContext) => params.authorize({
		...params.authorization,
		messageId: authorizedMessageId,
		chatContext
	});
	await authorize(messageId, params.inputChatContext);
	const chatGuid = await params.resolveChatGuid();
	const chatContext = { chatGuid };
	const resolvedMessageId = await params.resolveMessageId(messageId, { chatContext });
	await authorize(resolvedMessageId, chatContext);
	return {
		messageId: resolvedMessageId,
		chatGuid
	};
}
// extensions/imessage/src/message-guid.ts
/** Strip the `p:<n>/` part prefix Messages puts on some GUIDs so keys match. */
function normalizeIMessageGuid(value) {
	return value.trim().replace(/^p:\d+\//iu, "");
}
/** Bridge status placeholders are not identities for receipts or echo matching. */
function normalizeIMessageMessageId(value) {
	const id = value?.trim();
	return id && id !== "ok" && id !== "unknown" ? id : void 0;
}
// extensions/imessage/src/persistence-failure.ts
function createPersistenceFailureReporter(cache) {
	let reported = false;
	return (scope, err) => {
		if (reported) return;
		reported = true;
		logVerbose(`imessage ${cache}: ${scope} disabled after first failure: ${String(err)}`);
	};
}
// extensions/imessage/src/state-contract.ts
const IMESSAGE_REPLY_CACHE_NAMESPACE = "imessage.reply-cache";
const IMESSAGE_REPLY_CACHE_MAX_ENTRIES = 2e3;
const IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE = "imessage.reply-cache-counter";
const IMESSAGE_REPLY_CACHE_COUNTER_KEY = "short-id-counter";
const IMESSAGE_REPLY_CACHE_TTL_MS = 216e5;
function resolveIMessageReplyCacheEntryKey(messageId) {
	return createHash("sha256").update(messageId, "utf8").digest("hex").slice(0, 32);
}
const MAX_FAILURE_RETRY_MAP_SIZE = 512;
const textEncoder = new TextEncoder();
const IMESSAGE_CATCHUP_CURSOR_NAMESPACE = "imessage.catchup-cursors";
function resolveIMessageCatchupCursorKey(accountId) {
	return createHash("sha256").update(accountId, "utf8").digest("hex").slice(0, 32);
}
/**
* Bound the retry map so a pathological storm of unique failing GUIDs
* cannot grow the cursor value without limit. Keeps the `maxSize` entries
* with the highest counts (closest to give-up) when over the bound.
*/
function capFailureRetriesMap(map, maxSize = MAX_FAILURE_RETRY_MAP_SIZE) {
	const maxBytes = 48e3;
	const entries = Object.entries(map);
	if (entries.length <= maxSize && textEncoder.encode(JSON.stringify(map)).byteLength <= maxBytes) return map;
	entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
	const capped = {};
	for (const [guid, count] of entries.slice(0, maxSize)) {
		capped[guid] = count;
		if (textEncoder.encode(JSON.stringify(capped)).byteLength > maxBytes) {
			delete capped[guid];
			break;
		}
	}
	return capped;
}
const IMESSAGE_SENT_ECHOES_TTL_MS = 432e5;
const IMESSAGE_SENT_ECHOES_NAMESPACE = "imessage.sent-echoes";
function resolveIMessageSentEchoEntryKey(entry) {
	return createHash("sha256").update(JSON.stringify([
		entry.scope,
		entry.text ?? "",
		resolveIMessageEchoMediaKey(entry.media) ?? "",
		entry.messageId ?? "",
		entry.timestamp
	])).digest("hex").slice(0, 32);
}
function resolveIMessageEchoMediaKey(media) {
	const contentType = media?.contentType?.trim().toLowerCase() || void 0;
	const kind = media?.kind && media.kind !== "unknown" ? media.kind : void 0;
	if (kind) return `kind:${kind}`;
	const normalizedContentType = contentType?.split(";", 1)[0]?.trim();
	return normalizedContentType ? `mime:${normalizedContentType}` : void 0;
}
// extensions/imessage/src/monitor-reply-cache.ts
/** Recency window for the "react to the latest message" fallback. */
const LATEST_FALLBACK_MS = 6e5;
const reportPersistenceFailure = createPersistenceFailureReporter("reply-cache");
const imessageReplyCacheByMessageId = /* @__PURE__ */ new Map();
const imessageShortIdToUuid = /* @__PURE__ */ new Map();
let imessageShortIdCounter = 0;
function openReplyCacheStore() {
	return getIMessageRuntime().state.openKeyedStoreV2({
		namespace: IMESSAGE_REPLY_CACHE_NAMESPACE,
		maxEntries: IMESSAGE_REPLY_CACHE_MAX_ENTRIES
	});
}
function openReplyCacheCounterStore() {
	return getIMessageRuntime().state.openKeyedStoreV2({
		namespace: IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE,
		maxEntries: 1
	});
}
function remainingTtlMs(timestamp) {
	const remaining = IMESSAGE_REPLY_CACHE_TTL_MS - Math.max(0, Date.now() - timestamp);
	return remaining > 0 ? remaining : void 0;
}
let hydrated = false;
let hydration;
let persistence = Promise.resolve();
function hydrateCounter(counter) {
	if (counter && Number.isSafeInteger(counter.counter) && counter.counter > 0) imessageShortIdCounter = Math.max(imessageShortIdCounter, counter.counter);
}
function hydrateRows(entries) {
	const cutoff = Date.now() - IMESSAGE_REPLY_CACHE_TTL_MS;
	for (const entry of entries.filter((cached) => cached.timestamp >= cutoff).toSorted((a, b) => a.timestamp - b.timestamp).slice(-2e3)) {
		const numeric = Number.parseInt(entry.shortId, 10);
		if (Number.isFinite(numeric) && numeric > imessageShortIdCounter) imessageShortIdCounter = numeric;
		imessageReplyCacheByMessageId.set(entry.messageId, entry);
		imessageShortIdToUuid.set(entry.shortId, entry.messageId);
	}
}
async function hydrateFromStoreOnce() {
	if (hydrated) return;
	hydration ??= (async () => {
		try {
			hydrateCounter(await openReplyCacheCounterStore().lookup(IMESSAGE_REPLY_CACHE_COUNTER_KEY));
			hydrateRows((await openReplyCacheStore().entries()).map(({ value }) => value));
		} catch (err) {
			reportPersistenceFailure("read", err);
		} finally {
			hydrated = true;
		}
	})();
	await hydration;
}
async function persistReplyCacheEntry(entry) {
	const ttlMs = remainingTtlMs(entry.timestamp);
	if (!ttlMs) return;
	try {
		await openReplyCacheStore().register(resolveIMessageReplyCacheEntryKey(entry.messageId), entry, { ttlMs });
	} catch (err) {
		reportPersistenceFailure("write", err);
	}
}
async function deleteReplyCacheEntry(messageId) {
	try {
		await openReplyCacheStore().delete(resolveIMessageReplyCacheEntryKey(messageId));
	} catch (err) {
		reportPersistenceFailure("delete", err);
	}
}
async function persistReplyCacheCounter(counter) {
	try {
		await openReplyCacheCounterStore().register(IMESSAGE_REPLY_CACHE_COUNTER_KEY, { counter });
	} catch (err) {
		reportPersistenceFailure("counter", err);
	}
}
function buildReplyCacheEntry(entry, messageId, shortId) {
	return {
		accountId: entry.accountId,
		messageId,
		shortId,
		timestamp: entry.timestamp,
		...entry.chatGuid !== void 0 ? { chatGuid: entry.chatGuid } : {},
		...entry.chatIdentifier !== void 0 ? { chatIdentifier: entry.chatIdentifier } : {},
		...entry.chatId !== void 0 ? { chatId: entry.chatId } : {},
		...entry.isFromMe !== void 0 ? { isFromMe: entry.isFromMe } : {}
	};
}
async function rememberIMessageReplyCache(entry) {
	await hydrateFromStoreOnce();
	const messageId = entry.messageId.trim();
	if (!messageId) return {
		...entry,
		shortId: ""
	};
	let shortId = imessageReplyCacheByMessageId.get(messageId)?.shortId;
	const isNewMessage = !shortId;
	if (!shortId) {
		shortId = String(++imessageShortIdCounter);
		imessageShortIdToUuid.set(shortId, messageId);
	}
	const fullEntry = buildReplyCacheEntry(entry, messageId, shortId);
	imessageReplyCacheByMessageId.delete(messageId);
	imessageReplyCacheByMessageId.set(messageId, fullEntry);
	const cutoff = Date.now() - IMESSAGE_REPLY_CACHE_TTL_MS;
	const deletedMessageIds = [];
	const pruneUntil = (retain) => {
		for (const [key, cached] of imessageReplyCacheByMessageId) {
			if (retain(key, cached)) break;
			imessageReplyCacheByMessageId.delete(key);
			deletedMessageIds.push(key);
			if (cached.shortId) imessageShortIdToUuid.delete(cached.shortId);
		}
	};
	pruneUntil((_key, cached) => cached.timestamp >= cutoff);
	pruneUntil((key) => !key || imessageReplyCacheByMessageId.size <= 2e3);
	const counter = imessageShortIdCounter;
	persistence = persistence.then(async () => {
		if (isNewMessage) await persistReplyCacheCounter(counter);
		for (const messageIdToDelete of deletedMessageIds) await deleteReplyCacheEntry(messageIdToDelete);
		await persistReplyCacheEntry(fullEntry);
	});
	await persistence;
	return fullEntry;
}
function hasChatScope(ctx) {
	if (!ctx) return false;
	return Boolean(normalizeOptionalString(ctx.chatGuid) || normalizeOptionalString(ctx.chatIdentifier) || typeof ctx.chatId === "number");
}
function describeChatForError(values) {
	const parts = [];
	if (normalizeOptionalString(values.chatGuid)) parts.push("chatGuid=<redacted>");
	if (normalizeOptionalString(values.chatIdentifier)) parts.push("chatIdentifier=<redacted>");
	if (typeof values.chatId === "number") parts.push("chatId=<redacted>");
	return parts.length === 0 ? "<unknown chat>" : parts.join(", ");
}
function describeMessageIdForError(inputId, inputKind) {
	if (inputKind === "short") return `<short:${inputId.length}-digit>`;
	return `<uuid:${inputId.slice(0, 8)}...>`;
}
function buildCrossChatError(inputId, inputKind, cached, ctx) {
	const remediation = inputKind === "short" ? "Use a message ID from the current chat target; MessageSidFull from another chat is rejected." : "Retry with the correct chat target.";
	return /* @__PURE__ */ new Error(`iMessage message id ${describeMessageIdForError(inputId, inputKind)} belongs to a different chat (${describeChatForError(cached)}) than the current call target (${describeChatForError(ctx)}). ${remediation}`);
}
async function resolveIMessageMessageId(shortOrUuid, opts) {
	const trimmed = shortOrUuid.trim();
	if (!trimmed) return trimmed;
	await hydrateFromStoreOnce();
	const inputKind = /^\d+$/.test(trimmed) ? "short" : "uuid";
	const messageId = inputKind === "short" ? imessageShortIdToUuid.get(trimmed) : trimmed;
	if (!messageId) {
		if (!hasChatScope(opts?.chatContext)) throw new Error(`iMessage short message id ${describeMessageIdForError(trimmed, "short")} requires a chat scope (chatGuid / chatIdentifier / chatId or a target).`);
		throw new Error(`iMessage short message id ${describeMessageIdForError(trimmed, "short")} is no longer available. Use MessageSidFull.`);
	}
	const cached = imessageReplyCacheByMessageId.get(messageId);
	if (cached && opts?.chatContext && (inputKind === "uuid" || hasChatScope(opts.chatContext)) && resolveIMessageChatMatch(cached, opts.chatContext) === "mismatch") throw buildCrossChatError(trimmed, inputKind, cached, opts.chatContext);
	if (opts?.requireFromMe && cached?.isFromMe !== true) throw buildFromMeError(trimmed, inputKind);
	return messageId;
}
async function isKnownFromMeIMessageMessageId(messageId, ctx) {
	const trimmed = normalizeOptionalString(messageId);
	if (!trimmed || !ctx.accountId || !hasChatScope(ctx)) return false;
	await hydrateFromStoreOnce();
	const cached = imessageReplyCacheByMessageId.get(trimmed);
	if (!cached || cached.isFromMe !== true) return false;
	return resolveCachedResourceBinding(trimmed, {
		...ctx,
		accountId: ctx.accountId
	}) === "match";
}
async function isKnownFromMeIMessageTarget(params) {
	const { accountId, chatId, chatGuid, chatIdentifier } = params;
	const ctx = {
		accountId,
		chatId,
		chatGuid,
		chatIdentifier
	};
	for (const messageId of params.messageIds) if (await isKnownFromMeIMessageMessageId(messageId, ctx)) return true;
	return false;
}
function buildFromMeError(inputId, inputKind) {
	return /* @__PURE__ */ new Error(`iMessage message id ${describeMessageIdForError(inputId, inputKind)} is not one this agent sent. edit and unsend can only target messages the gateway delivered itself; messages received from other participants cannot be modified.`);
}
/** Latest recent entry with a positive same-account conversation match; never guess a chat. */
function findLatestIMessageEntryForChat(ctx) {
	if (!hasChatScope(ctx) || !ctx.accountId) return;
	const cutoff = Date.now() - LATEST_FALLBACK_MS;
	let best;
	for (const entry of imessageReplyCacheByMessageId.values()) {
		if (entry.accountId !== ctx.accountId) continue;
		if (entry.timestamp < cutoff) continue;
		if (resolveIMessageChatMatch(entry, ctx) !== "match") continue;
		if (!best || entry.timestamp > best.timestamp) best = entry;
	}
	return best;
}
async function resolveIMessageCachedResourceBinding(messageId, ctx) {
	await hydrateFromStoreOnce();
	return resolveCachedResourceBinding(messageId, ctx);
}
function resolveCachedResourceBinding(messageId, ctx) {
	const entry = imessageReplyCacheByMessageId.get(messageId.trim());
	if (!entry) return "unknown";
	if (Date.now() - entry.timestamp > 216e5) return "unknown";
	if (entry.accountId !== ctx.accountId) return "mismatch";
	return resolveIMessageChatMatch(entry, ctx);
}
async function isIMessageCurrentMessageInChatAsync(params) {
	await hydrateFromStoreOnce();
	return isCurrentMessageInChat(params);
}
function isCurrentMessageInChat(params) {
	if (!params.accountId || !hasChatScope(params.chatContext)) return false;
	const currentMessageId = normalizeOptionalString(String(params.currentMessageId));
	if (!currentMessageId) return false;
	const fullMessageId = /^\d+$/.test(currentMessageId) ? imessageShortIdToUuid.get(currentMessageId) : currentMessageId;
	if (!fullMessageId) return false;
	return resolveCachedResourceBinding(fullMessageId, {
		...params.chatContext,
		accountId: params.accountId
	}) === "match";
}
// extensions/imessage/src/probe.ts
const RPC_SUPPORT_CACHE_TTL_MS = 3e5;
const PRIVATE_API_NEGATIVE_TTL_MS = 1e4;
const rpcSupportCache = /* @__PURE__ */ new Map();
function cacheIMessagePrivateApiStatus(cliPath, status) {
	setCachedIMessagePrivateApiStatus(cliPath, status, status.available ? 0 : Date.now() + PRIVATE_API_NEGATIVE_TTL_MS);
}
function setCachedRpcSupport(cliPath, result) {
	rpcSupportCache.set(cliPath, {
		result,
		expiresAt: Date.now() + RPC_SUPPORT_CACHE_TTL_MS
	});
}
async function probeRpcSupport(cliPath, timeoutMs) {
	const cached = rpcSupportCache.get(cliPath);
	if (cached) {
		if (cached.expiresAt > Date.now()) return cached.result;
		rpcSupportCache.delete(cliPath);
	}
	try {
		const result = await runCommandWithTimeout([
			expandIMessageUserPath(cliPath),
			"rpc",
			"--help"
		], { timeoutMs });
		const combined = `${result.stdout}\n${result.stderr}`.trim();
		const normalized = normalizeLowercaseStringOrEmpty(combined);
		if (normalized.includes("unknown command") && normalized.includes("rpc")) {
			const fatal = {
				supported: false,
				fatal: true,
				error: `imsg CLI does not support the "rpc" subcommand. Update imsg on the Messages Mac: ${IMESSAGE_UPDATE_COMMAND}`
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
async function probeIMessageCliFlag(cliPath, timeoutMs, command, flag) {
	try {
		const result = await runCommandWithTimeout([
			expandIMessageUserPath(cliPath),
			...command,
			"--help"
		], { timeoutMs });
		if (result.code !== 0) return false;
		const combined = `${result.stdout}\n${result.stderr}`;
		return flag.test(combined);
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
	const unavailable = (error) => {
		const status = {
			available: false,
			v2Ready: false,
			selectors: {},
			rpcMethods: [],
			cliCapabilities: {
				sendRichSupportsAttachment: false,
				pollSendSupportsNoComment: false
			},
			error
		};
		cacheIMessagePrivateApiStatus(key, status);
		return status;
	};
	try {
		const result = await runCommandWithTimeout([
			expandIMessageUserPath(key),
			"status",
			"--json"
		], { timeoutMs });
		const combined = `${result.stdout}\n${result.stderr}`.trim();
		const normalized = normalizeLowercaseStringOrEmpty(combined);
		if (result.code !== 0 && normalized.includes("unknown subcommand") && normalized.includes("status")) return unavailable(`imsg CLI does not support the "status" subcommand. Update imsg on the Messages Mac: ${IMESSAGE_UPDATE_COMMAND}`);
		const lines = normalizeStringEntries(result.stdout.split(/\r?\n/));
		let payload = null;
		for (const line of lines.toReversed()) try {
			const value = JSON.parse(line);
			if (value && typeof value === "object" && !Array.isArray(value)) {
				payload = value;
				break;
			}
		} catch {}
		const firstLineSnippet = !payload && lines[0] ? truncateUtf16Safe(lines[0], 120) : void 0;
		const rawSelectors = payload?.selectors;
		const selectors = {};
		if (rawSelectors && typeof rawSelectors === "object" && !Array.isArray(rawSelectors)) {
			for (const [selector, value] of Object.entries(rawSelectors)) if (typeof value === "boolean") selectors[selector] = value;
		}
		const rpcMethods = filterStringEntries(payload?.rpc_methods);
		const advancedFeatures = payload?.advanced_features === true;
		const v2Ready = payload?.v2_ready === true;
		const statusMessage = typeof payload?.message === "string" ? payload.message : void 0;
		const sendRichSupportsAttachment = await probeIMessageCliFlag(key, timeoutMs, ["send-rich"], /(?:^|\s)--file\b/m);
		const pollSendSupportsNoComment = await probeIMessageCliFlag(key, timeoutMs, ["poll", "send"], /(?:^|\s)--no-comment\b/m);
		const status = {
			available: result.code === 0 && advancedFeatures && v2Ready,
			v2Ready,
			selectors,
			rpcMethods,
			cliCapabilities: {
				sendRichSupportsAttachment,
				pollSendSupportsNoComment
			},
			...statusMessage ? { statusMessage } : {},
			...result.code === 0 ? !payload && firstLineSnippet ? { error: `imsg status --json returned no parseable JSONL (first line: "${firstLineSnippet}") — output schema may have changed` } : {} : { error: combined || `imsg status --json failed (code ${String(result.code)})` }
		};
		cacheIMessagePrivateApiStatus(key, status);
		return status;
	} catch (err) {
		return unavailable(String(err));
	}
}
async function probeIMessage(timeoutMs, opts = {}) {
	const cfg = opts.cliPath || opts.dbPath ? void 0 : await captureRuntimeConfigAsyncReader()();
	const explicitCliPath = opts.cliPath?.trim() || cfg?.channels?.imessage?.cliPath?.trim();
	const cliPath = explicitCliPath || "imsg";
	const dbPath = opts.dbPath?.trim() || cfg?.channels?.imessage?.dbPath?.trim();
	const remoteHost = await resolveIMessageRemoteHost({
		cliPath,
		remoteHost: opts.remoteHost ?? cfg?.channels?.imessage?.remoteHost
	});
	const effectiveTimeout = timeoutMs ?? cfg?.channels?.imessage?.probeTimeoutMs ?? 1e4;
	if ((opts.platform ?? process.platform) !== "darwin" && (cliPath === "imsg" || !cliPath.includes("/") && path.basename(cliPath) === "imsg")) return {
		ok: false,
		fatal: true,
		error: "iMessage via the default imsg CLI must run on macOS. Run OpenClaw on the signed-in Messages Mac, or set channels.imessage.cliPath to an SSH wrapper that runs imsg on that Mac."
	};
	if (!await detectBinary(expandIMessageUserPath(cliPath))) return {
		ok: false,
		error: isAutoManagedIMessageCliPath(cliPath, { explicit: explicitCliPath !== void 0 }) ? `imsg not found (${cliPath}). Install imsg on the Messages Mac: ${IMESSAGE_INSTALL_COMMAND}` : `imsg command not found (${cliPath}). Check the configured iMessage cliPath or wrapper.`
	};
	const rpcSupport = await probeRpcSupport(cliPath, effectiveTimeout);
	if (!rpcSupport.supported) return {
		ok: false,
		error: rpcSupport.error ?? "imsg rpc unavailable",
		fatal: rpcSupport.fatal
	};
	const privateApi = await probeIMessagePrivateApi(cliPath, effectiveTimeout, { forceRefresh: opts.forceRefresh });
	const client = await createIMessageRpcClient({
		cliPath,
		dbPath,
		remoteHost,
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
// extensions/imessage/src/send-status.ts
const SEND_STATUS_CAPABILITY = "imessage-send-status";
function registerIMessageSendStatus(ctx) {
	return ctx.channelRuntime?.runtimeContexts.register({
		channelId: "imessage",
		accountId: ctx.accountId,
		capability: SEND_STATUS_CAPABILITY,
		context: {
			getStatus: ctx.getStatus,
			setStatus: ctx.setStatus
		},
		abortSignal: ctx.abortSignal
	});
}
function getSendStatus(accountId) {
	return getOptionalIMessageRuntime()?.channel.runtimeContexts.get({
		channelId: "imessage",
		accountId,
		capability: SEND_STATUS_CAPABILITY
	});
}
function recordIMessageSendFailure(accountId, error) {
	const guidance = error instanceof Error ? normalizeIMessageAutomationError(error.message) : void 0;
	if (guidance) getSendStatus(accountId)?.setStatus({
		accountId,
		lastError: guidance
	});
}
async function withIMessageSendFailureStatus(accountId, send) {
	try {
		return await send();
	} catch (error) {
		recordIMessageSendFailure(accountId, error);
		throw error;
	}
}
function clearIMessageSendFailure(accountId) {
	const status = getSendStatus(accountId);
	if (status && normalizeIMessageAutomationError(status.getStatus().lastError ?? "")) status.setStatus({
		accountId,
		lastError: null
	});
}
// extensions/imessage/src/actions.ts
const loadIMessageActionsRuntime = createLazyRuntimeNamedExport(() => import("./actions.runtime-CjAq5R1o.mjs"), "imessageActionsRuntime");
const log = createSubsystemLogger("channels/imessage");
const providerId = "imessage";
const SUPPORTED_ACTIONS = /* @__PURE__ */ new Set([...IMESSAGE_ACTION_NAMES, "upload-file"]);
const GROUP_MANAGEMENT_ACTIONS = /* @__PURE__ */ new Set([
	"renameGroup",
	"setGroupIcon",
	"addParticipant",
	"removeParticipant",
	"leaveGroup"
]);
function readMessageText(params) {
	return readStringParam(params, "text") ?? readStringParam(params, "message");
}
function rejectRedactedIMessageTarget(value) {
	if (value === "***") throw new Error("iMessage action target is a redacted display value. Omit the target to use the current conversation.");
	return value;
}
function resolveIMessageDeliveryTarget(args) {
	const chatGuid = rejectRedactedIMessageTarget(readStringParam(args, "chatGuid"));
	const chatId = readPositiveIntegerParam(args, "chatId");
	const chatIdentifier = rejectRedactedIMessageTarget(readStringParam(args, "chatIdentifier"));
	const targets = [
		chatGuid ? `chat_guid:${chatGuid}` : void 0,
		chatId !== void 0 ? `chat_id:${chatId}` : void 0,
		chatIdentifier ? `chat_identifier:${chatIdentifier}` : void 0
	].filter((value) => Boolean(value));
	if (targets.length > 1) throw new Error("iMessage action received conflicting delivery target aliases.");
	return targets[0];
}
function resolveIMessageActionTarget(params) {
	const rawTarget = resolveIMessageDeliveryTarget(params.actionParams) ?? readStringParam(params.actionParams, "to") ?? readStringParam(params.actionParams, "target") ?? (params.currentChannelId?.trim() || void 0);
	rejectRedactedIMessageTarget(rawTarget);
	return rawTarget ? parseIMessageTarget(rawTarget) : null;
}
const IMESSAGE_DELIVERY_TARGET_ALIASES = [
	"chatGuid",
	"chatIdentifier",
	"chatId"
];
function currentConversationMatchParams(params) {
	const currentMessageId = params.toolContext.currentMessageId;
	if (currentMessageId === void 0) return;
	return {
		accountId: params.accountId,
		currentMessageId,
		chatContext: {
			chatGuid: readStringParam(params.args, "chatGuid"),
			chatIdentifier: readStringParam(params.args, "chatIdentifier"),
			chatId: readPositiveIntegerParam(params.args, "chatId")
		}
	};
}
function createIMessageTargetAliases(resourceAliases = []) {
	return {
		aliases: [...IMESSAGE_DELIVERY_TARGET_ALIASES, ...resourceAliases],
		deliveryTargetAliases: [...IMESSAGE_DELIVERY_TARGET_ALIASES],
		resolveDeliveryTarget: ({ args }) => resolveIMessageDeliveryTarget(args),
		matchesCurrentConversationAsync: async (params) => {
			const match = currentConversationMatchParams(params);
			return match ? await isIMessageCurrentMessageInChatAsync(match) : false;
		}
	};
}
/** An omitted action reference targets the most recent inbound in the same chat. */
function readMessageIdWithChatFallback(params, chatContext) {
	const explicit = readStringParam(params, "messageId");
	if (explicit) return explicit;
	const latest = findLatestIMessageEntryForChat(chatContext);
	if (latest?.messageId) return latest.messageId;
	return readStringParam(params, "messageId", { required: true });
}
function formatUnresolvedTarget(target) {
	return target.kind === "chat_id" ? "chat_id:<redacted>" : "chat_identifier:<redacted>";
}
function mapTapbackReaction(emoji) {
	const value = normalizeOptionalLowercaseString(emoji)?.replace(/\ufe0f/g, "");
	return value ? [
		[
			"love",
			"heart",
			"❤"
		],
		[
			"like",
			"+1",
			"thumbsup",
			"👍"
		],
		[
			"dislike",
			"-1",
			"thumbsdown",
			"👎"
		],
		[
			"laugh",
			"haha",
			"😂",
			"🤣"
		],
		[
			"emphasize",
			"!!",
			"‼"
		],
		[
			"question",
			"?",
			"？",
			"❓"
		]
	].find((aliases) => aliases.includes(value))?.[0] : void 0;
}
function decodeBase64Buffer(params, action) {
	const base64Buffer = readStringParam(params, "buffer");
	if (!base64Buffer) throw new Error(`iMessage ${action} requires buffer (base64) parameter.`);
	const canonical = canonicalizeBase64(base64Buffer.replaceAll("-", "+").replaceAll("_", "/"));
	if (!canonical) throw new Error(`iMessage ${action} buffer must be valid base64.`);
	return Buffer.from(canonical, "base64");
}
const REPLY_ATTACHMENT_PATH_PARAM_NAMES = [
	"filePath",
	"path",
	"media",
	"mediaUrl",
	"fileUrl"
];
const EFFECT_ALIASES = {
	slam: "com.apple.MobileSMS.expressivesend.impact",
	impact: "com.apple.MobileSMS.expressivesend.impact",
	loud: "com.apple.MobileSMS.expressivesend.loud",
	gentle: "com.apple.MobileSMS.expressivesend.gentle",
	"invisible-ink": "com.apple.MobileSMS.expressivesend.invisibleink",
	invisibleink: "com.apple.MobileSMS.expressivesend.invisibleink",
	confetti: "com.apple.MobileSMS.expressivesend.confetti",
	lasers: "com.apple.MobileSMS.expressivesend.lasers",
	fireworks: "com.apple.MobileSMS.expressivesend.fireworks",
	balloons: "com.apple.MobileSMS.expressivesend.balloon",
	balloon: "com.apple.MobileSMS.expressivesend.balloon",
	heart: "com.apple.MobileSMS.expressivesend.heart",
	echo: "com.apple.messages.effect.CKEchoEffect",
	happybirthday: "com.apple.messages.effect.CKHappyBirthdayEffect",
	"happy-birthday": "com.apple.messages.effect.CKHappyBirthdayEffect",
	shootingstar: "com.apple.messages.effect.CKShootingStarEffect",
	"shooting-star": "com.apple.messages.effect.CKShootingStarEffect",
	sparkles: "com.apple.messages.effect.CKSparklesEffect",
	spotlight: "com.apple.messages.effect.CKSpotlightEffect"
};
const KNOWN_EFFECT_IDS = new Set(Object.values(EFFECT_ALIASES));
function effectIdFromParam(raw) {
	const value = normalizeOptionalLowercaseString(raw);
	if (!value) return;
	const resolved = EFFECT_ALIASES[value] ?? raw;
	if (typeof resolved === "string" && KNOWN_EFFECT_IDS.has(resolved)) return resolved;
	throw new Error(`iMessage sendWithEffect rejected unknown effect "${raw}". Use one of: slam, loud, gentle, invisibleink, confetti, lasers, fireworks, balloon, heart, echo, happybirthday, shootingstar, sparkles, spotlight (or the full com.apple.MobileSMS.expressivesend.* / com.apple.messages.effect.* identifier).`);
}
function assertActionEnabled(action, actionsConfig) {
	const spec = IMESSAGE_ACTIONS[action === "upload-file" ? "sendAttachment" : action];
	if (!spec?.gate || !createActionGate(actionsConfig)(spec.gate)) throw new Error(`iMessage ${action} is disabled in config.`);
}
const imessageMessageActions = {
	describeMessageTool: describeIMessageMessageTool,
	supportsAction: ({ action }) => SUPPORTED_ACTIONS.has(action),
	requiresTrustedRequesterSender: ({ action, toolContext }) => normalizeOptionalLowercaseString(toolContext?.currentChannelProvider) === "imessage" && GROUP_MANAGEMENT_ACTIONS.has(action),
	messageActionTargetAliases: {
		react: createIMessageTargetAliases(["messageId"]),
		edit: createIMessageTargetAliases(["messageId"]),
		unsend: createIMessageTargetAliases(["messageId"]),
		reply: createIMessageTargetAliases(["messageId"]),
		sendWithEffect: createIMessageTargetAliases(),
		sendAttachment: createIMessageTargetAliases(),
		poll: createIMessageTargetAliases(),
		"poll-vote": createIMessageTargetAliases(["pollId", "messageId"]),
		"upload-file": createIMessageTargetAliases(),
		renameGroup: createIMessageTargetAliases(),
		setGroupIcon: createIMessageTargetAliases(),
		addParticipant: createIMessageTargetAliases(),
		removeParticipant: createIMessageTargetAliases(),
		leaveGroup: createIMessageTargetAliases()
	},
	extractToolSend: ({ args }) => extractToolSend(args, "sendMessage"),
	handleAction: async ({ action, params, cfg, accountId, toolContext, senderIsOwner, gatewayClientScopes, conversationReadOrigin }) => {
		if (GROUP_MANAGEMENT_ACTIONS.has(action) && senderIsOwner !== true && !gatewayClientScopes?.includes("operator.admin")) throw new Error("iMessage group management requires an owner or operator.admin requester.");
		const runtime = await loadIMessageActionsRuntime();
		const account = resolveIMessageAccount({
			cfg,
			accountId: accountId ?? void 0
		});
		assertActionEnabled(action, account.config.actions);
		const cliPathForProbe = account.config.cliPath?.trim() || "imsg";
		const remoteHost = await resolveIMessageRemoteHost({
			cliPath: cliPathForProbe,
			remoteHost: account.config.remoteHost
		});
		let privateApiStatus = getCachedIMessagePrivateApiStatus(cliPathForProbe);
		const probePrivateApiStatus = async (forceRefresh = false) => {
			privateApiStatus = await probeIMessagePrivateApi(cliPathForProbe, account.config.probeTimeoutMs ?? 1e4, forceRefresh ? { forceRefresh: true } : void 0);
		};
		const assertPrivateApiEnabled = async () => {
			if (privateApiStatus?.available !== true) await probePrivateApiStatus();
			if (!privateApiStatus?.available) {
				const reason = privateApiStatus?.statusMessage ? ` imsg reports: ${privateApiStatus.statusMessage}` : "";
				log.warn(`iMessage ${action} blocked: private API bridge unavailable (accountId=${account.accountId}, cliPath=${cliPathForProbe}). Run \`imsg launch\` to re-inject the dylib, then \`openclaw channels status --probe\` to refresh.${reason}`);
				throw new Error(`iMessage ${action} requires the imsg private API bridge. Run imsg launch, then openclaw channels status --probe to refresh capability detection.${reason}`);
			}
		};
		const opts = {
			cliPath: cliPathForProbe,
			dbPath: account.config.dbPath?.trim() || void 0,
			remoteHost,
			timeoutMs: account.config.probeTimeoutMs
		};
		const attestedConversationReadOrigin = conversationReadOrigin ?? "delegated";
		const chatGuid = async () => {
			const target = resolveIMessageActionTarget({
				actionParams: params,
				currentChannelId: toolContext?.currentChannelId
			});
			if (!target) throw new Error(`iMessage ${action} requires chatGuid, chatId, chatIdentifier, or a chat target.`);
			if (target.kind === "chat_guid") return target.chatGuid;
			const synthesizedIdentifier = target.kind === "handle" ? `${target.service === "sms" ? "SMS" : "iMessage"};-;${target.to}` : "";
			const lookupTarget = target.kind === "handle" ? {
				kind: "chat_identifier",
				chatIdentifier: synthesizedIdentifier
			} : target;
			const resolved = await runtime.resolveChatGuidForTarget({
				target: lookupTarget,
				options: opts,
				conversationReadOrigin: attestedConversationReadOrigin
			});
			if (resolved) return resolved;
			if (target.kind !== "handle") throw new Error(`iMessage ${action} failed: chatGuid not found for ${formatUnresolvedTarget(target)}.`);
			if (action === "react" || action === "edit" || action === "unsend") throw new Error(`iMessage ${action} requires a known chat. No registered chat for the supplied target; send a message first or pass an explicit chatGuid.`);
			return synthesizedIdentifier;
		};
		const messageReference = async (input) => {
			const service = account.config.service;
			const target = resolveIMessageActionTarget({
				actionParams: params,
				currentChannelId: toolContext?.currentChannelId
			});
			const inputChatContext = target ? chatContextFromIMessageTarget(target, service) : {};
			return await resolveAuthorizedIMessageActionReference({
				messageId: input?.messageId,
				inputChatContext,
				requireFromMe: input?.requireFromMe,
				resolveFallbackMessageId: (chatContext) => readMessageIdWithChatFallback(params, {
					...chatContext,
					accountId: account.accountId
				}),
				resolveMessageId: runtime.resolveIMessageMessageId,
				resolveChatGuid: chatGuid,
				authorize: (authorization) => runtime.authorizeMessageReference(authorization),
				authorization: {
					accountId: account.accountId,
					cliPath: opts.cliPath,
					dbPath: opts.dbPath,
					hasExclusiveLocalDatabase: hasExclusiveIMessageLocalDatabase({
						cfg,
						account,
						cliPath: opts.cliPath,
						dbPath: opts.dbPath,
						remoteHost: opts.remoteHost
					}),
					remoteHost: opts.remoteHost,
					conversationReadOrigin: attestedConversationReadOrigin
				}
			});
		};
		const completeOutboundBridgeMessage = async (result, targetChatGuid, details) => {
			const messageId = normalizeIMessageMessageId(result.messageId);
			if (messageId) await rememberIMessageReplyCache({
				accountId: account.accountId,
				messageId,
				chatGuid: targetChatGuid,
				timestamp: Date.now(),
				isFromMe: true
			});
			if (result.messageId !== "unknown") clearIMessageSendFailure(account.accountId);
			return jsonResult({
				ok: true,
				messageId: result.messageId,
				...details
			});
		};
		await assertPrivateApiEnabled();
		if (action === "react") {
			const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove an iMessage reaction." });
			const reaction = mapTapbackReaction(emoji);
			const TAPBACK_KINDS = [
				"love",
				"like",
				"dislike",
				"laugh",
				"emphasize",
				"question"
			];
			if (!remove && (isEmpty || !reaction)) throw new Error("iMessage react supports love, like, dislike, laugh, emphasize, and question tapbacks.");
			const partIndex = readNonNegativeIntegerParam(params, "partIndex");
			const reference = await messageReference();
			const reactionsToSend = remove && !reaction ? TAPBACK_KINDS : reaction ? [reaction] : [];
			for (const kind of reactionsToSend) await runtime.sendReaction({
				chatGuid: reference.chatGuid,
				messageId: reference.messageId,
				reaction: kind,
				remove: remove || void 0,
				partIndex,
				options: opts
			});
			return jsonResult({
				ok: true,
				...remove ? { removed: true } : { added: reaction }
			});
		}
		if (action === "edit") {
			const text = readStringParam(params, "text") ?? readStringParam(params, "newText") ?? readStringParam(params, "message");
			if (!text) throw new Error("iMessage edit requires text, newText, or message.");
			const partIndex = readNonNegativeIntegerParam(params, "partIndex");
			const backwardsCompatMessage = readStringParam(params, "backwardsCompatMessage");
			const reference = await messageReference({ requireFromMe: true });
			await runtime.editMessage({
				chatGuid: reference.chatGuid,
				messageId: reference.messageId,
				text,
				backwardsCompatMessage,
				partIndex,
				options: opts
			});
			return jsonResult({
				ok: true,
				edited: reference.messageId
			});
		}
		if (action === "unsend") {
			const partIndex = readNonNegativeIntegerParam(params, "partIndex");
			const reference = await messageReference({ requireFromMe: true });
			await runtime.unsendMessage({
				chatGuid: reference.chatGuid,
				messageId: reference.messageId,
				partIndex,
				options: opts
			});
			return jsonResult({
				ok: true,
				unsent: reference.messageId
			});
		}
		if (action === "reply") {
			const text = readMessageText(params);
			if (!text) throw new Error("iMessage reply requires text or message.");
			const reference = await messageReference();
			let attachment;
			if (readStringParam(params, "buffer")) {
				const filename = readStringParam(params, "filename") ?? "attachment.bin";
				attachment = {
					kind: "buffer",
					buffer: decodeBase64Buffer(params, "reply attachment"),
					filename
				};
			} else for (const name of REPLY_ATTACHMENT_PATH_PARAM_NAMES) if (readStringParam(params, name)) throw new Error(`iMessage reply rejected \`${name}\` because it did not pass through the outbound media resolver. Pass a base64 \`buffer\` + \`filename\` directly, or invoke message(action: "reply") through the runner so the resolver can validate the path against mediaLocalRoots/sandbox/size before sending.`);
			if (attachment) {
				if (!opts.remoteHost && privateApiStatus?.cliCapabilities?.sendRichSupportsAttachment !== true) throw new Error("iMessage reply with an attachment needs an imsg build that exposes `send-rich --file` (openclaw/imsg#114). Upgrade imsg, or use action 'upload-file' (with filePath/filename) or action 'send' (with media) to deliver the file plus a separate 'reply' for any text.");
			}
			const partIndex = readNonNegativeIntegerParam(params, "partIndex");
			return await completeOutboundBridgeMessage(await runtime.sendRichMessage({
				chatGuid: reference.chatGuid,
				text,
				replyToMessageId: reference.messageId,
				partIndex,
				attachment,
				options: opts
			}), reference.chatGuid, { repliedTo: reference.messageId });
		}
		if (action === "sendWithEffect") {
			const text = readMessageText(params);
			const effectId = effectIdFromParam(readStringParam(params, "effectId") ?? readStringParam(params, "effect"));
			if (!text || !effectId) throw new Error("iMessage sendWithEffect requires text/message and effect/effectId.");
			const resolvedChatGuid = await chatGuid();
			return await completeOutboundBridgeMessage(await runtime.sendRichMessage({
				chatGuid: resolvedChatGuid,
				text,
				effectId,
				options: opts
			}), resolvedChatGuid, { effect: effectId });
		}
		if (action === "renameGroup") {
			const displayName = readStringParam(params, "displayName") ?? readStringParam(params, "name");
			if (!displayName) throw new Error("iMessage renameGroup requires displayName or name.");
			const resolvedChatGuid = await chatGuid();
			await runtime.renameGroup({
				chatGuid: resolvedChatGuid,
				displayName,
				options: opts
			});
			return jsonResult({
				ok: true,
				renamed: resolvedChatGuid,
				displayName
			});
		}
		if (action === "setGroupIcon") {
			const filename = readStringParam(params, "filename") ?? readStringParam(params, "name") ?? "icon.png";
			const resolvedChatGuid = await chatGuid();
			await runtime.setGroupIcon({
				chatGuid: resolvedChatGuid,
				buffer: decodeBase64Buffer(params, action),
				filename,
				options: opts
			});
			return jsonResult({
				ok: true,
				chatGuid: resolvedChatGuid,
				iconSet: true
			});
		}
		if (action === "addParticipant" || action === "removeParticipant") {
			const address = readStringParam(params, "address") ?? readStringParam(params, "participant");
			if (!address) throw new Error(`iMessage ${action} requires address or participant.`);
			const resolvedChatGuid = await chatGuid();
			await runtime[action]({
				chatGuid: resolvedChatGuid,
				address,
				options: opts
			});
			return jsonResult({
				ok: true,
				[action === "addParticipant" ? "added" : "removed"]: address,
				chatGuid: resolvedChatGuid
			});
		}
		if (action === "leaveGroup") {
			const resolvedChatGuid = await chatGuid();
			await runtime.leaveGroup({
				chatGuid: resolvedChatGuid,
				options: opts
			});
			return jsonResult({
				ok: true,
				left: resolvedChatGuid
			});
		}
		if (action === "sendAttachment" || action === "upload-file") {
			const filename = readStringParam(params, "filename", { required: true });
			const asVoice = readBooleanParam(params, "asVoice");
			const resolvedChatGuid = await chatGuid();
			return await completeOutboundBridgeMessage(await withIMessageSendFailureStatus(account.accountId, () => runtime.sendAttachment({
				chatGuid: resolvedChatGuid,
				buffer: decodeBase64Buffer(params, action),
				filename,
				asVoice: asVoice ?? void 0,
				options: opts
			})), resolvedChatGuid);
		}
		if (action === "poll") {
			if (privateApiStatus?.selectors?.pollPayloadMessage !== true) await probePrivateApiStatus(true);
			if (privateApiStatus?.selectors?.pollPayloadMessage !== true) throw new Error("iMessage poll requires an imsg bridge that advertises the pollPayloadMessage selector. Update imsg, run imsg launch to re-inject the bridge, then run openclaw channels status --probe to refresh capability detection.");
			const question = readStringParam(params, "pollQuestion", { required: true });
			const rawChoices = readStringArrayParam(params, "pollOption", { required: true });
			const poll = normalizePollInput({
				question,
				options: rawChoices
			}, { maxOptions: 12 });
			const resolvedChatGuid = await chatGuid();
			return await completeOutboundBridgeMessage(await runtime.sendPoll({
				chatGuid: resolvedChatGuid,
				question: poll.question,
				choices: poll.options,
				options: opts
			}), resolvedChatGuid);
		}
		if (action === "poll-vote") {
			if (privateApiStatus?.selectors?.pollVoteMessage !== true || !imessageRpcSupportsMethod(privateApiStatus, "poll.vote")) await probePrivateApiStatus(true);
			if (privateApiStatus?.selectors?.pollVoteMessage !== true) throw new Error("iMessage poll-vote requires an imsg bridge that advertises the pollVoteMessage selector. Update imsg, run imsg launch to re-inject the bridge, then run openclaw channels status --probe to refresh capability detection.");
			if (!imessageRpcSupportsMethod(privateApiStatus, "poll.vote")) throw new Error("iMessage poll-vote requires an imsg build that advertises the poll.vote capability. Update imsg, then run openclaw channels status --probe to refresh capability detection.");
			const pollRef = readStringParam(params, "pollId") ?? readStringParam(params, "pollGuid") ?? readStringParam(params, "messageId") ?? (toolContext?.currentMessageId != null ? String(toolContext.currentMessageId) : void 0);
			if (!pollRef) throw new Error("iMessage poll-vote requires the poll message id (pollId or messageId).");
			const optionIndex = readPositiveIntegerParam(params, "pollOptionIndex");
			const optionId = readStringParam(params, "pollOptionId");
			const optionText = readStringParam(params, "pollOptionText");
			const selectorCount = [
				optionIndex !== void 0,
				Boolean(optionId),
				Boolean(optionText)
			].filter(Boolean).length;
			if (selectorCount === 0) throw new Error("iMessage poll-vote requires pollOptionIndex, pollOptionId, or pollOptionText.");
			if (selectorCount > 1) throw new Error("iMessage poll-vote requires exactly one of pollOptionIndex, pollOptionId, or pollOptionText.");
			const pollReference = await messageReference({ messageId: pollRef });
			const result = await runtime.sendPollVote({
				chatGuid: pollReference.chatGuid,
				pollGuid: pollReference.messageId,
				optionIndex,
				optionId: optionId ?? void 0,
				optionText: optionText ?? void 0,
				options: opts
			});
			return await completeOutboundBridgeMessage(result, pollReference.chatGuid, result.optionText ? { pollVotedOption: result.optionText } : void 0);
		}
		throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
	}
};
export { resolveIMessageSentEchoEntryKey as _, probeIMessage as a, normalizeIMessageMessageId as b, rememberIMessageReplyCache as c, IMESSAGE_CATCHUP_CURSOR_NAMESPACE as d, IMESSAGE_SENT_ECHOES_NAMESPACE as f, resolveIMessageEchoMediaKey as g, resolveIMessageCatchupCursorKey as h, withIMessageSendFailureStatus as i, resolveIMessageCachedResourceBinding as l, capFailureRetriesMap as m, clearIMessageSendFailure as n, probeIMessagePrivateApi as o, IMESSAGE_SENT_ECHOES_TTL_MS as p, registerIMessageSendStatus as r, isKnownFromMeIMessageTarget as s, imessageMessageActions as t, resolveIMessageMessageId as u, createPersistenceFailureReporter as v, normalizeIMessageGuid as y };
