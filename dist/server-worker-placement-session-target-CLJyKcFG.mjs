import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { D as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { S as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { y as withSessionTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { i as captureWorktreeRunEndContext } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { t as captureWorktreeRegistryReadGuard } from "./registry-read-Do2Ks9un.mjs";
import "./device-folder-Bc207Mdx.mjs";
import { n as prepareWorkerTurnTranscriptSource } from "./worker-turn-transcript-target-D5zatewR.mjs";
import { t as createWorkerWorkspaceConflictTranscriptHandlers } from "./worker-workspace-conflict-transcript-Yr6WwI3j.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-worker-placement-session-target.ts
var WorkerDispatchTargetChangedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "invalid_state";
	}
};
async function resolveWorkerPlacementSessionStoreTarget(runtime, cfg, identity, onSelected) {
	const memory = captureSessionActorStorageOwner(identity, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) {
		const entry = readCapturedSessionActorEntry(memory, identity.sessionKey);
		return {
			agentId: memory.agentId,
			storePath: memory.path,
			canonicalKey: identity.sessionKey,
			storeKeys: [identity.sessionKey],
			store: entry ? { [identity.sessionKey]: entry } : {}
		};
	}
	return runtime.resolveGatewaySessionStoreTargetInWorker({
		cfg,
		key: identity.sessionKey,
		agentId: identity.agentId,
		projection: "full",
		preserveQualifiedAddress: true,
		onSelected
	});
}
function createWorkerWorkspaceRecoveryPreparer(options) {
	return async (identity, assertOwnerCurrent, run) => {
		try {
			var _usingCtx$1 = _usingCtx();
			assertOwnerCurrent();
			const sessionRuntime = await options.loadSessionRuntime();
			assertOwnerCurrent();
			const resolved = _usingCtx$1.u(await resolveWorkerPlacementSessionTarget({
				sessionRuntime,
				config: options.getConfig(),
				...identity,
				errorMessage: `Session ${identity.sessionKey} changed before workspace recovery`
			}));
			assertOwnerCurrent();
			resolved.assertCurrent(options.getConfig());
			const { target, entry, workspace } = resolved;
			const memory = captureSessionActorStorageOwner({
				...identity,
				storePath: target.storePath
			}, {
				assertCurrent: assertOwnerCurrent,
				authorize: assertOwnerCurrent
			});
			if (memory) {
				const transcriptTarget = {
					...captureSessionTranscriptTargetBinding({
						...identity,
						storePath: memory.path
					}),
					expectedLifecycleRevision: entry.lifecycleRevision,
					expectedWriterRunId: entry.activeWriterRunId
				};
				const assertCurrent = () => {
					assertOwnerCurrent();
					resolved.assertCurrent(options.getConfig());
					if (readCapturedSessionActorEntry(memory, identity.sessionKey)?.activeWriterRunId !== entry.activeWriterRunId) throw new WorkerDispatchTargetChangedError("Workspace recovery writer changed");
				};
				return await withSessionTranscriptWriteAssertion(transcriptTarget, assertCurrent, () => run({
					workspace,
					assertCurrent,
					...createWorkerWorkspaceConflictTranscriptHandlers(transcriptTarget, assertCurrent)
				}));
			}
			if (target.agentId !== identity.agentId || target.canonicalKey !== identity.sessionKey || !target.readSource) throw new WorkerDispatchTargetChangedError("Workspace recovery lost its exact session target");
			const transcriptTarget = {
				...captureSessionTranscriptTargetBinding({
					...identity,
					storePath: target.readSource.path
				}),
				defaultAgentId: target.readSource.agentId,
				expectedLifecycleRevision: entry.lifecycleRevision,
				expectedWriterRunId: entry.activeWriterRunId
			};
			const source = _usingCtx$1.a(await prepareWorkerTurnTranscriptSource({
				...identity,
				storePath: target.readSource.path,
				expectedLifecycleRevision: entry.lifecycleRevision,
				expectedWriterRunId: entry.activeWriterRunId
			}, {
				fields: [
					"sessionId",
					"lifecycleRevision",
					"activeWriterRunId"
				],
				expected: entry,
				refuse: () => {
					throw new WorkerDispatchTargetChangedError("Workspace recovery session owner changed");
				}
			}));
			const assertCurrent = composeSessionSourceAssertion([source], (assertSources) => {
				assertOwnerCurrent();
				assertSources();
			});
			assertCurrent();
			return await withSessionTranscriptWriteAssertion(transcriptTarget, assertCurrent, () => run({
				workspace,
				assertCurrent,
				...createWorkerWorkspaceConflictTranscriptHandlers(transcriptTarget, assertCurrent)
			}));
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	};
}
const runtimeEntryFields = [
	"sessionId",
	"lifecycleRevision",
	"providerOverride",
	"modelOverride",
	"modelOverrideSource",
	"modelOverrideRouteResolution",
	"modelOverrideFallbackOriginProvider",
	"modelOverrideFallbackOriginModel",
	"parentSessionKey",
	"previousSessionId",
	"agentHarnessId",
	"modelSelectionLocked",
	"pluginOwnerId",
	"agentRuntimeOverride",
	"authProfileOverride"
];
async function runWorkerPlacementSessionBarrier(params) {
	const target = await resolveWorkerPlacementSessionStoreTarget(params.sessionRuntime, params.getConfig(), params);
	const operation = params.action === "activation" ? "placement-activate" : "placement-recover";
	return await runExclusiveSessionLifecycleMutation(operation, {
		scope: target.storePath,
		identities: [
			params.sessionKey,
			target.canonicalKey,
			...target.storeKeys,
			params.sessionId
		],
		signal: params.signal,
		run: async () => {
			try {
				var _usingCtx3 = _usingCtx();
				const { target: currentTarget, entry, workspace, assertCurrent } = _usingCtx3.u(await resolveWorkerPlacementSessionTarget({
					sessionRuntime: params.sessionRuntime,
					config: params.getConfig(),
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					agentId: params.agentId,
					expectedTarget: target,
					entryMatches: (before, after) => before && after ? runtimeEntryFields.every((field) => isDeepStrictEqual(before[field], after[field])) : before === after,
					errorMessage: `Session ${params.sessionKey} changed before cloud worker ${params.action}. Retry.`
				}));
				params.signal?.throwIfAborted();
				assertCurrent(params.getConfig());
				if (entry.archivedAt !== void 0) throw new WorkerDispatchTargetChangedError(`Session ${params.sessionKey} was archived before cloud worker ${params.action}. Retry.`);
				const readRuntime = await params.sessionRuntime.prepareWorkerPlacementSessionRuntime({
					cfg: params.getConfig(),
					entry,
					agentId: currentTarget.agentId,
					sessionKey: currentTarget.canonicalKey,
					initialTarget: currentTarget
				});
				const assertPlacementCurrent = () => {
					params.signal?.throwIfAborted();
					const config = params.getConfig();
					assertCurrent(config);
					const currentRuntime = readRuntime(config, entry);
					if (params.sessionRuntime.resolveWorkerPlacementExecutionMode(currentRuntime) !== params.executionMode) throw new WorkerDispatchTargetChangedError(`Session ${params.sessionKey} runtime changed to ${currentRuntime} before cloud worker ${params.action}. Retry.`);
				};
				assertPlacementCurrent();
				return await params.run(workspace, assertPlacementCurrent);
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				_usingCtx3.d();
			}
		}
	});
}
/** Keep canonical session identity and its durable workspace owner in one lifecycle fence. */
async function resolveWorkerPlacementSessionTarget(params) {
	const memory = captureSessionActorStorageOwner(params, {
		assertCurrent() {},
		authorize() {}
	});
	const worktreeContext = captureWorktreeRunEndContext(process.env);
	const targetChangedError = () => params.expectedTarget ? new WorkerDispatchTargetChangedError(params.errorMessage) : new Error(params.errorMessage);
	const assertRoutingCurrent = captureSessionMutationRouting(params.config, targetChangedError, [{
		...params,
		preserveQualifiedAddress: true
	}]);
	let active = true;
	let retained;
	let unregister = () => {};
	const release = () => {
		if (!active) return;
		active = false;
		retained?.release();
		unregister();
	};
	const retainTarget = (target) => {
		const selected = findCanonicalStoreMatch(target.store, target.storeKeys);
		if (!selected || !target.capturedReadSource) return;
		const source = target.capturedReadSource;
		if (typeof source.databaseIdentity !== "string") throw targetChangedError();
		retained = retainPreparedSessionEntryPredicate({
			databaseIdentity: `file:${source.databaseIdentity}`,
			sessionKey: selected.key,
			entry: selected.entry,
			matches: (before, after) => before?.sessionId === after?.sessionId && before?.lifecycleRevision === after?.lifecycleRevision && before?.archivedAt === after?.archivedAt && before?.worktree?.id === after?.worktree?.id && before?.repositoryWorkspaceId === after?.repositoryWorkspaceId && before?.deviceFolder?.deviceId === after?.deviceFolder?.deviceId && before?.deviceFolder?.path === after?.deviceFolder?.path && (params.entryMatches?.(before, after) ?? true)
		});
		unregister = registerOpenClawAgentDatabaseAsyncResource({
			agentId: source.agentId,
			path: source.path,
			revoke: release,
			close: async () => release()
		});
	};
	try {
		const resolveTarget = (cfg) => params.readTarget?.(cfg) ?? resolveWorkerPlacementSessionStoreTarget(params.sessionRuntime, cfg, params, retainTarget);
		const initialTarget = await resolveTarget(params.config);
		const initialEntry = memory ? readCapturedSessionActorEntry(memory, params.sessionKey) : params.sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(initialTarget.store, initialTarget.storeKeys);
		const expected = params.expectedTarget ?? initialTarget;
		if (initialTarget.storePath !== expected.storePath || initialTarget.canonicalKey !== expected.canonicalKey || initialTarget.agentId !== expected.agentId || !initialEntry || initialEntry.sessionId !== params.sessionId || params.expectedEntry !== void 0 && (initialEntry.lifecycleRevision !== params.expectedEntry.lifecycleRevision || initialEntry.worktree?.id !== params.expectedEntry.worktree?.id || initialEntry.repositoryWorkspaceId !== params.expectedEntry.repositoryWorkspaceId || initialEntry.deviceFolder?.deviceId !== params.expectedEntry.deviceFolder?.deviceId || initialEntry.deviceFolder?.path !== params.expectedEntry.deviceFolder?.path)) throw targetChangedError();
		if (!memory && !params.readTarget && !retained) throw targetChangedError();
		const initialIdentity = {
			lifecycleRevision: initialEntry.lifecycleRevision,
			archivedAt: initialEntry.archivedAt,
			worktreeId: initialEntry.worktree?.id,
			repositoryWorkspaceId: initialEntry.repositoryWorkspaceId,
			deviceFolder: initialEntry.deviceFolder
		};
		const acceptWorktree = captureWorktreeRegistryReadGuard(worktreeContext, "source-owner");
		const worktree = initialIdentity.repositoryWorkspaceId || initialIdentity.deviceFolder ? void 0 : await params.sessionRuntime.managedWorktrees.findLiveByOwner("session", initialTarget.canonicalKey);
		const assertWorktreeCurrent = acceptWorktree(worktree ? {
			...worktree,
			ownerKind: "session"
		} : void 0);
		const prepared = initialIdentity.repositoryWorkspaceId ? await getSessionRepositoryWorkspaceStore().prepare(initialIdentity.repositoryWorkspaceId) : void 0;
		const resolveBinding = (config = params.config) => {
			assertRoutingCurrent(config);
			if (!active || retained?.isCurrent() === false) throw targetChangedError();
			const target = memory ? initialTarget : params.readTarget?.(config) ?? initialTarget;
			const entry = memory ? readCapturedSessionActorEntry(memory, params.sessionKey) : params.sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
			if (target.storePath !== expected.storePath || target.canonicalKey !== expected.canonicalKey || target.agentId !== expected.agentId || !entry || entry.sessionId !== params.sessionId || entry.lifecycleRevision !== initialIdentity.lifecycleRevision || entry.archivedAt !== initialIdentity.archivedAt || entry.worktree?.id !== initialIdentity.worktreeId || entry.repositoryWorkspaceId !== initialIdentity.repositoryWorkspaceId || entry.deviceFolder?.deviceId !== initialIdentity.deviceFolder?.deviceId || entry.deviceFolder?.path !== initialIdentity.deviceFolder?.path) throw targetChangedError();
			if (entry.deviceFolder) {
				if (entry.worktree || entry.repositoryWorkspaceId) throw targetChangedError();
				return {
					config,
					target,
					entry,
					worktree: void 0,
					workspace: {
						kind: "device-folder",
						...entry.deviceFolder
					}
				};
			}
			if (entry.repositoryWorkspaceId) {
				prepared?.assertSourceCurrent();
				const repository = prepared?.workspace;
				if (!repository || repository.workspaceId !== entry.repositoryWorkspaceId || repository.agentId !== target.agentId || repository.sessionKey !== target.canonicalKey || entry.worktree) throw targetChangedError();
				return {
					config,
					target,
					entry,
					worktree: void 0,
					workspace: {
						kind: "repository",
						repository
					}
				};
			}
			assertWorktreeCurrent();
			if (!entry.worktree?.id || !worktree || worktree.id !== entry.worktree.id || worktree.ownerId !== target.canonicalKey) throw targetChangedError();
			return {
				config,
				target,
				entry,
				worktree,
				workspace: {
					kind: "local",
					path: worktree.path
				}
			};
		};
		const resolveCurrent = (config = params.config) => {
			const selected = resolveBinding(config);
			if (selected.workspace.kind === "repository" && prepared?.current()?.revision !== selected.workspace.repository.revision) throw targetChangedError();
			return selected;
		};
		return {
			...resolveCurrent(),
			assertBindingCurrent: (config) => {
				resolveBinding(config);
			},
			assertCurrent: (config) => {
				resolveCurrent(config);
			},
			[Symbol.dispose]: release
		};
	} catch (error) {
		release();
		throw error;
	}
}
const loadWorkerPlacementSessionRuntimeModule = createLazyRuntimeModule(async () => {
	const [placementSessionRuntime, runtimePreparation, { managedWorktrees }, sessionUtils] = await Promise.all([
		import("./placement-session-runtime-DoujPSA-.mjs"),
		import("./placement-session-runtime-preparation-BqKxW4Sr.mjs"),
		import("./service-Beg24eAW.mjs"),
		import("./session-utils-GW3ykAMf.mjs")
	]);
	return {
		resolveWorkerPlacementExecutionMode: placementSessionRuntime.resolveWorkerPlacementExecutionMode,
		resolveWorkerPlacementCapabilities: placementSessionRuntime.resolveWorkerPlacementCapabilities,
		managedWorktrees,
		prepareWorkerPlacementSessionRuntime: runtimePreparation.prepareWorkerPlacementSessionRuntime,
		resolveWorkerPlacementSessionRuntimeAsync: placementSessionRuntime.resolveWorkerPlacementSessionRuntimeAsync,
		resolveCanonicalSessionEntryFromStoreKeys: sessionUtils.resolveCanonicalSessionEntryFromStoreKeys,
		resolveGatewaySessionStoreTargetInWorker: sessionUtils.resolveGatewaySessionStoreTargetInWorker
	};
});
function createWorkerPlacementNodeWorkspaceBindingResolver(options) {
	const readPlacement = async (binding) => {
		const placement = await options.placements.getAsync(binding.sessionId);
		return placement && (placement.state === "active" || placement.state === "draining" || placement.state === "reconciling") && placement.environmentId === binding.environmentId && placement.activeOwnerEpoch === binding.ownerEpoch ? placement : void 0;
	};
	const resolve = async (binding) => {
		const placement = await readPlacement(binding);
		if (!placement) return;
		const workspace = await options.resolveWorkspace({
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId
		});
		const current = options.placements.get(binding.sessionId);
		if (current?.state !== placement.state || current.generation !== placement.generation || current.environmentId !== binding.environmentId || current.activeOwnerEpoch !== binding.ownerEpoch || current.sessionKey !== placement.sessionKey || current.agentId !== placement.agentId || current.remoteWorkspaceDir !== placement.remoteWorkspaceDir || current.workspaceBaseManifestRef !== placement.workspaceBaseManifestRef) return;
		if (workspace.kind === "repository" && (!workspace.repository.baseCommit || !workspace.repository.baseManifestHash)) throw new Error("Attached repository workspace has no pinned baseline");
		if (workspace.kind === "device-folder" !== (placement.workspaceBaseManifestRef === "device-folder:no-manifest")) throw new Error("Placement workspace kind does not match the durable session folder binding");
		return {
			source: workspace.kind === "device-folder" ? {
				kind: "device-folder",
				deviceId: workspace.deviceId,
				path: workspace.path
			} : workspace.kind === "local" ? {
				kind: "local",
				path: workspace.path
			} : {
				kind: "repository",
				baseCommit: workspace.repository.baseCommit,
				baseManifestRef: workspace.repository.baseManifestHash
			},
			manifestRef: placement.workspaceBaseManifestRef,
			remoteWorkspaceDir: placement.remoteWorkspaceDir,
			sessionKey: placement.sessionKey
		};
	};
	return Object.assign(resolve, { async durableDeviceFolder(binding) {
		const placement = await readPlacement(binding);
		return placement?.workspaceBaseManifestRef === "device-folder:no-manifest" ? placement.remoteWorkspaceDir : void 0;
	} });
}
//#endregion
export { resolveWorkerPlacementSessionStoreTarget as a, loadWorkerPlacementSessionRuntimeModule as i, createWorkerPlacementNodeWorkspaceBindingResolver as n, resolveWorkerPlacementSessionTarget as o, createWorkerWorkspaceRecoveryPreparer as r, runWorkerPlacementSessionBarrier as s, WorkerDispatchTargetChangedError as t };
