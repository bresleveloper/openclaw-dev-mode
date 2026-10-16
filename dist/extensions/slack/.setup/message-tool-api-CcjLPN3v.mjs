import { i as listSlackAccountIds } from "./accounts-CDgkV7Cm.mjs";
import { t as inspectSlackAccount } from "./account-inspect-Cs-7DXXW.mjs";
import { r as resolveSlackThreadTsValue, t as normalizeSlackThreadTsCandidate } from "./thread-ts-Cvt7WD6B.mjs";
import { createActionGate } from "openclaw/plugin-sdk/channel-actions";
import { extractToolSend } from "openclaw/plugin-sdk/tool-send";
import { Type } from "typebox";
//#region extensions/slack/src/message-actions.ts
function listSlackMessageActions(cfg, accountId) {
	const accounts = (accountId ? [inspectSlackAccount({
		cfg,
		accountId
	})] : listSlackAccountIds(cfg).map((listedAccountId) => inspectSlackAccount({
		cfg,
		accountId: listedAccountId
	}))).filter((account) => account.enabled && (account.identity === "user" ? account.userTokenStatus === "available" : account.botTokenStatus === "available"));
	if (accounts.length === 0) return [];
	const gates = accounts.map((account) => createActionGate(account.actions ?? cfg.channels?.slack?.actions));
	const actions = ["send"];
	for (const [gate, enabledActions] of [
		["reactions", ["react", "reactions"]],
		["messages", [
			"conversation-open",
			"read",
			"edit",
			"delete",
			"download-file",
			"upload-file"
		]],
		["pins", [
			"pin",
			"unpin",
			"list-pins"
		]],
		["memberInfo", ["member-info"]],
		["emojiList", ["emoji-list"]]
	]) if (gates.some((isEnabled) => isEnabled(gate))) actions.push(...enabledActions);
	return actions;
}
function extractSlackToolSend(args) {
	const action = args.action;
	if (action !== "sendMessage" && action !== "uploadFile" && action !== "send" && action !== "upload-file") return null;
	const extracted = extractToolSend(args, action);
	if (!extracted) return null;
	const nativeThreadTs = typeof args.threadTs === "string" ? normalizeSlackThreadTsCandidate(args.threadTs) : void 0;
	const replyTo = typeof args.replyTo === "string" ? normalizeSlackThreadTsCandidate(args.replyTo) : void 0;
	const threadTs = action === "send" ? resolveSlackThreadTsValue({
		replyToId: replyTo,
		threadId: extracted.threadId
	}) : action === "upload-file" ? normalizeSlackThreadTsCandidate(extracted.threadId) ?? replyTo : nativeThreadTs ?? normalizeSlackThreadTsCandidate(extracted.threadId);
	const threadSuppressed = extracted.threadSuppressed === true || args.topLevel === true || args.threadTs === null;
	return {
		...extracted,
		threadId: threadTs ?? extracted.threadId,
		...!threadTs && !extracted.threadId && !threadSuppressed ? { threadImplicit: true } : {},
		...threadSuppressed ? { threadSuppressed: true } : {}
	};
}
//#endregion
//#region extensions/slack/src/message-tool-api.ts
const SLACK_MESSAGE_ID_ACTIONS = [
	"react",
	"reactions",
	"edit",
	"delete",
	"pin",
	"unpin"
];
function createSlackFileActionSchema() {
	return { fileId: Type.Optional(Type.String({ description: "Slack file id, starting with \"F\" (for example F0B0LTT8M36). Required for action=\"download-file\". Read it from inbound Slack file metadata at event.files[].id. This is not the Slack message timestamp/messageId." })) };
}
function createSlackReactionEmojiSchema(emojiListAvailable) {
	const discoveryHint = emojiListAvailable ? " Discover workspace custom emoji with action:\"emoji-list\"." : "";
	return { emoji: Type.Optional(Type.String({ description: "Slack standard or workspace custom emoji shortcode (for example \"white_check_mark\" or \"+1\") or common emoji character (for example \"✅\"). Colons are optional." + discoveryHint })) };
}
function createSlackForcedMediaSchema() {
	const description = "Preserve original image bytes without image optimization. Slack still uploads a regular file; this does not convert it into a Slack document.";
	return {
		forceDocument: Type.Optional(Type.Boolean({ description })),
		asDocument: Type.Optional(Type.Boolean({ description: `Alias for forceDocument. ${description}` }))
	};
}
function createSlackMessageIdActionSchema() {
	const description = "Slack message timestamp/message id (for example \"1777423717.666499\"). Used by react, reactions, edit, delete, pin, and unpin actions. React defaults to the current inbound message when available. Not used by download-file, which requires fileId from event.files[].id.";
	return {
		messageId: Type.Optional(Type.String({ description })),
		message_id: Type.Optional(Type.String({ description: `${description} Alias for messageId.` }))
	};
}
function createSlackSendActionSchema() {
	return {
		...createSlackForcedMediaSchema(),
		topLevel: Type.Optional(Type.Boolean({ description: "Slack-only opt-out for action=\"send\" from a threaded same-channel context. Set true to post a new parent-channel message instead of inheriting the current Slack thread. `threadId: null` is accepted as the same top-level request." })),
		replyBroadcast: Type.Optional(Type.Boolean({ description: "Slack-only opt-in for action=\"send\" thread replies. Set true with threadId or replyTo on text/block sends to also broadcast the reply to the parent channel. Not supported for media or upload-file." }))
	};
}
function createSlackTopLevelActionSchema() {
	return {
		...createSlackForcedMediaSchema(),
		topLevel: Type.Optional(Type.Boolean({ description: "Slack-only opt-out from threaded same-channel context. Set true to post at the channel root instead of inheriting the current Slack thread." }))
	};
}
function describeSlackMessageTool({ cfg, accountId }) {
	const actions = listSlackMessageActions(cfg, accountId);
	const schema = [];
	if (actions.includes("conversation-open")) schema.push({
		actions: ["conversation-open"],
		visibility: "all-configured",
		properties: { userIds: Type.Optional(Type.Array(Type.String({ pattern: "^[UW][A-Z0-9]+$" }), {
			minItems: 1,
			maxItems: 8,
			uniqueItems: true,
			description: "Slack conversation-open: 1-8 other member IDs. One opens a DM; multiple open or reuse a group DM. Exclude the calling account. Use the returned target with action=\"send\". teamId defaults to the trusted current workspace for the selected account; detached Enterprise operations require it."
		})) }
	});
	for (const [action, createProperties] of [
		["download-file", createSlackFileActionSchema],
		["send", createSlackSendActionSchema],
		["upload-file", createSlackTopLevelActionSchema],
		["react", () => createSlackReactionEmojiSchema(actions.includes("emoji-list"))]
	]) if (actions.includes(action)) schema.push({
		properties: createProperties(),
		actions: action === "react" ? ["react", "reactions"] : [action]
	});
	const messageIdActions = SLACK_MESSAGE_ID_ACTIONS.filter((action) => actions.includes(action));
	if (messageIdActions.length > 0) schema.push({
		properties: createSlackMessageIdActionSchema(),
		actions: messageIdActions
	});
	return {
		actions,
		capabilities: actions.includes("send") ? ["presentation"] : [],
		schema: schema.length > 0 ? schema : null
	};
}
//#endregion
export { extractSlackToolSend as n, listSlackMessageActions as r, describeSlackMessageTool as t };
