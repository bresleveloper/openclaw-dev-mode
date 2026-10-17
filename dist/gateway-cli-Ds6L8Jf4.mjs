import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { D as isGatewayMachineOutput, H as MACHINE_OUTPUT_JSON_OPTION_DESCRIPTION } from "./argv-D_Nxd_3s.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import "./src-CdRlGRnW.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { l as rethrowExpectedCliError, r as formatCliJsonFailure } from "./failure-output-gtb9zaTk.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { o as resolveGatewayRpcOptions, r as callGatewayFromCliWithTransport, s as resolveGatewayRpcOptionsWithLocalPort, t as addGatewayClientOptions } from "./gateway-rpc-Cl_Z2Z7Q.mjs";
import { t as addGatewayServiceCommands } from "./register-service-commands-BQdXDPqH.mjs";
import { n as formatHelpExamples } from "./help-format-xds_bDSp.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DXeKniz_.mjs";
import { n as setCommandJsonMode } from "./json-mode-e6DlzpSi.mjs";
import { t as addGatewayRunCommand } from "./run-command-Bdqapttd.mjs";
import { randomBytes } from "node:crypto";
import { setTimeout } from "node:timers/promises";
//#region src/infra/restart-handoff-contract.ts
const GATEWAY_RESTART_HANDOFF_PROTOCOL = "openclaw.gateway.restart-handoff";
function createGatewayRestartHandoffCapabilities() {
	return {
		protocol: GATEWAY_RESTART_HANDOFF_PROTOCOL,
		protocolVersion: 1,
		operations: ["consume"]
	};
}
//#endregion
//#region src/cli/gateway-cli/register-restart-handoff.ts
function writeRestartHandoffError(reason) {
	defaultRuntime.writeJson({
		ok: false,
		protocol: GATEWAY_RESTART_HANDOFF_PROTOCOL,
		protocolVersion: 1,
		status: "error",
		reason
	});
}
function collectExpectedPid(value, previous) {
	return Array.isArray(previous) ? [...previous, value] : [previous, value];
}
function addGatewayRestartHandoffCommands(gateway) {
	const restartHandoff = gateway.command("restart-handoff", { hidden: true });
	restartHandoff.command("capabilities").description("Report the gateway restart-handoff machine contract").option("--json", MACHINE_OUTPUT_JSON_OPTION_DESCRIPTION).action(() => {
		defaultRuntime.writeJson({
			ok: true,
			...createGatewayRestartHandoffCapabilities()
		});
	});
	restartHandoff.command("consume").description("Atomically consume a gateway restart handoff").helpOption(false).allowUnknownOption().allowExcessArguments().option("--expected-pid [pid]", "PID of the exited gateway process", collectExpectedPid, []).option("--json", MACHINE_OUTPUT_JSON_OPTION_DESCRIPTION).action(async (opts, command) => {
		const expectedPidValues = Array.isArray(opts.expectedPid) ? opts.expectedPid : [];
		const expectedPid = command.args.length === 0 && expectedPidValues.length === 1 ? parseStrictPositiveInteger(expectedPidValues[0]) : void 0;
		if (expectedPid === void 0 || !Number.isSafeInteger(expectedPid)) {
			writeRestartHandoffError("invalid-expected-pid");
			defaultRuntime.exit(2);
			return;
		}
		try {
			const { consumeGatewayRestartHandoffSync } = await import("./restart-handoff-DE5d9P7o.mjs");
			const result = consumeGatewayRestartHandoffSync({ expectedPid });
			defaultRuntime.writeJson({
				ok: true,
				protocol: GATEWAY_RESTART_HANDOFF_PROTOCOL,
				protocolVersion: 1,
				...result
			});
		} catch (err) {
			defaultRuntime.error(`Gateway restart handoff consume failed: ${String(err)}`);
			writeRestartHandoffError("store-unavailable");
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
//#region src/cli/gateway-cli/suspend-cli.ts
const MIN_SUSPEND_POLL_DELAY_MS = 50;
function parseWaitMs(value) {
	if (value === void 0) return;
	const seconds = typeof value === "number" ? value : Number(value.trim() || NaN);
	if (!Number.isFinite(seconds) || seconds < 0) throw new Error("--wait must be a non-negative number of seconds");
	const milliseconds = Math.floor(seconds * 1e3);
	if (!Number.isSafeInteger(milliseconds)) throw new Error("--wait is too large");
	return milliseconds;
}
function resolveRequestId(value) {
	if (value === void 0) return `cli-${randomBytes(4).toString("hex")}`;
	const requestId = value.trim();
	if (!requestId || requestId.length > 128) throw new Error("--request-id must contain 1 to 128 characters");
	return requestId;
}
function formatBusyResult(result) {
	const blockers = result.blockers.map((blocker) => `- ${blocker.message}`);
	return [`Gateway suspension is busy (${result.reason}; ${result.activeCount} active).`, ...blockers.length > 0 ? ["Blockers:", ...blockers] : []].join("\n");
}
async function runGatewaySuspend(options, deps) {
	const nowMs = deps.nowMs ?? Date.now;
	const wait = deps.sleep ?? setTimeout;
	const requestId = resolveRequestId(options.requestId);
	const waitMs = parseWaitMs(options.waitSeconds);
	const deadlineMs = waitMs === void 0 ? void 0 : nowMs() + waitMs;
	const maxAttempts = waitMs === void 0 ? 1 : Math.ceil(waitMs / MIN_SUSPEND_POLL_DELAY_MS) + 1;
	let latest;
	for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
		if (attempt > 0 && deadlineMs !== void 0 && nowMs() >= deadlineMs) break;
		latest = await deps.callGateway("gateway.suspend.prepare", options.rpcOpts, { requestId });
		if (latest.status === "ready") {
			if (options.json) {
				deps.runtime.writeJson({
					...latest,
					requestId
				});
				return;
			}
			const rich = isRich();
			deps.runtime.log(colorize(rich, theme.success, "Gateway suspension prepared."));
			deps.runtime.log(`${colorize(rich, theme.muted, "Suspension ID:")} ${latest.suspensionId}`);
			deps.runtime.log(`${colorize(rich, theme.muted, "Expires:")} ${new Date(latest.expiresAtMs).toISOString()} (${latest.expiresAtMs} ms)`);
			const port = options.rpcOpts.localPortOverride;
			const command = `openclaw gateway resume ${latest.suspensionId}`;
			deps.runtime.log(`Resume with: ${formatCliCommand(port === void 0 ? command : `${command} --port ${port}`)}`);
			return;
		}
		if (latest.status === "draining") throw new Error("Gateway suspension unexpectedly entered drain mode");
		if (deadlineMs === void 0) break;
		const remainingMs = deadlineMs - nowMs();
		if (remainingMs <= 0) break;
		await wait(Math.min(remainingMs, Math.max(MIN_SUSPEND_POLL_DELAY_MS, latest.retryAfterMs)));
	}
	if (!latest || latest.status !== "busy") throw new Error("Gateway suspension polling ended without a result");
	if (options.json) {
		deps.runtime.writeJson({
			...latest,
			requestId
		});
		deps.runtime.exit(1);
		return;
	}
	const hint = deadlineMs === void 0 ? "Retry later or use --wait <seconds>." : "Timed out waiting for the Gateway to become idle.";
	throw new Error(`${formatBusyResult(latest)}\n${hint}`);
}
async function runGatewayResume(options, deps) {
	const result = await deps.callGateway("gateway.suspend.resume", options.rpcOpts, { suspensionId: options.suspensionId });
	if (options.json) {
		deps.runtime.writeJson(result);
		return;
	}
	deps.runtime.log(result.resumed ? "Gateway resumed." : "No matching suspension was held (lease already expired or resumed); gateway is running.");
}
//#endregion
//#region src/cli/gateway-cli/register.ts
const loadConfigModule = createLazyPromise(() => import("./read-best-effort-config.runtime.js"));
const loadGatewayStatusModule = createLazyPromise(() => import("./gateway-status-DIEFIHg-.mjs"));
const loadGatewayHealthModule = createLazyPromise(() => import("./health-BRdg7cM6.mjs"));
const loadBonjourDiscoveryModule = createLazyPromise(() => import("./bonjour-discovery-BiYyTyBJ.mjs"));
const loadWideAreaDnsModule = createLazyPromise(() => import("./widearea-dns-JOyITF4F.mjs"));
const loadHealthStyleModule = createLazyPromise(() => import("./terminal-core/health-style.js"));
const loadUsageFormatModule = createLazyPromise(() => import("./usage-format-7vN_DurE.mjs"));
const loadStabilityBundleModule = createLazyPromise(() => import("./diagnostic-stability-bundle-xHYlbbyq.mjs"));
const loadSupportExportModule = createLazyPromise(() => import("./diagnostic-support-export-qi9Qdd2D.mjs"));
const loadDaemonStatusGatherModule = createLazyPromise(() => import("./status.gather-C3V4F10H.mjs"));
const DEFAULT_GATEWAY_RPC_TIMEOUT_MS = 1e4;
const SETUP_INFERENCE_DETECT_RPC_TIMEOUT_MS = 4e4;
function gatewayCallOpts(cmd, defaultTimeoutMs = DEFAULT_GATEWAY_RPC_TIMEOUT_MS) {
	return addGatewayClientOptions(cmd, { timeoutMs: defaultTimeoutMs }).option("--json", "Output JSON", false);
}
async function callGatewayReadOnlyCli(method, opts, params) {
	return await callGatewayFromCliWithTransport(method, opts, params, {
		defaultTimeoutMs: DEFAULT_GATEWAY_RPC_TIMEOUT_MS,
		sharedStateMode: "read-only"
	});
}
function parseGatewayCallParams(value = "{}") {
	try {
		return JSON.parse(value);
	} catch {
		throw new Error("--params must be valid JSON.");
	}
}
function gatewayAction(action, label) {
	return async function(...args) {
		const json = Boolean(this.opts().json);
		try {
			await action.apply(this, args);
		} catch (err) {
			if (!json) rethrowExpectedCliError(err);
			if (json) {
				const { formatGatewayAuthErrorJson, formatGatewayClientRequestErrorJson, formatGatewayTransportErrorJson } = await import("./call-CWvmXO5x.mjs");
				defaultRuntime.writeJson(formatGatewayAuthErrorJson(err) ?? formatGatewayClientRequestErrorJson(err) ?? formatGatewayTransportErrorJson(err) ?? formatCliJsonFailure(err));
				defaultRuntime.exit(1);
				return;
			}
			const message = formatErrorMessage(err);
			defaultRuntime.error(label ? `${label}: ${message}` : message);
			defaultRuntime.exit(1);
		}
	};
}
function parseDaysOption(raw, fallback = 30) {
	if (typeof raw === "number" && Number.isFinite(raw)) return Math.max(1, Math.floor(raw));
	if (typeof raw === "string") {
		const parsed = parseStrictPositiveInteger(raw);
		if (parsed !== void 0) return parsed;
		throw new Error(`Invalid --days. Use a positive integer, e.g. --days 30. Received: "${raw}".`);
	}
	return fallback;
}
async function renderCostUsageSummaryAsync(summary, days, rich) {
	const { formatMissingCostEntries } = await import("./session-cost-usage-totals-yA_Kwp29.mjs");
	const { formatCostUsageCachePrefix, formatTokenCount, formatUsd } = await loadUsageFormatModule();
	const totalCost = formatUsd(summary.totals.totalCost) ?? "$0.00";
	const totalTokens = formatTokenCount(summary.totals.totalTokens) ?? "0";
	const cachePrefix = formatCostUsageCachePrefix(summary.cacheStatus);
	const lines = [colorize(rich, theme.heading, `Usage cost (${days} days)`), `${cachePrefix}${colorize(rich, theme.muted, "Total:")} ${totalCost} · ${totalTokens} tokens`];
	if (summary.totals.missingCostEntries > 0) lines.push(`${colorize(rich, theme.muted, "Missing cost:")} ${formatMissingCostEntries(summary.totals)}`);
	const latest = summary.daily.at(-1);
	if (latest) {
		const latestCost = formatUsd(latest.totalCost) ?? "$0.00";
		const latestTokens = formatTokenCount(latest.totalTokens) ?? "0";
		lines.push(`${colorize(rich, theme.muted, "Latest day:")} ${latest.date} · ${latestCost} · ${latestTokens} tokens`);
	}
	return lines;
}
function formatBytes(value) {
	if (value === void 0) return "n/a";
	return formatByteSize(value, {
		style: "iec",
		maxUnit: "giga",
		separator: " ",
		fractionDigits: (amount, unit) => unit === "byte" || amount >= 100 ? 0 : 1
	});
}
function formatStabilityEvent(record) {
	return [
		new Date(record.ts).toISOString(),
		`#${record.seq}`,
		record.type,
		record.level ? `level=${record.level}` : "",
		record.action ? `action=${record.action}` : "",
		record.outcome ? `outcome=${record.outcome}` : "",
		record.surface ? `surface=${record.surface}` : "",
		record.channel ? `channel=${record.channel}` : "",
		record.pluginId ? `plugin=${record.pluginId}` : "",
		record.reason ? `reason=${record.reason}` : "",
		record.bytes !== void 0 ? `bytes=${formatBytes(record.bytes)}` : "",
		record.limitBytes !== void 0 ? `limit=${formatBytes(record.limitBytes)}` : "",
		record.queueDepth !== void 0 ? `queueDepth=${record.queueDepth}` : "",
		record.queueLength !== void 0 ? `queueLength=${record.queueLength}` : "",
		record.droppedEvents !== void 0 ? `dropped=${record.droppedEvents}` : "",
		record.maxQueueLength !== void 0 ? `maxQueue=${record.maxQueueLength}` : "",
		record.queued !== void 0 ? `queued=${record.queued}` : "",
		record.memory ? `rss=${formatBytes(record.memory.rssBytes)}` : "",
		record.memory ? `heap=${formatBytes(record.memory.heapUsedBytes)}` : ""
	].filter(Boolean).join(" ");
}
function renderStabilitySummary(snapshot, rich) {
	const lines = [colorize(rich, theme.heading, "Gateway Stability"), `${colorize(rich, theme.muted, "Events:")} ${snapshot.count}/${snapshot.capacity}${snapshot.dropped > 0 ? ` · dropped=${snapshot.dropped}` : ""}`];
	const topTypes = Object.entries(snapshot.summary.byType).toSorted((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8).map(([type, count]) => `${type}=${count}`).join(", ");
	if (topTypes) lines.push(`${colorize(rich, theme.muted, "Types:")} ${topTypes}`);
	const memory = snapshot.summary.memory;
	if (memory) lines.push(`${colorize(rich, theme.muted, "Memory:")} rss=${formatBytes(memory.latest?.rssBytes)} heap=${formatBytes(memory.latest?.heapUsedBytes)} maxRss=${formatBytes(memory.maxRssBytes)} pressure=${memory.pressureCount}`);
	const payloadLarge = snapshot.summary.payloadLarge;
	if (payloadLarge) {
		const surfaces = Object.entries(payloadLarge.bySurface).toSorted((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([surface, count]) => `${surface}=${count}`).join(", ");
		lines.push(`${colorize(rich, theme.muted, "Large payloads:")} total=${payloadLarge.count} rejected=${payloadLarge.rejected} truncated=${payloadLarge.truncated} chunked=${payloadLarge.chunked}${surfaces ? ` · ${surfaces}` : ""}`);
	}
	if (snapshot.events.length > 0) {
		lines.push(colorize(rich, theme.muted, "Recent:"));
		for (const event of snapshot.events) lines.push(`  ${formatStabilityEvent(event)}`);
	}
	return lines;
}
function normalizeStabilityBundleTarget(raw) {
	if (raw === void 0 || raw === false) return null;
	return normalizeOptionalString(raw) ?? "latest";
}
function renderStabilityBundleSummary(params) {
	const { bundle, path, rich, snapshot } = params;
	const processDetails = [
		`pid=${bundle.process.pid}`,
		`node=${bundle.process.node}`,
		`${bundle.process.platform}/${bundle.process.arch}`,
		`uptime=${Math.round(bundle.process.uptimeMs / 1e3)}s`
	].join(" ");
	const lines = [
		colorize(rich, theme.heading, "Stability bundle"),
		`${colorize(rich, theme.muted, "Path:")} ${path}`,
		`${colorize(rich, theme.muted, "Generated:")} ${bundle.generatedAt}`,
		`${colorize(rich, theme.muted, "Reason:")} ${bundle.reason}`,
		`${colorize(rich, theme.muted, "Process:")} ${processDetails}`,
		`${colorize(rich, theme.muted, "Host:")} ${bundle.host.hostname}`
	];
	if (bundle.error) {
		const errorParts = [bundle.error.name ? `name=${bundle.error.name}` : "", bundle.error.code ? `code=${bundle.error.code}` : ""].filter(Boolean);
		if (errorParts.length > 0) lines.push(`${colorize(rich, theme.muted, "Error:")} ${errorParts.join(" ")}`);
	}
	const memoryPressure = bundle.evidence?.memoryPressure;
	if (memoryPressure) {
		lines.push(`${colorize(rich, theme.muted, "Memory pressure:")} ${memoryPressure.level}/${memoryPressure.reason} rss=${formatBytes(memoryPressure.memory.rssBytes)} heap=${formatBytes(memoryPressure.memory.heapUsedBytes)} threshold=${formatBytes(memoryPressure.thresholdBytes)}`);
		if (memoryPressure.heapStatistics) lines.push(`${colorize(rich, theme.muted, "V8 heap:")} used=${formatBytes(memoryPressure.heapStatistics.usedHeapSizeBytes)} limit=${formatBytes(memoryPressure.heapStatistics.heapSizeLimitBytes)} available=${formatBytes(memoryPressure.heapStatistics.totalAvailableSizeBytes)}`);
		if (memoryPressure.activeResources) {
			const resources = Object.entries(memoryPressure.activeResources.byType).map(([type, count]) => `${type}=${count}`).join(", ");
			lines.push(`${colorize(rich, theme.muted, "Active resources:")} total=${memoryPressure.activeResources.total}${resources ? ` · ${resources}` : ""}`);
		}
		if (memoryPressure.topSessionFiles?.length) {
			const files = memoryPressure.topSessionFiles.slice(0, 5).map((file) => `${file.relativePath}=${formatBytes(file.sizeBytes)}`).join(", ");
			lines.push(`${colorize(rich, theme.muted, "Largest session files:")} ${files}`);
		}
	}
	lines.push("", ...renderStabilitySummary(snapshot, rich));
	return lines;
}
function renderSupportExportResult(result, rich) {
	return [
		colorize(rich, theme.heading, "Diagnostics export"),
		`${colorize(rich, theme.muted, "Path:")} ${result.path}`,
		`${colorize(rich, theme.muted, "Size:")} ${formatBytes(result.bytes)}`,
		`${colorize(rich, theme.muted, "Files:")} ${result.manifest.contents.length}`,
		`${colorize(rich, theme.muted, "Privacy:")} payload-free stability, sanitized logs/status/health/config`
	];
}
function parseOptionalPositiveIntegerOption(raw, label) {
	if (raw === void 0) return;
	const parsed = parseStrictPositiveInteger(raw);
	if (parsed === void 0) throw new Error(`${label} must be a positive integer.`);
	return parsed;
}
async function writeSupportExportFromCli(opts) {
	const { writeDiagnosticSupportExport } = await loadSupportExportModule();
	const rpc = {
		url: opts.rpc?.url,
		token: opts.rpc?.token,
		password: opts.rpc?.password,
		timeout: opts.rpc?.timeout ?? "3000",
		json: true
	};
	const result = await writeDiagnosticSupportExport({
		outputPath: opts.output,
		logLimit: parseOptionalPositiveIntegerOption(opts.logLines, "--log-lines"),
		logMaxBytes: parseOptionalPositiveIntegerOption(opts.logBytes, "--log-bytes"),
		stabilityBundle: opts.stabilityBundle,
		readStatusSnapshot: async () => {
			const { gatherDaemonStatus } = await loadDaemonStatusGatherModule();
			return await gatherDaemonStatus({
				rpc,
				probe: true,
				requireRpc: false,
				deep: false
			});
		},
		readHealthSnapshot: async () => await callGatewayReadOnlyCli("health", rpc)
	});
	if (opts.json) {
		defaultRuntime.writeJson(result);
		return;
	}
	const rich = isRich();
	for (const line of renderSupportExportResult(result, rich)) defaultRuntime.log(line);
}
function registerGatewayCli(program, deps = {}) {
	const gateway = addGatewayRunCommand(program.command("gateway").description("Run, inspect, and query the WebSocket Gateway").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw gateway run", "Run the gateway in the foreground."],
		["openclaw gateway status", "Show service status plus connectivity/capability."],
		["openclaw gateway auth-token --show", "Reveal the shared token interactively."],
		["openclaw gateway discover", "Find local and wide-area gateway beacons."],
		["openclaw gateway stability", "Show recent stability diagnostics."],
		["openclaw gateway call health", "Call a gateway RPC method directly."]
	])}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/gateway", "docs.openclaw.ai/cli/gateway")}\n`));
	addGatewayRunCommand(gateway.command("run").description("Run the WebSocket Gateway (foreground)"));
	addGatewayServiceCommands(gateway, { statusDescription: "Show gateway service status + probe connectivity/capability" });
	addGatewayRestartHandoffCommands(gateway);
	setCommandJsonMode(gateway, "output", ({ argv }) => isGatewayMachineOutput(argv));
	gateway.command("auth-token").description("Reveal the configured shared Gateway token").option("--show", "Print the token to an interactive terminal", false).action(gatewayAction(async (opts) => {
		if (!opts.show) throw new Error("Pass --show to confirm that you want to print the Gateway token to this terminal.");
		const { gatewayAuthTokenCommand } = await import("./gateway-auth-token-BwJAe68O.mjs");
		await gatewayAuthTokenCommand(defaultRuntime);
	}, "Gateway auth token failed"));
	gatewayCallOpts(gateway.command("call").description("Call a Gateway method").argument("<method>", "Method name (health/status/system-presence/cron.*)").option("--expect-url <url>", "Fail if the resolved Gateway URL differs; preserves configured authentication").option("--params <json>", "JSON object string for params", "{}").action(gatewayAction(async (method, opts, command) => {
		const callOpts = method === "openclaw.setup.detect" && command.getOptionValueSource("timeout") === "default" ? {
			...opts,
			timeout: String(SETUP_INFERENCE_DETECT_RPC_TIMEOUT_MS)
		} : opts;
		const rpcOpts = resolveGatewayRpcOptionsWithLocalPort(callOpts, command);
		const result = await callGatewayReadOnlyCli(method, rpcOpts, parseGatewayCallParams(String(opts.params ?? "{}")));
		if (rpcOpts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		const rich = isRich();
		defaultRuntime.log(`${colorize(rich, theme.heading, "Gateway call")}: ${colorize(rich, theme.muted, String(method))}`);
		defaultRuntime.writeJson(result);
	}, "Gateway call failed")));
	gatewayCallOpts(gateway.command("suspend").description("Prepare the Gateway for cooperative host suspension").option("--request-id <id>", "Stable suspension request id").option("--wait <seconds>", "Wait up to this many seconds for active work to drain").action(gatewayAction(async (opts, command) => {
		const rpcOpts = resolveGatewayRpcOptionsWithLocalPort(opts, command);
		await runGatewaySuspend({
			rpcOpts,
			requestId: opts.requestId,
			waitSeconds: opts.wait,
			json: Boolean(rpcOpts.json)
		}, {
			callGateway: callGatewayReadOnlyCli,
			runtime: defaultRuntime
		});
	}, "Gateway suspend failed")));
	gatewayCallOpts(gateway.command("resume").description("Release a cooperative Gateway suspension").argument("<suspensionId>", "Suspension id returned by gateway suspend").action(gatewayAction(async (suspensionId, opts, command) => {
		const rpcOpts = resolveGatewayRpcOptionsWithLocalPort(opts, command);
		await runGatewayResume({
			rpcOpts,
			suspensionId: String(suspensionId),
			json: Boolean(rpcOpts.json)
		}, {
			callGateway: callGatewayReadOnlyCli,
			runtime: defaultRuntime
		});
	}, "Gateway resume failed")));
	gatewayCallOpts(gateway.command("usage-cost").description("Fetch usage cost summary from session logs").option("--days <days>", "Number of days to include", "30").option("--agent <id>", "Scope the cost summary to a specific agent id").option("--all-agents", "Aggregate the cost summary across all agents", false).action(gatewayAction(async (opts, command) => {
		const rpcOpts = resolveGatewayRpcOptionsWithLocalPort(opts, command);
		const days = parseDaysOption(opts.days);
		const agentId = typeof opts.agent === "string" ? opts.agent.trim() : void 0;
		if (agentId && opts.allAgents) throw new Error("Use --agent or --all-agents, not both");
		const summary = await callGatewayReadOnlyCli("usage.cost", rpcOpts, {
			days,
			...agentId ? { agentId } : {},
			...opts.allAgents ? { agentScope: "all" } : {}
		});
		if (rpcOpts.json) {
			defaultRuntime.writeJson(summary);
			return;
		}
		const rich = isRich();
		for (const line of await renderCostUsageSummaryAsync(summary, days, rich)) defaultRuntime.log(line);
	}, "Gateway usage cost failed")));
	gatewayCallOpts(gateway.command("health").description("Fetch Gateway health").action(gatewayAction(async (opts, command) => {
		const rpcOpts = resolveGatewayRpcOptionsWithLocalPort(opts, command);
		let result;
		try {
			result = await callGatewayReadOnlyCli("health", rpcOpts);
		} catch (error) {
			const { emitReachableGatewayAuthDiagnostic, readNonObservingHealthConfig } = await (deps.loadGatewayHealthModule ?? loadGatewayHealthModule)();
			if (await emitReachableGatewayAuthDiagnostic({
				error,
				config: rpcOpts.config ?? await readNonObservingHealthConfig(),
				runtime: defaultRuntime,
				timeoutMs: parseTimeoutMsWithFallback(rpcOpts.timeout, 1e4, { invalidType: "error" }),
				token: rpcOpts.token,
				password: rpcOpts.password,
				localPortOverride: rpcOpts.localPortOverride,
				json: Boolean(rpcOpts.json)
			})) return;
			throw error;
		}
		if (rpcOpts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		const [{ formatHealthChannelLines }, { styleHealthChannelLine }] = await Promise.all([(deps.loadGatewayHealthModule ?? loadGatewayHealthModule)(), (deps.loadHealthStyleModule ?? loadHealthStyleModule)()]);
		const rich = isRich();
		const obj = result && typeof result === "object" ? result : {};
		const durationMs = typeof obj.durationMs === "number" ? obj.durationMs : null;
		defaultRuntime.log(colorize(rich, theme.heading, "Gateway Health"));
		defaultRuntime.log(`${colorize(rich, theme.success, "OK")}${durationMs != null ? ` (${durationMs}ms)` : ""}`);
		if (obj.channels && typeof obj.channels === "object") for (const line of formatHealthChannelLines(obj)) defaultRuntime.log(styleHealthChannelLine(line, rich));
	}, void 0)));
	gatewayCallOpts(gateway.command("stability").description("Fetch payload-free Gateway stability diagnostics").option("--limit <limit>", "Maximum number of recent events", "25").option("--type <type>", "Filter by diagnostic event type").option("--since-seq <seq>", "Only include events after this sequence").option("--bundle [path]", "Read a persisted stability bundle instead of calling Gateway; pass \"latest\" for newest").option("--export", "Write a shareable support diagnostics export", false).option("--output <path>", "Diagnostics export output .zip path").action(gatewayAction(async (opts, command) => {
		const { normalizeDiagnosticStabilityQuery, selectDiagnosticStabilitySnapshot } = await import("./diagnostic-stability-DRiz9ZlU.mjs");
		const rpcOpts = resolveGatewayRpcOptions(opts, command);
		const query = normalizeDiagnosticStabilityQuery({
			limit: opts.limit,
			sinceSeq: opts.sinceSeq,
			type: opts.type
		}, { defaultLimit: 25 });
		const bundleTarget = normalizeStabilityBundleTarget(opts.bundle);
		if (opts.export) {
			await writeSupportExportFromCli({
				json: rpcOpts.json,
				output: opts.output,
				stabilityBundle: bundleTarget ?? "latest",
				rpc: rpcOpts
			});
			return;
		}
		if (bundleTarget) {
			const { readDiagnosticStabilityBundleFileSync, readLatestDiagnosticStabilityBundleSync } = await loadStabilityBundleModule();
			const result = bundleTarget === "latest" ? readLatestDiagnosticStabilityBundleSync() : readDiagnosticStabilityBundleFileSync(bundleTarget);
			if (result.status === "missing") throw new Error(`No stability bundles found in ${result.dir}`);
			if (result.status === "failed") throw new Error(result.error instanceof Error ? result.error.message : String(result.error));
			const snapshot = selectDiagnosticStabilitySnapshot(result.bundle.snapshot, query);
			if (rpcOpts.json) {
				defaultRuntime.writeJson({
					path: result.path,
					mtimeMs: result.mtimeMs,
					bundle: {
						...result.bundle,
						snapshot
					}
				});
				return;
			}
			const rich = isRich();
			for (const line of renderStabilityBundleSummary({
				bundle: result.bundle,
				path: result.path,
				rich,
				snapshot
			})) defaultRuntime.log(line);
			return;
		}
		const result = await callGatewayReadOnlyCli("diagnostics.stability", resolveGatewayRpcOptionsWithLocalPort(rpcOpts, command), {
			limit: query.limit,
			...query.type ? { type: query.type } : {},
			...query.sinceSeq !== void 0 ? { sinceSeq: query.sinceSeq } : {}
		});
		if (rpcOpts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		const rich = isRich();
		for (const line of renderStabilitySummary(result, rich)) defaultRuntime.log(line);
	}, "Gateway stability failed")));
	gateway.command("diagnostics").description("Export local support diagnostics").command("export").description("Write a shareable, payload-free diagnostics .zip").option("--output <path>", "Output .zip path").option("--log-lines <count>", "Maximum sanitized log lines to include", "5000").option("--log-bytes <bytes>", "Maximum log bytes to inspect", "1000000").option("--url <url>", "Gateway WebSocket URL for health snapshot").option("--token <token>", "Gateway token for health snapshot").option("--password <password>", "Gateway password for health snapshot").option("--timeout <ms>", "Status/health snapshot timeout in ms", "3000").option("--no-stability-bundle", "Skip persisted stability bundle lookup").option("--json", "Output JSON", false).action(gatewayAction(async (opts, command) => {
		const rpcOpts = resolveGatewayRpcOptions(opts, command);
		await writeSupportExportFromCli({
			json: opts.json,
			output: opts.output,
			logLines: opts.logLines,
			logBytes: opts.logBytes,
			stabilityBundle: opts.stabilityBundle === false ? false : "latest",
			rpc: rpcOpts
		});
	}, "Gateway diagnostics export failed"));
	gateway.command("probe").description("Show gateway reachability, auth capability, and read-probe summary (local + remote)").option("--url <url>", "Explicit Gateway WebSocket URL (still probes localhost)").option("--port <port>", "Local Gateway port").option("--ssh <target>", "SSH target for remote gateway tunnel (user@host or user@host:port)").option("--ssh-identity <path>", "SSH identity file path").option("--ssh-auto", "Try to derive an SSH target from Bonjour discovery", false).option("--token <token>", "Gateway token (applies to all probes)").option("--password <password>", "Gateway password (applies to all probes)").option("--timeout <ms>", "Overall probe budget in ms", "3000").option("--json", "Output JSON", false).action(gatewayAction(async (opts, command) => {
		const rpcOpts = resolveGatewayRpcOptions(opts, command);
		const { gatewayStatusCommand } = await loadGatewayStatusModule();
		await gatewayStatusCommand({
			...rpcOpts,
			port: opts.port ?? inheritOptionFromParent(command, "port")
		}, defaultRuntime);
	}, void 0));
	gateway.command("discover").description("Discover gateways via Bonjour (local + wide-area if configured)").option("--timeout <ms>", "Per-command timeout in ms", "2000").option("--json", "Output JSON", false).action(gatewayAction(async (opts) => {
		const [{ readSourceConfigBestEffort }, { discoverGatewayBeacons, resolveGatewayDiscoveryEndpoint }, { resolveWideAreaDiscoveryDomain }, { dedupeBeacons, renderBeaconLines }, { withProgress }] = await Promise.all([
			loadConfigModule(),
			loadBonjourDiscoveryModule(),
			loadWideAreaDnsModule(),
			import("./discover-Dm5OUEqq.mjs"),
			import("./progress-NhZUfSPr.mjs")
		]);
		const wideAreaDomain = resolveWideAreaDiscoveryDomain({ configDomain: (await readSourceConfigBestEffort()).discovery?.wideArea?.domain });
		const timeoutMs = parseTimeoutMsWithFallback(opts.timeout, 2e3, { invalidType: "error" });
		const domains = ["local.", ...wideAreaDomain ? [wideAreaDomain] : []];
		const deduped = dedupeBeacons(await withProgress({
			label: "Scanning for gateways…",
			indeterminate: true,
			enabled: opts.json !== true,
			delayMs: 0
		}, async () => await discoverGatewayBeacons({
			timeoutMs,
			wideAreaDomain
		}))).toSorted((a, b) => (a.displayName || a.instanceName).localeCompare(b.displayName || b.instanceName));
		if (opts.json) {
			const enriched = deduped.map((beacon) => ({
				...beacon,
				wsUrl: resolveGatewayDiscoveryEndpoint(beacon)?.wsUrl ?? null
			}));
			defaultRuntime.writeJson({
				timeoutMs,
				domains,
				count: enriched.length,
				beacons: enriched
			});
			return;
		}
		const rich = isRich();
		defaultRuntime.log(colorize(rich, theme.heading, "Gateway Discovery"));
		defaultRuntime.log(colorize(rich, theme.muted, `Found ${deduped.length} gateway(s) · domains: ${domains.join(", ")}`));
		if (deduped.length === 0) return;
		for (const beacon of deduped) for (const line of renderBeaconLines(beacon, rich)) defaultRuntime.log(line);
	}, "gateway discover failed"));
}
//#endregion
export { registerGatewayCli };
