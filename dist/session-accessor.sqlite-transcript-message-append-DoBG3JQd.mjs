import { I as resolveTimestampMsToIsoString } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { H as copyPreparedModelVisibleToolText } from "./redact-DJ8j6ADa.mjs";
import { a as prepareTranscriptPayloadForReuse } from "./transcript-payload-Yc_w8Yx5.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { r as canonicalizePersistedUserMessageMedia } from "./media-facts-CJdQ4R61.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { h as resolveSessionPendingInputAppend, r as consumeSessionPendingInput } from "./session-accessor.sqlite-pending-inputs-DtDOOibA.mjs";
import { a as isOpenClawDeliveryMirrorAssistantMessage } from "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { c as readTranscriptMessageByScopedIdempotencyKey, l as redactTranscriptMessageForStorage, s as readTranscriptMessageByEventId, t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { O as isTranscriptEntryOnActivePathInTransaction, b as readTranscriptIdentityByEventId, j as resolveTranscriptMessageAppendParent } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { t as ensureTranscriptHeader } from "./session-accessor.sqlite-transcript-header-DXW9UGub.mjs";
import { r as readActiveTranscriptEntryAnchorInTransaction } from "./session-accessor.sqlite-transcript-anchor-eRtZH9vP.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
import { isProxy } from "node:util/types";
//#region src/config/sessions/transcript-json.ts
const ownedTranscriptRoots = /* @__PURE__ */ new WeakSet();
/** Preserve ordinary transcript objects while admitting their JSON storage shape. */
function normalizeTranscriptJsonValue(value, key, preserveSource = false) {
	const visited = /* @__PURE__ */ new Set();
	if (requiresNativeJson(value, visited)) {
		const projected = JSON.parse(JSON.stringify({
			__proto__: null,
			[key]: value
		}));
		const normalized = isRecord(projected) && Object.hasOwn(projected, key) ? projected[key] : void 0;
		if (isRecord(value) && isRecord(normalized)) copyPreparedModelVisibleToolText(value, normalized);
		return normalizePlainJson(normalized, false, visited, false);
	}
	return normalizePlainJson(value, preserveSource, visited);
}
function requiresNativeJson(value, ancestors) {
	if (value === null || typeof value !== "object") return typeof value === "bigint" || typeof value === "function";
	if (isProxy(value)) return true;
	const array = Array.isArray(value);
	if (Object.getPrototypeOf(value) !== (array ? Array.prototype : Object.prototype) || "toJSON" in value || ancestors.has(value)) return true;
	ancestors.add(value);
	try {
		for (const member of Reflect.ownKeys(value)) {
			if (array && member === "length") continue;
			const descriptor = Object.getOwnPropertyDescriptor(value, member);
			if (typeof member !== "string" || !descriptor.enumerable || !("value" in descriptor) || array && (!/^(0|[1-9]\d*)$/.test(member) || Number(member) >= value.length) || requiresNativeJson(descriptor.value, ancestors)) return true;
		}
		if (array) {
			for (let index = 0; index < value.length; index++) if (!Object.hasOwn(value, index) && index in value) return true;
		}
		return false;
	} finally {
		ancestors.delete(value);
	}
}
function normalizePlainJson(value, preserveSource, admitted, copyStrings = true, retainRoots = true) {
	if (value === null || typeof value !== "object") {
		if (copyStrings && typeof value === "string") return Buffer.from(value, "utf16le").toString("utf16le");
		return typeof value === "number" ? Number.isFinite(value) ? value || 0 : null : typeof value === "symbol" ? void 0 : value;
	}
	if (ownedTranscriptRoots.has(value) || admitted.has(value)) return value;
	const array = Array.isArray(value);
	const keys = Object.keys(value);
	const mutable = !preserveSource && Object.isExtensible(value);
	let normalized = value;
	const length = array ? value.length : keys.length;
	for (let index = 0; index < length; index++) {
		const member = array ? String(index) : keys[index];
		const descriptor = Object.getOwnPropertyDescriptor(value, member);
		const current = descriptor?.value;
		const next = normalizePlainJson(current, preserveSource, admitted, copyStrings, false);
		const retained = array && next === void 0 ? null : next;
		if (retained && typeof retained === "object") {
			Object.freeze(retained);
			admitted.add(retained);
			if (retainRoots) ownedTranscriptRoots.add(retained);
		}
		if (!(copyStrings && typeof current === "string") && Object.is(current, retained) && (retained !== void 0 || !descriptor)) continue;
		if (normalized === value && (!mutable || descriptor && (!descriptor.configurable || !descriptor.writable))) normalized = array ? value.slice() : { ...value };
		if (retained === void 0) Reflect.deleteProperty(normalized, member);
		else Object.defineProperty(normalized, member, {
			value: retained,
			enumerable: true,
			configurable: true,
			writable: true
		});
	}
	if (isRecord(value) && isRecord(normalized)) copyPreparedModelVisibleToolText(value, normalized);
	return normalized;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-message-append.ts
var TranscriptTurnAdmissionConflictError = class extends Error {
	constructor(idempotencyKey) {
		super(`Transcript idempotency key "${idempotencyKey}" conflicts with the admitted message.`);
		this.name = "TranscriptTurnAdmissionConflictError";
	}
};
function messagesMatchForIdempotentReplay(stored, candidate) {
	const storedDelivery = isRecord(stored) ? stored.openclawDelivery : void 0;
	const legacyMediaMirror = isRecord(stored) && isOpenClawDeliveryMirrorAssistantMessage(stored) && stored.api === "openclaw-transcript" && (storedDelivery === void 0 || isRecord(storedDelivery) && !Object.hasOwn(storedDelivery, "mediaUrls"));
	const serializedShape = (message, projectLegacyMedia = false) => {
		if (!isRecord(message)) return message;
		const { timestamp: _timestamp, ...stable } = message;
		if (projectLegacyMedia && isRecord(stable.openclawDelivery) && Array.isArray(stable.openclawDelivery.mediaUrls) && stable.openclawDelivery.mediaUrls.every((url) => typeof url === "string")) {
			const { mediaUrls: _mediaUrls, ...delivery } = stable.openclawDelivery;
			if (storedDelivery === void 0 && Object.keys(delivery).length === 0) delete stable.openclawDelivery;
			else stable.openclawDelivery = delivery;
		}
		const serialized = JSON.stringify(stable);
		return serialized === void 0 ? void 0 : JSON.parse(serialized);
	};
	return isDeepStrictEqual(serializedShape(stored), serializedShape(candidate, legacyMediaMirror));
}
function serializePreparedMessageEvent(envelope, messageJson) {
	return `${JSON.stringify(envelope).slice(0, -1)},"message":${messageJson}}`;
}
/** The append owner retains its canonical message and storage bytes across retries. */
function prepareTranscriptMessageAppend(options, candidate) {
	if (!isRecord(options.message) || options.message.role === "user") return;
	const prepared = prepareTranscriptMessageAppendForWorker(options);
	if (!candidate || options.message.role !== "assistant" && options.message.role !== "toolResult") return prepared;
	const eventJson = serializePreparedMessageEvent(candidate.envelope, prepared.messageJson);
	const read = withOpenClawAgentDatabaseReadOnly(({ db }) => prepareTranscriptPayloadForReuse(db, eventJson, {
		...candidate.envelope,
		message: prepared.persistedMessage
	}), toDatabaseOptions(resolveSqliteTranscriptScope(candidate.scope)));
	return read.found ? {
		...prepared,
		physicalPayload: read.value
	} : prepared;
}
/** Redaction stays on the host; physical payload preparation belongs to the writer. */
function prepareTranscriptMessageAppendForWorker(options) {
	const message = redactTranscriptMessageForStorage(options.message, options);
	const persistedMessage = normalizeTranscriptJsonValue(canonicalizePersistedUserMessageMedia(message).message, "");
	return {
		messageJson: JSON.stringify(persistedMessage),
		persistedMessage
	};
}
function appendTranscriptMessageInTransaction(database, resolved, options, preparedMessage, projection) {
	const pending = resolveSessionPendingInputAppend(database, resolved, options.message);
	const storagePreparation = pending ? void 0 : preparedMessage;
	if (pending && readSessionEntryRow(database, resolved.sessionKey)?.entry.sessionId !== resolved.sessionId) throw new Error("Pending input session changed before transcript promotion");
	const serializeForStorage = (message) => storagePreparation?.persistedMessage ?? (options.messageAlreadyRedacted ? message : redactTranscriptMessageForStorage(message, options));
	const readAnchor = (params) => readActiveTranscriptEntryAnchorInTransaction({
		database,
		resolved,
		entryId: params.messageId,
		message: params.message
	});
	const existingAppendResult = (found) => {
		const anchor = readAnchor(found);
		if (pending) {
			if (found.messageId !== pending.inputId || !messagesMatchForIdempotentReplay(found.message, pending.message)) throw new TranscriptTurnAdmissionConflictError(pending.inputId);
			if (!anchor && !isTranscriptEntryOnActivePathInTransaction(database, resolved.sessionId, found.messageId)) throw new Error("Pending input is no longer active in its admitted transcript");
			consumeSessionPendingInput(database, pending);
		}
		return {
			appended: false,
			...anchor ? { anchor } : {},
			effectiveParentId: readTranscriptIdentityByEventId(database, resolved.sessionId, found.messageId)?.parentId ?? null,
			message: found.message,
			messageId: found.messageId
		};
	};
	const idempotencyKey = readMessageIdempotencyKey(options.message);
	if (idempotencyKey && options.idempotencyLookup !== "caller-checked") {
		const existing = readTranscriptMessageByScopedIdempotencyKey(database, resolved, idempotencyKey, options.idempotencyLookup);
		if (existing) {
			if (!options.prepareMessageAfterIdempotencyCheck && !messagesMatchForIdempotentReplay(existing.message, pending?.message ?? serializeForStorage(options.message))) throw new TranscriptTurnAdmissionConflictError(idempotencyKey);
			return existingAppendResult(existing);
		}
	}
	if (pending?.alreadyPromoted && !pending.stageRelocation) {
		const committed = readTranscriptMessageByEventId(database, resolved, pending.inputId);
		if (!committed) throw new Error("Pending input custody ended before transcript promotion");
		return existingAppendResult(committed);
	}
	const prepared = pending ? pending.message : options.prepareMessageAfterIdempotencyCheck ? options.prepareMessageAfterIdempotencyCheck(options.message) : options.message;
	if (prepared === void 0) return;
	const messageId = pending && !pending.alreadyPromoted ? pending.inputId : options.eventId ?? randomUUID();
	const now = options.now ?? Date.now();
	const finalMessage = pending ? prepared : serializeForStorage(prepared);
	if (!pending) options.beforeFreshMessageCommit?.();
	ensureTranscriptHeader(database, resolved, options.cwd, projection);
	const parentId = resolveTranscriptMessageAppendParent(database, resolved.sessionId, options);
	const event = {
		type: "message",
		id: messageId,
		parentId: parentId ?? null,
		...options.appendMode ? { appendMode: options.appendMode } : {},
		timestamp: resolveTimestampMsToIsoString(now),
		message: storagePreparation?.persistedMessage ?? finalMessage
	};
	let eventJson;
	if (storagePreparation) {
		const { message: _message, ...envelope } = event;
		eventJson = serializePreparedMessageEvent(envelope, storagePreparation.messageJson);
	}
	const appended = appendTranscriptEventInTransaction(database, resolved, event, {
		...projection,
		eventJson,
		preparedPayload: storagePreparation?.physicalPayload,
		idempotencyKeyMode: options.idempotencyLookup === "caller-checked" ? "relocate-owner" : options.idempotencyLookup === "scan-assistant" ? "preserve-owner" : "dedupe"
	});
	if (!appended) {
		const existing = (idempotencyKey && options.idempotencyLookup !== "caller-checked" ? readTranscriptMessageByScopedIdempotencyKey(database, resolved, idempotencyKey, options.idempotencyLookup) : void 0) ?? readTranscriptMessageByEventId(database, resolved, messageId);
		if (existing) {
			if (!options.prepareMessageAfterIdempotencyCheck && !messagesMatchForIdempotentReplay(existing.message, finalMessage)) throw new TranscriptTurnAdmissionConflictError(idempotencyKey ?? `event:${messageId}`);
			return existingAppendResult(existing);
		}
		throw new Error(`SQLite transcript append did not insert message ${messageId}.`);
	}
	const persistedMessage = storagePreparation?.persistedMessage ?? JSON.parse(appended).message;
	const anchor = readAnchor({
		message: persistedMessage,
		messageId
	});
	if (pending) {
		if (pending.stageRelocation) pending.stageRelocation(messageId);
		else consumeSessionPendingInput(database, pending);
	}
	return {
		appended: true,
		...anchor ? { anchor } : {},
		effectiveParentId: parentId ?? null,
		message: persistedMessage,
		messageId
	};
}
//#endregion
export { normalizeTranscriptJsonValue as i, prepareTranscriptMessageAppend as n, prepareTranscriptMessageAppendForWorker as r, appendTranscriptMessageInTransaction as t };
