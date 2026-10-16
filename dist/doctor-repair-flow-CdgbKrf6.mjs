import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import { r as listHealthChecks } from "./health-check-registry-CBxbsDqv.mjs";
import { n as normalizeHealthCheck, t as copyHealthChecks } from "./health-check-adapter-Qbgk_amB.mjs";
//#region src/flows/doctor-repair-flow.ts
/** Runs health checks in fix mode, applies repair outputs, and validates repaired scopes. */
async function runDoctorHealthRepairs(ctx, opts = {}) {
	const checks = (opts.checks ?? copyHealthChecks(listHealthChecks())).map(normalizeHealthCheck);
	const result = createRepairRunResult(ctx.cfg, checks.length);
	for (const check of checks) await runHealthCheck(check, {
		...ctx,
		cfg: result.config
	}, opts, result);
	return result;
}
async function runHealthCheck(check, ctx, opts, outcome) {
	let checkFindings;
	try {
		checkFindings = await check.detect(ctx);
	} catch (err) {
		outcome.warnings.push(`${check.id} detect failed: ${scrubDoctorErrorMessage(err)}`);
		return;
	}
	outcome.findings.push(...checkFindings);
	if (checkFindings.length === 0 || check.repair === void 0) {
		outcome.remainingFindings.push(...checkFindings);
		return;
	}
	let remainingFindings = [...checkFindings];
	try {
		const result = await check.repair({
			...ctx,
			dryRun: opts.dryRun === true,
			diff: opts.diff === true
		}, checkFindings);
		outcome.warnings.push(...result.warnings ?? []);
		outcome.diffs.push(...result.diffs ?? []);
		outcome.effects.push(...result.effects ?? []);
		outcome.changes.push(...result.changes);
		const status = result.status ?? "repaired";
		if (status !== "repaired") {
			outcome.warnings.push(`${check.id} repair ${status}${result.reason ? `: ${result.reason}` : ""}`);
			return;
		}
		if (result.config !== void 0 && opts.dryRun !== true) outcome.config = result.config;
		outcome.checksRepaired++;
		if (opts.dryRun === true) return;
		try {
			const validationFindings = await check.detect({
				...ctx,
				cfg: outcome.config
			}, createValidationScope(remainingFindings));
			remainingFindings = validationFindings;
			outcome.checksValidated++;
			if (validationFindings.length > 0) outcome.warnings.push(`${check.id} repair left ${validationFindings.length} finding(s)`);
		} catch (err) {
			outcome.warnings.push(`${check.id} validation failed: ${scrubDoctorErrorMessage(err)}`);
		}
	} catch (err) {
		outcome.warnings.push(`${check.id} repair failed: ${scrubDoctorErrorMessage(err)}`);
	} finally {
		outcome.remainingFindings.push(...remainingFindings);
	}
}
function createRepairRunResult(config, checksRun) {
	return {
		config,
		findings: [],
		remainingFindings: [],
		changes: [],
		warnings: [],
		diffs: [],
		effects: [],
		checksRun,
		checksRepaired: 0,
		checksValidated: 0
	};
}
function createValidationScope(findings) {
	return {
		findings,
		paths: uniqueDefined(findings.map((finding) => finding.path)),
		ocPaths: uniqueDefined(findings.map((finding) => finding.ocPath))
	};
}
function uniqueDefined(values) {
	return uniqueStrings(values.filter((value) => value !== void 0));
}
//#endregion
export { runDoctorHealthRepairs };
