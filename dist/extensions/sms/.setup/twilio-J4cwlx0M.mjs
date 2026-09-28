import { normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
import { PlatformMessageNotDispatchedError, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createAccountListHelpers, resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, hasConfiguredAccountValue, resolveAccountEntry } from "openclaw/plugin-sdk/account-resolution";
import { parseStrictPositiveInteger } from "openclaw/plugin-sdk/number-runtime";
import { hasConfiguredSecretInput, resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { isIP } from "node:net";
import { fetchWithSsrFGuard, isBlockedHostnameOrIp } from "openclaw/plugin-sdk/ssrf-runtime";
import { createHmac } from "node:crypto";
import { readRequestBodyWithLimit } from "openclaw/plugin-sdk/webhook-ingress";
import { assertSecretOwnerAvailable } from "openclaw/plugin-sdk/channel-secret-owner-runtime";
import { getRuntimeConfigSnapshot } from "openclaw/plugin-sdk/runtime-config-snapshot";
import * as querystring from "node:querystring";
import { redactToolPayloadText } from "openclaw/plugin-sdk/logging-core";
import { readResponseTextPrefix, readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
//#region extensions/sms/src/phone.ts
function normalizeSmsPhoneNumber(raw) {
	const trimmed = raw.trim().replace(/^(?:sms|twilio-sms):/i, "").trim();
	if (!trimmed) return "";
	return (trimmed.startsWith("+") ? trimmed : `+${trimmed}`).replace(/[^\d+]/g, "");
}
function looksLikeSmsPhoneNumber(raw) {
	const normalized = normalizeSmsPhoneNumber(raw);
	return /^\+[1-9]\d{6,14}$/.test(normalized);
}
function normalizeSmsAllowFrom(raw) {
	if (raw.trim() === "*") return "*";
	return normalizeSmsPhoneNumber(raw).toLowerCase();
}
//#endregion
//#region extensions/sms/src/public-webhook-url.ts
const SMS_STATUS_CALLBACK_MAX_LENGTH = 4e3;
const SMS_STATUS_CALLBACK_READ_TIMEOUT_MS = 5e3;
const TWILIO_READ_TIMEOUT_MIN_MS = 100;
const TWILIO_READ_TIMEOUT_MAX_MS = 15e3;
const ABSOLUTE_HTTP_URL_PATTERN = /^https?:\/\//iu;
const RAW_AUTHORITY_PATTERN = /^[a-z0-9.:[\]-]+$/iu;
const RAW_PATH_QUERY_FRAGMENT_PATTERN = /^[a-z0-9\-._~%!$&'()*+,;=:@/?]*$/iu;
const INVALID_PERCENT_ESCAPE_PATTERN = /%(?![0-9a-f]{2})/iu;
function hasForbiddenRawUrlCharacter(value) {
	for (let index = 0; index < value.length; index += 1) {
		const codePoint = value.charCodeAt(index);
		if (codePoint <= 32 || codePoint === 92 || codePoint === 127) return true;
	}
	return false;
}
function hasSafeRawUrlCharacters(value) {
	const match = /^https?:\/\/([^/?#]*)([^#]*)(?:#(.*))?$/iu.exec(value);
	if (!match) return false;
	return RAW_AUTHORITY_PATTERN.test(match[1] ?? "") && RAW_PATH_QUERY_FRAGMENT_PATTERN.test(match[2] ?? "") && RAW_PATH_QUERY_FRAGMENT_PATTERN.test(match[3] ?? "");
}
function hasValidHostname(url) {
	const hostname = url.hostname.startsWith("[") && url.hostname.endsWith("]") ? url.hostname.slice(1, -1) : url.hostname;
	if (isBlockedHostnameOrIp(hostname)) return false;
	if (isIP(hostname) !== 0) return true;
	const normalized = hostname.endsWith(".") ? hostname.slice(0, -1) : hostname;
	if (!normalized.includes(".") || normalized.length > 253) return false;
	return normalized.split(".").every((label) => label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/iu.test(label));
}
function parseSmsPublicWebhookUrl(value) {
	const trimmed = value.trim();
	if (!ABSOLUTE_HTTP_URL_PATTERN.test(trimmed) || !hasSafeRawUrlCharacters(trimmed) || INVALID_PERCENT_ESCAPE_PATTERN.test(trimmed) || hasForbiddenRawUrlCharacter(trimmed)) return;
	let url;
	try {
		url = new URL(trimmed);
	} catch {
		return;
	}
	if (url.protocol !== "http:" && url.protocol !== "https:" || url.username || url.password || !hasValidHostname(url)) return;
	return url;
}
function parseTwilioRetryPolicies(overrides) {
	const policies = overrides.getAll("rp").flatMap((value) => value.split(",")).map((value) => value.trim()).filter(Boolean);
	return policies.length > 0 ? [...new Set(policies)] : ["ct"];
}
function resolveTwilioStatusCallbackUrl(publicWebhookUrl) {
	const trimmed = publicWebhookUrl.trim();
	if (!trimmed || !parseSmsPublicWebhookUrl(trimmed)) return "";
	const hashIndex = trimmed.indexOf("#");
	const baseUrl = hashIndex === -1 ? trimmed : trimmed.slice(0, hashIndex);
	const overrides = new URLSearchParams(hashIndex === -1 ? "" : trimmed.slice(hashIndex + 1));
	const retryPolicies = parseTwilioRetryPolicies(overrides);
	const normalizedRetryPolicies = new Set(retryPolicies.map((policy) => policy.toLowerCase()));
	if (!normalizedRetryPolicies.has("all")) {
		for (const requiredPolicy of [
			"ct",
			"rt",
			"5xx"
		]) if (!normalizedRetryPolicies.has(requiredPolicy)) retryPolicies.push(requiredPolicy);
	}
	overrides.set("rp", retryPolicies.join(","));
	const configuredReadTimeout = Number(overrides.get("rt"));
	const readTimeout = Number.isInteger(configuredReadTimeout) && configuredReadTimeout >= TWILIO_READ_TIMEOUT_MIN_MS && configuredReadTimeout <= TWILIO_READ_TIMEOUT_MAX_MS ? configuredReadTimeout : SMS_STATUS_CALLBACK_READ_TIMEOUT_MS;
	overrides.set("rt", String(readTimeout));
	const configuredRetryCount = Number(overrides.get("rc"));
	const retryCount = Number.isInteger(configuredRetryCount) && configuredRetryCount >= 1 && configuredRetryCount <= 5 ? configuredRetryCount : 1;
	overrides.set("rc", String(retryCount));
	const callbackUrl = `${baseUrl}#${overrides.toString().replaceAll("%2C", ",")}`;
	if (callbackUrl.length > SMS_STATUS_CALLBACK_MAX_LENGTH || !parseSmsPublicWebhookUrl(callbackUrl)) return "";
	return callbackUrl;
}
//#endregion
//#region extensions/sms/src/accounts.ts
const CHANNEL_ID = "sms";
const DEFAULT_WEBHOOK_PATH = "/webhooks/sms";
const DEFAULT_TEXT_CHUNK_LIMIT = 1500;
function getChannelConfig(cfg) {
	return cfg?.channels?.[CHANNEL_ID];
}
function parseList(raw) {
	if (!raw) return [];
	return (Array.isArray(raw) ? raw : typeof raw === "string" ? normalizeStringEntries(raw.split(",")) : [raw]).map((entry) => normalizeSmsAllowFrom(String(entry))).filter(Boolean);
}
function parseTextChunkLimit(raw) {
	if (typeof raw === "number" && Number.isSafeInteger(raw) && raw > 0) return raw;
	if (typeof raw === "string" && /^\d+$/.test(raw.trim())) return parseStrictPositiveInteger(raw.trim()) ?? DEFAULT_TEXT_CHUNK_LIMIT;
	return DEFAULT_TEXT_CHUNK_LIMIT;
}
function firstNonBlankEnv(...values) {
	return values.find((value) => value?.trim());
}
function hasBaseAccount(channelCfg) {
	return [
		channelCfg?.accountSid,
		channelCfg?.fromNumber,
		channelCfg?.messagingServiceSid,
		process.env.TWILIO_ACCOUNT_SID,
		process.env.TWILIO_AUTH_TOKEN,
		process.env.TWILIO_PHONE_NUMBER,
		process.env.TWILIO_SMS_FROM,
		process.env.TWILIO_MESSAGING_SERVICE_SID
	].some((value) => hasConfiguredAccountValue(value)) || hasConfiguredSecretInput(channelCfg?.authToken);
}
const { listAccountIds: listSmsAccountIds, resolveDefaultAccountId: resolveDefaultSmsAccountId, resolveAccountConfig: resolveMergedSmsAccountConfig } = createAccountListHelpers(CHANNEL_ID, {
	fallbackAccountIdWhenEmpty: false,
	hasImplicitDefaultAccount: (cfg) => hasBaseAccount(getChannelConfig(cfg)),
	omitKeys: ["defaultAccount"]
});
function resolveSmsAccount(cfg, accountId) {
	return readSmsAccount(cfg, accountId, "strict").account;
}
function readSmsAccount(cfg, accountId, mode) {
	const channelCfg = getChannelConfig(cfg) ?? {};
	const id = normalizeOptionalAccountId(accountId) ?? resolveDefaultSmsAccountId(cfg);
	const accountConfig = resolveAccountEntry(channelCfg.accounts, id);
	const merged = resolveMergedSmsAccountConfig(cfg, id);
	const useEnvFallbacks = id === DEFAULT_ACCOUNT_ID$1;
	const envAccountSid = useEnvFallbacks ? process.env.TWILIO_ACCOUNT_SID : void 0;
	const envAuthToken = useEnvFallbacks ? process.env.TWILIO_AUTH_TOKEN : void 0;
	const envFromNumber = useEnvFallbacks ? firstNonBlankEnv(process.env.TWILIO_PHONE_NUMBER, process.env.TWILIO_SMS_FROM) : void 0;
	const envMessagingServiceSid = useEnvFallbacks ? process.env.TWILIO_MESSAGING_SERVICE_SID : void 0;
	const envWebhookPath = useEnvFallbacks ? process.env.SMS_WEBHOOK_PATH : void 0;
	const envPublicWebhookUrl = useEnvFallbacks ? process.env.SMS_PUBLIC_WEBHOOK_URL : void 0;
	const envAllowFrom = useEnvFallbacks ? process.env.SMS_ALLOWED_USERS : void 0;
	const envTextChunkLimit = useEnvFallbacks ? process.env.SMS_TEXT_CHUNK_LIMIT : void 0;
	const envDisableSignatureValidation = useEnvFallbacks ? process.env.SMS_DANGEROUSLY_DISABLE_SIGNATURE_VALIDATION : void 0;
	const webhookPath = (merged.webhookPath ?? envWebhookPath ?? DEFAULT_WEBHOOK_PATH).trim();
	const publicWebhookUrl = (merged.publicWebhookUrl ?? envPublicWebhookUrl ?? "").trim();
	const authToken = resolveSecretInputString({
		value: merged.authToken ?? envAuthToken,
		path: id === DEFAULT_ACCOUNT_ID$1 ? "channels.sms.authToken" : `channels.sms.accounts.${id}.authToken`,
		mode
	});
	return {
		account: {
			accountId: id,
			enabled: channelCfg.enabled !== false && accountConfig?.enabled !== false,
			accountSid: (merged.accountSid ?? envAccountSid ?? "").trim(),
			authToken: authToken.value ?? "",
			fromNumber: normalizeSmsPhoneNumber(merged.fromNumber ?? envFromNumber ?? ""),
			messagingServiceSid: (merged.messagingServiceSid ?? envMessagingServiceSid ?? "").trim(),
			defaultTo: normalizeSmsPhoneNumber(merged.defaultTo ?? ""),
			webhookPath: webhookPath || DEFAULT_WEBHOOK_PATH,
			publicWebhookUrl,
			dangerouslyDisableSignatureValidation: merged.dangerouslyDisableSignatureValidation === true || envDisableSignatureValidation === "true",
			dmPolicy: merged.dmPolicy ?? "pairing",
			allowFrom: parseList(merged.allowFrom ?? envAllowFrom),
			textChunkLimit: parseTextChunkLimit(merged.textChunkLimit ?? envTextChunkLimit),
			mediaMaxBytes: resolveChannelMediaMaxBytes({
				cfg,
				accountId: id,
				resolveChannelLimitMb: () => merged.mediaMaxMb
			})
		},
		tokenStatus: authToken.status
	};
}
function inspectSmsAccount(cfg, accountId) {
	const { account, tokenStatus } = readSmsAccount(cfg, accountId, "inspect");
	const configured = Boolean(account.accountSid && tokenStatus !== "missing" && (account.fromNumber || account.messagingServiceSid));
	return {
		accountId: account.accountId,
		name: account.fromNumber || account.messagingServiceSid || "SMS",
		enabled: account.enabled,
		configured,
		tokenStatus,
		webhookPath: account.webhookPath,
		signatureValidation: account.dangerouslyDisableSignatureValidation ? "configured" : !account.publicWebhookUrl ? "missing-public-url" : parseSmsPublicWebhookUrl(account.publicWebhookUrl) ? "configured" : "invalid-public-url"
	};
}
function isSmsAccountConfigured(account) {
	return Boolean(account.accountSid && account.authToken && (account.fromNumber || account.messagingServiceSid));
}
//#endregion
//#region extensions/sms/src/credential-availability.ts
function assertSmsCredentialOwnerAvailable(account) {
	assertSecretOwnerAvailable("account", `sms:${account.accountId}`);
	const runtimeConfig = getRuntimeConfigSnapshot();
	if (!runtimeConfig) return;
	const current = resolveSmsAccount(runtimeConfig, account.accountId);
	if (current.accountSid !== account.accountSid || current.authToken !== account.authToken) throw new Error(`SMS credentials changed for ${account.accountId}; retry the operation.`);
}
//#endregion
//#region extensions/sms/src/twilio.ts
const TWILIO_ACCOUNTS_URL = "https://api.twilio.com/2010-04-01/Accounts";
const TWILIO_MESSAGING_URL = "https://messaging.twilio.com/v1";
const TWILIO_API_HOSTNAME = "api.twilio.com";
const TWILIO_MESSAGING_HOSTNAME = "messaging.twilio.com";
const TWILIO_API_TIMEOUT_MS = 3e4;
const TWILIO_API_SUCCESS_BODY_LIMIT_BYTES = 1048576;
const TWILIO_API_ERROR_BODY_LIMIT_BYTES = 8192;
const TRUNCATED_RESPONSE_SUFFIX = "... [truncated]";
const WEBHOOK_BODY_LIMIT_BYTES = 32768;
const WEBHOOK_BODY_TIMEOUT_MS = 5e3;
const TWILIO_MESSAGE_BODY_MAX_LENGTH = 1600;
const TWILIO_MMS_MAX_OUTBOUND_MEDIA_COUNT = 10;
const TWILIO_MMS_MAX_BYTES = 5242880;
const SMS_MAX_INBOUND_MEDIA_DOWNLOADS = 10;
const TWILIO_CHANNEL_ADDRESS_RE = /^([a-z][a-z0-9-]*):(.*)$/i;
function firstString(value) {
	if (Array.isArray(value)) return firstString(value[0]);
	return typeof value === "string" ? value : "";
}
function firstTrimmedString(value) {
	return firstString(value).trim();
}
function firstStringish(value) {
	const first = Array.isArray(value) ? value[0] : value;
	if (typeof first === "string") return first;
	return typeof first === "number" ? String(first) : "";
}
function parseTwilioApiError(text) {
	try {
		const parsed = JSON.parse(text);
		if (!parsed || typeof parsed !== "object") return {};
		const record = parsed;
		return {
			code: typeof record.code === "number" ? record.code : void 0,
			message: typeof record.message === "string" ? record.message : void 0
		};
	} catch {
		return {};
	}
}
function parseTwilioSuccessPayload(text) {
	if (!text.trim()) return {};
	try {
		const parsed = JSON.parse(text);
		if (!parsed || typeof parsed !== "object") throw new Error("Twilio SMS send returned malformed JSON.");
		const record = parsed;
		return {
			sid: typeof record.sid === "string" ? record.sid : void 0,
			to: typeof record.to === "string" ? record.to : void 0,
			from: typeof record.from === "string" ? record.from : void 0,
			status: typeof record.status === "string" ? record.status : void 0
		};
	} catch (cause) {
		if (cause instanceof Error && cause.message === "Twilio SMS send returned malformed JSON.") throw cause;
		throw new Error("Twilio SMS send returned malformed JSON.", { cause });
	}
}
function requestSearch(req) {
	try {
		return new URL(req.url ?? "/", "http://localhost").search;
	} catch {
		return "";
	}
}
function stripUrlFragment(url) {
	const hashIndex = url.indexOf("#");
	return hashIndex === -1 ? url : url.slice(0, hashIndex);
}
function resolveTwilioWebhookSignatureUrl(params) {
	const signatureBaseUrl = stripUrlFragment(params.publicWebhookUrl);
	if (signatureBaseUrl.includes("?")) return signatureBaseUrl;
	const search = requestSearch(params.req);
	if (!search) return signatureBaseUrl;
	return `${signatureBaseUrl}${search}`;
}
var TwilioSmsApiError = class extends Error {
	constructor(httpStatus, responseText, operation = "send") {
		const redactedResponseText = redactToolPayloadText(responseText);
		const parsed = parseTwilioApiError(redactedResponseText);
		const detail = parsed.message ?? (redactedResponseText || "unknown");
		super(`Twilio SMS ${operation} failed (${httpStatus}): ${detail}`);
		this.name = "TwilioSmsApiError";
		this.httpStatus = httpStatus;
		this.responseText = redactedResponseText;
		this.twilioCode = parsed.code;
	}
};
function parseTwilioFormBody(body) {
	const parsed = querystring.parse(body);
	const out = {};
	for (const [key, value] of Object.entries(parsed)) out[key] = firstString(value);
	return out;
}
function computeTwilioSignature(params) {
	const data = params.url + Object.keys(params.form).toSorted().map((key) => `${key}${params.form[key] ?? ""}`).join("");
	return createHmac("sha1", params.authToken).update(data).digest("base64");
}
function verifyTwilioSignature(params) {
	if (!params.signature || !params.url || !params.authToken) return false;
	return safeEqualSecret(params.signature, computeTwilioSignature({
		url: params.url,
		authToken: params.authToken,
		form: params.form
	}));
}
function parseTwilioInboundFrom(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const channelAddress = trimmed.match(TWILIO_CHANNEL_ADDRESS_RE);
	const kind = channelAddress?.[1]?.toLowerCase();
	if (kind && kind !== "rcs") return null;
	const phoneNumber = normalizeSmsPhoneNumber(channelAddress?.[2] ?? trimmed);
	if (!looksLikeSmsPhoneNumber(phoneNumber)) return null;
	return phoneNumber;
}
function resolveTwilioInboundSender(form) {
	return parseTwilioInboundFrom(firstTrimmedString(form.From)) ?? "";
}
function buildTwilioInboundMessage(form) {
	const from = resolveTwilioInboundSender(form);
	const to = firstTrimmedString(form.To);
	const body = firstString(form.Body);
	const accountSid = firstString(form.AccountSid);
	const messagingServiceSid = firstString(form.MessagingServiceSid);
	const messageSid = resolveTwilioMessageSid(form);
	const rawMediaCount = firstTrimmedString(form.NumMedia);
	const mediaCount = rawMediaCount ? Number(rawMediaCount) : 0;
	if (!Number.isSafeInteger(mediaCount) || mediaCount < 0) return null;
	let unavailableMediaCount = Math.max(0, mediaCount - SMS_MAX_INBOUND_MEDIA_DOWNLOADS);
	const media = Array.from({ length: Math.min(mediaCount, SMS_MAX_INBOUND_MEDIA_DOWNLOADS) }, (_value, index) => {
		const url = firstTrimmedString(form[`MediaUrl${index}`]);
		const contentType = firstTrimmedString(form[`MediaContentType${index}`]);
		if (!url) {
			unavailableMediaCount += 1;
			return null;
		}
		return {
			url,
			...contentType ? { contentType } : {}
		};
	}).filter((item) => item !== null);
	if (!from || !to || !body && mediaCount === 0 || !messageSid) return null;
	return {
		accountSid,
		from,
		to,
		body,
		messageSid,
		media,
		...messagingServiceSid ? { messagingServiceSid } : {},
		...unavailableMediaCount > 0 ? { unavailableMediaCount } : {}
	};
}
function resolveTwilioMessageSid(form) {
	return firstTrimmedString(form.MessageSid) || firstTrimmedString(form.SmsSid) || firstTrimmedString(form.SmsMessageSid);
}
async function readTwilioWebhookForm(req) {
	return parseTwilioFormBody(await readRequestBodyWithLimit(req, {
		maxBytes: WEBHOOK_BODY_LIMIT_BYTES,
		timeoutMs: WEBHOOK_BODY_TIMEOUT_MS,
		destroyOnLimit: false
	}));
}
const TWIML_CONTENT_TYPE = "text/xml; charset=utf-8";
function respondTwiml(res, statusCode, body = "") {
	res.statusCode = statusCode;
	res.setHeader("content-type", TWIML_CONTENT_TYPE);
	res.end(body || "<Response></Response>");
}
function twilioApiUrl(accountSid, path, query) {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	const url = new URL(`${TWILIO_ACCOUNTS_URL}/${encodeURIComponent(accountSid)}${normalizedPath}`);
	if (query) url.search = query.toString();
	return url.toString();
}
function twilioMessagingUrl(path, query) {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	const url = new URL(`${TWILIO_MESSAGING_URL}${normalizedPath}`);
	if (query) url.search = query.toString();
	return url.toString();
}
function basicAuthHeader(account) {
	return `Basic ${Buffer.from(`${account.accountSid}:${account.authToken}`).toString("base64")}`;
}
function appendTruncatedResponseSuffix(text) {
	return `${text.trimEnd()}${TRUNCATED_RESPONSE_SUFFIX}`;
}
async function readTwilioApiResponseText(response) {
	const maxBytes = response.ok ? TWILIO_API_SUCCESS_BODY_LIMIT_BYTES : TWILIO_API_ERROR_BODY_LIMIT_BYTES;
	if (!response.ok) {
		const prefix = await readResponseTextPrefix(response, maxBytes);
		return prefix.truncated ? appendTruncatedResponseSuffix(prefix.text) : prefix.text;
	}
	const body = await readResponseWithLimit(response, maxBytes, { onOverflow: ({ size, maxBytes: limit }) => /* @__PURE__ */ new Error(`Twilio SMS API response body too large: ${size} bytes (limit: ${limit} bytes)`) });
	return new TextDecoder().decode(body);
}
function normalizeRequestHeaders(headers) {
	if (!headers) return {};
	if (headers instanceof Headers) return Object.fromEntries(headers.entries());
	if (Array.isArray(headers)) return Object.fromEntries(headers.map(([key, value]) => [key, value]));
	return Object.fromEntries(Object.entries(headers));
}
function assertTwilioRequestCredentialsAvailable(account) {
	try {
		assertSmsCredentialOwnerAvailable(account);
	} catch (error) {
		throw new PlatformMessageNotDispatchedError(`SMS request stopped before Twilio dispatch: ${formatErrorMessage(error)}`, { cause: error });
	}
}
async function requestTwilioApi(params) {
	const init = {
		...params.init,
		headers: {
			...normalizeRequestHeaders(params.init?.headers),
			authorization: basicAuthHeader(params.account)
		}
	};
	if (params.fetchImpl) {
		assertTwilioRequestCredentialsAvailable(params.account);
		const response = await params.fetchImpl(params.url, init);
		return {
			ok: response.ok,
			status: response.status,
			text: await readTwilioApiResponseText(response)
		};
	}
	let requestDispatched = false;
	const guarded = await fetchWithSsrFGuard({
		url: params.url,
		init,
		beforeRequest: () => {
			if (requestDispatched) {
				assertSmsCredentialOwnerAvailable(params.account);
				return;
			}
			assertTwilioRequestCredentialsAvailable(params.account);
			requestDispatched = true;
		},
		auditContext: "sms-twilio-api",
		policy: { allowedHostnames: [params.allowedHostname] },
		requireHttps: true,
		timeoutMs: params.timeoutMs ?? TWILIO_API_TIMEOUT_MS
	});
	try {
		return {
			ok: guarded.response.ok,
			status: guarded.response.status,
			text: await readTwilioApiResponseText(guarded.response)
		};
	} finally {
		await guarded.release();
	}
}
function parseTwilioIncomingPhoneNumber(record) {
	return {
		sid: firstTrimmedString(record.sid),
		phoneNumber: firstTrimmedString(record.phone_number ?? record.phoneNumber),
		smsUrl: firstTrimmedString(record.sms_url ?? record.smsUrl),
		smsMethod: firstTrimmedString(record.sms_method ?? record.smsMethod),
		voiceUrl: firstTrimmedString(record.voice_url ?? record.voiceUrl)
	};
}
function parseTwilioMessageLogEntry(record) {
	return {
		sid: firstTrimmedString(record.sid),
		direction: firstTrimmedString(record.direction),
		status: firstTrimmedString(record.status),
		to: firstTrimmedString(record.to),
		from: firstTrimmedString(record.from),
		errorCode: firstStringish(record.error_code ?? record.errorCode).trim(),
		body: firstString(record.body),
		dateCreated: firstTrimmedString(record.date_created ?? record.dateCreated),
		dateSent: firstTrimmedString(record.date_sent ?? record.dateSent)
	};
}
function parseTwilioMessagingService(record) {
	return {
		sid: firstTrimmedString(record.sid),
		inboundRequestUrl: firstTrimmedString(record.inbound_request_url ?? record.inboundRequestUrl),
		inboundMethod: firstTrimmedString(record.inbound_method ?? record.inboundMethod),
		useInboundWebhookOnNumber: Boolean(record.use_inbound_webhook_on_number ?? record.useInboundWebhookOnNumber)
	};
}
function parseTwilioListPayload(text, key, parseEntry) {
	if (!text.trim()) return [];
	let parsed;
	try {
		parsed = JSON.parse(text);
	} catch {
		return [];
	}
	if (!parsed || typeof parsed !== "object") return [];
	const items = parsed[key];
	if (!Array.isArray(items)) return [];
	return items.filter((item) => Boolean(item && typeof item === "object" && !Array.isArray(item))).map(parseEntry);
}
async function listTwilioIncomingPhoneNumbers(params) {
	const query = new URLSearchParams();
	if (params.phoneNumber) query.set("PhoneNumber", params.phoneNumber);
	const response = await requestTwilioApi({
		account: params.account,
		url: twilioApiUrl(params.account.accountSid, "/IncomingPhoneNumbers.json", query),
		allowedHostname: TWILIO_API_HOSTNAME,
		fetchImpl: params.fetchImpl,
		timeoutMs: params.timeoutMs
	});
	if (!response.ok) throw new TwilioSmsApiError(response.status, response.text, "phone-number lookup");
	return parseTwilioListPayload(response.text, "incoming_phone_numbers", parseTwilioIncomingPhoneNumber);
}
async function retrieveTwilioMessagingService(params) {
	const response = await requestTwilioApi({
		account: params.account,
		url: twilioMessagingUrl(`/Services/${encodeURIComponent(params.serviceSid)}`),
		allowedHostname: TWILIO_MESSAGING_HOSTNAME,
		fetchImpl: params.fetchImpl,
		timeoutMs: params.timeoutMs
	});
	if (!response.ok) throw new TwilioSmsApiError(response.status, response.text, "messaging-service lookup");
	let parsed;
	try {
		parsed = JSON.parse(response.text);
	} catch {
		throw new Error("Twilio Messaging Service lookup returned malformed JSON.");
	}
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Twilio Messaging Service lookup returned malformed JSON.");
	return parseTwilioMessagingService(parsed);
}
async function listTwilioMessages(params) {
	const query = new URLSearchParams();
	if (params.to) query.set("To", params.to);
	if (params.from) query.set("From", params.from);
	query.set("PageSize", String(params.pageSize ?? 5));
	const response = await requestTwilioApi({
		account: params.account,
		url: twilioApiUrl(params.account.accountSid, "/Messages.json", query),
		allowedHostname: TWILIO_API_HOSTNAME,
		fetchImpl: params.fetchImpl,
		timeoutMs: params.timeoutMs
	});
	if (!response.ok) throw new TwilioSmsApiError(response.status, response.text, "message lookup");
	return parseTwilioListPayload(response.text, "messages", parseTwilioMessageLogEntry);
}
async function sendSmsViaTwilio(params) {
	assertSmsCredentialOwnerAvailable(params.account);
	if (!params.account.fromNumber && !params.account.messagingServiceSid) throw new Error("Twilio SMS send requires fromNumber or messagingServiceSid.");
	if (params.text && params.text.length > 1600) throw new Error(`Twilio SMS/MMS Body supports at most ${TWILIO_MESSAGE_BODY_MAX_LENGTH} characters.`);
	const mediaUrls = (params.mediaUrls ?? []).map((url) => url.trim()).filter(Boolean);
	if (!params.text && mediaUrls.length === 0) throw new Error("Twilio SMS/MMS send requires text or media.");
	if (mediaUrls.length > TWILIO_MMS_MAX_OUTBOUND_MEDIA_COUNT) throw new Error(`Twilio MMS send supports at most ${TWILIO_MMS_MAX_OUTBOUND_MEDIA_COUNT} media URLs.`);
	const body = new URLSearchParams({ To: params.to });
	if (params.text) body.set("Body", params.text);
	for (const mediaUrl of mediaUrls) body.append("MediaUrl", mediaUrl);
	if (params.account.fromNumber) body.set("From", params.account.fromNumber);
	else body.set("MessagingServiceSid", params.account.messagingServiceSid);
	const statusCallback = resolveTwilioStatusCallbackUrl(params.account.publicWebhookUrl);
	if (statusCallback) body.set("StatusCallback", statusCallback);
	const init = {
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded" },
		body
	};
	await params.onPlatformSendDispatch?.();
	const response = await requestTwilioApi({
		account: params.account,
		url: twilioApiUrl(params.account.accountSid, "/Messages.json"),
		allowedHostname: TWILIO_API_HOSTNAME,
		init,
		fetchImpl: params.fetchImpl
	});
	if (!response.ok) throw new TwilioSmsApiError(response.status, response.text);
	const payload = parseTwilioSuccessPayload(response.text);
	const sid = payload.sid?.trim();
	if (!sid) throw new Error("Twilio SMS send response did not include a Message SID.");
	return {
		sid,
		to: payload.to?.trim() || params.to,
		...payload.from?.trim() ? { from: payload.from.trim() } : {},
		...payload.status?.trim() ? { status: payload.status.trim() } : {}
	};
}
//#endregion
export { normalizeSmsAllowFrom as C, looksLikeSmsPhoneNumber as S, isSmsAccountConfigured as _, listTwilioIncomingPhoneNumbers as a, resolveSmsAccount as b, resolveTwilioInboundSender as c, respondTwiml as d, retrieveTwilioMessagingService as f, inspectSmsAccount as g, assertSmsCredentialOwnerAvailable as h, buildTwilioInboundMessage as i, resolveTwilioMessageSid as l, verifyTwilioSignature as m, TWILIO_MMS_MAX_BYTES as n, listTwilioMessages as o, sendSmsViaTwilio as p, TWIML_CONTENT_TYPE as r, readTwilioWebhookForm as s, TWILIO_MESSAGE_BODY_MAX_LENGTH as t, resolveTwilioWebhookSignatureUrl as u, listSmsAccountIds as v, normalizeSmsPhoneNumber as w, resolveTwilioStatusCallbackUrl as x, resolveDefaultSmsAccountId as y };
