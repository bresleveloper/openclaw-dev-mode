import "./errors-DnjwnOju.mjs";
import { a as isExpectedCliError, i as formatCliOperatorError } from "./failure-output-Cct-llrO.mjs";
import { r as isJsonOutputModeActive } from "./json-output-mode-DRPBa2uN.mjs";
//#region src/cli/cli-utils.ts
async function withManager(params) {
	const { manager, error } = await params.getManager();
	if (!manager) {
		params.onMissing(error);
		return;
	}
	try {
		await params.run(manager);
	} finally {
		try {
			await params.close(manager);
		} catch (err) {
			params.onCloseError?.(err);
		}
	}
}
async function runCommandWithRuntime(runtime, action, onError) {
	try {
		await action();
	} catch (err) {
		const { ExitError } = await import("./runtime-pvh-jBbt.mjs");
		if (err instanceof ExitError || isJsonOutputModeActive(process.argv) || isExpectedCliError(err)) throw err;
		if (onError) {
			onError(err);
			return;
		}
		runtime.error(formatCliOperatorError(err));
		runtime.exit(1);
	}
}
function resolveOptionFromCommand(command, key) {
	let current = command;
	while (current) {
		const opts = current.opts?.() ?? {};
		if (opts[key] !== void 0) return opts[key];
		current = current.parent ?? void 0;
	}
}
//#endregion
export { runCommandWithRuntime as n, withManager as r, resolveOptionFromCommand as t };
