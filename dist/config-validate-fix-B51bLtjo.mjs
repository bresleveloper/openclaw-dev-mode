import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { i as normalizeConfigIssues, n as formatConfigIssueLines } from "./issue-format-L1jxHK43.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as formatCliJsonFailure } from "./failure-output-gtb9zaTk.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-Bd4757D_.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { c as warn, n as info, s as success, t as danger } from "./globals-BXbZ1A_g.mjs";
//#region src/cli/config-validate-fix.ts
/**
* Run doctor's config-only repairs and print the outcome. Returns the fields to merge into the
* validation JSON, or null once a dry-run preview has ended the command; exits 1 when the
* repairs cannot be applied.
*/
async function runConfigValidateFix(params) {
	const { runtime, json } = params;
	const { fixConfigContent } = await import("./config-content-fix-BnuaNteF.mjs");
	const report = await fixConfigContent({
		dryRun: params.dryRun,
		skipOutputLogs: json
	});
	const shortPath = shortenHomePath(report.path);
	const detailLines = [...report.changes.map((change) => `  - ${change}`), ...report.warnings.map((warning) => `  ${warn("!")} ${warning}`)];
	switch (report.status) {
		case "would-fix":
			if (json) {
				writeRuntimeJson(runtime, {
					valid: true,
					path: report.path,
					fix: report
				}, 0);
				return null;
			}
			runtime.log(info(`Dry run: ${report.changes.length} change(s) would fix ${shortPath}:`));
			for (const line of detailLines) runtime.log(line);
			runtime.log(`Run ${formatCliCommand("openclaw config validate --fix")} to apply them.`);
			return null;
		case "still-invalid": {
			const issues = normalizeConfigIssues(report.issues);
			if (json) {
				writeRuntimeJson(runtime, {
					...formatCliJsonFailure(`Config fix would leave ${shortPath} invalid`),
					valid: false,
					path: report.path,
					issues,
					fix: report
				});
				return exitCliAfterOutput(runtime, 1);
			}
			runtime.error(danger(`Not fixed: ${shortPath} would still be invalid; nothing was written.`));
			runtime.error("Doctor repairs that would apply:");
			for (const line of detailLines) runtime.error(line);
			runtime.error("Problems they do not fix:");
			for (const line of formatConfigIssueLines(issues, danger("×"), { normalizeRoot: true })) runtime.error(`  ${line}`);
			runtime.error(`Fix those keys by hand, then re-run ${formatCliCommand("openclaw config validate --fix")}.`);
			return exitCliAfterOutput(runtime, 1);
		}
		case "write-failed":
			if (json) writeRuntimeJson(runtime, {
				...formatCliJsonFailure(`Config fix failed: ${report.error}`),
				valid: false,
				path: report.path,
				fix: report
			});
			else runtime.error(danger(`Config fix failed: ${report.error}`));
			return exitCliAfterOutput(runtime, 1);
		case "fixed":
			if (!json) {
				runtime.log(success(`Fixed ${shortPath}: ${report.changes.length} change(s); previous version saved as ${shortPath}.bak`));
				for (const line of detailLines) runtime.log(line);
			}
			break;
		case "unchanged":
			if (!json) runtime.log(theme.muted(`Nothing for doctor's config repairs to fix in ${shortPath}.`));
			break;
		case "skipped": if (!json) runtime.log(warn(`Config fix skipped: ${report.reason}.`));
	}
	return { fix: report };
}
//#endregion
export { runConfigValidateFix };
