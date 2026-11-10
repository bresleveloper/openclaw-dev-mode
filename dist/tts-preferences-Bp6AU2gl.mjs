import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as getTtsMachinePathAdmission } from "./config-machine-state-row-BRr4hJIX.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import "./config-machine-state-DdwUh_Ff.mjs";
//#region src/tts/tts-preferences.ts
const pendingPaths = resolveGlobalSingleton(Symbol.for("openclaw.pendingTtsPreferencePaths"), () => /* @__PURE__ */ new Map());
/** Synchronous compatibility reads consume only the path already admitted by its owner. */
function getPreparedTtsPreferences() {
	const admitted = getTtsMachinePathAdmission(resolveOpenClawStateSqlitePath());
	return admitted ? preparePath(admitted.row?.value_json) : void 0;
}
/** Carry the machine-owned path through one turn; preference-file contents stay fresh. */
async function prepareTtsPreferences() {
	const databasePath = resolveOpenClawStateSqlitePath();
	const admitted = getTtsMachinePathAdmission(databasePath);
	if (admitted) return preparePath(admitted.row?.value_json);
	const context = captureOpenClawStateReadWorkerContext({ path: databasePath });
	const identity = context.admission.identity;
	if (!identity.key.startsWith("file:")) return loadPath(context);
	const key = `${identity.key}:${identity.birthtime ?? ""}`;
	let pending = pendingPaths.get(key);
	if (!pending) {
		const load = loadPath(context);
		pendingPaths.set(key, load);
		const release = () => {
			if (pendingPaths.get(key) === load) pendingPaths.delete(key);
		};
		load.then(release, release);
		pending = load;
	}
	return { ...await pending };
}
async function loadPath(context) {
	const databasePath = context.admission.databasePath;
	const reply = await executeExistingOpenClawStateRead({ path: databasePath }, { type: "tts.prefsPath" }, {
		context,
		current: true
	});
	if (!reply) return {};
	if (!reply.ok || reply.type !== "tts.prefsPath") throw new Error("Unexpected TTS preference-path read result");
	const installed = getTtsMachinePathAdmission(databasePath, () => reply.row);
	return preparePath((installed ? installed.row : reply.row)?.value_json);
}
function preparePath(valueJson) {
	const value = valueJson === void 0 ? void 0 : JSON.parse(valueJson);
	if (value != null && typeof value !== "string") throw new Error("Invalid TTS preference path: expected a string");
	return { machinePrefsPath: value ?? void 0 };
}
//#endregion
export { prepareTtsPreferences as n, getPreparedTtsPreferences as t };
