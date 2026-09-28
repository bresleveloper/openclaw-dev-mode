import { s as prepareClawRouterRequestModel } from "./provider-catalog-C5yAXEtH.mjs";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
//#region extensions/clawrouter/stream.ts
const ENV_API_KEY_MARKER = "CLAWROUTER_API_KEY";
const ATTRIBUTION_VALUE_MAX_LENGTH = 256;
const REQUEST_ID_MAX_LENGTH = 128;
const CLIENT_HEADER = "X-ClawRouter-Client";
const AGENT_HEADER = "X-ClawRouter-Agent-Id";
const SESSION_HEADER = "X-ClawRouter-Session-Id";
const REQUEST_ID_HEADER = "X-Request-ID";
const ID_HASH_LENGTH = 16;
const REQUEST_ID_PATTERN = /^[A-Za-z0-9._~:/+@=-]+$/u;
const REQUEST_ID_UNSAFE_CHARACTER_PATTERN = /[^A-Za-z0-9._~:/+@=-]/gu;
const ATTRIBUTION_PRINTABLE_ASCII_PATTERN = /^[\x20-\x7E]+$/u;
const ATTRIBUTION_NON_PRINTABLE_ASCII_PATTERN = /[^\x20-\x7E]/gu;
const ATTRIBUTION_ENCODED_SUFFIX_PATTERN = /~[a-f0-9]{16}$/u;
const REQUEST_ID_SUFFIX_PATTERN = /:model:\d+$/u;
const REQUEST_ID_ENCODED_SUFFIX_PATTERN = /~[a-f0-9]{16}(?::model:\d+)?$/u;
const ATTRIBUTION_ID_POLICY = {
	encodedSuffixPattern: ATTRIBUTION_ENCODED_SUFFIX_PATTERN,
	maxLength: ATTRIBUTION_VALUE_MAX_LENGTH,
	safePattern: ATTRIBUTION_PRINTABLE_ASCII_PATTERN,
	unsafeCharacterPattern: ATTRIBUTION_NON_PRINTABLE_ASCII_PATTERN
};
const REQUEST_ID_POLICY = {
	encodedSuffixPattern: REQUEST_ID_ENCODED_SUFFIX_PATTERN,
	maxLength: REQUEST_ID_MAX_LENGTH,
	safePattern: REQUEST_ID_PATTERN,
	unsafeCharacterPattern: REQUEST_ID_UNSAFE_CHARACTER_PATTERN,
	preservedSuffixPattern: REQUEST_ID_SUFFIX_PATTERN
};
function hasControlCharacter(value) {
	for (let index = 0; index < value.length; index += 1) {
		const code = value.charCodeAt(index);
		if (code <= 31 || code === 127) return true;
	}
	return false;
}
function normalizeHeaderId(value) {
	const normalized = value?.trim();
	if (!normalized || hasControlCharacter(normalized)) return;
	return normalized;
}
function sanitizeBoundedId(value, policy) {
	const normalized = normalizeHeaderId(value);
	if (!normalized) return;
	if (normalized.length <= policy.maxLength && policy.safePattern.test(normalized) && !policy.encodedSuffixPattern.test(normalized)) return normalized;
	const hash = createHash("sha256").update(Buffer.from(normalized, "utf16le")).digest("hex").slice(0, ID_HASH_LENGTH);
	const preservedSuffix = policy.preservedSuffixPattern?.exec(normalized)?.[0] ?? "";
	const safePrefix = (preservedSuffix ? normalized.slice(0, -preservedSuffix.length) : normalized).replace(policy.unsafeCharacterPattern, "_");
	const hashSuffix = `~${hash}`;
	const boundedSuffix = `${hashSuffix}${preservedSuffix}`;
	const suffix = boundedSuffix.length < policy.maxLength ? boundedSuffix : hashSuffix;
	return `${safePrefix.slice(0, policy.maxLength - suffix.length)}${suffix}`;
}
function findHeader(headers, target) {
	const normalizedTarget = target.toLowerCase();
	for (const [name, value] of Object.entries(headers)) if (name.toLowerCase() === normalizedTarget) return value;
}
function setHeaderDefault(headers, name, value) {
	if (value !== void 0 && findHeader(headers, name) === void 0) headers[name] = value;
}
function withClawRouterHeaders(headers, params) {
	const next = {};
	for (const [name, value] of Object.entries(headers ?? {})) if (name.toLowerCase() !== "authorization" || !params.apiKey) next[name] = value;
	setHeaderDefault(next, CLIENT_HEADER, "openclaw");
	setHeaderDefault(next, AGENT_HEADER, sanitizeBoundedId(params.agentId, ATTRIBUTION_ID_POLICY));
	setHeaderDefault(next, SESSION_HEADER, sanitizeBoundedId(params.sessionId, ATTRIBUTION_ID_POLICY));
	setHeaderDefault(next, REQUEST_ID_HEADER, sanitizeBoundedId(params.requestId, REQUEST_ID_POLICY));
	if (params.apiKey) next.Authorization = `Bearer ${params.apiKey}`;
	return next;
}
function createClawRouterStreamWrapper(ctx) {
	const underlying = ctx.streamFn;
	if (!underlying) return;
	return (model, context, options) => {
		const apiKey = options?.apiKey?.trim();
		const preparedModel = prepareClawRouterRequestModel(model);
		const hasExplicitRequestId = findHeader(options?.headers ?? {}, REQUEST_ID_HEADER) !== void 0;
		return underlying({
			...preparedModel,
			headers: withClawRouterHeaders(preparedModel.headers, {
				agentId: ctx.agentId,
				apiKey: apiKey && apiKey !== ENV_API_KEY_MARKER ? apiKey : void 0,
				requestId: hasExplicitRequestId ? void 0 : options?.requestId,
				sessionId: options?.sessionId
			})
		}, context, options);
	};
}
function wrapClawRouterProviderStream(ctx) {
	return createClawRouterStreamWrapper(ctx);
}
//#endregion
export { wrapClawRouterProviderStream as t };
