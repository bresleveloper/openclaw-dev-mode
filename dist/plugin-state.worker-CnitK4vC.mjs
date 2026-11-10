import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { r as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as hasOpenClawStateTablesBeyondStartupCheckpoint } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { n as createPluginStateError } from "./plugin-state-error-Wxkh7e3f.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as requestSessionEntriesCurrentAdmission } from "./session-entry-current-admission.worker-DSV3cklJ.mjs";
import { u as withPluginStateWorkerReceipt } from "./plugin-state-publication-CI0IKkN0.mjs";
import { a as selectRuntimeHealthClearKeys } from "./runtime-health-records-BfEYoX08.mjs";
import { a as validatePluginStateComparison, i as pluginStateComparisonScope, r as createPluginStateObservation, t as capturePluginStateWorkerFailure } from "./plugin-state-worker-errors-CkFhXzlP.mjs";
import { b as selectPluginStateEntry, c as deleteExpiredPluginStateEntries, g as lookupPluginStateEntry, l as deletePluginStateEntry, m as isRetainedPluginStateNamespace, s as countLivePluginStateNamespaceEntries, v as rowToEntry } from "./plugin-state-store.types-CLUTlkgE.mjs";
import { a as prepareRegisterParams, s as validateKey, t as invalidInput } from "./plugin-state-store.validation-CbLRb9U1.mjs";
import { i as wrapPluginStateError, r as withPluginStateDatabaseReadOnly, t as isMissingPluginStateTableError } from "./plugin-state-store.database-B2UsVeYf.mjs";
import { n as pluginStateWorkerOperations } from "./plugin-state-worker-contract-BsKBfdig.mjs";
import { a as movePluginStateEntries, c as updatePluginStateEntry, m as registerPluginStateEntry, n as consumePluginStateEntry, o as registerPluginStateEntryIfAbsent, p as readPluginStateRetention, r as deletePluginStateEntryIfEqual, t as clearPluginStateNamespace } from "./plugin-state-store.mutations-B1cPWhts.mjs";
import { i as selectPluginStateBatchRows, n as listPluginStateEntriesInKeyRange, r as lookupPluginStateEntries, s as registerPluginStateSequencedJournalEntryInDatabase, t as listPluginStateEntries } from "./plugin-state-store.reads-C4qSGT3_.mjs";
import { toUSVString } from "node:util";
//#region src/plugin-state/plugin-state-operation.kernel.ts
/** One native invocation owns its read view, quota facts, and facade lifetime. */
function executePluginStateOperation(initialStore, input, handler) {
	let store = initialStore;
	let active = true;
	let validUntil;
	const writable = new Set(input.writeStores);
	const readNative = (read, empty) => {
		if (!store) return empty();
		try {
			return read(store);
		} catch (error) {
			if (writable.size === 0 && isMissingPluginStateTableError(error) && !hasOpenClawStateTablesBeyondStartupCheckpoint(store.db)) {
				store = void 0;
				return empty();
			}
			throw error;
		}
	};
	const views = /* @__PURE__ */ new Map();
	const requireScope = (index, write = false) => {
		if (!active) throw invalidInput("Plugin state transaction has already returned.");
		const options = Number.isSafeInteger(index) ? input.stores[index] : void 0;
		if (!options || write && (!writable.has(index) || !store)) throw invalidInput("Plugin state operation has no authority for this store.");
		const identity = JSON.stringify([options.pluginId, options.namespace]);
		let view = views.get(identity);
		if (!view) {
			view = {
				entries: /* @__PURE__ */ new Map(),
				scanned: !store
			};
			views.set(identity, view);
		}
		return {
			options,
			view
		};
	};
	const observe = (entry) => {
		if (entry?.expiresAt !== void 0) validUntil = Math.min(validUntil ?? Infinity, entry.expiresAt);
		return entry;
	};
	const live = (entry) => entry?.expiresAt !== void 0 && entry.expiresAt <= Date.now() ? void 0 : entry;
	const read = (index, rawKey) => {
		const { options, view } = requireScope(index);
		const key = toUSVString(validateKey(rawKey, "lookup"));
		if (!view.entries.has(key) && !view.scanned && store) {
			const row = readNative((database) => selectPluginStateEntry(database.db, {
				...options,
				key,
				now: Date.now()
			}), () => void 0);
			view.entries.set(key, row ? rowToEntry(row, "lookup", store.path) : void 0);
		}
		return observe(live(view.entries.get(key)));
	};
	const transaction = {
		lookup(index, key) {
			return read(index, key)?.value;
		},
		lookupMany(keys) {
			if (!active) throw invalidInput("Plugin state transaction has already returned.");
			if (keys.length > 1e4) throw invalidInput("Plugin state operations accept at most 10000 lookup keys.");
			const missing = /* @__PURE__ */ new Map();
			for (const { store: index, key: rawKey } of keys) {
				const { options, view } = requireScope(index);
				const key = toUSVString(validateKey(rawKey, "lookup"));
				if (!view.scanned && !view.entries.has(key)) missing.set(JSON.stringify([options.namespace, key]), {
					index,
					key
				});
			}
			const requested = [...missing.values()];
			if (store && requested.length > 0) {
				const rows = readNative((database) => selectPluginStateBatchRows(database, requested.map(({ index, key }) => ({
					...requireScope(index).options,
					key
				})), Date.now()), () => []);
				for (const [position, { index, key }] of requested.entries()) {
					const row = rows[position];
					requireScope(index).view.entries.set(key, row ? rowToEntry(row, "lookup", store.path) : void 0);
				}
			}
			return keys.map(({ store: index, key }) => read(index, key)?.value);
		},
		entries(index) {
			const { options, view } = requireScope(index);
			if (!view.scanned && store) {
				const entries = readNative((database) => listPluginStateEntries(database, options), () => []);
				view.entries = new Map(entries.map((entry) => [entry.key, entry]));
				view.scanned = true;
			}
			const entries = [...view.entries.values()].flatMap((entry) => {
				const current = observe(live(entry));
				return current ? [current] : [];
			});
			entries.sort((a, b) => a.createdAt - b.createdAt || Buffer.compare(Buffer.from(a.key), Buffer.from(b.key)));
			return entries;
		},
		set(index, rawKey, value, options) {
			const { options: scope, view } = requireScope(index, true);
			const prepared = prepareRegisterParams(rawKey, value, scope.defaultTtlMs, options, scope.namespace);
			const key = toUSVString(prepared.key);
			const retained = isRetainedPluginStateNamespace(scope.namespace);
			const existing = !retained && read(index, key) !== void 0;
			const now = Date.now();
			if (!view.retention && !retained) view.retention = view.scanned ? {
				namespaceCount: [...view.entries.values()].filter((entry) => live(entry)).length,
				nextExpiry: [...view.entries.values()].reduce((expiry, entry) => Math.min(expiry, live(entry)?.expiresAt ?? Infinity), Infinity),
				now,
				sweepPending: true
			} : readPluginStateRetention(store.db, {
				...scope,
				now
			});
			registerPluginStateEntry(store, {
				...scope,
				...prepared,
				key,
				createdAtMs: now
			}, view.retention, existing, (evicted) => {
				for (const evictedKey of evicted) view.entries.set(evictedKey, void 0);
			}, now);
			const expiresAt = prepared.ttlMs === void 0 ? void 0 : now + prepared.ttlMs;
			view.entries.set(key, observe({
				key,
				value: JSON.parse(prepared.valueJson),
				createdAt: now,
				expiresAt
			}));
		},
		delete(index, rawKey) {
			const { options, view } = requireScope(index, true);
			const key = toUSVString(validateKey(rawKey, "delete"));
			const existing = view.retention ? read(index, key) !== void 0 : false;
			const deleted = deletePluginStateEntry(store.db, {
				...options,
				key
			}) > 0;
			if (existing && deleted && view.retention) view.retention.namespaceCount -= 1;
			view.entries.set(key, void 0);
			return deleted;
		}
	};
	try {
		const value = handler(input.command, transaction);
		if (isPromiseLike(value)) {
			Promise.resolve(value).catch(() => {});
			throw invalidInput("Plugin state operation handlers must return synchronously.");
		}
		return {
			value,
			validUntil
		};
	} finally {
		active = false;
	}
}
//#endregion
//#region src/plugin-state/plugin-state-store.comparison.worker.ts
/** Called after canonical writable admission, with the native owner's recorded database identity. */
function observePluginStateEntry(store, params, storeIdentity) {
	const row = selectPluginStateEntry(store.db, {
		...params,
		now: Date.now()
	});
	return {
		...createPluginStateObservation(store.path, pluginStateComparisonScope(storeIdentity, params), row, "lookup"),
		row
	};
}
function validateComparisonScope(store, params, storeIdentity) {
	const operation = params.operation === "update" ? "register" : "delete";
	const expected = validatePluginStateComparison(params.comparison, operation);
	const scope = pluginStateComparisonScope(storeIdentity, params);
	if (expected !== scope) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation,
		path: store.path,
		message: "Plugin state observation belongs to another database, namespace or key."
	});
	return scope;
}
function applyComparedEntry(store, params, now, row) {
	if (params.operation === "delete") return { status: params.action === "delete" && row && deletePluginStateEntry(store.db, params) > 0 ? "applied" : "unchanged" };
	deleteExpiredPluginStateEntries(store.db, now, params);
	if (params.action === "keep") return { status: "unchanged" };
	updatePluginStateEntry(store, params, now, row !== void 0);
	return { status: "applied" };
}
/** The caller owns the IMMEDIATE transaction containing comparison, expiry, quotas and mutation. */
function compareAndApplyPluginStateEntry(store, params, storeIdentity) {
	const scope = validateComparisonScope(store, params, storeIdentity);
	const now = Date.now();
	const row = selectPluginStateEntry(store.db, {
		...params,
		now
	});
	const current = createPluginStateObservation(store.path, scope, row, params.operation === "update" ? "lookup" : "delete");
	if (current.comparison !== params.comparison) return {
		status: "conflict",
		current
	};
	for (const condition of params.conditions ?? []) {
		const conditionKey = {
			pluginId: params.pluginId,
			...condition
		};
		if (validatePluginStateComparison(condition.comparison, params.operation === "update" ? "register" : "delete") !== pluginStateComparisonScope(storeIdentity, conditionKey)) throw createPluginStateError({
			code: "PLUGIN_STATE_INVALID_INPUT",
			operation: params.operation === "update" ? "register" : "delete",
			path: store.path,
			message: "Plugin state condition belongs to another database, namespace or key."
		});
		if (observePluginStateEntry(store, conditionKey, storeIdentity).comparison !== condition.comparison) return {
			status: "conflict",
			current
		};
	}
	return applyComparedEntry(store, params, now, row);
}
//#endregion
//#region src/plugin-state/runtime-health-store.kernel.ts
function findRuntimeHealthClearKeys(store, params) {
	return selectRuntimeHealthClearKeys(listPluginStateEntries(store, params), params.processId, params.selection);
}
function hasRuntimeHealthEntriesToClear(store, params) {
	return findRuntimeHealthClearKeys(store, params).length > 0;
}
/** The caller owns the transaction spanning current-row selection and deletion. */
function clearRuntimeHealthEntries(store, params) {
	for (const key of findRuntimeHealthClearKeys(store, params)) deletePluginStateEntry(store.db, {
		...params,
		key
	});
}
//#endregion
//#region src/plugin-state/plugin-state.worker.ts
const operationHandlers = /* @__PURE__ */ new Map();
function operationHandlerKey(input) {
	return JSON.stringify([
		input.module.modulePath,
		input.module.boundaryRoot,
		input.exportName
	]);
}
/** Load plugin code before entering any native read or write transaction. */
async function preparePluginStateOperation(input) {
	const key = operationHandlerKey(input);
	if (operationHandlers.has(key)) return;
	const { loadValidatedPublicSurfaceModule } = await import("./public-surface-loader-B3z3wMSn.mjs");
	const loaded = loadValidatedPublicSurfaceModule({
		...input.module,
		surfaceLabel: "plugin state operation",
		capturedSource: true
	});
	const handler = Reflect.get(loaded, input.exportName);
	if (typeof handler !== "function") throw new Error("Plugin state operation module must export a synchronous handler");
	operationHandlers.set(key, handler);
}
function executePluginStateCommand(command, options, openDatabase, hasRetainedDatabase) {
	const description = pluginStateWorkerOperations[command.type];
	const admit = (stage) => requestSessionEntriesCurrentAdmission(command.input?.sessionEntryCurrentSources, {
		stage,
		facts: void 0
	});
	const failure = (error) => err(capturePluginStateWorkerFailure(wrapPluginStateError(error, description.operation, description.code, description.message, options.path)));
	if (command.type === "pluginState.executeOperation") try {
		const handler = operationHandlers.get(operationHandlerKey(command.input));
		if (!handler) throw new Error("Plugin state operation was not prepared");
		if (command.input.writeStores.length === 0) {
			const result = withPluginStateDatabaseReadOnly("lookup", (store) => {
				const run = () => executePluginStateOperation(store, command.input, handler);
				return store.db.isTransaction ? run() : runSqliteDeferredTransactionSync(store.db, run);
			}, options);
			if (!result) throw new Error("Plugin state operation source is no longer available");
			return ok(result);
		}
		const database = openDatabase();
		return ok(runOpenClawStateWriteTransaction((store) => {
			admit("transaction");
			const result = withPluginStateWorkerReceipt(store.db, () => executePluginStateOperation(store, command.input, handler), (completed) => ({ pluginStateOperation: {
				receiptId: command.input.receiptId,
				validUntil: completed.validUntil
			} }));
			admit("commit");
			return result;
		}, {
			...options,
			database
		}));
	} catch (error) {
		return failure(error);
	}
	if (command.type === "pluginState.lookup" || command.type === "pluginState.lookupMany" || command.type === "pluginState.entries" || command.type === "pluginState.entriesInKeyRange" || command.type === "pluginState.count") try {
		switch (command.type) {
			case "pluginState.lookup": return ok(withPluginStateDatabaseReadOnly("lookup", (store) => lookupPluginStateEntry(store, command.input), options));
			case "pluginState.lookupMany": {
				const rows = withPluginStateDatabaseReadOnly("lookup", (store) => lookupPluginStateEntries(store, command.input), options) ?? command.input.keys.map(() => ok(void 0));
				return ok(rows.map((row) => row.ok ? row : err(capturePluginStateWorkerFailure(row.error))));
			}
			case "pluginState.entriesInKeyRange": return ok(withPluginStateDatabaseReadOnly("entries", (store) => listPluginStateEntriesInKeyRange(store, command.input), options) ?? []);
			case "pluginState.entries": return ok(withPluginStateDatabaseReadOnly("entries", (store) => listPluginStateEntries(store, command.input), options) ?? []);
			case "pluginState.count": return ok(withPluginStateDatabaseReadOnly("count", ({ db }) => countLivePluginStateNamespaceEntries(db, {
				...command.input,
				now: Date.now()
			}), options) ?? 0);
		}
	} catch (error) {
		return failure(error);
	}
	if (command.type === "pluginState.clearRuntimeHealth") try {
		if (!withPluginStateDatabaseReadOnly("entries", (store) => hasRuntimeHealthEntriesToClear(store, command.input), options)) return ok(void 0);
	} catch (error) {
		return failure(error);
	}
	let database;
	try {
		database = openDatabase();
	} catch (error) {
		return err(capturePluginStateWorkerFailure(wrapPluginStateError(error, description.operation, hasRetainedDatabase ? description.code : "PLUGIN_STATE_OPEN_FAILED", hasRetainedDatabase ? description.message : "Failed to open the plugin state database.", options.path)));
	}
	try {
		if (command.type === "pluginState.replaceEntry") runOpenClawStateWriteTransaction((store) => {
			admit("transaction");
			withPluginStateWorkerReceipt(store.db, () => deletePluginStateEntry(store.db, command.input));
			admit("commit");
		}, {
			...options,
			database
		});
		return ok(runOpenClawStateWriteTransaction((store) => {
			admit("transaction");
			const result = withPluginStateWorkerReceipt(store.db, () => {
				switch (command.type) {
					case "pluginState.appendJournal": return registerPluginStateSequencedJournalEntryInDatabase(store, command.input);
					case "pluginState.observe": return observePluginStateEntry(store, command.input, captureOpenClawStateDatabaseReadAdmission(store.path).identity.key);
					case "pluginState.compareUpdate":
					case "pluginState.compareDelete": return compareAndApplyPluginStateEntry(store, command.input, captureOpenClawStateDatabaseReadAdmission(store.path).identity.key);
					case "pluginState.moveEntries": return movePluginStateEntries(store, command.input);
					case "pluginState.register":
					case "pluginState.replaceEntry": return registerPluginStateEntry(store, command.input);
					case "pluginState.replace": {
						clearPluginStateNamespace(store.db, command.input);
						if (command.input.entries.length === 0) return;
						const retention = readPluginStateRetention(store.db, {
							...command.input,
							now: Date.now()
						});
						for (const entry of command.input.entries) registerPluginStateEntry(store, {
							...command.input,
							...entry
						}, retention);
						return;
					}
					case "pluginState.registerIfAbsent": return registerPluginStateEntryIfAbsent(store, command.input);
					case "pluginState.deleteIfEqual": return deletePluginStateEntryIfEqual(store, command.input);
					case "pluginState.consume": return consumePluginStateEntry(store, command.input);
					case "pluginState.delete": return deletePluginStateEntry(store.db, command.input) > 0;
					case "pluginState.clear": return clearPluginStateNamespace(store.db, command.input);
					case "pluginState.clearRuntimeHealth": return clearRuntimeHealthEntries(store, command.input);
					default: throw new Error("Plugin-state read command entered its write path");
				}
			});
			admit("commit");
			return result;
		}, {
			...options,
			database
		}));
	} catch (error) {
		return failure(error);
	}
}
//#endregion
export { executePluginStateCommand, preparePluginStateOperation };
