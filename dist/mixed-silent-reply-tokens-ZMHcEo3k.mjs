import { c as stripLeadingSilentToken, l as stripSilentToken, n as SILENT_REPLY_TOKEN, s as startsWithSilentToken } from "./tokens-DHFPcfdZ.mjs";
//#region src/auto-reply/reply/mixed-silent-reply-tokens.ts
/** Returns null when mixed-content text has no silent token to normalize. */
function stripMixedSilentReplyTokens(text, token = SILENT_REPLY_TOKEN) {
	const hasLeadingToken = startsWithSilentToken(text, token);
	const remainder = hasLeadingToken ? stripLeadingSilentToken(text, token) : text;
	return hasLeadingToken || remainder.toLowerCase().includes(token.toLowerCase()) ? stripSilentToken(remainder, token) : null;
}
//#endregion
export { stripMixedSilentReplyTokens as t };
