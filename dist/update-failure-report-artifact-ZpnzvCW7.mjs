import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { m as writeTextAtomic } from "./json-files-DYmSFHoN.mjs";
import { lr as uuid } from "./schemas-BOYIvvln.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { s as withFileLock } from "./file-lock-BmWJVvRa.mjs";
import "./file-lock-BMq7QYoB.mjs";
import { c as redactSupportString } from "./diagnostic-support-redaction-BP5XqJ7g.mjs";
import { s as classifyUpdateOutcome } from "./update-outcome-DLbo5ecI.mjs";
import { o as updateRunStepsFromResultStep } from "./update-run-step-Db60sdKj.mjs";
import { r as formatUpdateDoctorLintFinding } from "./update-doctor-lint-BSXy6tAC.mjs";
import { r as sanitizeTriageUpdateFailure } from "./triage-update-YKF7SYYY.mjs";
import { a as renderUpdateRunReport, i as isUpdateRunReportInProgress } from "./update-run-report-rePuji8s.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/infra/update-failure-report-artifact.ts
/** Filesystem lifecycle for a non-authoritative, sanitized update report body. */
const DOCTOR_LINT_REPORT_SECTION = "\n## Complete Doctor lint findings (";
const NATIVE_FAILURE_REPORT_SECTION = "\n## Native process diagnostics\n";
function nativeFailureDiagnostics(steps) {
	const diagnostics = steps.flatMap((step) => step.status === "failed" && step.termination === "signal" && step.stderrTail ? [`Check: ${step.step}; termination: signal; signal: ${step.signal ?? "unknown"}\n\n${step.stderrTail.split("\n").map((line) => `    ${line}`).join("\n")}`] : []);
	return diagnostics.length ? `${NATIVE_FAILURE_REPORT_SECTION}\n${diagnostics.join("\n\n")}` : "";
}
async function readSavedUpdateReport(filePath) {
	return fs.readFile(filePath, "utf8").catch((error) => {
		if (hasErrorCode(error, "ENOENT")) return;
		throw error;
	});
}
async function withUpdateReportWrite(outputPath, write) {
	await fs.mkdir(path.dirname(outputPath), {
		recursive: true,
		mode: 448
	});
	return withFileLock(outputPath, {
		retries: {
			retries: 200,
			factor: 1,
			minTimeout: 25,
			maxTimeout: 25,
			randomize: false
		},
		stale: 3e4,
		staleRecovery: "remove-if-definitely-stale"
	}, write);
}
/** The recovery writer can finish a run after its CLI exits without publishing a report. */
async function refreshUpdateRunReportArtifact(run, options = {}) {
	if (run.status === "running") return;
	const env = options.env ?? process.env;
	const stateDir = resolveStateDir(env);
	const id = uuid().parse(run.runId);
	const outputPath = path.join(stateDir, "update-reports", `${id}.md`);
	await withUpdateReportWrite(outputPath, async () => {
		const previous = await readSavedUpdateReport(outputPath) ?? "";
		if (previous && !isUpdateRunReportInProgress(previous)) return;
		const appendixStart = previous.indexOf(DOCTOR_LINT_REPORT_SECTION);
		const appendix = appendixStart < 0 ? "" : `\n${previous.slice(appendixStart)}`;
		const native = appendix.includes(NATIVE_FAILURE_REPORT_SECTION) ? "" : nativeFailureDiagnostics(run.steps);
		const report = renderUpdateRunReport(run, {
			mode: run.target.kind,
			markdownLimit: Infinity
		});
		await writeTextAtomic(outputPath, redactSupportString(`${report.markdown}${appendix}${native}`, {
			env,
			stateDir
		}, { maxLength: Number.MAX_SAFE_INTEGER }), {
			mode: 384,
			dirMode: 448
		});
	});
}
function updateDiagnosticArtifactName(kind, id = randomUUID()) {
	return `openclaw-update-${kind}-${id.replaceAll("-", "_")}.json`;
}
/** Complete sanitized inventories are named artifacts, never restored-runtime input. */
async function writeUpdateFailureLintArtifact(inventory, directory) {
	const outputPath = path.join(directory, updateDiagnosticArtifactName("lint"));
	await writeTextAtomic(outputPath, `${JSON.stringify(inventory)}\n`, {
		mode: 384,
		dirMode: 448
	});
	return outputPath;
}
async function writeTriageUpdateFailure(failure, options = {}) {
	const env = options.env ?? process.env;
	const stateDir = resolveStateDir(env);
	const outputPath = options.outputPath ?? path.join(stateDir, "logs", "support", updateDiagnosticArtifactName("failure"));
	const inventory = sanitizeTriageUpdateFailure(failure, {
		env,
		stateDir
	}, "inventory");
	let detail;
	if ("result" in inventory && inventory.result.steps.some((step) => step.doctorLintFindings)) detail = await writeUpdateFailureLintArtifact(inventory, path.dirname(outputPath)).then((inventoryPath) => `Complete Doctor lint inventory: ${inventoryPath}`, (error) => `Complete Doctor lint inventory unavailable: ${formatErrorMessage(error)}`);
	const sanitized = sanitizeTriageUpdateFailure(inventory, {
		env,
		stateDir
	}, "artifact", detail);
	const body = `${JSON.stringify(sanitized)}\n`;
	await writeTextAtomic(outputPath, body, {
		mode: 384,
		dirMode: 448
	});
	return outputPath;
}
/** Terminal exports never write into state retained by an unresolved recovery owner. */
async function writeUpdateRunReportArtifact(params) {
	const env = params.env ?? process.env;
	const stateDir = resolveStateDir(env);
	const id = !params.detached && uuid().safeParse(params.result.runId).data || randomUUID();
	const directory = params.detached ? await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-update-report-")) : path.join(stateDir, "update-reports");
	const outputPath = path.join(directory, `${id}.md`);
	const write = async () => {
		const run = params.readRun?.();
		const report = typeof params.report === "function" ? params.report(run) : params.report;
		if (params.readRun && !run) {
			const previous = await readSavedUpdateReport(outputPath);
			if (previous && !isUpdateRunReportInProgress(previous)) return outputPath;
		}
		const failurePath = classifyUpdateOutcome(params.result) === "failed" ? await writeTriageUpdateFailure({ result: params.result }, {
			env,
			outputPath: params.detached ? path.join(directory, updateDiagnosticArtifactName("failure", id)) : void 0
		}) : void 0;
		const findings = params.result.steps.flatMap((step) => step.doctorLintFindings ?? []);
		const native = nativeFailureDiagnostics(run?.steps ?? params.result.steps.flatMap(updateRunStepsFromResultStep));
		const body = [
			report.markdown,
			`${DOCTOR_LINT_REPORT_SECTION}${findings.length})\n`,
			...findings.map((finding) => `- ${formatUpdateDoctorLintFinding(finding, env)}`),
			...native ? [native] : [],
			failurePath ? `\nBounded diagnostic JSON: ${path.relative(directory, failurePath)}` : ""
		].join("\n");
		await writeTextAtomic(outputPath, redactSupportString(body, {
			env,
			stateDir
		}, { maxLength: Number.MAX_SAFE_INTEGER }), {
			mode: 384,
			dirMode: 448
		});
		return outputPath;
	};
	if (params.detached) return write();
	await withUpdateReportWrite(outputPath, write);
	const settled = params.readRun?.();
	if (settled) await refreshUpdateRunReportArtifact(settled, { env });
	return outputPath;
}
function bindSavedReportArtifact(prepared, reservationId, previewDigest = prepared.previewDigest) {
	const parsed = path.parse(prepared.savedReportPath);
	const artifactKey = sha256Hex(`${reservationId}\0${previewDigest}`);
	return {
		...prepared,
		savedReportPath: path.join(parsed.dir, `${parsed.name}.${artifactKey}${parsed.ext}`)
	};
}
function hasErrorCode(error, ...codes) {
	return error instanceof Error && "code" in error && typeof error.code === "string" && codes.includes(error.code);
}
function stagedReportPath(prepared) {
	return `${prepared.savedReportPath}.pending`;
}
function isAttemptArtifactName(base, entry) {
	if (!entry.startsWith(`${base.name}.`)) return false;
	const withoutStageSuffix = entry.endsWith(".pending") ? entry.slice(0, -8) : entry;
	if (!withoutStageSuffix.endsWith(base.ext)) return false;
	const artifactKey = withoutStageSuffix.slice(base.name.length + 1, withoutStageSuffix.length - base.ext.length);
	return /^[a-f0-9]{64}$/u.test(artifactKey);
}
async function discardSavedUpdateFailureReport(prepared) {
	await fs.rm(stagedReportPath(prepared), { force: true });
	await fs.rm(prepared.savedReportPath, { force: true });
	await fs.rmdir(path.dirname(prepared.savedReportPath)).catch((error) => {
		if (!hasErrorCode(error, "ENOENT", "ENOTEMPTY")) throw error;
	});
}
async function discardSavedUpdateFailureReportBestEffort(prepared) {
	await discardSavedUpdateFailureReport(prepared).catch(() => {});
}
/** Captures the immutable retired-artifact set for one fenced sweep generation. */
async function listRetiredUpdateFailureReportArtifacts(prepared, keep) {
	const base = path.parse(prepared.savedReportPath);
	const keepPaths = new Set(keep ? [keep.savedReportPath, stagedReportPath(keep)] : []);
	return (await fs.readdir(base.dir).catch((error) => {
		if (hasErrorCode(error, "ENOENT")) return [];
		throw error;
	})).filter((entry) => isAttemptArtifactName(base, entry)).map((entry) => path.join(base.dir, entry)).filter((artifactPath) => !keepPaths.has(artifactPath));
}
/** Deletes only a previously captured set; this function never performs a fresh scan. */
async function removeRetiredUpdateFailureReportArtifacts(artifactPaths) {
	for (const artifactPath of artifactPaths) await fs.rm(artifactPath, { force: true }).catch(() => {});
}
/** Writes reviewed content to a non-public staging name under live client authority. */
async function savePreparedUpdateFailureReport(prepared, hasCurrentAuthority) {
	const ensureCurrentAuthority = () => {
		if (hasCurrentAuthority && !hasCurrentAuthority()) throw new Error("Update report persistence requires a current authenticated client.");
	};
	const reportDir = path.dirname(prepared.savedReportPath);
	ensureCurrentAuthority();
	await fs.mkdir(reportDir, {
		mode: 448,
		recursive: true
	});
	ensureCurrentAuthority();
	let stagedReportCreated = false;
	try {
		await fs.writeFile(stagedReportPath(prepared), prepared.body, {
			encoding: "utf8",
			flag: "wx",
			mode: 384
		});
		stagedReportCreated = true;
	} catch (error) {
		if (!hasErrorCode(error, "EEXIST")) throw error;
		const existing = await readSavedUpdateReport(stagedReportPath(prepared));
		if (existing !== void 0 && existing !== prepared.body) throw new Error("The saved update report does not match the reviewed preview.", { cause: error });
	}
	ensureCurrentAuthority();
	if (stagedReportCreated) await fs.chmod(stagedReportPath(prepared), 384);
	ensureCurrentAuthority();
}
/** Publishes staged content only after the caller acquired the durable receipt phase. */
async function publishPreparedUpdateFailureReport(prepared) {
	await fs.rename(stagedReportPath(prepared), prepared.savedReportPath);
	await fs.chmod(prepared.savedReportPath, 384);
}
//#endregion
export { publishPreparedUpdateFailureReport as a, savePreparedUpdateFailureReport as c, listRetiredUpdateFailureReportArtifacts as i, writeTriageUpdateFailure as l, discardSavedUpdateFailureReport as n, refreshUpdateRunReportArtifact as o, discardSavedUpdateFailureReportBestEffort as r, removeRetiredUpdateFailureReportArtifacts as s, bindSavedReportArtifact as t, writeUpdateRunReportArtifact as u };
