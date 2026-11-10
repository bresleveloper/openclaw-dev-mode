import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as isUpdateRehearsalReadOnlyPath } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath, r as parseSqliteTargetSuffixIndex } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { s as resolveConfiguredAgentDatabaseTargets } from "./targets-DJGC6v85.mjs";
import path from "node:path";
//#region src/commands/doctor-relative-session-store-paths.ts
/** Preflight inspects custom stores without binding their migration owners. */
function resolveDoctorAgentMigrationTargets(cfg, env, options) {
	const targets = options.skipConfigured ? [] : resolveConfiguredAgentDatabaseTargets(cfg, {
		env,
		registeredDatabases: options.registeredDatabases
	});
	if (options.mode === "doctor") targets.push(...resolveRelativeSessionStoreMigrationTargets(cfg, env, options.registeredDatabases).filter((target) => !isUpdateRehearsalReadOnlyPath(target.path, env)));
	return targets;
}
/** Match recorded old working directories without searching unrelated filesystem roots. */
function registeredRelativeStoreBase(databasePath, relativeDatabase, agentId, suffixed) {
	const segments = relativeDatabase.split(path.sep);
	let parents = 0;
	while (segments[0] === "..") {
		segments.shift();
		parents++;
	}
	const filename = segments.pop();
	if (!filename) return;
	const actual = path.basename(databasePath);
	if (actual !== filename && (!suffixed || parseSqliteTargetSuffixIndex(actual, `${path.basename(filename, ".sqlite")}.${agentId}`) === void 0)) return;
	const tail = path.join(...segments, actual);
	if (!databasePath.endsWith(`${path.sep}${tail}`)) return;
	const root = databasePath.slice(0, -tail.length);
	return path.join(root, ...Array(parents).fill(".old-session-cwd"));
}
/** Doctor retains these prior selectors through schema repair, backup, and the final merge. */
function resolveRelativeSessionStoreMigrationTargets(cfg, env, registered) {
	const store = cfg.session?.store;
	const targets = [];
	if (!store || store.startsWith("~") || path.isAbsolute(store)) return targets;
	const probeRoot = path.join(resolveStateDir(env), ".relative-session-store-probe");
	for (const configuredAgentId of listAgentIds(cfg)) {
		const expanded = store.replaceAll("{agentId}", configuredAgentId);
		const probe = resolveUnsuffixedSqliteTargetFromSessionStorePath(path.resolve(probeRoot, expanded));
		for (const row of registered) {
			if (!probe.shared && row.agentId !== configuredAgentId) continue;
			const base = registeredRelativeStoreBase(row.path, path.relative(probeRoot, probe.path), row.agentId, !probe.agentId && !probe.shared);
			if (base !== void 0) targets.push({
				...row,
				configuredAgentId,
				storePath: path.resolve(base, expanded)
			});
		}
	}
	return targets;
}
//#endregion
export { resolveRelativeSessionStoreMigrationTargets as n, resolveDoctorAgentMigrationTargets as t };
