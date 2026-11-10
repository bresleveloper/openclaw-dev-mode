import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { n as resolveChannelSetupExecutionAdapter } from "./setup-contract-DgLM9zTf.mjs";
import { i as getBundledChannelSetupPlugin } from "./bundled-CEh6W_x7.mjs";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import { i as resolveChannelAccountKey } from "./account-lookup-Dm5zJglt.mjs";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.mjs";
import { r as parseOptionalDelimitedEntries } from "./helpers-CYrCYT-h.mjs";
import { c as formatUnknownChannelMessage, l as formatUnsupportedChannelActionMessage } from "./error-format-Cd0oOG4L.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-D92bdO16.mjs";
import { s as moveSingleAccountChannelSectionToDefaultAccount } from "./setup-helpers-BkS00G-w.mjs";
import { t as createClackPrompter } from "./clack-prompter-CALyuZTx.mjs";
import { n as resolveChannelSetupCliOptionMetadata, t as channelOmitsEnvBackedSetupOption } from "./cli-add-options-DlqKHkQZ.mjs";
import { t as parseAccountSelector } from "./account-selector-DE7PugtW.mjs";
import { t as resolveChannelSetupOwner } from "./owner-Bw1UJyA2.mjs";
import { i as withCommandPluginMetadata, r as requireValidConfigForWrite } from "./config-validation-CHn1iJgM.mjs";
import { t as normalizeExternalChannelSetupConfig } from "./config-compatibility-CiQVv1L4.mjs";
import { t as persistChannelPluginConfig } from "./plugin-config-persistence-CbUqg01M.mjs";
import "./shared-BrF4w8qF.mjs";
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
	let input = params.resolveInput();
	if (params.plugin.setupContract) {
		const parsed = params.plugin.setupContract.parseInput(input);
		if (!parsed.ok) return err({
			kind: "invalid-input",
			message: parsed.error
		});
		input = parsed.value;
	}
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
const loadOnboardChannels = createLazyPromise(() => import("./channel-setup-DW-kKvj1.mjs"));
const CHANNEL_ADD_CONTROL_OPTION_KEYS = /* @__PURE__ */ new Set([
	"agent",
	"channel",
	"account"
]);
function buildChannelSetupInput(opts, mode) {
	const valueMetadataByAttributeName = mode === "legacy" ? resolveChannelSetupCliOptionMetadata(opts.channel).valueMetadataByAttributeName : null;
	const entries = Object.entries(opts).filter(([key, value]) => !CHANNEL_ADD_CONTROL_OPTION_KEYS.has(key) && value !== void 0);
	if (!valueMetadataByAttributeName) return Object.fromEntries(entries);
	const input = {};
	for (const [key, value] of entries) {
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
/** Add or configure a channel account, using the wizard when no concrete flags are supplied. */
async function channelsAddCommand(opts, runtime = defaultRuntime, params) {
	try {
		parseAccountSelector(opts.account);
		const writeSnapshot = await requireValidConfigForWrite(runtime);
		if (!writeSnapshot) return;
		return await configureChannelAccount(writeSnapshot, opts, runtime, params);
	} catch (err) {
		if (err instanceof WizardCancelledError) {
			runtime.exit(1);
			return;
		}
		throw err;
	}
}
async function configureChannelAccount(writeSnapshot, opts, runtime, params) {
	const cfg = writeSnapshot.snapshot.sourceConfig;
	let nextConfig = cfg;
	let pluginRegistrySourceChanged = false;
	const effectContext = () => ({
		runtime,
		...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
	});
	if (params?.hasFlags === false) {
		const { resolveInitialWizardChannelTarget, runChannelsAddWizardFlow, selectChannelSetupOwner } = await import("./add-wizard-DXeKFpkK.mjs");
		const prompter = createClackPrompter();
		if (!isTerminalInteractive()) {
			runtime.error(channelOmitsEnvBackedSetupOption(opts.channel) ? `Interactive channel setup requires a TTY. Run ${formatCliCommand(`openclaw channels add --channel ${opts.channel?.trim() || "<id>"} --help`)} to list the setup flags this channel accepts, then pass them for non-interactive setup.` : "Interactive channel setup requires a TTY. Use `openclaw channels add --channel <id> --use-env` or pass the channel's credential flags for non-interactive setup.");
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
			prompter,
			workspaceDir,
			...target.kind === "resolved" ? { initialChannel: target.channel } : {},
			...effectContext()
		});
		return;
	}
	const rawChannel = opts.channel ?? "";
	let channel = normalizeAnyChannelId(rawChannel);
	let preparedWorkspaceDir;
	const resolveWorkspaceDir = () => preparedWorkspaceDir ??= resolveChannelSetupOwner(cfg, opts.agent).workspaceDir;
	const catalogChannel = normalizeOptionalLowercaseString(rawChannel);
	let catalogEntry = catalogChannel ? (await import("./trusted-catalog-CslF7T7Y.mjs")).resolveTrustedChannelCatalogInput(catalogChannel, {
		cfg: nextConfig,
		workspaceDir: resolveWorkspaceDir()
	}) : void 0;
	const loadScopedPlugin = async (channelId, pluginId) => {
		const existing = getLoadedChannelPlugin(channelId);
		if (existing?.setupContract?.applyAccountConfig || existing?.setup?.applyAccountConfig) return existing;
		const { loadChannelSetupPluginRegistrySnapshotForChannel } = await import("./plugin-install-C8HpuXxu.mjs");
		const snapshot = await loadChannelSetupPluginRegistrySnapshotForChannel({
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
		const { isCatalogChannelInstalled } = await import("./discovery-BhFSwGtU.mjs");
		const registeredPlugin = channel ? getLoadedChannelPlugin(channel) : void 0;
		const bundledSetupPlugin = channel ? getBundledChannelSetupPlugin(channel) : void 0;
		if (!registeredPlugin && !bundledSetupPlugin && !isCatalogChannelInstalled({
			cfg: nextConfig,
			entry: catalogEntry,
			workspaceDir
		})) {
			const { ensureChannelSetupPluginInstalled } = await import("./plugin-install-C8HpuXxu.mjs");
			const prompter = createClackPrompter();
			const result = await ensureChannelSetupPluginInstalled({
				cfg: nextConfig,
				entry: catalogEntry,
				prompter,
				workspaceDir,
				promptInstall: false,
				...effectContext()
			});
			nextConfig = result.cfg;
			if (!result.installed) return;
			pluginRegistrySourceChanged = true;
			catalogEntry = {
				...catalogEntry,
				...result.pluginId ? { pluginId: result.pluginId } : {}
			};
		}
		channel ??= normalizeAnyChannelId(catalogEntry.id) ?? catalogEntry.id;
	}
	if (!channel) {
		const hint = catalogEntry ? `Plugin ${catalogEntry.meta.label} could not be loaded after install. Run openclaw doctor --fix, then retry openclaw channels add.` : formatUnknownChannelMessage({ channel: rawChannel });
		runtime.error(hint);
		runtime.exit(1);
		return;
	}
	const selectedChannel = channel;
	const unsupportedAddMessage = () => `${formatUnsupportedChannelActionMessage({
		channel: selectedChannel,
		action: "non-interactive add"
	})} Run ${formatCliCommand("openclaw channels add")} with no flags for guided setup.`;
	return withCommandPluginMetadata({
		config: nextConfig,
		workspaceDir: resolveWorkspaceDir()
	}, async () => {
		const plugin = await loadScopedPlugin(selectedChannel, catalogEntry?.pluginId);
		if (!plugin) {
			runtime.error(unsupportedAddMessage());
			runtime.exit(1);
			return;
		}
		const prepared = await prepareChannelAccountConfiguration({
			cfg: nextConfig,
			plugin,
			requestedAccountId: opts.account,
			resolveInput: () => buildChannelSetupInput(opts, plugin.setupContract ? "contract" : "legacy"),
			...effectContext()
		});
		if (!prepared.ok) {
			runtime.error(prepared.error.kind === "unsupported" ? unsupportedAddMessage() : prepared.error.message);
			runtime.exit(1);
			return;
		}
		const applied = await applyPreparedChannelAccountConfiguration({
			cfg: nextConfig,
			channel: selectedChannel,
			prepared: prepared.value,
			...effectContext()
		});
		nextConfig = normalizeExternalChannelSetupConfig({
			cfg: applied.nextConfig,
			channel: selectedChannel
		});
		const committed = await persistChannelPluginConfig({
			cfg: nextConfig,
			setup: {
				previousConfig: cfg,
				beforePersistentEffect: params?.beforePersistentEffect,
				assertCurrent: writeSnapshot.writeOptions.assertConfigPathForWrite
			},
			pluginInstalled: pluginRegistrySourceChanged,
			writeOptions: writeSnapshot.writeOptions,
			baseHash: writeSnapshot.snapshot.hash,
			runtime
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
				...effectContext()
			});
		}
	});
}
//#endregion
export { channelLabel as n, applyChannelAccountRemoval as r, channelsAddCommand as t };
