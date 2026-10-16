import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { t as walkRootDirectory } from "./root-walk-CePL-4Ds.mjs";
import path from "node:path";
//#region src/plugins/control-ui-assets.ts
const CONTROL_UI_PLUGIN_MAX_ASSET_BYTES = 4194304;
const CONTROL_UI_PLUGIN_MAX_BUILD_BYTES = 8388608;
const MAX_CONTROL_UI_ASSETS = 128;
/** Files admitted from a plugin's dedicated browser build directory. */
function isPluginControlUiAssetPath(relativePath) {
	return /^(?:[\w-][\w.-]*\/)*[\w-][\w.-]*\.(?:m?js|css)$/u.test(relativePath);
}
async function readPluginControlUiAssets(rootDir, declaration) {
	const pluginRoot = await root(rootDir, {
		hardlinks: "reject",
		symlinks: "reject",
		maxBytes: CONTROL_UI_PLUGIN_MAX_ASSET_BYTES
	});
	const directory = path.posix.dirname(declaration.entry);
	const assets = /* @__PURE__ */ new Map();
	let bytes = 0;
	for await (const entry of walkRootDirectory(pluginRoot.rootReal, directory, {
		symlinkPolicy: "skip",
		maxDepth: 8,
		maxEntries: MAX_CONTROL_UI_ASSETS,
		limitBehavior: "throw"
	})) {
		const relativePath = path.posix.relative(directory, entry.relativePath);
		if (entry.kind !== "file" || !isPluginControlUiAssetPath(relativePath)) continue;
		const body = await pluginRoot.readBytes(entry.relativePath);
		bytes += body.length;
		if (bytes > 8388608) throw new Error("browser build exceeds its byte limit");
		assets.set(relativePath, {
			body,
			contentType: relativePath.endsWith(".css") ? "text/css; charset=utf-8" : "text/javascript; charset=utf-8"
		});
	}
	const entryName = path.posix.basename(declaration.entry);
	const styles = (declaration.styles ?? []).map((style) => path.posix.relative(directory, style));
	if (![entryName, ...styles].every((name) => assets.has(name))) throw new Error("declared browser assets are missing");
	return {
		directory,
		entryName,
		styles,
		assets,
		bytes
	};
}
//#endregion
export { readPluginControlUiAssets as i, CONTROL_UI_PLUGIN_MAX_BUILD_BYTES as n, isPluginControlUiAssetPath as r, CONTROL_UI_PLUGIN_MAX_ASSET_BYTES as t };
