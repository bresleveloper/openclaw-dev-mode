import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-BnGMmE02.mjs";
import { a as hasMatchingPluginLoadPath, c as resolveComparableUninstallPathInternal, s as removePluginRuntimePolicyFromConfig } from "./uninstall-config-BEZgXs77.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/plugins/plugin-package-update.ts
function capturePluginPackageUpdateSnapshot(params) {
	const snapshot = /* @__PURE__ */ new Map();
	const resolver = createInstalledPluginOwnershipResolver(params.index, params.env);
	for (const installOwner of new Set(params.installOwners)) {
		const ownership = resolver.resolveLifecycle(installOwner);
		if (!ownership.ok) return ownership;
		snapshot.set(installOwner, ownership.value);
	}
	return {
		ok: true,
		value: snapshot
	};
}
function contributionKeys(index, pluginIds) {
	const keys = /* @__PURE__ */ new Set();
	for (const plugin of index.plugins) {
		if (!pluginIds.has(plugin.pluginId)) continue;
		for (const key of [...plugin.contributions?.channels ?? [], ...plugin.contributions?.channelConfigs ?? []]) keys.add(key);
	}
	return keys;
}
/** Reconcile policy for children removed by a package update. */
function reconcilePluginPackageUpdateConfig(params) {
	let config = params.config;
	const resolver = createInstalledPluginOwnershipResolver(params.afterIndex, params.env);
	for (const [installOwner, before] of params.snapshot) {
		const nextInstallOwner = params.installOwnerMigrations?.[installOwner] ?? installOwner;
		const after = resolver.resolvePackage(nextInstallOwner);
		if (before.kind === "orphan") {
			const lifecycleAfter = resolver.resolveLifecycle(nextInstallOwner);
			const unchangedOrphan = nextInstallOwner === installOwner && isDeepStrictEqual(params.afterIndex.installRecords[nextInstallOwner], before.installRecord) && lifecycleAfter.ok && lifecycleAfter.value.kind === "orphan";
			if (!after.ok && !unchangedOrphan) return after;
			continue;
		}
		if (!after.ok) return after;
		const afterPluginIds = new Set(after.value.pluginIds);
		const removedPluginIds = before.pluginIds.filter((pluginId) => !afterPluginIds.has(pluginId));
		if (removedPluginIds.length === 0) continue;
		const retainedOwnedPaths = new Set([
			after.value.installRecord.installPath,
			after.value.installRecord.sourcePath,
			...params.afterIndex.plugins.filter((plugin) => afterPluginIds.has(plugin.pluginId)).flatMap((plugin) => [plugin.source, plugin.rootDir])
		].filter((value) => Boolean(value)).map(resolveComparableUninstallPathInternal));
		const retainedContributionKeys = contributionKeys(params.afterIndex, afterPluginIds);
		for (const pluginId of removedPluginIds) {
			const oldRecord = params.beforeIndex.plugins.find((plugin) => plugin.pluginId === pluginId);
			const channelIds = [...oldRecord?.contributions?.channels ?? [], ...oldRecord?.contributions?.channelConfigs ?? []].filter((channelId) => !retainedContributionKeys.has(channelId));
			config = removePluginRuntimePolicyFromConfig(config, pluginId, {
				channelIds,
				loadPaths: [
					oldRecord?.source,
					before.installRecord.installPath,
					before.installRecord.sourcePath
				].filter((value) => Boolean(value)).filter((value) => !retainedOwnedPaths.has(resolveComparableUninstallPathInternal(value)))
			}).config;
		}
	}
	return {
		ok: true,
		config
	};
}
function pluginPackageUpdateMayMutateConfig(params) {
	const plugins = params.config.plugins;
	const channels = params.config.channels;
	for (const ownership of params.snapshot.values()) {
		const pluginIds = new Set(ownership.pluginIds);
		const ownedPaths = [
			ownership.installRecord.installPath,
			ownership.installRecord.sourcePath,
			...params.index.plugins.filter((plugin) => pluginIds.has(plugin.pluginId) && plugin.source).map((plugin) => plugin.source)
		].filter((value) => Boolean(value));
		if (hasMatchingPluginLoadPath(params.config, ownedPaths)) return true;
		for (const pluginId of ownership.pluginIds) if (plugins?.allow?.includes(pluginId) || plugins?.deny?.includes(pluginId) || Object.hasOwn(plugins?.entries ?? {}, pluginId) || plugins?.slots?.memory === pluginId || plugins?.slots?.contextEngine === pluginId) return true;
		if (channels && [...contributionKeys(params.index, pluginIds)].some((key) => Object.hasOwn(channels, key))) return true;
	}
	return false;
}
//#endregion
export { pluginPackageUpdateMayMutateConfig as n, reconcilePluginPackageUpdateConfig as r, capturePluginPackageUpdateSnapshot as t };
