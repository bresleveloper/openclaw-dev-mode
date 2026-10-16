import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./update-run-legacy-expiry-BU1v4N5g.mjs";
//#region src/infra/update-run-record.ts
function updateStepDiagnostics(step) {
	const stderr = step.stderrTail ?? "";
	const tails = [step.stdoutTail ?? "", stderr];
	if (!step.failureFacts?.length || !/^\[openclaw\] (?:The CLI command failed\.|Reason: )/mu.test(stderr)) return { tails };
	const messages = new Set(step.failureFacts.flatMap((fact) => fact.message ? [fact.message] : []));
	const reasonDetails = (/(?:^|\n)\[openclaw\] Reason: ([\s\S]*?)(?=\n\[openclaw\] (?:Debug: |Stack:|Try: |Help: )|$)/u.exec(stderr)?.[1])?.split(/\r?\n/u).filter((line) => !messages.has(line.trim())).join("; ").trim();
	return {
		tails: tails.map((output) => {
			let tail = output;
			for (const message of messages) {
				const envelope = {
					ok: false,
					error: {
						type: "cli_error",
						message
					}
				};
				tail = tail.replaceAll(JSON.stringify(envelope), "").replaceAll(JSON.stringify(envelope, null, 2), "");
			}
			return tail.split(/\r?\n/u).filter((line) => !/^\[openclaw\] (?:The CLI command failed\.$|Debug: |Try: |Help: )/u.test(line) && !messages.has(line.replace(/^\[openclaw\] Reason: /u, "").trim())).join("\n");
		}),
		reasonDetails
	};
}
/** A bounded diagnostic excerpt for a failed update step, never its command log or cwd. */
function summarizeUpdateStepFailure(step) {
	const diagnostics = updateStepDiagnostics(step);
	const excerpts = step.name === "database-schema-preflight" ? [(step.stderrTail?.trim() || step.stdoutTail?.trim())?.split(/\r?\n/u)[0]] : diagnostics.tails.map((tail, index) => {
		const lines = tail.trim().split(/\r?\n/u);
		const lastLine = lines.findLast((line) => line.trim() && !line.trim().startsWith("Installation recovery is unverified;")) ?? lines.at(-1) ?? "";
		const causeOnly = (index === 1 ? diagnostics.reasonDetails || step.failureFacts?.map((fact) => fact.message?.trim() || fact.code).join("; ") || lastLine : lastLine).split(/(?<=\.)\s+Installation recovery is unverified;/u)[0] ?? "";
		if (index !== 1 || !diagnostics.reasonDetails || causeOnly.includes(lastLine)) return truncateUtf16Safe(causeOnly, 120);
		const outcome = truncateUtf16Safe(lastLine, 60);
		return [truncateUtf16Safe(causeOnly, 120 - outcome.length - 2), outcome].join("; ");
	});
	return truncateUtf16Safe([step.termination === "signal" ? `signal: ${step.signal ?? "unknown"}` : step.termination ?? `Exit code: ${step.exitCode ?? "unknown"}`, ...excerpts].filter(Boolean).join("; "), 300);
}
/** Operational capture receipts stay in the private ledger, not status or diagnostic exports. */
function toPublicUpdateRun(record) {
	const origin = { ...record.origin };
	delete origin.updateRecoveryCapture;
	return {
		...record,
		origin
	};
}
function isAbandonedUpdateRun(record) {
	return record.status === "failed" && (record.reason === "abandoned" || record.reason === "legacy-driver-expired");
}
function isAcknowledgedAbandonedUpdateRun(record) {
	return isAbandonedUpdateRun(record) && record.steps.some((step) => step.step === "reconcile:acknowledged" && step.status === "completed");
}
function finishUpdateRunRecord(record, result) {
	if (record.status !== "running") return;
	const now = Date.now();
	for (const step of record.steps) if (step.step === record.phase || step.status === "in_progress") {
		step.status = result.status === "failed" ? "failed" : result.status === "skipped" ? "skipped" : "completed";
		step.endedAtMs = now;
	}
	record.status = result.status;
	record.phase = "finished";
	record.reason = result.reason ?? (result.status === "failed" ? record.reason : null);
	if (result.nextAction !== void 0) record.origin.nextAction = result.nextAction;
	record.finishedAtMs = now;
	record.after = {
		...record.after,
		...result.after
	};
	record.downtimeMs = result.downtimeMs ?? record.downtimeMs;
}
/** Only the package-owner refusal before update work can bypass repair finalization. */
function isUnacknowledgedPackageOwnerRefusal(record) {
	const requested = record.steps.find((step) => step.step === "requested");
	return record.trigger === "cli" && record.phase === "finished" && record.target.kind !== "git" && !Object.keys(record.after).length && !Object.keys(record.verification).length && !record.repair.length && record.steps.every((step) => step.step === "requested" || step.status === "completed" && (step.step === "driver:adopted" || step.step === "original-state-capture" || /^warning:original-state-capture:[1-9]\d*$/u.test(step.step)) || step.step === "installation-inspection" && step.status === "skipped") && (record.status === "skipped" && record.reason === "unmanaged-package-install" && requested?.status === "skipped" || record.status === "failed" && record.reason === "update-failed" && requested?.status === "failed" && requested.detail?.startsWith("Update refused: package manager owner is unknown; no changes were made.") === true);
}
//#endregion
export { summarizeUpdateStepFailure as a, isUnacknowledgedPackageOwnerRefusal as i, isAbandonedUpdateRun as n, toPublicUpdateRun as o, isAcknowledgedAbandonedUpdateRun as r, updateStepDiagnostics as s, finishUpdateRunRecord as t };
