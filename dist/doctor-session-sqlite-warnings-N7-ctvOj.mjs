import { f as readSessionSqliteMigrationManifest, u as listSessionSqliteMigrationManifestPaths } from "./doctor-session-sqlite-migration-run-Dta_SQ4O.mjs";
import { o as isSessionSqliteMigrationWarning } from "./doctor-session-sqlite-types-Hd3T2UXj.mjs";
//#region src/commands/doctor-session-sqlite-warnings.ts
function formatSessionSqliteMigrationWarnings(targets) {
	return targets.flatMap((target) => target.issues.filter(isSessionSqliteMigrationWarning).map((issue) => `${target.storePath}: [${issue.code}] ${issue.message}`));
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
			warnings.push(...formatSessionSqliteMigrationWarnings([target]));
		}
	}
	return warnings;
}
//#endregion
export { readSessionSqliteMigrationWarnings as n, formatSessionSqliteMigrationWarnings as t };
