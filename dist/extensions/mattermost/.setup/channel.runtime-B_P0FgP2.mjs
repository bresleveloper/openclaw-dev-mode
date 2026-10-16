import { _ as readMattermostError, h as normalizeMattermostBaseUrl, l as fetchMattermostChannelPosts, r as createMattermostClient, s as fetchMattermostChannel, u as fetchMattermostMe } from "./client-f2qstbX3.mjs";
import { o as resolveMattermostTrustedChatKind } from "./monitor-auth-aZ0b1gqx.mjs";
import { c as listMattermostAccountIds, n as normalizeMattermostMessagingTarget, o as inspectMattermostAccount, u as resolveMattermostAccount } from "./normalize-DhF6_2lt.mjs";
import { n as resolveMattermostOpaqueTarget, t as sendMessageMattermost } from "./send-BI4525Fd.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { runChannelProbe } from "openclaw/plugin-sdk/text-utility-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { asDateTimestampMs, resolveExpiresAtMsFromDurationMs, resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { fetchWithSsrFGuard, ssrfPolicyFromPrivateNetworkOptIn } from "openclaw/plugin-sdk/ssrf-runtime";
import { resolveAllowlistProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
//#region extensions/mattermost/src/mattermost/directory.ts
/** Build the requested account client, or aggregate accounts for an explicitly unscoped lookup. */
function buildClients(params) {
	const requestedAccountId = params.accountId?.trim();
	const accountIds = requestedAccountId ? [requestedAccountId] : listMattermostAccountIds(params.cfg);
	const seen = /* @__PURE__ */ new Set();
	const clients = [];
	for (const id of accountIds) {
		const account = inspectMattermostAccount({
			cfg: params.cfg,
			accountId: id
		});
		if (!account.enabled || !account.botToken || !account.baseUrl) continue;
		const client = createMattermostClient({
			baseUrl: account.baseUrl,
			botToken: account.botToken,
			allowPrivateNetwork: account.config.network?.dangerouslyAllowPrivateNetwork === true
		});
		if (!seen.has(client.token)) {
			seen.add(client.token);
			clients.push(client);
		}
	}
	return clients;
}
/**
* List channels (public + private) visible to any configured bot account.
*
* NOTE: Uses per_page=200 which covers most instances. Mattermost does not
* return a "has more" indicator, so very large instances (200+ channels per bot)
* may see incomplete results. Pagination can be added if needed.
*/
async function listMattermostDirectoryGroups(params) {
	const clients = buildClients(params);
	if (!clients.length) return [];
	const q = normalizeLowercaseStringOrEmpty(params.query);
	const seenIds = /* @__PURE__ */ new Set();
	const entries = [];
	for (const client of clients) try {
		const me = await fetchMattermostMe(client);
		const channels = await client.request(`/users/${me.id}/channels?per_page=200`);
		for (const ch of channels) {
			if (ch.type !== "O" && ch.type !== "P") continue;
			if (seenIds.has(ch.id)) continue;
			if (q) {
				const name = normalizeLowercaseStringOrEmpty(ch.name);
				const display = normalizeLowercaseStringOrEmpty(ch.display_name);
				if (!name.includes(q) && !display.includes(q)) continue;
			}
			seenIds.add(ch.id);
			entries.push({
				kind: resolveMattermostTrustedChatKind({ channelType: ch.type }) === "group" ? "group" : "channel",
				id: `channel:${ch.id}`,
				name: ch.name ?? void 0,
				handle: ch.display_name ?? void 0
			});
		}
	} catch (err) {
		console.debug?.("[mattermost-directory] listGroups: skipping account:", err?.message);
		continue;
	}
	return params.limit && params.limit > 0 ? entries.slice(0, params.limit) : entries;
}
/**
* List team members as peer directory entries.
*
* Uses only the first available client since all bots in a team see the same
* user list (unlike channels where membership varies). Uses the first team
* returned — multi-team setups will only see members from that team.
*
* Uses paginated member listing with per_page=200, the Mattermost API maximum.
*/
async function listMattermostDirectoryPeers(params) {
	const client = buildClients(params)[0];
	if (!client) return [];
	try {
		const me = await fetchMattermostMe(client);
		const team = (await client.request("/users/me/teams"))[0];
		if (!team) return [];
		const teamId = team.id;
		const q = normalizeLowercaseStringOrEmpty(params.query);
		let users;
		if (q) users = await client.request("/users/search", {
			method: "POST",
			body: JSON.stringify({
				term: q,
				team_id: teamId
			})
		});
		else {
			const pageSize = 200;
			const userIds = [];
			for (let page = 0;; page += 1) {
				const pageMembers = await client.request(`/teams/${teamId}/members?page=${page}&per_page=${pageSize}`);
				for (const member of pageMembers) if (member.user_id !== me.id) userIds.push(member.user_id);
				if (pageMembers.length < pageSize) break;
			}
			if (!userIds.length) return [];
			users = [];
			for (let index = 0; index < userIds.length; index += pageSize) {
				const userIdBatch = userIds.slice(index, index + pageSize);
				users.push(...await client.request("/users/ids", {
					method: "POST",
					body: JSON.stringify(userIdBatch)
				}));
			}
		}
		const entries = users.filter((u) => u.id !== me.id).map((u) => ({
			kind: "user",
			id: `user:${u.id}`,
			name: u.username ?? void 0,
			handle: [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.nickname || void 0
		}));
		return params.limit && params.limit > 0 ? entries.slice(0, params.limit) : entries;
	} catch (err) {
		console.debug?.("[mattermost-directory] listPeers failed:", err?.message);
		return [];
	}
}
//#endregion
//#region extensions/mattermost/src/mattermost/probe.ts
async function probeMattermost(baseUrl, botToken, timeoutMs = 2500, allowPrivateNetwork = false, deps) {
	const normalized = normalizeMattermostBaseUrl(baseUrl);
	if (!normalized) return {
		ok: false,
		error: "baseUrl missing"
	};
	const url = `${normalized}/api/v4/users/me`;
	const headers = { Authorization: `Bearer ${botToken}` };
	return await runChannelProbe(void 0, async ({ elapsedMs }) => {
		const resolvedTimeoutMs = timeoutMs > 0 ? resolveTimerTimeoutMs(timeoutMs, 2500) : void 0;
		const { response: res, release } = await fetchWithSsrFGuard({
			url,
			init: { headers },
			auditContext: "mattermost-probe",
			policy: ssrfPolicyFromPrivateNetworkOptIn(allowPrivateNetwork),
			...resolvedTimeoutMs !== void 0 ? { timeoutMs: resolvedTimeoutMs } : {},
			...deps?.fetchImpl ? { fetchImpl: deps.fetchImpl } : {},
			...deps?.lookupFn ? { lookupFn: deps.lookupFn } : {}
		});
		const requestElapsedMs = elapsedMs();
		try {
			if (!res.ok) {
				const detail = await readMattermostError(res, headers);
				return {
					ok: false,
					status: res.status,
					error: detail || res.statusText,
					elapsedMs: requestElapsedMs
				};
			}
			const bot = await readProviderJsonResponse(res, "Mattermost probe /users/me");
			return {
				ok: true,
				status: res.status,
				elapsedMs: requestElapsedMs,
				bot
			};
		} finally {
			await release();
		}
	}, (error) => ({
		ok: false,
		status: null,
		error: formatErrorMessage(error)
	}));
}
//#endregion
//#region extensions/mattermost/src/mattermost/reactions.ts
const BOT_USER_CACHE_TTL_MS = 6e5;
const botUserIdCache = /* @__PURE__ */ new Map();
async function resolveBotUserId(client, cacheKey) {
	const rawNow = Date.now();
	const now = asDateTimestampMs(rawNow);
	const cached = botUserIdCache.get(cacheKey);
	if (cached) {
		if (now !== void 0 && cached.expiresAt > now) return cached.userId;
		botUserIdCache.delete(cacheKey);
	}
	const userId = (await fetchMattermostMe(client))?.id?.trim();
	if (!userId) return null;
	const expiresAt = resolveExpiresAtMsFromDurationMs(BOT_USER_CACHE_TTL_MS, { nowMs: rawNow });
	if (expiresAt !== void 0) botUserIdCache.set(cacheKey, {
		userId,
		expiresAt
	});
	return userId;
}
async function addMattermostReaction(params) {
	return runMattermostReaction(params, {
		action: "add",
		mutation: createReaction
	});
}
async function removeMattermostReaction(params) {
	return runMattermostReaction(params, {
		action: "remove",
		mutation: deleteReaction
	});
}
function parseAuthorizedReactionTarget(rawTarget) {
	const normalized = rawTarget ? normalizeMattermostMessagingTarget(rawTarget) : void 0;
	if (!normalized) return null;
	if (normalized.startsWith("channel:")) {
		const id = normalized.slice(8).trim();
		return id ? {
			kind: "channel",
			id
		} : null;
	}
	if (normalized.startsWith("user:")) {
		const id = normalized.slice(5).trim();
		return id ? {
			kind: "user",
			id
		} : null;
	}
	return null;
}
async function authorizeMattermostReactionResource(params) {
	const target = parseAuthorizedReactionTarget(params.authorizedTarget);
	if (!target) throw new Error("Mattermost delegated reactions require a canonical authorized conversation target.");
	const postChannelId = (await params.client.request(`/posts/${encodeURIComponent(params.postId)}`)).channel_id?.trim();
	if (!postChannelId) throw new Error("Mattermost reaction post is missing its conversation binding.");
	if (target.kind === "channel") {
		if (postChannelId !== target.id) throw new Error("Mattermost reaction post belongs to a different conversation.");
		return;
	}
	const botUserId = await resolveBotUserId(params.client, params.cacheKey);
	if (!botUserId) throw new Error("Mattermost reactions failed: could not resolve bot user id.");
	const channel = await fetchMattermostChannel(params.client, postChannelId);
	const participants = channel.name?.split("__").map((entry) => entry.trim()).filter(Boolean).toSorted() ?? [];
	const authorizedParticipants = [botUserId, target.id].toSorted();
	if (channel.type !== "D" || participants.length !== 2 || participants[0] !== authorizedParticipants[0] || participants[1] !== authorizedParticipants[1]) throw new Error("Mattermost reaction post belongs to a different direct conversation.");
	return botUserId;
}
async function runMattermostReaction(params, options) {
	const resolved = resolveMattermostAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const baseUrl = resolved.baseUrl?.trim();
	const botToken = resolved.botToken?.trim();
	if (!baseUrl || !botToken) return {
		ok: false,
		error: "Mattermost botToken/baseUrl missing."
	};
	const client = createMattermostClient({
		baseUrl,
		botToken,
		fetchImpl: params.fetchImpl,
		allowPrivateNetwork: resolved.config.network?.dangerouslyAllowPrivateNetwork === true
	});
	const cacheKey = `${baseUrl}:${botToken}`;
	try {
		const userId = (params.conversationReadOrigin === "direct-operator" ? void 0 : await authorizeMattermostReactionResource({
			client,
			cacheKey,
			postId: params.postId,
			authorizedTarget: params.authorizedTarget
		})) ?? await resolveBotUserId(client, cacheKey);
		if (!userId) return {
			ok: false,
			error: "Mattermost reactions failed: could not resolve bot user id."
		};
		await options.mutation(client, {
			userId,
			postId: params.postId,
			emojiName: params.emojiName
		});
	} catch (err) {
		return {
			ok: false,
			error: `Mattermost ${options.action} reaction failed: ${String(err)}`
		};
	}
	return { ok: true };
}
async function createReaction(client, params) {
	await client.request("/reactions", {
		method: "POST",
		body: JSON.stringify({
			user_id: params.userId,
			post_id: params.postId,
			emoji_name: params.emojiName
		}),
		discardResponse: true
	});
}
async function deleteReaction(client, params) {
	const emoji = encodeURIComponent(params.emojiName);
	await client.request(`/users/${params.userId}/posts/${params.postId}/reactions/${emoji}`, {
		method: "DELETE",
		discardResponse: true
	});
}
//#endregion
//#region extensions/mattermost/src/mattermost/read.ts
function parseMattermostChannelTarget(rawTarget) {
	const normalized = normalizeMattermostMessagingTarget(rawTarget);
	if (normalized?.startsWith("channel:")) return normalized.slice(8).trim() || void 0;
	const trimmed = rawTarget.trim();
	return trimmed && !trimmed.includes(":") ? trimmed : void 0;
}
function isCurrentMattermostReadTarget(params) {
	const toolContext = params.context.toolContext;
	const nativeChannelId = toolContext?.currentChannelId;
	if (typeof nativeChannelId === "string" && nativeChannelId.trim()) return parseMattermostChannelTarget(nativeChannelId) === params.channelId;
	const messagingTarget = toolContext?.currentMessagingTarget;
	return typeof messagingTarget === "string" && Boolean(messagingTarget.trim()) && parseMattermostChannelTarget(messagingTarget) === params.channelId;
}
function isConfiguredMattermostReadTarget(params) {
	const { groupPolicy } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: params.cfg.channels?.mattermost !== void 0,
		groupPolicy: params.account.config.groupPolicy,
		defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy
	});
	if (groupPolicy === "disabled") return false;
	if (groupPolicy === "open") return true;
	const groups = params.account.config.groups;
	return groups?.[params.channelId] !== void 0 || groups?.["*"] !== void 0;
}
async function readMattermostMessages(params) {
	const account = resolveMattermostAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.enabled) throw new Error(`Mattermost account "${account.accountId}" is disabled`);
	const baseUrl = account.baseUrl?.trim();
	const botToken = account.botToken?.trim();
	if (!baseUrl || !botToken) throw new Error("Mattermost botToken/baseUrl missing.");
	const client = createMattermostClient({
		baseUrl,
		botToken,
		fetchImpl: params.fetchImpl,
		allowPrivateNetwork: account.config.network?.dangerouslyAllowPrivateNetwork === true
	});
	if (params.context.conversationReadOrigin !== "direct-operator") {
		const requesterAccountId = params.context.requesterAccountId?.trim();
		const sameProvider = normalizeLowercaseStringOrEmpty(params.context.toolContext?.currentChannelProvider) === "mattermost";
		const sameAccount = requesterAccountId && normalizeAccountId(requesterAccountId) === normalizeAccountId(account.accountId);
		if (!sameProvider || !sameAccount) throw new Error("Mattermost delegated reads require the current Mattermost account.");
		if (!isCurrentMattermostReadTarget(params)) {
			const channel = await fetchMattermostChannel(client, params.channelId);
			if (channel.type !== "O" && channel.type !== "P" || !isConfiguredMattermostReadTarget({
				cfg: params.cfg,
				account,
				channelId: params.channelId
			})) throw new Error("Mattermost read target channel is not allowed.");
		}
	}
	return await fetchMattermostChannelPosts(client, params.channelId, {
		limit: params.limit,
		before: params.before,
		after: params.after
	});
}
//#endregion
export { addMattermostReaction, listMattermostDirectoryGroups, listMattermostDirectoryPeers, probeMattermost, readMattermostMessages, removeMattermostReaction, resolveMattermostOpaqueTarget, sendMessageMattermost };
