import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as sqliteStringSet, f as sqliteStringSetEntries, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, n as createSqliteQueryCache } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as createPluginStateError, r as parseStoredJson, t as PluginStateStoreError } from "./plugin-state-error-Wxkh7e3f.mjs";
import { r as jsonArrayTextElement } from "./json-values-BQ6WshKk.mjs";
import { a as assertPluginStateKey, b as selectPluginStateEntry, c as deleteExpiredPluginStateEntries, d as getPluginStateKysely, f as hasPluginStateEntry, h as iteratePluginStateEntries, i as allocatePluginStateNamespaceCreatedAt, o as bindPluginStateEntry, t as MAX_PLUGIN_STATE_VALUE_BYTES, v as rowToEntry, x as upsertPluginStateEntry, y as selectPluginStateEntriesInKeyRange } from "./plugin-state-store.types-CLUTlkgE.mjs";
import { f as serializePluginStoreJson, m as validatePluginStoreKey } from "./plugin-state-store.validation-CbLRb9U1.mjs";
import { f as enforcePostRegisterLimits } from "./plugin-state-store.mutations-B1cPWhts.mjs";
import { toUSVString } from "node:util";
//#region src/plugin-state/plugin-state-store.journal.ts
const journalValueErrors = {
	invalid: (message) => createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "register",
		message
	}),
	limit: (message) => createPluginStateError({
		code: "PLUGIN_STATE_LIMIT_EXCEEDED",
		operation: "register",
		message
	})
};
function serializeJournalValue(value) {
	return serializePluginStoreJson({
		value,
		label: "plugin state value",
		maxBytes: MAX_PLUGIN_STATE_VALUE_BYTES,
		errors: journalValueErrors
	});
}
/** Capture caller data before worker admission; allocation owns the sequence field. */
function preparePluginStateJournalValue(value) {
	if (!isRecord(value) || Object.hasOwn(value, "sequence")) throw journalValueErrors.invalid("Plugin state journal value must be an object without a sequence field.");
	return serializeJournalValue(value);
}
function readCursorSequence(valueJson) {
	try {
		const value = JSON.parse(valueJson);
		return isRecord(value) && value.kind === "cursor" && typeof value.lastSequence === "number" && Number.isSafeInteger(value.lastSequence) ? value.lastSequence : void 0;
	} catch {
		return;
	}
}
/** The worker owns the transaction containing allocation, both writes, and retention. */
function registerPluginStateSequencedJournalEntryInDatabase(store, params) {
	const now = Date.now();
	const cursorScope = {
		pluginId: params.pluginId,
		namespace: params.cursorNamespace,
		maxEntries: params.cursorMaxEntries
	};
	const journalScope = {
		pluginId: params.pluginId,
		namespace: params.journalNamespace,
		maxEntries: params.journalMaxEntries
	};
	deleteExpiredPluginStateEntries(store.db, now, cursorScope);
	deleteExpiredPluginStateEntries(store.db, now, journalScope);
	const cursor = selectPluginStateEntry(store.db, {
		...cursorScope,
		key: params.cursorKey,
		now
	});
	const cursorSequence = cursor ? readCursorSequence(cursor.value_json) : void 0;
	const tail = selectPluginStateEntriesInKeyRange(store.db, {
		...journalScope,
		...params.journalKeyRange,
		limit: 1,
		order: "desc",
		now
	})[0];
	let retainedSequence = 0;
	if (tail) {
		const value = parseStoredJson(tail.value_json, "entries", store.path);
		if (value === null) throw new TypeError("Plugin state journal tail must not be null.");
		if (typeof value === "object" && (params.journalKeyRange.valueKind === void 0 || "kind" in value && value.kind === params.journalKeyRange.valueKind)) {
			retainedSequence = Math.max(0, Number("sequence" in value ? value.sequence ?? 0 : 0));
			if (!Number.isSafeInteger(retainedSequence)) throw createPluginStateError({
				code: "PLUGIN_STATE_INVALID_INPUT",
				operation: "register",
				message: "Plugin state journal sequence must be a safe non-negative integer."
			});
		}
	}
	const sequence = Math.max(retainedSequence, cursorSequence ?? 0) + 1;
	if (!Number.isSafeInteger(sequence)) throw new RangeError("Plugin state journal sequence exhausted safe integer range");
	const fields = JSON.parse(params.journalValueJson);
	if (!isRecord(fields)) throw journalValueErrors.invalid("Plugin state journal value must be an object without a sequence field.");
	const journalKey = validatePluginStoreKey({
		value: `${params.journalKeyPrefix}${sequence.toString().padStart(16, "0")}`,
		label: "plugin state",
		invalid: journalValueErrors.invalid
	});
	const cursorValueJson = serializeJournalValue({
		kind: "cursor",
		lastSequence: sequence
	});
	const journalValueJson = serializeJournalValue({
		...fields,
		sequence
	});
	if (journalKey < params.journalKeyRange.keyStartInclusive || journalKey >= params.journalKeyRange.keyEndExclusive) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "register",
		message: "Plugin state journal key must be inside its retained key range."
	});
	if (hasPluginStateEntry(store.db, {
		...journalScope,
		key: journalKey,
		now
	})) throw createPluginStateError({
		code: "PLUGIN_STATE_WRITE_FAILED",
		operation: "register",
		message: "Plugin state journal sequence already exists.",
		path: store.path
	});
	upsertPluginStateEntry(store.db, bindPluginStateEntry({
		...cursorScope,
		key: params.cursorKey,
		valueJson: cursorValueJson,
		createdAt: now,
		expiresAt: null
	}));
	enforcePostRegisterLimits({
		store,
		...cursorScope,
		overflowPolicy: "evict-oldest",
		now,
		protectedKey: params.cursorKey
	});
	upsertPluginStateEntry(store.db, bindPluginStateEntry({
		...journalScope,
		key: journalKey,
		valueJson: journalValueJson,
		createdAt: allocatePluginStateNamespaceCreatedAt(store.db, {
			...journalScope,
			now
		}),
		expiresAt: null
	}));
	enforcePostRegisterLimits({
		store,
		...journalScope,
		overflowPolicy: "evict-oldest",
		now,
		protectedKey: journalKey
	});
	return sequence;
}
//#endregion
//#region src/plugin-state/plugin-state-store.reads.ts
function lookupPluginStateEntries(store, params) {
	for (const key of params.keys) assertPluginStateKey(store.db, key, "lookup");
	const now = Date.now();
	const rows = executeSqliteQuerySync(store.db, getPluginStateKysely(store.db).selectFrom("plugin_state_entries").select(["entry_key", "value_json"]).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "in", sqliteStringSet(params.keys)).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", now)]))).rows;
	const values = new Map(rows.map((row) => [row.entry_key, row.value_json]));
	return params.keys.map((key) => {
		const raw = values.get(toUSVString(key));
		try {
			return ok(raw === void 0 ? void 0 : parseStoredJson(raw, "lookup", store.path));
		} catch (error) {
			if (error instanceof PluginStateStoreError && error.code === "PLUGIN_STATE_CORRUPT") return err(error);
			throw error;
		}
	});
}
function listPluginStateEntries(store, params) {
	const rows = iteratePluginStateEntries(store.db, {
		...params,
		now: Date.now()
	});
	const entries = [];
	let decodeFailure;
	for (const row of rows) {
		if (decodeFailure) continue;
		try {
			entries.push(rowToEntry(row, "entries", store.path));
		} catch (error) {
			decodeFailure = { error };
		}
	}
	if (decodeFailure) throw decodeFailure.error;
	return entries;
}
function validatePluginStateKeyRange(params) {
	if (!Number.isSafeInteger(params.limit) || params.limit < 1) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "entries",
		message: "Plugin state key-range limit must be a positive safe integer."
	});
	if (typeof params.keyStartInclusive !== "string" || typeof params.keyEndExclusive !== "string" || Buffer.compare(Buffer.from(params.keyStartInclusive), Buffer.from(params.keyEndExclusive)) >= 0) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "entries",
		message: "Plugin state key range must have an increasing exclusive upper bound."
	});
	if (params.order !== void 0 && params.order !== "asc" && params.order !== "desc") throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "entries",
		message: "Plugin state key-range order must be asc or desc."
	});
}
function listPluginStateEntriesInKeyRange(store, params) {
	return selectPluginStateEntriesInKeyRange(store.db, {
		...params,
		order: params.order ?? "asc",
		now: Date.now()
	}).map((row) => rowToEntry(row, "entries", store.path));
}
const pluginStateBatchQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).selectFrom(sqliteStringSetEntries(parameter((value) => value.entriesJson)).as("requested")).crossJoin("plugin_state_entries").where("plugin_id", "=", parameter((value) => value.pluginId)).where((eb) => eb("namespace", "=", jsonArrayTextElement(db, eb.ref("requested.value"), 0))).where((eb) => eb("entry_key", "=", jsonArrayTextElement(db, eb.ref("requested.value"), 1))).select([
	"requested.key as position",
	"entry_key",
	"value_json",
	"created_at",
	"expires_at"
]).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", parameter((value) => value.now))]))));
function selectPluginStateBatchRows(store, entries, now) {
	const first = entries[0];
	if (!first) return [];
	for (const entry of entries) assertPluginStateKey(store.db, entry.key, "lookup");
	const rows = new Map(pluginStateBatchQuery(store.db)({
		pluginId: first.pluginId,
		entriesJson: JSON.stringify(entries.map(({ namespace, key }) => [namespace, key])),
		now
	}).rows.map((row) => [row.position, row]));
	return entries.map((_, index) => rows.get(index));
}
//#endregion
export { validatePluginStateKeyRange as a, selectPluginStateBatchRows as i, listPluginStateEntriesInKeyRange as n, preparePluginStateJournalValue as o, lookupPluginStateEntries as r, registerPluginStateSequencedJournalEntryInDatabase as s, listPluginStateEntries as t };
