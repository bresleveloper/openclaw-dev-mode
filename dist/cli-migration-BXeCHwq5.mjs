import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-BZeDVoch.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./agent-runtime-BhLWDirV.mjs";
import { a as CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS, r as CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF } from "./cli-constants-D6douw4O.mjs";
import { i as resolveClaudeCliAnthropicModelRefs, o as splitTrailingModelAuthProfile, t as modelEntryWithClaudeCliRuntime } from "./claude-model-refs-BrOsU52V.mjs";
//#region extensions/anthropic/cli-migration.ts
function rewriteModelSelection(config) {
	const model = config.agents?.defaults?.model;
	const selection = {
		cfg: config,
		defaultProvider: "anthropic",
		allowManifestNormalization: false,
		allowPluginNormalization: false
	};
	const aliasIndex = buildModelAliasIndex(selection);
	const runtimeRefs = [];
	function rewrite(raw) {
		const configured = resolveModelRefFromString({
			...selection,
			aliasIndex,
			raw
		});
		if (configured?.alias) {
			const target = configured.ref.provider + "/" + configured.ref.model;
			const resolved = resolveClaudeCliAnthropicModelRefs(target);
			runtimeRefs.push(...resolved?.runtimeRefs ?? []);
			const selected = resolved?.rewriteRef ?? resolved?.selectedRef;
			if (!selected) return {
				value: raw,
				primary: raw
			};
			const { profile } = splitTrailingModelAuthProfile(raw);
			const value = profile ? selected + "@" + profile : selected;
			return {
				value,
				primary: value,
				changed: value !== raw
			};
		}
		const resolved = resolveClaudeCliAnthropicModelRefs(raw);
		runtimeRefs.push(...resolved?.runtimeRefs ?? []);
		const converted = resolved?.rewriteRef;
		return {
			value: converted ?? raw,
			primary: converted ?? resolved?.selectedRef,
			changed: Boolean(converted)
		};
	}
	if (typeof model === "string") {
		const rewritten = rewrite(model);
		return {
			...rewritten,
			runtimeRefs,
			changed: Boolean(rewritten.changed)
		};
	}
	if (!model || typeof model !== "object" || Array.isArray(model)) return {
		value: model,
		runtimeRefs,
		changed: false
	};
	const primary = typeof model.primary === "string" ? rewrite(model.primary) : void 0;
	const fallbacks = model.fallbacks?.map((entry) => rewrite(entry).value);
	const changed = Boolean(primary?.changed) || Boolean(fallbacks?.some((entry, index) => entry !== model.fallbacks?.[index]));
	return {
		value: changed ? {
			...model,
			...primary ? { primary: primary.value } : {},
			...fallbacks ? { fallbacks } : {}
		} : model,
		primary: primary?.primary,
		runtimeRefs,
		changed
	};
}
function rewriteModelEntryMap(models) {
	if (!models) return {
		value: models,
		migrated: [],
		runtimeRefs: []
	};
	const next = { ...models };
	const migrated = [];
	const runtimeRefs = [];
	for (const [rawKey, value] of Object.entries(models)) {
		const resolved = resolveClaudeCliAnthropicModelRefs(rawKey);
		runtimeRefs.push(...resolved?.runtimeRefs ?? []);
		const converted = resolved?.rewriteRef;
		if (!converted || converted === rawKey) continue;
		if (!Object.hasOwn(next, converted)) Object.defineProperty(next, converted, {
			value,
			writable: true,
			enumerable: true,
			configurable: true
		});
		if (normalizeLowercaseStringOrEmpty(rawKey).startsWith(`claude-cli/`)) delete next[rawKey];
		migrated.push(converted);
	}
	return {
		value: migrated.length > 0 || runtimeRefs.length > 0 ? next : models,
		migrated,
		runtimeRefs
	};
}
function seedClaudeCliAllowlist(models, selectedRefs = []) {
	const next = { ...models };
	const runtimeRefs = /* @__PURE__ */ new Set([...CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS.map((ref) => resolveClaudeCliAnthropicModelRefs(ref)?.rewriteRef ?? ref), ...selectedRefs]);
	for (const ref of runtimeRefs) {
		const current = Object.hasOwn(next, ref) ? next[ref] : void 0;
		Object.defineProperty(next, ref, {
			value: modelEntryWithClaudeCliRuntime(current),
			writable: true,
			enumerable: true,
			configurable: true
		});
	}
	return next;
}
function buildAnthropicCliMigrationResult(config) {
	const defaults = config.agents?.defaults;
	const rewrittenModel = rewriteModelSelection(config);
	const rewrittenModels = rewriteModelEntryMap(defaults?.models);
	const nextModels = seedClaudeCliAllowlist(rewrittenModels.value ?? defaults?.models ?? {}, [
		...rewrittenModel.runtimeRefs,
		...rewrittenModels.runtimeRefs,
		...rewrittenModels.migrated
	]);
	const defaultModel = rewrittenModel.primary ?? CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF;
	return {
		profiles: [],
		configPatch: { agents: { defaults: {
			...rewrittenModel.changed ? { model: rewrittenModel.value } : {},
			models: nextModels
		} } },
		replaceDefaultModels: true,
		defaultModel,
		notes: [
			"Claude CLI auth detected; kept Anthropic model refs and selected the local Claude CLI runtime.",
			"Existing Anthropic auth profiles are kept for rollback.",
			...rewrittenModels.migrated.length > 0 ? [`Migrated allowlist entries: ${rewrittenModels.migrated.join(", ")}.`] : []
		]
	};
}
//#endregion
export { buildAnthropicCliMigrationResult as t };
