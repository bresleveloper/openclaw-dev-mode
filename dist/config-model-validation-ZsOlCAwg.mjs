import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { D as listAgentEntriesWithSource, E as listAgentEntries, S as tryResolveLegacyCompatibilityAgentId, T as hasAgentRosterProperty } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as formatConcreteConfigPath } from "./dot-path-BSC76DAI.mjs";
import { X as resolveConfigEnvVars, Y as containsEnvVarReference } from "./redact-B5EGyLvV.mjs";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-zIYbDm7V.mjs";
import { r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { h as resolveConfiguredModelRef, i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { c as resolveAgentExplicitModelPrimary, u as resolveAgentModelFallbacksOverride } from "./agent-scope-CTuYDtny.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
//#region src/cli/config-model-validation.ts
function isPathPrefix(prefix, path) {
	return prefix.length <= path.length && prefix.every((segment, index) => path[index] === segment);
}
function pathMayAffectTextModelRefs(path) {
	if (path[0] !== "agents" || path.length === 1) return path[0] === "agents";
	if (path[1] === "defaults") return path.length === 2 || path[2] === "model";
	return path[1] === "entries" || path[1] === "list";
}
function collectTextModelConfigRefs(params) {
	if (typeof params.model === "string") {
		const value = params.model.trim();
		return [{
			path: params.path,
			value,
			...params.agentId ? { agentId: params.agentId } : {},
			fallback: false
		}];
	}
	if (!params.model || typeof params.model !== "object" || Array.isArray(params.model)) return [];
	const model = params.model;
	const refs = [];
	if (typeof model.primary === "string") {
		const value = model.primary.trim();
		refs.push({
			path: `${params.path}.primary`,
			value,
			...params.agentId ? { agentId: params.agentId } : {},
			fallback: false
		});
	}
	if (Array.isArray(model.fallbacks)) for (const [index, fallback] of model.fallbacks.entries()) {
		if (typeof fallback !== "string") continue;
		refs.push({
			path: `${params.path}.fallbacks.${index}`,
			value: fallback.trim(),
			...params.agentId ? { agentId: params.agentId } : {},
			fallback: true
		});
	}
	return refs;
}
function collectTextModelRefs(config) {
	const refs = collectTextModelConfigRefs({
		model: config.agents?.defaults?.model,
		path: "agents.defaults.model"
	});
	for (const { entry: agent, source } of listAgentEntriesWithSource(config)) {
		const agentId = agent.id;
		const agentPath = source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list.${source.index}`;
		refs.push(...collectTextModelConfigRefs({
			model: agent.model,
			path: `${agentPath}.model`,
			agentId
		}));
	}
	for (const ref of refs) {
		if (ref.fallback) continue;
		const authProfileId = splitTrailingAuthProfile(ref.value).profile;
		if (authProfileId) ref.authProfileId = authProfileId;
	}
	return refs;
}
function modelRefComparisonKey(ref) {
	if (ref.agentId) {
		const modelOffset = ref.path.indexOf(".model");
		const relativePath = modelOffset >= 0 ? ref.path.slice(modelOffset + 1) : ref.path;
		return `agent:${normalizeAgentId(ref.agentId)}:${relativePath}`;
	}
	return `path:${ref.path}`;
}
function collectTouchedTextModelRefs(params) {
	const listedAgentEntries = listAgentEntriesWithSource(params.config);
	const defaultPrimaryPath = [
		"agents",
		"defaults",
		"model",
		"primary"
	];
	const defaultPrimaryTouched = params.touchedPaths.some((touchedPath) => isPathPrefix(touchedPath, defaultPrimaryPath) || isPathPrefix(defaultPrimaryPath, touchedPath));
	const refs = collectTextModelRefs(params.config);
	const previousRefs = params.previousConfig ? collectTextModelRefs(params.previousConfig) : void 0;
	const previousRefsByIdentity = previousRefs ? new Map(previousRefs.map((ref) => [modelRefComparisonKey(ref), ref])) : void 0;
	const previousDefaultAgentId = params.previousConfig ? tryResolveLegacyCompatibilityAgentId(params.previousConfig) : void 0;
	const defaultPrimaryProviderChanged = defaultPrimaryTouched && (!previousRefs || previousDefaultAgentId === void 0 || resolveDefaultModelForAgent({ cfg: params.config }).provider !== resolveDefaultModelForAgent({
		cfg: params.previousConfig,
		agentId: previousDefaultAgentId
	}).provider);
	const touchedRefs = refs.filter((ref) => {
		if (ref.fallback && defaultPrimaryProviderChanged) {
			const previousRef = previousRefsByIdentity?.get(modelRefComparisonKey(ref));
			const nextResolved = resolveCanonicalFallbackRef(params.config, ref.value);
			const previousResolved = params.previousConfig && previousRef ? resolveCanonicalFallbackRef(params.previousConfig, previousRef.value) : void 0;
			if (!nextResolved || !previousResolved || nextResolved.provider !== previousResolved.provider || nextResolved.model !== previousResolved.model) {
				ref.dependency = true;
				return true;
			}
		}
		const refPath = ref.path.split(".");
		const touched = params.touchedPaths.some((touchedPath) => isPathPrefix(touchedPath, refPath) || isPathPrefix(refPath, touchedPath));
		if (!touched || !previousRefsByIdentity) return touched;
		const previousRef = previousRefsByIdentity.get(modelRefComparisonKey(ref));
		const ownerChanged = previousRef?.agentId !== ref.agentId;
		if (ownerChanged) ref.dependency = true;
		return previousRef?.value !== ref.value || ownerChanged;
	});
	const defaultRefs = refs.filter((ref) => ref.agentId === void 0);
	if (defaultRefs.length === 0) return touchedRefs;
	for (const { entry, source } of listedAgentEntries) {
		const agentId = entry.id;
		const agentEntryPath = [
			"agents",
			source.kind,
			source.kind === "entries" ? source.key : String(source.index)
		];
		const agentModelPath = [...agentEntryPath, "model"];
		if (!params.touchedPaths.some((touchedPath) => isPathPrefix(touchedPath, agentEntryPath) || isPathPrefix(agentEntryPath, touchedPath) || isPathPrefix(touchedPath, agentModelPath) || isPathPrefix(agentModelPath, touchedPath))) continue;
		for (const defaultRef of defaultRefs) {
			const inherits = defaultRef.fallback ? resolveAgentModelFallbacksOverride(params.config, agentId) === void 0 : resolveAgentExplicitModelPrimary(params.config, agentId) === void 0;
			const previouslyInherited = (params.previousConfig ? listAgentEntries(params.previousConfig) : []).some((previousEntry) => normalizeAgentId(previousEntry.id) === normalizeAgentId(agentId)) && params.previousConfig ? defaultRef.fallback ? resolveAgentModelFallbacksOverride(params.previousConfig, agentId) === void 0 : resolveAgentExplicitModelPrimary(params.previousConfig, agentId) === void 0 : false;
			if (inherits && !previouslyInherited) touchedRefs.push({
				...defaultRef,
				agentId,
				dependency: true
			});
		}
	}
	return touchedRefs;
}
function resolveCanonicalPrimaryRef(config, value, manifestPlugins, agentId) {
	const validationConfig = {
		...config,
		agents: {
			...config.agents,
			defaults: {
				...config.agents?.defaults,
				model: value
			}
		}
	};
	const resolved = resolveConfiguredModelRef({
		cfg: validationConfig,
		agentId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: "",
		allowPluginNormalization: true,
		manifestPlugins
	});
	return resolved.model ? resolved : void 0;
}
function resolveFallbackRef(config, value, manifestPlugins, agentId) {
	const defaultProvider = resolveDefaultModelForAgent({
		cfg: config,
		agentId,
		manifestPlugins
	}).provider;
	return resolveModelRefFromString({
		cfg: config,
		agentId,
		raw: value,
		defaultProvider,
		aliasIndex: buildModelAliasIndex({
			cfg: config,
			agentId,
			defaultProvider,
			allowPluginNormalization: true,
			manifestPlugins
		}),
		allowPluginNormalization: true,
		manifestPlugins
	});
}
function resolveCanonicalFallbackRef(config, value, manifestPlugins, agentId) {
	return resolveFallbackRef(config, value, manifestPlugins, agentId)?.ref;
}
function resolveCanonicalModelRef(config, ref, manifestPlugins) {
	const agentId = ref.agentId ?? tryResolveLegacyCompatibilityAgentId(config);
	return (ref.fallback ? resolveCanonicalFallbackRef : resolveCanonicalPrimaryRef)(config, ref.value, manifestPlugins, agentId);
}
function scopedModelRefComparisonKey(config, ref) {
	return modelRefComparisonKey({
		...ref,
		agentId: ref.agentId ?? tryResolveLegacyCompatibilityAgentId(config)
	});
}
function hasUnresolvedInheritedFallbackProvider(config, ref, unresolvedPaths) {
	if (!ref.fallback || ref.value.includes("/")) return false;
	const agentId = ref.agentId ?? tryResolveLegacyCompatibilityAgentId(config);
	const primaries = collectTextModelRefs(config).filter((candidate) => !candidate.fallback);
	const primaryRef = primaries.find((candidate) => candidate.agentId === agentId) ?? primaries.find((candidate) => candidate.agentId === void 0);
	if (!primaryRef || !unresolvedPaths.has(formatConcreteConfigPath(primaryRef.path.split("."), config))) return false;
	const primaryModel = splitTrailingAuthProfile(primaryRef.value).model;
	const slash = primaryModel.indexOf("/");
	const provider = slash > 0 ? primaryModel.slice(0, slash) : primaryModel;
	const fallback = resolveFallbackRef(config, ref.value, void 0, agentId);
	return Boolean(fallback && !fallback.alias && containsEnvVarReference(provider));
}
function expandInheritedDefaultRefs(config, refs) {
	const agentEntries = listAgentEntries(config);
	const defaultAgentId = tryResolveLegacyCompatibilityAgentId(config);
	const expanded = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (ref) => {
		const key = `${ref.path}\u0000${ref.agentId ?? ""}`;
		if (!seen.has(key)) {
			seen.add(key);
			expanded.push(ref);
		}
	};
	for (const ref of refs) {
		if (ref.agentId !== void 0) {
			push(ref);
			continue;
		}
		if (defaultAgentId) {
			if (!agentEntries.some((entry) => normalizeAgentId(entry.id) === normalizeAgentId(defaultAgentId)) || (ref.fallback ? resolveAgentModelFallbacksOverride(config, defaultAgentId) === void 0 : resolveAgentExplicitModelPrimary(config, defaultAgentId) === void 0)) push(ref);
		}
		for (const { id: agentId } of agentEntries) {
			if (defaultAgentId && normalizeAgentId(agentId) === normalizeAgentId(defaultAgentId)) continue;
			if (ref.fallback ? resolveAgentModelFallbacksOverride(config, agentId) === void 0 : resolveAgentExplicitModelPrimary(config, agentId) === void 0) push({
				...ref,
				agentId
			});
		}
	}
	return expanded;
}
function validateModelRefSyntax(config, ref, unresolvedPaths) {
	if (!ref.value) return "Model reference is empty";
	const configPath = formatConcreteConfigPath(ref.path.split("."), config);
	if (unresolvedPaths.has(configPath)) return "Model reference contains an unresolved environment variable";
	return resolveCanonicalModelRef(config, ref) ? void 0 : "Invalid model reference or configured model alias target";
}
async function createRuntimeModelRefResolver() {
	const [agentScope, modelSelection] = await Promise.all([import("./agent-scope-C4CYkKyC.mjs"), import("./model-selection-ElLkT79C.mjs")]);
	let modelModules;
	const loadModelModules = () => modelModules ??= Promise.all([import("./model-CTa9xNDP.mjs"), import("./prepared-model-runtime-DRzc5Txw.mjs")]);
	return async ({ config, ref }) => {
		try {
			var _usingCtx$1 = _usingCtx();
			let resolvedRef = resolveCanonicalModelRef(config, ref);
			if (!resolvedRef) return `Unknown model: ${ref.value}`;
			if (modelSelection.isCliProvider(resolvedRef.provider, config)) return;
			const targetAgentId = ref.agentId ?? agentScope.tryResolveLegacyCompatibilityAgentId(config) ?? agentScope.resolveDefaultAgentId(config);
			const agentDir = agentScope.resolveAgentDir(config, targetAgentId);
			const workspaceDir = agentScope.resolveAgentWorkspaceDir(config, targetAgentId);
			const [modelRuntime, preparedRuntime] = await loadModelModules();
			const lease = _usingCtx$1.a(await preparedRuntime.acquireReadOnlyPreparedModelRuntime({
				agentId: targetAgentId,
				agentDir,
				config,
				workspaceDir,
				loadRuntimePlugins: true
			}, { deriveRuntimePluginSelections: ({ config: admittedConfig, metadataSnapshot }) => {
				resolvedRef = resolveCanonicalModelRef(admittedConfig, ref, metadataSnapshot);
				if (!resolvedRef) return [];
				const { provider, model } = resolvedRef;
				return [{
					provider,
					modelId: model,
					agentId: targetAgentId
				}];
			} }));
			if (!resolvedRef) return `Unknown model: ${ref.value}`;
			const { provider, model } = resolvedRef;
			const stores = lease.snapshot.createStores();
			const resolution = await modelRuntime.resolveModelAsync(provider, model, agentDir, config, {
				...stores,
				modelIdSource: "selected",
				agentId: targetAgentId,
				allowBundledStaticCatalogFallback: true,
				...ref.authProfileId ? { authProfileId: ref.authProfileId } : {},
				preparedModelRuntime: lease.snapshot,
				workspaceDir
			});
			return resolution.model ? void 0 : resolution.error ?? `Unknown model: ${provider}/${model}`;
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	};
}
function formatModelRefError(ref, error, authoredValue = ref.value, options) {
	const safeError = options?.suppressDetail || authoredValue !== ref.value ? "Unable to resolve authored model reference" : error;
	const detail = safeError.endsWith(".") ? safeError : `${safeError}.`;
	return `Cannot set model reference "${authoredValue}" at ${ref.path}: ${detail} Run ${formatCliCommand("openclaw models list")} to list available models.`;
}
async function checkTouchedTextModelRefs(params) {
	const touchedPaths = params.touchedPaths;
	const modelDependenciesTouched = touchedPaths.some((path) => path[0] === "env" || path[0] === "agents" && (path.length === 1 || path[1] === "defaults" && (path.length === 2 || path[2] === "models" || path[2] === "model" && (path.length === 3 || path[3] === "primary")) || (path[1] === "entries" || path[1] === "list") && (path.length <= 3 || path[3] === "models" || path[3] === "model" && (path.length === 4 || path[4] === "primary"))));
	if (!modelDependenciesTouched && !touchedPaths.some(pathMayAffectTextModelRefs)) return {
		refsChecked: 0,
		refsTotal: 0,
		errors: []
	};
	const config = hasAgentRosterProperty(params.config) ? params.config : migratePersistedImplicitMainRoster(params.config).config;
	const previousConfig = params.previousConfig && !hasAgentRosterProperty(params.previousConfig) ? migratePersistedImplicitMainRoster(params.previousConfig).config : params.previousConfig;
	const authoredRefs = collectTouchedTextModelRefs({
		...params,
		config,
		previousConfig,
		touchedPaths
	});
	const authoredValuesByPath = new Map(collectTextModelRefs(params.config).map((ref) => [ref.path, ref.value]));
	const previousAuthoredValuesByPath = new Map(collectTextModelRefs(params.previousConfig ?? {}).map((ref) => [ref.path, ref.value]));
	let validationConfig;
	let validationPreviousConfig;
	const unresolvedPaths = /* @__PURE__ */ new Set();
	try {
		const env = params.env ?? process.env;
		validationConfig = resolveConfigEnvVars(params.config, env, { onMissing: ({ configPath }) => unresolvedPaths.add(configPath) });
		validationPreviousConfig = params.previousConfig ? resolveConfigEnvVars(params.previousConfig, params.previousEnv ?? env, { onMissing: () => {} }) : void 0;
	} catch (cause) {
		const detail = cause instanceof Error ? cause.message : String(cause);
		return {
			refsChecked: 0,
			refsTotal: authoredRefs.length,
			errors: [`Unable to validate changed model references before writing: ${detail}`]
		};
	}
	const validationRefsByPath = new Map(collectTextModelRefs(validationConfig).map((ref) => [ref.path, ref]));
	const modelEnvWasExpanded = [...authoredValuesByPath].some(([path, value]) => validationRefsByPath.get(path)?.value !== value);
	const formatError = (ref, error) => {
		const redactDependency = Boolean(params.redactDependencyValues && ref.dependency);
		return formatModelRefError(ref, error, redactDependency ? "<configured model reference>" : authoredValuesByPath.get(ref.path), { suppressDetail: modelEnvWasExpanded || redactDependency });
	};
	const validationRosterConfig = hasAgentRosterProperty(validationConfig) ? validationConfig : migratePersistedImplicitMainRoster(validationConfig).config;
	const validationPreviousRosterConfig = validationPreviousConfig && !hasAgentRosterProperty(validationPreviousConfig) ? migratePersistedImplicitMainRoster(validationPreviousConfig).config : validationPreviousConfig;
	const refsByKey = new Map(collectTouchedTextModelRefs({
		config: validationRosterConfig,
		previousConfig: validationPreviousRosterConfig,
		touchedPaths
	}).map((ref) => [modelRefComparisonKey(ref), ref]));
	for (const authoredRef of authoredRefs) {
		if (authoredRef.dependency && previousAuthoredValuesByPath.get(authoredRef.path) === authoredRef.value) continue;
		const validationRef = validationRefsByPath.get(authoredRef.path);
		if (!validationRef) continue;
		const key = modelRefComparisonKey(validationRef);
		const expandedRef = refsByKey.get(key);
		refsByKey.set(key, {
			...validationRef,
			...authoredRef.dependency || expandedRef?.dependency ? { dependency: true } : {}
		});
	}
	const refsByOwner = new Map(expandInheritedDefaultRefs(validationRosterConfig, [...refsByKey.values()]).map((ref) => [scopedModelRefComparisonKey(validationRosterConfig, ref), ref]));
	if (modelDependenciesTouched && validationPreviousRosterConfig) {
		const previousRefsByOwner = new Map(validationPreviousRosterConfig ? expandInheritedDefaultRefs(validationPreviousRosterConfig, collectTextModelRefs(validationPreviousRosterConfig)).map((ref) => [scopedModelRefComparisonKey(validationPreviousRosterConfig, ref), ref]) : []);
		for (const ref of expandInheritedDefaultRefs(validationRosterConfig, collectTextModelRefs(validationRosterConfig))) {
			const key = scopedModelRefComparisonKey(validationRosterConfig, ref);
			if (refsByOwner.has(key)) continue;
			const previousRef = previousRefsByOwner.get(key);
			const previousResolved = previousRef && validationPreviousRosterConfig ? resolveCanonicalModelRef(validationPreviousRosterConfig, previousRef) : void 0;
			const nextResolved = resolveCanonicalModelRef(validationRosterConfig, ref);
			if (previousRef?.value !== ref.value || previousResolved?.provider !== nextResolved?.provider || previousResolved?.model !== nextResolved?.model) refsByOwner.set(key, {
				...ref,
				dependency: true
			});
		}
	}
	const refs = [...refsByOwner.values()];
	if (refs.length === 0) return {
		refsChecked: 0,
		refsTotal: 0,
		errors: []
	};
	const validatedRefs = refs.filter((ref) => !hasUnresolvedInheritedFallbackProvider(config, ref, unresolvedPaths)).map((ref) => ({
		ref,
		error: validateModelRefSyntax(validationConfig, ref, unresolvedPaths)
	}));
	const syntaxFailures = validatedRefs.filter((entry) => Boolean(entry.error));
	const refsToResolve = validatedRefs.filter((entry) => !entry.error).map((entry) => entry.ref);
	const errors = syntaxFailures.map(({ ref, error }) => formatError(ref, error));
	if (refsToResolve.length === 0) return {
		refsChecked: syntaxFailures.length,
		refsTotal: refs.length,
		errors
	};
	let resolveModelRef = params.resolveModelRef;
	if (!resolveModelRef) try {
		resolveModelRef = await (params.createModelRefResolver ?? createRuntimeModelRefResolver)();
	} catch (cause) {
		const detail = modelEnvWasExpanded || Boolean(params.redactDependencyValues && refs.some((ref) => ref.dependency)) ? "model resolver setup failed" : cause instanceof Error ? cause.message : String(cause);
		return {
			refsChecked: syntaxFailures.length,
			refsTotal: refs.length,
			errors: [...errors, `Unable to validate changed model references before writing: ${detail}`]
		};
	}
	let refsChecked = syntaxFailures.length;
	for (const ref of refsToResolve) {
		let error;
		try {
			error = await resolveModelRef({
				config: validationConfig,
				ref
			});
			refsChecked += 1;
		} catch (cause) {
			const detail = cause instanceof Error ? cause.message : String(cause);
			errors.push(formatError(ref, `Unable to validate model reference: ${detail}`));
			continue;
		}
		if (!error) continue;
		errors.push(formatError(ref, error));
	}
	return {
		refsChecked,
		refsTotal: refs.length,
		errors
	};
}
//#endregion
export { checkTouchedTextModelRefs };
