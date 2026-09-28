import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/slack/src/thread-ts.ts
const SLACK_THREAD_TS_PATTERN = /^\d+\.\d+$/;
function resolveSlackReplyThreadTs(params) {
	const replyToId = params.replyToMode === "off" ? void 0 : params.replyToId;
	return params.replyToCurrent || params.replyToIsExplicit === false ? params.threadId ?? replyToId : replyToId ?? params.threadId;
}
function normalizeSlackThreadTsCandidate(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeOptionalString(value);
	return normalized && SLACK_THREAD_TS_PATTERN.test(normalized) ? normalized : void 0;
}
function resolveSlackThreadTsValue(params) {
	return normalizeSlackThreadTsCandidate(params.replyToId) ?? normalizeSlackThreadTsCandidate(params.threadId);
}
//#endregion
export { resolveSlackReplyThreadTs as n, resolveSlackThreadTsValue as r, normalizeSlackThreadTsCandidate as t };
