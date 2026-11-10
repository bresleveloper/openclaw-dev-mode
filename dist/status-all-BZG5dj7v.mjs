import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as extractBalancedJsonPrefix } from "./src-Djeo9OvP.mjs";
import { n as safeParseJsonRecord, t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { b as resolveGatewayPort } from "./paths-orClZ-2Z.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-C4n2JwGL.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-DZuGS_2S.mjs";
import { t as formatConfigIssueLine } from "./issue-format-Cu1pIc3h.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import { g as resolveGatewayBindHost, v as resolveGatewayRequiredListenHosts } from "./net-CjQwRK-V.mjs";
import { c as classifyOAuthRefreshFailureReason } from "./oauth-refresh-failure-H1_-S915.mjs";
import "./config-B3oiWDlr.mjs";
import { n as isRich, r as theme } from "./theme-DzaUZY4q.mjs";
import { i as loadExecApprovalsReadOnly } from "./exec-approvals-store-BhzM_h1C.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { a as resolveNodeExecEligibility } from "./exec-defaults-DrIV-0KT.mjs";
import { t as getRemoteSkillEligibility } from "./remote-CgYoyov-.mjs";
import { a as resolveGatewayRestartLogPath, i as resolveGatewayLogPaths, o as resolveGatewaySupervisorLogPaths } from "./restart-logs-BvcN3lrf.mjs";
import { a as isExpectedGatewayListeners, i as isDualStackLoopbackGatewayListeners, n as classifyPortListener, r as formatPortDiagnostics } from "./ports-format-Bal9BDTl.mjs";
import { n as inspectPortUsage } from "./ports-inspect-BaO1UeCS.mjs";
import { C as summarizeRestartSentinel, g as readRestartSentinelReadOnly } from "./restart-sentinel-BPoW-ukG.mjs";
import "./ports-DJFh3m9j.mjs";
import { n as formatTimeAgo } from "./format-relative-DP9tOdyD.mjs";
import { r as withProgress } from "./progress-BIOeyA3T.mjs";
import { t as getTerminalTableWidth } from "./table-BerrlExF.mjs";
import { t as formatUsageReportLines } from "./provider-usage.format-L6iA6HgQ.mjs";
import { c as withPluginDiagnosticsReport, n as buildPluginCompatibilityNotices } from "./status-CN_6liYz.mjs";
import { t as formatPluginCompatibilityNotice } from "./status-compatibility-nnuIczdT.mjs";
import { n as readLastGatewayErrorLine, t as readGatewayLogTailLines } from "./diagnostics-C6iLfgwI.mjs";
import { s as countActiveStatusAgents } from "./status-overview-values-BLl1cohv.mjs";
import { t as buildWorkspaceSkillReadiness } from "./status-DQx5F0If.mjs";
import { r as formatDeliveryQueueHealthLine } from "./health-format-kb2RlIZF.mjs";
import { n as resolveStatusAllConnectionDetails } from "./status.gateway-connection-DorgUvdO.mjs";
import { t as formatTelemetryExporterSummary } from "./telemetry-exporter-summary-hE_Zbl7m.mjs";
import { i as redactStatusSecrets } from "./format-DvaI7amh.mjs";
import { r as formatStatusConfigDiagnosticEntries } from "./status.format-Ck3YNhmg.mjs";
import { a as buildStatusChannelDetailSections, c as buildStatusChannelsTableRows, i as buildStatusAgentTableRows, l as statusChannelsTableColumns, o as statusAgentsTableColumns, r as appendStatusReportTable, s as statusOverviewTableColumns, t as appendStatusReportHeading, u as buildStatusAllOverviewRows } from "./text-report-Tj5UevAq.mjs";
import { c as resolveStatusUsageSummary, i as resolveStatusGatewayHealthSafe, n as resolveStatusGatewayDiagnosticsSafe, s as resolveStatusServiceSummaries, t as reportStatusScanFailure } from "./status-runtime-shared-CwX47JnZ.mjs";
import { n as resolveStatusGatewayProbeTimeoutMs } from "./status.gateway-probe-budget-DyNYY-tA.mjs";
import { n as formatUpdateRestartActionLines, r as formatUpdateRestartStatusValue, t as buildStatusUpdateRows } from "./status-update-restart-DSS3uNaX.mjs";
import { n as resolveStatusSummaryFromOverview, t as collectStatusScanOverview } from "./status.scan-overview-pEiu6_8P.mjs";
import { t as resolveNodeOnlyGatewayInfo } from "./status.node-mode-Cz6a0SWd.mjs";
//#region src/commands/status-all/report-data.ts
async function resolveStatusAllLocalDiagnosis(params) {
	const { overview } = params;
	const { gatewayReachable, gatewayProbe, gatewayCallOverrides } = overview.gatewaySnapshot;
	const snap = await readConfigFileSnapshot({ observe: false }).catch(() => null);
	const configPath = snap?.path?.trim() || "(unknown config path)";
	const diagnosticsParams = {
		config: overview.cfg,
		gatewayProbeDeadlineMs: params.gatewayProbeDeadlineMs,
		timeoutMs: Math.min(5e3, params.timeoutMs ?? 1e4),
		gatewayReachable,
		...gatewayCallOverrides ? { callOverrides: gatewayCallOverrides } : {}
	};
	const [health, deliveryDiagnostics, exporterDiagnostics] = params.nodeOnlyGateway || gatewayProbe?.startupPhase ? [
		void 0,
		null,
		null
	] : await Promise.all([
		resolveStatusGatewayHealthSafe({
			...diagnosticsParams,
			timeoutMs: Math.min(8e3, params.timeoutMs ?? 1e4),
			gatewayProbeError: gatewayProbe?.error ?? null
		}),
		resolveStatusGatewayDiagnosticsSafe(diagnosticsParams),
		resolveStatusGatewayDiagnosticsSafe({
			...diagnosticsParams,
			type: "telemetry.exporter"
		})
	]);
	params.progress.setLabel("Checking local state…");
	const sentinel = await readRestartSentinelReadOnly().catch(() => null);
	const lastErr = await readLastGatewayErrorLine(process.env).catch(() => null);
	const port = resolveGatewayPort(overview.cfg);
	const bindHost = await resolveGatewayBindHost(overview.cfg.gateway?.bind ?? "loopback", overview.cfg.gateway?.customBindHost);
	const portUsage = await inspectPortUsage(port, { probeHosts: resolveGatewayRequiredListenHosts(bindHost) }).catch(() => null);
	params.progress.tick();
	const controlPlaneWorkspace = resolvePluginControlPlaneWorkspace({
		config: overview.cfg,
		env: process.env
	});
	const defaultWorkspace = controlPlaneWorkspace.workspaceDir ?? null;
	let skillReadiness = null;
	if (defaultWorkspace != null) try {
		const nodeSkills = resolveNodeExecEligibility({
			cfg: overview.cfg,
			execApprovals: loadExecApprovalsReadOnly(),
			agentId: controlPlaneWorkspace.agentId
		});
		skillReadiness = buildWorkspaceSkillReadiness(defaultWorkspace, {
			config: overview.cfg,
			agentId: controlPlaneWorkspace.agentId,
			eligibility: {
				nodeSkills,
				remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
			}
		});
	} catch {}
	const pluginCompatibility = await withPluginDiagnosticsReport({ config: overview.cfg }, (report) => buildPluginCompatibilityNotices({ report }));
	return {
		configPath,
		diagnosis: {
			snap,
			remoteUrlMissing: overview.gatewaySnapshot.remoteUrlMissing,
			secretDiagnostics: overview.secretDiagnostics,
			sentinel,
			lastErr,
			port,
			portUsage,
			tailscaleMode: overview.tailscaleMode,
			tailscaleDns: overview.tailscaleDns,
			tailscaleHttpsUrl: overview.tailscaleHttpsUrl,
			skillReadiness,
			pluginCompatibility,
			channelsStatus: overview.channelsStatus,
			channelIssues: overview.channelIssues,
			agentStatus: overview.agentStatus,
			gatewayReachable,
			gatewayStartupPhase: gatewayProbe?.startupPhase,
			localGatewayHealthy: overview.gatewaySnapshot.localGatewayHealthy === true && !(health && "error" in health),
			gatewayServer: gatewayProbe?.server,
			health,
			deliveryDiagnostics,
			exporterDiagnostics,
			nodeOnlyGateway: params.nodeOnlyGateway
		}
	};
}
async function buildStatusAllReportData(params) {
	const gatewaySnapshot = params.overview.gatewaySnapshot;
	const [{ configPath, diagnosis }, summary] = await Promise.all([resolveStatusAllLocalDiagnosis(params), params.overview.runtimeDegradation ?? resolveStatusSummaryFromOverview({ overview: params.overview })]);
	const overviewSurface = {
		...params.overview,
		...gatewaySnapshot,
		gatewayService: params.daemon,
		nodeService: params.nodeService,
		nodeOnlyGateway: params.nodeOnlyGateway
	};
	const overviewRows = buildStatusAllOverviewRows({
		surface: overviewSurface,
		osLabel: params.overview.osSummary.label,
		configPath,
		summary,
		secretDiagnosticsCount: params.overview.secretDiagnostics.length,
		updateRows: await buildStatusUpdateRows(diagnosis.sentinel?.payload, {
			localGatewayHealthy: diagnosis.localGatewayHealthy,
			gatewayServer: diagnosis.gatewayServer
		}),
		agentStatus: params.overview.agentStatus
	});
	return {
		configDiagnostics: params.overview.configDiagnostics,
		overviewRows,
		channels: params.overview.channels,
		channelIssues: params.overview.channelIssues.map((issue) => ({
			channel: issue.channel,
			message: issue.message
		})),
		agentStatus: params.overview.agentStatus,
		connectionDetailsForReport: resolveStatusAllConnectionDetails({
			nodeOnlyGateway: params.nodeOnlyGateway,
			remoteUrlMissing: gatewaySnapshot.remoteUrlMissing,
			gatewayConnection: gatewaySnapshot.gatewayConnection,
			bindMode: params.overview.cfg.gateway?.bind ?? "loopback",
			configPath
		}),
		diagnosis
	};
}
//#endregion
//#region src/commands/status-all/gateway.ts
/** Reads the last non-empty lines from a gateway log file, returning an empty list on read failure. */
async function readFileTailLines(filePath, maxLines) {
	const lines = await readGatewayLogTailLines(filePath).catch(() => []);
	return lines.slice(Math.max(0, lines.length - maxLines)).map((line) => line.trimEnd()).filter((line) => line.trim().length > 0);
}
function shorten(message, maxLen) {
	const cleaned = message.replace(/\s+/g, " ").trim();
	if (cleaned.length <= maxLen) return cleaned;
	return `${truncateUtf16Safe(cleaned, Math.max(0, maxLen - 1))}…`;
}
function normalizeGwsLine(line) {
	return line.replace(/\s+(?:runId|conn|id)=[^\s]+/g, "").replace(/\s+error=Error:.*$/g, "").trim();
}
function consumeJsonBlock(lines, startIndex) {
	const startLine = lines[startIndex] ?? "";
	const braceAt = startLine.indexOf("{");
	if (braceAt < 0) return null;
	const raw = [startLine.slice(braceAt), ...lines.slice(startIndex + 1)].join("\n");
	const fragment = extractBalancedJsonPrefix(raw);
	if (!fragment) return {
		json: raw,
		endIndex: lines.length - 1
	};
	const consumedLineOffset = fragment.json.split("\n").length - 1;
	return {
		json: fragment.json,
		endIndex: startIndex + consumedLineOffset
	};
}
function summarizeLogTail(rawLines, opts) {
	const maxLines = Math.max(6, opts?.maxLines ?? 26);
	const out = [];
	const groups = /* @__PURE__ */ new Map();
	const addGroup = (key, base) => {
		const existing = groups.get(key);
		if (existing) {
			existing.count += 1;
			return;
		}
		groups.set(key, {
			count: 1,
			index: out.length,
			base
		});
		out.push(base);
	};
	const lines = rawLines.map((line) => line.trimEnd()).filter(Boolean);
	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i] ?? "";
		const trimmedStart = line.trimStart();
		if (trimmedStart.startsWith("\"") || trimmedStart.startsWith("}") || trimmedStart.startsWith("{") && !safeParseJsonRecord(trimmedStart)) continue;
		const tokenRefresh = line.match(/^\[([^\]]+)\]\s+Token refresh failed:\s*(\d+)(?:\s+(\{.*))?\s*$/);
		if (tokenRefresh) {
			const tag = tokenRefresh[1] ?? "unknown";
			const status = tokenRefresh[2] ?? "unknown";
			const block = consumeJsonBlock(lines, i);
			if (block) {
				i = block.endIndex;
				const parsed = safeParseJson(block.json) ?? null;
				const code = normalizeOptionalString(parsed?.error?.code) ?? null;
				const msg = normalizeOptionalString(parsed?.error?.message) ?? null;
				const refreshReason = classifyOAuthRefreshFailureReason(msg ?? "");
				const msgShort = msg ? refreshReason ? "re-auth required" : shorten(msg, 52) : null;
				const base = `[${tag}] token refresh ${status}${code ? ` ${code}` : ""}${msgShort ? ` · ${msgShort}` : ""}`;
				addGroup(`token:${tag}:${status}:${code ?? ""}:${msgShort ?? ""}`, base);
				continue;
			}
		}
		const embedded = line.match(/^Embedded agent failed before reply:\s+OAuth token refresh failed for ([^:]+):/);
		if (embedded) {
			const provider = normalizeOptionalString(embedded[1]) || "unknown";
			addGroup(`embedded:${provider}`, `Embedded agent: OAuth token refresh failed (${provider})`);
			continue;
		}
		if (line.startsWith("[gws]") && line.includes("errorCode=UNAVAILABLE") && line.includes("OAuth token refresh failed")) {
			const normalized = normalizeGwsLine(line);
			addGroup(`gws:${normalized}`, normalized);
			continue;
		}
		out.push(line);
	}
	for (const g of groups.values()) {
		if (g.count <= 1) continue;
		out[g.index] = `${g.base} ×${g.count}`;
	}
	const deduped = out.filter((line, index) => index === 0 || line !== out[index - 1]);
	if (deduped.length <= maxLines) return deduped;
	const head = Math.min(6, Math.floor(maxLines / 3));
	const tail = Math.max(1, maxLines - head - 1);
	return [
		...deduped.slice(0, head),
		`… ${deduped.length - head - tail} lines omitted …`,
		...deduped.slice(-tail)
	];
}
//#endregion
//#region src/commands/status-all/diagnosis.ts
const AGENT_ACTIVITY_SOFT_WARNING_MS = 18e5;
function countGatewayListenerPids(portUsage) {
	const pids = /* @__PURE__ */ new Set();
	for (const listener of portUsage.listeners) {
		if (classifyPortListener(listener) !== "gateway") continue;
		if (typeof listener.pid === "number" && Number.isFinite(listener.pid)) pids.add(listener.pid);
	}
	return pids.size;
}
function isDeliveryDiagnosticsLike(value) {
	return Boolean(value && typeof value === "object");
}
function countDeliveryEvent(snapshot, type) {
	const value = snapshot.summary?.byType?.[type];
	return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
function latestDeliveryEventAgeMs(snapshot) {
	const latestTs = (snapshot.events ?? []).filter((event) => [
		"message.received",
		"message.dispatch.started",
		"message.dispatch.completed",
		"session.turn.created",
		"message.processed"
	].includes(event.type ?? "")).reduce((max, event) => {
		const ts = event.ts;
		return typeof ts === "number" && Number.isFinite(ts) ? Math.max(max, ts) : max;
	}, 0);
	return latestTs > 0 ? Date.now() - latestTs : null;
}
async function appendStatusAllDiagnosis(params) {
	const { lines, muted, ok, warn, fail } = params;
	const emitDetail = (text) => lines.push(`  ${muted(text)}`);
	const emitLimited = (items, limit, format) => {
		for (const item of items.slice(0, limit)) lines.push(format(item));
		if (items.length > limit) emitDetail(`… +${items.length - limit} more`);
	};
	const emitCheck = (label, status) => {
		const decorate = status === "ok" ? ok : status === "warn" ? warn : fail;
		const icon = status === "ok" ? "✓" : status === "warn" ? "!" : "✗";
		lines.push(`${decorate(icon)} ${decorate(label)}`);
	};
	const emitUnavailableDiagnostics = (diagnostic) => {
		emitCheck(`${diagnostic.label}: unavailable`, "warn");
		emitDetail(sanitizeTerminalText(redactStatusSecrets(redactSensitiveUrlLikeString(diagnostic.detail))));
		emitDetail(`Retry: ${diagnostic.retry}`);
	};
	lines.push("");
	lines.push(muted("Gateway connection details:"));
	for (const line of redactStatusSecrets(params.connectionDetailsForReport).split("\n").map((l) => l.trimEnd())) emitDetail(line);
	lines.push("");
	if (params.snap) {
		const status = !params.snap.exists ? "fail" : params.snap.valid ? "ok" : "warn";
		emitCheck(`Config: ${params.snap.path ?? "(unknown)"}`, status);
		emitLimited(dedupeByKey([...params.snap.legacyIssues ?? [], ...params.snap.issues ?? []], (issue) => `${issue.path.length}:${issue.path}${issue.message}`), 12, (issue) => `  ${formatConfigIssueLine(issue, "-")}`);
	} else emitCheck("Config: read failed", "warn");
	if (params.remoteUrlMissing) {
		lines.push("");
		emitCheck("Gateway remote mode misconfigured (gateway.remote.url missing)", "warn");
		emitDetail("Fix: set gateway.remote.url, or set gateway.mode=local.");
	}
	emitCheck(`Secret diagnostics (${params.secretDiagnostics.length})`, params.secretDiagnostics.length === 0 ? "ok" : "warn");
	emitLimited(params.secretDiagnostics, 10, (diagnostic) => `  - ${muted(redactStatusSecrets(diagnostic))}`);
	if (params.sentinel?.payload) {
		emitCheck("Restart sentinel present", "warn");
		emitDetail(`${summarizeRestartSentinel(params.sentinel.payload)} · ${formatTimeAgo(Date.now() - params.sentinel.payload.ts)}`);
		const updateRestartValue = formatUpdateRestartStatusValue(params.sentinel.payload, {
			localGatewayHealthy: params.localGatewayHealthy,
			gatewayServer: params.gatewayServer
		});
		if (updateRestartValue) emitDetail(`Update restart: ${updateRestartValue}`);
		for (const line of formatUpdateRestartActionLines(params.sentinel.payload)) emitDetail(line);
	} else emitCheck("Restart sentinel: none", "ok");
	const lastErrClean = normalizeOptionalString(params.lastErr) ?? "";
	const isTrivialLastErr = lastErrClean.length < 8;
	if (lastErrClean && !isTrivialLastErr) {
		lines.push("");
		lines.push(muted("Recent Gateway log error (may be from an earlier run):"));
		emitDetail(redactStatusSecrets(lastErrClean));
	}
	if (params.portUsage) {
		const benignDualStackLoopback = isDualStackLoopbackGatewayListeners(params.portUsage.listeners, params.port);
		const expectedGatewayListeners = isExpectedGatewayListeners(params.portUsage.listeners, params.port);
		const portOk = params.portUsage.status === "free" || params.portUsage.status === "busy" && expectedGatewayListeners;
		emitCheck(`Port ${params.port}`, portOk ? "ok" : "warn");
		if (!portOk) {
			const gatewayPidCount = countGatewayListenerPids(params.portUsage);
			if (gatewayPidCount > 1) emitDetail(`${gatewayPidCount} OpenClaw gateway processes appear to be listening on port ${params.port}; stop stale gateway processes before trusting channel health.`);
			for (const line of formatPortDiagnostics(params.portUsage)) emitDetail(line);
		} else if (benignDualStackLoopback) emitDetail("Detected dual-stack loopback listeners (127.0.0.1 + ::1) for one gateway process.");
		else if (expectedGatewayListeners) emitDetail("Detected OpenClaw Gateway listener on the configured port.");
	}
	emitCheck(`Tailscale exposure: ${params.tailscaleMode} · daemon unknown${params.tailscaleDns ? ` · ${params.tailscaleDns}` : ""}`, params.tailscaleMode === "off" ? "ok" : "warn");
	if (params.tailscaleHttpsUrl) emitDetail(`https: ${params.tailscaleHttpsUrl}`);
	if (params.skillReadiness) {
		const { eligible, missing, workspaceDir } = params.skillReadiness;
		emitCheck(`Skills: ${eligible} eligible · ${missing} missing · ${workspaceDir}`, missing === 0 ? "ok" : "warn");
	}
	emitCheck(`Plugin compatibility (${params.pluginCompatibility.length || "none"})`, params.pluginCompatibility.length === 0 ? "ok" : "warn");
	emitLimited(params.pluginCompatibility, 12, (notice) => {
		return `  - [${notice.severity === "warn" ? "warn" : "info"}] ${formatPluginCompatibilityNotice(notice)}`;
	});
	if (params.agentStatus) {
		const recentSessions = countActiveStatusAgents({
			agentStatus: params.agentStatus,
			activeThresholdMs: AGENT_ACTIVITY_SOFT_WARNING_MS
		});
		const shouldWarn = params.agentStatus.totalSessions > 0 && recentSessions === 0;
		emitCheck(`Agent activity: ${recentSessions} active in 30m · ${params.agentStatus.totalSessions} sessions`, shouldWarn ? "warn" : "ok");
		if (shouldWarn) emitDetail("No agent session was updated in the last 30m; if channels received messages, verify inbound dispatch and turn creation.");
	}
	if (!params.nodeOnlyGateway && params.exporterDiagnostics) {
		if (params.exporterDiagnostics.ok) {
			const exporterSummary = formatTelemetryExporterSummary(params.exporterDiagnostics.value);
			if (exporterSummary) {
				emitCheck(exporterSummary.title, exporterSummary.status);
				for (const line of exporterSummary.lines) emitDetail(line);
			}
		} else emitUnavailableDiagnostics({
			label: "Telemetry exporters",
			detail: `Exporter diagnostics failed: ${params.exporterDiagnostics.error}`,
			retry: "openclaw gateway stability --type telemetry.exporter"
		});
	}
	if (!params.nodeOnlyGateway && params.deliveryDiagnostics) {
		const diagnostic = params.deliveryDiagnostics;
		if (!diagnostic.ok || !isDeliveryDiagnosticsLike(diagnostic.value)) emitUnavailableDiagnostics({
			label: "Inbound delivery telemetry",
			detail: diagnostic.ok ? "Delivery diagnostics returned an invalid response." : `Delivery diagnostics failed: ${diagnostic.error}`,
			retry: "openclaw gateway stability"
		});
		else {
			const deliveryDiagnostics = diagnostic.value;
			const received = countDeliveryEvent(deliveryDiagnostics, "message.received");
			const dispatchStarted = countDeliveryEvent(deliveryDiagnostics, "message.dispatch.started");
			const dispatchCompleted = countDeliveryEvent(deliveryDiagnostics, "message.dispatch.completed");
			const turnsCreated = countDeliveryEvent(deliveryDiagnostics, "session.turn.created");
			const processed = countDeliveryEvent(deliveryDiagnostics, "message.processed");
			const hasReceivedWithoutDispatch = received > 0 && dispatchStarted === 0 && processed === 0;
			const hasDispatchWithoutTurn = dispatchStarted > 0 && turnsCreated === 0 && processed < dispatchStarted;
			const hasDispatchGap = dispatchStarted - dispatchCompleted >= 2;
			const latestAgeMs = latestDeliveryEventAgeMs(deliveryDiagnostics);
			emitCheck(`Inbound delivery telemetry: received ${received} · dispatch ${dispatchStarted}/${dispatchCompleted} · turns ${turnsCreated} · processed ${processed}`, hasReceivedWithoutDispatch || hasDispatchWithoutTurn || hasDispatchGap ? "warn" : "ok");
			if (latestAgeMs != null) emitDetail(`latest delivery event: ${formatTimeAgo(latestAgeMs)}`);
			if (hasReceivedWithoutDispatch) emitDetail("Messages were received, but no gateway dispatch started; inspect inbound routing and dispatch handoff.");
			if (hasDispatchWithoutTurn) emitDetail("Gateway dispatch started, but no agent turn was created; inspect reply resolver and session creation.");
			if (hasDispatchGap) emitDetail("Multiple gateway dispatches have not completed yet; if this persists, inspect stuck sessions or model runs.");
		}
	}
	params.progress.setLabel("Reading logs…");
	const logPaths = (() => {
		try {
			return process.platform === "darwin" ? resolveGatewaySupervisorLogPaths(process.env) : resolveGatewayLogPaths(process.env);
		} catch {
			return null;
		}
	})();
	if (logPaths) {
		params.progress.setLabel("Reading logs…");
		const restartLogPath = resolveGatewayRestartLogPath(process.env);
		const readStderr = process.platform !== "darwin";
		const [stderrTail, stdoutTail, restartTail] = await Promise.all([
			readStderr ? readFileTailLines(logPaths.stderrPath, 40).catch(() => []) : [],
			readFileTailLines(logPaths.stdoutPath, 40).catch(() => []),
			readFileTailLines(restartLogPath, 30).catch(() => [])
		]);
		if (stderrTail.length > 0 || stdoutTail.length > 0) {
			lines.push("");
			lines.push(muted(`Gateway logs (tail, summarized): ${logPaths.logDir}`));
			for (const [stream, filePath, tail] of [...readStderr ? [[
				"stderr",
				logPaths.stderrPath,
				stderrTail
			]] : [], [
				"stdout",
				logPaths.stdoutPath,
				stdoutTail
			]]) {
				emitDetail(`# ${stream}: ${filePath}`);
				for (const line of summarizeLogTail(tail, { maxLines: 22 }).map(redactStatusSecrets)) emitDetail(line);
			}
		}
		if (restartTail.length > 0) {
			lines.push("");
			lines.push(muted(`Gateway restart attempts (tail): ${restartLogPath}`));
			for (const line of summarizeLogTail(restartTail, { maxLines: 16 }).map(redactStatusSecrets)) emitDetail(line);
		}
	}
	params.progress.tick();
	if (params.channelsStatus) {
		emitCheck(`Channel issues (${params.channelIssues.length || "none"})`, params.channelIssues.length === 0 ? "ok" : "warn");
		emitLimited(params.channelIssues, 12, (issue) => {
			const fixText = issue.fix ? ` · fix: ${issue.fix}` : "";
			return `  - ${issue.channel}[${issue.accountId}] ${issue.kind}: ${issue.message}${fixText}`;
		});
	} else if (params.nodeOnlyGateway) emitCheck(`Channel issues skipped (node-only mode; query ${params.nodeOnlyGateway.gatewayTarget})`, "ok");
	else if (params.gatewayStartupPhase) emitCheck(`Channel issues skipped (gateway still starting (phase ${params.gatewayStartupPhase}))`, "ok");
	else emitCheck(`Channel issues skipped (gateway ${params.gatewayReachable ? "query failed" : "unreachable"})`, "warn");
	if (params.health) {
		if ("error" in params.health) {
			if (params.health.error) {
				lines.push("");
				lines.push(muted("Gateway health:"));
				emitDetail(redactStatusSecrets(params.health.error));
			}
		} else {
			const deliveryQueueLine = formatDeliveryQueueHealthLine(params.health);
			if (deliveryQueueLine) emitCheck(redactStatusSecrets(deliveryQueueLine), "warn");
		}
	}
	lines.push("");
	lines.push(muted("Pasteable debug report. Auth tokens redacted."));
	lines.push("Troubleshooting: https://docs.openclaw.ai/troubleshooting");
	lines.push("");
}
//#endregion
//#region src/commands/status-all/report-lines.ts
async function buildStatusAllReportLines(params) {
	const rich = isRich();
	const heading = (text) => rich ? theme.heading(text) : text;
	const ok = (text) => rich ? theme.success(text) : text;
	const warn = (text) => rich ? theme.warn(text) : text;
	const fail = (text) => rich ? theme.error(text) : text;
	const muted = (text) => rich ? theme.muted(text) : text;
	const tableWidth = getTerminalTableWidth();
	const lines = [];
	if (params.configDiagnostics) lines.push(warn("Config diagnostics:"), ...formatStatusConfigDiagnosticEntries(params.configDiagnostics), "");
	lines.push(heading("OpenClaw status --all"));
	const report = {
		lines,
		heading,
		width: tableWidth
	};
	const overviewColumns = [...statusOverviewTableColumns];
	const overviewRows = params.overviewRows;
	const channelColumns = statusChannelsTableColumns.map((column) => column.key === "Detail" ? Object.assign({}, column, { minWidth: 28 }) : column);
	const channelRows = buildStatusChannelsTableRows({
		rows: params.channels.rows,
		channelIssues: params.channelIssues,
		ok,
		warn,
		muted,
		accentDim: theme.accentDim,
		formatIssueMessage: (message) => truncateUtf16Safe(message, 90)
	});
	const details = buildStatusChannelDetailSections({
		details: params.channels.details,
		ok,
		warn
	});
	const agentColumns = [...statusAgentsTableColumns];
	const agentRows = buildStatusAgentTableRows({
		agentStatus: params.agentStatus,
		ok,
		warn
	});
	appendStatusReportTable(report, "Overview", overviewColumns, overviewRows);
	appendStatusReportTable(report, "Channels", channelColumns, channelRows);
	for (const detail of details) appendStatusReportTable(report, detail.title, detail.columns, detail.rows);
	appendStatusReportTable(report, "Agents", agentColumns, agentRows);
	appendStatusReportHeading(report, "Diagnosis (read-only)");
	await appendStatusAllDiagnosis({
		lines,
		progress: params.progress,
		muted,
		ok,
		warn,
		fail,
		connectionDetailsForReport: params.connectionDetailsForReport,
		...params.diagnosis
	});
	return lines;
}
//#endregion
//#region src/commands/status-all.ts
/** Runs the full read-only status report and writes it to the runtime logger. */
async function statusAllCommand(runtime, opts) {
	await withProgress({
		label: "Scanning status --all…",
		total: 11
	}, async (progress) => {
		const overview = await collectStatusScanOverview({
			env: process.env,
			commandName: "status --all",
			opts: {
				timeoutMs: opts.timeoutMs,
				gatewayProbeDeadlineMs: opts.gatewayProbeDeadlineMs
			},
			showSecrets: false,
			runtime,
			useGatewayCallOverridesForChannelsStatus: true,
			includeAdvertisedControlUiLinks: true,
			progress,
			labels: {
				loadingConfig: "Loading config…",
				checkingTailscale: "Checking Tailscale…",
				checkingForUpdates: "Checking for updates…",
				resolvingAgents: "Scanning agents…",
				probingGateway: "Checking gateway…",
				queryingChannelStatus: "Querying gateway…",
				summarizingChannels: "Summarizing channels…"
			}
		}).catch((error) => reportStatusScanFailure(error, runtime, opts?.timeoutMs));
		progress.setLabel("Checking services…");
		const [daemon, nodeService] = await resolveStatusServiceSummaries(opts.timeoutMs);
		const nodeOnlyGateway = await resolveNodeOnlyGatewayInfo({
			daemon,
			node: nodeService
		});
		progress.tick();
		const lines = await buildStatusAllReportLines({
			progress,
			...await buildStatusAllReportData({
				overview,
				daemon,
				nodeService,
				nodeOnlyGateway,
				progress,
				timeoutMs: opts.timeoutMs,
				gatewayProbeDeadlineMs: opts.gatewayProbeDeadlineMs
			})
		});
		if (opts.usage) {
			const usage = await resolveStatusUsageSummary({
				config: overview.cfg,
				timeoutMs: resolveStatusGatewayProbeTimeoutMs(opts),
				gatewayProbeDeadlineMs: opts.gatewayProbeDeadlineMs,
				...opts.agent ? { agentId: opts.agent } : {}
			});
			lines.push("", ...formatUsageReportLines(usage));
		}
		progress.setLabel("Rendering…");
		runtime.log(lines.join("\n"));
		progress.tick();
	});
}
//#endregion
export { statusAllCommand };
