import { o as hasConfiguredSecretInput } from "./types.secrets-B5xWSzLp.mjs";
import { t as detectBinary } from "./detect-binary-CzJJYZjS.mjs";
//#region src/channels/plugins/setup-wizard-binary.ts
/**
* Creates setup status resolvers for channels backed by a required local binary.
*/
function createDetectedBinaryStatus(params) {
	const detectBinary$1 = params.detectBinary ?? detectBinary;
	return {
		configuredLabel: params.configuredLabel,
		unconfiguredLabel: params.unconfiguredLabel,
		configuredHint: params.configuredHint,
		unconfiguredHint: params.unconfiguredHint,
		configuredScore: params.configuredScore,
		unconfiguredScore: params.unconfiguredScore,
		resolveConfigured: params.resolveConfigured,
		async resolveStatusLines({ cfg, accountId, configured }) {
			const binaryPath = params.resolveBinaryPath({
				cfg,
				accountId
			});
			const detected = await detectBinary$1(binaryPath);
			return [`${params.channelLabel}: ${configured ? params.configuredLabel : params.unconfiguredLabel}`, `${params.binaryLabel}: ${detected ? "found" : "missing"} (${binaryPath})`];
		},
		async resolveSelectionHint({ cfg, accountId }) {
			return await detectBinary$1(params.resolveBinaryPath({
				cfg,
				accountId
			})) ? params.configuredHint : params.unconfiguredHint;
		},
		async resolveQuickstartScore({ cfg, accountId }) {
			return await detectBinary$1(params.resolveBinaryPath({
				cfg,
				accountId
			})) ? params.configuredScore : params.unconfiguredScore;
		}
	};
}
/**
* Creates a setup text input that records or reuses a CLI path.
*/
function createCliPathTextInput(params) {
	return {
		inputKey: params.inputKey,
		message: params.message,
		currentValue: params.resolvePath,
		initialValue: params.resolvePath,
		shouldPrompt: params.shouldPrompt,
		confirmCurrentValue: false,
		applyCurrentValue: true,
		...params.helpTitle ? { helpTitle: params.helpTitle } : {},
		...params.helpLines ? { helpLines: params.helpLines } : {}
	};
}
/**
* Creates delegated status resolvers backed by a lazily loaded setup wizard.
*/
function createDelegatedSetupWizardStatusResolvers(loadWizard) {
	return {
		async resolveStatusLines(params) {
			return (await loadWizard()).status.resolveStatusLines?.(params) ?? [];
		},
		async resolveSelectionHint(params) {
			return await (await loadWizard()).status.resolveSelectionHint?.(params);
		},
		async resolveQuickstartScore(params) {
			return await (await loadWizard()).status.resolveQuickstartScore?.(params);
		}
	};
}
/**
* Delegates a text input's `shouldPrompt` check to a lazily loaded setup wizard.
*/
function createDelegatedTextInputShouldPrompt(params) {
	return async (inputParams) => {
		return await ((await params.loadWizard()).textInputs?.find((entry) => entry.inputKey === params.inputKey))?.shouldPrompt?.(inputParams) ?? false;
	};
}
//#endregion
//#region src/channels/plugins/setup-wizard-proxy.ts
/**
* Creates a setup wizard facade with selected hooks delegated to a lazy wizard.
*/
function createDelegatedSetupWizardProxy(params) {
	return {
		channel: params.channel,
		status: {
			...params.status,
			resolveConfigured: async (statusParams) => await (await params.loadWizard()).status.resolveConfigured(statusParams),
			...createDelegatedSetupWizardStatusResolvers(params.loadWizard)
		},
		...params.resolveShouldPromptAccountIds ? { resolveShouldPromptAccountIds: params.resolveShouldPromptAccountIds } : {},
		...params.delegatePrepare ? { prepare: async (prepareParams) => await (await params.loadWizard()).prepare?.(prepareParams) } : {},
		credentials: params.credentials ?? [],
		...params.textInputs ? { textInputs: params.textInputs } : {},
		...params.delegateFinalize ? { finalize: async (finalizeParams) => await (await params.loadWizard()).finalize?.(finalizeParams) } : {},
		...params.completionNote ? { completionNote: params.completionNote } : {},
		...params.dmPolicy ? { dmPolicy: params.dmPolicy } : {},
		...params.disable ? { disable: params.disable } : {},
		...params.onAccountRecorded ? { onAccountRecorded: params.onAccountRecorded } : {}
	};
}
/**
* Creates a setup wizard proxy that delegates allowlist resolution when available.
*/
function createAllowlistSetupWizardProxy(params) {
	return params.createBase({
		promptAllowFrom: async ({ cfg, prompter, accountId }) => {
			const wizard = await params.loadWizard();
			if (!wizard.dmPolicy?.promptAllowFrom) return cfg;
			return await wizard.dmPolicy.promptAllowFrom({
				cfg,
				prompter,
				accountId
			});
		},
		resolveAllowFromEntries: async ({ cfg, accountId, credentialValues, entries }) => {
			const wizard = await params.loadWizard();
			if (!wizard.allowFrom) return entries.map((input) => ({
				input,
				resolved: false,
				id: null
			}));
			return await wizard.allowFrom.resolveEntries({
				cfg,
				accountId,
				credentialValues,
				entries
			});
		},
		resolveGroupAllowlist: async ({ cfg, accountId, credentialValues, entries, prompter }) => {
			const wizard = await params.loadWizard();
			if (!wizard.groupAccess?.resolveAllowlist) return params.fallbackResolvedGroupAllowlist(entries);
			return await wizard.groupAccess.resolveAllowlist({
				cfg,
				accountId,
				credentialValues,
				entries,
				prompter
			});
		}
	});
}
//#endregion
//#region src/plugin-sdk/setup-credential.ts
function hasConfiguredCredentialField(value) {
	return hasConfiguredSecretInput(value);
}
/** Build a declarative token/secret setup step while preserving channel-owned patch semantics. */
function defineTokenCredential(params) {
	const { configKey, configuredFields = [configKey], resolveAccount, accountConfigured, hasConfiguredValue: resolveHasConfiguredValue, resolvedValue, envValue, patchAccount, set, useEnv, ...credential } = params;
	return {
		...credential,
		inspect: ({ cfg, accountId }) => {
			const account = resolveAccount({
				cfg,
				accountId
			});
			const config = account.config;
			const hasConfiguredValue = resolveHasConfiguredValue?.(account) ?? configuredFields.some((field) => hasConfiguredCredentialField(config[field]));
			const inspectedResolvedValue = resolvedValue?.(account);
			return {
				accountConfigured: accountConfigured?.(account) ?? Boolean(inspectedResolvedValue || hasConfiguredValue),
				hasConfiguredValue,
				resolvedValue: inspectedResolvedValue,
				envValue: envValue?.({ accountId })
			};
		},
		...patchAccount && useEnv ? { applyUseEnv: async ({ cfg, accountId }) => {
			const account = resolveAccount({
				cfg,
				accountId
			});
			return patchAccount({
				cfg,
				accountId,
				account,
				mode: "env",
				patch: useEnv.patch?.(account) ?? {},
				clearFields: useEnv.clearFields ?? [configKey]
			});
		} } : {},
		...patchAccount && set ? { applySet: async ({ cfg, accountId, value, resolvedValue: normalizedValue }) => {
			const account = resolveAccount({
				cfg,
				accountId
			});
			return patchAccount({
				cfg,
				accountId,
				account,
				mode: "set",
				patch: { [configKey]: set.value === "resolved" ? normalizedValue : value },
				clearFields: set.clearFields ?? []
			});
		} } : {}
	};
}
/** Build a base-URL setup input with shared read, validation, normalization, and patch wiring. */
function baseUrlTextInput(params) {
	const { configKey, resolveAccount, currentValue, includeInitialValue, validate, normalize, patchAccount, ...input } = params;
	const readCurrentValue = ({ cfg, accountId }) => currentValue(resolveAccount({
		cfg,
		accountId
	}));
	return {
		...input,
		currentValue: readCurrentValue,
		...includeInitialValue ? { initialValue: readCurrentValue } : {},
		validate: ({ value }) => validate(value),
		normalizeValue: ({ value }) => normalize(value),
		applySet: ({ cfg, accountId, value }) => patchAccount({
			cfg,
			accountId,
			patch: { [configKey]: value }
		})
	};
}
//#endregion
export { createCliPathTextInput as a, createDelegatedSetupWizardProxy as i, defineTokenCredential as n, createDelegatedTextInputShouldPrompt as o, createAllowlistSetupWizardProxy as r, createDetectedBinaryStatus as s, baseUrlTextInput as t };
