import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { g as resolveSecretInputRef, o as hasConfiguredSecretInput } from "./types.secrets-Dgbd2kyP.mjs";
import { n as containsEnvVarReference } from "./env-substitution-4XQMuGXB.mjs";
import { c as getConfigResolutionFacts, s as getAuthoredConfigSecretRef, u as hasUnresolvedConfigPath } from "./resolution-facts-D_pto3MV.mjs";
//#region src/gateway/credential-planner.ts
const trimToUndefined = normalizeOptionalString;
/**
* Like trimToUndefined but also rejects unresolved env var placeholders (e.g. `${VAR}`).
* This prevents literal placeholder strings like `${OPENCLAW_GATEWAY_TOKEN}` from being
* accepted as valid credentials when the referenced env var is missing.
* Note: legitimate credential values containing literal `${UPPER_CASE}` patterns will
* also be rejected, but this is an extremely unlikely edge case.
*/
function trimCredentialToUndefined(value) {
	const trimmed = trimToUndefined(value);
	if (trimmed && containsEnvVarReference(trimmed)) return;
	return trimmed;
}
function createGatewayCredentialPlan(params) {
	const env = params.env ?? process.env;
	const gateway = params.config.gateway;
	const remote = gateway?.remote;
	const defaults = params.defaults ?? params.config.secrets?.defaults;
	const authMode = gateway?.auth?.mode;
	const envToken = trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
	const envPassword = trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD);
	function resolveInput(path, value) {
		const resolutionFacts = getConfigResolutionFacts(params.config);
		if (hasUnresolvedConfigPath(params.config, path) || getAuthoredConfigSecretRef(params.config, path)) return {
			path,
			configured: true,
			refPath: path,
			hasSecretRef: false
		};
		if (resolutionFacts !== null && typeof value === "string") return {
			path,
			configured: Boolean(trimToUndefined(value)),
			value: trimToUndefined(value),
			hasSecretRef: false
		};
		const ref = resolveSecretInputRef({
			value,
			defaults
		}).ref;
		return {
			path,
			configured: hasConfiguredSecretInput(value, defaults),
			value: ref ? void 0 : trimToUndefined(value),
			refPath: ref ? path : void 0,
			hasSecretRef: ref !== null
		};
	}
	const localToken = resolveInput("gateway.auth.token", gateway?.auth?.token);
	const localPassword = resolveInput("gateway.auth.password", gateway?.auth?.password);
	const remoteToken = resolveInput("gateway.remote.token", remote?.token);
	const remotePassword = resolveInput("gateway.remote.password", remote?.password);
	const localTokenCanWin = authMode !== "password" && authMode !== "none" && authMode !== "trusted-proxy";
	const localPasswordCanWin = authMode === "password" || authMode === "trusted-proxy" || authMode !== "token" && authMode !== "none" && !(envToken || localToken.configured);
	const tokenCanWin = Boolean(envToken || localToken.configured || remoteToken.configured);
	const passwordCanWin = authMode === "password" || authMode === "trusted-proxy" || authMode !== "token" && authMode !== "none" && !tokenCanWin;
	const localTokenSurfaceActive = localTokenCanWin && (authMode === "token" || authMode === void 0 && !(envPassword || localPassword.configured));
	const remoteMode = gateway?.mode === "remote";
	const remoteUrlConfigured = Boolean(trimToUndefined(remote?.url));
	const tailscaleRemoteExposure = gateway?.tailscale?.mode === "serve" || gateway?.tailscale?.mode === "funnel";
	const remoteConfiguredSurface = remoteMode || remoteUrlConfigured || tailscaleRemoteExposure;
	const remoteTokenFallbackActive = localTokenCanWin && !envToken && !localToken.configured;
	const remotePasswordFallbackActive = authMode !== "trusted-proxy" && !envPassword && !localPassword.configured && passwordCanWin;
	return {
		configuredMode: gateway?.mode === "remote" ? "remote" : "local",
		authMode,
		envToken,
		envPassword,
		localToken,
		localPassword,
		remoteToken,
		remotePassword,
		localTokenCanWin,
		localPasswordCanWin,
		localTokenSurfaceActive,
		tokenCanWin,
		passwordCanWin,
		remoteMode,
		remoteUrlConfigured,
		tailscaleRemoteExposure,
		remoteConfiguredSurface,
		remoteTokenFallbackActive,
		remoteTokenActive: remoteConfiguredSurface || remoteTokenFallbackActive,
		remotePasswordFallbackActive,
		remotePasswordActive: remoteConfiguredSurface || remotePasswordFallbackActive
	};
}
//#endregion
export { trimCredentialToUndefined as n, trimToUndefined as r, createGatewayCredentialPlan as t };
