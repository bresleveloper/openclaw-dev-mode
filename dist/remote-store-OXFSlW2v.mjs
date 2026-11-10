import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as readConfigMachineState } from "./config-machine-state-DdwUh_Ff.mjs";
//#region src/model-catalog/remote-store.ts
const REMOTE_MODEL_CATALOG_STATE_KEY = "modelCatalog.remote.v2";
const LEGACY_REMOTE_MODEL_CATALOG_STATE_KEY = "modelCatalog.remote";
/** Synchronous boot snapshot capture and offline inspection only; refreshes use the worker. */
function readRemoteModelCatalog(options = {}) {
	const snapshot = readConfigMachineState("modelCatalog.remote.v2", options) ?? readConfigMachineState("modelCatalog.remote", options);
	return snapshot ? {
		id: 1,
		...snapshot
	} : void 0;
}
/** Read through the existing shared-state owner, retaining the originally selected store. */
async function readRemoteModelCatalogAsync(context) {
	const artifactPreservingReadOnly = isArtifactPreservingStateRead();
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
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
async function writeRemoteModelCatalogAsync(row, context) {
	const input = { ...row };
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	const { createSqliteWorkerWriteAdmission } = await import("./sqlite-worker-store-BMFDZ5bx.mjs");
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "modelCatalog.remote.write",
		input
	}), { createAdmission: createSqliteWorkerWriteAdmission(() => context.admission.assertCurrent(), [context.admission.databasePath]) });
}
async function markRemoteModelCatalogCheckedAsync(checkedAt, metadata, context) {
	const input = {
		checkedAt,
		metadata: {
			...metadata,
			expected: {
				source_url: metadata.expected.source_url,
				generated_at: metadata.expected.generated_at,
				etag: metadata.expected.etag,
				last_modified: metadata.expected.last_modified
			}
		}
	};
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	const { createSqliteWorkerWriteAdmission } = await import("./sqlite-worker-store-BMFDZ5bx.mjs");
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "modelCatalog.remote.markChecked",
		input
	}), { createAdmission: createSqliteWorkerWriteAdmission(() => context.admission.assertCurrent(), [context.admission.databasePath]) });
}
//#endregion
export { readRemoteModelCatalogAsync as a, readRemoteModelCatalog as i, REMOTE_MODEL_CATALOG_STATE_KEY as n, writeRemoteModelCatalogAsync as o, markRemoteModelCatalogCheckedAsync as r, LEGACY_REMOTE_MODEL_CATALOG_STATE_KEY as t };
