import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { l as readCanonicalSessionMainKey } from "./session-canonical-key-B7chVWi3.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { t as extractGeneratedTranscriptSessionId } from "./generated-transcript-session-id-C-WpjhM8.mjs";
import { d as listSessionSqliteMigrationManifestPaths, p as readSessionSqliteMigrationManifest } from "./session-sqlite-migration-manifest-iPkR--XD.mjs";
import { t as isSessionSqliteMigrationWarning } from "./session-sqlite-migration-issues-CAeNjCyE.mjs";
import { t as countTranscriptEventsForPath } from "./session-sqlite-migration-readers-CrMHjx1c.mjs";
import { t as formatMigrationWarningSummary } from "./migration-warning-summary-BEnlm-gl.mjs";
import { t as resolveActiveSqliteTranscriptFile } from "./doctor-session-sqlite-transcript-file-B06VbLZT.mjs";
import path from "node:path";
//#region src/commands/doctor-session-sqlite-warnings.ts
const TRANSCRIPT_FINDINGS = /* @__PURE__ */ new Map([
	["active_sqlite_transcript_jsonl", /^SQLite-backed session has a legacy JSONL transcript awaiting verification: (.+)\. Run openclaw doctor /s],
	["transcript_missing", /^Transcript file is missing: (.+)$/s],
	["transcript_malformed", /^(.+\.jsonl): (?:SyntaxError|Error|TypeError|RangeError)\b/s]
]);
function currentMigrationIssues(target, env) {
	if (!target.issues.some((issue) => TRANSCRIPT_FINDINGS.has(issue.code))) return target.issues;
	const claims = target.issues.filter((issue) => issue.code !== "active_sqlite_transcript_jsonl" && TRANSCRIPT_FINDINGS.has(issue.code));
	const keys = [...new Set(claims.flatMap((issue) => issue.sessionKey ? [issue.sessionKey.toLowerCase()] : []))];
	const ids = [...new Set(claims.flatMap((issue) => {
		const file = TRANSCRIPT_FINDINGS.get(issue.code)?.exec(issue.message)?.[1];
		return file ? [extractGeneratedTranscriptSessionId(file) ?? path.basename(file, ".jsonl")] : [];
	}))];
	try {
		const read = withOpenClawAgentDatabaseReadOnly((database) => {
			const query = getSessionKysely(database.db);
			const live = new Set(keys.length ? executeSqliteQuerySync(database.db, query.selectFrom("session_nodes").select("session_key").where("entry_valid", "=", 1).where(query.fn("lower", ["session_key"]), "in", keys)).rows.map((row) => row.session_key.toLowerCase()) : []);
			const transcripts = new Set(keys.length && ids.length ? executeSqliteQuerySync(database.db, query.selectFrom("session_windows").select(["session_key", "session_id"]).where(query.fn("lower", ["session_key"]), "in", keys).where("session_id", "in", ids).where((eb) => eb.exists(eb.selectFrom("transcript_events").select("session_id").whereRef("transcript_events.session_id", "=", "session_windows.session_id")))).rows.map((row) => `${row.session_key.toLowerCase()}\0${row.session_id}`) : []);
			const mainAliases = new Set(keys.length ? ["main", readCanonicalSessionMainKey(database)] : []);
			return target.issues.filter((issue) => {
				const file = TRANSCRIPT_FINDINGS.get(issue.code)?.exec(issue.message)?.[1];
				if (!file || !path.isAbsolute(file)) return true;
				if (issue.code === "active_sqlite_transcript_jsonl") return Boolean(resolveActiveSqliteTranscriptFile(target, {
					sessionId: "migration-warning",
					sessionFile: file
				}));
				const parsed = parseAgentSessionKey(issue.sessionKey);
				if (!issue.sessionKey || !parsed || normalizeAgentId(parsed.agentId) !== normalizeAgentId(target.agentId) || normalizeStoreSessionKey(issue.sessionKey) !== issue.sessionKey) return true;
				const hasSession = live.has(issue.sessionKey.toLowerCase());
				if (!hasSession && mainAliases.has(parsed.rest.toLowerCase())) return true;
				const current = countTranscriptEventsForPath(file);
				if (current.status === "malformed") return true;
				const transcriptId = extractGeneratedTranscriptSessionId(file) ?? path.basename(file, ".jsonl");
				return current.status === "missing" && hasSession && !transcripts.has(`${issue.sessionKey.toLowerCase()}\0${transcriptId}`);
			});
		}, {
			agentId: target.agentId,
			path: target.sqlitePath,
			env
		});
		return read.found ? read.value : target.issues;
	} catch {
		return target.issues;
	}
}
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
			for (const warning of formatSessionSqliteMigrationWarnings([{
				...target,
				issues: currentMigrationIssues(target, env).map((issue) => issue.code === "active_sqlite_transcript_jsonl" ? {
					code: issue.code,
					sessionKey: issue.sessionKey,
					message: issue.message.replace(/Run openclaw doctor --fix or .*$/s, "Run openclaw doctor --session-sqlite inspect to check current originals before choosing recovery.")
				} : issue)
			}], env)) warnings.push(warning);
		}
	}
	return warnings;
}
//#endregion
export { readSessionSqliteMigrationWarnings as n, formatSessionSqliteMigrationWarnings as t };
