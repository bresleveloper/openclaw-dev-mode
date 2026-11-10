import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
//#region src/channels/conversation-label.ts
function extractConversationId(from) {
	const trimmed = normalizeOptionalString(from);
	if (!trimmed) return;
	const parts = trimmed.split(":").filter(Boolean);
	return parts.length > 0 ? parts[parts.length - 1] : trimmed;
}
function shouldAppendId(id) {
	return /^[0-9]+$/.test(id) || /^[^\s:@]+@[^\s:@]+$/.test(id);
}
function resolveConversationLabel(ctx) {
	const explicit = normalizeOptionalString(ctx.ConversationLabel);
	if (explicit) return explicit;
	const threadLabel = normalizeOptionalString(ctx.ThreadLabel);
	if (threadLabel) return threadLabel;
	if (normalizeChatType(ctx.ChatType) === "direct") return normalizeOptionalString(ctx.SenderName) ?? normalizeOptionalString(ctx.From);
	const base = normalizeOptionalString(ctx.GroupChannel) || normalizeOptionalString(ctx.GroupSubject) || normalizeOptionalString(ctx.GroupSpace) || normalizeOptionalString(ctx.From) || "";
	if (!base) return;
	const id = extractConversationId(ctx.From);
	if (!id || !shouldAppendId(id) || base.includes(id) || normalizeLowercaseStringOrEmpty(base).includes(" id:") || base.startsWith("#") || base.startsWith("@")) return base;
	return `${base} id:${id}`;
}
//#endregion
export { resolveConversationLabel as t };
