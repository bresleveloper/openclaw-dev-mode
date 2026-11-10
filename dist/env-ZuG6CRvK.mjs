import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import process$1 from "node:process";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { createAmbientNodeProxyAgent } from "@openclaw/proxyline";
//#region src/proxy-capture/paths.ts
function resolveDebugProxyRootDir(env = process.env) {
	return path.join(resolveStateDir(env), "debug-proxy");
}
/** @deprecated Capture storage now lives in the shared state database. */
function resolveDebugProxyDbPath(env = process.env) {
	return path.join(resolveDebugProxyRootDir(env), "capture.sqlite");
}
/** @deprecated Capture payloads now live in the shared state database. */
function resolveDebugProxyBlobDir(env = process.env) {
	return path.join(resolveDebugProxyRootDir(env), "blobs");
}
function resolveDebugProxyCertDir(env = process.env) {
	return path.join(resolveDebugProxyRootDir(env), "certs");
}
//#endregion
//#region src/proxy-capture/env.ts
const OPENCLAW_DEBUG_PROXY_ENABLED = "OPENCLAW_DEBUG_PROXY_ENABLED";
const OPENCLAW_DEBUG_PROXY_URL = "OPENCLAW_DEBUG_PROXY_URL";
const OPENCLAW_DEBUG_PROXY_CERT_DIR = "OPENCLAW_DEBUG_PROXY_CERT_DIR";
const OPENCLAW_DEBUG_PROXY_SESSION_ID = "OPENCLAW_DEBUG_PROXY_SESSION_ID";
const OPENCLAW_DEBUG_PROXY_REQUIRE = "OPENCLAW_DEBUG_PROXY_REQUIRE";
const DEBUG_PROXY_CHILD_CAPTURE_USERNAME = "openclaw-capture";
function readDebugProxyChildEndpoint(env = process$1.env) {
	const endpoint = URL.parse(env[OPENCLAW_DEBUG_PROXY_URL]?.trim() ?? "");
	return endpoint?.username === "openclaw-capture" ? endpoint : void 0;
}
let cachedImplicitSessionId;
function isTruthy(value) {
	return value === "1" || value === "true" || value === "yes" || value === "on";
}
function resolveDebugProxySettings(env = process$1.env) {
	const enabled = isTruthy(env[OPENCLAW_DEBUG_PROXY_ENABLED]);
	const explicitSessionId = env[OPENCLAW_DEBUG_PROXY_SESSION_ID]?.trim() || void 0;
	const childEndpoint = readDebugProxyChildEndpoint(env);
	const sessionId = explicitSessionId ?? (cachedImplicitSessionId ??= randomUUID());
	return {
		enabled,
		required: isTruthy(env[OPENCLAW_DEBUG_PROXY_REQUIRE]),
		proxyUrl: childEndpoint?.origin ?? (env[OPENCLAW_DEBUG_PROXY_URL]?.trim() || void 0),
		dbPath: resolveDebugProxyDbPath(env),
		blobDir: resolveDebugProxyBlobDir(env),
		certDir: env[OPENCLAW_DEBUG_PROXY_CERT_DIR]?.trim() || resolveDebugProxyCertDir(env),
		sessionId,
		sourceProcess: "openclaw"
	};
}
function resolveEnabledDebugProxySettings(resolved) {
	if (!(resolved?.enabled ?? isTruthy(process$1.env[OPENCLAW_DEBUG_PROXY_ENABLED]))) return;
	return resolved ?? resolveDebugProxySettings();
}
function applyDebugProxyEnv(env, params) {
	return {
		...env,
		[OPENCLAW_DEBUG_PROXY_ENABLED]: "1",
		[OPENCLAW_DEBUG_PROXY_REQUIRE]: "1",
		[OPENCLAW_DEBUG_PROXY_URL]: params.proxyUrl,
		[OPENCLAW_DEBUG_PROXY_CERT_DIR]: params.certDir ?? resolveDebugProxyCertDir(env),
		[OPENCLAW_DEBUG_PROXY_SESSION_ID]: params.sessionId,
		HTTP_PROXY: params.proxyUrl,
		HTTPS_PROXY: params.proxyUrl,
		ALL_PROXY: params.proxyUrl
	};
}
function createDebugProxyWebSocketAgent(settings) {
	if (!settings.enabled || !settings.proxyUrl) return;
	return createAmbientNodeProxyAgent({
		protocol: "https",
		env: {
			HTTP_PROXY: settings.proxyUrl,
			HTTPS_PROXY: settings.proxyUrl,
			ALL_PROXY: void 0,
			NO_PROXY: void 0,
			http_proxy: void 0,
			https_proxy: void 0,
			all_proxy: void 0,
			no_proxy: void 0
		}
	});
}
function resolveEffectiveDebugProxyUrl(configuredProxyUrl) {
	const explicit = configuredProxyUrl?.trim();
	if (explicit) return explicit;
	return resolveEnabledDebugProxySettings()?.proxyUrl;
}
//#endregion
export { resolveDebugProxySettings as a, readDebugProxyChildEndpoint as i, applyDebugProxyEnv as n, resolveEffectiveDebugProxyUrl as o, createDebugProxyWebSocketAgent as r, resolveEnabledDebugProxySettings as s, DEBUG_PROXY_CHILD_CAPTURE_USERNAME as t };
