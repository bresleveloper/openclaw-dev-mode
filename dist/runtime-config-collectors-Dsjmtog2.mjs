import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId, t as findNormalizedProviderKey } from "./provider-id-D1VImdKk.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-CSDERtm3.mjs";
import { _ as resolveDefaultAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { r as listAgentEntriesWithSource, t as hasAgentRosterProperty } from "./agent-roster-gkYP38su.mjs";
import { n as resolveSandboxScope } from "./config-contract-CgxcWtCc.mjs";
import { o as resolveConfiguredTalkRealtimeProviderId, s as resolveConfiguredTalkSpeechProviderId } from "./talk-Brycd9Kq.mjs";
import "./shared-BVDjoVcf.mjs";
import { r as getBootstrapChannelSecrets } from "./channel-configured-HzkjFZmD.mjs";
import { i as createConfigSecretInputCollector, n as collectCanonicalSecretInputAssignment } from "./runtime-shared-DqMZ_k3n.mjs";
import { d as PROVIDER_REQUEST_SECRET_FIELD_GROUPS, f as loadChannelSecretContractApi } from "./target-registry-query-DOYceNvb.mjs";
import { n as getPath } from "./path-utils-aDSU1mEq.mjs";
import { t as resolveConfiguredGenericEmbeddingProviderId } from "./embedding-provider-config-DW81XCVx.mjs";
import "./config-Bf089UPS.mjs";
import { d as resolveVoiceModelRefs, i as resolvePluginCapabilityProvider } from "./capability-provider-runtime-CM-mwRei.mjs";
import { a as runtimeMediaModelSecretOwnerId, n as resolveConfiguredMediaEntryCapabilities, o as runtimeMediaRequestSecretOwnerId, r as resolveEffectiveMediaEntryCapabilities } from "./entry-capabilities-uCzDotfm.mjs";
import { n as normalizeMediaProviderId } from "./provider-id-BZvihdyi.mjs";
import { t as resolveImageCapableConfigProviderIds } from "./config-provider-models-CKwImwcW.mjs";
import { n as runtimeSandboxSecretOwnerId } from "./runtime-sandbox-secret-owner-fF9hYYLA.mjs";
import { t as runtimeMemorySecretOwnerId } from "./runtime-memory-secret-owner-B-NANLgi.mjs";
import { t as collectTtsApiKeyAssignments } from "./runtime-config-collectors-tts-hyAX43bP.mjs";
import { n as evaluateGatewayAuthSurfaceStates } from "./runtime-gateway-auth-surfaces-aVf_qvWx.mjs";
import { t as collectPluginConfigAssignments } from "./runtime-config-collectors-plugins-BPmbX33M.mjs";
//#region src/secrets/runtime-config-collectors-channels.ts
/** Collects channel contract secret assignments during runtime preparation. */
/** Collects SecretRef assignments declared by active channel/plugin channel contracts. */
function collectChannelConfigAssignments(params) {
	const channelIds = Object.keys(params.config.channels ?? {});
	if (channelIds.length === 0) return;
	for (const channelId of channelIds) (loadChannelSecretContractApi({
		channelId,
		config: params.config,
		env: params.context.env,
		loadablePluginOrigins: params.loadablePluginOrigins
	})?.collectRuntimeConfigAssignments ?? getBootstrapChannelSecrets(channelId)?.collectRuntimeConfigAssignments)?.(params);
}
//#endregion
//#region src/media-understanding/provider-capability-registry.ts
/** Resolves capability metadata for configured shared media model providers. */
function buildMediaUnderstandingCapabilityRegistry(cfg) {
	const registry = /* @__PURE__ */ new Map();
	const providerIds = /* @__PURE__ */ new Set();
	for (const entry of cfg?.tools?.media?.models ?? []) if (typeof entry?.provider === "string" && (entry.type ?? (entry.command ? "cli" : "provider")) === "provider" && !resolveConfiguredMediaEntryCapabilities(entry)) {
		const providerId = normalizeMediaProviderId(entry.provider);
		if (providerId) providerIds.add(providerId);
	}
	for (const providerId of providerIds) {
		const provider = resolvePluginCapabilityProvider({
			key: "mediaUnderstandingProviders",
			providerId,
			cfg
		});
		if (provider) registry.set(normalizeMediaProviderId(provider.id), { capabilities: provider.capabilities });
	}
	for (const providerId of resolveImageCapableConfigProviderIds(cfg)) if (providerIds.has(providerId) && !registry.has(providerId)) registry.set(providerId, { capabilities: ["image"] });
	return registry;
}
//#endregion
//#region src/secrets/runtime-config-collectors-memory.ts
/** Collects per-agent memory search secret refs from runtime config. */
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
function resolveMemoryEmbeddingProviderContract(params) {
	const configuredProvider = normalizeOptionalString(params.override?.provider) ?? normalizeOptionalString(params.defaults?.provider);
	const providerId = !configuredProvider || configuredProvider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : configuredProvider;
	const lookupIds = new Set([providerId, resolveConfiguredGenericEmbeddingProviderId(providerId, params.config)].filter((id) => Boolean(id)).map(normalizeProviderId));
	const credentialOwnerIds = (params.context.manifestRegistry?.plugins ?? []).flatMap((plugin) => plugin.contracts?.embeddingProviders?.some((id) => lookupIds.has(normalizeProviderId(id))) ? plugin.providers : []);
	const contractProviderIds = new Set([providerId, ...credentialOwnerIds.length > 0 ? credentialOwnerIds : Object.keys(params.config.models?.providers ?? {})].map(normalizeProviderId));
	const providerConfigs = /* @__PURE__ */ new Map();
	for (const candidateId of contractProviderIds) {
		const providerConfig = findNormalizedProviderValue(params.config.models?.providers, candidateId);
		if (providerConfig) providerConfigs.set(candidateId, {
			baseUrl: providerConfig.baseUrl,
			apiKey: params.context.managedSyntheticAuthProviders?.has(candidateId) ? void 0 : providerConfig.apiKey,
			auth: providerConfig.auth,
			authHeader: providerConfig.authHeader,
			headers: providerConfig.headers,
			request: providerConfig.request,
			params: providerConfig.params,
			region: providerConfig.region,
			localService: providerConfig.localService
		});
	}
	return {
		id: providerId,
		config: providerConfigs.size === 1 ? providerConfigs.values().next().value : providerConfigs.size > 1 ? Object.fromEntries(providerConfigs) : void 0
	};
}
/** Collects memory-search SecretRefs once for every agent that can inherit them. */
function collectAgentMemorySearchAssignments(params) {
	const collect = createConfigSecretInputCollector(params);
	const memory = params.config.memory;
	const defaultsMemorySearch = isRecord(memory?.search) ? memory.search : void 0;
	const configuredEntries = listAgentEntriesWithSource(params.config);
	const entries = configuredEntries.length === 0 && !hasAgentRosterProperty(params.config) ? [{
		entry: { id: LEGACY_IMPLICIT_AGENT_ID },
		source: {
			kind: "entries",
			key: LEGACY_IMPLICIT_AGENT_ID
		}
	}] : configuredEntries;
	const defaultRemote = isRecord(defaultsMemorySearch?.remote) ? defaultsMemorySearch.remote : void 0;
	const defaultHeaders = isRecord(defaultRemote?.headers) ? defaultRemote.headers : void 0;
	let defaultApiKeyAssignmentCollected = false;
	const collectedDefaultHeaderKeys = /* @__PURE__ */ new Set();
	const collectForAgent = ({ entry: rawAgent, source }) => {
		const rawAgentValue = rawAgent;
		if (!isRecord(rawAgentValue)) return;
		const rawAgentRecord = rawAgentValue;
		const agentMemory = isRecord(rawAgentRecord.memory) ? rawAgentRecord.memory : void 0;
		const memorySearch = isRecord(agentMemory?.search) ? agentMemory.search : void 0;
		const remote = isRecord(memorySearch?.remote) ? memorySearch.remote : void 0;
		const agentId = normalizeAgentId(rawAgent.id);
		const agentPath = source.kind === "entries" ? appendConfigPathSegment("agents.entries", source.key) : `agents.list[${source.index}]`;
		const active = rawAgentRecord["enabled"] !== false && (memorySearch?.enabled ?? defaultsMemorySearch?.enabled ?? true) !== false;
		const owner = {
			ownerKind: "capability",
			ownerId: runtimeMemorySecretOwnerId(agentId),
			requiredForGateway: false,
			disposition: "isolate",
			contract: {
				defaults: defaultsMemorySearch,
				override: memorySearch,
				agentEnabled: rawAgentRecord["enabled"],
				provider: resolveMemoryEmbeddingProviderContract({
					config: params.config,
					context: params.context,
					defaults: defaultsMemorySearch,
					override: memorySearch
				})
			}
		};
		const hasApiKeyOverride = Boolean(remote && Object.hasOwn(remote, "apiKey"));
		const apiKeyTarget = hasApiKeyOverride ? remote : defaultRemote;
		if (apiKeyTarget && Object.hasOwn(apiKeyTarget, "apiKey")) {
			collect(apiKeyTarget, "apiKey", hasApiKeyOverride ? `${agentPath}.memory.search.remote.apiKey` : "memory.search.remote.apiKey", {
				active,
				inactiveReason: "agent or memorySearch override is disabled.",
				owner
			});
			if (!hasApiKeyOverride && active) defaultApiKeyAssignmentCollected = true;
		}
		const overrideHeaders = isRecord(remote?.headers) ? remote.headers : void 0;
		const headerTarget = overrideHeaders ?? defaultHeaders;
		if (!headerTarget) return;
		for (const headerKey of Object.keys(headerTarget)) {
			collect(headerTarget, headerKey, overrideHeaders ? appendConfigPathSegment(`${agentPath}.memory.search.remote.headers`, headerKey) : appendConfigPathSegment("memory.search.remote.headers", headerKey), {
				active,
				inactiveReason: "agent or memorySearch override is disabled.",
				owner
			});
			if (!overrideHeaders && active) collectedDefaultHeaderKeys.add(headerKey);
		}
	};
	entries.forEach(collectForAgent);
	if (defaultRemote && !defaultApiKeyAssignmentCollected) collect(defaultRemote, "apiKey", "memory.search.remote.apiKey", {
		active: false,
		inactiveReason: "no enabled agent inherits this memorySearch remote api key."
	});
	for (const headerKey of Object.keys(defaultHeaders ?? {})) {
		if (collectedDefaultHeaderKeys.has(headerKey)) continue;
		collect(defaultHeaders, headerKey, appendConfigPathSegment("memory.search.remote.headers", headerKey), {
			active: false,
			inactiveReason: "no enabled agent inherits this memorySearch remote header."
		});
	}
}
//#endregion
//#region src/secrets/runtime-config-collectors-sandbox.ts
/** Collects agent-scoped sandbox SSH SecretRefs during runtime preparation. */
const SANDBOX_SSH_SECRET_KEYS = [
	"identityData",
	"certificateData",
	"knownHostsData"
];
function sandboxSecretOwner(agentId, contract) {
	return {
		ownerKind: "capability",
		ownerId: runtimeSandboxSecretOwnerId(agentId),
		requiredForGateway: false,
		disposition: "isolate",
		contract
	};
}
/** Collects SSH material once for every agent whose current backend can manage it. */
function collectAgentSandboxAssignments(params) {
	const collect = createConfigSecretInputCollector(params);
	const rawAgents = params.config.agents;
	const agents = isRecord(rawAgents) ? rawAgents : void 0;
	if (!agents) return;
	const defaultsAgent = isRecord(agents.defaults) ? agents.defaults : void 0;
	const defaultsSandbox = isRecord(defaultsAgent?.sandbox) ? defaultsAgent.sandbox : void 0;
	const defaultsSsh = isRecord(defaultsSandbox?.ssh) ? defaultsSandbox.ssh : void 0;
	const defaultsBackend = normalizeOptionalLowercaseString(defaultsSandbox?.backend) ?? "docker";
	const activeDefaultKeys = /* @__PURE__ */ new Set();
	const seenAgentIds = /* @__PURE__ */ new Set();
	for (const { entry: rawAgent, source } of listAgentEntriesWithSource(params.config)) {
		const rawAgentRecord = rawAgent;
		if (!isRecord(rawAgentRecord)) continue;
		const agentId = normalizeAgentId(rawAgent.id);
		if (seenAgentIds.has(agentId)) continue;
		seenAgentIds.add(agentId);
		const agentPath = source.kind === "entries" ? appendConfigPathSegment("agents.entries", source.key) : `agents.list[${source.index}]`;
		const sandbox = isRecord(rawAgentRecord.sandbox) ? rawAgentRecord.sandbox : void 0;
		const ssh = isRecord(sandbox?.ssh) ? sandbox.ssh : void 0;
		const backend = normalizeOptionalLowercaseString(sandbox?.backend) ?? defaultsBackend;
		const scope = resolveSandboxScope({ scope: typeof sandbox?.scope === "string" ? sandbox.scope : typeof defaultsSandbox?.scope === "string" ? defaultsSandbox.scope : void 0 });
		const active = backend === "ssh";
		const owner = sandboxSecretOwner(agentId, {
			defaults: defaultsSandbox,
			override: sandbox,
			agentEnabled: rawAgentRecord["enabled"]
		});
		for (const key of SANDBOX_SSH_SECRET_KEYS) {
			if (Boolean(ssh && Object.hasOwn(ssh, key)) && ssh) {
				collect(ssh, key, `${agentPath}.sandbox.ssh.${key}`, {
					active: scope !== "shared" && active,
					inactiveReason: scope === "shared" ? "shared sandbox scope ignores agent SSH overrides." : "sandbox SSH backend is not configured for this agent.",
					owner
				});
				if (scope !== "shared") continue;
			}
			if (!defaultsSsh || !Object.hasOwn(defaultsSsh, key)) continue;
			if (!active) continue;
			activeDefaultKeys.add(key);
			collect(defaultsSsh, key, `agents.defaults.sandbox.ssh.${key}`, {
				active: true,
				inactiveReason: "sandbox SSH backend is not configured for this agent.",
				owner
			});
		}
	}
	if (!defaultsSsh) return;
	for (const key of SANDBOX_SSH_SECRET_KEYS) {
		if (!Object.hasOwn(defaultsSsh, key) || activeDefaultKeys.has(key)) continue;
		const active = defaultsBackend === "ssh";
		const fallbackAgentId = params.agentId === void 0 ? resolveDefaultAgentId(params.config) : normalizeAgentId(params.agentId);
		collect(defaultsSsh, key, `agents.defaults.sandbox.ssh.${key}`, {
			active,
			inactiveReason: "no enabled agent uses the sandbox SSH material.",
			owner: sandboxSecretOwner(fallbackAgentId, { defaults: defaultsSandbox })
		});
	}
}
//#endregion
//#region src/secrets/runtime-config-collectors-core.ts
/** Collects core config secret refs during runtime preparation. */
function collectModelOrSkillAssignments(params) {
	const collect = createConfigSecretInputCollector(params);
	const isModel = params.kind === "model";
	const pathPrefix = isModel ? "models.providers" : "skills.entries";
	for (const [id, entry] of Object.entries(params.entries)) {
		const active = entry.enabled !== false;
		const entryPath = appendConfigPathSegment(pathPrefix, id);
		const activity = {
			active,
			inactiveReason: isModel ? "provider is disabled." : "skill entry is disabled.",
			owner: {
				ownerKind: isModel ? "provider" : "capability",
				ownerId: isModel ? normalizeOptionalLowercaseString(id) ?? id : `skill:${id}`,
				requiredForGateway: false,
				disposition: "isolate",
				contract: entry
			}
		};
		const usesManagedLocalService = isModel && params.context.managedSyntheticAuthProviders?.has(normalizeProviderId(id));
		collect(entry, "apiKey", `${entryPath}.apiKey`, {
			...activity,
			active: active && !usesManagedLocalService,
			inactiveReason: usesManagedLocalService ? "managed local services use provider-owned authentication." : activity.inactiveReason
		});
		if (!isModel) continue;
		const headers = isRecord(entry.headers) ? entry.headers : void 0;
		if (headers) for (const headerKey of Object.keys(headers)) collect(headers, headerKey, appendConfigPathSegment(`${entryPath}.headers`, headerKey), activity);
		const request = isRecord(entry.request) ? entry.request : void 0;
		if (request) collectProviderRequestAssignments({
			request,
			pathPrefix: `${entryPath}.request`,
			defaults: params.defaults,
			context: params.context,
			...activity
		});
	}
}
function findTalkProviderConfig(providers, providerId) {
	if (!isRecord(providers)) return;
	const id = findNormalizedProviderKey(providers, providerId);
	const config = id ? providers[id] : void 0;
	return id && isRecord(config) ? {
		id,
		config
	} : void 0;
}
function collectTalkAssignments(params) {
	const talk = params.config.talk;
	if (!isRecord(talk)) return;
	for (const surface of ["speech", "realtime"]) {
		const section = surface === "speech" ? talk : isRecord(talk.realtime) ? talk.realtime : void 0;
		if (!section) continue;
		const configuredId = surface === "speech" ? resolveConfiguredTalkSpeechProviderId(params.config) : resolveConfiguredTalkRealtimeProviderId(params.config);
		const normalizedConfiguredId = normalizeOptionalLowercaseString(configuredId);
		const capability = surface === "speech" ? "speechProviders" : "realtimeVoiceProviders";
		const normalizedProviderIds = (normalizedConfiguredId ? params.context.manifestRegistry ? params.context.manifestRegistry.plugins.map((manifest) => manifest.contracts?.[capability]).find((ids) => ids?.some((id) => normalizeOptionalLowercaseString(id) === normalizedConfiguredId)) : [normalizedConfiguredId] : void 0)?.map((id) => normalizeOptionalLowercaseString(id) ?? id);
		const providerId = normalizedProviderIds?.[0];
		const selected = configuredId ? findTalkProviderConfig(section.providers, configuredId) : void 0;
		const inherited = surface === "speech" && providerId ? normalizedProviderIds.map((id) => findTalkProviderConfig(params.config.tts?.providers, id)).find((entry) => entry !== void 0) : void 0;
		const voiceModel = (surface === "realtime" ? section.model : selected?.config.model ?? selected?.config.modelId ?? inherited?.config.model ?? inherited?.config.modelId) === void 0 ? resolveVoiceModelRefs(params.config.agents?.defaults?.voiceModel).find((ref) => normalizedProviderIds?.includes(ref.provider.toLowerCase())) : void 0;
		const { providers: _providers, provider: _provider, ...realtimeDefaults } = section;
		const inheritedConfig = inherited && selected?.config.apiKey !== void 0 ? Object.fromEntries(Object.entries(inherited.config).filter(([key]) => key !== "apiKey")) : inherited?.config;
		const owner = providerId ? {
			ownerKind: "capability",
			ownerId: `talk:${surface}`,
			requiredForGateway: false,
			disposition: "isolate",
			contract: {
				provider: providerId,
				selectedProvider: configuredId,
				providerConfig: selected?.config,
				voiceModel,
				...surface === "realtime" ? {
					...realtimeDefaults,
					canonicalProviderConfig: findTalkProviderConfig(section.providers, providerId)?.config
				} : {
					inheritedProviderConfig: inheritedConfig,
					timeoutMs: params.config.tts?.timeoutMs,
					maxTextLength: params.config.tts?.maxTextLength
				}
			}
		} : void 0;
		const inheritedKey = surface === "speech" && inherited && selected?.config.apiKey === void 0 ? inherited : void 0;
		const entries = Object.entries(isRecord(section.providers) ? section.providers : {});
		if (inheritedKey && selected) entries.push([inheritedKey.id, inheritedKey.config]);
		for (const [id, config] of entries) {
			if (!isRecord(config)) continue;
			const isInherited = config === inheritedKey?.config;
			const destination = isInherited && selected ? selected.config : config;
			const normalized = normalizeOptionalLowercaseString(id);
			collectCanonicalSecretInputAssignment({
				value: config.apiKey,
				path: isInherited ? `${appendConfigPathSegment("tts.providers", id)}.apiKey` : `${appendConfigPathSegment(`talk.${surface === "realtime" ? "realtime." : ""}providers`, id)}.apiKey`,
				expected: "string",
				defaults: params.defaults,
				context: params.context,
				active: Boolean(isInherited || providerId && (normalized === normalizedConfiguredId || surface === "realtime" && normalized === providerId)),
				inactiveReason: "Talk provider is not selected.",
				owner,
				apply: (resolved) => {
					destination.apiKey = resolved;
				}
			});
		}
	}
}
function collectGatewayAssignments(params) {
	const gateway = params.config.gateway;
	if (!isRecord(gateway)) return;
	const collect = createConfigSecretInputCollector(params);
	const controlUi = isRecord(gateway.controlUi) ? gateway.controlUi : void 0;
	const gatewaySurfaceStates = evaluateGatewayAuthSurfaceStates({
		config: params.config,
		env: params.context.env,
		defaults: params.defaults
	});
	for (const surface of ["auth", "remote"]) {
		const target = gateway[surface];
		if (!isRecord(target)) continue;
		const owner = surface === "auth" ? {
			ownerKind: "gateway",
			ownerId: "ingress-auth",
			requiredForGateway: true,
			disposition: "fail-closed",
			contract: target
		} : void 0;
		for (const key of ["token", "password"]) {
			const path = `gateway.${surface}.${key}`;
			collect(target, key, path, {
				active: gatewaySurfaceStates[path].active,
				inactiveReason: gatewaySurfaceStates[path].reason,
				owner
			});
		}
	}
	const controlUiGitHub = controlUi && isRecord(controlUi.github) ? controlUi.github : void 0;
	if (controlUiGitHub) collect(controlUiGitHub, "token", "gateway.controlUi.github.token", { owner: {
		ownerKind: "capability",
		ownerId: "control-ui-github",
		requiredForGateway: false,
		disposition: "isolate",
		contract: controlUiGitHub
	} });
}
function collectProviderRequestAssignments(params) {
	const collect = createConfigSecretInputCollector(params);
	for (const { path, fields } of PROVIDER_REQUEST_SECRET_FIELD_GROUPS) {
		const target = getPath(params.request, [...path]);
		if (!isRecord(target)) continue;
		const pathPrefix = `${params.pathPrefix}.${path.join(".")}`;
		for (const key of fields === "*" ? Object.keys(target) : fields) collect(target, key, appendConfigPathSegment(pathPrefix, key), {
			active: params.active,
			inactiveReason: params.inactiveReason,
			owner: params.owner
		});
	}
}
function collectMediaRequestAssignments(params) {
	const tools = isRecord(params.config.tools) ? params.config.tools : void 0;
	const media = isRecord(tools?.media) ? tools.media : void 0;
	if (!media) return;
	let providerRegistry;
	const getProviderRegistry = () => {
		providerRegistry ??= buildMediaUnderstandingCapabilityRegistry(params.config);
		return providerRegistry;
	};
	const capabilityKeys = [
		"audio",
		"image",
		"video"
	];
	const isCapabilityEnabled = (capability) => (isRecord(media[capability]) ? media[capability] : void 0)?.enabled !== false;
	const models = media.models;
	if (Array.isArray(models)) models.forEach((rawModel, index) => {
		if (!isRecord(rawModel) || !isRecord(rawModel.request)) return;
		const entry = rawModel;
		const capabilities = resolveConfiguredMediaEntryCapabilities(entry) ?? resolveEffectiveMediaEntryCapabilities({
			entry,
			providerRegistry: getProviderRegistry()
		});
		const active = capabilities?.some((capability) => isCapabilityEnabled(capability)) ?? false;
		const inactiveReason = capabilities && capabilities.length > 0 ? `all configured media capabilities for this shared model are disabled: ${capabilities.join(", ")}.` : "shared media model does not declare capabilities and none could be inferred from its provider.";
		collectProviderRequestAssignments({
			request: rawModel.request,
			pathPrefix: `tools.media.models[${index}].request`,
			defaults: params.defaults,
			context: params.context,
			active,
			inactiveReason,
			owner: {
				ownerKind: "capability",
				ownerId: runtimeMediaModelSecretOwnerId(index),
				requiredForGateway: false,
				disposition: "isolate",
				contract: rawModel
			}
		});
	});
	for (const capability of capabilityKeys) {
		const section = isRecord(media[capability]) ? media[capability] : void 0;
		if (!section || !isRecord(section.request)) continue;
		const active = isCapabilityEnabled(capability);
		collectProviderRequestAssignments({
			request: section.request,
			pathPrefix: `tools.media.${capability}.request`,
			defaults: params.defaults,
			context: params.context,
			active,
			inactiveReason: `${capability} media understanding is disabled.`,
			owner: {
				ownerKind: "capability",
				ownerId: runtimeMediaRequestSecretOwnerId(capability),
				requiredForGateway: false,
				disposition: "isolate",
				contract: section
			}
		});
	}
}
function collectMessagesTtsAssignments(params) {
	const tts = params.config.tts;
	if (!isRecord(tts)) return;
	collectTtsApiKeyAssignments({
		tts,
		pathPrefix: "tts",
		defaults: params.defaults,
		context: params.context
	});
}
function collectAgentTtsAssignments(params) {
	for (const { entry, source } of listAgentEntriesWithSource(params.config)) {
		if (!isRecord(entry.tts)) continue;
		collectTtsApiKeyAssignments({
			tts: entry.tts,
			pathPrefix: source.kind === "entries" ? `${appendConfigPathSegment("agents.entries", source.key)}.tts` : `agents.list[${source.index}].tts`,
			defaults: params.defaults,
			context: params.context
		});
	}
}
function collectCronAssignments(params) {
	const cron = params.config.cron;
	if (!isRecord(cron)) return;
	createConfigSecretInputCollector(params)(cron, "webhookToken", "cron.webhookToken", { owner: {
		ownerKind: "capability",
		ownerId: "cron-webhook",
		requiredForGateway: false,
		disposition: "isolate",
		contract: cron
	} });
}
/** Collects SecretRef assignments from core non-plugin config surfaces. */
function collectCoreConfigAssignments(params) {
	const database = params.config.database;
	if (database?.postgres) createConfigSecretInputCollector(params)(database.postgres, "connection", "database.postgres.connection", {
		active: database.engine === "postgres",
		inactiveReason: "database.engine is not postgres.",
		owner: {
			ownerKind: "gateway",
			ownerId: "database",
			requiredForGateway: true,
			disposition: "fail-closed",
			contract: database
		}
	});
	const providers = params.config.models?.providers;
	if (providers) collectModelOrSkillAssignments({
		entries: providers,
		kind: "model",
		defaults: params.defaults,
		context: params.context
	});
	const skillEntries = params.config.skills?.entries;
	if (skillEntries) collectModelOrSkillAssignments({
		entries: skillEntries,
		kind: "skill",
		defaults: params.defaults,
		context: params.context
	});
	collectAgentMemorySearchAssignments(params);
	collectTalkAssignments(params);
	collectGatewayAssignments(params);
	collectAgentSandboxAssignments(params);
	collectMessagesTtsAssignments(params);
	collectAgentTtsAssignments(params);
	collectCronAssignments(params);
	collectMediaRequestAssignments(params);
}
//#endregion
//#region src/secrets/runtime-config-collectors.ts
/** Collects every config-backed SecretRef assignment before runtime values are materialized. */
async function collectConfigAssignments(params) {
	const { sourceConfig, env } = params.context;
	const managedSyntheticAuthProviders = /* @__PURE__ */ new Set();
	for (const [provider, entry] of Object.entries(sourceConfig.models?.providers ?? {})) {
		if (!entry.localService) continue;
		const { resolveManagedLocalProviderAuth } = await import("./model-auth-runtime-BFGcmRM2.mjs");
		if (resolveManagedLocalProviderAuth({
			cfg: sourceConfig,
			provider,
			env
		})) managedSyntheticAuthProviders.add(normalizeProviderId(provider));
	}
	params.context.managedSyntheticAuthProviders = managedSyntheticAuthProviders;
	const defaults = params.context.sourceConfig.secrets?.defaults;
	collectCoreConfigAssignments({
		config: params.config,
		defaults,
		context: params.context,
		agentId: params.agentId
	});
	collectChannelConfigAssignments({
		config: params.config,
		defaults,
		context: params.context,
		loadablePluginOrigins: params.loadablePluginOrigins
	});
	collectPluginConfigAssignments({
		config: params.config,
		defaults,
		context: params.context,
		loadablePluginOrigins: params.loadablePluginOrigins
	});
}
//#endregion
export { collectConfigAssignments as t };
