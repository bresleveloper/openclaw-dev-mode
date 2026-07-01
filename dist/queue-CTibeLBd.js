import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as resolveGlobalMap } from "./global-singleton-PwlQSEal.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { t as parseDurationMs } from "./parse-duration-Da6doDTX.js";
import { n as resolveGlobalDedupeCache } from "./dedupe-DnzL4okR.js";
import { l as mimeTypeFromFilePath } from "./mime-C8mVE2Bw.js";
import { n as channelRouteDedupeKey, t as channelRouteCompactKey } from "./channel-route-BhPKCG_0.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import { n as getLoadedChannelPlugin } from "./registry-Ba1KQQW12.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import "./plugins-DnKj2WmH.js";
import { b as persistSessionTranscriptTurn, m as loadSessionEntry } from "./session-accessor-Dx6KDG0K.js";
import "./sessions-gBZPP61K.js";
import { r as applyInputProvenanceToUserMessage, s as normalizeInputProvenance } from "./input-provenance-CQSqbDss.js";
import { r as clearCommandLane } from "./command-queue-JAuVCy9E.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-a2ZCt8vm.js";
import { t as resolveEmbeddedSessionLane } from "./lanes-CVttd5qX.js";
import { t as isRoutableChannel } from "./route-reply-CZ7BP-Xv.js";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/auto-reply/reply/directive-parsing.ts
/** Low-level token scanning helpers for inline directive parsers. */
function skipDirectiveArgPrefix(raw) {
	let i = 0;
	const len = raw.length;
	while (i < len && /\s/.test(raw[i])) i += 1;
	if (raw[i] === ":") {
		i += 1;
		while (i < len && /\s/.test(raw[i])) i += 1;
	}
	return i;
}
/** Reads the next non-whitespace directive token and returns the next scan index. */
function takeDirectiveToken(raw, startIndex) {
	let i = startIndex;
	const len = raw.length;
	while (i < len && /\s/.test(raw[i])) i += 1;
	if (i >= len) return {
		token: null,
		nextIndex: i
	};
	const start = i;
	while (i < len && !/\s/.test(raw[i])) i += 1;
	if (start === i) return {
		token: null,
		nextIndex: i
	};
	const token = raw.slice(start, i);
	while (i < len && /\s/.test(raw[i])) i += 1;
	return {
		token,
		nextIndex: i
	};
}
//#endregion
//#region src/auto-reply/reply/queue/normalize.ts
/** Normalizes user-entered queue mode aliases from directives/config. */
function normalizeQueueMode(raw) {
	const cleaned = normalizeOptionalLowercaseString(raw);
	if (!cleaned) return;
	if (cleaned === "interrupt" || cleaned === "interrupts" || cleaned === "abort") return "interrupt";
	if (cleaned === "steer" || cleaned === "steering") return "steer";
	if (cleaned === "followup" || cleaned === "follow-ups" || cleaned === "followups") return "followup";
	if (cleaned === "collect" || cleaned === "coalesce") return "collect";
}
/** Normalizes persisted legacy queue mode aliases into current queue modes. */
function normalizePersistedQueueMode(raw) {
	const normalized = normalizeQueueMode(raw);
	if (normalized) return normalized;
	const cleaned = normalizeOptionalLowercaseString(raw);
	if (cleaned === "queue" || cleaned === "queued") return "steer";
	if (cleaned === "steer+backlog" || cleaned === "steer-backlog" || cleaned === "steer_backlog") return "followup";
}
/** Normalizes queue drop policy aliases from directives/config. */
function normalizeQueueDropPolicy(raw) {
	const cleaned = normalizeOptionalLowercaseString(raw);
	if (!cleaned) return;
	if (cleaned === "old" || cleaned === "oldest") return "old";
	if (cleaned === "new" || cleaned === "newest") return "new";
	if (cleaned === "summarize" || cleaned === "summary") return "summarize";
}
//#endregion
//#region src/auto-reply/reply/queue/directive.ts
/** Parses debounce durations in `/queue` directives. */
function parseQueueDebounce(raw) {
	if (!raw) return;
	try {
		const parsed = parseDurationMs(raw.trim(), { defaultUnit: "ms" });
		if (!parsed || parsed < 0) return;
		return Math.round(parsed);
	} catch {
		return;
	}
}
function parseQueueCap(raw) {
	if (!raw) return;
	return parseStrictPositiveInteger(raw);
}
function parseQueueDirectiveArgs(raw) {
	const len = raw.length;
	let i = skipDirectiveArgPrefix(raw);
	let consumed = i;
	let queueMode;
	let queueReset = false;
	let rawMode;
	let debounceMs;
	let cap;
	let dropPolicy;
	let rawDebounce;
	let rawCap;
	let rawDrop;
	let hasOptions = false;
	const takeToken = () => {
		const res = takeDirectiveToken(raw, i);
		i = res.nextIndex;
		return res.token;
	};
	for (;;) {
		if (i >= len) break;
		const token = takeToken();
		if (!token) break;
		const lowered = normalizeOptionalLowercaseString(token);
		if (!lowered) break;
		if (lowered === "default" || lowered === "reset" || lowered === "clear") {
			queueReset = true;
			consumed = i;
			break;
		}
		if (lowered.startsWith("debounce:") || lowered.startsWith("debounce=")) {
			rawDebounce = token.split(/[:=]/)[1] ?? "";
			debounceMs = parseQueueDebounce(rawDebounce);
			hasOptions = true;
			consumed = i;
			continue;
		}
		if (lowered.startsWith("cap:") || lowered.startsWith("cap=")) {
			rawCap = token.split(/[:=]/)[1] ?? "";
			cap = parseQueueCap(rawCap);
			hasOptions = true;
			consumed = i;
			continue;
		}
		if (lowered.startsWith("drop:") || lowered.startsWith("drop=")) {
			rawDrop = token.split(/[:=]/)[1] ?? "";
			dropPolicy = normalizeQueueDropPolicy(rawDrop);
			hasOptions = true;
			consumed = i;
			continue;
		}
		const mode = normalizeQueueMode(token);
		if (mode) {
			queueMode = mode;
			rawMode = token;
			consumed = i;
			continue;
		}
		if (consumed === skipDirectiveArgPrefix(raw) && !queueReset && !hasOptions) {
			rawMode = token;
			consumed = i;
		}
		break;
	}
	return {
		consumed,
		queueMode,
		queueReset,
		rawMode,
		debounceMs,
		cap,
		dropPolicy,
		rawDebounce,
		rawCap,
		rawDrop,
		hasOptions
	};
}
/** Extracts and removes a `/queue` directive from message text. */
function extractQueueDirective(body) {
	if (!body) return {
		cleaned: "",
		hasDirective: false,
		queueReset: false,
		hasOptions: false
	};
	const match = /(?:^|\s)\/queue(?=$|\s|:)/i.exec(body);
	if (!match) return {
		cleaned: body.trim(),
		hasDirective: false,
		queueReset: false,
		hasOptions: false
	};
	const start = match.index + match[0].indexOf("/queue");
	const argsStart = start + 6;
	const parsed = parseQueueDirectiveArgs(body.slice(argsStart));
	return {
		cleaned: `${body.slice(0, start)} ${body.slice(argsStart + parsed.consumed)}`.replace(/\s+/g, " ").trim(),
		queueMode: parsed.queueMode,
		queueReset: parsed.queueReset,
		rawMode: parsed.rawMode,
		debounceMs: parsed.debounceMs,
		cap: parsed.cap,
		dropPolicy: parsed.dropPolicy,
		rawDebounce: parsed.rawDebounce,
		rawCap: parsed.rawCap,
		rawDrop: parsed.rawDrop,
		hasDirective: true,
		hasOptions: parsed.hasOptions
	};
}
//#endregion
//#region src/sessions/user-turn-transcript.ts
function normalizeOptionalText(value) {
	const normalized = value?.trim();
	return normalized ? normalized : void 0;
}
function normalizeTranscriptText(value) {
	return value ?? "";
}
const CHANNEL_MEDIA_PLACEHOLDER_PATTERN = /^<media:[a-z0-9_-]+>(?:\s+\([^)]*\))?$/i;
function resolvePersistedUserTurnText(value, options = {}) {
	const normalized = normalizeOptionalText(value);
	if (!normalized) return;
	if (options.hasMedia === true && CHANNEL_MEDIA_PLACEHOLDER_PATTERN.test(normalized)) return;
	return normalized;
}
function mediaTypeForTranscript(media) {
	return normalizeOptionalText(media.contentType) ?? normalizeOptionalText(media.kind) ?? "application/octet-stream";
}
function normalizeMediaEntryForTranscript(media) {
	const pathLocal = normalizeOptionalText(media.path) ?? normalizeOptionalText(media.url);
	if (!pathLocal) return;
	return {
		path: pathLocal,
		type: mediaTypeForTranscript(media)
	};
}
function normalizeOptionalTextArray(values) {
	return values?.map(normalizeOptionalText) ?? [];
}
const URL_LIKE_MEDIA_PATH_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
function resolveTranscriptMediaPath(pathValue, workspaceDir) {
	if (!workspaceDir || path.isAbsolute(pathValue) || URL_LIKE_MEDIA_PATH_PATTERN.test(pathValue)) return pathValue;
	return path.join(workspaceDir, pathValue);
}
function resolveTranscriptMediaType(params) {
	return params.explicitType ?? mimeTypeFromFilePath(params.mediaPath ?? params.mediaUrl);
}
function buildPersistedUserTurnMediaInputsFromFields(fields) {
	if (!fields) return [];
	const paths = normalizeOptionalTextArray(fields.MediaPaths);
	const urls = normalizeOptionalTextArray(fields.MediaUrls);
	const types = normalizeOptionalTextArray(fields.MediaTypes);
	const singlePath = normalizeOptionalText(fields.MediaPath);
	const singleUrl = normalizeOptionalText(fields.MediaUrl);
	const singleType = normalizeOptionalText(fields.MediaType);
	const workspaceDir = normalizeOptionalText(fields.MediaWorkspaceDir);
	const mediaCount = Math.max(paths.length, urls.length, singlePath || singleUrl ? 1 : 0);
	const media = [];
	for (let index = 0; index < mediaCount; index += 1) {
		const rawPath = paths[index] ?? (index === 0 ? singlePath : void 0);
		const mediaPath = rawPath ? resolveTranscriptMediaPath(rawPath, workspaceDir) : void 0;
		const url = urls[index] ?? (index === 0 ? singleUrl : void 0);
		if (!mediaPath && !url) continue;
		media.push({
			...mediaPath ? { path: mediaPath } : {},
			...url ? { url } : {},
			contentType: resolveTranscriptMediaType({
				explicitType: types[index] ?? (index === 0 ? singleType : void 0),
				mediaPath,
				mediaUrl: url
			})
		});
	}
	return media;
}
function buildPersistedUserTurnMediaFields(media) {
	const normalized = (Array.isArray(media) ? media : []).map(normalizeMediaEntryForTranscript).filter((entry) => entry !== void 0);
	const paths = normalized.map((entry) => entry.path);
	if (paths.length === 0) return {};
	const types = normalized.map((entry) => entry.type);
	return {
		MediaPath: paths[0],
		MediaPaths: paths,
		MediaType: types[0],
		MediaTypes: types
	};
}
function buildPersistedUserTurnMessage(params) {
	const mediaFields = buildPersistedUserTurnMediaFields(params.media);
	const hasMedia = Boolean(mediaFields.MediaPath);
	return applyInputProvenanceToUserMessage({
		role: "user",
		content: normalizeTranscriptText(params.text) || (hasMedia ? params.mediaOnlyText ?? "" : ""),
		timestamp: params.timestamp ?? Date.now(),
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...mediaFields
	}, params.provenance);
}
function resolvePersistedUserTurnMessage(params) {
	if (params.message) return params.message;
	if (!params.input) return;
	return buildPersistedUserTurnMessage(params.input);
}
function isUserMessage(message) {
	return message.role === "user";
}
function isBeforeAgentRunBlockedMessage(message) {
	return message["__openclaw"]?.beforeAgentRunBlocked !== void 0;
}
function mergePreparedUserTurnMessageForRuntime(params) {
	if (!params.preparedMessage || !isUserMessage(params.runtimeMessage) || isBeforeAgentRunBlockedMessage(params.runtimeMessage)) return params.runtimeMessage;
	return {
		...params.runtimeMessage,
		...params.preparedMessage
	};
}
/** Applies before-message hooks while preserving user-turn transcript metadata. */
function preparePersistedUserTurnMessageForTranscriptWrite(message, params) {
	if (!params.beforeMessageWrite) return message;
	const originalMessage = message;
	const idempotencyKey = typeof originalMessage.idempotencyKey === "string" ? originalMessage.idempotencyKey : void 0;
	const provenance = normalizeInputProvenance(message.provenance);
	const nextMessage = params.beforeMessageWrite({
		message,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	});
	if (nextMessage?.role !== "user") return;
	const nextUserMessage = provenance ? applyInputProvenanceToUserMessage(nextMessage, provenance) : nextMessage;
	return idempotencyKey ? {
		...nextUserMessage,
		idempotencyKey
	} : nextUserMessage;
}
async function appendUserTurnTranscriptMessage(params) {
	const resolvedMessage = resolvePersistedUserTurnMessage(params);
	if (!resolvedMessage) return;
	const appended = (await persistSessionTranscriptTurn({
		sessionFile: params.transcriptPath,
		sessionKey: params.sessionKey ?? "",
		...params.agentId ? { agentId: params.agentId } : {},
		...params.sessionId ? { sessionId: params.sessionId } : {}
	}, {
		...params.cwd ? { cwd: params.cwd } : {},
		...params.config ? { config: params.config } : {},
		updateMode: params.updateMode ?? "inline",
		messages: [{
			message: resolvedMessage,
			idempotencyLookup: "scan",
			prepareMessageAfterIdempotencyCheck: (message) => preparePersistedUserTurnMessageForTranscriptWrite(message, params)
		}]
	})).messages[0];
	if (!appended) return;
	return {
		sessionFile: params.transcriptPath,
		messageId: appended.messageId,
		message: appended.message
	};
}
async function persistUserTurnTranscript(params) {
	const message = resolvePersistedUserTurnMessage(params);
	if (!message) return;
	const turn = await persistSessionTranscriptTurn({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry,
		...params.sessionStore ? { sessionStore: params.sessionStore } : {},
		...params.storePath ? { storePath: params.storePath } : {},
		agentId: params.agentId,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {}
	}, {
		...params.cwd ? { cwd: params.cwd } : {},
		...params.config ? { config: params.config } : {},
		updateMode: params.updateMode ?? "inline",
		messages: [{
			message,
			idempotencyLookup: "scan",
			prepareMessageAfterIdempotencyCheck: (candidate) => preparePersistedUserTurnMessageForTranscriptWrite(candidate, params)
		}]
	});
	const appended = turn.messages[0];
	if (!appended) return;
	return {
		...appended,
		sessionEntry: turn.sessionEntry,
		sessionFile: turn.sessionFile
	};
}
async function appendFileTargetUserTurnTranscript(params) {
	const { config, ...target } = params.target;
	const appended = await appendUserTurnTranscriptMessage({
		...target,
		message: params.message,
		updateMode: params.updateMode,
		...config ? { config } : {},
		...params.beforeMessageWrite ? { beforeMessageWrite: params.beforeMessageWrite } : {}
	});
	return appended ? {
		...appended,
		sessionEntry: void 0
	} : void 0;
}
async function resolveUserTurnTranscriptTarget(target) {
	return typeof target === "function" ? await target() : target;
}
function isUserTurnTranscriptFileTarget(target) {
	return "transcriptPath" in target;
}
function createUserTurnTranscriptRecorder(params) {
	const message = resolvePersistedUserTurnMessage(params);
	let blocked = false;
	let persisted = false;
	let persistedResult;
	let runtimePersistencePromise;
	let selfPersistencePromise;
	let resolvedMessagePromise;
	const handlePersistenceError = (error) => {
		if (params.onPersistenceError) {
			params.onPersistenceError(error);
			return;
		}
		import("./globals-rInV7jG6.js").then(({ logVerbose }) => {
			logVerbose(`failed to persist ${params.errorContext ?? "user turn transcript"}: ${String(error)}`);
		}).catch(() => void 0);
	};
	const resolveMessageForPersistence = async () => {
		if (params.message) return params.message;
		if (!params.resolveInput) return message;
		if (!resolvedMessagePromise) resolvedMessagePromise = (async () => {
			try {
				const resolvedInput = await params.resolveInput?.();
				return resolvePersistedUserTurnMessage({
					message: params.message,
					input: resolvedInput ?? params.input
				}) ?? message;
			} catch (error) {
				handlePersistenceError(error);
				return message;
			}
		})();
		return await resolvedMessagePromise;
	};
	const waitForRuntimePersistence = async () => {
		if (!runtimePersistencePromise) return;
		try {
			await runtimePersistencePromise;
		} catch (error) {
			handlePersistenceError(error);
		}
	};
	const persistPrepared = async (options) => {
		if (persisted) return persistedResult;
		if (options.skipWhenBlocked && blocked) return;
		if (!message && !params.resolveInput) return;
		if (options.waitForRuntime) {
			await waitForRuntimePersistence();
			if (persisted) return persistedResult;
		}
		if (selfPersistencePromise) return await selfPersistencePromise;
		selfPersistencePromise = (async () => {
			const resolvedMessage = await resolveMessageForPersistence();
			if (!resolvedMessage) return;
			const target = await resolveUserTurnTranscriptTarget(options.target ?? params.target);
			if (!target) return;
			const updateMode = options.updateMode ?? params.updateMode ?? "inline";
			const result = isUserTurnTranscriptFileTarget(target) ? await appendFileTargetUserTurnTranscript({
				target,
				message: resolvedMessage,
				updateMode,
				beforeMessageWrite: params.beforeMessageWrite
			}) : await persistUserTurnTranscript({
				...target,
				message: resolvedMessage,
				updateMode,
				...params.beforeMessageWrite ? { beforeMessageWrite: params.beforeMessageWrite } : {}
			});
			if (result) {
				persisted = true;
				persistedResult = result;
			}
			return result;
		})();
		try {
			return await selfPersistencePromise;
		} catch (error) {
			handlePersistenceError(error);
			throw error;
		}
	};
	return {
		message,
		resolveMessage: resolveMessageForPersistence,
		markRuntimePersistencePending: (pending) => {
			runtimePersistencePromise = pending;
		},
		markRuntimePersisted: (persistedMessage) => {
			persisted = true;
			if (persistedMessage && persistedResult) persistedResult = {
				...persistedResult,
				message: persistedMessage
			};
		},
		markBlocked: () => {
			blocked = true;
		},
		hasPersisted: () => persisted,
		isBlocked: () => blocked,
		hasRuntimePersistencePending: () => runtimePersistencePromise !== void 0,
		waitForRuntimePersistence,
		persistApproved: async (options) => await persistPrepared({
			waitForRuntime: false,
			skipWhenBlocked: true,
			target: options?.target,
			updateMode: options?.updateMode
		}),
		persistFallback: async (options) => await persistPrepared({
			waitForRuntime: true,
			skipWhenBlocked: true,
			target: options?.target,
			updateMode: options?.updateMode
		})
	};
}
//#endregion
//#region src/utils/queue-helpers.ts
/** Clear accumulated overflow summary state after it has been emitted. */
function clearQueueSummaryState(state) {
	state.droppedCount = 0;
	state.summaryLines = [];
}
/** Build a summary prompt preview without mutating the source queue state. */
function previewQueueSummaryPrompt(params) {
	return buildQueueSummaryPrompt({
		state: {
			dropPolicy: params.state.dropPolicy,
			droppedCount: params.state.droppedCount,
			summaryLines: [...params.state.summaryLines]
		},
		noun: params.noun,
		title: params.title
	});
}
/** Apply runtime queue settings while preserving previous values for omitted fields. */
function applyQueueRuntimeSettings(params) {
	params.target.mode = params.settings.mode;
	params.target.debounceMs = typeof params.settings.debounceMs === "number" ? Math.max(0, params.settings.debounceMs) : params.target.debounceMs;
	params.target.cap = typeof params.settings.cap === "number" && params.settings.cap > 0 ? Math.floor(params.settings.cap) : params.target.cap;
	params.target.dropPolicy = params.settings.dropPolicy ?? params.target.dropPolicy;
}
/** Trim queue summary text to a bounded single-line preview. */
function elideQueueText(text, limit = 140) {
	if (text.length <= limit) return text;
	return `${text.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}
/** Normalize whitespace and elide one dropped item for queue summaries. */
function buildQueueSummaryLine(text, limit = 160) {
	return elideQueueText(text.replace(/\s+/g, " ").trim(), limit);
}
/** Run optional duplicate detection before an item enters a queue. */
function shouldSkipQueueItem(params) {
	if (!params.dedupe) return false;
	return params.dedupe(params.item, params.items);
}
/** Apply overflow policy before enqueueing another item. */
function applyQueueDropPolicy(params) {
	const cap = params.queue.cap;
	if (cap <= 0 || params.queue.items.length < cap) return true;
	if (params.queue.dropPolicy === "new") return false;
	const dropCount = params.queue.items.length - cap + 1;
	const dropped = params.queue.items.splice(0, dropCount);
	params.onDrop?.(dropped);
	if (params.queue.dropPolicy === "summarize") {
		for (const item of dropped) {
			params.queue.droppedCount += 1;
			params.queue.summaryLines.push(buildQueueSummaryLine(params.summarize(item)));
		}
		const limit = Math.max(0, params.summaryLimit ?? cap);
		while (params.queue.summaryLines.length > limit) params.queue.summaryLines.shift();
	}
	return true;
}
/** Wait until the queue has been quiet for its debounce window. */
function waitForQueueDebounce(queue) {
	if (process.env.OPENCLAW_TEST_FAST === "1") return Promise.resolve();
	const debounceMs = Math.max(0, queue.debounceMs);
	if (debounceMs <= 0) return Promise.resolve();
	return new Promise((resolve) => {
		const check = () => {
			const since = Date.now() - queue.lastEnqueuedAt;
			if (since >= debounceMs) {
				resolve();
				return;
			}
			setTimeout(check, debounceMs - since);
		};
		check();
	});
}
/** Mark one queue as draining unless another drain is already active. */
function beginQueueDrain(map, key) {
	const queue = map.get(key);
	if (!queue || queue.draining) return;
	queue.draining = true;
	return queue;
}
function removeQueuedItemsByRef(items, processed) {
	for (const item of processed) {
		const idx = items.indexOf(item);
		if (idx !== -1) items.splice(idx, 1);
	}
}
/** Run and remove the next queued item, returning false when empty. */
async function drainNextQueueItem(items, run) {
	const next = items[0];
	if (!next) return false;
	await run(next);
	removeQueuedItemsByRef(items, [next]);
	return true;
}
/** Drain one item when collect mode requires individual processing. */
async function drainCollectItemIfNeeded(params) {
	if (!params.forceIndividualCollect && !params.isCrossChannel) return "skipped";
	if (params.isCrossChannel) params.setForceIndividualCollect?.(true);
	return await drainNextQueueItem(params.items, params.run) ? "drained" : "empty";
}
/** Drain one collect step using mutable queue collection state. */
async function drainCollectQueueStep(params) {
	return await drainCollectItemIfNeeded({
		forceIndividualCollect: params.collectState.forceIndividualCollect,
		isCrossChannel: params.isCrossChannel,
		setForceIndividualCollect: (next) => {
			params.collectState.forceIndividualCollect = next;
		},
		items: params.items,
		run: params.run
	});
}
/** Build and consume the queue overflow summary prompt. */
function buildQueueSummaryPrompt(params) {
	if (params.state.dropPolicy !== "summarize" || params.state.droppedCount <= 0) return;
	const noun = params.noun;
	const lines = [params.title ?? `[Queue overflow] Dropped ${params.state.droppedCount} ${noun}${params.state.droppedCount === 1 ? "" : "s"} due to cap.`];
	if (params.state.summaryLines.length > 0) {
		lines.push("Summary:");
		for (const line of params.state.summaryLines) lines.push(`- ${line}`);
	}
	clearQueueSummaryState(params.state);
	return lines.join("\n");
}
/** Render a collect prompt from queued items and optional overflow summary. */
function buildCollectPrompt(params) {
	const blocks = [params.title];
	if (params.summary) blocks.push(params.summary);
	params.items.forEach((item, idx) => {
		blocks.push(params.renderItem(item, idx));
	});
	return blocks.join("\n\n");
}
/** Return true when queued items span keys or explicitly mark cross-channel state. */
function hasCrossChannelItems(items, resolveKey) {
	const keys = /* @__PURE__ */ new Set();
	for (const item of items) {
		const resolved = resolveKey(item);
		if (resolved.cross) return true;
		if (!resolved.key) continue;
		keys.add(resolved.key);
	}
	return keys.size > 1;
}
//#endregion
//#region src/auto-reply/reply/queue/types.ts
var FollowupRunDeferredError = class extends Error {
	constructor(message = "Follow-up run deferred") {
		super(message);
		this.name = "FollowupRunDeferredError";
	}
};
function isFollowupRunDeferredError(error) {
	return error instanceof FollowupRunDeferredError;
}
function isFollowupRunAborted(run) {
	return run.abortSignal?.aborted === true;
}
const enqueuedFollowupLifecycles = /* @__PURE__ */ new WeakSet();
const completedFollowupLifecycles = /* @__PURE__ */ new WeakSet();
function markFollowupRunEnqueued(run) {
	const lifecycle = run.queuedLifecycle;
	if (!lifecycle || enqueuedFollowupLifecycles.has(lifecycle)) return;
	enqueuedFollowupLifecycles.add(lifecycle);
	lifecycle.onEnqueued?.();
}
function completeFollowupRunLifecycle(run) {
	const lifecycle = run.queuedLifecycle;
	if (!lifecycle || completedFollowupLifecycles.has(lifecycle)) return;
	completedFollowupLifecycles.add(lifecycle);
	lifecycle.onComplete?.();
}
const FOLLOWUP_QUEUES = resolveGlobalMap(Symbol.for("openclaw.followupQueues"));
function getExistingFollowupQueue(key) {
	const cleaned = key.trim();
	if (!cleaned) return;
	return FOLLOWUP_QUEUES.get(cleaned);
}
function trimSummaryElisionsToCap(queue) {
	while (queue.summaryElisions.length > queue.cap) {
		const evicted = queue.summaryElisions.shift();
		if (!evicted) return;
		queue.evictedSummaryCount += evicted.count;
		completeFollowupRunLifecycle(evicted.source);
	}
}
function getFollowupQueue(key, settings) {
	const existing = FOLLOWUP_QUEUES.get(key);
	if (existing) {
		applyQueueRuntimeSettings({
			target: existing,
			settings
		});
		trimSummaryElisionsToCap(existing);
		return existing;
	}
	const created = {
		items: [],
		draining: false,
		lastEnqueuedAt: 0,
		mode: settings.mode,
		debounceMs: typeof settings.debounceMs === "number" ? Math.max(0, settings.debounceMs) : 500,
		cap: typeof settings.cap === "number" && settings.cap > 0 ? Math.floor(settings.cap) : 20,
		dropPolicy: settings.dropPolicy ?? "summarize",
		droppedCount: 0,
		summaryLines: [],
		summarySources: [],
		summaryElisions: [],
		evictedSummaryCount: 0
	};
	applyQueueRuntimeSettings({
		target: created,
		settings
	});
	FOLLOWUP_QUEUES.set(key, created);
	return created;
}
function clearFollowupQueue(key) {
	const cleaned = key.trim();
	const queue = getExistingFollowupQueue(cleaned);
	if (!queue) return 0;
	const cleared = queue.items.length + queue.droppedCount;
	for (const item of queue.items) completeFollowupRunLifecycle(item);
	for (const item of queue.summarySources) completeFollowupRunLifecycle(item);
	for (const entry of queue.summaryElisions) completeFollowupRunLifecycle(entry.source);
	queue.items.length = 0;
	queue.droppedCount = 0;
	queue.summaryLines = [];
	queue.summarySources = [];
	queue.summaryElisions = [];
	queue.evictedSummaryCount = 0;
	queue.lastRun = void 0;
	queue.lastEnqueuedAt = 0;
	FOLLOWUP_QUEUES.delete(cleaned);
	return cleared;
}
function refreshQueuedFollowupSession(params) {
	const cleaned = params.key.trim();
	if (!cleaned) return;
	const queue = getExistingFollowupQueue(cleaned);
	if (!queue) return;
	const shouldRewriteSession = Boolean(params.previousSessionId) && Boolean(params.nextSessionId) && params.previousSessionId !== params.nextSessionId;
	const shouldRewriteModelSelection = typeof params.nextProvider === "string" || typeof params.nextModel === "string" || Object.hasOwn(params, "nextModelOverrideSource");
	const shouldRewriteSelection = shouldRewriteModelSelection || Object.hasOwn(params, "nextAuthProfileId") || Object.hasOwn(params, "nextAuthProfileIdSource");
	if (!shouldRewriteSession && !shouldRewriteSelection) return;
	const rewriteRun = (run) => {
		if (!run) return;
		if (shouldRewriteSession && run.sessionId === params.previousSessionId) {
			run.sessionId = params.nextSessionId;
			const nextSessionFile = normalizeOptionalString(params.nextSessionFile);
			if (nextSessionFile) run.sessionFile = nextSessionFile;
		}
		if (shouldRewriteSelection) {
			if (typeof params.nextProvider === "string") run.provider = params.nextProvider;
			if (typeof params.nextModel === "string") run.model = params.nextModel;
			if (shouldRewriteModelSelection) delete run.hasAutoFallbackProvenance;
			if (Object.hasOwn(params, "nextModelOverrideSource")) {
				run.hasSessionModelOverride = Boolean(run.provider || run.model);
				run.modelOverrideSource = params.nextModelOverrideSource;
			}
			if (Object.hasOwn(params, "nextAuthProfileId")) run.authProfileId = normalizeOptionalString(params.nextAuthProfileId);
			if (Object.hasOwn(params, "nextAuthProfileIdSource")) run.authProfileIdSource = run.authProfileId ? params.nextAuthProfileIdSource : void 0;
		}
	};
	rewriteRun(queue.lastRun);
	for (const item of queue.items) rewriteRun(item.run);
	for (const item of queue.summarySources) rewriteRun(item.run);
	for (const entry of queue.summaryElisions) rewriteRun(entry.source.run);
}
//#endregion
//#region src/auto-reply/reply/queue/drain.ts
const FOLLOWUP_RUN_CALLBACKS = resolveGlobalMap(Symbol.for("openclaw.followupDrainCallbacks"));
function rememberFollowupDrainCallback(key, runFollowup) {
	FOLLOWUP_RUN_CALLBACKS.set(key, runFollowup);
}
function clearFollowupDrainCallback(key) {
	FOLLOWUP_RUN_CALLBACKS.delete(key);
}
/** Restart the drain for `key` if it is currently idle, using the stored callback. */
function kickFollowupDrainIfIdle(key) {
	const cb = FOLLOWUP_RUN_CALLBACKS.get(key);
	if (!cb) return;
	scheduleFollowupDrain(key, cb);
}
function resolveOriginRoutingMetadata(items) {
	const source = items.find((item) => item.originatingChannel && item.originatingTo) ?? items.find((item) => item.originatingChannel || item.originatingTo || item.originatingAccountId || item.originatingThreadId != null || item.originatingChatId || item.originatingReplyToId || item.originatingReplyToMode || item.originatingChatType);
	if (!source) return {};
	return {
		originatingChannel: source.originatingChannel,
		originatingTo: source.originatingTo,
		originatingAccountId: source.originatingAccountId,
		originatingThreadId: source.originatingThreadId,
		originatingChatId: source.originatingChatId,
		originatingReplyToId: source.originatingReplyToId,
		originatingReplyToMode: source.originatingReplyToMode,
		originatingChatType: source.originatingChatType
	};
}
function resolveFollowupAuthorizationKey(run) {
	return JSON.stringify([
		run.senderId ?? "",
		JSON.stringify(run.channelContext ?? null),
		run.senderE164 ?? "",
		run.senderIsOwner === true,
		run.execOverrides?.host ?? "",
		run.execOverrides?.security ?? "",
		run.execOverrides?.ask ?? "",
		run.execOverrides?.node ?? "",
		run.bashElevated?.enabled === true,
		run.bashElevated?.allowed === true,
		run.bashElevated?.defaultLevel ?? ""
	]);
}
function resolveFollowupDeliveryContextKey(run) {
	const execution = run.run;
	const provenance = execution.inputProvenance;
	return JSON.stringify([
		channelRouteDedupeKey({
			channel: run.originatingChannel,
			to: run.originatingTo,
			accountId: run.originatingAccountId,
			threadId: run.originatingThreadId
		}),
		run.originatingChatId ?? "",
		resolveFollowupReplyAnchor(run) ?? "",
		run.originatingReplyToMode ?? "",
		normalizeChatType(run.originatingChatType) ?? "",
		resolveFollowupAuthorizationKey(execution),
		normalizeOptionalString(execution.runtimePolicySessionKey ?? execution.sessionKey) ?? "",
		execution.messageProvider ?? "",
		execution.chatType ?? "",
		execution.agentAccountId ?? "",
		execution.groupId ?? "",
		execution.groupChannel ?? "",
		execution.groupSpace ?? "",
		execution.traceAuthorized === true,
		execution.elevatedLevel ?? "",
		provenance?.kind ?? "",
		provenance?.originSessionId ?? "",
		provenance?.sourceSessionKey ?? "",
		provenance?.sourceChannel ?? "",
		provenance?.sourceTool ?? "",
		execution.extraSystemPrompt ?? "",
		execution.extraSystemPromptStatic ?? "",
		execution.sourceReplyDeliveryMode ?? "",
		execution.silentReplyPromptMode ?? "",
		execution.enforceFinalTag === true,
		execution.skipProviderRuntimeHints === true,
		execution.silentExpected === true,
		execution.allowEmptyAssistantReplyAsSilent === true,
		execution.suppressNextUserMessagePersistence === true,
		execution.suppressTranscriptOnlyAssistantPersistence === true,
		execution.blockReplyBreak
	]);
}
function resolveFollowupReplyAnchor(run) {
	return run.originatingReplyToMode === "off" ? void 0 : normalizeOptionalString(run.originatingReplyToId);
}
function splitCollectItemsByDeliveryContext(items) {
	if (items.length <= 1) return items.length === 0 ? [] : [items];
	const groups = [];
	let currentGroup = [];
	let currentKey;
	for (const item of items) {
		const itemKey = resolveFollowupDeliveryContextKey(item);
		if (currentGroup.length === 0 || itemKey === currentKey) {
			currentGroup.push(item);
			currentKey = itemKey;
			continue;
		}
		groups.push(currentGroup);
		currentGroup = [item];
		currentKey = itemKey;
	}
	if (currentGroup.length > 0) groups.push(currentGroup);
	return groups;
}
function renderCollectItem(item, idx) {
	const senderLabel = item.run.senderName ?? item.run.senderUsername ?? item.run.senderId ?? item.run.senderE164;
	const senderSuffix = senderLabel ? ` (from ${senderLabel})` : "";
	return `---\nQueued #${idx + 1}${senderSuffix}\n${item.prompt}`.trim();
}
function collectQueuedImages(items) {
	const images = [];
	const imageOrder = [];
	for (const item of items) {
		if (item.images) images.push(...item.images);
		if (item.imageOrder) imageOrder.push(...item.imageOrder);
	}
	return {
		...images.length > 0 ? { images } : {},
		...imageOrder.length > 0 ? { imageOrder } : {}
	};
}
function hasCurrentTurnRuntimeMetadata(item) {
	return item.currentInboundEventKind === "room_event" || item.currentInboundAudio === true || Boolean(item.currentInboundContext);
}
function hasRuntimeOnlyFollowupMetadata(item) {
	return Boolean(hasCurrentTurnRuntimeMetadata(item) || item.abortSignal || item.deliveryCorrelations?.length || item.queuedLifecycle);
}
function combineAbortSignals(items) {
	const signals = items.flatMap((item) => item.abortSignal ? [item.abortSignal] : []);
	if (signals.length === 0) return;
	if (signals.length === 1) return signals[0];
	const nativeAny = AbortSignal.any;
	if (nativeAny) return nativeAny(signals);
	const controller = new AbortController();
	const abort = () => controller.abort();
	for (const signal of signals) {
		if (signal.aborted) {
			abort();
			break;
		}
		signal.addEventListener("abort", abort, { once: true });
	}
	return controller.signal;
}
function collectRuntimeMetadata(items, singletonOwner) {
	const candidates = singletonOwner ? [singletonOwner, ...items] : items;
	const currentTurnSource = singletonOwner && hasCurrentTurnRuntimeMetadata(singletonOwner) ? singletonOwner : items.find(hasCurrentTurnRuntimeMetadata);
	const abortSignal = singletonOwner?.abortSignal ?? combineAbortSignals(candidates);
	const deliveryCorrelations = items.flatMap((item) => item.deliveryCorrelations ?? []);
	const lifecycleSource = singletonOwner ?? items.find((item) => item.queuedLifecycle);
	return {
		currentInboundEventKind: currentTurnSource?.currentInboundEventKind,
		currentInboundAudio: currentTurnSource?.currentInboundAudio,
		currentInboundContext: currentTurnSource?.currentInboundContext,
		abortSignal,
		deliveryCorrelations: deliveryCorrelations.length > 0 ? deliveryCorrelations : void 0,
		queuedLifecycle: singletonOwner?.queuedLifecycle ?? (items.length === 1 ? lifecycleSource?.queuedLifecycle : void 0)
	};
}
function clearFollowupQueueSummaryState(queue) {
	completeFollowupQueueSummarySources(queue);
	for (const entry of queue.summaryElisions) completeFollowupRunLifecycle(entry.source);
	queue.summaryElisions = [];
	queue.evictedSummaryCount = 0;
	clearQueueSummaryState(queue);
}
function completeFollowupQueueSummarySources(queue) {
	for (const item of queue.summarySources ?? []) completeFollowupRunLifecycle(item);
	if (queue.summarySources) queue.summarySources = [];
}
function createQueueSummaryDelivery(params) {
	const sources = params.sources ? [...params.sources] : [...params.queue.summarySources];
	if (params.sources && !sources.every((source, index) => params.queue.summarySources[index] === source)) return;
	const droppedCount = params.sources ? sources.length : params.queue.droppedCount;
	const summaryLines = params.sources ? params.queue.summaryLines.slice(0, sources.length) : [...params.queue.summaryLines];
	const prompt = previewQueueSummaryPrompt({
		state: {
			dropPolicy: params.queue.dropPolicy,
			droppedCount,
			summaryLines
		},
		noun: "message"
	});
	if (!prompt) return;
	return {
		prompt,
		droppedCount,
		sources
	};
}
function consumeQueueSummaryDelivery(queue, delivery) {
	let consumedCount = delivery.sources.length === 0 ? delivery.droppedCount : 0;
	for (const source of delivery.sources) {
		const sourceIndex = queue.summarySources.indexOf(source);
		if (sourceIndex >= 0) {
			queue.summarySources.splice(sourceIndex, 1);
			queue.summaryLines.splice(sourceIndex, 1);
			consumedCount += 1;
		} else {
			const elisionIndex = queue.summaryElisions.findIndex((entry) => entry.sourceRefs.has(source));
			if (elisionIndex >= 0) {
				const entry = queue.summaryElisions[elisionIndex];
				entry.count = Math.max(0, entry.count - 1);
				consumedCount += 1;
				if (entry.count === 0) queue.summaryElisions.splice(elisionIndex, 1);
			}
		}
		completeFollowupRunLifecycle(source);
	}
	queue.droppedCount = Math.max(0, queue.droppedCount - consumedCount);
}
function releaseQueueSummaryDeliveryForRetry(queue, delivery) {
	for (const source of delivery.sources) {
		const sourceIndex = queue.summarySources.indexOf(source);
		if (sourceIndex >= 0) queue.summarySources[sourceIndex] = createOverflowSummaryRetrySource(source);
		completeFollowupRunLifecycle(source);
	}
}
async function runQueueSummaryDelivery(queue, delivery, run) {
	try {
		await run();
	} catch (err) {
		if (!isFollowupRunDeferredError(err)) releaseQueueSummaryDeliveryForRetry(queue, delivery);
		throw err;
	}
	consumeQueueSummaryDelivery(queue, delivery);
}
async function dropAbortedFollowups(items, runFollowup) {
	let dropped = 0;
	for (let index = items.length - 1; index >= 0; index -= 1) {
		const item = items[index];
		if (isFollowupRunAborted(item)) {
			await runFollowup(item);
			completeFollowupRunLifecycle(item);
			items.splice(index, 1);
			dropped += 1;
		}
	}
	return dropped;
}
function resolveCrossChannelKey(item) {
	const { originatingChannel: channel, originatingTo: to, originatingAccountId: accountId } = item;
	const threadId = item.originatingThreadId;
	const replyToId = resolveFollowupReplyAnchor(item);
	const chatType = normalizeChatType(item.originatingChatType);
	if (!channel && !to && !accountId && (threadId == null || threadId === "") && !item.originatingChatId && !replyToId) return chatType ? { key: JSON.stringify(["unresolved", chatType]) } : {};
	if (!isRoutableChannel(channel) || !to) return { cross: true };
	const key = channelRouteCompactKey({
		channel,
		to,
		accountId,
		threadId
	});
	return key ? { key: JSON.stringify([
		key,
		replyToId ?? "",
		item.originatingReplyToMode ?? "",
		chatType ?? ""
	]) } : { cross: true };
}
function resolveOverflowSummarySourceGroup(queue) {
	const source = queue.summarySources[0];
	if (!source) return [];
	const contextKey = resolveFollowupDeliveryContextKey(source);
	const sources = [];
	for (const candidate of queue.summarySources) {
		if (resolveFollowupDeliveryContextKey(candidate) !== contextKey) break;
		sources.push(candidate);
	}
	return sources;
}
function createOverflowSummaryRetrySource(source) {
	return {
		prompt: source.prompt,
		transcriptPrompt: source.transcriptPrompt,
		messageId: source.messageId,
		summaryLine: source.summaryLine,
		enqueuedAt: source.enqueuedAt,
		originatingChannel: source.originatingChannel,
		originatingTo: source.originatingTo,
		originatingAccountId: source.originatingAccountId,
		originatingThreadId: source.originatingThreadId,
		originatingChatId: source.originatingChatId,
		originatingReplyToId: source.originatingReplyToId,
		originatingReplyToMode: source.originatingReplyToMode,
		originatingChatType: source.originatingChatType,
		run: source.run
	};
}
async function runSyntheticOverflowSummary(params) {
	const promptHash = createHash("sha256").update(params.prompt).digest("hex");
	const routeHash = createHash("sha256").update(JSON.stringify([
		channelRouteDedupeKey({
			channel: params.source.originatingChannel,
			to: params.source.originatingTo,
			accountId: params.source.originatingAccountId,
			threadId: params.source.originatingThreadId
		}),
		resolveFollowupReplyAnchor(params.source) ?? "",
		params.source.originatingReplyToMode ?? "",
		normalizeChatType(params.source.originatingChatType) ?? ""
	])).digest("hex");
	const sessionKey = normalizeOptionalString(params.source.run.sessionKey);
	const storePath = sessionKey ? resolveStorePath(params.source.run.config.session?.store, { agentId: params.source.run.agentId }) : void 0;
	const userTurnTranscriptRecorder = createUserTurnTranscriptRecorder({
		input: {
			text: params.prompt,
			idempotencyKey: `followup-overflow:${params.source.run.sessionId}:${routeHash}:${params.source.messageId ?? params.source.enqueuedAt}:${promptHash}`,
			provenance: params.source.run.inputProvenance
		},
		target: () => {
			if (!sessionKey || !storePath) return {
				transcriptPath: params.source.run.sessionFile,
				sessionId: params.source.run.sessionId,
				agentId: params.source.run.agentId,
				sessionKey: params.source.run.sessionId,
				cwd: params.source.run.cwd ?? params.source.run.workspaceDir,
				config: params.source.run.config
			};
			const sessionEntry = loadSessionEntry({
				storePath,
				sessionKey,
				clone: false
			});
			return {
				sessionId: sessionEntry?.sessionId ?? params.source.run.sessionId,
				sessionKey,
				sessionEntry,
				storePath,
				agentId: params.source.run.agentId,
				cwd: params.source.run.cwd ?? params.source.run.workspaceDir,
				config: params.source.run.config
			};
		},
		beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
		errorContext: "followup overflow summary transcript"
	});
	await params.runFollowup({
		prompt: params.prompt,
		transcriptPrompt: params.prompt,
		messageId: params.source.messageId,
		userTurnTranscriptRecorder,
		run: params.source.run,
		enqueuedAt: Date.now(),
		...resolveOriginRoutingMetadata([params.source])
	});
}
async function drainElidedOverflowSummary(params) {
	const entry = params.queue.summaryElisions[0];
	if (!entry) return false;
	const retainedSources = params.queue.summaryElisions.length === 1 ? resolveOverflowSummarySourceGroup(params.queue).filter((source) => resolveFollowupDeliveryContextKey(source) === entry.contextKey) : [];
	const source = retainedSources.at(-1) ?? entry.source;
	const elidedCount = entry.count;
	const droppedCount = elidedCount + retainedSources.length;
	const summaryLines = params.queue.summaryLines.slice(0, retainedSources.length);
	const prompt = previewQueueSummaryPrompt({
		state: {
			dropPolicy: params.queue.dropPolicy,
			droppedCount,
			summaryLines
		},
		noun: "message"
	});
	if (!prompt) return false;
	await runQueueSummaryDelivery(params.queue, {
		prompt,
		droppedCount: retainedSources.length,
		sources: retainedSources
	}, async () => {
		await runSyntheticOverflowSummary({
			source,
			prompt,
			runFollowup: params.runFollowup
		});
	});
	const entryIndex = params.queue.summaryElisions.indexOf(entry);
	if (entryIndex < 0) return true;
	const consumedCount = Math.min(elidedCount, entry.count);
	entry.count -= consumedCount;
	params.queue.droppedCount = Math.max(0, params.queue.droppedCount - consumedCount);
	if (entry.count === 0) params.queue.summaryElisions.splice(entryIndex, 1);
	return true;
}
async function drainOverflowSummaryGroup(params) {
	if (params.queue.evictedSummaryCount > 0) {
		const evictedCount = params.queue.evictedSummaryCount;
		params.queue.evictedSummaryCount = 0;
		params.queue.droppedCount = Math.max(0, params.queue.droppedCount - evictedCount);
		defaultRuntime.error?.(`followup queue omitted ${evictedCount} route-isolated overflow summar${evictedCount === 1 ? "y" : "ies"} after reaching the summary context cap`);
		return true;
	}
	if (await drainElidedOverflowSummary(params)) return true;
	const sources = resolveOverflowSummarySourceGroup(params.queue);
	const source = sources.at(-1);
	if (!source) return false;
	const delivery = createQueueSummaryDelivery({
		queue: params.queue,
		sources
	});
	if (!delivery) return false;
	await runQueueSummaryDelivery(params.queue, delivery, async () => {
		await runSyntheticOverflowSummary({
			source,
			prompt: delivery.prompt,
			runFollowup: params.runFollowup
		});
	});
	return true;
}
function scheduleFollowupDrain(key, runFollowup) {
	if (FOLLOWUP_QUEUES.get(key)?.draining) {
		rememberFollowupDrainCallback(key, runFollowup);
		return;
	}
	const queue = beginQueueDrain(FOLLOWUP_QUEUES, key);
	if (!queue) return;
	const effectiveRunFollowup = FOLLOWUP_RUN_CALLBACKS.get(key) ?? runFollowup;
	rememberFollowupDrainCallback(key, effectiveRunFollowup);
	(async () => {
		let retryDeferred = false;
		try {
			const collectState = { forceIndividualCollect: false };
			while (queue.items.length > 0 || queue.droppedCount > 0) {
				if (await dropAbortedFollowups(queue.items, effectiveRunFollowup) > 0 && queue.items.length === 0) clearFollowupQueueSummaryState(queue);
				if (queue.items.length === 0 && queue.droppedCount === 0) break;
				await waitForQueueDebounce(queue);
				if (await dropAbortedFollowups(queue.items, effectiveRunFollowup) > 0 && queue.items.length === 0) clearFollowupQueueSummaryState(queue);
				if (queue.items.length === 0 && queue.droppedCount === 0) break;
				if (queue.droppedCount > 0 && await drainOverflowSummaryGroup({
					queue,
					runFollowup: effectiveRunFollowup
				})) continue;
				if (queue.mode === "collect") {
					const isCrossChannel = hasCrossChannelItems(queue.items, resolveCrossChannelKey) || queue.items.some(hasRuntimeOnlyFollowupMetadata);
					if (collectState.forceIndividualCollect && !isCrossChannel && queue.items.length > 1) collectState.forceIndividualCollect = false;
					const collectDrainResult = await drainCollectQueueStep({
						collectState,
						isCrossChannel,
						items: queue.items,
						run: effectiveRunFollowup
					});
					if (collectDrainResult === "empty") break;
					if (collectDrainResult === "drained") continue;
					const contextGroups = splitCollectItemsByDeliveryContext(queue.items.slice());
					if (contextGroups.length === 0) break;
					for (const groupItems of contextGroups) {
						const groupSource = groupItems.at(-1);
						const run = groupSource?.run ?? queue.lastRun;
						if (!run) break;
						const routing = resolveOriginRoutingMetadata(groupItems);
						const prompt = buildCollectPrompt({
							title: "[Queued messages while agent was busy]",
							items: groupItems,
							renderItem: renderCollectItem
						});
						const drainGroup = async () => {
							await effectiveRunFollowup({
								prompt,
								run,
								messageId: groupSource?.messageId ?? (groupSource ? resolveFollowupReplyAnchor(groupSource) : void 0),
								enqueuedAt: Date.now(),
								...routing,
								...collectRuntimeMetadata(groupItems),
								...collectQueuedImages(groupItems)
							});
						};
						await drainGroup();
						removeQueuedItemsByRef(queue.items, groupItems);
					}
					continue;
				}
				if (!await drainNextQueueItem(queue.items, effectiveRunFollowup)) break;
			}
		} catch (err) {
			queue.lastEnqueuedAt = Date.now();
			if (isFollowupRunDeferredError(err)) retryDeferred = true;
			else defaultRuntime.error?.(`followup queue drain failed for ${key}: ${String(err)}`);
		} finally {
			queue.draining = false;
			const hasPendingQueueWork = queue.items.length > 0 || queue.droppedCount > 0;
			if (retryDeferred && hasPendingQueueWork) scheduleFollowupDrain(key, effectiveRunFollowup);
			else if (!hasPendingQueueWork) {
				if (FOLLOWUP_QUEUES.get(key) === queue) {
					FOLLOWUP_QUEUES.delete(key);
					clearFollowupDrainCallback(key);
				}
			} else scheduleFollowupDrain(key, effectiveRunFollowup);
		}
	})();
}
//#endregion
//#region src/auto-reply/reply/queue/cleanup.ts
const defaultQueueCleanupDeps = {
	resolveEmbeddedSessionLane,
	clearCommandLane
};
const queueCleanupDeps = { ...defaultQueueCleanupDeps };
function resolveQueueCleanupLaneResolver() {
	return typeof queueCleanupDeps.resolveEmbeddedSessionLane === "function" ? queueCleanupDeps.resolveEmbeddedSessionLane : defaultQueueCleanupDeps.resolveEmbeddedSessionLane;
}
function resolveQueueCleanupLaneClearer() {
	return typeof queueCleanupDeps.clearCommandLane === "function" ? queueCleanupDeps.clearCommandLane : defaultQueueCleanupDeps.clearCommandLane;
}
function clearSessionQueues(keys) {
	const seen = /* @__PURE__ */ new Set();
	let followupCleared = 0;
	let laneCleared = 0;
	const clearedKeys = [];
	const resolveLane = resolveQueueCleanupLaneResolver();
	const clearLane = resolveQueueCleanupLaneClearer();
	for (const key of keys) {
		const cleaned = normalizeOptionalString(key);
		if (!cleaned || seen.has(cleaned)) continue;
		seen.add(cleaned);
		clearedKeys.push(cleaned);
		followupCleared += clearFollowupQueue(cleaned);
		clearFollowupDrainCallback(cleaned);
		laneCleared += clearLane(resolveLane(cleaned));
	}
	return {
		followupCleared,
		laneCleared,
		keys: clearedKeys
	};
}
//#endregion
//#region src/auto-reply/reply/queue/enqueue.ts
const RECENT_QUEUE_MESSAGE_IDS = resolveGlobalDedupeCache(Symbol.for("openclaw.recentQueueMessageIds"), {
	ttlMs: 300 * 1e3,
	maxSize: 1e4
});
function followupRouteIdentityKey(run) {
	return JSON.stringify([
		channelRouteDedupeKey({
			channel: run.originatingChannel,
			to: run.originatingTo,
			accountId: run.originatingAccountId,
			threadId: run.originatingThreadId
		}),
		resolveFollowupReplyAnchor(run) ?? "",
		run.originatingReplyToMode ?? "",
		normalizeChatType(run.originatingChatType) ?? ""
	]);
}
function followupMessageRouteIdentityKey(run) {
	return JSON.stringify([channelRouteDedupeKey({
		channel: run.originatingChannel,
		to: run.originatingTo,
		accountId: run.originatingAccountId,
		threadId: run.originatingThreadId
	}), normalizeChatType(run.originatingChatType) ?? ""]);
}
function buildRecentMessageIdKey(run, queueKey) {
	const messageId = normalizeOptionalString(run.messageId);
	if (!messageId) return;
	return JSON.stringify([
		"queue",
		queueKey,
		followupMessageRouteIdentityKey(run),
		messageId
	]);
}
function isRunAlreadyQueued(run, items, allowPromptFallback = false) {
	const messageId = normalizeOptionalString(run.messageId);
	if (messageId) {
		const messageRouteKey = followupMessageRouteIdentityKey(run);
		return items.some((item) => normalizeOptionalString(item.messageId) === messageId && followupMessageRouteIdentityKey(item) === messageRouteKey);
	}
	if (!allowPromptFallback) return false;
	const routeKey = followupRouteIdentityKey(run);
	return items.some((item) => item.prompt === run.prompt && followupRouteIdentityKey(item) === routeKey);
}
function enqueueFollowupRun(key, run, settings, dedupeMode = "message-id", runFollowup, restartIfIdle = true) {
	if (isFollowupRunAborted(run)) return false;
	const queue = getFollowupQueue(key, settings);
	const recentMessageIdKey = dedupeMode !== "none" ? buildRecentMessageIdKey(run, key) : void 0;
	if (recentMessageIdKey && RECENT_QUEUE_MESSAGE_IDS.peek(recentMessageIdKey)) return false;
	const dedupe = dedupeMode === "none" ? void 0 : (item, items) => isRunAlreadyQueued(item, items, dedupeMode === "prompt");
	if (shouldSkipQueueItem({
		item: run,
		items: queue.items,
		dedupe
	})) return false;
	queue.lastEnqueuedAt = Date.now();
	queue.lastRun = run.run;
	const shouldEnqueue = applyQueueDropPolicy({
		queue,
		summarize: (item) => normalizeOptionalString(item.summaryLine) || item.prompt.trim(),
		onDrop: (dropped) => {
			if (queue.dropPolicy === "summarize") {
				queue.summarySources.push(...dropped);
				return;
			}
			for (const item of dropped) completeFollowupRunLifecycle(item);
		}
	});
	if (queue.dropPolicy === "summarize") {
		const overflow = queue.summarySources.length - queue.summaryLines.length;
		if (overflow > 0) {
			const removed = queue.summarySources.splice(0, overflow);
			for (const item of removed) {
				const contextKey = resolveFollowupDeliveryContextKey(item);
				const lastElision = queue.summaryElisions.at(-1);
				if (lastElision?.contextKey === contextKey) {
					lastElision.count += 1;
					lastElision.source = createOverflowSummaryRetrySource(item);
					lastElision.sourceRefs.add(item);
				} else {
					if (queue.summaryElisions.length >= queue.cap) {
						const evicted = queue.summaryElisions.shift();
						if (evicted) {
							queue.evictedSummaryCount += evicted.count;
							completeFollowupRunLifecycle(evicted.source);
						}
					}
					queue.summaryElisions.push({
						contextKey,
						count: 1,
						source: createOverflowSummaryRetrySource(item),
						sourceRefs: new WeakSet([item])
					});
				}
				completeFollowupRunLifecycle(item);
			}
		}
	}
	if (!shouldEnqueue) return false;
	queue.items.push(run);
	markFollowupRunEnqueued(run);
	if (recentMessageIdKey) RECENT_QUEUE_MESSAGE_IDS.check(recentMessageIdKey);
	if (runFollowup) rememberFollowupDrainCallback(key, runFollowup);
	if (restartIfIdle && !queue.draining) kickFollowupDrainIfIdle(key);
	return true;
}
function getFollowupQueueDepth(key) {
	const queue = getExistingFollowupQueue(key);
	if (!queue) return 0;
	return queue.items.length;
}
//#endregion
//#region src/auto-reply/reply/queue/settings.ts
/** Resolve per-channel debounce override from debounceMsByChannel map. */
function resolveChannelDebounce(byChannel, channelKey) {
	if (!channelKey || !byChannel) return;
	const value = byChannel[channelKey];
	return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : void 0;
}
function resolveQueueSettings$1(params) {
	const channelKey = normalizeOptionalLowercaseString(params.channel);
	const queueCfg = params.cfg.messages?.queue;
	const providerModeRaw = channelKey && queueCfg?.byChannel ? queueCfg.byChannel[channelKey] : void 0;
	const resolvedMode = params.inlineMode ?? normalizePersistedQueueMode(params.sessionEntry?.queueMode) ?? normalizeQueueMode(providerModeRaw) ?? normalizeQueueMode(queueCfg?.mode) ?? "steer";
	const debounceRaw = params.inlineOptions?.debounceMs ?? params.sessionEntry?.queueDebounceMs ?? resolveChannelDebounce(queueCfg?.debounceMsByChannel, channelKey) ?? params.pluginDebounceMs ?? queueCfg?.debounceMs ?? 500;
	const capRaw = params.inlineOptions?.cap ?? params.sessionEntry?.queueCap ?? queueCfg?.cap ?? 20;
	const dropRaw = params.inlineOptions?.dropPolicy ?? params.sessionEntry?.queueDrop ?? normalizeQueueDropPolicy(queueCfg?.drop) ?? "summarize";
	return {
		mode: resolvedMode,
		debounceMs: typeof debounceRaw === "number" ? Math.max(0, debounceRaw) : void 0,
		cap: typeof capRaw === "number" ? Math.max(1, Math.floor(capRaw)) : void 0,
		dropPolicy: dropRaw
	};
}
//#endregion
//#region src/auto-reply/reply/queue/settings-runtime.ts
/** Resolves plugin-provided debounce defaults for a channel queue. */
function resolvePluginDebounce(channelKey) {
	if (!channelKey) return;
	const value = getLoadedChannelPlugin(channelKey)?.defaults?.queue?.debounceMs;
	return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : void 0;
}
/** Resolves queue settings with channel plugin defaults layered into core config. */
function resolveQueueSettings(params) {
	const channelKey = normalizeOptionalLowercaseString(params.channel);
	return resolveQueueSettings$1({
		...params,
		pluginDebounceMs: params.pluginDebounceMs ?? resolvePluginDebounce(channelKey)
	});
}
//#endregion
export { skipDirectiveArgPrefix as _, clearSessionQueues as a, FollowupRunDeferredError as c, buildPersistedUserTurnMediaInputsFromFields as d, createUserTurnTranscriptRecorder as f, extractQueueDirective as g, resolvePersistedUserTurnText as h, getFollowupQueueDepth as i, completeFollowupRunLifecycle as l, preparePersistedUserTurnMessageForTranscriptWrite as m, resolveQueueSettings$1 as n, scheduleFollowupDrain as o, mergePreparedUserTurnMessageForRuntime as p, enqueueFollowupRun as r, refreshQueuedFollowupSession as s, resolveQueueSettings as t, isFollowupRunAborted as u, takeDirectiveToken as v };
