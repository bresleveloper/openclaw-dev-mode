//#region extensions/crabbox/cli-runtime-api.ts
async function ensureManagedCrabboxBinary(params) {
	return (await import("./crabbox-managed-binary-CuDF2DrP.mjs")).ensureManagedCrabboxBinary(params);
}
//#endregion
export { ensureManagedCrabboxBinary as t };
