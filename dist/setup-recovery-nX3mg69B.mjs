import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-BPJp3Uyw.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import { s as withConfigMutationExclusive } from "./mutate-CdmDoEFy.mjs";
import "./config-DryArA1l.mjs";
import { u as resolveSystemAgentOnboardingTarget } from "./onboard-agent-target-pGC2ybZv.mjs";
import { i as readLocalOnboardingStateForConfig, n as completeLocalOnboarding } from "./local-onboarding-state-B3Mc5ot_.mjs";
import path from "node:path";
//#region src/system-agent/setup-recovery.ts
/** A team receipt owns the complete preset under its root, not just the coordinator. */
async function matchesLocalSetupWorkspace(config, workspace, teamCoordinatorId) {
	const root = resolveUserPath(workspace);
	if (!teamCoordinatorId) return resolveUserPath(resolveSystemAgentOnboardingTarget(config).workspaceDir) === root;
	const roster = listAgentEntries(config);
	if (roster.length <= 1) return false;
	const target = resolveSystemAgentOnboardingTarget(config);
	if (target.agentId !== teamCoordinatorId) return false;
	const coordinator = roster.find(({ id }) => normalizeAgentId(id) === target.agentId);
	const allowed = coordinator?.subagents?.allowAgents ?? [];
	const { loadAgentTeamPreset } = await import("./agent-roles-Bv1gk1AS.mjs");
	const specialists = (await loadAgentTeamPreset()).specialists.map(({ id }) => id);
	const expectedIds = /* @__PURE__ */ new Set([target.agentId, ...specialists]);
	return config.agents?.ownership === "explicit" && config.agents.defaults?.systemAgent?.agentId === target.agentId && roster.length === specialists.length + 1 && expectedIds.size === roster.length && coordinator?.subagents?.delegationMode === "prefer" && allowed.length === specialists.length && specialists.every((id) => allowed.includes(id)) && roster.every(({ id, subagents }) => {
		const agentId = normalizeAgentId(id);
		return expectedIds.has(agentId) && resolveAgentWorkspaceDir(config, agentId) === path.join(root, agentId) && (agentId === target.agentId || subagents?.allowAgents?.length === 0);
	});
}
/** Keep canonical config mutations excluded until the SQLite ownership CAS commits. */
async function completeLocalSetupRecovery(params) {
	return await withConfigMutationExclusive(async (lockedSourceConfig) => {
		const snapshot = await readConfigFileSnapshot();
		const sourceConfig = snapshot.sourceConfig ?? snapshot.config;
		if (!snapshot.exists || !snapshot.valid || !snapshot.path || resolveUserPath(snapshot.path) !== params.owner.configPath || params.appliedConfigPath && resolveUserPath(params.appliedConfigPath) !== params.owner.configPath || lockedSourceConfig.wizard?.securityAcknowledgedAt !== params.owner.securityAcknowledgedAt || sourceConfig.wizard?.securityAcknowledgedAt !== params.owner.securityAcknowledgedAt || !await matchesLocalSetupWorkspace(snapshot.runtimeConfig ?? snapshot.config, params.owner.workspace, params.owner.teamCoordinatorId ?? params.teamCoordinatorId)) throw new Error("The onboarding configuration changed before setup could complete.");
		if (readLocalOnboardingStateForConfig(snapshot.path, sourceConfig)?.runId !== params.owner.runId || !completeLocalOnboarding({
			configPath: snapshot.path,
			runId: params.owner.runId
		})) throw new Error("Another onboarding run replaced this setup operation. Retry onboarding.");
		return snapshot;
	});
}
/** Adopt only a valid, local, same-workspace onboarding receipt. */
async function loadLocalSetupRecovery(requestedWorkspace) {
	const snapshot = await readConfigFileSnapshot();
	const recorded = snapshot.exists && snapshot.valid && (snapshot.sourceConfig ?? snapshot.config)?.gateway?.mode !== "remote" ? readLocalOnboardingStateForConfig(snapshot.path, snapshot.sourceConfig ?? snapshot.config) : void 0;
	const pending = recorded?.status === "pending" ? recorded : void 0;
	const workspace = resolveUserPath(requestedWorkspace ?? pending?.workspace ?? process.cwd());
	if (pending && workspace !== resolveUserPath(pending.workspace)) throw new Error("Another onboarding run owns a different workspace. Retry onboarding with its approved workspace.");
	let teamCoordinatorId = pending?.teamCoordinatorId;
	if (pending && !teamCoordinatorId) {
		const config = snapshot.runtimeConfig ?? snapshot.config;
		const candidateId = resolveSystemAgentOnboardingTarget(config).agentId;
		if (await matchesLocalSetupWorkspace(config, workspace, candidateId)) teamCoordinatorId = candidateId;
	}
	const assertOwner = (sourceConfig) => {
		if (pending && readLocalOnboardingStateForConfig(snapshot.path, sourceConfig)?.runId !== pending.runId) throw new Error("Another onboarding run replaced this setup operation. Retry onboarding.");
	};
	return {
		workspace,
		...pending ? { applyOptions: {
			resume: true,
			allowWorkspaceChange: true,
			assertCommitPreconditions: assertOwner,
			...teamCoordinatorId ? { teamCoordinatorId } : {},
			...pending.teamCoordinatorId && !hasResolvedRosterBeforeMigrations(snapshot) ? { firstAgent: {
				name: pending.teamCoordinatorId,
				team: true
			} } : {}
		} } : {},
		async complete(appliedConfigPath, authorize) {
			if (!pending) return;
			return await authorize(() => completeLocalSetupRecovery({
				owner: pending,
				appliedConfigPath,
				teamCoordinatorId
			}));
		}
	};
}
//#endregion
export { loadLocalSetupRecovery as n, matchesLocalSetupWorkspace as r, completeLocalSetupRecovery as t };
