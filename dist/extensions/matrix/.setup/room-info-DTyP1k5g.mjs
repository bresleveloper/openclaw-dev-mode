import { E as resolveMatrixRoomId } from "./send-aVdC5NJO.mjs";
import { c as EventType } from "./messages-COuAcrz-.mjs";
import { n as withResolvedActionClient, r as withResolvedRoomAction } from "./client-C2yVkVdw.mjs";
import { n as isMatrixNotFoundError } from "./errors-DKVS3_DO.mjs";
import { filterStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/matrix/src/matrix/monitor/bounded-cache.ts
function setBoundedMap(map, key, value, maxEntries) {
	map.set(key, value);
	if (map.size <= maxEntries) return;
	const oldest = map.keys().next();
	if (!oldest.done) map.delete(oldest.value);
}
//#endregion
//#region extensions/matrix/src/matrix/actions/room.ts
async function getMatrixMemberInfo(userId, opts) {
	return await withResolvedActionClient(opts, async (client) => {
		const roomId = await resolveMatrixRoomId(client, opts.roomId);
		if (!(await client.getJoinedRoomMembers(roomId)).includes(userId)) throw new Error(`User ${userId} is not a member of room ${roomId}`);
		const profile = await client.getUserProfile(userId);
		return {
			userId,
			profile: {
				displayName: profile?.displayname ?? null,
				avatarUrl: profile?.avatar_url ?? null
			},
			membership: null,
			powerLevel: null,
			displayName: profile?.displayname ?? null,
			roomId
		};
	});
}
async function getMatrixRoomInfo(roomId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		let name = null;
		let topic = null;
		let canonicalAlias = null;
		let altAliases = [];
		let memberCount = null;
		try {
			const nameState = await client.getRoomStateEvent(resolvedRoom, "m.room.name", "");
			name = typeof nameState?.name === "string" ? nameState.name : null;
		} catch {}
		try {
			const topicState = await client.getRoomStateEvent(resolvedRoom, EventType.RoomTopic, "");
			topic = typeof topicState?.topic === "string" ? topicState.topic : null;
		} catch {}
		try {
			const aliasState = await client.getRoomStateEvent(resolvedRoom, "m.room.canonical_alias", "");
			canonicalAlias = typeof aliasState?.alias === "string" ? aliasState.alias : null;
			altAliases = filterStringEntries(aliasState?.alt_aliases);
		} catch {}
		try {
			memberCount = (await client.getJoinedRoomMembers(resolvedRoom)).length;
		} catch {}
		return {
			roomId: resolvedRoom,
			name,
			topic,
			canonicalAlias,
			altAliases,
			memberCount
		};
	});
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/room-info.ts
const MAX_ROOM_INFO = 1024;
const MAX_MEMBER_DISPLAY_NAMES = 4096;
function createMatrixRoomInfoResolver(client) {
	const roomNameCache = /* @__PURE__ */ new Map();
	const roomAliasCache = /* @__PURE__ */ new Map();
	const memberDisplayNameCache = /* @__PURE__ */ new Map();
	const getRoomName = async (roomId) => {
		if (roomNameCache.has(roomId)) return roomNameCache.get(roomId) ?? { nameResolved: false };
		let name;
		let nameResolved = false;
		try {
			const nameState = await client.getRoomStateEvent(roomId, "m.room.name", "");
			nameResolved = true;
			if (nameState && typeof nameState.name === "string") name = nameState.name;
		} catch (err) {
			if (isMatrixNotFoundError(err)) nameResolved = true;
		}
		const info = {
			name,
			nameResolved
		};
		if (nameResolved) setBoundedMap(roomNameCache, roomId, info, MAX_ROOM_INFO);
		return info;
	};
	const getRoomAliases = async (roomId) => {
		const cached = roomAliasCache.get(roomId);
		if (cached) return cached;
		let canonicalAlias;
		let altAliases = [];
		let aliasesResolved = false;
		try {
			const aliasState = await client.getRoomStateEvent(roomId, "m.room.canonical_alias", "");
			aliasesResolved = true;
			if (aliasState && typeof aliasState.alias === "string") canonicalAlias = aliasState.alias;
			const rawAliases = aliasState?.alt_aliases;
			if (Array.isArray(rawAliases)) altAliases = rawAliases.filter((entry) => typeof entry === "string");
		} catch (err) {
			if (isMatrixNotFoundError(err)) aliasesResolved = true;
		}
		const info = {
			canonicalAlias,
			altAliases,
			aliasesResolved
		};
		if (aliasesResolved) setBoundedMap(roomAliasCache, roomId, info, MAX_ROOM_INFO);
		return info;
	};
	const getRoomInfo = async (roomId, opts = {}) => {
		const { name, nameResolved } = await getRoomName(roomId);
		if (!opts.includeAliases) return {
			name,
			altAliases: [],
			nameResolved,
			aliasesResolved: false
		};
		return {
			name,
			nameResolved,
			...await getRoomAliases(roomId)
		};
	};
	const getMemberDisplayName = async (roomId, userId) => {
		const cacheKey = `${roomId}:${userId}`;
		if (memberDisplayNameCache.has(cacheKey)) return memberDisplayNameCache.get(cacheKey) ?? userId;
		let memberState;
		try {
			memberState = await client.getRoomStateEvent(roomId, "m.room.member", userId);
		} catch {
			return userId;
		}
		const displayName = memberState && typeof memberState.displayname === "string" ? memberState.displayname : userId;
		setBoundedMap(memberDisplayNameCache, cacheKey, displayName, MAX_MEMBER_DISPLAY_NAMES);
		return displayName;
	};
	const invalidateMemberDisplayName = (roomId, userId) => {
		memberDisplayNameCache.delete(`${roomId}:${userId}`);
	};
	return {
		getRoomAliases,
		getRoomInfo,
		getMemberDisplayName,
		invalidateMemberDisplayName
	};
}
//#endregion
export { setBoundedMap as i, getMatrixMemberInfo as n, getMatrixRoomInfo as r, createMatrixRoomInfoResolver as t };
