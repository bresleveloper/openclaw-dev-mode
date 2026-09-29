import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as applyLoggingConfig } from "./logger--ALOusOG.mjs";
import { r as resolveOsSummary } from "./os-summary-B-12bRQs.mjs";
import { t as measureCliCommandStartup } from "./command-startup-timing-CoumbNZT.mjs";
import { t as resolveGatewayAuthTokenSourceConflict } from "./auth-token-source-conflict-l9swrDqQ.mjs";
import { n as resolveStatusGatewayProbeTimeoutMs } from "./status.gateway-probe-budget-DkP8SzQT.mjs";
import { n as createStatusScanCoreBootstrap, t as buildColdStartStatusSummary } from "./status.scan.bootstrap-shared--TvYEDAa.mjs";
//#region src/commands/status.scan-overview.ts
const statusScanDepsRuntimeModuleLoader = createLazyImportLoader(() => import("./status.scan.deps.runtime.js"));
const statusAgentLocalModuleLoader = createLazyImportLoader(() => import("./status.agent-local-DNbit1OU.mjs"));
const statusUpdateModuleLoader = createLazyImportLoader(() => import("./status.update-B1JNGO5F.mjs"));
const statusScanRuntimeModuleLoader = createLazyImportLoader(() => import("./status.scan.runtime.js"));
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-bfuNQIMk.mjs"));
const statusSummaryModuleLoader = createLazyImportLoader(() => import("./summary-hiMa5ckf.mjs"));
const channelPluginIdsModuleLoader = createLazyImportLoader(() => import("./channel-plugin-ids-X7o5dd0e.mjs"));
const configModuleLoader = createLazyImportLoader(() => import("./config/config.js"));
const controlUiLinksModuleLoader = createLazyImportLoader(() => import("./control-ui-links-CLd-5Gpl.mjs"));
const commandConfigResolutionModuleLoader = createLazyImportLoader(() => import("./command-config-resolution-D6QkMDPK.mjs"));
const commandSecretTargetsModuleLoader = createLazyImportLoader(() => import("./command-secret-targets-DYwATAS3.mjs"));
async function resolveStatusChannelsStatus(params) {
	if (!params.gatewayReachable) return null;
	const { callGateway } = await gatewayCallModuleLoader.load();
	const timeoutMs = resolveStatusGatewayProbeTimeoutMs(params.opts);
	if (timeoutMs === 0) return null;
	return await callGateway({
		config: params.cfg,
		configPath: params.configPath,
		method: "channels.status",
		params: {
			probe: false,
			timeoutMs: Math.min(8e3, timeoutMs)
		},
		timeoutMs,
		...params.useGatewayCallOverrides === true ? params.gatewayCallOverrides ?? {} : {}
	}).catch(() => null);
}
/** Collects the common status scan data shared by text, JSON, and status-all commands. */
async function collectStatusScanOverview(params) {
	const env = params.env ?? process.env;
	if (params.labels?.loadingConfig) params.progress?.setLabel(params.labels.loadingConfig);
	const { snapshot } = await measureCliCommandStartup("status.config", async () => (await import("./command-config-snapshot-Ckcptpih.mjs")).readCommandConfigSnapshot({
		observe: false,
		skipPluginValidation: true
	}), { env });
	const testRuntime = env.VITEST === "true" || env.VITEST_POOL_ID !== void 0 || env.NODE_ENV === "test";
	const coldStart = !snapshot.exists && !(params.allowMissingConfigFastPath && testRuntime);
	const skipMissingConfig = coldStart && params.allowMissingConfigFastPath === true;
	const sourceConfig = skipMissingConfig ? {} : snapshot.sourceConfig;
	const loadedConfig = skipMissingConfig ? {} : snapshot.runtimeConfig;
	const configDiagnostics = skipMissingConfig || snapshot.valid ? null : {
		path: snapshot.path,
		issues: snapshot.issues
	};
	const { resolvedConfig: cfg, diagnostics } = skipMissingConfig ? {
		resolvedConfig: loadedConfig,
		diagnostics: []
	} : await measureCliCommandStartup("status.secrets", () => commandConfigResolutionModuleLoader.load().then(async ({ resolveCommandConfigWithSecrets }) => resolveCommandConfigWithSecrets({
		config: loadedConfig,
		commandName: params.commandName,
		targetIds: (await commandSecretTargetsModuleLoader.load()).getStatusCommandSecretTargetIds(loadedConfig, env),
		mode: "read_only_status",
		gatewaySecretResolveTimeoutMs: resolveStatusGatewayProbeTimeoutMs(params.opts),
		...params.runtime ? { runtime: params.runtime } : {}
	})), { env });
	const tokenConflict = resolveGatewayAuthTokenSourceConflict({
		cfg: sourceConfig,
		env
	});
	const secretDiagnostics = tokenConflict ? [...diagnostics, tokenConflict.diagnostic] : diagnostics;
	applyLoggingConfig(cfg.logging);
	params.progress?.tick();
	const hasConfiguredChannels = params.resolveHasConfiguredChannels ? await params.resolveHasConfiguredChannels(cfg, sourceConfig) : await channelPluginIdsModuleLoader.load().then(({ hasConfiguredChannelsForReadOnlyScope }) => hasConfiguredChannelsForReadOnlyScope({
		config: cfg,
		activationSourceConfig: sourceConfig
	}));
	const osSummary = resolveOsSummary();
	let sessionStores;
	const bootstrap = await createStatusScanCoreBootstrap({
		coldStart,
		cfg,
		configPath: snapshot.path,
		env,
		hasConfiguredChannels,
		opts: params.opts,
		skipUpdateCheck: params.skipUpdateCheck,
		fetchGitUpdate: params.fetchGitUpdate,
		includeRegistryUpdate: params.includeRegistryUpdate,
		includeLocalStatusRpcFallback: params.includeLocalStatusRpcFallback,
		gatewaySnapshot: params.gatewaySnapshot,
		onGatewayProgress: params.progress ? (phase) => {
			const message = `Gateway still starting (phase ${phase})`;
			params.progress?.setLabel(message);
			if (!process.stderr.isTTY) (params.runtime ?? defaultRuntime).log(message);
		} : void 0,
		getTailnetHostname: async (runner) => {
			return await statusScanDepsRuntimeModuleLoader.load().then(({ getTailnetHostname }) => getTailnetHostname(runner));
		},
		getUpdateCheckResult: async (updateParams) => await statusUpdateModuleLoader.load().then(({ getUpdateCheckResult }) => getUpdateCheckResult(updateParams)),
		getAgentLocalStatuses: async (bootstrapCfg) => await measureCliCommandStartup("status.local-agents", () => statusAgentLocalModuleLoader.load().then(async ({ collectStatusLocalSnapshot }) => {
			const local = await collectStatusLocalSnapshot(bootstrapCfg);
			sessionStores = local.sessionStores;
			return local.agentStatus;
		}), {
			config: cfg,
			env
		})
	});
	if (params.labels?.checkingTailscale) params.progress?.setLabel(params.labels.checkingTailscale);
	const tailscaleDns = await bootstrap.tailscaleDnsPromise;
	params.progress?.tick();
	if (params.labels?.checkingForUpdates) params.progress?.setLabel(params.labels.checkingForUpdates);
	const update = await bootstrap.updatePromise;
	params.progress?.tick();
	if (params.labels?.resolvingAgents) params.progress?.setLabel(params.labels.resolvingAgents);
	const agentStatus = await bootstrap.agentStatusPromise;
	params.progress?.tick();
	if (params.labels?.probingGateway) params.progress?.setLabel(params.labels.probingGateway);
	const gatewaySnapshot = await bootstrap.gatewayProbePromise;
	params.progress?.tick();
	let runtimeDegradation = null;
	if (gatewaySnapshot.gatewayReachable) {
		const status = gatewaySnapshot.gatewayProbe?.status ?? (resolveStatusGatewayProbeTimeoutMs(params.opts) > 0 ? await measureCliCommandStartup("status.gateway-degradation", () => gatewayCallModuleLoader.load().then(({ callGateway }) => callGateway({
			config: cfg,
			configPath: snapshot.path,
			method: "status",
			params: { includeChannelSummary: false },
			timeoutMs: Math.min(5e3, resolveStatusGatewayProbeTimeoutMs(params.opts)),
			...gatewaySnapshot.gatewayCallOverrides
		}).catch(() => null)), {
			config: cfg,
			env
		}) : null);
		runtimeDegradation = status ? {
			degradedSecretOwners: status.degradedSecretOwners ?? [],
			degradedPlugins: status.degradedPlugins ?? [],
			startupMigrationWarning: status.startupMigrationWarning,
			installationReplacementWarning: status.installationReplacementWarning,
			secretEgressProxy: status.secretEgressProxy,
			sqliteWal: status.sqliteWal,
			...status.heartbeat ? { heartbeat: status.heartbeat } : {}
		} : null;
	}
	const tailscaleHttpsUrl = await bootstrap.resolveTailscaleHttpsUrl();
	const advertisedControlUiLinks = params.includeAdvertisedControlUiLinks === true && cfg.gateway?.controlUi?.enabled !== false ? await controlUiLinksModuleLoader.load().then(async ({ resolveAdvertisedControlUiLinks }) => resolveAdvertisedControlUiLinks({
		port: (await configModuleLoader.load()).resolveGatewayPort(cfg),
		bind: cfg.gateway?.bind,
		customBindHost: cfg.gateway?.customBindHost,
		basePath: cfg.gateway?.controlUi?.basePath,
		tlsEnabled: cfg.gateway?.tls?.enabled === true
	})) : void 0;
	const includeChannelsData = params.includeChannelsData !== false;
	const includeLiveChannelStatus = params.includeLiveChannelStatus !== false;
	const { channelsStatus, channelIssues, channels } = includeChannelsData ? await (async () => {
		if (params.labels?.queryingChannelStatus) params.progress?.setLabel(params.labels.queryingChannelStatus);
		const channelsStatusLocal = includeLiveChannelStatus ? await resolveStatusChannelsStatus({
			cfg,
			configPath: snapshot.path,
			gatewayReachable: gatewaySnapshot.gatewayReachable,
			opts: params.opts,
			gatewayCallOverrides: gatewaySnapshot.gatewayCallOverrides,
			useGatewayCallOverrides: params.useGatewayCallOverridesForChannelsStatus
		}) : null;
		params.progress?.tick();
		const { collectChannelStatusIssues, buildChannelsTable } = await statusScanRuntimeModuleLoader.load().then(({ statusScanRuntime }) => statusScanRuntime);
		const channelIssuesLocal = channelsStatusLocal ? collectChannelStatusIssues(channelsStatusLocal) : [];
		if (params.labels?.summarizingChannels) params.progress?.setLabel(params.labels.summarizingChannels);
		const channelsLocal = await buildChannelsTable(cfg, {
			showSecrets: params.showSecrets,
			sourceConfig,
			includeSetupFallbackPlugins: params.includeChannelSetupRuntimeFallback !== false,
			liveChannelStatus: channelsStatusLocal
		});
		params.progress?.tick();
		return {
			channelsStatus: channelsStatusLocal,
			channelIssues: channelIssuesLocal,
			channels: channelsLocal
		};
	})() : {
		channelsStatus: null,
		channelIssues: [],
		channels: {
			rows: [],
			details: []
		}
	};
	return {
		env,
		coldStart,
		hasConfiguredChannels,
		skipColdStartNetworkChecks: bootstrap.skipColdStartNetworkChecks,
		cfg,
		sourceConfig,
		configDiagnostics,
		secretDiagnostics,
		osSummary,
		tailscaleMode: bootstrap.tailscaleMode,
		tailscaleDns,
		tailscaleHttpsUrl,
		...advertisedControlUiLinks ? { advertisedControlUiLinks } : {},
		update,
		gatewaySnapshot,
		runtimeDegradation,
		channelsStatus,
		channelIssues,
		channels,
		agentStatus,
		...sessionStores ? { sessionStores } : {}
	};
}
/** Resolves the summary object from overview data, preserving cold-start fast-path behavior. */
async function resolveStatusSummaryFromOverview(params) {
	if (params.overview.skipColdStartNetworkChecks) return buildColdStartStatusSummary();
	const summary = await measureCliCommandStartup("status.summary", () => statusSummaryModuleLoader.load().then(({ getStatusSummary }) => getStatusSummary({
		config: params.overview.cfg,
		sourceConfig: params.overview.sourceConfig,
		includeChannelSummary: false,
		...params.overview.sessionStores ? { sessionStores: params.overview.sessionStores } : {}
	})), { config: params.overview.cfg });
	return params.overview.runtimeDegradation ? {
		...summary,
		...params.overview.runtimeDegradation
	} : summary;
}
//#endregion
export { resolveStatusSummaryFromOverview as n, collectStatusScanOverview as t };
