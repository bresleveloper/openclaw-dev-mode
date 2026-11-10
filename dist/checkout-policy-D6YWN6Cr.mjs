import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { t as withWorktreeGitConfig } from "./checkout-git-config-CsrQ5-l1.mjs";
//#region src/agents/worktrees/checkout-policy.ts
/** Existing session custody also covers archive/restore before any execution projection exists. */
async function usesSourceOnlyWorktreeGit(record, env, getConfig) {
	if (record.ownerKind !== "session") return false;
	if (!record.ownerId) return true;
	const source = captureSessionActorStorageOwner({
		sessionKey: record.ownerId,
		env
	}, {
		assertCurrent() {},
		authorize() {}
	});
	const [{ readSessionEntryReadOnlyInWorker }, { resolveSessionStorePathCore }, { resolveSessionAgentId }, { resolveSandboxRuntimeStatus }, { hasLocalWorkspaceProjection }] = await Promise.all([
		import("./session-entry-read-runtime-BS7SNC06.mjs"),
		import("./paths-61iv6ksb.mjs"),
		import("./agent-scope-B7r8PTbp.mjs"),
		import("./runtime-status-CuzTKdep.mjs"),
		import("./local-workspace-store-DI1tygZh.mjs")
	]);
	if (await hasLocalWorkspaceProjection(record.id, env)) return true;
	const cfg = getConfig();
	const agentId = resolveSessionAgentId({
		config: cfg,
		sessionKey: record.ownerId
	});
	const entry = source ? readCapturedSessionActorEntry(source, record.ownerId) : await readSessionEntryReadOnlyInWorker({
		agentId,
		sessionKey: record.ownerId,
		env,
		storePath: resolveSessionStorePathCore(cfg.session?.store, {
			agentId,
			env
		}),
		clone: false
	});
	if (!entry || entry.worktree?.id !== record.id || entry.sandbox === "required") return true;
	return resolveSandboxRuntimeStatus({
		cfg,
		agentId,
		sessionKey: record.ownerId,
		preparedSessionEntry: entry
	}).sandboxed;
}
async function withManagedWorktreeGit(params, operation) {
	const sourceOnly = await usesSourceOnlyWorktreeGit(params.record, params.env, params.getConfig);
	params.beforeRun?.();
	return await withWorktreeGitConfig(params.record.path, sourceOnly, params, operation);
}
//#endregion
export { withManagedWorktreeGit as n, usesSourceOnlyWorktreeGit as t };
