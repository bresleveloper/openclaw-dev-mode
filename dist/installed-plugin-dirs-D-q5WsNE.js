import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/security/installed-plugin-dirs.ts
const IGNORED_INSTALLED_PLUGIN_DIR_NAMES = /* @__PURE__ */ new Set(["node_modules", ".openclaw-install-backups"]);
/**
* Decide whether an installed-plugin directory should be skipped by security audits.
* This filters generated install debris while keeping real plugin roots visible to scans.
*/
function shouldIgnoreInstalledPluginDirName(name) {
	const normalized = normalizeOptionalLowercaseString(name);
	if (!normalized) return true;
	if (IGNORED_INSTALLED_PLUGIN_DIR_NAMES.has(normalized)) return true;
	if (normalized.startsWith(".")) return true;
	if (normalized.endsWith(".bak")) return true;
	if (normalized.includes(".backup-")) return true;
	if (normalized.includes(".disabled")) return true;
	return false;
}
/**
* Lists installed plugin directories under the state extensions dir. Read
* failures surface through `onReadError` so audits can report scan problems,
* except a missing extensions dir, which is the normal no-plugins state.
*/
async function listInstalledPluginDirs(params) {
	const extensionsDir = path.join(params.stateDir, "extensions");
	if (!(await fs.stat(extensionsDir).catch((err) => {
		const code = err?.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") params.onReadError?.(err);
		return null;
	}))?.isDirectory()) return {
		extensionsDir,
		pluginDirs: []
	};
	return {
		extensionsDir,
		pluginDirs: (await fs.readdir(extensionsDir, { withFileTypes: true }).catch((err) => {
			params.onReadError?.(err);
			return [];
		})).filter((entry) => entry.isDirectory()).map((entry) => entry.name).filter((name) => !shouldIgnoreInstalledPluginDirName(name)).filter(Boolean)
	};
}
//#endregion
export { listInstalledPluginDirs as t };
