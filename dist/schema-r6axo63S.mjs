import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { t as CHANNEL_IDS } from "./ids-DhLNdNuz.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-C6coO7KH.mjs";
import { n as findWildcardHintMatch, r as schemaHasChildren, t as asSchemaObject } from "./schema.shared-BX8DvRf8.mjs";
import { a as applyConfigTierHints, i as applySensitiveUrlHints, o as applyResolvedConfigTierHints, r as applySensitiveHints, t as computeBaseConfigSchemaResponse } from "./schema-base-CEp0_iVN.mjs";
import crypto from "node:crypto";
//#region src/config/schema.channel-field-help.ts
/**
* Help text for the channel leaves every channel inherits from the shared
* account shape. Channels declare their own hints for provider-specific keys;
* without this table those shared keys render as a bare label in the Control UI.
*/
const SHARED_CHANNEL_FIELD_HELP = {
	ackReaction: "Emoji reaction added to an inbound message while the agent works on it.",
	accounts: "Additional named accounts for this channel. Each one takes the same settings.",
	actions: "Which channel actions (messages, reactions, threads, search) the agent may call.",
	agentId: "Pin inbound messages from this channel to one agent.",
	allowBots: "Accept messages authored by other bots. Loop protection still applies.",
	allowFrom: "Sender ids allowed to reach the agent. Required by \"allowlist\"; use [\"*\"] to allow everyone.",
	botLoopProtection: "Guards against bot-to-bot reply loops once bot messages are accepted.",
	capabilities: "Override the channel capabilities OpenClaw assumes this account supports.",
	commands: "Native command surface for this channel, such as slash commands and command menus.",
	configWrites: "Let this channel write config in response to its own commands and events.",
	contextVisibility: "How much quoted context from other senders reaches the agent: \"all\" keeps it, the allowlist modes gate it by sender.",
	dangerouslyAllowNameMatching: "Break-glass compatibility: match allowlist entries by mutable display name instead of stable ids. Keep this off.",
	defaultAccount: "Account used when an outbound request does not name one.",
	defaultTo: "Target used for outbound messages when the caller supplies none.",
	dm: "Settings that apply only to direct messages on this channel.",
	dmHistoryLimit: "Channel-specific direct-message history limit. Consult channel guidance for message-window defaults and session user-turn trimming; zero has different meanings for those consumers.",
	dmPolicy: "Who may DM the agent: \"pairing\" approves each new sender, \"allowlist\" trusts allowFrom, \"open\" allows anyone, \"disabled\" turns DMs off.",
	dms: "Per-conversation overrides, keyed by DM id.",
	enabled: "Turn this channel on or off without removing its configuration.",
	execApprovals: "Approval prompts for commands that need operator sign-off, delivered in this channel.",
	groupAllowFrom: "Sender ids allowed in group chats. Falls back to allowFrom when unset.",
	groupPolicy: "Who may use the agent in groups: \"allowlist\" trusts groupAllowFrom, \"open\" allows any group, \"disabled\" turns group chat off.",
	groups: "Per-group overrides, keyed by group id.",
	healthMonitor: "Per-channel opt-out for the health monitor that restarts stalled channels.",
	heartbeatVisibility: "Which heartbeat results this channel shows.",
	historyLimit: "Channel-specific history limit. Consult channel guidance for observed-message windows and session user-turn trimming; zero has different meanings for those consumers.",
	legacyWebhook: "Explicit legacy webhook listener endpoint. Doctor pins existing installations once. After moving callbacks to the Gateway, remove the pin or set false to disable inherited forwarding.",
	markdown: "Markdown rendering overrides for this channel.",
	mediaMaxMb: "Per-attachment media limit in MiB. Channel transport limits still apply.",
	mentionPatterns: "Extra patterns that count as mentioning the agent in group chats.",
	model: "Model override for runs started from this channel.",
	name: "Display name for this account in the Control UI and logs.",
	network: "Outbound network settings for this channel, such as timeouts and retries.",
	proxy: "Proxy used for this channel's outbound connections.",
	reactionAllowlist: "Sender ids whose reactions reach the agent when reactionNotifications is \"allowlist\".",
	reactionLevel: "How freely the agent adds its own reactions to messages.",
	reactionNotifications: "Which inbound reactions reach the agent.",
	replyToMode: "When to attach a native reply to the message that triggered the run.",
	replyToModeByChatType: "Per-chat-type override of replyToMode.",
	requireMention: "Only respond in group chats when the agent is mentioned.",
	responsePrefix: "Text prepended to every outbound reply.",
	sendReadReceipts: "Mark inbound messages as read on this channel.",
	streaming: "How replies stream back to this channel while the agent is still working.",
	systemPrompt: "Extra system prompt applied to runs started from this channel.",
	textChunkLimit: "Maximum characters per outbound message before OpenClaw splits it.",
	threadBindings: "How chat threads bind to agent sessions, including idle expiry and spawning.",
	tokenFile: "Read the token from this file instead of storing it inline in config.",
	typingIndicator: "How this channel signals that the agent is working.",
	webhookHost: "Interface the inbound webhook listener binds to.",
	webhookPath: "Path the inbound webhook listener serves.",
	webhookPort: "Port the inbound webhook listener binds to.",
	webhookSecret: "Shared secret used to verify inbound webhook requests.",
	webhookUrl: "Public URL the provider should deliver webhooks to."
};
const SHARED_CHANNEL_FIELD_PATH = /^channels\.[^.]+(?:\.accounts\.[^.]+)?\.([^.]+)$/;
/** Fill missing help on shared channel leaves without overriding channel hints. */
function applySharedChannelFieldHelp(hints) {
	const next = { ...hints };
	for (const [path, hint] of Object.entries(hints)) {
		if (hint?.help !== void 0) continue;
		const field = SHARED_CHANNEL_FIELD_PATH.exec(path)?.[1];
		const help = field ? SHARED_CHANNEL_FIELD_HELP[field] : void 0;
		if (!help) continue;
		next[path] = {
			...hint,
			help
		};
	}
	return next;
}
//#endregion
//#region src/config/schema.lookup.ts
const LOOKUP_SCHEMA_STRING_KEYS = /* @__PURE__ */ new Set([
	"$id",
	"$schema",
	"title",
	"description",
	"format",
	"pattern",
	"contentEncoding",
	"contentMediaType"
]);
const LOOKUP_SCHEMA_NUMBER_KEYS = /* @__PURE__ */ new Set([
	"minimum",
	"maximum",
	"exclusiveMinimum",
	"exclusiveMaximum",
	"multipleOf",
	"minLength",
	"maxLength",
	"minItems",
	"maxItems",
	"minProperties",
	"maxProperties"
]);
const LOOKUP_SCHEMA_BOOLEAN_KEYS = /* @__PURE__ */ new Set([
	"additionalProperties",
	"uniqueItems",
	"deprecated",
	"readOnly",
	"writeOnly"
]);
const MAX_LOOKUP_PATH_SEGMENTS = 32;
const LOOKUP_SCHEMA_COMPOSITION_KEYS = [
	"anyOf",
	"oneOf",
	"allOf"
];
const LOOKUP_SCHEMA_NESTED_FORM_DEPTH = 4;
function normalizeLookupPath(path) {
	return path.trim().replace(/\[(\*|\d*)\]/g, (_match, segment) => `.${segment || "*"}`).replace(/^\.+|\.+$/g, "").replace(/\.+/g, ".");
}
function splitLookupPath(path) {
	const normalized = normalizeLookupPath(path);
	return normalized ? normalized.split(".").filter(Boolean) : [];
}
function resolveItemsSchema(schema, index) {
	if (Array.isArray(schema.items)) {
		const entry = index === void 0 ? schema.items.find((candidate) => typeof candidate === "object" && candidate !== null) : schema.items[index];
		return entry && typeof entry === "object" ? entry : null;
	}
	return schema.items && typeof schema.items === "object" ? schema.items : null;
}
function resolveLookupChildSchema(schema, segment) {
	if (isBlockedObjectKey(segment)) return null;
	const properties = schema.properties;
	if (properties && Object.hasOwn(properties, segment)) return asSchemaObject(properties[segment]);
	for (const [pattern, child] of Object.entries(schema.patternProperties ?? {})) try {
		if (new RegExp(pattern).test(segment)) return asSchemaObject(child);
	} catch {}
	const itemIndex = parseConfigPathArrayIndex(segment);
	const items = resolveItemsSchema(schema, itemIndex);
	if ((segment === "*" || itemIndex !== void 0) && items) return items;
	for (const key of LOOKUP_SCHEMA_COMPOSITION_KEYS) {
		const variants = schema[key];
		if (!Array.isArray(variants)) continue;
		for (const variant of variants) {
			const variantSchema = asSchemaObject(variant);
			const resolved = variantSchema ? resolveLookupChildSchema(variantSchema, segment) : null;
			if (resolved) return resolved;
		}
	}
	if (schema.additionalProperties && typeof schema.additionalProperties === "object") return schema.additionalProperties;
	return null;
}
function resolveLookupSchema(response, parts) {
	let current = asSchemaObject(response.schema);
	for (const segment of parts) {
		if (!current) break;
		current = resolveLookupChildSchema(current, segment);
	}
	return current;
}
function classifyLookupChildSchema(schema, segment) {
	if (schema.properties && Object.hasOwn(schema.properties, segment)) return "property";
	if (parseConfigPathArrayIndex(segment) !== void 0 && resolveItemsSchema(schema)) return "array-index";
	for (const key of LOOKUP_SCHEMA_COMPOSITION_KEYS) {
		const variants = schema[key];
		if (!Array.isArray(variants)) continue;
		for (const variant of variants) {
			const variantSchema = asSchemaObject(variant);
			const kind = variantSchema ? classifyLookupChildSchema(variantSchema, segment) : null;
			if (kind) return kind;
		}
	}
	if (schema.additionalProperties === true || typeof schema.additionalProperties === "object") return propertyNameSchemaAllows(schema.propertyNames, segment) ? "record-key" : "invalid-record-key";
	return null;
}
const PROPERTY_NAME_SCHEMA_KEYS = /* @__PURE__ */ new Set([
	"$id",
	"$schema",
	"title",
	"description",
	"type",
	"const",
	"enum",
	"pattern",
	"minLength",
	"maxLength",
	"anyOf",
	"oneOf",
	"allOf"
]);
function propertyNameSchemaAllows(schema, value) {
	if (schema === void 0 || schema === true) return true;
	if (schema === false) return false;
	const object = asSchemaObject(schema);
	if (!object || Object.keys(object).some((key) => !PROPERTY_NAME_SCHEMA_KEYS.has(key))) return false;
	const types = Array.isArray(object.type) ? object.type : [object.type];
	if (object.type !== void 0 && !types.includes("string")) return false;
	if (object.const !== void 0 && object.const !== value) return false;
	if (Array.isArray(object.enum) && !object.enum.includes(value)) return false;
	if (typeof object.minLength === "number" && value.length < object.minLength) return false;
	if (typeof object.maxLength === "number" && value.length > object.maxLength) return false;
	if (typeof object.pattern === "string") try {
		if (!new RegExp(object.pattern).test(value)) return false;
	} catch {
		return false;
	}
	if (object.allOf?.some((candidate) => !propertyNameSchemaAllows(candidate, value))) return false;
	if (object.anyOf && !object.anyOf.some((candidate) => propertyNameSchemaAllows(candidate, value))) return false;
	if (object.oneOf && object.oneOf.filter((candidate) => propertyNameSchemaAllows(candidate, value)).length !== 1) return false;
	return true;
}
/** Classify one already-parsed path segment without losing dots inside record keys. */
function classifyConfigSchemaPathSegment(response, parentParts, segment) {
	const current = resolveLookupSchema(response, parentParts);
	return current ? classifyLookupChildSchema(current, segment) : null;
}
function stripSchemaForLookup(schema, nestedFormDepth = 0) {
	const next = {};
	for (const [key, value] of Object.entries(schema)) {
		if (LOOKUP_SCHEMA_STRING_KEYS.has(key) && typeof value === "string") {
			next[key] = value;
			continue;
		}
		if (LOOKUP_SCHEMA_NUMBER_KEYS.has(key) && typeof value === "number") {
			next[key] = value;
			continue;
		}
		if (LOOKUP_SCHEMA_BOOLEAN_KEYS.has(key) && typeof value === "boolean") {
			next[key] = value;
			continue;
		}
		if (key === "type") {
			if (typeof value === "string") next[key] = value;
			else if (Array.isArray(value) && value.every((entry) => typeof entry === "string")) next[key] = [...value];
			continue;
		}
		if (key === "enum" && Array.isArray(value)) {
			const entries = value.filter((entry) => entry === null || typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean");
			if (entries.length === value.length) next[key] = [...entries];
			continue;
		}
		if (key === "const" && (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean")) next[key] = value;
	}
	if (schema.properties && (nestedFormDepth > 0 && nestedFormDepth <= LOOKUP_SCHEMA_NESTED_FORM_DEPTH || schema.additionalProperties && typeof schema.additionalProperties === "object")) next.properties = Object.fromEntries(Object.entries(schema.properties).map(([key, child]) => [key, stripSchemaForLookup(child, nestedFormDepth + 1)]));
	if (schema.additionalProperties && typeof schema.additionalProperties === "object") next.additionalProperties = stripSchemaForLookup(schema.additionalProperties, nestedFormDepth + 1);
	if (schema.patternProperties) next.patternProperties = Object.fromEntries(Object.entries(schema.patternProperties).map(([pattern, child]) => [pattern, stripSchemaForLookup(child, nestedFormDepth + 1)]));
	if (Array.isArray(schema.items)) next.items = schema.items.map((item) => stripSchemaForLookup(item, nestedFormDepth + 1));
	else if (schema.items && typeof schema.items === "object") next.items = stripSchemaForLookup(schema.items, nestedFormDepth + 1);
	if (nestedFormDepth <= LOOKUP_SCHEMA_NESTED_FORM_DEPTH) for (const key of LOOKUP_SCHEMA_COMPOSITION_KEYS) {
		const variants = schema[key];
		if (!Array.isArray(variants)) continue;
		next[key] = variants.filter((variant) => variant && typeof variant === "object").map((variant) => stripSchemaForLookup(variant, nestedFormDepth + 1));
	}
	return next;
}
function buildLookupChildren(schema, path, uiHints, splitPath, resolveReloadMetadata) {
	const children = [];
	const required = new Set(schema.required ?? []);
	const pushChild = (key, childSchema, isRequired) => {
		const childPath = path ? `${path}.${key}` : key;
		const resolvedHint = findWildcardHintMatch({
			uiHints,
			path: childPath,
			splitPath
		});
		const reloadMetadata = resolveReloadMetadata?.(childPath);
		children.push({
			key,
			path: childPath,
			type: childSchema.type,
			required: isRequired,
			hasChildren: schemaHasChildren(childSchema),
			reloadKind: reloadMetadata?.kind,
			hint: resolvedHint?.hint,
			hintPath: resolvedHint?.path
		});
	};
	for (const [key, childSchema] of Object.entries(schema.properties ?? {})) pushChild(key, childSchema, required.has(key));
	const wildcardSchema = (schema.additionalProperties && typeof schema.additionalProperties === "object" && !Array.isArray(schema.additionalProperties) ? schema.additionalProperties : null) ?? resolveItemsSchema(schema);
	if (wildcardSchema) pushChild("*", wildcardSchema, false);
	return children;
}
function lookupConfigSchema(response, path, resolveReloadMetadata) {
	const wantsRoot = path.trim() === ".";
	const normalizedPath = normalizeLookupPath(path);
	if (!normalizedPath && !wantsRoot) return null;
	const parts = splitLookupPath(normalizedPath);
	if (!wantsRoot && parts.length === 0 || parts.length > MAX_LOOKUP_PATH_SEGMENTS) return null;
	const current = resolveLookupSchema(response, parts);
	if (!current) return null;
	const hintParts = /* @__PURE__ */ new Map();
	const splitHintPath = schemaHasChildren(current) ? (hintPath) => {
		let cachedParts = hintParts.get(hintPath);
		if (!cachedParts) {
			cachedParts = splitLookupPath(hintPath);
			hintParts.set(hintPath, cachedParts);
		}
		return cachedParts;
	} : splitLookupPath;
	const resolvedHint = findWildcardHintMatch({
		uiHints: response.uiHints,
		path: normalizedPath,
		splitPath: splitHintPath
	});
	const reloadMetadata = resolveReloadMetadata?.(normalizedPath);
	return {
		path: wantsRoot ? "." : normalizedPath,
		schema: stripSchemaForLookup(current),
		reloadKind: reloadMetadata?.kind,
		hint: resolvedHint?.hint,
		hintPath: resolvedHint?.path,
		children: buildLookupChildren(current, wantsRoot ? "" : normalizedPath, response.uiHints, splitHintPath, resolveReloadMetadata)
	};
}
//#endregion
//#region src/config/schema.ts
function isObjectSchema(schema) {
	const type = schema.type;
	return type === "object" || Array.isArray(type) && type.includes("object") || Boolean(schema.properties || schema.additionalProperties);
}
function mergeObjectSchema(base, extension) {
	const mergedRequired = /* @__PURE__ */ new Set([...base.required ?? [], ...extension.required ?? []]);
	const merged = {
		...base,
		...extension,
		properties: {
			...base.properties,
			...extension.properties
		}
	};
	if (mergedRequired.size > 0) merged.required = Array.from(mergedRequired);
	const additional = extension.additionalProperties ?? base.additionalProperties;
	if (additional !== void 0) merged.additionalProperties = additional;
	return merged;
}
const EXTENSION_SCHEMA_MAX_BYTES = 262144;
const EXTENSION_SCHEMA_TOTAL_MAX_BYTES = 2097152;
const EXTENSION_SCHEMA_MAX_ITEMS = 256;
function schemaJsonBytes(schema) {
	try {
		return Buffer.byteLength(JSON.stringify(schema), "utf-8");
	} catch {
		return Number.POSITIVE_INFINITY;
	}
}
function buildOmittedExtensionConfigSchema(kind, id) {
	return {
		type: "object",
		additionalProperties: true,
		description: `${kind} config schema for ${id} was omitted from the full config.schema response because installed extension schemas exceeded the Gateway response budget.`
	};
}
function limitExtensionSchemas(params) {
	let totalBytes = 0;
	let includedItems = 0;
	const keepSchema = (schema, copies = 1) => {
		const bytes = schemaJsonBytes(schema);
		if (!Number.isFinite(bytes) || bytes > EXTENSION_SCHEMA_MAX_BYTES || totalBytes + bytes * copies > EXTENSION_SCHEMA_TOTAL_MAX_BYTES || includedItems + copies > EXTENSION_SCHEMA_MAX_ITEMS) return false;
		totalBytes += bytes * copies;
		includedItems += copies;
		return true;
	};
	const limitSchemas = (entries, kind) => entries.map((entry) => !entry.configSchema || keepSchema(entry.configSchema) ? entry : {
		...entry,
		configSchema: buildOmittedExtensionConfigSchema(kind, entry.id)
	});
	const plugins = limitSchemas(params.plugins, "plugin");
	for (const [index, plugin] of plugins.entries()) {
		if (!plugin.providerRequest) continue;
		plugins[index] = {
			...plugin,
			providerRequest: { providers: Object.fromEntries(Object.entries(plugin.providerRequest.providers ?? {}).map(([id, policy]) => [id, policy.modelParamsSchema && !keepSchema(policy.modelParamsSchema, 2) ? {
				...policy,
				modelParamsSchema: buildOmittedExtensionConfigSchema("plugin", id)
			} : policy])) }
		};
	}
	return {
		plugins,
		channels: limitSchemas(params.channels, "channel")
	};
}
function collectExtensionHintKeys(hints, plugins, channels) {
	const keys = /* @__PURE__ */ new Set();
	const hintKeys = Object.keys(hints);
	const collectPrefixedHintKeys = (prefix) => {
		const childPrefix = `${prefix}.`;
		for (const key of hintKeys) if (key === prefix || key.startsWith(childPrefix)) keys.add(key);
	};
	const collectSchemaKeys = (schema, basePath) => {
		const node = asSchemaObject(schema);
		if (!node) return;
		keys.add(basePath);
		for (const [propertyKey, propertySchema] of Object.entries(node.properties ?? {})) collectSchemaKeys(propertySchema, `${basePath}.${propertyKey}`);
		if (node.additionalProperties && typeof node.additionalProperties === "object") collectSchemaKeys(node.additionalProperties, `${basePath}.*`);
		for (const item of Array.isArray(node.items) ? node.items : [node.items]) collectSchemaKeys(item, `${basePath}[]`);
	};
	for (const plugin of plugins) {
		const id = plugin.id.trim();
		if (!id) continue;
		const prefix = `plugins.entries.${id}`;
		collectPrefixedHintKeys(prefix);
		collectSchemaKeys(plugin.configSchema, `${prefix}.config`);
	}
	for (const channel of channels) {
		const id = channel.id.trim();
		if (!id) continue;
		const prefix = `channels.${id}`;
		collectPrefixedHintKeys(prefix);
		collectSchemaKeys(channel.configSchema, prefix);
	}
	return keys;
}
function applyMetadataHints(hints, plugins, channels) {
	const next = { ...hints };
	const mergeRelativeHints = (basePath, uiHints) => {
		for (const [relPathRaw, hint] of Object.entries(uiHints ?? {})) {
			const relPath = relPathRaw.trim().replace(/^\./, "");
			if (!relPath) continue;
			const key = `${basePath}.${relPath}`;
			next[key] = {
				...next[key],
				...hint
			};
		}
	};
	for (const plugin of plugins) {
		const id = plugin.id.trim();
		if (!id) continue;
		const name = (plugin.name ?? id).trim() || id;
		const basePath = `plugins.entries.${id}`;
		next[basePath] = {
			...next[basePath],
			label: name,
			help: plugin.description ? `${plugin.description} (plugin: ${id})` : `Plugin entry for ${id}.`
		};
		next[`${basePath}.enabled`] = {
			...next[`${basePath}.enabled`],
			label: `Enable ${name}`
		};
		next[`${basePath}.config`] = {
			...next[`${basePath}.config`],
			label: `${name} Config`,
			help: `Plugin-defined config payload for ${id}.`,
			...plugin.configGroups ? { groups: plugin.configGroups } : {}
		};
		mergeRelativeHints(`${basePath}.config`, plugin.configUiHints);
		for (const relPath of plugin.configSecretInputPaths ?? []) {
			const key = `${basePath}.config.${relPath}`;
			next[key] = {
				...next[key],
				sensitive: true
			};
		}
	}
	for (const channel of channels) {
		const id = channel.id.trim();
		if (!id) continue;
		const basePath = `channels.${id}`;
		const current = next[basePath] ?? {};
		const label = channel.label?.trim();
		const help = channel.description?.trim();
		next[basePath] = {
			...current,
			...label ? { label } : {},
			...help ? { help } : {}
		};
		mergeRelativeHints(basePath, channel.configUiHints);
	}
	const channelList = listHeartbeatTargetChannels(channels);
	const help = `Delivery target ("owner", "last", "none", or a channel id).${channelList.length ? ` Known channels: ${channelList.join(", ")}.` : ""}`;
	for (const path of ["agents.defaults.heartbeat.target", "agents.entries.*.heartbeat.target"]) {
		const current = next[path] ?? {};
		next[path] = {
			...current,
			help: current.help ?? help,
			placeholder: current.placeholder ?? "owner"
		};
	}
	return next;
}
function listHeartbeatTargetChannels(channels) {
	return uniqueStrings([...CHANNEL_IDS, ...channels.map((channel) => channel.id)].map(normalizeLowercaseStringOrEmpty).filter(Boolean));
}
/** Mutate a caller-owned schema; cached inputs must be cloned before merging. */
function mergeExtensionSchemas(schema, channels, plugins) {
	const root = asSchemaObject(schema);
	const pluginsNode = asSchemaObject(root?.properties?.plugins);
	const entriesNode = asSchemaObject(pluginsNode?.properties?.entries);
	const entryBase = asSchemaObject(entriesNode?.additionalProperties);
	const entryProperties = entriesNode?.properties ?? {};
	if (entriesNode && plugins) entriesNode.properties = entryProperties;
	const agents = asSchemaObject(root?.properties?.agents);
	const defaults = asSchemaObject(agents?.properties?.defaults);
	const agentEntries = asSchemaObject(agents?.properties?.entries);
	const modelMaps = [defaults, asSchemaObject(agentEntries?.additionalProperties)].map((entry) => asSchemaObject(entry?.properties?.models)).filter((entry) => entry !== null);
	for (const plugin of plugins ?? []) {
		for (const [provider, policy] of Object.entries(plugin.providerRequest?.providers ?? {})) {
			if (!policy.modelParamsSchema) continue;
			for (const models of modelMaps) {
				const modelEntry = asSchemaObject(models.additionalProperties);
				models.patternProperties ??= {};
				models.patternProperties[`^${escapeRegExp(provider)}/.+$`] = {
					...structuredClone(modelEntry),
					properties: {
						...structuredClone(modelEntry?.properties),
						params: structuredClone(policy.modelParamsSchema)
					}
				};
			}
		}
		if (!entriesNode || !plugin.configSchema) continue;
		const entryObject = entryBase ? structuredClone(entryBase) : { type: "object" };
		const baseConfigSchema = asSchemaObject(entryObject.properties?.config);
		const pluginConfigSchema = structuredClone(plugin.configSchema);
		const pluginSchema = asSchemaObject(pluginConfigSchema);
		const nextConfigSchema = baseConfigSchema && pluginSchema && isObjectSchema(baseConfigSchema) && isObjectSchema(pluginSchema) ? mergeObjectSchema(baseConfigSchema, pluginSchema) : pluginConfigSchema;
		entryObject.properties = {
			...entryObject.properties,
			config: nextConfigSchema
		};
		entryProperties[plugin.id] = entryObject;
	}
	const channelsNode = asSchemaObject(root?.properties?.channels);
	if (!channelsNode) return schema;
	const channelProps = channelsNode.properties ?? {};
	channelsNode.properties = channelProps;
	for (const channel of channels) {
		if (!channel.configSchema) continue;
		const existing = asSchemaObject(channelProps[channel.id]);
		const incoming = asSchemaObject(channel.configSchema);
		if (existing && incoming && isObjectSchema(existing) && isObjectSchema(incoming)) channelProps[channel.id] = mergeObjectSchema(existing, incoming);
		else channelProps[channel.id] = structuredClone(channel.configSchema);
	}
	return schema;
}
let cachedBase = null;
const mergedSchemaCache = /* @__PURE__ */ new Map();
function buildMergedSchemaCacheKey(params) {
	const plugins = params.plugins.map((plugin) => ({
		id: plugin.id,
		name: plugin.name,
		description: plugin.description,
		configSchema: plugin.configSchema ?? null,
		configSecretInputPaths: plugin.configSecretInputPaths ?? null,
		configUiHints: plugin.configUiHints ?? null,
		configGroups: plugin.configGroups ?? null,
		providerRequest: plugin.providerRequest ?? null
	})).toSorted((a, b) => a.id.localeCompare(b.id));
	const channels = params.channels.map((channel) => ({
		id: channel.id,
		label: channel.label,
		description: channel.description,
		configSchema: channel.configSchema ?? null,
		configUiHints: channel.configUiHints ?? null
	})).toSorted((a, b) => a.id.localeCompare(b.id));
	const hash = crypto.createHash("sha256");
	hash.update("{\"plugins\":[");
	plugins.forEach((plugin, index) => {
		if (index > 0) hash.update(",");
		hash.update(JSON.stringify(plugin));
	});
	hash.update("],\"channels\":[");
	channels.forEach((channel, index) => {
		if (index > 0) hash.update(",");
		hash.update(JSON.stringify(channel));
	});
	hash.update("]}");
	return hash.digest("hex");
}
function getBundledChannelSchemaMetadata() {
	return GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.map((entry) => {
		const metadata = Object.assign({ id: entry.channelId }, entry.label ? { label: entry.label } : {}, entry.description ? { description: entry.description } : {}, { configSchema: entry.schema });
		if ("uiHints" in entry) metadata.configUiHints = entry.uiHints;
		return metadata;
	});
}
/**
* Materialize the presentation hints that need the merged schema: tiers resolve
* per path, then shared channel leaves get their help.
*/
function resolveMergedUiHints(schema, hints, changedRoots) {
	const root = asSchemaObject(schema);
	const changedSchema = {
		...root,
		properties: Object.fromEntries(Object.entries(root?.properties ?? {}).filter(([key]) => changedRoots.includes(key)))
	};
	return applySharedChannelFieldHelp(applyResolvedConfigTierHints(changedSchema, applyConfigTierHints(hints, { includePluginOwnedChannels: true })));
}
function buildBaseConfigSchema() {
	if (cachedBase) return cachedBase;
	const generated = computeBaseConfigSchemaResponse();
	const bundledChannels = getBundledChannelSchemaMetadata();
	const mergedWithoutSensitiveHints = applyMetadataHints(generated.uiHints, [], bundledChannels);
	const mergedHints = applySensitiveHints(mergedWithoutSensitiveHints, collectExtensionHintKeys(mergedWithoutSensitiveHints, [], bundledChannels));
	const mergedSchema = mergeExtensionSchemas(generated.schema, bundledChannels);
	const next = {
		...generated,
		schema: mergedSchema,
		uiHints: resolveMergedUiHints(mergedSchema, mergedHints, ["channels"])
	};
	cachedBase = next;
	return next;
}
function buildConfigSchemaCore(params) {
	const base = buildBaseConfigSchema();
	const { plugins, channels } = limitExtensionSchemas({
		plugins: params?.plugins ?? [],
		channels: params?.channels ?? []
	});
	if (plugins.length === 0 && channels.length === 0) return base;
	const cacheKey = params?.cache !== false ? buildMergedSchemaCacheKey({
		plugins,
		channels
	}) : null;
	if (cacheKey) {
		const cached = mergedSchemaCache.get(cacheKey);
		if (cached) return cached;
	}
	const mergedWithoutSensitiveHints = applyMetadataHints(base.uiHints, plugins, channels);
	const extensionHintKeys = collectExtensionHintKeys(mergedWithoutSensitiveHints, plugins, channels);
	const mergedHints = applySensitiveUrlHints(applySensitiveHints(mergedWithoutSensitiveHints, extensionHintKeys), extensionHintKeys);
	const mergedSchema = mergeExtensionSchemas(structuredClone(base.schema), channels, plugins);
	const changedRoots = [...plugins.length ? ["plugins"] : [], ...channels.length ? ["channels"] : []];
	const merged = {
		...base,
		schema: mergedSchema,
		uiHints: resolveMergedUiHints(mergedSchema, mergedHints, changedRoots)
	};
	if (cacheKey) {
		pruneMapToMaxSize(mergedSchemaCache, 63);
		mergedSchemaCache.set(cacheKey, merged);
	}
	return merged;
}
//#endregion
export { classifyConfigSchemaPathSegment as n, lookupConfigSchema as r, buildConfigSchemaCore as t };
