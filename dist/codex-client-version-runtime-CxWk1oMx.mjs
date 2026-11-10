import { t as readHandedOffCodexClientVersion } from "./codex-client-version-handoff.internal-vuk-sgi8.mjs";
//#region src/plugin-sdk/codex-client-version-runtime.ts
/**
* Resolves the version of the Codex binary that managed Codex turns run in this
* process tree. Catalog workers return the value their parent process handed
* off. Returns undefined when the Codex plugin is inactive or unavailable;
* callers then report their bundled pin.
*/
async function resolveCodexClientVersion(params) {
	const handedOff = readHandedOffCodexClientVersion();
	if (handedOff) return handedOff.version;
	try {
		const { tryLoadActivatedBundledPluginPublicSurfaceModule } = await import("./facade-runtime-DS-YdcJT.mjs");
		return await (await tryLoadActivatedBundledPluginPublicSurfaceModule({
			dirName: "codex",
			artifactBasename: "client-version-api.js"
		}))?.resolveCodexClientVersion(params);
	} catch {
		return;
	}
}
//#endregion
export { resolveCodexClientVersion as t };
