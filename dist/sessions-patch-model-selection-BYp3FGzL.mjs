import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { s as getModelRefStatus } from "./model-selection-shared-DKlQ1p0S.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import { t as resolveAllowedModelRefCore } from "./model-selection-resolve-cpFpShck.mjs";
import { n as assertOperatorModelAllowed } from "./admitted-run-context-QJnFIxUZ.mjs";
import { r as resolveOperatorModelDefault } from "./operator-model-policy-q5o4hsUa.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import "./model-selection-D3_rVb38.mjs";
import { s as resolveEffectiveAgentRuntime } from "./thinking-runtime-DsaB5fLF.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-xnA7gN4_.mjs";
import { r as resolveAgentHarnessSessionExecutionRestriction } from "./execution-environment-D8ss-KeK.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { l as refreshQueuedFollowupSession } from "./state-Dcv8BBPd.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-Dq4ZIwNP.mjs";
import "./session-sharing-50mq9oo9.mjs";
import "./queue-DJQGr33w.mjs";
import { n as isSessionStatusModelPatchOrigin } from "./session-model-patch-origin-mN6xDTM6.mjs";
import { t as persistStickyModelSelectionBestEffort } from "./sticky-model-selection-gOIpdWlu.mjs";
import { s as resolveGatewayModelSelectionPolicy } from "./session-utils-list-DnMUHvjc.mjs";
import { t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-CWNWhYW-.mjs";
import { a as prepareModelSelectionRuntime } from "./model-runtime-normalization-DlYnoh_4.mjs";
import { c as resolveSessionWorkerPlacementPatchError } from "./sessions-shared-CRlp7L3V.mjs";
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
	if (!("agentRuntime" in params.patch) && params.patch.model === void 0) return;
	const { cfg, entry, sessionKey, agentId } = params;
	const model = resolveSessionModelRef(cfg, entry, agentId);
	refreshQueuedFollowupSession({
		key: sessionKey,
		nextProvider: model.provider,
		nextModel: model.model,
		nextRouteResolution: entry.modelOverrideRouteResolution,
		nextModelOverrideSource: entry.modelOverrideSource === "default" ? void 0 : entry.modelOverrideSource,
		nextAuthProfileId: entry.authProfileOverride,
		nextAuthProfileIdSource: resolveCollapsedSessionAuthPinSource(entry),
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
	const { model: modelWithoutProfile, profile } = splitTrailingAuthProfile(params.raw);
	const statusDefault = isSessionStatusModelPatchOrigin() ? resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	}) : void 0;
	const isDefault = (ref) => statusDefault !== void 0 && ref.provider === statusDefault.provider && ref.model === statusDefault.model;
	if (params.preparedModelSelection) {
		const ref = params.preparedModelSelection;
		if (modelWithoutProfile !== `${ref.provider}/${ref.model}`) return {
			ok: false,
			error: "Resolved spawn model does not match the requested model."
		};
		const status = getModelRefStatus({
			cfg: params.cfg,
			agentId: params.agentId,
			catalog: params.catalog,
			ref,
			defaultProvider: params.defaultProvider,
			defaultModel: params.subagentModelHint ?? {
				provider: params.defaultProvider,
				model: params.defaultModel
			}
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
		cfg: params.cfg,
		agentId: params.agentId,
		catalog: params.catalog,
		raw: modelWithoutProfile,
		defaultProvider: params.defaultProvider,
		defaultModel: params.subagentModelHint ?? {
			provider: params.defaultProvider,
			model: params.defaultModel
		}
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
	let validateRuntime;
	let validateEnvironment;
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
			if (harness) validateEnvironment = () => resolveSessionNativeRuntimeRestriction({
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
			});
		}
	}
	const validate = () => {
		const selectionError = params.validateModelSelection?.();
		if (selectionError) return selectionError;
		const environmentError = validateEnvironment?.();
		if (environmentError) return environmentError;
		const message = validateRuntime?.() ?? (params.placement ? resolveSessionWorkerPlacementPatchError({
			cfg: params.cfg,
			agentId: params.agentId,
			context: params.placement.context,
			entry: params.entry,
			key: params.patch.key,
			sessionKey: params.placement.sessionKey,
			patch: params.patch,
			validateModelRuntime: true
		}) : void 0);
		return message ? errorShape(ErrorCodes.INVALID_REQUEST, message) : void 0;
	};
	const error = validate();
	return error ? {
		ok: false,
		error
	} : {
		ok: true,
		...params.validateModelSelection || params.patch.agentRuntime !== void 0 || params.patch.model !== void 0 || grantingConsent ? { validate } : {}
	};
}
//#endregion
export { resolveSessionNativeRuntimeRestriction as a, refreshSessionPatchQueuedSelection as i, prepareSessionPatchModelSelection as n, resolveSessionPatchModelSelection as o, prepareSessionPatchRuntimeSelection as r, persistSessionPatchModelSelection as t };
