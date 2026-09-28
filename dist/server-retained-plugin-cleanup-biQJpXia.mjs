//#region src/gateway/server-retained-plugin-cleanup.ts
async function cleanupRetainedPluginInstallGenerations(params) {
	try {
		const { clearLoadInstalledPluginIndexInstallRecordsCache, loadInstalledPluginIndexInstallRecordsSync } = await import("./installed-plugin-index-records-BOIXaZ2R.mjs");
		clearLoadInstalledPluginIndexInstallRecordsCache();
		const records = loadInstalledPluginIndexInstallRecordsSync();
		const { cleanupRetainedManagedNpmInstallGenerations } = await import("./managed-npm-retention-CMgIQ3NG.mjs");
		const removedGenerations = await cleanupRetainedManagedNpmInstallGenerations({
			activeInstallPaths: [...params.startupInstallPaths, ...Object.values(records).flatMap((record) => record.installPath ? [record.installPath] : [])],
			onError: (error, projectRoot) => params.log.warn(`failed to clean retained npm generation ${projectRoot}: ${String(error)}`)
		});
		if (removedGenerations > 0) params.log.info(`cleaned ${removedGenerations} retained npm plugin generation(s)`);
	} catch (error) {
		params.log.warn(`retained npm generation cleanup unavailable: ${String(error)}`);
	}
}
//#endregion
export { cleanupRetainedPluginInstallGenerations };
