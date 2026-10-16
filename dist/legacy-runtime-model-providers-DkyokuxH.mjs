import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { s as normalizeStaticProviderModelId } from "./model-ref-shared-KBg0y299.mjs";
//#region src/commands/doctor/shared/legacy-runtime-model-providers.ts
const LEGACY_RUNTIME_MODEL_PROVIDER_ALIASES = [
	{
		legacyProvider: "codex",
		provider: "openai",
		runtime: "codex",
		cli: false
	},
	{
		legacyProvider: "codex-cli",
		provider: "openai",
		runtime: "codex",
		cli: false
	},
	{
		legacyProvider: "claude-cli",
		provider: "anthropic",
		runtime: "claude-cli",
		cli: true
	},
	{
		legacyProvider: "google-gemini-cli",
		provider: "google",
		runtime: "google-gemini-cli",
		cli: true
	}
];
function normalizeLegacyRuntimeProviderId(provider) {
	const normalized = provider.trim().toLowerCase();
	return normalized === "anthropic-cli" ? "claude-cli" : normalizeProviderId(normalized);
}
const LEGACY_ALIAS_BY_PROVIDER = new Map(LEGACY_RUNTIME_MODEL_PROVIDER_ALIASES.map((entry) => [normalizeLegacyRuntimeProviderId(entry.legacyProvider), entry]));
function resolveLegacyRuntimeModelProviderAlias(provider) {
	return LEGACY_ALIAS_BY_PROVIDER.get(normalizeLegacyRuntimeProviderId(provider));
}
/** Rewrite a legacy runtime-encoded model ref to canonical provider/model plus runtime intent. */
function migrateLegacyRuntimeModelRef(raw) {
	const trimmed = raw.trim();
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || slash >= trimmed.length - 1) return null;
	const alias = resolveLegacyRuntimeModelProviderAlias(trimmed.slice(0, slash));
	if (!alias) return null;
	const rawModel = trimmed.slice(slash + 1).trim();
	const model = normalizeStaticProviderModelId(alias.provider, rawModel);
	if (!model) return null;
	return {
		ref: `${alias.provider}/${model}`,
		legacyProvider: alias.legacyProvider,
		provider: alias.provider,
		model,
		runtime: alias.runtime,
		cli: alias.cli
	};
}
//#endregion
export { resolveLegacyRuntimeModelProviderAlias as n, migrateLegacyRuntimeModelRef as t };
