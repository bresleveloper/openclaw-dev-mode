import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import { c as normalizePluginId, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { t as ensurePluginAllowlisted } from "./plugins-allowlist-DGbUrepm.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { t as setPluginEnabledInConfig } from "./toggle-config-Ct7GZqeP.mjs";
//#region src/plugins/enable.ts
/** Keep install policy while staging a plugin whose required settings are not configured yet. */
function prepareConfigForDisabledInstall(config, pluginId) {
	const entry = config.plugins?.entries?.[pluginId];
	const policy = isRecord(entry) ? { ...entry } : {};
	delete policy.config;
	return {
		...config,
		plugins: {
			...config.plugins,
			entries: {
				...config.plugins?.entries,
				[pluginId]: {
					...policy,
					enabled: false
				}
			}
		}
	};
}
/** Enables a plugin in config unless global, denylist, or allowlist policy blocks it. */
function enablePluginInConfig(cfg, pluginId, options = {}) {
	const builtInChannelId = normalizeChatChannelId(pluginId);
	const resolvedId = normalizePluginId(builtInChannelId ?? pluginId);
	const plugins = normalizePluginsConfig(cfg.plugins);
	if (!plugins.enabled) return {
		config: cfg,
		enabled: false,
		pluginId: resolvedId,
		reason: "plugins disabled"
	};
	if (plugins.deny.includes(resolvedId)) return {
		config: cfg,
		enabled: false,
		pluginId: resolvedId,
		reason: "blocked by denylist"
	};
	if (plugins.allow.length > 0 && !plugins.allow.includes(resolvedId)) return {
		config: cfg,
		enabled: false,
		pluginId: resolvedId,
		reason: "blocked by allowlist"
	};
	return {
		config: setPluginEnabledInConfig(cfg, resolvedId, true, options),
		enabled: true,
		pluginId: resolvedId
	};
}
/**
* Enables a plugin selected through an explicit user action.
*
* ClickClack is bundled without a separate install trust record, so selecting
* it is the trust gesture that materializes its id in a restrictive allowlist.
*/
function enableExplicitlySelectedPluginInConfig(cfg, pluginId, options = {}) {
	const result = enablePluginInConfig(cfg, pluginId, options);
	if (result.reason !== "blocked by allowlist" || result.pluginId !== "clickclack") return result;
	return enablePluginInConfig(ensurePluginAllowlisted(cfg, result.pluginId), result.pluginId, options);
}
/** Review a managed plugin before an explicit setup action activates it. */
async function enablePluginWithCapabilityConsent(cfg, pluginId, options = {}) {
	const result = enableExplicitlySelectedPluginInConfig(cfg, pluginId, options);
	if (!result.enabled) return result;
	try {
		const { withPluginLifecycleLease } = await import("./plugin-lifecycle-lease-D_2q8UjY.mjs");
		return await withPluginLifecycleLease({ env: options.env }, async () => {
			const { loadInstalledPluginIndexInstallRecords } = await import("./installed-plugin-index-records-BOLR6qS_.mjs");
			const records = await loadInstalledPluginIndexInstallRecords({ env: options.env });
			if (Object.keys(records).length === 0) return result;
			const { resolvePluginMetadataSnapshot } = await import("./plugin-metadata-snapshot-DcoK08YM.mjs");
			const metadata = resolvePluginMetadataSnapshot({
				config: cfg,
				env: options.env,
				workspaceDir: options.workspaceDir,
				allowCurrent: false
			});
			const id = metadata.normalizePluginId(result.pluginId);
			const installed = metadata.index.plugins.find((plugin) => plugin.pluginId === id);
			if (installed && !installed.enabled && installed.origin !== "bundled") {
				const { resolvePluginCapabilityConsent } = await import("./capability-consent-jm-GQHDR.mjs");
				await resolvePluginCapabilityConsent({
					config: cfg,
					pluginId: id,
					env: options.env,
					metadata,
					onCapabilityConsent: options.onCapabilityConsent,
					beforePersistentEffect: options.beforePersistentEffect
				});
			}
			return result;
		});
	} catch (error) {
		if (!(error instanceof ManagedPluginLifecycleError)) throw error;
		return {
			config: cfg,
			pluginId: result.pluginId,
			enabled: false,
			reason: sanitizeTerminalText(error.message)
		};
	}
}
//#endregion
export { prepareConfigForDisabledInstall as i, enablePluginInConfig as n, enablePluginWithCapabilityConsent as r, enableExplicitlySelectedPluginInConfig as t };
