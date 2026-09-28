import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { r as resolvePluginSetupProviderCore } from "./setup-registry-D5VN3YGP.mjs";
import { r as resolvePluginProvidersCore } from "./providers.runtime-C-FMduqb.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { n as buildProviderPluginMethodChoice, r as parseProviderPluginMethodChoice } from "./provider-plugin-choice-Dpa6rQvC.mjs";
function resolveWizardSetupChoiceId(provider, wizard) {
	const explicit = normalizeOptionalString(wizard.choiceId);
	if (explicit) return explicit;
	const explicitMethodId = normalizeOptionalString(wizard.methodId);
	if (explicitMethodId) return buildProviderPluginMethodChoice(provider.id, explicitMethodId);
	if (provider.auth.length === 1) return provider.id;
	return buildProviderPluginMethodChoice(provider.id, provider.auth[0]?.id ?? "default");
}
function resolveMethodById(provider, methodId) {
	const normalizedMethodId = normalizeOptionalLowercaseString(methodId);
	if (!normalizedMethodId) return provider.auth[0];
	return provider.auth.find((method) => normalizeOptionalLowercaseString(method.id) === normalizedMethodId);
}
function listMethodWizardSetups(provider) {
	return provider.auth.map((method) => method.wizard ? {
		method,
		wizard: method.wizard
	} : null).filter((entry) => Boolean(entry));
}
function resolveProviderWizardProviders(params) {
	return resolvePluginProvidersCore({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		mode: "setup",
		...params.providerRefs?.length ? { providerRefs: params.providerRefs } : {}
	});
}
function resolveModelPickerChoiceValue(provider, modelPicker) {
	const explicitMethodId = normalizeOptionalString(modelPicker.methodId);
	if (explicitMethodId) return buildProviderPluginMethodChoice(provider.id, explicitMethodId);
	if (provider.auth.length === 1) return provider.id;
	return buildProviderPluginMethodChoice(provider.id, provider.auth[0]?.id ?? "default");
}
function resolveProviderModelPickerEntries(params) {
	const providers = resolveProviderWizardProviders(params);
	const entries = [];
	for (const provider of providers) {
		const modelPicker = provider.wizard?.modelPicker;
		if (!modelPicker) continue;
		if (resolveMethodById(provider, modelPicker.methodId)?.wizard?.modelTarget === "utility") continue;
		entries.push({
			value: resolveModelPickerChoiceValue(provider, modelPicker),
			label: normalizeOptionalString(modelPicker.label) || `${provider.label} (custom)`,
			hint: normalizeOptionalString(modelPicker.hint)
		});
	}
	return entries;
}
function resolveProviderPluginChoiceCore(params) {
	const choice = normalizeOptionalString(params.choice) ?? "";
	if (!choice) return null;
	const withManifestTarget = (resolved) => {
		const { provider, method } = resolved;
		const matchesMethod = (declared) => Boolean(declared && declared.pluginId === provider.pluginId && normalizeProviderId(declared.providerId) === normalizeProviderId(provider.id) && normalizeOptionalLowercaseString(declared.methodId) === normalizeOptionalLowercaseString(method.id));
		const matching = matchesMethod(params.manifestChoice) ? params.manifestChoice : params.resolveManifestMethodChoice?.(provider, method);
		return matching?.modelTarget && matchesMethod(matching) ? {
			...resolved,
			wizard: {
				...resolved.wizard,
				modelTarget: matching.modelTarget
			}
		} : resolved;
	};
	const explicitChoice = parseProviderPluginMethodChoice(choice);
	if (explicitChoice) {
		const { providerId, methodId } = explicitChoice;
		const provider = params.providers.find((entry) => normalizeProviderId(entry.id) === normalizeProviderId(providerId));
		if (!provider) return null;
		const method = resolveMethodById(provider, methodId);
		if (!method) return null;
		return withManifestTarget({
			provider,
			method,
			...method.wizard ? { wizard: method.wizard } : {}
		});
	}
	if (params.manifestChoice) {
		const declared = params.manifestChoice;
		if (declared.choiceId !== choice) return null;
		const provider = params.providers.find((entry) => entry.pluginId === declared.pluginId && normalizeProviderId(entry.id) === normalizeProviderId(declared.providerId));
		const methodId = normalizeOptionalLowercaseString(declared.methodId);
		if (!provider || !methodId) return null;
		const method = resolveMethodById(provider, methodId);
		return method ? withManifestTarget({
			provider,
			method,
			wizard: method.wizard
		}) : null;
	}
	for (const provider of params.providers) {
		for (const { method, wizard } of listMethodWizardSetups(provider)) {
			const choiceId = normalizeOptionalString(wizard.choiceId) || buildProviderPluginMethodChoice(provider.id, method.id);
			if ((normalizeOptionalString(choiceId) ?? "") === choice) return withManifestTarget({
				provider,
				method,
				wizard
			});
		}
		const setup = provider.wizard?.setup;
		if (setup) {
			const setupChoiceId = resolveWizardSetupChoiceId(provider, setup);
			if ((normalizeOptionalString(setupChoiceId) ?? "") === choice) {
				const method = resolveMethodById(provider, setup.methodId);
				if (method) return withManifestTarget({
					provider,
					method,
					wizard: setup
				});
			}
		}
		if (normalizeProviderId(provider.id) === normalizeProviderId(choice) && provider.auth.length > 0) return withManifestTarget({
			provider,
			method: expectDefined(provider.auth[0], "auth entry at 0"),
			...provider.auth[0]?.wizard ? { wizard: provider.auth[0].wizard } : {}
		});
	}
	return null;
}
async function runProviderModelSelectedHookCore(params) {
	const rawModel = params.model.trim();
	if (!rawModel) return;
	const slashIndex = rawModel.indexOf("/");
	const selectedProviderId = slashIndex === -1 ? DEFAULT_PROVIDER : normalizeProviderId(rawModel.slice(0, slashIndex).trim());
	if (!selectedProviderId || slashIndex !== -1 && !rawModel.slice(slashIndex + 1).trim()) return;
	const provider = (params.preparedProvider && normalizeProviderId(params.preparedProvider.id) === selectedProviderId ? params.preparedProvider : void 0) ?? resolvePluginSetupProviderCore({
		provider: selectedProviderId,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) ?? resolveProviderWizardProviders({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		providerRefs: [selectedProviderId]
	}).find((entry) => normalizeProviderId(entry.id) === selectedProviderId);
	if (!provider?.onModelSelected) return;
	await provider.onModelSelected({
		config: params.config,
		model: params.model,
		prompter: params.prompter,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	});
}
//#endregion
export { resolveProviderPluginChoiceCore as n, runProviderModelSelectedHookCore as r, resolveProviderModelPickerEntries as t };
