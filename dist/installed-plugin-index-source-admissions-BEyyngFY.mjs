//#region src/plugins/installed-plugin-index-source-admissions.ts
/** A rebuilt projection retains admissions only for the same installed source owner. */
function preservePluginSourceAdmissions(previous, current) {
	const records = new Map(previous?.plugins.map((plugin) => [plugin.pluginId, plugin]));
	for (const plugin of current.plugins) {
		const prior = records.get(plugin.pluginId);
		if (prior?.sourceAdmissions && prior.rootDir === plugin.rootDir && prior.installRecordHash === plugin.installRecordHash) plugin.sourceAdmissions = {
			...plugin.sourceAdmissions,
			...prior.sourceAdmissions
		};
	}
}
//#endregion
export { preservePluginSourceAdmissions as t };
