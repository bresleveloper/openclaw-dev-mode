import { r as trimToUndefined, t as createGatewayCredentialPlan } from "./credential-planner-D-JGW62E.mjs";
import "./credentials-CyW929E5.mjs";
import { n as resolveConfiguredSecretInputWithFallback } from "./resolve-configured-secret-input-string-SF_iuPva.mjs";
//#region src/gateway/auth-surface-resolution.ts
async function resolveGatewayCredential(params) {
	const resolved = await resolveConfiguredSecretInputWithFallback({
		config: params.config,
		env: params.env,
		value: params.value,
		path: params.path,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.unresolvedRefReason) params.diagnostics.push({
		message: resolved.unresolvedRefReason,
		code: resolved.unresolvedRefCode
	});
	return resolved;
}
function withDiagnostics(diagnostics, result) {
	return diagnostics.length > 0 ? {
		...result,
		diagnostics: diagnostics.map(({ message }) => message),
		...diagnostics.some(({ code }) => code === "SECRET_REF_REDACTED_VALUE") ? { warningCode: "SECRET_REF_REDACTED_VALUE" } : {}
	} : result;
}
/** Resolves best-effort credentials for non-mutating local/remote gateway probes. */
async function resolveGatewayProbeSurfaceAuth(params) {
	const env = params.env ?? process.env;
	const diagnostics = [];
	const authMode = params.config.gateway?.auth?.mode;
	if (params.surface === "remote") {
		const remoteToken = await resolveGatewayCredential({
			config: params.config,
			env,
			diagnostics,
			path: "gateway.remote.token",
			value: params.config.gateway?.remote?.token
		});
		const remotePassword = remoteToken.value ? {
			value: void 0,
			secretRefConfigured: false
		} : await resolveGatewayCredential({
			config: params.config,
			env,
			diagnostics,
			path: "gateway.remote.password",
			value: params.config.gateway?.remote?.password
		});
		const envToken = trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
		const envPassword = trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD);
		const hasConfiguredAuth = Boolean(remoteToken.value || remotePassword.value);
		const allowEnvAuth = !hasConfiguredAuth && diagnostics.length === 0;
		return withDiagnostics(diagnostics, {
			token: remoteToken.value ?? (allowEnvAuth ? envToken : void 0),
			password: remotePassword.value ?? (allowEnvAuth ? envPassword : void 0),
			...hasConfiguredAuth ? { source: "config" } : allowEnvAuth && (envToken || envPassword) && { source: "env" }
		});
	}
	if (authMode === "none" || authMode === "trusted-proxy") return {};
	const envToken = trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
	const envPassword = trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD);
	if (authMode === "token" || authMode === "password") {
		const credential = await resolveGatewayCredential({
			config: params.config,
			env,
			diagnostics,
			path: `gateway.auth.${authMode}`,
			value: params.config.gateway?.auth?.[authMode]
		});
		if (credential.value) return withDiagnostics(diagnostics, {
			[authMode]: credential.value,
			source: "config"
		});
		const envCredential = authMode === "token" ? envToken : envPassword;
		return !credential.secretRefConfigured && envCredential ? {
			[authMode]: envCredential,
			source: "env"
		} : withDiagnostics(diagnostics, {});
	}
	const token = await resolveGatewayCredential({
		config: params.config,
		env,
		diagnostics,
		path: "gateway.auth.token",
		value: params.config.gateway?.auth?.token
	});
	if (token.value) return withDiagnostics(diagnostics, {
		token: token.value,
		source: "config"
	});
	if (token.secretRefConfigured) return withDiagnostics(diagnostics, {});
	const password = await resolveGatewayCredential({
		config: params.config,
		env,
		diagnostics,
		path: "gateway.auth.password",
		value: params.config.gateway?.auth?.password
	});
	if (password.secretRefConfigured) return withDiagnostics(diagnostics, password.value ? {
		password: password.value,
		source: "config"
	} : {});
	if (envToken) return {
		token: envToken,
		source: "env"
	};
	if (envPassword) return withDiagnostics(diagnostics, {
		password: envPassword,
		source: "env"
	});
	return withDiagnostics(diagnostics, {
		token: token.value,
		password: password.value,
		...password.value && { source: "config" }
	});
}
/** Resolves credentials for client paths that must either authenticate or explain the failure. */
async function resolveGatewayInteractiveSurfaceAuth(params) {
	const env = params.env ?? process.env;
	const diagnostics = [];
	const explicitToken = trimToUndefined(params.explicitAuth?.token);
	const explicitPassword = trimToUndefined(params.explicitAuth?.password);
	const credentialPlan = createGatewayCredentialPlan({
		config: params.config,
		env
	});
	const authMode = params.config.gateway?.auth?.mode;
	const hasActiveSecretRef = params.surface === "remote" ? credentialPlan.remoteToken.hasSecretRef || credentialPlan.remotePassword.hasSecretRef : credentialPlan.localTokenCanWin && credentialPlan.localToken.hasSecretRef || (authMode === "password" || authMode === void 0) && credentialPlan.localPassword.hasSecretRef;
	if ((explicitToken || explicitPassword) && hasActiveSecretRef) return {
		token: explicitToken,
		password: explicitPassword
	};
	const envToken = params.suppressEnvAuthFallback ? void 0 : trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
	const envPassword = params.suppressEnvAuthFallback ? void 0 : trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD);
	if (params.surface === "remote") {
		const remoteToken = explicitToken ? {
			value: explicitToken,
			secretRefConfigured: false
		} : await resolveGatewayCredential({
			config: params.config,
			env,
			diagnostics,
			path: "gateway.remote.token",
			value: params.config.gateway?.remote?.token
		});
		if (remoteToken.value && (remoteToken.secretRefConfigured || credentialPlan.remotePassword.hasSecretRef)) return {
			token: remoteToken.value,
			password: void 0
		};
		const remotePassword = explicitPassword ? {
			value: explicitPassword,
			secretRefConfigured: false
		} : await resolveGatewayCredential({
			config: params.config,
			env,
			diagnostics,
			path: "gateway.remote.password",
			value: params.config.gateway?.remote?.password
		});
		const secretRefConfigured = remoteToken.secretRefConfigured || remotePassword.secretRefConfigured;
		const token = remoteToken.value ?? (secretRefConfigured ? void 0 : envToken);
		const password = explicitPassword ?? (secretRefConfigured ? remotePassword.value : envPassword ?? remotePassword.value);
		return token || password ? {
			token,
			password
		} : { failureReason: remoteToken.unresolvedRefReason ?? remotePassword.unresolvedRefReason ?? "Missing gateway auth credentials." };
	}
	if (authMode === "none" || authMode === "trusted-proxy") return {
		token: explicitToken ?? envToken,
		password: explicitPassword ?? envPassword
	};
	const shouldUsePassword = authMode === "password" || authMode !== "token" && (Boolean(explicitPassword ?? envPassword) && !credentialPlan.localToken.hasSecretRef || credentialPlan.localPassword.configured && !credentialPlan.localToken.configured);
	const credentialKind = shouldUsePassword ? "password" : "token";
	const explicitCredential = shouldUsePassword ? explicitPassword : explicitToken;
	const envCredential = shouldUsePassword ? envPassword : envToken;
	const credential = explicitCredential ? {
		value: explicitCredential,
		secretRefConfigured: false
	} : await resolveGatewayCredential({
		config: params.config,
		env,
		diagnostics,
		path: `gateway.auth.${credentialKind}`,
		value: params.config.gateway?.auth?.[credentialKind]
	});
	const value = credential.value ?? (credential.secretRefConfigured ? void 0 : envCredential);
	return {
		token: shouldUsePassword ? credential.secretRefConfigured ? void 0 : explicitToken ?? envToken : value,
		password: shouldUsePassword ? value : credential.secretRefConfigured ? void 0 : explicitPassword ?? envPassword,
		failureReason: value ? void 0 : credential.unresolvedRefReason ?? `Missing gateway auth ${credentialKind}.`
	};
}
//#endregion
export { resolveGatewayProbeSurfaceAuth as n, resolveGatewayInteractiveSurfaceAuth as t };
