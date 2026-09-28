import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { i as ensureOpenClawAgentProgressCardSchemaInTransaction } from "./openclaw-agent-progress-card-schema-P92mHByB.mjs";
import fs from "node:fs";
//#region src/session-cards/progress-card-store.ts
function withProgressCardDatabase(input, readOnly, operation) {
	if (typeof input !== "string") return operation(input, "openclaw-agent.sqlite");
	const db = openNodeSqliteDatabase(input, { readOnly });
	try {
		if (!readOnly) db.exec("PRAGMA foreign_keys = ON;");
		return operation(db, input);
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(db);
		db.close();
	}
}
function progressCardTablePresent(db) {
	return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'session_progress_cards'").get());
}
function selectProgressCard(db, sessionKey) {
	const kysely = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, kysely.selectFrom("session_progress_cards").select([
		"session_key",
		"markdown",
		"steps_json",
		"revision",
		"created_at",
		"updated_at"
	]).where("session_key", "=", sessionKey).limit(1)).rows[0] ?? null;
}
function selectProgressCardMetadata(db, sessionKey) {
	const kysely = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, kysely.selectFrom("session_progress_cards").select([
		"session_key",
		"revision",
		"created_at",
		"updated_at"
	]).where("session_key", "=", sessionKey).limit(1)).rows[0] ?? null;
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
function readSessionProgressCard(dbPathOrDb, sessionKey) {
	if (typeof dbPathOrDb === "string" && !fs.existsSync(dbPathOrDb)) return null;
	return withProgressCardDatabase(dbPathOrDb, true, (db) => {
		if (!progressCardTablePresent(db)) return null;
		const row = selectProgressCard(db, sessionKey);
		return row ? rowToProgressCard(row) : null;
	});
}
/** Retain revision tombstones, but keep never-used lazy storage dormant during reset. */
function clearSessionProgressCardForReset(db, sessionKey) {
	if (!progressCardTablePresent(db) || !selectProgressCardMetadata(db, sessionKey)) return false;
	writeSessionProgressCard(db, sessionKey, {});
	return true;
}
function writeSessionProgressCard(dbPathOrDb, sessionKey, input) {
	return withProgressCardDatabase(dbPathOrDb, false, (db, label) => {
		const write = () => {
			ensureOpenClawAgentProgressCardSchemaInTransaction(db);
			const kysely = getNodeSqliteKysely(db);
			const markdown = input.markdown?.trim() ? input.markdown : void 0;
			const steps = input.steps && input.steps.length > 0 ? input.steps : void 0;
			if (!markdown && !steps) {
				let previous;
				if (input.expectedRevision !== void 0) {
					const currentRow = selectProgressCard(db, sessionKey);
					const current = currentRow ? rowToProgressCard(currentRow) : null;
					if (!currentRow || currentRow.revision !== input.expectedRevision || !current?.steps?.length || current.steps.some((step) => step.status !== "completed")) return { card: current };
					previous = currentRow;
				} else previous = selectProgressCardMetadata(db, sessionKey);
				if (previous) executeSqliteQuerySync(db, kysely.updateTable("session_progress_cards").set({
					markdown: null,
					steps_json: null,
					revision: previous.revision + 1,
					updated_at: Date.now()
				}).where("session_key", "=", sessionKey));
				return { cleared: true };
			}
			const previous = selectProgressCardMetadata(db, sessionKey);
			const now = Date.now();
			const revision = (previous?.revision ?? 0) + 1;
			const stepsJson = steps ? JSON.stringify(steps) : null;
			executeSqliteQuerySync(db, kysely.insertInto("session_progress_cards").values({
				session_key: sessionKey,
				markdown: markdown ?? null,
				steps_json: stepsJson,
				revision,
				created_at: previous?.created_at ?? now,
				updated_at: now
			}).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
				markdown: markdown ?? null,
				steps_json: stepsJson,
				revision,
				updated_at: now
			})));
			return { card: {
				sessionKey,
				revision,
				updatedAt: now,
				...markdown ? { markdown } : {},
				...steps ? { steps } : {}
			} };
		};
		return db.isTransaction ? write() : runSqliteImmediateTransactionSync(db, write, {
			databaseLabel: label,
			operationLabel: "progress-card.write"
		});
	});
}
//#endregion
export { readSessionProgressCard as n, writeSessionProgressCard as r, clearSessionProgressCardForReset as t };
