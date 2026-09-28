import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { n as containsAuthoredInclude } from "./include-migration-ownership-D1fnTYxB.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { F as hasModelPolicyAllowlistMigrationMarker, I as materializeModelPolicyAllowlist, N as computeModelPolicyAllowlist } from "./agent-scope-config-IQKOEtZ4.mjs";
import { r as normalizeConfiguredProviderCatalogModelId } from "./provider-model-id-normalization-CO2R6uEC.mjs";
import { n as ensureRecord, r as getRecord, t as defineLegacyConfigMigration } from "./legacy.shared-DAhNAggz.mjs";
import { r as isModelThinkingFormat } from "./model-config-vocabulary-CIfiDXNP.mjs";
import "./types.models-ZwQV51CR.mjs";
import { n as materializeUtilityModelSeparation } from "./utility-model-separation-migration-CoAPHAUL.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-DKxKaZGG.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { i as migrateModelCompatCatalogOwnership, n as hasInvalidThinkingFormat, o as resolveStaleContextWindowFix, r as hasStaleContextWindowValue, t as MODEL_COMPAT_CATALOG_RULES } from "./legacy-config-migrations.runtime.models.catalog-C9fiKqXE.mjs";
import { S as isLegacyCodexProviderId, l as legacyCodexProviderIdentityKey } from "./codex-route-model-ref-CXtvdgWA.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor/shared/legacy-config-record-shared.ts
/** Visit mutable agent entries before or after read-time roster normalization. */
function visitAgentEntries(raw, visitor) {
	const agents = isRecord(raw.agents) ? raw.agents : void 0;
	if (isRecord(agents?.entries)) {
		for (const [agentId, entry] of Object.entries(agents.entries)) if (!isBlockedObjectKey(agentId) && isRecord(entry)) visitor(entry, `agents.entries.${agentId}`);
		return;
	}
	if (Array.isArray(agents?.list)) agents.list.forEach((entry, index) => {
		if (isRecord(entry) && !(typeof entry.id === "string" && isBlockedObjectKey(entry.id))) visitor(entry, `agents.list[${index}]`);
	});
}
/** Visit agent defaults and authored entries without copying their mutable fields. */
function visitAgentConfigScopes(raw, visitor) {
	const agents = isRecord(raw.agents) ? raw.agents : void 0;
	if (isRecord(agents?.defaults)) visitor(agents.defaults, "agents.defaults");
	visitAgentEntries(raw, visitor);
}
/** Clone a record-like config section, treating undefined as an empty object. */
function cloneRecord(value) {
	return { ...value };
}
/** Own-property guard used by migrations that must preserve falsy values. */
function hasOwnKey(target, key) {
	return Object.hasOwn(target, key);
}
/** Delete a nested retired config path, with `*` matching record entries. */
function deleteRetiredPath(owner, path, removed, prefix = "") {
	const [key, ...rest] = path;
	if (!isRecord(owner) || !key) return false;
	if (key === "*") {
		let changed = false;
		for (const [entry, value] of Object.entries(owner)) changed = deleteRetiredPath(value, rest, removed, `${prefix}${entry}.`) || changed;
		return changed;
	}
	if (rest.length === 0) {
		if (!Object.hasOwn(owner, key)) return false;
		delete owner[key];
		removed?.push(`${prefix}${key}`);
		return true;
	}
	const child = owner[key];
	if (!isRecord(child) || !deleteRetiredPath(child, rest, removed, `${prefix}${key}.`)) return false;
	if (Object.keys(child).length === 0) delete owner[key];
	return true;
}
/** Visit a channel root followed by its object-shaped accounts in config order. */
function visitChannelEntries(raw, channelId, visitor) {
	const channels = raw.channels;
	if (!isRecord(channels)) return;
	const channel = channels[channelId];
	if (!isRecord(channel)) return;
	visitor(channel, `channels.${channelId}`);
	if (!isRecord(channel.accounts)) return;
	for (const [accountId, account] of Object.entries(channel.accounts)) if (isRecord(account)) visitor(account, `channels.${channelId}.accounts.${accountId}`);
}
//#endregion
//#region src/commands/doctor/shared/legacy-runtime-model-policy.ts
function collectLegacyDefaultModelAllowRefs(raw) {
	const defaults = getRecord(getRecord(raw.agents)?.defaults);
	return computeModelPolicyAllowlist({
		root: raw,
		defaults
	});
}
function migrateExplicitDefaultModelAllowPolicy(raw, changes) {
	if (hasModelPolicyAllowlistMigrationMarker(raw)) return;
	const defaults = getRecord(getRecord(raw.agents)?.defaults);
	const defaultModelPolicy = getRecord(defaults?.modelPolicy);
	if (!(Boolean(getRecord(defaults?.models)) && !(defaultModelPolicy && Object.hasOwn(defaultModelPolicy, "allow")))) return;
	const migrated = materializeModelPolicyAllowlist(raw);
	if (migrated.kind === "deferred") return;
	Object.assign(raw, migrated.config);
	changes.push(migrated.config.agents?.defaults?.modelPolicy?.allow ? "Copied the legacy default model map to agents.defaults.modelPolicy.allow." : "Recorded the legacy default model map as unrestricted without creating modelPolicy.allow.");
}
/** Select canonical refs owned by a provider, preserving config order and duplicates. */
function selectedCanonicalModelRefsForRuntimePolicy(rawModel, provider) {
	const refs = [];
	const addRef = (rawRef) => {
		if (typeof rawRef !== "string") return;
		const ref = rawRef.trim();
		const slash = ref.indexOf("/");
		if (slash <= 0 || slash >= ref.length - 1 || normalizeProviderId(ref.slice(0, slash)) !== normalizeProviderId(provider)) return;
		refs.push(ref);
	};
	if (typeof rawModel === "string") {
		addRef(rawModel);
		return refs;
	}
	if (!isRecord(rawModel)) return refs;
	addRef(rawModel.primary);
	if (Array.isArray(rawModel.fallbacks)) for (const fallback of rawModel.fallbacks) addRef(fallback);
	return refs;
}
/** Add runtime policy unless the model entry already selects an explicit non-auto runtime. */
function modelEntryWithRuntimePolicy(entry, runtime) {
	const next = isRecord(entry) ? { ...entry } : {};
	const currentRuntime = isRecord(next.agentRuntime) ? next.agentRuntime : void 0;
	const currentRuntimeId = normalizeOptionalLowercaseString(currentRuntime?.id);
	if (currentRuntimeId && currentRuntimeId !== "auto") return {
		changed: false,
		entry: next
	};
	next.agentRuntime = {
		...currentRuntime,
		id: runtime
	};
	return {
		changed: true,
		entry: next
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-model-ref-normalization.ts
function preferredClaudeSeparator(provider) {
	return provider === "github-copilot" || provider === "copilot-proxy" ? "." : "-";
}
function claudeTargetModelId(family, separator, provider) {
	const version = family === "opus" && provider !== "venice" && provider !== "vercel-ai-gateway" ? "4.7" : "4.6";
	return `claude-${family}-${separator === "." ? version : version.replace(".", "-")}`;
}
function shouldUpgradeClaudeProvider(provider) {
	return !provider || provider === "anthropic" || provider === "github-copilot" || provider === "copilot-proxy" || provider === "venice" || provider === "vercel-ai-gateway";
}
function modelTable(groups) {
	return Object.fromEntries(Object.entries(groups).flatMap(([target, models]) => models.split(" ").map((model) => [model, target])));
}
const RETIRED_GROQ_MODELS = modelTable({
	"llama-3.3-70b-versatile": "deepseek-r1-distill-llama-70b llama3-70b-8192",
	"llama-3.1-8b-instant": "gemma2-9b-it llama3-8b-8192",
	"openai/gpt-oss-120b": "meta-llama/llama-4-maverick-17b-128e-instruct moonshotai/kimi-k2-instruct moonshotai/kimi-k2-instruct-0905",
	"qwen/qwen3-32b": "mistral-saba-24b qwen-qwq-32b"
});
const RETIRED_XAI_MODELS = modelTable({
	"grok-build-0.1": "grok-code-fast grok-code-fast-1 grok-code-fast-1-0825",
	"grok-4.3": "grok-4-fast-reasoning grok-4-1-fast-reasoning grok-4-0709",
	"grok-imagine-image-quality": "grok-imagine-image-pro"
});
const RETIRED_OPENAI_MODELS = modelTable({
	"gpt-5.3-codex": "gpt-5.2-codex gpt-5.1-codex gpt-5-codex",
	"gpt-5.5-pro": "gpt-5-pro gpt-5.2-pro",
	"gpt-5.4-nano": "gpt-4.1-nano gpt-5-nano",
	"gpt-5.4-mini": "gpt-4.1-mini gpt-4o-mini gpt-5.1-codex-mini gpt-5-mini",
	"gpt-5.5": "gpt-4 gpt-4-turbo gpt-4.1 gpt-4o gpt-4o-2024-05-13 gpt-4o-2024-08-06 gpt-4o-2024-11-20 gpt-5 gpt-5-chat-latest gpt-5.1 gpt-5.1-chat-latest gpt-5.1-codex-max gpt-5.2 gpt-5.2-chat-latest"
});
const RETIRED_CODEX_MODEL_OVERRIDES = modelTable({
	"gpt-5.5": "gpt-5.2 gpt-5.2-codex gpt-5.1-codex gpt-5-codex",
	"gpt-5.4-mini": "gpt-4.1-nano gpt-5-nano"
});
function applyRetiredModelTable(normalizedModel, table, overrides) {
	if (overrides && Object.hasOwn(overrides, normalizedModel)) return overrides[normalizedModel] ?? null;
	return Object.hasOwn(table, normalizedModel) ? table[normalizedModel] ?? null : null;
}
function hasRetiredVersionPrefix(normalized, prefix) {
	if (normalized === prefix) return true;
	if (!normalized.startsWith(prefix)) return false;
	const next = normalized[prefix.length];
	return next === "-" || next === "." || next === ":" || next === "@";
}
function hasAnyRetiredVersionPrefix(normalized, prefixes) {
	return prefixes.some((prefix) => hasRetiredVersionPrefix(normalized, prefix));
}
const RETIRED_OPUS_ALIASES = new Set("opus-4.5 opus-4.1 opus-4 opus-3".split(" "));
const RETIRED_SONNET_ALIASES = new Set("sonnet-4.5 sonnet-4.1 sonnet-4.0 sonnet-4 sonnet-3.7 sonnet-3.5 sonnet-3 haiku-3.5 haiku-3".split(" "));
function upgradeOldClaudeToken(token, separator, provider) {
	const normalized = normalizeLowercaseStringOrEmpty(token);
	if (!normalized) return null;
	const opusTarget = claudeTargetModelId("opus", separator, provider);
	const sonnetTarget = claudeTargetModelId("sonnet", separator, provider);
	if (normalized.startsWith("claude-opus-4-7") || normalized.startsWith("claude-opus-4.7") || normalized.startsWith("claude-opus-4-6") || normalized.startsWith("claude-opus-4.6") || normalized.startsWith("claude-sonnet-4-6") || normalized.startsWith("claude-sonnet-4.6")) return null;
	if (normalized.startsWith("claude-haiku-4-5") || normalized.startsWith("claude-haiku-4.5")) return null;
	if (normalized === "claude-opus-4" || hasAnyRetiredVersionPrefix(normalized, [
		"claude-opus-4-5",
		"claude-opus-4.5",
		"claude-opus-4-1",
		"claude-opus-4.1",
		"claude-opus-4-0",
		"claude-opus-4.0"
	]) || /^claude-opus-4-20\d{6}/.test(normalized)) return opusTarget;
	if (normalized === "claude-sonnet-4" || hasAnyRetiredVersionPrefix(normalized, [
		"claude-sonnet-4-5",
		"claude-sonnet-4.5",
		"claude-sonnet-4-1",
		"claude-sonnet-4.1",
		"claude-sonnet-4-0",
		"claude-sonnet-4.0"
	]) || /^claude-sonnet-4-20\d{6}/.test(normalized)) return sonnetTarget;
	if (normalized.startsWith("claude-3") && normalized.includes("opus")) return opusTarget;
	if (normalized.startsWith("claude-3") && (normalized.includes("sonnet") || normalized.includes("haiku"))) return sonnetTarget;
	if (normalized.startsWith("anthropic.claude-opus-")) {
		if (provider === "amazon-bedrock" || provider === "amazon-bedrock-mantle") return null;
		if (normalized.startsWith("anthropic.claude-opus-4-7") || normalized.startsWith("anthropic.claude-opus-4-6")) return null;
		return `anthropic.${claudeTargetModelId("opus", "-", provider)}`;
	}
	if (normalized.startsWith("anthropic.claude-sonnet-") || normalized.startsWith("anthropic.claude-haiku-")) {
		if (provider === "amazon-bedrock" || provider === "amazon-bedrock-mantle") return null;
		if (normalized.startsWith("anthropic.claude-sonnet-4-6")) return null;
		return `anthropic.${claudeTargetModelId("sonnet", "-", provider)}`;
	}
	if (RETIRED_OPUS_ALIASES.has(normalized)) return opusTarget;
	if (RETIRED_SONNET_ALIASES.has(normalized)) return sonnetTarget;
	return null;
}
function upgradeOldClaudeModelPart(model, provider) {
	const separator = preferredClaudeSeparator(provider);
	const slashParts = model.split("/");
	const lastPart = slashParts.at(-1);
	if (lastPart) {
		const upgraded = upgradeOldClaudeToken(lastPart, separator, provider);
		if (upgraded) return [...slashParts.slice(0, -1), upgraded].join("/");
	}
	return upgradeOldClaudeToken(model, separator, provider);
}
function canonicalizeKnownModelRef(value) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const split = splitTrailingAuthProfile(trimmed);
	const modelRef = split.model;
	const slash = modelRef.indexOf("/");
	const provider = slash > 0 ? modelRef.slice(0, slash).trim() : void 0;
	const model = slash > 0 ? modelRef.slice(slash + 1).trim() : modelRef;
	const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
	const normalizedModel = normalizeLowercaseStringOrEmpty(model);
	if (normalizedProvider === "openai" && normalizedModel === "gpt-5.6") return `${provider}/gpt-5.6-sol${split.profile ? `@${split.profile}` : ""}`;
	const retiredOwnerModel = normalizedProvider === "groq" ? applyRetiredModelTable(normalizedModel, RETIRED_GROQ_MODELS) : normalizedProvider === "xai" ? applyRetiredModelTable(normalizedModel, RETIRED_XAI_MODELS) : normalizedProvider === "openai" || normalizedProvider === "openai-codex" || normalizedProvider === "github-copilot" ? applyRetiredModelTable(normalizedModel, RETIRED_OPENAI_MODELS, normalizedProvider === "openai-codex" ? RETIRED_CODEX_MODEL_OVERRIDES : void 0) : void 0;
	if (retiredOwnerModel) return `${provider}/${retiredOwnerModel}${split.profile ? `@${split.profile}` : ""}`;
	if ((normalizedProvider === "github-copilot" || normalizedProvider === "copilot-proxy") && normalizedModel === "grok-code-fast-1") return `${provider}/gpt-5.4-mini${split.profile ? `@${split.profile}` : ""}`;
	if (!shouldUpgradeClaudeProvider(normalizedProvider || void 0)) return null;
	const upgradedModel = upgradeOldClaudeModelPart(model, normalizedProvider || void 0);
	if (!upgradedModel || upgradedModel === model) return null;
	return `${provider ? `${provider}/${upgradedModel}` : upgradedModel}${split.profile ? `@${split.profile}` : ""}`;
}
function normalizeKnownModelRef(value) {
	const trimmed = value.trim();
	if (!trimmed) return value === trimmed ? null : trimmed;
	const split = splitTrailingAuthProfile(trimmed);
	const slash = split.model.indexOf("/");
	const provider = slash > 0 ? normalizeLowercaseStringOrEmpty(split.model.slice(0, slash)) : "";
	const modelId = slash > 0 ? split.model.slice(slash + 1) : split.model;
	const normalized = `${provider === "google" || provider === "google-gemini-cli" || provider === "google-vertex" || provider === "together" || normalizeLowercaseStringOrEmpty(modelId).startsWith("google/") ? normalizeAgentModelRefForConfig(split.model) : split.model}${split.profile ? `@${split.profile}` : ""}`;
	return canonicalizeKnownModelRef(normalized) ?? (normalized === value ? null : normalized);
}
function normalizeProviderCatalogModelId(provider, modelId) {
	const trimmed = modelId.trim();
	const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
	const normalized = normalizedProvider === "google" || normalizedProvider === "google-gemini-cli" || normalizedProvider === "google-vertex" || normalizedProvider === "together" || normalizeLowercaseStringOrEmpty(trimmed).startsWith("google/") ? normalizeConfiguredProviderCatalogModelId(provider, trimmed) : trimmed;
	const upgradedRef = canonicalizeKnownModelRef(`${provider}/${normalized}`);
	if (!upgradedRef) return normalized;
	const slash = upgradedRef.indexOf("/");
	return slash > 0 && normalizeLowercaseStringOrEmpty(upgradedRef.slice(0, slash)) === normalizeLowercaseStringOrEmpty(provider) ? upgradedRef.slice(slash + 1) : normalized;
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.models.refs.ts
function hasOwnDefinedProperty(record, key) {
	return Object.hasOwn(record, key) && record[key] !== void 0;
}
const MODEL_REF_STRING_KEYS = /* @__PURE__ */ new Set([
	"model",
	"primary",
	"summaryModel",
	"imageModel",
	"utilityModel",
	"voiceModel",
	"imageGenerationModel",
	"musicGenerationModel",
	"pdfModel",
	"videoGenerationModel",
	"preferredModel"
]);
const MODEL_REF_ARRAY_KEYS = /* @__PURE__ */ new Set([
	"fallback",
	"fallbacks",
	"allowedModels",
	"modelFallbacks",
	"imageModelFallbacks"
]);
const MODEL_REF_MAP_KEYS = /* @__PURE__ */ new Set(["models"]);
function pathKey(path) {
	return path.slice(path.lastIndexOf(".") + 1);
}
function isChannelModelOverridePath(path) {
	return path.includes(".modelByChannel.");
}
function isModelPolicyAllowPath(path) {
	return path.endsWith(".modelPolicy.allow");
}
function isMediaModelPath(path) {
	return [
		"image",
		"video",
		"music"
	].includes(pathKey(path)) && path.includes(".mediaModels.");
}
function isProviderCatalogsPath(path) {
	return path === ".providers" || path.endsWith(".models.providers");
}
function scanProviderCatalogModelIds(providers) {
	return Object.entries(providers).some(([providerId, providerValue]) => {
		const models = getRecord(providerValue)?.models;
		return Array.isArray(models) && models.some((model) => {
			const modelId = getRecord(model)?.id;
			return typeof modelId === "string" && normalizeProviderCatalogModelId(providerId, modelId) !== modelId;
		});
	});
}
function scanKnownModelRefs(value, key, path = "") {
	if (typeof value === "string") return Boolean(key && (MODEL_REF_STRING_KEYS.has(key) || isChannelModelOverridePath(path) || isMediaModelPath(path)) && normalizeKnownModelRef(value));
	if (Array.isArray(value)) return value.some((entry, index) => typeof entry === "string" && key && (MODEL_REF_ARRAY_KEYS.has(key) || isModelPolicyAllowPath(path)) ? Boolean(normalizeKnownModelRef(entry)) : scanKnownModelRefs(entry, void 0, `${path}.${index}`));
	const record = getRecord(value);
	if (!record) return false;
	const provider = typeof record.provider === "string" ? record.provider : void 0;
	const model = typeof record.model === "string" ? record.model : void 0;
	const providerModelPair = provider !== void 0 && model !== void 0;
	if (providerModelPair && normalizeKnownModelRef(`${provider}/${model}`)) return true;
	if (isProviderCatalogsPath(path) && scanProviderCatalogModelIds(record)) return true;
	if (key && MODEL_REF_MAP_KEYS.has(key)) return Object.keys(record).some((entryKey) => Boolean(normalizeKnownModelRef(entryKey)));
	return Object.entries(record).some(([childKey, child]) => !(providerModelPair && childKey === "model") && scanKnownModelRefs(child, childKey, `${path}.${childKey}`));
}
function rewriteModelRefString(value, path, changes, normalize) {
	const upgraded = normalize(value);
	if (upgraded === null || upgraded === value) return value;
	changes.push(`Upgraded ${path} from ${JSON.stringify(value)} to ${JSON.stringify(upgraded)}.`);
	return upgraded;
}
function setRecordEntry(record, key, value) {
	Object.defineProperty(record, key, {
		configurable: true,
		enumerable: true,
		value,
		writable: true
	});
}
function sanitizeModelRefMapEntry(value) {
	if (Array.isArray(value)) return value.map(sanitizeModelRefMapEntry);
	const record = getRecord(value);
	if (!record) return value;
	const sanitized = {};
	for (const [field, child] of Object.entries(record)) if (!isBlockedObjectKey(field)) setRecordEntry(sanitized, field, sanitizeModelRefMapEntry(child));
	return sanitized;
}
function modelRefValuesAreEqual(existing, incoming, path, normalize) {
	if (isDeepStrictEqual(existing, incoming)) return true;
	const normalizedExisting = rewriteModelRefs(existing, path, [], normalize).value;
	const normalizedIncoming = rewriteModelRefs(incoming, path, [], normalize).value;
	return isDeepStrictEqual(normalizedExisting, normalizedIncoming);
}
function mergeModelRefMapEntries(existing, incoming, path, normalize = normalizeKnownModelRef) {
	const existingRecord = getRecord(existing);
	const incomingRecord = getRecord(incoming);
	if (!existingRecord || !incomingRecord) return {
		value: sanitizeModelRefMapEntry(existing),
		conflicts: modelRefValuesAreEqual(existing, incoming, path, normalize) ? [] : ["value"]
	};
	const merged = sanitizeModelRefMapEntry(existingRecord);
	const conflicts = [];
	for (const [field, incomingValue] of Object.entries(incomingRecord)) {
		if (incomingValue === void 0 || isBlockedObjectKey(field)) continue;
		if (!hasOwnDefinedProperty(existingRecord, field)) {
			setRecordEntry(merged, field, sanitizeModelRefMapEntry(incomingValue));
			continue;
		}
		const existingValue = existingRecord[field];
		const fieldPath = `${path}.${field}`;
		if (modelRefValuesAreEqual(existingValue, incomingValue, fieldPath, normalize)) continue;
		const existingField = getRecord(existingValue);
		const incomingField = getRecord(incomingValue);
		if (existingField && incomingField) {
			const nested = mergeModelRefMapEntries(existingField, incomingField, fieldPath, normalize);
			setRecordEntry(merged, field, nested.value);
			conflicts.push(...nested.conflicts.map((c) => `${field}.${c}`));
			continue;
		}
		conflicts.push(field);
	}
	return {
		value: merged,
		conflicts
	};
}
function rewriteModelRefMapKeys(record, path, changes, normalize) {
	let changed = false;
	const next = {};
	const consumedCanonicalKeys = /* @__PURE__ */ new Set();
	for (const [key, child] of Object.entries(record)) {
		const upgradedKey = normalize(key);
		const nextKey = upgradedKey ?? key;
		if (!upgradedKey && consumedCanonicalKeys.has(key)) continue;
		if (upgradedKey) {
			changes.push(`Upgraded ${path} key from ${JSON.stringify(key)} to ${JSON.stringify(upgradedKey)}.`);
			changed = true;
		}
		if (upgradedKey && !Object.hasOwn(next, nextKey) && Object.hasOwn(record, nextKey)) {
			setRecordEntry(next, nextKey, record[nextKey]);
			consumedCanonicalKeys.add(nextKey);
		}
		if (Object.hasOwn(next, nextKey)) {
			const existing = next[nextKey];
			const { value, conflicts } = mergeModelRefMapEntries(existing, child, `${path}.${nextKey}`, normalize);
			setRecordEntry(next, nextKey, value);
			const sortedConflicts = conflicts.toSorted();
			if (sortedConflicts.length > 0) changes.push(`Merged ${path} key ${JSON.stringify(key)} into ${JSON.stringify(nextKey)}; kept existing values for conflicting fields: ${sortedConflicts.join(", ")}.`);
			else changes.push(`Merged ${path} key ${JSON.stringify(key)} into ${JSON.stringify(nextKey)}.`);
			continue;
		}
		setRecordEntry(next, nextKey, child);
	}
	return {
		value: changed ? next : record,
		changed
	};
}
function rewriteProviderCatalogModelIds(providers, path, changes) {
	let changed = false;
	const next = { ...providers };
	for (const [providerId, providerValue] of Object.entries(providers)) {
		const provider = getRecord(providerValue);
		if (!provider || !Array.isArray(provider.models)) continue;
		const rows = provider.models.map((model, index) => {
			const modelRecord = getRecord(model);
			if (!modelRecord || typeof modelRecord.id !== "string") return {
				index,
				model
			};
			const normalizedId = normalizeProviderCatalogModelId(providerId, modelRecord.id);
			return {
				index,
				model,
				modelRecord,
				originalId: modelRecord.id,
				normalizedId,
				changed: normalizedId !== modelRecord.id
			};
		});
		if (!rows.some((row) => row.changed)) continue;
		const rowsById = /* @__PURE__ */ new Map();
		for (const row of rows) {
			if (row.normalizedId === void 0) continue;
			const grouped = rowsById.get(row.normalizedId) ?? [];
			grouped.push(row);
			rowsById.set(row.normalizedId, grouped);
		}
		const emittedIds = /* @__PURE__ */ new Set();
		const models = [];
		for (const row of rows) {
			if (row.normalizedId === void 0 || row.modelRecord === void 0) {
				models.push(row.model);
				continue;
			}
			const grouped = rowsById.get(row.normalizedId) ?? [row];
			if (!grouped.some((candidate) => candidate.changed)) {
				models.push(row.model);
				continue;
			}
			if (emittedIds.has(row.normalizedId)) continue;
			emittedIds.add(row.normalizedId);
			const preferred = grouped.find((candidate) => candidate.originalId === candidate.normalizedId) ?? grouped[0];
			const preferredRecord = preferred?.modelRecord;
			if (!preferred || !preferredRecord) {
				models.push(row.model);
				continue;
			}
			let merged = {
				...preferredRecord,
				id: row.normalizedId
			};
			for (const candidate of grouped) {
				if (candidate === preferred || !candidate.modelRecord) continue;
				const result = mergeModelRefMapEntries(merged, {
					...candidate.modelRecord,
					id: row.normalizedId
				}, `${path}.${providerId}.models.${preferred.index}`);
				merged = getRecord(result.value) ?? merged;
				changes.push(result.conflicts.length > 0 ? `Merged ${path}.${providerId}.models.${candidate.index} into model id ${JSON.stringify(row.normalizedId)}; kept canonical values for conflicting fields: ${result.conflicts.toSorted().join(", ")}.` : `Merged ${path}.${providerId}.models.${candidate.index} into model id ${JSON.stringify(row.normalizedId)}.`);
			}
			for (const candidate of grouped) {
				if (!candidate.changed) continue;
				changes.push(`Upgraded ${path}.${providerId}.models.${candidate.index}.id from ${JSON.stringify(candidate.originalId)} to ${JSON.stringify(candidate.normalizedId)}.`);
			}
			models.push(merged);
		}
		next[providerId] = {
			...provider,
			models
		};
		changed = true;
	}
	return {
		value: changed ? next : providers,
		changed
	};
}
function rewriteModelRefs(value, path, changes, normalize) {
	const key = pathKey(path);
	if (typeof value === "string") {
		if (!MODEL_REF_STRING_KEYS.has(key) && !isChannelModelOverridePath(path) && !isMediaModelPath(path)) return {
			value,
			changed: false
		};
		const next = rewriteModelRefString(value, path, changes, normalize);
		return {
			value: next,
			changed: next !== value
		};
	}
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((entry, index) => {
			if (typeof entry === "string" && (MODEL_REF_ARRAY_KEYS.has(key) || isModelPolicyAllowPath(path))) {
				const rewritten = rewriteModelRefString(entry, `${path}.${index}`, changes, normalize);
				changed ||= rewritten !== entry;
				return rewritten;
			}
			const rewritten = rewriteModelRefs(entry, `${path}.${index}`, changes, normalize);
			changed ||= rewritten.changed;
			return rewritten.value;
		});
		return {
			value: changed ? next : value,
			changed
		};
	}
	const record = getRecord(value);
	if (!record) return {
		value,
		changed: false
	};
	let working = record;
	let changed = false;
	const provider = typeof record.provider === "string" ? record.provider : void 0;
	const model = typeof record.model === "string" ? record.model : void 0;
	const providerModelPair = provider !== void 0 && model !== void 0;
	if (provider?.trim() && model !== void 0) {
		const ref = `${provider}/${model}`;
		const rewritten = normalize(ref);
		if (rewritten && rewritten !== ref) {
			const slash = rewritten.indexOf("/");
			working = {
				...record,
				provider: rewritten.slice(0, slash),
				model: rewritten.slice(slash + 1)
			};
			changes.push(`Upgraded ${path} provider/model from ${JSON.stringify(ref)} to ${JSON.stringify(rewritten)}.`);
			changed = true;
		}
	}
	if (normalize === normalizeKnownModelRef && isProviderCatalogsPath(path)) {
		const rewrittenCatalogs = rewriteProviderCatalogModelIds(working, path, changes);
		working = rewrittenCatalogs.value;
		changed ||= rewrittenCatalogs.changed;
	}
	if (MODEL_REF_MAP_KEYS.has(key)) {
		const rewrittenKeys = rewriteModelRefMapKeys(working, path, changes, normalize);
		working = rewrittenKeys.value;
		changed ||= rewrittenKeys.changed;
	}
	const next = {};
	for (const [childKey, child] of Object.entries(working)) {
		const rewritten = providerModelPair && childKey === "model" ? {
			value: child,
			changed: false
		} : rewriteModelRefs(child, `${path}.${childKey}`, changes, normalize);
		changed ||= rewritten.changed;
		setRecordEntry(next, childKey, rewritten.value);
	}
	return {
		value: changed ? next : value,
		changed
	};
}
const MODEL_REF_CANONICALIZATION_MESSAGE = "Configured retired or noncanonical model refs are no longer in the bundled catalogs; run \"openclaw doctor --fix\" to upgrade them.";
function rewriteKnownModelRefs(value, path, changes) {
	return rewriteModelRefs(value, path, changes, normalizeKnownModelRef);
}
//#endregion
//#region src/commands/doctor/shared/legacy-models-add-metadata.ts
const LEGACY_MODELS_ADD_CODEX_MODEL_IDS = /* @__PURE__ */ new Set(["gpt-5.5", "gpt-5.5-pro"]);
const LEGACY_MODELS_ADD_CODEX_APIS = /* @__PURE__ */ new Set(["openai-codex-responses", "openai-chatgpt-responses"]);
/** Return true when a model entry matches the legacy Codex `/models add` default shape. */
function isLegacyModelsAddCodexMetadataModel(params) {
	const model = params.model;
	const provider = normalizeProviderId(params.provider);
	if (provider !== "codex" && provider !== "openai-codex" || !model) return false;
	const id = model.id?.trim().toLowerCase();
	if (!id || !LEGACY_MODELS_ADD_CODEX_MODEL_IDS.has(id)) return false;
	return typeof model.api === "string" && LEGACY_MODELS_ADD_CODEX_APIS.has(model.api) && model.reasoning === true && Array.isArray(model.input) && model.input.length === 2 && model.input[0] === "text" && model.input[1] === "image" && model.cost?.input === 5 && model.cost.output === 30 && model.cost.cacheRead === .5 && model.cost.cacheWrite === 0 && model.contextWindow === 4e5 && model.contextTokens === 272e3 && model.maxTokens === 128e3;
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.models.codex.ts
const LEGACY_OPENAI_CODEX_RESPONSES_API = "openai-codex-responses";
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CHATGPT_RESPONSES_API = "openai-chatgpt-responses";
const MODEL_UNSCOPED_PROVIDER_DEFAULT_KEYS = [
	"apiKey",
	"auth",
	"request",
	"timeoutSeconds",
	"region",
	"injectNumCtxForOpenAICompat",
	"localService",
	"headers",
	"authHeader"
];
const CANONICAL_PROVIDER_MODEL_LEAK_KEYS = [
	"apiKey",
	"auth",
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
function hasCanonicalOpenAIProvider(providers) {
	return Object.keys(providers).some((providerId) => normalizeProviderId(providerId) === OPENAI_PROVIDER_ID);
}
function normalizeLegacyOpenAIResponsesApi(providerId, provider, changes) {
	let changed = false;
	const next = { ...provider };
	if (next.api === "openai-codex-responses") {
		next.api = OPENAI_CHATGPT_RESPONSES_API;
		changes.push(`Moved models.providers.${providerId}.api "${LEGACY_OPENAI_CODEX_RESPONSES_API}" → "${OPENAI_CHATGPT_RESPONSES_API}".`);
		changed = true;
	}
	if (Array.isArray(provider.models)) {
		let modelsChanged = false;
		const nextModels = provider.models.map((model, index) => {
			const modelRecord = getRecord(model);
			if (!modelRecord || modelRecord.api !== "openai-codex-responses") return model;
			modelsChanged = true;
			changes.push(`Moved models.providers.${providerId}.models[${index}].api "${LEGACY_OPENAI_CODEX_RESPONSES_API}" → "${OPENAI_CHATGPT_RESPONSES_API}".`);
			return {
				...modelRecord,
				api: OPENAI_CHATGPT_RESPONSES_API
			};
		});
		if (modelsChanged) {
			next.models = nextModels;
			changed = true;
		}
	}
	return {
		value: next,
		changed
	};
}
function collectModelMergeBlockers(params) {
	const blockers = [];
	for (const key of MODEL_UNSCOPED_PROVIDER_DEFAULT_KEYS) if (hasOwnDefinedProperty(params.legacy, key)) blockers.push(`models.providers.${params.legacyProviderId}.${key}`);
	for (const key of CANONICAL_PROVIDER_MODEL_LEAK_KEYS) if (hasOwnDefinedProperty(params.canonical, key)) blockers.push(`models.providers.${OPENAI_PROVIDER_ID}.${key}`);
	return blockers;
}
function getCanonicalOpenAIProviderEntry(providers) {
	const key = Object.keys(providers).find((k) => normalizeProviderId(k) === OPENAI_PROVIDER_ID);
	const value = key ? getRecord(providers[key]) : void 0;
	return key && value ? {
		key,
		value
	} : void 0;
}
function getMergeableLegacyOpenAIModels(params) {
	const legacyModels = Array.isArray(params.legacy.models) ? params.legacy.models : [];
	const canonicalModels = Array.isArray(params.canonical.models) ? params.canonical.models : [];
	const canonicalModelIds = /* @__PURE__ */ new Set();
	const canonicalModelNames = /* @__PURE__ */ new Set();
	for (const m of canonicalModels) {
		const mr = getRecord(m);
		if (typeof mr?.id === "string" && mr.id) canonicalModelIds.add(mr.id);
		if (typeof mr?.name === "string" && mr.name) canonicalModelNames.add(mr.name);
	}
	return legacyModels.filter((m) => {
		const mr = getRecord(m);
		if (!mr) return false;
		const id = typeof mr.id === "string" ? mr.id : void 0;
		const name = typeof mr.name === "string" ? mr.name : void 0;
		if (!id && !name) return false;
		return id ? !canonicalModelIds.has(id) : name ? !canonicalModelNames.has(name) : false;
	});
}
function collectLegacyModelPolicyWildcardPaths(raw) {
	const pathsByProvider = /* @__PURE__ */ new Map();
	visitAgentConfigScopes(getRecord(raw) ?? {}, (agent, path) => {
		const allow = getRecord(agent.modelPolicy)?.allow;
		if (!Array.isArray(allow)) return;
		for (const [index, entry] of allow.entries()) {
			if (typeof entry !== "string" || !entry.trim().endsWith("/*")) continue;
			const provider = normalizeProviderId(entry.trim().slice(0, -2));
			if (!isLegacyCodexProviderId(provider)) continue;
			const paths = pathsByProvider.get(provider) ?? [];
			paths.push(`${path}.modelPolicy.allow.${index}`);
			pathsByProvider.set(provider, paths);
		}
	});
	return pathsByProvider;
}
function hasAutoFixableLegacyOpenAICodexProvider(providersValue, root) {
	const providers = getRecord(providersValue);
	if (!providers) return false;
	const wildcardPaths = collectLegacyModelPolicyWildcardPaths(root);
	const canonicalEntry = getCanonicalOpenAIProviderEntry(providers);
	for (const [providerId, providerValue] of Object.entries(providers)) {
		const provider = getRecord(providerValue);
		if (!provider || !isLegacyCodexProviderId(providerId)) continue;
		if (wildcardPaths.has(normalizeProviderId(providerId))) continue;
		const normalized = normalizeLegacyOpenAIResponsesApi(providerId, provider, []);
		if (normalized.changed || !canonicalEntry) return true;
		if (collectNonEquivalentLegacyOpenAIModelCollisions({
			canonical: canonicalEntry.value,
			legacy: normalized.value,
			legacyProviderId: providerId
		}).length > 0) continue;
		if (getMergeableLegacyOpenAIModels({
			canonical: canonicalEntry.value,
			legacy: normalized.value
		}).length === 0) return true;
		if (collectModelMergeBlockers({
			canonical: canonicalEntry.value,
			legacy: normalized.value,
			legacyProviderId: providerId
		}).length === 0) return true;
	}
	return false;
}
/** Compute the provider-merge blockers once so every doctor state repair shares the decision. */
function collectBlockedLegacyOpenAICodexProviderPlan(raw) {
	const models = getRecord(getRecord(raw)?.models);
	const providers = getRecord(models?.providers);
	const canonicalEntry = providers ? getCanonicalOpenAIProviderEntry(providers) : void 0;
	const blockedModelIdentities = /* @__PURE__ */ new Set();
	const warningLines = [];
	for (const [providerId, paths] of collectLegacyModelPolicyWildcardPaths(raw)) {
		const identity = legacyCodexProviderIdentityKey(providerId);
		if (identity) blockedModelIdentities.add(identity);
		warningLines.push(`- ${paths.join(", ")} cannot migrate automatically because ${providerId}/* would become openai/* and authorize unrelated OpenAI models.`);
	}
	if (!providers || !canonicalEntry) return buildBlockedLegacyOpenAICodexProviderPlan(blockedModelIdentities, warningLines);
	for (const [providerId, providerValue] of Object.entries(providers)) {
		const provider = getRecord(providerValue);
		if (!provider || !isLegacyCodexProviderId(providerId)) continue;
		const normalized = normalizeLegacyOpenAIResponsesApi(providerId, provider, []);
		const modelCollisions = collectNonEquivalentLegacyOpenAIModelCollisions({
			canonical: canonicalEntry.value,
			legacy: normalized.value,
			legacyProviderId: providerId
		});
		if (modelCollisions.length > 0) {
			const identity = legacyCodexProviderIdentityKey(providerId);
			if (identity) blockedModelIdentities.add(identity);
			warningLines.push(`- models.providers.${providerId} cannot be merged automatically into models.providers.${canonicalEntry.key} because colliding model definitions differ for: ${modelCollisions.join(", ")}.`);
			continue;
		}
		if (getMergeableLegacyOpenAIModels({
			canonical: canonicalEntry.value,
			legacy: normalized.value
		}).length === 0) continue;
		const mergeBlockers = collectModelMergeBlockers({
			canonical: canonicalEntry.value,
			legacy: normalized.value,
			legacyProviderId: providerId
		});
		if (mergeBlockers.length === 0) continue;
		const identity = legacyCodexProviderIdentityKey(providerId);
		if (identity) blockedModelIdentities.add(identity);
		warningLines.push(`- models.providers.${providerId} cannot be merged automatically into models.providers.${canonicalEntry.key} because provider-level defaults cannot be represented safely on merged models: ${mergeBlockers.join(", ")}.`);
	}
	return buildBlockedLegacyOpenAICodexProviderPlan(blockedModelIdentities, warningLines);
}
function buildBlockedLegacyOpenAICodexProviderPlan(blockedModelIdentities, warningLines) {
	return {
		blockedModelIdentities: [...blockedModelIdentities],
		...warningLines.length > 0 ? { warning: [
			"Legacy Codex provider routes require manual reconciliation before matching refs can migrate.",
			...warningLines,
			"- Doctor retained matching legacy refs in config, sessions, and cron. These refs will not execute until reconciled: fix the model route/auth metadata, remove the legacy provider entry, then rerun `openclaw doctor --fix`."
		].join("\n") } : {}
	};
}
function resolveMovedCodexModelRuntime(params) {
	if (normalizeProviderId(params.legacyProviderId) !== "codex") return;
	const modelRuntime = getRecord(params.model.agentRuntime);
	const modelRuntimeId = normalizeOptionalAgentRuntimeId(modelRuntime?.id);
	if (modelRuntimeId && modelRuntimeId !== "auto") return;
	if (modelRuntimeId === "auto") return {
		...modelRuntime,
		id: "codex"
	};
	const providerRuntime = getRecord(params.legacyProvider.agentRuntime);
	const providerRuntimeId = normalizeOptionalAgentRuntimeId(providerRuntime?.id);
	return providerRuntimeId && providerRuntimeId !== "auto" ? providerRuntime ?? void 0 : {
		...providerRuntime,
		id: "codex"
	};
}
function buildMergedLegacyOpenAIModel(model, legacyProvider, legacyProviderId) {
	const modelRecord = getRecord(model);
	if (!modelRecord) return model;
	const patch = {};
	const legacyBaseUrl = typeof legacyProvider.baseUrl === "string" ? legacyProvider.baseUrl : void 0;
	const legacyApi = typeof legacyProvider.api === "string" ? legacyProvider.api : void 0;
	const legacyParams = getRecord(legacyProvider.params);
	const legacyAgentRuntime = getRecord(legacyProvider.agentRuntime);
	const movedCodexRuntime = resolveMovedCodexModelRuntime({
		legacyProviderId,
		legacyProvider,
		model: modelRecord
	});
	if (legacyBaseUrl && !modelRecord.baseUrl) patch.baseUrl = legacyBaseUrl;
	if (legacyApi && !modelRecord.api) patch.api = legacyApi;
	for (const key of [
		"contextWindow",
		"contextTokens",
		"maxTokens"
	]) if (typeof legacyProvider[key] === "number" && modelRecord[key] === void 0) patch[key] = legacyProvider[key];
	if (legacyParams) {
		const modelParams = getRecord(modelRecord.params);
		if (modelParams) patch.params = {
			...legacyParams,
			...modelParams
		};
		else if (modelRecord.params === void 0) patch.params = legacyParams;
	}
	if (movedCodexRuntime) patch.agentRuntime = movedCodexRuntime;
	else if (legacyAgentRuntime && modelRecord.agentRuntime === void 0) patch.agentRuntime = legacyAgentRuntime;
	if (modelRecord.metadataSource === void 0 && isLegacyModelsAddCodexMetadataModel({
		provider: legacyProviderId,
		model: modelRecord
	})) patch.metadataSource = "models-add";
	return Object.keys(patch).length > 0 ? Object.assign({}, modelRecord, patch) : model;
}
function collectNonEquivalentLegacyOpenAIModelCollisions(params) {
	const canonicalModels = Array.isArray(params.canonical.models) ? params.canonical.models : [];
	const legacyModels = Array.isArray(params.legacy.models) ? params.legacy.models : [];
	const conflicts = /* @__PURE__ */ new Set();
	for (const legacyModel of legacyModels) {
		const legacyRecord = getRecord(legacyModel);
		const legacyId = typeof legacyRecord?.id === "string" ? legacyRecord.id : void 0;
		const legacyName = typeof legacyRecord?.name === "string" ? legacyRecord.name : void 0;
		if (!legacyRecord || !legacyId && !legacyName) continue;
		const collisions = canonicalModels.filter((canonicalModel) => {
			const canonicalRecord = getRecord(canonicalModel);
			return legacyId ? canonicalRecord?.id === legacyId : canonicalRecord?.name === legacyName;
		});
		if (collisions.length === 0) continue;
		const legacyEffective = buildMergedLegacyOpenAIModel(legacyModel, params.legacy, params.legacyProviderId);
		if (!collisions.every((canonicalModel) => {
			const canonicalEffective = buildMergedLegacyOpenAIModel(canonicalModel, params.canonical, OPENAI_PROVIDER_ID);
			if (!isDeepStrictEqual(canonicalEffective, legacyEffective)) return false;
			return MODEL_UNSCOPED_PROVIDER_DEFAULT_KEYS.every((key) => isDeepStrictEqual(params.canonical[key], params.legacy[key]));
		})) conflicts.add(legacyId ?? legacyName ?? "unknown");
	}
	return [...conflicts];
}
function prepareLegacyCodexProviderForCanonicalMove(providerId, provider) {
	if (normalizeProviderId(providerId) !== "codex" || !Array.isArray(provider.models)) return provider;
	return {
		...provider,
		models: provider.models.map((model) => {
			const record = getRecord(model);
			if (!record) return model;
			const agentRuntime = resolveMovedCodexModelRuntime({
				legacyProviderId: providerId,
				legacyProvider: provider,
				model: record
			});
			return agentRuntime ? {
				...record,
				agentRuntime
			} : model;
		})
	};
}
function migrateLegacyOpenAICodexProvider(raw, changes) {
	const models = getRecord(raw.models);
	const providers = getRecord(models?.providers);
	if (!models || !providers) return;
	const wildcardPaths = collectLegacyModelPolicyWildcardPaths(raw);
	for (const [providerId, providerValue] of Object.entries({ ...providers })) {
		const provider = getRecord(providers[providerId]) ?? getRecord(providerValue);
		if (!provider) continue;
		if (isLegacyCodexProviderId(providerId) && wildcardPaths.has(normalizeProviderId(providerId))) continue;
		const normalized = normalizeLegacyOpenAIResponsesApi(providerId, provider, changes);
		if (!isLegacyCodexProviderId(providerId)) {
			if (normalized.changed) providers[providerId] = normalized.value;
			continue;
		}
		if (!hasCanonicalOpenAIProvider(providers)) {
			providers[OPENAI_PROVIDER_ID] = prepareLegacyCodexProviderForCanonicalMove(providerId, normalized.value);
			changes.push(`Moved models.providers.${providerId} → models.providers.${OPENAI_PROVIDER_ID}.`);
		} else {
			const canonicalEntry = getCanonicalOpenAIProviderEntry(providers);
			const canonicalKey = canonicalEntry?.key ?? OPENAI_PROVIDER_ID;
			const canonical = canonicalEntry?.value ?? {};
			const canonicalModels = Array.isArray(canonical.models) ? canonical.models : [];
			const modelCollisions = collectNonEquivalentLegacyOpenAIModelCollisions({
				canonical,
				legacy: normalized.value,
				legacyProviderId: providerId
			});
			const modelsToMerge = getMergeableLegacyOpenAIModels({
				canonical,
				legacy: normalized.value
			});
			const mergeBlockers = modelCollisions.length === 0 && modelsToMerge.length > 0 ? collectModelMergeBlockers({
				canonical,
				legacy: normalized.value,
				legacyProviderId: providerId
			}) : [];
			if (modelCollisions.length > 0 || mergeBlockers.length > 0) {
				if (normalized.changed) {
					providers[providerId] = normalized.value;
					changes.push(modelCollisions.length > 0 ? `Skipped merging models.providers.${providerId} into models.providers.${OPENAI_PROVIDER_ID} because colliding model definitions differ for: ${modelCollisions.join(", ")}.` : `Skipped merging models.providers.${providerId} into models.providers.${OPENAI_PROVIDER_ID} because provider-level defaults cannot be represented safely on merged models: ${mergeBlockers.join(", ")}.`);
				}
				continue;
			}
			const stamped = modelsToMerge.map((m) => buildMergedLegacyOpenAIModel(m, normalized.value, providerId));
			if (stamped.length > 0) {
				providers[canonicalKey] = {
					...canonical,
					models: [...canonicalModels, ...stamped]
				};
				const mergedIds = stamped.map((m) => {
					const mr = getRecord(m);
					return typeof mr?.id === "string" && mr.id ? mr.id : typeof mr?.name === "string" && mr.name ? mr.name : "unknown";
				}).join(", ");
				changes.push(`Merged ${stamped.length} model(s) from models.providers.${providerId} into models.providers.${OPENAI_PROVIDER_ID}: ${mergedIds}.`);
			} else changes.push(`Removed models.providers.${providerId} because models.providers.${OPENAI_PROVIDER_ID} already exists.`);
		}
		delete providers[providerId];
	}
}
const MODEL_REF_CANONICALIZATION_RULES = [
	"agents",
	"plugins",
	"messages",
	"tools",
	"hooks",
	"channels",
	"models"
].map((section) => ({
	path: [section],
	message: MODEL_REF_CANONICALIZATION_MESSAGE,
	match: (value) => scanKnownModelRefs(value)
}));
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.models.vllm.ts
const QWEN_THINKING_FORMAT_KEYS = ["qwenThinkingFormat", "qwen_thinking_format"];
function normalizeLegacyVllmQwenThinkingFormat(value) {
	if (typeof value !== "string") return;
	switch (value.trim().toLowerCase().replace(/[_\s]+/g, "-")) {
		case "chat-template":
		case "chat-template-argument":
		case "chat-template-arguments":
		case "chat-template-kwarg":
		case "chat-template-kwargs":
		case "qwen-chat-template": return "qwen-chat-template";
		case "enable-thinking":
		case "qwen":
		case "request-body":
		case "top-level": return "qwen";
		default: return;
	}
}
function getLegacyVllmQwenThinkingFormat(params) {
	for (const key of QWEN_THINKING_FORMAT_KEYS) if (Object.hasOwn(params, key)) return {
		key,
		value: params[key],
		compat: normalizeLegacyVllmQwenThinkingFormat(params[key])
	};
}
function parseVllmAgentModelKey(key) {
	const trimmed = splitTrailingAuthProfile(key).model.trim();
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0) return;
	const providerId = trimmed.slice(0, slashIndex);
	if (normalizeProviderId(providerId) !== "vllm") return;
	const modelId = trimmed.slice(slashIndex + 1).trim();
	return modelId && modelId !== "*" ? modelId : void 0;
}
function hasLegacyVllmQwenThinkingFormat(defaultModels) {
	const models = getRecord(defaultModels);
	if (!models) return false;
	for (const [key, entry] of Object.entries(models)) {
		if (!parseVllmAgentModelKey(key)) continue;
		const params = getRecord(getRecord(entry)?.params);
		if (params && getLegacyVllmQwenThinkingFormat(params)) return true;
	}
	return false;
}
function hasLegacyVllmQwenThinkingProviderParams(provider) {
	const params = getRecord(getRecord(provider)?.params);
	return Boolean(params && getLegacyVllmQwenThinkingFormat(params));
}
function hasLegacyVllmQwenThinkingModelParams(provider) {
	const models = getRecord(provider)?.models;
	if (!Array.isArray(models)) return false;
	return models.some((model) => {
		const params = getRecord(getRecord(model)?.params);
		return Boolean(params && getLegacyVllmQwenThinkingFormat(params));
	});
}
function hasLegacyVllmQwenThinkingParams(params) {
	const record = getRecord(params);
	return Boolean(record && getLegacyVllmQwenThinkingFormat(record));
}
function hasLegacyVllmQwenThinkingAgentParams(agents) {
	let found = false;
	visitAgentEntries({ agents }, (agent) => {
		found ||= hasLegacyVllmQwenThinkingParams(agent.params);
	});
	return found;
}
function findOrCreateVllmModelEntry(raw, modelId) {
	const modelsRoot = getOrCreateRecord(raw, "models");
	const providers = modelsRoot ? getOrCreateRecord(modelsRoot, "providers") : void 0;
	const vllm = providers ? getOrCreateVllmProvider(providers) : void 0;
	if (!vllm) return;
	if (vllm.models !== void 0 && !Array.isArray(vllm.models)) return;
	const models = Array.isArray(vllm.models) ? vllm.models : [];
	vllm.models = models;
	const providerModelId = `vllm/${modelId}`;
	for (const [index, model] of models.entries()) {
		const record = getRecord(model);
		if (record?.id === modelId || record?.id === providerModelId) return {
			model: record,
			index
		};
	}
	const model = {
		id: modelId,
		name: modelId
	};
	models.push(model);
	return {
		model,
		index: models.length - 1
	};
}
function listExistingVllmModelTargets(raw) {
	const models = findVllmProvider(getRecord(getRecord(raw.models)?.providers))?.models;
	if (!Array.isArray(models)) return [];
	return models.flatMap((model, index) => {
		const record = getRecord(model);
		return record ? [{
			model: record,
			index
		}] : [];
	});
}
function collectVllmModelIdsFromSelection(value) {
	if (typeof value === "string") {
		const modelId = parseVllmAgentModelKey(value);
		return modelId ? [modelId] : [];
	}
	const record = getRecord(value);
	if (!record) return [];
	const ids = [];
	if (typeof record.primary === "string") {
		const primary = parseVllmAgentModelKey(record.primary);
		if (primary) ids.push(primary);
	}
	if (Array.isArray(record.fallbacks)) for (const fallback of record.fallbacks) {
		if (typeof fallback !== "string") continue;
		const modelId = parseVllmAgentModelKey(fallback);
		if (modelId) ids.push(modelId);
	}
	return ids;
}
function collectVllmModelIdsFromAgentModelMap(value) {
	const models = getRecord(value);
	if (!models) return [];
	return Object.keys(models).flatMap((key) => {
		const modelId = parseVllmAgentModelKey(key);
		return modelId ? [modelId] : [];
	});
}
function createVllmModelTargets(raw, modelIds) {
	const targets = [];
	const seen = /* @__PURE__ */ new Set();
	for (const modelId of modelIds) {
		const target = findOrCreateVllmModelEntry(raw, modelId);
		if (!target || seen.has(target.model)) continue;
		seen.add(target.model);
		targets.push(target);
	}
	return targets;
}
function combineVllmModelTargets(...groups) {
	const targets = [];
	const seen = /* @__PURE__ */ new Set();
	for (const group of groups) for (const target of group) {
		if (seen.has(target.model)) continue;
		seen.add(target.model);
		targets.push(target);
	}
	return targets;
}
function collectVllmModelIdsFromAgentRoster(raw) {
	const modelIds = [];
	visitAgentEntries(raw, (agent) => {
		modelIds.push(...collectVllmModelIdsFromSelection(agent.model), ...collectVllmModelIdsFromAgentModelMap(agent.models));
	});
	return modelIds;
}
function getOrCreateRecord(root, key) {
	if (root[key] === void 0) {
		const next = {};
		root[key] = next;
		return next;
	}
	return getRecord(root[key]) ?? void 0;
}
function findVllmProvider(providers) {
	if (!providers) return;
	const key = Object.keys(providers).find((entry) => normalizeProviderId(entry) === "vllm");
	return key ? getRecord(providers[key]) ?? void 0 : void 0;
}
function getOrCreateVllmProvider(providers) {
	const key = Object.keys(providers).find((entry) => normalizeProviderId(entry) === "vllm");
	if (key) return getRecord(providers[key]) ?? void 0;
	return getOrCreateRecord(providers, "vllm");
}
function hasLegacyVllmQwenThinkingNormalizedProvider(providers) {
	const providersRecord = getRecord(providers);
	if (!providersRecord || getRecord(providersRecord.vllm)) return false;
	const vllmProvider = findVllmProvider(providersRecord);
	return hasLegacyVllmQwenThinkingProviderParams(vllmProvider) || hasLegacyVllmQwenThinkingModelParams(vllmProvider);
}
function preserveMigratedVllmQwenReasoning(model) {
	if (model.reasoning === void 0) model.reasoning = true;
}
function removeLegacyVllmQwenThinkingParams(params) {
	for (const key of QWEN_THINKING_FORMAT_KEYS) delete params[key];
}
function applyLegacyVllmQwenThinkingFormat(params) {
	if (!params.legacyFormat.compat) {
		removeLegacyVllmQwenThinkingParams(params.legacyParams);
		params.changes.push(`Removed ${params.sourcePath}.${params.legacyFormat.key} (unrecognized value ${JSON.stringify(params.legacyFormat.value)}; configure models.providers.vllm.models[].compat.thinkingFormat if needed).`);
		return true;
	}
	preserveMigratedVllmQwenReasoning(params.target.model);
	const compat = ensureRecord(params.target.model, "compat");
	const currentThinkingFormat = compat.thinkingFormat;
	if (typeof currentThinkingFormat === "string" && isModelThinkingFormat(currentThinkingFormat)) {
		removeLegacyVllmQwenThinkingParams(params.legacyParams);
		params.changes.push(`Removed ${params.sourcePath}.${params.legacyFormat.key}; models.providers.vllm.models[${params.target.index}].compat.thinkingFormat is already ${JSON.stringify(currentThinkingFormat)}.`);
		return true;
	}
	compat.thinkingFormat = params.legacyFormat.compat;
	removeLegacyVllmQwenThinkingParams(params.legacyParams);
	params.changes.push(`Moved ${params.sourcePath}.${params.legacyFormat.key} to models.providers.vllm.models[${params.target.index}].compat.thinkingFormat (${JSON.stringify(params.legacyFormat.compat)}).`);
	return true;
}
function applyLegacyVllmQwenThinkingFormatToTargets(params) {
	if (params.targets.length > 0) {
		for (const target of params.targets) applyLegacyVllmQwenThinkingFormat({
			...params,
			target
		});
		return;
	}
	removeLegacyVllmQwenThinkingParams(params.legacyParams);
	params.changes.push(`Removed ${params.sourcePath}.${params.legacyFormat.key}; no concrete vLLM model row or agent model ref exists, so configure models.providers.vllm.models[].compat.thinkingFormat on each Qwen model that needs it.`);
}
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_MODELS = [
	defineLegacyConfigMigration({
		id: "defaultModel->agents.defaults.model",
		describe: "Move the retired root default model to agent defaults",
		legacyRules: [{
			path: ["defaultModel"],
			message: "defaultModel moved to agents.defaults.model. Run \"openclaw doctor --fix\"."
		}],
		apply: (raw, changes) => {
			if (!Object.hasOwn(raw, "defaultModel")) return;
			const legacyDefaultModel = raw.defaultModel;
			if (getRecord(getRecord(raw.agents)?.defaults)?.model === void 0 && typeof legacyDefaultModel === "string") {
				const defaults = ensureRecord(ensureRecord(raw, "agents"), "defaults");
				defaults.model = legacyDefaultModel;
				changes.push("Moved defaultModel → agents.defaults.model.");
			} else changes.push("Removed defaultModel (agents.defaults.model already set or value invalid).");
			delete raw.defaultModel;
		}
	}),
	defineLegacyConfigMigration({
		id: "runtime.utility-model-separation",
		describe: "Preserve the legacy implicit primary before separating utility models",
		legacyRules: [{
			path: ["agents"],
			message: "Legacy implicit primary model selection needs preservation before separating utility models. Run \"openclaw doctor --fix\"; dynamic catalog IDs need an explicit primary model.",
			match: (_value, root) => materializeUtilityModelSeparation(structuredClone(root)).changes.length > 0
		}],
		apply: (raw, changes, context) => {
			if (context && containsAuthoredInclude(context.authoredRaw)) return;
			const migrated = materializeUtilityModelSeparation(raw, context?.authoredRaw ?? raw);
			if (migrated.changes.length === 0) return;
			Object.assign(raw, migrated.config);
			changes.push(...migrated.changes);
		}
	}),
	defineLegacyConfigMigration({
		id: "models.pricing-retired",
		describe: "Remove the retired client-side model pricing bootstrap toggle",
		legacyRules: [{
			path: ["models", "pricing"],
			message: "models.pricing is retired because pricing ships with the hosted catalog; run \"openclaw doctor --fix\" to remove it."
		}],
		apply: (raw, changes) => {
			const models = getRecord(raw.models);
			if (!models || !Object.hasOwn(models, "pricing")) return;
			delete models.pricing;
			changes.push("Removed models.pricing (pricing now ships with the hosted model catalog).");
		}
	}),
	defineLegacyConfigMigration({
		id: "models.providers.*.models.*.compat->provider-catalog",
		describe: "Move known-model compatibility capability ownership into provider catalogs",
		legacyRules: MODEL_COMPAT_CATALOG_RULES,
		apply: migrateModelCompatCatalogOwnership
	}),
	defineLegacyConfigMigration({
		id: "models.providers.codex-routes->models.providers.openai",
		describe: "Move legacy Codex-route provider config to canonical OpenAI provider config",
		legacyRules: [{
			path: ["models", "providers"],
			message: "models.providers.codex and models.providers.openai-codex are legacy; run \"openclaw doctor --fix\" to move them to models.providers.openai.",
			match: (value, root) => hasAutoFixableLegacyOpenAICodexProvider(value, root)
		}, {
			path: ["models", "providers"],
			message: "openai-codex-responses is legacy; run \"openclaw doctor --fix\" to use openai-chatgpt-responses.",
			match: (value) => {
				const providers = getRecord(value);
				return providers ? Object.values(providers).some((providerValue) => {
					const provider = getRecord(providerValue);
					return provider?.api === "openai-codex-responses" || Array.isArray(provider?.models) && provider.models.some((model) => getRecord(model)?.api === "openai-codex-responses");
				}) : false;
			}
		}],
		apply: migrateLegacyOpenAICodexProvider
	}),
	defineLegacyConfigMigration({
		id: "models.canonical-model-refs",
		describe: "Canonicalize retired and noncanonical model refs",
		legacyRules: MODEL_REF_CANONICALIZATION_RULES,
		apply: (raw, changes) => {
			const rewritten = rewriteKnownModelRefs(raw, "config", changes);
			const rewrittenRecord = getRecord(rewritten.value);
			if (!rewritten.changed || !rewrittenRecord) return;
			for (const key of Object.keys(raw)) delete raw[key];
			for (const [key, value] of Object.entries(rewrittenRecord)) setRecordEntry(raw, key, value);
		}
	}),
	defineLegacyConfigMigration({
		id: "agents.defaults.models->agents.defaults.modelPolicy.allow",
		describe: "Make the legacy model override restriction explicit",
		legacyRules: [{
			path: [
				"agents",
				"defaults",
				"models"
			],
			message: "Legacy agents.defaults.models restricts model overrides; run \"openclaw doctor --fix\" to migrate valid refs to agents.defaults.modelPolicy.allow.",
			match: (_value, root) => collectLegacyDefaultModelAllowRefs(root) !== null
		}, {
			path: [
				"agents",
				"defaults",
				"models"
			],
			message: "Legacy model restriction retained: some keys need explicit provider/model refs. Set agents.defaults.modelPolicy.allow to the intended restriction; until then, editing agents.defaults.models still changes the restriction.",
			match: (_value, root) => materializeModelPolicyAllowlist(root).kind === "deferred"
		}],
		apply: migrateExplicitDefaultModelAllowPolicy
	}),
	defineLegacyConfigMigration({
		id: "agents.defaults.models.vllm.params.qwenThinkingFormat->models.providers.vllm.models.compat.thinkingFormat",
		describe: "Move legacy vLLM Qwen thinking params to model compat metadata",
		legacyRules: [
			{
				path: [
					"agents",
					"defaults",
					"models"
				],
				message: "agents.defaults.models.<vllm-model>.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
				match: (value) => hasLegacyVllmQwenThinkingFormat(value)
			},
			{
				path: [
					"models",
					"providers",
					"vllm",
					"params"
				],
				message: "models.providers.vllm.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
				match: (value) => hasLegacyVllmQwenThinkingProviderParams({ params: value })
			},
			{
				path: [
					"models",
					"providers",
					"vllm",
					"models"
				],
				message: "models.providers.vllm.models[*].params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
				match: (value) => hasLegacyVllmQwenThinkingModelParams({ models: value })
			},
			{
				path: ["models", "providers"],
				message: "models.providers.<vllm>.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.<vllm>.models[].compat.thinkingFormat.",
				match: (value) => hasLegacyVllmQwenThinkingNormalizedProvider(value)
			},
			{
				path: [
					"agents",
					"defaults",
					"params"
				],
				message: "agents.defaults.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
				match: (value) => hasLegacyVllmQwenThinkingParams(value)
			},
			{
				path: ["agents"],
				message: "agents.entries.*.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
				match: (value) => hasLegacyVllmQwenThinkingAgentParams(value)
			}
		],
		apply: (raw, changes) => {
			const agentsDefaults = getRecord(getRecord(raw.agents)?.defaults);
			const defaultModels = getRecord(agentsDefaults?.models);
			if (defaultModels) for (const [key, entry] of Object.entries(defaultModels)) {
				const modelId = parseVllmAgentModelKey(key);
				const entryRecord = getRecord(entry);
				const params = getRecord(entryRecord?.params);
				if (!modelId || !entryRecord || !params) continue;
				const legacyFormat = getLegacyVllmQwenThinkingFormat(params);
				if (!legacyFormat) continue;
				const target = legacyFormat.compat ? findOrCreateVllmModelEntry(raw, modelId) : void 0;
				if (legacyFormat.compat && !target) continue;
				applyLegacyVllmQwenThinkingFormat({
					sourcePath: `agents.defaults.models.${JSON.stringify(key)}.params`,
					legacyParams: params,
					target: target ?? {
						model: {},
						index: -1
					},
					legacyFormat,
					changes
				});
				if (Object.keys(params).length === 0) delete entryRecord.params;
			}
			const vllmProvider = findVllmProvider(getRecord(getRecord(raw.models)?.providers));
			const vllmModels = vllmProvider?.models;
			if (Array.isArray(vllmModels)) for (const [index, model] of vllmModels.entries()) {
				const modelRecord = getRecord(model);
				const params = getRecord(modelRecord?.params);
				if (!modelRecord || !params) continue;
				const legacyFormat = getLegacyVllmQwenThinkingFormat(params);
				if (!legacyFormat) continue;
				applyLegacyVllmQwenThinkingFormat({
					sourcePath: `models.providers.vllm.models[${index}].params`,
					legacyParams: params,
					target: {
						model: modelRecord,
						index
					},
					legacyFormat,
					changes
				});
				if (Object.keys(params).length === 0) delete modelRecord.params;
			}
			let cachedDefaultModelIds;
			const getDefaultModelIds = () => cachedDefaultModelIds ??= [...collectVllmModelIdsFromSelection(agentsDefaults?.model), ...collectVllmModelIdsFromAgentModelMap(defaultModels)];
			const providerParams = getRecord(vllmProvider?.params);
			if (providerParams) {
				const providerLegacyFormat = getLegacyVllmQwenThinkingFormat(providerParams);
				if (providerLegacyFormat) {
					const providerModelIds = [...getDefaultModelIds(), ...collectVllmModelIdsFromAgentRoster(raw)];
					applyLegacyVllmQwenThinkingFormatToTargets({
						sourcePath: "models.providers.vllm.params",
						legacyParams: providerParams,
						targets: combineVllmModelTargets(listExistingVllmModelTargets(raw), createVllmModelTargets(raw, providerModelIds)),
						legacyFormat: providerLegacyFormat,
						changes
					});
					if (Object.keys(providerParams).length === 0) delete vllmProvider?.params;
				}
			}
			const defaultParams = getRecord(agentsDefaults?.params);
			if (defaultParams) {
				const defaultLegacyFormat = getLegacyVllmQwenThinkingFormat(defaultParams);
				if (defaultLegacyFormat) {
					const defaultModelIds = getDefaultModelIds();
					applyLegacyVllmQwenThinkingFormatToTargets({
						sourcePath: "agents.defaults.params",
						legacyParams: defaultParams,
						targets: defaultModelIds.length > 0 ? createVllmModelTargets(raw, defaultModelIds) : listExistingVllmModelTargets(raw),
						legacyFormat: defaultLegacyFormat,
						changes
					});
					if (Object.keys(defaultParams).length === 0) delete agentsDefaults?.params;
				}
			}
			visitAgentEntries(raw, (agentRecord, path) => {
				const agentParams = getRecord(agentRecord.params);
				const agentLegacyFormat = agentParams ? getLegacyVllmQwenThinkingFormat(agentParams) : void 0;
				if (!agentParams || !agentLegacyFormat) return;
				const explicitAgentModelIds = [...collectVllmModelIdsFromSelection(agentRecord.model), ...collectVllmModelIdsFromAgentModelMap(agentRecord.models)];
				const agentModelIds = explicitAgentModelIds.length > 0 ? explicitAgentModelIds : getDefaultModelIds();
				const targets = agentModelIds.length > 0 ? createVllmModelTargets(raw, agentModelIds) : listExistingVllmModelTargets(raw);
				applyLegacyVllmQwenThinkingFormatToTargets({
					sourcePath: `${path}.params`,
					legacyParams: agentParams,
					targets,
					legacyFormat: agentLegacyFormat,
					changes
				});
				if (Object.keys(agentParams).length === 0) delete agentRecord.params;
			});
		}
	}),
	defineLegacyConfigMigration({
		id: "models.providers.*.models.*.compat.thinkingFormat-invalid",
		describe: "Remove unrecognized compat.thinkingFormat values from provider model entries",
		legacyRules: [{
			path: ["models", "providers"],
			message: "models.providers.<id>.models[*].compat.thinkingFormat has an unrecognized value; run \"openclaw doctor --fix\" to remove it and restore the runtime default.",
			match: (value) => hasInvalidThinkingFormat(value)
		}],
		apply: (raw, changes) => {
			const providers = getRecord(getRecord(raw.models)?.providers);
			if (!providers) return;
			for (const [providerId, provider] of Object.entries(providers)) {
				const models = getRecord(provider)?.models;
				if (!Array.isArray(models)) continue;
				for (const [index, model] of models.entries()) {
					const compat = getRecord(getRecord(model)?.compat);
					if (!compat) continue;
					const thinkingFormat = compat.thinkingFormat;
					if (typeof thinkingFormat !== "string" || isModelThinkingFormat(thinkingFormat)) continue;
					delete compat.thinkingFormat;
					changes.push(`Removed models.providers.${providerId}.models.${index}.compat.thinkingFormat (unrecognized value ${JSON.stringify(thinkingFormat)}; runtime default applies).`);
				}
			}
		}
	}),
	defineLegacyConfigMigration({
		id: "models.providers.*.models.*.contextWindow-stale",
		describe: "Repair stale contextWindow values to match catalog defaults",
		legacyRules: [{
			path: ["models", "providers"],
			message: "models.providers.<id>.models[*].contextWindow has a stale catalog value; run \"openclaw doctor --fix\" to repair it.",
			match: (value) => hasStaleContextWindowValue(value)
		}],
		apply: (raw, changes) => {
			const providers = getRecord(getRecord(raw.models)?.providers);
			if (!providers) return;
			for (const [providerId, provider] of Object.entries(providers)) {
				const models = getRecord(provider)?.models;
				if (!Array.isArray(models)) continue;
				for (const [index, model] of models.entries()) {
					if (!getRecord(model)) continue;
					const modelId = typeof model.id === "string" ? model.id : void 0;
					if (!modelId) continue;
					const contextWindow = model.contextWindow;
					if (typeof contextWindow !== "number" || !Number.isFinite(contextWindow)) continue;
					const fix = resolveStaleContextWindowFix({
						providerId,
						modelId,
						contextWindow
					});
					if (!fix) continue;
					model.contextWindow = fix.correct;
					changes.push(`Repaired models.providers.${providerId}.models[${index}].${modelId}.contextWindow (${contextWindow} → ${fix.correct} to match catalog default).`);
				}
			}
		}
	})
];
//#endregion
export { rewriteKnownModelRefs as a, selectedCanonicalModelRefsForRuntimePolicy as c, hasOwnKey as d, visitAgentConfigScopes as f, mergeModelRefMapEntries as i, cloneRecord as l, visitChannelEntries as m, collectBlockedLegacyOpenAICodexProviderPlan as n, rewriteModelRefs as o, visitAgentEntries as p, isLegacyModelsAddCodexMetadataModel as r, modelEntryWithRuntimePolicy as s, LEGACY_CONFIG_MIGRATIONS_RUNTIME_MODELS as t, deleteRetiredPath as u };
