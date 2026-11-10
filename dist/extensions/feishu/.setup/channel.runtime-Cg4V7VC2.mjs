import { h as resolveFeishuAccount } from "./doctor-contract-BNXcJcWR.mjs";
import { d as listFeishuDirectoryPeers, o as feishuOutbound, u as listFeishuDirectoryGroups } from "./channel-D60cZ_Y_.mjs";
import { A as sendMessageFeishu, C as sendStickerFeishu, D as getMessageFeishu, E as editMessageFeishu, U as createConfiguredFeishuClient, et as assertFeishuApiSuccess, k as sendCardFeishu } from "./reply-delivery-result-DknmIzOB.mjs";
import { r as createFeishuClient } from "./client-BTiFlqqL.mjs";
import { a as getFeishuMemberInfo, i as getChatMembers, n as buildFeishuDirectChatMembers, r as getChatInfo, t as assertFeishuChatMember } from "./chat-qj1pEIcO.mjs";
import { t as probeFeishu } from "./probe-s0hiM44D.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/feishu/src/directory.ts
const MAX_FEISHU_DIRECTORY_PAGES = 100;
async function listFeishuDirectoryLive(params, options) {
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) return options.fallback(params);
	const label = `Feishu live ${options.kind}`;
	try {
		const client = createFeishuClient(account);
		const entries = [];
		const limit = params.limit ?? 50;
		const q = normalizeLowercaseStringOrEmpty(params.query);
		const peers = options.kind === "peer";
		const pageSize = peers && q ? 50 : Math.min(limit, peers ? 50 : 100);
		let pageToken;
		const seenPageTokens = /* @__PURE__ */ new Set();
		for (let page = 1; page <= MAX_FEISHU_DIRECTORY_PAGES; page += 1) {
			const response = await options.fetchPage(client, pageSize, pageToken);
			if (response.code !== 0) throw new Error(response.msg || `code ${response.code}`);
			for (const item of response.data?.items ?? []) {
				const entry = options.toEntry(item);
				if (entry && (!q || normalizeLowercaseStringOrEmpty(entry.id).includes(q) || normalizeLowercaseStringOrEmpty(entry.name).includes(q)) && (peers || !params.filter || params.filter(entry))) entries.push(entry);
				if (entries.length >= limit) {
					if (peers) return entries;
					break;
				}
			}
			const nextPageToken = response.data?.has_more ? response.data.page_token : void 0;
			if (peers && response.data?.has_more && !nextPageToken) throw new Error(`${label} directory returned an empty page token`);
			if (nextPageToken && seenPageTokens.has(nextPageToken)) throw new Error(`${label} directory returned a repeated page token`);
			if (!nextPageToken) return entries;
			seenPageTokens.add(nextPageToken);
			pageToken = nextPageToken;
			if (page === MAX_FEISHU_DIRECTORY_PAGES) throw new Error(`${label} directory pagination limit exceeded`);
			if (!peers && !(entries.length < limit)) return entries;
		}
		throw new Error(`${label} directory pagination limit exceeded`);
	} catch (err) {
		if (params.fallbackToStatic === false) throw err instanceof Error ? err : /* @__PURE__ */ new Error(`${label} lookup failed`);
		return options.fallback(params);
	}
}
function listFeishuDirectoryPeersLive(params) {
	return listFeishuDirectoryLive(params, {
		kind: "peer",
		fallback: listFeishuDirectoryPeers,
		fetchPage: (client, pageSize, pageToken) => client.contact.user.list({ params: {
			page_size: pageSize,
			page_token: pageToken
		} }),
		toEntry: (user) => user.open_id ? {
			kind: "user",
			id: user.open_id,
			name: user.name || void 0
		} : void 0
	});
}
function listFeishuDirectoryGroupsLive(params) {
	return listFeishuDirectoryLive(params, {
		kind: "group",
		fallback: listFeishuDirectoryGroups,
		fetchPage: (client, pageSize, pageToken) => client.im.chat.list({ params: {
			page_size: pageSize,
			page_token: pageToken
		} }),
		toEntry: (chat) => chat.chat_id ? {
			kind: "group",
			id: chat.chat_id,
			name: chat.name || void 0
		} : void 0
	});
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
	const response = await createConfiguredFeishuClient(params).im.pin.create({ data: { message_id: params.messageId } });
	assertFeishuApiSuccess(response, "Feishu pin create failed");
	return response.data?.pin ? normalizePin(response.data.pin) : null;
}
async function removePinFeishu(params) {
	const response = await createConfiguredFeishuClient(params).im.pin.delete({ path: { message_id: params.messageId } });
	assertFeishuApiSuccess(response, "Feishu pin delete failed");
}
async function listPinsFeishu(params) {
	const response = await createConfiguredFeishuClient(params).im.pin.list({ params: {
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
/**
* Add a reaction (emoji) to a message.
* @param emojiType - Feishu emoji type, e.g., "SMILE", "THUMBSUP", "HEART"
* @see https://open.feishu.cn/document/server-docs/im-v1/message-reaction/emojis-introduce
*/
async function addReactionFeishu(params) {
	const { cfg, messageId, emojiType, accountId } = params;
	const response = await createConfiguredFeishuClient({
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
async function removeReactionFeishu(params) {
	const { cfg, messageId, reactionId, accountId } = params;
	const response = await createConfiguredFeishuClient({
		cfg,
		accountId
	}).im.messageReaction.delete({ path: {
		message_id: messageId,
		reaction_id: reactionId
	} });
	assertFeishuApiSuccess(response, "Feishu remove reaction failed");
}
async function listReactionsFeishu(params) {
	const { cfg, messageId, emojiType, accountId } = params;
	const client = createConfiguredFeishuClient({
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
