import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import "./errors-DPfGDWk1.mjs";
import { i as withChildProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { n as createSanitizedCommandError, r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-BITMm5ft.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { a as getGatewayServiceUpdateNativeCommand, i as assertGatewayServiceUpdateCurrent, n as GatewayServiceAuthorityError } from "./service-update-authority-Ddw1lcTH.mjs";
//#region src/daemon/exec-file.ts
/** Native service control/inspection only; payload launchers own their full environment. */
async function execFileUtf8(command, args, options = {}) {
	const scopedNative = getGatewayServiceUpdateNativeCommand();
	const scoped = scopedNative ? true : assertGatewayServiceUpdateCurrent();
	let effectFailure;
	const beforeEffect = options.beforeEffect ? () => {
		try {
			options.beforeEffect?.();
		} catch (error) {
			effectFailure = { error };
			throw error;
		}
	} : void 0;
	try {
		beforeEffect?.();
		const runNative = scopedNative ?? runCommandWithTimeout;
		const { stdout, stderr, code, termination, signal, cleanup } = await withChildProcessOperation("service.manager", () => runNative([command, ...args], {
			baseEnv: resolveServiceManagerEnv(options.env),
			cwd: options.cwd ?? (process.platform === "win32" ? void 0 : "/"),
			killSignal: options.killSignal,
			maxOutputBytes: 1048576,
			timeoutMs: options.timeout,
			...scopedNative && beforeEffect ? { beforeInput: beforeEffect } : {}
		}));
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
		if (effectFailure) throw effectFailure.error;
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
