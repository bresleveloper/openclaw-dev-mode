//#region src/infra/update-run-notice.ts
/** Chat shows the outcome; the update views keep diagnostics and recovery instructions. */
function renderUpdateRunSummary(run, options = {}) {
	let headline;
	switch (run.status) {
		case "succeeded":
			headline = "✅ OpenClaw updated.";
			break;
		case "failed":
			headline = "⚠️ OpenClaw couldn't finish updating.";
			break;
		case "rolled-back":
			headline = "↩️ The update couldn't finish. OpenClaw returned to the previous version.";
			break;
		case "running":
			headline = "⬆️ OpenClaw is updating.";
			break;
		case "skipped": headline = run.reason === "already-current" ? "✅ OpenClaw is already up to date." : run.reason === "still-starting" ? "⏳ OpenClaw is installed and still starting." : run.reason === "gateway-readiness-unverified" ? "⚠️ OpenClaw is installed, but we couldn't confirm it's ready." : run.reason === "managed-service-handoff-already-running" ? "⬆️ OpenClaw is already updating." : "ℹ️ OpenClaw wasn't updated.";
	}
	const nextStep = options.manualCommand ? `Open Settings → Updates in the Control UI for details. To continue, run \`${options.manualCommand}\` in your terminal.` : "For details, open Settings → Updates in the Control UI or run `openclaw update status` in your terminal.";
	return `${headline}\n${nextStep}`;
}
/** Only the current milestone may produce a conversation notice. */
function renderUpdateRunNotice(run, kind) {
	if (kind === "finished") return run.status === "running" ? null : renderUpdateRunSummary(run);
	const noticePhase = kind === "ack" || kind === "parking" ? "requested" : kind;
	if (run.status !== "running" || run.phase !== noticePhase) return null;
	if (kind === "ack") return "⬆️ Updating OpenClaw… You'll get a message here when it's done.";
	if (kind === "activating" || kind === "parking") return "⏳ Restarting OpenClaw…";
	return "🔁 Checking that OpenClaw is ready…";
}
//#endregion
export { renderUpdateRunSummary as n, renderUpdateRunNotice as t };
