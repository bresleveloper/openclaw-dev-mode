import { c as withSqlitePostCommitPublications } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync, t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { o as ensureOpenClawAgentStandingIntentsSchema } from "./openclaw-agent-db-validation-facts-BQcDbrLo.mjs";
import "./sqlite-worker-runtime-Da3qtgYL.mjs";
import { f as readKnownCreatorSender, h as tokenizeIntentText, m as standingIntentsFitContext, p as rowToIntent, u as parseStoredTriggerKeywords } from "./standing-intents-model-CN2LEs96.mjs";
//#region extensions/memory-core/src/standing-intents-kernel.ts
const INTENT_MATCH_CANDIDATE_BATCH_SIZE = 32;
const INTENT_MATCH_CANDIDATE_LIMIT = 256;
const lifecycleDeadlines = /* @__PURE__ */ new WeakMap();
function invalidateStandingIntentLifecycle(db) {
	lifecycleDeadlines.delete(db);
}
function getStandingIntentLifecycleDeadline(db) {
	return lifecycleDeadlines.get(db)?.nextDueAt ?? null;
}
function hasNoActiveStandingIntents(db) {
	return lifecycleDeadlines.get(db)?.hasActiveIntents === false;
}
function maintainStandingIntentLifecycle(db, nowMs) {
	const deadline = lifecycleDeadlines.get(db);
	if (deadline && nowMs >= deadline.observedAt && nowMs < deadline.nextDueAt) return;
	const kysely = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, kysely.updateTable("standing_intents").set({ status: "expired" }).where("status", "in", [
		"pending",
		"armed",
		"fired"
	]).where("expires_at", "<=", nowMs));
	const fired = executeSqliteQuerySync(db, kysely.selectFrom("standing_intents").select([
		"intent_key",
		"id",
		"status",
		"expires_at",
		"max_fires",
		"fire_count",
		"cooldown_seconds",
		"last_fired_at",
		"created_at"
	]).where("status", "=", "fired").where("expires_at", ">", nowMs).whereRef("fire_count", "<", "max_fires")).rows;
	const readyIds = fired.filter((row) => row.last_fired_at !== null && row.last_fired_at + row.cooldown_seconds * 1e3 <= nowMs).map((row) => row.id);
	if (readyIds.length > 0) executeSqliteQuerySync(db, kysely.updateTable("standing_intents").set({ status: "armed" }).where("id", "in", sqliteStringSet(readyIds)).where("status", "=", "fired"));
	const expiry = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("standing_intents").select((eb) => eb.fn.min(eb.cast("expires_at", "double precision")).as("next_expiry")).where("status", "in", [
		"pending",
		"armed",
		"fired"
	]));
	let nextDueAt = expiry?.next_expiry ?? Infinity;
	for (const row of fired) if (row.last_fired_at !== null) {
		const rearmAt = row.last_fired_at + row.cooldown_seconds * 1e3;
		if (rearmAt > nowMs) nextDueAt = Math.min(nextDueAt, rearmAt);
	}
	lifecycleDeadlines.set(db, {
		observedAt: nowMs,
		nextDueAt,
		hasActiveIntents: expiry?.next_expiry != null
	});
}
function createStandingIntentInDatabase(db, row) {
	const kysely = getNodeSqliteKysely(db);
	invalidateStandingIntentLifecycle(db);
	executeSqliteQuerySync(db, kysely.insertInto("standing_intents").values(row));
	return rowToIntent(row);
}
function listStandingIntentsInDatabase(db, params) {
	maintainStandingIntentLifecycle(db, params.nowMs ?? Date.now());
	let query = getNodeSqliteKysely(db).selectFrom("standing_intents").selectAll();
	if (params.status) query = query.where("status", "=", params.status);
	return executeSqliteQuerySync(db, query.orderBy("created_at", "asc").orderBy("id", "asc")).rows.map(rowToIntent);
}
function cancelStandingIntentInDatabase(db, params) {
	const kysely = getNodeSqliteKysely(db);
	invalidateStandingIntentLifecycle(db);
	if (executeSqliteQuerySync(db, kysely.updateTable("standing_intents").set({ status: "cancelled" }).where("id", "=", params.id).where("status", "in", [
		"pending",
		"armed",
		"fired"
	])).numAffectedRows === 0n) return null;
	const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("standing_intents").selectAll().where("id", "=", params.id));
	return row ? rowToIntent(row) : null;
}
function triggerMatchesPrompt(row, promptTokens) {
	return parseStoredTriggerKeywords(row.trigger_keywords).map((keyword) => tokenizeIntentText(keyword)).some((keywordTokens) => keywordTokens.length > 0 && keywordTokens.every((token) => promptTokens.has(token)));
}
function matchStandingIntentsInDatabase(db, params) {
	const promptTokens = new Set(params.promptTokens);
	const channelScopes = params.channelScopes;
	const ftsQuery = params.ftsQuery;
	const storedSenderScope = params.senderScope;
	const nowMs = params.nowMs ?? Date.now();
	maintainStandingIntentLifecycle(db, nowMs);
	if (hasNoActiveStandingIntents(db)) return [];
	const kysely = getNodeSqliteKysely(db);
	let candidatesQuery = kysely.selectFrom("standing_intents as intent").innerJoin("standing_intents_fts as fts", "fts.rowid", "intent.intent_key").selectAll("intent").where("fts.trigger_keywords", "match", ftsQuery).where("intent.status", "=", "armed").where("intent.creator_sender", "is not", null).where("intent.expires_at", ">", nowMs).whereRef("intent.fire_count", "<", "intent.max_fires");
	for (const [column, scopes] of [["intent.channel_scope", channelScopes], ["intent.sender_scope", storedSenderScope ? [storedSenderScope] : []]]) candidatesQuery = scopes.length > 0 ? candidatesQuery.where((expression) => expression.or([expression(column, "is", null), ...scopes.map((scope) => expression(column, "=", scope))])) : candidatesQuery.where(column, "is", null);
	const fired = [];
	let scannedCandidates = 0;
	let cursor;
	while (fired.length < 3 && scannedCandidates < INTENT_MATCH_CANDIDATE_LIMIT) {
		let pageQuery = candidatesQuery;
		const currentCursor = cursor;
		if (currentCursor) pageQuery = pageQuery.where((expression) => expression.or([expression("intent.created_at", ">", currentCursor.createdAt), expression.and([expression("intent.created_at", "=", currentCursor.createdAt), expression("intent.id", ">", currentCursor.id)])]));
		const candidates = executeSqliteQuerySync(db, pageQuery.orderBy("intent.created_at", "asc").orderBy("intent.id", "asc").limit(Math.min(INTENT_MATCH_CANDIDATE_BATCH_SIZE, INTENT_MATCH_CANDIDATE_LIMIT - scannedCandidates))).rows;
		if (candidates.length === 0) break;
		const lastCandidate = candidates.at(-1);
		scannedCandidates += candidates.length;
		cursor = lastCandidate ? {
			createdAt: lastCandidate.created_at,
			id: lastCandidate.id
		} : cursor;
		for (const current of candidates) {
			if (fired.length >= 3) break;
			if (!readKnownCreatorSender(current.creator_sender) || current.last_fired_at !== null && !(current.last_fired_at + current.cooldown_seconds * 1e3 <= nowMs) || !triggerMatchesPrompt(current, promptTokens)) continue;
			const nextFireCount = current.fire_count + 1;
			const firedState = {
				fire_count: nextFireCount,
				last_fired_at: nowMs,
				status: nextFireCount >= current.max_fires ? "done" : "fired"
			};
			const firedIntent = rowToIntent({
				...current,
				...firedState
			});
			if (!standingIntentsFitContext([...fired, firedIntent])) continue;
			invalidateStandingIntentLifecycle(db);
			executeSqliteQuerySync(db, kysely.updateTable("standing_intents").set(firedState).where("id", "=", current.id).where("status", "=", "armed"));
			fired.push(firedIntent);
		}
		if (candidates.length < INTENT_MATCH_CANDIDATE_BATCH_SIZE) break;
	}
	return fired;
}
//#endregion
//#region extensions/memory-core/src/standing-intents.worker.ts
/** The canonical agent executor retains and closes this connection. */
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	const transact = (run) => {
		try {
			return runSqliteImmediateTransactionSync(db, () => {
				context.admit("transaction");
				return run();
			}, { withCommit(commit) {
				context.admit("commit");
				commit();
			} });
		} catch (error) {
			invalidateStandingIntentLifecycle(db);
			throw error;
		}
	};
	let schemaPrepared = false;
	withSqlitePostCommitPublications(db, () => ensureOpenClawAgentStandingIntentsSchema(db, (run) => {
		const result = transact(run);
		schemaPrepared = true;
		return result;
	}));
	let closed = false;
	return {
		execute(command) {
			if (closed) throw new Error("Standing-intent worker binding is closed");
			if (schemaPrepared) return { kind: "schema-prepared" };
			const result = (value) => ({
				kind: "result",
				value,
				nextDueAt: getStandingIntentLifecycleDeadline(db)
			});
			if (command.type === "match" && hasNoActiveStandingIntents(db)) return result([]);
			return transact(() => {
				switch (command.type) {
					case "create": return result(createStandingIntentInDatabase(db, command.input));
					case "list": return result(listStandingIntentsInDatabase(db, command.input));
					case "sweep": return result(maintainStandingIntentLifecycle(db, command.input.nowMs ?? Date.now()));
					case "cancel": return result(cancelStandingIntentInDatabase(db, command.input));
					case "match": return result(matchStandingIntentsInDatabase(db, command.input));
				}
				throw new Error("Unknown standing-intent command");
			});
		},
		assertSettled() {
			assertTransactionUsable(db);
			if (!db.isOpen || db.isTransaction) throw new Error("Standing-intent operation left an unsettled native connection");
		},
		close() {
			closed = true;
		}
	};
}
//#endregion
export { bindSqliteWorkerBackend as t };
