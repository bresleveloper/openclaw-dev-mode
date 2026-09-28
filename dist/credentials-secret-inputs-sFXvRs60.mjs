import { f as resolveConfigSecretRef, t as cloneConfigWithResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { r as trimToUndefined } from "./credential-planner-D-JGW62E.mjs";
import { i as resolveGatewayCredentialsFromConfig, r as resolveExplicitGatewayAuth, t as GatewaySecretRefUnavailableError } from "./credentials-CyW929E5.mjs";
import { o as isSecretResolutionError } from "./resolve-errors-DYenvPyo.mjs";
import { t as materializeSecretInput } from "./resolve-secret-input-string-DtvH9AFh.mjs";
import { a as readGatewaySecretInputValue, i as isTokenGatewaySecretInputPath, n as assignResolvedGatewaySecretInput, r as isSupportedGatewaySecretInputPath, t as ALL_GATEWAY_SECRET_INPUT_PATHS } from "./secret-input-paths-DKB73EzB.mjs";
//#region src/gateway/credentials-secret-inputs.ts
async function resolveGatewaySecretInputString(params) {
	const ref = resolveConfigSecretRef({
		config: params.config,
		path: params.path,
		value: params.value,
		defaults: params.config.secrets?.defaults
	});
	const value = await materializeSecretInput({
		config: params.config,
		value: ref ?? params.value,
		env: params.env,
		normalize: trimToUndefined,
		onResolveRefError: (error) => {
			if (isSecretResolutionError(error) && error.code === "SECRET_REF_REDACTED_VALUE") throw error;
			throw new GatewaySecretRefUnavailableError(params.path);
		}
	});
	if (!value) throw new Error(`${params.path} resolved to an empty or non-string value.`);
	return value;
}
function hasConfiguredGatewaySecretRef(config, path) {
	return Boolean(resolveConfigSecretRef({
		config,
		path,
		value: readGatewaySecretInputValue(config, path),
		defaults: config.secrets?.defaults
	}));
}
function resolveGatewayCredentialsFromConfigOptions(params) {
	const { cfg, env, options } = params;
	return {
		cfg,
		env,
		explicitAuth: options.explicitAuth,
		urlOverride: options.urlOverride,
		urlOverrideSource: options.urlOverrideSource,
		modeOverride: options.modeOverride,
		localPrecedence: options.localPrecedence,
		remoteTokenPrecedence: options.remoteTokenPrecedence,
		remotePasswordPrecedence: options.remotePasswordPrecedence ?? "env-first",
		remoteTokenFallback: options.remoteTokenFallback,
		remotePasswordFallback: options.remotePasswordFallback
	};
}
function localAuthModeAllowsGatewaySecretInputPath(params) {
	const { authMode, path } = params;
	if (authMode === "none") return false;
	if (authMode === "trusted-proxy") return !isTokenGatewaySecretInputPath(path);
	if (authMode === "token") return isTokenGatewaySecretInputPath(path);
	if (authMode === "password") return !isTokenGatewaySecretInputPath(path);
	return true;
}
function canGatewaySecretInputPathWin(params) {
	if (!hasConfiguredGatewaySecretRef(params.config, params.path)) return false;
	const mode = params.options.modeOverride ?? (params.config.gateway?.mode === "remote" ? "remote" : "local");
	if (mode === "local" && !localAuthModeAllowsGatewaySecretInputPath({
		authMode: params.config.gateway?.auth?.mode,
		path: params.path
	})) return false;
	const sentinel = `__OPENCLAW_GATEWAY_SECRET_REF_PROBE_${params.path.replaceAll(".", "_")}__`;
	const probeConfig = cloneConfigWithResolutionFacts(params.config);
	for (const candidatePath of ALL_GATEWAY_SECRET_INPUT_PATHS) {
		if (!hasConfiguredGatewaySecretRef(probeConfig, candidatePath)) continue;
		assignResolvedGatewaySecretInput({
			config: probeConfig,
			path: candidatePath,
			value: void 0
		});
	}
	assignResolvedGatewaySecretInput({
		config: probeConfig,
		path: params.path,
		value: sentinel
	});
	try {
		const resolved = resolveGatewayCredentialsFromConfig(resolveGatewayCredentialsFromConfigOptions({
			cfg: probeConfig,
			env: params.env,
			options: params.options
		}));
		const authMode = params.config.gateway?.auth?.mode;
		const tokenCanWin = resolved.token === sentinel && (mode === "local" && authMode === "token" || !resolved.password);
		const passwordCanWin = resolved.password === sentinel && (mode === "local" && (authMode === "password" || authMode === "trusted-proxy") || !resolved.token);
		return tokenCanWin || passwordCanWin;
	} catch {
		return false;
	}
}
/** Test whether resolving a configured secret-ref path could affect selected credentials. */
function gatewaySecretInputPathCanWin(params) {
	const { path, env = process.env, ...options } = params;
	return canGatewaySecretInputPathWin({
		options: {
			...options,
			explicitAuth: resolveExplicitGatewayAuth(options.explicitAuth)
		},
		env,
		config: params.config,
		path
	});
}
async function resolveConfiguredGatewaySecretInput(params) {
	return resolveGatewaySecretInputString({
		config: params.config,
		value: readGatewaySecretInputValue(params.config, params.path),
		path: params.path,
		env: params.env
	});
}
async function resolvePreferredGatewaySecretInputs(params) {
	let nextConfig = params.config;
	for (const path of ALL_GATEWAY_SECRET_INPUT_PATHS) {
		if (!canGatewaySecretInputPathWin({
			options: params.options,
			env: params.env,
			config: nextConfig,
			path
		})) continue;
		if (nextConfig === params.config) nextConfig = cloneConfigWithResolutionFacts(params.config);
		try {
			const resolvedValue = await resolveConfiguredGatewaySecretInput({
				config: nextConfig,
				path,
				env: params.env
			});
			assignResolvedGatewaySecretInput({
				config: nextConfig,
				path,
				value: resolvedValue
			});
		} catch (error) {
			if (isSecretResolutionError(error) && error.code === "SECRET_REF_REDACTED_VALUE") throw error;
			continue;
		}
	}
	return nextConfig;
}
/** Resolve only secret refs that can win, then select Gateway credentials. */
async function resolveGatewayCredentialsFromConfigWithSecretInputs(params) {
	let resolvedConfig = await resolvePreferredGatewaySecretInputs({
		options: params.options,
		env: params.env,
		config: params.options.config
	});
	const resolvedPaths = /* @__PURE__ */ new Set();
	for (;;) try {
		return resolveGatewayCredentialsFromConfig(resolveGatewayCredentialsFromConfigOptions({
			cfg: resolvedConfig,
			env: params.env,
			options: params.options
		}));
	} catch (error) {
		if (!(error instanceof GatewaySecretRefUnavailableError)) throw error;
		const path = error.path;
		if (!isSupportedGatewaySecretInputPath(path) || resolvedPaths.has(path)) throw error;
		if (resolvedConfig === params.options.config) resolvedConfig = cloneConfigWithResolutionFacts(params.options.config);
		const resolvedValue = await resolveConfiguredGatewaySecretInput({
			config: resolvedConfig,
			path,
			env: params.env
		});
		assignResolvedGatewaySecretInput({
			config: resolvedConfig,
			path,
			value: resolvedValue
		});
		resolvedPaths.add(path);
	}
}
/** Resolve Gateway credentials after materializing winning configured secret refs. */
async function resolveGatewayCredentialsWithSecretInputs(params) {
	const options = {
		...params,
		explicitAuth: resolveExplicitGatewayAuth(params.explicitAuth)
	};
	if (options.explicitAuth.token || options.explicitAuth.password) return {
		token: options.explicitAuth.token,
		password: options.explicitAuth.password
	};
	return await resolveGatewayCredentialsFromConfigWithSecretInputs({
		options,
		env: params.env ?? process.env
	});
}
//#endregion
export { resolveGatewayCredentialsWithSecretInputs as n, gatewaySecretInputPathCanWin as t };
