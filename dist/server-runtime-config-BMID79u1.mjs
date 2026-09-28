import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { E as isUnsafeGatewayTailscaleNoAuth, T as formatUnsafeGatewayTailscaleNoAuthMessage } from "./validation-core-DwJVlxTe.mjs";
import { f as isValidIPv4, g as resolveGatewayBindHost, s as isLoopbackHost, t as defaultGatewayBindMode } from "./net-DU4aWKLv.mjs";
import { n as resolveGatewayAuth } from "./auth-resolve-BeCTtDNQ.mjs";
import { t as assertGatewayAuthConfigured } from "./auth-CRxiLJL8.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { r as mergeGatewayTailscaleConfig } from "./startup-auth-Cnh-psTn.mjs";
import { t as commitHooksConfigReload, y as resolveHooksConfig } from "./hooks-BiKk5XXX.mjs";
//#region src/gateway/env-deprecation.ts
const LEGACY_ENV_PREFIXES = ["CLAWDBOT_", "MOLTBOT_"];
let warned = false;
/** Emits a one-time warning when ignored legacy CLAWDBOT_/MOLTBOT_ env vars are present. */
function warnLegacyOpenClawEnvVars(env = process.env) {
	if (warned || isVitestRuntimeEnv(env)) return;
	const prefixCounts = /* @__PURE__ */ new Map();
	for (const key of Object.keys(env)) {
		const prefix = LEGACY_ENV_PREFIXES.find((candidate) => key.startsWith(candidate));
		if (prefix) prefixCounts.set(prefix, (prefixCounts.get(prefix) ?? 0) + 1);
	}
	const legacyVarCount = [...prefixCounts.values()].reduce((total, count) => total + count, 0);
	if (legacyVarCount === 0) return;
	const detectedPrefixes = LEGACY_ENV_PREFIXES.filter((prefix) => prefixCounts.has(prefix)).map((prefix) => `${prefix}*`).join(", ");
	process.emitWarning([`Legacy ${detectedPrefixes} environment variables were detected (${legacyVarCount} total), but OpenClaw only reads OPENCLAW_* names now.`, "Rename them by replacing the legacy prefix with OPENCLAW_; the old names are ignored."].join("\n"), {
		code: "OPENCLAW_LEGACY_ENV_VARS",
		type: "DeprecationWarning"
	});
	warned = true;
}
//#endregion
//#region src/gateway/server-runtime-config.ts
const GATEWAY_EFFECTIVE_CONFIG_CONFLICT_CODE = "GATEWAY_EFFECTIVE_CONFIG_CONFLICT";
/**
* The effective bind/auth/Tailscale combination (after CLI and service overrides are
* applied) is invalid. A supervisor restart cannot fix this without operator action, so
* callers must classify it the same as a persisted-config validation failure rather than
* a transient startup error eligible for restart.
*/
var GatewayEffectiveConfigConflictError = class extends Error {
	constructor(message) {
		super(message);
		this.code = GATEWAY_EFFECTIVE_CONFIG_CONFLICT_CODE;
		this.name = "GatewayEffectiveConfigConflictError";
	}
};
function isGatewayEffectiveConfigConflictError(error) {
	return error instanceof GatewayEffectiveConfigConflictError || error !== null && typeof error === "object" && "code" in error && error.code === GATEWAY_EFFECTIVE_CONFIG_CONFLICT_CODE;
}
/** Startup and reload validate the same security policy against the serving listener. */
function assertGatewayRuntimeSecurityConfig(params) {
	const { cfg, bindHost, controlUiEnabled, resolvedAuth, tailscaleMode } = params;
	const authMode = resolvedAuth.mode;
	const hasSharedSecret = authMode === "token" && Boolean(resolvedAuth.token?.trim()) || authMode === "password" && Boolean(resolvedAuth.password?.trim());
	const controlUiAllowedOrigins = (cfg.gateway?.controlUi?.allowedOrigins ?? []).map((value) => value.trim()).filter(Boolean);
	const dangerouslyAllowHostHeaderOriginFallback = cfg.gateway?.controlUi?.dangerouslyAllowHostHeaderOriginFallback === true;
	assertGatewayAuthConfigured(resolvedAuth, cfg.gateway?.auth);
	if (tailscaleMode === "funnel" && authMode !== "password") throw new GatewayEffectiveConfigConflictError("tailscale funnel requires gateway auth mode=password (set gateway.auth.password or OPENCLAW_GATEWAY_PASSWORD)");
	if (isUnsafeGatewayTailscaleNoAuth({
		authMode,
		tailscaleMode
	})) throw new GatewayEffectiveConfigConflictError(formatUnsafeGatewayTailscaleNoAuthMessage(tailscaleMode));
	if (tailscaleMode !== "off" && !isLoopbackHost(bindHost)) throw new GatewayEffectiveConfigConflictError("tailscale serve/funnel requires gateway bind=loopback (127.0.0.1)");
	if (!isLoopbackHost(bindHost) && !hasSharedSecret && authMode !== "trusted-proxy") throw new GatewayEffectiveConfigConflictError(`refusing to bind gateway to ${bindHost}:${params.port} without auth (set gateway.auth.token/password, or set OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD; legacy CLAWDBOT_* and MOLTBOT_* environment variables are ignored)`);
	if (controlUiEnabled && !isLoopbackHost(bindHost) && controlUiAllowedOrigins.length === 0 && !dangerouslyAllowHostHeaderOriginFallback) throw new GatewayEffectiveConfigConflictError("non-loopback Control UI requires gateway.controlUi.allowedOrigins (set explicit origins), or set gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback=true to use Host-header origin fallback mode");
	if (authMode === "trusted-proxy" && !cfg.gateway?.trustedProxies?.length) throw new GatewayEffectiveConfigConflictError("gateway auth mode=trusted-proxy requires gateway.trustedProxies to be configured with at least one proxy IP");
}
/** Resolves bind, auth, HTTP, Tailscale, and hook settings for one gateway start. */
async function resolveGatewayRuntimeConfig(params) {
	warnLegacyOpenClawEnvVars();
	const tailscaleModeEarly = (params.tailscale?.mode ?? params.cfg.gateway?.tailscale?.mode) || "off";
	const bindMode = params.bind ?? params.cfg.gateway?.bind ?? (tailscaleModeEarly !== "off" ? "loopback" : defaultGatewayBindMode());
	const customBindHost = params.cfg.gateway?.customBindHost;
	const bindHost = params.host ?? await resolveGatewayBindHost(bindMode, customBindHost);
	if (bindMode === "loopback" && !isLoopbackHost(bindHost)) throw new Error(`gateway bind=loopback resolved to non-loopback host ${bindHost}; refusing fallback to a network bind`);
	if (bindMode === "tailnet" && bindHost === "0.0.0.0") throw new Error("gateway bind=tailnet could not resolve a Tailscale or loopback address; refusing wildcard fallback");
	if (bindMode === "custom") {
		const configuredCustomBindHost = customBindHost?.trim();
		if (!configuredCustomBindHost) throw new Error("gateway.bind=custom requires gateway.customBindHost");
		if (!isValidIPv4(configuredCustomBindHost)) throw new Error(`gateway.bind=custom requires a valid IPv4 customBindHost (got ${configuredCustomBindHost})`);
		if (bindHost !== configuredCustomBindHost) throw new Error(`gateway bind=custom requested ${configuredCustomBindHost} but resolved ${bindHost}; refusing fallback`);
	}
	const controlUiEnabled = params.controlUiEnabled ?? params.cfg.gateway?.controlUi?.enabled ?? true;
	const controlUiBasePath = normalizeControlUiBasePath(params.cfg.gateway?.controlUi?.basePath);
	const controlUiRootRaw = params.cfg.gateway?.controlUi?.root;
	const controlUiRoot = typeof controlUiRootRaw === "string" && controlUiRootRaw.trim().length > 0 ? controlUiRootRaw.trim() : void 0;
	const tailscaleBase = params.cfg.gateway?.tailscale ?? {};
	const tailscaleOverrides = params.tailscale ?? {};
	const tailscaleConfig = mergeGatewayTailscaleConfig(tailscaleBase, tailscaleOverrides);
	const tailscaleMode = tailscaleConfig.mode ?? "off";
	const resolvedAuth = resolveGatewayAuth({
		authConfig: params.cfg.gateway?.auth,
		authOverride: params.auth,
		env: process.env,
		tailscaleMode
	});
	const authMode = resolvedAuth.mode;
	const hooksConfig = resolveHooksConfig(params.cfg);
	const runtimeConfig = {
		bindHost,
		controlUiEnabled,
		controlUiBasePath,
		controlUiRoot,
		resolvedAuth,
		authMode,
		tailscaleConfig,
		tailscaleMode,
		hooksConfig
	};
	assertGatewayRuntimeSecurityConfig({
		...runtimeConfig,
		cfg: params.cfg,
		port: params.port
	});
	if (hooksConfig) commitHooksConfigReload();
	return runtimeConfig;
}
//#endregion
export { isGatewayEffectiveConfigConflictError as n, resolveGatewayRuntimeConfig as r, assertGatewayRuntimeSecurityConfig as t };
