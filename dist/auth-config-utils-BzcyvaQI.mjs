import { g as resolveSecretInputRef, o as hasConfiguredSecretInput } from "./types.secrets-DsPRn9Dz.mjs";
import { r as resolveCanonicalRequiredConfiguredSecretRefInputString } from "./resolve-configured-secret-input-string-DYW8NiQl.mjs";
import { a as readGatewaySecretInputValue, n as assignResolvedGatewaySecretInput } from "./secret-input-paths-C2PsvPdU.mjs";
//#region src/gateway/auth-config-utils.ts
/** Check whether a local Gateway auth input is configured directly or through defaults. */
function hasConfiguredGatewayAuthSecretInput(cfg, path) {
	return hasConfiguredSecretInput(readGatewaySecretInputValue(cfg, path), cfg.secrets?.defaults);
}
/** Decide whether a token/password secret ref can be active for the configured auth mode. */
function shouldResolveGatewayAuthSecretRef(params, path) {
	const isTokenPath = path === "gateway.auth.token";
	if (isTokenPath ? params.hasTokenOverride : params.hasPasswordOverride) return false;
	if (params.mode === (isTokenPath ? "token" : "password")) return true;
	if (params.mode === "trusted-proxy") return !isTokenPath;
	if (params.mode === "token" || params.mode === "password" || params.mode === "none") return false;
	return isTokenPath ? !(params.hasPasswordOverride || params.hasPasswordFallback) : !(params.hasTokenOverride || params.hasTokenFallback);
}
function hasActiveExecGatewayAuthSecretRef(params, path) {
	if (!shouldResolveGatewayAuthSecretRef(params, path)) return false;
	const { ref } = resolveSecretInputRef({
		value: readGatewaySecretInputValue(params.cfg, path),
		defaults: params.cfg.secrets?.defaults
	});
	return ref?.source === "exec";
}
/** Check whether active local Gateway auth refs can be read without invoking exec providers. */
function canMaterializeGatewayAuthSecretRefsWithoutExec(params) {
	return !(hasActiveExecGatewayAuthSecretRef(params, "gateway.auth.token") || hasActiveExecGatewayAuthSecretRef(params, "gateway.auth.password"));
}
async function resolveGatewayAuthSecretRefValue(params, path) {
	if (!shouldResolveGatewayAuthSecretRef(params, path)) return;
	const value = await resolveCanonicalRequiredConfiguredSecretRefInputString({
		config: params.cfg,
		env: params.env,
		value: readGatewaySecretInputValue(params.cfg, path),
		path
	});
	if (!value) return;
	return value;
}
/** Resolve the Gateway auth token ref only when token auth can use it. */
async function resolveGatewayTokenSecretRefValue(params) {
	return resolveGatewayAuthSecretRefValue(params, "gateway.auth.token");
}
/** Resolve the Gateway auth password ref only when password auth can use it. */
async function resolveGatewayPasswordSecretRefValue(params) {
	return resolveGatewayAuthSecretRefValue(params, "gateway.auth.password");
}
async function resolveGatewayAuthSecretRef(params, path) {
	const cfg = params.cfg;
	const value = await resolveGatewayAuthSecretRefValue(params, path);
	if (!value) return cfg;
	const nextConfig = structuredClone(cfg);
	nextConfig.gateway ??= {};
	nextConfig.gateway.auth ??= {};
	assignResolvedGatewaySecretInput({
		config: nextConfig,
		path,
		value
	});
	return nextConfig;
}
/** Materialize active local Gateway auth secret refs on a cloned config. */
async function materializeGatewayAuthSecretRefs(params) {
	const cfgWithToken = await resolveGatewayAuthSecretRef(params, "gateway.auth.token");
	return await resolveGatewayAuthSecretRef({
		...params,
		cfg: cfgWithToken,
		hasTokenFallback: params.hasTokenFallback || hasConfiguredGatewayAuthSecretInput(cfgWithToken, "gateway.auth.token")
	}, "gateway.auth.password");
}
//#endregion
export { resolveGatewayTokenSecretRefValue as a, resolveGatewayPasswordSecretRefValue as i, hasConfiguredGatewayAuthSecretInput as n, materializeGatewayAuthSecretRefs as r, canMaterializeGatewayAuthSecretRefsWithoutExec as t };
