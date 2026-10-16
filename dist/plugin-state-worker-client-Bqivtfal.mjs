import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as wrapPluginStateError } from "./plugin-state-store.database-VwspSyEa.mjs";
import { t as assertSessionEntriesCurrentAdmission } from "./session-entry-current-admission-Cvdu1qxp.mjs";
import { n as pluginStateWorkerOperations } from "./plugin-state-worker-contract-BGdodjwz.mjs";
import { n as restorePluginStateWorkerFailure } from "./plugin-state-worker-errors-Xq7iJ5DH.mjs";
//#region src/plugin-state/plugin-state-worker-client.ts
async function execute({ env, assertActive, sessionEntryCurrent, signal }, command, missing, checks = {}) {
	const { assertCurrent, isObservation, existingOnly } = checks;
	const currentEntries = sessionEntryCurrent && "source" in sessionEntryCurrent ? {
		sources: [sessionEntryCurrent.source],
		assertCurrent: ([entry]) => sessionEntryCurrent.assertCurrent(entry)
	} : sessionEntryCurrent;
	const assertAdmission = assertCurrent ? () => {
		assertActive?.();
		assertCurrent();
	} : assertActive;
	assertAdmission?.();
	const databasePath = resolveOpenClawStateSqlitePath(env ?? process.env);
	const description = pluginStateWorkerOperations[command.type];
	let dispatched = false;
	try {
		const context = captureOpenClawStateWorkerContext({
			path: databasePath,
			env
		});
		const [{ runOpenClawStateWorkerOperation }, { createSqliteWorkerWriteAdmission }] = await Promise.all([import("./openclaw-state-worker-store-RW5P1VzC.mjs"), import("./sqlite-worker-store-d0f4y8qR.mjs")]);
		const operation = async (scope) => {
			dispatched = true;
			const result = await scope.execute(command.input === void 0 ? command : {
				type: command.type,
				input: {
					...command.input,
					sessionEntryCurrentSources: currentEntries?.sources
				}
			});
			if (!result.ok) throw restorePluginStateWorkerFailure(result.error);
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
		const result = await runOpenClawStateWorkerOperation(context, operation, {
			signal,
			assertCurrent: assertAdmission,
			createAdmission: createSqliteWorkerWriteAdmission((request) => {
				context.admission.assertCurrent();
				assertAdmission?.();
				assertSessionEntriesCurrentAdmission(request, currentEntries);
			}, [databasePath]),
			existingOnly: existingOnly !== void 0
		});
		if (result === void 0 && existingOnly) return existingOnly.missing();
		if (isObservation?.(result)) assertAdmission?.();
		return result;
	} catch (error) {
		throw wrapPluginStateError(error, description.operation, dispatched ? description.code : "PLUGIN_STATE_OPEN_FAILED", dispatched ? description.message : "Failed to open the plugin state database.", databasePath);
	}
}
function createOperation(type, missing, isObservation) {
	return (params) => {
		const input = { ...params };
		const { env, assertActive, assertCurrent, sessionEntryCurrent, signal } = input;
		delete input.env;
		delete input.assertActive;
		delete input.assertCurrent;
		delete input.sessionEntryCurrent;
		delete input.signal;
		return execute({
			env,
			assertActive,
			sessionEntryCurrent,
			signal
		}, {
			type,
			input
		}, missing, {
			assertCurrent,
			isObservation
		});
	};
}
const registerPluginStateInWorker = createOperation("pluginState.register");
const observePluginStateInWorker = createOperation("pluginState.observe", void 0, () => true);
const comparePluginStateUpdateInWorker = createOperation("pluginState.compareUpdate", void 0, (result) => result.status === "conflict");
const comparePluginStateDeleteInWorker = createOperation("pluginState.compareDelete", void 0, (result) => result.status === "conflict");
const registerPluginStateIfAbsentInWorker = createOperation("pluginState.registerIfAbsent");
const deletePluginStateIfEqualInWorker = createOperation("pluginState.deleteIfEqual");
const lookupPluginStateInWorker = createOperation("pluginState.lookup", () => void 0);
async function lookupManyPluginStateInWorker(params) {
	const { env, assertActive, sessionEntryCurrent, signal, ...input } = params;
	params.assertActive?.();
	if (input.keys.length === 0) return [];
	return (await execute({
		env,
		assertActive,
		sessionEntryCurrent,
		signal
	}, {
		type: "pluginState.lookupMany",
		input
	}, () => input.keys.map(() => ok(void 0)))).map((result) => result.ok ? result : err(restorePluginStateWorkerFailure(result.error)));
}
const consumePluginStateInWorker = createOperation("pluginState.consume");
const deletePluginStateInWorker = createOperation("pluginState.delete");
const listPluginStateInWorker = createOperation("pluginState.entries", () => []);
const clearPluginStateInWorker = createOperation("pluginState.clear");
function clearRuntimeHealthInWorker(params) {
	const { env, assertActive, assertCurrent, sessionEntryCurrent, signal, ...input } = params;
	return execute({
		env,
		assertActive,
		sessionEntryCurrent,
		signal
	}, {
		type: "pluginState.clearRuntimeHealth",
		input
	}, void 0, {
		assertCurrent,
		existingOnly: { missing: () => void 0 }
	});
}
function sweepExpiredPluginStateEntriesInWorker(params = {}) {
	return execute(params, {
		type: "pluginState.sweep",
		input: void 0
	});
}
const countPluginStateInWorker = createOperation("pluginState.count", () => 0);
const registerPluginStateJournalInWorker = createOperation("pluginState.appendJournal");
const listPluginStateInKeyRangeInWorker = createOperation("pluginState.entriesInKeyRange", () => []);
const movePluginStateEntriesInWorker = createOperation("pluginState.moveEntries");
//#endregion
export { registerPluginStateJournalInWorker as _, consumePluginStateInWorker as a, deletePluginStateInWorker as c, lookupManyPluginStateInWorker as d, lookupPluginStateInWorker as f, registerPluginStateInWorker as g, registerPluginStateIfAbsentInWorker as h, comparePluginStateUpdateInWorker as i, listPluginStateInKeyRangeInWorker as l, observePluginStateInWorker as m, clearRuntimeHealthInWorker as n, countPluginStateInWorker as o, movePluginStateEntriesInWorker as p, comparePluginStateDeleteInWorker as r, deletePluginStateIfEqualInWorker as s, clearPluginStateInWorker as t, listPluginStateInWorker as u, sweepExpiredPluginStateEntriesInWorker as v };
