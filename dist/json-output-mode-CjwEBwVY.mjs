import { a as resolveCliParentCommandPath, n as isConfigSetJsonParseOnly } from "./config-output-mode-COOwgYEB.mjs";
import { n as loggingState } from "./state-UxwJeH7V.mjs";
import { n as withNoteOutput } from "./note-output-skr8u_kh.mjs";
//#region src/cli/json-output-mode.ts
let resolvedJsonOutputMode = null;
let stderrRoutingScopes = 0;
let stderrRoutingAfterScopes = false;
function setConsoleRouting(stderr) {
	if (stderrRoutingScopes > 0) stderrRoutingAfterScopes = stderr;
	loggingState.forceConsoleToStderr = stderr || stderrRoutingScopes > 0;
}
const noteOutputForConsoleRouting = () => loggingState.forceConsoleToStderr ? process.stderr : process.stdout;
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
/** Keeps structured JSON stdout clean by routing incidental console logs and notes to stderr. */
async function withConsoleLogsRoutedToStderrForJson(argv, run, options = {}) {
	const forceStderr = hasJsonOutputFlag(argv) || options.machineOutput;
	if (!forceStderr && !options.restoreChanges) return withNoteOutput(noteOutputForConsoleRouting, run);
	const previousForceStderr = stderrRoutingScopes > 0 ? stderrRoutingAfterScopes : loggingState.forceConsoleToStderr;
	const previousEarlyRestore = loggingState.earlyConsoleRoutingRestore;
	const previousJsonOutputMode = resolvedJsonOutputMode;
	resolvedJsonOutputMode = null;
	if (forceStderr) {
		loggingState.earlyConsoleRoutingRestore = previousForceStderr;
		setConsoleRouting(true);
	}
	try {
		return await withNoteOutput(noteOutputForConsoleRouting, run);
	} finally {
		if (!options.retainRoutingUntilProcessExit) {
			setConsoleRouting(previousForceStderr);
			loggingState.earlyConsoleRoutingRestore = previousEarlyRestore;
			resolvedJsonOutputMode = previousJsonOutputMode;
		}
	}
}
/** Let resolved command metadata override conservative early literal-flag routing. */
function applyResolvedCommandOutputMode(jsonOutputMode, machineOutputMode = jsonOutputMode) {
	resolvedJsonOutputMode = jsonOutputMode;
	const restore = loggingState.earlyConsoleRoutingRestore;
	if (!machineOutputMode && restore !== null) setConsoleRouting(restore);
}
/** Route startup diagnostics to stderr while a command's output mode is still being discovered. */
async function withConsoleLogsRoutedToStderr(run) {
	if (stderrRoutingScopes++ === 0) stderrRoutingAfterScopes = loggingState.forceConsoleToStderr;
	loggingState.forceConsoleToStderr = true;
	try {
		return await run();
	} finally {
		if (--stderrRoutingScopes === 0) loggingState.forceConsoleToStderr = stderrRoutingAfterScopes;
	}
}
//#endregion
export { withConsoleLogsRoutedToStderrForJson as a, withConsoleLogsRoutedToStderr as i, hasJsonOutputFlag as n, isJsonOutputModeActive as r, applyResolvedCommandOutputMode as t };
