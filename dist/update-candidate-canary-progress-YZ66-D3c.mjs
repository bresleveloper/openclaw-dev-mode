//#region src/infra/update-candidate-canary-progress.ts
/** Private stderr contract between the candidate Gateway and its updater. */
const UPDATE_CANARY_PROGRESS_PREFIX = "openclaw-update-canary-progress: ";
const UPDATE_CANARY_PROGRESS_ARGS = ["--update-canary", "--update-canary"];
function supportsUpdateCanaryProgress(argv) {
	const marker = UPDATE_CANARY_PROGRESS_ARGS[0];
	return argv.indexOf(marker) < argv.lastIndexOf(marker);
}
const acceptedMilestones = /* @__PURE__ */ new Set([
	"entry.bootstrap",
	"entry.argv",
	"entry.run-main-import",
	"cli.main.argv",
	"cli.main.gateway-run-select-environment",
	"cli.main.gateway-run-imports",
	"cli.main.gateway-run-pre-bootstrap",
	"cli.main.gateway-run-bootstrap",
	"cli.config-snapshot",
	"cli.auth-resolve",
	"cli.gateway-loop",
	"process.bootstrap",
	"state.ownership",
	"state.schema-preflight",
	"config.snapshot",
	"config.auth",
	"plugins.bootstrap",
	"runtime.config",
	"runtime.state",
	"gateway.kernel-state",
	"http.bound",
	"runtime.post-attach",
	"sidecars.ready",
	"ready"
]);
function isUpdateCanaryStartupMilestone(name) {
	return acceptedMilestones.has(name);
}
//#endregion
export { supportsUpdateCanaryProgress as i, UPDATE_CANARY_PROGRESS_PREFIX as n, isUpdateCanaryStartupMilestone as r, UPDATE_CANARY_PROGRESS_ARGS as t };
