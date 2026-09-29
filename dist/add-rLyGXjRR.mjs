import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { n as resolveChannelSetupExecutionAdapter } from "./setup-contract-6y0bhIm8.mjs";
import { i as getBundledChannelSetupPlugin } from "./bundled-D8dZgG2d.mjs";
import { c as formatUnknownChannelMessage, l as formatUnsupportedChannelActionMessage } from "./error-format-B21fL1a_.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import { i as resolveChannelAccountKey } from "./account-lookup-CVHGcV8B.mjs";
import { i as normalizeChannelId, n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-DDMKSyro.mjs";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-B0PJDNFd.mjs";
import { r as parseOptionalDelimitedEntries } from "./helpers-t_ym8v5h.mjs";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.mjs";
import { s as moveSingleAccountChannelSectionToDefaultAccount } from "./setup-helpers-gXEiNGC9.mjs";
import { t as createClackPrompter } from "./clack-prompter-D8DhCvTT.mjs";
import { n as resolveChannelSetupCliOptionMetadata } from "./cli-add-options-DXnWcOy8.mjs";
import { t as parseAccountSelector } from "./account-selector-DE7PugtW.mjs";
import { t as resolveChannelSetupOwner } from "./owner-B6TG8Er8.mjs";
import { i as withCommandPluginMetadata, r as requireValidConfigForWrite } from "./config-validation-CdWq9kXm.mjs";
import { t as normalizeExternalChannelSetupConfig } from "./config-compatibility-DalBBGSA.mjs";
import { l as shouldUseWizard } from "./shared-1R7GTSZV.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/channels/plugins/account-config-mutation.ts
function resolveMissingSetupEnvMessage(plugin, input) {
	if (!plugin.setupContract || !isRecord(input) || input.useEnv !== true) return;
	const useEnvField = plugin.setupContract.metadata.fields.find((field) => field.kind === "boolean" && field.key === "useEnv");
	if (!useEnvField?.envVars?.length) return;
	const { envVars, envVarMode } = useEnvField;
	const missing = envVars.filter((name) => !process.env[name]?.trim());
	if (envVarMode === "any" ? missing.length < envVars.length : !missing.length) return;
	return envVarMode === "any" ? `Set one of these environment variables before using --use-env: ${missing.join(", ")}.` : `Set these environment variables before using --use-env: ${missing.join(", ")}.`;
}
async function prepareChannelAccountConfiguration(params) {
	const setup = resolveChannelSetupExecutionAdapter(params.plugin);
	if (!setup?.applyAccountConfig) return err({ kind: "unsupported" });
	const rawInput = params.resolveInput();
	let input;
	if (params.plugin.setupContract) {
		const parsed = params.plugin.setupContract.parseInput(rawInput);
		if (!parsed.ok) return err({
			kind: "invalid-input",
			message: parsed.error
		});
		input = parsed.value;
	} else input = rawInput;
	const requestedAccountId = params.requestedAccountId === void 0 ? void 0 : resolveChannelAccountKey(void 0, params.requestedAccountId, params.plugin.id, void 0, void 0, { allowMissing: true });
	const accountId = setup.resolveAccountId?.({
		cfg: params.cfg,
		accountId: requestedAccountId,
		input
	}) ?? normalizeAccountId(requestedAccountId);
	if (setup.prepareAccountConfigInput) {
		await params.beforePersistentEffect?.();
		input = await setup.prepareAccountConfigInput({
			cfg: params.cfg,
			accountId,
			input,
			runtime: params.runtime
		});
	}
	const validationError = setup.validateInput?.({
		cfg: params.cfg,
		accountId,
		input
	});
	if (validationError) return err({
		kind: "invalid-input",
		message: validationError
	});
	const missingEnvMessage = resolveMissingSetupEnvMessage(params.plugin, input);
	if (missingEnvMessage) return err({
		kind: "invalid-input",
		message: missingEnvMessage
	});
	return ok({
		plugin: params.plugin,
		setup,
		applyAccountConfig: setup.applyAccountConfig,
		accountId,
		input
	});
}
async function applyPreparedChannelAccountConfiguration(params) {
	const { accountId, applyAccountConfig, input, plugin, setup } = params.prepared;
	const configAccountId = normalizeAccountId(accountId);
	let nextConfig = params.cfg;
	if (accountId !== "default") nextConfig = moveSingleAccountChannelSectionToDefaultAccount({
		cfg: nextConfig,
		channelKey: params.channel,
		setupSurface: setup
	});
	nextConfig = applyAccountConfig({
		cfg: nextConfig,
		accountId: configAccountId,
		input
	});
	if (plugin.lifecycle?.onAccountConfigChanged) {
		await params.beforePersistentEffect?.();
		await plugin.lifecycle.onAccountConfigChanged({
			prevCfg: params.cfg,
			nextCfg: nextConfig,
			accountId,
			runtime: params.runtime
		});
	}
	return {
		nextConfig,
		accountId,
		input,
		...setup.afterAccountConfigWritten ? { afterAccountConfigWritten: setup.afterAccountConfigWritten } : {}
	};
}
async function applyChannelAccountRemoval(params) {
	const { action, plugin } = params;
	const accountId = normalizeAccountId(params.accountId);
	if (action === "delete") {
		if (!plugin.config.deleteAccount) return err({
			kind: "unsupported-action",
			action
		});
		const accountIds = plugin.config.listAccountIds(params.cfg);
		if (!accountIds.some((id) => normalizeOptionalAccountId(id) === accountId)) return err({
			kind: "unknown-account",
			action,
			accountIds
		});
		const previousConfigJson = JSON.stringify(params.cfg);
		const nextConfig = plugin.config.deleteAccount({
			cfg: { ...params.cfg },
			accountId
		});
		const nextConfigJson = JSON.stringify(nextConfig);
		if (isDeepStrictEqual(JSON.parse(previousConfigJson), JSON.parse(nextConfigJson))) return err({
			kind: "nothing-to-remove",
			action,
			accountIds
		});
		await params.beforeRemoval?.();
		await plugin.lifecycle?.onAccountRemoved?.({
			prevCfg: params.cfg,
			accountId,
			runtime: params.runtime
		});
		return ok({ nextConfig });
	}
	if (!plugin.config.setAccountEnabled) return err({
		kind: "unsupported-action",
		action
	});
	const accountIds = plugin.config.listAccountIds(params.cfg);
	if (!accountIds.some((id) => normalizeOptionalAccountId(id) === accountId)) return err({
		kind: "unknown-account",
		action,
		accountIds
	});
	const nextConfig = plugin.config.setAccountEnabled({
		cfg: { ...params.cfg },
		accountId,
		enabled: false
	});
	await params.beforeRemoval?.();
	await plugin.lifecycle?.onAccountConfigChanged?.({
		prevCfg: params.cfg,
		nextCfg: nextConfig,
		accountId,
		runtime: params.runtime
	});
	return ok({ nextConfig });
}
//#endregion
//#region src/commands/channels/runtime-label.ts
/** Resolve a display label from loaded, setup-only, or bundled channel plugin metadata. */
const channelLabel = (channel) => {
	return (getLoadedChannelPlugin(channel) ?? getBundledChannelSetupPlugin(channel) ?? getChannelPlugin(channel))?.meta.label ?? channel;
};
//#endregion
//#region src/commands/channels/add.ts
const loadChannelSetupPluginInstall = createLazyPromise(() => import("./plugin-install-WtuocCri.mjs"));
const loadOnboardChannels = createLazyPromise(() => import("./onboard-channels-C20jcRAJ.mjs"));
const CHANNEL_ADD_CONTROL_OPTION_KEYS = /* @__PURE__ */ new Set([
	"agent",
	"channel",
	"account"
]);
async function resolveCatalogChannelEntry(raw, cfg, resolveWorkspaceDir) {
	const trimmed = normalizeOptionalLowercaseString(raw);
	if (!trimmed) return;
	return (await import("./trusted-catalog-AeIFtBbr.mjs").then(({ listTrustedChannelPluginCatalogEntries }) => listTrustedChannelPluginCatalogEntries({
		cfg,
		workspaceDir: resolveWorkspaceDir()
	}))).find((entry) => {
		if (normalizeOptionalLowercaseString(entry.id) === trimmed) return true;
		return (entry.meta.aliases ?? []).some((alias) => normalizeOptionalLowercaseString(alias) === trimmed);
	});
}
function buildChannelSetupInput(opts) {
	const input = {};
	const { valueMetadataByAttributeName } = resolveChannelSetupCliOptionMetadata(opts.channel);
	for (const [key, value] of Object.entries(opts)) {
		if (CHANNEL_ADD_CONTROL_OPTION_KEYS.has(key) || value === void 0) continue;
		const metadata = valueMetadataByAttributeName.get(key);
		if (metadata?.valueType !== "int") {
			input[key] = metadata?.valueType === "list" ? Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : parseOptionalDelimitedEntries(typeof value === "string" ? value : void 0) : value;
			continue;
		}
		if (value === null) {
			input[key] = void 0;
			continue;
		}
		const parsed = parseStrictNonNegativeInteger(value);
		if (parsed === void 0) throw new Error(`${metadata.longFlag} must be a non-negative integer.`);
		input[key] = parsed;
	}
	return input;
}
function buildChannelOwnedSetupInput(opts) {
	return Object.fromEntries(Object.entries(opts).filter(([key, value]) => !CHANNEL_ADD_CONTROL_OPTION_KEYS.has(key) && value !== void 0));
}
/** Add or configure a channel account, using the wizard when no concrete flags are supplied. */
async function channelsAddCommand(opts, runtime = defaultRuntime, params) {
	try {
		return await channelsAddCommandImpl(opts, runtime, params);
	} catch (err) {
		if (err instanceof WizardCancelledError) {
			runtime.exit(1);
			return;
		}
		throw err;
	}
}
async function channelsAddCommandImpl(opts, runtime, params) {
	parseAccountSelector(opts.account);
	const writeSnapshot = await requireValidConfigForWrite(runtime);
	if (!writeSnapshot) return;
	return configureChannelAccount(writeSnapshot, opts, runtime, params);
}
async function configureChannelAccount(writeSnapshot, opts, runtime, params) {
	const cfg = writeSnapshot.snapshot.sourceConfig;
	let nextConfig = cfg;
	let pluginRegistrySourceChanged = false;
	if (shouldUseWizard(params)) {
		const { resolveInitialWizardChannelTarget, runChannelsAddWizardFlow, selectChannelSetupOwner } = await import("./add-wizard-BPaiP8UC.mjs");
		const prompter = createClackPrompter();
		if (!isTerminalInteractive()) {
			runtime.error("Interactive channel setup requires a TTY. Use `openclaw channels add --channel <id> --use-env` or pass the channel's credential flags for non-interactive setup.");
			runtime.exit(1);
			return;
		}
		const { agentId, workspaceDir } = await selectChannelSetupOwner(writeSnapshot, prompter, opts.agent);
		const target = await resolveInitialWizardChannelTarget(opts.channel, cfg, workspaceDir);
		if (target.kind === "unresolved") {
			runtime.error(target.message);
			runtime.exit(1);
			return;
		}
		await runChannelsAddWizardFlow({
			writeSnapshot,
			agentId,
			runtime,
			prompter,
			workspaceDir,
			...target.kind === "resolved" ? { initialChannel: target.channel } : {},
			...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
		});
		return;
	}
	const rawChannel = opts.channel ?? "";
	let channel = normalizeChannelId(rawChannel);
	let preparedWorkspaceDir;
	const resolveWorkspaceDir = () => preparedWorkspaceDir ??= resolveChannelSetupOwner(cfg, opts.agent).workspaceDir;
	let catalogEntry = await resolveCatalogChannelEntry(rawChannel, nextConfig, resolveWorkspaceDir);
	const loadScopedPlugin = async (channelId, pluginId) => {
		const existing = getLoadedChannelPlugin(channelId);
		if (existing?.setupContract?.applyAccountConfig || existing?.setup?.applyAccountConfig) return existing;
		const { loadChannelSetupPluginRegistrySnapshotForChannel } = await loadChannelSetupPluginInstall();
		const snapshot = loadChannelSetupPluginRegistrySnapshotForChannel({
			cfg: nextConfig,
			runtime,
			channel: channelId,
			...pluginId ? { pluginId } : {},
			workspaceDir: resolveWorkspaceDir(),
			forceSetupOnlyChannelPlugins: true
		});
		return snapshot.channelSetups.find((entry) => entry.plugin.id === channelId)?.plugin ?? getBundledChannelSetupPlugin(channelId) ?? snapshot.channels.find((entry) => entry.plugin.id === channelId)?.plugin ?? existing;
	};
	if (catalogEntry) {
		const workspaceDir = resolveWorkspaceDir();
		const { isCatalogChannelInstalled } = await import("./discovery-DjM1QfZi.mjs");
		const registeredPlugin = channel ? getLoadedChannelPlugin(channel) : void 0;
		const bundledSetupPlugin = channel ? getBundledChannelSetupPlugin(channel) : void 0;
		if (!registeredPlugin && !bundledSetupPlugin && !isCatalogChannelInstalled({
			cfg: nextConfig,
			entry: catalogEntry,
			workspaceDir
		})) {
			const { ensureChannelSetupPluginInstalled } = await loadChannelSetupPluginInstall();
			const prompter = createClackPrompter();
			const result = await ensureChannelSetupPluginInstalled({
				cfg: nextConfig,
				entry: catalogEntry,
				prompter,
				runtime,
				workspaceDir,
				promptInstall: false,
				...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
			});
			nextConfig = result.cfg;
			if (!result.installed) return;
			pluginRegistrySourceChanged = true;
			catalogEntry = {
				...catalogEntry,
				...result.pluginId ? { pluginId: result.pluginId } : {}
			};
		}
		channel ??= normalizeChannelId(catalogEntry.id) ?? catalogEntry.id;
	}
	if (!channel) {
		const hint = catalogEntry ? `Plugin ${catalogEntry.meta.label} could not be loaded after install. Run openclaw doctor --fix, then retry openclaw channels add.` : formatUnknownChannelMessage({ channel: rawChannel });
		runtime.error(hint);
		runtime.exit(1);
		return;
	}
	const selectedChannel = channel;
	return withCommandPluginMetadata({
		config: nextConfig,
		workspaceDir: resolveWorkspaceDir()
	}, async () => {
		const plugin = await loadScopedPlugin(selectedChannel, catalogEntry?.pluginId);
		if (!plugin) {
			runtime.error(`${formatUnsupportedChannelActionMessage({
				channel: selectedChannel,
				action: "non-interactive add"
			})} Run ${formatCliCommand("openclaw channels add")} with no flags for guided setup.`);
			runtime.exit(1);
			return;
		}
		const prepared = await prepareChannelAccountConfiguration({
			cfg: nextConfig,
			plugin,
			requestedAccountId: opts.account,
			resolveInput: () => plugin.setupContract ? buildChannelOwnedSetupInput(opts) : buildChannelSetupInput(opts),
			runtime,
			...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
		});
		if (!prepared.ok) {
			runtime.error(prepared.error.kind === "unsupported" ? `${formatUnsupportedChannelActionMessage({
				channel: selectedChannel,
				action: "non-interactive add"
			})} Run ${formatCliCommand("openclaw channels add")} with no flags for guided setup.` : prepared.error.message);
			runtime.exit(1);
			return;
		}
		const applied = await applyPreparedChannelAccountConfiguration({
			cfg: nextConfig,
			channel: selectedChannel,
			prepared: prepared.value,
			runtime,
			...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
		});
		nextConfig = normalizeExternalChannelSetupConfig({
			cfg: applied.nextConfig,
			channel: selectedChannel
		});
		await params?.beforePersistentEffect?.();
		const committed = await commitConfigWithPendingPluginInstalls({
			sourceConfig: nextConfig,
			writeOptions: writeSnapshot.writeOptions,
			baseHash: writeSnapshot.snapshot.hash
		});
		if (committed.movedInstallRecords || pluginRegistrySourceChanged) await refreshPluginRegistryAfterConfigMutation({
			reason: "source-changed",
			...committed.movedInstallRecords ? { installRecords: committed.installRecords } : {},
			logger: { warn: (message) => runtime.log(message) }
		});
		runtime.log(`Added ${plugin.meta.label ?? channelLabel(selectedChannel)} account "${applied.accountId}".`);
		const afterAccountConfigWritten = applied.afterAccountConfigWritten;
		if (afterAccountConfigWritten) {
			const { runCollectedChannelOnboardingPostWriteHooks } = await loadOnboardChannels();
			await runCollectedChannelOnboardingPostWriteHooks({
				hooks: [{
					channel: selectedChannel,
					accountId: applied.accountId,
					run: async ({ cfg: writtenCfg, runtime: hookRuntime }) => await afterAccountConfigWritten({
						previousCfg: cfg,
						cfg: writtenCfg,
						accountId: applied.accountId,
						input: applied.input,
						runtime: hookRuntime
					})
				}],
				configPath: committed.path,
				runtime,
				...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
			});
		}
	});
}
//#endregion
export { channelLabel as n, applyChannelAccountRemoval as r, channelsAddCommand as t };
