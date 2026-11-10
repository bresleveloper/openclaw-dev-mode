import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as parseStoredJson } from "./plugin-state-error-Wxkh7e3f.mjs";
import { a as readTrackedStateDatabaseIdentity } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import "./openclaw-state-db-BtDOU_3j.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { a as pluginStatePublication, c as recordPluginStateReadDependency, n as beginPluginStatePublication, t as assertPluginStatePublicationSettled } from "./plugin-state-publication-CI0IKkN0.mjs";
import { a as validatePluginStateComparison } from "./plugin-state-worker-errors-CkFhXzlP.mjs";
import { t as PluginStateOperationInvalidatedError } from "./plugin-state-operation-error-Bu3MrkEU.mjs";
import { C as beginPluginStateMutation, E as invalidatePluginStateMutation, T as capturePluginStateMutationSettlement, _ as registerPluginStateIfAbsentInWorker, a as consumePluginStateInWorker, b as replacePluginStateEntryInWorker, c as deletePluginStateInWorker, d as listPluginStateInWorker, f as lookupManyPluginStateInWorker, h as observePluginStateInWorker, i as comparePluginStateUpdateInWorker, l as executePluginStateOperationInWorker, m as movePluginStateEntriesInWorker, o as countPluginStateInWorker, p as lookupPluginStateInWorker, r as comparePluginStateDeleteInWorker, s as deletePluginStateIfEqualInWorker, t as clearPluginStateInWorker, u as listPluginStateInKeyRangeInWorker, v as registerPluginStateInWorker, w as capturePluginStateEpochs, x as replacePluginStateInWorker, y as registerPluginStateJournalInWorker } from "./plugin-state-worker-client-S8ldxtrq.mjs";
import { n as capturePluginStateNativeBindingStore, t as bindPluginStateNativeBindingStore } from "./plugin-state-store.native-binding-77crF_5Y.mjs";
import { b as selectPluginStateEntry, c as deleteExpiredPluginStateEntries, d as getPluginStateKysely, g as lookupPluginStateEntry, l as deletePluginStateEntry, m as isRetainedPluginStateNamespace, s as countLivePluginStateNamespaceEntries, t as MAX_PLUGIN_STATE_VALUE_BYTES, y as selectPluginStateEntriesInKeyRange } from "./plugin-state-store.types-CLUTlkgE.mjs";
import { a as prepareRegisterParams, c as validateMaxEntries, f as serializePluginStoreJson, i as prepareLookupKeys, l as validateNamespace, n as optionPolicy, o as requireBoundedOptions, r as prepareKeyedStoreOptions, s as validateKey, t as invalidInput, u as validateOptionalTtlMs } from "./plugin-state-store.validation-CbLRb9U1.mjs";
import { i as wrapPluginStateError, n as runWriteTransaction, r as withPluginStateDatabaseReadOnly } from "./plugin-state-store.database-B2UsVeYf.mjs";
import { c as updatePluginStateEntry, d as countLivePluginStateEntries, m as registerPluginStateEntry, n as consumePluginStateEntry, o as registerPluginStateEntryIfAbsent, p as readPluginStateRetention, t as clearPluginStateNamespace } from "./plugin-state-store.mutations-B1cPWhts.mjs";
import { a as validatePluginStateKeyRange, o as preparePluginStateJournalValue, r as lookupPluginStateEntries, t as listPluginStateEntries } from "./plugin-state-store.reads-C4qSGT3_.mjs";
import { randomUUID } from "node:crypto";
import { toUSVString } from "node:util";
//#region src/plugin-state/plugin-state-operation.ts
const receiptSources = resolveGlobalSingleton(Symbol.for("openclaw.pluginStateOperationReceiptSources"), () => /* @__PURE__ */ new WeakMap());
/** Capture module generation, source, and live grants before dispatch can suspend. */
function createPluginStateOperation(owner, stores, handler, authority) {
	if (stores.length === 0 || stores.length > 1e4) throw invalidInput("Plugin state operations require between 1 and 10000 stores.");
	if (!handler.exportName || authority && typeof authority.assertCurrent !== "function") throw invalidInput("Plugin state operation requires a named handler and valid authority.");
	const capture = (store) => {
		const binding = capturePluginStateNativeBindingStore(store);
		if (!binding) throw invalidInput("Plugin state operations require host-owned stores.");
		binding.assertCurrent?.();
		return binding;
	};
	const ownerBinding = capture(owner);
	if (!ownerBinding.moduleSource) throw invalidInput("Plugin state operation has no captured plugin module source.");
	const module = ownerBinding.moduleSource.resolve(handler.moduleName);
	const bindings = stores.map(capture);
	const allBindings = [.../* @__PURE__ */ new Set([ownerBinding, ...bindings])];
	const context = captureOpenClawStateWorkerContext({ env: ownerBinding.options.env });
	const contexts = /* @__PURE__ */ new Map([[ownerBinding.options.env, context]]);
	for (const binding of allBindings) {
		if (binding.options.pluginId !== ownerBinding.options.pluginId) throw invalidInput("Plugin state operations require stores belonging to one plugin.");
		let candidate = contexts.get(binding.options.env);
		if (!candidate) {
			candidate = captureOpenClawStateWorkerContext({ env: binding.options.env });
			contexts.set(binding.options.env, candidate);
		}
		if (candidate.admission.databasePath !== context.admission.databasePath || candidate.admission.identity.key !== context.admission.identity.key || candidate.admission.identity.birthtime !== context.admission.identity.birthtime) throw invalidInput("Plugin state operations require one physical state source.");
	}
	if (authority?.sourceReceipt) {
		const source = receiptSources.get(authority.sourceReceipt);
		if (!source || source.pluginId !== ownerBinding.options.pluginId || source.context.admission.databasePath !== context.admission.databasePath || source.context.admission.identity.key !== context.admission.identity.key || source.context.admission.identity.birthtime !== context.admission.identity.birthtime) throw invalidInput("Plugin state operation receipt belongs to another source or plugin.");
		source.assertCurrent();
	}
	const checks = [...new Set(allBindings.flatMap((binding) => binding.sessionEntryCurrent ?? []))];
	const sessionEntryCurrent = checks.length ? {
		sources: checks.flatMap((check) => "source" in check ? [check.source] : check.sources),
		assertCurrent(entries) {
			let offset = 0;
			for (const check of checks) if ("source" in check) check.assertCurrent(entries[offset++]);
			else {
				check.assertCurrent(entries.slice(offset, offset + check.sources.length));
				offset += check.sources.length;
			}
		}
	} : void 0;
	const assertActive = () => {
		for (const captured of contexts.values()) captured.admission.assertCurrent();
		for (const binding of allBindings) binding.assertCurrent?.();
		authority?.assertCurrent();
	};
	const select = (indices) => [...new Set(indices)].map((index) => {
		const binding = Number.isSafeInteger(index) ? bindings[index] : void 0;
		if (!binding) throw invalidInput("Plugin state operation names an unknown store.");
		return binding.options;
	});
	assertActive();
	return { async execute(command, options) {
		assertActive();
		const writes = select(options.writeStores);
		const watches = select(options.watchStores ?? bindings.map((_, index) => index));
		const receiptId = randomUUID();
		const missing = Object.hasOwn(options, "missingValue") ? {
			value: options.missingValue,
			validUntil: void 0
		} : void 0;
		const mutation = writes.length ? beginPluginStateMutation(context.admission.coordinationKey, writes) : void 0;
		const prior = capturePluginStateMutationSettlement(context.admission.coordinationKey, [...watches, ...writes], mutation?.token);
		let validUntil;
		let committed = writes.length === 0;
		const publication = writes.length ? beginPluginStatePublication(() => context.admission.identity.key) : void 0;
		try {
			if (prior) {
				await prior;
				assertActive();
			}
			const assertEpochs = capturePluginStateEpochs(context.admission.coordinationKey, watches, mutation?.token);
			const assertCurrent = () => {
				assertActive();
				assertEpochs();
				if (!committed || validUntil !== void 0 && Date.now() >= validUntil) throw new PluginStateOperationInvalidatedError();
			};
			const result = await executePluginStateOperationInWorker({
				context,
				assertActive,
				sessionEntryCurrent,
				module,
				exportName: handler.exportName,
				stores: bindings.map(({ options: { env: _env, ...scope } }) => scope),
				writeStores: [...options.writeStores],
				command,
				receiptId
			}, {
				missing: missing ? () => missing : void 0,
				onCommitted(facts) {
					if (facts.receiptId !== receiptId) throw new Error("Plugin state operation received another operation's receipt");
					validUntil = facts.validUntil;
					committed = true;
				}
			});
			if (!committed) throw new Error("Plugin state operation has no committed receipt");
			validUntil = result.validUntil;
			if (writes.length === 0) assertActive();
			const receipt = {
				value: result.value,
				assertCurrent
			};
			receiptSources.set(receipt, {
				context,
				pluginId: ownerBinding.options.pluginId,
				assertCurrent
			});
			return receipt;
		} finally {
			try {
				publication?.finish("completed");
			} finally {
				mutation?.finish();
			}
		}
	} };
}
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
	invalidatePluginStateMutation(params);
	writePluginState("register", "Failed to register plugin state entry.", (store) => registerPluginStateEntry(store, params), params.env);
}
/** Prepared doctor rows only: validation and plugin-owned accessors run before BEGIN. */
function pluginStateImportBatch(params, entries) {
	if (entries.length === 0) return;
	if (entries.length > 500) throw new RangeError("Plugin state doctor import batch exceeds its row limit");
	invalidatePluginStateMutation(params);
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
	invalidatePluginStateMutation(params);
	return writePluginState("register", "Failed to register plugin state entry.", (store) => registerPluginStateEntryIfAbsent(store, params), params.env);
}
function pluginStateUpdate(params) {
	invalidatePluginStateMutation(params);
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
		updatePluginStateEntry(store, {
			pluginId: params.pluginId,
			namespace: params.namespace,
			key: params.key,
			maxEntries: params.maxEntries,
			overflowPolicy: params.overflowPolicy,
			valueJson: next.valueJson,
			ttlMs: next.ttlMs
		}, now, existing !== void 0);
		return true;
	}, params.env);
}
function pluginStateLookup(params) {
	let opened = false;
	const dependency = {
		pluginId: params.pluginId,
		namespace: params.namespace,
		keys: [params.key]
	};
	const result = readPluginState("lookup", "Failed to read plugin state entry.", (store) => {
		opened = true;
		recordPluginStateReadDependency({
			...dependency,
			identity: readTrackedStateDatabaseIdentity(sqlPublicationAnchor(store.db))?.key
		});
		return lookupPluginStateEntry(store, params);
	}, params.env);
	if (!opened) recordPluginStateReadDependency(dependency);
	return result;
}
function pluginStateLookupMany(params) {
	if (params.keys.length === 0) return [];
	let opened = false;
	const dependency = {
		pluginId: params.pluginId,
		namespace: params.namespace,
		keys: params.keys
	};
	const result = readPluginState("lookup", "Failed to read plugin state entries.", (store) => {
		opened = true;
		recordPluginStateReadDependency({
			...dependency,
			identity: readTrackedStateDatabaseIdentity(sqlPublicationAnchor(store.db))?.key
		});
		return lookupPluginStateEntries(store, params);
	}, params.env);
	if (!opened) recordPluginStateReadDependency(dependency);
	return result ?? params.keys.map(() => ok(void 0));
}
function pluginStateConsume(params) {
	invalidatePluginStateMutation(params);
	return writePluginState("consume", "Failed to consume plugin state entry.", (store) => consumePluginStateEntry(store, params), params.env);
}
function pluginStateDelete(params) {
	invalidatePluginStateMutation(params);
	return writePluginState("delete", "Failed to delete plugin state entry.", ({ db }) => {
		return deletePluginStateEntry(db, params) > 0;
	}, params.env);
}
function pluginStateDeleteIf(params) {
	invalidatePluginStateMutation(params);
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
function observedPluginStateRow(eb, scope, entry) {
	return eb.and({
		plugin_id: scope.pluginId,
		namespace: scope.namespace,
		entry_key: entry.key,
		value_json: entry.valueJson,
		created_at: entry.createdAt
	}).and("expires_at", entry.expiresAt === null ? "is" : "=", entry.expiresAt);
}
/** Deletes one bounded set of exact observed rows in a single synchronous transaction. */
function pluginStateDeleteEntriesIfUnchanged(params) {
	if (params.entries.length > 512) throw new RangeError(`Plugin state bulk deletion cannot exceed 512 entries.`);
	if (params.entries.length === 0) return {
		deleted: 0,
		changed: 0
	};
	const observed = params.entries.map(({ value: _value, ...entry }) => entry);
	invalidatePluginStateMutation(params);
	return runWriteTransaction("delete", ({ db }) => {
		params.assertOwnedInTransaction(db);
		let deleted = 0;
		for (const entry of observed) {
			const query = getPluginStateKysely(db).deleteFrom("plugin_state_entries").where((eb) => observedPluginStateRow(eb, params, entry)).returning([
				"plugin_id",
				"namespace",
				"entry_key"
			]);
			const result = executeSqliteQuerySync(db, query);
			pluginStatePublication.stageDeletions(db, result.rows);
			deleted += result.rows.length;
		}
		return {
			deleted,
			changed: observed.length - deleted
		};
	}, envOptions(params.env));
}
/** Doctor-only bounded raw read keeps malformed rows visible and preserves exact CAS bytes. */
function pluginStateDoctorEntriesInKeyRange(params) {
	if (!Number.isSafeInteger(params.limit) || params.limit < 1 || params.limit > 512 || params.after !== void 0 && !params.after.startsWith(params.prefix)) throw new RangeError(`Plugin doctor state reads require a valid prefix and a limit of 1-512.`);
	const range = {
		...params,
		keyStartInclusive: params.after === void 0 ? params.prefix : `${params.after}\0`,
		keyEndExclusive: `${params.prefix}\uffff`
	};
	validatePluginStateKeyRange(range);
	return readPluginState("entries", "Failed to list plugin state entries by key range.", ({ db }) => selectPluginStateEntriesInKeyRange(db, {
		...range,
		order: "asc",
		now: Date.now()
	}).map((row) => {
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
	}), params.env) ?? [];
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
function pluginStateClear(params) {
	invalidatePluginStateMutation(params);
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
//#endregion
//#region src/plugin-state/plugin-state-store.legacy.ts
/** @deprecated Use openKeyedStoreV2; final compatibility day: 2026-12-31. */
function createSyncKeyedStoreForPluginId(pluginId, options, warn = true, warningPluginId) {
	requireBoundedOptions(options);
	return createSyncKeyedStore(prepareKeyedStoreOptions(pluginId, options), void 0, warn ? "PluginStateSyncKeyedStore" : void 0, warningPluginId);
}
/** @deprecated Use openKeyedStoreV2; final compatibility day: 2026-12-31. */
function createSyncKeyedStore({ pluginId, namespace, maxEntries, overflowPolicy, defaultTtlMs, env }, assertActive, legacyContract, warningPluginId) {
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
	const warnLegacyUse = (method, replacement = `openKeyedStoreV2().${method}()`) => {
		if (legacyContract) warnPluginSdkDeprecation({
			pluginId: warningPluginId,
			family: "plugin-state-keyed-store",
			method: `${legacyContract}.${method}`,
			replacement: `await ${replacement}`,
			compatibility: "Synchronous operations still commit before returning; legacy callbacks retain transaction-local ordering."
		});
	};
	return {
		/** @deprecated Await openKeyedStoreV2().register(). */
		register(key, value, opts) {
			warnLegacyUse("register");
			pluginStateRegister({
				...writeScope,
				...prepareRegisterParams(key, value, defaultTtlMs, opts)
			});
		},
		/** @deprecated Await openKeyedStoreV2().registerIfAbsent(). */
		registerIfAbsent(key, value, opts) {
			warnLegacyUse("registerIfAbsent");
			return pluginStateRegisterIfAbsent({
				...writeScope,
				...prepareRegisterParams(key, value, defaultTtlMs, opts)
			});
		},
		/** @deprecated Use openKeyedStoreV2().observe() and compareAndApply(). */
		update(key, updateValue, opts) {
			warnLegacyUse("update", "openKeyedStoreV2().observe() and compareAndApply()");
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
		/** @deprecated Use openKeyedStoreV2().observe() and compareAndApply(). */
		deleteIf(key, predicate) {
			warnLegacyUse("deleteIf", "openKeyedStoreV2().observe() and compareAndApply()");
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
			warnLegacyUse("lookup");
			return pluginStateLookup({
				...scope,
				key: validateKey(key, "lookup")
			});
		},
		/** @deprecated Await openKeyedStoreV2().lookupMany(). */
		lookupMany(keys) {
			warnLegacyUse("lookupMany");
			return pluginStateLookupMany({
				...scope,
				keys: prepareLookupKeys(keys)
			});
		},
		/** @deprecated Await openKeyedStoreV2().consume(). */
		consume(key) {
			warnLegacyUse("consume");
			return pluginStateConsume({
				...scope,
				key: validateKey(key, "consume")
			});
		},
		/** @deprecated Await openKeyedStoreV2().delete(). */
		delete(key) {
			warnLegacyUse("delete");
			return pluginStateDelete({
				...scope,
				key: validateKey(key, "delete")
			});
		},
		entries() {
			warnLegacyUse("entries");
			return pluginStateEntries(scope);
		},
		count() {
			warnLegacyUse("count");
			return pluginStateCount(scope);
		},
		/** @deprecated Await openKeyedStoreV2().clear(). */
		clear() {
			warnLegacyUse("clear");
			pluginStateClear(scope);
		}
	};
}
//#endregion
//#region src/plugin-state/plugin-state-store.migration.ts
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
//#endregion
//#region src/plugin-state/plugin-state-store.ts
function createReadAvailabilityAssertion(options, assertCurrent) {
	let context;
	return () => {
		assertCurrent?.();
		context ??= captureOpenClawStateWorkerContext({ env: options.env });
		(context.assertPublicationCurrent ?? context.admission.assertCurrent)();
		assertPluginStatePublicationSettled(context.admission.identity.key);
	};
}
function createKeyedStoreForPluginId(pluginId, options, assertActive, moduleSource, warningPluginId) {
	const prepared = prepareKeyedStoreOptions(pluginId, options);
	const assertRetainedActive = options.retention === "retained" ? assertActive : void 0;
	let legacyStore;
	const getLegacyStore = () => legacyStore ??= createSyncKeyedStore(prepared, assertRetainedActive, "PluginStateKeyedStore", warningPluginId);
	const asyncStore = {
		...createAsyncKeyedStore(prepared, assertRetainedActive, assertActive, void 0, moduleSource),
		withCurrent: ({ assertCurrent, sessionEntryCurrent }) => {
			if (typeof assertCurrent !== "function") throw invalidInput("Plugin state action authority requires assertCurrent.");
			const assertBoundCurrent = () => {
				assertActive?.();
				assertCurrent();
			};
			assertBoundCurrent();
			return createAsyncKeyedStore(prepared, assertBoundCurrent, assertBoundCurrent, sessionEntryCurrent, moduleSource);
		},
		/** @deprecated Use observe and compareAndApply; final compatibility day: 2026-12-31. */
		update: async (...args) => getLegacyStore().update(...args),
		/** @deprecated Use observe and compareAndApply; final compatibility day: 2026-12-31. */
		deleteIf: async (...args) => getLegacyStore().deleteIf(...args)
	};
	return bindPluginStateNativeBindingStore(asyncStore, prepared, createReadAvailabilityAssertion(prepared, assertActive), assertActive, void 0, moduleSource);
}
function createAsyncKeyedStore(prepared, assertActive, assertRangeActive = assertActive, sessionEntryCurrent, moduleSource) {
	const scope = {
		pluginId: prepared.pluginId,
		namespace: prepared.namespace,
		env: prepared.env,
		assertActive,
		sessionEntryCurrent
	};
	const store = {
		createOperation: (stores, handler, authority) => createPluginStateOperation(store, stores, handler, authority),
		observe: async (key) => {
			return await observePluginStateInWorker({
				...scope,
				key: validateKey(key, "lookup")
			});
		},
		compareAndApply: async (key, comparison, intent, options) => {
			if (intent?.operation !== "update" && intent?.operation !== "delete") throw invalidInput("Plugin state comparison requires an update or delete intent.");
			const operation = intent.operation === "update" ? "register" : "delete";
			const normalizedKey = validateKey(key, operation);
			validatePluginStateComparison(comparison, operation);
			if (options && options.conditions.length > 100) throw invalidInput("Plugin state comparisons accept at most 100 conditions.", operation);
			const conditions = options?.conditions.map((condition) => {
				validatePluginStateComparison(condition.comparison, operation);
				return {
					namespace: validateNamespace(condition.namespace, operation),
					key: validateKey(condition.key, operation),
					comparison: condition.comparison
				};
			});
			const common = {
				...scope,
				key: normalizedKey,
				comparison,
				conditions,
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
				assertCurrent: opts?.assertCurrent,
				signal: opts?.signal
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
	return bindPluginStateNativeBindingStore(store, prepared, createReadAvailabilityAssertion(prepared, assertRangeActive), assertRangeActive, sessionEntryCurrent, moduleSource);
}
/** Opens an async plugin-state namespace for a non-core plugin id. */
function createPluginStateKeyedStore(pluginId, options, assertActive, moduleSource) {
	if (pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	return createKeyedStoreForPluginId(pluginId, options, assertActive, moduleSource, pluginId);
}
/** Opens a data-only worker store bound to the retained caller's lifetime and authority. */
function createPluginStateKeyedStoreV2(pluginId, options, authority, moduleSource) {
	if (pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	if (typeof authority.assertCurrent !== "function") throw invalidInput("Plugin state action authority requires assertCurrent.");
	authority.assertCurrent();
	return createAsyncKeyedStore(prepareKeyedStoreOptions(pluginId, options), authority.assertCurrent, authority.assertCurrent, authority.sessionEntryCurrent, moduleSource);
}
/** Registry-owned stores retain diagnostic identity after the opening invocation ends. */
function createPluginStateRuntimeStores(pluginId, assertRuntimeCurrent, captureModuleSource) {
	if (pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	return {
		openKeyedStore: (options) => {
			if (options.retention === "retained") assertRuntimeCurrent();
			return createKeyedStoreForPluginId(pluginId, options, assertRuntimeCurrent, captureModuleSource?.(), pluginId);
		},
		openKeyedStoreV2: (options, authority) => createPluginStateKeyedStoreV2(pluginId, options, {
			assertCurrent: () => {
				assertRuntimeCurrent();
				authority?.assertCurrent();
			},
			sessionEntryCurrent: authority?.sessionEntryCurrent
		}, captureModuleSource?.()),
		openSyncKeyedStore: (options) => createSyncKeyedStoreForPluginId(pluginId, options, true, pluginId)
	};
}
/**
* Named adapter for the plugin-state-sync-keyed-store compatibility contract.
* @deprecated Use createPluginStateKeyedStoreV2 or api.runtime.state.openKeyedStoreV2
* and await its operations. This adapter will be removed in the first January 2027 stable release, after the final compatibility day 2026-12-31.
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
/** Opens an async plugin-state namespace for a trusted core owner id. */
function createCorePluginStateKeyedStore(options) {
	return createKeyedStoreForPluginId(options.ownerId, options);
}
/** Opens a data-only worker store for a trusted core owner. */
function createCorePluginStateKeyedStoreV2(options, authority) {
	if (typeof authority.assertCurrent !== "function") throw invalidInput("Plugin state action authority requires assertCurrent.");
	authority.assertCurrent();
	return createAsyncKeyedStore(prepareKeyedStoreOptions(options.ownerId, options), authority.assertCurrent, authority.assertCurrent, authority.sessionEntryCurrent);
}
/** Bind a core catalog read and its later replacement to the same physical store. */
function prepareCorePluginStateReplacement(options) {
	const prepared = prepareKeyedStoreOptions(options.ownerId, options);
	const context = captureOpenClawStateWorkerContext({ env: prepared.env });
	const scope = {
		...prepared,
		context
	};
	return {
		async entries() {
			return await listPluginStateInWorker(scope);
		},
		async replace(entries) {
			const values = Array.from(entries, ([key, value]) => prepareRegisterParams(key, value, prepared.defaultTtlMs, void 0, prepared.namespace));
			await replacePluginStateInWorker({
				...scope,
				entries: values
			});
		}
	};
}
/** Revoke the prior entry before installing its replacement, including failed preparation. */
async function replaceCorePluginStateEntry(options, key, value, opts) {
	const prepared = prepareKeyedStoreOptions(options.ownerId, options);
	const context = captureOpenClawStateWorkerContext({ env: prepared.env });
	const normalizedKey = validateKey(key);
	const scope = {
		...prepared,
		context,
		assertCurrent: opts?.assertCurrent
	};
	let entry;
	try {
		entry = prepareRegisterParams(normalizedKey, value, prepared.defaultTtlMs, opts, prepared.namespace);
	} catch (error) {
		await deletePluginStateInWorker({
			...scope,
			key: normalizedKey
		});
		throw error;
	}
	await replacePluginStateEntryInWorker({
		...scope,
		...entry
	});
}
/** Opens a sync plugin-state namespace for a trusted core owner id. */
function createCorePluginStateSyncKeyedStore(options) {
	return createSyncKeyedStoreForPluginId(options.ownerId, options, false);
}
//#endregion
export { pluginStateDoctorEntriesInKeyRange as _, createPluginStateKeyedStoreV2 as a, pluginStateEntriesInKeyRange as c, replaceCorePluginStateEntry as d, importPluginStateEntriesForDoctor as f, pluginStateDeleteEntriesIfUnchanged as g, observedPluginStateRow as h, createPluginStateKeyedStore as i, prepareCorePluginStateReplacement as l, getPluginStateCapacity as m, createCorePluginStateKeyedStoreV2 as n, createPluginStateRuntimeStores as o, registerMigratedPluginStateEntry as p, createCorePluginStateSyncKeyedStore as r, createPluginStateSyncKeyedStore as s, createCorePluginStateKeyedStore as t, registerPluginStateSequencedJournalEntry as u };
