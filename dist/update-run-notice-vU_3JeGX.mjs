//#region src/infra/update-run-notice.ts
const UPDATE_RUN_HEADLINES = /* @__PURE__ */ new Map([
	["succeeded", "✅ OpenClaw updated."],
	["failed", "⚠️ OpenClaw couldn't finish updating."],
	["rolled-back", "↩️ The update couldn't finish. OpenClaw returned to the previous version."],
	["running", "⬆️ OpenClaw is updating."]
]);
const SKIPPED_UPDATE_RUN_HEADLINES = /* @__PURE__ */ new Map([
	["already-current", "✅ OpenClaw is already up to date."],
	["still-starting", "⏳ OpenClaw is installed and still starting."],
	["gateway-readiness-unverified", "⚠️ OpenClaw is installed, but we couldn't confirm it's ready."],
	["managed-service-handoff-already-running", "⚠️ A previous update still holds this installation."]
]);
/** Chat shows the outcome; the update views keep diagnostics and recovery instructions. */
function renderUpdateRunSummary(run, options = {}) {
	return `${run.status !== "skipped" ? UPDATE_RUN_HEADLINES.get(run.status) : SKIPPED_UPDATE_RUN_HEADLINES.get(run.reason) ?? "ℹ️ OpenClaw wasn't updated."}\n${options.manualCommand ? `Open Settings → Updates in the Control UI for details. To continue, run \`${options.manualCommand}\` in your terminal.` : "For details, open Settings → Updates in the Control UI or run `openclaw update status` in your terminal."}`;
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
