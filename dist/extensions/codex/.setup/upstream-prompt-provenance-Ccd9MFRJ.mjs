import { asOptionalRecord, readNonEmptyStringPreservingWhitespace } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/upstream-prompt-provenance.ts
const UPSTREAM_USER_TEXT_META_KEY = "upstreamUserText";
const MIRROR_IDENTITY_META_KEY = "mirrorIdentity";
const CODEX_META_KEY = "__openclaw";
function readCodexMeta(message) {
	return message && CODEX_META_KEY in message ? asOptionalRecord(message[CODEX_META_KEY]) : void 0;
}
const ASSISTANT_ITEM_IDS = Symbol("codexAssistantItemIds");
/** Follow snapshot copies without adding provider identities to durable messages. */
function attachCodexAssistantItemIds(message, itemIds) {
	return {
		...message,
		[ASSISTANT_ITEM_IDS]: itemIds
	};
}
function takeCodexAssistantItemIds(message) {
	const itemIds = message[ASSISTANT_ITEM_IDS];
	delete message[ASSISTANT_ITEM_IDS];
	return itemIds;
}
function attachCodexMeta(message, key, value) {
	return {
		...message,
		__openclaw: {
			...readCodexMeta(message),
			[key]: value
		}
	};
}
function attachCodexMirrorIdentity(message, identity) {
	return attachCodexMeta(message, MIRROR_IDENTITY_META_KEY, identity);
}
function readMirrorIdentity(message) {
	return readNonEmptyStringPreservingWhitespace(readCodexMeta(message)?.[MIRROR_IDENTITY_META_KEY]);
}
function attachUpstreamUserText(message, text) {
	return attachCodexMeta(message, UPSTREAM_USER_TEXT_META_KEY, text);
}
function readUpstreamUserText(message) {
	return readNonEmptyStringPreservingWhitespace(readCodexMeta(message)?.[UPSTREAM_USER_TEXT_META_KEY]);
}
//#endregion
export { readUpstreamUserText as a, readMirrorIdentity as i, attachCodexMirrorIdentity as n, takeCodexAssistantItemIds as o, attachUpstreamUserText as r, attachCodexAssistantItemIds as t };
