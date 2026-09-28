import { a as periodSchema, n as DAY_MS } from "../.setup/limits-iMrGeJ-3.mjs";
import path from "node:path";
import { z } from "zod";
import fs from "node:fs";
import { configureSqliteConnectionPragmas, migrateSqliteSchemaToStrict } from "openclaw/plugin-sdk/plugin-state-runtime";
import { enableNodeSqliteKyselyStatementCache, executeSqliteQuerySync, executeSqliteQueryTakeFirstSync, getNodeSqliteKysely, openNodeSqliteDatabase, runSqliteImmediateTransactionSync } from "openclaw/plugin-sdk/sqlite-worker-runtime";
//#region extensions/team-reports/src/store-schema.ts
const TEAM_REPORTS_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS team_reports_schema_migrations (
  id TEXT PRIMARY KEY,
  applied_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS team_reports_periods (
  period TEXT NOT NULL,
  period_key TEXT NOT NULL,
  since_ms INTEGER NOT NULL,
  until_ms INTEGER NOT NULL,
  status TEXT NOT NULL,
  generated_at_ms INTEGER NOT NULL,
  data_json TEXT NOT NULL,
  summary_json TEXT,
  markdown TEXT NOT NULL,
  PRIMARY KEY (period, period_key)
) STRICT;

CREATE TABLE IF NOT EXISTS team_reports_person_days (
  day_key TEXT NOT NULL,
  login TEXT NOT NULL,
  github_total INTEGER NOT NULL,
  commits INTEGER NOT NULL,
  prs_opened INTEGER NOT NULL,
  prs_merged INTEGER NOT NULL,
  prs_closed INTEGER NOT NULL,
  issues_opened INTEGER NOT NULL,
  issues_closed INTEGER NOT NULL,
  issue_comments INTEGER NOT NULL,
  review_comments INTEGER NOT NULL,
  discord_messages INTEGER NOT NULL,
  PRIMARY KEY (day_key, login)
) STRICT;

CREATE TABLE IF NOT EXISTS team_reports_runs (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  started_at_ms INTEGER NOT NULL,
  finished_at_ms INTEGER,
  status TEXT NOT NULL,
  periods_json TEXT NOT NULL,
  stats_json TEXT,
  error TEXT
) STRICT;
CREATE INDEX IF NOT EXISTS idx_team_reports_runs_started
  ON team_reports_runs(started_at_ms DESC);
`;
const countsSchema = z.object({
	total: z.number(),
	commits: z.number(),
	prsOpened: z.number(),
	prsMerged: z.number(),
	prsClosed: z.number(),
	issuesOpened: z.number(),
	issuesClosed: z.number(),
	issueComments: z.number(),
	reviewComments: z.number(),
	securityAdvisories: z.number(),
	/** "owner/name" -> count */
	repos: z.record(z.string(), z.number())
});
const sourceStatusSchema = z.object({
	ok: z.boolean(),
	warnings: z.array(z.string()),
	/** True when the source could not cover the whole window (e.g. archive/API stops early). */
	stale: z.boolean().optional(),
	/** Diagnostic counters, e.g. apiCalls, rateLimitRemaining, reposScanned, searchSplits. */
	stats: z.record(z.string(), z.union([z.number(), z.string()]))
});
const summarySourceSchema = z.enum(["model", "fallback"]);
const reportDocumentSchema = z.object({
	version: z.literal(1),
	period: z.object({
		period: periodSchema,
		/** "2026-08-20" | "2026-W34" | "2026-08" */
		key: z.string(),
		sinceMs: z.number(),
		untilMs: z.number(),
		title: z.string()
	}),
	generatedAtMs: z.number(),
	status: z.enum(["partial", "closed"]),
	orgs: z.array(z.string()),
	memberCount: z.number(),
	activeMembers: z.number(),
	totals: z.object({
		github: countsSchema,
		discord: z.object({
			messages: z.number(),
			channels: z.record(z.string(), z.number())
		})
	}),
	/** Sorted by activity descending; quiet members last. */
	members: z.array(z.object({
		login: z.string(),
		display: z.string(),
		affiliation: z.string().optional(),
		roleGroup: z.string().optional(),
		roleLabel: z.string().optional(),
		access: z.array(z.string()),
		areas: z.array(z.string()),
		/** Other GitHub logins mapped to this person. */
		aliases: z.array(z.string()),
		github: countsSchema.extend({ items: z.array(z.object({
			kind: z.enum([
				"commit",
				"pr_opened",
				"pr_merged",
				"pr_closed",
				"issue_opened",
				"issue_closed",
				"issue_comment",
				"review_comment",
				"security_advisory"
			]),
			/** "owner/name" */
			repo: z.string(),
			number: z.number().optional(),
			title: z.string(),
			url: z.string(),
			atMs: z.number(),
			/** GitHub login credited for this item (merged_by for pr_merged, comment author for comments, commit author for commits). */
			actor: z.string(),
			/** Logins from Co-authored-by trailers (commits only). */
			coauthors: z.array(z.string()).optional(),
			/** Raw comment body, used only for duplicate collapsing and ignore patterns; never rendered. */
			body: z.string().optional()
		})) }),
		discord: z.object({
			total: z.number(),
			/** channel name -> count */
			channels: z.record(z.string(), z.number()),
			excerpts: z.array(z.object({
				channel: z.string(),
				atMs: z.number(),
				excerpt: z.string()
			}))
		}),
		summary: z.object({
			text: z.string(),
			confidence: z.enum([
				"high",
				"medium",
				"low"
			]),
			source: summarySourceSchema
		}).optional()
	})),
	otherActors: z.array(z.object({
		login: z.string(),
		github: countsSchema
	})),
	/** Discord authors that produced messages but map to no member (id + count only). */
	unmatchedDiscord: z.array(z.object({
		authorId: z.string(),
		messages: z.number()
	})),
	sources: z.object({
		github: sourceStatusSchema,
		discord: sourceStatusSchema.optional()
	}),
	truncated: z.boolean().optional()
});
const summaryDocumentSchema = z.object({
	source: summarySourceSchema,
	warnings: z.array(z.string().max(300)).max(3).optional(),
	model: z.string().optional(),
	generatedAtMs: z.number(),
	/** Markdown: 2-3 sentence overview followed by 4-6 "- **Workstream:** ..." bullets. */
	globalSummary: z.string(),
	/** 4-7 one-line bullets naming concrete work streams. */
	highlights: z.array(z.string()),
	/** sha256 of the evidence digest; regeneration is skipped while unchanged. */
	fingerprint: z.string()
});
const runPeriodsSchema = z.array(z.object({
	period: periodSchema,
	key: z.string()
}));
const runStatsSchema = z.record(z.string(), z.unknown());
//#endregion
//#region extensions/team-reports/src/store.worker.ts
const PERSON_DAY_INSERT_BATCH_SIZE = 64;
function readPeriod(row) {
	return {
		report: reportDocumentSchema.parse(JSON.parse(row.data_json)),
		summary: row.summary_json === null ? null : summaryDocumentSchema.parse(JSON.parse(row.summary_json))
	};
}
function chmodIfExists(file) {
	try {
		fs.chmodSync(file, 384);
	} catch (error) {
		if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
	}
}
var TeamReportsDatabase = class {
	constructor(db, maintenance) {
		this.db = db;
		this.maintenance = maintenance;
		this.query = getNodeSqliteKysely(db);
	}
	upsertPeriod(value) {
		const { report } = value;
		const dataJson = JSON.stringify(report);
		if (Buffer.byteLength(dataJson, "utf8") > 2097152) throw new Error("Team Reports document exceeds the 2 MiB storage limit.");
		const row = {
			period: report.period.period,
			period_key: report.period.key,
			since_ms: report.period.sinceMs,
			until_ms: report.period.untilMs,
			status: report.status,
			generated_at_ms: report.generatedAtMs,
			data_json: dataJson,
			summary_json: value.summary ? JSON.stringify(value.summary) : null,
			markdown: value.markdown
		};
		const people = report.members.map((member) => ({
			day_key: report.period.key,
			login: member.login.toLowerCase(),
			github_total: member.github.total,
			commits: member.github.commits,
			prs_opened: member.github.prsOpened,
			prs_merged: member.github.prsMerged,
			prs_closed: member.github.prsClosed,
			issues_opened: member.github.issuesOpened,
			issues_closed: member.github.issuesClosed,
			issue_comments: member.github.issueComments,
			review_comments: member.github.reviewComments,
			discord_messages: member.discord.total
		}));
		runSqliteImmediateTransactionSync(this.db, () => {
			executeSqliteQuerySync(this.db, this.query.insertInto("team_reports_periods").values(row).onConflict((conflict) => conflict.columns(["period", "period_key"]).doUpdateSet(row)));
			if (report.period.period === "day") {
				executeSqliteQuerySync(this.db, this.query.deleteFrom("team_reports_person_days").where("day_key", "=", report.period.key));
				for (let start = 0; start < people.length; start += PERSON_DAY_INSERT_BATCH_SIZE) executeSqliteQuerySync(this.db, this.query.insertInto("team_reports_person_days").values(people.slice(start, start + PERSON_DAY_INSERT_BATCH_SIZE)));
			}
		});
	}
	getPeriod(period, key) {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.selectPeriodDocument(period, key).select("markdown"));
		return row ? {
			...readPeriod(row),
			markdown: row.markdown
		} : void 0;
	}
	getPeriodDocument(period, key) {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.selectPeriodDocument(period, key));
		return row ? readPeriod(row) : void 0;
	}
	selectPeriodDocument(period, key) {
		return this.query.selectFrom("team_reports_periods").select([
			"period",
			"period_key",
			"since_ms",
			"until_ms",
			"status",
			"generated_at_ms",
			"data_json",
			"summary_json"
		]).where("period", "=", period).where("period_key", "=", key);
	}
	listPeriods(options = {}) {
		let query = this.selectPeriods();
		if (options.period) query = query.where("period", "=", options.period);
		if (options.status) query = query.where("status", "=", options.status);
		return executeSqliteQuerySync(this.db, query.limit(options.limit ?? 180)).rows;
	}
	selectPeriods() {
		return this.query.selectFrom("team_reports_periods").select([
			"period",
			"period_key as key",
			"since_ms as sinceMs",
			"until_ms as untilMs",
			"status",
			"generated_at_ms as generatedAtMs"
		]).select((eb) => [
			eb.fn("json_extract", ["data_json", eb.val("$.activeMembers")]).as("activeMembers"),
			eb.fn("json_extract", ["data_json", eb.val("$.memberCount")]).as("memberCount"),
			eb.fn("json_extract", ["data_json", eb.val("$.totals.github.total")]).as("githubTotal"),
			eb.fn("json_extract", ["data_json", eb.val("$.totals.discord.messages")]).as("discordMessages"),
			eb.fn("json_extract", ["data_json", eb.val("$.totals.github.commits")]).as("commits"),
			eb.fn("json_extract", ["data_json", eb.val("$.totals.github.prsOpened")]).as("prsOpened"),
			eb.fn("json_extract", ["data_json", eb.val("$.totals.github.prsMerged")]).as("prsMerged"),
			eb.fn("json_extract", ["data_json", eb.val("$.totals.github.securityAdvisories")]).as("securityAdvisories")
		]).orderBy("since_ms", "desc").orderBy("period", "asc");
	}
	latestDay() {
		return this.selectPeriods().select(["data_json", "summary_json"]).where("period", "=", "day").limit(1);
	}
	latestSourceWarnings() {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.latestDay());
		if (!row) return [];
		const { report, summary } = readPeriod(row);
		return report.sources.github.warnings.concat(report.sources.discord?.warnings ?? [], summary?.warnings ?? []);
	}
	latestPeople() {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.latestDay());
		if (!row) return;
		const { report } = readPeriod(row);
		return {
			key: row.key,
			members: report.members.map(({ login, aliases, display, affiliation, roleGroup, roleLabel, access, areas }) => ({
				login,
				aliases,
				display,
				affiliation,
				roleGroup,
				roleLabel,
				access,
				areas
			}))
		};
	}
	getDayReports(sinceMs, untilMs) {
		return executeSqliteQuerySync(this.db, this.query.selectFrom("team_reports_periods").select("data_json").where("period", "=", "day").where("since_ms", ">=", sinceMs).where("since_ms", "<", untilMs).orderBy("since_ms", "asc")).rows.map((row) => reportDocumentSchema.parse(JSON.parse(row.data_json)));
	}
	listPersonDays(login, options = {}) {
		let query = this.selectPersonDays().where("login", "=", login.toLowerCase()).orderBy("day_key", "desc");
		if (options.since) query = query.where("day_key", ">=", options.since);
		if (options.until) query = query.where("day_key", "<", options.until);
		return executeSqliteQuerySync(this.db, query.limit(options.limit ?? 28)).rows;
	}
	listPersonDaysSince(since) {
		return executeSqliteQuerySync(this.db, this.selectPersonDays().where("day_key", ">=", since).orderBy("day_key", "desc").orderBy("login", "asc")).rows;
	}
	selectPersonDays() {
		return this.query.selectFrom("team_reports_person_days").select([
			"day_key as dayKey",
			"login",
			"github_total as githubTotal",
			"commits",
			"prs_opened as prsOpened",
			"prs_merged as prsMerged",
			"prs_closed as prsClosed",
			"issues_opened as issuesOpened",
			"issues_closed as issuesClosed",
			"issue_comments as issueComments",
			"review_comments as reviewComments",
			"discord_messages as discordMessages"
		]);
	}
	startRun(run) {
		executeSqliteQuerySync(this.db, this.query.insertInto("team_reports_runs").values({
			id: run.id,
			kind: run.kind,
			started_at_ms: run.startedAtMs,
			finished_at_ms: null,
			status: "running",
			periods_json: JSON.stringify(run.periods),
			stats_json: null,
			error: null
		}));
	}
	finishRun(id, result) {
		if (executeSqliteQuerySync(this.db, this.query.updateTable("team_reports_runs").set({
			finished_at_ms: result.finishedAtMs,
			status: result.status,
			stats_json: result.stats ? JSON.stringify(result.stats) : null,
			error: result.error?.slice(0, 2e3) ?? null
		}).where("id", "=", id).where("status", "=", "running")).numAffectedRows !== 1n) throw new Error(`Team Reports run ${id} is not running.`);
	}
	listRuns(limit = 20, filter = {}) {
		let query = this.query.selectFrom("team_reports_runs").selectAll();
		if (filter.kind) query = query.where("kind", "=", filter.kind);
		if (filter.status) query = query.where("status", "=", filter.status);
		return executeSqliteQuerySync(this.db, query.orderBy("started_at_ms", "desc").orderBy("id", "asc").limit(limit)).rows.map((row) => ({
			id: row.id,
			kind: row.kind,
			startedAtMs: row.started_at_ms,
			finishedAtMs: row.finished_at_ms,
			status: row.status,
			periods: runPeriodsSchema.parse(JSON.parse(row.periods_json)),
			stats: row.stats_json === null ? null : runStatsSchema.parse(JSON.parse(row.stats_json)),
			error: row.error
		}));
	}
	prune(retentionDays, nowMs = Date.now()) {
		if (!Number.isSafeInteger(retentionDays) || retentionDays < 0) throw new Error("Team Reports retention days must be a nonnegative integer.");
		if (retentionDays === 0) return {
			periods: 0,
			personDays: 0,
			runs: 0
		};
		const cutoffMs = Math.floor(nowMs / DAY_MS) * DAY_MS - retentionDays * DAY_MS;
		const cutoffDay = new Date(cutoffMs).toISOString().slice(0, 10);
		return runSqliteImmediateTransactionSync(this.db, () => ({
			periods: Number(executeSqliteQuerySync(this.db, this.query.deleteFrom("team_reports_periods").where("until_ms", "<=", cutoffMs)).numAffectedRows ?? 0n),
			personDays: Number(executeSqliteQuerySync(this.db, this.query.deleteFrom("team_reports_person_days").where("day_key", "<", cutoffDay)).numAffectedRows ?? 0n),
			runs: Number(executeSqliteQuerySync(this.db, this.query.deleteFrom("team_reports_runs").where("started_at_ms", "<", cutoffMs).where("status", "!=", "running")).numAffectedRows ?? 0n)
		}));
	}
	close() {
		try {
			this.maintenance.close();
		} finally {
			this.db.close();
		}
	}
};
function openTeamReportsDatabase(dbPath) {
	fs.mkdirSync(path.dirname(dbPath), {
		recursive: true,
		mode: 448
	});
	fs.chmodSync(path.dirname(dbPath), 448);
	if (!fs.existsSync(dbPath)) fs.closeSync(fs.openSync(dbPath, "a", 384));
	const db = openNodeSqliteDatabase(dbPath);
	let maintenance;
	try {
		enableNodeSqliteKyselyStatementCache(db);
		maintenance = configureSqliteConnectionPragmas(db, {
			busyTimeoutMs: 5e3,
			checkpointIntervalMs: 0,
			databaseLabel: "team-reports database",
			databasePath: dbPath,
			foreignKeys: true,
			synchronous: "NORMAL"
		});
		db.exec(TEAM_REPORTS_SCHEMA_SQL);
		const query = getNodeSqliteKysely(db);
		if (!executeSqliteQueryTakeFirstSync(db, query.selectFrom("team_reports_schema_migrations").select("id").where("id", "=", "schema-1"))) {
			migrateSqliteSchemaToStrict(db, TEAM_REPORTS_SCHEMA_SQL, { databaseLabel: "team-reports database" });
			executeSqliteQuerySync(db, query.insertInto("team_reports_schema_migrations").values({
				id: "schema-1",
				applied_at: Date.now()
			}).onConflict((conflict) => conflict.column("id").doNothing()));
		}
		for (const file of [
			dbPath,
			`${dbPath}-wal`,
			`${dbPath}-shm`,
			`${dbPath}-journal`
		]) chmodIfExists(file);
		return new TeamReportsDatabase(db, maintenance);
	} catch (error) {
		try {
			maintenance?.close();
		} finally {
			db.close();
		}
		throw error;
	}
}
function createSqliteWorkerBackend(_input, context) {
	const database = openTeamReportsDatabase(context.databasePath);
	return {
		execute(command) {
			switch (command.type) {
				case "upsertPeriod": return database.upsertPeriod(command.input);
				case "getPeriod": return database.getPeriod(command.input.period, command.input.key);
				case "getPeriodDocument": return database.getPeriodDocument(command.input.period, command.input.key);
				case "listPeriods": return database.listPeriods(command.input);
				case "latestSourceWarnings": return database.latestSourceWarnings();
				case "latestPeople": return database.latestPeople();
				case "getDayReports": return database.getDayReports(command.input.sinceMs, command.input.untilMs);
				case "listPersonDays": return database.listPersonDays(command.input.login, command.input.options);
				case "listPersonDaysSince": return database.listPersonDaysSince(command.input);
				case "startRun": return database.startRun(command.input);
				case "finishRun": return database.finishRun(command.input.id, command.input.result);
				case "listRuns": return database.listRuns(command.input.limit, command.input.filter);
				case "prune": return database.prune(command.input.retentionDays, command.input.nowMs);
			}
		},
		close: () => database.close()
	};
}
//#endregion
export { createSqliteWorkerBackend };
