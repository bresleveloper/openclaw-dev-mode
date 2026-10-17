import { l as normalizeSortedUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { i as getSqliteRuntimeCapabilities, r as ensureSqliteLibrarySelected } from "./bun-sqlite-library-CBSPJxTD.mjs";
import { a as getResolvedLoggerSettings } from "./logger-Mnn26Jj7.mjs";
import { i as getTrackedWorkerLifecycleSnapshot } from "./worker-cpu-DU6Cf6Aq.mjs";
import { r as getWorkerComputeCapacity } from "./worker-task-pool-iI3pfrsK.mjs";
import { C as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import { h as resolveConfiguredModelRef, r as buildConfiguredModelCatalog } from "./model-selection-shared-DKlQ1p0S.mjs";
import "./logging-CIwBT2dJ.mjs";
import { n as resolveConfiguredThinkingDefaultCore, r as resolveThinkingDefaultCore } from "./model-thinking-default-CZnoMXD6.mjs";
import { c as formatFastModeValue } from "./fast-mode-smSVCJXN.mjs";
import { t as resolveFastModeState } from "./fast-mode-CdiysUl0.mjs";
import { t as collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot } from "./dangerous-config-flags-current-DrFXRceC.mjs";
import chalk from "chalk";
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
	params.log.warn("Older local CLI/SDK versions can bypass Gateway state mutation routing. Use matching CLI/SDK and Gateway versions; legacy direct writers remain supported.");
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
	const enabledDangerousFlags = collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot(params.cfg) ?? (await import("./dangerous-config-flags-r8fY7hs2.mjs")).collectEnabledInsecureOrDangerousFlags(params.cfg);
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
		else {
			const resolvedThinking = resolveThinkingDefaultCore({
				cfg: params.cfg,
				agentId: soleAgentId,
				provider: params.provider,
				model: params.model,
				catalog: configuredCatalog
			});
			thinking = resolvedThinking === "off" ? "medium" : resolvedThinking;
		}
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
	const [blockerModule, presencePolicyModule] = await Promise.all([import("./channel-plugin-blockers-BhkNj3_w.mjs"), import("./channel-presence-policy-DhUbmdni.mjs")]);
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
