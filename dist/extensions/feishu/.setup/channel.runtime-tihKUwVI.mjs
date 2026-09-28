import { o as resolveFeishuAccount, s as resolveFeishuRuntimeAccount } from "./accounts-DmU0xYPx.mjs";
import { c as listFeishuDirectoryPeers, o as feishuOutbound, s as listFeishuDirectoryGroups } from "./channel-DsndN1sp.mjs";
import { A as sendMessageFeishu, C as sendStickerFeishu, D as getMessageFeishu, E as editMessageFeishu, V as assertFeishuApiSuccess, k as sendCardFeishu } from "./reply-delivery-result-CRIHpSze.mjs";
import { r as createFeishuClient } from "./client-DCwNVFZg.mjs";
import { a as getFeishuMemberInfo, i as getChatMembers, n as buildFeishuDirectChatMembers, r as getChatInfo, t as assertFeishuChatMember } from "./chat-BlvUjdN9.mjs";
import { t as probeFeishu } from "./probe-bdidyhAn.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/feishu/src/directory.ts
const MAX_FEISHU_DIRECTORY_PAGES = 100;
async function listFeishuDirectoryPeersLive(params) {
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) return listFeishuDirectoryPeers(params);
	try {
		const client = createFeishuClient(account);
		const peers = [];
		const limit = params.limit ?? 50;
		const q = normalizeLowercaseStringOrEmpty(params.query);
		const pageSize = q ? 50 : Math.min(limit, 50);
		let pageToken;
		const seenPageTokens = /* @__PURE__ */ new Set();
		for (let page = 0; page < MAX_FEISHU_DIRECTORY_PAGES; page += 1) {
			const response = await client.contact.user.list({ params: {
				page_size: pageSize,
				page_token: pageToken
			} });
			if (response.code !== 0) throw new Error(response.msg || `code ${response.code}`);
			for (const user of response.data?.items ?? []) {
				if (user.open_id) {
					const name = user.name || "";
					if (!q || normalizeLowercaseStringOrEmpty(user.open_id).includes(q) || normalizeLowercaseStringOrEmpty(name).includes(q)) peers.push({
						kind: "user",
						id: user.open_id,
						name: name || void 0
					});
				}
				if (peers.length >= limit) return peers;
			}
			if (!response.data?.has_more) return peers;
			const nextPageToken = response.data.page_token;
			if (!nextPageToken) throw new Error("Feishu live peer directory returned an empty page token");
			if (seenPageTokens.has(nextPageToken)) throw new Error("Feishu live peer directory returned a repeated page token");
			seenPageTokens.add(nextPageToken);
			pageToken = nextPageToken;
		}
		throw new Error("Feishu live peer directory pagination limit exceeded");
	} catch (err) {
		if (params.fallbackToStatic === false) throw err instanceof Error ? err : /* @__PURE__ */ new Error("Feishu live peer lookup failed");
		return listFeishuDirectoryPeers(params);
	}
}
async function listFeishuDirectoryGroupsLive(params) {
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) return listFeishuDirectoryGroups(params);
	try {
		const client = createFeishuClient(account);
		const groups = [];
		const limit = params.limit ?? 50;
		const q = normalizeLowercaseStringOrEmpty(params.query);
		let pageToken;
		let pages = 0;
		const seenPageTokens = /* @__PURE__ */ new Set();
		do {
			const response = await client.im.chat.list({ params: {
				page_size: Math.min(limit, 100),
				page_token: pageToken
			} });
			if (response.code !== 0) throw new Error(response.msg || `code ${response.code}`);
			for (const chat of response.data?.items ?? []) {
				if (chat.chat_id) {
					const name = chat.name || "";
					const group = {
						kind: "group",
						id: chat.chat_id,
						name: name || void 0
					};
					if ((!q || normalizeLowercaseStringOrEmpty(chat.chat_id).includes(q) || normalizeLowercaseStringOrEmpty(name).includes(q)) && (!params.filter || params.filter(group))) groups.push(group);
				}
				if (groups.length >= limit) break;
			}
			pages += 1;
			const nextPageToken = response.data?.has_more ? response.data.page_token : void 0;
			if (nextPageToken && seenPageTokens.has(nextPageToken)) throw new Error("Feishu live group directory returned a repeated page token");
			if (nextPageToken) seenPageTokens.add(nextPageToken);
			pageToken = nextPageToken;
		} while (pageToken && groups.length < limit && pages < MAX_FEISHU_DIRECTORY_PAGES);
		if (pageToken && pages >= MAX_FEISHU_DIRECTORY_PAGES) throw new Error("Feishu live group directory pagination limit exceeded");
		return groups;
	} catch (err) {
		if (params.fallbackToStatic === false) throw err instanceof Error ? err : /* @__PURE__ */ new Error("Feishu live group lookup failed");
		return listFeishuDirectoryGroups(params);
	}
}
//#endregion
//#region extensions/feishu/src/pins.ts
function normalizePin(pin) {
	return {
		messageId: pin.message_id,
		chatId: pin.chat_id,
		operatorId: pin.operator_id,
		operatorIdType: pin.operator_id_type,
		createTime: pin.create_time
	};
}
async function createPinFeishu(params) {
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	const response = await createFeishuClient(account).im.pin.create({ data: { message_id: params.messageId } });
	assertFeishuApiSuccess(response, "Feishu pin create failed");
	return response.data?.pin ? normalizePin(response.data.pin) : null;
}
async function removePinFeishu(params) {
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	const response = await createFeishuClient(account).im.pin.delete({ path: { message_id: params.messageId } });
	assertFeishuApiSuccess(response, "Feishu pin delete failed");
}
async function listPinsFeishu(params) {
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	const response = await createFeishuClient(account).im.pin.list({ params: {
		chat_id: params.chatId,
		...params.startTime ? { start_time: params.startTime } : {},
		...params.endTime ? { end_time: params.endTime } : {},
		...typeof params.pageSize === "number" ? { page_size: Math.max(1, Math.min(100, Math.floor(params.pageSize))) } : {},
		...params.pageToken ? { page_token: params.pageToken } : {}
	} });
	assertFeishuApiSuccess(response, "Feishu pin list failed");
	return {
		chatId: params.chatId,
		pins: (response.data?.items ?? []).map(normalizePin),
		hasMore: response.data?.has_more === true,
		pageToken: response.data?.page_token
	};
}
//#endregion
//#region extensions/feishu/src/reactions.ts
function resolveConfiguredFeishuClient(params) {
	const account = resolveFeishuRuntimeAccount(params);
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	return createFeishuClient(account);
}
/**
* Add a reaction (emoji) to a message.
* @param emojiType - Feishu emoji type, e.g., "SMILE", "THUMBSUP", "HEART"
* @see https://open.feishu.cn/document/server-docs/im-v1/message-reaction/emojis-introduce
*/
async function addReactionFeishu(params) {
	const { cfg, messageId, emojiType, accountId } = params;
	const response = await resolveConfiguredFeishuClient({
		cfg,
		accountId
	}).im.messageReaction.create({
		path: { message_id: messageId },
		data: { reaction_type: { emoji_type: emojiType } }
	});
	assertFeishuApiSuccess(response, "Feishu add reaction failed");
	const reactionId = response.data?.reaction_id;
	if (!reactionId) throw new Error("Feishu add reaction failed: no reaction_id returned");
	return { reactionId };
}
/**
* Remove a reaction from a message.
*/
async function removeReactionFeishu(params) {
	const { cfg, messageId, reactionId, accountId } = params;
	const response = await resolveConfiguredFeishuClient({
		cfg,
		accountId
	}).im.messageReaction.delete({ path: {
		message_id: messageId,
		reaction_id: reactionId
	} });
	assertFeishuApiSuccess(response, "Feishu remove reaction failed");
}
/**
* List all reactions for a message.
*/
async function listReactionsFeishu(params) {
	const { cfg, messageId, emojiType, accountId } = params;
	const client = resolveConfiguredFeishuClient({
		cfg,
		accountId
	});
	const reactions = [];
	const seenPageTokens = /* @__PURE__ */ new Set();
	let pageToken;
	while (true) {
		const response = await client.im.messageReaction.list({
			path: { message_id: messageId },
			params: emojiType || pageToken ? {
				...emojiType ? { reaction_type: emojiType } : {},
				...pageToken ? { page_token: pageToken } : {}
			} : void 0
		});
		assertFeishuApiSuccess(response, "Feishu list reactions failed");
		for (const item of response.data?.items ?? []) reactions.push({
			reactionId: item.reaction_id ?? "",
			emojiType: item.reaction_type?.emoji_type ?? "",
			operatorType: item.operator?.operator_type === "app" ? "app" : item.operator?.operator_type === "user" ? "user" : "unknown",
			operatorId: item.operator?.operator_id ?? ""
		});
		if (response.data?.has_more !== true) return reactions;
		const nextPageToken = response.data.page_token?.trim();
		if (!nextPageToken) throw new Error("Feishu reaction pagination is missing its next page token");
		if (seenPageTokens.has(nextPageToken)) throw new Error("Feishu reaction pagination returned a repeated page token");
		seenPageTokens.add(nextPageToken);
		pageToken = nextPageToken;
	}
}
//#endregion
//#region extensions/feishu/src/channel.runtime.ts
const feishuChannelRuntime = {
	assertFeishuChatMember,
	buildFeishuDirectChatMembers,
	listFeishuDirectoryGroupsLive,
	listFeishuDirectoryPeersLive,
	feishuOutbound: { ...feishuOutbound },
	createPinFeishu,
	listPinsFeishu,
	removePinFeishu,
	probeFeishu,
	addReactionFeishu,
	listReactionsFeishu,
	removeReactionFeishu,
	getChatInfo,
	getChatMembers,
	getFeishuMemberInfo,
	editMessageFeishu,
	getMessageFeishu,
	sendCardFeishu,
	sendMessageFeishu,
	sendStickerFeishu
};
//#endregion
export { feishuChannelRuntime };
