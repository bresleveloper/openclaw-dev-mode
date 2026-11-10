import { h as normalizeUpdatePostInstallDoctorWarnings } from "./update-doctor-result-oZ38327j.mjs";
import { i as resolveDoctorWorkspaceDir } from "./doctor-health-contribution-utils-kJXoi_AZ.mjs";
//#region src/flows/doctor-health-contribution.ts
function legacyOwnedRepair(collectEffects, reason) {
	return async (ctx) => {
		const effects = await collectEffects(ctx);
		return ctx.dryRun === true ? {
			status: "repaired",
			changes: [],
			effects
		} : {
			status: "skipped",
			reason,
			changes: [],
			effects
		};
	};
}
function createDoctorHealthContribution(id, label, options) {
	const params = typeof options === "function" ? { run: options } : options;
	const healthChecks = normalizeHealthChecks(id, params.healthChecks);
	const healthCheckIds = params.healthCheckIds ?? healthChecks.map((check) => check.id);
	if (params.run === void 0 && healthChecks.length === 0) throw new Error(`doctor contribution ${id} must define run or healthChecks`);
	return {
		id,
		label,
		healthChecks,
		healthCheckIds,
		...params.required ? { required: true } : {},
		...params.updateWork ? { updateWork: params.updateWork } : {},
		run: params.run ?? ((ctx) => runStructuredDoctorHealthContribution({
			ctx,
			checks: healthChecks
		}))
	};
}
function normalizeHealthChecks(contributionId, healthChecks) {
	if (healthChecks === void 0) return [];
	const checks = Array.isArray(healthChecks) ? healthChecks : [healthChecks];
	const defaultId = contributionId.startsWith("doctor:") ? `core/doctor/${contributionId.slice(7)}` : `core/doctor/${contributionId}`;
	return checks.map((check) => {
		const id = check.id ?? (checks.length === 1 ? defaultId : void 0);
		if (id === void 0) throw new Error(`doctor contribution ${contributionId} must specify health check ids when it declares multiple healthChecks`);
		return Object.assign({}, check, {
			id,
			kind: "core",
			source: "doctor"
		});
	});
}
async function runStructuredDoctorHealthContribution(params) {
	const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-Fhh7h-UL.mjs");
	const workspaceDir = resolveDoctorWorkspaceDir(params.ctx.cfg, params.ctx.env);
	const dryRun = !params.ctx.prompter.shouldRepair;
	const configBeforeRepair = JSON.stringify(params.ctx.cfg);
	const result = await runDoctorHealthRepairs({
		mode: "fix",
		runtime: params.ctx.runtime,
		cfg: params.ctx.cfg,
		env: params.ctx.env,
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
export { renderStructuredHealthFindings as i, legacyOwnedRepair as n, recordDoctorHealthWarnings as r, createDoctorHealthContribution as t };
