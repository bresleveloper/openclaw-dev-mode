import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { o as normalizeWindowsPathPreservingCase } from "./path-guards-CH7noY0Z.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/plugin-source-capture-path.ts
const PLUGIN_SOURCE_CAPTURE_PREFIX = "openclaw-plugin-build-";
function resolvePluginSourceCapturesDirectory(stateDir) {
	return path.join(stateDir, "tmp", "plugin-captures");
}
function resolvePluginSourceCaptureFallbackPrefix(stateDir) {
	const identity = resolveIdentityPathViaExistingAncestorSync(stateDir);
	return `openclaw-plugin-captures-${sha256HexPrefixCore(identity, 32)}-`;
}
function isLegacyPluginSourceCaptureName(name) {
	return name.startsWith("openclaw-plugin-build-") || name.startsWith("openclaw-model-catalog-");
}
/**
* Node extends Windows paths past MAX_PATH for mkdir and file I/O, but not for mkdtemp.
* Update rehearsal roots are deep, so captures beneath them need the same extension.
*/
function mkdtempPluginCaptureSync(prefix) {
	if (process.platform !== "win32") return fs.mkdtempSync(prefix);
	return normalizeWindowsPathPreservingCase(fs.mkdtempSync(path.win32.toNamespacedPath(path.win32.resolve(prefix))));
}
//#endregion
export { resolvePluginSourceCapturesDirectory as a, resolvePluginSourceCaptureFallbackPrefix as i, isLegacyPluginSourceCaptureName as n, mkdtempPluginCaptureSync as r, PLUGIN_SOURCE_CAPTURE_PREFIX as t };
