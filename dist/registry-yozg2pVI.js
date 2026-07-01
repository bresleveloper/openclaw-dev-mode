import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString$2, f as normalizeStringifiedOptionalString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { O as normalizeCommandDescriptorName, k as sanitizeCommandDescriptorDescription } from "./argv-D0lt4C2b.js";
import { C as resolveExpiresAtMsFromDurationMs, P as timestampMsToIsoString } from "./number-coercion-CJQ8TR--.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { h as normalizeUniqueTrimmedStringList, l as normalizeStringEntries, p as normalizeUniqueStringEntries, v as uniqueValues } from "./string-normalization-CRyoFBPt.js";
import { m as resolveUserPath } from "./utils-BApvfmPs.js";
import { p as normalizeSecretInputString } from "./types.secrets-lIZQEgMF.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { i as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./ids-CkMlu8FB.js";
import { n as defaultSlotIdForKey, r as hasKind } from "./slots-kpL659LX.js";
import "./agent-scope-CDZXADgT.js";
import { p as resolveAgentIdFromSessionKey } from "./session-key-pTKRJb0m.js";
import { o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { t as validateJsonSchemaValue } from "./schema-validator-CuWE829s.js";
import { _ as getPluginCompatRecord } from "./installed-plugin-index-C6bCYWRE.js";
import { t as resolveConfiguredSecretInputString } from "./resolve-configured-secret-input-string-DVwZqsiO.js";
import { f as normalizeChannelMeta } from "./bundled-rTRi0B0q.js";
import { t as normalizePluginGatewayMethodScope } from "./gateway-method-policy-BQVhuE4m.js";
import { s as isOperatorScope } from "./operator-scopes-CS3xdS-V.js";
import { n as listChatChannels } from "./chat-meta-CH2MWeRm.js";
import { t as buildPluginApi } from "./api-builder-CX43eAAh.js";
import { a as registerAgentHarness, r as getRegisteredAgentHarness } from "./registry-D9zzqcZX.js";
import { i as registerDetachedTaskLifecycleRuntime, n as getDetachedTaskLifecycleRuntimeRegistration } from "./detached-task-runtime-state-BrJUgd0A.js";
import { C as registerPluginInteractiveHandler, F as pluginCommands, g as isPromptInjectionHookName, h as isPluginHookName, i as registerPluginCommand, j as clearPluginCommandsForPlugin, l as DEPRECATED_PLUGIN_HOOKS, m as isDeprecatedPluginHookName, o as validatePluginCommandDefinition, p as isConversationHookName, t as isReservedCommandName, x as clearPluginInteractiveHandlersForPlugin, y as stripPromptMutationFieldsFromLegacyHookResult } from "./command-registration-DbqkNaUv.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-DmSIVBht.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Behn5ZPn.js";
import { A as deletePluginSessionSchedulerJob, B as isPluginRegistryRetired, D as createEmptyPluginRegistry, F as setPluginRunContext, I as buildPluginAgentTurnPrepareContext, L as normalizePluginHostHookId, M as getPluginSessionSchedulerJobGeneration, P as registerPluginSessionSchedulerJob, f as getActivePluginSessionExtensionRegistry, j as getPluginRunContext, k as clearPluginRunContext, s as getActivePluginRegistry, z as isPluginRegistryActivated } from "./runtime-wIYJz8NY.js";
import { s as emitAgentEvent } from "./agent-events-7y1r8HOP.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { _ as registerMemoryRuntimeForPlugin, f as registerMemoryFlushPlanResolverForPlugin, h as registerMemoryPromptSupplement, l as registerMemoryCapability, m as registerMemoryPromptSectionForPlugin, u as registerMemoryCorpusSupplement } from "./memory-state-CH-VhZFM.js";
import { t as createChannelIngressQueue } from "./ingress-queue-CGeJivdD.js";
import { n as createPluginStateKeyedStore, r as createPluginStateSyncKeyedStore } from "./plugin-state-store-D2450Zn3.js";
import { a as registerContextEngineForOwner, t as clearContextEnginesForOwner } from "./registry-BLZQzICr.js";
import { r as createPluginGatewayMethodDescriptor } from "./registry-CHAIc2bg.js";
import { f as registerInternalHook, h as unregisterInternalHook } from "./internal-hooks-BGR46Oie.js";
import { i as NODE_SYSTEM_RUN_COMMANDS, n as NODE_EXEC_APPROVALS_COMMANDS, r as NODE_SYSTEM_NOTIFY_COMMAND } from "./node-commands-SnI8Vs7F.js";
import { a as normalizeAgentToolResultMiddlewareRuntimeIds, n as normalizePluginToolContractNames, o as normalizeAgentToolResultMiddlewareRuntimes, r as normalizePluginToolNames, t as findUndeclaredPluginToolNames } from "./tool-contracts-CnGjTaKv.js";
import { n as detectMime, t as FILE_TYPE_SNIFF_MAX_BYTES, u as normalizeMimeType } from "./mime-C8mVE2Bw.js";
import { n as resolveWorkspaceRoot, r as resolvePathFromInput } from "./workspace-dir-bmZsBEHq.js";
import { D as normalizeSessionEntrySlotKey } from "./store-DJ7wx5_V.js";
import { i as normalizeMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { t as extractDeliveryInfo } from "./delivery-info-DKRHRtM6.js";
import { N as updateResolvedSessionEntry, O as resolveSessionEntryAccessTarget } from "./session-accessor-Dx6KDG0K.js";
import "./host-hook-cleanup-f5OWm9s6.js";
import { n as normalizePluginHttpPath, t as findOverlappingPluginHttpRoute } from "./http-route-overlap--iFT7z_9.js";
import { i as readRecordValue, n as copyRecordEntries, r as isRecord$1, t as copyArrayEntries } from "./safe-record-C-1prfep.js";
import { i as withPluginRuntimePluginScope, r as withPluginRuntimePluginIdScope } from "./gateway-request-scope-BAEdAUQ6.js";
import path from "node:path";
import * as fsPromises from "node:fs/promises";
import { lstat } from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/plugins/compaction-provider.ts
const COMPACTION_PROVIDER_REGISTRY_STATE = Symbol.for("openclaw.compactionProviderRegistryState");
function getCompactionProviderRegistryState() {
	const globalState = globalThis;
	if (!globalState[COMPACTION_PROVIDER_REGISTRY_STATE]) globalState[COMPACTION_PROVIDER_REGISTRY_STATE] = { providers: /* @__PURE__ */ new Map() };
	return globalState[COMPACTION_PROVIDER_REGISTRY_STATE];
}
/**
* Register a compaction provider implementation.
* Pass `ownerPluginId` so the loader can snapshot/restore correctly.
*/
function registerCompactionProvider(provider, options) {
	getCompactionProviderRegistryState().providers.set(provider.id, {
		provider,
		ownerPluginId: options?.ownerPluginId
	});
}
/** Return the provider for the given id, or undefined. */
function getCompactionProvider(id) {
	return getCompactionProviderRegistryState().providers.get(id)?.provider;
}
/** Return the registered entry (provider + owner) for the given id. */
function getRegisteredCompactionProvider(id) {
	return getCompactionProviderRegistryState().providers.get(id);
}
/** List all registered entries with owner metadata (for snapshot/restore). */
function listRegisteredCompactionProviders() {
	return Array.from(getCompactionProviderRegistryState().providers.values());
}
/** Clear all compaction providers. Used by clearPluginLoaderCache() and reload. */
function clearCompactionProviders() {
	getCompactionProviderRegistryState().providers.clear();
}
/** Restore from a snapshot, replacing all current entries. */
function restoreRegisteredCompactionProviders(entries) {
	const map = getCompactionProviderRegistryState().providers;
	map.clear();
	for (const entry of entries) map.set(entry.provider.id, entry);
}
//#endregion
//#region src/plugins/openai-compatible-embedding-provider.ts
/** Provider id for OpenAI-compatible remote embedding servers. */
const OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID = "openai-compatible";
const OPENAI_COMPATIBLE_MODEL_APIS = new Set(["openai-completions", "openai-responses"]);
const EMBEDDING_ERROR_BODY_MAX_BYTES = 8 * 1024;
const EMBEDDING_ERROR_BODY_MAX_CHARS = 1e3;
const EMBEDDING_ERROR_TRUNCATED_SUFFIX = "... [truncated]";
function normalizeBaseUrl(value) {
	const baseUrl = value?.trim();
	if (!baseUrl) throw new Error("openai-compatible embeddings: missing remote.baseUrl. Set it to your OpenAI-compatible embeddings server, for example http://127.0.0.1:11434/v1.");
	return baseUrl.replace(/\/+$/u, "");
}
function normalizeModel(value, providerId) {
	const model = value?.trim();
	if (!model) throw new Error("openai-compatible embeddings: missing model. Set it to the embedding model id your server expects.");
	const prefixes = new Set([
		providerId?.trim(),
		normalizeProviderId(providerId ?? ""),
		OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID
	].filter((prefix) => Boolean(prefix)).map((prefix) => `${prefix}/`));
	for (const prefix of prefixes) if (model.startsWith(prefix)) return model.slice(prefix.length);
	return model;
}
function normalizeDimensions(value) {
	if (value === void 0) return;
	if (!Number.isInteger(value) || value <= 0) throw new Error("openai-compatible embeddings: dimensions must be a positive integer.");
	return value;
}
function normalizeOptionalInputType(value) {
	const inputType = value?.trim();
	return inputType ? inputType : void 0;
}
function normalizeOptionalString$1(value) {
	const normalized = value?.trim();
	return normalized ? normalized : void 0;
}
function chooseSecretInputOverride(override, fallback) {
	if (typeof override === "string") return override.trim() ? override : fallback;
	return override ?? fallback;
}
function resolveRequestInputType(client, kind) {
	if (kind === "query") return client.queryInputType ?? client.inputType;
	if (kind === "document") return client.documentInputType ?? client.inputType;
	return client.inputType;
}
function normalizeHeaderName(name) {
	return name.trim().toLowerCase();
}
async function buildHeaders(params) {
	const headers = {
		accept: "application/json",
		"content-type": "application/json"
	};
	for (const [name, rawValue] of Object.entries(params.extra ?? {})) {
		const normalizedName = normalizeHeaderName(name);
		if (!normalizedName || normalizedName === "authorization") continue;
		const value = await resolveSecretString({
			config: params.config,
			value: rawValue,
			path: `models.providers.*.headers.${normalizedName}`
		});
		if (!value) continue;
		headers[normalizedName] = value;
	}
	if (params.apiKey) headers.authorization = `Bearer ${params.apiKey}`;
	return headers;
}
function isSensitiveHeaderName(name) {
	return name === "authorization" || name === "proxy-authorization" || name.includes("api-key") || name.includes("token") || name.includes("secret");
}
function sanitizeCacheHeaders(headers) {
	const safeHeaders = Object.fromEntries(Object.entries(headers).filter(([name]) => !isSensitiveHeaderName(name)));
	return Object.keys(safeHeaders).length > 0 ? safeHeaders : void 0;
}
async function resolveSecretString(params) {
	const resolved = await resolveConfiguredSecretInputString({
		config: params.config,
		env: process.env,
		value: params.value,
		path: params.path,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.unresolvedRefReason) throw new Error(resolved.unresolvedRefReason);
	return normalizeSecretInputString(resolved.value);
}
async function resolveRemoteApiKey(config, value) {
	return await resolveSecretString({
		config,
		value,
		path: "agents.*.memorySearch.remote.apiKey"
	});
}
function isOpenAICompatibleProviderConfig(id, provider) {
	return normalizeProviderId(id) === "openai-compatible" || OPENAI_COMPATIBLE_MODEL_APIS.has(normalizeProviderId(provider.api ?? "")) || !provider.api && typeof provider.baseUrl === "string" && provider.baseUrl.trim().length > 0;
}
function resolveConfiguredProvider(options) {
	const providers = options.config.models?.providers;
	if (!providers) return;
	const providerId = options.provider?.trim() || "openai-compatible";
	const normalizedProviderId = normalizeProviderId(providerId);
	const entry = providers[providerId] ?? Object.entries(providers).find(([candidateId]) => normalizeProviderId(candidateId) === normalizedProviderId)?.[1];
	return entry && isOpenAICompatibleProviderConfig(providerId, entry) ? entry : void 0;
}
function embeddingInputToText(input) {
	if (typeof input === "string") return input;
	if (!input.parts || input.parts.length === 0) return input.text;
	const textParts = [];
	for (const part of input.parts) {
		if (part.type !== "text") throw new Error("openai-compatible embeddings only support text embedding inputs.");
		textParts.push(part.text);
	}
	return textParts.join("");
}
function asRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
function malformedEmbeddingResponse() {
	return /* @__PURE__ */ new Error("openai-compatible embeddings failed: malformed JSON response");
}
function readEmbeddingVector(value) {
	if (!Array.isArray(value)) throw malformedEmbeddingResponse();
	for (const entry of value) if (typeof entry !== "number" || !Number.isFinite(entry)) throw malformedEmbeddingResponse();
	return value;
}
function readEmbeddingVectors(payload, expectedCount) {
	if (!Array.isArray(payload.data) || payload.data.length !== expectedCount) throw malformedEmbeddingResponse();
	return payload.data.map((entry) => {
		const record = asRecord(entry);
		if (!record) throw malformedEmbeddingResponse();
		return readEmbeddingVector(record.embedding);
	});
}
async function readJsonResponse(response) {
	try {
		return await response.json();
	} catch (cause) {
		throw new Error("openai-compatible embeddings failed: malformed JSON response", { cause });
	}
}
function concatBytes(chunks, totalLength) {
	const combined = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		combined.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return combined;
}
async function readEmbeddingErrorBodySnippet(response) {
	if (!response.body || response.bodyUsed) return;
	const reader = response.body.getReader();
	const chunks = [];
	let totalLength = 0;
	let truncated = false;
	try {
		while (totalLength < EMBEDDING_ERROR_BODY_MAX_BYTES) {
			const next = await reader.read();
			if (next.done) break;
			const remaining = EMBEDDING_ERROR_BODY_MAX_BYTES - totalLength;
			if (next.value.byteLength > remaining) {
				chunks.push(next.value.slice(0, remaining));
				totalLength += remaining;
				truncated = true;
				await reader.cancel().catch(() => void 0);
				break;
			}
			chunks.push(next.value);
			totalLength += next.value.byteLength;
			if (totalLength >= EMBEDDING_ERROR_BODY_MAX_BYTES) {
				truncated = true;
				await reader.cancel().catch(() => void 0);
				break;
			}
		}
	} catch {
		await reader.cancel().catch(() => void 0);
		return;
	} finally {
		reader.releaseLock();
	}
	if (totalLength === 0) return;
	const text = new TextDecoder().decode(concatBytes(chunks, totalLength));
	if (text.length > EMBEDDING_ERROR_BODY_MAX_CHARS) return `${text.slice(0, EMBEDDING_ERROR_BODY_MAX_CHARS)}${EMBEDDING_ERROR_TRUNCATED_SUFFIX}`;
	return truncated ? `${text}${EMBEDDING_ERROR_TRUNCATED_SUFFIX}` : text;
}
async function createEmbeddingHttpError(response) {
	const snippet = await readEmbeddingErrorBodySnippet(response);
	return /* @__PURE__ */ new Error(`openai-compatible embeddings failed: HTTP ${response.status}${snippet ? `: ${snippet}` : ""}`);
}
async function postEmbeddingRequest(params) {
	const { client, input } = params;
	const inputType = resolveRequestInputType(client, params.inputType);
	const body = {
		model: client.model,
		input,
		...typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {},
		...inputType ? { input_type: inputType } : {}
	};
	const { response, release } = await fetchWithSsrFGuard({
		url: `${client.baseUrl}/embeddings`,
		init: {
			method: "POST",
			headers: client.headers,
			body: JSON.stringify(body)
		},
		signal: params.signal,
		policy: client.ssrfPolicy,
		auditContext: "embedding-provider:openai-compatible"
	});
	try {
		if (!response.ok) throw await createEmbeddingHttpError(response);
		return readEmbeddingVectors(await readJsonResponse(response), input.length);
	} finally {
		await release();
	}
}
/** Creates a normalized OpenAI-compatible embedding client from runtime config. */
async function createOpenAICompatibleEmbeddingClient(options) {
	const configuredProvider = resolveConfiguredProvider(options);
	const baseUrl = normalizeBaseUrl(normalizeOptionalString$1(options.remote?.baseUrl) ?? configuredProvider?.baseUrl);
	const model = normalizeModel(options.model, options.provider);
	const apiKey = await resolveRemoteApiKey(options.config, chooseSecretInputOverride(options.remote?.apiKey, configuredProvider?.apiKey));
	const inputType = normalizeOptionalInputType(options.inputType);
	const queryInputType = normalizeOptionalInputType(options.queryInputType);
	const documentInputType = normalizeOptionalInputType(options.documentInputType);
	return {
		baseUrl,
		headers: await buildHeaders({
			config: options.config,
			apiKey,
			extra: {
				...configuredProvider?.headers,
				...options.remote?.headers
			}
		}),
		ssrfPolicy: ssrfPolicyFromHttpBaseUrlAllowedHostname(baseUrl),
		model,
		...options.dimensions !== void 0 ? { dimensions: normalizeDimensions(options.dimensions) } : {},
		...inputType ? { inputType } : {},
		...queryInputType ? { queryInputType } : {},
		...documentInputType ? { documentInputType } : {}
	};
}
/** Creates an OpenAI-compatible embedding provider and its backing client. */
async function createOpenAICompatibleEmbeddingProvider(options) {
	const client = await createOpenAICompatibleEmbeddingClient(options);
	const embedBatch = async (inputs, callOptions) => {
		if (inputs.length === 0) return [];
		return await postEmbeddingRequest({
			client,
			input: inputs.map(embeddingInputToText),
			signal: callOptions?.signal,
			inputType: callOptions?.inputType
		});
	};
	return {
		provider: {
			id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
			model: client.model,
			...typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {},
			embed: async (input, callOptions) => {
				const [embedding] = await embedBatch([input], callOptions);
				if (!embedding) throw malformedEmbeddingResponse();
				return embedding;
			},
			embedBatch
		},
		client
	};
}
/** Embedding provider adapter for OpenAI-compatible remote embedding APIs. */
const openAICompatibleEmbeddingProviderAdapter = {
	id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
	transport: "remote",
	create: async (options) => {
		const { provider, client } = await createOpenAICompatibleEmbeddingProvider(options);
		const cacheHeaders = sanitizeCacheHeaders(client.headers);
		return {
			provider,
			runtime: {
				id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
				inlineBatchTimeoutMs: 10 * 6e4,
				cacheKeyData: {
					provider: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
					baseUrl: client.baseUrl,
					model: client.model,
					...typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {},
					...client.inputType ? { inputType: client.inputType } : {},
					...client.queryInputType ? { queryInputType: client.queryInputType } : {},
					...client.documentInputType ? { documentInputType: client.documentInputType } : {},
					...cacheHeaders ? { headers: cacheHeaders } : {}
				}
			}
		};
	}
};
//#endregion
//#region src/plugins/embedding-providers.ts
const EMBEDDING_PROVIDERS_KEY = Symbol.for("openclaw.embeddingProviders");
const CORE_EMBEDDING_PROVIDERS = [{
	adapter: openAICompatibleEmbeddingProviderAdapter,
	ownerPluginId: "core"
}];
function getEmbeddingProviders() {
	const globalStore = globalThis;
	const existing = globalStore[EMBEDDING_PROVIDERS_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[EMBEDDING_PROVIDERS_KEY] = created;
	return created;
}
function getCoreEmbeddingProvider(id) {
	return CORE_EMBEDDING_PROVIDERS.find((entry) => entry.adapter.id === id);
}
/** Registers an embedding provider adapter for plugin and built-in memory callers. */
function registerEmbeddingProvider(adapter, options) {
	const coreEntry = getCoreEmbeddingProvider(adapter.id);
	if (coreEntry) {
		if (adapter !== coreEntry.adapter) throw new Error(`embedding provider already registered: ${adapter.id} (owner: core)`);
		getEmbeddingProviders().delete(adapter.id);
		return;
	}
	getEmbeddingProviders().set(adapter.id, {
		adapter,
		ownerPluginId: options?.ownerPluginId
	});
}
/** Looks up the registered embedding provider entry, including owner metadata. */
function getRegisteredEmbeddingProvider(id) {
	return getCoreEmbeddingProvider(id) ?? getEmbeddingProviders().get(id);
}
/** Lists registered embedding providers with core defaults merged first. */
function listRegisteredEmbeddingProviders() {
	const merged = new Map(CORE_EMBEDDING_PROVIDERS.map((entry) => [entry.adapter.id, entry]));
	for (const entry of getEmbeddingProviders().values()) if (!merged.has(entry.adapter.id)) merged.set(entry.adapter.id, entry);
	return Array.from(merged.values());
}
/** Replaces non-core embedding providers while preserving registration metadata. */
function restoreRegisteredEmbeddingProviders(entries) {
	getEmbeddingProviders().clear();
	for (const entry of entries) registerEmbeddingProvider(entry.adapter, { ownerPluginId: entry.ownerPluginId });
}
/** Clears non-core embedding providers from the process registry. */
function clearEmbeddingProviders() {
	getEmbeddingProviders().clear();
}
//#endregion
//#region src/plugins/memory-embedding-providers.ts
const MEMORY_EMBEDDING_PROVIDERS_KEY = Symbol.for("openclaw.memoryEmbeddingProviders");
function getMemoryEmbeddingProviders() {
	const globalStore = globalThis;
	const existing = globalStore[MEMORY_EMBEDDING_PROVIDERS_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[MEMORY_EMBEDDING_PROVIDERS_KEY] = created;
	return created;
}
/** Registers a memory embedding provider adapter for the current process. */
function registerMemoryEmbeddingProvider(adapter, options) {
	getMemoryEmbeddingProviders().set(adapter.id, {
		adapter,
		ownerPluginId: options?.ownerPluginId
	});
}
/** Returns a registered memory embedding provider entry. */
function getRegisteredMemoryEmbeddingProvider(id) {
	return getMemoryEmbeddingProviders().get(id);
}
/** Returns only the memory embedding provider adapter. */
function getMemoryEmbeddingProvider(id) {
	return getMemoryEmbeddingProviders().get(id)?.adapter;
}
/** Lists registered memory embedding provider entries. */
function listRegisteredMemoryEmbeddingProviders() {
	return Array.from(getMemoryEmbeddingProviders().values());
}
/** Lists registered memory embedding provider adapters. */
function listMemoryEmbeddingProviders() {
	return listRegisteredMemoryEmbeddingProviders().map((entry) => entry.adapter);
}
/** Replaces registered memory embedding providers while preserving metadata. */
function restoreRegisteredMemoryEmbeddingProviders(entries) {
	getMemoryEmbeddingProviders().clear();
	for (const entry of entries) registerMemoryEmbeddingProvider(entry.adapter, { ownerPluginId: entry.ownerPluginId });
}
/** Clears registered memory embedding providers. */
function clearMemoryEmbeddingProviders() {
	getMemoryEmbeddingProviders().clear();
}
//#endregion
//#region src/agents/code-mode-json.ts
function toCodeModeJsonSafe(value) {
	if (value === void 0) return null;
	try {
		const serialized = JSON.stringify(value);
		return serialized === void 0 ? null : JSON.parse(serialized);
	} catch {
		if (value instanceof Error) return {
			name: value.name,
			message: value.message
		};
		if (value === null) return null;
		switch (typeof value) {
			case "string":
			case "number":
			case "boolean": return value;
			case "bigint":
			case "symbol":
			case "function": return String(value);
			default: return Object.prototype.toString.call(value);
		}
	}
}
//#endregion
//#region src/agents/code-mode-namespaces.ts
/**
* Registry and runtime projection for code-mode namespaces. Plugins register
* namespaced tool scopes here; code mode receives descriptors, virtual API
* files, and a guarded invocation runtime.
*/
const FORBIDDEN_NAMESPACE_PATH_SEGMENTS = new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
const NAMESPACE_PATH_KEY_SEPARATOR = "\0";
const CODE_MODE_NAMESPACE_TOOL_CALL = Symbol.for("openclaw.codeMode.namespaceToolCall");
const RESERVED_NAMESPACE_GLOBALS = new Set([
	"ALL_TOOLS",
	"API",
	"Array",
	"Boolean",
	"Date",
	"Error",
	"globalThis",
	"json",
	"JSON",
	"Map",
	"Math",
	"MCP",
	"namespaces",
	"Number",
	"Object",
	"Promise",
	"Set",
	"String",
	"text",
	"tools",
	"yield_control"
]);
const CODE_MODE_NAMESPACE_REGISTRY_KEY = Symbol.for("openclaw.codeMode.namespaces");
const globalWithRegistry = globalThis;
const registryState = globalWithRegistry[CODE_MODE_NAMESPACE_REGISTRY_KEY] ?? (globalWithRegistry[CODE_MODE_NAMESPACE_REGISTRY_KEY] = { registrations: /* @__PURE__ */ new Map() });
function createCodeModeNamespaceCatalogTool(catalogId, toolName, input) {
	const normalizedCatalogId = catalogId.trim();
	const normalizedToolName = toolName.trim();
	if (!normalizedCatalogId) throw new Error("Code mode namespace catalogId must be non-empty.");
	if (!normalizedToolName) throw new Error("Code mode namespace toolName must be non-empty.");
	return {
		[CODE_MODE_NAMESPACE_TOOL_CALL]: true,
		catalogId: normalizedCatalogId,
		toolName: normalizedToolName,
		...input ? { input } : {}
	};
}
function createCodeModeNamespaceLocalFunction(toolName, input) {
	const normalizedToolName = toolName.trim();
	if (!normalizedToolName) throw new Error("Code mode namespace local function name must be non-empty.");
	return {
		[CODE_MODE_NAMESPACE_TOOL_CALL]: true,
		toolName: normalizedToolName,
		local: true,
		input
	};
}
function isCodeModeNamespaceToolCall(value) {
	const record = isRecord(value) ? value : void 0;
	return record?.[CODE_MODE_NAMESPACE_TOOL_CALL] === true && typeof record.toolName === "string" && record.toolName.trim().length > 0;
}
/** Lists registered namespaces in deterministic id order. */
function listCodeModeNamespaces() {
	return [...registryState.registrations.values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
/** Clears namespace registrations owned by one plugin. */
function clearCodeModeNamespacesForPlugin(pluginId) {
	const normalized = pluginId.trim();
	for (const registration of registryState.registrations.values()) if (registration.pluginId === normalized) registryState.registrations.delete(registration.id);
}
function promptForRegistration(registration, ctx) {
	const prompt = typeof registration.prompt === "function" ? registration.prompt(ctx) : registration.prompt;
	return typeof prompt === "string" && prompt.trim() ? prompt.trim() : void 0;
}
function registrationHasVisibleRequiredTools(registration, catalog) {
	const ownedVisibleToolNames = new Set(catalog.filter((entry) => entry.sourceName === registration.pluginId).map((entry) => entry.name));
	return registration.requiredToolNames.every((toolName) => ownedVisibleToolNames.has(toolName));
}
function filterRegistrationsByVisibleTools(catalog) {
	return listCodeModeNamespaces().filter((registration) => registrationHasVisibleRequiredTools(registration, catalog));
}
function toIdentifier(value, fallback) {
	const words = value.trim().split(/[^A-Za-z0-9]+/u).map((word) => word.trim()).filter(Boolean);
	const safe = (words.length === 0 ? fallback : words.map((word, index) => index === 0 ? word.charAt(0).toLowerCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1)).join("")).replace(/^[^A-Za-z_$]+/u, "").replace(/[^A-Za-z0-9_$]/gu, "");
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(safe) ? safe : fallback;
}
function uniqueIdentifier(base, used) {
	let candidate = base;
	let index = 2;
	while (used.has(candidate) || RESERVED_NAMESPACE_GLOBALS.has(candidate) || FORBIDDEN_NAMESPACE_PATH_SEGMENTS.has(candidate)) {
		candidate = `${base}${index}`;
		index += 1;
	}
	used.add(candidate);
	return candidate;
}
function readSchemaRecord(schema) {
	return isRecord(schema) ? schema : void 0;
}
function readSchemaProperties(schema) {
	const record = readSchemaRecord(schema);
	return isRecord(record?.properties) ? record.properties : {};
}
function readSchemaString(schema, key) {
	const value = readSchemaRecord(schema)?.[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readRequiredKeys(schema) {
	const record = readSchemaRecord(schema);
	return Array.isArray(record?.required) ? record.required.filter((entry) => typeof entry === "string") : [];
}
function orderedSchemaKeys(schema) {
	const required = readRequiredKeys(schema);
	const properties = Object.keys(readSchemaProperties(schema));
	return [...new Set([...required, ...properties])];
}
function applySchemaDefaults(schema, input) {
	const result = { ...input };
	for (const [key, descriptor] of Object.entries(readSchemaProperties(schema))) {
		if (!isRecord(descriptor) || !("default" in descriptor) || result[key] !== void 0) continue;
		result[key] = descriptor.default;
	}
	return result;
}
function mapMcpNamespaceInput(schema, args) {
	if (args.length > 1) throw new Error("MCP namespace tools accept one object argument.");
	const firstArg = args[0];
	const result = firstArg === void 0 ? {} : isRecord(firstArg) ? { ...firstArg } : {};
	if (firstArg !== void 0 && !isRecord(firstArg)) throw new Error("MCP namespace tools accept one object argument.");
	const withDefaults = applySchemaDefaults(schema, result);
	const missing = readRequiredKeys(schema).filter((key) => withDefaults[key] === void 0);
	if (missing.length > 0) throw new Error(`Missing required MCP namespace argument${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}`);
	return withDefaults;
}
function escapeDocComment(value) {
	return value.replace(/\*\//gu, "* /").trim();
}
function indent(lines, prefix) {
	return lines.map((line) => `${prefix}${line}`);
}
function renderDocComment(summary, params) {
	const lines = [];
	const docLines = normalizeDocLines(summary);
	if (docLines.length === 0 && params.length === 0) return lines;
	lines.push("/**");
	for (const line of docLines) lines.push(` * ${escapeDocComment(line)}`);
	if (docLines.length > 0 && params.length > 0) lines.push(" *");
	for (const param of params) {
		const description = collapseDocText(param.description);
		if (description) lines.push(` * @param ${param.name}${param.required ? "" : "?"} ${escapeDocComment(description)}`);
	}
	lines.push(" */");
	return lines;
}
function normalizeDocLines(value) {
	if (!value) return [];
	return value.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean).slice(0, 12);
}
function collapseDocText(value) {
	return normalizeDocLines(value).join(" ");
}
function schemaType(schema) {
	const record = readSchemaRecord(schema);
	if (!record) return "unknown";
	const enumValues = Array.isArray(record.enum) ? record.enum.filter((entry) => typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean") : [];
	if (enumValues.length > 0 && enumValues.length <= 16) return enumValues.map((entry) => JSON.stringify(entry)).join(" | ");
	const oneOf = Array.isArray(record.oneOf) ? record.oneOf : void 0;
	const anyOf = Array.isArray(record.anyOf) ? record.anyOf : void 0;
	const union = oneOf ?? anyOf;
	if (union && union.length > 0 && union.length <= 8) return union.map((entry) => schemaType(entry)).join(" | ");
	const type = record.type;
	if (Array.isArray(type)) return type.map((entry) => schemaType({
		...record,
		type: entry
	})).join(" | ");
	switch (type) {
		case "string": return "string";
		case "integer":
		case "number": return "number";
		case "boolean": return "boolean";
		case "array": return `${schemaType(record.items)}[]`;
		case "object": return renderInlineObjectType(record);
		case "null": return "null";
		default: return Object.keys(readSchemaProperties(schema)).length > 0 ? renderInlineObjectType(record) : "unknown";
	}
}
function tsPropertyName(name) {
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(name) ? name : JSON.stringify(name);
}
function renderInlineObjectType(schema) {
	const properties = readSchemaProperties(schema);
	const keys = Object.keys(properties);
	if (keys.length === 0) return "Record<string, unknown>";
	const required = new Set(readRequiredKeys(schema));
	return `{ ${keys.map((key) => `${tsPropertyName(key)}${required.has(key) ? "" : "?"}: ${schemaType(properties[key])}`).join("; ")} }`;
}
function buildMcpParamDocs(schema) {
	const required = new Set(readRequiredKeys(schema));
	return orderedSchemaKeys(schema).map((key) => {
		const descriptor = readSchemaProperties(schema)[key];
		const doc = {
			name: key,
			required: required.has(key),
			type: schemaType(descriptor)
		};
		const description = readSchemaString(descriptor, "description");
		if (description) doc.description = description;
		if (isRecord(descriptor) && "default" in descriptor) doc.defaultValue = descriptor.default;
		return doc;
	});
}
function renderMcpInputType(params) {
	if (params.length === 0) return ["input?: Record<string, never>"];
	const lines = ["input: {"];
	for (const param of params) {
		if (param.description || param.defaultValue !== void 0) {
			const description = collapseDocText(param.description);
			const suffix = param.defaultValue === void 0 ? "" : ` Default: ${JSON.stringify(param.defaultValue)}.`;
			lines.push(`  /** ${escapeDocComment(`${description}${suffix}`.trim())} */`);
		}
		lines.push(`  ${tsPropertyName(param.name)}${param.required ? "" : "?"}: ${param.type};`);
	}
	lines.push("}");
	return lines;
}
function renderMcpToolSignature(tool, functionName = tool.path.at(-1) ?? tool.method) {
	const lines = renderDocComment(tool.description, tool.params);
	lines.push(`function ${functionName}(`);
	lines.push(...indent(renderMcpInputType(tool.params), "  "));
	lines.push("): Promise<McpToolResult>;");
	return lines;
}
function renderMcpServerHeader(server, tools) {
	const lines = [
		"type McpApiHeader = { header: string; tools?: unknown[]; schemas?: Record<string, unknown> };",
		"",
		"type McpToolResult = {",
		"  content?: unknown[];",
		"  structuredContent?: unknown;",
		"  isError?: boolean;",
		"  [key: string]: unknown;",
		"};",
		"",
		`declare namespace MCP.${server.identifier} {`,
		"  /** Return this TypeScript-style API header. */",
		"  function $api(toolName?: string, options?: { schema?: boolean }): Promise<McpApiHeader>;"
	];
	const topLevelTools = tools.filter((tool) => tool.path.length === 1);
	const nestedTools = tools.filter((tool) => tool.path.length > 1);
	for (const tool of topLevelTools) {
		lines.push("");
		lines.push(...indent(renderMcpToolSignature(tool), "  "));
	}
	const nestedGroups = /* @__PURE__ */ new Map();
	for (const tool of nestedTools) {
		const groupName = tool.path[0] ?? "tools";
		nestedGroups.set(groupName, [...nestedGroups.get(groupName) ?? [], tool]);
	}
	for (const [groupName, groupTools] of [...nestedGroups.entries()].toSorted((a, b) => a[0].localeCompare(b[0]))) {
		lines.push("");
		lines.push(`  namespace ${groupName} {`);
		for (const tool of groupTools) {
			lines.push("");
			lines.push(...indent(renderMcpToolSignature(tool, tool.path.at(-1) ?? tool.method), "    "));
		}
		lines.push("  }");
	}
	lines.push("}");
	return lines.join("\n");
}
function renderMcpRootHeader(servers) {
	return [
		"type McpApiHeader = { header: string; servers?: unknown[] };",
		"",
		"declare const MCP: {",
		"  /** List visible MCP servers and request server-specific headers. */",
		"  $api(): Promise<McpApiHeader>;",
		...servers.map((server) => `  readonly ${server.identifier}: typeof MCP.${server.identifier};`),
		"};"
	].join("\n");
}
function renderMcpRootFile(servers) {
	return [
		...servers.map((server) => `/// <reference path="./${server.identifier}.d.ts" />`),
		"",
		renderMcpRootHeader(servers)
	].join("\n");
}
function buildMcpApiResponse(params) {
	const [selector, options] = params.args;
	const includeSchema = isRecord(options) && options.schema === true;
	if (!params.server) return {
		kind: "mcp_api",
		scope: "root",
		header: renderMcpRootHeader(params.servers),
		servers: params.servers.map((server) => ({
			identifier: server.identifier,
			serverName: server.serverName,
			toolCount: server.tools.length
		})),
		note: "Call MCP.<server>.$api() for a TypeScript-style header, then call tools with one object argument matching the shown input type."
	};
	const selected = typeof selector === "string" && selector.trim() ? params.server.tools.filter((tool) => tool.method === selector.trim() || tool.path.join(".") === selector.trim() || tool.mcpTool === selector.trim()) : params.server.tools;
	return {
		kind: "mcp_api",
		scope: selected.length === 1 ? "tool" : "server",
		server: {
			identifier: params.server.identifier,
			serverName: params.server.serverName
		},
		header: renderMcpServerHeader(params.server, selected),
		tools: selected.map((tool) => ({
			method: tool.method,
			path: tool.path,
			mcpTool: tool.mcpTool,
			operation: tool.operation,
			description: tool.description
		})),
		...includeSchema ? { schemas: Object.fromEntries(selected.map((tool) => [tool.method, tool.parameters])) } : {},
		note: "Call MCP tools with one object argument, for example MCP.server.tool({ requiredField: value })."
	};
}
function scopeAtPath(root, path) {
	let current = root;
	for (const segment of path) {
		const next = current[segment];
		if (!isRecord(next)) {
			const object = Object.create(null);
			current[segment] = object;
			current = object;
			continue;
		}
		current = next;
	}
	return current;
}
function toolIdentifiersForServer(usedToolIdentifiers, serverIdentifier) {
	const existing = usedToolIdentifiers.get(serverIdentifier);
	if (existing) return existing;
	const created = new Set([
		"$api",
		"resources",
		"prompts"
	]);
	usedToolIdentifiers.set(serverIdentifier, created);
	return created;
}
function createMcpNamespaceModel(catalog) {
	const mcpEntries = catalog.filter((entry) => entry.source === "mcp" && entry.id && entry.mcp);
	if (mcpEntries.length === 0) return;
	const serverNames = /* @__PURE__ */ new Map();
	const usedServerIdentifiers = /* @__PURE__ */ new Set();
	for (const entry of mcpEntries) {
		const safeServerName = entry.mcp?.safeServerName ?? entry.sourceName ?? "mcp";
		if (serverNames.has(safeServerName)) continue;
		serverNames.set(safeServerName, uniqueIdentifier(toIdentifier(safeServerName, "server"), usedServerIdentifiers));
	}
	const usedToolIdentifiers = /* @__PURE__ */ new Map();
	const root = Object.create(null);
	const serverDocs = /* @__PURE__ */ new Map();
	for (const entry of mcpEntries.toSorted((a, b) => (a.id ?? "").localeCompare(b.id ?? ""))) {
		const mcp = entry.mcp;
		if (!mcp || !entry.id) continue;
		const serverIdentifier = serverNames.get(mcp.safeServerName) ?? uniqueIdentifier("server", usedServerIdentifiers);
		const serverScope = scopeAtPath(root, [serverIdentifier]);
		serverScope.$serverName = mcp.serverName;
		let serverDoc = serverDocs.get(serverIdentifier);
		if (!serverDoc) {
			serverDoc = {
				identifier: serverIdentifier,
				serverName: mcp.serverName,
				tools: []
			};
			serverDocs.set(serverIdentifier, serverDoc);
		}
		const path = mcp.operation === "resources_list" ? ["resources", "list"] : mcp.operation === "resources_read" ? ["resources", "read"] : mcp.operation === "prompts_list" ? ["prompts", "list"] : mcp.operation === "prompts_get" ? ["prompts", "get"] : [uniqueIdentifier(toIdentifier(mcp.toolName, "tool"), toolIdentifiersForServer(usedToolIdentifiers, serverIdentifier))];
		const parent = scopeAtPath(serverScope, path.slice(0, -1));
		parent[path.at(-1) ?? "tool"] = createCodeModeNamespaceCatalogTool(entry.id, entry.name, (args) => mapMcpNamespaceInput(entry.parameters, args));
		serverDoc.tools.push({
			method: path.join("."),
			path,
			mcpTool: mcp.toolName,
			operation: mcp.operation,
			description: entry.description,
			parameters: entry.parameters,
			params: buildMcpParamDocs(entry.parameters)
		});
	}
	const docs = [...serverDocs.values()].map((server) => Object.assign({}, server, { tools: server.tools.toSorted((a, b) => a.method.localeCompare(b.method)) }));
	root.$api = createCodeModeNamespaceLocalFunction("$api", (args) => buildMcpApiResponse({
		servers: docs,
		args
	}));
	for (const server of docs) {
		const serverScope = scopeAtPath(root, [server.identifier]);
		serverScope.$api = createCodeModeNamespaceLocalFunction("$api", (args) => buildMcpApiResponse({
			servers: docs,
			server,
			args
		}));
	}
	return {
		root,
		docs
	};
}
function createMcpNamespaceScope(catalog) {
	return createMcpNamespaceModel(catalog)?.root;
}
/** Builds virtual API declaration files for visible MCP namespace tools. */
function createCodeModeApiVirtualFiles(catalog = []) {
	const model = createMcpNamespaceModel(catalog);
	if (!model) return [];
	const files = [{
		path: "mcp/index.d.ts",
		description: "Root MCP namespace declaration and server list.",
		content: renderMcpRootFile(model.docs)
	}];
	for (const server of model.docs) files.push({
		path: `mcp/${server.identifier}.d.ts`,
		description: `MCP server declaration for ${server.serverName}.`,
		content: renderMcpServerHeader(server, server.tools)
	});
	return files;
}
function createMcpNamespaceEntry(catalog) {
	const scope = createMcpNamespaceScope(catalog);
	if (!scope) return;
	const callablePaths = /* @__PURE__ */ new Set();
	return {
		registration: {
			id: "mcp",
			pluginId: "bundle-mcp",
			globalName: "MCP",
			requiredToolNames: [],
			description: "MCP server tools grouped by server.",
			createScope: () => scope
		},
		callablePaths,
		scope,
		descriptor: {
			id: "mcp",
			globalName: "MCP",
			description: "MCP server tools grouped by server.",
			scope: serializeNamespaceScopeValue(scope, [], /* @__PURE__ */ new WeakSet(), callablePaths)
		}
	};
}
function describeMcpNamespaceForPrompt(catalog) {
	const scope = createMcpNamespaceScope(catalog);
	if (!scope) return [];
	const servers = Object.entries(scope).filter(([, value]) => isRecord(value) && typeof value.$serverName === "string").map(([key]) => key).toSorted();
	if (servers.length === 0) return [];
	return [
		"- MCP: MCP server tools grouped by server.",
		`Read API files such as mcp/index.d.ts and mcp/<server>.d.ts for TypeScript-style MCP headers; visible servers: ${servers.join(", ")}.`,
		"Call MCP tools as MCP.<server>.<tool>({ ...input }) with one object argument matching the header."
	];
}
/** Builds system-prompt text describing visible code-mode namespace globals. */
function describeCodeModeNamespacesForPrompt(ctx, catalog) {
	if (!catalog) return "";
	const registrations = filterRegistrationsByVisibleTools(catalog);
	const mcpPrompt = describeMcpNamespaceForPrompt(catalog);
	if (registrations.length === 0 && mcpPrompt.length === 0) return "";
	const lines = ["Registered namespace globals are available in code mode:"];
	lines.push(...mcpPrompt);
	for (const registration of registrations) {
		const description = registration.description?.trim();
		lines.push(description ? `- ${registration.globalName}: ${description}` : `- ${registration.globalName}`);
		const prompt = promptForRegistration(registration, ctx);
		if (prompt) lines.push(prompt);
	}
	return lines.join("\n");
}
function assertNamespacePathSegment(segment) {
	if (!segment || segment.includes(NAMESPACE_PATH_KEY_SEPARATOR) || FORBIDDEN_NAMESPACE_PATH_SEGMENTS.has(segment)) throw new Error(`Invalid code mode namespace path segment: ${segment || "(empty)"}`);
}
function namespacePathKey(path) {
	return path.join(NAMESPACE_PATH_KEY_SEPARATOR);
}
function serializeNamespaceScopeValue(value, path = [], stack = /* @__PURE__ */ new WeakSet(), callablePaths = /* @__PURE__ */ new Set()) {
	if (isCodeModeNamespaceToolCall(value)) {
		callablePaths.add(namespacePathKey(path));
		return {
			kind: "function",
			path
		};
	}
	if (typeof value === "function") throw new Error(`Code mode namespace function at ${path.join(".") || "(root)"} must be created with createCodeModeNamespaceTool.`);
	if (value === null || typeof value !== "object") return {
		kind: "value",
		value: toCodeModeJsonSafe(value)
	};
	if (stack.has(value)) throw new Error(`Circular code mode namespace scope at ${path.join(".") || "(root)"}.`);
	stack.add(value);
	try {
		if (Array.isArray(value)) return {
			kind: "array",
			items: value.map((item, index) => serializeNamespaceScopeValue(item, [...path, String(index)], stack, callablePaths))
		};
		const entries = [];
		for (const [key, child] of Object.entries(value)) {
			assertNamespacePathSegment(key);
			entries.push([key, serializeNamespaceScopeValue(child, [...path, key], stack, callablePaths)]);
		}
		return {
			kind: "object",
			entries
		};
	} finally {
		stack.delete(value);
	}
}
function resolveNamespacePath(scope, path) {
	let current = scope;
	let parent = void 0;
	for (const segment of path) {
		assertNamespacePathSegment(segment);
		parent = current;
		if (!isRecord(current) && !Array.isArray(current)) return {
			target: void 0,
			parent
		};
		current = current[segment];
	}
	return {
		target: current,
		parent
	};
}
function readScope(value, id) {
	if (!isRecord(value)) throw new Error(`Code mode namespace "${id}" createScope must return an object.`);
	return value;
}
/** Creates the runtime descriptor/invocation layer for visible namespaces. */
async function createCodeModeNamespaceRuntime(ctx, catalog = []) {
	const entries = [];
	const mcpEntry = createMcpNamespaceEntry(catalog);
	if (mcpEntry) entries.push(mcpEntry);
	for (const registration of listCodeModeNamespaces()) {
		if (!registrationHasVisibleRequiredTools(registration, catalog)) continue;
		const scope = readScope(await registration.createScope(ctx), registration.id);
		const callablePaths = /* @__PURE__ */ new Set();
		entries.push({
			registration,
			callablePaths,
			scope,
			descriptor: {
				id: registration.id,
				globalName: registration.globalName,
				...registration.description?.trim() ? { description: registration.description.trim() } : {},
				scope: serializeNamespaceScopeValue(scope, [], /* @__PURE__ */ new WeakSet(), callablePaths)
			}
		});
	}
	const byId = new Map(entries.map((entry) => [entry.registration.id, entry]));
	return {
		descriptors: entries.map((entry) => entry.descriptor),
		async invoke(namespaceId, path, args, executeTool) {
			const entry = byId.get(namespaceId);
			if (!entry) throw new Error(`Unknown code mode namespace: ${namespaceId}`);
			for (const segment of path) assertNamespacePathSegment(segment);
			if (!entry.callablePaths.has(namespacePathKey(path))) throw new Error(`Code mode namespace path is not callable: ${path.join(".")}`);
			const { target } = resolveNamespacePath(entry.scope, path);
			if (!isCodeModeNamespaceToolCall(target)) throw new Error(`Code mode namespace path is not callable: ${path.join(".")}`);
			const input = target.input ? await target.input(args) : args[0] ?? {};
			if (target.local) return toCodeModeJsonSafe(input);
			if (!target.catalogId && !entry.registration.requiredToolNames.includes(target.toolName)) throw new Error(`Code mode namespace path targets undeclared tool: ${target.toolName}`);
			return toCodeModeJsonSafe(await executeTool({
				pluginId: entry.registration.pluginId,
				toolName: target.toolName,
				...target.catalogId ? { catalogId: target.catalogId } : {},
				input,
				namespaceId,
				path: [...path]
			}));
		}
	};
}
//#endregion
//#region src/plugins/agent-event-emission.ts
const HOST_OWNED_AGENT_EVENT_STREAMS = new Set([
	"lifecycle",
	"tool",
	"assistant",
	"error",
	"item",
	"plan",
	"approval",
	"command_output",
	"patch",
	"compaction",
	"thinking",
	"model"
]);
function isPluginOwnedAgentEventStream(pluginId, stream) {
	return stream === pluginId || stream.startsWith(`${pluginId}.`);
}
function normalizePluginEventData(params) {
	if (params.data && typeof params.data === "object" && !Array.isArray(params.data)) return {
		...params.data,
		pluginId: params.pluginId,
		...params.pluginName ? { pluginName: params.pluginName } : {}
	};
	return {
		value: params.data,
		pluginId: params.pluginId,
		...params.pluginName ? { pluginName: params.pluginName } : {}
	};
}
function emitPluginAgentEvent(params) {
	const runId = normalizeOptionalString$2(params.event.runId);
	const sessionKey = normalizeOptionalString$2(params.event.sessionKey);
	const stream = normalizeOptionalString$2(params.event.stream);
	if (!runId || !stream) return {
		emitted: false,
		reason: "runId and stream are required"
	};
	if (!isPluginJsonValue(params.event.data)) return {
		emitted: false,
		reason: "event data must be JSON-compatible"
	};
	if (params.origin !== "bundled" && HOST_OWNED_AGENT_EVENT_STREAMS.has(stream)) return {
		emitted: false,
		reason: `stream ${stream} is reserved for bundled plugins`
	};
	if (params.origin !== "bundled" && !isPluginOwnedAgentEventStream(params.pluginId, stream)) return {
		emitted: false,
		reason: `stream ${stream} must be scoped to plugin ${params.pluginId}`
	};
	emitAgentEvent({
		runId,
		stream,
		...sessionKey ? { sessionKey } : {},
		data: normalizePluginEventData({
			pluginId: params.pluginId,
			pluginName: params.pluginName,
			data: params.event.data
		})
	});
	return {
		emitted: true,
		stream
	};
}
//#endregion
//#region src/plugins/validation-diagnostics.ts
/** Pushes a normalized plugin validation diagnostic. */
function pushPluginValidationDiagnostic(params) {
	params.pushDiagnostic({
		level: params.level,
		pluginId: params.pluginId,
		source: params.source,
		message: params.message
	});
}
//#endregion
//#region src/plugins/channel-validation.ts
function resolveBundledChannelMeta(id) {
	return listChatChannels().find((meta) => meta?.id === id) ?? resolveGeneratedBundledChannelMeta(id);
}
function resolveGeneratedBundledChannelMeta(id) {
	const channel = GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.find((entry) => entry.channelId === id && entry.configurable !== false);
	const label = normalizeOptionalString$2(channel?.label);
	if (!channel || !label) return;
	return {
		id,
		label,
		selectionLabel: label,
		docsPath: `/channels/${id}`,
		blurb: normalizeOptionalString$2(channel.description) ?? ""
	};
}
function collectMissingChannelMetaFields(meta) {
	const missing = [];
	if (!normalizeOptionalString$2(meta?.label)) missing.push("label");
	if (!normalizeOptionalString$2(meta?.selectionLabel)) missing.push("selectionLabel");
	if (!normalizeOptionalString$2(meta?.docsPath)) missing.push("docsPath");
	if (typeof meta?.blurb !== "string") missing.push("blurb");
	return missing;
}
/** Validates and normalizes a channel plugin registration before runtime catalog insertion. */
function normalizeRegisteredChannelPlugin(params) {
	const id = normalizeOptionalString$2(params.plugin?.id) ?? normalizeStringifiedOptionalString(params.plugin?.id) ?? "";
	if (!id) {
		pushPluginValidationDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: "channel registration missing id",
			pushDiagnostic: params.pushDiagnostic
		});
		return null;
	}
	if (typeof params.plugin.config?.listAccountIds !== "function" || typeof params.plugin.config?.resolveAccount !== "function") {
		pushPluginValidationDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: `channel "${id}" registration missing required config helpers`,
			pushDiagnostic: params.pushDiagnostic
		});
		return null;
	}
	const rawMeta = params.plugin.meta;
	const rawMetaId = normalizeOptionalString$2(rawMeta?.id);
	if (rawMetaId && rawMetaId !== id) pushPluginValidationDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `channel "${id}" meta.id mismatch ("${rawMetaId}"); using registered channel id`,
		pushDiagnostic: params.pushDiagnostic
	});
	const missingFields = collectMissingChannelMetaFields(rawMeta);
	if (missingFields.length > 0) pushPluginValidationDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `channel "${id}" registered incomplete metadata; filled missing ${missingFields.join(", ")}`,
		pushDiagnostic: params.pushDiagnostic
	});
	return {
		...params.plugin,
		id,
		meta: normalizeChannelMeta({
			id,
			meta: rawMeta,
			existing: resolveBundledChannelMeta(id)
		})
	};
}
/** Lists active Codex app-server extension factories from the plugin registry. */
function listCodexAppServerExtensionFactories() {
	return getActivePluginRegistry()?.codexAppServerExtensionFactories?.map((entry) => entry.factory) ?? [];
}
//#endregion
//#region src/plugins/host-hook-attachments.ts
const DEFAULT_ATTACHMENT_MAX_BYTES = 25 * 1024 * 1024;
/** Filesystem adapter used by attachment MIME probes and tests. */
const attachmentProbeFs = { open: (...args) => fsPromises.open(...args) };
const MAX_ATTACHMENT_FILES = 10;
let sendMessagePromise;
async function loadSendMessage() {
	sendMessagePromise ??= import("./message-_60ZWcMF.js").then((module) => module.sendMessage);
	return sendMessagePromise;
}
let getChannelPluginPromise;
async function loadGetChannelPlugin() {
	getChannelPluginPromise ??= import("./plugins-C0wG73MZ.js").then((module) => module.getChannelPlugin);
	return getChannelPluginPromise;
}
function captionFormatToParseMode(captionFormat) {
	if (captionFormat === "html") return "HTML";
}
function escapeHtmlText(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
async function readMimeSniffBuffer(filePath, size) {
	let handle;
	try {
		handle = await attachmentProbeFs.open(filePath, "r");
		const length = Math.min(Math.max(0, size), FILE_TYPE_SNIFF_MAX_BYTES);
		const buffer = Buffer.alloc(length);
		const { bytesRead } = await handle.read(buffer, 0, length, 0);
		return buffer.subarray(0, bytesRead);
	} catch (error) {
		return { error: `attachment file MIME read failed for ${filePath}: ${formatErrorMessage(error)}` };
	} finally {
		await handle?.close().catch(() => void 0);
	}
}
/** Resolves channel-specific attachment delivery options from caption format and hints. */
function resolveAttachmentDelivery(params) {
	const fallbackParseMode = captionFormatToParseMode(params.captionFormat);
	const channel = params.channel.trim().toLowerCase();
	if (channel === "telegram") {
		const hint = params.channelHints?.telegram;
		const parseMode = hint?.parseMode ?? (params.captionFormat === "plain" ? "HTML" : fallbackParseMode);
		const escapePlainHtmlCaption = params.captionFormat === "plain" && parseMode === "HTML";
		const forceDocumentMime = normalizeMimeType(hint?.forceDocumentMime);
		return {
			...parseMode ? { parseMode } : {},
			...escapePlainHtmlCaption ? { escapePlainHtmlCaption: true } : {},
			...hint?.disableNotification !== void 0 ? { disableNotification: hint.disableNotification } : {},
			...forceDocumentMime ? { forceDocumentMime } : {}
		};
	}
	if (channel === "discord") return fallbackParseMode ? { parseMode: fallbackParseMode } : {};
	if (channel === "slack") {
		const hint = params.channelHints?.slack;
		const threadTs = normalizeOptionalString$2(hint?.threadTs);
		return {
			...fallbackParseMode ? { parseMode: fallbackParseMode } : {},
			...threadTs ? { threadTs } : {}
		};
	}
	return fallbackParseMode ? { parseMode: fallbackParseMode } : {};
}
async function validateAttachmentFiles(files, maxBytes, options) {
	if (files.length > MAX_ATTACHMENT_FILES) return { error: `at most ${MAX_ATTACHMENT_FILES} attachment files are allowed` };
	const paths = [];
	let totalBytes = 0;
	for (const file of files) {
		if (!file || typeof file !== "object" || Array.isArray(file)) return { error: "attachment file entry must be an object" };
		const filePath = normalizeOptionalString$2(file.path);
		if (!filePath) return { error: "attachment file path is required" };
		const resolvedPath = resolveAttachmentFilePath({
			filePath,
			config: options?.config,
			sessionKey: options?.sessionKey
		});
		const info = await lstat(resolvedPath).catch(() => void 0);
		if (info?.isSymbolicLink()) return { error: `attachment file symlinks are not allowed: ${resolvedPath}` };
		if (!info?.isFile()) return { error: `attachment file not found: ${resolvedPath}` };
		if (info.size > maxBytes) return { error: `attachment file exceeds ${maxBytes} bytes: ${resolvedPath}` };
		if (options?.forceDocumentMime) {
			const fileBuffer = await readMimeSniffBuffer(resolvedPath, info.size);
			if (!Buffer.isBuffer(fileBuffer)) return fileBuffer;
			let detectedMime;
			try {
				detectedMime = normalizeMimeType(await detectMime({ buffer: fileBuffer }));
			} catch (error) {
				return { error: `attachment file MIME detection failed for ${filePath}: ` + formatErrorMessage(error) };
			}
			if (detectedMime !== options.forceDocumentMime) return { error: `attachment file MIME mismatch for ${resolvedPath}: expected ${options.forceDocumentMime}, got ${detectedMime ?? "unknown"}` };
		}
		totalBytes += info.size;
		if (totalBytes > maxBytes) return { error: `attachment files exceed ${maxBytes} bytes total` };
		paths.push(resolvedPath);
	}
	return paths;
}
function resolveAttachmentFilePath(params) {
	const workspaceDir = params.sessionKey && params.config ? resolveAgentWorkspaceDir(params.config, resolveAgentIdFromSessionKey(params.sessionKey)) : void 0;
	return resolvePathFromInput(params.filePath, resolveWorkspaceRoot(workspaceDir));
}
function normalizeOptionalThreadId(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	return normalizeOptionalString$2(value);
}
/** Resolves the thread id used when delivering a plugin session attachment. */
function resolveSessionAttachmentThreadId(params) {
	return params.hintThreadTs ?? normalizeOptionalThreadId(params.explicitThreadId) ?? normalizeOptionalThreadId(params.fallbackThreadId) ?? normalizeOptionalThreadId(params.deliveryThreadId);
}
/** Sends a bundled-plugin session attachment through the session's active delivery route. */
async function sendPluginSessionAttachment(params) {
	if (params.origin !== "bundled") return {
		ok: false,
		error: "session attachments are restricted to bundled plugins"
	};
	const sessionKey = normalizeOptionalString$2(params.sessionKey);
	if (!sessionKey) return {
		ok: false,
		error: "sessionKey is required"
	};
	if (!Array.isArray(params.files) || params.files.length === 0) return {
		ok: false,
		error: "at least one attachment file is required"
	};
	const maxBytes = typeof params.maxBytes === "number" && Number.isFinite(params.maxBytes) ? Math.min(DEFAULT_ATTACHMENT_MAX_BYTES, Math.max(1, Math.floor(params.maxBytes))) : DEFAULT_ATTACHMENT_MAX_BYTES;
	const { deliveryContext, threadId } = extractDeliveryInfo(sessionKey, { cfg: params.config });
	if (!deliveryContext?.channel || !deliveryContext.to) return {
		ok: false,
		error: `session has no active delivery route: ${sessionKey}`
	};
	const normalizedChannel = normalizeMessageChannel(deliveryContext.channel);
	try {
		if ((normalizedChannel && isDeliverableMessageChannel(normalizedChannel) ? (await loadGetChannelPlugin())(normalizedChannel) : void 0)?.outbound?.deliveryMode === "gateway") return {
			ok: false,
			error: `session attachments require direct outbound delivery for channel ${deliveryContext.channel}; channel uses gateway delivery`
		};
	} catch (error) {
		return {
			ok: false,
			error: `attachment delivery setup failed: ${formatErrorMessage(error)}`
		};
	}
	const rawText = normalizeOptionalString$2(params.text) ?? "";
	const resolvedDelivery = resolveAttachmentDelivery({
		channel: deliveryContext.channel,
		captionFormat: params.captionFormat,
		channelHints: params.channelHints
	});
	const validated = await validateAttachmentFiles(params.files, maxBytes, {
		forceDocumentMime: resolvedDelivery.forceDocumentMime,
		config: params.config,
		sessionKey
	});
	if (!Array.isArray(validated)) return {
		ok: false,
		error: validated.error
	};
	const resolvedThreadId = resolveSessionAttachmentThreadId({
		deliveryThreadId: deliveryContext.threadId,
		explicitThreadId: params.threadId,
		fallbackThreadId: threadId,
		hintThreadTs: resolvedDelivery.threadTs
	});
	let result;
	try {
		result = await (await loadSendMessage())({
			to: deliveryContext.to,
			content: resolvedDelivery.escapePlainHtmlCaption ? escapeHtmlText(rawText) : rawText,
			channel: deliveryContext.channel,
			accountId: deliveryContext.accountId,
			threadId: resolvedThreadId,
			requesterSessionKey: sessionKey,
			mediaUrls: validated,
			forceDocument: resolvedDelivery.forceDocumentMime ? true : params.forceDocument,
			bestEffort: false,
			cfg: params.config,
			...resolvedDelivery.parseMode ? { parseMode: resolvedDelivery.parseMode } : {},
			...resolvedDelivery.disableNotification !== void 0 ? { silent: resolvedDelivery.disableNotification } : {}
		});
	} catch (error) {
		return {
			ok: false,
			error: `attachment delivery failed: ${formatErrorMessage(error)}`
		};
	}
	if (!result.result) return {
		ok: false,
		error: "attachment delivery failed: no delivery result returned"
	};
	return {
		ok: true,
		channel: result.channel,
		deliveredTo: deliveryContext.to,
		count: validated.length
	};
}
//#endregion
//#region src/plugins/host-hook-scheduled-turns.ts
const log$1 = createSubsystemLogger("plugins/host-scheduled-turns");
const PLUGIN_CRON_NAME_PREFIX = "plugin:";
const PLUGIN_CRON_TAG_MARKER = ":tag:";
function resolveSchedule(params) {
	const cron = normalizeOptionalString$2(params.cron);
	if (cron) {
		const tz = normalizeOptionalString$2(params.tz);
		return {
			kind: "cron",
			expr: cron,
			...tz ? { tz } : {}
		};
	}
	if ("delayMs" in params) {
		if (!Number.isFinite(params.delayMs) || params.delayMs < 0) return;
		const at = timestampMsToIsoString(resolveExpiresAtMsFromDurationMs(Math.max(1, Math.floor(params.delayMs))));
		if (!at) return;
		return {
			kind: "at",
			at
		};
	}
	const rawAt = params.at;
	const at = rawAt instanceof Date ? rawAt : new Date(rawAt);
	if (!Number.isFinite(at.getTime())) return;
	return {
		kind: "at",
		at: at.toISOString()
	};
}
function resolveSessionEventDeliveryMode(deliveryMode) {
	if (deliveryMode === void 0) return;
	if (deliveryMode === "none" || deliveryMode === "announce") return deliveryMode;
}
function formatScheduleLogContext(params) {
	const parts = [`pluginId=${params.pluginId}`];
	if (params.sessionKey) parts.push(`sessionKey=${params.sessionKey}`);
	if (params.name) parts.push(`name=${params.name}`);
	if (params.jobId) parts.push(`jobId=${params.jobId}`);
	return parts.join(" ");
}
async function removeScheduledSessionTurn(params) {
	try {
		return didCronCleanupJob(await params.cron.remove(params.jobId));
	} catch (error) {
		log$1.warn(`plugin session turn cleanup failed (${formatScheduleLogContext(params)}): ${formatErrorMessage(error)}`);
		return false;
	}
}
function didCronRemoveJob(value) {
	return isCronRemoveResult(value) && value.ok && value.removed;
}
function didCronCleanupJob(value) {
	return isCronRemoveResult(value) && value.ok;
}
const PLUGIN_CRON_RESERVED_DELIMITER = ":";
function resolvePluginSessionTurnTag(value) {
	const tag = normalizeOptionalString$2(value);
	if (!tag) return { invalid: false };
	if (tag.includes(PLUGIN_CRON_RESERVED_DELIMITER)) return { invalid: true };
	return {
		tag,
		invalid: false
	};
}
function buildPluginSchedulerCronName(params) {
	const uniqueId = params.uniqueId ?? randomUUID();
	if (!params.tag) return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}:${params.sessionKey}:${uniqueId}`;
	return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}${PLUGIN_CRON_TAG_MARKER}${params.tag}:${params.sessionKey}:${uniqueId}`;
}
function buildPluginSchedulerTagPrefix(params) {
	return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}${PLUGIN_CRON_TAG_MARKER}${params.tag}:${params.sessionKey}:`;
}
function isCronRemoveResult(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value) && typeof value.ok === "boolean" && typeof value.removed === "boolean";
}
async function listAllCronJobsForPluginTagCleanup(cron, query) {
	const jobs = [];
	let offset = 0;
	for (;;) {
		const listResult = await cron.listPage({
			includeDisabled: true,
			limit: 200,
			query,
			sortBy: "name",
			sortDir: "asc",
			...offset > 0 ? { offset } : {}
		});
		jobs.push(...listResult.jobs);
		if (!listResult.hasMore) return jobs;
		if (listResult.nextOffset === null || listResult.nextOffset <= offset) return jobs;
		offset = listResult.nextOffset;
	}
}
async function schedulePluginSessionTurn(params) {
	if (params.origin !== "bundled") return;
	const sessionKey = normalizeOptionalString$2(params.schedule.sessionKey);
	const message = normalizeOptionalString$2(params.schedule.message);
	if (!sessionKey || !message) return;
	const cronSchedule = resolveSchedule(params.schedule);
	if (!cronSchedule) return;
	const rawDeliveryMode = params.schedule.deliveryMode;
	const deliveryMode = resolveSessionEventDeliveryMode(rawDeliveryMode);
	const scheduleName = normalizeOptionalString$2(params.schedule.name);
	if (rawDeliveryMode !== void 0 && !deliveryMode) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): unsupported deliveryMode`);
		return;
	}
	if (cronSchedule.kind === "cron" && params.schedule.deleteAfterRun === true) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): deleteAfterRun requires a one-shot schedule`);
		return;
	}
	const { tag, invalid: invalidTag } = resolvePluginSessionTurnTag(params.schedule.tag);
	if (invalidTag) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): tag contains reserved delimiter ":"`);
		return;
	}
	const cronDeliveryMode = deliveryMode ?? "announce";
	if (params.shouldCommit && !params.shouldCommit()) return;
	if (!params.cron) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): cron service unavailable`);
		return;
	}
	const cron = params.cron;
	const cronJobName = buildPluginSchedulerCronName({
		pluginId: params.pluginId,
		sessionKey,
		...tag !== void 0 ? { tag } : {},
		...scheduleName ? { uniqueId: scheduleName } : {}
	});
	const cronPayload = {
		kind: "agentTurn",
		message
	};
	let result;
	try {
		result = await cron.add({
			name: cronJobName,
			enabled: true,
			schedule: cronSchedule,
			sessionTarget: `session:${sessionKey}`,
			payload: cronPayload,
			...params.schedule.agentId ? { agentId: params.schedule.agentId } : {},
			deleteAfterRun: params.schedule.deleteAfterRun ?? cronSchedule.kind === "at",
			wakeMode: "now",
			delivery: {
				mode: cronDeliveryMode,
				...cronDeliveryMode === "announce" ? { channel: "last" } : {}
			}
		});
	} catch (error) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName
		})}): ${formatErrorMessage(error)}`);
		return;
	}
	const jobId = result.id;
	if (!jobId) return;
	if (params.shouldCommit && !params.shouldCommit()) {
		if (!await removeScheduledSessionTurn({
			cron,
			jobId,
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName
		})) log$1.warn(`plugin session turn scheduling rollback failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName,
			jobId
		})}): failed to remove stale scheduled session turn`);
		return;
	}
	return registerPluginSessionSchedulerJob({
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		ownerRegistry: params.ownerRegistry,
		job: {
			id: jobId,
			sessionKey,
			kind: "session-turn",
			cleanup: async () => {
				if (!await removeScheduledSessionTurn({
					cron,
					jobId,
					pluginId: params.pluginId,
					sessionKey,
					name: cronJobName
				})) throw new Error(`failed to remove scheduled session turn: ${jobId}`);
			}
		}
	});
}
async function unschedulePluginSessionTurnsByTag(params) {
	if (params.origin !== "bundled") return {
		removed: 0,
		failed: 0
	};
	const sessionKey = normalizeOptionalString$2(params.request.sessionKey);
	const { tag, invalid: invalidTag } = resolvePluginSessionTurnTag(params.request.tag);
	if (!sessionKey || !tag || invalidTag) return {
		removed: 0,
		failed: 0
	};
	if (!params.cron) {
		log$1.warn("plugin session turn untag-list failed: cron service unavailable");
		return {
			removed: 0,
			failed: 1
		};
	}
	const cron = params.cron;
	const namePrefix = buildPluginSchedulerTagPrefix({
		pluginId: params.pluginId,
		tag,
		sessionKey
	});
	let jobs;
	try {
		jobs = await listAllCronJobsForPluginTagCleanup(cron, namePrefix);
	} catch (error) {
		log$1.warn(`plugin session turn untag-list failed: ${formatErrorMessage(error)}`);
		return {
			removed: 0,
			failed: 1
		};
	}
	const candidates = jobs.filter((job) => {
		return job.name.startsWith(namePrefix) && job.sessionTarget === `session:${sessionKey}`;
	});
	let removed = 0;
	let failed = 0;
	for (const job of candidates) {
		const id = job.id.trim();
		if (!id) continue;
		try {
			if (didCronRemoveJob(await cron.remove(id))) {
				removed += 1;
				deletePluginSessionSchedulerJob({
					pluginId: params.pluginId,
					jobId: id,
					sessionKey
				});
			} else failed += 1;
		} catch (error) {
			log$1.warn(`plugin session turn untag-remove failed: id=${id} error=${formatErrorMessage(error)}`);
			failed += 1;
		}
	}
	return {
		removed,
		failed
	};
}
//#endregion
//#region src/plugins/host-hook-state.ts
const log = createSubsystemLogger("plugins/host-hook-state");
const PROJECTION_FAILED = Symbol("plugin-session-extension-projection-failed");
const MAX_PLUGIN_NEXT_TURN_INJECTION_TEXT_LENGTH = 32 * 1024;
const MAX_PLUGIN_NEXT_TURN_INJECTION_IDEMPOTENCY_KEY_LENGTH = 512;
const MAX_PLUGIN_NEXT_TURN_INJECTIONS_PER_SESSION = 32;
function normalizeNamespace(value) {
	return value.trim();
}
function copyJsonValue(value) {
	return structuredClone(value);
}
function isPluginNextTurnInjectionPlacement(value) {
	return value === "prepend_context" || value === "append_context";
}
function isPluginNextTurnInjectionRecord(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return typeof candidate.id === "string" && typeof candidate.pluginId === "string" && typeof candidate.text === "string" && typeof candidate.createdAt === "number" && Number.isFinite(candidate.createdAt) && isPluginNextTurnInjectionPlacement(candidate.placement) && (candidate.ttlMs === void 0 || typeof candidate.ttlMs === "number" && Number.isFinite(candidate.ttlMs) && candidate.ttlMs >= 0) && (candidate.idempotencyKey === void 0 || typeof candidate.idempotencyKey === "string");
}
function isExpired(entry, now) {
	if (!isPluginNextTurnInjectionRecord(entry)) return true;
	return typeof entry.ttlMs === "number" && entry.ttlMs >= 0 && now - entry.createdAt > entry.ttlMs;
}
function isPluginPromptInjectionEnabled(cfg, pluginId) {
	return (cfg.plugins?.entries?.[pluginId])?.hooks?.allowPromptInjection !== false;
}
function toPluginNextTurnInjectionRecord(params) {
	return {
		id: params.injection.idempotencyKey?.trim() || randomUUID(),
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		text: params.injection.text,
		idempotencyKey: params.injection.idempotencyKey?.trim() || void 0,
		placement: params.injection.placement ?? "prepend_context",
		ttlMs: params.injection.ttlMs,
		createdAt: params.now,
		metadata: params.injection.metadata
	};
}
async function enqueuePluginNextTurnInjection(params) {
	if (typeof params.injection.sessionKey !== "string") return {
		enqueued: false,
		id: "",
		sessionKey: ""
	};
	const sessionKey = params.injection.sessionKey.trim();
	if (!sessionKey) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (typeof params.injection.text !== "string") return {
		enqueued: false,
		id: "",
		sessionKey
	};
	const text = params.injection.text.trim();
	if (!text) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (text.length > MAX_PLUGIN_NEXT_TURN_INJECTION_TEXT_LENGTH) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (params.injection.metadata !== void 0 && !isPluginJsonValue(params.injection.metadata)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (params.injection.idempotencyKey !== void 0 && (typeof params.injection.idempotencyKey !== "string" || params.injection.idempotencyKey.trim().length === 0 || params.injection.idempotencyKey.length > MAX_PLUGIN_NEXT_TURN_INJECTION_IDEMPOTENCY_KEY_LENGTH)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (params.injection.placement !== void 0 && !isPluginNextTurnInjectionPlacement(params.injection.placement)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (params.injection.ttlMs !== void 0 && (!Number.isFinite(params.injection.ttlMs) || params.injection.ttlMs < 0)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	const now = params.now ?? Date.now();
	const record = toPluginNextTurnInjectionRecord({
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		injection: {
			...params.injection,
			sessionKey,
			text
		},
		now
	});
	const updated = await updateResolvedSessionEntry({
		cfg: params.cfg,
		sessionKey
	}, (entry) => {
		let enqueued = false;
		let resultId = record.id;
		const injections = { ...entry.pluginNextTurnInjections };
		const rawExisting = injections[params.pluginId];
		const existing = (Array.isArray(rawExisting) ? [...rawExisting] : []).filter((candidate) => !isExpired(candidate, now));
		const duplicate = record.idempotencyKey ? existing.find((candidate) => candidate.idempotencyKey === record.idempotencyKey) : void 0;
		if (duplicate) {
			resultId = duplicate.id;
			injections[params.pluginId] = existing;
			entry.pluginNextTurnInjections = injections;
			return {
				enqueued,
				id: resultId
			};
		}
		if (existing.length >= MAX_PLUGIN_NEXT_TURN_INJECTIONS_PER_SESSION) {
			injections[params.pluginId] = existing;
			entry.pluginNextTurnInjections = injections;
			return {
				enqueued,
				id: resultId
			};
		}
		injections[params.pluginId] = [...existing, record];
		entry.pluginNextTurnInjections = injections;
		entry.updatedAt = now;
		enqueued = true;
		return {
			enqueued,
			id: resultId
		};
	});
	if (!updated.found) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	return {
		...updated.result,
		sessionKey: updated.canonicalKey
	};
}
async function drainPluginNextTurnInjections(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return [];
	const target = resolveSessionEntryAccessTarget({
		cfg: params.cfg,
		sessionKey
	});
	if (!target.entry) return [];
	if (!target.entry.pluginNextTurnInjections || Object.keys(target.entry.pluginNextTurnInjections).length === 0) return [];
	const now = params.now ?? Date.now();
	const updated = await updateResolvedSessionEntry({
		cfg: params.cfg,
		sessionKey
	}, (entry) => {
		if (!entry?.pluginNextTurnInjections) return [];
		const activePluginIds = new Set((getActivePluginRegistry()?.plugins ?? []).filter((plugin) => plugin.status === "loaded").map((plugin) => plugin.id));
		const drained = [];
		for (const [pluginId, entries] of Object.entries(entry.pluginNextTurnInjections)) {
			if (!activePluginIds.has(pluginId) || !isPluginPromptInjectionEnabled(params.cfg, pluginId)) continue;
			if (!Array.isArray(entries)) continue;
			const liveEntries = entries.filter((candidate) => !isExpired(candidate, now));
			drained.push(...liveEntries);
		}
		drained.sort((left, right) => left.createdAt - right.createdAt);
		delete entry.pluginNextTurnInjections;
		if (drained.length > 0) entry.updatedAt = now;
		return drained;
	});
	return updated.found ? updated.result : [];
}
async function drainPluginNextTurnInjectionContext(params) {
	const queuedInjections = await drainPluginNextTurnInjections(params);
	return {
		queuedInjections,
		...buildPluginAgentTurnPrepareContext({ queuedInjections })
	};
}
function getPluginSessionExtensionStateSync(params) {
	const pluginId = params.pluginId.trim();
	const sessionKey = normalizeOptionalString$2(params.sessionKey);
	if (!pluginId || !sessionKey) return;
	const value = resolveSessionEntryAccessTarget({
		cfg: params.cfg,
		sessionKey
	}).entry?.pluginExtensions?.[pluginId];
	return value ? copyJsonValue(value) : void 0;
}
async function patchPluginSessionExtension(params) {
	const namespace = normalizeNamespace(params.namespace);
	const pluginId = params.pluginId.trim();
	if (!pluginId || !namespace) return {
		ok: false,
		error: "pluginId and namespace are required"
	};
	if (params.unset === true && params.value !== void 0) return {
		ok: false,
		error: "plugin session extension cannot specify both unset and value"
	};
	if (params.value !== void 0 && !isPluginJsonValue(params.value)) return {
		ok: false,
		error: "plugin session extension value must be JSON-compatible"
	};
	if (params.unset !== true && params.value === void 0) return {
		ok: false,
		error: "plugin session extension value is required unless unset is true"
	};
	const nextPluginValue = params.value;
	const registration = (getActivePluginSessionExtensionRegistry()?.sessionExtensions ?? []).find((entry) => entry.pluginId === pluginId && entry.extension.namespace === namespace);
	if (!registration) return {
		ok: false,
		error: `unknown plugin session extension: ${pluginId}/${namespace}`
	};
	const rawSlotKey = normalizeOptionalString$2(registration.extension.sessionEntrySlotKey);
	const normalizedSlotKey = rawSlotKey ? normalizeSessionEntrySlotKey(rawSlotKey) : void 0;
	if (normalizedSlotKey?.ok === false) log.warn(`plugin session extension slot promotion skipped for ${pluginId}/${namespace}: ${normalizedSlotKey.error}`);
	const slotKey = normalizedSlotKey?.ok === true ? normalizedSlotKey.key : void 0;
	const updated = await updateResolvedSessionEntry({
		cfg: params.cfg,
		sessionKey: params.sessionKey
	}, (entry, context) => {
		const entryRecord = entry;
		const pluginExtensions = { ...entry.pluginExtensions };
		const pluginState = { ...pluginExtensions[pluginId] };
		if (params.unset === true) delete pluginState[namespace];
		else pluginState[namespace] = copyJsonValue(nextPluginValue);
		if (Object.keys(pluginState).length > 0) pluginExtensions[pluginId] = pluginState;
		else delete pluginExtensions[pluginId];
		if (Object.keys(pluginExtensions).length > 0) entry.pluginExtensions = pluginExtensions;
		else delete entry.pluginExtensions;
		const storedSlotKeys = { ...entry.pluginExtensionSlotKeys };
		const pluginSlotKeys = { ...storedSlotKeys[pluginId] };
		const previousSlotKey = normalizeSessionEntrySlotKey(pluginSlotKeys[namespace]);
		if (previousSlotKey.ok && previousSlotKey.key !== slotKey) delete entryRecord[previousSlotKey.key];
		if (slotKey && params.unset !== true) pluginSlotKeys[namespace] = slotKey;
		else delete pluginSlotKeys[namespace];
		if (Object.keys(pluginSlotKeys).length > 0) storedSlotKeys[pluginId] = pluginSlotKeys;
		else delete storedSlotKeys[pluginId];
		if (Object.keys(storedSlotKeys).length > 0) entry.pluginExtensionSlotKeys = storedSlotKeys;
		else delete entry.pluginExtensionSlotKeys;
		if (slotKey) {
			const projected = projectSessionExtensionValueForSlot({
				registration,
				sessionKey: context.canonicalKey,
				sessionId: entry.sessionId,
				nextValue: params.unset === true ? void 0 : nextPluginValue
			});
			if (projected === void 0) delete entryRecord[slotKey];
			else entryRecord[slotKey] = projected;
		}
		entry.updatedAt = Date.now();
		return pluginState[namespace];
	});
	if (!updated.found) return {
		ok: false,
		error: `unknown session key: ${params.sessionKey}`
	};
	return {
		ok: true,
		key: updated.canonicalKey,
		value: updated.result
	};
}
/**
* Resolve the value that should be mirrored to `SessionEntry[slotKey]` for a
* promoted session-extension namespace. Failures are swallowed so a
* misbehaving projector cannot block the primary patch from being persisted.
*/
function projectSessionExtensionValueForSlot(params) {
	if (params.nextValue === void 0) return;
	const projected = projectSessionExtensionValue({
		pluginId: params.registration.pluginId,
		namespace: params.registration.extension.namespace,
		project: params.registration.extension.project,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		state: params.nextValue
	});
	if (projected === PROJECTION_FAILED) return;
	if (isPromiseLike(projected)) {
		discardUnexpectedPromiseProjection(projected);
		return;
	}
	if (projected === void 0 || !isPluginJsonValue(projected)) return;
	return copyJsonValue(projected);
}
function collectPluginSessionExtensionProjections(params) {
	const extensions = getActivePluginSessionExtensionRegistry()?.sessionExtensions ?? [];
	if (extensions.length === 0) return [];
	const projections = [];
	for (const registration of extensions) {
		const state = params.entry.pluginExtensions?.[registration.pluginId]?.[registration.extension.namespace];
		if (state === void 0) continue;
		const projected = projectSessionExtensionValue({
			pluginId: registration.pluginId,
			namespace: registration.extension.namespace,
			project: registration.extension.project,
			sessionKey: params.sessionKey,
			sessionId: params.entry.sessionId,
			state
		});
		if (projected === PROJECTION_FAILED) continue;
		if (isPromiseLike(projected)) {
			discardUnexpectedPromiseProjection(projected);
			continue;
		}
		if (projected !== void 0 && isPluginJsonValue(projected)) projections.push({
			pluginId: registration.pluginId,
			namespace: registration.extension.namespace,
			value: copyJsonValue(projected)
		});
	}
	return projections;
}
function isPromiseLike(value) {
	return Boolean(value && typeof value.then === "function");
}
function discardUnexpectedPromiseProjection(value) {
	Promise.resolve(value).catch(() => void 0);
}
function projectSessionExtensionValue(params) {
	try {
		return params.project ? params.project({
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			state: params.state
		}) : params.state;
	} catch (error) {
		log.warn(`plugin session extension projection failed: plugin=${params.pluginId} namespace=${params.namespace} error=${String(error)}`);
		return PROJECTION_FAILED;
	}
}
function projectPluginSessionExtensionsSync(params) {
	return collectPluginSessionExtensionProjections(params);
}
//#endregion
//#region packages/media-generation-core/src/string.ts
/** Normalize optional strings, returning undefined for non-strings or empty values. */
function normalizeOptionalString(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
/** Return unique trimmed strings while preserving first-seen order. */
function uniqueTrimmedStrings(values) {
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const value of values) {
		const normalized = normalizeOptionalString(value);
		if (!normalized || seen.has(normalized)) continue;
		seen.add(normalized);
		result.push(normalized);
	}
	return result;
}
//#endregion
//#region packages/media-generation-core/src/catalog.ts
/** Return unique configured models with default model first when present. */
function uniqueModels(provider) {
	return uniqueTrimmedStrings([provider.defaultModel, ...provider.models ?? []]);
}
/** Synthesize static catalog entries from provider metadata. */
function synthesizeMediaGenerationCatalogEntries(params) {
	return uniqueModels(params.provider).map((model) => {
		const entry = {
			kind: params.kind,
			provider: params.provider.id,
			model,
			source: "static",
			capabilities: params.provider.capabilities
		};
		if (params.provider.label) entry.label = params.provider.label;
		if (model === params.provider.defaultModel) entry.default = true;
		if (params.modes) entry.modes = params.modes;
		return entry;
	});
}
/** Return unique model ids exposed by a media generation provider. */
function listMediaGenerationProviderModels(provider) {
	return uniqueModels(provider);
}
//#endregion
//#region packages/speech-core/voice-models.ts
function normalizeString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function normalizeLowercaseString(value) {
	return normalizeString(value)?.toLowerCase();
}
function normalizeTimeoutMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function parseVoiceModelRef(value) {
	const raw = normalizeString(value);
	if (!raw) return;
	const slashIndex = raw.indexOf("/");
	if (slashIndex <= 0 || slashIndex === raw.length - 1) return;
	const provider = normalizeLowercaseString(raw.slice(0, slashIndex));
	const model = normalizeString(raw.slice(slashIndex + 1));
	return provider && model ? {
		provider,
		model
	} : void 0;
}
function sameProvider(left, right) {
	const normalizedLeft = normalizeLowercaseString(left);
	return Boolean(normalizedLeft && normalizedLeft === normalizeLowercaseString(right));
}
/** Match provider ids case-insensitively across canonical id and aliases. */
function providerMatchesId(provider, providerId) {
	return sameProvider(provider.id, providerId) || (provider.aliases ?? []).some((alias) => sameProvider(alias, providerId));
}
/** Find the provider metadata for a configured provider id or alias. */
function findVoiceModelProvider(params) {
	return params.providers.find((provider) => providerMatchesId(provider, params.providerId));
}
/** Return true when a provider advertises the requested model. */
function voiceProviderSupportsModel(provider, model) {
	if (!provider) return false;
	const normalizedModel = normalizeString(model);
	return [provider.defaultModel, ...provider.models ?? []].some((candidate) => normalizeString(candidate) === normalizedModel);
}
/** Parse primary/fallback voice model refs from config. */
function resolveVoiceModelRefs(config) {
	const voiceModel = config;
	if (typeof voiceModel === "string") {
		const parsed = parseVoiceModelRef(voiceModel);
		return parsed ? [parsed] : [];
	}
	if (typeof voiceModel !== "object" || voiceModel === null || Array.isArray(voiceModel)) return [];
	const timeoutMs = normalizeTimeoutMs(voiceModel.timeoutMs);
	const refs = [];
	const addRef = (value) => {
		const parsed = parseVoiceModelRef(value);
		if (parsed) refs.push({
			...parsed,
			...timeoutMs === void 0 ? {} : { timeoutMs }
		});
	};
	addRef(voiceModel.primary);
	if (Array.isArray(voiceModel.fallbacks)) for (const fallback of voiceModel.fallbacks) addRef(fallback);
	return refs;
}
/** Resolve configured voice model refs that are supported by known providers. */
function resolveSupportedVoiceModelRefs(params) {
	return resolveVoiceModelRefs(params.config).flatMap((ref) => {
		const provider = findVoiceModelProvider({
			providers: params.providers,
			providerId: ref.provider
		});
		if (!provider || params.providerId && !providerMatchesId(provider, params.providerId)) return [];
		return voiceProviderSupportsModel(provider, ref.model) ? [{
			...ref,
			provider: provider.id
		}] : [];
	});
}
/** Build ordered provider candidates from primary provider plus voice-model fallbacks. */
function resolveVoiceProviderCandidates(params) {
	const primary = findVoiceModelProvider({
		providers: params.providers,
		providerId: params.primaryProvider
	})?.id ?? params.primaryProvider;
	const candidates = [];
	const seenProviders = /* @__PURE__ */ new Set();
	const addCandidate = (candidate) => {
		candidates.push(candidate);
		seenProviders.add(candidate.provider);
	};
	const refs = resolveSupportedVoiceModelRefs({
		config: params.voiceModelConfig,
		providers: params.providers
	});
	const primaryRefs = refs.filter((ref) => ref.provider === primary);
	for (const voiceModel of primaryRefs) addCandidate({
		provider: primary,
		voiceModel
	});
	if (primaryRefs.length === 0) addCandidate({ provider: primary });
	for (const voiceModel of refs) if (voiceModel.provider !== primary) addCandidate({
		provider: voiceModel.provider,
		voiceModel
	});
	for (const provider of params.providers) if (!seenProviders.has(provider.id)) addCandidate({ provider: provider.id });
	return candidates;
}
/** Resolve only the primary provider candidate for direct synthesis paths. */
function resolvePrimaryVoiceProviderCandidate(params) {
	const provider = findVoiceModelProvider({
		providers: params.providers,
		providerId: params.primaryProvider
	})?.id ?? params.primaryProvider;
	const voiceModel = resolveSupportedVoiceModelRefs({
		config: params.voiceModelConfig,
		providers: params.providers,
		providerId: provider
	})[0];
	return voiceModel ? {
		provider,
		voiceModel
	} : { provider };
}
/** Read provider config by configured id, canonical id, or alias. */
function getVoiceProviderConfig(params) {
	const candidates = [
		normalizeString(params.configuredProviderId),
		params.provider.id,
		...params.provider.aliases ?? []
	].filter((key) => Boolean(key));
	const configuredKeys = Object.keys(params.providerConfigs);
	for (const candidate of candidates) {
		if (Object.hasOwn(params.providerConfigs, candidate)) return params.providerConfigs[candidate] ?? {};
		const normalizedCandidate = normalizeLowercaseString(candidate);
		const matchingKey = configuredKeys.find((key) => normalizeLowercaseString(key) === normalizedCandidate);
		if (matchingKey) return params.providerConfigs[matchingKey] ?? {};
	}
	return {};
}
/** Convert provider metadata into static voice catalog entries. */
function synthesizeVoiceModelCatalogEntries(params) {
	const seen = /* @__PURE__ */ new Set();
	return [params.provider.defaultModel, ...params.provider.models ?? []].flatMap((entry) => {
		const model = normalizeString(entry);
		if (!model || seen.has(model)) return [];
		seen.add(model);
		return [model];
	}).map((model) => {
		const entry = {
			kind: "voice",
			provider: params.provider.id,
			model,
			source: "static",
			capabilities: params.capabilities
		};
		if (params.provider.label) entry.label = params.provider.label;
		if (model === params.provider.defaultModel) entry.default = true;
		if (params.modes) entry.modes = params.modes;
		return entry;
	});
}
//#endregion
//#region src/plugins/provider-catalog-result.ts
const MODEL_PROVIDER_CONFIG_KEYS = [
	"baseUrl",
	"apiKey",
	"auth",
	"api",
	"contextWindow",
	"contextTokens",
	"maxTokens",
	"timeoutSeconds",
	"region",
	"injectNumCtxForOpenAICompat",
	"params",
	"agentRuntime",
	"localService",
	"headers",
	"authHeader",
	"request"
];
const MODEL_DEFINITION_CONFIG_KEYS = [
	"api",
	"baseUrl",
	"reasoning",
	"input",
	"cost",
	"contextWindow",
	"contextTokens",
	"maxTokens",
	"thinkingLevelMap",
	"params",
	"agentRuntime",
	"headers",
	"compat",
	"mediaInput",
	"metadataSource"
];
/** Copies provider config data out of a provider catalog result. */
function copyProviderCatalogResultProjection(result) {
	const provider = copyProviderCatalogProviderConfig(readRecordValue(result, "provider"));
	if (provider) return {
		kind: "provider",
		provider
	};
	const providers = copyRecordEntries(readRecordValue(result, "providers")).flatMap(([providerId, providerConfig]) => {
		const copied = copyProviderCatalogProviderConfig(providerConfig);
		return copied ? [[providerId, copied]] : [];
	});
	return providers.length > 0 ? {
		kind: "providers",
		providers
	} : { kind: "empty" };
}
/** Copies provider catalog result entries, using providerId for single-provider results. */
function copyProviderCatalogResultEntries(params) {
	const projection = copyProviderCatalogResultProjection(params.result);
	if (projection.kind === "provider") return [[params.providerId, projection.provider]];
	return projection.kind === "providers" ? projection.providers : [];
}
/** Copies model definitions from provider catalog provider config. */
function copyProviderCatalogModels(providerConfig) {
	return copyArrayEntries(readRecordValue(providerConfig, "models")).flatMap((entry) => {
		const copied = copyProviderCatalogModel(entry);
		return copied ? [copied] : [];
	});
}
function copyProviderCatalogModel(model) {
	if (!isRecord$1(model)) return;
	const id = readRecordValue(model, "id");
	const name = readRecordValue(model, "name");
	if (typeof id !== "string") return;
	const copied = {
		id,
		name: typeof name === "string" ? name : id
	};
	for (const key of MODEL_DEFINITION_CONFIG_KEYS) {
		const value = readRecordValue(model, key);
		if (value !== void 0) copied[key] = value;
	}
	return copied;
}
/** Copies the supported provider config fields from a provider catalog result. */
function copyProviderCatalogProviderConfig(providerConfig) {
	if (!isRecord$1(providerConfig)) return;
	const baseUrl = readRecordValue(providerConfig, "baseUrl");
	if (typeof baseUrl !== "string") return;
	const copied = {
		baseUrl,
		models: copyProviderCatalogModels(providerConfig)
	};
	for (const key of MODEL_PROVIDER_CONFIG_KEYS) {
		if (key === "baseUrl") continue;
		const value = readRecordValue(providerConfig, key);
		if (value !== void 0) copied[key] = value;
	}
	return copied;
}
//#endregion
//#region src/plugins/provider-catalog-unified-text.ts
/** Projects plugin provider catalog results into unified text-model catalog rows. */
function projectProviderCatalogResultToUnifiedTextRows(params) {
	const rows = [];
	for (const [providerId, providerConfig] of copyProviderCatalogResultEntries(params)) for (const model of copyProviderCatalogModels(providerConfig)) {
		const modelId = readRecordValue(model, "id");
		if (typeof modelId !== "string") continue;
		const modelName = readRecordValue(model, "name");
		rows.push({
			kind: "text",
			provider: providerId,
			model: modelId,
			...typeof modelName === "string" && modelName ? { label: modelName } : {},
			source: params.source
		});
	}
	return rows;
}
//#endregion
//#region src/plugins/model-catalog-registration.ts
function mergeCatalogHookResults(source, left, right) {
	const rows = [...left ?? [], ...right ?? []];
	if (rows.length === 0) return null;
	const mergedRows = [];
	for (const row of rows) mergedRows.push({
		...row,
		source
	});
	return mergedRows;
}
function mergeModelCatalogHooks(source, left, right) {
	if (!left) return right;
	if (!right) return left;
	return async (ctx) => {
		const [leftRows, rightRows] = await Promise.all([left(ctx), right(ctx)]);
		return mergeCatalogHookResults(source, leftRows, rightRows);
	};
}
/** Creates handlers that register plugin model catalog providers into a registry. */
function createModelCatalogRegistrationHandlers(params) {
	const registerModelCatalogProvider = (record, provider) => {
		const providerId = normalizeOptionalString$2(provider.provider) ?? "";
		if (!providerId) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "model catalog provider registration missing provider"
			});
			return;
		}
		if (!provider.kinds || provider.kinds.length === 0) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `model catalog provider "${providerId}" registration missing kinds`
			});
			return;
		}
		const existing = params.registry.modelCatalogProviders.find((entry) => entry.provider.provider === providerId && entry.pluginId !== record.id);
		if (existing) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `model catalog provider already registered: ${providerId} (${existing.pluginId})`
			});
			return;
		}
		const normalizedKinds = uniqueValues(provider.kinds);
		const samePluginOverlapping = params.registry.modelCatalogProviders.find((entry) => entry.provider.provider === providerId && entry.pluginId === record.id && entry.provider.kinds.some((kind) => normalizedKinds.includes(kind)));
		if (samePluginOverlapping) {
			samePluginOverlapping.provider = {
				...samePluginOverlapping.provider,
				...provider,
				provider: providerId,
				kinds: uniqueValues([...samePluginOverlapping.provider.kinds, ...normalizedKinds]),
				staticCatalog: mergeModelCatalogHooks("static", samePluginOverlapping.provider.staticCatalog, provider.staticCatalog),
				liveCatalog: mergeModelCatalogHooks("live", samePluginOverlapping.provider.liveCatalog, provider.liveCatalog)
			};
			return;
		}
		params.registry.modelCatalogProviders.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: {
				...provider,
				provider: providerId,
				kinds: normalizedKinds
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerSynthesizedTextModelCatalogProvider = (registration) => {
		if (!registration.provider.catalog && !registration.provider.staticCatalog) return;
		registerModelCatalogProvider(registration.record, {
			provider: registration.provider.id,
			kinds: ["text"],
			...registration.provider.staticCatalog ? { staticCatalog: async (ctx) => projectProviderCatalogResultToUnifiedTextRows({
				providerId: registration.provider.id,
				result: await registration.provider.staticCatalog.run(ctx),
				source: "static"
			}) } : {},
			...registration.provider.catalog ? { liveCatalog: async (ctx) => projectProviderCatalogResultToUnifiedTextRows({
				providerId: registration.provider.id,
				result: await registration.provider.catalog.run(ctx),
				source: "live"
			}) } : {}
		});
	};
	const registerSynthesizedMediaModelCatalogProvider = (registration) => {
		registerModelCatalogProvider(registration.record, {
			provider: registration.provider.id,
			kinds: [registration.kind],
			staticCatalog: () => synthesizeMediaGenerationCatalogEntries({
				kind: registration.kind,
				provider: registration.provider
			})
		});
	};
	const registerSynthesizedVoiceModelCatalogProvider = (registration) => {
		registerModelCatalogProvider(registration.record, {
			provider: registration.provider.id,
			kinds: ["voice"],
			staticCatalog: () => synthesizeVoiceModelCatalogEntries({
				provider: registration.provider,
				capabilities: registration.capabilities,
				modes: registration.modes
			})
		});
	};
	return {
		registerModelCatalogProvider,
		registerSynthesizedTextModelCatalogProvider,
		registerSynthesizedMediaModelCatalogProvider,
		registerSynthesizedVoiceModelCatalogProvider
	};
}
//#endregion
//#region src/plugins/provider-validation.ts
/** Validates and normalizes provider plugin definitions before registry registration. */
const warnedDeprecatedDiscoveryProviders = /* @__PURE__ */ new Set();
function normalizeTextList(values) {
	const normalized = normalizeUniqueTrimmedStringList(values);
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeOnboardingScopes(values) {
	const normalized = Array.from(new Set((values ?? []).filter((value) => value === "text-inference" || value === "image-generation" || value === "music-generation")));
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeProviderOAuthProfileIdRepairs(values) {
	if (!Array.isArray(values)) return;
	const normalized = values.map((value) => {
		const legacyProfileId = normalizeOptionalString$2(value?.legacyProfileId);
		const promptLabel = normalizeOptionalString$2(value?.promptLabel);
		if (!legacyProfileId && !promptLabel) return null;
		return {
			...legacyProfileId ? { legacyProfileId } : {},
			...promptLabel ? { promptLabel } : {}
		};
	}).filter((value) => value !== null);
	return normalized.length > 0 ? normalized : void 0;
}
function resolveWizardMethodId(params) {
	if (!params.methodId) return;
	if (params.auth.some((method) => method.id === params.methodId)) return params.methodId;
	pushPluginValidationDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `provider "${params.providerId}" ${params.metadataKind} method "${params.methodId}" not found; falling back to available methods`,
		pushDiagnostic: params.pushDiagnostic
	});
}
function buildNormalizedModelAllowlist(modelAllowlist) {
	if (!modelAllowlist) return;
	const allowedKeys = normalizeTextList(modelAllowlist.allowedKeys);
	const initialSelections = normalizeTextList(modelAllowlist.initialSelections);
	const loadCatalog = modelAllowlist.loadCatalog === true;
	const message = normalizeOptionalString$2(modelAllowlist.message);
	if (!allowedKeys && !initialSelections && !loadCatalog && !message) return;
	return {
		...allowedKeys ? { allowedKeys } : {},
		...initialSelections ? { initialSelections } : {},
		...loadCatalog ? { loadCatalog } : {},
		...message ? { message } : {}
	};
}
function buildNormalizedWizardSetup(params) {
	const choiceId = normalizeOptionalString$2(params.setup.choiceId);
	const choiceLabel = normalizeOptionalString$2(params.setup.choiceLabel);
	const choiceHint = normalizeOptionalString$2(params.setup.choiceHint);
	const groupId = normalizeOptionalString$2(params.setup.groupId);
	const groupLabel = normalizeOptionalString$2(params.setup.groupLabel);
	const groupHint = normalizeOptionalString$2(params.setup.groupHint);
	const onboardingScopes = normalizeOnboardingScopes(params.setup.onboardingScopes);
	const modelAllowlist = buildNormalizedModelAllowlist(params.setup.modelAllowlist);
	return {
		...choiceId ? { choiceId } : {},
		...choiceLabel ? { choiceLabel } : {},
		...choiceHint ? { choiceHint } : {},
		...typeof params.setup.assistantPriority === "number" && Number.isFinite(params.setup.assistantPriority) ? { assistantPriority: params.setup.assistantPriority } : {},
		...params.setup.assistantVisibility === "manual-only" || params.setup.assistantVisibility === "visible" ? { assistantVisibility: params.setup.assistantVisibility } : {},
		...params.setup.onboardingFeatured === true ? { onboardingFeatured: true } : {},
		...groupId ? { groupId } : {},
		...groupLabel ? { groupLabel } : {},
		...groupHint ? { groupHint } : {},
		...params.methodId ? { methodId: params.methodId } : {},
		...onboardingScopes ? { onboardingScopes } : {},
		...modelAllowlist ? { modelAllowlist } : {}
	};
}
function buildNormalizedModelPicker(modelPicker, methodId) {
	const label = normalizeOptionalString$2(modelPicker.label);
	const hint = normalizeOptionalString$2(modelPicker.hint);
	return {
		...label ? { label } : {},
		...hint ? { hint } : {},
		...methodId ? { methodId } : {}
	};
}
function normalizeProviderWizardSetup(params) {
	const hasAuthMethods = params.auth.length > 0;
	if (!params.setup) return;
	if (!hasAuthMethods) {
		pushPluginValidationDiagnostic({
			level: "warn",
			pluginId: params.pluginId,
			source: params.source,
			message: `provider "${params.providerId}" setup metadata ignored because it has no auth methods`,
			pushDiagnostic: params.pushDiagnostic
		});
		return;
	}
	const methodId = resolveWizardMethodId({
		providerId: params.providerId,
		pluginId: params.pluginId,
		source: params.source,
		auth: params.auth,
		methodId: normalizeOptionalString$2(params.setup.methodId),
		metadataKind: "setup",
		pushDiagnostic: params.pushDiagnostic
	});
	return buildNormalizedWizardSetup({
		setup: params.setup,
		methodId
	});
}
function normalizeProviderAuthMethods(params) {
	const seenMethodIds = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const method of params.auth) {
		const methodId = normalizeOptionalString$2(method.id);
		if (!methodId) {
			pushPluginValidationDiagnostic({
				level: "error",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${params.providerId}" auth method missing id`,
				pushDiagnostic: params.pushDiagnostic
			});
			continue;
		}
		if (seenMethodIds.has(methodId)) {
			pushPluginValidationDiagnostic({
				level: "error",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${params.providerId}" auth method duplicated id "${methodId}"`,
				pushDiagnostic: params.pushDiagnostic
			});
			continue;
		}
		seenMethodIds.add(methodId);
		const wizardSetup = method.wizard;
		const wizard = wizardSetup ? normalizeProviderWizardSetup({
			providerId: params.providerId,
			pluginId: params.pluginId,
			source: params.source,
			auth: [{
				...method,
				id: methodId
			}],
			setup: wizardSetup,
			pushDiagnostic: params.pushDiagnostic
		}) : void 0;
		normalized.push({
			...method,
			id: methodId,
			label: normalizeOptionalString$2(method.label) ?? methodId,
			...normalizeOptionalString$2(method.hint) ? { hint: normalizeOptionalString$2(method.hint) } : {},
			...wizard ? { wizard } : {}
		});
	}
	return normalized;
}
function normalizeProviderWizard(params) {
	if (!params.wizard) return;
	const hasAuthMethods = params.auth.length > 0;
	const normalizeSetup = () => {
		const setup = params.wizard?.setup;
		if (!setup) return;
		return normalizeProviderWizardSetup({
			providerId: params.providerId,
			pluginId: params.pluginId,
			source: params.source,
			auth: params.auth,
			setup,
			pushDiagnostic: params.pushDiagnostic
		});
	};
	const normalizeModelPicker = () => {
		const modelPicker = params.wizard?.modelPicker;
		if (!modelPicker) return;
		if (!hasAuthMethods) {
			pushPluginValidationDiagnostic({
				level: "warn",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${params.providerId}" model-picker metadata ignored because it has no auth methods`,
				pushDiagnostic: params.pushDiagnostic
			});
			return;
		}
		return buildNormalizedModelPicker(modelPicker, resolveWizardMethodId({
			providerId: params.providerId,
			pluginId: params.pluginId,
			source: params.source,
			auth: params.auth,
			methodId: normalizeOptionalString$2(modelPicker.methodId),
			metadataKind: "model-picker",
			pushDiagnostic: params.pushDiagnostic
		}));
	};
	const setup = normalizeSetup();
	const modelPicker = normalizeModelPicker();
	if (!setup && !modelPicker) return;
	return {
		...setup ? { setup } : {},
		...modelPicker ? { modelPicker } : {}
	};
}
/** Normalizes provider plugin metadata and emits diagnostics for invalid public fields. */
/** Returns a normalized provider plugin plus validation diagnostics for registry insertion. */
function normalizeRegisteredProvider(params) {
	const id = normalizeOptionalString$2(params.provider.id);
	if (!id) {
		pushPluginValidationDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: "provider registration missing id",
			pushDiagnostic: params.pushDiagnostic
		});
		return null;
	}
	const auth = normalizeProviderAuthMethods({
		providerId: id,
		pluginId: params.pluginId,
		source: params.source,
		auth: params.provider.auth ?? [],
		pushDiagnostic: params.pushDiagnostic
	});
	const docsPath = normalizeOptionalString$2(params.provider.docsPath);
	const aliases = normalizeTextList(params.provider.aliases);
	const deprecatedProfileIds = normalizeTextList(params.provider.deprecatedProfileIds);
	const oauthProfileIdRepairs = normalizeProviderOAuthProfileIdRepairs(params.provider.oauthProfileIdRepairs);
	const envVars = normalizeTextList(params.provider.envVars);
	const wizard = normalizeProviderWizard({
		providerId: id,
		pluginId: params.pluginId,
		source: params.source,
		auth,
		wizard: params.provider.wizard,
		pushDiagnostic: params.pushDiagnostic
	});
	const catalog = params.provider.catalog;
	const discovery = params.provider.discovery;
	if (catalog && discovery) pushPluginValidationDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `provider "${id}" registered both catalog and discovery; using catalog`,
		pushDiagnostic: params.pushDiagnostic
	});
	if (!catalog && discovery) {
		const warningKey = `${params.pluginId}:${id}:discovery`;
		if (!warnedDeprecatedDiscoveryProviders.has(warningKey)) {
			warnedDeprecatedDiscoveryProviders.add(warningKey);
			pushPluginValidationDiagnostic({
				level: "warn",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${id}" uses deprecated discovery; use catalog`,
				pushDiagnostic: params.pushDiagnostic
			});
		}
	}
	const { wizard: _ignoredWizard, docsPath: _ignoredDocsPath, aliases: _ignoredAliases, envVars: _ignoredEnvVars, catalog: _ignoredCatalog, discovery: _ignoredDiscovery, ...restProvider } = params.provider;
	return {
		...restProvider,
		id,
		label: normalizeOptionalString$2(params.provider.label) ?? id,
		...docsPath ? { docsPath } : {},
		...aliases ? { aliases } : {},
		...deprecatedProfileIds ? { deprecatedProfileIds } : {},
		...oauthProfileIdRepairs ? { oauthProfileIdRepairs } : {},
		...envVars ? { envVars } : {},
		auth,
		...catalog ? { catalog } : {},
		...!catalog && discovery ? { discovery } : {},
		...wizard ? { wizard } : {}
	};
}
//#endregion
//#region src/plugins/registry.ts
/** In-memory plugin registry builder and mutation API for plugin runtime registration. */
const GATEWAY_METHOD_DISPATCH_CONTRACT = "authenticated-request";
const LEGACY_DEACTIVATE_HOOK_ALIAS_COMPAT = getPluginCompatRecord("legacy-deactivate-hook-alias");
const LEGACY_SUBAGENT_SPAWNING_HOOK_COMPAT = getPluginCompatRecord("legacy-subagent-spawning-hook");
function formatLegacyDeactivateHookAliasDiagnostic() {
	const removeAfter = LEGACY_DEACTIVATE_HOOK_ALIAS_COMPAT.removeAfter ?? "a future breaking release";
	return `typed hook "deactivate" is deprecated (${LEGACY_DEACTIVATE_HOOK_ALIAS_COMPAT.code}); use "gateway_stop". This compatibility alias will be removed after ${removeAfter}.`;
}
function formatDeprecatedTypedHookDiagnostic(hookName) {
	if (!isDeprecatedPluginHookName(hookName) || hookName === "deactivate") return;
	const deprecation = DEPRECATED_PLUGIN_HOOKS[hookName];
	const compat = hookName === "subagent_spawning" ? LEGACY_SUBAGENT_SPAWNING_HOOK_COMPAT : void 0;
	const removeAfter = compat?.removeAfter ?? deprecation.removeAfter ?? "a future breaking release";
	return `typed hook "${hookName}" is deprecated (${compat?.code ?? "deprecated-plugin-hook"}); ${deprecation.reason} Use ${deprecation.replacement}. This compatibility hook will be removed after ${removeAfter}.`;
}
function canRegisterInstalledTrustedHook(record) {
	return record.origin === "bundled" || record.enabled && record.explicitlyEnabled === true;
}
function normalizeHookTimeoutMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function resolveTypedHookTimeoutMs(params) {
	return normalizeHookTimeoutMs(params.policy?.timeouts?.[params.hookName]) ?? normalizeHookTimeoutMs(params.policy?.timeoutMs) ?? normalizeHookTimeoutMs(params.opts?.timeoutMs);
}
const constrainLegacyPromptInjectionHook = (handler) => {
	return (event, ctx) => {
		const result = handler(event, ctx);
		if (result && typeof result === "object" && "then" in result) return Promise.resolve(result).then((resolved) => stripPromptMutationFieldsFromLegacyHookResult(resolved));
		return stripPromptMutationFieldsFromLegacyHookResult(result);
	};
};
function resolvePluginPath(input, rootDir) {
	const trimmed = input.trim();
	if (!trimmed || path.isAbsolute(trimmed) || trimmed.startsWith("~")) return resolveUserPath(input);
	return rootDir ? path.resolve(rootDir, trimmed) : resolveUserPath(input);
}
function isOfficialCodexPluginRecord(record) {
	if (record.id !== "codex") return false;
	if (record.origin !== "global") return false;
	if (record.packageName === "@openclaw/codex") return true;
	return path.normalize(record.rootDir ?? record.source).split(path.sep).join("/").includes("/node_modules/@openclaw/codex");
}
function canClaimReservedCommandOwnership(record) {
	return record.origin === "bundled" || isOfficialCodexPluginRecord(record);
}
const activePluginHookRegistrations = resolveGlobalSingleton(Symbol.for("openclaw.activePluginHookRegistrations"), () => /* @__PURE__ */ new Map());
/**
* Keep mode decoding centralized. PluginRegistrationMode is the public label;
* registry code should consume these booleans instead of duplicating string
* checks across individual registration handlers.
*/
function resolvePluginRegistrationCapabilities(mode) {
	return {
		capabilityHandlers: mode === "full" || mode === "discovery" || mode === "tool-discovery",
		setupRuntimeHandlers: mode === "setup-runtime",
		runtimeChannel: mode !== "setup-only" && mode !== "tool-discovery"
	};
}
function adaptPluginGatewayMethodHandler(handler) {
	return async (opts) => {
		let responded = false;
		const respond = (ok, payload, error, meta) => {
			responded = true;
			opts.respond(ok, payload, error, meta);
		};
		const result = await handler({
			...opts,
			respond
		});
		if (!responded && result !== void 0) respond(true, result);
	};
}
function createPluginRegistry(registryParams) {
	const registry = createEmptyPluginRegistry();
	const coreGatewayMethodNames = Array.from(new Set([...registryParams.coreGatewayMethodNames ?? [], ...Object.keys(registryParams.coreGatewayHandlers ?? {})])).toSorted();
	registry.coreGatewayMethodNames = coreGatewayMethodNames;
	const coreGatewayMethods = new Set(coreGatewayMethodNames);
	const getHostCronService = () => registryParams.hostServices?.cron;
	const pluginHookRollback = /* @__PURE__ */ new Map();
	const pluginsWithChannelRegistrationConflict = /* @__PURE__ */ new Set();
	const pluginSideEffectGuards = /* @__PURE__ */ new Map();
	const pushDiagnostic = (diag) => {
		registry.diagnostics.push(diag);
	};
	const { registerModelCatalogProvider, registerSynthesizedTextModelCatalogProvider, registerSynthesizedMediaModelCatalogProvider, registerSynthesizedVoiceModelCatalogProvider } = createModelCatalogRegistrationHandlers({
		registry,
		pushDiagnostic
	});
	const throwRegistrationError = (message) => {
		throw new Error(message);
	};
	const requireRegistrationValue = (value, message) => {
		if (!value) throw new Error(message);
		return value;
	};
	const createPluginSideEffectGuard = (pluginId) => {
		const guard = { active: true };
		const guards = pluginSideEffectGuards.get(pluginId) ?? /* @__PURE__ */ new Set();
		guards.add(guard);
		pluginSideEffectGuards.set(pluginId, guards);
		return guard;
	};
	const deactivatePluginSideEffectGuards = (pluginId) => {
		const guards = pluginSideEffectGuards.get(pluginId);
		if (!guards) return;
		for (const guard of guards) guard.active = false;
		pluginSideEffectGuards.delete(pluginId);
	};
	const registerCodexAppServerExtensionFactory = (record, factory) => {
		if (record.origin !== "bundled") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "only bundled plugins can register Codex app-server extension factories"
			});
			return;
		}
		if (!(record.contracts?.embeddedExtensionFactories ?? []).includes("codex-app-server")) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "plugin must declare contracts.embeddedExtensionFactories: [\"codex-app-server\"] to register Codex app-server extension factories"
			});
			return;
		}
		if (typeof factory !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "codex app-server extension factory must be a function"
			});
			return;
		}
		if (registry.codexAppServerExtensionFactories.some((entry) => entry.pluginId === record.id && entry.rawFactory === factory)) return;
		const safeFactory = async (codex) => {
			try {
				await factory(codex);
			} catch (error) {
				const detail = error instanceof Error ? error.message : String(error);
				registryParams.logger.warn(`[plugins] codex app-server extension factory failed for ${record.id}: ${detail}`);
			}
		};
		registry.codexAppServerExtensionFactories.push({
			pluginId: record.id,
			pluginName: record.name,
			rawFactory: factory,
			factory: safeFactory,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerAgentToolResultMiddleware = (record, handler, options) => {
		if (typeof handler !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "agent tool result middleware must be a function"
			});
			return;
		}
		const runtimes = normalizeAgentToolResultMiddlewareRuntimes(options);
		if (runtimes.length === 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "agent tool result middleware must target at least one supported runtime"
			});
			return;
		}
		const declared = normalizeAgentToolResultMiddlewareRuntimeIds(record.contracts?.agentToolResultMiddleware);
		const missing = runtimes.filter((runtime) => !declared.includes(runtime));
		if (missing.length > 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.agentToolResultMiddleware for: ${missing.join(", ")}`
			});
			return;
		}
		if (!canRegisterInstalledTrustedHook(record)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "plugin must be explicitly enabled to register agent tool result middleware"
			});
			return;
		}
		const existing = registry.agentToolResultMiddlewares.find((entry) => entry.pluginId === record.id && entry.rawHandler === handler);
		if (existing) {
			existing.runtimes = uniqueValues([...existing.runtimes, ...runtimes]);
			return;
		}
		const safeHandler = async (event, ctx) => {
			try {
				return await handler(event, ctx);
			} catch (error) {
				registryParams.logger.warn(`[plugins] agent tool result middleware failed for ${record.id}`);
				throw error;
			}
		};
		registry.agentToolResultMiddlewares.push({
			pluginId: record.id,
			pluginName: record.name,
			rawHandler: handler,
			handler: safeHandler,
			runtimes,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerTool = (record, tool, opts) => {
		if (pluginsWithChannelRegistrationConflict.has(record.id)) return;
		const declaredNames = normalizePluginToolContractNames(record.contracts);
		if (declaredNames.length === 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "plugin must declare contracts.tools before registering agent tools"
			});
			return;
		}
		const names = [...opts?.names ?? [], ...opts?.name ? [opts.name] : []];
		const optional = opts?.optional === true;
		const factory = typeof tool === "function" ? tool : (_ctx) => tool;
		if (typeof tool !== "function") names.push(tool.name);
		const normalized = normalizePluginToolNames(names);
		const undeclared = findUndeclaredPluginToolNames({
			declaredNames,
			toolNames: normalized
		});
		if (undeclared.length > 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.tools for: ${undeclared.join(", ")}`
			});
			return;
		}
		if (normalized.length > 0) record.toolNames.push(...normalized);
		registry.tools.push({
			pluginId: record.id,
			pluginName: record.name,
			factory,
			names: normalized,
			declaredNames,
			optional,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerHook = (record, events, handler, opts, config, pluginConfig) => {
		const normalizedEvents = normalizeStringEntries(Array.isArray(events) ? events : [events]);
		const entry = opts?.entry ?? null;
		const hookName = requireRegistrationValue(entry?.hook.name ?? opts?.name?.trim(), "hook registration missing name");
		const existingHook = registry.hooks.find((entryLocal) => entryLocal.entry.hook.name === hookName);
		if (existingHook) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `hook already registered: ${hookName} (${existingHook.pluginId})`
			});
			return;
		}
		const description = entry?.hook.description ?? opts?.description ?? "";
		const hookEntry = entry ? {
			...entry,
			hook: {
				...entry.hook,
				name: hookName,
				description,
				source: "openclaw-plugin",
				pluginId: record.id
			},
			metadata: {
				...entry.metadata,
				events: normalizedEvents
			}
		} : {
			hook: {
				name: hookName,
				description,
				source: "openclaw-plugin",
				pluginId: record.id,
				filePath: record.source,
				baseDir: path.dirname(record.source),
				handlerPath: record.source
			},
			frontmatter: {},
			metadata: { events: normalizedEvents },
			invocation: { enabled: true }
		};
		record.hookNames.push(hookName);
		registry.hooks.push({
			pluginId: record.id,
			entry: hookEntry,
			events: normalizedEvents,
			source: record.source
		});
		const hookSystemEnabled = config?.hooks?.internal?.enabled !== false;
		if (!registryParams.activateGlobalSideEffects || !hookSystemEnabled || opts?.register === false) return;
		const previousRegistrations = activePluginHookRegistrations.get(hookName) ?? [];
		for (const registration of previousRegistrations) unregisterInternalHook(registration.event, registration.handler);
		const nextRegistrations = [];
		for (const event of normalizedEvents) {
			const wrappedHandler = async (evt) => {
				return handler({
					...evt,
					context: {
						...evt.context,
						pluginConfig
					}
				});
			};
			registerInternalHook(event, wrappedHandler);
			nextRegistrations.push({
				event,
				handler: wrappedHandler
			});
		}
		activePluginHookRegistrations.set(hookName, nextRegistrations);
		const rollbackEntries = pluginHookRollback.get(record.id) ?? [];
		rollbackEntries.push({
			name: hookName,
			previousRegistrations: [...previousRegistrations]
		});
		pluginHookRollback.set(record.id, rollbackEntries);
	};
	const registerGatewayMethod = (record, method, handler, opts) => {
		const trimmed = method.trim();
		if (!trimmed) return;
		if (coreGatewayMethods.has(trimmed) || registry.gatewayHandlers[trimmed]) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `gateway method already registered: ${trimmed}`
			});
			return;
		}
		const wrappedHandler = adaptPluginGatewayMethodHandler(handler);
		registry.gatewayHandlers[trimmed] = wrappedHandler;
		const normalizedScope = normalizePluginGatewayMethodScope(trimmed, opts?.scope);
		if (normalizedScope.coercedToReservedAdmin) pushDiagnostic({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message: `gateway method scope coerced to operator.admin for reserved core namespace: ${trimmed}`
		});
		registry.gatewayMethodDescriptors.push(createPluginGatewayMethodDescriptor({
			pluginId: record.id,
			name: trimmed,
			handler: wrappedHandler,
			scope: normalizedScope.scope
		}));
	};
	const describeHttpRouteOwner = (entry) => {
		return `${normalizeOptionalString$2(entry.pluginId) || "unknown-plugin"} (${normalizeOptionalString$2(entry.source) || "unknown-source"})`;
	};
	const canDispatchGatewayMethodsFromHttpRoute = (record) => (record.contracts?.gatewayMethodDispatch ?? []).includes(GATEWAY_METHOD_DISPATCH_CONTRACT);
	const registerHttpRoute = (record, params) => {
		const normalizedPath = normalizePluginHttpPath(params.path);
		if (!normalizedPath) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: "http route registration missing path"
			});
			return;
		}
		if (params.auth !== "gateway" && params.auth !== "plugin") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `http route registration missing or invalid auth: ${normalizedPath}`
			});
			return;
		}
		const match = params.match ?? "exact";
		const overlappingRoute = findOverlappingPluginHttpRoute(registry.httpRoutes, {
			path: normalizedPath,
			match
		});
		if (overlappingRoute && overlappingRoute.auth !== params.auth) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `http route overlap rejected: ${normalizedPath} (${match}, ${params.auth}) overlaps ${overlappingRoute.path} (${overlappingRoute.match}, ${overlappingRoute.auth}) owned by ${describeHttpRouteOwner(overlappingRoute)}`
			});
			return;
		}
		const existingIndex = registry.httpRoutes.findIndex((entry) => entry.path === normalizedPath && entry.match === match);
		if (existingIndex >= 0) {
			const existing = registry.httpRoutes[existingIndex];
			if (!existing) return;
			if (!params.replaceExisting && existing.pluginId !== record.id) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `http route already registered: ${normalizedPath} (${match}) by ${describeHttpRouteOwner(existing)}`
				});
				return;
			}
			if (existing.pluginId && existing.pluginId !== record.id) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `http route replacement rejected: ${normalizedPath} (${match}) owned by ${describeHttpRouteOwner(existing)}`
				});
				return;
			}
			registry.httpRoutes[existingIndex] = {
				pluginId: record.id,
				path: normalizedPath,
				handler: params.handler,
				...params.handleUpgrade ? { handleUpgrade: params.handleUpgrade } : {},
				auth: params.auth,
				match,
				...params.gatewayRuntimeScopeSurface ? { gatewayRuntimeScopeSurface: params.gatewayRuntimeScopeSurface } : {},
				...canDispatchGatewayMethodsFromHttpRoute(record) ? { gatewayMethodDispatchAllowed: true } : {},
				...params.nodeCapability ? { nodeCapability: { ...params.nodeCapability } } : {},
				source: record.source
			};
			return;
		}
		record.httpRoutes += 1;
		registry.httpRoutes.push({
			pluginId: record.id,
			path: normalizedPath,
			handler: params.handler,
			...params.handleUpgrade ? { handleUpgrade: params.handleUpgrade } : {},
			auth: params.auth,
			match,
			...params.gatewayRuntimeScopeSurface ? { gatewayRuntimeScopeSurface: params.gatewayRuntimeScopeSurface } : {},
			...canDispatchGatewayMethodsFromHttpRoute(record) ? { gatewayMethodDispatchAllowed: true } : {},
			...params.nodeCapability ? { nodeCapability: { ...params.nodeCapability } } : {},
			source: record.source
		});
	};
	const registerHostedMediaResolver = (record, resolver) => {
		if (typeof resolver !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "hosted media resolver registration missing resolver"
			});
			return;
		}
		(registry.hostedMediaResolvers ??= []).push({
			pluginId: record.id,
			pluginName: record.name,
			resolver,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerChannel = (record, registration, mode = "full") => {
		if (record.origin === "workspace" && !record.enabled) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: `channel registration rejected for disabled workspace plugin: ${record.id}`
			});
			return;
		}
		const registrationCapabilities = resolvePluginRegistrationCapabilities(mode);
		const normalized = typeof registration.plugin === "object" ? registration : { plugin: registration };
		const plugin = normalizeRegisteredChannelPlugin({
			pluginId: record.id,
			source: record.source,
			plugin: normalized.plugin,
			pushDiagnostic
		});
		if (!plugin) return;
		const id = plugin.id;
		const existingRuntime = registry.channels.find((entry) => entry.plugin.id === id);
		if (registrationCapabilities.runtimeChannel && existingRuntime) {
			if (existingRuntime.pluginId === record.id) {
				existingRuntime.plugin = plugin;
				existingRuntime.pluginName = record.name;
				existingRuntime.source = record.source;
				existingRuntime.rootDir = record.rootDir;
				const existingSetup = registry.channelSetups.find((entry) => entry.plugin.id === id);
				if (existingSetup) {
					existingSetup.plugin = plugin;
					existingSetup.pluginName = record.name;
					existingSetup.source = record.source;
					existingSetup.enabled = record.enabled;
					existingSetup.rootDir = record.rootDir;
				}
				return;
			}
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `channel already registered: ${id} (${existingRuntime.pluginId})`
			});
			pluginsWithChannelRegistrationConflict.add(record.id);
			return;
		}
		const existingSetup = registry.channelSetups.find((entry) => entry.plugin.id === id);
		if (existingSetup) {
			if (existingSetup.pluginId === record.id) {
				existingSetup.plugin = plugin;
				existingSetup.pluginName = record.name;
				existingSetup.source = record.source;
				existingSetup.enabled = record.enabled;
				existingSetup.rootDir = record.rootDir;
				return;
			}
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `channel setup already registered: ${id} (${existingSetup.pluginId})`
			});
			pluginsWithChannelRegistrationConflict.add(record.id);
			return;
		}
		if (!record.channelIds.includes(id)) record.channelIds.push(id);
		registry.channelSetups.push({
			pluginId: record.id,
			pluginName: record.name,
			plugin,
			source: record.source,
			enabled: record.enabled,
			rootDir: record.rootDir
		});
		if (!registrationCapabilities.runtimeChannel) return;
		registry.channels.push({
			pluginId: record.id,
			pluginName: record.name,
			plugin,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerProvider = (record, provider) => {
		const normalizedProvider = normalizeRegisteredProvider({
			pluginId: record.id,
			source: record.source,
			provider,
			pushDiagnostic
		});
		if (!normalizedProvider) return;
		const id = normalizedProvider.id;
		const existing = registry.providers.find((entry) => entry.provider.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `provider already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		if (!record.providerIds.includes(id)) record.providerIds.push(id);
		registry.providers.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: normalizedProvider,
			source: record.source,
			rootDir: record.rootDir
		});
		registerSynthesizedTextModelCatalogProvider({
			record,
			provider: normalizedProvider
		});
	};
	const registerAgentHarness$1 = (record, harness) => {
		const id = normalizeOptionalString$2(harness?.id) ?? "";
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "agent harness registration missing id"
			});
			return;
		}
		if (typeof harness.supports !== "function" || typeof harness.runAttempt !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `agent harness "${id}" registration missing required runtime methods`
			});
			return;
		}
		const existing = registryParams.activateGlobalSideEffects === false ? registry.agentHarnesses.find((entry) => entry.harness.id === id) : getRegisteredAgentHarness(id);
		if (existing) {
			const ownerPluginId = "ownerPluginId" in existing ? existing.ownerPluginId : "pluginId" in existing ? existing.pluginId : void 0;
			const ownerDetail = ownerPluginId ? ` (owner: ${ownerPluginId})` : "";
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `agent harness already registered: ${id}${ownerDetail}`
			});
			return;
		}
		const normalizedHarness = {
			...harness,
			id,
			pluginId: harness.pluginId ?? record.id
		};
		if (registryParams.activateGlobalSideEffects !== false) registerAgentHarness(normalizedHarness, { ownerPluginId: record.id });
		record.agentHarnessIds.push(id);
		registry.agentHarnesses.push({
			pluginId: record.id,
			pluginName: record.name,
			harness: normalizedHarness,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerCliBackend = (record, backend) => {
		const id = backend.id.trim();
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "cli backend registration missing id"
			});
			return;
		}
		const existing = (registry.cliBackends ?? []).find((entry) => entry.backend.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `cli backend already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		(registry.cliBackends ??= []).push({
			pluginId: record.id,
			pluginName: record.name,
			backend: {
				...backend,
				id
			},
			source: record.source,
			rootDir: record.rootDir
		});
		record.cliBackendIds.push(id);
	};
	const registerTextTransforms = (record, transforms) => {
		if ((!transforms.input || transforms.input.length === 0) && (!transforms.output || transforms.output.length === 0)) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: "text transform registration has no input or output replacements"
			});
			return;
		}
		registry.textTransforms.push({
			pluginId: record.id,
			pluginName: record.name,
			transforms,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerEmbeddingProviderForPlugin = (record, adapter) => {
		const id = adapter.id.trim();
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "embedding provider registration missing id"
			});
			return;
		}
		if (!(record.contracts?.embeddingProviders ?? []).includes(id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.embeddingProviders for adapter: ${id}`
			});
			return;
		}
		const existing = registryParams.activateGlobalSideEffects === false ? registry.embeddingProviders.find((entry) => entry.provider.id === id) : getRegisteredEmbeddingProvider(id);
		if (existing) {
			const ownerPluginId = "ownerPluginId" in existing ? existing.ownerPluginId : "pluginId" in existing ? existing.pluginId : void 0;
			const ownerDetail = ownerPluginId ? ` (owner: ${ownerPluginId})` : "";
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `embedding provider already registered: ${id}${ownerDetail}`
			});
			return;
		}
		if (registryParams.activateGlobalSideEffects !== false) registerEmbeddingProvider(adapter, { ownerPluginId: record.id });
		registry.embeddingProviders.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: adapter,
			source: record.source,
			rootDir: record.rootDir
		});
		if (!record.embeddingProviderIds.includes(id)) record.embeddingProviderIds.push(id);
	};
	const registerUniqueProviderLike = (params) => {
		const id = params.provider.id.trim();
		const { record, kindLabel } = params;
		const missingLabel = `${kindLabel} registration missing id`;
		const duplicateLabel = `${kindLabel} already registered: ${id}`;
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: missingLabel
			});
			return false;
		}
		const existing = params.registrations.find((entry) => entry.provider.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `${duplicateLabel} (${existing.pluginId})`
			});
			return false;
		}
		if (!params.ownedIds.includes(id)) params.ownedIds.push(id);
		params.registrations.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: params.provider,
			source: record.source,
			rootDir: record.rootDir
		});
		return true;
	};
	const registerSpeechProvider = (record, provider) => {
		if (registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "speech provider",
			registrations: registry.speechProviders,
			ownedIds: record.speechProviderIds
		})) registerSynthesizedVoiceModelCatalogProvider({
			record,
			provider,
			capabilities: { tts: true },
			modes: ["tts"]
		});
	};
	const registerRealtimeTranscriptionProvider = (record, provider) => {
		if (registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "realtime transcription provider",
			registrations: registry.realtimeTranscriptionProviders,
			ownedIds: record.realtimeTranscriptionProviderIds
		})) registerSynthesizedVoiceModelCatalogProvider({
			record,
			provider,
			capabilities: { realtime_transcription: true },
			modes: ["realtime_transcription"]
		});
	};
	const registerRealtimeVoiceProvider = (record, provider) => {
		if (registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "realtime voice provider",
			registrations: registry.realtimeVoiceProviders,
			ownedIds: record.realtimeVoiceProviderIds
		})) registerSynthesizedVoiceModelCatalogProvider({
			record,
			provider,
			capabilities: { realtime_voice: true },
			modes: ["realtime_voice"]
		});
	};
	const registerMediaUnderstandingProvider = (record, provider) => {
		registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "media provider",
			registrations: registry.mediaUnderstandingProviders,
			ownedIds: record.mediaUnderstandingProviderIds
		});
	};
	const registerTranscriptSourceProvider = (record, provider) => {
		registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "transcripts source provider",
			registrations: registry.transcriptSourceProviders,
			ownedIds: record.transcriptSourceProviderIds
		});
	};
	const registerImageGenerationProvider = (record, provider) => {
		if (registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "image-generation provider",
			registrations: registry.imageGenerationProviders,
			ownedIds: record.imageGenerationProviderIds
		})) registerSynthesizedMediaModelCatalogProvider({
			record,
			kind: "image_generation",
			provider
		});
	};
	const registerVideoGenerationProvider = (record, provider) => {
		if (registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "video-generation provider",
			registrations: registry.videoGenerationProviders,
			ownedIds: record.videoGenerationProviderIds
		})) registerSynthesizedMediaModelCatalogProvider({
			record,
			kind: "video_generation",
			provider
		});
	};
	const registerMusicGenerationProvider = (record, provider) => {
		if (registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "music-generation provider",
			registrations: registry.musicGenerationProviders,
			ownedIds: record.musicGenerationProviderIds
		})) registerSynthesizedMediaModelCatalogProvider({
			record,
			kind: "music_generation",
			provider
		});
	};
	const registerWebFetchProvider = (record, provider) => {
		registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "web fetch provider",
			registrations: registry.webFetchProviders,
			ownedIds: record.webFetchProviderIds
		});
	};
	const registerWebSearchProvider = (record, provider) => {
		registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "web search provider",
			registrations: registry.webSearchProviders,
			ownedIds: record.webSearchProviderIds
		});
	};
	const registerMigrationProvider = (record, provider) => {
		registerUniqueProviderLike({
			record,
			provider,
			kindLabel: "migration provider",
			registrations: registry.migrationProviders,
			ownedIds: record.migrationProviderIds
		});
	};
	const registerCli = (record, registrar, opts) => {
		const normalizeCommandRoot = (raw, source) => {
			const normalized = normalizeCommandDescriptorName(raw);
			if (!normalized) pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `invalid cli ${source} name: ${JSON.stringify(raw.trim())}`
			});
			return normalized;
		};
		const parentPath = (opts?.parentPath ?? []).map((segment) => normalizeCommandRoot(segment, "command"));
		if (parentPath.some((segment) => segment === null)) return;
		const normalizedParentPath = parentPath;
		const descriptors = (opts?.descriptors ?? []).map((descriptor) => {
			const name = normalizeCommandRoot(descriptor.name, "descriptor");
			const description = sanitizeCommandDescriptorDescription(descriptor.description);
			return name && description ? {
				name,
				description,
				hasSubcommands: descriptor.hasSubcommands
			} : null;
		}).filter((descriptor) => descriptor !== null);
		const commands = [...opts?.commands ?? [], ...descriptors.map((descriptor) => descriptor.name)].map((cmd) => normalizeCommandRoot(cmd, "command")).filter((command) => command !== null);
		if (commands.length === 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "cli registration missing explicit commands metadata"
			});
			return;
		}
		const serializeCommandPath = (command) => [...normalizedParentPath, command].join(" ");
		const commandPaths = commands.map(serializeCommandPath);
		const commandPathSet = new Set(commandPaths);
		const existing = registry.cliRegistrars.find((entry) => entry.commands.map((command) => [...entry.parentPath ?? [], command].join(" ")).some((commandPath) => commandPathSet.has(commandPath)));
		if (existing) {
			const existingCommandPaths = new Set(existing.commands.map((command) => [...existing.parentPath ?? [], command].join(" ")));
			const overlap = commandPaths.find((commandPath) => existingCommandPaths.has(commandPath));
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `cli command already registered: ${overlap ?? commands[0]} (${existing.pluginId})`
			});
			return;
		}
		record.cliCommands.push(...commandPaths);
		registry.cliRegistrars.push({
			pluginId: record.id,
			pluginName: record.name,
			register: registrar,
			parentPath: normalizedParentPath,
			commands,
			descriptors,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const reservedNodeHostCommands = new Set([
		...NODE_SYSTEM_RUN_COMMANDS,
		...NODE_EXEC_APPROVALS_COMMANDS,
		NODE_SYSTEM_NOTIFY_COMMAND
	]);
	const registerReload = (record, registration) => {
		const normalized = {
			restartPrefixes: normalizeStringEntries(registration.restartPrefixes),
			hotPrefixes: normalizeStringEntries(registration.hotPrefixes),
			noopPrefixes: normalizeStringEntries(registration.noopPrefixes)
		};
		if ((normalized.restartPrefixes?.length ?? 0) === 0 && (normalized.hotPrefixes?.length ?? 0) === 0 && (normalized.noopPrefixes?.length ?? 0) === 0) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: "reload registration missing prefixes"
			});
			return;
		}
		registry.reloads ??= [];
		registry.reloads.push({
			pluginId: record.id,
			pluginName: record.name,
			registration: normalized,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerNodeHostCommand = (record, nodeCommand) => {
		const command = nodeCommand.command.trim();
		if (!command) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "node host command registration missing command"
			});
			return;
		}
		if (reservedNodeHostCommands.has(command)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `node host command reserved by core: ${command}`
			});
			return;
		}
		registry.nodeHostCommands ??= [];
		const existing = registry.nodeHostCommands.find((entry) => entry.command.command === command);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `node host command already registered: ${command} (${existing.pluginId})`
			});
			return;
		}
		registry.nodeHostCommands.push({
			pluginId: record.id,
			pluginName: record.name,
			command: {
				...nodeCommand,
				command,
				cap: normalizeOptionalString$2(nodeCommand.cap)
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerNodeInvokePolicy = (record, policy, pluginConfig) => {
		const commands = normalizeUniqueStringEntries(Array.isArray(policy.commands) ? policy.commands : []);
		if (commands.length === 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "node invoke policy registration missing commands"
			});
			return;
		}
		if (typeof policy.handle !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `node invoke policy registration missing handler: ${commands.join(", ")}`
			});
			return;
		}
		registry.nodeInvokePolicies ??= [];
		for (const command of commands) {
			const existing = registry.nodeInvokePolicies.find((entry) => entry.policy.commands.includes(command));
			if (existing) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `node invoke policy already registered for ${command} (${existing.pluginId})`
				});
				return;
			}
		}
		registry.nodeInvokePolicies.push({
			pluginId: record.id,
			pluginName: record.name,
			policy: {
				...policy,
				commands
			},
			pluginConfig,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerSecurityAuditCollector = (record, collector) => {
		registry.securityAuditCollectors ??= [];
		registry.securityAuditCollectors.push({
			pluginId: record.id,
			pluginName: record.name,
			collector,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerService = (record, service) => {
		const id = service.id.trim();
		if (!id) return;
		const existing = registry.services.find((entry) => entry.service.id === id);
		if (existing) {
			if (existing.pluginId === record.id) return;
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `service already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		record.services.push(id);
		registry.services.push({
			pluginId: record.id,
			pluginName: record.name,
			service,
			source: record.source,
			origin: record.origin,
			trustedOfficialInstall: record.trustedOfficialInstall,
			rootDir: record.rootDir
		});
	};
	const registerGatewayDiscoveryService = (record, service) => {
		const id = service.id.trim();
		if (!id) return;
		const existing = registry.gatewayDiscoveryServices.find((entry) => entry.service.id === id);
		if (existing) {
			if (existing.pluginId === record.id) return;
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `gateway discovery service already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		record.gatewayDiscoveryServiceIds.push(id);
		registry.gatewayDiscoveryServices.push({
			pluginId: record.id,
			pluginName: record.name,
			service,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerCommand = (record, command) => {
		const name = command.name.trim();
		if (!name) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "command registration missing name"
			});
			return;
		}
		const allowReservedCommandNames = command.ownership === "reserved";
		if (allowReservedCommandNames && !canClaimReservedCommandOwnership(record)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `only bundled plugins can claim reserved command ownership: ${name}`
			});
			return;
		}
		if (allowReservedCommandNames && !isReservedCommandName(name)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `reserved command ownership requires a reserved command name: ${name}`
			});
			return;
		}
		if (allowReservedCommandNames && record.id !== normalizeLowercaseStringOrEmpty(name)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `command registration failed: Reserved command ownership requires plugin id "${record.id}" to match reserved command name "${normalizeLowercaseStringOrEmpty(name)}"`
			});
			return;
		}
		if (!registryParams.activateGlobalSideEffects) {
			const validationError = validatePluginCommandDefinition(command, { allowReservedCommandNames });
			if (validationError) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `command registration failed: ${validationError}`
				});
				return;
			}
		} else {
			const { ownership: _ownership, ...commandForRegistration } = command;
			const result = registerPluginCommand(record.id, allowReservedCommandNames ? commandForRegistration : command, {
				pluginName: record.name,
				pluginRoot: record.rootDir,
				allowReservedCommandNames,
				allowOwnerStatusExposure: canClaimReservedCommandOwnership(record)
			});
			if (!result.ok) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `command registration failed: ${result.error}`
				});
				return;
			}
			if (allowReservedCommandNames) {
				const registeredCommand = pluginCommands.get(`/${name.toLowerCase()}`);
				if (registeredCommand?.pluginId === record.id) registeredCommand.ownership = "reserved";
			}
		}
		record.commands.push(name);
		registry.commands.push({
			pluginId: record.id,
			pluginName: record.name,
			command,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const normalizeHostHookString = (value) => typeof value === "string" ? normalizePluginHostHookId(value) : "";
	const normalizeOptionalHostHookString = (value) => {
		if (value === void 0) return;
		if (typeof value !== "string") return "";
		return value.trim();
	};
	const normalizeHostHookStringList = (value) => {
		if (value === void 0) return;
		if (!Array.isArray(value)) return null;
		const normalized = value.map((item) => normalizeOptionalHostHookString(item));
		if (normalized.some((item) => !item)) return null;
		return normalized;
	};
	const validateSessionActionSchema = (record, id, schema) => {
		if (schema === void 0) return true;
		if (!isPluginJsonValue(schema)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session action schema must be JSON-compatible: ${id}`
			});
			return false;
		}
		if (typeof schema !== "boolean" && (!schema || typeof schema !== "object" || Array.isArray(schema))) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session action schema must be a JSON schema object or boolean: ${id}`
			});
			return false;
		}
		try {
			validateJsonSchemaValue({
				schema,
				cacheKey: `plugin-session-action-registration:${record.id}:${id}`,
				value: void 0
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session action schema is not valid JSON Schema: ${id}: ${message}`
			});
			return false;
		}
		return true;
	};
	const controlUiSurfaces = new Set([
		"session",
		"tool",
		"run",
		"settings"
	]);
	const registerSessionExtension = (record, extension) => {
		const namespace = normalizeHostHookString(extension.namespace);
		const description = normalizeHostHookString(extension.description);
		const project = extension.project;
		let normalizedSessionEntrySlotKey;
		let invalidMessage;
		if (!namespace || !description) invalidMessage = "session extension registration requires namespace and description";
		else if (project !== void 0 && typeof project !== "function") invalidMessage = "session extension projector must be a function";
		else if (project?.constructor?.name === "AsyncFunction") invalidMessage = "session extension projector must be synchronous";
		else if (extension.cleanup !== void 0 && typeof extension.cleanup !== "function") invalidMessage = "session extension cleanup must be a function";
		else if (extension.sessionEntrySlotKey !== void 0) {
			const slotKey = normalizeSessionEntrySlotKey(extension.sessionEntrySlotKey);
			if (!slotKey.ok) invalidMessage = slotKey.error;
			else normalizedSessionEntrySlotKey = slotKey.key;
		}
		if (invalidMessage) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: invalidMessage
			});
			return;
		}
		if ((registry.sessionExtensions ?? []).find((entry) => entry.pluginId === record.id && entry.extension.namespace === namespace)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session extension already registered: ${namespace}`
			});
			return;
		}
		if (normalizedSessionEntrySlotKey) {
			if ((registry.sessionExtensions ?? []).find((entry) => {
				const existingSlotKey = entry.extension.sessionEntrySlotKey;
				if (existingSlotKey === void 0) return false;
				const normalizedExistingSlotKey = normalizeSessionEntrySlotKey(existingSlotKey);
				return normalizedExistingSlotKey.ok && normalizedExistingSlotKey.key === normalizedSessionEntrySlotKey;
			})) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `sessionEntrySlotKey already registered: ${normalizedSessionEntrySlotKey}`
				});
				return;
			}
		}
		(registry.sessionExtensions ??= []).push({
			pluginId: record.id,
			pluginName: record.name,
			extension: {
				...extension,
				namespace,
				description,
				...normalizedSessionEntrySlotKey ? { sessionEntrySlotKey: normalizedSessionEntrySlotKey } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerTrustedToolPolicy = (record, policy) => {
		if (!policy || typeof policy !== "object") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "trusted tool policy registration requires id, description, and evaluate()"
			});
			return;
		}
		const id = normalizeHostHookString(policy.id);
		const description = normalizeHostHookString(policy.description);
		if (!id || !description || typeof policy.evaluate !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "trusted tool policy registration requires id, description, and evaluate()"
			});
			return;
		}
		if (record.origin !== "bundled" && !(record.contracts?.trustedToolPolicies ?? []).includes(id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.trustedToolPolicies for: ${id}`
			});
			return;
		}
		if (!canRegisterInstalledTrustedHook(record)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must be explicitly enabled to register trusted tool policy: ${id}`
			});
			return;
		}
		const policies = registry.trustedToolPolicies ??= [];
		const existing = policies.find((entry) => entry.pluginId === record.id && entry.policy.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `trusted tool policy already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		const registration = {
			pluginId: record.id,
			pluginName: record.name,
			policy: {
				...policy,
				id,
				description
			},
			origin: record.origin,
			source: record.source,
			rootDir: record.rootDir
		};
		if (record.origin === "bundled") {
			const firstInstalledPolicyIndex = policies.findIndex((entry) => entry.origin !== "bundled");
			if (firstInstalledPolicyIndex === -1) policies.push(registration);
			else policies.splice(firstInstalledPolicyIndex, 0, registration);
			return;
		}
		policies.push(registration);
	};
	const registerToolMetadata = (record, metadata) => {
		const toolName = normalizeHostHookString(metadata.toolName);
		if (!toolName) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "tool metadata registration missing toolName"
			});
			return;
		}
		const undeclared = findUndeclaredPluginToolNames({
			declaredNames: normalizePluginToolContractNames(record.contracts),
			toolNames: [toolName]
		});
		if (undeclared.length > 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.tools for tool metadata: ${undeclared.join(", ")}`
			});
			return;
		}
		const existing = (registry.toolMetadata ?? []).find((entry) => entry.pluginId === record.id && entry.metadata.toolName === toolName);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `tool metadata already registered: ${toolName} (${existing.pluginId})`
			});
			return;
		}
		const displayName = normalizeOptionalHostHookString(metadata.displayName);
		const description = normalizeOptionalHostHookString(metadata.description);
		const tags = normalizeHostHookStringList(metadata.tags);
		if (displayName === "" || description === "" || tags === null || metadata.risk !== void 0 && ![
			"low",
			"medium",
			"high"
		].includes(metadata.risk)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `tool metadata registration has invalid metadata: ${toolName}`
			});
			return;
		}
		(registry.toolMetadata ??= []).push({
			pluginId: record.id,
			pluginName: record.name,
			metadata: {
				...metadata,
				toolName,
				...displayName !== void 0 ? { displayName } : {},
				...description !== void 0 ? { description } : {},
				...tags !== void 0 ? { tags } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerControlUiDescriptor = (record, descriptor) => {
		const legacyDescriptor = descriptor;
		const id = normalizeHostHookString(descriptor.id);
		const label = normalizeHostHookString(descriptor.label ?? legacyDescriptor.name);
		const description = normalizeOptionalHostHookString(descriptor.description);
		const placement = normalizeOptionalHostHookString(descriptor.placement);
		const requiredScopes = normalizeHostHookStringList(descriptor.requiredScopes);
		const surface = typeof descriptor.surface === "string" ? descriptor.surface : "session";
		if (!id || !label || !controlUiSurfaces.has(surface) || description === "" || placement === "" || requiredScopes === null) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "control UI descriptor registration requires id, surface, label, and valid optional fields"
			});
			return;
		}
		if (requiredScopes !== void 0) {
			const unknownScope = requiredScopes.find((scope) => !isOperatorScope(scope));
			if (unknownScope !== void 0) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `control UI descriptor requiredScopes contains unknown operator scope: ${unknownScope}`
				});
				return;
			}
		}
		if (descriptor.schema !== void 0 && !isPluginJsonValue(descriptor.schema)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `control UI descriptor schema must be JSON-compatible: ${id}`
			});
			return;
		}
		if ((registry.controlUiDescriptors ?? []).find((entry) => entry.pluginId === record.id && entry.descriptor.id === id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `control UI descriptor already registered: ${id}`
			});
			return;
		}
		(registry.controlUiDescriptors ??= []).push({
			pluginId: record.id,
			pluginName: record.name,
			descriptor: {
				...descriptor,
				id,
				surface,
				label,
				...description !== void 0 ? { description } : {},
				...placement !== void 0 ? { placement } : {},
				...requiredScopes !== void 0 ? { requiredScopes } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerRuntimeLifecycle = (record, lifecycle) => {
		const id = normalizePluginHostHookId(lifecycle.id);
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "runtime lifecycle registration missing id"
			});
			return;
		}
		if ((registry.runtimeLifecycles ?? []).find((entry) => entry.pluginId === record.id && entry.lifecycle.id === id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `runtime lifecycle already registered: ${id}`
			});
			return;
		}
		if (lifecycle.cleanup !== void 0 && typeof lifecycle.cleanup !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `runtime lifecycle cleanup must be a function: ${id}`
			});
			return;
		}
		(registry.runtimeLifecycles ??= []).push({
			pluginId: record.id,
			pluginName: record.name,
			lifecycle: {
				...lifecycle,
				id
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerAgentEventSubscription = (record, subscription) => {
		const id = normalizePluginHostHookId(subscription.id);
		if (!id || typeof subscription.handle !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "agent event subscription registration requires id and handle"
			});
			return;
		}
		const streams = normalizeHostHookStringList(subscription.streams);
		if (streams === null) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `agent event subscription streams must be an array of strings: ${id}`
			});
			return;
		}
		if ((registry.agentEventSubscriptions ?? []).find((entry) => entry.pluginId === record.id && entry.subscription.id === id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `agent event subscription already registered: ${id}`
			});
			return;
		}
		(registry.agentEventSubscriptions ??= []).push({
			pluginId: record.id,
			pluginName: record.name,
			subscription: {
				...subscription,
				id,
				...streams !== void 0 ? { streams } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerSessionSchedulerJob = (record, job) => {
		const jobId = normalizeHostHookString(job.id);
		const sessionKey = normalizeHostHookString(job.sessionKey);
		const kind = normalizeHostHookString(job.kind);
		if (jobId && (registry.sessionSchedulerJobs ?? []).some((entry) => entry.pluginId === record.id && entry.job.id === jobId)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session scheduler job already registered: ${jobId}`
			});
			return;
		}
		if (!jobId || !sessionKey || !kind) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "session scheduler job registration requires unique id, sessionKey, and kind"
			});
			return;
		}
		if (job.cleanup !== void 0 && typeof job.cleanup !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session scheduler job cleanup must be a function: ${jobId}`
			});
			return;
		}
		if (registryParams.activateGlobalSideEffects === false) {
			(registry.sessionSchedulerJobs ??= []).push({
				pluginId: record.id,
				pluginName: record.name,
				job: {
					...job,
					id: jobId,
					sessionKey,
					kind
				},
				source: record.source,
				rootDir: record.rootDir
			});
			return {
				id: jobId,
				pluginId: record.id,
				sessionKey,
				kind
			};
		}
		const handle = registerPluginSessionSchedulerJob({
			pluginId: record.id,
			pluginName: record.name,
			ownerRegistry: registry,
			job: {
				...job,
				id: jobId,
				sessionKey,
				kind
			}
		});
		if (!handle) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "session scheduler job registration requires unique id, sessionKey, and kind"
			});
			return;
		}
		(registry.sessionSchedulerJobs ??= []).push({
			pluginId: record.id,
			pluginName: record.name,
			job: {
				...job,
				id: handle.id,
				sessionKey: handle.sessionKey,
				kind: handle.kind
			},
			generation: getPluginSessionSchedulerJobGeneration({
				pluginId: record.id,
				jobId: handle.id,
				sessionKey: handle.sessionKey
			}),
			source: record.source,
			rootDir: record.rootDir
		});
		return handle;
	};
	const registerSessionAction = (record, action) => {
		const id = normalizeHostHookString(action.id);
		const description = normalizeOptionalHostHookString(action.description);
		const requiredScopes = normalizeHostHookStringList(action.requiredScopes);
		if (!id || description === "" || requiredScopes === null || typeof action.handler !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "session action registration requires id, handler, and valid optional fields"
			});
			return;
		}
		if (requiredScopes !== void 0) {
			const unknownScope = requiredScopes.find((scope) => !isOperatorScope(scope));
			if (unknownScope !== void 0) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `session action requiredScopes contains unknown operator scope: ${unknownScope}`
				});
				return;
			}
		}
		if (!validateSessionActionSchema(record, id, action.schema)) return;
		if ((registry.sessionActions ?? []).find((entry) => entry.pluginId === record.id && entry.action.id === id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session action already registered: ${id}`
			});
			return;
		}
		(registry.sessionActions ??= []).push({
			pluginId: record.id,
			pluginName: record.name,
			action: {
				...action,
				id,
				...description !== void 0 ? { description } : {},
				...requiredScopes !== void 0 ? { requiredScopes } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerTypedHook = (record, hookName, handler, opts, policy) => {
		if (!isPluginHookName(hookName)) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: `unknown typed hook "${String(hookName)}" ignored`
			});
			return;
		}
		const effectiveHookName = hookName === "deactivate" ? "gateway_stop" : hookName;
		if (hookName === "deactivate") pushDiagnostic({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message: formatLegacyDeactivateHookAliasDiagnostic()
		});
		else {
			const deprecatedHookDiagnostic = formatDeprecatedTypedHookDiagnostic(hookName);
			if (deprecatedHookDiagnostic) pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: deprecatedHookDiagnostic
			});
		}
		let effectiveHandler = handler;
		if (policy?.allowPromptInjection === false && isPromptInjectionHookName(effectiveHookName)) {
			if (effectiveHookName !== "before_agent_start") {
				pushDiagnostic({
					level: "warn",
					pluginId: record.id,
					source: record.source,
					message: `typed hook "${effectiveHookName}" blocked by plugins.entries.${record.id}.hooks.allowPromptInjection=false`
				});
				return;
			}
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: `typed hook "${effectiveHookName}" prompt fields constrained by plugins.entries.${record.id}.hooks.allowPromptInjection=false`
			});
			effectiveHandler = constrainLegacyPromptInjectionHook(handler);
		}
		if (isConversationHookName(effectiveHookName)) {
			const explicitConversationAccess = policy?.allowConversationAccess;
			if (record.origin !== "bundled" && explicitConversationAccess !== true) {
				pushDiagnostic({
					level: "warn",
					pluginId: record.id,
					source: record.source,
					message: `typed hook "${effectiveHookName}" blocked because non-bundled plugins must set plugins.entries.${record.id}.hooks.allowConversationAccess=true`
				});
				return;
			}
			if (record.origin === "bundled" && explicitConversationAccess === false) {
				pushDiagnostic({
					level: "warn",
					pluginId: record.id,
					source: record.source,
					message: `typed hook "${effectiveHookName}" blocked by plugins.entries.${record.id}.hooks.allowConversationAccess=false`
				});
				return;
			}
		}
		const timeoutMs = resolveTypedHookTimeoutMs({
			hookName: effectiveHookName,
			opts,
			policy
		});
		record.hookCount += 1;
		registry.typedHooks.push({
			pluginId: record.id,
			hookName: effectiveHookName,
			handler: effectiveHandler,
			priority: opts?.priority,
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			source: record.source
		});
	};
	const registerConversationBindingResolvedHandler = (record, handler) => {
		registry.conversationBindingResolvedHandlers.push({
			pluginId: record.id,
			pluginName: record.name,
			pluginRoot: record.rootDir,
			handler,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const normalizeLogger = (logger) => ({
		info: logger.info,
		warn: logger.warn,
		error: logger.error,
		debug: logger.debug
	});
	const pluginRuntimeById = /* @__PURE__ */ new Map();
	const pluginRuntimeRecordById = /* @__PURE__ */ new Map();
	const addPluginRuntimeResolutionContext = (params) => {
		const { error, pluginId, prop } = params;
		if (error instanceof Error && error.message.startsWith("Unable to resolve plugin runtime module") && !error.message.includes("pluginRuntimeContext=")) {
			const record = pluginRuntimeRecordById.get(pluginId) ?? registry.plugins.find((entry) => entry.id === pluginId);
			const propName = typeof prop === "symbol" ? prop.description ?? prop.toString() : String(prop);
			error.message = [
				error.message,
				`pluginRuntimeContext=pluginId:${pluginId}`,
				`property:${propName}`,
				...record?.source ? [`source:${record.source}`] : []
			].join("; ");
		}
		throw error;
	};
	const resolvePluginRuntime = (pluginId) => {
		const cached = pluginRuntimeById.get(pluginId);
		if (cached) return cached;
		const runtime = new Proxy(registryParams.runtime, { get(target, prop, receiver) {
			const runWithPluginScope = (run) => {
				const record = pluginRuntimeRecordById.get(pluginId) ?? registry.plugins.find((entry) => entry.id === pluginId);
				return record?.source ? withPluginRuntimePluginScope({
					pluginId,
					pluginSource: record.source
				}, run) : withPluginRuntimePluginScope({ pluginId }, run);
			};
			const getRuntimeProperty = () => {
				try {
					return Reflect.get(target, prop, receiver);
				} catch (error) {
					return addPluginRuntimeResolutionContext({
						error,
						pluginId,
						prop
					});
				}
			};
			if (prop === "state") {
				const baseState = getRuntimeProperty();
				const assertPluginStateAllowed = () => {
					const record = pluginRuntimeRecordById.get(pluginId) ?? registry.plugins.find((entry) => entry.id === pluginId);
					if (record?.origin !== "bundled" && record?.trustedOfficialInstall !== true) throw new Error("openKeyedStore is only available for trusted plugins in this release.");
				};
				return {
					...baseState,
					openKeyedStore: (options) => {
						assertPluginStateAllowed();
						return createPluginStateKeyedStore(pluginId, options);
					},
					openSyncKeyedStore: (options) => {
						assertPluginStateAllowed();
						return createPluginStateSyncKeyedStore(pluginId, options);
					},
					openChannelIngressQueue: (options) => {
						assertPluginStateAllowed();
						const stateDir = options?.stateDir ?? baseState.resolveStateDir();
						return createChannelIngressQueue({
							...options,
							channelId: pluginId,
							stateDir
						});
					}
				};
			}
			if (prop === "config") {
				const config = getRuntimeProperty();
				return {
					...config,
					current: () => runWithPluginScope(() => config.current()),
					mutateConfigFile: (params) => runWithPluginScope(() => config.mutateConfigFile(params)),
					replaceConfigFile: (params) => runWithPluginScope(() => config.replaceConfigFile(params))
				};
			}
			if (prop === "llm") {
				const llm = getRuntimeProperty();
				return { complete: (params) => withPluginRuntimePluginIdScope(pluginId, () => llm.complete(params)) };
			}
			if (prop !== "subagent") return getRuntimeProperty();
			const subagent = getRuntimeProperty();
			return {
				run: (params) => withPluginRuntimePluginIdScope(pluginId, () => subagent.run(params)),
				waitForRun: (params) => withPluginRuntimePluginIdScope(pluginId, () => subagent.waitForRun(params)),
				getSessionMessages: (params) => withPluginRuntimePluginIdScope(pluginId, () => subagent.getSessionMessages(params)),
				getSession: (params) => withPluginRuntimePluginIdScope(pluginId, () => subagent.getSession(params)),
				deleteSession: (params) => withPluginRuntimePluginIdScope(pluginId, () => subagent.deleteSession(params))
			};
		} });
		pluginRuntimeById.set(pluginId, runtime);
		return runtime;
	};
	const createApi = (record, params) => {
		const registrationMode = params.registrationMode ?? "full";
		const registrationCapabilities = resolvePluginRegistrationCapabilities(registrationMode);
		pluginRuntimeRecordById.set(record.id, record);
		const sideEffectGuard = createPluginSideEffectGuard(record.id);
		const isLoadedRecordInRegistry = () => registry.plugins.some((plugin) => plugin.id === record.id && plugin.status === "loaded");
		const isLoadedRecordInActiveRegistry = () => getActivePluginRegistry() === registry && isLoadedRecordInRegistry();
		const isActivatingLoadedRecord = () => registryParams.activateGlobalSideEffects !== false && record.enabled && record.status === "loaded" && !registry.plugins.some((plugin) => plugin.id === record.id);
		const shouldCommitWorkflowSideEffect = () => sideEffectGuard.active && !isPluginRegistryRetired(registry) && (isActivatingLoadedRecord() || isPluginRegistryActivated(registry) && isLoadedRecordInRegistry());
		return buildPluginApi({
			id: record.id,
			name: record.name,
			version: record.version,
			description: record.description,
			source: record.source,
			rootDir: record.rootDir,
			registrationMode,
			config: params.config,
			pluginConfig: params.pluginConfig,
			runtime: resolvePluginRuntime(record.id),
			logger: normalizeLogger(registryParams.logger),
			resolvePath: (input) => resolvePluginPath(input, record.rootDir),
			handlers: {
				...registrationCapabilities.capabilityHandlers ? {
					registerTool: (tool, opts) => registerTool(record, tool, opts),
					registerHook: (events, handler, opts) => registerHook(record, events, handler, opts, params.config, params.pluginConfig),
					registerHttpRoute: (routeParams) => registerHttpRoute(record, routeParams),
					registerHostedMediaResolver: (resolver) => registerHostedMediaResolver(record, resolver),
					registerProvider: (provider) => registerProvider(record, provider),
					registerModelCatalogProvider: (provider) => registerModelCatalogProvider(record, provider),
					registerEmbeddingProvider: (provider) => registerEmbeddingProviderForPlugin(record, provider),
					registerAgentHarness: (harness) => registerAgentHarness$1(record, harness),
					registerDetachedTaskRuntime: (runtime) => {
						const existing = getDetachedTaskLifecycleRuntimeRegistration();
						if (existing && existing.pluginId !== record.id) {
							pushDiagnostic({
								level: "error",
								pluginId: record.id,
								source: record.source,
								message: `detached task runtime already registered by ${existing.pluginId}`
							});
							return;
						}
						registerDetachedTaskLifecycleRuntime(record.id, runtime);
					},
					registerSpeechProvider: (provider) => registerSpeechProvider(record, provider),
					registerRealtimeTranscriptionProvider: (provider) => registerRealtimeTranscriptionProvider(record, provider),
					registerRealtimeVoiceProvider: (provider) => registerRealtimeVoiceProvider(record, provider),
					registerMediaUnderstandingProvider: (provider) => registerMediaUnderstandingProvider(record, provider),
					registerTranscriptSourceProvider: (provider) => registerTranscriptSourceProvider(record, provider),
					registerImageGenerationProvider: (provider) => registerImageGenerationProvider(record, provider),
					registerVideoGenerationProvider: (provider) => registerVideoGenerationProvider(record, provider),
					registerMusicGenerationProvider: (provider) => registerMusicGenerationProvider(record, provider),
					registerWebFetchProvider: (provider) => registerWebFetchProvider(record, provider),
					registerWebSearchProvider: (provider) => registerWebSearchProvider(record, provider),
					registerMigrationProvider: (provider) => registerMigrationProvider(record, provider),
					registerGatewayMethod: (method, handler, opts) => registerGatewayMethod(record, method, handler, opts),
					registerService: (service) => registerService(record, service),
					registerGatewayDiscoveryService: (service) => registerGatewayDiscoveryService(record, service),
					registerCliBackend: (backend) => registerCliBackend(record, backend),
					registerTextTransforms: (transforms) => registerTextTransforms(record, transforms),
					registerReload: (registration) => registerReload(record, registration),
					registerNodeHostCommand: (command) => registerNodeHostCommand(record, command),
					registerNodeInvokePolicy: (policy) => registerNodeInvokePolicy(record, policy, params.pluginConfig),
					registerSecurityAuditCollector: (collector) => registerSecurityAuditCollector(record, collector),
					registerInteractiveHandler: (registration) => {
						const result = registerPluginInteractiveHandler(record.id, registration, {
							pluginName: record.name,
							pluginRoot: record.rootDir
						});
						if (!result.ok) pushDiagnostic({
							level: "warn",
							pluginId: record.id,
							source: record.source,
							message: result.error ?? "interactive handler registration failed"
						});
					},
					onConversationBindingResolved: (handler) => registerConversationBindingResolvedHandler(record, handler),
					registerCommand: (command) => registerCommand(record, command),
					registerContextEngine: (id, factory) => {
						const normalizedId = normalizeOptionalString$2(id) ?? "";
						if (!normalizedId) {
							pushDiagnostic({
								level: "error",
								pluginId: record.id,
								source: record.source,
								message: "context engine registration missing id"
							});
							return;
						}
						if (typeof factory !== "function") {
							pushDiagnostic({
								level: "error",
								pluginId: record.id,
								source: record.source,
								message: `context engine "${normalizedId}" registration missing factory`
							});
							return;
						}
						if (normalizedId === defaultSlotIdForKey("contextEngine")) {
							pushDiagnostic({
								level: "error",
								pluginId: record.id,
								source: record.source,
								message: `context engine id reserved by core: ${normalizedId}`
							});
							return;
						}
						const result = registerContextEngineForOwner(normalizedId, factory, `plugin:${record.id}`, { allowSameOwnerRefresh: true });
						if (!result.ok) {
							pushDiagnostic({
								level: "error",
								pluginId: record.id,
								source: record.source,
								message: `context engine already registered: ${normalizedId} (${result.existingOwner})`
							});
							return;
						}
						if (!record.contextEngineIds?.includes(normalizedId)) record.contextEngineIds = [...record.contextEngineIds ?? [], normalizedId];
					},
					registerCompactionProvider: (provider) => {
						const id = normalizeOptionalString$2(provider?.id);
						if (!id) {
							pushDiagnostic({
								level: "error",
								pluginId: record.id,
								source: record.source,
								message: "compaction provider registration missing id"
							});
							return;
						}
						if (typeof provider?.summarize !== "function") {
							pushDiagnostic({
								level: "error",
								pluginId: record.id,
								source: record.source,
								message: `compaction provider "${id}" registration missing summarize`
							});
							return;
						}
						const existing = getRegisteredCompactionProvider(id);
						if (existing) {
							const ownerDetail = existing.ownerPluginId ? ` (owner: ${existing.ownerPluginId})` : "";
							pushDiagnostic({
								level: "error",
								pluginId: record.id,
								source: record.source,
								message: `compaction provider already registered: ${id}${ownerDetail}`
							});
							return;
						}
						registerCompactionProvider(provider, { ownerPluginId: record.id });
					},
					registerCodexAppServerExtensionFactory: (factory) => {
						registerCodexAppServerExtensionFactory(record, factory);
					},
					registerAgentToolResultMiddleware: (handler, options) => {
						registerAgentToolResultMiddleware(record, handler, options);
					},
					registerSessionExtension: (extension) => registerSessionExtension(record, extension),
					enqueueNextTurnInjection: (injection) => {
						if (params.hookPolicy?.allowPromptInjection === false) {
							pushDiagnostic({
								level: "warn",
								pluginId: record.id,
								source: record.source,
								message: `next-turn injection blocked by plugins.entries.${record.id}.hooks.allowPromptInjection=false`
							});
							return Promise.resolve({
								enqueued: false,
								id: "",
								sessionKey: injection.sessionKey
							});
						}
						return enqueuePluginNextTurnInjection({
							cfg: registryParams.runtime.config.current(),
							pluginId: record.id,
							pluginName: record.name,
							injection
						});
					},
					registerTrustedToolPolicy: (policy) => registerTrustedToolPolicy(record, policy),
					registerToolMetadata: (metadata) => registerToolMetadata(record, metadata),
					registerControlUiDescriptor: (descriptor) => registerControlUiDescriptor(record, descriptor),
					registerRuntimeLifecycle: (lifecycle) => registerRuntimeLifecycle(record, lifecycle),
					registerAgentEventSubscription: (subscription) => registerAgentEventSubscription(record, subscription),
					emitAgentEvent: (event) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							emitted: false,
							reason: "global side effects disabled"
						};
						if (!shouldCommitWorkflowSideEffect()) return {
							emitted: false,
							reason: "plugin is not loaded"
						};
						return emitPluginAgentEvent({
							pluginId: record.id,
							pluginName: record.name,
							origin: record.origin,
							event
						});
					},
					setRunContext: (patch) => registryParams.activateGlobalSideEffects !== false && shouldCommitWorkflowSideEffect() ? setPluginRunContext({
						pluginId: record.id,
						patch
					}) : false,
					getRunContext: (get) => getPluginRunContext({
						pluginId: record.id,
						get
					}),
					clearRunContext: (paramsLocal) => {
						if (registryParams.activateGlobalSideEffects === false || !shouldCommitWorkflowSideEffect()) return;
						clearPluginRunContext({
							pluginId: record.id,
							runId: paramsLocal.runId,
							namespace: paramsLocal.namespace
						});
					},
					registerSessionSchedulerJob: (job) => registerSessionSchedulerJob(record, job),
					registerSessionAction: (action) => registerSessionAction(record, action),
					sendSessionAttachment: async (attachment) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							ok: false,
							error: "global side effects disabled"
						};
						try {
							if (!isLoadedRecordInActiveRegistry()) return {
								ok: false,
								error: "plugin is not loaded"
							};
							const runtimeConfig = registryParams.runtime.config?.current?.() ?? params.config;
							return await sendPluginSessionAttachment({
								...attachment,
								config: runtimeConfig,
								origin: record.origin
							});
						} catch (error) {
							return {
								ok: false,
								error: `attachment delivery setup failed: ${formatErrorMessage(error)}`
							};
						}
					},
					scheduleSessionTurn: async (schedule) => {
						if (registryParams.activateGlobalSideEffects === false) return;
						await Promise.resolve();
						return schedulePluginSessionTurn({
							pluginId: record.id,
							pluginName: record.name,
							origin: record.origin,
							schedule,
							cron: getHostCronService(),
							shouldCommit: isLoadedRecordInActiveRegistry,
							ownerRegistry: registry
						});
					},
					unscheduleSessionTurnsByTag: async (request) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							removed: 0,
							failed: 0
						};
						await Promise.resolve();
						if (!isLoadedRecordInActiveRegistry()) return {
							removed: 0,
							failed: 0
						};
						return unschedulePluginSessionTurnsByTag({
							pluginId: record.id,
							origin: record.origin,
							cron: getHostCronService(),
							request
						});
					},
					registerMemoryCapability: (capability) => {
						if (!hasKind(record.kind, "memory")) throwRegistrationError("only memory plugins can register a memory capability");
						if (Array.isArray(record.kind) && record.kind.length > 1 && !record.memorySlotSelected) {
							pushDiagnostic({
								level: "warn",
								pluginId: record.id,
								source: record.source,
								message: "dual-kind plugin not selected for memory slot; skipping memory capability registration"
							});
							return;
						}
						registerMemoryCapability(record.id, capability);
					},
					registerMemoryPromptSection: (builder) => {
						if (!hasKind(record.kind, "memory")) throwRegistrationError("only memory plugins can register a memory prompt section");
						if (Array.isArray(record.kind) && record.kind.length > 1 && !record.memorySlotSelected) {
							pushDiagnostic({
								level: "warn",
								pluginId: record.id,
								source: record.source,
								message: "dual-kind plugin not selected for memory slot; skipping memory prompt section registration"
							});
							return;
						}
						registerMemoryPromptSectionForPlugin(record.id, builder);
					},
					registerMemoryPromptSupplement: (builder) => {
						if (typeof builder !== "function") {
							pushDiagnostic({
								level: "error",
								pluginId: record.id,
								source: record.source,
								message: "memory prompt supplement registration missing builder"
							});
							return;
						}
						registerMemoryPromptSupplement(record.id, builder);
					},
					registerMemoryCorpusSupplement: (supplement) => {
						registerMemoryCorpusSupplement(record.id, supplement);
					},
					registerMemoryFlushPlan: (resolver) => {
						if (!hasKind(record.kind, "memory")) throwRegistrationError("only memory plugins can register a memory flush plan");
						if (Array.isArray(record.kind) && record.kind.length > 1 && !record.memorySlotSelected) {
							pushDiagnostic({
								level: "warn",
								pluginId: record.id,
								source: record.source,
								message: "dual-kind plugin not selected for memory slot; skipping memory flush plan registration"
							});
							return;
						}
						registerMemoryFlushPlanResolverForPlugin(record.id, resolver);
					},
					registerMemoryRuntime: (runtime) => {
						if (!hasKind(record.kind, "memory")) throwRegistrationError("only memory plugins can register a memory runtime");
						if (Array.isArray(record.kind) && record.kind.length > 1 && !record.memorySlotSelected) {
							pushDiagnostic({
								level: "warn",
								pluginId: record.id,
								source: record.source,
								message: "dual-kind plugin not selected for memory slot; skipping memory runtime registration"
							});
							return;
						}
						registerMemoryRuntimeForPlugin(record.id, runtime);
					},
					registerMemoryEmbeddingProvider: (adapter) => {
						if (hasKind(record.kind, "memory")) {
							if (Array.isArray(record.kind) && record.kind.length > 1 && !record.memorySlotSelected) {
								pushDiagnostic({
									level: "warn",
									pluginId: record.id,
									source: record.source,
									message: "dual-kind plugin not selected for memory slot; skipping memory embedding provider registration"
								});
								return;
							}
						} else if (!(record.contracts?.memoryEmbeddingProviders ?? []).includes(adapter.id)) {
							pushDiagnostic({
								level: "error",
								pluginId: record.id,
								source: record.source,
								message: `plugin must own memory slot or declare contracts.memoryEmbeddingProviders for adapter: ${adapter.id}`
							});
							return;
						}
						const existing = getRegisteredMemoryEmbeddingProvider(adapter.id);
						if (existing) {
							const ownerDetail = existing.ownerPluginId ? ` (owner: ${existing.ownerPluginId})` : "";
							pushDiagnostic({
								level: "error",
								pluginId: record.id,
								source: record.source,
								message: `memory embedding provider already registered: ${adapter.id}${ownerDetail}`
							});
							return;
						}
						registerMemoryEmbeddingProvider(adapter, { ownerPluginId: record.id });
						registry.memoryEmbeddingProviders.push({
							pluginId: record.id,
							pluginName: record.name,
							provider: adapter,
							source: record.source,
							rootDir: record.rootDir
						});
					},
					on: (hookName, handler, opts) => registerTypedHook(record, hookName, handler, opts, params.hookPolicy)
				} : {},
				...registrationCapabilities.setupRuntimeHandlers ? {
					registerHttpRoute: (routeParams) => registerHttpRoute(record, routeParams),
					registerGatewayMethod: (method, handler, opts) => registerGatewayMethod(record, method, handler, opts)
				} : {},
				registerCli: (registrar, opts) => registerCli(record, registrar, opts),
				registerChannel: (registration) => registerChannel(record, registration, registrationMode)
			}
		});
	};
	const rollbackPluginGlobalSideEffects = (pluginId) => {
		deactivatePluginSideEffectGuards(pluginId);
		if (registryParams.activateGlobalSideEffects === false) return;
		clearPluginCommandsForPlugin(pluginId);
		clearPluginInteractiveHandlersForPlugin(pluginId);
		clearCodeModeNamespacesForPlugin(pluginId);
		clearContextEnginesForOwner(`plugin:${pluginId}`);
		const hookRollbackEntries = pluginHookRollback.get(pluginId) ?? [];
		for (const entry of hookRollbackEntries.toReversed()) {
			const activeRegistrations = activePluginHookRegistrations.get(entry.name) ?? [];
			for (const registration of activeRegistrations) unregisterInternalHook(registration.event, registration.handler);
			if (entry.previousRegistrations.length === 0) {
				activePluginHookRegistrations.delete(entry.name);
				continue;
			}
			for (const registration of entry.previousRegistrations) registerInternalHook(registration.event, registration.handler);
			activePluginHookRegistrations.set(entry.name, [...entry.previousRegistrations]);
		}
		pluginHookRollback.delete(pluginId);
	};
	return {
		registry,
		createApi,
		rollbackPluginGlobalSideEffects,
		pushDiagnostic,
		registerTool,
		registerChannel,
		registerHostedMediaResolver,
		registerProvider,
		registerModelCatalogProvider,
		registerAgentHarness: registerAgentHarness$1,
		registerCliBackend,
		registerTextTransforms,
		registerEmbeddingProvider: registerEmbeddingProviderForPlugin,
		registerSpeechProvider,
		registerRealtimeTranscriptionProvider,
		registerRealtimeVoiceProvider,
		registerMediaUnderstandingProvider,
		registerTranscriptSourceProvider,
		registerImageGenerationProvider,
		registerVideoGenerationProvider,
		registerMusicGenerationProvider,
		registerWebSearchProvider,
		registerMigrationProvider,
		registerGatewayMethod,
		registerCli,
		registerReload,
		registerNodeHostCommand,
		registerSecurityAuditCollector,
		registerService,
		registerCommand,
		registerSessionExtension,
		registerTrustedToolPolicy,
		registerToolMetadata,
		registerControlUiDescriptor,
		registerRuntimeLifecycle,
		registerAgentEventSubscription,
		registerSessionSchedulerJob,
		registerSessionAction,
		registerHook,
		registerTypedHook
	};
}
//#endregion
export { clearEmbeddingProviders as A, clearMemoryEmbeddingProviders as C, listRegisteredMemoryEmbeddingProviders as D, listMemoryEmbeddingProviders as E, getCompactionProvider as F, listRegisteredCompactionProviders as I, restoreRegisteredCompactionProviders as L, listRegisteredEmbeddingProviders as M, restoreRegisteredEmbeddingProviders as N, registerMemoryEmbeddingProvider as O, clearCompactionProviders as P, toCodeModeJsonSafe as S, getRegisteredMemoryEmbeddingProvider as T, projectPluginSessionExtensionsSync as _, providerMatchesId as a, createCodeModeNamespaceRuntime as b, resolveVoiceModelRefs as c, listMediaGenerationProviderModels as d, synthesizeMediaGenerationCatalogEntries as f, patchPluginSessionExtension as g, getPluginSessionExtensionStateSync as h, getVoiceProviderConfig as i, getRegisteredEmbeddingProvider as j, restoreRegisteredMemoryEmbeddingProviders as k, resolveVoiceProviderCandidates as l, drainPluginNextTurnInjectionContext as m, projectProviderCatalogResultToUnifiedTextRows as n, resolvePrimaryVoiceProviderCandidate as o, normalizeOptionalString as p, copyProviderCatalogResultProjection as r, resolveSupportedVoiceModelRefs as s, createPluginRegistry as t, voiceProviderSupportsModel as u, listCodexAppServerExtensionFactories as v, getMemoryEmbeddingProvider as w, describeCodeModeNamespacesForPrompt as x, createCodeModeApiVirtualFiles as y };
