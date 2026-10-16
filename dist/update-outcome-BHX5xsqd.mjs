//#region src/shared/update-outcome.ts
function formatUpdateRecoverySteps(steps) {
	return steps.map((step, index) => `${index + 1}. ${"command" in step ? `Run \`${step.command}\`.` : step.instruction}`).join("\n");
}
function createRuntimeUpdateRecoverySteps(params) {
	const { nodeVersion, targetVersion, manager } = params;
	if (params.container) return [{
		kind: "deployment",
		instruction: `Pull or build an OpenClaw image with version ${targetVersion} and Node ${nodeVersion}, then recreate or redeploy the container with the same state/config mounts. In-container package changes are not durable.`
	}];
	const runtimeCommand = manager === "nvm" || manager === "fnm" ? process.platform === "win32" ? `${manager} install ${nodeVersion}; if ($LASTEXITCODE -eq 0) { ${manager} use ${nodeVersion} }` : `${manager} install ${nodeVersion} && ${manager} use ${nodeVersion}` : manager === "volta" ? `volta install node@${nodeVersion}` : void 0;
	return [
		{
			kind: "preserve-context",
			instruction: "Use the same service account and keep the existing OPENCLAW_STATE_DIR and OPENCLAW_CONFIG_PATH overrides throughout recovery."
		},
		...params.contextCommand ? [{
			kind: "preserve-context",
			command: params.contextCommand
		}] : [],
		runtimeCommand ? {
			kind: "select-runtime",
			command: runtimeCommand
		} : {
			kind: "select-runtime",
			instruction: `Install and select Node ${nodeVersion} using ${manager === "other" ? "your version manager" : "your system package manager or https://nodejs.org/en/download"}.`
		},
		params.continuation ? {
			kind: "continue-update",
			command: manager === "volta" ? `volta run --node ${nodeVersion} ${params.continuation}` : params.continuation
		} : {
			kind: "continue-update",
			instruction: "Run this installation's absolute openclaw.mjs launcher with the selected Node and the update command to recheck package and service ownership before installation."
		}
	];
}
const UPDATE_ACTIVATION_TIMEOUT_REASON = "update-activation-timeout";
const UPDATE_FOREIGN_DESTINATION_REASON = "global-install-foreign-destination";
const UPDATE_GLOBAL_PERMISSION_REASON = "global-install-permission-denied";
const UPDATE_ENVIRONMENT_FAILURE_REASONS = /* @__PURE__ */ new Set([
	"node-runtime-preflight",
	"source-artifact-ownership",
	UPDATE_GLOBAL_PERMISSION_REASON,
	UPDATE_FOREIGN_DESTINATION_REASON
]);
function formatUpdateActivationTimeoutGuidance(command = (value) => value) {
	return `Inspect \`${command("openclaw update status")}\` and \`${command("openclaw doctor")}\`. Wait for the owning updater and its child processes to stop before running \`${command("openclaw update repair")}\`. The timeout does not make rollback or removal of retained update state safe.`;
}
const UPDATE_INSTALL_SKIP_GUIDANCE = {
	"external-supervisor-update-required": "This Gateway is managed by an external supervisor. Use your server or deployment's update workflow to update OpenClaw and restart the Gateway. The Control UI and `openclaw update` cannot update this installation. No package changes or Gateway restart were attempted.",
	"container-image-install": "Pull or build the target Docker/container image, then redeploy it with the same state/config mounts. No package changes or Gateway restart were attempted.",
	"unmanaged-package-install": "No npm, pnpm, or Bun global owner was detected. Reinstall using the original method; use Yarn for Yarn global installs. No package changes or Gateway restart were attempted.",
	"package-update-requires-cli": "Run `openclaw update` through this install's npm, pnpm, or Bun global launcher. No package changes or Gateway restart were attempted."
};
const SKIPPED_UPDATE_OUTCOMES = {
	"managed-service-handoff-started": "pending",
	"restart-health-pending": "pending",
	"already-current": "noop",
	"gateway-readiness-unverified": "noop",
	"still-starting": "noop",
	"managed-service-handoff-already-running": "noop",
	"managed-service-handoff-cancelled": "noop",
	"container-image-install": "noop",
	"unmanaged-package-install": "noop",
	"package-update-requires-cli": "noop",
	"external-supervisor-update-required": "noop",
	"update-ledger-busy": "noop"
};
/** A skipped update can be a handoff, an intentional no-op, or a failed attempt. */
function classifyUpdateOutcome(outcome) {
	if (outcome.status === "ok") return "succeeded";
	if (outcome.status === "error") return "failed";
	if (outcome.status !== "skipped") return;
	return outcome.reason !== void 0 && Object.hasOwn(SKIPPED_UPDATE_OUTCOMES, outcome.reason) ? SKIPPED_UPDATE_OUTCOMES[outcome.reason] : "failed";
}
/** The restored package and its running service have both passed verification. */
function isVerifiedUpdateRollback(result) {
	return result.recovery?.serviceRestartSafe === true && result.recovery.packageRollbackVerified === true && result.recovery.service === "healthy";
}
/** Ledger refusals can be failed attempts even when no update work started. */
function isReportableUpdateRun(run) {
	if (run.status === "failed" || run.status === "rolled-back") return true;
	return run.status === "skipped" && run.reason !== null && run.reason !== "dry-run" && run.reason !== "cancelled" && classifyUpdateOutcome({
		status: run.status,
		reason: run.reason
	}) === "failed";
}
//#endregion
export { UPDATE_GLOBAL_PERMISSION_REASON as a, createRuntimeUpdateRecoverySteps as c, isReportableUpdateRun as d, isVerifiedUpdateRollback as f, UPDATE_FOREIGN_DESTINATION_REASON as i, formatUpdateActivationTimeoutGuidance as l, UPDATE_ACTIVATION_TIMEOUT_REASON as n, UPDATE_INSTALL_SKIP_GUIDANCE as o, UPDATE_ENVIRONMENT_FAILURE_REASONS as r, classifyUpdateOutcome as s, SKIPPED_UPDATE_OUTCOMES as t, formatUpdateRecoverySteps as u };
