import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { n as t } from "./i18n-CSQb1QYq.js";
//#region src/wizard/setup.model-auth.ts
const loadAuthChoiceModule = createLazyRuntimeModule(() => import("./auth-choice-CNsDX6Uv.js"));
const loadModelPickerModule = createLazyRuntimeModule(() => import("./model-picker-BnRaxRMK.js"));
function isAuthChoiceSelected(value, keepCurrentAuthChoice) {
	return keepCurrentAuthChoice === void 0 || value !== keepCurrentAuthChoice;
}
async function resolveAuthChoiceModelSelectionPolicy(params) {
	const preferredProvider = await params.resolvePreferredProviderForAuthChoice({
		choice: params.authChoice,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const [{ resolveManifestProviderAuthChoice }, { resolvePluginSetupProvider }] = await Promise.all([import("./provider-auth-choices-BfBwgWRY.js"), import("./setup-registry-8V1JNvqY.js")]);
	const manifestChoice = resolveManifestProviderAuthChoice(params.authChoice, {
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includeUntrustedWorkspacePlugins: false
	});
	if (manifestChoice) {
		const setupProvider = resolvePluginSetupProvider({
			provider: manifestChoice.providerId,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			pluginIds: [manifestChoice.pluginId]
		});
		const setupPolicy = (setupProvider?.auth.find((method) => normalizeProviderId(method.id) === normalizeProviderId(manifestChoice.methodId)))?.wizard?.modelSelection ?? setupProvider?.wizard?.setup?.modelSelection;
		return {
			preferredProvider,
			promptWhenAuthChoiceProvided: setupPolicy?.promptWhenAuthChoiceProvided === true,
			allowKeepCurrent: setupPolicy?.allowKeepCurrent ?? true
		};
	}
	const { resolvePluginProviders, resolveProviderPluginChoice } = await import("./provider-auth-choice.runtime.js");
	const providers = resolvePluginProviders({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		mode: "setup"
	});
	const resolvedChoice = resolveProviderPluginChoice({
		providers,
		choice: params.authChoice
	});
	const matchedProvider = resolvedChoice?.provider ?? (() => {
		const preferredId = preferredProvider?.trim();
		if (!preferredId) return;
		return providers.find((provider) => typeof provider.id === "string" && provider.id.trim() === preferredId);
	})();
	const setupPolicy = resolvedChoice?.wizard?.modelSelection ?? matchedProvider?.wizard?.setup?.modelSelection;
	return {
		preferredProvider,
		promptWhenAuthChoiceProvided: setupPolicy?.promptWhenAuthChoiceProvided === true,
		allowKeepCurrent: setupPolicy?.allowKeepCurrent ?? true
	};
}
/**
* Run the provider auth-choice + default-model selection loop. When
* `opts.authChoice` is set the prompt is skipped and the flag drives the flow
* (public onboarding automation contract).
*/
async function runSetupModelAuthStep(params) {
	const { opts, prompter, runtime, workspaceDir } = params;
	let nextConfig = params.config;
	const authChoiceFromPrompt = opts.authChoice === void 0;
	let authChoice = opts.authChoice;
	let authStore;
	let promptAuthChoiceGrouped;
	let keepCurrentAuthChoice;
	if (authChoiceFromPrompt) {
		const { ensureAuthProfileStore } = await import("./agents/auth-profiles.runtime.js");
		const authChoicePromptModule = await import("./auth-choice-prompt-B4CXijBa.js");
		promptAuthChoiceGrouped = authChoicePromptModule.promptAuthChoiceGrouped;
		keepCurrentAuthChoice = authChoicePromptModule.KEEP_CURRENT_AUTH_CHOICE;
		authStore = ensureAuthProfileStore(void 0, { allowKeychainPrompt: false });
	}
	while (true) {
		if (authChoiceFromPrompt) authChoice = await promptAuthChoiceGrouped({
			prompter,
			store: authStore,
			includeSkip: true,
			config: nextConfig,
			workspaceDir,
			allowKeepCurrentProvider: true
		});
		if (authChoice === void 0) throw new WizardCancelledError(t("wizard.setup.authChoiceRequired"));
		if (!isAuthChoiceSelected(authChoice, keepCurrentAuthChoice)) break;
		if (authChoice === "custom-api-key") {
			const { promptCustomApiConfig } = await import("./onboard-custom-Bo1xAbws.js");
			nextConfig = (await promptCustomApiConfig({
				prompter,
				runtime,
				config: nextConfig,
				secretInputMode: opts.secretInputMode
			})).config;
			prompter.disableBackNavigation?.();
			break;
		}
		if (authChoice === "skip") {
			if (authChoiceFromPrompt) {
				const { applyPrimaryModel, promptDefaultModel } = await loadModelPickerModule();
				const modelSelection = await promptDefaultModel({
					config: nextConfig,
					prompter,
					allowKeep: true,
					ignoreAllowlist: true,
					includeProviderPluginSetups: false,
					loadCatalog: false,
					workspaceDir,
					runtime
				});
				if (modelSelection.config) nextConfig = modelSelection.config;
				if (modelSelection.model) nextConfig = applyPrimaryModel(nextConfig, modelSelection.model);
				const { warnIfModelConfigLooksOff } = await loadAuthChoiceModule();
				await warnIfModelConfigLooksOff(nextConfig, prompter, { validateCatalog: false });
			}
			break;
		}
		const [{ applyAuthChoice, resolvePreferredProviderForAuthChoice, warnIfModelConfigLooksOff }, { applyPrimaryModel, promptDefaultModel }] = await Promise.all([loadAuthChoiceModule(), loadModelPickerModule()]);
		prompter.disableBackNavigation?.();
		let authResult;
		try {
			authResult = await applyAuthChoice({
				authChoice,
				config: nextConfig,
				prompter,
				runtime,
				setDefaultModel: true,
				preserveExistingDefaultModel: true,
				opts: {
					...opts,
					token: opts.authChoice === "apiKey" && opts.token ? opts.token : void 0
				}
			});
		} catch (error) {
			if (error instanceof WizardCancelledError || !authChoiceFromPrompt) throw error;
			await prompter.note([formatErrorMessage(error), t("wizard.setup.authChoiceFailedRetry")].join("\n"), t("wizard.setup.authChoiceFailedTitle"));
			continue;
		}
		nextConfig = authResult.config;
		if (authResult.retrySelection) {
			if (authChoiceFromPrompt) continue;
			break;
		}
		if (authResult.agentModelOverride) nextConfig = applyPrimaryModel(nextConfig, authResult.agentModelOverride);
		const authChoiceModelSelectionPolicy = await resolveAuthChoiceModelSelectionPolicy({
			authChoice,
			config: nextConfig,
			workspaceDir,
			resolvePreferredProviderForAuthChoice
		});
		if (authChoiceFromPrompt || authChoiceModelSelectionPolicy?.promptWhenAuthChoiceProvided) {
			const modelSelection = await promptDefaultModel({
				config: nextConfig,
				prompter,
				allowKeep: authChoiceModelSelectionPolicy?.allowKeepCurrent ?? true,
				ignoreAllowlist: true,
				includeProviderPluginSetups: true,
				preferredProvider: authChoiceModelSelectionPolicy?.preferredProvider,
				browseCatalogOnDemand: true,
				workspaceDir,
				runtime
			});
			if (modelSelection.config) nextConfig = modelSelection.config;
			if (modelSelection.model) nextConfig = applyPrimaryModel(nextConfig, modelSelection.model);
		}
		await warnIfModelConfigLooksOff(nextConfig, prompter, { validateCatalog: false });
		break;
	}
	return nextConfig;
}
//#endregion
export { runSetupModelAuthStep as t };
