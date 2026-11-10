import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import "./io-DIF-KW3P.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { t as resolveDefaultModel } from "./directive-handling.defaults-CkLQjsGm.mjs";
import { t as createModelSelectionState } from "./model-selection-_LS5TGCV.mjs";
import { n as buildStatusReply } from "./commands-status-BWlN8kVJ.mjs";
import { t as resolveCurrentDirectiveLevels } from "./directive-handling.levels-BvVtV7dG.mjs";
//#region src/plugin-sdk/command-status.runtime.ts
/**
* Builds a direct `/status` reply for an arbitrary session key.
* Unauthorized requesters may see the session exists, but configured reasoning
* state is masked so private agent/session defaults are not leaked.
*/
async function resolveDirectStatusReplyForSessionCore(params) {
	const requestedSessionKey = params.sessionKey.trim();
	if (!requestedSessionKey) return;
	const statusLoaded = await loadGatewaySessionEntryReadOnlyInWorker({
		cfg: readRuntimeConfig(),
		key: requestedSessionKey
	});
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
	const selectionEntry = statusEntry ? structuredClone(statusEntry) : void 0;
	const selectionStore = { ...statusLoaded.store };
	if (selectionEntry) selectionStore[statusSessionKey] = selectionEntry;
	const modelState = await createModelSelectionState({
		cfg: statusCfg,
		agentId: statusAgentId,
		agentCfg,
		sessionEntry: selectionEntry,
		sessionStore: selectionStore,
		sessionKey: statusSessionKey,
		parentSessionKey: statusEntry?.parentSessionKey,
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
