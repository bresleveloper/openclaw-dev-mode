import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { s as getModelRefStatus } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { n as assertOperatorModelAllowed } from "./admitted-run-context-h1ULFETN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { I as prepareSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import "./session-sharing-DuL10izq.mjs";
import { t as resolveAllowedModelRefCore } from "./model-selection-resolve-B4Z5ZIMD.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-pIK04Peo.mjs";
import { i as resolveOperatorModelDefault } from "./operator-model-policy-3pT6BgLA.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { u as refreshQueuedFollowupSession } from "./state-DNPW_vEt.mjs";
import { o as resolveAgentHarnessSessionExecutionRestriction } from "./execution-environment-DP1yYe5g.mjs";
import { t as persistStickyModelSelectionBestEffort } from "./sticky-model-selection-BU6sDfPI.mjs";
import { t as resolveGatewayModelSelectionPolicy } from "./session-model-selection-policy-Ch870Lfm.mjs";
import "./queue-Cz-W2oxX.mjs";
import { a as assertRequiredWorkerSelection } from "./required-worker-profile-B0DIhkdC.mjs";
import { n as isSessionStatusModelPatchOrigin } from "./session-model-patch-origin-7_HzyeSY.mjs";
import { t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-8QOLmJ6L.mjs";
import { a as prepareModelSelectionRuntime } from "./model-runtime-normalization-B2xB-s-G.mjs";
import { i as prepareSessionWorkerPlacementPatchValidation } from "./sessions-shared-DECO-QN2.mjs";
//#region src/gateway/server-methods/sessions-patch-model-selection.ts
function persistSessionPatchModelSelection(params) {
	if (isSessionStatusModelPatchOrigin() || typeof params.patch.model !== "string" || params.patch.sandboxMode !== void 0 || params.patch.nativeRuntimeConsent !== void 0 || params.entry.nativeRuntimeConsent !== void 0) return;
	const policy = resolveGatewayModelSelectionPolicy({
		callerScopes: params.callerScopes,
		cfg: params.cfg
	});
	if (policy.target === "session") return;
	const agentId = resolveSessionAgentId({
		config: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.targetAgentId
	});
	const resolved = resolveSessionModelRef(params.cfg, params.entry, agentId);
	persistStickyModelSelectionBestEffort({
		agentId,
		model: `${resolved.provider}/${resolved.model}`,
		target: policy.target === "agent" ? "agent" : "defaults"
	});
}
/** Refresh only after commit, while this patch still holds session mutation ordering. */
function refreshSessionPatchQueuedSelection(params) {
	const modelSelectionChanged = "agentRuntime" in params.patch || params.patch.model !== void 0;
	if (!modelSelectionChanged && params.patch.thinkingLevel === void 0) return;
	const { cfg, entry, sessionKey, agentId } = params;
	const model = resolveSessionModelRef(cfg, entry, agentId);
	refreshQueuedFollowupSession({
		key: sessionKey,
		...modelSelectionChanged ? {
			nextProvider: model.provider,
			nextModel: model.model,
			nextRouteResolution: entry.modelOverrideRouteResolution,
			nextModelOverrideSource: entry.modelOverrideSource === "default" ? void 0 : entry.modelOverrideSource,
			nextAuthProfileId: entry.authProfileOverride,
			nextAuthProfileIdSource: resolveCollapsedSessionAuthPinSource(entry)
		} : {},
		nextThinking: {
			level: entry.thinkingLevel,
			catalog: params.catalog,
			agentRuntime: resolveEffectiveAgentRuntime({
				cfg,
				provider: model.provider,
				modelId: model.model,
				agentId,
				sessionKey,
				sessionEntry: entry
			})
		}
	});
}
function resolveSessionPatchModelSelection(params) {
	const { cfg, agentId } = params;
	const { model: modelWithoutProfile, profile } = splitTrailingAuthProfile(params.raw);
	const configuredDefault = resolveDefaultModelForAgent({
		cfg,
		agentId
	});
	const isDefault = (ref) => ref.provider === configuredDefault.provider && ref.model === configuredDefault.model;
	const policy = {
		cfg,
		agentId,
		catalog: params.catalog,
		defaultProvider: params.defaultProvider,
		defaultModel: params.subagentModelHint ?? {
			provider: params.defaultProvider,
			model: params.defaultModel
		}
	};
	if (params.preparedModelSelection) {
		const ref = params.preparedModelSelection;
		if (modelWithoutProfile !== `${ref.provider}/${ref.model}`) return {
			ok: false,
			error: "Resolved spawn model does not match the requested model."
		};
		const status = getModelRefStatus({
			...policy,
			ref
		});
		return status.allowed ? {
			ok: true,
			...ref,
			...profile ? { profile } : {},
			isDefault: isDefault(ref)
		} : {
			ok: false,
			error: `model not allowed: ${status.key}`
		};
	}
	const resolved = resolveAllowedModelRefCore({
		...policy,
		raw: modelWithoutProfile
	});
	if ("error" in resolved) return {
		ok: false,
		error: resolved.error
	};
	return {
		ok: true,
		provider: resolved.ref.provider,
		model: resolved.ref.model,
		...profile ? { profile } : {},
		isDefault: isDefault(resolved.ref)
	};
}
/** Bind a canonical selection to the original operator through preparation and commit. */
function prepareSessionPatchModelSelection(params) {
	const selected = params.resetToDefault && params.operatorAuthority?.modelPolicy ? resolveOperatorModelDefault({
		cfg: params.cfg,
		agentId: params.agentId,
		policy: params.operatorAuthority.modelPolicy,
		model: params.selection,
		allows: createModelVisibilityPolicy({
			cfg: params.cfg,
			agentId: params.agentId,
			catalog: [],
			defaultProvider: params.selection.provider,
			defaultModel: params.selection
		}).allows
	}) : params.selection;
	const validate = () => {
		try {
			assertOperatorModelAllowed(params.operatorAuthority, selected);
			return;
		} catch (error) {
			return error instanceof SessionMutationAuthorizationChangedError ? error.error : errorShape(ErrorCodes.FORBIDDEN, formatErrorMessage(error));
		}
	};
	const error = validate();
	if (error || !selected) return {
		ok: false,
		error: error ?? errorShape(ErrorCodes.FORBIDDEN, "No model is available for this operator role and agent.")
	};
	return {
		ok: true,
		selection: {
			...params.selection,
			...selected
		},
		validate
	};
}
/** Native selection and session operations expose the same per-chat recovery contract. */
function resolveSessionNativeRuntimeRestriction(params) {
	const { harness } = params;
	const restriction = resolveAgentHarnessSessionExecutionRestriction(params);
	if (!restriction) return;
	const optional = restriction.reason !== "sandbox-required" && restriction.reason !== "remote-execution";
	const persisted = params.persistedEntry;
	if (params.operation === "selection" && !persisted && optional) return;
	const canRecover = params.callerCanConsent && optional && persisted;
	const details = {
		code: "AGENT_RUNTIME_RESTRICTED",
		runtimeId: harness.id,
		runtimeLabel: harness.label,
		reason: restriction.reason,
		...canRecover ? { recovery: {
			action: "use-native-permissions",
			sessionId: persisted.sessionId,
			...persisted.lifecycleRevision ? { lifecycleRevision: persisted.lifecycleRevision } : {},
			expectedPermissionMode: persisted.permissionMode ?? null,
			expectedSandboxMode: persisted.sandboxMode ?? null,
			expectedNativeRuntimeConsent: persisted.nativeRuntimeConsent ?? null
		} } : {}
	};
	return errorShape(ErrorCodes.INVALID_REQUEST, restriction.message, { details });
}
/** Bind runtime availability and placement checks to the selection's commit guard. */
async function prepareSessionPatchRuntimeSelection(params) {
	const invalid = (message) => ({
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, message)
	});
	try {
		assertRequiredWorkerSelection(params.cfg, params.patch);
	} catch (error) {
		return invalid(formatErrorMessage(error));
	}
	let validateRuntime;
	let validateEnvironment;
	let releaseEnvironment;
	const grantingConsent = typeof params.patch.nativeRuntimeConsent === "string";
	const modelError = params.validateModelSelection?.();
	if (modelError) return {
		ok: false,
		error: modelError
	};
	if (typeof params.patch.agentRuntime === "string" || typeof params.patch.model === "string" || grantingConsent) {
		const model = resolveSessionModelRef(params.cfg, params.entry, params.agentId);
		const previousModel = params.expectedEntry ? resolveSessionModelRef(params.cfg, params.expectedEntry, params.agentId) : void 0;
		const requestedProfile = typeof params.patch.model === "string" ? splitTrailingAuthProfile(params.patch.model).profile : void 0;
		if (!(params.patch.agentRuntime === void 0 && !grantingConsent && requestedProfile !== void 0 && previousModel?.provider === model.provider && previousModel.model === model.model && params.expectedEntry?.authProfileOverride === params.entry.authProfileOverride)) {
			const choice = await prepareModelSelectionRuntime({
				cfg: params.cfg,
				agentId: params.agentId,
				workspaceDir: params.entry.spawnedWorkspaceDir,
				...model,
				catalog: params.catalog ?? [],
				hydrateThinkingCatalog: params.hydrateThinkingCatalog,
				rawRuntime: typeof params.patch.agentRuntime === "string" ? params.patch.agentRuntime : void 0,
				sessionEntry: {
					...params.entry,
					authProfileOverrideSource: resolveCollapsedSessionAuthPinSource(params.entry)
				}
			});
			if (choice.status === "rejected") return invalid(choice.message);
			applyModelRuntimeDirective(params.entry, choice.runtime);
			validateRuntime = choice.validateRuntimeSelection;
			const harness = choice.harness;
			if (grantingConsent) {
				if (!harness || harness.executionEnvironment !== "host-only" || harness.id !== params.patch.nativeRuntimeConsent) return invalid("Native runtime consent does not match the selected external runtime.");
				params.entry.nativeRuntimeConsent = harness.id;
			}
			if (harness) {
				const environment = await prepareSessionCapabilityRead(() => resolveSessionNativeRuntimeRestriction({
					operation: "selection",
					cfg: params.cfg,
					agentId: params.agentId,
					sessionKey: params.placement?.sessionKey ?? params.patch.key,
					entry: params.entry,
					persistedEntry: params.expectedEntry,
					harness,
					provider: model.provider,
					modelId: model.model,
					callerCanConsent: params.callerCanConsent === true
				}));
				validateEnvironment = environment.read;
				releaseEnvironment = environment.release;
			}
		}
	}
	const placementParams = params.placement && {
		cfg: params.cfg,
		agentId: params.agentId,
		context: params.placement.context,
		entry: params.entry,
		key: params.patch.key,
		sessionKey: params.placement.sessionKey,
		patch: params.patch,
		validateModelRuntime: true
	};
	let placementValidation;
	const release = () => {
		releaseEnvironment?.();
		placementValidation?.release();
	};
	const validate = () => {
		try {
			assertRequiredWorkerSelection(params.cfg, {
				agentRuntime: params.entry.agentRuntimeOverride,
				execNode: params.entry.execNode
			});
		} catch (error) {
			return errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error));
		}
		const policyError = params.validateModelSelection?.() || validateEnvironment?.();
		if (policyError) return policyError;
		const message = validateRuntime?.() ?? placementValidation?.validate();
		return message ? errorShape(ErrorCodes.INVALID_REQUEST, message) : void 0;
	};
	try {
		placementValidation = placementParams ? await prepareSessionWorkerPlacementPatchValidation(placementParams) : void 0;
		const error = validate();
		if (error) {
			release();
			return {
				ok: false,
				error
			};
		}
		return {
			ok: true,
			...params.validateModelSelection || params.patch.agentRuntime !== void 0 || params.patch.model !== void 0 || grantingConsent ? { validate } : {},
			...releaseEnvironment || placementValidation ? { release } : {}
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { resolveSessionNativeRuntimeRestriction as a, refreshSessionPatchQueuedSelection as i, prepareSessionPatchModelSelection as n, resolveSessionPatchModelSelection as o, prepareSessionPatchRuntimeSelection as r, persistSessionPatchModelSelection as t };
