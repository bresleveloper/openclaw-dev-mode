import { r as signalProcessTree } from "./kill-tree-BGQdx374.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as scheduleAdoptedChildZombieReapAfterExit } from "./scoped-child-reaper-GgqPcup9.mjs";
//#region src/process/child-process-tree.ts
function shouldDetachChildForProcessTree() {
	return process.platform !== "win32";
}
function isChildProcessTreeAlive(child) {
	if (typeof child.pid !== "number" || child.pid <= 0) return false;
	const target = shouldDetachChildForProcessTree() ? -child.pid : child.pid;
	try {
		process.kill(target, 0);
		return true;
	} catch (error) {
		return !hasErrnoCode(error, "ESRCH");
	}
}
function signalChildProcessTree(child, signal, onComplete) {
	if (typeof child.pid === "number" && child.pid > 0) {
		const usedProcessGroup = shouldDetachChildForProcessTree();
		signalProcessTree(child.pid, signal, {
			detached: usedProcessGroup,
			onComplete
		});
		scheduleAdoptedChildZombieReapAfterExit(child, usedProcessGroup);
		return;
	}
	try {
		child.kill(signal);
	} finally {
		onComplete?.();
	}
}
function forceKillChildProcessTree(child) {
	signalChildProcessTree(child, "SIGKILL");
}
//#endregion
export { signalChildProcessTree as i, isChildProcessTreeAlive as n, shouldDetachChildForProcessTree as r, forceKillChildProcessTree as t };
