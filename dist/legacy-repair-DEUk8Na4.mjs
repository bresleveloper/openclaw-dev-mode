import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, u as normalizeOptionalStringifiedId } from "./string-coerce-CIXf7egm.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { b as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { i as isSqliteSchemaVersionError } from "./sqlite-user-version-B1TtVu8E.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { Dt as migrateLegacyCronRunLogsToTaskRuns, Lt as parseCronRunLogEntryObject } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { c as withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync, s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { n as TASK_SUGGESTION_TOOL_NAME_MIGRATION, t as IMAGE_INSPECTION_TOOL_NAME_MIGRATION } from "./legacy-tool-name-migration-CqSg4UH7.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { a as recordLegacyMigrationRun, t as markLegacyMigrationSourceRemoved } from "./state-migrations.receipts-D6lbWbKJ.mjs";
import { v as MEMORY_DREAMING_SYSTEM_EVENT_TEXT } from "./dreaming-Rnb_FGdU.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as resolveCronJobsStorePath } from "./paths-Bz2goYfd.mjs";
import { d as saveCronQuarantinedJobs, o as CronJobsStoreChangedError, u as loadCronQuarantinedJobs } from "./save.kernel-BmIaenr0.mjs";
import { a as loadCronJobsStoreWithConfigJobs, d as saveCronJobsStoreChanges, m as saveCronJobsStoreWithMetadata, t as assertCronJobsStoreUnchanged, u as saveCronJobsStore, v as loadCronJobsStoreWithConfigJobsReadOnly } from "./store-CV1wrdMb.mjs";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BqkZLKq3.mjs";
import { a as archiveLegacyCronFile, c as legacyCronStoreFilesExist, i as recoverValidQuarantinedCronScheduleJobs, l as loadLegacyCronStoreForMigration, n as cronCodexRuntimePolicyTargetKey, o as archiveLegacyCronStoreForMigration, r as normalizeStoredCronJobs, s as assertLegacyCronMigrationSourceCurrent, t as collectStoredCronCodexRuntimePolicyTargets, u as resolveLegacyCronMigrationId } from "./store-migration-BYXGlu9d.mjs";
import { i as repairRetiredModelSlots, n as repairModelRefAuthProfile, t as createRetiredModelRefRepairResolver } from "./retired-model-ref-repair-C-osjblL.mjs";
import { t as planCronCodexRefRewriteAgainstPersistedConfig } from "./runtime-policy-migration-BzF2s18z.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/commands/doctor/cron/dreaming-payload-migration.ts
function isManagedDreamingJob(raw) {
	if (normalizeOptionalString(raw.description)?.includes("[managed-by=memory-core.short-term-promotion]")) return true;
	if (normalizeOptionalString(raw.name) !== "Memory Dreaming Promotion") return false;
	const payload = raw.payload ?? void 0;
	const payloadKind = normalizeOptionalLowercaseString(payload?.kind);
	if (payloadKind === "systemevent") return normalizeOptionalString(payload?.text) === MEMORY_DREAMING_SYSTEM_EVENT_TEXT;
	if (payloadKind === "agentturn") return normalizeOptionalString(payload?.message) === MEMORY_DREAMING_SYSTEM_EVENT_TEXT;
	return false;
}
function isStaleDreamingJob(raw) {
	if (normalizeOptionalLowercaseString(raw.sessionTarget) !== "isolated") return true;
	const payload = raw.payload ?? void 0;
	if (normalizeOptionalLowercaseString(payload?.kind) !== "agentturn") return true;
	if (payload?.lightContext !== true) return true;
	const delivery = raw.delivery ?? void 0;
	if (normalizeOptionalLowercaseString(delivery?.mode) !== "none") return true;
	return false;
}
function rewriteDreamingJobShape(raw) {
	raw.sessionTarget = "isolated";
	raw.payload = {
		kind: "agentTurn",
		message: MEMORY_DREAMING_SYSTEM_EVENT_TEXT,
		lightContext: true
	};
	raw.delivery = { mode: "none" };
}
/** Rewrite managed dreaming jobs to the isolated light-context agent-turn shape. */
function migrateLegacyDreamingPayloadShape(jobs) {
	let rewrittenCount = 0;
	for (const raw of jobs) {
		if (!isManagedDreamingJob(raw)) continue;
		if (!isStaleDreamingJob(raw)) continue;
		rewriteDreamingJobShape(raw);
		rewrittenCount += 1;
	}
	return {
		changed: rewrittenCount > 0,
		rewrittenCount
	};
}
/** Count managed dreaming jobs that still need payload/session/delivery migration. */
function countStaleDreamingJobs(jobs) {
	let count = 0;
	for (const raw of jobs) if (isManagedDreamingJob(raw) && isStaleDreamingJob(raw)) count += 1;
	return count;
}
//#endregion
//#region src/commands/doctor/cron/legacy-notify.ts
/** Migrate legacy notify fallback flags into explicit delivery destinations when possible. */
function migrateLegacyNotifyFallback(params) {
	let changed = false;
	const warnings = [];
	const configuredLegacyWebhook = normalizeOptionalString(params.legacyWebhook);
	const legacyWebhook = configuredLegacyWebhook ? normalizeHttpWebhookUrl(configuredLegacyWebhook) : void 0;
	for (const raw of params.jobs) {
		if (!("notify" in raw)) continue;
		const jobName = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id) ?? "<unnamed>";
		if (!(raw.notify === true)) {
			delete raw.notify;
			changed = true;
			continue;
		}
		const delivery = raw.delivery && typeof raw.delivery === "object" && !Array.isArray(raw.delivery) ? raw.delivery : null;
		const mode = normalizeOptionalLowercaseString(delivery?.mode);
		const to = normalizeOptionalString(delivery?.to);
		const hasLegacyChatDelivery = mode === void 0 && delivery !== null && (normalizeOptionalString(delivery.channel) !== void 0 || normalizeOptionalString(delivery.accountId) !== void 0 || "threadId" in delivery || to !== void 0 && !normalizeHttpWebhookUrl(to));
		const completionDestination = delivery?.completionDestination && typeof delivery.completionDestination === "object" && !Array.isArray(delivery.completionDestination) ? delivery.completionDestination : null;
		const completionMode = normalizeOptionalLowercaseString(completionDestination?.mode);
		const completionTo = normalizeOptionalString(completionDestination?.to);
		const validWebhookTo = to ? normalizeHttpWebhookUrl(to) : void 0;
		const validCompletionTo = completionTo ? normalizeHttpWebhookUrl(completionTo) : void 0;
		if (mode === "webhook" && validWebhookTo || completionMode === "webhook" && validCompletionTo) {
			delete raw.notify;
			changed = true;
			continue;
		}
		if (configuredLegacyWebhook && !legacyWebhook) {
			warnings.push(`Automation "${jobName}" still uses legacy notify fallback, but cron.webhook is not a valid HTTP(S) URL so doctor cannot migrate it automatically.`);
			continue;
		}
		if (!legacyWebhook) {
			delete raw.notify;
			changed = true;
			continue;
		}
		if (mode === void 0 && !hasLegacyChatDelivery || mode === "none" || mode === "webhook") {
			raw.delivery = {
				...delivery,
				mode: "webhook",
				to: mode === "none" ? legacyWebhook : validWebhookTo ?? legacyWebhook
			};
			delete raw.notify;
			changed = true;
			continue;
		}
		raw.delivery = {
			...delivery,
			...hasLegacyChatDelivery ? { mode: "announce" } : {},
			completionDestination: {
				...completionDestination,
				mode: "webhook",
				to: legacyWebhook
			}
		};
		delete raw.notify;
		changed = true;
	}
	return {
		changed,
		warnings
	};
}
//#endregion
//#region src/commands/doctor/cron/legacy-quarantine-migration.ts
/** Imports shipped cron quarantine sidecars only through the doctor migration boundary. */
/** Resolves the historical sidecar without making it part of the runtime store API. */
function resolveLegacyCronQuarantinePath(storePath) {
	return storePath.endsWith(".json") ? storePath.replace(/\.json$/, "-quarantine.json") : `${storePath}-quarantine.json`;
}
/** Reads and validates a historical quarantine file without modifying its source. */
async function loadLegacyCronQuarantineForMigration(storePath) {
	const quarantinePath = resolveLegacyCronQuarantinePath(storePath);
	let raw;
	try {
		raw = await fs$1.readFile(quarantinePath, "utf-8");
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	const parsed = parseJsonWithJson5Fallback(raw);
	if (!isRecord(parsed) || parsed.version !== 1 || !Array.isArray(parsed.jobs)) throw new Error(`Unsupported cron quarantine file shape at ${quarantinePath}`);
	const jobs = parsed.jobs.map((entry, index) => {
		if (!isRecord(entry) || typeof entry.reason !== "string" || !isRecord(entry.job) && !("raw" in entry)) throw new Error(`Unsupported cron quarantine entry at ${quarantinePath} index ${index}`);
		const quarantined = {
			quarantinedAtMs: typeof entry.quarantinedAtMs === "number" && Number.isFinite(entry.quarantinedAtMs) ? entry.quarantinedAtMs : Date.now(),
			sourceIndex: typeof entry.sourceIndex === "number" ? entry.sourceIndex : -1,
			reason: entry.reason
		};
		if (isRecord(entry.job)) quarantined.job = entry.job;
		if ("raw" in entry) quarantined.raw = entry.raw;
		if (isRecord(entry.state)) quarantined.state = entry.state;
		if (typeof entry.updatedAtMs === "number" && Number.isFinite(entry.updatedAtMs)) quarantined.updatedAtMs = entry.updatedAtMs;
		if (typeof entry.scheduleIdentity === "string") quarantined.scheduleIdentity = entry.scheduleIdentity;
		return quarantined;
	});
	return {
		path: quarantinePath,
		sourceSha256: createHash("sha256").update(raw).digest("hex"),
		jobs
	};
}
/** Archives the exact quarantine source already committed to SQLite. */
async function archiveLegacyCronQuarantineForMigration(quarantine) {
	return await archiveLegacyCronFile(quarantine.path, quarantine.sourceSha256);
}
//#endregion
//#region src/commands/doctor/cron/legacy-run-log-migration.ts
const LEGACY_CRON_RUN_LOG_ARCHIVE_SUFFIX = ".migrated";
function parseCronRunLogEntriesFromJsonl(raw, opts) {
	const entries = [];
	for (const line of raw.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		try {
			const entry = parseCronRunLogEntryObject(JSON.parse(trimmed), opts);
			if (entry) entries.push(entry);
		} catch {}
	}
	return entries;
}
function archiveLegacyCronRunLogSync(filePath) {
	const archivePath = `${filePath}${LEGACY_CRON_RUN_LOG_ARCHIVE_SUFFIX}`;
	if (!fs.existsSync(filePath) || fs.existsSync(archivePath)) return;
	try {
		fs.renameSync(filePath, archivePath);
	} catch {}
}
/** Import legacy per-job JSONL run logs into task_runs and archive migrated files. */
async function migrateLegacyCronRunLogsToSqlite(storePath) {
	const resolvedStorePath = path.resolve(storePath);
	const runsDir = path.resolve(path.dirname(resolvedStorePath), "runs");
	const jsonlFiles = (await fs$1.readdir(runsDir, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isFile() && entry.name.endsWith(".jsonl"));
	if (jsonlFiles.length === 0) return { importedFiles: 0 };
	for (const file of jsonlFiles) {
		const filePath = path.join(runsDir, file.name);
		const jobId = path.basename(file.name, ".jsonl");
		const entries = parseCronRunLogEntriesFromJsonl(fs.readFileSync(filePath, "utf-8"), { jobId });
		runOpenClawStateWriteTransaction(({ db }) => {
			db.exec(`
        CREATE TABLE cron_run_logs (
          store_key TEXT NOT NULL,
          job_id TEXT NOT NULL,
          seq INTEGER NOT NULL,
          ts INTEGER NOT NULL,
          entry_json TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          PRIMARY KEY (store_key, job_id, seq)
        ) STRICT;
      `);
			const insert = db.prepare(`INSERT INTO cron_run_logs
          (store_key, job_id, seq, ts, entry_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`);
			const storeKey = cronStoreKey(resolvedStorePath);
			for (const [index, entry] of entries.entries()) insert.run(storeKey, jobId, index + 1, entry.ts, JSON.stringify(entry), Date.now());
			migrateLegacyCronRunLogsToTaskRuns(db);
		});
		archiveLegacyCronRunLogSync(filePath);
	}
	return { importedFiles: jsonlFiles.length };
}
/** Return true when legacy cron JSONL run log files exist next to a store path. */
async function legacyCronRunLogFilesExist(storePath) {
	const resolvedStorePath = path.resolve(storePath);
	const runsDir = path.resolve(path.dirname(resolvedStorePath), "runs");
	return (await fs$1.readdir(runsDir, { withFileTypes: true }).catch(() => [])).some((entry) => entry.isFile() && entry.name.endsWith(".jsonl"));
}
//#endregion
//#region src/commands/doctor/cron/migration-ledger.ts
function hasLegacyCronMigrationReceiptInDatabase(db, source) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_sources").select("status").where("source_key", "=", source.sourceKey))?.status === "completed";
}
function hasLegacyCronMigrationReceipt(source) {
	return hasLegacyCronMigrationReceiptInDatabase(openOpenClawStateDatabase().db, source);
}
function tableExists(db, tableName) {
	return db.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) !== void 0;
}
function hasLegacyCronMigrationReceiptReadOnly(source) {
	const statePath = resolveOpenClawStateSqlitePath(process.env);
	if (!fs.existsSync(statePath)) return false;
	const db = openNodeSqliteDatabase(statePath, { readOnly: true });
	try {
		if (!tableExists(db, "migration_sources")) return false;
		return hasLegacyCronMigrationReceiptInDatabase(db, source);
	} finally {
		db.close();
	}
}
function acquireLegacyCronMigrationReceipt(db, source) {
	if (hasLegacyCronMigrationReceiptInDatabase(db, source)) return false;
	const now = Date.now();
	const runId = `cron-legacy:${source.sourceKey}`;
	const reportJson = JSON.stringify({
		source: "legacy-cron-json",
		target: "cron_jobs",
		statePath: source.stateSha256 ? source.statePath : void 0,
		stateSha256: source.stateSha256
	});
	recordLegacyMigrationRun(db, {
		runId,
		startedAt: now,
		finishedAt: now,
		status: "completed",
		reportJson,
		upsert: true
	});
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("migration_sources").values({
		source_key: source.sourceKey,
		migration_kind: "legacy-cron-json",
		source_path: source.sourcePath,
		target_table: "cron_jobs",
		source_sha256: source.sourceSha256,
		source_size_bytes: source.sourceSizeBytes,
		source_record_count: source.sourceRecordCount,
		last_run_id: runId,
		status: "completed",
		imported_at: now,
		removed_source: 0,
		report_json: reportJson
	}).onConflict((conflict) => conflict.column("source_key").doUpdateSet({
		last_run_id: runId,
		status: "completed",
		imported_at: now,
		removed_source: 0,
		report_json: reportJson
	})));
	return true;
}
//#endregion
//#region src/commands/doctor/cron/repair-plan.ts
function pluralize$1(count, noun) {
	return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
function formatJobNameList(names) {
	const preview = names.slice(0, 5).map((name) => `\`${name}\``);
	const remaining = names.length - preview.length;
	return remaining > 0 ? `: ${preview.join(", ")} (+${remaining} more)` : `: ${preview.join(", ")}`;
}
/**
* Advisory for isolated agentTurn cron jobs that describe a command but cannot access shell tools.
* These need operator attention, but `doctor --fix` cannot safely infer whether to grant tool
* access or recreate them as command cron jobs.
*/
function formatUnresolvedCommandPromptAdvisory(names) {
	if (names.length === 0) return null;
	const describeVerb = names.length === 1 ? "describes" : "describe";
	const accessVerb = names.length === 1 ? "lacks" : "lack";
	return [
		`${pluralize$1(names.length, "isolated automation")} ${describeVerb} a shell command in the agent prompt but ${accessVerb} shell/process tool access${formatJobNameList(names)}.`,
		"- This is not the supported shell-tool prompt shape, so doctor cannot prove the job will execute the requested command.",
		"- Recreate it as a command automation (`openclaw automations add ... --command \"<shell>\"`) or grant explicit shell/process tool access before relying on it."
	].join("\n");
}
/**
* Advisory for isolated agentTurn cron jobs that drive shell/process tools from the prompt.
* These keep running and are not a legacy store row, so `doctor --fix` cannot rewrite them;
* routing this through the auto-repair preview made the finding persist after every --fix.
*/
function formatUnresolvedShellPromptAdvisory(names) {
	if (names.length === 0) return null;
	const verb = names.length === 1 ? "drives" : "drive";
	const keepVerb = names.length === 1 ? "keeps" : "keep";
	return [
		`${pluralize$1(names.length, "isolated automation")} ${verb} shell/process tools from the agent prompt and ${keepVerb} running as-is${formatJobNameList(names)}.`,
		"- This is a supported shape, not a legacy store row, so the doctor fix path cannot convert it and the finding is informational only.",
		"- For a deterministic run, recreate it as a command automation (`openclaw automations add ... --command \"<shell>\"`)."
	].join("\n");
}
/** Advisory for jobs whose scheduled authority cannot be recovered without a caller decision. */
function formatScheduledToolPolicyAdvisory(params) {
	const lines = [];
	if (params.legacyJobs.length > 0) lines.push(`${pluralize$1(params.legacyJobs.length, "tool-bearing cron job")} ${params.legacyJobs.length === 1 ? "keeps" : "keep"} legacy sender-policy resolution because an explicit tool cap or provable stored account identity is missing${formatJobNameList(params.legacyJobs)}.`);
	if (params.invalidJobs.length > 0) lines.push(`${pluralize$1(params.invalidJobs.length, "tool-bearing cron job")} ${params.invalidJobs.length === 1 ? "has" : "have"} invalid or inconsistent scheduled authority provenance${formatJobNameList(params.invalidJobs)}.`);
	if (lines.length === 0) return null;
	lines.push("- These jobs continue through restrictive sender-policy resolution; doctor will not infer authority from delivery or current configuration.", "- Reauthorize with an exact explicit cap: `openclaw cron edit <id> --tools <tool,...>`.");
	return lines.join("\n");
}
/** Advisory for alias-only jobs whose original exec authority cannot be proven from storage. */
function formatLegacyGatewayExecAdvisory(names) {
	if (names.length === 0) return null;
	return [
		`${pluralize$1(names.length, "automation")} ${names.length === 1 ? "grants" : "grant"} the retired \`gateway_exec\` alias${formatJobNameList(names)}.`,
		"- Doctor will not convert this alias to `exec` because the stored name does not prove its original producer or approval restrictions.",
		"- Recreate the automation from a fresh authenticated creator turn, or explicitly reauthorize its complete tool cap from a trusted operator shell."
	].join("\n");
}
/** Advisory for legacy default caps that were captured before configured MCP was final. */
function formatIncompleteInheritedAuthorityAdvisory(names) {
	if (names.length === 0) return null;
	return [
		`${pluralize$1(names.length, "automation")} ${names.length === 1 ? "has" : "have"} an inherited default tool cap captured before final configured-MCP provenance was recorded${formatJobNameList(names)}.`,
		"- The stored finite cap remains unchanged; doctor will not silently widen or rewrite it.",
		"- If the job uses Codex configured MCP, reauthorize in place with an exact explicit list: `openclaw automations edit <id> --tools <tool,...>`."
	].join("\n");
}
/** Convert legacy cron issue counts into doctor preview lines. */
function formatLegacyIssuePreview(issues) {
	const lines = [];
	if (issues.jobId) lines.push(`- ${pluralize$1(issues.jobId, "job")} still uses legacy \`jobId\``);
	if (issues.missingId) lines.push(`- ${pluralize$1(issues.missingId, "job")} is missing a canonical string \`id\``);
	if (issues.nonStringId) lines.push(`- ${pluralize$1(issues.nonStringId, "job")} stores \`id\` as a non-string value`);
	if (issues.legacyScheduleString) lines.push(`- ${pluralize$1(issues.legacyScheduleString, "job")} stores schedule as a bare string`);
	if (issues.legacyScheduleCron) lines.push(`- ${pluralize$1(issues.legacyScheduleCron, "job")} still uses \`schedule.cron\``);
	if (issues.legacyScheduleKind) lines.push(`- ${pluralize$1(issues.legacyScheduleKind, "job")} stores a non-canonical schedule \`kind\` or stream \`mode\` that will be normalized`);
	if (issues.legacyPayloadKind) lines.push(`- ${pluralize$1(issues.legacyPayloadKind, "job")} needs payload kind normalization`);
	if (issues.legacyPayloadCodexModel) lines.push(`- ${pluralize$1(issues.legacyPayloadCodexModel, "job")} still uses legacy \`openai-codex/*\` cron model refs`);
	if (issues.legacyTaskSuggestionToolName) lines.push(`- ${pluralize$1(issues.legacyTaskSuggestionToolName, "job")} still grants legacy tool \`${TASK_SUGGESTION_TOOL_NAME_MIGRATION.legacyName}\`; doctor will rename it to \`${TASK_SUGGESTION_TOOL_NAME_MIGRATION.canonicalName}\``);
	if (issues.legacyImageInspectionToolName) lines.push(`- ${pluralize$1(issues.legacyImageInspectionToolName, "job")} still relies on legacy \`${IMAGE_INSPECTION_TOOL_NAME_MIGRATION.legacyName}\` coverage; doctor will preserve equivalent \`${IMAGE_INSPECTION_TOOL_NAME_MIGRATION.canonicalName}\` access`);
	if (issues.legacyAgentTurnCommandPayload) lines.push(`- ${pluralize$1(issues.legacyAgentTurnCommandPayload, "job")} uses an agent prompt to run a shell command`);
	if (issues.legacyPayloadProvider) lines.push(`- ${pluralize$1(issues.legacyPayloadProvider, "job")} still uses payload \`provider\` as a delivery alias`);
	if (issues.legacyTopLevelPayloadFields) lines.push(`- ${pluralize$1(issues.legacyTopLevelPayloadFields, "job")} still uses top-level payload fields`);
	if (issues.legacyTopLevelDeliveryFields) lines.push(`- ${pluralize$1(issues.legacyTopLevelDeliveryFields, "job")} still uses top-level delivery fields`);
	if (issues.legacyDeliveryMode) lines.push(`- ${pluralize$1(issues.legacyDeliveryMode, "job")} still uses delivery mode \`deliver\``);
	if (issues.migratedScheduledToolPolicy) lines.push(`- ${pluralize$1(issues.migratedScheduledToolPolicy, "job")} can recover scheduled account authority from persisted owner identity`);
	if (issues.reconciledOwnerAccount) lines.push(`- ${pluralize$1(issues.reconciledOwnerAccount, "job")} can reconcile its owner account from persisted creator identity without changing tool permissions`);
	if (issues.invalidSchedule) lines.push(`- ${pluralize$1(issues.invalidSchedule, "job")} has an invalid persisted schedule and will be removed`);
	if (issues.invalidPayload) lines.push(`- ${pluralize$1(issues.invalidPayload, "job")} has an invalid persisted payload and will be removed`);
	return lines;
}
function cronJobMigrationKey(job) {
	return normalizeOptionalStringifiedId(job.id) ?? normalizeOptionalStringifiedId(job.jobId) ?? resolveLegacyCronMigrationId(job);
}
/** Merge legacy JSON jobs into current jobs without duplicating matching ids/jobIds. */
function mergeLegacyCronJobs(params) {
	const merged = [...params.currentJobs];
	const currentKeys = new Set(params.currentJobs.map((job) => cronJobMigrationKey(job)).filter((key) => key !== void 0));
	let importedCount = 0;
	for (const legacyJob of params.legacyJobs) {
		const key = cronJobMigrationKey(legacyJob);
		if (key && currentKeys.has(key)) continue;
		if (key) currentKeys.add(key);
		merged.push(legacyJob);
		importedCount += 1;
	}
	return {
		jobs: merged,
		importedCount
	};
}
/** Attach runtime SQLite state columns back onto a config-defined cron job row. */
function mergeRuntimeEntryIntoConfigJob(params) {
	return {
		...params.job,
		...params.runtimeEntry?.updatedAtMs !== void 0 ? { updatedAtMs: params.runtimeEntry.updatedAtMs } : {},
		...params.runtimeEntry?.state ? { state: structuredClone(params.runtimeEntry.state) } : {}
	};
}
//#endregion
//#region src/commands/doctor/cron/schema-safety.ts
function assertCronStateSchemaSupported(env) {
	withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(() => void 0, { env });
}
async function assertCronStateSchemaSupportedAsync(env) {
	await withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(() => void 0, { env });
}
function rethrowSqliteSchemaVersionError(error) {
	if (isSqliteSchemaVersionError(error)) throw error;
}
//#endregion
//#region src/commands/doctor/cron/legacy-repair.ts
function pluralize(count, noun) {
	return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
function formatRunLogMigrationNote(importedFiles) {
	return importedFiles > 0 ? ` Imported ${pluralize(importedFiles, "legacy cron run log")} into SQLite.` : "";
}
function readLegacyCronStorePath(cfg) {
	return cfg.cron?.store;
}
function projectCronOwner(job, runtimeDefaultAgentId) {
	const explicitAgentId = normalizeOptionalString(job.agentId) ?? parseAgentSessionKey(normalizeOptionalString(job.sessionKey))?.agentId;
	if (explicitAgentId) return {
		kind: "explicit",
		agentId: explicitAgentId
	};
	return runtimeDefaultAgentId ? {
		kind: "runtime-default",
		agentId: runtimeDefaultAgentId
	} : { kind: "unresolved" };
}
async function loadLegacyCronRepairState(params) {
	const storePath = params.storePath ?? resolveCronJobsStorePath(readLegacyCronStorePath(params.cfg), params.env);
	const legacyStoreDetected = await legacyCronStoreFilesExist(storePath);
	const legacyRunLogDetected = await legacyCronRunLogFilesExist(storePath);
	const legacyQuarantine = await loadLegacyCronQuarantineForMigration(storePath);
	await assertCronStateSchemaSupportedAsync(params.env);
	if (params.onlyIfLegacyDetected && !legacyStoreDetected && !legacyRunLogDetected && !legacyQuarantine) return null;
	let persistedQuarantine;
	try {
		persistedQuarantine = loadCronQuarantinedJobs(storePath, params.env);
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		persistedQuarantine = [];
	}
	const loaded = params.readOnly ? await loadCronJobsStoreWithConfigJobsReadOnly(storePath, params.env) : await loadCronJobsStoreWithConfigJobs(storePath);
	const runtimeDefaultAgentId = tryResolveAmbientOwnerAgentId(params.cfg);
	const projectedOwnersByJobId = new Map(loaded.store.jobs.map((job) => [job.id, projectCronOwner(job, runtimeDefaultAgentId)]));
	const invalidConfigRows = [...loaded.invalidConfigRows];
	let rawJobs = loaded.configJobs.length > 0 ? loaded.configJobs.map((job, index) => mergeRuntimeEntryIntoConfigJob({
		job,
		runtimeEntry: loaded.configJobRuntimeEntries[index]
	})) : loaded.store.jobs;
	let legacyImportCount = 0;
	let legacyMigrationSource;
	let legacyMigrationAlreadyImported = false;
	if (legacyStoreDetected) {
		const loadedLegacy = await loadLegacyCronStoreForMigration(storePath);
		legacyMigrationSource = loadedLegacy.migrationSource;
		legacyMigrationAlreadyImported = legacyMigrationSource ? params.readOnly ? hasLegacyCronMigrationReceiptReadOnly(legacyMigrationSource) : hasLegacyCronMigrationReceipt(legacyMigrationSource) : false;
		if (!legacyMigrationAlreadyImported) {
			invalidConfigRows.push(...loadedLegacy.invalidConfigRows);
			const merged = mergeLegacyCronJobs({
				currentJobs: rawJobs,
				legacyJobs: loadedLegacy.store.jobs
			});
			rawJobs = merged.jobs;
			legacyImportCount = merged.importedCount;
		}
	}
	return {
		storePath,
		legacyStoreDetected,
		legacyRunLogDetected,
		legacyQuarantine,
		legacyMigrationSource,
		legacyMigrationAlreadyImported,
		legacyImportCount,
		invalidConfigRows,
		persistedQuarantine,
		projectedOwnersByJobId,
		rawJobs,
		jobsFingerprint: loaded.jobsFingerprint
	};
}
async function applyLegacyCronStoreRepair(params) {
	assertCronStateSchemaSupported();
	const { state } = params;
	const changes = [];
	const warnings = [];
	const resolveRetired = params.repairRetiredModelRefs === true ? createRetiredModelRefRepairResolver({
		cfg: params.cfg,
		checkModelPolicy: true,
		retiredModelRefConfig: params.retiredModelRefConfig,
		authProfileIdMap: params.authProfileIdMap,
		warnings
	}) : params.authProfileIdMap?.size ? ({ modelRef }) => repairModelRefAuthProfile(modelRef, params.authProfileIdMap) : void 0;
	const quarantineEntriesToRevalidate = params.recoverQuarantinedScheduleJobs === true ? [...state.persistedQuarantine, ...state.legacyQuarantine?.jobs ?? []] : [];
	const persistedQuarantineEntrySet = new Set(state.persistedQuarantine);
	const quarantineRecovery = recoverValidQuarantinedCronScheduleJobs(quarantineEntriesToRevalidate, new Set(state.rawJobs.map((job) => normalizeOptionalStringifiedId(job.id)).filter((id) => id !== void 0)));
	if (quarantineRecovery.recoveredJobs.length > 0) state.rawJobs.push(...quarantineRecovery.recoveredJobs);
	const runtimePolicyPlan = params.migrateCodexModelRefs === true ? planCronCodexRefRewriteAgainstPersistedConfig({
		cfg: params.cfg,
		targets: collectStoredCronCodexRuntimePolicyTargets(state.rawJobs),
		blockedModelIdentities: params.blockedModelIdentities,
		resolveFinalModelRef: resolveRetired
	}) : void 0;
	warnings.push(...runtimePolicyPlan?.warnings ?? []);
	const blockedRuntimePolicyTargets = new Set((runtimePolicyPlan?.blockedTargets ?? []).map(cronCodexRuntimePolicyTargetKey));
	const normalized = params.normalized && quarantineRecovery.recoveredJobs.length === 0 ? params.normalized : normalizeStoredCronJobs(state.rawJobs, {
		migrateCodexModelRefs: params.migrateCodexModelRefs,
		shouldMigrateCodexRuntimePolicyTarget: (target) => !blockedRuntimePolicyTargets.has(cronCodexRuntimePolicyTargetKey(target))
	});
	warnings.push(...normalized.unsupportedLegacyTriggerScriptJobs.map((job) => `Cron trigger script for ${job} uses legacy Code Mode APIs that cannot be safely converted; inspect the automation and update its trigger script manually to use direct tool calls.`));
	const legacyWebhook = normalizeOptionalString(params.cfg.cron?.webhook);
	const notifyMigration = migrateLegacyNotifyFallback({
		jobs: state.rawJobs,
		legacyWebhook
	});
	const dreamingMigration = migrateLegacyDreamingPayloadShape(state.rawJobs);
	warnings.push(...notifyMigration.warnings);
	const retirementChanges = [];
	if (resolveRetired) for (const job of state.rawJobs) {
		const payload = asOptionalRecord(job.payload);
		const jobId = normalizeOptionalStringifiedId(job.id);
		if (!payload || !jobId) continue;
		const projectedOwner = state.projectedOwnersByJobId.get(jobId);
		const agentId = normalizeOptionalString(job.agentId) ?? (projectedOwner && projectedOwner.kind !== "unresolved" ? projectedOwner.agentId : tryResolveAmbientOwnerAgentId(params.cfg));
		if (!agentId && params.repairRetiredModelRefs) warnings.push(`Skipped retired model repair for cron job "${jobId}": select its owning agent, then rerun openclaw doctor --fix.`);
		const beforeChanges = retirementChanges.length;
		repairRetiredModelSlots({
			owner: payload,
			path: `cron.${jobId}.payload`,
			agentId,
			authProfileOnly: !agentId,
			resolve: resolveRetired,
			changes: retirementChanges
		});
		if (retirementChanges.length > beforeChanges && asOptionalRecord(job.state)?.autoDisabled) {
			const jobName = normalizeOptionalString(job.name) ?? jobId;
			retirementChanges.push(`Automation "${jobName}" remains auto-disabled. Run openclaw automations enable ${jobId} to resume it after this repair.`);
		}
	}
	const storeChanged = retirementChanges.length > 0 || state.legacyStoreDetected && !state.legacyMigrationAlreadyImported || state.invalidConfigRows.length > 0 || normalized.mutated || notifyMigration.changed || dreamingMigration.changed || quarantineRecovery.recoveredJobs.length > 0;
	if (!(state.legacyStoreDetected || state.legacyRunLogDetected || state.legacyQuarantine !== void 0 || storeChanged) && warnings.length === 0) return {
		changes,
		warnings
	};
	const quarantineEntries = [
		...params.recoverQuarantinedScheduleJobs === true ? quarantineRecovery.retainedEntries.filter((entry) => !persistedQuarantineEntrySet.has(entry)) : state.legacyQuarantine?.jobs ?? [],
		...state.invalidConfigRows,
		...normalized.removedJobs.map((entry) => ({
			sourceIndex: entry.sourceIndex,
			reason: entry.reason,
			job: entry.job
		}))
	];
	const quarantine = quarantineEntries.length > 0 ? {
		entries: quarantineEntries,
		nowMs: Date.now()
	} : void 0;
	const deleteQuarantineEntries = quarantineRecovery.recoveredEntries.filter((entry) => persistedQuarantineEntrySet.has(entry));
	if (storeChanged || quarantine) try {
		if (storeChanged) {
			const store = {
				version: 1,
				jobs: state.rawJobs
			};
			const migrationSource = state.legacyMigrationSource;
			const assertSnapshotCurrent = (db) => {
				if (state.jobsFingerprint !== void 0) assertCronJobsStoreUnchanged(db, state.storePath, state.jobsFingerprint);
			};
			if (migrationSource && !state.legacyMigrationAlreadyImported) {
				await assertLegacyCronMigrationSourceCurrent(migrationSource);
				await saveCronJobsStoreWithMetadata(state.storePath, store, (db) => {
					assertSnapshotCurrent(db);
					return acquireLegacyCronMigrationReceipt(db, migrationSource);
				}, {
					...quarantine ? { quarantine } : {},
					...deleteQuarantineEntries.length > 0 ? { deleteQuarantineEntries } : {},
					preserveRuntimeState: true
				});
			} else await saveCronJobsStore(state.storePath, store, {
				...quarantine ? { quarantine } : {},
				...deleteQuarantineEntries.length > 0 ? { deleteQuarantineEntries } : {},
				preserveRuntimeState: true,
				transactionHooks: { beforeWrite: assertSnapshotCurrent }
			});
		} else if (quarantine) saveCronQuarantinedJobs({
			storePath: state.storePath,
			...quarantine
		});
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		const failure = err instanceof CronJobsStoreChangedError ? `Cron store at ${shortenHomePath(state.storePath)} changed while doctor was waiting, so no rows were rewritten; re-run ${formatCliCommand("openclaw doctor --fix")} to repair from a fresh snapshot.` : `Failed writing migrated cron store at ${shortenHomePath(state.storePath)}: ${formatErrorMessage(err)}`;
		return {
			changes,
			warnings: [...warnings, failure]
		};
	}
	changes.push(...retirementChanges);
	if (normalized.issues.reconciledOwnerAccount) changes.push(`Reconciled ${pluralize(normalized.issues.reconciledOwnerAccount, "cron job owner account")} from persisted creator identity; existing tool permissions were preserved.`);
	if (quarantineRecovery.recoveredJobs.length > 0) changes.push(`Recovered ${pluralize(quarantineRecovery.recoveredJobs.length, "quarantined automation")} after current schedule validation passed.`);
	if (state.legacyQuarantine) {
		const archiveResult = await archiveLegacyCronQuarantineForMigration(state.legacyQuarantine);
		if (archiveResult.ok) changes.push(`Cron quarantine migrated to SQLite from ${shortenHomePath(state.legacyQuarantine.path)}.`);
		else warnings.push(`Migrated quarantined automations to SQLite but could not archive the legacy cron file at ${shortenHomePath(state.legacyQuarantine.path)}: ${archiveResult.reason}. Remove it manually or rerun ${formatCliCommand("openclaw doctor --fix")} to retry.`);
	}
	let importedRunLogs = 0;
	if (state.legacyRunLogDetected) try {
		importedRunLogs = (await migrateLegacyCronRunLogsToSqlite(state.storePath)).importedFiles;
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		warnings.push(`Failed importing legacy cron run logs at ${shortenHomePath(state.storePath)}: ${formatErrorMessage(err)}`);
	}
	if (state.legacyStoreDetected) {
		const archiveResult = await archiveLegacyCronStoreForMigration(state.storePath, state.legacyMigrationSource);
		if (archiveResult.ok) {
			if (state.legacyMigrationSource) try {
				markLegacyMigrationSourceRemoved(state.legacyMigrationSource.sourceKey, process.env);
			} catch (err) {
				rethrowSqliteSchemaVersionError(err);
				warnings.push(`Cron store was archived, but its migration receipt could not be finalized: ${formatErrorMessage(err)}`);
			}
			changes.push(`Cron store migrated to SQLite at ${shortenHomePath(state.storePath)}.${formatRunLogMigrationNote(importedRunLogs)}`);
		} else for (const failure of archiveResult.failures) warnings.push(`Migrated automations to SQLite but could not archive the legacy cron file at ${shortenHomePath(failure.path)}: ${failure.reason}. Remove it manually or rerun ${formatCliCommand("openclaw doctor --fix")} to retry.`);
	} else if (state.legacyRunLogDetected && importedRunLogs > 0) changes.push(`Cron run logs migrated to SQLite at ${shortenHomePath(state.storePath)}.${formatRunLogMigrationNote(importedRunLogs)}`);
	else if (storeChanged) changes.push(`Cron store normalized at ${shortenHomePath(state.storePath)}.`);
	if (dreamingMigration.rewrittenCount > 0) changes.push(`Rewrote ${pluralize(dreamingMigration.rewrittenCount, "managed dreaming job")} to run as an isolated agent turn so dreaming no longer requires heartbeat.`);
	if (normalized.legacyTriggerScriptJobs.length > 0) changes.push(`Rewrote ${pluralize(normalized.legacyTriggerScriptJobs.length, "legacy cron trigger script")} to canonical direct tool calls: ${normalized.legacyTriggerScriptJobs.join(", ")}.`);
	return {
		changes,
		warnings,
		codexRuntimePolicyTargets: normalized.codexRuntimePolicyTargets
	};
}
async function repairLegacyCronStoreWithoutPrompt(params) {
	const storePath = resolveCronJobsStorePath(normalizeOptionalString(readLegacyCronStorePath(params.cfg)));
	let state;
	try {
		state = await loadLegacyCronRepairState({
			cfg: params.cfg,
			onlyIfLegacyDetected: true
		});
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		return {
			changes: [],
			warnings: [`Failed reading legacy cron storage at ${shortenHomePath(storePath)}: ${formatErrorMessage(err)}`]
		};
	}
	if (!state) return {
		changes: [],
		warnings: []
	};
	return await applyLegacyCronStoreRepair({
		...params,
		state
	});
}
/** Read legacy Codex cron targets without changing either cron storage or config. */
async function collectCronCodexRuntimePolicyTargetsReadOnly(params) {
	const storePath = resolveCronJobsStorePath(normalizeOptionalString(readLegacyCronStorePath(params.cfg)));
	try {
		const state = await loadLegacyCronRepairState({
			cfg: params.cfg,
			readOnly: true
		});
		return {
			targets: state ? collectStoredCronCodexRuntimePolicyTargets(state.rawJobs) : [],
			warnings: []
		};
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		return {
			targets: [],
			warnings: [`Failed reading cron storage at ${shortenHomePath(storePath)} while planning Codex model migration: ${formatErrorMessage(err)}`]
		};
	}
}
/** Commit Codex cron refs only after their model-scoped config policy is durable. */
async function repairCronCodexModelRefsAfterConfigWrite(params) {
	const storePath = resolveCronJobsStorePath(normalizeOptionalString(readLegacyCronStorePath(params.cfg)));
	try {
		if (!params.migrateCodexModelRefs && !params.repairRetiredModelRefs) {
			const loaded = await loadCronJobsStoreWithConfigJobsReadOnly(storePath);
			const { store } = loaded;
			const repaired = structuredClone(store);
			const changes = [];
			for (const [index, job] of repaired.jobs.entries()) {
				const { runtimeAuthority: _embeddedAuthority, runtimeAuthorityRecoveryRequired: _embeddedRecovery, ...config } = loaded.configJobs[index];
				const candidate = Object.assign(structuredClone(job), mergeRuntimeEntryIntoConfigJob({
					job: structuredClone(config),
					runtimeEntry: loaded.configJobRuntimeEntries[index]
				}));
				const before = changes.length;
				repairRetiredModelSlots({
					owner: candidate.payload,
					path: `cron.${job.id}.payload`,
					authProfileOnly: true,
					resolve: ({ modelRef }) => repairModelRefAuthProfile(modelRef, params.authProfileIdMap),
					changes
				});
				if (changes.length > before) repaired.jobs[index] = candidate;
			}
			await saveCronJobsStoreChanges(storePath, store, repaired);
			return {
				changes,
				warnings: []
			};
		}
		const state = await loadLegacyCronRepairState({ cfg: params.cfg });
		return state ? await applyLegacyCronStoreRepair({
			cfg: params.cfg,
			retiredModelRefConfig: params.retiredModelRefConfig,
			authProfileIdMap: params.authProfileIdMap,
			state,
			migrateCodexModelRefs: params.migrateCodexModelRefs,
			repairRetiredModelRefs: params.repairRetiredModelRefs,
			blockedModelIdentities: params.blockedModelIdentities
		}) : {
			changes: [],
			warnings: []
		};
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		return {
			changes: [],
			warnings: [`Failed reading cron storage at ${shortenHomePath(storePath)} while committing Codex model migration: ${formatErrorMessage(err)}`]
		};
	}
}
//#endregion
export { repairLegacyCronStoreWithoutPrompt as a, formatLegacyGatewayExecAdvisory as c, formatUnresolvedCommandPromptAdvisory as d, formatUnresolvedShellPromptAdvisory as f, repairCronCodexModelRefsAfterConfigWrite as i, formatLegacyIssuePreview as l, collectCronCodexRuntimePolicyTargetsReadOnly as n, rethrowSqliteSchemaVersionError as o, countStaleDreamingJobs as p, loadLegacyCronRepairState as r, formatIncompleteInheritedAuthorityAdvisory as s, applyLegacyCronStoreRepair as t, formatScheduledToolPolicyAdvisory as u };
