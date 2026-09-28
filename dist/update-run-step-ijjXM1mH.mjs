import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as UPDATE_RUN_TEXT_LIMIT } from "./update-run-limits-Dcay4rgn.mjs";
import { n as formatUpdateDoctorConfigChange } from "./update-doctor-config-BrLAVDg0.mjs";
import { a as summarizeUpdateStepFailure } from "./update-run-record-B5xSBZMw.mjs";
//#region src/infra/update-run-step.ts
/** Physical process success does not erase a failed inspection or incomplete termination. */
function isFailedUpdateStep(step) {
	return !step.advisory && (step.exitCode !== 0 || Boolean(step.failureFacts?.length || step.killed || step.outputLimitExceeded) || step.termination !== void 0 && step.termination !== "exit");
}
function isUpdateGatewayReadinessPending(result) {
	const step = result.steps.findLast((entry) => entry.name === "gateway verification" || entry.name === "rollback gateway verification" || entry.name === "gateway recovery verification");
	return step?.termination === "timeout" && step.advisory?.kind === "recoverable-maintenance";
}
/** Preserve producer-classified diagnostics without turning successful inventory into warnings. */
function updateRunStepsFromResultStep(step) {
	const text = (value) => truncateUtf16Safe(value, UPDATE_RUN_TEXT_LIMIT);
	const failed = isFailedUpdateStep(step);
	const refusal = step.configWriteRefusal;
	const configWriteRefusal = refusal ? {
		reason: text(refusal.reason),
		message: text(refusal.message),
		keys: refusal.keys.slice(0, 32).map(text)
	} : void 0;
	const capacity = step.snapshotCapacity;
	const snapshotCapacity = capacity ? {
		...capacity,
		candidates: capacity.candidates.slice(0, 3).map((candidate) => {
			const copied = {
				kind: candidate.kind,
				availableBytes: candidate.availableBytes,
				directory: text(candidate.directory)
			};
			if (candidate.allocationError) copied.allocationError = text(candidate.allocationError);
			return copied;
		}),
		selection: capacity.selection ? {
			...capacity.selection,
			directory: text(capacity.selection.directory)
		} : null
	} : void 0;
	const warnings = step.warnings?.length ? step.warnings : step.advisory ? [step.advisory.message] : [];
	return [
		{
			step: text(step.name),
			status: failed ? "failed" : "completed",
			exitCode: step.exitCode,
			failureFacts: step.failureFacts?.length && !step.advisory ? step.failureFacts.slice(0, 5) : void 0,
			configWriteRefusal,
			snapshotCapacity,
			detail: failed || step.exitCode !== 0 ? text(step.advisory?.message ?? summarizeUpdateStepFailure(step)) : void 0
		},
		...step.doctorLintFindings ? [{
			step: text(`finalize:doctor-lint:${step.name}`),
			status: "completed",
			detail: formatUpdateDoctorLintReceipt(step)
		}] : [],
		...[{
			kind: "warning",
			messages: warnings
		}, {
			kind: "diagnostic",
			messages: step.diagnostics ?? []
		}].flatMap(({ kind, messages }) => messages.slice(0, 32).map((detail, index) => ({
			step: text(`${kind}:${step.name}${index === 0 ? "" : `:${index + 1}`}`),
			status: "completed",
			detail: text(detail)
		}))),
		...(step.configChanges ?? []).slice(0, 32).map((change, index) => {
			const configChange = change.kind === "key" ? {
				kind: change.kind,
				key: text(change.key)
			} : {
				kind: change.kind,
				message: text(change.message)
			};
			return {
				step: text(`doctor-config:${step.name}:${index}`),
				status: "completed",
				detail: text(formatUpdateDoctorConfigChange(configChange)),
				configChange
			};
		})
	];
}
function updateRunWarningMessages(steps) {
	return steps.flatMap((step) => (step.step === "reconcile:settle" || step.status === "completed" && step.step.startsWith("warning:")) && step.detail ? [step.detail] : []);
}
/** Shared bounded receipt for history and rollback-readable diagnostics. */
function formatUpdateDoctorLintReceipt(step, maxBytes = UPDATE_RUN_TEXT_LIMIT) {
	const lint = {
		exitCode: step.exitCode,
		termination: step.termination,
		signal: step.signal,
		killed: step.killed,
		outputLimitExceeded: step.outputLimitExceeded,
		counts: {
			error: 0,
			warning: 0,
			info: 0
		},
		errors: [],
		omitted: 0
	};
	for (const finding of step.doctorLintFindings ?? []) {
		const severity = finding.severity === "warning" || finding.severity === "info" ? finding.severity : "error";
		lint.counts[severity]++;
		if (severity === "error") lint.errors.push({
			checkId: truncateUtf16Safe(finding.checkId, 128),
			message: truncateUtf16Safe([finding.requirement, finding.message].filter(Boolean).join(": "), 200)
		});
	}
	const utf8 = new TextEncoder();
	while (utf8.encode(JSON.stringify(JSON.stringify(lint))).length > maxBytes && lint.errors.length) {
		lint.errors.pop();
		lint.omitted++;
	}
	return JSON.stringify(lint);
}
//#endregion
export { updateRunWarningMessages as a, updateRunStepsFromResultStep as i, isFailedUpdateStep as n, isUpdateGatewayReadinessPending as r, formatUpdateDoctorLintReceipt as t };
