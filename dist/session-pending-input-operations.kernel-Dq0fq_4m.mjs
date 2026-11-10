import { G as sqliteSessionIdWriteScope, U as withSqliteDatabaseWriteScope, W as withoutSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { m as SessionPendingInputCustodyError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { N as ensureSessionInputCompletionsSchema, P as ensureSessionPendingInputsSchema } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./payload-limits-ChDi8AHf.mjs";
import { r as parseSessionPendingInputMessage, t as isFinalInputCompletion } from "./session-pending-input-value-CPY0B7Hg.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { o as writableSessionActorMap, r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { f as readSessionEntryIdentity, p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { c as readSessionInputCompletion, l as readSessionPendingInputByKey, v as writeSessionInputCompletion } from "./session-accessor.sqlite-pending-inputs-dFWJwbQM.mjs";
import { a as readTranscriptMessageByScopedIdempotencyKey } from "./session-accessor.sqlite-transcript-identity-BbaLin80.mjs";
import { n as readSessionPendingInputAuthorityFactsInTransaction } from "./session-pending-input-authority.kernel-Cz8X54WZ.mjs";
import { t as readPendingInputSourceInDatabase } from "./session-pending-input-source.kernel-BgAZxt-5.mjs";
//#region src/config/sessions/session-pending-input-operations.kernel.ts
function readPendingInputStage(database, input, existing) {
	const previous = input.trackCompletion && getAdmittedSqliteSchemaFacts(database.db)?.tables.has("session_input_completions") ? readSessionInputCompletion(database, input) : void 0;
	const committed = existing?.consumed_event_id != null || previous && isFinalInputCompletion(previous.outcome) ? void 0 : readTranscriptMessageByScopedIdempotencyKey(database, {
		...input,
		agentId: database.agentId,
		path: database.path
	}, input.idempotencyKey, "scan");
	const messageJson = committed ? JSON.stringify(committed.message) : void 0;
	if (existing && Buffer.byteLength(existing.message_json, "utf8") > 26214400 || messageJson && Buffer.byteLength(messageJson, "utf8") > 26214400) throw new Error("Pending input exceeds the Gateway payload limit");
	return {
		kind: "stage",
		current: true,
		existing: existing ? { ...existing } : void 0,
		previous,
		committed: committed && messageJson ? {
			messageId: committed.messageId,
			message: parseSessionPendingInputMessage(messageJson)
		} : void 0
	};
}
function readPendingInput(database, input) {
	if (input.kind === "source") return readPendingInputSourceInDatabase(database, input);
	if (readSessionEntryIdentity(database, input.sessionKey)?.sessionId !== input.sessionId) return {
		kind: "stage",
		current: false
	};
	return readPendingInputStage(database, input, readSessionPendingInputByKey(database, input, input.idempotencyKey));
}
function mutatePendingInput(input, { writeTransaction, admit }, publish) {
	return writeTransaction(`session.pending-input.${input.kind}`, "Pending input", (current) => withSqliteDatabaseWriteScope(current.db, [input.sessionKey, sqliteSessionIdWriteScope(input.sessionId)], () => {
		const actor = readSessionActorTransactionState(current, input);
		const row = readSessionPendingInputByKey(current, input, input.idempotencyKey);
		const entry = input.kind === "finish" ? void 0 : input.authorityAgentId ? readSessionEntryRow(current, input.sessionKey, "list")?.entry : readSessionEntryIdentity(current, input.sessionKey);
		const receipt = {
			kind: "pending-input-settlement",
			operation: input.kind,
			sessionKey: input.sessionKey,
			sessionId: input.sessionId,
			idempotencyKey: input.idempotencyKey,
			runId: input.runId,
			requestHash: input.requestHash,
			lifecycleGeneration: input.lifecycleGeneration
		};
		const grant = {
			kind: "pending-input-settlement-custody",
			candidate: row,
			receipt,
			...input.kind !== "finish" && input.authorityAgentId ? { authority: readSessionPendingInputAuthorityFactsInTransaction(current, input.sessionKey, input.authorityAgentId, /* @__PURE__ */ new Map([[input.sessionKey, entry]])) } : {}
		};
		if (input.kind !== "finish") {
			if (entry?.sessionId !== input.sessionId) throw new SessionPendingInputCustodyError("Pending input no longer owns the admitted session");
		}
		if (input.kind === "stage") {
			if (row?.input_id !== input.expected.existing?.input_id) throw new SessionPendingInputCustodyError("Pending input changed before staging committed");
		} else if (row && (row.run_id !== input.runId || row.request_hash !== input.requestHash || row.lifecycle_generation !== input.lifecycleGeneration || input.kind === "finish" && row.input_id !== input.inputId)) throw new SessionPendingInputCustodyError("Pending input settlement lost its accepted owner");
		withoutSqliteDatabaseWriteScope(current.db, () => admit("transaction", grant));
		const schema = getAdmittedSqliteSchemaFacts(current.db);
		if (input.kind === "stage") {
			if (!schema?.tables.has("session_pending_inputs")) ensureSessionPendingInputsSchema(current.db);
			if (input.trackCompletion && !schema?.tables.has("session_input_completions")) ensureSessionInputCompletionsSchema(current.db);
			if (row) receipt.stagedInput = executeSqliteQueryTakeFirstSync(current.db, getSessionKysely(current.db).updateTable("session_pending_inputs").set({
				state: "queued",
				lifecycle_generation: input.lifecycleGeneration
			}).where("input_id", "=", row.input_id).returningAll());
			else receipt.stagedInput = executeSqliteQueryTakeFirstSync(current.db, getSessionKysely(current.db).insertInto("session_pending_inputs").values({
				input_id: input.inputId,
				session_key: input.sessionKey,
				session_id: input.sessionId,
				idempotency_key: input.idempotencyKey,
				run_id: input.runId,
				request_hash: input.requestHash,
				message_json: input.messageJson,
				lifecycle_generation: input.lifecycleGeneration,
				state: "queued",
				accepted_at: Date.now()
			}).returningAll());
			if (!receipt.stagedInput) throw new SessionPendingInputCustodyError("Pending input staging omitted its postimage");
			if (actor && receipt.stagedInput.consumed_event_id === null) {
				actor.pendingInputs = writableSessionActorMap(actor.pendingInputs);
				actor.pendingInputs.set(input.idempotencyKey, receipt.stagedInput);
			}
		} else if (input.kind === "complete") {
			if (!schema?.tables.has("session_input_completions")) ensureSessionInputCompletionsSchema(current.db);
			receipt.outcome = writeSessionInputCompletion(current, input, input.outcome);
		} else if (row) {
			const result = executeSqliteQuerySync(current.db, getSessionKysely(current.db).updateTable("session_pending_inputs").set({ state: input.disposition }).where("input_id", "=", input.inputId).where("state", "=", "queued").where("consumed_event_id", "is", null));
			if (input.disposition === "cancelled" && result.numAffectedRows === 1n) receipt.withdrawnInputId = input.inputId;
			if (result.numAffectedRows === 1n && actor) {
				actor.pendingInputs = writableSessionActorMap(actor.pendingInputs);
				actor.pendingInputs.set(input.idempotencyKey, {
					...row,
					state: input.disposition
				});
			}
		}
		withoutSqliteDatabaseWriteScope(current.db, () => {
			publish(current.db, receipt);
			admit("commit", grant);
		});
		return receipt;
	}));
}
//#endregion
export { readPendingInput as n, mutatePendingInput as t };
