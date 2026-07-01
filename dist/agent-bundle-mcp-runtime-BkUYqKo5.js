import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as sanitizeForLog } from "./ansi-zQGMgESZ.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { u as toErrorObject } from "./errors-DCRXIYSQ.js";
import { n as signalProcessTree, t as killProcessTree } from "./kill-tree-kSm0C74g.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { n as findJsonSchemaShapeError, r as normalizeJsonSchemaForTypeBox } from "./json-schema-defaults-DG6hRBqY.js";
import { a as logWarn, t as logDebug } from "./logger-p_Dm5cGu.js";
import { a as redactSensitiveUrl, o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-Cf2Fdzd5.js";
import { a as loadUndiciRuntimeDeps } from "./undici-runtime-BfllGx-h.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "./ssrf-DmSIVBht.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Behn5ZPn.js";
import { r as sanitizeServerName } from "./agent-bundle-mcp-names-B9PLR-i_.js";
import { i as toMcpStringRecord, n as resolveStdioMcpServerLaunchConfig, r as isMcpConfigRecord, t as describeStdioMcpServerLaunchConfig } from "./mcp-stdio-BSQOal0o.js";
import { i as resolveOpenClawMcpTransportAlias } from "./mcp-config-normalize-CcYCBsqN.js";
import { t as loadMergedBundleMcpConfig } from "./bundle-mcp-config-CNYc0tEm.js";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-eO5nXmjv.js";
import process from "node:process";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { spawn } from "node:child_process";
import crypto, { createHash, randomUUID } from "node:crypto";
import { PassThrough } from "node:stream";
import { Compile } from "typebox/compile";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { AjvJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/ajv-provider.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { auth } from "@modelcontextprotocol/sdk/client/auth.js";
import { getDefaultEnvironment } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ReadBuffer, serializeMessage } from "@modelcontextprotocol/sdk/shared/stdio.js";
//#region src/agents/embedded-agent-mcp.ts
/** Loads merged MCP server config for an embedded agent workspace. */
function loadEmbeddedAgentMcpConfig(params) {
	const bundleMcp = loadMergedBundleMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry
	});
	return {
		mcpServers: bundleMcp.config.mcpServers,
		diagnostics: bundleMcp.diagnostics
	};
}
//#endregion
//#region src/agents/mcp-http-fetch.ts
/**
* MCP HTTP fetch wrappers.
* Adds SSRF protection, scoped TLS/client-cert dispatchers, response cleanup,
* and same-origin header handling around the MCP SDK fetch contract.
*/
/** Default MCP HTTP fetch backed by lazy-loaded undici runtime deps. */
const fetchWithUndici = async (url, init) => await loadUndiciRuntimeDeps().fetch(url, init);
const fetchWithUndiciGuard = async (input, init) => await fetchWithUndici(input instanceof Request ? input.url : input, init);
const MCP_HTTP_MAX_REDIRECTS = 20;
const managedMcpResponseCleanupRegistry = new FinalizationRegistry((held) => {
	held.finalize();
});
function resolveFetchRequest(input, init) {
	if (input instanceof Request) {
		const request = new Request(input, init);
		const body = request.body ?? void 0;
		return {
			url: request.url,
			init: {
				method: request.method,
				headers: request.headers,
				body,
				redirect: request.redirect,
				signal: request.signal,
				...body ? { duplex: "half" } : {}
			}
		};
	}
	return {
		url: input instanceof URL ? input.toString() : input,
		init
	};
}
async function ensureGlobalFetchResponse(response) {
	const init = {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	};
	if (response.body != null) return new Response(response.body, init);
	if (response.status === 204 || response.status === 205 || response.status === 304) return new Response(null, init);
	if (typeof response.text === "function") {
		const text = await response.text();
		return new Response(text, init);
	}
	return new Response(null, init);
}
async function buildManagedMcpResponse(response, release, refreshTimeout) {
	if (!response.body) {
		release();
		return await ensureGlobalFetchResponse(response);
	}
	const source = response.body;
	let reader;
	let released = false;
	const cleanupRegistrationToken = {};
	const finalize = async () => {
		if (released) return;
		released = true;
		managedMcpResponseCleanupRegistry.unregister(cleanupRegistrationToken);
		await reader?.cancel().catch(() => void 0);
		await release().catch(() => void 0);
	};
	const wrappedBody = new ReadableStream({
		start() {
			reader = source.getReader();
		},
		async pull(controller) {
			try {
				const chunk = await reader?.read();
				if (!chunk || chunk.done) {
					controller.close();
					await finalize();
					return;
				}
				refreshTimeout?.();
				controller.enqueue(chunk.value);
			} catch (error) {
				controller.error(error);
				await finalize();
			}
		},
		async cancel(reason) {
			try {
				await reader?.cancel(reason);
			} finally {
				await finalize();
			}
		}
	});
	managedMcpResponseCleanupRegistry.register(wrappedBody, { finalize }, cleanupRegistrationToken);
	return await ensureGlobalFetchResponse(new Response(wrappedBody, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	}));
}
/** Builds an MCP fetch function with optional TLS/client-cert dispatcher support. */
function buildMcpHttpFetch(params) {
	const needsCustomDispatcher = params.sslVerify === false || Boolean(params.clientCert || params.clientKey);
	const scopedOrigin = params.resourceUrl ? new URL(params.resourceUrl).origin : void 0;
	const policy = params.resourceUrl ? ssrfPolicyFromHttpBaseUrlAllowedOrigin(params.resourceUrl) : void 0;
	let customConnect;
	const resolveCustomDispatcherPolicy = (url) => {
		if (!needsCustomDispatcher || !scopedOrigin || url.origin !== scopedOrigin) return;
		customConnect ??= {
			...params.sslVerify === false ? { rejectUnauthorized: false } : {},
			...params.clientCert ? { cert: fs.readFileSync(params.clientCert, "utf-8") } : {},
			...params.clientKey ? { key: fs.readFileSync(params.clientKey, "utf-8") } : {}
		};
		return {
			mode: "direct",
			connect: customConnect
		};
	};
	return async (url, init) => {
		const request = resolveFetchRequest(url, init);
		const guarded = await fetchWithSsrFGuard({
			url: request.url,
			init: request.init,
			fetchImpl: fetchWithUndiciGuard,
			maxRedirects: MCP_HTTP_MAX_REDIRECTS,
			allowCrossOriginUnsafeRedirectReplay: true,
			auditContext: "mcp-http",
			useEnvProxyForEligibleUrls: true,
			...policy ? { policy } : {},
			...needsCustomDispatcher ? { resolveDispatcherPolicy: resolveCustomDispatcherPolicy } : {}
		});
		return await buildManagedMcpResponse(guarded.response, guarded.release, guarded.refreshTimeout);
	};
}
/** Removes Authorization from MCP headers before forwarding to non-authorized paths. */
function withoutMcpAuthorizationHeader(headers) {
	if (!headers) return;
	const entries = Object.entries(headers).filter(([key]) => key.toLowerCase() !== "authorization");
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
/** Wraps MCP fetch so configured headers are applied only to the resource origin. */
function withSameOriginMcpHttpHeaders(params) {
	if (!params.headers || Object.keys(params.headers).length === 0) return params.fetchFn;
	const resourceOrigin = new URL(params.resourceUrl).origin;
	return (url, init) => {
		if (new URL(url).origin !== resourceOrigin) return params.fetchFn(url, init);
		const headers = new Headers(params.headers);
		for (const [key, value] of new Headers(init?.headers)) headers.set(key, value);
		return params.fetchFn(url, {
			...init,
			headers
		});
	};
}
//#endregion
//#region src/agents/mcp-oauth.ts
/**
* MCP OAuth credential store and login helpers. Credentials are stored in the
* private OpenClaw state directory with one hashed file per MCP server URL.
*/
const LEGACY_DEFAULT_REDIRECT_URL = "http://127.0.0.1:8989/oauth/callback";
const LOCALHOST_REDIRECT_URL = "http://localhost:8989/oauth/callback";
function isMcpOAuthRedirectRegistrationError(error) {
	return /invalid_client_metadata|redirect_uri/i.test(String(error));
}
function oauthStorePath(serverName, serverUrl) {
	const safeServerName = sanitizeServerName(serverName, /* @__PURE__ */ new Set());
	const key = createHash("sha256").update(serverName).update("\0").update(serverUrl).digest("hex");
	return path.join(resolveStateDir(), "mcp-oauth", `${safeServerName}-${key.slice(0, 16)}.json`);
}
async function readStore(filePath) {
	try {
		return JSON.parse(await fs$1.readFile(filePath, "utf-8"));
	} catch {
		return {};
	}
}
function readStoreSync(filePath) {
	try {
		return JSON.parse(fs.readFileSync(filePath, "utf-8"));
	} catch {
		return {};
	}
}
async function writeStore(filePath, store) {
	await fs$1.mkdir(path.dirname(filePath), {
		recursive: true,
		mode: 448
	});
	await fs$1.writeFile(filePath, JSON.stringify(store, null, 2), {
		encoding: "utf-8",
		mode: 384
	});
	await fs$1.chmod(filePath, 384).catch(() => {});
}
function resolveOAuthRedirectUrl(config, store = {}) {
	return normalizeOptionalString(config.redirectUrl) ?? normalizeOptionalString(store.redirectUrl) ?? LEGACY_DEFAULT_REDIRECT_URL;
}
function buildOAuthClientMetadata(config, store = {}) {
	return {
		client_name: "OpenClaw MCP",
		redirect_uris: [resolveOAuthRedirectUrl(config, store)],
		grant_types: ["authorization_code", "refresh_token"],
		response_types: ["code"],
		token_endpoint_auth_method: "none",
		...normalizeOptionalString(config.scope) ? { scope: normalizeOptionalString(config.scope) } : {}
	};
}
/** Creates the MCP SDK OAuth provider backed by OpenClaw's private store. */
function createMcpOAuthClientProvider(params) {
	const config = params.config ?? {};
	const filePath = oauthStorePath(params.serverName, params.serverUrl);
	const allowAuthorizationRedirect = params.allowAuthorizationRedirect ?? Boolean(params.onAuthorizationUrl);
	const assertAuthorizationRedirectAllowed = () => {
		if (!allowAuthorizationRedirect) throw new Error(`MCP server "${params.serverName}" requires OAuth authorization. Run openclaw mcp login ${params.serverName}.`);
	};
	return {
		get redirectUrl() {
			return resolveOAuthRedirectUrl(config, readStoreSync(filePath));
		},
		clientMetadataUrl: normalizeOptionalString(config.clientMetadataUrl),
		get clientMetadata() {
			return buildOAuthClientMetadata(config, readStoreSync(filePath));
		},
		async state() {
			assertAuthorizationRedirectAllowed();
			const store = await readStore(filePath);
			const state = randomUUID();
			await writeStore(filePath, {
				...store,
				state
			});
			return state;
		},
		async clientInformation() {
			return (await readStore(filePath)).clientInformation;
		},
		async saveClientInformation(clientInformation) {
			await writeStore(filePath, {
				...await readStore(filePath),
				clientInformation
			});
		},
		async tokens() {
			return (await readStore(filePath)).tokens;
		},
		async saveTokens(tokens) {
			await writeStore(filePath, {
				...await readStore(filePath),
				tokens
			});
		},
		async redirectToAuthorization(authorizationUrl) {
			assertAuthorizationRedirectAllowed();
			await writeStore(filePath, {
				...await readStore(filePath),
				lastAuthorizationUrl: authorizationUrl.toString()
			});
			await params.onAuthorizationUrl?.(authorizationUrl);
		},
		async saveCodeVerifier(codeVerifier) {
			assertAuthorizationRedirectAllowed();
			await writeStore(filePath, {
				...await readStore(filePath),
				codeVerifier
			});
		},
		async codeVerifier() {
			const codeVerifier = (await readStore(filePath)).codeVerifier;
			if (!codeVerifier) throw new Error("Missing MCP OAuth code verifier. Run the login flow again.");
			return codeVerifier;
		},
		async invalidateCredentials(scope) {
			const next = { ...await readStore(filePath) };
			if (scope === "all" || scope === "client") delete next.clientInformation;
			if (scope === "all" || scope === "tokens") delete next.tokens;
			if (scope === "all" || scope === "verifier") delete next.codeVerifier;
			if (scope === "all" || scope === "discovery") delete next.discoveryState;
			await writeStore(filePath, next);
		},
		async saveDiscoveryState(discoveryState) {
			await writeStore(filePath, {
				...await readStore(filePath),
				discoveryState
			});
		},
		async discoveryState() {
			return (await readStore(filePath)).discoveryState;
		}
	};
}
/** Deletes stored OAuth credentials for one MCP server. */
async function clearMcpOAuthCredentials(params) {
	await fs$1.rm(oauthStorePath(params.serverName, params.serverUrl), { force: true });
}
/** Reads stored OAuth credential presence without exposing credential values. */
async function readMcpOAuthCredentialsStatus(params) {
	const store = await readStore(oauthStorePath(params.serverName, params.serverUrl));
	return {
		hasTokens: Boolean(store.tokens),
		hasClientInformation: Boolean(store.clientInformation),
		hasCodeVerifier: Boolean(store.codeVerifier),
		hasDiscoveryState: Boolean(store.discoveryState),
		hasLastAuthorizationUrl: Boolean(store.lastAuthorizationUrl)
	};
}
async function runMcpOAuthLoginAttempt(params) {
	return await auth(createMcpOAuthClientProvider({
		...params,
		allowAuthorizationRedirect: true
	}), {
		serverUrl: params.serverUrl,
		authorizationCode: normalizeOptionalString(params.authorizationCode),
		scope: normalizeOptionalString(params.config?.scope),
		fetchFn: params.fetchFn
	}) === "AUTHORIZED" ? "authorized" : "redirect";
}
/** Runs the MCP OAuth login flow, returning whether it authorized or needs redirect. */
async function runMcpOAuthLogin(params) {
	const filePath = oauthStorePath(params.serverName, params.serverUrl);
	const store = await readStore(filePath);
	const loginParams = {
		...params,
		config: {
			...params.config,
			redirectUrl: normalizeOptionalString(params.config?.redirectUrl) ?? store.redirectUrl
		}
	};
	try {
		return await runMcpOAuthLoginAttempt(loginParams);
	} catch (error) {
		if (!normalizeOptionalString(params.authorizationCode) && !normalizeOptionalString(params.config?.redirectUrl) && isMcpOAuthRedirectRegistrationError(error)) {
			const result = await runMcpOAuthLoginAttempt({
				...params,
				config: {
					...params.config,
					redirectUrl: LOCALHOST_REDIRECT_URL
				}
			});
			await writeStore(filePath, {
				...await readStore(filePath),
				redirectUrl: LOCALHOST_REDIRECT_URL
			});
			return result;
		}
		throw error;
	}
}
//#endregion
//#region src/agents/mcp-stdio-transport.ts
/**
* OpenClaw stdio transport wrapper for MCP server subprocesses.
*/
const CLOSE_TIMEOUT_MS = 2e3;
const SIGKILL_REAP_TIMEOUT_MS = 500;
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms).unref();
	});
}
var OpenClawStdioClientTransport = class {
	constructor(serverParams) {
		this.serverParams = serverParams;
		this.readBuffer = new ReadBuffer();
		this.stderrStream = null;
		if (serverParams.stderr === "pipe" || serverParams.stderr === "overlapped") this.stderrStream = new PassThrough();
	}
	async start() {
		if (this.process) throw new Error("OpenClawStdioClientTransport already started; Client.connect() starts transports automatically.");
		await new Promise((resolve, reject) => {
			const baseEnv = {
				...getDefaultEnvironment(),
				...this.serverParams.env
			};
			const preparedSpawn = prepareOomScoreAdjustedSpawn(this.serverParams.command, this.serverParams.args ?? [], { env: baseEnv });
			const child = spawn(preparedSpawn.command, preparedSpawn.args, {
				cwd: this.serverParams.cwd,
				detached: process.platform !== "win32",
				env: preparedSpawn.env,
				shell: false,
				stdio: [
					"pipe",
					"pipe",
					this.serverParams.stderr ?? "inherit"
				],
				windowsHide: process.platform === "win32"
			});
			this.process = child;
			child.on("error", (error) => {
				reject(error);
				this.onerror?.(error);
			});
			child.on("spawn", () => resolve());
			child.on("close", () => {
				this.process = void 0;
				this.onclose?.();
			});
			child.stdin?.on("error", (error) => this.onerror?.(error));
			child.stdout?.on("data", (chunk) => {
				this.readBuffer.append(chunk);
				this.processReadBuffer();
			});
			child.stdout?.on("error", (error) => this.onerror?.(error));
			if (this.stderrStream && child.stderr) child.stderr.pipe(this.stderrStream);
		});
	}
	get stderr() {
		return this.stderrStream ?? this.process?.stderr ?? null;
	}
	get pid() {
		return this.process?.pid ?? null;
	}
	processReadBuffer() {
		while (true) try {
			const message = this.readBuffer.readMessage();
			if (message === null) break;
			this.onmessage?.(message);
		} catch (error) {
			this.onerror?.(error instanceof Error ? error : new Error(String(error)));
		}
	}
	async close() {
		const processToClose = this.process;
		this.process = void 0;
		if (processToClose) {
			const closePromise = new Promise((resolve) => {
				processToClose.once("close", () => resolve());
			});
			try {
				processToClose.stdin?.end();
			} catch {}
			await Promise.race([closePromise, delay(CLOSE_TIMEOUT_MS)]);
			if (processToClose.exitCode === null && processToClose.pid) {
				killProcessTree(processToClose.pid);
				await Promise.race([closePromise, delay(CLOSE_TIMEOUT_MS)]);
				if (processToClose.exitCode === null && processToClose.pid) {
					signalProcessTree(processToClose.pid, "SIGKILL");
					await Promise.race([closePromise, delay(SIGKILL_REAP_TIMEOUT_MS)]);
				}
			}
		}
		this.readBuffer.clear();
	}
	send(message) {
		return new Promise((resolve, reject) => {
			const stdin = this.process?.stdin;
			if (!stdin) throw new Error("Not connected");
			const json = serializeMessage(message);
			try {
				if (!stdin.write(json, (err) => {
					if (err) reject(err);
					else resolve();
				})) stdin.once("drain", () => {});
			} catch (err) {
				reject(err instanceof Error ? err : new Error(String(err)));
			}
		});
	}
};
//#endregion
//#region src/agents/mcp-http.ts
/**
* HTTP MCP launch config normalization.
*
* MCP server setup uses this to validate SSE/streamable HTTP server records,
* sanitize headers, and redact sensitive URLs in diagnostics.
*/
/** Normalizes an HTTP MCP server config record into a launchable transport config. */
function resolveHttpMcpServerLaunchConfig(raw, options) {
	if (!isMcpConfigRecord(raw)) return {
		ok: false,
		reason: "server config must be an object"
	};
	if (typeof raw.url !== "string" || raw.url.trim().length === 0) return {
		ok: false,
		reason: "its url is missing"
	};
	const url = raw.url.trim();
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return {
			ok: false,
			reason: `its url is not a valid URL: ${redactSensitiveUrlLikeString(url)}`
		};
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return {
		ok: false,
		reason: `only http and https URLs are supported, got ${parsed.protocol}`
	};
	let headers;
	if (raw.headers !== void 0 && raw.headers !== null) if (!isMcpConfigRecord(raw.headers)) options?.onMalformedHeaders?.(raw.headers);
	else headers = toMcpStringRecord(raw.headers, { onDroppedEntry: options?.onDroppedHeader });
	return {
		ok: true,
		config: {
			transportType: options?.transportType ?? "sse",
			url,
			headers
		}
	};
}
/** Describes an HTTP MCP server launch config without leaking URL credentials. */
function describeHttpMcpServerLaunchConfig(config) {
	return redactSensitiveUrl(config.url);
}
//#endregion
//#region src/agents/mcp-transport-config.ts
/**
* Resolves MCP transport command, environment, and timeout configuration.
*/
const DEFAULT_CONNECTION_TIMEOUT_MS = 3e4;
const DEFAULT_REQUEST_TIMEOUT_MS = 6e4;
function getPositiveNumber(rawServer, keys) {
	if (!rawServer || typeof rawServer !== "object") return;
	const record = rawServer;
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
	}
}
function getConnectionTimeoutMs(rawServer) {
	const milliseconds = getPositiveNumber(rawServer, ["connectionTimeoutMs"]);
	if (milliseconds) return Math.floor(milliseconds);
	const seconds = getPositiveNumber(rawServer, ["connectTimeout", "connect_timeout"]);
	if (seconds) return Math.floor(seconds * 1e3);
	return DEFAULT_CONNECTION_TIMEOUT_MS;
}
function getRequestTimeoutMs(rawServer) {
	const milliseconds = getPositiveNumber(rawServer, ["requestTimeoutMs"]);
	if (milliseconds) return Math.floor(milliseconds);
	const seconds = getPositiveNumber(rawServer, ["timeout"]);
	if (seconds) return Math.floor(seconds * 1e3);
	return DEFAULT_REQUEST_TIMEOUT_MS;
}
function getBooleanField(rawServer, keys) {
	if (!rawServer || typeof rawServer !== "object") return;
	const record = rawServer;
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "boolean") return value;
	}
}
function getStringField(rawServer, keys) {
	if (!rawServer || typeof rawServer !== "object") return;
	const record = rawServer;
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "string" && value.trim().length > 0) return value.trim();
	}
}
function getRequestedTransport(rawServer) {
	if (!rawServer || typeof rawServer !== "object" || typeof rawServer.transport !== "string") return "";
	return normalizeLowercaseStringOrEmpty(rawServer.transport);
}
function getRequestedTransportAlias(rawServer) {
	if (!rawServer || typeof rawServer !== "object" || typeof rawServer.type !== "string") return "";
	return resolveOpenClawMcpTransportAlias(rawServer.type) ?? "";
}
function resolveHttpTransportConfig(serverName, rawServer, transportType) {
	const launch = resolveHttpMcpServerLaunchConfig(rawServer, {
		transportType,
		onDroppedHeader: (key) => {
			logWarn(`bundle-mcp: server "${serverName}": header "${key}" has an unsupported value type and was ignored.`);
		},
		onMalformedHeaders: () => {
			logWarn(`bundle-mcp: server "${serverName}": "headers" must be a JSON object; the value was ignored.`);
		}
	});
	if (!launch.ok) return null;
	return {
		kind: "http",
		transportType: launch.config.transportType,
		url: launch.config.url,
		headers: launch.config.headers,
		...rawServer && typeof rawServer === "object" && rawServer.auth === "oauth" ? { auth: "oauth" } : {},
		...rawServer && typeof rawServer === "object" && rawServer.oauth && typeof rawServer.oauth === "object" && !Array.isArray(rawServer.oauth) ? { oauth: rawServer.oauth } : {},
		...getBooleanField(rawServer, ["sslVerify", "ssl_verify"]) !== void 0 ? { sslVerify: getBooleanField(rawServer, ["sslVerify", "ssl_verify"]) } : {},
		...getStringField(rawServer, ["clientCert", "client_cert"]) ? { clientCert: getStringField(rawServer, ["clientCert", "client_cert"]) } : {},
		...getStringField(rawServer, ["clientKey", "client_key"]) ? { clientKey: getStringField(rawServer, ["clientKey", "client_key"]) } : {},
		description: describeHttpMcpServerLaunchConfig(launch.config),
		connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
		requestTimeoutMs: getRequestTimeoutMs(rawServer),
		supportsParallelToolCalls: getBooleanField(rawServer, ["supportsParallelToolCalls", "supports_parallel_tool_calls"]) ?? false
	};
}
/** Resolve one MCP server's launch transport config, or null when unsupported. */
function resolveMcpTransportConfig(serverName, rawServer) {
	const logServerName = sanitizeForLog(serverName);
	const requestedTransport = getRequestedTransport(rawServer);
	const requestedTransportAlias = requestedTransport ? "" : getRequestedTransportAlias(rawServer);
	const effectiveTransport = requestedTransport || requestedTransportAlias;
	const stdioLaunch = resolveStdioMcpServerLaunchConfig(rawServer, { onDroppedEnv: (key) => {
		logWarn(`bundle-mcp: server "${logServerName}": env "${sanitizeForLog(key)}" is blocked for stdio startup safety and was ignored.`);
	} });
	if (stdioLaunch.ok) return {
		kind: "stdio",
		transportType: "stdio",
		command: stdioLaunch.config.command,
		args: stdioLaunch.config.args,
		env: stdioLaunch.config.env,
		cwd: stdioLaunch.config.cwd,
		description: describeStdioMcpServerLaunchConfig(stdioLaunch.config),
		connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
		requestTimeoutMs: getRequestTimeoutMs(rawServer),
		supportsParallelToolCalls: getBooleanField(rawServer, ["supportsParallelToolCalls", "supports_parallel_tool_calls"]) ?? false
	};
	if (effectiveTransport && effectiveTransport !== "sse" && effectiveTransport !== "streamable-http") {
		logWarn(`bundle-mcp: skipped server "${logServerName}" because transport "${sanitizeForLog(effectiveTransport)}" is not supported.`);
		return null;
	}
	if (effectiveTransport === "streamable-http") {
		const httpTransport = resolveHttpTransportConfig(serverName, rawServer, "streamable-http");
		if (httpTransport) return httpTransport;
	}
	const sseTransport = resolveHttpTransportConfig(serverName, rawServer, "sse");
	if (sseTransport) return sseTransport;
	const httpLaunch = resolveHttpMcpServerLaunchConfig(rawServer);
	const httpReason = httpLaunch.ok ? "not an HTTP MCP server" : httpLaunch.reason;
	logWarn(`bundle-mcp: skipped server "${logServerName}" because ${stdioLaunch.reason} and ${httpReason}.`);
	return null;
}
//#endregion
//#region src/agents/mcp-transport.ts
/**
* MCP client transport factory.
*
* This module turns normalized MCP server config into stdio, SSE, or
* streamable-HTTP SDK transports with OpenClaw auth, redirect, and logging rules.
*/
function attachStderrLogging(serverName, transport) {
	const stderr = transport.stderr;
	if (!stderr || typeof stderr.on !== "function") return;
	const onData = (chunk) => {
		const message = normalizeOptionalString(typeof chunk === "string" ? chunk : String(chunk)) ?? "";
		if (!message) return;
		for (const line of message.split(/\r?\n/)) {
			const trimmed = line.trim();
			if (trimmed) logDebug(`bundle-mcp:${serverName}: ${trimmed}`);
		}
	};
	stderr.on("data", onData);
	return () => {
		if (typeof stderr.off === "function") stderr.off("data", onData);
		else if (typeof stderr.removeListener === "function") stderr.removeListener("data", onData);
	};
}
function buildSseEventSourceFetch(headers, baseFetch) {
	return (url, init) => {
		const mergedHeaders = {};
		for (const [key, value] of new Headers(init?.headers)) mergedHeaders[key.toLowerCase()] = value;
		for (const [key, value] of Object.entries(headers)) mergedHeaders[key.toLowerCase()] = value;
		return baseFetch(url, {
			...init,
			headers: mergedHeaders
		});
	};
}
/** Resolves a configured MCP server into a live SDK transport instance. */
function resolveMcpTransport(serverName, rawServer) {
	const resolved = resolveMcpTransportConfig(serverName, rawServer);
	if (!resolved) return null;
	if (resolved.kind === "stdio") {
		const transport = new OpenClawStdioClientTransport({
			command: resolved.command,
			args: resolved.args,
			env: resolved.env,
			cwd: resolved.cwd,
			stderr: "pipe"
		});
		return {
			transport,
			description: resolved.description,
			transportType: "stdio",
			connectionTimeoutMs: resolved.connectionTimeoutMs,
			requestTimeoutMs: resolved.requestTimeoutMs,
			supportsParallelToolCalls: resolved.supportsParallelToolCalls,
			detachStderr: attachStderrLogging(serverName, transport)
		};
	}
	const authProvider = resolved.auth === "oauth" ? createMcpOAuthClientProvider({
		serverName,
		serverUrl: resolved.url,
		config: resolved.oauth
	}) : void 0;
	const baseFetch = buildMcpHttpFetch({
		sslVerify: resolved.sslVerify,
		clientCert: resolved.clientCert,
		clientKey: resolved.clientKey,
		resourceUrl: resolved.url
	});
	const headers = resolved.auth === "oauth" ? withoutMcpAuthorizationHeader(resolved.headers) : resolved.headers;
	const httpFetch = resolved.auth === "oauth" ? withSameOriginMcpHttpHeaders({
		fetchFn: baseFetch,
		headers,
		resourceUrl: resolved.url
	}) : baseFetch;
	if (resolved.transportType === "streamable-http") return {
		transport: new StreamableHTTPClientTransport(new URL(resolved.url), {
			requestInit: resolved.auth === "oauth" || !headers ? void 0 : { headers },
			fetch: httpFetch,
			authProvider
		}),
		description: resolved.description,
		transportType: "streamable-http",
		connectionTimeoutMs: resolved.connectionTimeoutMs,
		requestTimeoutMs: resolved.requestTimeoutMs,
		supportsParallelToolCalls: resolved.supportsParallelToolCalls
	};
	const sseHeaders = { ...headers };
	const hasHeaders = Object.keys(sseHeaders).length > 0;
	return {
		transport: new SSEClientTransport(new URL(resolved.url), {
			requestInit: resolved.auth === "oauth" || !hasHeaders ? void 0 : { headers: sseHeaders },
			fetch: httpFetch,
			eventSourceInit: { fetch: buildSseEventSourceFetch(resolved.auth === "oauth" ? {} : sseHeaders, httpFetch) },
			authProvider
		}),
		description: resolved.description,
		transportType: "sse",
		connectionTimeoutMs: resolved.connectionTimeoutMs,
		requestTimeoutMs: resolved.requestTimeoutMs,
		supportsParallelToolCalls: resolved.supportsParallelToolCalls
	};
}
//#endregion
//#region src/agents/agent-bundle-mcp-runtime.ts
/** Session-scoped MCP runtime manager, catalog loader, and transport lifecycle. */
const SESSION_MCP_RUNTIME_MANAGER_KEY = Symbol.for("openclaw.sessionMcpRuntimeManager");
const DRAFT_2020_12_SCHEMA = "https://json-schema.org/draft/2020-12/schema";
const DEFAULT_SESSION_MCP_RUNTIME_IDLE_TTL_MS = 600 * 1e3;
const SESSION_MCP_RUNTIME_SWEEP_INTERVAL_MS = 60 * 1e3;
const BUNDLE_MCP_FAILURE_THRESHOLD = 3;
const BUNDLE_MCP_FAILURE_COOLDOWN_MS = 6e4;
const BUNDLE_MCP_CATALOG_LIST_TIMEOUT_MS = 1500;
const BUNDLE_MCP_METADATA_TEXT_LIMIT = 1200;
let bundleMcpCatalogListTimeoutMs;
function isDraft202012Schema(schema) {
	return schema.$schema === DRAFT_2020_12_SCHEMA;
}
function formatTypeBoxErrors(errors) {
	return errors.map((error) => {
		const message = error.message?.trim() || "schema validation failed";
		return error.instancePath ? `${error.instancePath} ${message}` : message;
	}).join(", ") || "schema validation failed";
}
const schemaMapKeywords = new Set([
	"$defs",
	"definitions",
	"dependentSchemas",
	"patternProperties",
	"properties"
]);
const schemaValueKeywords = new Set([
	"additionalItems",
	"additionalProperties",
	"contains",
	"else",
	"if",
	"items",
	"not",
	"propertyNames",
	"then",
	"unevaluatedItems",
	"unevaluatedProperties"
]);
const schemaArrayKeywords = new Set([
	"allOf",
	"anyOf",
	"oneOf",
	"prefixItems"
]);
function stripSchemaMapFormats(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, stripJsonSchemaFormats(entry)]));
}
function expandJsonSchemaTypeArray(schema) {
	const { type, ...rest } = schema;
	if (!Array.isArray(type)) return schema;
	return { anyOf: type.map((entry) => Object.assign({}, rest, { type: entry })) };
}
function stripJsonSchemaFormats(schema) {
	if (Array.isArray(schema)) return schema.map((entry) => stripJsonSchemaFormats(entry));
	if (!schema || typeof schema !== "object") return schema;
	const normalizedSchema = expandJsonSchemaTypeArray(schema);
	return Object.fromEntries(Object.entries(normalizedSchema).filter(([key]) => key !== "format").map(([key, value]) => {
		if (schemaMapKeywords.has(key)) return [key, stripSchemaMapFormats(value)];
		if (key === "dependencies") return [key, stripSchemaMapFormats(value)];
		if (schemaValueKeywords.has(key) || schemaArrayKeywords.has(key)) return [key, stripJsonSchemaFormats(value)];
		return [key, value];
	}));
}
function createBundleMcpJsonSchemaValidator() {
	const defaultValidator = new AjvJsonSchemaValidator();
	return { getValidator(schema) {
		if (!isDraft202012Schema(schema)) return defaultValidator.getValidator(schema);
		const schemaError = findJsonSchemaShapeError(schema);
		if (schemaError) throw new Error(`Invalid MCP draft-2020-12 JSON Schema: ${schemaError}`);
		const validator = Compile(normalizeJsonSchemaForTypeBox(stripJsonSchemaFormats(schema)));
		return (input) => {
			if (validator.Check(input)) return {
				valid: true,
				data: input,
				errorMessage: void 0
			};
			return {
				valid: false,
				data: void 0,
				errorMessage: formatTypeBoxErrors([...validator.Errors(input)])
			};
		};
	} };
}
function connectWithTimeout(client, transport, timeoutMs) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`MCP server connection timed out after ${timeoutMs}ms`)), timeoutMs);
		client.connect(transport).then((value) => {
			clearTimeout(timer);
			resolve(value);
		}, (error) => {
			clearTimeout(timer);
			reject(toErrorObject(error, "Non-Error rejection"));
		});
	});
}
function redactErrorUrls(error) {
	return redactSensitiveUrlLikeString(String(error));
}
async function listAllTools(client, timeoutMs) {
	const tools = [];
	let cursor;
	do {
		const params = cursor ? { cursor } : void 0;
		const page = await client.listTools(params, { timeout: timeoutMs });
		tools.push(...page.tools);
		cursor = page.nextCursor;
	} while (cursor);
	return tools;
}
function isMcpMethodNotFoundError(error) {
	if (isMcpConfigRecord(error) && error.code === ErrorCode.MethodNotFound) return true;
	const message = String(error);
	return message.includes("-32601") || /method not found/i.test(message);
}
async function listAllToolsBestEffort(params) {
	try {
		return await listAllTools(params.client, params.timeoutMs);
	} catch (error) {
		if (params.suppressUnsupported && isMcpMethodNotFoundError(error)) return [];
		throw error;
	}
}
function hasConfiguredMcpRequestTimeout(rawServer) {
	if (!rawServer || typeof rawServer !== "object") return false;
	const record = rawServer;
	for (const key of ["requestTimeoutMs", "timeout"]) {
		const value = record[key];
		if (typeof value === "number" && Number.isFinite(value) && value > 0) return true;
	}
	return false;
}
function getCatalogListTimeoutMs(rawServer, requestTimeoutMs) {
	if (bundleMcpCatalogListTimeoutMs !== void 0) return bundleMcpCatalogListTimeoutMs;
	return hasConfiguredMcpRequestTimeout(rawServer) ? requestTimeoutMs : BUNDLE_MCP_CATALOG_LIST_TIMEOUT_MS;
}
function setBundleMcpCatalogListTimeoutMsForTest(timeoutMs) {
	bundleMcpCatalogListTimeoutMs = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.floor(timeoutMs) : void 0;
}
async function listAllResources(client, timeoutMs) {
	const resources = [];
	let cursor;
	do {
		const params = cursor ? { cursor } : void 0;
		const page = await client.listResources(params, { timeout: timeoutMs });
		resources.push(...page.resources);
		cursor = page.nextCursor;
	} while (cursor);
	return resources;
}
async function listAllPrompts(client, timeoutMs) {
	const prompts = [];
	let cursor;
	do {
		const params = cursor ? { cursor } : void 0;
		const page = await client.listPrompts(params, { timeout: timeoutMs });
		prompts.push(...page.prompts);
		cursor = page.nextCursor;
	} while (cursor);
	return prompts;
}
function escapeRegex(value) {
	return value.replace(/[\\^$+?.()|[\]{}]/g, "\\$&");
}
function globMatches(pattern, value) {
	const trimmed = pattern.trim();
	if (!trimmed) return false;
	if (!trimmed.includes("*")) return trimmed === value;
	return new RegExp(`^${trimmed.split("*").map(escapeRegex).join(".*")}$`).test(value);
}
function normalizeStringList(value) {
	if (!Array.isArray(value)) return;
	const entries = value.filter((entry) => typeof entry === "string");
	return entries.length > 0 ? entries : void 0;
}
function getMcpToolSelection(rawServer) {
	if (!isMcpConfigRecord(rawServer) || !isMcpConfigRecord(rawServer.toolFilter)) return {};
	return {
		include: normalizeStringList(rawServer.toolFilter.include),
		exclude: normalizeStringList(rawServer.toolFilter.exclude)
	};
}
function shouldExposeMcpTool(selection, toolName) {
	const include = selection.include ?? [];
	const exclude = selection.exclude ?? [];
	if (include.length > 0 && !include.some((pattern) => globMatches(pattern, toolName))) return false;
	return !exclude.some((pattern) => globMatches(pattern, toolName));
}
function sanitizeMcpMetadataText(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	const scrubbed = normalized.replace(/ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi, "[redacted MCP metadata instruction]").replace(/disregard\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi, "[redacted MCP metadata instruction]").replace(/system\s+prompt/gi, "system prompt");
	return scrubbed.length > BUNDLE_MCP_METADATA_TEXT_LIMIT ? `${scrubbed.slice(0, BUNDLE_MCP_METADATA_TEXT_LIMIT)}...` : scrubbed;
}
function summarizeServerCapabilities(capabilities) {
	return {
		resources: capabilities?.resources ? { listChanged: capabilities.resources.listChanged === true } : void 0,
		prompts: capabilities?.prompts ? { listChanged: capabilities.prompts.listChanged === true } : void 0,
		tools: capabilities?.tools ? { listChanged: capabilities.tools.listChanged === true } : void 0
	};
}
const DISPOSE_TIMEOUT_MS = 5e3;
async function disposeSession(session) {
	session.detachStderr?.();
	let timer;
	let timedOut = false;
	await Promise.race([(async () => {
		if (session.transportType === "streamable-http") await session.transport.terminateSession().catch(() => {});
		await session.transport.close().catch(() => {});
		await session.client.close().catch(() => {});
	})(), new Promise((resolve) => {
		timer = setTimeout(() => {
			timedOut = true;
			resolve();
		}, DISPOSE_TIMEOUT_MS);
		timer.unref?.();
	})]).finally(() => {
		if (timer) clearTimeout(timer);
	});
	if (timedOut) {
		await session.transport.close().catch(() => {});
		await session.client.close().catch(() => {});
	}
}
function createCatalogFingerprint(servers) {
	return crypto.createHash("sha1").update(JSON.stringify(servers)).digest("hex");
}
function loadSessionMcpConfig(params) {
	const loaded = loadEmbeddedAgentMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry
	});
	if (params.logDiagnostics !== false) for (const diagnostic of loaded.diagnostics) logWarn(`bundle-mcp: ${diagnostic.pluginId}: ${diagnostic.message}`);
	return {
		loaded,
		fingerprint: createCatalogFingerprint(loaded.mcpServers)
	};
}
/**
* Loads enabled MCP config metadata for a session without creating runtimes,
* connecting transports, or issuing MCP tools/list requests.
*/
function resolveSessionMcpConfigSummary(params) {
	const { loaded, fingerprint } = loadSessionMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		logDiagnostics: false,
		manifestRegistry: params.manifestRegistry
	});
	return {
		fingerprint,
		serverNames: Object.keys(loaded.mcpServers).toSorted((a, b) => a.localeCompare(b))
	};
}
function createDisposedError(sessionId) {
	return /* @__PURE__ */ new Error(`bundle-mcp runtime disposed for session ${sessionId}`);
}
function resolveSessionMcpRuntimeIdleTtlMs(cfg) {
	const raw = cfg?.mcp?.sessionIdleTtlMs;
	if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) return Math.floor(raw);
	return DEFAULT_SESSION_MCP_RUNTIME_IDLE_TTL_MS;
}
function createSessionMcpRuntime(params) {
	const { loaded, fingerprint: configFingerprint } = loadSessionMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		logDiagnostics: true,
		manifestRegistry: params.manifestRegistry
	});
	const createdAt = Date.now();
	let lastUsedAt = createdAt;
	let activeLeases = 0;
	let disposed = false;
	let catalog = null;
	let catalogInFlight;
	let catalogInvalidationGeneration = 0;
	const sessions = /* @__PURE__ */ new Map();
	const serverBackoff = /* @__PURE__ */ new Map();
	const recordServerToolFailure = (serverName, nowMs) => {
		const failures = (serverBackoff.get(serverName)?.failures ?? 0) + 1;
		const nextBackoff = { failures };
		if (failures >= BUNDLE_MCP_FAILURE_THRESHOLD) nextBackoff.retryAfterMs = nowMs + BUNDLE_MCP_FAILURE_COOLDOWN_MS;
		serverBackoff.set(serverName, nextBackoff);
	};
	const runGuardedServerRequest = async (serverName, request) => {
		const nowMs = Date.now();
		const backoff = serverBackoff.get(serverName);
		if (backoff?.retryAfterMs && nowMs < backoff.retryAfterMs) throw new Error(`bundle-mcp server "${serverName}" is paused after repeated tool failures; retry after ${new Date(backoff.retryAfterMs).toISOString()}`);
		try {
			const result = await request();
			serverBackoff.delete(serverName);
			return result;
		} catch (error) {
			recordServerToolFailure(serverName, nowMs);
			throw error;
		}
	};
	const failIfDisposed = () => {
		if (disposed) throw createDisposedError(params.sessionId);
	};
	const getCatalog = async () => {
		failIfDisposed();
		if (catalog) return catalog;
		if (catalogInFlight) return catalogInFlight;
		const catalogGeneration = catalogInvalidationGeneration;
		const inFlight = (async () => {
			if (Object.keys(loaded.mcpServers).length === 0) return {
				version: 1,
				generatedAt: Date.now(),
				servers: {},
				tools: []
			};
			const servers = {};
			const tools = [];
			const diagnostics = [];
			const usedServerNames = /* @__PURE__ */ new Set();
			try {
				for (const [serverName, rawServer] of Object.entries(loaded.mcpServers)) {
					failIfDisposed();
					const resolved = resolveMcpTransport(serverName, rawServer);
					if (!resolved) continue;
					const safeServerName = sanitizeServerName(serverName, usedServerNames);
					if (safeServerName !== serverName) logWarn(`bundle-mcp: server key "${serverName}" registered as "${safeServerName}" for provider-safe tool names.`);
					let session = sessions.get(serverName);
					const reusedSession = Boolean(session);
					let connected = Boolean(session);
					if (!session) {
						session = {
							serverName,
							client: new Client({
								name: "openclaw-bundle-mcp",
								version: "0.0.0"
							}, {
								jsonSchemaValidator: createBundleMcpJsonSchemaValidator(),
								listChanged: { tools: {
									autoRefresh: false,
									debounceMs: 0,
									onChanged: (error) => {
										if (error) logWarn(`bundle-mcp: failed to refresh changed tool list for server "${serverName}": ${redactErrorUrls(error)}`);
										catalogInvalidationGeneration += 1;
										catalog = null;
										catalogInFlight = void 0;
									}
								} }
							}),
							transport: resolved.transport,
							transportType: resolved.transportType,
							requestTimeoutMs: resolved.requestTimeoutMs,
							supportsParallelToolCalls: resolved.supportsParallelToolCalls,
							detachStderr: resolved.detachStderr
						};
						sessions.set(serverName, session);
					}
					try {
						failIfDisposed();
						if (!connected) {
							await connectWithTimeout(session.client, session.transport, resolved.connectionTimeoutMs);
							connected = true;
						}
						failIfDisposed();
						const capabilities = summarizeServerCapabilities(session.client.getServerCapabilities());
						const listedTools = await listAllToolsBestEffort({
							client: session.client,
							timeoutMs: getCatalogListTimeoutMs(rawServer, resolved.requestTimeoutMs),
							suppressUnsupported: Boolean(!capabilities.tools && (capabilities.resources || capabilities.prompts))
						});
						failIfDisposed();
						const selection = getMcpToolSelection(rawServer);
						const exposedTools = listedTools.filter((tool) => shouldExposeMcpTool(selection, tool.name.trim()));
						servers[serverName] = {
							serverName,
							safeServerName,
							launchSummary: resolved.description,
							toolCount: exposedTools.length,
							requestTimeoutMs: resolved.requestTimeoutMs,
							supportsParallelToolCalls: resolved.supportsParallelToolCalls,
							...capabilities.resources ? { resources: capabilities.resources } : {},
							...capabilities.prompts ? { prompts: capabilities.prompts } : {},
							...capabilities.tools ? { tools: {
								...capabilities.tools,
								...exposedTools.length !== listedTools.length ? { filteredCount: listedTools.length - exposedTools.length } : {}
							} } : {},
							...selection.include || selection.exclude ? { toolFilter: {
								...selection.include ? { include: [...selection.include] } : {},
								...selection.exclude ? { exclude: [...selection.exclude] } : {}
							} } : {}
						};
						for (const tool of exposedTools) {
							const toolName = tool.name.trim();
							if (!toolName) continue;
							tools.push({
								serverName,
								safeServerName,
								toolName,
								title: tool.title,
								description: sanitizeMcpMetadataText(tool.description),
								inputSchema: tool.inputSchema,
								fallbackDescription: `Provided by bundle MCP server "${serverName}" (${resolved.description}).`
							});
						}
					} catch (error) {
						const message = redactErrorUrls(error);
						if (!disposed) logWarn(`bundle-mcp: failed to ${reusedSession ? "refresh" : "start"} server "${serverName}" (${resolved.description}): ${message}`);
						diagnostics.push({
							serverName,
							safeServerName,
							launchSummary: resolved.description,
							message
						});
						if (!reusedSession) {
							await disposeSession(session);
							sessions.delete(serverName);
						}
						failIfDisposed();
					}
				}
				failIfDisposed();
				return {
					version: 1,
					generatedAt: Date.now(),
					servers,
					tools,
					...diagnostics.length > 0 ? { diagnostics } : {}
				};
			} catch (error) {
				await Promise.allSettled(Array.from(sessions.values(), (session) => disposeSession(session)));
				sessions.clear();
				throw error;
			}
		})();
		catalogInFlight = inFlight;
		try {
			const nextCatalog = await inFlight;
			failIfDisposed();
			if (catalogInvalidationGeneration === catalogGeneration) catalog = nextCatalog;
			return nextCatalog;
		} finally {
			if (catalogInFlight === inFlight) catalogInFlight = void 0;
		}
	};
	return {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		configFingerprint,
		createdAt,
		get lastUsedAt() {
			return lastUsedAt;
		},
		get activeLeases() {
			return activeLeases;
		},
		acquireLease() {
			activeLeases += 1;
			let released = false;
			return () => {
				if (released) return;
				released = true;
				activeLeases = Math.max(0, activeLeases - 1);
			};
		},
		getCatalog,
		/** Synchronous catalog snapshot only; must not connect transports or issue tools/list. */
		peekCatalog() {
			return catalog;
		},
		markUsed() {
			lastUsedAt = Date.now();
		},
		async callTool(serverName, toolName, input) {
			failIfDisposed();
			await getCatalog();
			const session = sessions.get(serverName);
			if (!session) throw new Error(`bundle-mcp server "${serverName}" is not connected`);
			return await runGuardedServerRequest(serverName, async () => await session.client.callTool({
				name: toolName,
				arguments: isMcpConfigRecord(input) ? input : {}
			}, void 0, { timeout: session.requestTimeoutMs }));
		},
		async listResources(serverName) {
			failIfDisposed();
			await getCatalog();
			const session = sessions.get(serverName);
			if (!session) throw new Error(`bundle-mcp server "${serverName}" is not connected`);
			return await runGuardedServerRequest(serverName, async () => listAllResources(session.client, session.requestTimeoutMs));
		},
		async readResource(serverName, uri) {
			failIfDisposed();
			await getCatalog();
			const session = sessions.get(serverName);
			if (!session) throw new Error(`bundle-mcp server "${serverName}" is not connected`);
			return await runGuardedServerRequest(serverName, async () => await session.client.readResource({ uri }, { timeout: session.requestTimeoutMs }));
		},
		async listPrompts(serverName) {
			failIfDisposed();
			await getCatalog();
			const session = sessions.get(serverName);
			if (!session) throw new Error(`bundle-mcp server "${serverName}" is not connected`);
			return await runGuardedServerRequest(serverName, async () => listAllPrompts(session.client, session.requestTimeoutMs));
		},
		async getPrompt(serverName, name, args) {
			failIfDisposed();
			await getCatalog();
			const session = sessions.get(serverName);
			if (!session) throw new Error(`bundle-mcp server "${serverName}" is not connected`);
			return await runGuardedServerRequest(serverName, async () => await session.client.getPrompt({
				name,
				...args ? { arguments: args } : {}
			}, { timeout: session.requestTimeoutMs }));
		},
		async dispose() {
			if (disposed) return;
			disposed = true;
			catalog = null;
			catalogInFlight = void 0;
			const sessionsToClose = Array.from(sessions.values());
			sessions.clear();
			await Promise.allSettled(sessionsToClose.map((session) => disposeSession(session)));
		}
	};
}
function createSessionMcpRuntimeManager(opts = {}) {
	const runtimesBySessionId = /* @__PURE__ */ new Map();
	const sessionIdBySessionKey = /* @__PURE__ */ new Map();
	const idleTtlMsBySessionId = /* @__PURE__ */ new Map();
	const createRuntime = opts.createRuntime ?? createSessionMcpRuntime;
	const now = opts.now ?? Date.now;
	const createInFlight = /* @__PURE__ */ new Map();
	const idleSweepIntervalMs = opts.idleSweepIntervalMs ?? SESSION_MCP_RUNTIME_SWEEP_INTERVAL_MS;
	let idleSweepTimer;
	let idleSweepInFlight;
	const forgetSessionKeysForSessionId = (sessionId) => {
		for (const [sessionKey, mappedSessionId] of sessionIdBySessionKey.entries()) if (mappedSessionId === sessionId) sessionIdBySessionKey.delete(sessionKey);
	};
	const sweepIdleRuntimes = async () => {
		const nowMs = now();
		const expired = [];
		for (const [sessionId, runtime] of runtimesBySessionId.entries()) {
			const idleTtlMs = idleTtlMsBySessionId.get(sessionId) ?? DEFAULT_SESSION_MCP_RUNTIME_IDLE_TTL_MS;
			if (idleTtlMs <= 0 || (runtime.activeLeases ?? 0) > 0) continue;
			if (nowMs - runtime.lastUsedAt < idleTtlMs) continue;
			runtimesBySessionId.delete(sessionId);
			idleTtlMsBySessionId.delete(sessionId);
			forgetSessionKeysForSessionId(sessionId);
			expired.push(runtime);
		}
		await Promise.allSettled(expired.map((runtime) => runtime.dispose()));
		return expired.length;
	};
	const queueIdleSweep = () => {
		if (idleSweepInFlight) return;
		idleSweepInFlight = sweepIdleRuntimes().then(() => void 0).catch((error) => {
			logWarn(`bundle-mcp: idle runtime sweep failed: ${String(error)}`);
		}).finally(() => {
			idleSweepInFlight = void 0;
		});
	};
	const ensureIdleSweepTimer = () => {
		if (opts.enableIdleSweepTimer === false || idleSweepIntervalMs <= 0 || idleSweepTimer) return;
		idleSweepTimer = setInterval(queueIdleSweep, idleSweepIntervalMs);
		idleSweepTimer.unref?.();
	};
	const clearIdleSweepTimer = () => {
		if (!idleSweepTimer) return;
		clearInterval(idleSweepTimer);
		idleSweepTimer = void 0;
	};
	return {
		async getOrCreate(params) {
			const idleTtlMs = resolveSessionMcpRuntimeIdleTtlMs(params.cfg);
			if (runtimesBySessionId.has(params.sessionId)) idleTtlMsBySessionId.set(params.sessionId, idleTtlMs);
			await sweepIdleRuntimes();
			if (idleTtlMs > 0) ensureIdleSweepTimer();
			if (params.sessionKey) sessionIdBySessionKey.set(params.sessionKey, params.sessionId);
			const { fingerprint: nextFingerprint } = loadSessionMcpConfig({
				workspaceDir: params.workspaceDir,
				cfg: params.cfg,
				logDiagnostics: false
			});
			const existing = runtimesBySessionId.get(params.sessionId);
			if (existing) if (existing.workspaceDir !== params.workspaceDir || existing.configFingerprint !== nextFingerprint) {
				runtimesBySessionId.delete(params.sessionId);
				await existing.dispose();
			} else {
				existing.markUsed();
				idleTtlMsBySessionId.set(params.sessionId, idleTtlMs);
				return existing;
			}
			const inFlight = createInFlight.get(params.sessionId);
			if (inFlight) {
				if (inFlight.workspaceDir === params.workspaceDir && inFlight.configFingerprint === nextFingerprint) return inFlight.promise;
				createInFlight.delete(params.sessionId);
				const staleRuntime = await inFlight.promise.catch(() => void 0);
				runtimesBySessionId.delete(params.sessionId);
				idleTtlMsBySessionId.delete(params.sessionId);
				await staleRuntime?.dispose();
			}
			const created = Promise.resolve(createRuntime({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				workspaceDir: params.workspaceDir,
				cfg: params.cfg,
				configFingerprint: nextFingerprint
			})).then((runtime) => {
				runtime.markUsed();
				runtimesBySessionId.set(params.sessionId, runtime);
				idleTtlMsBySessionId.set(params.sessionId, idleTtlMs);
				return runtime;
			});
			createInFlight.set(params.sessionId, {
				promise: created,
				workspaceDir: params.workspaceDir,
				configFingerprint: nextFingerprint
			});
			try {
				return await created;
			} finally {
				createInFlight.delete(params.sessionId);
			}
		},
		bindSessionKey(sessionKey, sessionId) {
			sessionIdBySessionKey.set(sessionKey, sessionId);
		},
		resolveSessionId(sessionKey) {
			return sessionIdBySessionKey.get(sessionKey);
		},
		/** Synchronous lookup only; must not create runtimes or connect transports. */
		peekSession(params) {
			const sessionId = params.sessionId ?? (params.sessionKey ? sessionIdBySessionKey.get(params.sessionKey) : void 0);
			return sessionId ? runtimesBySessionId.get(sessionId) : void 0;
		},
		async disposeSession(sessionId) {
			const inFlight = createInFlight.get(sessionId);
			createInFlight.delete(sessionId);
			let runtime = runtimesBySessionId.get(sessionId);
			if (!runtime && inFlight) runtime = await inFlight.promise.catch(() => void 0);
			runtimesBySessionId.delete(sessionId);
			idleTtlMsBySessionId.delete(sessionId);
			if (!runtime) {
				forgetSessionKeysForSessionId(sessionId);
				return;
			}
			forgetSessionKeysForSessionId(sessionId);
			await runtime.dispose();
		},
		async disposeAll() {
			clearIdleSweepTimer();
			const inFlightRuntimes = Array.from(createInFlight.values());
			createInFlight.clear();
			const runtimes = Array.from(runtimesBySessionId.values());
			runtimesBySessionId.clear();
			sessionIdBySessionKey.clear();
			idleTtlMsBySessionId.clear();
			const lateRuntimes = await Promise.all(inFlightRuntimes.map(async ({ promise }) => await promise.catch(() => void 0)));
			const allRuntimes = new Set(runtimes);
			for (const runtime of lateRuntimes) if (runtime) allRuntimes.add(runtime);
			await Promise.allSettled(Array.from(allRuntimes, (runtime) => runtime.dispose()));
		},
		sweepIdleRuntimes,
		listSessionIds() {
			return Array.from(runtimesBySessionId.keys());
		}
	};
}
function getSessionMcpRuntimeManager() {
	return resolveGlobalSingleton(SESSION_MCP_RUNTIME_MANAGER_KEY, createSessionMcpRuntimeManager);
}
async function getOrCreateSessionMcpRuntime(params) {
	return await getSessionMcpRuntimeManager().getOrCreate(params);
}
/** Looks up an existing session MCP runtime without creating it or connecting transports. */
function peekSessionMcpRuntime(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	return getSessionMcpRuntimeManager().peekSession({
		...sessionId ? { sessionId } : {},
		...sessionKey ? { sessionKey } : {}
	});
}
async function disposeSessionMcpRuntime(sessionId) {
	await getSessionMcpRuntimeManager().disposeSession(sessionId);
}
async function retireSessionMcpRuntime(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	if (!sessionId) return false;
	try {
		await disposeSessionMcpRuntime(sessionId);
		return true;
	} catch (error) {
		params.onError?.(error, sessionId, params.reason);
		return false;
	}
}
async function retireSessionMcpRuntimeForSessionKey(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return false;
	return await retireSessionMcpRuntime({
		sessionId: getSessionMcpRuntimeManager().resolveSessionId(sessionKey),
		reason: params.reason,
		onError: params.onError
	});
}
async function disposeAllSessionMcpRuntimes() {
	await getSessionMcpRuntimeManager().disposeAll();
}
const testing = {
	createSessionMcpRuntimeManager,
	async resetSessionMcpRuntimeManager() {
		await disposeAllSessionMcpRuntimes();
		setBundleMcpCatalogListTimeoutMsForTest();
	},
	getCachedSessionIds() {
		return getSessionMcpRuntimeManager().listSessionIds();
	},
	setBundleMcpCatalogListTimeoutMsForTest,
	resolveSessionMcpRuntimeIdleTtlMs
};
//#endregion
export { withSameOriginMcpHttpHeaders as _, getOrCreateSessionMcpRuntime as a, resolveSessionMcpConfigSummary as c, testing as d, resolveMcpTransportConfig as f, buildMcpHttpFetch as g, runMcpOAuthLogin as h, disposeSessionMcpRuntime as i, retireSessionMcpRuntime as l, readMcpOAuthCredentialsStatus as m, createSessionMcpRuntime as n, getSessionMcpRuntimeManager as o, clearMcpOAuthCredentials as p, disposeAllSessionMcpRuntimes as r, peekSessionMcpRuntime as s, createBundleMcpJsonSchemaValidator as t, retireSessionMcpRuntimeForSessionKey as u, withoutMcpAuthorizationHeader as v, loadEmbeddedAgentMcpConfig as y };
