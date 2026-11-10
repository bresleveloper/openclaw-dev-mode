import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as isBuiltInDefaultSecretProviderRef } from "./ref-contract-Bfd9_-Lp.mjs";
import { h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-BueGE3VV.mjs";
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
function manifestConfigSignalPasses(params) {
	const root = readPath(params.config, params.signal.rootPath);
	if (!isRecord(root)) return false;
	const overlay = readPath(root, params.signal.overlayPath);
	const baseConfig = isRecord(overlay) ? {
		...root,
		...overlay
	} : root;
	const passes = (effectiveConfig) => {
		const modeSignal = params.signal.mode;
		if (modeSignal) {
			const modePath = modeSignal.path?.trim() || "mode";
			const mode = normalizeOptionalString(readPath(effectiveConfig, modePath)) ?? modeSignal.default;
			if (!mode) return false;
			if (modeSignal.allowed?.length && !modeSignal.allowed.includes(mode)) return false;
			if (modeSignal.disallowed?.includes(mode)) return false;
		}
		const hasValue = (path) => {
			const value = readPath(effectiveConfig, path);
			const secretRef = parseSecretRef(value, params.config?.secrets?.defaults);
			if (secretRef?.source === "env") return canResolveEnvSecretRefInReadOnlyPath({
				cfg: params.config,
				provider: secretRef.provider,
				id: secretRef.id
			}) && Boolean(params.env[secretRef.id]?.trim());
			if (secretRef) return (params.config?.secrets?.providers?.[secretRef.provider])?.source === secretRef.source || isBuiltInDefaultSecretProviderRef(params.config ?? {}, secretRef);
			if (typeof value === "string") return value.trim().length > 0;
			if (Array.isArray(value)) return value.length > 0;
			if (isRecord(value)) return Object.keys(value).length > 0;
			return value !== void 0 && value !== null;
		};
		const requiredAny = params.signal.requiredAny ?? [];
		return (params.signal.required ?? []).every(hasValue) && (requiredAny.length === 0 || requiredAny.some(hasValue));
	};
	if (!params.signal.overlayMapPath?.trim()) return passes(baseConfig);
	const overlayMap = readPath(baseConfig, params.signal.overlayMapPath);
	return isRecord(overlayMap) && Object.entries(overlayMap).toSorted(([left], [right]) => left.localeCompare(right)).some(([, mapOverlay]) => isRecord(mapOverlay) && passes({
		...baseConfig,
		...mapOverlay
	}));
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
function hasManifestToolAvailability(params) {
	return params.toolNames.some((toolName) => {
		const metadata = params.plugin.toolMetadata?.[toolName];
		if (!metadata) return true;
		const authSignals = metadata.authSignals?.length ? metadata.authSignals : [...metadata.authProviders ?? [], ...metadata.aliases ?? []].map((provider) => ({ provider }));
		if (!metadata.configSignals?.length && authSignals.length === 0) return true;
		if (metadata.configSignals?.some((signal) => manifestConfigSignalPasses({
			config: params.config,
			env: params.env,
			signal
		}))) return true;
		return authSignals.some((signal) => manifestProviderBaseUrlGuardPasses({
			config: params.config,
			guard: signal.providerBaseUrl
		}) && (params.hasAuthForProvider?.(signal.provider) || hasNonEmptyManifestEnvCandidate(params.env, manifestPluginSetupProviderEnvVars(params.plugin, signal.provider))));
	});
}
//#endregion
export { manifestProviderBaseUrlGuardPasses as a, manifestPluginSetupProviderEnvVars as i, hasNonEmptyManifestEnvCandidate as n, manifestConfigSignalPasses as r, hasManifestToolAvailability as t };
