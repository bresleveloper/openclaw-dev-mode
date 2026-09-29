import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
//#region src/gateway/server/process-vitals.ts
const loadWorkerPoolOwners = createLazyPromise(() => Promise.all([import("./session-transcript-reconcile-pool-Do3zqEbs.mjs"), import("./prepared-model-catalog-worker-BXeyGAsb.mjs")]));
async function readGatewayWorkerPoolFacts() {
	const [transcripts, catalogs] = await loadWorkerPoolOwners();
	return {
		transcriptReconciliation: transcripts.getSessionTranscriptReconcileWorkerPoolSnapshot(),
		modelCatalog: catalogs.getPreparedModelCatalogWorkerPoolSnapshot()
	};
}
async function collectGatewayWorkerPoolMetrics() {
	return Object.entries(await readGatewayWorkerPoolFacts()).flatMap(([owner, facts]) => Object.entries(facts).map(([name, value]) => [`${owner}${name[0].toUpperCase()}${name.slice(1)}`, value]));
}
/** Read process counters without projecting sessions, tasks, or channel state. */
function readGatewayProcessVitals(getEventLoopHealth) {
	const eventLoop = getEventLoopHealth?.();
	const memory = process.memoryUsage();
	return {
		...eventLoop ? { eventLoop } : {},
		processMemory: {
			rssBytes: memory.rss,
			heapUsedBytes: memory.heapUsed,
			heapTotalBytes: memory.heapTotal,
			externalBytes: memory.external,
			arrayBuffersBytes: memory.arrayBuffers
		}
	};
}
//#endregion
export { readGatewayProcessVitals as n, readGatewayWorkerPoolFacts as r, collectGatewayWorkerPoolMetrics as t };
