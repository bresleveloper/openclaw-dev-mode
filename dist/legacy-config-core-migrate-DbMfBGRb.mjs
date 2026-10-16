import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { a as coerceSecretRef, l as isLegacySecretRefWithoutProvider, m as parseLegacySecretRefEnvMarker, s as hasLegacySecretRefExtraFields } from "./types.secrets-DsPRn9Dz.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-DbRsdayc.mjs";
import { a as readAgentRosterProperty } from "./agent-roster-BXD1uMJD.mjs";
import { r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-B7ojvzQW.mjs";
import { h as resolveNormalizedProviderModelMaxTokens } from "./validation-core-DxMw-ato.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-JwCDUODD.mjs";
import { d as migrateLegacyWebFetchConfig, f as migrateLegacyWebSearchConfig, p as migrateLegacyXSearchConfig, s as normalizeLegacyTalkConfig, u as stripRetiredTuningKnobs } from "./legacy-Bu4WPgr_.mjs";
import { i as isBlockedLegacyCodexModelRef } from "./codex-route-model-ref-CA8y5Vff.mjs";
import "./legacy-config-record-shared-C4da1YWQ.mjs";
import { a as mergeModelRefMapEntries, i as isLegacyModelsAddCodexMetadataModel, n as modelEntryWithRuntimePolicy, s as rewriteModelRefs } from "./legacy-config-migrations.runtime.models-B2N4IUON.mjs";
import { a as HeartbeatSchema } from "./zod-schema.agent-runtime-cX-pI-Mt.mjs";
import { n as discoverConfigSecretTargets } from "./target-registry-query-f56MMhmb.mjs";
import { i as setPathExistingStrict } from "./path-utils-DQXhHs4r.mjs";
import "./target-registry-1a6D8fYt.mjs";
import "./plugin-registry-Cl9kmLsR.mjs";
import { a as runPluginSetupConfigMigrations } from "./setup-registry-BgUGH45p.mjs";
import { t as DEFAULT_GOOGLE_API_BASE_URL } from "./google-api-base-url-DVjll0O0.mjs";
import { s as applyChannelDoctorCompatibilityMigrations } from "./config-flow-steps-ZXEVMxo9.mjs";
import { i as migrateLegacyCommandOwners } from "./doctor-command-owner-ZwiTw8zO.mjs";
import { r as loadSetupChannelPluginFromManifestRecord } from "./read-only-bu8BjV4Y.mjs";
import { t as pruneBindingsForMissingAgents } from "./legacy-config-binding-repair-BogzCVbt.mjs";
import { t as resolveSingleAccountPromotion } from "./setup-promotion-helpers-CZR3vCRJ.mjs";
import { t as migrateLegacyRuntimeModelRef } from "./legacy-runtime-model-providers-DkyokuxH.mjs";
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
const MISTRAL_MODEL_CACHE_READ_COST_BY_ID = {
	"codestral-latest": .03,
	"devstral-medium-latest": .04,
	"magistral-small": .05,
	"mistral-large-latest": .05,
	"mistral-medium-2508": .04,
	"mistral-medium-3-5": .15,
	"mistral-small-latest": .01,
	"pixtral-large-latest": .2
};
function normalizeLegacyMistralModelCost(params) {
	const cost = params.model.cost;
	if (!isRecord(cost) || cost.cacheRead !== 0) return params.model;
	const normalizedCacheRead = MISTRAL_MODEL_CACHE_READ_COST_BY_ID[params.modelId.toLowerCase()];
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
/** Migrate legacy browser/Chrome relay config to current browser profile settings. */
function normalizeLegacyBrowserConfig(cfg, changes) {
	const rawBrowser = cfg.browser;
	if (!isRecord(rawBrowser)) return cfg;
	const browser = structuredClone(rawBrowser);
	let browserChanged = false;
	const rawProfiles = browser.profiles;
	if (isRecord(rawProfiles)) {
		const profiles = { ...rawProfiles };
		let profilesChanged = false;
		for (const [profileName, rawProfile] of Object.entries(rawProfiles)) {
			if (!isRecord(rawProfile)) continue;
			if ((normalizeOptionalString(rawProfile.driver) ?? "") !== "extension" || !normalizeOptionalString(rawProfile.cdpUrl)) continue;
			const nextProfile = { ...rawProfile };
			delete nextProfile.cdpUrl;
			profiles[profileName] = nextProfile;
			profilesChanged = true;
			changes.push(`Removed browser.profiles.${profileName}.cdpUrl (extension driver profiles own their relay endpoint).`);
		}
		if (profilesChanged) {
			browser.profiles = profiles;
			browserChanged = true;
		}
	}
	if (!browserChanged) return cfg;
	return {
		...cfg,
		browser
	};
}
/** Seed an empty account map without changing an existing account set or route. */
function seedMissingDefaultAccountsFromSingleAccountBase(cfg, changes) {
	const channels = cfg.channels;
	if (!channels) return cfg;
	let channelsChanged = false;
	const nextChannels = { ...channels };
	for (const [channelId, rawChannel] of Object.entries(channels)) {
		if (!isRecord(rawChannel)) continue;
		const rawAccounts = rawChannel.accounts;
		if (!isRecord(rawAccounts)) continue;
		if (Object.keys(rawAccounts).length > 0) continue;
		const promotion = resolveSingleAccountPromotion({
			channelKey: channelId,
			channel: rawChannel,
			resolveBundledSurface: (key) => resolveDiscoveredChannelSetupPromotionSurface(key, cfg)
		});
		if (promotion.kind === "preserve-root") continue;
		if (promotion.shouldDeferPromotion) {
			log.debug(`Deferring channels.${channelId} single-account promotion until its plugin declares uncovered root keys.`);
			continue;
		}
		const keysToMove = promotion.keysToMove;
		if (keysToMove.length === 0) continue;
		const defaultAccount = {};
		for (const key of keysToMove) {
			const value = rawChannel[key];
			defaultAccount[key] = value && typeof value === "object" ? structuredClone(value) : value;
		}
		const nextChannel = { ...rawChannel };
		for (const key of keysToMove) delete nextChannel[key];
		nextChannel.accounts = { [DEFAULT_ACCOUNT_ID]: defaultAccount };
		nextChannels[channelId] = nextChannel;
		channelsChanged = true;
		changes.push(`Moved channels.${channelId} single-account top-level values into channels.${channelId}.accounts.default.`);
	}
	if (!channelsChanged) return cfg;
	return {
		...cfg,
		channels: nextChannels
	};
}
const LEGACY_CODEX_CLI_RUNTIME_ID = "codex-cli";
const CODEX_APP_SERVER_RUNTIME_ID = "codex";
function migrateUnblockedLegacyRuntimeModelRef(modelRef, blockedModelIdentities) {
	return isBlockedLegacyCodexModelRef({
		modelRef,
		blockedModelIdentities
	}) ? null : migrateLegacyRuntimeModelRef(modelRef);
}
function mergeModelEntry(legacyEntry, currentEntry) {
	if (!isRecord(legacyEntry) || !isRecord(currentEntry)) return currentEntry ?? legacyEntry;
	return mergeModelRefMapEntries(currentEntry, legacyEntry, "models").value;
}
function normalizeLegacyCodexCliAgentRuntimePolicy(raw) {
	if (!isRecord(raw)) return {
		value: raw,
		changed: false
	};
	if (normalizeOptionalLowercaseString(raw.id) !== LEGACY_CODEX_CLI_RUNTIME_ID) return {
		value: raw,
		changed: false
	};
	return {
		value: {
			...raw,
			id: CODEX_APP_SERVER_RUNTIME_ID
		},
		changed: true
	};
}
function normalizeLegacyRuntimeAgentModelConfig(raw, blockedModelIdentities) {
	const selectedRefs = [];
	const migrate = (ref) => {
		const migrated = typeof ref === "string" ? migrateUnblockedLegacyRuntimeModelRef(ref, blockedModelIdentities) : null;
		if (!migrated) return ref;
		selectedRefs.push({
			ref: migrated.ref,
			runtime: migrated.runtime
		});
		return migrated.ref;
	};
	if (typeof raw === "string") {
		const value = migrate(raw);
		return selectedRefs.length > 0 ? {
			value,
			changed: true,
			selectedRuntime: selectedRefs[0].runtime,
			selectedRefs
		} : {
			value: raw,
			changed: false,
			selectedRefs: []
		};
	}
	if (!isRecord(raw)) return {
		value: raw,
		changed: false,
		selectedRefs: []
	};
	const next = { ...raw };
	if (typeof raw.primary === "string") next.primary = migrate(raw.primary);
	if (Array.isArray(raw.fallbacks)) next.fallbacks = raw.fallbacks.map(migrate);
	if (selectedRefs.length === 0) return {
		value: raw,
		changed: false,
		selectedRefs: []
	};
	return {
		value: next,
		changed: true,
		selectedRuntime: selectedRefs[0].runtime,
		selectedRefs
	};
}
function normalizeLegacyRuntimeAllowlistModels(rawModels, blockedModelIdentities) {
	if (!isRecord(rawModels)) return {
		value: rawModels,
		changed: false
	};
	let changed = false;
	const next = {};
	const legacyEntries = [];
	for (const [rawKey, entry] of Object.entries(rawModels)) {
		const migrated = migrateUnblockedLegacyRuntimeModelRef(rawKey, blockedModelIdentities);
		if (migrated) {
			changed = true;
			legacyEntries.push({
				migratedKey: migrated.ref,
				entry,
				runtime: migrated.runtime
			});
			continue;
		}
		next[rawKey] = mergeModelEntry(entry, next[rawKey]);
	}
	for (const { migratedKey, entry, runtime } of legacyEntries) next[migratedKey] = modelEntryWithRuntimePolicy(mergeModelEntry(entry, next[migratedKey]), runtime).entry;
	return {
		value: next,
		changed
	};
}
function normalizeLegacyRuntimeModelPolicy(rawPolicy, blockedModelIdentities) {
	if (!isRecord(rawPolicy) || !Array.isArray(rawPolicy.allow)) return {
		value: rawPolicy,
		runtimes: /* @__PURE__ */ new Set(),
		selectedRefs: []
	};
	const runtimes = /* @__PURE__ */ new Set();
	const selectedRefs = [];
	const allow = rawPolicy.allow.map((entry) => {
		if (typeof entry !== "string") return entry;
		const migrated = migrateUnblockedLegacyRuntimeModelRef(entry, blockedModelIdentities);
		if (!migrated) return entry;
		runtimes.add(migrated.runtime);
		selectedRefs.push({
			ref: migrated.ref,
			runtime: migrated.runtime
		});
		return migrated.ref;
	});
	return {
		value: runtimes.size > 0 ? {
			...rawPolicy,
			allow
		} : rawPolicy,
		runtimes,
		selectedRefs
	};
}
function ensureSelectedModelRuntimePolicies(rawModels, selectedRefs) {
	if (selectedRefs.length === 0) return {
		value: rawModels,
		changed: false
	};
	const next = isRecord(rawModels) ? { ...rawModels } : {};
	let changed = false;
	for (const { ref, runtime } of selectedRefs) {
		const current = next[ref];
		const updated = modelEntryWithRuntimePolicy(current, runtime);
		if (!updated.changed) continue;
		next[ref] = updated.entry;
		changed = true;
	}
	return {
		value: next,
		changed
	};
}
function normalizeLegacyCodexCliRuntimePinsInModels(rawModels, path, changes) {
	if (!isRecord(rawModels)) return {
		value: rawModels,
		changed: false
	};
	let changed = false;
	const next = { ...rawModels };
	for (const [modelRef, rawEntry] of Object.entries(rawModels)) {
		if (!isRecord(rawEntry)) continue;
		const runtime = normalizeLegacyCodexCliAgentRuntimePolicy(rawEntry.agentRuntime);
		if (!runtime.changed) continue;
		next[modelRef] = {
			...rawEntry,
			agentRuntime: runtime.value
		};
		changed = true;
		changes.push(`Moved ${path}.${sanitizeForLog(modelRef)} agentRuntime.id from codex-cli to codex.`);
	}
	return {
		value: next,
		changed
	};
}
function normalizeLegacyRuntimeAgentContainer(raw, path, changes, blockedModelIdentities) {
	let changed = false;
	const next = { ...raw };
	const model = normalizeLegacyRuntimeAgentModelConfig(raw.model, blockedModelIdentities);
	if (model.changed) {
		next.model = model.value;
		changed = true;
		const runtimeSuffix = model.selectedRuntime ? ` and selected ${model.selectedRuntime} runtime` : "";
		changes.push(`Moved ${path}.model legacy runtime primary refs to canonical provider refs${runtimeSuffix}.`);
	}
	const modelPolicy = normalizeLegacyRuntimeModelPolicy(raw.modelPolicy, blockedModelIdentities);
	const models = normalizeLegacyRuntimeAllowlistModels(raw.models, blockedModelIdentities);
	if (models.changed) {
		next.models = models.value;
		changed = true;
		changes.push(`Moved ${path}.models legacy runtime keys to canonical provider keys.`);
	}
	const policyRuntimes = ensureSelectedModelRuntimePolicies(next.models, modelPolicy.selectedRefs);
	if (policyRuntimes.changed) {
		next.models = policyRuntimes.value;
		changed = true;
		changes.push(`Preserved runtime policy for ${path}.modelPolicy.allow entries.`);
	}
	if (model.selectedRuntime) {
		const modelRuntimes = ensureSelectedModelRuntimePolicies(next.models, model.selectedRefs);
		if (modelRuntimes.changed) {
			next.models = modelRuntimes.value;
			changed = true;
			changes.push(`Selected ${model.selectedRuntime} runtime for ${path}.models entries.`);
		}
	}
	for (const key of ["heartbeat", "subagents"]) {
		const execution = raw[key];
		if (!isRecord(execution)) continue;
		const selection = normalizeLegacyRuntimeAgentModelConfig(execution.model, blockedModelIdentities);
		if (!selection.changed) continue;
		next[key] = {
			...execution,
			model: selection.value
		};
		const runtimes = ensureSelectedModelRuntimePolicies(next.models, selection.selectedRefs);
		if (runtimes.changed) next.models = runtimes.value;
		changed = true;
		changes.push(`Moved ${path}.${key}.model to canonical refs with model runtime policy.`);
	}
	if (modelPolicy.runtimes.size > 0) {
		next.modelPolicy = modelPolicy.value;
		changed = true;
		changes.push(`Moved ${path}.modelPolicy.allow legacy runtime refs to canonical provider refs.`);
	}
	const codexCliRuntimePins = normalizeLegacyCodexCliRuntimePinsInModels(next.models, `${path}.models`, changes);
	if (codexCliRuntimePins.changed) {
		next.models = codexCliRuntimePins.value;
		changed = true;
	}
	return {
		value: next,
		changed
	};
}
function normalizeLegacyCodexCliProviderRuntimePins(cfg, changes) {
	return normalizeModelProviders(cfg, (rawProvider, providerId) => {
		let provider = rawProvider;
		const providerRuntime = normalizeLegacyCodexCliAgentRuntimePolicy(rawProvider.agentRuntime);
		if (providerRuntime.changed) {
			provider = {
				...provider,
				agentRuntime: providerRuntime.value
			};
			changes.push(`Moved models.providers.${sanitizeForLog(providerId)} agentRuntime.id from codex-cli to codex.`);
		}
		return normalizeProviderModels(provider, (entry, index) => {
			const runtime = normalizeLegacyCodexCliAgentRuntimePolicy(entry.agentRuntime);
			if (!runtime.changed) return entry;
			const modelId = normalizeOptionalString(entry.id) ?? `[${index}]`;
			changes.push(`Moved models.providers.${sanitizeForLog(providerId)}.models.${sanitizeForLog(modelId)} agentRuntime.id from codex-cli to codex.`);
			return {
				...entry,
				agentRuntime: runtime.value
			};
		});
	});
}
/** Move legacy runtime-tagged model/provider refs onto current agentRuntime policy fields. */
function normalizeLegacyRuntimeModelRefs(cfg, changes, blockedModelIdentities) {
	const cfgWithProviders = normalizeLegacyCodexCliProviderRuntimePins(cfg, changes);
	const rewriteRemainingSlots = (config) => rewriteModelRefs(config, "config", changes, (modelRef) => {
		const migrated = migrateUnblockedLegacyRuntimeModelRef(modelRef, blockedModelIdentities);
		return migrated && (migrated.legacyProvider === "codex-cli" || migrated.legacyProvider === "claude-cli" || migrated.legacyProvider === "google-gemini-cli") ? migrated.ref : null;
	}).value;
	const rawAgents = cfgWithProviders.agents;
	if (!isRecord(rawAgents)) return rewriteRemainingSlots(cfgWithProviders);
	let changed = false;
	const nextAgents = { ...rawAgents };
	if (isRecord(rawAgents.defaults)) {
		const defaults = normalizeLegacyRuntimeAgentContainer(rawAgents.defaults, "agents.defaults", changes, blockedModelIdentities);
		if (defaults.changed) {
			nextAgents.defaults = defaults.value;
			changed = true;
		}
	}
	if (Array.isArray(rawAgents.list)) {
		const nextList = rawAgents.list.map((entry, index) => {
			if (!isRecord(entry)) return entry;
			const agentId = normalizeOptionalString(entry.id);
			const agent = normalizeLegacyRuntimeAgentContainer(entry, agentId ? `agents.list.${sanitizeForLog(agentId)}` : `agents.list[${index}]`, changes, blockedModelIdentities);
			if (agent.changed) {
				changed = true;
				return agent.value;
			}
			return entry;
		});
		if (changed) nextAgents.list = nextList;
	}
	if (isRecord(rawAgents.entries)) {
		let nextEntries;
		for (const [agentId, entry] of Object.entries(rawAgents.entries)) {
			if (!isRecord(entry)) continue;
			const agent = normalizeLegacyRuntimeAgentContainer(entry, `agents.entries.${sanitizeForLog(agentId)}`, changes, blockedModelIdentities);
			if (agent.changed) (nextEntries ??= { ...rawAgents.entries })[agentId] = agent.value;
		}
		if (nextEntries) {
			nextAgents.entries = nextEntries;
			changed = true;
		}
	}
	return rewriteRemainingSlots(changed ? {
		...cfgWithProviders,
		agents: nextAgents
	} : cfgWithProviders);
}
/** Add missing metadata source markers to legacy OpenAI Codex model catalog entries. */
function normalizeLegacyOpenAICodexModelsAddMetadata(cfg, changes) {
	return normalizeModelProviders(cfg, (rawProvider, providerId) => {
		if (normalizeProviderId(providerId) !== "openai-codex") return rawProvider;
		return normalizeProviderModels(rawProvider, (model) => {
			if ("metadataSource" in model || !isLegacyModelsAddCodexMetadataModel({
				provider: providerId,
				model
			})) return model;
			const safeProviderId = sanitizeForLog(providerId);
			const safeModelId = sanitizeForLog(normalizeOptionalString(model.id) ?? "unknown");
			changes.push(`Marked models.providers.${safeProviderId}.models.${safeModelId} as /models add metadata so official OpenAI Codex metadata can override it.`);
			return Object.assign({}, model, { metadataSource: "models-add" });
		});
	});
}
function normalizeProviderModels(provider, normalize) {
	if (!Array.isArray(provider.models)) return provider;
	let changed = false;
	const models = provider.models.map((model, index) => {
		const next = isRecord(model) ? normalize(model, index) : model;
		changed ||= next !== model;
		return next;
	});
	return changed ? {
		...provider,
		models
	} : provider;
}
function normalizeModelProviders(cfg, normalize) {
	const providers = cfg.models?.providers;
	if (!isRecord(providers)) return cfg;
	let nextProviders;
	for (const [providerId, provider] of Object.entries(providers)) {
		if (!isRecord(provider)) continue;
		const next = normalize(provider, providerId);
		if (next !== provider) (nextProviders ??= { ...providers })[providerId] = next;
	}
	return nextProviders ? {
		...cfg,
		models: {
			...cfg.models,
			providers: nextProviders
		}
	} : cfg;
}
/** Rename legacy OpenAI API identifiers to the current completion/chat API ids. */
function normalizeLegacyOpenAIModelProviderApi(cfg, changes) {
	return normalizeModelProviders(cfg, (rawProvider, providerId) => {
		let provider = rawProvider;
		if (provider.api === "openai") {
			provider = {
				...provider,
				api: "openai-completions"
			};
			changes.push(`Moved models.providers.${sanitizeForLog(providerId)}.api "openai" → "openai-completions".`);
		}
		return normalizeProviderModels(provider, (model, index) => {
			if (model.api !== "openai") return model;
			changes.push(`Moved models.providers.${sanitizeForLog(providerId)}.models[${index}].api "openai" → "openai-completions".`);
			return {
				...model,
				api: "openai-completions"
			};
		});
	});
}
/** Remove retired bundled nano-banana skill config after migrating image generation models. */
function normalizeLegacyNanoBananaSkill(cfg, changes) {
	const NANO_BANANA_SKILL_KEY = "nano-banana-pro";
	const NANO_BANANA_MODEL = "google/gemini-3-pro-image-preview";
	const rawSkills = cfg.skills;
	if (!isRecord(rawSkills)) return cfg;
	let next = cfg;
	let skillsChanged = false;
	const skills = structuredClone(rawSkills);
	if (Array.isArray(skills.allowBundled)) {
		const allowBundled = skills.allowBundled.filter((value) => typeof value !== "string" || value.trim() !== NANO_BANANA_SKILL_KEY);
		if (allowBundled.length !== skills.allowBundled.length) {
			if (allowBundled.length === 0) {
				delete skills.allowBundled;
				changes.push(`Removed skills.allowBundled entry for ${NANO_BANANA_SKILL_KEY}.`);
			} else {
				skills.allowBundled = allowBundled;
				changes.push(`Removed ${NANO_BANANA_SKILL_KEY} from skills.allowBundled.`);
			}
			skillsChanged = true;
		}
	}
	const rawEntries = skills.entries;
	if (!isRecord(rawEntries) || !isRecord(rawEntries[NANO_BANANA_SKILL_KEY])) {
		if (!skillsChanged) return cfg;
		return {
			...cfg,
			skills
		};
	}
	const rawLegacyEntry = rawEntries[NANO_BANANA_SKILL_KEY];
	if (next.agents?.defaults?.mediaModels?.image === void 0) {
		next = {
			...next,
			agents: {
				...next.agents,
				defaults: {
					...next.agents?.defaults,
					mediaModels: {
						...next.agents?.defaults?.mediaModels,
						image: { primary: NANO_BANANA_MODEL }
					}
				}
			}
		};
		changes.push(`Moved skills.entries.${NANO_BANANA_SKILL_KEY} → agents.defaults.mediaModels.image.primary (${NANO_BANANA_MODEL}).`);
	}
	const legacyEnv = isRecord(rawLegacyEntry.env) ? rawLegacyEntry.env : void 0;
	const legacyEnvApiKey = normalizeOptionalString(legacyEnv?.GEMINI_API_KEY) ?? "";
	const legacyApiKey = legacyEnvApiKey || (typeof rawLegacyEntry.apiKey === "string" ? normalizeOptionalString(rawLegacyEntry.apiKey) : rawLegacyEntry.apiKey && isRecord(rawLegacyEntry.apiKey) ? structuredClone(rawLegacyEntry.apiKey) : void 0);
	const rawModels = isRecord(next.models) ? structuredClone(next.models) : {};
	const rawProviders = isRecord(rawModels.providers) ? { ...rawModels.providers } : {};
	const rawGoogle = isRecord(rawProviders.google) ? { ...rawProviders.google } : {};
	if (!(rawGoogle.apiKey !== void 0) && legacyApiKey) {
		rawGoogle.apiKey = legacyApiKey;
		if (!rawGoogle.baseUrl) rawGoogle.baseUrl = DEFAULT_GOOGLE_API_BASE_URL;
		if (!Array.isArray(rawGoogle.models)) rawGoogle.models = [];
		rawProviders.google = rawGoogle;
		rawModels.providers = rawProviders;
		next = {
			...next,
			models: rawModels
		};
		changes.push(`Moved skills.entries.${NANO_BANANA_SKILL_KEY}.${legacyEnvApiKey ? "env.GEMINI_API_KEY" : "apiKey"} → models.providers.google.apiKey.`);
	}
	const entries = { ...rawEntries };
	delete entries[NANO_BANANA_SKILL_KEY];
	if (Object.keys(entries).length === 0) delete skills.entries;
	else skills.entries = entries;
	changes.push(`Removed legacy skills.entries.${NANO_BANANA_SKILL_KEY}.`);
	if (Object.keys(skills).length === 0) {
		const { skills: _ignored, ...rest } = next;
		return rest;
	}
	return {
		...next,
		skills
	};
}
function normalizeConfiguredPositiveInteger(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function resolveConfiguredOllamaModelNumCtxBudget(params) {
	if (normalizeConfiguredPositiveInteger(params.model.contextTokens) !== void 0) return;
	const modelContextWindow = normalizeConfiguredPositiveInteger(params.model.contextWindow);
	const providerContextWindow = normalizeConfiguredPositiveInteger(params.provider.contextWindow);
	if (modelContextWindow !== void 0 || providerContextWindow !== void 0) return modelContextWindow ?? (params.providerNumCtxApplies ? void 0 : providerContextWindow);
	return normalizeConfiguredPositiveInteger(params.model.maxTokens) ?? (params.providerNumCtxApplies ? void 0 : normalizeConfiguredPositiveInteger(params.provider.maxTokens));
}
function isNativeOllamaProviderConfig(provider) {
	return normalizeOptionalLowercaseString(provider.api) === "ollama";
}
function isNativeOllamaModelConfig(provider, model) {
	return (normalizeOptionalLowercaseString(model.api) || normalizeOptionalLowercaseString(provider.api)) === "ollama";
}
function hasConfiguredOllamaProviderNumCtx(provider) {
	const rawParams = provider.params;
	return isRecord(rawParams) && Object.hasOwn(rawParams, "num_ctx");
}
function applyLegacyOllamaProviderNumCtxParams(params) {
	if (!isNativeOllamaProviderConfig(params.provider)) return params.provider;
	const rawParams = params.provider.params;
	if (rawParams !== void 0 && !isRecord(rawParams)) return params.provider;
	if (rawParams && Object.hasOwn(rawParams, "num_ctx")) return params.provider;
	const numCtx = normalizeConfiguredPositiveInteger(params.provider.contextWindow) ?? normalizeConfiguredPositiveInteger(params.provider.maxTokens);
	if (numCtx === void 0) return params.provider;
	params.changes.push(`Set models.providers.${sanitizeForLog(params.providerId)}.params.num_ctx to ${numCtx} for native Ollama compatibility.`);
	return {
		...params.provider,
		params: rawParams ? {
			...rawParams,
			num_ctx: numCtx
		} : { num_ctx: numCtx }
	};
}
/** Seed native Ollama num_ctx params from legacy context-token budgets. */
function normalizeLegacyOllamaNativeNumCtxParams(cfg, changes) {
	return normalizeModelProviders(cfg, (rawProvider, providerId) => {
		const rawModels = rawProvider.models;
		if (!Array.isArray(rawModels)) return rawProvider;
		const provider = rawModels.some((model) => isRecord(model) && normalizeConfiguredPositiveInteger(model.contextTokens) !== void 0) ? rawProvider : applyLegacyOllamaProviderNumCtxParams({
			providerId,
			provider: rawProvider,
			changes
		});
		const providerNumCtxApplies = isNativeOllamaProviderConfig(provider) && hasConfiguredOllamaProviderNumCtx(provider);
		return normalizeProviderModels(provider, (model, index) => {
			if (!isNativeOllamaModelConfig(provider, model)) return model;
			const rawParams = model.params;
			if (rawParams !== void 0 && !isRecord(rawParams)) return model;
			if (rawParams && Object.hasOwn(rawParams, "num_ctx")) return model;
			const numCtx = resolveConfiguredOllamaModelNumCtxBudget({
				model,
				provider,
				providerNumCtxApplies
			});
			if (numCtx === void 0) return model;
			changes.push(`Set models.providers.${sanitizeForLog(providerId)}.models[${index}].params.num_ctx to ${numCtx} for native Ollama compatibility.`);
			return Object.assign({}, model, { params: rawParams ? {
				...rawParams,
				num_ctx: numCtx
			} : { num_ctx: numCtx } });
		});
	});
}
/** Normalize stale Mistral model defaults such as prompt-cache read cost. */
function normalizeLegacyMistralModelDefaults(cfg, changes) {
	return normalizeModelProviders(cfg, (rawProvider, providerId) => {
		if (normalizeProviderId(providerId) !== "mistral") return rawProvider;
		return normalizeProviderModels(rawProvider, (model, index) => {
			const modelId = normalizeOptionalString(model.id) ?? "";
			if (!modelId) return model;
			let nextModel = model;
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
					nextModel = Object.assign({}, nextModel, { maxTokens: normalizedMaxTokens });
					changes.push(`Normalized models.providers.${providerId}.models[${index}].maxTokens (${maxTokens} → ${normalizedMaxTokens}) to avoid Mistral context-window rejects.`);
				}
			}
			return normalizeLegacyMistralModelCost({
				providerId,
				model: nextModel,
				modelId,
				index,
				changes
			});
		});
	});
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-compatibility-base.ts
/** Run common compatibility migrations before caller-specific setup/channel passes. */
function normalizeBaseCompatibilityConfigValues(cfg, changes, afterBrowser, blockedModelIdentities) {
	let next = seedMissingDefaultAccountsFromSingleAccountBase(cfg, changes);
	next = normalizeLegacyBrowserConfig(next, changes);
	next = afterBrowser ? afterBrowser(next) : next;
	for (const migrate of [
		migrateLegacyWebSearchConfig,
		migrateLegacyWebFetchConfig,
		migrateLegacyXSearchConfig
	]) {
		const migrated = migrate(next);
		if (migrated.changes.length === 0) continue;
		next = migrated.config;
		changes.push(...migrated.changes);
	}
	next = normalizeLegacyNanoBananaSkill(next, changes);
	next = normalizeLegacyTalkConfig(next, changes);
	next = normalizeLegacyOpenAIModelProviderApi(next, changes);
	next = normalizeLegacyRuntimeModelRefs(next, changes, blockedModelIdentities);
	next = normalizeLegacyOllamaNativeNumCtxParams(next, changes);
	return normalizeLegacyMistralModelDefaults(next, changes);
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
	if (!isRecord(raw)) return;
	const owner = nodeHost ? raw.nodeHost : raw;
	if (!isRecord(owner)) return;
	const mcp = isRecord(owner.mcp) ? owner.mcp : void 0;
	return isRecord(mcp?.servers) ? mcp.servers : void 0;
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
	if (!roster || !isRecord(values) && !Array.isArray(values)) return cfg;
	if (Array.isArray(values) !== (roster.kind === "list")) return cfg;
	let changed = false;
	const entries = Object.entries(values).map(([key, agent]) => {
		const path = roster.kind === "entries" ? `agents.entries.${key}` : `agents.list[${key}]`;
		const next = isRecord(agent) ? repair(agent, path) : agent;
		changed ||= next !== agent;
		return [key, next];
	});
	return changed ? {
		...cfg,
		agents: {
			...cfg.agents,
			[roster.kind]: roster.kind === "entries" ? Object.fromEntries(entries) : entries.map(([, agent]) => agent)
		}
	} : cfg;
}
function repairInvalidHeartbeatActiveHours(cfg, changes) {
	const repairHeartbeat = (heartbeat, path) => {
		if (!isRecord(heartbeat) || !Object.hasOwn(heartbeat, "activeHours")) return heartbeat;
		if (HeartbeatSchema.safeParse({ activeHours: heartbeat.activeHours }).success) return heartbeat;
		const { activeHours: _activeHours, ...rest } = heartbeat;
		changes.push(`Removed invalid ${path}.activeHours; heartbeats will use unrestricted hours until it is reconfigured.`);
		return rest;
	};
	const defaultsHeartbeat = repairHeartbeat(cfg.agents?.defaults?.heartbeat, "agents.defaults.heartbeat");
	const next = repairAgentRoster(cfg, (agent, path) => {
		const heartbeat = repairHeartbeat(agent.heartbeat, `${path}.heartbeat`);
		return heartbeat === agent.heartbeat ? agent : {
			...agent,
			heartbeat
		};
	});
	if (defaultsHeartbeat === cfg.agents?.defaults?.heartbeat) return next;
	return {
		...next,
		agents: {
			...next.agents,
			defaults: {
				...next.agents?.defaults,
				heartbeat: defaultsHeartbeat
			}
		}
	};
}
function repairNullAgentWorkspaces(cfg, changes) {
	let repaired = 0;
	const next = repairAgentRoster(cfg, (agent) => {
		if (agent.workspace === null) {
			repaired += 1;
			const { workspace: _workspace, ...rest } = agent;
			return rest;
		}
		return agent;
	});
	if (repaired === 0) return cfg;
	changes.push(`Removed null workspace value${repaired === 1 ? "" : "s"} from agents.${readAgentRosterProperty(cfg)?.kind} entr${repaired === 1 ? "y" : "ies"}.`);
	return next;
}
/** Normalize pre-admission config through core, plugin setup, channel, and secret-ref migrations. */
function normalizeCompatibilityConfigValues(raw, options = {}) {
	if (!isRecord(raw)) throw new TypeError("Compatibility config normalization requires an object");
	const changes = [];
	const warnings = [];
	const reservedMcpServerNames = migrateReservedMcpServerNames(raw, options.sourceRaw);
	changes.push(...reservedMcpServerNames.changes);
	let next = normalizeBaseCompatibilityConfigValues(reservedMcpServerNames.config, changes, (config) => {
		const setupMigration = runPluginSetupConfigMigrations({ config });
		warnings.push(...setupMigration.warnings ?? []);
		changes.push(...setupMigration.changes);
		return setupMigration.config;
	}, options.blockedModelIdentities);
	const tuningCandidate = structuredClone(next);
	if (stripRetiredTuningKnobs(tuningCandidate, changes)) next = tuningCandidate;
	const channelMigrations = applyChannelDoctorCompatibilityMigrations(next, { historicalWebhookListeners: true });
	warnings.push(...channelMigrations.warnings ?? []);
	if (channelMigrations.changes.length > 0) {
		next = channelMigrations.next;
		changes.push(...channelMigrations.changes);
	}
	const secretRefMarkers = migrateLegacySecretInputs(next);
	if (secretRefMarkers.changes.length > 0) {
		next = secretRefMarkers.config;
		changes.push(...secretRefMarkers.changes);
	}
	next = normalizeLegacyOpenAICodexModelsAddMetadata(next, changes);
	next = repairInvalidHeartbeatActiveHours(next, changes);
	next = repairNullAgentWorkspaces(next, changes);
	next = migrateLegacyCommandOwners(next, changes);
	next = pruneBindingsForMissingAgents(next, changes);
	return {
		config: next,
		changes,
		...warnings.length ? { warnings } : {}
	};
}
//#endregion
export { normalizeCompatibilityConfigValues as t };
