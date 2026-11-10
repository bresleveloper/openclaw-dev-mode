import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/channels/plugins/message-action-names.ts
/**
* Deliberately closed, core-owned vocabulary so every transport can render every action.
* Plugins add names through a core PR; runtime registration is intentionally unsupported.
*/
const CHANNEL_MESSAGE_ACTION_NAMES = [
	"send",
	"broadcast",
	"poll",
	"poll-vote",
	"react",
	"reactions",
	"read",
	"edit",
	"unsend",
	"reply",
	"sendWithEffect",
	"renameGroup",
	"setGroupIcon",
	"addParticipant",
	"removeParticipant",
	"leaveGroup",
	"sendAttachment",
	"delete",
	"pin",
	"unpin",
	"list-pins",
	"permissions",
	"thread-create",
	"thread-list",
	"thread-reply",
	"search",
	"sticker",
	"sticker-search",
	"member-info",
	"role-info",
	"emoji-list",
	"emoji-upload",
	"sticker-upload",
	"role-add",
	"role-remove",
	"channel-info",
	"channel-list",
	"channel-create",
	"conversation-open",
	"channel-edit",
	"channel-delete",
	"channel-move",
	"category-create",
	"category-edit",
	"category-delete",
	"topic-create",
	"topic-edit",
	"voice-status",
	"event-list",
	"event-create",
	"timeout",
	"kick",
	"ban",
	"set-profile",
	"set-presence",
	"download-file",
	"upload-file"
];
const MESSAGE_TOOL_SEND_ACTIONS = /* @__PURE__ */ new Set([
	"send",
	"thread-reply",
	"sendWithEffect",
	"sendAttachment",
	"upload-file"
]);
/** Return true when a message action sends or uploads user-visible content. */
function isMessageToolSendActionName(action) {
	const normalized = normalizeOptionalString(action) ?? "";
	return MESSAGE_TOOL_SEND_ACTIONS.has(normalized);
}
//#endregion
export { isMessageToolSendActionName as n, CHANNEL_MESSAGE_ACTION_NAMES as t };
