import { l as resolveGoogleChatAccount, n as formatGoogleChatAllowFromEntry, u as MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES } from "./channel-base-DjVHuLDF.mjs";
import { buildChannelOutboundSessionRoute } from "openclaw/plugin-sdk/channel-core";
import { createMessageReceiptFromOutboundResults, defineChannelMessageAdapter, sanitizeForPlainText } from "openclaw/plugin-sdk/channel-outbound";
import { createLazyRuntimeNamedExport } from "openclaw/plugin-sdk/lazy-runtime";
import { asNullableObjectRecord, isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveUserPath } from "openclaw/plugin-sdk/text-utility-runtime";
import { extractErrorCode, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { redactToolPayloadText } from "openclaw/plugin-sdk/logging-core";
import { MediaFetchError, parseMediaContentLength, readResponseTextSnippet } from "openclaw/plugin-sdk/media-runtime";
import { readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { buildHostnameAllowlistPolicyFromSuffixAllowlist, fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { createNativeApprovalControlRegistry } from "openclaw/plugin-sdk/approval-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import fs from "node:fs/promises";
import { readFileHandleBounded } from "openclaw/plugin-sdk/file-access-runtime";
import { adaptScopedAccountAccessor } from "openclaw/plugin-sdk/channel-config-helpers";
import { missingTargetError } from "openclaw/plugin-sdk/channel-feedback";
import { defineStableChannelIngressIdentity, identityEntryAuthenticationClassifier } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { buildChannelGroupsScopeTree, createAllowlistProviderOpenWarningCollector, createConditionalWarningCollector, resolveScopeRequireMention } from "openclaw/plugin-sdk/channel-policy";
import { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
import { createChannelDirectoryAdapter, listResolvedDirectoryGroupEntriesFromMapKeys, listResolvedDirectoryUserEntriesFromAllowFrom } from "openclaw/plugin-sdk/directory-runtime";
import { formatTextWithAttachmentLinks, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { FormatCapabilityProfile, markdownToIR, renderMarkdownIRChunksWithinLimit, renderMarkdownWithMarkers, sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
// extensions/googlechat/src/approval-card-actions.ts
const GOOGLECHAT_APPROVAL_ACTION = "openclaw.approval";
const GOOGLECHAT_APPROVAL_ACTION_PARAM = "openclaw_action";
const GOOGLECHAT_APPROVAL_TOKEN_PARAM = "token";
const GOOGLECHAT_APPROVAL_ACTION_VALUE = "approval";
const MANUAL_EXEC_APPROVAL_COMMAND_RE = /(?:^|[\s`])\/approve[ \t]+([^ \t\r\n`|]+)[ \t]+(allow-once|allow-always|deny)(?=$|[\s`|.,;:!?])/giu;
const googleChatApprovalControls = createNativeApprovalControlRegistry({
	releaseClaimOnLookupExpiry: false,
	onComplete: (binding) => unregisterGoogleChatManualApprovalFollowupSuppression(binding.approvalId)
});
const GOOGLECHAT_MANUAL_APPROVAL_SUPPRESSION_MAX_ENTRIES = 1024;
const manualApprovalFollowupSuppressions = /* @__PURE__ */ new Map();
function buildGoogleChatApprovalActionParameters(token) {
	return [{
		key: GOOGLECHAT_APPROVAL_ACTION_PARAM,
		value: GOOGLECHAT_APPROVAL_ACTION_VALUE
	}, {
		key: GOOGLECHAT_APPROVAL_TOKEN_PARAM,
		value: token
	}];
}
function readGoogleChatApprovalActionToken(event) {
	const params = {};
	for (const source of [event.common?.parameters, event.commonEventObject?.parameters]) for (const [key, value] of Object.entries(source ?? {})) if (typeof value === "string") params[key] = value;
	for (const item of event.action?.parameters ?? []) if (typeof item.key === "string" && typeof item.value === "string") params[item.key] = item.value;
	if (params[GOOGLECHAT_APPROVAL_ACTION_PARAM] !== GOOGLECHAT_APPROVAL_ACTION_VALUE) return null;
	const actionName = normalizeOptionalString(event.action?.actionMethodName) ?? normalizeOptionalString(event.common?.invokedFunction) ?? normalizeOptionalString(event.commonEventObject?.invokedFunction);
	if (actionName && actionName !== "openclaw.approval" && !actionName.startsWith("https://")) return null;
	return normalizeOptionalString(params[GOOGLECHAT_APPROVAL_TOKEN_PARAM]) ?? null;
}
function registerGoogleChatApprovalCardBinding(binding) {
	if (!googleChatApprovalControls.register(binding)) return false;
	registerGoogleChatManualApprovalFollowupSuppression({
		approvalId: binding.approvalId,
		approvalKind: binding.approvalKind,
		allowedDecisions: binding.allowedDecisions,
		expiresAtMs: binding.expiresAtMs
	});
	return true;
}
function normalizeApprovalRef(value) {
	return value.trim().toLowerCase() || null;
}
function registerGoogleChatManualApprovalFollowupSuppression(suppression) {
	if (suppression.expiresAtMs <= Date.now()) return false;
	const key = normalizeApprovalRef(suppression.approvalId);
	if (!key) return false;
	manualApprovalFollowupSuppressions.delete(key);
	manualApprovalFollowupSuppressions.set(key, suppression);
	pruneMapToMaxSize(manualApprovalFollowupSuppressions, GOOGLECHAT_MANUAL_APPROVAL_SUPPRESSION_MAX_ENTRIES);
	return true;
}
function unregisterGoogleChatManualApprovalFollowupSuppression(approvalId) {
	const key = normalizeApprovalRef(approvalId);
	if (key) manualApprovalFollowupSuppressions.delete(key);
}
function approvalRefMatches(bindingApprovalId, approvalRef) {
	const normalizedBindingId = normalizeApprovalRef(bindingApprovalId);
	const normalizedRef = normalizeApprovalRef(approvalRef);
	if (!normalizedBindingId || !normalizedRef) return false;
	return normalizedRef === normalizedBindingId || normalizedRef.length >= 8 && normalizedBindingId.startsWith(normalizedRef);
}
function pruneExpiredGoogleChatApprovalCardBindings(nowMs) {
	googleChatApprovalControls.pruneExpired(nowMs);
	for (const [approvalId, suppression] of manualApprovalFollowupSuppressions) if (suppression.expiresAtMs <= nowMs) manualApprovalFollowupSuppressions.delete(approvalId);
}
function hasActiveGoogleChatExecApprovalCardForManualCommand(params) {
	pruneExpiredGoogleChatApprovalCardBindings(params.nowMs);
	for (const entries of [googleChatApprovalControls.values(), manualApprovalFollowupSuppressions.values()]) for (const binding of entries) if (binding.approvalKind === "exec" && binding.allowedDecisions.includes(params.decision) && approvalRefMatches(binding.approvalId, params.approvalRef)) return true;
	return false;
}
function shouldSuppressGoogleChatManualExecApprovalFollowupText(text, nowMs = Date.now()) {
	for (const match of text.matchAll(MANUAL_EXEC_APPROVAL_COMMAND_RE)) {
		const approvalRef = match[1];
		const decision = match[2]?.toLowerCase();
		if (approvalRef && decision && hasActiveGoogleChatExecApprovalCardForManualCommand({
			approvalRef,
			decision,
			nowMs
		})) return true;
	}
	return false;
}
function hasStructuredPayloadPart(payload) {
	return Boolean(payload.mediaUrl?.trim() || payload.mediaUrls?.some((url) => url.trim()) || payload.presentation || payload.interactive || payload.btw || payload.spokenText || payload.ttsSupplement);
}
function shouldSuppressGoogleChatManualExecApprovalFollowupPayload(payload) {
	const text = payload.text?.trim();
	if (!text || hasStructuredPayloadPart(payload)) return false;
	return shouldSuppressGoogleChatManualExecApprovalFollowupText(text);
}
// extensions/googlechat/src/google-auth.runtime.ts
const GOOGLE_AUTH_POLICY = buildHostnameAllowlistPolicyFromSuffixAllowlist(["accounts.google.com", "googleapis.com"]);
const GOOGLE_AUTH_FETCH_TIMEOUT_MS = 3e4;
const GOOGLE_AUTH_URI = "https://accounts.google.com/o/oauth2/auth";
const GOOGLE_AUTH_PROVIDER_CERTS_URL = "https://www.googleapis.com/oauth2/v1/certs";
const GOOGLE_AUTH_TOKEN_URI = "https://oauth2.googleapis.com/token";
const GOOGLE_AUTH_UNIVERSE_DOMAIN = "googleapis.com";
const GOOGLE_CLIENT_CERTS_URL_PREFIX = "https://www.googleapis.com/robot/v1/metadata/x509/";
const MAX_GOOGLE_AUTH_RESPONSE_BYTES = 1048576;
let googleAuthRuntimePromise = null;
function hasProxyAgentShape(value) {
	const record = asNullableObjectRecord(value);
	return record !== null && record.proxy instanceof URL;
}
function hasTlsAgentShape(value) {
	const record = asNullableObjectRecord(value);
	return record !== null && asNullableObjectRecord(record.options) !== null;
}
function hasTlsOptions(options) {
	return options.cert !== void 0 || options.key !== void 0;
}
function resolveGoogleAuthTlsOptions(init, agent) {
	const explicit = {
		cert: init.cert,
		key: init.key
	};
	if (hasTlsOptions(explicit)) return explicit;
	if (hasProxyAgentShape(agent)) return {
		cert: agent.connectOpts?.cert,
		key: agent.connectOpts?.key
	};
	if (hasTlsAgentShape(agent)) return {
		cert: agent.options?.cert,
		key: agent.options?.key
	};
	return {};
}
function readOptionalTrimmedString(record, fieldName) {
	const value = record[fieldName];
	if (value === void 0 || value === null) return;
	if (typeof value !== "string") throw new Error(`Google Chat service account field "${fieldName}" must be a string`);
	const trimmed = value.trim();
	if (!trimmed) throw new Error(`Google Chat service account field "${fieldName}" cannot be empty`);
	return trimmed;
}
function readRequiredTrimmedString(record, fieldName) {
	const value = readOptionalTrimmedString(record, fieldName);
	if (value === void 0) throw new Error(`Google Chat service account is missing "${fieldName}"`);
	return value;
}
function assertExactField(record, fieldName, expectedUrl) {
	const value = readOptionalTrimmedString(record, fieldName);
	if (!value) return;
	if (value !== expectedUrl) throw new Error(`Google Chat service account field "${fieldName}" must be ${expectedUrl}, got ${value}`);
}
function validateGoogleChatServiceAccountCredentials(credentials) {
	const type = readOptionalTrimmedString(credentials, "type");
	if (type && type !== "service_account") throw new Error(`Google Chat credentials must use service_account auth, got "${type}" instead`);
	const clientEmail = readRequiredTrimmedString(credentials, "client_email");
	const privateKey = readRequiredTrimmedString(credentials, "private_key");
	assertExactField(credentials, "universe_domain", GOOGLE_AUTH_UNIVERSE_DOMAIN);
	assertExactField(credentials, "auth_uri", GOOGLE_AUTH_URI);
	assertExactField(credentials, "auth_provider_x509_cert_url", GOOGLE_AUTH_PROVIDER_CERTS_URL);
	assertExactField(credentials, "token_uri", GOOGLE_AUTH_TOKEN_URI);
	const certUrl = readOptionalTrimmedString(credentials, "client_x509_cert_url");
	if (certUrl && !certUrl.startsWith(GOOGLE_CLIENT_CERTS_URL_PREFIX)) throw new Error(`Google Chat service account field "client_x509_cert_url" must start with ${GOOGLE_CLIENT_CERTS_URL_PREFIX}, got ${certUrl}`);
	return {
		...credentials,
		client_email: clientEmail,
		private_key: privateKey
	};
}
function sanitizeCredentialFileReadError(error) {
	return /* @__PURE__ */ new Error(extractErrorCode(error) === "too-large" ? `Google Chat service account file exceeds ${MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES} bytes.` : "Failed to load Google Chat service account file.");
}
async function readCredentialsFile(filePath) {
	const resolvedPath = resolveUserPath(filePath);
	if (!resolvedPath) throw new Error("Google Chat service account file path is empty");
	let handle;
	try {
		handle = await fs.open(resolvedPath, "r");
	} catch (error) {
		throw sanitizeCredentialFileReadError(error);
	}
	try {
		if (!(await handle.stat()).isFile()) throw new Error("Google Chat service account file must be a regular file.");
		let raw;
		try {
			raw = (await readFileHandleBounded(handle, MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES)).toString("utf8");
		} catch (error) {
			throw sanitizeCredentialFileReadError(error);
		}
		let parsed;
		try {
			parsed = JSON.parse(raw);
		} catch {
			throw new Error("Invalid Google Chat service account JSON.");
		}
		if (!isRecord(parsed)) throw new Error("Google Chat service account file must contain a JSON object.");
		return parsed;
	} finally {
		await handle.close().catch(() => {});
	}
}
function sanitizeGoogleAuthInit(init) {
	if (!init) return;
	const nextInit = { ...init };
	delete nextInit.agent;
	delete nextInit.cert;
	delete nextInit.dispatcher;
	delete nextInit.fetchImplementation;
	delete nextInit.key;
	delete nextInit.noProxy;
	delete nextInit.proxy;
	return nextInit;
}
function resolveGoogleAuthDispatcherPolicy(input, init) {
	const requestUrl = input instanceof Request ? new URL(input.url) : new URL(typeof input === "string" ? input : input.toString());
	const nextInit = sanitizeGoogleAuthInit(init);
	const googleAuthInit = init ?? {};
	const agent = typeof googleAuthInit.agent === "function" ? googleAuthInit.agent(requestUrl) : googleAuthInit.agent;
	const tlsOptions = resolveGoogleAuthTlsOptions(googleAuthInit, agent);
	if (hasProxyAgentShape(agent)) return {
		dispatcherPolicy: {
			allowPrivateProxy: true,
			mode: "explicit-proxy",
			proxyUrl: agent.proxy.toString(),
			...hasTlsOptions(tlsOptions) ? { proxyTls: tlsOptions } : {}
		},
		init: nextInit
	};
	return {
		dispatcherPolicy: {
			mode: "direct",
			...hasTlsOptions(tlsOptions) ? { connect: tlsOptions } : {}
		},
		init: nextInit
	};
}
async function googleAuthFetch(input, init) {
	const url = input instanceof Request ? input.url : String(input);
	const guardedOptions = resolveGoogleAuthDispatcherPolicy(input, init);
	const { response, release } = await fetchWithSsrFGuard({
		auditContext: "googlechat.auth.google-auth",
		dispatcherPolicy: guardedOptions.dispatcherPolicy,
		init: guardedOptions.init,
		policy: GOOGLE_AUTH_POLICY,
		signal: guardedOptions.init?.signal ?? void 0,
		timeoutMs: GOOGLE_AUTH_FETCH_TIMEOUT_MS,
		url
	});
	try {
		const body = await readGoogleAuthResponseBytes(response);
		const bufferedBody = Uint8Array.from(body);
		return new Response(bufferedBody.buffer, {
			headers: response.headers,
			status: response.status,
			statusText: response.statusText
		});
	} finally {
		response.body?.cancel().catch(() => void 0);
		await release();
	}
}
async function readGoogleAuthResponseBytes(response) {
	const contentLengthHeader = response.headers.get("content-length");
	if (contentLengthHeader) {
		const contentLength = parseMediaContentLength(contentLengthHeader);
		if (contentLength !== null && contentLength > MAX_GOOGLE_AUTH_RESPONSE_BYTES) throw new Error(`Google auth response exceeds ${MAX_GOOGLE_AUTH_RESPONSE_BYTES} bytes.`);
	}
	if (!response.body) throw new Error("Google auth response body stream unavailable; refusing to buffer unbounded response.");
	return await readResponseWithLimit(response, MAX_GOOGLE_AUTH_RESPONSE_BYTES, { onOverflow: () => /* @__PURE__ */ new Error(`Google auth response exceeds ${MAX_GOOGLE_AUTH_RESPONSE_BYTES} bytes.`) });
}
async function loadGoogleAuthRuntime() {
	googleAuthRuntimePromise ??= import("google-auth-library").catch((error) => {
		googleAuthRuntimePromise = null;
		throw error;
	});
	return await googleAuthRuntimePromise;
}
async function getGoogleAuthTransport() {
	const { gaxios } = await loadGoogleAuthRuntime();
	return new gaxios.Gaxios({ fetchImplementation: googleAuthFetch });
}
async function resolveValidatedGoogleChatCredentials(account) {
	if (account.credentials) return validateGoogleChatServiceAccountCredentials(account.credentials);
	if (account.credentialsFile) return validateGoogleChatServiceAccountCredentials(await readCredentialsFile(account.credentialsFile));
	return null;
}
// extensions/googlechat/src/auth.ts
const CHAT_SCOPE = "https://www.googleapis.com/auth/chat.bot";
const CHAT_ISSUER = "chat@system.gserviceaccount.com";
const ADDON_ISSUER_PATTERN = /^service-\d+@gcp-sa-gsuiteaddons\.iam\.gserviceaccount\.com$/;
const CHAT_CERTS_URL = "https://www.googleapis.com/service_accounts/v1/metadata/x509/chat@system.gserviceaccount.com";
const GOOGLECHAT_CERT_FETCH_TIMEOUT_MS = 3e4;
const MAX_AUTH_CACHE_SIZE = 32;
const authCache = /* @__PURE__ */ new Map();
let cachedCerts = null;
let verifyClientPromise = null;
async function getVerifyClient() {
	verifyClientPromise ??= (async () => {
		const { OAuth2Client } = await loadGoogleAuthRuntime();
		return new OAuth2Client({ transporter: await getGoogleAuthTransport() });
	})().catch((error) => {
		verifyClientPromise = null;
		throw error;
	});
	return await verifyClientPromise;
}
function buildAuthKey(account) {
	if (account.credentialsFile) return `file:${account.credentialsFile}`;
	if (account.credentials) return `inline:${JSON.stringify(account.credentials)}`;
	return "none";
}
async function getAuthInstance(account) {
	const key = buildAuthKey(account);
	const cached = authCache.get(account.accountId);
	if (cached && cached.key === key) return cached.auth;
	const [{ GoogleAuth }, transporter, credentials] = await Promise.all([
		loadGoogleAuthRuntime(),
		getGoogleAuthTransport(),
		resolveValidatedGoogleChatCredentials(account)
	]);
	const auth = new GoogleAuth({
		...credentials ? { credentials } : {},
		clientOptions: { transporter },
		scopes: [CHAT_SCOPE]
	});
	authCache.set(account.accountId, {
		key,
		auth
	});
	pruneMapToMaxSize(authCache, MAX_AUTH_CACHE_SIZE);
	return auth;
}
async function getGoogleChatAccessToken(account) {
	const access = await (await (await getAuthInstance(account)).getClient()).getAccessToken();
	const token = typeof access === "string" ? access : access?.token;
	if (!token) throw new Error("Missing Google Chat access token");
	return token;
}
async function fetchChatCerts() {
	const now = Date.now();
	if (cachedCerts && now - cachedCerts.fetchedAt < 6e5) return cachedCerts.certs;
	const { response, release } = await fetchWithSsrFGuard({
		url: CHAT_CERTS_URL,
		auditContext: "googlechat.auth.certs",
		timeoutMs: GOOGLECHAT_CERT_FETCH_TIMEOUT_MS
	});
	try {
		if (!response.ok) throw new Error(`Failed to fetch Chat certs (${response.status})`);
		const certs = await readProviderJsonResponse(response, "Google Chat cert fetch failed");
		cachedCerts = {
			fetchedAt: now,
			certs
		};
		return certs;
	} finally {
		await release();
	}
}
async function verifyGoogleChatRequest(params) {
	const bearer = params.bearer?.trim();
	if (!bearer) return {
		ok: false,
		reason: "missing token"
	};
	const audience = params.audience?.trim();
	if (!audience) return {
		ok: false,
		reason: "missing audience"
	};
	const audienceType = params.audienceType ?? null;
	if (audienceType !== "app-url" && audienceType !== "project-number") return {
		ok: false,
		reason: "unsupported audience type"
	};
	try {
		const verifyClient = await getVerifyClient();
		if (audienceType === "app-url") {
			const payload = (await verifyClient.verifyIdToken({
				idToken: bearer,
				audience
			})).getPayload();
			const email = normalizeLowercaseStringOrEmpty(payload?.email ?? "");
			if (!payload?.email_verified) return {
				ok: false,
				reason: "email not verified"
			};
			if (email === CHAT_ISSUER) return { ok: true };
			if (!ADDON_ISSUER_PATTERN.test(email)) return {
				ok: false,
				reason: `invalid issuer: ${email}`
			};
			const expectedAddOnPrincipal = normalizeLowercaseStringOrEmpty(params.expectedAddOnPrincipal ?? "");
			if (!expectedAddOnPrincipal) return {
				ok: false,
				reason: "missing add-on principal binding"
			};
			const tokenPrincipal = normalizeLowercaseStringOrEmpty(payload?.sub ?? "");
			if (!tokenPrincipal || tokenPrincipal !== expectedAddOnPrincipal) return {
				ok: false,
				reason: `unexpected add-on principal: ${tokenPrincipal || "<missing>"}`
			};
			return { ok: true };
		}
		const certs = await fetchChatCerts();
		await verifyClient.verifySignedJwtWithCertsAsync(bearer, certs, audience, [CHAT_ISSUER]);
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			reason: err instanceof Error ? err.message : "invalid token"
		};
	}
}
// extensions/googlechat/src/api.ts
const CHAT_API_BASE = "https://chat.googleapis.com/v1";
const GOOGLECHAT_API_TIMEOUT_MS = 3e4;
const GOOGLECHAT_MEDIA_TIMEOUT_GRACE_MS = 3e4;
const GOOGLECHAT_MEDIA_MIN_BYTES_PER_SECOND = 262144;
const GOOGLECHAT_MEDIA_MAX_TIMEOUT_MS = 9e5;
const GOOGLECHAT_RESPONSE_READ_IDLE_TIMEOUT_MS = 3e4;
const GOOGLECHAT_JSON_RESPONSE_MAX_BYTES = 16777216;
const GOOGLECHAT_ERROR_BODY_MAX_BYTES = 16384;
var GoogleChatApiError = class extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
		this.name = "GoogleChatApiError";
	}
};
function resolveGoogleChatMediaTimeoutMs(maxBytes) {
	const transferMs = Math.ceil(maxBytes / GOOGLECHAT_MEDIA_MIN_BYTES_PER_SECOND * 1e3);
	return Math.min(GOOGLECHAT_MEDIA_TIMEOUT_GRACE_MS + transferMs, GOOGLECHAT_MEDIA_MAX_TIMEOUT_MS);
}
async function readGoogleChatErrorResponse(response) {
	const text = await readResponseTextSnippet(response, {
		maxBytes: GOOGLECHAT_ERROR_BODY_MAX_BYTES,
		maxChars: GOOGLECHAT_ERROR_BODY_MAX_BYTES,
		chunkTimeoutMs: GOOGLECHAT_RESPONSE_READ_IDLE_TIMEOUT_MS,
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Google Chat API error response stalled after ${chunkTimeoutMs}ms`)
	}).catch(formatErrorMessage) ?? "";
	return redactToolPayloadText(text);
}
async function withGoogleChatResponse(params) {
	const { account, url, init, auditContext, timeoutMs = GOOGLECHAT_API_TIMEOUT_MS, handleResponse, assertDirectAdapterHandoff, onPlatformSendDispatch } = params;
	assertDirectAdapterHandoff?.();
	const token = await getGoogleChatAccessToken(account);
	if (onPlatformSendDispatch) {
		assertDirectAdapterHandoff?.();
		await onPlatformSendDispatch();
	}
	const { response, release } = await fetchWithSsrFGuard({
		url,
		init: {
			...init,
			headers: {
				...init?.headers,
				Authorization: `Bearer ${token}`
			}
		},
		auditContext,
		timeoutMs,
		beforeRequest: assertDirectAdapterHandoff
	});
	try {
		if (!response.ok) {
			const text = await readGoogleChatErrorResponse(response);
			throw new GoogleChatApiError(response.status, `Google Chat API ${response.status}: ${text || response.statusText}`);
		}
		return await handleResponse(response);
	} finally {
		if (!response.bodyUsed) response.body?.cancel().catch(() => void 0);
		await release();
	}
}
async function fetchJson(account, url, init, hooks) {
	return await withGoogleChatResponse({
		...hooks,
		account,
		url,
		init: {
			...init,
			headers: { "Content-Type": "application/json" }
		},
		auditContext: "googlechat.api.json",
		handleResponse: async (response) => await readProviderJsonResponse(response, "Google Chat API request failed", {
			maxBytes: GOOGLECHAT_JSON_RESPONSE_MAX_BYTES,
			chunkTimeoutMs: GOOGLECHAT_RESPONSE_READ_IDLE_TIMEOUT_MS,
			onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Google Chat API request failed: response body stalled after ${chunkTimeoutMs}ms`)
		})
	});
}
async function downloadGoogleChatMedia(params) {
	const { account, resourceName, maxBytes } = params;
	return await withGoogleChatResponse({
		account,
		url: `${CHAT_API_BASE}/media/${resourceName}?alt=media`,
		auditContext: "googlechat.api.buffer",
		timeoutMs: resolveGoogleChatMediaTimeoutMs(maxBytes),
		handleResponse: async (res) => {
			const lengthHeader = res.headers.get("content-length");
			if (lengthHeader) {
				const length = parseMediaContentLength(lengthHeader);
				if (length !== null && length > maxBytes) throw new MediaFetchError("max_bytes", `Google Chat media exceeds max bytes (${maxBytes})`);
			}
			return {
				buffer: await readResponseWithLimit(res, maxBytes, {
					chunkTimeoutMs: GOOGLECHAT_RESPONSE_READ_IDLE_TIMEOUT_MS,
					onOverflow: () => new MediaFetchError("max_bytes", `Google Chat media exceeds max bytes (${maxBytes})`)
				}),
				contentType: res.headers.get("content-type") ?? void 0
			};
		}
	});
}
function isUsableGoogleChatThreadName(thread, space) {
	return /^spaces\/[^/]+\/threads\/[^/]+$/.test(thread) && thread.startsWith(`${space}/threads/`);
}
async function sendGoogleChatMessage(params) {
	const { account, space, text, thread, cardsV2 } = params;
	const usableThread = thread && isUsableGoogleChatThreadName(thread, space) ? thread : void 0;
	if (text && (!cardsV2 || cardsV2.length === 0) && shouldSuppressGoogleChatManualExecApprovalFollowupText(text)) return null;
	const urlObj = new URL(`${CHAT_API_BASE}/${space}/messages`);
	if (usableThread) urlObj.searchParams.set("messageReplyOption", "REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD");
	const result = await fetchJson(account, urlObj.toString(), {
		method: "POST",
		body: JSON.stringify({
			text: text || void 0,
			cardsV2: cardsV2?.length ? cardsV2 : void 0,
			thread: usableThread ? { name: usableThread } : void 0
		})
	}, {
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
		onPlatformSendDispatch: params.onPlatformSendDispatch
	});
	return result ? {
		messageName: result.name,
		threadName: result.thread?.name
	} : null;
}
async function updateGoogleChatMessage(params) {
	const { account, messageName, text, cardsV2 } = params;
	const updateMask = [...text !== void 0 ? ["text"] : [], ...cardsV2 !== void 0 ? ["cardsV2"] : []];
	if (updateMask.length === 0) throw new Error("Google Chat message update requires text or cardsV2.");
	return { messageName: (await fetchJson(account, `${CHAT_API_BASE}/${messageName}?updateMask=${updateMask.join(",")}`, {
		method: "PATCH",
		body: JSON.stringify({
			text,
			cardsV2
		})
	})).name };
}
async function deleteGoogleChatMessage(params) {
	const { account, messageName } = params;
	await withGoogleChatResponse({
		account,
		url: `${CHAT_API_BASE}/${messageName}`,
		init: { method: "DELETE" },
		auditContext: "googlechat.api.ok",
		handleResponse: async () => void 0
	});
}
async function findGoogleChatDirectMessage(params) {
	const { account, userName } = params;
	const url = new URL(`${CHAT_API_BASE}/spaces:findDirectMessage`);
	url.searchParams.set("name", userName);
	return await fetchJson(account, url.toString(), { method: "GET" }, { assertDirectAdapterHandoff: params.assertDirectAdapterHandoff });
}
async function getGoogleChatSpace(params) {
	return await fetchJson(params.account, `${CHAT_API_BASE}/${params.spaceName}`, { method: "GET" }, { assertDirectAdapterHandoff: params.assertDirectAdapterHandoff });
}
async function probeGoogleChat(account) {
	try {
		const url = new URL(`${CHAT_API_BASE}/spaces`);
		url.searchParams.set("pageSize", "1");
		await fetchJson(account, url.toString(), { method: "GET" });
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
// extensions/googlechat/src/targets.ts
function normalizeGoogleChatTarget(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	const normalized = trimmed.replace(/^(googlechat|google-chat|gchat):/i, "").replace(/^user:(users\/)?/i, "users/").replace(/^space:(spaces\/)?/i, "spaces/");
	if (isGoogleChatUserTarget(normalized)) {
		const suffix = normalized.slice(6);
		return suffix.includes("@") ? `users/${normalizeLowercaseStringOrEmpty(suffix)}` : normalized;
	}
	if (isGoogleChatSpaceTarget(normalized)) return normalized;
	if (normalized.includes("@")) return `users/${normalizeLowercaseStringOrEmpty(normalized)}`;
	return normalized;
}
function isGoogleChatUserTarget(value) {
	return normalizeLowercaseStringOrEmpty(value).startsWith("users/");
}
function isGoogleChatSpaceTarget(value) {
	return normalizeLowercaseStringOrEmpty(value).startsWith("spaces/");
}
function resolveGoogleChatSpaceChatType(space) {
	const spaceType = (space.spaceType ?? "").toUpperCase();
	if (spaceType === "DIRECT_MESSAGE") return "direct";
	if (spaceType === "SPACE" || spaceType === "GROUP_CHAT") return "group";
	if (space.singleUserBotDm === true || (space.type ?? "").toUpperCase() === "DM") return "direct";
	if ((space.type ?? "").toUpperCase() === "ROOM") return "group";
}
function isGoogleChatGroupSpace(space) {
	return resolveGoogleChatSpaceChatType(space) !== "direct";
}
function stripMessageSuffix(target) {
	const index = target.indexOf("/messages/");
	if (index === -1) return target;
	return target.slice(0, index);
}
async function resolveGoogleChatOutboundSpaceDetails(params) {
	const normalized = normalizeGoogleChatTarget(params.target);
	if (!normalized) throw new Error("Missing Google Chat target.");
	const base = stripMessageSuffix(normalized);
	if (isGoogleChatUserTarget(base)) {
		const dm = await findGoogleChatDirectMessage({
			account: params.account,
			userName: base,
			assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
		});
		if (!dm?.name) throw new Error(`No Google Chat DM found for ${base}`);
		return {
			name: dm.name,
			resource: dm
		};
	}
	return { name: base };
}
async function resolveGoogleChatOutboundSpace(params) {
	return (await resolveGoogleChatOutboundSpaceDetails(params)).name;
}
async function resolveGoogleChatOutboundSessionRoute(params) {
	const account = resolveGoogleChatAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const resolvedSpace = await resolveGoogleChatOutboundSpaceDetails({
		account,
		target: params.target,
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
	});
	const spaceName = resolvedSpace.name;
	if (!isGoogleChatSpaceTarget(spaceName)) return null;
	let chatType = resolvedSpace.resource ? resolveGoogleChatSpaceChatType(resolvedSpace.resource) : void 0;
	if (!chatType) try {
		chatType = resolveGoogleChatSpaceChatType(await getGoogleChatSpace({
			account,
			spaceName,
			assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
		}));
	} catch {
		return null;
	}
	if (!chatType) return null;
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "googlechat",
		accountId: params.accountId,
		recipientSessionExact: true,
		peer: {
			kind: chatType,
			id: spaceName
		},
		chatType,
		from: `googlechat:${spaceName}`,
		to: spaceName
	});
}
// extensions/googlechat/src/format.ts
const GOOGLE_CHAT_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "markdown",
	constructs: {
		underline: "fallback",
		spoiler: "fallback",
		codeLanguage: "fallback",
		heading: "fallback",
		orderedList: "fallback",
		taskList: "fallback",
		table: "fallback",
		image: "fallback",
		mention: "strip"
	},
	chunk: {
		limit: 32e3,
		unit: "bytes"
	}
});
const GOOGLE_CHAT_LITERAL_FALLBACKS = /* @__PURE__ */ new Map([
	["*", "＊"],
	["_", "＿"],
	["~", "～"],
	["`", "｀"],
	["<", "＜"],
	[">", "＞"],
	["\\", "＼"],
	["-", "－"],
	["|", "｜"]
]);
/** Removes unsafe HTML and internal scaffolding while retaining source Markdown for chunking. */
function sanitizeGoogleChatText(text) {
	return sanitizeForPlainText(sanitizeAssistantVisibleText(text), { style: "markdown" });
}
function formatGoogleChatMediaText(text, mediaUrls) {
	const remoteUrls = mediaUrls.filter((value) => {
		if (value.split("").some((character) => character <= " " || character === "") || !/^https?:\/\//iu.test(value)) return false;
		try {
			return Boolean(new URL(value).hostname);
		} catch {
			return false;
		}
	});
	if (remoteUrls.length !== mediaUrls.length) throw new Error("Google Chat outbound attachments require remote HTTP(S) URLs.");
	return [text, formatTextWithAttachmentLinks(void 0, remoteUrls)].filter(Boolean).join("\n\n");
}
function isSelfLabeledLink(label, href) {
	return label === href || `mailto:${label}` === href;
}
/** Renders CommonMark into byte-bounded Google Chat app-message chunks. */
function formatGoogleChatTextChunks(text, limit = GOOGLE_CHAT_FORMAT_PROFILE.chunk.limit) {
	const sanitized = sanitizeGoogleChatText(text);
	let ir = markdownToIR(sanitized, {
		enableSpoilers: true,
		enableTaskLists: true,
		headingStyle: "rich",
		tableMode: "bullets"
	});
	{
		let codeText = ir.text;
		const styles = ir.styles.filter((span) => {
			const content = ir.text.slice(span.start, span.end);
			const unsafe = span.style === "code" && content.includes("`") || span.style === "code_block" && content.includes("```");
			if (unsafe) {
				const replacement = content.split("").map((character) => GOOGLE_CHAT_LITERAL_FALLBACKS.get(character) ?? character).join("");
				codeText = `${codeText.slice(0, span.start)}${replacement}${codeText.slice(span.end)}`;
			}
			return !unsafe;
		});
		ir = styles.length === ir.styles.length ? ir : {
			...ir,
			styles,
			text: codeText
		};
	}
	{
		const decodedText = ir.text.replace(/<(?:users|customEmojis)\/[^<>\s]+>/giu, (match) => `＜${match.slice(1, -1)}＞`);
		ir = decodedText === ir.text ? ir : {
			...ir,
			text: decodedText
		};
	}
	{
		const characters = ir.links.length > 0 ? ir.text.split("") : [];
		let changed = false;
		for (const link of ir.links) {
			if (isSelfLabeledLink(ir.text.slice(link.start, link.end), link.href)) continue;
			for (let index = link.start; index < link.end; index += 1) {
				const character = characters[index] ?? "";
				const fallback = GOOGLE_CHAT_LITERAL_FALLBACKS.get(character);
				if (fallback && /[<>|*_~`]/u.test(character)) {
					characters[index] = fallback;
					changed = true;
				}
			}
		}
		ir = changed ? {
			...ir,
			text: characters.join("")
		} : ir;
	}
	{
		const codeRanges = ir.styles.filter((span) => span.style === "code" || span.style === "code_block");
		const inCode = (index) => codeRanges.some((span) => index >= span.start && index < span.end);
		const inLink = (index) => ir.links.some((span) => index >= span.start && index < span.end);
		const styleDelimiter = /* @__PURE__ */ new Map([
			["~", "strikethrough"],
			["_", "italic"],
			["*", "bold"],
			["`", "code"]
		]);
		const characters = ir.text.split("");
		let lineStart = 0;
		while (lineStart < characters.length) {
			const nextNewline = characters.indexOf("\n", lineStart);
			const lineEnd = nextNewline < 0 ? characters.length : nextNewline;
			for (const delimiter of [
				"~",
				"_",
				"*",
				"`"
			]) {
				const indexes = [];
				for (let index = lineStart; index < lineEnd; index += 1) if (characters[index] === delimiter && !inCode(index) && !inLink(index)) indexes.push(index);
				if (indexes.length === 0) continue;
				const renderedStyle = styleDelimiter.get(delimiter);
				const lineAddsDelimiter = ir.styles.some((span) => span.style === renderedStyle && span.start < lineEnd && span.end > lineStart);
				if (indexes.length >= 2 || lineAddsDelimiter) for (const index of indexes) characters[index] = GOOGLE_CHAT_LITERAL_FALLBACKS.get(delimiter) ?? delimiter;
			}
			let firstTextIndex = lineStart;
			while (firstTextIndex < lineEnd && characters[firstTextIndex] === " ") firstTextIndex += 1;
			if (!inCode(firstTextIndex)) {
				const character = characters[firstTextIndex];
				if ((character === "*" || character === "-") && characters[firstTextIndex + 1] === " " || character === ">") characters[firstTextIndex] = GOOGLE_CHAT_LITERAL_FALLBACKS.get(character) ?? character;
			}
			const line = characters.slice(lineStart, lineEnd).join("");
			for (const match of line.matchAll(/<[^<>\n]*\|[^<>\n]*>/gu)) {
				const open = lineStart + (match.index ?? 0);
				const close = open + match[0].length - 1;
				if (!inCode(open) && !inCode(close) && !inLink(open) && !inLink(close)) {
					characters[open] = "＜";
					characters[close] = "＞";
				}
			}
			lineStart = lineEnd + 1;
		}
		const literalText = characters.join("");
		ir = literalText === ir.text ? ir : {
			...ir,
			text: literalText
		};
	}
	const markerText = ir.text;
	let candidate = 0;
	const rangeSize = 6400;
	const nextMarker = () => {
		while (true) {
			const marker = String.fromCharCode(57344 + Math.floor(candidate / rangeSize), 57344 + candidate % rangeSize);
			candidate += 1;
			if (!markerText.includes(marker)) return marker;
		}
	};
	const markers = {
		list: nextMarker(),
		blockquoteOpen: nextMarker(),
		blockquoteClose: nextMarker()
	};
	{
		const markerToken = markers.list;
		let characters;
		for (const item of ir.listItems ?? []) {
			const marker = item.listMarker;
			if (item.kind !== "bullet" || !marker || marker.end !== marker.start + 2 || ir.text[marker.start] !== "•" || ir.text[marker.start + 1] !== " ") continue;
			characters ??= ir.text.split("");
			characters[marker.start] = markerToken[0] ?? "";
			characters[marker.start + 1] = markerToken[1] ?? "";
		}
		ir = characters ? {
			...ir,
			text: characters.join("")
		} : ir;
	}
	return renderMarkdownIRChunksWithinLimit({
		ir,
		limit: Math.min(limit, GOOGLE_CHAT_FORMAT_PROFILE.chunk.limit),
		measureRendered: (rendered) => Buffer.byteLength(rendered, "utf8"),
		renderChunk: (chunkIr) => {
			const rendered = renderMarkdownWithMarkers(chunkIr, {
				styleMarkers: {
					bold: {
						open: "*",
						close: "*"
					},
					italic: {
						open: "_",
						close: "_"
					},
					strikethrough: {
						open: "~",
						close: "~"
					},
					code: {
						open: "`",
						close: "`"
					},
					code_block: {
						open: "```\n",
						close: "```"
					},
					blockquote: {
						open: markers.blockquoteOpen,
						close: markers.blockquoteClose
					}
				},
				escapeText: (value) => value,
				buildLink: (link, value, context) => {
					if (context.origin === "linkify") return null;
					const href = link.href.trim();
					const label = value.slice(link.start, link.end);
					if (!href || !label) return null;
					const labelHasStyles = chunkIr.styles.some((span) => span.start < link.end && span.end > link.start);
					if (!/[<>|]/u.test(href) && !/[<>|*_~`]/u.test(label) && !labelHasStyles) return {
						start: link.start,
						end: link.end,
						open: `<${href}|`,
						close: ">"
					};
					return isSelfLabeledLink(label, href) ? null : {
						start: link.end,
						end: link.end,
						open: "",
						close: ` (${href})`
					};
				}
			}, GOOGLE_CHAT_FORMAT_PROFILE);
			let depth = 0;
			let lineStart = true;
			let blockquoteText = "";
			for (let index = 0; index < rendered.length; index += 1) {
				if (rendered.startsWith(markers.blockquoteOpen, index)) {
					depth += 1;
					index += markers.blockquoteOpen.length - 1;
					continue;
				}
				if (rendered.startsWith(markers.blockquoteClose, index)) {
					depth = Math.max(0, depth - 1);
					index += markers.blockquoteClose.length - 1;
					continue;
				}
				const character = rendered[index] ?? "";
				if (lineStart && depth > 0) blockquoteText += "> ".repeat(depth);
				blockquoteText += character;
				lineStart = character === "\n";
			}
			const markerToken = markers.list;
			return blockquoteText.split("\n").map((line) => {
				const markerIndex = line.indexOf(markerToken);
				if (markerIndex < 0) return line;
				const prefix = line.slice(0, markerIndex);
				const quote = /^(?:> )*/u.exec(prefix)?.[0] ?? "";
				const indent = prefix.slice(quote.length);
				return `${quote}${" ".repeat(indent.length * 2)}* ${line.slice(markerIndex + markerToken.length)}`;
			}).join("\n");
		}
	}).map((chunk) => chunk.rendered);
}
// extensions/googlechat/src/group-policy.ts
function buildGoogleChatGroupPolicyScope(params) {
	const matchKey = params.groupId && Object.hasOwn(params.tree.scopes, params.groupId) ? params.groupId : void 0;
	return {
		tree: params.tree,
		path: matchKey ? [matchKey] : [],
		matchKey
	};
}
function resolveGoogleChatGroupRequireMention(params) {
	return resolveScopeRequireMention(buildGoogleChatGroupPolicyScope({
		tree: buildChannelGroupsScopeTree(params.cfg, "googlechat", params.accountId),
		groupId: params.groupId
	}));
}
// extensions/googlechat/src/ingress-identity.ts
function normalizeGoogleChatUserId(raw) {
	const trimmed = normalizeOptionalString(raw) ?? "";
	return normalizeLowercaseStringOrEmpty(trimmed.replace(/^users\//i, ""));
}
const googleChatIngressIdentity = defineStableChannelIngressIdentity({
	key: "sender-id",
	authentication: "verified",
	normalizeEntry(entry) {
		const withoutProvider = normalizeLowercaseStringOrEmpty(entry).replace(/^(googlechat|google-chat|gchat):/i, "");
		if (!withoutProvider) return null;
		return withoutProvider.startsWith("users/") ? normalizeGoogleChatUserId(withoutProvider) : withoutProvider;
	},
	normalizeSubject: normalizeGoogleChatUserId,
	aliases: [{
		key: "email",
		kind: "plugin:googlechat-email",
		normalizeEntry(entry) {
			const withoutProvider = normalizeLowercaseStringOrEmpty(entry).replace(/^(googlechat|google-chat|gchat):/i, "");
			if (withoutProvider.startsWith("users/")) return null;
			return withoutProvider.includes("@") ? withoutProvider : null;
		},
		normalizeSubject: normalizeLowercaseStringOrEmpty,
		authentication: "mutable"
	}],
	isWildcardEntry: (entry) => normalizeLowercaseStringOrEmpty(entry) === "*",
	resolveEntryId: ({ entryIndex, fieldKey }) => fieldKey === "stableId" ? `entry-${entryIndex + 1}:user` : `entry-${entryIndex + 1}:${fieldKey}`
});
// extensions/googlechat/src/channel.adapters.ts
const loadGoogleChatChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-B_9ty5Gl.mjs"), "googleChatChannelRuntime");
const collectGoogleChatGroupPolicyWarnings = createAllowlistProviderOpenWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.googlechat !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	buildOpenWarning: {
		surface: "Google Chat spaces",
		openBehavior: "allows any space to trigger (mention-gated)",
		remediation: "Set channels.googlechat.groupPolicy=\"allowlist\" and configure channels.googlechat.groups"
	}
});
const collectGoogleChatOpenGroupFindings = createConditionalWarningCollector.findings({
	collectWarnings: collectGoogleChatGroupPolicyWarnings,
	checkId: "channels.googlechat.groups.open",
	severity: "warn",
	title: "Google Chat security warning"
});
const collectGoogleChatSecurityWarnings = (params) => [...collectGoogleChatOpenGroupFindings(params), ...params.account.config.dmPolicy === "open" ? ["- Google Chat DMs are open to anyone. Set channels.googlechat.dmPolicy=\"pairing\" or \"allowlist\"."] : []];
const googlechatGroupsAdapter = { resolveRequireMention: resolveGoogleChatGroupRequireMention };
const googlechatDirectoryAdapter = createChannelDirectoryAdapter({
	listPeers: async (params) => listResolvedDirectoryUserEntriesFromAllowFrom({
		...params,
		resolveAccount: adaptScopedAccountAccessor(resolveGoogleChatAccount),
		resolveAllowFrom: (account) => account.config.allowFrom,
		normalizeId: (entry) => normalizeGoogleChatTarget(entry) ?? entry
	}),
	listGroups: async (params) => listResolvedDirectoryGroupEntriesFromMapKeys({
		...params,
		resolveAccount: adaptScopedAccountAccessor(resolveGoogleChatAccount),
		resolveGroups: (account) => account.config.groups
	})
});
const googlechatSecurityAdapter = {
	dm: {
		channelKey: "googlechat",
		resolvePolicy: (account) => account.config.dmPolicy,
		resolveAllowFrom: (account) => account.config.allowFrom,
		allowFromPathSuffix: "",
		classifyEntryAuthentication: identityEntryAuthenticationClassifier(googleChatIngressIdentity),
		normalizeEntry: formatGoogleChatAllowFromEntry
	},
	collectWarnings: collectGoogleChatSecurityWarnings
};
const googlechatThreadingAdapter = {
	scopedAccountReplyToMode: {
		resolveAccount: adaptScopedAccountAccessor(resolveGoogleChatAccount),
		resolveReplyToMode: (account, _chatType) => account.config.replyToMode,
		fallback: "off"
	},
	buildToolContext: ({ cfg, accountId, context, hasRepliedRef }) => {
		const currentChannelId = normalizeGoogleChatTarget(context.To);
		const replyToId = normalizeOptionalString(context.ReplyToIdFull) ?? normalizeOptionalString(context.ReplyToId);
		return {
			currentChannelId,
			currentMessageId: replyToId,
			currentThreadTs: replyToId,
			replyToMode: resolveGoogleChatAccount({
				cfg,
				accountId
			}).config.replyToMode,
			hasRepliedRef
		};
	}
};
const googlechatPairingTextAdapter = {
	idLabel: "googlechatUserId",
	message: PAIRING_APPROVED_MESSAGE,
	normalizeAllowEntry: formatGoogleChatAllowFromEntry,
	notify: async ({ cfg, id, message, accountId }) => {
		const account = resolveGoogleChatAccount({
			cfg,
			accountId
		});
		if (account.credentialSource === "none" || account.tokenStatus === "configured_unavailable") return;
		const user = normalizeGoogleChatTarget(id) ?? id;
		const space = await resolveGoogleChatOutboundSpace({
			account,
			target: isGoogleChatUserTarget(user) ? user : `users/${user}`
		});
		const { sendGoogleChatMessage } = await loadGoogleChatChannelRuntime();
		await sendGoogleChatMessage({
			account,
			space,
			text: message
		});
	}
};
const googlechatOutboundAdapter = {
	base: {
		deliveryMode: "direct",
		chunker: formatGoogleChatTextChunks,
		chunkerMode: "markdown",
		textChunkLimit: GOOGLE_CHAT_FORMAT_PROFILE.chunk.limit,
		sanitizeText: ({ text }) => sanitizeGoogleChatText(text),
		normalizePayload: ({ payload }) => {
			if (shouldSuppressGoogleChatManualExecApprovalFollowupPayload(payload)) return null;
			const reply = resolveSendableOutboundReplyParts(payload);
			const { mediaUrl: _mediaUrl, mediaUrls: _mediaUrls, ...rest } = payload;
			return {
				...rest,
				text: formatGoogleChatMediaText(reply.text, reply.mediaUrls)
			};
		},
		resolveTarget: ({ to }) => {
			const normalized = normalizeGoogleChatTarget(to);
			return normalized ? {
				ok: true,
				to: normalized
			} : {
				ok: false,
				error: missingTargetError("Google Chat", "<spaces/{space}|users/{user}>")
			};
		}
	},
	attachedResults: {
		channel: "googlechat",
		sendText: async ({ cfg, to, text, accountId, replyToId, threadId, assertDirectAdapterHandoff, onPlatformSendDispatch }) => {
			const account = resolveGoogleChatAccount({
				cfg,
				accountId
			});
			const space = await resolveGoogleChatOutboundSpace({
				account,
				target: to,
				assertDirectAdapterHandoff
			});
			const thread = typeof threadId === "number" ? String(threadId) : threadId ?? replyToId ?? void 0;
			const { sendGoogleChatMessage } = await loadGoogleChatChannelRuntime();
			const result = await sendGoogleChatMessage({
				account,
				space,
				text,
				thread,
				assertDirectAdapterHandoff,
				onPlatformSendDispatch
			});
			const messageId = result?.messageName ?? "";
			const receiptMessageId = messageId.trim();
			return {
				messageId,
				chatId: space,
				receipt: createMessageReceiptFromOutboundResults({
					results: receiptMessageId ? [{
						channel: "googlechat",
						messageId: receiptMessageId,
						chatId: space,
						conversationId: space
					}] : [],
					threadId: result?.threadName ?? thread,
					kind: "text"
				})
			};
		}
	}
};
const googlechatMessageAdapter = defineChannelMessageAdapter({
	id: "googlechat",
	durableFinal: { capabilities: {
		text: true,
		media: true,
		thread: true,
		messageSendingHooks: true
	} },
	send: { text: googlechatOutboundAdapter.attachedResults.sendText }
});
export { registerGoogleChatApprovalCardBinding as A, sendGoogleChatMessage as C, buildGoogleChatApprovalActionParameters as D, GOOGLECHAT_APPROVAL_ACTION as E, unregisterGoogleChatManualApprovalFollowupSuppression as M, googleChatApprovalControls as O, probeGoogleChat as S, verifyGoogleChatRequest as T, resolveGoogleChatOutboundSessionRoute as _, googlechatPairingTextAdapter as a, deleteGoogleChatMessage as b, googleChatIngressIdentity as c, formatGoogleChatMediaText as d, formatGoogleChatTextChunks as f, normalizeGoogleChatTarget as g, isGoogleChatUserTarget as h, googlechatOutboundAdapter as i, registerGoogleChatManualApprovalFollowupSuppression as j, readGoogleChatApprovalActionToken as k, normalizeGoogleChatUserId as l, isGoogleChatSpaceTarget as m, googlechatGroupsAdapter as n, googlechatSecurityAdapter as o, isGoogleChatGroupSpace as p, googlechatMessageAdapter as r, googlechatThreadingAdapter as s, googlechatDirectoryAdapter as t, buildGoogleChatGroupPolicyScope as u, resolveGoogleChatOutboundSpace as v, updateGoogleChatMessage as w, downloadGoogleChatMedia as x, GoogleChatApiError as y };
