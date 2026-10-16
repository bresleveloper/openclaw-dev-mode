//#region src/gateway/session-creation-provenance.ts
function resolveOperatorSessionCreation(client, options = {}) {
	if (options.allowTrustedHint && client?.internal?.sessionCreation) return client.internal.sessionCreation;
	const agentRuntimeIdentity = client?.internal?.agentRuntimeIdentity;
	if (options.allowTrustedHint && agentRuntimeIdentity?.sessionSpawnContext) {
		const { requesterProfileId, completionOwnerSessionKey, requesterSenderIsOwner, inheritedToolPolicy, inheritedPermissionMode, resolvedModel, spawnModelAutoSelection } = agentRuntimeIdentity.sessionSpawnContext;
		return {
			via: "spawn",
			actor: {
				type: "agent",
				id: agentRuntimeIdentity.agentId
			},
			requesterSessionKey: agentRuntimeIdentity.sessionKey,
			...requesterProfileId ? { requesterProfileId } : {},
			...completionOwnerSessionKey ? { completionOwnerSessionKey } : {},
			requesterSenderIsOwner,
			inheritedToolPolicy,
			...inheritedPermissionMode ? { inheritedPermissionMode } : {},
			...resolvedModel ? { resolvedModel } : {},
			...spawnModelAutoSelection ? { spawnModelAutoSelection } : {}
		};
	}
	const profileId = client?.authenticatedUserProfile?.profileId;
	return {
		via: "operator",
		...profileId ? { actor: {
			type: "human",
			source: "profile",
			id: profileId
		} } : {}
	};
}
function resolveAgentRunSessionCreation(client) {
	const actor = resolveOperatorSessionCreation(client).actor;
	return {
		via: "run",
		...actor ? { actor } : {}
	};
}
//#endregion
export { resolveOperatorSessionCreation as n, resolveAgentRunSessionCreation as t };
