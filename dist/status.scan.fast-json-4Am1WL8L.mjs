import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-BMhosYMN.mjs";
import { t as collectStatusScanOverview } from "./status.scan-overview-DAxPi0_5.mjs";
import { t as executeStatusScanFromOverview } from "./status.scan-execute-CakvpgBw.mjs";
//#region src/commands/status.scan.fast-json.ts
const statusGatewayModuleLoader = createLazyImportLoader(() => import("./status.scan.gateway-CHA7Jh0n.mjs"));
const statusScanMemoryModuleLoader = createLazyImportLoader(() => import("./status.scan-memory-By7Xrud3.mjs"));
const statusScanPluginStatusModuleLoader = createLazyImportLoader(() => import("./status-0xhAhaxm.mjs"));
const IGNORED_CHANNEL_CONFIG_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
const STATUS_JSON_CHANNEL_ENV_PREFIXES = GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.filter((entry) => entry.configurable !== false).map((entry) => `${entry.channelId.replace(/[^a-z0-9]+/gi, "_").toUpperCase()}_`);
const STATUS_JSON_CHANNEL_ENV_VARS = new Set(GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.filter((entry) => entry.configurable !== false).flatMap((entry) => entry.channelEnvVars ?? []));
function hasMeaningfulStatusJsonChannelConfig(value) {
	if (!isRecord(value)) return false;
	return Object.keys(value).some((key) => key !== "enabled");
}
function hasExplicitStatusJsonChannelConfig(cfg) {
	if (!isRecord(cfg.channels)) return false;
	for (const [key, value] of Object.entries(cfg.channels)) {
		if (IGNORED_CHANNEL_CONFIG_KEYS.has(key)) continue;
		if (hasMeaningfulStatusJsonChannelConfig(value)) return true;
	}
	return false;
}
function hasStatusJsonChannelEnvConfig(env = process.env) {
	for (const [key, value] of Object.entries(env)) {
		if (typeof value !== "string" || value.trim().length === 0) continue;
		if (STATUS_JSON_CHANNEL_ENV_VARS.has(key) || STATUS_JSON_CHANNEL_ENV_PREFIXES.some((prefix) => key.startsWith(prefix))) return true;
	}
	return false;
}
function hasPotentialConfiguredChannelsForStatusJson(cfg) {
	return hasExplicitStatusJsonChannelConfig(cfg) || hasStatusJsonChannelEnvConfig();
}
/** Runs the default fast status JSON scan. */
async function scanStatusJsonFast(opts, runtime) {
	const online = await (await statusGatewayModuleLoader.load()).scanStatusJsonGateway(opts);
	if (online.scan) return online.scan;
	const overview = await collectStatusScanOverview({
		env: process.env,
		commandName: "status --json",
		opts,
		showSecrets: false,
		runtime,
		allowMissingConfigFastPath: true,
		resolveHasConfiguredChannels: (cfg) => hasPotentialConfiguredChannelsForStatusJson(cfg),
		includeChannelsData: false,
		fetchGitUpdate: opts.all === true,
		includeRegistryUpdate: opts.all === true,
		includeLocalStatusRpcFallback: opts.all === true,
		gatewaySnapshot: online.gatewaySnapshot
	});
	const pluginCompatibility = opts.all ? await statusScanPluginStatusModuleLoader.load().then(({ buildPluginCompatibilitySnapshotNotices }) => buildPluginCompatibilitySnapshotNotices({ config: overview.cfg })) : [];
	return await executeStatusScanFromOverview({
		overview,
		runtime,
		resolveMemory: async ({ cfg, agentStatus, memoryPlugin }) => {
			if (!opts.all) return null;
			const { resolveDefaultMemoryDatabasePath, resolveStatusMemoryStatusSnapshot } = await statusScanMemoryModuleLoader.load();
			return await resolveStatusMemoryStatusSnapshot({
				cfg,
				agentStatus,
				memoryPlugin,
				requireDefaultDatabasePath: resolveDefaultMemoryDatabasePath
			});
		},
		channelIssues: overview.channelIssues,
		channels: overview.channels,
		pluginCompatibility
	});
}
//#endregion
export { scanStatusJsonFast as t };
