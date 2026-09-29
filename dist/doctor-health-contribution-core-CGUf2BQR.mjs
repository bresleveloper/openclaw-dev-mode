import { r as isHealthCheckEnabledByDefault } from "./health-checks-B3n_-tw2.mjs";
import { t as copyHealthCheck } from "./health-check-adapter-BrC920MN.mjs";
import { r as resolveDoctorWorkspaceDir } from "./doctor-health-contribution-utils-BmAjb2e7.mjs";
import { n as recordDoctorHealthWarnings, r as renderStructuredHealthFindings } from "./doctor-health-contribution-ByX5IM87.mjs";
//#region src/flows/doctor-health-contribution-core.ts
const loadHealthCheckRegistryModule = async () => await import("./health-check-registry-CwI37HiV.mjs");
function reportDoctorRepairResult(ctx, result, findings, note) {
	ctx.cfg = result.config;
	renderStructuredHealthFindings(ctx, findings);
	recordDoctorHealthWarnings(ctx, findings, result.warnings);
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
function withDoctorHealthCheckFacts(ctx, input) {
	return {
		...input,
		agentDatabaseRefusals: ctx.agentDatabaseRefusals,
		...ctx.runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot: ctx.runWithPluginMetadataSnapshot } : {}
	};
}
async function runStructuredHealthRepairs(ctx, resolveCoreChecks) {
	if (!ctx.prompter.shouldRepair) return;
	const { registerBundledHealthChecks } = await import("./bundled-health-checks-BSn_DqAD.mjs");
	const { listExtensionHealthChecksForDoctor } = await loadHealthCheckRegistryModule();
	const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-B4Ed0Qh7.mjs");
	const { note } = await import("./terminal-core/note.js");
	const workspaceDir = resolveDoctorWorkspaceDir(ctx.cfg, ctx.env);
	const availabilityFindings = registerBundledHealthChecks({
		cfg: ctx.cfg,
		cwd: workspaceDir,
		env: ctx.env
	});
	const checks = listExtensionHealthChecksForDoctor(await resolveCoreChecks(), availabilityFindings).filter(isHealthCheckEnabledByDefault).map(copyHealthCheck);
	const result = await runDoctorHealthRepairs(withDoctorHealthCheckFacts(ctx, {
		mode: "fix",
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		env: ctx.env,
		cwd: workspaceDir,
		configPath: ctx.configPath
	}), { checks });
	reportDoctorRepairResult(ctx, result, [...availabilityFindings, ...result.remainingFindings], note);
}
async function runCoreContributionHealth(ctx, checkIds) {
	if (checkIds.length === 0) return;
	const { CORE_HEALTH_CHECKS } = await import("./doctor-core-checks-qVEm1JDw.mjs");
	const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-B4Ed0Qh7.mjs");
	const { note } = await import("./terminal-core/note.js");
	const selectedIds = new Set(checkIds);
	const checks = CORE_HEALTH_CHECKS.filter((check) => selectedIds.has(check.id));
	if (checks.length === 0) return;
	const workspaceDir = resolveDoctorWorkspaceDir(ctx.cfg, ctx.env);
	const dryRun = !ctx.prompter.shouldRepair;
	const result = await runDoctorHealthRepairs(withDoctorHealthCheckFacts(ctx, {
		mode: "fix",
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		cwd: workspaceDir,
		configPath: ctx.configPath,
		dryRun
	}), {
		checks,
		dryRun
	});
	reportDoctorRepairResult(ctx, result, dryRun ? result.findings : result.remainingFindings, note);
}
function formatHealthFindings(findings) {
	return findings.map((finding) => {
		const lines = [`- ${finding.message}`];
		if (finding.path) lines.push(`  path: ${finding.path}`);
		if (finding.requirement) lines.push(`  issue: ${finding.requirement}`);
		if (finding.fixHint) lines.push(`  fix: ${finding.fixHint}`);
		return lines.join("\n");
	}).join("\n");
}
async function runCoreHealthFindingNote(ctx, checkId) {
	const { CORE_HEALTH_CHECKS } = await import("./doctor-core-checks-qVEm1JDw.mjs");
	const { note } = await import("./terminal-core/note.js");
	const check = CORE_HEALTH_CHECKS.find((candidate) => candidate.id === checkId);
	if (!check) return;
	const findings = await check.detect(withDoctorHealthCheckFacts(ctx, {
		mode: "doctor",
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		cwd: resolveDoctorWorkspaceDir(ctx.cfg, ctx.env),
		configPath: ctx.configPath,
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
