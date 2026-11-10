import { i as parseConcreteConfigPathTokens, n as formatConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { a as coerceSecretRef, h as parseSecretRef, l as isLegacySecretRefWithoutProvider } from "./types.secrets-Dgbd2kyP.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { s as getAuthoredConfigSecretRef } from "./resolution-facts-D_pto3MV.mjs";
import { s as hasCurrentPluginInstanceAuthority } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { d as isSecretOwnerAvailable, r as assertSecretOwnerAvailable } from "./runtime-degraded-state-SptB0g_t.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot, c as getActiveSecretsRuntimeSnapshotRevisionState } from "./runtime-state-DDDhACod.mjs";
import { n as resolveCanonicalConfiguredSecretInputWithFallback, r as resolveCanonicalRequiredConfiguredSecretRefInputString, t as resolveCanonicalConfiguredSecretInputString } from "./resolve-configured-secret-input-string-VGELFJX8.mjs";
//#region src/secrets/prepared-plugin-input.ts
/** Read a manifest-prepared capability credential. Never resolves a cold reference or environment. */
function getPreparedPluginSecretInput(pluginId, path) {
	const revision = getActiveSecretsRuntimeSnapshotRevisionState();
	if (getPluginRuntimeGatewayRequestScope()?.pluginId !== pluginId || !hasCurrentPluginInstanceAuthority(pluginId)) return { revision };
	const snapshot = getActiveSecretsRuntimeConfigSnapshot();
	if (!snapshot?.configRefsPrepared || snapshot.config.plugins?.enabled === false || snapshot.config.plugins?.entries?.[pluginId]?.enabled === false) return { revision };
	const tokens = [
		"plugins",
		"entries",
		pluginId,
		"config",
		...parseConcreteConfigPathTokens(path)
	];
	const fullPath = formatConcreteConfigPath(tokens);
	if (!isSecretOwnerAvailable("capability", fullPath)) return { revision };
	const read = (root) => {
		let value = root;
		for (const token of tokens) {
			if (!value || typeof value !== "object" || !Object.hasOwn(value, token)) return;
			value = Reflect.get(value, token);
		}
		return value;
	};
	const source = read(snapshot.sourceConfig);
	if (!parseSecretRef(source, snapshot.sourceConfig.secrets?.defaults) && !getAuthoredConfigSecretRef(snapshot.sourceConfig, fullPath)) return { revision };
	const value = read(snapshot.config);
	return typeof value === "string" && value.trim() ? {
		value,
		revision
	} : { revision };
}
//#endregion
//#region src/plugin-sdk/secret-input-runtime.ts
/**
* Runtime SDK subpath for secret input normalization and configured secret resolution.
*/
function configuredSdkInput(params) {
	return isLegacySecretRefWithoutProvider(params.value) ? coerceSecretRef(params.value, params.config.secrets?.defaults) : params.value;
}
/** Keep the shipped unknown-valued SDK input contract outside canonical config readers. */
function resolveConfiguredSecretInputString(params) {
	return resolveCanonicalConfiguredSecretInputString({
		...params,
		value: configuredSdkInput(params)
	});
}
function resolveConfiguredSecretInputWithFallback(params) {
	return resolveCanonicalConfiguredSecretInputWithFallback({
		...params,
		value: configuredSdkInput(params)
	});
}
function resolveRequiredConfiguredSecretRefInputString(params) {
	return resolveCanonicalRequiredConfiguredSecretRefInputString({
		...params,
		value: configuredSdkInput(params)
	});
}
/** Reject use of a manifest-owned plugin capability whose startup secret is unavailable. */
function assertPluginCapabilitySecretAvailable(ownerId) {
	assertSecretOwnerAvailable("capability", ownerId);
}
//#endregion
export { getPreparedPluginSecretInput as a, resolveRequiredConfiguredSecretRefInputString as i, resolveConfiguredSecretInputString as n, resolveConfiguredSecretInputWithFallback as r, assertPluginCapabilitySecretAvailable as t };
