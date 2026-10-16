import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as resolveDefaultAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { r as listAgentEntriesWithSource } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { r as resolveProviderToolPolicyEntry } from "./provider-tool-policy-CQtosRma.mjs";
import { s as isToolAllowedByPolicyName } from "./tool-policy-match-Dn8gpf-E.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-DGIfx80_.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BbWs7GzU.mjs";
import { t as resolveSkillWorkshopToolConstructionBlock } from "./tool-availability-BWNOfZ4J.mjs";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-BYInoSdz.mjs";
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
		tools: listed.entry.tools
	} : void 0;
	const globalProvider = providerPolicyPath({
		tools: params.config.tools,
		basePath: "tools",
		capabilityProfile: params.capabilityProfile
	});
	const agentProvider = providerPolicyPath({
		tools: agent?.tools,
		basePath: agent?.path ?? "agents.entries.*.tools",
		capabilityProfile: params.capabilityProfile
	});
	if (label.startsWith("tools.profile")) {
		const policyPath = agent?.tools.profile ? agent.path : "tools";
		const source = `${policyPath}.profile`;
		const grantOwner = Array.isArray(agent?.tools.alsoAllow) ? agent.path : Array.isArray(params.config.tools?.alsoAllow) ? "tools" : policyPath;
		return {
			source,
			detail: `${source}: ${JSON.stringify(params.capabilityProfile.policy.profile ?? "unknown")} does not include ${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)}.`,
			fix: `Add ${grantOwner}.alsoAllow: [${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)}].`
		};
	}
	if (label.startsWith("tools.byProvider.profile")) {
		const policyPath = agentProvider?.profile ? agentProvider.path : globalProvider?.path;
		const source = policyPath ? `${policyPath}.profile` : "tools.byProvider.profile";
		const grantOwner = agentProvider?.ownsAlsoAllow ? agentProvider.path : globalProvider?.ownsAlsoAllow ? globalProvider.path : policyPath;
		const grant = policyPath ? `${grantOwner}.alsoAllow` : "the matching tools.byProvider alsoAllow";
		return {
			source,
			detail: `${source}: ${JSON.stringify(params.capabilityProfile.policy.providerProfile ?? "unknown")} does not include ${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)}.`,
			fix: policyPath ? `Add ${grant}: [${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)}].` : `Add ${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)} to ${grant} list.`
		};
	}
	const normalizedLabel = label.startsWith(`agents.${params.agentId}.tools.byProvider`) ? label.replace(`agents.${params.agentId}.tools.byProvider`, agentProvider?.path ?? `${agent?.path ?? "agents.entries.*.tools"}.byProvider`) : label.startsWith("tools.byProvider") ? label.replace("tools.byProvider", globalProvider?.path ?? "tools.byProvider") : label.replace(`agents.${params.agentId}.tools`, agent?.path ?? "agents.entries.*.tools").replace("agent tools", agent?.path ?? "agents.entries.*.tools");
	if (!isToolAllowedByPolicyName(SKILL_WORKSHOP_TOOL_NAME, { deny: params.event.policy.deny })) {
		const source = normalizedLabel.replace(/\.allow$/, ".deny");
		return {
			source,
			detail: `${source} denies ${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)}.`,
			fix: `Remove the matching ${JSON.stringify(SKILL_WORKSHOP_TOOL_NAME)} deny entry from ${source}.`
		};
	}
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
		description: "Skill Workshop policy availability probe.",
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
