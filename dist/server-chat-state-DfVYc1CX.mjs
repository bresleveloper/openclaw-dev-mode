import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { p as stripInternalRuntimeContext } from "./internal-runtime-context-BH-o1oq1.mjs";
import { c as stripLeadingSilentToken, n as SILENT_REPLY_TOKEN, s as startsWithSilentToken } from "./tokens-BTKQYTUd.mjs";
import { _t as AgentActivityItemSchema } from "./sessions-KsldKmtI.mjs";
import { c as resolveAssistantEventPhase } from "./chat-message-content-D14VlZZc.mjs";
import { c as stripInlineDirectiveTagsForDisplay } from "./directive-tags-D9uZSb5h.mjs";
import { t as isCompleteAgentPreamble } from "./agent-activity-presentation-DIuWOqb_.mjs";
import { n as splitMediaOutput, t as isRelativeAssistantMediaReference } from "./parse-output-ygpVIskU.mjs";
import { n as isSuppressedControlReplyText, r as stripSuppressedControlReplyToken, t as isSuppressedControlReplyLeadFragment } from "./control-reply-text-CDvIm13S.mjs";
import { g as stripAssistantMediaDirectivesForDisplay } from "./chat-display-projection.helpers-BloZC0RQ.mjs";
import { n as splitTrailingDirective } from "./streaming-directives-5QCrCZMI.mjs";
import { Value } from "typebox/value";
//#region src/gateway/live-chat-projector.ts
const MAX_LIVE_CHAT_BUFFER_CHARS = 5e5;
/** Cap live display text without letting later snapshots resurrect the retired prefix. */
function capLiveAssistantText(snapshot) {
	const { text, scope } = snapshot;
	const capped = text.length > MAX_LIVE_CHAT_BUFFER_CHARS ? sliceUtf16Safe(text, -5e5) : text;
	if (scope) {
		const retired = text.length - capped.length;
		const retiredAfterPrefix = Math.max(0, retired - scope.prefix.length);
		scope.boundaryNewlines = retiredAfterPrefix > scope.separatorLength ? 0 : Math.max(0, scope.boundaryNewlines - retiredAfterPrefix);
		scope.separatorLength = Math.max(0, scope.separatorLength - retiredAfterPrefix);
		scope.prefix = sliceUtf16Safe(scope.prefix, retired);
	}
	return capped;
}
/** Removes runtime-only context/directive tags from the merged live assistant buffer. */
function normalizeLiveAssistantBufferedText(text, options) {
	const normalized = stripInternalRuntimeContext(stripInlineDirectiveTagsForDisplay(text).text);
	const trailing = options?.final ? {
		text: normalized,
		tail: ""
	} : splitTrailingDirective(normalized);
	const parsedTail = trailing.tail ? splitMediaOutput(trailing.tail, { extractAudioDirectives: false }) : void 0;
	const withoutPendingMediaTail = parsedTail?.mediaUrls?.length && parsedTail.mediaUrls.every((url) => !isRelativeAssistantMediaReference(url)) ? normalized : trailing.text;
	return stripAssistantMediaDirectivesForDisplay(withoutPendingMediaTail, options?.managedMediaUrls ?? []);
}
/** Projects buffered assistant text into display text or a suppressed/pending state. */
function projectLiveAssistantBufferedText(rawText, options) {
	if (!rawText) return {
		text: "",
		suppress: true,
		pendingLeadFragment: false
	};
	if (isSuppressedControlReplyText(rawText)) return {
		text: "",
		suppress: true,
		pendingLeadFragment: false
	};
	if (options?.suppressLeadFragments !== false && isSuppressedControlReplyLeadFragment(rawText)) return {
		text: rawText,
		suppress: true,
		pendingLeadFragment: true
	};
	const withoutTrailingControlToken = stripSuppressedControlReplyToken(rawText);
	if (!withoutTrailingControlToken) return {
		text: "",
		suppress: true,
		pendingLeadFragment: false
	};
	const text = startsWithSilentToken(withoutTrailingControlToken, "NO_REPLY") ? stripLeadingSilentToken(withoutTrailingControlToken, SILENT_REPLY_TOKEN) : withoutTrailingControlToken;
	if (!text || isSuppressedControlReplyText(text)) return {
		text: "",
		suppress: true,
		pendingLeadFragment: false
	};
	if (options?.suppressLeadFragments !== false && isSuppressedControlReplyLeadFragment(text)) return {
		text,
		suppress: true,
		pendingLeadFragment: true
	};
	return {
		text,
		suppress: false,
		pendingLeadFragment: false
	};
}
/** Returns true when an assistant event phase should not appear in live chat. */
function shouldSuppressAssistantEventForLiveChat(data) {
	return resolveAssistantEventPhase(data) === "commentary";
}
//#endregion
//#region src/gateway/server-chat-progress-snapshot.ts
const CHAT_RUN_PROGRESS_MAX_EVENTS = 50;
const CHAT_RUN_PROGRESS_MAX_BYTES = 131072;
const CHAT_RUN_PROGRESS_MAX_EVENT_BYTES = 65536;
const CHAT_RUN_PROGRESS_MAX_REVIEWS_PER_TOOL = 16;
const retainedEventBytes = /* @__PURE__ */ new WeakMap();
function freezeCapturedProgress(value) {
	if (value === null || typeof value !== "object") return;
	for (const child of Object.values(value)) freezeCapturedProgress(child);
	Object.freeze(value);
}
function captureProgressEvent(event) {
	try {
		const json = JSON.stringify(event);
		const byteLength = Buffer.byteLength(json, "utf8");
		if (byteLength > CHAT_RUN_PROGRESS_MAX_EVENT_BYTES) return;
		const captured = JSON.parse(json);
		freezeCapturedProgress(captured);
		if (!asNullableRecord(captured.data)) return;
		retainedEventBytes.set(captured, byteLength);
		return {
			event: captured,
			byteLength
		};
	} catch {
		return;
	}
}
function updateChatRunProgressSnapshot(snapshot, event, mode = "full") {
	const data = event.data ?? {};
	const phase = typeof data.phase === "string" ? data.phase : "";
	const toolCallId = typeof data.toolCallId === "string" ? data.toolCallId.trim() : "";
	const review = asNullableRecord(data.review) ?? void 0;
	const reviewId = typeof review?.id === "string" ? review.id.trim() : "";
	const isStartupStatus = event.stream === "run_status" && [
		"preparing_workspace",
		"naming_worktree",
		"creating_worktree",
		"running_setup",
		"provisioning_environment",
		"preparing_context",
		"memory_flushing",
		"starting_model"
	].includes(phase);
	const isRetryStatus = event.stream === "run_status" && phase === "retrying";
	const isAssistant = event.stream === "assistant" && Boolean(snapshot?.events.some((candidate) => candidate.stream === "run_status"));
	const preambleItemId = typeof data.itemId === "string" && data.itemId.trim() ? data.itemId.trim() : typeof data.id === "string" && data.id.trim() ? data.id.trim() : "";
	const isTool = event.stream === "tool" && Boolean(toolCallId) && [
		"start",
		"input_delta",
		"update",
		"review",
		"result"
	].includes(phase) && (phase !== "review" || mode === "full" && Boolean(reviewId));
	const isPreamble = event.stream === "item" && data.kind === "preamble";
	const isItem = event.stream === "item" && (Boolean(preambleItemId) || isPreamble);
	const validItem = !isItem || isPreamble || Value.Check({
		...AgentActivityItemSchema,
		additionalProperties: true
	}, data);
	if (isItem && !isPreamble && !validItem) return snapshot;
	const isUsage = event.stream === "usage";
	const isNotice = event.stream === "notice" && phase === "warning";
	const guardianTargetItemId = typeof data.targetItemId === "string" ? data.targetItemId.trim() : "";
	const isGuardian = event.stream === "codex_app_server.guardian";
	const isStandaloneGuardian = isGuardian && (phase === "warning" || phase === "strict_review_required" || (phase === "started" || phase === "completed") && !guardianTargetItemId);
	const resolvesStrictReview = isGuardian && phase === "completed" && Boolean(guardianTargetItemId) && snapshot?.events.some((candidate) => candidate.stream === event.stream && candidate.data.phase === "strict_review_required" && candidate.data.reviewId === data.reviewId);
	if (mode === "summary" && !isTool && !isItem && !isUsage && !isRetryStatus && !isAssistant) return snapshot;
	if (!isTool && !isItem && !isUsage && !isStartupStatus && !isRetryStatus && !isAssistant && !isStandaloneGuardian && !isNotice && !resolvesStrictReview) return snapshot;
	const next = snapshot ?? {
		events: [],
		byteLength: 0,
		lastSeq: 0
	};
	if (event.seq <= next.lastSeq) return next;
	next.lastSeq = event.seq;
	if (isPreamble && !preambleItemId && !(typeof data.progressText === "string" && data.progressText.trim())) return next;
	if (isPreamble && !isCompleteAgentPreamble({
		phase,
		progressText: typeof data.progressText === "string" ? data.progressText : void 0
	})) return next;
	const matchesPreamble = (candidate) => candidate.stream === "item" && candidate.data?.kind === "preamble" && (candidate.data.itemId ?? "") === preambleItemId;
	const previousPreamble = preambleItemId ? next.events.find(matchesPreamble) : void 0;
	const previousUsage = isUsage ? next.events.find((candidate) => candidate.stream === "usage") : void 0;
	const removeWhere = (predicate) => {
		next.events = next.events.filter((candidate) => {
			if (!predicate(candidate)) return true;
			next.byteLength -= retainedEventBytes.get(candidate);
			return false;
		});
	};
	if (isStartupStatus && next.events.some((candidate) => candidate.stream === "tool" || candidate.stream === "item")) return next;
	if (isUsage) removeWhere((candidate) => candidate.stream === "usage");
	else if (isStartupStatus || isRetryStatus || isAssistant || isTool || isItem) {
		removeWhere((candidate) => {
			if (candidate.stream === "run_status" || candidate.stream === "assistant") return true;
			if (isPreamble) return matchesPreamble(candidate);
			if (isItem) return candidate.stream === "item" && candidate.data.itemId === preambleItemId;
			if (!isTool || candidate.stream !== "tool" || candidate.data?.toolCallId !== toolCallId) return false;
			if (phase === "start") return true;
			if (phase === "result") return candidate.data?.phase === "result";
			if (phase !== "review" || candidate.data?.phase !== "review") return candidate.data?.phase === phase;
			return asNullableRecord(candidate.data.review)?.id === reviewId;
		});
		if (isPreamble && !(typeof data.progressText === "string" && data.progressText.trim())) return next;
	} else if ((isStandaloneGuardian || resolvesStrictReview) && typeof data.reviewId === "string") {
		removeWhere((candidate) => candidate.stream === event.stream && candidate.data?.reviewId === data.reviewId);
		if (resolvesStrictReview) return next;
	}
	const storedData = isTool ? mode === "summary" ? {
		phase,
		name: typeof data.name === "string" ? data.name : void 0,
		toolCallId
	} : {
		phase,
		name: typeof data.name === "string" ? data.name : void 0,
		toolCallId,
		...phase === "start" ? { args: data.args } : phase === "update" ? { partialResult: data.partialResult } : phase === "input_delta" ? { diff: data.diff } : phase === "review" ? {
			review: data.review,
			approvalReviewOutcome: data.approvalReviewOutcome
		} : phase === "result" ? {
			approvalReviewOutcome: data.approvalReviewOutcome,
			isError: data.isError,
			result: data.result
		} : {}
	} : isAssistant ? {} : isPreamble ? {
		kind: "preamble",
		phase: data.phase,
		title: data.title,
		status: data.status,
		itemId: preambleItemId || void 0,
		progressText: data.progressText
	} : {
		...previousUsage?.data,
		...data
	};
	for (const key of Object.keys(storedData)) if (storedData[key] === void 0) delete storedData[key];
	const storedEvent = {
		runId: event.runId,
		seq: event.seq,
		stream: event.stream,
		ts: previousPreamble?.ts ?? event.ts,
		data: storedData,
		...event.sessionKey ? { sessionKey: event.sessionKey } : {},
		...event.agentId ? { agentId: event.agentId } : {}
	};
	let captured = captureProgressEvent(storedEvent);
	if (!captured && isTool) {
		delete storedData.args;
		delete storedData.partialResult;
		delete storedData.diff;
		delete storedData.result;
		captured = captureProgressEvent(storedEvent);
	}
	if (!captured) return next;
	next.events.push(captured.event);
	next.byteLength += captured.byteLength;
	if (phase === "review") {
		const reviews = next.events.filter((candidate) => candidate.stream === "tool" && candidate.data?.toolCallId === toolCallId && candidate.data?.phase === "review");
		const overflow = reviews.length - CHAT_RUN_PROGRESS_MAX_REVIEWS_PER_TOOL;
		if (overflow > 0) {
			const evicted = new Set(reviews.slice(0, overflow));
			removeWhere((candidate) => evicted.has(candidate));
		}
	}
	while (next.events.length > CHAT_RUN_PROGRESS_MAX_EVENTS || next.byteLength > CHAT_RUN_PROGRESS_MAX_BYTES) {
		const oldest = next.events.find((candidate) => candidate.stream !== "usage");
		if (!oldest) break;
		const oldestToolCallId = (oldest.stream === "tool" || oldest.stream === "item") && typeof oldest.data?.toolCallId === "string" ? oldest.data.toolCallId : "";
		removeWhere((candidate) => oldestToolCallId ? (candidate.stream === "tool" || candidate.stream === "item") && candidate.data?.toolCallId === oldestToolCallId : candidate === oldest);
	}
	return next;
}
//#endregion
//#region src/gateway/server-chat-state.ts
let chatRunOrderingSequence = 0;
function nextChatRunOrderingSequence() {
	chatRunOrderingSequence += 1;
	return chatRunOrderingSequence;
}
/** Stamp a chat run registration with the process-local ordering metadata used for abort freshness checks. */
function createChatRunEntry(entry) {
	return {
		...entry,
		registeredSequence: nextChatRunOrderingSequence()
	};
}
/** Create an abort marker ordered against chat run registrations, using a shared monotonic sequence. */
function createChatAbortMarker(now = Date.now()) {
	return {
		abortedAtMs: now,
		sequence: nextChatRunOrderingSequence()
	};
}
/** Return the wall-clock timestamp used by maintenance TTL pruning. */
function chatAbortMarkerTimestampMs(marker) {
	return marker.abortedAtMs;
}
/**
* Return whether an abort marker should suppress events for the given chat run registration.
* The shared monotonic sequence keeps same-millisecond aborts ordered; a missing
* entry preserves suppress-on-presence behavior.
*/
function isChatAbortMarkerCurrent(marker, entry) {
	if (marker === void 0) return false;
	return !entry || marker.sequence >= entry.registeredSequence;
}
function createChatRunRecordStore() {
	const runs = /* @__PURE__ */ new Map();
	const getOrCreate = (runId) => {
		const existing = runs.get(runId);
		if (existing) return existing;
		const record = {};
		runs.set(runId, record);
		return record;
	};
	const releaseIfEmpty = (runId) => {
		const record = runs.get(runId);
		if (!record || Object.keys(record).length > 0) return;
		runs.delete(runId);
	};
	return {
		runs,
		getOrCreate,
		releaseIfEmpty
	};
}
function clearPendingLiveTextFlushes(record) {
	for (const pending of Object.values(record.pendingTextFlushes ?? {})) clearTimeout(pending.timer);
	delete record.pendingTextFlushes;
}
function createChatRunRegistryForStore(store) {
	const add = (sessionId, entry) => {
		const registeredEntry = createChatRunEntry(entry);
		const record = store.getOrCreate(sessionId);
		const queue = record.registrations;
		if (queue) queue.push(registeredEntry);
		else record.registrations = [registeredEntry];
	};
	const peek = (sessionId) => store.runs.get(sessionId)?.registrations?.[0];
	const shift = (sessionId) => {
		const record = store.runs.get(sessionId);
		if (!record) return;
		const queue = record.registrations;
		if (!queue || queue.length === 0) return;
		const entry = queue.shift();
		if (!queue.length) {
			delete record.registrations;
			store.releaseIfEmpty(sessionId);
		}
		return entry;
	};
	const remove = (sessionId, clientRunId, sessionKey) => {
		const record = store.runs.get(sessionId);
		if (!record) return;
		const queue = record.registrations;
		if (!queue || queue.length === 0) return;
		const idx = queue.findIndex((entry) => entry.clientRunId === clientRunId && (sessionKey ? entry.sessionKey === sessionKey : true));
		if (idx < 0) return;
		const [entry] = queue.splice(idx, 1);
		if (!queue.length) {
			delete record.registrations;
			store.releaseIfEmpty(sessionId);
		}
		return entry;
	};
	return {
		add,
		peek,
		shift,
		remove
	};
}
/** Create the single record map used by Gateway chat-run runtime state. */
function createChatRunState() {
	const store = createChatRunRecordStore();
	const registry = createChatRunRegistryForStore(store);
	const toolEventRecipients = createToolEventRecipientRegistryForStore(store);
	const recordProgressEvent = (runId, event, mode) => {
		const progressSnapshot = updateChatRunProgressSnapshot(store.runs.get(runId)?.progressSnapshot, event, mode);
		if (progressSnapshot) store.getOrCreate(runId).progressSnapshot = progressSnapshot;
	};
	const clearRun = (runId) => {
		const record = store.runs.get(runId);
		if (!record) return;
		delete record.rawBuffer;
		delete record.buffer;
		delete record.bufferIsCurrent;
		record.liveTextGroup?.abort();
		delete record.liveTextGroup;
		delete record.bufferProjection;
		delete record.planSnapshot;
		delete record.progressSnapshot;
		delete record.canvasBlocks;
		delete record.bufferUpdatedAt;
		delete record.deltaSentAt;
		delete record.assistantScope;
		delete record.managedMediaUrls;
		delete record.deltaLastBroadcastText;
		clearPendingLiveTextFlushes(record);
		delete record.agentText;
		store.releaseIfEmpty(runId);
	};
	const clear = () => {
		for (const record of store.runs.values()) {
			clearPendingLiveTextFlushes(record);
			record.liveTextGroup?.abort();
		}
		store.runs.clear();
	};
	const resolveBuffer = (runId, options) => {
		const record = store.runs.get(runId);
		if (!record || record.bufferIsCurrent?.() === false) return projectLiveAssistantBufferedText("");
		const rawText = record.rawBuffer;
		if (rawText === void 0) return projectLiveAssistantBufferedText(record.buffer ?? "");
		if (!options?.final && record.bufferProjection?.source === rawText && record.buffer !== void 0) return {
			text: record.buffer,
			suppress: record.bufferProjection.suppress
		};
		const projected = projectLiveAssistantBufferedText(normalizeLiveAssistantBufferedText(rawText, {
			...options,
			managedMediaUrls: record.managedMediaUrls ? [...record.managedMediaUrls] : void 0
		}));
		if (!options?.final) {
			record.buffer = projected.text;
			record.bufferProjection = {
				source: rawText,
				suppress: projected.suppress
			};
		}
		return projected;
	};
	return {
		runs: store.runs,
		registry,
		toolEventRecipients,
		getOrCreate: store.getOrCreate,
		resolveBuffer,
		flushPendingText: (runId) => {
			const record = store.runs.get(runId);
			if (!record) return;
			const pending = Object.values(record.pendingTextFlushes ?? {});
			clearPendingLiveTextFlushes(record);
			for (const flush of pending) flush.flush();
		},
		hasAbortMarker: (runId) => store.runs.get(runId)?.abortMarker !== void 0,
		deleteAbortMarker: (runId) => {
			const record = store.runs.get(runId);
			if (!record) return;
			delete record.abortMarker;
			store.releaseIfEmpty(runId);
		},
		recordProgressEvent,
		clearRun,
		clear
	};
}
const TOOL_EVENT_RECIPIENT_TTL_MS = 6e5;
const TOOL_EVENT_RECIPIENT_FINAL_GRACE_MS = 3e4;
/** Create the broad sessions.changed subscriber registry. */
function createSessionEventSubscriberRegistry(isConnectionActive) {
	const connIds = /* @__PURE__ */ new Set();
	const empty = /* @__PURE__ */ new Set();
	return {
		subscribe: (connId) => {
			const normalized = connId.trim();
			if (!normalized || isConnectionActive?.(normalized) === false) return;
			connIds.add(normalized);
		},
		unsubscribe: (connId) => {
			const normalized = connId.trim();
			if (!normalized) return;
			connIds.delete(normalized);
		},
		getAll: () => connIds.size > 0 ? connIds : empty
	};
}
/** Create the per-session message subscriber registry. */
function createSessionMessageSubscriberRegistry(isConnectionActive) {
	const sessionToConnIds = /* @__PURE__ */ new Map();
	const connections = /* @__PURE__ */ new Map();
	const approvalSessionToConnIds = /* @__PURE__ */ new Map();
	const changeListeners = /* @__PURE__ */ new Set();
	const empty = /* @__PURE__ */ new Set();
	let subscriptionSequence = 0;
	const normalize = (value) => value.trim();
	const setMessageSubscription = (connId, sessionKey, subscribed) => {
		const connIds = sessionToConnIds.get(sessionKey);
		const wasSubscribed = connIds?.has(connId) === true;
		if (subscribed) {
			const nextConnIds = connIds ?? /* @__PURE__ */ new Set();
			nextConnIds.add(connId);
			sessionToConnIds.set(sessionKey, nextConnIds);
			if (!wasSubscribed) for (const listener of changeListeners) listener(sessionKey);
			return;
		}
		connIds?.delete(connId);
		if (connIds?.size === 0) sessionToConnIds.delete(sessionKey);
		if (wasSubscribed) for (const listener of changeListeners) listener(sessionKey);
	};
	const setApprovalSubscription = (connId, sessionKey, subscribed) => {
		const connIds = approvalSessionToConnIds.get(sessionKey);
		if (subscribed) {
			const nextConnIds = connIds ?? /* @__PURE__ */ new Set();
			nextConnIds.add(connId);
			approvalSessionToConnIds.set(sessionKey, nextConnIds);
			return;
		}
		connIds?.delete(connId);
		if (connIds?.size === 0) approvalSessionToConnIds.delete(sessionKey);
	};
	return {
		subscribe: (connId, sessionKey, opts) => {
			const normalizedConnId = normalize(connId);
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedConnId || !normalizedSessionKey || isConnectionActive?.(normalizedConnId) === false) return;
			const states = connections.get(normalizedConnId) ?? /* @__PURE__ */ new Map();
			const previous = states.get(normalizedSessionKey);
			const state = typeof previous === "object" ? previous : {
				base: previous,
				inflight: 0
			};
			state.inflight += 1;
			states.set(normalizedSessionKey, state);
			connections.set(normalizedConnId, states);
			subscriptionSequence += 1;
			const provisionalRecency = subscriptionSequence;
			setMessageSubscription(normalizedConnId, normalizedSessionKey, true);
			setApprovalSubscription(normalizedConnId, normalizedSessionKey, opts?.includeApprovals === true);
			let settled = false;
			const settle = (succeeded) => {
				if (settled || connections.get(normalizedConnId)?.get(normalizedSessionKey) !== state) return;
				settled = true;
				if (succeeded) {
					if (provisionalRecency >= (state.lastSuccess?.sequence ?? -Infinity)) state.lastSuccess = {
						sequence: provisionalRecency,
						includeApprovals: opts?.includeApprovals === true
					};
				}
				state.inflight -= 1;
				if (state.inflight > 0) return;
				const committed = state.lastSuccess?.includeApprovals ?? state.base;
				if (committed === void 0) {
					states.delete(normalizedSessionKey);
					setMessageSubscription(normalizedConnId, normalizedSessionKey, false);
					setApprovalSubscription(normalizedConnId, normalizedSessionKey, false);
				} else {
					states.set(normalizedSessionKey, committed);
					setMessageSubscription(normalizedConnId, normalizedSessionKey, true);
					setApprovalSubscription(normalizedConnId, normalizedSessionKey, committed);
				}
				if (states.size === 0) connections.delete(normalizedConnId);
			};
			const rollback = (() => settle(false));
			rollback.commit = () => settle(true);
			if (!opts?.provisional) {
				rollback.commit();
				return;
			}
			return rollback;
		},
		unsubscribe: (connId, sessionKey) => {
			const normalizedConnId = normalize(connId);
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedConnId || !normalizedSessionKey) return;
			const states = connections.get(normalizedConnId);
			states?.delete(normalizedSessionKey);
			if (states?.size === 0) connections.delete(normalizedConnId);
			setMessageSubscription(normalizedConnId, normalizedSessionKey, false);
			setApprovalSubscription(normalizedConnId, normalizedSessionKey, false);
		},
		unsubscribeAll: (connId) => {
			const normalizedConnId = normalize(connId);
			if (!normalizedConnId) return;
			const states = connections.get(normalizedConnId);
			if (!states) return;
			connections.delete(normalizedConnId);
			for (const sessionKey of states.keys()) setMessageSubscription(normalizedConnId, sessionKey, false);
			for (const sessionKey of states.keys()) setApprovalSubscription(normalizedConnId, sessionKey, false);
		},
		get: (sessionKey) => {
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedSessionKey) return empty;
			return sessionToConnIds.get(normalizedSessionKey) ?? empty;
		},
		getApprovals: (sessionKey) => {
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedSessionKey) return empty;
			return approvalSessionToConnIds.get(normalizedSessionKey) ?? empty;
		},
		onChange: (listener) => {
			changeListeners.add(listener);
			return () => changeListeners.delete(listener);
		}
	};
}
function createToolEventRecipientRegistryForStore(store) {
	let nextPruneAt = Infinity;
	const pruneExpired = (now = Date.now()) => {
		if (now < nextPruneAt) return;
		nextPruneAt = Infinity;
		for (const [runId, record] of store.runs) {
			const entry = record.toolRecipient;
			if (!entry) continue;
			const cutoff = entry.finalizedAt ? entry.finalizedAt + TOOL_EVENT_RECIPIENT_FINAL_GRACE_MS : entry.updatedAt + TOOL_EVENT_RECIPIENT_TTL_MS;
			if (now >= cutoff) {
				delete record.toolRecipient;
				store.releaseIfEmpty(runId);
			} else nextPruneAt = Math.min(nextPruneAt, cutoff);
		}
	};
	const prune = (updated) => {
		nextPruneAt = Math.min(nextPruneAt, updated.finalizedAt ? updated.finalizedAt + TOOL_EVENT_RECIPIENT_FINAL_GRACE_MS : updated.updatedAt + TOOL_EVENT_RECIPIENT_TTL_MS);
		pruneExpired();
	};
	const add = (runId, connId) => {
		if (!runId || !connId) return;
		const now = Date.now();
		const entry = store.getOrCreate(runId).toolRecipient ??= {
			connIds: /* @__PURE__ */ new Set(),
			updatedAt: now
		};
		entry.connIds.add(connId);
		entry.updatedAt = now;
		prune(entry);
	};
	const get = (runId) => {
		const entry = store.runs.get(runId)?.toolRecipient;
		if (entry) {
			entry.updatedAt = Date.now();
			prune(entry);
		}
		return store.runs.get(runId)?.toolRecipient?.connIds;
	};
	const markFinal = (runId) => {
		const entry = store.runs.get(runId)?.toolRecipient;
		if (!entry) return;
		entry.finalizedAt = Date.now();
		prune(entry);
	};
	return {
		add,
		get,
		markFinal,
		pruneExpired
	};
}
//#endregion
export { createSessionMessageSubscriberRegistry as a, normalizeLiveAssistantBufferedText as c, createSessionEventSubscriberRegistry as i, projectLiveAssistantBufferedText as l, createChatAbortMarker as n, isChatAbortMarkerCurrent as o, createChatRunState as r, capLiveAssistantText as s, chatAbortMarkerTimestampMs as t, shouldSuppressAssistantEventForLiveChat as u };
