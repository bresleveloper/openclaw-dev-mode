import { i as UPDATE_RUNNER_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { i as verifyGitUpdateRecovery } from "./update-git-runtime-CAxWdF8c.mjs";
//#region src/infra/update-runner-git-recovery.ts
/** Diagnostic storage must never replay or interrupt restoration. */
function recordGitRollbackOutcome(params) {
	try {
		params.progress?.onRollbackOutcome?.(params.outcome);
	} catch {
		params.steps.push({
			name: "rollback-outcome-recording",
			command: "",
			cwd: params.root,
			durationMs: 0,
			exitCode: 0,
			advisory: {
				kind: "recoverable-maintenance",
				message: "Rollback outcome could not be saved to update history; the direct update result retains it."
			}
		});
	}
}
async function readCurrentGitUpdateRecovery(root, timeoutMs = UPDATE_RUNNER_TIMEOUT_MS) {
	const head = await runCommandWithTimeout([
		"git",
		"-C",
		root,
		"rev-parse",
		"HEAD"
	], {
		cwd: root,
		timeoutMs
	}).catch(() => null);
	return verifyGitUpdateRecovery({
		root,
		sha: head?.code === 0 ? head.stdout.trim() : null
	});
}
//#endregion
export { recordGitRollbackOutcome as n, readCurrentGitUpdateRecovery as t };
