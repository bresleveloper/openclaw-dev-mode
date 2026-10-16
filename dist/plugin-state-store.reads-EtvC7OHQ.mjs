import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { a as PluginStateStoreError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { a as bindPluginStateEntry, b as selectPluginStateEntry, c as deleteExpiredPluginStateEntries, d as hasPluginStateEntry, g as parseStoredJson, i as allocatePluginStateNamespaceCreatedAt, l as deletePluginStateEntry, m as iteratePluginStateEntries, s as createPluginStateError, t as MAX_PLUGIN_STATE_VALUE_BYTES, u as getPluginStateKysely, v as rowToEntry, x as upsertPluginStateEntry, y as selectPluginStateEntriesInKeyRange } from "./plugin-state-store.kernel-DUORZ5yM.mjs";
import { c as updatePluginStateEntry, u as enforcePostRegisterLimits } from "./plugin-state-store.mutations-BHk3kTNw.mjs";
import { f as serializePluginStoreJson, m as validatePluginStoreKey } from "./plugin-state-store.validation-BnCg_tof.mjs";
import { toUSVString } from "node:util";
import { createHash } from "node:crypto";
//#region src/plugin-state/plugin-state-store.comparison.ts
const COMPARISON_PATTERN = /^1:([a-f0-9]{64}):([a-f0-9]{64}|-)$/u;
function validatePluginStateComparison(value, operation) {
	const scope = (typeof value === "string" ? COMPARISON_PATTERN.exec(value) : null)?.[1];
	if (!scope) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation,
		message: "Plugin state comparison must be an observation returned by this store."
	});
	return scope;
}
function digest(value) {
	return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function comparisonScope(storeIdentity, key) {
	return digest([
		storeIdentity,
		key.pluginId,
		key.namespace,
		key.key
	]);
}
function observation(store, scope, row, operation) {
	const image = row ? digest([
		row.value_json,
		row.created_at,
		row.expires_at
	]) : "-";
	return {
		value: row ? parseStoredJson(row.value_json, operation, store.path) : void 0,
		comparison: `1:${scope}:${image}`
	};
}
/** Called after canonical writable admission, with the native owner's recorded database identity. */
function observePluginStateEntry(store, params, storeIdentity) {
	return observation(store, comparisonScope(storeIdentity, params), selectPluginStateEntry(store.db, {
		...params,
		now: Date.now()
	}), "lookup");
}
/** The caller owns the IMMEDIATE transaction containing comparison, expiry, quotas and mutation. */
function compareAndApplyPluginStateEntry(store, params, storeIdentity) {
	const operation = params.operation === "update" ? "register" : "delete";
	const expected = validatePluginStateComparison(params.comparison, operation);
	const scope = comparisonScope(storeIdentity, params);
	if (expected !== scope) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation,
		path: store.path,
		message: "Plugin state observation belongs to another database, namespace or key."
	});
	const now = Date.now();
	const row = selectPluginStateEntry(store.db, {
		...params,
		now
	});
	const current = observation(store, scope, row, params.operation === "update" ? "lookup" : "delete");
	if (current.comparison !== params.comparison) return {
		status: "conflict",
		current
	};
	if (params.operation === "delete") return { status: params.action === "delete" && row && deletePluginStateEntry(store.db, params) > 0 ? "applied" : "unchanged" };
	deleteExpiredPluginStateEntries(store.db, now, params);
	if (params.action === "keep") return { status: "unchanged" };
	updatePluginStateEntry(store, params, now, row !== void 0);
	return { status: "applied" };
}
//#endregion
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
function prepareSequencedEntry(params, sequence) {
	const fields = JSON.parse(params.journalValueJson);
	if (!isRecord(fields)) throw journalValueErrors.invalid("Plugin state journal value must be an object without a sequence field.");
	const journalKey = validatePluginStoreKey({
		value: `${params.journalKeyPrefix}${sequence.toString().padStart(16, "0")}`,
		label: "plugin state",
		invalid: journalValueErrors.invalid
	});
	return {
		cursorValueJson: serializeJournalValue({
			kind: "cursor",
			lastSequence: sequence
		}),
		journalKey,
		journalValueJson: serializeJournalValue({
			...fields,
			sequence
		})
	};
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
	const prepared = prepareSequencedEntry(params, sequence);
	if (prepared.journalKey < params.journalKeyRange.keyStartInclusive || prepared.journalKey >= params.journalKeyRange.keyEndExclusive) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "register",
		message: "Plugin state journal key must be inside its retained key range."
	});
	if (hasPluginStateEntry(store.db, {
		...journalScope,
		key: prepared.journalKey,
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
		valueJson: prepared.cursorValueJson,
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
		key: prepared.journalKey,
		valueJson: prepared.journalValueJson,
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
		protectedKey: prepared.journalKey
	});
	return sequence;
}
//#endregion
//#region src/plugin-state/plugin-state-store.reads.ts
function lookupPluginStateEntries(store, params) {
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
//#endregion
export { preparePluginStateJournalValue as a, observePluginStateEntry as c, validatePluginStateKeyRange as i, validatePluginStateComparison as l, listPluginStateEntriesInKeyRange as n, registerPluginStateSequencedJournalEntryInDatabase as o, lookupPluginStateEntries as r, compareAndApplyPluginStateEntry as s, listPluginStateEntries as t };
