import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as applyLoggingConfig } from "./logger-DR3u4tgD.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as resolveOsSummary } from "./os-summary-DH0HB36b.mjs";
import { t as measureCliCommandStartup } from "./command-startup-timing-D_8pGzNy.mjs";
import { t as resolveGatewayAuthTokenSourceConflict } from "./auth-token-source-conflict-CrqdtV2M.mjs";
import { n as resolveStatusGatewayProbeTimeoutMs } from "./status.gateway-probe-budget-DyNYY-tA.mjs";
import { n as createStatusScanCoreBootstrap, t as buildColdStartStatusSummary } from "./status.scan.bootstrap-shared-i926FRkG.mjs";
//#region src/commands/status.scan-overview.ts
const statusScanDepsRuntimeModuleLoader = createLazyImportLoader(() => import("./status.scan.deps.runtime.js"));
const statusAgentLocalModuleLoader = createLazyImportLoader(() => import("./status.agent-local-mDdO5X_f.mjs"));
const statusUpdateModuleLoader = createLazyImportLoader(() => import("./status.update-CoJomRVD.mjs"));
const statusScanRuntimeModuleLoader = createLazyImportLoader(() => import("./status.scan.runtime.js"));
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-BvbeEASg.mjs"));
const statusSummaryModuleLoader = createLazyImportLoader(() => import("./summary-uRX04kc4.mjs"));
const channelPluginIdsModuleLoader = createLazyImportLoader(() => import("./channel-plugin-ids-Boz_oeW_.mjs"));
const configModuleLoader = createLazyImportLoader(() => import("./config/config.js"));
const controlUiLinksModuleLoader = createLazyImportLoader(() => import("./control-ui-links-L6dgq0Eo.mjs"));
const commandConfigResolutionModuleLoader = createLazyImportLoader(() => import("./command-config-resolution-Bz9tQ_x8.mjs"));
const commandSecretTargetsModuleLoader = createLazyImportLoader(() => import("./command-secret-targets-BF6Ekt_4.mjs"));
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
	const setProgressLabel = (key) => {
		const label = params.labels?.[key];
		if (label) params.progress?.setLabel(label);
	};
	setProgressLabel("loadingConfig");
	const { snapshot } = await measureCliCommandStartup("status.config", async () => (await import("./command-config-snapshot-xZKlxU0e.mjs")).readCommandConfigSnapshot({
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
	setProgressLabel("checkingTailscale");
	const tailscaleDns = await bootstrap.tailscaleDnsPromise;
	params.progress?.tick();
	setProgressLabel("checkingForUpdates");
	const update = await bootstrap.updatePromise;
	params.progress?.tick();
	setProgressLabel("resolvingAgents");
	const agentStatus = await bootstrap.agentStatusPromise;
	params.progress?.tick();
	setProgressLabel("probingGateway");
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
			...params.opts.deep && status.childRuntime ? { childRuntime: status.childRuntime } : {},
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
	let channelsStatus = null;
	let channelIssues = [];
	let channels = {
		rows: [],
		details: []
	};
	if (params.includeChannelsData !== false) {
		setProgressLabel("queryingChannelStatus");
		channelsStatus = params.includeLiveChannelStatus !== false ? await resolveStatusChannelsStatus({
			cfg,
			configPath: snapshot.path,
			gatewayReachable: gatewaySnapshot.gatewayReachable,
			opts: params.opts,
			gatewayCallOverrides: gatewaySnapshot.gatewayCallOverrides,
			useGatewayCallOverrides: params.useGatewayCallOverridesForChannelsStatus
		}) : null;
		params.progress?.tick();
		const { statusScanRuntime: { collectChannelStatusIssues, buildChannelsTable } } = await statusScanRuntimeModuleLoader.load();
		channelIssues = channelsStatus ? collectChannelStatusIssues(channelsStatus) : [];
		setProgressLabel("summarizingChannels");
		channels = await buildChannelsTable(cfg, {
			showSecrets: params.showSecrets,
			sourceConfig,
			includeSetupFallbackPlugins: params.includeChannelSetupRuntimeFallback !== false,
			liveChannelStatus: channelsStatus
		});
		params.progress?.tick();
	}
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
