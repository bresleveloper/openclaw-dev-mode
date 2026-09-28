import { a as noteZaloTokenHelp, n as zaloDmPolicy, o as promptZaloAllowFrom, s as inspectZaloAccount } from "./setup-core-CCMLSh4Q.mjs";
import { DEFAULT_ACCOUNT_ID, buildSingleChannelSecretPromptState, createSetupTranslator, createStandardChannelSetupStatus, hasConfiguredSecretInput, patchTopLevelChannelConfigSection, promptSingleChannelSecretInput, runSingleChannelSecretStep } from "openclaw/plugin-sdk/setup";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region extensions/zalo/src/setup-surface.ts
var setup_surface_exports = /* @__PURE__ */ __exportAll({ zaloSetupWizard: () => zaloSetupWizard });
const t = createSetupTranslator();
const channel = "zalo";
function setZaloUpdateMode(cfg, accountId, mode, webhookUrl, webhookSecret, webhookPath) {
	const isDefault = accountId === DEFAULT_ACCOUNT_ID;
	const next = { ...isDefault ? cfg.channels?.zalo : cfg.channels?.zalo?.accounts?.[accountId] };
	if (mode === "polling") {
		delete next.webhookUrl;
		delete next.webhookSecret;
		delete next.webhookPath;
	} else {
		next.webhookUrl = webhookUrl;
		next.webhookSecret = webhookSecret;
		next.webhookPath = webhookPath;
	}
	let patch = next;
	if (!isDefault) {
		const accounts = { ...cfg.channels?.zalo?.accounts };
		accounts[accountId] = next;
		patch = { accounts };
	}
	return patchTopLevelChannelConfigSection({
		cfg,
		channel,
		clearFields: isDefault && mode === "polling" ? [
			"webhookUrl",
			"webhookSecret",
			"webhookPath"
		] : void 0,
		patch
	});
}
const zaloSetupWizard = {
	channel,
	status: createStandardChannelSetupStatus({
		channelLabel: "Zalo",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsToken"),
		configuredHint: t("wizard.channels.statusRecommendedConfigured"),
		unconfiguredHint: t("wizard.channels.statusRecommendedNewcomerFriendly"),
		configuredScore: 1,
		unconfiguredScore: 10,
		includeStatusLine: true,
		resolveConfigured: ({ cfg, accountId }) => {
			const account = inspectZaloAccount({
				cfg,
				accountId
			});
			return Boolean(account.token) || hasConfiguredSecretInput(account.config.botToken) || Boolean(account.config.tokenFile?.trim());
		}
	}),
	credentials: [],
	finalize: async ({ cfg, accountId, forceAllowFrom, options, prompter }) => {
		let next = cfg;
		const resolvedAccount = inspectZaloAccount({
			cfg: next,
			accountId
		});
		const accountConfigured = Boolean(resolvedAccount.token);
		const allowEnv = accountId === DEFAULT_ACCOUNT_ID;
		const hasConfigToken = Boolean(hasConfiguredSecretInput(resolvedAccount.config.botToken) || resolvedAccount.config.tokenFile);
		next = (await runSingleChannelSecretStep({
			cfg: next,
			prompter,
			providerHint: "zalo",
			credentialLabel: t("wizard.zalo.botToken"),
			secretInputMode: options?.secretInputMode,
			accountConfigured,
			hasConfigToken,
			allowEnv,
			envValue: process.env.ZALO_BOT_TOKEN,
			envPrompt: t("wizard.zalo.tokenEnvPrompt"),
			keepPrompt: t("wizard.zalo.tokenKeep"),
			inputPrompt: t("wizard.zalo.tokenInput"),
			preferredEnvVar: "ZALO_BOT_TOKEN",
			onMissingConfigured: async () => await noteZaloTokenHelp(prompter),
			applyUseEnv: async (currentCfg) => accountId === DEFAULT_ACCOUNT_ID ? patchTopLevelChannelConfigSection({
				cfg: currentCfg,
				channel,
				enabled: true,
				patch: {}
			}) : currentCfg,
			applySet: async (currentCfg, value) => patchTopLevelChannelConfigSection({
				cfg: currentCfg,
				channel,
				enabled: true,
				patch: accountId === DEFAULT_ACCOUNT_ID ? { botToken: value } : { accounts: {
					...currentCfg.channels?.zalo?.accounts,
					[accountId]: {
						...currentCfg.channels?.zalo?.accounts?.[accountId],
						enabled: true,
						botToken: value
					}
				} }
			})
		})).cfg;
		if (await prompter.confirm({
			message: t("wizard.zalo.webhookModePrompt"),
			initialValue: Boolean(resolvedAccount.config.webhookUrl)
		})) {
			const webhookUrl = (await prompter.text({
				message: t("wizard.zalo.webhookUrlPrompt"),
				initialValue: resolvedAccount.config.webhookUrl,
				validate: (value) => value?.trim()?.startsWith("https://") ? void 0 : "HTTPS URL required"
			})).trim();
			const defaultPath = (() => {
				try {
					return new URL(webhookUrl).pathname || "/zalo-webhook";
				} catch {
					return "/zalo-webhook";
				}
			})();
			let webhookSecretResult = await promptSingleChannelSecretInput({
				cfg: next,
				prompter,
				providerHint: "zalo-webhook",
				credentialLabel: t("wizard.zalo.webhookSecret"),
				secretInputMode: options?.secretInputMode,
				...buildSingleChannelSecretPromptState({
					accountConfigured: hasConfiguredSecretInput(resolvedAccount.config.webhookSecret),
					hasConfigToken: hasConfiguredSecretInput(resolvedAccount.config.webhookSecret),
					allowEnv: false
				}),
				envPrompt: "",
				keepPrompt: t("wizard.zalo.webhookSecretKeep"),
				inputPrompt: t("wizard.zalo.webhookSecretInput"),
				preferredEnvVar: "ZALO_WEBHOOK_SECRET"
			});
			while (webhookSecretResult.action === "set" && typeof webhookSecretResult.value === "string" && (webhookSecretResult.value.length < 8 || webhookSecretResult.value.length > 256)) {
				await prompter.note(t("wizard.zalo.webhookSecretLength"), t("wizard.zalo.webhookTitle"));
				webhookSecretResult = await promptSingleChannelSecretInput({
					cfg: next,
					prompter,
					providerHint: "zalo-webhook",
					credentialLabel: t("wizard.zalo.webhookSecret"),
					secretInputMode: options?.secretInputMode,
					...buildSingleChannelSecretPromptState({
						accountConfigured: false,
						hasConfigToken: false,
						allowEnv: false
					}),
					envPrompt: "",
					keepPrompt: t("wizard.zalo.webhookSecretKeep"),
					inputPrompt: t("wizard.zalo.webhookSecretInput"),
					preferredEnvVar: "ZALO_WEBHOOK_SECRET"
				});
			}
			const webhookSecret = webhookSecretResult.action === "set" ? webhookSecretResult.value : resolvedAccount.config.webhookSecret;
			const webhookPath = (await prompter.text({
				message: t("wizard.zalo.webhookPathPrompt"),
				initialValue: resolvedAccount.config.webhookPath ?? defaultPath
			})).trim();
			next = setZaloUpdateMode(next, accountId, "webhook", webhookUrl, webhookSecret, webhookPath || void 0);
		} else next = setZaloUpdateMode(next, accountId, "polling");
		if (forceAllowFrom) next = await promptZaloAllowFrom({
			cfg: next,
			prompter,
			accountId
		});
		return { cfg: next };
	},
	dmPolicy: zaloDmPolicy
};
//#endregion
export { zaloSetupWizard as n, setup_surface_exports as t };
