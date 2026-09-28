import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as setRetainedLegacyDefaultAgentId, t as getRetainedLegacyDefaultAgentId } from "./legacy.default-agent-owner-state-BIemD7B0.mjs";
import { D as listAgentEntriesWithSource } from "./agent-scope-config-IQKOEtZ4.mjs";
import { i as tryGetLegacyDefaultAgentId, t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { g as resolveSecretRefProviderSourceMismatch } from "./ref-contract-BVi3ykLT.mjs";
import { p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { n as hasSensitiveUrlHintTag, t as SENSITIVE_URL_HINT_TAG } from "./redact-sensitive-url-DspuXlEe.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { r as hasKind } from "./slots-D4OMSTbt.mjs";
import { a as isRetiredPluginId, d as resolveEffectivePluginActivationState, i as isExplicitPluginDisableMarker, l as normalizePluginsConfig, n as createPluginActivationSource, p as resolveMemorySlotDecision, s as normalizePluginId } from "./config-state-BEAL5gWH.mjs";
import { f as pluginDiagnosticToConfigWarning, l as findUninspectedPluginDiagnostic } from "./discovery-D_5mAUI7.mjs";
import { n as resolveManifestCommandAliasOwnerInRegistry } from "./manifest-command-aliases-Cfg0xASJ.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { i as getOfficialExternalPluginCatalogEntryForPackage, m as resolveOfficialExternalPluginInstallSources, n as getOfficialExternalChannelSecretContract, r as getOfficialExternalPluginCatalogEntry, t as getOfficialExternalChannelHostSchemaAllOf } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { h as resolveOfficialExternalPluginId, o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-BMhosYMN.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DPc05JSs.mjs";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-ngXQhRsV.mjs";
import { i as materializeLegacyDefaultAgentRoles, t as migratePersistedImplicitMainRoster } from "./legacy.roster-zIYbDm7V.mjs";
import { r as planManifestModelCatalogSuppressions } from "./manifest-planner-LLbsmVKX.mjs";
import { s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as shouldSuppressMissingCodexPluginDiagnostics } from "./codex-plugin-diagnostics-CJT1Rh3i.mjs";
import { D as attachAgentListProjection, a as withConfigIssuePath, c as formatRawChannelConfigIssueMessage, h as hasAnthropicDefaultSignal, l as hasChannelDmPolicyDependencyWarningCandidates, o as bundledChannelIds, p as materializeRuntimeConfig, r as validateConfigObjectRaw, s as collectChannelDmPolicyDependencyWarnings, t as collectHeartbeatOwnerWarnings, u as normalizeBundledChannelId } from "./validation-core-DwJVlxTe.mjs";
import { r as omitDeferredPluginMigrationConfig } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import { i as listChannelIdsForOwnershipMigration } from "./channel-presence-policy-C83ks5im.mjs";
import { M as SecretRefSchema } from "./zod-schema.core-DyJd-bbI.mjs";
import { r as validatePluginSchemaValue } from "./schema-validator-G8odGT6Q.mjs";
import { r as ChannelHeartbeatVisibilitySchema } from "./zod-schema.implicit-mentions-CbSAuVqJ.mjs";
import "./model-catalog-BFaZ221R.mjs";
import { t as resolveWebSearchInstallCatalogEntries } from "./web-search-install-catalog-DJ92D1Xo.mjs";
import { n as cloneSchema } from "./schema.shared-CcT3A7OF.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-CpKxe5XX.mjs";
import { t as canStartConfiguredChannelPlugin } from "./channel-startup-policy-C2yOEe0U.mjs";
import { a as resolveConfiguredChannelAutoEnableCandidates, n as materializePluginAutoEnableCandidatesInternal } from "./plugin-auto-enable.materialize-D_ZwWzfs.mjs";
import { i as isNativeSessionCatalogOptOutOnly, o as shippedNativeSessionCatalogs } from "./native-session-catalog-config-CYC8tjEu.mjs";
import { n as discoverConfigSecretTargets } from "./target-registry-query-DciTXKJy.mjs";
import "./target-registry-BD3AtdiE.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
//#region src/config/legacy.context-budget.ts
const MODEL_CONTEXT_TOKENS_REPLACEMENT = "models.providers.<provider>.models[].contextTokens";
function hasLegacyContextBudgetConfig(root) {
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
function migrateLegacyContextBudgetConfig(raw) {
	if (!isRecord(raw) || !hasLegacyContextBudgetConfig(raw)) return {
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
//#region src/config/legacy.github-copilot.ts
function removeLegacyCopilotDiscovery(config) {
	if (!isRecord(config)) return config;
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
//#region src/config/official-external-channel-secret-schema.ts
/** Widens official external channel schemas for host-resolved SecretRef fields. */
const SECRET_REF_SCHEMA = SecretRefSchema.toJSONSchema({
	io: "input",
	target: "draft-07",
	unrepresentable: "any"
});
function asSchemaObject(value) {
	return asOptionalRecord(value);
}
function widenProperties(properties, fields) {
	if (!properties) return;
	for (const field of fields) {
		const current = asSchemaObject(properties[field]);
		if (current) properties[field] = { anyOf: [current, cloneSchema(SECRET_REF_SCHEMA)] };
	}
}
/** Keeps external plugin schemas honest while allowing host-resolved secret inputs. */
function widenOfficialExternalChannelSecretSchema(params) {
	const contract = getOfficialExternalChannelSecretContract(params.channelId);
	const hostSchemaAllOf = getOfficialExternalChannelHostSchemaAllOf(params.channelId);
	if (!contract && hostSchemaAllOf.length === 0 || !params.schema) return params.schema;
	const next = cloneSchema(params.schema);
	if (contract) {
		const fields = contract.fields.map((field) => field.field);
		widenProperties(next.properties, fields);
		widenProperties(asSchemaObject(asSchemaObject(next.properties?.accounts)?.additionalProperties)?.properties, fields);
	}
	if (hostSchemaAllOf.length > 0) next.allOf = [...Array.isArray(next.allOf) ? next.allOf : [], ...hostSchemaAllOf.map((clause) => cloneSchema(clause))];
	return next;
}
//#endregion
//#region src/config/channel-config-metadata.ts
/**
* Converts plugin manifest metadata into deterministic config UI metadata for docs, validation, and runtime schema.
* When multiple plugin origins expose the same id/channel, the closest origin owns the surfaced schema.
*/
const PLUGIN_ORIGIN_RANK = {
	config: 0,
	workspace: 1,
	global: 2,
	bundled: 3
};
const CHANNEL_HEARTBEAT_VISIBILITY_JSON_SCHEMA = ChannelHeartbeatVisibilitySchema.unwrap().toJSONSchema({ target: "draft-07" });
const CHANNEL_CONFIG_SCHEMA_MAX_TRAVERSAL_DEPTH = 256;
function assertChannelConfigSchemaTraversalDepth(value, depth = 0, seen = /* @__PURE__ */ new Set()) {
	if (!value || typeof value !== "object" || seen.has(value)) return;
	if (depth > CHANNEL_CONFIG_SCHEMA_MAX_TRAVERSAL_DEPTH) throw new Error(`channel config schema exceeds maximum traversal depth of ${CHANNEL_CONFIG_SCHEMA_MAX_TRAVERSAL_DEPTH}`);
	seen.add(value);
	const children = Array.isArray(value) ? value : isRecord(value) ? Object.values(value) : [];
	for (const child of children) assertChannelConfigSchemaTraversalDepth(child, depth + 1, seen);
}
function normalizeCoreOwnedChannelSchema(schema) {
	const normalized = structuredClone(schema);
	let changed = false;
	const normalizeNode = (node, accountMap = false, rootScope = true) => {
		let withinRootScope = rootScope && (node === normalized || typeof node.$id !== "string");
		if (typeof node.$ref === "string") {
			const match = withinRootScope ? /^#\/(\$defs|definitions)\/([A-Za-z0-9_.-]+)$/.exec(node.$ref) : null;
			const definitions = match?.[1] ? normalized[match[1]] : void 0;
			const target = isRecord(definitions) && match?.[2] ? definitions[match[2]] : void 0;
			if (!isRecord(target) || Object.keys(node).some((key) => ![
				"$ref",
				"$defs",
				"definitions",
				"$id",
				"$schema"
			].includes(key)) || [
				"$id",
				"$anchor",
				"$dynamicAnchor",
				"$recursiveAnchor",
				"$schema",
				"$ref"
			].some((key) => Object.hasOwn(target, key))) return;
			const owner = { ...node };
			Object.assign(node, structuredClone(target), owner);
			delete node.$ref;
			changed = true;
			withinRootScope = node === normalized;
		}
		for (const key of [
			"allOf",
			"anyOf",
			"oneOf"
		]) {
			const variants = node[key];
			for (const variant of Array.isArray(variants) ? variants : []) if (isRecord(variant)) normalizeNode(variant, accountMap, withinRootScope);
		}
		if (accountMap) {
			if (node.additionalProperties === true) {
				node.additionalProperties = {};
				changed = true;
			}
			const entries = [
				node.additionalProperties,
				...Object.values(isRecord(node.properties) ? node.properties : {}),
				...Object.values(isRecord(node.patternProperties) ? node.patternProperties : {})
			];
			for (const entry of entries) if (isRecord(entry)) normalizeNode(entry, false, withinRootScope);
			return;
		}
		const properties = isRecord(node.properties) ? node.properties : {};
		if (JSON.stringify(properties.heartbeatVisibility) !== JSON.stringify(CHANNEL_HEARTBEAT_VISIBILITY_JSON_SCHEMA)) {
			node.properties = {
				...properties,
				heartbeatVisibility: CHANNEL_HEARTBEAT_VISIBILITY_JSON_SCHEMA
			};
			changed = true;
		}
		const accounts = properties.accounts;
		if (isRecord(accounts)) normalizeNode(accounts, true, withinRootScope);
	};
	normalizeNode(normalized);
	return changed ? normalized : schema;
}
/** Collects plugin config UI metadata with deterministic origin precedence and output ordering. */
function collectPluginSchemaMetadataCore(registry) {
	const deduped = /* @__PURE__ */ new Map();
	for (const record of registry.plugins) {
		const current = deduped.get(record.id);
		const nextRank = PLUGIN_ORIGIN_RANK[record.origin] ?? Number.MAX_SAFE_INTEGER;
		if (current && current.originRank <= nextRank) continue;
		deduped.set(record.id, {
			id: record.id,
			name: record.name,
			description: record.description,
			configSecretInputPaths: record.configContracts?.secretInputs?.paths.map((entry) => entry.path),
			configUiHints: record.configUiHints,
			configGroups: record.configGroups,
			configSchema: record.configSchema,
			originRank: nextRank
		});
	}
	return [...deduped.values()].toSorted((left, right) => left.id.localeCompare(right.id)).map(({ originRank: _originRank, ...record }) => record);
}
function prepareChannelConfigSchema(origin, channelId, schema) {
	try {
		if (schema !== void 0) assertChannelConfigSchemaTraversalDepth(schema);
		if (origin === "bundled") return widenOfficialExternalChannelSecretSchema({
			channelId,
			schema
		});
		return widenOfficialExternalChannelSecretSchema({
			channelId,
			schema: schema === void 0 ? schema : normalizeCoreOwnedChannelSchema(schema)
		});
	} catch (error) {
		if (origin === "bundled") throw error;
		return schema;
	}
}
function collectSelectedChannelOwners(registry, selectedPluginIds) {
	const selectedOwners = /* @__PURE__ */ new Map();
	for (const record of registry.plugins.toSorted((left, right) => PLUGIN_ORIGIN_RANK[left.origin] - PLUGIN_ORIGIN_RANK[right.origin])) {
		if (!selectedPluginIds?.has(record.id)) continue;
		for (const channelId of record.channels) if (!selectedOwners.has(channelId)) selectedOwners.set(channelId, record.id);
	}
	return selectedOwners;
}
/** Collects per-channel config metadata with the plugin that supplied the selected schema. */
function collectChannelSchemaMetadataWithOwnership(registry, selectedPluginIds) {
	const byChannelId = /* @__PURE__ */ new Map();
	const selectedOwners = collectSelectedChannelOwners(registry, selectedPluginIds);
	for (const record of registry.plugins) {
		const originRank = PLUGIN_ORIGIN_RANK[record.origin] ?? Number.MAX_SAFE_INTEGER;
		const rootLabel = record.channelCatalogMeta?.label;
		const rootDescription = record.channelCatalogMeta?.blurb;
		for (const channelId of record.channels) {
			if (selectedOwners.has(channelId) && selectedOwners.get(channelId) !== record.id) continue;
			const current = byChannelId.get(channelId);
			if (!current || originRank <= current.originRank) byChannelId.set(channelId, {
				id: channelId,
				label: rootLabel ?? current?.label,
				description: rootDescription ?? current?.description,
				configSchema: current?.configSchema,
				configUiHints: current?.configUiHints,
				schemaPluginId: current?.schemaPluginId,
				schemaPluginOrigin: current?.schemaPluginOrigin ?? record.origin,
				originRank
			});
		}
		for (const [channelId, channelConfig] of Object.entries(record.channelConfigs ?? {})) {
			if (selectedOwners.has(channelId) && selectedOwners.get(channelId) !== record.id) continue;
			const current = byChannelId.get(channelId);
			if (current && current.originRank < originRank && (current.configSchema !== void 0 || current.configUiHints !== void 0)) continue;
			const configSchema = prepareChannelConfigSchema(record.origin, channelId, channelConfig.schema);
			byChannelId.set(channelId, {
				id: channelId,
				label: channelConfig.label ?? rootLabel ?? current?.label,
				description: channelConfig.description ?? rootDescription ?? current?.description,
				configSchema,
				configUiHints: channelConfig.uiHints,
				schemaPluginId: configSchema === void 0 ? void 0 : record.id,
				schemaPluginOrigin: record.origin,
				originRank
			});
		}
	}
	return [...byChannelId.values()].toSorted((left, right) => left.id.localeCompare(right.id)).map(({ originRank: _originRank, ...entry }) => {
		const configUiHints = Object.fromEntries(Object.entries(entry.configUiHints ?? {}).map(([path, hint]) => [path.trim().replace(/^\./, ""), hint]));
		for (const record of registry.plugins) for (const [rawPath, hint] of Object.entries(record.channelConfigs?.[entry.id]?.uiHints ?? {})) {
			const path = rawPath.trim().replace(/^\./, "");
			const sensitiveUrl = hasSensitiveUrlHintTag(hint);
			if (!path || hint.sensitive !== true && !sensitiveUrl) continue;
			const current = configUiHints[path];
			configUiHints[path] = {
				...current,
				...hint.sensitive === true ? { sensitive: true } : {},
				...sensitiveUrl ? { tags: [.../* @__PURE__ */ new Set([...current?.tags ?? [], SENSITIVE_URL_HINT_TAG])] } : {}
			};
		}
		if (Object.keys(configUiHints).length) entry.configUiHints = configUiHints;
		return entry;
	});
}
/** Collects public per-channel config UI metadata without internal schema ownership. */
function collectChannelSchemaMetadataCore(registry, selectedPluginIds) {
	return collectChannelSchemaMetadataWithOwnership(registry, selectedPluginIds).map(({ schemaPluginId: _schemaPluginId, schemaPluginOrigin: _schemaPluginOrigin, ...entry }) => entry);
}
/** Collects channel DM policy metadata without importing doctor/runtime command modules. */
function collectChannelDmPolicyMetadata(registry, selectedPluginIds) {
	const byChannelId = /* @__PURE__ */ new Map();
	const selectedOwners = collectSelectedChannelOwners(registry, selectedPluginIds);
	const put = (channelId, originRank, pluginId, dmAllowFromMode, openDmRequiresAllowFromWildcard) => {
		const id = channelId?.trim();
		if (!id) return;
		const selectedOwner = selectedOwners.get(id);
		if (selectedOwner !== void 0 && selectedOwner !== pluginId) return;
		const current = byChannelId.get(id);
		if (current && current.originRank < originRank) return;
		byChannelId.set(id, {
			id,
			...dmAllowFromMode ? { dmAllowFromMode } : {},
			...typeof openDmRequiresAllowFromWildcard === "boolean" ? { openDmRequiresAllowFromWildcard } : {},
			originRank
		});
	};
	for (const record of registry.plugins) {
		const originRank = PLUGIN_ORIGIN_RANK[record.origin] ?? Number.MAX_SAFE_INTEGER;
		const packageChannelId = record.packageChannel?.id?.trim();
		const officialEntry = getOfficialExternalPluginCatalogEntryForPackage(record.packageName);
		const officialChannel = officialEntry && resolveOfficialExternalPluginId(officialEntry) === record.id ? getOfficialExternalPluginCatalogManifest(officialEntry)?.channel : void 0;
		const doctorCapabilities = {
			...packageChannelId && officialChannel?.id?.trim() === packageChannelId ? officialChannel.doctorCapabilities : void 0,
			...record.packageChannel?.doctorCapabilities
		};
		const dmAllowFromMode = doctorCapabilities?.dmAllowFromMode;
		const openDmRequiresAllowFromWildcard = doctorCapabilities?.openDmRequiresAllowFromWildcard;
		for (const channelId of record.channels) put(channelId, originRank, record.id, channelId === packageChannelId ? dmAllowFromMode : void 0, channelId === packageChannelId ? openDmRequiresAllowFromWildcard : void 0);
		put(packageChannelId, originRank, record.id, dmAllowFromMode, openDmRequiresAllowFromWildcard);
		for (const channelId of Object.keys(record.channelConfigs ?? {})) put(channelId, originRank, record.id, channelId === packageChannelId ? dmAllowFromMode : void 0, channelId === packageChannelId ? openDmRequiresAllowFromWildcard : void 0);
	}
	return new Map([...byChannelId.values()].toSorted((left, right) => left.id.localeCompare(right.id)).map(({ originRank: _originRank, ...entry }) => [entry.id, entry]));
}
//#endregion
//#region src/config/channel-schema-selection.ts
/** Select metadata owners through the same preference and eligibility policy as channel startup. */
function resolveChannelSchemaSelection(registry, config, env = process.env) {
	const activationSourceConfig = resolvePluginActivationSourceConfig({ config });
	const effectiveConfig = config === getRuntimeConfigSnapshot() ? config : materializePluginAutoEnableCandidatesInternal({
		config: activationSourceConfig,
		candidates: resolveConfiguredChannelAutoEnableCandidates({
			config: activationSourceConfig,
			env,
			registry
		}),
		env,
		manifestRegistry: registry
	}).config;
	const pluginsConfig = normalizePluginsConfig(effectiveConfig.plugins);
	const activationSource = createPluginActivationSource({ config: activationSourceConfig });
	return new Set(registry.plugins.filter((plugin) => plugin.channels.length > 0 && canStartConfiguredChannelPlugin({
		id: plugin.id,
		origin: plugin.origin,
		channelIds: plugin.channels,
		config: effectiveConfig,
		pluginsConfig,
		activationSource
	})).map((plugin) => plugin.id));
}
//#endregion
//#region src/config/validation-prepared.ts
/** Raw and runtime documents share validation only when their actual schema inputs match. */
function validatePreparedPluginSchemaValue(params, prepared) {
	if (!prepared) return validatePluginSchemaValue(params);
	const previous = prepared.get(params.cacheKey);
	if (previous && (previous.schema === params.schema || isDeepStrictEqual(previous.schema, params.schema)) && previous.origin === params.origin && isDeepStrictEqual(previous.input, params.value)) return structuredClone(previous.result);
	const input = structuredClone(params.value);
	const result = validatePluginSchemaValue(params);
	prepared.set(params.cacheKey, {
		schema: params.schema,
		origin: params.origin,
		input,
		result: structuredClone(result)
	});
	return result;
}
//#endregion
//#region src/config/validation-plugin-config.ts
const BLOCKED_PLUGIN_CANDIDATE_PREFIX = "blocked plugin candidate:";
function formatChannelConfigIssueMessage(message, pluginId) {
	const safePluginId = pluginId ? sanitizeForLog(pluginId).trim() : "";
	return safePluginId ? `invalid config for plugin ${safePluginId}: ${message}` : formatRawChannelConfigIssueMessage(message);
}
/** Deferred channel settings remain authored inputs until their owning plugin can validate them. */
function resolveDeferredChannelConfigWarning(params) {
	const pluginId = params.schemaPluginId ?? GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.find((entry) => entry.channelId === params.channelId)?.pluginId ?? params.registry.plugins.find((record) => record.channels.includes(params.channelId))?.id;
	return pluginId && params.deferredPluginIds.has(normalizePluginId(pluginId)) ? {
		path: `channels.${params.channelId}`,
		message: `Plugin "${pluginId}" channel settings cannot be checked until its data/settings upgrade finishes. Your existing settings have been kept. Run "openclaw update status" for repair details.`
	} : void 0;
}
function formatRemovedPluginConfigWarning(pluginId) {
	if (pluginId === "skill-workshop") return "plugin removed: skill-workshop (stale plugin config ignored; Skill Workshop is built into OpenClaw skills now. Use skills.workshop settings and openclaw skills workshop commands, then remove this plugins config entry)";
	return `plugin removed: ${pluginId} (stale config entry ignored; remove it from plugins config)`;
}
function formatMissingOfficialExternalPluginWarning(pluginId, opts) {
	const catalogEntry = getOfficialExternalPluginCatalogEntry(pluginId);
	if (!catalogEntry) return null;
	const installSpec = resolveOfficialExternalPluginInstallSources(catalogEntry)[0]?.spec;
	if (!installSpec) return null;
	if (pluginId === "memory-lancedb" && opts?.selectedMissingMemorySlot) return `plugin not installed: ${pluginId} — gateway will run without persistent memory until installed; install the official external plugin with: openclaw plugins install ${installSpec}`;
	return `plugin not installed: ${pluginId} — install the official external plugin with: openclaw plugins install ${installSpec}`;
}
function validateExplicitPluginConfig(params) {
	const { raw, config, env, applyDefaults, registry, knownIds, normalizedPlugins, ensureCompatPluginIds, ensureOverriddenPluginIds, issues, warnings } = params;
	if (findUninspectedPluginDiagnostic(registry.diagnostics)) return;
	const blockedPluginDiagnostics = /* @__PURE__ */ new Map();
	const blockedPluginDiagnosticsWithSource = [];
	const normalizeBlockedDiagnosticPath = (value) => {
		const trimmed = value?.trim();
		if (!trimmed) return "";
		try {
			return path.resolve(resolveUserPath(trimmed, env ?? process.env));
		} catch {
			return path.resolve(trimmed);
		}
	};
	for (const diag of registry.diagnostics) {
		if (!diag.message.startsWith(BLOCKED_PLUGIN_CANDIDATE_PREFIX)) continue;
		if (!diag.pluginId && diag.source) blockedPluginDiagnosticsWithSource.push({
			message: diag.message,
			source: diag.source
		});
		if (diag.pluginId) {
			const normalizedPluginId = normalizePluginId(diag.pluginId);
			for (const key of [diag.pluginId, normalizedPluginId]) if (key && !blockedPluginDiagnostics.has(key)) blockedPluginDiagnostics.set(key, {
				message: diag.message,
				...diag.source ? { source: diag.source } : {}
			});
		}
	}
	const blockedDiagnosticSourceMatchesPluginId = (diagnostic, pluginId) => {
		const normalizedPluginId = normalizePluginId(pluginId);
		if (!normalizedPluginId) return false;
		const sourcePath = normalizeBlockedDiagnosticPath(diagnostic.source);
		if (!sourcePath) return false;
		if (normalizePluginId(path.basename(sourcePath)) === normalizedPluginId || normalizePluginId(path.basename(path.dirname(sourcePath))) === normalizedPluginId) return true;
		const loadPaths = config.plugins?.load?.paths;
		if (!Array.isArray(loadPaths)) return false;
		for (const loadPath of loadPaths) {
			if (typeof loadPath !== "string") continue;
			const resolvedLoadPath = normalizeBlockedDiagnosticPath(loadPath);
			if (resolvedLoadPath && normalizePluginId(path.basename(resolvedLoadPath)) === normalizedPluginId && (sourcePath === resolvedLoadPath || isPathInside(resolvedLoadPath, sourcePath) || isPathInside(sourcePath, resolvedLoadPath))) return true;
		}
		return false;
	};
	const findBlockedPluginDiagnostic = (pluginId) => blockedPluginDiagnostics.get(pluginId) ?? blockedPluginDiagnostics.get(normalizePluginId(pluginId)) ?? blockedPluginDiagnosticsWithSource.find((diagnostic) => blockedDiagnosticSourceMatchesPluginId(diagnostic, pluginId));
	const missingOfficialPluginWarningIds = /* @__PURE__ */ new Set();
	const deferredPluginWarningIds = /* @__PURE__ */ new Set();
	const noteDeferredPlugin = (pluginId, issuePath) => {
		const normalized = normalizePluginId(pluginId);
		if (!params.deferredPluginIds?.has(normalized)) return false;
		if (!deferredPluginWarningIds.has(normalized)) {
			deferredPluginWarningIds.add(normalized);
			warnings.push({
				path: issuePath,
				message: `Plugin "${pluginId}" settings cannot be checked until its data/settings upgrade finishes. Your existing settings have been kept. Run "openclaw update status" for repair details.`
			});
		}
		return true;
	};
	const pushMissingPluginIssue = (issuePath, pluginId, options) => {
		if (noteDeferredPlugin(pluginId, issuePath)) return;
		if (isRetiredPluginId(pluginId)) {
			warnings.push({
				path: issuePath,
				message: formatRemovedPluginConfigWarning(pluginId)
			});
			return;
		}
		const blockedDiagnostic = findBlockedPluginDiagnostic(pluginId);
		if (blockedDiagnostic) {
			const message = `plugin present but blocked: ${pluginId} (see preceding plugin warning${blockedDiagnostic.source ? `; source: ${blockedDiagnostic.source}` : ""}; fix the blocked plugin path instead of removing config)`;
			(options?.warnOnly ? warnings : issues).push({
				path: issuePath,
				message
			});
			return;
		}
		if (normalizePluginId(pluginId) === "codex" && issuePath === "plugins.entries.codex" && shouldSuppressMissingCodexPluginDiagnostics(config, env ?? process.env, isRecord(raw) ? raw : void 0)) return;
		if (options?.warnOnly && options.officialInstallHint !== false) {
			const externalInstallWarning = options.missingMessage ?? formatMissingOfficialExternalPluginWarning(pluginId);
			if (externalInstallWarning) {
				const normalizedPluginId = normalizePluginId(pluginId);
				if (!options.missingMessage && normalizedPluginId) {
					if (missingOfficialPluginWarningIds.has(normalizedPluginId)) return;
					missingOfficialPluginWarningIds.add(normalizedPluginId);
				}
				warnings.push({
					path: issuePath,
					message: externalInstallWarning
				});
				return;
			}
		}
		const message = options?.warnOnly ? `plugin not found: ${pluginId} (stale config entry ignored; remove it from plugins config)` : `plugin not found: ${pluginId}`;
		(options?.warnOnly ? warnings : issues).push({
			path: issuePath,
			message
		});
	};
	const pluginsConfig = config.plugins;
	const entries = pluginsConfig?.entries;
	const hasIntentionalDisableMarker = (pluginId) => isExplicitPluginDisableMarker(entries?.[pluginId]) && !isRetiredPluginId(pluginId);
	if (entries && isRecord(entries)) {
		for (const pluginId of Object.keys(entries)) if (!knownIds.has(pluginId) && !hasIntentionalDisableMarker(pluginId) && !isNativeSessionCatalogOptOutOnly(pluginId, entries[pluginId])) pushMissingPluginIssue(`plugins.entries.${pluginId}`, pluginId, { warnOnly: true });
	}
	for (const pluginId of pluginsConfig?.allow ?? []) {
		if (typeof pluginId !== "string" || !pluginId.trim() || knownIds.has(pluginId)) continue;
		const commandAlias = resolveManifestCommandAliasOwnerInRegistry({
			command: pluginId,
			registry
		});
		if (commandAlias?.pluginId && knownIds.has(commandAlias.pluginId)) warnings.push({
			path: "plugins.allow",
			message: `"${pluginId}" is not a plugin — it is a command provided by the "${commandAlias.pluginId}" plugin. Use "${commandAlias.pluginId}" in plugins.allow instead.`
		});
		else if (!hasIntentionalDisableMarker(pluginId)) pushMissingPluginIssue("plugins.allow", pluginId, { warnOnly: true });
	}
	for (const pluginId of pluginsConfig?.deny ?? []) if (typeof pluginId === "string" && pluginId.trim() && !knownIds.has(pluginId)) pushMissingPluginIssue("plugins.deny", pluginId, {
		warnOnly: true,
		officialInstallHint: false
	});
	const pluginSlots = pluginsConfig?.slots;
	const hasExplicitMemorySlot = pluginSlots !== void 0 && Object.hasOwn(pluginSlots, "memory");
	const memorySlot = normalizedPlugins.slots.memory;
	if (hasExplicitMemorySlot && typeof memorySlot === "string" && memorySlot.trim() && !knownIds.has(memorySlot)) {
		const missingMessage = formatMissingOfficialExternalPluginWarning(memorySlot, { selectedMissingMemorySlot: true });
		pushMissingPluginIssue("plugins.slots.memory", memorySlot, {
			warnOnly: memorySlot === "memory-lancedb" && Boolean(missingMessage) && !findBlockedPluginDiagnostic(memorySlot),
			missingMessage
		});
	}
	let selectedMemoryPluginId = null;
	const seenPlugins = /* @__PURE__ */ new Set();
	for (const record of registry.plugins) {
		const pluginId = record.id;
		if (seenPlugins.has(pluginId)) continue;
		seenPlugins.add(pluginId);
		if (noteDeferredPlugin(pluginId, `plugins.entries.${pluginId}`)) continue;
		const entry = normalizedPlugins.entries[pluginId];
		const entryHasConfig = Boolean(entry?.config);
		const activationState = resolveEffectivePluginActivationState({
			id: pluginId,
			origin: record.origin,
			channelIds: record.channels,
			config: normalizedPlugins,
			rootConfig: config,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(record)
		});
		let enabled = activationState.activated;
		let reason = activationState.reason;
		if (enabled) {
			const memoryDecision = resolveMemorySlotDecision({
				id: pluginId,
				kind: record.kind,
				slot: memorySlot,
				selectedId: selectedMemoryPluginId
			});
			if (!memoryDecision.enabled) {
				enabled = false;
				reason = memoryDecision.reason;
			}
			if (memoryDecision.selected && hasKind(record.kind, "memory")) selectedMemoryPluginId = pluginId;
		}
		const shouldReplacePluginConfig = entryHasConfig || applyDefaults && enabled;
		if (enabled || entryHasConfig) {
			if (record.configSchema) {
				const result = validatePreparedPluginSchemaValue({
					origin: record.origin,
					schema: record.configSchema,
					cacheKey: record.schemaCacheKey ?? record.manifestPath ?? pluginId,
					value: entry?.config ?? {},
					applyDefaults: true
				}, params.schemaValidations);
				if (!result.ok) for (const error of result.errors) {
					const base = `plugins.entries.${pluginId}.config`;
					issues.push({
						path: !error.path || error.path === "<root>" ? base : `${base}.${error.path}`,
						message: `invalid config: ${error.message}`,
						allowedValues: error.allowedValues,
						allowedValuesHiddenCount: error.allowedValuesHiddenCount
					});
				}
				else if (shouldReplacePluginConfig) {
					let nextValue = result.value;
					const nativeCatalog = record.setup?.nativeSessionCatalog ?? shippedNativeSessionCatalogs.find((catalog) => catalog.pluginId === pluginId);
					const authoredCatalog = isRecord(entry?.config) && isRecord(entry.config.sessionCatalog) ? entry.config.sessionCatalog : void 0;
					if (nativeCatalog && isRecord(nextValue.sessionCatalog) && Object.hasOwn(nextValue.sessionCatalog, "enabled") && !Object.hasOwn(authoredCatalog ?? {}, "enabled")) {
						const sessionCatalog = { ...nextValue.sessionCatalog };
						delete sessionCatalog.enabled;
						nextValue = {
							...nextValue,
							sessionCatalog
						};
					}
					params.replacePluginEntryConfig(pluginId, nextValue);
				}
			} else if (record.format === "bundle") {} else issues.push({
				path: `plugins.entries.${pluginId}`,
				message: `plugin schema missing for ${pluginId}`
			});
		}
		const suppressDisabledConfigWarning = isNativeSessionCatalogOptOutOnly(pluginId, entries?.[pluginId]) || ensureCompatPluginIds().has(pluginId) && !ensureOverriddenPluginIds().has(pluginId);
		if (!enabled && entryHasConfig && !suppressDisabledConfigWarning) warnings.push({
			path: `plugins.entries.${pluginId}`,
			message: `plugin disabled (${reason ?? "disabled"}) but config is present`
		});
	}
}
//#endregion
//#region src/config/validation-plugin-registry.ts
function collectExplicitPluginReferences(raw) {
	const references = {
		entries: /* @__PURE__ */ new Set(),
		allow: /* @__PURE__ */ new Set(),
		deny: /* @__PURE__ */ new Set(),
		slots: /* @__PURE__ */ new Map()
	};
	if (!isRecord(raw) || !isRecord(raw.plugins)) return references;
	const { plugins } = raw;
	if (isRecord(plugins.entries)) for (const pluginId of Object.keys(plugins.entries)) {
		const normalized = normalizePluginId(pluginId);
		if (normalized) references.entries.add(normalized);
	}
	for (const [key, target] of [["allow", references.allow], ["deny", references.deny]]) {
		const value = plugins[key];
		if (!Array.isArray(value)) continue;
		for (const entry of value) if (typeof entry === "string") {
			const normalized = normalizePluginId(entry);
			if (normalized) target.add(normalized);
		}
	}
	if (isRecord(plugins.slots)) for (const [slotId, pluginId] of Object.entries(plugins.slots)) {
		if (typeof pluginId !== "string") continue;
		const normalized = normalizePluginId(pluginId);
		if (normalized && normalized !== "none") references.slots.set(normalized, slotId);
	}
	return references;
}
function resolveExplicitPluginReferencePath(references, pluginId) {
	const normalized = normalizePluginId(pluginId);
	if (!normalized) return;
	if (references.entries.has(normalized)) return `plugins.entries.${normalized}`;
	if (references.allow.has(normalized)) return "plugins.allow";
	if (references.deny.has(normalized)) return "plugins.deny";
	const slotId = references.slots.get(normalized);
	return slotId ? `plugins.slots.${slotId}` : void 0;
}
/** Classify one registry generation against its authored plugin references and deferred owners. */
function createPluginRegistryConfigValidator(params) {
	const references = collectExplicitPluginReferences(params.raw);
	let checked = false;
	return (registry) => {
		if (checked) return;
		checked = true;
		for (const diagnostic of registry.diagnostics) {
			if (diagnostic.configDisposition === "preserve") {
				params.warnings.push(pluginDiagnosticToConfigWarning(diagnostic, "plugins.load.paths"));
				continue;
			}
			const explicitPath = diagnostic.pluginId ? resolveExplicitPluginReferencePath(references, diagnostic.pluginId) : void 0;
			const issue = {
				path: !diagnostic.pluginId && diagnostic.message.includes("plugin path not found") ? "plugins.load.paths" : explicitPath ?? "plugins",
				message: `${diagnostic.pluginId ? `plugin ${diagnostic.pluginId}` : "plugin"}: ${diagnostic.message}`
			};
			const deferred = diagnostic.pluginId && params.deferredPluginIds.has(normalizePluginId(diagnostic.pluginId));
			(diagnostic.level === "error" && (explicitPath || !diagnostic.pluginId) && !deferred ? params.issues : params.warnings).push(issue);
		}
	};
}
function collectSecretRefProviderSourceIssues(params) {
	const issues = [];
	for (const target of discoverConfigSecretTargets(params.config, {
		env: params.env,
		manifestRegistry: params.manifestRegistry
	})) {
		const { ref } = resolveSecretInputRef({
			value: target.value,
			refValue: target.refValue,
			defaults: params.config.secrets?.defaults
		});
		if (!ref) continue;
		const configuredSource = resolveSecretRefProviderSourceMismatch(params.config, ref);
		if (!configuredSource) continue;
		const path = target.refPath ?? target.path;
		const pathSegments = target.refPathSegments ?? target.pathSegments;
		issues.push(withConfigIssuePath({
			path,
			message: `Secret provider "${ref.provider}" has source "${configuredSource}" but ref requests "${ref.source}".`
		}, pathSegments));
	}
	return issues;
}
//#endregion
//#region src/config/validation-plugin-rules.ts
function validatePreparedConfigWithPlugins(raw, parsedConfig, opts) {
	const rememberRegistry = (registry) => {
		opts.onManifestRegistryResolved?.(registry);
		return { registry };
	};
	let registryInfo = opts.pluginMetadataSnapshot ? rememberRegistry(opts.pluginMetadataSnapshot.manifestRegistry) : null;
	const ensureLoadedRegistryInfo = () => {
		registryInfo ??= rememberRegistry(opts.loadPluginMetadataSnapshot?.(parsedConfig)?.manifestRegistry ?? resolveConfigWidePluginManifestRegistry({
			config: parsedConfig,
			env: opts.env ?? process.env
		}));
		return registryInfo;
	};
	if (opts.applyDefaults && !registryInfo && opts.pluginValidation !== "core-only") {
		const pluginMetadataSnapshot = opts.loadPluginMetadataSnapshot?.(parsedConfig);
		if (pluginMetadataSnapshot) registryInfo = rememberRegistry(pluginMetadataSnapshot.manifestRegistry);
	}
	const config = opts.applyDefaults ? materializeRuntimeConfig(parsedConfig, {
		env: opts.env,
		homedir: opts.homedir,
		manifestRegistry: registryInfo?.registry ?? (opts.pluginValidation === "core-only" ? { plugins: [] } : void 0),
		loadManifestRegistry: opts.pluginValidation === "core-only" ? void 0 : () => ensureLoadedRegistryInfo().registry
	}) : parsedConfig;
	if (opts.pluginValidation === "skip" || opts.pluginValidation === "core-only") return {
		ok: true,
		config,
		warnings: []
	};
	const issues = [];
	const warnings = [];
	const preserveUnavailableConfig = (path) => {
		const diagnostic = findUninspectedPluginDiagnostic(ensureLoadedRegistryInfo().registry.diagnostics);
		if (diagnostic) warnings.push(pluginDiagnosticToConfigWarning(diagnostic, path));
		return diagnostic !== void 0;
	};
	const deferredPluginIds = new Set(opts.deferredPluginMigrations?.map(({ pluginId }) => normalizePluginId(pluginId)));
	warnings.push(...collectHeartbeatOwnerWarnings(config));
	const hasExplicitPluginsConfig = isRecord(raw) && Object.hasOwn(raw, "plugins");
	let compatPluginIds = null;
	const pushRegistryDiagnostics = createPluginRegistryConfigValidator({
		raw,
		deferredPluginIds,
		issues,
		warnings
	});
	const ensureCompatPluginIds = () => {
		if (compatPluginIds) return compatPluginIds;
		const allow = config.plugins?.allow;
		if (!Array.isArray(allow) || allow.length === 0) {
			compatPluginIds = /* @__PURE__ */ new Set();
			return compatPluginIds;
		}
		const { registry } = ensureLoadedRegistryInfo();
		const overriddenBundledPluginIds = ensureOverriddenPluginIds();
		compatPluginIds = new Set(registry.plugins.filter((plugin) => plugin.origin === "bundled" && (plugin.contracts?.webSearchProviders?.length ?? 0) > 0 && !overriddenBundledPluginIds.has(plugin.id)).map((plugin) => plugin.id));
		return compatPluginIds;
	};
	const ensureRegistry = () => {
		const info = ensureLoadedRegistryInfo();
		pushRegistryDiagnostics(info.registry);
		return info;
	};
	const ensureKnownIds = () => {
		const info = ensureRegistry();
		info.knownIds ??= new Set(info.registry.plugins.map((record) => record.id));
		return info.knownIds;
	};
	const ensureOverriddenPluginIds = () => {
		const info = ensureRegistry();
		info.overriddenPluginIds ??= new Set(info.registry.diagnostics.filter((diag) => diag.message.includes("duplicate plugin id detected")).map((diag) => diag.pluginId).filter((pluginId) => typeof pluginId === "string" && pluginId !== ""));
		return info.overriddenPluginIds;
	};
	const ensureNormalizedPlugins = () => {
		const info = ensureRegistry();
		info.normalizedPlugins ??= normalizePluginsConfig(config.plugins);
		return info.normalizedPlugins;
	};
	const ensureChannelSchemaSelection = () => {
		const info = ensureLoadedRegistryInfo();
		info.channelSchemaSelection ??= resolveChannelSchemaSelection(info.registry, parsedConfig, opts.env);
		return info.channelSchemaSelection;
	};
	const ensureChannelSchemas = () => {
		const info = ensureRegistry();
		if (!info.channelSchemas) {
			info.channelSchemas = new Map(GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.map((entry) => [entry.channelId, {
				schema: entry.schema,
				origin: "bundled"
			}]));
			const selection = ensureChannelSchemaSelection();
			for (const entry of collectChannelSchemaMetadataWithOwnership(info.registry, selection)) {
				const current = info.channelSchemas.get(entry.id);
				if (entry.configSchema) info.channelSchemas.set(entry.id, {
					schema: entry.configSchema,
					pluginId: entry.schemaPluginOrigin === "bundled" ? void 0 : entry.schemaPluginId,
					origin: entry.schemaPluginOrigin
				});
				else if (!current) info.channelSchemas.set(entry.id, { origin: entry.schemaPluginOrigin });
			}
		}
		return info.channelSchemas;
	};
	const dmPolicyMetadata = hasChannelDmPolicyDependencyWarningCandidates(parsedConfig) ? collectChannelDmPolicyMetadata(ensureLoadedRegistryInfo().registry, ensureChannelSchemaSelection()) : void 0;
	warnings.push(...collectChannelDmPolicyDependencyWarnings(parsedConfig, { dmPolicyMetadata }));
	let mutatedConfig = config;
	let channelsCloned = false;
	let pluginsCloned = false;
	let pluginEntriesCloned = false;
	let installedPluginRecordIds = opts.installedPluginRecordIds ? new Set([...opts.installedPluginRecordIds].map(normalizePluginId)) : void 0;
	const ensureInstalledPluginRecordIds = () => {
		if (installedPluginRecordIds) return installedPluginRecordIds;
		try {
			installedPluginRecordIds = new Set(Object.keys(loadInstalledPluginIndexInstallRecordsSync({ env: opts.env })).map(normalizePluginId));
		} catch {
			installedPluginRecordIds = /* @__PURE__ */ new Set();
		}
		return installedPluginRecordIds;
	};
	const hasStalePluginEvidenceForUnknownChannel = (channelId) => {
		const normalizedChannelId = normalizePluginId(channelId);
		if (!normalizedChannelId || ensureKnownIds().has(normalizedChannelId)) return false;
		const pluginConfig = config.plugins;
		const matches = (pluginId) => normalizePluginId(pluginId) === normalizedChannelId;
		return Array.isArray(pluginConfig?.allow) && pluginConfig.allow.some(matches) || isRecord(pluginConfig?.entries) && Object.keys(pluginConfig.entries).some(matches) || isRecord(pluginConfig?.installs) && Object.keys(pluginConfig.installs).some(matches) || ensureInstalledPluginRecordIds().has(normalizedChannelId);
	};
	const collectActiveWebSearchProviderIds = () => {
		const { registry } = ensureRegistry();
		return [...new Set(registry.plugins.flatMap((record) => record.contracts?.webSearchProviders ?? []).map((providerId) => providerId.trim()).filter((providerId) => providerId.length > 0))].toSorted((left, right) => left.localeCompare(right));
	};
	const collectKnownWebSearchProviderIds = () => {
		return [.../* @__PURE__ */ new Set([...collectActiveWebSearchProviderIds(), ...resolveWebSearchInstallCatalogEntries().map((entry) => entry.provider.id.trim()).filter((providerId) => providerId.length > 0)])].toSorted((left, right) => left.localeCompare(right));
	};
	const hasPluginEvidenceForWebSearchProvider = (...pluginOrProviderIds) => {
		const candidateIds = new Set(pluginOrProviderIds.map(normalizePluginId).filter((id) => id.length > 0));
		if (candidateIds.size === 0) return false;
		const matches = (pluginId) => candidateIds.has(normalizePluginId(pluginId));
		const pluginConfig = config.plugins;
		if (Array.isArray(pluginConfig?.allow) && pluginConfig.allow.some(matches) || isRecord(pluginConfig?.entries) && Object.keys(pluginConfig.entries).some(matches) || isRecord(pluginConfig?.installs) && Object.keys(pluginConfig.installs).some(matches)) return true;
		return [...candidateIds].some((pluginId) => ensureInstalledPluginRecordIds().has(pluginId));
	};
	const validateWebSearchProvider = () => {
		const provider = config.tools?.web?.search?.provider;
		if (typeof provider !== "string") return;
		const trimmed = provider.trim();
		const issuePath = "tools.web.search.provider";
		if (!trimmed) {
			issues.push({
				path: issuePath,
				message: "web_search provider must not be empty"
			});
			return;
		}
		if (collectActiveWebSearchProviderIds().includes(trimmed)) return;
		if (preserveUnavailableConfig(issuePath)) return;
		const installCatalogEntry = resolveWebSearchInstallCatalogEntries().find((entry) => entry.provider.id === trimmed);
		if (installCatalogEntry) {
			const issue = {
				path: issuePath,
				message: `web_search provider is not available: ${trimmed} (install or enable plugin "${installCatalogEntry.pluginId}", then run openclaw doctor --fix)`,
				allowedValues: collectKnownWebSearchProviderIds()
			};
			if (hasPluginEvidenceForWebSearchProvider(trimmed, installCatalogEntry.pluginId)) warnings.push({
				...issue,
				message: `web_search provider is not available: ${trimmed} (configured plugin "${installCatalogEntry.pluginId}" is unavailable; Gateway will ignore this optional provider until the plugin is installed/enabled or openclaw doctor --fix repairs the config)`
			});
			else issues.push(issue);
			return;
		}
		const allowedValues = collectKnownWebSearchProviderIds();
		if (allowedValues.length === 0) return;
		const issue = {
			path: issuePath,
			message: `unknown web_search provider: ${trimmed}`,
			allowedValues
		};
		const normalizedProviderId = normalizePluginId(trimmed);
		if (Boolean(normalizedProviderId && !ensureKnownIds().has(normalizedProviderId) && hasPluginEvidenceForWebSearchProvider(trimmed))) warnings.push({
			...issue,
			message: `${issue.message} (stale web search plugin config ignored; run openclaw doctor --fix to remove stale config, or install the plugin)`
		});
		else issues.push(issue);
	};
	const validateConfiguredModelRefs = () => {
		const configuredRefs = collectConfiguredModelRefs(config);
		if (configuredRefs.length === 0) return;
		const { registry } = ensureRegistry();
		const suppressedModels = /* @__PURE__ */ new Map();
		for (const suppression of planManifestModelCatalogSuppressions({ registry }).suppressions) {
			const key = `${suppression.provider}/${suppression.model}`;
			if (!suppression.when && !suppressedModels.has(key)) suppressedModels.set(key, {
				provider: suppression.provider,
				model: suppression.model,
				...suppression.reason ? { reason: suppression.reason } : {}
			});
		}
		const seen = /* @__PURE__ */ new Set();
		for (const ref of configuredRefs) {
			const slashIndex = ref.value.indexOf("/");
			if (slashIndex <= 0 || slashIndex >= ref.value.length - 1) continue;
			const provider = normalizeLowercaseStringOrEmpty(ref.value.slice(0, slashIndex));
			const model = normalizeLowercaseStringOrEmpty(ref.value.slice(slashIndex + 1));
			if (!provider || !model) continue;
			const suppression = suppressedModels.get(`${provider}/${model}`);
			const issueKey = `${ref.path}\0${provider}/${model}`;
			if (!suppression || seen.has(issueKey)) continue;
			seen.add(issueKey);
			const modelRef = `${suppression.provider}/${suppression.model}`;
			issues.push({
				path: ref.path,
				message: suppression.reason ? `Unknown model: ${modelRef}. ${suppression.reason}` : `Unknown model: ${modelRef}.`
			});
		}
	};
	const replaceChannelConfig = (channelId, nextValue) => {
		if (!channelsCloned) {
			mutatedConfig = {
				...mutatedConfig,
				channels: { ...mutatedConfig.channels }
			};
			channelsCloned = true;
		}
		mutatedConfig.channels[channelId] = nextValue;
	};
	const replacePluginEntryConfig = (pluginId, nextValue) => {
		if (!pluginsCloned) {
			mutatedConfig = {
				...mutatedConfig,
				plugins: { ...mutatedConfig.plugins }
			};
			pluginsCloned = true;
		}
		if (!pluginEntriesCloned) {
			mutatedConfig.plugins = {
				...mutatedConfig.plugins,
				entries: { ...mutatedConfig.plugins?.entries }
			};
			pluginEntriesCloned = true;
		}
		const currentEntry = mutatedConfig.plugins?.entries?.[pluginId];
		mutatedConfig.plugins.entries[pluginId] = {
			...currentEntry,
			config: nextValue
		};
	};
	const allowedChannels = /* @__PURE__ */ new Set([
		"defaults",
		"modelByChannel",
		...bundledChannelIds
	]);
	if (config.channels && isRecord(config.channels)) for (const key of Object.keys(config.channels)) {
		const trimmed = key.trim();
		if (!trimmed) continue;
		if (!allowedChannels.has(trimmed)) for (const record of ensureRegistry().registry.plugins) for (const channelId of record.channels) allowedChannels.add(channelId);
		if (!allowedChannels.has(trimmed)) {
			if (preserveUnavailableConfig(`channels.${trimmed}`)) continue;
			const issue = {
				path: `channels.${trimmed}`,
				message: `unknown channel id: ${trimmed}`
			};
			if (hasStalePluginEvidenceForUnknownChannel(trimmed)) warnings.push({
				...issue,
				message: `${issue.message} (stale channel plugin config ignored; run openclaw doctor --fix to remove stale config, or install the plugin)`
			});
			else issues.push(issue);
			continue;
		}
		if (preserveUnavailableConfig(`channels.${trimmed}`)) continue;
		const channelSchema = ensureChannelSchemas().get(trimmed);
		if (!channelSchema?.schema) continue;
		const deferredChannelWarning = resolveDeferredChannelConfigWarning({
			channelId: trimmed,
			schemaPluginId: channelSchema.pluginId,
			deferredPluginIds,
			registry: ensureLoadedRegistryInfo().registry
		});
		if (deferredChannelWarning) {
			warnings.push(deferredChannelWarning);
			continue;
		}
		const result = validatePreparedPluginSchemaValue({
			origin: channelSchema.origin,
			schema: channelSchema.schema,
			cacheKey: `channel:${trimmed}`,
			value: config.channels[trimmed],
			applyDefaults: true
		}, opts.schemaValidations);
		if (!result.ok) for (const error of result.errors) issues.push({
			path: error.path === "<root>" ? `channels.${trimmed}` : `channels.${trimmed}.${error.path}`,
			message: formatChannelConfigIssueMessage(error.message, channelSchema.pluginId),
			allowedValues: error.allowedValues,
			allowedValuesHiddenCount: error.allowedValuesHiddenCount
		});
		else replaceChannelConfig(trimmed, result.value);
	}
	const heartbeatChannelIds = new Set(bundledChannelIds.map((channelId) => normalizeLowercaseStringOrEmpty(channelId)));
	const validateHeartbeatTarget = (target, issuePath) => {
		if (typeof target !== "string") return;
		const trimmed = target.trim();
		if (!trimmed) {
			issues.push({
				path: issuePath,
				message: "heartbeat target must not be empty"
			});
			return;
		}
		const normalized = normalizeLowercaseStringOrEmpty(trimmed);
		if (normalized === "owner" || normalized === "last" || normalized === "none" || normalizeBundledChannelId(trimmed)) return;
		if (!heartbeatChannelIds.has(normalized)) for (const record of ensureRegistry().registry.plugins) for (const channelId of record.channels) {
			const pluginChannel = channelId.trim();
			if (pluginChannel) heartbeatChannelIds.add(normalizeLowercaseStringOrEmpty(pluginChannel));
		}
		if (!heartbeatChannelIds.has(normalized)) {
			if (preserveUnavailableConfig(issuePath)) return;
			issues.push({
				path: issuePath,
				message: `unknown heartbeat target: ${target}`
			});
		}
	};
	validateHeartbeatTarget(config.agents?.defaults?.heartbeat?.target, "agents.defaults.heartbeat.target");
	for (const { entry, source } of listAgentEntriesWithSource(config)) {
		const pathPrefix = source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list.${source.index}`;
		validateHeartbeatTarget(entry?.heartbeat?.target, `${pathPrefix}.heartbeat.target`);
	}
	validateWebSearchProvider();
	validateConfiguredModelRefs();
	if (hasExplicitPluginsConfig) {
		const { registry } = ensureRegistry();
		validateExplicitPluginConfig({
			raw,
			config,
			env: opts.env,
			applyDefaults: opts.applyDefaults,
			schemaValidations: opts.schemaValidations,
			registry,
			knownIds: ensureKnownIds(),
			normalizedPlugins: ensureNormalizedPlugins(),
			deferredPluginIds,
			ensureCompatPluginIds,
			ensureOverriddenPluginIds,
			replacePluginEntryConfig,
			issues,
			warnings
		});
	}
	if (opts.semanticValidation === "strict" && Object.keys(mutatedConfig.secrets?.providers ?? {}).length > 0) issues.push(...collectSecretRefProviderSourceIssues({
		config: mutatedConfig,
		env: opts.env,
		manifestRegistry: ensureLoadedRegistryInfo().registry
	}));
	return issues.length > 0 ? {
		ok: false,
		issues,
		warnings
	} : {
		ok: true,
		config: mutatedConfig,
		warnings
	};
}
//#endregion
//#region src/config/validation.ts
function validateConfigObjectWithPlugins(raw, params) {
	return validateConfigObjectWithPluginMode(raw, params, true);
}
async function validateConfigObjectWithPluginsAsync(raw, params) {
	return validateConfigObjectWithPluginsAsyncInternal(raw, params, false);
}
/** Explicit validation prepares source facts without changing ordinary snapshot reads. */
async function validateConfigObjectWithStrictFactsAsync(raw, params) {
	return validateConfigObjectWithPluginsAsyncInternal(raw, params, true);
}
async function validateConfigObjectWithPluginsAsyncInternal(raw, params, prepareStrictValidation) {
	const { loadPluginMetadataSnapshotAsync, ...validationParams } = params;
	const prepared = prepareConfigObjectWithPlugins(raw, validationParams);
	if (!prepared.ok) return prepared.result;
	if (validationParams.pluginValidation === "core-only") return finishConfigObjectWithPlugins(prepared, validationParams, true);
	const pending = {
		ok: true,
		migrated: inheritLegacyDefaultAgentId(prepared.migrated, cloneConfigWithResolutionFacts(prepared.migrated)),
		parsedConfig: prepared.parsedConfig
	};
	const metadata = await loadPluginMetadataSnapshotAsync(pending.parsedConfig);
	const strictConfig = prepareStrictValidation ? inheritLegacyDefaultAgentId(pending.parsedConfig, cloneConfigWithResolutionFacts(pending.parsedConfig)) : void 0;
	const schemaValidations = strictConfig ? /* @__PURE__ */ new Map() : void 0;
	const preparedParams = {
		...validationParams,
		pluginMetadataSnapshot: metadata
	};
	const result = finishConfigObjectWithPlugins(pending, preparedParams, true, metadata.installedPluginRecordIds, schemaValidations);
	if (!result.ok || !strictConfig) return result;
	const strict = validatePreparedConfigWithPlugins(pending.migrated, strictConfig, {
		...preparedParams,
		applyDefaults: false,
		pluginValidation: "full",
		semanticValidation: "strict",
		installedPluginRecordIds: metadata.installedPluginRecordIds,
		schemaValidations
	});
	return {
		...result,
		strictIssues: strict.ok ? [] : strict.issues
	};
}
function validateConfigObjectRawWithPlugins(raw, params) {
	return validateConfigObjectWithPluginMode(raw, params, false);
}
function validateConfigObjectWithPluginMode(raw, params, applyDefaults) {
	const prepared = prepareConfigObjectWithPlugins(raw, params);
	return prepared.ok ? finishConfigObjectWithPlugins(prepared, params, applyDefaults) : prepared.result;
}
function prepareConfigObjectWithPlugins(raw, params) {
	const contextBudgetConfig = migrateLegacyContextBudgetConfig(removeLegacyCopilotDiscovery(omitDeferredPluginMigrationConfig(raw, params?.deferredPluginMigrations))).config;
	const migrated = migratePersistedImplicitMainRoster(contextBudgetConfig, {
		env: params?.env,
		homedir: params?.homedir
	}).config;
	const base = validateConfigObjectRaw(migrated, {
		sourceRaw: params?.sourceRaw,
		preservedLegacyRootKeys: params?.preservedLegacyRootKeys,
		env: params?.env,
		homedir: params?.homedir
	});
	if (!base.ok) return {
		ok: false,
		result: {
			ok: false,
			issues: base.issues,
			warnings: []
		}
	};
	return {
		ok: true,
		migrated,
		parsedConfig: inheritLegacyDefaultAgentId(migrated, attachAgentListProjection(cloneConfigWithResolutionFacts(base.config)))
	};
}
function finishConfigObjectWithPlugins({ migrated, parsedConfig }, params, applyDefaults, installedPluginRecordIds, schemaValidations) {
	let manifestRegistry = params?.pluginMetadataSnapshot?.manifestRegistry;
	const result = validatePreparedConfigWithPlugins(migrated, parsedConfig, {
		...params,
		applyDefaults,
		installedPluginRecordIds,
		schemaValidations,
		pluginValidation: params?.pluginValidation ?? "full",
		semanticValidation: params?.semanticValidation ?? "runtime",
		onManifestRegistryResolved: (registry) => {
			manifestRegistry = registry;
		}
	});
	const legacyDefaultAgentId = tryGetLegacyDefaultAgentId(migrated);
	if (!result.ok || !legacyDefaultAgentId || params?.pluginValidation === "core-only") return result;
	const materialized = materializeLegacyAgentOwnershipForActiveChannelsResult(inheritLegacyDefaultAgentId(migrated, result.config), legacyDefaultAgentId, params?.env, manifestRegistry?.plugins);
	return {
		...result,
		config: materialized.config
	};
}
function materializeLegacyAgentOwnershipForActiveChannelsResult(config, legacyDefaultAgentId, env, manifestRecords, options) {
	const ambientChannelIds = listChannelIdsForOwnershipMigration({
		config,
		env,
		...manifestRecords ? { manifestRecords } : {}
	});
	const materialized = materializeLegacyDefaultAgentRoles(config, legacyDefaultAgentId, {
		ambientChannelIds,
		env,
		homedir: options?.homedir,
		materializeSessionStore: options?.materializeSessionStore,
		materializeWorkspace: options?.materializeWorkspace
	});
	const next = inheritLegacyDefaultAgentId(config, materialized.config);
	return {
		...materialized,
		config: next
	};
}
//#endregion
//#region src/config/io.snapshot-preparation.ts
/** Preserve the ordinary reader's lazy defaults, including an unused manifest loader. */
function materializeConfigSnapshotDefaults(context, config, metadata) {
	return materializeRuntimeConfig(config, {
		...context.pathResolution,
		...context.options.pluginValidation === "core-only" ? { manifestRegistry: { plugins: [] } } : { loadManifestRegistry: () => metadata.load(config).manifestRegistry }
	});
}
async function prepareHostConfigSnapshot(request) {
	if (request.kind === "metadata") return await request.metadata.loadAsync(request.config);
	const { context, metadata } = request;
	if (request.kind === "materialize") {
		if (context.options.pluginValidation !== "core-only" && (request.config.models?.providers || hasAnthropicDefaultSignal(request.config, context.deps.env))) await metadata.loadAsync(request.config);
		return materializeConfigSnapshotDefaults(context, request.config, metadata);
	}
	return prepareConfigSnapshotValidation(request);
}
/** Both explicit CLI validation and an admitted host read prepare database facts before validation. */
async function prepareConfigSnapshotValidation(request) {
	const { context, metadata } = request;
	const pending = await context.resolveDeferredPluginMigrationsAsync();
	return {
		deferredPluginMigrations: pending,
		validated: await (request.prepareValidation === "strict" ? validateConfigObjectWithStrictFactsAsync : validateConfigObjectWithPluginsAsync)(request.raw, {
			...context.pathResolution,
			pluginValidation: context.options.pluginValidation,
			loadPluginMetadataSnapshotAsync: metadata.loadAsync,
			sourceRaw: request.sourceRaw,
			preservedLegacyRootKeys: context.options.preservedLegacyRootKeys,
			deferredPluginMigrations: pending
		})
	};
}
//#endregion
export { validateConfigObjectRawWithPlugins as a, resolveChannelSchemaSelection as c, removeLegacyCopilotDiscovery as d, migrateLegacyContextBudgetConfig as f, materializeLegacyAgentOwnershipForActiveChannelsResult as i, collectChannelSchemaMetadataCore as l, prepareConfigSnapshotValidation as n, validateConfigObjectWithPlugins as o, prepareHostConfigSnapshot as r, validateConfigObjectWithPluginsAsync as s, materializeConfigSnapshotDefaults as t, collectPluginSchemaMetadataCore as u };
