import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { n as formatConfigIssueLines } from "./issue-format-L1jxHK43.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as formatRuntimeStatusWithDetails } from "./runtime-status-O5-ejGpl.mjs";
import { n as getSystemdCgroupHygieneSummary } from "./service-runtime-Cbp6mAbj.mjs";
import { t as formatTokenCount } from "./token-format-BRba24iW.mjs";
//#region src/commands/status.format.ts
/** Formats the actionable entries shown under status config diagnostic headings. */
const formatStatusConfigDiagnosticEntries = (diagnostics) => [
	`- Config file is invalid: ${sanitizeTerminalText(diagnostics.path)}`,
	...formatConfigIssueLines(diagnostics.issues, "-", { normalizeRoot: true }),
	`- Fix: ${formatCliCommand("openclaw doctor --fix")}`
];
/** Formats session token usage and prompt-cache hit rate for the sessions table. */
const formatTokensCompact = (sess) => {
	const used = sess.totalTokens;
	const ctx = sess.contextTokens;
	let result;
	if (used == null) result = ctx ? `unknown/${formatTokenCount(ctx)} (?%)` : "unknown used";
	else if (!ctx) result = `${formatTokenCount(used)} used`;
	else {
		const pctLabel = sess.percentUsed != null ? `${sess.percentUsed}%` : "?%";
		result = `${formatTokenCount(used)}/${formatTokenCount(ctx)} (${pctLabel})`;
	}
	const cacheStats = resolvePromptCacheStats(sess);
	if (cacheStats && cacheStats.cacheRead > 0) result += ` · 🗄️ ${cacheStats.hitRate}% cached`;
	return result;
};
/** Formats prompt-cache details for verbose sessions table output. */
const formatPromptCacheCompact = (sess) => {
	const cacheStats = resolvePromptCacheStats(sess);
	if (!cacheStats) return "";
	const parts = [`${cacheStats.hitRate}% hit`];
	if (cacheStats.cacheRead > 0) parts.push(`read ${formatTokenCount(cacheStats.cacheRead)}`);
	if (cacheStats.cacheWrite > 0) parts.push(`write ${formatTokenCount(cacheStats.cacheWrite)}`);
	return parts.join(" · ");
};
function resolvePromptCacheStats(sess) {
	const cacheRead = asNonNegativeFiniteNumber(sess.cacheRead) ?? 0;
	const cacheWrite = asNonNegativeFiniteNumber(sess.cacheWrite) ?? 0;
	if (cacheRead <= 0 && cacheWrite <= 0) return null;
	const inputTokens = asNonNegativeFiniteNumber(sess.inputTokens);
	const total = (inputTokens != null ? inputTokens + cacheRead + cacheWrite : void 0) ?? Math.max(asPositiveFiniteNumber(sess.totalTokens) ?? 0, cacheRead + cacheWrite);
	return {
		cacheRead,
		cacheWrite,
		hitRate: total > 0 ? Math.round(cacheRead / total * 100) : 0
	};
}
/** Formats daemon runtime status plus launchd/systemd details into one compact string. */
const formatDaemonRuntimeShort = (runtime) => {
	if (!runtime) return null;
	const details = [];
	const detail = runtime.inspectionFailure ? "" : runtime.detail?.replace(/\s+/g, " ").trim() || "";
	const noisyLaunchctlDetail = runtime.missingUnit === true && normalizeLowercaseStringOrEmpty(detail).includes("could not find service");
	if (detail && !noisyLaunchctlDetail) details.push(detail);
	const cgroupSummary = getSystemdCgroupHygieneSummary(runtime.systemd);
	if (cgroupSummary) details.push(cgroupSummary);
	return formatRuntimeStatusWithDetails({
		status: runtime.status,
		pid: runtime.pid,
		state: runtime.state,
		details
	});
};
//#endregion
export { formatTokensCompact as i, formatPromptCacheCompact as n, formatStatusConfigDiagnosticEntries as r, formatDaemonRuntimeShort as t };
