import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as getConfigResolutionFacts, i as copyConfigResolutionFactsExcept } from "./resolution-facts-HH1cnmIY.mjs";
import { r as trimToUndefined, t as createGatewayCredentialPlan } from "./credential-planner-qXtujUeq.mjs";
import "./credentials-lHQ7_oVm.mjs";
import { i as resolveGatewayAuthForConfig } from "./auth-resolve-BmUDP1m_.mjs";
import { n as getTrustedProxyPasswordRedactionWarning, t as assertGatewayAuthNotKnownWeak } from "./known-weak-gateway-secrets-BLCyfEDY.mjs";
import { a as resolveGatewayTokenSecretRefValue, i as resolveGatewayPasswordSecretRefValue } from "./auth-config-utils-BzcyvaQI.mjs";
import { t as assertExplicitGatewayAuthModeWhenBothConfigured } from "./auth-mode-policy-DzNSJi11.mjs";
import crypto from "node:crypto";
//#region src/gateway/startup-auth.ts
const HOOKS_GATEWAY_AUTH_REUSE_WARNING = "Security warning: hooks.token matches active Gateway shared-secret auth. Startup continues for compatibility; rotate hooks.token or Gateway auth. Run openclaw security audit for a full report, and run openclaw doctor --fix when the reused hooks.token is persisted in config.";
/** Merge sparse runtime Tailscale overrides into persisted Gateway Tailscale config. */
function mergeGatewayTailscaleConfig(base, override) {
	const merged = { ...base };
	if (!override) return merged;
	if (override.mode !== void 0) merged.mode = override.mode;
	if (override.preserveFunnel !== void 0) merged.preserveFunnel = override.preserveFunnel;
	return merged;
}
function findActiveGatewaySharedSecret(auth) {
	if (auth.mode === "token") return normalizeOptionalString(auth.token) ?? "";
	if (auth.mode === "password" || auth.mode === "trusted-proxy") return normalizeOptionalString(auth.password) ?? "";
	return "";
}
function warnHooksTokenReuseGatewayAuth(params) {
	if (params.cfg.hooks?.enabled !== true || !params.warn) return;
	const hooksToken = normalizeOptionalString(params.cfg.hooks.token) ?? "";
	if (!hooksToken || hooksToken !== findActiveGatewaySharedSecret(params.auth)) return;
	params.warn(HOOKS_GATEWAY_AUTH_REUSE_WARNING);
}
/** Check every source that can satisfy token auth before startup generates one. */
function hasGatewayTokenCandidate(params) {
	if (trimToUndefined(params.env.OPENCLAW_GATEWAY_TOKEN)) return true;
	if (normalizeOptionalString(params.authOverride?.token)) return true;
	const token = createGatewayCredentialPlan({
		config: params.cfg,
		env: params.env
	}).localToken;
	return token.hasSecretRef || Boolean(token.value);
}
/** Ensure startup has effective Gateway auth, generating only an ephemeral token if needed. */
async function ensureGatewayStartupAuth(params) {
	assertExplicitGatewayAuthModeWhenBothConfigured(params.cfg);
	const env = params.env ?? process.env;
	const explicitMode = params.authOverride?.mode ?? params.cfg.gateway?.auth?.mode;
	const credentialPlan = createGatewayCredentialPlan({
		config: params.cfg,
		env
	});
	const resolutionEvaluated = getConfigResolutionFacts(params.cfg) !== null;
	const tokenAlreadySubstituted = resolutionEvaluated && typeof params.cfg.gateway?.auth?.token === "string";
	const passwordAlreadySubstituted = resolutionEvaluated && typeof params.cfg.gateway?.auth?.password === "string";
	const hasTokenOverride = Boolean(normalizeOptionalString(params.authOverride?.token)) || tokenAlreadySubstituted;
	const hasPasswordOverride = Boolean(normalizeOptionalString(params.authOverride?.password)) || passwordAlreadySubstituted;
	const [resolvedTokenRefValue, resolvedPasswordRefValue] = await Promise.all([resolveGatewayTokenSecretRefValue({
		cfg: params.cfg,
		env,
		mode: explicitMode,
		hasTokenOverride,
		hasPasswordOverride,
		hasTokenFallback: Boolean(trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN)),
		hasPasswordFallback: Boolean(credentialPlan.envPassword || credentialPlan.localPassword.value || credentialPlan.localPassword.hasSecretRef)
	}), resolveGatewayPasswordSecretRefValue({
		cfg: params.cfg,
		env,
		mode: explicitMode,
		hasPasswordOverride,
		hasTokenOverride,
		hasPasswordFallback: Boolean(trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD)),
		hasTokenFallback: hasGatewayTokenCandidate({
			cfg: params.cfg,
			env,
			authOverride: params.authOverride
		})
	})]);
	const authOverride = params.authOverride || resolvedTokenRefValue || resolvedPasswordRefValue ? {
		...params.authOverride,
		...resolvedTokenRefValue ? { token: resolvedTokenRefValue } : {},
		...resolvedPasswordRefValue ? { password: resolvedPasswordRefValue } : {}
	} : void 0;
	const resolutionConfig = hasGatewayTokenCandidate({
		cfg: params.cfg,
		env,
		authOverride
	}) ? params.cfg : {
		...params.cfg,
		gateway: {
			...params.cfg.gateway,
			auth: {
				...params.cfg.gateway?.auth,
				token: void 0
			}
		}
	};
	if (resolutionConfig !== params.cfg) copyConfigResolutionFactsExcept(params.cfg, resolutionConfig, ["gateway.auth.token"]);
	const tailscaleMode = mergeGatewayTailscaleConfig(resolutionConfig.gateway?.tailscale, params.tailscaleOverride).mode ?? "off";
	const resolved = resolveGatewayAuthForConfig({
		config: resolutionConfig,
		env,
		authOverride,
		tailscaleMode
	});
	assertGatewayAuthNotKnownWeak(resolved, authOverride?.token ?? params.cfg.gateway?.auth?.token, authOverride?.password ?? params.cfg.gateway?.auth?.password);
	const optionalPasswordWarning = getTrustedProxyPasswordRedactionWarning(resolved);
	if (optionalPasswordWarning) params.warn?.(optionalPasswordWarning);
	if (resolved.mode !== "token" || (resolved.token?.trim().length ?? 0) > 0) {
		warnHooksTokenReuseGatewayAuth({
			cfg: params.cfg,
			auth: resolved,
			warn: params.warn
		});
		return {
			cfg: params.cfg,
			auth: resolved,
			persistedGeneratedToken: false
		};
	}
	const generatedToken = crypto.randomBytes(24).toString("hex");
	const nextCfg = {
		...params.cfg,
		gateway: {
			...params.cfg.gateway,
			auth: {
				...params.cfg.gateway?.auth,
				mode: "token",
				token: generatedToken
			}
		}
	};
	copyConfigResolutionFactsExcept(params.cfg, nextCfg, ["gateway.auth.token"]);
	const nextAuth = resolveGatewayAuthForConfig({
		config: nextCfg,
		env,
		authOverride: params.authOverride,
		tailscaleMode
	});
	assertGatewayAuthNotKnownWeak(nextAuth);
	warnHooksTokenReuseGatewayAuth({
		cfg: nextCfg,
		auth: nextAuth,
		warn: params.warn
	});
	return {
		cfg: nextCfg,
		auth: nextAuth,
		generatedToken,
		persistedGeneratedToken: false
	};
}
//#endregion
export { mergeGatewayTailscaleConfig as n, ensureGatewayStartupAuth as t };
