import { N as resolveIdentityPathViaExistingAncestorSync } from "./redact-TLu2QTmL.mjs";
import { i as sha256HexPrefixCore } from "./crypto-digest-DFe1GlHl.mjs";
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
//#endregion
export { resolvePluginSourceCapturesDirectory as i, isLegacyPluginSourceCaptureName as n, resolvePluginSourceCaptureFallbackPrefix as r, PLUGIN_SOURCE_CAPTURE_PREFIX as t };
