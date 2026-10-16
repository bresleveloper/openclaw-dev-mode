import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as isBuiltInDefaultSecretProviderRef } from "./ref-contract-D0kWy5jy.mjs";
import { h as parseSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-qsdt7vnj.mjs";
//#region src/plugins/manifest-tool-availability.ts
function readPath(root, path) {
	if (!path?.trim()) return root;
	let current = root;
	for (const segment of path.split(".")) {
		const key = segment.trim();
		if (!key) return;
		if (!isRecord(current) || !(key in current)) return;
		current = current[key];
	}
	return current;
}
function hasConfiguredValue(params) {
	const secretRef = parseSecretRef(params.value, params.config?.secrets?.defaults);
	if (secretRef?.source === "env") return canResolveEnvSecretRefInReadOnlyPath({
		cfg: params.config,
		provider: secretRef.provider,
		id: secretRef.id
	}) && Boolean(params.env[secretRef.id]?.trim());
	if (secretRef) return (params.config?.secrets?.providers?.[secretRef.provider])?.source === secretRef.source || isBuiltInDefaultSecretProviderRef(params.config ?? {}, secretRef);
	if (typeof params.value === "string") return params.value.trim().length > 0;
	if (Array.isArray(params.value)) return params.value.length > 0;
	if (isRecord(params.value)) return Object.keys(params.value).length > 0;
	return params.value !== void 0 && params.value !== null;
}
function manifestConfigSignalPasses(params) {
	const root = readPath(params.config, params.signal.rootPath);
	if (!isRecord(root)) return false;
	const overlay = readPath(root, params.signal.overlayPath);
	const baseConfig = isRecord(overlay) ? {
		...root,
		...overlay
	} : root;
	const passes = (effectiveConfig) => manifestEffectiveConfigSignalPasses({
		config: params.config,
		env: params.env,
		effectiveConfig,
		signal: params.signal
	});
	if (!params.signal.overlayMapPath?.trim()) return passes(baseConfig);
	const overlayMap = readPath(baseConfig, params.signal.overlayMapPath);
	return isRecord(overlayMap) && Object.entries(overlayMap).toSorted(([left], [right]) => left.localeCompare(right)).some(([, mapOverlay]) => isRecord(mapOverlay) && passes({
		...baseConfig,
		...mapOverlay
	}));
}
function manifestEffectiveConfigSignalPasses(params) {
	const modeSignal = params.signal.mode;
	if (modeSignal) {
		const modePath = modeSignal.path?.trim() || "mode";
		const mode = normalizeOptionalString(readPath(params.effectiveConfig, modePath)) ?? modeSignal.default;
		if (!mode) return false;
		if (modeSignal.allowed?.length && !modeSignal.allowed.includes(mode)) return false;
		if (modeSignal.disallowed?.includes(mode)) return false;
	}
	const hasValue = (path) => hasConfiguredValue({
		config: params.config,
		env: params.env,
		value: readPath(params.effectiveConfig, path)
	});
	const requiredAny = params.signal.requiredAny ?? [];
	return (params.signal.required ?? []).every(hasValue) && (requiredAny.length === 0 || requiredAny.some(hasValue));
}
function normalizeBaseUrlForManifestGuard(value) {
	return value.trim().replace(/\/+$/, "");
}
function manifestProviderBaseUrlGuardPasses(params) {
	const guard = params.guard;
	if (!guard) return true;
	const providerConfig = params.config?.models?.providers?.[guard.provider];
	const rawBaseUrl = typeof providerConfig?.baseUrl === "string" && providerConfig.baseUrl.trim() ? providerConfig.baseUrl : guard.defaultBaseUrl;
	if (!rawBaseUrl) return false;
	const normalizedBaseUrl = normalizeBaseUrlForManifestGuard(rawBaseUrl);
	return guard.allowedBaseUrls.some((allowedBaseUrl) => normalizeBaseUrlForManifestGuard(allowedBaseUrl) === normalizedBaseUrl);
}
function manifestPluginSetupProviderEnvVars(plugin, providerId) {
	return plugin.setup?.providers?.find((provider) => provider.id === providerId)?.envVars ?? [];
}
function hasNonEmptyManifestEnvCandidate(env, envVars) {
	return envVars.some((envVar) => {
		const key = envVar.trim();
		return key.length > 0 && Boolean(env[key]?.trim());
	});
}
function listToolAuthSignals(metadata) {
	if (metadata.authSignals?.length) return metadata.authSignals;
	return [...metadata.authProviders ?? [], ...metadata.aliases ?? []].map((provider) => ({ provider }));
}
function toolMetadataPasses(params) {
	const authSignals = listToolAuthSignals(params.metadata);
	if (!params.metadata.configSignals?.length && authSignals.length === 0) return true;
	if (params.metadata.configSignals?.some((signal) => manifestConfigSignalPasses({
		config: params.config,
		env: params.env,
		signal
	}))) return true;
	return authSignals.some((signal) => manifestProviderBaseUrlGuardPasses({
		config: params.config,
		guard: signal.providerBaseUrl
	}) && (params.hasAuthForProvider?.(signal.provider) || hasNonEmptyManifestEnvCandidate(params.env, manifestPluginSetupProviderEnvVars(params.plugin, signal.provider))));
}
function hasManifestToolAvailability(params) {
	return params.toolNames.some((toolName) => {
		const metadata = params.plugin.toolMetadata?.[toolName];
		return !metadata || toolMetadataPasses({
			plugin: params.plugin,
			metadata,
			config: params.config,
			env: params.env,
			hasAuthForProvider: params.hasAuthForProvider
		});
	});
}
//#endregion
export { manifestProviderBaseUrlGuardPasses as a, manifestPluginSetupProviderEnvVars as i, hasNonEmptyManifestEnvCandidate as n, manifestConfigSignalPasses as r, hasManifestToolAvailability as t };
