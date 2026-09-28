require("../runtime-api.cjs");
const require_resolve_allowlist = require("./resolve-allowlist-CHzaaWiC.cjs");
const require_channel = require("./channel-BDp16XRR.cjs");
const require_channel_setup = require("./channel.setup-BVDfgdCc.cjs");
const require_polls = require("./polls-BJ4-4uZm.cjs");
const require_send = require("./send-CYN_N7O1.cjs");
const require_reaction_types = require("./reaction-types-C7RA7Wxt.cjs");
let openclaw_plugin_sdk_channel_outbound = require("openclaw/plugin-sdk/channel-outbound");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_reply_payload = require("openclaw/plugin-sdk/reply-payload");
let openclaw_plugin_sdk_number_runtime = require("openclaw/plugin-sdk/number-runtime");
let openclaw_plugin_sdk_channel_send_result = require("openclaw/plugin-sdk/channel-send-result");
let openclaw_plugin_sdk_text_chunking = require("openclaw/plugin-sdk/text-chunking");
let openclaw_plugin_sdk_string_normalization_runtime = require("openclaw/plugin-sdk/string-normalization-runtime");
//#region extensions/msteams/src/directory-live.ts
async function listMSTeamsDirectoryPeersLive(params) {
	const query = require_resolve_allowlist.normalizeQuery(params.query);
	if (!query) return [];
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 20;
	return (await require_resolve_allowlist.searchGraphUsers({
		token,
		query,
		top: limit
	})).map((user) => {
		const id = user.id?.trim();
		if (!id) return null;
		const name = user.displayName?.trim();
		const handle = user.userPrincipalName?.trim() || user.mail?.trim();
		return {
			kind: "user",
			id: `user:${id}`,
			name: name || void 0,
			handle: handle ? `@${handle}` : void 0,
			raw: user
		};
	}).filter(Boolean);
}
async function listMSTeamsDirectoryGroupsLive(params) {
	const rawQuery = require_resolve_allowlist.normalizeQuery(params.query);
	if (!rawQuery) return [];
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 20;
	const [teamQuery, channelQuery] = rawQuery.includes("/") ? (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeStringEntries)(rawQuery.split("/", 2)) : [rawQuery, null];
	const teams = await require_resolve_allowlist.listTeamsByName(token, teamQuery);
	const results = [];
	for (const team of teams) {
		const teamId = team.id?.trim();
		if (!teamId) continue;
		const teamName = team.displayName?.trim() || teamQuery;
		if (!channelQuery) {
			results.push({
				kind: "group",
				id: `team:${teamId}`,
				name: teamName,
				handle: teamName ? `#${teamName}` : void 0,
				raw: team
			});
			if (results.length >= limit) return results;
			continue;
		}
		const channels = await require_resolve_allowlist.listChannelsForTeam(token, teamId);
		for (const channel of channels) {
			const name = channel.displayName?.trim();
			if (!name) continue;
			if (!(0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(name).includes((0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(channelQuery))) continue;
			results.push({
				kind: "group",
				id: `conversation:${channel.id}`,
				name: `${teamName}/${name}`,
				handle: `#${name}`,
				raw: channel
			});
			if (results.length >= limit) return results;
		}
	}
	return results;
}
//#endregion
//#region extensions/msteams/src/graph-messages.ts
/**
* Resolve the Graph API path prefix for a conversation.
* If `to` contains "/" it's a `teamId/channelId` (channel path),
* otherwise it's a chat ID.
*/
/**
* Strip common target prefixes (`conversation:`, `user:`) so raw
* conversation IDs can be used directly in Graph paths.
*/
function stripTargetPrefix(raw) {
	const trimmed = raw.trim();
	if (/^conversation:/i.test(trimmed)) return trimmed.slice(13).trim();
	if (/^user:/i.test(trimmed)) return trimmed.slice(5).trim();
	return trimmed;
}
/**
* Resolve a target to a Graph-compatible conversation ID.
* `user:<aadId>` targets are looked up in the conversation store to find the
* actual `19:xxx@thread.*` chat ID that Graph API requires.
* Conversation IDs and `teamId/channelId` pairs pass through unchanged.
*/
async function resolveGraphConversationId(to) {
	const trimmed = to.trim();
	const isUserTarget = /^user:/i.test(trimmed);
	const cleaned = stripTargetPrefix(trimmed);
	if (!isUserTarget) return cleaned;
	const found = await require_polls.createMSTeamsConversationStoreState().findPreferredDmByUserId(cleaned);
	if (!found) throw new Error(`No conversation found for user:${cleaned}. The bot must receive a message from this user before Graph API operations work.`);
	if (found.conversationId.startsWith("19:")) return found.conversationId;
	throw new Error(`Conversation for user:${cleaned} uses a Bot Framework ID (${found.conversationId}) that Graph API does not accept. Use a Graph-native conversation:19:... target when available.`);
}
function resolveConversationPath(to) {
	const cleaned = stripTargetPrefix(to);
	const separatorIndex = cleaned.indexOf("/");
	if (separatorIndex !== -1) {
		const teamId = cleaned.slice(0, separatorIndex);
		const channelId = cleaned.slice(separatorIndex + 1).replace(/\/.*$/, "");
		return {
			kind: "channel",
			basePath: `/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}`,
			teamId,
			channelId
		};
	}
	return {
		kind: "chat",
		basePath: `/chats/${encodeURIComponent(cleaned)}`,
		chatId: cleaned
	};
}
/**
* Retrieve a single message by ID from a chat or channel via Graph API.
*/
async function getMessageMSTeams(params) {
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
	const path = `${basePath}/messages/${encodeURIComponent(params.messageId)}`;
	const msg = await require_resolve_allowlist.fetchGraphJson({
		token,
		path
	});
	return {
		id: msg.id ?? params.messageId,
		text: msg.body?.content,
		from: msg.from,
		createdAt: msg.createdDateTime
	};
}
/**
* Pin a message in a chat conversation via Graph API.
*
* Chat pinning uses the v1.0 endpoint: `POST /chats/{chatId}/pinnedMessages`.
*
* Channel pinning uses `POST /teams/{teamId}/channels/{channelId}/pinnedMessages`.
* **Note:** The channel pin endpoint may require the Graph beta API or specific
* tenant-level permissions. As of March 2026, general availability is not
* confirmed for all tenants. If the call returns 404 or 403, the endpoint may
* not be enabled for the target tenant.
*/
async function pinMessageMSTeams(params) {
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const conversationId = await resolveGraphConversationId(params.to);
	const conv = resolveConversationPath(conversationId);
	if (conv.kind === "channel") throw new Error("Pin/unpin is not supported for channel messages on Graph v1.0. Only chat conversations support pinned messages.");
	const body = { "message@odata.bind": `https://graph.microsoft.com/v1.0/chats/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(params.messageId)}` };
	return {
		ok: true,
		pinnedMessageId: (await require_resolve_allowlist.mutateGraphJson({
			token,
			path: `${conv.basePath}/pinnedMessages`,
			method: "POST",
			body
		})).id
	};
}
/**
* Unpin a message in a chat conversation via Graph API.
* `pinnedMessageId` is the pinned-message resource ID (from pin or list-pins),
* not the underlying chat message ID.
*
* Channel unpin uses `DELETE /teams/{teamId}/channels/{channelId}/pinnedMessages/{id}`.
* See the note on {@link pinMessageMSTeams} regarding beta/GA status.
*/
async function unpinMessageMSTeams(params) {
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const conv = resolveConversationPath(await resolveGraphConversationId(params.to));
	if (conv.kind === "channel") throw new Error("Pin/unpin is not supported for channel messages on Graph v1.0. Only chat conversations support pinned messages.");
	const path = `${conv.basePath}/pinnedMessages/${encodeURIComponent(params.pinnedMessageId)}`;
	await require_resolve_allowlist.deleteGraphRequest({
		token,
		path
	});
	return { ok: true };
}
/** Maximum number of pagination pages to follow to avoid unbounded loops. */
const LIST_PINS_MAX_PAGES = 10;
/**
* List all pinned messages in a chat conversation via Graph API.
* Follows `@odata.nextLink` pagination to collect the full pin set.
*
* Channel list-pins uses the same endpoint pattern as channel pin/unpin.
* See the note on {@link pinMessageMSTeams} regarding beta/GA status.
*/
async function listPinsMSTeams(params) {
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const conv = resolveConversationPath(await resolveGraphConversationId(params.to));
	if (conv.kind === "channel") throw new Error("Listing pinned messages is not supported for channels on Graph v1.0. Only chat conversations support pinned messages.");
	const path = `${conv.basePath}/pinnedMessages?$expand=message`;
	const allPins = [];
	let res = await require_resolve_allowlist.fetchGraphJson({
		token,
		path
	});
	let pages = 1;
	while (true) {
		for (const pin of res.value ?? []) allPins.push({
			id: pin.id ?? "",
			pinnedMessageId: pin.id ?? "",
			messageId: pin.message?.id,
			text: pin.message?.body?.content
		});
		const nextLink = res["@odata.nextLink"];
		if (!nextLink || pages >= LIST_PINS_MAX_PAGES) break;
		res = await require_resolve_allowlist.fetchGraphAbsoluteUrl({
			token,
			url: nextLink
		});
		pages++;
	}
	return { pins: allPins };
}
/**
* Add an emoji reaction to a message via Graph API (beta).
*
* Writes (setReaction) require a Delegated token, so we pass
* `preferDelegated: true`. The resolver falls back to the app-only token when
* delegated auth is not configured, preserving today's behavior while letting
* delegated-auth-enabled deployments hit the user-scoped endpoint.
*/
async function reactMessageMSTeams(params) {
	const reactionType = require_reaction_types.resolveMSTeamsReactionEmoji(params.reactionType);
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg, { preferDelegated: true });
	const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
	const path = `${basePath}/messages/${encodeURIComponent(params.messageId)}/setReaction`;
	await require_resolve_allowlist.mutateGraphJson({
		token,
		path,
		method: "POST",
		body: { reactionType },
		beta: true
	});
	return { ok: true };
}
/**
* Remove an emoji reaction from a message via Graph API (beta).
*
* Writes (unsetReaction) require a Delegated token, so we pass
* `preferDelegated: true`. See `reactMessageMSTeams` for fallback rules.
*/
async function unreactMessageMSTeams(params) {
	const reactionType = require_reaction_types.resolveMSTeamsReactionEmoji(params.reactionType);
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg, { preferDelegated: true });
	const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
	const path = `${basePath}/messages/${encodeURIComponent(params.messageId)}/unsetReaction`;
	await require_resolve_allowlist.mutateGraphJson({
		token,
		path,
		method: "POST",
		body: { reactionType },
		beta: true
	});
	return { ok: true };
}
/**
* List reactions on a message, grouped by type.
* Uses Graph v1.0 (reactions are included in the message resource).
*/
async function listReactionsMSTeams(params) {
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
	const path = `${basePath}/messages/${encodeURIComponent(params.messageId)}`;
	const msg = await require_resolve_allowlist.fetchGraphJson({
		token,
		path
	});
	const grouped = /* @__PURE__ */ new Map();
	for (const reaction of msg.reactions ?? []) {
		const type = reaction.reactionType ?? "unknown";
		if (!grouped.has(type)) grouped.set(type, {
			count: 0,
			users: []
		});
		const group = grouped.get(type);
		group.count++;
		if (reaction.user?.id) group.users.push({
			id: reaction.user.id,
			displayName: reaction.user.displayName
		});
	}
	return { reactions: Array.from(grouped.entries()).map(([type, group]) => ({
		reactionType: type,
		name: type,
		emoji: require_reaction_types.getMSTeamsReactionEmoji(type),
		count: group.count,
		users: group.users
	})) };
}
const SEARCH_DEFAULT_LIMIT = 25;
const SEARCH_MAX_LIMIT = 50;
const SEARCH_PAGE_SIZE = 50;
const SEARCH_MAX_PAGES = 10;
function normalizeSearchText(message) {
	const content = message.body?.content ?? "";
	return message.body?.contentType?.toLowerCase() === "html" ? require_reaction_types.stripHtmlFromTeamsMessage(content) : content.trim();
}
function matchesSearchSender(message, from) {
	const normalized = from?.trim().toLowerCase();
	if (!normalized) return true;
	const sender = message.from?.user ?? message.from?.application;
	return [sender?.id, sender?.displayName].some((value) => value?.trim().toLowerCase() === normalized);
}
/**
* Search messages within one already-authorized chat or channel.
* Graph does not support collection `$search` here, so filter bounded pages
* locally without widening the read to the account's global message index.
*/
async function searchMessagesMSTeams(params) {
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const { basePath } = resolveConversationPath(await resolveGraphConversationId(params.to));
	const rawLimit = params.limit ?? SEARCH_DEFAULT_LIMIT;
	const top = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.floor(rawLimit), 1), SEARCH_MAX_LIMIT) : SEARCH_DEFAULT_LIMIT;
	const query = params.query.trim().toLowerCase();
	const messages = [];
	let nextUrl;
	let truncated = false;
	for (let page = 0; page < SEARCH_MAX_PAGES; page++) {
		const response = nextUrl ? await require_resolve_allowlist.fetchGraphAbsoluteUrl({
			token,
			url: nextUrl
		}) : await require_resolve_allowlist.fetchGraphJson({
			token,
			path: `${basePath}/messages?$top=${SEARCH_PAGE_SIZE}`
		});
		for (const message of response.value ?? []) if (normalizeSearchText(message).toLowerCase().includes(query) && matchesSearchSender(message, params.from)) {
			if (messages.length >= top) return {
				messages,
				truncated: true
			};
			messages.push({
				id: message.id ?? "",
				text: message.body?.content,
				from: message.from,
				createdAt: message.createdDateTime
			});
		}
		nextUrl = response["@odata.nextLink"];
		if (messages.length >= top) return {
			messages,
			truncated: Boolean(nextUrl)
		};
		if (!nextUrl) return {
			messages,
			truncated: false
		};
		truncated = page === 9;
	}
	return {
		messages,
		truncated
	};
}
//#endregion
//#region extensions/msteams/src/graph-conversation-members.ts
const MAX_CONVERSATION_MEMBER_PAGES = 100;
async function findMSTeamsConversationMember(params) {
	const conversationId = await resolveGraphConversationId(params.to);
	const conversation = resolveConversationPath(conversationId);
	const collection = conversation.kind === "channel" && params.includeIndirectChannelMembers ? "allMembers" : "members";
	const userId = params.userId.trim().toLowerCase();
	const result = await require_resolve_allowlist.fetchAllGraphPages({
		token: params.token,
		path: `${conversation.basePath}/${collection}`,
		maxPages: MAX_CONVERSATION_MEMBER_PAGES,
		collectItems: false,
		findOne: (candidate) => candidate.userId?.trim().toLowerCase() === userId || candidate.email?.trim().toLowerCase() === userId
	});
	if (result.truncated) throw new Error("MS Teams conversation member pagination limit exceeded");
	return {
		conversationId,
		member: result.found
	};
}
//#endregion
//#region extensions/msteams/src/graph-group-management.ts
function normalizeConversationMemberRole(role) {
	const normalized = role?.trim().toLowerCase() ?? "";
	if (!normalized) return "member";
	if (normalized === "member" || normalized === "owner") return normalized;
	throw new Error("MS Teams participant role must be \"member\" or \"owner\".");
}
function resolveConversationMemberRoles(role, kind) {
	const normalized = normalizeConversationMemberRole(role);
	if (kind === "chat") return ["owner"];
	return normalized === "owner" ? ["owner"] : [];
}
/**
* Add a user to a chat or channel via Graph API.
*/
async function addParticipantMSTeams(params) {
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const conversationId = await resolveGraphConversationId(params.to);
	const conv = resolveConversationPath(conversationId);
	const body = {
		"@odata.type": "#microsoft.graph.aadUserConversationMember",
		roles: resolveConversationMemberRoles(params.role, conv.kind),
		"user@odata.bind": `https://graph.microsoft.com/v1.0/users('${require_resolve_allowlist.escapeOData(params.userId)}')`
	};
	await require_resolve_allowlist.mutateGraphJson({
		token,
		path: `${conv.basePath}/members`,
		method: "POST",
		body
	});
	return { added: {
		userId: params.userId,
		chatId: conversationId
	} };
}
/**
* Remove a user from a chat or channel via Graph API.
* Lists members first to resolve the membership ID, then deletes.
*/
async function removeParticipantMSTeams(params) {
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const { conversationId, member } = await findMSTeamsConversationMember({
		token,
		to: params.to,
		userId: params.userId
	});
	if (!member?.id) throw new Error(`User ${params.userId} is not a member of this conversation`);
	const conv = resolveConversationPath(conversationId);
	await require_resolve_allowlist.deleteGraphRequest({
		token,
		path: `${conv.basePath}/members/${encodeURIComponent(member.id)}`
	});
	return { removed: {
		userId: params.userId,
		chatId: conversationId
	} };
}
/**
* Rename a chat (topic) or channel (displayName) via Graph API.
*/
async function renameGroupMSTeams(params) {
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const conversationId = await resolveGraphConversationId(params.to);
	const conv = resolveConversationPath(conversationId);
	const body = conv.kind === "chat" ? { topic: params.name } : { displayName: params.name };
	await require_resolve_allowlist.mutateGraphJson({
		token,
		path: conv.basePath,
		method: "PATCH",
		body
	});
	return { renamed: {
		chatId: conversationId,
		newName: params.name
	} };
}
//#endregion
//#region extensions/msteams/src/graph-members.ts
const MAX_TEAM_MEMBER_PAGES = 100;
function normalizeUserId(value) {
	return value?.replace(/^(msteams|teams|user):/i, "").trim().toLowerCase() ?? "";
}
async function findStandardChannelMember(params) {
	const conversation = resolveConversationPath(await resolveGraphConversationId(params.to));
	if (conversation.kind !== "channel" || !conversation.teamId) return;
	if ((await require_resolve_allowlist.fetchGraphJson({
		token: params.token,
		path: `${conversation.basePath}?$select=membershipType`
	})).membershipType !== "standard") throw new Error("Microsoft Teams member-info requires a standard channel when using the configured permission baseline.");
	const requestedUserId = normalizeUserId(params.userId);
	const result = await require_resolve_allowlist.fetchAllGraphPages({
		token: params.token,
		path: `/teams/${encodeURIComponent(conversation.teamId)}/members`,
		maxPages: MAX_TEAM_MEMBER_PAGES,
		collectItems: false,
		findOne: (candidate) => normalizeUserId(candidate.userId) === requestedUserId || normalizeUserId(candidate.email) === requestedUserId
	});
	if (result.truncated) throw new Error("Microsoft Teams team member pagination limit exceeded");
	return result.found;
}
/**
* Fetch a user profile from Microsoft Graph by user ID.
*/
async function getMemberInfoMSTeams(params) {
	if (normalizeUserId(params.userId) === normalizeUserId(params.currentRequesterId) && resolveConversationPath(params.to).kind === "chat") return { user: {
		id: params.currentRequesterId ?? void 0,
		displayName: void 0,
		mail: void 0,
		jobTitle: void 0,
		userPrincipalName: void 0,
		officeLocation: void 0,
		roles: []
	} };
	const member = resolveConversationPath(await resolveGraphConversationId(params.to)).kind === "channel" ? await findStandardChannelMember({
		token: await require_resolve_allowlist.resolveGraphToken(params.cfg),
		to: params.to,
		userId: params.userId
	}) : void 0;
	if (!member?.userId) throw new Error(`User ${params.userId} is not a member of this conversation`);
	return { user: {
		id: member.userId,
		displayName: member.displayName,
		mail: member.email,
		jobTitle: void 0,
		userPrincipalName: member.email,
		officeLocation: void 0,
		roles: member.roles ?? []
	} };
}
//#endregion
//#region extensions/msteams/src/graph-teams.ts
/**
* List channels in a team via Graph API.
* Returns id, displayName, description, and membershipType for each channel.
* Follows @odata.nextLink for paginated results (up to 10 pages).
*/
async function listChannelsMSTeams(params) {
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const result = await require_resolve_allowlist.fetchAllGraphPages({
		token,
		path: `/teams/${encodeURIComponent(params.teamId)}/channels?$select=id,displayName,description,membershipType`,
		maxPages: 10
	});
	return {
		channels: result.items.map((ch) => ({
			id: ch.id,
			displayName: ch.displayName,
			description: ch.description,
			membershipType: ch.membershipType
		})),
		truncated: result.truncated
	};
}
/**
* Get detailed information about a single channel in a team via Graph API.
* Returns id, displayName, description, membershipType, webUrl, and createdDateTime.
*/
async function getChannelInfoMSTeams(params) {
	const token = await require_resolve_allowlist.resolveGraphToken(params.cfg);
	const path = `/teams/${encodeURIComponent(params.teamId)}/channels/${encodeURIComponent(params.channelId)}?$select=id,displayName,description,membershipType,webUrl,createdDateTime`;
	const ch = await require_resolve_allowlist.fetchGraphJson({
		token,
		path
	});
	return { channel: {
		id: ch.id,
		displayName: ch.displayName,
		description: ch.description,
		membershipType: ch.membershipType,
		webUrl: ch.webUrl,
		createdDateTime: ch.createdDateTime
	} };
}
//#endregion
//#region extensions/msteams/src/outbound.ts
const MSTEAMS_TEXT_CHUNK_LIMIT = 4e3;
function resolveMSTeamsEffectiveTextChunkLimit(configuredLimit) {
	return typeof configuredLimit === "number" && configuredLimit > 0 ? Math.min(configuredLimit, MSTEAMS_TEXT_CHUNK_LIMIT) : MSTEAMS_TEXT_CHUNK_LIMIT;
}
function toMSTeamsOutboundResult(result) {
	const { conversationId, ...delivery } = result;
	return {
		...delivery,
		target: {
			kind: "conversation",
			id: conversationId
		}
	};
}
async function sendWithDeliveryResults(send, onDeliveryResult) {
	if (!onDeliveryResult) return send(void 0);
	let childReported = false;
	const result = await send(async (delivery) => {
		childReported = true;
		await onDeliveryResult((0, openclaw_plugin_sdk_channel_send_result.attachChannelToResult)("msteams", toMSTeamsOutboundResult(delivery)));
	});
	if (!childReported) await onDeliveryResult((0, openclaw_plugin_sdk_channel_send_result.attachChannelToResult)("msteams", toMSTeamsOutboundResult(result)));
	return result;
}
function resolveMSTeamsThreadTarget(to, threadId) {
	const normalizedThreadId = threadId == null ? "" : String(threadId).trim();
	const graphChannelId = to.includes("/") ? to.slice(to.indexOf("/") + 1) : "";
	const isConversationTarget = to.startsWith("conversation:") || to.startsWith("19:") || graphChannelId.startsWith("19:") || graphChannelId.includes("@thread");
	if (!normalizedThreadId || /(?:^|;)messageid=/iu.test(to) || !isConversationTarget) return to;
	return `${to};messageid=${normalizedThreadId}`;
}
function resolveMSTeamsTextSend(params) {
	return (0, openclaw_plugin_sdk_channel_outbound.resolveOutboundSendDep)(params.deps, "msteams") ?? ((to, text, opts) => require_send.sendMessageMSTeams({
		cfg: params.cfg,
		to,
		text,
		...opts
	}));
}
function resolveMSTeamsMediaSend(params) {
	return (0, openclaw_plugin_sdk_channel_outbound.resolveOutboundSendDep)(params.deps, "msteams") ?? ((to, text, opts) => require_send.sendMessageMSTeams({
		cfg: params.cfg,
		to,
		text,
		...opts
	}));
}
const msteamsOutbound = {
	deliveryMode: "direct",
	chunker: openclaw_plugin_sdk_text_chunking.chunkTextForOutbound,
	chunkerMode: "markdown",
	textChunkLimit: MSTEAMS_TEXT_CHUNK_LIMIT,
	resolveEffectiveTextChunkLimit: ({ fallbackLimit }) => resolveMSTeamsEffectiveTextChunkLimit(fallbackLimit),
	pollMaxOptions: 12,
	deliveryCapabilities: { durableFinal: {
		text: true,
		media: true,
		payload: true,
		messageSendingHooks: true
	} },
	presentationCapabilities: require_channel.MSTEAMS_PRESENTATION_CAPABILITIES,
	renderPresentation: ({ payload, presentation }) => {
		if (payload.mediaUrl || payload.mediaUrls?.length) return null;
		const card = require_channel.buildMSTeamsPresentationCard({
			presentation,
			text: payload.text
		});
		const msteamsData = (0, openclaw_plugin_sdk_string_coerce_runtime.asOptionalRecord)(payload.channelData?.msteams) ?? {};
		return {
			...payload,
			channelData: {
				...payload.channelData,
				msteams: {
					...msteamsData,
					presentationCard: card
				}
			}
		};
	},
	sendPayload: async ({ cfg, to, text, mediaUrl, mediaAccess, mediaLocalRoots, mediaReadFile, payload, deps, onDeliveryResult, assertDirectAdapterHandoff, onPlatformSendDispatch, threadId }) => {
		const handoff = {
			assertDirectAdapterHandoff,
			onPlatformSendDispatch
		};
		const deliveryTarget = resolveMSTeamsThreadTarget(to, threadId);
		const presentationCard = (0, openclaw_plugin_sdk_string_coerce_runtime.asOptionalRecord)(payload.channelData?.msteams)?.presentationCard;
		if (presentationCard && typeof presentationCard === "object" && !Array.isArray(presentationCard)) {
			const result = await sendWithDeliveryResults((report) => require_send.sendAdaptiveCardMSTeams({
				cfg,
				to: deliveryTarget,
				card: presentationCard,
				...handoff,
				onDeliveryResult: report
			}), onDeliveryResult);
			return (0, openclaw_plugin_sdk_channel_send_result.attachChannelToResult)("msteams", toMSTeamsOutboundResult(result));
		}
		const mediaUrls = (0, openclaw_plugin_sdk_string_normalization_runtime.normalizeStringEntries)((0, openclaw_plugin_sdk_reply_payload.resolvePayloadMediaUrls)({
			...payload,
			mediaUrl: payload.mediaUrl ?? mediaUrl
		}));
		if (mediaUrls.length > 0) {
			const send = resolveMSTeamsMediaSend({
				cfg,
				deps
			});
			const result = await (0, openclaw_plugin_sdk_reply_payload.sendPayloadMediaSequence)({
				text,
				mediaUrls,
				send: async ({ text: textLocal, mediaUrl: mediaUrlLocal }) => await sendWithDeliveryResults((report) => send(deliveryTarget, textLocal, {
					mediaUrl: mediaUrlLocal,
					mediaAccess,
					mediaLocalRoots,
					mediaReadFile,
					...handoff,
					onDeliveryResult: report
				}), onDeliveryResult)
			});
			if (result) return (0, openclaw_plugin_sdk_channel_send_result.attachChannelToResult)("msteams", toMSTeamsOutboundResult(result));
		}
		if (text.trim()) {
			const send = resolveMSTeamsTextSend({
				cfg,
				deps
			});
			const chunks = (0, openclaw_plugin_sdk_reply_payload.resolveTextChunksWithFallback)(text, (0, openclaw_plugin_sdk_text_chunking.chunkTextForOutbound)(text, resolveMSTeamsEffectiveTextChunkLimit(cfg.channels?.msteams?.textChunkLimit)));
			let result;
			for (const chunk of chunks) result = await sendWithDeliveryResults((report) => send(deliveryTarget, chunk, {
				...handoff,
				onDeliveryResult: report
			}), onDeliveryResult);
			return (0, openclaw_plugin_sdk_channel_send_result.attachChannelToResult)("msteams", toMSTeamsOutboundResult(result));
		}
		throw new Error("MS Teams payload send requires text, media, or a presentation card.");
	},
	...(0, openclaw_plugin_sdk_channel_send_result.createAttachedChannelResultAdapter)({
		channel: "msteams",
		sendText: async ({ cfg, to, text, deps, threadId, assertDirectAdapterHandoff, onPlatformSendDispatch, onDeliveryResult }) => {
			const send = resolveMSTeamsTextSend({
				cfg,
				deps
			});
			return toMSTeamsOutboundResult(await sendWithDeliveryResults((report) => send(resolveMSTeamsThreadTarget(to, threadId), text, {
				assertDirectAdapterHandoff,
				onPlatformSendDispatch,
				onDeliveryResult: report
			}), onDeliveryResult));
		},
		sendMedia: async ({ cfg, to, text, mediaUrl, mediaAccess, mediaLocalRoots, mediaReadFile, deps, threadId, assertDirectAdapterHandoff, onPlatformSendDispatch, onDeliveryResult }) => {
			const send = resolveMSTeamsMediaSend({
				cfg,
				deps
			});
			return toMSTeamsOutboundResult(await sendWithDeliveryResults((report) => send(resolveMSTeamsThreadTarget(to, threadId), text, {
				mediaUrl,
				mediaAccess,
				mediaLocalRoots,
				mediaReadFile,
				assertDirectAdapterHandoff,
				onPlatformSendDispatch,
				onDeliveryResult: report
			}), onDeliveryResult));
		},
		sendPoll: async ({ cfg, to, poll, threadId, assertDirectAdapterHandoff, onPlatformSendDispatch }) => {
			const maxSelections = poll.maxSelections ?? 1;
			const result = await require_send.sendPollMSTeams({
				cfg,
				to: resolveMSTeamsThreadTarget(to, threadId),
				question: poll.question,
				options: poll.options,
				maxSelections,
				assertDirectAdapterHandoff,
				onPlatformSendDispatch
			});
			await require_polls.createMSTeamsPollStoreState().createPoll({
				id: result.pollId,
				question: poll.question,
				options: poll.options,
				maxSelections,
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				conversationId: result.conversationId,
				messageId: result.messageId,
				votes: {}
			});
			return result;
		}
	})
};
//#endregion
//#region extensions/msteams/src/probe.ts
function decodeJwtPayload(token) {
	const parts = token.split(".");
	if (parts.length < 2) return null;
	const payload = parts[1] ?? "";
	const normalized = payload.padEnd(payload.length + (4 - payload.length % 4) % 4, "=").replace(/-/g, "+").replace(/_/g, "/");
	try {
		const decoded = Buffer.from(normalized, "base64").toString("utf8");
		const parsed = JSON.parse(decoded);
		return parsed && typeof parsed === "object" ? parsed : null;
	} catch {
		return null;
	}
}
function readStringArray(value) {
	if (!Array.isArray(value)) return;
	const out = (0, openclaw_plugin_sdk_string_normalization_runtime.normalizeStringEntries)(value);
	return out.length > 0 ? out : void 0;
}
function readScopes(value) {
	if (typeof value !== "string") return;
	const out = (0, openclaw_plugin_sdk_string_normalization_runtime.normalizeStringEntries)(value.split(/\s+/));
	return out.length > 0 ? out : void 0;
}
async function probeMSTeams(cfg) {
	const creds = require_resolve_allowlist.resolveMSTeamsCredentials(cfg);
	if (!creds) return {
		ok: false,
		error: "missing credentials (appId, appPassword, tenantId)"
	};
	try {
		const { app } = await require_resolve_allowlist.loadMSTeamsSdkWithAuth(creds, require_resolve_allowlist.resolveMSTeamsSdkCloudOptions(cfg));
		const tokenProvider = require_resolve_allowlist.createMSTeamsTokenProvider(app);
		if (!await require_resolve_allowlist.withMSTeamsRequestDeadline({
			label: "MS Teams Bot Framework probe token",
			work: () => tokenProvider.getAccessToken("https://api.botframework.com")
		})) throw new Error("Failed to acquire bot token");
		let graph;
		try {
			const graphTokenValue = await require_resolve_allowlist.withMSTeamsRequestDeadline({
				label: "MS Teams Graph probe token",
				work: () => tokenProvider.getAccessToken("https://graph.microsoft.com")
			});
			const accessToken = require_resolve_allowlist.readAccessToken(graphTokenValue);
			const payload = accessToken ? decodeJwtPayload(accessToken) : null;
			graph = {
				ok: true,
				roles: readStringArray(payload?.roles),
				scopes: readScopes(payload?.scp)
			};
		} catch (err) {
			graph = {
				ok: false,
				error: require_channel_setup.formatUnknownError(err)
			};
		}
		let delegatedAuth;
		if (cfg?.delegatedAuth?.enabled) try {
			const tokens = await require_resolve_allowlist.loadDelegatedTokens();
			if (tokens) {
				const isExpired = !(0, openclaw_plugin_sdk_number_runtime.isFutureDateTimestampMs)(tokens.expiresAt);
				delegatedAuth = {
					ok: !isExpired,
					scopes: tokens.scopes,
					userPrincipalName: tokens.userPrincipalName,
					...isExpired ? { error: "token expired (will auto-refresh on next use)" } : {}
				};
			} else delegatedAuth = {
				ok: false,
				error: "no delegated tokens found (run setup wizard)"
			};
		} catch {
			delegatedAuth = {
				ok: false,
				error: "failed to load delegated tokens"
			};
		}
		return {
			ok: true,
			appId: creds.appId,
			...graph ? { graph } : {},
			...delegatedAuth ? { delegatedAuth } : {}
		};
	} catch (err) {
		return {
			ok: false,
			appId: creds.appId,
			error: require_channel_setup.formatUnknownError(err)
		};
	}
}
//#endregion
//#region extensions/msteams/src/channel.runtime.ts
const msTeamsChannelRuntime = {
	addParticipantMSTeams,
	deleteMessageMSTeams: require_send.deleteMessageMSTeams,
	editMessageMSTeams: require_send.editMessageMSTeams,
	getChannelInfoMSTeams,
	getMemberInfoMSTeams,
	getMessageMSTeams,
	listChannelsMSTeams,
	listPinsMSTeams,
	listReactionsMSTeams,
	pinMessageMSTeams,
	reactMessageMSTeams,
	removeParticipantMSTeams,
	renameGroupMSTeams,
	searchMessagesMSTeams,
	unpinMessageMSTeams,
	unreactMessageMSTeams,
	listMSTeamsDirectoryGroupsLive,
	listMSTeamsDirectoryPeersLive,
	msteamsOutbound: { ...msteamsOutbound },
	probeMSTeams,
	sendAdaptiveCardMSTeams: require_send.sendAdaptiveCardMSTeams,
	sendMessageMSTeams: require_send.sendMessageMSTeams
};
//#endregion
exports.msTeamsChannelRuntime = msTeamsChannelRuntime;
