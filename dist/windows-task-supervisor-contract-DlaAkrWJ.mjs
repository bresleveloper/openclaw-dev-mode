//#region src/daemon/windows-task-supervisor-contract.ts
/** Internal argument used by generated Windows Gateway service launchers. */
const WINDOWS_TASK_SUPERVISOR_FLAG = "--task-supervisor";
/** The install preference becomes a consumed runtime marker only inside the hidden launcher. */
const WINDOWS_TASK_LAUNCHER_ENV = "OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER";
const WINDOWS_TASK_LAUNCHER_ACTIVE = "wscript";
/** Internal argument marking the Gateway child owned by the task supervisor. */
const WINDOWS_TASK_SUPERVISOR_CHILD_FLAG = "--task-supervisor-child";
const WINDOWS_TASK_SUPERVISOR_RESTART_EXIT_CODE_MIN = 65536;
const WINDOWS_TASK_SUPERVISOR_RESTART_EXIT_CODE_MAX = 2147483647;
function isWindowsTaskSupervisorChildArgument(argument) {
	return argument === "--task-supervisor-child" || argument.startsWith(`--task-supervisor-child=`);
}
function formatWindowsTaskSupervisorChildArgument(exitCode) {
	return `${WINDOWS_TASK_SUPERVISOR_CHILD_FLAG}=${exitCode}`;
}
function readWindowsTaskSupervisorRestartExitCode(argv) {
	const matches = argv.filter(isWindowsTaskSupervisorChildArgument);
	if (matches.length !== 1 || matches[0] === "--task-supervisor-child") return;
	const raw = matches[0]?.slice(24);
	if (!raw || !/^\d+$/u.test(raw)) return;
	const exitCode = Number(raw);
	return Number.isSafeInteger(exitCode) && exitCode >= 65536 && exitCode <= 2147483647 ? exitCode : void 0;
}
//#endregion
export { WINDOWS_TASK_SUPERVISOR_RESTART_EXIT_CODE_MAX as a, isWindowsTaskSupervisorChildArgument as c, WINDOWS_TASK_SUPERVISOR_FLAG as i, readWindowsTaskSupervisorRestartExitCode as l, WINDOWS_TASK_LAUNCHER_ENV as n, WINDOWS_TASK_SUPERVISOR_RESTART_EXIT_CODE_MIN as o, WINDOWS_TASK_SUPERVISOR_CHILD_FLAG as r, formatWindowsTaskSupervisorChildArgument as s, WINDOWS_TASK_LAUNCHER_ACTIVE as t };
