import { a as resolveCliParentCommandPath, n as isConfigSetJsonParseOnly } from "./config-output-mode-DrhJ7F5x.mjs";
import { n as loggingState } from "./state-UxwJeH7V.mjs";
//#region src/cli/json-output-mode.ts
let resolvedJsonOutputMode = null;
/** Detects CLI JSON mode before Commander parses options, stopping at the argv sentinel. */
function hasJsonOutputFlag(argv) {
	for (const arg of argv) {
		if (arg === "--") return false;
		if (arg === "--json" || arg.startsWith("--json=")) return true;
	}
	return false;
}
/** Uses Commander-resolved output ownership when available, then falls back to argv. */
function isJsonOutputModeActive(argv) {
	return resolvedJsonOutputMode ?? (hasJsonOutputFlag(argv) && !(resolveCliParentCommandPath(argv, "config")?.[1] === "set" && isConfigSetJsonParseOnly(argv)));
}
/** Keeps structured JSON stdout clean by routing incidental console logs to stderr. */
async function withConsoleLogsRoutedToStderrForJson(argv, run, options = {}) {
	const forceStderr = hasJsonOutputFlag(argv) || options.machineOutput;
	if (!forceStderr && !options.restoreChanges) return run();
	const previousForceStderr = loggingState.forceConsoleToStderr;
	const previousEarlyRestore = loggingState.earlyConsoleRoutingRestore;
	const previousJsonOutputMode = resolvedJsonOutputMode;
	resolvedJsonOutputMode = null;
	if (forceStderr) {
		loggingState.earlyConsoleRoutingRestore = previousForceStderr;
		loggingState.forceConsoleToStderr = true;
	}
	try {
		return await run();
	} finally {
		if (!options.retainRoutingUntilProcessExit) {
			loggingState.forceConsoleToStderr = previousForceStderr;
			loggingState.earlyConsoleRoutingRestore = previousEarlyRestore;
			resolvedJsonOutputMode = previousJsonOutputMode;
		}
	}
}
/** Let resolved command metadata override conservative early literal-flag routing. */
function applyResolvedCommandOutputMode(jsonOutputMode, machineOutputMode = jsonOutputMode) {
	resolvedJsonOutputMode = jsonOutputMode;
	const restore = loggingState.earlyConsoleRoutingRestore;
	if (!machineOutputMode && restore !== null) loggingState.forceConsoleToStderr = restore;
}
/** Route startup diagnostics to stderr while a command's output mode is still being discovered. */
async function withConsoleLogsRoutedToStderr(run) {
	const previousForceStderr = loggingState.forceConsoleToStderr;
	loggingState.forceConsoleToStderr = true;
	try {
		return await run();
	} finally {
		loggingState.forceConsoleToStderr = previousForceStderr;
	}
}
//#endregion
export { withConsoleLogsRoutedToStderrForJson as a, withConsoleLogsRoutedToStderr as i, hasJsonOutputFlag as n, isJsonOutputModeActive as r, applyResolvedCommandOutputMode as t };
