import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { r as parseConcreteConfigPath } from "./dot-path-BSC76DAI.mjs";
import { p as isValidSecretRef } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { n as hasSensitiveUrlHintTag, o as redactSensitiveUrlLikeString, r as isSensitiveUrlConfigPath } from "./redact-sensitive-url-DspuXlEe.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-C9JZrwYv.mjs";
import { t as CHANNEL_IDS } from "./ids-NACrHrny.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { t as isSensitiveConfigPath } from "./sensitive-paths-CR94ndkx.mjs";
import { t as REDACTED_SENTINEL } from "./redact-sentinel-f_PhnHTI.mjs";
import { t as redactConfigObject } from "./redact-snapshot-uX3ICFnt.mjs";
import { c as resolveChannelSchemaSelection, l as collectChannelSchemaMetadataCore, u as collectPluginSchemaMetadataCore } from "./io.snapshot-preparation-E0KwwdW2.mjs";
import { _ as ChannelsSchema } from "./zod-schema-B-u3AXjg.mjs";
import { r as findWildcardHintMatch } from "./schema.shared-CcT3A7OF.mjs";
import { g as isReservedSystemAgentId } from "./agent-database-admission-BFwcs62N.mjs";
import { s as parseConfigSetValue } from "./config-cli-path-BmFvm17U.mjs";
import { i as isKernelOwnedChannelConfigKey, n as classifyConfigSchemaPathSegment, t as buildConfigSchemaCore } from "./schema-RpXu-eUV.mjs";
import { t as listAgentRoles } from "./agent-roles-DYbzEdi7.mjs";
import { r as isOpenClawTrustedPluginInstallSpec } from "./install-provenance-B846o7JY.mjs";
//#region src/system-agent/config-redaction.ts
const baseConfigSchema = buildConfigSchemaCore();
const SENSITIVE_CONFIG_CONTAINER_KEYS = /* @__PURE__ */ new Set(["env", "headers"]);
function collectUiHintPaths(uiHints, accept) {
	return Object.entries(uiHints).flatMap(([path, hint]) => {
		if (!path) return [];
		const parts = splitConfigHintPath(path);
		return accept(hint, parts) ? [parts] : [];
	});
}
const baseConfigRedactionMetadata = {
	schema: baseConfigSchema,
	uiHints: baseConfigSchema.uiHints,
	sensitiveHintPaths: collectUiHintPaths(baseConfigSchema.uiHints, (hint) => hint.sensitive === true || hasSensitiveUrlHintTag(hint)),
	wildcardHintPaths: collectUiHintPaths(baseConfigSchema.uiHints, (_hint, parts) => parts.includes("*")),
	pluginIds: /* @__PURE__ */ new Set(),
	channelIds: new Set(CHANNEL_IDS)
};
const invalidConfigRedactionMetadata = {
	...baseConfigRedactionMetadata,
	channelIds: /* @__PURE__ */ new Set()
};
const metadataConfigRedaction = /* @__PURE__ */ new WeakMap();
function resolveMetadataConfigRedaction(snapshot, config) {
	const byConfig = metadataConfigRedaction.get(snapshot) ?? /* @__PURE__ */ new WeakMap();
	const cached = byConfig.get(config ?? snapshot);
	if (cached) return cached;
	const plugins = collectPluginSchemaMetadataCore(snapshot.manifestRegistry);
	const channels = collectChannelSchemaMetadataCore(snapshot.manifestRegistry, config ? resolveChannelSchemaSelection(snapshot.manifestRegistry, config) : void 0);
	const schema = buildConfigSchemaCore({
		plugins,
		channels
	});
	const uiHints = schema.uiHints;
	const metadata = {
		schema,
		uiHints,
		sensitiveHintPaths: collectUiHintPaths(uiHints, (hint) => hint.sensitive === true || hasSensitiveUrlHintTag(hint)),
		wildcardHintPaths: collectUiHintPaths(uiHints, (_hint, parts) => parts.includes("*")),
		pluginIds: new Set(plugins.filter((plugin) => plugin.configSchema !== void 0).map((plugin) => normalizePluginPolicyId(plugin.id))),
		channelIds: /* @__PURE__ */ new Set([...CHANNEL_IDS, ...channels.filter((channel) => channel.configSchema !== void 0).map((channel) => channel.id)])
	};
	byConfig.set(config ?? snapshot, metadata);
	metadataConfigRedaction.set(snapshot, byConfig);
	return metadata;
}
function resolveSystemAgentConfigRedactionMetadata(source) {
	if (source?.valid === false) return invalidConfigRedactionMetadata;
	const config = source?.config ?? getRuntimeConfigSnapshot();
	if (!config) {
		const snapshot = getCurrentPluginMetadataSnapshot({
			env: process.env,
			allowWorkspaceScopedSnapshot: true,
			requireDefaultDiscoveryContext: true
		});
		return snapshot ? resolveMetadataConfigRedaction(snapshot) : baseConfigRedactionMetadata;
	}
	const snapshot = getCurrentPluginMetadataSnapshot({
		config,
		env: process.env,
		allowWorkspaceScopedSnapshot: true
	});
	return snapshot ? resolveMetadataConfigRedaction(snapshot, config) : baseConfigRedactionMetadata;
}
/** The same active schema owns both setting help and sensitive-value classification. */
function resolveSystemAgentConfigSchema() {
	return resolveSystemAgentConfigRedactionMetadata().schema;
}
function splitConfigHintPath(path) {
	return parseConcreteConfigPath(path.replace(/\[\]/g, "[*]"));
}
function resolveConfigUiHint(path, uiHints, includeAncestors = false, acceptHint) {
	return findWildcardHintMatch({
		uiHints,
		path: path.join("."),
		targetParts: path,
		splitPath: splitConfigHintPath,
		includeAncestors,
		acceptHint
	})?.hint ?? void 0;
}
function isUnknownDynamicOwnerPath(path, metadata) {
	const pluginId = path[2];
	if (path[0] === "plugins" && path[1] === "entries" && pluginId && path[3] === "config") return !metadata.pluginIds.has(normalizePluginPolicyId(pluginId));
	const channelId = path[1];
	if (path[0] === "channels" && channelId) return !(isKernelOwnedChannelConfigKey(channelId) || metadata.channelIds.has(channelId));
	return false;
}
function isDynamicOwnerIdSegment(path, index) {
	return path[0] === "channels" && index === 1 || path[0] === "plugins" && path[1] === "entries" && index === 2;
}
function hasSensitiveHintSegmentPrefix(path, index, metadata) {
	const segment = path[index];
	if (segment === void 0) return false;
	for (let end = 1; end < segment.length; end += 1) {
		const prefixPath = [...path.slice(0, index), segment.slice(0, end)];
		if (metadata.sensitiveHintPaths.some((hintPath) => matchesHintPath(hintPath, prefixPath))) return true;
	}
	return false;
}
function isKernelPassthroughSegment(path, index) {
	return path[0] === "hooks" && path[1] === "entries" && (index === 2 || index === 3) || path[0] === "talk" && path[1] === "providers" && (index === 2 || index === 3);
}
function isSchemaDynamicSegment(path, index, metadata) {
	if (path[0] === "channels" && path[1] === "modelByChannel" && (index === 2 || index === 3)) return true;
	if (isKernelPassthroughSegment(path, index)) return !hasSensitiveHintSegmentPrefix(path, index, metadata);
	const segment = path[index];
	if (segment === void 0) return false;
	const kind = classifyConfigSchemaPathSegment(metadata.schema, path.slice(0, index), segment);
	if (kind === "record-key" || kind === "array-index") return !hasSensitiveHintSegmentPrefix(path, index, metadata);
	if (kind === "invalid-record-key") return false;
	if (classifyConfigSchemaPathSegment(metadata.schema, path.slice(0, index), "0") === "array-index") return false;
	return metadata.wildcardHintPaths.some((hintParts) => hintParts[index] === "*" && hintParts.slice(index + 1).some((part) => part !== "*") && hintParts.slice(0, index).every((part, partIndex) => part === "*" || part === path[partIndex]));
}
function matchesHintPath(pattern, path) {
	return pattern.length === path.length && pattern.every((part, index) => part === "*" || part === path[index]);
}
function hasSensitiveConfigValue(path, value, metadata) {
	if (isUnknownDynamicOwnerPath(path, metadata)) return true;
	const { uiHints } = metadata;
	const canonicalPath = path.join(".");
	if (resolveConfigUiHint(path, uiHints, true, (candidate) => candidate.sensitive !== void 0)?.sensitive === true || isSensitiveConfigPath(canonicalPath)) return true;
	const hint = resolveConfigUiHint(path, uiHints);
	if (typeof value === "string" && (hasSensitiveUrlHintTag(hint) || isSensitiveUrlConfigPath(canonicalPath)) && redactSensitiveUrlLikeString(value) !== value) return true;
	if (Array.isArray(value)) return value.some((entry, index) => hasSensitiveConfigValue([...path, String(index)], entry, metadata));
	if (value && typeof value === "object") return Object.entries(value).some(([key, entry]) => hasSensitiveConfigValue([...path, key], entry, metadata));
	return false;
}
/** Return whether a config value must stay out of model-visible command text. */
function isSystemAgentSensitiveConfigValue(path, value) {
	let parsedPath;
	try {
		parsedPath = parseConcreteConfigPath(path);
	} catch {
		return true;
	}
	const parsedValue = typeof value === "string" ? parseConfigSetValue(value, false) : value;
	return hasSensitiveConfigValue(parsedPath, parsedValue, resolveSystemAgentConfigRedactionMetadata());
}
function isSensitiveConfigPathParts(path, metadata, includeAncestors = true) {
	const { uiHints } = metadata;
	const canonicalPath = path.join(".");
	if (resolveConfigUiHint(path, uiHints, includeAncestors, (candidate) => candidate.sensitive !== void 0)?.sensitive === true || isSensitiveConfigPath(canonicalPath)) return true;
	const hint = resolveConfigUiHint(path, uiHints);
	return hasSensitiveUrlHintTag(hint) || isSensitiveUrlConfigPath(canonicalPath);
}
function hasSensitiveSegmentPrefix(parsedPath, index, metadata) {
	const segment = parsedPath[index];
	if (segment === void 0) return false;
	for (let end = 1; end < segment.length; end += 1) {
		const prefixPath = [...parsedPath.slice(0, index), segment.slice(0, end)];
		const canonicalPath = prefixPath.join(".");
		if (isSensitiveConfigPath(canonicalPath) || isSensitiveUrlConfigPath(canonicalPath) || metadata.sensitiveHintPaths.some((hintPath) => matchesHintPath(hintPath, prefixPath))) return true;
	}
	return false;
}
function hasSensitiveContainerAssignment(path, index) {
	return SENSITIVE_CONFIG_CONTAINER_KEYS.has(path[index - 1] ?? "") && (path[index]?.includes("=") ?? false);
}
/** Redact unknown-owner paths and data appended after a sensitive key. */
function redactSystemAgentConfigPath(path) {
	try {
		const parsedPath = parseConcreteConfigPath(path);
		const metadata = resolveSystemAgentConfigRedactionMetadata();
		const hasSensitivePathData = parsedPath.some((segment, index) => hasSensitiveContainerAssignment(parsedPath, index) || !isDynamicOwnerIdSegment(parsedPath, index) && !isSchemaDynamicSegment(parsedPath, index, metadata) && (segment.includes("=") || !SENSITIVE_CONFIG_CONTAINER_KEYS.has(parsedPath[index - 1] ?? "") && hasSensitiveSegmentPrefix(parsedPath, index, metadata)) || index > 0 && !SENSITIVE_CONFIG_CONTAINER_KEYS.has(parsedPath[index - 1] ?? "") && isSensitiveConfigPathParts(parsedPath.slice(0, index), metadata));
		return isUnknownDynamicOwnerPath(parsedPath, metadata) || hasSensitivePathData ? "<redacted path>" : path;
	} catch {
		return "<redacted path>";
	}
}
/** Return whether a path segment embeds data after a sensitive config key. */
function isSystemAgentSensitiveConfigPathEmbedding(path) {
	let parsedPath;
	try {
		parsedPath = parseConcreteConfigPath(path);
	} catch {
		return true;
	}
	const metadata = resolveSystemAgentConfigRedactionMetadata();
	const unknownOwner = isUnknownDynamicOwnerPath(parsedPath, metadata);
	return parsedPath.some((segment, index) => {
		if (unknownOwner && segment.includes("=")) return true;
		if (hasSensitiveContainerAssignment(parsedPath, index)) return true;
		if (isDynamicOwnerIdSegment(parsedPath, index) || SENSITIVE_CONFIG_CONTAINER_KEYS.has(parsedPath[index - 1] ?? "") || isSchemaDynamicSegment(parsedPath, index, metadata)) return false;
		return segment.includes("=") || hasSensitiveSegmentPrefix(parsedPath, index, metadata);
	});
}
function redactUnknownDynamicOwners(value, metadata, invalidConfig) {
	if (!isRecord(value)) return value;
	let result = value;
	const plugins = isRecord(value.plugins) ? value.plugins : void 0;
	if (invalidConfig && Object.hasOwn(value, "plugins") && !plugins) result = {
		...result,
		plugins: REDACTED_SENTINEL
	};
	const entries = plugins && isRecord(plugins.entries) ? plugins.entries : void 0;
	if (invalidConfig && plugins && Object.hasOwn(plugins, "entries") && !entries) result = {
		...result,
		plugins: {
			...plugins,
			entries: REDACTED_SENTINEL
		}
	};
	if (entries) {
		let redactedEntries;
		for (const [pluginId, entry] of Object.entries(entries)) {
			if (!isRecord(entry) || !Object.hasOwn(entry, "config")) {
				if (invalidConfig) {
					redactedEntries ??= { ...entries };
					redactedEntries[pluginId] = REDACTED_SENTINEL;
				}
				continue;
			}
			if (metadata.pluginIds.has(normalizePluginPolicyId(pluginId))) continue;
			redactedEntries ??= { ...entries };
			redactedEntries[pluginId] = {
				...entry,
				config: REDACTED_SENTINEL
			};
		}
		if (redactedEntries) result = {
			...result,
			plugins: {
				...plugins,
				entries: redactedEntries
			}
		};
	}
	const channels = isRecord(value.channels) ? value.channels : void 0;
	if (invalidConfig && Object.hasOwn(value, "channels") && !channels) result = {
		...result,
		channels: REDACTED_SENTINEL
	};
	if (channels) {
		let redactedChannels;
		for (const [channelId, channelConfig] of Object.entries(channels)) {
			if (isKernelOwnedChannelConfigKey(channelId)) {
				if (invalidConfig) {
					redactedChannels ??= { ...channels };
					redactedChannels[channelId] = redactInvalidKernelChannelConfig(channelId, channelConfig);
				}
				continue;
			}
			if (metadata.channelIds.has(channelId)) continue;
			redactedChannels ??= { ...channels };
			redactedChannels[channelId] = REDACTED_SENTINEL;
		}
		if (redactedChannels) result = {
			...result,
			channels: redactedChannels
		};
	}
	return result;
}
function redactInvalidKernelChannelConfig(key, value) {
	if (key === "modelByChannel") return ChannelsSchema.safeParse({ modelByChannel: value }).success ? value : REDACTED_SENTINEL;
	if (key !== "defaults" || !isRecord(value)) return REDACTED_SENTINEL;
	return Object.fromEntries(Object.entries(value).map(([field, entry]) => [field, ChannelsSchema.safeParse({ defaults: { [field]: entry } }).success ? entry : REDACTED_SENTINEL]));
}
function replaceRedactionSentinels(value) {
	if (value === "__OPENCLAW_REDACTED__") return "<redacted>";
	if (Array.isArray(value)) return value.map(replaceRedactionSentinels);
	if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, replaceRedactionSentinels(entry)]));
	return value;
}
/** Redact a config object before any subtree is projected into a model-visible result. */
function redactSystemAgentConfig(value, source) {
	const metadata = resolveSystemAgentConfigRedactionMetadata(source);
	return replaceRedactionSentinels(redactConfigObject(redactUnknownDynamicOwners(value, metadata, source?.valid === false), metadata.uiHints));
}
//#endregion
//#region src/system-agent/operations-internal.ts
const INVALID_CONFIG_SET_MESSAGE = "Invalid config path. Check its quoting or escaping and try again.";
function isInvalidConfigSetOperation(operation) {
	return operation.kind === "none" && operation.message === "Invalid config path. Check its quoting or escaping and try again.";
}
//#endregion
//#region src/system-agent/plugin-install-spec.ts
function validateSystemAgentPluginInstallSpec(spec) {
	const trimmed = spec.trim();
	if (!trimmed) return "Plugin install spec is required.";
	if (/\s/.test(trimmed)) return "OpenClaw plugin install accepts one npm or ClawHub package spec.";
	if (/^(?:\.{1,2}\/|\/|~\/|file:|git(?:\+ssh|\+https)?:|https?:)/i.test(trimmed)) return "OpenClaw plugin install accepts npm or ClawHub package specs only.";
	if (!isOpenClawTrustedPluginInstallSpec(trimmed)) return "OpenClaw installs only ClawHub, bundled, or official-catalog plugins. Use `openclaw plugins install <spec>` in a trusted shell to review an arbitrary executable source.";
	return null;
}
//#endregion
//#region src/system-agent/operations-parse.ts
const ARG_WORD = String.raw`(?:"[^"]+"|'[^']+'|\S+)`;
const CONFIG_SET_PREFIX_RE = /^(?:config\s+set|set\s+config)\s+/i;
const CONFIG_SET_REF_PREFIX_RE = /^(?:config\s+set-ref|set\s+secretref|set\s+secret\s+ref)\s+/i;
const CONFIG_GET_PREFIX_RE = /^config\s+get(?=\s|$)/i;
const CONFIG_SCHEMA_PREFIX_RE = /^config\s+schema(?=\s|$)/i;
const CONFIG_SET_REF_ARGS_RE = new RegExp(String.raw`^(?:(?<source>env|file|exec|store)\s+)?(?<id>\S+)(?:\s+provider\s+(?<provider>[A-Za-z0-9_-]+))?$`, "i");
const SETUP_RE = new RegExp(String.raw`^(?:setup|set\s+me\s+up|set\s+up\s+openclaw|onboard(?:\s+me)?|bootstrap|first\s+run)(?:\s+workspace\s+(?<workspace>${ARG_WORD}))?(?:\s+model\s+(?<model>\S+))?$`, "i");
const MODEL_SETUP_RE = new RegExp(String.raw`^(?:configure\s+(?:a\s+)?model\s+provider|set\s*up\s+(?:a\s+)?model\s+provider|model\s+setup)(?:\s+workspace\s+(?<workspace>${ARG_WORD}))?$`, "i");
const CREATE_AGENT_RE = new RegExp(String.raw`^(?:create|add|set\s*up|new)\s+(?:(?:an?|new|my)\s+)?agent\s+(?<agent>[a-z0-9_-]+)(?:\s+name\s+(?<name>${ARG_WORD}))?(?:\s+role\s+(?<role>\S+))?(?:\s+purpose\s+(?<purpose>${ARG_WORD}))?(?:\s+workspace\s+(?<workspace>${ARG_WORD}))?(?:\s+model\s+(?<model>\S+))?$`, "i");
const CREATE_TEAM_RE = new RegExp(String.raw`^create\s+team(?:\s+coordinator\s+(?<coordinatorId>\S+))?(?:\s+prefix\s+(?<prefix>\S+))?(?:\s+workspace\s+(?<workspaceRoot>${ARG_WORD}))?$`, "i");
const TALK_AGENT_RE = new RegExp(String.raw`^(?:talk\s+to|switch\s+to|open|enter)\s+(?:(?:my|the)\s+)?(?:(?<agent>[a-z0-9_-]+)\s+)?agent(?:\s+(?:for|in|workspace)\s+(?<workspace>${ARG_WORD}))?$`, "i");
const SET_MODEL_RE = /^(?:set|configure|use)\s+(?:the\s+)?(?:default\s+)?models?\s+(?<model>\S+)(?:\s+for\s+agent\s+(?<agent>\S+))?$/i;
const GATEWAY_RE = /^(?:gateway\s+(?<sub>status|start|stop|restart)|(?<verb>start|stop|restart)\s+(?:the\s+)?gateway)$/i;
const PLUGIN_LIST_RE = /^(?:(?:plugins?|clawhub)\s+list|list\s+plugins?)$/i;
const PLUGIN_SEARCH_RE = /^(?:(?:plugins?|clawhub)\s+search|search\s+plugins?(?:\s+for)?)\s+(?<query>.+)$/i;
const PLUGIN_INSTALL_RE = /^(?:plugins?\s+install|install\s+(?:(?<source>npm|clawhub)\s+)?plugins?)\s+(?<spec>\S+)$/i;
const PLUGIN_UNINSTALL_RE = /^(?:plugins?\s+(?:uninstall|remove)|(?:uninstall|remove)\s+plugins?)\s+(?<pluginId>[A-Za-z0-9_.@/-]+)$/i;
const CHANNEL_LIST_RE = /^(?:channels|list\s+channels|show\s+channels)$/i;
const CHANNEL_CONNECT_RE = /^(?:connect|link)\s+(?:channel\s+)?(?:to\s+)?(?<channel>[a-z0-9_-]+)(?:\s+channel)?$/i;
const CHANNEL_INFO_RE = /^(?:channel\s+info\s+(?<channel>[a-z0-9_-]+)|about\s+(?<aboutChannel>[a-z0-9_-]+)\s+channel)$/i;
const SKILLS_SETUP_RE = /^(?:configure|set\s*up|setup)\s+skills$/i;
const SEARCH_SETUP_RE = /^(?:(?:configure|set\s*up|setup)\s+(?:web\s+)?search|(?:web\s+)?search\s+provider\s+setup)$/i;
const GATEWAY_CONFIG_SETUP_RE = /^(?:configure\s+gateway|set\s*up\s+gateway|gateway\s+settings)$/i;
const MEMORY_IMPORT_RE = /^(?:import\s+memor(?:y|ies)|memory\s+import)$/i;
const OPEN_GUIDED_SETUP_RE = /^(?:open\s+setup\s+wizard|setup\s+wizard|menu\s+setup|use\s+the\s+(?:setup\s+)?wizard)$/i;
const OPEN_CLASSIC_SETUP_RE = /^(?:open\s+classic(?:\s+setup)?\s+wizard|classic\s+setup)$/i;
const OPEN_CHANNEL_SETUP_RE = /^open\s+channel\s+wizard(?:\s+for\s+(?<channel>[a-z0-9_-]+))?$/i;
const OPEN_SEARCH_SETUP_RE = /^open\s+(?:web\s+)?search\s+wizard$/i;
const OPEN_GATEWAY_SETUP_RE = /^open\s+gateway\s+wizard$/i;
const NO_MATCH_MESSAGE = "I can run doctor/status/health, check or restart Gateway, configure gateway settings, list agents/models, configure skills or web search, import memory, set default model, connect channels (`connect telegram`), show `channel info <channel>`, open the setup wizard, show audit, or switch to your agent TUI.";
function normalizeExplicitSystemAgentId(agentId) {
	const normalized = normalizeAgentIdStrict(agentId);
	return normalized.ok ? normalized.value : agentId;
}
function parseConfigSetCommand(input) {
	const prefix = input.match(CONFIG_SET_PREFIX_RE)?.[0];
	if (!prefix) return;
	const body = input.slice(prefix.length);
	for (const separator of body.matchAll(/\s+/gu)) {
		const path = body.slice(0, separator.index);
		const value = body.slice(separator.index).trim();
		if (!value) continue;
		try {
			parseConcreteConfigPath(path);
			if (isSystemAgentSensitiveConfigPathEmbedding(path)) return { valid: false };
			return {
				path,
				value,
				valid: true
			};
		} catch {
			continue;
		}
	}
	return body.trim() ? { valid: false } : void 0;
}
function parseConfigReadPath(input, prefixPattern, options) {
	const prefix = input.match(prefixPattern)?.[0];
	if (!prefix) return;
	const path = input.slice(prefix.length).trim();
	if (!path) return options.allowEmpty ? { valid: true } : { valid: false };
	if (options.allowRoot && path === ".") return {
		path,
		valid: true
	};
	try {
		parseConcreteConfigPath(path);
		return isSystemAgentSensitiveConfigPathEmbedding(path) ? { valid: false } : {
			path,
			valid: true
		};
	} catch {
		return { valid: false };
	}
}
function parseConfigSetRefCommand(input) {
	const prefix = input.match(CONFIG_SET_REF_PREFIX_RE)?.[0];
	if (!prefix) return;
	const body = input.slice(prefix.length);
	for (const separator of body.matchAll(/\s+/gu)) {
		const path = body.slice(0, separator.index);
		const args = body.slice(separator.index).trim().match(CONFIG_SET_REF_ARGS_RE);
		if (!args?.groups?.id) continue;
		try {
			parseConcreteConfigPath(path);
			if (isSystemAgentSensitiveConfigPathEmbedding(path)) return { valid: false };
		} catch {
			continue;
		}
		const source = args.groups.source?.toLowerCase() ?? "env";
		const id = args.groups.id.trim();
		const provider = args.groups.provider ?? "default";
		if (!isValidSecretRef({
			source,
			provider,
			id
		})) return { valid: false };
		return {
			path,
			source,
			id,
			...args.groups.provider ? { provider: args.groups.provider } : {},
			valid: true
		};
	}
	return body.trim() ? { valid: false } : void 0;
}
/**
* Parse one user command into OpenClaw's closed operation union. Anything
* that does not match the anchored grammar exactly returns kind "none" so the
* caller can route it to the system agent (or show guidance).
*/
function parseSystemAgentOperation(input) {
	const trimmed = input.trim();
	const lower = trimmed.toLowerCase();
	if (!trimmed) return {
		kind: "none",
		message: "Tiny claw tap: say status, doctor, models, agents, or talk to agent."
	};
	if ([
		"help",
		"?",
		"overview",
		"system"
	].includes(lower)) return { kind: "overview" };
	switch (lower) {
		case "audit":
		case "audit log":
		case "show audit": return { kind: "audit" };
		case "status": return { kind: "status" };
		case "health": return { kind: "health" };
		case "doctor": return { kind: "doctor" };
		case "doctor fix":
		case "doctor repair": return { kind: "doctor-fix" };
		case "config validate":
		case "validate config": return { kind: "config-validate" };
		case "agents":
		case "list agents": return { kind: "agents" };
		case "models":
		case "list models": return { kind: "models" };
		case "model accounts":
		case "personal model accounts":
		case "manage model accounts": return { kind: "model-accounts" };
		case "tui":
		case "open tui":
		case "chat": return { kind: "open-tui" };
		case "quit":
		case "exit": return {
			kind: "none",
			message: "OpenClaw retracts into shell. Bye."
		};
	}
	const configSetRef = parseConfigSetRefCommand(trimmed);
	if (configSetRef?.valid) return {
		kind: "config-set-ref",
		path: configSetRef.path,
		source: configSetRef.source,
		id: configSetRef.id,
		...configSetRef.provider ? { provider: configSetRef.provider } : {}
	};
	if (configSetRef && !configSetRef.valid) return {
		kind: "none",
		message: INVALID_CONFIG_SET_MESSAGE
	};
	const configSet = parseConfigSetCommand(trimmed);
	if (configSet) {
		if (!configSet.valid) return {
			kind: "none",
			message: INVALID_CONFIG_SET_MESSAGE
		};
		return {
			kind: "config-set",
			path: configSet.path,
			value: configSet.value
		};
	}
	const configGet = parseConfigReadPath(trimmed, CONFIG_GET_PREFIX_RE, { allowEmpty: false });
	if (configGet?.valid && configGet.path) return {
		kind: "config-get",
		path: configGet.path
	};
	if (configGet && !configGet.valid) return {
		kind: "none",
		message: INVALID_CONFIG_SET_MESSAGE
	};
	const configSchema = parseConfigReadPath(trimmed, CONFIG_SCHEMA_PREFIX_RE, {
		allowEmpty: true,
		allowRoot: true
	});
	if (configSchema?.valid) return {
		kind: "config-schema",
		...configSchema.path ? { path: configSchema.path } : {}
	};
	if (configSchema && !configSchema.valid) return {
		kind: "none",
		message: INVALID_CONFIG_SET_MESSAGE
	};
	if (PLUGIN_LIST_RE.test(trimmed)) return { kind: "plugin-list" };
	const pluginSearchMatch = trimmed.match(PLUGIN_SEARCH_RE);
	if (pluginSearchMatch?.groups?.query?.trim()) return {
		kind: "plugin-search",
		query: pluginSearchMatch.groups.query.trim()
	};
	const pluginInstallMatch = trimmed.match(PLUGIN_INSTALL_RE);
	if (pluginInstallMatch?.groups?.spec?.trim()) {
		const spec = normalizePluginInstallSpec(pluginInstallMatch.groups.spec.trim(), pluginInstallMatch.groups.source);
		const validationError = validateSystemAgentPluginInstallSpec(spec);
		if (validationError) return {
			kind: "none",
			message: validationError
		};
		return {
			kind: "plugin-install",
			spec
		};
	}
	const pluginUninstallMatch = trimmed.match(PLUGIN_UNINSTALL_RE);
	if (pluginUninstallMatch?.groups?.pluginId?.trim()) return {
		kind: "plugin-uninstall",
		pluginId: pluginUninstallMatch.groups.pluginId.trim()
	};
	if (CHANNEL_LIST_RE.test(trimmed)) return { kind: "channel-list" };
	const channelInfoMatch = trimmed.match(CHANNEL_INFO_RE);
	const channelInfo = channelInfoMatch?.groups?.channel ?? channelInfoMatch?.groups?.aboutChannel;
	if (channelInfo) return {
		kind: "channel-info",
		channel: channelInfo.toLowerCase()
	};
	const channelConnectMatch = trimmed.match(CHANNEL_CONNECT_RE);
	if (channelConnectMatch?.groups?.channel) return {
		kind: "channel-setup",
		channel: channelConnectMatch.groups.channel.toLowerCase()
	};
	if (SKILLS_SETUP_RE.test(trimmed)) return { kind: "skills-setup" };
	if (SEARCH_SETUP_RE.test(trimmed)) return { kind: "search-setup" };
	if (GATEWAY_CONFIG_SETUP_RE.test(trimmed)) return { kind: "gateway-config-setup" };
	if (MEMORY_IMPORT_RE.test(trimmed)) return { kind: "memory-import" };
	const modelSetupMatch = trimmed.match(MODEL_SETUP_RE);
	if (modelSetupMatch) {
		const workspace = trimShellishToken(modelSetupMatch.groups?.workspace);
		return {
			kind: "model-setup",
			...workspace ? { workspace } : {}
		};
	}
	if (OPEN_GUIDED_SETUP_RE.test(trimmed)) return {
		kind: "open-setup",
		target: "guided"
	};
	if (OPEN_CLASSIC_SETUP_RE.test(trimmed)) return {
		kind: "open-setup",
		target: "classic"
	};
	const openChannelSetupMatch = trimmed.match(OPEN_CHANNEL_SETUP_RE);
	if (openChannelSetupMatch) {
		const channel = openChannelSetupMatch.groups?.channel?.toLowerCase();
		return {
			kind: "open-setup",
			target: "channels",
			...channel ? { channel } : {}
		};
	}
	if (OPEN_SEARCH_SETUP_RE.test(trimmed)) return {
		kind: "open-setup",
		target: "search"
	};
	if (OPEN_GATEWAY_SETUP_RE.test(trimmed)) return {
		kind: "open-setup",
		target: "gateway"
	};
	const setupMatch = trimmed.match(SETUP_RE);
	if (setupMatch) {
		const workspace = trimShellishToken(setupMatch.groups?.workspace);
		const model = setupMatch.groups?.model;
		return {
			kind: "setup",
			...workspace ? { workspace } : {},
			...model ? { model } : {}
		};
	}
	const gatewayMatch = trimmed.match(GATEWAY_RE);
	if (gatewayMatch) {
		const action = (gatewayMatch.groups?.sub ?? gatewayMatch.groups?.verb ?? "").toLowerCase();
		if (action === "start") return { kind: "gateway-start" };
		if (action === "stop") return { kind: "gateway-stop" };
		if (action === "restart") return { kind: "gateway-restart" };
		return { kind: "gateway-status" };
	}
	const createMatch = trimmed.match(CREATE_AGENT_RE);
	if (createMatch?.groups?.agent) {
		const role = listAgentRoles().find((candidate) => candidate === createMatch.groups?.role);
		if (createMatch.groups.role && !role) return {
			kind: "none",
			message: `Unknown agent role. Choose ${listAgentRoles().join(", ")}.`
		};
		const workspace = trimShellishToken(createMatch.groups.workspace);
		const name = trimShellishToken(createMatch.groups.name);
		const purpose = trimShellishToken(createMatch.groups.purpose);
		const model = createMatch.groups.model;
		return {
			kind: "create-agent",
			agentId: normalizeExplicitSystemAgentId(createMatch.groups.agent),
			...name ? { name } : {},
			...purpose ? { purpose } : {},
			...role ? { role } : {},
			...workspace ? { workspace } : {},
			...model ? { model } : {}
		};
	}
	const teamMatch = trimmed.match(CREATE_TEAM_RE);
	if (teamMatch) {
		const coordinatorId = teamMatch.groups?.coordinatorId;
		const prefix = teamMatch.groups?.prefix;
		const workspaceRoot = trimShellishToken(teamMatch.groups?.workspaceRoot);
		return {
			kind: "create-team",
			...coordinatorId ? { coordinatorId } : {},
			...prefix ? { prefix } : {},
			...workspaceRoot ? { workspaceRoot } : {}
		};
	}
	const talkMatch = trimmed.match(TALK_AGENT_RE);
	if (talkMatch) {
		const workspace = trimShellishToken(talkMatch.groups?.workspace);
		return {
			kind: "open-tui",
			...talkMatch.groups?.agent ? { agentId: talkMatch.groups.agent } : {},
			...workspace ? { workspace } : {}
		};
	}
	const setModelMatch = trimmed.match(SET_MODEL_RE);
	if (setModelMatch?.groups?.model) {
		const agent = setModelMatch.groups.agent?.trim();
		return {
			kind: "set-default-model",
			model: setModelMatch.groups.model,
			...agent ? { agentId: normalizeExplicitSystemAgentId(agent) } : {}
		};
	}
	return {
		kind: "none",
		message: NO_MATCH_MESSAGE
	};
}
function trimShellishToken(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	if (trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1).trim() || void 0;
	return trimmed;
}
function normalizePluginInstallSpec(spec, source) {
	const trimmed = spec.trim();
	const normalizedSource = source?.toLowerCase();
	if (normalizedSource === "npm" && !trimmed.toLowerCase().startsWith("npm:")) return `npm:${trimmed}`;
	if (normalizedSource === "clawhub" && !trimmed.toLowerCase().startsWith("clawhub:")) return `clawhub:${trimmed}`;
	return trimmed;
}
/**
* Return whether an operation can change local state or process lifecycle.
* Guided setup operations are intentionally absent: starting a wizard is not
* itself a write; the wizard owns approval and persistence for its answers.
*/
function isPersistentSystemAgentOperation(operation) {
	return operation.kind === "set-default-model" || operation.kind === "config-set" || operation.kind === "config-set-ref" || operation.kind === "setup" || operation.kind === "plugin-install" || operation.kind === "plugin-activate-artifact" || operation.kind === "plugin-uninstall" || operation.kind === "create-team" || operation.kind === "create-agent" && !operation.model?.trim() && !isReservedSystemAgentId(operation.agentId) || operation.kind === "gateway-start" || operation.kind === "gateway-stop" || operation.kind === "gateway-restart";
}
/** Format a user-facing description for an operation requiring approval. */
function describeSystemAgentPersistentOperation(operation) {
	switch (operation.kind) {
		case "set-default-model": return operation.agentId ? `set agent ${operation.agentId}'s model to ${operation.model}` : `set agents.defaults.model.primary to ${operation.model}`;
		case "config-set": return `set config ${redactSystemAgentConfigPath(operation.path)} to ${formatConfigSetValueForPlan(operation.path, operation.value)}`;
		case "config-set-ref": return `set config ${redactSystemAgentConfigPath(operation.path)} to ${operation.source} SecretRef <redacted>`;
		case "setup": return formatSetupPlanDescription(operation);
		case "model-setup": return "configure a model provider and default model";
		case "doctor-fix": return "run openclaw doctor --fix on the machine running OpenClaw, with OpenClaw stopped";
		case "plugin-install": return `install plugin ${operation.spec}`;
		case "plugin-activate-artifact": return `install the trusted plugin artifact ${operation.path} (SHA256 ${operation.sha256}), including its declared capabilities and native UI; restart the Gateway to load it`;
		case "plugin-uninstall": return `uninstall plugin ${operation.pluginId}`;
		case "create-agent": return [
			`create agent ${operation.agentId} with workspace ${formatCreateAgentWorkspace(operation.workspace)}`,
			operation.name ? `name: ${JSON.stringify(operation.name)}` : void 0,
			operation.purpose ? `purpose: ${JSON.stringify(operation.purpose)}` : void 0,
			operation.role ? `role: ${operation.role === "coordinator" ? "Chief of staff" : operation.role.charAt(0).toUpperCase() + operation.role.slice(1)}` : void 0,
			operation.requesterAgentId ? `requested by agent ${operation.requesterAgentId}` : void 0
		].filter(Boolean).join(", ");
		case "create-team": return [
			"create team of 4: chief of staff, researcher, writer, reviewer",
			operation.coordinatorId ? `coordinator id: ${operation.coordinatorId}` : void 0,
			operation.prefix ? `prefix: ${operation.prefix}` : void 0,
			operation.workspaceRoot ? `workspace root: ${shortenHomePath(resolveUserPath(operation.workspaceRoot))}` : void 0
		].filter(Boolean).join(", ");
		case "gateway-start": return "start the Gateway";
		case "gateway-stop": return "stop the Gateway";
		case "gateway-restart": return "restart the Gateway";
		default: return "apply this action";
	}
}
const SYSTEM_AGENT_OPERATOR_APPROVAL_HANDOFF = "The host applies the requesting session's permission policy to this exact proposal and returns the final outcome. Do not request conversational approval or claim the change was applied before that outcome.";
const SYSTEM_AGENT_OPERATOR_NAVIGATION_HANDOFF = "Channel, model, and setup flows need a human operator in the OpenClaw app; they cannot run from a delegated agent request. Open `openclaw dashboard` or run `openclaw setup` on the Gateway host.";
/** Format the standard approval plan text for a persistent operation. */
function formatSystemAgentPersistentPlan(operation, operatorApprovalOnly = false) {
	const description = describeSystemAgentPersistentOperation(operation);
	return operatorApprovalOnly ? `Proposed: ${description}.\n\n${SYSTEM_AGENT_OPERATOR_APPROVAL_HANDOFF}` : `Plan: ${description}. Say yes to apply.`;
}
function formatCreateAgentWorkspace(workspace) {
	return workspace ? shortenHomePath(resolveUserPath(workspace)) : "the default for this agent";
}
function formatConfigSetValueForPlan(configPath, value) {
	if (isSystemAgentSensitiveConfigValue(configPath, value)) return "<redacted>";
	return value;
}
function formatSetupPlanDescription(operation) {
	return `bootstrap OpenClaw setup for workspace ${shortenHomePath(resolveUserPath(operation.workspace ?? process.cwd()))}`;
}
//#endregion
export { isPersistentSystemAgentOperation as a, isInvalidConfigSetOperation as c, redactSystemAgentConfigPath as d, resolveSystemAgentConfigSchema as f, formatSystemAgentPersistentPlan as i, isSystemAgentSensitiveConfigValue as l, SYSTEM_AGENT_OPERATOR_NAVIGATION_HANDOFF as n, parseSystemAgentOperation as o, describeSystemAgentPersistentOperation as r, validateSystemAgentPluginInstallSpec as s, SYSTEM_AGENT_OPERATOR_APPROVAL_HANDOFF as t, redactSystemAgentConfig as u };
