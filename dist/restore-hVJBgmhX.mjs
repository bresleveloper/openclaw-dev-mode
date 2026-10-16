import { t as clearActiveProgressLine } from "./progress-line-DiTuCPbL.mjs";
//#region packages/terminal-core/src/restore.ts
const RESET_SEQUENCE = "\x1B[0m\x1B[?25h\x1B[?1000l\x1B[?1002l\x1B[?1003l\x1B[?1006l\x1B[?2004l\x1B[<u\x1B[>4;0m";
function reportRestoreFailure(scope, err, reason) {
	const suffix = reason ? ` (${reason})` : "";
	const message = `[terminal] restore ${scope} failed${suffix}: ${String(err)}`;
	try {
		process.stderr.write(`${message}\n`);
	} catch (writeErr) {
		console.error(`[terminal] restore reporting failed${suffix}: ${String(writeErr)}`);
	}
}
function restoreTerminalState(reason, options = {}) {
	const resumeStdin = options.resumeStdinIfPaused ?? options.resumeStdin ?? false;
	const resetStream = options.resetStream ?? process.stdout;
	const restore = (scope, action) => {
		try {
			action();
		} catch (err) {
			reportRestoreFailure(scope, err, reason);
		}
	};
	restore("progress line", clearActiveProgressLine);
	const stdin = process.stdin;
	if (stdin.isTTY && typeof stdin.setRawMode === "function") {
		restore("raw mode", () => stdin.setRawMode(false));
		if (resumeStdin && typeof stdin.isPaused === "function" && stdin.isPaused()) restore("stdin resume", () => stdin.resume());
	}
	if (resetStream.isTTY) restore("terminal reset", () => resetStream.write(RESET_SEQUENCE));
}
//#endregion
export { restoreTerminalState as t };
