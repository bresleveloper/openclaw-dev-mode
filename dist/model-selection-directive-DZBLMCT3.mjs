import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./model-ref-shared-KBg0y299.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { v as resolveModelRefFromString } from "./model-selection-shared-BZeDVoch.mjs";
import { t as levenshteinDistance } from "./levenshtein-distance-GS14DlgJ.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-C9Xz8Ynt.mjs";
//#region src/auto-reply/reply/model-selection-directive.ts
function formatNotAllowedError(params) {
	const rawRuntime = params.rawRuntime?.trim();
	const retryCommand = rawRuntime ? `/model ${params.modelRef} --runtime ${rawRuntime}` : `/model ${params.modelRef}`;
	const lines = [
		`Model "${params.modelRef}" is not allowed. Use /models to list providers, or /models <provider> to list models.`,
		`Add "${params.modelRef}" or its provider wildcard to ${params.policyPath}.`,
		`Then retry: ${retryCommand}`
	];
	if (rawRuntime && normalizeProviderId(rawRuntime) === "codex") lines.push("If the Codex runtime is missing, run: openclaw plugins enable codex");
	return lines.join("\n");
}
const FUZZY_VARIANT_TOKENS = [
	"lightning",
	"preview",
	"mini",
	"fast",
	"turbo",
	"lite",
	"beta",
	"small",
	"nano"
];
function scoreFuzzyMatch(params) {
	const provider = normalizeProviderId(params.provider);
	const model = params.model;
	const fragment = normalizeLowercaseStringOrEmpty(params.fragment);
	const providerLower = normalizeLowercaseStringOrEmpty(provider);
	const modelLower = normalizeLowercaseStringOrEmpty(model);
	const haystack = `${providerLower}/${modelLower}`;
	const key = modelKey(provider, model);
	const scoreFragment = (value, exact, starts, includes) => {
		if (!fragment) return 0;
		if (value === fragment) return exact;
		if (value.startsWith(fragment)) return starts;
		return value.includes(fragment) ? includes : 0;
	};
	let score = scoreFragment(haystack, 220, 140, 110) + scoreFragment(providerLower, 180, 120, 90) + scoreFragment(modelLower, 160, 110, 80);
	const distModel = levenshteinDistance(fragment, modelLower, 3);
	if (distModel != null) score += (3 - distModel) * 70;
	const aliases = params.aliasIndex.byKey.get(key) ?? [];
	for (const alias of aliases) score += scoreFragment(normalizeLowercaseStringOrEmpty(alias), 140, 90, 60);
	if (modelLower.startsWith(providerLower)) score += 30;
	const fragmentVariants = FUZZY_VARIANT_TOKENS.filter((token) => fragment.includes(token));
	const modelVariants = FUZZY_VARIANT_TOKENS.filter((token) => modelLower.includes(token));
	const variantMatchCount = fragmentVariants.filter((token) => modelLower.includes(token)).length;
	const variantCount = modelVariants.length;
	if (fragmentVariants.length === 0 && variantCount > 0) score -= variantCount * 30;
	else if (fragmentVariants.length > 0) score += variantMatchCount > 0 ? variantMatchCount * 40 : -20;
	const isDefault = provider === normalizeProviderId(params.defaultProvider) && model === params.defaultModel;
	if (isDefault) score += 20;
	return {
		provider: params.provider,
		model,
		score,
		isDefault,
		variantCount,
		variantMatchCount,
		modelLength: modelLower.length,
		key
	};
}
/** Resolves a `/model` directive under the effective model policy. */
function resolveModelDirectiveSelection(params) {
	const { raw, defaultProvider, defaultModel, aliasIndex, allowedModelKeys } = params;
	const policy = params.modelPolicy ?? createModelVisibilityPolicy({
		cfg: params.cfg ?? {},
		catalog: [],
		defaultProvider,
		defaultModel: {
			provider: defaultProvider,
			model: defaultModel
		},
		agentId: params.agentId
	});
	const rawTrimmed = raw.trim();
	const rawLower = normalizeLowercaseStringOrEmpty(rawTrimmed);
	const allows = (ref) => policy.allows(ref) && (params.operatorModelPolicy?.allows(ref) ?? true);
	const buildSelection = (provider, model) => {
		const alias = aliasIndex.byKey.get(modelKey(provider, model))?.[0];
		return {
			provider,
			model,
			isDefault: provider === defaultProvider && model === defaultModel,
			...alias ? { alias } : void 0
		};
	};
	const resolveFuzzy = (paramsLocal) => {
		const fragment = normalizeLowercaseStringOrEmpty(paramsLocal.fragment);
		if (!fragment) return;
		const providerFilter = paramsLocal.provider ? normalizeProviderId(paramsLocal.provider) : void 0;
		const candidates = [];
		for (const key of allowedModelKeys) {
			const slash = key.indexOf("/");
			if (slash <= 0) continue;
			const provider = normalizeProviderId(key.slice(0, slash));
			const model = key.slice(slash + 1);
			if (model.endsWith("*") || !allows({
				provider,
				model
			})) continue;
			if (providerFilter && provider !== providerFilter) continue;
			candidates.push({
				provider,
				model
			});
		}
		if (!paramsLocal.provider) for (const [aliasKey, entry] of aliasIndex.byAlias.entries()) {
			if (!aliasKey.includes(fragment) || !allows(entry.ref)) continue;
			if (!candidates.some((c) => c.provider === entry.ref.provider && c.model === entry.ref.model)) candidates.push({
				provider: entry.ref.provider,
				model: entry.ref.model
			});
		}
		const bestScored = candidates.map((candidate) => scoreFuzzyMatch({
			...candidate,
			fragment,
			aliasIndex,
			defaultProvider,
			defaultModel
		})).toSorted((a, b) => b.score - a.score || Number(b.isDefault) - Number(a.isDefault) || b.variantMatchCount - a.variantMatchCount || a.variantCount - b.variantCount || a.modelLength - b.modelLength || a.key.localeCompare(b.key))[0];
		const minScore = providerFilter ? 90 : 120;
		return bestScored && bestScored.score >= minScore ? buildSelection(bestScored.provider, bestScored.model) : void 0;
	};
	const resolved = resolveModelRefFromString({
		cfg: params.cfg,
		agentId: params.agentId,
		raw: rawTrimmed,
		defaultProvider,
		aliasIndex
	});
	if (!resolved) {
		const fuzzy = resolveFuzzy({ fragment: rawTrimmed });
		if (fuzzy) return { selection: fuzzy };
		return { error: `Unrecognized model "${rawTrimmed}". Use /models to list providers, or /models <provider> to list models.` };
	}
	const resolvedKey = modelKey(resolved.ref.provider, resolved.ref.model);
	if (params.operatorModelPolicy && !params.operatorModelPolicy.allows(resolved.ref) && (rawLower.includes("/") || resolved.alias || allowedModelKeys.has(resolvedKey))) return { error: "Your operator role cannot use this model. Choose an allowed model or ask a gateway administrator to update your role's model policy." };
	const explicitSelection = { selection: {
		provider: resolved.ref.provider,
		model: resolved.ref.model,
		isDefault: resolved.ref.provider === defaultProvider && resolved.ref.model === defaultModel,
		...resolved.alias ? { alias: resolved.alias } : {}
	} };
	const permitted = allows(resolved.ref);
	if (permitted && (rawLower.includes("/") || resolved.alias || allowedModelKeys.has(resolvedKey))) return explicitSelection;
	if (rawLower.includes("/")) {
		const slash = rawTrimmed.indexOf("/");
		const fuzzy = resolveFuzzy({
			provider: normalizeProviderId(rawTrimmed.slice(0, slash).trim()),
			fragment: rawTrimmed.slice(slash + 1).trim()
		});
		if (fuzzy) return { selection: fuzzy };
	}
	const fuzzy = resolveFuzzy({ fragment: rawTrimmed });
	if (fuzzy) return { selection: fuzzy };
	if (permitted) return explicitSelection;
	return { error: formatNotAllowedError({
		modelRef: `${resolved.ref.provider}/${resolved.ref.model}`,
		policyPath: policy.allowRepairConfigPath,
		rawRuntime: params.rawRuntime
	}) };
}
//#endregion
export { resolveModelDirectiveSelection as t };
