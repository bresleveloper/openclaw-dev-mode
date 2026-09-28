import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { n as formatConfigIssueLines } from "./issue-format-BQNShMey.mjs";
import { n as getSystemdCgroupHygieneSummary } from "./service-runtime-BuDPZetd.mjs";
import { t as formatRuntimeStatusWithDetails } from "./runtime-status-BcdkhQrJ.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import "./text-format-D_7c--rP.mjs";
import { n as buildStatusOverviewSurfaceRows, t as buildGatewayStatusJsonPayload } from "./format-cO7JsqTm.mjs";
//#region src/commands/status-overview-surface.ts
/** Converts the full status scan result into the shared overview surface. */
function buildStatusOverviewSurfaceFromScan(params) {
	return {
		cfg: params.scan.cfg,
		update: params.scan.update,
		tailscaleMode: params.scan.tailscaleMode,
		tailscaleDns: params.scan.tailscaleDns,
		tailscaleHttpsUrl: params.scan.tailscaleHttpsUrl,
		...params.scan.advertisedControlUiLinks ? { advertisedControlUiLinks: params.scan.advertisedControlUiLinks } : {},
		gatewayMode: params.scan.gatewayMode,
		remoteUrlMissing: params.scan.remoteUrlMissing,
		gatewayConnection: params.scan.gatewayConnection,
		gatewayReachable: params.scan.gatewayReachable,
		gatewayProbe: params.scan.gatewayProbe,
		gatewayProbeAuth: params.scan.gatewayProbeAuth,
		gatewayProbeAuthWarning: params.scan.gatewayProbeAuthWarning,
		gatewaySelf: params.scan.gatewaySelf,
		gatewayService: params.gatewayService,
		nodeService: params.nodeService,
		nodeOnlyGateway: params.nodeOnlyGateway
	};
}
/** Converts the lighter status-all overview scan into the shared overview surface. */
function buildStatusOverviewSurfaceFromOverview(params) {
	return buildStatusOverviewSurfaceFromScan({
		scan: {
			...params.overview,
			...params.overview.gatewaySnapshot
		},
		gatewayService: params.gatewayService,
		nodeService: params.nodeService,
		nodeOnlyGateway: params.nodeOnlyGateway
	});
}
/** Builds overview rows from an already-normalized surface. */
function buildStatusOverviewRowsFromSurface(params) {
	const { surface, ...options } = params;
	return buildStatusOverviewSurfaceRows({
		...surface,
		...options
	});
}
/** Builds the gateway JSON payload from the gateway portion of an overview surface. */
function buildStatusGatewayJsonPayloadFromSurface(params) {
	return buildGatewayStatusJsonPayload(params.surface);
}
//#endregion
//#region src/commands/status.format.ts
const formatKTokens = formatTokenCount;
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
	if (used == null) result = ctx ? `unknown/${formatKTokens(ctx)} (?%)` : "unknown used";
	else if (!ctx) result = `${formatKTokens(used)} used`;
	else {
		const pctLabel = sess.percentUsed != null ? `${sess.percentUsed}%` : "?%";
		result = `${formatKTokens(used)}/${formatKTokens(ctx)} (${pctLabel})`;
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
	if (cacheStats.cacheRead > 0) parts.push(`read ${formatKTokens(cacheStats.cacheRead)}`);
	if (cacheStats.cacheWrite > 0) parts.push(`write ${formatKTokens(cacheStats.cacheWrite)}`);
	return parts.join(" · ");
};
function resolvePromptCacheStats(sess) {
	const cacheRead = typeof sess.cacheRead === "number" && Number.isFinite(sess.cacheRead) && sess.cacheRead >= 0 ? sess.cacheRead : 0;
	const cacheWrite = typeof sess.cacheWrite === "number" && Number.isFinite(sess.cacheWrite) && sess.cacheWrite >= 0 ? sess.cacheWrite : 0;
	if (cacheRead <= 0 && cacheWrite <= 0) return null;
	const inputTokens = typeof sess.inputTokens === "number" && Number.isFinite(sess.inputTokens) && sess.inputTokens >= 0 ? sess.inputTokens : void 0;
	const promptTokensFromParts = inputTokens != null ? inputTokens + cacheRead + cacheWrite : void 0;
	const used = sess.totalTokens;
	const total = promptTokensFromParts ?? (typeof used === "number" && Number.isFinite(used) && used > 0 ? Math.max(used, cacheRead + cacheWrite) : cacheRead + cacheWrite);
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
export { formatTokensCompact as a, buildStatusOverviewSurfaceFromOverview as c, formatStatusConfigDiagnosticEntries as i, buildStatusOverviewSurfaceFromScan as l, formatKTokens as n, buildStatusGatewayJsonPayloadFromSurface as o, formatPromptCacheCompact as r, buildStatusOverviewRowsFromSurface as s, formatDaemonRuntimeShort as t };
