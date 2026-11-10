import { T as tryResolveConfiguredAgentWorkspaceDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, o as tryResolveDefaultAgentId } from "./agent-roster-gkYP38su.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-BccyWLRI.mjs";
import "./workspace-default-BjEaT57h.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { a as resolveBootstrapTotalMaxChars, i as resolveBootstrapMaxChars, t as USER_BOOTSTRAP_MAX_CHARS } from "./bootstrap-DLZ2qr_T.mjs";
import "./embedded-agent-helpers-CRUmVsjM.mjs";
import { a as isFixedUserCapFile, r as buildBootstrapInjectionStats, t as analyzeBootstrapBudget } from "./bootstrap-budget-96UImSUD.mjs";
import { a as resolveBootstrapContextWithProjectedHookFiles } from "./bootstrap-files-B2csFCe1.mjs";
import { t as loadDeclaredExtraBootstrapFiles } from "./declared-files-DmgJwHA_.mjs";
import { t as loadWorkspaceHookEntries } from "./workspace-CHuPMd88.mjs";
import { r as resolveInternalHookSelection, t as isHookLoadable } from "./configured-DEDSGM8V.mjs";
//#region src/agents/bootstrap-files-diagnostics.ts
async function isBundledExtraFilesHookSelected(config) {
	if (!config) return false;
	const selection = await resolveInternalHookSelection(config);
	if (!selection.configured) return false;
	const discoveryDir = tryResolveConfiguredAgentWorkspaceDir(config) ?? resolveDefaultAgentWorkspaceDir();
	const selected = loadWorkspaceHookEntries(discoveryDir, { config }).find((entry) => entry.hook.name === "bootstrap-extra-files");
	return selected?.hook.source === "openclaw-bundled" && isHookLoadable({
		entry: selected,
		config,
		names: selection.names
	});
}
/** Projects fresh-start bundled declarations without importing or invoking hook handlers. */
async function resolveBootstrapContextForDiagnostics(params) {
	if (!await isBundledExtraFilesHookSelected(params.config)) return resolveBootstrapContextWithProjectedHookFiles(params, []);
	const declared = await loadDeclaredExtraBootstrapFiles({
		config: params.config,
		workspaceDir: params.workspaceDir
	});
	return resolveBootstrapContextWithProjectedHookFiles(params, declared.files);
}
//#endregion
//#region src/commands/doctor-bootstrap-size.ts
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
async function collectBootstrapFileSize(cfg, workspaceDir, agentId) {
	const bootstrapMaxChars = resolveBootstrapMaxChars(cfg, agentId);
	const bootstrapTotalMaxChars = resolveBootstrapTotalMaxChars(cfg, agentId);
	const { bootstrapFiles, contextFiles } = await resolveBootstrapContextForDiagnostics({
		workspaceDir,
		config: cfg,
		agentId
	});
	return {
		bootstrapTotalMaxChars,
		analysis: analyzeBootstrapBudget({
			files: buildBootstrapInjectionStats({
				bootstrapFiles,
				injectedFiles: contextFiles
			}),
			bootstrapMaxChars,
			bootstrapTotalMaxChars
		})
	};
}
async function noteBootstrapFileSize(cfg) {
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const agentIds = listAgentIds(cfg);
	let defaultAnalysis;
	for (const agentId of agentIds) {
		const { analysis, bootstrapTotalMaxChars } = await collectBootstrapFileSize(cfg, resolveAgentWorkspaceDir(cfg, agentId), agentId);
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
		for (const file of analysis.nearLimitFiles.filter((entry) => !entry.truncated)) lines.push(`- ${file.name}: ${formatInt(file.rawChars)} chars (${formatPercent(file.rawChars, file.effectiveFileLimit)} of max/file ${formatInt(file.effectiveFileLimit)})`);
		lines.push(`Total bootstrap injected chars: ${formatInt(analysis.totals.injectedChars)} (${formatPercent(analysis.totals.injectedChars, bootstrapTotalMaxChars)} of max/total ${formatInt(bootstrapTotalMaxChars)}).`);
		lines.push(`Total bootstrap raw chars (before truncation): ${formatInt(analysis.totals.rawChars)}.`);
		const perFileWarnings = [...analysis.truncatedFiles.filter((file) => file.causes.includes("per-file-limit")), ...analysis.nearLimitFiles];
		const fixedUserCapRelevant = perFileWarnings.some(isFixedUserCapFile);
		const needsPerFileTip = perFileWarnings.some((file) => !isFixedUserCapFile(file));
		const needsTotalTip = analysis.truncatedFiles.some((file) => file.causes.includes("total-limit")) || analysis.totalNearLimit;
		const tips = [
			fixedUserCapRelevant ? `USER.md has a fixed ${formatInt(USER_BOOTSTRAP_MAX_CHARS)}-character bootstrap cap; keep it compact.` : "",
			needsPerFileTip ? "- Tip: tune `agents.entries.*.bootstrapMaxChars` for this agent, or `agents.defaults.bootstrapMaxChars` as fallback, for per-file limits." : "",
			needsTotalTip ? "- Tip: tune `agents.entries.*.bootstrapTotalMaxChars` for this agent, or `agents.defaults.bootstrapTotalMaxChars` as fallback, for total-budget limits." : ""
		].filter(Boolean);
		if (tips.length > 0) lines.push("", ...tips);
		note(lines.join("\n"), "Bootstrap file size");
	}
	return defaultAnalysis;
}
//#endregion
export { collectBootstrapFileSize, noteBootstrapFileSize };
