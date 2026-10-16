import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-C9K4a_6k.mjs";
import { n as isAvatarDataUrl } from "./avatar-policy-DiIdI6oM.mjs";
import "./agent-limits-D-OOBnZ7.mjs";
import { a as isPortableClawAvatar } from "./schema-portability-DPQGHUzw.mjs";
//#region src/claws/migrate-errors.ts
var ClawMigrationError = class extends Error {
	constructor(code, message, path = "$") {
		super(message);
		this.code = code;
		this.path = path;
		this.name = "ClawMigrationError";
	}
};
//#endregion
//#region src/claws/migrate-validation.ts
function containsPotentialSecret(value) {
	return /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u.test(value) || /\b(?:sk-(?:proj-|ant-|live-)?[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{20,})\b/u.test(value) || /\bAKIA[0-9A-Z]{16}\b/u.test(value) || /\bBearer\s+[A-Za-z0-9._~+/-]{20,}={0,}/iu.test(value) || /\b(?:proxy-)?authorization["']?\s*[:=]\s*["']?Basic\s+[A-Za-z0-9+/]{4,}={0,2}/iu.test(value) || /\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b/u.test(value) || /(?:^|[^A-Za-z0-9])(?:[A-Za-z0-9]+[_-])*?(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|secret|token)(?:[_-][A-Za-z0-9]+)*\s*[:=]\s*["']?(?!\$\{|\{\{|<|YOUR_|REPLACE_|EXAMPLE)([A-Za-z0-9/+_=-]{16,})/iu.test(value);
}
function inspectValueForSecret(value) {
	if (typeof value === "string") return containsPotentialSecret(value);
	if (Array.isArray(value)) return value.some(inspectValueForSecret);
	if (value && typeof value === "object") return Object.values(value).some(inspectValueForSecret);
	return false;
}
function normalizeWorkspaceConfig(agent, workspace) {
	return {
		...agent,
		...typeof agent.model === "string" ? { model: { primary: agent.model } } : {},
		id: agent.id,
		workspace
	};
}
/** Keeps source roster ownership when runtime migration materializes an implicit main agent. */
function withAuthoredAgentRoster(config, source) {
	const sourceAgents = source?.agents;
	if (!sourceAgents) return config;
	const agents = { ...config.agents };
	if (Object.hasOwn(sourceAgents, "entries") && sourceAgents.entries !== void 0) {
		agents.entries = structuredClone(sourceAgents.entries);
		delete agents.list;
	} else if (Object.hasOwn(sourceAgents, "list") && sourceAgents.list !== void 0) {
		agents.list = structuredClone(sourceAgents.list);
		delete agents.entries;
	} else return config;
	if (sourceAgents.ownership !== void 0) agents.ownership = sourceAgents.ownership;
	return {
		...config,
		agents
	};
}
function validateAgentConfigKeys(agent) {
	const representable = /* @__PURE__ */ new Set([
		"id",
		"name",
		"description",
		"identity",
		"model",
		"subagents",
		"groupChat",
		"sandbox",
		"tools",
		"memory",
		"heartbeat",
		"humanDelay",
		"workspace"
	]);
	const unsupported = Object.keys(agent).filter((key) => !representable.has(key));
	if (unsupported.length > 0) throw new ClawMigrationError("agent_setting_unsupported", `Agent settings cannot be represented by Claw v1: ${unsupported.toSorted().join(", ")}. Remove or move those settings before migrating.`, "$.agent");
	const avatar = agent.identity?.avatar?.trim();
	if (avatar && (!isAvatarDataUrl(avatar) || !isPortableClawAvatar(avatar))) throw new ClawMigrationError("agent_avatar_unsupported", "This migration can represent an embedded portable image avatar, but not a URL or local avatar path. Keep the avatar unmanaged or convert it to a supported image data URL before migrating.", "$.agent.identity.avatar");
}
function modelPrimary(model) {
	if (typeof model === "string") return model;
	return model?.primary;
}
function unsupportedFields(value, fields, prefix) {
	const source = asOptionalRecord(value);
	if (!source) return [];
	return Object.keys(source).filter((field) => !fields.includes(field)).map((field) => `${prefix}.${field}`);
}
function unsupportedSubagentDefaultFields(value) {
	const source = asOptionalRecord(value);
	if (!source) return [];
	return Object.keys(source).filter((field) => {
		if (field === "allowAgents" || field === "delegationMode") return false;
		if (field === "maxConcurrent" && source.maxConcurrent === 8) return false;
		if (field === "archiveAfterMinutes" && source.archiveAfterMinutes === 60) return false;
		return true;
	}).map((field) => `agents.defaults.subagents.${field}`);
}
function inheritPortableSettings(settings, defaults, keys) {
	const inherited = { ...settings };
	for (const key of keys) if (inherited[key] === void 0 && defaults?.[key] !== void 0) inherited[key] = defaults[key];
	return inherited;
}
function resolveMigrationAgentSettings(config, agent) {
	const defaults = config.agents?.defaults;
	if (!defaults) return agent;
	const hostDefaults = /* @__PURE__ */ new Set([
		"workspace",
		"modelSelectionScope",
		"systemAgent",
		"authInheritance",
		"sessionStore",
		"maxConcurrent"
	]);
	const portableDefaults = /* @__PURE__ */ new Set([
		"model",
		"subagents",
		"heartbeat",
		"sandbox",
		"humanDelay"
	]);
	const unsupportedDefaults = Object.keys(defaults).flatMap((key) => {
		const compaction = asOptionalRecord(defaults.compaction);
		if (key === "compaction" && (Object.keys(compaction ?? {}).length === 0 || Object.keys(compaction ?? {}).length === 1 && compaction?.mode === "safeguard")) return [];
		if (hostDefaults.has(key) || portableDefaults.has(key)) return [];
		return [`agents.defaults.${key}`];
	});
	unsupportedDefaults.push(...unsupportedSubagentDefaultFields(defaults.subagents), ...unsupportedFields(defaults.heartbeat, [
		"agentId",
		"every",
		"activeHours",
		"lightContext",
		"isolatedSession",
		"timeoutSeconds"
	], "agents.defaults.heartbeat"), ...unsupportedFields(asOptionalRecord(defaults.heartbeat)?.activeHours, [
		"start",
		"end",
		"timezone"
	], "agents.defaults.heartbeat.activeHours"), ...unsupportedFields(defaults.sandbox, [
		"mode",
		"scope",
		"workspaceAccess"
	], "agents.defaults.sandbox"), ...unsupportedFields(defaults.humanDelay, [
		"mode",
		"minMs",
		"maxMs"
	], "agents.defaults.humanDelay"));
	if (unsupportedDefaults.length > 0) throw new ClawMigrationError("agent_default_setting_unsupported", `Inherited agent settings cannot be represented by Claw v1: ${unsupportedDefaults.toSorted().join(", ")}. Keep this agent unmanaged or remove those defaults before migrating.`, "$.agents.defaults");
	const inheritedSubagents = inheritPortableSettings(agent.subagents, defaults.subagents, ["allowAgents", "delegationMode"]);
	const inheritedHeartbeat = inheritPortableSettings(agent.heartbeat, defaults.heartbeat, [
		"every",
		"activeHours",
		"lightContext",
		"isolatedSession",
		"timeoutSeconds"
	]);
	const inheritedSandbox = inheritPortableSettings(agent.sandbox, defaults.sandbox, [
		"mode",
		"scope",
		"workspaceAccess"
	]);
	const inheritedHumanDelay = inheritPortableSettings(agent.humanDelay, defaults.humanDelay, [
		"mode",
		"minMs",
		"maxMs"
	]);
	const inheritedAgent = {
		...agent,
		...Object.keys(inheritedSubagents).length > 0 ? { subagents: inheritedSubagents } : {},
		...Object.keys(inheritedHeartbeat).length > 0 ? { heartbeat: inheritedHeartbeat } : {},
		...Object.keys(inheritedSandbox).length > 0 ? { sandbox: inheritedSandbox } : {},
		...Object.keys(inheritedHumanDelay).length > 0 ? { humanDelay: inheritedHumanDelay } : {}
	};
	const defaultModel = defaults.model;
	if (defaultModel === void 0) return inheritedAgent;
	const primary = modelPrimary(agent.model) ?? modelPrimary(defaultModel);
	const hasAgentFallbacks = typeof agent.model === "object" && Array.isArray(agent.model.fallbacks);
	const hasDefaultFallbacks = typeof defaultModel === "object" && Array.isArray(defaultModel.fallbacks);
	const fallbacks = hasAgentFallbacks ? resolveAgentModelFallbackValues(agent.model) : resolveAgentModelFallbackValues(defaultModel);
	const effectiveModel = typeof agent.model === "string" && !hasDefaultFallbacks ? agent.model : {
		...typeof agent.model === "object" ? agent.model : {},
		...primary ? { primary } : {},
		...hasAgentFallbacks || hasDefaultFallbacks ? { fallbacks } : {}
	};
	return {
		...inheritedAgent,
		model: effectiveModel
	};
}
//#endregion
export { validateAgentConfigKeys as a, resolveMigrationAgentSettings as i, inspectValueForSecret as n, withAuthoredAgentRoster as o, normalizeWorkspaceConfig as r, ClawMigrationError as s, containsPotentialSecret as t };
