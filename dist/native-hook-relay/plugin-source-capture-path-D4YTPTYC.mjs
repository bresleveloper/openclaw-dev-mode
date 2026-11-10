import { j as resolveIdentityPathViaExistingAncestorSync } from "./redact-tYkqLD33.mjs";
import "./utils-c2rFzEZe.mjs";
import { i as sha256HexPrefixCore } from "./crypto-digest-DqNCiRzt.mjs";
import "node:fs";
import path from "node:path";
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
export { resolvePluginSourceCaptureFallbackPrefix as n, resolvePluginSourceCapturesDirectory as r, isLegacyPluginSourceCaptureName as t };
