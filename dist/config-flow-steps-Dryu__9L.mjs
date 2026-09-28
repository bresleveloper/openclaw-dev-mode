import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { K as applyLegacyDoctorMigrations } from "./io.snapshot-BXLTgjrd.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as containsAuthoredInclude, t as classifyOtelGrpcMigrationOwnership } from "./include-migration-ownership-D1fnTYxB.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-ngXQhRsV.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { n as getDeferredPluginMigrationConfigFacts, o as setDeferredPluginMigrationConfigFacts } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import { t as coerceConfig } from "./io.read-helpers-N26RjV2V.mjs";
import { n as formatConfigIssueLines } from "./issue-format-BQNShMey.mjs";
import { o as restoreEnvVarRefsFromResolved } from "./io.types-zuIBxyy5.mjs";
import { r as projectAuthoredAgentRosterForWrite } from "./io.write-prepare-xbITFBQs.mjs";
import { n as createMergePatch } from "./merge-patch-C1--BlNd.mjs";
import { o as migratePluginConfigId } from "./update-config-WKWUUa1W.mjs";
import { d as stripUnknownConfigKeys } from "./doctor-config-analysis-Dal_uH5w.mjs";
import { t as migrateLegacyConfig } from "./legacy-config-migrate-Be0wKMeN.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor-auth-profile-config.ts
/** Protects active auth profile metadata while doctor repairs broader config state. */
const AUTH_PROFILE_MODES = /* @__PURE__ */ new Set([
	"api_key",
	"aws-sdk",
	"oauth",
	"token"
]);
function normalizeProviderId(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
function normalizeProfileId(value) {
	return normalizeOptionalString(value) ?? null;
}
function normalizeMode(value) {
	return typeof value === "string" && AUTH_PROFILE_MODES.has(value) ? value : null;
}
function extractProviderFromModelRef(value) {
	const { model } = splitTrailingAuthProfile(value);
	const slash = model.indexOf("/");
	if (slash <= 0) return null;
	return normalizeProviderId(model.slice(0, slash)) || null;
}
function extractProviderFromProfileId(profileId) {
	const colon = profileId.indexOf(":");
	if (colon <= 0) return null;
	return normalizeProviderId(profileId.slice(0, colon)) || null;
}
function collectActiveAuthHints(config) {
	const activeProviders = /* @__PURE__ */ new Set();
	const explicitProfileIds = /* @__PURE__ */ new Set();
	const explicitProfileProviders = /* @__PURE__ */ new Map();
	const models = isRecord(config.models) ? config.models : {};
	const providers = isRecord(models.providers) ? models.providers : {};
	for (const providerId of Object.keys(providers)) {
		const normalized = normalizeProviderId(providerId);
		if (normalized) activeProviders.add(normalized);
	}
	for (const { value } of collectConfiguredModelRefs(config)) {
		const { profile } = splitTrailingAuthProfile(value);
		const provider = extractProviderFromModelRef(value);
		if (profile) {
			explicitProfileIds.add(profile);
			if (provider) {
				const providersLocal = explicitProfileProviders.get(profile) ?? /* @__PURE__ */ new Set();
				providersLocal.add(provider);
				explicitProfileProviders.set(profile, providersLocal);
			}
		}
		if (provider) activeProviders.add(provider);
	}
	const auth = isRecord(config.auth) ? config.auth : {};
	const order = isRecord(auth.order) ? auth.order : {};
	for (const [providerId, profileIds] of Object.entries(order)) {
		const provider = normalizeProviderId(providerId);
		if (!provider || !activeProviders.has(provider) || !Array.isArray(profileIds)) continue;
		for (const profileId of profileIds) {
			const normalized = normalizeProfileId(profileId);
			if (normalized) explicitProfileIds.add(normalized);
		}
	}
	return {
		activeProviders,
		explicitProfileIds,
		explicitProfileProviders
	};
}
function isValidProfileMetadata(value) {
	if (!isRecord(value)) return false;
	return normalizeProviderId(value.provider) !== "" && normalizeMode(value.mode) !== null;
}
function buildProfileMetadata(params) {
	const before = isRecord(params.before) ? params.before : {};
	const after = isRecord(params.after) ? params.after : {};
	const provider = normalizeProviderId(after.provider) || normalizeProviderId(before.provider) || extractProviderFromProfileId(params.profileId) || normalizeProviderId(params.providerHint);
	if (!provider) return null;
	const repaired = {
		provider,
		mode: normalizeMode(after.mode) ?? normalizeMode(before.mode) ?? "api_key"
	};
	const email = normalizeOptionalString(after.email) ?? normalizeOptionalString(before.email);
	const displayName = normalizeOptionalString(after.displayName) ?? normalizeOptionalString(before.displayName);
	if (email) repaired.email = email;
	if (displayName) repaired.displayName = displayName;
	return repaired;
}
function ensureAuthProfiles(config) {
	const root = config;
	const auth = isRecord(root.auth) ? root.auth : {};
	if (root.auth !== auth) root.auth = auth;
	if (!isRecord(auth.profiles)) auth.profiles = {};
	return auth.profiles;
}
/**
* Restores valid metadata for auth profiles still referenced by active model config.
*
* Doctor can rebuild or prune auth config; this guard keeps active profiles usable when their
* provider/mode metadata can be inferred from the before/after config or profile id.
*/
function protectActiveAuthProfileConfig(params) {
	const { activeProviders, explicitProfileIds, explicitProfileProviders } = collectActiveAuthHints(params.before);
	const beforeAuth = isRecord(params.before.auth) ? params.before.auth : {};
	const beforeProfiles = isRecord(beforeAuth.profiles) ? beforeAuth.profiles : {};
	if (Object.keys(beforeProfiles).length === 0) return {
		config: params.after,
		repairs: [],
		warnings: []
	};
	const config = structuredClone(params.after);
	const afterAuth = isRecord(config.auth) ? config.auth : {};
	const afterProfiles = isRecord(afterAuth.profiles) ? afterAuth.profiles : {};
	const repairs = [];
	const warnings = [];
	for (const [profileId, beforeProfile] of Object.entries(beforeProfiles)) {
		const afterProfile = afterProfiles[profileId];
		const afterProfileRecord = isRecord(afterProfile) ? afterProfile : null;
		const beforeProfileRecord = isRecord(beforeProfile) ? beforeProfile : null;
		if (isValidProfileMetadata(afterProfile)) continue;
		const provider = normalizeProviderId(afterProfileRecord?.provider) || normalizeProviderId(beforeProfileRecord?.provider) || extractProviderFromProfileId(profileId);
		const protectsActiveProvider = provider !== null && activeProviders.has(provider);
		const protectsExplicitProfile = explicitProfileIds.has(profileId);
		if (!protectsActiveProvider && !protectsExplicitProfile) continue;
		const repaired = buildProfileMetadata({
			profileId,
			before: beforeProfile,
			after: afterProfile,
			providerHint: explicitProfileProviders.get(profileId)?.size === 1 ? [...explicitProfileProviders.get(profileId) ?? []][0] : void 0
		});
		if (!repaired) {
			warnings.push(`auth.profiles.${profileId}: active auth profile metadata could not be inferred; repair manually before running doctor --fix.`);
			continue;
		}
		const profiles = ensureAuthProfiles(config);
		profiles[profileId] = repaired;
		repairs.push(`Repaired auth.profiles.${profileId} metadata for active ${repaired.provider} auth.`);
	}
	return {
		config,
		repairs,
		warnings
	};
}
//#endregion
//#region src/commands/doctor/shared/config-flow-steps.ts
/** Apply legacy config migrations and update preview/fix state for doctor config flow. */
function applyLegacyCompatibilityStep(params) {
	if (params.snapshot.legacyIssues.length === 0) return {
		state: params.state,
		issueLines: [],
		changeLines: []
	};
	const issueLines = formatConfigIssueLines(params.snapshot.legacyIssues, "-");
	const otelOwnership = classifyOtelGrpcMigrationOwnership({
		snapshot: params.snapshot,
		authoredConfig: params.snapshot.parsed,
		resolvedConfig: params.snapshot.sourceConfig
	});
	if (otelOwnership) {
		const ownership = otelOwnership;
		if (ownership.kind === "manual") {
			const otelPath = "diagnostics.otel.protocol";
			const targets = ownership.targetPaths.length > 0 ? ` Inspect these candidate source files and remove or replace ${otelPath} = "grpc" from every definition: ${ownership.targetPaths.join(", ")}.` : ` Remove or replace ${otelPath} = "grpc" in the owning $include directive or included file.`;
			return {
				state: params.state,
				issueLines: [...issueLines, `- ${otelPath}: Doctor cannot safely rewrite this $include ownership.${targets} No config files were changed.`],
				changeLines: [],
				blocksWrite: true
			};
		}
	}
	const hasAuthoredIncludes = containsAuthoredInclude(params.snapshot.parsed);
	const { config: migrated, sourceConfig: migratedSource, changes, warnings, partiallyValid } = migrateLegacyConfig(params.snapshot.sourceConfig, {
		sourceConfigBeforeMigrations: params.snapshot.sourceConfigBeforeMigrations,
		context: {
			authoredRaw: params.snapshot.parsed,
			resolvedRaw: params.snapshot.sourceConfig
		}
	});
	const migrationCandidate = migratedSource ?? migrated;
	const hasLegacyChanges = changes.length > 0 || !isDeepStrictEqual(params.snapshot.sourceConfigBeforeMigrations ?? (hasAuthoredIncludes ? params.snapshot.sourceConfig : params.snapshot.parsed), params.snapshot.sourceConfig);
	return {
		state: {
			...params.state,
			...migrationCandidate ? {
				cfg: migrationCandidate,
				candidate: migrationCandidate
			} : {},
			pendingChanges: params.state.pendingChanges || hasLegacyChanges,
			fixHints: params.shouldRepair || !hasLegacyChanges ? params.state.fixHints : [...params.state.fixHints, `Run "${params.doctorFixCommand}" to ${partiallyValid ? "finish fixing" : "migrate"} legacy config keys.`]
		},
		issueLines: [...issueLines, ...warnings ?? []],
		changeLines: changes,
		partiallyValid: partiallyValid === true ? true : void 0
	};
}
/** Strip unknown config keys while preserving active auth profile settings. */
function applyUnknownConfigKeyStep(params) {
	const unknown = stripUnknownConfigKeys(params.state.candidate);
	if (unknown.removed.length === 0) return {
		state: params.state,
		removed: [],
		repairs: [],
		warnings: []
	};
	const protectedAuth = protectActiveAuthProfileConfig({
		before: params.state.candidate,
		after: unknown.config
	});
	return {
		state: {
			cfg: params.shouldRepair ? protectedAuth.config : params.state.cfg,
			candidate: protectedAuth.config,
			pendingChanges: true,
			fixHints: params.shouldRepair ? params.state.fixHints : [...params.state.fixHints, `Run "${params.doctorFixCommand}" to remove these keys.`]
		},
		removed: unknown.removed,
		repairs: protectedAuth.repairs,
		warnings: protectedAuth.warnings
	};
}
/** Keep the matched planning read independent of later write receipts and environment changes. */
function prepareDoctorConfigReferenceSource(snapshot) {
	if (!snapshot.authoredConfig || !snapshot.sourceConfigBeforeMigrations) return;
	return {
		authored: structuredClone(snapshot.authoredConfig),
		resolved: cloneConfigWithResolutionFacts(snapshot.sourceConfigBeforeMigrations),
		parsed: structuredClone(snapshot.parsed)
	};
}
/** A moved template must still have its original read-time value after migration. */
function retainValuePreservingMigrationRefs(template, migratedResolved, source) {
	const values = /* @__PURE__ */ new Map();
	const ambiguous = /* @__PURE__ */ new Set();
	const collect = (authored, resolved) => {
		if (typeof authored === "string" && /\$\{[A-Z_][A-Z0-9_]*\}/.test(authored)) {
			if (values.has(authored) && !isDeepStrictEqual(values.get(authored), resolved)) ambiguous.add(authored);
			values.set(authored, resolved);
		} else if (authored && typeof authored === "object") for (const [key, value] of Object.entries(authored)) collect(value, resolved && typeof resolved === "object" ? resolved[key] : void 0);
	};
	collect(source.authored, source.resolved);
	const retain = (authored, resolved) => {
		if (typeof authored === "string" && /\$\{[A-Z_][A-Z0-9_]*\}/.test(authored)) return values.has(authored) && !ambiguous.has(authored) && isDeepStrictEqual(values.get(authored), resolved) ? authored : void 0;
		if (Array.isArray(authored)) return authored.map((value, index) => retain(value, Array.isArray(resolved) ? resolved[index] : void 0));
		if (authored && typeof authored === "object") return Object.fromEntries(Object.entries(authored).map(([key, value]) => [key, retain(value, resolved && typeof resolved === "object" ? resolved[key] : void 0)]));
		return authored;
	};
	return retain(template, migratedResolved);
}
/** Restore unchanged and moved references without substituting a later environment. */
function restoreDoctorConfigEnvRefs(candidate, source, explicitSetPaths, migrationOptions = {}) {
	if (!source) return candidate;
	const canonicalAuthored = projectAuthoredAgentRosterForWrite({
		rootAuthoredConfig: source.authored,
		sourceConfigBeforeMigrations: source.resolved
	});
	const canonicalResolved = projectAuthoredAgentRosterForWrite({
		rootAuthoredConfig: source.resolved,
		sourceConfigBeforeMigrations: source.resolved
	});
	const unchanged = restoreEnvVarRefsFromResolved(candidate, canonicalAuthored, canonicalResolved, explicitSetPaths);
	const options = {
		sourceConfigBeforeMigrations: source.resolved,
		context: {
			authoredRaw: source.parsed,
			resolvedRaw: source.resolved
		}
	};
	const migratedAuthored = applyLegacyDoctorMigrations(canonicalAuthored, options);
	const migratedResolved = applyLegacyDoctorMigrations(canonicalResolved, options);
	const authoredView = migratedAuthored.next ?? canonicalAuthored;
	const resolvedView = migratedResolved.next ?? canonicalResolved;
	if (!isRecord(authoredView) || !isRecord(resolvedView)) throw new Error("Doctor reference migrations must preserve config object roots.");
	const migratedAuthoredConfig = coerceConfig(authoredView);
	const migratedResolvedConfig = coerceConfig(resolvedView);
	const referenceTemplate = createMergePatch(canonicalAuthored, migratedAuthoredConfig);
	const resolvedTemplate = createMergePatch(canonicalResolved, migratedResolvedConfig);
	const restored = restoreEnvVarRefsFromResolved(unchanged, retainValuePreservingMigrationRefs(referenceTemplate, resolvedTemplate, source), resolvedTemplate, explicitSetPaths);
	let movedAuthored = migratedAuthoredConfig;
	let movedResolved = migratedResolvedConfig;
	const pluginIdMigrations = new Map(Object.entries(migrationOptions.appliedPluginIdMigrations ?? {}));
	for (const [legacyId, owner] of source.installedPluginIdRecovery ?? []) pluginIdMigrations.set(legacyId, owner.pluginId);
	for (const [legacyId, pluginId] of pluginIdMigrations) {
		movedAuthored = migratePluginConfigId(movedAuthored, legacyId, pluginId);
		movedResolved = migratePluginConfigId(movedResolved, legacyId, pluginId);
	}
	const pluginReferences = createMergePatch(migratedAuthoredConfig.plugins?.entries ?? {}, movedAuthored.plugins?.entries ?? {});
	const pluginValues = createMergePatch(migratedResolvedConfig.plugins?.entries ?? {}, movedResolved.plugins?.entries ?? {});
	const recovered = restoreEnvVarRefsFromResolved(restored, { plugins: { entries: pluginReferences } }, { plugins: { entries: pluginValues } }, explicitSetPaths);
	if (!isRecord(recovered)) throw new Error("Doctor reference restoration must preserve the config object root.");
	const recoveredConfig = coerceConfig(recovered);
	setDeferredPluginMigrationConfigFacts(recoveredConfig, getDeferredPluginMigrationConfigFacts(candidate));
	return recoveredConfig;
}
//#endregion
export { restoreDoctorConfigEnvRefs as i, applyUnknownConfigKeyStep as n, prepareDoctorConfigReferenceSource as r, applyLegacyCompatibilityStep as t };
