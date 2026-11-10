import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { i as WorktreeRemovalContentionError, t as SessionWorktreeLifecycleError } from "./errors-WYf-uyBk.mjs";
import { c as prepareSessionSourceAuthority, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { n as captureSessionEntrySourceAssertion, t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { u as runGit } from "./git-CljZIJM8.mjs";
import { i as captureWorktreeRunEndContext } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { o as assertManagedWorktreeRemovalComplete } from "./run-lease-D02SNP3d.mjs";
import { t as captureWorktreeRegistryReadGuard, u as readRegistryWorktree } from "./registry-read-Do2Ks9un.mjs";
import { t as assertWorktreeRemovalAvailable } from "./registry-BVVI2fBI.mjs";
import { n as ManagedWorktreeService } from "./service-BPAgan76.mjs";
import { v as classifyWorktreeRemovalError } from "./removal-git-BhpnO_Vq.mjs";
import { existsSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
//#region src/sessions/session-worktree-lifecycle.ts
function belongsToSession(record, sessionKey) {
	return record.ownerKind === "session" && record.ownerId === sessionKey;
}
/** Settle the detached checkout before the session fence admits same-key successors. */
async function finalizeDetachedSessionWorktree(params) {
	params.context.admission.assertCurrent();
	if (await new ManagedWorktreeService({ env: params.env }).removeIfLossless(params.id)) return;
	const retained = await readRegistryWorktree(params.context, params.id);
	if (retained && retained.removedAt === void 0) {
		const safePath = truncateUtf16Safe(sanitizeForLog(retained.path), 256);
		throw new Error(`worktree retained: branch=${retained.branch} path=${safePath} outcome=${retained.runEndCleanup?.outcome}`);
	}
}
/** The session lifecycle fence remains held until this exact bound checkout finishes cleanup. */
async function removeSessionWorktree(params) {
	if (!params.id) return;
	const env = params.env ?? process.env;
	const context = captureWorktreeRunEndContext(env);
	const service = new ManagedWorktreeService({ env: {
		...env,
		...context.environment
	} });
	const accept = captureWorktreeRegistryReadGuard(context, "session-owner");
	const record = await readRegistryWorktree(context, params.id);
	const assertWorktreeCurrent = accept(record);
	params.commitGuard?.();
	if (!record || record.removedAt !== void 0) return;
	const assertCurrent = () => {
		params.commitGuard?.();
		assertWorktreeCurrent();
		if (!belongsToSession(record, params.sessionKey)) throw new SessionWorktreeLifecycleError("Session worktree ownership changed; retry cleanup.", "owner-mismatch");
	};
	try {
		assertCurrent();
		await service.remove({
			id: record.id,
			reason: params.reason,
			commitGuard: assertCurrent,
			workerAuthority: {
				...params.workerAuthority,
				assertCurrent: params.workerAuthority ? params.workerAuthority.assertCurrent : params.commitGuard,
				predicates: [...params.workerAuthority?.predicates ?? [], {
					kind: "session-owner",
					id: record.id,
					sessionKey: params.sessionKey
				}]
			}
		});
	} catch (error) {
		params.commitGuard?.();
		const current = await readRegistryWorktree(context, record.id);
		params.commitGuard?.();
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
/** Restore preparation preserves conversation metadata until its caller commits unarchive. */
async function restoreSessionWorktree(params) {
	const { entry, scope: requestedScope } = params;
	const id = entry.worktree?.id;
	if (!id) return composeSessionSourceAssertion([params.commitGuard]);
	const context = captureWorktreeRunEndContext(requestedScope.env ?? process.env);
	const scope = {
		...requestedScope,
		env: {
			...requestedScope.env ?? process.env,
			...context.environment
		}
	};
	const metadata = captureSessionEntryMetadataRead(scope, () => {
		params.commitGuard?.();
		params.assertRestoreAllowed?.();
	});
	const accept = captureWorktreeRegistryReadGuard(context, "session-owner");
	const record = await readRegistryWorktree(context, id);
	const assertWorktreeCurrent = accept(record);
	const assertSessionMatches = (current) => {
		if (current?.sessionId !== entry.sessionId || current?.lifecycleRevision !== entry.lifecycleRevision || current?.archivedAt !== entry.archivedAt || !isDeepStrictEqual(current?.worktree, entry.worktree)) throw new SessionWorktreeLifecycleError("Session changed while preparing its worktree; retry the request.", "session-changed");
	};
	const assertSessionCurrent = () => {
		if (metadata) assertSessionMatches(metadata.readCurrent());
	};
	const sourceParams = {
		scope: {
			agentId: scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey),
			sessionKey: scope.sessionKey,
			storePath: resolveSessionStorePathForScope(scope),
			env: scope.env
		},
		expected: entry,
		assertCurrent: assertSessionCurrent,
		refuse: () => {
			throw new SessionWorktreeLifecycleError("Session changed while preparing its worktree; retry the request.", "session-changed");
		}
	};
	const source = captureSessionEntrySourceAssertion({
		...sourceParams,
		fields: [
			"sessionId",
			"lifecycleRevision",
			"worktree"
		]
	});
	const assertCurrent = composeSessionSourceAssertion([params.commitGuard, source], (assertSources) => {
		assertSources();
		assertWorktreeCurrent();
		try {
			assertWorktreeRemovalAvailable(scope.env ?? process.env, id);
		} catch (error) {
			if (error instanceof WorktreeRemovalContentionError) throw new SessionWorktreeLifecycleError(error.message, "busy");
			throw error;
		}
		if (record && !belongsToSession(record, scope.sessionKey)) throw new SessionWorktreeLifecycleError("Session worktree has a different owner; restore the correct binding before retrying.", "owner-mismatch");
	});
	const retained = metadata ? void 0 : await prepareSessionSourceAuthority(captureSessionEntrySourceAssertion({
		...sourceParams,
		fields: [
			"sessionId",
			"lifecycleRevision",
			"archivedAt",
			"worktree"
		]
	}));
	try {
		const assertRestoreCurrent = composeSessionSourceAssertion([assertCurrent, retained?.assertCurrent]);
		const workerAuthority = {
			assertCurrent: composeSessionSourceAssertion([
				params.commitGuard,
				source,
				retained?.assertCurrent
			]),
			predicates: [{
				kind: "session-owner",
				id,
				sessionKey: scope.sessionKey
			}]
		};
		assertRestoreCurrent();
		if (!record || record.removedAt !== void 0 && !record.snapshotRef) throw new SessionWorktreeLifecycleError("Session worktree snapshot is missing or expired. The conversation is preserved; start a new worktree task from the source repository to continue.", "restore-failed");
		if (record.removedAt !== void 0) {
			params.assertRestoreAllowed?.();
			try {
				await new ManagedWorktreeService({ env: scope.env }).restore({
					id,
					commitGuard: assertRestoreCurrent,
					workerAuthority
				});
			} catch (error) {
				assertRestoreCurrent();
				if (error instanceof SessionWorktreeLifecycleError) throw error;
				if (!existsSync(record.repoRoot)) throw new SessionWorktreeLifecycleError("Session worktree source repository is missing. Restore the original repository and its snapshot refs, then retry; otherwise start a new worktree task. The conversation is preserved.", "restore-failed");
				const snapshot = await runGit(record.repoRoot, [
					"rev-parse",
					"--verify",
					"--end-of-options",
					`${record.snapshotRef}^{commit}`
				]);
				assertRestoreCurrent();
				if (snapshot.code !== 0) throw new SessionWorktreeLifecycleError("Session worktree snapshot is missing or unavailable. Restore the original repository snapshot, or start a new worktree task. The conversation is preserved.", "restore-failed");
				throw new SessionWorktreeLifecycleError("Session worktree could not be restored. Free disk space if needed, check the source repository, then retry. The conversation and snapshot are preserved.", "restore-failed");
			}
		} else try {
			await assertManagedWorktreeRemovalComplete(record, { beforeRun: assertRestoreCurrent });
		} catch (error) {
			assertRestoreCurrent();
			if (error instanceof WorktreeRemovalContentionError) throw new SessionWorktreeLifecycleError(error.message, "restore-failed");
			throw error;
		}
		assertRestoreCurrent();
		return assertCurrent;
	} finally {
		await retained?.release?.();
	}
}
//#endregion
export { removeSessionWorktree as n, restoreSessionWorktree as r, finalizeDetachedSessionWorktree as t };
