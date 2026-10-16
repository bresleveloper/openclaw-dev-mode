import { w as setBoundedMap } from "./send-B1Y2L4wj.mjs";
import { c as EventType } from "./messages-uCbwLRKS.mjs";
import { r as withResolvedRoomAction } from "./client-DY3HExqI.mjs";
import { n as isMatrixNotFoundError } from "./errors-DKVS3_DO.mjs";
import { filterStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/matrix/src/matrix/actions/room.ts
async function getMatrixMemberInfo(userId, opts) {
	return await withResolvedRoomAction(opts.roomId, opts, async (client, roomId) => {
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
		const name = await client.getRoomStateEvent(resolvedRoom, "m.room.name", "").then((state) => typeof state?.name === "string" ? state.name : null).catch(() => null);
		const topic = await client.getRoomStateEvent(resolvedRoom, EventType.RoomTopic, "").then((state) => typeof state?.topic === "string" ? state.topic : null).catch(() => null);
		const aliases = await client.getRoomStateEvent(resolvedRoom, "m.room.canonical_alias", "").then((state) => ({
			canonicalAlias: typeof state?.alias === "string" ? state.alias : null,
			altAliases: filterStringEntries(state?.alt_aliases)
		})).catch(() => ({
			canonicalAlias: null,
			altAliases: []
		}));
		const memberCount = await client.getJoinedRoomMembers(resolvedRoom).then((members) => members.length).catch(() => null);
		return {
			roomId: resolvedRoom,
			name,
			topic,
			...aliases,
			memberCount
		};
	});
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/room-info.ts
const MAX_ROOM_INFO = 1024;
const MAX_MEMBER_DISPLAY_NAMES = 4096;
function createMatrixRoomInfoResolver(client) {
	const memberDisplayNameCache = /* @__PURE__ */ new Map();
	function createRoomStateResolver(eventType, project) {
		const cache = /* @__PURE__ */ new Map();
		return async (roomId) => {
			const cached = cache.get(roomId);
			if (cached) return cached;
			let state;
			let resolved;
			try {
				state = await client.getRoomStateEvent(roomId, eventType, "");
				resolved = true;
			} catch (err) {
				resolved = isMatrixNotFoundError(err);
			}
			const info = {
				value: project(state),
				resolved
			};
			if (resolved) setBoundedMap(cache, roomId, info, MAX_ROOM_INFO);
			return info;
		};
	}
	const getRoomName = createRoomStateResolver("m.room.name", (state) => typeof state?.name === "string" ? state.name : void 0);
	const getRoomAliases = createRoomStateResolver("m.room.canonical_alias", (state) => ({
		canonicalAlias: typeof state?.alias === "string" ? state.alias : void 0,
		altAliases: Array.isArray(state?.alt_aliases) ? state.alt_aliases.filter((entry) => typeof entry === "string") : []
	}));
	const getRoomInfo = async (roomId, opts = {}) => {
		const { value: name, resolved: nameResolved } = await getRoomName(roomId);
		if (!opts.includeAliases) return {
			name,
			altAliases: [],
			nameResolved,
			aliasesResolved: false
		};
		const { value: aliases, resolved: aliasesResolved } = await getRoomAliases(roomId);
		return {
			name,
			nameResolved,
			...aliases,
			aliasesResolved
		};
	};
	const getMemberDisplayName = async (roomId, userId) => {
		const cacheKey = `${roomId}:${userId}`;
		const cached = memberDisplayNameCache.get(cacheKey);
		if (cached !== void 0) return cached;
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
		getRoomInfo,
		getMemberDisplayName,
		invalidateMemberDisplayName
	};
}
//#endregion
export { getMatrixMemberInfo as n, getMatrixRoomInfo as r, createMatrixRoomInfoResolver as t };
