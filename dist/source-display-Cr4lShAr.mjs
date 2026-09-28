import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as resolvePluginSourceRoots } from "./roots-DtYz58sU.mjs";
import path from "node:path";
//#region src/plugins/source-display.ts
/** Formats plugin source paths for user-facing status output. */
const TABLE_SOURCE_MAX_CHARS = 48;
function middleTruncatePath(value) {
	if (value.length <= TABLE_SOURCE_MAX_CHARS) return value;
	return `${sliceUtf16Safe(value, 0, Math.floor(45 / 2))}...${sliceUtf16Safe(value, -22)}`;
}
function tryRelative(root, filePath) {
	if (!isPathInside(root, filePath)) return null;
	const rel = path.relative(root, filePath);
	if (!rel || rel === ".") return null;
	return rel.replaceAll("\\", "/");
}
/** Formats a plugin source path for status tables using known source roots. */
function formatPluginSourceForTable(plugin, roots) {
	const raw = plugin.source;
	const rootKey = plugin.origin === "bundled" ? "stock" : plugin.origin;
	if (rootKey !== "config") {
		const root = roots[rootKey];
		const rel = root ? tryRelative(root, raw) : null;
		if (rel) return {
			value: `${rootKey}:${rel}`,
			rootKey
		};
	}
	return { value: middleTruncatePath(shortenHomePath(raw)) };
}
//#endregion
export { formatPluginSourceForTable, resolvePluginSourceRoots };
