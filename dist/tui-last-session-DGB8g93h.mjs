import { o as normalizeLowercaseStringOrEmpty, s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { i as asOptionalObjectRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { M as parseAgentSessionKey, _ as toAgentStoreSessionKey, r as agentSessionKeysMatchByRequestKey } from "./session-key-C09ow4h0.mjs";
import { a as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { d as readPersistedMediaFacts, o as isImageMediaFact } from "./media-facts-CJdQ4R61.mjs";
import { t as TUI_LAST_SESSION_STATE_KEY_PREFIX } from "./tui-last-session.contract.js";
import { r as extractTextFromMessage } from "./tui-formatters-MrekNjkx.mjs";
import { createHash } from "node:crypto";
//#region packages/gateway-client/src/session-projection-message-identity.ts
function readSessionProjectionString(value) {
	return normalizeNullableString(value);
}
function readPositiveSafeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : null;
}
/** History and status markers carry transcript order even when they have no chat role. */
function readSessionMessageSequence(message, envelope) {
	return readPositiveSafeInteger(asNullableRecord(asNullableRecord(message)?.["__openclaw"])?.seq) ?? readPositiveSafeInteger(envelope?.messageSeq);
}
/** Run ownership normalizes a user-turn suffix without changing its persisted send key. */
function normalizeSessionProjectionRunId(value) {
	const runId = readSessionProjectionString(value);
	return runId?.endsWith(":user") ? runId.slice(0, -5) || null : runId;
}
/** Persisted row facts win; assistant run ownership comes from its authoritative producer. */
function readSessionMessageIdentity(message, envelope) {
	const record = asNullableRecord(message);
	const role = readSessionProjectionString(record?.role)?.toLowerCase();
	if (!record || !role) return null;
	const metadata = asNullableRecord(record["__openclaw"]);
	const importedFrom = readSessionProjectionString(metadata?.importedFrom);
	const cliSessionId = readSessionProjectionString(metadata?.cliSessionId);
	const externalId = readSessionProjectionString(metadata?.externalId);
	const position = asNullableRecord(metadata?.transcriptPosition);
	const positionSource = readSessionProjectionString(position?.source);
	const isImported = !(positionSource !== null && positionSource.length <= 128 && typeof position?.rawSeq === "number" && Number.isSafeInteger(position.rawSeq) && position.rawSeq >= 0) && Boolean(importedFrom || cliSessionId || externalId);
	const idempotencyKey = readSessionProjectionString(metadata?.idempotencyKey) ?? readSessionProjectionString(record.idempotencyKey) ?? readSessionProjectionString(envelope?.idempotencyKey) ?? readSessionProjectionString(envelope?.clientRunId);
	const persistedRunId = normalizeSessionProjectionRunId(idempotencyKey);
	const envelopeRunId = normalizeSessionProjectionRunId(envelope?.runId);
	const metadataRunId = normalizeSessionProjectionRunId(metadata?.runId);
	const fallbackRunId = normalizeSessionProjectionRunId(asNullableRecord(record.openclawStreamFallback)?.runId);
	const mirroredMessage = readSessionProjectionString(metadata?.mirrorOrigin) !== null;
	const isCliAssistant = role === "assistant" && readSessionProjectionString(record.api)?.toLowerCase() === "cli";
	const canonicalPersistedRunId = isCliAssistant && persistedRunId?.startsWith("cli-assistant:") ? readSessionProjectionString(persistedRunId.slice(14)) : persistedRunId;
	const runId = role === "assistant" ? metadataRunId ?? envelopeRunId ?? fallbackRunId ?? (isCliAssistant || !mirroredMessage ? canonicalPersistedRunId : null) : metadataRunId ?? canonicalPersistedRunId ?? envelopeRunId;
	return {
		role,
		id: readSessionProjectionString(metadata?.id) ?? readSessionProjectionString(envelope?.messageId),
		sequence: readSessionMessageSequence(message, envelope),
		idempotencyKey,
		sendId: role === "user" ? persistedRunId ?? runId : null,
		runId,
		isImported,
		externalSource: isImported && importedFrom && cliSessionId && externalId ? JSON.stringify([
			importedFrom,
			cliSessionId,
			externalId
		]) : null
	};
}
/** A commentary item's display identity is separate from the transcript row that later owns it. */
function readAssistantStreamSegmentIdentity(message) {
	const record = asNullableRecord(message);
	if (readSessionProjectionString(record?.role)?.toLowerCase() !== "assistant") return;
	const fallback = asNullableRecord(record?.openclawStreamFallback);
	const itemId = readSessionProjectionString(fallback?.itemId);
	if (!itemId) return;
	const runId = readSessionMessageIdentity(message)?.runId ?? readSessionProjectionString(record?.runId) ?? readSessionProjectionString(fallback?.runId);
	return {
		itemId,
		...runId ? { runId } : {}
	};
}
/** A saved occurrence can enrich its live projection, never another durable row. */
function sameAssistantPersistenceReceipt(left, right) {
	return Boolean(left?.role === "assistant" && right?.role === "assistant" && !left.isImported && !right.isImported && left.idempotencyKey && left.idempotencyKey === right.idempotencyKey && (!left.id && left.sequence === null || !right.id && right.sequence === null));
}
/** Local turns have no durable transcript metadata beyond their own optional send key. */
function isLocallyOptimisticSessionMessage(message) {
	const record = asNullableRecord(message);
	const role = readSessionProjectionString(record?.role)?.toLowerCase();
	if (role !== "user" && role !== "assistant") return false;
	if (asNullableRecord(record?.openclawStreamFallback)) return false;
	const metadata = asNullableRecord(record?.["__openclaw"]);
	return !metadata || Object.keys(metadata).every((key) => key === "idempotencyKey");
}
function sameTranscriptIdentity(left, right) {
	if (!left || !right || left.role !== right.role) return false;
	if (left.isImported || right.isImported) {
		if (!left.isImported || !right.isImported) return false;
		if (left.externalSource || right.externalSource) return Boolean(left.externalSource && left.externalSource === right.externalSource);
		return left.sequence !== null && right.sequence !== null && left.sequence === right.sequence;
	}
	if (left.id || right.id) return Boolean(left.id && right.id && left.id === right.id);
	return left.sequence !== null && right.sequence !== null && left.sequence === right.sequence;
}
/** Normalize a message into its live, durable, or pending projection entry. */
function createSessionProjectionEntry(message, options) {
	const identity = readSessionMessageIdentity(message, options?.envelope);
	const fallback = asNullableRecord(asNullableRecord(message)?.openclawStreamFallback);
	const provisionalFallback = Boolean(fallback && identity?.role === "assistant" && !identity.id && identity.sequence === null);
	const inferredPendingRunId = options?.live !== true && isLocallyOptimisticSessionMessage(message) ? identity?.runId : null;
	const pendingRunId = normalizeSessionProjectionRunId(options?.pendingRunId ?? inferredPendingRunId);
	return {
		message,
		identity,
		afterSequence: options?.envelope?.afterSequence !== void 0 ? options.envelope.afterSequence : provisionalFallback && typeof fallback?.afterSequence === "number" ? fallback.afterSequence : void 0,
		live: options?.live === true || provisionalFallback,
		pending: pendingRunId !== null,
		pendingRunId
	};
}
//#endregion
//#region src/tui/tui-images.ts
/** Keep structured image references intact instead of recovering paths from rendered prose. */
function extractTuiImageSources(message) {
	const value = asOptionalObjectRecord(message);
	if (!value) return [];
	const images = [];
	const sources = /* @__PURE__ */ new Set();
	for (const block of Array.isArray(value.content) ? value.content : []) {
		const entry = asOptionalObjectRecord(block);
		if (!entry) continue;
		const attachment = entry.type === "attachment" ? asOptionalObjectRecord(entry.attachment) : void 0;
		const image = attachment ?? entry;
		if (attachment ? attachment.kind !== "image" && attachment.kind !== "sticker" && !(typeof attachment.mimeType === "string" && attachment.mimeType.startsWith("image/")) : entry.type !== "image" && entry.type !== "image_url" && entry.type !== "input_image") continue;
		const nestedSource = asOptionalObjectRecord(image.source);
		const url = image.url ?? asOptionalObjectRecord(image.image_url)?.url ?? image.image_url ?? nestedSource?.url ?? (typeof image.source === "string" ? image.source : void 0);
		const data = image.data ?? nestedSource?.data;
		const mimeType = image.mimeType ?? nestedSource?.media_type ?? nestedSource?.mimeType;
		const source = typeof url === "string" && url.trim() ? url.trim() : typeof data === "string" && typeof mimeType === "string" ? `data:${mimeType};base64,${data}` : void 0;
		if (source && !sources.has(source)) {
			sources.add(source);
			images.push({
				source,
				...typeof image.artifactId === "string" ? { artifactId: image.artifactId } : {}
			});
		}
	}
	for (const fact of readPersistedMediaFacts(value) ?? []) {
		const source = fact.url || fact.path;
		if (source && isImageMediaFact(fact) && !sources.has(source)) {
			sources.add(source);
			images.push({ source });
		}
	}
	return images;
}
//#endregion
//#region src/tui/tui-session-events.ts
function captureTuiSessionSelection(state) {
	return {
		sessionKey: state.currentSessionKey,
		agentId: state.currentAgentId
	};
}
/** A first durable ID may bind an unresolved selection, but a replacement retires it. */
function captureTuiSessionIncarnation(state) {
	const selection = captureTuiSessionSelection(state);
	const sessionId = state.currentSessionId;
	const generation = state.sessionGeneration ?? 0;
	return {
		selection,
		sessionId,
		isCurrent: () => matchesTuiSessionSelection(state, selection) && (state.sessionGeneration ?? 0) === generation && (sessionId === null || state.currentSessionId === sessionId)
	};
}
/** Explicit selections stay distinct even when Gateway response aliases can match. */
function matchesTuiSessionSelection(state, selection) {
	return state.currentAgentId === selection.agentId && state.currentSessionKey === "global" === (selection.sessionKey === "global") && agentSessionKeysMatchByRequestKey(state.currentSessionKey, selection.sessionKey);
}
/** Returned metadata can name a legacy alias after its request receipt is accepted. */
function matchesTuiSessionMetadata(state, result) {
	if (!result.key) return true;
	const parsed = parseAgentSessionKey(result.key);
	return (!parsed || normalizeAgentId(parsed.agentId) === state.currentAgentId) && agentSessionKeysMatchByRequestKey(state.currentSessionKey, result.key);
}
/** Reads the durable user identity without mistaking another run's prompt for this one. */
function readTuiSessionUserMessage(event) {
	const message = event.message;
	if (!message || typeof message !== "object" || Array.isArray(message)) return null;
	const record = message;
	const identity = readSessionMessageIdentity(message, event);
	if (identity?.role !== "user") return null;
	const persistedSequence = readSessionMessageSequence(message);
	const messageId = identity.isImported ? identity.externalSource ? `external:${identity.externalSource}` : persistedSequence !== null ? `imported-seq:${persistedSequence}` : null : identity.id ?? (identity.sequence !== null ? `seq:${identity.sequence}` : null);
	const text = extractTextFromMessage(record);
	if (!messageId || !text) return null;
	const images = extractTuiImageSources(message);
	return {
		messageId,
		text,
		...identity.runId ? { runId: identity.runId } : {},
		...identity.sendId ? { sendId: identity.sendId } : {},
		...images.length > 0 ? { images } : {}
	};
}
/** Preserves opaque peer IDs while guarding canonical, global, and alias ownership. */
function matchesSelectedTuiSession(state, event, options) {
	const legacyOwner = normalizeLowercaseStringOrEmpty(event.sessionKey) === "global" || options?.requireAliasOwnership ? state.agentDefaultId : state.currentAgentId;
	return matchesOwnedTuiSession(state.currentSessionKey, state.currentAgentId, event, legacyOwner);
}
/** Compare qualified identities without accepting contradictory owner claims. */
function matchesOwnedTuiSession(session, agentId, event, legacyOwnerAgentId) {
	const owner = normalizeLowercaseStringOrEmpty(event.agentId);
	const selected = normalizeLowercaseStringOrEmpty(agentId);
	return (parseAgentSessionKey(event.sessionKey)?.agentId || owner || normalizeLowercaseStringOrEmpty(legacyOwnerAgentId)) === selected && (!owner || owner === selected) && Boolean(event.sessionKey?.trim() && session.trim()) && toAgentStoreSessionKey({
		requestKey: event.sessionKey,
		agentId: selected
	}) === toAgentStoreSessionKey({
		requestKey: session,
		agentId: selected
	});
}
//#endregion
//#region src/tui/tui-last-session.ts
function stateDatabaseOptions(stateDir) {
	return stateDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} } : { env: process.env };
}
/** Builds a stable private-store key for the current TUI connection, agent, and session scope. */
function buildTuiLastSessionScopeKey(params) {
	const agentId = normalizeAgentId(params.agentId);
	const connectionUrl = params.connectionUrl.trim() || "local";
	return createHash("sha256").update(`${params.sessionScope}\n${agentId}\n${connectionUrl}`).digest("hex").slice(0, 32);
}
function isHeartbeatSessionKey(sessionKey) {
	return normalizeLowercaseStringOrEmpty(sessionKey).endsWith(":heartbeat");
}
/** Detects heartbeat/system sessions that should not become the remembered human session. */
function isHeartbeatLikeTuiSession(session) {
	if (isHeartbeatSessionKey(session.key)) return true;
	return [
		session.provider,
		session.lastProvider,
		session.lastChannel,
		session.lastTo,
		session.origin?.provider,
		session.origin?.surface,
		session.origin?.label
	].some((marker) => normalizeLowercaseStringOrEmpty(marker) === "heartbeat");
}
/** Reads the remembered session key for a scope from canonical shared state. */
async function readTuiLastSessionKey(params) {
	const result = await executeExistingOpenClawStateRead(stateDatabaseOptions(params.stateDir), {
		type: "tui.lastSession.read",
		stateKey: `${TUI_LAST_SESSION_STATE_KEY_PREFIX}${params.scopeKey}`
	});
	if (result === void 0) return null;
	if (!result.ok || result.type !== "tui.lastSession.read") throw new Error("Unexpected remembered TUI session read result");
	if (!result.row) return null;
	const stored = JSON.parse(result.row.value_json);
	if (typeof stored !== "string") throw new Error("Remembered TUI session key must be a string");
	const rememberedKey = stored.trim();
	return rememberedKey && !isHeartbeatSessionKey(rememberedKey) ? rememberedKey : null;
}
/** Writes the remembered session key unless it is empty, unknown, or heartbeat-owned. */
async function writeTuiLastSessionKey(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey || sessionKey === "unknown" || isHeartbeatSessionKey(sessionKey)) return;
	await executeOpenClawStateWorker(captureOpenClawStateWorkerContext(stateDatabaseOptions(params.stateDir)), {
		type: "tui.lastSession.write",
		input: {
			stateKey: `${TUI_LAST_SESSION_STATE_KEY_PREFIX}${params.scopeKey}`,
			sessionKey
		}
	});
}
/** Owns pending session-memory writes through TUI shutdown and reports the first failure. */
function createRememberSessionKeyWriter(params) {
	const work = new AsyncWorkScope();
	let failureReported = false;
	return {
		remember: (sessionKey) => {
			const trimmed = sessionKey.trim();
			if (work.isClosing || !trimmed || trimmed === "unknown") return Promise.resolve();
			const scopeKey = params.buildScopeKey(trimmed);
			return work.track(async () => {
				try {
					await params.write({
						scopeKey,
						sessionKey: trimmed
					});
				} catch (err) {
					if (!failureReported) {
						failureReported = true;
						params.reportFailure(err instanceof Error ? err.message : String(err));
					}
				}
			});
		},
		close: () => work.drain()
	};
}
/** Removes restore pointers that target sessions retired by doctor repair. */
async function clearTuiLastSessionPointers(params) {
	if (params.sessionKeys.size === 0) return 0;
	const retiredSessionKeys = [...params.sessionKeys];
	const options = stateDatabaseOptions(params.stateDir);
	const context = captureOpenClawStateWorkerContext(options);
	return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "tui.lastSession.clear",
		input: { retiredSessionKeys }
	}), { existingOnly: true }) ?? 0;
}
/** Resolves a remembered key to a currently listed session for the active agent. */
function resolveRememberedTuiSessionKey(params) {
	const rememberedKey = params.rememberedKey?.trim();
	if (!rememberedKey) return null;
	if (isHeartbeatSessionKey(rememberedKey)) return null;
	const currentAgentId = normalizeAgentId(params.currentAgentId);
	return params.sessions.find((session) => !isHeartbeatLikeTuiSession(session) && matchesOwnedTuiSession(rememberedKey, currentAgentId, { sessionKey: session.key }, currentAgentId))?.key ?? null;
}
//#endregion
export { sameTranscriptIdentity as C, sameAssistantPersistenceReceipt as S, normalizeSessionProjectionRunId as _, resolveRememberedTuiSessionKey as a, readSessionMessageSequence as b, captureTuiSessionSelection as c, matchesTuiSessionMetadata as d, matchesTuiSessionSelection as f, isLocallyOptimisticSessionMessage as g, createSessionProjectionEntry as h, readTuiLastSessionKey as i, matchesOwnedTuiSession as l, extractTuiImageSources as m, clearTuiLastSessionPointers as n, writeTuiLastSessionKey as o, readTuiSessionUserMessage as p, createRememberSessionKeyWriter as r, captureTuiSessionIncarnation as s, buildTuiLastSessionScopeKey as t, matchesSelectedTuiSession as u, readAssistantStreamSegmentIdentity as v, readSessionProjectionString as x, readSessionMessageIdentity as y };
