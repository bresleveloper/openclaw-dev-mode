import { n as trimCredentialToUndefined, r as trimToUndefined, t as createGatewayCredentialPlan } from "./credential-planner-iEoiKPLJ.mjs";
//#region src/gateway/credentials.ts
/** Trim caller-supplied Gateway credentials without consulting config or environment. */
function resolveExplicitGatewayAuth(auth) {
	return {
		token: trimToUndefined(auth?.token),
		password: trimToUndefined(auth?.password)
	};
}
const GATEWAY_SECRET_REF_UNAVAILABLE_ERROR_CODE = "GATEWAY_SECRET_REF_UNAVAILABLE";
/** Raised when a command path needs Gateway credentials before secret refs were resolved. */
var GatewaySecretRefUnavailableError = class extends Error {
	constructor(path) {
		super([
			`${path} is configured as a secret reference but is unavailable in this command path.`,
			"Fix: set OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD, pass explicit --token/--password,",
			"or run a gateway command path that resolves secret references before credential selection."
		].join("\n"));
		this.code = GATEWAY_SECRET_REF_UNAVAILABLE_ERROR_CODE;
		this.name = "GatewaySecretRefUnavailableError";
		this.path = path;
	}
};
function isGatewaySecretRefUnavailableError(error, expectedPath) {
	return error instanceof GatewaySecretRefUnavailableError && (!expectedPath || error.path === expectedPath);
}
function resolveGatewayCredentialsFromValues(params) {
	const env = params.env ?? process.env;
	const envToken = trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
	const envPassword = trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD);
	const configToken = trimCredentialToUndefined(params.configToken);
	const configPassword = trimCredentialToUndefined(params.configPassword);
	const tokenPrecedence = params.tokenPrecedence ?? "env-first";
	const passwordPrecedence = params.passwordPrecedence ?? "env-first";
	return {
		token: tokenPrecedence === "config-first" ? configToken || envToken : envToken || configToken,
		password: passwordPrecedence === "config-first" ? configPassword || envPassword : envPassword || configPassword
	};
}
function resolveLocalGatewayCredentials(params) {
	const { plan, localPrecedence } = params;
	const resolveCredential = (credential, envValue, fallback) => {
		const configFallback = credential.configured ? credential.value : fallback;
		return localPrecedence === "config-first" ? credential.value || envValue || (credential.configured ? void 0 : fallback) : envValue || configFallback;
	};
	const token = resolveCredential(plan.localToken, plan.envToken, plan.remoteToken.value);
	const password = resolveCredential(plan.localPassword, plan.envPassword, plan.authMode === "trusted-proxy" ? void 0 : plan.remotePassword.value);
	const localResolved = {
		token,
		password
	};
	const localPasswordCanWin = params.plan.authMode === "password" || params.plan.authMode === "trusted-proxy" || params.plan.authMode !== "token" && params.plan.authMode !== "none" && !localResolved.token;
	const localTokenCanWin = params.plan.authMode === "token" || params.plan.authMode !== "password" && params.plan.authMode !== "none" && params.plan.authMode !== "trusted-proxy" && !localResolved.password;
	const candidates = [{
		credential: plan.localToken,
		env: plan.envToken,
		value: token,
		canWin: localTokenCanWin
	}, {
		credential: plan.localPassword,
		env: plan.envPassword,
		value: password,
		canWin: localPasswordCanWin
	}].filter(({ credential, canWin }) => credential.refPath && canWin);
	const unresolved = (localPrecedence === "config-first" ? candidates.find(({ credential, env }) => !credential.value && Boolean(env)) : void 0) ?? candidates.find(({ value, env }) => !value && !env);
	if (unresolved?.credential.refPath) throw new GatewaySecretRefUnavailableError(unresolved.credential.refPath);
	return localResolved;
}
function resolveRemoteGatewayCredentials(params) {
	const resolveCredential = (kind) => {
		const remote = params.plan[`remote${kind}`].value;
		if (params[`remote${kind}Fallback`] === "remote-only") return remote;
		const env = params.plan[`env${kind}`];
		const local = params.plan[`local${kind}`].value;
		return params[`remote${kind}Precedence`] === "env-first" ? env || remote || local : remote || env || local;
	};
	const token = resolveCredential("Token");
	const password = resolveCredential("Password");
	const localTokenFallbackEnabled = params.remoteTokenFallback !== "remote-only";
	const localTokenFallback = params.remoteTokenFallback === "remote-only" ? void 0 : params.plan.localToken.value;
	const localPasswordFallback = params.remotePasswordFallback === "remote-only" ? void 0 : params.plan.localPassword.value;
	if (params.plan.remoteToken.refPath && !token && !params.plan.envToken && !localTokenFallback && !password) throw new GatewaySecretRefUnavailableError(params.plan.remoteToken.refPath);
	if (params.plan.remotePassword.refPath && !password && !params.plan.envPassword && !localPasswordFallback && !token) throw new GatewaySecretRefUnavailableError(params.plan.remotePassword.refPath);
	if (params.plan.localToken.refPath && localTokenFallbackEnabled && !token && !password && !params.plan.envToken && !params.plan.remoteToken.value && params.plan.localTokenCanWin) throw new GatewaySecretRefUnavailableError(params.plan.localToken.refPath);
	return {
		token,
		password
	};
}
function resolveGatewayCredentialsFromConfig(params) {
	const env = params.env ?? process.env;
	const explicitAuth = resolveExplicitGatewayAuth(params.explicitAuth);
	if (explicitAuth.token || explicitAuth.password) return explicitAuth;
	if (trimToUndefined(params.urlOverride)) return params.urlOverrideSource === "env" ? resolveGatewayCredentialsFromValues({ env }) : {};
	const plan = createGatewayCredentialPlan({
		config: params.cfg,
		env
	});
	if ((params.modeOverride ?? plan.configuredMode) === "local") return resolveLocalGatewayCredentials({
		plan,
		localPrecedence: params.localPrecedence ?? "config-first"
	});
	const remoteTokenFallback = params.remoteTokenFallback ?? "remote-env-local";
	const remotePasswordFallback = params.remotePasswordFallback ?? "remote-env-local";
	return resolveRemoteGatewayCredentials({
		plan,
		remoteTokenPrecedence: params.remoteTokenPrecedence ?? "remote-first",
		remotePasswordPrecedence: params.remotePasswordPrecedence ?? "env-first",
		remoteTokenFallback,
		remotePasswordFallback
	});
}
/** Resolve the stricter credential view used by Gateway probe paths. */
function resolveGatewayProbeCredentialsFromConfig(params) {
	return resolveGatewayCredentialsFromConfig({
		cfg: params.cfg,
		env: params.env,
		explicitAuth: params.explicitAuth,
		urlOverride: params.urlOverride,
		urlOverrideSource: params.urlOverrideSource,
		modeOverride: params.mode,
		remoteTokenFallback: "remote-only"
	});
}
//#endregion
export { resolveGatewayCredentialsFromValues as a, resolveGatewayCredentialsFromConfig as i, isGatewaySecretRefUnavailableError as n, resolveGatewayProbeCredentialsFromConfig as o, resolveExplicitGatewayAuth as r, GatewaySecretRefUnavailableError as t };
