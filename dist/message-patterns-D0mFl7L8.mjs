import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
//#region src/agents/failover/message-patterns.ts
const STATED_TOKEN_SIZES_RE = /(?:\btpm\b|tokens per minute)[^.\n]*?\blimit\s+([\d,]+)[^.\n]*?\brequested\s+([\d,]+)/i;
function readStatedTokenCount(digits) {
	const parsed = Number(digits?.replaceAll(",", ""));
	return Number.isFinite(parsed) && parsed > 0 ? parsed : void 0;
}
function isProviderRequestSizeCeilingError(errorMessage) {
	if (!errorMessage) return false;
	const stated = STATED_TOKEN_SIZES_RE.exec(errorMessage);
	const limit = readStatedTokenCount(stated?.[1]);
	const requested = readStatedTokenCount(stated?.[2]);
	return limit !== void 0 && requested !== void 0 && requested > limit;
}
const INCOMPLETE_ASSISTANT_STREAM_RE = /^(?:[\w -]*stream ended (?:before (?:message_?stop|(?:a )?terminal (?:finish reason|response event|event))|without (?:a terminal )?finish[_ ]reason)|Responses stream ended with unresolved tool calls)[.!]?$/i;
const TERMINATED_TRANSPORT_MESSAGE_RE = /^terminated$/i;
const PRE_DISPATCH_TOOL_CALL_REJECTION_MESSAGES = /* @__PURE__ */ new Set([
	"Provider completed tool call with malformed JSON arguments",
	"Provider completed stream with an incomplete tool call",
	"Provider returned an incomplete or malformed tool call",
	"Mistral completed tool call has invalid JSON arguments",
	"Responses stream completed tool call with invalid JSON arguments"
]);
function isPreDispatchToolCallRejectionMessage(errorMessage) {
	return errorMessage !== void 0 && PRE_DISPATCH_TOOL_CALL_REJECTION_MESSAGES.has(errorMessage);
}
const PERIODIC_USAGE_LIMIT_RE = /\b(?:daily|weekly|monthly)(?:\/(?:daily|weekly|monthly))* (?:usage )?limit(?:s)?(?: (?:exhausted|reached|exceeded))?\b/i;
const HIGH_CONFIDENCE_AUTH_PERMANENT_PATTERNS = [
	/api[_ ]?key[_ ]?(?:revoked|deactivated|deleted)/i,
	/deactivated[_ ]workspace/i,
	"key has been disabled",
	"key has been revoked",
	"account has been deactivated",
	"not allowed for this organization"
];
const AMBIGUOUS_AUTH_ERROR_PATTERNS = [
	/(?:invalid[_ ]?api[_ ]?key(?![a-z0-9])|api[_ ]?key(?:[_ ]?(?:is[_ ]?)?(?:invalid(?![a-z0-9])|not[_ ]?valid(?![a-z0-9]))))/i,
	/could not (?:authenticate|validate).*(?:api[_ ]?key|credentials)/i,
	"permission_error"
];
const COMMON_AUTH_ERROR_PATTERNS = [
	"incorrect api key",
	"invalid token",
	"authentication",
	"re-authenticate",
	"oauth token refresh failed",
	"unauthorized",
	"forbidden",
	"access denied",
	"insufficient permissions",
	"insufficient permission",
	/missing scopes?:/i,
	"expired",
	/\b401\b/,
	/\b403\b/,
	"no credentials found",
	"no api key found",
	/\bfailed to (?:extract|parse|validate|decode)\b.*\btoken\b/
];
const CJK_AUTH_ERROR_PATTERNS = [
	"无权访问",
	"认证失败",
	"鉴权失败",
	"密钥无效",
	"apikey 无效",
	/(?:当前\s*ak|ce-011).*?(?:违规请求|禁止访问)|(?:违规请求|禁止访问).*?(?:当前\s*ak|ce-011)/i,
	/\bce-011\b/i
];
const ZAI_BILLING_CODE_1311_RE = /"code"\s*:\s*1311\b/;
const ZAI_AUTH_CODE_1113_RE = /"code"\s*:\s*1113\b/;
const VOLCENGINE_INVALID_SUBSCRIPTION_RE = /"code"\s*:\s*"InvalidSubscription"/i;
const STATUS_INTERNAL_SERVER_ERROR_RE = /\bstatus:\s*internal server error\b/i;
const STATUS_INTERNAL_SERVER_ERROR_WITH_500_RE = /^(?=[\s\S]*\bstatus:\s*internal server error\b)(?=[\s\S]*\bcode["']?\s*[:=]\s*500\b)/i;
const HTTP_5XX_STATUS_RE = /\bHTTP\s+5\d\d\b/i;
const ERROR_PATTERNS = {
	rateLimit: [
		/rate[_ ]limit|too many requests/i,
		/^\s*429\b|\b(?:https?|status(?:[ _-]?code)?|response(?:[ _-]?code)?|http(?:[ _-]?status)?)\b[\s:=#"'(]{0,6}429\b|["'](?:status|code)["']\s*:\s*429\b|\b429\b[\s:)\].,-]*(?:rate[_ -]?limit(?:ed|ing)?|too many requests|resource has been exhausted|quota(?:\s+(?:exceeded|exhausted|depleted|reached))?)\b/i,
		/too many (?:concurrent )?requests/i,
		/\bthrottl(?:ing[_]?exception|ing|ed)\b/i,
		/\bconcurrency limit\b.*\b(?:breached|reached)\b/i,
		"model_cooldown",
		"exceeded your current quota",
		/\bresource[_ -]?exhausted\b/i,
		/\bquota[_ -]?exceeded\b/i,
		"usage limit",
		/\btpm\b/i,
		"tokens per minute",
		"tokens per day",
		"请求过于频繁",
		"调用频率",
		"频率限制",
		"配额不足",
		"配额已用尽",
		"额度不足",
		"额度已用尽"
	],
	overloaded: [
		"overloaded",
		/\b(?:selected\s+)?model\s+(?:is\s+)?at capacity\b/i,
		/\bservice(?:[_ ]temporarily)?[_ ]unavailable\b/i,
		"high demand",
		"high load",
		"服务过载",
		"当前负载过高",
		"访问量过大"
	],
	serverError: [
		"an error occurred while processing",
		"internal server error",
		"internal_error",
		"server_error",
		"bad gateway",
		"gateway timeout",
		"upstream error",
		"upstream connect error",
		"connection reset",
		"内部错误",
		"服务器错误",
		"系统错误",
		"系统繁忙",
		"系统异常"
	],
	timeout: [
		"timeout",
		"timed out",
		"deadline exceeded",
		/^(?=[\s\S]*\bgot status:\s*internal\b)(?=[\s\S]*\bcode["']?\s*[:=]\s*500\b)/i,
		/^(?=[\s\S]*["']status["']\s*:\s*["']internal["'])(?=[\s\S]*["']code["']\s*:\s*500\b)/i,
		"connection error",
		"network error",
		"network request failed",
		"fetch failed",
		"socket hang up",
		/^stream disconnected before completion(?::[\s\S]*)?$/i,
		/^premature close of server response while trying to fetch\b/i,
		INCOMPLETE_ASSISTANT_STREAM_RE,
		"网络错误",
		"网络异常",
		"服务暂时不可用",
		"服务繁忙",
		"请求超时",
		"连接超时",
		"连接错误",
		/\b(?:econn(?:refused|reset|aborted)|enet(?:unreach|reset)|ehost(?:unreach|down)|e(?:socket)?timedout|epipe|enotfound|eai_again)\b/i,
		/without sending (?:any )?chunks?/i,
		/\breason:\s*(?:abort|malformed_response|network_error)\b/i,
		/\bfinish_reason:\s*(?:abort|malformed_response|network_error)\b/i,
		/\boperation was aborted\b/i,
		/\bstream (?:was )?(?:closed|aborted)\b/i,
		TERMINATED_TRANSPORT_MESSAGE_RE,
		/^stream_read_error$/i,
		/\bund_err_(?:socket|connect|headers?|body|req_content_length_mismatch|aborted|closed)\b/i,
		/^request failed$/i,
		/\brequest failed after repeated internal retries\b/i,
		/^llm request failed\.$/i
	],
	billing: [
		/["']?(?:status|code)["']?\s*[:=]\s*402\b|\bhttp\s*402\b|\berror(?:\s+code)?\s*[:=]?\s*402\b|^\s*402\s+payment/i,
		/\b(?:got|returned|received)\s+(?:a\s+)?402\b(?!\s+records\b)/i,
		"payment required",
		"insufficient credits",
		/used\s+all\s+available\s+credits/i,
		/(?:monthly\s+)?spend(?:ing)?\s+limit/i,
		/insufficient[_ ]quota/i,
		/\b(?:go|free)usagelimiterror\b/i,
		"available balance",
		"out of budget",
		"credit balance",
		"plans & billing",
		/insufficient[_ ]balance/i,
		/\binsufficient\s+\w+\s+balance\b/i,
		"insufficient usd or diem balance",
		/requires?\s+more\s+credits/i,
		/out of extra usage/i,
		/draw from your extra usage/i,
		/extra usage is required(?: for long context requests)?/i,
		"余额不足",
		"欠费",
		VOLCENGINE_INVALID_SUBSCRIPTION_RE,
		/\bdoes not have a valid coding\s*plan subscription\b/i,
		ZAI_BILLING_CODE_1311_RE,
		/\bcurrent\s+subscription\s+plan\b.*\b(?:does\s+not|doesn't|not)\b.*\binclude\s+access\b/i,
		/\bmodel\b.*\bnot\s+available\b.*\bcurrent\s+plan\b/i
	],
	authPermanent: HIGH_CONFIDENCE_AUTH_PERMANENT_PATTERNS,
	auth: [
		...AMBIGUOUS_AUTH_ERROR_PATTERNS,
		...COMMON_AUTH_ERROR_PATTERNS,
		ZAI_AUTH_CODE_1113_RE,
		...CJK_AUTH_ERROR_PATTERNS
	],
	format: [
		"string should match pattern",
		"tool_use.id",
		"tool_use_id",
		"invalid request format",
		/tool call id was.*must be/i,
		"does not support assistant message prefill",
		"conversation must end with a user message",
		/agent harness .* does not support .*provider is not one of/i
	]
};
const BILLING_ERROR_HEAD_RE = /^(?:error[:\s-]+)?billing(?:\s+error)?(?:[:\s-]+|$)|^(?:error[:\s-]+)?(?:credit balance|insufficient credits?|payment required|http\s*402\b)/i;
function matchesErrorPatterns(raw, patterns) {
	if (!raw) return false;
	const value = normalizeLowercaseStringOrEmpty(raw);
	return patterns.some((pattern) => pattern instanceof RegExp ? pattern.test(value) : value.includes(pattern));
}
function matchesFormatErrorPattern(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.format);
}
function isSessionTranscriptValidationErrorMessage(raw) {
	return /\binvalid session transcript entry\b/i.test(raw);
}
function isRateLimitErrorMessage(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.rateLimit);
}
function isTimeoutErrorMessage(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.timeout);
}
const PROVIDER_COMPLETED_ERROR_FINISH_REASON_PATTERNS = [/\bfinish_reason:\s*error\b/i, /\breason:\s*error\b/i];
function isProviderCompletedErrorFinishReasonMessage(raw) {
	return matchesErrorPatterns(raw, PROVIDER_COMPLETED_ERROR_FINISH_REASON_PATTERNS);
}
function isPeriodicUsageLimitErrorMessage(raw) {
	return PERIODIC_USAGE_LIMIT_RE.test(raw);
}
function isBillingErrorMessage(raw) {
	const value = normalizeLowercaseStringOrEmpty(raw);
	if (!value) return false;
	if ([...raw.matchAll(/(?:^|\n)##\s+\S/g)].length > 1) return false;
	if (matchesErrorPatterns(value, ERROR_PATTERNS.billing)) return true;
	if (!BILLING_ERROR_HEAD_RE.test(raw)) return false;
	return value.includes("upgrade") || value.includes("credits") || value.includes("payment") || value.includes("purchase") || value.includes("subscription") || value.includes("plan");
}
function isAuthPermanentErrorMessage(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.authPermanent);
}
function isAuthErrorMessage(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.auth);
}
function isOverloadedErrorMessage(raw) {
	return matchesErrorPatterns(raw, ERROR_PATTERNS.overloaded);
}
function isServerErrorMessage(raw) {
	const value = normalizeLowercaseStringOrEmpty(raw);
	if (!value) return false;
	if (STATUS_INTERNAL_SERVER_ERROR_WITH_500_RE.test(value) || HTTP_5XX_STATUS_RE.test(value)) return true;
	const scrubbed = value.replace(STATUS_INTERNAL_SERVER_ERROR_RE, "").trim();
	if (scrubbed === "") return true;
	return matchesErrorPatterns(scrubbed, ERROR_PATTERNS.serverError);
}
//#endregion
export { isBillingErrorMessage as a, isPreDispatchToolCallRejectionMessage as c, isRateLimitErrorMessage as d, isServerErrorMessage as f, matchesFormatErrorPattern as h, isAuthPermanentErrorMessage as i, isProviderCompletedErrorFinishReasonMessage as l, isTimeoutErrorMessage as m, TERMINATED_TRANSPORT_MESSAGE_RE as n, isOverloadedErrorMessage as o, isSessionTranscriptValidationErrorMessage as p, isAuthErrorMessage as r, isPeriodicUsageLimitErrorMessage as s, INCOMPLETE_ASSISTANT_STREAM_RE as t, isProviderRequestSizeCeilingError as u };
