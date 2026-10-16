import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CfLPTM0e.mjs";
import { d as hasGatewayAdminScope } from "./operator-scopes-DsrPoRc4.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Dk4uhhe-.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BbWs7GzU.mjs";
import { n as isConversationToolAllowed } from "./conversation-tool-policy-pipeline-PqUansOZ.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { o as resolveChatSendCallerContext } from "./gateway-client-identity-DnDs09-7.mjs";
import { t as resolveSessionSelectedModelRef } from "./session-utils-model-selection-Bxzwl80r.mjs";
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
