import { a as MATRIX_REACTION_EVENT_TYPE } from "./send-currentness-BrGXL7b8.mjs";
import { C as resolvePollReferenceEventId, S as parsePollStartContent, _ as formatPollAsText, b as isPollStartType, f as resolveMatrixMessageAttachment, g as buildPollResultsSummary, p as resolveMatrixReplacementContent, r as sendMessageMatrix, t as editMessageMatrix, v as formatPollResultsAsText, y as isPollEventType } from "./send-aVdC5NJO.mjs";
import { r as withResolvedRoomAction } from "./client-C2yVkVdw.mjs";
import { n as isMatrixNotFoundError } from "./errors-DKVS3_DO.mjs";
import { asNullableObjectRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/matrix/src/matrix/poll-summary.ts
function resolveMatrixPollRootEventId(event) {
	if (isPollStartType(event.type)) {
		const eventId = event.event_id?.trim();
		return eventId ? eventId : null;
	}
	return resolvePollReferenceEventId(event.content);
}
async function readAllPollRelations(client, roomId, pollEventId) {
	const relationEvents = [];
	const seenCursors = /* @__PURE__ */ new Set();
	let nextBatch;
	do {
		const page = await client.getRelations(roomId, pollEventId, "m.reference", void 0, { from: nextBatch });
		relationEvents.push(...page.events);
		nextBatch = page.nextBatch ?? void 0;
		if (nextBatch && seenCursors.has(nextBatch)) throw new Error("Matrix poll pagination returned a repeated cursor");
		if (nextBatch) seenCursors.add(nextBatch);
	} while (nextBatch);
	return relationEvents;
}
async function fetchMatrixPollSnapshot(client, roomId, event) {
	if (!isPollEventType(event.type)) return null;
	const pollEventId = resolveMatrixPollRootEventId(event);
	if (!pollEventId) return null;
	const rootEvent = isPollStartType(event.type) ? event : await client.getEvent(roomId, pollEventId);
	if (!isPollStartType(rootEvent.type)) return null;
	const pollStartContent = rootEvent.content;
	const pollSummary = parsePollStartContent(pollStartContent);
	if (!pollSummary) return null;
	const relationEvents = await readAllPollRelations(client, roomId, pollEventId);
	const pollResults = buildPollResultsSummary({
		pollEventId,
		roomId,
		sender: rootEvent.sender,
		senderName: rootEvent.sender,
		content: pollStartContent,
		relationEvents
	});
	return {
		pollEventId,
		triggerEvent: event,
		rootEvent,
		text: pollResults ? formatPollResultsAsText(pollResults) : formatPollAsText(pollSummary)
	};
}
async function fetchMatrixPollMessageSummary(client, roomId, event) {
	const snapshot = await fetchMatrixPollSnapshot(client, roomId, event);
	if (!snapshot) return null;
	return {
		eventId: snapshot.pollEventId,
		sender: snapshot.rootEvent.sender,
		body: snapshot.text,
		msgtype: "m.text",
		timestamp: snapshot.triggerEvent.origin_server_ts || snapshot.rootEvent.origin_server_ts
	};
}
//#endregion
//#region extensions/matrix/src/matrix/actions/limits.ts
function resolveMatrixActionLimit(raw, fallback) {
	return Math.max(1, Math.floor(raw !== void 0 && Number.isFinite(raw) ? raw : fallback));
}
//#endregion
//#region extensions/matrix/src/matrix/actions/types.ts
const EventType = {
	RoomMessage: "m.room.message",
	RoomPinnedEvents: "m.room.pinned_events",
	RoomTopic: "m.room.topic",
	Reaction: MATRIX_REACTION_EVENT_TYPE
};
//#endregion
//#region extensions/matrix/src/matrix/actions/summary.ts
function parseMatrixRawEvent(value) {
	const event = asNullableObjectRecord(value);
	const content = asNullableObjectRecord(event?.content);
	if (!event || typeof event.event_id !== "string" || typeof event.sender !== "string" || typeof event.type !== "string" || typeof event.origin_server_ts !== "number" || !content) return null;
	const unsigned = asNullableObjectRecord(event.unsigned);
	const relations = asNullableObjectRecord(unsigned?.["m.relations"]);
	return {
		event_id: event.event_id,
		sender: event.sender,
		type: event.type,
		origin_server_ts: event.origin_server_ts,
		content,
		...unsigned ? { unsigned: {
			...typeof unsigned.age === "number" ? { age: unsigned.age } : {},
			...relations ? { "m.relations": relations } : {},
			...unsigned.redacted_because !== void 0 ? { redacted_because: unsigned.redacted_because } : {}
		} } : {},
		...typeof event.state_key === "string" ? { state_key: event.state_key } : {}
	};
}
function summarizeMatrixRawEvent(event) {
	const content = event.content;
	const relates = content["m.relates_to"];
	const displayContent = relates?.rel_type === "m.replace" ? content["m.new_content"] ?? content : resolveMatrixReplacementContent(event) ?? content;
	let relType;
	let eventId;
	if (relates) {
		if ("rel_type" in relates) {
			relType = relates.rel_type;
			eventId = relates.event_id;
		} else if ("m.in_reply_to" in relates) eventId = relates["m.in_reply_to"]?.event_id;
	}
	const relatesTo = relType || eventId ? {
		relType,
		eventId
	} : void 0;
	const attachment = resolveMatrixMessageAttachment({
		body: displayContent.body,
		filename: displayContent.filename,
		msgtype: displayContent.msgtype
	});
	return {
		eventId: event.event_id,
		sender: event.sender,
		body: attachment ? attachment.caption : displayContent.body?.trim() || void 0,
		msgtype: displayContent.msgtype,
		attachment,
		timestamp: event.origin_server_ts,
		relatesTo
	};
}
async function readPinnedEvents(client, roomId) {
	try {
		return (await client.getRoomStateEvent(roomId, EventType.RoomPinnedEvents, "")).pinned.filter((id) => id.trim().length > 0);
	} catch (err) {
		if (isMatrixNotFoundError(err)) return [];
		throw err;
	}
}
async function fetchEventSummary(client, roomId, eventId) {
	try {
		const raw = parseMatrixRawEvent(await client.getEvent(roomId, eventId));
		if (!raw) return null;
		if (raw.unsigned?.redacted_because) return null;
		const pollSummary = await fetchMatrixPollMessageSummary(client, roomId, raw);
		if (pollSummary) return pollSummary;
		return summarizeMatrixRawEvent(raw);
	} catch {
		return null;
	}
}
//#endregion
//#region extensions/matrix/src/matrix/actions/messages.ts
const MATRIX_THREAD_RELATIONS_START_CURSOR_PREFIX = "openclaw.matrix.thread-relations-start:";
function resolveMatrixReplacementTarget(event) {
	const relation = event.content["m.relates_to"];
	if (!relation || typeof relation !== "object") return;
	const replacement = relation;
	return replacement.rel_type === "m.replace" && typeof replacement.event_id === "string" ? replacement.event_id : void 0;
}
function resolveLatestMatrixReplacements(events) {
	const pageEventIds = new Set(events.map((event) => event.event_id));
	const originals = new Map(events.filter((event) => event.type === EventType.RoomMessage && !event.unsigned?.redacted_because && event.state_key === void 0 && !resolveMatrixReplacementTarget(event)).map((event) => [event.event_id, event]));
	const replacements = /* @__PURE__ */ new Map();
	for (const event of events) {
		const targetId = resolveMatrixReplacementTarget(event);
		const original = targetId ? originals.get(targetId) : void 0;
		if (!targetId || !original || !resolveMatrixReplacementContent(original, event)) continue;
		const latest = replacements.get(targetId);
		if (!latest || event.origin_server_ts > latest.origin_server_ts || event.origin_server_ts === latest.origin_server_ts && event.event_id > latest.event_id) replacements.set(targetId, event);
	}
	return {
		pageEventIds,
		replacements
	};
}
async function sendMatrixMessage(to, content, opts = {}) {
	if (!opts.cfg) throw new Error("Matrix message actions require a resolved runtime config.");
	return await sendMessageMatrix(to, content, {
		cfg: opts.cfg,
		mediaUrl: opts.mediaUrl,
		...opts.mediaAccess ? { mediaAccess: opts.mediaAccess } : {},
		mediaLocalRoots: opts.mediaLocalRoots,
		replyToId: opts.replyToId,
		threadId: opts.threadId,
		audioAsVoice: opts.audioAsVoice,
		accountId: opts.accountId ?? void 0,
		client: opts.client,
		timeoutMs: opts.timeoutMs
	});
}
async function editMatrixMessage(roomId, messageId, content, opts = {}) {
	if (!opts.cfg) throw new Error("Matrix message actions require a resolved runtime config.");
	if (!content.trim()) throw new Error("Matrix edit requires content");
	return { eventId: await editMessageMatrix(roomId, messageId, content.trimEnd(), {
		cfg: opts.cfg,
		accountId: opts.accountId ?? void 0,
		client: opts.client,
		timeoutMs: opts.timeoutMs
	}) || null };
}
async function deleteMatrixMessage(roomId, messageId, opts = {}) {
	await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		await client.redactEvent(resolvedRoom, messageId, opts.reason);
	});
}
async function readMatrixMessage(roomId, eventId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		const message = await fetchEventSummary(client, resolvedRoom, eventId);
		if (!message) throw new Error(`Matrix message ${eventId} was not found in room ${resolvedRoom}.`);
		return message;
	});
}
async function readMatrixMessages(roomId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		const limit = resolveMatrixActionLimit(opts.limit, 20);
		const rawBefore = normalizeOptionalString(opts.before);
		const rawAfter = normalizeOptionalString(opts.after);
		const dir = opts.after ? "f" : "b";
		const threadId = normalizeOptionalString(opts.threadId);
		const isThreadRelationsStartCursor = threadId ? isMatrixThreadRelationsStartCursor(rawBefore, threadId) : false;
		const token = isThreadRelationsStartCursor ? void 0 : rawBefore ?? rawAfter;
		const threadRootSummary = threadId !== void 0 && !token && !isThreadRelationsStartCursor && threadId ? await fetchDisplayableThreadRootSummary(client, resolvedRoom, threadId) : void 0;
		const rootCountsTowardLimit = threadRootSummary !== void 0;
		const rootFillsThreadPage = rootCountsTowardLimit && limit === 1;
		const relationLimit = rootCountsTowardLimit ? Math.max(limit - 1, 1) : limit;
		const seenPollRoots = /* @__PURE__ */ new Set();
		const threadRootEventId = normalizeOptionalString(threadRootSummary?.eventId);
		if (threadRootEventId) seenPollRoots.add(threadRootEventId);
		const relationPage = threadId && relationLimit > 0 ? await client.getRelations(resolvedRoom, threadId, "m.thread", void 0, {
			dir,
			from: token,
			limit: relationLimit
		}) : null;
		const flatPage = threadId ? null : await client.doRequest("GET", `/_matrix/client/v3/rooms/${encodeURIComponent(resolvedRoom)}/messages`, {
			dir,
			limit,
			from: token
		});
		const hydratedChunk = await client.hydrateEvents(resolvedRoom, relationPage ? rootFillsThreadPage ? [] : relationPage.events : flatPage?.chunk ?? []);
		const { pageEventIds, replacements } = resolveLatestMatrixReplacements(hydratedChunk);
		const messages = [];
		if (threadRootSummary) messages.push(threadRootSummary);
		for (const event of hydratedChunk) {
			if (event.unsigned?.redacted_because) continue;
			if (!threadId && isMatrixThreadEvent(event)) continue;
			if (event.type === EventType.RoomMessage) {
				if (threadId && event.event_id === threadId) continue;
				const replacementTarget = resolveMatrixReplacementTarget(event);
				if (replacementTarget) {
					const newContent = event.content["m.new_content"];
					if (pageEventIds.has(replacementTarget) || !newContent || typeof newContent !== "object" || Array.isArray(newContent)) continue;
					messages.push(summarizeMatrixRawEvent(event));
					continue;
				}
				const replacement = replacements.get(event.event_id);
				const originalRelation = event.content["m.relates_to"];
				messages.push(summarizeMatrixRawEvent(replacement ? {
					...event,
					content: {
						...replacement.content["m.new_content"],
						"m.relates_to": originalRelation
					}
				} : event));
				continue;
			}
			if (!isPollEventType(event.type)) continue;
			const pollRootId = resolveMatrixPollRootEventId(event);
			if (!pollRootId || seenPollRoots.has(pollRootId)) continue;
			if (!threadId && await isMatrixPollRootThreaded({
				client,
				event,
				pollRootId,
				resolvedRoom
			})) continue;
			seenPollRoots.add(pollRootId);
			const pollSummary = await fetchMatrixPollMessageSummary(client, resolvedRoom, event);
			if (pollSummary) messages.push(pollSummary);
		}
		return {
			messages,
			nextBatch: rootFillsThreadPage && threadId && relationPage?.events.length ? encodeMatrixThreadRelationsStartCursor(threadId) : relationPage?.nextBatch ?? flatPage?.end ?? null,
			prevBatch: relationPage?.prevBatch ?? flatPage?.start ?? null
		};
	});
}
function encodeMatrixThreadRelationsStartCursor(threadId) {
	const payload = Buffer.from(JSON.stringify({
		v: 1,
		threadId
	}), "utf8").toString("base64url");
	return `${MATRIX_THREAD_RELATIONS_START_CURSOR_PREFIX}${payload}`;
}
function isMatrixThreadRelationsStartCursor(raw, threadId) {
	if (!raw?.startsWith(MATRIX_THREAD_RELATIONS_START_CURSOR_PREFIX)) return false;
	const encoded = raw.slice(39);
	try {
		const bytes = Buffer.from(encoded, "base64url");
		if (bytes.toString("base64url") !== encoded) return false;
		const decoded = JSON.parse(bytes.toString("utf8"));
		return decoded.v === 1 && decoded.threadId === threadId && encodeMatrixThreadRelationsStartCursor(decoded.threadId) === raw;
	} catch {
		return false;
	}
}
async function fetchDisplayableThreadRootSummary(client, resolvedRoom, threadId) {
	const rawRootEvent = await client.getEvent(resolvedRoom, threadId).catch(() => null);
	if (!rawRootEvent) return;
	const rootEvent = (await client.hydrateEvents(resolvedRoom, [rawRootEvent]))[0];
	if (!rootEvent || rootEvent.unsigned?.redacted_because) return;
	if (rootEvent.type === EventType.RoomMessage) return summarizeMatrixRawEvent(rootEvent);
	if (isPollStartType(rootEvent.type)) return await fetchMatrixPollMessageSummary(client, resolvedRoom, rootEvent) ?? void 0;
}
function isMatrixThreadEvent(event) {
	const relates = event.content?.["m.relates_to"];
	if (!relates || typeof relates !== "object") return false;
	return relates.rel_type === "m.thread";
}
async function isMatrixPollRootThreaded(params) {
	if (isMatrixThreadEvent(params.event)) return true;
	const rootEvent = await params.client.getEvent(params.resolvedRoom, params.pollRootId).catch(() => null);
	if (!rootEvent) return false;
	const hydratedRoot = (await params.client.hydrateEvents(params.resolvedRoom, [rootEvent]))[0];
	return hydratedRoot ? isMatrixThreadEvent(hydratedRoot) : false;
}
//#endregion
export { sendMatrixMessage as a, EventType as c, readMatrixMessages as i, resolveMatrixActionLimit as l, editMatrixMessage as n, fetchEventSummary as o, readMatrixMessage as r, readPinnedEvents as s, deleteMatrixMessage as t, fetchMatrixPollSnapshot as u };
