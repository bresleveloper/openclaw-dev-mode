import "./user-profile-constants-DfyZS95p.mjs";
//#region src/infra/active-node-context.ts
let activeNodeContexts = /* @__PURE__ */ new Map();
function personProfileId(profileId) {
	return profileId === "gateway-owner" ? void 0 : profileId;
}
function getActiveNodeIdentityScope(profileId) {
	return personProfileId(profileId) ? "requester" : "unknown";
}
/** Replaces the Gateway's prepared choices; no profile can inherit another person's node. */
function setActiveNodeContexts(next) {
	activeNodeContexts = new Map(next.map((entry) => [personProfileId(entry.profileId), { ...entry }]));
}
/** Refresh the keyed pairing fact at the existing asynchronous prompt preparation boundary. */
async function prepareActiveNodeContext(profileId) {
	const key = personProfileId(profileId);
	const captured = activeNodeContexts.get(key);
	try {
		await captured?.prepare?.();
	} catch {
		if (activeNodeContexts.get(key) === captured) activeNodeContexts.delete(key);
	}
}
/** Revalidates the published node before projecting it into an agent prompt. */
function getCurrentActiveNodeContext(profileId) {
	const activeNodeContext = activeNodeContexts.get(personProfileId(profileId));
	if (!activeNodeContext) return null;
	try {
		if (activeNodeContext.isCurrent && !activeNodeContext.isCurrent()) return null;
	} catch {
		return null;
	}
	return {
		nodeId: activeNodeContext.nodeId,
		...activeNodeContext.pairingGeneration ? { pairingGeneration: activeNodeContext.pairingGeneration } : {}
	};
}
/** Bounds the authenticated id; explicit unknown clears stale hints without injecting labels. */
function formatActiveNodeContextLabel(context) {
	const nodeId = context?.nodeId;
	return nodeId && /^[a-zA-Z0-9._:-]{1,128}$/.test(nodeId) ? nodeId : "unknown";
}
/** Stable turn context; explicit unknown supersedes a warm runtime's earlier device hint. */
function buildActiveNodeContextText(profileId) {
	return `Current active computer (latest reported app/system input, not message origin): active_node=${formatActiveNodeContextLabel(getCurrentActiveNodeContext(profileId))} active_node_identity=${getActiveNodeIdentityScope(profileId)}`;
}
//#endregion
export { prepareActiveNodeContext as a, getCurrentActiveNodeContext as i, formatActiveNodeContextLabel as n, setActiveNodeContexts as o, getActiveNodeIdentityScope as r, buildActiveNodeContextText as t };
