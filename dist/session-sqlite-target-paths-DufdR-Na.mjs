import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { readdirSync } from "node:fs";
import path from "node:path";
//#region src/config/sessions/session-sqlite-target-paths.ts
const MULTI_STORE_PATH_SENTINEL = "(multiple)";
function resolveConcreteSessionStorePath(storePath) {
	const trimmed = storePath?.trim();
	if (!trimmed || trimmed === "(multiple)" || trimmed.includes("{agentId}")) return;
	return trimmed;
}
/** Resolves only the legacy unsuffixed target, without reading ownership state. */
function resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath) {
	const concrete = resolveConcreteSessionStorePath(storePath);
	if (!concrete) throw new Error("Session storage requires a concrete store path");
	const resolved = path.resolve(concrete);
	if (resolved.endsWith(".sqlite")) {
		const agentId = resolveAgentIdFromSqliteDatabasePath(resolved);
		return {
			path: resolved,
			...agentId ? { agentId } : { shared: true }
		};
	}
	const sessionsDir = path.dirname(resolved);
	if (path.basename(resolved) !== "sessions.json") {
		const sqliteBaseName = path.basename(resolved, path.extname(resolved)) || "openclaw-agent";
		return { path: path.join(sessionsDir, `${sqliteBaseName}.sqlite`) };
	}
	if (path.basename(sessionsDir) !== "sessions") return { path: path.join(sessionsDir, "openclaw-agent.sqlite") };
	const agentDir = path.dirname(sessionsDir);
	if (path.basename(path.dirname(agentDir)) !== "agents") return { path: path.join(sessionsDir, "openclaw-agent.sqlite") };
	return {
		agentId: normalizeAgentId(path.basename(agentDir)),
		path: path.join(agentDir, "agent", "openclaw-agent.sqlite")
	};
}
/** List inspection candidates without opening stores or assigning writable ownership. */
function listSqliteTargetCandidatePathsForSessionStorePath(storePath, agentId) {
	const unsuffixedTarget = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	if (unsuffixedTarget.agentId || unsuffixedTarget.shared) return [unsuffixedTarget.path];
	const directory = path.dirname(unsuffixedTarget.path);
	const baseName = path.basename(unsuffixedTarget.path, ".sqlite");
	const prefix = agentId ? `${baseName}.${normalizeAgentId(agentId)}` : void 0;
	const candidateNames = /* @__PURE__ */ new Set([path.basename(unsuffixedTarget.path)]);
	try {
		for (const fileName of readdirSync(directory)) {
			const databaseName = fileName.replace(/-(?:wal|shm|journal)$/u, "");
			if (databaseName.startsWith(`${baseName}.`) && databaseName.endsWith(".sqlite") && (!prefix || parseSqliteTargetSuffixIndex(databaseName, prefix) !== void 0)) candidateNames.add(databaseName);
		}
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	return [...candidateNames].map((fileName) => path.join(directory, fileName));
}
function parseSqliteTargetSuffixIndex(fileName, prefix) {
	if (fileName === `${prefix}.sqlite`) return 1;
	if (!fileName.startsWith(`${prefix}.`) || !fileName.endsWith(".sqlite")) return;
	const rawValue = fileName.slice(prefix.length + 1, -7);
	if (!/^[1-9]\d*$/.test(rawValue)) return;
	const value = Number(rawValue);
	return Number.isSafeInteger(value) && value >= 2 && String(value) === rawValue ? value : void 0;
}
/** Extracts the agent id from the canonical per-agent SQLite database path. */
function resolveAgentIdFromSqliteDatabasePath(databasePath) {
	if (path.basename(databasePath) !== "openclaw-agent.sqlite") return;
	const agentDbDir = path.dirname(databasePath);
	if (path.basename(agentDbDir) !== "agent") return;
	const agentDir = path.dirname(agentDbDir);
	if (path.basename(path.dirname(agentDir)) !== "agents") return;
	return normalizeAgentId(path.basename(agentDir));
}
//#endregion
export { resolveUnsuffixedSqliteTargetFromSessionStorePath as a, resolveConcreteSessionStorePath as i, listSqliteTargetCandidatePathsForSessionStorePath as n, parseSqliteTargetSuffixIndex as r, MULTI_STORE_PATH_SENTINEL as t };
