import { l as pathExists } from "./utils-DgZn2dLu.mjs";
import path from "node:path";
//#region src/daemon/gateway-entrypoint.ts
/** Resolves gateway dist entrypoints used by installed daemon command lines. */
const GATEWAY_DIST_ENTRYPOINT_BASENAMES = [
	"index.js",
	"index.mjs",
	"entry.js",
	"entry.mjs"
];
/** Detects built gateway dist entrypoints from service command arguments. */
function isGatewayDistEntrypointPath(inputPath) {
	return /[/\\]dist[/\\].+\.(cjs|js|mjs)$/.test(inputPath);
}
function buildGatewayInstallEntrypointCandidates(root) {
	if (!root) return [];
	return GATEWAY_DIST_ENTRYPOINT_BASENAMES.map((basename) => path.join(root, "dist", basename));
}
function buildGatewayDistEntrypointCandidates(...inputs) {
	const distDirs = new Set(inputs.filter(isGatewayDistEntrypointPath).map(path.dirname));
	return GATEWAY_DIST_ENTRYPOINT_BASENAMES.flatMap((basename) => Array.from(distDirs, (distDir) => path.join(distDir, basename)));
}
async function findFirstAccessibleGatewayEntrypoint(candidates, exists = pathExists) {
	for (const candidate of candidates) if (await exists(candidate)) return candidate;
}
async function resolveGatewayInstallEntrypoint(root, exists = pathExists) {
	return findFirstAccessibleGatewayEntrypoint(buildGatewayInstallEntrypointCandidates(root), exists);
}
//#endregion
export { resolveGatewayInstallEntrypoint as a, isGatewayDistEntrypointPath as i, buildGatewayInstallEntrypointCandidates as n, findFirstAccessibleGatewayEntrypoint as r, buildGatewayDistEntrypointCandidates as t };
