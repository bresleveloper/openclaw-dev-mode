import { u as expandIMessageUserPath } from "./accounts-CUxZrTcY.mjs";
import { i as invalidateCachedIMessagePrivateApiStatus } from "./message-tool-api-pvlcOJPG.mjs";
import { t as getIMessageRuntime } from "./runtime-Cza4CY5T.mjs";
import { a as IMESSAGE_REPLY_CACHE_NAMESPACE, f as resolveIMessageReplyCacheEntryKey, i as IMESSAGE_REPLY_CACHE_MAX_ENTRIES, n as IMESSAGE_REPLY_CACHE_COUNTER_KEY, o as IMESSAGE_REPLY_CACHE_TTL_MS, r as IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE } from "./state-contract-DvahEY4X.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { runCommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import { resolveUserPath } from "openclaw/plugin-sdk/text-utility-runtime";
import { spawn } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { FormatCapabilityProfile, findCodeRegions, isInsideCode, markdownToIR, renderMarkdownWithAttributedRanges, sanitizeAssistantVisibleText, stripMarkdown, tokenizeHtmlTags } from "openclaw/plugin-sdk/text-chunking";
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
	const canonicalHandle = trimmedHandle.startsWith("+") ? normalizeE164(trimmedHandle) : /^[^\s@]+@[^\s@]+$/u.test(trimmedHandle) ? trimmedHandle.toLowerCase() : void 0;
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
	const cachedChatGuid = normalizeOptionalString(cached.chatGuid);
	const currentChatGuid = normalizeOptionalString(current.chatGuid);
	const cachedChatIdentifier = normalizeOptionalString(cached.chatIdentifier);
	const currentChatIdentifier = normalizeOptionalString(current.chatIdentifier);
	const comparisons = [
		compareChatSelector(cachedChatGuid, currentChatGuid),
		compareChatSelector(cachedChatIdentifier, currentChatIdentifier),
		compareOptional(cached.chatId, current.chatId),
		compareChatSelector(cachedChatGuid, currentChatIdentifier, true),
		compareChatSelector(cachedChatIdentifier, currentChatGuid, true)
	].filter((comparison) => comparison !== void 0);
	if (comparisons.length === 0) return "unknown";
	return comparisons.every(Boolean) ? "match" : "mismatch";
}
function isPositiveIMessageChatMatch(cached, current) {
	return resolveIMessageChatMatch(cached, current) === "match";
}
//#endregion
//#region extensions/imessage/src/constants.ts
/** Default timeout for iMessage probe/RPC operations (10 seconds). */
const DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS = 1e4;
const DEFAULT_IMESSAGE_SEND_TIMEOUT_MS = 18e4;
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
const imessageUuidToShortId = /* @__PURE__ */ new Map();
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
	for (const entry of entries.filter((cached) => cached.timestamp >= cutoff).toSorted((a, b) => a.timestamp - b.timestamp).slice(-IMESSAGE_REPLY_CACHE_MAX_ENTRIES)) {
		const numeric = Number.parseInt(entry.shortId, 10);
		if (Number.isFinite(numeric) && numeric > imessageShortIdCounter) imessageShortIdCounter = numeric;
		imessageReplyCacheByMessageId.set(entry.messageId, entry);
		imessageShortIdToUuid.set(entry.shortId, entry.messageId);
		imessageUuidToShortId.set(entry.messageId, entry.shortId);
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
function generateShortId() {
	imessageShortIdCounter += 1;
	return String(imessageShortIdCounter);
}
async function rememberIMessageReplyCache(entry) {
	await hydrateFromStoreOnce();
	const messageId = entry.messageId.trim();
	if (!messageId) return {
		...entry,
		shortId: ""
	};
	let shortId = imessageUuidToShortId.get(messageId);
	const isNewMessage = !shortId;
	if (!shortId) {
		shortId = generateShortId();
		imessageShortIdToUuid.set(shortId, messageId);
		imessageUuidToShortId.set(messageId, shortId);
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
		if (value.shortId) {
			imessageShortIdToUuid.delete(value.shortId);
			imessageUuidToShortId.delete(key);
		}
	}
	while (imessageReplyCacheByMessageId.size > IMESSAGE_REPLY_CACHE_MAX_ENTRIES) {
		const oldest = imessageReplyCacheByMessageId.keys().next().value;
		if (!oldest) break;
		const oldEntry = imessageReplyCacheByMessageId.get(oldest);
		imessageReplyCacheByMessageId.delete(oldest);
		deletedMessageIds.push(oldest);
		if (oldEntry?.shortId) {
			imessageShortIdToUuid.delete(oldEntry.shortId);
			imessageUuidToShortId.delete(oldest);
		}
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
function isCrossChatMismatch(cached, ctx) {
	return resolveIMessageChatMatch(cached, ctx) === "mismatch";
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
	if (/^\d+$/.test(trimmed)) {
		const uuid = imessageShortIdToUuid.get(trimmed);
		if (uuid) {
			const cached = imessageReplyCacheByMessageId.get(uuid);
			if (opts?.chatContext && hasChatScope(opts.chatContext)) {
				if (cached && isCrossChatMismatch(cached, opts.chatContext)) throw buildCrossChatError(trimmed, "short", cached, opts.chatContext);
			}
			if (opts?.requireFromMe && cached?.isFromMe !== true) throw buildFromMeError(trimmed, "short");
			return uuid;
		}
		if (opts?.requireKnownShortId && !hasChatScope(opts.chatContext)) throw new Error(`iMessage short message id ${describeMessageIdForError(trimmed, "short")} requires a chat scope (chatGuid / chatIdentifier / chatId or a target).`);
		if (opts?.requireKnownShortId) throw new Error(`iMessage short message id ${describeMessageIdForError(trimmed, "short")} is no longer available. Use MessageSidFull.`);
		return trimmed;
	}
	const cached = imessageReplyCacheByMessageId.get(trimmed);
	if (opts?.chatContext) {
		if (cached && isCrossChatMismatch(cached, opts.chatContext)) throw buildCrossChatError(trimmed, "uuid", cached, opts.chatContext);
	}
	if (opts?.requireFromMe && cached?.isFromMe !== true) throw buildFromMeError(trimmed, "uuid");
	return trimmed;
}
async function isKnownFromMeIMessageMessageId(messageId, ctx) {
	const trimmed = normalizeOptionalString(messageId);
	if (!trimmed || !ctx.accountId || !hasChatScope(ctx)) return false;
	await hydrateFromStoreOnce();
	const cached = imessageReplyCacheByMessageId.get(trimmed);
	if (!cached || cached.isFromMe !== true || cached.accountId !== ctx.accountId) return false;
	return isPositiveIMessageChatMatch(cached, ctx);
}
function buildFromMeError(inputId, inputKind) {
	return /* @__PURE__ */ new Error(`iMessage message id ${describeMessageIdForError(inputId, inputKind)} is not one this agent sent. edit and unsend can only target messages the gateway delivered itself; messages received from other participants cannot be modified.`);
}
/**
* Return the most recent cached entry whose chat scope matches the supplied
* context. Used as a fallback when an agent calls a per-message action (e.g.
* `react`) without specifying a `messageId` — the natural intent is "react
* to the message I just received in this chat."
*
* Strict semantics for safety:
*  - Caller must supply a chat scope. We refuse to "guess" the active chat.
*  - Cached entry must positively match on at least one identifier kind
*    (chatGuid, chatIdentifier, chatId, or normalized direct-DM fingerprint).
*    We do NOT fall through on "no overlapping identifier" — that's how a
*    cached entry from a foreign chat could be returned when the caller's
*    context didn't share any identifier kind with the cache.
*  - Caller must supply an accountId; we never cross account boundaries.
*  - We only consider entries newer than `LATEST_FALLBACK_MS`. The intent
*    of "react to the latest" is "the message I just received," not
*    "anything in this chat from any time."
*/
function findLatestIMessageEntryForChat(ctx) {
	if (!hasChatScope(ctx)) return;
	if (!ctx.accountId) return;
	const cutoff = Date.now() - LATEST_FALLBACK_MS;
	let best;
	for (const entry of imessageReplyCacheByMessageId.values()) {
		if (entry.accountId !== ctx.accountId) continue;
		if (entry.timestamp < cutoff) continue;
		if (!isPositiveIMessageChatMatch(entry, ctx)) continue;
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
	const chatMatch = resolveIMessageChatMatch(entry, ctx);
	if (chatMatch !== "match") return chatMatch;
	return "match";
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
		const value = JSON.parse(last);
		return value && typeof value === "object" && !Array.isArray(value) ? value : null;
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
var IMessageRpcRequestError = class extends Error {
	constructor(message, code, data) {
		super(message);
		this.code = code;
		this.data = data;
		this.name = "IMessageRpcRequestError";
	}
};
function isIMessageBridgeStall(error) {
	if (!(error instanceof Error)) return false;
	return error.message.includes("Timed out waiting for response");
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
		let timer;
		try {
			return await Promise.race([this.reaped.then(() => true), new Promise((resolve) => {
				timer = setTimeout(() => resolve(false), timeoutMs);
			})]);
		} finally {
			if (timer) clearTimeout(timer);
		}
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
//#region extensions/imessage/src/markdown-format.ts
const IMESSAGE_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "ranges",
	constructs: {
		spoiler: "strip",
		codeInline: "fallback",
		codeBlock: "fallback",
		codeLanguage: "strip",
		linkLabel: "fallback",
		heading: "fallback",
		bulletList: "fallback",
		orderedList: "fallback",
		taskList: "fallback",
		table: "fallback",
		blockquote: "fallback",
		image: "fallback",
		mention: "strip"
	},
	chunk: {
		limit: 4e3,
		unit: "utf16"
	}
});
const IMESSAGE_CODE_PROFILE = FormatCapabilityProfile.define({
	...IMESSAGE_FORMAT_PROFILE,
	constructs: {
		...IMESSAGE_FORMAT_PROFILE.constructs,
		codeInline: "native"
	}
});
const IMESSAGE_STYLE_MAP = {
	bold: "bold",
	italic: "italic",
	underline: "underline",
	strikethrough: "strikethrough"
};
function codeDelimiter(content) {
	const longestRun = Math.max(0, ...[...content.matchAll(/`+/gu)].map((match) => match[0].length));
	return "`".repeat(longestRun + 1);
}
function restoreCodeMarkers(text, ranges, codeRanges) {
	if (codeRanges.length === 0) return {
		text,
		ranges
	};
	let rendered = "";
	let cursor = 0;
	const edits = codeRanges.map((range) => {
		const end = range.start + range.length;
		const content = text.slice(range.start, end);
		const marker = codeDelimiter(content);
		const padding = content.startsWith("`") || content.endsWith("`") ? " " : "";
		rendered += text.slice(cursor, range.start) + `${marker}${padding}${content}${padding}${marker}`;
		cursor = end;
		return {
			end,
			shift: rendered.length - end
		};
	});
	rendered += text.slice(cursor);
	const mapOffset = (offset) => {
		let low = 0;
		let high = edits.length;
		while (low < high) {
			const middle = low + Math.floor((high - low) / 2);
			const edit = edits[middle];
			if (edit && edit.end <= offset) low = middle + 1;
			else high = middle;
		}
		return offset + (edits[low - 1]?.shift ?? 0);
	};
	return {
		text: rendered,
		ranges: ranges.map((range) => {
			const start = mapOffset(range.start);
			return {
				...range,
				start,
				length: mapOffset(range.start + range.length) - start
			};
		})
	};
}
function extractMarkdownFormatRuns(input) {
	const ir = markdownToIR(input, {
		autolink: false,
		enableHtmlUnderline: true,
		headingStyle: "rich",
		linkify: false,
		preserveDunderIdentifiers: true,
		preserveSourceBlockSpacing: true
	});
	const rendered = renderMarkdownWithAttributedRanges(ir, { styleMap: IMESSAGE_STYLE_MAP }, IMESSAGE_FORMAT_PROFILE);
	const codeRanges = ir.styles.some((span) => span.style === "code") ? renderMarkdownWithAttributedRanges(ir, { styleMap: { code: "code" } }, IMESSAGE_CODE_PROFILE).ranges : [];
	return restoreCodeMarkers(rendered.text, rendered.ranges.map(({ start, length, style }) => ({
		start,
		length,
		styles: [style]
	})), codeRanges);
}
//#endregion
//#region extensions/imessage/src/monitor/sanitize-outbound.ts
/**
* Patterns that indicate assistant-internal metadata leaked into text.
* These must never reach a user-facing channel.
*/
const INTERNAL_SEPARATOR_RE = /(?:#\+){2,}#?/g;
const ASSISTANT_ROLE_MARKER_RE = /\bassistant\s+to\s*=\s*\w+/gi;
const ROLE_TURN_MARKER_RE = /^[ \t]*(?:>[ \t]*)*(?:user|system|assistant)[ \t]*:[ \t]*(?=\r?$)/gim;
const FENCED_ROLE_MARKER_RE = /^[ \t]*(user|system|assistant)[ \t]*:[ \t]*(?=\r?$)/gim;
const FINAL_PRIVATE_MARKER_RE = /(?:#\+){2,}#?|\bassistant\s+to\s*=\s*\w+|^[ \t]*(?:user|system|assistant)[ \t]*:[ \t]*(?=\r?$)/gim;
const PRIVATE_USE_START = 57344;
const PRIVATE_USE_END = 63743;
const MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES = 32;
const PLAIN_TEXT_HTML_TAG_RE = /<\/?[a-z][a-z0-9_.:-]*(?=[\s/>])[^>]*>/gi;
const PRIVATE_PROVIDER_TAG_NAMES = [
	"think",
	"thinking",
	"thought",
	"reasoning",
	"antthinking",
	"antml:think",
	"antml:thinking",
	"antml:thought",
	"antml:reasoning",
	"mm:think",
	"mm:thinking",
	"mm:thought",
	"mm:reasoning",
	"relevant_memories",
	"relevant-memories",
	"tool_call",
	"tool_result",
	"function_call",
	"function_calls",
	"function_response",
	"function",
	"tool_calls",
	"antml:invoke",
	"antml:parameter",
	"invoke",
	"parameter"
];
const PRIVATE_PROVIDER_TAG_NAME_SET = new Set(PRIVATE_PROVIDER_TAG_NAMES);
const OPAQUE_PRIVATE_RUNTIME_CONTEXT_BLOCK_RE = /^<<<BEGIN_OPENCLAW_INTERNAL_CONTEXT>>>(?:(?!<<<BEGIN_OPENCLAW_INTERNAL_CONTEXT>>>)[\s\S])*<<<END_OPENCLAW_INTERNAL_CONTEXT>>>/;
const PRIVATE_RUNTIME_CONTEXT_BLOCK_RE = /<<<BEGIN_OPENCLAW_INTERNAL_CONTEXT>>>(?:(?!<<<BEGIN_OPENCLAW_INTERNAL_CONTEXT>>>)[\s\S])*<<<END_OPENCLAW_INTERNAL_CONTEXT>>>/g;
const NESTED_PRIVATE_MARKUP_START_RE = /<<<BEGIN_OPENCLAW_INTERNAL_CONTEXT>>>|<\s*\/?\s*[A-Za-z][A-Za-z0-9_.:-]*(?=\s|\/?>)/g;
const OUTER_PRIVATE_TAG_FRAGMENT_RE = /^\s*\/?\s*([a-z][a-z0-9_.:-]*)?$/i;
const OPAQUE_PRIVATE_MARKUP_BLOCK_RE = /^<\s*(system-reminder|previous_response|details|summary)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/i;
const REMOVABLE_PRIVATE_MARKUP_TAG_RE = /^<\s*\/?\s*[a-z][a-z0-9_.:-]*(?=\s|\/?>)[^>]*>/i;
const PRIVATE_PROVIDER_TAG_FRAGMENT_RE = /^[a-z0-9_.:-]*/i;
const PRIVATE_RUNTIME_SCAFFOLDING_TAG_TOKEN_RE = /<\s*(\/?)\s*(system-reminder|previous_response)\b/gi;
function assertSafeIMessageOutboundMarkup(text) {
	for (const nested of text.matchAll(NESTED_PRIVATE_MARKUP_START_RE)) {
		const nestedStart = nested.index ?? 0;
		const outerStart = text.lastIndexOf("<", nestedStart - 1);
		if (outerStart < 0) continue;
		const outer = OUTER_PRIVATE_TAG_FRAGMENT_RE.exec(text.slice(outerStart + 1, nestedStart));
		if (!outer) continue;
		let candidate = (outer[1] ?? "").toLowerCase();
		if (!PRIVATE_PROVIDER_TAG_NAMES.some((name) => name.startsWith(candidate))) continue;
		let cursor = nestedStart;
		for (let depth = 0; depth < MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES; depth += 1) {
			const remaining = text.slice(cursor);
			const removed = OPAQUE_PRIVATE_RUNTIME_CONTEXT_BLOCK_RE.exec(remaining)?.[0] ?? OPAQUE_PRIVATE_MARKUP_BLOCK_RE.exec(remaining)?.[0] ?? REMOVABLE_PRIVATE_MARKUP_TAG_RE.exec(remaining)?.[0];
			if (!removed) break;
			cursor += removed.length;
			const suffix = PRIVATE_PROVIDER_TAG_FRAGMENT_RE.exec(text.slice(cursor))?.[0] ?? "";
			candidate += suffix.toLowerCase();
			cursor += suffix.length;
			if (PRIVATE_PROVIDER_TAG_NAME_SET.has(candidate) && /[\s/>]/.test(text.charAt(cursor))) throw new Error("iMessage outbound ambiguous nested HTML is not allowed");
			if (!PRIVATE_PROVIDER_TAG_NAMES.some((name) => name.startsWith(candidate))) break;
			if (depth + 1 >= MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES && (OPAQUE_PRIVATE_RUNTIME_CONTEXT_BLOCK_RE.test(text.slice(cursor)) || REMOVABLE_PRIVATE_MARKUP_TAG_RE.test(text.slice(cursor)))) throw new Error("iMessage outbound runtime scaffolding exceeded its limit");
		}
	}
}
function stripIMessageBalancedPrivateRuntimeBlocks(text, verifyProtectedRoles) {
	const openBlocks = [];
	const completedBlocks = [];
	const codeRegions = findCodeRegions(text);
	const parsedHtmlTags = [...tokenizeHtmlTags(text)];
	const htmlTags = parsedHtmlTags.map(({ start, end }) => ({
		start,
		end,
		terminated: true
	}));
	const rawTextHtml = [];
	const rawTextTagNames = /* @__PURE__ */ new Set([
		"script",
		"style",
		"textarea",
		"title",
		"xmp",
		"iframe",
		"noembed",
		"noframes",
		"noscript",
		"plaintext"
	]);
	for (const [index, opener] of parsedHtmlTags.entries()) {
		if (opener.closing || !rawTextTagNames.has(opener.name)) continue;
		const closing = opener.name === "plaintext" ? void 0 : parsedHtmlTags.slice(index + 1).find((candidate) => {
			return candidate.closing && candidate.name === opener.name;
		});
		rawTextHtml.push({
			start: opener.start,
			end: closing?.end ?? text.length,
			terminated: Boolean(closing)
		});
		if (rawTextHtml.length > MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES ** 2) throw new Error("iMessage outbound runtime scaffolding exceeded its limit");
	}
	const opaqueHtml = [];
	for (let cursor = 0; cursor < text.length;) {
		const start = text.indexOf("<", cursor);
		if (start < 0) break;
		const enclosingTag = htmlTags.find((tag) => tag.start < start && start < tag.end);
		if (enclosingTag) {
			cursor = enclosingTag.end;
			continue;
		}
		let end = -1;
		let delimiterLength = 0;
		if (text.startsWith("<!--", start)) {
			end = text.indexOf("-->", start + 4);
			delimiterLength = 3;
		} else if (/^<!\[CDATA\[/i.test(text.slice(start, start + 9))) {
			end = text.indexOf("]]>", start + 9);
			delimiterLength = 3;
		} else if (text.startsWith("<?", start)) {
			let quote;
			for (let index = start + 2; index < text.length - 1; index += 1) {
				const character = text[index];
				if (quote) {
					if (character === quote) quote = void 0;
				} else if (character === "'" || character === "\"") quote = character;
				else if (character === "?" && text[index + 1] === ">") {
					end = index;
					delimiterLength = 2;
					break;
				}
			}
		} else if (/^<![a-z][a-z0-9_.:-]*\b/i.test(text.slice(start))) {
			let quote;
			let bracketDepth = 0;
			for (let index = start + 2; index < text.length; index += 1) {
				const character = text[index];
				if (quote) {
					if (character === quote) quote = void 0;
				} else if (character === "'" || character === "\"") quote = character;
				else if (character === "[") bracketDepth += 1;
				else if (character === "]" && bracketDepth > 0) bracketDepth -= 1;
				else if (character === ">" && bracketDepth === 0) {
					end = index;
					delimiterLength = 1;
					break;
				}
			}
		} else if (text.startsWith("<!", start) || text.startsWith("</", start) && start + 2 < text.length && !/[A-Za-z>]/.test(text[start + 2] ?? "")) {
			end = text.indexOf(">", start + 2);
			delimiterLength = 1;
		} else {
			cursor = start + 1;
			continue;
		}
		if (opaqueHtml.length >= MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES ** 2) throw new Error("iMessage outbound runtime scaffolding exceeded its limit");
		const terminated = end >= 0;
		const regionEnd = terminated ? end + delimiterLength : text.length;
		opaqueHtml.push({
			start,
			end: regionEnd,
			terminated
		});
		cursor = regionEnd;
	}
	htmlTags.push(...opaqueHtml);
	htmlTags.sort((left, right) => left.start - right.start || right.end - left.end);
	let htmlTagIndex = 0;
	let scannedTags = 0;
	let scannedThrough = 0;
	for (const token of text.matchAll(PRIVATE_RUNTIME_SCAFFOLDING_TAG_TOKEN_RE)) {
		const start = token.index ?? 0;
		if (start < scannedThrough) continue;
		while ((htmlTags[htmlTagIndex]?.end ?? 0) <= start && htmlTagIndex < htmlTags.length) htmlTagIndex += 1;
		const enclosingHtmlTag = htmlTags[htmlTagIndex];
		if (enclosingHtmlTag && enclosingHtmlTag.start < start && start < enclosingHtmlTag.end) continue;
		const codeRegion = codeRegions.find((region) => isInsideCode(start, [region]));
		const enclosingBlock = openBlocks.at(-1);
		const enclosingRawText = rawTextHtml.find((region) => {
			return region.start < start && start < region.end;
		});
		if (enclosingBlock && enclosingRawText && enclosingBlock.start < enclosingRawText.start) {
			enclosingBlock.sawNested = true;
			continue;
		}
		if (enclosingBlock && codeRegion && enclosingBlock.codeRegion !== codeRegion) {
			enclosingBlock.sawNested = true;
			continue;
		}
		if (enclosingBlock?.codeRegion && enclosingBlock.codeRegion !== codeRegion) throw new Error("iMessage outbound runtime scaffolding is malformed");
		if (++scannedTags > MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES ** 2) throw new Error("iMessage outbound runtime scaffolding exceeded its limit");
		let quote;
		let end = start + token[0].length;
		for (; end < text.length; end += 1) {
			if (end - start > MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES ** 2) throw new Error("iMessage outbound runtime scaffolding exceeded its limit");
			const character = text[end];
			if (quote) {
				if (character === quote) quote = void 0;
			} else if (character === "'" || character === "\"") quote = character;
			else if (character === "<") throw new Error("iMessage outbound runtime scaffolding is malformed");
			else if (character === ">") break;
		}
		if (end >= text.length || quote) throw new Error("iMessage outbound runtime scaffolding is malformed");
		end += 1;
		if (enclosingBlock?.codeRegion && enclosingBlock.codeRegion === codeRegion) {
			if (!enclosingBlock.nestedCodeRegions) {
				if (codeRegion.end - enclosingBlock.end > MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES ** 3) throw new Error("iMessage outbound runtime scaffolding exceeded its limit");
				enclosingBlock.nestedCodeRegions = findCodeRegions(text.slice(enclosingBlock.end, codeRegion.end));
				if (enclosingBlock.nestedCodeRegions.length > MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES ** 2) throw new Error("iMessage outbound runtime scaffolding exceeded its limit");
			}
			if (isInsideCode(start - enclosingBlock.end, enclosingBlock.nestedCodeRegions)) {
				enclosingBlock.sawNested = true;
				continue;
			}
		}
		scannedThrough = end;
		const markup = text.slice(start, end);
		const closing = token[1] === "/";
		if (!closing && /\/\s*>$/.test(markup)) {
			const parent = openBlocks.at(-1);
			if (parent) parent.sawNested = true;
			else completedBlocks.push({
				start,
				end
			});
			continue;
		}
		const name = (token[2] ?? "").toLowerCase();
		if (!closing) {
			if (openBlocks.length >= MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES) throw new Error("iMessage outbound runtime scaffolding exceeded its limit");
			const parent = openBlocks.at(-1);
			if (parent) parent.sawNested = true;
			openBlocks.push({
				name,
				start,
				end,
				sawNested: false,
				codeRegion
			});
			continue;
		}
		const opening = openBlocks.at(-1);
		if (!opening) {
			completedBlocks.push({
				start,
				end
			});
			continue;
		}
		if (opening.name !== name) throw new Error("iMessage outbound runtime scaffolding is malformed");
		openBlocks.pop();
		completedBlocks.push({
			start: opening.start,
			end
		});
	}
	if (openBlocks.length > 1 || openBlocks[0]?.sawNested || openBlocks[0] && [...opaqueHtml, ...rawTextHtml].some((region) => !region.terminated && openBlocks[0].start < region.start)) throw new Error("iMessage outbound runtime scaffolding is malformed");
	const orphan = openBlocks[0];
	if (orphan) completedBlocks.push({
		start: orphan.start,
		end: orphan.end
	});
	completedBlocks.sort((left, right) => left.start - right.start || right.end - left.end);
	const outermost = [];
	for (const block of completedBlocks) {
		const previous = outermost.at(-1);
		if (!previous || block.start >= previous.end) outermost.push(block);
	}
	let current = text;
	for (const block of outermost.toReversed()) {
		verifyProtectedRoles?.(current);
		const stripped = current.slice(0, block.start) + current.slice(block.end);
		assertSafeIMessageOutboundMarkup(stripped);
		verifyProtectedRoles?.(stripped);
		current = stripped;
	}
	return current;
}
function stripIMessagePrivateRuntimeScaffolding(text, verifyProtectedRoles) {
	assertSafeIMessageOutboundMarkup(text);
	let current = text;
	for (let depth = 0; depth < MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES; depth += 1) {
		let changed = false;
		for (const strip of [(value) => value.replace(PRIVATE_RUNTIME_CONTEXT_BLOCK_RE, ""), (value) => stripIMessageBalancedPrivateRuntimeBlocks(value, verifyProtectedRoles)]) {
			verifyProtectedRoles?.(current);
			const stripped = strip(current);
			assertSafeIMessageOutboundMarkup(stripped);
			verifyProtectedRoles?.(stripped);
			if (stripped !== current) {
				current = stripped;
				changed = true;
			}
		}
		if (!changed) return current;
	}
	throw new Error("iMessage outbound runtime scaffolding exceeded its limit");
}
function sanitizeIMessageAssistantVisibleText(text, verifyProtectedRoles) {
	const cleaned = stripIMessagePrivateRuntimeScaffolding(text, verifyProtectedRoles);
	if (!text.trim()) return text;
	const leadingWhitespace = /^\s*/u.exec(text)?.[0] ?? "";
	const trailingWhitespace = /\s*$/u.exec(text)?.[0] ?? "";
	verifyProtectedRoles?.(cleaned);
	const canonical = cleaned.trim();
	verifyProtectedRoles?.(canonical);
	const visible = sanitizeAssistantVisibleText(canonical);
	verifyProtectedRoles?.(visible);
	return visible ? `${leadingWhitespace}${visible}${trailingWhitespace}` : "";
}
function isClosedFencedCodeRegion(text, region) {
	const lineStart = text.lastIndexOf("\n", region.start - 1) + 1;
	if (!/^ {0,3}$/.test(text.slice(lineStart, region.start))) return false;
	const source = text.slice(region.start, region.end);
	const openingFence = /^ {0,3}(`{3,}|~{3,})[^\r\n]*\r?\n/.exec(source)?.[1];
	if (!openingFence) return false;
	const closingFence = new RegExp(`\r?\n {0,3}${openingFence[0]}{${openingFence.length},}[\t ]*(?:\r?\n)?$`);
	const lineEnd = text.indexOf("\n", region.end);
	return closingFence.test(source) && /^[\t ]*\r?$/.test(text.slice(region.end, lineEnd < 0 ? text.length : lineEnd));
}
/** Preserve authenticated fenced role mappings through the final native-render scrub. */
function protectIMessageFencedRoleMarkers(text) {
	const source = stripIMessagePrivateRuntimeScaffolding(text);
	const closedFencedRegions = findCodeRegions(source).filter((region) => isClosedFencedCodeRegion(source, region));
	const protectedRoles = /* @__PURE__ */ new Map();
	let privateUseCodePoint = PRIVATE_USE_START;
	const protectedText = source.replace(FENCED_ROLE_MARKER_RE, (marker, role, offset) => {
		if (!isInsideCode(offset, closedFencedRegions)) return marker;
		while (privateUseCodePoint <= PRIVATE_USE_END) {
			const protectedGlyph = String.fromCharCode(privateUseCodePoint++);
			const token = protectedGlyph.repeat(role.length);
			if (text.includes(protectedGlyph) || protectedRoles.has(token)) continue;
			protectedRoles.set(token, role);
			return marker.replace(role, token);
		}
		throw new Error("iMessage outbound role protection is unavailable");
	});
	const verifyProtectedRoles = (visible) => {
		assertSafeIMessageOutboundMarkup(visible);
		let previous = -1;
		for (const token of protectedRoles.keys()) {
			const first = visible.indexOf(token);
			if (first < 0 || first < previous || visible.includes(token, first + token.length)) throw new Error("iMessage outbound role protection failed");
			for (let offset = visible.indexOf(token[0] ?? ""); offset >= 0;) {
				if (offset < first || offset >= first + token.length) throw new Error("iMessage outbound role protection failed");
				offset = visible.indexOf(token[0] ?? "", offset + 1);
			}
			previous = first + token.length;
		}
	};
	return {
		text: protectedText,
		verifyProtectedRoles,
		sanitizeFormatted: (formatted) => {
			verifyProtectedRoles(formatted.text);
			let visible = formatted.text;
			let ranges = formatted.ranges;
			for (let remainingPasses = visible.length;; remainingPasses--) {
				verifyProtectedRoles(visible);
				const assistantVisible = sanitizeIMessageAssistantVisibleText(visible, verifyProtectedRoles);
				const assistantTextChanged = assistantVisible !== visible;
				if (assistantTextChanged) {
					visible = assistantVisible;
					ranges = [];
					verifyProtectedRoles(visible);
				}
				const removed = [];
				const cleaned = visible.replace(FINAL_PRIVATE_MARKER_RE, (marker, offset) => {
					removed.push({
						start: offset,
						end: offset + marker.length
					});
					return "";
				});
				if (removed.length > 0) {
					const mapOffset = (offset) => offset - removed.reduce((total, edit) => total + Math.max(0, Math.min(offset, edit.end) - edit.start), 0);
					ranges = ranges.flatMap((range) => {
						const start = mapOffset(range.start);
						const length = mapOffset(range.start + range.length) - start;
						return length > 0 ? [{
							...range,
							start,
							length
						}] : [];
					});
					visible = cleaned;
					verifyProtectedRoles(visible);
				}
				if (removed.length === 0) {
					let projection = visible;
					for (let depth = 0;; depth += 1) {
						verifyProtectedRoles(projection);
						const renderedProjection = extractMarkdownFormatRuns(projection).text;
						verifyProtectedRoles(renderedProjection);
						const unwrappedProjection = stripMarkdown(renderedProjection);
						verifyProtectedRoles(unwrappedProjection);
						let htmlProjection = unwrappedProjection;
						for (let htmlDepth = 0;; htmlDepth += 1) {
							verifyProtectedRoles(htmlProjection);
							const assistantProjection = sanitizeIMessageAssistantVisibleText(htmlProjection, verifyProtectedRoles);
							verifyProtectedRoles(assistantProjection);
							if (assistantProjection !== htmlProjection) throw new Error("iMessage outbound hidden assistant content is not allowed");
							const htmlRemoved = htmlProjection.replace(PLAIN_TEXT_HTML_TAG_RE, "");
							verifyProtectedRoles(htmlRemoved);
							if (htmlRemoved === htmlProjection) break;
							if (htmlDepth + 1 >= MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES) throw new Error("iMessage outbound HTML security projection exceeded its limit");
							htmlProjection = htmlRemoved;
						}
						if (unwrappedProjection === projection) break;
						if (depth + 1 >= MAX_PRIVATE_MARKDOWN_UNWRAP_PASSES) throw new Error("iMessage outbound Markdown security projection exceeded its limit");
						projection = unwrappedProjection;
					}
					if (!assistantTextChanged) break;
				}
				if (remainingPasses <= 0) throw new Error("iMessage outbound role sanitization failed");
			}
			verifyProtectedRoles(visible);
			for (const [token, role] of protectedRoles) visible = visible.replace(token, role);
			return {
				text: visible,
				ranges
			};
		}
	};
}
/** Keep each transport's existing rendered or raw wire contract behind one final security gate. */
function sanitizeIMessageFinalOutboundText(text, options = {}) {
	const protection = options.protection ?? protectIMessageFencedRoleMarkers(text);
	const source = options.protection ? text : protection.text;
	protection.verifyProtectedRoles(source);
	const protectedText = sanitizeIMessageAssistantVisibleText(source, protection.verifyProtectedRoles);
	protection.verifyProtectedRoles(protectedText);
	const formatted = options.formatMarkdown && protectedText.trim() ? extractMarkdownFormatRuns(protectedText) : {
		text: protectedText,
		ranges: []
	};
	return protection.sanitizeFormatted(formatted);
}
/**
* Strip all assistant-internal scaffolding from outbound text before delivery.
* Applies reasoning/thinking tag removal, memory tag removal, and
* model-specific internal separator stripping.
*/
function sanitizeOutboundText(text) {
	if (!text) return text;
	let cleaned = sanitizeIMessageAssistantVisibleText(text);
	cleaned = cleaned.replace(INTERNAL_SEPARATOR_RE, "");
	cleaned = cleaned.replace(ASSISTANT_ROLE_MARKER_RE, "");
	const closedFencedRegions = findCodeRegions(cleaned).filter((region) => isClosedFencedCodeRegion(cleaned, region));
	cleaned = cleaned.replace(ROLE_TURN_MARKER_RE, (marker, offset) => isInsideCode(offset, closedFencedRegions) ? marker : "");
	cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();
	return cleaned;
}
//#endregion
export { chatContextFromIMessageTarget as _, IMessageRpcRequestError as a, resolveIMessageDirectChatService as b, findLatestIMessageEntryForChat as c, isKnownFromMeIMessageMessageId as d, rememberIMessageReplyCache as f, DEFAULT_IMESSAGE_SEND_TIMEOUT_MS as g, DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS as h, extractMarkdownFormatRuns as i, isIMessageCurrentMessageInChat as l, resolveIMessageMessageId as m, sanitizeIMessageFinalOutboundText as n, createIMessageRpcClient as o, resolveIMessageCachedResourceBinding as p, sanitizeOutboundText as r, runIMessageCliJsonCommand as s, protectIMessageFencedRoleMarkers as t, isIMessageCurrentMessageInChatAsync as u, isIMessageEmailChatIdentifier as v, normalizeDirectChatIdentifier as y };
