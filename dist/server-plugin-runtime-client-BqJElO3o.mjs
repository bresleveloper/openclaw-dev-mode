import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { i as isKnownCoreToolId } from "./tool-catalog-DyHnjiiS.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-DWHChhWM.mjs";
import "./tool-policy-BKvvmcQR.mjs";
import { l as getActivePluginRegistry } from "./runtime-D4MkflNJ.mjs";
import "./operator-scopes-DsrPoRc4.mjs";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import "./version-CwNT1gaY.mjs";
import "./method-scopes-BrMPjfvW.mjs";
//#region src/gateway/in-process-subagent-resume.ts
const resumes = resolveGlobalSingleton(Symbol.for("openclaw.inProcessSubagentResumes"), () => /* @__PURE__ */ new WeakMap());
/** Associates host-owned resume authority without widening request, client, or SDK types. */
function bindInProcessSubagentResume(carrier, resume) {
	if (resume) resumes.set(carrier, resume);
	return carrier;
}
/** Reads only authority attached to this exact in-process carrier, never serialized fields. */
function readInProcessSubagentResume(carrier) {
	return carrier ? resumes.get(carrier) : void 0;
}
//#endregion
//#region src/gateway/server-plugin-runtime-client.ts
function createSyntheticPluginRuntimeClient(params) {
	const pluginRuntimeOwnerId = normalizeOptionalString(params?.pluginRuntimeOwnerId);
	return {
		...params?.authenticatedUserProfile ? { authenticatedUserProfile: params.authenticatedUserProfile } : {},
		connect: {
			minProtocol: 4,
			maxProtocol: 4,
			client: {
				id: GATEWAY_CLIENT_IDS.GATEWAY_CLIENT,
				version: "internal",
				platform: "node",
				mode: GATEWAY_CLIENT_MODES.BACKEND
			},
			role: "operator",
			scopes: params?.scopes ?? ["operator.write"]
		},
		internal: {
			syntheticClient: true,
			...params?.operatorRoleActor ? { operatorRoleActor: params.operatorRoleActor } : {},
			...params?.operatorRunAuthority ? { operatorRunAuthority: params.operatorRunAuthority } : {},
			...params?.operatorAccessAuthority !== void 0 ? { operatorAccessAuthority: params.operatorAccessAuthority } : {},
			...params?.sessionCreation ? { sessionCreation: params.sessionCreation } : {},
			...params?.agentToolCaller ? { agentToolCaller: params.agentToolCaller } : {},
			allowModelOverride: params?.allowModelOverride === true,
			...params?.agentRunTracking ? { agentRunTracking: params.agentRunTracking } : {},
			...params?.cronRunContinuation === true ? { cronRunContinuation: true } : {},
			...params?.runtimeContextFragments ? { runtimeContextFragments: params.runtimeContextFragments } : {},
			...params?.internalDeliveryMediaUrls ? { internalDeliveryMediaUrls: [...params.internalDeliveryMediaUrls] } : {},
			...params?.internalDeliverySuppressText === true ? { internalDeliverySuppressText: true } : {},
			...params?.internalDeliverySuppressErrors === true ? { internalDeliverySuppressErrors: true } : {},
			...params?.scopes?.includes("operator.approvals") ? { approvalRuntime: true } : {},
			...pluginRuntimeOwnerId ? { pluginRuntimeOwnerId } : {},
			...params?.nodeInvokeApprovalSessionKey ? { nodeInvokeApprovalSessionKey: params.nodeInvokeApprovalSessionKey } : {},
			...params?.pluginSubagentRequester ? { pluginSubagentRequester: params.pluginSubagentRequester } : {},
			...params?.runtimePluginToolGrant ? { runtimePluginToolGrant: params.runtimePluginToolGrant } : {},
			...params?.pluginSubagentToolsAllow ? { pluginSubagentToolsAllow: [...params.pluginSubagentToolsAllow] } : {},
			...params?.delegatedToolPolicyHandoffId ? { delegatedToolPolicyHandoffId: params.delegatedToolPolicyHandoffId } : {}
		}
	};
}
function projectPluginRuntimeClientExecution(params) {
	const identity = params.streamClient?.internal?.agentRuntimeIdentity ?? params.identity;
	return identity || params.nodeInvokeStream ? {
		...params.streamClient ?? params.client,
		...identity && !params.streamClient ? { connId: `agent-runtime:${identity.operationalRunInstance.instanceId}` } : {},
		...params.streamClient ? { connect: {
			...params.streamClient.connect,
			scopes: params.client.connect.scopes
		} } : {},
		internal: {
			...params.streamClient?.internal,
			...params.client.internal,
			...identity ? { agentRuntimeIdentity: identity } : {},
			...params.nodeInvokeStream ? { nodeInvokeStream: params.nodeInvokeStream } : {}
		}
	} : params.client;
}
function mergePluginRuntimeClientInternal(client, internal, scopes) {
	if (!client || !internal && !scopes) return client ?? null;
	return {
		...client,
		...scopes ? { connect: {
			...client.connect,
			scopes
		} } : {},
		get preparedSessionProfile() {
			return client.preparedSessionProfile;
		},
		set preparedSessionProfile(profile) {
			client.preparedSessionProfile = profile;
		},
		get preparedRecipientProfileId() {
			return client.preparedRecipientProfileId;
		},
		set preparedRecipientProfileId(profileId) {
			client.preparedRecipientProfileId = profileId;
		},
		internal: bindInProcessSubagentResume({
			...client.internal,
			...internal
		}, readInProcessSubagentResume(client.internal))
	};
}
function resolvePluginSubagentToolsAlsoAllow(params) {
	const requested = uniqueStrings((params.toolsAlsoAllow ?? []).map((entry) => normalizeToolPolicyName(entry.trim())).filter(Boolean));
	if (requested.length === 0) return;
	const pluginId = params.pluginId?.trim();
	if (!pluginId) throw new Error("toolsAlsoAllow requires plugin identity for subagent runs.");
	const registry = getActivePluginRegistry();
	for (const toolName of requested) {
		if (isKnownCoreToolId(toolName)) throw new Error(`plugin "${pluginId}" may not add core tool "${toolName}" to subagent runs.`);
		const owners = uniqueStrings((registry?.tools ?? []).filter((registration) => [...registration.names, ...registration.declaredNames ?? []].some((registeredName) => normalizeToolPolicyName(registeredName) === toolName)).map((registration) => registration.pluginId));
		if (owners.length !== 1 || owners[0] !== pluginId) throw new Error(`plugin "${pluginId}" does not uniquely own subagent tool "${toolName}".`);
	}
	return {
		pluginId,
		toolNames: requested
	};
}
//#endregion
export { bindInProcessSubagentResume as a, resolvePluginSubagentToolsAlsoAllow as i, mergePluginRuntimeClientInternal as n, readInProcessSubagentResume as o, projectPluginRuntimeClientExecution as r, createSyntheticPluginRuntimeClient as t };
