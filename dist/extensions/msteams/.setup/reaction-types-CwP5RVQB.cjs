const require_resolve_allowlist = require("./resolve-allowlist-gI34MnpE.cjs");
//#region extensions/msteams/src/graph-thread.ts
/** Keep inbound thread enrichment bounded while still reaching recent replies. */
const MAX_REPLY_PAGES = 50;
function compareThreadMessagesChronologically(a, b) {
	return Date.parse(a.createdDateTime ?? "") - Date.parse(b.createdDateTime ?? "") || (a.id ?? "").localeCompare(b.id ?? "");
}
/**
* Strip HTML tags from Teams message content, preserving @mention display names.
* Teams wraps mentions in <at>Name</at> tags.
*/
function stripHtmlFromTeamsMessage(html) {
	return require_resolve_allowlist.htmlToPlainText(html.replace(/<at[^>]*>(.*?)<\/at>/gi, "@$1"));
}
/**
* Fetch a single channel message (the parent/root of a thread).
* Returns undefined on error so callers can degrade gracefully.
*/
async function fetchChannelMessage(token, groupId, channelId, messageId, deadline) {
	const path = `/teams/${encodeURIComponent(groupId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}`;
	try {
		return await require_resolve_allowlist.fetchGraphJson({
			token,
			path,
			...deadline ? { deadline } : {}
		});
	} catch {
		return;
	}
}
/**
* Fetch a single chat message's full text via Graph and return plain text.
*
* Used to recover the complete quoted message for Teams quote replies: the
* inbound blockquote only carries a Teams-truncated `preview` snippet. The
* app-only `GET /chats/{chatId}/messages/{messageId}` endpoint IS permitted
* with the `Chat.Read.All` application permission.
*
* Returns undefined on any failure so callers degrade to the truncated preview.
*/
async function fetchChatMessageText(token, chatId, messageId, deadline) {
	const path = `/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`;
	try {
		const msg = await require_resolve_allowlist.fetchGraphJson({
			token,
			path,
			...deadline ? { deadline } : {}
		});
		const raw = msg.body?.content ?? "";
		return (msg.body?.contentType === "html" ? stripHtmlFromTeamsMessage(raw) : raw.trim()) || void 0;
	} catch {
		return;
	}
}
/**
* Fetch thread replies for a channel message, ordered chronologically.
*
* Graph caps each replies page at 50 and does not support `$orderby`. Follow
* `@odata.nextLink`, then return the newest bounded window in chronological order.
*/
async function fetchThreadReplies(token, groupId, channelId, messageId, deadline) {
	const path = `/teams/${encodeURIComponent(groupId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}/replies?$top=50`;
	const { items, truncated } = await require_resolve_allowlist.fetchAllGraphPages({
		token,
		path,
		maxPages: MAX_REPLY_PAGES,
		...deadline ? { deadline } : {}
	});
	if (truncated) throw new Error("MS Teams thread replies pagination did not reach the newest replies");
	if (items.length <= 50) return items;
	if (!items.every((item) => Number.isFinite(Date.parse(item.createdDateTime ?? "")))) throw new Error("MS Teams thread replies have incomplete timestamps");
	return items.toSorted(compareThreadMessagesChronologically).slice(-50);
}
function buildThreadContext(messages, currentMessageId) {
	const context = [];
	for (const msg of messages) {
		if (msg.id && msg.id === currentMessageId) continue;
		const sender = msg.from?.user?.displayName ?? msg.from?.application?.displayName ?? "unknown";
		const contentType = msg.body?.contentType ?? "text";
		const rawContent = msg.body?.content ?? "";
		const content = contentType === "html" ? stripHtmlFromTeamsMessage(rawContent) : rawContent.trim();
		if (!content) continue;
		context.push({
			message_id: msg.id,
			sender,
			body: content
		});
	}
	return context;
}
//#endregion
//#region extensions/msteams/src/reaction-types.ts
const TEAMS_REACTION_EMOJI = {
	like: "👍",
	heart: "❤️",
	laugh: "😆",
	surprised: "😮",
	sad: "😢",
	angry: "😡"
};
const TEAMS_REACTION_TYPES = Object.keys(TEAMS_REACTION_EMOJI);
function getMSTeamsReactionEmoji(raw) {
	const key = raw.trim().toLowerCase();
	return Object.hasOwn(TEAMS_REACTION_EMOJI, key) ? TEAMS_REACTION_EMOJI[key] : void 0;
}
function resolveMSTeamsReactionEmoji(raw) {
	const normalized = raw.trim();
	if (!normalized) throw new Error(`Reaction type is required. Common types: ${TEAMS_REACTION_TYPES.join(", ")}`);
	return getMSTeamsReactionEmoji(normalized) ?? normalized;
}
//#endregion
Object.defineProperty(exports, "buildThreadContext", {
	enumerable: true,
	get: function() {
		return buildThreadContext;
	}
});
Object.defineProperty(exports, "fetchChannelMessage", {
	enumerable: true,
	get: function() {
		return fetchChannelMessage;
	}
});
Object.defineProperty(exports, "fetchChatMessageText", {
	enumerable: true,
	get: function() {
		return fetchChatMessageText;
	}
});
Object.defineProperty(exports, "fetchThreadReplies", {
	enumerable: true,
	get: function() {
		return fetchThreadReplies;
	}
});
Object.defineProperty(exports, "getMSTeamsReactionEmoji", {
	enumerable: true,
	get: function() {
		return getMSTeamsReactionEmoji;
	}
});
Object.defineProperty(exports, "resolveMSTeamsReactionEmoji", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsReactionEmoji;
	}
});
Object.defineProperty(exports, "stripHtmlFromTeamsMessage", {
	enumerable: true,
	get: function() {
		return stripHtmlFromTeamsMessage;
	}
});
