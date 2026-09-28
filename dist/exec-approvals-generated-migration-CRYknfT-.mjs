import { n as classifyExecAllowlistScope } from "./exec-command-resolution-D9KnwdvB.mjs";
import { g as updateExecApprovalsSync } from "./exec-approvals-store-CTT-ox-I.mjs";
//#region src/infra/exec-approvals-generated-migration.ts
function isObsoleteGeneratedEntry(entry) {
	return entry.source === "allow-always" && classifyExecAllowlistScope(entry) === "inactive";
}
function countObsoleteGeneratedExecApprovals(file) {
	return Object.values(file.agents ?? {}).reduce((count, agent) => count + (agent.allowlist ?? []).filter(isObsoleteGeneratedEntry).length, 0);
}
function removeObsoleteGeneratedExecApprovals(file) {
	let removed = 0;
	const agents = Object.fromEntries(Object.entries(file.agents ?? {}).map(([agentId, agent]) => {
		const allowlist = (agent.allowlist ?? []).filter((entry) => {
			if (!isObsoleteGeneratedEntry(entry)) return true;
			removed += 1;
			return false;
		});
		return [agentId, {
			...agent,
			allowlist
		}];
	}));
	return removed === 0 ? {
		file,
		removed
	} : {
		file: {
			...file,
			agents
		},
		removed
	};
}
function repairObsoleteGeneratedExecApprovals() {
	let removed = 0;
	updateExecApprovalsSync({ update: (file) => {
		const result = removeObsoleteGeneratedExecApprovals(file);
		removed = result.removed;
		return result.removed > 0 ? result.file : null;
	} });
	return removed;
}
//#endregion
export { repairObsoleteGeneratedExecApprovals as n, countObsoleteGeneratedExecApprovals as t };
