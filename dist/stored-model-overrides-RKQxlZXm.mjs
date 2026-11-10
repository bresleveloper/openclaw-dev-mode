import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { a as resolveSessionModelOverrideRouteResolution, t as hasSessionActiveAutoModelFallback } from "./model-override-provenance-ByJqxWxk.mjs";
import { r as resolveSessionParentSessionKey } from "./session-conversation-DnUQmZJM.mjs";
import { o as normalizeStoredOverrideModel, s as resolvePersistedOverrideModelRef } from "./model-selection-DdQ-ffuG.mjs";
//#region src/sessions/stored-model-overrides.ts
function resolveStoredOverrideFromEntry(params) {
	if (params.entry?.modelOverrideSource === "default") return null;
	const routeResolution = resolveSessionModelOverrideRouteResolution(params.entry);
	const normalized = normalizeStoredOverrideModel({
		providerOverride: params.entry?.providerOverride,
		modelOverride: params.entry?.modelOverride,
		routeResolution
	});
	const ref = resolvePersistedOverrideModelRef({
		defaultProvider: params.defaultProvider,
		overrideProvider: normalized.providerOverride,
		overrideModel: normalized.modelOverride,
		routeResolution,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
	return ref ? {
		...ref,
		source: params.source,
		routeResolution
	} : null;
}
/** Resolves only the current session's persisted model override. */
function resolveDirectStoredModelOverride(params) {
	return resolveStoredOverrideFromEntry({
		entry: params.sessionEntry,
		defaultProvider: params.defaultProvider,
		source: "session",
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
}
function resolveParentSessionKeyCandidate(params) {
	const explicit = normalizeOptionalString(params.parentSessionKey);
	if (explicit && explicit !== params.sessionKey) return explicit;
	const derived = resolveSessionParentSessionKey(params.sessionKey);
	if (derived && derived !== params.sessionKey) return derived;
	return null;
}
/** @deprecated Use resolveStoredModelOverrideAsync; final compatibility day: 2026-12-31. */
function resolveStoredModelOverride(params) {
	warnPluginSdkDeprecation({
		family: "session-model-override",
		method: "resolveStoredModelOverride",
		replacement: "resolveStoredModelOverrideAsync"
	});
	return resolveStoredModelOverrideCore({
		loadSessionEntry: params.loadSessionEntry,
		sessionEntry: params.sessionEntry,
		sessionStore: params.sessionStore,
		sessionKey: params.sessionKey,
		parentSessionKey: params.parentSessionKey,
		defaultProvider: params.defaultProvider,
		allowPluginNormalization: params.allowPluginNormalization
	});
}
/** Resolve inherited model selection without synchronous session-store access. */
async function resolveStoredModelOverrideAsync(params) {
	if (params.sessionEntry?.modelOverrideSource === "default") return null;
	const direct = resolveDirectStoredModelOverride(params);
	if (direct) return direct;
	const parentKey = resolveParentSessionKeyCandidate(params);
	if (!parentKey) return null;
	return resolveParentStoredModelOverride(params, await params.loadSessionEntry?.(parentKey) ?? params.sessionStore?.[parentKey]);
}
/** Resolves the persisted model override visible to the current session. */
function resolveStoredModelOverrideCore(params) {
	if (params.sessionEntry?.modelOverrideSource === "default") return null;
	const direct = resolveDirectStoredModelOverride(params);
	if (direct) return direct;
	const parentKey = resolveParentSessionKeyCandidate(params);
	if (!parentKey) return null;
	return resolveParentStoredModelOverride(params, params.loadSessionEntry?.(parentKey) ?? params.sessionStore?.[parentKey]);
}
function resolveParentStoredModelOverride(params, parentEntry) {
	if (hasSessionActiveAutoModelFallback(parentEntry)) return null;
	return resolveStoredOverrideFromEntry({
		entry: parentEntry,
		defaultProvider: params.defaultProvider,
		source: "parent",
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
}
//#endregion
export { resolveStoredModelOverrideCore as i, resolveStoredModelOverride as n, resolveStoredModelOverrideAsync as r, resolveDirectStoredModelOverride as t };
