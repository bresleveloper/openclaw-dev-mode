import { lr as uuid } from "./schemas-BOYIvvln.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { v as writeTextAtomic } from "./json-files-C0HSMh2Z.mjs";
import { o as redactSupportString } from "./diagnostic-support-redaction-YQMFPlL7.mjs";
import { s as classifyUpdateOutcome } from "./update-outcome-ZpL2Kt9B.mjs";
import { r as formatUpdateDoctorLintFinding } from "./update-doctor-lint-BRvmoWQ9.mjs";
import { r as sanitizeTriageUpdateFailure } from "./triage-update-CLRFArEQ.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { createHash, randomUUID } from "node:crypto";
//#region src/infra/update-failure-report-artifact.ts
/** Filesystem lifecycle for a non-authoritative, sanitized update report body. */
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
	if ("result" in inventory && inventory.result.steps.some((step) => step.doctorLintFindings)) {
		const detail = await writeUpdateFailureLintArtifact(inventory, path.dirname(outputPath)).then((inventoryPath) => `Complete Doctor lint inventory: ${inventoryPath}`, (error) => `Complete Doctor lint inventory unavailable: ${formatErrorMessage(error)}`);
		inventory.error = `${inventory.error ?? inventory.result.reason ?? "Update failed"}. ${detail}`;
	}
	const sanitized = sanitizeTriageUpdateFailure(inventory, {
		env,
		stateDir
	}, "artifact");
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
	const failurePath = classifyUpdateOutcome(params.result) === "failed" ? await writeTriageUpdateFailure({ result: params.result }, {
		env,
		outputPath: params.detached ? path.join(directory, updateDiagnosticArtifactName("failure", id)) : void 0
	}) : void 0;
	const findings = params.result.steps.flatMap((step) => step.doctorLintFindings ?? []);
	const body = [
		params.report.markdown,
		`\n## Complete Doctor lint findings (${findings.length})\n`,
		...findings.map((finding) => `- ${formatUpdateDoctorLintFinding(finding, env)}`),
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
}
function bindSavedReportArtifact(prepared, reservationId, previewDigest = prepared.previewDigest) {
	const parsed = path.parse(prepared.savedReportPath);
	const artifactKey = createHash("sha256").update(`${reservationId}\0${previewDigest}`).digest("hex");
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
async function pathExists(filePath) {
	try {
		await fs.stat(filePath);
		return true;
	} catch (error) {
		if (hasErrorCode(error, "ENOENT")) return false;
		throw error;
	}
}
async function discardSavedUpdateFailureReport(prepared, saved, removeExistingReport = false) {
	if (saved.stagedReportCreated || removeExistingReport) await fs.rm(stagedReportPath(prepared), { force: true });
	if (saved.reportCreated || removeExistingReport) await fs.rm(prepared.savedReportPath, { force: true });
	if (saved.reportDirCreated || removeExistingReport) await fs.rmdir(path.dirname(prepared.savedReportPath)).catch((error) => {
		if (!hasErrorCode(error, "ENOENT", "ENOTEMPTY")) throw error;
	});
}
async function discardSavedUpdateFailureReportBestEffort(prepared, saved, removeExistingReport = false) {
	await discardSavedUpdateFailureReport(prepared, saved, removeExistingReport).catch(() => {});
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
async function savePreparedUpdateFailureReport(prepared, saved, hasCurrentAuthority) {
	const ensureCurrentAuthority = () => {
		if (hasCurrentAuthority && !hasCurrentAuthority()) throw new Error("Update report persistence requires a current authenticated client.");
	};
	const reportDir = path.dirname(prepared.savedReportPath);
	ensureCurrentAuthority();
	const reportDirExisted = await pathExists(reportDir);
	ensureCurrentAuthority();
	await fs.mkdir(reportDir, {
		mode: 448,
		recursive: true
	});
	saved.reportDirCreated = !reportDirExisted;
	ensureCurrentAuthority();
	try {
		await fs.writeFile(stagedReportPath(prepared), prepared.body, {
			encoding: "utf8",
			flag: "wx",
			mode: 384
		});
		saved.stagedReportCreated = true;
	} catch (error) {
		if (!hasErrorCode(error, "EEXIST")) throw error;
		const existing = await fs.readFile(stagedReportPath(prepared), "utf8").catch((readError) => {
			if (hasErrorCode(readError, "ENOENT")) return;
			throw readError;
		});
		if (existing !== void 0 && existing !== prepared.body) throw new Error("The saved update report does not match the reviewed preview.", { cause: error });
	}
	ensureCurrentAuthority();
	if (saved.stagedReportCreated) await fs.chmod(stagedReportPath(prepared), 384);
	ensureCurrentAuthority();
}
/** Publishes staged content only after the caller acquired the durable receipt phase. */
async function publishPreparedUpdateFailureReport(prepared, saved) {
	await fs.rename(stagedReportPath(prepared), prepared.savedReportPath);
	saved.stagedReportCreated = false;
	saved.reportCreated = true;
	await fs.chmod(prepared.savedReportPath, 384);
}
//#endregion
export { publishPreparedUpdateFailureReport as a, writeTriageUpdateFailure as c, listRetiredUpdateFailureReportArtifacts as i, writeUpdateRunReportArtifact as l, discardSavedUpdateFailureReport as n, removeRetiredUpdateFailureReportArtifacts as o, discardSavedUpdateFailureReportBestEffort as r, savePreparedUpdateFailureReport as s, bindSavedReportArtifact as t };
