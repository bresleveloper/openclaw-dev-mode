import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { r as isAcknowledgedAbandonedUpdateRun } from "./update-run-record-Cu3LgwJt.mjs";
import "./update-run-ledger-jBhhLo0P.mjs";
import { a as getUpdateRunAsync, i as getUpdateRun } from "./update-run-reader-B7x8dkVs.mjs";
import { a as renderUpdateRunReport, l as updateRunReportInputFromSentinel, o as resolveUpdateRunIdentity } from "./update-run-report-C8yK_gib.mjs";
import { t as readUpdateRunStatus } from "./update-run-status-CM6y9pqw.mjs";
//#region src/commands/status-update-restart.ts
function renderStatusReport(run, opts = {}) {
	const report = renderUpdateRunReport(run);
	const reconciled = isAcknowledgedAbandonedUpdateRun(run);
	const rollbackAttempted = run.verification.recovery?.packageRollbackVerified === true || run.verification.rollbackOutcome?.status === "succeeded" || run.verification.rollbackOutcome?.status === "failed";
	const verifiedVersion = !rollbackAttempted && run.verification.versionMatch === true ? normalizeOptionalString(run.verification.runningVersion) : void 0;
	const beforeVersion = normalizeOptionalString(run.before.version);
	const afterVersion = normalizeOptionalString(run.after.version);
	const explicitTargetVersion = normalizeOptionalString(run.target?.version) ?? normalizeOptionalString(run.origin.admission?.candidateVersion);
	const afterIdentityAvailable = (!rollbackAttempted || Boolean(explicitTargetVersion && beforeVersion && explicitTargetVersion !== beforeVersion && afterVersion === explicitTargetVersion)) && resolveUpdateRunIdentity(run.verification, run.after).kind !== "unavailable";
	const targetVersion = explicitTargetVersion ?? (afterIdentityAvailable ? afterVersion : void 0) ?? verifiedVersion;
	const targetBuild = (afterIdentityAvailable && (!afterVersion || afterVersion === targetVersion) ? normalizeOptionalString(run.after.buildId) : void 0) ?? (verifiedVersion === targetVersion && verifiedVersion ? normalizeOptionalString(run.verification.runningBuildId) : void 0);
	const servingVersion = normalizeOptionalString(opts.gatewayServer?.version);
	const servingBuild = normalizeOptionalString(opts.gatewayServer?.buildId);
	const buildMismatch = Boolean(targetBuild && servingBuild && targetBuild !== servingBuild);
	const previousVersion = beforeVersion ?? afterVersion;
	const targetIdentityUnavailable = !afterIdentityAvailable && targetVersion === afterVersion || rollbackAttempted && (!previousVersion || targetVersion === previousVersion);
	const observedFailure = run.status === "failed" && !reconciled && opts.localGatewayHealthy;
	const historicalFailure = Boolean(observedFailure && targetVersion && servingVersion === targetVersion && !buildMismatch && !targetIdentityUnavailable);
	const message = run.status === "failed" && !reconciled ? run.steps.filter((step) => step.status === "failed").flatMap((step) => step.failureFacts ?? []).find((fact) => fact.message)?.message : void 0;
	let headline = message ? `${report.headline} ${message}` : report.headline;
	const servingLabel = sanitizeTerminalText(servingVersion ?? "an unknown version").slice(0, 240);
	const targetLabel = sanitizeTerminalText(targetVersion ?? "an unknown target").slice(0, 240);
	if (historicalFailure) headline = `Last update run failed (${sanitizeTerminalText(run.reason?.trim() || "unknown reason").slice(0, 240)}) — Gateway is serving ${servingLabel}; run \`openclaw update\` to clear the record.`;
	else if (observedFailure) {
		const current = (buildMismatch || targetIdentityUnavailable) && servingBuild ? `${servingLabel} (build ${sanitizeTerminalText(servingBuild).slice(0, 240)})` : servingLabel;
		const target = buildMismatch && targetBuild ? `${targetLabel} (build ${sanitizeTerminalText(targetBuild).slice(0, 240)})` : targetLabel;
		const detail = !targetVersion ? `Gateway is serving ${current}; the update target is unknown` : !servingVersion ? `Gateway serving version is unknown; the update to ${target} is unverified` : targetIdentityUnavailable ? `Gateway is still serving ${current}; the intended build for ${target} is unverified` : `Gateway is still serving ${current}; the update to ${target} did not complete`;
		headline += `\n${detail} — run \`openclaw update\`.`;
	}
	return {
		...report,
		reconciled,
		historicalFailure,
		headline
	};
}
function readReport(payload, opts = {}) {
	return renderStatusReport((payload.stats?.runId ? getUpdateRun(payload.stats.runId) : void 0) ?? updateRunReportInputFromSentinel(payload), opts);
}
function formatUpdateRestartStatusValue(payload, opts = {}) {
	if (!payload || payload.kind !== "update") return null;
	return formatUpdateRestartReport(payload, readReport(payload, opts), opts);
}
function formatUpdateRestartReport(payload, { headline, reconciled, historicalFailure }, opts) {
	const format = reconciled || historicalFailure ? opts.muted : payload.status === "error" ? opts.warn : payload.status === "ok" ? opts.ok : opts.muted;
	return format ? format(headline) : headline;
}
/** Keep recorded progress and history separate from the current installation's update check. */
async function buildStatusUpdateRows(payload, opts = {}) {
	const history = await readUpdateRunStatus();
	if ("runStatusError" in history) return [{
		Item: "Update run",
		Value: `Update run status unavailable: ${history.runStatusError}`
	}];
	const run = history.activeRun ?? history.lastRun;
	const rows = run ? [{
		Item: "Update run",
		Value: renderStatusReport(run, opts).headline
	}] : [];
	if (history.runReconciliationError) rows.push({
		Item: "Update reconciliation",
		Value: `Update run reconciliation failed: ${history.runReconciliationError}`
	});
	for (const advisory of history.advisories ?? []) rows.push({
		Item: "Update advisory",
		Value: advisory.message
	});
	if (payload?.kind === "update" && (!run || payload.stats?.runId !== run.runId)) {
		const restart = formatUpdateRestartReport(payload, renderStatusReport((payload.stats?.runId ? await getUpdateRunAsync(payload.stats.runId) : void 0) ?? updateRunReportInputFromSentinel(payload), opts), opts);
		if (restart) rows.push({
			Item: "Update restart",
			Value: restart
		});
	}
	return rows;
}
function formatUpdateRestartActionLines(payload) {
	return payload?.kind === "update" ? readReport(payload).lines : [];
}
//#endregion
export { formatUpdateRestartActionLines as n, formatUpdateRestartStatusValue as r, buildStatusUpdateRows as t };
