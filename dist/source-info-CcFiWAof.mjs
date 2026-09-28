//#region src/agents/sessions/source-info.ts
/** Converts package-manager path metadata into the session source-info shape. */
function createSourceInfo(path, metadata) {
	return {
		path,
		source: metadata.source,
		scope: metadata.scope,
		origin: metadata.origin,
		baseDir: metadata.baseDir
	};
}
/** Builds source metadata for generated or synthetic session entries. */
function createSyntheticSourceInfo(path, options) {
	return {
		path,
		source: options.source,
		scope: options.scope ?? "temporary",
		origin: options.origin ?? "top-level",
		baseDir: options.baseDir
	};
}
//#endregion
export { createSyntheticSourceInfo as n, createSourceInfo as t };
