import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { G as sqliteSessionIdWriteScope, U as withSqliteDatabaseWriteScope, W as withoutSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as executeSqliteQuerySync, l as prepareSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { o as projectSessionModelContextNavigation } from "./session-transcript-report-facts-CJXa6teM.mjs";
import { c as transcriptEventJsonSql, g as transcriptSerializedBytes, i as prepareTranscriptPayload, n as createTranscriptEventInserter, r as createTranscriptPayloadUpdater } from "./transcript-payload-Cu49oQKq.mjs";
import { b as transcriptRewritePreservesProjection, y as transcriptRewritePreservesAdmission } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { n as advanceCliHistoryBoundary, r as getCliHistoryWriter } from "./cli-history-boundary-B1eSXpAQ.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as parseCompactionDetails } from "./compaction-details-BL6y2Xrl.mjs";
import { t as canonicalizeTranscriptEventMedia } from "./transcript-event-media-C4aKs47S.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { o as writableSessionActorMap, r as readSessionActorTransactionState, s as writableSessionActorNavigation } from "./session-actor-transaction-BIR0_goz.mjs";
import { a as deleteSessionTranscriptIndexInTransaction, c as reconcileSessionTranscriptIndexInTransaction, d as sessionTranscriptIndexNeedsReconcile, f as shouldRebuildSessionTranscriptIndexSynchronously, r as createTranscriptIndexAppenderInTransaction, s as markSessionTranscriptIndexDirtyInTransaction } from "./session-transcript-index-BTr4by8J.mjs";
import { r as scheduleTranscriptProjectionReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { n as preserveSessionEntryCacheAcrossWrite } from "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { i as sanitizeInlineImageDataUrlForStorage, n as sanitizeInlineImageBase64 } from "./inline-image-data-url-Cu31GIq2.mjs";
import { r as projectSessionRowTranscriptFields } from "./session-row-transcript-preview-D_omQ8Ci.mjs";
import { a as writeSessionEntry } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { a as pruneTranscriptReactionsInTransaction, d as rotateTranscriptGenerationInTransaction, f as touchTranscriptMutationInTransaction, i as ensureTranscriptSessionRoot, l as readTranscriptGenerationInTransaction, n as deleteTranscriptEventsInTransaction, o as readNextTranscriptSeq, r as ensureTranscriptGenerationInTransaction, t as advanceTranscriptMutationAtInTransaction, u as readTranscriptMutationStateInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { m as readEventTimestamp, n as createTranscriptIdentityReader } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { n as readIdempotencyKeyOwner, r as readTranscriptEventIdentity, t as createTranscriptIdentityInserter } from "./session-accessor.sqlite-transcript-identity-BbaLin80.mjs";
import { r as rewriteSessionActorContextStats, t as appendSessionActorContextStats } from "./session-actor-context-metadata-D9G7kaZr.mjs";
import { t as copyRetainedTranscriptPayload } from "./session-transcript-retained-data-hvf1GT7-.mjs";
import { OPENAI_RESPONSES_APIS, readOpenAIResponsesCompactionWindow } from "@openclaw/ai/internal/openai-responses-payload-policy";
//#region src/agents/transcript-sanitize-images.ts
const isImageMimeType = (value) => typeof value === "string" && /^image\//iu.test(value.trim());
function sanitizeTranscriptImageRecord(source) {
	const isImageBlock = source.type === "image";
	const isBase64SourceBlock = source.type === "base64";
	if (!isImageBlock && !isBase64SourceBlock || typeof source.data !== "string") return;
	const mimeTypeFields = [
		"mimeType",
		"mediaType",
		"media_type"
	].filter((key) => isImageMimeType(source[key]));
	const mimeType = mimeTypeFields.map((key) => source[key]).find(isImageMimeType);
	if (!mimeType) return;
	const sanitized = sanitizeInlineImageBase64({
		base64: source.data,
		mimeType: mimeType.trim().toLowerCase()
	});
	if (!sanitized) return;
	const hasCanonicalMimeTypes = mimeTypeFields.every((key) => source[key] === sanitized.mimeType);
	if (source.data === sanitized.base64 && hasCanonicalMimeTypes) return source;
	const next = {
		...source,
		data: sanitized.base64
	};
	for (const field of mimeTypeFields) next[field] = sanitized.mimeType;
	return next;
}
function sanitizeTranscriptImageDataUrlField({ source, key, value, preserveImageDataUrlFields }) {
	if (value.slice(0, 5).toLowerCase() !== "data:") return;
	return preserveImageDataUrlFields && key === "url" || source.type === "input_image" && key === "image_url" || (source.type === "image" || source.type === "image_url") && key === "url" || source.type === "image" && (key === "source" || key === "data") ? sanitizeInlineImageDataUrlForStorage(value) : void 0;
}
function shouldPreserveNestedTranscriptImageDataUrlFields(source, key) {
	return key === "image_url" && (source.type === "image_url" || source.type === "input_image" || source.type === "image");
}
//#endregion
//#region src/agents/transcript-sanitize-replay.ts
function sanitizeCompactedWindow(replay, helpers) {
	const window = replay.compactedWindow;
	return readOpenAIResponsesCompactionWindow(replay)?.every((item) => {
		if (item.type !== "compaction") return helpers.sanitizeTranscriptStructuredValue(item) === item;
		const { encrypted_content: _encrypted, ...plaintext } = item;
		return helpers.sanitizeTranscriptStructuredValue(plaintext) === plaintext;
	}) && window && typeof window === "object" && helpers.isPlainTranscriptObject(window) && typeof window.output === "string" ? {
		state: "ready",
		output: window.output,
		...typeof window.outputTokens === "number" && Number.isSafeInteger(window.outputTokens) && window.outputTokens >= 0 ? { outputTokens: window.outputTokens } : {}
	} : { state: "refresh-required" };
}
function sanitizeCompactionReplayState(value, route, helpers) {
	if (!value || typeof value !== "object" || !helpers.isPlainTranscriptObject(value)) return;
	const replayType = typeof value.type === "string" ? value.type : "";
	const openAISuppression = replayType === "openai-responses-compaction-suppression";
	const anthropicSuppression = replayType === "anthropic-compaction-suppression";
	const isOpenAI = openAISuppression || replayType === "openai-responses-compaction" || replayType === "openai-responses-retained-compaction";
	const isAnthropic = anthropicSuppression || replayType === "anthropic-compaction";
	const isSuppression = openAISuppression || anthropicSuppression;
	if (!isOpenAI && !isAnthropic || !(isOpenAI ? helpers.isOpenAIResponsesRoute(route) : helpers.isAnthropicReasoningRoute(route)) || value.v !== 1 || typeof value.data !== "string" || value.type === "openai-responses-retained-compaction" && value.replayIndex !== void 0 || value.replayIndex !== void 0 && (isSuppression || typeof value.replayIndex !== "number" || !Number.isSafeInteger(value.replayIndex) || value.replayIndex < 0) || value.provider !== route?.provider || !(isOpenAI ? typeof value.api === "string" && helpers.isOpenAIResponsesApi(value.api) : value.api === route?.api) || value.model !== route?.model || !helpers.isOpenAIReplayContextHash(value.baseUrlHash) || value.sessionHash !== void 0 && !helpers.isOpenAIReplayContextHash(value.sessionHash) || value.authProfileHash !== void 0 && !helpers.isOpenAIReplayContextHash(value.authProfileHash)) return;
	const data = isSuppression ? value.data === "rejected" ? value.data : void 0 : isOpenAI ? helpers.isStructurallyValidOpaqueReplayToken(value.data) ? value.data : void 0 : value.data.length > 0 ? value.data : void 0;
	if (data === void 0) return;
	const encryptedContent = !isSuppression && isAnthropic ? value.encryptedContent : void 0;
	if (encryptedContent !== void 0 && encryptedContent !== null && (typeof encryptedContent !== "string" || !helpers.isStructurallyValidOpaqueReplayToken(encryptedContent))) return;
	const replayId = !isSuppression && isOpenAI && typeof value.id === "string" && helpers.isOpenAIResponseItemId(value.id, route) ? value.id : void 0;
	return {
		v: 1,
		type: value.type,
		...replayId !== void 0 ? { id: replayId } : {},
		data,
		...encryptedContent !== void 0 ? { encryptedContent } : {},
		...value.replayIndex !== void 0 ? { replayIndex: value.replayIndex } : {},
		provider: value.provider,
		api: value.api,
		model: value.model,
		baseUrlHash: value.baseUrlHash,
		...value.sessionHash !== void 0 ? { sessionHash: value.sessionHash } : {},
		...value.authProfileHash !== void 0 ? { authProfileHash: value.authProfileHash } : {},
		...!isSuppression && isOpenAI && value.compactedWindow !== void 0 ? { compactedWindow: sanitizeCompactedWindow({
			data,
			id: replayId,
			compactedWindow: value.compactedWindow
		}, helpers) } : {}
	};
}
//#endregion
//#region src/agents/transcript-sanitize.ts
function isPlainTranscriptObject(value) {
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
const GOOGLE_REASONING_APIS = /* @__PURE__ */ new Set([
	"google-generative-ai",
	"google-interactions",
	"google-vertex",
	"google-gemini-cli",
	"openclaw-google-generative-ai-transport"
]);
const ANTHROPIC_REASONING_APIS = /* @__PURE__ */ new Set([
	"anthropic-messages",
	"bedrock-converse-stream",
	"openclaw-anthropic-messages-transport"
]);
const OPENAI_COMPLETIONS_APIS = /* @__PURE__ */ new Set(["openai-completions", "openclaw-openai-completions-transport"]);
const OPAQUE_REPLAY_TOKEN_RE = /^[A-Za-z0-9+/_-]+={0,2}$/;
const OPENAI_REPLAY_CONTEXT_HASH_RE = /^[a-z0-9]{2,16}$/;
function isOpenAIReplayContextHash(value) {
	return typeof value === "string" && OPENAI_REPLAY_CONTEXT_HASH_RE.test(value);
}
function isOpenAIResponsesApi(api) {
	return OPENAI_RESPONSES_APIS.has(api);
}
function isOpenAIResponsesRoute(route) {
	return typeof route?.api === "string" && isOpenAIResponsesApi(route.api);
}
function isGoogleReasoningRoute(route) {
	return typeof route?.api === "string" && GOOGLE_REASONING_APIS.has(route.api);
}
function isAnthropicReasoningRoute(route) {
	return typeof route?.api === "string" && ANTHROPIC_REASONING_APIS.has(route.api);
}
const isOpenAICompletionsRoute = (route) => OPENAI_COMPLETIONS_APIS.has(route?.api ?? "");
function isCustomProviderRoute(route) {
	return Boolean(route?.api && route.model && route.provider) && route?.api !== "mistral-conversations" && !isOpenAIResponsesRoute(route) && !isGoogleReasoningRoute(route) && !isAnthropicReasoningRoute(route) && !isOpenAICompletionsRoute(route);
}
function isGitHubCopilotResponsesRoute(route) {
	return (route?.api === "openai-responses" || route?.api === "openclaw-openai-responses-transport") && route.provider === "github-copilot";
}
function isStructurallyValidOpaqueReplayToken(value) {
	return value.length > 0 && value === value.trim() && OPAQUE_REPLAY_TOKEN_RE.test(value) && !value.includes("…");
}
function resolveTranscriptAssistantRoute(source) {
	const api = typeof source.api === "string" ? source.api : void 0;
	const model = typeof source.model === "string" ? source.model : void 0;
	const provider = typeof source.provider === "string" ? source.provider : void 0;
	return {
		...api ? { api } : {},
		...model ? { model } : {},
		...provider ? { provider } : {}
	};
}
function isSafeReplayIdentifier(value, maxLength = 512) {
	return value.length > 0 && value.length <= maxLength && value === value.trim() && /^[A-Za-z0-9+/_:.=-]+$/.test(value);
}
function isOpenAIResponseItemId(value, route) {
	return isSafeReplayIdentifier(value, isGitHubCopilotResponsesRoute(route) ? 64 : 512);
}
const replaySanitizerHelpers = {
	isAnthropicReasoningRoute,
	isOpenAIReplayContextHash,
	isOpenAIResponseItemId,
	isOpenAIResponsesApi,
	isOpenAIResponsesRoute,
	isPlainTranscriptObject,
	isStructurallyValidOpaqueReplayToken,
	sanitizeTranscriptStructuredValue
};
const OPENAI_REASONING_REPLAY_METADATA_KEYS = /* @__PURE__ */ new Set([
	"v",
	"source",
	"provider",
	"api",
	"model",
	"baseUrlHash",
	"sessionHash",
	"authProfileHash"
]);
const OPENAI_REASONING_REPLAY_METADATA_KEY = "__openclaw_replay";
function sanitizeOpenAIReasoningReplayMetadata(value, route) {
	if (!value || typeof value !== "object" || !isPlainTranscriptObject(value) || !route?.api || !route.model || !route.provider) return;
	if (value.v !== 1 || value.source !== "openai-responses" || value.provider !== route?.provider || value.api !== route.api || value.model !== route.model || value.baseUrlHash !== void 0 && !isOpenAIReplayContextHash(value.baseUrlHash) || value.sessionHash !== void 0 && !isOpenAIReplayContextHash(value.sessionHash) || value.authProfileHash !== void 0 && !isOpenAIReplayContextHash(value.authProfileHash)) return;
	if (Object.keys(value).every((key) => OPENAI_REASONING_REPLAY_METADATA_KEYS.has(key))) return value;
	return {
		v: 1,
		source: "openai-responses",
		provider: value.provider,
		api: value.api,
		model: value.model,
		...value.baseUrlHash !== void 0 ? { baseUrlHash: value.baseUrlHash } : {},
		...value.sessionHash !== void 0 ? { sessionHash: value.sessionHash } : {},
		...value.authProfileHash !== void 0 ? { authProfileHash: value.authProfileHash } : {}
	};
}
function sanitizeOpenAIReasoningSignature(value, route) {
	if (!isOpenAIResponsesRoute(route) && !isCustomProviderRoute(route)) return;
	const parsed = safeParseJsonRecord(value);
	if (!parsed || parsed.type !== "reasoning" || parsed.summary !== void 0 && !Array.isArray(parsed.summary)) return;
	const encryptedContent = parsed.encrypted_content;
	const hasEncryptedContent = Object.hasOwn(parsed, "encrypted_content");
	if (encryptedContent !== void 0 && encryptedContent !== null && (typeof encryptedContent !== "string" || !isStructurallyValidOpaqueReplayToken(encryptedContent))) return;
	if (parsed.id !== void 0 && (typeof parsed.id !== "string" || !(isOpenAIResponsesRoute(route) ? isSafeReplayIdentifier(parsed.id, Infinity) : isOpenAIResponseItemId(parsed.id, route)))) return;
	if (parsed.status !== void 0 && parsed.status !== "in_progress" && parsed.status !== "completed" && parsed.status !== "incomplete") return;
	if (!hasEncryptedContent && typeof parsed.id !== "string") return;
	const replayMetadata = sanitizeOpenAIReasoningReplayMetadata(parsed[OPENAI_REASONING_REPLAY_METADATA_KEY], route);
	return JSON.stringify({
		...typeof parsed.id === "string" ? { id: parsed.id } : {},
		type: "reasoning",
		summary: [],
		...Array.isArray(parsed.content) && parsed.content.length === 0 ? { content: [] } : {},
		...parsed.status !== void 0 ? { status: parsed.status } : {},
		...hasEncryptedContent ? { encrypted_content: encryptedContent } : {},
		...replayMetadata ? { [OPENAI_REASONING_REPLAY_METADATA_KEY]: replayMetadata } : {}
	});
}
function sanitizeOpenAICompletionsToolSignature(value) {
	const parsed = safeParseJsonRecord(value);
	if (!parsed || parsed.type !== "reasoning.encrypted" || typeof parsed.data !== "string" || !isStructurallyValidOpaqueReplayToken(parsed.data) || parsed.id !== void 0 && parsed.id !== null && (typeof parsed.id !== "string" || !isSafeReplayIdentifier(parsed.id)) || parsed.format !== void 0 && parsed.format !== null && (typeof parsed.format !== "string" || parsed.format.length > 64 || !/^[a-z0-9.-]+$/.test(parsed.format)) || parsed.index !== void 0 && (typeof parsed.index !== "number" || !Number.isSafeInteger(parsed.index) || parsed.index < 0)) return;
	return JSON.stringify({
		type: "reasoning.encrypted",
		data: parsed.data,
		...parsed.id !== void 0 ? { id: parsed.id } : {},
		...parsed.format !== void 0 ? { format: parsed.format } : {},
		...parsed.index !== void 0 ? { index: parsed.index } : {}
	});
}
function sanitizeTranscriptStructuredValue(value, seen = /* @__PURE__ */ new WeakSet(), preserveImageDataUrlFields = false, location = "nested", assistantRoute) {
	if (Array.isArray(value)) {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		let changed = false;
		const sanitized = value.map((item) => {
			const next = sanitizeTranscriptStructuredValue(item, seen, preserveImageDataUrlFields, location === "assistant-content-array" ? "assistant-content-block" : "nested", assistantRoute);
			changed ||= next !== item;
			return next;
		});
		seen.delete(value);
		return changed ? sanitized : value;
	}
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return "[Circular]";
	if (!isPlainTranscriptObject(value)) return value;
	seen.add(value);
	const sanitizedImageRecord = sanitizeTranscriptImageRecord(value);
	const source = sanitizedImageRecord ?? value;
	const currentAssistantRoute = location === "root" && source.role === "assistant" ? resolveTranscriptAssistantRoute(source) : assistantRoute;
	let next = null;
	if (source !== value) next = { ...source };
	for (const [key, item] of Object.entries(source)) {
		if (location === "root" && source.role === "assistant" && key === "providerReplay") {
			const sanitizedReplay = sanitizeCompactionReplayState(item, currentAssistantRoute, replaySanitizerHelpers);
			if (sanitizedReplay !== void 0) {
				if (sanitizedReplay !== item) {
					next ??= { ...source };
					next[key] = sanitizedReplay;
				}
				continue;
			}
			next ??= { ...source };
			delete next[key];
			continue;
		}
		let sanitizedField;
		if (location === "assistant-content-block" && (isOpenAIResponsesRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "thinking" && key === "openclawReasoningReplay") sanitizedField = sanitizeOpenAIReasoningReplayMetadata(item, currentAssistantRoute);
		if (sanitizedField === void 0 && location === "assistant-content-block" && source.type === "thinking" && key === "thinkingSignature" && typeof item === "string") sanitizedField = sanitizeOpenAIReasoningSignature(item, currentAssistantRoute);
		if (sanitizedField === void 0 && location === "assistant-content-block" && (isOpenAICompletionsRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "toolCall" && key === "thoughtSignature" && typeof item === "string") sanitizedField = sanitizeOpenAICompletionsToolSignature(item);
		if (sanitizedField === void 0 && typeof item === "string") sanitizedField = sanitizeTranscriptImageDataUrlField({
			source,
			key,
			value: item,
			preserveImageDataUrlFields
		});
		if (sanitizedField !== void 0) {
			if (sanitizedField !== item) {
				next ??= { ...source };
				next[key] = sanitizedField;
			}
			continue;
		}
		if (key === "data" && sanitizedImageRecord) continue;
		const sanitized = sanitizeTranscriptStructuredValue(item, seen, preserveImageDataUrlFields || shouldPreserveNestedTranscriptImageDataUrlFields(source, key), location === "root" && source.role === "assistant" && key === "content" && Array.isArray(item) ? "assistant-content-array" : "nested", currentAssistantRoute);
		if (sanitized === item) continue;
		next ??= { ...source };
		next[key] = sanitized;
	}
	seen.delete(value);
	return next ?? value;
}
/** Normalize transcript images and provider replay metadata without changing source text. */
function sanitizeTranscriptMessage(message) {
	return sanitizeTranscriptStructuredValue(message, /* @__PURE__ */ new WeakSet(), false, "root");
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-cli-history-boundary.ts
/** Advance only a contiguous prefix written by the exact prepared CLI account's live owner. */
function advanceCliHistoryBoundaryInTransaction(database, scope, seq) {
	const writer = getCliHistoryWriter({
		...scope,
		storePath: database.path
	});
	if (writer) advanceCliHistoryBoundaryRangeInTransaction(database, scope, {
		first: seq,
		last: seq
	}, writer, writer.assertCurrent);
}
/** A worker carries account facts; its host-held live owner still grants this exact commit. */
function advanceCliHistoryBoundaryRangeInTransaction(database, scope, range, writer, assertCurrent) {
	if (range.last < range.first) return false;
	const entry = readSessionEntryRow(database, scope.sessionKey)?.entry;
	const generation = readTranscriptGenerationInTransaction(database, scope.sessionId);
	const next = advanceCliHistoryBoundary(entry, scope.sessionId, generation ?? null, range, writer);
	if (!next) return false;
	assertCurrent();
	writeSessionEntry(database, scope.sessionKey, next, { previousEntry: entry });
	return true;
}
//#endregion
//#region src/config/sessions/session-actor-transcript-publication.worker.ts
const owners = /* @__PURE__ */ new WeakMap();
function registerSessionActorTranscriptRewriteOwner(database, rewrite) {
	owners.set(database.db, rewrite);
}
/** A covered resident is hot and reconciled; an absent anchor is an authoritative absence. */
function readSessionActorRewriteFacts(database, scope, entryId) {
	const state = owners.get(database.db)?.read(database, scope);
	const current = state?.hot;
	const projection = state?.transcript.projection;
	const generation = current?.transcript.version.generation;
	if (!state || current?.entry?.sessionId !== scope.sessionId || state.transcript.coldArchive || !generation || !projection || projection.needsRebuild || projection.hasUnclassifiedEvents || projection.indexedSeq !== current.transcript.version.rawSeq) return;
	const row = entryId ? state.transcript.identities.get(entryId) : void 0;
	const active = row && state.transcript.active.get(row.seq);
	if (entryId && !state.transcript.complete && (!row || !active)) return;
	return {
		entry: {
			sessionId: current.entry.sessionId,
			lifecycleRevision: current.entry.lifecycleRevision,
			activeWriterRunId: current.entry.activeWriterRunId
		},
		generation,
		anchor: row && active?.message_position != null ? {
			agentId: state.agentId,
			sessionKey: current.target.sessionKey,
			sessionId: current.entry.sessionId,
			storePath: state.path,
			generation,
			entryId: row.event_id,
			rawSeq: row.seq,
			effectiveParentId: row.parent_id,
			activeMessagePosition: active.message_position,
			...row.message_idempotency_key ? { idempotencyKey: row.message_idempotency_key } : {}
		} : void 0
	};
}
/** Borrow the existing resident owner only for admission- and projection-preserving rewrites. */
function withSessionActorTranscriptRewrite(database, rewrite, run) {
	const owner = owners.get(database.db);
	return owner ? owner.rewrite(database, rewrite, run) : run();
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-store.ts
/** Inserts exact transcript rows without mutating the forward-only projection. */
function insertTranscriptRowsWithoutProjectionInTransaction(database, sessionId, rows, reservedMessageIdempotencyKeys = /* @__PURE__ */ new Set()) {
	return withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(sessionId)], () => {
		const insertEvent = createTranscriptEventInserter(database.db, sessionId);
		const insertIdentity = createTranscriptIdentityInserter(database, sessionId, false);
		for (const row of rows) {
			const event = withoutSqliteDatabaseWriteScope(database.db, () => canonicalizeTranscriptEventMedia(row.event));
			if (row.storedEventSeq === void 0) insertEvent({
				seq: row.seq,
				eventJson: withoutSqliteDatabaseWriteScope(database.db, () => JSON.stringify(event)),
				createdAt: row.createdAt
			});
			else copyRetainedTranscriptPayload(database, sessionId, row.storedEventSeq, row.seq);
			const identity = readTranscriptEventIdentity(event);
			if (!identity) continue;
			if ("messageIdempotencyKey" in row) identity.messageIdempotencyKey = row.messageIdempotencyKey ?? null;
			else if (identity.messageIdempotencyKey && (reservedMessageIdempotencyKeys.has(identity.messageIdempotencyKey) || readIdempotencyKeyOwner(database, sessionId, identity.messageIdempotencyKey))) identity.messageIdempotencyKey = null;
			insertIdentity({
				...identity,
				seq: row.seq,
				createdAt: row.createdAt
			});
		}
	});
}
/** Returns the exact committed JSON, or false when an existing identity owns the event. */
function appendTranscriptEventInTransaction(database, scope, event, options = {}, cursor = {}) {
	const persistedEvent = options.eventJson === void 0 ? canonicalizeTranscriptEventMedia(event) : event;
	return withSqliteDatabaseWriteScope(database.db, [scope.sessionKey, sqliteSessionIdWriteScope(scope.sessionId)], () => {
		const db = getSessionKysely(database.db);
		const actor = readSessionActorTransactionState(database, scope);
		const createdAt = readEventTimestamp(persistedEvent) ?? Date.now();
		let windowUpdatedAt = createdAt;
		const deferWindowTouch = options.touchMutation !== false && Boolean(cursor.initialized || actor?.window);
		const touchWindow = () => {
			cursor.updateWindow ??= prepareSqliteQuerySync(database.db, (parameter) => db.updateTable("session_windows").set({ updated_at: parameter((timestamp) => timestamp) }).where("session_id", "=", scope.sessionId));
			const updateWindow = cursor.updateWindow;
			preserveSessionEntryCacheAcrossWrite(database, () => updateWindow(createdAt));
			if (actor?.window) actor.window.updated_at = createdAt;
		};
		if (cursor.initialized) {
			if (!deferWindowTouch) touchWindow();
		} else {
			ensureTranscriptSessionRoot(database, scope, createdAt, {
				allowStoredAlias: options.allowStoredAlias === true,
				onPlaceholderInserted: options.onPlaceholderInserted,
				deferExistingWindowTouch: deferWindowTouch
			});
			preserveSessionEntryCacheAcrossWrite(database, () => ensureTranscriptGenerationInTransaction(database, scope.sessionId));
			cursor.initialized = true;
		}
		const identity = readTranscriptEventIdentity(persistedEvent);
		if (identity) {
			cursor.readIdentity ??= createTranscriptIdentityReader(database, scope.sessionId);
			if (cursor.readIdentity(identity.eventId)) {
				if (deferWindowTouch) touchWindow();
				return false;
			}
		}
		const idempotencyKeyOwner = identity?.messageIdempotencyKey ? readIdempotencyKeyOwner(database, scope.sessionId, identity.messageIdempotencyKey) : void 0;
		if (idempotencyKeyOwner && options.idempotencyKeyMode === "dedupe") {
			if (deferWindowTouch) touchWindow();
			return false;
		}
		const seq = cursor.nextSeq ?? readNextTranscriptSeq(database, scope.sessionId);
		cursor.insertEvent ??= createTranscriptEventInserter(database.db, scope.sessionId);
		const insertEvent = cursor.insertEvent;
		const eventJson = options.eventJson ?? withoutSqliteDatabaseWriteScope(database.db, () => JSON.stringify(persistedEvent));
		const serializedBytes = transcriptSerializedBytes(database.db, eventJson);
		let projectionNeedsRebuild = false;
		preserveSessionEntryCacheAcrossWrite(database, () => {
			insertEvent({
				seq,
				eventJson,
				createdAt,
				parsedEvent: options.eventJson === void 0 ? void 0 : persistedEvent,
				preparedPayload: options.preparedPayload
			});
			if (actor) {
				actor.hot.transcript.version.rawSeq = seq;
				actor.hot.transcript.watermark.maxSeq = seq;
				const stored = JSON.parse(eventJson);
				actor.transcript.payloads = writableSessionActorMap(actor.transcript.payloads);
				actor.transcript.payloads.set(seq, {
					event: stored,
					serializedBytes
				});
				actor.transcript.navigation = writableSessionActorNavigation(actor.transcript.navigation);
				const navigation = projectSessionModelContextNavigation({ ...stored });
				actor.transcript.navigation.push(Object.assign(navigation, { seq }));
			}
			cursor.nextSeq = seq + 1;
			cursor.appendToIndex ??= createTranscriptIndexAppenderInTransaction(database.db, scope.sessionId);
			projectionNeedsRebuild = cursor.appendToIndex({
				seq,
				event: persistedEvent,
				eventId: identity?.eventId ?? null,
				createdAt
			});
			if (actor) appendSessionActorContextStats(actor, seq, persistedEvent, serializedBytes, projectionNeedsRebuild);
		});
		if (projectionNeedsRebuild) withoutSqliteDatabaseWriteScope(database.db, () => options.onProjectionReconcileNeeded?.());
		if (identity) preserveSessionEntryCacheAcrossWrite(database, () => {
			if (actor) actor.transcript.identities = writableSessionActorMap(actor.transcript.identities);
			if (idempotencyKeyOwner && options.idempotencyKeyMode === "relocate-owner") {
				executeSqliteQuerySync(database.db, db.updateTable("transcript_event_identities").set({ message_idempotency_key: null }).where("session_id", "=", scope.sessionId).where("event_id", "=", idempotencyKeyOwner.eventId));
				const previous = actor?.transcript.identities.get(idempotencyKeyOwner.eventId);
				if (previous) actor?.transcript.identities.set(previous.event_id, {
					...previous,
					message_idempotency_key: null
				});
			}
			identity.messageIdempotencyKey = idempotencyKeyOwner && options.idempotencyKeyMode !== "relocate-owner" ? null : identity.messageIdempotencyKey;
			cursor.insertIdentity ??= createTranscriptIdentityInserter(database, scope.sessionId, true);
			cursor.insertIdentity({
				...identity,
				seq,
				createdAt
			});
			actor?.transcript.identities.set(identity.eventId, {
				session_id: scope.sessionId,
				event_id: identity.eventId,
				seq,
				event_type: identity.eventType,
				parent_id: identity.parentId,
				message_idempotency_key: identity.messageIdempotencyKey,
				created_at: createdAt
			});
		});
		advanceCliHistoryBoundaryInTransaction(database, scope, seq);
		if (isRecord(persistedEvent) && persistedEvent.type === "compaction" && parseCompactionDetails(persistedEvent.details)?.qualityDegraded) {
			const entry = readSessionEntryRow(database, scope.sessionKey)?.entry;
			if (entry?.sessionId === scope.sessionId && !entry.compactionQualityDegraded) windowUpdatedAt = writeSessionEntry(database, scope.sessionKey, {
				...entry,
				compactionQualityDegraded: true
			}, { previousEntry: entry }).updatedAt;
		}
		cursor.rowTranscript = projectionNeedsRebuild ? void 0 : projectSessionRowTranscriptFields(persistedEvent, serializedBytes, seq);
		if (options.touchMutation !== false) preserveSessionEntryCacheAcrossWrite(database, () => {
			touchTranscriptMutationInTransaction(database, scope.sessionId, deferWindowTouch ? windowUpdatedAt : void 0, cursor.rowTranscript);
		});
		scheduleTranscriptProjectionReconcile(database, scope.sessionId, projectionNeedsRebuild, options);
		return eventJson;
	});
}
function appendTranscriptEventsInTransaction(database, scope, events, options = {}) {
	let appended = 0;
	let projectionNeedsRebuild = false;
	const cursor = {};
	const iterator = events[Symbol.iterator]();
	const appendOptions = {
		...options,
		onProjectionReconcileNeeded: () => projectionNeedsRebuild = true,
		scheduleProjectionReconcile: false,
		touchMutation: false
	};
	try {
		let next = iterator.next();
		while (!next.done) {
			const inserted = appendTranscriptEventInTransaction(database, scope, next.value, appendOptions, cursor);
			if (inserted) appended += 1;
			next = iterator.next(inserted !== false);
		}
	} catch (error) {
		try {
			iterator.return?.();
		} catch {}
		throw error;
	}
	if (appended > 0) {
		if (options.touchMutation !== false) preserveSessionEntryCacheAcrossWrite(database, () => {
			touchTranscriptMutationInTransaction(database, scope.sessionId, void 0, projectionNeedsRebuild ? void 0 : cursor.rowTranscript);
		});
		scheduleTranscriptProjectionReconcile(database, scope.sessionId, projectionNeedsRebuild, options);
	}
	return appended;
}
function replaceSqliteTranscriptEventsInTransaction(database, resolved, events, options = {}) {
	return withSqliteDatabaseWriteScope(database.db, [resolved.sessionKey, sqliteSessionIdWriteScope(resolved.sessionId)], () => {
		const rebuildSynchronously = events.length > 0 && shouldRebuildSessionTranscriptIndexSynchronously(database.db, resolved.sessionId, events);
		const preservedTranscriptUpdatedAt = options.preserveSessionWindowRecency === true ? readTranscriptMutationStateInTransaction(database, resolved.sessionId).updatedAt : void 0;
		const previousGeneration = readTranscriptGenerationInTransaction(database, resolved.sessionId);
		const deleted = deleteTranscriptEventsInTransaction(database, resolved.sessionId);
		if (events.length === 0) {
			pruneTranscriptReactionsInTransaction(database, resolved);
			deleteSessionTranscriptIndexInTransaction(database.db, resolved.sessionId);
			if (deleted || previousGeneration) {
				rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
				recordTranscriptReplacementMutation(database, resolved.sessionId, preservedTranscriptUpdatedAt);
			}
			return;
		}
		if (!deleted || options.preserveSessionWindowRecency !== true) ensureTranscriptSessionRoot(database, resolved, readEventTimestamp(events[0]) ?? Date.now());
		if (deleted || previousGeneration) rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
		else ensureTranscriptGenerationInTransaction(database, resolved.sessionId);
		if (rebuildSynchronously) deleteSessionTranscriptIndexInTransaction(database.db, resolved.sessionId);
		else markSessionTranscriptIndexDirtyInTransaction(database.db, resolved.sessionId);
		let seq = 0;
		const seenEventIds = /* @__PURE__ */ new Set();
		const seenMessageIdempotencyKeys = /* @__PURE__ */ new Set();
		const insertEvent = createTranscriptEventInserter(database.db, resolved.sessionId);
		const insertIdentity = createTranscriptIdentityInserter(database, resolved.sessionId, false);
		const appendToIndex = createTranscriptIndexAppenderInTransaction(database.db, resolved.sessionId);
		for (const [eventIndex, event] of events.entries()) {
			const persistedEvent = withoutSqliteDatabaseWriteScope(database.db, () => canonicalizeTranscriptEventMedia(event));
			const createdAt = options.createdAtByIndex?.[eventIndex] ?? readEventTimestamp(persistedEvent) ?? Date.now();
			const identity = readTranscriptEventIdentity(persistedEvent);
			if (identity && seenEventIds.has(identity.eventId)) continue;
			insertEvent({
				seq,
				eventJson: withoutSqliteDatabaseWriteScope(database.db, () => JSON.stringify(persistedEvent)),
				createdAt
			});
			appendToIndex({
				seq,
				event: persistedEvent,
				eventId: identity?.eventId ?? null,
				createdAt
			});
			if (identity) {
				seenEventIds.add(identity.eventId);
				if (identity.messageIdempotencyKey) {
					if (seenMessageIdempotencyKeys.has(identity.messageIdempotencyKey)) identity.messageIdempotencyKey = null;
					else seenMessageIdempotencyKeys.add(identity.messageIdempotencyKey);
				}
				insertIdentity({
					...identity,
					seq,
					createdAt
				});
			}
			seq += 1;
		}
		pruneTranscriptReactionsInTransaction(database, resolved);
		if (deleted || seq > 0) {
			if (rebuildSynchronously) reconcileSessionTranscriptIndexInTransaction(database.db, resolved.sessionId);
			else {
				withoutSqliteDatabaseWriteScope(database.db, () => options.onProjectionReconcileNeeded?.());
				scheduleTranscriptProjectionReconcile(database, resolved.sessionId, true, options);
			}
			recordTranscriptReplacementMutation(database, resolved.sessionId, preservedTranscriptUpdatedAt);
		}
	});
}
function recordTranscriptReplacementMutation(database, sessionId, preservedUpdatedAt) {
	if (preservedUpdatedAt === void 0 || preservedUpdatedAt === null) {
		touchTranscriptMutationInTransaction(database, sessionId);
		return;
	}
	advanceTranscriptMutationAtInTransaction(database, sessionId, preservedUpdatedAt, { strictly: true });
}
/** Rewrite existing transcript rows exactly, without append-time deduplication. */
function rewriteSqliteTranscriptEventRowsInTransaction(database, resolved, rows, options = {}) {
	if (rows.length === 0) return;
	const rewrites = rows.map((row) => {
		const eventJson = JSON.stringify(canonicalizeTranscriptEventMedia(row.event));
		return {
			...row,
			eventJson,
			payload: options.legacyTextStorage ? void 0 : prepareTranscriptPayload(database.db, eventJson)
		};
	});
	const projectionUnchanged = (options.projectionCurrent || !sessionTranscriptIndexNeedsReconcile(database.db, resolved.sessionId)) && rewrites.every((row) => transcriptRewritePreservesProjection(row.expectedEventJson, row.eventJson));
	const rebuildSynchronously = !options.legacyTextStorage && !projectionUnchanged && shouldRebuildSessionTranscriptIndexSynchronously(database.db, resolved.sessionId);
	const admissionUnchanged = rewrites.every((row) => transcriptRewritePreservesAdmission(row.expectedEventJson, row.eventJson));
	const run = () => withSqliteDatabaseWriteScope(database.db, [resolved.sessionKey, sqliteSessionIdWriteScope(resolved.sessionId)], () => {
		const db = getSessionKysely(database.db);
		const rewrite = prepareSqliteQuerySync(database.db, (parameter) => db.updateTable("transcript_events").set(options.legacyTextStorage ? { event_json: parameter((row) => row.eventJson) } : {
			event_json: parameter((row) => row.payload.event_json),
			event_zstd: parameter((row) => row.payload.event_zstd),
			event_utf8_bytes: parameter((row) => row.payload.event_utf8_bytes),
			navigation_json: parameter((row) => row.payload.navigation_json),
			navigation_type: parameter((row) => row.payload.navigation_type),
			navigation_custom_type: parameter((row) => row.payload.navigation_custom_type),
			navigation_display: parameter((row) => row.payload.navigation_display),
			message_role: parameter((row) => row.payload.message_role),
			navigation_last_type: parameter((row) => row.payload.navigation_last_type),
			navigation_last_custom_type: parameter((row) => row.payload.navigation_last_custom_type),
			navigation_valid: parameter((row) => row.payload.navigation_valid)
		}).where("session_id", "=", resolved.sessionId).where("seq", "=", parameter((row) => row.seq)).where(options.legacyTextStorage ? "event_json" : transcriptEventJsonSql(database.db), "=", parameter((row) => row.expectedEventJson)));
		for (const row of rewrites) if (rewrite(row).numAffectedRows !== 1n) throw new SqliteTranscriptMutationConflictError(resolved.sessionId);
		rewriteSessionActorContextStats(database, resolved, rewrites, projectionUnchanged);
		const generation = admissionUnchanged ? void 0 : rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
		if (!projectionUnchanged) {
			if (options.legacyTextStorage) markSessionTranscriptIndexDirtyInTransaction(database.db, resolved.sessionId);
			else reconcileRewrittenTranscriptIndex(database, resolved.sessionId, rebuildSynchronously);
		}
		touchTranscriptMutationInTransaction(database, resolved.sessionId);
		return generation;
	});
	return projectionUnchanged && admissionUnchanged ? withSessionActorTranscriptRewrite(database, {
		sessionKey: resolved.sessionKey,
		sessionId: resolved.sessionId,
		rows: rewrites.map((row) => ({
			rawSeq: row.seq,
			event: JSON.parse(row.eventJson),
			serializedBytes: transcriptSerializedBytes(database.db, row.eventJson)
		}))
	}, run) : run();
}
function reconcileRewrittenTranscriptIndex(database, sessionId, rebuildSynchronously) {
	markSessionTranscriptIndexDirtyInTransaction(database.db, sessionId);
	if (rebuildSynchronously) reconcileSessionTranscriptIndexInTransaction(database.db, sessionId);
	else scheduleTranscriptProjectionReconcile(database, sessionId, true, {});
}
function updateSqliteTranscriptEventJsonInTransaction(database, sessionId, updates) {
	if (updates.length === 0) return;
	return withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(sessionId)], () => {
		const rebuildSynchronously = shouldRebuildSessionTranscriptIndexSynchronously(database.db, sessionId);
		const update = createTranscriptPayloadUpdater(database.db, sessionId);
		for (const row of updates) update({
			seq: row.seq,
			...prepareTranscriptPayload(database.db, row.eventJson)
		});
		rotateTranscriptGenerationInTransaction(database, sessionId);
		reconcileRewrittenTranscriptIndex(database, sessionId, rebuildSynchronously);
		recordTranscriptReplacementMutation(database, sessionId, readTranscriptMutationStateInTransaction(database, sessionId).updatedAt);
	});
}
function sanitizeTranscriptMessageForStorage(message) {
	return isTranscriptAgentMessage(message) ? sanitizeTranscriptMessage(message) : message;
}
function isTranscriptAgentMessage(value) {
	return isRecord(value) && typeof value.role === "string";
}
//#endregion
export { rewriteSqliteTranscriptEventRowsInTransaction as a, readSessionActorRewriteFacts as c, sanitizeOpenAIReasoningSignature as d, sanitizeTranscriptMessage as f, replaceSqliteTranscriptEventsInTransaction as i, registerSessionActorTranscriptRewriteOwner as l, appendTranscriptEventsInTransaction as n, sanitizeTranscriptMessageForStorage as o, insertTranscriptRowsWithoutProjectionInTransaction as r, updateSqliteTranscriptEventJsonInTransaction as s, appendTranscriptEventInTransaction as t, advanceCliHistoryBoundaryRangeInTransaction as u };
