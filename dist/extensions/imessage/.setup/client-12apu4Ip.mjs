import { u as expandIMessageUserPath } from "./accounts-evTpvJMv.mjs";
import { i as invalidateCachedIMessagePrivateApiStatus } from "./message-tool-api-CqfRxLlT.mjs";
import { t as getIMessageRuntime } from "./runtime-Cza4CY5T.mjs";
import { asNullableRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { createHash } from "node:crypto";
import { runCommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import { resolveUserPath } from "openclaw/plugin-sdk/text-utility-runtime";
import { spawn } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
//#region extensions/imessage/src/chat-context.ts
const EMAIL_HANDLE_PATTERN = /^[^\s@]+@[^\s@]+$/u;
function parseDirectChatIdentity(raw) {
	const trimmed = raw.trim();
	const parts = trimmed.split(";");
	if (parts.length === 3 && parts[1] === "-" && parts[2]) {
		const service = parts[0]?.toLowerCase();
		if (service === "imessage" || service === "sms" || service === "any") {
			const identifier = parts[2];
			return {
				service,
				identifier: EMAIL_HANDLE_PATTERN.test(identifier) ? identifier.toLowerCase() : identifier
			};
		}
	}
	if (parts.length !== 1) return;
	if (trimmed.startsWith("+") || EMAIL_HANDLE_PATTERN.test(trimmed)) return { identifier: trimmed.toLowerCase() };
}
function resolveIMessageDirectChatService(configuredService, chatGuid) {
	if (configuredService === "imessage" || configuredService === "sms") return configuredService;
	const observedService = chatGuid ? parseDirectChatIdentity(chatGuid)?.service : void 0;
	return observedService === "imessage" || observedService === "sms" ? observedService : void 0;
}
function isIMessageEmailChatIdentifier(raw) {
	const identity = parseDirectChatIdentity(raw);
	return Boolean(identity && EMAIL_HANDLE_PATTERN.test(identity.identifier));
}
/**
* Strip the `iMessage;-;` / `SMS;-;` / `any;-;` service prefix that Messages
* uses for direct chats. Different layers report direct DMs in different
* forms, so raw comparison would falsely treat one DM as different chats.
*/
function normalizeDirectChatIdentifier(raw) {
	const trimmed = raw.trim();
	return parseDirectChatIdentity(trimmed)?.identifier ?? trimmed;
}
function chatContextFromIMessageTarget(target, effectiveService) {
	if (target.kind === "chat_id") return { chatId: target.chatId };
	if (target.kind === "chat_guid") return { chatGuid: target.chatGuid };
	if (target.kind === "chat_identifier") return { chatIdentifier: target.chatIdentifier };
	const trimmedHandle = target.to.trim();
	const canonicalHandle = trimmedHandle.startsWith("+") ? normalizeE164(trimmedHandle) : EMAIL_HANDLE_PATTERN.test(trimmedHandle) ? trimmedHandle.toLowerCase() : void 0;
	if (!canonicalHandle) return {};
	const service = target.service === "auto" ? effectiveService : target.service;
	if (service !== "imessage" && service !== "sms") return {};
	return { chatIdentifier: `${service === "sms" ? "SMS" : "iMessage"};-;${canonicalHandle}` };
}
function compareOptional(left, right) {
	return left === void 0 || right === void 0 ? void 0 : left === right;
}
function compareChatSelector(cachedRaw, currentRaw, crossKind = false) {
	const cached = normalizeOptionalString(cachedRaw);
	const current = normalizeOptionalString(currentRaw);
	if (!cached || !current) return;
	if (cached === current) return true;
	const cachedDirect = parseDirectChatIdentity(cached);
	const currentDirect = parseDirectChatIdentity(current);
	if (!cachedDirect || !currentDirect) return crossKind ? void 0 : false;
	if (cachedDirect.identifier !== currentDirect.identifier) return false;
	if (cachedDirect.service === "any") return true;
	if (!cachedDirect.service || !currentDirect.service) return;
	return cachedDirect.service === currentDirect.service;
}
function resolveIMessageChatMatch(cached, current) {
	const comparisons = [
		compareChatSelector(cached.chatGuid, current.chatGuid),
		compareChatSelector(cached.chatIdentifier, current.chatIdentifier),
		compareOptional(cached.chatId, current.chatId),
		compareChatSelector(cached.chatGuid, current.chatIdentifier, true),
		compareChatSelector(cached.chatIdentifier, current.chatGuid, true)
	].filter((comparison) => comparison !== void 0);
	if (comparisons.length === 0) return "unknown";
	return comparisons.every(Boolean) ? "match" : "mismatch";
}
//#endregion
//#region extensions/imessage/src/constants.ts
/** Default timeout for iMessage probe/RPC operations (10 seconds). */
const DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS = 1e4;
const DEFAULT_IMESSAGE_SEND_TIMEOUT_MS = 18e4;
//#endregion
//#region extensions/imessage/src/state-contract.ts
const IMESSAGE_REPLY_CACHE_NAMESPACE = "imessage.reply-cache";
const IMESSAGE_REPLY_CACHE_MAX_ENTRIES = 2e3;
const IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE = "imessage.reply-cache-counter";
const IMESSAGE_REPLY_CACHE_COUNTER_KEY = "short-id-counter";
const IMESSAGE_REPLY_CACHE_TTL_MS = 216e5;
function resolveIMessageReplyCacheEntryKey(messageId) {
	return createHash("sha256").update(messageId, "utf8").digest("hex").slice(0, 32);
}
const MAX_FAILURE_RETRY_MAP_SIZE = 512;
const MAX_FAILURE_RETRY_MAP_JSON_BYTES = 48e3;
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
function capFailureRetriesMap(map, maxSize = MAX_FAILURE_RETRY_MAP_SIZE, maxBytes = MAX_FAILURE_RETRY_MAP_JSON_BYTES) {
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
//#endregion
//#region extensions/imessage/src/monitor-reply-cache.ts
/** Recency window for the "react to the latest message" fallback. */
const LATEST_FALLBACK_MS = 6e5;
let persistenceFailureLogged = false;
function reportPersistenceFailure(scope, err) {
	if (persistenceFailureLogged) return;
	persistenceFailureLogged = true;
	logVerbose(`imessage reply-cache: ${scope} disabled after first failure: ${String(err)}`);
}
const imessageReplyCacheByMessageId = /* @__PURE__ */ new Map();
const imessageShortIdToUuid = /* @__PURE__ */ new Map();
let imessageShortIdCounter = 0;
function openReplyCacheStore() {
	return getIMessageRuntime().state.openKeyedStore({
		namespace: IMESSAGE_REPLY_CACHE_NAMESPACE,
		maxEntries: IMESSAGE_REPLY_CACHE_MAX_ENTRIES
	});
}
function openReplyCacheCounterStore() {
	return getIMessageRuntime().state.openKeyedStore({
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
			const entries = await openReplyCacheStore().entries();
			if (!hydrated) hydrateRows(entries.map(({ value }) => value));
		} catch (err) {
			reportPersistenceFailure("read", err);
		} finally {
			hydrated = true;
		}
	})();
	await hydration;
}
function hydrateFromStoreOnceSync() {
	if (hydrated) return;
	hydrated = true;
	try {
		const state = getIMessageRuntime().state;
		hydrateCounter(state.openSyncKeyedStore({
			namespace: IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE,
			maxEntries: 1
		}).lookup(IMESSAGE_REPLY_CACHE_COUNTER_KEY));
		hydrateRows(state.openSyncKeyedStore({
			namespace: IMESSAGE_REPLY_CACHE_NAMESPACE,
			maxEntries: IMESSAGE_REPLY_CACHE_MAX_ENTRIES
		}).entries().map(({ value }) => value));
	} catch (err) {
		reportPersistenceFailure("read", err);
	}
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
		...typeof entry.chatGuid === "string" ? { chatGuid: entry.chatGuid } : {},
		...typeof entry.chatIdentifier === "string" ? { chatIdentifier: entry.chatIdentifier } : {},
		...typeof entry.chatId === "number" ? { chatId: entry.chatId } : {},
		...typeof entry.isFromMe === "boolean" ? { isFromMe: entry.isFromMe } : {}
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
	for (const [key, value] of imessageReplyCacheByMessageId) {
		if (value.timestamp >= cutoff) break;
		imessageReplyCacheByMessageId.delete(key);
		deletedMessageIds.push(key);
		if (value.shortId) imessageShortIdToUuid.delete(value.shortId);
	}
	while (imessageReplyCacheByMessageId.size > IMESSAGE_REPLY_CACHE_MAX_ENTRIES) {
		const oldest = imessageReplyCacheByMessageId.keys().next().value;
		if (!oldest) break;
		const oldEntry = imessageReplyCacheByMessageId.get(oldest);
		imessageReplyCacheByMessageId.delete(oldest);
		deletedMessageIds.push(oldest);
		if (oldEntry?.shortId) imessageShortIdToUuid.delete(oldEntry.shortId);
	}
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
		if (opts?.requireKnownShortId) {
			if (!hasChatScope(opts.chatContext)) throw new Error(`iMessage short message id ${describeMessageIdForError(trimmed, "short")} requires a chat scope (chatGuid / chatIdentifier / chatId or a target).`);
			throw new Error(`iMessage short message id ${describeMessageIdForError(trimmed, "short")} is no longer available. Use MessageSidFull.`);
		}
		return trimmed;
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
	const isKnownFromMe = params.isKnownFromMeMessageId ?? isKnownFromMeIMessageMessageId;
	for (const messageId of params.messageIds) if (await isKnownFromMe(messageId, ctx)) return true;
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
/** @deprecated Used only by hosts without asynchronous conversation matching. */
function isIMessageCurrentMessageInChat(params) {
	hydrateFromStoreOnceSync();
	return isCurrentMessageInChat(params);
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
//#endregion
//#region extensions/imessage/src/cli-output.ts
const IMESSAGE_CLI_STDOUT_MAX_BYTES = 8388608;
const IMESSAGE_CLI_STDERR_TAIL_BYTES = 65536;
function parseLastJsonObject(stdout) {
	const last = stdout.split(/\r?\n/u).findLast((line) => line.trim().length > 0)?.trim();
	if (!last) return null;
	try {
		return asNullableRecord(JSON.parse(last));
	} catch {
		return null;
	}
}
async function runIMessageCliJsonCommand(params) {
	const dbPath = params.dbPath?.trim();
	const argv = [
		expandIMessageUserPath(params.cliPath),
		...params.args,
		...dbPath ? ["--db", dbPath] : [],
		"--json"
	];
	const result = await runCommandWithTimeout(argv, {
		killProcessTree: true,
		maxOutputBytes: {
			stdout: IMESSAGE_CLI_STDOUT_MAX_BYTES,
			stderr: IMESSAGE_CLI_STDERR_TAIL_BYTES
		},
		outputCapture: {
			stdout: "head",
			stderr: "tail"
		},
		terminateOnOutputLimit: { stdout: true },
		timeoutMs: params.timeoutMs
	});
	if (result.termination === "timeout") throw new Error(`iMessage action timed out after ${params.timeoutMs}ms`);
	if (result.outputLimitExceeded || result.stdoutTruncatedBytes) throw new Error(`imsg stdout exceeded ${IMESSAGE_CLI_STDOUT_MAX_BYTES} bytes`);
	const parsed = parseLastJsonObject(result.stdout);
	if (result.code !== 0) {
		const detail = typeof parsed?.error === "string" && parsed.error.trim() || result.stderr.trim() || result.stdout.trim() || `imsg exited with code ${result.code}`;
		throw new Error(detail);
	}
	if (!parsed) throw new Error(`imsg returned non-JSON output: ${result.stdout.trim() || result.stderr.trim()}`);
	if (parsed.success === false) {
		const detail = typeof parsed.error === "string" && parsed.error.trim() ? parsed.error.trim() : "iMessage action failed";
		throw new Error(detail);
	}
	return parsed;
}
//#endregion
//#region extensions/imessage/src/bridge-recovery.ts
const BRIDGE_RECOVERY_TIMEOUT_MS = 3e4;
const recoveries = /* @__PURE__ */ new Map();
/**
* Re-inject the private bridge after imsg has positively identified it as
* unresponsive. This deliberately does not retry the failed mutation: imsg may
* still reconcile a published send, so replaying it could duplicate a message.
*/
function recoverIMessageBridge(cliPath) {
	const existing = recoveries.get(cliPath);
	if (existing) return existing;
	const recovery = runIMessageCliJsonCommand({
		cliPath,
		args: ["launch"],
		timeoutMs: BRIDGE_RECOVERY_TIMEOUT_MS
	}).then(() => void 0).finally(() => {
		recoveries.delete(cliPath);
	});
	recoveries.set(cliPath, recovery);
	return recovery;
}
//#endregion
//#region extensions/imessage/src/client.ts
const IMSG_APPLE_FRAMEWORK_STDERR_PATTERN = /^(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+ imsg\[\d+:\d+\] )?Could not fetch group for change type \d+ with identifier [^:]+:ABGroup, making it a delete change type\.$/u;
var IMessageRpcRequestError = class extends Error {
	constructor(message, code, data) {
		super(message);
		this.code = code;
		this.data = data;
		this.name = "IMessageRpcRequestError";
	}
};
function isIMessageBridgeStall(error) {
	return error instanceof Error && error.message.includes("Timed out waiting for response");
}
const BRIDGE_STALL_GUIDANCE = "The imsg private API bridge stopped responding. Run `imsg launch` to re-inject the dylib, then `openclaw channels status --probe` to refresh capability detection.";
function describeIMessageBridgeStall(error) {
	if (error instanceof IMessageRpcRequestError) return new IMessageRpcRequestError(`${error.message} ${BRIDGE_STALL_GUIDANCE}`, error.code, error.data);
	if (error instanceof Error) return new Error(`${error.message} ${BRIDGE_STALL_GUIDANCE}`, { cause: error });
	return error;
}
const PUBLIC_IMESSAGE_FULL_DISK_ACCESS_ERROR = "imsg cannot access ~/Library/Messages/chat.db. Grant Full Disk Access to the Gateway/launcher process and restart Gateway.";
const IMESSAGE_RPC_CLOSE_GRACE_MS = 500;
function isTestEnv() {
	const vitest = normalizeLowercaseStringOrEmpty(process.env.VITEST);
	return Boolean(vitest);
}
function normalizeIMessageFullDiskAccessError(message) {
	const normalized = normalizeLowercaseStringOrEmpty(message);
	if (!normalized.includes("full disk access") || !normalized.includes("chat.db")) return;
	return PUBLIC_IMESSAGE_FULL_DISK_ACCESS_ERROR;
}
function createLfLineFramer(onLine) {
	const decoder = new StringDecoder("utf8");
	let buffer = "";
	return {
		write(chunk) {
			buffer += typeof chunk === "string" ? chunk : decoder.write(chunk);
			let newlineIndex = buffer.indexOf("\n");
			while (newlineIndex !== -1) {
				const line = buffer.slice(0, newlineIndex);
				buffer = buffer.slice(newlineIndex + 1);
				onLine(line);
				newlineIndex = buffer.indexOf("\n");
			}
		},
		flush() {
			buffer += decoder.end();
			if (!buffer) return;
			const line = buffer;
			buffer = "";
			onLine(line);
		}
	};
}
var IMessageRpcClient = class {
	constructor(opts = {}) {
		this.pending = /* @__PURE__ */ new Map();
		this.terminalResolve = null;
		this.reapedResolve = null;
		this.isReaped = false;
		this.child = null;
		this.stopPromise = null;
		this.stdoutFramer = createLfLineFramer((line) => this.handleStdoutLine(line));
		this.stderrFramer = createLfLineFramer((line) => this.handleStderrLine(line));
		this.nextId = 1;
		this.publicProcessError = null;
		this.configuredCliPath = opts.cliPath?.trim() || "imsg";
		this.cliPath = expandIMessageUserPath(this.configuredCliPath);
		const dbPath = opts.dbPath?.trim();
		this.dbPath = dbPath ? opts.remoteHost?.trim() ? dbPath : resolveUserPath(dbPath) : void 0;
		this.runtime = opts.runtime;
		this.onNotification = opts.onNotification;
		this.terminal = new Promise((resolve) => {
			this.terminalResolve = resolve;
		});
		this.reaped = new Promise((resolve) => {
			this.reapedResolve = resolve;
		});
	}
	async start() {
		if (this.child) return;
		if (isTestEnv()) throw new Error("Refusing to start imsg rpc in test environment; mock iMessage RPC client");
		const args = ["rpc", "--json"];
		if (this.dbPath) args.push("--db", this.dbPath);
		const child = spawn(this.cliPath, args, { stdio: [
			"pipe",
			"pipe",
			"pipe"
		] });
		this.child = child;
		child.stdout.on("data", (chunk) => {
			if (this.child !== child) return;
			this.stdoutFramer.write(chunk);
		});
		child.stderr?.on("data", (chunk) => {
			if (this.child !== child) return;
			this.stderrFramer.write(chunk);
		});
		const failFromProcessError = (err) => this.failTransport(err, child);
		child.on("error", failFromProcessError);
		for (const stream of [
			child.stdin,
			child.stdout,
			child.stderr
		]) {
			stream.on("error", failFromProcessError);
			stream.once("close", () => {
				const error = stream.errored;
				if (error) failFromProcessError(error);
			});
		}
		child.on("close", (code, signal) => {
			if (this.child === child) {
				this.stdoutFramer.flush();
				this.stderrFramer.flush();
				this.child = null;
			}
			this.finish(this.buildCloseError(code, signal));
			this.markReaped();
		});
	}
	async stop() {
		if (this.stopPromise) return await this.stopPromise;
		const child = this.child;
		if (!child) return;
		this.stopPromise = this.stopChild(child);
		return await this.stopPromise;
	}
	async waitForClose() {
		throw await this.terminal;
	}
	async request(method, params, opts) {
		if (!this.child || !this.child.stdin) throw new Error("imsg rpc not running");
		const id = this.nextId++;
		const line = `${JSON.stringify({
			jsonrpc: "2.0",
			id,
			method,
			params: params ?? {}
		})}\n`;
		const timeoutMs = opts?.timeoutMs ?? 1e4;
		const response = new Promise((resolve, reject) => {
			const key = String(id);
			const timer = timeoutMs > 0 ? setTimeout(() => {
				this.pending.delete(key);
				reject(/* @__PURE__ */ new Error(`imsg rpc timeout (${method})`));
			}, timeoutMs) : void 0;
			this.pending.set(key, {
				resolve: (value) => resolve(value),
				reject,
				timer
			});
		});
		try {
			this.child.stdin.write(line, (err) => {
				if (err) this.failTransport(err, this.child);
			});
		} catch (err) {
			this.failTransport(err, this.child);
		}
		try {
			return await response;
		} catch (err) {
			if (isIMessageBridgeStall(err)) {
				invalidateCachedIMessagePrivateApiStatus(this.configuredCliPath);
				try {
					await recoverIMessageBridge(this.configuredCliPath);
				} catch (recoveryError) {
					this.runtime?.error?.(`imessage: automatic bridge recovery failed: ${formatErrorMessage(recoveryError)}`);
				}
				throw describeIMessageBridgeStall(err);
			}
			throw err;
		}
	}
	async stopChild(child) {
		try {
			child.stdin.end();
		} catch (err) {
			this.failTransport(err, child);
		}
		if (await this.waitForReap(IMESSAGE_RPC_CLOSE_GRACE_MS)) return;
		this.signalChild(child, "SIGTERM");
		if (await this.waitForReap(IMESSAGE_RPC_CLOSE_GRACE_MS)) return;
		this.signalChild(child, "SIGKILL");
		if (!await this.waitForReap(IMESSAGE_RPC_CLOSE_GRACE_MS)) throw new Error("imsg rpc did not exit after SIGKILL");
	}
	async waitForReap(timeoutMs) {
		if (this.isReaped) return true;
		return await raceWithTimeout(this.reaped.then(() => true), timeoutMs, () => false);
	}
	signalChild(child, signal) {
		try {
			child.kill(signal);
		} catch {}
	}
	failTransport(err, child) {
		if (!this.finish(err instanceof Error ? err : new Error(String(err)))) return;
		if (child) this.signalChild(child, "SIGTERM");
	}
	handleStdoutLine(line) {
		const trimmed = line.trim();
		if (!trimmed) return;
		this.handleLine(trimmed);
	}
	handleStderrLine(line) {
		const trimmed = line.trim();
		if (!trimmed) return;
		this.recordProcessDiagnostic(trimmed);
		if (IMSG_APPLE_FRAMEWORK_STDERR_PATTERN.test(trimmed)) {
			logVerbose(`imsg rpc: ${trimmed}`);
			return;
		}
		this.runtime?.error?.(`imsg rpc: ${trimmed}`);
	}
	handleLine(line) {
		let parsed;
		try {
			parsed = JSON.parse(line);
		} catch (err) {
			this.recordProcessDiagnostic(line);
			const detail = formatErrorMessage(err);
			this.runtime?.error?.(`imsg rpc: failed to parse ${line}: ${detail}`);
			return;
		}
		if (parsed.id !== void 0 && parsed.id !== null) {
			const key = String(parsed.id);
			const pending = this.pending.get(key);
			if (!pending) return;
			if (pending.timer) clearTimeout(pending.timer);
			this.pending.delete(key);
			if (parsed.error) {
				const baseMessage = parsed.error.message ?? "imsg rpc error";
				const details = parsed.error.data;
				const code = parsed.error.code;
				const suffixes = [];
				if (typeof code === "number") suffixes.push(`code=${code}`);
				if (details !== void 0) {
					const detailText = typeof details === "string" ? details : JSON.stringify(details, null, 2);
					if (detailText) suffixes.push(detailText);
				}
				const msg = suffixes.length > 0 ? `${baseMessage}: ${suffixes.join(" ")}` : baseMessage;
				pending.reject(new IMessageRpcRequestError(msg, typeof code === "number" ? code : void 0, details));
				return;
			}
			pending.resolve(parsed.result);
			return;
		}
		if (parsed.method) this.onNotification?.({
			method: parsed.method,
			params: parsed.params
		});
	}
	recordProcessDiagnostic(line) {
		this.publicProcessError ??= normalizeIMessageFullDiskAccessError(line) ?? null;
	}
	buildCloseError(code, signal) {
		if (this.publicProcessError) return new Error(this.publicProcessError);
		if (code !== 0 && code !== null) {
			const reason = signal ? `signal ${signal}` : `code ${code}`;
			return /* @__PURE__ */ new Error(`imsg rpc exited (${reason})`);
		}
		return /* @__PURE__ */ new Error("imsg rpc closed");
	}
	failAll(err) {
		for (const [key, pending] of this.pending.entries()) {
			if (pending.timer) clearTimeout(pending.timer);
			pending.reject(err);
			this.pending.delete(key);
		}
	}
	finish(err) {
		const resolve = this.terminalResolve;
		if (!resolve) return false;
		this.terminalResolve = null;
		this.failAll(err);
		resolve(err);
		return true;
	}
	markReaped() {
		if (this.isReaped) return;
		this.isReaped = true;
		const resolve = this.reapedResolve;
		this.reapedResolve = null;
		resolve?.();
	}
};
async function createIMessageRpcClient(opts = {}) {
	const client = new IMessageRpcClient(opts);
	await client.start();
	return client;
}
//#endregion
export { resolveIMessageDirectChatService as C, normalizeDirectChatIdentifier as S, resolveIMessageSentEchoEntryKey as _, isIMessageCurrentMessageInChat as a, chatContextFromIMessageTarget as b, rememberIMessageReplyCache as c, IMESSAGE_CATCHUP_CURSOR_NAMESPACE as d, IMESSAGE_SENT_ECHOES_NAMESPACE as f, resolveIMessageEchoMediaKey as g, resolveIMessageCatchupCursorKey as h, findLatestIMessageEntryForChat as i, resolveIMessageCachedResourceBinding as l, capFailureRetriesMap as m, createIMessageRpcClient as n, isIMessageCurrentMessageInChatAsync as o, IMESSAGE_SENT_ECHOES_TTL_MS as p, runIMessageCliJsonCommand as r, isKnownFromMeIMessageTarget as s, IMessageRpcRequestError as t, resolveIMessageMessageId as u, DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS as v, isIMessageEmailChatIdentifier as x, DEFAULT_IMESSAGE_SEND_TIMEOUT_MS as y };
