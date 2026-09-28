import { l as stripSilentToken, n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-BTKQYTUd.mjs";
//#region src/gateway/control-reply-text.ts
const SUPPRESSED_CONTROL_REPLY_TOKENS = [
	SILENT_REPLY_TOKEN,
	"ANNOUNCE_SKIP",
	"REPLY_SKIP"
];
const POSSIBLE_CONTROL_REPLY_START = new RegExp(`^(?:[\\s\\p{P}]{64}|[\\s\\p{P}]{0,63}(?:${SUPPRESSED_CONTROL_REPLY_TOKENS.join("|")}))`, "iu");
const CONTROL_REPLY_SEQUENCE_PREFIX = new RegExp(`^(?:(?:${SUPPRESSED_CONTROL_REPLY_TOKENS.join("|")})\\s+)+([A-Z_]+)$`, "i");
/**
* Recognize control-only replies, including a repeated marker's unfinished tail.
*/
function isSuppressedControlReplyText(text) {
	if (!POSSIBLE_CONTROL_REPLY_START.test(text)) return false;
	const normalized = text.trim();
	const repeatedFragment = CONTROL_REPLY_SEQUENCE_PREFIX.exec(normalized)?.[1]?.toUpperCase();
	return SUPPRESSED_CONTROL_REPLY_TOKENS.some((token) => isSilentReplyText(normalized, token) || repeatedFragment !== void 0 && token.startsWith(repeatedFragment));
}
/** Remove internal control tokens when a model appends one to visible reply text. */
function stripSuppressedControlReplyToken(text) {
	if (isSuppressedControlReplyText(text)) return "";
	let stripped = text;
	for (const token of SUPPRESSED_CONTROL_REPLY_TOKENS) {
		const next = stripSilentToken(stripped, token);
		if (next !== stripped.trim()) stripped = next;
	}
	return stripped;
}
/**
* Return true when streamed assistant text looks like the leading fragment of a control token.
*/
function isSuppressedControlReplyLeadFragment(text) {
	const trimmed = text.trim();
	return SUPPRESSED_CONTROL_REPLY_TOKENS.some((token) => {
		let fragment = trimmed;
		while (fragment.length > token.length && fragment.slice(0, token.length).toUpperCase() === token && /\s/.test(fragment.charAt(token.length))) fragment = fragment.slice(token.length).trimStart();
		return fragment.length > 0 && fragment.length < token.length && token.startsWith(fragment.toUpperCase());
	});
}
//#endregion
export { isSuppressedControlReplyText as n, stripSuppressedControlReplyToken as r, isSuppressedControlReplyLeadFragment as t };
