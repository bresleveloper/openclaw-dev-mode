const require_resolve_allowlist = require("./resolve-allowlist-CHzaaWiC.cjs");
let openclaw_plugin_sdk_html_entity_runtime = require("openclaw/plugin-sdk/html-entity-runtime");
//#region extensions/msteams/src/graph-thread.ts
/**
* Strip HTML tags from Teams message content, preserving @mention display names.
* Teams wraps mentions in <at>Name</at> tags.
*/
function stripHtmlFromTeamsMessage(html) {
	let text = html.replace(/<at[^>]*>(.*?)<\/at>/gi, "@$1");
	text = text.replace(/<[^>]*>/g, " ");
	text = (0, openclaw_plugin_sdk_html_entity_runtime.decodeHtmlEntities)(text).replaceAll("\xA0", " ");
	return text.replace(/\s+/g, " ").trim();
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
* **Limitation:** The Graph API replies endpoint (`/messages/{id}/replies`) does not
* support `$orderby`, so results are always returned in ascending (oldest-first) order.
* Combined with the `$top` cap of 50, this means only the **oldest 50 replies** are
* returned for long threads — newer replies are silently omitted. There is currently no
* Graph API workaround for this; pagination via `@odata.nextLink` can retrieve more
* replies but still in ascending order only.
*/
async function fetchThreadReplies(token, groupId, channelId, messageId, limit = 50, deadline) {
	const path = `/teams/${encodeURIComponent(groupId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}/replies?$top=${Math.min(Math.max(limit, 1), 50)}`;
	return (await require_resolve_allowlist.fetchGraphJson({
		token,
		path,
		...deadline ? { deadline } : {}
	})).value ?? [];
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
