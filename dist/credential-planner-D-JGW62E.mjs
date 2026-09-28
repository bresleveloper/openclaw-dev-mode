import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as hasConfiguredSecretInput, p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { c as getConfigResolutionFacts, s as getAuthoredConfigSecretRef, u as hasUnresolvedConfigPath } from "./resolution-facts-CSuKIPux.mjs";
import { Y as containsEnvVarReference } from "./redact-B5EGyLvV.mjs";
//#region src/gateway/credential-planner.ts
/** Normalize optional Gateway credential strings to nonempty values. */
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
/** Classify one configured credential input without resolving secret refs. */
function resolveConfiguredGatewayCredentialInput(params) {
	const resolutionFacts = getConfigResolutionFacts(params.config);
	if (hasUnresolvedConfigPath(params.config, params.path) || getAuthoredConfigSecretRef(params.config, params.path)) return {
		path: params.path,
		configured: true,
		refPath: params.path,
		hasSecretRef: false
	};
	if (resolutionFacts !== null && typeof params.value === "string") return {
		path: params.path,
		configured: Boolean(trimToUndefined(params.value)),
		value: trimToUndefined(params.value),
		hasSecretRef: false
	};
	const ref = resolveSecretInputRef({
		value: params.value,
		defaults: params.defaults
	}).ref;
	return {
		path: params.path,
		configured: hasConfiguredSecretInput(params.value, params.defaults),
		value: ref ? void 0 : trimToUndefined(params.value),
		refPath: ref ? params.path : void 0,
		hasSecretRef: ref !== null
	};
}
/** Build the shared credential plan for Gateway startup, local auth, and remote client auth. */
function createGatewayCredentialPlan(params) {
	const env = params.env ?? process.env;
	const gateway = params.config.gateway;
	const remote = gateway?.remote;
	const defaults = params.defaults ?? params.config.secrets?.defaults;
	const authMode = gateway?.auth?.mode;
	const envToken = trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
	const envPassword = trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD);
	const localToken = resolveConfiguredGatewayCredentialInput({
		config: params.config,
		value: gateway?.auth?.token,
		defaults,
		path: "gateway.auth.token"
	});
	const localPassword = resolveConfiguredGatewayCredentialInput({
		config: params.config,
		value: gateway?.auth?.password,
		defaults,
		path: "gateway.auth.password"
	});
	const remoteToken = resolveConfiguredGatewayCredentialInput({
		config: params.config,
		value: remote?.token,
		defaults,
		path: "gateway.remote.token"
	});
	const remotePassword = resolveConfiguredGatewayCredentialInput({
		config: params.config,
		value: remote?.password,
		defaults,
		path: "gateway.remote.password"
	});
	const localTokenCanWin = authMode !== "password" && authMode !== "none" && authMode !== "trusted-proxy";
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
		localPasswordCanWin: passwordCanWin,
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
