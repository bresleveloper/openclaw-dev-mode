// FIX-07 (dev-mode fork): output for `openclaw config validate --fix [--dry-run]`.
// Repairs: src/commands/doctor/config-content-fix.ts (doctor's config-only stages).
// Hook: one guarded call at the top of runConfigValidate in src/cli/config-cli.ts.
//
// Regression checklist after an upstream upgrade:
// - config-cli.ts still registers --fix/--dry-run on `config validate`, calls
//   runConfigValidateFix first, returns when it returns null, and spreads `...fixJson` into
//   the valid and invalid JSON payloads.
// - Run src/cli/config-validate-fix.test.ts.
import { theme } from "../../packages/terminal-core/src/theme.js";
import type { ConfigContentFixReport } from "../commands/doctor/config-content-fix.js";
import { formatConfigIssueLines, normalizeConfigIssues } from "../config/issue-format.js";
import { danger, info, success, warn } from "../globals.js";
import { type RuntimeEnv, writeRuntimeJson } from "../runtime.js";
import { shortenHomePath } from "../utils.js";
import { formatCliCommand } from "./command-format.js";
import { formatCliJsonFailure } from "./failure-output.js";
import { exitCliAfterOutput } from "./one-shot-exit.js";

export type ConfigValidateFixJson = { fix: ConfigContentFixReport };

/**
 * Run doctor's config-only repairs and print the outcome. Returns the fields to merge into the
 * validation JSON, or null once a dry-run preview has ended the command; exits 1 when the
 * repairs cannot be applied.
 */
export async function runConfigValidateFix(params: {
  runtime: RuntimeEnv;
  json: boolean;
  dryRun: boolean;
}): Promise<ConfigValidateFixJson | null> {
  const { runtime, json } = params;
  const { fixConfigContent } = await import("../commands/doctor/config-content-fix.js");
  const report = await fixConfigContent({ dryRun: params.dryRun, skipOutputLogs: json });
  const shortPath = shortenHomePath(report.path);
  const detailLines = [
    ...report.changes.map((change) => `  - ${change}`),
    ...report.warnings.map((warning) => `  ${warn("!")} ${warning}`),
  ];

  switch (report.status) {
    case "would-fix":
      if (json) {
        writeRuntimeJson(runtime, { valid: true, path: report.path, fix: report }, 0);
        return null;
      }
      runtime.log(info(`Dry run: ${report.changes.length} change(s) would fix ${shortPath}:`));
      for (const line of detailLines) {
        runtime.log(line);
      }
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
          fix: report,
        });
        return exitCliAfterOutput(runtime, 1);
      }
      runtime.error(danger(`Not fixed: ${shortPath} would still be invalid; nothing was written.`));
      runtime.error("Doctor repairs that would apply:");
      for (const line of detailLines) {
        runtime.error(line);
      }
      runtime.error("Problems they do not fix:");
      for (const line of formatConfigIssueLines(issues, danger("×"), { normalizeRoot: true })) {
        runtime.error(`  ${line}`);
      }
      runtime.error(
        `Fix those keys by hand, then re-run ${formatCliCommand("openclaw config validate --fix")}.`,
      );
      return exitCliAfterOutput(runtime, 1);
    }
    case "write-failed":
      if (json) {
        writeRuntimeJson(runtime, {
          ...formatCliJsonFailure(`Config fix failed: ${report.error}`),
          valid: false,
          path: report.path,
          fix: report,
        });
      } else {
        runtime.error(danger(`Config fix failed: ${report.error}`));
      }
      return exitCliAfterOutput(runtime, 1);
    case "fixed":
      if (!json) {
        runtime.log(
          success(
            `Fixed ${shortPath}: ${report.changes.length} change(s); previous version saved as ${shortPath}.bak`,
          ),
        );
        for (const line of detailLines) {
          runtime.log(line);
        }
      }
      break;
    case "unchanged":
      if (!json) {
        runtime.log(theme.muted(`Nothing for doctor's config repairs to fix in ${shortPath}.`));
      }
      break;
    case "skipped":
      if (!json) {
        runtime.log(warn(`Config fix skipped: ${report.reason}.`));
      }
      break;
  }
  // Validation of the file on disk follows; --json carries the report in its payload.
  return { fix: report };
}
