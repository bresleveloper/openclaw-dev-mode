import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { d as hasGatewayAdminScope } from "./operator-scopes-BO7_XQCg.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { o as resolveChatSendCallerContext } from "./gateway-client-identity-DXWhtQve.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { t as resolveSessionSelectedModelRef } from "./session-utils-model-selection-pzj_r9Dj.mjs";
import { r as resolveSandboxRuntimeStatus } from "./runtime-status-DWm-5zUj.mjs";
import { r as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { n as isConversationToolAllowed } from "./conversation-tool-policy-pipeline-DNbcwb7L.mjs";
//#region src/gateway/session-resource-tool-policy.ts
function denied(message = "The session's current tool policy does not allow this operation.") {
	throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.FORBIDDEN, message, { details: { code: "SESSION_RESOURCE_TOOL_POLICY" } }));
}
/** Evaluate canonical tool policy using facts already prepared by the session authority. */
function resolveSessionResourceToolPolicy(params) {
	const { config, current } = params;
	const entry = current.entry;
	params.assertNativeRuntimeCurrent?.();
	if (entry.modelSelectionLocked === true && !params.assertNativeRuntimeCurrent) denied("Session-scoped resources are unavailable for sessions with locked model selection. Administrator global access remains available.");
	const readEntry = (key) => {
		const parsed = parseAgentSessionKey(key);
		if (!parsed) return;
		const related = params.readPreparedSessionEntry({
			key,
			agentId: parsed.agentId,
			...parsed.agentId === current.agentId ? { storePath: current.storePath } : {}
		});
		if (!related) denied();
		return related;
	};
	const store = {
		authoritative: true,
		get: readEntry,
		getById: () => void 0
	};
	const metadata = getGatewayPluginMetadataSnapshot();
	const model = resolveSessionSelectedModelRef({
		cfg: config,
		sessionKey: current.canonicalKey,
		agentId: current.agentId,
		source: {
			entry,
			readSourceEntry: readEntry
		},
		manifestPlugins: metadata ?? []
	});
	const sandbox = resolveSandboxRuntimeStatus({
		cfg: config,
		sessionKey: current.canonicalKey,
		agentId: current.agentId,
		preparedSessionEntry: entry
	});
	const caller = resolveChatSendCallerContext(params.client);
	const origin = sessionDeliveryOrigin(entry);
	const capability = resolveConversationCapabilityProfile({
		config,
		agentId: current.agentId,
		sessionKey: current.canonicalKey,
		sessionId: entry.sessionId,
		preparedSessionEntry: {
			sessionKey: current.canonicalKey,
			entry
		},
		preparedSessionCapabilityStore: store,
		spawnedBy: entry.spawnedBy,
		modelProvider: model.provider,
		modelId: model.model,
		pluginMetadataSnapshot: metadata,
		messageProvider: caller.Provider,
		messageChannel: caller.Surface,
		senderId: caller.SenderId,
		senderName: caller.SenderName,
		senderUsername: caller.SenderUsername,
		senderIsOwner: hasGatewayAdminScope(params.client),
		agentAccountId: origin?.accountId,
		groupId: entry.groupId,
		groupChannel: entry.groupChannel,
		groupSpace: entry.space,
		sandboxToolPolicy: sandbox.sandboxed ? sandbox.toolPolicy : void 0
	});
	if (!isConversationToolAllowed(capability, params.toolName)) denied();
	return {
		sandboxRequired: sandbox.sandboxRequired,
		sandboxed: sandbox.sandboxed
	};
}
//#endregion
export { resolveSessionResourceToolPolicy as t };
