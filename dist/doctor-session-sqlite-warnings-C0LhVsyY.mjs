import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { d as listSessionSqliteMigrationManifestPaths, p as readSessionSqliteMigrationManifest } from "./session-sqlite-migration-manifest-CT3ckmkL.mjs";
import { t as isSessionSqliteMigrationWarning } from "./session-sqlite-migration-issues-CAeNjCyE.mjs";
import { t as formatMigrationWarningSummary } from "./migration-warning-summary-BEnlm-gl.mjs";
//#region src/commands/doctor-session-sqlite-warnings.ts
function formatSessionSqliteMigrationWarnings(targets, env = process.env) {
	return targets.flatMap((target) => {
		let historicalCount = 0;
		const warnings = target.issues.filter(isSessionSqliteMigrationWarning).flatMap((issue) => {
			if (issue.code === "historical_transcript_deferred" && ++historicalCount > 5) return [];
			return [`${target.storePath}: [${issue.code}] ${issue.message}`];
		});
		if (historicalCount > 5) warnings.unshift(formatMigrationWarningSummary({
			summary: `${target.storePath}: Deferred ${historicalCount} historical transcript claim(s)`,
			count: historicalCount,
			detail: `Available originals and migration manifests remain protected. Inspect all findings with "${formatCliCommand("openclaw doctor --session-sqlite dry-run --session-sqlite-all-agents --json", env)}".`
		}));
		return warnings;
	});
}
/** Published updaters may predate the warning result channel; Doctor owns this durable report. */
function readSessionSqliteMigrationWarnings(env = process.env) {
	const warnings = [];
	const seen = /* @__PURE__ */ new Set();
	for (const manifestPath of listSessionSqliteMigrationManifestPaths(env)) {
		const manifest = readSessionSqliteMigrationManifest(manifestPath);
		if (!manifest?.completedAt) continue;
		for (const target of manifest.targets) {
			const key = JSON.stringify([
				target.agentId,
				target.storePath,
				target.sqlitePath
			]);
			if (seen.has(key)) continue;
			seen.add(key);
			warnings.push(...formatSessionSqliteMigrationWarnings([target], env));
		}
	}
	return warnings;
}
//#endregion
export { readSessionSqliteMigrationWarnings as n, formatSessionSqliteMigrationWarnings as t };
