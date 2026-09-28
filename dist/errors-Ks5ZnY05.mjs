import { l as stringifyNonErrorCause } from "./error-coercion-C787aVxk.mjs";
import { a as HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN, c as HTTP_AUTH_SERIALIZED_QUOTE_PATTERN, i as HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN, n as HTTP_AUTH_HEADER_BOUNDARY_PATTERN, o as HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN, r as HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN, s as HTTP_AUTH_SCHEME_PATTERN, t as CREDENTIAL_STYLE_HEADER_REDACT_PATTERN, u as redactStructuredAuthHeaders } from "./structured-auth-redaction-OhcG53GS.mjs";
//#region packages/acp-core/src/error-format.ts
const STRUCTURED_AUTH_MARKER_PREFIX = ";__openclaw_structured_auth_redacted_";
const SECRET_PATTERNS = [
	/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g,
	/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g,
	/[?&](?:access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|api[-_]?key|client[-_]?secret|token|key|secret|password|pass|passwd|auth|signature|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)=([^&\s"'<>]+)/gi,
	/"(?:apiKey|token|secret|password|passwd|accessToken|refreshToken|cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token)"\s*:\s*"([^"]+)"/g,
	/(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
	/(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
	/--(?:api[-_]?key|hook[-_]?token|token|secret|password|passwd|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)\s+(["']?)([^\s"']+)\1/gi,
	new RegExp(String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`, "gi"),
	new RegExp(String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`, "gi"),
	new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`, "gi"),
	new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}${STRUCTURED_AUTH_MARKER_PREFIX})(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`, "gi"),
	new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`, "gi"),
	new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(?!${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}${STRUCTURED_AUTH_MARKER_PREFIX})(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`, "gi"),
	new RegExp(CREDENTIAL_STYLE_HEADER_REDACT_PATTERN, "gi"),
	/(?:X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token)\s*[:=]\s*([^\s"',;]+)/gi,
	/\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])/g,
	/(^|[\s,;])(?:access_token|refresh_token|auth[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|token|secret|password|passwd|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)=([^\s&#]+)/gi,
	/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----/g
];
let configuredRedactor;
function createStructuredAuthMarker(value) {
	const usedIds = /* @__PURE__ */ new Set();
	const maxIdDigits = String(value.length).length;
	let cursor = 0;
	for (;;) {
		const markerStart = value.indexOf(STRUCTURED_AUTH_MARKER_PREFIX, cursor);
		if (markerStart < 0) break;
		const idStart = markerStart + 37;
		let idEnd = idStart;
		while (idEnd - idStart <= maxIdDigits) {
			const char = value[idEnd];
			if (char === void 0 || char < "0" || char > "9") break;
			idEnd += 1;
		}
		if (idEnd > idStart && value[idEnd] === ";" && idEnd - idStart <= maxIdDigits) {
			const id = Number(value.slice(idStart, idEnd));
			if (id <= value.length) usedIds.add(id);
		}
		cursor = idStart;
	}
	let id = 0;
	while (usedIds.has(id)) id += 1;
	return `${STRUCTURED_AUTH_MARKER_PREFIX}${id};`;
}
/** Installs a host-provided redactor used before ACP fallback secret-pattern redaction. */
function configureAcpErrorRedactor(redactor) {
	configuredRedactor = redactor;
}
/** Redacts common HTTP, payment, assignment, and private-key secrets from error text. */
function redactSensitiveText(value) {
	const configured = configuredRedactor ? configuredRedactor(value) : value;
	const structuredAuthMarker = createStructuredAuthMarker(configured);
	let redacted = redactStructuredAuthHeaders(configured, structuredAuthMarker);
	for (const pattern of SECRET_PATTERNS) redacted = redacted.replace(pattern, (match, ...args) => {
		if (match.includes("PRIVATE KEY-----")) return "[REDACTED_PRIVATE_KEY]";
		const token = args.slice(0, -2).findLast((group) => typeof group === "string" && group.length > 0);
		return token ? match.replace(token, "[REDACTED]") : "[REDACTED]";
	});
	return redacted.replaceAll(structuredAuthMarker, "[REDACTED]");
}
//#endregion
//#region packages/acp-core/src/runtime/errors.ts
const ACP_ERROR_CODES = [
	"ACP_BACKEND_MISSING",
	"ACP_BACKEND_UNAVAILABLE",
	"ACP_BACKEND_UNSUPPORTED_CONTROL",
	"ACP_DISPATCH_DISABLED",
	"ACP_INVALID_RUNTIME_OPTION",
	"ACP_SESSION_INIT_FAILED",
	"ACP_TURN_FAILED"
];
const ACP_ERROR_CODE_SET = new Set(ACP_ERROR_CODES);
/** Error type used at ACP runtime boundaries so callers can preserve structured failure codes. */
var AcpRuntimeError = class extends Error {
	constructor(code, message, options) {
		super(message);
		this.name = "AcpRuntimeError";
		this.code = code;
		this.detailCode = options?.detailCode;
		this.cause = options?.cause;
	}
};
function getForeignAcpRuntimeError(value) {
	if (!(value instanceof Error)) return null;
	const code = value.code;
	if (typeof code !== "string" || !ACP_ERROR_CODE_SET.has(code)) return null;
	return {
		code,
		message: value.message
	};
}
function readAcpRequestErrorDetails(value) {
	if (typeof value.code !== "number") return;
	const data = value.data;
	if (!data || typeof data !== "object") return;
	const details = data.details;
	if (details === void 0 || details === null) return;
	const rendered = redactSensitiveText(stringifyNonErrorCause(details)).trim();
	return rendered.length > 0 ? rendered : void 0;
}
function messageWithAcpRequestErrorDetails(error) {
	const details = readAcpRequestErrorDetails(error);
	if (!details || error.message.includes(details)) return error.message;
	return `${error.message}: ${details}`;
}
/** Recognizes local and cross-realm ACP runtime errors by their stable error code. */
function isAcpRuntimeError(value) {
	return value instanceof AcpRuntimeError || getForeignAcpRuntimeError(value) !== null;
}
/** Converts arbitrary thrown values into ACP runtime errors with redacted request details. */
function toAcpRuntimeError(params) {
	if (params.error instanceof AcpRuntimeError) return params.error;
	const foreignAcpRuntimeError = getForeignAcpRuntimeError(params.error);
	if (foreignAcpRuntimeError) return new AcpRuntimeError(foreignAcpRuntimeError.code, foreignAcpRuntimeError.message, { cause: params.error });
	if (params.error instanceof Error) return new AcpRuntimeError(params.fallbackCode, messageWithAcpRequestErrorDetails(params.error), { cause: params.error });
	return new AcpRuntimeError(params.fallbackCode, params.fallbackMessage, { cause: params.error });
}
/**
* Render an error and its `.cause` chain as a single human-readable line for
* logs, lifecycle events, and tool results. Format is
* `Name [code]: message <- Name [code]: message <- ...`. Number codes also
* appear, so JSON-RPC error codes like `-32603` survive into surfaces that
* downstream consumers see (gateway logs, telegram replies, tool_result text).
*
* Depth is capped to defend against self-referential `.cause` cycles.
*/
function formatAcpErrorChain(error) {
	if (!(error instanceof Error)) return redactSensitiveText(String(error));
	const segments = [renderSingleError(error)];
	let current = error.cause;
	let depth = 0;
	while (current !== void 0 && current !== null && depth < 8) {
		if (current instanceof Error) {
			segments.push(renderSingleError(current));
			current = current.cause;
		} else {
			segments.push(stringifyNonErrorCause(current));
			current = void 0;
		}
		depth += 1;
	}
	return redactSensitiveText(segments.join(" <- "));
}
function renderSingleError(error) {
	const codeValue = "code" in error ? error.code : void 0;
	const codeSuffix = typeof codeValue === "string" || typeof codeValue === "number" ? ` [${codeValue}]` : "";
	return `${error.name}${codeSuffix}: ${error.message}`;
}
/** Wraps async runtime work and rethrows failures as ACP runtime errors. */
async function withAcpRuntimeErrorBoundary(params) {
	try {
		return await params.run();
	} catch (error) {
		throw toAcpRuntimeError({
			error,
			fallbackCode: params.fallbackCode,
			fallbackMessage: params.fallbackMessage
		});
	}
}
//#endregion
export { toAcpRuntimeError as a, redactSensitiveText as c, isAcpRuntimeError as i, AcpRuntimeError as n, withAcpRuntimeErrorBoundary as o, formatAcpErrorChain as r, configureAcpErrorRedactor as s, ACP_ERROR_CODES as t };
