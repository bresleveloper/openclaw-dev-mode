import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { g as resolveSecretRefProviderSourceMismatch } from "./ref-contract-Bfd9_-Lp.mjs";
import { g as resolveSecretInputRef } from "./types.secrets-Dgbd2kyP.mjs";
import "./utils-gjJ-tD2q.mjs";
import { n as hasSensitiveUrlHintTag, t as SENSITIVE_URL_HINT_TAG } from "./redact-sensitive-url-C4n2JwGL.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { P as collectConfiguredModelRefs, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as parseProviderModelRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
import { a as isExplicitPluginDisableMarker, b as normalizePluginsConfigWithResolverCore, c as normalizePluginId, h as resolveMemorySlotDecision, o as isRetiredPluginId, p as resolveEffectivePluginActivationState, r as createPluginActivationSource, u as normalizePluginsConfig, w as hasKind } from "./config-state-DkDfCu7E.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import { r as listAgentEntriesWithSource } from "./agent-roster-gkYP38su.mjs";
import { n as resolveManifestCommandAliasOwnerInRegistry } from "./manifest-command-aliases-DnNdJZDN.mjs";
import { t as collectPluginProviderRequestOwners } from "./plugin-provider-request-policy-LXng-vNB.mjs";
import { n as findUninspectedPluginDiagnostic, o as pluginDiagnosticToConfigWarning, t as createBlockedPluginDiagnosticLookup } from "./discovery-availability-CEoTdFoo.mjs";
import { i as getOfficialExternalPluginCatalogEntryForPackage, m as resolveOfficialExternalPluginInstallSources, n as getOfficialExternalChannelSecretContract, r as getOfficialExternalPluginCatalogEntry, t as getOfficialExternalChannelHostSchemaAllOf } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { g as resolveOfficialExternalPluginId, o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-8hS3NARf.mjs";
import { y as createPluginManifestIdNormalizer } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { C as attachAgentListProjection, a as withConfigIssuePath, c as hasChannelDmPolicyDependencyWarningCandidates, f as materializeRuntimeConfig, l as normalizeBundledChannelId, o as bundledChannelIds, r as validateConfigObjectRaw, s as collectChannelDmPolicyDependencyWarnings, t as collectHeartbeatOwnerWarnings } from "./validation-core-ezn1vWYO.mjs";
import { t as applyImplicitAgentRosterDefaults } from "./implicit-agent-roster-D39ONJLa.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DeOUS5WQ.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { a as listChannelIdsForOwnershipMigration, o as listChannelIdsForOwnershipMigrationAsync } from "./channel-presence-policy-hdzky3AO.mjs";
import { i as omitDeferredPluginMigrationConfig } from "./deferred-plugin-migration-config-Cc7gzBuJ.mjs";
import { _ as materializeLegacyDefaultAgentRoles } from "./legacy-B7HUu-GS.mjs";
import { v as shouldSuppressMissingCodexPluginDiagnostics } from "./codex-route-model-ref-2IYegA3O.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-C6coO7KH.mjs";
import { r as planManifestModelCatalogSuppressions } from "./manifest-planner-sZi1SDO4.mjs";
import "./zod-schema.core-BohYkI3l.mjs";
import { r as validatePluginSchemaValue } from "./schema-validator-B9g4ZpIt.mjs";
import { i as SecretRefSchema } from "./zod-schema.sensitive-CJoPmAiI.mjs";
import { p as ChannelHeartbeatVisibilitySchema } from "./zod-schema.channel-messaging-common-CgNlx_0i.mjs";
import "./model-catalog-Ag5B94I6.mjs";
import { t as resolveWebSearchInstallCatalogEntries } from "./web-search-install-catalog-D_H3kjvG.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { t as asSchemaObject } from "./schema.shared-BX8DvRf8.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-vHcoMR69.mjs";
import { t as canStartConfiguredChannelPlugin } from "./channel-startup-policy-8d7Kz1SS.mjs";
import { i as resolveConfiguredChannelAutoEnableCandidates, n as materializePluginAutoEnableCandidatesInternal } from "./plugin-auto-enable.materialize-CksyHPxI.mjs";
import { i as isNativeSessionCatalogOptOutOnly, o as shippedNativeSessionCatalogs } from "./native-session-catalog-config-Cw2NJHbW.mjs";
import { n as discoverConfigSecretTargets } from "./target-registry-query-DOYceNvb.mjs";
import "./target-registry-CSb4wosA.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/official-external-channel-secret-schema.ts
/** Widens official external channel schemas for host-resolved SecretRef fields. */
const SECRET_REF_SCHEMA = SecretRefSchema.toJSONSchema({
	io: "input",
	target: "draft-07",
	unrepresentable: "any"
});
function widenProperties(properties, fields) {
	if (!properties) return;
	for (const field of fields) {
		const current = asSchemaObject(properties[field]);
		if (current) properties[field] = { anyOf: [current, structuredClone(SECRET_REF_SCHEMA)] };
	}
}
/** Keeps external plugin schemas honest while allowing host-resolved secret inputs. */
function widenOfficialExternalChannelSecretSchema(params) {
	const contract = getOfficialExternalChannelSecretContract(params.channelId);
	const hostSchemaAllOf = getOfficialExternalChannelHostSchemaAllOf(params.channelId);
	if (!contract && hostSchemaAllOf.length === 0 || !params.schema) return params.schema;
	const next = structuredClone(params.schema);
	if (contract) {
		const fields = contract.fields.map((field) => field.field);
		widenProperties(next.properties, fields);
		const accounts = asSchemaObject(next.properties?.accounts);
		widenProperties(asSchemaObject(accounts?.additionalProperties)?.properties, fields);
	}
	if (hostSchemaAllOf.length > 0) next.allOf = [...Array.isArray(next.allOf) ? next.allOf : [], ...hostSchemaAllOf.map((clause) => structuredClone(clause))];
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
	const requestOwners = collectPluginProviderRequestOwners(registry.plugins);
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
			providerRequest: record.providerRequest ? { providers: Object.fromEntries([...requestOwners].filter(([, owner]) => owner.plugin === record).map(([provider, { policy }]) => [provider, policy])) } : void 0,
			originRank: nextRank
		});
	}
	return [...deduped.values()].toSorted((left, right) => left.id.localeCompare(right.id)).map(({ originRank: _originRank, ...record }) => record);
}
function prepareChannelConfigSchema(origin, channelId, schema) {
	try {
		if (schema !== void 0) assertChannelConfigSchemaTraversalDepth(schema);
		return widenOfficialExternalChannelSecretSchema({
			channelId,
			schema: origin === "bundled" || schema === void 0 ? schema : normalizeCoreOwnedChannelSchema(schema)
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
		for (const channelId of [
			...record.channels,
			packageChannelId,
			...Object.keys(record.channelConfigs ?? {})
		]) put(channelId, originRank, record.id, channelId === packageChannelId ? dmAllowFromMode : void 0, channelId === packageChannelId ? openDmRequiresAllowFromWildcard : void 0);
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
let registryValidations = /* @__PURE__ */ new WeakMap();
function preparePluginSchemaValidations(registry) {
	const previous = registry && registryValidations.get(registry);
	const next = new LruCache(512);
	return {
		previous,
		next,
		publish() {
			if (registry) registryValidations.set(registry, next);
			else registryValidations = /* @__PURE__ */ new WeakMap();
		}
	};
}
/** Reuse unchanged schema inputs across config revisions and raw/runtime documents. */
function validatePreparedPluginSchemaValue(params, prepared) {
	const previous = prepared.next.get(params.cacheKey) ?? prepared.previous?.peek(params.cacheKey);
	if (previous && isDeepStrictEqual(previous.schema, params.schema) && previous.origin === params.origin && previous.applyDefaults === Boolean(params.applyDefaults) && isDeepStrictEqual(previous.input, params.value)) {
		prepared.next.set(params.cacheKey, previous);
		return structuredClone(previous.result);
	}
	const input = structuredClone(params.value);
	const result = validatePluginSchemaValue(params);
	prepared.next.set(params.cacheKey, {
		schema: structuredClone(params.schema),
		origin: params.origin,
		input,
		applyDefaults: Boolean(params.applyDefaults),
		result: structuredClone(result)
	});
	return result;
}
//#endregion
//#region src/config/validation-model-params.ts
/** Validate authored per-model params without filling defaults into override layers. */
function validateProviderModelParams(params) {
	const scopes = [{
		path: "agents.defaults",
		models: params.config.agents?.defaults?.models
	}, ...listAgentEntriesWithSource(params.config).map(({ entry, source }) => ({
		path: source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list.${source.index}`,
		models: entry.models
	}))];
	const issues = [];
	const requestOwners = collectPluginProviderRequestOwners(params.registry.plugins);
	for (const [provider, { plugin, policy }] of requestOwners) {
		if (!policy.modelParamsSchema || params.deferredPluginIds.has(normalizePluginId(plugin.id))) continue;
		for (const scope of scopes) for (const [ref, entry] of Object.entries(scope.models ?? {})) {
			if (!entry.params || parseProviderModelRef(ref)?.provider !== provider) continue;
			const base = `${scope.path}.models.${ref}.params`;
			const result = validatePreparedPluginSchemaValue({
				origin: plugin.origin,
				schema: policy.modelParamsSchema,
				cacheKey: `model-params:${plugin.id}:${base}`,
				value: entry.params,
				applyDefaults: false
			}, params.schemaValidations);
			if (!result.ok) issues.push(...result.errors.map((error) => ({
				path: error.path === "<root>" ? base : `${base}.${error.path}`,
				message: `invalid model params: ${error.message}`,
				allowedValues: error.allowedValues,
				allowedValuesHiddenCount: error.allowedValuesHiddenCount
			})));
		}
	}
	return issues;
}
//#endregion
//#region src/config/validation-plugin-config.ts
function formatChannelConfigIssueMessage(message, pluginId) {
	const safePluginId = pluginId ? sanitizeForLog(pluginId).trim() : "";
	return safePluginId ? `invalid config for plugin ${safePluginId}: ${message}` : `invalid config: ${message}`;
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
	if (pluginId === "skill-workshop") return "plugin removed: skill-workshop (stale plugin config ignored; Skill Workshop is built into OpenClaw skills now. Set skills.workshop.autonomous.mode to \"auto\" or \"off\" and use openclaw skills workshop commands, then remove this plugins config entry)";
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
	const { raw, config, env, applyDefaults, registry, ensureCompatPluginIds, ensureOverriddenPluginIds, issues, warnings } = params;
	if (findUninspectedPluginDiagnostic(registry.diagnostics)) return;
	const knownIds = new Set(registry.plugins.map((record) => record.id));
	const resolvePluginId = createPluginManifestIdNormalizer(registry);
	const resolveConfigPluginId = (id) => resolvePluginId(normalizePluginId(id));
	const resolvePolicyId = (id) => normalizePluginPolicyId(resolveConfigPluginId(id));
	const normalizedPlugins = normalizePluginsConfigWithResolverCore(config.plugins, resolveConfigPluginId);
	const hasKnownPlugin = (id) => knownIds.has(resolveConfigPluginId(id));
	const findBlockedPluginDiagnostic = createBlockedPluginDiagnosticLookup({
		diagnostics: registry.diagnostics,
		config,
		env
	});
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
	const authoredEntryIds = new Map(Object.keys(entries ?? {}).map((id) => [resolvePolicyId(id), id]));
	for (const [id, entry] of Object.entries(entries ?? {})) if (Object.hasOwn(entry, "config")) authoredEntryIds.set(resolvePolicyId(id), id);
	const hasIntentionalDisableMarker = (pluginId) => isExplicitPluginDisableMarker(entries?.[pluginId]) && !isRetiredPluginId(pluginId);
	for (const [pluginId, entry] of Object.entries(entries ?? {})) if (!hasKnownPlugin(pluginId) && !hasIntentionalDisableMarker(pluginId) && !isNativeSessionCatalogOptOutOnly(pluginId, entry)) pushMissingPluginIssue(`plugins.entries.${pluginId}`, pluginId, { warnOnly: true });
	for (const pluginId of pluginsConfig?.allow ?? []) {
		if (!pluginId.trim() || hasKnownPlugin(pluginId)) continue;
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
	for (const pluginId of pluginsConfig?.deny ?? []) if (pluginId.trim() && !hasKnownPlugin(pluginId)) pushMissingPluginIssue("plugins.deny", pluginId, {
		warnOnly: true,
		officialInstallHint: false
	});
	const pluginSlots = pluginsConfig?.slots;
	const hasExplicitMemorySlot = pluginSlots !== void 0 && Object.hasOwn(pluginSlots, "memory");
	const memorySlot = normalizedPlugins.slots.memory;
	if (hasExplicitMemorySlot && typeof memorySlot === "string" && memorySlot.trim() && !hasKnownPlugin(memorySlot)) {
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
		const policyId = resolvePolicyId(pluginId);
		const entryId = authoredEntryIds.get(policyId) ?? policyId;
		const entry = normalizedPlugins.entries[policyId];
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
					const base = `plugins.entries.${entryId}.config`;
					issues.push({
						path: !error.path || error.path === "<root>" ? base : `${base}.${error.path}`,
						message: `invalid config: ${error.message}`,
						allowedValues: error.allowedValues,
						allowedValuesHiddenCount: error.allowedValuesHiddenCount
					});
				}
				else if (entryHasConfig || applyDefaults && enabled) {
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
					params.replacePluginEntryConfig(entryId, nextValue);
				}
			} else if (record.format !== "bundle") issues.push({
				path: `plugins.entries.${entryId}`,
				message: `plugin schema missing for ${pluginId}`
			});
		}
		const suppressDisabledConfigWarning = isNativeSessionCatalogOptOutOnly(pluginId, entries?.[entryId]) || ensureCompatPluginIds().has(pluginId) && !ensureOverriddenPluginIds().has(pluginId);
		if (!enabled && entryHasConfig && !suppressDisabledConfigWarning) warnings.push({
			path: `plugins.entries.${entryId}`,
			message: `plugin disabled (${reason ?? "disabled"}) but config is present`
		});
	}
}
//#endregion
//#region src/config/validation-plugin-registry.ts
function collectExplicitPluginReferencePaths(raw) {
	const references = /* @__PURE__ */ new Map();
	if (!isRecord(raw) || !isRecord(raw.plugins)) return references;
	const { plugins } = raw;
	if (isRecord(plugins.slots)) for (const [slotId, pluginId] of Object.entries(plugins.slots)) {
		if (typeof pluginId !== "string") continue;
		const normalized = normalizePluginId(pluginId);
		if (normalized && normalized !== "none") references.set(normalized, slotId ? `plugins.slots.${slotId}` : void 0);
	}
	for (const key of ["deny", "allow"]) {
		const value = plugins[key];
		if (!Array.isArray(value)) continue;
		for (const entry of value) if (typeof entry === "string") {
			const normalized = normalizePluginId(entry);
			if (normalized) references.set(normalized, `plugins.${key}`);
		}
	}
	if (isRecord(plugins.entries)) for (const pluginId of Object.keys(plugins.entries)) {
		const normalized = normalizePluginId(pluginId);
		if (normalized) references.set(normalized, `plugins.entries.${normalized}`);
	}
	return references;
}
/** Classify one registry generation against its authored plugin references and deferred owners. */
function createPluginRegistryConfigValidator(params) {
	const references = collectExplicitPluginReferencePaths(params.raw);
	let checked = false;
	return (registry) => {
		if (checked) return;
		checked = true;
		for (const diagnostic of registry.diagnostics) {
			if (diagnostic.level === "info") continue;
			if (diagnostic.configDisposition === "preserve") {
				params.warnings.push(pluginDiagnosticToConfigWarning(diagnostic, "plugins.load.paths"));
				continue;
			}
			const explicitPath = diagnostic.pluginId ? references.get(normalizePluginId(diagnostic.pluginId)) : void 0;
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
	let registryInfo = opts.pluginMetadataSnapshot ? { registry: opts.pluginMetadataSnapshot.manifestRegistry } : null;
	const ensureLoadedRegistryInfo = () => {
		registryInfo ??= { registry: opts.loadPluginMetadataSnapshot?.(parsedConfig)?.manifestRegistry ?? resolveConfigWidePluginManifestRegistry({
			config: parsedConfig,
			env: opts.env ?? process.env
		}) };
		return registryInfo;
	};
	let schemaValidations;
	const ensureSchemaValidations = () => schemaValidations ??= preparePluginSchemaValidations(ensureLoadedRegistryInfo().registry);
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
		info.knownIds ??= new Set(info.registry.plugins.map((record) => normalizePluginId(record.id)));
		return info.knownIds;
	};
	const ensureOverriddenPluginIds = () => {
		const info = ensureRegistry();
		info.overriddenPluginIds ??= new Set(info.registry.diagnostics.filter((diag) => diag.message.includes("duplicate plugin id detected")).map((diag) => diag.pluginId).filter((pluginId) => typeof pluginId === "string" && pluginId !== ""));
		return info.overriddenPluginIds;
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
	const hasStalePluginEvidence = (id) => {
		const normalizedId = normalizePluginId(id);
		return Boolean(normalizedId) && !ensureKnownIds().has(normalizedId) && hasPluginEvidence(id);
	};
	const collectActiveWebSearchProviderIds = () => {
		const { registry } = ensureRegistry();
		return [...new Set(registry.plugins.flatMap((record) => record.contracts?.webSearchProviders ?? []).map((providerId) => providerId.trim().toLowerCase()).filter((providerId) => providerId.length > 0))].toSorted((left, right) => left.localeCompare(right));
	};
	const collectKnownWebSearchProviderIds = () => {
		return [.../* @__PURE__ */ new Set([...collectActiveWebSearchProviderIds(), ...resolveWebSearchInstallCatalogEntries().map((entry) => entry.provider.id.trim().toLowerCase()).filter((providerId) => providerId.length > 0)])].toSorted((left, right) => left.localeCompare(right));
	};
	const hasPluginEvidence = (...pluginOrProviderIds) => {
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
		const normalizedProviderId = trimmed.toLowerCase();
		if (collectActiveWebSearchProviderIds().includes(normalizedProviderId)) return;
		if (preserveUnavailableConfig(issuePath)) return;
		const installCatalogEntry = resolveWebSearchInstallCatalogEntries().find((entry) => entry.provider.id.trim().toLowerCase() === normalizedProviderId);
		if (installCatalogEntry) {
			const issue = {
				path: issuePath,
				message: `web_search provider is not available: ${trimmed} (install or enable plugin "${installCatalogEntry.pluginId}", then run openclaw doctor --fix)`,
				allowedValues: collectKnownWebSearchProviderIds()
			};
			if (hasPluginEvidence(trimmed, installCatalogEntry.pluginId)) warnings.push({
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
		if (hasStalePluginEvidence(trimmed)) warnings.push({
			...issue,
			message: `${issue.message} (stale web search plugin config ignored; run openclaw doctor --fix to remove stale config, or install the plugin)`
		});
		else issues.push(issue);
	};
	const validateConfiguredModelRefs = () => {
		const configuredRefs = collectConfiguredModelRefs(config);
		if (configuredRefs.length === 0) return;
		const { registry } = ensureRegistry();
		if (!findUninspectedPluginDiagnostic(registry.diagnostics)) issues.push(...validateProviderModelParams({
			config,
			registry,
			deferredPluginIds,
			schemaValidations: ensureSchemaValidations()
		}));
		const { suppressions } = planManifestModelCatalogSuppressions({ registry });
		const suppressedModels = /* @__PURE__ */ new Map();
		for (const suppression of suppressions) {
			const key = `${suppression.provider}/${suppression.model}`;
			if (!suppression.when && !suppressedModels.has(key)) suppressedModels.set(key, suppression);
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
		if (!pluginEntriesCloned) {
			mutatedConfig = {
				...mutatedConfig,
				plugins: {
					...mutatedConfig.plugins,
					entries: { ...mutatedConfig.plugins?.entries }
				}
			};
			pluginEntriesCloned = true;
		}
		const currentEntry = mutatedConfig.plugins?.entries?.[pluginId];
		mutatedConfig.plugins.entries[pluginId] = {
			...currentEntry,
			config: nextValue
		};
	};
	const allowedChannels = new Set(bundledChannelIds);
	let registryChannelsLoaded = false;
	const isKnownChannel = (channelId) => {
		if (!allowedChannels.has(channelId) && !registryChannelsLoaded) {
			for (const record of ensureRegistry().registry.plugins) for (const id of record.channels) allowedChannels.add(id);
			registryChannelsLoaded = true;
		}
		return allowedChannels.has(channelId);
	};
	if (config.channels && isRecord(config.channels)) for (const key of Object.keys(config.channels)) {
		const trimmed = key.trim();
		if (!trimmed) continue;
		if (trimmed !== "defaults" && trimmed !== "modelByChannel" && !isKnownChannel(trimmed)) {
			if (preserveUnavailableConfig(`channels.${trimmed}`)) continue;
			const issue = {
				path: `channels.${trimmed}`,
				message: `unknown channel id: ${trimmed}`
			};
			if (hasStalePluginEvidence(trimmed)) warnings.push({
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
		}, ensureSchemaValidations());
		if (!result.ok) for (const error of result.errors) issues.push({
			path: error.path === "<root>" ? `channels.${trimmed}` : `channels.${trimmed}.${error.path}`,
			message: formatChannelConfigIssueMessage(error.message, channelSchema.pluginId),
			allowedValues: error.allowedValues,
			allowedValuesHiddenCount: error.allowedValuesHiddenCount
		});
		else replaceChannelConfig(trimmed, result.value);
	}
	for (const key of ["byChannel", "debounceMsByChannel"]) for (const channelId of Object.keys(config.messages?.queue?.[key] ?? {})) {
		if (channelId === "webchat" || isKnownChannel(channelId)) continue;
		const path = `messages.queue.${key}.${channelId}`;
		if (preserveUnavailableConfig(path)) continue;
		warnings.push({
			path,
			message: `unknown channel id: ${channelId} (install its channel plugin or correct this setting)`
		});
	}
	const heartbeatChannelIds = new Set(bundledChannelIds);
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
			registry,
			schemaValidations: ensureSchemaValidations(),
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
	if (issues.length === 0) (schemaValidations ?? preparePluginSchemaValidations(registryInfo?.registry)).publish();
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
var PluginMetadataRequired = class extends Error {};
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
		migrated: cloneConfigWithResolutionFacts(prepared.migrated),
		parsedConfig: prepared.parsedConfig
	};
	const validate = (metadata) => {
		const parsedConfig = cloneConfigWithResolutionFacts(pending.parsedConfig);
		const strictConfig = prepareStrictValidation ? cloneConfigWithResolutionFacts(parsedConfig) : void 0;
		const preparedParams = {
			...validationParams,
			pluginMetadataSnapshot: metadata,
			loadPluginMetadataSnapshot: () => {
				throw new PluginMetadataRequired();
			}
		};
		const result = finishConfigObjectWithPlugins({
			...pending,
			parsedConfig
		}, preparedParams, true, metadata?.installedPluginRecordIds);
		if (!result.ok || !strictConfig) return result;
		const strict = validatePreparedConfigWithPlugins(pending.migrated, strictConfig, {
			...preparedParams,
			applyDefaults: false,
			pluginValidation: "full",
			semanticValidation: "strict",
			installedPluginRecordIds: metadata?.installedPluginRecordIds
		});
		return {
			...result,
			strictIssues: strict.ok ? [] : strict.issues
		};
	};
	try {
		return validate();
	} catch (error) {
		if (!(error instanceof PluginMetadataRequired)) throw error;
	}
	return validate(await loadPluginMetadataSnapshotAsync(pending.parsedConfig));
}
function validateConfigObjectRawWithPlugins(raw, params) {
	return validateConfigObjectWithPluginMode(raw, params, false);
}
function validateConfigObjectWithPluginMode(raw, params, applyDefaults) {
	const prepared = prepareConfigObjectWithPlugins(raw, params);
	return prepared.ok ? finishConfigObjectWithPlugins(prepared, params, applyDefaults) : prepared.result;
}
function prepareConfigObjectWithPlugins(raw, params) {
	const migrated = applyImplicitAgentRosterDefaults(omitDeferredPluginMigrationConfig(raw, params?.deferredPluginMigrations));
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
		parsedConfig: attachAgentListProjection(cloneConfigWithResolutionFacts(base.config))
	};
}
function finishConfigObjectWithPlugins({ migrated, parsedConfig }, params, applyDefaults, installedPluginRecordIds) {
	return validatePreparedConfigWithPlugins(migrated, parsedConfig, {
		...params,
		applyDefaults,
		installedPluginRecordIds,
		pluginValidation: params?.pluginValidation ?? "full",
		semanticValidation: params?.semanticValidation ?? "runtime"
	});
}
function materializeLegacyAgentOwnershipForActiveChannelsResult(config, legacyDefaultAgentId, env, manifestRecords, options) {
	const ambientChannelIds = listChannelIdsForOwnershipMigration({
		config,
		env,
		...manifestRecords ? { manifestRecords } : {}
	});
	return materializeLegacyDefaultAgentRoles(config, legacyDefaultAgentId, {
		ambientChannelIds,
		env,
		homedir: options?.homedir,
		materializeSessionStore: options?.materializeSessionStore,
		materializeWorkspace: options?.materializeWorkspace
	});
}
async function materializeLegacyAgentOwnershipForActiveChannelsResultAsync(...[config, legacyDefaultAgentId, env, manifestRecords, options]) {
	const ambientChannelIds = await listChannelIdsForOwnershipMigrationAsync({
		config,
		env,
		...manifestRecords ? { manifestRecords } : {}
	});
	return materializeLegacyDefaultAgentRoles(config, legacyDefaultAgentId, {
		ambientChannelIds,
		env,
		homedir: options?.homedir,
		materializeSessionStore: options?.materializeSessionStore,
		materializeWorkspace: options?.materializeWorkspace
	});
}
//#endregion
export { validateConfigObjectWithPluginsAsync as a, collectChannelSchemaMetadataCore as c, validateConfigObjectWithPlugins as i, collectPluginSchemaMetadataCore as l, materializeLegacyAgentOwnershipForActiveChannelsResultAsync as n, validateConfigObjectWithStrictFactsAsync as o, validateConfigObjectRawWithPlugins as r, resolveChannelSchemaSelection as s, materializeLegacyAgentOwnershipForActiveChannelsResult as t };
