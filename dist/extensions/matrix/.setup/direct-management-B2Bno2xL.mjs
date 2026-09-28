import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { t as isMatrixQualifiedUserId } from "./target-ids-Nwx7cMVE.mjs";
import { a as MATRIX_REACTION_EVENT_TYPE, i as MATRIX_ANNOTATION_RELATION_TYPE } from "./send-currentness-BrGXL7b8.mjs";
import { asOptionalRecord, normalizeNullableString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
//#region extensions/matrix/src/matrix/send/types.ts
const MsgType = {
	Text: "m.text",
	Image: "m.image",
	Audio: "m.audio",
	Video: "m.video",
	File: "m.file",
	Notice: "m.notice"
};
const RelationType = {
	Annotation: MATRIX_ANNOTATION_RELATION_TYPE,
	Replace: "m.replace",
	Thread: "m.thread"
};
const EventType = {
	Direct: "m.direct",
	Reaction: MATRIX_REACTION_EVENT_TYPE,
	RoomMessage: "m.room.message"
};
const MATRIX_OPENCLAW_FINALIZED_PREVIEW_KEY = "com.openclaw.finalized_preview";
/**
* MSC4357 live marker key.
* When present on event content, signals that the message is still being
* streamed (e.g. an LLM generating a response). Supporting clients render
* the message with a streaming animation until an edit without this marker
* arrives, indicating the stream is complete.
* @see https://github.com/matrix-org/matrix-spec-proposals/pull/4357
*/
const MSC4357_LIVE_KEY = "org.matrix.msc4357.live";
//#endregion
//#region extensions/matrix/src/matrix/relations.ts
function relatedReplyEventId(relation) {
	const reply = asOptionalRecord(relation?.["m.in_reply_to"]);
	return typeof reply?.event_id === "string" ? reply.event_id : void 0;
}
function buildMatrixMessageRelation(params) {
	const threadId = params.threadId?.trim();
	const replyToId = params.replyToId?.trim();
	const relatedId = replyToId || (threadId ? params.fallbackReplyToId?.trim() : void 0);
	const reply = relatedId ? { "m.in_reply_to": { event_id: relatedId } } : void 0;
	if (!threadId) return reply;
	return {
		rel_type: RelationType.Thread,
		event_id: threadId,
		...reply,
		...relatedId && !replyToId ? { is_falling_back: true } : {}
	};
}
function resolveMatrixReplyToEventId(content) {
	const relation = asOptionalRecord(content["m.relates_to"]);
	return relation?.rel_type === RelationType.Thread && relation.is_falling_back === true ? void 0 : relatedReplyEventId(relation);
}
function resolveMatrixThreadRootId(content) {
	const relation = asOptionalRecord(content["m.relates_to"]);
	if (relation?.rel_type !== RelationType.Thread) return;
	return typeof relation.event_id === "string" ? relation.event_id : relatedReplyEventId(relation);
}
//#endregion
//#region extensions/matrix/src/matrix/direct-room.ts
var direct_room_exports = /* @__PURE__ */ __exportAll({
	hasDirectMatrixMemberFlag: () => hasDirectMatrixMemberFlag,
	inspectMatrixDirectRoomEvidence: () => inspectMatrixDirectRoomEvidence,
	isStrictDirectMembership: () => isStrictDirectMembership,
	isStrictDirectRoom: () => isStrictDirectRoom,
	readJoinedMatrixMembers: () => readJoinedMatrixMembers
});
function normalizeJoinedMatrixMembers(joinedMembers) {
	if (!Array.isArray(joinedMembers)) return [];
	return joinedMembers.map((entry) => normalizeNullableString(entry)).filter((entry) => Boolean(entry));
}
function isStrictDirectMembership(params) {
	const selfUserId = normalizeNullableString(params.selfUserId);
	const remoteUserId = normalizeNullableString(params.remoteUserId);
	const joinedMembers = params.joinedMembers ?? [];
	return Boolean(selfUserId && remoteUserId && joinedMembers.length === 2 && joinedMembers.includes(selfUserId) && joinedMembers.includes(remoteUserId));
}
async function readJoinedMatrixMembers(client, roomId) {
	try {
		return normalizeJoinedMatrixMembers(await client.getJoinedRoomMembers(roomId));
	} catch {
		return null;
	}
}
async function hasDirectMatrixMemberFlag(client, roomId, userId) {
	const normalizedUserId = normalizeNullableString(userId);
	if (!normalizedUserId) return null;
	try {
		const state = await client.getRoomStateEvent(roomId, "m.room.member", normalizedUserId);
		if (state?.is_direct === true) return true;
		if (state?.is_direct === false) return false;
		return null;
	} catch {
		return null;
	}
}
async function inspectMatrixDirectRoomEvidence(params) {
	const selfUserId = params.selfUserId !== void 0 ? normalizeNullableString(params.selfUserId) : normalizeNullableString(await params.client.getUserId().catch(() => null));
	const joinedMembers = await readJoinedMatrixMembers(params.client, params.roomId);
	const strict = isStrictDirectMembership({
		selfUserId,
		remoteUserId: params.remoteUserId,
		joinedMembers
	});
	if (!strict) return {
		joinedMembers,
		strict: false,
		viaMemberState: false,
		memberStateFlag: null
	};
	const memberStateFlag = await hasDirectMatrixMemberFlag(params.client, params.roomId, selfUserId);
	return {
		joinedMembers,
		strict,
		viaMemberState: memberStateFlag === true,
		memberStateFlag
	};
}
async function isStrictDirectRoom(params) {
	return (await inspectMatrixDirectRoomEvidence({
		client: params.client,
		roomId: params.roomId,
		remoteUserId: params.remoteUserId,
		selfUserId: params.selfUserId
	})).strict;
}
//#endregion
//#region extensions/matrix/src/matrix/direct-management.ts
var direct_management_exports = /* @__PURE__ */ __exportAll({
	inspectMatrixDirectRooms: () => inspectMatrixDirectRooms,
	persistMatrixDirectRoomMapping: () => persistMatrixDirectRoomMapping,
	promoteMatrixDirectRoomCandidate: () => promoteMatrixDirectRoomCandidate,
	repairMatrixDirectRooms: () => repairMatrixDirectRooms
});
const DIRECT_ACCOUNT_DATA_QUEUE_KEY = EventType.Direct;
const directAccountDataWriteQueues = /* @__PURE__ */ new WeakMap();
async function readMatrixDirectAccountData(client) {
	try {
		const direct = await client.getAccountData(EventType.Direct);
		return direct && typeof direct === "object" && !Array.isArray(direct) ? direct : {};
	} catch {
		return {};
	}
}
function normalizeRemoteUserId(remoteUserId) {
	const normalized = normalizeOptionalString(remoteUserId) ?? "";
	if (!isMatrixQualifiedUserId(normalized)) throw new Error(`Matrix user IDs must be fully qualified (got "${remoteUserId}")`);
	return normalized;
}
function normalizeMappedRoomIds(direct, remoteUserId) {
	const current = direct[remoteUserId];
	if (!Array.isArray(current)) return [];
	const seen = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const value of current) {
		const roomId = normalizeOptionalString(value) ?? "";
		if (!roomId || seen.has(roomId)) continue;
		seen.add(roomId);
		normalized.push(roomId);
	}
	return normalized;
}
function normalizeRoomIdList(values) {
	const seen = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const value of values) {
		const roomId = value.trim();
		if (!roomId || seen.has(roomId)) continue;
		seen.add(roomId);
		normalized.push(roomId);
	}
	return normalized;
}
function hasMatrixDirectRoomMappings(params) {
	const current = normalizeMappedRoomIds(params.directContent, params.remoteUserId);
	const next = normalizeRoomIdList([...params.roomIds, ...current]);
	return current.length === next.length && current.every((roomId, index) => roomId === next[index]);
}
function resolveDirectAccountDataWriteQueue(client) {
	const existing = directAccountDataWriteQueues.get(client);
	if (existing) return existing;
	const created = new KeyedAsyncQueue();
	directAccountDataWriteQueues.set(client, created);
	return created;
}
async function writeMatrixDirectRoomMappings(params) {
	return await resolveDirectAccountDataWriteQueue(params.client).enqueue(DIRECT_ACCOUNT_DATA_QUEUE_KEY, async () => {
		const directContentBefore = await readMatrixDirectAccountData(params.client);
		const directContentAfter = buildNextDirectContent({
			directContent: directContentBefore,
			remoteUserId: params.remoteUserId,
			roomIds: params.roomIds
		});
		const changed = !hasMatrixDirectRoomMappings({
			directContent: directContentBefore,
			remoteUserId: params.remoteUserId,
			roomIds: params.roomIds
		});
		if (changed) await params.client.setAccountData(EventType.Direct, directContentAfter);
		return {
			changed,
			directContentBefore,
			directContentAfter
		};
	});
}
async function classifyDirectRoomCandidate(params) {
	const evidence = await inspectMatrixDirectRoomEvidence({
		client: params.client,
		roomId: params.roomId,
		remoteUserId: params.remoteUserId,
		selfUserId: params.selfUserId
	});
	return {
		roomId: params.roomId,
		joinedMembers: evidence.joinedMembers,
		strict: evidence.strict && (params.source === "account-data" || evidence.memberStateFlag !== false),
		explicit: evidence.strict && (params.source === "account-data" || evidence.memberStateFlag !== false) && (params.source === "account-data" || evidence.viaMemberState),
		source: params.source
	};
}
function buildNextDirectContent(params) {
	const current = normalizeMappedRoomIds(params.directContent, params.remoteUserId);
	const nextRooms = normalizeRoomIdList([...params.roomIds, ...current]);
	return {
		...params.directContent,
		[params.remoteUserId]: nextRooms
	};
}
async function persistMatrixDirectRoomMapping(params) {
	const remoteUserId = normalizeRemoteUserId(params.remoteUserId);
	return (await writeMatrixDirectRoomMappings({
		client: params.client,
		remoteUserId,
		roomIds: [params.roomId]
	})).changed;
}
async function promoteMatrixDirectRoomCandidate(params) {
	const remoteUserId = normalizeRemoteUserId(params.remoteUserId);
	const evidence = await inspectMatrixDirectRoomEvidence({
		client: params.client,
		roomId: params.roomId,
		remoteUserId,
		selfUserId: params.selfUserId
	});
	if (!evidence.strict) return {
		classifyAsDirect: false,
		repaired: false,
		reason: "not-strict"
	};
	if (evidence.memberStateFlag === false) return {
		classifyAsDirect: false,
		repaired: false,
		reason: "local-explicit-false"
	};
	try {
		const repaired = await persistMatrixDirectRoomMapping({
			client: params.client,
			remoteUserId,
			roomId: params.roomId
		});
		return {
			classifyAsDirect: true,
			repaired,
			roomId: params.roomId,
			reason: repaired ? "promoted" : "already-mapped"
		};
	} catch {
		return {
			classifyAsDirect: true,
			repaired: false,
			roomId: params.roomId,
			reason: "repair-failed"
		};
	}
}
async function inspectMatrixDirectRooms(params) {
	const remoteUserId = normalizeRemoteUserId(params.remoteUserId);
	const selfUserId = normalizeOptionalString(await params.client.getUserId().catch(() => null)) ?? null;
	const mappedRoomIds = normalizeMappedRoomIds(await readMatrixDirectAccountData(params.client), remoteUserId);
	const mappedRooms = await Promise.all(mappedRoomIds.map(async (roomId) => await classifyDirectRoomCandidate({
		client: params.client,
		roomId,
		remoteUserId,
		selfUserId,
		source: "account-data"
	})));
	const mappedStrict = mappedRooms.find((room) => room.strict);
	let joinedRooms = [];
	if (typeof params.client.getJoinedRooms === "function") try {
		const resolved = await params.client.getJoinedRooms();
		joinedRooms = Array.isArray(resolved) ? resolved : [];
	} catch {
		joinedRooms = [];
	}
	const discoveredStrictRooms = [];
	for (const roomId of normalizeRoomIdList(joinedRooms)) {
		if (mappedRoomIds.includes(roomId)) continue;
		const candidate = await classifyDirectRoomCandidate({
			client: params.client,
			roomId,
			remoteUserId,
			selfUserId,
			source: "joined"
		});
		if (candidate.strict) discoveredStrictRooms.push(candidate);
	}
	const discoveredStrictRoomIds = discoveredStrictRooms.map((room) => room.roomId);
	const discoveredExplicit = discoveredStrictRooms.find((room) => room.explicit);
	return {
		selfUserId,
		remoteUserId,
		mappedRoomIds,
		mappedRooms,
		discoveredStrictRoomIds,
		activeRoomId: mappedStrict?.roomId ?? discoveredExplicit?.roomId ?? discoveredStrictRoomIds[0] ?? null
	};
}
async function repairMatrixDirectRooms(params) {
	const remoteUserId = normalizeRemoteUserId(params.remoteUserId);
	const inspected = await inspectMatrixDirectRooms({
		client: params.client,
		remoteUserId
	});
	const activeRoomId = inspected.activeRoomId ?? await params.client.createDirectRoom(remoteUserId, { encrypted: params.encrypted === true });
	const createdRoomId = inspected.activeRoomId ? null : activeRoomId;
	const mappingWrite = await writeMatrixDirectRoomMappings({
		client: params.client,
		remoteUserId,
		roomIds: [activeRoomId, ...inspected.discoveredStrictRoomIds]
	});
	return {
		...inspected,
		activeRoomId,
		createdRoomId,
		changed: mappingWrite.changed,
		directContentBefore: mappingWrite.directContentBefore,
		directContentAfter: mappingWrite.directContentAfter
	};
}
//#endregion
export { MsgType as _, repairMatrixDirectRooms as a, isStrictDirectMembership as c, buildMatrixMessageRelation as d, resolveMatrixReplyToEventId as f, MSC4357_LIVE_KEY as g, MATRIX_OPENCLAW_FINALIZED_PREVIEW_KEY as h, promoteMatrixDirectRoomCandidate as i, isStrictDirectRoom as l, EventType as m, inspectMatrixDirectRooms as n, direct_room_exports as o, resolveMatrixThreadRootId as p, persistMatrixDirectRoomMapping as r, hasDirectMatrixMemberFlag as s, direct_management_exports as t, readJoinedMatrixMembers as u, RelationType as v };
