import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { a as publishSqliteCommittedState, o as stageSqliteCommittedPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as getSqliteReadOperationRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { f as sqliteStringSetEntries, l as prepareSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely, r as encodeSqliteStringSet } from "./kysely-sync-9fPQaMlh.mjs";
import "./sqlite-worker-contract-DhDutMia.mjs";
import { a as deferSqliteWorkerCommitReceipt, o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { a as readTrackedStateDatabaseIdentity } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { n as hasSqliteCommitReceiptCoverage, t as createSqliteCommitReceipt } from "./sqlite-commit-receipt-DafgyYOc.mjs";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { serialize } from "node:v8";
//#region src/plugins/conversation-binding-metadata.ts
function isPluginOwnedBindingMetadata(metadata) {
	if (!metadata || typeof metadata !== "object") return false;
	const record = metadata;
	return record.pluginBindingOwner === "plugin" && typeof record.pluginId === "string" && typeof record.pluginRoot === "string";
}
function isPluginOwnedSessionBindingRecord(record) {
	return isPluginOwnedBindingMetadata(record?.metadata);
}
//#endregion
//#region src/infra/outbound/session-binding-normalization.ts
/**
* Normalizes conversation ids and drops self-referential parent ids.
*/
function normalizeConversationTargetRef(ref) {
	const conversationId = normalizeOptionalString(ref.conversationId) ?? "";
	const parentConversationId = normalizeOptionalString(ref.parentConversationId);
	const { parentConversationId: _ignoredParentConversationId, ...rest } = ref;
	return {
		...rest,
		conversationId,
		...parentConversationId && parentConversationId !== conversationId ? { parentConversationId } : {}
	};
}
/**
* Normalizes a full conversation reference for stable binding keys.
*/
function normalizeConversationRef(ref) {
	return {
		...normalizeConversationTargetRef(ref),
		channel: normalizeLowercaseStringOrEmpty(ref.channel),
		accountId: normalizeAccountId(ref.accountId)
	};
}
/** Capture only canonical identity fields; caller context must not cross IPC. */
function captureConversationRef(ref) {
	const { channel, accountId, conversationId, parentConversationId } = ref;
	return normalizeConversationRef({
		channel,
		accountId,
		conversationId,
		...parentConversationId !== void 0 ? { parentConversationId } : {}
	});
}
/**
* Builds the adapter registry key shared by channel/account scoped bindings.
*/
function buildChannelAccountKey(params) {
	return `${normalizeLowercaseStringOrEmpty(params.channel)}:${normalizeAccountId(params.accountId)}`;
}
const INSPECTED_CONVERSATION = Symbol.for("openclaw.sessionBinding.inspectedConversation");
function withSessionBindingInspectionConversation(inspection, conversation) {
	return Object.assign(inspection, { [INSPECTED_CONVERSATION]: Object.freeze({ ...conversation }) });
}
function readSessionBindingInspectionConversation(inspection) {
	return inspection[INSPECTED_CONVERSATION];
}
//#endregion
//#region src/infra/outbound/current-conversation-bindings.publication.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.currentConversationBindingPublication"), () => ({
	sources: /* @__PURE__ */ new WeakMap(),
	capture: new AsyncLocalStorage(),
	installingFacts: 0,
	facts: /* @__PURE__ */ new Set(),
	observers: /* @__PURE__ */ new Set()
}));
function sourceFor(database) {
	const anchor = sqlPublicationAnchor(database);
	let source = state.sources.get(anchor);
	if (!source) {
		source = {
			identity: readTrackedStateDatabaseIdentity(anchor)?.key ?? Symbol("untracked-binding-database"),
			incarnation: randomUUID()
		};
		state.sources.set(anchor, source);
	}
	return source;
}
function capturePublication(database, changes) {
	const current = new Map(changes.map((change) => [change.key, change.current]));
	return {
		receipt: createSqliteCommitReceipt({
			source: sourceFor(database),
			domain: "current-conversation-bindings",
			keys: [...current.keys()],
			readFact(key) {
				const record = current.get(key);
				return record ? {
					kind: "postimage",
					value: structuredClone(record)
				} : { kind: "absent" };
			}
		}),
		sessionKeys: [...new Set(changes.flatMap((change) => [change.previousTargetSessionKey, change.currentTargetSessionKey ?? change.current?.targetSessionKey].filter((key) => key !== void 0)))]
	};
}
function unknownPublication(publication) {
	return {
		...publication,
		receipt: {
			...publication.receipt,
			facts: new Map([...publication.receipt.facts.keys()].map((key) => [key, { kind: "unknown" }]))
		}
	};
}
function installFacts(change) {
	const failures = [];
	state.installingFacts++;
	try {
		notifyListeners(state.facts, change, (error) => failures.push(error));
	} finally {
		state.installingFacts--;
	}
	if (failures.length) throw new AggregateError(failures, "Conversation binding fact installation failed");
}
function publicationState(publication) {
	let installed = publication;
	return {
		installFacts: () => installFacts(installed),
		invalidate() {
			installed = unknownPublication(publication);
			installFacts(installed);
		},
		notify: () => notifyListeners(state.observers, installed)
	};
}
/** Owns binding-fact staging and observation; callers retain native/foreign authority guards. */
const currentConversationBindingPublication = {
	stage: stageCurrentConversationBindingChanges,
	/** Install/invalidate prepared facts only; storage mutations belong in postcommit observers. */
	subscribeFacts(listener) {
		return registerListener(state.facts, listener);
	},
	subscribe(listener) {
		return registerListener(state.observers, listener);
	}
};
/** Called inside the owning write transaction using rows already read by its kernel. */
function stageCurrentConversationBindingChanges(database, changes) {
	if (!changes.length) return;
	if (state.installingFacts) throw new Error("Conversation bindings cannot mutate during fact installation");
	state.capture.getStore()?.push(...changes);
	const publication = capturePublication(database, changes);
	if (!stageSqliteCommittedPublication(database, publicationState(publication)) && !database.isTransaction) publishSqliteCommittedState(publicationState(publication));
}
/** One receipt covers every changed row in this worker transaction, including mutating reads. */
function withCurrentConversationBindingWorkerReceipt(database, update) {
	return state.capture.run([], () => {
		const result = update();
		const changes = state.capture.getStore();
		if (changes.length) {
			const publication = capturePublication(database, changes);
			deferSqliteWorkerCommitReceipt(database, serialize(publication).byteLength <= 33554432 ? publication : {
				kind: "unknown",
				identity: publication.receipt.source.identity
			});
		}
		return result;
	});
}
function readPublication(value) {
	if (!isRecord(value) || !isRecord(value.receipt) || !isRecord(value.receipt.source) || typeof value.receipt.source.identity !== "string" || typeof value.receipt.source.incarnation !== "string" || !(value.receipt.facts instanceof Map) || !Array.isArray(value.sessionKeys) || !value.sessionKeys.every((key) => typeof key === "string")) throw new Error("Conversation binding receipt is invalid");
	const source = {
		identity: value.receipt.source.identity,
		incarnation: value.receipt.source.incarnation
	};
	if (!hasSqliteCommitReceiptCoverage(value.receipt, {
		source,
		domain: "current-conversation-bindings",
		keys: [...value.receipt.facts.keys()]
	}) || ![...value.receipt.facts].every(([key, fact]) => typeof key === "string" && (fact.kind === "absent" || fact.kind === "postimage" && isRecord(fact.value) && typeof fact.value.bindingId === "string" && typeof fact.value.targetSessionKey === "string" && isRecord(fact.value.conversation)))) throw new Error("Conversation binding receipt has incomplete facts");
	return value;
}
/** Retain supersession until native settlement, independent of ordinary reply delivery. */
function withCurrentConversationBindingPublication(createAdmission, identity, assertPublicationCurrent) {
	return (operation) => {
		const pendingFailures = [];
		notifyListeners(state.facts, {
			kind: "pending",
			identity: identity(),
			operation
		}, (error) => pendingFailures.push(error));
		let owner;
		try {
			if (pendingFailures.length) throw new AggregateError(pendingFailures, "Conversation binding pending installation failed");
			owner = createAdmission(operation);
		} catch (error) {
			notifyListeners(state.facts, {
				kind: "settled",
				identity: identity(),
				operation,
				outcome: "unknown"
			});
			throw error;
		}
		const superseded = /* @__PURE__ */ new Set();
		let installing = false;
		let published = false;
		let unknown = false;
		const unsubscribe = currentConversationBindingPublication.subscribeFacts((change) => {
			if (installing) return;
			if (!("receipt" in change)) {
				if (change.identity === identity() && (change.kind === "unknown" || change.kind === "settled" && change.outcome === "unknown")) unknown = true;
				return;
			}
			const { receipt } = change;
			if (receipt.source.identity === identity()) for (const key of receipt.facts.keys()) superseded.add(key);
		});
		let finished = false;
		const finish = owner.admission.finish.bind(owner.admission);
		owner.admission.finish = () => {
			try {
				finish();
			} finally {
				if (!finished) {
					finished = true;
					unsubscribe();
					notifyListeners(state.facts, {
						kind: "settled",
						identity: identity(),
						operation,
						outcome: !unknown && owner.admission.settlement?.kind === "completed" ? published ? "published" : "unchanged" : "unknown"
					});
				}
			}
		};
		observeSqliteWorkerCommittedFacts(owner.admission, ({ facts }) => {
			assertPublicationCurrent();
			if (isRecord(facts) && facts.kind === "unknown" && facts.identity === identity()) {
				unknown = true;
				installing = true;
				try {
					installFacts({
						kind: "unknown",
						identity: identity()
					});
					published = true;
				} finally {
					installing = false;
				}
				return;
			}
			const publication = readPublication(facts);
			if (publication.receipt.source.identity !== identity()) throw new Error("Conversation binding receipt changed its physical owner");
			const installation = {
				...publication,
				receipt: {
					...publication.receipt,
					facts: new Map([...publication.receipt.facts].map(([key, fact]) => [key, unknown || superseded.has(key) ? { kind: "unknown" } : fact]))
				}
			};
			installing = true;
			try {
				publishSqliteCommittedState(publicationState(installation));
				published = true;
			} finally {
				installing = false;
			}
		});
		return owner;
	};
}
//#endregion
//#region src/infra/outbound/session-binding-errors.ts
var SessionBindingError = class extends Error {
	constructor(code, message, details) {
		super(message);
		this.code = code;
		this.details = details;
		this.name = "SessionBindingError";
	}
};
function isSessionBindingError(error) {
	return error instanceof SessionBindingError;
}
//#endregion
//#region src/infra/outbound/current-conversation-bindings.kernel.ts
const CURRENT_BINDINGS_ID_PREFIX = "generic:";
const CURRENT_BINDING_CONVERSATION_KIND = "current";
const MAX_RETAINED_BINDING_SELECTION = 128;
const retainedSelections = /* @__PURE__ */ new WeakMap();
function currentConversationBindingRow(record, conversation, bindingKey) {
	return {
		binding_key: bindingKey,
		binding_id: record.bindingId,
		target_session_key: record.targetSessionKey,
		channel: conversation.channel,
		account_id: conversation.accountId,
		conversation_kind: "current",
		parent_conversation_id: conversation.parentConversationId ?? null,
		conversation_id: conversation.conversationId,
		target_kind: record.targetKind,
		status: record.status,
		bound_at: record.boundAt,
		expires_at: record.expiresAt ?? null,
		metadata_json: record.metadata ? JSON.stringify(record.metadata) : null,
		record_json: JSON.stringify(record),
		updated_at: Date.now()
	};
}
function createCurrentConversationBindingQueries(db) {
	const bindingDb = getNodeSqliteKysely(db);
	const select = bindingDb.selectFrom("current_conversation_bindings").select([
		"binding_key",
		"binding_id",
		"target_session_key",
		"record_json"
	]);
	function lists(genericOnly) {
		const query = genericOnly ? select.where("binding_id", "like", `${CURRENT_BINDINGS_ID_PREFIX}%`) : select;
		return {
			bySessions: prepareSqliteQuerySync(db, (parameter) => {
				const keys = sqliteStringSetEntries(parameter((params) => encodeSqliteStringSet(params.targetSessionKeys))).as("requested");
				return query.where("target_session_key", "in", (eb) => eb.selectFrom(keys).select("requested.value")).where((eb) => eb.or([eb(parameter((params) => params.scope?.channel ?? null), "is", null), eb.and([eb(parameter((params) => params.scope?.channel ?? null), "=", eb.ref("channel")), eb(parameter((params) => params.scope?.accountId ?? null), "=", eb.ref("account_id"))])])).orderBy("target_session_key", "asc").orderBy("binding_id", "asc");
			}),
			bySession: prepareSqliteQuerySync(db, (parameter) => query.where("target_session_key", "=", parameter((target) => target)).orderBy("binding_id", "asc")),
			byScope: prepareSqliteQuerySync(db, (parameter) => query.where((eb) => eb.and({
				target_session_key: parameter((params) => params.targetSessionKey),
				channel: parameter((params) => params.scope.channel),
				account_id: parameter((params) => params.scope.accountId)
			})).orderBy("binding_id", "asc"))
		};
	}
	return {
		selection: prepareSqliteQuerySync(db, (parameter) => {
			const encoded = parameter((conversations) => encodeSqliteStringSet(conversations.flatMap((ref) => [
				buildConversationKey(ref),
				ref.channel,
				ref.accountId,
				ref.conversationId
			])));
			const fields = sqliteStringSetEntries(encoded).as("field");
			const requested = bindingDb.with("requested", (query) => query.selectFrom(fields).select((eb) => {
				const component = (index) => eb.fn.max(eb.case().when(eb("field.key", "%", 4), "=", index).then(eb.ref("field.value")).end());
				return [
					eb.cast(eb("field.key", "/", 4), "integer").as("request_index"),
					component(0).as("binding_key"),
					component(1).as("channel"),
					component(2).as("account_id"),
					component(3).as("conversation_id")
				];
			}).groupBy((eb) => eb.cast(eb("field.key", "/", 4), "integer")));
			const columns = [
				"requested.request_index",
				"candidate.binding_key",
				"candidate.binding_id",
				"candidate.target_session_key",
				"candidate.record_json"
			];
			return requested.selectFrom("requested").innerJoin("current_conversation_bindings as candidate", "candidate.binding_key", "requested.binding_key").select(columns).select((eb) => eb.val(1).as("is_exact")).unionAll((selection) => selection.selectFrom("requested").innerJoin("current_conversation_bindings as candidate", (join) => join.onRef("candidate.channel", "=", "requested.channel").onRef("candidate.account_id", "=", "requested.account_id").onRef("candidate.conversation_id", "=", "requested.conversation_id").on("candidate.conversation_kind", "=", CURRENT_BINDING_CONVERSATION_KIND)).select(columns).select((eb) => eb.val(0).as("is_exact")).where((eb) => eb.not(eb.exists(eb.selectFrom("current_conversation_bindings as exact").select("exact.binding_key").whereRef("exact.binding_key", "=", "requested.binding_key"))))).orderBy("request_index");
		}),
		remove: prepareSqliteQuerySync(db, (parameter) => bindingDb.deleteFrom("current_conversation_bindings").where("binding_key", "=", parameter((key) => key))),
		upsert: prepareSqliteQuerySync(db, (parameter) => {
			const row = {
				binding_key: parameter((value) => value.binding_key),
				binding_id: parameter((value) => value.binding_id),
				target_session_key: parameter((value) => value.target_session_key),
				channel: parameter((value) => value.channel),
				account_id: parameter((value) => value.account_id),
				conversation_kind: parameter((value) => value.conversation_kind),
				parent_conversation_id: parameter((value) => value.parent_conversation_id),
				conversation_id: parameter((value) => value.conversation_id),
				target_kind: parameter((value) => value.target_kind),
				status: parameter((value) => value.status),
				bound_at: parameter((value) => value.bound_at),
				expires_at: parameter((value) => value.expires_at),
				metadata_json: parameter((value) => value.metadata_json),
				record_json: parameter((value) => value.record_json),
				updated_at: parameter((value) => value.updated_at)
			};
			return bindingDb.insertInto("current_conversation_bindings").values(row).onConflict((conflict) => conflict.column("binding_key").doUpdateSet(row)).returning([
				"binding_key",
				"binding_id",
				"target_session_key",
				"record_json"
			]);
		}),
		generic: lists(true),
		all: lists(false)
	};
}
const getCurrentConversationBindingQueries = createSqliteQueryCache(createCurrentConversationBindingQueries);
function buildConversationKey(ref) {
	return [
		ref.channel,
		ref.accountId,
		ref.parentConversationId ?? "",
		ref.conversationId
	].join("␟");
}
function buildBindingId(ref) {
	return `${CURRENT_BINDINGS_ID_PREFIX}${buildConversationKey(ref)}`;
}
function isBindingExpired(record, now = Date.now()) {
	if (record.expiresAt === void 0) return false;
	const expiresAt = asDateTimestampMs(record.expiresAt);
	if (expiresAt === void 0) return true;
	const nowMs = asDateTimestampMs(now);
	return nowMs !== void 0 && !isFutureDateTimestampMs(expiresAt, { nowMs });
}
function bindingRowToRecord(row) {
	try {
		const record = JSON.parse(row.record_json);
		if (!record?.bindingId || !record?.conversation?.conversationId) return null;
		const conversation = normalizeConversationRef(record.conversation);
		const targetSessionKey = record.targetSessionKey?.trim() ?? "";
		if (!targetSessionKey) return null;
		return {
			...record,
			bindingId: record.bindingId.startsWith("generic:") ? buildBindingId(conversation) : record.bindingId,
			targetSessionKey,
			conversation
		};
	} catch {
		return null;
	}
}
function readCurrentConversationBindingRows(db, conversations) {
	if (conversations.length === 0) return [];
	const revision = conversations.length <= MAX_RETAINED_BINDING_SELECTION ? getSqliteReadOperationRevision(db) : void 0;
	const selectionKey = revision ? JSON.stringify(conversations.map((ref) => [
		ref.channel,
		ref.accountId,
		ref.parentConversationId ?? "",
		ref.conversationId
	])) : void 0;
	const retained = retainedSelections.get(db);
	if (revision && retained?.revision === revision && retained.conversations === selectionKey) return retained.rows;
	const selected = /* @__PURE__ */ new Map();
	for (const row of getCurrentConversationBindingQueries(db).selection(conversations).rows) {
		if (selected.has(row.request_index)) continue;
		const conversation = conversations[row.request_index];
		const record = row.is_exact ? void 0 : bindingRowToRecord(row);
		if (row.is_exact || record && buildConversationKey(record.conversation) === buildConversationKey(conversation)) selected.set(row.request_index, row);
	}
	const rows = conversations.map((_, index) => selected.get(index));
	if (revision && selectionKey && getSqliteReadOperationRevision(db) === revision) {
		if (!retained) {
			const unregister = registerNodeSqliteDisposeCallback(sqlPublicationAnchor(db), () => {
				retainedSelections.delete(db);
				unregister();
			});
		}
		retainedSelections.set(db, {
			revision,
			conversations: selectionKey,
			rows
		});
	}
	return rows;
}
function updateCurrentConversationBindingRecordInDatabase(db, ref, update) {
	const conversation = normalizeConversationRef(ref);
	const bindingKey = buildConversationKey(conversation);
	const existingRow = readCurrentConversationBindingRows(db, [conversation])[0];
	const existing = existingRow ? bindingRowToRecord(existingRow) : null;
	const previous = existing && !isBindingExpired(existing) ? existing : null;
	const current = update(previous);
	if (!current) {
		if (existingRow) {
			getCurrentConversationBindingQueries(db).remove(existingRow.binding_key);
			currentConversationBindingPublication.stage(db, [{
				key: existingRow.binding_key,
				current: null,
				previousTargetSessionKey: existingRow.target_session_key
			}]);
		}
		return {
			previous,
			current: null
		};
	}
	if (buildConversationKey(normalizeConversationRef(current.conversation)) !== bindingKey) throw new Error("Current conversation binding update changed its conversation owner");
	if (existingRow && existingRow.binding_key !== bindingKey) getCurrentConversationBindingQueries(db).remove(existingRow.binding_key);
	const row = currentConversationBindingRow(current, conversation, bindingKey);
	const persisted = getCurrentConversationBindingQueries(db).upsert(row).rows[0];
	currentConversationBindingPublication.stage(db, [...existingRow && existingRow.binding_key !== bindingKey ? [{
		key: existingRow.binding_key,
		current: null,
		previousTargetSessionKey: existingRow.target_session_key
	}] : [], {
		key: persisted.binding_key,
		current: bindingRowToRecord(persisted),
		currentTargetSessionKey: persisted.target_session_key,
		previousTargetSessionKey: existingRow?.target_session_key
	}]);
	return {
		previous,
		current
	};
}
function inspectCurrentConversationBindingRecordsInDatabase(db, conversations, now = Date.now()) {
	return readCurrentConversationBindingRows(db, conversations).map((row) => {
		const record = row ? bindingRowToRecord(row) : null;
		return record && !isBindingExpired(record, now) ? record : null;
	});
}
/** One statement selects higher-priority absences and fallback rows from the same snapshot. */
function readCurrentConversationBindingSelectionInDatabase(db, conversations) {
	return inspectCurrentConversationBindingRecordsInDatabase(db, conversations);
}
function readCurrentConversationBindingResolutionInDatabase(db, conversation) {
	const row = readCurrentConversationBindingRows(db, [conversation])[0];
	const record = row ? bindingRowToRecord(row) : null;
	return {
		record: record ?? null,
		repair: Boolean(row && record && (isBindingExpired(record) || row.binding_key !== buildConversationKey(record.conversation) || row.binding_id !== record.bindingId || row.target_session_key !== record.targetSessionKey))
	};
}
function listCurrentConversationBindingRowsBySession(db, targetSessionKey, scope, genericOnly = !scope) {
	const queries = getCurrentConversationBindingQueries(db);
	const list = genericOnly ? queries.generic : queries.all;
	if (scope) {
		const normalized = normalizeConversationRef({
			...scope,
			conversationId: "binding-scope"
		});
		return list.byScope({
			targetSessionKey,
			scope: normalized
		}).rows;
	}
	return list.bySession(targetSessionKey).rows;
}
/** Warm listings avoid writer admission unless an expired record requires the existing repair. */
function readCurrentConversationBindingListInDatabase(db, targetSessionKey, scope) {
	const records = listCurrentConversationBindingRowsBySession(db, targetSessionKey, scope).map(bindingRowToRecord).filter((record) => record !== null);
	return {
		records,
		requiresPrune: records.some((record) => isBindingExpired(record))
	};
}
/** Read every requested target from one SQLite statement, preserving request order and duplicates. */
function readCurrentConversationBindingListsInDatabase(db, targetSessionKeys, scope) {
	if (targetSessionKeys.length === 0) return [];
	const normalizedScope = scope ? normalizeConversationRef({
		...scope,
		conversationId: "binding-scope"
	}) : void 0;
	const queries = getCurrentConversationBindingQueries(db);
	const rows = (scope ? queries.all : queries.generic).bySessions({
		targetSessionKeys,
		scope: normalizedScope
	}).rows;
	const bySession = /* @__PURE__ */ new Map();
	for (const row of rows) {
		let group = bySession.get(row.target_session_key);
		if (!group) {
			group = [];
			bySession.set(row.target_session_key, group);
		}
		group.push(row);
	}
	return targetSessionKeys.map((key) => {
		const records = (bySession.get(key) ?? []).map(bindingRowToRecord).filter((record) => record !== null);
		return {
			records,
			requiresPrune: records.some((record) => isBindingExpired(record))
		};
	});
}
/** Reread after writer admission; malformed rows keep the same expiry-triggered repair contract. */
function pruneCurrentConversationBindingListInTransaction(db, targetSessionKey, scope) {
	const rows = listCurrentConversationBindingRowsBySession(db, targetSessionKey, scope);
	const active = [];
	for (const row of rows) {
		const record = bindingRowToRecord(row);
		if (!record || isBindingExpired(record)) {
			getCurrentConversationBindingQueries(db).remove(row.binding_key);
			currentConversationBindingPublication.stage(db, [{
				key: row.binding_key,
				current: null,
				previousTargetSessionKey: row.target_session_key
			}]);
		} else active.push(record);
	}
	return active;
}
/** Same-target refreshes preserve committed metadata; target replacements do not inherit it. */
function bindCurrentConversationInDatabase(db, input, admit) {
	return updateCurrentConversationBindingRecordInDatabase(db, input.record.conversation, (current) => applyCurrentConversationBindingBind(current, input, admit)).current;
}
function applyCurrentConversationBindingBind(current, input, admit) {
	const record = input.record;
	assertExpectedCurrentBinding(current, input.expected);
	const previous = current?.targetSessionKey === record.targetSessionKey && current.targetKind === record.targetKind ? current : void 0;
	const metadata = {
		...previous?.metadata,
		...record.metadata
	};
	for (const key of input.metadataKeys ?? []) metadata[key] = record.metadata?.[key];
	const declaredAgentId = normalizeOptionalString(record.metadata?.agentId);
	const previousAgentId = typeof previous?.metadata?.agentId === "string" ? previous.metadata.agentId : void 0;
	const requiresAgentId = Boolean(input.accountPolicy && declaredAgentId === void 0 && previousAgentId === void 0 && !isPluginOwnedBindingMetadata(metadata));
	admit?.(requiresAgentId);
	if (input.accountPolicy) {
		metadata.agentId = declaredAgentId ?? previousAgentId ?? (requiresAgentId ? input.accountPolicy.inferredAgentId : void 0);
		for (const key of ["label", "boundBy"]) metadata[key] = normalizeOptionalString(record.metadata?.[key]) ?? (typeof previous?.metadata?.[key] === "string" ? previous.metadata[key] : void 0);
	}
	return {
		...record,
		metadata
	};
}
function removeCurrentConversationBindingsInDatabase(db, input) {
	if ("conversation" in input) {
		const { previous, current } = updateCurrentConversationBindingRecordInDatabase(db, input.conversation, (latest) => {
			assertExpectedCurrentBinding(latest, input.expected);
			return !input.bindingId || latest?.bindingId === input.bindingId ? null : latest;
		});
		return previous && !current ? [previous] : [];
	}
	const rows = listCurrentConversationBindingRowsBySession(db, input.targetSessionKey, input.scope, input.genericOnly);
	const removed = [];
	for (const row of rows) {
		const record = bindingRowToRecord(row);
		if (input.genericOnly && !record?.bindingId.startsWith("generic:")) continue;
		getCurrentConversationBindingQueries(db).remove(row.binding_key);
		currentConversationBindingPublication.stage(db, [{
			key: row.binding_key,
			current: null,
			previousTargetSessionKey: row.target_session_key
		}]);
		if (record && !isBindingExpired(record)) removed.push(record);
	}
	return removed;
}
function assertExpectedCurrentBinding(current, expected) {
	if (expected !== void 0 && JSON.stringify(current) !== JSON.stringify(expected)) throw new SessionBindingError("BINDING_CREATE_FAILED", "Conversation binding changed before the operation could commit; retry against the current binding");
}
//#endregion
export { readSessionBindingInspectionConversation as C, isPluginOwnedSessionBindingRecord as E, normalizeConversationTargetRef as S, isPluginOwnedBindingMetadata as T, withCurrentConversationBindingPublication as _, inspectCurrentConversationBindingRecordsInDatabase as a, captureConversationRef as b, readCurrentConversationBindingListInDatabase as c, readCurrentConversationBindingSelectionInDatabase as d, removeCurrentConversationBindingsInDatabase as f, currentConversationBindingPublication as g, isSessionBindingError as h, buildBindingId as i, readCurrentConversationBindingListsInDatabase as l, SessionBindingError as m, applyCurrentConversationBindingBind as n, isBindingExpired as o, updateCurrentConversationBindingRecordInDatabase as p, bindCurrentConversationInDatabase as r, pruneCurrentConversationBindingListInTransaction as s, CURRENT_BINDINGS_ID_PREFIX as t, readCurrentConversationBindingResolutionInDatabase as u, withCurrentConversationBindingWorkerReceipt as v, withSessionBindingInspectionConversation as w, normalizeConversationRef as x, buildChannelAccountKey as y };
