import { constants } from "node:os";
//#region src/cli/subprocess-exit-code.ts
function resolveSubprocessExitCode(exitCode, signal) {
	if (typeof exitCode === "number") return exitCode;
	const signalNumber = signal ? constants.signals[signal] : void 0;
	return typeof signalNumber === "number" ? 128 + signalNumber : 1;
}
//#endregion
export { resolveSubprocessExitCode as t };
