import { p as readCurrentConfigForResolution } from "./io.runtime-Ds5uC0Bf.mjs";
import { t as resolveInstallAgentDir } from "./install-agent-dir-o_zoWO1a.mjs";
import { join } from "node:path";
//#region src/agents/config.ts
/** Resolves per-user agent directories for CLI and runtime callers. */
function getAgentDirResolution() {
	return resolveInstallAgentDir((env) => readCurrentConfigForResolution({ env }));
}
/** Standalone SDK default; configured sessions pass their resolved agentDir. */
function getAgentDir() {
	return getAgentDirResolution().directory.dir;
}
/** Get path to managed binaries directory (fd, rg) */
function getBinDir() {
	const directory = getAgentDirResolution().optionalDirectory;
	return directory ? join(directory.dir, "bin") : void 0;
}
//#endregion
export { getBinDir as n, getAgentDir as t };
