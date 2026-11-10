import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { l as normalizeSortedUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import "./utils-gjJ-tD2q.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { a as getResolvedLoggerSettings } from "./logger-DR3u4tgD.mjs";
import { i as getTrackedWorkerLifecycleSnapshot } from "./worker-cpu-c5lFIb1t.mjs";
import { a as ensureSqliteLibrarySelected, o as getSqliteRuntimeCapabilities } from "./bun-sqlite-library-CYR1RYZS.mjs";
import { r as getWorkerComputeCapacity } from "./worker-task-pool-D6ogd941.mjs";
import { w as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { i as DEFAULT_PROVIDER, n as DEFAULT_MODEL } from "./defaults-Bg930vxE.mjs";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-CYadf-lt.mjs";
import { h as resolveConfiguredModelRef, r as buildConfiguredModelCatalog } from "./model-selection-shared-CVU_V2PQ.mjs";
import { n as resolveConfiguredThinkingDefaultCore, r as resolveThinkingDefaultCore } from "./model-thinking-default-BKqBSSHy.mjs";
import "./logging-DuTp4Ty7.mjs";
import { c as formatFastModeValue } from "./fast-mode-smSVCJXN.mjs";
import { t as resolveFastModeState } from "./fast-mode-DezNRstT.mjs";
import { t as collectEnabledInsecureOrDangerousFlagsFromContracts } from "./dangerous-config-flags-core-BH0aIzlX.mjs";
import chalk from "chalk";
//#region src/security/dangerous-config-flags-current.ts
/**
* Collect dangerous flags using the gateway's current plugin metadata snapshot when it is complete.
* Returns undefined when any configured plugin is missing so callers can use manifest discovery.
*/
function collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot(cfg) {
	const pluginEntries = cfg.plugins?.entries;
	if (!isRecord(pluginEntries)) return collectEnabledInsecureOrDangerousFlagsFromContracts(cfg);
	const snapshot = getCurrentPluginMetadataSnapshot({
		config: cfg,
		env: process.env,
		allowWorkspaceScopedSnapshot: true
	});
	if (!snapshot) return;
	const contractsById = /* @__PURE__ */ new Map();
	for (const pluginId of Object.keys(pluginEntries)) {
		const normalizedPluginId = snapshot.normalizePluginId(pluginId);
		const plugin = snapshot.byPluginId.get(pluginId) ?? snapshot.byPluginId.get(normalizedPluginId);
		if (!plugin) return;
		if (!plugin.configContracts) continue;
		contractsById.set(pluginId, {
			origin: plugin.origin,
			configContracts: plugin.configContracts
		});
	}
	return collectEnabledInsecureOrDangerousFlagsFromContracts(cfg, {
		collectPluginConfigContractMatches,
		configContractsById: contractsById
	});
}
//#endregion
//#region src/gateway/server-startup-log.ts
/** Emit startup summary lines after Gateway bind and plugin loading complete. */
async function logGatewayStartup(params) {
	const { provider: agentProvider, model: agentModel } = resolveConfiguredModelRef({
		cfg: params.cfg,
		agentId: tryResolveAmbientOwnerAgentId(params.cfg),
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const agentModelLog = formatAgentModelStartupLogLine({
		cfg: params.cfg,
		provider: agentProvider,
		model: agentModel
	});
	params.log.info(agentModelLog.message, { consoleMessage: agentModelLog.consoleMessage });
	const startupDurationMs = typeof params.startupStartedAt === "number" ? Date.now() - params.startupStartedAt : null;
	const startupDurationLabel = startupDurationMs == null ? null : `${(startupDurationMs / 1e3).toFixed(1)}s`;
	params.log.info(`http server listening (${formatReadyDetails(params.loadedPluginIds, startupDurationLabel)})`);
	params.log.info(`log file: ${getResolvedLoggerSettings().file}`);
	params.log.info("Older local CLI/SDK versions can bypass Gateway state mutation routing. Use matching CLI/SDK and Gateway versions; direct state writes from another process while this Gateway owns state are unsupported.");
	const sqliteLibrary = ensureSqliteLibrarySelected();
	params.log.info(`native runtime: ${JSON.stringify({
		pid: process.pid,
		platform: process.platform,
		arch: process.arch,
		node: process.versions.node,
		bun: process.versions.bun,
		v8: process.versions.v8,
		uv: process.versions.uv,
		openssl: process.versions.openssl,
		sqlite: sqliteLibrary.source === "runtime" ? process.versions.sqlite : sqliteLibrary.version,
		sqliteClose: getSqliteRuntimeCapabilities()
	})}`);
	params.log.info(`worker startup state: ${JSON.stringify({
		...getTrackedWorkerLifecycleSnapshot(),
		compute: getWorkerComputeCapacity().getSnapshot()
	})}`);
	if (sqliteLibrary.source !== "runtime") params.log.info(`SQLite: using ${sanitizeForLog(sqliteLibrary.path)} (${sqliteLibrary.version}, extension loading enabled)`);
	else if (sqliteLibrary.ignoredOverride) params.log.warn(`SQLite: ${sqliteLibrary.ignoredOverride}; override ignored`);
	if (params.isNixMode) params.log.info("gateway: running in Nix mode (config managed externally)");
	for (const warning of await collectConfiguredChannelStartupWarnings({
		cfg: params.cfg,
		activationSourceConfig: params.activationSourceConfig,
		ambientEnvTriggers: params.ambientEnvTriggers,
		env: params.env,
		manifestRecords: params.manifestRecords
	})) params.log.warn(warning);
	const enabledDangerousFlags = collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot(params.cfg) ?? (await import("./dangerous-config-flags-P7IeEDVg.mjs")).collectEnabledInsecureOrDangerousFlags(params.cfg);
	if (enabledDangerousFlags.length > 0) {
		const warning = `security warning: dangerous config flags enabled: ${enabledDangerousFlags.join(", ")}. Run \`openclaw security audit\`.`;
		params.log.warn(warning);
	}
}
/** Format the startup model line from the model ref already selected by the caller. */
function formatAgentModelStartupLogLine(params) {
	const modelRef = `${params.provider}/${params.model}`;
	const modelDetails = formatAgentModelStartupDetails(params);
	return {
		message: `agent model: ${modelRef} (${modelDetails})`,
		consoleMessage: `agent model: ${chalk.whiteBright(modelRef)} (${modelDetails})`
	};
}
function formatAgentModelStartupDetails(params) {
	const soleAgentId = tryResolveAmbientOwnerAgentId(params.cfg);
	let thinking = resolveConfiguredThinkingDefaultCore({
		...params,
		agentId: soleAgentId
	});
	if (thinking === void 0) {
		const configuredCatalog = buildConfiguredModelCatalog({ cfg: params.cfg });
		if (configuredCatalog.some((entry) => entry.provider === params.provider && entry.id === params.model && entry.reasoning === false)) thinking = "off";
		else thinking = resolveThinkingDefaultCore({
			cfg: params.cfg,
			agentId: soleAgentId,
			provider: params.provider,
			model: params.model,
			catalog: configuredCatalog
		});
	}
	const fast = resolveFastModeState({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		agentId: soleAgentId
	});
	return `thinking=${thinking}, fast=${formatFastModeValue(fast.mode)}`;
}
async function collectConfiguredChannelStartupWarnings(params) {
	const [blockerModule, presencePolicyModule] = await Promise.all([import("./channel-plugin-blockers-DiuofGtH.mjs"), import("./channel-presence-policy-B9ZnoKp-.mjs")]);
	const hits = blockerModule.scanConfiguredChannelPluginBlockers(params.cfg, params.env, params.activationSourceConfig, {
		manifestRecords: params.manifestRecords,
		ambientEnvTriggers: params.ambientEnvTriggers
	});
	const blockerWarnings = blockerModule.collectConfiguredChannelPluginBlockerWarnings(hits).map((warning) => `configured channel warning: ${warning.replace(/^[-]\s*/u, "")}`);
	const missingOwnerWarnings = presencePolicyModule.resolveConfiguredChannelPresencePolicy({
		config: params.cfg,
		activationSourceConfig: params.activationSourceConfig,
		env: params.env,
		includePersistedAuthState: false,
		ambientEnvTriggers: params.ambientEnvTriggers,
		manifestRecords: params.manifestRecords
	}).filter((entry) => !entry.effective && entry.blockedReasons.includes("no-channel-owner")).map(formatConfiguredChannelMissingOwnerStartupWarning);
	const suppressedAmbientChannelIds = params.ambientEnvTriggers === "suppress" ? presencePolicyModule.listAmbientOnlyConfiguredChannelIds({
		config: params.cfg,
		activationSourceConfig: params.activationSourceConfig,
		env: params.env,
		includePersistedAuthState: false,
		manifestRecords: params.manifestRecords
	}) : [];
	return [
		...suppressedAmbientChannelIds.length > 0 ? [formatSuppressedAmbientChannelsStartupWarning(suppressedAmbientChannelIds)] : [],
		...blockerWarnings,
		...missingOwnerWarnings
	];
}
function formatSuppressedAmbientChannelsStartupWarning(channelIds) {
	const safeChannelIds = normalizeSortedUniqueStringEntries(channelIds).map((channelId) => sanitizeForLog(channelId));
	return `gateway suppressed ambient channel auto-configuration for ${safeChannelIds.length} ${safeChannelIds.length === 1 ? "channel" : "channels"}: ${safeChannelIds.join(", ")}. Configure channels.<id> (openclaw channels add <id>) to enable the channel, or pass --ambient-channels to allow ambient env credentials.`;
}
function formatConfiguredChannelMissingOwnerStartupWarning(entry) {
	return `configured channel warning: channels.${sanitizeForLog(entry.channelId)} is configured but no channel plugin is installed or loadable (${normalizeSortedUniqueStringEntries(entry.blockedReasons).join(", ")}). Run \`openclaw doctor --fix\` or install the channel plugin before relying on this channel.`;
}
function formatReadyDetails(loadedPluginIds, startupDurationLabel) {
	const pluginIds = normalizeSortedUniqueStringEntries(loadedPluginIds);
	const pluginSummary = pluginIds.length === 0 ? "0 plugins" : `${pluginIds.length} ${pluginIds.length === 1 ? "plugin" : "plugins"}: ${pluginIds.join(", ")}`;
	if (!startupDurationLabel) return pluginSummary;
	return pluginIds.length === 0 ? `${pluginSummary}, ${startupDurationLabel}` : `${pluginSummary}; ${startupDurationLabel}`;
}
//#endregion
export { logGatewayStartup };
