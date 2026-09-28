import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { o as closeOpenClawStateDatabaseAsync } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import "./openclaw-state-db-BFK9cMiV.mjs";
import { A as enforcePostRegisterLimits, B as isRetainedPluginStateNamespace, C as validatePluginStoreNamespace, D as validatePluginStateComparison, F as bindPluginStateEntry, G as selectPluginStateEntry, H as parseStoredJson, I as countLivePluginStateNamespaceEntries, K as upsertPluginStateEntry, L as deleteExpiredPluginStateEntries, M as registerPluginStateEntry, N as MAX_PLUGIN_STATE_VALUE_BYTES, O as assertCanInsertPluginStateEntry, P as RETAINED_PLUGIN_STATE_NAMESPACE_PREFIX, R as deletePluginStateEntry, S as validatePluginStoreKey, U as resolvePluginStateExpiresAtMs, V as lookupPluginStateEntry, W as selectPluginStateEntriesInKeyRange, _ as preparePluginStateJournalValue, a as clearPluginStateNamespace, b as serializePluginStoreJson, d as withPluginStateDatabaseReadOnly, f as wrapPluginStateError, g as validatePluginStateKeyRange, h as lookupPluginStateEntries, i as pluginStateWorkerOperations, j as readPluginStateRetention, k as countLivePluginStateEntries, l as registerPluginStateEntryIfAbsent, n as restorePluginStateWorkerFailure, o as consumePluginStateEntry, p as listPluginStateEntries, q as PluginStateStoreError, u as runWriteTransaction, x as validateOptionalPluginStoreTtlMs, y as createPluginStoreOptionPolicy, z as getPluginStateKysely } from "./plugin-state-worker-errors-DPQ69K6p.mjs";
import { toUSVString } from "node:util";
function envOptions(env) {
	return env ? { env } : {};
}
function readPluginState(operation, message, read, env) {
	const pathname = resolveOpenClawStateSqlitePath(env ?? process.env);
	try {
		return withPluginStateDatabaseReadOnly(operation, read, envOptions(env));
	} catch (error) {
		throw wrapPluginStateError(error, operation, "PLUGIN_STATE_READ_FAILED", message, pathname);
	}
}
function writePluginState(operation, message, write, env) {
	try {
		return runWriteTransaction(operation, write, envOptions(env));
	} catch (error) {
		throw wrapPluginStateError(error, operation, operation === "consume" ? "PLUGIN_STATE_READ_FAILED" : "PLUGIN_STATE_WRITE_FAILED", message);
	}
}
function pluginStateRegister(params) {
	writePluginState("register", "Failed to register plugin state entry.", (store) => registerPluginStateEntry(store, params), params.env);
}
/** Prepared doctor rows only: validation and plugin-owned accessors run before BEGIN. */
function pluginStateImportBatch(params, entries) {
	if (entries.length === 0) return;
	if (entries.length > 500) throw new RangeError("Plugin state doctor import batch exceeds its row limit");
	try {
		const result = runWriteTransaction("register", (store) => {
			const retention = readPluginStateRetention(store.db, {
				...params,
				now: Date.now()
			});
			for (const entry of entries) try {
				runSqliteImmediateTransactionSync(store.db, () => registerPluginStateEntry(store, {
					...params,
					...entry
				}, retention));
			} catch (error) {
				if (!store.db.isOpen || !store.db.isTransaction || isSqliteCorruptionError(error)) throw error;
				return err(error);
			}
			return ok(void 0);
		}, envOptions(params.env));
		if (!result.ok) throw result.error;
	} catch (error) {
		throw wrapPluginStateError(error, "register", "PLUGIN_STATE_WRITE_FAILED", "Failed to register plugin state entry.");
	}
}
function pluginStateRegisterIfAbsent(params) {
	return writePluginState("register", "Failed to register plugin state entry.", (store) => registerPluginStateEntryIfAbsent(store, params), params.env);
}
function pluginStateUpdate(params) {
	return writePluginState("register", "Failed to update plugin state entry.", (store) => {
		const now = Date.now();
		deleteExpiredPluginStateEntries(store.db, now, {
			pluginId: params.pluginId,
			namespace: params.namespace
		});
		const existing = selectPluginStateEntry(store.db, {
			pluginId: params.pluginId,
			namespace: params.namespace,
			key: params.key,
			now
		});
		const next = params.updateValueJson(existing ? parseStoredJson(existing.value_json, "lookup", store.path) : void 0);
		if (!next) return false;
		if (!existing) assertCanInsertPluginStateEntry({
			store,
			pluginId: params.pluginId,
			namespace: params.namespace,
			maxEntries: params.maxEntries,
			overflowPolicy: params.overflowPolicy,
			now
		});
		const expiresAt = resolvePluginStateExpiresAtMs({
			ttlMs: next.ttlMs,
			namespace: params.namespace,
			now,
			operation: "register",
			path: store.path
		});
		upsertPluginStateEntry(store.db, bindPluginStateEntry({
			pluginId: params.pluginId,
			namespace: params.namespace,
			key: params.key,
			valueJson: next.valueJson,
			createdAt: now,
			expiresAt
		}));
		enforcePostRegisterLimits({
			store,
			pluginId: params.pluginId,
			namespace: params.namespace,
			maxEntries: params.maxEntries,
			overflowPolicy: params.overflowPolicy,
			now,
			protectedKey: params.key
		});
		return true;
	}, params.env);
}
function pluginStateLookup(params) {
	return readPluginState("lookup", "Failed to read plugin state entry.", (store) => lookupPluginStateEntry(store, params), params.env);
}
function pluginStateLookupMany(params) {
	if (params.keys.length === 0) return [];
	return readPluginState("lookup", "Failed to read plugin state entries.", (store) => lookupPluginStateEntries(store, params), params.env) ?? params.keys.map(() => ok(void 0));
}
function pluginStateConsume(params) {
	return writePluginState("consume", "Failed to consume plugin state entry.", (store) => consumePluginStateEntry(store, params), params.env);
}
function pluginStateDelete(params) {
	return writePluginState("delete", "Failed to delete plugin state entry.", ({ db }) => {
		return deletePluginStateEntry(db, params) > 0;
	}, params.env);
}
function pluginStateDeleteIf(params) {
	return writePluginState("delete", "Failed to conditionally delete plugin state entry.", ({ db, path: databasePath }) => {
		const row = selectPluginStateEntry(db, {
			pluginId: params.pluginId,
			namespace: params.namespace,
			key: params.key,
			now: Date.now()
		});
		if (!row || !params.predicate(parseStoredJson(row.value_json, "delete", databasePath))) return false;
		return deletePluginStateEntry(db, params) > 0;
	}, params.env);
}
/** Deletes one bounded set of exact observed rows in a single synchronous transaction. */
function pluginStateDeleteEntriesIfUnchanged(params) {
	if (params.entries.length > 512) throw new RangeError(`Plugin state bulk deletion cannot exceed 512 entries.`);
	if (params.entries.length === 0) return {
		deleted: 0,
		changed: 0
	};
	const observed = params.entries.map(({ value: _value, ...entry }) => entry);
	return runWriteTransaction("delete", ({ db }) => {
		params.assertOwnedInTransaction(db);
		let deleted = 0;
		for (const entry of observed) {
			let query = getPluginStateKysely(db).deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", entry.key).where("value_json", "=", entry.valueJson).where("created_at", "=", entry.createdAt);
			query = entry.expiresAt === null ? query.where("expires_at", "is", null) : query.where("expires_at", "=", entry.expiresAt);
			deleted += Number(executeSqliteQuerySync(db, query).numAffectedRows ?? 0);
		}
		return {
			deleted,
			changed: observed.length - deleted
		};
	}, envOptions(params.env));
}
/** Doctor-only bounded raw read keeps malformed rows visible and preserves exact CAS bytes. */
function pluginStateDoctorEntriesInKeyRange(params) {
	if (!params.prefix || !Number.isSafeInteger(params.limit) || params.limit < 1 || params.limit > 512 || params.after !== void 0 && !params.after.startsWith(params.prefix)) throw new RangeError(`Plugin doctor state reads require a valid prefix and a limit of 1-512.`);
	return readPluginStateRowsInKeyRange({
		...params,
		keyStartInclusive: params.after === void 0 ? params.prefix : `${params.after}\0`,
		keyEndExclusive: `${params.prefix}\uffff`
	}, (row) => {
		const createdAt = normalizeSqliteNumber(row.created_at);
		const expiresAt = normalizeSqliteNumber(row.expires_at);
		const entry = {
			key: row.entry_key,
			valueJson: row.value_json,
			createdAt: createdAt ?? 0,
			expiresAt: expiresAt ?? null
		};
		if (!Number.isSafeInteger(createdAt) || (createdAt ?? -1) < 0 || row.expires_at !== null && !Number.isSafeInteger(expiresAt)) return entry;
		try {
			entry.value = JSON.parse(row.value_json);
		} catch {}
		return entry;
	});
}
function pluginStateCount(params) {
	return readPluginState("count", "Failed to count plugin state entries.", ({ db }) => countLivePluginStateNamespaceEntries(db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		now: Date.now()
	}), params.env) ?? 0;
}
function pluginStateEntries(params) {
	return readPluginState("entries", "Failed to list plugin state entries.", (store) => listPluginStateEntries(store, params), params.env) ?? [];
}
function readPluginStateRowsInKeyRange(params, mapRow) {
	validatePluginStateKeyRange(params);
	return readPluginState("entries", "Failed to list plugin state entries by key range.", ({ db, path: databasePath }) => selectPluginStateEntriesInKeyRange(db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		keyStartInclusive: params.keyStartInclusive,
		keyEndExclusive: params.keyEndExclusive,
		limit: params.limit,
		order: params.order ?? "asc",
		now: Date.now()
	}).map((row) => mapRow(row, databasePath)), params.env) ?? [];
}
function pluginStateClear(params) {
	writePluginState("clear", "Failed to clear plugin state namespace.", ({ db }) => clearPluginStateNamespace(db, params), params.env);
}
function getPluginStateCapacity(pluginId, env) {
	return {
		liveEntries: readPluginState("entries", "Failed to count plugin state entries.", ({ db }) => countLivePluginStateEntries(db, {
			pluginId,
			now: Date.now()
		}), env) ?? 0,
		maxEntries: Number.POSITIVE_INFINITY
	};
}
async function closePluginStateDatabaseAsync() {
	await closeOpenClawStateDatabaseAsync();
}
//#endregion
//#region src/plugin-state/plugin-state-store.validation.ts
function invalidInput(message, operation = "register") {
	return new PluginStateStoreError(message, {
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation
	});
}
function validateNamespace(value, operation = "open") {
	return validatePluginStoreNamespace({
		value,
		label: "plugin state",
		errors: {
			invalid: (message) => invalidInput(message, operation),
			limit: (message) => invalidInput(message, operation)
		}
	});
}
function requireBoundedOptions(options) {
	if (options.retention !== void 0 && options.retention !== "bounded") throw invalidInput("This plugin state operation requires a bounded store.", "open");
}
function validateKey(value, operation = "register") {
	return validatePluginStoreKey({
		value,
		label: "plugin state",
		errors: {
			invalid: (message) => invalidInput(message, operation),
			limit: (message) => invalidInput(message, operation)
		}
	});
}
function validateMaxEntries(value) {
	if (!Number.isInteger(value) || value < 1) throw invalidInput("plugin state maxEntries must be an integer >= 1", "open");
	return value;
}
const optionPolicy = createPluginStoreOptionPolicy({
	label: "plugin state",
	invalid: (message) => invalidInput(message, "open")
});
function validateOptionalTtlMs(value, operation = "register") {
	return validateOptionalPluginStoreTtlMs({
		value,
		label: "plugin state ttlMs",
		errors: {
			invalid: (message) => invalidInput(message, operation),
			limit: (message) => invalidInput(message, operation)
		}
	});
}
function prepareRegisterParams(key, value, defaultTtlMs, opts, namespace) {
	const normalizedKey = validateKey(key, "register");
	const json = serializePluginStoreJson({
		value,
		label: "plugin state value",
		maxBytes: MAX_PLUGIN_STATE_VALUE_BYTES,
		errors: {
			invalid: (message) => invalidInput(message, "register"),
			limit: (message) => new PluginStateStoreError(message, {
				code: "PLUGIN_STATE_LIMIT_EXCEEDED",
				operation: "register"
			})
		}
	});
	const ttlMs = validateOptionalTtlMs(opts?.ttlMs, "register") ?? defaultTtlMs;
	if (namespace && isRetainedPluginStateNamespace(namespace) && ttlMs !== void 0) throw invalidInput("Retained plugin state does not accept a TTL.");
	return {
		key: normalizedKey,
		valueJson: json,
		...ttlMs != null ? { ttlMs } : {}
	};
}
function prepareLookupKeys(keys) {
	if (keys.length > 1e4) throw invalidInput("plugin state lookupMany accepts at most 10000 keys", "lookup");
	return Array.from(keys, (key) => validateKey(key, "lookup"));
}
function prepareKeyedStoreOptions(pluginId, options) {
	const logicalNamespace = validateNamespace(options.namespace);
	if (options.retention === "retained") {
		if (options.maxEntries !== void 0 || options.overflowPolicy !== void 0 || options.defaultTtlMs !== void 0) throw invalidInput("Retained plugin state does not accept count, overflow or TTL options.", "open");
		return {
			pluginId,
			namespace: `${RETAINED_PLUGIN_STATE_NAMESPACE_PREFIX}${logicalNamespace}`,
			maxEntries: void 0,
			overflowPolicy: "evict-oldest",
			env: options.env
		};
	}
	requireBoundedOptions(options);
	const namespace = logicalNamespace;
	const maxEntries = validateMaxEntries(options.maxEntries);
	const overflowPolicy = optionPolicy.resolveOverflowPolicy(options.overflowPolicy);
	const defaultTtlMs = validateOptionalTtlMs(options.defaultTtlMs);
	const env = options.env;
	optionPolicy.assertConsistent(pluginId, namespace, {
		maxEntries,
		overflowPolicy,
		defaultTtlMs
	});
	return {
		pluginId,
		namespace,
		maxEntries,
		overflowPolicy,
		defaultTtlMs,
		env
	};
}
//#endregion
//#region src/plugin-state/plugin-state-worker-client.ts
async function execute({ env, assertActive }, name, dispatch, missing, checks = {}) {
	const { assertCurrent, isObservation } = checks;
	const assertAdmission = assertCurrent ? () => {
		assertActive?.();
		assertCurrent();
	} : assertActive;
	assertAdmission?.();
	const databasePath = resolveOpenClawStateSqlitePath(env ?? process.env);
	const description = pluginStateWorkerOperations[name];
	let dispatched = false;
	try {
		const context = captureOpenClawStateWorkerContext({
			path: databasePath,
			env
		});
		const [{ runOpenClawStateWorkerOperation }, { createSqliteWorkerWriteAdmission }] = await Promise.all([import("./openclaw-state-worker-store-BgU7tLf5.mjs"), import("./sqlite-worker-store-ID7IGMTW.mjs")]);
		const operation = async (scope) => {
			dispatched = true;
			const result = await dispatch(scope);
			if (!result.ok) throw restorePluginStateWorkerFailure(result.error);
			return result.value;
		};
		if (missing) {
			const result = await runOpenClawStateWorkerOperation(context, operation, {
				existingOnly: true,
				assertCurrent: assertAdmission
			});
			assertActive?.();
			return result === void 0 ? missing() : result;
		}
		const result = await runOpenClawStateWorkerOperation(context, operation, {
			assertCurrent: assertAdmission,
			requireStateLifecycle: true,
			createAdmission: createSqliteWorkerWriteAdmission(() => {
				context.admission.assertCurrent();
				assertAdmission?.();
			}, [databasePath])
		});
		if (isObservation?.(result)) assertAdmission?.();
		return result;
	} catch (error) {
		throw wrapPluginStateError(error, description.operation, dispatched ? description.code : "PLUGIN_STATE_OPEN_FAILED", dispatched ? description.message : "Failed to open the plugin state database.", databasePath);
	}
}
function registerPluginStateInWorker(params) {
	const { env, assertActive, assertCurrent, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.register", (scope) => scope.execute({
		type: "pluginState.register",
		input
	}), void 0, { assertCurrent });
}
function observePluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.observe", (scope) => scope.execute({
		type: "pluginState.observe",
		input
	}), void 0, { isObservation: () => true });
}
function comparePluginStateUpdateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.compareUpdate", (scope) => scope.execute({
		type: "pluginState.compareUpdate",
		input
	}), void 0, { isObservation: (result) => result.status === "conflict" });
}
function comparePluginStateDeleteInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.compareDelete", (scope) => scope.execute({
		type: "pluginState.compareDelete",
		input
	}), void 0, { isObservation: (result) => result.status === "conflict" });
}
function registerPluginStateIfAbsentInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.registerIfAbsent", (scope) => scope.execute({
		type: "pluginState.registerIfAbsent",
		input
	}));
}
function deletePluginStateIfEqualInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.deleteIfEqual", (scope) => scope.execute({
		type: "pluginState.deleteIfEqual",
		input
	}));
}
function lookupPluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.lookup", (scope) => scope.execute({
		type: "pluginState.lookup",
		input
	}), () => void 0);
}
async function lookupManyPluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	params.assertActive?.();
	if (input.keys.length === 0) return [];
	return (await execute({
		env,
		assertActive
	}, "pluginState.lookupMany", (scope) => scope.execute({
		type: "pluginState.lookupMany",
		input
	}), () => input.keys.map(() => ok(void 0)))).map((result) => result.ok ? result : err(restorePluginStateWorkerFailure(result.error)));
}
function consumePluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.consume", (scope) => scope.execute({
		type: "pluginState.consume",
		input
	}));
}
function deletePluginStateInWorker(params) {
	const { env, assertActive, assertCurrent, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.delete", (scope) => scope.execute({
		type: "pluginState.delete",
		input
	}), void 0, { assertCurrent });
}
function listPluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.entries", (scope) => scope.execute({
		type: "pluginState.entries",
		input
	}), () => []);
}
function clearPluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.clear", (scope) => scope.execute({
		type: "pluginState.clear",
		input
	}));
}
function sweepExpiredPluginStateEntriesInWorker(params = {}) {
	return execute(params, "pluginState.sweep", (scope) => scope.execute({
		type: "pluginState.sweep",
		input: void 0
	}));
}
function countPluginStateInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.count", (scope) => scope.execute({
		type: "pluginState.count",
		input
	}), () => 0);
}
function registerPluginStateJournalInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.appendJournal", (scope) => scope.execute({
		type: "pluginState.appendJournal",
		input
	}));
}
function listPluginStateInKeyRangeInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.entriesInKeyRange", (scope) => scope.execute({
		type: "pluginState.entriesInKeyRange",
		input
	}), () => []);
}
function movePluginStateEntriesInWorker(params) {
	const { env, assertActive, ...input } = params;
	return execute({
		env,
		assertActive
	}, "pluginState.moveEntries", (scope) => scope.execute({
		type: "pluginState.moveEntries",
		input
	}));
}
//#endregion
//#region src/plugin-state/plugin-state-store.ts
function createKeyedStoreForPluginId(pluginId, options, assertActive) {
	const prepared = prepareKeyedStoreOptions(pluginId, options);
	const assertRetainedActive = options.retention === "retained" ? assertActive : void 0;
	const store = createSyncKeyedStore(prepared, assertRetainedActive);
	return {
		...createAsyncKeyedStore(prepared, assertRetainedActive, assertActive),
		withCurrent: ({ assertCurrent }) => {
			if (typeof assertCurrent !== "function") throw invalidInput("Plugin state action authority requires assertCurrent.");
			const assertBoundCurrent = () => {
				assertActive?.();
				assertCurrent();
			};
			assertBoundCurrent();
			return createAsyncKeyedStore(prepared, assertBoundCurrent);
		},
		update: async (...args) => store.update(...args),
		deleteIf: async (...args) => store.deleteIf(...args)
	};
}
function createAsyncKeyedStore(prepared, assertActive, assertRangeActive = assertActive) {
	const scope = {
		pluginId: prepared.pluginId,
		namespace: prepared.namespace,
		env: prepared.env,
		assertActive
	};
	return {
		observe: async (key) => {
			return await observePluginStateInWorker({
				...scope,
				key: validateKey(key, "lookup")
			});
		},
		compareAndApply: async (key, comparison, intent) => {
			if (intent?.operation !== "update" && intent?.operation !== "delete") throw invalidInput("Plugin state comparison requires an update or delete intent.");
			const operation = intent.operation === "update" ? "register" : "delete";
			const normalizedKey = validateKey(key, operation);
			validatePluginStateComparison(comparison, operation);
			const common = {
				...scope,
				key: normalizedKey,
				comparison,
				maxEntries: prepared.maxEntries,
				overflowPolicy: prepared.overflowPolicy
			};
			let result;
			if (intent.operation === "update" && intent.action === "set") {
				const next = prepareRegisterParams(normalizedKey, intent.value, prepared.defaultTtlMs, { ttlMs: intent.ttlMs }, prepared.namespace);
				result = await comparePluginStateUpdateInWorker({
					...common,
					...next,
					operation: "update",
					action: "set"
				});
			} else if (intent.operation === "update" && intent.action === "keep") result = await comparePluginStateUpdateInWorker({
				...common,
				operation: "update",
				action: "keep"
			});
			else if (intent.operation === "delete" && (intent.action === "delete" || intent.action === "keep")) result = await comparePluginStateDeleteInWorker({
				...common,
				operation: "delete",
				action: intent.action
			});
			else throw invalidInput("Plugin state comparison has an invalid mutation action.", operation);
			return result;
		},
		register: async (key, value, opts) => {
			const entry = prepareRegisterParams(key, value, prepared.defaultTtlMs, opts, prepared.namespace);
			await registerPluginStateInWorker({
				...scope,
				...entry,
				assertCurrent: opts?.assertCurrent,
				maxEntries: prepared.maxEntries,
				overflowPolicy: prepared.overflowPolicy
			});
		},
		registerIfAbsent: async (key, value, opts) => {
			const entry = prepareRegisterParams(key, value, prepared.defaultTtlMs, opts, prepared.namespace);
			return await registerPluginStateIfAbsentInWorker({
				...scope,
				maxEntries: prepared.maxEntries,
				overflowPolicy: prepared.overflowPolicy,
				...entry
			});
		},
		deleteIfEqual: async (key, expected) => {
			const normalizedKey = validateKey(key, "delete");
			if (expected !== null && ![
				"string",
				"number",
				"boolean"
			].includes(typeof expected)) throw invalidInput("plugin state conditional deletion requires a JSON scalar", "delete");
			serializePluginStoreJson({
				value: expected,
				label: "plugin state comparison value",
				maxBytes: MAX_PLUGIN_STATE_VALUE_BYTES,
				errors: {
					invalid: (message) => invalidInput(message, "delete"),
					limit: (message) => invalidInput(message, "delete")
				}
			});
			return await deletePluginStateIfEqualInWorker({
				...scope,
				key: normalizedKey,
				expected
			});
		},
		lookup: async (key) => {
			const normalizedKey = validateKey(key, "lookup");
			return await lookupPluginStateInWorker({
				...scope,
				key: normalizedKey
			});
		},
		lookupMany: async (keys) => {
			const normalizedKeys = prepareLookupKeys(keys);
			return await lookupManyPluginStateInWorker({
				...scope,
				keys: normalizedKeys
			});
		},
		consume: async (key) => {
			const normalizedKey = validateKey(key, "consume");
			return await consumePluginStateInWorker({
				...scope,
				key: normalizedKey
			});
		},
		delete: async (key, opts) => {
			const normalizedKey = validateKey(key, "delete");
			return await deletePluginStateInWorker({
				...scope,
				key: normalizedKey,
				assertCurrent: opts?.assertCurrent
			});
		},
		entries: async () => {
			return await listPluginStateInWorker(scope);
		},
		entriesInKeyRange: async (range) => {
			const params = {
				...scope,
				keyStartInclusive: range.keyStartInclusive,
				keyEndExclusive: range.keyEndExclusive,
				limit: range.limit,
				order: range.order,
				assertActive: assertRangeActive
			};
			validatePluginStateKeyRange(params);
			return await listPluginStateInKeyRangeInWorker(params);
		},
		moveEntriesFrom: async (source) => {
			assertActive?.();
			if (!isRetainedPluginStateNamespace(prepared.namespace)) throw invalidInput("Plugin state moves require a retained destination.");
			const sourceNamespace = validateNamespace(source.namespace, "register");
			if (source.entries.length > 1e4) throw invalidInput("Plugin state moves accept at most 10000 entries.");
			const targets = /* @__PURE__ */ new Set();
			const sources = /* @__PURE__ */ new Set();
			const entries = source.entries.map(({ sourceKey, targetKey }) => {
				const entry = {
					sourceKey: toUSVString(validateKey(sourceKey)),
					targetKey: toUSVString(validateKey(targetKey))
				};
				if (targets.has(entry.targetKey) || sources.has(entry.sourceKey)) throw invalidInput("Plugin state moves require unique source and target keys.");
				targets.add(entry.targetKey);
				sources.add(entry.sourceKey);
				return entry;
			});
			return movePluginStateEntriesInWorker({
				...scope,
				sourceNamespace,
				entries,
				assertActive
			});
		},
		count: async () => await countPluginStateInWorker(scope),
		clear: async () => {
			await clearPluginStateInWorker(scope);
		}
	};
}
function createSyncKeyedStoreForPluginId(pluginId, options) {
	requireBoundedOptions(options);
	return createSyncKeyedStore(prepareKeyedStoreOptions(pluginId, options));
}
function createSyncKeyedStore({ pluginId, namespace, maxEntries, overflowPolicy, defaultTtlMs, env }, assertActive) {
	const scope = {
		pluginId,
		namespace,
		env
	};
	const writeScope = {
		...scope,
		maxEntries,
		overflowPolicy
	};
	return {
		register(key, value, opts) {
			pluginStateRegister({
				...writeScope,
				...prepareRegisterParams(key, value, defaultTtlMs, opts)
			});
		},
		registerIfAbsent(key, value, opts) {
			return pluginStateRegisterIfAbsent({
				...writeScope,
				...prepareRegisterParams(key, value, defaultTtlMs, opts)
			});
		},
		update(key, updateValue, opts) {
			assertActive?.();
			if (isRetainedPluginStateNamespace(namespace) && opts?.ttlMs !== void 0) throw invalidInput("Retained plugin state does not accept a TTL.");
			const normalizedKey = validateKey(key, "register");
			return pluginStateUpdate({
				...writeScope,
				key: normalizedKey,
				updateValueJson: (current) => {
					const next = updateValue(current);
					assertActive?.();
					return next === void 0 ? void 0 : prepareRegisterParams(normalizedKey, next, defaultTtlMs, opts, namespace);
				}
			});
		},
		deleteIf(key, predicate) {
			assertActive?.();
			return pluginStateDeleteIf({
				...scope,
				key: validateKey(key, "delete"),
				predicate: (current) => {
					const result = predicate(current);
					assertActive?.();
					return result;
				}
			});
		},
		lookup(key) {
			return pluginStateLookup({
				...scope,
				key: validateKey(key, "lookup")
			});
		},
		lookupMany(keys) {
			return pluginStateLookupMany({
				...scope,
				keys: prepareLookupKeys(keys)
			});
		},
		consume(key) {
			return pluginStateConsume({
				...scope,
				key: validateKey(key, "consume")
			});
		},
		delete(key) {
			return pluginStateDelete({
				...scope,
				key: validateKey(key, "delete")
			});
		},
		entries() {
			return pluginStateEntries(scope);
		},
		count() {
			return pluginStateCount(scope);
		},
		clear() {
			pluginStateClear(scope);
		}
	};
}
/**
* Migration-only write path that preserves a legacy entry's original creation
* timestamp. Cap eviction removes the oldest `created_at` first, so imported
* rows must keep their real age instead of being stamped with the import time
* (which would let later live writes evict fresher pre-existing rows first).
* Not part of the plugin-facing store API.
*/
function registerMigratedPluginStateEntry(params) {
	if (!Number.isFinite(params.createdAtMs) || params.createdAtMs < 0) throw invalidInput("plugin state migration createdAtMs must be a non-negative finite number");
	const namespace = validateNamespace(params.namespace, "register");
	const maxEntries = validateMaxEntries(params.maxEntries);
	const overflowPolicy = optionPolicy.resolveOverflowPolicy(params.overflowPolicy);
	const defaultTtlMs = validateOptionalTtlMs(params.defaultTtlMs);
	const prepared = prepareRegisterParams(params.key, params.value, defaultTtlMs, params.ttlMs != null ? { ttlMs: params.ttlMs } : void 0);
	pluginStateRegister({
		pluginId: params.pluginId,
		namespace,
		key: prepared.key,
		valueJson: prepared.valueJson,
		maxEntries,
		overflowPolicy,
		createdAtMs: Math.floor(params.createdAtMs),
		...params.env ? { env: params.env } : {},
		...prepared.ttlMs != null ? { ttlMs: prepared.ttlMs } : {}
	});
}
/** Opens an async plugin-state namespace for a non-core plugin id. */
function createPluginStateKeyedStore(pluginId, options, assertActive) {
	if (pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	return createKeyedStoreForPluginId(pluginId, options, assertActive);
}
/**
* Named adapter for the plugin-state-sync-keyed-store compatibility contract.
* @deprecated Plugin runtimes should use api.runtime.state.openKeyedStore and
* await its operations. This sync adapter remains through the next Plugin SDK major.
*/
function createPluginStateSyncKeyedStore(pluginId, options) {
	if (pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	return createSyncKeyedStoreForPluginId(pluginId, options);
}
/** Atomically allocates a workspace sequence and appends one journal entry. */
async function registerPluginStateSequencedJournalEntry(params) {
	if (params.pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	const journalKeyPrefix = validateKey(params.journalKeyPrefix);
	if (params.journalKeyRange.keyStartInclusive >= params.journalKeyRange.keyEndExclusive) throw invalidInput("Plugin state key range must have an increasing exclusive upper bound.");
	requireBoundedOptions(params.cursorOptions);
	requireBoundedOptions(params.journalOptions);
	const cursorNamespace = validateNamespace(params.cursorOptions.namespace);
	const cursorMaxEntries = validateMaxEntries(params.cursorOptions.maxEntries);
	const cursorOverflowPolicy = optionPolicy.resolveOverflowPolicy(params.cursorOptions.overflowPolicy);
	const cursorDefaultTtlMs = validateOptionalTtlMs(params.cursorOptions.defaultTtlMs);
	const journalNamespace = validateNamespace(params.journalOptions.namespace);
	const journalMaxEntries = validateMaxEntries(params.journalOptions.maxEntries);
	const journalOverflowPolicy = optionPolicy.resolveOverflowPolicy(params.journalOptions.overflowPolicy);
	const journalDefaultTtlMs = validateOptionalTtlMs(params.journalOptions.defaultTtlMs);
	if (cursorOverflowPolicy !== "evict-oldest" || journalOverflowPolicy !== "evict-oldest" || cursorDefaultTtlMs !== void 0 || journalDefaultTtlMs !== void 0) throw invalidInput("sequenced plugin state journals require non-expiring evict-oldest stores");
	if (params.cursorOptions.env !== params.journalOptions.env) throw invalidInput("sequenced plugin state journal stores must share one environment");
	const cursorKey = validateKey(params.cursorKey);
	optionPolicy.assertConsistent(params.pluginId, cursorNamespace, {
		maxEntries: cursorMaxEntries,
		overflowPolicy: cursorOverflowPolicy,
		defaultTtlMs: cursorDefaultTtlMs
	});
	optionPolicy.assertConsistent(params.pluginId, journalNamespace, {
		maxEntries: journalMaxEntries,
		overflowPolicy: journalOverflowPolicy,
		defaultTtlMs: journalDefaultTtlMs
	});
	const journalValueJson = preparePluginStateJournalValue(params.journalValue);
	return registerPluginStateJournalInWorker({
		pluginId: params.pluginId,
		cursorNamespace,
		cursorKey,
		cursorMaxEntries,
		journalNamespace,
		journalMaxEntries,
		journalKeyRange: {
			keyStartInclusive: params.journalKeyRange.keyStartInclusive,
			keyEndExclusive: params.journalKeyRange.keyEndExclusive,
			...params.journalKeyRange.valueKind === void 0 ? {} : { valueKind: params.journalKeyRange.valueKind }
		},
		journalKeyPrefix,
		journalValueJson,
		...params.cursorOptions.env ? { env: params.cursorOptions.env } : {}
	});
}
/** Internal bounded read through the same shared-state worker as journal writes. */
async function pluginStateEntriesInKeyRange(params) {
	validatePluginStateKeyRange(params);
	return listPluginStateInKeyRangeInWorker(params);
}
/** Doctor-only import that preserves source age and remaining retention. */
function importPluginStateEntriesForDoctor(pluginId, options, entries) {
	if (pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	requireBoundedOptions(options);
	const preparedOptions = prepareKeyedStoreOptions(pluginId, options);
	let batch = [];
	const flush = () => {
		pluginStateImportBatch(preparedOptions, batch);
		batch = [];
	};
	for (const entry of entries) {
		try {
			if (!Number.isSafeInteger(entry.createdAt)) throw invalidInput("plugin state import createdAt must be a safe integer", "register");
			const prepared = prepareRegisterParams(entry.key, entry.value, preparedOptions.defaultTtlMs, entry.ttlMs != null ? { ttlMs: entry.ttlMs } : void 0);
			batch.push({
				...prepared,
				createdAtMs: entry.createdAt
			});
		} catch (error) {
			flush();
			throw error;
		}
		if (batch.length === 500) flush();
	}
	flush();
}
/** Opens an async plugin-state namespace for a trusted core owner id. */
function createCorePluginStateKeyedStore(options) {
	return createKeyedStoreForPluginId(options.ownerId, options);
}
/** Opens a sync plugin-state namespace for a trusted core owner id. */
function createCorePluginStateSyncKeyedStore(options) {
	return createSyncKeyedStoreForPluginId(options.ownerId, options);
}
//#endregion
export { importPluginStateEntriesForDoctor as a, registerPluginStateSequencedJournalEntry as c, getPluginStateCapacity as d, pluginStateDeleteEntriesIfUnchanged as f, createPluginStateSyncKeyedStore as i, sweepExpiredPluginStateEntriesInWorker as l, createCorePluginStateSyncKeyedStore as n, pluginStateEntriesInKeyRange as o, pluginStateDoctorEntriesInKeyRange as p, createPluginStateKeyedStore as r, registerMigratedPluginStateEntry as s, createCorePluginStateKeyedStore as t, closePluginStateDatabaseAsync as u };
