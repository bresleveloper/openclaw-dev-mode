import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { t as listAgentWorkspaceDirs } from "./workspace-dirs-BZeanw4b.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { _ as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-CeDA0ojh.mjs";
import { r as resolveSandboxConfigForAgent } from "./config-Bf089UPS.mjs";
import { s as assertWorkspaceStateMigrationReady } from "./workspace-legacy-state-CUN3bghH.mjs";
import { r as resolveSandboxWorkspaceLayoutPaths } from "./shared-BtZkFvkt.mjs";
import os from "node:os";
import path from "node:path";
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
			sessionAccessor ??= await import("./session-accessor-DHKitUxn.mjs");
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
	const { resolveSandboxRuntimeStatusesForPersistedSessions } = await import("./runtime-status-CuzTKdep.mjs");
	const runtimeGroups = await resolveSandboxRuntimeStatusesForPersistedSessions(agentWorkspaces.map(({ agentId, sessionKeys }) => ({
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
		const sessionKeys = sandbox.scope === "agent" ? [`agent:${agentId}:main`] : expectDefined(runtimeGroups[index], "sandbox runtime group").filter((runtime) => runtime.sandboxed).map((runtime) => runtime.sessionKey);
		for (const sessionKey of sessionKeys) {
			const layout = resolveSandboxWorkspaceLayoutPaths({
				cfg: {
					...sandbox,
					workspaceRoot
				},
				agentId,
				rawSessionKey: sessionKey,
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
		const { readWorkspaceStateSnapshot } = await import("./workspace-state-store-DoQuGEHK.mjs");
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
