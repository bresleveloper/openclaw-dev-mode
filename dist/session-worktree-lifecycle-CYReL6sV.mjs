import { r as getChildLogger } from "./logger-Mnn26Jj7.mjs";
import { r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { g as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { a as loadSessionEntry } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { i as collectActiveSessionWorkAdmissionKeys } from "./store-maintenance-runtime-CXttvsi9.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { i as prepareSessionWorkerPlacementMutationCheck } from "./session-placement-lifecycle-D5GPja58.mjs";
import { t as createWorkerSessionPlacementStore } from "./placement-store-pOpXSErH.mjs";
import { f as runGit } from "./git-DK_u9XbK.mjs";
import { a as managedWorktrees, n as ManagedWorktreeService } from "./service-DvlxnA92.mjs";
import { d as getRegistryWorktree } from "./registry-Bm5FVBwN.mjs";
import { v as classifyWorktreeRemovalError } from "./removal-git-C1z0ZRNp.mjs";
import { existsSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
//#region src/sessions/session-worktree-lifecycle.ts
var SessionWorktreeLifecycleError = class extends Error {
	constructor(message, reason) {
		super(message);
		this.reason = reason;
	}
};
function serviceFor(env) {
	return env ? new ManagedWorktreeService({ env }) : managedWorktrees;
}
function belongsToSession(record, sessionKey) {
	return record.ownerKind === "session" && record.ownerId === sessionKey;
}
/** The session lifecycle fence remains held until this exact bound checkout finishes cleanup. */
async function removeSessionWorktree(params) {
	if (!params.id) return;
	const env = params.env ?? process.env;
	const record = getRegistryWorktree(env, params.id);
	if (!record || record.removedAt !== void 0) return;
	const assertCurrent = () => {
		params.commitGuard?.();
		const current = getRegistryWorktree(env, record.id);
		if (current && !belongsToSession(current, params.sessionKey)) throw new SessionWorktreeLifecycleError("Session worktree ownership changed; retry cleanup.", "owner-mismatch");
	};
	try {
		assertCurrent();
		await serviceFor(params.env).remove({
			id: record.id,
			reason: params.reason,
			commitGuard: assertCurrent
		});
	} catch (error) {
		params.commitGuard?.();
		const current = getRegistryWorktree(env, record.id);
		if (current && current.removedAt === void 0) {
			const reason = error instanceof SessionWorktreeLifecycleError && error.reason === "owner-mismatch" ? error.reason : classifyWorktreeRemovalError(error);
			getChildLogger({ subsystem: "session-worktree" }).warn("Session worktree preserved", {
				worktreeId: record.id,
				sessionKey: params.sessionKey,
				reason
			});
			return {
				id: current.id,
				branch: current.branch,
				path: current.path,
				reason
			};
		}
	}
}
/** Snapshot removal and restore never change conversation or session metadata themselves. */
async function synchronizeSessionWorktreeArchive(params) {
	const { entry, scope } = params;
	const id = entry.worktree?.id;
	if (!id) return () => params.commitGuard?.();
	const assertCurrent = () => {
		params.commitGuard?.();
		const current = loadSessionEntry(scope);
		if (current?.sessionId !== entry.sessionId || current?.lifecycleRevision !== entry.lifecycleRevision || current?.archivedAt !== entry.archivedAt || !isDeepStrictEqual(current?.worktree, entry.worktree)) throw new SessionWorktreeLifecycleError("Session changed while preparing its worktree; retry the request.", "session-changed");
		const record = getRegistryWorktree(scope.env ?? process.env, id);
		if (record && !belongsToSession(record, scope.sessionKey)) throw new SessionWorktreeLifecycleError("Session worktree has a different owner; restore the correct binding before retrying.", "owner-mismatch");
	};
	assertCurrent();
	if (params.archived) {
		const preserved = await removeSessionWorktree({
			id,
			sessionKey: scope.sessionKey,
			reason: "session-archive",
			env: scope.env,
			commitGuard: assertCurrent
		});
		if (preserved) throw new SessionWorktreeLifecycleError(`Session worktree was preserved (${preserved.reason}); resolve the cleanup condition and retry the archive.`, preserved.reason);
	} else {
		const record = getRegistryWorktree(scope.env ?? process.env, id);
		if (!record || record.removedAt !== void 0 && !record.snapshotRef) throw new SessionWorktreeLifecycleError("Session worktree snapshot is missing or expired. The conversation is preserved; start a new worktree task from the source repository to continue.", "restore-failed");
		if (record.removedAt !== void 0) {
			params.assertRestoreAllowed?.();
			try {
				await serviceFor(scope.env).restore({
					id,
					commitGuard: assertCurrent
				});
			} catch (error) {
				assertCurrent();
				if (error instanceof SessionWorktreeLifecycleError) throw error;
				if (!existsSync(record.repoRoot)) throw new SessionWorktreeLifecycleError("Session worktree source repository is missing. Restore the original repository and its snapshot refs, then retry; otherwise start a new worktree task. The conversation is preserved.", "restore-failed");
				const snapshot = await runGit(record.repoRoot, [
					"rev-parse",
					"--verify",
					"--end-of-options",
					`${record.snapshotRef}^{commit}`
				]);
				assertCurrent();
				if (snapshot.code !== 0) throw new SessionWorktreeLifecycleError("Session worktree snapshot is missing or unavailable. Restore the original repository snapshot, or start a new worktree task. The conversation is preserved.", "restore-failed");
				throw new SessionWorktreeLifecycleError("Session worktree could not be restored. Free disk space if needed, check the source repository, then retry. The conversation and snapshot are preserved.", "restore-failed");
			}
		}
	}
	assertCurrent();
	return assertCurrent;
}
/** Maintenance commits archive metadata first; its released writer lane must never retain Git work. */
async function cleanUpAutomaticallyArchivedWorktrees(scope, targets) {
	for (const target of targets) try {
		await runExclusiveSessionLifecycleMutation("worktree-cleanup", {
			scope: target.storePath,
			identities: [target.sessionKey, target.entry.sessionId],
			run: async () => {
				const placements = createWorkerSessionPlacementStore({ database: openOpenClawStateDatabase({ env: scope.env }) });
				const assertPlacementCurrent = prepareSessionWorkerPlacementMutationCheck({
					context: { workerSessionPlacementService: placements },
					sessionId: target.entry.sessionId
				});
				await synchronizeSessionWorktreeArchive({
					archived: true,
					entry: target.entry,
					scope: {
						...scope,
						sessionKey: target.sessionKey,
						storePath: target.storePath
					},
					commitGuard: () => {
						assertPlacementCurrent();
						if (collectActiveSessionWorkAdmissionKeys({
							storePath: target.storePath,
							store: { [target.sessionKey]: target.entry }
						})?.has(target.sessionKey)) throw new SessionWorktreeLifecycleError("Session worktree is still active; cleanup is deferred.", "busy");
					}
				});
			}
		});
	} catch (error) {
		getChildLogger({ subsystem: "session-worktree" }).warn("Automatic archive worktree cleanup deferred", {
			worktreeId: target.entry.worktree?.id,
			reason: error instanceof SessionWorktreeLifecycleError ? error.reason : "cleanup-failed"
		});
	}
}
//#endregion
export { synchronizeSessionWorktreeArchive as i, cleanUpAutomaticallyArchivedWorktrees as n, removeSessionWorktree as r, SessionWorktreeLifecycleError as t };
