import { x as resolveIsNixMode } from "./paths-DehQwyE0.mjs";
import { l as pluginCacheRealpathSync } from "./package-manifest-C8sTeZKW.mjs";
import path from "node:path";
//#region src/plugins/hardlink-policy.ts
/** Enforces plugin root hardlink policy with bundled and immutable Nix-store exceptions. */
const NIX_STORE_ROOT = "/nix/store";
/** Returns true when a plugin root resolves inside the immutable Nix store. */
function isNixStorePluginRoot(rootDir) {
	const rootRealPath = pluginCacheRealpathSync(rootDir) ?? path.resolve(rootDir);
	return rootRealPath === NIX_STORE_ROOT || rootRealPath.startsWith(`${NIX_STORE_ROOT}/`);
}
/** Decides whether plugin file hardlinks should fail boundary validation for one root. */
function shouldRejectHardlinkedPluginFiles(params) {
	if (params.origin === "bundled") return false;
	if (resolveIsNixMode(params.env) && isNixStorePluginRoot(params.rootDir)) return false;
	return true;
}
//#endregion
export { shouldRejectHardlinkedPluginFiles as t };
