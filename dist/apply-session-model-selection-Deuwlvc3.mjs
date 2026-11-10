import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as MODEL_SELECTION_LOCKED_MESSAGE } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { c as resolveContextConfigProviderForRuntime } from "./openai-routing-Bm7d8DH8.mjs";
import { l as createOperatorModelSelectionAssertion, n as assertOperatorModelAllowed } from "./admitted-run-context-h1ULFETN.mjs";
import { c as resolveSystemEventQueueKey } from "./system-event-ownership-DAgHWXZ1.mjs";
import { s as enqueueSystemEvent } from "./system-events-Bf4ozS7L.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-76OxWRqj.mjs";
import { a as isModelSelectionLocked } from "./model-overrides-CgHG3YVT.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-pIK04Peo.mjs";
import { i as resolveOperatorModelDefault } from "./operator-model-policy-3pT6BgLA.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { t as resolveWorkerPlacementCapabilities } from "./placement-capabilities-B7Dg_n0B.mjs";
import "./placement-session-runtime-CaRixRbi.mjs";
import { v as prepareAuthProfileProvider } from "./store-runtime-CwqGD12G.mjs";
import { l as hasPendingFollowupQueueWork, u as refreshQueuedFollowupSession } from "./state-DNPW_vEt.mjs";
import { t as persistStickyModelSelectionBestEffort } from "./sticky-model-selection-BU6sDfPI.mjs";
import "./queue-Cz-W2oxX.mjs";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-Bgv6_R3W.mjs";
import { t as applyModelOverrideWithAuthProfileCompatibility } from "./auth-profile-preservation-UYIf2L8-.mjs";
import { t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-8QOLmJ6L.mjs";
import { a as sessionModelOverrideChangesApplied, n as adoptPersistedSessionSnapshot, t as SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS } from "./session-snapshot-merge-Dh-eJoIb.mjs";
import { a as prepareModelSelectionRuntime, t as findSelectedCatalogEntry } from "./model-runtime-normalization-B2xB-s-G.mjs";
import { t as persistReplySessionEntry } from "./session-entry-persistence-Cq7Ewsn6.mjs";
import { t as resolveContextTokens } from "./model-selection-context-Dlk9ioLA.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-DJzLYZPW.mjs";
import { t as prepareWorkerPlacementSessionRuntime } from "./placement-session-runtime-preparation-DFaRx79O.mjs";
//#region src/model-picker/apply-session-model-selection.ts
function formatModelSwitchEvent(provider, model, alias) {
	const label = `${provider}/${model}`;
	return alias ? `Model switched to ${alias} (${label}).` : `Model switched to ${label}.`;
}
function rejectNotAllowed(provider, model) {
	return {
		status: "rejected",
		reason: "not-allowed",
		message: `Model ${provider}/${model} is not available for this agent.`
	};
}
/**
* Rejects a model selection when the candidate runtime is incompatible with an
* active cloud-worker placement. Mirrors the sessions.patch guard so directive
* model changes are validated before they persist.
*/
function resolveActivePlacementModelSelectionError(params, prepared) {
	if (!params.entry.sessionId) return;
	const placement = prepared.placement;
	if (!placement || placement.state === "local") return;
	const { executionMode } = params.readRuntimeCapabilities();
	if (executionMode === placement.executionMode) return;
	return executionMode ? `Session cannot change cloud placement execution mode while placement is ${placement.state}.` : `Session cannot select a runtime without cloud placement support while cloud worker placement is ${placement.state}.`;
}
/** Applies one validated picker selection to the authoritative live session. */
async function applySessionModelSelectionInternal(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const startingStoreEntry = params.sessionStore[params.sessionKey];
		const startingEntry = params.storePath ? params.sessionEntry : startingStoreEntry ?? params.sessionEntry;
		const initialEntry = { ...startingEntry };
		if (isModelSelectionLocked(startingEntry)) return {
			status: "rejected",
			reason: "locked",
			message: MODEL_SELECTION_LOCKED_MESSAGE
		};
		const operatorScope = params.operatorAuthority ? void 0 : (await import("./operator-invocation-authority-DgSC7tCJ.mjs")).captureOperatorToolGatewayAuthority();
		const operatorAuthority = params.operatorAuthority ?? operatorScope?.authority;
		const resetToDefault = params.request.resetToDefault === true;
		const policy = params.modelPolicy ?? createModelVisibilityPolicy({
			cfg: params.cfg,
			catalog: [...params.modelCatalog],
			defaultProvider: params.defaultProvider,
			defaultModel: {
				provider: params.defaultProvider,
				model: params.defaultModel
			},
			agentId: params.agentId
		});
		const selectedRef = resetToDefault ? resolveOperatorModelDefault({
			cfg: params.cfg,
			agentId: params.agentId,
			policy: operatorAuthority?.modelPolicy,
			model: resolveDefaultModelForAgent({
				cfg: params.cfg,
				agentId: params.agentId
			}),
			allows: policy.allows
		}) : params.request;
		const validateOperatorSelection = () => {
			try {
				operatorScope?.assertCurrent();
				assertOperatorModelAllowed(operatorAuthority, selectedRef);
				return;
			} catch (error) {
				return formatErrorMessage(error);
			}
		};
		const operatorError = validateOperatorSelection();
		if (operatorError || !selectedRef) return {
			status: "rejected",
			reason: "not-allowed",
			message: operatorError ?? "No model is available for this operator role and agent."
		};
		const normalizedModelKey = modelKey(selectedRef.provider, selectedRef.model);
		const request = {
			...params.request,
			provider: selectedRef.provider,
			model: selectedRef.model,
			isDefault: resetToDefault || normalizedModelKey === modelKey(params.defaultProvider, params.defaultModel)
		};
		if (!resetToDefault && !policy.allows(request)) return rejectNotAllowed(request.provider, request.model);
		const prepared = await prepareModelSelectionRuntime({
			cfg: params.cfg,
			agentId: params.agentId,
			workspaceDir: startingEntry.spawnedWorkspaceDir,
			sessionEntry: startingEntry,
			profileOverride: request.profileOverride,
			provider: request.provider,
			model: request.model,
			catalog: params.thinkingCatalog ?? params.modelCatalog,
			thinkingPolicyRequired: hasPendingFollowupQueueWork([params.sessionKey]),
			rawRuntime: request.runtime.kind === "set" ? request.runtime.runtime : request.runtime.kind === "clear" ? "default" : void 0
		});
		if (prepared.status === "rejected") return prepared;
		const agentDir = resolveAgentDir(params.cfg, params.agentId);
		const pinnedProfile = !request.profileOverride && startingEntry.authProfileOverride?.trim();
		const recordedProvider = pinnedProfile ? await prepareAuthProfileProvider({
			agentDir,
			profileId: pinnedProfile
		}) : void 0;
		const validateSelection = () => validateOperatorSelection() ?? params.validateAuthProfileSelection?.() ?? prepared.validateRuntimeSelection?.();
		const authProfileError = validateSelection();
		if (authProfileError) return {
			status: "rejected",
			reason: "not-allowed",
			message: authProfileError
		};
		const runtime = prepared.runtime;
		const thinkingCatalog = prepared.catalog;
		const selectedCatalogEntry = findSelectedCatalogEntry({
			catalog: thinkingCatalog,
			...request
		});
		const nextEntry = { ...startingEntry };
		const modelChange = applyModelOverrideWithAuthProfileCompatibility({
			cfg: params.cfg,
			agentDir,
			entry: nextEntry,
			currentProvider: params.currentProvider,
			selection: request,
			explicitDefaultSelection: request.isDefault,
			profileOverride: request.profileOverride,
			recordedProvider,
			markLiveSwitchPending: params.markLiveSwitchPending
		});
		const runtimeChange = applyModelRuntimeDirective(nextEntry, runtime);
		const selectionChanged = modelChange.updated || runtimeChange.updated;
		const placementService = resolveSessionWorkerPlacementContext().workerSessionPlacementService;
		if (nextEntry.sessionId && placementService && !placementService.prepareRuntimeRefresh) return {
			status: "rejected",
			reason: "invalid-runtime",
			message: "Session runtime is unavailable; retry model selection."
		};
		const placementAuthority = nextEntry.sessionId ? await placementService?.prepareRuntimeRefresh?.(nextEntry.sessionId) : void 0;
		_usingCtx$1.u({ [Symbol.dispose]: () => placementAuthority?.release() });
		const placement = placementAuthority?.placement;
		const placementRuntime = await prepareWorkerPlacementSessionRuntime({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			entry: nextEntry
		});
		const readRuntimeCapabilities = () => resolveWorkerPlacementCapabilities(placementRuntime(params.cfg, nextEntry));
		nextEntry.updatedAt = Date.now();
		let persistedEntry;
		let placementError;
		const validateCommit = () => {
			try {
				placementAuthority?.assertCurrent();
			} catch {
				placementError = "Session placement changed; retry model selection.";
				return placementError;
			}
			placementError = resolveActivePlacementModelSelectionError({
				entry: nextEntry,
				readRuntimeCapabilities
			}, { placement });
			return params.validateAuthProfileSelection?.() ?? prepared.validateRuntimeSelection?.() ?? placementError;
		};
		if (params.storePath) {
			const persistence = await persistReplySessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey,
				initialEntry,
				entry: nextEntry,
				allowCreate: params.allowCreate,
				reassertLiveModelSwitchPending: selectionChanged && nextEntry.liveModelSwitchPending === true,
				requireModelSelectionUnlocked: true,
				touchedFields: SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS,
				commitGuard: composeSessionSourceAssertion([operatorScope?.assertCurrent, createOperatorModelSelectionAssertion(operatorAuthority, selectedRef)]),
				validateCommit,
				nativeCommitValidation: params.nativeCommitValidation
			});
			if (persistence.entry) {
				params.sessionStore[params.sessionKey] = persistence.entry;
				adoptPersistedSessionSnapshot(params.sessionEntry, persistence.entry);
			}
			if (persistence.status === "model-selection-locked") return {
				status: "rejected",
				reason: "locked",
				message: MODEL_SELECTION_LOCKED_MESSAGE
			};
			if (persistence.status === "commit-rejected") return {
				status: "rejected",
				reason: placementError ? "invalid-runtime" : "not-allowed",
				message: persistence.error
			};
			if (persistence.status !== "current" || !sessionModelOverrideChangesApplied({
				initial: initialEntry,
				next: nextEntry,
				current: persistence.entry,
				reassertLiveModelSwitchPending: selectionChanged && nextEntry.liveModelSwitchPending === true
			})) return {
				status: "conflict",
				message: "Model change was not applied because the session changed. Retry."
			};
			persistedEntry = persistence.entry;
		} else {
			const commitError = validateOperatorSelection() ?? validateCommit();
			if (commitError) return {
				status: "rejected",
				reason: placementError ? "invalid-runtime" : "not-allowed",
				message: commitError
			};
			const currentEntry = params.sessionStore[params.sessionKey] ?? params.sessionEntry;
			if (isModelSelectionLocked(currentEntry)) return {
				status: "rejected",
				reason: "locked",
				message: MODEL_SELECTION_LOCKED_MESSAGE
			};
			if (params.sessionStore[params.sessionKey] !== startingStoreEntry || currentEntry.sessionId !== initialEntry.sessionId) return {
				status: "conflict",
				message: "Model change was not applied because the session changed. Retry."
			};
			adoptPersistedSessionSnapshot(params.sessionEntry, nextEntry);
			params.sessionStore[params.sessionKey] = params.sessionEntry;
			persistedEntry = params.sessionEntry;
		}
		const agentRuntime = resolveEffectiveAgentRuntime({
			cfg: params.cfg,
			provider: request.provider,
			modelId: request.model,
			modelApi: selectedCatalogEntry?.api,
			modelBaseUrl: selectedCatalogEntry?.baseUrl,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionEntry: persistedEntry
		});
		const provider = request.provider;
		const model = request.model;
		const effectiveModelRef = `${provider}/${model}`;
		operatorScope?.assertCurrent();
		assertOperatorModelAllowed(operatorAuthority, request);
		const configuredDefaultUpdate = params.canPersistStickyModelSelection === true && (!request.isDefault || params.stickyModelSelectionTarget) ? persistStickyModelSelectionBestEffort({
			agentId: params.agentId,
			model: effectiveModelRef,
			target: params.stickyModelSelectionTarget ?? "effective"
		}) : void 0;
		if (selectionChanged) {
			emitSessionLifecycleEvent({
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				reason: "patch",
				catalogChanged: true
			});
			triggerSessionPatchHook({
				cfg: params.cfg,
				sessionEntry: persistedEntry,
				sessionKey: params.sessionKey,
				patch: {
					key: params.sessionKey,
					model: params.patchModel ?? effectiveModelRef
				}
			});
			refreshQueuedFollowupSession({
				key: params.sessionKey,
				nextProvider: provider,
				nextModel: model,
				nextRouteResolution: "resolved",
				nextModelOverrideSource: request.isDefault ? void 0 : "user",
				nextAuthProfileId: persistedEntry.authProfileOverride,
				nextAuthProfileIdSource: resolveCollapsedSessionAuthPinSource(persistedEntry),
				nextThinking: {
					level: persistedEntry.thinkingLevel,
					catalog: [...thinkingCatalog],
					agentRuntime
				}
			});
		}
		if (`${params.currentProvider}/${params.currentModel}` !== effectiveModelRef) enqueueSystemEvent(formatModelSwitchEvent(provider, model, request.alias), {
			sessionKey: resolveSystemEventQueueKey(params.sessionKey, params.agentId),
			contextKey: `model:${effectiveModelRef}`
		});
		const contextProvider = resolveContextConfigProviderForRuntime({
			provider,
			runtimeId: agentRuntime,
			config: params.cfg
		});
		return {
			status: "applied",
			provider,
			model,
			effectiveModelRef,
			agentRuntime,
			changed: selectionChanged,
			contextTokens: resolveContextTokens({
				cfg: params.cfg,
				provider: contextProvider,
				model,
				modelContextWindow: selectedCatalogEntry?.contextWindow,
				modelContextTokens: selectedCatalogEntry?.contextTokens
			}),
			...configuredDefaultUpdate ? { configuredDefaultUpdate } : {},
			...runtime.kind === "clear" || runtime.kind === "set" ? { runtimeChange: runtime } : {}
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
export { applySessionModelSelectionInternal as t };
