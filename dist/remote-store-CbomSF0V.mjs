import { r as isArtifactPreservingStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as readConfigMachineState, r as readConfigMachineStateRowInDatabase } from "./config-machine-state-DR7LQrw2.mjs";
import { i as updateConfigMachineStateInDatabase, r as updateConfigMachineState } from "./config-machine-state-write-pMcF7uIi.mjs";
//#region src/model-catalog/remote-store.ts
const REMOTE_MODEL_CATALOG_STATE_KEY = "modelCatalog.remote.v2";
const LEGACY_REMOTE_MODEL_CATALOG_STATE_KEY = "modelCatalog.remote";
function readRemoteModelCatalog(options = {}) {
	const snapshot = readConfigMachineState(REMOTE_MODEL_CATALOG_STATE_KEY, options) ?? readConfigMachineState(LEGACY_REMOTE_MODEL_CATALOG_STATE_KEY, options);
	return snapshot ? {
		id: 1,
		...snapshot
	} : void 0;
}
/** Read the startup catalog through the existing shared-state inspection owner. */
async function readRemoteModelCatalogAsync(context) {
	const artifactPreservingReadOnly = isArtifactPreservingStateRead();
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	context.admission.assertCurrent();
	return runOpenClawStateWorkerOperation(context, async (scope) => {
		const row = await scope.execute({
			type: "modelCatalog.remote.read",
			input: { artifactPreservingReadOnly }
		});
		context.admission.assertCurrent();
		return row;
	}, { existingOnly: true });
}
function writeRemoteModelCatalog(row, options = {}) {
	let result = { status: "written" };
	updateConfigMachineState(REMOTE_MODEL_CATALOG_STATE_KEY, (current) => {
		if (current && current.source_url === row.source_url && (current.generated_at > row.generated_at || current.generated_at === row.generated_at && current.bundle_json !== row.bundle_json)) {
			result = {
				status: "retained-newer",
				row: {
					id: 1,
					...current
				}
			};
			return current;
		}
		return row;
	}, options);
	return result;
}
function markRemoteModelCatalogChecked(checkedAt, metadata, options = {}) {
	let matched = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		const legacyJson = readConfigMachineStateRowInDatabase(db, LEGACY_REMOTE_MODEL_CATALOG_STATE_KEY)?.value_json;
		let legacy;
		if (legacyJson !== void 0) legacy = JSON.parse(legacyJson);
		updateConfigMachineStateInDatabase(db, REMOTE_MODEL_CATALOG_STATE_KEY, (stored) => {
			const current = stored ?? legacy;
			if (!current || current.source_url !== metadata.expected.source_url || current.generated_at !== metadata.expected.generated_at || current.etag !== metadata.expected.etag || current.last_modified !== metadata.expected.last_modified) return stored;
			matched = true;
			return {
				...current,
				checked_at: checkedAt,
				...metadata.etag !== void 0 ? { etag: metadata.etag } : {},
				...metadata.lastModified !== void 0 ? { last_modified: metadata.lastModified } : {}
			};
		}, Date.now());
	}, options, { operationLabel: "model-catalog.remote.mark-checked" });
	return matched;
}
//#endregion
export { writeRemoteModelCatalog as i, readRemoteModelCatalog as n, readRemoteModelCatalogAsync as r, markRemoteModelCatalogChecked as t };
