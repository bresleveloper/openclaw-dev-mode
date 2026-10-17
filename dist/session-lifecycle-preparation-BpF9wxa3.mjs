import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { o as prepareSessionEntryMutationDatabases } from "./session-accessor.reset-Bn2-AwEV.mjs";
import { n as captureSessionMutationRouting, r as prepareSessionMutationFacts } from "./session-sharing-preparation-BwpUabTn.mjs";
//#region src/gateway/session-lifecycle-preparation.ts
/** Retain the canonical targets across asynchronous authority preparation and mutation. */
function prepareGatewaySessionLifecycleTargets(params) {
	const cfg = params.cfg;
	const creationSelection = params.creation?.selectTargetInLifecycle ? createDeferredCore() : void 0;
	const assertRoutingCurrent = captureSessionMutationRouting(cfg);
	let preparedDatabase;
	const scopes = params.targets.map(({ target }) => ({
		agentId: target.agentId,
		sessionKey: target.canonicalKey,
		storePath: target.storePath
	}));
	const creationScope = scopes[0];
	if (params.creation && !creationScope) throw new Error("Session creation preparation requires its original target");
	const databaseCustody = params.creation && creationScope ? prepareSessionEntryMutationDatabases([{
		scope: creationScope,
		assertCurrent: params.creation.assertCurrent,
		relatedScopes: scopes.slice(1)
	}], params.creation.ready) : void 0;
	const databasePreparation = databaseCustody?.preparations[0].then((prepared) => {
		preparedDatabase = prepared;
	});
	const preparations = params.targets.map(async ({ target, entry, storageReady }, index) => {
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
			for (const result of await Promise.allSettled(preparations)) if (result.status === "fulfilled") result.value.release();
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
//#endregion
export { resolveSessionCreateLifecycleIntentError as a, resolveSessionCreateIncognitoIntentError as i, projectPreparedSessionWorkspace as n, rollbackGatewaySessionPreparation as o, resolveSessionCreateChildIntentError as r, settleGatewaySessionLifecycleCommit as s, prepareGatewaySessionLifecycleTargets as t };
