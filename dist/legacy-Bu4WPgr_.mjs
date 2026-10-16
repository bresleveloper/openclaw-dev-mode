import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import "./utils-DgZn2dLu.mjs";
import { n as DEFAULT_GATEWAY_PORT } from "./paths-DGIwWbpu.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as findNormalizedProviderKey } from "./provider-id-D1VImdKk.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { l as tryResolveSoleAgentId, n as listAgentEntries, t as hasAgentRosterProperty } from "./agent-roster-BXD1uMJD.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-Cwkw6Ed6.mjs";
import "./workspace-default-BKv26wgx.mjs";
import { r as copyConfigResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { t as applyImplicitAgentRosterDefaults } from "./implicit-agent-roster-D39ONJLa.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-dGf2LeNv.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { t as normalizeRouteBindingChannelId } from "./binding-scope-uGqaW78p.mjs";
import { a as getRetainedLegacyDefaultAgentId, o as setRetainedLegacyDefaultAgentId, r as retainLegacyDefaultAgentId } from "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { n as projectLegacyAgentRosterEntries, t as parseLegacyAgentRoster } from "./legacy.roster-D0lEOcPT.mjs";
import { S as mapLegacyAudioTranscription, b as defineLegacyConfigMigration, x as ensureRecord } from "./codex-route-model-ref-CA8y5Vff.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-C81nk32q.mjs";
import { n as parseToolsBySenderTypedKey } from "./types.tools-YIeKpsiJ.mjs";
import { a as visitAgentEntries, i as visitAgentConfigScopes, n as moveLegacyConfigKey, o as visitChannelEntries, r as someAgentEntry, t as deleteRetiredPath } from "./legacy-config-record-shared-C4da1YWQ.mjs";
import { n as resolveProviderToolPolicy, r as resolveProviderToolPolicyEntry, t as normalizeToolProviderPolicyKey } from "./provider-tool-policy-CQtosRma.mjs";
import { t as DEFAULT_SANDBOX_BROWSER_NETWORK } from "./browser-network-BG6jdrVm.mjs";
import { i as isKnownCoreToolId, s as resolveCoreToolProfilePolicy } from "./tool-catalog-DyHnjiiS.mjs";
import { c as normalizeToolList, o as expandToolGroups } from "./tool-policy-shared-DWHChhWM.mjs";
import { r as createToolPolicyMatcher, s as isToolAllowedByPolicyName } from "./tool-policy-match-Dn8gpf-E.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-BKvvmcQR.mjs";
import { t as mergeMissing } from "./merge-missing-BwFrTcSb.mjs";
import { i as isGatewayNonLoopbackBindMode, o as resolveGatewayPortWithDefault, r as hasConfiguredControlUiAllowedOrigins, t as buildDefaultControlUiAllowedOrigins } from "./gateway-control-ui-origins-WhL6Lrby.mjs";
import { n as isKnownCliMcpTypeAlias, t as canonicalizeConfiguredMcpServer } from "./mcp-config-normalize-DQmvZkAl.mjs";
import { t as LEGACY_CONFIG_MIGRATIONS_RUNTIME_MODELS } from "./legacy-config-migrations.runtime.models-B2N4IUON.mjs";
import { n as normalizeConfiguredMemoryExtraPaths } from "./config-utils-DnfHy8-v.mjs";
import { s as resolveExactExecModeFromPolicy } from "./exec-approvals-core-s7tTQC_a.mjs";
import { t as normalizeExactAllowedHost } from "./exact-hostname-B5MIU7_E.mjs";
import { t as parseDurationMs } from "./parse-duration-C4JaJvt9.mjs";
import { c as isToolPolicyPath, n as TASK_SUGGESTION_TOOL_NAME_MIGRATION, o as migrateLegacyToolNamePolicies, r as findLegacyToolNamePaths, s as TOOL_POLICY_ROOTS, t as IMAGE_INSPECTION_TOOL_NAME_MIGRATION } from "./legacy-tool-name-migration-hwNf4VK8.mjs";
import { i as normalizeTalkSection, r as normalizeTalkRealtimeConfig } from "./talk-tTHQncKV.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/legacy.default-agent-roles.ts
function isChannelWideBinding(binding, channelId) {
	const match = binding.match;
	return isRecord(match) && normalizeRouteBindingChannelId(typeof match.channel === "string" ? match.channel : void 0) === channelId && (typeof match.accountId === "string" ? match.accountId.trim() : void 0) === "*" && match.peer === void 0 && !normalizeOptionalString(match.guildId) && !normalizeOptionalString(match.teamId) && (!Array.isArray(match.roles) || match.roles.length === 0);
}
function listUnboundAmbientChannelIds(cfg, ambientChannelIds) {
	if (cfg.bindings && !Array.isArray(cfg.bindings)) return [];
	const bindings = (cfg.bindings ?? []).filter((binding) => isRecord(binding) && binding.type !== "acp");
	const channels = new Set(ambientChannelIds.map(normalizeRouteBindingChannelId).filter((id) => Boolean(id)));
	if (isRecord(cfg.channels)) for (const [id, value] of Object.entries(cfg.channels)) {
		const channelId = normalizeRouteBindingChannelId(id);
		if (channelId && !isChannelConfigMetadataKey(id) && (!isRecord(value) || value.enabled !== false)) channels.add(channelId);
	}
	return [...channels].toSorted().filter((channelId) => !bindings.some((binding) => isChannelWideBinding(binding, channelId)));
}
/** Preserve a legacy workspace locator without assigning any runtime ownership. */
function resolveLegacyAgentWorkspacePin(defaultWorkspace, entry, options = {}) {
	return !Object.hasOwn(entry, "workspace") || typeof entry.workspace === "string" && entry.workspace.trim().length === 0 ? normalizeOptionalString(defaultWorkspace) ?? resolveDefaultAgentWorkspaceDir(options.env, options.homedir) : void 0;
}
function resolveLegacyFirstAgentWorkspacePin(agents, entries, options = {}) {
	return agents.ownership === void 0 && entries.length > 1 && entries.every((entry) => !Object.hasOwn(entry, "default") || entry.default === false) ? resolveLegacyAgentWorkspacePin(isRecord(agents.defaults) ? agents.defaults.workspace : void 0, entries[0], options) : void 0;
}
function materializeLegacyDefaultAgentRoles(cfg, legacyDefaultAgentId, options = {}) {
	const agentId = normalizeAgentId(legacyDefaultAgentId);
	let next = cfg;
	const insertedPaths = [];
	if (options.materializeWorkspace) {
		const entries = { ...next.agents?.entries };
		const entryKey = Object.keys(entries).find((candidate) => normalizeAgentId(candidate) === agentId);
		const entry = entryKey ? entries[entryKey] : void 0;
		const workspace = entry ? resolveLegacyAgentWorkspacePin(next.agents?.defaults?.workspace, entry, options) : void 0;
		if (entryKey && entry && workspace !== void 0) {
			entries[entryKey] = {
				...entry,
				workspace
			};
			next = {
				...next,
				agents: {
					...next.agents,
					entries
				}
			};
			insertedPaths.push([
				"agents",
				"entries",
				entryKey,
				"workspace"
			]);
		}
	}
	const channels = listUnboundAmbientChannelIds(cfg, options.ambientChannelIds ?? []);
	if (channels.length > 0) {
		next = {
			...next,
			bindings: [...Array.isArray(next.bindings) ? next.bindings : [], ...channels.map((channel) => ({
				agentId,
				match: {
					channel,
					accountId: "*"
				}
			}))]
		};
		insertedPaths.push(["bindings"]);
	}
	const rawDefaults = cfg.agents?.defaults;
	const defaults = isRecord(rawDefaults) ? rawDefaults : void 0;
	if (rawDefaults === void 0 || defaults) {
		const soleFallback = normalizeAgentId(tryResolveSoleAgentId(cfg) ?? "main");
		const unset = (key) => defaults?.[key] === void 0 || isRecord(defaults[key]) && !Object.hasOwn(defaults[key], "agentId");
		const materializedDefaults = { ...defaults };
		let changed = false;
		const materialize = (key, enabled) => {
			if (!enabled) return;
			materializedDefaults[key] = {
				...isRecord(materializedDefaults[key]) ? materializedDefaults[key] : {},
				agentId
			};
			insertedPaths.push([
				"agents",
				"defaults",
				key,
				"agentId"
			]);
			changed = true;
		};
		materialize("heartbeat", !listAgentEntries(cfg).some((entry) => entry.heartbeat) && defaults?.heartbeat === void 0);
		materialize("systemAgent", unset("systemAgent"));
		materialize("authInheritance", agentId !== soleFallback && unset("authInheritance"));
		materialize("sessionStore", options.materializeSessionStore !== false && !isPerAgentSessionStoreConfig(cfg.session?.store) && unset("sessionStore"));
		if (changed) next = {
			...next,
			agents: {
				...next.agents,
				defaults: materializedDefaults
			}
		};
	}
	const talk = isRecord(cfg.talk) ? cfg.talk : void 0;
	if ((cfg.talk === void 0 || talk) && (!talk || !Object.hasOwn(talk, "agentId"))) {
		next = {
			...next,
			talk: {
				...talk,
				agentId
			}
		};
		insertedPaths.push(["talk", "agentId"]);
	}
	return {
		config: next,
		insertedPaths
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.entries.ts
function migrateAgentEntries(raw, changes, context) {
	const agents = asNullableRecord(raw.agents);
	if (!agents || !Object.prototype.propertyIsEnumerable.call(agents, "list") || !Array.isArray(agents.list)) return;
	if (Object.hasOwn(agents, "entries")) {
		if (asNullableRecord(agents.entries)) {
			delete agents.list;
			changes.push("Removed agents.list because canonical agents.entries is already set.");
		}
		return;
	}
	const projected = projectLegacyAgentRosterEntries(agents.list);
	changes.push(...projected.diagnostics);
	const orderedEntries = projected.entries.map(({ config }) => config);
	const workspace = resolveLegacyFirstAgentWorkspacePin(agents, orderedEntries, context);
	if (workspace !== void 0) orderedEntries[0].workspace = workspace;
	agents.entries = Object.fromEntries(projected.entries.map(({ id, config }) => [id, config]));
	delete agents.list;
	Object.assign(raw, applyImplicitAgentRosterDefaults(raw));
	changes.push("Moved agents.list → keyed agents.entries.");
}
/** Writers preserve existing responsibilities; Doctor uses the retired marker's original owner. */
function retireLegacyAgentDefaultMarkers(raw) {
	const agents = asNullableRecord(asNullableRecord(raw)?.agents);
	const entries = asNullableRecord(agents?.entries);
	if (!agents || !entries) return;
	const roster = [];
	for (const [id, value] of Object.entries(entries)) {
		const entry = asNullableRecord(value);
		if (!entry || Object.hasOwn(entry, "default") && typeof entry.default !== "boolean") return;
		roster.push([id, entry]);
	}
	const marked = roster.filter(([, entry]) => entry.default === true);
	if (marked.length > 1 || marked.length > 0 && agents.ownership === "explicit") return;
	const changes = [];
	const canonicalEntries = Object.fromEntries(roster.map(([id, entry]) => {
		if (!Object.hasOwn(entry, "default")) return [id, entry];
		const { default: _marker, ...canonical } = entry;
		changes.push("Removed retired agents.entries default marker.");
		return [id, canonical];
	}));
	const config = changes.length > 0 ? {
		...raw,
		agents: {
			...agents,
			entries: canonicalEntries
		}
	} : raw;
	copyConfigResolutionFacts(raw, config);
	return {
		config,
		changes,
		agentCount: roster.length,
		legacyOwner: roster.length > 1 ? marked[0]?.[0] : void 0
	};
}
const LEGACY_AGENT_ROSTER_RULES = [{
	path: ["agents", "list"],
	match: (_value, root) => Object.prototype.propertyIsEnumerable.call(asNullableRecord(root.agents), "list"),
	message: "agents.list moved to keyed agents.entries. Run \"openclaw doctor --fix\"."
}, {
	path: ["agents", "entries"],
	match: (value) => Object.values(asNullableRecord(value) ?? {}).some((entry) => {
		const record = asNullableRecord(entry);
		return record !== null && typeof record.default === "boolean";
	}),
	message: "Legacy agents.entries default markers need explicit surface owners. Run \"openclaw doctor --fix\"."
}];
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_ENTRIES = [defineLegacyConfigMigration({
	id: "runtime.agents-entries",
	describe: "Move agent arrays to keyed entries",
	legacyRules: LEGACY_AGENT_ROSTER_RULES,
	apply: migrateAgentEntries
}), defineLegacyConfigMigration({
	id: "runtime.agents-explicit-ownership",
	describe: "Persist canonical roster and per-surface ownership",
	apply: (raw, changes, context) => {
		const retired = retireLegacyAgentDefaultMarkers(raw);
		if (!retired) return;
		Object.assign(raw, retired.config);
		const { legacyOwner } = retired;
		if (legacyOwner) {
			const materialized = materializeLegacyDefaultAgentRoles(raw, legacyOwner, {
				...context,
				materializeWorkspace: true
			});
			Object.assign(raw, materialized.config);
			retainLegacyDefaultAgentId(raw, legacyOwner);
			changes.push("Preserved legacy per-surface agent ownership and workspace.");
		}
		const nextAgents = asNullableRecord(raw.agents);
		changes.push(...retired.changes);
		if (retired.agentCount < 2 || nextAgents.ownership !== void 0) return;
		nextAgents.ownership = "explicit";
		changes.push("Stamped the multi-agent roster for explicit per-surface ownership.");
	}
})];
//#endregion
//#region src/commands/doctor/shared/legacy-tools-by-sender.ts
const migrationMessage = "Untyped toolsBySender keys are retired. Run \"openclaw doctor --fix\" to migrate them to id: entries.";
const channelSchemas = new Map(GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.map(({ channelId, schema }) => [channelId, schema]));
function* channelPolicyScopes(value, schema, path) {
	const parent = asNullableRecord(value);
	const node = asNullableRecord(schema);
	if (!parent || !node) return;
	const properties = asNullableRecord(node.properties);
	if (asNullableRecord(properties?.toolsBySender)) yield {
		parent,
		path
	};
	for (const [key, child] of Object.entries(parent)) if (key !== "toolsBySender") yield* channelPolicyScopes(child, properties?.[key] ?? node.additionalProperties, `${path}.${key}`);
	for (const union of [
		node.anyOf,
		node.oneOf,
		node.allOf
	]) for (const variant of Array.isArray(union) ? union : []) yield* channelPolicyScopes(parent, variant, path);
}
function* legacySenderMaps(value) {
	const raw = asNullableRecord(value);
	if (!raw) return;
	const scopes = [{
		parent: raw.tools,
		path: "tools"
	}];
	visitAgentConfigScopes(raw, (entry, path) => {
		scopes.push({
			parent: entry.tools,
			path: `${path}.tools`
		});
	});
	for (const [channelId, config] of Object.entries(asNullableRecord(raw.channels) ?? {})) for (const scope of channelPolicyScopes(config, channelSchemas.get(channelId), `channels.${channelId}`)) scopes.push(scope);
	const seen = /* @__PURE__ */ new Set();
	for (const scope of scopes) {
		const parent = asNullableRecord(scope.parent);
		const policies = asNullableRecord(parent?.toolsBySender);
		if (!parent || !policies || seen.has(parent)) continue;
		seen.add(parent);
		const keys = Object.keys(policies).filter((key) => key.trim() !== "*" && !parseToolsBySenderTypedKey(key));
		if (keys.length > 0) yield {
			parent,
			policies,
			path: `${scope.path}.toolsBySender`,
			keys
		};
	}
}
function collectLegacyToolsBySenderIssues(raw) {
	return Array.from(legacySenderMaps(raw)).flatMap(({ path, keys }) => keys.map((key) => ({
		path: `${path}.${key}`,
		message: migrationMessage
	})));
}
const LEGACY_CONFIG_MIGRATION_TOOLS_BY_SENDER = {
	id: "toolsBySender.typed-keys",
	describe: "Migrate untyped sender tool policies before config validation",
	legacyRules: [{
		path: [],
		match: (raw) => !legacySenderMaps(raw).next().done,
		message: migrationMessage
	}],
	apply(raw, changes) {
		for (const { parent, policies, path, keys } of legacySenderMaps(raw)) {
			const migrated = /* @__PURE__ */ new Map();
			let collisions = 0;
			let emptyKeys = 0;
			for (const [rawKey, policy] of Object.entries(policies)) {
				const trimmed = rawKey.trim();
				const typed = parseToolsBySenderTypedKey(trimmed);
				const senderId = (typed?.type === "id" ? typed.value : trimmed.replace(/^@/, "")).trim();
				if (!typed && !senderId) {
					emptyKeys++;
					continue;
				}
				const identity = typed?.type === "id" || !typed && trimmed !== "*" ? `id:${senderId.toLowerCase()}` : rawKey;
				const key = !typed && trimmed !== "*" ? `id:${senderId}` : rawKey;
				if (migrated.has(identity)) collisions++;
				else migrated.set(identity, [key, policy]);
			}
			parent.toolsBySender = Object.fromEntries(migrated.values());
			changes.push(`${path}: migrated ${keys.length - emptyKeys} untyped sender key(s) to id: entries.` + (collisions > 0 ? ` Kept the first matching policy for ${collisions} shadowed key(s); original entries remain in the config backup.` : ""));
			if (emptyKeys > 0) changes.push(`${path}: removed ${emptyKeys} empty untyped sender key(s) that matched no sender; original entries remain in the config backup.`);
		}
	}
};
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.audio.ts
function applyLegacyAudioTranscriptionModel(raw, source, changes) {
	const mapped = mapLegacyAudioTranscription(source);
	if (!mapped) {
		changes.push("Removed audio.transcription (invalid or empty command).");
		return;
	}
	const tools = ensureRecord(raw, "tools");
	const media = ensureRecord(tools, "media");
	const mediaAudio = ensureRecord(media, "audio");
	const models = Array.isArray(media.models) ? media.models : [];
	const isAudioCompatible = (value) => {
		const model = asNullableRecord(value);
		return model !== null && (!Array.isArray(model.capabilities) || model.capabilities.includes("audio"));
	};
	if (!(Array.isArray(mediaAudio.models) && mediaAudio.models.some(isAudioCompatible) || models.some(isAudioCompatible))) {
		mediaAudio.enabled = true;
		mediaAudio.preferredModel = typeof mapped.command === "string" ? `cli:${mapped.command}` : void 0;
		media.models = [...models, {
			...mapped,
			capabilities: ["audio"]
		}];
		changes.push("Moved audio.transcription → tools.media.models.");
		return;
	}
	changes.push("Removed audio.transcription (tools.media.models already set).");
}
/** Legacy config migration specs for audio/tool media config. */
const LEGACY_CONFIG_MIGRATIONS_AUDIO = [defineLegacyConfigMigration({
	id: "audio.transcription-v2",
	describe: "Move audio.transcription to tools.media.models",
	legacyRules: [{
		path: ["audio", "transcription"],
		message: "Use a capability-tagged tools.media.models entry instead."
	}],
	apply: (raw, changes) => {
		const audio = asNullableRecord(raw.audio);
		if (audio?.transcription === void 0) return;
		applyLegacyAudioTranscriptionModel(raw, audio.transcription, changes);
		delete audio.transcription;
		if (Object.keys(audio).length === 0) delete raw.audio;
	}
})];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.channels.ts
function hasLegacyThreadBindingSpawnSplit(value) {
	const threadBindings = asNullableRecord(value);
	return Boolean(threadBindings && (Object.hasOwn(threadBindings, "spawnSubagentSessions") || Object.hasOwn(threadBindings, "spawnAcpSessions")));
}
function resolveMigratedSpawnSessions(threadBindings) {
	const subagent = threadBindings.spawnSubagentSessions;
	const acp = threadBindings.spawnAcpSessions;
	const subagentBool = typeof subagent === "boolean" ? subagent : void 0;
	const acpBool = typeof acp === "boolean" ? acp : void 0;
	if (subagentBool === void 0) return acpBool;
	if (acpBool === void 0) return subagentBool;
	return subagentBool && acpBool;
}
function migrateThreadBindingsSpawnSessionsForPath(params) {
	const threadBindings = asNullableRecord(params.owner.threadBindings);
	if (!threadBindings || !hasLegacyThreadBindingSpawnSplit(threadBindings)) return;
	const hadSpawnSessions = threadBindings.spawnSessions !== void 0;
	const resolved = resolveMigratedSpawnSessions(threadBindings);
	const oldSubagent = threadBindings.spawnSubagentSessions;
	const oldAcp = threadBindings.spawnAcpSessions;
	delete threadBindings.spawnSubagentSessions;
	delete threadBindings.spawnAcpSessions;
	if (!hadSpawnSessions && resolved !== void 0) threadBindings.spawnSessions = resolved;
	if (hadSpawnSessions) params.changes.push(`Removed deprecated ${params.pathPrefix}.threadBindings.spawnSubagentSessions/spawnAcpSessions (${params.pathPrefix}.threadBindings.spawnSessions already set).`);
	else if (typeof oldSubagent === "boolean" && typeof oldAcp === "boolean" && oldSubagent !== oldAcp) params.changes.push(`Collapsed conflicting ${params.pathPrefix}.threadBindings.spawnSubagentSessions/spawnAcpSessions → ${params.pathPrefix}.threadBindings.spawnSessions (${String(resolved)}).`);
	else params.changes.push(`Moved ${params.pathPrefix}.threadBindings.spawnSubagentSessions/spawnAcpSessions → ${params.pathPrefix}.threadBindings.spawnSessions (${String(resolved)}).`);
}
function hasLegacyThreadBindingInAnyChannel(value) {
	const channels = asNullableRecord(value);
	if (!channels) return false;
	return Object.values(channels).some((entry) => {
		const channel = asNullableRecord(entry);
		if (!channel) return false;
		return hasLegacyThreadBindingSpawnSplit(channel.threadBindings) || Object.values(asNullableRecord(channel.accounts) ?? {}).some((account) => hasLegacyThreadBindingSpawnSplit(asNullableRecord(account)?.threadBindings));
	});
}
/** Legacy config migration specs for channel-owned compatibility keys. */
const LEGACY_CONFIG_MIGRATIONS_CHANNELS = [defineLegacyConfigMigration({
	id: "thread-bindings.spawn-sessions",
	describe: "Consolidate thread session spawning flags (session + channel configs)",
	legacyRules: [{
		path: ["session", "threadBindings"],
		message: "session.threadBindings.spawnSubagentSessions/spawnAcpSessions were replaced by session.threadBindings.spawnSessions. Run \"openclaw doctor --fix\".",
		match: hasLegacyThreadBindingSpawnSplit
	}, {
		path: ["channels"],
		message: "channels.<id>.threadBindings.spawnSubagentSessions/spawnAcpSessions were replaced by channels.<id>.threadBindings.spawnSessions. Run \"openclaw doctor --fix\".",
		match: hasLegacyThreadBindingInAnyChannel
	}],
	apply: (raw, changes) => {
		const session = asNullableRecord(raw.session);
		if (session) migrateThreadBindingsSpawnSessionsForPath({
			owner: session,
			pathPrefix: "session",
			changes
		});
		const channels = asNullableRecord(raw.channels);
		if (!channels) return;
		for (const channelId of Object.keys(channels)) visitChannelEntries(raw, channelId, (owner, pathPrefix) => {
			migrateThreadBindingsSpawnSessionsForPath({
				owner,
				pathPrefix,
				changes
			});
		});
	}
})];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.qqbot-account.ts
function hasEnvironmentValue(name) {
	return Boolean(process.env[name]?.trim());
}
function shouldCreateEnvironmentOnlyQQBotConfig(raw) {
	const channels = asNullableRecord(raw.channels);
	return Boolean((raw.channels === void 0 || channels) && !asNullableRecord(channels?.qqbot) && hasEnvironmentValue("QQBOT_APP_ID") && hasEnvironmentValue("QQBOT_CLIENT_SECRET"));
}
function listQQBotConfigEntries(qqbot) {
	const rootSnapshot = structuredClone(qqbot);
	const entries = [{
		entry: qqbot,
		path: "channels.qqbot"
	}];
	const accounts = asNullableRecord(qqbot.accounts);
	if (!accounts) return entries;
	for (const [accountId, accountValue] of Object.entries(accounts)) {
		const account = asNullableRecord(accountValue);
		if (account) entries.push({
			entry: account,
			path: `channels.qqbot.accounts.${accountId}`,
			aliasSuffix: accountId,
			inheritedEntry: accountId === "default" ? rootSnapshot : void 0
		});
	}
	return entries;
}
function migrateDefaultAccount(qqbot, changes) {
	const accounts = asNullableRecord(qqbot.accounts);
	const configuredDefaultAccount = typeof qqbot.defaultAccount === "string" ? qqbot.defaultAccount.trim() : "";
	const normalizedDefaultAccount = configuredDefaultAccount.toLowerCase();
	const defaultAccount = asNullableRecord(accounts?.default);
	if (configuredDefaultAccount && normalizedDefaultAccount !== "default") {
		const selectedAccountId = normalizedDefaultAccount;
		const selectedAccount = asNullableRecord(accounts?.[selectedAccountId]);
		if (!selectedAccount) {
			delete qqbot.defaultAccount;
			changes.push(`Removed invalid channels.qqbot.defaultAccount=${configuredDefaultAccount}; the bundled plugin already fell back to its normal account selection order.`);
			return;
		}
		if (qqbot.appId || hasEnvironmentValue("QQBOT_APP_ID") || defaultAccount) return;
		const reorderedAccounts = { [selectedAccountId]: selectedAccount };
		for (const [accountId, account] of Object.entries(accounts ?? {})) if (accountId !== selectedAccountId && !isBlockedObjectKey(accountId)) reorderedAccounts[accountId] = account;
		if (Object.keys(reorderedAccounts)[0] !== selectedAccountId) return;
		qqbot.accounts = reorderedAccounts;
		delete qqbot.defaultAccount;
		changes.push(`Moved channels.qqbot.accounts.${selectedAccountId} to the first account position and removed defaultAccount so Tencent QQBot 2.0 preserves the selected named default.`);
		return;
	}
	if (!accounts || !defaultAccount) {
		if (Object.hasOwn(qqbot, "defaultAccount")) {
			delete qqbot.defaultAccount;
			changes.push("Removed channels.qqbot.defaultAccount=default because Tencent QQBot 2.0 selects the root account directly.");
		}
		return;
	}
	for (const [key, value] of Object.entries(defaultAccount)) if (key !== "accounts" && !isBlockedObjectKey(key)) qqbot[key] = value;
	delete accounts.default;
	if (Object.keys(accounts).length === 0) delete qqbot.accounts;
	delete qqbot.defaultAccount;
	changes.push("Moved channels.qqbot.accounts.default overrides to channels.qqbot for Tencent QQBot 2.0 default-account resolution.");
}
function normalizeProviderAliasSegment(value) {
	return value.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "account";
}
function isMatchingFileProvider(value, filePath) {
	const provider = asNullableRecord(value);
	return Boolean(provider && provider.source === "file" && provider.path === filePath && provider.mode === "singleValue");
}
function allocateFileProviderAlias(params) {
	let secrets = asNullableRecord(params.raw.secrets);
	if (!secrets) {
		if (params.raw.secrets !== void 0) return;
		secrets = {};
		params.raw.secrets = secrets;
	}
	let providers = asNullableRecord(secrets.providers);
	if (!providers) {
		if (secrets.providers !== void 0) return;
		providers = {};
		secrets.providers = providers;
	}
	const base = `qqbot${params.aliasSuffix ? `-${normalizeProviderAliasSegment(params.aliasSuffix)}` : ""}-client-secret`.slice(0, 60).replace(/-+$/g, "");
	for (let index = 1; index <= 999; index += 1) {
		const alias = index === 1 ? base : `${base.slice(0, 60 - String(index).length)}-${index}`;
		const existing = providers[alias];
		if (existing === void 0) {
			providers[alias] = {
				source: "file",
				path: params.filePath,
				mode: "singleValue"
			};
			return alias;
		}
		if (isMatchingFileProvider(existing, params.filePath)) return alias;
	}
}
function migrateClientSecretFile(params) {
	if (!Object.hasOwn(params.entry, "clientSecretFile")) return;
	if (params.entry.clientSecret !== void 0) {
		delete params.entry.clientSecretFile;
		params.changes.push(`Removed ${params.path}.clientSecretFile (${params.path}.clientSecret already set).`);
		return;
	}
	const filePath = typeof params.entry.clientSecretFile === "string" ? params.entry.clientSecretFile.trim() : "";
	if (!filePath) {
		params.entry.enabled = false;
		delete params.entry.clientSecretFile;
		params.changes.push(`Removed invalid ${params.path}.clientSecretFile and disabled this QQBot account.`);
		return;
	}
	const provider = allocateFileProviderAlias({
		raw: params.raw,
		filePath,
		aliasSuffix: params.aliasSuffix
	});
	if (!provider) {
		params.entry.enabled = false;
		params.changes.push(`Disabled ${params.path} because its clientSecretFile could not be migrated while secrets.providers has an incompatible shape.`);
		return;
	}
	params.entry.clientSecret = {
		source: "file",
		provider,
		id: "value"
	};
	delete params.entry.clientSecretFile;
	params.changes.push(`Moved ${params.path}.clientSecretFile → ${params.path}.clientSecret using file provider ${provider}.`);
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.qqbot.ts
const APPROVALS_DISABLED_SENTINEL = "openclaw:approval-disabled";
function hasQQBotEntryMatching(value, predicate) {
	const qqbot = asNullableRecord(value);
	return Boolean(qqbot && listQQBotConfigEntries(qqbot).some(({ entry, inheritedEntry }) => predicate(entry, inheritedEntry)));
}
function normalizeIds(value) {
	if (!Array.isArray(value)) return [];
	return [...new Set(value.filter((item) => ["string", "number"].includes(typeof item)).map((item) => String(item).trim()).filter(Boolean))];
}
function normalizeLegacyAllowFrom(value) {
	return [...new Set(normalizeIds(value).map((id) => {
		const unprefixed = id.replace(/^qqbot:/i, "");
		if (unprefixed === "*" || unprefixed === APPROVALS_DISABLED_SENTINEL) return unprefixed;
		return unprefixed.toUpperCase();
	}))];
}
function resolveLegacyQQBotCommandsAllowFrom(raw) {
	const commands = asNullableRecord(raw.commands);
	const allowFrom = asNullableRecord(commands?.allowFrom);
	if (!allowFrom) return;
	if (Array.isArray(allowFrom.qqbot)) return normalizeLegacyAllowFrom(allowFrom.qqbot);
	return Array.isArray(allowFrom["*"]) ? normalizeLegacyAllowFrom(allowFrom["*"]) : void 0;
}
function hasConfiguredFilter(value) {
	return Array.isArray(value) ? value.length > 0 : value !== void 0;
}
function migrateExecApprovals(params) {
	const hasOwnLegacyConfig = Object.hasOwn(params.entry, "execApprovals");
	const hasLegacyConfig = hasOwnLegacyConfig || params.inheritedEntry?.execApprovals !== void 0;
	const hasOwnPolicyOverride = hasOwnLegacyConfig || Object.hasOwn(params.entry, "allowFrom") || Object.hasOwn(params.entry, "dmPolicy");
	if (params.inheritedEntry && !hasOwnPolicyOverride) return;
	const legacy = asNullableRecord(hasOwnLegacyConfig ? params.entry.execApprovals : params.inheritedEntry?.execApprovals);
	const allowFromValue = Object.hasOwn(params.entry, "allowFrom") ? params.entry.allowFrom : params.inheritedEntry?.allowFrom;
	const dmPolicy = Object.hasOwn(params.entry, "dmPolicy") ? params.entry.dmPolicy : params.inheritedEntry?.dmPolicy;
	const existingAllowFrom = normalizeLegacyAllowFrom(allowFromValue);
	const explicitApprovers = normalizeLegacyAllowFrom(legacy?.approvers);
	const allowFromWasOpen = existingAllowFrom.length === 0 || existingAllowFrom.includes("*");
	const preserveOpenDm = dmPolicy === "open" || dmPolicy === void 0 && allowFromWasOpen || dmPolicy === "allowlist" && existingAllowFrom.includes("*");
	if (!hasLegacyConfig) {
		if (params.commandsAllowFrom !== void 0) {
			const commandApprovers = params.commandsAllowFrom.filter((id) => id !== "*");
			const restrictiveChatAllowFrom = new Set(existingAllowFrom.filter((id) => id !== "*"));
			const safeApprovers = existingAllowFrom.length > 0 && !existingAllowFrom.includes("*") ? commandApprovers.filter((id) => restrictiveChatAllowFrom.has(id)) : commandApprovers;
			const nextAllowFrom = safeApprovers.length > 0 ? safeApprovers : [APPROVALS_DISABLED_SENTINEL];
			const needsOpenDm = preserveOpenDm && dmPolicy !== "open";
			if (existingAllowFrom.length === nextAllowFrom.length && existingAllowFrom.every((id, index) => id === nextAllowFrom[index]) && !needsOpenDm) return;
			params.entry.allowFrom = nextAllowFrom;
			if (needsOpenDm) params.entry.dmPolicy = "open";
			params.changes.push(`Secured ${params.path}.allowFrom for Tencent QQBot 2.0 native approvals using the previous commands.allowFrom operator list${safeApprovers.length > 0 ? " intersected with restrictive chat access" : "; no safely representable operator remained, so approvals were locked"}.`);
			return;
		}
		if (!allowFromWasOpen) return;
		const explicitAllowFrom = existingAllowFrom.filter((id) => id !== "*");
		params.entry.allowFrom = explicitAllowFrom.length > 0 ? explicitAllowFrom : [APPROVALS_DISABLED_SENTINEL];
		if (preserveOpenDm) params.entry.dmPolicy = "open";
		params.changes.push(`Secured ${params.path}.allowFrom for Tencent QQBot 2.0 native approvals; wildcard/empty approval access was replaced with ${explicitAllowFrom.length > 0 ? "the existing explicit IDs" : "a non-matching marker"} while preserving open DM access separately.`);
		return;
	}
	const hasUnsupportedPolicy = !legacy || legacy.enabled === false || hasConfiguredFilter(legacy.agentFilter) || hasConfiguredFilter(legacy.sessionFilter) || legacy.target !== void 0;
	let nextAllowFrom;
	let reason;
	if (hasUnsupportedPolicy || explicitApprovers.includes("*")) {
		nextAllowFrom = [APPROVALS_DISABLED_SENTINEL];
		reason = "the Tencent 2.0 plugin cannot represent the previous approval policy, so native approval actions were locked";
	} else if (explicitApprovers.length > 0) {
		const restrictiveAllowFrom = new Set(existingAllowFrom.filter((id) => id !== "*"));
		nextAllowFrom = dmPolicy === "allowlist" && existingAllowFrom.length === 0 ? [] : existingAllowFrom.length > 0 && !existingAllowFrom.includes("*") ? explicitApprovers.filter((id) => restrictiveAllowFrom.has(id)) : explicitApprovers;
		if (nextAllowFrom.length === 0) {
			nextAllowFrom = [APPROVALS_DISABLED_SENTINEL];
			reason = "the approval and chat allowlists did not overlap, so native approval actions were locked";
		} else reason = "approval access was intersected with the existing chat allowlist";
	} else if (existingAllowFrom.length > 0 && !existingAllowFrom.includes("*")) {
		nextAllowFrom = existingAllowFrom;
		reason = "the existing restrictive chat allowlist remains the approval allowlist";
	} else {
		nextAllowFrom = [APPROVALS_DISABLED_SENTINEL];
		reason = "the previous same-chat or wildcard policy has no safe Tencent 2.0 representation, so native approval actions were locked";
	}
	if (preserveOpenDm && !nextAllowFrom.includes("*")) params.entry.dmPolicy = "open";
	params.entry.allowFrom = nextAllowFrom;
	delete params.entry.execApprovals;
	params.changes.push(`Moved ${params.path}.execApprovals → ${params.path}.allowFrom; ${reason}. Review chat access before re-enabling broader approval access.`);
}
function migrateAllowFrom(params) {
	const current = normalizeIds(params.entry.allowFrom);
	const normalized = normalizeLegacyAllowFrom(params.entry.allowFrom);
	if (current.every((id, index) => id === normalized[index])) return;
	params.entry.allowFrom = normalized;
	params.changes.push(`Normalized ${params.path}.allowFrom QQBot-prefixed IDs for Tencent QQBot 2.0.`);
}
function hasLegacyStreamingTransport(entry) {
	const streaming = asNullableRecord(entry.streaming);
	return Boolean(streaming && (Object.hasOwn(streaming, "nativeTransport") || Object.hasOwn(streaming, "c2cStreamApi")));
}
function migrateStreamingTransport(params) {
	const streaming = asNullableRecord(params.entry.streaming);
	if (!streaming || !hasLegacyStreamingTransport(params.entry)) return;
	const transport = typeof streaming.nativeTransport === "boolean" ? streaming.nativeTransport : typeof streaming.c2cStreamApi === "boolean" ? streaming.c2cStreamApi : void 0;
	delete streaming.nativeTransport;
	delete streaming.c2cStreamApi;
	if (transport !== void 0) streaming.mode = transport ? "partial" : "off";
	params.changes.push(`Removed unsupported ${params.path}.streaming native transport keys for Tencent QQBot 2.0${transport === void 0 ? "" : ` and set mode=${String(streaming.mode)}`}.`);
}
function mapTencentToolPolicy(value) {
	const policy = asNullableRecord(value);
	const allow = Array.isArray(policy?.allow) ? policy.allow.map(String) : void 0;
	const deny = Array.isArray(policy?.deny) ? policy.deny.map(String) : void 0;
	const allowsAll = !allow || allow.length === 0 || allow.includes("*");
	if (allowsAll && (!deny || deny.length === 0)) return "full";
	if (deny?.length === 1 && deny[0] === "*") return "none";
	if (allowsAll && deny?.length === 3 && [
		"exec",
		"read",
		"write"
	].every((tool) => deny.includes(tool))) return "restricted";
	return "none";
}
function mostRestrictiveTencentToolPolicy(first, second) {
	const rank = {
		none: 0,
		restricted: 1,
		full: 2
	};
	const normalizedFirst = first === "full" || first === "restricted" || first === "none" ? first : "none";
	return rank[normalizedFirst] <= rank[second] ? normalizedFirst : second;
}
function migrateGroupTools(params) {
	const groups = asNullableRecord(params.entry.groups);
	if (!groups) return;
	for (const [groupId, groupValue] of Object.entries(groups)) {
		const group = asNullableRecord(groupValue);
		if (!group || !Object.hasOwn(group, "tools") && !Object.hasOwn(group, "toolsBySender")) continue;
		const groupPath = `${params.path}.groups.${groupId}`;
		const migratedPolicy = Object.hasOwn(group, "toolsBySender") ? "none" : mapTencentToolPolicy(group.tools);
		group.toolPolicy = group.toolPolicy === void 0 ? migratedPolicy : mostRestrictiveTencentToolPolicy(group.toolPolicy, migratedPolicy);
		params.changes.push(`Moved ${groupPath}.tools policy → ${groupPath}.toolPolicy=${String(group.toolPolicy)} for Tencent QQBot 2.0, preserving the most restrictive configured policy.`);
		delete group.tools;
		if (Object.hasOwn(group, "toolsBySender")) {
			delete group.toolsBySender;
			params.changes.push(`Removed ${groupPath}.toolsBySender; Tencent QQBot 2.0 cannot represent sender-specific tool policy, so the group policy was not broadened.`);
		}
	}
}
function hasLegacyGroupCommandLevel(entry) {
	const groups = asNullableRecord(entry.groups);
	return Boolean(groups && Object.values(groups).some((groupValue) => {
		const group = asNullableRecord(groupValue);
		return Boolean(group && Object.hasOwn(group, "commandLevel"));
	}));
}
function migrateGroupCommandLevels(params) {
	const groups = asNullableRecord(params.entry.groups);
	if (!groups) {
		const inheritedGroups = asNullableRecord(params.inheritedEntry?.groups);
		if (Boolean(inheritedGroups && Object.values(inheritedGroups).some((groupValue) => {
			const group = asNullableRecord(groupValue);
			return Boolean(group && Object.hasOwn(group, "commandLevel") && group.commandLevel !== "all");
		})) && params.entry.groupPolicy !== void 0 && params.entry.groupPolicy !== "disabled") {
			params.entry.groupPolicy = "disabled";
			params.changes.push(`Set ${params.path}.groupPolicy=disabled because this default account overrides the root lock while inheriting a safety/strict group command policy that Tencent QQBot 2.0 cannot represent.`);
		}
		return;
	}
	let requiresLock = false;
	for (const [groupId, groupValue] of Object.entries(groups)) {
		const group = asNullableRecord(groupValue);
		if (!group || !Object.hasOwn(group, "commandLevel")) continue;
		const commandLevel = group.commandLevel;
		if (commandLevel !== "all") requiresLock = true;
		delete group.commandLevel;
		params.changes.push(`Removed unsupported ${params.path}.groups.${groupId}.commandLevel=${String(commandLevel)} for Tencent QQBot 2.0.`);
	}
	if (!requiresLock) return;
	params.entry.groupPolicy = "disabled";
	params.changes.push(`Set ${params.path}.groupPolicy=disabled because Tencent QQBot 2.0 cannot represent a previous safety/strict group command policy. Review the account before re-enabling group access.`);
}
const LEGACY_CONFIG_MIGRATIONS_QQBOT = [defineLegacyConfigMigration({
	id: "qqbot.tencent-2.0-compatibility",
	describe: "Migrate bundled QQBot config to Tencent QQBot 2.0 canonical fields",
	legacyRules: [
		{
			path: [],
			message: "Environment-only QQBot credentials need a safe Tencent QQBot 2.0 config shell. Run \"openclaw doctor --fix\".",
			match: (_value, root) => shouldCreateEnvironmentOnlyQQBotConfig(root)
		},
		{
			path: ["channels", "qqbot"],
			message: "QQBot defaultAccount/accounts.default must migrate to Tencent QQBot 2.0 account selection. Run \"openclaw doctor --fix\".",
			match: (value) => {
				const qqbot = asNullableRecord(value);
				return Boolean(qqbot && (Object.hasOwn(qqbot, "defaultAccount") || asNullableRecord(asNullableRecord(qqbot.accounts)?.default)));
			}
		},
		{
			path: ["channels", "qqbot"],
			message: "QQBot clientSecretFile must migrate to a file-backed SecretRef for Tencent QQBot 2.0. Run \"openclaw doctor --fix\".",
			match: (value) => hasQQBotEntryMatching(value, (entry) => Object.hasOwn(entry, "clientSecretFile"))
		},
		{
			path: ["channels", "qqbot"],
			message: "QQBot wildcard/empty allowFrom must be separated from Tencent QQBot 2.0 native approval access. Run \"openclaw doctor --fix\".",
			match: (value) => hasQQBotEntryMatching(value, (entry, inheritedEntry) => {
				if (Object.hasOwn(entry, "execApprovals")) return false;
				const allowFrom = normalizeLegacyAllowFrom(Object.hasOwn(entry, "allowFrom") ? entry.allowFrom : inheritedEntry?.allowFrom);
				return allowFrom.length === 0 || allowFrom.includes("*");
			})
		},
		{
			path: ["channels", "qqbot"],
			message: "QQBot chat allowFrom must be reconciled with the previous commands.allowFrom approval operators for Tencent QQBot 2.0. Run \"openclaw doctor --fix\".",
			match: (value, root) => {
				const commandsAllowFrom = resolveLegacyQQBotCommandsAllowFrom(root);
				if (commandsAllowFrom === void 0) return false;
				const commandApprovers = new Set(commandsAllowFrom.filter((id) => id !== "*"));
				return hasQQBotEntryMatching(value, (entry, inheritedEntry) => {
					if (Object.hasOwn(entry, "execApprovals") || !Object.hasOwn(entry, "allowFrom") && inheritedEntry?.execApprovals !== void 0) return false;
					return normalizeLegacyAllowFrom(Object.hasOwn(entry, "allowFrom") ? entry.allowFrom : inheritedEntry?.allowFrom).filter((id) => id !== "*" && id !== APPROVALS_DISABLED_SENTINEL).some((id) => !commandApprovers.has(id));
				});
			}
		},
		{
			path: ["channels", "qqbot"],
			message: "QQBot groups.*.commandLevel must migrate before Tencent QQBot 2.0 can safely handle group commands. Run \"openclaw doctor --fix\".",
			match: (value) => hasQQBotEntryMatching(value, hasLegacyGroupCommandLevel)
		},
		{
			path: ["channels", "qqbot"],
			message: "QQBot streaming.nativeTransport/c2cStreamApi must migrate to Tencent QQBot 2.0 streaming.mode. Run \"openclaw doctor --fix\".",
			match: (value) => hasQQBotEntryMatching(value, hasLegacyStreamingTransport)
		},
		{
			path: ["channels", "qqbot"],
			message: "QQBot allowFrom IDs must migrate to Tencent QQBot 2.0 canonical uppercase OpenIDs. Run \"openclaw doctor --fix\".",
			match: (value) => hasQQBotEntryMatching(value, (entry) => {
				const current = normalizeIds(entry.allowFrom);
				const normalized = normalizeLegacyAllowFrom(entry.allowFrom);
				return current.length !== normalized.length || current.some((id, index) => id !== normalized[index]);
			})
		},
		{
			path: ["channels", "qqbot"],
			message: "QQBot execApprovals must migrate to Tencent QQBot 2.0 allowFrom semantics. Run \"openclaw doctor --fix\".",
			match: (value) => hasQQBotEntryMatching(value, (entry) => Object.hasOwn(entry, "execApprovals"))
		},
		{
			path: ["channels", "qqbot"],
			message: "QQBot group tools policies must migrate to Tencent QQBot 2.0 toolPolicy. Run \"openclaw doctor --fix\".",
			match: (value) => hasQQBotEntryMatching(value, (entry) => {
				const groups = asNullableRecord(entry.groups);
				return Boolean(groups && Object.values(groups).some((groupValue) => {
					const group = asNullableRecord(groupValue);
					return Boolean(group && (Object.hasOwn(group, "tools") || Object.hasOwn(group, "toolsBySender")));
				}));
			})
		}
	],
	apply: (raw, changes) => {
		let channels = asNullableRecord(raw.channels);
		let qqbot = asNullableRecord(channels?.qqbot);
		if (!qqbot && shouldCreateEnvironmentOnlyQQBotConfig(raw)) {
			channels ??= {};
			raw.channels = channels;
			qqbot = {
				enabled: true,
				dmPolicy: "open",
				allowFrom: [APPROVALS_DISABLED_SENTINEL]
			};
			channels.qqbot = qqbot;
			changes.push("Created channels.qqbot for environment-only Tencent QQBot 2.0 credentials with native approvals locked; no credential value was copied into config.");
		}
		if (!qqbot) return;
		migrateDefaultAccount(qqbot, changes);
		const commandsAllowFrom = resolveLegacyQQBotCommandsAllowFrom(raw);
		for (const item of listQQBotConfigEntries(qqbot)) {
			migrateClientSecretFile({
				raw,
				changes,
				...item
			});
			migrateExecApprovals({
				changes,
				commandsAllowFrom,
				...item
			});
			migrateAllowFrom({
				changes,
				...item
			});
			migrateStreamingTransport({
				changes,
				...item
			});
			migrateGroupTools({
				changes,
				...item
			});
			migrateGroupCommandLevels({
				changes,
				...item
			});
		}
	}
})];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.agents.ts
const LEGACY_MEMORY_SEARCH_FIELD_MAPPINGS = [
	{
		legacyKey: "chunkSize",
		parentKey: "chunking",
		canonicalKey: "tokens"
	},
	{
		legacyKey: "chunkOverlap",
		parentKey: "chunking",
		canonicalKey: "overlap"
	},
	{
		legacyKey: "maxResults",
		parentKey: "query",
		canonicalKey: "maxResults"
	}
];
const MEMORY_SEARCH_RULE = {
	path: ["memorySearch"],
	message: "top-level memorySearch was moved; use memory.search instead. Run \"openclaw doctor --fix\"."
};
const AGENT_MEMORY_SEARCH_OWNER_RULES = [{
	path: [
		"agents",
		"defaults",
		"memorySearch"
	],
	message: "agents.defaults.memorySearch moved to memory.search. Run \"openclaw doctor --fix\"."
}, {
	path: ["agents"],
	message: "agents.entries.*.memorySearch moved to agents.entries.*.memory.search. Run \"openclaw doctor --fix\".",
	match: (value) => someAgentEntry(value, (agent) => agent.memorySearch !== void 0)
}];
const LEGACY_MEMORY_SEARCH_AUTO_PROVIDER_RULES = [
	{
		path: ["memorySearch", "provider"],
		message: "memorySearch.provider = \"auto\" is legacy; use \"openai\" explicitly. Run \"openclaw doctor --fix\".",
		match: isLegacyMemorySearchAutoProvider
	},
	{
		path: [
			"memory",
			"search",
			"provider"
		],
		message: "memory.search.provider = \"auto\" is legacy; use \"openai\" explicitly. Run \"openclaw doctor --fix\".",
		match: isLegacyMemorySearchAutoProvider
	},
	{
		path: ["agents"],
		message: "agents.entries.*.memorySearch.provider = \"auto\" is legacy; use \"openai\" explicitly. Run \"openclaw doctor --fix\".",
		match: (value) => someAgentEntry(value, (agent) => isLegacyMemorySearchAutoProvider(getAgentMemorySearchRecord(agent)?.provider))
	}
];
const LEGACY_MEMORY_SEARCH_FLAT_KEY_RULES = [{
	path: ["memory", "search"],
	message: "memory.search uses legacy flat chunkSize, chunkOverlap, or maxResults fields. Run \"openclaw doctor --fix\".",
	match: hasLegacyMemorySearchFlatKeys
}, {
	path: ["agents"],
	message: "agents.entries.*.memorySearch uses legacy flat chunkSize, chunkOverlap, or maxResults fields. Run \"openclaw doctor --fix\".",
	match: (value) => someAgentEntry(value, (agent) => hasLegacyMemorySearchFlatKeys(getAgentMemorySearchRecord(agent)))
}];
function hasLegacyMemorySearchFlatKeys(value) {
	const memorySearch = asNullableRecord(value);
	return Boolean(memorySearch && LEGACY_MEMORY_SEARCH_FIELD_MAPPINGS.some(({ legacyKey }) => Object.hasOwn(memorySearch, legacyKey)));
}
function getAgentMemorySearchRecord(agent) {
	return asNullableRecord(agent.memorySearch) ?? asNullableRecord(asNullableRecord(agent.memory)?.search);
}
const UNSUPPORTED_SANDBOX_BROWSER_NETWORK_RULES = [{
	path: [
		"agents",
		"defaults",
		"sandbox",
		"browser",
		"network"
	],
	message: "agents.defaults.sandbox.browser.network = \"none\" cannot expose the browser control port. Run \"openclaw doctor --fix\" to disable the sidecar and restore the dedicated browser network.",
	match: isUnsupportedSandboxBrowserNetwork
}, {
	path: ["agents"],
	message: "agents.entries.*.sandbox.browser.network = \"none\" cannot expose the browser control port. Run \"openclaw doctor --fix\" to disable the affected sidecar and restore the dedicated browser network.",
	match: (value) => someAgentEntry(value, (agent) => isUnsupportedSandboxBrowserNetwork(getSandboxBrowserConfig(agent)?.network))
}];
const PROFILE_CONFIGURED_TOOL_SECTION_RULES = [{
	path: ["tools"],
	message: "tools.profile filters explicit configured-section tool grants; run \"openclaw doctor --fix\" to rewrite the explicit grants into a valid allowlist.",
	match: (value) => toolProfileConfiguredSectionsNeedExplicitRepair(value)
}, {
	path: ["agents"],
	message: "agents.entries.*.tools.profile filters explicit configured-section tool grants; run \"openclaw doctor --fix\" to rewrite the explicit grants into a valid allowlist.",
	match: (value, root) => {
		const globalTools = asNullableRecord(root.tools);
		const inheritedProfile = typeof globalTools?.profile === "string" ? globalTools.profile : void 0;
		const inheritedAlsoAllow = readToolPolicyGrantList(globalTools, "alsoAllow");
		return someAgentEntry(value, (agent) => {
			const agentTools = asNullableRecord(agent.tools);
			return toolProfileConfiguredSectionsNeedExplicitRepair(agentTools, inheritedProfile, inheritedAlsoAllow, collectEffectiveConfiguredToolSectionGrants(globalTools, agentTools), asNullableRecord(globalTools?.byProvider));
		});
	}
}];
const SILENT_REPLY_LEGACY_RULES = [{
	path: [
		"agents",
		"defaults",
		"silentReply"
	],
	message: "agents.defaults.silentReply.internal was removed; only channel groups may use NO_REPLY. Run \"openclaw doctor --fix\" to remove it.",
	match: (value) => hasOwnRecordProperty(value, "internal")
}, {
	path: ["surfaces"],
	message: "surfaces.*.silentReply.internal was removed; only channel groups may use NO_REPLY. Run \"openclaw doctor --fix\" to remove it.",
	match: (value) => hasSurfaceLegacySilentReplyPolicy(value)
}];
function isLegacyMemorySearchAutoProvider(value) {
	return typeof value === "string" && value.trim().toLowerCase() === "auto";
}
function migrateLegacyMemorySearchFlatKeys(memorySearch, pathLabel, changes) {
	if (!memorySearch) return;
	for (const { legacyKey, parentKey, canonicalKey } of LEGACY_MEMORY_SEARCH_FIELD_MAPPINGS) {
		if (!Object.hasOwn(memorySearch, legacyKey)) continue;
		const legacyValue = memorySearch[legacyKey];
		if (memorySearch[parentKey] === void 0) {
			memorySearch[parentKey] = { [canonicalKey]: legacyValue };
			changes.push(`Moved ${pathLabel}.${legacyKey} → ${pathLabel}.${parentKey}.${canonicalKey}.`);
			delete memorySearch[legacyKey];
			continue;
		}
		const canonicalParent = asNullableRecord(memorySearch[parentKey]);
		if (!canonicalParent) changes.push(`Removed ${pathLabel}.${legacyKey} (${pathLabel}.${parentKey} already set).`);
		else if (canonicalParent[canonicalKey] === void 0) {
			canonicalParent[canonicalKey] = legacyValue;
			changes.push(`Moved ${pathLabel}.${legacyKey} → ${pathLabel}.${parentKey}.${canonicalKey}.`);
		} else changes.push(`Removed ${pathLabel}.${legacyKey} (${pathLabel}.${parentKey}.${canonicalKey} already set).`);
		delete memorySearch[legacyKey];
	}
}
function rewriteLegacyMemorySearchAutoProvider(memorySearch, pathLabel, changes) {
	if (!memorySearch || !isLegacyMemorySearchAutoProvider(memorySearch.provider)) return;
	memorySearch.provider = "openai";
	changes.push(`Moved ${pathLabel}.provider from legacy "auto" to "openai".`);
}
function migrateCanonicalMemorySearches(raw, changes, migrateMemorySearch) {
	migrateMemorySearch(asNullableRecord(asNullableRecord(raw.memory)?.search), "memory.search", changes);
	visitAgentEntries(raw, (agent, path) => {
		migrateMemorySearch(asNullableRecord(asNullableRecord(agent.memory)?.search), `${path}.memory.search`, changes);
	});
}
function getSandboxBrowserConfig(container) {
	return asNullableRecord(asNullableRecord(asNullableRecord(container)?.sandbox)?.browser);
}
function isUnsupportedSandboxBrowserNetwork(value) {
	return normalizeOptionalLowercaseString(value) === "none";
}
function migrateExplicitUnsupportedSandboxBrowserNetwork(browser, pathLabel, changes) {
	if (!isUnsupportedSandboxBrowserNetwork(browser.network)) return;
	browser.enabled = false;
	browser.network = DEFAULT_SANDBOX_BROWSER_NETWORK;
	changes.push(`Disabled ${pathLabel} and moved its unsupported network "none" → "${DEFAULT_SANDBOX_BROWSER_NETWORK}".`);
}
function migrateAgentBrowserInheritedFromUnsupportedDefault(params) {
	const browser = getSandboxBrowserConfig(params.agent);
	if (!browser) return;
	const hasExplicitNetwork = typeof browser.network === "string";
	if (normalizeOptionalLowercaseString(browser.network) === "none") {
		migrateExplicitUnsupportedSandboxBrowserNetwork(browser, params.pathLabel, params.changes);
		return;
	}
	if (!hasExplicitNetwork && browser.enabled === true) {
		browser.enabled = false;
		params.changes.push(`Disabled ${params.pathLabel} because it inherited unsupported browser network "none".`);
		return;
	}
	if (hasExplicitNetwork && browser.enabled === void 0 && params.defaultBrowserEnabled) {
		browser.enabled = true;
		params.changes.push(`Set ${params.pathLabel}.enabled to true to preserve its explicit supported network while disabling the unsupported default browser network.`);
	}
}
function migrateUnsupportedSandboxBrowserNetworks(raw, changes) {
	const agents = asNullableRecord(raw.agents);
	const defaultBrowser = getSandboxBrowserConfig(asNullableRecord(agents?.defaults));
	const defaultNetworkUnsupported = isUnsupportedSandboxBrowserNetwork(defaultBrowser?.network);
	const defaultBrowserEnabled = defaultBrowser?.enabled === true;
	visitAgentEntries(raw, (agent, path) => {
		const pathLabel = `${path}.sandbox.browser`;
		if (defaultNetworkUnsupported) {
			migrateAgentBrowserInheritedFromUnsupportedDefault({
				agent,
				pathLabel,
				defaultBrowserEnabled,
				changes
			});
			return;
		}
		const browser = getSandboxBrowserConfig(agent);
		if (browser) migrateExplicitUnsupportedSandboxBrowserNetwork(browser, pathLabel, changes);
	});
	if (defaultBrowser) migrateExplicitUnsupportedSandboxBrowserNetwork(defaultBrowser, "agents.defaults.sandbox.browser", changes);
}
function hasOwnRecordProperty(value, key) {
	const record = asNullableRecord(value);
	return Boolean(record && Object.hasOwn(record, key));
}
function hasSurfaceLegacySilentReplyPolicy(value) {
	const surfaces = asNullableRecord(value);
	if (!surfaces) return false;
	return Object.entries(surfaces).some(([surfaceId, surface]) => !isBlockedObjectKey(surfaceId) && hasOwnRecordProperty(asNullableRecord(surface)?.silentReply, "internal"));
}
function removeLegacySilentReplyConfig(raw, changes) {
	const scopes = [["agents.defaults", asNullableRecord(raw.agents)?.defaults]];
	for (const [surfaceId, surface] of Object.entries(asNullableRecord(raw.surfaces) ?? {})) if (!isBlockedObjectKey(surfaceId)) scopes.push([`surfaces.${surfaceId}`, surface]);
	for (const [path, value] of scopes) {
		const container = asNullableRecord(value);
		if (!container) continue;
		const silentReply = asNullableRecord(container.silentReply);
		if (silentReply && Object.hasOwn(silentReply, "internal")) {
			delete silentReply.internal;
			changes.push(`Removed ${path}.silentReply.internal; internal sessions never use NO_REPLY.`);
		}
	}
}
const CONFIGURED_TOOL_SECTION_GRANTS = [{
	key: "exec",
	grants: ["exec", "process"]
}, {
	key: "fs",
	grants: [
		"read",
		"write",
		"edit"
	]
}];
function readToolPolicyGrantList(value, key) {
	return readOwnToolPolicyGrantList(value, key) ?? [];
}
function readOwnToolPolicyGrantList(value, key) {
	const tools = asNullableRecord(value);
	return Array.isArray(tools?.[key]) ? tools[key].filter((entry) => typeof entry === "string") : void 0;
}
function resolveToolProfileForMigration(tools, inheritedProfile) {
	return typeof tools.profile === "string" ? tools.profile : inheritedProfile;
}
function collectProfileConfiguredSectionRepairGrants(params) {
	const tools = asNullableRecord(params.value);
	if (!tools) return [];
	const profile = resolveToolProfileForMigration(tools, params.inheritedProfile);
	if (!profile || profile === "full") return [];
	const ownAllow = readToolPolicyGrantList(tools, "allow");
	if (ownAllow.length === 0) return [];
	const explicitAlsoAllow = readOwnToolPolicyGrantList(tools, "alsoAllow");
	const explicitPolicy = { allow: uniqueStrings([...ownAllow, ...explicitAlsoAllow ?? []]) };
	const profilePolicy = mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(profile), explicitAlsoAllow ?? params.inheritedAlsoAllow ?? []);
	return uniqueStrings(params.configuredGrants.filter((toolName) => isToolAllowedByPolicyName(toolName, explicitPolicy) && (!isToolAllowedByPolicyName(toolName, profilePolicy) || (explicitAlsoAllow ? isToolAllowedByPolicyName(toolName, { allow: explicitAlsoAllow }) : false))));
}
function toolProfileConfiguredSectionsNeedExplicitRepair(value, inheritedProfile, inheritedAlsoAllow, configuredGrantsOverride, inheritedByProvider) {
	const tools = asNullableRecord(value);
	if (!tools) return false;
	const configuredGrants = configuredGrantsOverride ?? collectConfiguredToolSectionGrants(tools);
	return collectProfileConfiguredSectionRepairGrants({
		value,
		inheritedProfile,
		inheritedAlsoAllow,
		configuredGrants
	}).length > 0 || byProviderToolProfilesNeedConfiguredSectionMigration(tools, configuredGrants, readOwnToolPolicyGrantList(tools, "alsoAllow") ?? inheritedAlsoAllow, inheritedByProvider);
}
function collectConfiguredToolSectionGrants(tools) {
	const grants = [];
	for (const section of CONFIGURED_TOOL_SECTION_GRANTS) if (asNullableRecord(tools[section.key])) grants.push(...section.grants);
	return uniqueStrings(grants);
}
function collectEffectiveConfiguredToolSectionGrants(inheritedTools, tools) {
	const includeInheritedSections = typeof tools?.profile !== "string";
	return uniqueStrings([...includeInheritedSections && inheritedTools ? collectConfiguredToolSectionGrants(inheritedTools) : [], ...tools ? collectConfiguredToolSectionGrants(tools) : []]);
}
function resolveProfileBoundAllowGrants(params) {
	const explicitAlsoAllow = readOwnToolPolicyGrantList(params.tools, "alsoAllow");
	const profilePolicy = mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(params.profile), explicitAlsoAllow ?? params.inheritedAlsoAllow ?? []);
	const profileAllow = expandToolGroups(profilePolicy?.allow);
	const coreAllow = profileAllow.includes("*") ? expandToolGroups(params.allow) : profileAllow.filter((toolName) => isToolAllowedByPolicyName(toolName, { allow: params.allow }));
	const pluginAllow = expandToolGroups(params.allow).filter((entry) => {
		if (entry === "*" || isKnownCoreToolId(entry)) return false;
		return !profileAllow.some((toolName) => isToolAllowedByPolicyName(toolName, { allow: [entry] }));
	});
	return uniqueStrings([
		...coreAllow,
		...pluginAllow,
		...params.configuredGrants
	]);
}
function byProviderToolProfilesNeedConfiguredSectionMigration(tools, configuredGrants, inheritedAlsoAllow, inheritedByProvider) {
	const byProvider = asNullableRecord(tools.byProvider);
	return Boolean(byProvider && Object.entries(byProvider).some(([providerKey, policy]) => {
		const inheritedProviderPolicy = resolveInheritedProviderPolicy(inheritedByProvider, providerKey);
		const inheritedProviderProfile = typeof inheritedProviderPolicy?.profile === "string" ? inheritedProviderPolicy.profile : void 0;
		if (!(typeof asNullableRecord(policy)?.profile === "string" || Boolean(inheritedProviderProfile))) return false;
		return collectProfileConfiguredSectionRepairGrants({
			value: policy,
			inheritedProfile: inheritedProviderProfile,
			inheritedAlsoAllow: readOwnToolPolicyGrantList(inheritedProviderPolicy, "alsoAllow") ?? inheritedAlsoAllow,
			configuredGrants
		}).length > 0;
	}));
}
function addProfileConfiguredSectionGrants(value, pathLabel, changes, inheritedProfile, inheritedAlsoAllow, configuredGrantsOverride, materializeProfile = true) {
	const tools = asNullableRecord(value);
	if (!tools || !materializeProfile) return;
	const profile = resolveToolProfileForMigration(tools, inheritedProfile);
	if (!profile) return;
	const repairGrants = collectProfileConfiguredSectionRepairGrants({
		value: tools,
		inheritedProfile,
		inheritedAlsoAllow,
		configuredGrants: configuredGrantsOverride ?? collectConfiguredToolSectionGrants(tools)
	});
	const allow = readToolPolicyGrantList(tools, "allow");
	if (repairGrants.length === 0 || allow.length === 0 || profile === "full") return;
	const ownAlsoAllow = readOwnToolPolicyGrantList(tools, "alsoAllow");
	tools.allow = resolveProfileBoundAllowGrants({
		tools,
		profile,
		allow: uniqueStrings([...allow, ...ownAlsoAllow ?? []]),
		inheritedAlsoAllow,
		configuredGrants: repairGrants
	});
	changes.push(`Replaced ${pathLabel}.allow entries with profile "${profile}" grants plus explicit configured-section grants.`);
	if (ownAlsoAllow) {
		delete tools.alsoAllow;
		changes.push(`Merged ${pathLabel}.alsoAllow into ${pathLabel}.allow.`);
	}
	tools.profile = "full";
	changes.push(`Set ${pathLabel}.profile to "full" so ${pathLabel}.allow controls explicit configured-section grants directly.`);
}
function addByProviderProfileConfiguredSectionGrants(value, pathLabel, changes, configuredGrantsOverride, inheritedProfile, inheritedByProvider) {
	const tools = asNullableRecord(value);
	if (!tools) return;
	const configuredGrants = configuredGrantsOverride ?? collectConfiguredToolSectionGrants(tools);
	if (configuredGrants.length === 0) return;
	const byProvider = asNullableRecord(tools.byProvider);
	for (const [providerKey, providerPolicy] of Object.entries(byProvider ?? {})) {
		if (isBlockedObjectKey(providerKey)) continue;
		const inheritedProviderPolicy = resolveInheritedProviderPolicy(inheritedByProvider, providerKey);
		const ownsProviderProfile = typeof asNullableRecord(providerPolicy)?.profile === "string";
		const inheritedProviderProfile = typeof inheritedProviderPolicy?.profile === "string" ? inheritedProviderPolicy.profile : void 0;
		const providerInheritedProfile = inheritedProviderProfile ?? inheritedProfile;
		const providerInheritedAlsoAllow = readOwnToolPolicyGrantList(inheritedProviderPolicy, "alsoAllow");
		addProfileConfiguredSectionGrants(providerPolicy, `${pathLabel}.byProvider.${providerKey}`, changes, providerInheritedProfile, providerInheritedAlsoAllow, configuredGrants, ownsProviderProfile || Boolean(inheritedProviderProfile));
	}
}
function resolveInheritedProviderPolicy(inheritedByProvider, providerKey) {
	const normalized = normalizeToolProviderPolicyKey(providerKey);
	const slashIndex = normalized.indexOf("/");
	const byProvider = Object.fromEntries(Object.entries(inheritedByProvider ?? {}).filter(([key]) => !isBlockedObjectKey(key)));
	return asNullableRecord(resolveProviderToolPolicy({
		byProvider,
		modelProvider: normalized
	}) ?? (slashIndex > 0 ? resolveProviderToolPolicy({
		byProvider,
		modelProvider: normalized.slice(0, slashIndex)
	}) : void 0));
}
function bindingMatchHasLegacyDmPeerKind(binding) {
	const match = asNullableRecord(asNullableRecord(binding)?.match);
	const peer = asNullableRecord(match?.peer);
	return peer !== null && peer.kind === "dm";
}
/** Legacy config migration specs for agent/runtime-owned config keys. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_AGENTS = [
	defineLegacyConfigMigration({
		id: "bindings.match.peer.kind.dm-to-direct",
		describe: "Move deprecated bindings match.peer.kind dm values to direct",
		legacyRules: [{
			path: ["bindings"],
			message: "bindings[].match.peer.kind uses the retired \"dm\" alias; use \"direct\". Run \"openclaw doctor --fix\".",
			match: (value) => Array.isArray(value) && value.some((binding) => bindingMatchHasLegacyDmPeerKind(binding))
		}],
		apply: (raw, changes) => {
			if (!Array.isArray(raw.bindings)) return;
			let migrated = 0;
			for (const binding of raw.bindings) {
				const match = asNullableRecord(asNullableRecord(binding)?.match);
				const peer = asNullableRecord(match?.peer);
				if (peer !== null && peer.kind === "dm") {
					peer.kind = "direct";
					migrated += 1;
				}
			}
			if (migrated > 0) changes.push(`Moved deprecated bindings[].match.peer.kind "dm" → "direct" for ${migrated} binding${migrated === 1 ? "" : "s"}.`);
		}
	}),
	defineLegacyConfigMigration({
		id: "tools.profile-configured-sections-alsoAllow",
		describe: "Repair explicit configured-section tool grants filtered by profiles",
		legacyRules: PROFILE_CONFIGURED_TOOL_SECTION_RULES,
		apply: (raw, changes) => {
			const globalTools = asNullableRecord(raw.tools);
			const inheritedProfile = typeof globalTools?.profile === "string" ? globalTools.profile : void 0;
			const inheritedAlsoAllow = readToolPolicyGrantList(globalTools, "alsoAllow");
			addProfileConfiguredSectionGrants(raw.tools, "tools", changes);
			addByProviderProfileConfiguredSectionGrants(raw.tools, "tools", changes, void 0, inheritedProfile);
			visitAgentEntries(raw, (agent, path) => {
				const agentTools = asNullableRecord(agent.tools);
				const configuredGrants = collectEffectiveConfiguredToolSectionGrants(globalTools, agentTools);
				addProfileConfiguredSectionGrants(agentTools, `${path}.tools`, changes, inheritedProfile, inheritedAlsoAllow, configuredGrants);
				addByProviderProfileConfiguredSectionGrants(agentTools, `${path}.tools`, changes, configuredGrants, resolveToolProfileForMigration(agentTools ?? {}, inheritedProfile), asNullableRecord(globalTools?.byProvider));
			});
		}
	}),
	defineLegacyConfigMigration({
		id: "silentReply.internal-removed",
		describe: "Remove legacy internal silent reply config",
		legacyRules: SILENT_REPLY_LEGACY_RULES,
		apply: removeLegacySilentReplyConfig
	}),
	defineLegacyConfigMigration({
		id: "agents.sandbox.browser.network-none",
		describe: "Disable sandbox browser sidecars that use unsupported network mode none",
		legacyRules: UNSUPPORTED_SANDBOX_BROWSER_NETWORK_RULES,
		apply: migrateUnsupportedSandboxBrowserNetworks
	}),
	defineLegacyConfigMigration({
		id: "memorySearch->memory.search",
		describe: "Move memory search config to its canonical memory owner",
		legacyRules: [MEMORY_SEARCH_RULE, ...AGENT_MEMORY_SEARCH_OWNER_RULES],
		apply: (raw, changes) => {
			const agents = asNullableRecord(raw.agents);
			const defaults = asNullableRecord(agents?.defaults);
			const legacyDefaults = asNullableRecord(defaults?.memorySearch);
			const legacyTopLevel = asNullableRecord(raw.memorySearch);
			const memory = asNullableRecord(raw.memory);
			const canonical = asNullableRecord(memory?.search);
			if (legacyDefaults || legacyTopLevel) {
				const target = structuredClone(canonical ?? {});
				if (legacyDefaults) {
					mergeMissing(target, legacyDefaults);
					delete defaults.memorySearch;
				}
				if (legacyTopLevel) {
					mergeMissing(target, legacyTopLevel);
					delete raw.memorySearch;
				}
				ensureRecord(raw, "memory").search = target;
				changes.push(canonical ? "Merged legacy memorySearch defaults → memory.search (kept explicit memory.search values)." : "Moved legacy memorySearch defaults → memory.search.");
			}
			visitAgentEntries(raw, (agent, path) => {
				const legacy = asNullableRecord(agent.memorySearch);
				if (!legacy) return;
				const agentMemory = ensureRecord(agent, "memory");
				const existing = asNullableRecord(agentMemory.search);
				const target = structuredClone(existing ?? {});
				mergeMissing(target, legacy);
				agentMemory.search = target;
				delete agent.memorySearch;
				changes.push(existing ? `Merged ${path}.memorySearch → ${path}.memory.search (kept explicit memory.search values).` : `Moved ${path}.memorySearch → ${path}.memory.search.`);
			});
		}
	}),
	defineLegacyConfigMigration({
		id: "memorySearch.flat-fields->nested-fields",
		describe: "Move legacy flat memory search fields to canonical nested fields",
		legacyRules: LEGACY_MEMORY_SEARCH_FLAT_KEY_RULES,
		apply: (raw, changes) => migrateCanonicalMemorySearches(raw, changes, migrateLegacyMemorySearchFlatKeys)
	}),
	defineLegacyConfigMigration({
		id: "memorySearch.provider-auto->openai",
		describe: "Rewrite legacy memorySearch provider \"auto\" to \"openai\"",
		legacyRules: LEGACY_MEMORY_SEARCH_AUTO_PROVIDER_RULES,
		apply: (raw, changes) => migrateCanonicalMemorySearches(raw, changes, rewriteLegacyMemorySearchAutoProvider)
	}),
	defineLegacyConfigMigration({
		id: "session.typingMode->agents.defaults.typingMode",
		describe: "Move session typing mode to agent defaults",
		legacyRules: [{
			path: ["session", "typingMode"],
			message: "session.typingMode moved to agents.defaults.typingMode. Run \"openclaw doctor --fix\"."
		}],
		apply: (raw, changes) => {
			const session = asNullableRecord(raw.session);
			if (!session || !Object.hasOwn(session, "typingMode")) return;
			const defaults = ensureRecord(ensureRecord(raw, "agents"), "defaults");
			const replacedDefault = defaults.typingMode !== void 0;
			defaults.typingMode = session.typingMode;
			changes.push(replacedDefault ? "Moved session.typingMode → agents.defaults.typingMode (replaced the previously shadowed agent default)." : "Moved session.typingMode → agents.defaults.typingMode.");
			delete session.typingMode;
		}
	})
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.cli-backends.ts
const CLI_BACKENDS_PLUGIN_GUIDE = "https://docs.openclaw.ai/plugins/cli-backend-plugins";
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_CLI_BACKENDS = [defineLegacyConfigMigration({
	id: "agents.defaults.cliBackends-plugin-registration",
	describe: "Remove CLI backend adapter config now owned by plugins",
	legacyRules: [{
		path: [
			"agents",
			"defaults",
			"cliBackends"
		],
		message: `CLI backend adapters now register through plugins; see ${CLI_BACKENDS_PLUGIN_GUIDE}`
	}],
	apply: (raw, changes) => {
		const defaults = asNullableRecord(asNullableRecord(raw.agents)?.defaults);
		if (!defaults || !Object.hasOwn(defaults, "cliBackends")) return;
		delete defaults.cliBackends;
		changes.push(`Removed agents.defaults.cliBackends; CLI backend adapters now register through plugins (${CLI_BACKENDS_PLUGIN_GUIDE}).`);
	}
})];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.code-mode.ts
const LEGACY_CONFIG_MIGRATION_RUNTIME_CODE_MODE = defineLegacyConfigMigration({
	id: "tools.codeMode.javascript-only",
	describe: "Remove the retired Code Mode language setting",
	legacyRules: [{
		path: [
			"tools",
			"codeMode",
			"languages"
		],
		message: "tools.codeMode.languages is retired; Code Mode now runs JavaScript only. Run \"openclaw doctor --fix\"."
	}, {
		path: ["agents"],
		message: "Per-agent tools.codeMode.languages is retired; Code Mode now runs JavaScript only. Run \"openclaw doctor --fix\".",
		match: (value) => {
			let found = false;
			visitAgentEntries({ agents: value }, (agent) => {
				found ||= Object.hasOwn(asNullableRecord(asNullableRecord(agent.tools)?.codeMode) ?? {}, "languages");
			});
			return found;
		}
	}],
	apply: (raw, changes) => {
		const removeLanguages = (tools, path) => {
			const codeMode = asNullableRecord(asNullableRecord(tools)?.codeMode);
			if (!codeMode || !Object.hasOwn(codeMode, "languages")) return;
			delete codeMode.languages;
			changes.push(`Removed ${path}.codeMode.languages; Code Mode now runs JavaScript only.`);
		};
		removeLanguages(raw.tools, "tools");
		visitAgentEntries(raw, (agent, path) => removeLanguages(agent.tools, `${path}.tools`));
	}
});
const LEGACY_CONFIG_MIGRATION_RUNTIME_CODE_MODE_EXECUTOR = defineLegacyConfigMigration({
	id: "tools.codeMode.executor",
	describe: "Move the explicit Code Mode runtime to its executor setting",
	legacyRules: [{
		path: [
			"tools",
			"codeMode",
			"runtime"
		],
		message: "tools.codeMode.runtime moved to tools.codeMode.executor. Run \"openclaw doctor --fix\"."
	}, {
		path: ["agents"],
		message: "Per-agent tools.codeMode.runtime moved to tools.codeMode.executor. Run \"openclaw doctor --fix\".",
		match: (value) => {
			let found = false;
			visitAgentEntries({ agents: value }, (agent) => {
				found ||= Object.hasOwn(asNullableRecord(asNullableRecord(agent.tools)?.codeMode) ?? {}, "runtime");
			});
			return found;
		}
	}],
	apply: (raw, changes) => {
		const migrateRuntime = (tools, path) => {
			const codeMode = asNullableRecord(asNullableRecord(tools)?.codeMode);
			if (codeMode?.runtime !== "quickjs-wasi") return;
			if (Object.hasOwn(codeMode, "executor")) changes.push(`Removed ${path}.codeMode.runtime; kept explicit ${path}.codeMode.executor.`);
			else {
				codeMode.executor = "quickjs";
				changes.push(`Moved ${path}.codeMode.runtime to ${path}.codeMode.executor (quickjs).`);
			}
			delete codeMode.runtime;
		};
		migrateRuntime(raw.tools, "tools");
		visitAgentEntries(raw, (agent, path) => migrateRuntime(agent.tools, `${path}.tools`));
	}
});
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_CRON = [defineLegacyConfigMigration({
	id: "cron.webhook-remove",
	describe: "Remove retired global cron webhook fallback",
	legacyRules: [{
		path: ["cron", "webhook"],
		message: "cron.webhook was retired after per-job delivery migration. Run \"openclaw doctor --fix\"."
	}],
	apply: (raw, changes) => {
		const cron = asNullableRecord(raw.cron);
		if (!cron || !Object.hasOwn(cron, "webhook")) return;
		delete cron.webhook;
		changes.push("Removed retired cron.webhook after stored jobs migrated to per-job delivery.");
	}
}), defineLegacyConfigMigration({
	id: "cron.runLog-remove",
	describe: "Remove retired cron run-log retention config",
	legacyRules: [{
		path: ["cron", "runLog"],
		message: "cron.runLog is retired; run history now has fixed per-job retention. Run \"openclaw doctor --fix\"."
	}],
	apply: (raw, changes) => {
		const cron = asNullableRecord(raw.cron);
		if (!cron || !Object.hasOwn(cron, "runLog")) return;
		delete cron.runLog;
		if (Object.keys(cron).length === 0) delete raw.cron;
		changes.push("Removed retired cron.runLog config; cron history now keeps 2000 runs per job.");
	}
})];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.diagnostics.ts
const UNSUPPORTED_OTEL_GRPC_PROTOCOL_RULE = {
	path: [
		"diagnostics",
		"otel",
		"protocol"
	],
	message: "diagnostics.otel.protocol = \"grpc\" is no longer accepted because gRPC export is not implemented. Run \"openclaw doctor --fix\", then configure an OTLP/HTTP collector before re-enabling telemetry.",
	match: (value) => value === "grpc"
};
function hasLegacyGrpcOtlpSignals(otel) {
	return otel.traces !== false || otel.metrics !== false || otel.logs === true && otel.logsExporter !== "stdout";
}
/** Legacy config migration specs for diagnostics runtime config. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_DIAGNOSTICS = [defineLegacyConfigMigration({
	id: "diagnostics.otel.grpc-protocol",
	describe: "Remove unsupported diagnostics.otel.protocol grpc configs",
	legacyRules: [UNSUPPORTED_OTEL_GRPC_PROTOCOL_RULE],
	apply: (raw, changes, context) => {
		const otel = asNullableRecord(asNullableRecord(raw.diagnostics)?.otel);
		const resolvedRoot = asNullableRecord(context?.resolvedRaw ?? raw);
		const resolvedOtel = asNullableRecord(asNullableRecord(resolvedRoot?.diagnostics)?.otel);
		if (!otel || resolvedOtel?.protocol !== "grpc") return;
		delete otel.protocol;
		changes.push("Removed unsupported diagnostics.otel.protocol \"grpc\"; use \"http/protobuf\" with an OTLP/HTTP collector.");
		if (resolvedOtel.enabled === true && hasLegacyGrpcOtlpSignals(resolvedOtel)) {
			otel.enabled = false;
			changes.push("Disabled diagnostics.otel.enabled because legacy grpc configs with OTLP signals cannot export telemetry; re-enable it after choosing an OTLP/HTTP collector.");
		}
	}
})];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.gateway.ts
const GATEWAY_PORT_OOB_RULE = {
	path: ["gateway", "port"],
	message: "gateway.port is outside the valid TCP range (1–65535) and will be removed to avoid startup failure. Run \"openclaw doctor --fix\".",
	match: (value) => typeof value === "number" && (value < 1 || value > 65535)
};
const GATEWAY_BIND_RULE = {
	path: ["gateway", "bind"],
	message: "gateway.bind host aliases (for example 0.0.0.0/localhost) are legacy; use bind modes (lan/loopback/custom/tailnet/auto) instead. Run \"openclaw doctor --fix\".",
	match: (value) => normalizeLegacyGatewayBindHostAlias(value) !== null,
	requireSourceLiteral: true
};
const GATEWAY_TAILSCALE_RESET_ON_EXIT_RULE = {
	path: [
		"gateway",
		"tailscale",
		"resetOnExit"
	],
	message: "gateway.tailscale.resetOnExit is retired because managed routes now follow the Gateway lifecycle automatically. Run \"openclaw doctor --fix\".",
	match: (value) => typeof value === "boolean"
};
const GATEWAY_TAILSCALE_SERVICE_NAME_RULE = {
	path: [
		"gateway",
		"tailscale",
		"serviceName"
	],
	message: "gateway.tailscale.serviceName is retired because named Services require persistent background routes that cannot follow the Gateway lifecycle. Run \"openclaw doctor --fix\"."
};
const CONTROL_UI_DEVICE_AUTH_MIGRATION_RULE = {
	path: [
		"gateway",
		"controlUi",
		"dangerouslyDisableDeviceAuth"
	],
	message: "gateway.controlUi.dangerouslyDisableDeviceAuth is retired and ignored. Control UI browsers pair through the normal device flow; run \"openclaw doctor --fix\" to remove the legacy key.",
	match: (value) => typeof value === "boolean"
};
const CONTROL_UI_TOOL_TITLES_RULE = {
	path: [
		"gateway",
		"controlUi",
		"toolTitles"
	],
	message: "gateway.controlUi.toolTitles is retired. Tool activity uses agent-provided descriptions automatically, without utility-model calls. Run \"openclaw doctor --fix\" to remove it."
};
const LEGACY_GATEWAY_BIND_HOST_ALIASES = /* @__PURE__ */ new Map([
	["0.0.0.0", "lan"],
	["::", "lan"],
	["[::]", "lan"],
	["*", "lan"],
	["127.0.0.1", "loopback"],
	["localhost", "loopback"],
	["::1", "loopback"],
	["[::1]", "loopback"]
]);
function normalizeLegacyGatewayBindHostAlias(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized ? LEGACY_GATEWAY_BIND_HOST_ALIASES.get(normalized) ?? null : null;
}
function escapeControlForLog(value) {
	return value.replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}
/** Legacy config migration specs for gateway runtime config. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_GATEWAY = [
	defineLegacyConfigMigration({
		id: "gateway.control-ui-tool-titles-remove",
		describe: "Remove the retired Control UI tool-title preference",
		legacyRules: [CONTROL_UI_TOOL_TITLES_RULE],
		apply: (raw, changes) => {
			const controlUi = asNullableRecord(asNullableRecord(raw.gateway)?.controlUi);
			if (!controlUi || !Object.hasOwn(controlUi, "toolTitles")) return;
			delete controlUi.toolTitles;
			changes.push("Removed retired gateway.controlUi.toolTitles; tool activity descriptions are automatic and make no utility-model calls.");
		}
	}),
	defineLegacyConfigMigration({
		id: "gateway.tailscale.service-name-remove",
		describe: "Disable managed ingress and remove the retired Tailscale Service name",
		legacyRules: [GATEWAY_TAILSCALE_SERVICE_NAME_RULE],
		apply: (raw, changes) => {
			const gateway = asNullableRecord(raw.gateway);
			const tailscale = asNullableRecord(gateway?.tailscale);
			if (!gateway || !tailscale || !Object.hasOwn(tailscale, "serviceName")) return;
			const wasManagedService = tailscale.mode === "serve";
			delete tailscale.serviceName;
			if (wasManagedService) tailscale.mode = "off";
			changes.push(wasManagedService ? "Removed gateway.tailscale.serviceName and set gateway.tailscale.mode=off because named Services cannot use lifecycle-owned routes. Inspect the retained Service route, then run `tailscale serve clear <service-name>`; set gateway.tailscale.mode=serve to use device Serve instead." : "Removed retired gateway.tailscale.serviceName; the current Tailscale mode is unchanged because named Services applied only to Serve.");
		}
	}),
	defineLegacyConfigMigration({
		id: "gateway.tailscale.reset-on-exit-remove",
		describe: "Remove the retired Tailscale route-cleanup preference",
		legacyRules: [GATEWAY_TAILSCALE_RESET_ON_EXIT_RULE],
		apply: (raw, changes) => {
			const gateway = asNullableRecord(raw.gateway);
			const tailscale = asNullableRecord(gateway?.tailscale);
			if (!gateway || !tailscale || !Object.hasOwn(tailscale, "resetOnExit")) return;
			const cleanupWasEnabled = tailscale.resetOnExit === true;
			delete tailscale.resetOnExit;
			changes.push(cleanupWasEnabled ? "Removed gateway.tailscale.resetOnExit; managed Tailscale routes now end automatically with the Gateway lifecycle." : "Removed retired gateway.tailscale.resetOnExit config.");
		}
	}),
	defineLegacyConfigMigration({
		id: "gateway.control-ui-device-auth-bypass->pairing-migration",
		describe: "Remove the retired Control UI device-auth bypass",
		legacyRules: [CONTROL_UI_DEVICE_AUTH_MIGRATION_RULE],
		apply: (raw, changes) => {
			const gateway = asNullableRecord(raw.gateway);
			const controlUi = asNullableRecord(gateway?.controlUi);
			if (!controlUi || !Object.hasOwn(controlUi, "dangerouslyDisableDeviceAuth")) return;
			delete controlUi.dangerouslyDisableDeviceAuth;
			changes.push("Removed retired gateway.controlUi.dangerouslyDisableDeviceAuth legacy config.");
		}
	}),
	defineLegacyConfigMigration({
		id: "gateway.port-oob-repair",
		describe: "Remove out-of-range gateway.port to avoid post-schema-tightening startup failures",
		legacyRules: [GATEWAY_PORT_OOB_RULE],
		apply: (raw, changes) => {
			const gateway = asNullableRecord(raw.gateway);
			if (!gateway || !Object.hasOwn(gateway, "port")) return;
			const port = gateway.port;
			if (typeof port !== "number" || port >= 1 && port <= 65535) return;
			delete gateway.port;
			if (Object.keys(gateway).length === 0) delete raw.gateway;
			changes.push(`Removed out-of-range gateway.port (${String(port)}). Valid TCP ports are 1–65535; the gateway will use the default port ${DEFAULT_GATEWAY_PORT}.`);
		}
	}),
	defineLegacyConfigMigration({
		id: "gateway.controlUi.allowedOrigins-seed-for-non-loopback",
		describe: "Seed gateway.controlUi.allowedOrigins for existing non-loopback gateway installs",
		apply: (raw, changes) => {
			const gateway = asNullableRecord(raw.gateway);
			if (!gateway) return;
			const bind = normalizeLegacyGatewayBindHostAlias(gateway.bind) ?? gateway.bind;
			if (!isGatewayNonLoopbackBindMode(bind)) return;
			const controlUi = asNullableRecord(gateway.controlUi) ?? {};
			if (hasConfiguredControlUiAllowedOrigins({
				allowedOrigins: controlUi.allowedOrigins,
				publicOrigin: gateway.publicOrigin,
				dangerouslyAllowHostHeaderOriginFallback: controlUi.dangerouslyAllowHostHeaderOriginFallback
			})) return;
			const port = resolveGatewayPortWithDefault(gateway.port, DEFAULT_GATEWAY_PORT);
			const origins = buildDefaultControlUiAllowedOrigins({
				port,
				bind,
				customBindHost: typeof gateway.customBindHost === "string" ? gateway.customBindHost : void 0
			});
			gateway.controlUi = {
				...controlUi,
				allowedOrigins: origins
			};
			changes.push(`Seeded gateway.controlUi.allowedOrigins ${JSON.stringify(origins)} for bind=${bind}. Required since v2026.2.26. Add other machine origins to gateway.controlUi.allowedOrigins if needed.`);
		}
	}),
	defineLegacyConfigMigration({
		id: "gateway.bind.host-alias->bind-mode",
		describe: "Normalize gateway.bind host aliases to supported bind modes",
		legacyRules: [GATEWAY_BIND_RULE],
		apply: (raw, changes) => {
			const gateway = asNullableRecord(raw.gateway);
			if (!gateway) return;
			const bindRaw = gateway.bind;
			if (typeof bindRaw !== "string") return;
			const mapped = normalizeLegacyGatewayBindHostAlias(bindRaw);
			if (!mapped) return;
			gateway.bind = mapped;
			changes.push(`Normalized gateway.bind "${escapeControlForLog(bindRaw)}" → "${mapped}".`);
		}
	})
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.mcp.ts
const MCP_SERVER_TIMEOUT_ALIASES = [
	["connectTimeout", "connectionTimeoutMs"],
	["connect_timeout", "connectionTimeoutMs"],
	["timeout", "requestTimeoutMs"]
];
function* mcpServerEntries(value) {
	for (const [name, server] of Object.entries(asNullableRecord(value) ?? {})) if (isRecord(server)) yield [name, server];
}
function mcpServerRules(message, match) {
	return [["mcp", "servers"], [
		"nodeHost",
		"mcp",
		"servers"
	]].map((path) => ({
		path,
		message: `${path.join(".")} ${message}`,
		match: (value) => isRecord(value) && Object.values(value).some((server) => isRecord(server) && match(server))
	}));
}
function hasMcpServerLegacyAliases(server) {
	const codex = isRecord(server.codex) ? server.codex : void 0;
	return Object.hasOwn(server, "workingDirectory") || [
		"supports_parallel_tool_calls",
		"ssl_verify",
		"client_cert",
		"client_key"
	].some((key) => Object.hasOwn(server, key)) || Boolean(codex && Object.hasOwn(codex, "default_tools_approval_mode"));
}
function migrateMcpServerAliases(servers, pathPrefix, changes) {
	const records = asNullableRecord(servers);
	if (!records) return;
	for (const [serverName, value] of mcpServerEntries(records)) {
		if (!hasMcpServerLegacyAliases(value) && !isKnownCliMcpTypeAlias(value.type)) continue;
		const normalized = canonicalizeConfiguredMcpServer(value);
		if (JSON.stringify(normalized) === JSON.stringify(value)) continue;
		records[serverName] = normalized;
		changes.push(`Canonicalized legacy aliases in ${pathPrefix}.${serverName}.`);
	}
}
function migrateMcpServerTimeoutAliases(servers, pathPrefix, changes) {
	for (const [serverName, server] of mcpServerEntries(servers)) for (const [alias, canonical] of MCP_SERVER_TIMEOUT_ALIASES) {
		if (!Object.hasOwn(server, alias)) continue;
		const value = server[alias];
		if (server[canonical] === void 0 && typeof value === "number" && value > 0 && Number.isFinite(value * 1e3)) {
			server[canonical] = value * 1e3;
			changes.push(`Moved ${pathPrefix}.${serverName}.${alias} → ${canonical} (${value * 1e3} ms).`);
		} else changes.push(`Removed ${pathPrefix}.${serverName}.${alias} (${canonical} already set or alias invalid).`);
		delete server[alias];
	}
}
function migrateMcpServerDisabledFlags(servers, pathPrefix, changes) {
	for (const [serverName, rawServer] of mcpServerEntries(servers)) {
		if (typeof rawServer.disabled !== "boolean") continue;
		const disabled = rawServer.disabled;
		if (typeof rawServer.enabled !== "boolean") {
			rawServer.enabled = !disabled;
			changes.push(`Moved ${pathPrefix}.${serverName}.disabled ${disabled} → enabled ${!disabled}.`);
		} else changes.push(`Removed ${pathPrefix}.${serverName}.disabled ${disabled} because enabled is already set to ${rawServer.enabled}.`);
		delete rawServer.disabled;
	}
}
/** Legacy config migration specs for MCP server config compatibility. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_MCP = [defineLegacyConfigMigration({
	id: "mcp.servers.canonicalize",
	describe: "Normalize legacy MCP server config",
	legacyRules: [
		...mcpServerRules("entries use the unsupported \"disabled\" key; use \"enabled\" with the inverse boolean value. Run \"openclaw doctor --fix\" to migrate it.", (server) => typeof server.disabled === "boolean"),
		...mcpServerRules("entries use OpenClaw transport names; CLI-native type aliases are legacy here. Run \"openclaw doctor --fix\".", (server) => isKnownCliMcpTypeAlias(server.type)),
		...mcpServerRules("timeout aliases were retired; use connectionTimeoutMs and requestTimeoutMs. Run \"openclaw doctor --fix\".", (server) => MCP_SERVER_TIMEOUT_ALIASES.some(([key]) => Object.hasOwn(server, key))),
		...mcpServerRules("legacy aliases were retired; use camelCase spellings and cwd. Run \"openclaw doctor --fix\".", hasMcpServerLegacyAliases)
	],
	apply: (raw, changes) => {
		const mcp = asNullableRecord(raw.mcp);
		const nodeHostMcp = asNullableRecord(asNullableRecord(raw.nodeHost)?.mcp);
		for (const [owner, path] of [[mcp, "mcp.servers"], [nodeHostMcp, "nodeHost.mcp.servers"]]) {
			migrateMcpServerDisabledFlags(owner?.servers, path, changes);
			migrateMcpServerTimeoutAliases(owner?.servers, path, changes);
			migrateMcpServerAliases(owner?.servers, path, changes);
		}
	}
})];
//#endregion
//#region src/commands/doctor/shared/legacy-web-tools-migrate.ts
const LEGACY_WEB_SEARCH_OWNERS = /* @__PURE__ */ new Map([
	["brave", "brave"],
	["duckduckgo", "duckduckgo"],
	["exa", "exa"],
	["firecrawl", "firecrawl"],
	["firecrawl-free", "firecrawl"],
	["gemini", "google"],
	["grok", "xai"],
	["kimi", "moonshot"],
	["minimax", "minimax"],
	["ollama", "ollama"],
	["parallel", "parallel"],
	["parallel-free", "parallel"],
	["perplexity", "perplexity"],
	["searxng", "searxng"],
	["tavily", "tavily"]
]);
const NON_MIGRATED_SEARCH_PROVIDERS = /* @__PURE__ */ new Set([
	"firecrawl-free",
	"parallel",
	"parallel-free",
	"tavily"
]);
const RETIRED_GROK_SEARCH_MODELS = /* @__PURE__ */ new Set([
	"grok-4-1-fast",
	"grok-4-1-fast-reasoning",
	"grok-4-fast",
	"grok-4-fast-reasoning",
	"grok-4-0709"
]);
const RETIRED_GROK_CODE_MODELS = /* @__PURE__ */ new Set([
	"grok-code-fast-1",
	"grok-code-fast",
	"grok-code-fast-1-0825"
]);
const RETIRED_X_SEARCH_MODELS = /* @__PURE__ */ new Set([
	"grok-4-1-fast-non-reasoning",
	"grok-4-fast-non-reasoning",
	"grok-3"
]);
function legacySearchProviderIds() {
	return [...LEGACY_WEB_SEARCH_OWNERS.keys()].filter((providerId) => !NON_MIGRATED_SEARCH_PROVIDERS.has(providerId)).toSorted((left, right) => left.localeCompare(right));
}
function resolveWebSlot(raw, slot) {
	if (!isRecord(raw) || !isRecord(raw.tools) || !isRecord(raw.tools.web)) return;
	const value = raw.tools.web[slot];
	return isRecord(value) ? value : void 0;
}
function retainedSource(source, removedRecordKeys) {
	const retained = {};
	for (const [key, value] of Object.entries(source)) {
		if (isBlockedObjectKey(key) || removedRecordKeys.has(key) && isRecord(value)) continue;
		retained[key] = value;
	}
	return retained;
}
function applyPluginMove(root, move, changes) {
	const entries = ensureRecord(ensureRecord(root, "plugins"), "entries");
	const entry = ensureRecord(entries, move.pluginId);
	const activated = entry.enabled === void 0;
	if (activated) entry.enabled = true;
	const config = ensureRecord(entry, "config");
	const existingValue = config[move.configKey];
	const existingWasRecord = isRecord(existingValue);
	const existing = { ...existingWasRecord ? existingValue : void 0 };
	if (!existingWasRecord) {
		config[move.configKey] = { ...move.payload };
		changes.push(`Moved ${move.legacyPath} → ${move.targetPath}.`);
	} else if (move.mergeMode === "own-api-key") {
		if (!Object.hasOwn(existing, "apiKey")) {
			existing.apiKey = move.payload.apiKey;
			config[move.configKey] = existing;
			changes.push(`Merged ${move.legacyPath} → ${move.targetPath} (filled missing plugin auth).`);
		} else changes.push(`Removed ${move.legacyPath} (${move.targetPath} already set).`);
	} else {
		const merged = { ...existing };
		mergeMissing(merged, move.payload);
		config[move.configKey] = merged;
		if (JSON.stringify(merged) !== JSON.stringify(existing) || activated) changes.push(`Merged ${move.legacyPath} → ${move.targetPath} (filled missing fields from legacy; kept explicit plugin config values).`);
		else changes.push(`Removed ${move.legacyPath} (${move.targetPath} already set).`);
	}
	return activated;
}
function migrateLegacyWebSlot(raw, slot, prepare) {
	const source = resolveWebSlot(raw, slot);
	const prepared = source ? prepare(source) : null;
	if (!isRecord(raw) || !prepared) return {
		config: raw,
		changes: []
	};
	const nextRoot = structuredClone(raw);
	const web = ensureRecord(ensureRecord(nextRoot, "tools"), "web");
	if (prepared.deleteSource) delete web[slot];
	else web[slot] = prepared.retained;
	const changes = [];
	for (const step of prepared.steps) {
		if ("message" in step) {
			changes.push(step.message);
			continue;
		}
		if (applyPluginMove(nextRoot, step.move, changes) && step.move.activatedMessage) changes.push(step.move.activatedMessage);
	}
	return {
		config: nextRoot,
		changes
	};
}
function resolveGrokModelTarget(model, xSearch) {
	if (typeof model !== "string") return;
	const normalized = model.trim().toLowerCase();
	if ((xSearch ? RETIRED_X_SEARCH_MODELS : RETIRED_GROK_SEARCH_MODELS).has(normalized)) return "grok-4.3";
	return RETIRED_GROK_CODE_MODELS.has(normalized) ? "grok-build-0.1" : void 0;
}
function searchMove(providerId, payload, paths) {
	const pluginId = LEGACY_WEB_SEARCH_OWNERS.get(providerId) ?? providerId;
	return {
		pluginId,
		configKey: "webSearch",
		payload,
		legacyPath: paths?.legacyPath ?? `tools.web.search.${providerId}`,
		targetPath: paths?.targetPath ?? `plugins.entries.${pluginId}.config.webSearch`
	};
}
function prepareWebSearch(source) {
	const providerIds = legacySearchProviderIds();
	if (!Object.hasOwn(source, "apiKey") && !providerIds.some((id) => isRecord(source[id]))) return null;
	const retained = retainedSource(source, /* @__PURE__ */ new Set(["apiKey", ...providerIds]));
	delete retained.apiKey;
	const steps = [];
	const braveRecord = isRecord(source.brave) ? source.brave : void 0;
	const bravePayload = { ...braveRecord };
	if (Object.hasOwn(source, "apiKey")) bravePayload.apiKey = source.apiKey;
	if (Object.keys(bravePayload).length > 0) {
		const hasGlobalApiKey = Object.hasOwn(source, "apiKey");
		steps.push({ move: searchMove("brave", bravePayload, hasGlobalApiKey ? {
			legacyPath: "tools.web.search.apiKey",
			targetPath: braveRecord ? "plugins.entries.brave.config.webSearch" : "plugins.entries.brave.config.webSearch.apiKey"
		} : void 0) });
	}
	for (const providerId of providerIds) {
		if (providerId === "brave" || !isRecord(source[providerId])) continue;
		const payload = { ...source[providerId] };
		if (Object.keys(payload).length === 0) continue;
		if (providerId === "grok") {
			const modelTarget = resolveGrokModelTarget(payload.model, false);
			if (modelTarget) {
				steps.push({ message: `Updated tools.web.search.grok.model from ${JSON.stringify(payload.model)} to ${JSON.stringify(modelTarget)}.` });
				payload.model = modelTarget;
			}
		}
		steps.push({ move: searchMove(providerId, payload) });
	}
	return {
		retained,
		steps
	};
}
function prepareWebFetch(source) {
	if (!isRecord(source.firecrawl)) return null;
	const payload = { ...source.firecrawl };
	delete payload.enabled;
	return {
		retained: retainedSource(source, /* @__PURE__ */ new Set(["firecrawl"])),
		steps: Object.keys(payload).length > 0 ? [{ move: {
			pluginId: "firecrawl",
			configKey: "webFetch",
			payload,
			legacyPath: "tools.web.fetch.firecrawl",
			targetPath: "plugins.entries.firecrawl.config.webFetch"
		} }] : [{ message: "Removed empty tools.web.fetch.firecrawl." }]
	};
}
/** Resolve a supported replacement for a retired legacy X search model. */
function resolveLegacyXSearchModelTarget(model) {
	return resolveGrokModelTarget(model, true);
}
function prepareXSearch(source) {
	const hasAuth = Object.hasOwn(source, "apiKey");
	const modelTarget = resolveLegacyXSearchModelTarget(source.model);
	if (!hasAuth && !modelTarget) return null;
	const retained = { ...source };
	const steps = [];
	if (hasAuth) delete retained.apiKey;
	if (modelTarget) {
		steps.push({ message: `Updated tools.web.x_search.model from ${JSON.stringify(source.model)} to ${JSON.stringify(modelTarget)}.` });
		retained.model = modelTarget;
	}
	if (hasAuth) steps.push({ move: {
		pluginId: "xai",
		configKey: "webSearch",
		payload: { apiKey: source.apiKey },
		legacyPath: "tools.web.x_search.apiKey",
		targetPath: "plugins.entries.xai.config.webSearch.apiKey",
		mergeMode: "own-api-key",
		...Object.keys(retained).length === 0 ? { activatedMessage: "Removed empty tools.web.x_search." } : {}
	} });
	return {
		retained,
		deleteSource: Object.keys(retained).length === 0,
		steps
	};
}
/** List legacy tools.web.search provider config paths present in raw config. */
function listLegacyWebSearchConfigPaths(raw) {
	const source = resolveWebSlot(raw, "search");
	if (!source) return [];
	const paths = Object.hasOwn(source, "apiKey") ? ["tools.web.search.apiKey"] : [];
	for (const providerId of legacySearchProviderIds()) if (isRecord(source[providerId])) paths.push(...Object.keys(source[providerId]).map((key) => `tools.web.search.${providerId}.${key}`));
	return paths;
}
/** Move legacy web-search provider config into provider plugin entries. */
function migrateLegacyWebSearchConfig(raw) {
	return migrateLegacyWebSlot(raw, "search", prepareWebSearch);
}
/** Move legacy Firecrawl web-fetch config into plugin-owned config. */
function migrateLegacyWebFetchConfig(raw) {
	return migrateLegacyWebSlot(raw, "fetch", prepareWebFetch);
}
/** Move legacy X search auth and repair retired legacy model defaults. */
function migrateLegacyXSearchConfig(raw) {
	return migrateLegacyWebSlot(raw, "x_search", prepareXSearch);
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.providers.ts
const LEGACY_OPENAI_CODEX_PLUGIN_ID = "openai-codex";
const OPENAI_PLUGIN_ID = "openai";
const LEGACY_CODEX_SUPERVISOR_PLUGIN_ID = "codex-supervisor";
const CODEX_PLUGIN_ID = "codex";
function normalizePluginIdForMigration(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : void 0;
}
const X_SEARCH_RULE = {
	path: [
		"tools",
		"web",
		"x_search",
		"apiKey"
	],
	message: "tools.web.x_search.apiKey moved to the xAI plugin; use plugins.entries.xai.config.webSearch.apiKey instead. Run \"openclaw doctor --fix\"."
};
const X_SEARCH_MODEL_RULE = {
	path: [
		"tools",
		"web",
		"x_search",
		"model"
	],
	message: "tools.web.x_search.model uses a retired xAI model; run \"openclaw doctor --fix\" to repair it.",
	requireSourceLiteral: true,
	match: (value) => resolveLegacyXSearchModelTarget(value) !== void 0
};
function rewritePluginIdList(value, legacyPluginId, replacementPluginId) {
	if (!Array.isArray(value)) return {
		next: value,
		changed: false
	};
	let changed = false;
	const seen = /* @__PURE__ */ new Set();
	const next = [];
	for (const entry of value) {
		const matchesLegacy = normalizePluginIdForMigration(entry) === legacyPluginId;
		if (matchesLegacy && replacementPluginId === void 0) {
			changed = true;
			continue;
		}
		const replacement = matchesLegacy ? replacementPluginId : entry;
		if (replacement !== entry) changed = true;
		if (typeof replacement === "string") {
			const normalizedReplacement = normalizePluginIdForMigration(replacement) ?? replacement;
			if (seen.has(normalizedReplacement)) {
				changed = true;
				continue;
			}
			seen.add(normalizedReplacement);
		}
		next.push(replacement);
	}
	return {
		next,
		changed
	};
}
function rewritePluginSlots(value) {
	if (!isRecord(value)) return false;
	let changed = false;
	for (const [slot, pluginId] of Object.entries(value)) if (pluginId === LEGACY_OPENAI_CODEX_PLUGIN_ID) {
		value[slot] = OPENAI_PLUGIN_ID;
		changed = true;
	}
	return changed;
}
function rewritePluginEntries(value) {
	if (!isRecord(value) || !(LEGACY_OPENAI_CODEX_PLUGIN_ID in value)) return false;
	if (!(OPENAI_PLUGIN_ID in value)) value[OPENAI_PLUGIN_ID] = value[LEGACY_OPENAI_CODEX_PLUGIN_ID];
	delete value[LEGACY_OPENAI_CODEX_PLUGIN_ID];
	return true;
}
function rewriteLegacyOpenAICodexPluginPolicy(raw) {
	const plugins = isRecord(raw.plugins) ? raw.plugins : void 0;
	if (!plugins) return [];
	const changes = [];
	for (const key of ["allow", "deny"]) {
		const rewritten = rewritePluginIdList(plugins[key], LEGACY_OPENAI_CODEX_PLUGIN_ID, OPENAI_PLUGIN_ID);
		if (rewritten.changed) {
			plugins[key] = rewritten.next;
			changes.push(`Rewrote plugins.${key} openai-codex references to openai.`);
		}
	}
	if (rewritePluginEntries(plugins.entries)) changes.push("Rewrote plugins.entries.openai-codex to plugins.entries.openai.");
	if (rewritePluginSlots(plugins.slots)) changes.push("Rewrote plugins.slots openai-codex references to openai.");
	return changes;
}
function migrateLegacyCodexSupervisorEntry(entries, legacySupervisorDenied) {
	const legacyEntryKey = Object.keys(entries).find((key) => normalizePluginIdForMigration(key) === LEGACY_CODEX_SUPERVISOR_PLUGIN_ID);
	if (!legacyEntryKey) return null;
	const rawLegacyEntry = entries[legacyEntryKey];
	if (!isRecord(rawLegacyEntry)) {
		delete entries[legacyEntryKey];
		return "removed-invalid";
	}
	const legacyEntry = rawLegacyEntry;
	const migratedEnabled = legacyEntry.enabled === true && !legacySupervisorDenied;
	const codexEntryKey = Object.keys(entries).find((key) => normalizePluginIdForMigration(key) === CODEX_PLUGIN_ID) ?? CODEX_PLUGIN_ID;
	const codexEntry = ensureRecord(entries, codexEntryKey);
	if (migratedEnabled && codexEntry.enabled === void 0) codexEntry.enabled = true;
	const supervision = ensureRecord(ensureRecord(codexEntry, "config"), "supervision");
	const legacyConfig = isRecord(legacyEntry.config) ? legacyEntry.config : void 0;
	const migratedSupervision = { enabled: migratedEnabled };
	if (Array.isArray(legacyConfig?.endpoints)) migratedSupervision.endpoints = legacyConfig.endpoints;
	if (typeof legacyConfig?.allowRawTranscripts === "boolean") migratedSupervision.allowRawTranscripts = legacyConfig.allowRawTranscripts;
	if (typeof legacyConfig?.allowWriteControls === "boolean") migratedSupervision.allowWriteControls = legacyConfig.allowWriteControls;
	mergeMissing(supervision, migratedSupervision);
	delete entries[legacyEntryKey];
	return "migrated";
}
function migrateLegacyCodexSupervisorPlugin(raw) {
	const plugins = isRecord(raw.plugins) ? raw.plugins : void 0;
	if (!plugins) return [];
	const changes = [];
	const legacySupervisorDenied = Array.isArray(plugins.deny) && plugins.deny.some((entry) => normalizePluginIdForMigration(entry) === LEGACY_CODEX_SUPERVISOR_PLUGIN_ID);
	const entries = isRecord(plugins.entries) ? plugins.entries : void 0;
	const entryMigration = entries ? migrateLegacyCodexSupervisorEntry(entries, legacySupervisorDenied) : null;
	if (entryMigration === "migrated") changes.push("Moved plugins.entries.codex-supervisor to plugins.entries.codex.config.supervision.");
	else if (entryMigration === "removed-invalid") changes.push("Removed invalid plugins.entries.codex-supervisor config.");
	const rewrittenAllow = rewritePluginIdList(plugins.allow, LEGACY_CODEX_SUPERVISOR_PLUGIN_ID, CODEX_PLUGIN_ID);
	if (rewrittenAllow.changed) {
		plugins.allow = rewrittenAllow.next;
		changes.push("Rewrote plugins.allow codex-supervisor references to codex.");
	}
	const rewrittenDeny = rewritePluginIdList(plugins.deny, LEGACY_CODEX_SUPERVISOR_PLUGIN_ID);
	if (rewrittenDeny.changed) {
		plugins.deny = rewrittenDeny.next;
		changes.push("Removed plugins.deny codex-supervisor references.");
	}
	return changes;
}
/** Legacy config migration specs for provider/plugin runtime config compatibility. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_PROVIDERS = [
	defineLegacyConfigMigration({
		id: "plugins.codex-supervisor->plugins.codex.config.supervision",
		describe: "Move retired Codex Supervisor config into the Codex plugin",
		legacyRules: [{
			path: ["plugins"],
			message: "plugins.entries.codex-supervisor and related plugin policy references are retired; use plugins.entries.codex.config.supervision. Run \"openclaw doctor --fix\".",
			requireSourceLiteral: true,
			match: (_value, root) => migrateLegacyCodexSupervisorPlugin(structuredClone(root)).length > 0
		}],
		apply: (raw, changes) => {
			changes.push(...migrateLegacyCodexSupervisorPlugin(raw));
		}
	}),
	defineLegacyConfigMigration({
		id: "plugins.openai-codex->plugins.openai",
		describe: "Rewrite retired OpenAI Codex plugin policy ids",
		legacyRules: [{
			path: ["plugins"],
			message: "plugins.openai-codex references are retired; use the openai plugin id. Run \"openclaw doctor --fix\".",
			requireSourceLiteral: true,
			match: (_value, root) => rewriteLegacyOpenAICodexPluginPolicy(structuredClone(root)).length > 0
		}],
		apply: (raw, changes) => {
			changes.push(...rewriteLegacyOpenAICodexPluginPolicy(raw));
		}
	}),
	defineLegacyConfigMigration({
		id: "tools.web.x_search.apiKey->plugins.entries.xai.config.webSearch.apiKey",
		describe: "Move legacy x_search auth and repair retired xAI model defaults",
		legacyRules: [X_SEARCH_RULE, X_SEARCH_MODEL_RULE],
		apply: (raw, changes) => {
			const migrated = migrateLegacyXSearchConfig(raw);
			if (!migrated.changes.length) return;
			for (const key of Object.keys(raw)) delete raw[key];
			Object.assign(raw, migrated.config);
			changes.push(...migrated.changes);
		}
	})
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.config-tranche.ts
function stripRetiredPresentationPrefs(raw, changes) {
	const prefs = asNullableRecord(asNullableRecord(raw.ui)?.prefs);
	if (!prefs) return;
	const removed = [
		"chatMessageMaxWidth",
		"textScale",
		"sidebarLiveActivity",
		"showAdvancedSettings"
	].filter((key) => {
		if (!Object.hasOwn(prefs, key)) return false;
		delete prefs[key];
		return true;
	});
	if (removed.length > 0) changes.push(`Removed browser-local ui.prefs keys: ${removed.map((key) => `ui.prefs.${key}`).join(", ")}.`);
	const ui = asNullableRecord(raw.ui);
	if (Object.keys(prefs).length === 0) delete ui?.prefs;
	if (ui && Object.keys(ui).length === 0) delete raw.ui;
}
function stripRetiredAgentConfig(raw, changes) {
	const agents = asNullableRecord(raw.agents);
	const defaults = asNullableRecord(agents?.defaults);
	let removedContextLimits = false;
	const stripContextLimits = (owner) => {
		for (const key of ["memoryGetDefaultLines", "toolResultMaxChars"]) removedContextLimits = deleteRetiredPath(owner, ["contextLimits", key]) || removedContextLimits;
	};
	if (defaults) stripContextLimits(defaults);
	let removedTypingOverride = false;
	visitAgentEntries(raw, (entry) => {
		if (Object.hasOwn(entry, "typingIntervalSeconds")) {
			delete entry.typingIntervalSeconds;
			removedTypingOverride = true;
		}
		stripContextLimits(entry);
	});
	if (removedTypingOverride) changes.push("Removed per-agent typingIntervalSeconds overrides; agents.defaults.typingIntervalSeconds now applies to every agent.");
	if (removedContextLimits) changes.push("Removed contextLimits.memoryGetDefaultLines/toolResultMaxChars overrides; canonical memory and context-window caps now apply.");
}
function readLegacyDebounce(path, owner, accountId) {
	if (!Object.hasOwn(owner, "debounceMs")) return null;
	const raw = owner.debounceMs;
	delete owner.debounceMs;
	return {
		path,
		...accountId ? { accountId } : {},
		...typeof raw === "number" && Number.isInteger(raw) && raw >= 0 ? { value: raw } : {}
	};
}
function migrateWhatsAppDebounce(raw, changes) {
	const whatsapp = asNullableRecord(asNullableRecord(raw.channels)?.whatsapp);
	if (!whatsapp) return;
	const sources = [];
	const rootSource = readLegacyDebounce("channels.whatsapp.debounceMs", whatsapp);
	if (rootSource) sources.push(rootSource);
	const accounts = asNullableRecord(whatsapp.accounts);
	if (accounts) for (const accountId of Object.keys(accounts).toSorted()) {
		const account = asNullableRecord(accounts[accountId]);
		if (!account) continue;
		const source = readLegacyDebounce(`channels.whatsapp.accounts.${accountId}.debounceMs`, account, normalizeAccountId(accountId));
		if (source) sources.push(source);
	}
	if (sources.length === 0) return;
	const validSources = sources.filter((source) => source.value !== void 0);
	if (validSources.length === 0) {
		changes.push(`Removed invalid WhatsApp debounce values: ${sources.map((source) => source.path).join(", ")}.`);
		return;
	}
	const inbound = ensureRecord(ensureRecord(raw, "messages"), "inbound");
	const byChannel = ensureRecord(inbound, "byChannel");
	if (byChannel.whatsapp !== void 0) {
		changes.push(`Removed ${sources.map((source) => source.path).join(", ")} (messages.inbound.byChannel.whatsapp already set).`);
		return;
	}
	const configuredDefaultAccount = normalizeAccountId(typeof whatsapp.defaultAccount === "string" ? whatsapp.defaultAccount : void 0);
	const selected = validSources.find((source) => source.accountId === configuredDefaultAccount) ?? validSources.find((source) => source.accountId === "default") ?? validSources.find((source) => source.path === "channels.whatsapp.debounceMs") ?? validSources[0];
	if (!selected) return;
	byChannel.whatsapp = selected.value;
	if (new Set(validSources.map((source) => source.value)).size === 1 && validSources.length === sources.length) changes.push(`Moved ${sources.map((source) => source.path).join(", ")} → messages.inbound.byChannel.whatsapp.`);
	else changes.push(`Collapsed conflicting WhatsApp debounce values into messages.inbound.byChannel.whatsapp using ${selected.path} (${selected.value} ms); account-specific debounce is no longer supported.`);
}
function migrateConfigTranche(raw, changes) {
	stripRetiredPresentationPrefs(raw, changes);
	if (deleteRetiredPath(raw, [
		"skills",
		"load",
		"watchDebounceMs"
	])) changes.push("Removed skills.load.watchDebounceMs; the watcher now uses the 250 ms default.");
	stripRetiredAgentConfig(raw, changes);
	migrateWhatsAppDebounce(raw, changes);
}
function hasConfigTrancheLegacyKeys(root) {
	const changes = [];
	migrateConfigTranche(structuredClone(root), changes);
	return changes.length > 0;
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.retired-media.ts
function migrateDiscordVoice(raw, changes) {
	visitChannelEntries(raw, "discord", (entry, path) => {
		const realtime = asNullableRecord(asNullableRecord(entry.voice)?.realtime);
		moveLegacyConfigKey(realtime, "voice", "speakerVoice", `${path}.voice.realtime`, changes);
	});
}
function hasDiscordRealtimeVoice(value) {
	const discord = asNullableRecord(value);
	if (!discord) return false;
	const hasAlias = (entry) => {
		const realtime = asNullableRecord(asNullableRecord(asNullableRecord(entry)?.voice)?.realtime);
		return realtime ? Object.hasOwn(realtime, "voice") : false;
	};
	if (hasAlias(discord)) return true;
	const accounts = asNullableRecord(discord.accounts);
	return accounts ? Object.values(accounts).some(hasAlias) : false;
}
function mapDeepgram(value) {
	const mapped = {};
	if (typeof value.detectLanguage === "boolean") mapped.detect_language = value.detectLanguage;
	if (typeof value.punctuate === "boolean") mapped.punctuate = value.punctuate;
	if (typeof value.smartFormat === "boolean") mapped.smart_format = value.smartFormat;
	return mapped;
}
function migrateDeepgramOwner(owner, path, changes) {
	const legacy = asNullableRecord(owner.deepgram);
	if (!legacy) return;
	const providerOptions = asNullableRecord(owner.providerOptions) ?? {};
	const canonical = asNullableRecord(providerOptions.deepgram) ?? {};
	providerOptions.deepgram = {
		...mapDeepgram(legacy),
		...canonical
	};
	owner.providerOptions = providerOptions;
	delete owner.deepgram;
	changes.push(`Moved ${path}.deepgram → ${path}.providerOptions.deepgram.`);
}
function migrateMediaDeepgram(raw, changes) {
	const media = asNullableRecord(asNullableRecord(raw.tools)?.media);
	if (!media) return;
	const migrateModels = (models, path) => {
		if (!Array.isArray(models)) return;
		models.forEach((value, index) => {
			const model = asNullableRecord(value);
			if (model) migrateDeepgramOwner(model, `${path}[${index}]`, changes);
		});
	};
	migrateModels(media.models, "tools.media.models");
	for (const capability of [
		"audio",
		"image",
		"video"
	]) {
		const entry = asNullableRecord(media[capability]);
		if (!entry) continue;
		migrateDeepgramOwner(entry, `tools.media.${capability}`, changes);
		migrateModels(entry.models, `tools.media.${capability}.models`);
	}
}
function hasMediaDeepgram(value) {
	const media = asNullableRecord(value);
	if (!media) return false;
	const hasAlias = (entry) => {
		const owner = asNullableRecord(entry);
		return owner ? Object.hasOwn(owner, "deepgram") : false;
	};
	const modelsHaveAlias = (models) => Array.isArray(models) && models.some(hasAlias);
	if (modelsHaveAlias(media.models)) return true;
	return [
		"audio",
		"image",
		"video"
	].some((capability) => {
		const entry = asNullableRecord(media[capability]);
		return entry ? hasAlias(entry) || modelsHaveAlias(entry.models) : false;
	});
}
const RETIRED_LOOP_DETECTION_PATHS = [
	[
		"tools",
		"loopDetection",
		"genericRepeat"
	],
	[
		"tools",
		"loopDetection",
		"knownPollNoProgress"
	],
	[
		"tools",
		"loopDetection",
		"pingPong"
	],
	[
		"tools",
		"loopDetection",
		"windowSize"
	],
	[
		"tools",
		"loopDetection",
		"historySize"
	],
	[
		"tools",
		"loopDetection",
		"warningThreshold"
	],
	[
		"tools",
		"loopDetection",
		"unknownToolThreshold"
	],
	[
		"tools",
		"loopDetection",
		"criticalThreshold"
	],
	[
		"tools",
		"loopDetection",
		"globalCircuitBreakerThreshold"
	],
	[
		"tools",
		"loopDetection",
		"detectors"
	],
	[
		"tools",
		"loopDetection",
		"postCompactionGuard"
	]
];
const RETIRED_MEMORY_SEARCH_PATHS = [
	[
		"memory",
		"search",
		"chunking"
	],
	[
		"memory",
		"search",
		"sync",
		"watchDebounceMs"
	],
	[
		"memory",
		"search",
		"sync",
		"intervalMinutes"
	],
	[
		"memory",
		"search",
		"query",
		"hybrid",
		"vectorWeight"
	],
	[
		"memory",
		"search",
		"query",
		"hybrid",
		"textWeight"
	],
	[
		"memory",
		"search",
		"query",
		"hybrid",
		"candidateMultiplier"
	],
	[
		"memory",
		"search",
		"query",
		"hybrid",
		"mmr",
		"lambda"
	],
	[
		"memory",
		"search",
		"query",
		"hybrid",
		"temporalDecay",
		"halfLifeDays"
	],
	[
		"memory",
		"search",
		"cache",
		"maxEntries"
	]
];
const RETIRED_TUNING_PATHS = [
	["systemAgent"],
	["marketplaces"],
	[
		"cli",
		"banner",
		"taglineMode"
	],
	["commitments"],
	["auth", "cooldowns"],
	["secrets", "resolution"],
	["browser", "remoteCdpTimeoutMs"],
	["browser", "remoteCdpHandshakeTimeoutMs"],
	["browser", "localLaunchTimeoutMs"],
	["browser", "localCdpReadyTimeoutMs"],
	["browser", "actionTimeoutMs"],
	["browser", "cdpPortRangeStart"],
	[
		"browser",
		"tabCleanup",
		"idleMinutes"
	],
	[
		"browser",
		"tabCleanup",
		"maxTabsPerSession"
	],
	[
		"browser",
		"tabCleanup",
		"sweepMinutes"
	],
	...RETIRED_LOOP_DETECTION_PATHS,
	["gateway", "handshakeTimeoutMs"],
	["gateway", "channelHealthCheckMinutes"],
	["gateway", "channelStaleEventThresholdMinutes"],
	["gateway", "channelMaxRestartsPerHour"],
	[
		"gateway",
		"reload",
		"debounceMs"
	],
	[
		"gateway",
		"reload",
		"deferralTimeoutMs"
	],
	[
		"gateway",
		"http",
		"endpoints",
		"chatCompletions",
		"maxBodyBytes"
	],
	[
		"gateway",
		"http",
		"endpoints",
		"chatCompletions",
		"maxImageParts"
	],
	[
		"gateway",
		"http",
		"endpoints",
		"chatCompletions",
		"maxTotalImageBytes"
	],
	[
		"gateway",
		"http",
		"endpoints",
		"responses",
		"maxBodyBytes"
	],
	["session", "typingIntervalSeconds"],
	["session", "writeLock"],
	[
		"session",
		"agentToAgent",
		"maxPingPongTurns"
	],
	["cron", "maxConcurrentRuns"],
	[
		"cron",
		"triggers",
		"minIntervalMs"
	],
	["cron", "retry"],
	["diagnostics", "stuckSessionWarnMs"],
	["diagnostics", "stuckSessionAbortMs"],
	["diagnostics", "memoryPressureSnapshot"],
	["diagnostics", "memoryPressureBundle"],
	["web", "heartbeatSeconds"],
	["web", "reconnect"],
	["web", "whatsapp"],
	[
		"messages",
		"queue",
		"debounceMs"
	],
	[
		"messages",
		"statusReactions",
		"timing"
	],
	[
		"acp",
		"stream",
		"coalesceIdleMs"
	],
	[
		"acp",
		"stream",
		"maxChunkChars"
	],
	[
		"acp",
		"stream",
		"maxOutputChars"
	],
	[
		"acp",
		"stream",
		"maxSessionUpdateChars"
	],
	[
		"acp",
		"stream",
		"hiddenBoundarySeparator"
	],
	["acp", "maxConcurrentSessions"],
	[
		"acp",
		"runtime",
		"ttlMinutes"
	],
	["worktrees"],
	["transcripts", "maxUtterances"],
	["hooks", "maxBodyBytes"],
	[
		"update",
		"auto",
		"stableDelayHours"
	],
	[
		"update",
		"auto",
		"stableJitterHours"
	],
	[
		"update",
		"auto",
		"betaCheckIntervalHours"
	],
	...RETIRED_MEMORY_SEARCH_PATHS,
	[
		"channels",
		"*",
		"streaming",
		"progress",
		"render"
	],
	[
		"channels",
		"*",
		"accounts",
		"*",
		"streaming",
		"progress",
		"render"
	]
];
const RETIRED_AGENT_TUNING_PATHS = [
	["compaction", "reserveTokens"],
	["compaction", "reserveTokensFloor"],
	["compaction", "maxHistoryShare"],
	["contextPruning", "keepLastAssistants"],
	["contextPruning", "softTrimRatio"],
	["contextPruning", "hardClearRatio"],
	["contextPruning", "minPrunableToolChars"],
	["contextPruning", "softTrim"],
	...RETIRED_MEMORY_SEARCH_PATHS,
	["runRetries"],
	...RETIRED_LOOP_DETECTION_PATHS
];
function stripRetiredTuningKnobs(raw, changes) {
	const removed = [];
	for (const path of RETIRED_TUNING_PATHS) deleteRetiredPath(raw, path, removed);
	visitAgentConfigScopes(raw, (agent, prefix) => {
		for (const path of RETIRED_AGENT_TUNING_PATHS) deleteRetiredPath(agent, path, removed, `${prefix}.`);
	});
	if (removed.length > 0) changes?.push(`Removed retired runtime tuning knobs: ${JSON.stringify(removed.join(", ")).slice(1, -1)}; built-in defaults now apply.`);
	return removed.length > 0;
}
const MEDIA_CAPABILITIES = [
	"image",
	"audio",
	"video"
];
function stableConfigValue(value) {
	if (Array.isArray(value)) return value.map(stableConfigValue);
	const record = asNullableRecord(value);
	if (!record) return value;
	return Object.fromEntries(Object.keys(record).toSorted().map((key) => [key, stableConfigValue(record[key])]));
}
function mediaModelSignature(model) {
	const { capabilities: _capabilities, ...rest } = model;
	return JSON.stringify(stableConfigValue(rest));
}
function scopeLegacyMediaModel(model, capability) {
	if (Array.isArray(model.capabilities) && !model.capabilities.some((value) => value === capability)) return;
	return {
		...model,
		capabilities: [capability]
	};
}
function hasLegacyMediaCapabilityConfig(value) {
	const media = asNullableRecord(value);
	return MEDIA_CAPABILITIES.some((capability) => {
		const config = asNullableRecord(media?.[capability]);
		return Array.isArray(config?.models);
	});
}
function consolidateMediaCapabilityConfig(raw, changes) {
	const media = asNullableRecord(asNullableRecord(raw.tools)?.media);
	if (!media) return;
	const sharedModels = Array.isArray(media.models) ? media.models.filter(isRecord) : [];
	const migratedModels = [];
	let changed = false;
	for (const capability of MEDIA_CAPABILITIES) {
		const config = asNullableRecord(media[capability]);
		if (!config) continue;
		const legacyModels = Array.isArray(config.models) ? config.models.filter(isRecord) : [];
		const migratedSignatures = /* @__PURE__ */ new Set();
		for (const legacyModel of legacyModels) {
			const migrated = scopeLegacyMediaModel(legacyModel, capability);
			if (!migrated) continue;
			const signature = mediaModelSignature(migrated);
			if (migratedSignatures.has(signature)) continue;
			migratedSignatures.add(signature);
			migratedModels.push(migrated);
		}
		if (Object.hasOwn(config, "models")) {
			delete config.models;
			changed = true;
		}
		if (Object.keys(config).length === 0) delete media[capability];
		changed = changed || legacyModels.length > 0;
	}
	const canonicalModels = [...migratedModels, ...sharedModels];
	if (canonicalModels.length > 0) media.models = canonicalModels;
	if (changed) changes.push("Consolidated tools.media image/audio/video model settings into capability-tagged tools.media.models entries.");
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.retired-memory-qmd.ts
const rule$1 = (path, message, match) => ({
	path,
	message: `${message} Run "openclaw doctor --fix".`,
	...match ? { match } : {}
});
function hasRetiredAgentMemoryQmd(value) {
	const memory = asNullableRecord(asNullableRecord(value)?.memory);
	const search = asNullableRecord(memory?.search);
	return Boolean(search && Object.hasOwn(search, "qmd"));
}
function readRetiredQmdExternalPaths(value) {
	if (!Array.isArray(value)) return [];
	const paths = [];
	for (const candidate of value) {
		const entry = asNullableRecord(candidate);
		const path = typeof entry?.path === "string" ? entry.path.trim() : "";
		if (!path) continue;
		const pattern = typeof entry?.pattern === "string" ? entry.pattern.trim() : "";
		paths.push({
			path,
			...pattern ? { pattern } : {}
		});
	}
	return paths;
}
function migrateRetiredQmdExternalPaths(params) {
	if (params.entries.length === 0) return;
	const memory = ensureRecord(params.scope, "memory");
	const search = ensureRecord(memory, "search");
	const existingPaths = normalizeConfiguredMemoryExtraPaths(Array.isArray(search.extraPaths) ? search.extraPaths.filter((entry) => typeof entry === "string" || typeof asNullableRecord(entry)?.path === "string") : []);
	const nextPaths = [...existingPaths];
	const entryKey = (entry) => typeof entry === "string" ? `${entry}\0` : `${entry.path}\0${entry.pattern?.trim() ?? ""}`;
	const seen = new Set(existingPaths.map(entryKey));
	let added = 0;
	for (const entry of params.entries) {
		const nextEntry = entry.pattern ? entry : entry.path;
		const key = entryKey(nextEntry);
		if (seen.has(key)) continue;
		seen.add(key);
		nextPaths.push(nextEntry);
		added += 1;
	}
	if (added > 0) {
		search.extraPaths = nextPaths;
		params.changes.push(`Migrated ${added} external QMD path${added === 1 ? "" : "s"} from ${params.sourcePath} → ${params.targetPath}.`);
	}
}
function migrateRetiredQmdSessionIndexing(qmd, scope, sourcePath, changes, targetPath = sourcePath === "memory.qmd" ? "memory.search" : sourcePath.slice(0, -4)) {
	if (asNullableRecord(qmd?.sessions)?.enabled !== true) return;
	const search = ensureRecord(ensureRecord(scope, "memory"), "search");
	const experimental = asNullableRecord(search.experimental);
	let changed = false;
	if ((experimental || search.experimental === void 0) && experimental?.sessionMemory === void 0) {
		ensureRecord(search, "experimental").sessionMemory = true;
		changed = true;
	}
	if (search.sources === void 0 || Array.isArray(search.sources) && search.sources.length === 0) {
		search.sources = ["memory", "sessions"];
		changed = true;
	} else if (Array.isArray(search.sources) && !search.sources.includes("sessions")) {
		search.sources.push("sessions");
		changed = true;
	}
	if (changed) changes.push(`Migrated ${sourcePath}.sessions.enabled → ${targetPath}.experimental.sessionMemory and ${targetPath}.sources.`);
}
function migrateRetiredMemoryQmd(raw, changes) {
	const memory = asNullableRecord(raw.memory);
	const search = asNullableRecord(memory?.search);
	const qmd = asNullableRecord(memory?.qmd);
	const searchQmd = asNullableRecord(search?.qmd);
	migrateRetiredQmdSessionIndexing(qmd, raw, "memory.qmd", changes);
	migrateRetiredQmdSessionIndexing(searchQmd, raw, "memory.search.qmd", changes);
	migrateRetiredQmdExternalPaths({
		changes,
		entries: [...readRetiredQmdExternalPaths(qmd?.paths), ...readRetiredQmdExternalPaths(searchQmd?.extraCollections)],
		scope: raw,
		sourcePath: "memory.qmd.paths and memory.search.qmd.extraCollections",
		targetPath: "memory.search.extraPaths"
	});
	let removed = false;
	for (const path of [
		["memory", "backend"],
		["memory", "qmd"],
		[
			"memory",
			"search",
			"qmd"
		]
	]) removed = deleteRetiredPath(raw, path) || removed;
	visitAgentConfigScopes(raw, (scope, scopePath) => {
		const agentSearch = asNullableRecord(asNullableRecord(scope.memory)?.search);
		const agentSearchQmd = asNullableRecord(agentSearch?.qmd);
		const isAgentDefaults = scopePath === "agents.defaults" && agentSearch?.qmd !== void 0;
		const targetScope = isAgentDefaults ? raw : scope;
		const targetPath = isAgentDefaults ? "memory.search" : `${scopePath}.memory.search`;
		if (isAgentDefaults && agentSearch) {
			removed = deleteRetiredPath(scope, [
				"memory",
				"search",
				"qmd"
			]) || removed;
			mergeMissing(ensureRecord(ensureRecord(raw, "memory"), "search"), agentSearch);
			delete scope.memory;
		}
		migrateRetiredQmdSessionIndexing(agentSearchQmd, targetScope, `${scopePath}.memory.search.qmd`, changes, targetPath);
		migrateRetiredQmdExternalPaths({
			changes,
			entries: readRetiredQmdExternalPaths(agentSearchQmd?.extraCollections),
			scope: targetScope,
			sourcePath: `${scopePath}.memory.search.qmd.extraCollections`,
			targetPath: `${targetPath}.extraPaths`
		});
		if (!isAgentDefaults) removed = deleteRetiredPath(scope, [
			"memory",
			"search",
			"qmd"
		]) || removed;
	});
	if (removed) changes.push("Removed retired QMD memory configuration; builtin memory is now the only memory engine.");
}
const LEGACY_CONFIG_MIGRATION_RUNTIME_MEMORY_QMD = defineLegacyConfigMigration({
	id: "runtime.memory-qmd-retired",
	describe: "Remove retired QMD memory configuration",
	legacyRules: [
		rule$1(["memory", "backend"], "memory.backend is retired; builtin memory is now the only memory engine."),
		rule$1(["memory", "qmd"], "memory.qmd is retired because the QMD memory backend was removed; configured external paths migrate to memory.search.extraPaths."),
		rule$1([
			"memory",
			"search",
			"qmd"
		], "memory.search.qmd is retired because the QMD memory backend was removed; configured external collections migrate to memory.search.extraPaths."),
		rule$1([
			"agents",
			"defaults",
			"memory",
			"search",
			"qmd"
		], "agents.defaults.memory.search.qmd is retired because the QMD memory backend was removed; configured external collections migrate to memory.search.extraPaths."),
		rule$1(["agents", "entries"], "agents.entries.*.memory.search.qmd is retired because the QMD memory backend was removed; configured external collections migrate to the matching agent memory.search.extraPaths.", (value) => {
			const entries = asNullableRecord(value);
			return entries ? Object.values(entries).some(hasRetiredAgentMemoryQmd) : false;
		}),
		rule$1(["agents", "list"], "agents.list.*.memory.search.qmd is retired because the QMD memory backend was removed; configured external collections migrate to the matching agent memory.search.extraPaths.", (value) => Array.isArray(value) && value.some(hasRetiredAgentMemoryQmd))
	],
	apply: migrateRetiredMemoryQmd
});
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.tier-eval.ts
const TIER_EVAL_RETIRED_MEMORY_PATHS = [
	[
		"memory",
		"search",
		"remote",
		"nonBatchConcurrency"
	],
	[
		"memory",
		"search",
		"remote",
		"batch",
		"wait"
	],
	[
		"memory",
		"search",
		"remote",
		"batch",
		"concurrency"
	],
	[
		"memory",
		"search",
		"remote",
		"batch",
		"pollIntervalMs"
	],
	[
		"memory",
		"search",
		"remote",
		"batch",
		"timeoutMinutes"
	],
	[
		"memory",
		"search",
		"local",
		"contextSize"
	],
	[
		"memory",
		"search",
		"local",
		"modelCacheDir"
	],
	[
		"memory",
		"search",
		"store",
		"driver"
	],
	[
		"memory",
		"search",
		"sync"
	],
	[
		"memory",
		"search",
		"query",
		"hybrid"
	]
];
const TIER_EVAL_RETIRED_ROOT_PATHS = [
	[
		"cloudWorkers",
		"profiles",
		"*",
		"lifetime"
	],
	["meta", "lastTouchedAt"],
	[
		"hooks",
		"internal",
		"installs"
	],
	["cron", "store"],
	["plugins", "bundledDiscovery"],
	["tts", "prefsPath"],
	["logging", "redactSensitive"],
	["commands", "useAccessGroups"],
	[
		"gateway",
		"controlUi",
		"allowInsecureAuth"
	],
	...TIER_EVAL_RETIRED_MEMORY_PATHS
];
const TIER_EVAL_RETIRED_AGENT_PATHS = [
	["groupChat", "visibleReplies"],
	...TIER_EVAL_RETIRED_MEMORY_PATHS,
	["heartbeat", "ackMaxChars"],
	["heartbeat", "includeReasoning"],
	["heartbeat", "includeSystemPromptSection"],
	["heartbeat", "skipWhenBusy"],
	["heartbeat", "suppressToolErrorWarnings"]
];
function resolveConfiguredExecPolicy(scope) {
	const exec = asNullableRecord(asNullableRecord(scope.tools)?.exec);
	if (!exec) return;
	switch (exec.mode) {
		case "deny": return {
			security: "deny",
			ask: "off"
		};
		case "allowlist": return {
			security: "allowlist",
			ask: "off"
		};
		case "ask":
		case "auto": return {
			security: "allowlist",
			ask: "on-miss"
		};
		case "full": return {
			security: "full",
			ask: "off"
		};
	}
	const security = exec.security === "deny" || exec.security === "allowlist" || exec.security === "full" ? exec.security : void 0;
	const ask = exec.ask === "on-miss" || exec.ask === "always" || exec.ask === "off" ? exec.ask : void 0;
	return security && ask ? {
		security,
		ask
	} : void 0;
}
function migrateExecMode(scope, path, changes, inheritedPolicy) {
	const exec = asNullableRecord(asNullableRecord(scope.tools)?.exec);
	if (!exec || !Object.hasOwn(exec, "security") && !Object.hasOwn(exec, "ask")) return;
	if (exec.mode !== void 0) {
		changes.push(`Removed ${path}.tools.exec.security/ask (${path}.tools.exec.mode already set).`);
		delete exec.security;
		delete exec.ask;
		return;
	}
	const ownSecurity = exec.security === "deny" || exec.security === "allowlist" || exec.security === "full" ? exec.security : void 0;
	const ownAsk = exec.ask === "on-miss" || exec.ask === "always" || exec.ask === "off" ? exec.ask : void 0;
	if (Object.hasOwn(exec, "security") && !ownSecurity || Object.hasOwn(exec, "ask") && !ownAsk) return;
	const security = ownSecurity ?? inheritedPolicy?.security;
	const ask = ownAsk ?? inheritedPolicy?.ask;
	if (!security || !ask) return;
	const mode = resolveExactExecModeFromPolicy({
		security,
		ask
	});
	if (!mode) return;
	exec.mode = mode;
	changes.push(`Moved ${path}.tools.exec.security/ask → ${path}.tools.exec.mode.`);
	delete exec.security;
	delete exec.ask;
}
function migrateSignalEndpoint(entry, path, changes, inherited) {
	if (!Object.hasOwn(entry, "httpHost") && !Object.hasOwn(entry, "httpPort")) return;
	if (entry.httpUrl === void 0 && typeof inherited?.httpUrl === "string") {
		delete entry.httpHost;
		delete entry.httpPort;
		changes.push(`Removed ${path}.httpHost/httpPort (inherited httpUrl already set).`);
		return;
	}
	if (entry.httpUrl === void 0) {
		const rawHost = typeof (entry.httpHost ?? inherited?.httpHost) === "string" && String(entry.httpHost ?? inherited?.httpHost).trim() ? String(entry.httpHost ?? inherited?.httpHost).trim() : "127.0.0.1";
		const host = rawHost.includes(":") && !rawHost.startsWith("[") ? `[${rawHost}]` : rawHost;
		const effectivePort = entry.httpPort ?? inherited?.httpPort;
		entry.httpUrl = `http://${host}:${typeof effectivePort === "number" ? effectivePort : 8080}`;
		if (entry.autoStart === void 0) entry.autoStart = true;
		changes.push(`Moved ${path}.httpHost/httpPort → ${path}.httpUrl.`);
	} else changes.push(`Removed ${path}.httpHost/httpPort (${path}.httpUrl already set).`);
	delete entry.httpHost;
	delete entry.httpPort;
}
function migrateChannelAliases(raw, changes) {
	const signal = asNullableRecord(asNullableRecord(raw.channels)?.signal);
	if (signal) {
		const inherited = {
			httpUrl: signal.httpUrl,
			httpHost: signal.httpHost,
			httpPort: signal.httpPort
		};
		migrateSignalEndpoint(signal, "channels.signal", changes);
		const accounts = asNullableRecord(signal.accounts);
		if (accounts) for (const [accountId, value] of Object.entries(accounts)) {
			const account = asNullableRecord(value);
			if (account) migrateSignalEndpoint(account, `channels.signal.accounts.${accountId}`, changes, inherited);
		}
	}
	visitChannelEntries(raw, "googlechat", (entry, path) => {
		if (!Object.hasOwn(entry, "serviceAccountRef")) return;
		const hadServiceAccount = entry.serviceAccount !== void 0;
		entry.serviceAccount = entry.serviceAccountRef;
		delete entry.serviceAccountRef;
		changes.push(hadServiceAccount ? `Moved ${path}.serviceAccountRef → ${path}.serviceAccount (SecretRef precedence preserved).` : `Moved ${path}.serviceAccountRef → ${path}.serviceAccount.`);
	});
}
const RESPONSE_PREFIX_CHANNELS = /* @__PURE__ */ new Set([
	"buzz",
	"clickclack",
	"discord",
	"feishu",
	"googlechat",
	"imessage",
	"irc",
	"matrix",
	"mattermost",
	"msteams",
	"nextcloud-talk",
	"qa-channel",
	"signal",
	"slack",
	"telegram",
	"tlon",
	"twitch",
	"whatsapp",
	"zalo",
	"zalouser",
	"line"
]);
function migrateMessagesResponsePrefix(raw, changes) {
	const messages = asNullableRecord(raw.messages);
	if (!messages || !Object.hasOwn(messages, "responsePrefix")) return;
	const channels = asNullableRecord(raw.channels);
	const configuredChannels = channels ? Object.entries(channels).filter((entry) => entry[0] !== "defaults" && Boolean(asNullableRecord(entry[1]))) : [];
	const supported = configuredChannels.filter(([channelId]) => RESPONSE_PREFIX_CHANNELS.has(channelId));
	const unsupported = configuredChannels.map(([channelId]) => channelId).filter((channelId) => !RESPONSE_PREFIX_CHANNELS.has(channelId));
	let copied = false;
	for (const [, channel] of supported) if (channel.responsePrefix === void 0) {
		channel.responsePrefix = messages.responsePrefix;
		copied = true;
	}
	if (copied) changes.push(`Copied messages.responsePrefix to supported channel blocks while retaining the implicit/custom fallback${unsupported.length > 0 ? ` for: ${unsupported.join(", ")}` : ""}.`);
}
function migratePresenceEnabled(raw, changes) {
	const wideArea = asNullableRecord(asNullableRecord(raw.discovery)?.wideArea);
	if (!wideArea || !Object.hasOwn(wideArea, "enabled")) return false;
	if (wideArea.enabled === false && typeof wideArea.domain === "string" && wideArea.domain.trim()) {
		delete wideArea.domain;
		changes.push("Removed disabled discovery.wideArea activation fields; domain presence now enables wide-area discovery.");
	}
	delete wideArea.enabled;
	return true;
}
function migrateWebEnabled(raw, changes) {
	const web = asNullableRecord(raw.web);
	if (!web) return false;
	if (Object.hasOwn(web, "enabled")) {
		const whatsapp = ensureRecord(ensureRecord(raw, "channels"), "whatsapp");
		if (web.enabled === false && whatsapp.enabled === true) changes.push("Removed web.enabled=false (channels.whatsapp.enabled already set).");
		if (whatsapp.enabled === void 0) {
			whatsapp.enabled = web.enabled;
			changes.push("Moved web.enabled → channels.whatsapp.enabled.");
		}
	}
	delete raw.web;
	return true;
}
function stripPromptsFromTtsConfig(ttsValue, path, changes) {
	const tts = asNullableRecord(ttsValue);
	const personas = asNullableRecord(tts?.personas);
	if (personas) for (const [personaId, personaValue] of Object.entries(personas)) {
		const persona = asNullableRecord(personaValue);
		if (persona && Object.hasOwn(persona, "prompt")) {
			delete persona.prompt;
			changes.push(`Removed ${path}.personas.${personaId}.prompt; move custom shaping into a speech provider prepareSynthesis implementation.`);
		}
	}
}
function stripTtsPersonaPrompts(raw, changes) {
	stripPromptsFromTtsConfig(raw.tts, "tts", changes);
	visitAgentConfigScopes(raw, (scope, path) => {
		stripPromptsFromTtsConfig(scope.tts, `${path}.tts`, changes);
	});
	const channels = asNullableRecord(raw.channels);
	if (!channels) return;
	for (const channelId of Object.keys(channels)) visitChannelEntries(raw, channelId, (entry, path) => {
		stripPromptsFromTtsConfig(entry.tts, `${path}.tts`, changes);
		stripPromptsFromTtsConfig(asNullableRecord(entry.voice)?.tts, `${path}.voice.tts`, changes);
	});
}
function stripCompactionInstructionConfig(scope, path, changes) {
	const compaction = asNullableRecord(scope.compaction);
	if (!compaction) return;
	let stripped = false;
	for (const key of ["customInstructions", "identifierInstructions"]) if (Object.hasOwn(compaction, key)) {
		delete compaction[key];
		stripped = true;
	}
	const memoryFlush = asNullableRecord(compaction.memoryFlush);
	if (memoryFlush) {
		for (const key of ["prompt", "systemPrompt"]) if (Object.hasOwn(memoryFlush, key)) {
			delete memoryFlush[key];
			stripped = true;
		}
	}
	if (compaction.identifierPolicy === "custom") {
		compaction.identifierPolicy = "strict";
		stripped = true;
	}
	if (stripped) changes.push(`Removed ${path}.compaction custom prompt instructions; use a compaction provider summarize() implementation and before_prompt_build hooks.`);
}
function migrateTierEvalTranche(raw, changes) {
	const initialChangeCount = changes.length;
	let stripped = false;
	stripTtsPersonaPrompts(raw, changes);
	stripped = migratePresenceEnabled(raw, changes) || stripped;
	migrateChannelAliases(raw, changes);
	const session = asNullableRecord(raw.session);
	if (session && Object.hasOwn(session, "idleMinutes")) {
		const reset = asNullableRecord(session.reset) ?? { mode: "idle" };
		if (reset.idleMinutes === void 0) {
			reset.idleMinutes = session.idleMinutes;
			session.reset = reset;
			changes.push("Moved session.idleMinutes → session.reset.idleMinutes.");
		}
		delete session.idleMinutes;
		stripped = true;
	}
	const inheritedExecPolicy = resolveConfiguredExecPolicy(raw);
	migrateExecMode(raw, "root", changes);
	visitAgentConfigScopes(raw, (scope, path) => {
		stripCompactionInstructionConfig(scope, path, changes);
		if (path !== "agents.defaults") migrateExecMode(scope, path, changes, inheritedExecPolicy);
		for (const retiredPath of TIER_EVAL_RETIRED_AGENT_PATHS) stripped = deleteRetiredPath(scope, retiredPath) || stripped;
	});
	stripped = migrateWebEnabled(raw, changes) || stripped;
	migrateMessagesResponsePrefix(raw, changes);
	for (const retiredPath of TIER_EVAL_RETIRED_ROOT_PATHS) stripped = deleteRetiredPath(raw, retiredPath) || stripped;
	for (const owner of [...Object.values(asNullableRecord(asNullableRecord(raw.secrets)?.providers) ?? {}), asNullableRecord(asNullableRecord(raw.security)?.installPolicy)?.exec]) for (const key of ["allowInsecurePath", "allowSymlinkCommand"]) stripped = deleteRetiredPath(owner, [key]) || stripped;
	if (stripped || changes.length > initialChangeCount) changes.push("Applied tier-eval tranche retirements; canonical settings and built-in defaults now apply.");
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.retired.ts
const rule = (path, message, match) => ({
	path,
	message: `${message} Run "openclaw doctor --fix".`,
	...match ? { match } : {}
});
function migrateMessageCrossContext(raw, changes) {
	const globalMessage = asNullableRecord(asNullableRecord(raw.tools)?.message);
	const globalBypass = globalMessage?.allowCrossContextSend;
	const globalCrossContext = asNullableRecord(globalMessage?.crossContext);
	const migrate = (message, path, agent) => {
		if (!message) return;
		const legacy = message.allowCrossContextSend;
		const inheritedBypass = agent && globalBypass === true;
		if (legacy === void 0 && !inheritedBypass) return;
		const crossContext = asNullableRecord(message.crossContext) ?? {};
		if ((legacy ?? (agent ? globalBypass : void 0)) === true) message.crossContext = {
			...crossContext,
			allowWithinProvider: true,
			allowAcrossProviders: true
		};
		else if (inheritedBypass) message.crossContext = {
			...crossContext,
			allowWithinProvider: (crossContext.allowWithinProvider ?? globalCrossContext?.allowWithinProvider) !== false,
			allowAcrossProviders: (crossContext.allowAcrossProviders ?? globalCrossContext?.allowAcrossProviders) === true
		};
		delete message.allowCrossContextSend;
		changes.push(`Moved ${path}.allowCrossContextSend → ${path}.crossContext.`);
	};
	visitAgentConfigScopes(raw, (scope, path) => {
		if (path !== "agents.defaults") migrate(asNullableRecord(asNullableRecord(scope.tools)?.message), `${path}.tools.message`, true);
	});
	migrate(globalMessage, "tools.message", false);
}
function migrateTruncateAfterCompaction(raw, changes) {
	const compaction = asNullableRecord(asNullableRecord(asNullableRecord(raw.agents)?.defaults)?.compaction);
	if (!compaction || !Object.hasOwn(compaction, "truncateAfterCompaction")) return;
	if (compaction.truncateAfterCompaction === false && Object.hasOwn(compaction, "maxActiveTranscriptBytes")) {
		delete compaction.maxActiveTranscriptBytes;
		changes.push("Removed maxActiveTranscriptBytes to preserve truncateAfterCompaction: false.");
	}
	delete compaction.truncateAfterCompaction;
	changes.push("Removed retired agents.defaults.compaction.truncateAfterCompaction.");
}
function migrateFinalLayoutRenames(raw, changes) {
	const agents = asNullableRecord(raw.agents);
	const defaults = asNullableRecord(agents?.defaults);
	moveLegacyConfigKey(defaults, "pdfMaxBytesMb", "pdfMaxMb", "agents.defaults", changes);
	if (defaults) {
		const mediaModels = asNullableRecord(defaults.mediaModels) ?? {};
		for (const [legacyKey, canonicalKey] of [
			["imageGenerationModel", "image"],
			["videoGenerationModel", "video"],
			["musicGenerationModel", "music"]
		]) {
			if (!Object.hasOwn(defaults, legacyKey)) continue;
			if (mediaModels[canonicalKey] === void 0) {
				mediaModels[canonicalKey] = defaults[legacyKey];
				changes.push(`Moved agents.defaults.${legacyKey} → agents.defaults.mediaModels.${canonicalKey}.`);
			} else changes.push(`Removed agents.defaults.${legacyKey} (agents.defaults.mediaModels.${canonicalKey} already set).`);
			delete defaults[legacyKey];
		}
		if (Object.keys(mediaModels).length > 0) defaults.mediaModels = mediaModels;
	}
	visitAgentConfigScopes(raw, (scope, path) => {
		moveLegacyConfigKey(asNullableRecord(asNullableRecord(scope.tools)?.exec), "timeoutSec", "timeoutSeconds", `${path}.tools.exec`, changes);
		moveLegacyConfigKey(asNullableRecord(asNullableRecord(scope.sandbox)?.browser), "enableNoVnc", "noVncEnabled", `${path}.sandbox.browser`, changes);
	});
	moveLegacyConfigKey(asNullableRecord(asNullableRecord(raw.tools)?.exec), "timeoutSec", "timeoutSeconds", "tools.exec", changes);
	const env = asNullableRecord(raw.env);
	if (env) {
		const vars = asNullableRecord(env.vars) ?? {};
		let moved = false;
		for (const [key, value] of Object.entries(env)) {
			if (key === "vars" || key === "shellEnv" || typeof value !== "string") continue;
			if (vars[key] === void 0) {
				vars[key] = value;
				changes.push(`Moved env.${key} → env.vars.${key}.`);
			} else changes.push(`Removed env.${key} (env.vars.${key} already set).`);
			delete env[key];
			moved = true;
		}
		if (moved) env.vars = vars;
	}
	const browser = asNullableRecord(raw.browser);
	const ssrfPolicy = asNullableRecord(browser?.ssrfPolicy);
	if (ssrfPolicy && Array.isArray(ssrfPolicy.hostnameAllowlist)) {
		const canonical = Array.isArray(ssrfPolicy.allowedHostnames) ? ssrfPolicy.allowedHostnames : [];
		ssrfPolicy.allowedHostnames = [...new Set([...canonical, ...ssrfPolicy.hostnameAllowlist].filter((value) => typeof value === "string"))];
		delete ssrfPolicy.hostnameAllowlist;
		changes.push("Merged browser.ssrfPolicy.hostnameAllowlist → allowedHostnames.");
	}
	const legacyMedia = asNullableRecord(raw.media);
	if (legacyMedia) {
		const attachments = ensureRecord(raw, "attachments");
		mergeMissing(attachments, legacyMedia);
		delete raw.media;
		changes.push("Moved media → attachments.");
	}
	const audit = asNullableRecord(raw.audit);
	if (audit) {
		const logging = ensureRecord(raw, "logging");
		const canonicalAudit = asNullableRecord(logging.audit) ?? {};
		mergeMissing(canonicalAudit, audit);
		logging.audit = canonicalAudit;
		delete raw.audit;
		changes.push("Moved audit → logging.audit.");
	}
	const nodes = asNullableRecord(asNullableRecord(raw.gateway)?.nodes);
	if (nodes) {
		const skills = asNullableRecord(nodes.skills);
		if (skills && Object.hasOwn(skills, "enabled")) {
			if (nodes.allowSkills === void 0) nodes.allowSkills = skills.enabled;
			delete nodes.skills;
			changes.push("Moved gateway.nodes.skills.enabled → gateway.nodes.allowSkills.");
		}
		const commands = asNullableRecord(nodes.commands) ?? {};
		for (const [legacy, canonical] of [["allowCommands", "allow"], ["denyCommands", "deny"]]) {
			if (!Object.hasOwn(nodes, legacy)) continue;
			if (commands[canonical] === void 0) commands[canonical] = nodes[legacy];
			delete nodes[legacy];
			changes.push(`Moved gateway.nodes.${legacy} → gateway.nodes.commands.${canonical}.`);
		}
		if (Object.keys(commands).length > 0) nodes.commands = commands;
	}
	visitChannelEntries(raw, "slack", (entry, path) => {
		moveLegacyConfigKey(entry, "identity", "postAs", path, changes);
	});
}
function migrateFinalLayoutKills(raw, changes) {
	const defaults = asNullableRecord(asNullableRecord(raw.agents)?.defaults);
	if (defaults && Object.hasOwn(defaults, "promptOverlays")) {
		const personality = asNullableRecord(asNullableRecord(defaults.promptOverlays)?.gpt5)?.personality;
		if (personality !== void 0) {
			const openaiConfig = ensureRecord(ensureRecord(ensureRecord(ensureRecord(raw, "plugins"), "entries"), "openai"), "config");
			if (openaiConfig.personality === void 0) {
				openaiConfig.personality = personality;
				changes.push("Moved agents.defaults.promptOverlays.gpt5.personality → plugins.entries.openai.config.personality.");
			} else changes.push("Removed agents.defaults.promptOverlays.gpt5.personality (plugins.entries.openai.config.personality already set).");
		} else changes.push("Removed agents.defaults.promptOverlays; built-in behavior now applies.");
		delete defaults.promptOverlays;
	}
	for (const key of [
		"envelopeTimestamp",
		"envelopeElapsed",
		"envelopeTimezone",
		"timeFormat",
		"bootstrapPromptTruncationWarning",
		"mediaGenerationAutoProviderFallback"
	]) if (defaults && Object.hasOwn(defaults, key)) {
		delete defaults[key];
		changes.push(`Removed agents.defaults.${key}; built-in behavior now applies.`);
	}
	const diagnostics = asNullableRecord(raw.diagnostics);
	const otel = asNullableRecord(diagnostics?.otel);
	const captureContent = asNullableRecord(otel?.captureContent);
	if (otel && captureContent) {
		otel.captureContent = typeof captureContent.enabled === "boolean" ? captureContent.enabled : Object.entries(captureContent).some(([key, value]) => key !== "enabled" && value === true);
		changes.push("Collapsed diagnostics.otel.captureContent to a boolean.");
	}
	const cacheTrace = asNullableRecord(diagnostics?.cacheTrace);
	if (cacheTrace && (Object.keys(cacheTrace).some((key) => key !== "enabled") || cacheTrace.enabled !== void 0 && typeof cacheTrace.enabled !== "boolean")) {
		diagnostics.cacheTrace = { enabled: cacheTrace.enabled === true };
		changes.push("Removed diagnostics.cacheTrace detail fields; only enabled remains.");
	}
	const attachments = asNullableRecord(raw.attachments);
	if (attachments && Object.hasOwn(attachments, "preserveFilenames")) {
		delete attachments.preserveFilenames;
		changes.push("Removed attachments.preserveFilenames; temp-safe names now always apply.");
	}
	const browser = asNullableRecord(raw.browser);
	if (browser && Object.hasOwn(browser, "color")) {
		delete browser.color;
		changes.push("Removed browser.color; the built-in color now applies.");
	}
	const profiles = asNullableRecord(browser?.profiles);
	if (profiles) for (const [profileId, value] of Object.entries(profiles)) {
		const profile = asNullableRecord(value);
		if (profile && Object.hasOwn(profile, "color")) {
			delete profile.color;
			changes.push(`Removed browser.profiles.${profileId}.color.`);
		}
	}
	visitChannelEntries(raw, "discord", (entry, path) => {
		const autoPresence = asNullableRecord(entry.autoPresence);
		for (const key of [
			"healthyText",
			"degradedText",
			"exhaustedText"
		]) if (autoPresence && Object.hasOwn(autoPresence, key)) {
			delete autoPresence[key];
			changes.push(`Removed ${path}.autoPresence.${key}.`);
		}
		const components = asNullableRecord(asNullableRecord(entry.ui)?.components);
		if (components && Object.hasOwn(components, "accentColor")) {
			delete components.accentColor;
			changes.push(`Removed ${path}.ui.components.accentColor.`);
			const ui = asNullableRecord(entry.ui);
			if (Object.keys(components).length === 0 && ui) delete ui.components;
			if (ui && Object.keys(ui).length === 0) delete entry.ui;
		}
	});
	const messages = asNullableRecord(raw.messages);
	const statusReactions = asNullableRecord(messages?.statusReactions);
	if (statusReactions && Object.hasOwn(statusReactions, "emojis")) {
		delete statusReactions.emojis;
		changes.push("Removed messages.statusReactions.emojis; curated defaults now apply.");
	}
	if (messages && Object.hasOwn(messages, "removeAckAfterReply")) {
		delete messages.removeAckAfterReply;
		changes.push("Removed messages.removeAckAfterReply; acknowledgements are retained.");
	}
	visitChannelEntries(raw, "whatsapp", (entry, path) => {
		moveLegacyConfigKey(entry, "messagePrefix", "responsePrefix", path, changes);
	});
	visitChannelEntries(raw, "slack", (entry, path) => {
		const socketMode = asNullableRecord(entry.socketMode);
		for (const key of [
			"clientPingTimeout",
			"serverPingTimeout",
			"pingPongLoggingEnabled"
		]) if (socketMode && Object.hasOwn(socketMode, key)) {
			delete socketMode[key];
			changes.push(`Removed ${path}.socketMode.${key}.`);
		}
		if (socketMode && Object.keys(socketMode).length === 0) delete entry.socketMode;
	});
	visitChannelEntries(raw, "imessage", (entry, path) => {
		if (Object.hasOwn(entry, "coalesceSameSenderDms")) {
			delete entry.coalesceSameSenderDms;
			changes.push(`Removed ${path}.coalesceSameSenderDms.`);
		}
	});
	const commands = asNullableRecord(raw.commands);
	for (const key of ["ownerDisplay", "ownerDisplaySecret"]) if (commands && Object.hasOwn(commands, key)) {
		delete commands[key];
		changes.push(`Removed commands.${key}; owner ids now render raw.`);
	}
	const cron = asNullableRecord(raw.cron);
	const failureDestination = asNullableRecord(cron?.failureDestination);
	if (cron && failureDestination) {
		const failureAlert = asNullableRecord(cron.failureAlert) ?? {};
		mergeMissing(failureAlert, failureDestination);
		cron.failureAlert = failureAlert;
		delete cron.failureDestination;
		changes.push("Merged cron.failureDestination → cron.failureAlert.");
	}
	const gateway = asNullableRecord(raw.gateway);
	const reload = asNullableRecord(gateway?.reload);
	if (reload?.mode === "restart" || reload?.mode === "hot") {
		reload.mode = "hybrid";
		changes.push("Mapped gateway.reload.mode to hybrid.");
	}
	const logging = asNullableRecord(raw.logging);
	if (logging?.consoleStyle === "compact") {
		logging.consoleStyle = "pretty";
		changes.push("Mapped logging.consoleStyle compact → pretty.");
	}
	const controlUi = asNullableRecord(gateway?.controlUi);
	if (controlUi && Object.hasOwn(controlUi, "chatMessageMaxWidth")) {
		delete controlUi.chatMessageMaxWidth;
		changes.push("Removed gateway.controlUi.chatMessageMaxWidth; chat width is now browser-local.");
	}
}
function removeUiAssistantIdentity(raw, changes) {
	const ui = asNullableRecord(raw.ui);
	if (!ui || !Object.hasOwn(ui, "assistant")) return;
	delete ui.assistant;
	if (Object.keys(ui).length === 0) delete raw.ui;
	changes.push("Removed retired ui.assistant; configure agents.list[].identity instead.");
}
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_RETIRED = [
	LEGACY_CONFIG_MIGRATION_RUNTIME_MEMORY_QMD,
	defineLegacyConfigMigration({
		id: "runtime.automatic-local-model-lean",
		describe: "Remove onboarding-owned local model lean settings",
		legacyRules: [rule(["wizard", "localModelLeanAutoModel"], "wizard.localModelLeanAutoModel is retired; local models now use Tool Search without reducing their capabilities.")],
		apply: (raw, changes) => {
			const wizard = asNullableRecord(raw.wizard);
			if (!wizard || !Object.hasOwn(wizard, "localModelLeanAutoModel")) return;
			const autoModel = wizard.localModelLeanAutoModel;
			const defaults = asNullableRecord(asNullableRecord(raw.agents)?.defaults);
			const model = defaults?.model;
			const primary = typeof model === "string" ? model : asNullableRecord(model)?.primary;
			const experimental = asNullableRecord(defaults?.experimental);
			if (experimental?.localModelLean === true) {
				if (typeof autoModel === "string" && autoModel === primary) {
					delete experimental.localModelLean;
					changes.push("Removed onboarding-owned agents.defaults.experimental.localModelLean.");
				} else changes.push("Retained explicit or unowned agents.defaults.experimental.localModelLean=true; remove it or set it to false to restore the full tool capabilities through Tool Search.");
			}
			delete wizard.localModelLeanAutoModel;
			changes.push("Removed retired wizard.localModelLeanAutoModel.");
		}
	}),
	defineLegacyConfigMigration({
		id: "runtime.messages-suppress-tool-errors",
		describe: "Remove retired tool failure warning suppression",
		legacyRules: [rule(["messages", "suppressToolErrors"], "messages.suppressToolErrors is retired; tool failure warnings now appear only when a run ends without a reply.")],
		apply: (raw, changes) => {
			const messages = asNullableRecord(raw.messages);
			if (!messages || !Object.hasOwn(messages, "suppressToolErrors")) return;
			delete messages.suppressToolErrors;
			changes.push("Removed messages.suppressToolErrors (tool failure warnings now appear only when a run ends without a reply).");
		}
	}),
	defineLegacyConfigMigration({
		id: "runtime.retired-internal-hook-handlers",
		describe: "Remove retired internal hook handler registrations",
		legacyRules: [{
			path: [
				"hooks",
				"internal",
				"handlers"
			],
			message: "hooks.internal.handlers is retired. Move each module to a managed/workspace hook directory with HOOK.md + handler file before running \"openclaw doctor --fix\"; the fix removes retired registrations and does not materialize executable files."
		}],
		apply: (raw, changes) => {
			const internal = asNullableRecord(asNullableRecord(raw.hooks)?.internal);
			if (!internal || !Object.hasOwn(internal, "handlers")) return;
			delete internal.handlers;
			changes.push("Removed retired hooks.internal.handlers registrations; hook files must be migrated separately.");
			const entries = asNullableRecord(internal.entries);
			const extraDirs = asNullableRecord(internal.load)?.extraDirs;
			const hasNamedEntries = Boolean(entries && Object.keys(entries).length > 0);
			const hasExtraDirs = Array.isArray(extraDirs) && extraDirs.some((dir) => typeof dir === "string" && dir.trim().length > 0);
			if (internal.enabled === true && !hasNamedEntries && !hasExtraDirs) {
				delete internal.enabled;
				changes.push("Removed legacy-only hooks.internal.enabled to avoid enabling broad hook discovery.");
			}
		}
	}),
	defineLegacyConfigMigration({
		id: "runtime.doctor-tier-eval-tranche",
		describe: "Consolidate approved tier-eval configuration surfaces",
		legacyRules: [rule([], "Approved tier-eval configuration surfaces were consolidated.", (_value, root) => {
			const changes = [];
			migrateTierEvalTranche(structuredClone(root), changes);
			return changes.length > 0;
		})],
		apply: migrateTierEvalTranche
	}),
	defineLegacyConfigMigration({
		id: "runtime.final-layout-polish",
		describe: "Normalize final configuration layout names",
		legacyRules: [rule([], "Final layout aliases were retired.", (_value, root) => {
			const changes = [];
			migrateFinalLayoutRenames(structuredClone(root), changes);
			return changes.length > 0;
		})],
		apply: migrateFinalLayoutRenames
	}),
	defineLegacyConfigMigration({
		id: "runtime.final-layout-kills",
		describe: "Remove final layout tuning knobs",
		legacyRules: [rule([], "Final layout tuning knobs were retired.", (_value, root) => {
			const changes = [];
			migrateFinalLayoutKills(structuredClone(root), changes);
			return changes.length > 0;
		})],
		apply: migrateFinalLayoutKills
	}),
	defineLegacyConfigMigration({
		id: "runtime.media-models-consolidation",
		describe: "Consolidate per-capability media model configuration",
		legacyRules: [rule(["tools", "media"], "Per-capability media model settings moved to capability-tagged tools.media.models entries.", hasLegacyMediaCapabilityConfig)],
		apply: (raw, changes) => {
			migrateMediaDeepgram(raw, changes);
			consolidateMediaCapabilityConfig(raw, changes);
		}
	}),
	defineLegacyConfigMigration({
		id: "runtime.config-tranche",
		describe: "Migrate retired config-tranche options",
		legacyRules: [rule([], "Presentation-only preferences and duplicate tuning options moved to canonical defaults.", (_value, root) => hasConfigTrancheLegacyKeys(root))],
		apply: migrateConfigTranche
	}),
	defineLegacyConfigMigration({
		id: "runtime.tuning-knobs-purge",
		describe: "Remove retired runtime tuning knobs",
		legacyRules: [rule([], "Numeric runtime tuning knobs were retired and now use built-in defaults.", (_value, root) => stripRetiredTuningKnobs(structuredClone(root)))],
		apply: stripRetiredTuningKnobs
	}),
	defineLegacyConfigMigration({
		id: "runtime.ui-assistant-identity",
		describe: "Remove the retired UI assistant identity override",
		legacyRules: [rule(["ui", "assistant"], "ui.assistant was retired; use agents.list[].identity instead.")],
		apply: removeUiAssistantIdentity
	}),
	defineLegacyConfigMigration({
		id: "runtime.retired-config-keys",
		describe: "Migrate retired root and tool config keys",
		legacyRules: [
			rule(["tui"], "tui was retired and is ignored."),
			rule(["commands", "modelsWrite"], "commands.modelsWrite was retired and is ignored."),
			rule(["messages", "messagePrefix"], "messages.messagePrefix moved to channels.whatsapp.responsePrefix."),
			rule([
				"tools",
				"media",
				"asyncCompletion"
			], "tools.media.asyncCompletion.directSend was retired and is ignored."),
			rule([
				"tools",
				"message",
				"allowCrossContextSend"
			], "tools.message.allowCrossContextSend moved to tools.message.crossContext."),
			rule(["agents"], "Per-agent tools.message.allowCrossContextSend moved to tools.message.crossContext on the same agent.", (value) => {
				let found = false;
				visitAgentConfigScopes({ agents: value }, (scope, path) => {
					found ||= path !== "agents.defaults" && Object.hasOwn(asNullableRecord(asNullableRecord(scope.tools)?.message) ?? {}, "allowCrossContextSend");
				});
				return found;
			}),
			rule(["tools", "experimental"], "tools.experimental.planTool moved to tools.updatePlan."),
			rule([
				"talk",
				"realtime",
				"voice"
			], "talk.realtime.voice moved to talk.realtime.speakerVoice."),
			rule(["channels", "discord"], "Discord realtime voice aliases moved to speakerVoice.", hasDiscordRealtimeVoice),
			rule(["tools", "media"], "Legacy Deepgram options moved to providerOptions.deepgram.", hasMediaDeepgram),
			rule([
				"agents",
				"defaults",
				"compaction",
				"truncateAfterCompaction"
			], "agents.defaults.compaction.truncateAfterCompaction is retired; byte-triggered compaction now opts in via maxActiveTranscriptBytes alone.")
		],
		apply: (raw, changes) => {
			migrateTruncateAfterCompaction(raw, changes);
			if (Object.hasOwn(raw, "tui")) {
				delete raw.tui;
				changes.push("Removed retired tui config; the footer uses the default compact display.");
			}
			const commands = asNullableRecord(raw.commands);
			if (commands && Object.hasOwn(commands, "modelsWrite")) {
				delete commands.modelsWrite;
				changes.push("Removed retired commands.modelsWrite.");
			}
			const messages = asNullableRecord(raw.messages);
			if (messages && Object.hasOwn(messages, "messagePrefix")) {
				const whatsapp = ensureRecord(ensureRecord(raw, "channels"), "whatsapp");
				if (whatsapp.responsePrefix === void 0) {
					whatsapp.responsePrefix = messages.messagePrefix;
					changes.push("Moved messages.messagePrefix → channels.whatsapp.responsePrefix.");
				} else changes.push("Removed messages.messagePrefix (channels.whatsapp.responsePrefix already set).");
				delete messages.messagePrefix;
			}
			const media = asNullableRecord(asNullableRecord(raw.tools)?.media);
			if (media && Object.hasOwn(media, "asyncCompletion")) {
				delete media.asyncCompletion;
				changes.push("Removed retired tools.media.asyncCompletion.directSend.");
			}
			migrateMessageCrossContext(raw, changes);
			const tools = asNullableRecord(raw.tools);
			const experimentalTools = asNullableRecord(tools?.experimental);
			if (tools && experimentalTools) {
				if (Object.hasOwn(experimentalTools, "planTool") && tools.updatePlan === void 0) {
					tools.updatePlan = experimentalTools.planTool;
					changes.push("Moved tools.experimental.planTool → tools.updatePlan.");
				} else changes.push("Removed tools.experimental; tools.updatePlan now owns the switch.");
				delete tools.experimental;
			}
			const talkRealtime = asNullableRecord(asNullableRecord(raw.talk)?.realtime);
			moveLegacyConfigKey(talkRealtime, "voice", "speakerVoice", "talk.realtime", changes);
			migrateDiscordVoice(raw, changes);
			migrateMediaDeepgram(raw, changes);
		}
	})
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.secrets-egress.ts
const HOST_KEYS = ["bypassHosts", "allowedHosts"];
function isValidExactHostname(value) {
	try {
		normalizeExactAllowedHost(value);
		return true;
	} catch {
		return false;
	}
}
const LEGACY_CONFIG_MIGRATION_RUNTIME_SECRETS_EGRESS = defineLegacyConfigMigration({
	id: "runtime.secrets-egress-proxy-hosts",
	describe: "Drop unusable secret egress proxy host entries",
	legacyRules: HOST_KEYS.map((key) => ({
		path: [
			"secrets",
			"egressProxy",
			key
		],
		message: `secrets.egressProxy.${key} contains entries that are not usable hostnames. Run "openclaw doctor --fix".`,
		match: (value) => Array.isArray(value) && value.some((entry) => typeof entry !== "string" || !isValidExactHostname(entry))
	})),
	apply(raw, changes) {
		const egressProxy = asNullableRecord(asNullableRecord(raw.secrets)?.egressProxy);
		if (!egressProxy) return;
		for (const key of HOST_KEYS) {
			const hosts = egressProxy[key];
			if (!Array.isArray(hosts)) continue;
			const validHosts = hosts.filter((entry) => typeof entry === "string" && isValidExactHostname(entry));
			if (validHosts.length === hosts.length) continue;
			const invalidHosts = hosts.filter((entry) => typeof entry !== "string" || !isValidExactHostname(entry));
			if (validHosts.length > 0) egressProxy[key] = validHosts;
			else delete egressProxy[key];
			changes.push(`Removed unusable secrets.egressProxy.${key} entries: ${invalidHosts.map((entry) => JSON.stringify(entry)).join(", ")}.`);
		}
	}
});
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.session.ts
/** Match only parser-valid values that resolve to an unsafe zero-duration cutoff. */
function isZeroDuration(val) {
	if (val === false) return false;
	const normalized = normalizeStringifiedOptionalString(val);
	if (!normalized) return false;
	try {
		return parseDurationMs(normalized, { defaultUnit: "d" }) <= 0;
	} catch {
		return false;
	}
}
function hasZeroDuration(raw, key) {
	const maintenance = asNullableRecord(raw);
	if (!maintenance || !Object.hasOwn(maintenance, key)) return false;
	return isZeroDuration(maintenance[key]);
}
/** Legacy config migration specs for session runtime config compatibility. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_SESSION = [
	defineLegacyConfigMigration({
		id: "session.canonical-aliases",
		describe: "Move session aliases to canonical keys",
		legacyRules: [{
			path: [
				"session",
				"maintenance",
				"pruneDays"
			],
			message: "session.maintenance.pruneDays was renamed to pruneAfter. Run \"openclaw doctor --fix\"."
		}, {
			path: [
				"session",
				"resetByType",
				"dm"
			],
			message: "session.resetByType.dm was renamed to direct. Run \"openclaw doctor --fix\"."
		}],
		apply: (raw, changes) => {
			const session = asNullableRecord(raw.session);
			for (const [section, legacy, canonical] of [[
				"maintenance",
				"pruneDays",
				"pruneAfter"
			], [
				"resetByType",
				"dm",
				"direct"
			]]) {
				const owner = asNullableRecord(session?.[section]);
				moveLegacyConfigKey(owner, legacy, canonical, `session.${section}`, changes);
			}
		}
	}),
	defineLegacyConfigMigration({
		id: "session.maintenance.rotateBytes",
		describe: "Remove deprecated session.maintenance.rotateBytes",
		legacyRules: [{
			path: ["session", "maintenance"],
			message: "session.maintenance.rotateBytes is deprecated and ignored; run \"openclaw doctor --fix\" to remove it.",
			match: (value) => Object.hasOwn(asNullableRecord(value) ?? {}, "rotateBytes")
		}],
		apply: (raw, changes) => {
			const maintenance = asNullableRecord(asNullableRecord(raw.session)?.maintenance);
			if (!maintenance || !Object.hasOwn(maintenance, "rotateBytes")) return;
			delete maintenance.rotateBytes;
			changes.push("Removed deprecated session.maintenance.rotateBytes.");
		}
	}),
	defineLegacyConfigMigration({
		id: "session.maintenance.zero-duration-retention",
		describe: "Remove zero-duration session maintenance values so documented defaults apply",
		legacyRules: [{
			path: ["session", "maintenance"],
			message: "session.maintenance.pruneAfter is a zero duration — this causes immediate deletion of eligible stale/non-preserved session entries. Run \"openclaw doctor --fix\" to remove it so the documented 30d default applies.",
			match: (raw) => hasZeroDuration(raw, "pruneAfter")
		}, {
			path: ["session", "maintenance"],
			message: "session.maintenance.resetArchiveRetention is a zero duration — this causes immediate deletion of all reset transcript archives. Run \"openclaw doctor --fix\" to remove it so the keep-by-default archive retention applies.",
			match: (raw) => hasZeroDuration(raw, "resetArchiveRetention")
		}],
		apply: (raw, changes) => {
			const maintenance = asNullableRecord(asNullableRecord(raw.session)?.maintenance);
			if (!maintenance) return;
			for (const key of ["resetArchiveRetention", "pruneAfter"]) {
				if (!Object.hasOwn(maintenance, key)) continue;
				const val = maintenance[key];
				if (!isZeroDuration(val)) continue;
				const label = String(val);
				delete maintenance[key];
				const outcome = key === "resetArchiveRetention" ? "keep-by-default archive retention applies" : "30d session-pruning default applies";
				changes.push(`Removed session.maintenance.${key} "${label}" (zero duration); ${outcome}.`);
			}
		}
	})
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.skills.ts
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_SKILLS = [defineLegacyConfigMigration({
	id: "skills.workshop.autonomous.enabled->mode",
	describe: "Migrate Skill Workshop autonomy to its three-position mode.",
	legacyRules: [{
		path: [
			"skills",
			"workshop",
			"autonomous",
			"enabled"
		],
		message: "skills.workshop.autonomous.enabled is retired; use skills.workshop.autonomous.mode. Run \"openclaw doctor --fix\"."
	}],
	apply: (raw, changes) => {
		const autonomous = asNullableRecord(asNullableRecord(asNullableRecord(raw.skills)?.workshop)?.autonomous);
		if (!autonomous || !Object.hasOwn(autonomous, "enabled")) return;
		if (autonomous.mode === void 0) {
			const mode = autonomous.enabled === false ? "off" : "propose";
			autonomous.mode = mode;
			changes.push(`Mapped skills.workshop.autonomous.enabled to mode: "${mode}".`);
		} else changes.push("Removed skills.workshop.autonomous.enabled because autonomous.mode is already set.");
		delete autonomous.enabled;
	}
}), defineLegacyConfigMigration({
	id: "skills.workshop.allowSymlinkTargetWrites-retired",
	describe: "Remove the retired Skill Workshop symlink write option.",
	legacyRules: [{
		path: [
			"skills",
			"workshop",
			"allowSymlinkTargetWrites"
		],
		message: "skills.workshop.allowSymlinkTargetWrites is retired; Skill Workshop writes only inside its own directory. Run \"openclaw doctor --fix\"."
	}],
	apply: (raw, changes) => {
		if (deleteRetiredPath(raw, [
			"skills",
			"workshop",
			"allowSymlinkTargetWrites"
		])) changes.push("Removed retired skills.workshop.allowSymlinkTargetWrites; Skill Workshop writes only inside its own directory.");
	}
})];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.system-agent.ts
function resolveMissingLegacySystemAgent(raw) {
	const agents = asNullableRecord(raw.agents);
	if (!agents) return;
	const defaults = asNullableRecord(agents.defaults);
	const systemAgent = asNullableRecord(defaults?.systemAgent);
	if (agents.defaults !== void 0 && !defaults || defaults?.systemAgent !== void 0 && !systemAgent || systemAgent?.agentId !== void 0) return;
	const roster = agents.entries !== void 0 ? asNullableRecord(agents.entries) : parseLegacyAgentRoster(agents.list)?.entries;
	if (!roster) return;
	const entries = Object.entries(roster).flatMap(([id, value]) => {
		const config = asNullableRecord(value);
		return config && id.trim() ? [{
			id: normalizeAgentId(id),
			config
		}] : [];
	});
	const marked = entries.filter((entry) => entry.config.default === true);
	if (entries.length < 2 || marked.length > 1 || marked.length === 1 && agents.ownership !== "explicit") return;
	const selected = marked[0] ?? entries.find((entry) => entry.id === "main");
	if (!selected) return;
	const heartbeatUnresolved = defaults?.heartbeat === void 0 && !entries.some((entry) => entry.config.heartbeat);
	return {
		agentId: selected.id,
		heartbeatUnresolved
	};
}
function findLegacySystemAgentOwnerIssue(raw) {
	const root = asNullableRecord(raw);
	return root && resolveMissingLegacySystemAgent(root) ? {
		path: "agents",
		message: "Legacy ambient operations have no system-agent owner; run \"openclaw doctor --fix\" to set agents.defaults.systemAgent.agentId from the default agent."
	} : void 0;
}
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_SYSTEM_AGENT = [defineLegacyConfigMigration({
	id: "crestodian-retired",
	describe: "Remove retired system-agent config",
	legacyRules: [{
		path: ["crestodian"],
		message: "crestodian config was retired; system-agent rescue now uses built-in policy. Run \"openclaw doctor --fix\" to remove it."
	}],
	apply: (raw, changes) => {
		if (!Object.hasOwn(raw, "crestodian")) return;
		delete raw.crestodian;
		changes.push("Removed retired crestodian config; system-agent rescue uses built-in policy.");
	}
}), defineLegacyConfigMigration({
	id: "runtime.legacy-system-agent-owner",
	describe: "Restore the legacy default agent for ambient operations",
	apply: (raw, changes) => {
		const owner = resolveMissingLegacySystemAgent(raw);
		if (!owner) return;
		const { agentId, heartbeatUnresolved } = owner;
		const defaults = ensureRecord(ensureRecord(raw, "agents"), "defaults");
		ensureRecord(defaults, "systemAgent").agentId = agentId;
		changes.push(`Set agents.defaults.systemAgent.agentId to ${agentId} for legacy ambient operations.`);
		if (heartbeatUnresolved) {
			ensureRecord(defaults, "heartbeat").agentId = agentId;
			changes.push(`Set agents.defaults.heartbeat.agentId to ${agentId} for legacy heartbeats.`);
		}
	}
})];
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_TOOL_NAMES = [{
	id: "tools.suggest-task-name",
	describe: "Migrate the task-suggestion tool in persisted tool policies",
	migration: TASK_SUGGESTION_TOOL_NAME_MIGRATION
}, {
	id: "tools.view-image-name",
	describe: "Migrate the image inspection tool in persisted tool policies",
	migration: IMAGE_INSPECTION_TOOL_NAME_MIGRATION
}].map((migration) => defineLegacyConfigMigration({
	id: migration.id,
	describe: migration.describe,
	legacyRules: TOOL_POLICY_ROOTS.map((root) => ({
		path: [root],
		message: `Tool policies still rely on legacy ${migration.migration.legacyName} coverage; run "openclaw doctor --fix" to preserve equivalent ${migration.migration.canonicalName} access.`,
		match: (value) => findLegacyToolNamePaths(value, migration.migration, [root]).length > 0
	})),
	apply: (raw, changes) => {
		if (!isRecord(raw)) return;
		const paths = TOOL_POLICY_ROOTS.flatMap((root) => migrateLegacyToolNamePolicies(raw[root], migration.migration, [root]));
		if (paths.length === 0) return;
		changes.push(`Migrated legacy ${migration.migration.legacyName} policy coverage to ${migration.migration.canonicalName} in ${paths.join(", ")}.`);
	}
}));
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.tool-policy-conflicts.ts
/** Capture independent profile/extras inheritance before changing any supplier. */
function collectProfileConsumers(raw) {
	const consumers = /* @__PURE__ */ new Map();
	const globalTools = asNullableRecord(raw.tools);
	const agentTools = [null];
	visitAgentEntries(raw, (entry) => agentTools.push(asNullableRecord(entry.tools)));
	if (!hasAgentRosterProperty(raw)) agentTools.push(asNullableRecord(asNullableRecord(asNullableRecord(raw.agents)?.defaults)?.tools));
	const add = (global, agent) => {
		const supplier = Array.isArray(agent?.alsoAllow) ? agent : Array.isArray(global?.alsoAllow) ? global : void 0;
		if (supplier) {
			const profiles = consumers.get(supplier) ?? [];
			profiles.push(agent?.profile ?? global?.profile);
			consumers.set(supplier, profiles);
		}
	};
	for (const agent of agentTools) {
		add(globalTools, agent);
		const globalProviders = asNullableRecord(globalTools?.byProvider) ?? void 0;
		const agentProviders = asNullableRecord(agent?.byProvider) ?? void 0;
		const contexts = /* @__PURE__ */ new Set();
		for (const key of [...Object.keys(globalProviders ?? {}), ...Object.keys(agentProviders ?? {})]) {
			const normalized = normalizeToolProviderPolicyKey(key);
			const slash = normalized.indexOf("/");
			contexts.add(normalized);
			contexts.add(slash < 0 ? normalized : normalized.slice(0, slash));
		}
		for (const context of contexts) {
			const slash = context.indexOf("/");
			const selection = {
				modelProvider: slash < 0 ? context : context.slice(0, slash),
				modelId: slash < 0 ? void 0 : context.slice(slash + 1)
			};
			const global = resolveProviderToolPolicyEntry({
				...selection,
				byProvider: globalProviders
			});
			const local = resolveProviderToolPolicyEntry({
				...selection,
				byProvider: agentProviders
			});
			add(asNullableRecord(global?.policy), asNullableRecord(local?.policy));
		}
	}
	return consumers;
}
function profileDoesNotNeedExtras(profile, extras) {
	if (profile === void 0 || profile === null) return true;
	if (typeof profile !== "string") return false;
	const policy = resolveCoreToolProfilePolicy(profile);
	if (!policy?.allow) return false;
	if (policy.allow.includes("*")) return true;
	const normalized = normalizeToolList(extras);
	if (normalized.length > 0 && createToolPolicyMatcher({ allow: normalized })("gateway")) return false;
	const profileTokens = new Set(normalizeToolList(policy.allow));
	return normalized.every((entry) => profileTokens.has(entry));
}
function readGrantList(scope, key) {
	const list = scope[key];
	if (!Array.isArray(list) || list.length === 0) return null;
	return list.every((entry) => typeof entry === "string") ? list : null;
}
function visitConflictingToolPolicies(value, path, conflicts) {
	if (Array.isArray(value)) {
		for (const [index, entry] of value.entries()) visitConflictingToolPolicies(entry, [...path, String(index)], conflicts);
		return;
	}
	if (!isRecord(value)) return;
	if (path.at(-2) === "tools" && path.at(-1) === "sandbox") return;
	if (isToolPolicyPath(path)) {
		const allow = readGrantList(value, "allow");
		const alsoAllow = readGrantList(value, "alsoAllow");
		if (allow && alsoAllow) {
			const label = path.reduce((prefix, key) => /^[a-zA-Z_$][\w$]*$/.test(key) ? `${prefix}${prefix ? "." : ""}${key}` : `${prefix}[${JSON.stringify(key)}]`, "");
			conflicts.push({
				scope: value,
				path: label,
				allow,
				alsoAllow
			});
		}
	}
	for (const [key, entry] of Object.entries(value)) visitConflictingToolPolicies(entry, [...path, key], conflicts);
}
/** Reports tool policy scopes that set both allow and alsoAllow, without changing them. */
function findConflicts(value, path) {
	const conflicts = [];
	visitConflictingToolPolicies(value, path, conflicts);
	return conflicts;
}
/** Explain unresolved intent through Doctor's finding channel, without claiming a repair. */
function collectToolPolicyConflictWarnings(raw) {
	if (!isRecord(raw)) return [];
	return TOOL_POLICY_ROOTS.flatMap((root) => findConflicts(raw[root], [root]).map(({ path, allow, alsoAllow }) => {
		const merged = uniqueStrings([...allow, ...alsoAllow]);
		return `Left ${path}.allow=${JSON.stringify(allow)} and ${path}.alsoAllow=${JSON.stringify(alsoAllow)} unchanged: merging may change profile grants or Gateway configuration-read access. To choose the profile plus its explicit extras, remove ${path}.allow (may broaden the explicit restriction). To choose the merged allowlist without profile extras, set ${path}.allow=${JSON.stringify(merged)} and ${path}.alsoAllow=[] (may remove profile grants). Review these permissions before choosing.`;
	}));
}
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_TOOL_POLICY_CONFLICTS = [defineLegacyConfigMigration({
	id: "tools.allow-also-allow-conflict",
	describe: "Merge tool policy alsoAllow grants into allow when a scope sets both",
	legacyRules: TOOL_POLICY_ROOTS.map((root) => ({
		path: [root],
		message: "Tool policy sets both allow and alsoAllow in the same scope; run \"openclaw doctor --fix\" for a permission-preserving repair or manual guidance.",
		match: (value) => findConflicts(value, [root]).length > 0
	})),
	apply: (raw, changes) => {
		if (!isRecord(raw)) return;
		const consumers = collectProfileConsumers(raw);
		for (const root of TOOL_POLICY_ROOTS) for (const { scope, path, allow, alsoAllow } of findConflicts(raw[root], [root])) {
			if (!(consumers.get(scope) ?? []).every((profile) => profileDoesNotNeedExtras(profile, alsoAllow))) continue;
			scope.allow = uniqueStrings([...allow, ...alsoAllow]);
			scope.alsoAllow = [];
			changes.push(`Merged ${path}.alsoAllow into ${path}.allow.`);
		}
	}
})];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.tool-search.ts
const LEGACY_CONFIG_MIGRATION_RUNTIME_TOOL_SEARCH = defineLegacyConfigMigration({
	id: "tools.toolSearch.structured-only",
	describe: "Retire Tool Search code mode and its execution timeout",
	legacyRules: [{
		path: [
			"tools",
			"toolSearch",
			"mode"
		],
		match: (value) => value === "code",
		message: "Tool Search code mode (tool_search_code) is retired; use structured Tool Search. Run \"openclaw doctor --fix\"."
	}, {
		path: [
			"tools",
			"toolSearch",
			"codeTimeoutMs"
		],
		message: "tools.toolSearch.codeTimeoutMs is retired. Run \"openclaw doctor --fix\"."
	}],
	apply: (raw, changes) => {
		const toolSearch = asNullableRecord(asNullableRecord(raw.tools)?.toolSearch);
		if (!toolSearch) return;
		if (toolSearch.mode === "code") {
			toolSearch.mode = "tools";
			changes.push("Tool Search code mode (tool_search_code) is retired; using structured Tool Search.");
		}
		if (Object.hasOwn(toolSearch, "codeTimeoutMs")) {
			delete toolSearch.codeTimeoutMs;
			if (typeof toolSearch.enabled !== "boolean" && !Object.keys(toolSearch).some((key) => key !== "enabled")) toolSearch.enabled = true;
			changes.push("Removed tools.toolSearch.codeTimeoutMs; Tool Search no longer executes code.");
		}
	}
});
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.tts.ts
const LEGACY_TTS_PROVIDER_KEYS = [
	"openai",
	"elevenlabs",
	"microsoft",
	"edge"
];
const LEGACY_TTS_PLUGIN_IDS = /* @__PURE__ */ new Set(["voice-call"]);
const CHANNEL_ROOT_TTS_UNSUPPORTED_IDS = /* @__PURE__ */ new Set(["discord"]);
function isLegacyEdgeProviderId(value) {
	return typeof value === "string" && value.trim().toLowerCase() === "edge";
}
function hasLegacyTtsProviderKeys(value) {
	const tts = asNullableRecord(value);
	if (!tts) return false;
	if (isLegacyEdgeProviderId(tts.provider)) return true;
	if (LEGACY_TTS_PROVIDER_KEYS.some((key) => Object.hasOwn(tts, key))) return true;
	const providers = asNullableRecord(tts.providers);
	return Boolean(providers && Object.hasOwn(providers, "edge"));
}
function hasLegacyTtsEnabled(value) {
	return typeof asNullableRecord(value)?.enabled === "boolean";
}
function hasLegacyTtsSpeakerSelection(value) {
	for (const [config] of visitLegacyTtsSpeakerConfigs(value, "")) if ([
		"voice",
		"voiceName",
		"voiceId"
	].some((key) => Object.hasOwn(config, key))) return true;
	return false;
}
function hasLegacyTtsInLocations(raw, matcher) {
	for (const [tts] of visitKnownTtsConfigLocations(raw)) if (matcher(tts)) return true;
	return false;
}
function mergeLegacyTtsProviderConfig(tts, legacyKey, providerId, source = "tts") {
	const legacyOwner = source === "providers" ? asNullableRecord(tts.providers) : tts;
	const legacyValue = asNullableRecord(legacyOwner?.[legacyKey]);
	if (!legacyOwner || !legacyValue) return false;
	const providers = source === "providers" ? legacyOwner : ensureRecord(tts, "providers");
	const existing = asNullableRecord(providers[providerId]) ?? {};
	const merged = structuredClone(existing);
	mergeMissing(merged, legacyValue);
	providers[providerId] = merged;
	delete legacyOwner[legacyKey];
	return true;
}
function migrateLegacyTtsConfig(tts, pathLabel, changes) {
	if (!tts) return;
	if (isLegacyEdgeProviderId(tts.provider)) {
		tts.provider = "microsoft";
		changes.push(`Moved ${pathLabel}.provider "edge" → "microsoft".`);
	}
	for (const [legacyKey, providerId, source] of [
		[
			"openai",
			"openai",
			"tts"
		],
		[
			"elevenlabs",
			"elevenlabs",
			"tts"
		],
		[
			"microsoft",
			"microsoft",
			"tts"
		],
		[
			"edge",
			"microsoft",
			"providers"
		],
		[
			"edge",
			"microsoft",
			"tts"
		]
	]) {
		if (!mergeLegacyTtsProviderConfig(tts, legacyKey, providerId, source)) continue;
		const sourcePath = source === "providers" ? `${pathLabel}.providers.${legacyKey}` : `${pathLabel}.${legacyKey}`;
		changes.push(`Moved ${sourcePath} → ${pathLabel}.providers.${providerId}.`);
	}
}
function migrateLegacyTtsEnabled(tts, pathLabel, changes) {
	if (!tts || typeof tts.enabled !== "boolean") return;
	const nextAuto = tts.enabled ? "always" : "off";
	delete tts.enabled;
	if (typeof tts.auto === "string" && tts.auto.trim()) {
		changes.push(`Removed ${pathLabel}.enabled because ${pathLabel}.auto is already set.`);
		return;
	}
	tts.auto = nextAuto;
	changes.push(`Moved ${pathLabel}.enabled → ${pathLabel}.auto "${nextAuto}".`);
}
function* visitLegacySpeakerSelectionScope(value, pathLabel) {
	const scope = asNullableRecord(value);
	if (!scope) return;
	for (const [providerId, providerValue] of Object.entries(asNullableRecord(scope.providers) ?? {})) {
		const config = asNullableRecord(providerValue);
		if (!isBlockedObjectKey(providerId) && config) yield [config, `${pathLabel}.providers.${providerId}`];
	}
	for (const providerId of LEGACY_TTS_PROVIDER_KEYS) {
		const config = asNullableRecord(scope[providerId]);
		if (config) yield [config, `${pathLabel}.${providerId}`];
	}
}
function* visitLegacyTtsSpeakerConfigs(value, pathLabel) {
	const tts = asNullableRecord(value);
	yield* visitLegacySpeakerSelectionScope(tts, pathLabel);
	for (const [personaId, persona] of Object.entries(asNullableRecord(tts?.personas) ?? {})) if (!isBlockedObjectKey(personaId)) yield* visitLegacySpeakerSelectionScope(persona, `${pathLabel}.personas.${personaId}`);
}
function* visitKnownTtsConfigLocations(raw) {
	yield [asNullableRecord(raw.tts), "tts"];
	const agentTts = [];
	visitAgentEntries(raw, (entry, path) => agentTts.push([asNullableRecord(entry.tts), `${path}.tts`]));
	yield* agentTts;
	const channels = asNullableRecord(raw.channels);
	for (const [channelId, channelValue] of Object.entries(channels ?? {})) {
		if (isBlockedObjectKey(channelId)) continue;
		const channel = asNullableRecord(channelValue);
		const migrateRootTts = !CHANNEL_ROOT_TTS_UNSUPPORTED_IDS.has(channelId.trim().toLowerCase());
		if (migrateRootTts) yield [asNullableRecord(channel?.tts), `channels.${channelId}.tts`];
		yield [asNullableRecord(asNullableRecord(channel?.voice)?.tts), `channels.${channelId}.voice.tts`];
		for (const [accountId, accountValue] of Object.entries(asNullableRecord(channel?.accounts) ?? {})) {
			if (isBlockedObjectKey(accountId)) continue;
			const account = asNullableRecord(accountValue);
			if (migrateRootTts) yield [asNullableRecord(account?.tts), `channels.${channelId}.accounts.${accountId}.tts`];
			yield [asNullableRecord(asNullableRecord(account?.voice)?.tts), `channels.${channelId}.accounts.${accountId}.voice.tts`];
		}
	}
	const pluginEntries = asNullableRecord(asNullableRecord(raw.plugins)?.entries);
	for (const [pluginId, entryValue] of Object.entries(pluginEntries ?? {})) if (!isBlockedObjectKey(pluginId) && LEGACY_TTS_PLUGIN_IDS.has(pluginId)) yield [asNullableRecord(asNullableRecord(asNullableRecord(entryValue)?.config)?.tts), `plugins.entries.${pluginId}.config.tts`];
}
const LEGACY_TTS_PROVIDER_RULES = [{
	path: ["tts"],
	message: "tts legacy provider aliases/keys are legacy; use provider: \"microsoft\" and tts.providers.<provider>. Run \"openclaw doctor --fix\".",
	match: hasLegacyTtsProviderKeys
}, {
	path: ["plugins", "entries"],
	message: "plugins.entries.voice-call.config.tts legacy provider aliases/keys are legacy; use provider: \"microsoft\" and plugins.entries.voice-call.config.tts.providers.<provider>. Run \"openclaw doctor --fix\".",
	match: (value) => hasLegacyTtsInLocations({ plugins: { entries: value } }, hasLegacyTtsProviderKeys)
}];
const LEGACY_TTS_ENABLED_RULES = [
	{
		path: ["tts"],
		message: "tts.enabled is legacy; use tts.auto. Run \"openclaw doctor --fix\".",
		match: hasLegacyTtsEnabled
	},
	{
		path: ["agents"],
		message: "agents.entries.*.tts.enabled is legacy; use agents.entries.*.tts.auto. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyTtsInLocations({ agents: value }, hasLegacyTtsEnabled)
	},
	{
		path: ["channels"],
		message: "supported channel TTS enabled fields are legacy; use the same TTS block auto field. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyTtsInLocations({ channels: value }, hasLegacyTtsEnabled)
	},
	{
		path: ["plugins", "entries"],
		message: "plugins.entries.voice-call.config.tts.enabled is legacy; use plugins.entries.voice-call.config.tts.auto. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyTtsInLocations({ plugins: { entries: value } }, hasLegacyTtsEnabled)
	}
];
const LEGACY_TTS_SPEAKER_SELECTION_RULES = [
	{
		path: ["tts"],
		message: "tts speaker selection fields voice/voiceName/voiceId are legacy; use speakerVoice or speakerVoiceId. Run \"openclaw doctor --fix\".",
		match: hasLegacyTtsSpeakerSelection
	},
	{
		path: ["agents"],
		message: "agents.entries.*.tts speaker selection fields voice/voiceName/voiceId are legacy; use speakerVoice or speakerVoiceId. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyTtsInLocations({ agents: value }, hasLegacyTtsSpeakerSelection)
	},
	{
		path: ["channels"],
		message: "supported channel TTS speaker selection fields voice/voiceName/voiceId are legacy; use speakerVoice or speakerVoiceId. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyTtsInLocations({ channels: value }, hasLegacyTtsSpeakerSelection)
	},
	{
		path: ["plugins", "entries"],
		message: "plugins.entries.voice-call.config.tts speaker selection fields voice/voiceName/voiceId are legacy; use speakerVoice or speakerVoiceId. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyTtsInLocations({ plugins: { entries: value } }, hasLegacyTtsSpeakerSelection)
	}
];
/** Legacy config migration specs for TTS runtime compatibility. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_TTS = [
	defineLegacyConfigMigration({
		id: "tts.top-level-owner",
		describe: "Move messages.tts to top-level tts",
		legacyRules: [{
			path: ["messages", "tts"],
			message: "messages.tts moved to top-level tts. Run \"openclaw doctor --fix\"."
		}],
		apply: (raw, changes) => {
			const messages = asNullableRecord(raw.messages);
			if (!messages || !Object.hasOwn(messages, "tts")) return;
			const legacy = asNullableRecord(messages.tts);
			if (!legacy) {
				delete messages.tts;
				changes.push("Removed messages.tts (invalid value).");
				return;
			}
			const legacyRealtime = asNullableRecord(legacy.realtime);
			if (legacyRealtime) {
				const legacyVoice = legacyRealtime.speakerVoice ?? legacyRealtime.voice;
				const talk = asNullableRecord(raw.talk) ?? {};
				const talkRealtime = asNullableRecord(talk.realtime) ?? {};
				if (legacyVoice !== void 0 && talkRealtime.speakerVoice === void 0) {
					talkRealtime.speakerVoice = legacyVoice;
					talk.realtime = talkRealtime;
					raw.talk = talk;
					changes.push("Moved messages.tts.realtime voice → talk.realtime.speakerVoice.");
				} else changes.push("Removed messages.tts.realtime (talk.realtime already configured).");
				delete legacy.realtime;
			}
			const canonical = asNullableRecord(raw.tts) ?? {};
			mergeMissing(canonical, legacy);
			raw.tts = canonical;
			delete messages.tts;
			changes.push("Moved messages.tts to top-level tts.");
		}
	}),
	defineLegacyConfigMigration({
		id: "tts.providers-generic-shape",
		describe: "Move legacy bundled TTS config keys into tts.providers",
		legacyRules: LEGACY_TTS_PROVIDER_RULES,
		apply: (raw, changes) => {
			for (const [tts, pathLabel] of visitKnownTtsConfigLocations({
				tts: raw.tts,
				plugins: raw.plugins
			})) migrateLegacyTtsConfig(tts, pathLabel, changes);
		}
	}),
	defineLegacyConfigMigration({
		id: "tts.speaker-selection-keys",
		describe: "Move TTS speaker selection keys to speakerVoice/speakerVoiceId",
		legacyRules: LEGACY_TTS_SPEAKER_SELECTION_RULES,
		apply: (raw, changes) => {
			for (const [tts, pathLabel] of visitKnownTtsConfigLocations(raw)) for (const [config, path] of visitLegacyTtsSpeakerConfigs(tts, pathLabel)) for (const [legacyKey, canonicalKey] of [
				["voice", "speakerVoice"],
				["voiceName", "speakerVoice"],
				["voiceId", "speakerVoiceId"]
			]) moveLegacyConfigKey(config, legacyKey, canonicalKey, path, changes);
		}
	}),
	defineLegacyConfigMigration({
		id: "tts.enabled-auto-mode",
		describe: "Move legacy TTS enabled toggles to auto mode",
		legacyRules: LEGACY_TTS_ENABLED_RULES,
		apply: (raw, changes) => {
			for (const [tts, pathLabel] of visitKnownTtsConfigLocations(raw)) migrateLegacyTtsEnabled(tts, pathLabel, changes);
		}
	})
];
//#endregion
//#region src/commands/doctor/shared/legacy-talk-config-normalizer.ts
/** Preserve flat speech fields for their plugin-owned migration. */
function normalizeLegacyTalkConfig(cfg, changes) {
	const rawTalk = cfg.talk;
	if (!isRecord(rawTalk)) return cfg;
	const normalizedTalk = normalizeTalkSection(rawTalk) ?? {};
	for (const key of [
		"voiceId",
		"voiceAliases",
		"modelId",
		"outputFormat",
		"apiKey"
	]) if (rawTalk[key] !== void 0) normalizedTalk[key] = rawTalk[key];
	if (Object.keys(normalizedTalk).length === 0 || isDeepStrictEqual(normalizedTalk, rawTalk)) return cfg;
	changes.push("Normalized talk.provider/providers shape (trimmed provider ids and merged missing compatibility fields).");
	return {
		...cfg,
		talk: normalizedTalk
	};
}
function prepareVoiceCallTalkInheritance(raw) {
	const entries = asNullableRecord(asNullableRecord(raw.plugins)?.entries);
	const voiceCall = asNullableRecord(asNullableRecord(entries?.["voice-call"])?.config);
	const source = asNullableRecord(voiceCall?.realtime);
	if (!source || raw.talk !== void 0 && !isRecord(raw.talk)) return;
	const inherited = normalizeTalkRealtimeConfig({
		provider: source.provider,
		providers: source.providers
	});
	if (!inherited) return;
	const changes = [];
	const normalized = normalizeLegacyTalkConfig(raw, changes);
	const current = normalized.talk?.realtime;
	const currentProviders = Object.keys(current?.providers ?? {});
	const providers = { ...current?.providers };
	for (const [id, config] of Object.entries(inherited.providers ?? {})) if (findNormalizedProviderKey(providers, id) === void 0) providers[id] = config;
	const providerIds = Object.keys(providers);
	const provider = current?.provider ?? (currentProviders.length === 1 ? currentProviders[0] : inherited.provider) ?? (providerIds.length === 1 ? providerIds[0] : void 0);
	const realtime = {
		...current,
		...provider ? { provider } : {},
		...providerIds.length > 0 ? { providers } : {}
	};
	if (isDeepStrictEqual(current, realtime)) return;
	return {
		talk: {
			...normalized.talk,
			realtime
		},
		changes: [...changes, "Copied inherited Voice Call realtime settings into talk.realtime; explicit Talk settings were preserved."]
	};
}
const LEGACY_TALK_VOICE_CALL_INHERITANCE = defineLegacyConfigMigration({
	id: "talk.voice-call-realtime-inheritance",
	describe: "Persist inherited Voice Call realtime settings under Talk",
	legacyRules: [{
		path: [
			"plugins",
			"entries",
			"voice-call",
			"config",
			"realtime"
		],
		message: "Inherited Talk realtime settings must be persisted under talk.realtime.",
		match: (_value, raw) => prepareVoiceCallTalkInheritance(raw) !== void 0
	}],
	apply: (raw, changes) => {
		const prepared = prepareVoiceCallTalkInheritance(raw);
		if (prepared) {
			raw.talk = prepared.talk;
			changes.push(...prepared.changes);
		}
	}
});
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.ts
/** Ordered runtime legacy config migrations applied by doctor. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME = [
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_AGENTS,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_CLI_BACKENDS,
	LEGACY_CONFIG_MIGRATION_RUNTIME_CODE_MODE,
	LEGACY_CONFIG_MIGRATION_RUNTIME_CODE_MODE_EXECUTOR,
	LEGACY_CONFIG_MIGRATION_RUNTIME_TOOL_SEARCH,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_CRON,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_DIAGNOSTICS,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_GATEWAY,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_MCP,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_MODELS,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_PROVIDERS,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_TTS,
	LEGACY_TALK_VOICE_CALL_INHERITANCE,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_RETIRED,
	LEGACY_CONFIG_MIGRATION_RUNTIME_SECRETS_EGRESS,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_SESSION,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_SKILLS,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_TOOL_NAMES,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_TOOL_POLICY_CONFLICTS,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_ENTRIES,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME_SYSTEM_AGENT
];
/** Legacy config migration specs for web-search provider config. */
const LEGACY_CONFIG_MIGRATIONS_WEB_SEARCH = [defineLegacyConfigMigration({
	id: "tools.web.search-provider-config->plugins.entries",
	describe: "Move legacy tools.web.search provider-owned config into plugins.entries.<plugin>.config.webSearch",
	legacyRules: [{
		path: [
			"tools",
			"web",
			"search"
		],
		message: "tools.web.search provider-owned config moved to plugins.entries.<plugin>.config.webSearch. Run \"openclaw doctor --fix\".",
		match: (_value, root) => listLegacyWebSearchConfigPaths(root).length > 0,
		requireSourceLiteral: true
	}],
	apply: (raw, changes) => {
		const migrated = migrateLegacyWebSearchConfig(raw);
		if (migrated.changes.length === 0) return;
		for (const key of Object.keys(raw)) delete raw[key];
		Object.assign(raw, migrated.config);
		changes.push(...migrated.changes);
	}
})];
//#endregion
//#region src/commands/doctor/shared/legacy-context-budget.ts
const MODEL_CONTEXT_TOKENS_REPLACEMENT = "models.providers.<provider>.models[].contextTokens";
function hasLegacyContextBudgetConfig(root) {
	if (!isRecord(root)) return false;
	const providers = isRecord(root.models) ? root.models.providers : void 0;
	if (isRecord(providers) && Object.values(providers).some((provider) => isRecord(provider) && (Object.hasOwn(provider, "contextTokens") || Object.hasOwn(provider, "contextWindow")))) return true;
	const agents = root.agents;
	if (!isRecord(agents)) return false;
	if (isRecord(agents.defaults) && Object.hasOwn(agents.defaults, "contextTokens")) return true;
	if (isRecord(agents.entries) && Object.values(agents.entries).some((entry) => isRecord(entry) && Object.hasOwn(entry, "contextTokens"))) return true;
	return Array.isArray(agents.list) && agents.list.some((entry) => isRecord(entry) && Object.hasOwn(entry, "contextTokens"));
}
function removeAgentContextTokens(root, changes, warnings) {
	const agents = root.agents;
	if (!isRecord(agents)) return;
	const removeContextTokens = (record, path) => {
		if (!isRecord(record) || !Object.hasOwn(record, "contextTokens")) return;
		delete record.contextTokens;
		changes.push({
			path,
			message: `Removed ${path}.`
		});
		warnings.push({
			path,
			message: `${path} cannot be represented per model; use ${MODEL_CONTEXT_TOKENS_REPLACEMENT} instead.`
		});
	};
	removeContextTokens(agents.defaults, "agents.defaults.contextTokens");
	const entries = agents.entries;
	if (isRecord(entries)) for (const [agentId, entry] of Object.entries(entries)) removeContextTokens(entry, `agents.entries.${agentId}.contextTokens`);
	if (Array.isArray(agents.list)) for (const [index, entry] of agents.list.entries()) removeContextTokens(entry, `agents.list[${index}].contextTokens`);
}
function migrateProviderContextBudgets(root, changes, warnings) {
	const providers = isRecord(root.models) ? root.models.providers : void 0;
	if (!isRecord(providers)) return;
	for (const [providerId, provider] of Object.entries(providers)) {
		if (!isRecord(provider)) continue;
		for (const key of ["contextTokens", "contextWindow"]) {
			if (!Object.hasOwn(provider, key)) continue;
			const sourcePath = `models.providers.${providerId}.${key}`;
			if (Array.isArray(provider.models) && provider.models.length > 0) {
				for (const [index, model] of provider.models.entries()) {
					if (!isRecord(model) || model[key] !== void 0) continue;
					model[key] = provider[key];
					changes.push({
						path: sourcePath,
						message: `${sourcePath} → models.providers.${providerId}.models[${index}].${key}.`
					});
				}
				delete provider[key];
				changes.push({
					path: sourcePath,
					message: `Removed ${sourcePath} after baking it into explicit model entries.`
				});
				continue;
			}
			delete provider[key];
			changes.push({
				path: sourcePath,
				message: `Removed ${sourcePath}.`
			});
			warnings.push({
				path: sourcePath,
				message: `${sourcePath} had no explicit model entries to receive its value; use ${MODEL_CONTEXT_TOKENS_REPLACEMENT} instead.`
			});
		}
	}
}
/** Doctor preserves provider budgets and reports unrepresentable agent caps before validation. */
function migrateLegacyContextBudgetConfig(raw) {
	if (!hasLegacyContextBudgetConfig(raw)) return {
		config: raw,
		changed: false,
		changes: [],
		warnings: []
	};
	const next = structuredClone(raw);
	const changes = [];
	const warnings = [];
	migrateProviderContextBudgets(next, changes, warnings);
	removeAgentContextTokens(next, changes, warnings);
	return changes.length > 0 ? {
		config: next,
		changed: true,
		changes,
		warnings
	} : {
		config: raw,
		changed: false,
		changes,
		warnings
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-copilot-discovery.ts
/** Drop the retired discovery switch before validation, including malformed values. */
function removeLegacyCopilotDiscovery(config) {
	const plugins = isRecord(config.plugins) ? config.plugins : void 0;
	const entries = isRecord(plugins?.entries) ? plugins.entries : void 0;
	const entry = isRecord(entries?.["github-copilot"]) ? entries["github-copilot"] : void 0;
	const pluginConfig = isRecord(entry?.config) ? entry.config : void 0;
	const discovery = isRecord(pluginConfig?.discovery) ? pluginConfig.discovery : void 0;
	if (!discovery || !Object.hasOwn(discovery, "enabled") && Object.keys(discovery).length > 0) return config;
	const { enabled: _enabled, ...remainingDiscovery } = discovery;
	const nextConfig = { ...pluginConfig };
	if (Object.keys(remainingDiscovery).length === 0) delete nextConfig.discovery;
	else nextConfig.discovery = remainingDiscovery;
	const next = {
		...config,
		plugins: {
			...plugins,
			entries: {
				...entries,
				"github-copilot": {
					...entry,
					config: nextConfig
				}
			}
		}
	};
	setRetainedLegacyDefaultAgentId(next, getRetainedLegacyDefaultAgentId(config));
	return next;
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.ts
const LEGACY_CONFIG_MIGRATION_SPECS = [
	...LEGACY_CONFIG_MIGRATIONS_CHANNELS,
	...LEGACY_CONFIG_MIGRATIONS_QQBOT,
	...LEGACY_CONFIG_MIGRATIONS_AUDIO,
	...LEGACY_CONFIG_MIGRATIONS_RUNTIME,
	...LEGACY_CONFIG_MIGRATIONS_WEB_SEARCH,
	LEGACY_CONFIG_MIGRATION_TOOLS_BY_SENDER
];
/** Ordered legacy migrations without their preview-only rule metadata. */
const LEGACY_CONFIG_MIGRATIONS = LEGACY_CONFIG_MIGRATION_SPECS.map(({ legacyRules: _legacyRules, ...migration }) => migration);
/** Aggregated legacy config rules used for doctor preview issue detection. */
const LEGACY_CONFIG_MIGRATION_RULES = [
	...LEGACY_CONFIG_MIGRATION_SPECS.flatMap((migration) => migration.legacyRules ?? []),
	{
		path: [],
		message: "Context budgets use models.providers.<provider>.models[].contextTokens; run \"openclaw doctor --fix\" to migrate retired provider and agent keys.",
		match: hasLegacyContextBudgetConfig
	},
	{
		path: [
			"plugins",
			"entries",
			"github-copilot",
			"config",
			"discovery"
		],
		message: "The GitHub Copilot discovery switch was retired; run \"openclaw doctor --fix\".",
		match: (_value, root) => removeLegacyCopilotDiscovery(root) !== root
	}
];
//#endregion
//#region src/config/legacy.ts
function getPathValue(root, path) {
	let cursor = root;
	for (const key of path) {
		if (!cursor || typeof cursor !== "object") return;
		cursor = cursor[key];
	}
	return cursor;
}
/** Finds legacy config issues using built-in rules plus optional caller rules. */
function findLegacyConfigIssues(raw, sourceRaw, extraRules = []) {
	return findLegacyConfigRuleIssues(raw, [...LEGACY_CONFIG_MIGRATION_RULES, ...extraRules], sourceRaw);
}
/** Evaluate exactly the rules selected by the migration owner. */
function findLegacyConfigRuleIssues(raw, rules, sourceRaw) {
	if (!raw || typeof raw !== "object") return [];
	const root = raw;
	const sourceRoot = sourceRaw && typeof sourceRaw === "object" ? sourceRaw : root;
	const issues = [];
	for (const rule of rules) {
		const cursor = getPathValue(root, rule.path);
		if (cursor !== void 0 && (!rule.match || rule.match(cursor, root))) {
			if (rule.requireSourceLiteral) {
				const sourceCursor = getPathValue(sourceRoot, rule.path);
				if (sourceCursor === void 0) continue;
				if (rule.match && !rule.match(sourceCursor, sourceRoot)) continue;
			}
			issues.push({
				path: rule.path.join("."),
				message: rule.message
			});
		}
	}
	return issues;
}
//#endregion
export { materializeLegacyDefaultAgentRoles as _, migrateLegacyContextBudgetConfig as a, collectToolPolicyConflictWarnings as c, migrateLegacyWebFetchConfig as d, migrateLegacyWebSearchConfig as f, retireLegacyAgentDefaultMarkers as g, LEGACY_AGENT_ROSTER_RULES as h, removeLegacyCopilotDiscovery as i, findLegacySystemAgentOwnerIssue as l, collectLegacyToolsBySenderIssues as m, findLegacyConfigRuleIssues as n, LEGACY_TALK_VOICE_CALL_INHERITANCE as o, migrateLegacyXSearchConfig as p, LEGACY_CONFIG_MIGRATIONS as r, normalizeLegacyTalkConfig as s, findLegacyConfigIssues as t, stripRetiredTuningKnobs as u };
