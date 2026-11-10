import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { n as readWorkerPlacementModelSource, o as resolveWorkerPlacementSessionRuntime, s as resolveWorkerPlacementSessionRuntimeAsync } from "./placement-session-runtime-CaRixRbi.mjs";
//#region src/gateway/worker-environments/placement-session-runtime-preparation.ts
/** Prepare inherited model facts; execution and credentials retain their own live authority. */
async function prepareWorkerPlacementSessionRuntime(params) {
	const parents = /* @__PURE__ */ new Map();
	await resolveWorkerPlacementSessionRuntimeAsync({
		...params,
		readSourceEntry: async (key) => {
			const metadata = captureSessionEntryMetadataRead({
				sessionKey: key,
				agentId: params.agentId
			}, () => {});
			if (metadata) {
				parents.set(key, () => metadata.readCurrent());
				return metadata.readCurrent();
			}
			const entry = await readWorkerPlacementModelSource(params, key);
			parents.set(key, () => entry);
			return entry;
		}
	});
	return (currentCfg, currentEntry) => resolveWorkerPlacementSessionRuntime({
		cfg: currentCfg,
		entry: currentEntry,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		readSourceEntry: (key) => {
			const read = parents.get(key);
			if (!read) throw new Error("Session model inheritance changed during worker placement; retry.");
			return read();
		}
	});
}
//#endregion
export { prepareWorkerPlacementSessionRuntime as t };
