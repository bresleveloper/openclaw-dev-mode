import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { q as applyChannelDoctorCompatibilityMigrations } from "./io.snapshot-CjLQRoaj.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { k as readAgentRosterProperty } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-B1bfbA5J.mjs";
import { f as parseLegacySecretRefEnvMarker, s as isLegacySecretRefEnvMarker } from "./types.secrets-B5xWSzLp.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-CHC0CCKR.mjs";
import "./plugin-registry-CVPVm6lt.mjs";
import { c as selectedCanonicalModelRefsForRuntimePolicy, d as hasOwnKey, i as mergeModelRefMapEntries, o as rewriteModelRefs, r as isLegacyModelsAddCodexMetadataModel, s as modelEntryWithRuntimePolicy } from "./legacy-config-migrations.runtime.models-BvDaSkAf.mjs";
import { d as stripRetiredTuningKnobs, f as migrateLegacyWebFetchConfig, g as resolveLegacyCliRuntimeAlias, h as migrateLegacyRuntimeModelRef, m as migrateLegacyXSearchConfig, p as migrateLegacyWebSearchConfig } from "./legacy-2ovrASa7.mjs";
import { a as isBlockedLegacyCodexModelRef } from "./codex-route-model-ref-CXtvdgWA.mjs";
import { g as resolveNormalizedProviderModelMaxTokens } from "./validation-core-DwJVlxTe.mjs";
import { d as removeLegacyCopilotDiscovery, f as migrateLegacyContextBudgetConfig } from "./io.snapshot-preparation-E0KwwdW2.mjs";
import { r as normalizeTalkSection } from "./talk-CaH8Mknv.mjs";
import { a as HeartbeatSchema } from "./zod-schema.agent-runtime-A2vJPWeP.mjs";
import { n as discoverConfigSecretTargets } from "./target-registry-query-DciTXKJy.mjs";
import { i as setPathExistingStrict } from "./path-utils-C3EgzLrx.mjs";
import "./target-registry-BD3AtdiE.mjs";
import { a as runPluginSetupConfigMigrations } from "./setup-registry-D5VN3YGP.mjs";
import { t as DEFAULT_GOOGLE_API_BASE_URL } from "./google-api-base-url-UBNiBOzj.mjs";
import { i as migrateLegacyCommandOwners } from "./doctor-command-owner-C0KlUKKP.mjs";
import { r as loadSetupChannelPluginFromManifestRecord } from "./read-only-Bmu738r7.mjs";
import { t as pruneBindingsForMissingAgents } from "./legacy-config-binding-repair-wPtjwfXK.mjs";
import { t as resolveSingleAccountPromotion } from "./setup-promotion-helpers-BAzaCs_d.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/secrets/legacy-secretref-env-marker.ts
function toCandidate(target, defaults) {
	if (!isLegacySecretRefEnvMarker(target.value)) return null;
	return {
		path: target.path,
		pathSegments: target.pathSegments,
		value: target.value.trim(),
		ref: parseLegacySecretRefEnvMarker(target.value, defaults?.env)
	};
}
/**
* Finds legacy env marker strings on registered secret targets without mutating config.
*/
function collectLegacySecretRefEnvMarkerCandidates(config) {
	const defaults = config.secrets?.defaults;
	return discoverConfigSecretTargets(config).map((target) => toCandidate(target, defaults)).filter((candidate) => candidate !== null);
}
/**
* Converts parseable legacy env marker strings into structured env SecretRef objects.
*/
function migrateLegacySecretRefEnvMarkers(config) {
	const candidates = collectLegacySecretRefEnvMarkerCandidates(config).filter((candidate) => candidate.ref !== null);
	if (candidates.length === 0) return {
		config,
		changes: []
	};
	const next = structuredClone(config);
	const changes = [];
	for (const candidate of candidates) {
		const ref = candidate.ref;
		if (!ref) continue;
		if (setPathExistingStrict(next, candidate.pathSegments, ref)) changes.push(`Moved ${candidate.path} ${candidate.value} marker → structured env SecretRef.`);
	}
	return {
		config: next,
		changes
	};
}
//#endregion
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
//#region src/commands/doctor/shared/legacy-talk-config-normalizer.ts
function buildLegacyRealtimeTalkCompat(talk, normalizedTalk) {
	if (talk.realtime !== void 0) return;
	const compat = {};
	for (const key of [
		"model",
		"mode",
		"transport",
		"brain"
	]) if (talk[key] !== void 0) compat[key] = talk[key];
	if (talk.voice !== void 0) compat.speakerVoice = talk.voice;
	if (Object.keys(compat).length === 0) return;
	if (normalizedTalk.provider !== void 0) compat.provider = normalizedTalk.provider;
	if (normalizedTalk.providers !== void 0) compat.providers = normalizedTalk.providers;
	return normalizeTalkSection({ realtime: compat })?.realtime;
}
/** Normalize Talk provider shape and move only core-owned legacy realtime fields. */
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
	const legacyRealtimeCompat = buildLegacyRealtimeTalkCompat(rawTalk, normalizedTalk);
	if (legacyRealtimeCompat) normalizedTalk.realtime = legacyRealtimeCompat;
	if (Object.keys(normalizedTalk).length === 0 || isDeepStrictEqual(normalizedTalk, rawTalk)) return cfg;
	changes.push("Normalized talk.provider/providers shape (trimmed provider ids and merged missing compatibility fields).");
	if (legacyRealtimeCompat) changes.push("Moved legacy realtime Talk provider/model fields into talk.realtime.");
	return {
		...cfg,
		talk: normalizedTalk
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-core-normalizers.ts
const INHERITED_ACCOUNT_POLICY_KEYS = [
	"dmPolicy",
	"allowFrom",
	"groupPolicy",
	"groupAllowFrom"
];
const log = createSubsystemLogger("doctor");
/** Migrate legacy browser/Chrome relay config to current browser profile settings. */
function normalizeLegacyBrowserConfig(cfg, changes) {
	const rawBrowser = cfg.browser;
	if (!isRecord(rawBrowser)) return cfg;
	const browser = structuredClone(rawBrowser);
	let browserChanged = false;
	if ("relayBindHost" in browser) {
		delete browser.relayBindHost;
		browserChanged = true;
		changes.push("Removed browser.relayBindHost (legacy Chrome extension relay setting; the extension relay binds loopback on the profile cdpPort).");
	}
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
	const rawSsrFPolicy = browser.ssrfPolicy;
	if (isRecord(rawSsrFPolicy) && "allowPrivateNetwork" in rawSsrFPolicy) {
		const legacyAllowPrivateNetwork = rawSsrFPolicy.allowPrivateNetwork;
		const currentDangerousAllowPrivateNetwork = rawSsrFPolicy.dangerouslyAllowPrivateNetwork;
		let resolvedDangerousAllowPrivateNetwork = currentDangerousAllowPrivateNetwork;
		if (typeof legacyAllowPrivateNetwork === "boolean" || typeof currentDangerousAllowPrivateNetwork === "boolean") resolvedDangerousAllowPrivateNetwork = legacyAllowPrivateNetwork === true || currentDangerousAllowPrivateNetwork === true;
		else if (currentDangerousAllowPrivateNetwork === void 0) resolvedDangerousAllowPrivateNetwork = legacyAllowPrivateNetwork;
		const nextSsrFPolicy = { ...rawSsrFPolicy };
		delete nextSsrFPolicy.allowPrivateNetwork;
		if (resolvedDangerousAllowPrivateNetwork !== void 0) nextSsrFPolicy.dangerouslyAllowPrivateNetwork = resolvedDangerousAllowPrivateNetwork;
		browser.ssrfPolicy = nextSsrFPolicy;
		browserChanged = true;
		changes.push(`Moved browser.ssrfPolicy.allowPrivateNetwork → browser.ssrfPolicy.dangerouslyAllowPrivateNetwork (${String(resolvedDangerousAllowPrivateNetwork)}).`);
	}
	if (!browserChanged) return cfg;
	return {
		...cfg,
		browser
	};
}
/** Move single-account channel fields into accounts.default when account maps exist. */
function seedMissingDefaultAccountsFromSingleAccountBase(cfg, changes) {
	const channels = cfg.channels;
	if (!channels) return cfg;
	let channelsChanged = false;
	const nextChannels = { ...channels };
	for (const [channelId, rawChannel] of Object.entries(channels)) {
		if (!isRecord(rawChannel)) continue;
		const rawAccounts = rawChannel.accounts;
		if (!isRecord(rawAccounts)) continue;
		const accountKeys = Object.keys(rawAccounts);
		if (accountKeys.length === 0) continue;
		if (accountKeys.some((key) => normalizeOptionalLowercaseString(key) === "default")) continue;
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
		const inheritedPolicyKeys = INHERITED_ACCOUNT_POLICY_KEYS.filter((key) => keysToMove.includes(key));
		const nextAccounts = {
			...rawAccounts,
			[DEFAULT_ACCOUNT_ID]: defaultAccount
		};
		if (inheritedPolicyKeys.length > 0) for (const [accountId, rawAccount] of Object.entries(rawAccounts)) {
			if (!isRecord(rawAccount)) continue;
			const nextAccount = { ...rawAccount };
			let accountChanged = false;
			for (const key of inheritedPolicyKeys) {
				if (hasOwnKey(nextAccount, key)) continue;
				const value = rawChannel[key];
				nextAccount[key] = value && typeof value === "object" ? structuredClone(value) : value;
				accountChanged = true;
			}
			if (accountChanged) nextAccounts[accountId] = nextAccount;
		}
		nextChannel.accounts = nextAccounts;
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
	if (typeof raw === "string") {
		const migrated = migrateUnblockedLegacyRuntimeModelRef(raw, blockedModelIdentities);
		return migrated ? {
			value: migrated.ref,
			changed: true,
			selectedRuntime: migrated.runtime,
			selectedRefs: [{
				ref: migrated.ref,
				runtime: migrated.runtime
			}]
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
	const migratedPrimary = typeof raw.primary === "string" ? migrateUnblockedLegacyRuntimeModelRef(raw.primary, blockedModelIdentities) : null;
	let changed = false;
	const next = { ...raw };
	const selectedRefs = [];
	let selectedRuntime = migratedPrimary?.runtime;
	if (migratedPrimary) {
		next.primary = migratedPrimary.ref;
		selectedRefs.push({
			ref: migratedPrimary.ref,
			runtime: migratedPrimary.runtime
		});
		changed = true;
	}
	if (Array.isArray(raw.fallbacks)) next.fallbacks = raw.fallbacks.map((fallback) => {
		if (typeof fallback !== "string") return fallback;
		const migratedFallback = migrateUnblockedLegacyRuntimeModelRef(fallback, blockedModelIdentities);
		if (migratedFallback) {
			selectedRuntime ??= migratedFallback.runtime;
			selectedRefs.push({
				ref: migratedFallback.ref,
				runtime: migratedFallback.runtime
			});
			changed = true;
			return migratedFallback.ref;
		}
		return fallback;
	});
	if (!changed) return {
		value: raw,
		changed: false,
		selectedRefs: []
	};
	return {
		value: next,
		changed: true,
		selectedRuntime,
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
	const legacyWholeAgentRuntime = resolveLegacyCliRuntimeAlias(isRecord(raw.agentRuntime) ? raw.agentRuntime.id : void 0);
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
	if (legacyWholeAgentRuntime) {
		const selectedRefs = selectedCanonicalModelRefsForRuntimePolicy(next.model ?? raw.model, legacyWholeAgentRuntime.provider).map((ref) => ({
			ref,
			runtime: legacyWholeAgentRuntime.runtime
		}));
		const modelRuntimes = ensureSelectedModelRuntimePolicies(next.models, selectedRefs);
		if (modelRuntimes.changed) {
			next.models = modelRuntimes.value;
			changed = true;
			changes.push(`Moved ${path}.agentRuntime.id ${legacyWholeAgentRuntime.runtime} to matching ${legacyWholeAgentRuntime.provider} model runtime policy.`);
		}
	}
	if (model.selectedRuntime && isRecord(raw.agentRuntime)) {
		delete next.agentRuntime;
		changed = true;
		changes.push(`Removed ${path}.agentRuntime; runtime is now model scoped.`);
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
	const rawModels = cfg.models;
	if (!isRecord(rawModels) || !isRecord(rawModels.providers)) return {
		config: cfg,
		changed: false
	};
	let changed = false;
	const nextProviders = { ...rawModels.providers };
	for (const [providerId, rawProvider] of Object.entries(rawModels.providers)) {
		if (!isRecord(rawProvider)) continue;
		let providerChanged = false;
		const nextProvider = { ...rawProvider };
		const providerRuntime = normalizeLegacyCodexCliAgentRuntimePolicy(rawProvider.agentRuntime);
		if (providerRuntime.changed) {
			nextProvider.agentRuntime = providerRuntime.value;
			providerChanged = true;
			changes.push(`Moved models.providers.${sanitizeForLog(providerId)} agentRuntime.id from codex-cli to codex.`);
		}
		if (Array.isArray(rawProvider.models)) {
			const nextProviderModels = rawProvider.models.map((entry, index) => {
				if (!isRecord(entry)) return entry;
				const runtime = normalizeLegacyCodexCliAgentRuntimePolicy(entry.agentRuntime);
				if (!runtime.changed) return entry;
				providerChanged = true;
				const modelId = normalizeOptionalString(entry.id) ?? `[${index}]`;
				changes.push(`Moved models.providers.${sanitizeForLog(providerId)}.models.${sanitizeForLog(modelId)} agentRuntime.id from codex-cli to codex.`);
				return Object.assign({}, entry, { agentRuntime: runtime.value });
			});
			if (providerChanged) nextProvider.models = nextProviderModels;
		}
		if (providerChanged) {
			nextProviders[providerId] = nextProvider;
			changed = true;
		}
	}
	return changed ? {
		config: {
			...cfg,
			models: {
				...rawModels,
				providers: nextProviders
			}
		},
		changed: true
	} : {
		config: cfg,
		changed: false
	};
}
/** Move legacy runtime-tagged model/provider refs onto current agentRuntime policy fields. */
function normalizeLegacyRuntimeModelRefs(cfg, changes, blockedModelIdentities) {
	const cfgWithProviders = normalizeLegacyCodexCliProviderRuntimePins(cfg, changes).config;
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
	const rawModels = cfg.models;
	if (!isRecord(rawModels) || !isRecord(rawModels.providers)) return cfg;
	const rawProviders = rawModels.providers;
	let providersChanged = false;
	const nextProviders = { ...rawProviders };
	for (const [providerId, rawProvider] of Object.entries(rawProviders)) {
		if (normalizeProviderId(providerId) !== "openai-codex" || !isRecord(rawProvider)) continue;
		const rawProviderModels = rawProvider.models;
		if (!Array.isArray(rawProviderModels)) continue;
		let providerChanged = false;
		const nextModels = [];
		for (const model of rawProviderModels) if (isRecord(model) && !("metadataSource" in model) && isLegacyModelsAddCodexMetadataModel({
			provider: providerId,
			model
		})) {
			providerChanged = true;
			const safeProviderId = sanitizeForLog(providerId);
			const safeModelId = sanitizeForLog(normalizeOptionalString(model.id) ?? "unknown");
			changes.push(`Marked models.providers.${safeProviderId}.models.${safeModelId} as /models add metadata so official OpenAI Codex metadata can override it.`);
			nextModels.push(Object.assign({}, model, { metadataSource: "models-add" }));
		} else nextModels.push(model);
		if (!providerChanged) continue;
		nextProviders[providerId] = {
			...rawProvider,
			models: nextModels
		};
		providersChanged = true;
	}
	if (!providersChanged) return cfg;
	return {
		...cfg,
		models: {
			...rawModels,
			providers: nextProviders
		}
	};
}
/** Rename legacy OpenAI API identifiers to the current completion/chat API ids. */
function normalizeLegacyOpenAIModelProviderApi(cfg, changes) {
	const rawModels = cfg.models;
	if (!isRecord(rawModels) || !isRecord(rawModels.providers)) return cfg;
	const rawProviders = rawModels.providers;
	let providersChanged = false;
	const nextProviders = { ...rawProviders };
	for (const [providerId, rawProvider] of Object.entries(rawProviders)) {
		if (!isRecord(rawProvider)) continue;
		let providerChanged = false;
		const nextProvider = { ...rawProvider };
		if (nextProvider.api === "openai") {
			nextProvider.api = "openai-completions";
			providerChanged = true;
			changes.push(`Moved models.providers.${sanitizeForLog(providerId)}.api "openai" → "openai-completions".`);
		}
		const rawProviderModels = rawProvider.models;
		if (Array.isArray(rawProviderModels)) {
			let modelsChanged = false;
			const nextModels = [];
			rawProviderModels.forEach((model, index) => {
				if (!isRecord(model) || model.api !== "openai") {
					nextModels.push(model);
					return;
				}
				modelsChanged = true;
				changes.push(`Moved models.providers.${sanitizeForLog(providerId)}.models[${index}].api "openai" → "openai-completions".`);
				nextModels.push({
					...model,
					api: "openai-completions"
				});
			});
			if (modelsChanged) {
				nextProvider.models = nextModels;
				providerChanged = true;
			}
		}
		if (!providerChanged) continue;
		nextProviders[providerId] = nextProvider;
		providersChanged = true;
	}
	if (!providersChanged) return cfg;
	return {
		...cfg,
		models: {
			...rawModels,
			providers: nextProviders
		}
	};
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
	if (!isRecord(rawEntries)) {
		if (!skillsChanged) return cfg;
		return {
			...cfg,
			skills
		};
	}
	const rawLegacyEntry = rawEntries[NANO_BANANA_SKILL_KEY];
	if (!isRecord(rawLegacyEntry)) {
		if (!skillsChanged) return cfg;
		return {
			...cfg,
			skills
		};
	}
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
	skillsChanged = true;
	if (Object.keys(skills).length === 0) {
		const { skills: _ignored, ...rest } = next;
		return rest;
	}
	if (!skillsChanged) return next;
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
function resolveConfiguredOllamaProviderNumCtxBudget(provider) {
	return normalizeConfiguredPositiveInteger(provider.contextWindow) ?? normalizeConfiguredPositiveInteger(provider.maxTokens);
}
function isNativeOllamaProviderConfig(provider) {
	return normalizeOptionalLowercaseString(provider.api) === "ollama";
}
function isNativeOllamaModelConfig(provider, model) {
	return (normalizeOptionalLowercaseString(model.api) || normalizeOptionalLowercaseString(provider.api)) === "ollama";
}
function hasConfiguredOllamaProviderNumCtx(provider) {
	const rawParams = provider.params;
	return isRecord(rawParams) && hasOwnKey(rawParams, "num_ctx");
}
function applyLegacyOllamaProviderNumCtxParams(params) {
	if (!isNativeOllamaProviderConfig(params.provider)) return {
		provider: params.provider,
		changed: false
	};
	const rawParams = params.provider.params;
	if (rawParams !== void 0 && !isRecord(rawParams)) return {
		provider: params.provider,
		changed: false
	};
	if (rawParams && hasOwnKey(rawParams, "num_ctx")) return {
		provider: params.provider,
		changed: false
	};
	const numCtx = resolveConfiguredOllamaProviderNumCtxBudget(params.provider);
	if (numCtx === void 0) return {
		provider: params.provider,
		changed: false
	};
	params.changes.push(`Set models.providers.${sanitizeForLog(params.providerId)}.params.num_ctx to ${numCtx} for native Ollama compatibility.`);
	return {
		provider: {
			...params.provider,
			params: rawParams ? {
				...rawParams,
				num_ctx: numCtx
			} : { num_ctx: numCtx }
		},
		changed: true
	};
}
/** Seed native Ollama num_ctx params from legacy context-token budgets. */
function normalizeLegacyOllamaNativeNumCtxParams(cfg, changes) {
	const rawProviders = cfg.models?.providers;
	if (!isRecord(rawProviders)) return cfg;
	let providersChanged = false;
	const nextProviders = { ...rawProviders };
	for (const [providerId, rawProvider] of Object.entries(rawProviders)) {
		if (!isRecord(rawProvider)) continue;
		const rawModels = rawProvider.models;
		if (!Array.isArray(rawModels)) continue;
		const providerParams = rawModels.some((model) => isRecord(model) && normalizeConfiguredPositiveInteger(model.contextTokens) !== void 0) ? {
			provider: rawProvider,
			changed: false
		} : applyLegacyOllamaProviderNumCtxParams({
			providerId,
			provider: rawProvider,
			changes
		});
		const providerNumCtxApplies = isNativeOllamaProviderConfig(providerParams.provider) && hasConfiguredOllamaProviderNumCtx(providerParams.provider);
		if (rawModels.length === 0) {
			if (!providerParams.changed) continue;
			nextProviders[providerId] = providerParams.provider;
			providersChanged = true;
			continue;
		}
		let modelsChanged = false;
		const nextModels = rawModels.map((model, index) => {
			if (!isRecord(model)) return model;
			if (!isNativeOllamaModelConfig(providerParams.provider, model)) return model;
			const rawParams = model.params;
			if (rawParams !== void 0 && !isRecord(rawParams)) return model;
			if (rawParams && hasOwnKey(rawParams, "num_ctx")) return model;
			const numCtx = resolveConfiguredOllamaModelNumCtxBudget({
				model,
				provider: providerParams.provider,
				providerNumCtxApplies
			});
			if (numCtx === void 0) return model;
			modelsChanged = true;
			changes.push(`Set models.providers.${sanitizeForLog(providerId)}.models[${index}].params.num_ctx to ${numCtx} for native Ollama compatibility.`);
			return Object.assign({}, model, { params: rawParams ? {
				...rawParams,
				num_ctx: numCtx
			} : { num_ctx: numCtx } });
		});
		if (!modelsChanged && !providerParams.changed) continue;
		nextProviders[providerId] = {
			...providerParams.provider,
			models: nextModels
		};
		providersChanged = true;
	}
	if (!providersChanged) return cfg;
	return {
		...cfg,
		models: {
			...cfg.models,
			providers: nextProviders
		}
	};
}
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
	if (!isRecord(cost) || cost.cacheRead !== 0) return {
		model: params.model,
		changed: false
	};
	const normalizedCacheRead = MISTRAL_MODEL_CACHE_READ_COST_BY_ID[params.modelId.toLowerCase()];
	if (normalizedCacheRead === void 0) return {
		model: params.model,
		changed: false
	};
	params.changes.push(`Normalized models.providers.${sanitizeForLog(params.providerId)}.models[${params.index}].cost.cacheRead (0 → ${normalizedCacheRead}) for Mistral prompt-cache billing.`);
	return {
		model: {
			...params.model,
			cost: {
				...cost,
				cacheRead: normalizedCacheRead
			}
		},
		changed: true
	};
}
/** Normalize stale Mistral model defaults such as prompt-cache read cost. */
function normalizeLegacyMistralModelDefaults(cfg, changes) {
	const rawProviders = cfg.models?.providers;
	if (!isRecord(rawProviders)) return cfg;
	let providersChanged = false;
	const nextProviders = { ...rawProviders };
	for (const [providerId, rawProvider] of Object.entries(rawProviders)) {
		if (normalizeProviderId(providerId) !== "mistral" || !isRecord(rawProvider)) continue;
		const rawModels = rawProvider.models;
		if (!Array.isArray(rawModels)) continue;
		let modelsChanged = false;
		const nextModels = rawModels.map((model, index) => {
			if (!isRecord(model)) return model;
			const modelId = normalizeOptionalString(model.id) ?? "";
			if (!modelId) return model;
			let nextModel = model;
			let modelChanged = false;
			const contextWindow = typeof model.contextWindow === "number" && Number.isFinite(model.contextWindow) ? model.contextWindow : null;
			const maxTokens = typeof model.maxTokens === "number" && Number.isFinite(model.maxTokens) ? model.maxTokens : null;
			if (contextWindow !== null && maxTokens !== null) {
				const normalizedMaxTokens = resolveNormalizedProviderModelMaxTokens({
					providerId,
					modelId,
					contextWindow,
					rawMaxTokens: maxTokens
				});
				if (normalizedMaxTokens !== maxTokens) {
					nextModel = Object.assign({}, nextModel, { maxTokens: normalizedMaxTokens });
					modelChanged = true;
					changes.push(`Normalized models.providers.${providerId}.models[${index}].maxTokens (${maxTokens} → ${normalizedMaxTokens}) to avoid Mistral context-window rejects.`);
				}
			}
			const costNormalization = normalizeLegacyMistralModelCost({
				providerId,
				model: nextModel,
				modelId,
				index,
				changes
			});
			if (costNormalization.changed) {
				nextModel = costNormalization.model;
				modelChanged = true;
			}
			if (modelChanged) modelsChanged = true;
			return modelChanged ? nextModel : model;
		});
		if (!modelsChanged) continue;
		nextProviders[providerId] = {
			...rawProvider,
			models: nextModels
		};
		providersChanged = true;
	}
	if (!providersChanged) return cfg;
	return {
		...cfg,
		models: {
			...cfg.models,
			providers: nextProviders
		}
	};
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
/** Normalize current config through core, plugin setup, channel, and secret-ref migrations. */
function normalizeCompatibilityConfigValues(cfg, options = {}) {
	const changes = [];
	const copilotConfig = removeLegacyCopilotDiscovery(cfg);
	if (copilotConfig !== cfg) changes.push("The GitHub Copilot discovery switch was retired and has been removed. Configured Copilot access now refreshes its model list automatically. Use the model allow list (agents.defaults.modelPolicy.allow) to hide Copilot models; it does not stop discovery requests.");
	let contextBudgetConfig = copilotConfig;
	let contextBudgetWarnings;
	if (options.sourceConfigBeforeMigrations === void 0) {
		const migration = migrateLegacyContextBudgetConfig(copilotConfig);
		contextBudgetConfig = migration.config;
		changes.push(...migration.changes.map(({ message }) => message));
		contextBudgetWarnings = migration.warnings.map(({ message }) => message);
	} else {
		const migration = migrateLegacyContextBudgetConfig(options.sourceConfigBeforeMigrations);
		changes.push(...migration.changes.map(({ message }) => message));
		contextBudgetWarnings = migration.warnings.map(({ message }) => message);
	}
	const reservedMcpServerNames = migrateReservedMcpServerNames(contextBudgetConfig, options.sourceRaw);
	changes.push(...reservedMcpServerNames.changes);
	let next = normalizeBaseCompatibilityConfigValues(reservedMcpServerNames.config, changes, (config) => {
		const setupMigration = runPluginSetupConfigMigrations({ config });
		if (setupMigration.changes.length === 0) return config;
		changes.push(...setupMigration.changes);
		return setupMigration.config;
	}, options.blockedModelIdentities);
	const tuningCandidate = structuredClone(next);
	if (stripRetiredTuningKnobs(tuningCandidate, changes)) next = tuningCandidate;
	const channelMigrations = applyChannelDoctorCompatibilityMigrations(next);
	contextBudgetWarnings.push(...channelMigrations.warnings ?? []);
	if (channelMigrations.changes.length > 0) {
		next = channelMigrations.next;
		changes.push(...channelMigrations.changes);
	}
	const secretRefMarkers = migrateLegacySecretRefEnvMarkers(next);
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
		...contextBudgetWarnings.length > 0 ? { warnings: contextBudgetWarnings } : {}
	};
}
//#endregion
export { normalizeCompatibilityConfigValues as t };
