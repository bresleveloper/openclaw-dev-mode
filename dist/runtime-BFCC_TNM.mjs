import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { a as createLazyRuntimeSurface, n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-CJrzFzqU.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { m as onAgentEvent } from "./agent-events-Bf3Js0D3.mjs";
import { f as sessionEntryCommitGuardOptions } from "./session-source-authority-fdILH-PW.mjs";
import { _ as resolveDefaultAgentId, a as resolveAgentDir, f as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { a as onSessionTranscriptUpdate } from "./transcript-events-D3brcRJS.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { i as DEFAULT_PROVIDER, n as DEFAULT_MODEL } from "./defaults-Bg930vxE.mjs";
import { _ as resolveSessionAgentIds } from "./agent-scope-DXrnO3F4.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DGlfxTaj.mjs";
import { c as normalizeToolPolicyName, i as expandToolGroups } from "./tool-policy-shared-PsZCKeeN.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match--5jlhAPZ.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-14GRhbFd.mjs";
import { i as buildModelAliasIndex, r as buildConfiguredModelCatalog, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { l as normalizeThinkLevel } from "./thinking.shared-Be8dhC75.mjs";
import { a as normalizeExecTarget } from "./exec-approvals-core-7oJu_fRe.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { o as mediaKindFromMime } from "./constants-GzjKtFvA.mjs";
import { n as detectMime } from "./mime-C3j3dfQb.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { o as createSessionWorkStartChangedError } from "./work-start-error-BI-UhSB2.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { i as readSessionEntryReadOnlyInWorker, l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import { O as captureSessionInitializationOwner, R as withPreparedSessionCapabilityRead, k as createSessionInitialization } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { S as runExclusiveSessionLifecycleMutation, b as isSessionWorkAdmissionActive, n as beginSessionWorkAdmission } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { a as loadSessionEntryReadOnly, o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import "./config-B3oiWDlr.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-BLpjjUTc.mjs";
import { a as rollbackPluginOwnedSessionEntryLifecycle, i as rollbackAgentHarnessSessionEntryLifecycle, n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-7VGnaDT3.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-BBs3o51w.mjs";
import { t as resolveAllowedModelRefCore } from "./model-selection-resolve-B4Z5ZIMD.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { d as resolveThinkingProfile } from "./thinking-BCNoGfZ5.mjs";
import { r as resolveThinkingDefaultCore } from "./model-thinking-default-BKqBSSHy.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { o as resolveEffectiveAgentRuntime, t as concretizeAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { c as resolveNativePluginModelAuth, l as resolveNativePluginModelConfig, v as createRuntimeBase } from "./loader-runtime-load-DzFljQbT.mjs";
import { n as resolveAgentIdentity } from "./identity-VQc9B4RO.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { r as resolveSandboxConfigForAgent } from "./config-Bf089UPS.mjs";
import { r as resolveSandboxRuntimeStatus } from "./runtime-status-DWm-5zUj.mjs";
import { t as ensureAgentWorkspace } from "./workspace-3xrXOvoY.mjs";
import { t as RequestScopedSubagentRuntimeError } from "./error-runtime-ikopZs5O.mjs";
import { a as resolveSubagentToolPolicyForSession, i as resolveInheritedToolPolicyForSession, n as resolveEffectiveToolPolicy } from "./agent-tools.policy-t04F-r_I.mjs";
import { a as resolveEffectiveSessionToolsVisibility } from "./session-visibility-CMzmBVR3.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import { a as listMusicGenerationProviders, i as listImageGenerationProviders, o as listVideoGenerationProviders } from "./registry-DB8J1c3I.mjs";
import { a as listWebSearchProviders, l as runWebSearch, o as listWebSearchProvidersAsync } from "./runtime-DTeyaROR.mjs";
import { n as resolveEmbeddedCliBackendDispatchEligibilityAsync, t as resolveEmbeddedCliBackendDispatchEligibility } from "./cli-backend-dispatch-eligibility-BMWTSYsM.mjs";
import { n as getSessionEntryByIdAsync, t as getSessionEntryAsync } from "./session-store-runtime-internal-Cv2I3LCC.mjs";
import { C as updateSessionStoreEntry, c as listSessionEntriesAsync, d as patchSessionEntry, f as prepareSessionEntryPatch, w as upsertSessionEntry } from "./session-store-runtime-DVNFhqCK.mjs";
import { t as createRuntimeChannel } from "./runtime-channel-Buvssbbk.mjs";
import { t as createRuntimeLogging } from "./runtime-logging-agorr2bC.mjs";
import { t as isVoiceMessageCompatibleAudio } from "./audio-B2mysANN.mjs";
import { t as subscribeRuntimeSessionChanges } from "./session-changes-BjVcRkOM.mjs";
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
	const runtime = params.preparedRuntimeStatus;
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
//#region src/plugins/runtime/runtime-agent-session-create.ts
async function createRuntimeSessionEntry(params) {
	const creationOwner = captureSessionInitializationOwner("agentHarnessId" in params.initialEntry ? params.initialEntry.agentHarnessId : void 0);
	const source = captureSessionActorStorageOwner({
		sessionKey: params.key,
		agentId: params.agentId
	}, {
		assertCurrent: creationOwner.assertCurrent,
		authorize: creationOwner.assertCurrent
	});
	const [{ createGatewaySession }, { resolveGatewaySessionStoreTargetInWorker }, { readAcpSessionMetaForEntryAsync }, { upsertAcpSessionMeta }, { resolveSandboxedSessionCreation }] = await Promise.all([
		import("./session-create-service-DI5YylhO.mjs"),
		import("./session-utils-store-worker-CmMErbaH.mjs"),
		import("./session-meta-readonly-w8CBuRdj.mjs"),
		import("./session-meta-6oUEhIoX.mjs"),
		import("./operator-session-run-Cx2Ajtv-.mjs")
	]);
	creationOwner.assertCurrent();
	const requiredCreation = resolveSandboxedSessionCreation(getPluginRuntimeGatewayRequestScope()?.client, params.cfg);
	const target = source ? {
		agentId: source.agentId,
		canonicalKey: resolveSqliteSessionKey(params.key, source.agentId),
		storeKeys: [resolveSqliteSessionKey(params.key, source.agentId)],
		storePath: source.path
	} : await resolveGatewaySessionStoreTargetInWorker({
		cfg: params.cfg,
		key: params.key,
		assertActive: creationOwner.assertCurrent,
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
	const create = () => runExclusiveSessionLifecycleMutation("plugin-create", {
		scope: target.storePath,
		identities,
		prepare: async () => {
			if (isSessionWorkAdmissionActive(target.storePath, identities)) throw new Error(`Session "${target.canonicalKey}" is still active; retry creation later.`);
		},
		run: async () => {
			creationOwner.assertCurrent();
			const afterCreate = params.afterCreate;
			let initialization;
			let initializationReceipt;
			let initializationEntry;
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
					const persistedEntry = await readSessionEntryReadOnlyInWorker({
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
				const memory = captureMemoryExactSessionReader({
					sessionKey: captured.key,
					storePath: captured.storePath
				});
				if (!memory) await withSessionEntryReadOnlyInWorker({
					sessionKey: captured.key,
					agentId: captured.agentId,
					storePath: captured.storePath
				}, creationOwner.assertCurrent, async (read, owner) => {
					if (!read.ok) throw read.error;
					if (!isDeepStrictEqual(read.value, expected) || !owner.source) throw new Error(`Session initialization owner changed: ${captured.key}`);
					initializationEntry = read.value;
					initializationReceipt = retainPreparedSessionEntryPredicate({
						databaseIdentity: `file:${owner.source.databaseIdentity}`,
						sessionKey: captured.key,
						entry: expected,
						matches: (_before, after) => {
							initializationEntry = after;
							return after === void 0 || isDeepStrictEqual(after, expected);
						}
					});
				});
				initialization = createSessionInitialization({
					storePath: captured.storePath,
					sessionKey: captured.key,
					sessionId: expected.sessionId,
					lifecycleRevision: expected.lifecycleRevision
				}, (phase, deleted) => {
					if (phase === "rollback") creationOwner.assertRollbackCurrent();
					else creationOwner.assertCurrent();
					const current = memory ? memory.read(captured.key) : initializationEntry;
					if (!memory && !initializationReceipt?.isCurrent()) throw new Error(`Session initialization owner changed: ${captured.key}`);
					const matches = memory ? isDeepStrictEqual(current, expected) : true;
					if (deleted ? current !== void 0 : current?.initializationPending !== true || !matches) throw new Error(`Session initialization owner changed: ${captured.key}`);
				}, {
					config: params.cfg,
					agentId: captured.agentId,
					entry: expected
				}, creationOwner);
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
				const matchingEntry = params.recoverMatchingInitialEntry === true ? await readSessionEntryReadOnlyInWorker({
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
					const matchingAcpMeta = acpInitial ? await readAcpSessionMetaForEntryAsync({
						sessionKey: target.canonicalKey,
						agentId: target.agentId,
						cfg: params.cfg,
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
						key: target.canonicalKey,
						...source ? { incognito: true } : {},
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
						...sessionEntryCommitGuardOptions(creationOwner.assertCurrent)
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
				const current = await readSessionEntryReadOnlyInWorker({
					sessionKey: callbackContext.key,
					storePath: callbackContext.storePath,
					readConsistency: "latest"
				});
				if (current?.sessionId === callbackContext.entry.sessionId && current.lifecycleRevision === callbackContext.entry.lifecycleRevision && current.initializationPending !== true) throw error;
				try {
					let expectedEntry = rollbackExpectedEntry ?? callbackContext.entry;
					if (acpInitial && !rollbackExpectedEntry) {
						const currentEntry = await readSessionEntryReadOnlyInWorker({
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
				initializationReceipt?.release();
			}
		}
	});
	return await create();
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
		process.emitWarning("ensureAgentWorkspace.beforePersistentApply runs before dispatch; synchronous OpenClaw DB access in this callback is deprecated. Await owner preparation and use SQL-free guard.assertHost for live revocation at commit. Final compatibility day: 2026-12-31. Removal ships in the first January 2027 stable release; no SDK major is required.", {
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
	const [command, identity] = await Promise.all([import("./agent-command-BhAQdxsF.mjs"), import("./agent-command-execution-identity-BYAC8AgD.mjs")]);
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
	warnPluginSdkDeprecation({
		family: "session-store",
		method: "runtime.agent.session.listSessionEntries",
		replacement: "runtime.agent.session.listSessionEntriesAsync"
	});
	return (params.readOnly ? listSessionEntriesReadOnly : listSessionEntriesCore)({
		...params.sessionKeys !== void 0 ? { sessionKeys: params.sessionKeys } : {},
		...params.includeParticipants !== void 0 ? { includeParticipants: params.includeParticipants } : {},
		...params.captureSource ? { captureSource: params.captureSource } : {},
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	});
};
async function runWithSessionWorkAdmission(input, run) {
	const params = { ...input };
	const memory = captureMemoryExactSessionReader(params, () => params.signal?.throwIfAborted());
	if (memory) return admit(memory.read(params.sessionKey, "list"), () => memory.read(params.sessionKey, "list"));
	return runAdmittedWork();
	async function runAdmittedWork() {
		return withSessionEntryReadOnlyInWorker({
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			readConsistency: "latest"
		}, () => params.signal?.throwIfAborted(), async (read, owner) => {
			if (!read.ok) throw read.error;
			const initialEntry = read.value;
			const retained = owner.source?.databaseIdentity ? retainPreparedSessionEntryPredicate({
				databaseIdentity: `file:${owner.source.databaseIdentity}`,
				sessionKey: owner.scope?.sessionKey ?? params.sessionKey,
				entry: initialEntry,
				matches: (before, after) => before?.sessionId === after?.sessionId && before?.lifecycleRevision === after?.lifecycleRevision
			}) : void 0;
			try {
				return await admit(initialEntry, () => {
					owner.assertCurrent();
					const current = retained?.readCurrent();
					if (retained && !current) throw createSessionWorkStartChangedError(params.sessionKey);
					return current ? current.entry : initialEntry;
				});
			} finally {
				retained?.release();
			}
		});
	}
	async function admit(initialEntry, readCurrentEntry) {
		const lifecycleAbortController = new AbortController();
		const admission = await beginSessionWorkAdmission({
			agentId: resolveSessionAgentIds({
				config: readRuntimeConfig(),
				sessionKey: params.sessionKey
			}).sessionAgentId,
			scope: params.storePath,
			identities: [params.sessionKey, initialEntry?.sessionId],
			signal: params.signal,
			onInterrupt: () => lifecycleAbortController.abort(/* @__PURE__ */ new Error("Agent work interrupted by a session lifecycle change.")),
			assertAllowed: () => {
				const currentEntry = readCurrentEntry();
				if (memory) {
					if (initialEntry ? !currentEntry || currentEntry.sessionId !== initialEntry.sessionId : Boolean(currentEntry)) throw createSessionWorkStartChangedError(params.sessionKey);
				}
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
}
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
			const cfg = readRuntimeConfig();
			const effectiveRuntime = params.agentRuntime ? concretizeAgentRuntime(params.agentRuntime) : params.provider && params.model ? resolveEffectiveAgentRuntime({
				cfg,
				provider: params.provider,
				modelId: params.model
			}) : void 0;
			const catalog = params.catalog ?? buildConfiguredModelCatalog({ cfg: readRuntimeConfig() });
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
		resolveCliBackendDispatchEligibilityAsync: resolveEmbeddedCliBackendDispatchEligibilityAsync,
		ensureAgentWorkspace: ensurePluginAgentWorkspace
	};
	defineCachedValue(agentRuntime, "runCommandFromIngress", () => createLazyRuntimeMethod(loadAgentCommandRuntime, ({ command, identity }) => async (opts, runtime) => await command.agentCommandFromGatewayIngress({
		...identity.sanitizePublicAgentCommandIngressOpts(opts),
		senderIsOwner: opts.senderIsOwner === true
	}, runtime, void 0, {})));
	defineCachedValue(agentRuntime, "runEmbeddedAgent", () => createLazyRuntimeMethod(loadEmbeddedAgentRuntime, (runtime) => runtime.runPluginEmbeddedAgent));
	defineCachedValue(agentRuntime, "session", () => ({
		resolveStorePath: resolveSessionStorePathCore,
		createSessionEntry: createRuntimeSessionEntry,
		getSessionEntry,
		getSessionEntryAsync,
		getSessionEntryByIdAsync,
		listSessionEntries,
		listSessionEntriesAsync,
		createSessionEntryListReader: async (params) => (await import("./session-entry-read-runtime-BS7SNC06.mjs")).createSessionEntryListReader(params),
		patchSessionEntry,
		prepareSessionEntryPatch,
		upsertSessionEntry,
		runWithWorkAdmission: runWithSessionWorkAdmission,
		updateSessionStoreEntry
	}));
	return agentRuntime;
}
//#endregion
//#region src/plugins/runtime/runtime-media.ts
const loadWebMedia = createLazyRuntimeMethod(() => import("./web-media-BrTgTUzO.mjs"), (runtime) => runtime.loadWebMedia);
const getImageMetadata = createLazyRuntimeMethod(() => import("./image-ops-CQZ9MFvu.mjs"), (runtime) => runtime.getImageMetadata);
const resizeToJpeg = createLazyRuntimeMethod(() => import("./image-ops-CQZ9MFvu.mjs"), (runtime) => runtime.resizeToJpeg);
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
const loadTtsRequestRuntime = createLazyRuntimeModule(() => import("./runtime-api-ppEokC7Q.mjs"));
const loadMediaUnderstandingRuntime = createLazyRuntimeModule(() => import("./runtime-DhyhsA0K.mjs"));
const loadGatewayPluginRuntime = createLazyRuntimeModule(() => import("./server-plugins-DgWeIdHu.mjs"));
function createRuntimeGateway() {
	return {
		isAvailable: async () => (await loadGatewayPluginRuntime()).hasInProcessGatewayContext(),
		request: async (method, params, options) => {
			return (await loadGatewayPluginRuntime()).dispatchTrustedPluginGatewayMethod(method, params, options);
		},
		openPluginPanel: async (params) => (await loadGatewayPluginRuntime()).openPluginPanelForRequester(params),
		readSessionFacts: async (params) => (await loadGatewayPluginRuntime()).readTrustedPluginSessionFacts(params),
		withSessionFacts: async (select, run) => (await loadGatewayPluginRuntime()).withTrustedPluginSessionFacts(select, run),
		subscribeSessionChanges: subscribeRuntimeSessionChanges,
		withUserProfileIdentity: async (params, run) => {
			const captured = {
				profileId: params.profileId,
				emails: params.emails.slice(),
				githubAccountIds: params.githubAccountIds === void 0 ? void 0 : params.githubAccountIds.slice()
			};
			return (await loadGatewayPluginRuntime()).withTrustedPluginUserProfileIdentity(captured, run);
		},
		resolveGitHubAccount: async ({ login, signal }) => (await loadGatewayPluginRuntime()).resolveTrustedPluginGitHubAccount({
			login,
			signal
		})
	};
}
function createRuntimeTts() {
	const bindTtsRuntime = createLazyRuntimeMethodBinder(loadTtsRuntime);
	const bindTtsRequestRuntime = createLazyRuntimeMethodBinder(loadTtsRequestRuntime);
	return {
		buildSystemPromptHintAsync: bindTtsRuntime((runtime) => runtime.buildTtsSystemPromptHintAsync),
		prepareTtsRequest: bindTtsRequestRuntime((runtime) => runtime.prepareTtsRequest),
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
function createRuntimeLlmFacade(getConfig) {
	const loadAcquireLocalService = createLazyRuntimeMethod(() => import("./provider-local-service-CdHxnZ0z.mjs"), (runtime) => runtime.createConfiguredProviderLocalServiceAcquirer(getConfig));
	const loadLlm = createLazyRuntimeSurface(() => import("./runtime-llm.runtime.js"), (m) => m.createRuntimeLlm({
		getConfig,
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
		forkSession: unavailable,
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
	const loadService = () => import("./service-Beg24eAW.mjs");
	return {
		async resolveCheckoutRoot(params) {
			const { findGitCheckoutRoot } = await import("./git-znE079xN.mjs");
			return findGitCheckoutRoot(params.path) ?? void 0;
		},
		async hasSelfContainedCheckoutMetadata(params) {
			const { hasSelfContainedGitMetadata } = await import("./git-znE079xN.mjs");
			return await hasSelfContainedGitMetadata(params.path);
		},
		async create(params) {
			return runWithLocalStateOwner({
				method: "worktrees.create",
				params: {},
				target: params.repoRoot,
				onForeignOwner: "refuse",
				runLocal: async ({ env, config, signal, assertCurrent }) => {
					const { ManagedWorktreeService } = await loadService();
					const commitGuard = () => {
						assertCurrent();
						params.commitGuard?.();
					};
					commitGuard();
					const service = new ManagedWorktreeService({
						env,
						getConfig: () => config
					});
					const record = await service.create({
						...params,
						signal,
						commitGuard
					});
					commitGuard();
					await service.acquire(record.id, {
						signal,
						commitGuard
					});
					return {
						id: record.id,
						path: record.path,
						branch: record.branch
					};
				}
			});
		},
		async release(params) {
			return runWithLocalStateOwner({
				method: "worktrees.release",
				params: {},
				target: params.path,
				onForeignOwner: "refuse",
				runLocal: async ({ env, config, signal, assertCurrent }) => {
					const { ManagedWorktreeService } = await loadService();
					assertCurrent();
					await new ManagedWorktreeService({
						env,
						getConfig: () => config
					}).releaseByPath(params.path, {
						signal,
						commitGuard: assertCurrent
					});
				}
			});
		},
		async removeIfLossless(params) {
			return runWithLocalStateOwner({
				method: "worktrees.removeIfLossless",
				params: {},
				target: params.path,
				onForeignOwner: "refuse",
				runLocal: async ({ env, config, signal, assertCurrent }) => {
					const { ManagedWorktreeService } = await loadService();
					assertCurrent();
					return new ManagedWorktreeService({
						env,
						getConfig: () => config
					}).removeIfLosslessByPath(params.path, {
						ownerKind: params.ownerKind,
						ownerId: params.ownerId
					}, {
						signal,
						commitGuard: assertCurrent
					});
				}
			});
		}
	};
}
function createRuntimeSandbox(agent) {
	const readCurrentEntry = (params, memory) => memory ? memory.read(params.sessionKey, "list") : agent.session.getSessionEntry({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		...params.storePath ? { storePath: params.storePath } : {}
	});
	return {
		resolveWorkspaceAuthority(params) {
			const memory = captureMemoryExactSessionReader(params);
			const sessionEntry = readCurrentEntry(params, memory);
			const preparedRuntimeStatus = resolveSandboxRuntimeStatus({
				cfg: params.config,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				preparedSessionEntry: sessionEntry ?? null
			});
			return resolveSandboxWorkspaceAuthority({
				...params,
				sessionEntry,
				preparedRuntimeStatus
			});
		},
		async prepareWorkspaceAuthority(input) {
			const params = { ...input };
			const memory = captureMemoryExactSessionReader(params);
			const sessionEntry = await agent.session.getSessionEntryAsync({
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				...params.storePath ? { storePath: params.storePath } : {}
			});
			const fields = [
				"sessionId",
				"lifecycleRevision",
				"sandbox",
				"sandboxMode",
				"createdActor",
				"execHost",
				"execNode",
				"model",
				"modelProvider",
				"modelOverride",
				"providerOverride"
			];
			const expected = fields.map((field) => structuredClone(sessionEntry?.[field]));
			const assertCurrent = () => {
				const current = readCurrentEntry(params, memory);
				if (fields.some((field, index) => !isDeepStrictEqual(expected[index], current?.[field]))) throw new Error("Session workspace authority changed during sandbox preparation.");
			};
			assertCurrent();
			const preparedRuntimeStatus = resolveSandboxRuntimeStatus({
				cfg: params.config,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				preparedSessionEntry: sessionEntry ?? null
			});
			const authority = await withPreparedSessionCapabilityRead(() => resolveSandboxWorkspaceAuthority({
				...params,
				sessionEntry,
				preparedRuntimeStatus
			}));
			if (!authority.sandboxed || authority.confinementError) return authority;
			const { resolveSandboxContext } = await import("./context-CAZ3LAgU.mjs");
			assertCurrent();
			const sandbox = await resolveSandboxContext({
				config: params.config,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				workspaceDir: params.workspaceDir,
				requireCurrentConfig: true,
				preparedRuntimeStatus,
				assertCurrent
			});
			try {
				assertCurrent();
				return authority;
			} finally {
				sandbox?.[Symbol.dispose]?.();
			}
		}
	};
}
const createPluginRuntime = (_options = {}, base = createRuntimeBase()) => {
	const agent = createRuntimeAgent();
	let modelAuth = _options.modelAuth;
	let modelConfig = _options.modelConfig;
	const runtime = {
		version: VERSION,
		capabilities: base.capabilities,
		decisions: { evaluate: async (...args) => (await import("./runtime-CiTvavdQ.mjs")).evaluateDecision(...args) },
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
			listProviders: (params) => {
				warnPluginSdkDeprecation({
					family: "web-search-providers",
					method: "runtime.webSearch.listProviders",
					replacement: "runtime.webSearch.listProvidersAsync"
				});
				return listWebSearchProviders(params);
			},
			listProvidersAsync: listWebSearchProvidersAsync,
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
			generate: async (params) => (await import("./runtime-B3pd61LP.mjs")).generateImage(params),
			listProviders: (params) => listImageGenerationProviders(params?.config)
		},
		videoGeneration: {
			generate: async (params) => (await import("./runtime-BbxFCquo.mjs")).generateVideo(params),
			listProviders: (params) => listVideoGenerationProviders(params?.config)
		},
		musicGeneration: {
			generate: async (params) => (await import("./runtime-BX78uqB6.mjs")).generateMusic(params),
			listProviders: (params) => listMusicGenerationProviders(params?.config)
		},
		llm: createRuntimeLlmFacade(base.getConfig)
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
