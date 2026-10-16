import { setFlagsFromString } from "node:v8";
//#region src/bootstrap/node-exit-safe-compilers.ts
const EXIT_UNSAFE_COMPILERS = [{
	disable: "--no-maglev",
	enable: "--maglev"
}, {
	disable: "--no-concurrent-sparkplug",
	enable: "--concurrent-sparkplug"
}];
const EXIT_COMPILER_FLAGS = new Set(EXIT_UNSAFE_COMPILERS.flatMap(({ disable, enable }) => [disable, enable]));
/** Preserve explicit compiler policy in OpenClaw-owned Node child processes. */
function resolveForwardedExitCompilerArgs(execArgv = process.execArgv) {
	return execArgv.filter((arg) => EXIT_COMPILER_FLAGS.has(arg.replaceAll("_", "-")));
}
/** Keeps V8 compile jobs that can deadlock process.exit() off background threads. */
function disableExitUnsafeCompilers() {
	if (process.versions.bun) return;
	const explicit = new Set(process.execArgv.map((arg) => arg.replaceAll("_", "-")));
	for (const { disable, enable } of EXIT_UNSAFE_COMPILERS) if (!explicit.has(enable)) setFlagsFromString(disable);
}
//#endregion
export { resolveForwardedExitCompilerArgs as n, disableExitUnsafeCompilers as t };
