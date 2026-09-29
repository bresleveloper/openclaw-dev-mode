import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { T as hasSessionActiveAutoModelFallback, k as resolveSessionModelOverrideRouteResolution } from "./agent-scope-CTuYDtny.mjs";
import { l as normalizeStoredOverrideModel, u as resolvePersistedOverrideModelRef } from "./model-selection-CaFyCMqp.mjs";
import { r as resolveSessionParentSessionKey } from "./session-conversation-Bpasei-d.mjs";
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
/** Keep prepared host metadata outside the published command resolver contract. */
function resolveStoredModelOverride(params) {
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
/** Resolves the persisted model override visible to the current session. */
function resolveStoredModelOverrideCore(params) {
	if (params.sessionEntry?.modelOverrideSource === "default") return null;
	const direct = resolveDirectStoredModelOverride({
		sessionEntry: params.sessionEntry,
		defaultProvider: params.defaultProvider,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
	if (direct) return direct;
	const parentKey = resolveParentSessionKeyCandidate({
		sessionKey: params.sessionKey,
		parentSessionKey: params.parentSessionKey
	});
	if (!parentKey) return null;
	const parentEntry = params.loadSessionEntry?.(parentKey) ?? params.sessionStore?.[parentKey];
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
export { resolveStoredModelOverride as n, resolveStoredModelOverrideCore as r, resolveDirectStoredModelOverride as t };
