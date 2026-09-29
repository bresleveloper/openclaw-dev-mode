import "./utils-aKqR_F_U.mjs";
import { t as isPlainObject } from "./plain-object-5a0EzLzX.mjs";
import "./account-id-B1bfbA5J.mjs";
import { a as resolveConfiguredTalkRealtimeProviderId, o as resolveConfiguredTalkSpeechProviderId } from "./talk-CaH8Mknv.mjs";
import { t as canHotReloadGatewayAuthCredentials } from "./auth-resolve-BeCTtDNQ.mjs";
import { d as getActivePluginRegistryVersion, l as getActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import { r as listChannelPlugins } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/config-diff.ts
function collectConfigDiffPaths(prev, next, prefix, refinementPrefixes, paths) {
	if (prev === next) return;
	const prevIsPlainObject = isPlainObject(prev);
	const nextIsPlainObject = isPlainObject(next);
	if (prevIsPlainObject && nextIsPlainObject || (prevIsPlainObject || nextIsPlainObject) && refinementPrefixes.some((entry) => prefix ? entry.startsWith(`${prefix}.`) : true)) {
		const prevRecord = prevIsPlainObject ? prev : {};
		const nextRecord = nextIsPlainObject ? next : {};
		const keys = /* @__PURE__ */ new Set([...Object.keys(prevRecord), ...Object.keys(nextRecord)]);
		for (const key of keys) {
			const prevValue = prevRecord[key];
			const nextValue = nextRecord[key];
			if (prevValue === void 0 && nextValue === void 0) continue;
			collectConfigDiffPaths(prevValue, nextValue, prefix ? `${prefix}.${key}` : key, refinementPrefixes, paths);
		}
		return;
	}
	if (Array.isArray(prev) && Array.isArray(next)) {
		if (isDeepStrictEqual(prev, next)) return;
	}
	paths.push(prefix || "<root>");
}
/** Return dotted config paths whose values differ between two config snapshots. */
function diffConfigPaths(prev, next, prefix = "", refinementPrefixes = []) {
	const paths = [];
	collectConfigDiffPaths(prev, next, prefix, refinementPrefixes, paths);
	return paths;
}
function projectGatewayReloadBoundaries(config) {
	return { talk: {
		provider: resolveConfiguredTalkSpeechProviderId(config),
		realtime: { provider: resolveConfiguredTalkRealtimeProviderId(config) }
	} };
}
/** Preserve declared reload boundaries and derived capability-owner changes. */
function diffGatewayReloadPaths(prevConfig, nextConfig, reloadPrefixes) {
	const refinementPrefixes = new Set(reloadPrefixes);
	if (refinementPrefixes.delete("agents.entries.*.decisionModel")) {
		for (const config of [prevConfig, nextConfig]) for (const [agentId, agent] of Object.entries(config.agents?.entries ?? {})) if (agent.decisionModel !== void 0) refinementPrefixes.add(`agents.entries.${agentId}.decisionModel`);
	}
	const changedPaths = diffConfigPaths(prevConfig, nextConfig, "", [...refinementPrefixes]);
	const boundaryPaths = diffConfigPaths(projectGatewayReloadBoundaries(prevConfig), projectGatewayReloadBoundaries(nextConfig));
	return [...changedPaths, ...boundaryPaths.filter((path) => !changedPaths.includes(path))];
}
//#endregion
//#region src/gateway/config-reload-plan.ts
const RELOAD_ACTIONS = [
	"reloadHooks",
	"reloadInternalHooks",
	"refreshHooksPolicy",
	"restartGmailWatcher",
	"restartCron",
	"restartHeartbeat",
	"reconcileSystemJobs",
	"reloadPlugins",
	"disposeMcpRuntimes"
];
function isNoopGatewayReloadPlan(plan) {
	return !plan.restartGateway && plan.hotReasons.length === 0 && RELOAD_ACTIONS.every((action) => !plan[action]) && plan.restartChannels.size === 0 && (plan.restartServices?.size ?? 0) === 0 && (plan.restartChannelAccounts?.size ?? 0) === 0;
}
const PLUGIN_INSTALL_TIMESTAMP_KEYS = ["installedAt", "resolvedAt"];
const AUTH_CREDENTIAL_PATHS = ["gateway.auth.token", "gateway.auth.password"];
const SHARED_CHANNEL_PREFIXES = [
	"agents.defaults.mediaMaxMb",
	"channels.defaults",
	"channels.modelByChannel",
	"messages.inbound",
	"messages.ackReactionScope",
	"commands",
	"accessGroups",
	"tts",
	"surfaces",
	"acp.stream",
	"diagnostics.flags"
];
function matchesReloadPrefix(path, prefix) {
	if (prefix.includes("*")) {
		const segments = path.split(".");
		return prefix.split(".").every((segment, index) => segment === "*" ? Boolean(segments[index]) : segment === segments[index]);
	}
	return path === prefix || path.startsWith(`${prefix}.`);
}
function compareReloadRules(left, right) {
	const leftSegments = left.prefix.split(".");
	const rightSegments = right.prefix.split(".");
	return rightSegments.length - leftSegments.length || leftSegments.filter((segment) => segment === "*").length - rightSegments.filter((segment) => segment === "*").length;
}
function expandReloadPolicies(policies) {
	return policies.flatMap(({ prefixes, ...policy }) => prefixes.map((prefix) => ({
		...policy,
		prefix
	}))).toSorted(compareReloadRules);
}
const AGENT_ROSTER_RELOAD_ACTIONS = [
	"restartHeartbeat",
	"reconcileSystemJobs",
	"refreshHooksPolicy",
	"reloadInternalHooks"
];
const CORE_RELOAD_POLICIES = [
	{
		prefixes: ["gateway.remote", "gateway.reload"],
		kind: "none"
	},
	{
		prefixes: [
			...AUTH_CREDENTIAL_PATHS,
			"mcp.apps",
			"secrets.egressProxy",
			"gateway.portals"
		],
		kind: "restart"
	},
	{
		prefixes: [
			"gateway.http.endpoints",
			"gateway.http.securityHeaders.strictTransportSecurity",
			"gateway.tools",
			"gateway.cliAgents",
			"gateway.controlUi.enabled",
			"gateway.controlUi.environment",
			"gateway.controlUi.communityInvite",
			"gateway.controlUi.github",
			"gateway.controlUi.sessionObserver",
			"gateway.controlUi.embedSandbox",
			"gateway.controlUi.allowExternalEmbedUrls",
			"gateway.controlUi.automaticallyFetchFavicons",
			"gateway.controlUi.experimental.customPlugins",
			"gateway.controlUi.allowedOrigins",
			"gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback",
			"gateway.nodes.browser",
			"gateway.nodes.pairing",
			"gateway.nodes.commands",
			"gateway.nodes.pluginTools.enabled",
			"gateway.nodes.allowSkills",
			"gateway.push.apns.relay",
			"gateway.terminal",
			"gateway.auth.rateLimit",
			"gateway.roles",
			"gateway.trustedProxies",
			"gateway.allowRealIpFallback",
			"gateway.auth.allowTailscale",
			"gateway.auth.identityScopes",
			"gateway.auth.trustedProxy",
			"diagnostics.enabled",
			"discovery.mdns.mode",
			"mcp.apps.sandboxOrigin",
			"agents.defaults",
			"desktop.host",
			"cloudWorkers"
		],
		kind: "hot"
	},
	{
		prefixes: ["hooks.gmail"],
		kind: "hot",
		actions: ["restartGmailWatcher", "reloadHooks"]
	},
	{
		prefixes: ["hooks.internal", "agents.defaults.workspace"],
		kind: "hot",
		actions: ["reloadInternalHooks"]
	},
	{
		prefixes: ["hooks"],
		kind: "hot",
		actions: ["reloadHooks"]
	},
	{
		prefixes: [
			"agents.defaults.heartbeat",
			"agents.defaults.models",
			"agents.defaults.modelPolicy",
			"agents.defaults.model",
			"models",
			"agent.heartbeat"
		],
		kind: "hot",
		actions: ["restartHeartbeat", "reconcileSystemJobs"]
	},
	{
		prefixes: ["agents.entries"],
		kind: "hot",
		actions: AGENT_ROSTER_RELOAD_ACTIONS
	},
	{
		prefixes: ["agents.entries.*.decisionModel"],
		kind: "hot",
		actions: [...AGENT_ROSTER_RELOAD_ACTIONS, "reloadPlugins"]
	},
	{
		prefixes: ["agents.defaults.sessionStore", "agents.ownership"],
		kind: "hot",
		actions: ["refreshHooksPolicy"]
	},
	{
		prefixes: ["skills.workshop.autonomous.mode"],
		kind: "hot",
		actions: ["reconcileSystemJobs"]
	},
	{
		prefixes: ["agents.defaults.decisionModel"],
		kind: "hot",
		actions: ["reloadPlugins"]
	},
	{
		prefixes: ["plugins.load", "plugins.installs"],
		kind: "hot",
		actions: ["reloadPlugins"]
	},
	{
		prefixes: ["cron"],
		kind: "hot",
		actions: ["restartCron"]
	},
	{
		prefixes: ["transcripts", "cloudWorkers.profiles"],
		kind: "hot",
		actions: ["reloadPlugins"]
	},
	{
		prefixes: ["mcp", "gateway.publicOrigin"],
		kind: "hot",
		actions: ["disposeMcpRuntimes"]
	},
	{
		prefixes: ["talk.provider", "talk.realtime.provider"],
		kind: "hot",
		actions: ["reloadPlugins"]
	}
];
const DEFAULT_RELOAD_POLICIES = [
	{
		prefixes: [
			"meta",
			"identity",
			"wizard",
			"logging",
			"agents",
			"bindings",
			"audio",
			"agent",
			"routing",
			"messages",
			"session",
			"talk",
			"skills",
			"secrets",
			"tui",
			"ui"
		],
		kind: "none"
	},
	{
		prefixes: [
			"tools",
			"approvals.exec",
			"approvals.plugin",
			"auth.order",
			"auth.profiles",
			"broadcast",
			"memory.citations",
			"worktreeRoot",
			"worktreeAcceleration",
			"security.audit.suppressions",
			"security.installPolicy",
			"diagnostics.cacheTrace.enabled",
			"acp",
			"attachments.ttlHours",
			"update.checkOnStart",
			"update.channel",
			"update.auto.enabled",
			"telemetry.enabled",
			"telemetry.consentedAt"
		],
		kind: "hot"
	},
	{
		prefixes: ["plugins"],
		kind: "hot",
		actions: ["reloadPlugins", "disposeMcpRuntimes"]
	},
	{
		prefixes: ["channels"],
		kind: "hot",
		actions: ["reloadPlugins"],
		replaceChannelPlugins: true
	},
	{
		prefixes: ["gateway", "discovery"],
		kind: "restart"
	}
];
let cachedCatalog;
function getReloadPolicyCatalog() {
	const registry = getActivePluginRegistry();
	const version = getActivePluginRegistryVersion();
	if (cachedCatalog?.registry === registry && cachedCatalog.version === version) return cachedCatalog;
	const channelPlugins = listChannelPlugins();
	const servicePolicies = (registry?.services ?? []).map(({ id, service }) => ({
		prefixes: service.reload?.configPrefixes ?? [],
		services: [id]
	}));
	const channelPolicies = channelPlugins.flatMap((plugin) => [{
		prefixes: plugin.reload?.configPrefixes ?? [],
		kind: "hot",
		channels: [plugin],
		accountScoped: plugin.reload?.accountScopedRestart
	}, {
		prefixes: plugin.reload?.noopPrefixes ?? [],
		kind: "none",
		channels: [plugin]
	}]);
	const channelRules = expandReloadPolicies(channelPolicies);
	const sharedPrefixes = /* @__PURE__ */ new Set([...SHARED_CHANNEL_PREFIXES, ...channelRules.filter(({ prefix }) => SHARED_CHANNEL_PREFIXES.some((root) => matchesReloadPrefix(prefix, root))).map(({ prefix }) => prefix)]);
	const ownedRules = expandReloadPolicies([
		...CORE_RELOAD_POLICIES,
		...(registry?.reloads ?? []).flatMap(({ registration }) => [
			["restart", registration.restartPrefixes],
			["hot", registration.hotPrefixes],
			["none", registration.noopPrefixes]
		].map(([kind, prefixes]) => ({
			kind,
			prefixes: prefixes ?? []
		}))),
		...Array.from(sharedPrefixes, (prefix) => {
			const channels = channelPlugins.filter((plugin) => channelRules.find((rule) => rule.channels?.includes(plugin) && matchesReloadPrefix(prefix, rule.prefix))?.kind !== "none");
			const hasService = servicePolicies.some(({ prefixes }) => prefixes.some((owner) => matchesReloadPrefix(prefix, owner)));
			return {
				prefixes: [prefix],
				kind: channels.length || hasService ? "hot" : "none",
				channels
			};
		}),
		...channelPolicies,
		...channelPlugins.map((plugin) => ({
			prefixes: [`plugins.entries.${plugin.id}`],
			kind: "hot",
			actions: ["reloadPlugins", "disposeMcpRuntimes"],
			channels: [plugin]
		})),
		{
			prefixes: ["session.scope", "session.store"],
			kind: "hot",
			actions: ["refreshHooksPolicy"]
		},
		...DEFAULT_RELOAD_POLICIES
	]);
	const rules = [...ownedRules, ...servicePolicies.flatMap(({ prefixes }) => prefixes.map((prefix) => ({
		...ownedRules.find((owner) => matchesReloadPrefix(prefix, owner.prefix)),
		kind: "hot",
		prefix
	})))];
	for (const rule of rules) rule.services = servicePolicies.filter((service) => service.prefixes.some((owner) => matchesReloadPrefix(rule.prefix, owner))).flatMap((service) => service.services);
	rules.sort(compareReloadRules);
	cachedCatalog = {
		registry,
		version,
		rules,
		refinementPrefixes: rules.map((rule) => rule.prefix)
	};
	return cachedCatalog;
}
function listConfigReloadRefinementPrefixes() {
	return getReloadPolicyCatalog().refinementPrefixes;
}
function matchRule(path) {
	return getReloadPolicyCatalog().rules.find(({ prefix }) => matchesReloadPrefix(path, prefix));
}
function resolveConfigReloadMetadata(path) {
	if (isPluginInstallTimestampPath(path)) return { kind: "none" };
	return { kind: matchRule(path)?.kind ?? "restart" };
}
function isPluginInstallTimestampPath(path) {
	return /^plugins\.installs\..+\.(installedAt|resolvedAt)$/.test(path);
}
function getPluginInstallRecords(config) {
	if (!isPlainObject(config)) return {};
	const plugins = config.plugins;
	if (!isPlainObject(plugins)) return {};
	const installs = plugins.installs;
	return isPlainObject(installs) ? installs : {};
}
function resolvePluginInstallReloadMetadata(prevConfig, nextConfig) {
	const prevInstalls = getPluginInstallRecords(prevConfig);
	const nextInstalls = getPluginInstallRecords(nextConfig);
	const ids = /* @__PURE__ */ new Set([...Object.keys(prevInstalls), ...Object.keys(nextInstalls)]);
	const noopPaths = [];
	const forceChangedPaths = [];
	for (const id of ids) {
		const prevRecord = prevInstalls[id];
		const nextRecord = nextInstalls[id];
		if (!isPlainObject(prevRecord) || !isPlainObject(nextRecord)) {
			forceChangedPaths.push(`plugins.installs.${id}`);
			continue;
		}
		for (const key of PLUGIN_INSTALL_TIMESTAMP_KEYS) if (prevRecord[key] !== nextRecord[key]) noopPaths.push(`plugins.installs.${id}.${key}`);
	}
	return {
		noopPaths,
		forceChangedPaths
	};
}
function extractAccountIdFromPath(channel, path) {
	const prefix = `channels.${channel}.accounts.`;
	const id = path.startsWith(prefix) ? path.slice(prefix.length).split(".", 1)[0] : void 0;
	return id && id !== "default" ? id : null;
}
function isInspectableChannelAccount(params) {
	try {
		if (!params.plugin.config.listAccountIds(params.config).includes(params.accountId)) return false;
		(params.plugin.config.inspectAccount ?? params.plugin.config.resolveAccount)(params.config, params.accountId);
		return true;
	} catch {
		return false;
	}
}
function buildGatewayReloadPlan(changedPaths, options = {}) {
	const noopPaths = new Set(options.noopPaths);
	const forceChangedPaths = new Set(options.forceChangedPaths);
	const restartChannelAccounts = /* @__PURE__ */ new Map();
	const plan = {
		changedPaths,
		restartGateway: false,
		restartReasons: [],
		hotReasons: [],
		reloadHooks: false,
		reloadInternalHooks: false,
		restartGmailWatcher: false,
		restartCron: false,
		restartHeartbeat: false,
		reconcileSystemJobs: false,
		reloadPlugins: false,
		restartChannels: /* @__PURE__ */ new Set(),
		restartServices: /* @__PURE__ */ new Set(),
		disposeMcpRuntimes: false,
		restartChannelAccounts,
		noopPaths: []
	};
	for (const path of changedPaths) {
		if (!forceChangedPaths.has(path) && (noopPaths.size > 0 ? noopPaths.has(path) : isPluginInstallTimestampPath(path))) {
			plan.noopPaths.push(path);
			continue;
		}
		const rule = matchRule(path);
		const kind = rule?.kind ?? "restart";
		const isCredentialRotation = rule && AUTH_CREDENTIAL_PATHS.includes(rule.prefix) && canHotReloadGatewayAuthCredentials(options.previousConfig, options.candidateConfig);
		if (kind === "restart" && !isCredentialRotation) {
			plan.restartGateway = true;
			plan.restartReasons.push(path);
			continue;
		}
		if (kind === "none") {
			plan.noopPaths.push(path);
			continue;
		}
		plan.hotReasons.push(path);
		for (const action of rule?.actions ?? []) plan[action] = true;
		if (rule?.replaceChannelPlugins) {
			for (const record of getReloadPolicyCatalog().registry?.plugins ?? []) if (record.channelIds.some((id) => path === "channels" || matchesReloadPrefix(path, `channels.${id}`))) (plan.reloadPluginIds ??= /* @__PURE__ */ new Set()).add(record.id);
		}
		for (const service of rule?.services ?? []) plan.restartServices?.add(service);
		for (const plugin of rule?.channels ?? []) {
			const accountId = rule?.accountScoped ? extractAccountIdFromPath(plugin.id, path) : null;
			if (accountId === null || options.candidateConfig && !isInspectableChannelAccount({
				plugin,
				accountId,
				config: options.candidateConfig
			})) {
				plan.restartChannels.add(plugin.id);
				continue;
			}
			const accounts = restartChannelAccounts.get(plugin.id) ?? /* @__PURE__ */ new Set();
			accounts.add(accountId);
			restartChannelAccounts.set(plugin.id, accounts);
		}
	}
	for (const channel of plan.restartChannels) restartChannelAccounts.delete(channel);
	return plan;
}
//#endregion
export { resolvePluginInstallReloadMetadata as a, resolveConfigReloadMetadata as i, isNoopGatewayReloadPlan as n, diffConfigPaths as o, listConfigReloadRefinementPrefixes as r, diffGatewayReloadPaths as s, buildGatewayReloadPlan as t };
