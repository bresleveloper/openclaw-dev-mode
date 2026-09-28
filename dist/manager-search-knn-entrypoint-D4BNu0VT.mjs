//#region extensions/memory-core/src/memory/manager-search-knn-entrypoint.ts
const vectorKnnProcessEntrypoint = {
	currentModuleUrl: import.meta.url,
	sourceWorkerName: "manager-search-knn.child",
	distWorkerPath: "extensions/memory-core/memory-search-knn.child.js"
};
//#endregion
export { vectorKnnProcessEntrypoint as t };
