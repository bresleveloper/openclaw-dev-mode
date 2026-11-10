import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { i as ensureOpenClawAgentProgressCardSchemaInTransaction } from "./openclaw-agent-progress-card-schema-CCXTSC64.mjs";
import { t as normalizeProgressCardWrite } from "./progress-card-values-db2Uu3Dz.mjs";
//#region src/session-cards/progress-card-store.ts
function selectProgressCard(db, sessionKey) {
	const kysely = getNodeSqliteKysely(db);
	return executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_progress_cards").select([
		"session_key",
		"markdown",
		"steps_json",
		"revision",
		"created_at",
		"updated_at"
	]).where("session_key", "=", sessionKey).limit(1)) ?? null;
}
function clearProgressCardInTransaction(db, sessionKey, expectedRevision) {
	const query = getNodeSqliteKysely(db).updateTable("session_progress_cards").set((eb) => ({
		markdown: null,
		steps_json: null,
		revision: eb("revision", "+", 1),
		updated_at: Date.now()
	})).where("session_key", "=", sessionKey);
	return executeSqliteQueryTakeFirstSync(db, (expectedRevision === void 0 ? query : query.where("revision", "=", expectedRevision).where((eb) => eb.or([eb("markdown", "is not", null), eb("steps_json", "is not", null)]))).returning(["revision", "created_at"])) !== void 0;
}
function rowToProgressCard(row) {
	const steps = row.steps_json ? readStoredSteps(row.steps_json) : void 0;
	if (!row.markdown && !steps?.length) return null;
	return {
		sessionKey: row.session_key,
		revision: row.revision,
		updatedAt: row.updated_at,
		...row.markdown ? { markdown: row.markdown } : {},
		...steps && steps.length > 0 ? { steps } : {}
	};
}
function readStoredSteps(value) {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed)) throw new Error("stored progress-card steps are not an array");
	return parsed.map((entry, index) => {
		const record = asOptionalObjectRecord(entry);
		if (!record) throw new Error(`stored progress-card step ${index} is invalid`);
		const { step, status } = record;
		if (typeof step !== "string" || status !== "pending" && status !== "in_progress" && status !== "completed") throw new Error(`stored progress-card step ${index} is invalid`);
		return {
			step,
			status
		};
	});
}
function readSessionProgressCard(db, sessionKey) {
	if (!tableExists(db, "session_progress_cards")) return null;
	const row = selectProgressCard(db, sessionKey);
	return row ? rowToProgressCard(row) : null;
}
/** Retain revision tombstones, but keep never-used lazy storage dormant during reset. */
function clearSessionProgressCardForReset(db, sessionKey) {
	if (!tableExists(db, "session_progress_cards")) return false;
	return db.isTransaction ? clearProgressCardInTransaction(db, sessionKey) : runSqliteImmediateTransactionSync(db, () => clearProgressCardInTransaction(db, sessionKey), { operationLabel: "progress-card.reset" });
}
function prepareSessionProgressCardWrite(input) {
	const { markdown, steps } = normalizeProgressCardWrite(input);
	return {
		markdown,
		steps,
		stepsJson: steps ? JSON.stringify(steps) : null,
		expectedRevision: input.expectedRevision
	};
}
/** The progress-card worker owns writes; native lifecycle reset uses the separate clearer. */
function writePreparedSessionProgressCard(db, sessionKey, input) {
	const write = () => {
		ensureOpenClawAgentProgressCardSchemaInTransaction(db);
		const kysely = getNodeSqliteKysely(db);
		const { markdown, steps, stepsJson } = input;
		if (!markdown && !steps) {
			if (!clearProgressCardInTransaction(db, sessionKey, input.expectedRevision) && input.expectedRevision !== void 0) return { card: readSessionProgressCard(db, sessionKey) };
			return { cleared: true };
		}
		const now = Date.now();
		return { card: {
			sessionKey,
			revision: executeSqliteQueryTakeFirstSync(db, kysely.insertInto("session_progress_cards").values({
				session_key: sessionKey,
				markdown: markdown ?? null,
				steps_json: stepsJson,
				revision: 1,
				created_at: now,
				updated_at: now
			}).onConflict((conflict) => conflict.column("session_key").doUpdateSet((eb) => ({
				markdown: markdown ?? null,
				steps_json: stepsJson,
				revision: eb("session_progress_cards.revision", "+", 1),
				updated_at: now
			}))).returning(["revision", "created_at"])).revision,
			updatedAt: now,
			...markdown ? { markdown } : {},
			...steps ? { steps } : {}
		} };
	};
	return db.isTransaction ? write() : runSqliteImmediateTransactionSync(db, write, { operationLabel: "progress-card.write" });
}
//#endregion
export { writePreparedSessionProgressCard as i, prepareSessionProgressCardWrite as n, readSessionProgressCard as r, clearSessionProgressCardForReset as t };
