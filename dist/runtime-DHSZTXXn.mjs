import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as createLazyRuntimeSurface, n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { o as mediaKindFromMime } from "./constants-GzjKtFvA.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DyHnjiiS.mjs";
import { l as normalizeToolPolicyName, o as expandToolGroups } from "./tool-policy-shared-DWHChhWM.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match-Dn8gpf-E.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-BKvvmcQR.mjs";
import { f as onAgentEvent } from "./agent-events-GvNTkbe3.mjs";
import { i as buildModelAliasIndex, r as buildConfiguredModelCatalog, v as resolveModelRefFromString } from "./model-selection-shared-DKlQ1p0S.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import { c as normalizeThinkLevel } from "./thinking.shared-Jy32Vp-O.mjs";
import { a as normalizeExecTarget } from "./exec-approvals-core-s7tTQC_a.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { i as onSessionTranscriptUpdate } from "./transcript-events-DUHAZLVw.mjs";
import { t as resolveAllowedModelRefCore } from "./model-selection-resolve-cpFpShck.mjs";
import { c as resolveNativePluginModelConfig, g as createRuntimeBase, s as resolveNativePluginModelAuth } from "./loader-runtime-load-BQO3MsEg.mjs";
import { s as createSessionWorkStartChangedError } from "./work-start-error-Dh9d0ImY.mjs";
import { d as resolveThinkingProfile } from "./thinking-NbdrO8vA.mjs";
import "./model-selection-D3_rVb38.mjs";
import { r as resolveThinkingDefaultCore } from "./model-thinking-default-CZnoMXD6.mjs";
import { s as resolveEffectiveAgentRuntime, t as concretizeAgentRuntime } from "./thinking-runtime-DsaB5fLF.mjs";
import { n as detectMime } from "./mime-CGDYrRzL.mjs";
import { t as ensureAgentWorkspace } from "./workspace-C0xiByg0.mjs";
import { s as normalizeResolvedMaintenanceConfigInput } from "./store-maintenance-CGOlSbiV.mjs";
import "./exec-approvals-B1rZTeax.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { A as captureSessionInitializationOwner, j as createSessionInitialization } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { g as runExclusiveSessionLifecycleMutation, h as isSessionWorkAdmissionActive, n as beginSessionWorkAdmission } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { d as replaceSessionEntry, o as loadSessionEntryReadOnly, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-8r2jOQkD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { c as updateSessionEntry } from "./session-accessor.reset-Bn2-AwEV.mjs";
import { a as rollbackPluginOwnedSessionEntryLifecycle, i as rollbackAgentHarnessSessionEntryLifecycle, n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-Ces1Mc-0.mjs";
import { t as RequestScopedSubagentRuntimeError } from "./error-runtime-BmospGvZ.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Q2p-0uCf.mjs";
import { o as resolveSessionWorkStartError } from "./lifecycle-DdaXH8bC.mjs";
import { n as resolveAgentIdentity } from "./identity-uzCeiPuC.mjs";
import { a as resolveSubagentToolPolicyForSession, i as resolveInheritedToolPolicyForSession, n as resolveEffectiveToolPolicy } from "./agent-tools.policy-XJMKA8K7.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-DGIfx80_.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-m46YZG5q.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-xnA7gN4_.mjs";
import { o as resolveEffectiveSessionToolsVisibility } from "./session-visibility-BA6GpxqH.mjs";
import { a as listMusicGenerationProviders, i as listImageGenerationProviders, o as listVideoGenerationProviders } from "./registry-B1Y9Uoiz.mjs";
import { i as listWebSearchProviders, o as runWebSearch } from "./runtime-BT0TuP1R.mjs";
import { t as resolveEmbeddedCliBackendDispatchEligibility } from "./cli-backend-dispatch-eligibility-DmdSJwII.mjs";
import { t as createRuntimeChannel } from "./runtime-channel-Cb-C4ia3.mjs";
import { t as createRuntimeLogging } from "./runtime-logging-CCoOj5NC.mjs";
import { t as isVoiceMessageCompatibleAudio } from "./audio-FjhEe9q3.mjs";
import { t as subscribeRuntimeSessionChanges } from "./session-changes-DMNZsoj3.mjs";
import { isDeepStrictEqual } from "node:util";
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
		mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(effective.profile), effective.profileAlsoAllow),
		mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(effective.providerProfile), effective.providerProfileAlsoAllow),
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
		const agentConfig = resolveAgentConfig(params.config, runtime.agentId);
		const elevated = agentConfig?.tools?.elevated;
		if (params.config.tools?.elevated?.enabled === true && elevated?.enabled !== false) confinementError = "target agent can request host-level elevated execution.";
		const rawSessionExecHost = params.sessionEntry?.execHost?.trim();
		const sessionExecHost = normalizeExecTarget(rawSessionExecHost);
		const execHost = sessionExecHost ?? agentConfig?.tools?.exec?.host ?? params.config.tools?.exec?.host ?? "auto";
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
//#region src/plugins/runtime/runtime-agent-workspace.ts
function ensurePluginAgentWorkspace(params) {
	const legacy = params?.beforePersistentApply;
	const assertHost = params?.guard?.assertHost;
	if (!legacy) return ensureAgentWorkspace(params);
	let refusal;
	const check = (assertAllowed) => {
		if (refusal) throw refusal.error;
		try {
			assertAllowed?.();
		} catch (error) {
			refusal = { error };
			throw error;
		}
	};
	resolveGlobalSingleton(Symbol.for("openclaw.workspaceGuardDeprecation"), () => {
		process.emitWarning("ensureAgentWorkspace.beforePersistentApply runs before dispatch; synchronous OpenClaw DB access in this callback is deprecated. Use SQL-free guard.assertHost for live revocation at commit. Removal: next Plugin SDK major.", {
			code: "DEP_WORKSPACE_MUTATION_GUARD",
			type: "DeprecationWarning"
		});
		return true;
	});
	return ensureAgentWorkspace({
		...params,
		guard: {
			assertHost: () => check(assertHost),
			beforeLegacyApply: () => check(legacy)
		}
	});
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
	const [command, identity] = await Promise.all([import("./agent-command-DYmC82Cu.mjs"), import("./agent-command-execution-identity-D9PGRtrA.mjs")]);
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
const listSessionEntries = (params = {}) => {
	return (params.readOnly ? listSessionEntriesReadOnly : listSessionEntriesCore)({
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	});
};
const patchSessionEntry = async (params) => {
	return await patchSessionEntryCore(toSessionAccessScope(params), params.update, {
		assertCommitAllowed: params.assertCommitAllowed,
		fallbackEntry: params.fallbackEntry,
		maintenanceConfig: params.maintenanceConfig !== void 0 ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : void 0,
		preserveActivity: params.preserveActivity,
		replaceEntry: params.replaceEntry
	});
};
const updateSessionStoreEntry = async (params) => {
	return await updateSessionEntry({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, params.update, {
		skipMaintenance: params.skipMaintenance,
		takeCacheOwnership: params.takeCacheOwnership,
		requireWriteSuccess: params.requireWriteSuccess
	});
};
const upsertSessionEntry = async (params) => {
	await replaceSessionEntry(toSessionAccessScope(params), params.entry);
};
async function createSessionEntry(params) {
	const creationOwner = captureSessionInitializationOwner("agentHarnessId" in params.initialEntry ? params.initialEntry.agentHarnessId : void 0);
	const [{ createGatewaySession }, { resolveGatewaySessionStoreTarget }, { readAcpSessionMetaForEntry }, { upsertAcpSessionMeta }, { resolveSandboxedSessionCreation }] = await Promise.all([
		import("./session-create-service-qVktIZmU.mjs"),
		import("./session-utils-Lz35_6Mu.mjs"),
		import("./session-meta-readonly-BNtFaPDq.mjs"),
		import("./session-meta-uOpmT54K.mjs"),
		import("./operator-session-run-Dm70K4SO.mjs")
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
	return await runExclusiveSessionLifecycleMutation("plugin-create", {
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
			const catalog = params.catalog ?? buildConfiguredModelCatalog({ cfg: getRuntimeConfig() });
			const profile = resolveThinkingProfile({
				...params,
				agentRuntime: effectiveRuntime,
				catalog: params.catalog ?? (catalog.length > 0 ? catalog : void 0)
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
		ensureAgentWorkspace: ensurePluginAgentWorkspace
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
//#region src/plugins/runtime/runtime-media.ts
const loadWebMedia = createLazyRuntimeMethod(() => import("./web-media-DraLD1Xr.mjs"), (runtime) => runtime.loadWebMedia);
const getImageMetadata = createLazyRuntimeMethod(() => import("./image-ops-B4PmLwb2.mjs"), (runtime) => runtime.getImageMetadata);
const resizeToJpeg = createLazyRuntimeMethod(() => import("./image-ops-B4PmLwb2.mjs"), (runtime) => runtime.resizeToJpeg);
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
//#region src/plugins/runtime/index.ts
const loadTtsRuntime = createLazyRuntimeModule(() => import("./plugin-sdk/tts-runtime.js"));
const loadTtsRequestRuntime = createLazyRuntimeModule(() => import("./runtime-api-DFR6H-RA.mjs"));
const loadMediaUnderstandingRuntime = createLazyRuntimeModule(() => import("./runtime-RuAqSqIc.mjs"));
const loadGatewayPluginRuntime = createLazyRuntimeModule(() => import("./server-plugins-BljHYC4k.mjs"));
function createRuntimeGateway() {
	return {
		isAvailable: async () => (await loadGatewayPluginRuntime()).hasInProcessGatewayContext(),
		request: async (method, params, options) => {
			return (await loadGatewayPluginRuntime()).dispatchTrustedPluginGatewayMethod(method, params, options);
		},
		openPluginPanel: async (params) => (await loadGatewayPluginRuntime()).openPluginPanelForRequester(params),
		readSessionFacts: async (params) => (await loadGatewayPluginRuntime()).readTrustedPluginSessionFacts(params),
		subscribeSessionChanges: subscribeRuntimeSessionChanges,
		withUserProfileIdentity: async (params, run) => {
			const captured = {
				profileId: params.profileId,
				emails: params.emails.slice(),
				githubAccountIds: params.githubAccountIds === void 0 ? void 0 : params.githubAccountIds.slice()
			};
			return (await loadGatewayPluginRuntime()).withTrustedPluginUserProfileIdentity(captured, run);
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
	const loadAcquireLocalService = createLazyRuntimeMethod(() => import("./provider-local-service-fjCTDWbT.mjs"), (runtime) => runtime.createConfiguredProviderLocalServiceAcquirer(getRuntimeConfig));
	const loadLlm = createLazyRuntimeSurface(() => import("./runtime-llm.runtime.js"), (m) => m.createRuntimeLlm({
		getConfig: getRuntimeConfig,
		authority: { allowComplete: true }
	}));
	return {
		acquireLocalService: loadAcquireLocalService,
		complete: createLazyRuntimeMethod(loadLlm, (llm) => llm.complete)
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
	const loadService = () => import("./service-obfLq1v6.mjs");
	return {
		async resolveCheckoutRoot(params) {
			const { findGitCheckoutRoot } = await import("./git-AX9dI48P.mjs");
			return findGitCheckoutRoot(params.path) ?? void 0;
		},
		async hasSelfContainedCheckoutMetadata(params) {
			const { hasSelfContainedGitMetadata } = await import("./git-AX9dI48P.mjs");
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
			const { resolveSandboxContext } = await import("./context-CLGj5xC0.mjs");
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
	const agent = createRuntimeAgent();
	let modelAuth = _options.modelAuth;
	let modelConfig = _options.modelConfig;
	const runtime = {
		version: VERSION,
		decisions: { evaluate: async (...args) => (await import("./runtime-DbiS_UJb.mjs")).evaluateDecision(...args) },
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
		events: {
			onAgentEvent,
			onSessionTranscriptUpdate
		},
		logging: createRuntimeLogging(),
		state: base.state,
		tts: createRuntimeTts(),
		mediaUnderstanding: createRuntimeMediaUnderstandingFacade(),
		get modelAuth() {
			return modelAuth ??= resolveNativePluginModelAuth();
		},
		get modelConfig() {
			return modelConfig ??= resolveNativePluginModelConfig();
		},
		imageGeneration: {
			generate: async (params) => (await import("./runtime-B8LAonNK.mjs")).generateImage(params),
			listProviders: (params) => listImageGenerationProviders(params?.config)
		},
		videoGeneration: {
			generate: async (params) => (await import("./runtime-C7beadqm.mjs")).generateVideo(params),
			listProviders: (params) => listVideoGenerationProviders(params?.config)
		},
		musicGeneration: {
			generate: async (params) => (await import("./runtime-Dhi-8d65.mjs")).generateMusic(params),
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
