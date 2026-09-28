//#region src/infra/active-node-context.ts
let activeNodeContext = null;
function snapshotActiveNodeContext(context) {
	return {
		nodeId: context.nodeId,
		...context.pairingGeneration ? { pairingGeneration: context.pairingGeneration } : {}
	};
}
/** Publishes the gateway's current active-node choice without volatile timestamps. */
function setActiveNodeContext(next, options) {
	activeNodeContext = next ? {
		...next,
		...options
	} : null;
}
/** Refresh the keyed pairing fact at the existing asynchronous prompt preparation boundary. */
async function prepareActiveNodeContext() {
	const captured = activeNodeContext;
	try {
		await captured?.prepare?.();
	} catch {
		if (activeNodeContext === captured) activeNodeContext = null;
	}
}
/** Revalidates the published node before projecting it into an agent prompt. */
function getCurrentActiveNodeContext() {
	if (!activeNodeContext) return null;
	try {
		if (activeNodeContext.isCurrent && !activeNodeContext.isCurrent()) return null;
	} catch {
		return null;
	}
	return snapshotActiveNodeContext(activeNodeContext);
}
/** Bounds the authenticated id; explicit unknown clears stale hints without injecting labels. */
function formatActiveNodeContextLabel(context) {
	const nodeId = context?.nodeId;
	return nodeId && /^[a-zA-Z0-9._:-]{1,128}$/.test(nodeId) ? nodeId : "unknown";
}
/** Stable turn context; explicit unknown supersedes a warm runtime's earlier device hint. */
function buildActiveNodeContextText() {
	return `Current active computer (latest physical input, not message origin): active_node=${formatActiveNodeContextLabel(getCurrentActiveNodeContext())}`;
}
//#endregion
export { setActiveNodeContext as a, prepareActiveNodeContext as i, formatActiveNodeContextLabel as n, getCurrentActiveNodeContext as r, buildActiveNodeContextText as t };
