import { t as withWorktreeGitConfig } from "./checkout-git-config-2jwoTM0v.mjs";
//#region src/agents/worktrees/checkout-policy.ts
/** Existing session custody also covers archive/restore before any execution projection exists. */
async function usesSourceOnlyWorktreeGit(record, env, getConfig) {
	if (record.ownerKind !== "session") return false;
	if (!record.ownerId) return true;
	const [{ loadSessionEntryReadOnly }, { resolveSessionStorePathCore }, { resolveSessionAgentId }, { resolveSandboxRuntimeStatusesForPersistedSessions }, { localWorkspaceStore }] = await Promise.all([
		import("./session-accessor-q6FYcfL0.mjs"),
		import("./paths-CqWiK_jG.mjs"),
		import("./agent-scope-C4CYkKyC.mjs"),
		import("./runtime-status-DblvLQHs.mjs"),
		import("./local-workspace-store-C9DnYQae.mjs")
	]);
	if (localWorkspaceStore(env).get(record.id)) return true;
	const cfg = getConfig();
	const agentId = resolveSessionAgentId({
		config: cfg,
		sessionKey: record.ownerId
	});
	const entry = loadSessionEntryReadOnly({
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
	return resolveSandboxRuntimeStatusesForPersistedSessions([{
		cfg,
		agentId,
		sessionKeys: [record.ownerId],
		env
	}])[0]?.[0]?.sandboxed === true;
}
async function withManagedWorktreeGit(params, operation) {
	const sourceOnly = await usesSourceOnlyWorktreeGit(params.record, params.env, params.getConfig);
	params.beforeRun?.();
	return await withWorktreeGitConfig(params.record.path, sourceOnly, params, operation);
}
//#endregion
export { withManagedWorktreeGit as n, usesSourceOnlyWorktreeGit as t };
