import { i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { c as ensureOpenClawAgentStandingIntentsSchema } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { t as withOpenClawAgentDatabaseWrite } from "./openclaw-agent-db-write-BhC-9Wsf.mjs";
import "./sqlite-runtime-DhVTOiCi.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/memory-core/src/standing-intents.ts
const DEFAULT_INTENT_COOLDOWN_SECONDS = 86400;
const DEFAULT_INTENT_MAX_FIRES = 3;
const DEFAULT_INTENT_EXPIRY_MS = 7776e6;
const INTENT_MATCH_CANDIDATE_BATCH_SIZE = 32;
const INTENT_MATCH_CANDIDATE_LIMIT = 256;
const INTENT_INJECTION_MAX_COUNT = 3;
const INTENT_INJECTION_MAX_CHARS = 1200;
function withStandingIntentDatabase(params, callback) {
	const { agentId, assertCurrent } = params;
	assertCurrent?.();
	return withOpenClawAgentDatabaseWrite({ agentId }, ({ db }) => {
		assertCurrent?.();
		ensureOpenClawAgentStandingIntentsSchema(db);
		return callback(db);
	});
}
function normalizeScopeIdentity(value, field, lowercase = false) {
	const normalized = value.trim();
	if (!normalized) throw new Error(`${field} is unavailable for this creating turn`);
	return lowercase ? normalized.toLowerCase() : normalized;
}
function normalizeScopeAccountId(accountId) {
	return accountId?.trim() || "default";
}
function normalizeCreatorSender(value) {
	const creatorSender = value.trim();
	if (!creatorSender || creatorSender.toLowerCase() === "unknown") throw new Error("creating sender is unavailable for this turn");
	return creatorSender;
}
function readKnownCreatorSender(value) {
	const creatorSender = value?.trim();
	return creatorSender && creatorSender.toLowerCase() !== "unknown" ? creatorSender : null;
}
function encodeStandingIntentChannelScope(params) {
	const provider = normalizeScopeIdentity(params.provider, "channel identity", true);
	const identity = params.scope === "channel" ? provider : normalizeScopeIdentity(params.conversationId ?? "", "conversation identity");
	return JSON.stringify([
		"v1",
		params.scope,
		provider,
		normalizeScopeAccountId(params.accountId),
		identity
	]);
}
function encodeStandingIntentSenderScope(params) {
	return JSON.stringify([
		"v1",
		normalizeScopeIdentity(params.provider, "channel identity", true),
		normalizeScopeAccountId(params.accountId),
		normalizeScopeIdentity(params.senderId, "sender identity")
	]);
}
function parseStoredChannelScope(value) {
	if (value === null) return {
		scope: "anywhere",
		identity: null
	};
	try {
		const parsed = JSON.parse(value);
		if (Array.isArray(parsed) && parsed.length === 5 && parsed[0] === "v1" && (parsed[1] === "channel" || parsed[1] === "conversation") && parsed.slice(2).every((entry) => typeof entry === "string" && entry.length > 0)) return {
			scope: parsed[1],
			identity: parsed[4]
		};
	} catch {}
	return {
		scope: "anywhere",
		identity: null
	};
}
function parseStoredSenderScope(value) {
	if (value === null) return null;
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) && parsed.length === 4 && parsed[0] === "v1" && parsed.slice(1).every((entry) => typeof entry === "string" && entry.length > 0) ? parsed[3] : null;
	} catch {
		return null;
	}
}
function rowToIntent(row) {
	const channelScope = parseStoredChannelScope(row.channel_scope);
	return {
		id: row.id,
		description: row.description,
		triggerKeywords: parseStoredTriggerKeywords(row.trigger_keywords),
		triggerEmbedding: row.trigger_embedding,
		scope: channelScope.scope,
		channelScope: channelScope.identity,
		senderScope: parseStoredSenderScope(row.sender_scope),
		creatorSender: readKnownCreatorSender(row.creator_sender),
		status: row.status,
		expiresAt: row.expires_at,
		maxFires: row.max_fires,
		fireCount: row.fire_count,
		cooldownSeconds: row.cooldown_seconds,
		lastFiredAt: row.last_fired_at,
		createdAt: row.created_at,
		sourceSessionId: row.source_session_id
	};
}
function parseStoredTriggerKeywords(value) {
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "string" && Boolean(entry)) : [];
	} catch {
		return [];
	}
}
function shouldRearm(row, nowMs) {
	if (row.status !== "fired" || row.last_fired_at === null) return false;
	return row.last_fired_at + row.cooldown_seconds * 1e3 <= nowMs;
}
function maintainStandingIntentLifecycle(db, nowMs) {
	const kysely = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, kysely.updateTable("standing_intents").set({ status: "expired" }).where("status", "in", [
		"pending",
		"armed",
		"fired"
	]).where("expires_at", "<=", nowMs));
	const readyIds = executeSqliteQuerySync(db, kysely.selectFrom("standing_intents").select([
		"intent_key",
		"id",
		"status",
		"expires_at",
		"max_fires",
		"fire_count",
		"cooldown_seconds",
		"last_fired_at",
		"created_at"
	]).where("status", "=", "fired").where("expires_at", ">", nowMs).whereRef("fire_count", "<", "max_fires")).rows.filter((row) => shouldRearm(row, nowMs)).map((row) => row.id);
	if (readyIds.length > 0) executeSqliteQuerySync(db, kysely.updateTable("standing_intents").set({ status: "armed" }).where("id", "in", sqliteStringSet(readyIds)).where("status", "=", "fired"));
}
async function createStandingIntent(params) {
	const nowMs = params.nowMs ?? Date.now();
	const row = {
		id: randomUUID(),
		description: params.description,
		trigger_keywords: JSON.stringify(params.triggerKeywords),
		trigger_embedding: null,
		channel_scope: params.channelScope ?? null,
		sender_scope: params.senderScope ?? null,
		creator_sender: normalizeCreatorSender(params.creatorSender),
		status: "armed",
		expires_at: params.expiresAt ?? nowMs + 7776e6,
		max_fires: params.maxFires ?? 3,
		fire_count: 0,
		cooldown_seconds: params.cooldownSeconds ?? 86400,
		last_fired_at: null,
		created_at: nowMs,
		source_session_id: params.sourceSessionId ?? null
	};
	await withStandingIntentDatabase(params, (db) => {
		runSqliteImmediateTransactionSync(db, () => {
			const kysely = getNodeSqliteKysely(db);
			executeSqliteQuerySync(db, kysely.insertInto("standing_intents").values(row));
		});
	});
	return rowToIntent(row);
}
async function listStandingIntents(params) {
	return await withStandingIntentDatabase(params, (db) => runSqliteImmediateTransactionSync(db, () => {
		maintainStandingIntentLifecycle(db, params.nowMs ?? Date.now());
		let query = getNodeSqliteKysely(db).selectFrom("standing_intents").selectAll();
		if (params.status) query = query.where("status", "=", params.status);
		return executeSqliteQuerySync(db, query.orderBy("created_at", "asc").orderBy("id", "asc")).rows.map(rowToIntent);
	}));
}
async function sweepStandingIntents(params) {
	await withStandingIntentDatabase(params, (db) => {
		runSqliteImmediateTransactionSync(db, () => {
			maintainStandingIntentLifecycle(db, params.nowMs ?? Date.now());
		});
	});
}
async function cancelStandingIntent(params) {
	return await withStandingIntentDatabase(params, (db) => runSqliteImmediateTransactionSync(db, () => {
		const kysely = getNodeSqliteKysely(db);
		if (executeSqliteQuerySync(db, kysely.updateTable("standing_intents").set({ status: "cancelled" }).where("id", "=", params.id).where("status", "in", [
			"pending",
			"armed",
			"fired"
		])).numAffectedRows === 0n) return null;
		const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("standing_intents").selectAll().where("id", "=", params.id));
		return row ? rowToIntent(row) : null;
	}));
}
function tokenizeIntentText(text) {
	return text.toLowerCase().match(/[\p{L}\p{N}_-]+/gu) ?? [];
}
function buildFtsQuery(promptTokens) {
	const unique = [...promptTokens];
	if (unique.length === 0) return null;
	return unique.map((token) => `"${token.replaceAll("\"", "\"\"")}"`).join(" OR ");
}
function triggerMatchesPrompt(row, promptTokens) {
	return parseStoredTriggerKeywords(row.trigger_keywords).map((keyword) => tokenizeIntentText(keyword)).some((keywordTokens) => keywordTokens.length > 0 && keywordTokens.every((token) => promptTokens.has(token)));
}
function scopesMatch(row, channelScopes, senderScope) {
	return (row.channel_scope === null || channelScopes.has(row.channel_scope)) && (row.sender_scope === null || row.sender_scope === senderScope);
}
function canFire(row, nowMs) {
	return row.status === "armed" && row.expires_at > nowMs && row.fire_count < row.max_fires && (row.last_fired_at === null || row.last_fired_at + row.cooldown_seconds * 1e3 <= nowMs);
}
async function matchStandingIntents(params) {
	const promptTokens = new Set(tokenizeIntentText(params.prompt));
	const ftsQuery = buildFtsQuery(promptTokens);
	if (!ftsQuery) return [];
	const channel = params.channel?.trim() || void 0;
	const provider = params.provider?.trim().toLowerCase() || void 0;
	const senderId = params.senderId?.trim() || void 0;
	const channelScopes = /* @__PURE__ */ new Set();
	if (provider) {
		channelScopes.add(encodeStandingIntentChannelScope({
			scope: "channel",
			provider,
			accountId: params.accountId
		}));
		if (channel) channelScopes.add(encodeStandingIntentChannelScope({
			scope: "conversation",
			provider,
			accountId: params.accountId,
			conversationId: channel
		}));
	}
	const storedSenderScope = provider && senderId ? encodeStandingIntentSenderScope({
		provider,
		accountId: params.accountId,
		senderId
	}) : void 0;
	return await withStandingIntentDatabase(params, (db) => runSqliteImmediateTransactionSync(db, () => {
		const nowMs = params.nowMs ?? Date.now();
		maintainStandingIntentLifecycle(db, nowMs);
		let candidatesQuery = getNodeSqliteKysely(db).selectFrom("standing_intents as intent").innerJoin("standing_intents_fts as fts", "fts.rowid", "intent.intent_key").selectAll("intent").where("fts.trigger_keywords", "match", ftsQuery).where("intent.status", "=", "armed").where("intent.creator_sender", "is not", null).where("intent.expires_at", ">", nowMs).whereRef("intent.fire_count", "<", "intent.max_fires");
		candidatesQuery = channelScopes.size > 0 ? candidatesQuery.where((expression) => expression.or([expression("intent.channel_scope", "is", null), ...[...channelScopes].map((scope) => expression("intent.channel_scope", "=", scope))])) : candidatesQuery.where("intent.channel_scope", "is", null);
		candidatesQuery = storedSenderScope ? candidatesQuery.where((expression) => expression.or([expression("intent.sender_scope", "is", null), expression("intent.sender_scope", "=", storedSenderScope)])) : candidatesQuery.where("intent.sender_scope", "is", null);
		const kysely = getNodeSqliteKysely(db);
		const fired = [];
		let scannedCandidates = 0;
		let cursor;
		while (fired.length < INTENT_INJECTION_MAX_COUNT && scannedCandidates < INTENT_MATCH_CANDIDATE_LIMIT) {
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
				if (fired.length >= INTENT_INJECTION_MAX_COUNT) break;
				if (!readKnownCreatorSender(current.creator_sender) || !canFire(current, nowMs) || !scopesMatch(current, channelScopes, storedSenderScope) || !triggerMatchesPrompt(current, promptTokens)) continue;
				const nextFireCount = current.fire_count + 1;
				const firedIntent = rowToIntent({
					...current,
					fire_count: nextFireCount,
					last_fired_at: nowMs,
					status: nextFireCount >= current.max_fires ? "done" : "fired"
				});
				if (!standingIntentsFitContext([...fired, firedIntent])) continue;
				executeSqliteQuerySync(db, kysely.updateTable("standing_intents").set({
					fire_count: nextFireCount,
					last_fired_at: nowMs,
					status: nextFireCount >= current.max_fires ? "done" : "fired"
				}).where("id", "=", current.id).where("status", "=", "armed"));
				fired.push(firedIntent);
			}
			if (candidates.length < INTENT_MATCH_CANDIDATE_BATCH_SIZE) break;
		}
		return fired;
	}));
}
function renderStandingIntentContext(intents) {
	return `<standing_intents>\n${intents.map((intent) => {
		return `Standing intent (created ${new Date(intent.createdAt).toISOString().slice(0, 10)}): ${intent.description}`;
	}).join("\n")}\n</standing_intents>`;
}
function standingIntentsFitContext(intents) {
	return intents.length <= INTENT_INJECTION_MAX_COUNT && renderStandingIntentContext(intents).length <= 1200;
}
function buildStandingIntentContext(intents) {
	const included = [];
	for (const intent of intents.slice(0, INTENT_INJECTION_MAX_COUNT)) {
		if (!standingIntentsFitContext([...included, intent])) continue;
		included.push(intent);
	}
	return included.length > 0 ? renderStandingIntentContext(included) : void 0;
}
function isEligibleStandingIntentTurn(ctx) {
	if (ctx.trigger !== "user" || !ctx.sessionKey && !ctx.sessionId) return false;
	return ctx.messageProvider?.trim().toLowerCase() === "webchat" || Boolean(ctx.channelId?.trim() || ctx.chatId?.trim());
}
//#endregion
export { buildStandingIntentContext as a, encodeStandingIntentChannelScope as c, listStandingIntents as d, matchStandingIntents as f, INTENT_INJECTION_MAX_CHARS as i, encodeStandingIntentSenderScope as l, DEFAULT_INTENT_EXPIRY_MS as n, cancelStandingIntent as o, sweepStandingIntents as p, DEFAULT_INTENT_MAX_FIRES as r, createStandingIntent as s, DEFAULT_INTENT_COOLDOWN_SECONDS as t, isEligibleStandingIntentTurn as u };
