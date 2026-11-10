import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as MODEL_SELECTION_LOCKED_MESSAGE, s as ModelSelectionLockedError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
//#region src/sessions/model-overrides.ts
const MODEL_SELECTION_LOCKED_RESET_MESSAGE = "This session cannot be reset while model selection is locked.";
const MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE = "Model-selection-locked sessions cannot create child sessions from parent context.";
function isModelSelectionLocked(entry) {
	return entry?.modelSelectionLocked === true;
}
/** A locked harness owns both model selection and transcript lineage. */
function assertModelSelectionUnlocked(entry, message = MODEL_SELECTION_LOCKED_MESSAGE) {
	if (isModelSelectionLocked(entry)) throw new ModelSelectionLockedError(message);
}
function clearDefinedFields(entry, ...keys) {
	let updated = false;
	for (const key of keys) if (entry[key] !== void 0) {
		delete entry[key];
		updated = true;
	}
	return updated;
}
function setField(entry, key, value) {
	if (entry[key] === value) return false;
	entry[key] = value;
	return true;
}
/** Applies a model/auth-profile override to a session entry and clears stale runtime fields. */
function applyModelOverrideToSessionEntry(params) {
	const { entry, selection, profileOverride } = params;
	assertModelSelectionUnlocked(entry);
	const profileOverrideSource = params.profileOverrideSource ?? "user";
	const selectionSource = params.selectionSource ?? "user";
	let updated;
	let selectionUpdated;
	let profileUpdated = false;
	if (selection.isDefault) {
		selectionUpdated = params.explicitDefaultSelection ? setField(entry, "modelOverrideSource", "default") : clearDefinedFields(entry, "modelOverrideSource");
		selectionUpdated = clearDefinedFields(entry, "providerOverride", "modelOverride") || selectionUpdated;
		updated = clearDefinedFields(entry, "modelOverrideRouteResolution") || selectionUpdated;
	} else {
		selectionUpdated = setField(entry, "providerOverride", selection.provider);
		selectionUpdated = setField(entry, "modelOverride", selection.model) || selectionUpdated;
		updated = setField(entry, "modelOverrideSource", selectionSource) || selectionUpdated;
		updated = setField(entry, "modelOverrideRouteResolution", "resolved") || updated;
	}
	updated = clearDefinedFields(entry, "modelOverrideFallbackOriginProvider", "modelOverrideFallbackOriginModel") || updated;
	const runtimeModel = normalizeOptionalString(entry.model) ?? "";
	const runtimeProvider = normalizeOptionalString(entry.modelProvider) ?? "";
	const runtimePresent = runtimeModel.length > 0 || runtimeProvider.length > 0;
	const runtimeAligned = runtimeModel === selection.model && (runtimeProvider.length === 0 || runtimeProvider === selection.provider);
	if (runtimePresent && (selectionUpdated || !runtimeAligned)) updated = clearDefinedFields(entry, "model", "modelProvider") || updated;
	if (selection.isDefault && runtimePresent && !runtimeAligned) selectionUpdated = true;
	if (selectionUpdated || runtimePresent && !runtimeAligned) updated = clearDefinedFields(entry, "contextTokens", "contextTokensSource", "contextBudgetStatus") || updated;
	if (profileOverride) {
		profileUpdated = setField(entry, "authProfileOverride", profileOverride);
		profileUpdated = setField(entry, "authProfileOverrideSource", profileOverrideSource) || profileUpdated;
	} else if (!params.preserveAuthProfileOverride) profileUpdated = clearDefinedFields(entry, "authProfileOverride", "authProfileOverrideSource");
	updated = profileUpdated || updated;
	if (profileOverride || !params.preserveAuthProfileOverride) updated = clearDefinedFields(entry, "authProfileOverrideCompactionCount") || updated;
	if (updated) {
		if ((selectionUpdated || profileUpdated) && params.markLiveSwitchPending) entry.liveModelSwitchPending = true;
		delete entry.fallbackNotice;
		entry.updatedAt = Date.now();
	}
	return { updated };
}
/** Repairs overrides where legacy provider/model fields were stored as provider/model strings. */
function repairProviderWrappedModelOverride(params) {
	const overrideProvider = normalizeOptionalString(params.entry.providerOverride);
	const overrideModel = normalizeOptionalString(params.entry.modelOverride);
	if (!overrideProvider || !overrideModel) return { updated: false };
	const wrappedModel = `${overrideProvider}/${overrideModel}`;
	const runtimeProvider = normalizeOptionalString(params.entry.modelProvider);
	const runtimeModel = normalizeOptionalString(params.entry.model);
	if (runtimeProvider && runtimeModel === wrappedModel && runtimeProvider !== overrideProvider) return applyModelOverrideToSessionEntry({
		entry: params.entry,
		selection: {
			provider: runtimeProvider,
			model: runtimeModel,
			isDefault: runtimeProvider === params.defaultProvider && runtimeModel === params.defaultModel
		},
		selectionSource: params.entry.modelOverrideSource === "auto" ? "auto" : "user"
	});
	if (params.defaultProvider !== overrideProvider && params.defaultModel === wrappedModel) return applyModelOverrideToSessionEntry({
		entry: params.entry,
		selection: {
			provider: params.defaultProvider,
			model: params.defaultModel,
			isDefault: true
		}
	});
	return { updated: false };
}
//#endregion
export { isModelSelectionLocked as a, assertModelSelectionUnlocked as i, MODEL_SELECTION_LOCKED_RESET_MESSAGE as n, repairProviderWrappedModelOverride as o, applyModelOverrideToSessionEntry as r, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE as t };
