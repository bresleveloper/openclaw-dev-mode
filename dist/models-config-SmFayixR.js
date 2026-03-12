import { t as __exportAll } from "./rolldown-runtime-DUslC3ob.js";
import { d as isRecord } from "./utils-BzWe_IKB.js";
import { $l as resolveOpenClawAgentDir, Ks as projectConfigOntoRuntimeSourceSnapshot, T as resolveImplicitProviders, Tl as createConfigRuntimeEnv, Us as getRuntimeConfigSourceSnapshot, Ws as loadConfig, gt as isNonSecretApiKeyMarker, w as normalizeProviders } from "./model-selection-BRhJAUKb.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/agents/models-config.merge.ts
function isPositiveFiniteTokenLimit(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function resolvePreferredTokenLimit(params) {
	if (params.explicitPresent && isPositiveFiniteTokenLimit(params.explicitValue)) return params.explicitValue;
	if (isPositiveFiniteTokenLimit(params.implicitValue)) return params.implicitValue;
	return isPositiveFiniteTokenLimit(params.explicitValue) ? params.explicitValue : void 0;
}
function getProviderModelId(model) {
	if (!model || typeof model !== "object") return "";
	const id = model.id;
	return typeof id === "string" ? id.trim() : "";
}
function mergeProviderModels(implicit, explicit) {
	const implicitModels = Array.isArray(implicit.models) ? implicit.models : [];
	const explicitModels = Array.isArray(explicit.models) ? explicit.models : [];
	if (implicitModels.length === 0) return {
		...implicit,
		...explicit
	};
	const implicitById = new Map(implicitModels.map((model) => [getProviderModelId(model), model]).filter(([id]) => Boolean(id)));
	const seen = /* @__PURE__ */ new Set();
	const mergedModels = explicitModels.map((explicitModel) => {
		const id = getProviderModelId(explicitModel);
		if (!id) return explicitModel;
		seen.add(id);
		const implicitModel = implicitById.get(id);
		if (!implicitModel) return explicitModel;
		const contextWindow = resolvePreferredTokenLimit({
			explicitPresent: "contextWindow" in explicitModel,
			explicitValue: explicitModel.contextWindow,
			implicitValue: implicitModel.contextWindow
		});
		const maxTokens = resolvePreferredTokenLimit({
			explicitPresent: "maxTokens" in explicitModel,
			explicitValue: explicitModel.maxTokens,
			implicitValue: implicitModel.maxTokens
		});
		return {
			...explicitModel,
			input: implicitModel.input,
			reasoning: "reasoning" in explicitModel ? explicitModel.reasoning : implicitModel.reasoning,
			...contextWindow === void 0 ? {} : { contextWindow },
			...maxTokens === void 0 ? {} : { maxTokens }
		};
	});
	for (const implicitModel of implicitModels) {
		const id = getProviderModelId(implicitModel);
		if (!id || seen.has(id)) continue;
		seen.add(id);
		mergedModels.push(implicitModel);
	}
	return {
		...implicit,
		...explicit,
		models: mergedModels
	};
}
function mergeProviders(params) {
	const out = params.implicit ? { ...params.implicit } : {};
	for (const [key, explicit] of Object.entries(params.explicit ?? {})) {
		const providerKey = key.trim();
		if (!providerKey) continue;
		const implicit = out[providerKey];
		out[providerKey] = implicit ? mergeProviderModels(implicit, explicit) : explicit;
	}
	return out;
}
function resolveProviderApi(entry) {
	if (typeof entry?.api !== "string") return;
	return entry.api.trim() || void 0;
}
function resolveModelApiSurface(entry) {
	if (!Array.isArray(entry?.models)) return;
	const apis = entry.models.flatMap((model) => {
		if (!model || typeof model !== "object") return [];
		const api = model.api;
		return typeof api === "string" && api.trim() ? [api.trim()] : [];
	}).toSorted();
	return apis.length > 0 ? JSON.stringify(apis) : void 0;
}
function resolveProviderApiSurface(entry) {
	return resolveProviderApi(entry) ?? resolveModelApiSurface(entry);
}
function shouldPreserveExistingApiKey(params) {
	const { providerKey, existing, nextEntry, secretRefManagedProviders } = params;
	const nextApiKey = typeof nextEntry.apiKey === "string" ? nextEntry.apiKey : "";
	if (nextApiKey && isNonSecretApiKeyMarker(nextApiKey)) return false;
	return !secretRefManagedProviders.has(providerKey) && typeof existing.apiKey === "string" && existing.apiKey.length > 0 && !isNonSecretApiKeyMarker(existing.apiKey, { includeEnvVarName: false });
}
function shouldPreserveExistingBaseUrl(params) {
	const { providerKey, existing, nextEntry, explicitBaseUrlProviders } = params;
	if (explicitBaseUrlProviders.has(providerKey) || typeof existing.baseUrl !== "string" || existing.baseUrl.length === 0) return false;
	const existingApi = resolveProviderApiSurface(existing);
	const nextApi = resolveProviderApiSurface(nextEntry);
	return !existingApi || !nextApi || existingApi === nextApi;
}
function mergeWithExistingProviderSecrets(params) {
	const { nextProviders, existingProviders, secretRefManagedProviders, explicitBaseUrlProviders } = params;
	const mergedProviders = {};
	for (const [key, entry] of Object.entries(existingProviders)) mergedProviders[key] = entry;
	for (const [key, newEntry] of Object.entries(nextProviders)) {
		const existing = existingProviders[key];
		if (!existing) {
			mergedProviders[key] = newEntry;
			continue;
		}
		const preserved = {};
		if (shouldPreserveExistingApiKey({
			providerKey: key,
			existing,
			nextEntry: newEntry,
			secretRefManagedProviders
		})) preserved.apiKey = existing.apiKey;
		if (shouldPreserveExistingBaseUrl({
			providerKey: key,
			existing,
			nextEntry: newEntry,
			explicitBaseUrlProviders
		})) preserved.baseUrl = existing.baseUrl;
		mergedProviders[key] = {
			...newEntry,
			...preserved
		};
	}
	return mergedProviders;
}
//#endregion
//#region src/agents/models-config.plan.ts
async function resolveProvidersForModelsJson(params) {
	const { cfg, agentDir, env } = params;
	const explicitProviders = cfg.models?.providers ?? {};
	return mergeProviders({
		implicit: await resolveImplicitProviders({
			agentDir,
			config: cfg,
			env,
			explicitProviders
		}),
		explicit: explicitProviders
	});
}
function resolveExplicitBaseUrlProviders(providers) {
	return new Set(Object.entries(providers?.providers ?? {}).map(([key, provider]) => [key.trim(), provider]).filter(([key, provider]) => Boolean(key) && typeof provider?.baseUrl === "string" && provider.baseUrl.trim()).map(([key]) => key));
}
async function resolveProvidersForMode(params) {
	if (params.mode !== "merge") return params.providers;
	const existing = params.existingParsed;
	if (!isRecord(existing) || !isRecord(existing.providers)) return params.providers;
	const existingProviders = existing.providers;
	return mergeWithExistingProviderSecrets({
		nextProviders: params.providers,
		existingProviders,
		secretRefManagedProviders: params.secretRefManagedProviders,
		explicitBaseUrlProviders: params.explicitBaseUrlProviders
	});
}
async function planOpenClawModelsJson(params) {
	const { cfg, agentDir, env } = params;
	const providers = await resolveProvidersForModelsJson({
		cfg,
		agentDir,
		env
	});
	if (Object.keys(providers).length === 0) return { action: "skip" };
	const mode = cfg.models?.mode ?? "merge";
	const secretRefManagedProviders = /* @__PURE__ */ new Set();
	const normalizedProviders = normalizeProviders({
		providers,
		agentDir,
		env,
		secretDefaults: cfg.secrets?.defaults,
		secretRefManagedProviders
	}) ?? providers;
	const mergedProviders = await resolveProvidersForMode({
		mode,
		existingParsed: params.existingParsed,
		providers: normalizedProviders,
		secretRefManagedProviders,
		explicitBaseUrlProviders: resolveExplicitBaseUrlProviders(cfg.models)
	});
	const nextContents = `${JSON.stringify({ providers: mergedProviders }, null, 2)}\n`;
	if (params.existingRaw === nextContents) return { action: "noop" };
	return {
		action: "write",
		contents: nextContents
	};
}
//#endregion
//#region src/agents/models-config.ts
var models_config_exports = /* @__PURE__ */ __exportAll({ ensureOpenClawModelsJson: () => ensureOpenClawModelsJson });
const MODELS_JSON_WRITE_LOCKS = /* @__PURE__ */ new Map();
async function readExistingModelsFile(pathname) {
	try {
		const raw = await fs.readFile(pathname, "utf8");
		return {
			raw,
			parsed: JSON.parse(raw)
		};
	} catch {
		return {
			raw: "",
			parsed: null
		};
	}
}
async function ensureModelsFileMode(pathname) {
	await fs.chmod(pathname, 384).catch(() => {});
}
async function writeModelsFileAtomic(targetPath, contents) {
	const tempPath = `${targetPath}.${process.pid}.${Date.now()}.tmp`;
	await fs.writeFile(tempPath, contents, { mode: 384 });
	await fs.rename(tempPath, targetPath);
}
function resolveModelsConfigInput(config) {
	const runtimeSource = getRuntimeConfigSourceSnapshot();
	if (!config) return runtimeSource ?? loadConfig();
	if (!runtimeSource) return config;
	return projectConfigOntoRuntimeSourceSnapshot(config);
}
async function withModelsJsonWriteLock(targetPath, run) {
	const prior = MODELS_JSON_WRITE_LOCKS.get(targetPath) ?? Promise.resolve();
	let release = () => {};
	const gate = new Promise((resolve) => {
		release = resolve;
	});
	const pending = prior.then(() => gate);
	MODELS_JSON_WRITE_LOCKS.set(targetPath, pending);
	try {
		await prior;
		return await run();
	} finally {
		release();
		if (MODELS_JSON_WRITE_LOCKS.get(targetPath) === pending) MODELS_JSON_WRITE_LOCKS.delete(targetPath);
	}
}
async function ensureOpenClawModelsJson(config, agentDirOverride) {
	const cfg = resolveModelsConfigInput(config);
	const agentDir = agentDirOverride?.trim() ? agentDirOverride.trim() : resolveOpenClawAgentDir();
	const targetPath = path.join(agentDir, "models.json");
	return await withModelsJsonWriteLock(targetPath, async () => {
		const env = createConfigRuntimeEnv(cfg);
		const existingModelsFile = await readExistingModelsFile(targetPath);
		const plan = await planOpenClawModelsJson({
			cfg,
			agentDir,
			env,
			existingRaw: existingModelsFile.raw,
			existingParsed: existingModelsFile.parsed
		});
		if (plan.action === "skip") return {
			agentDir,
			wrote: false
		};
		if (plan.action === "noop") {
			await ensureModelsFileMode(targetPath);
			return {
				agentDir,
				wrote: false
			};
		}
		await fs.mkdir(agentDir, {
			recursive: true,
			mode: 448
		});
		await writeModelsFileAtomic(targetPath, plan.contents);
		await ensureModelsFileMode(targetPath);
		return {
			agentDir,
			wrote: true
		};
	});
}
//#endregion
export { models_config_exports as n, ensureOpenClawModelsJson as t };
