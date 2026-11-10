import { t as stableHomebrewNodePathCandidates } from "./stable-node-path-gbtKbqE-.mjs";
import { existsSync } from "node:fs";
import { pathExists } from "@openclaw/fs-safe/advanced";
//#region src/infra/stable-node-path.ts
/**
* Homebrew Cellar paths (e.g. /opt/homebrew/Cellar/node/25.7.0/bin/node)
* break when Homebrew upgrades Node and removes the old version directory.
* Resolve these to a stable Homebrew-managed path that survives upgrades:
*   - Default formula "node":  <prefix>/opt/node/bin/node  or  <prefix>/bin/node
*   - Versioned formula "node@22":  <prefix>/opt/node@22/bin/node  (keg-only)
*/
async function resolveStableNodePath(nodePath) {
	for (const candidate of stableHomebrewNodePathCandidates(nodePath)) if (await pathExists(candidate)) return candidate;
	return nodePath;
}
function resolveLaunchableNodePath(nodePath = process.execPath) {
	if (existsSync(nodePath)) return nodePath;
	return stableHomebrewNodePathCandidates(nodePath).find(existsSync) ?? nodePath;
}
//#endregion
export { resolveStableNodePath as n, resolveLaunchableNodePath as t };
