import { l as normalizeSortedUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { b as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { a as getResolvedLoggerSettings } from "./logger--ALOusOG.mjs";
import { t as ensureSqliteLibrarySelected } from "./bun-sqlite-library-GOquVAYK.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { h as resolveConfiguredModelRef, r as buildConfiguredModelCatalog } from "./model-selection-shared-0uvJbX1M.mjs";
import "./logging-CrcvifP_.mjs";
import { n as resolveConfiguredThinkingDefaultCore, r as resolveThinkingDefaultCore } from "./model-thinking-default-BQDdsH3k.mjs";
import { s as formatFastModeValue } from "./fast-mode-CF9HctjM.mjs";
import { t as resolveFastModeState } from "./fast-mode-D3LS63Ki.mjs";
import { t as collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot } from "./dangerous-config-flags-current--lXwjO9R.mjs";
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
	const sqliteLibrary = ensureSqliteLibrarySelected();
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
	const enabledDangerousFlags = collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot(params.cfg) ?? (await import("./dangerous-config-flags-M2Pp05DT.mjs")).collectEnabledInsecureOrDangerousFlags(params.cfg);
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
/** True when a configured catalog entry disables reasoning for the startup model. */
function isConfiguredReasoningDisabled(params) {
	return params.catalog.some((entry) => entry.provider === params.provider && entry.id === params.model && entry.reasoning === false);
}
/** Format model thinking and fast-mode details for the Gateway startup banner. */
function formatAgentModelStartupDetails(params) {
	const soleAgentId = tryResolveAmbientOwnerAgentId(params.cfg);
	let thinking = resolveConfiguredThinkingDefaultCore({
		...params,
		agentId: soleAgentId
	});
	if (thinking === void 0) {
		const configuredCatalog = buildConfiguredModelCatalog({ cfg: params.cfg });
		if (isConfiguredReasoningDisabled({
			catalog: configuredCatalog,
			provider: params.provider,
			model: params.model
		})) thinking = "off";
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
	const [blockerModule, presencePolicyModule] = await Promise.all([import("./channel-plugin-blockers-CQ9MKNgh.mjs"), import("./channel-presence-policy-UwkR4WlN.mjs")]);
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
/** Format plugin count/list and optional startup duration for the ready log line. */
function formatReadyDetails(loadedPluginIds, startupDurationLabel) {
	const pluginIds = normalizeSortedUniqueStringEntries(loadedPluginIds);
	const pluginSummary = pluginIds.length === 0 ? "0 plugins" : `${pluginIds.length} ${pluginIds.length === 1 ? "plugin" : "plugins"}: ${pluginIds.join(", ")}`;
	if (!startupDurationLabel) return pluginSummary;
	return pluginIds.length === 0 ? `${pluginSummary}, ${startupDurationLabel}` : `${pluginSummary}; ${startupDurationLabel}`;
}
//#endregion
export { logGatewayStartup };
