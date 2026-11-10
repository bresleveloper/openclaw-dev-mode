import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as coerceSecretRef, l as isLegacySecretRefWithoutProvider, m as parseLegacySecretRefEnvMarker, s as hasLegacySecretRefExtraFields } from "./types.secrets-Dgbd2kyP.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as copyConfigResolutionFactsThroughRewrite, t as cloneConfigWithResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-ifCOO7_9.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { a as readAgentRosterProperty } from "./agent-roster-gkYP38su.mjs";
import { r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-8hS3NARf.mjs";
import { h as resolveNormalizedProviderModelMaxTokens } from "./validation-core-ezn1vWYO.mjs";
import { t as getConfigValueAtPath } from "./config-paths-BvomE-N1.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-BDlJJbko.mjs";
import { d as migrateLegacyWebFetchConfig, f as migrateLegacyWebSearchConfig, p as migrateLegacyXSearchConfig, s as normalizeLegacyTalkConfig, u as stripRetiredTuningKnobs } from "./legacy-B7HUu-GS.mjs";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { i as isBlockedLegacyCodexModelRef } from "./codex-route-model-ref-2IYegA3O.mjs";
import "./legacy-config-record-shared-CG6CyklH.mjs";
import { a as rewriteModelRefs, r as mergeModelRefMapEntries } from "./legacy-config-migrations.runtime.models.refs-Ceq33O_-.mjs";
import { i as isLegacyModelsAddCodexMetadataModel, n as modelEntryWithRuntimePolicy } from "./legacy-config-migrations.runtime.models-BnVO6DAX.mjs";
import { a as HeartbeatSchema } from "./zod-schema.agent-runtime-B7VQsP09.mjs";
import { n as discoverConfigSecretTargets } from "./target-registry-query-DOYceNvb.mjs";
import { i as setPathExistingStrict } from "./path-utils-aDSU1mEq.mjs";
import "./target-registry-CSb4wosA.mjs";
import { a as runPluginSetupConfigMigrations } from "./setup-registry-CGxNMBUk.mjs";
import "./plugin-registry-BKRXR0Si.mjs";
import { t as DEFAULT_GOOGLE_API_BASE_URL } from "./google-api-base-url-B5JCFm92.mjs";
import { s as applyChannelDoctorCompatibilityMigrations } from "./config-flow-steps-BrBOplUM.mjs";
import { i as loadSetupChannelPluginFromManifestRecord } from "./read-only-BTHRPuD9.mjs";
import { a as migrateLegacyCommandOwners } from "./doctor-command-owner-DAqinR9q.mjs";
import { t as pruneBindingsForMissingAgents } from "./legacy-config-binding-repair-CdnATYZg.mjs";
import { t as resolveSingleAccountPromotion } from "./setup-promotion-helpers-Cn6k3Uvm.mjs";
import { t as migrateLegacyRuntimeModelRef } from "./legacy-runtime-model-providers-Dh0YuH6R.mjs";
//#region src/channels/plugins/setup-promotion-discovery.ts
function resolveDiscoveredChannelSetupPromotionSurface(channelKey, cfg) {
	const registry = loadPluginManifestRegistryForPluginRegistry({
		config: cfg,
		includeDisabled: true
	});
	if (registry.plugins.some((plugin) => plugin.channels.includes(channelKey) && plugin.packageManifest?.setupFeatures?.configPromotion === "preserve-root")) return { configPromotion: "preserve-root" };
	if (getOfficialExternalPluginCatalogManifest(getOfficialExternalPluginCatalogEntry(channelKey) ?? {})?.setupFeatures?.configPromotion === "preserve-root") return { configPromotion: "preserve-root" };
	const owner = registry.plugins.find((plugin) => plugin.channels.includes(channelKey) && plugin.packageManifest?.setupFeatures?.configPromotion === true);
	if (!owner) return null;
	const { plugin } = loadSetupChannelPluginFromManifestRecord({
		record: owner,
		channelId: channelKey,
		env: process.env
	});
	const setup = plugin?.setupContract ?? plugin?.setup;
	return setup && typeof setup === "object" ? setup : null;
}
//#endregion
//#region src/commands/doctor/shared/legacy-mistral-model-cost.ts
const MISTRAL_MODEL_CACHE_READ_COST_BY_ID = /* @__PURE__ */ new Map([
	["codestral-latest", .03],
	["devstral-medium-latest", .04],
	["magistral-small", .05],
	["mistral-large-latest", .05],
	["mistral-medium-2508", .04],
	["mistral-medium-3-5", .15],
	["mistral-small-latest", .01],
	["pixtral-large-latest", .2]
]);
function normalizeLegacyMistralModelCost(params) {
	const cost = params.model.cost;
	if (!isRecord(cost) || cost.cacheRead !== 0) return params.model;
	const normalizedCacheRead = MISTRAL_MODEL_CACHE_READ_COST_BY_ID.get(params.modelId.toLowerCase());
	if (normalizedCacheRead === void 0) return params.model;
	params.changes.push(`Normalized models.providers.${sanitizeForLog(params.providerId)}.models[${params.index}].cost.cacheRead (0 → ${normalizedCacheRead}) for Mistral prompt-cache billing.`);
	return {
		...params.model,
		cost: {
			...cost,
			cacheRead: normalizedCacheRead
		}
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-core-normalizers.ts
const log = createSubsystemLogger("doctor");
/** Seed an empty account map without changing an existing account set or route. */
function seedMissingDefaultAccountsFromSingleAccountBase(cfg, changes) {
	const next = cloneConfigWithResolutionFacts(cfg);
	const before = changes.length;
	for (const [channelId, channel] of Object.entries(next.channels ?? {})) {
		if (!isRecord(channel) || !isRecord(channel.accounts) || Object.keys(channel.accounts).length) continue;
		const promotion = resolveSingleAccountPromotion({
			channelKey: channelId,
			channel,
			resolveBundledSurface: (key) => resolveDiscoveredChannelSetupPromotionSurface(key, cfg)
		});
		if (promotion.kind === "preserve-root") continue;
		if (promotion.shouldDeferPromotion) {
			log.debug(`Deferring channels.${channelId} single-account promotion until its plugin declares uncovered root keys.`);
			continue;
		}
		if (promotion.keysToMove.length === 0) continue;
		const defaultAccount = {};
		for (const key of promotion.keysToMove) {
			defaultAccount[key] = channel[key];
			delete channel[key];
		}
		channel.accounts = { [DEFAULT_ACCOUNT_ID]: defaultAccount };
		changes.push(`Moved channels.${channelId} single-account top-level values into channels.${channelId}.accounts.default.`);
	}
	if (changes.length > before && Array.isArray(next.channels)) next.channels = Object.fromEntries(Object.entries(next.channels));
	copyConfigResolutionFactsThroughRewrite(cfg, next);
	return inheritLegacyDefaultAgentId(cfg, next);
}
function migrateUnblockedLegacyRuntimeModelRef(modelRef, blockedModelIdentities) {
	return isBlockedLegacyCodexModelRef({
		modelRef,
		blockedModelIdentities
	}) ? null : migrateLegacyRuntimeModelRef(modelRef);
}
function mergeModelEntry(legacyEntry, currentEntry) {
	return isRecord(legacyEntry) && isRecord(currentEntry) ? mergeModelRefMapEntries(currentEntry, legacyEntry, "models").value : currentEntry ?? legacyEntry;
}
function migrateCodexCliRuntimePolicy(raw) {
	if (!isRecord(raw) || normalizeOptionalLowercaseString(raw.id) !== "codex-cli") return false;
	raw.id = "codex";
	return true;
}
function createRuntimeModelRefRewriter(blockedModelIdentities) {
	const selected = [];
	return {
		selected,
		rewrite: (ref) => {
			const migrated = typeof ref === "string" ? migrateUnblockedLegacyRuntimeModelRef(ref, blockedModelIdentities) : null;
			if (migrated) selected.push({
				ref: migrated.ref,
				runtime: migrated.runtime
			});
			return migrated?.ref ?? ref;
		}
	};
}
function migrateRuntimeSelection(owner, blockedModelIdentities) {
	const { rewrite, selected } = createRuntimeModelRefRewriter(blockedModelIdentities);
	const model = owner.model;
	if (typeof model === "string") owner.model = rewrite(model);
	else if (isRecord(model)) {
		if (typeof model.primary === "string") model.primary = rewrite(model.primary);
		if (Array.isArray(model.fallbacks)) model.fallbacks = model.fallbacks.map(rewrite);
	}
	return selected;
}
function ensureSelectedModelRuntimePolicies(agent, selected) {
	if (selected.length === 0) return false;
	const models = isRecord(agent.models) ? agent.models : {};
	let changed = false;
	for (const { ref, runtime } of selected) {
		const updated = modelEntryWithRuntimePolicy(models[ref], runtime);
		if (updated.changed) {
			models[ref] = updated.entry;
			changed = true;
		}
	}
	if (changed) agent.models = models;
	return changed;
}
function migrateRuntimeAgent(agent, path, changes, blockedModelIdentities) {
	const selected = migrateRuntimeSelection(agent, blockedModelIdentities);
	if (selected.length) changes.push(`Moved ${path}.model legacy runtime primary refs to provider references and selected ${selected[0].runtime} runtime.`);
	const policy = isRecord(agent.modelPolicy) ? agent.modelPolicy : void 0;
	const { rewrite, selected: policyRefs } = createRuntimeModelRefRewriter(blockedModelIdentities);
	const allow = Array.isArray(policy?.allow) ? policy.allow.map(rewrite) : void 0;
	if (isRecord(agent.models)) {
		const models = {};
		const legacy = [];
		for (const [ref, entry] of Object.entries(agent.models)) {
			const migrated = migrateUnblockedLegacyRuntimeModelRef(ref, blockedModelIdentities);
			if (migrated) legacy.push({
				ref: migrated.ref,
				runtime: migrated.runtime,
				entry
			});
			else models[ref] = mergeModelEntry(entry, models[ref]);
		}
		for (const { ref, runtime, entry } of legacy) models[ref] = modelEntryWithRuntimePolicy(mergeModelEntry(entry, models[ref]), runtime).entry;
		if (legacy.length) {
			agent.models = models;
			changes.push(`Moved ${path}.models legacy runtime keys to provider keys.`);
		}
	}
	if (ensureSelectedModelRuntimePolicies(agent, policyRefs)) changes.push(`Preserved runtime policy for ${path}.modelPolicy.allow entries.`);
	if (ensureSelectedModelRuntimePolicies(agent, selected)) changes.push(`Selected ${selected[0].runtime} runtime for ${path}.models entries.`);
	for (const key of ["heartbeat", "subagents"]) {
		const execution = agent[key];
		if (!isRecord(execution)) continue;
		const refs = migrateRuntimeSelection(execution, blockedModelIdentities);
		if (refs.length) {
			ensureSelectedModelRuntimePolicies(agent, refs);
			changes.push(`Moved ${path}.${key}.model to provider references with model runtime policy.`);
		}
	}
	if (policy && policyRefs.length) {
		policy.allow = allow;
		changes.push(`Moved ${path}.modelPolicy.allow legacy runtime refs to provider references.`);
	}
	for (const [ref, entry] of Object.entries(isRecord(agent.models) ? agent.models : {})) if (isRecord(entry) && migrateCodexCliRuntimePolicy(entry.agentRuntime)) changes.push(`Moved ${path}.models.${sanitizeForLog(ref)} agentRuntime.id from codex-cli to codex.`);
}
/** Move legacy runtime-tagged refs on a private copy, preserving the caller's source. */
function normalizeLegacyRuntimeModelRefs(cfg, changes, blockedModelIdentities) {
	const next = cloneConfigWithResolutionFacts(cfg);
	for (const [providerId, provider] of modelProviders(next)) {
		if (migrateCodexCliRuntimePolicy(provider.agentRuntime)) changes.push(`Moved models.providers.${sanitizeForLog(providerId)} agentRuntime.id from codex-cli to codex.`);
		for (const [index, model] of providerModels(provider)) if (migrateCodexCliRuntimePolicy(model.agentRuntime)) {
			const modelId = normalizeOptionalString(model.id) ?? `[${index}]`;
			changes.push(`Moved models.providers.${sanitizeForLog(providerId)}.models.${sanitizeForLog(modelId)} agentRuntime.id from codex-cli to codex.`);
		}
	}
	const agents = next.agents;
	if (isRecord(agents)) {
		if (isRecord(agents.defaults)) migrateRuntimeAgent(agents.defaults, "agents.defaults", changes, blockedModelIdentities);
		for (const [key, entry] of Array.isArray(agents.list) ? agents.list.entries() : []) if (isRecord(entry)) {
			const id = normalizeOptionalString(entry.id);
			migrateRuntimeAgent(entry, id ? `agents.list.${sanitizeForLog(id)}` : `agents.list[${key}]`, changes, blockedModelIdentities);
		}
		for (const [id, entry] of Object.entries(isRecord(agents.entries) ? agents.entries : {})) if (isRecord(entry)) migrateRuntimeAgent(entry, `agents.entries.${sanitizeForLog(id)}`, changes, blockedModelIdentities);
	}
	const rewritten = rewriteModelRefs(next, "config", changes, (ref) => {
		const migrated = migrateUnblockedLegacyRuntimeModelRef(ref, blockedModelIdentities);
		return migrated && [
			"codex-cli",
			"claude-cli",
			"google-gemini-cli"
		].includes(migrated.legacyProvider) ? migrated.ref : null;
	}).value;
	copyConfigResolutionFactsThroughRewrite(cfg, rewritten);
	return inheritLegacyDefaultAgentId(cfg, rewritten);
}
function* modelProviders(cfg) {
	const providers = cfg.models?.providers;
	if (!isRecord(providers)) return;
	for (const [id, provider] of Object.entries(providers)) if (isRecord(provider)) yield [id, provider];
}
function* providerModels(provider) {
	if (Array.isArray(provider.models)) {
		for (const [index, model] of provider.models.entries()) if (isRecord(model)) yield [index, model];
	}
}
/** Mutate the Doctor-owned private candidate; plugin hooks retain their own rollback copies. */
function normalizeLegacyOpenAICodexModelsAddMetadata(cfg, changes) {
	for (const [providerId, provider] of modelProviders(cfg)) {
		if (normalizeProviderId(providerId) !== "openai-codex") continue;
		for (const [, model] of providerModels(provider)) if (!("metadataSource" in model) && isLegacyModelsAddCodexMetadataModel({
			provider: providerId,
			model
		})) {
			model.metadataSource = "models-add";
			changes.push(`Marked models.providers.${sanitizeForLog(providerId)}.models.${sanitizeForLog(normalizeOptionalString(model.id) ?? "unknown")} as /models add metadata so official OpenAI Codex metadata can override it.`);
		}
	}
}
function normalizeLegacyOpenAIModelProviderApi(cfg, changes) {
	const migrateApi = (owner, path) => {
		if (owner.api === "openai") {
			owner.api = "openai-completions";
			changes.push(`Moved ${path}.api "openai" → "openai-completions".`);
		}
	};
	for (const [providerId, provider] of modelProviders(cfg)) {
		const path = `models.providers.${sanitizeForLog(providerId)}`;
		migrateApi(provider, path);
		for (const [index, model] of providerModels(provider)) migrateApi(model, `${path}.models[${index}]`);
	}
}
/** Remove retired bundled skill config after migrating its image model and credentials. */
function normalizeLegacyNanoBananaSkill(cfg, changes) {
	const key = "nano-banana-pro";
	const model = "google/gemini-3-pro-image-preview";
	const skills = cfg.skills;
	if (!isRecord(skills)) return;
	if (Array.isArray(skills.allowBundled)) {
		const filtered = skills.allowBundled.filter((value) => typeof value !== "string" || value.trim() !== key);
		if (filtered.length !== skills.allowBundled.length) {
			if (filtered.length) {
				skills.allowBundled = filtered;
				changes.push(`Removed ${key} from skills.allowBundled.`);
			} else {
				delete skills.allowBundled;
				changes.push(`Removed skills.allowBundled entry for ${key}.`);
			}
		}
	}
	const entries = skills.entries;
	if (!isRecord(entries) || !isRecord(entries[key])) return;
	const legacy = entries[key];
	if (cfg.agents?.defaults?.mediaModels?.image === void 0) {
		cfg.agents = {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				mediaModels: {
					...cfg.agents?.defaults?.mediaModels,
					image: { primary: model }
				}
			}
		};
		changes.push(`Moved skills.entries.${key} → agents.defaults.mediaModels.image.primary (${model}).`);
	}
	const legacyEnvKey = normalizeOptionalString(isRecord(legacy.env) ? legacy.env.GEMINI_API_KEY : void 0) ?? "";
	const apiKey = legacyEnvKey || (typeof legacy.apiKey === "string" ? normalizeOptionalString(legacy.apiKey) : isRecord(legacy.apiKey) ? legacy.apiKey : void 0);
	const models = isRecord(cfg.models) ? cfg.models : {};
	const providers = isRecord(models.providers) ? models.providers : {};
	const google = isRecord(providers.google) ? providers.google : {
		baseUrl: DEFAULT_GOOGLE_API_BASE_URL,
		models: []
	};
	if (google.apiKey === void 0 && apiKey) {
		google.apiKey = apiKey;
		google.baseUrl ||= DEFAULT_GOOGLE_API_BASE_URL;
		if (!Array.isArray(google.models)) google.models = [];
		providers.google = google;
		models.providers = providers;
		cfg.models = models;
		changes.push(`Moved skills.entries.${key}.${legacyEnvKey ? "env.GEMINI_API_KEY" : "apiKey"} → models.providers.google.apiKey.`);
	}
	delete entries[key];
	if (Object.keys(entries).length === 0) delete skills.entries;
	changes.push(`Removed legacy skills.entries.${key}.`);
	if (Object.keys(skills).length === 0) delete cfg.skills;
}
function normalizeConfiguredPositiveInteger(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function resolveConfiguredOllamaModelNumCtxBudget(model, provider, providerNumCtxApplies) {
	if (normalizeConfiguredPositiveInteger(model.contextTokens) !== void 0) return;
	const contextWindow = normalizeConfiguredPositiveInteger(model.contextWindow);
	const providerWindow = normalizeConfiguredPositiveInteger(provider.contextWindow);
	if (contextWindow !== void 0 || providerWindow !== void 0) return contextWindow ?? (providerNumCtxApplies ? void 0 : providerWindow);
	return normalizeConfiguredPositiveInteger(model.maxTokens) ?? (providerNumCtxApplies ? void 0 : normalizeConfiguredPositiveInteger(provider.maxTokens));
}
function normalizeLegacyOllamaNativeNumCtxParams(cfg, changes) {
	for (const [providerId, provider] of modelProviders(cfg)) {
		if (!Array.isArray(provider.models)) continue;
		const models = [...providerModels(provider)];
		const nativeProvider = normalizeOptionalLowercaseString(provider.api) === "ollama";
		const providerParams = provider.params;
		if (nativeProvider && (providerParams === void 0 || isRecord(providerParams)) && !Object.hasOwn(providerParams ?? {}, "num_ctx") && !models.some(([, entry]) => normalizeConfiguredPositiveInteger(entry.contextTokens) !== void 0)) {
			const numCtx = normalizeConfiguredPositiveInteger(provider.contextWindow) ?? normalizeConfiguredPositiveInteger(provider.maxTokens);
			if (numCtx !== void 0) {
				provider.params = {
					...providerParams,
					num_ctx: numCtx
				};
				changes.push(`Set models.providers.${sanitizeForLog(providerId)}.params.num_ctx to ${numCtx} for native Ollama compatibility.`);
			}
		}
		const providerNumCtxApplies = nativeProvider && isRecord(provider.params) && Object.hasOwn(provider.params, "num_ctx");
		for (const [index, model] of models) {
			const api = normalizeOptionalLowercaseString(model.api) || normalizeOptionalLowercaseString(provider.api);
			const params = model.params;
			if (api !== "ollama" || params !== void 0 && !isRecord(params) || Object.hasOwn(params ?? {}, "num_ctx")) continue;
			const numCtx = resolveConfiguredOllamaModelNumCtxBudget(model, provider, providerNumCtxApplies);
			if (numCtx !== void 0) {
				model.params = {
					...params,
					num_ctx: numCtx
				};
				changes.push(`Set models.providers.${sanitizeForLog(providerId)}.models[${index}].params.num_ctx to ${numCtx} for native Ollama compatibility.`);
			}
		}
	}
}
function normalizeLegacyMistralModelDefaults(cfg, changes) {
	for (const [providerId, provider] of modelProviders(cfg)) {
		if (normalizeProviderId(providerId) !== "mistral") continue;
		for (const [index, model] of providerModels(provider)) {
			const modelId = normalizeOptionalString(model.id) ?? "";
			if (!modelId) continue;
			const contextWindow = asFiniteNumber(model.contextWindow) ?? null;
			const maxTokens = asFiniteNumber(model.maxTokens) ?? null;
			if (contextWindow !== null && maxTokens !== null) {
				const normalizedMaxTokens = resolveNormalizedProviderModelMaxTokens({
					providerId,
					modelId,
					contextWindow,
					rawMaxTokens: maxTokens
				});
				if (normalizedMaxTokens !== maxTokens) {
					model.maxTokens = normalizedMaxTokens;
					changes.push(`Normalized models.providers.${providerId}.models[${index}].maxTokens (${maxTokens} → ${normalizedMaxTokens}) to avoid Mistral context-window rejects.`);
				}
			}
			Object.assign(model, normalizeLegacyMistralModelCost({
				providerId,
				model,
				modelId,
				index,
				changes
			}));
		}
	}
}
//#endregion
//#region src/commands/doctor/shared/legacy-secret-inputs.ts
/** Normalize only registered credential paths before config validation and backup/write. */
function migrateLegacySecretInputs(config) {
	let next;
	const changes = [];
	for (const target of discoverConfigSecretTargets(config)) {
		const original = target.value;
		const providerless = isLegacySecretRefWithoutProvider(original);
		const ref = providerless ? coerceSecretRef(target.value, config.secrets?.defaults) : parseLegacySecretRefEnvMarker(target.value, config.secrets?.defaults?.env);
		if (!ref) continue;
		next ??= structuredClone(config);
		if (setPathExistingStrict(next, target.pathSegments, ref)) {
			changes.push(providerless ? `Added provider ${ref.provider} to ${target.path} SecretRef.` : `Moved ${target.path} ${String(target.value).trim()} marker → structured env SecretRef.`);
			if (hasLegacySecretRefExtraFields(original)) changes.push(`Canonicalized ${target.path} SecretRef to source/provider/id; Doctor preserves removed fields in the original config backup before writing the repair.`);
		}
	}
	return {
		config: next ?? config,
		changes
	};
}
//#endregion
//#region src/commands/doctor/shared/reserved-mcp-server-name-migrate.ts
const RESERVED_MCP_SERVER_NAME = "__proto__";
function resolveMcpServers(raw, nodeHost) {
	const root = asOptionalRecord(raw);
	const owner = nodeHost ? asOptionalRecord(root?.nodeHost) : root;
	return asOptionalRecord(asOptionalRecord(owner?.mcp)?.servers);
}
/** Drop reserved MCP server names before canonical config validation runs. */
function migrateReservedMcpServerNames(cfg, sourceRaw = cfg) {
	const locations = [{
		path: "mcp.servers",
		nodeHost: false
	}, {
		path: "nodeHost.mcp.servers",
		nodeHost: true
	}].filter(({ nodeHost }) => [sourceRaw, cfg].some((value) => Object.hasOwn(resolveMcpServers(value, nodeHost) ?? {}, RESERVED_MCP_SERVER_NAME)));
	if (locations.length === 0) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const changes = [];
	for (const { path, nodeHost } of locations) {
		const servers = resolveMcpServers(next, nodeHost);
		if (servers) delete servers[RESERVED_MCP_SERVER_NAME];
		changes.push(`Dropped MCP server "${RESERVED_MCP_SERVER_NAME}" from ${path} because the name is reserved; re-add it under a different name.`);
	}
	return {
		config: next,
		changes
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-core-migrate.ts
function repairAgentRoster(cfg, repair) {
	const roster = readAgentRosterProperty(cfg);
	const values = roster?.value;
	if (!roster || !isRecord(values) && !Array.isArray(values) || Array.isArray(values) !== (roster.kind === "list")) return;
	for (const [key, agent] of Object.entries(values)) if (isRecord(agent)) repair(agent, roster.kind === "entries" ? `agents.entries.${key}` : `agents.list[${key}]`);
}
function reportInvalidHeartbeatActiveHours(cfg, warnings) {
	const repairHeartbeat = (heartbeat, path) => {
		if (!isRecord(heartbeat) || !Object.hasOwn(heartbeat, "activeHours")) return;
		const parsed = HeartbeatSchema.safeParse({ activeHours: heartbeat.activeHours });
		if (parsed.success) return;
		for (const issue of parsed.error.issues) {
			const field = issue.path.map(String);
			const value = JSON.stringify(getConfigValueAtPath(heartbeat, field));
			warnings.push(`Kept invalid ${path}.${field.join(".")}=${value}: ${issue.message}. Heartbeat config remains invalid; fix the value, then rerun "openclaw doctor --fix".`);
		}
	};
	repairHeartbeat(cfg.agents?.defaults?.heartbeat, "agents.defaults.heartbeat");
	repairAgentRoster(cfg, (agent, path) => repairHeartbeat(agent.heartbeat, `${path}.heartbeat`));
}
function repairNullAgentWorkspaces(cfg, changes) {
	let repaired = 0;
	repairAgentRoster(cfg, (agent) => {
		if (agent.workspace === null) {
			repaired += 1;
			delete agent.workspace;
		}
	});
	if (repaired) changes.push(`Removed null workspace value${repaired === 1 ? "" : "s"} from agents.${readAgentRosterProperty(cfg)?.kind} entr${repaired === 1 ? "y" : "ies"}.`);
}
/** Normalize pre-admission config through core, plugin setup, channel, and secret-ref migrations. */
function normalizeCompatibilityConfigValues(raw, options = {}) {
	if (!isRecord(raw)) throw new TypeError("Compatibility config normalization requires an object");
	const changes = [];
	const warnings = [];
	const reserved = migrateReservedMcpServerNames(raw, options.sourceRaw);
	changes.push(...reserved.changes);
	let next = seedMissingDefaultAccountsFromSingleAccountBase(reserved.config, changes);
	const setup = runPluginSetupConfigMigrations({ config: next });
	next = setup.config;
	changes.push(...setup.changes);
	warnings.push(...setup.warnings ?? []);
	for (const migrate of [
		migrateLegacyWebSearchConfig,
		migrateLegacyWebFetchConfig,
		migrateLegacyXSearchConfig
	]) {
		const migrated = migrate(next);
		if (migrated.changes.length) {
			next = migrated.config;
			changes.push(...migrated.changes);
		}
	}
	normalizeLegacyNanoBananaSkill(next, changes);
	next = normalizeLegacyTalkConfig(next, changes);
	normalizeLegacyOpenAIModelProviderApi(next, changes);
	next = normalizeLegacyRuntimeModelRefs(next, changes, options.blockedModelIdentities);
	normalizeLegacyOllamaNativeNumCtxParams(next, changes);
	normalizeLegacyMistralModelDefaults(next, changes);
	stripRetiredTuningKnobs(next, changes);
	const channels = applyChannelDoctorCompatibilityMigrations(next, { historicalWebhookListeners: true });
	warnings.push(...channels.warnings ?? []);
	if (channels.changes.length) {
		next = channels.next;
		changes.push(...channels.changes);
	}
	const secrets = migrateLegacySecretInputs(next);
	if (secrets.changes.length) {
		next = secrets.config;
		changes.push(...secrets.changes);
	}
	normalizeLegacyOpenAICodexModelsAddMetadata(next, changes);
	reportInvalidHeartbeatActiveHours(next, warnings);
	repairNullAgentWorkspaces(next, changes);
	next = migrateLegacyCommandOwners(next, changes);
	next = pruneBindingsForMissingAgents(next, changes);
	copyConfigResolutionFactsThroughRewrite(raw, next);
	return {
		config: inheritLegacyDefaultAgentId(raw, next),
		changes,
		...warnings.length ? { warnings } : {}
	};
}
//#endregion
export { normalizeCompatibilityConfigValues as t };
