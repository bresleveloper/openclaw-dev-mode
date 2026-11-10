import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { r as requireSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { r as createSessionListEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
//#region src/gateway/server-plugin-in-process-session-read.ts
/**
* Holds `sessions.get` read authority for in-process plugin reads through later inference.
* Loaded lazily by the dispatch owner: session-row modules reach the subagent registry,
* which itself imports in-process dispatch.
*/
async function prepareInProcessSessionRead(resolved, key, assertCurrent) {
	const projection = requireSessionRowProjection(resolved.context);
	const requested = resolveRequestedSessionAgentId(resolved.context.getRuntimeConfig(), key);
	if (!requested.ok) throw new Error(requested.error.message);
	const query = {
		key,
		agentId: requested.agentId
	};
	return await withReadySessionRows(projection, () => [query], (read) => {
		assertCurrent();
		const selected = read.describe(query);
		if (!selected?.entry.sessionId) throw new Error(`Session "${key}" was not found.`);
		const assertReadCurrent = () => {
			assertCurrent();
			if (requireSessionRowProjection(resolved.context) !== projection) throw new Error("Session read authority changed before inference.");
			const current = projection.capture(query);
			const entry = current && projection.readCapabilityEntry({
				agentId: current.agentId,
				key: current.key,
				storePath: current.storeTarget.storePath
			})?.entry;
			const visible = createSessionListEntryFilter({
				cfg: projection.getPolicyConfig(),
				client: resolved.client
			});
			if (!current || !entry || !projection.isCurrent(selected) || entry.sessionId !== selected.entry.sessionId || current.storeTarget.storePath !== selected.storeTarget.storePath || visible?.(current.key, entry) === false) throw new Error(`Session "${key}" was not found.`);
		};
		assertReadCurrent();
		return assertReadCurrent;
	});
}
//#endregion
export { prepareInProcessSessionRead };
