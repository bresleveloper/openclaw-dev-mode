import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { i as readConfigMachineStateRowInDatabase } from "./config-machine-state-row-BRr4hJIX.mjs";
import "./openclaw-state-db-readonly-DPndG9sn.mjs";
import "./config-machine-state-DdwUh_Ff.mjs";
import { i as readRemoteModelCatalog, n as REMOTE_MODEL_CATALOG_STATE_KEY, t as LEGACY_REMOTE_MODEL_CATALOG_STATE_KEY } from "./remote-store-OXFSlW2v.mjs";
import { i as updateConfigMachineStateInDatabase } from "./config-machine-state-write-CmW-lLFq.mjs";
//#region src/model-catalog/remote-store.worker.ts
const modelCatalogOperations = {
	"modelCatalog.remote.read": (input, { stateOptions }) => {
		const read = () => readRemoteModelCatalog(stateOptions());
		return input.artifactPreservingReadOnly ? withArtifactPreservingStateReads(read) : read();
	},
	"modelCatalog.remote.write": (row, { writeAdmitted }) => writeAdmitted(({ db }) => {
		let result = { status: "written" };
		updateConfigMachineStateInDatabase(db, REMOTE_MODEL_CATALOG_STATE_KEY, (current) => {
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
		}, Date.now());
		return result;
	}),
	"modelCatalog.remote.markChecked": ({ checkedAt, metadata }, { writeAdmitted }) => writeAdmitted(({ db }) => {
		let matched = false;
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
		return matched;
	})
};
//#endregion
export { modelCatalogOperations };
