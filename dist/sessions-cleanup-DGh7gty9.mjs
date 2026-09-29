import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { c as visibleWidth } from "./ansi-CWsy0bu4.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { o as callGateway } from "./call-C_MP4_Gs.mjs";
import { a as isGatewayTransportError } from "./transport-error-C-c71VUr.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import "./sessions-DE4llkPV.mjs";
import { a as isSessionsCleanupPartialResult, n as runSessionsCleanup, o as serializeSessionCleanupResult } from "./cleanup-service-D-GfJ1eJ.mjs";
import { t as resolveSessionCleanupAction } from "./cleanup-action-BKrVI8EE.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-BRdXcJHh.mjs";
import { t as resolveCommandSessionStoreTargets } from "./session-store-targets-BtlJnu5U.mjs";
import { c as resolveSessionDisplayModel, i as formatSessionModelCell, n as formatSessionFlagsCell, o as toSessionDisplayRows, r as formatSessionKeyCell, t as formatSessionAgeCell } from "./sessions-table-C7Oc5qV2.mjs";
//#region src/commands/sessions-cleanup.ts
/**
* Session cleanup command.
*
* It can delegate cleanup to a live gateway or run local store maintenance,
* with dry-run tables that explain every planned pruning action.
*/
function formatCleanupActionCell(action, rich) {
	if (!rich) return action;
	if (action === "keep") return theme.muted(action);
	if (action === "archive-dashboard" || action === "archive-cap" || action === "archive-age") return theme.warn(action);
	if (action === "prune-missing") return theme.error(action);
	if (action === "prune-model-run") return theme.warn(action);
	if (action === "prune-stale") return theme.warn(action);
	if (action === "retire-dm-scope") return theme.warn(action);
	if (action === "cap-overflow") return theme.accentBright(action);
	return theme.error(action);
}
function buildActionRows(params) {
	return toSessionDisplayRows(params.beforeStore).map((row) => Object.assign({}, row, {
		label: params.beforeStore[row.key]?.label,
		action: resolveSessionCleanupAction({
			key: row.key,
			missingKeys: params.missingKeys,
			modelRunPrunedKeys: params.modelRunPrunedKeys,
			archivedKeys: params.archivedKeys,
			capArchivedKeys: params.capArchivedKeys,
			ageArchivedKeys: params.ageArchivedKeys,
			staleKeys: params.staleKeys,
			cappedKeys: params.cappedKeys,
			dmScopeRetiredKeys: params.dmScopeRetiredKeys
		})
	}));
}
function buildLabelSummaries(actionRows) {
	const summaryByLabel = /* @__PURE__ */ new Map();
	for (const actionRow of actionRows) {
		const rawLabel = typeof actionRow.label === "string" ? actionRow.label.trim() : "";
		const label = sanitizeTerminalText(rawLabel) || "(unlabeled)";
		let summary = summaryByLabel.get(label);
		if (!summary) {
			summary = {
				label,
				kept: 0,
				pruned: 0
			};
			summaryByLabel.set(label, summary);
		}
		if (actionRow.action === "keep" || actionRow.action === "archive-dashboard" || actionRow.action === "archive-cap" || actionRow.action === "archive-age") summary.kept += 1;
		else summary.pruned += 1;
	}
	return [...summaryByLabel.values()].toSorted((a, b) => a.label.localeCompare(b.label));
}
function renderLabelSummaries(params) {
	const summaries = buildLabelSummaries(params.actionRows);
	if (summaries.length === 0) return;
	const labelPad = summaries.reduce((max, summary) => Math.max(max, visibleWidth(summary.label)), 0);
	const totalKept = summaries.reduce((total, summary) => total + summary.kept, 0);
	const totalPruned = summaries.reduce((total, summary) => total + summary.pruned, 0);
	params.runtime.log("");
	params.runtime.log("Summary by Label:");
	for (const summary of summaries) {
		const remaining = labelPad - visibleWidth(summary.label);
		const paddedLabel = remaining > 0 ? `${summary.label}${" ".repeat(remaining)}` : summary.label;
		params.runtime.log(`${paddedLabel}  ${summary.kept} kept, ${summary.pruned} pruned`);
	}
	params.runtime.log(`Total: ${totalKept} kept, ${totalPruned} pruned`);
}
function toDisplayedCleanupSummary(summary) {
	return {
		...summary,
		storePath: resolveSqliteTargetFromSessionStorePath(summary.storePath, { agentId: summary.agentId }).path
	};
}
function renderStoreDryRunPlan(params) {
	const rich = isRich();
	const displaySummary = toDisplayedCleanupSummary(params.summary);
	if (params.showAgentHeader) params.runtime.log(`Agent: ${params.summary.agentId}`);
	params.runtime.log(`Session store: ${displaySummary.storePath}`);
	params.runtime.log(`Maintenance mode: ${params.summary.mode}`);
	params.runtime.log(`Entries: ${params.summary.beforeCount} -> ${params.summary.afterCount} (remove ${params.summary.beforeCount - params.summary.afterCount})`);
	params.runtime.log(`Would prune missing transcripts: ${params.summary.missing}`);
	params.runtime.log(`Would retire stale direct DM sessions: ${params.summary.dmScopeRetired}`);
	params.runtime.log(`Would prune stale model-run probes: ${params.summary.modelRunPruned}`);
	params.runtime.log(`Would archive inactive sessions: ${params.summary.archived ?? 0}`);
	params.runtime.log(`Would archive cap overflow: ${params.summary.capArchived ?? 0}`);
	params.runtime.log(`Would prune stale: ${params.summary.pruned}`);
	params.runtime.log(`Would cap overflow: ${params.summary.capped}`);
	if (params.summary.unreferencedArtifacts?.scannedFiles) params.runtime.log(`Would prune unreferenced artifacts: ${params.summary.unreferencedArtifacts.removedFiles}`);
	if (params.summary.diskBudget) params.runtime.log(`Would enforce disk budget: ${params.summary.diskBudget.totalBytesBefore} -> ${params.summary.diskBudget.totalBytesAfter} bytes (files ${params.summary.diskBudget.removedFiles}, entries ${params.summary.diskBudget.removedEntries})`);
	if (params.actionRows.length === 0) return;
	params.runtime.log("");
	params.runtime.log("Planned session actions:");
	params.runtime.log(renderTable({
		width: getTerminalTableWidth(),
		columns: [
			{
				key: "action",
				header: "Action"
			},
			{
				key: "key",
				header: "Key"
			},
			{
				key: "age",
				header: "Age"
			},
			{
				key: "model",
				header: "Model"
			},
			{
				key: "flags",
				header: "Flags",
				flex: true
			}
		].map((column) => Object.assign(column, { header: colorize(rich, theme.heading, column.header) })),
		rows: params.actionRows.map((row) => ({
			action: formatCleanupActionCell(row.action, rich),
			key: formatSessionKeyCell(row.key, rich),
			age: formatSessionAgeCell(row.updatedAt, rich),
			model: formatSessionModelCell(resolveSessionDisplayModel(params.cfg, row), rich),
			flags: formatSessionFlagsCell(row, rich)
		}))
	}).trimEnd());
	renderLabelSummaries({
		actionRows: params.actionRows,
		runtime: params.runtime
	});
}
function renderAppliedSummaries(params) {
	for (let i = 0; i < params.summaries.length; i += 1) {
		const summary = params.summaries[i];
		if (!summary) continue;
		if (i > 0) params.runtime.log("");
		if (params.summaries.length > 1) params.runtime.log(`Agent: ${summary.agentId}`);
		const storePath = params.locallyOwned ? toDisplayedCleanupSummary(summary).storePath : summary.storePath;
		params.runtime.log(`Session store: ${storePath}`);
		params.runtime.log(`Applied maintenance. Current entries: ${summary.appliedCount ?? 0}`);
		if (summary.unreferencedArtifacts?.removedFiles) params.runtime.log(`Pruned unreferenced artifacts: ${summary.unreferencedArtifacts.removedFiles}`);
	}
}
async function maybeRunGatewayCleanup(opts) {
	if (opts.store !== void 0 || opts.dryRun) return { delegated: false };
	try {
		return {
			delegated: true,
			result: await callGateway({
				method: "sessions.cleanup",
				params: {
					agent: opts.agent,
					allAgents: opts.allAgents,
					enforce: opts.enforce,
					activeKey: opts.activeKey,
					fixMissing: opts.fixMissing,
					fixDmScope: opts.fixDmScope
				},
				mode: GATEWAY_CLIENT_MODES.CLI,
				clientName: GATEWAY_CLIENT_NAMES.CLI,
				requiredMethods: ["sessions.cleanup"]
			})
		};
	} catch (error) {
		if (isGatewayTransportError(error) && error.kind === "closed" && error.code === void 0) return { delegated: false };
		if (isRecord(error) && isSessionsCleanupPartialResult(error.details)) return {
			delegated: true,
			result: error.details
		};
		throw error;
	}
}
/** Runs session cleanup, optionally using the live gateway for active stores. */
async function sessionsCleanupCommand(opts, runtime) {
	const gatewayCleanup = await maybeRunGatewayCleanup(opts);
	if (gatewayCleanup.delegated) {
		const partialError = "partialError" in gatewayCleanup.result ? gatewayCleanup.result.partialError : void 0;
		if (opts.json) {
			writeRuntimeJson(runtime, gatewayCleanup.result);
			if (partialError) process.exitCode = 1;
			return;
		}
		renderAppliedSummaries({
			summaries: "stores" in gatewayCleanup.result ? gatewayCleanup.result.stores : [gatewayCleanup.result],
			runtime,
			locallyOwned: false
		});
		if (partialError) {
			runtime.error(`[error] ${partialError.message}`);
			process.exitCode = 1;
		}
		return;
	}
	const cfg = getRuntimeConfig();
	const cleanupParams = {
		cfg,
		opts,
		targets: resolveCommandSessionStoreTargets({
			cfg,
			opts
		})
	};
	let cleanupResult;
	if (opts.dryRun) cleanupResult = await runSessionsCleanup(cleanupParams);
	else {
		const { runLocalSessionsCleanup } = await import("./sessions-cleanup.runtime.js");
		cleanupResult = await runLocalSessionsCleanup(cleanupParams, runtime);
	}
	const { mode, previewResults, appliedSummaries, failure } = cleanupResult;
	if (opts.dryRun) {
		if (opts.json) {
			writeRuntimeJson(runtime, serializeSessionCleanupResult({
				mode,
				dryRun: true,
				summaries: previewResults.map((result) => toDisplayedCleanupSummary(result.summary))
			}));
			return;
		}
		for (const [i, result] of previewResults.entries()) {
			if (i > 0) runtime.log("");
			renderStoreDryRunPlan({
				cfg,
				summary: result.summary,
				actionRows: buildActionRows(result),
				runtime,
				showAgentHeader: previewResults.length > 1
			});
		}
		return;
	}
	if (opts.json) {
		writeRuntimeJson(runtime, serializeSessionCleanupResult({
			mode,
			dryRun: false,
			summaries: appliedSummaries.map(toDisplayedCleanupSummary),
			failure
		}));
		if (failure) process.exitCode = 1;
		return;
	}
	renderAppliedSummaries({
		summaries: appliedSummaries,
		runtime,
		locallyOwned: true
	});
	if (failure) {
		runtime.error(`[error] ${failure.message}`);
		process.exitCode = 1;
	}
}
//#endregion
export { sessionsCleanupCommand };
