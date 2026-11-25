import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
// extensions/imessage/src/chat-context.ts
const EMAIL_HANDLE_PATTERN = /^[^\s@]+@[^\s@]+$/u;
function parseDirectChatIdentity(raw) {
	const trimmed = raw.trim();
	const parts = trimmed.split(";");
	if (parts.length === 3 && parts[1] === "-" && parts[2]) {
		const service = parts[0]?.toLowerCase();
		if (service === "imessage" || service === "sms" || service === "any") {
			const identifier = parts[2];
			return {
				service,
				identifier: EMAIL_HANDLE_PATTERN.test(identifier) ? identifier.toLowerCase() : identifier
			};
		}
	}
	if (parts.length !== 1) return;
	if (trimmed.startsWith("+") || EMAIL_HANDLE_PATTERN.test(trimmed)) return { identifier: trimmed.toLowerCase() };
}
function resolveIMessageDirectChatService(configuredService, chatGuid) {
	if (configuredService === "imessage" || configuredService === "sms") return configuredService;
	const observedService = chatGuid ? parseDirectChatIdentity(chatGuid)?.service : void 0;
	return observedService === "imessage" || observedService === "sms" ? observedService : void 0;
}
function isIMessageEmailChatIdentifier(raw) {
	const identity = parseDirectChatIdentity(raw);
	return Boolean(identity && EMAIL_HANDLE_PATTERN.test(identity.identifier));
}
/**
* Strip the `iMessage;-;` / `SMS;-;` / `any;-;` service prefix that Messages
* uses for direct chats. Different layers report direct DMs in different
* forms, so raw comparison would falsely treat one DM as different chats.
*/
function normalizeDirectChatIdentifier(raw) {
	const trimmed = raw.trim();
	return parseDirectChatIdentity(trimmed)?.identifier ?? trimmed;
}
function chatContextFromIMessageTarget(target, effectiveService) {
	if (target.kind === "chat_id") return { chatId: target.chatId };
	if (target.kind === "chat_guid") return { chatGuid: target.chatGuid };
	if (target.kind === "chat_identifier") return { chatIdentifier: target.chatIdentifier };
	const trimmedHandle = target.to.trim();
	const canonicalHandle = trimmedHandle.startsWith("+") ? normalizeE164(trimmedHandle) : EMAIL_HANDLE_PATTERN.test(trimmedHandle) ? trimmedHandle.toLowerCase() : void 0;
	if (!canonicalHandle) return {};
	const service = target.service === "auto" ? effectiveService : target.service;
	if (service !== "imessage" && service !== "sms") return {};
	return { chatIdentifier: `${service === "sms" ? "SMS" : "iMessage"};-;${canonicalHandle}` };
}
function compareOptional(left, right) {
	return left === void 0 || right === void 0 ? void 0 : left === right;
}
function compareChatSelector(cachedRaw, currentRaw, crossKind = false) {
	const cached = normalizeOptionalString(cachedRaw);
	const current = normalizeOptionalString(currentRaw);
	if (!cached || !current) return;
	if (cached === current) return true;
	const cachedDirect = parseDirectChatIdentity(cached);
	const currentDirect = parseDirectChatIdentity(current);
	if (!cachedDirect || !currentDirect) return crossKind ? void 0 : false;
	if (cachedDirect.identifier !== currentDirect.identifier) return false;
	if (cachedDirect.service === "any") return true;
	if (!cachedDirect.service || !currentDirect.service) return;
	return cachedDirect.service === currentDirect.service;
}
function resolveIMessageChatMatch(cached, current) {
	const comparisons = [
		compareChatSelector(cached.chatGuid, current.chatGuid),
		compareChatSelector(cached.chatIdentifier, current.chatIdentifier),
		compareOptional(cached.chatId, current.chatId),
		compareChatSelector(cached.chatGuid, current.chatIdentifier, true),
		compareChatSelector(cached.chatIdentifier, current.chatGuid, true)
	].filter((comparison) => comparison !== void 0);
	if (comparisons.length === 0) return "unknown";
	return comparisons.every(Boolean) ? "match" : "mismatch";
}
export { resolveIMessageDirectChatService as a, resolveIMessageChatMatch as i, isIMessageEmailChatIdentifier as n, normalizeDirectChatIdentifier as r, chatContextFromIMessageTarget as t };
