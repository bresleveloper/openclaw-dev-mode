import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as describeSecretResolutionOperatorDiagnostic, o as isSecretResolutionError, r as describeSecretResolutionOperatorRecovery } from "./resolve-errors-DYenvPyo.mjs";
import { t as createGatewayCredentialPlan } from "./credential-planner-qXtujUeq.mjs";
import { n as isGatewaySecretRefUnavailableError, o as resolveGatewayProbeCredentialsFromConfig, r as resolveExplicitGatewayAuth } from "./credentials-lHQ7_oVm.mjs";
import { n as resolveGatewayProbeSurfaceAuth } from "./auth-surface-resolution-BI3JVU_1.mjs";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-DxDUO_P2.mjs";
import { n as getTrustedProxyPasswordRedactionWarning } from "./known-weak-gateway-secrets-BLCyfEDY.mjs";
//#region src/gateway/probe-auth.ts
function resolveGatewayProbeCredentialConfig(params) {
	const gateway = params.cfg.gateway;
	const credentials = params.mode === "local" ? gateway?.remote : gateway?.auth;
	if (!credentials || credentials.token === void 0 && credentials.password === void 0) return params.cfg;
	const credentialsWithoutAuth = { ...credentials };
	delete credentialsWithoutAuth.token;
	delete credentialsWithoutAuth.password;
	return {
		...params.cfg,
		gateway: {
			...gateway,
			...params.mode === "local" ? { remote: credentialsWithoutAuth } : { auth: credentialsWithoutAuth }
		}
	};
}
function hasExplicitProbeAuth(auth) {
	return Boolean(auth.token || auth.password);
}
function resolveGatewayProbeWarning(error) {
	if (!isGatewaySecretRefUnavailableError(error)) throw error;
	return `${error.path} SecretRef is unresolved in this command path; probing without configured auth credentials.`;
}
/** Resolves synchronous probe auth, throwing when configured secrets cannot be read. */
function resolveGatewayProbeAuth(params) {
	return resolveGatewayProbeCredentialsFromConfig({
		...params,
		cfg: resolveGatewayProbeCredentialConfig(params)
	});
}
async function resolveGatewayProbeAuthResolutionWithSecretInputs(params) {
	const config = resolveGatewayProbeCredentialConfig(params);
	const plan = params.mode === "local" && params.localPrecedence === "env-first" ? createGatewayCredentialPlan({
		config,
		env: params.env
	}) : void 0;
	const activeLocalRef = plan?.localTokenCanWin && plan.localToken.hasSecretRef || (plan?.localPasswordCanWin || plan?.authMode === void 0) && plan?.localPassword.hasSecretRef;
	const explicitAuth = resolveExplicitGatewayAuth(params.explicitAuth);
	if ((params.mode === "remote" || activeLocalRef) && !hasExplicitProbeAuth(explicitAuth) && !normalizeOptionalString(params.urlOverride)) {
		const resolved = await resolveGatewayProbeSurfaceAuth({
			config,
			env: params.env,
			surface: params.mode
		});
		const warning = resolved.diagnostics?.join("\n");
		if (warning) return {
			auth: resolved.source === "config" ? {
				token: resolved.token,
				password: resolved.password
			} : {},
			warning,
			...resolved.warningCode ? { warningCode: resolved.warningCode } : {}
		};
		return { auth: {
			token: resolved.token,
			password: resolved.password
		} };
	}
	return { auth: await resolveGatewayCredentialsWithSecretInputs({
		config,
		env: params.env,
		explicitAuth: params.explicitAuth,
		urlOverride: params.urlOverride,
		urlOverrideSource: params.urlOverrideSource,
		modeOverride: params.mode,
		localPrecedence: activeLocalRef ? "config-first" : params.localPrecedence,
		remoteTokenFallback: "remote-only"
	}) };
}
/** Resolves probe auth with async SecretRef support. */
async function resolveGatewayProbeAuthWithSecretInputs(params) {
	return (await resolveGatewayProbeAuthResolutionWithSecretInputs(params)).auth;
}
/** Resolves probe auth without throwing for unavailable SecretRefs, returning a warning. */
async function resolveGatewayProbeAuthSafeWithSecretInputs(params) {
	const explicitAuth = resolveExplicitGatewayAuth(params.explicitAuth);
	if (hasExplicitProbeAuth(explicitAuth)) return { auth: explicitAuth };
	try {
		const resolution = await resolveGatewayProbeAuthResolutionWithSecretInputs(params);
		if (params.mode === "local" && params.cfg.gateway?.auth?.mode === "trusted-proxy") {
			const warning = getTrustedProxyPasswordRedactionWarning({
				mode: "trusted-proxy",
				password: resolution.auth.password
			});
			if (warning) return {
				auth: {},
				warning,
				warningCode: "SECRET_REF_REDACTED_VALUE"
			};
		}
		return resolution;
	} catch (error) {
		if (isSecretResolutionError(error) && error.code === "SECRET_REF_REDACTED_VALUE") return {
			auth: {},
			warning: [describeSecretResolutionOperatorDiagnostic(error), describeSecretResolutionOperatorRecovery(error)].filter(Boolean).join(". "),
			warningCode: error.code
		};
		return {
			auth: {},
			warning: resolveGatewayProbeWarning(error)
		};
	}
}
/** Synchronous safe probe auth wrapper for config-only credential paths. */
function resolveGatewayProbeAuthSafe(params) {
	const explicitAuth = resolveExplicitGatewayAuth(params.explicitAuth);
	if (hasExplicitProbeAuth(explicitAuth)) return { auth: explicitAuth };
	try {
		return { auth: resolveGatewayProbeAuth(params) };
	} catch (error) {
		return {
			auth: {},
			warning: resolveGatewayProbeWarning(error)
		};
	}
}
//#endregion
export { resolveGatewayProbeCredentialConfig as a, resolveGatewayProbeAuthWithSecretInputs as i, resolveGatewayProbeAuthSafe as n, resolveGatewayProbeAuthSafeWithSecretInputs as r, resolveGatewayProbeAuth as t };
