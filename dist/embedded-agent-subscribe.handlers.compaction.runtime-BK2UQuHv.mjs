import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { l as updateSessionEntry } from "./session-accessor.reset-b9w8ccQ2.mjs";
//#region src/agents/embedded-agent-subscribe.handlers.compaction.runtime.ts
/**
* Runtime helpers for reconciling compaction counts after subscribe events.
*/
/** Persist the highest observed compaction count after a successful subscribed run. */
async function reconcileSessionStoreCompactionCountAfterSuccess(params) {
	const { sessionKey, agentId, configStore, observedCompactionCount, now = Date.now() } = params;
	if (!sessionKey || observedCompactionCount <= 0) return;
	const storePath = resolveSessionStorePathCore(configStore, { agentId });
	return (await updateSessionEntry({
		sessionKey,
		storePath
	}, async (entry) => {
		const currentCount = Math.max(0, entry.compactionCount ?? 0);
		const nextCount = Math.max(currentCount, observedCompactionCount);
		if (nextCount === currentCount) return null;
		return {
			compactionCount: nextCount,
			updatedAt: Math.max(entry.updatedAt ?? 0, now)
		};
	}))?.compactionCount;
}
//#endregion
export { reconcileSessionStoreCompactionCountAfterSuccess as default };
