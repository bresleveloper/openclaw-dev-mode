import { d as normalizeUpdatePostInstallDoctorWarnings } from "./update-doctor-result-CoUVRLb-.mjs";
import { r as resolveDoctorWorkspaceDir } from "./doctor-health-contribution-utils-BmAjb2e7.mjs";
//#region src/flows/doctor-health-contribution.ts
function createDoctorHealthContribution(params) {
	const healthChecks = normalizeHealthChecks(params.id, params.healthChecks);
	const healthCheckIds = params.healthCheckIds ?? healthChecks.map((check) => check.id);
	if (params.run === void 0 && healthChecks.length === 0) throw new Error(`doctor contribution ${params.id} must define run or healthChecks`);
	return {
		id: params.id,
		kind: "core",
		surface: "health",
		option: {
			value: params.id,
			label: params.label,
			...params.hint ? { hint: params.hint } : {}
		},
		source: "doctor",
		healthChecks,
		healthCheckIds,
		...params.required ? { required: true } : {},
		...params.updateWork ? { updateWork: params.updateWork } : {},
		run: params.run ?? ((ctx) => runStructuredDoctorHealthContribution({
			contributionId: params.id,
			ctx,
			checks: healthChecks
		}))
	};
}
function normalizeHealthChecks(contributionId, healthChecks) {
	if (healthChecks === void 0) return [];
	const checks = Array.isArray(healthChecks) ? healthChecks : [healthChecks];
	return checks.map((check) => normalizeContributionHealthCheck(check, contributionId, checks.length));
}
function normalizeContributionHealthCheck(check, contributionId, count) {
	const id = check.id ?? (count === 1 ? deriveCoreHealthCheckId(contributionId) : void 0);
	if (id === void 0) throw new Error(`doctor contribution ${contributionId} must specify health check ids when it declares multiple healthChecks`);
	const identity = {
		id,
		kind: check.kind ?? "core",
		source: check.source ?? "doctor"
	};
	return {
		...check,
		...identity
	};
}
function deriveCoreHealthCheckId(contributionId) {
	return contributionId.startsWith("doctor:") ? `core/doctor/${contributionId.slice(7)}` : `core/doctor/${contributionId}`;
}
async function runStructuredDoctorHealthContribution(params) {
	if (params.checks.length === 0) throw new Error(`doctor contribution ${params.contributionId} has no structured health`);
	const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-B4Ed0Qh7.mjs");
	const workspaceDir = resolveDoctorWorkspaceDir(params.ctx.cfg, params.ctx.env);
	const dryRun = !params.ctx.prompter.shouldRepair;
	const configBeforeRepair = JSON.stringify(params.ctx.cfg);
	const result = await runDoctorHealthRepairs({
		mode: "fix",
		runtime: params.ctx.runtime,
		cfg: params.ctx.cfg,
		cwd: workspaceDir,
		configPath: params.ctx.configPath,
		dryRun,
		allowExecSecretRefs: params.ctx.options.allowExec === true,
		agentDatabaseRefusals: params.ctx.agentDatabaseRefusals
	}, {
		checks: params.checks,
		dryRun
	});
	params.ctx.cfg = result.config;
	renderStructuredHealthFindings(params.ctx, result.findings);
	recordDoctorHealthWarnings(params.ctx, dryRun ? result.findings : result.remainingFindings, result.warnings);
	for (const warning of result.warnings) params.ctx.runtime.error(warning);
	if (configBeforeRepair !== JSON.stringify(result.config)) params.ctx.configResult.pendingChangePanels = [...params.ctx.configResult.pendingChangePanels ?? [], ...result.changes];
	else for (const change of result.changes) params.ctx.runtime.log(change);
}
function recordDoctorHealthWarnings(ctx, findings, warnings = [], options) {
	const existing = ctx.updateWarnings ?? [];
	const added = [...findings.filter((finding) => finding.severity === "warning").map((finding) => `${finding.checkId}${finding.errorCode ? ` [${finding.errorCode}]` : ""}: ${finding.message}`), ...warnings];
	ctx.updateWarnings = normalizeUpdatePostInstallDoctorWarnings(options?.prepend ? [...added, ...existing] : [...existing, ...added]);
}
function renderStructuredHealthFindings(ctx, findings) {
	for (const finding of findings) {
		const write = finding.severity === "error" ? ctx.runtime.error : ctx.runtime.log;
		const where = finding.path !== void 0 ? ` ${finding.path}` : "";
		const line = finding.line !== void 0 ? `:${finding.line}` : "";
		write(`[${finding.severity}] ${finding.checkId}${where}${line} - ${finding.message}`);
		if (finding.fixHint !== void 0) ctx.runtime.log(`  fix: ${finding.fixHint}`);
	}
}
//#endregion
export { recordDoctorHealthWarnings as n, renderStructuredHealthFindings as r, createDoctorHealthContribution as t };
