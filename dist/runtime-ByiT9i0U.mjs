import { i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { a as createLazyRuntimeSurface, n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-BPNHa36e.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { d as resolveToolProfilePolicy, l as normalizeToolPolicyName, o as expandToolGroups } from "./tool-policy-shared-auQCQEhM.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match-Bv2XOvEF.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-YDdaK0oX.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { i as buildModelAliasIndex, r as buildConfiguredModelCatalog, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { s as normalizeThinkLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { s as normalizeExecTarget } from "./exec-approvals-core-BZ3ECkXD.mjs";
import { r as getRuntimeConfig, t as captureRuntimeConfigAsyncReader } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { o as mediaKindFromMime } from "./constants-DUxuqQz8.mjs";
import { f as onAgentEvent } from "./agent-events-BOSJcayE.mjs";
import { i as onSessionTranscriptUpdate } from "./transcript-events-DukKauix.mjs";
import { t as resolveAllowedModelRefCore } from "./model-selection-resolve-D7hqOXrq.mjs";
import { Y as createRuntimeBase, o as resolveNativePluginModelAuth, s as resolveNativePluginModelConfig } from "./loader-runtime-load-DitY2Htf.mjs";
import { u as resolveThinkingProfile } from "./thinking-B1p5pEC8.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { r as resolveThinkingDefaultCore } from "./model-thinking-default-BQDdsH3k.mjs";
import { o as resolveEffectiveAgentRuntime, t as concretizeAgentRuntime } from "./thinking-runtime-CYXCkx2Z.mjs";
import { n as detectMime } from "./mime-1zBUMwu6.mjs";
import { t as ensureAgentWorkspace } from "./workspace-mlzi3k1x.mjs";
import "./exec-approvals-BgZlQ2Qp.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { $ as captureSessionInitializationOwner, et as createSessionInitialization } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { g as runExclusiveSessionLifecycleMutation, h as isSessionWorkAdmissionActive, n as beginSessionWorkAdmission } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { c as normalizeResolvedMaintenanceConfigInput } from "./store-maintenance-C5xEVYop.mjs";
import { t as RequestScopedSubagentRuntimeError } from "./error-runtime-Bf1fYXFh.mjs";
import { d as patchSessionEntryCore, h as replaceSessionEntry, l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-BFzDgQIL.mjs";
import { l as updateSessionEntry } from "./session-accessor.reset-b9w8ccQ2.mjs";
import { a as rollbackAgentHarnessSessionEntryLifecycle, o as rollbackPluginOwnedSessionEntryLifecycle, r as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-BcFZBpmo.mjs";
import { Ct as buildManagedTaskFlowPatch, St as buildFlowRecord } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { C as resumeFlow, T as setFlowWaiting, n as createManagedTaskFlow, o as ensureTaskFlowRegistryReadyAsync, s as failFlow, u as finishFlow, w as runTaskFlowRegistryWorkerMutation, x as requestFlowCancel } from "./task-flow-runtime-internal-DFSz6gyF.mjs";
import { i as getTaskRegistryStore } from "./task-registry.store-1Swe_0g5.mjs";
import { p as runTaskRegistryWorkerMutation, s as ensureTaskRegistryReadyAsync } from "./task-registry-state-Cibd1d5c.mjs";
import { p as readTaskCreationEventTarget } from "./task-registry-create.operation-C5br7RkB.mjs";
import { d as listTasksForFlowId } from "./task-registry-query-Bd-H3o4L.mjs";
import "./runtime-internal-BF8pXknh.mjs";
import { _ as getTaskFlowByIdForOwner, d as getFlowTaskSummary, g as findLatestTaskFlowForOwner, p as runTaskInFlowForOwner, r as cancelFlowByIdForOwner, t as cancelDetachedTaskRunById, v as listTaskFlowsForOwner, y as resolveTaskFlowForLookupTokenForOwner } from "./task-executor-CsmgS3DT.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Bjg7ga80.mjs";
import { a as createSessionWorkStartChangedError, d as resolveSessionWorkStartError } from "./lifecycle-CQXOIBZ7.mjs";
import { c as resolveTaskForLookupTokenForOwner, i as findLatestTaskForRelatedSessionKeyForOwner, n as canOwnerAccessTaskAsync, o as getTaskByIdForOwner, s as listTasksForRelatedSessionKeyForOwner } from "./task-owner-access-LVQrPhRu.mjs";
import { n as resolveAgentIdentity } from "./identity-DdUdpaIE.mjs";
import { a as resolveSubagentToolPolicyForSession, i as resolveInheritedToolPolicyForSession, n as resolveEffectiveToolPolicy } from "./agent-tools.policy-L6QuLbuq.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-B2J3OrFT.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-DGVV7laa.mjs";
import { o as resolveEffectiveSessionToolsVisibility } from "./session-visibility-C56dJf77.mjs";
import { a as listMusicGenerationProviders, i as listImageGenerationProviders, o as listVideoGenerationProviders } from "./registry-D9StkV9M.mjs";
import { i as listWebSearchProviders, o as runWebSearch } from "./runtime-D6-VXQvF.mjs";
import { t as resolveEmbeddedCliBackendDispatchEligibility } from "./cli-backend-dispatch-eligibility-CDq1S8ej.mjs";
import { t as createRuntimeChannel } from "./runtime-channel-X5GVzmC4.mjs";
import { t as createRuntimeLogging } from "./runtime-logging-Cs0MFHNU.mjs";
import { n as isVoiceMessageCompatibleAudio } from "./audio-DJnvjL4a.mjs";
import { a as mapTaskRunView, i as mapTaskRunDetail, n as mapTaskFlowView, r as mapTaskRunAggregateSummary, t as mapTaskFlowDetail } from "./task-domain-views-aWJ48vkZ.mjs";
import { isDeepStrictEqual } from "node:util";
import crypto from "node:crypto";
//#region src/agents/sandbox/workspace-authority.ts
const WORKSPACE_CONFINED_SANDBOX_TOOLS = /* @__PURE__ */ new Set([
	"apply_patch",
	"edit",
	"exec",
	"view_image",
	"process",
	"read",
	"session_status",
	"sessions_history",
	"sessions_list",
	"sessions_search",
	"sessions_yield",
	"progress_card",
	"web_fetch",
	"web_search",
	"write"
]);
function findUnconfinedAllowedTool(policies, confinedToolNames) {
	const candidatePolicy = policies.filter((policy) => Boolean(policy?.allow?.length)).toSorted((left, right) => left.allow.length - right.allow.length)[0];
	if (!candidatePolicy?.allow?.length) return "unbounded allow policy";
	for (const entry of candidatePolicy.allow) for (const candidate of expandToolGroups([entry])) {
		const normalized = normalizeToolPolicyName(candidate);
		if (!isToolAllowedByPolicies(normalized, policies)) continue;
		if (WORKSPACE_CONFINED_SANDBOX_TOOLS.has(normalized) || confinedToolNames.has(normalized)) continue;
		return entry;
	}
}
function resolveWorkspaceToolPolicies(params) {
	const effective = resolveEffectiveToolPolicy({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	return [
		mergeAlsoAllowPolicy(resolveToolProfilePolicy(effective.profile), effective.profileAlsoAllow),
		mergeAlsoAllowPolicy(resolveToolProfilePolicy(effective.providerProfile), effective.providerProfileAlsoAllow),
		effective.globalPolicy,
		effective.globalProviderPolicy,
		effective.agentPolicy,
		effective.agentProviderPolicy,
		params.sandboxPolicy,
		resolveSubagentToolPolicyForSession(params.config, params.sessionKey),
		resolveInheritedToolPolicyForSession(params.config, params.sessionKey)
	];
}
function resolveWorkspaceAuthorityModel(params) {
	const selected = resolveSessionModelRef(params.config, params.sessionEntry, params.agentId);
	const explicitProvider = params.modelProvider?.trim();
	const explicitModel = params.modelId?.trim();
	if (!explicitModel) return {
		provider: explicitProvider ?? selected.provider,
		model: selected.model
	};
	const defaultProvider = explicitProvider ?? selected.provider;
	const raw = explicitProvider && !explicitModel.includes("/") ? `${explicitProvider}/${explicitModel}` : explicitModel;
	return resolveModelRefFromString({
		cfg: params.config,
		raw,
		defaultProvider,
		aliasIndex: buildModelAliasIndex({
			cfg: params.config,
			defaultProvider
		})
	})?.ref ?? {
		provider: defaultProvider,
		model: explicitModel
	};
}
function resolveSandboxWorkspaceAuthority(params) {
	const runtime = resolveSandboxRuntimeStatus({
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	const sandbox = resolveSandboxConfigForAgent(params.config, runtime.agentId);
	if (!runtime.sandboxed) return {
		sandboxed: false,
		workspaceAccess: sandbox.workspaceAccess
	};
	const backend = sandbox.backend.trim().toLowerCase();
	let confinementError;
	if (backend !== "docker" && backend !== "podman") confinementError = "target sandbox backend does not provide local workspace confinement.";
	else if (runtime.sandboxRequired || sandbox.scope !== "session") confinementError = "target sandbox is not exclusive to this worker session.";
	else if (sandbox.docker.dangerouslyAllowExternalBindSources === true || sandbox.docker.dangerouslyAllowReservedContainerTargets === true || sandbox.docker.dangerouslyAllowContainerNamespaceJoin === true) confinementError = "target sandbox enables dangerous Docker isolation overrides.";
	else {
		const elevated = resolveAgentConfig(params.config, runtime.agentId)?.tools?.elevated;
		if (params.config.tools?.elevated?.enabled === true && elevated?.enabled !== false) confinementError = "target agent can request host-level elevated execution.";
		const rawSessionExecHost = params.sessionEntry?.execHost?.trim();
		const sessionExecHost = normalizeExecTarget(rawSessionExecHost);
		const execHost = sessionExecHost ?? resolveAgentConfig(params.config, runtime.agentId)?.tools?.exec?.host ?? params.config.tools?.exec?.host ?? "auto";
		if (!confinementError && rawSessionExecHost && !sessionExecHost) confinementError = "target session has an invalid shell execution override.";
		else if (!confinementError && (Boolean(params.sessionEntry?.execNode?.trim()) || execHost !== "auto" && execHost !== "sandbox")) confinementError = "target sandbox routes shell execution outside the sandbox.";
		else if (!confinementError && sandbox.browser.allowHostControl) confinementError = "target sandbox allows host browser control.";
		else if (!confinementError && ["agent", "all"].includes(resolveEffectiveSessionToolsVisibility({
			cfg: params.config,
			sandboxed: true
		}))) confinementError = "target sandbox allows access to host-wide sessions.";
		else if (!confinementError) {
			const model = resolveWorkspaceAuthorityModel({
				config: params.config,
				agentId: runtime.agentId,
				sessionEntry: params.sessionEntry,
				modelProvider: params.modelProvider,
				modelId: params.modelId
			});
			const policies = resolveWorkspaceToolPolicies({
				config: params.config,
				agentId: runtime.agentId,
				sessionKey: params.sessionKey,
				modelProvider: model.provider,
				modelId: model.model,
				sandboxPolicy: sandbox.tools
			});
			const unavailableTool = (params.requiredToolNames ?? []).map(normalizeToolPolicyName).find((name) => !isToolAllowedByPolicies(name, policies));
			if (unavailableTool) confinementError = `target tool policy blocks required tool ${unavailableTool}.`;
			else {
				const unsafeTool = findUnconfinedAllowedTool(policies, new Set((params.confinedToolNames ?? []).map(normalizeToolPolicyName)));
				if (unsafeTool) confinementError = `target sandbox allows unclassified tool surface ${unsafeTool}.`;
			}
		}
	}
	return {
		sandboxed: true,
		workspaceAccess: runtime.sandboxRequired ? runtime.workspaceAccess : sandbox.workspaceAccess,
		...confinementError ? { confinementError } : {}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-agent-session-catalog.ts
/**
* Resolve a synchronous catalog create target through the same model/runtime
* policy used by agent turns, without making plugins import that policy graph.
*/
function resolveAgentCatalogCreateTarget(params) {
	const agentId = params.requestedAgentId ?? resolveDefaultAgentId(params.config);
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.config,
		agentId
	});
	for (const modelId of params.modelIds) {
		if (resolveEffectiveAgentRuntime({
			cfg: params.config,
			provider: params.provider,
			modelId,
			agentId
		}) !== params.agentRuntime) continue;
		const model = `${params.provider}/${modelId}`;
		if (!("error" in resolveAllowedModelRefCore({
			cfg: params.config,
			catalog: [],
			raw: model,
			defaultProvider: defaultModel.provider,
			defaultModel,
			agentId
		}))) return {
			model,
			agentRuntime: params.agentRuntime
		};
	}
}
//#endregion
//#region src/plugins/runtime/runtime-agent-thinking.ts
function resolveRuntimeThinkingCatalog(params, buildConfiguredCatalog) {
	if (params.catalog) return params.catalog;
	const configuredCatalog = buildConfiguredCatalog();
	return configuredCatalog.length > 0 ? configuredCatalog : void 0;
}
//#endregion
//#region src/plugins/runtime/runtime-cache.ts
/** Defines a lazily computed enumerable property on a runtime facade. */
function defineCachedValue(target, key, create) {
	let cached;
	let ready = false;
	Object.defineProperty(target, key, {
		configurable: true,
		enumerable: true,
		get() {
			if (!ready) {
				cached = create();
				ready = true;
			}
			return cached;
		}
	});
}
//#endregion
//#region src/plugins/runtime/runtime-agent.ts
const loadEmbeddedAgentRuntime = createLazyRuntimeModule(() => import("./runtime-embedded-agent.runtime.js"));
const loadAgentCommandRuntime = createLazyRuntimeModule(async () => {
	const [command, identity] = await Promise.all([import("./agent-command-CzOoftHF.mjs"), import("./agent-command-execution-identity-C-5xE5H7.mjs")]);
	return {
		command,
		identity
	};
});
function toSessionAccessScope(params) {
	return {
		sessionKey: params.sessionKey,
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.readConsistency !== void 0 ? { readConsistency: params.readConsistency } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	};
}
function getSessionEntry(params) {
	return loadSessionEntryReadOnly(toSessionAccessScope(params));
}
function listSessionEntries(params = {}) {
	return (params.readOnly ? listSessionEntriesReadOnly : listSessionEntriesCore)({
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	});
}
async function patchSessionEntry(params) {
	return await patchSessionEntryCore(toSessionAccessScope(params), params.update, {
		assertCommitAllowed: params.assertCommitAllowed,
		fallbackEntry: params.fallbackEntry,
		maintenanceConfig: params.maintenanceConfig !== void 0 ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : void 0,
		preserveActivity: params.preserveActivity,
		replaceEntry: params.replaceEntry
	});
}
async function updateSessionStoreEntry(params) {
	return await updateSessionEntry({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, params.update, {
		skipMaintenance: params.skipMaintenance,
		takeCacheOwnership: params.takeCacheOwnership,
		requireWriteSuccess: params.requireWriteSuccess
	});
}
async function upsertSessionEntry(params) {
	await replaceSessionEntry(toSessionAccessScope(params), params.entry);
}
async function createSessionEntry(params) {
	const creationOwner = captureSessionInitializationOwner("agentHarnessId" in params.initialEntry ? params.initialEntry.agentHarnessId : void 0);
	const [{ createGatewaySession }, { resolveGatewaySessionStoreTarget }, { readAcpSessionMetaForEntry }, { upsertAcpSessionMeta }, { resolveSandboxedSessionCreation }] = await Promise.all([
		import("./session-create-service-r1Vosm9s.mjs"),
		import("./session-utils-BDnEMxg-.mjs"),
		import("./session-meta-readonly-BHJa_Bgn.mjs"),
		import("./session-meta-uqxijAIV.mjs"),
		import("./operator-role-policy-_wrqzjry.mjs")
	]);
	creationOwner.assertCurrent();
	const requiredCreation = resolveSandboxedSessionCreation(getPluginRuntimeGatewayRequestScope()?.client, params.cfg);
	const target = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: params.key,
		...params.agentId !== void 0 ? { agentId: params.agentId } : {}
	});
	const cliInitial = "cliBackendId" in params.initialEntry ? params.initialEntry : void 0;
	const acpInitial = "acpSessionBinding" in params.initialEntry ? params.initialEntry : void 0;
	const harnessInitial = "agentHarnessId" in params.initialEntry ? params.initialEntry : void 0;
	const pluginInitial = cliInitial ?? acpInitial;
	const acpBackendId = acpInitial?.acpBackendId.trim();
	const acpAgentId = acpInitial?.acpSessionBinding.acpAgentId.trim();
	const agentSessionId = acpInitial?.acpSessionBinding.agentSessionId.trim();
	if (acpInitial && (!acpBackendId || !acpAgentId || !agentSessionId)) throw new Error("initial ACP session binding fields must be non-empty");
	const initialAcpMeta = (now) => acpInitial ? {
		backend: acpBackendId,
		agent: acpAgentId,
		runtimeSessionName: target.canonicalKey,
		identity: {
			state: "resolved",
			agentSessionId,
			source: "ensure",
			lastUpdatedAt: now
		},
		mode: "persistent",
		...params.spawnedCwd?.trim() ? { cwd: params.spawnedCwd.trim() } : {},
		state: "idle",
		lastActivityAt: now
	} : void 0;
	const persistedAcpBinding = acpInitial ? {
		acpBackendId,
		acpAgentId,
		agentSessionId
	} : void 0;
	const acpMetaMatches = (meta) => Boolean(meta && meta.backend === acpBackendId && meta.agent === acpAgentId && meta.runtimeSessionName === target.canonicalKey && meta.identity?.state === "resolved" && meta.identity.agentSessionId === agentSessionId && meta.mode === "persistent" && meta.cwd === (params.spawnedCwd?.trim() || void 0));
	const initializesAfterCreate = Boolean(params.afterCreate || acpInitial);
	const matchesExceptUpdatedAt = (left, right) => {
		const { updatedAt: _leftUpdatedAt, ...leftStable } = left;
		const { updatedAt: _rightUpdatedAt, ...rightStable } = right;
		return isDeepStrictEqual(leftStable, rightStable);
	};
	const identities = /* @__PURE__ */ new Set([target.canonicalKey, ...target.storeKeys]);
	return await runExclusiveSessionLifecycleMutation({
		scope: target.storePath,
		identities,
		prepare: async () => {
			if (isSessionWorkAdmissionActive(target.storePath, identities)) throw new Error(`Session "${target.canonicalKey}" is still active; retry creation later.`);
		},
		run: async () => {
			creationOwner.assertCurrent();
			const afterCreate = params.afterCreate;
			let initialization;
			let callbackContext;
			let finalEntryPatch;
			let rollbackExpectedEntry;
			const runAfterCreate = async (context) => {
				callbackContext = context;
				if (acpInitial) {
					const meta = initialAcpMeta(Date.now());
					if (!(await upsertAcpSessionMeta({
						cfg: params.cfg,
						sessionKey: context.key,
						agentId: context.agentId,
						mutate: () => meta
					}))?.acp) throw new Error(`could not persist initial ACP binding for ${context.key}`);
					const persistedEntry = getSessionEntry({
						sessionKey: context.key,
						storePath: context.storePath,
						readConsistency: "latest"
					});
					if (!persistedEntry || !matchesExceptUpdatedAt(persistedEntry, context.entry)) throw new Error(`created ACP session ${context.key} changed during initialization`);
					callbackContext = {
						...context,
						entry: persistedEntry
					};
				}
				rollbackExpectedEntry = structuredClone(callbackContext.entry);
				const captured = callbackContext;
				const expected = rollbackExpectedEntry;
				initialization = createSessionInitialization({
					storePath: captured.storePath,
					sessionKey: captured.key,
					sessionId: expected.sessionId,
					lifecycleRevision: expected.lifecycleRevision
				}, (phase, deleted) => {
					if (phase === "rollback") creationOwner.assertRollbackCurrent();
					else creationOwner.assertCurrent();
					const current = getSessionEntry({
						sessionKey: captured.key,
						storePath: captured.storePath,
						readConsistency: "latest"
					});
					if (deleted ? current !== void 0 : current?.initializationPending !== true || !isDeepStrictEqual(current, expected)) throw new Error(`Session initialization owner changed: ${captured.key}`);
				}, {
					config: params.cfg,
					agentId: captured.agentId,
					entry: expected
				});
				initialization.handle.assertCurrent();
				if (!afterCreate) return;
				const finalPatch = await afterCreate({
					key: callbackContext.key,
					agentId: callbackContext.agentId,
					sessionId: callbackContext.entry.sessionId,
					entry: structuredClone(callbackContext.entry),
					initialization: initialization.handle
				});
				initialization.handle.assertCurrent();
				if (finalPatch !== void 0) {
					const patchKeys = Object.keys(finalPatch);
					if (patchKeys.length !== 1 || patchKeys[0] !== "pluginExtensions") throw new Error("session creation final patch may only contain pluginExtensions");
					finalEntryPatch = structuredClone(finalPatch);
				}
			};
			try {
				const matchingEntry = params.recoverMatchingInitialEntry === true ? getSessionEntry({
					sessionKey: target.canonicalKey,
					storePath: target.storePath,
					readConsistency: "latest"
				}) : void 0;
				let recovered = false;
				let created;
				if (matchingEntry) {
					const expectedSpawnedCwd = params.spawnedCwd?.trim() || void 0;
					const expectedSessionRoot = params.sessionRoot?.trim() || void 0;
					const expectedExecNode = params.execNode?.trim() || void 0;
					const expectedExecCwd = params.execCwd?.trim() || void 0;
					const matchingAcpMeta = acpInitial ? readAcpSessionMetaForEntry({
						sessionKey: target.canonicalKey,
						agentId: target.agentId,
						entry: matchingEntry
					}) : void 0;
					if (!(matchingEntry.initializationPending === true && matchingEntry.agentHarnessId === harnessInitial?.agentHarnessId && matchingEntry.pluginOwnerId === pluginInitial?.pluginOwnerId && matchingEntry.modelSelectionLocked === params.initialEntry.modelSelectionLocked && (!cliInitial || matchingEntry.providerOverride === cliInitial.cliBackendId && matchingEntry.modelOverride === cliInitial.model && isDeepStrictEqual(matchingEntry.cliSessionBindings?.[cliInitial.cliBackendId], cliInitial.cliSessionBinding)) && (!acpInitial || isDeepStrictEqual(matchingEntry.acpSessionBinding, persistedAcpBinding) && (matchingAcpMeta === void 0 || acpMetaMatches(matchingAcpMeta))) && matchingEntry.spawnedCwd === expectedSpawnedCwd && matchingEntry.sessionRoot === expectedSessionRoot && matchingEntry.permissionMode === params.permissionMode && matchingEntry.execNode === expectedExecNode && matchingEntry.execCwd === expectedExecCwd && isDeepStrictEqual(matchingEntry.pluginExtensions, params.initialEntry.pluginExtensions))) throw new Error(`Session "${target.canonicalKey}" does not match its trusted recovery state.`);
					if (!afterCreate) throw new Error("session creation recovery requires an initializer");
					recovered = true;
					created = {
						key: target.canonicalKey,
						agentId: target.agentId,
						entry: matchingEntry
					};
					await runAfterCreate({
						...created,
						storePath: target.storePath,
						isNew: false
					});
				} else {
					const result = await createGatewaySession({
						cfg: params.cfg,
						operatorRoleActor: requiredCreation ? void 0 : { kind: "system" },
						requestingOperatorProfileId: requiredCreation?.actor?.id,
						key: params.key,
						...params.agentId !== void 0 ? { agentId: params.agentId } : {},
						...params.label !== void 0 ? { label: params.label } : {},
						...params.displayName !== void 0 ? { displayName: params.displayName } : {},
						...params.spawnedCwd !== void 0 ? { spawnedCwd: params.spawnedCwd } : {},
						...params.sessionRoot !== void 0 ? { sessionRoot: params.sessionRoot } : {},
						...params.permissionMode !== void 0 ? { permissionMode: params.permissionMode } : {},
						...params.execNode !== void 0 ? { execNode: params.execNode } : {},
						...params.execCwd !== void 0 ? { execCwd: params.execCwd } : {},
						initialEntry: {
							color: params.initialEntry.color,
							...harnessInitial ? { agentHarnessId: harnessInitial.agentHarnessId } : {},
							...cliInitial ? {
								pluginOwnerId: cliInitial.pluginOwnerId,
								providerOverride: cliInitial.cliBackendId,
								modelOverride: cliInitial.model,
								modelOverrideRouteResolution: "resolved",
								cliSessionBindings: { [cliInitial.cliBackendId]: cliInitial.cliSessionBinding }
							} : {},
							...acpInitial ? {
								pluginOwnerId: acpInitial.pluginOwnerId,
								acpSessionBinding: persistedAcpBinding
							} : {},
							...params.initialEntry.modelSelectionLocked === true ? { modelSelectionLocked: true } : {},
							...params.initialEntry.pluginExtensions ? { pluginExtensions: params.initialEntry.pluginExtensions } : {},
							...initializesAfterCreate ? { initializationPending: true } : {}
						},
						...harnessInitial ? { authorizedAgentHarnessId: harnessInitial.agentHarnessId } : {},
						...pluginInitial?.pluginOwnerId ? { authorizedPluginId: pluginInitial.pluginOwnerId } : {},
						creation: requiredCreation ?? {
							via: "plugin",
							actor: {
								type: "system",
								...pluginInitial?.pluginOwnerId ? { id: pluginInitial.pluginOwnerId } : {}
							}
						},
						commandSource: "plugin-runtime",
						...initializesAfterCreate ? { afterCreate: runAfterCreate } : {}
					});
					if (!result.ok) throw new Error(result.error.message);
					if (result.postCommit.status === "failed") throw result.postCommit.error;
					created = result;
				}
				if (recovered && !finalEntryPatch) throw new Error("session creation recovery requires a final patch");
				let finalEntry = created.entry;
				if (initializesAfterCreate) {
					const patch = {
						...finalEntryPatch,
						initializationPending: void 0,
						...acpInitial ? { acpSessionBinding: void 0 } : {}
					};
					const expectedEntry = rollbackExpectedEntry;
					if (!callbackContext || !expectedEntry) throw new Error("session creation final patch is missing its created entry");
					const createdContext = callbackContext;
					const finalized = await patchSessionEntryCore({
						sessionKey: createdContext.key,
						storePath: createdContext.storePath
					}, (currentEntry) => {
						if (JSON.stringify(currentEntry) !== JSON.stringify(expectedEntry)) throw new Error(`created session ${createdContext.key} changed before finalization`);
						return patch;
					}, {
						preserveActivity: true,
						requireWriteSuccess: true,
						assertCommitAllowed: () => initialization?.handle.assertCurrent()
					});
					if (!finalized) throw new Error(`created session ${createdContext.key} disappeared before finalization`);
					finalEntry = finalized;
					initialization?.close();
				}
				return {
					key: created.key,
					agentId: created.agentId,
					sessionId: finalEntry.sessionId,
					entry: finalEntry
				};
			} catch (error) {
				if (!callbackContext) throw error;
				const current = getSessionEntry({
					sessionKey: callbackContext.key,
					storePath: callbackContext.storePath,
					readConsistency: "latest"
				});
				if (current?.sessionId === callbackContext.entry.sessionId && current.lifecycleRevision === callbackContext.entry.lifecycleRevision && current.initializationPending !== true) throw error;
				try {
					let expectedEntry = rollbackExpectedEntry ?? callbackContext.entry;
					if (acpInitial && !rollbackExpectedEntry) {
						const currentEntry = getSessionEntry({
							sessionKey: callbackContext.key,
							storePath: callbackContext.storePath,
							readConsistency: "latest"
						});
						if (currentEntry && matchesExceptUpdatedAt(currentEntry, callbackContext.entry)) expectedEntry = currentEntry;
					}
					const rollbackParams = {
						agentId: callbackContext.agentId,
						archiveTranscript: true,
						expectedEntry,
						expectedSessionId: callbackContext.entry.sessionId,
						expectedUpdatedAt: expectedEntry.updatedAt,
						storePath: callbackContext.storePath,
						target: {
							canonicalKey: callbackContext.key,
							storeKeys: [callbackContext.key]
						}
					};
					const rollback = async () => expectedEntry.modelSelectionLocked === true ? expectedEntry.agentHarnessId ? await rollbackAgentHarnessSessionEntryLifecycle(rollbackParams) : await rollbackPluginOwnedSessionEntryLifecycle({
						...rollbackParams,
						expectedPluginOwnerId: pluginInitial?.pluginOwnerId ?? ""
					}) : await deleteSessionEntryLifecycle(rollbackParams);
					if (!(initialization ? await initialization.rollback(rollback) : await rollback()).deleted) throw new Error(`created session ${callbackContext.key} changed before rollback`, { cause: error });
					if (acpInitial) await upsertAcpSessionMeta({
						cfg: params.cfg,
						sessionKey: callbackContext.key,
						agentId: callbackContext.agentId,
						mutate: () => null
					});
				} catch (rollbackError) {
					throw new AggregateError([error, rollbackError], `Session initialization failed and guarded rollback did not complete for ${callbackContext.key}.`, { cause: rollbackError });
				}
				throw error;
			} finally {
				initialization?.close();
			}
		}
	});
}
async function runWithSessionWorkAdmission(params, run) {
	const initialEntry = getSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey,
		readConsistency: "latest"
	});
	const lifecycleAbortController = new AbortController();
	const admission = await beginSessionWorkAdmission({
		scope: params.storePath,
		identities: [params.sessionKey, initialEntry?.sessionId],
		signal: params.signal,
		onInterrupt: () => lifecycleAbortController.abort(/* @__PURE__ */ new Error("Agent work interrupted by a session lifecycle change.")),
		assertAllowed: () => {
			const currentEntry = getSessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey,
				readConsistency: "latest"
			});
			if (initialEntry ? !currentEntry || currentEntry.sessionId !== initialEntry.sessionId : Boolean(currentEntry)) throw createSessionWorkStartChangedError(params.sessionKey);
			const startError = resolveSessionWorkStartError(params.sessionKey, currentEntry);
			if (startError) throw new Error(startError);
		}
	});
	try {
		const signal = params.signal ? AbortSignal.any([params.signal, lifecycleAbortController.signal]) : lifecycleAbortController.signal;
		return await admission.run(async () => await run(signal));
	} finally {
		admission.release();
	}
}
/** Creates the plugin runtime agent facade with lazy embedded-agent/session helpers. */
function createRuntimeAgent() {
	const agentRuntime = {
		defaults: {
			model: DEFAULT_MODEL,
			provider: DEFAULT_PROVIDER
		},
		resolveAgentDir,
		resolveAgentWorkspaceDir,
		resolveAgentIdentity,
		resolveSessionCatalogCreateTarget: resolveAgentCatalogCreateTarget,
		resolveThinkingDefault: resolveThinkingDefaultCore,
		normalizeThinkingLevel: normalizeThinkLevel,
		resolveThinkingPolicy: (params) => {
			const cfg = getRuntimeConfig();
			const effectiveRuntime = params.agentRuntime ? concretizeAgentRuntime(params.agentRuntime) : params.provider && params.model ? resolveEffectiveAgentRuntime({
				cfg,
				provider: params.provider,
				modelId: params.model
			}) : void 0;
			const profile = resolveThinkingProfile({
				...params,
				agentRuntime: effectiveRuntime,
				catalog: resolveRuntimeThinkingCatalog(params, () => buildConfiguredModelCatalog({ cfg: getRuntimeConfig() }))
			});
			const policy = { levels: profile.levels.map(({ id, label }) => ({
				id,
				label
			})) };
			return profile.defaultLevel ? {
				...policy,
				defaultLevel: profile.defaultLevel
			} : policy;
		},
		resolveAgentTimeoutMs,
		resolveCliBackendDispatchEligibility: resolveEmbeddedCliBackendDispatchEligibility,
		ensureAgentWorkspace
	};
	defineCachedValue(agentRuntime, "runCommandFromIngress", () => createLazyRuntimeMethod(loadAgentCommandRuntime, ({ command, identity }) => async (opts, runtime) => await command.agentCommandFromGatewayIngress({
		...identity.sanitizePublicAgentCommandIngressOpts(opts),
		senderIsOwner: opts.senderIsOwner === true
	}, runtime, void 0, {})));
	defineCachedValue(agentRuntime, "runEmbeddedAgent", () => createLazyRuntimeMethod(loadEmbeddedAgentRuntime, (runtime) => runtime.runPluginEmbeddedAgent));
	defineCachedValue(agentRuntime, "session", () => ({
		resolveStorePath: resolveSessionStorePathCore,
		createSessionEntry,
		getSessionEntry,
		listSessionEntries,
		patchSessionEntry,
		upsertSessionEntry,
		runWithWorkAdmission: runWithSessionWorkAdmission,
		updateSessionStoreEntry
	}));
	return agentRuntime;
}
//#endregion
//#region src/plugins/runtime/runtime-events.ts
/** Creates the plugin runtime event subscription facade. */
function createRuntimeEvents() {
	return {
		onAgentEvent,
		onSessionTranscriptUpdate
	};
}
//#endregion
//#region src/plugins/runtime/runtime-media.ts
const loadWebMedia = createLazyRuntimeMethod(() => import("./web-media-DDoLkIL9.mjs"), (runtime) => runtime.loadWebMedia);
const getImageMetadata = createLazyRuntimeMethod(() => import("./image-ops-Byh7YaXr.mjs"), (runtime) => runtime.getImageMetadata);
const resizeToJpeg = createLazyRuntimeMethod(() => import("./image-ops-Byh7YaXr.mjs"), (runtime) => runtime.resizeToJpeg);
/** Creates the plugin runtime media facade. */
function createRuntimeMedia() {
	return {
		loadWebMedia,
		detectMime,
		mediaKindFromMime,
		isVoiceCompatibleAudio: isVoiceMessageCompatibleAudio,
		getImageMetadata,
		resizeToJpeg
	};
}
//#endregion
//#region src/plugins/runtime/runtime-managed-flow-result.ts
function isManagedFlow(flow) {
	return flow?.syncMode === "managed" && Boolean(flow.controllerId);
}
function asManagedTaskFlowRecord(flow) {
	return isManagedFlow(flow) ? flow : void 0;
}
function mapFlowUpdateResult(result) {
	if (result.applied) {
		const managed = asManagedTaskFlowRecord(result.flow);
		return managed ? {
			applied: true,
			flow: managed
		} : {
			applied: false,
			code: "not_managed",
			current: result.flow
		};
	}
	if (result.reason === "invalid_patch") throw result.error;
	return {
		applied: false,
		code: result.reason,
		..."current" in result && result.current ? { current: result.current } : {}
	};
}
function mapFlowTaskRunResult(created) {
	if (!created.created) return {
		created: false,
		found: created.found,
		reason: created.reason ?? "Task was not created.",
		...created.flow ? { flow: created.flow } : {}
	};
	const managed = asManagedTaskFlowRecord(created.flow);
	if (!managed) return {
		created: false,
		found: true,
		reason: "TaskFlow does not accept managed child tasks.",
		flow: created.flow
	};
	if (!created.task) return {
		created: false,
		found: true,
		reason: "Task was not created.",
		flow: created.flow
	};
	return {
		created: true,
		flow: managed,
		task: created.task
	};
}
//#endregion
//#region src/plugins/runtime/runtime-taskflow.ts
function assertSessionKey$1(sessionKey, errorMessage) {
	const normalized = sessionKey?.trim();
	if (!normalized) throw new Error(errorMessage);
	return normalized;
}
function applyManagedFlowMutationForOwner(params) {
	const flow = getTaskFlowByIdForOwner({
		flowId: params.flowId,
		callerOwnerKey: params.ownerKey
	});
	if (!flow) return {
		applied: false,
		code: "not_found"
	};
	const managed = asManagedTaskFlowRecord(flow);
	if (!managed) return {
		applied: false,
		code: "not_managed",
		current: flow
	};
	return mapFlowUpdateResult(params.mutate(managed.flowId));
}
function createBoundTaskFlowRuntime(params) {
	const ownerKey = assertSessionKey$1(params.sessionKey, "TaskFlow runtime requires a bound sessionKey.");
	const requesterOrigin = params.requesterOrigin ? normalizeDeliveryContext(params.requesterOrigin) : void 0;
	const tryCreateManaged = (input) => {
		return asManagedTaskFlowRecord(createManagedTaskFlow({
			ownerKey,
			controllerId: input.controllerId,
			requesterOrigin,
			status: input.status,
			notifyPolicy: input.notifyPolicy,
			goal: input.goal,
			currentStep: input.currentStep,
			stateJson: input.stateJson,
			waitJson: input.waitJson,
			cancelRequestedAt: input.cancelRequestedAt,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
			endedAt: input.endedAt
		}) ?? void 0) ?? null;
	};
	return {
		sessionKey: ownerKey,
		...requesterOrigin ? { requesterOrigin } : {},
		createManaged: (input) => {
			const flow = tryCreateManaged(input);
			if (!flow) throw new Error("TaskFlow persistence failed.");
			return flow;
		},
		tryCreateManaged,
		get: (flowId) => getTaskFlowByIdForOwner({
			flowId,
			callerOwnerKey: ownerKey
		}),
		list: () => listTaskFlowsForOwner({ callerOwnerKey: ownerKey }),
		findLatest: () => findLatestTaskFlowForOwner({ callerOwnerKey: ownerKey }),
		resolve: (token) => resolveTaskFlowForLookupTokenForOwner({
			token,
			callerOwnerKey: ownerKey
		}),
		getTaskSummary: (flowId) => {
			const flow = getTaskFlowByIdForOwner({
				flowId,
				callerOwnerKey: ownerKey
			});
			return flow ? getFlowTaskSummary(flow.flowId) : void 0;
		},
		setWaiting: (input) => applyManagedFlowMutationForOwner({
			flowId: input.flowId,
			ownerKey,
			mutate: (flowId) => setFlowWaiting({
				flowId,
				expectedRevision: input.expectedRevision,
				currentStep: input.currentStep,
				stateJson: input.stateJson,
				waitJson: input.waitJson,
				blockedTaskId: input.blockedTaskId,
				blockedSummary: input.blockedSummary,
				updatedAt: input.updatedAt
			})
		}),
		resume: (input) => applyManagedFlowMutationForOwner({
			flowId: input.flowId,
			ownerKey,
			mutate: (flowId) => resumeFlow({
				flowId,
				expectedRevision: input.expectedRevision,
				status: input.status,
				currentStep: input.currentStep,
				stateJson: input.stateJson,
				updatedAt: input.updatedAt
			})
		}),
		finish: (input) => applyManagedFlowMutationForOwner({
			flowId: input.flowId,
			ownerKey,
			mutate: (flowId) => finishFlow({
				flowId,
				expectedRevision: input.expectedRevision,
				stateJson: input.stateJson,
				updatedAt: input.updatedAt,
				endedAt: input.endedAt
			})
		}),
		fail: (input) => applyManagedFlowMutationForOwner({
			flowId: input.flowId,
			ownerKey,
			mutate: (flowId) => failFlow({
				flowId,
				expectedRevision: input.expectedRevision,
				stateJson: input.stateJson,
				blockedTaskId: input.blockedTaskId,
				blockedSummary: input.blockedSummary,
				updatedAt: input.updatedAt,
				endedAt: input.endedAt
			})
		}),
		requestCancel: (input) => applyManagedFlowMutationForOwner({
			flowId: input.flowId,
			ownerKey,
			mutate: (flowId) => requestFlowCancel({
				flowId,
				expectedRevision: input.expectedRevision,
				cancelRequestedAt: input.cancelRequestedAt
			})
		}),
		cancel: ({ flowId, cfg }) => cancelFlowByIdForOwner({
			cfg,
			flowId,
			callerOwnerKey: ownerKey
		}),
		runTask: (input) => {
			return mapFlowTaskRunResult(runTaskInFlowForOwner({
				flowId: input.flowId,
				callerOwnerKey: ownerKey,
				runtime: input.runtime,
				sourceId: input.sourceId,
				childSessionKey: input.childSessionKey,
				parentTaskId: input.parentTaskId,
				agentId: input.agentId,
				runId: input.runId,
				label: input.label,
				task: input.task,
				preferMetadata: input.preferMetadata,
				notifyPolicy: input.notifyPolicy,
				deliveryStatus: input.deliveryStatus,
				status: input.status,
				startedAt: input.startedAt,
				lastEventAt: input.lastEventAt,
				progressSummary: input.progressSummary
			}));
		}
	};
}
function createRuntimeTaskFlow() {
	return {
		bindSession: (params) => createBoundTaskFlowRuntime({
			sessionKey: params.sessionKey,
			requesterOrigin: params.requesterOrigin
		}),
		fromToolContext: (ctx) => createBoundTaskFlowRuntime({
			sessionKey: assertSessionKey$1(ctx.sessionKey, "TaskFlow runtime requires tool context with a sessionKey."),
			requesterOrigin: ctx.deliveryContext
		})
	};
}
//#endregion
//#region src/plugins/runtime/runtime-tasks-async.ts
function bind(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) throw new Error("Tasks runtime requires a bound sessionKey.");
	const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
	return {
		sessionKey,
		...requesterOrigin ? { requesterOrigin } : {}
	};
}
async function readStore(includeTasks, includeFlows) {
	const context = captureOpenClawStateWorkerContext();
	const loadConfig = captureRuntimeConfigAsyncReader({ assertCurrent: context.admission.assertCurrent });
	if (includeFlows) {
		context.admission.assertCurrent();
		await ensureTaskFlowRegistryReadyAsync(context);
	}
	if (includeTasks) {
		context.admission.assertCurrent();
		await ensureTaskRegistryReadyAsync(context);
	}
	const store = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	context.admission.assertCurrent();
	return {
		store,
		context,
		loadConfig
	};
}
function bindRuns(params) {
	const binding = bind(params);
	const identity = {
		callerOwnerKey: binding.sessionKey,
		callerAgentId: params.agentId
	};
	const visible = async (task, read) => {
		if (!task) return;
		const allowed = await canOwnerAccessTaskAsync(task, identity, read.loadConfig);
		read.context.admission.assertCurrent();
		return allowed ? task : void 0;
	};
	const list = async () => {
		const read = await readStore(true, false);
		const records = await read.store.executeOpenClawStateWorker(read.context, {
			type: "tasks.list",
			input: { ownerKey: binding.sessionKey }
		});
		const visibleRecords = [];
		for (const record of records) if (await visible(record, read)) visibleRecords.push(record);
		return visibleRecords;
	};
	return {
		...binding,
		async get(taskId) {
			const read = await readStore(true, false);
			const task = await visible(await read.store.executeOpenClawStateWorker(read.context, {
				type: "tasks.get",
				input: { taskId: taskId.trim() }
			}), read);
			return task ? mapTaskRunDetail(task) : void 0;
		},
		list: async () => (await list()).map(mapTaskRunView),
		async findLatest() {
			const task = (await list())[0];
			return task ? mapTaskRunDetail(task) : void 0;
		},
		async resolve(token) {
			const read = await readStore(true, false);
			const records = await read.store.executeOpenClawStateWorker(read.context, {
				type: "tasks.resolve",
				input: {
					ownerKey: binding.sessionKey,
					token: token.trim()
				}
			});
			for (const record of [
				records.direct,
				records.byRun,
				...records.related
			]) {
				const task = await visible(record, read);
				if (task) return mapTaskRunDetail(task);
			}
		}
	};
}
async function readFlowTaskSummary(ownerKey, flowId) {
	const { store, context } = await readStore(true, true);
	return store.executeOpenClawStateWorker(context, {
		type: "flows.summary",
		input: {
			ownerKey,
			flowId
		}
	});
}
function bindManagedFlows(params) {
	const binding = bind(params);
	const prepareWrite = async () => {
		const { store, context } = await readStore(false, true);
		return (flowId, mutate) => store.runOpenClawStateWorkerOperation(context, (scope) => runTaskFlowRegistryWorkerMutation({
			admission: context.admission,
			flowId
		}, () => mutate(scope), () => scope.execute({
			type: "flows.current",
			input: { flowId }
		})));
	};
	const createManagedResult = async (input) => {
		const snapshot = structuredClone(input);
		const write = await prepareWrite();
		const flow = buildFlowRecord({
			...snapshot,
			ownerKey: binding.sessionKey,
			requesterOrigin: binding.requesterOrigin,
			syncMode: "managed"
		});
		try {
			return { flow: asManagedTaskFlowRecord(await write(flow.flowId, (scope) => scope.execute({
				type: "flows.createManaged",
				input: { flow }
			}))) ?? null };
		} catch (error) {
			if (collectNestedErrorCandidates(error).some((candidate) => extractErrorCode(candidate) === "outcome-unknown")) throw error;
			return {
				flow: null,
				error
			};
		}
	};
	const update = async (mutation, input) => {
		const snapshot = structuredClone(input);
		const write = await prepareWrite();
		const patch = buildManagedTaskFlowPatch(mutation, snapshot);
		return mapFlowUpdateResult(await write(snapshot.flowId, (scope) => scope.execute({
			type: "flows.updateManaged",
			input: {
				flowId: snapshot.flowId,
				expectedRevision: snapshot.expectedRevision,
				ownerKey: binding.sessionKey,
				patch
			}
		})));
	};
	const read = async (lookup, token) => {
		const { store, context } = await readStore(false, true);
		return store.executeOpenClawStateWorker(context, {
			type: "flows.read",
			input: {
				ownerKey: binding.sessionKey,
				lookup,
				token
			}
		});
	};
	return {
		...binding,
		tryCreateManaged: async (input) => (await createManagedResult(input)).flow,
		async createManaged(input) {
			const result = await createManagedResult(input);
			if (!result.flow) throw new Error("TaskFlow persistence failed.", { cause: result.error });
			return result.flow;
		},
		setWaiting: (input) => update("setWaiting", input),
		resume: (input) => update("resume", input),
		finish: (input) => update("finish", input),
		fail: (input) => update("fail", input),
		requestCancel: (input) => update("requestCancel", input),
		async runTask(input) {
			const taskInput = structuredClone(input);
			const { store, context } = await readStore(true, true);
			const { runTaskRegistryWorkerOperation } = await import("./task-registry-worker-operation-DZYDPUQk.mjs");
			context.admission.assertCurrent();
			const taskStore = getTaskRegistryStore();
			const scope = {
				taskId: crypto.randomUUID(),
				flowId: taskInput.flowId.trim(),
				runId: taskInput.runId?.trim(),
				childSessionKey: taskInput.childSessionKey?.trim()
			};
			let publicationTask;
			let creationOwner;
			return mapFlowTaskRunResult(await store.runOpenClawStateWorkerOperation(context, () => runTaskRegistryWorkerMutation({
				scope,
				admission: context.admission,
				readEventTarget: () => readTaskCreationEventTarget(creationOwner?.committed?.facts, "flows.runTask", scope.taskId),
				publicationRecords: () => new Map(publicationTask ? [[publicationTask.taskId, publicationTask]] : [])
			}, async () => {
				const receipt = await runTaskRegistryWorkerOperation(context, {
					type: "flows.runTask",
					input: {
						callerOwnerKey: binding.sessionKey,
						params: taskInput,
						taskId: scope.taskId,
						now: Date.now()
					}
				}, () => context.admission.assertCurrent(), (owner) => {
					creationOwner = owner;
				});
				if (receipt.taskMutation === "created" || receipt.taskMutation === "updated") publicationTask = receipt.task;
				return receipt;
			}, () => taskStore.loadMutationSnapshotAsync(context, scope))));
		},
		get: (flowId) => read("id", flowId),
		async list() {
			const { store, context } = await readStore(false, true);
			return store.executeOpenClawStateWorker(context, {
				type: "flows.list",
				input: { ownerKey: binding.sessionKey }
			});
		},
		findLatest: () => read("latest"),
		resolve: (token) => read("resolve", token),
		getTaskSummary: (flowId) => readFlowTaskSummary(binding.sessionKey, flowId)
	};
}
function bindFlows(params) {
	const binding = bind(params);
	const read = async (lookup, token) => {
		const { store, context } = await readStore(true, true);
		return store.runOpenClawStateWorkerOperation(context, async (scope) => {
			const result = await scope.execute({
				type: "flows.detail",
				input: {
					ownerKey: binding.sessionKey,
					lookup,
					token
				}
			});
			context.admission.assertCurrent();
			return result ? mapTaskFlowDetail(result) : void 0;
		});
	};
	return {
		...binding,
		get: (flowId) => read("id", flowId),
		async list() {
			const { store, context } = await readStore(false, true);
			return store.executeOpenClawStateWorker(context, {
				type: "flows.views",
				input: { ownerKey: binding.sessionKey }
			});
		},
		findLatest: () => read("latest"),
		resolve: (token) => read("resolve", token),
		async getTaskSummary(flowId) {
			const summary = await readFlowTaskSummary(binding.sessionKey, flowId);
			return summary ? mapTaskRunAggregateSummary(summary) : void 0;
		}
	};
}
function createRuntimeAsyncTasks() {
	return {
		runs: {
			bindSession: bindRuns,
			fromToolContext: (ctx) => bindRuns({
				sessionKey: ctx.sessionKey ?? "",
				agentId: ctx.agentId,
				requesterOrigin: ctx.deliveryContext
			})
		},
		flows: {
			bindSession: bindFlows,
			fromToolContext: (ctx) => bindFlows({
				sessionKey: ctx.sessionKey ?? "",
				requesterOrigin: ctx.deliveryContext
			})
		},
		managedFlows: {
			bindSession: bindManagedFlows,
			fromToolContext: (ctx) => bindManagedFlows({
				sessionKey: ctx.sessionKey ?? "",
				requesterOrigin: ctx.deliveryContext
			})
		}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-tasks.ts
function assertSessionKey(sessionKey, errorMessage) {
	const normalized = sessionKey?.trim();
	if (!normalized) throw new Error(errorMessage);
	return normalized;
}
function mapCancelledTaskResult(result) {
	return {
		found: result.found,
		cancelled: result.cancelled,
		...result.reason ? { reason: result.reason } : {},
		...result.task ? { task: mapTaskRunDetail(result.task) } : {}
	};
}
function createBoundTaskRunsRuntime(params) {
	const ownerKey = assertSessionKey(params.sessionKey, "Tasks runtime requires a bound sessionKey.");
	const requesterOrigin = params.requesterOrigin ? normalizeDeliveryContext(params.requesterOrigin) : void 0;
	return {
		sessionKey: ownerKey,
		...requesterOrigin ? { requesterOrigin } : {},
		get: (taskId) => {
			const task = getTaskByIdForOwner({
				taskId,
				callerOwnerKey: ownerKey,
				callerAgentId: params.agentId
			});
			return task ? mapTaskRunDetail(task) : void 0;
		},
		list: () => listTasksForRelatedSessionKeyForOwner({
			relatedSessionKey: ownerKey,
			callerOwnerKey: ownerKey,
			callerAgentId: params.agentId
		}).map((task) => mapTaskRunView(task)),
		findLatest: () => {
			const task = findLatestTaskForRelatedSessionKeyForOwner({
				relatedSessionKey: ownerKey,
				callerOwnerKey: ownerKey,
				callerAgentId: params.agentId
			});
			return task ? mapTaskRunDetail(task) : void 0;
		},
		resolve: (token) => {
			const task = resolveTaskForLookupTokenForOwner({
				token,
				callerOwnerKey: ownerKey,
				callerAgentId: params.agentId
			});
			return task ? mapTaskRunDetail(task) : void 0;
		},
		cancel: async ({ taskId, cfg }) => {
			const task = getTaskByIdForOwner({
				taskId,
				callerOwnerKey: ownerKey,
				callerAgentId: params.agentId
			});
			if (!task) return {
				found: false,
				cancelled: false,
				reason: "Task not found."
			};
			return mapCancelledTaskResult(await cancelDetachedTaskRunById({
				cfg,
				taskId: task.taskId
			}));
		}
	};
}
function createBoundTaskFlowsRuntime(params) {
	const ownerKey = assertSessionKey(params.sessionKey, "TaskFlow runtime requires a bound sessionKey.");
	const requesterOrigin = params.requesterOrigin ? normalizeDeliveryContext(params.requesterOrigin) : void 0;
	const getDetail = (flowId) => {
		const flow = getTaskFlowByIdForOwner({
			flowId,
			callerOwnerKey: ownerKey
		});
		if (!flow) return;
		const tasks = listTasksForFlowId(flow.flowId);
		return mapTaskFlowDetail({
			flow,
			tasks
		});
	};
	return {
		sessionKey: ownerKey,
		...requesterOrigin ? { requesterOrigin } : {},
		get: (flowId) => getDetail(flowId),
		list: () => listTaskFlowsForOwner({ callerOwnerKey: ownerKey }).map((flow) => mapTaskFlowView(flow)),
		findLatest: () => {
			const flow = findLatestTaskFlowForOwner({ callerOwnerKey: ownerKey });
			return flow ? getDetail(flow.flowId) : void 0;
		},
		resolve: (token) => {
			const flow = resolveTaskFlowForLookupTokenForOwner({
				token,
				callerOwnerKey: ownerKey
			});
			return flow ? getDetail(flow.flowId) : void 0;
		},
		getTaskSummary: (flowId) => {
			const flow = getTaskFlowByIdForOwner({
				flowId,
				callerOwnerKey: ownerKey
			});
			return flow ? mapTaskRunAggregateSummary(getFlowTaskSummary(flow.flowId)) : void 0;
		}
	};
}
function createRuntimeTaskRuns() {
	return {
		bindSession: (params) => createBoundTaskRunsRuntime({
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			requesterOrigin: params.requesterOrigin
		}),
		fromToolContext: (ctx) => createBoundTaskRunsRuntime({
			sessionKey: assertSessionKey(ctx.sessionKey, "Tasks runtime requires tool context with a sessionKey."),
			agentId: ctx.agentId,
			requesterOrigin: ctx.deliveryContext
		})
	};
}
function createRuntimeTaskFlows() {
	return {
		bindSession: (params) => createBoundTaskFlowsRuntime({
			sessionKey: params.sessionKey,
			requesterOrigin: params.requesterOrigin
		}),
		fromToolContext: (ctx) => createBoundTaskFlowsRuntime({
			sessionKey: assertSessionKey(ctx.sessionKey, "TaskFlow runtime requires tool context with a sessionKey."),
			requesterOrigin: ctx.deliveryContext
		})
	};
}
function createRuntimeTasks(params) {
	return {
		async: createRuntimeAsyncTasks(),
		runs: createRuntimeTaskRuns(),
		flows: createRuntimeTaskFlows(),
		managedFlows: params.managedTaskFlow
	};
}
//#endregion
//#region src/plugins/runtime/index.ts
const loadTtsRuntime = createLazyRuntimeModule(() => import("./plugin-sdk/tts-runtime.js"));
const loadTtsRequestRuntime = createLazyRuntimeModule(() => import("./runtime-tts-request-BuWropHe.mjs"));
const loadMediaUnderstandingRuntime = createLazyRuntimeModule(() => import("./runtime-BTPnC0cL.mjs"));
const loadGatewayPluginRuntime = createLazyRuntimeModule(() => import("./server-plugins-D97tcFBF.mjs"));
function createRuntimeGateway() {
	return {
		isAvailable: async () => {
			return (await loadGatewayPluginRuntime()).hasInProcessGatewayContext();
		},
		request: async (method, params, options) => {
			return (await loadGatewayPluginRuntime()).dispatchTrustedPluginGatewayMethod(method, params, options);
		}
	};
}
function createRuntimeTts() {
	const bindTtsRuntime = createLazyRuntimeMethodBinder(loadTtsRuntime);
	return {
		prepareTtsRequest: createLazyRuntimeMethodBinder(loadTtsRequestRuntime)((runtime) => runtime.prepareTtsRequest),
		textToSpeech: bindTtsRuntime((runtime) => runtime.textToSpeech),
		textToSpeechStream: bindTtsRuntime((runtime) => runtime.textToSpeechStream),
		textToSpeechTelephony: bindTtsRuntime((runtime) => runtime.textToSpeechTelephony),
		listVoices: bindTtsRuntime((runtime) => runtime.listSpeechVoices)
	};
}
function createRuntimeMediaUnderstandingFacade() {
	const bindMediaUnderstandingRuntime = createLazyRuntimeMethodBinder(loadMediaUnderstandingRuntime);
	return {
		resolveAudioInputBudget: bindMediaUnderstandingRuntime((runtime) => runtime.resolveAudioInputBudget),
		runFile: bindMediaUnderstandingRuntime((runtime) => runtime.runMediaUnderstandingFile),
		describeImageFile: bindMediaUnderstandingRuntime((runtime) => runtime.describeImageFile),
		describeImageFileWithModel: bindMediaUnderstandingRuntime((runtime) => runtime.describeImageFileWithModel),
		extractStructuredWithModel: bindMediaUnderstandingRuntime((runtime) => runtime.extractStructuredWithModel),
		describeVideoFile: bindMediaUnderstandingRuntime((runtime) => runtime.describeVideoFile),
		transcribeAudioFile: bindMediaUnderstandingRuntime((runtime) => runtime.transcribeAudioFile)
	};
}
function createRuntimeLlmFacade() {
	const loadAcquireLocalService = createLazyRuntimeMethod(() => import("./provider-local-service-q1tyyCxV.mjs"), (runtime) => runtime.createConfiguredProviderLocalServiceAcquirer(getRuntimeConfig));
	const loadLlm = createLazyRuntimeSurface(() => import("./runtime-llm.runtime.js"), (m) => m.createRuntimeLlm({
		getConfig: getRuntimeConfig,
		authority: { allowComplete: true }
	}));
	return {
		acquireLocalService: (...args) => loadAcquireLocalService(...args),
		complete: async (params) => {
			return (await loadLlm()).complete(params);
		}
	};
}
function createUnavailableSubagentRuntime() {
	const unavailable = () => {
		throw new RequestScopedSubagentRuntimeError();
	};
	return {
		complete: unavailable,
		run: unavailable,
		waitForRun: unavailable,
		getSessionMessages: unavailable,
		deleteSession: unavailable
	};
}
function createUnavailableNodesRuntime() {
	const unavailable = () => {
		throw new Error("Plugin node runtime is only available inside the Gateway.");
	};
	return {
		list: unavailable,
		invoke: unavailable,
		openDuplex: unavailable
	};
}
function createRuntimeWorktrees() {
	const loadService = () => import("./service-OLDBrV4u.mjs");
	return {
		async resolveCheckoutRoot(params) {
			const { findGitCheckoutRoot } = await import("./git-InJ4P0Zo.mjs");
			return findGitCheckoutRoot(params.path) ?? void 0;
		},
		async hasSelfContainedCheckoutMetadata(params) {
			const { hasSelfContainedGitMetadata } = await import("./git-InJ4P0Zo.mjs");
			return await hasSelfContainedGitMetadata(params.path);
		},
		async create(params) {
			const { managedWorktrees } = await loadService();
			const record = await managedWorktrees.create(params);
			await managedWorktrees.acquire(record.id);
			return {
				id: record.id,
				path: record.path,
				branch: record.branch
			};
		},
		async release(params) {
			const { managedWorktrees } = await loadService();
			await managedWorktrees.releaseByPath(params.path);
		},
		async removeIfLossless(params) {
			const { managedWorktrees } = await loadService();
			return managedWorktrees.removeIfLosslessByPath(params.path, {
				ownerKind: params.ownerKind,
				ownerId: params.ownerId
			});
		}
	};
}
function createRuntimeSandbox(agent) {
	const resolveWorkspaceAuthority = (params) => resolveSandboxWorkspaceAuthority({
		...params,
		sessionEntry: agent.session.getSessionEntry({
			agentId: params.agentId,
			sessionKey: params.sessionKey
		})
	});
	return {
		resolveWorkspaceAuthority,
		async prepareWorkspaceAuthority(params) {
			const authority = resolveWorkspaceAuthority(params);
			if (!authority.sandboxed || authority.confinementError) return authority;
			const { resolveSandboxContext } = await import("./context-CpCJ3pIe.mjs");
			await resolveSandboxContext({
				config: params.config,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				workspaceDir: params.workspaceDir,
				requireCurrentConfig: true
			});
			return authority;
		}
	};
}
const createPluginRuntime = (_options = {}, base = createRuntimeBase()) => {
	const tasks = createRuntimeTasks({ managedTaskFlow: createRuntimeTaskFlow() });
	const agent = createRuntimeAgent();
	let modelAuth = _options.modelAuth;
	let modelConfig = _options.modelConfig;
	const runtime = {
		version: VERSION,
		decisions: { evaluate: async (...args) => (await import("./runtime-BRCBPcLi.mjs")).evaluateDecision(...args) },
		gateway: _options.gateway ?? createRuntimeGateway(),
		config: base.config,
		agent,
		hooks: _options.hooks ?? { dispatchHookAgentTurn: async () => {
			throw new Error("Plugin hook runtime is only available inside the Gateway.");
		} },
		subagent: _options.subagent ?? createUnavailableSubagentRuntime(),
		nodes: _options.nodes ?? createUnavailableNodesRuntime(),
		sandbox: createRuntimeSandbox(agent),
		worktrees: createRuntimeWorktrees(),
		system: base.system,
		media: createRuntimeMedia(),
		webSearch: {
			listProviders: listWebSearchProviders,
			search: runWebSearch
		},
		channel: createRuntimeChannel(_options.dispatchReplyFromConfig ? { dispatchReplyFromConfig: _options.dispatchReplyFromConfig } : void 0),
		events: createRuntimeEvents(),
		logging: createRuntimeLogging(),
		state: base.state,
		tasks,
		tts: createRuntimeTts(),
		mediaUnderstanding: createRuntimeMediaUnderstandingFacade(),
		get modelAuth() {
			return modelAuth ??= resolveNativePluginModelAuth();
		},
		get modelConfig() {
			return modelConfig ??= resolveNativePluginModelConfig();
		},
		imageGeneration: {
			generate: async (params) => (await import("./runtime-BgdkWyGw.mjs")).generateImage(params),
			listProviders: (params) => listImageGenerationProviders(params?.config)
		},
		videoGeneration: {
			generate: async (params) => (await import("./runtime-ComexsjX.mjs")).generateVideo(params),
			listProviders: (params) => listVideoGenerationProviders(params?.config)
		},
		musicGeneration: {
			generate: async (params) => (await import("./runtime-o91KYnfO.mjs")).generateMusic(params),
			listProviders: (params) => listMusicGenerationProviders(params?.config)
		},
		llm: createRuntimeLlmFacade()
	};
	for (const key of [
		"tts",
		"mediaUnderstanding",
		"imageGeneration",
		"videoGeneration",
		"musicGeneration",
		"llm"
	]) {
		const value = runtime[key];
		Object.defineProperty(runtime, key, { get: () => value });
	}
	return runtime;
};
//#endregion
export { createPluginRuntime as t };
