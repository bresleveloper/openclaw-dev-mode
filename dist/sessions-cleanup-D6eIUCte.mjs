import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { c as visibleWidth } from "./ansi-BeFJ0Uu7.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { f as isImplicitLocalGatewayTarget, r as callGateway, t as buildGatewayConnectionDetails } from "./call-DnqhP17M.mjs";
import "./sessions-D_sxp1B4.mjs";
import { a as isSessionsCleanupPartialResult, n as runSessionsCleanup, o as serializeSessionCleanupResult } from "./cleanup-service-C56WP_MJ.mjs";
import { t as resolveSessionCleanupAction } from "./cleanup-action-DbpPRj6_.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-CvWMfO8o.mjs";
import { t as resolveGatewayMutationFallback } from "./call-mutation-fallback-Do1xJ6FB.mjs";
import { t as resolveCommandSessionStoreTargets } from "./session-store-targets-CmuVIFk-.mjs";
import { c as resolveSessionDisplayModelRef, i as formatSessionModelCell, n as formatSessionFlagsCell, o as toSessionDisplayRows, r as formatSessionKeyCell, t as formatSessionAgeCell } from "./sessions-table-BiEQvmX_.mjs";
//#region src/commands/sessions-cleanup.ts
function formatCleanupActionCell(action, rich) {
	if (!rich) return action;
	if (action === "keep") return theme.muted(action);
	if (action === "archive-dashboard" || action === "archive-cap" || action === "archive-age" || action === "prune-model-run" || action === "prune-stale" || action === "retire-dm-scope") return theme.warn(action);
	if (action === "cap-overflow") return theme.accentBright(action);
	return theme.error(action);
}
function buildActionRows(params) {
	return toSessionDisplayRows(params.beforeStore).map((row) => Object.assign({}, row, {
		label: params.beforeStore[row.key]?.label,
		action: resolveSessionCleanupAction({
			...params,
			key: row.key
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
			model: formatSessionModelCell(resolveSessionDisplayModelRef(params.cfg, row).model, rich),
			flags: formatSessionFlagsCell(row, rich)
		}))
	}).trimEnd());
	renderLabelSummaries({
		actionRows: params.actionRows,
		runtime: params.runtime
	});
}
function renderAppliedResult(result, runtime, json) {
	const partialError = "partialError" in result ? result.partialError : void 0;
	if (json) writeRuntimeJson(runtime, result);
	else {
		renderAppliedSummaries("stores" in result ? result.stores : [result], runtime);
		if (partialError) runtime.error(`[error] ${partialError.message}`);
	}
	if (partialError) process.exitCode = 1;
}
function renderAppliedSummaries(summaries, runtime) {
	for (const [i, summary] of summaries.entries()) {
		if (i > 0) runtime.log("");
		if (summaries.length > 1) runtime.log(`Agent: ${summary.agentId}`);
		runtime.log(`Session store: ${summary.storePath}`);
		runtime.log(`Applied maintenance. Current entries: ${summary.appliedCount ?? 0}`);
		if (summary.unreferencedArtifacts?.removedFiles) runtime.log(`Pruned unreferenced artifacts: ${summary.unreferencedArtifacts.removedFiles}`);
	}
}
async function maybeRunGatewayCleanup(opts, cfg) {
	if (opts.store !== void 0 || opts.dryRun) return { delegated: false };
	const { url } = buildGatewayConnectionDetails({ config: cfg });
	const localTarget = await isImplicitLocalGatewayTarget({ config: cfg });
	try {
		return {
			delegated: true,
			result: await callGateway({
				config: cfg,
				expectUrl: url,
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
		if (resolveGatewayMutationFallback({
			error,
			localTarget
		}) === "unreachable") return { delegated: false };
		if (isRecord(error) && isSessionsCleanupPartialResult(error.details)) return {
			delegated: true,
			result: error.details
		};
		throw error;
	}
}
/** Runs session cleanup, optionally using the live gateway for active stores. */
async function sessionsCleanupCommand(opts, runtime) {
	const cfg = getRuntimeConfig();
	const gatewayCleanup = await maybeRunGatewayCleanup(opts, cfg);
	if (gatewayCleanup.delegated) {
		renderAppliedResult(gatewayCleanup.result, runtime, opts.json);
		return;
	}
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
				summaries: previewResults.map((result) => result.summary)
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
	renderAppliedResult(serializeSessionCleanupResult({
		mode,
		dryRun: false,
		summaries: appliedSummaries,
		failure
	}), runtime, opts.json);
}
//#endregion
export { sessionsCleanupCommand };
