import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { b as resolveMemoryDreamingConfig, x as resolveMemoryDreamingPluginConfig } from "./dreaming-D2xE6WEV.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { i as readMemorySearchManagerStatus } from "./types-CGuNDIwt.mjs";
import { l as resolveActiveMemoryBackendConfig, o as getActiveMemorySearchManagerCore } from "./memory-runtime-CXcwwGi2.mjs";
import { d as repairDreamingArtifacts, f as repairShortTermPromotionArtifacts, n as auditShortTermPromotionArtifacts, t as auditDreamingArtifacts } from "./memory-core-bundled-runtime-B9N5CKgx.mjs";
import { n as resolveMemoryDoctorAgentScopes, t as formatMemoryDoctorAgentMessage } from "./doctor-memory-scope-Cmm9UB91.mjs";
import { r as maybeRepairWorkspaceMemoryHealth } from "./doctor-workspace-BVsI5d1z.mjs";
//#region src/commands/doctor-memory-recall.ts
async function resolveRuntimeMemoryWorkspaceDir(cfg, agentId) {
	const manager = (await getActiveMemorySearchManagerCore({
		cfg,
		agentId,
		purpose: "status"
	})).manager;
	if (!manager) return;
	try {
		return (await readMemorySearchManagerStatus(manager)).workspaceDir?.trim();
	} finally {
		await manager.close?.().catch(() => void 0);
	}
}
function buildMemoryArtifactIssueNote(issues, heading, location) {
	if (issues.length === 0) return null;
	return [
		heading,
		...issues.map((issue) => `- ${issue.message}`),
		location,
		issues.some((issue) => issue.fixable) ? `Fix: ${formatCliCommand("openclaw doctor --fix")} or ${formatCliCommand("openclaw memory status --fix")}` : `Verify: ${formatCliCommand("openclaw memory status --deep")}`
	].join("\n");
}
async function runMemoryRecallHealth(cfg, prompter) {
	const scopes = resolveMemoryDoctorAgentScopes(cfg);
	const labelAgents = scopes.length > 1;
	const dreaming = prompter ? void 0 : resolveMemoryDreamingConfig({
		cfg,
		pluginConfig: resolveMemoryDreamingPluginConfig(cfg)
	});
	for (const scope of scopes) {
		const agentMessage = (message) => formatMemoryDoctorAgentMessage(scope.agentId, labelAgents, message);
		const report = (message) => note(agentMessage(message), "Memory search");
		const backend = resolveActiveMemoryBackendConfig({
			cfg,
			agentId: scope.agentId
		});
		if (backend?.backend === "provider-runtime") {
			report(`Not applicable: ${backend.providerId} uses the provider runtime; see its health.`);
			continue;
		}
		if (prompter) await maybeRepairWorkspaceMemoryHealth({
			prompter,
			scope: {
				agentId: scope.agentId,
				workspaceDir: scope.workspaceDir,
				labelAgent: labelAgents
			}
		});
		try {
			const workspaceDir = await resolveRuntimeMemoryWorkspaceDir(cfg, scope.agentId);
			if (!workspaceDir) continue;
			if (!prompter) {
				const audit = await auditShortTermPromotionArtifacts({ workspaceDir });
				const message = buildMemoryArtifactIssueNote(audit.issues, "Memory recall artifacts need attention:", `Recall store: ${audit.storePath}`);
				if (message) report(message);
				const dreamingAudit = await auditDreamingArtifacts({ workspaceDir });
				const dreamingMessage = buildMemoryArtifactIssueNote(dreamingAudit.issues, "Dreaming artifacts need attention:", `Dream corpus: ${dreamingAudit.sessionCorpusDir}`);
				if (dreamingMessage) report(dreamingMessage);
				continue;
			}
			for (const kind of ["recall", "dreaming"]) {
				if (!(await (kind === "recall" ? auditShortTermPromotionArtifacts : auditDreamingArtifacts)({ workspaceDir })).issues.some((issue) => issue.fixable)) continue;
				if (!await prompter.confirmRuntimeRepair({
					message: agentMessage(kind === "recall" ? "Remove dangling memory recalls, normalize recall artifacts, and remove stale promotion locks?" : "Archive contaminated dreaming artifacts and reset derived dream corpus state?"),
					initialValue: true
				})) continue;
				let lines;
				if (kind === "recall") {
					const repair = await repairShortTermPromotionArtifacts({ workspaceDir });
					if (!repair.changed) continue;
					const removed = [
						[repair.removedInvalidEntries, "invalid"],
						[repair.removedDanglingEntries ?? 0, "dangling"],
						[repair.removedOverflowEntries ?? 0, "overflow"]
					].filter(([count]) => count > 0).map(([count, label]) => `-${count} ${label} entries`).join(", ");
					lines = [
						"Memory recall artifacts repaired:",
						repair.rewroteStore ? `- rewrote recall store${removed ? ` (${removed})` : ""}` : null,
						repair.removedStaleLock ? "- removed stale promotion lock" : null
					];
				} else {
					const repair = await repairDreamingArtifacts({ workspaceDir });
					if (!repair.changed) continue;
					lines = [
						"Dreaming artifacts repaired:",
						repair.archivedSessionCorpus ? "- archived session corpus" : null,
						repair.archivedSessionIngestion ? "- archived session-ingestion state" : null,
						repair.archivedDreamsDiary ? "- archived dream diary" : null,
						repair.archiveDir ? `- archive dir: ${repair.archiveDir}` : null,
						...repair.warnings.map((warning) => `- warning: ${warning}`)
					];
				}
				lines.push(`Verify: ${formatCliCommand("openclaw memory status --deep")}`);
				note(agentMessage(lines.filter(Boolean).join("\n")), "Doctor changes");
			}
		} catch (err) {
			report(`${prompter ? "Memory artifact repair" : "Memory recall audit"} could not be completed: ${formatErrorMessage(err)}`);
		} finally {
			if (dreaming) report(`Dreaming: ${dreaming.enabled ? "enabled" : "disabled"} (cadence ${dreaming.frequency}).`);
		}
	}
}
async function noteMemoryRecallHealth(cfg) {
	return runMemoryRecallHealth(cfg);
}
async function maybeRepairMemoryRecallHealth(params) {
	return runMemoryRecallHealth(params.cfg, params.prompter);
}
//#endregion
export { maybeRepairMemoryRecallHealth, noteMemoryRecallHealth };
