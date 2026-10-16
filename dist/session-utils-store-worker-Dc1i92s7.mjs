import { n as ok } from "./result-BQGgYouL.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { y as prepareSessionStoreTargetInventoryRead } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { r as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { l as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import { i as prepareGatewaySessionStoreTargetReadOnly, s as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-D3SOcr8y.mjs";
//#region src/gateway/session-utils-store-worker.ts
/** Acquire the ordered lookup's data while its discovery and physical readers remain current. */
async function resolveGatewaySessionStoreTargetInWorker(params) {
	params.assertActive?.();
	const { agentId, canonicalKey } = resolveSessionStoreIdentity({
		cfg: params.cfg,
		sessionKey: params.key,
		agentId: params.agentId
	});
	if (isIncognitoSessionKey(canonicalKey)) return resolveGatewaySessionStoreTargetWithStore({
		...params,
		agentId,
		readOnly: true,
		projection: "list",
		exactRead: true
	});
	const parsedAgent = parseAgentSessionKey(params.key)?.agentId;
	const { candidates, ...inventory } = prepareSessionStoreTargetInventory(params.cfg, [agentId, ...parsedAgent ? [parsedAgent] : []], params.env);
	const target = await prepareSessionStoreTargetInventoryRead({
		...inventory,
		candidates
	}).withRead(async (sources, assertCurrent) => {
		const targetDiscoveryCache = /* @__PURE__ */ new Map();
		for (const source of sources.agents) {
			if (!source.result.available && source.result.reason !== "database-missing") throw new Error(`Session stores for agent ${source.agentId} are unavailable`);
			targetDiscoveryCache.set(source.agentId, {
				existing: source.result.available ? source.result.targets : [],
				fallback: {
					agentId: source.agentId,
					storePath: inventory.paths.get(source.agentId).configured
				}
			});
		}
		const selected = await prepareGatewaySessionStoreTargetReadOnly({
			cfg: inventory.config,
			key: params.key,
			agentId,
			env: inventory.env,
			targetDiscoveryCache
		}, async (reads, select) => {
			assertCurrent();
			return await withSessionEntriesFromStoresInWorker(reads.map((read) => ({
				agentId: read.agentId ?? agentId,
				storePath: read.storePath,
				sessionKeys: read.options.exactKeys,
				projection: "list",
				env: inventory.env
			})), (loaded) => {
				assertCurrent();
				for (const [index, read] of reads.entries()) {
					const prepared = loaded[index];
					read.result = ok(Object.fromEntries(prepared.result.entries.map(({ sessionKey, entry }) => [sessionKey, entry])));
					read.readSource = {
						agentId: prepared.database.agentId,
						path: prepared.database.path
					};
				}
				return select();
			});
		});
		assertCurrent();
		return selected;
	}, params.assertActive);
	params.assertActive?.();
	return target;
}
//#endregion
export { resolveGatewaySessionStoreTargetInWorker as t };
