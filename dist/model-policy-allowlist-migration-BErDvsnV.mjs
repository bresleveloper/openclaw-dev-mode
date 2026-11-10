import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
//#region src/config/model-policy-ref.ts
const MODEL_POLICY_COMPAT_SELECTORS = /* @__PURE__ */ new Set(["openrouter:auto", "openrouter:free"]);
function hasValidSegments(segments, minimumLength) {
	return segments.length >= minimumLength && segments.every((segment) => segment.length > 0 && !segment.includes("*") && !/\s/u.test(segment) && !containsAsciiControlCharacter(segment));
}
/** Parse and canonicalize a segment-boundary model-policy prefix wildcard. */
function parseModelPolicyWildcardRef(raw) {
	const segments = raw.trim().split("/").map((segment) => segment.trim());
	if (segments.at(-1) !== "*" || !hasValidSegments(segments.slice(0, -1), 1)) return null;
	const provider = normalizeProviderId(segments[0] ?? "");
	if (!provider) return null;
	return {
		key: [provider, ...segments.slice(1)].join("/"),
		provider
	};
}
/** Role-only model prefixes do not widen the segment grammar used by agent/UI policies. */
function parseOperatorModelPolicyWildcardRef(raw) {
	const wildcard = parseModelPolicyWildcardRef(raw);
	if (wildcard) return wildcard;
	const trimmed = raw.trim();
	const literal = trimmed.slice(0, -1);
	if (!trimmed.endsWith("*") || !literal.includes("/") || /\s$/u.test(literal)) return null;
	const prefix = parseModelPolicyWildcardRef(`${literal}/*`);
	return prefix ? {
		...prefix,
		key: `${prefix.key.slice(0, -2)}*`
	} : null;
}
/** True for a syntactically valid exact provider/model policy reference. */
function isValidExactModelPolicyRef(raw) {
	const parsed = parseModelCatalogRef(raw);
	return Boolean(parsed && hasValidSegments([parsed.provider, ...parsed.modelId.split("/")], 2));
}
/** Share policy grammar and owner-scoped aliases between validation and migration. */
function createModelPolicyRefValidator(...modelMaps) {
	const aliases = new Set(modelMaps.flatMap((models) => Object.values(models ?? {}).map((entry) => normalizeLowercaseStringOrEmpty(entry?.alias))).filter(Boolean));
	return (raw) => {
		const trimmed = raw.trim();
		return Boolean(aliases.has(normalizeLowercaseStringOrEmpty(trimmed)) || MODEL_POLICY_COMPAT_SELECTORS.has(normalizeLowercaseStringOrEmpty(trimmed)) || isValidExactModelPolicyRef(trimmed) || parseModelPolicyWildcardRef(trimmed));
	};
}
//#endregion
//#region src/config/model-policy-allowlist-migration.ts
function hasModelPolicyAllowlistMigrationMarker(value) {
	return isRecord(value) && isRecord(value.meta) && isRecord(value.meta.migrations) && value.meta.migrations.modelPolicyAllowlist === true;
}
/** A per-agent policy replaces inherited defaults only when it owns `allow`. */
function hasExplicitModelPolicyAllow(value) {
	return isRecord(value) && Object.hasOwn(value, "allow");
}
function computeModelPolicyAllowlist(params) {
	if (hasModelPolicyAllowlistMigrationMarker(params.root)) return null;
	return collectLegacyDefaultModelAllowRefs(params.defaults);
}
function collectLegacyDefaultModelAllowRefs(defaults) {
	if (!isRecord(defaults)) return null;
	if (isRecord(defaults.modelPolicy)) return null;
	if (!isRecord(defaults.models)) return null;
	const refs = Object.keys(defaults.models).filter((key) => key.trim().length > 0);
	return refs.length > 0 ? refs : null;
}
/** Materialize a whole legacy restriction, or retain its shipped dynamic-map semantics. */
function materializeModelPolicyAllowlist(cfg, previousConfig = cfg) {
	const previousAgents = isRecord(previousConfig) ? previousConfig.agents : void 0;
	const allow = isRecord(cfg.agents?.defaults?.modelPolicy) ? null : computeModelPolicyAllowlist({
		root: previousConfig,
		defaults: isRecord(previousAgents) ? previousAgents.defaults : void 0
	});
	if (allow && !allow.every(createModelPolicyRefValidator(cfg.agents?.defaults?.models))) {
		const migrations = { ...cfg.meta?.migrations };
		delete migrations.modelPolicyAllowlist;
		return {
			kind: "deferred",
			config: hasModelPolicyAllowlistMigrationMarker(cfg) ? {
				...cfg,
				meta: {
					...cfg.meta,
					migrations
				}
			} : cfg
		};
	}
	return {
		kind: "complete",
		config: {
			...cfg,
			...allow ? { agents: {
				...cfg.agents,
				defaults: {
					...cfg.agents?.defaults,
					modelPolicy: { allow }
				}
			} } : {},
			meta: {
				...cfg.meta,
				migrations: {
					...cfg.meta?.migrations,
					modelPolicyAllowlist: true
				}
			}
		}
	};
}
/** Keep model-policy intent self-contained when only an included file can be written. */
function projectIncludeModelPolicyWrite(params) {
	const previous = params.previousConfig;
	if (hasModelPolicyAllowlistMigrationMarker(previous)) return params.config;
	let config = params.config;
	const defaults = config.agents?.defaults;
	if (isRecord(config.agents) && (defaults === void 0 || isRecord(defaults)) && defaults?.modelPolicy === void 0 && isRecord(previous.agents?.defaults?.modelPolicy)) config = {
		...config,
		agents: {
			...config.agents,
			defaults: {
				...defaults,
				modelPolicy: {}
			}
		}
	};
	const markerPath = [
		"meta",
		"migrations",
		"modelPolicyAllowlist"
	];
	if (params.explicitSetPaths?.some((segments) => segments.length <= markerPath.length && segments.every((part, i) => part === markerPath[i])) || !hasModelPolicyAllowlistMigrationMarker(config) || !isRecord(config.agents?.defaults?.modelPolicy)) return config;
	const { modelPolicyAllowlist: _marker, ...migrations } = config.meta?.migrations ?? {};
	const { migrations: _migrations, ...meta } = config.meta ?? {};
	const retainedMeta = Object.keys(migrations).length > 0 || previous.meta?.migrations ? {
		...meta,
		migrations
	} : meta;
	const { meta: _meta, ...rest } = config;
	return Object.keys(retainedMeta).length > 0 || previous.meta ? {
		...rest,
		meta: retainedMeta
	} : rest;
}
//#endregion
export { projectIncludeModelPolicyWrite as a, parseOperatorModelPolicyWildcardRef as c, materializeModelPolicyAllowlist as i, hasExplicitModelPolicyAllow as n, createModelPolicyRefValidator as o, hasModelPolicyAllowlistMigrationMarker as r, parseModelPolicyWildcardRef as s, computeModelPolicyAllowlist as t };
