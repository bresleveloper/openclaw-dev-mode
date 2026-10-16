import { a as listLoadedChannelPlugins } from "./registry-loaded-BugfxX6l.mjs";
//#region src/channels/plugins/lifecycle-startup.ts
/** Invokes optional startup maintenance for loaded channel plugins. */
async function runChannelPluginStartupMaintenance(params) {
	for (const plugin of listLoadedChannelPlugins()) {
		const runStartupMaintenance = plugin.lifecycle?.runStartupMaintenance;
		if (!runStartupMaintenance) continue;
		try {
			await runStartupMaintenance(params);
		} catch (err) {
			params.log.warn?.(`${params.logPrefix?.trim() || "gateway"}: ${plugin.id} startup maintenance failed; continuing: ${String(err)}`);
		}
	}
}
//#endregion
export { runChannelPluginStartupMaintenance as t };
