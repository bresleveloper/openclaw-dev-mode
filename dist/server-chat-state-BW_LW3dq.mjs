import { i as asOptionalObjectRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { K as deepFreezeDiagnosticValue } from "./diagnostic-events-C91J-XX8.mjs";
import { Ct as AgentActivityItemSchema } from "./sessions-CVESrViJ.mjs";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-C0-PtdPX.mjs";
import { i as projectLiveAssistantBufferedText, n as createLiveAssistantTextProjection, r as normalizeLiveAssistantBufferedText, t as capLiveAssistantText } from "./live-chat-projector-DlxjyyYR.mjs";
import { t as isCompleteAgentPreamble } from "./agent-activity-presentation-0UzpmALS.mjs";
import { randomUUID } from "node:crypto";
import { types } from "node:util";
import { Value } from "typebox/value";
//#region src/gateway/agent-event-assistant-text.ts
/** A text-bearing empty result clears output; a missing text payload does not. */
function resolveAssistantResultText(result) {
	const payloads = asOptionalObjectRecord(result)?.payloads;
	const texts = Array.isArray(payloads) ? payloads.flatMap((payload) => {
		const text = asOptionalObjectRecord(payload)?.text;
		return typeof text === "string" ? [text] : [];
	}) : [];
	return texts.length > 0 ? texts.filter(Boolean).join("\n\n") : void 0;
}
/** Both HTTP transports share buffering; each owns its terminal error policy. */
function createAssistantTextStream(holdOutput) {
	let current = { text: "" };
	let streamed = current;
	let pending;
	return {
		get streamedText() {
			return streamed.text;
		},
		update(data) {
			const input = resolveAssistantTextInput(data);
			if (!input) return {};
			if (input.replaceable || pending) {
				pending = mergeAssistantText(pending ?? current, !input.itemId && input.text !== void 0 ? {
					...input,
					replace: true
				} : input, "append-only");
				return !input.replaceable && input.replace && input.text !== void 0 && pending.text.startsWith(streamed.text) ? { replacement: "representable" } : {};
			}
			const previous = current;
			const merged = mergeAssistantText(previous, input, "append-only");
			current = merged;
			if (holdOutput) return {};
			const delta = previous === streamed && merged.appendedText !== void 0 ? merged.appendedText : merged.text.startsWith(streamed.text) ? merged.text.slice(streamed.text.length) : void 0;
			if (delta === void 0) return { replacement: "unrepresentable" };
			streamed = current;
			return {
				delta,
				...input.replace && input.text !== void 0 ? { replacement: "representable" } : {}
			};
		},
		complete(resultText, fallbackText) {
			if (pending) return resultText ?? (pending.text || (streamed.text ? "" : fallbackText));
			return streamed.text ? current.text : (resultText ?? current.text) || fallbackText;
		}
	};
}
/** Preserve snapshot presence: an absent snapshot is not an empty item. */
function resolveAssistantTextInput(data) {
	const record = asOptionalObjectRecord(data);
	if (!record || typeof record.text !== "string" && typeof record.delta !== "string") return;
	return {
		text: typeof record.text === "string" ? record.text : void 0,
		delta: typeof record.delta === "string" ? record.delta : void 0,
		itemId: typeof record.itemId === "string" && record.itemId ? record.itemId : void 0,
		occurrenceId: typeof record.occurrenceId === "string" && record.occurrenceId ? record.occurrenceId : void 0,
		replace: record.replace === true,
		replaceable: record.replaceable === true,
		...Array.isArray(record.managedMediaUrls) ? { managedMediaUrls: record.managedMediaUrls.filter((url) => typeof url === "string") } : {}
	};
}
/** Merge item snapshots without imposing a transport's display or wire limit. */
function mergeAssistantText(previous, input, unkeyed) {
	let scope = previous.scope;
	if (!input.itemId) scope = void 0;
	else if (scope?.itemId !== input.itemId) {
		const prefix = input.replace && input.replaceable ? "" : previous.text;
		scope = {
			itemId: input.itemId,
			prefix,
			boundaryNewlines: !prefix || prefix.endsWith("\n\n") ? 0 : prefix.endsWith("\n") ? 1 : 2,
			separatorLength: 0
		};
	}
	let text;
	if (scope) {
		if (input.text === void 0 && scope === previous.scope && previous.text.length - scope.prefix.length - scope.separatorLength >= 2) {
			const appendedText = input.delta ?? "";
			return {
				text: previous.text + appendedText,
				scope,
				appendedText
			};
		}
		const itemText = input.text ?? (scope === previous.scope ? previous.text.slice(scope.prefix.length + scope.separatorLength) : "") + (input.delta ?? "");
		const leadingNewlines = itemText.startsWith("\n\n") ? 2 : itemText.startsWith("\n") ? 1 : 0;
		if (!scope.prefix) scope.boundaryNewlines = Math.min(scope.boundaryNewlines, scope.separatorLength + leadingNewlines);
		scope.separatorLength = itemText ? Math.max(0, scope.boundaryNewlines - leadingNewlines) : 0;
		text = scope.prefix + "\n".repeat(scope.separatorLength) + itemText;
	} else if (input.text === void 0) {
		const appendedText = input.delta ?? "";
		return {
			text: previous.text + appendedText,
			scope,
			appendedText
		};
	} else if (unkeyed === "append-only") {
		if (input.replace) return {
			text: input.text,
			scope
		};
		if (input.text.startsWith(previous.text)) return {
			text: input.text,
			scope,
			appendedText: input.text.slice(previous.text.length)
		};
		const appendedText = input.delta ?? input.text;
		return {
			text: previous.text + appendedText,
			scope,
			appendedText
		};
	} else if (previous.text && input.text.length > previous.text.length && input.text.startsWith(previous.text)) text = input.text;
	else if (input.delta) text = previous.text + input.delta;
	else text = previous.text.startsWith(input.text) ? previous.text : input.text;
	return {
		text,
		scope
	};
}
//#endregion
//#region src/gateway/server-chat-buffer.ts
const invalidateRange = (item) => {
	delete item.start;
	item.end = null;
};
const bufferVisibleText = (record) => {
	const text = record.rawBuffer ?? "";
	const offset = record.rawOffset ?? 0;
	const items = [...record.assistantItems?.values() ?? []].filter((item) => typeof item.end === "number" && item.end > offset).toSorted((a, b) => (a.start ?? 0) - (b.start ?? 0));
	if (!items.some((item) => item.committed)) return text;
	let visible = "";
	let cursor = offset;
	let gap = "";
	let scope;
	for (const item of items) {
		if (typeof item.end !== "number") continue;
		const start = Math.max(offset, item.start ?? 0);
		gap += text.slice(cursor - offset, start - offset);
		cursor = Math.max(cursor, item.end);
		if (item.committed) continue;
		let part = text.slice(start - offset, item.end - offset);
		if (!part) continue;
		if (!visible && (item.start ?? 0) > offset) part = part.replace(/^\n{1,2}/, "");
		else if (visible && scope !== item.scope) {
			const trailing = visible.endsWith("\n\n") ? 2 : visible.endsWith("\n") ? 1 : 0;
			const leading = part.startsWith("\n\n") ? 2 : part.startsWith("\n") ? 1 : 0;
			visible += "\n".repeat(Math.max(0, 2 - trailing - leading));
		} else if (visible) visible += gap;
		visible += part;
		gap = "";
		scope = item.scope;
	}
	return visible;
};
const updateBuffer = (record, incoming, source) => {
	const sourceId = source ? source.itemId ??= randomUUID() : void 0;
	const itemId = sourceId ?? incoming.occurrenceId ?? incoming.itemId;
	const input = sourceId ? {
		...incoming,
		itemId: sourceId
	} : incoming;
	const display = record.display;
	if (input.managedMediaUrls?.length) {
		const urls = record.managedMediaUrls ??= /* @__PURE__ */ new Set();
		const previousSize = urls.size;
		input.managedMediaUrls.forEach((url) => urls.add(url));
		if (display && urls.size !== previousSize) display.reset = true;
	}
	const previous = record.rawBuffer ?? "";
	const items = record.assistantItems ??= /* @__PURE__ */ new Map();
	if (source) retireSource(record, source);
	const item = items.get(itemId) ?? {};
	const previousOccurrence = items.get(record.assistantOccurrenceId);
	const anonymous = itemId ? items.get(void 0) : void 0;
	if (anonymous) {
		items.set(Symbol("anonymous assistant interval"), anonymous);
		items.delete(void 0);
	}
	const sameItem = input.itemId && input.itemId === record.assistantScope?.itemId;
	const retainedOffset = record.rawOffset ?? 0;
	const previousEnd = retainedOffset + previous.length;
	const canAppendRawDelta = previous.length === 0 || previousOccurrence !== void 0 && !previousOccurrence.committed && previousOccurrence.end === previousEnd && (previousOccurrence.start ?? previousEnd) < previousEnd;
	const oldScopeOffset = record.assistantScopeOffset;
	const snapshot = mergeAssistantText({
		text: previous,
		scope: record.assistantScope
	}, input, "live");
	const resetSource = !itemId && snapshot.appendedText === void 0 || input.replace && input.replaceable && !sameItem;
	const sourceOffset = resetSource || !input.itemId && snapshot.text === input.text ? 0 : sameItem && input.text !== void 0 && snapshot.scope && oldScopeOffset !== void 0 && retainedOffset > oldScopeOffset ? Math.min(retainedOffset, oldScopeOffset - snapshot.scope.prefix.length - snapshot.scope.separatorLength) : retainedOffset;
	const end = sourceOffset + snapshot.text.length;
	const scopeOffset = snapshot.scope ? sameItem && input.text === void 0 ? oldScopeOffset : sourceOffset + snapshot.scope.prefix.length + snapshot.scope.separatorLength : void 0;
	let commonEnd = Math.min(retainedOffset, end);
	if (snapshot.appendedText !== void 0) commonEnd = previousEnd;
	else {
		const limit = Math.min(previousEnd, end);
		if (previous && end >= previousEnd && snapshot.text.slice(retainedOffset - sourceOffset, previousEnd - sourceOffset) === previous) commonEnd = previousEnd - 1;
		while (commonEnd < limit) {
			const point = previous.codePointAt(commonEnd - retainedOffset);
			if (point !== snapshot.text.codePointAt(commonEnd - sourceOffset)) break;
			commonEnd += point !== void 0 && point > 65535 ? 2 : 1;
		}
	}
	const replacing = commonEnd < previousEnd;
	if (resetSource) {
		for (const observed of items.values()) if (observed.end !== void 0) invalidateRange(observed);
	} else if (replacing || input.replace) {
		for (const observed of items.values()) if (typeof observed.end === "number") {
			observed.end = Math.min(observed.end, commonEnd);
			observed.start = Math.min(observed.start ?? 0, commonEnd);
		}
	}
	const scope = sameItem ? previousOccurrence?.scope ?? scopeOffset : scopeOffset ?? sourceOffset;
	item.start = resetSource ? scopeOffset ?? 0 : sameItem ? Math.max(scopeOffset ?? 0, Math.min(item.start ?? previousEnd, commonEnd)) : scopeOffset ?? item.start ?? commonEnd;
	item.end = end;
	item.scope = scope;
	items.set(itemId, item);
	record.assistantScope = snapshot.scope;
	record.assistantScopeOffset = scopeOffset;
	record.assistantOccurrenceId = itemId;
	const text = capLiveAssistantText(snapshot);
	record.rawOffset = sourceOffset + snapshot.text.length - text.length;
	record.rawBuffer = text;
	if (display) {
		display.reset ||= text.length !== snapshot.text.length || input.replace === true || replacing || item.committed === true;
		display.pendingRawDelta = snapshot.appendedText !== void 0 && display.pendingRawDelta !== null && !display.reset && canAppendRawDelta ? (display.pendingRawDelta ?? "") + snapshot.appendedText : null;
	}
	return text;
};
const retireBuffer = (record, itemIds) => {
	const items = record.assistantItems ??= /* @__PURE__ */ new Map();
	let changed = false;
	for (const itemId of itemIds) {
		const item = items.get(itemId);
		changed ||= !item?.committed && typeof item?.end === "number";
		items.set(itemId, {
			...item,
			committed: true
		});
	}
	if (changed && record.display) record.display.reset = true;
	return changed;
};
const retireSource = (record, source) => {
	if (!record || source.committedMessageSeq === void 0) return false;
	return retireBuffer(record, [source.itemId ??= randomUUID()]);
};
//#endregion
//#region src/gateway/server-chat-progress-snapshot.ts
const CHAT_RUN_PROGRESS_MAX_EVENTS = 50;
const CHAT_RUN_PROGRESS_MAX_BYTES = 131072;
const CHAT_RUN_PROGRESS_MAX_EVENT_BYTES = 65536;
const CHAT_RUN_PROGRESS_MAX_REVIEWS_PER_TOOL = 16;
const TOOL_PROGRESS_FIELDS = /* @__PURE__ */ new Map([
	["start", ["args"]],
	["input_delta", ["diff"]],
	["update", ["partialResult"]],
	["review", ["review", "approvalReviewOutcome"]],
	["result", [
		"approvalReviewOutcome",
		"isError",
		"result"
	]]
]);
const retainedEventBytes = /* @__PURE__ */ new WeakMap();
const isRawJSON = "isRawJSON" in JSON && typeof JSON.isRawJSON === "function" ? JSON.isRawJSON : void 0;
function stringifyProgressEvent(event) {
	let bytes = 0;
	const containers = /* @__PURE__ */ new WeakMap();
	const charge = (amount) => {
		bytes += amount;
		if (bytes > CHAT_RUN_PROGRESS_MAX_EVENT_BYTES) throw new RangeError("Progress event exceeds replay budget");
	};
	const primitive = (value) => charge(boundedJsonUtf8Bytes(value, CHAT_RUN_PROGRESS_MAX_EVENT_BYTES - bytes).bytes);
	return JSON.stringify(event, function(key, input) {
		let value = input;
		if (types.isNumberObject(value)) value = Reflect.apply(Math.max, void 0, [value]);
		else if (types.isStringObject(value)) value = String(value);
		else if (types.isBooleanObject(value)) value = Boolean.prototype.valueOf.call(value);
		const parent = containers.get(this);
		const omitted = value === void 0 || typeof value === "function" || typeof value === "symbol";
		if (parent && (parent.array || !omitted)) {
			if (parent.count > 0) charge(1);
			parent.count += 1;
			if (!parent.array) {
				primitive(key);
				charge(1);
			}
		}
		if (omitted) {
			if (parent?.array) charge(4);
			return value;
		}
		if (value !== null && typeof value === "object") {
			if (isRawJSON?.(value) && "rawJSON" in value && typeof value.rawJSON === "string") {
				if (value.rawJSON.length > CHAT_RUN_PROGRESS_MAX_EVENT_BYTES - bytes) throw new RangeError("Progress event exceeds replay budget");
				charge(Buffer.byteLength(value.rawJSON, "utf8"));
			} else {
				charge(2);
				containers.set(value, {
					array: Array.isArray(value),
					count: 0
				});
			}
		} else primitive(value);
		return value;
	});
}
function captureProgressEvent(event) {
	try {
		const json = stringifyProgressEvent(event);
		const byteLength = Buffer.byteLength(json, "utf8");
		if (byteLength > CHAT_RUN_PROGRESS_MAX_EVENT_BYTES) return;
		const captured = JSON.parse(json);
		deepFreezeDiagnosticValue(captured);
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
		"waiting_for_state",
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
	const isFallbackStatus = event.stream === "lifecycle" && phase === "fallback_step";
	const isAssistant = event.stream === "assistant" && Boolean(snapshot?.events.some((candidate) => candidate.stream === "run_status" || candidate.stream === "lifecycle" && candidate.data.phase === "fallback_step"));
	const preambleItemId = typeof data.itemId === "string" && data.itemId.trim() ? data.itemId.trim() : typeof data.id === "string" && data.id.trim() ? data.id.trim() : "";
	const toolFields = TOOL_PROGRESS_FIELDS.get(phase);
	const isTool = event.stream === "tool" && Boolean(toolCallId) && toolFields !== void 0 && (phase !== "review" || mode === "full" && Boolean(reviewId));
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
	if (!(isTool || isItem || isUsage || isRetryStatus || isFallbackStatus || isAssistant || isNotice) && (mode === "summary" || !isStartupStatus && !isStandaloneGuardian && !resolvesStrictReview)) return snapshot;
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
	else if (isStartupStatus || isRetryStatus || isFallbackStatus || isAssistant || isTool || isItem) {
		removeWhere((candidate) => {
			if (candidate.stream === "run_status" || candidate.stream === "assistant" || candidate.stream === "lifecycle" && candidate.data.phase === "fallback_step") return true;
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
	const storedData = isTool ? {
		phase,
		name: typeof data.name === "string" ? data.name : void 0,
		toolCallId
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
	if (isTool && mode === "full") for (const field of toolFields) storedData[field] = data[field];
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
//#region src/gateway/server-chat-tool-recipients.ts
const TOOL_EVENT_RECIPIENT_TTL_MS = 6e5;
const TOOL_EVENT_RECIPIENT_FINAL_GRACE_MS = 3e4;
function createToolEventRecipientRegistry(store, isConnectionActive) {
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
		if (!runId || !connId || isConnectionActive?.(connId) === false) return;
		const now = Date.now();
		const entry = store.getOrCreate(runId).toolRecipient ??= {
			connIds: /* @__PURE__ */ new Set(),
			updatedAt: now
		};
		entry.connIds.add(connId);
		entry.updatedAt = now;
		prune(entry);
	};
	const removeConnection = (connId) => {
		for (const [runId, record] of store.runs) {
			const entry = record.toolRecipient;
			if (entry?.connIds.delete(connId) && entry.connIds.size === 0) {
				delete record.toolRecipient;
				store.releaseIfEmpty(runId);
			}
		}
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
		removeConnection,
		get,
		markFinal,
		pruneExpired
	};
}
//#endregion
//#region src/gateway/server-chat-state.ts
let chatRunOrderingSequence = 0;
/** Create an abort marker ordered against chat run registrations, using a shared monotonic sequence. */
function createChatAbortMarker(now = Date.now()) {
	return {
		abortedAtMs: now,
		sequence: ++chatRunOrderingSequence
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
		if (existing) {
			existing.lastActivityAt = Date.now();
			return existing;
		}
		const record = { lastActivityAt: Date.now() };
		runs.set(runId, record);
		return record;
	};
	const releaseIfEmpty = (runId) => {
		const record = runs.get(runId);
		if (!record || Object.keys(record).length > 1) return;
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
		const registeredEntry = {
			...entry,
			registeredSequence: ++chatRunOrderingSequence
		};
		const record = store.getOrCreate(sessionId);
		(record.registrations ??= []).push(registeredEntry);
	};
	const peek = (sessionId) => store.runs.get(sessionId)?.registrations?.[0];
	const takeRegistration = (sessionId, clientRunId, sessionKey) => {
		const record = store.runs.get(sessionId);
		if (!record) return;
		const queue = record.registrations;
		if (!queue || queue.length === 0) return;
		const idx = clientRunId === void 0 ? 0 : queue.findIndex((entry) => entry.clientRunId === clientRunId && (!sessionKey || entry.sessionKey === sessionKey));
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
		shift: (sessionId) => takeRegistration(sessionId),
		remove: takeRegistration
	};
}
/** Create the single record map used by Gateway chat-run runtime state. */
function createChatRunState(isConnectionActive) {
	const store = createChatRunRecordStore();
	const registry = createChatRunRegistryForStore(store);
	const toolEventRecipients = createToolEventRecipientRegistry(store, isConnectionActive);
	const recordProgressEvent = (runId, event, mode) => {
		const progressSnapshot = updateChatRunProgressSnapshot(store.runs.get(runId)?.progressSnapshot, event, mode);
		if (progressSnapshot) store.getOrCreate(runId).progressSnapshot = progressSnapshot;
	};
	const clearRun = (runId) => {
		const record = store.runs.get(runId);
		if (!record) return;
		delete record.rawBuffer;
		delete record.rawOffset;
		delete record.assistantItems;
		delete record.buffer;
		delete record.bufferIsCurrent;
		record.releaseBufferAuthority?.();
		delete record.releaseBufferAuthority;
		record.liveTextGroup?.abort();
		delete record.liveTextGroup;
		delete record.liveTextEpoch;
		delete record.display;
		delete record.planSnapshot;
		delete record.progressSnapshot;
		delete record.canvasBlocks;
		delete record.deltaSentAt;
		delete record.assistantScope;
		delete record.assistantScopeOffset;
		delete record.assistantOccurrenceId;
		delete record.managedMediaUrls;
		clearPendingLiveTextFlushes(record);
		delete record.agentText;
		store.releaseIfEmpty(runId);
	};
	const clear = () => {
		for (const record of store.runs.values()) {
			clearPendingLiveTextFlushes(record);
			record.releaseBufferAuthority?.();
			record.liveTextGroup?.abort();
		}
		store.runs.clear();
	};
	const resolveBuffer = (runId, options) => {
		const record = store.runs.get(runId);
		if (!record || record.bufferIsCurrent?.() === false) return projectLiveAssistantBufferedText("");
		const source = record.rawBuffer;
		if (source === void 0) return projectLiveAssistantBufferedText(record.buffer ?? "");
		const projectionOptions = {
			...options,
			managedMediaUrls: record.managedMediaUrls ? [...record.managedMediaUrls] : void 0
		};
		const createProjector = () => createLiveAssistantTextProjection(projectionOptions);
		const rawText = source;
		const tail = bufferVisibleText(record);
		const contextEvicted = (record.rawOffset ?? 0) > 0;
		const projectTail = (full) => {
			if (tail === source && !contextEvicted) return full;
			const suppressed = !contextEvicted && (options?.final ? projectLiveAssistantBufferedText(full.text, { suppressLeadFragments: false }).suppress : full.suppress);
			const text = suppressed ? "" : contextEvicted ? tail : normalizeLiveAssistantBufferedText(tail, projectionOptions);
			return {
				...full,
				text,
				suppress: suppressed || !text,
				pendingLeadFragment: suppressed && full.pendingLeadFragment
			};
		};
		if (options?.final) {
			const complete = createProjector().replace(source);
			return {
				...complete,
				...tail !== source || contextEvicted ? { displayText: projectTail(complete).text } : {}
			};
		}
		let display = record.display;
		if (!display) {
			const projector = createProjector();
			display = record.display = {
				projector,
				current: projectTail(projector.replace(rawText)),
				unsentDelta: null
			};
		} else if (display.reset || display.pendingRawDelta !== void 0) {
			const { projector, pendingRawDelta, reset } = display;
			if (reset) display.projector = createProjector();
			const delta = reset ? null : pendingRawDelta === null ? rawText.startsWith(projector.source) ? rawText.slice(projector.source.length) : null : pendingRawDelta;
			const next = projectTail(delta == null ? display.projector.replace(rawText) : display.projector.append(delta, rawText));
			const previous = display.current.suppress ? "" : display.current.text;
			const visible = next.suppress ? "" : next.text;
			next.delta = next.delta !== null && visible.length === previous.length + next.delta.length && visible.startsWith(previous) ? next.delta : null;
			display.current = next;
			display.unsentDelta = display.unsentDelta !== null && display.current.delta !== null ? display.unsentDelta + display.current.delta : null;
			delete display.pendingRawDelta;
			delete display.reset;
		}
		record.buffer = display.current.text;
		return display.current;
	};
	const takeBufferDelta = (runId, text) => {
		const projected = resolveBuffer(runId);
		const record = store.getOrCreate(runId);
		const display = record.display ??= {
			projector: createLiveAssistantTextProjection(),
			current: {
				...projectLiveAssistantBufferedText(record.buffer ?? ""),
				delta: null
			},
			unsentDelta: null
		};
		const visible = projected.suppress ? "" : projected.text;
		const previous = display.sentText;
		const append = previous === void 0 ? text : display.unsentDelta === null ? null : text === visible ? display.unsentDelta : text.startsWith(previous) ? text.slice(previous.length) : null;
		display.sentText = text;
		display.unsentDelta = visible.startsWith(text) ? visible.slice(text.length) : null;
		return append === null && (text !== "" || previous !== "") ? {
			deltaText: text,
			replace: true
		} : append ? { deltaText: append } : void 0;
	};
	return {
		runs: store.runs,
		registry,
		toolEventRecipients,
		/** Acquire mutable state and record activity; readers use runs.get. */
		getOrCreate: store.getOrCreate,
		resolveBuffer,
		updateBuffer: (runId, input, source) => updateBuffer(store.getOrCreate(runId), input, source),
		retireBuffer: (runId, itemIds) => retireBuffer(store.getOrCreate(runId), itemIds),
		retireSource: (runId, source) => retireSource(store.runs.get(runId), source),
		takeBufferDelta,
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
/** Create the broad sessions.changed subscriber registry. */
function createSessionEventSubscriberRegistry(isConnectionActive, onSubscriptionChange) {
	const connIds = /* @__PURE__ */ new Set();
	const empty = /* @__PURE__ */ new Set();
	return {
		subscribe: (connId) => {
			const normalized = connId.trim();
			if (!normalized || isConnectionActive?.(normalized) === false) return;
			onSubscriptionChange?.(normalized);
			connIds.add(normalized);
		},
		unsubscribe: (connId) => {
			const normalized = connId.trim();
			if (!normalized) return;
			onSubscriptionChange?.(normalized);
			connIds.delete(normalized);
		},
		getAll: () => connIds.size > 0 ? connIds : empty
	};
}
/** Create the per-session message subscriber registry. */
function createSessionMessageSubscriberRegistry(isConnectionActive, onSubscriptionChange) {
	const sessionToConnIds = /* @__PURE__ */ new Map();
	const connections = /* @__PURE__ */ new Map();
	const approvalSessionToConnIds = /* @__PURE__ */ new Map();
	const narrationSessionToConnIds = /* @__PURE__ */ new Map();
	const changeListeners = /* @__PURE__ */ new Set();
	const empty = /* @__PURE__ */ new Set();
	let subscriptionSequence = 0;
	const setMembership = (index, connId, sessionKey, subscribed) => {
		const connIds = index.get(sessionKey);
		if (subscribed) {
			const nextConnIds = connIds ?? /* @__PURE__ */ new Set();
			nextConnIds.add(connId);
			index.set(sessionKey, nextConnIds);
			return;
		}
		connIds?.delete(connId);
		if (connIds?.size === 0) index.delete(sessionKey);
	};
	const setSubscription = (connId, sessionKey, mode) => {
		const subscribed = mode !== void 0;
		const narration = mode?.mode === "narration";
		const changed = sessionToConnIds.get(sessionKey)?.has(connId) === true !== subscribed || narrationSessionToConnIds.get(sessionKey)?.has(connId) === true !== narration;
		setMembership(sessionToConnIds, connId, sessionKey, subscribed);
		setMembership(approvalSessionToConnIds, connId, sessionKey, mode?.includeApprovals === true);
		setMembership(narrationSessionToConnIds, connId, sessionKey, narration);
		if (changed) changeListeners.forEach((listener) => listener(sessionKey, connId));
		return changed;
	};
	const updateSubscription = (connId, sessionKey, owners) => {
		let mode;
		const include = (interest) => {
			if (!mode) mode = { ...interest };
			else {
				mode.includeApprovals ||= interest.includeApprovals;
				if (interest.mode !== "narration") mode.mode = void 0;
			}
		};
		for (const owner of owners?.values() ?? []) {
			if (owner.committed) include(owner.committed.mode);
			for (const interest of owner.inflight.values()) include(interest);
		}
		return setSubscription(connId, sessionKey, mode);
	};
	return {
		subscribe: (connId, sessionKey, opts) => {
			const normalizedConnId = connId.trim();
			const normalizedSessionKey = sessionKey.trim();
			if (!normalizedConnId || !normalizedSessionKey || isConnectionActive?.(normalizedConnId) === false) return;
			onSubscriptionChange?.(normalizedConnId);
			const states = connections.get(normalizedConnId) ?? /* @__PURE__ */ new Map();
			const owners = states.get(normalizedSessionKey) ?? /* @__PURE__ */ new Map();
			const subscriptionId = opts?.subscriptionId;
			const state = owners.get(subscriptionId) ?? { inflight: /* @__PURE__ */ new Map() };
			owners.set(subscriptionId, state);
			states.set(normalizedSessionKey, owners);
			connections.set(normalizedConnId, states);
			subscriptionSequence += 1;
			const provisionalRecency = subscriptionSequence;
			const mode = {
				includeApprovals: opts?.includeApprovals === true,
				mode: opts?.mode
			};
			state.inflight.set(provisionalRecency, mode);
			updateSubscription(normalizedConnId, normalizedSessionKey, owners);
			const settle = (succeeded) => {
				if (!state.inflight.has(provisionalRecency) || connections.get(normalizedConnId)?.get(normalizedSessionKey)?.get(subscriptionId) !== state) return;
				if (succeeded && provisionalRecency >= (state.committed?.sequence ?? -Infinity)) state.committed = {
					sequence: provisionalRecency,
					mode
				};
				state.inflight.delete(provisionalRecency);
				if (!state.committed && state.inflight.size === 0) {
					onSubscriptionChange?.(normalizedConnId);
					owners.delete(subscriptionId);
				}
				if (owners.size === 0) states.delete(normalizedSessionKey);
				updateSubscription(normalizedConnId, normalizedSessionKey, owners);
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
		unsubscribe: (connId, sessionKey, subscriptionId) => {
			const normalizedConnId = connId.trim();
			const normalizedSessionKey = sessionKey.trim();
			if (!normalizedConnId || !normalizedSessionKey) return;
			onSubscriptionChange?.(normalizedConnId);
			const states = connections.get(normalizedConnId);
			const owners = states?.get(normalizedSessionKey);
			owners?.delete(subscriptionId);
			if (owners?.size === 0) states?.delete(normalizedSessionKey);
			if (states?.size === 0) connections.delete(normalizedConnId);
			if (!updateSubscription(normalizedConnId, normalizedSessionKey, owners)) changeListeners.forEach((listener) => listener(normalizedSessionKey, normalizedConnId, true));
		},
		unsubscribeAll: (connId) => {
			const normalizedConnId = connId.trim();
			if (!normalizedConnId) return;
			onSubscriptionChange?.(normalizedConnId);
			const states = connections.get(normalizedConnId);
			if (!states) return;
			connections.delete(normalizedConnId);
			for (const sessionKey of states.keys()) setSubscription(normalizedConnId, sessionKey);
		},
		get: (sessionKey) => sessionToConnIds.get(sessionKey.trim()) ?? empty,
		getApprovals: (sessionKey) => approvalSessionToConnIds.get(sessionKey.trim()) ?? empty,
		getNarration: (sessionKey) => narrationSessionToConnIds.get(sessionKey.trim()) ?? empty,
		onChange: (listener) => {
			changeListeners.add(listener);
			return () => changeListeners.delete(listener);
		}
	};
}
//#endregion
export { createSessionMessageSubscriberRegistry as a, mergeAssistantText as c, createSessionEventSubscriberRegistry as i, resolveAssistantResultText as l, createChatAbortMarker as n, isChatAbortMarkerCurrent as o, createChatRunState as r, createAssistantTextStream as s, chatAbortMarkerTimestampMs as t, resolveAssistantTextInput as u };
