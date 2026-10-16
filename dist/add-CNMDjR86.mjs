import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-CuVhdCBs.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-DbRsdayc.mjs";
import { n as resolveChannelSetupExecutionAdapter } from "./setup-contract-CSCVWILe.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { i as getBundledChannelSetupPlugin } from "./bundled-DN3obb3J.mjs";
import { i as resolveChannelAccountKey } from "./account-lookup-D_rRUHd5.mjs";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { c as formatUnknownChannelMessage, l as formatUnsupportedChannelActionMessage } from "./error-format-BaRMqGR7.mjs";
import { r as parseOptionalDelimitedEntries } from "./helpers-Bm4RKejp.mjs";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import { s as moveSingleAccountChannelSectionToDefaultAccount } from "./setup-helpers-CDK4xLs4.mjs";
import { t as createClackPrompter } from "./clack-prompter-D76Rt341.mjs";
import { n as channelOmitsEnvBackedSetupOption, r as resolveChannelSetupCliOptionMetadata } from "./cli-add-options-tMjw6cxU.mjs";
import { t as parseAccountSelector } from "./account-selector-DE7PugtW.mjs";
import { t as resolveChannelSetupOwner } from "./owner-BTrte0Oj.mjs";
import { i as withCommandPluginMetadata, r as requireValidConfigForWrite } from "./config-validation-Cf7I75MX.mjs";
import { t as normalizeExternalChannelSetupConfig } from "./config-compatibility-Bxp7TfuF.mjs";
import { t as persistChannelPluginConfig } from "./plugin-config-persistence-C_Uq6HGE.mjs";
import "./shared-Dy92SoKk.mjs";
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
const loadChannelSetupPluginInstall = createLazyPromise(() => import("./plugin-install-B2A3_2ek.mjs"));
const loadOnboardChannels = createLazyPromise(() => import("./channel-setup-C-idrf8N.mjs"));
const CHANNEL_ADD_CONTROL_OPTION_KEYS = /* @__PURE__ */ new Set([
	"agent",
	"channel",
	"account"
]);
async function resolveCatalogChannelEntry(raw, cfg, resolveWorkspaceDir) {
	const trimmed = normalizeOptionalLowercaseString(raw);
	if (!trimmed) return;
	const { resolveTrustedChannelCatalogInput } = await import("./trusted-catalog-DhtGwlNu.mjs");
	return resolveTrustedChannelCatalogInput(trimmed, {
		cfg,
		workspaceDir: resolveWorkspaceDir()
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
	if (params?.hasFlags === false) {
		const { resolveInitialWizardChannelTarget, runChannelsAddWizardFlow, selectChannelSetupOwner } = await import("./add-wizard-zzLANe47.mjs");
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
			runtime,
			prompter,
			workspaceDir,
			...target.kind === "resolved" ? { initialChannel: target.channel } : {},
			...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
		});
		return;
	}
	const rawChannel = opts.channel ?? "";
	let channel = normalizeAnyChannelId(rawChannel);
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
		const { isCatalogChannelInstalled } = await import("./discovery-CIjsaiuf.mjs");
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
		channel ??= normalizeAnyChannelId(catalogEntry.id) ?? catalogEntry.id;
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
		const committed = await persistChannelPluginConfig({
			cfg: nextConfig,
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
				runtime,
				...params?.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
			});
		}
	});
}
//#endregion
export { channelLabel as n, applyChannelAccountRemoval as r, channelsAddCommand as t };
