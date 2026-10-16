import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { t as SessionPendingInputCustodyError } from "./session-pending-input-custody-error-fcZzzQWk.mjs";
import { M as ensureSessionPendingInputsSchema, j as ensureSessionInputCompletionsSchema } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { b as writeSessionInputCompletion, d as readSessionPendingInputByKey, o as isFinalInputCompletion, s as parseSessionPendingInputMessage, u as readSessionInputCompletion } from "./session-accessor.sqlite-pending-inputs-DtDOOibA.mjs";
import { c as readTranscriptMessageByScopedIdempotencyKey } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import "./server-constants-BH_EolwD.mjs";
import { t as readPendingInputSourceInDatabase } from "./session-pending-input-source.kernel-BRhT6SW-.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-pending-input-operations.kernel.ts
function readPendingInputStage(database, input) {
	if (readSessionEntryRow(database, input.sessionKey)?.entry.sessionId !== input.sessionId) return {
		kind: "stage",
		current: false
	};
	const existing = readSessionPendingInputByKey(database, input, input.idempotencyKey);
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
	return input.kind === "stage" ? readPendingInputStage(database, input) : readPendingInputSourceInDatabase(database, input);
}
/** Incognito uses this same kernel in its process-held owner until the actor cutover. */
function mutatePendingInput(input, { writeTransaction, admit }, publish) {
	return writeTransaction(`session.pending-input.${input.kind}`, "Pending input", (current) => {
		const row = readSessionPendingInputByKey(current, input, input.idempotencyKey);
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
			receipt
		};
		if (input.kind !== "finish") {
			if (readSessionEntryRow(current, input.sessionKey)?.entry.sessionId !== input.sessionId) throw new SessionPendingInputCustodyError("Pending input no longer owns the admitted session");
		}
		if (input.kind === "stage") {
			const snapshot = readPendingInputStage(current, {
				...input,
				kind: "stage"
			});
			if (!isDeepStrictEqual(snapshot, input.expected)) throw new SessionPendingInputCustodyError("Pending input changed before staging committed");
		} else if (row && (row.run_id !== input.runId || row.request_hash !== input.requestHash || row.lifecycle_generation !== input.lifecycleGeneration || input.kind === "finish" && row.input_id !== input.inputId)) throw new SessionPendingInputCustodyError("Pending input settlement lost its accepted owner");
		admit("transaction", grant);
		const schema = getAdmittedSqliteSchemaFacts(current.db);
		if (input.kind === "stage") {
			if (!schema?.tables.has("session_pending_inputs")) ensureSessionPendingInputsSchema(current.db);
			if (input.trackCompletion && !schema?.tables.has("session_input_completions")) ensureSessionInputCompletionsSchema(current.db);
			if (row) executeSqliteQuerySync(current.db, getSessionKysely(current.db).updateTable("session_pending_inputs").set({
				state: "queued",
				lifecycle_generation: input.lifecycleGeneration
			}).where("input_id", "=", row.input_id));
			else executeSqliteQuerySync(current.db, getSessionKysely(current.db).insertInto("session_pending_inputs").values({
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
			}));
		} else if (input.kind === "complete") {
			if (!schema?.tables.has("session_input_completions")) ensureSessionInputCompletionsSchema(current.db);
			const previous = readSessionInputCompletion(current, input);
			if (previous && (previous.run_id !== input.runId || previous.request_hash !== input.requestHash)) throw new SessionPendingInputCustodyError("Input completion conflicts with the accepted input");
			receipt.outcome = writeSessionInputCompletion(current, input, input.outcome);
		} else if (row) executeSqliteQuerySync(current.db, getSessionKysely(current.db).updateTable("session_pending_inputs").set({ state: input.disposition }).where("input_id", "=", input.inputId).where("state", "=", "queued").where("consumed_event_id", "is", null));
		publish(current.db, receipt);
		admit("commit", grant);
		return receipt;
	});
}
//#endregion
export { mutatePendingInput, readPendingInput };
