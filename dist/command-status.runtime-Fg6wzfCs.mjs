import { E as listAgentEntries } from "./agent-scope-config-IQKOEtZ4.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DqGvpsY3.mjs";
import "./session-utils-AxixtEyo.mjs";
import { t as resolveDefaultModel } from "./directive-handling.defaults-BUi2cHPW.mjs";
import { t as createModelSelectionState } from "./model-selection-B45E2CFW.mjs";
import { n as buildStatusReply } from "./commands-status-D1yEXpDN.mjs";
import { t as resolveCurrentDirectiveLevels } from "./directive-handling.levels-CU2BdYG3.mjs";
//#region src/plugin-sdk/command-status.runtime.ts
/**
* Builds a direct `/status` reply for an arbitrary session key.
* Unauthorized requesters may see the session exists, but configured reasoning
* state is masked so private agent/session defaults are not leaked.
*/
async function resolveDirectStatusReplyForSessionCore(params) {
	const requestedSessionKey = params.sessionKey.trim();
	if (!requestedSessionKey) return;
	const statusLoaded = loadGatewaySessionEntryReadOnly(requestedSessionKey);
	const statusCfg = statusLoaded.cfg ?? params.cfg;
	const statusSessionKey = statusLoaded.canonicalKey;
	const statusEntry = statusLoaded.entry;
	const statusAgentId = resolveSessionAgentId({
		sessionKey: statusSessionKey,
		config: statusCfg
	});
	const agentCfg = statusCfg.agents?.defaults;
	const agentEntry = listAgentEntries(statusCfg).find((entry) => entry.id?.trim().toLowerCase() === statusAgentId);
	const statusModel = resolveDefaultModelForAgent({
		cfg: statusCfg,
		agentId: statusAgentId
	});
	const { defaultProvider, defaultModel } = resolveDefaultModel({
		cfg: statusCfg,
		agentId: statusAgentId
	});
	const selectedProvider = statusEntry?.providerOverride?.trim() || statusEntry?.modelProvider?.trim() || statusModel.provider;
	const selectedModel = statusEntry?.modelOverride?.trim() || statusEntry?.model?.trim() || statusModel.model;
	const modelState = await createModelSelectionState({
		cfg: statusCfg,
		agentId: statusAgentId,
		agentCfg,
		sessionEntry: statusEntry,
		sessionStore: statusLoaded.store,
		sessionKey: statusSessionKey,
		parentSessionKey: statusEntry?.parentSessionKey,
		storePath: statusLoaded.storePath,
		defaultProvider,
		defaultModel,
		provider: selectedProvider,
		model: selectedModel,
		hasModelDirective: false
	});
	const { currentThinkLevel, currentFastMode, currentVerboseLevel, currentReasoningLevel, currentElevatedLevel } = await resolveCurrentDirectiveLevels({
		sessionEntry: statusEntry,
		agentEntry,
		agentCfg,
		resolveDefaultThinkingLevel: () => modelState.resolveDefaultThinkingLevel()
	});
	const thinkingCatalog = await modelState.resolveThinkingCatalog();
	let resolvedReasoningLevel = currentReasoningLevel;
	const hasAgentReasoningDefault = agentEntry?.reasoningDefault !== void 0 && agentEntry.reasoningDefault !== null || agentCfg?.reasoningDefault !== void 0 && agentCfg.reasoningDefault !== null;
	const sessionReasoningExplicitlySet = statusEntry?.reasoningLevel !== void 0 && statusEntry.reasoningLevel !== null;
	if (!(params.senderIsOwner || params.isAuthorizedSender) && (sessionReasoningExplicitlySet || hasAgentReasoningDefault)) resolvedReasoningLevel = "off";
	if (!(sessionReasoningExplicitlySet || hasAgentReasoningDefault) && resolvedReasoningLevel === "off" && currentThinkLevel === "off") resolvedReasoningLevel = await modelState.resolveDefaultReasoningLevel();
	const command = {
		surface: params.channel,
		channel: params.channel,
		ownerList: [],
		senderIsOwner: params.senderIsOwner,
		isAuthorizedSender: params.isAuthorizedSender,
		senderId: params.senderId,
		rawBodyNormalized: "/status",
		commandBodyNormalized: "/status"
	};
	return await buildStatusReply({
		cfg: statusCfg,
		agentId: statusAgentId,
		command,
		sessionEntry: statusEntry,
		sessionKey: statusSessionKey,
		parentSessionKey: statusEntry?.parentSessionKey,
		sessionScope: statusCfg.session?.scope,
		storePath: statusLoaded.storePath,
		provider: selectedProvider,
		model: selectedModel,
		contextTokens: statusEntry?.contextTokens ?? 0,
		thinkingCatalog,
		resolvedThinkLevel: currentThinkLevel,
		resolvedFastMode: currentFastMode,
		resolvedVerboseLevel: currentVerboseLevel ?? "off",
		resolvedReasoningLevel,
		resolvedElevatedLevel: currentElevatedLevel,
		resolveDefaultThinkingLevel: () => modelState.resolveDefaultThinkingLevel(),
		isGroup: params.isGroup,
		defaultGroupActivation: params.defaultGroupActivation
	});
}
//#endregion
export { resolveDirectStatusReplyForSessionCore };
