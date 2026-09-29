import { i as resolveNodeIdFromList, t as listNodes } from "./nodes-utils-CWXEO3Tj.mjs";
//#region src/agents/node-exec-availability.ts
/** Prepares current node facts for tool discovery without caching connection state. */
async function loadNodeExecAvailability(signal) {
	const nodes = await listNodes({}, signal).catch(() => {
		signal?.throwIfAborted();
		return [];
	});
	signal?.throwIfAborted();
	return {
		cacheKey: JSON.stringify(nodes.toSorted((a, b) => a.nodeId.localeCompare(b.nodeId)).map(({ nodeId, displayName, remoteIp, clientId, connected, commands }) => [
			nodeId,
			displayName,
			remoteIp,
			clientId,
			connected === true,
			commands?.includes("system.run") === true
		])),
		isAvailable: (node) => {
			try {
				const nodeId = node?.trim() ? resolveNodeIdFromList(nodes, node) : void 0;
				return nodes.some((entry) => (!nodeId || entry.nodeId === nodeId) && entry.connected === true && entry.commands?.includes("system.run") === true);
			} catch {
				return false;
			}
		}
	};
}
//#endregion
export { loadNodeExecAvailability as t };
