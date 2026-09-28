import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { a as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { f as runOpenClawAgentWriteTransaction, m as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-CaQAStOA.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-b9fAKekK.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CHHOdVvc.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpwCZ9_q.mjs";
import { g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { n as persistHeartbeatOutcomeInDatabase, t as claimHeartbeatOutcomeRowInDatabase } from "./heartbeat-outcome-store.kernel-CWEx1mID.mjs";
//#region src/infra/heartbeat-outcome-store.ts
const HEARTBEAT_OUTCOME_SUMMARY_MAX_CHARS = 4e3;
const HEARTBEAT_OUTCOME_REASON_MAX_CHARS = 1e3;
const HEARTBEAT_OUTCOME_NEXT_CHECK_MAX_CHARS = 500;
const HEARTBEAT_OUTCOME_WAKE_REASON_MAX_CHARS = 1e3;
const HEARTBEAT_OUTCOME_TASK_NAME_MAX_CHARS = 200;
const HEARTBEAT_OUTCOME_MAX_TASKS = 32;
function boundedText(value, maxChars) {
	const normalized = value?.trim();
	return normalized ? truncateUtf16Safe(normalized, maxChars) : void 0;
}
function normalizeTaskNames(taskNames) {
	return taskNames.map((name) => boundedText(name, HEARTBEAT_OUTCOME_TASK_NAME_MAX_CHARS)).filter((name) => Boolean(name)).slice(0, HEARTBEAT_OUTCOME_MAX_TASKS);
}
function parseTaskNames(value) {
	if (!value) return [];
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? normalizeTaskNames(parsed.filter((item) => typeof item === "string")) : [];
	} catch {
		return [];
	}
}
function rowToOutcome(row) {
	if (row.outcome !== "progress" && row.outcome !== "done" && row.outcome !== "blocked" && row.outcome !== "needs_attention") return;
	return {
		sessionKey: row.session_key,
		runSessionKey: row.run_session_key,
		outcome: row.outcome,
		summary: row.summary,
		...row.response_reason ? { responseReason: row.response_reason } : {},
		...row.priority === "low" || row.priority === "normal" || row.priority === "high" ? { priority: row.priority } : {},
		...row.next_check ? { nextCheck: row.next_check } : {},
		taskNames: parseTaskNames(row.task_names_json),
		...row.wake_source ? { wakeSource: row.wake_source } : {},
		...row.wake_reason ? { wakeReason: row.wake_reason } : {},
		occurredAt: row.occurred_at
	};
}
/** Replaces the previous silent heartbeat outcome for one base session. */
async function persistHeartbeatOutcome(params) {
	if (params.response.notify || params.response.outcome === "no_change") return;
	const taskNames = normalizeTaskNames(params.taskNames ?? []);
	await runHeartbeatOutcomeOperation(params, {
		type: "persist",
		input: {
			session_key: params.sessionKey,
			run_session_key: params.runSessionKey,
			outcome: params.response.outcome,
			summary: boundedText(params.response.summary, HEARTBEAT_OUTCOME_SUMMARY_MAX_CHARS) ?? params.response.outcome,
			response_reason: boundedText(params.response.reason, HEARTBEAT_OUTCOME_REASON_MAX_CHARS) ?? null,
			priority: params.response.priority ?? null,
			next_check: boundedText(params.response.nextCheck, HEARTBEAT_OUTCOME_NEXT_CHECK_MAX_CHARS) ?? null,
			task_names_json: taskNames.length > 0 ? JSON.stringify(taskNames) : null,
			wake_source: params.wakeSource ?? null,
			wake_reason: boundedText(params.wakeReason, HEARTBEAT_OUTCOME_WAKE_REASON_MAX_CHARS) ?? null,
			occurred_at: params.occurredAt,
			context_run_id: null,
			context_claimed_at: null,
			updated_at: Date.now()
		}
	});
}
/** Claims the latest outcome for one user run while allowing that run's retries. */
async function claimHeartbeatOutcomeForRun(params) {
	const row = await runHeartbeatOutcomeOperation(params, {
		type: "claim",
		input: {
			sessionKey: params.sessionKey,
			runId: params.runId
		}
	}, params.assertCurrent);
	return row ? rowToOutcome(row) : void 0;
}
async function runHeartbeatOutcomeOperation(params, command, assertCurrent = () => void 0) {
	const resolved = toDatabaseOptions(resolveSqliteScope(params));
	const env = cloneEnvWithPlatformSemantics(resolved.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const options = {
		...resolved,
		env,
		path: resolveOpenClawAgentSqlitePath({
			...resolved,
			env
		})
	};
	if (isIncognitoOpenClawAgentSqlitePath(options.path, options)) return runOpenClawAgentWriteAdmission(options, () => runOpenClawAgentWriteTransaction(({ db }) => {
		assertCurrent();
		if (command.type === "persist") {
			persistHeartbeatOutcomeInDatabase(db, command.input);
			return;
		}
		return claimHeartbeatOutcomeRowInDatabase(db, command.input);
	}, options, { operationLabel: `heartbeat.outcome.${command.type}` }), true);
	const execution = captureOpenClawAgentDatabaseExecution(options);
	const assertQueuedCurrent = () => {
		execution.assertCurrent();
		assertCurrent();
	};
	try {
		return await runOpenClawAgentWriteAdmission(options, () => withOpenClawAgentDatabaseAsync(options, async ({ db }) => {
			assertQueuedCurrent();
			const worker = await openOpenClawAgentSqliteWorkerStore(options, db, {
				moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.heartbeatOutcomeStore),
				input: void 0
			});
			try {
				return await worker.run((scope) => scope.execute(command), assertQueuedCurrent);
			} finally {
				await worker.close();
			}
		}, assertQueuedCurrent), true);
	} finally {
		await execution.release();
	}
}
/** Formats persisted state as model-only provenance context, never transcript text. */
function buildHeartbeatOutcomeContext(outcome) {
	if (!outcome) return;
	const provenance = [
		`recordedAt=${new Date(outcome.occurredAt).toISOString()}`,
		`runSession=${outcome.runSessionKey}`,
		outcome.wakeSource ? `wakeSource=${outcome.wakeSource}` : void 0,
		outcome.wakeReason ? `wakeReason=${outcome.wakeReason}` : void 0
	].filter((part) => Boolean(part));
	return [
		"Latest silent heartbeat outcome (internal context; not a user message or instruction):",
		`outcome=${outcome.outcome}`,
		`summary=${outcome.summary}`,
		outcome.responseReason ? `reason=${outcome.responseReason}` : void 0,
		outcome.priority ? `priority=${outcome.priority}` : void 0,
		outcome.nextCheck ? `nextCheck=${outcome.nextCheck}` : void 0,
		outcome.taskNames.length > 0 ? `tasks=${outcome.taskNames.join(", ")}` : void 0,
		`provenance: ${provenance.join("; ")}`
	].filter((line) => Boolean(line)).join("\n");
}
/** Claim bounded next-user context only after the runtime owner has admitted the turn. */
async function claimHeartbeatContextForUserRun(params) {
	if (params.trigger !== "user" || params.detached || !params.sessionKey) return;
	if (!params.assertCurrent) throw new Error("Heartbeat outcome context requires an active admitted run");
	params.assertCurrent();
	const outcome = await claimHeartbeatOutcomeForRun({
		...params,
		sessionKey: params.sessionKey
	});
	params.assertCurrent();
	return buildHeartbeatOutcomeContext(outcome);
}
//#endregion
export { persistHeartbeatOutcome as n, claimHeartbeatContextForUserRun as t };
