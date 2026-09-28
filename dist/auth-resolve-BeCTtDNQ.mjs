import { p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { i as copyConfigResolutionFactsExcept } from "./resolution-facts-CSuKIPux.mjs";
import { s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { t as createGatewayCredentialPlan } from "./credential-planner-D-JGW62E.mjs";
import { a as resolveGatewayCredentialsFromValues } from "./credentials-CyW929E5.mjs";
//#region src/gateway/auth-resolve.ts
function mergeGatewayAuthConfig(base, override) {
	const merged = { ...base };
	if (!override) return merged;
	for (const key of [
		"mode",
		"token",
		"password",
		"allowTailscale",
		"rateLimit",
		"trustedProxy"
	]) if (override[key] !== void 0) Object.assign(merged, { [key]: override[key] });
	return merged;
}
function finalizeResolvedGatewayAuth(params) {
	const { authConfig, authOverride, token, password } = params;
	const mode = authOverride?.mode ?? authConfig.mode ?? (password ? "password" : token ? "token" : "token");
	return {
		mode,
		modeSource: authOverride?.mode !== void 0 ? "override" : authConfig.mode ? "config" : password ? "password" : token ? "token" : "default",
		token,
		password,
		allowTailscale: authConfig.allowTailscale ?? (params.tailscaleMode === "serve" && mode !== "password" && mode !== "trusted-proxy"),
		trustedProxy: authConfig.trustedProxy
	};
}
/** Resolve Gateway auth mode, credentials, trusted-proxy policy, and Tailscale allowance. */
function resolveGatewayAuth(params) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	if (runtimeConfig && runtimeConfig.gateway?.auth === params.authConfig) return resolveGatewayAuthForConfig({
		config: runtimeConfig,
		authOverride: params.authOverride,
		env: params.env,
		tailscaleMode: params.tailscaleMode
	});
	const authOverride = params.authOverride ?? void 0;
	const authConfig = mergeGatewayAuthConfig(params.authConfig, authOverride);
	const env = params.env ?? process.env;
	const tokenRef = resolveSecretInputRef({ value: authConfig.token }).ref;
	const passwordRef = resolveSecretInputRef({ value: authConfig.password }).ref;
	const resolvedCredentials = resolveGatewayCredentialsFromValues({
		configToken: tokenRef ? void 0 : authConfig.token,
		configPassword: passwordRef ? void 0 : authConfig.password,
		env,
		tokenPrecedence: "config-first",
		passwordPrecedence: "config-first"
	});
	return finalizeResolvedGatewayAuth({
		authConfig,
		authOverride,
		token: resolvedCredentials.token,
		password: resolvedCredentials.password,
		tailscaleMode: params.tailscaleMode
	});
}
/** Credential edits may reload only while their resolved authentication mode stays fixed. */
function canHotReloadGatewayAuthCredentials(previousConfig, candidateConfig) {
	if (!previousConfig || !candidateConfig) return false;
	const modes = [previousConfig, candidateConfig].map((config) => {
		const authConfig = config.gateway?.auth;
		if (!authConfig?.mode && (resolveSecretInputRef({ value: authConfig?.token }).ref || resolveSecretInputRef({ value: authConfig?.password }).ref)) return;
		return resolveGatewayAuth({
			authConfig,
			tailscaleMode: config.gateway?.tailscale?.mode
		}).mode;
	});
	return (modes[0] === "token" || modes[0] === "password") && modes[0] === modes[1];
}
/** Resolve auth from an env-substituted config while retaining its resolution facts. */
function resolveGatewayAuthForConfig(params) {
	const authOverride = params.authOverride ?? void 0;
	const authConfig = mergeGatewayAuthConfig(params.config.gateway?.auth, authOverride);
	const config = {
		...params.config,
		gateway: {
			...params.config.gateway,
			auth: authConfig
		}
	};
	const overriddenPaths = [...authOverride?.token !== void 0 ? ["gateway.auth.token"] : [], ...authOverride?.password !== void 0 ? ["gateway.auth.password"] : []];
	copyConfigResolutionFactsExcept(params.config, config, overriddenPaths);
	const plan = createGatewayCredentialPlan({
		config,
		env: params.env
	});
	return finalizeResolvedGatewayAuth({
		authConfig,
		authOverride,
		token: plan.localToken.hasSecretRef ? void 0 : plan.localToken.value ?? plan.envToken ?? plan.remoteToken.value,
		password: plan.localPassword.hasSecretRef ? void 0 : plan.localPassword.value ?? plan.envPassword ?? (plan.authMode === "trusted-proxy" ? void 0 : plan.remotePassword.value),
		tailscaleMode: params.tailscaleMode
	});
}
//#endregion
export { resolveGatewayAuth as n, resolveGatewayAuthForConfig as r, canHotReloadGatewayAuthCredentials as t };
