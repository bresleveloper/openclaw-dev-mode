import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { g as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-dWNS6Rcs.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { f as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import { performance } from "node:perf_hooks";
import { setImmediate } from "node:timers/promises";
//#region src/status/session-stores.ts
const SESSION_STORE_READ_SLICE_MS = 8;
function summarizeProjectionRows(projection, storePath, agentIds, recentLimit) {
	const rows = projection.selectEntries({
		storePath,
		sortBy: null
	});
	if (recentLimit !== 0) rows.sort((left, right) => (right.entry.updatedAt ?? 0) - (left.entry.updatedAt ?? 0) || (left.key < right.key ? -1 : left.key > right.key ? 1 : 0));
	const summarize = (selected) => ({
		count: selected.length,
		recent: selected.slice(0, recentLimit).map(({ key: sessionKey, entry }) => ({
			sessionKey,
			entry
		}))
	});
	if (recentLimit >= 0) {
		const byAgent = new Map(agentIds.map((agentId) => [agentId, {
			count: 0,
			recent: []
		}]));
		rows.forEach((row) => {
			const agent = byAgent.get(row.agentId);
			if (agent) {
				agent.count += 1;
				if (agent.count <= recentLimit) agent.recent.push({
					sessionKey: row.key,
					entry: row.entry
				});
			}
		});
		return {
			count: rows.length,
			recent: recentLimit === 0 ? [] : summarize(rows).recent,
			byAgent
		};
	}
	return {
		...summarize(rows),
		byAgent: new Map(agentIds.map((agentId) => [agentId, summarize(rows.filter((row) => row.agentId === agentId))]))
	};
}
/** One collection owns each physical store's bounded snapshot, including its agent windows. */
function createStatusSessionStoreReader(agentIds, recentLimit, options = {}) {
	const env = captureSessionTranscriptStorageEnvironment(process.env);
	const stores = /* @__PURE__ */ new Map();
	let sliceStartedAt = performance.now();
	return {
		stores,
		read(storePath, agentId) {
			return withSessionStoreReaderInWorker({
				storePath,
				agentId,
				env
			}, async ({ reader, database, selectedStore, continuation, assertCurrent }) => {
				const path = selectedStore.path;
				if (agentId && readAgentDatabaseAdmissionRefusal(agentId, { env })) return {
					path,
					count: 0,
					recent: []
				};
				let store = stores.get(database.path);
				if (!store) {
					let summary;
					try {
						const projection = options.projection;
						if (projection) do {
							await projection.ensureMaterialized();
							assertCurrent();
						} while (projection.needsMaterialization);
						summary = projection ? summarizeProjectionRows(projection, database.path, agentIds, recentLimit) : await reader.readStoreSummary({
							env: database.env,
							agentIds,
							recentLimit,
							continuation
						});
					} catch (error) {
						if (!options.recoverReadError) throw error;
						summary = options.recoverReadError(error);
					}
					if (options.projection && performance.now() - sliceStartedAt >= SESSION_STORE_READ_SLICE_MS) {
						await setImmediate();
						sliceStartedAt = performance.now();
					}
					assertCurrent();
					if (agentId && readAgentDatabaseAdmissionRefusal(agentId, { env })) return {
						path,
						count: 0,
						recent: []
					};
					store = {
						...summary,
						path
					};
					stores.set(database.path, store);
				}
				const summary = agentId ? store.byAgent.get(agentId) : store;
				return {
					path,
					count: summary?.count ?? 0,
					recent: summary?.recent ?? []
				};
			}, {
				backing: !options.projection,
				dataOnly: true,
				logical: {}
			});
		}
	};
}
/** Reads each physical store once, retaining retired agent namespaces in the aggregate. */
async function readStatusSessionStores(cfg, agents, recentLimit, projection) {
	const reader = createStatusSessionStoreReader(agents.map((agent) => agent.id), recentLimit, { projection });
	const byAgent = [];
	for (const agent of agents) byAgent.push({
		agent,
		...await reader.read(resolveSessionStorePathCore(cfg.session?.store, { agentId: agent.id }), agent.id)
	});
	return {
		paths: [...reader.stores.values()].map((store) => store.path),
		count: [...reader.stores.values()].reduce((count, store) => count + store.count, 0),
		recent: [...reader.stores.values()].flatMap((store) => store.recent),
		byAgent
	};
}
//#endregion
export { readStatusSessionStores as n, createStatusSessionStoreReader as t };
