import { n as formatConfigIssueLines } from "./issue-format-Cu1pIc3h.mjs";
import { a as isConfigReadFailure } from "./io.invalid-config-CsqYoW4w.mjs";
import { t as normalizeSupportDiagnosticErrorCode } from "./diagnostic-support-redaction-BP5XqJ7g.mjs";
import { b as UpdatePreMutationError } from "./update-global-BlXQRfes.mjs";
import "./shared-DRiGAorf.mjs";
import { t as findRetiredConfigUpgradeRequirement } from "./retired-config-formats-IQqBZGMl.mjs";
//#region src/cli/update-cli/update-command-config-failure.ts
/** Keep validation fields separate from diagnostics that can contain rejected secret values. */
function createUpdateConfigFailure(snapshot) {
	if (isConfigReadFailure(snapshot)) {
		const code = normalizeSupportDiagnosticErrorCode(snapshot.readError?.code ?? void 0);
		const nextAction = snapshot.readError ? "Check configuration file access before retrying." : "Run `openclaw doctor --json` to inspect the configuration loading failure before retrying.";
		return new UpdatePreMutationError("config-read-failed", `Update refused: configuration could not be read${code ? ` (${code})` : ""}. ${nextAction}`, {
			nextAction,
			failureFacts: [{
				check: "config",
				code: code ?? "config-read-failed",
				message: "Configuration could not be read."
			}]
		});
	}
	const issues = snapshot.issues.map(({ path, pathSegments }) => ({
		path,
		pathSegments,
		message: "Invalid configuration field"
	}));
	const retired = findRetiredConfigUpgradeRequirement(snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig);
	const includeOwnedLegacyRoster = snapshot.agentRosterIncludeOwned === true && snapshot.legacyIssues.some((issue) => issue.path === "agents.list" || issue.path === "agents.entries");
	const nextAction = retired?.nextAction ?? (includeOwnedLegacyRoster ? "Doctor cannot safely rewrite this include-owned legacy roster. Back up the root config, included files, and persisted state, then temporarily consolidate the original legacy config into one openclaw.json. Preserve roster order, legacy markers, environment and secret references, and configured path meanings. Run `openclaw doctor --fix` or retry the update; after repair and `openclaw config validate` succeed, split the repaired config back into includes and validate again. See https://docs.openclaw.ai/gateway/doctor/config-migrations#agent-roster-migration." : "Run `openclaw doctor --fix` to repair retired or unrecognized configuration fields, then correct any remaining errors before retrying.");
	return new UpdatePreMutationError("invalid-config", [
		retired ? "Update refused: configuration contains retired fields that current Doctor cannot migrate." : `Update refused: configuration is invalid at ${snapshot.path}.`,
		...formatConfigIssueLines(issues, "-", { normalizeRoot: true }),
		nextAction
	].join("\n"), {
		nextAction,
		failureFacts: issues.length ? issues.map((issue) => ({
			check: "invalid-config",
			code: "invalid-config",
			affectedKey: issue.path || "<root>",
			message: issue.message
		})) : [{
			check: "invalid-config",
			code: "invalid-config",
			message: "Invalid configuration field"
		}]
	});
}
//#endregion
export { createUpdateConfigFailure as t };
