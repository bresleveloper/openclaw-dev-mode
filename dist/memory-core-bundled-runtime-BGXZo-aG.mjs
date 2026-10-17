import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { i as loadBundledPluginPublicSurfaceModuleSyncCore } from "./facade-loader-B-X-HqBc.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { r as createPluginStateKeyedStore } from "./plugin-state-store-yKq-W0-T.mjs";
import { n as createConfiguredProviderLocalServiceAcquirer } from "./provider-local-service-ucCbK8nV.mjs";
//#region src/plugin-sdk/memory-core-bundled-runtime.ts
var memory_core_bundled_runtime_exports = /* @__PURE__ */ __exportAll({
	auditDreamingArtifacts: () => auditDreamingArtifacts,
	auditShortTermPromotionArtifacts: () => auditShortTermPromotionArtifacts,
	createEmbeddingProvider: () => createEmbeddingProvider,
	dedupeDreamDiaryEntries: () => dedupeDreamDiaryEntries,
	getMissingLocalMemoryEmbeddingProviderMessage: () => getMissingLocalMemoryEmbeddingProviderMessage,
	loadShortTermPromotionDreamingStats: () => loadShortTermPromotionDreamingStats,
	previewGroundedRemMarkdown: () => previewGroundedRemMarkdown,
	removeBackfillDiaryEntries: () => removeBackfillDiaryEntries,
	removeGroundedShortTermCandidates: () => removeGroundedShortTermCandidates,
	repairDreamingArtifacts: () => repairDreamingArtifacts,
	repairShortTermPromotionArtifacts: () => repairShortTermPromotionArtifacts,
	writeBackfillDiaryEntries: () => writeBackfillDiaryEntries
});
function loadApiFacadeModule() {
	const module = loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName: "memory-core",
		artifactBasename: "api.js"
	});
	module.configureMemoryCoreDreamingState((options) => createPluginStateKeyedStore("memory-core", options));
	return module;
}
function loadRuntimeFacadeModule() {
	const module = loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName: "memory-core",
		artifactBasename: "runtime-api.js"
	});
	module.configureMemoryCoreDreamingState((options) => createPluginStateKeyedStore("memory-core", options));
	return module;
}
/** Returns the memory-core-owned recovery message for an absent local provider plugin. */
function getMissingLocalMemoryEmbeddingProviderMessage() {
	return loadApiFacadeModule().MISSING_LOCAL_MEMORY_EMBEDDING_PROVIDER_MESSAGE;
}
const acquireLocalService = createConfiguredProviderLocalServiceAcquirer(getRuntimeConfig);
/** Create a memory embedding provider with built-in fallback metadata. */
const createEmbeddingProvider = (options) => {
	const createOptions = {
		...options,
		acquireLocalService
	};
	return loadRuntimeFacadeModule().createEmbeddingProvider(createOptions);
};
/** Remove short-term recall candidates already grounded into durable memory. */
const removeGroundedShortTermCandidates = (...args) => loadRuntimeFacadeModule().removeGroundedShortTermCandidates(...args);
/** Load short-term dreaming stats for doctor/control status. */
const loadShortTermPromotionDreamingStats = (...args) => loadRuntimeFacadeModule().loadShortTermPromotionDreamingStats(...args);
/** Audit dreaming diary and session-corpus artifacts through the bundled runtime facade. */
const auditDreamingArtifacts = (...args) => loadRuntimeFacadeModule().auditDreamingArtifacts(...args);
/** Audit short-term promotion artifacts through the bundled runtime facade. */
const auditShortTermPromotionArtifacts = (...args) => loadRuntimeFacadeModule().auditShortTermPromotionArtifacts(...args);
/** Repair or archive problematic dreaming artifacts through the bundled runtime facade. */
const repairDreamingArtifacts = (...args) => loadRuntimeFacadeModule().repairDreamingArtifacts(...args);
/** Repair short-term promotion artifacts through the bundled runtime facade. */
const repairShortTermPromotionArtifacts = (...args) => loadRuntimeFacadeModule().repairShortTermPromotionArtifacts(...args);
/** Preview grounded REM markdown facts and candidates for selected input files. */
const previewGroundedRemMarkdown = (...args) => loadApiFacadeModule().previewGroundedRemMarkdown(...args);
/** Remove duplicate dreaming diary entries while preserving canonical records. */
const dedupeDreamDiaryEntries = (...args) => loadApiFacadeModule().dedupeDreamDiaryEntries(...args);
/** Write synthetic/backfill dreaming diary entries for harness or migration use. */
const writeBackfillDiaryEntries = (...args) => loadApiFacadeModule().writeBackfillDiaryEntries(...args);
/** Remove dreaming diary entries previously written by the backfill helper. */
const removeBackfillDiaryEntries = (...args) => loadApiFacadeModule().removeBackfillDiaryEntries(...args);
//#endregion
export { getMissingLocalMemoryEmbeddingProviderMessage as a, previewGroundedRemMarkdown as c, repairDreamingArtifacts as d, repairShortTermPromotionArtifacts as f, dedupeDreamDiaryEntries as i, removeBackfillDiaryEntries as l, auditShortTermPromotionArtifacts as n, loadShortTermPromotionDreamingStats as o, writeBackfillDiaryEntries as p, createEmbeddingProvider as r, memory_core_bundled_runtime_exports as s, auditDreamingArtifacts as t, removeGroundedShortTermCandidates as u };
