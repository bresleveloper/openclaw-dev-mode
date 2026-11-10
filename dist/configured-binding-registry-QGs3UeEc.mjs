import { _ as resolvePrimaryStringValue, c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as getPluginRegistryForContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { r as getLoadedChannelPluginEntryById } from "./registry-loaded-B-WQB-l0.mjs";
import { f as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as parseModelRef } from "./model-selection-normalize-DulZGI4S.mjs";
import { n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-BKqBSSHy.mjs";
import { r as listConfiguredBindings } from "./bindings-Cw_QSeBA.mjs";
import { a as pickFirstExistingAgentId } from "./resolve-route-DvaXhzgP.mjs";
import { i as parseConfiguredAcpSessionKey, n as normalizeBindingConfig, o as toConfiguredAcpBindingRecord, r as normalizeMode } from "./persistent-bindings.types-Deh63P2t.mjs";
//#region src/channels/plugins/configured-binding-compiler.ts
function resolveCompiledBindingRegistry(cfg) {
	const rulesByChannel = /* @__PURE__ */ new Map();
	for (const binding of listConfiguredBindings(cfg)) {
		if (binding.type !== "acp") continue;
		const bindingConversationId = normalizeOptionalString(binding.match?.peer?.id);
		if (!bindingConversationId) continue;
		const channel = normalizeOptionalLowercaseString(binding.match.channel);
		if (!channel) continue;
		const plugin = getLoadedChannelPluginEntryById(channel, getPluginRegistryForContext() ?? void 0)?.plugin;
		const provider = plugin?.bindings;
		if (!plugin || !provider?.compileConfiguredBinding || !provider.matchInboundConversation) continue;
		const channelId = plugin.id;
		const target = provider.compileConfiguredBinding({
			binding,
			conversationId: bindingConversationId
		});
		if (!target) continue;
		const agentId = pickFirstExistingAgentId(cfg, binding.agentId ?? "main");
		const agent = resolveAgentConfig(cfg, agentId);
		const runtimeDefaults = agent?.runtime?.type === "acp" ? agent.runtime.acp : void 0;
		const acpAgentId = normalizeOptionalString(runtimeDefaults?.agent);
		const bindingOverrides = normalizeBindingConfig(binding.acp);
		const mode = normalizeMode(bindingOverrides.mode ?? normalizeOptionalString(runtimeDefaults?.mode));
		const model = resolvePrimaryStringValue(agent?.model);
		const modelRef = model ? parseModelRef(model, "") : null;
		const thinking = agent?.thinkingDefault ?? (modelRef ? resolveConfiguredThinkingDefaultCore({
			cfg,
			...modelRef
		}) : cfg.agents?.defaults?.thinkingDefault);
		const cwd = bindingOverrides.cwd ?? normalizeOptionalString(runtimeDefaults?.cwd) ?? (normalizeOptionalString(agent?.workspace) || normalizeOptionalString(cfg.agents?.defaults?.workspace) ? resolveAgentWorkspaceDir(cfg, agentId) : void 0);
		const backend = bindingOverrides.backend ?? normalizeOptionalString(runtimeDefaults?.backend);
		const rule = {
			channel: channelId,
			accountPattern: normalizeOptionalString(binding.match.accountId),
			binding,
			bindingConversationId,
			target,
			agentId,
			provider,
			targetFactory: {
				driverId: "acp",
				materialize: ({ accountId, conversation }) => {
					const record = toConfiguredAcpBindingRecord({
						channel: channelId,
						accountId,
						conversationId: conversation.conversationId,
						parentConversationId: conversation.parentConversationId,
						agentId,
						acpAgentId,
						mode,
						model,
						thinking,
						cwd,
						backend,
						label: bindingOverrides.label
					});
					return {
						record,
						statefulTarget: {
							kind: "stateful",
							driverId: "acp",
							sessionKey: record.targetSessionKey,
							agentId,
							...bindingOverrides.label ? { label: bindingOverrides.label } : {}
						}
					};
				}
			}
		};
		const rules = rulesByChannel.get(rule.channel) ?? [];
		rules.push(rule);
		rulesByChannel.set(rule.channel, rules);
	}
	return rulesByChannel;
}
//#endregion
//#region src/channels/plugins/configured-binding-registry.ts
function resolveAccountMatchPriority(match, actual) {
	if (!match) return actual === "default" ? 2 : 0;
	if (match === "*") return 1;
	return normalizeAccountId(match) === actual ? 2 : 0;
}
/** Compile plugin binding rules before publishing a config or plugin generation. */
function validateConfiguredBindings(cfg) {
	resolveCompiledBindingRegistry(cfg);
}
/**
* Resolves a configured binding record from explicit channel/account/conversation ids.
*/
function resolveConfiguredBindingRecord(params) {
	const resolved = resolveConfiguredBinding({
		cfg: params.cfg,
		conversation: params
	});
	return resolved ? {
		record: resolved.record,
		statefulTarget: resolved.statefulTarget
	} : null;
}
/**
* Resolves the full configured binding match, including compiled rule and match diagnostics.
*/
function resolveConfiguredBinding(params) {
	const channel = normalizeOptionalLowercaseString(params.conversation.channel);
	const conversationId = params.conversation.conversationId.trim();
	if (!channel || !conversationId) return null;
	const conversation = {
		channel,
		accountId: normalizeAccountId(params.conversation.accountId),
		conversationId,
		parentConversationId: normalizeOptionalString(params.conversation.parentConversationId)
	};
	const rules = resolveCompiledBindingRegistry(params.cfg).get(channel);
	let bestMatch = null;
	let bestAccountPriority = 0;
	let bestMatchPriority = 0;
	for (const rule of rules ?? []) {
		const accountMatchPriority = resolveAccountMatchPriority(rule.accountPattern, conversation.accountId);
		if (accountMatchPriority === 0) continue;
		const match = rule.provider.matchInboundConversation({
			binding: rule.binding,
			compiledBinding: rule.target,
			conversationId,
			parentConversationId: conversation.parentConversationId
		});
		if (!match) continue;
		const matchPriority = match.matchPriority ?? 0;
		if (!bestMatch || accountMatchPriority > bestAccountPriority || accountMatchPriority === bestAccountPriority && matchPriority > bestMatchPriority) {
			bestMatch = {
				rule,
				match
			};
			bestAccountPriority = accountMatchPriority;
			bestMatchPriority = matchPriority;
		}
	}
	if (!bestMatch) return null;
	return {
		conversation,
		compiledBinding: bestMatch.rule,
		match: bestMatch.match,
		...bestMatch.rule.targetFactory.materialize({
			accountId: conversation.accountId,
			conversation: bestMatch.match
		})
	};
}
/**
* Resolves a configured binding record by the stateful target session key.
*/
function resolveConfiguredBindingRecordBySessionKey(params) {
	const registry = resolveCompiledBindingRegistry(params.cfg);
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const parsed = parseConfiguredAcpSessionKey(sessionKey);
	if (!parsed) return null;
	const rules = registry.get(parsed.channel);
	if (!rules) return null;
	let wildcardMatch = null;
	for (const rule of rules) {
		const accountMatchPriority = resolveAccountMatchPriority(rule.accountPattern, parsed.accountId);
		if (accountMatchPriority === 0) continue;
		const materializedTarget = rule.targetFactory.materialize({
			accountId: parsed.accountId,
			conversation: rule.target
		});
		if (materializedTarget.record.targetSessionKey === sessionKey) {
			if (accountMatchPriority === 2) return materializedTarget;
			wildcardMatch = materializedTarget;
		}
	}
	return wildcardMatch;
}
//#endregion
export { validateConfiguredBindings as i, resolveConfiguredBindingRecord as n, resolveConfiguredBindingRecordBySessionKey as r, resolveConfiguredBinding as t };
