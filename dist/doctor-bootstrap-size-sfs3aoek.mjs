import { A as tryResolveDefaultAgentId, O as listAgentIds, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { i as resolveBootstrapTotalMaxChars, r as resolveBootstrapMaxChars, t as USER_BOOTSTRAP_MAX_CHARS } from "./bootstrap-Dvw1-bo8.mjs";
import "./embedded-agent-helpers-DGdaNc6w.mjs";
import { o as isFixedUserCapFile, r as buildBootstrapInjectionStats, t as analyzeBootstrapBudget } from "./bootstrap-budget-DZWwd3xP.mjs";
import { t as resolveBootstrapContextForDiagnostics } from "./bootstrap-files-diagnostics-fR612YZl.mjs";
//#region src/commands/doctor-bootstrap-size.ts
/** Doctor note for workspace bootstrap file size and truncation risk. */
let integerFormatter;
function formatInt(value) {
	return (integerFormatter ??= new Intl.NumberFormat("en-US")).format(Math.max(0, Math.floor(value)));
}
function formatPercent(numerator, denominator) {
	if (!Number.isFinite(denominator) || denominator <= 0) return "0%";
	return `${Math.min(100, Math.max(0, Math.round(numerator / denominator * 100)))}%`;
}
function formatCauses(causes) {
	if (causes.length === 0) return "unknown";
	return causes.map((cause) => cause === "per-file-limit" ? "max/file" : "max/total").join(", ");
}
/**
* Analyzes configured bootstrap files and emits warnings when injection will truncate content.
*
* Returns the raw budget analysis for tests and callers that need structured evidence.
*/
async function noteBootstrapFileSize(cfg) {
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const agentIds = listAgentIds(cfg);
	const workspaces = agentIds.map((agentId) => ({
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	}));
	let defaultAnalysis;
	for (const { agentId, workspaceDir } of workspaces) {
		const bootstrapMaxChars = resolveBootstrapMaxChars(cfg, agentId);
		const bootstrapTotalMaxChars = resolveBootstrapTotalMaxChars(cfg, agentId);
		const { bootstrapFiles, contextFiles } = await resolveBootstrapContextForDiagnostics({
			workspaceDir,
			config: cfg,
			agentId
		});
		const stats = buildBootstrapInjectionStats({
			bootstrapFiles,
			injectedFiles: contextFiles
		});
		const analysis = analyzeBootstrapBudget({
			files: stats,
			bootstrapMaxChars,
			bootstrapTotalMaxChars
		});
		if (agentId === defaultAgentId) defaultAnalysis = analysis;
		if (!analysis.hasTruncation && analysis.nearLimitFiles.length === 0 && !analysis.totalNearLimit) continue;
		const lines = agentIds.length > 1 ? [`Agent "${agentId}":`] : [];
		if (analysis.hasTruncation) {
			lines.push("Workspace bootstrap files exceed limits and will be truncated:");
			for (const file of analysis.truncatedFiles) {
				const truncatedChars = Math.max(0, file.rawChars - file.injectedChars);
				lines.push(`- ${file.name}: ${formatInt(file.rawChars)} raw / ${formatInt(file.injectedChars)} injected (${formatPercent(truncatedChars, file.rawChars)} truncated; ${formatCauses(file.causes)})`);
			}
		} else lines.push("Workspace bootstrap files are near configured limits:");
		const nonTruncatedNearLimit = analysis.nearLimitFiles.filter((file) => !file.truncated);
		if (nonTruncatedNearLimit.length > 0) for (const file of nonTruncatedNearLimit) lines.push(`- ${file.name}: ${formatInt(file.rawChars)} chars (${formatPercent(file.rawChars, file.effectiveFileLimit)} of max/file ${formatInt(file.effectiveFileLimit)})`);
		lines.push(`Total bootstrap injected chars: ${formatInt(analysis.totals.injectedChars)} (${formatPercent(analysis.totals.injectedChars, bootstrapTotalMaxChars)} of max/total ${formatInt(bootstrapTotalMaxChars)}).`);
		lines.push(`Total bootstrap raw chars (before truncation): ${formatInt(analysis.totals.rawChars)}.`);
		const fixedUserCapApplied = analysis.truncatedFiles.some((file) => isFixedUserCapFile(file) && file.causes.includes("per-file-limit"));
		const fixedUserCapNearLimit = analysis.nearLimitFiles.some(isFixedUserCapFile);
		const fixedUserCapRelevant = fixedUserCapApplied || fixedUserCapNearLimit;
		const needsPerFileTip = analysis.truncatedFiles.some((file) => file.causes.includes("per-file-limit") && !isFixedUserCapFile(file)) || analysis.nearLimitFiles.some((file) => !isFixedUserCapFile(file));
		const needsTotalTip = analysis.truncatedFiles.some((file) => file.causes.includes("total-limit")) || analysis.totalNearLimit;
		if (needsPerFileTip || needsTotalTip || fixedUserCapRelevant) lines.push("");
		if (fixedUserCapRelevant) lines.push(`USER.md has a fixed ${formatInt(USER_BOOTSTRAP_MAX_CHARS)}-character bootstrap cap; keep it compact.`);
		if (needsPerFileTip) lines.push("- Tip: tune `agents.entries.*.bootstrapMaxChars` for this agent, or `agents.defaults.bootstrapMaxChars` as fallback, for per-file limits.");
		if (needsTotalTip) lines.push("- Tip: tune `agents.entries.*.bootstrapTotalMaxChars` for this agent, or `agents.defaults.bootstrapTotalMaxChars` as fallback, for total-budget limits.");
		note(lines.join("\n"), "Bootstrap file size");
	}
	return defaultAnalysis;
}
//#endregion
export { noteBootstrapFileSize };
