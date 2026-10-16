import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { P as resolvePositiveTimerTimeoutMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { a as redactSensitiveUrl, o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BnHakqqk.mjs";
import { t as createDedupeCache } from "./dedupe-qhwfyIea.mjs";
import { i as resolveConfiguredMcpTransport } from "./mcp-config-normalize-DQmvZkAl.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { n as resolveStdioMcpServerLaunchConfig, r as toMcpStringRecord, t as describeStdioMcpServerLaunchConfig } from "./mcp-stdio-DQXz-AwW.mjs";
//#region src/agents/mcp-http.ts
/**
* HTTP MCP launch config normalization.
*
* MCP server setup uses this to validate SSE/streamable HTTP server records,
* sanitize headers, and redact sensitive URLs in diagnostics.
*/
/** Normalizes an HTTP MCP server config record into a launchable transport config. */
function resolveHttpMcpServerLaunchConfig(raw, options) {
	if (!isRecord(raw)) return {
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
	if (raw.headers !== void 0 && raw.headers !== null) {
		if (!isRecord(raw.headers)) options?.onMalformedHeaders?.(raw.headers);
		else headers = toMcpStringRecord(raw.headers, { onDroppedEntry: options?.onDroppedHeader });
	}
	return {
		ok: true,
		config: {
			transportType: options?.transportType ?? "sse",
			url,
			headers
		}
	};
}
//#endregion
//#region src/agents/mcp-transport-config.ts
/**
* Resolves MCP transport command, environment, and timeout configuration.
*/
const DEFAULT_CONNECTION_TIMEOUT_MS = 3e4;
const DEFAULT_REQUEST_TIMEOUT_MS = 6e4;
const warnedDroppedStdioEnvKeys = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
function warnDroppedStdioEnvOnce(serverName, key) {
	const logServerName = sanitizeForLog(serverName);
	const logKey = sanitizeForLog(key);
	if (warnedDroppedStdioEnvKeys.check(JSON.stringify([serverName, key]))) return;
	logWarn(`bundle-mcp: server "${logServerName}": env "${logKey}" is blocked for stdio startup safety and was ignored.`);
}
function getConnectionTimeoutMs(rawServer) {
	return resolvePositiveTimerTimeoutMs(asOptionalObjectRecord(rawServer)?.connectionTimeoutMs, DEFAULT_CONNECTION_TIMEOUT_MS);
}
function resolveMcpRequestTimeoutMs(rawServer, fallbackMs = DEFAULT_REQUEST_TIMEOUT_MS) {
	return clampPositiveTimerTimeoutMs(asOptionalObjectRecord(rawServer)?.requestTimeoutMs) ?? resolvePositiveTimerTimeoutMs(fallbackMs, DEFAULT_REQUEST_TIMEOUT_MS);
}
function getBooleanField(rawServer, key) {
	const value = asOptionalObjectRecord(rawServer)?.[key];
	return typeof value === "boolean" ? value : void 0;
}
function resolveHttpTransportConfig(serverName, rawServer, transportType, logWarnings) {
	const launch = resolveHttpMcpServerLaunchConfig(rawServer, logWarnings ? {
		transportType,
		onDroppedHeader: (key) => {
			logWarn(`bundle-mcp: server "${serverName}": header "${key}" has an unsupported value type and was ignored.`);
		},
		onMalformedHeaders: () => {
			logWarn(`bundle-mcp: server "${serverName}": "headers" must be a JSON object; the value was ignored.`);
		}
	} : { transportType });
	if (!launch.ok) return null;
	const record = asOptionalObjectRecord(rawServer);
	const oauth = record?.oauth;
	const sslVerify = getBooleanField(rawServer, "sslVerify");
	const clientCert = normalizeOptionalString(record?.clientCert);
	const clientKey = normalizeOptionalString(record?.clientKey);
	return {
		kind: "http",
		transportType: launch.config.transportType,
		url: launch.config.url,
		headers: launch.config.headers,
		...record?.auth === "oauth" ? { auth: "oauth" } : {},
		...isRecord(oauth) ? { oauth } : {},
		...sslVerify !== void 0 ? { sslVerify } : {},
		...clientCert ? { clientCert } : {},
		...clientKey ? { clientKey } : {},
		description: redactSensitiveUrl(launch.config.url),
		connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
		requestTimeoutMs: resolveMcpRequestTimeoutMs(rawServer),
		supportsParallelToolCalls: getBooleanField(rawServer, "supportsParallelToolCalls") ?? false
	};
}
/** Resolve one MCP server's launch transport config, or null when unsupported. */
function resolveMcpTransportConfig(serverName, rawServer, options) {
	const logWarnings = options?.logWarnings !== false;
	const effectiveTransport = resolveConfiguredMcpTransport(rawServer);
	const stdioLaunch = resolveStdioMcpServerLaunchConfig(rawServer, logWarnings ? { onDroppedEnv: (key) => {
		warnDroppedStdioEnvOnce(serverName, key);
	} } : void 0);
	if (stdioLaunch.ok) return {
		kind: "stdio",
		transportType: "stdio",
		command: stdioLaunch.config.command,
		args: stdioLaunch.config.args,
		env: stdioLaunch.config.env,
		cwd: stdioLaunch.config.cwd,
		description: describeStdioMcpServerLaunchConfig(stdioLaunch.config),
		connectionTimeoutMs: getConnectionTimeoutMs(rawServer),
		requestTimeoutMs: resolveMcpRequestTimeoutMs(rawServer),
		supportsParallelToolCalls: getBooleanField(rawServer, "supportsParallelToolCalls") ?? false
	};
	if (effectiveTransport && effectiveTransport !== "sse" && effectiveTransport !== "streamable-http") {
		if (logWarnings) logWarn(`bundle-mcp: skipped server "${sanitizeForLog(serverName)}" because transport "${sanitizeForLog(effectiveTransport)}" is not supported.`);
		return null;
	}
	const httpTransport = resolveHttpTransportConfig(serverName, rawServer, effectiveTransport === "streamable-http" ? "streamable-http" : "sse", logWarnings);
	if (httpTransport) return httpTransport;
	const httpLaunch = resolveHttpMcpServerLaunchConfig(rawServer);
	const httpReason = httpLaunch.ok ? "not an HTTP MCP server" : httpLaunch.reason;
	if (logWarnings) logWarn(`bundle-mcp: skipped server "${sanitizeForLog(serverName)}" because ${stdioLaunch.reason} and ${httpReason}.`);
	return null;
}
//#endregion
export { resolveMcpTransportConfig as n, resolveMcpRequestTimeoutMs as t };
