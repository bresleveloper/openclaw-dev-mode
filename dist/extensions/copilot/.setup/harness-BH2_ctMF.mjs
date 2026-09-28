import { filterStringRecord, normalizeOptionalString, readNonEmptyStringPreservingWhitespace } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildAgentHookContextChannelFields, compactWithSafetyTimeout, getModelProviderRequestTransport, projectSettledTurnFinalizationAttemptResult, resolveCompactionTimeoutMs, runAgentHarnessAfterCompactionHook, runAgentHarnessBeforeCompactionHook } from "openclaw/plugin-sdk/agent-harness-runtime";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { createServer } from "node:http";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fetchWithSsrFGuard, isBlockedHostnameOrIp } from "openclaw/plugin-sdk/ssrf-runtime";
import { isNonSecretApiKeyMarker } from "openclaw/plugin-sdk/provider-auth";
//#region extensions/copilot/src/auth-bridge.ts
/**
* Pure functional auth resolver for the copilot agent runtime.
*
* Scope:
*
*   - Consumes the resolved auth signals that core's harness contract
*     already carries on `EmbeddedRunAttemptParams` (=
*     `AgentHarnessAttemptParams`): `resolvedApiKey`, `authProfileId`,
*     `authProfileIdSource`. Core resolves these from the agent's
*     `AuthProfileStore` via `provider-usage.auth.ts:resolveProviderAuths`
*     before invoking the harness, so the harness does not re-perform
*     the lookup (and could not, due to the package boundary in
*     `tsconfig.package-boundary.base.json`).
*   - Reads optional explicit overrides from the harness attempt params
*     (`auth.useLoggedInUser`, `auth.gitHubToken`) for direct CLI / test
*     use cases.
*   - Falls back to OPENCLAW_GITHUB_TOKEN, COPILOT_GITHUB_TOKEN,
*     GH_TOKEN, or GITHUB_TOKEN env vars (in that precedence) when
*     no contract-resolved token is given; synthesises a stable,
*     non-reversible pool fingerprint so token rotation busts the
*     client pool cleanly.
*   - Computes a per-agent `copilotHome` default
*     (`<openClawHome>/.openclaw/agents/<agentId>/copilot`, or
*     `<agentDir>/copilot` when an agent directory is supplied) that
*     respects `OPENCLAW_HOME` for the home directory root.
*   - Defaults to `useLoggedInUser` when no token signal is available.
*
* Precedence (highest to lowest):
*   1. `auth.useLoggedInUser === true` (explicit user opt-in)
*   2. `auth.gitHubToken` (explicit override; requires
*      `profileId` + `profileVersion`)
*   3. `resolvedApiKey` + `authProfileId` from the contract (core's
*      AuthProfileStore-resolved token — the production main path for
*      a configured `github-copilot` auth profile)
*   4. OPENCLAW_GITHUB_TOKEN, then COPILOT_GITHUB_TOKEN, then
*      GH_TOKEN, then GITHUB_TOKEN env vars (mirrors the
*      shipped `github-copilot` provider precedence so headless
*      users who already follow the documented
*      COPILOT_GITHUB_TOKEN / GH_TOKEN setup get the token they
*      configured rather than silently falling through to the
*      logged-in CLI user.)
*   5. `useLoggedInUser` (default)
*/
const COPILOT_TOKEN_PROFILE_ERROR = "[copilot-attempt] gitHubToken auth requires profileId+profileVersion (pool keying safety; per Q5/Q1 decisions)";
const COPILOT_DEFAULT_AGENT_ID = "copilot";
function createCopilotByokAuth(input) {
	return {
		...resolveCopilotAuth({
			agentId: input.agentId,
			agentDir: input.agentDir,
			workspaceDir: input.workspaceDir,
			copilotHome: input.copilotHome,
			env: input.env,
			homeDir: input.homeDir,
			auth: { useLoggedInUser: true }
		}),
		authMode: "byok",
		authProfileId: input.authProfileId?.trim() || "byok:resolved",
		authProfileVersion: input.authProfileVersion?.trim() || "byok:unfingerprinted"
	};
}
/**
* Resolve copilot auth + copilotHome.
*
* Synchronous because we intentionally do not perform any I/O or
* cross-package credential lookups here (see file header for rationale).
*
* Throws if `gitHubToken` is supplied via `params.auth.gitHubToken`
* WITHOUT both `profileId` and `profileVersion` (the existing invariant
* from attempt.ts; preserves pool-key safety per Q5/Q1).
*/
function resolveCopilotAuth(input) {
	const env = input.env ?? process.env;
	const homeDir = input.homeDir ?? homedir;
	const agentId = sanitizeAgentId(input.agentId);
	const copilotHome = resolveCopilotHome({
		explicit: readNonEmptyStringPreservingWhitespace(input.copilotHome),
		agentDir: readNonEmptyStringPreservingWhitespace(input.agentDir),
		workspaceDir: readNonEmptyStringPreservingWhitespace(input.workspaceDir),
		agentId,
		env,
		homeDir
	});
	const explicitToken = readNonEmptyStringPreservingWhitespace(input.auth?.gitHubToken);
	const explicitProfileId = readNonEmptyStringPreservingWhitespace(input.auth?.profileId) ?? readNonEmptyStringPreservingWhitespace(input.authProfileId);
	const explicitProfileVersion = readNonEmptyStringPreservingWhitespace(input.auth?.profileVersion) ?? readNonEmptyStringPreservingWhitespace(input.profileVersion);
	if (input.auth?.useLoggedInUser === true) return {
		authMode: "useLoggedInUser",
		copilotHome,
		agentId
	};
	if (explicitToken) {
		if (!explicitProfileId || !explicitProfileVersion) throw new Error(COPILOT_TOKEN_PROFILE_ERROR);
		return {
			authMode: "gitHubToken",
			gitHubToken: explicitToken,
			authProfileId: explicitProfileId,
			authProfileVersion: explicitProfileVersion,
			copilotHome,
			agentId
		};
	}
	const contractToken = readNonEmptyStringPreservingWhitespace(input.resolvedApiKey);
	if (contractToken) return {
		authMode: "gitHubToken",
		gitHubToken: contractToken,
		authProfileId: readNonEmptyStringPreservingWhitespace(input.authProfileId) ?? "pi:resolved",
		authProfileVersion: tokenFingerprint(contractToken),
		copilotHome,
		agentId
	};
	const envFallback = readEnvTokenFallback(env);
	if (envFallback) return {
		authMode: "gitHubToken",
		gitHubToken: envFallback.token,
		authProfileId: envFallback.profileId,
		authProfileVersion: envFallback.profileVersion,
		copilotHome,
		agentId
	};
	return {
		authMode: "useLoggedInUser",
		copilotHome,
		agentId
	};
}
/**
* Validate + sanitise an agent id for use in filesystem paths and pool
* keys.
*
* Mirrors the shape constraints documented by core's `normalizeAgentId`
* / `isValidAgentId` in `src/routing/session-key.ts` (alnum + `-_`,
* starts with alnum, lowercase, <=64 chars). We re-implement here
* because the package boundary prevents importing from `src/`. Any
* caller that passes an invalid id falls back to the shared default
* (`COPILOT_DEFAULT_AGENT_ID`) rather than throwing - the harness's
* job is to keep running with a safe default, not to validate config.
*/
function sanitizeAgentId(value) {
	const trimmed = (value ?? "").trim().toLowerCase();
	if (!trimmed) return COPILOT_DEFAULT_AGENT_ID;
	if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(trimmed)) return COPILOT_DEFAULT_AGENT_ID;
	return trimmed;
}
function resolveCopilotHome(args) {
	if (args.explicit) return resolve(args.explicit);
	if (args.agentDir) return resolve(join(args.agentDir, "copilot"));
	const openClawHome = readNonEmptyStringPreservingWhitespace(args.env.OPENCLAW_HOME);
	const rootHome = openClawHome ? resolve(openClawHome) : safeHomeDir(args.homeDir);
	return resolve(join(rootHome, ".openclaw", "agents", args.agentId, "copilot"));
}
function safeHomeDir(homeDir) {
	try {
		const value = homeDir();
		if (typeof value === "string" && value.length > 0) return value;
	} catch {}
	return process.cwd();
}
function readEnvTokenFallback(env) {
	const candidates = [
		{
			name: "OPENCLAW_GITHUB_TOKEN",
			value: readNonEmptyStringPreservingWhitespace(env.OPENCLAW_GITHUB_TOKEN)
		},
		{
			name: "COPILOT_GITHUB_TOKEN",
			value: readNonEmptyStringPreservingWhitespace(env.COPILOT_GITHUB_TOKEN)
		},
		{
			name: "GH_TOKEN",
			value: readNonEmptyStringPreservingWhitespace(env.GH_TOKEN)
		},
		{
			name: "GITHUB_TOKEN",
			value: readNonEmptyStringPreservingWhitespace(env.GITHUB_TOKEN)
		}
	];
	for (const { name, value } of candidates) if (value) return {
		token: value,
		profileId: `env:${name}`,
		profileVersion: tokenFingerprint(value)
	};
}
/**
* Non-reversible 12-hex-char fingerprint of a token, prefixed with
* `sha256:` for forward-compat. Used as the pool-key profileVersion when
* a token comes from env: rotation -> different fingerprint -> pool
* entry invalidated cleanly. 48 bits of entropy is sufficient
* collision resistance for a per-agent client pool; never log the
* fingerprint alongside an account id.
*/
function tokenFingerprint(token) {
	return `sha256:${createHash("sha256").update(token).digest("hex").slice(0, 12)}`;
}
//#endregion
//#region extensions/copilot/src/byok-proxy.ts
const LOOPBACK_HOST = "127.0.0.1";
const PROXY_CREDENTIAL_HEADER_PREFIX = "x-openclaw-copilot-byok-";
async function createCopilotByokProxy(resolvedProvider) {
	if (resolvedProvider.mode !== "byok") return;
	const providerConfig = resolvedProvider.provider;
	if (!providerConfig?.baseUrl) throw new Error("[copilot-attempt] BYOK requires a provider baseUrl");
	const targetBaseUrl = new URL(providerConfig.baseUrl);
	const nonce = randomBytes(12).toString("hex");
	const targetPathPrefix = trimTrailingSlash(targetBaseUrl.pathname);
	const proxyPathPrefix = `/${nonce}${targetPathPrefix}`;
	const acceptsAzureSdkPaths = providerConfig.type === "azure";
	const proxyCredentialHeader = acceptsAzureSdkPaths ? createProxyCredentialHeaderName(providerConfig.headers) : void 0;
	const upstreamBearerAuthorization = resolveUpstreamBearerAuthorization(providerConfig);
	const activeFetches = /* @__PURE__ */ new Set();
	const server = createServer((req, res) => {
		handleProxyRequest(req, res, {
			acceptsAzureSdkPaths,
			activeFetches,
			proxyPathPrefix,
			proxyCredential: nonce,
			proxyCredentialHeader,
			targetBaseUrl,
			targetPathPrefix,
			upstreamBearerAuthorization
		});
	});
	await new Promise((resolve, reject) => {
		server.once("error", reject);
		server.listen(0, LOOPBACK_HOST, () => {
			server.off("error", reject);
			resolve();
		});
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		server.close();
		throw new Error("[copilot-attempt] failed to start BYOK network proxy");
	}
	const proxyBaseUrl = `http://${LOOPBACK_HOST}:${address.port}${proxyPathPrefix}`;
	const sdkBaseUrl = acceptsAzureSdkPaths ? `http://${LOOPBACK_HOST}:${address.port}` : proxyBaseUrl;
	return {
		provider: {
			...resolvedProvider,
			provider: {
				...providerConfig,
				baseUrl: sdkBaseUrl,
				...proxyCredentialHeader ? { headers: buildSdkProviderHeaders(providerConfig.headers, proxyCredentialHeader, nonce) } : {}
			}
		},
		close: async () => {
			for (const controller of activeFetches) controller.abort();
			await new Promise((resolve) => {
				server.close(() => resolve());
				server.closeAllConnections();
			});
		}
	};
}
async function handleProxyRequest(req, res, params) {
	let guarded;
	const upstreamAbort = new AbortController();
	params.activeFetches.add(upstreamAbort);
	const abortUpstream = () => upstreamAbort.abort();
	req.on("aborted", abortUpstream);
	res.on("close", () => {
		if (!res.writableEnded) abortUpstream();
	});
	try {
		const isNonceProtected = isNonceProtectedProxyRequest(req, params.proxyPathPrefix);
		const url = resolveTargetUrl(req, params);
		if (!url || !isNonceProtected && (!params.proxyCredentialHeader || !hasValidProxyCredential(req, params.proxyCredentialHeader, params.proxyCredential))) {
			res.writeHead(404);
			res.end("Not found");
			return;
		}
		const body = req.method === "GET" || req.method === "HEAD" ? void 0 : await readBody(req);
		guarded = await fetchWithSsrFGuard({
			url: url.toString(),
			init: {
				method: req.method,
				headers: buildProxyRequestHeaders(req.headers, {
					upstreamBearerAuthorization: isNonceProtected ? params.upstreamBearerAuthorization : void 0,
					proxyCredentialHeader: params.proxyCredentialHeader
				}),
				signal: upstreamAbort.signal,
				...body ? { body } : {}
			},
			auditContext: "copilot-byok-provider",
			requireHttps: true
		});
		res.writeHead(guarded.response.status, guarded.response.statusText, normalizeProxyResponseHeaders(guarded.response.headers));
		if (!guarded.response.body) {
			res.end();
			return;
		}
		await pipeline(Readable.fromWeb(guarded.response.body), res);
	} catch (error) {
		if (res.destroyed || res.writableEnded) return;
		if (res.headersSent) {
			res.destroy(error instanceof Error ? error : void 0);
			return;
		}
		res.writeHead(502);
		res.end(error instanceof Error ? error.message : "BYOK provider proxy failed");
	} finally {
		req.off("aborted", abortUpstream);
		params.activeFetches.delete(upstreamAbort);
		await guarded?.release().catch(() => void 0);
	}
}
function resolveTargetUrl(req, params) {
	const incomingUrl = new URL(req.url ?? "/", `http://${LOOPBACK_HOST}`);
	if (incomingUrl.pathname !== params.proxyPathPrefix && !incomingUrl.pathname.startsWith(`${params.proxyPathPrefix}/`)) return params.acceptsAzureSdkPaths && isAzureSdkProxyPath(incomingUrl.pathname) ? resolveDirectTargetUrl(incomingUrl, params.targetBaseUrl) : void 0;
	const suffix = incomingUrl.pathname.slice(params.proxyPathPrefix.length);
	const targetUrl = new URL(params.targetBaseUrl);
	targetUrl.pathname = `${params.targetPathPrefix}${suffix}` || "/";
	for (const [key, value] of incomingUrl.searchParams) targetUrl.searchParams.append(key, value);
	return targetUrl;
}
function resolveDirectTargetUrl(incomingUrl, targetBaseUrl) {
	const targetUrl = new URL(targetBaseUrl);
	targetUrl.pathname = incomingUrl.pathname;
	for (const [key, value] of incomingUrl.searchParams) targetUrl.searchParams.append(key, value);
	return targetUrl;
}
function isAzureSdkProxyPath(pathname) {
	return pathname === "/openai" || pathname.startsWith("/openai/");
}
function isNonceProtectedProxyRequest(req, proxyPathPrefix) {
	const incomingUrl = new URL(req.url ?? "/", `http://${LOOPBACK_HOST}`);
	return incomingUrl.pathname === proxyPathPrefix || incomingUrl.pathname.startsWith(`${proxyPathPrefix}/`);
}
function hasValidProxyCredential(req, headerName, expected) {
	const received = req.headers[headerName];
	if (typeof received !== "string") return false;
	const receivedBytes = Buffer.from(received);
	const expectedBytes = Buffer.from(expected);
	return receivedBytes.length === expectedBytes.length && timingSafeEqual(receivedBytes, expectedBytes);
}
async function readBody(req) {
	const chunks = [];
	for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	return chunks.length > 0 ? Buffer.concat(chunks) : void 0;
}
function normalizeProxyRequestHeaders(headers, proxyCredentialHeader) {
	const out = {};
	for (const [key, value] of Object.entries(headers)) {
		if (isHopByHopHeader(key) || key.toLowerCase() === "accept-encoding" || key.toLowerCase() === proxyCredentialHeader) continue;
		const normalized = normalizeHeaderValue(value);
		if (normalized !== void 0) out[key] = normalized;
	}
	out["accept-encoding"] = "identity";
	return out;
}
function buildSdkProviderHeaders(headers, proxyCredentialHeader, proxyCredential) {
	return {
		...headers,
		[proxyCredentialHeader]: proxyCredential
	};
}
function createProxyCredentialHeaderName(headers) {
	for (;;) {
		const name = `${PROXY_CREDENTIAL_HEADER_PREFIX}${randomBytes(12).toString("hex")}`;
		if (!headers || !hasHeader(headers, name)) return name;
	}
}
function buildProxyRequestHeaders(headers, params) {
	const out = normalizeProxyRequestHeaders(headers, params.proxyCredentialHeader);
	if (params.upstreamBearerAuthorization && !hasHeader(out, "authorization")) out["authorization"] = params.upstreamBearerAuthorization;
	return out;
}
function resolveUpstreamBearerAuthorization(providerConfig) {
	const bearerToken = providerConfig.bearerToken?.trim();
	return bearerToken ? `Bearer ${bearerToken}` : void 0;
}
function normalizeProxyResponseHeaders(headers) {
	const out = {};
	headers.forEach((value, key) => {
		if (!isHopByHopHeader(key) && !isContentEncodingHeader(key)) out[key] = value;
	});
	return out;
}
function normalizeHeaderValue(value) {
	if (value === void 0) return;
	return Array.isArray(value) ? value.join(", ") : String(value);
}
function hasHeader(headers, target) {
	return Object.keys(headers).some((key) => key.toLowerCase() === target);
}
function isHopByHopHeader(key) {
	switch (key.toLowerCase()) {
		case "connection":
		case "host":
		case "keep-alive":
		case "proxy-authenticate":
		case "proxy-authorization":
		case "te":
		case "trailer":
		case "transfer-encoding":
		case "upgrade": return true;
		default: return false;
	}
}
function isContentEncodingHeader(key) {
	switch (key.toLowerCase()) {
		case "content-encoding":
		case "content-length": return true;
		default: return false;
	}
}
function trimTrailingSlash(pathname) {
	const trimmed = pathname.replace(/\/+$/, "");
	return trimmed === "" ? "" : trimmed;
}
//#endregion
//#region extensions/copilot/src/provider-bridge.ts
const COPILOT_BYOK_PROVIDER_ERROR = "[copilot-attempt] BYOK requires an OpenAI-compatible or Anthropic model api and a non-empty baseUrl";
const COPILOT_BYOK_TRANSPORT_POLICY_ERROR = "[copilot-attempt] BYOK does not support OpenClaw provider request proxy, TLS, or private-network policy overrides";
const COPILOT_BYOK_ENDPOINT_POLICY_ERROR = "[copilot-attempt] BYOK endpoint is blocked by OpenClaw SSRF policy";
const CREDENTIAL_QUERY_PARAM_NAMES = /* @__PURE__ */ new Set([
	"accesstoken",
	"appsecret",
	"auth",
	"authtoken",
	"apikey",
	"authorization",
	"clientsecret",
	"code",
	"credential",
	"hooktoken",
	"idtoken",
	"jwt",
	"key",
	"pass",
	"passwd",
	"password",
	"privatekey",
	"refreshtoken",
	"secret",
	"session",
	"sig",
	"signature",
	"token",
	"xapikey",
	"xaccesstoken",
	"xamzsecuritytoken",
	"xamzsignature",
	"xauthtoken"
]);
const QUERY_PARAM_NAME_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
/**
* Maps OpenClaw's prepared model facts into the Copilot SDK's session-level
* provider contract. The SDK owns the wire request; OpenClaw only supplies
* the already-resolved endpoint, model, headers, and credential.
*/
function resolveCopilotProvider(params) {
	if (params.model.provider.trim().toLowerCase() === "github-copilot") return { mode: "github-copilot" };
	const baseUrl = normalizeOptionalString(params.model.baseUrl);
	if (!baseUrl) throw new Error(COPILOT_BYOK_PROVIDER_ERROR);
	assertByokEndpointAllowed(baseUrl);
	if (hasUnsupportedTransportPolicy(params.model)) throw new Error(COPILOT_BYOK_TRANSPORT_POLICY_ERROR);
	const api = normalizeOptionalString(params.model.api)?.toLowerCase() ?? "openai-responses";
	const provider = resolveProviderType(api, baseUrl, params.model.azureApiVersion);
	const resolvedApiKey = resolveProviderCredential(params.resolvedApiKey);
	const headers = filterStringRecord(params.model.headers);
	const requestAuthMode = normalizeOptionalString(params.model.requestAuthMode)?.toLowerCase();
	const usePreparedRequestAuth = requestAuthMode !== void 0 && requestAuthMode !== "provider-default";
	return {
		mode: "byok",
		provider: {
			type: provider.type,
			...provider.wireApi ? { wireApi: provider.wireApi } : {},
			baseUrl: provider.baseUrl,
			modelId: params.model.id,
			wireModel: params.model.id,
			...resolvedApiKey && !usePreparedRequestAuth ? params.model.authHeader ? { bearerToken: resolvedApiKey } : { apiKey: resolvedApiKey } : {},
			...headers ? { headers } : {},
			...provider.azure ? { azure: provider.azure } : {},
			...params.model.contextTokens ?? params.model.contextWindow ? { maxPromptTokens: params.model.contextTokens ?? params.model.contextWindow } : {},
			...params.model.maxTokens ? { maxOutputTokens: params.model.maxTokens } : {}
		},
		authProfileId: params.authProfileId?.trim() || `byok:${params.model.provider}`,
		authProfileVersion: tokenFingerprint(stableSerialize({
			api,
			baseUrl: provider.baseUrl,
			azureApiVersion: provider.azure?.apiVersion,
			headers,
			authHeader: params.model.authHeader,
			requestAuthMode: params.model.requestAuthMode,
			apiKey: resolvedApiKey,
			modelId: params.model.id,
			maxPromptTokens: params.model.contextTokens ?? params.model.contextWindow,
			maxOutputTokens: params.model.maxTokens
		}))
	};
}
function isCopilotByokUnsupportedProviderError(error) {
	return error instanceof Error && (error.message === COPILOT_BYOK_PROVIDER_ERROR || error.message === COPILOT_BYOK_TRANSPORT_POLICY_ERROR || error.message === COPILOT_BYOK_ENDPOINT_POLICY_ERROR);
}
function supportsCopilotByokProviderShape(model) {
	if (!normalizeOptionalString(model.baseUrl) || hasUnsupportedTransportPolicy(model)) return false;
	try {
		resolveProviderType(normalizeOptionalString(model.api)?.toLowerCase() ?? "openai-responses", normalizeOptionalString(model.baseUrl), void 0);
		assertByokEndpointHostAllowed(normalizeOptionalString(model.baseUrl));
		return true;
	} catch {
		return false;
	}
}
function hasUnsupportedTransportPolicy(model) {
	return model.requestProxy !== void 0 || model.requestTls !== void 0 || model.requestAllowPrivateNetwork !== void 0;
}
function assertByokEndpointHostAllowed(baseUrl) {
	let url;
	try {
		url = new URL(baseUrl);
	} catch {
		throw new Error(COPILOT_BYOK_PROVIDER_ERROR);
	}
	if (url.protocol !== "https:") throw new Error(COPILOT_BYOK_ENDPOINT_POLICY_ERROR);
	if (url.username || url.password) throw new Error(COPILOT_BYOK_ENDPOINT_POLICY_ERROR);
	for (const key of url.searchParams.keys()) if (CREDENTIAL_QUERY_PARAM_NAMES.has(normalizeCredentialQueryParamName(key))) throw new Error(COPILOT_BYOK_ENDPOINT_POLICY_ERROR);
	const hostname = url.hostname.toLowerCase().replace(/\.+$/, "");
	if (isBlockedHostnameOrIp(hostname)) throw new Error(COPILOT_BYOK_ENDPOINT_POLICY_ERROR);
}
function normalizeCredentialQueryParamName(name) {
	const stripped = name.replace(QUERY_PARAM_NAME_SEPARATOR_RE, "");
	try {
		return decodeURIComponent(stripped).replace(QUERY_PARAM_NAME_SEPARATOR_RE, "").toLowerCase().replace(/[-_]/g, "");
	} catch {
		return stripped.toLowerCase().replace(/[-_]/g, "");
	}
}
function assertByokEndpointAllowed(baseUrl) {
	assertByokEndpointHostAllowed(baseUrl);
}
function resolveProviderType(api, baseUrl, azureApiVersion) {
	switch (api) {
		case "anthropic-messages": return {
			type: "anthropic",
			baseUrl
		};
		case "azure-openai-responses": return resolveAzureProviderType(baseUrl, azureApiVersion);
		case "openai-responses": return {
			type: "openai",
			wireApi: "responses",
			baseUrl
		};
		case "openai-completions":
		case "ollama": return {
			type: "openai",
			wireApi: "completions",
			baseUrl
		};
		default: throw new Error(COPILOT_BYOK_PROVIDER_ERROR);
	}
}
function resolveAzureProviderType(baseUrl, apiVersion) {
	let url;
	try {
		url = new URL(baseUrl);
	} catch {
		throw new Error(COPILOT_BYOK_PROVIDER_ERROR);
	}
	if (isOpenAICompatibleAzureResponsesBaseUrl(url)) return {
		type: "openai",
		wireApi: "responses",
		baseUrl
	};
	if (!isTraditionalAzureOpenAIHost(url.hostname)) throw new Error(COPILOT_BYOK_PROVIDER_ERROR);
	url.pathname = "";
	url.search = "";
	url.hash = "";
	const resolvedApiVersion = normalizeOptionalString(apiVersion);
	return {
		type: "azure",
		wireApi: "responses",
		baseUrl: url.toString().replace(/\/+$/, ""),
		...resolvedApiVersion ? { azure: { apiVersion: resolvedApiVersion } } : {}
	};
}
function isTraditionalAzureOpenAIHost(hostname) {
	return hostname.endsWith(".openai.azure.com") || hostname.endsWith(".cognitiveservices.azure.com");
}
function isOpenAICompatibleAzureResponsesBaseUrl(url) {
	if (isTraditionalAzureOpenAIHost(url.hostname)) return false;
	const hostname = url.hostname.toLowerCase();
	if (!(hostname.endsWith(".services.ai.azure.com") || hostname.endsWith(".api.cognitive.microsoft.com"))) return false;
	const normalizedPath = url.pathname.replace(/\/+$/, "");
	return normalizedPath === "/openai/v1" || normalizedPath.endsWith("/openai/v1");
}
function stableSerialize(value) {
	if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
	if (value && typeof value === "object") return `{${Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`).join(",")}}`;
	return JSON.stringify(value) ?? "null";
}
function resolveProviderCredential(value) {
	const credential = normalizeOptionalString(value);
	return credential && !isNonSecretApiKeyMarker(credential) ? credential : void 0;
}
//#endregion
//#region extensions/copilot/harness.ts
const COPILOT_PROVIDER_IDS = /* @__PURE__ */ new Set(["github-copilot"]);
function sessionAuthFields(auth) {
	return auth.authMode === "gitHubToken" || auth.authMode === "byok" ? {
		authMode: auth.authMode,
		authProfileId: auth.authProfileId,
		authProfileVersion: auth.authProfileVersion
	} : { authMode: "useLoggedInUser" };
}
function sessionAuthMatches(stored, current) {
	if (stored.authMode !== current.authMode) return false;
	if (stored.authMode === "useLoggedInUser") return true;
	return current.authMode === stored.authMode && stored.authProfileId === current.authProfileId && stored.authProfileVersion === current.authProfileVersion;
}
function normalizeBinding(value) {
	if (!value || value.schemaVersion !== 2 || typeof value.sdkSessionId !== "string" || value.sdkSessionId.trim() === "" || typeof value.compatKey !== "string" || value.compatKey.trim() === "" || typeof value.compactKey !== "string" || value.compactKey.trim() === "" || value.journalVersion !== void 0 && value.journalVersion !== 1 || value.authMode !== "gitHubToken" && value.authMode !== "byok" && value.authMode !== "useLoggedInUser" || (value.authMode === "gitHubToken" || value.authMode === "byok") && (typeof value.authProfileId !== "string" || value.authProfileId.trim() === "" || typeof value.authProfileVersion !== "string" || value.authProfileVersion.trim() === "") || typeof value.updatedAt !== "number" || !Number.isFinite(value.updatedAt)) return;
	return {
		schemaVersion: 2,
		...value.journalVersion === 1 ? { journalVersion: 1 } : {},
		sdkSessionId: value.sdkSessionId.trim(),
		compatKey: value.compatKey,
		compactKey: value.compactKey,
		authMode: value.authMode,
		...value.authMode === "gitHubToken" || value.authMode === "byok" ? {
			authProfileId: value.authProfileId,
			authProfileVersion: value.authProfileVersion
		} : {},
		updatedAt: value.updatedAt
	};
}
function normalizeAttemptBinding(value) {
	const current = normalizeBinding(value);
	if (current) return current;
	const legacy = value;
	if (!legacy || legacy.schemaVersion !== 1 || typeof legacy.sdkSessionId !== "string" || legacy.sdkSessionId.trim() === "" || typeof legacy.compatKey !== "string" || legacy.compatKey.trim() === "" || typeof legacy.updatedAt !== "number" || !Number.isFinite(legacy.updatedAt)) return;
	return {
		sdkSessionId: legacy.sdkSessionId.trim(),
		compatKey: legacy.compatKey
	};
}
async function lookupStoredBinding(store, key) {
	try {
		return normalizeAttemptBinding(await store?.lookup(key));
	} catch {
		try {
			await store?.delete(key);
		} catch {}
		return;
	}
}
async function registerStoredBinding(store, key, binding) {
	try {
		await store?.register(key, binding);
		return true;
	} catch {
		try {
			await store?.delete(key);
		} catch {}
		return false;
	}
}
async function deleteStoredBinding(store, key) {
	try {
		await store?.delete(key);
		return true;
	} catch {
		return false;
	}
}
function throwIfAborted(signal) {
	if (!signal?.aborted) return;
	const reason = "reason" in signal ? signal.reason : void 0;
	if (reason instanceof Error) throw reason;
	const error = reason ? new Error("aborted", { cause: reason }) : /* @__PURE__ */ new Error("aborted");
	error.name = "AbortError";
	throw error;
}
function isStaleSdkSessionError(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /\b(404|not found|no such session|unknown session|stale|deleted|does not exist)\b/i.test(message);
}
async function compactTrackedSdkSession(params) {
	throwIfAborted(params.abortSignal);
	const session = await params.client.resumeSession(params.sdkSessionId, {
		...params.sessionConfig,
		continuePendingWork: false,
		...params.gitHubToken ? { gitHubToken: params.gitHubToken } : {},
		suppressResumeEvent: true
	});
	params.onSession?.(session);
	const request = params.customInstructions?.trim() ? { customInstructions: params.customInstructions } : void 0;
	try {
		throwIfAborted(params.abortSignal);
		return await session.rpc.history.compact(request);
	} finally {
		try {
			await session.disconnect();
		} catch {}
	}
}
function readAgentIdFromSessionKey(sessionKey) {
	if (typeof sessionKey !== "string") return;
	const parts = sessionKey.trim().split(":");
	return parts[0] === "agent" && parts[1]?.trim() ? parts[1].trim() : void 0;
}
function computeSessionKey(input, options) {
	const attempt = input.kind === "attempt" ? input.params : void 0;
	const compact = input.kind === "compact" ? input.params : void 0;
	const attemptModel = attempt?.model;
	const compactModel = compact?.model;
	const rawModel = attemptModel ?? compactModel;
	const modelObj = rawModel && typeof rawModel === "object" ? rawModel : compact?.runtimeModel ?? { id: typeof rawModel === "string" ? rawModel : void 0 };
	const provider = normalizeOptionalString(modelObj.provider) ?? attempt?.provider ?? compact?.provider ?? "";
	const modelId = normalizeOptionalString(modelObj.id) ?? attempt?.modelId ?? compact?.modelId ?? (typeof compactModel === "string" ? compactModel : "");
	const requestTransport = rawModel && typeof rawModel === "object" ? getModelProviderRequestTransport(rawModel) : void 0;
	const requestAuthMode = normalizeOptionalString(requestTransport?.auth?.mode ?? modelObj.request?.auth?.mode);
	const azureApiVersion = normalizeOptionalString(modelObj.azureApiVersion ?? modelObj.params?.azureApiVersion);
	let authParts;
	let resolvedAgentId = "";
	let resolvedCopilotHome = "";
	try {
		const resolved = !options.includeAuth ? resolveCopilotAuth({
			agentId: input.params.agentId ?? readAgentIdFromSessionKey(input.params.sessionKey),
			agentDir: input.params.agentDir,
			workspaceDir: input.params.workspaceDir,
			copilotHome: input.params.copilotHome,
			auth: { useLoggedInUser: true }
		}) : (() => {
			const modelProvider = resolveCopilotProvider({
				model: {
					api: normalizeOptionalString(modelObj.api),
					id: modelId,
					provider,
					baseUrl: normalizeOptionalString(modelObj.baseUrl),
					azureApiVersion,
					headers: modelObj.headers,
					authHeader: modelObj.authHeader,
					requestAuthMode,
					requestProxy: requestTransport?.proxy ?? modelObj.request?.proxy,
					requestTls: requestTransport?.tls ?? modelObj.request?.tls,
					requestAllowPrivateNetwork: requestTransport?.allowPrivateNetwork ?? modelObj.request?.allowPrivateNetwork,
					contextTokens: modelObj.contextTokens,
					contextWindow: modelObj.contextWindow,
					maxTokens: modelObj.maxTokens
				},
				resolvedApiKey: input.params.resolvedApiKey,
				authProfileId: input.params.authProfileId
			});
			return modelProvider.mode === "byok" ? createCopilotByokAuth({
				agentId: input.params.agentId ?? readAgentIdFromSessionKey(input.params.sessionKey),
				agentDir: input.params.agentDir,
				workspaceDir: input.params.workspaceDir,
				copilotHome: input.params.copilotHome,
				authProfileId: modelProvider.authProfileId,
				authProfileVersion: modelProvider.authProfileVersion
			}) : resolveCopilotAuth({
				agentId: input.params.agentId ?? readAgentIdFromSessionKey(input.params.sessionKey),
				agentDir: input.params.agentDir,
				workspaceDir: input.params.workspaceDir,
				copilotHome: input.params.copilotHome,
				auth: input.params.auth,
				resolvedApiKey: input.params.resolvedApiKey,
				authProfileId: input.params.authProfileId,
				profileVersion: input.params.profileVersion
			});
		})();
		resolvedAgentId = resolved.agentId;
		resolvedCopilotHome = resolved.copilotHome;
		authParts = [
			`auth.mode=${resolved.authMode}`,
			`auth.profileId=${resolved.authProfileId ?? ""}`,
			`auth.profileVersion=${resolved.authProfileVersion ?? ""}`
		];
		if (!options.includeAuth) authParts = [];
	} catch {
		authParts = ["auth=unresolvable"];
	}
	return [
		`provider=${provider}`,
		`model=${modelId}`,
		...options.includeApi ? [`api=${normalizeOptionalString(modelObj.api) ?? ""}`] : [],
		...options.includeApi ? [`baseUrlFingerprint=${fingerprintSessionValue(modelObj.baseUrl)}`] : [],
		`cwd=${input.params.cwd ?? input.params.workspaceDir ?? ""}`,
		`agentId=${resolvedAgentId}`,
		`agentDir=${input.params.agentDir ?? ""}`,
		`copilotHome=${input.params.copilotHome ?? ""}`,
		`resolvedCopilotHome=${resolvedCopilotHome}`,
		...options.includeAuth ? authParts : []
	].join("|");
}
function fingerprintSessionValue(value) {
	return typeof value === "string" && value ? tokenFingerprint(value) : "";
}
function computeSessionCompatKey(params) {
	return computeSessionKey({
		kind: "attempt",
		params
	}, {
		includeApi: true,
		includeAuth: true
	});
}
function computeAttemptCompactKey(params) {
	return computeSessionKey({
		kind: "attempt",
		params
	}, {
		includeApi: false,
		includeAuth: false
	});
}
function computeCompactRequestKey(params) {
	return computeSessionKey({
		kind: "compact",
		params
	}, {
		includeApi: false,
		includeAuth: false
	});
}
function buildCopilotCompactionHookContext(params) {
	return {
		...params.runId ? { runId: params.runId } : {},
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		workspaceDir: params.workspaceDir,
		modelProviderId: params.provider,
		modelId: params.model,
		trigger: params.trigger,
		...buildAgentHookContextChannelFields(params)
	};
}
function createCopilotAgentHarness(options) {
	let poolPromise;
	let createdPool;
	let disposed = false;
	let disposePromise;
	const inFlight = /* @__PURE__ */ new Set();
	const bindingQueue = new KeyedAsyncQueue();
	const deferredCompactionCleanups = /* @__PURE__ */ new Map();
	const trackedSessions = /* @__PURE__ */ new Map();
	const resetBlockedStoredSessions = /* @__PURE__ */ new Set();
	async function trackOperation(operation) {
		const pending = operation();
		inFlight.add(pending);
		try {
			return await pending;
		} finally {
			inFlight.delete(pending);
		}
	}
	async function getPool() {
		if (options?.pool) return options.pool;
		if (!poolPromise) poolPromise = (async () => {
			const { createCopilotClientPool } = await import("./runtime-D6DFeSZX.mjs");
			createdPool = createCopilotClientPool(options?.poolOptions);
			return createdPool;
		})();
		return poolPromise;
	}
	function trackDeferredCompactionCleanup(params) {
		const cleanups = deferredCompactionCleanups.get(params.sessionId) ?? /* @__PURE__ */ new Map();
		cleanups.set(params.cleanup, {
			abort: params.abort,
			sdkSessionId: params.sdkSessionId
		});
		deferredCompactionCleanups.set(params.sessionId, cleanups);
		params.cleanup.then(() => removeDeferredCompactionCleanup(params.sessionId, params.cleanup), () => removeDeferredCompactionCleanup(params.sessionId, params.cleanup));
	}
	function removeDeferredCompactionCleanup(sessionId, cleanup) {
		const cleanups = deferredCompactionCleanups.get(sessionId);
		if (!cleanups) return;
		cleanups.delete(cleanup);
		if (cleanups.size === 0) deferredCompactionCleanups.delete(sessionId);
	}
	async function hasPendingDeferredCompactionCleanup(sessionId) {
		const cleanups = deferredCompactionCleanups.get(sessionId);
		if (!cleanups) return false;
		const currentSdkSessionId = trackedSessions.get(sessionId)?.sdkSessionId ?? (await lookupStoredBinding(options?.sessionStore, sessionId))?.sdkSessionId;
		return currentSdkSessionId !== void 0 && [...cleanups.values()].some((cleanup) => cleanup.sdkSessionId === currentSdkSessionId);
	}
	async function abortDeferredCompactionCleanups(sessionId) {
		const cleanups = deferredCompactionCleanups.get(sessionId);
		if (!cleanups) return;
		const pending = [...cleanups.entries()];
		for (const [, cleanup] of pending) cleanup.abort();
		await Promise.allSettled(pending.map(([cleanup]) => cleanup));
	}
	async function runHarnessAttempt(params, operation) {
		const attemptPromise = (async () => {
			if (disposed) throw new Error("[copilot] harness has been disposed; cannot start new attempts");
			const { resolvePoolAcquire, runCopilotAttempt } = await import("./attempt-DKgdMTpc.mjs");
			if (disposed) throw new Error("[copilot] harness was disposed while starting an attempt");
			const pool = await getPool();
			if (disposed) throw new Error("[copilot] harness was disposed while starting an attempt");
			let poolAcquire;
			try {
				poolAcquire = resolvePoolAcquire(params);
			} catch (error) {
				if (operation === "attempt" && isCopilotByokUnsupportedProviderError(error)) return runCopilotAttempt(params, { pool });
				throw error;
			}
			const openclawSessionId = typeof params.sessionId === "string" ? params.sessionId : void 0;
			const currentCompatKey = computeSessionCompatKey(params);
			const currentCompactKey = computeAttemptCompactKey(params);
			const resumableBinding = openclawSessionId ? await bindingQueue.enqueue(openclawSessionId, async () => {
				if (await hasPendingDeferredCompactionCleanup(openclawSessionId) || resetBlockedStoredSessions.has(openclawSessionId)) return;
				const tracked = trackedSessions.get(openclawSessionId);
				const stored = tracked ? void 0 : await lookupStoredBinding(options?.sessionStore, openclawSessionId);
				const binding = tracked ?? stored;
				return binding?.compatKey === currentCompatKey ? binding : void 0;
			}) : void 0;
			if (disposed) throw new Error("[copilot] harness was disposed while starting an attempt");
			const resumableSessionId = resumableBinding?.sdkSessionId;
			if (operation === "settled-tool-finalization" && !resumableSessionId) throw new Error("[copilot] cannot safely finalize a settled tool turn without its compatible SDK session");
			const result = await runCopilotAttempt(resumableSessionId ? {
				...params,
				...operation === "settled-tool-finalization" ? {
					disableTools: true,
					onAgentEvent: void 0,
					onAgentToolResult: void 0,
					onAssistantDelta: void 0,
					onAssistantMessageStart: void 0,
					onBlockReply: void 0,
					onBlockReplyFlush: void 0,
					onPartialReply: void 0,
					onReasoningEnd: void 0,
					onReasoningStream: void 0,
					onToolResult: void 0,
					onToolStreamBoundary: void 0
				} : {},
				initialReplayState: operation === "settled-tool-finalization" ? {
					...resumableBinding?.journalVersion === 1 ? { journalValidated: true } : {},
					sdkSessionId: resumableSessionId
				} : {
					...params.initialReplayState,
					...resumableBinding?.journalVersion === 1 ? { journalValidated: true } : {},
					sdkSessionId: resumableSessionId
				}
			} : params, {
				pool,
				...operation === "settled-tool-finalization" ? { operation } : {},
				onSessionEstablished: operation === "attempt" && openclawSessionId ? ({ compactionSessionConfig, sdkSessionId, pooledClient, sessionConfig }) => bindingQueue.enqueue(openclawSessionId, async () => {
					const tracked = {
						sdkSessionId,
						client: pooledClient.client,
						clientOptions: poolAcquire.options,
						compatKey: currentCompatKey,
						compactKey: currentCompactKey,
						poolKey: pooledClient.key,
						sessionConfig: compactionSessionConfig ?? sessionConfig,
						...sessionAuthFields(poolAcquire.auth)
					};
					await registerStoredBinding(options?.sessionStore, openclawSessionId, {
						schemaVersion: 2,
						sdkSessionId,
						compatKey: currentCompatKey,
						compactKey: currentCompactKey,
						...sessionAuthFields(poolAcquire.auth),
						updatedAt: Date.now()
					});
					trackedSessions.set(openclawSessionId, tracked);
					resetBlockedStoredSessions.delete(openclawSessionId);
				}) : void 0,
				onDeferredCompaction: openclawSessionId ? ({ abort, cleanup, sdkSessionId }) => bindingQueue.enqueue(openclawSessionId, async () => {
					const trackedBinding = trackedSessions.get(openclawSessionId);
					const storedBinding = await lookupStoredBinding(options?.sessionStore, openclawSessionId);
					const ownsTrackedSession = trackedBinding?.sdkSessionId === sdkSessionId;
					const ownsStoredSession = storedBinding?.sdkSessionId === sdkSessionId;
					if (!ownsTrackedSession && !ownsStoredSession) return;
					resetBlockedStoredSessions.add(openclawSessionId);
					trackDeferredCompactionCleanup({
						abort,
						cleanup: cleanup.then((outcome) => bindingQueue.enqueue(openclawSessionId, async () => {
							const currentTracked = trackedSessions.get(openclawSessionId);
							const currentStored = await lookupStoredBinding(options?.sessionStore, openclawSessionId);
							const stillOwnsTrackedSession = currentTracked?.sdkSessionId === sdkSessionId;
							const stillOwnsStoredSession = currentStored?.sdkSessionId === sdkSessionId;
							if (outcome === "completed") {
								if (stillOwnsTrackedSession || stillOwnsStoredSession) resetBlockedStoredSessions.delete(openclawSessionId);
								return outcome;
							}
							if (stillOwnsTrackedSession) trackedSessions.delete(openclawSessionId);
							if (stillOwnsStoredSession) await deleteStoredBinding(options?.sessionStore, openclawSessionId);
							if (stillOwnsTrackedSession || stillOwnsStoredSession) resetBlockedStoredSessions.add(openclawSessionId);
							return outcome;
						})),
						sessionId: openclawSessionId,
						sdkSessionId
					});
				}) : void 0
			});
			if (operation === "attempt" && openclawSessionId) {
				const attemptResult = result;
				const sdkSessionId = attemptResult.sdkSessionId;
				await bindingQueue.enqueue(openclawSessionId, async () => {
					const trackedSession = trackedSessions.get(openclawSessionId);
					if (sdkSessionId && trackedSession?.sdkSessionId === sdkSessionId) {
						const { journalVersion: _journalVersion, ...baseTracked } = trackedSession;
						const nextTracked = {
							...baseTracked,
							...attemptResult.journalValidated ? { journalVersion: 1 } : {}
						};
						await registerStoredBinding(options?.sessionStore, openclawSessionId, {
							schemaVersion: 2,
							...attemptResult.journalValidated ? { journalVersion: 1 } : {},
							sdkSessionId,
							compatKey: nextTracked.compatKey,
							compactKey: nextTracked.compactKey,
							...sessionAuthFields(nextTracked),
							updatedAt: Date.now()
						});
						trackedSessions.set(openclawSessionId, nextTracked);
					}
				});
			}
			return result;
		})();
		inFlight.add(attemptPromise);
		try {
			return await attemptPromise;
		} finally {
			inFlight.delete(attemptPromise);
		}
	}
	async function runIsolatedCompletionV2(params) {
		const completionPromise = (async () => {
			if (disposed) throw new Error("[copilot] harness has been disposed; cannot start isolated completion");
			const { runCopilotIsolatedCompletion } = await import("./isolated-completion-CpLMQyd3.mjs");
			if (disposed) throw new Error("[copilot] harness was disposed while starting isolated completion");
			return await runCopilotIsolatedCompletion(params, async () => {
				const pool = await getPool();
				if (disposed) throw new Error("[copilot] harness was disposed while starting isolated completion");
				return pool;
			});
		})();
		inFlight.add(completionPromise);
		try {
			return await completionPromise;
		} finally {
			inFlight.delete(completionPromise);
		}
	}
	return {
		id: options?.id ?? "copilot",
		label: options?.label ?? "GitHub Copilot agent runtime",
		autoSelection: { providerIds: [] },
		conversationToolPolicySupport: "exact",
		supports(ctx) {
			if (String(ctx.requestedRuntime ?? "").trim().toLowerCase() !== "copilot") return {
				supported: false,
				reason: "copilot is opt-in only"
			};
			const provider = ctx.provider.trim().toLowerCase();
			if (!provider) return {
				supported: false,
				reason: "provider is required"
			};
			if (COPILOT_PROVIDER_IDS.has(provider)) return {
				supported: true,
				priority: 100
			};
			const providerOwnerPluginIds = ctx.providerOwnerPluginIds;
			if (ctx.providerOwnerStatus !== "unowned" || !providerOwnerPluginIds || providerOwnerPluginIds.length > 0) return {
				supported: false,
				reason: `provider is not one of: ${[...COPILOT_PROVIDER_IDS].toSorted().join(", ")}`
			};
			if (!supportsCopilotByokProviderShape({
				api: ctx.modelProvider?.api,
				baseUrl: ctx.modelProvider?.baseUrl,
				requestProxy: ctx.modelProvider?.request?.proxy,
				requestTls: ctx.modelProvider?.request?.tls,
				requestAllowPrivateNetwork: ctx.modelProvider?.request?.allowPrivateNetwork
			})) return {
				supported: false,
				reason: "provider is not a supported Copilot BYOK model (requires supported api, baseUrl, and no request transport policy overrides)"
			};
			return {
				supported: true,
				priority: 100
			};
		},
		runAttempt: (params) => runHarnessAttempt(params, "attempt"),
		runIsolatedCompletionV2,
		finalizeSettledTurn: async ({ attempt }) => {
			const result = await runHarnessAttempt(attempt, "settled-tool-finalization");
			return projectSettledTurnFinalizationAttemptResult(result);
		},
		reset: (params) => trackOperation(async () => {
			if (disposed) return;
			const openclawSessionId = typeof params.sessionId === "string" ? params.sessionId : void 0;
			if (!openclawSessionId) return;
			const { tracked, stored } = await bindingQueue.enqueue(openclawSessionId, async () => {
				const binding = await lookupStoredBinding(options?.sessionStore, openclawSessionId);
				resetBlockedStoredSessions.add(openclawSessionId);
				return {
					tracked: trackedSessions.get(openclawSessionId),
					stored: binding
				};
			});
			await abortDeferredCompactionCleanups(openclawSessionId);
			await bindingQueue.enqueue(openclawSessionId, async () => {
				const currentStored = await lookupStoredBinding(options?.sessionStore, openclawSessionId);
				if (stored !== void 0 && currentStored?.sdkSessionId === stored.sdkSessionId) {
					if (await deleteStoredBinding(options?.sessionStore, openclawSessionId)) resetBlockedStoredSessions.delete(openclawSessionId);
				} else resetBlockedStoredSessions.delete(openclawSessionId);
				if (tracked && trackedSessions.get(openclawSessionId)?.sdkSessionId === tracked.sdkSessionId) trackedSessions.delete(openclawSessionId);
			});
			if (!tracked) return;
			try {
				await tracked.client.deleteSession(tracked.sdkSessionId);
			} catch {}
		}),
		compact: (params) => trackOperation(async () => {
			if (disposed) return;
			const openclawSessionId = typeof params.sessionId === "string" ? params.sessionId : void 0;
			if (!openclawSessionId) return {
				ok: false,
				compacted: false,
				reason: "missing-required-params"
			};
			if (await bindingQueue.enqueue(openclawSessionId, () => hasPendingDeferredCompactionCleanup(openclawSessionId))) return {
				ok: false,
				compacted: false,
				reason: "background-compaction-pending",
				failure: { reason: "background-compaction-pending" }
			};
			const tracked = trackedSessions.get(openclawSessionId);
			const currentCompactKey = computeCompactRequestKey(params);
			const { resolvePoolAcquire } = await import("./attempt-DKgdMTpc.mjs");
			let resolvedPoolAcquire;
			let currentAuth;
			try {
				resolvedPoolAcquire = resolvePoolAcquire(params);
			} catch (error) {
				if (isCopilotByokUnsupportedProviderError(error)) return {
					ok: false,
					compacted: false,
					reason: "missing_thread_binding",
					failure: { reason: "missing_thread_binding" }
				};
				throw error;
			}
			if (!currentAuth) currentAuth = sessionAuthFields(resolvedPoolAcquire.auth);
			const compatibleTracked = tracked?.compactKey === currentCompactKey && sessionAuthMatches(tracked, currentAuth) ? tracked : void 0;
			if (!compatibleTracked) return {
				ok: false,
				compacted: false,
				reason: "missing_thread_binding",
				failure: { reason: "missing_thread_binding" }
			};
			const poolAcquire = {
				key: compatibleTracked.poolKey,
				options: compatibleTracked.clientOptions
			};
			let compactResult;
			let handle;
			let pool;
			let activeSdkSession;
			let cleanupByokProxy;
			const hookContext = buildCopilotCompactionHookContext(params);
			try {
				throwIfAborted(params.abortSignal);
				pool = await getPool();
				handle = await pool.acquire(poolAcquire.key, poolAcquire.options);
				const client = handle.client;
				const byokProxy = compatibleTracked.authMode === "byok" && compatibleTracked.sessionConfig.provider ? await createCopilotByokProxy({
					mode: "byok",
					provider: compatibleTracked.sessionConfig.provider
				}) : void 0;
				cleanupByokProxy = byokProxy?.close;
				const sessionConfig = byokProxy?.provider.provider ? {
					...compatibleTracked.sessionConfig,
					provider: byokProxy.provider.provider
				} : compatibleTracked.sessionConfig;
				await runAgentHarnessBeforeCompactionHook({
					sessionFile: params.sessionFile,
					ctx: hookContext
				});
				compactResult = await compactWithSafetyTimeout((abortSignal) => compactTrackedSdkSession({
					abortSignal,
					client,
					customInstructions: params.customInstructions,
					gitHubToken: compatibleTracked?.clientOptions.gitHubToken ?? (resolvedPoolAcquire?.auth.authMode === "gitHubToken" ? resolvedPoolAcquire.auth.gitHubToken : void 0),
					onSession: (session) => {
						activeSdkSession = session;
					},
					sessionConfig,
					sdkSessionId: compatibleTracked.sdkSessionId
				}), resolveCompactionTimeoutMs(params.config), {
					abortSignal: params.abortSignal,
					onCancel: () => void activeSdkSession?.rpc.history.abortManualCompaction().catch(() => void 0)
				});
			} catch (err) {
				const rawError = err instanceof Error ? err.message : String(err);
				if (isStaleSdkSessionError(err)) {
					await bindingQueue.enqueue(openclawSessionId, async () => {
						if (trackedSessions.get(openclawSessionId)?.sdkSessionId === compatibleTracked.sdkSessionId) {
							await deleteStoredBinding(options?.sessionStore, openclawSessionId);
							trackedSessions.delete(openclawSessionId);
						}
					});
					return {
						ok: false,
						compacted: false,
						reason: "stale_thread_binding",
						failure: {
							reason: "stale_thread_binding",
							rawError
						}
					};
				}
				return {
					ok: false,
					compacted: false,
					reason: "copilot-sdk-history-compact-failed",
					failure: {
						reason: "copilot-sdk-history-compact-failed",
						rawError
					}
				};
			} finally {
				await cleanupByokProxy?.();
				if (pool && handle) try {
					await pool.release(handle);
				} catch {}
			}
			if (!compactResult.success) return {
				ok: false,
				compacted: false,
				reason: "copilot-sdk-history-compact-failed",
				failure: { reason: "copilot-sdk-history-compact-failed" }
			};
			const compacted = compactResult.tokensRemoved > 0 || compactResult.messagesRemoved > 0;
			if (compacted) await runAgentHarnessAfterCompactionHook({
				sessionFile: params.sessionFile,
				compactedCount: compactResult.messagesRemoved,
				ctx: hookContext
			});
			return {
				ok: true,
				compacted,
				reason: compacted ? "copilot-sdk-history-compacted" : "already under target",
				...compacted ? { result: {
					summary: compactResult.summaryContent ?? "",
					firstKeptEntryId: "",
					tokensBefore: params.currentTokenCount ?? (compactResult.contextWindow?.currentTokens ?? 0) + compactResult.tokensRemoved,
					tokensAfter: compactResult.contextWindow?.currentTokens,
					details: compactResult,
					sessionId: params.sessionId,
					sessionFile: params.sessionFile
				} } : {}
			};
		}),
		async dispose() {
			if (disposePromise) return disposePromise;
			disposed = true;
			disposePromise = (async () => {
				if (inFlight.size > 0) await Promise.allSettled(inFlight);
				const cleanupSessionIds = [...deferredCompactionCleanups.keys()];
				for (const sessionId of cleanupSessionIds) await abortDeferredCompactionCleanups(sessionId);
				trackedSessions.clear();
				resetBlockedStoredSessions.clear();
				if (createdPool) {
					const errors = await createdPool.dispose();
					if (errors.length > 0) throw new AggregateError(errors, "[copilot] pool disposal errors");
				}
			})();
			return disposePromise;
		}
	};
}
//#endregion
export { resolveCopilotAuth as a, createCopilotByokAuth as i, resolveCopilotProvider as n, tokenFingerprint as o, createCopilotByokProxy as r, createCopilotAgentHarness as t };
