const require_runtime = require("./runtime-gZTAuFux.cjs");
require("../runtime-api.cjs");
const require_delegated_state = require("./delegated-state-u-ywZyZT.cjs");
require("./secret-input-C65t6kjM.cjs");
let openclaw_plugin_sdk_lazy_runtime = require("openclaw/plugin-sdk/lazy-runtime");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_allow_from = require("openclaw/plugin-sdk/allow-from");
let node_async_hooks = require("node:async_hooks");
let openclaw_plugin_sdk_fetch_runtime = require("openclaw/plugin-sdk/fetch-runtime");
let openclaw_plugin_sdk_provider_http = require("openclaw/plugin-sdk/provider-http");
let openclaw_plugin_sdk_ssrf_runtime = require("openclaw/plugin-sdk/ssrf-runtime");
let node_buffer = require("node:buffer");
let node_dns_promises = require("node:dns/promises");
let openclaw_plugin_sdk_ssrf_policy = require("openclaw/plugin-sdk/ssrf-policy");
let openclaw_plugin_sdk_number_runtime = require("openclaw/plugin-sdk/number-runtime");
let openclaw_plugin_sdk_text_utility_runtime = require("openclaw/plugin-sdk/text-utility-runtime");
let openclaw_plugin_sdk_secret_file = require("openclaw/plugin-sdk/secret-file");
let openclaw_plugin_sdk_error_runtime = require("openclaw/plugin-sdk/error-runtime");
let node_module = require("node:module");
let openclaw_plugin_sdk_html_entity_runtime = require("openclaw/plugin-sdk/html-entity-runtime");
let openclaw_plugin_sdk_secret_input = require("openclaw/plugin-sdk/secret-input");
//#region extensions/msteams/src/request-timeout.ts
const MSTEAMS_REQUEST_TIMEOUT_MS = 3e4;
const MSTEAMS_SHAREPOINT_UPLOAD_BASE_TIMEOUT_MS = 3e5;
const MSTEAMS_SHAREPOINT_UPLOAD_MIN_BYTES_PER_SECOND = 262144;
const MSTEAMS_INBOUND_PREPROCESS_TIMEOUT_MS = 1e4;
function createMSTeamsInboundDeadline() {
	return (0, openclaw_plugin_sdk_provider_http.createProviderOperationDeadline)({
		label: "MS Teams inbound preprocessing",
		timeoutMs: MSTEAMS_INBOUND_PREPROCESS_TIMEOUT_MS
	});
}
function resolveMSTeamsRequestTimeoutMs(deadline) {
	return deadline ? (0, openclaw_plugin_sdk_provider_http.resolveProviderOperationTimeoutMs)({
		deadline,
		defaultTimeoutMs: MSTEAMS_REQUEST_TIMEOUT_MS
	}) : MSTEAMS_REQUEST_TIMEOUT_MS;
}
/** Bound non-abortable SDK and credential work to the same operation deadline as fetches. */
async function withMSTeamsRequestDeadline(params) {
	const timeoutMs = resolveMSTeamsRequestTimeoutMs(params.deadline);
	return await (0, openclaw_plugin_sdk_text_utility_runtime.withTimeout)(params.work(), timeoutMs, params.label);
}
function resolveMSTeamsSharePointUploadTimeoutMs(sizeInBytes) {
	const transferBudgetMs = Math.ceil((Number.isFinite(sizeInBytes) && sizeInBytes > 0 ? Math.ceil(sizeInBytes) : 0) / MSTEAMS_SHAREPOINT_UPLOAD_MIN_BYTES_PER_SECOND * 1e3);
	return (0, openclaw_plugin_sdk_number_runtime.resolveTimerTimeoutMs)(MSTEAMS_SHAREPOINT_UPLOAD_BASE_TIMEOUT_MS + transferBudgetMs, MSTEAMS_SHAREPOINT_UPLOAD_BASE_TIMEOUT_MS, 1);
}
function createMSTeamsRequestTimeoutError(label, timeoutMs) {
	const error = /* @__PURE__ */ new Error(`${label} timed out after ${timeoutMs}ms`);
	error.name = "TimeoutError";
	return error;
}
async function withMSTeamsAbortableRequestTimeout(params) {
	const controller = new AbortController();
	const timeoutMs = (0, openclaw_plugin_sdk_number_runtime.resolveTimerTimeoutMs)(params.timeoutMs, MSTEAMS_REQUEST_TIMEOUT_MS, 1);
	const work = Promise.resolve().then(() => params.work(controller.signal));
	try {
		return await (0, openclaw_plugin_sdk_text_utility_runtime.withTimeout)(work, timeoutMs, { createError: () => createMSTeamsRequestTimeoutError(params.label, timeoutMs) });
	} catch (error) {
		controller.abort(error);
		throw error;
	}
}
//#endregion
//#region extensions/msteams/src/attachments/shared.ts
const IMAGE_EXT_RE = /\.(avif|bmp|gif|heic|heif|jpe?g|png|tiff?|webp)$/i;
const IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
const ATTACHMENT_TAG_RE = /<attachment[^>]+id=["']([^"']+)["'][^>]*>/gi;
const GRAPH_HOSTED_CONTENT_SRC_RE = /\/hostedContents\/([^/?#]+)/i;
function resolveInlineImageSourceId(src) {
	const hostedContentId = GRAPH_HOSTED_CONTENT_SRC_RE.exec(src)?.[1];
	if (!hostedContentId) return src;
	try {
		return decodeURIComponent(hostedContentId);
	} catch {
		return hostedContentId;
	}
}
const DEFAULT_MEDIA_HOST_ALLOWLIST = [
	"graph.microsoft.com",
	"graph.microsoft.us",
	"graph.microsoft.de",
	"graph.microsoft.cn",
	"sharepoint.com",
	"sharepoint.us",
	"sharepoint.de",
	"sharepoint.cn",
	"sharepoint-df.com",
	"1drv.ms",
	"onedrive.com",
	"teams.microsoft.com",
	"teams.cdn.office.net",
	"statics.teams.cdn.office.net",
	"office.com",
	"office.net",
	"asm.skype.com",
	"ams.skype.com",
	"media.ams.skype.com",
	"trafficmanager.net",
	"botframework.azure.cn",
	"blob.core.windows.net",
	"azureedge.net",
	"microsoft.com"
];
const DEFAULT_MEDIA_AUTH_HOST_ALLOWLIST = [
	"api.botframework.com",
	"botframework.com",
	"smba.trafficmanager.net",
	"botframework.azure.cn",
	"graph.microsoft.com",
	"graph.microsoft.us",
	"graph.microsoft.de",
	"graph.microsoft.cn"
];
const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";
/**
* Host suffixes for SharePoint/OneDrive shared links that must be fetched via
* the Graph `/shares/{shareId}/driveItem/content` endpoint instead of directly.
*
* Direct fetches of SharePoint/OneDrive shared URLs return empty/HTML landing
* pages unless encoded as a Graph share id. See
* https://learn.microsoft.com/en-us/graph/api/shares-get for the encoding.
*/
const GRAPH_SHARED_LINK_HOST_SUFFIXES = [
	".sharepoint.com",
	".sharepoint.us",
	".sharepoint.de",
	".sharepoint.cn",
	".sharepoint-df.com",
	"1drv.ms",
	"onedrive.live.com",
	"onedrive.com"
];
/**
* Returns true when the URL points at a SharePoint or OneDrive host whose
* shared-link content must be fetched through the Graph shares API rather
* than directly.
*/
function isGraphSharedLinkUrl(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return false;
	}
	const host = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(parsed.hostname);
	if (parsed.protocol !== "https:" || !host) return false;
	return GRAPH_SHARED_LINK_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(suffix.startsWith(".") ? suffix : `.${suffix}`));
}
/**
* Encode a SharePoint/OneDrive URL as a Graph shareId using the documented
* `u!` + base64url (no padding) scheme:
* https://learn.microsoft.com/en-us/graph/api/shares-get#encoding-sharing-urls
*/
function encodeGraphShareId(url) {
	return `u!${node_buffer.Buffer.from(url, "utf8").toString("base64url")}`;
}
/**
* When `url` is a SharePoint/OneDrive shared link, return the matching
* `GET /shares/{shareId}/driveItem/content` URL that actually yields the file
* bytes. Returns `undefined` for non-shared-link URLs so callers can fall
* through to the existing fetch path.
*/
function tryBuildGraphSharesUrlForSharedLink(url) {
	if (!isGraphSharedLinkUrl(url)) return;
	return `${GRAPH_ROOT}/shares/${encodeGraphShareId(url)}/driveItem/content`;
}
function resolveRequestUrl(input) {
	if (typeof input === "string") return input;
	if (input instanceof URL) return input.toString();
	if (typeof input === "object" && input && "url" in input && typeof input.url === "string") return input.url;
	try {
		return JSON.stringify(input);
	} catch {
		return "";
	}
}
function normalizeContentType(value) {
	const trimmed = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(value);
	if (!trimmed) return;
	const parameterIndex = trimmed.indexOf(";");
	if (parameterIndex === -1) return trimmed.toLowerCase();
	return `${trimmed.slice(0, parameterIndex).trim().toLowerCase()}${trimmed.slice(parameterIndex)}`;
}
function resolveMSTeamsMediaKind(params) {
	const mime = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(params.contentType ?? "");
	const name = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(params.fileName ?? "");
	const fileType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(params.fileType ?? "");
	return mime.startsWith("image/") || IMAGE_EXT_RE.test(name) || IMAGE_EXT_RE.test(`x.${fileType}`) ? "image" : "document";
}
function isLikelyImageAttachment(att) {
	const contentType = normalizeContentType(att.contentType) ?? "";
	const name = typeof att.name === "string" ? att.name : "";
	if (contentType.startsWith("image/")) return true;
	if (IMAGE_EXT_RE.test(name)) return true;
	if (contentType === "application/vnd.microsoft.teams.file.download.info" && (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(att.content)) {
		const fileType = typeof att.content.fileType === "string" ? att.content.fileType : "";
		if (fileType && IMAGE_EXT_RE.test(`x.${fileType}`)) return true;
		const fileName = typeof att.content.fileName === "string" ? att.content.fileName : "";
		if (fileName && IMAGE_EXT_RE.test(fileName)) return true;
	}
	return false;
}
/**
* Returns true if the attachment can be downloaded (any file type).
* Used when downloading all files, not just images.
*/
function isDownloadableAttachment(att) {
	if ((normalizeContentType(att.contentType) ?? "") === "application/vnd.microsoft.teams.file.download.info" && (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(att.content) && typeof att.content.downloadUrl === "string") return true;
	if (typeof att.contentUrl === "string" && att.contentUrl.trim()) return true;
	return false;
}
function isAdvertisedFileAttachment(attachment) {
	const contentType = normalizeContentType(attachment.contentType) ?? "";
	if (contentType.startsWith("text/html") || contentType.startsWith("application/vnd.microsoft.card.") || contentType.startsWith("application/vnd.microsoft.teams.card.")) return false;
	return Boolean(isDownloadableAttachment(attachment) || isLikelyImageAttachment(attachment) || attachment.name?.trim() || contentType);
}
function isHtmlAttachment(att) {
	return (normalizeContentType(att.contentType) ?? "").startsWith("text/html");
}
function extractHtmlFromAttachment(att) {
	if (!isHtmlAttachment(att)) return;
	if (typeof att.content === "string") return att.content;
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(att.content)) return;
	return typeof att.content.text === "string" ? att.content.text : typeof att.content.body === "string" ? att.content.body : typeof att.content.content === "string" ? att.content.content : void 0;
}
function fileHintFromUrl(src) {
	try {
		return new URL(src).pathname.split("/").pop() || void 0;
	} catch {
		return;
	}
}
function extractInlineImageReferences(attachments) {
	const out = [];
	const seenReferences = /* @__PURE__ */ new Set();
	const representedAttachmentIds = new Set(attachments.flatMap((attachment) => {
		const id = attachment.id?.trim();
		return id && !extractHtmlFromAttachment(attachment) ? [id] : [];
	}));
	for (const att of attachments) {
		const html = extractHtmlFromAttachment(att);
		if (!html) continue;
		IMG_SRC_RE.lastIndex = 0;
		let match = IMG_SRC_RE.exec(html);
		while (match) {
			const src = match[1]?.trim();
			if (src) {
				if (src.startsWith("data:")) out.push({
					kind: "data",
					src
				});
				else if (!seenReferences.has(src)) {
					seenReferences.add(src);
					if (src.startsWith("cid:")) {
						const sourceId = src.slice(4) || void 0;
						if (!sourceId || !representedAttachmentIds.has(sourceId)) out.push({
							kind: "unavailable",
							sourceId
						});
						match = IMG_SRC_RE.exec(html);
						continue;
					}
					out.push({
						kind: "url",
						url: src,
						fileHint: fileHintFromUrl(src),
						sourceId: resolveInlineImageSourceId(src)
					});
				}
			}
			match = IMG_SRC_RE.exec(html);
		}
	}
	return out;
}
function safeHostForUrl(url) {
	try {
		return (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(new URL(url).hostname);
	} catch {
		return "invalid-url";
	}
}
function resolveAllowedHosts(input) {
	return (0, openclaw_plugin_sdk_ssrf_policy.normalizeHostnameSuffixAllowlist)(input, DEFAULT_MEDIA_HOST_ALLOWLIST);
}
function resolveAuthAllowedHosts(input) {
	return (0, openclaw_plugin_sdk_ssrf_policy.normalizeHostnameSuffixAllowlist)(input, DEFAULT_MEDIA_AUTH_HOST_ALLOWLIST);
}
function isMockFetchFn(fetchFn) {
	const candidate = fetchFn;
	return Boolean(candidate.mock || Object.hasOwn(candidate, "_isMockFunction"));
}
function resolveGuardedFetchImpl(params) {
	if (!params.fetchFn) return;
	if (params.fetchFnSupportsDispatcher === true || params.fetchFn === fetch || params.fetchFn === globalThis.fetch || isMockFetchFn(params.fetchFn)) return params.fetchFn;
	throw new Error("MSTeams attachment fetchFn must set fetchFnSupportsDispatcher to use guarded DNS pinning");
}
function resolveRetainedAuthorizationRedirectHostnameAllowlist(input) {
	if (!input) return;
	if (input.includes("*")) return ["*"];
	return resolveMediaSsrfPolicy(input)?.hostnameAllowlist;
}
function resolveAttachmentFetchPolicy(params) {
	return {
		allowHosts: resolveAllowedHosts(params?.allowHosts),
		authAllowHosts: resolveAuthAllowedHosts(params?.authAllowHosts)
	};
}
function isUrlAllowed(url, allowlist) {
	return (0, openclaw_plugin_sdk_ssrf_policy.isHttpsUrlAllowedByHostnameSuffixAllowlist)(url, allowlist);
}
function applyAuthorizationHeaderForUrl(params) {
	if (!params.bearerToken) {
		params.headers.delete("Authorization");
		return;
	}
	if (isUrlAllowed(params.url, params.authAllowHosts)) {
		params.headers.set("Authorization", `Bearer ${params.bearerToken}`);
		return;
	}
	params.headers.delete("Authorization");
}
function resolveMediaSsrfPolicy(allowHosts) {
	return (0, openclaw_plugin_sdk_ssrf_policy.buildHostnameAllowlistPolicyFromSuffixAllowlist)(allowHosts);
}
/**
* Returns true if the given IPv4 or IPv6 address is in a private, loopback,
* or link-local range that must never be reached from media downloads.
*
* Delegates to the SDK's `isPrivateIpAddress` which handles IPv4-mapped IPv6,
* expanded notation, NAT64, 6to4, Teredo, octal IPv4, and fails closed on
* parse errors.
*/
const isPrivateOrReservedIP = openclaw_plugin_sdk_ssrf_policy.isPrivateIpAddress;
/**
* Resolve a hostname via DNS and reject private/reserved IPs.
* Throws if the resolved IP is private or resolution fails.
*/
async function resolveAndValidateIP(hostname, resolveFn) {
	const resolve = resolveFn ?? node_dns_promises.lookup;
	let resolved;
	try {
		resolved = await resolve(hostname);
	} catch {
		throw new Error(`DNS resolution failed for "${hostname}"`);
	}
	if (isPrivateOrReservedIP(resolved.address)) throw new Error(`Hostname "${hostname}" resolves to private/reserved IP (${resolved.address})`);
	return resolved.address;
}
/** Maximum number of redirects to follow in safeFetch. */
const MAX_SAFE_REDIRECTS = 5;
function isRedirectStatus(status) {
	return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
/**
* Fetch a URL with redirect: "manual", validating each redirect target
* against the hostname allowlist and optional DNS-resolved IP (anti-SSRF).
*
* This prevents:
* - Auto-following redirects to non-allowlisted hosts
* - DNS rebinding attacks when a lookup function is provided
*/
async function safeFetch(params) {
	const resolveFn = params.resolveFn ?? node_dns_promises.lookup;
	const hasDispatcher = Boolean(params.requestInit && typeof params.requestInit === "object" && "dispatcher" in params.requestInit);
	const currentHeaders = new Headers(params.requestInit?.headers);
	const currentUrl = params.url;
	if (!isUrlAllowed(currentUrl, params.allowHosts)) throw new Error(`Initial download URL blocked: ${currentUrl}`);
	if (currentHeaders.has("authorization") && params.authorizationAllowHosts && !isUrlAllowed(currentUrl, params.authorizationAllowHosts)) currentHeaders.delete("authorization");
	if (!hasDispatcher) {
		const lookupFn = async (hostname) => {
			const resolved = await resolveFn(hostname);
			return [{
				...resolved,
				family: resolved.address.includes(":") ? 6 : 4
			}];
		};
		const guarded = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
			url: currentUrl,
			fetchImpl: resolveGuardedFetchImpl({
				fetchFn: params.fetchFn,
				fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher
			}),
			init: {
				...params.requestInit,
				headers: currentHeaders
			},
			maxRedirects: MAX_SAFE_REDIRECTS,
			requireHttps: true,
			policy: resolveMediaSsrfPolicy(params.allowHosts),
			lookupFn,
			retainAuthorizationRedirectHostnameAllowlist: resolveRetainedAuthorizationRedirectHostnameAllowlist(params.authorizationAllowHosts),
			auditContext: "msteams.attachment",
			timeoutMs: params.timeoutMs ?? 3e4
		});
		return (0, openclaw_plugin_sdk_fetch_runtime.responseWithRelease)(guarded.response, guarded.release);
	}
	try {
		const initialHost = new URL(currentUrl).hostname;
		await resolveAndValidateIP(initialHost, resolveFn);
	} catch {
		throw new Error(`Initial download URL blocked: ${currentUrl}`);
	}
	const res = await (params.fetchFn ?? fetch)(currentUrl, {
		...params.requestInit,
		headers: currentHeaders,
		redirect: "manual"
	});
	if (!isRedirectStatus(res.status)) return res;
	const location = res.headers.get("location");
	if (!location) return res;
	let redirectUrl;
	try {
		redirectUrl = new URL(location, currentUrl).toString();
	} catch {
		throw new Error(`Invalid redirect URL: ${location}`);
	}
	if (!isUrlAllowed(redirectUrl, params.allowHosts)) throw new Error(`Media redirect target blocked by allowlist: ${redirectUrl}`);
	if (currentHeaders.has("authorization") && params.authorizationAllowHosts && !isUrlAllowed(redirectUrl, params.authorizationAllowHosts)) currentHeaders.delete("authorization");
	return res;
}
async function safeFetchWithPolicy(params) {
	return await safeFetch({
		url: params.url,
		allowHosts: params.policy.allowHosts,
		authorizationAllowHosts: params.policy.authAllowHosts,
		fetchFn: params.fetchFn,
		fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
		requestInit: params.requestInit,
		resolveFn: params.resolveFn,
		timeoutMs: params.timeoutMs
	});
}
//#endregion
//#region extensions/msteams/src/cloud.ts
const DEFAULT_MSTEAMS_CLOUD = "Public";
const PUBLIC_MSTEAMS_SERVICE_HOST = "smba.trafficmanager.net";
const CHINA_BOT_FRAMEWORK_SERVICE_HOST = "botframework.azure.cn";
function normalizeOptionalServiceUrl(value) {
	const trimmed = value?.trim();
	if (!trimmed) return null;
	try {
		const parsed = new URL(trimmed);
		parsed.hash = "";
		parsed.search = "";
		parsed.pathname = parsed.pathname.replace(/\/+$/, "");
		return {
			value: parsed.toString().replace(/\/+$/, ""),
			host: parsed.hostname.toLowerCase()
		};
	} catch {
		return null;
	}
}
function resolveMSTeamsSdkCloudOptions(cfg) {
	const cloud = cfg?.cloud ?? DEFAULT_MSTEAMS_CLOUD;
	const serviceUrl = cfg?.serviceUrl?.trim();
	if (cloud !== "Public" && cloud !== "China" && !serviceUrl) throw new Error(`channels.msteams.cloud=${cloud} requires channels.msteams.serviceUrl so SDK proactive operations use the matching Teams Bot Connector endpoint.`);
	return {
		cloud,
		...serviceUrl ? { serviceUrl } : {}
	};
}
function isChinaBotFrameworkServiceHost(host) {
	return host === CHINA_BOT_FRAMEWORK_SERVICE_HOST || host.endsWith(`.${CHINA_BOT_FRAMEWORK_SERVICE_HOST}`);
}
function isChinaBotFrameworkServiceUrl(value) {
	const parsed = normalizeOptionalServiceUrl(value);
	return Boolean(parsed && isChinaBotFrameworkServiceHost(parsed.host));
}
function validateMSTeamsProactiveServiceUrlBoundary(params) {
	const configured = normalizeOptionalServiceUrl(params.configuredServiceUrl);
	if (params.cloud !== "Public" && params.cloud !== "China" && !configured) throw new Error(`msteams proactive send blocked for ${params.conversationId}: channels.msteams.cloud=${params.cloud} requires channels.msteams.serviceUrl so SDK proactive operations use the matching Teams Bot Connector endpoint.`);
	if (params.cloud === "China" && configured && !isChinaBotFrameworkServiceHost(configured.host)) throw new Error(`msteams proactive send blocked for ${params.conversationId}: configured Teams serviceUrl (${configured.value}) is not a Microsoft Teams China Bot Framework channel endpoint.`);
	if (params.cloud !== "China" && configured && isChinaBotFrameworkServiceHost(configured.host)) throw new Error(`msteams proactive send blocked for ${params.conversationId}: configured Teams serviceUrl (${configured.value}) requires channels.msteams.cloud=China.`);
	if (configured) {
		const stored = normalizeOptionalServiceUrl(params.storedServiceUrl);
		if (!stored) throw new Error(`msteams proactive send blocked for ${params.conversationId}: stored conversation reference is missing a valid serviceUrl. Ask the bot to receive a new Teams message in this conversation, then retry.`);
		if (stored.host !== configured.host) throw new Error(`msteams proactive send blocked for ${params.conversationId}: stored conversation serviceUrl (${stored.value}) does not match configured Teams SDK serviceUrl host (${configured.host}). Set channels.msteams.cloud/channels.msteams.serviceUrl for the Teams cloud that owns this conversation, or refresh the stored conversation by receiving a new message.`);
		return;
	}
	const stored = normalizeOptionalServiceUrl(params.storedServiceUrl);
	if (!stored) throw new Error(`msteams proactive send blocked for ${params.conversationId}: stored conversation reference is missing a valid serviceUrl. Ask the bot to receive a new Teams message in this conversation, then retry.`);
	if (params.cloud === "China") {
		if (!isChinaBotFrameworkServiceHost(stored.host)) throw new Error(`msteams proactive send blocked for ${params.conversationId}: stored conversation serviceUrl (${stored.value}) is not a Microsoft Teams China Bot Framework channel endpoint. Use a conversation reference received from the China/21Vianet Teams cloud.`);
		return;
	}
	if (isChinaBotFrameworkServiceUrl(stored.value)) throw new Error(`msteams proactive send blocked for ${params.conversationId}: stored conversation serviceUrl (${stored.value}) requires channels.msteams.cloud=China.`);
	if (stored.host !== PUBLIC_MSTEAMS_SERVICE_HOST) throw new Error(`msteams proactive send blocked for ${params.conversationId}: stored conversation serviceUrl (${stored.value}) is not a Microsoft Teams public-cloud Bot Connector endpoint. Set channels.msteams.cloud and channels.msteams.serviceUrl for the supported Teams cloud that owns this conversation.`);
}
//#endregion
//#region extensions/msteams/src/http-error.ts
async function createMSTeamsHttpError(response, label, options) {
	return await (0, openclaw_plugin_sdk_provider_http.createProviderHttpError)(response, label, options);
}
//#endregion
//#region extensions/msteams/src/bot-framework-service-url.ts
const BOT_FRAMEWORK_SERVICE_URL_HOST_ALLOWLIST = (0, openclaw_plugin_sdk_ssrf_policy.normalizeHostnameSuffixAllowlist)([
	"smba.trafficmanager.net",
	"smba.infra.gcc.teams.microsoft.com",
	"smba.infra.gov.teams.microsoft.us",
	"smba.infra.dod.teams.microsoft.us",
	"botframework.azure.cn"
]);
function describeBotFrameworkServiceUrlHost(serviceUrl) {
	try {
		return new URL(serviceUrl.trim()).hostname || "invalid-url";
	} catch {
		return "invalid-url";
	}
}
function isAllowedBotFrameworkServiceUrl(serviceUrl) {
	if (typeof serviceUrl !== "string") return false;
	const trimmed = serviceUrl.trim();
	return Boolean(trimmed && (0, openclaw_plugin_sdk_ssrf_policy.isHttpsUrlAllowedByHostnameSuffixAllowlist)(trimmed, BOT_FRAMEWORK_SERVICE_URL_HOST_ALLOWLIST));
}
function tryNormalizeBotFrameworkServiceUrl(serviceUrl) {
	if (!isAllowedBotFrameworkServiceUrl(serviceUrl)) return;
	return serviceUrl.trim().replace(/\/+$/, "");
}
function normalizeBotFrameworkServiceUrl(serviceUrl) {
	const normalized = tryNormalizeBotFrameworkServiceUrl(serviceUrl);
	if (normalized) return normalized;
	throw new Error(`Blocked Microsoft Teams serviceUrl host: ${describeBotFrameworkServiceUrlHost(serviceUrl)}`);
}
//#endregion
//#region extensions/msteams/src/send-handoff.ts
const connectorHandoff = new node_async_hooks.AsyncLocalStorage();
function notDispatched(error) {
	return error instanceof openclaw_plugin_sdk_error_runtime.PlatformMessageNotDispatchedError ? error : new openclaw_plugin_sdk_error_runtime.PlatformMessageNotDispatchedError(error instanceof Error ? error.message : "Teams delivery authority closed", {
		cause: error,
		retryable: false
	});
}
function assertMSTeamsSendHandoff(handoff) {
	try {
		handoff?.assertDirectAdapterHandoff?.();
	} catch (error) {
		throw notDispatched(error);
	}
}
function withMSTeamsConnectorHandoff(handoff, send) {
	const current = handoff.assertDirectAdapterHandoff || handoff.onPlatformSendDispatch ? handoff : connectorHandoff.getStore() ?? handoff;
	return connectorHandoff.run(current, () => send(current));
}
/** Called only by a Connector transport, after its asynchronous token preparation. */
async function prepareMSTeamsConnectorRequest() {
	const handoff = connectorHandoff.getStore();
	if (!handoff) return;
	const assertCurrent = handoff.assertDirectAdapterHandoff ? () => assertMSTeamsSendHandoff(handoff) : void 0;
	assertCurrent?.();
	try {
		await handoff.onPlatformSendDispatch?.();
	} catch (error) {
		throw notDispatched(error);
	}
	return assertCurrent;
}
const msteamsConnectorHandoffInterceptor = { request: async ({ config }) => {
	const assertCurrent = await prepareMSTeamsConnectorRequest();
	if (!assertCurrent) return config;
	const transforms = config.transformRequest;
	config.transformRequest = [...Array.isArray(transforms) ? transforms : transforms ? [transforms] : [], (data) => {
		assertCurrent();
		return data;
	}];
	const beforeRedirect = config.beforeRedirect;
	config.beforeRedirect = (...args) => {
		beforeRedirect?.(...args);
		assertCurrent();
	};
	return config;
} };
//#endregion
//#region extensions/msteams/src/qa/private-runtime.ts
const PRIVATE_QA_BUILD_ENV = "OPENCLAW_BUILD_PRIVATE_QA";
const PRIVATE_QA_NONCE_HEADER = "x-openclaw-msteams-qa-nonce";
const PRIVATE_QA_RUNTIME_SYMBOL = Symbol.for("openclaw.msteams.privateQaRuntime");
var PrivateQaHttpClient = class PrivateQaHttpClient {
	constructor(connectorUrl, nonce, options = {}) {
		this.connectorUrl = connectorUrl;
		this.nonce = nonce;
		this.options = options;
	}
	clone(options = {}) {
		return new PrivateQaHttpClient(this.connectorUrl, this.nonce, {
			...this.options,
			...options,
			headers: {
				...this.options.headers,
				...options.headers
			}
		});
	}
	async request(config) {
		const sourceUrl = new URL(config.url ?? "", "https://smba.trafficmanager.net");
		const targetUrl = new URL(`${sourceUrl.pathname}${sourceUrl.search}`, this.connectorUrl);
		const headers = new Headers(this.options.headers);
		for (const [key, value] of Object.entries(config.headers ?? {})) if (value != null) headers.set(key, String(value));
		headers.set(PRIVATE_QA_NONCE_HEADER, this.nonce);
		const token = typeof this.options.token === "function" ? await this.options.token() : this.options.token;
		if (token) headers.set("authorization", `Bearer ${token}`);
		const method = String(config.method ?? "GET").toUpperCase();
		const assertCurrent = await prepareMSTeamsConnectorRequest();
		const { response, release } = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
			url: targetUrl.toString(),
			init: {
				method,
				headers,
				body: method === "GET" || method === "HEAD" || config.data == null ? void 0 : typeof config.data === "string" ? config.data : JSON.stringify(config.data)
			},
			policy: (0, openclaw_plugin_sdk_ssrf_runtime.ssrfPolicyFromHttpBaseUrlAllowedOrigin)(targetUrl.toString()),
			maxRedirects: 0,
			auditContext: "msteams-private-qa-connector",
			beforeRequest: assertCurrent
		});
		try {
			const text = await response.text();
			const data = text ? JSON.parse(text) : void 0;
			if (!response.ok) throw Object.assign(/* @__PURE__ */ new Error(`Microsoft Teams private QA connector returned HTTP ${response.status}`), { statusCode: response.status });
			return {
				data,
				status: response.status,
				statusText: response.statusText,
				headers: Object.fromEntries(response.headers),
				config
			};
		} finally {
			await release();
		}
	}
	get(url, config = {}) {
		return this.request({
			...config,
			method: "GET",
			url
		});
	}
	post(url, data, config = {}) {
		return this.request({
			...config,
			data,
			method: "POST",
			url
		});
	}
	put(url, data, config = {}) {
		return this.request({
			...config,
			data,
			method: "PUT",
			url
		});
	}
	patch(url, data, config = {}) {
		return this.request({
			...config,
			data,
			method: "PATCH",
			url
		});
	}
	delete(url, config = {}) {
		return this.request({
			...config,
			method: "DELETE",
			url
		});
	}
};
function resolveMSTeamsPrivateQaRuntime(env = process.env, bootstrap = globalThis[PRIVATE_QA_RUNTIME_SYMBOL]) {
	if (!bootstrap) return;
	if (env[PRIVATE_QA_BUILD_ENV] !== "1") throw new Error("Microsoft Teams private QA runtime requires OPENCLAW_BUILD_PRIVATE_QA=1");
	const connectorUrl = bootstrap.connectorUrl?.trim();
	const nonce = bootstrap.nonce?.trim();
	const botToken = bootstrap.botToken?.trim();
	if (!connectorUrl || !nonce || !botToken) throw new Error("Microsoft Teams private QA bootstrap requires connector URL, nonce, and bot token");
	const parsedConnectorUrl = new URL(connectorUrl);
	if (parsedConnectorUrl.protocol !== "http:" || parsedConnectorUrl.hostname !== "127.0.0.1" && parsedConnectorUrl.hostname !== "localhost") throw new Error("Microsoft Teams private QA connector must use loopback HTTP");
	return {
		client: new PrivateQaHttpClient(parsedConnectorUrl.toString(), nonce),
		listenHost: "127.0.0.1",
		skipAuth: true,
		token: async () => botToken
	};
}
//#endregion
//#region extensions/msteams/src/user-agent.ts
let cachedUserAgent;
function resolveTeamsSdkVersion() {
	try {
		return (0, node_module.createRequire)(require("url").pathToFileURL(__filename).href)("@microsoft/teams.apps/package.json").version ?? "unknown";
	} catch {
		return "unknown";
	}
}
function resolveOpenClawVersion() {
	try {
		return require_runtime.getMSTeamsRuntime().version;
	} catch {
		return "unknown";
	}
}
/**
* Build a combined User-Agent string that preserves the Teams SDK identity
* and appends the OpenClaw version.
*
* Format: "teams.ts[apps]/<sdk-version> OpenClaw/<openclaw-version>"
* Example: "teams.ts[apps]/2.0.5 OpenClaw/2026.3.22"
*
* This lets the Teams backend track SDK usage while also identifying the
* host application.
*/
function buildUserAgent() {
	if (cachedUserAgent) return cachedUserAgent;
	cachedUserAgent = `teams.ts[apps]/${resolveTeamsSdkVersion()} OpenClaw/${resolveOpenClawVersion()}`;
	return cachedUserAgent;
}
/**
* User-Agent fragment for the Teams SDK App's client. The SDK's Client.clone
* merges this with its own `teams.ts[apps]/<sdk-version>` identifier, so we
* only contribute the OpenClaw piece — passing the full `buildUserAgent()`
* would double-print the SDK token.
*
* Format: "OpenClaw/<openclaw-version>"
*/
function buildOpenClawUserAgentFragment() {
	return `OpenClaw/${resolveOpenClawVersion()}`;
}
function ensureUserAgentHeader(headers) {
	const nextHeaders = new Headers(headers);
	if (!nextHeaders.has("User-Agent")) nextHeaders.set("User-Agent", buildUserAgent());
	return nextHeaders;
}
//#endregion
//#region extensions/msteams/src/sdk.ts
const AZURE_IDENTITY_MODULE = "@azure/identity";
const loadAzureIdentity = (0, openclaw_plugin_sdk_lazy_runtime.createLazyRuntimeModule)(() => import(AZURE_IDENTITY_MODULE));
const loadSdkModules = (0, openclaw_plugin_sdk_lazy_runtime.createLazyRuntimeModule)(() => Promise.all([import("@microsoft/teams.apps"), import("@microsoft/teams.api")]).then(([apps, api]) => ({
	App: apps.App,
	ExpressAdapter: apps.ExpressAdapter,
	cloudFromName: api.cloudFromName
})));
/**
* Lazily construct an ExpressAdapter that the Teams SDK App can register its
* routes on. The dynamic import keeps the SDK bundle off the hot startup path
* when msteams is disabled; the structural return type matches what
* `loadMSTeamsSdkWithAuth` accepts as its `httpServerAdapter` option.
*/
async function createMSTeamsExpressAdapter(serverOrApp) {
	const { ExpressAdapter } = await loadSdkModules();
	return new ExpressAdapter(serverOrApp);
}
/**
* Create a Teams SDK App instance from credentials. The App manages token
* acquisition, JWT validation, and the HTTP server lifecycle.
*
* Auth modes:
* - Secret: clientId + clientSecret → MSAL client credential flow (SDK built-in)
* - Managed identity: clientId + managedIdentityClientId → SDK built-in MI support
* - Certificate: clientId + custom token provider via @azure/identity
*/
async function createMSTeamsApp(creds, options) {
	const { App, cloudFromName } = await loadSdkModules();
	const privateQaRuntime = resolveMSTeamsPrivateQaRuntime();
	const cloud = options?.cloud ?? "Public";
	const serviceUrl = options?.serviceUrl ? normalizeBotFrameworkServiceUrl(options.serviceUrl) : void 0;
	const appOptions = {
		client: privateQaRuntime?.client ?? options?.httpClient ?? {
			headers: { "User-Agent": buildOpenClawUserAgentFragment() },
			timeout: 3e4,
			interceptors: [msteamsConnectorHandoffInterceptor]
		},
		...privateQaRuntime ? {
			clientSecret: "",
			skipAuth: privateQaRuntime.skipAuth,
			token: privateQaRuntime.token
		} : {},
		...options?.httpServerAdapter ? { httpServerAdapter: options.httpServerAdapter } : {},
		...options?.messagingEndpoint ? { messagingEndpoint: options.messagingEndpoint } : {},
		cloud: cloudFromName(cloud),
		...serviceUrl ? { serviceUrl } : {},
		...options?.oauthDefaultConnectionName ? { oauth: { defaultConnectionName: options.oauthDefaultConnectionName } } : {}
	};
	if (creds.type === "federated") return await createFederatedApp(creds, App, {
		clientSecret: "",
		...appOptions
	});
	return new App({
		clientId: creds.appId,
		clientSecret: creds.appPassword,
		tenantId: creds.tenantId,
		...appOptions
	});
}
async function createFederatedApp(creds, App, appOptions) {
	if (creds.useManagedIdentity) return new App({
		clientId: creds.appId,
		tenantId: creds.tenantId,
		managedIdentityClientId: creds.managedIdentityClientId ?? "system",
		...appOptions
	});
	if (!creds.certificatePath) throw new Error("Federated credentials require either a certificate path or managed identity.");
	let privateKey;
	try {
		privateKey = await (0, openclaw_plugin_sdk_secret_file.readSecretFile)(creds.certificatePath, "Microsoft Teams certificate");
	} catch {
		throw new Error("Failed to read certificate file: the configured credential is unavailable.");
	}
	return createCertificateApp(creds, privateKey, App, appOptions);
}
function createCertificateApp(creds, privateKey, App, appOptions) {
	let credentialPromise = null;
	const getCredential = async () => {
		if (!credentialPromise) credentialPromise = loadAzureIdentity().then((az) => new az.ClientCertificateCredential(creds.tenantId, creds.appId, { certificate: privateKey }));
		return credentialPromise;
	};
	const tokenProvider = async (scope) => {
		const token = await (await getCredential()).getToken(scope);
		if (!token?.token) throw new Error("Failed to acquire token via certificate credential.");
		return token.token;
	};
	return new App({
		clientId: creds.appId,
		tenantId: creds.tenantId,
		token: tokenProvider,
		...appOptions
	});
}
/**
* Build a token provider that uses the Teams SDK App's public tokenManager
* for token acquisition.
*/
function createMSTeamsTokenProvider(app) {
	const tokenToString = (token) => {
		if (token == null) return "";
		return token.toString();
	};
	return { async getAccessToken(scope) {
		if (scope.includes("graph.microsoft.com") || scope.includes("graph.microsoft.us") || scope.includes("microsoftgraph.chinacloudapi.cn")) {
			if (app.cloud?.graphScope?.includes("microsoftgraph.chinacloudapi.cn")) throw new Error("Microsoft Teams Graph operations are not supported for channels.msteams.cloud=China until Graph requests are routed through the Azure China Graph endpoint.");
			return tokenToString(await app.tokenManager.getGraphToken());
		}
		return tokenToString(await app.tokenManager.getBotToken());
	} };
}
async function loadMSTeamsSdkWithAuth(creds, options) {
	return { app: await createMSTeamsApp(creds, options) };
}
//#endregion
//#region extensions/msteams/src/token-response.ts
function readAccessToken(value) {
	if (typeof value === "string") return value;
	if (value && typeof value === "object") {
		const token = value.accessToken ?? value.token;
		return typeof token === "string" ? token : null;
	}
	return null;
}
//#endregion
//#region extensions/msteams/src/oauth.shared.ts
const MSTEAMS_OAUTH_REDIRECT_URI = "http://localhost:8086/oauth2callback";
const MSTEAMS_OAUTH_CALLBACK_PORT = 8086;
const MSTEAMS_OAUTH_CALLBACK_PATH = "/oauth2callback";
const MSTEAMS_DEFAULT_TOKEN_FETCH_TIMEOUT_MS = 1e4;
const MSTEAMS_DEFAULT_DELEGATED_SCOPES = [
	"ChatMessage.Send",
	"ChannelMessage.Send",
	"Chat.ReadWrite",
	"offline_access"
];
function buildMSTeamsAuthEndpoint(tenantId) {
	return `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/authorize`;
}
function buildMSTeamsTokenEndpoint(tenantId) {
	return `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
}
//#endregion
//#region extensions/msteams/src/oauth.token.ts
/** Five-minute buffer subtracted from token expiry to avoid edge-case clock drift. */
const EXPIRY_BUFFER_MS = 3e5;
function createMSTeamsTokenBody(params) {
	const body = new URLSearchParams({
		client_id: params.clientId,
		client_secret: params.clientSecret,
		grant_type: params.grantType,
		scope: [...params.scopes].join(" ")
	});
	for (const [key, value] of Object.entries(params.values ?? {})) body.set(key, value);
	return body;
}
function resolveMSTeamsTokenExpiresAt(value) {
	return (0, openclaw_plugin_sdk_number_runtime.resolveExpiresAtMsFromDurationSeconds)(value, { bufferMs: EXPIRY_BUFFER_MS });
}
function assertMSTeamsTokenResponseObject(data, failureLabel) {
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(data)) throw new Error(`MSTeams ${failureLabel} failed: invalid token response fields`);
	return data;
}
function parseMSTeamsTokenResponse(data, failureLabel) {
	const expiresAt = resolveMSTeamsTokenExpiresAt(data.expires_in);
	if (typeof data.access_token !== "string" || !data.access_token || expiresAt === void 0 || data.refresh_token !== void 0 && typeof data.refresh_token !== "string" || data.scope !== void 0 && typeof data.scope !== "string") throw new Error(`MSTeams ${failureLabel} failed: invalid token response fields`);
	return {
		access_token: data.access_token,
		refresh_token: data.refresh_token,
		expiresAt,
		scope: data.scope
	};
}
async function fetchMSTeamsTokens(params) {
	const { response, release } = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
		url: params.tokenUrl,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
				Accept: "application/json"
			},
			body: params.body,
			signal: AbortSignal.timeout(MSTEAMS_DEFAULT_TOKEN_FETCH_TIMEOUT_MS)
		},
		auditContext: params.auditContext
	});
	try {
		if (!response.ok) throw await createMSTeamsHttpError(response, `MSTeams ${params.failureLabel} failed`);
		return parseMSTeamsTokenResponse(assertMSTeamsTokenResponseObject(await (0, openclaw_plugin_sdk_provider_http.readProviderJsonResponse)(response, `MSTeams ${params.failureLabel} failed`), params.failureLabel), params.failureLabel);
	} finally {
		await release();
	}
}
async function requestMSTeamsDelegatedTokens(params) {
	const scopes = params.scopes ?? MSTEAMS_DEFAULT_DELEGATED_SCOPES;
	const body = createMSTeamsTokenBody({
		clientId: params.clientId,
		clientSecret: params.clientSecret,
		grantType: params.grantType,
		scopes,
		values: params.values
	});
	const data = await fetchMSTeamsTokens({
		tokenUrl: buildMSTeamsTokenEndpoint(params.tenantId),
		body,
		auditContext: params.auditContext,
		failureLabel: params.failureLabel
	});
	return {
		accessToken: data.access_token,
		refreshToken: params.resolveRefreshToken(data),
		expiresAt: data.expiresAt,
		scopes: data.scope ? data.scope.split(" ") : [...scopes]
	};
}
async function exchangeMSTeamsCodeForTokens(params) {
	return await requestMSTeamsDelegatedTokens({
		tenantId: params.tenantId,
		clientId: params.clientId,
		clientSecret: params.clientSecret,
		grantType: "authorization_code",
		scopes: params.scopes,
		values: {
			code: params.code,
			redirect_uri: MSTEAMS_OAUTH_REDIRECT_URI,
			code_verifier: params.verifier
		},
		auditContext: "msteams-oauth-token-exchange",
		failureLabel: "token exchange",
		resolveRefreshToken: (data) => {
			if (!data.refresh_token) throw new Error("No refresh token received from Azure AD. Please try again.");
			return data.refresh_token;
		}
	});
}
async function refreshMSTeamsDelegatedTokens(params) {
	return await requestMSTeamsDelegatedTokens({
		tenantId: params.tenantId,
		clientId: params.clientId,
		clientSecret: params.clientSecret,
		grantType: "refresh_token",
		scopes: params.scopes,
		values: { refresh_token: params.refreshToken },
		auditContext: "msteams-oauth-token-refresh",
		failureLabel: "token refresh",
		resolveRefreshToken: (data) => data.refresh_token ?? params.refreshToken
	});
}
//#endregion
//#region extensions/msteams/src/token.ts
function resolveAuthType(cfg) {
	const fromCfg = cfg?.authType;
	if (fromCfg === "secret" || fromCfg === "federated") return fromCfg;
	if (process.env.MSTEAMS_AUTH_TYPE === "federated") return "federated";
	return "secret";
}
function resolveFederatedPath(configValue, envValue) {
	if ((0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(configValue)) return configValue;
	if ((0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(envValue)) return envValue;
}
function hasConfiguredMSTeamsCredentials(cfg) {
	const authType = resolveAuthType(cfg);
	const hasAppId = Boolean((0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.appId) || (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_APP_ID));
	const hasTenantId = Boolean((0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.tenantId) || (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_TENANT_ID));
	if (authType === "federated") {
		const hasCert = Boolean(resolveFederatedPath(cfg?.certificatePath, process.env.MSTEAMS_CERTIFICATE_PATH));
		const hasManagedIdentity = cfg?.useManagedIdentity ?? process.env.MSTEAMS_USE_MANAGED_IDENTITY === "true";
		return hasAppId && hasTenantId && (hasCert || hasManagedIdentity);
	}
	return Boolean((0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.appId) && (0, openclaw_plugin_sdk_secret_input.hasConfiguredSecretInput)(cfg?.appPassword) && (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.tenantId));
}
function resolveMSTeamsCredentials(cfg) {
	const authType = resolveAuthType(cfg);
	const appId = (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.appId) || (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_APP_ID);
	const tenantId = (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.tenantId) || (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_TENANT_ID);
	if (!appId || !tenantId) return;
	if (authType === "federated") {
		const certificatePath = resolveFederatedPath(cfg?.certificatePath, process.env.MSTEAMS_CERTIFICATE_PATH);
		const certificateThumbprint = cfg?.certificateThumbprint || process.env.MSTEAMS_CERTIFICATE_THUMBPRINT || void 0;
		const useManagedIdentity = cfg?.useManagedIdentity ?? process.env.MSTEAMS_USE_MANAGED_IDENTITY === "true";
		const managedIdentityClientId = cfg?.managedIdentityClientId || process.env.MSTEAMS_MANAGED_IDENTITY_CLIENT_ID || void 0;
		if (!certificatePath && !useManagedIdentity) return;
		return {
			type: "federated",
			appId,
			tenantId,
			certificatePath,
			certificateThumbprint,
			useManagedIdentity: useManagedIdentity || void 0,
			managedIdentityClientId
		};
	}
	const appPassword = (0, openclaw_plugin_sdk_secret_input.normalizeResolvedSecretInputString)({
		value: cfg?.appPassword,
		path: "channels.msteams.appPassword"
	}) || (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_APP_PASSWORD);
	if (!appPassword) return;
	return {
		type: "secret",
		appId,
		appPassword,
		tenantId
	};
}
function loadDelegatedTokens() {
	return require_delegated_state.loadMSTeamsDelegatedTokens();
}
function saveDelegatedTokens(tokens) {
	return require_delegated_state.saveMSTeamsDelegatedTokens(tokens);
}
async function resolveDelegatedAccessToken(params) {
	const tokens = await loadDelegatedTokens();
	if (!tokens) return;
	if ((0, openclaw_plugin_sdk_number_runtime.isFutureDateTimestampMs)(tokens.expiresAt)) return tokens.accessToken;
	try {
		const refreshed = await refreshMSTeamsDelegatedTokens({
			tenantId: params.tenantId,
			clientId: params.clientId,
			clientSecret: params.clientSecret,
			refreshToken: tokens.refreshToken,
			scopes: tokens.scopes
		});
		await saveDelegatedTokens(refreshed);
		return refreshed.accessToken;
	} catch {
		return;
	}
}
//#endregion
//#region extensions/msteams/src/graph.ts
const GRAPH_BETA = "https://graph.microsoft.com/beta";
const graphRequestCurrentness = new node_async_hooks.AsyncLocalStorage();
function runWithMSTeamsGraphRequestCurrentness(assertCurrent, work) {
	assertCurrent?.();
	return graphRequestCurrentness.run(assertCurrent, work);
}
function captureGraphRequestCurrentness(assertReadAuthority) {
	const assertCurrent = graphRequestCurrentness.getStore();
	if (!assertCurrent) return assertReadAuthority;
	return () => {
		assertReadAuthority?.();
		assertCurrent();
	};
}
function normalizeQuery(value) {
	return value?.trim() ?? "";
}
function escapeOData(value) {
	return value.replace(/'/g, "''");
}
async function requestGraph(params) {
	const assertReadAuthority = (0, openclaw_plugin_sdk_fetch_runtime.captureChannelReadAuthority)();
	const assertRequestCurrent = captureGraphRequestCurrentness(assertReadAuthority);
	assertRequestCurrent?.();
	const hasBody = params.body !== void 0;
	const url = `${params.root ?? "https://graph.microsoft.com/v1.0"}${params.path}`;
	const { response, release } = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
		url,
		init: {
			method: params.method,
			headers: {
				"User-Agent": buildUserAgent(),
				Authorization: `Bearer ${params.token}`,
				...hasBody ? { "Content-Type": "application/json" } : {},
				...params.headers
			},
			body: hasBody ? JSON.stringify(params.body) : void 0
		},
		auditContext: "msteams.graph",
		timeoutMs: resolveMSTeamsRequestTimeoutMs(params.deadline),
		beforeRequest: assertRequestCurrent
	});
	let releaseInFinally = true;
	try {
		assertReadAuthority?.();
		if (!response.ok) throw await createMSTeamsHttpError(response, `${params.errorPrefix ?? "Graph"} ${params.path} failed`);
		releaseInFinally = false;
		return (0, openclaw_plugin_sdk_fetch_runtime.responseWithRelease)(response, release);
	} finally {
		if (releaseInFinally) await release();
	}
}
async function readOptionalGraphJson(res, label) {
	if (res.status === 204 || res.headers.get("content-length") === "0") return;
	return await (0, openclaw_plugin_sdk_provider_http.readProviderJsonResponse)(res, label);
}
async function mutateGraphJson(params) {
	const errorPrefix = `Graph${params.beta ? " beta" : ""} ${params.method}`;
	return readOptionalGraphJson(await requestGraph({
		token: params.token,
		path: params.path,
		method: params.method,
		body: params.body,
		root: params.beta ? GRAPH_BETA : void 0,
		errorPrefix
	}), `${errorPrefix} ${params.path} failed`);
}
async function fetchGraphJson(params) {
	const assertReadAuthority = (0, openclaw_plugin_sdk_fetch_runtime.captureChannelReadAuthority)();
	try {
		return await readOptionalGraphJson(await requestGraph({
			token: params.token,
			path: params.path,
			headers: params.headers,
			deadline: params.deadline
		}), `Graph ${params.path} failed`);
	} finally {
		assertReadAuthority?.();
	}
}
/**
* Fetch JSON from an absolute Graph API URL (for example @odata.nextLink
* pagination URLs) without prepending GRAPH_ROOT.
*/
async function fetchGraphAbsoluteUrl(params) {
	const assertReadAuthority = (0, openclaw_plugin_sdk_fetch_runtime.captureChannelReadAuthority)();
	const assertRequestCurrent = captureGraphRequestCurrentness(assertReadAuthority);
	assertRequestCurrent?.();
	const { response, release } = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
		url: params.url,
		init: { headers: {
			"User-Agent": buildUserAgent(),
			Authorization: `Bearer ${params.token}`,
			...params.headers
		} },
		auditContext: "msteams.graph.absolute",
		timeoutMs: MSTEAMS_REQUEST_TIMEOUT_MS,
		beforeRequest: assertRequestCurrent
	});
	try {
		assertReadAuthority?.();
		if (!response.ok) throw await createMSTeamsHttpError(response, `Graph ${params.url} failed`);
		return await (0, openclaw_plugin_sdk_provider_http.readProviderJsonResponse)(response, `Graph ${params.url} failed`);
	} finally {
		try {
			await release();
		} finally {
			assertReadAuthority?.();
		}
	}
}
/**
* Fetch all pages of a Graph API collection, following @odata.nextLink.
* Optionally stop early when `findOne` matches an item.
*/
async function fetchAllGraphPages(params) {
	const maxPages = params.maxPages ?? 50;
	const items = [];
	let nextPath = params.path;
	for (let page = 0; page < maxPages && nextPath; page++) {
		const res = await fetchGraphJson({
			token: params.token,
			path: nextPath,
			headers: params.headers
		});
		const pageItems = res.value ?? [];
		const match = params.findOne ? pageItems.find(params.findOne) : void 0;
		if (params.collectItems !== false) items.push(...pageItems);
		if (match) return {
			items,
			truncated: false,
			found: match
		};
		const rawNext = res["@odata.nextLink"];
		if (rawNext) nextPath = rawNext.replace("https://graph.microsoft.com/v1.0", "").replace("https://graph.microsoft.com/beta", "");
		else nextPath = void 0;
	}
	return {
		items,
		truncated: Boolean(nextPath)
	};
}
async function resolveGraphToken(cfg, options) {
	const assertRequestCurrent = captureGraphRequestCurrentness((0, openclaw_plugin_sdk_fetch_runtime.captureChannelReadAuthority)());
	assertRequestCurrent?.();
	const msteamsCfg = cfg?.channels?.msteams;
	const creds = resolveMSTeamsCredentials(msteamsCfg);
	if (!creds) throw new Error("MS Teams credentials missing");
	if (msteamsCfg?.cloud === "China") throw new Error("Microsoft Teams Graph operations are not supported for channels.msteams.cloud=China until Graph requests are routed through the Azure China Graph endpoint.");
	if (options?.preferDelegated && msteamsCfg?.delegatedAuth?.enabled && creds.type === "secret") {
		const delegated = await resolveDelegatedAccessToken({
			tenantId: creds.tenantId,
			clientId: creds.appId,
			clientSecret: creds.appPassword
		});
		assertRequestCurrent?.();
		if (delegated) return delegated;
	}
	const { app } = await loadMSTeamsSdkWithAuth(creds, resolveMSTeamsSdkCloudOptions(msteamsCfg));
	assertRequestCurrent?.();
	const tokenProvider = createMSTeamsTokenProvider(app);
	const graphTokenValue = await withMSTeamsRequestDeadline({
		label: "MS Teams Graph token",
		work: () => tokenProvider.getAccessToken("https://graph.microsoft.com")
	});
	assertRequestCurrent?.();
	const accessToken = readAccessToken(graphTokenValue);
	if (!accessToken) throw new Error("MS Teams graph token unavailable");
	return accessToken;
}
async function listTeamsByName(token, query) {
	return (await listTeamsByNameWithPageInfo(token, query)).items;
}
async function listTeamsByNameWithPageInfo(token, query) {
	const filter = `resourceProvisioningOptions/Any(x:x eq 'Team') and startsWith(displayName,'${escapeOData(query)}')`;
	return await fetchAllGraphPages({
		token,
		path: `/groups?$filter=${encodeURIComponent(filter)}&$select=id,displayName`
	});
}
async function deleteGraphRequest(params) {
	await (await requestGraph({
		token: params.token,
		path: params.path,
		method: "DELETE",
		errorPrefix: "Graph DELETE"
	})).body?.cancel().catch(() => void 0);
}
async function listChannelsForTeam(token, teamId) {
	return (await listChannelsForTeamWithPageInfo(token, teamId)).items;
}
async function listChannelsForTeamWithPageInfo(token, teamId) {
	return await fetchAllGraphPages({
		token,
		path: `/teams/${encodeURIComponent(teamId)}/channels?$select=id,displayName`
	});
}
//#endregion
//#region extensions/msteams/src/graph-users.ts
async function searchGraphUsers(params) {
	const query = params.query.trim();
	if (!query) return [];
	if (query.includes("@")) {
		const escaped = escapeOData(query);
		const filter = `(mail eq '${escaped}' or userPrincipalName eq '${escaped}')`;
		const path = `/users?$filter=${encodeURIComponent(filter)}&$select=id,displayName,mail,userPrincipalName`;
		return (await fetchGraphJson({
			token: params.token,
			path
		})).value ?? [];
	}
	const top = typeof params.top === "number" && params.top > 0 ? params.top : 10;
	const path = `/users?$search=${encodeURIComponent(`"displayName:${query}"`)}&$select=id,displayName,mail,userPrincipalName&$top=${top}`;
	return (await fetchGraphJson({
		token: params.token,
		path,
		headers: { ConsistencyLevel: "eventual" }
	})).value ?? [];
}
async function findGraphUsersByExactIdentity(params) {
	const query = params.query.trim();
	if (!query) return {
		items: [],
		truncated: false
	};
	const escaped = escapeOData(query);
	const filter = `(displayName eq '${escaped}' or mail eq '${escaped}' or userPrincipalName eq '${escaped}')`;
	const path = `/users?$filter=${encodeURIComponent(filter)}&\$select=id,displayName,mail,userPrincipalName`;
	return await fetchAllGraphPages({
		token: params.token,
		path
	});
}
//#endregion
//#region extensions/msteams/src/inbound.ts
/**
* Strip HTML tags, preserving text content.
*/
function htmlToPlainText(html) {
	return (0, openclaw_plugin_sdk_html_entity_runtime.decodeHtmlEntities)(html.replace(/<[^>]*>/g, " ")).replaceAll("\xA0", " ").replace(/\s+/g, " ").trim();
}
/**
* Extract quote info from MS Teams HTML reply attachments.
* Teams wraps quoted content in a blockquote with itemtype="http://schema.skype.com/Reply".
*/
function extractMSTeamsQuoteInfo(attachments) {
	for (const att of attachments) {
		let content = "";
		if (typeof att.content === "string") content = att.content;
		else if (typeof att.content === "object" && att.content !== null) {
			const record = att.content;
			content = typeof record.text === "string" ? record.text : typeof record.body === "string" ? record.body : "";
		}
		if (!content) continue;
		if (!content.includes("http://schema.skype.com/Reply")) continue;
		const senderMatch = /<strong[^>]*itemprop=["']mri["'][^>]*>(.*?)<\/strong>/i.exec(content);
		const sender = senderMatch?.[1] ? htmlToPlainText(senderMatch[1]) : void 0;
		const bodyMatch = /<p[^>]*itemprop=["']copy["'][^>]*>(.*?)<\/p>/is.exec(content) ?? /<p[^>]*itemprop=["']preview["'][^>]*>(.*?)<\/p>/is.exec(content);
		const body = bodyMatch?.[1] ? htmlToPlainText(bodyMatch[1]) : void 0;
		const id = /<blockquote[^>]*\bitemid=["']([^"']+)["'][^>]*>/is.exec(content)?.[1]?.trim() || void 0;
		if (body) return {
			sender: sender ?? "unknown",
			body,
			...id ? { id } : {}
		};
	}
}
function normalizeMSTeamsConversationId(raw) {
	return raw.split(";")[0] ?? raw;
}
function extractMSTeamsConversationMessageId(raw) {
	if (!raw) return;
	return (/(?:^|;)messageid=([^;]+)/i.exec(raw)?.[1]?.trim() ?? "") || void 0;
}
function parseMSTeamsActivityTimestamp(value) {
	if (!value) return;
	if (value instanceof Date) return value;
	if (typeof value !== "string") return;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? void 0 : date;
}
function stripMSTeamsMentionTags(text) {
	return text.replace(/<at[^>]*>.*?<\/at>/gi, "").trim();
}
function wasMSTeamsBotMentioned(activity) {
	const botId = activity.recipient?.id;
	if (!botId) return false;
	return (activity.entities ?? []).some((e) => e.type === "mention" && e.mentioned?.id === botId);
}
//#endregion
//#region extensions/msteams/src/resolve-allowlist.ts
const MSTEAMS_GROUP_CONVERSATION_ID = /^19:.+@thread\.(?:tacv2|skype|v2)$/i;
function normalizeExactMatch(value) {
	return (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(value ?? "");
}
function uniqueItemsById(items) {
	const byId = /* @__PURE__ */ new Map();
	for (const item of items) {
		const id = item.id?.trim();
		if (id && !byId.has(id)) byId.set(id, item);
	}
	return [...byId.values()];
}
function findExactTeams(items, query) {
	const normalized = normalizeExactMatch(query);
	return uniqueItemsById(items.filter((item) => normalizeExactMatch(item.displayName) === normalized));
}
function findExactChannels(items, query) {
	const normalized = normalizeExactMatch(query);
	return uniqueItemsById(items.filter((item) => normalizeExactMatch(item.displayName) === normalized));
}
function findExactUsers(items, query) {
	const normalized = normalizeExactMatch(query);
	return uniqueItemsById(items.filter((item) => [
		item.displayName,
		item.mail,
		item.userPrincipalName
	].some((value) => normalizeExactMatch(value) === normalized)));
}
function isStableMSTeamsUserId(raw) {
	return /^[0-9a-fA-F-]{16,}$/.test(normalizeMSTeamsUserInput(raw));
}
function normalizeStaticMSTeamsAllowEntry(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	if (trimmed === "*" || /^accessGroup:/i.test(trimmed)) return trimmed;
	const id = normalizeMSTeamsUserInput(trimmed);
	return isStableMSTeamsUserId(id) ? id : void 0;
}
function projectStableMSTeamsUserAllowlist(entries) {
	if (!entries) return;
	const projected = entries.map((entry) => normalizeStaticMSTeamsAllowEntry(entry)).filter((entry) => Boolean(entry));
	return [...new Map(projected.map((entry) => [normalizeExactMatch(entry), entry])).values()];
}
function projectStableMSTeamsGroupAllowlist(entries) {
	if (!entries) return;
	const projected = entries.map((entry) => {
		const stableUserEntry = normalizeStaticMSTeamsAllowEntry(entry);
		if (stableUserEntry) return stableUserEntry;
		const conversationId = normalizeMSTeamsConversationId(normalizeMSTeamsUserInput(entry));
		return MSTEAMS_GROUP_CONVERSATION_ID.test(conversationId) ? conversationId : void 0;
	}).filter((entry) => Boolean(entry));
	return [...new Map(projected.map((entry) => [MSTEAMS_GROUP_CONVERSATION_ID.test(entry) ? `conversation:${entry}` : normalizeExactMatch(entry), entry])).values()];
}
function stripProviderPrefix(raw) {
	return raw.replace(/^(msteams|teams):/i, "");
}
function normalizeMSTeamsMessagingTarget(raw) {
	let trimmed = raw.trim();
	if (!trimmed) return;
	trimmed = stripProviderPrefix(trimmed).trim();
	if (/^conversation:/i.test(trimmed)) {
		const id = trimmed.slice(13).trim();
		return id ? `conversation:${id}` : void 0;
	}
	if (/^user:/i.test(trimmed)) {
		const id = trimmed.slice(5).trim();
		return id ? `user:${id}` : void 0;
	}
	return trimmed || void 0;
}
function normalizeMSTeamsUserInput(raw) {
	return stripProviderPrefix(raw).replace(/^(user|conversation):/i, "").trim();
}
function parseMSTeamsConversationId(raw) {
	const trimmed = stripProviderPrefix(raw).trim();
	if (!/^conversation:/i.test(trimmed)) return null;
	return trimmed.slice(13).trim();
}
/**
* Detect whether a raw target string is a supported Microsoft Teams
* conversation id.
*
* Accepts both prefixed and bare formats:
* - `conversation:<id>` — explicit conversation prefix
* - `19:abc@thread.tacv2` / `19:abc@thread.skype` / `19:abc@thread.v2` — group or channel
* - `19:{userId}_{appId}@unq.gbl.spaces` — Graph 1:1 chat thread format
* - `a:1xxx` — Bot Framework personal (1:1) chat id
* - `8:orgid:xxx` — Bot Framework org-scoped personal chat id
*/
function looksLikeMSTeamsConversationId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (/^conversation:/i.test(trimmed)) return true;
	if (MSTEAMS_GROUP_CONVERSATION_ID.test(trimmed)) return true;
	if (/^19:.+@unq\.gbl\.spaces$/i.test(trimmed)) return true;
	if (/^a:1[A-Za-z0-9_-]+$/i.test(trimmed)) return true;
	if (/^8:orgid:[A-Za-z0-9-]+$/i.test(trimmed)) return true;
	return /@thread\b/i.test(trimmed);
}
/**
* Detect conversation ids plus stable user ids that explicit-target delivery
* can forward verbatim to the channel adapter.
*/
function looksLikeMSTeamsTargetId(raw) {
	const trimmed = stripProviderPrefix(raw.trim()).trim();
	if (looksLikeMSTeamsConversationId(trimmed)) return true;
	if (/^user:/i.test(trimmed)) {
		const id = trimmed.slice(5).trim();
		return /^[0-9a-fA-F-]{16,}$/.test(id);
	}
	return /^29:[A-Za-z0-9_-]+$/i.test(trimmed);
}
function normalizeMSTeamsTeamKey(raw) {
	return stripProviderPrefix(raw).replace(/^team:/i, "").trim() || void 0;
}
function normalizeMSTeamsChannelKey(raw) {
	return (raw?.trim().replace(/^#/, "").trim() ?? "") || void 0;
}
function normalizeMSTeamsConversationTargetId(raw) {
	const trimmed = stripProviderPrefix(raw).trim();
	return parseMSTeamsConversationId(trimmed) ?? trimmed;
}
function looksLikeMSTeamsThreadConversationId(raw) {
	const normalized = normalizeMSTeamsConversationTargetId(raw);
	return /^19:.+@thread\./i.test(normalized);
}
function isStableMSTeamsTeamKey(raw) {
	return /^[0-9a-fA-F-]{16,}$/.test(raw.trim()) || looksLikeMSTeamsThreadConversationId(raw);
}
function projectStableMSTeamsChannels(channels) {
	const projected = {};
	for (const [channelKey, channelConfig] of Object.entries(channels ?? {})) {
		if (channelKey === "*") {
			projected[channelKey] = channelConfig;
			continue;
		}
		if (looksLikeMSTeamsThreadConversationId(channelKey)) projected[normalizeMSTeamsConversationTargetId(channelKey)] = channelConfig;
	}
	return projected;
}
function projectStableMSTeamsTeamsConfig(teams) {
	if (!teams) return;
	const projected = {};
	for (const [teamKey, teamConfig] of Object.entries(teams)) {
		if (teamKey !== "*" && !isStableMSTeamsTeamKey(teamKey)) continue;
		const stableKey = teamKey === "*" ? teamKey : normalizeMSTeamsConversationTargetId(teamKey);
		projected[stableKey] = {
			...teamConfig,
			channels: projectStableMSTeamsChannels(teamConfig.channels)
		};
	}
	return projected;
}
function parseMSTeamsTeamChannelInput(raw) {
	const trimmed = stripProviderPrefix(raw).trim();
	if (!trimmed) return {};
	const parts = trimmed.split("/");
	const team = normalizeMSTeamsTeamKey(parts[0] ?? "");
	const channel = parts.length > 1 ? normalizeMSTeamsChannelKey(parts.slice(1).join("/")) : void 0;
	return {
		...team ? { team } : {},
		...channel ? { channel } : {}
	};
}
function parseMSTeamsTeamEntry(raw) {
	const { team, channel } = parseMSTeamsTeamChannelInput(raw);
	if (!team) return null;
	return {
		teamKey: team,
		...channel ? { channelKey: channel } : {}
	};
}
async function resolveMSTeamsChannelAllowlist(params) {
	let tokenPromise;
	const getToken = () => {
		tokenPromise ??= resolveGraphToken(params.cfg);
		return tokenPromise;
	};
	return await (0, openclaw_plugin_sdk_allow_from.mapAllowlistResolutionInputs)({
		inputs: params.entries,
		mapInput: async (input) => {
			const { team, channel } = parseMSTeamsTeamChannelInput(input);
			if (!team) return {
				input,
				resolved: false
			};
			if (looksLikeMSTeamsThreadConversationId(team)) {
				const teamId = normalizeMSTeamsConversationTargetId(team);
				if (!channel) return {
					input,
					resolved: true,
					teamId,
					teamName: teamId
				};
				if (!looksLikeMSTeamsThreadConversationId(channel)) return {
					input,
					resolved: false,
					teamId,
					teamName: teamId,
					note: "channel id required for conversation-id team"
				};
				const channelId = normalizeMSTeamsConversationTargetId(channel);
				return {
					input,
					resolved: true,
					teamId,
					teamName: teamId,
					channelId,
					channelName: channelId
				};
			}
			const token = await getToken();
			let teamMatch;
			if (/^[0-9a-fA-F-]{16,}$/.test(team)) teamMatch = {
				id: team,
				displayName: team
			};
			else {
				const result = await listTeamsByNameWithPageInfo(token, team);
				if (result.truncated) return {
					input,
					resolved: false,
					note: "team lookup incomplete"
				};
				const exactTeams = findExactTeams(result.items, team);
				const [exactTeam] = exactTeams;
				if (!exactTeam) return {
					input,
					resolved: false,
					note: "team not found"
				};
				if (exactTeams.length > 1) return {
					input,
					resolved: false,
					note: "team name is ambiguous"
				};
				teamMatch = exactTeam;
			}
			const graphTeamId = teamMatch.id?.trim();
			const teamName = teamMatch.displayName?.trim() || team;
			if (!graphTeamId) return {
				input,
				resolved: false,
				note: "team id missing"
			};
			if (!(params.teamIdMode !== "graph" || Boolean(channel))) return {
				input,
				resolved: true,
				teamId: graphTeamId,
				graphTeamId,
				teamName
			};
			let teamChannels;
			try {
				const result = await listChannelsForTeamWithPageInfo(token, graphTeamId);
				if (result.truncated) return {
					input,
					resolved: false,
					note: "channel lookup incomplete"
				};
				teamChannels = result.items;
			} catch {
				return {
					input,
					resolved: false,
					note: "channel lookup failed"
				};
			}
			const generalChannels = findExactChannels(teamChannels, "general");
			if (params.teamIdMode !== "graph" && generalChannels.length !== 1) return {
				input,
				resolved: false,
				graphTeamId,
				teamName,
				note: generalChannels.length > 1 ? "General channel is ambiguous" : "General channel not found"
			};
			const teamId = generalChannels[0]?.id?.trim() || graphTeamId;
			if (!channel) return {
				input,
				resolved: true,
				teamId,
				graphTeamId,
				teamName
			};
			const channelById = teamChannels.find((item) => item.id === channel);
			const exactChannels = channelById ? [channelById] : findExactChannels(teamChannels, channel);
			if (exactChannels.length === 0) return {
				input,
				resolved: false,
				note: "channel not found"
			};
			if (exactChannels.length > 1) return {
				input,
				resolved: false,
				note: "channel name is ambiguous"
			};
			const channelMatch = exactChannels[0];
			if (!channelMatch?.id) return {
				input,
				resolved: false,
				note: "channel id missing"
			};
			return {
				input,
				resolved: true,
				teamId,
				graphTeamId,
				teamName,
				channelId: channelMatch.id,
				channelName: channelMatch.displayName ?? channel
			};
		}
	});
}
async function resolveMSTeamsTeamsConfig(params) {
	const entries = [];
	const unresolved = [];
	for (const [teamKey, teamCfg] of Object.entries(params.teams)) {
		if (teamKey === "*") {
			for (const channelKey of Object.keys(teamCfg?.channels ?? {})) if (channelKey !== "*" && !looksLikeMSTeamsThreadConversationId(channelKey)) unresolved.push(`${teamKey}/${channelKey}`);
			continue;
		}
		const channelKeys = Object.keys(teamCfg?.channels ?? {}).filter((key) => key !== "*");
		if (channelKeys.length === 0) {
			entries.push({
				input: teamKey,
				teamKey
			});
			continue;
		}
		for (const channelKey of channelKeys) entries.push({
			input: `${teamKey}/${channelKey}`,
			teamKey,
			channelKey
		});
	}
	if (entries.length === 0) return {
		teams: projectStableMSTeamsTeamsConfig(params.teams) ?? {},
		mapping: [],
		unresolved
	};
	const resolved = await resolveMSTeamsChannelAllowlist({
		cfg: params.cfg,
		entries: entries.map((entry) => entry.input),
		teamIdMode: params.teamIdMode
	});
	const mapping = [];
	const teams = projectStableMSTeamsTeamsConfig(params.teams) ?? {};
	resolved.forEach((entry, index) => {
		const source = entries[index];
		if (!source) return;
		const sourceTeam = params.teams[source.teamKey] ?? {};
		const resolvedTeamId = params.teamIdMode === "graph" ? entry.graphTeamId : entry.teamId;
		if (!entry.resolved || !resolvedTeamId) {
			unresolved.push(entry.input);
			return;
		}
		mapping.push(entry.channelId ? `${entry.input}→${resolvedTeamId}/${entry.channelId}` : `${entry.input}→${resolvedTeamId}`);
		const existing = teams[resolvedTeamId] ?? {};
		const { channels: _sourceChannels, ...sourceTeamPolicy } = sourceTeam;
		const mergedChannels = {
			...projectStableMSTeamsChannels(sourceTeam.channels),
			...existing.channels
		};
		const mergedTeam = {
			...sourceTeamPolicy,
			...existing,
			channels: mergedChannels
		};
		teams[resolvedTeamId] = mergedTeam;
		if (source.channelKey && entry.channelId) {
			const sourceChannel = sourceTeam.channels?.[source.channelKey];
			if (sourceChannel) teams[resolvedTeamId] = {
				...mergedTeam,
				channels: {
					...mergedChannels,
					[entry.channelId]: {
						...sourceChannel,
						...mergedChannels?.[entry.channelId]
					}
				}
			};
		}
	});
	return {
		teams,
		mapping,
		unresolved
	};
}
async function resolveMSTeamsUserAllowlist(params) {
	let tokenPromise;
	const getToken = () => {
		tokenPromise ??= resolveGraphToken(params.cfg);
		return tokenPromise;
	};
	return await (0, openclaw_plugin_sdk_allow_from.mapAllowlistResolutionInputs)({
		inputs: params.entries,
		mapInput: async (input) => {
			const query = normalizeQuery(normalizeMSTeamsUserInput(input));
			if (!query) return {
				input,
				resolved: false
			};
			if (/^[0-9a-fA-F-]{16,}$/.test(query)) return {
				input,
				resolved: true,
				id: query
			};
			const result = await findGraphUsersByExactIdentity({
				token: await getToken(),
				query
			});
			if (result.truncated) return {
				input,
				resolved: false,
				note: "user lookup incomplete"
			};
			const users = findExactUsers(result.items, query);
			const [match] = users;
			if (!match) return {
				input,
				resolved: false,
				note: "user not found"
			};
			if (users.length > 1) return {
				input,
				resolved: false,
				note: "user identity is ambiguous"
			};
			return {
				input,
				resolved: true,
				id: match.id,
				name: match.displayName ?? void 0
			};
		}
	});
}
//#endregion
Object.defineProperty(exports, "ATTACHMENT_TAG_RE", {
	enumerable: true,
	get: function() {
		return ATTACHMENT_TAG_RE;
	}
});
Object.defineProperty(exports, "GRAPH_ROOT", {
	enumerable: true,
	get: function() {
		return GRAPH_ROOT;
	}
});
Object.defineProperty(exports, "IMG_SRC_RE", {
	enumerable: true,
	get: function() {
		return IMG_SRC_RE;
	}
});
Object.defineProperty(exports, "MSTEAMS_DEFAULT_DELEGATED_SCOPES", {
	enumerable: true,
	get: function() {
		return MSTEAMS_DEFAULT_DELEGATED_SCOPES;
	}
});
Object.defineProperty(exports, "MSTEAMS_OAUTH_CALLBACK_PATH", {
	enumerable: true,
	get: function() {
		return MSTEAMS_OAUTH_CALLBACK_PATH;
	}
});
Object.defineProperty(exports, "MSTEAMS_OAUTH_CALLBACK_PORT", {
	enumerable: true,
	get: function() {
		return MSTEAMS_OAUTH_CALLBACK_PORT;
	}
});
Object.defineProperty(exports, "MSTEAMS_OAUTH_REDIRECT_URI", {
	enumerable: true,
	get: function() {
		return MSTEAMS_OAUTH_REDIRECT_URI;
	}
});
Object.defineProperty(exports, "MSTEAMS_REQUEST_TIMEOUT_MS", {
	enumerable: true,
	get: function() {
		return MSTEAMS_REQUEST_TIMEOUT_MS;
	}
});
Object.defineProperty(exports, "applyAuthorizationHeaderForUrl", {
	enumerable: true,
	get: function() {
		return applyAuthorizationHeaderForUrl;
	}
});
Object.defineProperty(exports, "assertMSTeamsSendHandoff", {
	enumerable: true,
	get: function() {
		return assertMSTeamsSendHandoff;
	}
});
Object.defineProperty(exports, "buildMSTeamsAuthEndpoint", {
	enumerable: true,
	get: function() {
		return buildMSTeamsAuthEndpoint;
	}
});
Object.defineProperty(exports, "buildUserAgent", {
	enumerable: true,
	get: function() {
		return buildUserAgent;
	}
});
Object.defineProperty(exports, "createMSTeamsExpressAdapter", {
	enumerable: true,
	get: function() {
		return createMSTeamsExpressAdapter;
	}
});
Object.defineProperty(exports, "createMSTeamsHttpError", {
	enumerable: true,
	get: function() {
		return createMSTeamsHttpError;
	}
});
Object.defineProperty(exports, "createMSTeamsInboundDeadline", {
	enumerable: true,
	get: function() {
		return createMSTeamsInboundDeadline;
	}
});
Object.defineProperty(exports, "createMSTeamsTokenProvider", {
	enumerable: true,
	get: function() {
		return createMSTeamsTokenProvider;
	}
});
Object.defineProperty(exports, "deleteGraphRequest", {
	enumerable: true,
	get: function() {
		return deleteGraphRequest;
	}
});
Object.defineProperty(exports, "describeBotFrameworkServiceUrlHost", {
	enumerable: true,
	get: function() {
		return describeBotFrameworkServiceUrlHost;
	}
});
Object.defineProperty(exports, "encodeGraphShareId", {
	enumerable: true,
	get: function() {
		return encodeGraphShareId;
	}
});
Object.defineProperty(exports, "ensureUserAgentHeader", {
	enumerable: true,
	get: function() {
		return ensureUserAgentHeader;
	}
});
Object.defineProperty(exports, "escapeOData", {
	enumerable: true,
	get: function() {
		return escapeOData;
	}
});
Object.defineProperty(exports, "exchangeMSTeamsCodeForTokens", {
	enumerable: true,
	get: function() {
		return exchangeMSTeamsCodeForTokens;
	}
});
Object.defineProperty(exports, "extractHtmlFromAttachment", {
	enumerable: true,
	get: function() {
		return extractHtmlFromAttachment;
	}
});
Object.defineProperty(exports, "extractInlineImageReferences", {
	enumerable: true,
	get: function() {
		return extractInlineImageReferences;
	}
});
Object.defineProperty(exports, "extractMSTeamsConversationMessageId", {
	enumerable: true,
	get: function() {
		return extractMSTeamsConversationMessageId;
	}
});
Object.defineProperty(exports, "extractMSTeamsQuoteInfo", {
	enumerable: true,
	get: function() {
		return extractMSTeamsQuoteInfo;
	}
});
Object.defineProperty(exports, "fetchAllGraphPages", {
	enumerable: true,
	get: function() {
		return fetchAllGraphPages;
	}
});
Object.defineProperty(exports, "fetchGraphAbsoluteUrl", {
	enumerable: true,
	get: function() {
		return fetchGraphAbsoluteUrl;
	}
});
Object.defineProperty(exports, "fetchGraphJson", {
	enumerable: true,
	get: function() {
		return fetchGraphJson;
	}
});
Object.defineProperty(exports, "hasConfiguredMSTeamsCredentials", {
	enumerable: true,
	get: function() {
		return hasConfiguredMSTeamsCredentials;
	}
});
Object.defineProperty(exports, "htmlToPlainText", {
	enumerable: true,
	get: function() {
		return htmlToPlainText;
	}
});
Object.defineProperty(exports, "isAdvertisedFileAttachment", {
	enumerable: true,
	get: function() {
		return isAdvertisedFileAttachment;
	}
});
Object.defineProperty(exports, "isAllowedBotFrameworkServiceUrl", {
	enumerable: true,
	get: function() {
		return isAllowedBotFrameworkServiceUrl;
	}
});
Object.defineProperty(exports, "isDownloadableAttachment", {
	enumerable: true,
	get: function() {
		return isDownloadableAttachment;
	}
});
Object.defineProperty(exports, "isLikelyImageAttachment", {
	enumerable: true,
	get: function() {
		return isLikelyImageAttachment;
	}
});
Object.defineProperty(exports, "isRedirectStatus", {
	enumerable: true,
	get: function() {
		return isRedirectStatus;
	}
});
Object.defineProperty(exports, "isUrlAllowed", {
	enumerable: true,
	get: function() {
		return isUrlAllowed;
	}
});
Object.defineProperty(exports, "listChannelsForTeam", {
	enumerable: true,
	get: function() {
		return listChannelsForTeam;
	}
});
Object.defineProperty(exports, "listChannelsForTeamWithPageInfo", {
	enumerable: true,
	get: function() {
		return listChannelsForTeamWithPageInfo;
	}
});
Object.defineProperty(exports, "listTeamsByName", {
	enumerable: true,
	get: function() {
		return listTeamsByName;
	}
});
Object.defineProperty(exports, "loadDelegatedTokens", {
	enumerable: true,
	get: function() {
		return loadDelegatedTokens;
	}
});
Object.defineProperty(exports, "loadMSTeamsSdkWithAuth", {
	enumerable: true,
	get: function() {
		return loadMSTeamsSdkWithAuth;
	}
});
Object.defineProperty(exports, "looksLikeMSTeamsConversationId", {
	enumerable: true,
	get: function() {
		return looksLikeMSTeamsConversationId;
	}
});
Object.defineProperty(exports, "looksLikeMSTeamsTargetId", {
	enumerable: true,
	get: function() {
		return looksLikeMSTeamsTargetId;
	}
});
Object.defineProperty(exports, "mutateGraphJson", {
	enumerable: true,
	get: function() {
		return mutateGraphJson;
	}
});
Object.defineProperty(exports, "normalizeBotFrameworkServiceUrl", {
	enumerable: true,
	get: function() {
		return normalizeBotFrameworkServiceUrl;
	}
});
Object.defineProperty(exports, "normalizeContentType", {
	enumerable: true,
	get: function() {
		return normalizeContentType;
	}
});
Object.defineProperty(exports, "normalizeMSTeamsConversationId", {
	enumerable: true,
	get: function() {
		return normalizeMSTeamsConversationId;
	}
});
Object.defineProperty(exports, "normalizeMSTeamsMessagingTarget", {
	enumerable: true,
	get: function() {
		return normalizeMSTeamsMessagingTarget;
	}
});
Object.defineProperty(exports, "normalizeMSTeamsUserInput", {
	enumerable: true,
	get: function() {
		return normalizeMSTeamsUserInput;
	}
});
Object.defineProperty(exports, "normalizeQuery", {
	enumerable: true,
	get: function() {
		return normalizeQuery;
	}
});
Object.defineProperty(exports, "parseMSTeamsActivityTimestamp", {
	enumerable: true,
	get: function() {
		return parseMSTeamsActivityTimestamp;
	}
});
Object.defineProperty(exports, "parseMSTeamsConversationId", {
	enumerable: true,
	get: function() {
		return parseMSTeamsConversationId;
	}
});
Object.defineProperty(exports, "parseMSTeamsTeamChannelInput", {
	enumerable: true,
	get: function() {
		return parseMSTeamsTeamChannelInput;
	}
});
Object.defineProperty(exports, "parseMSTeamsTeamEntry", {
	enumerable: true,
	get: function() {
		return parseMSTeamsTeamEntry;
	}
});
Object.defineProperty(exports, "projectStableMSTeamsGroupAllowlist", {
	enumerable: true,
	get: function() {
		return projectStableMSTeamsGroupAllowlist;
	}
});
Object.defineProperty(exports, "projectStableMSTeamsTeamsConfig", {
	enumerable: true,
	get: function() {
		return projectStableMSTeamsTeamsConfig;
	}
});
Object.defineProperty(exports, "projectStableMSTeamsUserAllowlist", {
	enumerable: true,
	get: function() {
		return projectStableMSTeamsUserAllowlist;
	}
});
Object.defineProperty(exports, "readAccessToken", {
	enumerable: true,
	get: function() {
		return readAccessToken;
	}
});
Object.defineProperty(exports, "resolveAttachmentFetchPolicy", {
	enumerable: true,
	get: function() {
		return resolveAttachmentFetchPolicy;
	}
});
Object.defineProperty(exports, "resolveGraphToken", {
	enumerable: true,
	get: function() {
		return resolveGraphToken;
	}
});
Object.defineProperty(exports, "resolveMSTeamsChannelAllowlist", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsChannelAllowlist;
	}
});
Object.defineProperty(exports, "resolveMSTeamsCredentials", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsCredentials;
	}
});
Object.defineProperty(exports, "resolveMSTeamsMediaKind", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsMediaKind;
	}
});
Object.defineProperty(exports, "resolveMSTeamsPrivateQaRuntime", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsPrivateQaRuntime;
	}
});
Object.defineProperty(exports, "resolveMSTeamsRequestTimeoutMs", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsRequestTimeoutMs;
	}
});
Object.defineProperty(exports, "resolveMSTeamsSdkCloudOptions", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsSdkCloudOptions;
	}
});
Object.defineProperty(exports, "resolveMSTeamsSharePointUploadTimeoutMs", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsSharePointUploadTimeoutMs;
	}
});
Object.defineProperty(exports, "resolveMSTeamsTeamsConfig", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsTeamsConfig;
	}
});
Object.defineProperty(exports, "resolveMSTeamsUserAllowlist", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsUserAllowlist;
	}
});
Object.defineProperty(exports, "resolveMediaSsrfPolicy", {
	enumerable: true,
	get: function() {
		return resolveMediaSsrfPolicy;
	}
});
Object.defineProperty(exports, "resolveRequestUrl", {
	enumerable: true,
	get: function() {
		return resolveRequestUrl;
	}
});
Object.defineProperty(exports, "runWithMSTeamsGraphRequestCurrentness", {
	enumerable: true,
	get: function() {
		return runWithMSTeamsGraphRequestCurrentness;
	}
});
Object.defineProperty(exports, "safeFetchWithPolicy", {
	enumerable: true,
	get: function() {
		return safeFetchWithPolicy;
	}
});
Object.defineProperty(exports, "safeHostForUrl", {
	enumerable: true,
	get: function() {
		return safeHostForUrl;
	}
});
Object.defineProperty(exports, "saveDelegatedTokens", {
	enumerable: true,
	get: function() {
		return saveDelegatedTokens;
	}
});
Object.defineProperty(exports, "searchGraphUsers", {
	enumerable: true,
	get: function() {
		return searchGraphUsers;
	}
});
Object.defineProperty(exports, "stripMSTeamsMentionTags", {
	enumerable: true,
	get: function() {
		return stripMSTeamsMentionTags;
	}
});
Object.defineProperty(exports, "tryBuildGraphSharesUrlForSharedLink", {
	enumerable: true,
	get: function() {
		return tryBuildGraphSharesUrlForSharedLink;
	}
});
Object.defineProperty(exports, "tryNormalizeBotFrameworkServiceUrl", {
	enumerable: true,
	get: function() {
		return tryNormalizeBotFrameworkServiceUrl;
	}
});
Object.defineProperty(exports, "validateMSTeamsProactiveServiceUrlBoundary", {
	enumerable: true,
	get: function() {
		return validateMSTeamsProactiveServiceUrlBoundary;
	}
});
Object.defineProperty(exports, "wasMSTeamsBotMentioned", {
	enumerable: true,
	get: function() {
		return wasMSTeamsBotMentioned;
	}
});
Object.defineProperty(exports, "withMSTeamsAbortableRequestTimeout", {
	enumerable: true,
	get: function() {
		return withMSTeamsAbortableRequestTimeout;
	}
});
Object.defineProperty(exports, "withMSTeamsConnectorHandoff", {
	enumerable: true,
	get: function() {
		return withMSTeamsConnectorHandoff;
	}
});
Object.defineProperty(exports, "withMSTeamsRequestDeadline", {
	enumerable: true,
	get: function() {
		return withMSTeamsRequestDeadline;
	}
});
