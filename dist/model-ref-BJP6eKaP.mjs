import { l as normalizeProviderModelIdWithRuntime, o as normalizeModelRef } from "./model-ref-shared-KBg0y299.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString, x as allowsPluginModelNormalization } from "./model-selection-shared-BZeDVoch.mjs";
import "./model-selection-C1qxt1eY.mjs";
//#region src/agents/command/model-ref.ts
const OVERRIDE_VALUE_MAX_LENGTH = 256;
function normalizeExplicitOverrideInput(raw, kind) {
	const trimmed = raw.trim();
	const label = kind === "provider" ? "Provider" : "Model";
	if (!trimmed) throw new Error(`${label} override must be non-empty.`);
	if (trimmed.length > OVERRIDE_VALUE_MAX_LENGTH) throw new Error(`${label} override exceeds ${String(OVERRIDE_VALUE_MAX_LENGTH)} characters.`);
	if (/\p{Cc}/u.test(trimmed)) throw new Error(`${label} override contains invalid control characters.`);
	return trimmed;
}
function normalizeAgentCommandModelRef(cfg, provider, model, modelManifestContext) {
	return normalizeModelRef(provider, model, {
		...modelManifestContext,
		allowPluginNormalization: allowsPluginModelNormalization({
			cfg,
			provider,
			model
		})
	});
}
function parseAgentCommandModelRef(cfg, agentId, raw, defaultProvider, modelManifestContext) {
	const parsed = resolveModelRefFromString({
		cfg,
		agentId,
		raw,
		defaultProvider,
		aliasIndex: buildModelAliasIndex({
			cfg,
			agentId,
			defaultProvider,
			...modelManifestContext,
			allowPluginNormalization: false
		}),
		...modelManifestContext,
		allowPluginNormalization: false
	})?.ref;
	if (!parsed || !allowsPluginModelNormalization({
		cfg,
		...parsed
	})) return parsed ?? null;
	return {
		provider: parsed.provider,
		model: normalizeProviderModelIdWithRuntime({
			provider: parsed.provider,
			context: {
				provider: parsed.provider,
				modelId: parsed.model
			}
		}) ?? parsed.model
	};
}
//#endregion
export { normalizeExplicitOverrideInput as n, parseAgentCommandModelRef as r, normalizeAgentCommandModelRef as t };
