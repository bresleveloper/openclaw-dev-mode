import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import { r as listHealthChecks } from "./health-check-registry-Lw8LGAUO.mjs";
import { n as normalizeHealthCheck, t as copyHealthChecks } from "./health-check-adapter-Qbgk_amB.mjs";
//#region src/flows/doctor-repair-flow.ts
async function runDoctorHealthRepairs(ctx, opts = {}) {
	const checks = (opts.checks ?? copyHealthChecks(listHealthChecks())).map(normalizeHealthCheck);
	const outcome = {
		config: ctx.cfg,
		findings: [],
		remainingFindings: [],
		changes: [],
		warnings: [],
		diffs: [],
		effects: [],
		checksRun: checks.length,
		checksRepaired: 0,
		checksValidated: 0
	};
	for (const check of checks) {
		const checkContext = {
			...ctx,
			cfg: outcome.config
		};
		let checkFindings;
		try {
			checkFindings = await check.detect(checkContext);
		} catch (err) {
			outcome.warnings.push(`${check.id} detect failed: ${scrubDoctorErrorMessage(err)}`);
			continue;
		}
		outcome.findings.push(...checkFindings);
		if (checkFindings.length === 0 || check.repair === void 0) {
			outcome.remainingFindings.push(...checkFindings);
			continue;
		}
		let remainingFindings = [...checkFindings];
		try {
			const result = await check.repair({
				...checkContext,
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
				continue;
			}
			if (result.config !== void 0 && opts.dryRun !== true) outcome.config = result.config;
			outcome.checksRepaired++;
			if (opts.dryRun === true) continue;
			try {
				const validationFindings = await check.detect({
					...checkContext,
					cfg: outcome.config
				}, {
					findings: remainingFindings,
					paths: uniqueDefined(remainingFindings.map((finding) => finding.path)),
					ocPaths: uniqueDefined(remainingFindings.map((finding) => finding.ocPath))
				});
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
	return outcome;
}
function uniqueDefined(values) {
	return uniqueStrings(values.filter((value) => value !== void 0));
}
//#endregion
export { runDoctorHealthRepairs };
