import { t as resolveServiceManagerEnv } from "./service-process-env-B2RAsQsF.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { i as assertGatewayServiceUpdateCurrent } from "./service-update-authority-DujRnzx9.mjs";
//#region src/daemon/schtasks-exec.ts
/** Executes Windows Task Scheduler commands with daemon-friendly timeouts. */
const SCHTASKS_TIMEOUT_MS = 15e3;
const SCHTASKS_NO_OUTPUT_TIMEOUT_MS = 3e4;
/** Runs Windows schtasks with bounded timeouts and normalized process results. */
async function execSchtasks(args) {
	assertGatewayServiceUpdateCurrent();
	const result = await runCommandWithTimeout(["schtasks", ...args], {
		baseEnv: resolveServiceManagerEnv(),
		timeoutMs: SCHTASKS_TIMEOUT_MS,
		noOutputTimeoutMs: SCHTASKS_NO_OUTPUT_TIMEOUT_MS
	});
	const timeoutDetail = result.termination === "timeout" ? `schtasks timed out after ${SCHTASKS_TIMEOUT_MS}ms` : result.termination === "no-output-timeout" ? `schtasks produced no output for ${SCHTASKS_NO_OUTPUT_TIMEOUT_MS}ms` : result.termination !== "exit" ? "schtasks command terminated before confirmed completion" : "";
	return {
		stdout: result.stdout,
		stderr: result.stderr || timeoutDetail,
		code: result.termination === "exit" ? result.code ?? 1 : result.code || 124
	};
}
//#endregion
export { execSchtasks as t };
