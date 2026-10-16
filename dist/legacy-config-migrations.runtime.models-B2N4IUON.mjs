import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { F as hasModelPolicyAllowlistMigrationMarker, I as materializeModelPolicyAllowlist, N as computeModelPolicyAllowlist } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as normalizeConfiguredProviderCatalogModelId } from "./provider-model-id-normalization-BUc8S34C.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-C9K4a_6k.mjs";
import { n as materializeUtilityModelSeparation } from "./utility-model-separation-migration-BVcPkqsj.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { b as defineLegacyConfigMigration, c as legacyCodexProviderIdentityKey, x as ensureRecord, y as isLegacyCodexProviderId } from "./codex-route-model-ref-CA8y5Vff.mjs";
import { a as visitAgentEntries, i as visitAgentConfigScopes } from "./legacy-config-record-shared-C4da1YWQ.mjs";
import { r as isModelThinkingFormat } from "./model-config-vocabulary-Cb5jWCSz.mjs";
import "./types.models-BqvzicE8.mjs";
import { n as containsAuthoredInclude } from "./include-migration-ownership-jJubBWXv.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { N as listModelRefsFromConfigValue } from "./runtime-snapshot-DYptB0Cf.mjs";
import { a as providerModelEntries, i as migrateModelCompatCatalogOwnership, n as hasInvalidThinkingFormat, r as hasStaleContextWindowValue, s as resolveStaleContextWindowFix, t as MODEL_COMPAT_CATALOG_RULES } from "./legacy-config-migrations.runtime.models.catalog-DI1lNcdj.mjs";
import { isDeepStrictEqual } from "node:util";
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
		if (normalized.startsWith("anthropic.claude-opus-4-7") || normalized.startsWith("anthropic.claude-opus-4-6")) return null;
		return `anthropic.${claudeTargetModelId("opus", "-", provider)}`;
	}
	if (normalized.startsWith("anthropic.claude-sonnet-") || normalized.startsWith("anthropic.claude-haiku-")) {
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
		const models = asNullableRecord(providerValue)?.models;
		return Array.isArray(models) && models.some((model) => {
			const modelId = asNullableRecord(model)?.id;
			return typeof modelId === "string" && normalizeProviderCatalogModelId(providerId, modelId) !== modelId;
		});
	});
}
function scanKnownModelRefs(value, key, path = "") {
	if (typeof value === "string") return Boolean(key && (MODEL_REF_STRING_KEYS.has(key) || isChannelModelOverridePath(path) || isMediaModelPath(path)) && normalizeKnownModelRef(value));
	if (Array.isArray(value)) return value.some((entry, index) => typeof entry === "string" && key && (MODEL_REF_ARRAY_KEYS.has(key) || isModelPolicyAllowPath(path)) ? Boolean(normalizeKnownModelRef(entry)) : scanKnownModelRefs(entry, void 0, `${path}.${index}`));
	const record = asNullableRecord(value);
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
	const record = asNullableRecord(value);
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
	const existingRecord = asNullableRecord(existing);
	const incomingRecord = asNullableRecord(incoming);
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
		const existingField = asNullableRecord(existingValue);
		const incomingField = asNullableRecord(incomingValue);
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
		const provider = asNullableRecord(providerValue);
		if (!provider || !Array.isArray(provider.models)) continue;
		const rows = provider.models.map((model, index) => {
			const modelRecord = asNullableRecord(model);
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
				merged = asNullableRecord(result.value) ?? merged;
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
	const record = asNullableRecord(value);
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
			const modelRecord = asNullableRecord(model);
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
	const value = key ? asNullableRecord(providers[key]) : void 0;
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
		const mr = asNullableRecord(m);
		if (typeof mr?.id === "string" && mr.id) canonicalModelIds.add(mr.id);
		if (typeof mr?.name === "string" && mr.name) canonicalModelNames.add(mr.name);
	}
	return legacyModels.filter((m) => {
		const mr = asNullableRecord(m);
		if (!mr) return false;
		const id = typeof mr.id === "string" ? mr.id : void 0;
		const name = typeof mr.name === "string" ? mr.name : void 0;
		if (!id && !name) return false;
		return id ? !canonicalModelIds.has(id) : name ? !canonicalModelNames.has(name) : false;
	});
}
function collectLegacyModelPolicyWildcardPaths(raw) {
	const pathsByProvider = /* @__PURE__ */ new Map();
	visitAgentConfigScopes(asNullableRecord(raw) ?? {}, (agent, path) => {
		const allow = asNullableRecord(agent.modelPolicy)?.allow;
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
	const providers = asNullableRecord(providersValue);
	if (!providers) return false;
	const wildcardPaths = collectLegacyModelPolicyWildcardPaths(root);
	const canonicalEntry = getCanonicalOpenAIProviderEntry(providers);
	for (const [providerId, providerValue] of Object.entries(providers)) {
		const provider = asNullableRecord(providerValue);
		if (!provider || !isLegacyCodexProviderId(providerId)) continue;
		if (wildcardPaths.has(normalizeProviderId(providerId))) continue;
		const normalized = normalizeLegacyOpenAIResponsesApi(providerId, provider, []);
		if (normalized.changed || !canonicalEntry) return true;
		const { modelCollisions, mergeBlockers } = inspectLegacyOpenAIProviderMerge(canonicalEntry.value, normalized.value, providerId);
		if (modelCollisions.length === 0 && mergeBlockers.length === 0) return true;
	}
	return false;
}
/** Compute the provider-merge blockers once so every doctor state repair shares the decision. */
function collectBlockedLegacyOpenAICodexProviderPlan(raw) {
	const models = asNullableRecord(asNullableRecord(raw)?.models);
	const providers = asNullableRecord(models?.providers);
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
		const provider = asNullableRecord(providerValue);
		if (!provider || !isLegacyCodexProviderId(providerId)) continue;
		const normalized = normalizeLegacyOpenAIResponsesApi(providerId, provider, []);
		const { modelCollisions, mergeBlockers } = inspectLegacyOpenAIProviderMerge(canonicalEntry.value, normalized.value, providerId);
		if (modelCollisions.length === 0 && mergeBlockers.length === 0) continue;
		const identity = legacyCodexProviderIdentityKey(providerId);
		if (identity) blockedModelIdentities.add(identity);
		warningLines.push(modelCollisions.length > 0 ? `- models.providers.${providerId} cannot be merged automatically into models.providers.${canonicalEntry.key} because colliding model definitions differ for: ${modelCollisions.join(", ")}.` : `- models.providers.${providerId} cannot be merged automatically into models.providers.${canonicalEntry.key} because provider-level defaults cannot be represented safely on merged models: ${mergeBlockers.join(", ")}.`);
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
	const modelRuntime = asNullableRecord(params.model.agentRuntime);
	const modelRuntimeId = normalizeOptionalAgentRuntimeId(modelRuntime?.id);
	if (modelRuntimeId && modelRuntimeId !== "auto") return;
	if (modelRuntimeId === "auto") return {
		...modelRuntime,
		id: "codex"
	};
	const providerRuntime = asNullableRecord(params.legacyProvider.agentRuntime);
	const providerRuntimeId = normalizeOptionalAgentRuntimeId(providerRuntime?.id);
	return providerRuntimeId && providerRuntimeId !== "auto" ? providerRuntime ?? void 0 : {
		...providerRuntime,
		id: "codex"
	};
}
function buildMergedLegacyOpenAIModel(model, legacyProvider, legacyProviderId) {
	const modelRecord = asNullableRecord(model);
	if (!modelRecord) return model;
	const patch = {};
	const legacyBaseUrl = typeof legacyProvider.baseUrl === "string" ? legacyProvider.baseUrl : void 0;
	const legacyApi = typeof legacyProvider.api === "string" ? legacyProvider.api : void 0;
	const legacyParams = asNullableRecord(legacyProvider.params);
	const legacyAgentRuntime = asNullableRecord(legacyProvider.agentRuntime);
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
		const modelParams = asNullableRecord(modelRecord.params);
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
		const legacyRecord = asNullableRecord(legacyModel);
		const legacyId = typeof legacyRecord?.id === "string" ? legacyRecord.id : void 0;
		const legacyName = typeof legacyRecord?.name === "string" ? legacyRecord.name : void 0;
		if (!legacyRecord || !legacyId && !legacyName) continue;
		const collisions = canonicalModels.filter((canonicalModel) => {
			const canonicalRecord = asNullableRecord(canonicalModel);
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
function inspectLegacyOpenAIProviderMerge(canonical, legacy, legacyProviderId) {
	const params = {
		canonical,
		legacy,
		legacyProviderId
	};
	const modelCollisions = collectNonEquivalentLegacyOpenAIModelCollisions(params);
	const modelsToMerge = getMergeableLegacyOpenAIModels(params);
	return {
		modelCollisions,
		modelsToMerge,
		mergeBlockers: modelCollisions.length === 0 && modelsToMerge.length > 0 ? collectModelMergeBlockers(params) : []
	};
}
function prepareLegacyCodexProviderForCanonicalMove(providerId, provider) {
	if (normalizeProviderId(providerId) !== "codex" || !Array.isArray(provider.models)) return provider;
	return {
		...provider,
		models: provider.models.map((model) => {
			const record = asNullableRecord(model);
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
	const models = asNullableRecord(raw.models);
	const providers = asNullableRecord(models?.providers);
	if (!models || !providers) return;
	const wildcardPaths = collectLegacyModelPolicyWildcardPaths(raw);
	for (const [providerId, providerValue] of Object.entries({ ...providers })) {
		const provider = asNullableRecord(providers[providerId]) ?? asNullableRecord(providerValue);
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
			const { modelCollisions, modelsToMerge, mergeBlockers } = inspectLegacyOpenAIProviderMerge(canonical, normalized.value, providerId);
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
					const mr = asNullableRecord(m);
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
	const models = asNullableRecord(defaultModels);
	if (!models) return false;
	for (const [key, entry] of Object.entries(models)) {
		if (!parseVllmAgentModelKey(key)) continue;
		const params = asNullableRecord(asNullableRecord(entry)?.params);
		if (params && getLegacyVllmQwenThinkingFormat(params)) return true;
	}
	return false;
}
function hasLegacyVllmQwenThinkingProviderParams(provider) {
	return hasLegacyVllmQwenThinkingParams(asNullableRecord(provider)?.params);
}
function hasLegacyVllmQwenThinkingModelParams(provider) {
	const models = asNullableRecord(provider)?.models;
	if (!Array.isArray(models)) return false;
	return models.some((model) => hasLegacyVllmQwenThinkingParams(asNullableRecord(model)?.params));
}
function hasLegacyVllmQwenThinkingParams(params) {
	const record = asNullableRecord(params);
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
		const record = asNullableRecord(model);
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
	const models = findVllmProvider(asNullableRecord(asNullableRecord(raw.models)?.providers))?.models;
	if (!Array.isArray(models)) return [];
	return models.flatMap((model, index) => {
		const record = asNullableRecord(model);
		return record ? [{
			model: record,
			index
		}] : [];
	});
}
function collectVllmModelIdsFromSelection(value) {
	return listModelRefsFromConfigValue(value).flatMap((ref) => {
		const modelId = parseVllmAgentModelKey(ref);
		return modelId ? [modelId] : [];
	});
}
function collectVllmModelIdsFromAgentModelMap(value) {
	const models = asNullableRecord(value);
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
	return asNullableRecord(root[key]) ?? void 0;
}
function findVllmProvider(providers) {
	if (!providers) return;
	const key = Object.keys(providers).find((entry) => normalizeProviderId(entry) === "vllm");
	return key ? asNullableRecord(providers[key]) ?? void 0 : void 0;
}
function getOrCreateVllmProvider(providers) {
	const key = Object.keys(providers).find((entry) => normalizeProviderId(entry) === "vllm");
	if (key) return asNullableRecord(providers[key]) ?? void 0;
	return getOrCreateRecord(providers, "vllm");
}
function hasLegacyVllmQwenThinkingNormalizedProvider(providers) {
	const providersRecord = asNullableRecord(providers);
	if (!providersRecord || asNullableRecord(providersRecord.vllm)) return false;
	const vllmProvider = findVllmProvider(providersRecord);
	return hasLegacyVllmQwenThinkingProviderParams(vllmProvider) || hasLegacyVllmQwenThinkingModelParams(vllmProvider);
}
function removeLegacyVllmQwenThinkingParams(params) {
	for (const key of QWEN_THINKING_FORMAT_KEYS) delete params[key];
}
function applyLegacyVllmQwenThinkingFormat(params) {
	if (!params.legacyFormat.compat) {
		removeLegacyVllmQwenThinkingParams(params.legacyParams);
		params.changes.push(`Removed ${params.sourcePath}.${params.legacyFormat.key} (unrecognized value ${JSON.stringify(params.legacyFormat.value)}; configure models.providers.vllm.models[].compat.thinkingFormat if needed).`);
		return;
	}
	if (params.target.model.reasoning === void 0) params.target.model.reasoning = true;
	const compat = ensureRecord(params.target.model, "compat");
	const currentThinkingFormat = compat.thinkingFormat;
	if (typeof currentThinkingFormat === "string" && isModelThinkingFormat(currentThinkingFormat)) {
		removeLegacyVllmQwenThinkingParams(params.legacyParams);
		params.changes.push(`Removed ${params.sourcePath}.${params.legacyFormat.key}; models.providers.vllm.models[${params.target.index}].compat.thinkingFormat is already ${JSON.stringify(currentThinkingFormat)}.`);
		return;
	}
	compat.thinkingFormat = params.legacyFormat.compat;
	removeLegacyVllmQwenThinkingParams(params.legacyParams);
	params.changes.push(`Moved ${params.sourcePath}.${params.legacyFormat.key} to models.providers.vllm.models[${params.target.index}].compat.thinkingFormat (${JSON.stringify(params.legacyFormat.compat)}).`);
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
const LEGACY_VLLM_QWEN_AGENT_THINKING_FORMAT_RULE = {
	path: [
		"agents",
		"defaults",
		"models"
	],
	message: "agents.defaults.models.<vllm-model>.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
	match: (value) => hasLegacyVllmQwenThinkingFormat(value)
};
const LEGACY_VLLM_QWEN_PROVIDER_THINKING_FORMAT_RULE = {
	path: [
		"models",
		"providers",
		"vllm",
		"params"
	],
	message: "models.providers.vllm.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
	match: (value) => hasLegacyVllmQwenThinkingProviderParams({ params: value })
};
const LEGACY_VLLM_QWEN_PROVIDER_MODEL_THINKING_FORMAT_RULE = {
	path: [
		"models",
		"providers",
		"vllm",
		"models"
	],
	message: "models.providers.vllm.models[*].params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
	match: (value) => hasLegacyVllmQwenThinkingModelParams({ models: value })
};
const LEGACY_VLLM_QWEN_NORMALIZED_PROVIDER_THINKING_FORMAT_RULE = {
	path: ["models", "providers"],
	message: "models.providers.<vllm>.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.<vllm>.models[].compat.thinkingFormat.",
	match: (value) => hasLegacyVllmQwenThinkingNormalizedProvider(value)
};
const LEGACY_VLLM_QWEN_DEFAULT_PARAMS_THINKING_FORMAT_RULE = {
	path: [
		"agents",
		"defaults",
		"params"
	],
	message: "agents.defaults.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
	match: (value) => hasLegacyVllmQwenThinkingParams(value)
};
const LEGACY_VLLM_QWEN_AGENT_PARAMS_THINKING_FORMAT_RULE = {
	path: ["agents"],
	message: "agents.entries.*.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
	match: (value) => hasLegacyVllmQwenThinkingAgentParams(value)
};
const INVALID_THINKING_FORMAT_RULE = {
	path: ["models", "providers"],
	message: "models.providers.<id>.models[*].compat.thinkingFormat has an unrecognized value; run \"openclaw doctor --fix\" to remove it and restore the runtime default.",
	match: (value) => hasInvalidThinkingFormat(value)
};
const STALE_CONTEXT_WINDOW_RULE = {
	path: ["models", "providers"],
	message: "models.providers.<id>.models[*].contextWindow has a stale catalog value; run \"openclaw doctor --fix\" to repair it.",
	match: (value) => hasStaleContextWindowValue(value)
};
//#endregion
//#region src/commands/doctor/shared/legacy-runtime-model-policy.ts
function collectLegacyDefaultModelAllowRefs(raw) {
	const defaults = asNullableRecord(asNullableRecord(raw.agents)?.defaults);
	return computeModelPolicyAllowlist({
		root: raw,
		defaults
	});
}
function migrateExplicitDefaultModelAllowPolicy(raw, changes) {
	if (hasModelPolicyAllowlistMigrationMarker(raw)) return;
	const defaults = asNullableRecord(asNullableRecord(raw.agents)?.defaults);
	const defaultModelPolicy = asNullableRecord(defaults?.modelPolicy);
	if (!(Boolean(asNullableRecord(defaults?.models)) && !(defaultModelPolicy && Object.hasOwn(defaultModelPolicy, "allow")))) return;
	const migrated = materializeModelPolicyAllowlist(raw);
	if (migrated.kind === "deferred") return;
	Object.assign(raw, migrated.config);
	changes.push(migrated.config.agents?.defaults?.modelPolicy?.allow ? "Copied the legacy default model map to agents.defaults.modelPolicy.allow." : "Recorded the legacy default model map as unrestricted without creating modelPolicy.allow.");
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
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.models.ts
function migrateVllmThinkingParams(owner, sourcePath, changes, resolveTargets) {
	const params = asNullableRecord(owner?.params);
	const legacyFormat = params ? getLegacyVllmQwenThinkingFormat(params) : void 0;
	if (!owner || !params || !legacyFormat) return;
	const targets = resolveTargets(legacyFormat);
	if (!targets) return;
	applyLegacyVllmQwenThinkingFormatToTargets({
		sourcePath,
		legacyParams: params,
		targets,
		legacyFormat,
		changes
	});
	if (Object.keys(params).length === 0) delete owner.params;
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
			if (asNullableRecord(asNullableRecord(raw.agents)?.defaults)?.model === void 0 && typeof legacyDefaultModel === "string") {
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
			const models = asNullableRecord(raw.models);
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
				const providers = asNullableRecord(value);
				return providers ? Object.values(providers).some((providerValue) => {
					const provider = asNullableRecord(providerValue);
					return provider?.api === "openai-codex-responses" || Array.isArray(provider?.models) && provider.models.some((model) => asNullableRecord(model)?.api === "openai-codex-responses");
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
			const rewrittenRecord = asNullableRecord(rewritten.value);
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
			LEGACY_VLLM_QWEN_AGENT_THINKING_FORMAT_RULE,
			LEGACY_VLLM_QWEN_PROVIDER_THINKING_FORMAT_RULE,
			LEGACY_VLLM_QWEN_PROVIDER_MODEL_THINKING_FORMAT_RULE,
			LEGACY_VLLM_QWEN_NORMALIZED_PROVIDER_THINKING_FORMAT_RULE,
			LEGACY_VLLM_QWEN_DEFAULT_PARAMS_THINKING_FORMAT_RULE,
			LEGACY_VLLM_QWEN_AGENT_PARAMS_THINKING_FORMAT_RULE
		],
		apply: (raw, changes) => {
			const agentsDefaults = asNullableRecord(asNullableRecord(raw.agents)?.defaults);
			const defaultModels = asNullableRecord(agentsDefaults?.models);
			for (const [key, entry] of Object.entries(defaultModels ?? {})) {
				const modelId = parseVllmAgentModelKey(key);
				if (!modelId) continue;
				migrateVllmThinkingParams(asNullableRecord(entry), `agents.defaults.models.${JSON.stringify(key)}.params`, changes, (format) => {
					const target = format.compat ? findOrCreateVllmModelEntry(raw, modelId) : {
						model: {},
						index: -1
					};
					return target ? [target] : void 0;
				});
			}
			const vllmProvider = findVllmProvider(asNullableRecord(asNullableRecord(raw.models)?.providers));
			const vllmModels = vllmProvider?.models;
			if (Array.isArray(vllmModels)) for (const [index, model] of vllmModels.entries()) {
				const modelRecord = asNullableRecord(model);
				if (modelRecord) migrateVllmThinkingParams(modelRecord, `models.providers.vllm.models[${index}].params`, changes, () => [{
					model: modelRecord,
					index
				}]);
			}
			let cachedDefaultModelIds;
			const getDefaultModelIds = () => cachedDefaultModelIds ??= [...collectVllmModelIdsFromSelection(agentsDefaults?.model), ...collectVllmModelIdsFromAgentModelMap(defaultModels)];
			migrateVllmThinkingParams(vllmProvider, "models.providers.vllm.params", changes, () => combineVllmModelTargets(listExistingVllmModelTargets(raw), createVllmModelTargets(raw, [...getDefaultModelIds(), ...collectVllmModelIdsFromAgentRoster(raw)])));
			const targetsForSelection = (modelIds) => modelIds.length > 0 ? createVllmModelTargets(raw, modelIds) : listExistingVllmModelTargets(raw);
			migrateVllmThinkingParams(agentsDefaults, "agents.defaults.params", changes, () => targetsForSelection(getDefaultModelIds()));
			visitAgentEntries(raw, (agentRecord, path) => {
				migrateVllmThinkingParams(agentRecord, `${path}.params`, changes, () => {
					const explicitAgentModelIds = [...collectVllmModelIdsFromSelection(agentRecord.model), ...collectVllmModelIdsFromAgentModelMap(agentRecord.models)];
					return targetsForSelection(explicitAgentModelIds.length > 0 ? explicitAgentModelIds : getDefaultModelIds());
				});
			});
		}
	}),
	defineLegacyConfigMigration({
		id: "models.providers.*.models.*.compat.thinkingFormat-invalid",
		describe: "Remove unrecognized compat.thinkingFormat values from provider model entries",
		legacyRules: [INVALID_THINKING_FORMAT_RULE],
		apply: (raw, changes) => {
			for (const { providerId, modelIndex, model } of providerModelEntries(asNullableRecord(raw.models)?.providers)) {
				const compat = asNullableRecord(model.compat);
				const thinkingFormat = compat?.thinkingFormat;
				if (!compat || typeof thinkingFormat !== "string" || isModelThinkingFormat(thinkingFormat)) continue;
				delete compat.thinkingFormat;
				changes.push(`Removed models.providers.${providerId}.models.${modelIndex}.compat.thinkingFormat (unrecognized value ${JSON.stringify(thinkingFormat)}; runtime default applies).`);
			}
		}
	}),
	defineLegacyConfigMigration({
		id: "models.providers.*.models.*.contextWindow-stale",
		describe: "Repair stale contextWindow values to match catalog defaults",
		legacyRules: [STALE_CONTEXT_WINDOW_RULE],
		apply: (raw, changes) => {
			for (const { providerId, modelIndex, model } of providerModelEntries(asNullableRecord(raw.models)?.providers)) {
				const modelId = typeof model.id === "string" ? model.id : void 0;
				const contextWindow = model.contextWindow;
				if (!modelId || typeof contextWindow !== "number" || !Number.isFinite(contextWindow)) continue;
				const fix = resolveStaleContextWindowFix({
					providerId,
					modelId,
					contextWindow
				});
				if (!fix) continue;
				model.contextWindow = fix.correct;
				changes.push(`Repaired models.providers.${providerId}.models[${modelIndex}].${modelId}.contextWindow (${contextWindow} → ${fix.correct} to match catalog default).`);
			}
		}
	})
];
//#endregion
export { mergeModelRefMapEntries as a, isLegacyModelsAddCodexMetadataModel as i, modelEntryWithRuntimePolicy as n, rewriteKnownModelRefs as o, collectBlockedLegacyOpenAICodexProviderPlan as r, rewriteModelRefs as s, LEGACY_CONFIG_MIGRATIONS_RUNTIME_MODELS as t };
