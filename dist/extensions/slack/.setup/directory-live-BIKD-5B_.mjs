import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { s as resolveSlackAccount } from "./accounts-msihSF3-.mjs";
import { c as collectSlackCursorPages, l as fetchSlackChannelListPage, u as createSlackLookupClient } from "./probe-IiHogLQN.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/slack/src/directory-live.ts
var directory_live_exports = /* @__PURE__ */ __exportAll({
	getSlackDirectorySelfLive: () => getSlackDirectorySelfLive,
	listSlackDirectoryGroupsLive: () => listSlackDirectoryGroupsLive,
	listSlackDirectoryPeersLive: () => listSlackDirectoryPeersLive
});
function createSlackDirectoryClient(params) {
	const account = resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const token = account.userToken ?? account.botToken?.trim();
	return token ? createSlackLookupClient(token) : null;
}
function buildUserRank(user) {
	return (user.deleted ? 0 : 2) + (user.is_bot || user.is_app_user ? 0 : 1);
}
function slackUserToDirectoryEntry(user, fallback) {
	const id = normalizeOptionalString(user.id) ?? normalizeOptionalString(fallback?.id);
	if (!id) return null;
	const handle = normalizeOptionalString(user.name) ?? normalizeOptionalString(fallback?.name);
	const display = normalizeOptionalString(user.profile?.display_name) || normalizeOptionalString(user.profile?.real_name) || normalizeOptionalString(user.real_name) || handle;
	return {
		kind: "user",
		id: `user:${id}`,
		name: display || void 0,
		handle: handle ? `@${handle}` : void 0,
		rank: buildUserRank(user),
		raw: user
	};
}
async function getSlackDirectorySelfLive(params) {
	const client = createSlackDirectoryClient(params);
	if (!client) return null;
	const auth = await client.auth.test();
	const userId = normalizeOptionalString(auth.user_id);
	if (!userId) return null;
	try {
		return slackUserToDirectoryEntry((await client.users.info({ user: userId })).user ?? {}, {
			id: userId,
			name: auth.user
		});
	} catch {
		return slackUserToDirectoryEntry({
			id: userId,
			name: auth.user
		});
	}
}
function createSlackDirectoryLister(options) {
	return async (params) => {
		const client = createSlackDirectoryClient(params);
		if (!client) return [];
		const query = normalizeLowercaseStringOrEmpty(params.query);
		const rows = (await options.fetchRows(client)).filter((row) => {
			const candidates = options.searchValues(row).map(normalizeOptionalLowercaseString).filter(Boolean);
			return !query || candidates.some((candidate) => candidate?.includes(query));
		}).map(options.toEntry).filter((entry) => entry !== null);
		return typeof params.limit === "number" && params.limit > 0 ? rows.slice(0, params.limit) : rows;
	};
}
const listSlackDirectoryPeersLive = createSlackDirectoryLister({
	fetchRows: (client) => collectSlackCursorPages({
		fetchPage: (cursor) => client.users.list({
			limit: 200,
			cursor
		}),
		collectPageItems: (res) => Array.isArray(res.members) ? res.members : []
	}),
	searchValues: (member) => [
		member.profile?.display_name || member.profile?.real_name || member.real_name,
		member.name,
		member.profile?.email
	],
	toEntry: (member) => slackUserToDirectoryEntry(member)
});
const listSlackDirectoryGroupsLive = createSlackDirectoryLister({
	fetchRows: (client) => collectSlackCursorPages({
		fetchPage: (cursor) => fetchSlackChannelListPage(client, cursor),
		collectPageItems: (res) => Array.isArray(res.channels) ? res.channels : []
	}),
	searchValues: (channel) => [channel.name],
	toEntry: (channel) => {
		const id = channel.id?.trim();
		const name = channel.name?.trim();
		return id && name ? {
			kind: "group",
			id: `channel:${id}`,
			name,
			handle: `#${name}`,
			rank: channel.is_archived ? 0 : 1,
			raw: channel
		} : null;
	}
});
//#endregion
export { listSlackDirectoryGroupsLive as n, listSlackDirectoryPeersLive as r, directory_live_exports as t };
