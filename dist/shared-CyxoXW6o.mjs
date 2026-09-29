import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as resolveConfigIncludes } from "./includes-CaaCq-XN.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { O as listAgentIds, _ as resolveSoleAgentId, a as resolveAgentDir, d as resolveAmbientOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { y as resolveIncludeRoots } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { c as visibleWidth, s as truncateToVisibleWidth } from "./ansi-CWsy0bu4.mjs";
import { i as legacyModelKey } from "./model-ref-shared-BgRrSHjn.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { l as toAgentModelListLike, r as normalizeAgentModelRefForConfig, t as mergeAgentModelEntryForConfig } from "./model-input-DKxKaZGG.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as isRich$1, r as theme } from "./theme-DzaUZY4q.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { n as formatConfigIssueLines } from "./issue-format-BQNShMey.mjs";
import { a as restoreEnvVarRefs } from "./io.types-zuIBxyy5.mjs";
import { S as copyRuntimeConfigWriteApplication, c as readConfigFileSnapshot } from "./io.runtime-BN-rPaec.mjs";
import { a as transformConfigFile } from "./mutate-CDIHLSip.mjs";
import "./config-Ciq2mxdN.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { i as createModelCatalogProviderAliasCanonicalizer, n as inspectModelReference, r as canonicalizeModelCatalogProviderRef } from "./model-reference-validation-C35UFSy2.mjs";
//#region src/commands/models/list.format.ts
/** Formatting helpers for model-list terminal tables. */
const TRUNCATED_SUFFIX = "...";
/** Formats token counts as compact decimal-K labels. */
const formatTokenK = (value) => {
	if (!value || !Number.isFinite(value)) return "-";
	if (value < 1e3) return `${Math.round(value)}`;
	return `${Math.round(value / 1e3)}k`;
};
/** Enables rich formatting only for non-machine-readable output. */
const isRich = (opts) => isRich$1() && !opts?.json && !opts?.plain;
/** Pads a table cell to a fixed terminal visible width. */
const padTerminalCell = (value, size) => {
	const remaining = size - visibleWidth(value);
	return remaining > 0 ? `${value}${" ".repeat(remaining)}` : value;
};
/** Applies terminal color based on a model-list tag. */
const formatTag = (tag) => {
	if (tag === "default") return theme.success(tag);
	if (tag === "image") return theme.accentBright(tag);
	if (tag === "configured") return theme.accent(tag);
	if (tag === "missing") return theme.error(tag);
	if (tag.startsWith("fallback#") || tag.startsWith("img-fallback#")) return theme.warn(tag);
	if (tag.startsWith("alias:")) return theme.accentDim(tag);
	return theme.muted(tag);
};
/** Truncates model-list cells to terminal visible width with an ASCII ellipsis. */
const truncate = (value, max) => {
	const sanitized = sanitizeTerminalText(value);
	if (visibleWidth(sanitized) <= max) return sanitized;
	if (max <= 3) return truncateToVisibleWidth(sanitized, max);
	return `${truncateToVisibleWidth(sanitized, max - 3)}${TRUNCATED_SUFFIX}`;
};
//#endregion
//#region src/commands/models/shared.ts
/** Shared helpers for model commands that read or mutate model config. */
/** Rejects conflicting machine-readable output modes. */
function ensureFlagCompatibility(opts) {
	if (opts.json && opts.plain) throw new Error("Choose either --json or --plain, not both.");
}
/** Formats millisecond durations for model command output. */
const formatMs = (value) => {
	if (value === null || value === void 0) return "-";
	if (!Number.isFinite(value)) return "-";
	if (value < 1e3) return `${Math.round(value)}ms`;
	return `${Math.round(value / 100) / 10}s`;
};
/** Loads config from disk and throws a formatted error when validation fails. */
async function loadValidConfigSnapshotOrThrow() {
	const snapshot = await readConfigFileSnapshot();
	if (!snapshot.valid) {
		const issues = formatConfigIssueLines(snapshot.issues, "-").join("\n");
		throw new Error(`Invalid config at ${snapshot.path}\n${issues}`);
	}
	return snapshot;
}
/** Reads source config, applies a mutator, and writes only the source-form config. */
async function updateConfig(mutator, selectModelRefs, beforeCommit, writeOptions) {
	const explicitSetPaths = [];
	const result = await transformConfigFile({
		base: "source",
		writeOptions: copyRuntimeConfigWriteApplication(writeOptions, {
			...writeOptions,
			explicitSetPaths,
			beforeCommit
		}),
		transform: async (currentConfig, { snapshot }, { envSnapshotForRestore }) => {
			if (!snapshot.valid) {
				const issues = formatConfigIssueLines(snapshot.issues, "-").join("\n");
				throw new Error(`Invalid config at ${snapshot.path}\n${issues}`);
			}
			const sourceConfig = structuredClone(currentConfig);
			let authoredModels;
			const context = {
				runtimeConfig: snapshot.runtimeConfig,
				restoreSourceEntry: (from, to, entry) => {
					explicitSetPaths.push([
						"agents",
						"defaults",
						"models",
						to
					]);
					if (!authoredModels) {
						const authored = asNonArrayRecord(resolveConfigIncludes(snapshot.parsed, snapshot.path, void 0, { allowedRoots: resolveIncludeRoots(envSnapshotForRestore) }));
						const defaults = asNonArrayRecord(asNonArrayRecord(authored.agents).defaults);
						authoredModels = asNonArrayRecord(defaults.models);
					}
					return restoreEnvVarRefs(entry, authoredModels[from], envSnapshotForRestore);
				}
			};
			const mutate = () => {
				if (selectModelRefs) {
					const cfg = context.runtimeConfig;
					const canonicalizer = createModelCatalogProviderAliasCanonicalizer({ cfg });
					context.canonicalModelKeys = new Map(Object.keys(sourceConfig.agents?.defaults?.models ?? {}).map((key) => {
						const resolved = resolveModelRefFromString({
							cfg,
							raw: key,
							defaultProvider: DEFAULT_PROVIDER
						});
						const ref = resolved && canonicalizer.ref(resolved.ref);
						return [key, ref ? modelKey(ref.provider, ref.model) : void 0];
					}));
				}
				return mutator(sourceConfig, context);
			};
			const nextConfig = selectModelRefs ? await (await import("./model-selection.runtime.js")).withModelCommandProviderRuntime({
				runtimeConfig: context.runtimeConfig,
				selectModelRefs: () => selectModelRefs(sourceConfig, context)
			}, mutate) : await mutate();
			return {
				nextConfig,
				result: nextConfig
			};
		}
	});
	return expectDefined(result.result, "model config mutation result");
}
function resolveModelInput(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	return resolveModelRefFromString({
		cfg: params.cfg,
		raw: params.raw,
		defaultProvider: DEFAULT_PROVIDER,
		aliasIndex
	});
}
/** Resolves a CLI model reference through aliases and catalog provider aliases. */
function resolveModelTarget(params) {
	const resolved = resolveModelInput(params);
	if (!resolved) throw new Error(`Invalid model reference: ${params.raw}`);
	return canonicalizeModelCatalogProviderRef(resolved.ref, { cfg: params.cfg });
}
function resolveAuthoredModelAliasTarget(params) {
	const resolved = resolveModelInput(params);
	return resolved?.alias ? resolved.ref : void 0;
}
/** Resolves model reference strings to index-aligned canonical refs. */
function resolveModelRefsFromEntries(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	const canonicalizer = createModelCatalogProviderAliasCanonicalizer({ cfg: params.cfg });
	return params.entries.map((entry) => {
		const resolved = resolveModelRefFromString({
			cfg: params.cfg,
			raw: entry,
			defaultProvider: DEFAULT_PROVIDER,
			aliasIndex
		});
		return resolved ? canonicalizer.ref(resolved.ref) : void 0;
	});
}
/** Projects canonical model refs into index-aligned keys for config comparisons. */
function resolveModelKeysFromEntries(params) {
	return resolveModelRefsFromEntries(params).map((ref) => ref ? modelKey(ref.provider, ref.model) : void 0);
}
function resolveKnownAgentId(cfg, rawAgentId) {
	const agentId = normalizeAgentId(rawAgentId);
	if (!listAgentIds(cfg).includes(agentId)) throw new Error(`Unknown agent id "${rawAgentId}". Use "${formatCliCommand("openclaw agents list")}" to see configured agents.`);
	return agentId;
}
/** Resolves model-command scope and retains configured auth ownership through read overrides. */
function resolveModelsTargetAgent(cfg, rawAgentId, mode) {
	const requested = rawAgentId?.trim();
	if (rawAgentId !== void 0 && !requested) throw new Error("--agent must not be blank");
	const requestedAgentId = requested ? resolveKnownAgentId(cfg, requested) : void 0;
	const agentId = resolveKnownAgentId(cfg, mode.kind === "read" ? resolveAmbientOwnerAgentId(cfg, requestedAgentId, {
		surface: "model inspection",
		hint: "Pass --agent <id> or set agents.defaults.systemAgent.agentId."
	}) : requestedAgentId ?? resolveSoleAgentId(cfg, {
		surface: "the model command",
		hint: "Pass --agent <id>."
	}));
	const agentDirOverride = mode.kind === "read" ? mode.agentDirOverride : void 0;
	const agentDir = resolveAgentDir(cfg, agentId);
	return {
		agentId,
		agentDir: agentDirOverride ?? agentDir
	};
}
/** Upserts the canonical model entry and folds legacy key metadata into it. */
function upsertCanonicalModelConfigEntry(models, params, options = {}) {
	const key = modelKey(params.provider, params.model);
	const { canonicalModelKeys } = options;
	const sourceKeys = canonicalModelKeys ? Object.keys(models).filter((sourceKey) => canonicalModelKeys.get(sourceKey) === key) : [legacyModelKey(params.provider, params.model), `${params.provider}/${key}`];
	const legacyKeys = new Set(sourceKeys.filter((legacyKey) => typeof legacyKey === "string" && legacyKey.length > 0 && legacyKey !== key));
	let legacyEntry;
	for (const legacyKey of legacyKeys) {
		const entry = models[legacyKey];
		if (!entry) continue;
		legacyEntry = mergeAgentModelEntryForConfig(legacyEntry, options.restoreSourceEntry ? options.restoreSourceEntry(legacyKey, key, entry) : entry);
	}
	models[key] = mergeAgentModelEntryForConfig(legacyEntry, models[key] ?? {});
	for (const legacyKey of legacyKeys) delete models[legacyKey];
	return key;
}
/** Merges primary/fallback patches while normalizing refs for config storage. */
function mergePrimaryFallbackConfig(existing, patch) {
	const next = { ...existing && typeof existing === "object" ? existing : void 0 };
	if (patch.primary !== void 0) next.primary = normalizeAgentModelRefForConfig(patch.primary);
	if (patch.fallbacks !== void 0) next.fallbacks = patch.fallbacks.map((fallback) => normalizeAgentModelRefForConfig(fallback));
	else if (next.fallbacks !== void 0) next.fallbacks = next.fallbacks.map((fallback) => normalizeAgentModelRefForConfig(fallback));
	return next;
}
/** Applies a default text/image primary-model update and ensures the model entry exists. */
function applyDefaultModelPrimaryUpdate(params) {
	const resolved = params.resolvedTarget ?? resolveDefaultModelPrimaryTarget(params);
	const nextModels = { ...params.cfg.agents?.defaults?.models };
	const key = upsertCanonicalModelConfigEntry(nextModels, resolved, params.modelEntryMerge);
	const defaults = params.cfg.agents?.defaults ?? {};
	const existing = toAgentModelListLike(defaults[params.field]);
	return {
		...params.cfg,
		agents: {
			...params.cfg.agents,
			defaults: {
				...defaults,
				[params.field]: mergePrimaryFallbackConfig(existing, { primary: key }),
				models: nextModels
			}
		}
	};
}
function resolveDefaultModelPrimaryTarget(params) {
	return params.resolveCfg && params.resolveCfg !== params.cfg ? resolveAuthoredModelAliasTarget({
		raw: params.modelRaw,
		cfg: params.cfg
	}) ?? resolveModelTarget({
		raw: params.modelRaw,
		cfg: params.resolveCfg
	}) : resolveModelTarget({
		raw: params.modelRaw,
		cfg: params.cfg
	});
}
/** Validates and persists one default text/image model selection. */
async function updateDefaultModelPrimaryConfig(params) {
	let warning;
	return {
		updated: await updateConfig((cfg, context) => {
			const resolvedTarget = resolveDefaultModelPrimaryTarget({
				cfg,
				resolveCfg: context.runtimeConfig,
				modelRaw: params.modelRaw
			});
			const inspection = inspectModelReference({
				cfg: context.runtimeConfig,
				ref: resolvedTarget
			});
			if (inspection.status === "unknown-provider") throw new Error(`Unknown model provider "${inspection.provider}". Install a plugin that declares it or configure it under models.providers before selecting "${inspection.ref}". Config was not changed.`);
			if (inspection.status === "unknown-model") warning = `Warning: Model "${inspection.ref}" is not in the local model catalog for provider "${inspection.provider}". The provider is installed or configured, so the selection was saved; verify the model ID if it is not a newly released or self-hosted model.`;
			else if (inspection.status === "uncatalogued-provider") warning = `Note: Provider "${inspection.provider}" has no local model catalog, so "${inspection.ref}" could not be checked offline. The selection was saved.`;
			return applyDefaultModelPrimaryUpdate({
				cfg,
				resolveCfg: context.runtimeConfig,
				modelEntryMerge: context,
				modelRaw: params.modelRaw,
				field: params.field,
				resolvedTarget
			});
		}, (cfg, context) => [resolveDefaultModelPrimaryTarget({
			cfg,
			resolveCfg: context.runtimeConfig,
			modelRaw: params.modelRaw
		})]),
		...warning ? { warning } : {}
	};
}
/**
* Model key format: "provider/model"
*
* The model key is displayed in `/model status` and used to reference models.
* When using `/model <key>`, use the exact format shown (e.g., "openrouter/moonshotai/kimi-k2").
*
* For providers with hierarchical model IDs (e.g., OpenRouter), the model ID may include
* sub-providers (e.g., "moonshotai/kimi-k2"), resulting in a key like "openrouter/moonshotai/kimi-k2".
*/
//#endregion
export { truncate as _, mergePrimaryFallbackConfig as a, resolveModelTarget as c, updateDefaultModelPrimaryConfig as d, upsertCanonicalModelConfigEntry as f, padTerminalCell as g, isRich as h, loadValidConfigSnapshotOrThrow as i, resolveModelsTargetAgent as l, formatTokenK as m, ensureFlagCompatibility as n, resolveModelKeysFromEntries as o, formatTag as p, formatMs as r, resolveModelRefsFromEntries as s, applyDefaultModelPrimaryUpdate as t, updateConfig as u };
