import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { n as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
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
	const parsed = safeParseJson(value ?? "");
	return Array.isArray(parsed) ? normalizeTaskNames(parsed.filter((item) => typeof item === "string")) : [];
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
	const { assertCurrent } = params;
	const row = await runHeartbeatOutcomeOperation(params, {
		type: "claim",
		input: {
			sessionKey: params.sessionKey,
			runId: params.runId
		}
	}, assertCurrent);
	return row ? rowToOutcome(row) : void 0;
}
async function runHeartbeatOutcomeOperation(params, command, assertCurrent = () => void 0) {
	const authority = {
		assertCurrent,
		authorize() {}
	};
	if (captureSessionActorStorageOwner(params, authority)) return withSessionActorStorage(params, {
		authority,
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		}
	}, async ({ actor, authority: selectedAuthority }) => {
		const result = command.type === "persist" ? await actor.storage.mutate({
			type: "session.heartbeat.persist",
			input: command.input
		}, selectedAuthority) : await actor.storage.mutate({
			type: "session.heartbeat.claim",
			input: command.input
		}, selectedAuthority);
		return readSessionActorStorageResult(result);
	});
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
	const execution = captureOpenClawAgentDatabaseExecution(options);
	const assertQueuedCurrent = () => {
		execution.assertCurrent();
		assertCurrent();
	};
	try {
		return await runOpenClawAgentWriteAdmission(options, async () => {
			const worker = await openOpenClawAgentSqliteWorkerStore(options, { execution }, {
				moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.heartbeatOutcomeStore),
				input: void 0
			});
			try {
				return (await worker.executeExisting(command, assertQueuedCurrent))?.value;
			} finally {
				await worker.close();
			}
		}, true);
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
	const { assertCurrent } = params;
	if (!assertCurrent) throw new Error("Heartbeat outcome context requires an active admitted run");
	assertCurrent();
	const outcome = await claimHeartbeatOutcomeForRun({
		...params,
		sessionKey: params.sessionKey
	});
	assertCurrent();
	return buildHeartbeatOutcomeContext(outcome);
}
//#endregion
export { persistHeartbeatOutcome as n, claimHeartbeatContextForUserRun as t };
