import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { s as getModelRefStatus } from "./model-selection-shared-0uvJbX1M.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-B84_9MMh.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { t as resolveAllowedModelRefCore } from "./model-selection-resolve-D7hqOXrq.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-Dvszh-e-.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-Z1HiwFXK.mjs";
import { s as refreshQueuedFollowupSession } from "./state-B1aZH2hx.mjs";
import { t as persistStickyModelSelectionBestEffort } from "./sticky-model-selection-BY7PCsAr.mjs";
import { o as resolveGatewayModelSelectionPolicy } from "./session-utils-list-8jOFRIkV.mjs";
import { r as resolveAgentHarnessSessionExecutionRestriction } from "./execution-environment-D3NQqOzj.mjs";
import "./queue-BpCLKp2c.mjs";
import { n as isSessionStatusModelPatchOrigin } from "./session-model-patch-origin-QAznNk_B.mjs";
import { t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-CHpcleIj.mjs";
import { o as prepareModelSelectionRuntime } from "./model-runtime-normalization-CU45Yi4U.mjs";
import { l as resolveSessionWorkerPlacementPatchError } from "./sessions-shared-DFVq928u.mjs";
//#region src/gateway/session-tool-overrides.ts
function normalizeSessionToolOverrides(raw) {
	if (!raw) return;
	const normalizeBooleanMap = (value) => {
		const entries = Object.entries(value ?? {}).toSorted(([left], [right]) => left.localeCompare(right));
		return entries.length > 0 ? Object.fromEntries(entries) : void 0;
	};
	const mcpToolsDeny = Object.fromEntries(Object.entries(raw.mcpToolsDeny ?? {}).map(([serverName, toolNames]) => [serverName, [...new Set(toolNames)].toSorted((left, right) => left.localeCompare(right))]).filter(([, toolNames]) => toolNames.length > 0).toSorted(([left], [right]) => left.localeCompare(right)));
	const mcpServers = normalizeBooleanMap(raw.mcpServers);
	const skills = normalizeBooleanMap(raw.skills);
	const normalized = {
		...mcpServers ? { mcpServers } : {},
		...Object.keys(mcpToolsDeny).length > 0 ? { mcpToolsDeny } : {},
		...skills ? { skills } : {},
		...raw.webSearch === false ? { webSearch: false } : {}
	};
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
/** Compare sparse tool policy overlays by their canonical stored meaning. */
function sessionToolOverridesEqual(left, right) {
	return stableStringify(normalizeSessionToolOverrides(left)) === stableStringify(normalizeSessionToolOverrides(right));
}
//#endregion
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
	if (!("agentRuntime" in params.patch) && typeof params.patch.model !== "string") return;
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
		...params.patch.agentRuntime !== void 0 || params.patch.model !== void 0 || grantingConsent ? { validate } : {}
	};
}
//#endregion
export { resolveSessionPatchModelSelection as a, resolveSessionNativeRuntimeRestriction as i, prepareSessionPatchRuntimeSelection as n, normalizeSessionToolOverrides as o, refreshSessionPatchQueuedSelection as r, sessionToolOverridesEqual as s, persistSessionPatchModelSelection as t };
