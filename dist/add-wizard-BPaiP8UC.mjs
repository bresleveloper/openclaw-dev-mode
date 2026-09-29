import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { O as listAgentIds, f as resolveConfiguredAgentId, t as AgentSelectionRequiredError, y as tryResolveAgentOperationAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { n as resolveChannelSetupExecutionAdapter } from "./setup-contract-6y0bhIm8.mjs";
import { f as readCurrentConfigForPolicyCheck, u as readConfigFileSnapshotForWrite } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { c as formatUnknownChannelMessage } from "./error-format-B21fL1a_.mjs";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-DDMKSyro.mjs";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-B0PJDNFd.mjs";
import { t as describeBinding } from "./agents.binding-format-BRYI5aWJ.mjs";
import { t as applyAgentBindings } from "./agents.bindings-BDLKxy0x.mjs";
import { t as resolveChannelSetupOwner } from "./owner-B6TG8Er8.mjs";
import { i as withCommandPluginMetadata } from "./config-validation-CdWq9kXm.mjs";
//#region src/commands/channels/add-mutators.ts
/** Apply a display name to a channel account when the plugin supports account naming. */
function applyAccountName(params) {
	const accountId = normalizeAccountId(params.accountId);
	const plugin = params.plugin ?? getChannelPlugin(params.channel);
	const apply = plugin ? resolveChannelSetupExecutionAdapter(plugin)?.applyAccountName : void 0;
	return apply ? apply({
		cfg: params.cfg,
		accountId,
		name: params.name
	}) : params.cfg;
}
//#endregion
//#region src/commands/channels/add-wizard.ts
function unresolvedInitialWizardChannelTarget(channel) {
	return {
		kind: "unresolved",
		message: formatUnknownChannelMessage({ channel })
	};
}
/** Select a setup owner before workspace-scoped channel discovery. */
async function selectChannelSetupOwner(writeSnapshot, prompter, requestedAgentId) {
	const cfg = writeSnapshot.snapshot.sourceConfig;
	try {
		return resolveChannelSetupOwner(cfg, requestedAgentId);
	} catch (error) {
		if (!(error instanceof AgentSelectionRequiredError)) throw error;
	}
	const selectedAgent = await prompter.select({
		message: "Set up channels for agent",
		options: listAgentIds(cfg).map((agentId) => ({
			value: { agentId },
			label: agentId
		}))
	});
	if (!isRecord(selectedAgent) || typeof selectedAgent.agentId !== "string") throw new Error("Invalid channel setup owner selection");
	writeSnapshot.writeOptions.assertConfigPathForWrite?.();
	const currentConfig = readCurrentConfigForPolicyCheck({
		configPath: writeSnapshot.snapshot.path,
		env: process.env
	});
	const agentId = resolveConfiguredAgentId(currentConfig, selectedAgent.agentId);
	return resolveChannelSetupOwner(currentConfig, agentId);
}
/** Resolve omitted, matched, and unmatched channel targets without collapsing caller intent. */
async function resolveInitialWizardChannelTarget(raw, cfg, workspaceDir) {
	if (raw === void 0) return { kind: "omitted" };
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return unresolvedInitialWizardChannelTarget("");
	const [{ listActiveChannelSetupPlugins }, { resolveChannelSetupEntries }] = await Promise.all([import("./setup-registry-CrCS5UfV.mjs"), import("./discovery-DjM1QfZi.mjs")]);
	const resolved = resolveChannelSetupEntries({
		cfg,
		installedPlugins: listActiveChannelSetupPlugins(),
		workspaceDir: workspaceDir ?? resolveChannelSetupOwner(cfg).workspaceDir
	});
	const matchedEntry = resolved.entries.find((candidate) => normalizeOptionalLowercaseString(candidate.id) === normalized) ?? resolved.entries.find((candidate) => (candidate.meta.aliases ?? []).some((alias) => normalizeOptionalLowercaseString(alias) === normalized));
	return matchedEntry ? {
		kind: "resolved",
		channel: matchedEntry.id
	} : unresolvedInitialWizardChannelTarget(raw.trim());
}
/** Run the interactive channel-setup flow and persist the resulting config. */
async function runChannelsAddWizardFlow(params) {
	const { writeSnapshot, runtime, prompter } = params;
	const { sourceConfig: cfg, hash: baseHash } = writeSnapshot.snapshot;
	const [{ buildAgentSummaries }, onboardChannels] = await Promise.all([import("./agents.config-C-WUI4V_.mjs"), import("./onboard-channels-C20jcRAJ.mjs")]);
	const channelSetup = onboardChannels.createChannelSetupHooks({
		runtime,
		...params.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
	});
	let selection = [];
	const accountIds = {};
	const resolvedPlugins = /* @__PURE__ */ new Map();
	await prompter.intro("Channel setup");
	let nextConfig = await onboardChannels.setupChannels(cfg, runtime, prompter, {
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		...params.initialChannel ? { initialSelection: [params.initialChannel] } : {},
		...params.initialChannel ? { finishAfterInitialSelection: true } : {},
		allowDisable: false,
		allowIMessageInstall: true,
		allowSignalInstall: true,
		...params.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {},
		...params.deferDeviceLinkToClient ? { deferDeviceLinkToClient: true } : {},
		onPostWriteHook: (hook) => channelSetup.onPostWriteHook(hook),
		promptAccountIds: true,
		deferStatusUntilSelection: true,
		skipStatusNote: true,
		onSelection: (value) => {
			selection = value;
		},
		onAccountId: (channel, accountId) => {
			accountIds[channel] = accountId;
		},
		onResolvedPlugin: (channel, plugin) => {
			resolvedPlugins.set(channel, plugin);
		}
	});
	const commitWizardConfig = async (config) => {
		await params.beforePersistentEffect?.();
		const committed = await commitConfigWithPendingPluginInstalls({
			sourceConfig: config,
			writeOptions: writeSnapshot.writeOptions,
			...baseHash !== void 0 ? { baseHash } : {}
		});
		if (committed.movedInstallRecords) await refreshPluginRegistryAfterConfigMutation({
			reason: "source-changed",
			installRecords: committed.installRecords,
			logger: { warn: (message) => runtime.log(message) }
		});
		await channelSetup.runPostWriteHooks(committed.path);
		return committed.nextConfig;
	};
	if (selection.length === 0) {
		if (nextConfig !== cfg) {
			await commitWizardConfig(nextConfig);
			await prompter.outro("Channels updated.");
			return;
		}
		await prompter.outro("No channel changes made.");
		return;
	}
	const usesTargetedDefaults = params.initialChannel !== void 0 && selection.length === 1 && selection[0] === params.initialChannel;
	if (usesTargetedDefaults ? false : await prompter.confirm({
		message: "Name these channel accounts now? (optional)",
		initialValue: false
	})) await withCommandPluginMetadata({
		config: nextConfig,
		workspaceDir: params.workspaceDir
	}, async () => {
		for (const channel of selection) {
			const accountId = accountIds[channel] ?? "default";
			const plugin = resolvedPlugins.get(channel) ?? getLoadedChannelPlugin(channel);
			const account = plugin?.config.resolveAccount(nextConfig, accountId);
			const existingName = (plugin?.config.describeAccount?.(account, nextConfig))?.name ?? account?.name;
			const name = await prompter.text({
				message: `${channel} display name for account "${accountId}"`,
				initialValue: existingName
			});
			if (name?.trim()) nextConfig = applyAccountName({
				cfg: nextConfig,
				channel,
				accountId,
				name,
				plugin
			});
		}
	});
	const bindTargets = selection.map((channel) => ({
		channel,
		accountId: accountIds[channel]?.trim()
	})).filter((value) => Boolean(value.accountId));
	if (bindTargets.length > 0) {
		const agentSummaries = buildAgentSummaries(nextConfig);
		if (usesTargetedDefaults && agentSummaries.length <= 1 ? false : usesTargetedDefaults ? true : await prompter.confirm({
			message: "Route these channel accounts to agents now?",
			initialValue: true
		})) {
			const owner = tryResolveAgentOperationAgentId(nextConfig);
			const defaultAgentId = owner === void 0 ? void 0 : resolveConfiguredAgentId(nextConfig, owner);
			for (const target of bindTargets) {
				const targetAgentId = await prompter.select({
					message: `Send ${target.channel}/${target.accountId} messages to agent`,
					options: agentSummaries.map((agent) => ({
						value: agent.id,
						label: agent.isDefault ? `${agent.id} (default)` : agent.id
					})),
					initialValue: params.agentId ?? defaultAgentId
				});
				const bindingResult = applyAgentBindings(nextConfig, [{
					agentId: targetAgentId,
					match: {
						channel: target.channel,
						accountId: target.accountId
					}
				}]);
				nextConfig = bindingResult.config;
				if (bindingResult.added.length > 0 || bindingResult.updated.length > 0) await prompter.note([...bindingResult.added.map((binding) => `Added: ${describeBinding(binding)}`), ...bindingResult.updated.map((binding) => `Updated: ${describeBinding(binding)}`)].join("\n"), "Routing bindings");
				if (bindingResult.conflicts.length > 0) await prompter.note(["Skipped bindings already claimed by another agent:", ...bindingResult.conflicts.map((conflict) => `- ${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`)].join("\n"), "Routing bindings");
			}
		}
	}
	await commitWizardConfig(nextConfig);
	params.onConfigured?.(selection.map((channel) => ({
		channel,
		accountId: accountIds[channel] ?? "default"
	})));
	await prompter.outro("Channels updated.");
}
/**
* Gateway entry for `wizard.start {flow:"channels"}`. Unlike the CLI path this
* must never call runtime.exit — failures throw and surface as wizard errors.
*/
async function runChannelsSetupWizard(opts, runtime, prompter) {
	const writeSnapshot = await readConfigFileSnapshotForWrite();
	const { snapshot } = writeSnapshot;
	if (snapshot.exists && !snapshot.valid) throw new Error("OpenClaw config is invalid; run `openclaw doctor --fix`, then retry channel setup.");
	const cfg = snapshot.sourceConfig;
	const { agentId, workspaceDir } = await selectChannelSetupOwner(writeSnapshot, prompter);
	const target = await resolveInitialWizardChannelTarget(opts.channel, cfg, workspaceDir);
	if (target.kind === "unresolved") throw new Error(target.message);
	await runChannelsAddWizardFlow({
		writeSnapshot,
		agentId,
		runtime,
		prompter,
		workspaceDir,
		...target.kind === "resolved" ? { initialChannel: target.channel } : {},
		deferDeviceLinkToClient: true,
		...opts.onConfigured ? { onConfigured: opts.onConfigured } : {},
		...opts.beforePersistentEffect ? { beforePersistentEffect: opts.beforePersistentEffect } : {}
	});
}
//#endregion
export { resolveInitialWizardChannelTarget, runChannelsAddWizardFlow, runChannelsSetupWizard, selectChannelSetupOwner };
