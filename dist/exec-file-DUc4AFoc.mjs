import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import "./errors-DnjwnOju.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-B2RAsQsF.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { n as createSanitizedCommandError, r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { a as getGatewayServiceUpdateNativeCommand, i as assertGatewayServiceUpdateCurrent, n as GatewayServiceAuthorityError } from "./service-update-authority-DujRnzx9.mjs";
//#region src/daemon/exec-file.ts
/** Native service control/inspection only; payload launchers own their full environment. */
/** Runs a child process as UTF-8 and returns exit data instead of throwing on nonzero exit. */
async function execFileUtf8(command, args, options = {}) {
	const scopedNative = getGatewayServiceUpdateNativeCommand();
	const scoped = scopedNative ? true : assertGatewayServiceUpdateCurrent();
	try {
		const { stdout, stderr, code, termination, signal, cleanup } = await (scopedNative ?? runCommandWithTimeout)([command, ...args], {
			baseEnv: resolveServiceManagerEnv(options.env),
			cwd: options.cwd ?? (process.platform === "win32" ? void 0 : "/"),
			killSignal: options.killSignal,
			maxOutputBytes: 1048576,
			timeoutMs: options.timeout
		});
		if (scoped && cleanup === "uncertain") throw new CommandProcessCleanupError();
		if (!scopedNative) assertGatewayServiceUpdateCurrent();
		return {
			stdout,
			stderr: [stderr, termination === "exit" ? "" : createSanitizedCommandError({
				timedOut: termination === "timeout" || termination === "no-output-timeout",
				isTerminated: true,
				signal
			}).message].filter(Boolean).join("\n"),
			code: termination === "exit" ? code ?? 1 : code || 1,
			termination
		};
	} catch (error) {
		if (error instanceof GatewayServiceAuthorityError || hasCommandProcessCleanupError(error)) throw error;
		return {
			stdout: "",
			stderr: error instanceof Error ? error.message : String(error),
			code: 1,
			termination: "error",
			errorCode: extractErrorCode(error)
		};
	}
}
//#endregion
export { execFileUtf8 as t };
