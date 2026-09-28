import { t as listMemoryHostPublicArtifacts } from "./memory-host-core-DP3Ksyf2.mjs";
//#region extensions/memory-core/src/public-artifacts.ts
async function listMemoryCorePublicArtifacts(params) {
	return await listMemoryHostPublicArtifacts(params);
}
//#endregion
export { listMemoryCorePublicArtifacts };
