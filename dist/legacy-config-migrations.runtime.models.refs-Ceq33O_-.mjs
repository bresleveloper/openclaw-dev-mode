import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { r as normalizeConfiguredProviderCatalogModelId } from "./provider-model-id-normalization-C-mafmHb.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-CeM8o97s.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
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
const RETIRED_OPUS_ALIASES = new Set("opus-4.5 opus-4.1 opus-4 opus-3".split(" "));
const RETIRED_SONNET_ALIASES = new Set("sonnet-4.5 sonnet-4.1 sonnet-4.0 sonnet-4 sonnet-3.7 sonnet-3.5 sonnet-3 haiku-3.5 haiku-3".split(" "));
function upgradeOldClaudeToken(token, separator, provider) {
	const normalized = normalizeLowercaseStringOrEmpty(token);
	if (!normalized) return null;
	const opusTarget = claudeTargetModelId("opus", separator, provider);
	const sonnetTarget = claudeTargetModelId("sonnet", separator, provider);
	if (/^claude-(?:opus-4[-.][67]|sonnet-4[-.]6|haiku-4[-.]5)/.test(normalized)) return null;
	const retiredClaude4 = /^claude-(opus|sonnet)-4(?:$|[-.][510](?:$|[-.:@])|-20\d{6})/.exec(normalized);
	if (retiredClaude4) return retiredClaude4[1] === "opus" ? opusTarget : sonnetTarget;
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
	if (Array.isArray(value)) return value.some((entry, index) => typeof entry === "string" && key && (MODEL_REF_ARRAY_KEYS.has(key) || path.endsWith(".modelPolicy.allow") || path.endsWith(".modelPolicy.deny")) ? Boolean(normalizeKnownModelRef(entry)) : scanKnownModelRefs(entry, void 0, `${path}.${index}`));
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
				changes.push(result.conflicts.length > 0 ? `Merged ${path}.${providerId}.models.${candidate.index} into model id ${JSON.stringify(row.normalizedId)}; kept existing values for conflicting fields: ${result.conflicts.toSorted().join(", ")}.` : `Merged ${path}.${providerId}.models.${candidate.index} into model id ${JSON.stringify(row.normalizedId)}.`);
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
			if (typeof entry === "string" && (MODEL_REF_ARRAY_KEYS.has(key) || path.endsWith(".modelPolicy.allow") || path.endsWith(".modelPolicy.deny"))) {
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
		const rewritten = normalize(ref, record);
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
export { rewriteModelRefs as a, rewriteKnownModelRefs as i, hasOwnDefinedProperty as n, scanKnownModelRefs as o, mergeModelRefMapEntries as r, setRecordEntry as s, MODEL_REF_CANONICALIZATION_MESSAGE as t };
