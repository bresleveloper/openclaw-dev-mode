import { i as loadBundledPluginPublicSurfaceModuleSyncCore } from "./facade-loader-B-X-HqBc.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
//#region src/commands/doctor-browser.ts
function loadBrowserDoctorSurface() {
	return loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName: "browser",
		artifactBasename: "browser-doctor.js"
	});
}
async function maybeRepairOwnedChromeExtensionNativeHosts() {
	try {
		const repair = loadBrowserDoctorSurface().maybeRepairOwnedChromeExtensionNativeHosts;
		return repair ? await repair() : {
			changes: [],
			warnings: []
		};
	} catch (error) {
		return {
			changes: [],
			warnings: [`Browser extension native-host repair is unavailable: ${error instanceof Error ? error.message : String(error)}`]
		};
	}
}
async function noteChromeMcpBrowserReadiness(cfg, deps) {
	try {
		await loadBrowserDoctorSurface().noteChromeMcpBrowserReadiness(cfg, deps);
	} catch (error) {
		(deps?.noteFn ?? note)(`- Browser health check is unavailable: ${error instanceof Error ? error.message : String(error)}`, "Browser");
	}
}
//#endregion
export { noteChromeMcpBrowserReadiness as n, maybeRepairOwnedChromeExtensionNativeHosts as t };
