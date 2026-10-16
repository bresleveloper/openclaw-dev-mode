//#region packages/memory-host-sdk/src/host/backend-config.ts
const DEFAULT_CITATIONS = "auto";
function resolveMemoryBackendConfig(params) {
	return {
		backend: "builtin",
		citations: params.cfg.memory?.citations ?? DEFAULT_CITATIONS
	};
}
//#endregion
export { resolveMemoryBackendConfig as t };
