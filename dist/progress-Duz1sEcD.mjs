import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as UPDATE_RUN_PHASES } from "./update-run-vocabulary-BYZF4sMi.mjs";
import { o as updateStepDiagnostics } from "./update-run-record-B5xSBZMw.mjs";
import { n as isFailedUpdateStep } from "./update-run-step-ijjXM1mH.mjs";
import "./update-run-ledger-DE3m4CLB.mjs";
import { r as getUpdateRun } from "./update-run-reader-B17V1KuC.mjs";
import { r as formatUpdateDoctorLintFinding } from "./update-doctor-lint-BYChkM7H.mjs";
import { l as writeUpdateRunReportArtifact } from "./update-failure-report-artifact-Bp1ktecS.mjs";
import { r as formatDurationPrecise } from "./format-duration-CeDWULoS.mjs";
import { t as formatUpdateFailureFact } from "./update-failure-facts-format-Uhxv535Y.mjs";
import { a as renderUpdateRunReport, s as updateRunReportInputFromResult } from "./update-run-report-Dh57tzMI.mjs";
import { spinner } from "@clack/prompts";
//#region src/cli/update-cli/progress.ts
const activeUpdateProgress = /* @__PURE__ */ new Map();
const UPDATE_PROGRESS_POLL_MS = 250;
function readDisplayRecord(runId, env, source = "report") {
	try {
		return getUpdateRun(runId, { env });
	} catch (error) {
		defaultRuntime.error(`Update ${source} history unavailable: ${formatErrorMessage(error)}`);
		return;
	}
}
function createUpdateProgress(enabled, run) {
	if (!enabled) return {
		progress: {},
		stop: () => {},
		suspend: () => {},
		resume: () => {},
		dispose: () => {}
	};
	let currentSpinner = null;
	let timer;
	let currentPhase;
	let observation = "active";
	const seenPhases = /* @__PURE__ */ new Set();
	const stop = () => {
		currentSpinner?.clear();
		currentSpinner = null;
	};
	const clearTimer = () => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	};
	const read = () => observation === "active" && run ? readDisplayRecord(run.runId, run.env, "progress") : void 0;
	const renderRecord = (record) => {
		if (observation !== "active" || !run || !record) return;
		currentPhase = record.phase;
		for (const phase of UPDATE_RUN_PHASES) {
			const recorded = record.steps.some((step) => step.step === phase && step.status !== "pending");
			if (!seenPhases.has(phase) && (recorded || phase === record.phase)) {
				seenPhases.add(phase);
				stop();
				defaultRuntime.log(`Phase: ${phase}`);
			}
		}
		if (record.status !== "running") clearTimer();
	};
	const finalize = (record, terminal = record?.status !== "running") => {
		try {
			renderRecord(record);
		} finally {
			if (terminal) {
				observation = "disposed";
				clearTimer();
				if (run && activeUpdateProgress.get(run.runId) === finalize) activeUpdateProgress.delete(run.runId);
			}
			stop();
		}
	};
	const poll = () => {
		timer = void 0;
		const record = read();
		renderRecord(record);
		if (record?.status === "running") {
			timer = setTimeout(poll, UPDATE_PROGRESS_POLL_MS);
			timer.unref?.();
		}
	};
	if (run) {
		poll();
		activeUpdateProgress.set(run.runId, finalize);
	}
	return {
		progress: {
			onStepStart: (step, record) => {
				finalize(record ?? read(), false);
				const label = currentPhase ? `${currentPhase} — ${step.name}` : step.name;
				if (process.stdout.isTTY) {
					currentSpinner = spinner({ indicator: "timer" });
					currentSpinner.start(theme.accent(label));
				} else defaultRuntime.log(`${label}...`);
			},
			onStepComplete: (step, record) => {
				finalize(record ?? read(), false);
				printStep(step);
			}
		},
		stop,
		suspend: () => {
			if (observation === "active") {
				observation = "suspended";
				currentPhase = void 0;
				clearTimer();
				stop();
			}
		},
		resume: () => {
			if (observation === "suspended") {
				observation = "active";
				poll();
			}
		},
		dispose: () => finalize(read(), true)
	};
}
function printStep(step) {
	const duration = theme.muted(`(${formatDurationPrecise(step.durationMs)})`);
	const termination = step.termination === "timeout" || step.termination === "no-output-timeout" ? " — timed out" : step.signal ? ` — interrupted (${step.signal})` : "";
	defaultRuntime.log(`  ${formatStepStatus(step)} ${step.name}${termination} ${duration}`);
	for (const finding of step.doctorLintFindings ?? []) defaultRuntime.log(`    ${formatUpdateDoctorLintFinding(finding)}`);
	if (step.advisory === void 0 && !isFailedUpdateStep(step)) return;
	if (!step.advisory && step.failureFacts?.length) for (const fact of step.failureFacts) defaultRuntime.log(`    ${theme.error(formatUpdateFailureFact(fact))}`);
	const color = step.advisory !== void 0 ? theme.warn : theme.error;
	if (step.advisory) defaultRuntime.log(`    ${color(step.advisory.message)}`);
	const tails = step.advisory ? [step.stdoutTail, step.stderrTail] : updateStepDiagnostics(step).tails;
	for (const output of tails) for (const line of (output ?? "").trimEnd().split("\n").slice(-10)) if (line.trim()) defaultRuntime.log(`    ${color(line)}`);
}
function formatStepStatus(step) {
	return step.advisory ? theme.warn("!") : !isFailedUpdateStep(step) ? theme.success("✓") : step.exitCode === null ? theme.warn("?") : theme.error("✗");
}
async function printResult(result, opts, reportHints = {}) {
	const run = reportHints.record ?? (result.runId && reportHints.readHistory !== false ? readDisplayRecord(result.runId, opts.run?.env) : void 0);
	if (result.runId) activeUpdateProgress.get(result.runId)?.(run);
	const report = renderUpdateRunReport(updateRunReportInputFromResult(result, run), {
		...reportHints,
		mode: result.mode === "unknown" ? run?.target.kind : result.mode
	});
	const reportPath = await writeUpdateRunReportArtifact({
		result,
		report,
		env: opts.run?.env,
		detached: reportHints.readHistory === false
	}).catch((error) => {
		defaultRuntime.error(`Update report could not be saved: ${formatErrorMessage(error)}`);
	});
	if (opts.json) {
		defaultRuntime.writeJson({
			...result,
			...run ? { run } : {},
			reportPath
		});
		return;
	}
	defaultRuntime.log("");
	defaultRuntime.log(theme.heading(report.headline));
	if (reportPath) defaultRuntime.log(`Report: ${reportPath}`);
	for (const line of report.lines) defaultRuntime.log(line);
}
//#endregion
export { printResult as n, createUpdateProgress as t };
