import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { C as resolveMemoryDreamingPluginConfig, S as resolveMemoryDreamingConfig } from "./dreaming-D1wokp9N.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { l as resolveActiveMemoryBackendConfig, o as getActiveMemorySearchManagerCore } from "./memory-runtime-B776pEel.mjs";
import { d as repairDreamingArtifacts, f as repairShortTermPromotionArtifacts, n as auditShortTermPromotionArtifacts, t as auditDreamingArtifacts } from "./memory-core-bundled-runtime-BGXZo-aG.mjs";
import { n as resolveMemoryDoctorAgentScopes, t as formatMemoryDoctorAgentMessage } from "./doctor-memory-scope-CqGaR_Jo.mjs";
import { r as maybeRepairWorkspaceMemoryHealth } from "./doctor-workspace-CfkOuM1w.mjs";
//#region src/commands/doctor-memory-recall.ts
async function resolveRuntimeMemoryWorkspaceDir(cfg, agentId) {
	const manager = (await getActiveMemorySearchManagerCore({
		cfg,
		agentId,
		purpose: "status"
	})).manager;
	if (!manager) return;
	try {
		return manager.status().workspaceDir?.trim();
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
async function noteMemoryRecallHealth(cfg) {
	const scopes = resolveMemoryDoctorAgentScopes(cfg);
	const labelAgents = scopes.length > 1;
	const dreaming = resolveMemoryDreamingConfig({
		cfg,
		pluginConfig: resolveMemoryDreamingPluginConfig(cfg)
	});
	for (const scope of scopes) {
		const report = (message) => note(formatMemoryDoctorAgentMessage(scope.agentId, labelAgents, message), "Memory search");
		const backend = resolveActiveMemoryBackendConfig({
			cfg,
			agentId: scope.agentId
		});
		if (backend?.backend === "provider-runtime") {
			report(`Not applicable: ${backend.providerId} uses the provider runtime; see its health.`);
			continue;
		}
		try {
			const workspaceDir = await resolveRuntimeMemoryWorkspaceDir(cfg, scope.agentId);
			if (!workspaceDir) continue;
			const audit = await auditShortTermPromotionArtifacts({ workspaceDir });
			const message = buildMemoryArtifactIssueNote(audit.issues, "Memory recall artifacts need attention:", `Recall store: ${audit.storePath}`);
			if (message) report(message);
			const dreamingAudit = await auditDreamingArtifacts({ workspaceDir });
			const dreamingMessage = buildMemoryArtifactIssueNote(dreamingAudit.issues, "Dreaming artifacts need attention:", `Dream corpus: ${dreamingAudit.sessionCorpusDir}`);
			if (dreamingMessage) report(dreamingMessage);
		} catch (err) {
			report(`Memory recall audit could not be completed: ${formatErrorMessage(err)}`);
		} finally {
			report(`Dreaming: ${dreaming.enabled ? "enabled" : "disabled"} (cadence ${dreaming.frequency}).`);
		}
	}
}
async function maybeRepairMemoryRecallHealth(params) {
	const scopes = resolveMemoryDoctorAgentScopes(params.cfg);
	const labelAgents = scopes.length > 1;
	for (const scope of scopes) {
		const agentMessage = (message) => formatMemoryDoctorAgentMessage(scope.agentId, labelAgents, message);
		const backend = resolveActiveMemoryBackendConfig({
			cfg: params.cfg,
			agentId: scope.agentId
		});
		if (backend?.backend === "provider-runtime") {
			note(agentMessage(`Not applicable: ${backend.providerId} uses the provider runtime; see its health.`), "Memory search");
			continue;
		}
		await maybeRepairWorkspaceMemoryHealth({
			...params,
			scope: {
				agentId: scope.agentId,
				workspaceDir: scope.workspaceDir,
				labelAgent: labelAgents
			}
		});
		try {
			const workspaceDir = await resolveRuntimeMemoryWorkspaceDir(params.cfg, scope.agentId);
			if (!workspaceDir) continue;
			if ((await auditShortTermPromotionArtifacts({ workspaceDir })).issues.some((issue) => issue.fixable)) {
				if (await params.prompter.confirmRuntimeRepair({
					message: agentMessage("Remove dangling memory recalls, normalize recall artifacts, and remove stale promotion locks?"),
					initialValue: true
				})) {
					const repair = await repairShortTermPromotionArtifacts({ workspaceDir });
					if (repair.changed) {
						const removedOverflowEntries = repair.removedOverflowEntries ?? 0;
						const details = [
							repair.removedInvalidEntries > 0 ? `-${repair.removedInvalidEntries} invalid entries` : null,
							(repair.removedDanglingEntries ?? 0) > 0 ? `-${repair.removedDanglingEntries} dangling entries` : null,
							removedOverflowEntries > 0 ? `-${removedOverflowEntries} overflow entries` : null
						].filter(Boolean).join(", ");
						const lines = [
							"Memory recall artifacts repaired:",
							repair.rewroteStore ? `- rewrote recall store${details ? ` (${details})` : ""}` : null,
							repair.removedStaleLock ? "- removed stale promotion lock" : null,
							`Verify: ${formatCliCommand("openclaw memory status --deep")}`
						].filter(Boolean);
						note(agentMessage(lines.join("\n")), "Doctor changes");
					}
				}
			}
			if (!(await auditDreamingArtifacts({ workspaceDir })).issues.some((issue) => issue.fixable)) continue;
			if (!await params.prompter.confirmRuntimeRepair({
				message: agentMessage("Archive contaminated dreaming artifacts and reset derived dream corpus state?"),
				initialValue: true
			})) continue;
			const dreamingRepair = await repairDreamingArtifacts({ workspaceDir });
			if (!dreamingRepair.changed) continue;
			const lines = [
				"Dreaming artifacts repaired:",
				dreamingRepair.archivedSessionCorpus ? "- archived session corpus" : null,
				dreamingRepair.archivedSessionIngestion ? "- archived session-ingestion state" : null,
				dreamingRepair.archivedDreamsDiary ? "- archived dream diary" : null,
				dreamingRepair.archiveDir ? `- archive dir: ${dreamingRepair.archiveDir}` : null,
				...dreamingRepair.warnings.map((warning) => `- warning: ${warning}`),
				`Verify: ${formatCliCommand("openclaw memory status --deep")}`
			].filter(Boolean);
			note(agentMessage(lines.join("\n")), "Doctor changes");
		} catch (err) {
			note(agentMessage(`Memory artifact repair could not be completed: ${formatErrorMessage(err)}`), "Memory search");
		}
	}
}
//#endregion
export { maybeRepairMemoryRecallHealth, noteMemoryRecallHealth };
