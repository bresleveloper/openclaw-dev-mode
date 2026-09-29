import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import "./errors-DnjwnOju.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { t as startOAuthLoopbackCallbackServer } from "./oauth-loopback-callback-BTvKedhW.mjs";
import { a as oauthErrorHtml, c as resolveOAuthTokenExpiresAt, d as withOAuthLoginAbort, i as generatePKCE, n as createOAuthLoginCancelledError, o as oauthSuccessHtml, r as generateBase64UrlOAuthState, s as parseOAuthAuthorizationInput, t as buildOAuthRequestSignal, u as throwIfOAuthLoginAborted } from "./provider-oauth-runtime-HklxkwLy.mjs";
import { n as loadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-CSNstsFk.mjs";
//#region src/llm/utils/oauth/anthropic.ts
/**
* Anthropic OAuth flow (Claude Pro/Max)
*
* NOTE: This module uses Node.js http.createServer for the OAuth callback server.
* It is only intended for CLI use, not browser environments.
*/
const CLIENT_ID = "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
const AUTHORIZE_URL = "https://claude.ai/oauth/authorize";
const TOKEN_URL = "https://platform.claude.com/v1/oauth/token";
const DEFAULT_CALLBACK_HOST = "127.0.0.1";
const LOOPBACK_CALLBACK_HOSTS = /* @__PURE__ */ new Set([
	"localhost",
	"127.0.0.1",
	"::1"
]);
const REDIRECT_URI = `http://localhost:53692/callback`;
const CALLBACK_TIMEOUT_MS = 3e5;
function resolveCallbackHost(env = process.env) {
	const host = env.OPENCLAW_OAUTH_CALLBACK_HOST?.trim() || DEFAULT_CALLBACK_HOST;
	if (!LOOPBACK_CALLBACK_HOSTS.has(host)) throw new Error("Anthropic OAuth callback host must be localhost, 127.0.0.1, or ::1");
	return host;
}
const SCOPES = "org:create_api_key user:profile user:inference user:sessions:claude_code user:mcp_servers user:file_upload";
/** Max response body bytes for Anthropic OAuth token endpoint (16 MiB). */
const OAUTH_RESPONSE_MAX_BYTES = 16777216;
function formatErrorDetails(error) {
	if (error instanceof Error) {
		const details = [`${error.name}: ${error.message}`];
		const errorWithCode = error;
		if (errorWithCode.code) details.push(`code=${errorWithCode.code}`);
		if (errorWithCode.errno !== void 0) details.push(`errno=${String(errorWithCode.errno)}`);
		if (error.cause !== void 0) details.push(`cause=${formatErrorDetails(error.cause)}`);
		if (error.stack) details.push(`stack=${error.stack}`);
		return details.join("; ");
	}
	return String(error);
}
function formatTokenResponseParseContext(responseBody) {
	return `bodyBytes=${Buffer.byteLength(responseBody, "utf8")}`;
}
function parseTokenCredentials(responseBody, options) {
	let data;
	try {
		data = JSON.parse(responseBody);
	} catch (error) {
		throw new Error(`${options.invalidJsonMessage} url=${TOKEN_URL}; ${formatTokenResponseParseContext(responseBody)}; details=${formatErrorDetails(error)}`, { cause: error });
	}
	if (!data || typeof data !== "object") throw new Error(`${options.invalidFieldsMessage} url=${TOKEN_URL}; ${formatTokenResponseParseContext(responseBody)}`);
	const record = data;
	const expires = resolveOAuthTokenExpiresAt(record.expires_in, { refreshSkewMs: 3e5 });
	if (typeof record.access_token !== "string" || !record.access_token || typeof record.refresh_token !== "string" || !record.refresh_token || expires === void 0) throw new Error(`${options.invalidFieldsMessage} url=${TOKEN_URL}; ${formatTokenResponseParseContext(responseBody)}`);
	return {
		refresh: record.refresh_token,
		access: record.access_token,
		expires
	};
}
async function startCallbackServer(expectedState) {
	if (typeof process === "undefined" || !process.versions?.node && !process.versions?.bun) throw new Error("Anthropic OAuth is only available in Node.js environments");
	const callback = await startOAuthLoopbackCallbackServer({
		redirectUrl: REDIRECT_URI,
		expectedState,
		timeoutMs: CALLBACK_TIMEOUT_MS,
		bindHostname: resolveCallbackHost(),
		renderSuccess: () => ({
			body: oauthSuccessHtml("Authorization received; return to the terminal while OpenClaw finishes."),
			contentType: "text/html; charset=utf-8"
		}),
		renderError: (message) => ({
			body: oauthErrorHtml(message),
			contentType: "text/html; charset=utf-8"
		})
	});
	return {
		cancelWait: () => void callback.close(),
		waitForCode: async () => {
			try {
				const result = await callback.waitForCallback();
				if (result.type === "oauth_error") throw new Error(`Anthropic OAuth error: ${result.error}`);
				return {
					code: result.code,
					state: result.state
				};
			} catch (error) {
				if (error instanceof Error && (error.message === "OAuth callback timeout" || error.message === "OAuth callback cancelled")) return null;
				throw error;
			}
		},
		close: callback.close
	};
}
async function postJson(url, body, options = {}) {
	const timeoutMs = options.timeoutMs ?? 3e4;
	throwIfOAuthLoginAborted(options.signal);
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(body),
		signal: buildOAuthRequestSignal({
			signal: options.signal,
			timeoutMs
		})
	});
	const buffer = await readResponseWithLimit(response, OAUTH_RESPONSE_MAX_BYTES, { onOverflow: ({ size }) => /* @__PURE__ */ new Error(`Anthropic OAuth response too large: ${size} bytes`) });
	const responseBody = new TextDecoder().decode(buffer);
	if (!response.ok) throw new Error(`HTTP request failed. status=${response.status}; url=${url}; body=${responseBody}`);
	return responseBody;
}
async function exchangeAuthorizationCode(code, state, verifier, redirectUri, signal) {
	let responseBody;
	try {
		responseBody = await postJson(TOKEN_URL, {
			grant_type: "authorization_code",
			client_id: CLIENT_ID,
			code,
			state,
			redirect_uri: redirectUri,
			code_verifier: verifier
		}, { signal });
	} catch (error) {
		if (signal?.aborted) throw createOAuthLoginCancelledError();
		throw new Error(`Token exchange request failed. url=${TOKEN_URL}; redirect_uri=${redirectUri}; response_type=authorization_code; details=${formatErrorDetails(error)}`, { cause: error });
	}
	return parseTokenCredentials(responseBody, {
		invalidJsonMessage: "Token exchange returned invalid JSON.",
		invalidFieldsMessage: "Token exchange returned invalid token fields."
	});
}
/**
* Login with Anthropic OAuth (authorization code + PKCE)
*/
async function loginAnthropic(options) {
	throwIfOAuthLoginAborted(options.signal);
	const { verifier, challenge } = await generatePKCE();
	const expectedState = generateBase64UrlOAuthState();
	const server = await startCallbackServer(expectedState);
	let code;
	let state;
	try {
		throwIfOAuthLoginAborted(options.signal);
		const authParams = new URLSearchParams({
			code: "true",
			client_id: CLIENT_ID,
			response_type: "code",
			redirect_uri: REDIRECT_URI,
			scope: SCOPES,
			code_challenge: challenge,
			code_challenge_method: "S256",
			state: expectedState
		});
		options.onAuth({
			url: `${AUTHORIZE_URL}?${authParams.toString()}`,
			instructions: "Complete login in your browser. If the browser is on another machine, paste the final redirect URL here."
		});
		throwIfOAuthLoginAborted(options.signal);
		if (options.onManualCodeInput) {
			let manualInput;
			let manualError;
			const manualPromise = options.onManualCodeInput().then((input) => {
				manualInput = input;
				server.cancelWait();
			}).catch((err) => {
				manualError = err instanceof Error ? err : new Error(String(err));
				server.cancelWait();
			});
			const result = await withOAuthLoginAbort(server.waitForCode(), options.signal, server.cancelWait);
			if (manualError) throw manualError;
			if (result?.code) {
				code = result.code;
				state = result.state;
			} else if (manualInput) {
				const parsed = parseOAuthAuthorizationInput(manualInput);
				if (parsed.state && parsed.state !== expectedState) throw new Error("OAuth state mismatch");
				code = parsed.code;
				state = parsed.state ?? expectedState;
			}
			if (!code) {
				await withOAuthLoginAbort(manualPromise, options.signal, server.cancelWait);
				if (manualError) throw toErrorObject(manualError, "Non-Error thrown");
				if (manualInput) {
					const parsed = parseOAuthAuthorizationInput(manualInput);
					if (parsed.state && parsed.state !== expectedState) throw new Error("OAuth state mismatch");
					code = parsed.code;
					state = parsed.state ?? expectedState;
				}
			}
		} else {
			const result = await withOAuthLoginAbort(server.waitForCode(), options.signal, server.cancelWait);
			if (result?.code) {
				code = result.code;
				state = result.state;
			}
		}
		if (!code) {
			const input = await withOAuthLoginAbort(options.onPrompt({
				message: "Paste the authorization code or full redirect URL:",
				placeholder: REDIRECT_URI
			}), options.signal, server.cancelWait);
			const parsed = parseOAuthAuthorizationInput(input);
			if (parsed.state && parsed.state !== expectedState) throw new Error("OAuth state mismatch");
			code = parsed.code;
			state = parsed.state ?? expectedState;
		}
		if (!code) throw new Error("Missing authorization code");
		if (!state) throw new Error("Missing OAuth state");
		options.onProgress?.("Exchanging authorization code for tokens...");
		return exchangeAuthorizationCode(code, state, verifier, REDIRECT_URI, options.signal);
	} finally {
		await server.close();
	}
}
/**
* Refresh Anthropic OAuth token
*/
async function refreshAnthropicToken(refreshToken) {
	let responseBody;
	try {
		responseBody = await postJson(TOKEN_URL, {
			grant_type: "refresh_token",
			client_id: CLIENT_ID,
			refresh_token: refreshToken
		});
	} catch (error) {
		throw new Error(`Anthropic token refresh request failed. url=${TOKEN_URL}; details=${formatErrorDetails(error)}`, { cause: error });
	}
	return parseTokenCredentials(responseBody, {
		invalidJsonMessage: "Anthropic token refresh returned invalid JSON.",
		invalidFieldsMessage: "Anthropic token refresh returned invalid token fields."
	});
}
const anthropicOAuthProvider = {
	id: "anthropic",
	name: "Anthropic (Claude Pro/Max)",
	usesCallbackServer: true,
	async login(callbacks) {
		return loginAnthropic({
			onAuth: callbacks.onAuth,
			onPrompt: callbacks.onPrompt,
			onProgress: callbacks.onProgress,
			onManualCodeInput: callbacks.onManualCodeInput,
			signal: callbacks.signal
		});
	},
	async refreshToken(credentials) {
		return refreshAnthropicToken(credentials.refresh);
	},
	getApiKey(credentials) {
		return credentials.access;
	}
};
//#endregion
//#region src/llm/utils/oauth/openai-chatgpt.ts
const OPENAI_CODEX_PROVIDER_ID = "openai";
function loadOpenAICodexOAuthFacade() {
	return loadActivatedBundledPluginPublicSurfaceModuleSync({
		dirName: "openai",
		artifactBasename: "api.js"
	});
}
function createLegacyRuntime(callbacks) {
	return {
		log: (message) => callbacks.onProgress?.(String(message)),
		error: (message) => callbacks.onProgress?.(String(message)),
		exit: (code) => {
			throw new Error(`exit:${code}`);
		}
	};
}
function createLegacyPrompter(callbacks) {
	const progress = {
		update: (message) => callbacks.onProgress?.(message),
		stop: (message) => {
			if (message) callbacks.onProgress?.(message);
		}
	};
	return {
		intro: async () => {},
		outro: async () => {},
		note: async (message) => callbacks.onProgress?.(message),
		select: async (params) => params.options[0]?.value,
		multiselect: async (params) => params.initialValues ?? [],
		text: async (prompt) => {
			const input = callbacks.onPrompt({
				message: prompt.message,
				placeholder: prompt.placeholder
			});
			return await withOAuthLoginAbort(input, callbacks.signal);
		},
		confirm: async () => false,
		progress: () => progress
	};
}
async function refreshViaProviderRuntime(refreshToken) {
	const { refreshProviderOAuthCredentialWithPlugin } = await import("./plugins/provider-runtime.runtime.js");
	const refreshed = await refreshProviderOAuthCredentialWithPlugin({
		provider: OPENAI_CODEX_PROVIDER_ID,
		context: {
			type: "oauth",
			provider: OPENAI_CODEX_PROVIDER_ID,
			access: "",
			refresh: refreshToken,
			expires: 0
		}
	});
	if (!refreshed) return await loadOpenAICodexOAuthFacade().refreshOpenAICodexToken(refreshToken);
	const credentials = { ...refreshed };
	delete credentials.type;
	delete credentials.provider;
	return credentials;
}
/** Runs the ChatGPT/Codex OAuth login flow and returns normalized credentials. */
async function loginOpenAICodex(callbacks) {
	throwIfOAuthLoginAborted(callbacks.signal);
	const { loginOpenAICodexOAuth } = await import("./provider-openai-chatgpt-oauth-DT_P3o-k.mjs");
	const manualCodeInput = callbacks.onManualCodeInput;
	const onManualCodeInput = manualCodeInput ? async () => await withOAuthLoginAbort(manualCodeInput(), callbacks.signal) : void 0;
	const credentials = await withOAuthLoginAbort(loginOpenAICodexOAuth({
		prompter: createLegacyPrompter(callbacks),
		runtime: createLegacyRuntime(callbacks),
		isRemote: false,
		signal: callbacks.signal,
		onManualCodeInput,
		openUrl: async (url) => {
			throwIfOAuthLoginAborted(callbacks.signal);
			await callbacks.onAuth({ url });
		}
	}), callbacks.signal);
	if (!credentials) throw new Error("OpenAI Codex OAuth login did not return credentials.");
	return credentials;
}
/** Refreshes a ChatGPT/Codex OAuth token through the provider runtime or bundled facade. */
async function refreshOpenAICodexToken(refreshToken) {
	return await refreshViaProviderRuntime(refreshToken);
}
//#endregion
//#region src/llm/utils/oauth/index.ts
/**
* OAuth credential management for AI providers.
*
* This module handles login, token refresh, and credential storage
* for OAuth-based providers:
* - Anthropic (Claude Pro/Max)
* - provider plugins through their runtime auth hooks
*/
const BUILT_IN_OAUTH_PROVIDERS = [anthropicOAuthProvider, {
	id: OPENAI_CODEX_PROVIDER_ID,
	name: "ChatGPT Plus/Pro (Codex Subscription)",
	usesCallbackServer: true,
	async login(callbacks) {
		return await loginOpenAICodex(callbacks);
	},
	async refreshToken(credentials) {
		return await refreshOpenAICodexToken(credentials.refresh);
	},
	getApiKey(credentials) {
		return credentials.access;
	}
}];
async function resolveOAuthApiKey(provider, credentials) {
	let creds = credentials[provider.id];
	if (!creds) return null;
	if (Date.now() >= creds.expires) try {
		creds = await provider.refreshToken(creds);
	} catch (error) {
		throw new Error(`Failed to refresh OAuth token for ${provider.id}`, { cause: error });
	}
	return {
		newCredentials: creds,
		apiKey: provider.getApiKey(creds)
	};
}
/** Mutable OAuth provider registrations owned by one auth/session runtime. */
var OAuthProviderRegistry = class {
	constructor() {
		this.providers = /* @__PURE__ */ new Map();
		this.reset();
	}
	get(id) {
		return this.providers.get(id);
	}
	register(provider) {
		this.providers.set(provider.id, provider);
	}
	reset() {
		this.providers.clear();
		for (const provider of BUILT_IN_OAUTH_PROVIDERS) this.providers.set(provider.id, provider);
	}
	getAll() {
		return Array.from(this.providers.values());
	}
	async getApiKey(providerId, credentials) {
		const provider = this.get(providerId);
		if (!provider) throw new Error(`Unknown OAuth provider: ${providerId}`);
		return resolveOAuthApiKey(provider, credentials);
	}
};
/**
* Get a built-in OAuth provider by ID.
*/
function getOAuthProvider(id) {
	return BUILT_IN_OAUTH_PROVIDERS.find((provider) => provider.id === id);
}
/**
* Get all built-in OAuth providers.
*/
function getOAuthProviders() {
	return [...BUILT_IN_OAUTH_PROVIDERS];
}
/**
* Get API key for a provider from OAuth credentials.
* Automatically refreshes expired tokens.
*
* @returns API key string and updated credentials, or null if no credentials
* @throws Error if refresh fails
*/
async function getOAuthApiKey(providerId, credentials) {
	const provider = getOAuthProvider(providerId);
	if (!provider) throw new Error(`Unknown OAuth provider: ${providerId}`);
	return resolveOAuthApiKey(provider, credentials);
}
//#endregion
//#region src/plugins/provider-runtime.errors.ts
const OAUTH_PROVIDER_CONFIGURED_UNAVAILABLE = "OAUTH_PROVIDER_CONFIGURED_UNAVAILABLE";
/** A known OAuth provider could not load its owning plugin or required auth hooks. */
var OAuthProviderConfiguredUnavailableError = class extends Error {
	constructor(providerId) {
		super(`OAuth provider "${providerId}" is configured but unavailable. Install or enable its owning plugin, then retry; run openclaw doctor for diagnostics.`);
		this.code = OAUTH_PROVIDER_CONFIGURED_UNAVAILABLE;
		this.state = "configured-unavailable";
		this.name = "OAuthProviderConfiguredUnavailableError";
		this.providerId = providerId;
	}
};
//#endregion
export { getOAuthProviders as i, OAuthProviderRegistry as n, getOAuthApiKey as r, OAuthProviderConfiguredUnavailableError as t };
