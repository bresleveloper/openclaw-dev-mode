import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { O as listAgentIds, l as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as listAgentWorkspaceDirs } from "./workspace-dirs-CzkKDKkL.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import { c as assertWorkspaceStateMigrationReady } from "./workspace-legacy-state-6xtqRcEJ.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-B2J3OrFT.mjs";
import { r as resolveSandboxWorkspaceLayoutPaths } from "./shared-ByhrzAKj.mjs";
import path from "node:path";
import os from "node:os";
//#region src/agents/workspace-state-dirs.ts
/** Select configured workspaces and active sandbox copies for migration and readiness. */
async function listWorkspaceStateDirs(params) {
	const dirs = new Set(listAgentWorkspaceDirs(params.cfg, params.env));
	const agentWorkspaces = [];
	let sessionAccessor;
	for (const agentId of listAgentIds(params.cfg)) {
		if (readAgentDatabaseAdmissionRefusal(agentId, { env: params.env })) continue;
		const sandbox = resolveSandboxConfigForAgent(params.cfg, agentId);
		if (sandbox.mode === "off" || sandbox.workspaceAccess === "rw") continue;
		const configuredWorkspaceRoot = resolveAgentConfig(params.cfg, agentId)?.sandbox?.workspaceRoot ?? params.cfg.agents?.defaults?.sandbox?.workspaceRoot;
		const workspaceRoot = resolveUserPath(configuredWorkspaceRoot ?? path.join(params.stateDir, "sandboxes"), params.env, params.homedir);
		let sessionKeys = [];
		if (sandbox.scope === "session") {
			sessionAccessor ??= await import("./session-accessor-q6FYcfL0.mjs");
			sessionKeys = await sessionAccessor.listSessionEntryKeysReadOnly({
				agentId,
				env: params.env,
				storePath: resolveSessionStorePathCore(params.cfg.session?.store, {
					agentId,
					env: params.env
				})
			});
		}
		agentWorkspaces.push({
			agentId,
			sandbox,
			workspaceRoot,
			sessionKeys: sessionKeys.filter((sessionKey) => {
				const sessionAgentId = parseAgentSessionKey(sessionKey)?.agentId;
				return !sessionAgentId || sessionAgentId === agentId;
			})
		});
	}
	if (agentWorkspaces.length === 0) return [...dirs];
	const { resolveSandboxRuntimeStatusesForPersistedSessions } = await import("./runtime-status-DblvLQHs.mjs");
	const runtimeGroups = resolveSandboxRuntimeStatusesForPersistedSessions(agentWorkspaces.map(({ agentId, sessionKeys }) => ({
		cfg: params.cfg,
		env: params.env,
		agentId,
		sessionKeys
	})));
	for (const [index, { agentId, sandbox, workspaceRoot }] of agentWorkspaces.entries()) {
		if (sandbox.scope === "shared") {
			dirs.add(workspaceRoot);
			continue;
		}
		if (sandbox.scope === "agent") {
			const layout = resolveSandboxWorkspaceLayoutPaths({
				cfg: {
					...sandbox,
					workspaceRoot
				},
				agentId,
				rawSessionKey: `agent:${agentId}:main`,
				workspaceDir: resolveAgentWorkspaceDir(params.cfg, agentId, params.env)
			});
			dirs.add(layout.sandboxWorkspaceDir);
			continue;
		}
		for (const runtime of expectDefined(runtimeGroups[index], "sandbox runtime group")) {
			if (!runtime.sandboxed) continue;
			const layout = resolveSandboxWorkspaceLayoutPaths({
				cfg: {
					...sandbox,
					workspaceRoot
				},
				agentId,
				rawSessionKey: runtime.sessionKey,
				workspaceDir: resolveAgentWorkspaceDir(params.cfg, agentId, params.env)
			});
			dirs.add(layout.sandboxWorkspaceDir);
		}
	}
	return [...dirs];
}
/** Refuse completion before channels accept work that a workspace cannot execute. */
async function assertConfiguredWorkspaceStateReady(params) {
	const env = params.env ?? process.env;
	const homedir = os.homedir;
	const workspaceDirs = await listWorkspaceStateDirs({
		cfg: params.cfg,
		env,
		homedir,
		stateDir: resolveStateDir(env, homedir)
	});
	if (params.operation === "doctor" && workspaceDirs.length > 0) {
		const { readWorkspaceStateSnapshot } = await import("./workspace-state-store-DqRzNKvD.mjs");
		for (const workspaceDir of workspaceDirs) await readWorkspaceStateSnapshot(workspaceDir, {
			env,
			readOnly: true
		});
	}
	assertWorkspaceStateMigrationReady({
		...params,
		workspaceDirs,
		env,
		homedir
	});
}
//#endregion
export { listWorkspaceStateDirs as n, assertConfiguredWorkspaceStateReady as t };
