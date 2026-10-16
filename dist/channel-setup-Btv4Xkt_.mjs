import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as withPluginCache, o as getPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { r as formatConfigIssueSummary } from "./issue-format-L1jxHK43.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { d as resolveAgentWorkspaceDir, p as resolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-DbRsdayc.mjs";
import { n as resolveChannelSetupExecutionAdapter } from "./setup-contract-CSCVWILe.mjs";
import { a as createManagedRuntimeEnvBase, t as createConfigIO } from "./io.factory-DWrU5KGJ.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { i as resolveChannelConfigRecord } from "./channel-config-activation-CjIoaWiA.mjs";
import { n as formatChannelSelectionLine, s as listChatChannels, t as formatChannelPrimerLine } from "./registry-B3Y-vjit.mjs";
import { r as enablePluginWithCapabilityConsent } from "./enable-DF-H95Vb.mjs";
import { i as getBundledChannelSetupPlugin } from "./bundled-DN3obb3J.mjs";
import { t as isChannelConfigured } from "./channel-configured-CfgGCCVe.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { a as resolveBundledPluginSources, n as findBundledPluginSourceInMap } from "./bundled-sources-fjtOrSJ6.mjs";
import { r as hasConfiguredCommandOwners, t as formatCommandOwnerFromChannelSender } from "./doctor-command-owner-ZwiTw8zO.mjs";
import { n as resolveChannelAccount } from "./account-resolution-DCHDXWZ0.mjs";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.mjs";
import { s as writeChannelSection } from "./config-helpers-Ch_BBBFF.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-Bm4RKejp.mjs";
import { i as wizardT, r as t } from "./i18n-Cuh2pEdZ.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-CGgxPHve.mjs";
import { s as moveSingleAccountChannelSectionToDefaultAccount, u as readChannelConfigSection } from "./setup-helpers-CDK4xLs4.mjs";
import { E as resolveAccountIdForConfigure, N as splitSetupEntries, k as runSingleChannelSecretStep, w as promptResolvedAllowFrom } from "./setup-wizard-helpers-Z9EJ5vhW.mjs";
import { t as promptChannelAccessConfig } from "./setup-group-access-XdE_7eR3.mjs";
import { n as listActiveChannelSetupPlugins, r as listChannelSetupPlugins, t as getChannelSetupPlugin } from "./setup-registry-DAjGUEKY.mjs";
import { r as listTrustedChannelPluginCatalogEntries, t as getTrustedChannelPluginCatalogEntry } from "./trusted-catalog-DbzNi61S.mjs";
import { n as loadChannelSetupPluginRegistrySnapshotForChannel, t as ensureChannelSetupPluginInstalled } from "./plugin-install-DBKzno6x.mjs";
import { i as withCommandPluginMetadata } from "./config-validation-Cf7I75MX.mjs";
import { t as normalizeExternalChannelSetupConfig } from "./config-compatibility-Bxp7TfuF.mjs";
import { i as shouldShowChannelInSetup, r as resolveChannelSetupEntries } from "./discovery-CFnMHblV.mjs";
import { n as runWizardWithPromptNavigationScope } from "./navigation-prompter-BjXGDjGj.mjs";
//#region src/channels/plugins/setup-group-access-configure.ts
/**
* Applies prompted group access config through channel-specific policy/allowlist hooks.
*/
async function configureChannelAccessWithAllowlist(params) {
	let next = params.cfg;
	const accessConfig = await promptChannelAccessConfig(params);
	if (!accessConfig) return next;
	if (accessConfig.policy !== "allowlist") return params.setPolicy(next, accessConfig.policy);
	if (params.skipAllowlistEntries || !params.resolveAllowlist || !params.applyAllowlist) return params.setPolicy(next, "allowlist");
	const resolved = await params.resolveAllowlist({
		cfg: next,
		entries: accessConfig.entries
	});
	next = params.setPolicy(next, "allowlist");
	return params.applyAllowlist({
		cfg: next,
		resolved
	});
}
//#endregion
//#region src/channels/plugins/setup-wizard.ts
function createWizardAccountScope(params) {
	const accountId = normalizeAccountId(params.accountId);
	const initialChannel = readChannelConfigSection(params.cfg, params.channelKey) ?? {};
	if (accountId === "default" && initialChannel.accounts === void 0) return {
		cfg: params.cfg,
		restore: (cfg) => cfg
	};
	const cfg = moveSingleAccountChannelSectionToDefaultAccount({
		cfg: params.cfg,
		channelKey: params.channelKey,
		setupSurface: params.setupSurface
	});
	const channel = readChannelConfigSection(cfg, params.channelKey) ?? {};
	const previousDefaultAccount = channel.defaultAccount;
	return {
		cfg: writeChannelSection(cfg, params.channelKey, {
			...channel,
			accounts: channel.accounts ?? {},
			defaultAccount: accountId
		}),
		restore: (currentCfg) => {
			const currentChannel = readChannelConfigSection(currentCfg, params.channelKey) ?? {};
			const restoredChannel = previousDefaultAccount !== void 0 ? {
				...currentChannel,
				defaultAccount: previousDefaultAccount
			} : (({ defaultAccount: _ignored, ...rest }) => rest)(currentChannel);
			return writeChannelSection(currentCfg, params.channelKey, restoredChannel);
		}
	};
}
async function buildStatus(plugin, wizard, ctx) {
	const accountId = ctx.accountOverrides[plugin.id];
	const configured = await wizard.status.resolveConfigured({
		cfg: ctx.cfg,
		accountId
	});
	const statusContext = () => ({
		cfg: ctx.cfg,
		accountId,
		configured
	});
	const statusLines = await wizard.status.resolveStatusLines?.(statusContext()) ?? [`${plugin.meta.label}: ${configured ? wizard.status.configuredLabel : wizard.status.unconfiguredLabel}`];
	const selectionHint = await wizard.status.resolveSelectionHint?.(statusContext()) ?? (configured ? wizard.status.configuredHint : wizard.status.unconfiguredHint);
	const quickstartScore = await wizard.status.resolveQuickstartScore?.(statusContext()) ?? (configured ? wizard.status.configuredScore : wizard.status.unconfiguredScore);
	return {
		channel: plugin.id,
		configured,
		statusLines,
		selectionHint,
		quickstartScore
	};
}
function applySetupInput(params) {
	const setup = resolveChannelSetupExecutionAdapter(params.plugin);
	if (!setup?.applyAccountConfig) throw new Error(`${params.plugin.id} does not support setup`);
	let input = params.input;
	if (params.plugin.setupContract) {
		const parsed = params.plugin.setupContract.parseInput(input);
		if (!parsed.ok) throw new Error(parsed.error);
		input = parsed.value;
	}
	const resolvedAccountId = setup.resolveAccountId?.({
		cfg: params.cfg,
		accountId: params.accountId,
		input
	}) ?? params.accountId;
	const validationError = setup.validateInput?.({
		cfg: params.cfg,
		accountId: resolvedAccountId,
		input
	});
	if (validationError) throw new Error(validationError);
	let next = setup.applyAccountConfig({
		cfg: params.cfg,
		accountId: resolvedAccountId,
		input
	});
	if (params.input.name?.trim() && setup.applyAccountName) next = setup.applyAccountName({
		cfg: next,
		accountId: resolvedAccountId,
		name: params.input.name
	});
	return {
		cfg: next,
		accountId: resolvedAccountId
	};
}
function collectCredentialValues(params) {
	const values = {};
	for (const credential of params.wizard.credentials) {
		const resolvedValue = normalizeOptionalString(credential.inspect({
			cfg: params.cfg,
			accountId: params.accountId
		}).resolvedValue);
		if (resolvedValue) values[credential.inputKey] = resolvedValue;
	}
	return values;
}
async function applyWizardTextInputValue(params) {
	return params.input.applySet ? await params.input.applySet({
		cfg: params.cfg,
		accountId: params.accountId,
		value: params.value
	}) : applySetupInput({
		plugin: params.plugin,
		cfg: params.cfg,
		accountId: params.accountId,
		input: { [params.input.inputKey]: params.value }
	}).cfg;
}
function resolveTextInputKeepMessage(input, currentValue) {
	if (input.sensitive === true) return typeof input.keepPrompt === "string" ? input.keepPrompt : `${input.message} already configured. Keep it?`;
	return typeof input.keepPrompt === "function" ? input.keepPrompt(currentValue) : input.keepPrompt ?? `${input.message} set (${currentValue}). Keep it?`;
}
function buildChannelSetupWizardAdapterFromSetupWizard(params) {
	const { plugin, wizard } = params;
	return {
		channel: plugin.id,
		getStatus: async (ctx) => buildStatus(plugin, wizard, ctx),
		configure: async ({ cfg, runtime, prompter, options, accountOverrides, shouldPromptAccountIds, forceAllowFrom }) => {
			const defaultAccountId = plugin.config.defaultAccountId?.(cfg) ?? plugin.config.listAccountIds(cfg)[0] ?? "default";
			const resolvedShouldPromptAccountIds = wizard.resolveShouldPromptAccountIds?.({
				cfg,
				options,
				shouldPromptAccountIds
			}) ?? shouldPromptAccountIds;
			const accountSelection = {
				cfg,
				prompter,
				accountOverride: accountOverrides[plugin.id],
				shouldPromptAccountIds: resolvedShouldPromptAccountIds,
				listAccountIds: plugin.config.listAccountIds,
				defaultAccountId
			};
			const accountId = await (wizard.resolveAccountIdForConfigure ? wizard.resolveAccountIdForConfigure({
				...accountSelection,
				options
			}) : resolveAccountIdForConfigure({
				...accountSelection,
				label: plugin.meta.label
			}));
			const channel = readChannelConfigSection(cfg, plugin.id) ?? {};
			const accountScope = wizard.resolveShouldPromptAccountIds === void 0 || resolvedShouldPromptAccountIds || channel.accounts !== void 0 ? createWizardAccountScope({
				cfg,
				channelKey: plugin.id,
				accountId,
				setupSurface: resolveChannelSetupExecutionAdapter(plugin)
			}) : {
				cfg,
				restore: (currentCfg) => currentCfg
			};
			let next = accountScope.cfg;
			let credentialValues = collectCredentialValues({
				wizard,
				cfg: next,
				accountId
			});
			let usedEnvShortcut = false;
			const showNote = async (note) => {
				if (note && (!note.shouldShow || await note.shouldShow({
					cfg: next,
					accountId,
					credentialValues
				}))) await prompter.note(note.lines.join("\n"), note.title);
			};
			if (wizard.envShortcut?.isAvailable({
				cfg: next,
				accountId
			})) {
				if (await prompter.confirm({
					message: wizard.envShortcut.prompt,
					initialValue: true
				})) {
					next = await wizard.envShortcut.apply({
						cfg: next,
						accountId
					});
					credentialValues = collectCredentialValues({
						wizard,
						cfg: next,
						accountId
					});
					usedEnvShortcut = true;
				}
			}
			if (!usedEnvShortcut) await showNote(wizard.introNote);
			if (wizard.prepare) {
				const prepared = await wizard.prepare({
					cfg: next,
					accountId,
					credentialValues,
					runtime,
					prompter,
					options
				});
				if (prepared?.cfg) next = prepared.cfg;
				if (prepared?.credentialValues) credentialValues = {
					...credentialValues,
					...prepared.credentialValues
				};
			}
			const runCredentialSteps = async () => {
				if (usedEnvShortcut) return;
				for (const credential of wizard.credentials) {
					let credentialState = credential.inspect({
						cfg: next,
						accountId
					});
					let resolvedCredentialValue = normalizeOptionalString(credentialState.resolvedValue);
					if (!(credential.shouldPrompt ? await credential.shouldPrompt({
						cfg: next,
						accountId,
						credentialValues,
						currentValue: resolvedCredentialValue,
						state: credentialState
					}) : true)) {
						if (resolvedCredentialValue) credentialValues[credential.inputKey] = resolvedCredentialValue;
						else delete credentialValues[credential.inputKey];
						continue;
					}
					const allowEnv = credential.allowEnv?.({
						cfg: next,
						accountId
					}) ?? false;
					const credentialResult = await runSingleChannelSecretStep({
						cfg: next,
						prompter,
						providerHint: credential.providerHint,
						credentialLabel: credential.credentialLabel,
						secretInputMode: options?.secretInputMode,
						accountConfigured: credentialState.accountConfigured,
						hasConfigToken: credentialState.hasConfiguredValue,
						allowEnv,
						envValue: credentialState.envValue,
						envPrompt: credential.envPrompt,
						keepPrompt: credential.keepPrompt,
						inputPrompt: credential.inputPrompt,
						preferredEnvVar: credential.preferredEnvVar,
						onMissingConfigured: credential.helpLines && credential.helpLines.length > 0 ? async () => {
							await prompter.note(credential.helpLines.join("\n"), credential.helpTitle ?? credential.credentialLabel);
						} : void 0,
						applyUseEnv: async (currentCfg) => credential.applyUseEnv ? await credential.applyUseEnv({
							cfg: currentCfg,
							accountId
						}) : applySetupInput({
							plugin,
							cfg: currentCfg,
							accountId,
							input: {
								[credential.inputKey]: void 0,
								useEnv: true
							}
						}).cfg,
						applySet: async (currentCfg, value, resolvedValue) => credential.applySet ? await credential.applySet({
							cfg: currentCfg,
							accountId,
							credentialValues,
							value,
							resolvedValue
						}) : applySetupInput({
							plugin,
							cfg: currentCfg,
							accountId,
							input: {
								[credential.inputKey]: value,
								useEnv: false
							}
						}).cfg
					});
					next = credentialResult.cfg;
					credentialState = credential.inspect({
						cfg: next,
						accountId
					});
					resolvedCredentialValue = normalizeOptionalString(credentialResult.resolvedValue) || normalizeOptionalString(credentialState.resolvedValue);
					if (resolvedCredentialValue) credentialValues[credential.inputKey] = resolvedCredentialValue;
					else delete credentialValues[credential.inputKey];
				}
			};
			const runTextInputSteps = async () => {
				for (const textInput of wizard.textInputs ?? []) {
					const applyValue = async (value) => {
						next = await applyWizardTextInputValue({
							plugin,
							input: textInput,
							cfg: next,
							accountId,
							value
						});
					};
					let currentValue = normalizeOptionalString(credentialValues[textInput.inputKey]);
					if (!currentValue && textInput.currentValue) currentValue = normalizeOptionalString(await textInput.currentValue({
						cfg: next,
						accountId,
						credentialValues
					}));
					const shouldPrompt = textInput.shouldPrompt ? await textInput.shouldPrompt({
						cfg: next,
						accountId,
						credentialValues,
						currentValue
					}) : true;
					let keepCurrentValue = !shouldPrompt;
					if (shouldPrompt) {
						if (textInput.helpLines && textInput.helpLines.length > 0) await prompter.note(textInput.helpLines.join("\n"), textInput.helpTitle ?? textInput.message);
						if (currentValue && textInput.confirmCurrentValue !== false) keepCurrentValue = await prompter.confirm({
							message: resolveTextInputKeepMessage(textInput, currentValue),
							initialValue: true
						});
					}
					if (keepCurrentValue) {
						if (currentValue) {
							credentialValues[textInput.inputKey] = currentValue;
							if (textInput.applyCurrentValue) await applyValue(currentValue);
						}
						continue;
					}
					const initialValue = textInput.sensitive === true ? void 0 : normalizeOptionalString(await textInput.initialValue?.({
						cfg: next,
						accountId,
						credentialValues
					}) ?? currentValue);
					const trimmedValue = (await prompter.text({
						message: textInput.message,
						placeholder: textInput.placeholder,
						...textInput.sensitive === true ? {} : { initialValue },
						...textInput.sensitive === true ? { sensitive: true } : {},
						validate: (value) => {
							const trimmed = normalizeOptionalString(value) ?? "";
							if (!trimmed && textInput.required !== false) return "Required";
							return textInput.validate?.({
								value: trimmed,
								cfg: next,
								accountId,
								credentialValues
							});
						}
					})).trim();
					if (!trimmedValue && textInput.required === false) {
						if (textInput.applyEmptyValue) await applyValue("");
						delete credentialValues[textInput.inputKey];
						continue;
					}
					const normalizedValue = normalizeOptionalString(textInput.normalizeValue?.({
						value: trimmedValue,
						cfg: next,
						accountId,
						credentialValues
					}) ?? trimmedValue);
					if (!normalizedValue) {
						delete credentialValues[textInput.inputKey];
						continue;
					}
					await applyValue(normalizedValue);
					credentialValues[textInput.inputKey] = normalizedValue;
				}
			};
			if (wizard.stepOrder === "text-first") {
				await runTextInputSteps();
				await runCredentialSteps();
			} else {
				await runCredentialSteps();
				await runTextInputSteps();
			}
			if (wizard.groupAccess) {
				const access = wizard.groupAccess;
				if (access.helpLines && access.helpLines.length > 0) await prompter.note(access.helpLines.join("\n"), access.helpTitle ?? access.label);
				next = await configureChannelAccessWithAllowlist({
					cfg: next,
					prompter,
					label: access.label,
					currentPolicy: access.currentPolicy({
						cfg: next,
						accountId
					}),
					currentEntries: access.currentEntries({
						cfg: next,
						accountId
					}),
					placeholder: access.placeholder,
					updatePrompt: access.updatePrompt({
						cfg: next,
						accountId
					}),
					skipAllowlistEntries: access.skipAllowlistEntries,
					setPolicy: (currentCfg, policy) => access.setPolicy({
						cfg: currentCfg,
						accountId,
						policy
					}),
					resolveAllowlist: access.resolveAllowlist ? async ({ cfg: currentCfg, entries }) => await access.resolveAllowlist({
						cfg: currentCfg,
						accountId,
						credentialValues,
						entries,
						prompter
					}) : void 0,
					applyAllowlist: access.applyAllowlist ? ({ cfg: currentCfg, resolved }) => access.applyAllowlist({
						cfg: currentCfg,
						accountId,
						resolved
					}) : void 0
				});
			}
			if (forceAllowFrom && wizard.allowFrom) {
				const allowFrom = wizard.allowFrom;
				const credentialInputKey = allowFrom.credentialInputKey ?? wizard.credentials.find((credential) => normalizeOptionalString(credentialValues[credential.inputKey]))?.inputKey ?? wizard.credentials[0]?.inputKey;
				const allowFromCredentialValue = normalizeOptionalString(credentialInputKey === void 0 ? void 0 : credentialValues[credentialInputKey]);
				if (allowFrom.helpLines && allowFrom.helpLines.length > 0) await prompter.note(allowFrom.helpLines.join("\n"), allowFrom.helpTitle ?? `${plugin.meta.label} allowlist`);
				const existingAllowFrom = plugin.config.resolveAllowFrom?.({
					cfg: next,
					accountId
				}) ?? [];
				const unique = await promptResolvedAllowFrom({
					prompter,
					existing: existingAllowFrom,
					token: allowFromCredentialValue,
					message: allowFrom.message,
					placeholder: allowFrom.placeholder,
					label: allowFrom.helpTitle ?? `${plugin.meta.label} allowlist`,
					parseInputs: allowFrom.parseInputs ?? splitSetupEntries,
					parseId: allowFrom.parseId,
					invalidWithoutTokenNote: allowFrom.invalidWithoutCredentialNote,
					resolveEntries: async ({ entries }) => allowFrom.resolveEntries({
						cfg: next,
						accountId,
						credentialValues,
						entries
					})
				});
				next = await allowFrom.apply({
					cfg: next,
					accountId,
					allowFrom: unique
				});
			}
			if (wizard.finalize) {
				const finalized = await wizard.finalize({
					cfg: next,
					accountId,
					credentialValues,
					runtime,
					prompter,
					options,
					forceAllowFrom
				});
				if (finalized?.cfg) next = finalized.cfg;
				if (finalized?.credentialValues) credentialValues = {
					...credentialValues,
					...finalized.credentialValues
				};
			}
			await showNote(wizard.completionNote);
			return {
				cfg: accountScope.restore(next),
				accountId
			};
		},
		dmPolicy: wizard.dmPolicy,
		disable: wizard.disable,
		onAccountRecorded: wizard.onAccountRecorded
	};
}
//#endregion
//#region src/commands/channel-setup/registry.ts
const setupWizardAdapters = /* @__PURE__ */ new WeakMap();
function isChannelSetupWizardAdapter(setupWizard) {
	return Boolean(setupWizard && typeof setupWizard === "object" && "getStatus" in setupWizard && typeof setupWizard.getStatus === "function" && "configure" in setupWizard && typeof setupWizard.configure === "function");
}
function isDeclarativeChannelSetupWizard(setupWizard) {
	return Boolean(setupWizard && typeof setupWizard === "object" && "status" in setupWizard && "credentials" in setupWizard);
}
/** Resolve the setup wizard adapter exposed by one channel plugin, caching declarative adapters. */
function resolveChannelSetupWizardAdapterForPlugin(plugin) {
	if (!plugin) return;
	const { setupWizard } = plugin;
	if (isChannelSetupWizardAdapter(setupWizard)) return setupWizard;
	if (isDeclarativeChannelSetupWizard(setupWizard)) {
		const cached = setupWizardAdapters.get(plugin);
		if (cached) return cached;
		const adapter = buildChannelSetupWizardAdapterFromSetupWizard({
			plugin,
			wizard: setupWizard
		});
		setupWizardAdapters.set(plugin, adapter);
		return adapter;
	}
}
//#endregion
//#region src/flows/channel-setup-fallback.ts
/** Shows the standard "enable it before setup" note for disabled-policy guards. */
async function noteDisabledBeforeSetup(prompter, channel, hint) {
	await prompter.note(t("wizard.channels.disabledBeforeSetup", {
		channel,
		hint
	}), t("wizard.channels.setupTitle"));
}
//#endregion
//#region src/flows/channel-setup-navigation.ts
async function runScopedChannelStep(params) {
	return await runWizardWithPromptNavigationScope(params.prompter, async (scopedPrompter) => params.runner(scopedPrompter, {
		...params.options,
		beforePersistentEffect: async () => {
			params.onPersistentEffect?.();
			scopedPrompter.disableBackNavigation?.();
			await params.options?.beforePersistentEffect?.();
		}
	}));
}
async function ensureChannelSetupPluginInstalledWithNavigation(params) {
	let persistentEffectStarted = false;
	return {
		...await runScopedChannelStep({
			prompter: params.prompter,
			options: params.options,
			runner: async (scopedPrompter, scopedOptions) => await ensureChannelSetupPluginInstalled({
				...params.install,
				prompter: scopedPrompter,
				beforePersistentEffect: scopedOptions.beforePersistentEffect
			}),
			onPersistentEffect: () => {
				persistentEffectStarted = true;
			}
		}),
		persistentEffectStarted
	};
}
//#endregion
//#region src/flows/channel-setup.disabled.ts
function createChannelSetupDisabledHints(params) {
	const resolveConfigDisabledHint = (channel) => {
		const cfg = params.getConfig();
		if (cfg.plugins?.enabled === false) return "plugins disabled";
		if (cfg.plugins?.entries?.[channel]?.enabled === false) return "plugin disabled";
		return resolveChannelConfigRecord(cfg, channel)?.enabled === false ? "disabled" : void 0;
	};
	const resolveAccountDisabledHint = async (channel, accountId) => {
		const plugin = params.getPlugin(channel);
		if (!plugin) return;
		const cfg = params.getConfig();
		const account = await resolveChannelAccount({
			plugin,
			cfg,
			accountId: accountId ?? resolveChannelDefaultAccountId({
				plugin,
				cfg
			})
		});
		return (plugin.config.isEnabled ? plugin.config.isEnabled(account, params.getConfig()) : isAccountEnabled(account)) ? void 0 : "disabled";
	};
	const resolveDisabledHint = async (channel) => {
		const configDisabledHint = resolveConfigDisabledHint(channel);
		return configDisabledHint || params.deferStatusUntilSelection ? configDisabledHint : resolveAccountDisabledHint(channel);
	};
	return {
		resolveConfigDisabledHint,
		resolveAccountDisabledHint,
		resolveDisabledHint
	};
}
//#endregion
//#region src/flows/channel-setup.prompts.ts
function formatAccountLabel(accountId) {
	return accountId === "default" ? "default (primary)" : accountId;
}
/** Separates the operator's administrative identity from channel chat access. */
async function maybeConfigureCommandOwner(params) {
	const { cfg, channels, prompter } = params;
	if (hasConfiguredCommandOwners(cfg) || channels.length === 0) return cfg;
	await prompter.note(t("wizard.channels.commandOwnerHelp"), t("wizard.channels.commandOwnerTitle"));
	if (await prompter.select({
		message: t("wizard.channels.commandOwnerSetup"),
		options: [{
			value: "setup",
			label: t("wizard.channels.commandOwnerOwnAccount")
		}, {
			value: "skip",
			label: t("common.skipForNow")
		}],
		initialValue: "skip"
	}) !== "setup") return cfg;
	const channelId = channels.length === 1 ? channels[0].id : await prompter.select({
		message: t("wizard.channels.commandOwnerChannel"),
		options: channels.toSorted((a, b) => a.label.localeCompare(b.label)).map(({ id, label }) => ({
			value: id,
			label
		}))
	});
	const channel = channels.find(({ id }) => id === channelId);
	const id = (await prompter.text({
		message: t("wizard.channels.commandOwnerUserId", { label: channel.label }),
		validate: (value) => !value.trim() || /[\s*]/.test(value.trim()) ? t("wizard.channels.commandOwnerInvalidId") : void 0
	})).trim();
	const owner = formatCommandOwnerFromChannelSender({
		channel: channel.id,
		id
	});
	if (!owner) return cfg;
	if (!await prompter.confirm({
		message: t("wizard.channels.commandOwnerConfirm", { owner }),
		initialValue: false
	})) return cfg;
	return {
		...cfg,
		commands: {
			...cfg.commands,
			ownerAllowFrom: [owner]
		}
	};
}
async function promptConfiguredAction(params) {
	const { prompter, label, supportsDisable, supportsDelete } = params;
	const options = [
		{
			value: "update",
			label: t("wizard.channels.modifySettings")
		},
		...supportsDisable ? [{
			value: "disable",
			label: t("wizard.channels.disableKeepConfig")
		}] : [],
		...supportsDelete ? [{
			value: "delete",
			label: t("wizard.channels.deleteConfig")
		}] : [],
		{
			value: "skip",
			label: t("wizard.channels.skipLeaveAsIs")
		}
	];
	return await prompter.select({
		message: t("wizard.channels.configuredAction", { label }),
		options,
		initialValue: "update"
	});
}
async function promptRemovalAccountId(params) {
	const { cfg, prompter, label, channel } = params;
	const plugin = params.plugin ?? getChannelSetupPlugin(channel);
	if (!plugin) return DEFAULT_ACCOUNT_ID;
	const accountIds = plugin.config.listAccountIds(cfg).filter(Boolean);
	const defaultAccountId = resolveChannelDefaultAccountId({
		plugin,
		cfg,
		accountIds
	});
	if (accountIds.length <= 1) return defaultAccountId;
	const selected = await prompter.select({
		message: t("wizard.channels.account", { label }),
		options: accountIds.map((accountId) => ({
			value: accountId,
			label: formatAccountLabel(accountId)
		})),
		initialValue: defaultAccountId
	});
	return normalizeAccountId(selected) ?? defaultAccountId;
}
async function maybeConfigureDmPolicies(params) {
	const { selection, prompter, accountIdsByChannel } = params;
	const resolve = params.resolveAdapter ?? (() => void 0);
	const dmPolicies = selection.map((channel) => resolve(channel)?.dmPolicy).filter((policy) => policy !== void 0);
	if (dmPolicies.length === 0) return params.cfg;
	if (!await prompter.confirm({
		message: t("wizard.channels.configureDmPolicies"),
		initialValue: false
	})) return params.cfg;
	let cfg = params.cfg;
	for (const policy of dmPolicies) {
		const accountId = accountIdsByChannel?.get(policy.channel);
		const { policyKey, allowFromKey } = policy.resolveConfigKeys?.(cfg, accountId) ?? {
			policyKey: policy.policyKey,
			allowFromKey: policy.allowFromKey
		};
		await prompter.note([
			t("wizard.channels.dmPolicyDefault"),
			t("wizard.channels.dmPolicyApprove", { command: formatCliCommand(`openclaw pairing approve ${policy.channel} <code>`) }),
			t("wizard.channels.dmPolicyAllowlist", {
				allowFromKey,
				policyKey
			}),
			t("wizard.channels.dmPolicyOpen", {
				allowFromKey,
				policyKey
			}),
			t("wizard.channels.dmPolicyMultiUser", { command: formatCliCommand("openclaw config set session.dmScope \"per-channel-peer\"") }),
			t("wizard.channels.docs", { link: formatDocsLink("/channels/pairing", "channels/pairing") })
		].join("\n"), t("wizard.channels.dmAccessTitle", { label: policy.label }));
		const nextPolicy = await prompter.select({
			message: t("wizard.channels.dmPolicy", { label: policy.label }),
			options: [
				{
					value: "pairing",
					label: t("wizard.channels.dmPolicyPairing")
				},
				{
					value: "allowlist",
					label: t("wizard.channels.dmPolicyAllowlistOption")
				},
				{
					value: "open",
					label: t("wizard.channels.dmPolicyOpenOption")
				},
				{
					value: "disabled",
					label: t("wizard.channels.dmPolicyDisabledOption")
				}
			]
		});
		if (nextPolicy !== policy.getCurrent(cfg, accountId)) cfg = policy.setPolicy(cfg, nextPolicy, accountId);
		if (nextPolicy === "allowlist" && policy.promptAllowFrom) cfg = await policy.promptAllowFrom({
			cfg,
			prompter,
			accountId
		});
	}
	return cfg;
}
//#endregion
//#region src/flows/channel-setup.status.ts
function resolveChannelSetupWorkspaceDir(cfg) {
	const agentId = resolveAmbientOwnerAgentId(cfg, void 0, {
		surface: "channel setup",
		hint: "Set agents.defaults.systemAgent.agentId before configuring channels."
	});
	return resolveAgentWorkspaceDir(cfg, agentId);
}
const CHANNEL_PRIMER_BLURB_KEYS = {
	clickclack: "wizard.channelsPrimer.blurbs.clickclack",
	discord: "wizard.channelsPrimer.blurbs.discord",
	feishu: "wizard.channelsPrimer.blurbs.feishu",
	googlechat: "wizard.channelsPrimer.blurbs.googlechat",
	imessage: "wizard.channelsPrimer.blurbs.imessage",
	irc: "wizard.channelsPrimer.blurbs.irc",
	line: "wizard.channelsPrimer.blurbs.line",
	mattermost: "wizard.channelsPrimer.blurbs.mattermost",
	matrix: "wizard.channelsPrimer.blurbs.matrix",
	msteams: "wizard.channelsPrimer.blurbs.msteams",
	"nextcloud-talk": "wizard.channelsPrimer.blurbs.nextcloudTalk",
	nostr: "wizard.channelsPrimer.blurbs.nostr",
	qqbot: "wizard.channelsPrimer.blurbs.qqbot",
	signal: "wizard.channelsPrimer.blurbs.signal",
	slack: "wizard.channelsPrimer.blurbs.slack",
	"synology-chat": "wizard.channelsPrimer.blurbs.synologyChat",
	telegram: "wizard.channelsPrimer.blurbs.telegram",
	tlon: "wizard.channelsPrimer.blurbs.tlon",
	twitch: "wizard.channelsPrimer.blurbs.twitch",
	wecom: "wizard.channelsPrimer.blurbs.wecom",
	whatsapp: "wizard.channelsPrimer.blurbs.whatsapp",
	yuanbao: "wizard.channelsPrimer.blurbs.yuanbao",
	zalo: "wizard.channelsPrimer.blurbs.zalo",
	zalouser: "wizard.channelsPrimer.blurbs.zalouser"
};
function formatSetupSelectionLabel(label, fallback) {
	return sanitizeTerminalText(label).trim() || sanitizeTerminalText(fallback).trim() || "<invalid channel>";
}
function formatSetupSelectionHint(hint) {
	if (!hint) return;
	return sanitizeTerminalText(hint) || void 0;
}
function formatSetupDisplayText(value, fallback = "") {
	return formatSetupSelectionLabel(value ?? "", fallback);
}
function formatSetupFreeText(value) {
	return sanitizeTerminalText(value ?? "").trim();
}
function formatSetupOptionalDisplayText(value) {
	return sanitizeTerminalText(value ?? "").trim() || void 0;
}
function formatSetupDisplayList(values) {
	const safe = (values ?? []).flatMap((value) => {
		const sanitized = formatSetupOptionalDisplayText(value);
		return sanitized ? [sanitized] : [];
	});
	return safe.length > 0 ? safe : void 0;
}
function formatSetupDisplayMeta(meta) {
	const { selectionDocsPrefix, ...displayMeta } = meta;
	const safeId = formatSetupDisplayText(meta.id, "<invalid channel>");
	const safeLabel = formatSetupDisplayText(meta.label, safeId);
	const safeSelectionDocsPrefix = selectionDocsPrefix === "" ? "" : formatSetupOptionalDisplayText(selectionDocsPrefix?.trim());
	const safeSelectionExtras = formatSetupDisplayList(meta.selectionExtras);
	return {
		...displayMeta,
		id: safeId,
		label: safeLabel,
		selectionLabel: formatSetupDisplayText(meta.selectionLabel, safeLabel),
		docsPath: formatSetupDisplayText(meta.docsPath, "/"),
		...meta.docsLabel ? { docsLabel: formatSetupDisplayText(meta.docsLabel, safeId) } : {},
		blurb: formatSetupFreeText(meta.blurb),
		...safeSelectionDocsPrefix !== void 0 ? { selectionDocsPrefix: safeSelectionDocsPrefix } : {},
		...safeSelectionExtras ? { selectionExtras: safeSelectionExtras } : {}
	};
}
function formatChannelPrimerBlurb(channel) {
	const key = CHANNEL_PRIMER_BLURB_KEYS[channel.id];
	if (!key) return channel.blurb;
	const englishBlurb = wizardT(key, void 0, { locale: "en" });
	return channel.blurb === englishBlurb ? t(key) : channel.blurb;
}
function formatChannelSelectionMeta(meta) {
	const formatted = formatSetupDisplayMeta({
		...meta,
		blurb: formatChannelPrimerBlurb(meta)
	});
	formatted.selectionDocsPrefix ??= t("common.docs");
	return formatted;
}
const CHANNEL_STATUS_LABEL_KEYS = /* @__PURE__ */ new Map([
	["configured", "wizard.channels.statusConfigured"],
	["not configured", "wizard.channels.statusNotConfigured"],
	["configured (plugin disabled)", "wizard.channels.statusConfiguredPluginDisabled"],
	["installed", "wizard.channels.statusInstalled"],
	["installed (plugin disabled)", "wizard.channels.statusInstalledPluginDisabled"],
	["bundled · enable to use", "wizard.channels.statusBundledEnable"],
	["install plugin to enable", "wizard.channels.statusInstallPluginEnable"],
	["needs app credentials", "wizard.channels.statusNeedsAppCredentials"],
	["needs app creds", "wizard.channels.statusNeedsAppCreds"],
	["needs auth", "wizard.channels.statusNeedsAuth"],
	["needs host + nick", "wizard.channels.statusNeedsHostNick"],
	["needs private key", "wizard.channels.statusNeedsPrivateKey"],
	["needs QR login", "wizard.channels.statusNeedsQrLogin"],
	["needs service account", "wizard.channels.statusNeedsServiceAccount"],
	["needs setup", "wizard.channels.statusNeedsSetup"],
	["needs token", "wizard.channels.statusNeedsToken"],
	["needs tokens", "wizard.channels.statusNeedsTokens"],
	["needs token + incoming webhook", "wizard.channels.statusNeedsTokenIncomingWebhook"],
	["needs token + secret", "wizard.channels.statusNeedsTokenSecret"],
	["needs token + url", "wizard.channels.statusNeedsTokenUrl"],
	["needs username, token, and clientId", "wizard.channels.statusNeedsUsernameTokenClientId"],
	["linked", "wizard.channels.statusLinked"],
	["logged in", "wizard.channels.statusLoggedIn"],
	["not linked", "wizard.channels.statusNotLinked"],
	["recommended · configured", "wizard.channels.statusRecommendedConfigured"],
	["recommended · logged in", "wizard.channels.statusRecommendedLoggedIn"],
	["recommended · newcomer-friendly", "wizard.channels.statusRecommendedNewcomerFriendly"],
	["recommended · QR login", "wizard.channels.statusRecommendedQrLogin"],
	["self-hosted chat", "wizard.channels.statusSelfHostedChat"],
	["signal-cli found", "wizard.channels.statusSignalCliFound"],
	["signal-cli missing", "wizard.channels.statusSignalCliMissing"],
	["urbit messenger", "wizard.channels.statusUrbitMessenger"],
	["configured (connection not verified)", "wizard.channels.statusConfiguredConnectionNotVerified"]
]);
function localizeChannelStatusLabel(label) {
	const key = CHANNEL_STATUS_LABEL_KEYS.get(label);
	if (key) return t(key);
	if (label.startsWith("connected as ")) return t("wizard.channels.statusConnectedAs", { name: label.slice(13) });
	return label;
}
function localizeChannelStatusLine(line) {
	const index = line.lastIndexOf(": ");
	if (index < 0) return localizeChannelStatusLabel(line);
	return `${line.slice(0, index + 2)}${localizeChannelStatusLabel(line.slice(index + 2))}`;
}
function localizeChannelSetupStatus(status) {
	return {
		...status,
		statusLines: status.statusLines.map(localizeChannelStatusLine),
		...status.selectionHint ? { selectionHint: localizeChannelStatusLabel(status.selectionHint) } : {}
	};
}
function resolveCatalogChannelSelectionHint(entry, options) {
	const npmSpec = entry.install?.npmSpec?.trim();
	if (npmSpec && !options?.bundledLocalPath) return `download from ${formatSetupSelectionLabel(npmSpec, npmSpec)}`;
	return "";
}
function findBundledSourceForCatalogChannel(params) {
	const pluginId = params.entry.pluginId?.trim() || params.entry.id.trim();
	if (pluginId) {
		const byId = findBundledPluginSourceInMap({
			bundled: params.bundled,
			lookup: {
				kind: "pluginId",
				value: pluginId
			}
		});
		if (byId) return byId;
	}
	const npmSpec = params.entry.install?.npmSpec?.trim();
	if (npmSpec) return findBundledPluginSourceInMap({
		bundled: params.bundled,
		lookup: {
			kind: "npmSpec",
			value: npmSpec
		}
	});
}
async function collectChannelStatus(params) {
	const installedPlugins = params.installedPlugins ?? listChannelSetupPlugins();
	const workspaceDir = params.workspaceDir ?? resolveChannelSetupWorkspaceDir(params.cfg);
	const { installedCatalogEntries, installableCatalogEntries } = resolveChannelSetupEntries({
		cfg: params.cfg,
		installedPlugins,
		workspaceDir
	});
	const bundledSources = resolveBundledPluginSources({ workspaceDir });
	const resolveAdapter = params.resolveAdapter ?? ((channel) => resolveChannelSetupWizardAdapterForPlugin(installedPlugins.find((plugin) => plugin.id === channel)));
	const statusEntries = (await Promise.all(installedPlugins.filter((plugin) => shouldShowChannelInSetup(plugin.meta)).map(async (plugin) => {
		try {
			const adapter = resolveAdapter(plugin.id);
			if (!adapter) return;
			return await adapter.getStatus({
				cfg: params.cfg,
				options: params.options,
				accountOverrides: params.accountOverrides
			});
		} catch (error) {
			const detail = formatSetupFreeText(formatErrorMessage(error));
			return {
				channel: plugin.id,
				configured: isChannelConfigured(params.cfg, plugin.id),
				statusLines: [`${formatSetupSelectionLabel(plugin.meta.label, plugin.id)}: status unavailable (${detail})`],
				selectionHint: "status unavailable"
			};
		}
	}))).filter((status) => status !== void 0);
	const statusByChannel = new Map(statusEntries.map((entry) => [entry.channel, entry]));
	const fallbackStatuses = listChatChannels().filter((meta) => shouldShowChannelInSetup(meta)).filter((meta) => !statusByChannel.has(meta.id)).map((meta) => {
		const configured = isChannelConfigured(params.cfg, meta.id);
		const statusLabel = configured ? "configured (plugin disabled)" : "not configured";
		return {
			channel: meta.id,
			configured,
			statusLines: [`${formatSetupSelectionLabel(meta.label, meta.id)}: ${statusLabel}`],
			selectionHint: configured ? "configured · plugin disabled" : "not configured",
			quickstartScore: 0
		};
	});
	const discoveredPluginStatuses = installedCatalogEntries.filter((entry) => !statusByChannel.has(entry.id)).map((entry) => {
		const configured = isChannelConfigured(params.cfg, entry.id);
		const pluginEnabled = params.cfg.plugins?.entries?.[entry.pluginId ?? entry.id]?.enabled !== false;
		const statusLabel = configured ? pluginEnabled ? "configured" : "configured (plugin disabled)" : pluginEnabled ? "installed" : "installed (plugin disabled)";
		return {
			channel: entry.id,
			configured,
			statusLines: [`${formatSetupSelectionLabel(entry.meta.label, entry.id)}: ${statusLabel}`],
			selectionHint: statusLabel,
			quickstartScore: 0
		};
	});
	const catalogStatuses = installableCatalogEntries.map((entry) => {
		const bundledLocalPath = findBundledSourceForCatalogChannel({
			bundled: bundledSources,
			entry
		})?.localPath ?? null;
		const statusLabel = Boolean(bundledLocalPath) ? "bundled · enable to use" : "install plugin to enable";
		return {
			channel: entry.id,
			configured: false,
			statusLines: [`${formatSetupSelectionLabel(entry.meta.label, entry.id)}: ${statusLabel}`],
			selectionHint: resolveCatalogChannelSelectionHint(entry, { bundledLocalPath }),
			quickstartScore: 0
		};
	});
	const combinedStatuses = [
		...statusEntries,
		...fallbackStatuses,
		...discoveredPluginStatuses,
		...catalogStatuses
	].map(localizeChannelSetupStatus);
	return {
		installedPlugins,
		catalogEntries: installableCatalogEntries,
		installedCatalogEntries,
		statusByChannel: new Map(combinedStatuses.map((entry) => [entry.channel, entry])),
		statusLines: combinedStatuses.flatMap((entry) => entry.statusLines)
	};
}
async function noteChannelPrimer(prompter, channels) {
	const channelLines = channels.map((channel) => formatChannelPrimerLine(formatSetupDisplayMeta({
		id: channel.id,
		label: channel.label,
		selectionLabel: channel.label,
		docsPath: "/",
		blurb: formatChannelPrimerBlurb(channel)
	})));
	await prompter.note([
		t("wizard.channelsPrimer.inboundSafety"),
		t("wizard.channelsPrimer.approveWith", { command: formatCliCommand("openclaw pairing approve <channel> <code>") }),
		t("wizard.channelsPrimer.openDm"),
		t("wizard.channelsPrimer.multiUserDm", { command: formatCliCommand("openclaw config set session.dmScope \"per-channel-peer\"") }),
		t("wizard.channelsPrimer.docs", { link: formatDocsLink("/channels/pairing", "channels/pairing") }),
		"",
		...channelLines
	].join("\n"), t("wizard.channelsPrimer.title"));
}
function resolveQuickstartDefault(statusByChannel) {
	let best = null;
	for (const [channel, status] of statusByChannel) {
		if (status.quickstartScore == null) continue;
		if (!best || status.quickstartScore > best.score) best = {
			channel,
			score: status.quickstartScore
		};
	}
	return best?.channel;
}
function resolveChannelSelectionNoteLines(params) {
	const { entries } = resolveChannelSetupEntries({
		cfg: params.cfg,
		installedPlugins: params.installedPlugins,
		workspaceDir: params.workspaceDir ?? resolveChannelSetupWorkspaceDir(params.cfg)
	});
	const selectionNotes = /* @__PURE__ */ new Map();
	for (const entry of entries) selectionNotes.set(entry.id, formatChannelSelectionLine(formatChannelSelectionMeta(entry.meta), formatDocsLink));
	return params.selection.map((channel) => selectionNotes.get(channel)).filter((line) => Boolean(line));
}
function resolveChannelSetupSelectionOptions(params) {
	return params.entries.filter((entry) => shouldShowChannelInSetup(entry.meta)).toSorted((left, right) => compareChannelSetupSelectionEntries(left, right)).map((entry) => {
		const disabledHint = params.resolveDisabledHint(entry.id);
		const statusHint = params.statusByChannel.get(entry.id)?.selectionHint;
		const hint = formatSetupSelectionHint([statusHint, disabledHint].filter(Boolean).join(" · ") || void 0);
		return Object.assign({
			value: entry.id,
			label: formatSetupSelectionLabel(entry.meta.selectionLabel ?? entry.meta.label, entry.id)
		}, hint ? { hint } : void 0);
	});
}
function compareChannelSetupSelectionEntries(left, right) {
	const leftLabel = left.meta.selectionLabel ?? left.meta.label;
	const rightLabel = right.meta.selectionLabel ?? right.meta.label;
	return leftLabel.localeCompare(rightLabel, void 0, {
		numeric: true,
		sensitivity: "base"
	}) || left.id.localeCompare(right.id, void 0, {
		numeric: true,
		sensitivity: "base"
	});
}
//#endregion
//#region src/flows/channel-setup.ts
function createChannelSetupHooks(params) {
	const hooks = /* @__PURE__ */ new Map();
	return {
		onPostWriteHook: (hook) => {
			hooks.set(`${hook.channel}:${hook.accountId}`, hook);
		},
		async runPostWriteHooks(configPath) {
			await runCollectedChannelOnboardingPostWriteHooks({
				hooks: [...hooks.values()],
				configPath,
				runtime: params.runtime,
				...params.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
			});
			hooks.clear();
		}
	};
}
async function runCollectedChannelOnboardingPostWriteHooks(params) {
	if (params.hooks.length === 0) return;
	const { snapshot, pluginMetadataSnapshot } = await createConfigIO({
		configPath: params.configPath,
		env: createManagedRuntimeEnvBase(),
		observe: false
	}).readConfigFileSnapshotWithPluginMetadata({ allowCurrentPluginMetadata: false });
	await withCommandPluginMetadata({
		config: snapshot.runtimeConfig,
		snapshot: pluginMetadataSnapshot
	}, async () => {
		for (const hook of params.hooks) {
			await params.beforePersistentEffect?.();
			try {
				if (!snapshot.exists || !snapshot.valid) {
					const reason = snapshot.exists ? formatConfigIssueSummary(snapshot.issues) : "file not found";
					throw new Error(`Saved config is unavailable: ${reason}. Run openclaw doctor --fix, then retry setup.`);
				}
				await hook.run({
					cfg: snapshot.runtimeConfig,
					runtime: params.runtime
				});
			} catch (err) {
				const message = formatErrorMessage(err);
				params.runtime.error(`Channel ${hook.channel} post-setup warning for "${hook.accountId}": ${message}`);
			}
		}
	});
}
function createChannelOnboardingPostWriteHook(params) {
	if (!params.accountId || !params.adapter?.afterConfigWritten) return;
	return {
		channel: params.channel,
		accountId: params.accountId,
		run: async ({ cfg, runtime }) => await params.adapter?.afterConfigWritten?.({
			previousCfg: params.previousCfg,
			cfg,
			accountId: params.accountId,
			runtime
		})
	};
}
async function setupChannels(cfg, runtime, prompter, options) {
	let next = cfg;
	const deferStatusUntilSelection = options?.deferStatusUntilSelection === true;
	const forceAllowFromChannels = new Set(options?.forceAllowFromChannels ?? []);
	const accountOverrides = { ...options?.accountIds };
	const scopedPluginsById = /* @__PURE__ */ new Map();
	let preparedWorkspaceDir = options?.workspaceDir;
	const resolveWorkspaceDir = () => preparedWorkspaceDir ??= resolveChannelSetupWorkspaceDir(next);
	const activePluginsById = /* @__PURE__ */ new Map();
	const rememberActivePlugin = (plugin) => {
		activePluginsById.set(plugin.id, plugin);
		return plugin;
	};
	const getVisibleChannelPlugin = (channel) => scopedPluginsById.get(channel) ?? activePluginsById.get(channel);
	const listVisibleInstalledPlugins = () => {
		const merged = /* @__PURE__ */ new Map();
		for (const plugin of [...listActiveChannelSetupPlugins().map(rememberActivePlugin), ...scopedPluginsById.values()]) if (shouldShowChannelInSetup(plugin.meta)) merged.set(plugin.id, plugin);
		return Array.from(merged.values());
	};
	const resolveVisibleChannelEntries = () => resolveChannelSetupEntries({
		cfg: next,
		installedPlugins: listVisibleInstalledPlugins(),
		workspaceDir: resolveWorkspaceDir()
	});
	const loadScopedChannelPlugin = async (channel, pluginId, setup) => {
		const existing = getVisibleChannelPlugin(channel);
		if (existing && setup?.forceReload !== true) return existing;
		const snapshot = loadChannelSetupPluginRegistrySnapshotForChannel({
			cfg: next,
			runtime,
			channel,
			...pluginId ? { pluginId } : {},
			workspaceDir: resolveWorkspaceDir(),
			forceSetupOnlyChannelPlugins: setup?.forceSetupOnlyChannelPlugins ?? true
		});
		const plugin = snapshot.channelSetups.find((entry) => entry.plugin.id === channel)?.plugin ?? snapshot.channels.find((entry) => entry.plugin.id === channel)?.plugin ?? getBundledChannelSetupPlugin(channel);
		if (plugin) scopedPluginsById.set(plugin.id, plugin);
		return plugin;
	};
	const setupCache = getPluginCache();
	const enableChannelPluginForSetup = async (channel) => await withPluginLifecycleLease({}, async () => {
		const result = await enablePluginWithCapabilityConsent(next, channel, {
			workspaceDir: resolveWorkspaceDir(),
			onCapabilityConsent: createPluginCapabilityConsentPrompter(prompter, options?.beforePersistentEffect)
		});
		next = result.config;
		if (result.enabled) await withPluginCache(setupCache, () => loadScopedChannelPlugin(channel));
		return result;
	});
	const getVisibleSetupFlowAdapter = (channel) => resolveChannelSetupWizardAdapterForPlugin(getVisibleChannelPlugin(channel));
	const preloadConfiguredExternalPlugins = async () => {
		listVisibleInstalledPlugins();
		const workspaceDir = resolveWorkspaceDir();
		const preloadTasks = [];
		for (const entry of listTrustedChannelPluginCatalogEntries({
			cfg: next,
			workspaceDir
		})) {
			const channel = entry.id;
			if (getVisibleChannelPlugin(channel)) continue;
			if (!(next.plugins?.entries?.[entry.pluginId ?? channel]?.enabled === true) && !isChannelConfigured(next, channel)) continue;
			preloadTasks.push(loadScopedChannelPlugin(channel, entry.pluginId));
		}
		await Promise.all(preloadTasks);
	};
	if (!deferStatusUntilSelection) await preloadConfiguredExternalPlugins();
	const { statusByChannel, statusLines } = deferStatusUntilSelection ? {
		statusByChannel: /* @__PURE__ */ new Map(),
		statusLines: []
	} : await withCommandPluginMetadata({
		config: next,
		workspaceDir: resolveWorkspaceDir()
	}, () => collectChannelStatus({
		cfg: next,
		workspaceDir: resolveWorkspaceDir(),
		options,
		accountOverrides,
		installedPlugins: listVisibleInstalledPlugins(),
		resolveAdapter: getVisibleSetupFlowAdapter
	}));
	if (!options?.skipStatusNote && statusLines.length > 0) await prompter.note(statusLines.join("\n"), t("wizard.channels.statusTitle"));
	const targetedChannel = options?.finishAfterInitialSelection && options.initialSelection?.length === 1 ? options.initialSelection[0] : void 0;
	if (!(options?.skipConfirm || targetedChannel ? true : await prompter.confirm({
		message: t("wizard.channels.setupConfirm"),
		initialValue: true
	}))) return cfg;
	await noteChannelPrimer(prompter, resolveVisibleChannelEntries().entries.map((entry) => ({
		id: entry.id,
		label: entry.meta.label,
		blurb: entry.meta.blurb
	})));
	const quickstartDefault = options?.initialSelection?.[0] ?? (deferStatusUntilSelection ? void 0 : resolveQuickstartDefault(statusByChannel));
	const shouldPromptAccountIds = options?.promptAccountIds === true;
	const accountIdsByChannel = /* @__PURE__ */ new Map();
	const recordAccount = (channel, accountId) => {
		options?.onAccountId?.(channel, accountId);
		getVisibleSetupFlowAdapter(channel)?.onAccountRecorded?.(accountId, options);
		accountIdsByChannel.set(channel, accountId);
	};
	const selection = [];
	let finishSetupRequested = false;
	const addSelection = (channel) => {
		if (!selection.includes(channel)) selection.push(channel);
	};
	const { resolveConfigDisabledHint, resolveAccountDisabledHint, resolveDisabledHint } = createChannelSetupDisabledHints({
		getConfig: () => next,
		getPlugin: getVisibleChannelPlugin,
		deferStatusUntilSelection
	});
	const buildStatusByChannelForSelection = (catalogById) => {
		const decorated = new Map(statusByChannel);
		if (catalogById.size === 0) return decorated;
		const bundledSources = resolveBundledPluginSources({ workspaceDir: resolveWorkspaceDir() });
		for (const [channel, entry] of catalogById) {
			if (decorated.has(channel)) continue;
			const bundledLocalPath = findBundledSourceForCatalogChannel({
				bundled: bundledSources,
				entry
			})?.localPath ?? null;
			decorated.set(channel, {
				channel,
				configured: false,
				statusLines: [],
				selectionHint: resolveCatalogChannelSelectionHint(entry, { bundledLocalPath })
			});
		}
		return decorated;
	};
	const resolveSelectionOptions = () => withCommandPluginMetadata({
		config: next,
		workspaceDir: resolveWorkspaceDir()
	}, async () => {
		const { entries, installableCatalogById: catalogById } = resolveVisibleChannelEntries();
		const disabledHints = /* @__PURE__ */ new Map();
		for (const entry of entries) if (shouldShowChannelInSetup(entry.meta)) disabledHints.set(entry.id, await resolveDisabledHint(entry.id));
		return resolveChannelSetupSelectionOptions({
			entries,
			statusByChannel: buildStatusByChannelForSelection(catalogById),
			resolveDisabledHint: (channel) => disabledHints.get(channel)
		});
	});
	const refreshStatus = async (channel) => await withCommandPluginMetadata({
		config: next,
		workspaceDir: resolveWorkspaceDir()
	}, async () => {
		const adapter = getVisibleSetupFlowAdapter(channel);
		if (!adapter) return;
		const status = await adapter.getStatus({
			cfg: next,
			options,
			accountOverrides
		});
		statusByChannel.set(channel, status);
		return status;
	});
	const enableBundledPluginForSetup = async (channel) => {
		const disabledHint = resolveConfigDisabledHint(channel);
		if (disabledHint) {
			await prompter.note(t("wizard.channels.disabledDuringSetup", {
				channel,
				hint: disabledHint,
				command: formatCliCommand("openclaw channels add")
			}), t("wizard.channels.setupTitle"));
			return false;
		}
		const result = await enableChannelPluginForSetup(channel);
		if (!result.enabled) {
			await prompter.note(t("wizard.channels.pluginEnableFailed", {
				channel,
				reason: result.reason ?? "plugin disabled",
				command: formatCliCommand("openclaw plugins list")
			}), t("wizard.channels.setupTitle"));
			return false;
		}
		if (!getVisibleChannelPlugin(channel)) {
			await prompter.note(t("wizard.channels.pluginNotAvailable", { channel }), t("wizard.channels.setupTitle"));
			return false;
		}
		await refreshStatus(channel);
		return true;
	};
	const applySetupResult = async (channel, result) => {
		const previousCfg = next;
		next = normalizeExternalChannelSetupConfig({
			cfg: result.cfg,
			channel
		});
		if (result.completion === "paused") {
			finishSetupRequested = true;
			return;
		}
		const plugin = getVisibleChannelPlugin(channel);
		if (plugin) options?.onResolvedPlugin?.(channel, plugin);
		const adapter = getVisibleSetupFlowAdapter(channel);
		if (result.accountId) {
			recordAccount(channel, result.accountId);
			const postWriteHook = createChannelOnboardingPostWriteHook({
				accountId: result.accountId,
				adapter,
				channel,
				previousCfg
			});
			if (postWriteHook) {
				if (!options?.onPostWriteHook) throw new Error(`Channel setup internal error: ${channel} produced a post-write hook without a transaction sink.`);
				options.onPostWriteHook(postWriteHook);
			}
		}
		addSelection(channel);
		if (channel === targetedChannel) finishSetupRequested = true;
		try {
			await refreshStatus(channel);
		} catch (error) {
			const detail = sanitizeTerminalText(formatErrorMessage(error));
			statusByChannel.set(channel, {
				channel,
				configured: isChannelConfigured(next, channel),
				statusLines: [],
				selectionHint: "status unavailable"
			});
			await prompter.note(`Status unavailable (${detail}).\nRetry: ${formatCliCommand(`openclaw channels status --channel ${channel}`)}`, t("wizard.channels.statusTitle"));
		}
	};
	const applyCustomSetupResult = async (channel, result) => {
		if (result !== "skip") await applySetupResult(channel, result);
	};
	const runScopedChannelStep$1 = async (runner) => await runScopedChannelStep({
		prompter,
		options,
		runner: (scopedPrompter, scopedOptions) => withCommandPluginMetadata({
			config: next,
			workspaceDir: resolveWorkspaceDir()
		}, () => runner(scopedPrompter, scopedOptions))
	});
	const configureChannel = async (channel, setupPrompter, setupOptions) => {
		if (scopedPluginsById.has(channel)) await loadScopedChannelPlugin(channel, void 0, {
			forceReload: true,
			forceSetupOnlyChannelPlugins: true
		});
		const adapter = getVisibleSetupFlowAdapter(channel);
		if (!adapter) {
			await prompter.note(t("wizard.channels.noInteractiveSetup", {
				channel,
				command: formatCliCommand(`openclaw channels add --channel ${channel} --help`)
			}), t("wizard.channels.setupTitle"));
			return;
		}
		const result = await adapter.configure({
			cfg: next,
			runtime,
			prompter: setupPrompter,
			options: setupOptions,
			accountOverrides,
			shouldPromptAccountIds,
			forceAllowFrom: forceAllowFromChannels.has(channel)
		});
		await applySetupResult(channel, result);
	};
	const handleConfiguredChannel = async (channel, label, setupPrompter, setupOptions) => {
		const plugin = getVisibleChannelPlugin(channel);
		const adapter = getVisibleSetupFlowAdapter(channel);
		if (adapter?.configureWhenConfigured) {
			const custom = await adapter.configureWhenConfigured({
				cfg: next,
				runtime,
				prompter: setupPrompter,
				options: setupOptions,
				accountOverrides,
				shouldPromptAccountIds,
				forceAllowFrom: forceAllowFromChannels.has(channel),
				configured: true,
				label
			});
			await applyCustomSetupResult(channel, custom);
			return;
		}
		const supportsDisable = Boolean(setupOptions.allowDisable && (plugin?.config.setAccountEnabled || adapter?.disable));
		const supportsDelete = Boolean(setupOptions.allowDisable && plugin?.config.deleteAccount);
		const action = await promptConfiguredAction({
			prompter: setupPrompter,
			label,
			supportsDisable,
			supportsDelete
		});
		if (action === "skip") return;
		if (action === "update") {
			await configureChannel(channel, setupPrompter, setupOptions);
			return;
		}
		if (!setupOptions.allowDisable) return;
		if (action === "delete" && !supportsDelete) {
			await setupPrompter.note(t("wizard.channels.configuredDeleteUnsupported", { label }), t("wizard.channels.removeTitle"));
			return;
		}
		const accountId = (action === "delete" ? Boolean(plugin?.config.deleteAccount) : Boolean(plugin?.config.setAccountEnabled)) ? await promptRemovalAccountId({
			cfg: next,
			prompter: setupPrompter,
			label,
			channel,
			plugin
		}) : DEFAULT_ACCOUNT_ID;
		const resolvedAccountId = normalizeAccountId(accountId) ?? (plugin ? resolveChannelDefaultAccountId({
			plugin,
			cfg: next
		}) : "default");
		const accountLabel = formatAccountLabel(resolvedAccountId);
		if (action === "delete") {
			if (!await setupPrompter.confirm({
				message: t("wizard.channels.deleteAccount", {
					label,
					account: accountLabel
				}),
				initialValue: false
			})) return;
			if (plugin?.config.deleteAccount) next = plugin.config.deleteAccount({
				cfg: next,
				accountId: resolvedAccountId
			});
			await refreshStatus(channel);
			return;
		}
		if (plugin?.config.setAccountEnabled) next = plugin.config.setAccountEnabled({
			cfg: next,
			accountId: resolvedAccountId,
			enabled: false
		});
		else if (adapter?.disable) next = adapter.disable(next);
		await refreshStatus(channel);
	};
	const ensureChannelSetupPluginInstalledWithNavigation$1 = async (channel, install) => await withPluginLifecycleLease({}, async () => {
		const outcome = await ensureChannelSetupPluginInstalledWithNavigation({
			install,
			prompter,
			options
		});
		if (outcome.status !== "back" && outcome.value.installed) {
			next = outcome.value.cfg;
			await withPluginCache(setupCache, () => loadScopedChannelPlugin(channel, outcome.value.pluginId ?? install.entry.pluginId));
		}
		return outcome;
	});
	const handleChannelChoice = async (channel) => {
		let cfgOnBack = next;
		const scopedPluginsBeforeChoice = new Map(scopedPluginsById);
		const statusBeforeChoice = new Map(statusByChannel);
		const returnToSelection = () => {
			next = cfgOnBack;
			scopedPluginsById.clear();
			for (const [id, plugin] of scopedPluginsBeforeChoice) scopedPluginsById.set(id, plugin);
			statusByChannel.clear();
			for (const [id, status] of statusBeforeChoice) statusByChannel.set(id, status);
			return "retry_selection";
		};
		const installCatalogEntry = async (entry) => {
			const installOutcome = await ensureChannelSetupPluginInstalledWithNavigation$1(channel, {
				cfg: next,
				entry,
				runtime,
				workspaceDir: resolveWorkspaceDir(),
				autoConfirmSingleSource: true
			});
			if (installOutcome.status === "back") return returnToSelection();
			next = installOutcome.value.cfg;
			if (!installOutcome.value.installed) return "retry_selection";
			if (installOutcome.persistentEffectStarted) cfgOnBack = next;
		};
		let deferredDisabledHint = deferStatusUntilSelection ? resolveConfigDisabledHint(channel) : void 0;
		let resumingDisabledChannel = false;
		if (deferredDisabledHint) {
			if (deferredDisabledHint !== "disabled" && deferredDisabledHint !== "plugin disabled") {
				await noteDisabledBeforeSetup(prompter, channel, deferredDisabledHint);
				return "done";
			}
			if (channel !== targetedChannel && !await prompter.confirm({
				message: t(deferredDisabledHint === "disabled" ? "wizard.channels.resumeDisabledSetup" : "wizard.channels.resumeDisabledPluginSetup", { channel }),
				initialValue: true
			})) return "done";
			if (deferredDisabledHint === "disabled") {
				const channels = next.channels;
				next = {
					...next,
					channels: {
						...next.channels,
						[channel]: {
							...channels?.[channel],
							enabled: true
						}
					}
				};
			} else {
				const result = await enableChannelPluginForSetup(channel);
				if (!result.enabled) {
					await prompter.note(t("wizard.channels.pluginEnableFailed", {
						channel,
						reason: result.reason ?? "plugin disabled",
						command: formatCliCommand("openclaw plugins list")
					}), t("wizard.channels.setupTitle"));
					return "done";
				}
			}
			resumingDisabledChannel = true;
			deferredDisabledHint = resolveConfigDisabledHint(channel);
			if (deferredDisabledHint) {
				await noteDisabledBeforeSetup(prompter, channel, deferredDisabledHint);
				return "done";
			}
		}
		const { installableCatalogById: catalogById, installedCatalogById } = resolveVisibleChannelEntries();
		const catalogEntry = catalogById.get(channel);
		const installedCatalogEntry = installedCatalogById.get(channel);
		if (catalogEntry) {
			const installExit = await installCatalogEntry(catalogEntry);
			if (installExit) return installExit;
			await refreshStatus(channel);
		} else if (installedCatalogEntry) {
			let plugin = await loadScopedChannelPlugin(channel, installedCatalogEntry.pluginId);
			if (!plugin && installedCatalogEntry.install?.npmSpec) {
				const disabledHint = resolveConfigDisabledHint(channel);
				if (disabledHint) {
					await noteDisabledBeforeSetup(prompter, channel, disabledHint);
					return "done";
				}
				const installExit = await installCatalogEntry(installedCatalogEntry);
				if (installExit) return installExit;
				plugin = getVisibleChannelPlugin(channel);
			}
			if (!plugin) {
				await prompter.note(t("wizard.channels.pluginNotAvailable", { channel }), t("wizard.channels.setupTitle"));
				return "done";
			}
			await refreshStatus(channel);
		} else {
			const fallbackCatalogEntry = getTrustedChannelPluginCatalogEntry(channel, {
				cfg: next,
				workspaceDir: resolveWorkspaceDir()
			});
			if (fallbackCatalogEntry?.install?.npmSpec) {
				const disabledHint = resolveConfigDisabledHint(channel);
				if (disabledHint) {
					await noteDisabledBeforeSetup(prompter, channel, disabledHint);
					return "done";
				}
				if (!getVisibleChannelPlugin(channel)) {
					const installExit = await installCatalogEntry(fallbackCatalogEntry);
					if (installExit) return installExit;
				}
				await refreshStatus(channel);
			} else if (!await enableBundledPluginForSetup(channel)) return "done";
		}
		const plugin = getVisibleChannelPlugin(channel);
		const adapter = getVisibleSetupFlowAdapter(channel);
		const label = plugin?.meta.label ?? catalogEntry?.meta.label ?? channel;
		const status = statusByChannel.get(channel);
		const configured = resumingDisabledChannel ? false : status?.configured ?? false;
		const configureInteractive = adapter?.configureInteractive;
		if (configureInteractive) {
			const outcome = await runScopedChannelStep$1(async (scopedPrompter, scopedOptions) => await configureInteractive({
				cfg: next,
				runtime,
				prompter: scopedPrompter,
				options: scopedOptions,
				accountOverrides,
				shouldPromptAccountIds,
				forceAllowFrom: forceAllowFromChannels.has(channel),
				configured,
				label
			}));
			if (outcome.status === "back") return returnToSelection();
			const custom = outcome.value;
			await withCommandPluginMetadata({
				config: next,
				workspaceDir: resolveWorkspaceDir()
			}, () => applyCustomSetupResult(channel, custom));
			return "done";
		}
		if ((await runScopedChannelStep$1(async (scopedPrompter, scopedOptions) => configured ? await handleConfiguredChannel(channel, label, scopedPrompter, scopedOptions) : await configureChannel(channel, scopedPrompter, scopedOptions))).status === "back") return returnToSelection();
		return "done";
	};
	const targetedSetupReturnedToPicker = targetedChannel ? await handleChannelChoice(targetedChannel) === "retry_selection" : false;
	if (!targetedChannel && options?.quickstartDefaults) {
		const skipValue = "__skip__";
		const quickstartInitialValue = options?.initialSelection?.[0] ?? skipValue;
		while (true) {
			const selectionOptions = await resolveSelectionOptions();
			const choice = await prompter.select({
				message: t("wizard.channels.selectQuickstart"),
				options: [{
					value: skipValue,
					label: t("common.skipForNow"),
					hint: t("wizard.channels.skipLaterHint", { command: formatCliCommand("openclaw channels add") })
				}, ...selectionOptions],
				initialValue: quickstartInitialValue,
				searchable: true
			});
			if (choice === skipValue) break;
			if (await handleChannelChoice(choice) === "done") break;
		}
	} else if (!targetedChannel || targetedSetupReturnedToPicker) {
		const doneValue = "__done__";
		const initialValue = options?.initialSelection?.[0] ?? quickstartDefault;
		while (true) {
			const selectionOptions = await resolveSelectionOptions();
			const choice = await prompter.select({
				message: t("wizard.channels.select"),
				options: [...selectionOptions, {
					value: doneValue,
					label: t("common.finished"),
					hint: selection.length > 0 ? t("wizard.channels.doneHint") : t("common.skipForNow")
				}],
				initialValue
			});
			if (choice === doneValue) break;
			await handleChannelChoice(choice);
			if (finishSetupRequested) break;
		}
	}
	options?.onSelection?.(selection);
	const selectedLines = resolveChannelSelectionNoteLines({
		cfg: next,
		workspaceDir: resolveWorkspaceDir(),
		installedPlugins: listVisibleInstalledPlugins(),
		selection
	});
	if (selectedLines.length > 0) await prompter.note(selectedLines.join("\n"), t("wizard.channels.selectedTitle"));
	if (!options?.skipDmPolicyPrompt) next = await withCommandPluginMetadata({
		config: next,
		workspaceDir: resolveWorkspaceDir()
	}, () => maybeConfigureDmPolicies({
		cfg: next,
		selection,
		prompter,
		accountIdsByChannel,
		resolveAdapter: getVisibleSetupFlowAdapter
	}));
	if (hasConfiguredCommandOwners(next)) return next;
	const ownerChannels = [];
	await withCommandPluginMetadata({
		config: next,
		workspaceDir: resolveWorkspaceDir()
	}, async () => {
		for (const id of selection) try {
			if (resolveConfigDisabledHint(id) || await resolveAccountDisabledHint(id, accountIdsByChannel.get(id))) continue;
			if ((await refreshStatus(id))?.configured) ownerChannels.push({
				id,
				label: getVisibleChannelPlugin(id)?.meta.label ?? id
			});
		} catch (error) {
			await prompter.note(`Status unavailable (${sanitizeTerminalText(formatErrorMessage(error))}).\nRetry: ${formatCliCommand(`openclaw channels status --channel ${id}`)}`, t("wizard.channels.statusTitle"));
		}
	});
	return await maybeConfigureCommandOwner({
		cfg: next,
		channels: ownerChannels,
		prompter
	});
}
//#endregion
export { setupChannels as i, createChannelSetupHooks as n, runCollectedChannelOnboardingPostWriteHooks as r, createChannelOnboardingPostWriteHook as t };
