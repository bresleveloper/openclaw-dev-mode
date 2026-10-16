import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as normalizeTrimmedStringList, r as normalizeArrayBackedTrimmedStringList, v as sortUniqueStrings, y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import { r as listAgentEntriesWithSource } from "./agent-roster-BXD1uMJD.mjs";
import { c as normalizePluginId } from "./config-state-DY_WJYue.mjs";
import { n as resolveProviderToolPolicy } from "./provider-tool-policy-CQtosRma.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DyHnjiiS.mjs";
import { o as sanitizeServerName } from "./agent-bundle-mcp-names-BHnv55Pk.mjs";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DrwZe41_.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-DWHChhWM.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-BKvvmcQR.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { t as resolveDoctorPrimaryModelRef } from "./primary-model-ref-DvugVG3o.mjs";
//#region src/commands/doctor/shared/plugin-tool-allowlist-warnings.ts
function normalizePluginIdMaybe(value) {
	return typeof value === "string" && value.trim() ? normalizePluginId(value) : void 0;
}
function collectToolPolicySources(policy, label, out) {
	if (!isRecord(policy)) return;
	for (const key of ["allow", "alsoAllow"]) {
		const entries = normalizeTrimmedStringList(policy[key]);
		if (entries.length > 0) out.push({
			label: `${label}.${key}`,
			entries
		});
	}
	if (isRecord(policy.byProvider)) for (const [providerId, providerPolicy] of Object.entries(policy.byProvider)) collectToolPolicySources(providerPolicy, `${label}.byProvider.${providerId}`, out);
	collectToolPolicySources(isRecord(policy.sandbox) ? policy.sandbox.tools : void 0, `${label}.sandbox.tools`, out);
	collectToolPolicySources(isRecord(policy.subagents) ? policy.subagents.tools : void 0, `${label}.subagents.tools`, out);
}
function collectToolAllowlistSources(cfg) {
	const sources = [];
	collectToolPolicySources(cfg.tools, "tools", sources);
	for (const { entry: agent, source } of listAgentEntriesWithSource(cfg)) {
		const label = source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list[${source.index}]`;
		collectToolPolicySources(agent.tools, `${label}.tools`, sources);
	}
	return sources;
}
function formatSortedSourceLabels(sorted) {
	if (sorted.length <= 3) return sorted.join(", ");
	return `${sorted.slice(0, 3).join(", ")} (+${sorted.length - 3} more)`;
}
function formatSourceLabels(labels) {
	return formatSortedSourceLabels(sortUniqueStrings(labels));
}
function formatSourceLabelSubject(labels) {
	const sorted = sortUniqueStrings(labels);
	return {
		text: formatSortedSourceLabels(sorted),
		verb: sorted.length === 1 ? "does" : "do"
	};
}
function collectToolOwners(registry) {
	const owners = /* @__PURE__ */ new Map();
	for (const plugin of registry.plugins) {
		const pluginId = normalizePluginId(plugin.id);
		for (const toolNameRaw of plugin.contracts?.tools ?? []) {
			const toolName = normalizeToolPolicyName(toolNameRaw);
			if (!toolName) continue;
			owners.set(toolName, [...owners.get(toolName) ?? [], pluginId]);
		}
	}
	return owners;
}
function collectConfiguredMcpServerNames(cfg) {
	const servers = cfg.mcp?.servers;
	if (!isRecord(servers)) return [];
	return Object.entries(servers).filter(([, value]) => isRecord(value) && value.enabled !== false).map(([name]) => name.trim()).filter(Boolean).toSorted((left, right) => left.localeCompare(right));
}
function isSandboxModeActive(mode) {
	return mode === "all" || mode === "non-main";
}
function getList(value, key) {
	return isRecord(value) ? normalizeArrayBackedTrimmedStringList(value[key]) : void 0;
}
function buildEffectiveSandboxToolPolicy(params) {
	const agentLabel = params.agentLabel ?? "agents.entries.*.tools.sandbox.tools";
	const policy = {};
	const fieldLabels = {};
	for (const key of [
		"allow",
		"alsoAllow",
		"deny"
	]) for (const [value, label] of [[params.agentPolicy, agentLabel], [params.globalPolicy, "tools.sandbox.tools"]]) if (isRecord(value) && Array.isArray(value[key])) {
		policy[key] = value[key];
		fieldLabels[key] = `${label}.${key}`;
		break;
	}
	const allowLabels = [fieldLabels.allow, fieldLabels.alsoAllow].filter((label) => Boolean(label));
	const labels = allowLabels.length > 0 ? allowLabels : ["tools.sandbox.tools.alsoAllow (unset)"];
	return {
		labels,
		dedupeKey: uniqueStrings([...labels, fieldLabels.deny].filter((label) => Boolean(label))).join("\0"),
		policy,
		nonSandboxToolPolicyBlocksMcp: params.nonSandboxToolPolicyBlocksMcp
	};
}
function collectActiveSandboxToolPolicies(cfg, serverNames) {
	const out = /* @__PURE__ */ new Map();
	const globalPolicy = cfg.tools?.sandbox?.tools;
	const globalToolPolicyBlocksMcp = nonSandboxToolPoliciesBlockMcp({
		cfg,
		serverNames
	});
	const addPolicy = (entry) => {
		const existing = out.get(entry.dedupeKey);
		if (existing && !existing.nonSandboxToolPolicyBlocksMcp) return;
		out.set(entry.dedupeKey, entry);
	};
	const defaultSandboxActive = isSandboxModeActive(cfg.agents?.defaults?.sandbox?.mode);
	if (defaultSandboxActive) addPolicy(buildEffectiveSandboxToolPolicy({
		globalPolicy,
		nonSandboxToolPolicyBlocksMcp: globalToolPolicyBlocksMcp
	}));
	for (const { entry: agent, source } of listAgentEntriesWithSource(cfg)) {
		const explicitMode = (isRecord(agent.sandbox) ? agent.sandbox : void 0)?.mode;
		if (!(explicitMode === void 0 ? defaultSandboxActive : isSandboxModeActive(explicitMode))) continue;
		const agentTools = isRecord(agent.tools) ? agent.tools : void 0;
		const agentToolsSandbox = isRecord(agentTools?.sandbox) ? agentTools.sandbox : void 0;
		addPolicy(buildEffectiveSandboxToolPolicy({
			agentPolicy: isRecord(agentToolsSandbox?.tools) ? agentToolsSandbox.tools : void 0,
			agentLabel: `${source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list[${source.index}]`}.tools.sandbox.tools`,
			globalPolicy,
			nonSandboxToolPolicyBlocksMcp: nonSandboxToolPoliciesBlockMcp({
				cfg,
				serverNames,
				agent
			})
		}));
	}
	return [...out.values()];
}
function buildMcpToolNamePrefixes(serverNames) {
	const usedNames = /* @__PURE__ */ new Set();
	return serverNames.map((serverName) => normalizeToolPolicyName(`${sanitizeServerName(serverName, usedNames)}__`)).filter(Boolean);
}
function entriesMatchMcpTool(entries, serverNames, mode) {
	const normalizedEntries = entries.map(normalizeToolPolicyName).filter(Boolean);
	if (normalizedEntries.some((entry) => entry === "*" || entry === "bundle-mcp" || entry === "group:plugins")) return true;
	const serverPrefixes = buildMcpToolNamePrefixes(serverNames);
	const patterns = compileGlobPatterns({
		raw: normalizedEntries,
		normalize: normalizeToolPolicyName
	});
	const prefixOrPatternMatches = (prefix) => normalizedEntries.some((entry) => entry.length > prefix.length && entry.startsWith(prefix)) || matchesAnyGlobPattern(`${prefix}probe`, patterns);
	return mode === "every" ? serverPrefixes.every(prefixOrPatternMatches) : serverPrefixes.some(prefixOrPatternMatches);
}
function toolPolicyAllowsMcpServers(policy, serverNames, mode) {
	const allow = getList(policy, "allow");
	if (Array.isArray(allow) && allow.length === 0) return true;
	return entriesMatchMcpTool([...allow ?? [], ...getList(policy, "alsoAllow") ?? []], serverNames, mode);
}
function toolPolicyDeniesAllMcpServers(policy, serverNames) {
	return entriesMatchMcpTool(getList(policy, "deny") ?? [], serverNames, "every");
}
function nonSandboxToolPolicyBlocksMcp(policy, serverNames) {
	if (toolPolicyDeniesAllMcpServers(policy, serverNames)) return true;
	const allow = getList(policy, "allow");
	if (!Array.isArray(allow) || allow.length === 0) return false;
	return !entriesMatchMcpTool([...allow, ...getList(policy, "alsoAllow") ?? []], serverNames, "any");
}
function profileToolPolicyBlocksMcp(policy, serverNames) {
	const profile = isRecord(policy) && typeof policy.profile === "string" ? policy.profile : "";
	const profilePolicy = mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(profile), getList(policy, "alsoAllow"));
	return Boolean(profilePolicy && !toolPolicyAllowsMcpServers(profilePolicy, serverNames, "any"));
}
function nonSandboxToolPoliciesBlockMcp(params) {
	const globalTools = params.cfg.tools;
	const agentTools = isRecord(params.agent?.tools) ? params.agent.tools : void 0;
	const modelRef = resolveDoctorPrimaryModelRef(params.cfg, params.agent?.model);
	const globalProviderPolicy = resolveProviderToolPolicy({
		byProvider: globalTools?.byProvider,
		modelProvider: modelRef.provider,
		modelId: modelRef.model
	});
	const agentProviderPolicy = resolveProviderToolPolicy({
		byProvider: isRecord(agentTools?.byProvider) ? agentTools.byProvider : void 0,
		modelProvider: modelRef.provider,
		modelId: modelRef.model
	});
	const profilePolicy = {
		profile: agentTools?.profile ?? globalTools?.profile,
		alsoAllow: agentTools?.alsoAllow ?? globalTools?.alsoAllow
	};
	const providerProfilePolicy = {
		profile: agentProviderPolicy?.profile ?? globalProviderPolicy?.profile,
		alsoAllow: agentProviderPolicy?.alsoAllow ?? globalProviderPolicy?.alsoAllow
	};
	return profileToolPolicyBlocksMcp(profilePolicy, params.serverNames) || profileToolPolicyBlocksMcp(providerProfilePolicy, params.serverNames) || nonSandboxToolPolicyBlocksMcp(globalTools, params.serverNames) || nonSandboxToolPolicyBlocksMcp(globalProviderPolicy, params.serverNames) || nonSandboxToolPolicyBlocksMcp(agentTools, params.serverNames) || nonSandboxToolPolicyBlocksMcp(agentProviderPolicy, params.serverNames);
}
function formatMcpServerSummary(serverNames) {
	const noun = serverNames.length === 1 ? "server" : "servers";
	const listed = serverNames.slice(0, 3).map((serverName) => `"${serverName}"`).join(", ");
	const suffix = serverNames.length > 3 ? `, +${serverNames.length - 3} more` : "";
	return `${serverNames.length} MCP ${noun}${listed ? ` (${listed}${suffix})` : ""}`;
}
function collectSandboxMcpAllowlistWarnings(cfg) {
	const serverNames = collectConfiguredMcpServerNames(cfg);
	if (serverNames.length === 0) return [];
	const issueSources = collectActiveSandboxToolPolicies(cfg, serverNames).filter(({ policy }) => !toolPolicyAllowsMcpServers(policy, serverNames, "every") && !toolPolicyDeniesAllMcpServers(policy, serverNames)).filter(({ nonSandboxToolPolicyBlocksMcp: nonSandboxToolPolicyBlocksMcpLocal }) => !nonSandboxToolPolicyBlocksMcpLocal).flatMap(({ labels }) => labels);
	if (issueSources.length === 0) return [];
	const sourceSubject = formatSourceLabelSubject(issueSources);
	return [`- mcp.servers defines ${formatMcpServerSummary(serverNames)}, but ${sourceSubject.text} ${sourceSubject.verb} not include "bundle-mcp", "group:plugins", or a matching server-prefixed MCP tool name/glob such as "<server>__*". Sandboxed agents will filter bundled MCP tools before provider requests. Add "bundle-mcp" to tools.sandbox.tools.alsoAllow (or use "group:plugins" / server globs) if those MCP tools should be visible; use tools.sandbox.tools.allow: [] only when you intentionally want no sandbox allow gate.`];
}
function formatPluginList(pluginIds) {
	return pluginIds.map((pluginId) => `"${pluginId}"`).join(", ");
}
function addIssue(issues, key, sourceLabel) {
	const sources = issues.get(key) ?? /* @__PURE__ */ new Set();
	sources.add(sourceLabel);
	issues.set(key, sources);
}
/** Collect warnings when plugin allowlists block tools referenced by active tool policies. */
function collectPluginToolAllowlistWarnings(params) {
	if (params.cfg.plugins?.enabled === false) return [];
	const warnings = collectSandboxMcpAllowlistWarnings(params.cfg);
	const allowedPluginIds = (params.cfg.plugins?.allow ?? []).map(normalizePluginIdMaybe).filter((pluginId) => Boolean(pluginId));
	const allowedPlugins = new Set(allowedPluginIds);
	if (allowedPlugins.size === 0) return warnings;
	const sources = collectToolAllowlistSources(params.cfg);
	if (sources.length === 0) return warnings;
	const wildcardSources = sources.filter((source) => source.entries.some((entry) => normalizeToolPolicyName(entry) === "*")).map((source) => source.label);
	if (wildcardSources.length > 0) warnings.push(`- plugins.allow is an exclusive plugin allowlist. ${formatSourceLabels(wildcardSources)} contains "*", but that wildcard only matches tools from plugins that are loaded; plugin tools outside plugins.allow stay unavailable. Add the required plugin ids to plugins.allow or remove plugins.allow.`);
	const exactEntries = sources.flatMap((source) => source.entries.map((entry) => ({
		source: source.label,
		entry: normalizeToolPolicyName(entry)
	})).filter(({ entry }) => entry && entry !== "*" && entry !== "group:plugins"));
	if (exactEntries.length === 0) return warnings;
	const registry = params.manifestRegistry ?? loadManifestMetadataSnapshot({
		config: params.cfg,
		env: params.env ?? process.env
	}).manifestRegistry;
	const knownPluginIds = new Set(registry.plugins.map((plugin) => normalizePluginId(plugin.id)));
	const toolOwners = collectToolOwners(registry);
	const missingPluginIssues = /* @__PURE__ */ new Map();
	const missingToolOwnerIssues = /* @__PURE__ */ new Map();
	for (const { source, entry } of exactEntries) {
		const pluginId = normalizePluginId(entry);
		if (knownPluginIds.has(pluginId) && !allowedPlugins.has(pluginId)) {
			addIssue(missingPluginIssues, pluginId, source);
			continue;
		}
		const owners = toolOwners.get(entry) ?? [];
		if (owners.length > 0 && owners.every((ownerPluginId) => !allowedPlugins.has(ownerPluginId))) addIssue(missingToolOwnerIssues, `${entry}\u0000${owners.join("\0")}`, source);
	}
	for (const [pluginId, issueSources] of [...missingPluginIssues.entries()].toSorted((left, right) => left[0].localeCompare(right[0]))) warnings.push(`- ${formatSourceLabels(issueSources)} references plugin "${pluginId}", but plugins.allow does not include it. Add "${pluginId}" to plugins.allow or remove plugins.allow.`);
	for (const [issueKey, issueSources] of [...missingToolOwnerIssues.entries()].toSorted((left, right) => left[0].localeCompare(right[0]))) {
		const [toolName, ...ownerPluginIds] = issueKey.split("\0");
		if (!toolName) continue;
		warnings.push(`- ${formatSourceLabels(issueSources)} references tool "${toolName}", owned by plugin ${formatPluginList(ownerPluginIds)}, but plugins.allow does not include the owning plugin. Add ${formatPluginList(ownerPluginIds)} to plugins.allow or remove plugins.allow.`);
	}
	return warnings;
}
//#endregion
export { collectPluginToolAllowlistWarnings };
