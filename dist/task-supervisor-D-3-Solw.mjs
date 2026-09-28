import { a as WINDOWS_TASK_SUPERVISOR_RESTART_EXIT_CODE_MAX, c as isWindowsTaskSupervisorChildArgument, n as WINDOWS_TASK_LAUNCHER_ENV, o as WINDOWS_TASK_SUPERVISOR_RESTART_EXIT_CODE_MIN, s as formatWindowsTaskSupervisorChildArgument } from "./windows-task-supervisor-contract-DlaAkrWJ.mjs";
import { n as flushLogger } from "./logger--ALOusOG.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as quoteCmdScriptArg } from "./cmd-argv-Cqm1e4_m.mjs";
import { t as getProcessSupervisor } from "./supervisor-Dye57EtO.mjs";
import { randomInt } from "node:crypto";
//#region src/cli/gateway-cli/task-supervisor.ts
const log = createSubsystemLogger("gateway/task-supervisor");
function renderGatewayTaskCommand(restartExitCode) {
	const childArgs = [...process.execArgv, ...process.argv.slice(1)].filter((argument) => argument !== "--task-supervisor" && !isWindowsTaskSupervisorChildArgument(argument));
	if (childArgs.length === 0) throw new Error("Windows task supervisor could not resolve the Gateway command");
	return [
		process.execPath,
		...childArgs,
		formatWindowsTaskSupervisorChildArgument(restartExitCode)
	].map((argument) => quoteCmdScriptArg(argument)).join(" ");
}
/**
* Runs the real Gateway inside the Windows Job Object owned by ProcessSupervisor.
* The hidden task launcher owns an outer Job containing this supervisor. The
* command anchor owns the inner Job used for cancellation and extinction joins.
*/
async function runWindowsGatewayTaskSupervisor() {
	if (process.platform !== "win32") throw new Error("--task-supervisor is only available to the Windows Gateway service");
	let stderr = "";
	let managed = null;
	let cancelled = false;
	const cancel = () => {
		cancelled = true;
		managed?.cancel("signal");
	};
	process.once("SIGINT", cancel);
	process.once("SIGTERM", cancel);
	try {
		const launcher = process.env[WINDOWS_TASK_LAUNCHER_ENV];
		delete process.env[WINDOWS_TASK_LAUNCHER_ENV];
		if (launcher === "wscript") {
			const [{ default: koffi }, { bindWindowsTaskLauncher }] = await Promise.all([import("koffi"), import("./service-child-windows-task-launcher-Ct9X7k6N.mjs")]);
			bindWindowsTaskLauncher(koffi);
		}
		while (true) {
			stderr = "";
			const restartExitCode = randomInt(WINDOWS_TASK_SUPERVISOR_RESTART_EXIT_CODE_MIN, WINDOWS_TASK_SUPERVISOR_RESTART_EXIT_CODE_MAX + 1);
			managed = await getProcessSupervisor().spawn({
				mode: "anchored-shell",
				command: renderGatewayTaskCommand(restartExitCode),
				scopeKey: `gateway-task-supervisor:${process.pid}`,
				captureOutput: false,
				onStderr: (chunk) => {
					stderr = (stderr + chunk).slice(-8192);
				}
			});
			if (cancelled) managed.cancel("signal");
			const result = await managed.wait();
			const diagnostic = {
				exitCode: result.exitCode,
				exitSignal: result.exitSignal,
				reason: result.reason,
				stderr
			};
			const restartRequested = result.exitCode === restartExitCode;
			if (result.exitCode === 0) log.info("Gateway child exited", diagnostic);
			else if (restartRequested) log.info(cancelled ? "Gateway child restart suppressed by shutdown" : "Gateway child requested restart", diagnostic);
			else {
				process.exitCode = result.exitCode ?? 1;
				log.error("Gateway child failed", diagnostic);
			}
			await managed.waitForExtinction?.();
			managed = null;
			if (restartRequested && !cancelled) continue;
			return;
		}
	} catch (error) {
		process.exitCode = 1;
		log.error(`Gateway task supervisor failed: ${String(error)}`, { stderr });
	} finally {
		process.removeListener("SIGINT", cancel);
		process.removeListener("SIGTERM", cancel);
		await flushLogger();
	}
}
//#endregion
export { runWindowsGatewayTaskSupervisor };
