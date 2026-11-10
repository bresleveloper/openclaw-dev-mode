import { i as resolveDoctorWorkspaceDir, n as noteDoctorRepairResult } from "./doctor-health-contribution-utils-kJXoi_AZ.mjs";
import { i as renderStructuredHealthFindings, r as recordDoctorHealthWarnings } from "./doctor-health-contribution-CswduPyS.mjs";
import { r as isHealthCheckEnabledByDefault } from "./health-checks-_h8bcnIK.mjs";
import { t as copyHealthChecks } from "./health-check-adapter-Qbgk_amB.mjs";
//#region src/flows/doctor-health-contribution-core.ts
function reportDoctorRepairResult(ctx, result, findings, note) {
	ctx.cfg = result.config;
	renderStructuredHealthFindings(ctx, findings);
	recordDoctorHealthWarnings(ctx, findings, result.warnings);
	noteDoctorRepairResult(result, note);
}
function createDoctorHealthCheckContext(ctx, input) {
	return {
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		configPath: ctx.configPath,
		...input,
		agentDatabaseRefusals: ctx.agentDatabaseRefusals,
		...ctx.runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot: ctx.runWithPluginMetadataSnapshot } : {}
	};
}
async function runStructuredHealthRepairs(ctx, resolveCoreChecks) {
	if (!ctx.prompter.shouldRepair) return;
	const { registerBundledHealthChecks } = await import("./bundled-health-checks-Nex_6rpM.mjs");
	const { listExtensionHealthChecksForDoctor } = await import("./health-check-registry-DVuJVzCQ.mjs");
	const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-Fhh7h-UL.mjs");
	const { note } = await import("./terminal-core/note.js");
	const workspaceDir = resolveDoctorWorkspaceDir(ctx.cfg, ctx.env);
	const availabilityFindings = registerBundledHealthChecks({
		cfg: ctx.cfg,
		cwd: workspaceDir,
		env: ctx.env
	});
	const checks = copyHealthChecks(listExtensionHealthChecksForDoctor(await resolveCoreChecks(), availabilityFindings).filter(isHealthCheckEnabledByDefault));
	const result = await runDoctorHealthRepairs(createDoctorHealthCheckContext(ctx, {
		mode: "fix",
		env: ctx.env,
		cwd: workspaceDir
	}), { checks });
	reportDoctorRepairResult(ctx, result, [...availabilityFindings, ...result.remainingFindings], note);
}
async function runCoreContributionHealth(ctx, checkIds) {
	if (checkIds.length === 0) return;
	const { CORE_HEALTH_CHECKS } = await import("./doctor-core-checks-B5a7njx2.mjs");
	const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-Fhh7h-UL.mjs");
	const { note } = await import("./terminal-core/note.js");
	const selectedIds = new Set(checkIds);
	const checks = CORE_HEALTH_CHECKS.filter((check) => selectedIds.has(check.id));
	if (checks.length === 0) return;
	const workspaceDir = resolveDoctorWorkspaceDir(ctx.cfg, ctx.env);
	const dryRun = !ctx.prompter.shouldRepair;
	const result = await runDoctorHealthRepairs(createDoctorHealthCheckContext(ctx, {
		mode: "fix",
		cwd: workspaceDir,
		dryRun
	}), {
		checks,
		dryRun
	});
	reportDoctorRepairResult(ctx, result, dryRun ? result.findings : result.remainingFindings, note);
}
function formatHealthFindings(findings) {
	return findings.map((finding) => [
		`- ${finding.message}`,
		finding.path && `  path: ${finding.path}`,
		finding.requirement && `  issue: ${finding.requirement}`,
		finding.fixHint && `  fix: ${finding.fixHint}`
	].filter(Boolean).join("\n")).join("\n");
}
async function runCoreHealthFindingNote(ctx, checkId) {
	const { CORE_HEALTH_CHECKS } = await import("./doctor-core-checks-B5a7njx2.mjs");
	const { note } = await import("./terminal-core/note.js");
	const check = CORE_HEALTH_CHECKS.find((candidate) => candidate.id === checkId);
	if (!check) return;
	const findings = await check.detect(createDoctorHealthCheckContext(ctx, {
		mode: "doctor",
		cwd: resolveDoctorWorkspaceDir(ctx.cfg, ctx.env),
		allowExecSecretRefs: ctx.options.allowExec === true
	}));
	if (findings.length === 0) return;
	recordDoctorHealthWarnings(ctx, findings);
	const information = findings.filter((finding) => finding.severity === "info");
	const warnings = findings.filter((finding) => finding.severity !== "info");
	if (information.length > 0) note(formatHealthFindings(information), "Doctor information");
	if (warnings.length > 0) {
		ctx.healthOk = false;
		note(formatHealthFindings(warnings), "Doctor warnings");
	}
}
//#endregion
export { runCoreHealthFindingNote as n, runStructuredHealthRepairs as r, runCoreContributionHealth as t };
