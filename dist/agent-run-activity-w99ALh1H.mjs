import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { F as getAgentRunRegistryState } from "./agent-run-registry-gmaPgO-n.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
//#region src/infra/agent-run-activity.ts
/** Observe execution ownership, including queued turns, without reading storage. */
function observeAgentRunActivity(agentId, listener) {
	const target = normalizeAgentId(agentId);
	let previous;
	const publish = () => {
		const state = getAgentRunRegistryState();
		let busy = false;
		for (const [runId, context] of state.contexts) {
			const owner = context.agentId ?? (context.sessionKey && parseAgentSessionKey(context.sessionKey)?.agentId);
			if (context.lifecycleGeneration !== state.lifecycleGeneration || !owner || normalizeAgentId(owner) !== target) continue;
			const owners = state.owners.get(runId);
			if (owners?.lifecycleGeneration === state.lifecycleGeneration && owners.claimIds.size > 0 || (state.queuedRunContextLeases?.get(context) ?? 0) > 0) {
				busy = true;
				break;
			}
		}
		if (busy !== previous) {
			previous = busy;
			listener(busy);
		}
	};
	const unsubscribe = sessionChanges.subscribe((change) => {
		if ("all" in change && change.scope === "agent-runs" || !("all" in change) && change.scope === "runtime") publish();
	});
	publish();
	return unsubscribe;
}
//#endregion
export { observeAgentRunActivity as t };
