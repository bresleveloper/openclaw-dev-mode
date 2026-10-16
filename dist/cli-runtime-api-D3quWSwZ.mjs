//#region extensions/crabbox/cli-runtime-api.ts
async function ensureManagedCrabboxBinary(params) {
	return (await import("./crabbox-managed-binary-Cf6R-tfu.mjs")).ensureManagedCrabboxBinary(params);
}
//#endregion
export { ensureManagedCrabboxBinary as t };
