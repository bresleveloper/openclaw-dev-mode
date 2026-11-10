import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as resolveConfigIncludes } from "./includes-rygJQufe.mjs";
import { x as resolveIncludeRoots } from "./paths-orClZ-2Z.mjs";
import { i as legacyModelKey } from "./model-ref-shared-BRJ3VRZV.mjs";
import { c as visibleWidth, s as truncateToVisibleWidth } from "./ansi-Xy3t0ZdY.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { a as resolveAgentDir, m as resolveAmbientOwnerAgentId, x as resolveSoleAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { n as formatConfigIssueLines } from "./issue-format-Cu1pIc3h.mjs";
import { l as toAgentModelListLike, r as normalizeAgentModelRefForConfig, t as mergeAgentModelEntryForConfig } from "./model-input-CeM8o97s.mjs";
import { i as DEFAULT_PROVIDER } from "./defaults-Bg930vxE.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { i as buildModelAliasIndex, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { n as restoreEnvVarRefs } from "./env-preserve-ZftHp-Ht.mjs";
import { S as copyRuntimeConfigWriteApplication, s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import { a as transformConfigFile } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { n as isRich$1, r as theme } from "./theme-DzaUZY4q.mjs";
import { n as inspectModelReference, r as createModelCatalogProviderAliasCanonicalizer } from "./model-reference-validation-C4QY64zV.mjs";
//#region src/commands/models/list.format.ts
const TRUNCATED_SUFFIX = "...";
const formatTokenK = (value) => {
	if (!value || !Number.isFinite(value)) return "-";
	if (value < 1e3) return `${Math.round(value)}`;
	return `${Math.round(value / 1e3)}k`;
};
const isRich = (opts) => isRich$1() && !opts?.json && !opts?.plain;
const padTerminalCell = (value, size) => {
	const remaining = size - visibleWidth(value);
	return remaining > 0 ? `${value}${" ".repeat(remaining)}` : value;
};
const formatTag = (tag) => {
	switch (tag) {
		case "default": return theme.success(tag);
		case "image": return theme.accentBright(tag);
		case "configured": return theme.accent(tag);
		case "missing": return theme.error(tag);
	}
	if (tag.startsWith("fallback#") || tag.startsWith("img-fallback#")) return theme.warn(tag);
	if (tag.startsWith("alias:")) return theme.accentDim(tag);
	return theme.muted(tag);
};
const truncate = (value, max) => {
	const sanitized = sanitizeTerminalText(value);
	if (visibleWidth(sanitized) <= max) return sanitized;
	if (max <= 3) return truncateToVisibleWidth(sanitized, max);
	return `${truncateToVisibleWidth(sanitized, max - 3)}${TRUNCATED_SUFFIX}`;
};
function groupByProvider(entries) {
	const groups = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const group = groups.get(entry.provider) ?? [];
		group.push(entry);
		groups.set(entry.provider, group);
	}
	return groups;
}
//#endregion
//#region src/commands/models/shared.ts
function ensureFlagCompatibility(opts) {
	if (opts.json && opts.plain) throw new Error("Choose either --json or --plain, not both.");
}
const formatMs = (value) => {
	if (value === null || value === void 0 || !Number.isFinite(value)) return "-";
	if (value < 1e3) return `${Math.round(value)}ms`;
	return `${Math.round(value / 100) / 10}s`;
};
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
			const mutate = (providerRegistryAvailable) => {
				context.providerRegistryAvailable = providerRegistryAvailable;
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
function resolveModelTarget(params) {
	const resolved = resolveModelInput(params);
	if (!resolved) throw new Error(`Invalid model reference: ${params.raw}`);
	return createModelCatalogProviderAliasCanonicalizer({ cfg: params.cfg }).ref(resolved.ref);
}
function resolveAuthoredModelAliasTarget(params) {
	const resolved = resolveModelInput(params);
	return resolved?.alias ? resolved.ref : void 0;
}
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
function mergePrimaryFallbackConfig(existing, patch) {
	const next = { ...existing };
	if (patch.primary !== void 0) next.primary = normalizeAgentModelRefForConfig(patch.primary);
	const fallbacks = patch.fallbacks ?? next.fallbacks;
	if (fallbacks !== void 0) next.fallbacks = fallbacks.map(normalizeAgentModelRefForConfig);
	return next;
}
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
/** Rejects a model selection whose provider no installed plugin or config declares. */
function requireKnownModelProvider(cfg, ref, providerRegistryAvailable) {
	const inspection = inspectModelReference({
		cfg,
		ref,
		providerRegistryAvailable
	});
	if (inspection.status === "unknown-provider") throw new Error(`Unknown model provider "${inspection.provider}". Install a plugin that declares it or configure it under models.providers before selecting "${inspection.ref}". Config was not changed.`);
	return {
		...inspection,
		warning: inspection.status === "unverified-provider" ? `Warning: Provider "${inspection.provider}" could not be verified because the plugin registry is unavailable or has no loaded providers. The selection was saved; verify it after restoring the plugin registry.` : void 0
	};
}
async function updateDefaultModelPrimaryConfig(params) {
	let warning;
	return {
		updated: await updateConfig((cfg, context) => {
			const resolvedTarget = resolveDefaultModelPrimaryTarget({
				cfg,
				resolveCfg: context.runtimeConfig,
				modelRaw: params.modelRaw
			});
			const inspection = requireKnownModelProvider(context.runtimeConfig, resolvedTarget, context.providerRegistryAvailable);
			warning = inspection.warning;
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
//#endregion
export { padTerminalCell as _, mergePrimaryFallbackConfig as a, resolveModelTarget as c, updateDefaultModelPrimaryConfig as d, upsertCanonicalModelConfigEntry as f, isRich as g, groupByProvider as h, loadValidConfigSnapshotOrThrow as i, resolveModelsTargetAgent as l, formatTokenK as m, ensureFlagCompatibility as n, requireKnownModelProvider as o, formatTag as p, formatMs as r, resolveModelRefsFromEntries as s, applyDefaultModelPrimaryUpdate as t, updateConfig as u, truncate as v };
