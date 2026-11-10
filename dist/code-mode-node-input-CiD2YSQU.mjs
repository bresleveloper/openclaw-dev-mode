//#region src/agents/code-mode-node-input.ts
const codeModeNodeInitialization = Symbol("code-mode-node-initialization");
/** Core catalog snapshots own these bytes; public executor inputs remain mutable. */
function prepareCodeModeNodeCatalog(input) {
	const { catalog, namespaces, apiFiles, swarmEnabled } = input;
	const json = JSON.stringify({
		__openclawCatalog: catalog,
		__openclawNamespaces: namespaces,
		__openclawApiFiles: apiFiles ?? [],
		__openclawSwarmEnabled: swarmEnabled === true
	});
	const buffer = new SharedArrayBuffer(Buffer.byteLength(json));
	new TextEncoder().encodeInto(json, new Uint8Array(buffer));
	return {
		catalog,
		namespaces,
		apiFiles,
		swarmEnabled,
		[codeModeNodeInitialization]: buffer
	};
}
//#endregion
export { prepareCodeModeNodeCatalog as n, codeModeNodeInitialization as t };
