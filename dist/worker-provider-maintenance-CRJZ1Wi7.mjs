import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-B2H7kBCF.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-CnhlPo20.mjs";
import { t as validateProviderSettings } from "./provider-settings-CR-jdYHV.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-Cov0065J.mjs";
import { t as collectConfiguredWorkerProviderIds } from "./worker-provider-config-BI49IDBE.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/plugins/worker-provider-maintenance.ts
function configuredSettings(config, providerId) {
	return Object.entries(config.cloudWorkers?.profiles ?? {}).filter(([, profile]) => normalizeCapabilityProviderId(profile.provider) === providerId).toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([id, profile]) => [id, profile.settings ?? {}]);
}
/** Maintains configured providers without loading plugins or borrowing a successor's authority. */
async function maintainConfiguredWorkerProviders(params) {
	const registry = params.getRegistry();
	const config = params.getConfig();
	if (params.signal.aborted) return;
	const pluginPolicy = structuredClone(config.plugins);
	const normalizedConfig = normalizePluginsConfig(config.plugins);
	const tasks = collectConfiguredWorkerProviderIds(config).flatMap((providerId) => {
		const registration = registry.workerProviders.get(providerId);
		const provider = registration?.provider;
		const maintain = provider?.maintain;
		const owner = registry.plugins.find((record) => record.id === registration?.pluginId);
		const isOwnerCurrent = owner && capturePluginLifecycleAuthority(registry, owner);
		if (!registration || !provider || !maintain || !owner || !isOwnerCurrent?.()) return [];
		if (!passesManifestOwnerBasePolicy({
			plugin: owner,
			normalizedConfig
		})) return [];
		const settings = configuredSettings(config, providerId);
		if (settings.some(([, value]) => validateProviderSettings(value, "Worker profile") !== void 0)) {
			params.warn(`Worker provider maintenance skipped invalid settings (${providerId.slice(0, 128)})`);
			return [];
		}
		const snapshot = structuredClone(settings);
		return [async () => {
			let active = true;
			const assertCurrent = () => {
				params.signal.throwIfAborted();
				const currentConfig = params.getConfig();
				if (!active || params.getRegistry() !== registry || registry.workerProviders.get(providerId) !== registration || provider.maintain !== maintain || !isOwnerCurrent() || !isDeepStrictEqual(currentConfig.plugins, pluginPolicy) || !isDeepStrictEqual(configuredSettings(currentConfig, providerId), snapshot)) throw new Error("Worker provider maintenance is no longer current");
			};
			try {
				assertCurrent();
				await maintain.call(provider, {
					profiles: structuredClone(snapshot.map(([, value]) => value)),
					signal: params.signal,
					assertCurrent
				});
			} catch {
				if (!params.signal.aborted) params.warn(`Worker provider maintenance failed (${providerId.slice(0, 128)})`);
			} finally {
				active = false;
			}
		}];
	});
	await runTasksWithConcurrency({
		tasks,
		limit: 4
	});
}
//#endregion
export { maintainConfiguredWorkerProviders };
