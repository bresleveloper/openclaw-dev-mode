import { d as pathExists, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { d as resolveSkillProposalTarget } from "./store-AlmU8nKC.mjs";
import { c as classifyWorkshopRelocation, m as listPendingLegacyCollectionBackupRoots, n as LEGACY_WORKSHOP_PROPOSALS_DIR, o as readLegacyWorkshopProposals, s as readWorkshopMigrationRecords, u as isReadOnlyRehearsalProposal } from "./doctor-skill-workshop-sources-pU_pJ8tG.mjs";
import path from "node:path";
//#region src/commands/doctor-update-rehearsal-workshop.ts
const MANIFEST_PATH = "skill-workshop/proposals.json";
const RECOVERY_PROPOSALS_DIR = "skill-workshop/recovery/proposals";
/** Inventory migration-owned files without opening Workshop's writable recovery readers. */
async function collectDoctorSkillWorkshopBackupResources(params) {
	const env = params.env ?? process.env;
	const stateDir = resolveStateDir(env);
	const { records } = await readWorkshopMigrationRecords(env);
	const resources = /* @__PURE__ */ new Map();
	if (await pathExists(path.join(stateDir, MANIFEST_PATH))) resources.set(path.join(stateDir, MANIFEST_PATH), "file");
	if (await pathExists(path.join(stateDir, "skill-workshop/proposals"))) {
		resources.set(path.join(stateDir, LEGACY_WORKSHOP_PROPOSALS_DIR), "directory");
		resources.set(path.join(stateDir, RECOVERY_PROPOSALS_DIR), "directory");
		for (const proposal of await readLegacyWorkshopProposals(await root(stateDir))) records.push(proposal);
	}
	const { external } = classifyWorkshopRelocation(records.filter(({ record }) => !isReadOnlyRehearsalProposal(record, env)), params.config, env);
	for (const candidate of external) {
		if (!candidate.workspaceDir || !candidate.ownerAgentId) continue;
		resources.set(candidate.source, "directory");
		resources.set(resolveSkillProposalTarget({
			skillName: candidate.record.target.skillKey,
			config: params.config,
			agentId: candidate.ownerAgentId,
			env
		}).skillDir, "directory");
	}
	for (const backupRoot of await listPendingLegacyCollectionBackupRoots(params.config, env)) {
		if (!("destinationRoot" in backupRoot)) continue;
		for (const backup of backupRoot.backups) {
			resources.set(backup.backupDir, "directory");
			resources.set(path.join(backupRoot.destinationRoot, backup.manifest.id), "directory");
		}
	}
	return [...resources].toSorted(([left], [right]) => left.localeCompare(right)).map(([pathname, kind]) => ({
		path: pathname,
		kind
	}));
}
//#endregion
export { collectDoctorSkillWorkshopBackupResources as t };
