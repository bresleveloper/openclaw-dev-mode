import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { _ as resolveDefaultAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { r as listAgentEntriesWithSource } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { r as resolveProviderToolPolicyEntry } from "./provider-tool-policy-CQtosRma.mjs";
import { s as isToolAllowedByPolicyName } from "./tool-policy-match--5jlhAPZ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { r as resolveSandboxConfigForAgent } from "./config-Bf089UPS.mjs";
import { r as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { t as resolveSkillWorkshopToolConstructionBlock } from "./tool-availability-BWNOfZ4J.mjs";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-jDkqpuYg.mjs";
//#region src/skills/workshop/tool-policy-diagnostic.ts
const SKILL_WORKSHOP_TOOL_NAME = "skill_workshop";
function findAgent(config, agentId) {
	const listed = listAgentEntriesWithSource(config).find(({ entry }) => normalizeAgentId(entry.id) === normalizeAgentId(agentId));
	if (!listed) return;
	return {
		path: listed.source.kind === "entries" ? `agents.entries.${listed.source.key}` : typeof listed.entry.id === "string" && listed.entry.id.length > 0 ? `agents.entries.${listed.entry.id}` : `agents.list[${listed.source.index}]`,
		entry: listed.entry
	};
}
function providerPolicyPath(params) {
	const entry = resolveProviderToolPolicyEntry({
		byProvider: params.tools?.byProvider,
		modelProvider: params.capabilityProfile.model.provider,
		modelId: params.capabilityProfile.model.id
	});
	return entry ? {
		path: `${params.basePath}.byProvider[${JSON.stringify(entry.key)}]`,
		profile: entry.policy.profile,
		ownsAlsoAllow: Array.isArray(entry.policy.alsoAllow)
	} : void 0;
}
function describeExclusion(params) {
	const label = params.event.step.label;
	const listed = findAgent(params.config, params.agentId);
	const agent = listed?.entry.tools ? {
		path: `${listed.path}.tools`,
		profile: listed.entry.tools.profile,
		ownsAlsoAllow: Array.isArray(listed.entry.tools.alsoAllow)
	} : void 0;
	const globalProvider = providerPolicyPath({
		tools: params.config.tools,
		basePath: "tools",
		capabilityProfile: params.capabilityProfile
	});
	const agentProvider = providerPolicyPath({
		tools: listed?.entry.tools,
		basePath: agent?.path ?? "agents.entries.*.tools",
		capabilityProfile: params.capabilityProfile
	});
	const providerProfile = label.startsWith("tools.byProvider.profile");
	if (providerProfile || label.startsWith("tools.profile")) {
		const scopes = providerProfile ? [agentProvider, globalProvider] : [agent, {
			path: "tools",
			profile: params.config.tools?.profile,
			ownsAlsoAllow: Array.isArray(params.config.tools?.alsoAllow)
		}];
		const policyPath = scopes[0]?.profile ? scopes[0].path : scopes[1]?.path;
		const source = policyPath ? `${policyPath}.profile` : "tools.byProvider.profile";
		const grantOwner = scopes.find((scope) => scope?.ownsAlsoAllow)?.path ?? policyPath;
		const profile = providerProfile ? params.capabilityProfile.policy.providerProfile : params.capabilityProfile.policy.profile;
		return {
			source,
			detail: `${source}: ${JSON.stringify(profile ?? "unknown")} does not include ${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)}.`,
			fix: policyPath ? `Add ${grantOwner}.alsoAllow: [${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)}].` : `Add ${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)} to the matching tools.byProvider alsoAllow list.`
		};
	}
	const normalizedLabel = label.startsWith(`agents.${params.agentId}.tools.byProvider`) ? label.replace(`agents.${params.agentId}.tools.byProvider`, agentProvider?.path ?? `${agent?.path ?? "agents.entries.*.tools"}.byProvider`) : label.startsWith("tools.byProvider") ? label.replace("tools.byProvider", globalProvider?.path ?? "tools.byProvider") : label.replace(`agents.${params.agentId}.tools`, agent?.path ?? "agents.entries.*.tools").replace("agent tools", agent?.path ?? "agents.entries.*.tools");
	return {
		source: normalizedLabel,
		detail: `${normalizedLabel} does not include ${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)}.`,
		fix: `Add ${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)} to ${normalizedLabel}.`
	};
}
function makeSkillWorkshopPolicyProbe() {
	return {
		name: SKILL_WORKSHOP_TOOL_NAME,
		label: SKILL_WORKSHOP_TOOL_NAME,
		description: "Skill Workshop policy availability check.",
		parameters: {
			type: "object",
			properties: {}
		},
		execute: async () => ({
			content: [],
			details: {}
		})
	};
}
/** Applies the real final tool-policy composition used by agent sessions and /learn. */
function resolveSkillWorkshopToolPolicyAvailability(params) {
	let exclusion;
	return {
		available: applyFinalEffectiveToolPolicy({
			bundledTools: [makeSkillWorkshopPolicyProbe()],
			config: params.config,
			conversationCapabilityProfile: params.conversationCapabilityProfile,
			warn: () => {},
			onFilter: (event) => {
				if (!exclusion && event.before.some((tool) => tool.name === SKILL_WORKSHOP_TOOL_NAME) && !event.after.some((tool) => tool.name === SKILL_WORKSHOP_TOOL_NAME)) exclusion = event;
			}
		}).some((tool) => tool.name === SKILL_WORKSHOP_TOOL_NAME),
		...exclusion ? { exclusion } : {}
	};
}
function detectSkillWorkshopToolPolicyDiagnostic(params) {
	if (!params.workshopEnabled) return null;
	const agentId = normalizeAgentId(params.agentId ?? resolveDefaultAgentId(params.config));
	const model = resolveDefaultModelForAgent({
		cfg: params.config,
		agentId
	});
	const capabilityProfile = resolveConversationCapabilityProfile({
		config: params.config,
		agentId,
		modelProvider: model.provider,
		modelId: model.model
	});
	if (!isToolAllowedByPolicyName(SKILL_WORKSHOP_TOOL_NAME, { deny: capabilityProfile.policy.explicitToolDenylist })) return null;
	const prefix = `Skill Workshop is active, but ${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)} is hidden for agent ${JSON.stringify(agentId)}:`;
	const sandbox = resolveSandboxConfigForAgent(params.config, agentId);
	const constructionBlock = resolveSkillWorkshopToolConstructionBlock({ sandboxed: sandbox.mode !== "off" });
	if (constructionBlock) {
		const agent = findAgent(params.config, agentId);
		const source = agent?.entry.sandbox?.mode ? `${agent.path}.sandbox.mode` : "agents.defaults.sandbox.mode";
		const detail = `${source}: ${JSON.stringify(sandbox.mode)}. ${sandbox.mode === "non-main" ? "In non-main sessions, " : ""}${constructionBlock.detail}`;
		return {
			agentId,
			source,
			detail,
			fix: constructionBlock.fix,
			message: `${prefix} ${detail} ${constructionBlock.fix}`
		};
	}
	const availability = resolveSkillWorkshopToolPolicyAvailability({
		config: params.config,
		conversationCapabilityProfile: capabilityProfile
	});
	if (availability.available || !availability.exclusion) return null;
	const explanation = describeExclusion({
		config: params.config,
		agentId,
		capabilityProfile,
		event: availability.exclusion
	});
	return {
		agentId,
		...explanation,
		message: `${prefix} ${explanation.detail} ${explanation.fix}`
	};
}
//#endregion
export { resolveSkillWorkshopToolPolicyAvailability as n, detectSkillWorkshopToolPolicyDiagnostic as t };
