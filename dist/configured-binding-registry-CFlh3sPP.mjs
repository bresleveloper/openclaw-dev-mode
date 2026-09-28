import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { l as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { c as resolveAgentExplicitModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { n as parseModelRef } from "./model-selection-normalize-Dij_chYC.mjs";
import { n as getLoadedChannelPluginEntryById } from "./registry-loaded-CYq2sa_C.mjs";
import { n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-BQDdsH3k.mjs";
import { r as listConfiguredBindings } from "./bindings-CI-O7TMQ.mjs";
import { a as pickFirstExistingAgentId } from "./resolve-route-zfKT6ZcU.mjs";
import { i as parseConfiguredAcpSessionKey, n as normalizeBindingConfig, o as toConfiguredAcpBindingRecord, r as normalizeMode, t as buildConfiguredAcpSessionKey } from "./persistent-bindings.types-C5MKo8rH.mjs";
//#region src/channels/plugins/acp-configured-binding-consumer.ts
/**
* ACP configured binding consumer.
*
* Converts channel configured-binding rules into persistent ACP binding records.
*/
function resolveAgentRuntimeAcpDefaults(params) {
	const ownerAgentId = normalizeLowercaseStringOrEmpty(params.ownerAgentId);
	const agent = resolveAgentConfig(params.cfg, ownerAgentId);
	if (!agent || agent.runtime?.type !== "acp") return {};
	return {
		acpAgentId: normalizeOptionalString(agent.runtime.acp?.agent),
		mode: normalizeOptionalString(agent.runtime.acp?.mode),
		cwd: normalizeOptionalString(agent.runtime.acp?.cwd),
		backend: normalizeOptionalString(agent.runtime.acp?.backend)
	};
}
function resolveConfiguredBindingWorkspaceCwd(params) {
	if (normalizeOptionalString(resolveAgentConfig(params.cfg, params.agentId)?.workspace)) return resolveAgentWorkspaceDir(params.cfg, params.agentId);
	if (normalizeOptionalString(params.cfg.agents?.defaults?.workspace)) return resolveAgentWorkspaceDir(params.cfg, params.agentId);
}
function buildAcpTargetFactory(params) {
	if (params.binding.type !== "acp") return null;
	const runtimeDefaults = resolveAgentRuntimeAcpDefaults({
		cfg: params.cfg,
		ownerAgentId: params.agentId
	});
	const bindingOverrides = normalizeBindingConfig(params.binding.acp);
	const mode = normalizeMode(bindingOverrides.mode ?? runtimeDefaults.mode);
	const model = resolveAgentExplicitModelPrimary(params.cfg, params.agentId);
	const modelRef = model ? parseModelRef(model, "") : null;
	const thinking = resolveAgentConfig(params.cfg, params.agentId)?.thinkingDefault ?? (modelRef ? resolveConfiguredThinkingDefaultCore({
		cfg: params.cfg,
		...modelRef
	}) : params.cfg.agents?.defaults?.thinkingDefault);
	const cwd = bindingOverrides.cwd ?? runtimeDefaults.cwd ?? resolveConfiguredBindingWorkspaceCwd({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const backend = bindingOverrides.backend ?? runtimeDefaults.backend;
	const label = bindingOverrides.label;
	const acpAgentId = normalizeOptionalString(runtimeDefaults.acpAgentId);
	return {
		driverId: "acp",
		materialize: ({ accountId, conversation }) => {
			const spec = {
				channel: params.channel,
				accountId,
				conversationId: conversation.conversationId,
				parentConversationId: conversation.parentConversationId,
				agentId: params.agentId,
				acpAgentId,
				mode,
				model,
				thinking,
				cwd,
				backend,
				label
			};
			return {
				record: toConfiguredAcpBindingRecord(spec),
				statefulTarget: {
					kind: "stateful",
					driverId: "acp",
					sessionKey: buildConfiguredAcpSessionKey(spec),
					agentId: params.agentId,
					...label ? { label } : {}
				}
			};
		}
	};
}
/**
* Configured binding consumer that materializes ACP persistent or oneshot targets.
*/
const acpConfiguredBindingConsumer = {
	id: "acp",
	supports: (binding) => binding.type === "acp",
	buildTargetFactory: (params) => buildAcpTargetFactory({
		cfg: params.cfg,
		binding: params.binding,
		channel: params.channel,
		agentId: params.agentId
	}),
	parseSessionKey: ({ sessionKey }) => parseConfiguredAcpSessionKey(sessionKey),
	matchesSessionKey: ({ sessionKey, materializedTarget }) => materializedTarget.record.targetSessionKey === sessionKey
};
//#endregion
//#region src/channels/plugins/configured-binding-consumers.ts
const registeredConfiguredBindingConsumers = resolveGlobalMap(Symbol.for("openclaw.configuredBindingConsumers"), "plugin-registry");
/**
* Lists registered configured binding consumers in registration order.
*/
function listConfiguredBindingConsumers() {
	return [...registeredConfiguredBindingConsumers.values()];
}
/**
* Finds the first configured binding consumer that supports a raw binding rule.
*/
function resolveConfiguredBindingConsumer(binding) {
	for (const consumer of listConfiguredBindingConsumers()) if (consumer.supports(binding)) return consumer;
	return null;
}
/**
* Registers a configured binding consumer idempotently by trimmed id.
*/
function registerConfiguredBindingConsumer(consumer) {
	const id = consumer.id.trim();
	if (!id) throw new Error("Configured binding consumer id is required");
	if (registeredConfiguredBindingConsumers.get(id)) return;
	registeredConfiguredBindingConsumers.set(id, {
		...consumer,
		id
	});
}
//#endregion
//#region src/channels/plugins/configured-binding-builtins.ts
/**
* Configured binding built-in registration.
*
* Registers core configured binding consumers exactly when the registry needs them.
*/
/**
* Registers configured binding consumers bundled with core.
*/
function ensureConfiguredBindingBuiltinsRegistered() {
	registerConfiguredBindingConsumer(acpConfiguredBindingConsumer);
}
//#endregion
//#region src/channels/plugins/binding-provider.ts
/**
* Returns the configured binding provider exposed by a channel plugin, when present.
*/
function resolveChannelConfiguredBindingProvider(plugin) {
	return plugin?.bindings;
}
//#endregion
//#region src/channels/plugins/configured-binding-compiler.ts
/**
* Configured binding compiler.
*
* Compiles config rules into channel/provider-specific binding registry entries.
*/
function resolveConfiguredBindingAdapter(channel) {
	const normalized = normalizeOptionalLowercaseString(channel);
	if (!normalized) return null;
	const plugin = getLoadedChannelPluginEntryById(normalized, getPluginRegistryForContext() ?? void 0)?.plugin;
	const provider = resolveChannelConfiguredBindingProvider(plugin);
	if (!plugin || !provider || !provider.compileConfiguredBinding || !provider.matchInboundConversation) return null;
	return {
		channel: plugin.id,
		provider
	};
}
function resolveCompiledBindingRegistry(cfg) {
	const rulesByChannel = /* @__PURE__ */ new Map();
	for (const binding of listConfiguredBindings(cfg)) {
		const consumer = resolveConfiguredBindingConsumer(binding);
		if (!consumer) continue;
		const bindingConversationId = normalizeOptionalString(binding.match?.peer?.id);
		if (!bindingConversationId) continue;
		const resolvedChannel = resolveConfiguredBindingAdapter(binding.match.channel);
		if (!resolvedChannel) continue;
		const target = resolvedChannel.provider.compileConfiguredBinding({
			binding,
			conversationId: bindingConversationId
		});
		if (!target) continue;
		const agentId = pickFirstExistingAgentId(cfg, binding.agentId ?? "main");
		const targetFactory = consumer.buildTargetFactory({
			cfg,
			binding,
			channel: resolvedChannel.channel,
			agentId,
			target,
			bindingConversationId
		});
		if (!targetFactory) continue;
		const rule = {
			channel: resolvedChannel.channel,
			accountPattern: normalizeOptionalString(binding.match.accountId),
			binding,
			bindingConversationId,
			target,
			agentId,
			provider: resolvedChannel.provider,
			targetFactory
		};
		const existing = rulesByChannel.get(rule.channel);
		if (existing) existing.push(rule);
		else rulesByChannel.set(rule.channel, [rule]);
	}
	return { rulesByChannel };
}
//#endregion
//#region src/channels/plugins/configured-binding-match.ts
/**
* Configured binding matching helpers.
*
* Matches compiled binding rules against inbound conversations and materializes targets.
*/
/**
* Ranks account pattern matches for configured binding rules.
*/
function resolveAccountMatchPriority(match, actual) {
	const trimmed = (match ?? "").trim();
	if (!trimmed) return actual === "default" ? 2 : 0;
	if (trimmed === "*") return 1;
	return normalizeAccountId(trimmed) === actual ? 2 : 0;
}
/**
* Normalizes a raw channel id into a configured-binding channel id.
*/
function resolveCompiledBindingChannel(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	return normalized ? normalized : null;
}
/**
* Converts an outbound conversation ref into configured-binding match input.
*/
function toConfiguredBindingConversationRef(conversation) {
	const channel = resolveCompiledBindingChannel(conversation.channel);
	const conversationId = conversation.conversationId.trim();
	if (!channel || !conversationId) return null;
	return {
		channel,
		accountId: normalizeAccountId(conversation.accountId),
		conversationId,
		parentConversationId: normalizeOptionalString(conversation.parentConversationId)
	};
}
/**
* Materializes a configured binding record from the winning rule and conversation.
*/
function materializeConfiguredBindingRecord(params) {
	return params.rule.targetFactory.materialize({
		accountId: normalizeAccountId(params.accountId),
		conversation: params.conversation
	});
}
/**
* Resolves the best configured binding rule for a conversation.
*/
function resolveMatchingConfiguredBinding(params) {
	if (!params.conversation) return null;
	let bestMatch = null;
	let bestAccountPriority = 0;
	let bestMatchPriority = 0;
	for (const rule of params.rules) {
		const accountMatchPriority = resolveAccountMatchPriority(rule.accountPattern, params.conversation.accountId);
		if (accountMatchPriority === 0) continue;
		const match = rule.provider.matchInboundConversation({
			binding: rule.binding,
			compiledBinding: rule.target,
			conversationId: params.conversation.conversationId,
			parentConversationId: params.conversation.parentConversationId
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
	return bestMatch;
}
//#endregion
//#region src/channels/plugins/configured-binding-session-lookup.ts
/**
* Resolves a configured binding record from a stateful target session key.
*/
function resolveConfiguredBindingRecordBySessionKeyFromRegistry(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	for (const consumer of listConfiguredBindingConsumers()) {
		const parsed = consumer.parseSessionKey?.({ sessionKey });
		if (!parsed) continue;
		const channel = resolveCompiledBindingChannel(parsed.channel);
		if (!channel) continue;
		const rules = params.registry.rulesByChannel.get(channel);
		if (!rules || rules.length === 0) continue;
		let wildcardMatch = null;
		for (const rule of rules) {
			if (rule.targetFactory.driverId !== consumer.id) continue;
			const accountMatchPriority = resolveAccountMatchPriority(rule.accountPattern, parsed.accountId);
			if (accountMatchPriority === 0) continue;
			const materializedTarget = materializeConfiguredBindingRecord({
				rule,
				accountId: parsed.accountId,
				conversation: rule.target
			});
			if (consumer.matchesSessionKey?.({
				sessionKey,
				compiledBinding: rule,
				accountId: parsed.accountId,
				materializedTarget
			}) ?? materializedTarget.record.targetSessionKey === sessionKey) {
				if (accountMatchPriority === 2) return materializedTarget;
				wildcardMatch = materializedTarget;
			}
		}
		if (wildcardMatch) return wildcardMatch;
	}
	return null;
}
//#endregion
//#region src/channels/plugins/configured-binding-registry.ts
function resolveMaterializedConfiguredBinding(params) {
	const conversation = toConfiguredBindingConversationRef(params.conversation);
	if (!conversation) return null;
	const rules = resolveCompiledBindingRegistry(params.cfg).rulesByChannel.get(conversation.channel);
	if (!rules || rules.length === 0) return null;
	const resolved = resolveMatchingConfiguredBinding({
		rules,
		conversation
	});
	if (!resolved) return null;
	return {
		conversation,
		resolved,
		materializedTarget: materializeConfiguredBindingRecord({
			rule: resolved.rule,
			accountId: conversation.accountId,
			conversation: resolved.match
		})
	};
}
/** Compile plugin binding rules before publishing a config or plugin generation. */
function validateConfiguredBindings(cfg) {
	ensureConfiguredBindingBuiltinsRegistered();
	resolveCompiledBindingRegistry(cfg);
}
/**
* Resolves a configured binding record from explicit channel/account/conversation ids.
*/
function resolveConfiguredBindingRecord(params) {
	ensureConfiguredBindingBuiltinsRegistered();
	return resolveMaterializedConfiguredBinding({
		cfg: params.cfg,
		conversation: {
			channel: params.channel,
			accountId: params.accountId,
			conversationId: params.conversationId,
			parentConversationId: params.parentConversationId
		}
	})?.materializedTarget ?? null;
}
/**
* Resolves the full configured binding match, including compiled rule and match diagnostics.
*/
function resolveConfiguredBinding(params) {
	ensureConfiguredBindingBuiltinsRegistered();
	const resolved = resolveMaterializedConfiguredBinding(params);
	if (!resolved) return null;
	return {
		conversation: resolved.conversation,
		compiledBinding: resolved.resolved.rule,
		match: resolved.resolved.match,
		...resolved.materializedTarget
	};
}
/**
* Resolves a configured binding record by the stateful target session key.
*/
function resolveConfiguredBindingRecordBySessionKey(params) {
	ensureConfiguredBindingBuiltinsRegistered();
	return resolveConfiguredBindingRecordBySessionKeyFromRegistry({
		registry: resolveCompiledBindingRegistry(params.cfg),
		sessionKey: params.sessionKey
	});
}
//#endregion
export { validateConfiguredBindings as i, resolveConfiguredBindingRecord as n, resolveConfiguredBindingRecordBySessionKey as r, resolveConfiguredBinding as t };
