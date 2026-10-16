import { o as withArtifactPreservingStateReads } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as readRemoteModelCatalog } from "./remote-store-CbomSF0V.mjs";
//#region src/model-catalog/remote-store.worker.ts
const modelCatalogOperations = { "modelCatalog.remote.read": (input, { stateOptions }) => {
	const read = () => readRemoteModelCatalog(stateOptions());
	return input.artifactPreservingReadOnly ? withArtifactPreservingStateReads(read) : read();
} };
//#endregion
export { modelCatalogOperations };
