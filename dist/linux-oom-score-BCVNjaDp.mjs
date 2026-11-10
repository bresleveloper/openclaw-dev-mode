import { n as parseBooleanValue } from "./boolean-CFfzB3ix.mjs";
import { r as readChildRuntimeViability } from "./child-runtime-viability-X4GxYG5L.mjs";
import fs from "node:fs";
import { spawn } from "node:child_process";
//#region src/process/linux-oom-score.ts
/**
* Linux children inherit the Gateway's OOM score, leaving the larger Gateway
* vulnerable under memory pressure (#70404). Raise children to 1000 through a
* shell that execs the command, or after native spawn when argv0 must be retained.
* Raising a same-user child's score needs no CAP_SYS_RESOURCE.
* OPENCLAW_CHILD_OOM_SCORE_ADJ=0 (also false/no/off) opts out per child or process.
*/
const CHILD_OOM_SCORE_ADJ_ENV_KEY = "OPENCLAW_CHILD_OOM_SCORE_ADJ";
const OOM_SCORE_WRAP_SHELL = "/bin/sh";
const OOM_SCORE_WRAP_SCRIPT = "echo 1000 > /proc/self/oom_score_adj 2>/dev/null; exec \"$0\" \"$@\"";
const SHELL_INIT_ENV_CARRIERS = [
	["BASH_ENV", "OC_INTERNAL_OOM_EXEC_BASH_ENV"],
	["ENV", "OC_INTERNAL_OOM_EXEC_ENV"],
	["CDPATH", "OC_INTERNAL_OOM_EXEC_CDPATH"],
	["PS4", "OC_INTERNAL_OOM_EXEC_PS4"]
];
const NON_RESTORABLE_BASH_ENV_KEY = /^(?:SHELLOPTS|BASHOPTS|BASH_FUNC_.*)$/u;
const OOM_SCORE_RESTORE_EXEC_ENV_SCRIPT = [
	"echo 1000 > /proc/self/oom_score_adj 2>/dev/null; if [ \"${OC_INTERNAL_OOM_EXEC_BASH_ENV+x}\" = x ]; then BASH_ENV=\"$OC_INTERNAL_OOM_EXEC_BASH_ENV\"; export BASH_ENV; fi; unset OC_INTERNAL_OOM_EXEC_BASH_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_ENV+x}\" = x ]; then ENV=\"$OC_INTERNAL_OOM_EXEC_ENV\"; export ENV; fi; unset OC_INTERNAL_OOM_EXEC_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_CDPATH+x}\" = x ]; then CDPATH=\"$OC_INTERNAL_OOM_EXEC_CDPATH\"; export CDPATH; fi; unset OC_INTERNAL_OOM_EXEC_CDPATH",
	"if [ \"${OC_INTERNAL_OOM_EXEC_PS4+x}\" = x ]; then PS4=\"$OC_INTERNAL_OOM_EXEC_PS4\"; export PS4; fi; unset OC_INTERNAL_OOM_EXEC_PS4; exec \"$0\" \"$@\""
].join("; ");
let cachedShellAvailable = null;
function defaultShellAvailable() {
	if (cachedShellAvailable !== null) return cachedShellAvailable;
	try {
		cachedShellAvailable = fs.statSync(OOM_SCORE_WRAP_SHELL).isFile();
	} catch {
		cachedShellAvailable = false;
	}
	return cachedShellAvailable;
}
function raiseChildOomScore(pid) {
	if (pid === void 0) return;
	try {
		fs.writeFileSync(`/proc/${pid}/oom_score_adj`, "1000");
	} catch {}
}
function spawnOomScoreAdjusted(command, args, options) {
	const child = spawn(command, args, options);
	if (!options.shell && shouldAdjustChildOomScore(options)) raiseChildOomScore(child.pid);
	return child;
}
function shouldAdjustChildOomScore(options) {
	if ((options?.platform ?? process.platform) !== "linux") return false;
	const value = options?.env?.[CHILD_OOM_SCORE_ADJ_ENV_KEY] ?? process.env[CHILD_OOM_SCORE_ADJ_ENV_KEY];
	return parseBooleanValue(value) !== false;
}
function isWrapped(command, args) {
	return command === OOM_SCORE_WRAP_SHELL && args[0] === "-c" && args[1] === OOM_SCORE_WRAP_SCRIPT;
}
/** Diagnostics attribute the final command without changing the wrapper's execution policy. */
function resolveOomScoreWrappedCommand(command, args) {
	return command === OOM_SCORE_WRAP_SHELL && args[0] === "-c" && (args[1] === OOM_SCORE_WRAP_SCRIPT || args[1] === OOM_SCORE_RESTORE_EXEC_ENV_SCRIPT) && args[2] ? args[2] : void 0;
}
function hardenShellEnv(baseEnv) {
	const next = { ...baseEnv ?? process.env };
	for (const [key] of SHELL_INIT_ENV_CARRIERS) delete next[key];
	for (const key of Object.keys(next)) if (NON_RESTORABLE_BASH_ENV_KEY.test(key)) delete next[key];
	return next;
}
function prepareOomScoreAdjustedSpawnWithExecEnvPolicy(command, args = [], options, preserveExecEnv = false) {
	const copy = [...args];
	const directSpawn = {
		command,
		args: copy,
		...options?.argv0 === void 0 ? {} : { argv0: options.argv0 },
		env: options?.env,
		wrapped: false
	};
	if (!command || command.startsWith("-") || !shouldAdjustChildOomScore(options) || command === process.execPath && !readChildRuntimeViability().available) return directSpawn;
	if (options?.argv0 !== void 0 && options.argv0 !== command) return {
		...directSpawn,
		afterSpawn: raiseChildOomScore
	};
	if (!(options?.shellAvailable ?? defaultShellAvailable)()) return directSpawn;
	if (!preserveExecEnv && isWrapped(command, copy)) return {
		command,
		args: copy,
		env: hardenShellEnv(options?.env),
		wrapped: true
	};
	const effectiveEnv = options?.env ?? process.env;
	if (preserveExecEnv && Object.entries(effectiveEnv).some(([key, value]) => value !== void 0 && NON_RESTORABLE_BASH_ENV_KEY.test(key))) return directSpawn;
	const wrappedEnv = hardenShellEnv(effectiveEnv);
	if (preserveExecEnv) for (const [key, carrier] of SHELL_INIT_ENV_CARRIERS) {
		if (effectiveEnv[carrier] !== void 0) return directSpawn;
		delete wrappedEnv[carrier];
		if (effectiveEnv[key] !== void 0) wrappedEnv[carrier] = effectiveEnv[key];
	}
	return {
		command: OOM_SCORE_WRAP_SHELL,
		args: [
			"-c",
			preserveExecEnv ? OOM_SCORE_RESTORE_EXEC_ENV_SCRIPT : OOM_SCORE_WRAP_SCRIPT,
			command,
			...copy
		],
		env: wrappedEnv,
		wrapped: true
	};
}
function prepareOomScoreAdjustedSpawn(command, args = [], options) {
	return prepareOomScoreAdjustedSpawnWithExecEnvPolicy(command, args, options);
}
function prepareOomScoreAdjustedSpawnPreservingExecEnv(command, args = [], options) {
	return prepareOomScoreAdjustedSpawnWithExecEnvPolicy(command, args, options, true);
}
//#endregion
export { spawnOomScoreAdjusted as i, prepareOomScoreAdjustedSpawnPreservingExecEnv as n, resolveOomScoreWrappedCommand as r, prepareOomScoreAdjustedSpawn as t };
