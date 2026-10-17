import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as parseConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { n as hasSensitiveUrlHintTag, o as redactSensitiveUrlLikeString, r as isSensitiveUrlConfigPath } from "./redact-sensitive-url-BnHakqqk.mjs";
import { p as isValidSecretRef } from "./ref-contract-D0kWy5jy.mjs";
import "./types.secrets-DsPRn9Dz.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as REDACTED_SENTINEL } from "./redact-sentinel-f_PhnHTI.mjs";
import { t as redactConfigObject } from "./redact-snapshot-Ds6C-7Ba.mjs";
import { t as isSensitiveConfigPath } from "./sensitive-paths-CieLU95K.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { t as CHANNEL_IDS } from "./ids-BFfFS5ep.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { d as ChannelsSchema } from "./zod-schema-B-D6bTAy.mjs";
import { n as findWildcardHintMatch } from "./schema.shared-BX8DvRf8.mjs";
import { c as collectPluginSchemaMetadataCore, o as resolveChannelSchemaSelection, s as collectChannelSchemaMetadataCore } from "./validation-BeAnc62d.mjs";
import { x as isReservedSystemAgentId } from "./agent-database-admission-dWNS6Rcs.mjs";
import { t as isKernelOwnedChannelConfigKey } from "./channel-config-keys-BnrRghOb.mjs";
import { s as parseConfigSetValue } from "./config-cli-path-Dh9BCpH3.mjs";
import { n as classifyConfigSchemaPathSegment, t as buildConfigSchemaCore } from "./schema-BBhEexxB.mjs";
import { t as listAgentRoles } from "./agent-roles-DcAkXaUx.mjs";
import { r as isOpenClawTrustedPluginInstallSpec } from "./install-provenance-3ui8s0BN.mjs";
//#region src/system-agent/config-redaction.ts
const SENSITIVE_CONFIG_CONTAINER_KEYS = /* @__PURE__ */ new Set(["env", "headers"]);
function collectUiHintPaths(uiHints, accept) {
	return Object.entries(uiHints).flatMap(([path, hint]) => {
		if (!path) return [];
		const parts = splitConfigHintPath(path);
		return accept(hint, parts) ? [parts] : [];
	});
}
let baseConfigRedactionMetadata;
let invalidConfigRedactionMetadata;
function getBaseConfigRedactionMetadata() {
	if (baseConfigRedactionMetadata) return baseConfigRedactionMetadata;
	const schema = buildConfigSchemaCore();
	baseConfigRedactionMetadata = {
		schema,
		uiHints: schema.uiHints,
		sensitiveHintPaths: collectUiHintPaths(schema.uiHints, (hint) => hint.sensitive === true || hasSensitiveUrlHintTag(hint)),
		wildcardHintPaths: collectUiHintPaths(schema.uiHints, (_hint, parts) => parts.includes("*")),
		pluginIds: /* @__PURE__ */ new Set(),
		channelIds: new Set(CHANNEL_IDS)
	};
	return baseConfigRedactionMetadata;
}
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
	if (source?.valid === false) return invalidConfigRedactionMetadata ??= {
		...getBaseConfigRedactionMetadata(),
		channelIds: /* @__PURE__ */ new Set()
	};
	const config = source?.config ?? getRuntimeConfigSnapshot();
	if (!config) {
		const snapshot = getCurrentPluginMetadataSnapshot({
			env: process.env,
			allowWorkspaceScopedSnapshot: true,
			requireDefaultDiscoveryContext: true
		});
		return snapshot ? resolveMetadataConfigRedaction(snapshot) : getBaseConfigRedactionMetadata();
	}
	const snapshot = getCurrentPluginMetadataSnapshot({
		config,
		env: process.env,
		allowWorkspaceScopedSnapshot: true
	});
	return snapshot ? resolveMetadataConfigRedaction(snapshot, config) : getBaseConfigRedactionMetadata();
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
function isKernelPassthroughSegment(path, index) {
	return path[0] === "hooks" && path[1] === "entries" && (index === 2 || index === 3) || path[0] === "talk" && path[1] === "providers" && (index === 2 || index === 3);
}
function isSchemaDynamicSegment(path, index, metadata) {
	if (path[0] === "channels" && path[1] === "modelByChannel" && (index === 2 || index === 3)) return true;
	if (isKernelPassthroughSegment(path, index)) return !hasSensitiveSegmentPrefix(path, index, metadata, true);
	const segment = path[index];
	if (segment === void 0) return false;
	const kind = classifyConfigSchemaPathSegment(metadata.schema, path.slice(0, index), segment);
	if (kind === "record-key" || kind === "array-index") return !hasSensitiveSegmentPrefix(path, index, metadata, true);
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
function hasSensitiveSegmentPrefix(parsedPath, index, metadata, hintsOnly = false) {
	const segment = parsedPath[index];
	if (segment === void 0) return false;
	for (let end = 1; end < segment.length; end += 1) {
		const prefixPath = [...parsedPath.slice(0, index), segment.slice(0, end)];
		const canonicalPath = prefixPath.join(".");
		if (!hintsOnly && (isSensitiveConfigPath(canonicalPath) || isSensitiveUrlConfigPath(canonicalPath)) || metadata.sensitiveHintPaths.some((hintPath) => matchesHintPath(hintPath, prefixPath))) return true;
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
const CONFIG_UNSET_PREFIX_RE = /^config\s+unset(?=\s|$)/i;
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
const PLUGIN_SEARCH_RE = /^(?:(?:plugins?|clawhub)\s+search|search\s+plugins?(?:\s+for)?)\s+(?<query>.+)$/i;
const PLUGIN_INSTALL_RE = /^(?:plugins?\s+install|install\s+(?:(?<source>npm|clawhub)\s+)?plugins?)\s+(?<spec>\S+)$/i;
const PLUGIN_UNINSTALL_RE = /^(?:plugins?\s+(?:uninstall|remove)|(?:uninstall|remove)\s+plugins?)\s+(?<pluginId>[A-Za-z0-9_.@/-]+)$/i;
const CHANNEL_CONNECT_RE = /^(?:connect|link)\s+(?:channel\s+)?(?:to\s+)?(?<channel>[a-z0-9_-]+)(?:\s+channel)?$/i;
const CHANNEL_INFO_RE = /^(?:channel\s+info\s+(?<channel>[a-z0-9_-]+)|about\s+(?<aboutChannel>[a-z0-9_-]+)\s+channel)$/i;
const OPEN_CHANNEL_SETUP_RE = /^open\s+channel\s+wizard(?:\s+for\s+(?<channel>[a-z0-9_-]+))?$/i;
const NO_MATCH_MESSAGE = "I can run doctor/status/health, check or restart Gateway, configure gateway settings, list agents/models, configure skills or web search, import memory, set default model, connect channels (`connect telegram`), show `channel info <channel>`, open the setup wizard, show audit, or switch to your agent TUI.";
const SIMPLE_COMMANDS = [
	[[
		"help",
		"?",
		"overview",
		"system"
	], { kind: "overview" }],
	[[
		"audit",
		"audit log",
		"show audit"
	], { kind: "audit" }],
	[["status"], { kind: "status" }],
	[["health"], { kind: "health" }],
	[["doctor"], { kind: "doctor" }],
	[["doctor fix", "doctor repair"], { kind: "doctor-fix" }],
	[["config validate", "validate config"], { kind: "config-validate" }],
	[["agents", "list agents"], { kind: "agents" }],
	[["models", "list models"], { kind: "models" }],
	[[
		"model accounts",
		"personal model accounts",
		"manage model accounts"
	], { kind: "model-accounts" }],
	[[
		"tui",
		"open tui",
		"chat"
	], { kind: "open-tui" }],
	[["quit", "exit"], {
		kind: "none",
		message: "OpenClaw retracts into shell. Bye."
	}],
	[/^(?:(?:plugins?|clawhub)\s+list|list\s+plugins?)$/i, { kind: "plugin-list" }],
	[/^(?:channels|list\s+channels|show\s+channels)$/i, { kind: "channel-list" }],
	[/^(?:configure|set\s*up|setup)\s+skills$/i, { kind: "skills-setup" }],
	[/^(?:(?:configure|set\s*up|setup)\s+(?:web\s+)?search|(?:web\s+)?search\s+provider\s+setup)$/i, { kind: "search-setup" }],
	[/^(?:configure\s+gateway|set\s*up\s+gateway|gateway\s+settings)$/i, { kind: "gateway-config-setup" }],
	[/^(?:import\s+memor(?:y|ies)|memory\s+import)$/i, { kind: "memory-import" }],
	[/^(?:open\s+setup\s+wizard|setup\s+wizard|menu\s+setup|use\s+the\s+(?:setup\s+)?wizard)$/i, {
		kind: "open-setup",
		target: "guided"
	}],
	[/^(?:open\s+classic(?:\s+setup)?\s+wizard|classic\s+setup)$/i, {
		kind: "open-setup",
		target: "classic"
	}],
	[/^open\s+(?:web\s+)?search\s+wizard$/i, {
		kind: "open-setup",
		target: "search"
	}],
	[/^open\s+gateway\s+wizard$/i, {
		kind: "open-setup",
		target: "gateway"
	}]
];
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
			if (isSystemAgentSensitiveConfigPathEmbedding(path)) return {
				kind: "none",
				message: INVALID_CONFIG_SET_MESSAGE
			};
			return {
				kind: "config-set",
				path,
				value
			};
		} catch {
			continue;
		}
	}
	return body.trim() ? {
		kind: "none",
		message: INVALID_CONFIG_SET_MESSAGE
	} : void 0;
}
function parseConfigReadCommand(input, kind, prefixPattern) {
	const prefix = input.match(prefixPattern)?.[0];
	if (!prefix) return;
	const path = input.slice(prefix.length).trim();
	if (kind === "config-schema" && (!path || path === ".")) return {
		kind,
		...path ? { path } : {}
	};
	try {
		if (path) {
			parseConcreteConfigPath(path);
			if (!isSystemAgentSensitiveConfigPathEmbedding(path)) return {
				kind,
				path
			};
		}
	} catch {}
	return {
		kind: "none",
		message: INVALID_CONFIG_SET_MESSAGE
	};
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
			if (isSystemAgentSensitiveConfigPathEmbedding(path)) return {
				kind: "none",
				message: INVALID_CONFIG_SET_MESSAGE
			};
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
		})) return {
			kind: "none",
			message: INVALID_CONFIG_SET_MESSAGE
		};
		return {
			kind: "config-set-ref",
			path,
			source,
			id,
			...args.groups.provider ? { provider: args.groups.provider } : {}
		};
	}
	return body.trim() ? {
		kind: "none",
		message: INVALID_CONFIG_SET_MESSAGE
	} : void 0;
}
/** Stable name prefix; the secret-store writer allocates a fresh entry for every save. */
function secretStoreNameForConfigPath(path) {
	return (parseConcreteConfigPath(path).join("_").replace(/([a-z0-9])([A-Z])/gu, "$1_$2").toUpperCase().replace(/[^A-Z0-9_]+/gu, "_").replace(/^[^A-Z]+/u, "") || "OPENCLAW_SECRET").slice(0, 128);
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
	for (const [commands, operation] of SIMPLE_COMMANDS) if (commands instanceof RegExp ? commands.test(trimmed) : commands.includes(lower)) return { ...operation };
	const configSetRef = parseConfigSetRefCommand(trimmed);
	if (configSetRef) return configSetRef;
	const configSet = parseConfigSetCommand(trimmed);
	if (configSet) return configSet;
	for (const [kind, prefix] of [
		["config-unset", CONFIG_UNSET_PREFIX_RE],
		["config-get", CONFIG_GET_PREFIX_RE],
		["config-schema", CONFIG_SCHEMA_PREFIX_RE]
	]) {
		const parsed = parseConfigReadCommand(trimmed, kind, prefix);
		if (parsed) return parsed;
	}
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
	const modelSetupMatch = trimmed.match(MODEL_SETUP_RE);
	if (modelSetupMatch) {
		const workspace = trimShellishToken(modelSetupMatch.groups?.workspace);
		return {
			kind: "model-setup",
			...workspace ? { workspace } : {}
		};
	}
	const openChannelSetupMatch = trimmed.match(OPEN_CHANNEL_SETUP_RE);
	if (openChannelSetupMatch) {
		const channel = openChannelSetupMatch.groups?.channel?.toLowerCase();
		return {
			kind: "open-setup",
			target: "channels",
			...channel ? { channel } : {}
		};
	}
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
	if ((normalizedSource === "npm" || normalizedSource === "clawhub") && !trimmed.toLowerCase().startsWith(`${normalizedSource}:`)) return `${normalizedSource}:${trimmed}`;
	return trimmed;
}
/**
* Return whether an operation can change local state or process lifecycle.
* Guided setup operations are intentionally absent: starting a wizard is not
* itself a write; the wizard owns approval and persistence for its answers.
*/
function isPersistentSystemAgentOperation(operation) {
	return operation.kind === "set-default-model" || operation.kind === "config-set" || operation.kind === "config-unset" || operation.kind === "config-set-ref" || operation.kind === "setup" || operation.kind === "plugin-install" || operation.kind === "plugin-activate-artifact" || operation.kind === "plugin-uninstall" || operation.kind === "create-team" || operation.kind === "create-agent" && !operation.model?.trim() && !isReservedSystemAgentId(operation.agentId) || operation.kind === "gateway-start" || operation.kind === "gateway-stop" || operation.kind === "gateway-restart";
}
function describeSystemAgentPersistentOperation(operation) {
	switch (operation.kind) {
		case "set-default-model": return operation.agentId ? `set agent ${operation.agentId}'s model to ${operation.model}` : `set agents.defaults.model.primary to ${operation.model}`;
		case "config-unset": return `remove config ${redactSystemAgentConfigPath(operation.path)}`;
		case "config-set": return `set config ${redactSystemAgentConfigPath(operation.path)} to ${isSystemAgentSensitiveConfigValue(operation.path, operation.value) ? "<redacted>" : operation.value}`;
		case "config-set-ref": return operation.secret === void 0 ? `set config ${redactSystemAgentConfigPath(operation.path)} to ${operation.source} SecretRef <redacted>` : `save the provided secret in the secret store and point config ${redactSystemAgentConfigPath(operation.path)} at it`;
		case "setup": return `bootstrap OpenClaw setup for workspace ${shortenHomePath(resolveUserPath(operation.workspace ?? process.cwd()))}`;
		case "model-setup": return "configure a model provider and default model";
		case "doctor-fix": return "run openclaw doctor --fix on the machine running OpenClaw, with OpenClaw stopped";
		case "plugin-install": return `install plugin ${operation.spec}`;
		case "plugin-activate-artifact": return `install the trusted plugin artifact ${operation.path} (SHA256 ${operation.sha256}), including its declared capabilities and native UI; restart the Gateway to load it`;
		case "plugin-uninstall": return `uninstall plugin ${operation.pluginId}`;
		case "create-agent": return [
			`create agent ${operation.agentId} with workspace ${operation.workspace ? shortenHomePath(resolveUserPath(operation.workspace)) : "the default for this agent"}`,
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
function formatSystemAgentPersistentPlan(operation, operatorApprovalOnly = false) {
	const description = describeSystemAgentPersistentOperation(operation);
	return operatorApprovalOnly ? `Proposed: ${description}.\n\n${SYSTEM_AGENT_OPERATOR_APPROVAL_HANDOFF}` : `Plan: ${description}. Say yes to apply.`;
}
//#endregion
export { isPersistentSystemAgentOperation as a, validateSystemAgentPluginInstallSpec as c, redactSystemAgentConfig as d, redactSystemAgentConfigPath as f, formatSystemAgentPersistentPlan as i, isInvalidConfigSetOperation as l, SYSTEM_AGENT_OPERATOR_NAVIGATION_HANDOFF as n, parseSystemAgentOperation as o, resolveSystemAgentConfigSchema as p, describeSystemAgentPersistentOperation as r, secretStoreNameForConfigPath as s, SYSTEM_AGENT_OPERATOR_APPROVAL_HANDOFF as t, isSystemAgentSensitiveConfigValue as u };
