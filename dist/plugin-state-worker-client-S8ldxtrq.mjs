import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as assertStateDatabaseReadAllowed } from "./gateway-state-owner-X3EqhtYx.mjs";
import { f as hasSqliteDatabaseSchemaAdmissionForIdentity } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { m as openClawStateDatabaseCache, r as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as parseStoredJson, t as PluginStateStoreError } from "./plugin-state-error-Wxkh7e3f.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as assertSessionEntriesCurrentAdmission } from "./session-entry-current-admission-DvCCyjlG.mjs";
import { a as pluginStatePublication, c as recordPluginStateReadDependency, l as withPluginStatePublication, n as beginPluginStatePublication, o as pluginStatePublicationKey } from "./plugin-state-publication-CI0IKkN0.mjs";
import { i as pluginStateComparisonScope, n as restorePluginStateWorkerFailure, r as createPluginStateObservation, t as capturePluginStateWorkerFailure } from "./plugin-state-worker-errors-CkFhXzlP.mjs";
import { t as PluginStateOperationInvalidatedError } from "./plugin-state-operation-error-Bu3MrkEU.mjs";
import "./plugin-state-store.types-CLUTlkgE.mjs";
import { i as wrapPluginStateError } from "./plugin-state-store.database-B2UsVeYf.mjs";
import { n as pluginStateWorkerOperations } from "./plugin-state-worker-contract-BsKBfdig.mjs";
//#region src/plugin-state/plugin-state-operation-epochs.ts
const sources = resolveGlobalSingleton(Symbol.for("openclaw.pluginStateOperationEpochs"), () => /* @__PURE__ */ new Map());
function namespaceEpoch(coordinationKey, scope) {
	let namespaces = sources.get(coordinationKey);
	if (!namespaces) {
		namespaces = /* @__PURE__ */ new Map();
		sources.set(coordinationKey, namespaces);
	}
	const key = JSON.stringify([scope.pluginId, scope.namespace]);
	let epoch = namespaces.get(key);
	if (!epoch) {
		epoch = {
			revision: 0,
			pending: /* @__PURE__ */ new Set()
		};
		namespaces.set(key, epoch);
	}
	return epoch;
}
/** Invalidation precedes queueing, so a pending revocation already closes older receipts. */
function beginPluginStateMutation(coordinationKey, scopes) {
	let finish;
	const token = { settled: new Promise((resolve) => {
		finish = resolve;
	}) };
	const ready = capturePluginStateMutationSettlement(coordinationKey, scopes);
	const epochs = new Set(scopes.map((scope) => namespaceEpoch(coordinationKey, scope)));
	for (const epoch of epochs) {
		epoch.revision += 1;
		epoch.pending.add(token);
	}
	return {
		token,
		ready,
		finish() {
			for (const epoch of epochs) epoch.pending.delete(token);
			finish();
		}
	};
}
/** Capture only earlier work; later mutations must never form a wait cycle. */
function capturePluginStateMutationSettlement(coordinationKey, scopes, ownMutation) {
	const prior = new Set(scopes.flatMap((scope) => [...namespaceEpoch(coordinationKey, scope).pending]).filter((token) => token !== ownMutation));
	return prior.size ? Promise.all([...prior].map((token) => token.settled)).then(() => {}) : void 0;
}
function invalidatePluginStateMutation(scope) {
	beginPluginStateMutation(captureOpenClawStateDatabaseReadAdmission(resolveOpenClawStateSqlitePath(scope.env ?? process.env)).coordinationKey, [scope]).finish();
}
function capturePluginStateEpochs(coordinationKey, scopes, ownMutation) {
	const observations = scopes.map((scope) => {
		const epoch = namespaceEpoch(coordinationKey, scope);
		return {
			epoch,
			revision: epoch.revision,
			pending: [...epoch.pending].some((token) => token !== ownMutation)
		};
	});
	return () => {
		for (const { epoch, revision, pending } of observations) if (epoch.revision !== revision || pending || [...epoch.pending].some((token) => token !== ownMutation)) throw new PluginStateOperationInvalidatedError();
	};
}
//#endregion
//#region src/plugin-state/plugin-state-observation-cache.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.pluginStateObservationCache"), () => {
	const entries = new LruCache(512, {
		maxBytes: 8388608,
		sizeOf: (entry) => 128 + (entry.row?.value_json.length ?? 0) * 2
	});
	const namespaces = new LruCache(64, {
		maxBytes: 8388608,
		sizeOf: (entry) => entry.bytes
	});
	const pending = /* @__PURE__ */ new Map();
	pluginStatePublication.subscribeFacts((change) => {
		const identity = change.kind === "committed" ? change.receipt.source.identity : change.identity;
		if (typeof identity !== "string") return;
		if (change.kind === "pending") {
			const operations = pending.get(identity) ?? /* @__PURE__ */ new Set();
			operations.add(change.operationId);
			pending.set(identity, operations);
		} else if (change.kind === "settled") {
			const operations = pending.get(identity);
			operations?.delete(change.operationId);
			if (!operations?.size) pending.delete(identity);
		} else if (change.kind === "unknown") {
			for (const key of entries.keys()) if (entries.peek(key)?.identity === identity) entries.delete(key);
		} else if (change.kind === "committed") for (const [key, fact] of change.receipt.facts) {
			const entryKey = JSON.stringify([identity, key]);
			if (fact.kind === "unknown") entries.delete(entryKey);
			else entries.set(entryKey, {
				identity,
				loaded: true,
				row: fact.kind === "postimage" ? fact.value : void 0
			});
		}
		if (change.kind === "unknown" || change.kind === "committed") for (const key of namespaces.keys()) {
			const entry = namespaces.peek(key);
			if (entry.identity === identity && (change.kind === "unknown" || [...change.receipt.facts.keys()].some((factKey) => factKey.startsWith(entry.keyPrefix)))) namespaces.delete(key);
		}
	});
	return {
		entries,
		namespaces,
		pending
	};
});
function cacheKey(identity, key) {
	return JSON.stringify([identity, pluginStatePublicationKey({
		plugin_id: key.pluginId,
		namespace: key.namespace,
		entry_key: key.key
	})]);
}
function readPluginStateObservationCache(identity, key) {
	if (state.pending.has(identity)) return;
	return readCommittedPluginStateObservationCache(identity, key);
}
/** Pending writes do not replace committed facts used by a live native lease. */
function readCommittedPluginStateObservationCache(identity, key) {
	const entry = state.entries.get(cacheKey(identity, key));
	if (!entry?.loaded) return;
	const row = entry.row;
	return { row: row?.expires_at != null && row.expires_at <= Date.now() ? void 0 : row };
}
function preparePluginStateObservationCacheRead(identity, key) {
	const id = cacheKey(identity, key);
	const entry = {
		identity,
		loaded: false
	};
	state.entries.set(id, entry);
	return (row) => {
		if (state.entries.peek(id) === entry) state.entries.set(id, {
			identity,
			loaded: true,
			row
		});
	};
}
function readPluginStateEntriesCache(identity, key) {
	const entries = state.namespaces.get(JSON.stringify([
		identity,
		key.pluginId,
		key.namespace
	]))?.entries;
	if (!entries) return;
	const now = Date.now();
	return structuredClone(entries.filter((entry) => entry.expiresAt == null || entry.expiresAt > now));
}
function preparePluginStateEntriesCacheRead(identity, key) {
	const id = JSON.stringify([
		identity,
		key.pluginId,
		key.namespace
	]);
	const entry = {
		identity,
		keyPrefix: `${JSON.stringify([key.pluginId, key.namespace]).slice(0, -1)},`,
		bytes: 128
	};
	state.namespaces.set(id, entry);
	return (entries) => {
		if (state.namespaces.peek(id) === entry) state.namespaces.set(id, {
			...entry,
			entries: structuredClone(entries),
			bytes: 128 + JSON.stringify(entries).length * 2
		});
	};
}
function observationFromCachedPluginState(identity, path, key, current) {
	return createPluginStateObservation(path, pluginStateComparisonScope(identity, key), current.row, "lookup");
}
//#endregion
//#region src/plugin-state/plugin-state-worker-client.ts
function prepareCommandOrder(coordinationKey, command) {
	switch (command.type) {
		case "pluginState.executeOperation": return;
		case "pluginState.lookup":
		case "pluginState.lookupMany":
		case "pluginState.entries":
		case "pluginState.entriesInKeyRange":
		case "pluginState.count":
		case "pluginState.observe": return { ready: capturePluginStateMutationSettlement(coordinationKey, [command.input]) };
		case "pluginState.appendJournal": return beginPluginStateMutation(coordinationKey, [{
			pluginId: command.input.pluginId,
			namespace: command.input.cursorNamespace
		}, {
			pluginId: command.input.pluginId,
			namespace: command.input.journalNamespace
		}]);
		case "pluginState.moveEntries": return beginPluginStateMutation(coordinationKey, [command.input, {
			...command.input,
			namespace: command.input.sourceNamespace
		}]);
		default: return beginPluginStateMutation(coordinationKey, [command.input]);
	}
}
async function execute({ env, assertActive, sessionEntryCurrent, context: capturedContext, signal }, command, missing, checks = {}) {
	const { assertCurrent, isObservation, existingOnly, onCommitted } = checks;
	const currentEntries = sessionEntryCurrent && "source" in sessionEntryCurrent ? {
		sources: [sessionEntryCurrent.source],
		assertCurrent: ([entry]) => sessionEntryCurrent.assertCurrent(entry)
	} : sessionEntryCurrent;
	const assertAdmission = assertCurrent ? () => {
		assertActive?.();
		assertCurrent();
	} : assertActive;
	assertAdmission?.();
	const databasePath = capturedContext?.admission.databasePath ?? resolveOpenClawStateSqlitePath(env ?? process.env);
	const description = pluginStateWorkerOperations[command.type];
	let operationStarted = false;
	let order;
	let publication;
	let installObservation;
	let installEntries;
	try {
		const context = capturedContext ?? captureOpenClawStateWorkerContext({
			path: databasePath,
			env
		});
		if (checks.readDependency) {
			const identity = context.admission.identity.key;
			recordPluginStateReadDependency({
				...checks.readDependency,
				identity: identity.startsWith("file:") ? identity : void 0,
				assertCurrent: context.admission.assertCurrent
			});
		}
		const typedCommand = command;
		order = prepareCommandOrder(context.admission.coordinationKey, typedCommand);
		if (order?.finish || typedCommand.type === "pluginState.executeOperation" && typedCommand.input.writeStores.length > 0) publication = beginPluginStatePublication(() => context.admission.identity.key, context.assertPublicationCurrent ?? context.admission.assertCurrent);
		if (order?.ready) {
			await order.ready;
			assertAdmission?.();
		}
		if (!currentEntries && (typedCommand.type === "pluginState.observe" || typedCommand.type === "pluginState.lookup" || typedCommand.type === "pluginState.lookupMany" || typedCommand.type === "pluginState.entries")) {
			const identity = context.admission.identity.key;
			const keys = typedCommand.type === "pluginState.entries" ? [] : typedCommand.type === "pluginState.lookupMany" ? typedCommand.input.keys : [typedCommand.input.key];
			const cachedEntries = typedCommand.type === "pluginState.entries" ? readPluginStateEntriesCache(identity, typedCommand.input) : void 0;
			const cached = keys.map((key) => readPluginStateObservationCache(identity, {
				...typedCommand.input,
				key
			}));
			if (cached.every((entry) => entry !== void 0) && (typedCommand.type !== "pluginState.entries" || cachedEntries !== void 0)) {
				const terminalFailure = openClawStateDatabaseCache.getOpenClawStateDatabaseRecordedFailure(databasePath);
				if (terminalFailure) throw terminalFailure;
				operationStarted = true;
				context.admission.assertCurrent();
				assertStateDatabaseReadAllowed(databasePath);
				assertAdmission?.();
				if (hasSqliteDatabaseSchemaAdmissionForIdentity(context.admission.identity)) {
					if (typedCommand.type === "pluginState.entries") return cachedEntries;
					if (typedCommand.type === "pluginState.observe") return {
						...observationFromCachedPluginState(identity, databasePath, typedCommand.input, cached[0]),
						row: cached[0].row
					};
					const values = cached.map(({ row }) => {
						try {
							return ok(row ? parseStoredJson(row.value_json, "lookup", databasePath) : void 0);
						} catch (error) {
							if (error instanceof PluginStateStoreError && error.code === "PLUGIN_STATE_CORRUPT") return err(capturePluginStateWorkerFailure(error));
							throw error;
						}
					});
					if (typedCommand.type === "pluginState.lookupMany") return values;
					const value = values[0];
					if (!value.ok) throw restorePluginStateWorkerFailure(value.error);
					return value.value;
				}
				operationStarted = false;
			}
			if (typedCommand.type === "pluginState.observe") installObservation = preparePluginStateObservationCacheRead(identity, typedCommand.input);
			else if (typedCommand.type === "pluginState.entries") installEntries = preparePluginStateEntriesCacheRead(identity, typedCommand.input);
		}
		const [{ runOpenClawStateWorkerOperation }, { createSqliteWorkerWriteAdmission }, { createSqliteWorkerOperationAdmission }] = await Promise.all([
			import("./openclaw-state-worker-store-1jCE83ab.mjs"),
			import("./sqlite-worker-store-BMFDZ5bx.mjs"),
			import("./sqlite-worker-operation-admission-DJeEhCu0.mjs")
		]);
		const operation = async (scope) => {
			operationStarted = true;
			const result = await scope.execute(command.input === void 0 ? command : {
				type: command.type,
				input: {
					...command.input,
					sessionEntryCurrentSources: currentEntries?.sources
				}
			});
			if (!result.ok) throw restorePluginStateWorkerFailure(result.error);
			if (command.type === "pluginState.observe") {
				const observation = result.value;
				installObservation?.(observation.row);
			} else if (command.type === "pluginState.entries") installEntries?.(result.value);
			return result.value;
		};
		if (missing) {
			const result = await runOpenClawStateWorkerOperation(context, operation, {
				signal,
				existingOnly: true,
				assertCurrent: assertAdmission
			});
			assertActive?.();
			return result === void 0 ? missing() : result;
		}
		const assertWriteCurrent = (request) => {
			context.admission.assertCurrent();
			assertAdmission?.();
			assertSessionEntriesCurrentAdmission(request, currentEntries);
		};
		const baseAdmission = command.type === "pluginState.replaceEntry" ? () => {
			const stages = [
				"transaction",
				"commit",
				"transaction",
				"commit"
			];
			let next = 0;
			return {
				nativeLocations: [databasePath],
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					if (request.stage !== stages[next]) throw new Error("Plugin state replacement authority requested out of order");
					assertWriteCurrent(request);
					if (!grant()) throw new Error("Plugin state replacement authority expired");
					next += 1;
				})
			};
		} : createSqliteWorkerWriteAdmission(assertWriteCurrent, [databasePath]);
		const result = await runOpenClawStateWorkerOperation(context, operation, {
			signal,
			assertCurrent: assertAdmission,
			createAdmission: withPluginStatePublication(baseAdmission, context, onCommitted),
			existingOnly: existingOnly !== void 0
		});
		if (result === void 0 && existingOnly) return existingOnly.missing();
		if (isObservation?.(result)) assertAdmission?.();
		return result;
	} catch (error) {
		throw wrapPluginStateError(error, description.operation, operationStarted ? description.code : "PLUGIN_STATE_OPEN_FAILED", operationStarted ? description.message : "Failed to open the plugin state database.", databasePath);
	} finally {
		try {
			publication?.finish("completed");
		} finally {
			order?.finish?.();
		}
	}
}
function executePluginStateOperationInWorker(params, options) {
	const { env, assertActive, assertCurrent, sessionEntryCurrent, context, ...input } = params;
	const readOnly = input.writeStores.length === 0;
	return execute({
		env,
		assertActive,
		sessionEntryCurrent,
		context
	}, {
		type: "pluginState.executeOperation",
		input
	}, readOnly ? options.missing ?? (() => {
		throw new Error("Plugin state operation source does not exist");
	}) : void 0, {
		assertCurrent,
		onCommitted(facts) {
			options.onCommitted(facts.pluginStateOperation);
		}
	});
}
function createOperation(type, missing, isObservation, readDependency) {
	return (params) => {
		const input = { ...params };
		const { env, assertActive, assertCurrent, sessionEntryCurrent, context, signal } = input;
		delete input.context;
		delete input.env;
		delete input.assertActive;
		delete input.assertCurrent;
		delete input.sessionEntryCurrent;
		delete input.signal;
		return execute({
			env,
			assertActive,
			sessionEntryCurrent,
			context,
			signal
		}, {
			type,
			input
		}, missing, {
			assertCurrent,
			isObservation,
			readDependency: readDependency?.(params)
		});
	};
}
const registerPluginStateInWorker = createOperation("pluginState.register");
const replacePluginStateInWorker = createOperation("pluginState.replace");
const replacePluginStateEntryInWorker = createOperation("pluginState.replaceEntry");
const observePluginStateRowInWorker = createOperation("pluginState.observe", void 0, () => true, ({ pluginId, namespace, key }) => ({
	pluginId,
	namespace,
	keys: [key]
}));
async function observePluginStateInWorker(params) {
	const { value, comparison } = await observePluginStateRowInWorker(params);
	return {
		value,
		comparison
	};
}
const comparePluginStateUpdateInWorker = createOperation("pluginState.compareUpdate", void 0, (result) => result.status === "conflict");
const comparePluginStateDeleteInWorker = createOperation("pluginState.compareDelete", void 0, (result) => result.status === "conflict");
const registerPluginStateIfAbsentInWorker = createOperation("pluginState.registerIfAbsent");
const deletePluginStateIfEqualInWorker = createOperation("pluginState.deleteIfEqual");
const lookupPluginStateInWorker = createOperation("pluginState.lookup", () => void 0, void 0, ({ pluginId, namespace, key }) => ({
	pluginId,
	namespace,
	keys: [key]
}));
async function lookupManyPluginStateInWorker(params) {
	const { env, assertActive, sessionEntryCurrent, context, signal, ...input } = params;
	params.assertActive?.();
	if (input.keys.length === 0) return [];
	return (await execute({
		env,
		assertActive,
		sessionEntryCurrent,
		context,
		signal
	}, {
		type: "pluginState.lookupMany",
		input
	}, () => input.keys.map(() => ok(void 0)), { readDependency: {
		pluginId: input.pluginId,
		namespace: input.namespace,
		keys: input.keys
	} })).map((result) => result.ok ? result : err(restorePluginStateWorkerFailure(result.error)));
}
const consumePluginStateInWorker = createOperation("pluginState.consume");
const deletePluginStateInWorker = createOperation("pluginState.delete");
const listPluginStateInWorker = createOperation("pluginState.entries", () => []);
const clearPluginStateInWorker = createOperation("pluginState.clear");
function clearRuntimeHealthInWorker(params) {
	const { env, assertActive, assertCurrent, sessionEntryCurrent, context, signal, ...input } = params;
	return execute({
		env,
		assertActive,
		sessionEntryCurrent,
		context,
		signal
	}, {
		type: "pluginState.clearRuntimeHealth",
		input
	}, void 0, {
		assertCurrent,
		existingOnly: { missing: () => void 0 }
	});
}
const countPluginStateInWorker = createOperation("pluginState.count", () => 0);
const registerPluginStateJournalInWorker = createOperation("pluginState.appendJournal");
const listPluginStateInKeyRangeInWorker = createOperation("pluginState.entriesInKeyRange", () => []);
const movePluginStateEntriesInWorker = createOperation("pluginState.moveEntries");
//#endregion
export { beginPluginStateMutation as C, invalidatePluginStateMutation as E, readCommittedPluginStateObservationCache as S, capturePluginStateMutationSettlement as T, registerPluginStateIfAbsentInWorker as _, consumePluginStateInWorker as a, replacePluginStateEntryInWorker as b, deletePluginStateInWorker as c, listPluginStateInWorker as d, lookupManyPluginStateInWorker as f, observePluginStateRowInWorker as g, observePluginStateInWorker as h, comparePluginStateUpdateInWorker as i, executePluginStateOperationInWorker as l, movePluginStateEntriesInWorker as m, clearRuntimeHealthInWorker as n, countPluginStateInWorker as o, lookupPluginStateInWorker as p, comparePluginStateDeleteInWorker as r, deletePluginStateIfEqualInWorker as s, clearPluginStateInWorker as t, listPluginStateInKeyRangeInWorker as u, registerPluginStateInWorker as v, capturePluginStateEpochs as w, replacePluginStateInWorker as x, registerPluginStateJournalInWorker as y };
