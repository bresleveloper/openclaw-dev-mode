import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as getSessionActorStorageBinding, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { S as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { s as prepareSessionEntryMutationDatabases } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { n as captureSessionMutationRouting, t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { t as prepareSessionWorktree } from "./session-worktree-preparation-M6dhYMsR.mjs";
import { i as loadWorkerPlacementSessionRuntimeModule, o as resolveWorkerPlacementSessionTarget } from "./server-worker-placement-session-target-CLJyKcFG.mjs";
//#region src/gateway/session-lifecycle-preparation.ts
/** Retain the canonical targets across asynchronous authority preparation and mutation. */
function prepareGatewaySessionLifecycleTargets(params) {
	const cfg = params.cfg;
	const creationSelection = params.creation?.selectTargetInLifecycle ? createDeferredCore() : void 0;
	let preparedDatabase;
	const scopes = params.targets.map(({ target }) => ({
		agentId: target.agentId,
		sessionKey: target.canonicalKey,
		storePath: target.storePath
	}));
	const assertRoutingCurrent = captureSessionMutationRouting(cfg, void 0, scopes);
	const creationScope = scopes[0];
	if (params.creation && !creationScope) throw new Error("Session creation preparation requires its original target");
	const databaseCustody = params.creation && creationScope ? prepareSessionEntryMutationDatabases([{
		scope: creationScope,
		assertCurrent: params.creation.assertCurrent,
		relatedScopes: scopes.slice(1),
		followRegistration: params.creation.followRegistration
	}], params.creation.ready) : void 0;
	const databasePreparation = databaseCustody?.preparations[0].then((prepared) => {
		preparedDatabase = prepared;
	});
	const preparations = params.targets.map(async ({ target, entry, storageReady }, index) => {
		const memory = isIncognitoSessionKey(target.canonicalKey) ? getSessionActorStorageBinding({}) : void 0;
		if (memory) {
			const assertCurrent = () => memory.authority.assertCurrent();
			const selected = expectDefined(await acquireSessionActorStorage({
				...target,
				sessionKey: target.canonicalKey
			}, {
				authority: memory.authority,
				lifetime: {
					assertCurrent,
					assertReadable: assertCurrent
				}
			}), "memory lifecycle target");
			return {
				matchesCurrent() {
					selected.actor.assertCurrent();
					return true;
				},
				bindCreation() {},
				release: () => selected.actor.release()
			};
		}
		let preparedStorage;
		const targetStorageReady = storageReady?.then((prepared) => {
			preparedStorage = prepared;
		});
		const selected = { ...target };
		const originalIdentity = {
			sessionId: entry?.sessionId,
			lifecycleRevision: entry?.lifecycleRevision
		};
		const selectOnEntry = index === 0 ? creationSelection : void 0;
		if (selectOnEntry) {
			await selectOnEntry.promise;
			preparedDatabase?.assertCurrent();
		}
		const facts = await prepareSessionMutationFacts({
			cfg,
			sessionKey: selected.canonicalKey,
			agentId: selected.agentId,
			allowMissing: true,
			storageReady: targetStorageReady ?? databasePreparation
		});
		let sessionId = originalIdentity.sessionId;
		let lifecycleRevision = originalIdentity.lifecycleRevision;
		if (selectOnEntry) try {
			preparedDatabase?.assertCurrent();
			const selectedEntry = facts.readCurrent(cfg).target?.entry;
			sessionId = selectedEntry?.sessionId;
			lifecycleRevision = selectedEntry?.lifecycleRevision;
		} catch (error) {
			facts.release();
			throw error;
		}
		return {
			matchesCurrent(currentConfig) {
				preparedStorage?.assertCurrent();
				const current = facts.readCurrent(currentConfig).target;
				return facts.storageTarget.agentId === selected.agentId && facts.storageTarget.storePath === selected.storePath && facts.storageTarget.canonicalKey === selected.canonicalKey && current?.entry.sessionId === sessionId && current?.entry.lifecycleRevision === lifecycleRevision && (!current || current.agentId === selected.agentId && current.storePath === selected.storePath && current.canonicalKey === selected.canonicalKey);
			},
			bindCreation: facts.bindCreation,
			release: facts.release
		};
	});
	for (const preparation of preparations) preparation.catch(() => {});
	const assertCurrent = () => {
		assertRoutingCurrent(params.getCurrentConfig?.() ?? cfg);
		preparedDatabase?.assertCurrent();
	};
	return {
		preparations,
		assertCurrent,
		async prepareCreationTargets(isCommitted) {
			let child;
			if (creationSelection) await databasePreparation;
			else child = await expectDefined(preparations[0], "creation target preparation");
			const parents = await Promise.all(preparations.slice(1));
			const assertTargetsCurrent = () => {
				assertCurrent();
				const currentConfig = params.getCurrentConfig?.() ?? cfg;
				if (!isCommitted() && child && !child.matchesCurrent(currentConfig)) throw new Error("Session changed before creation; retry.");
				for (const parent of parents) if (!parent.matchesCurrent(currentConfig)) throw new Error("Session changed before creation; retry.");
			};
			const bindCreation = (operation) => {
				expectDefined(child, "selected creation target").bindCreation(operation);
			};
			return {
				assertCurrent: assertTargetsCurrent,
				bindCreation,
				async enterCreationLifecycle() {
					params.creation?.assertCurrent();
					assertTargetsCurrent();
					if (creationSelection) {
						if (!preparedDatabase) throw new Error("Session creation database preparation has not completed");
						preparedDatabase.assertCurrent();
						creationSelection.resolve();
						child = await expectDefined(preparations[0], "creation target preparation");
					}
					assertTargetsCurrent();
				}
			};
		},
		async [Symbol.asyncDispose]() {
			creationSelection?.reject(/* @__PURE__ */ new Error("Session creation ended before target selection"));
			for (const result of await Promise.allSettled(preparations)) if (result.status === "fulfilled") await result.value.release();
			await databasePreparation?.catch(() => {});
			await databaseCustody?.[Symbol.asyncDispose]();
		}
	};
}
function resolveSessionCreateIncognitoIntentError(params) {
	if (params.incognito && params.requestingOperatorScopes !== void 0 && !params.requestingOperatorScopes.includes("operator.admin")) return errorShape(ErrorCodes.INVALID_REQUEST, `incognito sessions require gateway scope: ${ADMIN_SCOPE}`);
	if (params.incognito && params.parentSessionKey && !params.parentIncognito) return errorShape(ErrorCodes.INVALID_REQUEST, "incognito sessions cannot have durable parents");
	if (params.parentIncognito && params.targetKey) return errorShape(ErrorCodes.INVALID_REQUEST, "incognito sessions are web-only");
}
function resolveSessionCreateLifecycleIntentError(params, parentSessionKey) {
	if (params.succeedsParent !== void 0) {
		if (!parentSessionKey) return errorShape(ErrorCodes.INVALID_REQUEST, "succeedsParent requires parentSessionKey");
		if (params.emitCommandHooks !== true) return errorShape(ErrorCodes.INVALID_REQUEST, "succeedsParent requires emitCommandHooks");
		if (params.succeedsParent && params.fork === true) return errorShape(ErrorCodes.INVALID_REQUEST, "succeedsParent conflicts with fork: a fork runs in parallel to its parent");
	}
	if (params.atomicInitialization === true && (!params.afterCreate || params.initialEntry)) return errorShape(ErrorCodes.INVALID_REQUEST, "atomic initialization requires afterCreate and cannot use trusted initial state");
}
function resolveSessionCreateChildIntentError(params, parentSessionKey) {
	if (params.fork === true && !parentSessionKey) return errorShape(ErrorCodes.INVALID_REQUEST, "fork requires parentSessionKey");
	if (params.forkFrom && params.fork !== true) return errorShape(ErrorCodes.INVALID_REQUEST, "forkFrom requires fork=true");
	if (params.spawnDepth !== void 0) {
		if (!Number.isInteger(params.spawnDepth) || params.spawnDepth < 1) return errorShape(ErrorCodes.INVALID_REQUEST, "spawnDepth must be an integer >= 1");
		if (!parentSessionKey) return errorShape(ErrorCodes.INVALID_REQUEST, "spawnDepth requires parentSessionKey");
	}
	if (params.spawnToolPolicy && params.spawnDepth === void 0) return errorShape(ErrorCodes.INVALID_REQUEST, "spawn tool policy requires spawnDepth");
}
/** Bind prepared workspace facts and consume setup intent only after successful preparation. */
function projectPreparedSessionWorkspace(existingEntry, params) {
	const { projectId, pendingProjectGitUrl, pendingWorktree, spawnedCwd, preparedLifecycle } = params;
	const createdNewEntry = existingEntry === void 0;
	const recovered = preparedLifecycle?.worktree && (existingEntry?.pendingWorktree || existingEntry?.pendingProjectGitUrl);
	return {
		...createdNewEntry && projectId ? { projectId } : {},
		...createdNewEntry && pendingProjectGitUrl ? { pendingProjectGitUrl } : {},
		...createdNewEntry && pendingWorktree ? { pendingWorktree } : {},
		...spawnedCwd ? { spawnedCwd } : {},
		...preparedLifecycle?.worktree ? { worktree: preparedLifecycle.worktree } : {},
		...preparedLifecycle?.repositoryWorkspaceId ? { repositoryWorkspaceId: preparedLifecycle.repositoryWorkspaceId } : {},
		...recovered ? {
			projectId,
			pendingWorktree: void 0,
			pendingProjectGitUrl: void 0
		} : {}
	};
}
/** Join recorded commit actions even when the enclosing source scope fails during cleanup. */
async function settleGatewaySessionLifecycleCommit(commit, afterCommit) {
	const result = await commit.then((value) => ({
		ok: true,
		value
	}), (error) => ({
		ok: false,
		error
	}));
	const failures = result.ok ? [] : [result.error];
	for (const action of afterCommit) try {
		await action();
	} catch (error) {
		failures.push(error);
	}
	if (failures.length > 1) throw new AggregateError(failures, "Session reset commit and post-commit actions failed", { cause: failures.at(-1) });
	if (!result.ok) throw result.error;
	if (failures.length === 1) throw failures[0];
	return result.value;
}
async function rollbackGatewaySessionPreparation(params) {
	try {
		await params.prepared?.rollback?.();
	} catch (error) {
		params.onError?.(error);
	}
}
/** Publish accepted workspace ownership before releasing preparation; roll back only unbound work. */
async function commitPreparedSessionWorkspace(params) {
	const { prepared } = params;
	const bind = async (assertSourceCurrent) => {
		const assertCurrent = composeSessionSourceAssertion([params.assertCurrent, assertSourceCurrent]);
		return await patchSessionEntryCore(params.target, (entry) => {
			assertCurrent();
			params.assertEntry(entry);
			return {
				...params.projectId ? { projectId: params.projectId } : {},
				sessionRoot: prepared.sessionRoot,
				spawnedCwd: prepared.spawnedCwd,
				...prepared.worktree ? { worktree: prepared.worktree } : {},
				...params.clearPendingIntent ? {
					pendingProjectGitUrl: void 0,
					pendingWorktree: void 0
				} : {}
			};
		}, {
			...sessionEntryCommitGuardOptions(assertCurrent),
			requireWriteSuccess: true,
			skipMaintenance: true,
			onCommitted: params.onCommitted
		});
	};
	try {
		const entry = prepared.withCommit ? await prepared.withCommit(bind) : await bind(() => {});
		if (!entry) throw new Error(params.missingSessionMessage);
		return entry;
	} catch (error) {
		await prepared.rollback?.();
		throw error;
	}
}
/** Adopt only a session-owned workspace; never replace an accepted external source. */
async function ensureSessionWorkspaceForPlacement(params) {
	const { target, entry } = params;
	await runExclusiveSessionLifecycleMutation("placement-dispatch", {
		scope: target.storePath,
		identities: [
			target.canonicalKey,
			entry.sessionId,
			...target.storeKeys
		],
		signal: params.signal,
		run: async () => {
			params.assertCurrent();
			if (!params.canPrepare()) return;
			if (entry.worktree || entry.repositoryWorkspaceId) {
				(await resolveWorkerPlacementSessionTarget({
					sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
					config: params.cfg,
					sessionId: entry.sessionId,
					sessionKey: target.canonicalKey,
					agentId: target.agentId,
					readTarget: () => {
						params.assertCurrent();
						return {
							...target,
							store: { [target.canonicalKey]: entry }
						};
					},
					errorMessage: "The session workspace owner is unavailable; repair it before retrying."
				}))[Symbol.dispose]();
				params.assertCurrent();
				return;
			}
			if (entry.pendingWorktree || entry.pendingProjectGitUrl) throw new Error("The session workspace must finish preparation before worker setup.");
			if (entry.spawnedCwd || entry.projectId || entry.sessionRoot) throw new Error("Worker execution needs a session-owned workspace; create a managed-workspace session rather than dropping the current workspace.");
			const prepared = await prepareSessionWorktree({
				cfg: params.cfg,
				target: {
					...target,
					key: target.canonicalKey,
					entry
				},
				workspace: { kind: "empty" },
				runSetupScript: false,
				signal: params.signal,
				commitGuard: params.assertCurrent
			});
			if (!prepared.ok) throw new Error(prepared.error.message);
			const bound = await commitPreparedSessionWorkspace({
				prepared: prepared.value,
				onCommitted: params.onCommitted,
				target: {
					...target,
					sessionKey: target.canonicalKey
				},
				assertCurrent: params.assertCurrent,
				assertEntry: (saved) => {
					if (saved.sessionId !== entry.sessionId || saved.worktree || saved.repositoryWorkspaceId || saved.sessionRoot || saved.spawnedCwd || saved.pendingWorktree || saved.pendingProjectGitUrl) throw new Error("Session workspace changed during worker setup.");
				},
				missingSessionMessage: "Session disappeared during worker setup."
			});
			Object.assign(entry, bound);
		}
	});
}
//#endregion
export { resolveSessionCreateChildIntentError as a, rollbackGatewaySessionPreparation as c, projectPreparedSessionWorkspace as i, settleGatewaySessionLifecycleCommit as l, ensureSessionWorkspaceForPlacement as n, resolveSessionCreateIncognitoIntentError as o, prepareGatewaySessionLifecycleTargets as r, resolveSessionCreateLifecycleIntentError as s, commitPreparedSessionWorkspace as t };
