import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as writeRuntimeJson, t as ExitError } from "./runtime-DlO3PTAd.mjs";
import { a as isConfigReadFailure, n as createConfigReadError } from "./io.invalid-config-BzeD3bi5.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as isRich } from "./theme-DzaUZY4q.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-NlcA0RRK.mjs";
import { t as formatDurationCompact } from "./format-duration-BIQQYTeV.mjs";
import { n as info } from "./globals-BXbZ1A_g.mjs";
import { r as DEFAULT_RESTART_HEALTH_TIMEOUT_MS } from "./restart-health.constants-COHnQ8kO.mjs";
import { c as formatGatewayTransportErrorJson, n as buildGatewayProbeConnectionDetails, o as formatGatewayAuthErrorJson, r as callGateway, s as formatGatewayClientRequestErrorJson, t as buildGatewayConnectionDetails, u as isGatewayCredentialsRequiredError } from "./call-DnqhP17M.mjs";
import { n as isGatewaySecretRefUnavailableError } from "./credentials-lHQ7_oVm.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-bu8BjV4Y.mjs";
import { i as resolvePreferredAccountId, t as buildChannelAccountBindings } from "./bindings-DZZ-X6IG.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-Bm4RKejp.mjs";
import { r as withProgress } from "./progress-UTM8yfZa.mjs";
import { t as styleHealthChannelLine } from "./health-style-DYjoL3sy.mjs";
import { t as formatExactDuration } from "./format-duration-exact-DrpJka-9.mjs";
import { t as probeGatewayStatus } from "./probe-BENfJNiA.mjs";
import { t as waitForGatewayDiagnostic } from "./gateway-diagnostic-readiness-BY8MgjY3.mjs";
import { r as formatHealthChannelLines, t as formatDeliveryQueueHealthLine } from "./health-format-DWa2HpAp.mjs";
import { n as resolveHealthAccountContext } from "./account-context-79wGZT2i.mjs";
import { a as GATEWAY_HEALTH_REACHABLE_LINE, c as gatewayConnectErrorWasRateLimited, l as gatewayProbeResultSawGateway, o as buildCredentialsRequiredHealthDiagnostic, s as buildRateLimitedHealthDiagnostic, u as gatewayProbeResultWasRateLimited } from "./gateway-health-auth-diagnostic-B6t4LrBf.mjs";
import { t as logGatewayConnectionDetails } from "./status.gateway-connection-CSdcTL3Z.mjs";
//#region src/commands/health.ts
const healthLog = createSubsystemLogger("health");
function isGatewayHealthAuthUnavailableError(error) {
	return isGatewayCredentialsRequiredError(error) || isGatewaySecretRefUnavailableError(error);
}
async function emitReachableGatewayAuthDiagnostic(params) {
	const directRateLimit = gatewayConnectErrorWasRateLimited(params.error);
	if (!directRateLimit && !isGatewayHealthAuthUnavailableError(params.error)) return false;
	let rateLimited = directRateLimit;
	if (!directRateLimit) {
		const details = await buildGatewayProbeConnectionDetails({
			config: params.config,
			token: params.token,
			password: params.password,
			ignoreEnvUrlOverride: params.ignoreEnvUrlOverride,
			localPortOverride: params.localPortOverride
		});
		const probe = await probeGatewayStatus({
			url: details.url,
			token: params.token,
			password: params.password,
			tlsFingerprint: details.tlsFingerprint,
			preauthHandshakeTimeoutMs: details.preauthHandshakeTimeoutMs,
			timeoutMs: params.timeoutMs ?? DEFAULT_RESTART_HEALTH_TIMEOUT_MS,
			config: params.config,
			json: params.json
		});
		if (!gatewayProbeResultSawGateway(probe)) return false;
		rateLimited = gatewayProbeResultWasRateLimited(probe);
	}
	const diagnostic = rateLimited ? buildRateLimitedHealthDiagnostic(directRateLimit ? params.error : void 0) : buildCredentialsRequiredHealthDiagnostic();
	if (params.json) writeRuntimeJson(params.runtime, diagnostic);
	else {
		params.runtime.log(GATEWAY_HEALTH_REACHABLE_LINE);
		params.runtime.log(diagnostic.error.message);
	}
	params.runtime.exit(1);
	return true;
}
function formatEventLoopHealthLine(summary) {
	const eventLoop = summary.eventLoop;
	if (!eventLoop) return null;
	return `Gateway event loop: ${eventLoop.degraded ? "degraded" : "ok"}${eventLoop.degraded && eventLoop.degradedSinceMs != null ? ` for ${formatDurationCompact(eventLoop.degradedSinceMs) ?? "0s"}` : ""}${eventLoop.reasons.length > 0 ? ` reasons=${eventLoop.reasons.join(",")}` : ""} max=${Math.round(eventLoop.delayMaxMs)}ms p99=${Math.round(eventLoop.delayP99Ms)}ms util=${eventLoop.utilization} cpu=${eventLoop.cpuCoreRatio}`;
}
function formatContextEngineHealthLine(summary) {
	const quarantined = summary.contextEngines?.quarantined ?? [];
	if (quarantined.length === 0) return null;
	const engines = quarantined.map((entry) => entry.engineId).join(", ");
	return `Context engine: warning (${quarantined.length} quarantined; downgraded to legacy: ${engines})`;
}
function formatConfigReloadHealthLine(summary) {
	if (summary.configReload?.hotReloadStatus !== "disabled") return null;
	return "Config hot reload: disabled (watcher retries exhausted; restart the gateway to restore it)";
}
async function healthCommand(opts, runtime) {
	const cfg = opts.config ?? await readNonObservingHealthConfig();
	let summary;
	try {
		const remainingMs = await waitForGatewayDiagnostic({
			...opts,
			config: cfg
		}, runtime);
		if (remainingMs === void 0) return;
		summary = await withProgress({
			label: "Checking gateway health…",
			indeterminate: true,
			enabled: opts.json !== true
		}, async () => await callGateway({
			method: "health",
			params: opts.verbose ? { probe: true } : void 0,
			timeoutMs: remainingMs,
			config: cfg,
			token: opts.token,
			password: opts.password,
			sharedStateMode: "read-only",
			ignoreEnvUrlOverride: opts.ignoreEnvUrlOverride,
			localPortOverride: opts.localPortOverride
		}));
	} catch (error) {
		if (await emitReachableGatewayAuthDiagnostic({
			error,
			config: cfg,
			runtime,
			timeoutMs: opts.timeoutMs,
			token: opts.token,
			password: opts.password,
			ignoreEnvUrlOverride: opts.ignoreEnvUrlOverride,
			localPortOverride: opts.localPortOverride,
			json: opts.json
		})) return;
		if (opts.json) {
			const payload = formatGatewayAuthErrorJson(error) ?? formatGatewayClientRequestErrorJson(error) ?? formatGatewayTransportErrorJson(error);
			if (payload) {
				writeRuntimeJson(runtime, payload);
				runtime.exit(1);
				return;
			}
		}
		throw error;
	}
	if (opts.json) writeRuntimeJson(runtime, summary);
	else {
		const debugEnabled = isDiagnosticFlagEnabled("health", cfg);
		const rich = isRich();
		if (opts.verbose) {
			const details = buildGatewayConnectionDetails({
				config: cfg,
				ignoreEnvUrlOverride: opts.ignoreEnvUrlOverride,
				localPortOverride: opts.localPortOverride
			});
			logGatewayConnectionDetails({
				runtime,
				info,
				message: details.message
			});
		}
		const { buildHealthAgentSummaries, resolveHealthAgentOrder } = await import("./collector-DNnC7dpf.mjs");
		const localAgents = resolveHealthAgentOrder(cfg);
		const defaultAgentId = summary.defaultAgentId ?? localAgents.defaultAgentId;
		const agents = Array.isArray(summary.agents) ? summary.agents : [];
		const resolvedAgents = agents.length > 0 ? agents : await buildHealthAgentSummaries(cfg, localAgents);
		const displayAgents = opts.verbose || !defaultAgentId ? resolvedAgents : resolvedAgents.filter((agent) => agent.agentId === defaultAgentId);
		const channelBindings = buildChannelAccountBindings(cfg);
		const displayPlugins = listReadOnlyChannelPluginsForConfig(cfg, { includeSetupFallbackPlugins: false });
		if (debugEnabled) {
			runtime.log(info("[debug] local channel accounts"));
			for (const plugin of displayPlugins) {
				const accountIds = plugin.config.listAccountIds(cfg);
				const defaultAccountId = resolveChannelDefaultAccountId({
					plugin,
					cfg,
					accountIds
				});
				runtime.log(`  ${plugin.id}: accounts=${accountIds.join(", ") || "(none)"} default=${defaultAccountId}`);
				for (const accountId of accountIds) {
					const { inspectedAccount, probeAccount, configured, diagnostics } = await resolveHealthAccountContext({
						plugin,
						cfg,
						accountId
					});
					const record = asNullableRecord(inspectedAccount ?? probeAccount);
					const tokenSource = record && typeof record.tokenSource === "string" ? record.tokenSource : void 0;
					runtime.log(`    - ${accountId}: configured=${configured ?? "unknown"}${tokenSource ? ` tokenSource=${tokenSource}` : ""}`);
					for (const diagnostic of diagnostics) runtime.log(`      ! ${diagnostic}`);
				}
			}
			runtime.log(info("[debug] bindings map"));
			for (const [channelId, byAgent] of channelBindings.entries()) {
				const entries = Array.from(byAgent.entries()).map(([agentId, ids]) => `${agentId}=[${ids.join(", ")}]`);
				runtime.log(`  ${channelId}: ${entries.join(" ")}`);
			}
			runtime.log(info("[debug] gateway channel probes"));
			for (const [channelId, channelSummary] of Object.entries(summary.channels ?? {})) {
				const accounts = channelSummary.accounts ?? {};
				const probes = Object.entries(accounts).map(([accountId, accountSummary]) => {
					const probe = asNullableRecord(accountSummary.probe);
					const bot = probe ? asNullableRecord(probe.bot) : null;
					return `${accountId}=${(bot && typeof bot.username === "string" ? bot.username : null) ?? "(no bot)"}`;
				});
				runtime.log(`  ${channelId}: ${probes.join(", ") || "(none)"}`);
			}
		}
		const accountIdsByChannel = (() => {
			if (opts.verbose) return;
			const entries = displayAgents.length > 0 ? displayAgents : resolvedAgents;
			const byChannel = {};
			for (const [channelId, byAgent] of channelBindings.entries()) {
				const accountIds = [...new Set(entries.flatMap((agent) => byAgent.get(agent.agentId) ?? []))];
				if (accountIds.length > 0) byChannel[channelId] = accountIds;
			}
			return Object.keys(byChannel).length > 0 ? byChannel : void 0;
		})();
		const channelLines = formatHealthChannelLines(summary, {
			accountMode: opts.verbose ? "all" : "default",
			accountIdsByChannel
		});
		for (const line of channelLines) runtime.log(styleHealthChannelLine(line, rich));
		for (const formatLine of [
			formatEventLoopHealthLine,
			formatContextEngineHealthLine,
			formatDeliveryQueueHealthLine,
			formatConfigReloadHealthLine
		]) {
			const line = formatLine(summary);
			if (line) runtime.log(styleHealthChannelLine(line, rich));
		}
		for (const plugin of displayPlugins) {
			const channelSummary = summary.channels?.[plugin.id];
			if (!channelSummary || channelSummary.linked !== true) continue;
			if (!plugin.status?.logSelfId) continue;
			const boundAccounts = defaultAgentId ? channelBindings.get(plugin.id)?.get(defaultAgentId) ?? [] : [];
			const accountIds = plugin.config.listAccountIds(cfg);
			const defaultAccountId = resolveChannelDefaultAccountId({
				plugin,
				cfg,
				accountIds
			});
			const accountId = resolvePreferredAccountId({
				defaultAccountId,
				boundAccounts
			});
			const accountContext = await resolveHealthAccountContext({
				plugin,
				cfg,
				accountId
			});
			if (accountContext.probeAccount === void 0 || !accountContext.enabled || accountContext.configured !== true) continue;
			if (accountContext.diagnostics.length > 0) continue;
			try {
				plugin.status.logSelfId({
					account: accountContext.probeAccount,
					cfg,
					runtime,
					includeChannelPrefix: true
				});
			} catch (error) {
				const details = {
					channel: plugin.id,
					accountId,
					error: formatErrorMessage(error)
				};
				if (isDiagnosticFlagEnabled("health", cfg)) healthLog.info("logSelfId.failed", details);
			}
		}
		if (Number.isFinite(summary.durationMs)) runtime.log(info(`Gateway probe duration: ${summary.durationMs}ms`));
		if (resolvedAgents.length > 0) {
			const agentLabels = resolvedAgents.map((agent) => agent.isDefault ? `${agent.agentId} (default)` : agent.agentId);
			runtime.log(info(`Agents: ${agentLabels.join(", ")}`));
		}
		const heartbeatParts = displayAgents.map((agent) => {
			const everyMs = agent.heartbeat?.everyMs;
			return `${everyMs ? formatExactDuration(everyMs, "unknown", true) : "disabled"} (${agent.agentId})`;
		});
		if (heartbeatParts.length > 0) runtime.log(info(`Heartbeat interval: ${heartbeatParts.join(", ")}`));
		const sessionGroups = displayAgents.length > 0 ? displayAgents : [{
			agentId: void 0,
			sessions: summary.sessions
		}];
		for (const { agentId, sessions } of sessionGroups) {
			const label = agentId ? `Session store (${agentId})` : "Session store";
			runtime.log(info(`${label}: ${sessions.path} (${sessions.count} entries)`));
			for (const { key, age } of sessions.recent) runtime.log(`- ${key} (${age === null ? "no activity" : `${Math.round(age / 6e4)}m ago`})`);
		}
	}
}
/**
* Runs `healthCommand` inside a host flow (wizard/onboard/doctor). The command's
* CLI-style `runtime.exit(1)` diagnostic paths surface as a thrown `ExitError`,
* so the host reports the failure and keeps running instead of dying mid-flow.
*/
async function healthCommandNonExiting(opts, runtime) {
	await healthCommand(opts, {
		...runtime,
		exit: (code) => {
			throw new ExitError(code);
		}
	});
}
async function readNonObservingHealthConfig() {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const snapshot = await readConfigFileSnapshot({
		observe: false,
		pluginValidation: "core-only"
	});
	if (isConfigReadFailure(snapshot)) throw createConfigReadError(snapshot);
	return snapshot.runtimeConfig ?? snapshot.config;
}
//#endregion
export { healthCommandNonExiting as a, healthCommand as i, formatConfigReloadHealthLine as n, readNonObservingHealthConfig as o, formatContextEngineHealthLine as r, emitReachableGatewayAuthDiagnostic as t };
