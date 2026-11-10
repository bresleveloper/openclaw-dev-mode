import { g as resolveSecretInputRef, o as hasConfiguredSecretInput } from "./types.secrets-Dgbd2kyP.mjs";
import { r as resolveCanonicalRequiredConfiguredSecretRefInputString } from "./resolve-configured-secret-input-string-VGELFJX8.mjs";
import { a as readGatewaySecretInputValue, n as assignResolvedGatewaySecretInput } from "./secret-input-paths-CLN9wOP7.mjs";
//#region src/gateway/auth-config-utils.ts
function hasConfiguredGatewayAuthSecretInput(cfg, path) {
	return hasConfiguredSecretInput(readGatewaySecretInputValue(cfg, path), cfg.secrets?.defaults);
}
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
function canMaterializeGatewayAuthSecretRefsWithoutExec(params) {
	return !(hasActiveExecGatewayAuthSecretRef(params, "gateway.auth.token") || hasActiveExecGatewayAuthSecretRef(params, "gateway.auth.password"));
}
async function resolveGatewayAuthSecretRefValue(params, path) {
	if (!shouldResolveGatewayAuthSecretRef(params, path)) return;
	return await resolveCanonicalRequiredConfiguredSecretRefInputString({
		config: params.cfg,
		env: params.env,
		value: readGatewaySecretInputValue(params.cfg, path),
		path
	}) || void 0;
}
async function resolveGatewayTokenSecretRefValue(params) {
	return resolveGatewayAuthSecretRefValue(params, "gateway.auth.token");
}
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
