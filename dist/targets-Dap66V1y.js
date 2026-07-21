import { s as __toESM } from "./rolldown-runtime-DE1ahGrs.js";
import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { m as resolveUserPath } from "./utils-CRO4LGEB.js";
import { u as readResponseWithLimit } from "./http-body-CHWaxK2e.js";
import { g as readResponseTextLimited, m as readProviderJsonResponse } from "./provider-http-errors-HGLTiqMh.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-D9flCs6F.js";
import { t as parseMediaContentLength } from "./content-length-DZY9SBS5.js";
import "./error-runtime-CDUW9C58.js";
import "./media-runtime-DIRKCpVy.js";
import "./string-coerce-runtime-ZbuYDJgZ.js";
import "./text-utility-runtime-CEmCehV8.js";
import "./response-limit-runtime-B7RO3Er4.js";
import { t as buildChannelOutboundSessionRoute } from "./core-BsEPrOqQ.js";
import "./channel-core-CSgoR9CB.js";
import { n as buildHostnameAllowlistPolicyFromSuffixAllowlist } from "./ssrf-policy-DKsCBaFj.js";
import "./ssrf-runtime-CyXpgbLM.js";
import "./provider-http-DjXS2nxd.js";
import { i as resolveGoogleChatAccount } from "./accounts-CwNpKTEr.js";
import "./runtime-api-Dteah-sl.js";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region extensions/googlechat/src/approval-card-actions.ts
const GOOGLECHAT_APPROVAL_ACTION = "openclaw.approval";
const GOOGLECHAT_APPROVAL_ACTION_PARAM = "openclaw_action";
const GOOGLECHAT_APPROVAL_TOKEN_PARAM = "token";
const GOOGLECHAT_APPROVAL_ACTION_VALUE = "approval";
const MANUAL_EXEC_APPROVAL_COMMAND_RE = /(?:^|[\s`])\/approve[ \t]+([^ \t\r\n`|]+)[ \t]+(allow-once|allow-always|deny)(?=$|[\s`|.,;:!?])/giu;
const approvalCardBindings = /* @__PURE__ */ new Map();
const approvalCardResolvingTokens = /* @__PURE__ */ new Set();
const manualApprovalFollowupSuppressions = /* @__PURE__ */ new Map();
function createGoogleChatApprovalToken() {
	return crypto.randomBytes(18).toString("base64url");
}
function buildGoogleChatApprovalActionParameters(token) {
	return [{
		key: GOOGLECHAT_APPROVAL_ACTION_PARAM,
		value: GOOGLECHAT_APPROVAL_ACTION_VALUE
	}, {
		key: GOOGLECHAT_APPROVAL_TOKEN_PARAM,
		value: token
	}];
}
function collectEventParameters(event) {
	const params = {};
	for (const [key, value] of Object.entries(event.common?.parameters ?? {})) if (typeof value === "string") params[key] = value;
	for (const [key, value] of Object.entries(event.commonEventObject?.parameters ?? {})) if (typeof value === "string") params[key] = value;
	for (const item of event.action?.parameters ?? []) if (typeof item.key === "string" && typeof item.value === "string") params[item.key] = item.value;
	return params;
}
function readGoogleChatApprovalActionToken(event) {
	const params = collectEventParameters(event);
	if (params[GOOGLECHAT_APPROVAL_ACTION_PARAM] !== GOOGLECHAT_APPROVAL_ACTION_VALUE) return null;
	const actionName = normalizeOptionalString(event.action?.actionMethodName) ?? normalizeOptionalString(event.common?.invokedFunction) ?? normalizeOptionalString(event.commonEventObject?.invokedFunction);
	if (actionName && actionName !== "openclaw.approval" && !actionName.startsWith("https://")) return null;
	return normalizeOptionalString(params[GOOGLECHAT_APPROVAL_TOKEN_PARAM]) ?? null;
}
function registerGoogleChatApprovalCardBinding(binding) {
	if (binding.expiresAtMs <= Date.now()) return false;
	approvalCardBindings.set(binding.token, binding);
	registerGoogleChatManualApprovalFollowupSuppression({
		approvalId: binding.approvalId,
		approvalKind: binding.approvalKind,
		allowedDecisions: binding.allowedDecisions,
		expiresAtMs: binding.expiresAtMs
	});
	return true;
}
function getGoogleChatApprovalCardBinding(token) {
	const binding = approvalCardBindings.get(token);
	if (!binding) return null;
	if (binding.expiresAtMs <= Date.now()) {
		approvalCardBindings.delete(token);
		return null;
	}
	return binding;
}
function normalizeApprovalRef(value) {
	const normalized = value.trim().toLowerCase();
	return normalized ? normalized : null;
}
function manualApprovalFollowupSuppressionKey(approvalId) {
	return normalizeApprovalRef(approvalId);
}
function registerGoogleChatManualApprovalFollowupSuppression(suppression) {
	if (suppression.expiresAtMs <= Date.now()) return false;
	const key = manualApprovalFollowupSuppressionKey(suppression.approvalId);
	if (!key) return false;
	manualApprovalFollowupSuppressions.set(key, suppression);
	return true;
}
function unregisterGoogleChatManualApprovalFollowupSuppression(approvalId) {
	const key = manualApprovalFollowupSuppressionKey(approvalId);
	if (key) manualApprovalFollowupSuppressions.delete(key);
}
function approvalRefMatches(bindingApprovalId, approvalRef) {
	const normalizedBindingId = normalizeApprovalRef(bindingApprovalId);
	const normalizedRef = normalizeApprovalRef(approvalRef);
	if (!normalizedBindingId || !normalizedRef) return false;
	return normalizedRef === normalizedBindingId || normalizedRef.length >= 8 && normalizedBindingId.startsWith(normalizedRef);
}
function pruneExpiredGoogleChatApprovalCardBindings(nowMs) {
	for (const [token, binding] of approvalCardBindings) if (binding.expiresAtMs <= nowMs) {
		approvalCardBindings.delete(token);
		approvalCardResolvingTokens.delete(token);
	}
	for (const [approvalId, suppression] of manualApprovalFollowupSuppressions) if (suppression.expiresAtMs <= nowMs) manualApprovalFollowupSuppressions.delete(approvalId);
}
function hasActiveGoogleChatExecApprovalCardForManualCommand(params) {
	pruneExpiredGoogleChatApprovalCardBindings(params.nowMs);
	for (const binding of approvalCardBindings.values()) if (binding.approvalKind === "exec" && binding.allowedDecisions.includes(params.decision) && approvalRefMatches(binding.approvalId, params.approvalRef)) return true;
	for (const suppression of manualApprovalFollowupSuppressions.values()) if (suppression.approvalKind === "exec" && suppression.allowedDecisions.includes(params.decision) && approvalRefMatches(suppression.approvalId, params.approvalRef)) return true;
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
function hasSendableMedia(payload) {
	return Boolean(payload.mediaUrl?.trim() || payload.mediaUrls?.some((url) => url.trim()));
}
function hasStructuredPayloadPart(payload) {
	return Boolean(hasSendableMedia(payload) || payload.presentation || payload.interactive || payload.btw || payload.spokenText || payload.ttsSupplement);
}
function shouldSuppressGoogleChatManualExecApprovalFollowupPayload(payload, nowMs = Date.now()) {
	const text = payload.text?.trim();
	if (!text || hasStructuredPayloadPart(payload)) return false;
	return shouldSuppressGoogleChatManualExecApprovalFollowupText(text, nowMs);
}
function claimGoogleChatApprovalCardBinding(token) {
	const binding = getGoogleChatApprovalCardBinding(token);
	if (!binding) return { kind: "missing" };
	if (approvalCardResolvingTokens.has(token)) return { kind: "in-flight" };
	approvalCardResolvingTokens.add(token);
	return {
		kind: "claimed",
		binding
	};
}
function completeGoogleChatApprovalCardBinding(token) {
	const binding = approvalCardBindings.get(token);
	approvalCardResolvingTokens.delete(token);
	approvalCardBindings.delete(token);
	if (binding) unregisterGoogleChatManualApprovalFollowupSuppression(binding.approvalId);
}
function releaseGoogleChatApprovalCardBinding(token) {
	approvalCardResolvingTokens.delete(token);
}
function unregisterGoogleChatApprovalCardBindings(tokens) {
	for (const token of tokens) {
		const binding = approvalCardBindings.get(token);
		approvalCardBindings.delete(token);
		approvalCardResolvingTokens.delete(token);
		if (binding) unregisterGoogleChatManualApprovalFollowupSuppression(binding.approvalId);
	}
}
//#endregion
//#region extensions/googlechat/src/google-auth.runtime.ts
const GOOGLE_AUTH_POLICY = buildHostnameAllowlistPolicyFromSuffixAllowlist(["accounts.google.com", "googleapis.com"]);
const GOOGLE_AUTH_AUDIT_CONTEXT = "googlechat.auth.google-auth";
const GOOGLE_AUTH_URI = "https://accounts.google.com/o/oauth2/auth";
const GOOGLE_AUTH_PROVIDER_CERTS_URL = "https://www.googleapis.com/oauth2/v1/certs";
const GOOGLE_AUTH_TOKEN_URI = "https://oauth2.googleapis.com/token";
const GOOGLE_AUTH_UNIVERSE_DOMAIN = "googleapis.com";
const GOOGLE_CLIENT_CERTS_URL_PREFIX = "https://www.googleapis.com/robot/v1/metadata/x509/";
const MAX_GOOGLE_AUTH_RESPONSE_BYTES = 1024 * 1024;
const MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES = 64 * 1024;
let googleAuthRuntimePromise = null;
function normalizeGoogleAuthPreparedRequestHeaders(config) {
	if (!(config.headers instanceof Headers)) config.headers = new Headers(config.headers);
	return config;
}
function normalizeGoogleAuthResponseHeaders(response) {
	if (!(response.headers instanceof Headers)) response.headers = new Headers(response.headers);
	return response;
}
function installGoogleAuthHeaderCompatibilityInterceptor(transport) {
	transport.interceptors.request.add({ resolved: async (config) => normalizeGoogleAuthPreparedRequestHeaders(config) });
	transport.interceptors.response.add({ resolved: async (response) => normalizeGoogleAuthResponseHeaders(response) });
	return transport;
}
function asNullableObjectRecord(value) {
	return value !== null && typeof value === "object" ? value : null;
}
function hasProxyAgentShape(value) {
	const record = asNullableObjectRecord(value);
	return record !== null && record.proxy instanceof URL;
}
function hasTlsAgentShape(value) {
	const record = asNullableObjectRecord(value);
	return record !== null && asNullableObjectRecord(record.options) !== null;
}
function resolveGoogleAuthAgent(init, url) {
	return typeof init.agent === "function" ? init.agent(url) : init.agent;
}
function hasTlsOptions(options) {
	return options.cert !== void 0 || options.key !== void 0;
}
function resolveGoogleAuthTlsOptions(init, url) {
	const explicit = {
		cert: init.cert,
		key: init.key
	};
	if (hasTlsOptions(explicit)) return explicit;
	const agent = resolveGoogleAuthAgent(init, url);
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
function normalizeGoogleAuthProxyEnvValue(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}
function resolveGoogleAuthEnvProxyUrl(protocol) {
	const httpProxy = normalizeGoogleAuthProxyEnvValue(process.env.HTTP_PROXY) ?? normalizeGoogleAuthProxyEnvValue(process.env.http_proxy);
	const httpsProxy = normalizeGoogleAuthProxyEnvValue(process.env.HTTPS_PROXY) ?? normalizeGoogleAuthProxyEnvValue(process.env.https_proxy);
	if (protocol === "https") return httpsProxy ?? httpProxy ?? void 0;
	return httpProxy ?? void 0;
}
function collectGoogleAuthNoProxyRules(noProxy = []) {
	const rules = [...noProxy];
	const envRules = (process.env.NO_PROXY ?? process.env.no_proxy)?.split(",") ?? [];
	for (const rule of envRules) {
		const trimmed = rule.trim();
		if (trimmed.length > 0) rules.push(trimmed);
	}
	return rules;
}
function shouldBypassGoogleAuthProxy(url, noProxy = []) {
	for (const rule of collectGoogleAuthNoProxyRules(noProxy)) {
		if (rule instanceof RegExp) {
			if (rule.test(url.toString())) return true;
			continue;
		}
		if (rule instanceof URL) {
			if (rule.origin === url.origin) return true;
			continue;
		}
		if (rule.startsWith("*.") || rule.startsWith(".")) {
			const cleanedRule = rule.replace(/^\*\./, ".");
			if (url.hostname.endsWith(cleanedRule)) return true;
			continue;
		}
		if (rule === url.origin || rule === url.hostname || rule === url.href) return true;
	}
	return false;
}
function readGoogleAuthProxyUrl(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : void 0;
	}
	if (value instanceof URL) return value.toString();
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
	return readOptionalTrimmedString(record, fieldName) ?? (() => {
		throw new Error(`Google Chat service account is missing "${fieldName}"`);
	})();
}
function assertExactUrlField(record, fieldName, expectedUrl) {
	const value = readOptionalTrimmedString(record, fieldName);
	if (!value) return;
	if (value !== expectedUrl) throw new Error(`Google Chat service account field "${fieldName}" must be ${expectedUrl}, got ${value}`);
}
function assertUrlPrefixField(record, fieldName, expectedPrefix) {
	const value = readOptionalTrimmedString(record, fieldName);
	if (!value) return;
	if (!value.startsWith(expectedPrefix)) throw new Error(`Google Chat service account field "${fieldName}" must start with ${expectedPrefix}, got ${value}`);
}
function validateGoogleChatServiceAccountCredentials(credentials) {
	const type = readOptionalTrimmedString(credentials, "type");
	if (type && type !== "service_account") throw new Error(`Google Chat credentials must use service_account auth, got "${type}" instead`);
	readRequiredTrimmedString(credentials, "client_email");
	readRequiredTrimmedString(credentials, "private_key");
	const universeDomain = readOptionalTrimmedString(credentials, "universe_domain");
	if (universeDomain && universeDomain !== GOOGLE_AUTH_UNIVERSE_DOMAIN) throw new Error(`Google Chat service account field "universe_domain" must be ${GOOGLE_AUTH_UNIVERSE_DOMAIN}, got ${universeDomain}`);
	assertExactUrlField(credentials, "auth_uri", GOOGLE_AUTH_URI);
	assertExactUrlField(credentials, "auth_provider_x509_cert_url", GOOGLE_AUTH_PROVIDER_CERTS_URL);
	assertExactUrlField(credentials, "token_uri", GOOGLE_AUTH_TOKEN_URI);
	assertUrlPrefixField(credentials, "client_x509_cert_url", GOOGLE_CLIENT_CERTS_URL_PREFIX);
	return credentials;
}
async function readCredentialsFile(filePath) {
	const resolvedPath = resolveUserPath(filePath);
	if (!resolvedPath) throw new Error("Google Chat service account file path is empty");
	let handle;
	try {
		handle = await fs.open(resolvedPath, "r");
	} catch {
		throw new Error("Failed to load Google Chat service account file.");
	}
	try {
		const stat = await handle.stat();
		if (!stat.isFile()) throw new Error("Google Chat service account file must be a regular file.");
		if (stat.size > MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES) throw new Error(`Google Chat service account file exceeds ${MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES} bytes.`);
		let raw;
		try {
			raw = await handle.readFile({ encoding: "utf8" });
		} catch {
			throw new Error("Failed to load Google Chat service account file.");
		}
		if (Buffer.byteLength(raw, "utf8") > MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES) throw new Error(`Google Chat service account file exceeds ${MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES} bytes.`);
		let parsed;
		try {
			parsed = JSON.parse(raw);
		} catch {
			throw new Error("Invalid Google Chat service account JSON.");
		}
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Google Chat service account file must contain a JSON object.");
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
	const tlsOptions = resolveGoogleAuthTlsOptions(googleAuthInit, requestUrl);
	const proxyBypassed = shouldBypassGoogleAuthProxy(requestUrl, Array.isArray(googleAuthInit.noProxy) ? googleAuthInit.noProxy : []);
	const agent = resolveGoogleAuthAgent(googleAuthInit, requestUrl);
	const explicitProxy = readGoogleAuthProxyUrl(googleAuthInit.proxy) ?? (hasProxyAgentShape(agent) ? agent.proxy.toString() : void 0);
	if (!proxyBypassed && explicitProxy) return {
		dispatcherPolicy: {
			allowPrivateProxy: true,
			mode: "explicit-proxy",
			...hasTlsOptions(tlsOptions) ? { proxyTls: { ...tlsOptions } } : {},
			proxyUrl: explicitProxy
		},
		init: nextInit
	};
	if (proxyBypassed ? void 0 : resolveGoogleAuthEnvProxyUrl(requestUrl.protocol === "http:" ? "http" : "https")) return {
		dispatcherPolicy: {
			mode: "env-proxy",
			...hasTlsOptions(tlsOptions) ? { proxyTls: { ...tlsOptions } } : {}
		},
		init: nextInit
	};
	if (hasTlsOptions(tlsOptions)) return {
		dispatcherPolicy: {
			connect: { ...tlsOptions },
			mode: "direct"
		},
		init: nextInit
	};
	return { init: nextInit };
}
function createGoogleAuthFetch(baseFetch) {
	return async (input, init) => {
		const url = input instanceof Request ? input.url : String(input);
		const guardedOptions = resolveGoogleAuthDispatcherPolicy(input, init);
		const { response, release } = await fetchWithSsrFGuard({
			auditContext: GOOGLE_AUTH_AUDIT_CONTEXT,
			dispatcherPolicy: guardedOptions.dispatcherPolicy,
			init: guardedOptions.init,
			policy: GOOGLE_AUTH_POLICY,
			url,
			...baseFetch ? { fetchImpl: baseFetch } : {}
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
			await release();
		}
	};
}
async function readGoogleAuthResponseBytes(response) {
	const contentLengthHeader = response.headers.get("content-length");
	if (contentLengthHeader) {
		const contentLength = parseMediaContentLength(contentLengthHeader);
		if (contentLength !== null && contentLength > MAX_GOOGLE_AUTH_RESPONSE_BYTES) throw new Error(`Google auth response exceeds ${MAX_GOOGLE_AUTH_RESPONSE_BYTES} bytes.`);
	}
	const reader = response.body?.getReader();
	if (!reader) throw new Error("Google auth response body stream unavailable; refusing to buffer unbounded response.");
	const chunks = [];
	let total = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (!value) continue;
			total += value.byteLength;
			if (total > MAX_GOOGLE_AUTH_RESPONSE_BYTES) {
				try {
					await reader.cancel("Google auth response exceeded buffer limit");
				} catch {}
				throw new Error(`Google auth response exceeds ${MAX_GOOGLE_AUTH_RESPONSE_BYTES} bytes.`);
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}
	const bytes = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return bytes;
}
async function loadGoogleAuthRuntime() {
	if (!googleAuthRuntimePromise) googleAuthRuntimePromise = (async () => {
		try {
			const [googleAuthModule, gaxiosModule] = await Promise.all([import("./src-CZfnkYfN.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1)), import("./src-CYlYkNjk.js")]);
			return {
				Gaxios: gaxiosModule.Gaxios,
				GoogleAuth: googleAuthModule.GoogleAuth,
				OAuth2Client: googleAuthModule.OAuth2Client
			};
		} catch (error) {
			googleAuthRuntimePromise = null;
			throw error;
		}
	})();
	return await googleAuthRuntimePromise;
}
async function getGoogleAuthTransport() {
	const { Gaxios } = await loadGoogleAuthRuntime();
	return installGoogleAuthHeaderCompatibilityInterceptor(new Gaxios({ fetchImplementation: createGoogleAuthFetch() }));
}
async function resolveValidatedGoogleChatCredentials(account) {
	if (account.credentials) return validateGoogleChatServiceAccountCredentials(account.credentials);
	if (account.credentialsFile) return validateGoogleChatServiceAccountCredentials(await readCredentialsFile(account.credentialsFile));
	return null;
}
//#endregion
//#region extensions/googlechat/src/auth.ts
const CHAT_SCOPE = "https://www.googleapis.com/auth/chat.bot";
const CHAT_ISSUER = "chat@system.gserviceaccount.com";
const ADDON_ISSUER_PATTERN = /^service-\d+@gcp-sa-gsuiteaddons\.iam\.gserviceaccount\.com$/;
const CHAT_CERTS_URL = "https://www.googleapis.com/service_accounts/v1/metadata/x509/chat@system.gserviceaccount.com";
async function readGoogleChatCertsResponse(response) {
	return readProviderJsonResponse(response, "Google Chat cert fetch failed");
}
const MAX_AUTH_CACHE_SIZE = 32;
const authCache = /* @__PURE__ */ new Map();
let cachedCerts = null;
let verifyClientPromise = null;
async function getVerifyClient() {
	if (!verifyClientPromise) verifyClientPromise = (async () => {
		try {
			const { OAuth2Client } = await loadGoogleAuthRuntime();
			return new OAuth2Client({ transporter: await getGoogleAuthTransport() });
		} catch (error) {
			verifyClientPromise = null;
			throw error;
		}
	})();
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
	const [{ GoogleAuth }, rawTransporter, credentials] = await Promise.all([
		loadGoogleAuthRuntime(),
		getGoogleAuthTransport(),
		resolveValidatedGoogleChatCredentials(account)
	]);
	const transporter = rawTransporter;
	const evictOldest = () => {
		if (authCache.size > MAX_AUTH_CACHE_SIZE) {
			const oldest = authCache.keys().next().value;
			if (oldest !== void 0) authCache.delete(oldest);
		}
	};
	const auth = new GoogleAuth({
		...credentials ? { credentials } : {},
		clientOptions: { transporter },
		scopes: [CHAT_SCOPE]
	});
	authCache.set(account.accountId, {
		key,
		auth
	});
	evictOldest();
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
	if (cachedCerts && now - cachedCerts.fetchedAt < 600 * 1e3) return cachedCerts.certs;
	const { response, release } = await fetchWithSsrFGuard({
		url: CHAT_CERTS_URL,
		auditContext: "googlechat.auth.certs"
	});
	try {
		if (!response.ok) throw new Error(`Failed to fetch Chat certs (${response.status})`);
		const certs = await readGoogleChatCertsResponse(response);
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
	if (audienceType === "app-url") try {
		const payload = (await (await getVerifyClient()).verifyIdToken({
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
	} catch (err) {
		return {
			ok: false,
			reason: err instanceof Error ? err.message : "invalid token"
		};
	}
	if (audienceType === "project-number") try {
		const verifyClient = await getVerifyClient();
		const certs = await fetchChatCerts();
		await verifyClient.verifySignedJwtWithCertsAsync(bearer, certs, audience, [CHAT_ISSUER]);
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			reason: err instanceof Error ? err.message : "invalid token"
		};
	}
	return {
		ok: false,
		reason: "unsupported audience type"
	};
}
//#endregion
//#region extensions/googlechat/src/api.ts
const CHAT_API_BASE = "https://chat.googleapis.com/v1";
const CHAT_UPLOAD_BASE = "https://chat.googleapis.com/upload/v1";
async function readGoogleChatJsonResponse(response, label) {
	return readProviderJsonResponse(response, label);
}
const headersToObject = (headers) => headers instanceof Headers ? Object.fromEntries(headers.entries()) : Array.isArray(headers) ? Object.fromEntries(headers) : headers || {};
async function withGoogleChatResponse(params) {
	const { account, url, init, auditContext, errorPrefix = "Google Chat API", handleResponse } = params;
	const token = await getGoogleChatAccessToken(account);
	const { response, release } = await fetchWithSsrFGuard({
		url,
		init: {
			...init,
			headers: {
				...headersToObject(init?.headers),
				Authorization: `Bearer ${token}`
			}
		},
		auditContext
	});
	try {
		if (!response.ok) {
			const text = await readResponseTextLimited(response).catch(() => "");
			throw new Error(`${errorPrefix} ${response.status}: ${text || response.statusText}`);
		}
		return await handleResponse(response);
	} finally {
		await release();
	}
}
async function fetchJson(account, url, init) {
	return await withGoogleChatResponse({
		account,
		url,
		init: {
			...init,
			headers: {
				...headersToObject(init.headers),
				"Content-Type": "application/json"
			}
		},
		auditContext: "googlechat.api.json",
		handleResponse: async (response) => await readGoogleChatJsonResponse(response, "Google Chat API request failed")
	});
}
async function fetchOk(account, url, init) {
	await withGoogleChatResponse({
		account,
		url,
		init,
		auditContext: "googlechat.api.ok",
		handleResponse: async () => void 0
	});
}
async function fetchBuffer(account, url, init, options) {
	return await withGoogleChatResponse({
		account,
		url,
		init,
		auditContext: "googlechat.api.buffer",
		handleResponse: async (res) => {
			const maxBytes = options?.maxBytes;
			const lengthHeader = res.headers.get("content-length");
			if (maxBytes && lengthHeader) {
				const length = parseMediaContentLength(lengthHeader);
				if (length !== null && length > maxBytes) throw new Error(`Google Chat media exceeds max bytes (${maxBytes})`);
			}
			if (!maxBytes) return {
				buffer: Buffer.from(await res.arrayBuffer()),
				contentType: res.headers.get("content-type") ?? void 0
			};
			return {
				buffer: await readResponseWithLimit(res, maxBytes, { onOverflow: () => /* @__PURE__ */ new Error(`Google Chat media exceeds max bytes (${maxBytes})`) }),
				contentType: res.headers.get("content-type") ?? void 0
			};
		}
	});
}
async function sendGoogleChatMessage(params) {
	const { account, space, text, thread, cardsV2, attachments } = params;
	if (text && (!cardsV2 || cardsV2.length === 0) && (!attachments || attachments.length === 0) && shouldSuppressGoogleChatManualExecApprovalFollowupText(text)) return null;
	const body = {};
	if (text) body.text = text;
	if (cardsV2 && cardsV2.length > 0) body.cardsV2 = cardsV2;
	if (thread) body.thread = { name: thread };
	if (attachments && attachments.length > 0) body.attachment = attachments.map((item) => Object.assign({ attachmentDataRef: { attachmentUploadToken: item.attachmentUploadToken } }, item.contentName ? { contentName: item.contentName } : {}));
	const urlObj = new URL(`${CHAT_API_BASE}/${space}/messages`);
	if (thread) urlObj.searchParams.set("messageReplyOption", "REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD");
	const result = await fetchJson(account, urlObj.toString(), {
		method: "POST",
		body: JSON.stringify(body)
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
	const url = `${CHAT_API_BASE}/${messageName}?updateMask=${updateMask.join(",")}`;
	const body = {};
	if (text !== void 0) body.text = text;
	if (cardsV2 !== void 0) body.cardsV2 = cardsV2;
	return { messageName: (await fetchJson(account, url, {
		method: "PATCH",
		body: JSON.stringify(body)
	})).name };
}
async function deleteGoogleChatMessage(params) {
	const { account, messageName } = params;
	await fetchOk(account, `${CHAT_API_BASE}/${messageName}`, { method: "DELETE" });
}
async function uploadGoogleChatAttachment(params) {
	const { account, space, filename, buffer, contentType } = params;
	const boundary = `openclaw-${crypto.randomUUID()}`;
	const header = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ filename })}\r\n`;
	const mediaHeader = `--${boundary}\r\nContent-Type: ${contentType ?? "application/octet-stream"}\r\n\r\n`;
	const footer = `\r\n--${boundary}--\r\n`;
	const body = Buffer.concat([
		Buffer.from(header, "utf8"),
		Buffer.from(mediaHeader, "utf8"),
		buffer,
		Buffer.from(footer, "utf8")
	]);
	return { attachmentUploadToken: (await withGoogleChatResponse({
		account,
		url: `${CHAT_UPLOAD_BASE}/${space}/attachments:upload?uploadType=multipart`,
		init: {
			method: "POST",
			headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
			body
		},
		auditContext: "googlechat.upload",
		errorPrefix: "Google Chat upload",
		handleResponse: async (response) => await readGoogleChatJsonResponse(response, "Google Chat upload failed")
	})).attachmentDataRef?.attachmentUploadToken };
}
async function downloadGoogleChatMedia(params) {
	const { account, resourceName, maxBytes } = params;
	return await fetchBuffer(account, `${CHAT_API_BASE}/media/${resourceName}?alt=media`, void 0, { maxBytes });
}
async function createGoogleChatReaction(params) {
	const { account, messageName, emoji } = params;
	return await fetchJson(account, `${CHAT_API_BASE}/${messageName}/reactions`, {
		method: "POST",
		body: JSON.stringify({ emoji: { unicode: emoji } })
	});
}
async function listGoogleChatReactions(params) {
	const { account, messageName, limit } = params;
	const url = new URL(`${CHAT_API_BASE}/${messageName}/reactions`);
	if (limit && limit > 0) url.searchParams.set("pageSize", String(limit));
	return (await fetchJson(account, url.toString(), { method: "GET" })).reactions ?? [];
}
async function deleteGoogleChatReaction(params) {
	const { account, reactionName } = params;
	await fetchOk(account, `${CHAT_API_BASE}/${reactionName}`, { method: "DELETE" });
}
async function findGoogleChatDirectMessage(params) {
	const { account, userName } = params;
	const url = new URL(`${CHAT_API_BASE}/spaces:findDirectMessage`);
	url.searchParams.set("name", userName);
	return await fetchJson(account, url.toString(), { method: "GET" });
}
async function getGoogleChatSpace(params) {
	return await fetchJson(params.account, `${CHAT_API_BASE}/${params.spaceName}`, { method: "GET" });
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
//#endregion
//#region extensions/googlechat/src/targets.ts
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
async function resolveGoogleChatOutboundSpace(params) {
	const normalized = normalizeGoogleChatTarget(params.target);
	if (!normalized) throw new Error("Missing Google Chat target.");
	const base = stripMessageSuffix(normalized);
	if (isGoogleChatSpaceTarget(base)) return base;
	if (isGoogleChatUserTarget(base)) {
		const dm = await findGoogleChatDirectMessage({
			account: params.account,
			userName: base
		});
		if (!dm?.name) throw new Error(`No Google Chat DM found for ${base}`);
		return dm.name;
	}
	return base;
}
async function resolveGoogleChatOutboundSessionRoute(params) {
	const account = resolveGoogleChatAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const spaceName = await resolveGoogleChatOutboundSpace({
		account,
		target: params.target
	});
	if (!isGoogleChatSpaceTarget(spaceName)) return null;
	let space;
	try {
		space = await getGoogleChatSpace({
			account,
			spaceName
		});
	} catch {
		return null;
	}
	const chatType = resolveGoogleChatSpaceChatType(space);
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
//#endregion
export { readGoogleChatApprovalActionToken as C, shouldSuppressGoogleChatManualExecApprovalFollowupPayload as D, releaseGoogleChatApprovalCardBinding as E, unregisterGoogleChatApprovalCardBindings as O, getGoogleChatApprovalCardBinding as S, registerGoogleChatManualApprovalFollowupSuppression as T, GOOGLECHAT_APPROVAL_ACTION as _, resolveGoogleChatOutboundSessionRoute as a, completeGoogleChatApprovalCardBinding as b, deleteGoogleChatMessage as c, listGoogleChatReactions as d, probeGoogleChat as f, verifyGoogleChatRequest as g, uploadGoogleChatAttachment as h, normalizeGoogleChatTarget as i, unregisterGoogleChatManualApprovalFollowupSuppression as k, deleteGoogleChatReaction as l, updateGoogleChatMessage as m, isGoogleChatSpaceTarget as n, resolveGoogleChatOutboundSpace as o, sendGoogleChatMessage as p, isGoogleChatUserTarget as r, createGoogleChatReaction as s, isGoogleChatGroupSpace as t, downloadGoogleChatMedia as u, buildGoogleChatApprovalActionParameters as v, registerGoogleChatApprovalCardBinding as w, createGoogleChatApprovalToken as x, claimGoogleChatApprovalCardBinding as y };
