import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/sessions/model-overrides.ts
const MODEL_SELECTION_LOCKED_MESSAGE = "Model selection is locked for this session.";
const MODEL_SELECTION_LOCKED_RESET_MESSAGE = "This session cannot be reset while model selection is locked.";
const MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE = "Model-selection-locked sessions cannot create child sessions from parent context.";
/** Raised when a caller attempts to mutate a locked session model selection. */
var ModelSelectionLockedError = class extends Error {
	constructor(message = MODEL_SELECTION_LOCKED_MESSAGE) {
		super(message);
		this.name = "ModelSelectionLockedError";
	}
};
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
	let updated = false;
	let selectionUpdated = false;
	let profileUpdated = false;
	if (selection.isDefault) {
		if (params.explicitDefaultSelection && entry.modelOverrideSource !== "default") {
			entry.modelOverrideSource = "default";
			updated = true;
			selectionUpdated = true;
		} else if (!params.explicitDefaultSelection && entry.modelOverrideSource !== void 0) {
			delete entry.modelOverrideSource;
			updated = true;
			selectionUpdated = true;
		}
		for (const key of ["providerOverride", "modelOverride"]) if (entry[key]) {
			delete entry[key];
			updated = true;
			selectionUpdated = true;
		}
		if (entry.modelOverrideRouteResolution) {
			delete entry.modelOverrideRouteResolution;
			updated = true;
		}
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
	} else if (!params.preserveAuthProfileOverride) {
		for (const key of ["authProfileOverride", "authProfileOverrideSource"]) if (entry[key]) {
			delete entry[key];
			profileUpdated = true;
		}
	}
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
export { applyModelOverrideToSessionEntry as a, repairProviderWrappedModelOverride as c, ModelSelectionLockedError as i, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE as n, assertModelSelectionUnlocked as o, MODEL_SELECTION_LOCKED_RESET_MESSAGE as r, isModelSelectionLocked as s, MODEL_SELECTION_LOCKED_MESSAGE as t };
