import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as trackAsyncWork } from "./async-work-scope-CWk2dk1h.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, S as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { x as redactToolPayloadTextWithConfig } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-C5zAusBU.mjs";
import { C as toPublicPluginVerificationDiagnostic, b as listActiveDegradedPlugins, g as degradedPluginMatchesRoot } from "./discovery-D_5mAUI7.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-BXzjx6E8.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { l as getActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { a as resolvePreferredAccountId, t as buildChannelAccountBindings } from "./bindings-CUbRLEEv.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-BvrVstXM.mjs";
import { i as resolveHeartbeatSummariesForAgents } from "./heartbeat-summary-projection-Crxlqz_G.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { s as redactChannelStatusSummaryBaseUrl } from "./account-snapshot-fields-DpvG7B4L.mjs";
import { a as resolveUnavailableChannelAccountSnapshot } from "./account-state-Bap6_YQI.mjs";
import { n as buildChannelAccountSnapshotFromRuntime, t as buildChannelAccountSnapshotFromInspection } from "./account-summary-DhBHrWxT.mjs";
import { t as createPermitPool } from "./permit-pool-CI4Cxubq.mjs";
import { t as buildChannelAccountSnapshotFromAccount } from "./status-CNILp5Aq.mjs";
import { i as resolveChannelHealthState, n as DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS, t as DEFAULT_CHANNEL_CONNECT_GRACE_MS } from "./channel-health-policy-DnqLKLPL.mjs";
import { n as resolveHealthAccountContext, t as buildNonSensitiveProbeFailure } from "./account-context-dw-LRIHx.mjs";
import { n as listPluginServiceHealthFailures } from "./service-health-CNd0D8uW.mjs";
import { n as captureDeliveryQueueHealthContext, r as buildContextEngineHealthSummary, t as buildDeliveryQueueHealthSummary } from "./delivery-queue-yvZ4HtW7.mjs";
//#region src/gateway/health/collector.ts
const HEALTH_COLLECTION_TIMEOUT_MS = 7e3;
const HEALTH_PROBE_CONCURRENCY = 5;
const HEALTH_RECENT_SESSION_LIMIT = 5;
const healthLog = createSubsystemLogger("health");
const debugHealth = (cfg, message, meta) => {
	if (isDiagnosticFlagEnabled("health", cfg)) healthLog.info(message, meta);
};
function resolveHealthAgentOrder(cfg) {
	const defaultAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	const entries = listAgentEntries(cfg);
	const seen = /* @__PURE__ */ new Set();
	const ordered = [];
	for (const entry of entries) {
		if (!entry || typeof entry !== "object") continue;
		if (typeof entry.id !== "string" || !entry.id.trim()) continue;
		const id = normalizeAgentId(entry.id);
		if (!id || seen.has(id)) continue;
		seen.add(id);
		ordered.push({
			id,
			name: typeof entry.name === "string" ? entry.name : void 0
		});
	}
	if (defaultAgentId && !seen.has(defaultAgentId)) ordered.unshift({ id: defaultAgentId });
	return {
		defaultAgentId,
		ordered
	};
}
async function createHealthSessionStoreReader(agentIds, projection) {
	const { createStatusSessionStoreReader } = await import("./session-stores-CelRd1k9.mjs");
	const { readSessionStoreSummaryReadOnly } = await import("./session-accessor-7aJzTlyp.mjs");
	const { isTransientSqliteError } = await import("./unhandled-rejections-BrGfFgus.mjs");
	return createStatusSessionStoreReader(agentIds, HEALTH_RECENT_SESSION_LIMIT, {
		projection,
		readSummary: readSessionStoreSummaryReadOnly,
		recoverReadError(error) {
			if (!isTransientSqliteError(error)) throw error;
			return {
				count: 0,
				recent: [],
				byAgent: /* @__PURE__ */ new Map()
			};
		}
	});
}
function projectHealthSessions(path, summary) {
	const recent = summary.recent.map(({ sessionKey: key, entry }) => ({
		key,
		updatedAt: entry.updatedAt || null,
		age: entry.updatedAt ? Date.now() - entry.updatedAt : null
	}));
	return {
		path,
		count: summary.count,
		recent
	};
}
async function buildHealthSessionSummary(storePath, agentId, projection) {
	const store = await (await createHealthSessionStoreReader(agentId ? [agentId] : [], projection)).read(storePath, agentId);
	return projectHealthSessions(store.path, store);
}
/** Shares one bounded session snapshot across every configured agent in this collection. */
async function buildHealthAgentSummaries(cfg, { defaultAgentId, ordered }, projection) {
	const agentIds = ordered.map((entry) => entry.id);
	const reader = await createHealthSessionStoreReader(agentIds, projection);
	const heartbeats = resolveHeartbeatSummariesForAgents(cfg, agentIds);
	const agents = [];
	for (const [index, entry] of ordered.entries()) {
		const store = await reader.read(resolveSessionStorePathCore(cfg.session?.store, { agentId: entry.id }), entry.id);
		agents.push({
			agentId: entry.id,
			name: entry.name,
			isDefault: entry.id === defaultAgentId,
			heartbeat: expectDefined(heartbeats[index], "heartbeat summary"),
			sessions: projectHealthSessions(store.path, store)
		});
	}
	return agents;
}
function buildPluginHealthSummary(cfg) {
	function projectError(plugin, error) {
		return {
			...error,
			activationSource: plugin?.activationSource,
			activationReason: plugin?.activationReason,
			error: truncateUtf16Safe(redactToolPayloadTextWithConfig(error.error, cfg.logging), 1e3)
		};
	}
	const registry = getActivePluginRegistry();
	const degradedPlugins = listActiveDegradedPlugins();
	const unavailable = degradedPlugins.map(({ pluginId, state, diagnostic }) => ({
		id: pluginId,
		state,
		diagnostic: toPublicPluginVerificationDiagnostic(diagnostic)
	})).toSorted((left, right) => left.id.localeCompare(right.id));
	const loaded = (registry?.plugins ?? []).filter((plugin) => plugin.status === "loaded").map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
	const loadErrors = (registry?.plugins ?? []).filter((plugin) => plugin.status === "error" && !degradedPlugins.some((degraded) => plugin.id === degraded.pluginId && plugin.failurePhase === "validation" && plugin.activationReason === `configured-unavailable: ${degraded.diagnostic.reason}` && Boolean(plugin.rootDir) && degradedPluginMatchesRoot(degraded, plugin.rootDir ?? ""))).map((plugin) => projectError(plugin, {
		id: plugin.id,
		origin: plugin.origin,
		activated: plugin.activated === true,
		error: plugin.error ?? "unknown plugin load error",
		...plugin.failurePhase ? { failurePhase: plugin.failurePhase } : {}
	}));
	const serviceErrors = registry ? listPluginServiceHealthFailures(registry).map((failure) => projectError(registry.plugins.find((entry) => entry.id === failure.pluginId), {
		id: failure.pluginId,
		origin: failure.origin,
		activated: true,
		failurePhase: "service",
		error: `service ${failure.serviceId}: ${failure.error}`
	})) : [];
	const errors = [...loadErrors, ...serviceErrors].toSorted((left, right) => left.id.localeCompare(right.id) || left.error.localeCompare(right.error));
	if (loaded.length === 0 && errors.length === 0 && unavailable.length === 0) return;
	return {
		loaded,
		errors,
		unavailable
	};
}
const healthOperationPermits = createPermitPool(HEALTH_PROBE_CONCURRENCY);
function buildHealthTimeoutRecord(accountId, timeoutMs) {
	const error = `health collection timed out after ${timeoutMs}ms`;
	return {
		accountId,
		lastError: error,
		probe: {
			ok: false,
			timedOut: true,
			error
		}
	};
}
function resolveHealthProbeTimeoutMs(deadlineAtMs) {
	return Math.max(1, deadlineAtMs - Date.now());
}
async function buildHealthAccountRecord(params) {
	const timedOut = () => buildHealthTimeoutRecord(params.accountId, params.timeoutMs);
	const runtimeAccount = params.runtimeSnapshot?.channelAccounts[params.plugin.id]?.[params.accountId];
	const runtimeSnapshot = runtimeAccount ?? (params.accountId === params.defaultAccountId ? params.runtimeSnapshot?.channels[params.plugin.id] : void 0);
	if (params.runtimeOnly && runtimeAccount) {
		const snapshot = buildChannelAccountSnapshotFromRuntime(runtimeAccount);
		const unavailable = resolveUnavailableChannelAccountSnapshot(params.cfg, {
			channelId: params.plugin.id,
			accountId: params.accountId,
			runtime: snapshot
		});
		if (unavailable) return unavailable;
		const healthState = resolveChannelHealthState(snapshot, {
			channelId: params.plugin.id,
			now: Date.now(),
			staleEventThresholdMs: DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS,
			channelConnectGraceMs: DEFAULT_CHANNEL_CONNECT_GRACE_MS
		});
		return {
			...snapshot,
			...healthState !== void 0 ? { healthState } : {}
		};
	}
	const unavailable = resolveUnavailableChannelAccountSnapshot(params.cfg, {
		channelId: params.plugin.id,
		accountId: params.accountId,
		runtime: runtimeSnapshot
	});
	if (unavailable) return unavailable;
	const { probeAccount, inspectedAccount, enabled, configured, diagnostics } = await resolveHealthAccountContext({
		plugin: params.plugin,
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (Date.now() >= params.deadlineAtMs) return timedOut();
	if (diagnostics.length > 0) debugHealth(params.cfg, "account.diagnostics", {
		channel: params.plugin.id,
		accountId: params.accountId,
		diagnostics
	});
	let probe;
	let lastProbeAt = null;
	if (probeAccount !== void 0 && enabled && configured === true && params.probe && params.plugin.status?.probeAccount) try {
		probe = await params.plugin.status.probeAccount({
			account: probeAccount,
			timeoutMs: resolveHealthProbeTimeoutMs(params.deadlineAtMs),
			cfg: params.cfg
		});
		lastProbeAt = Date.now();
	} catch (error) {
		probe = {
			ok: false,
			error: formatErrorMessage(error)
		};
		lastProbeAt = Date.now();
	}
	if (Date.now() >= params.deadlineAtMs) return timedOut();
	const probeRecord = probe && typeof probe === "object" ? probe : null;
	const bot = probeRecord && typeof probeRecord.bot === "object" ? probeRecord.bot : null;
	if (bot?.username) debugHealth(params.cfg, "probe.bot", {
		channel: params.plugin.id,
		accountId: params.accountId,
		username: bot.username
	});
	const nonSensitiveProbeFailure = buildNonSensitiveProbeFailure(params.plugin.id, probe);
	const snapshotProbe = params.includeSensitive ? probe : nonSensitiveProbeFailure;
	const snapshot = probeAccount === void 0 ? buildChannelAccountSnapshotFromInspection({
		account: inspectedAccount,
		accountId: params.accountId,
		runtime: runtimeSnapshot,
		probe: snapshotProbe
	}) : await buildChannelAccountSnapshotFromAccount({
		plugin: params.plugin,
		cfg: params.cfg,
		accountId: params.accountId,
		account: probeAccount,
		runtime: runtimeSnapshot,
		probe: snapshotProbe,
		enabledFallback: enabled,
		configuredFallback: configured
	});
	if (Date.now() >= params.deadlineAtMs) return timedOut();
	if (lastProbeAt) snapshot.lastProbeAt = lastProbeAt;
	const healthState = resolveChannelHealthState(snapshot, {
		channelId: params.plugin.id,
		now: Date.now(),
		staleEventThresholdMs: DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS,
		channelConnectGraceMs: DEFAULT_CHANNEL_CONNECT_GRACE_MS
	});
	if (healthState !== void 0) snapshot.healthState = healthState;
	const summary = probeAccount !== void 0 && params.plugin.status?.buildChannelSummary ? await params.plugin.status.buildChannelSummary({
		account: probeAccount,
		cfg: params.cfg,
		defaultAccountId: params.accountId,
		snapshot
	}) : void 0;
	if (Date.now() >= params.deadlineAtMs) return timedOut();
	const record = redactChannelStatusSummaryBaseUrl(summary && typeof summary === "object" ? {
		...snapshot,
		...summary
	} : {
		...snapshot,
		accountId: params.accountId
	});
	if (record.configured === void 0 && probeAccount !== void 0) record.configured = configured;
	if (params.includeSensitive && record.probe === void 0 && probe !== void 0) record.probe = probe;
	if (!params.includeSensitive) {
		const safeProbeFailure = buildNonSensitiveProbeFailure(params.plugin.id, record.probe) ?? nonSensitiveProbeFailure;
		if (safeProbeFailure) record.probe = safeProbeFailure;
		else delete record.probe;
	}
	if (record.lastProbeAt === void 0 && lastProbeAt) record.lastProbeAt = lastProbeAt;
	record.accountId = params.accountId;
	return record;
}
async function runHealthAccountWithinDeadline(params) {
	const operation = trackAsyncWork(async () => {
		const release = await healthOperationPermits.acquire({ deadlineAtMs: params.deadlineAtMs });
		if (!release) return buildHealthTimeoutRecord(params.accountId, params.timeoutMs);
		try {
			return await buildHealthAccountRecord(params);
		} finally {
			release();
		}
	});
	const result = await awaitWithinDeadline(() => operation, params.deadlineAtMs);
	return result === ABSOLUTE_DEADLINE_EXPIRED ? buildHealthTimeoutRecord(params.accountId, params.timeoutMs) : result;
}
/** Collects the gateway-owned health snapshot for an explicit trust audience. */
async function collectGatewayHealthSnapshot(params) {
	const stateContext = captureDeliveryQueueHealthContext();
	const start = Date.now();
	const timeoutMs = Math.min(resolveTimerTimeoutMs(params.timeoutMs, HEALTH_COLLECTION_TIMEOUT_MS, 50), HEALTH_COLLECTION_TIMEOUT_MS);
	const deadlineAtMs = start + timeoutMs;
	const cfg = await readRuntimeHealthConfig();
	const { defaultAgentId, ordered } = resolveHealthAgentOrder(cfg);
	const channelBindings = buildChannelAccountBindings(cfg);
	const agents = await buildHealthAgentSummaries(cfg, {
		defaultAgentId,
		ordered
	}, params.sessionRowProjection);
	const summaryAgent = agents.find((agent) => agent.isDefault) ?? agents[0];
	const configuredHeartbeatAgentId = normalizeOptionalString(cfg.agents?.defaults?.heartbeat?.agentId);
	const heartbeatSummaryAgent = (configuredHeartbeatAgentId ? agents.find((agent) => agent.heartbeat.enabled && agent.agentId === normalizeAgentId(configuredHeartbeatAgentId)) : void 0) ?? agents.find((agent) => agent.heartbeat.enabled) ?? summaryAgent;
	const heartbeatSeconds = heartbeatSummaryAgent?.heartbeat.everyMs ? Math.round(heartbeatSummaryAgent.heartbeat.everyMs / 1e3) : 0;
	const sessions = summaryAgent?.sessions ?? await buildHealthSessionSummary(resolveSessionStorePathCore(cfg.session?.store, { agentId: summaryAgent?.agentId }), summaryAgent?.agentId, params.sessionRowProjection);
	const includeSensitive = params.audience === "admin";
	const channels = {};
	const plugins = listReadOnlyChannelPluginsForConfig(cfg, {
		includeSetupFallbackPlugins: false,
		includePersistedAuthState: false
	});
	const channelOrder = plugins.map((plugin) => plugin.id);
	const channelLabels = {};
	const channelPlans = plugins.map((plugin) => {
		channelLabels[plugin.id] = plugin.meta.label ?? plugin.id;
		const accountIds = plugin.config.listAccountIds(cfg);
		const defaultAccountId = resolveChannelDefaultAccountId({
			plugin,
			cfg,
			accountIds
		});
		const boundAccounts = defaultAgentId ? channelBindings.get(plugin.id)?.get(defaultAgentId) ?? [] : [];
		const preferredAccountId = resolvePreferredAccountId({
			accountIds,
			defaultAccountId,
			boundAccounts
		});
		const boundAccountIdsAll = Array.from(new Set(Array.from(channelBindings.get(plugin.id)?.values() ?? []).flat()));
		const accountIdsToProbe = Array.from(new Set([
			preferredAccountId,
			defaultAccountId,
			...accountIds,
			...boundAccountIdsAll,
			...Object.keys(params.runtimeSnapshot?.channelAccounts[plugin.id] ?? {})
		].filter((value) => value && value.trim())));
		debugHealth(cfg, "channel", {
			id: plugin.id,
			accountIds,
			defaultAccountId,
			boundAccounts,
			preferredAccountId,
			accountIdsToProbe
		});
		return {
			plugin,
			defaultAccountId,
			preferredAccountId,
			accountIds: accountIdsToProbe,
			configuredAccountIds: new Set(accountIds),
			accountSummaries: {}
		};
	});
	const accountTasks = channelPlans.flatMap((plan) => plan.accountIds.map((accountId) => ({
		plan,
		accountId
	})));
	const { results: accountResults } = await runTasksWithConcurrency({
		tasks: accountTasks.map(({ plan, accountId }) => async () => ({
			plan,
			accountId,
			record: await runHealthAccountWithinDeadline({
				plugin: plan.plugin,
				cfg,
				accountId,
				defaultAccountId: plan.defaultAccountId,
				includeSensitive,
				probe: params.probe,
				deadlineAtMs,
				timeoutMs,
				runtimeSnapshot: params.runtimeSnapshot,
				runtimeOnly: !plan.configuredAccountIds.has(accountId)
			})
		})),
		limit: params.probe ? HEALTH_PROBE_CONCURRENCY : 1,
		throwOnError: true
	});
	for (const result of accountResults) if (result) result.plan.accountSummaries[result.accountId] = result.record;
	for (const plan of channelPlans) {
		const fallbackSummary = plan.accountSummaries[plan.preferredAccountId] ?? plan.accountSummaries[plan.defaultAccountId] ?? plan.accountSummaries[plan.accountIds[0] ?? plan.preferredAccountId] ?? plan.accountSummaries[expectDefined(Object.keys(plan.accountSummaries)[0], "object.keys(account summaries) entry at 0")];
		if (fallbackSummary) channels[plan.plugin.id] = {
			...fallbackSummary,
			accounts: plan.accountSummaries
		};
	}
	const pluginHealth = buildPluginHealthSummary(cfg);
	const contextEngineHealth = buildContextEngineHealthSummary();
	const deliveryQueueHealth = await buildDeliveryQueueHealthSummary(void 0, stateContext);
	return {
		ok: true,
		ts: Date.now(),
		durationMs: Date.now() - start,
		...params.eventLoop ? { eventLoop: params.eventLoop } : {},
		...pluginHealth ? { plugins: pluginHealth } : {},
		...contextEngineHealth ? { contextEngines: contextEngineHealth } : {},
		...deliveryQueueHealth ? { deliveryQueues: deliveryQueueHealth } : {},
		...params.configReloadHotReloadStatus ? { configReload: { hotReloadStatus: params.configReloadHotReloadStatus } } : {},
		channels,
		channelOrder,
		channelLabels,
		heartbeatSeconds,
		...defaultAgentId ? { defaultAgentId } : {},
		agents,
		sessions: {
			path: sessions.path,
			count: sessions.count,
			recent: sessions.recent
		}
	};
}
async function readRuntimeHealthConfig() {
	const { getRuntimeConfig } = await import("./config/config.js");
	return getRuntimeConfig();
}
//#endregion
export { buildHealthAgentSummaries, collectGatewayHealthSnapshot, resolveHealthAgentOrder };
