import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { C as tryResolveAgentOperationAgentId, h as resolveConfiguredAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { n as resolveChannelSetupExecutionAdapter } from "./setup-contract-DgLM9zTf.mjs";
import { f as readCurrentConfigForPolicyCheckAsync, l as readConfigFileSnapshotForWrite } from "./io.runtime-Ds5uC0Bf.mjs";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import "./config-B3oiWDlr.mjs";
import { n as describeChannelAccount, r as resolveChannelAccount } from "./account-resolution-akTcFkRf.mjs";
import { c as formatUnknownChannelMessage } from "./error-format-Cd0oOG4L.mjs";
import { t as applyAgentBindings } from "./agents.bindings-AdjJEWEH.mjs";
import { t as resolveChannelSetupOwner } from "./owner-Bw1UJyA2.mjs";
import { i as withCommandPluginMetadata } from "./config-validation-CHn1iJgM.mjs";
import { t as describeBinding } from "./agents.binding-format-B08nnBYq.mjs";
import { t as persistChannelPluginConfig } from "./plugin-config-persistence-CbUqg01M.mjs";
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
	const currentConfig = await readCurrentConfigForPolicyCheckAsync({
		configPath: writeSnapshot.snapshot.path,
		env: process.env
	});
	writeSnapshot.writeOptions.assertConfigPathForWrite?.();
	const agentId = resolveConfiguredAgentId(currentConfig, selectedAgent.agentId);
	return resolveChannelSetupOwner(currentConfig, agentId);
}
/** Resolve omitted, matched, and unmatched channel targets without collapsing caller intent. */
async function resolveInitialWizardChannelTarget(raw, cfg, workspaceDir) {
	if (raw === void 0) return { kind: "omitted" };
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return unresolvedInitialWizardChannelTarget("");
	const [{ listActiveChannelSetupPlugins }, { resolveChannelSetupEntries }] = await Promise.all([import("./setup-registry-COgo39C1.mjs"), import("./discovery-BhFSwGtU.mjs")]);
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
	const [{ buildAgentSummaries }, onboardChannels] = await Promise.all([import("./agents.config-D4wwXIO6.mjs"), import("./channel-setup-DW-kKvj1.mjs")]);
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
		...params.initialChannel ? {
			initialSelection: [params.initialChannel],
			finishAfterInitialSelection: true
		} : {},
		allowDisable: false,
		allowIMessageInstall: true,
		allowSignalInstall: true,
		...params.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {},
		...params.assertPersistentEffectCurrent ? { assertPersistentEffectCurrent: params.assertPersistentEffectCurrent } : {},
		...params.deferDeviceLinkToClient ? { deferDeviceLinkToClient: true } : {},
		onPostWriteHook: channelSetup.onPostWriteHook,
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
		const committed = await persistChannelPluginConfig({
			cfg: config,
			setup: {
				previousConfig: cfg,
				beforePersistentEffect: params.beforePersistentEffect,
				assertCurrent: () => {
					writeSnapshot.writeOptions.assertConfigPathForWrite?.();
					params.assertPersistentEffectCurrent?.();
				}
			},
			pluginInstalled: false,
			writeOptions: writeSnapshot.writeOptions,
			baseHash,
			runtime
		});
		await channelSetup.runPostWriteHooks(committed.path);
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
			const account = plugin ? await resolveChannelAccount({
				plugin,
				cfg: nextConfig,
				accountId
			}) : void 0;
			const existingName = (plugin ? await describeChannelAccount({
				plugin,
				account,
				cfg: nextConfig
			}) : void 0)?.name ?? account?.name;
			const name = await prompter.text({
				message: `${channel} display name for account "${accountId}"`,
				initialValue: existingName
			});
			if (name?.trim()) {
				const namingPlugin = plugin ?? getChannelPlugin(channel);
				const apply = namingPlugin ? resolveChannelSetupExecutionAdapter(namingPlugin)?.applyAccountName : void 0;
				if (apply) nextConfig = apply({
					cfg: nextConfig,
					accountId: normalizeAccountId(accountId),
					name
				});
			}
		}
	});
	const bindTargets = selection.flatMap((channel) => {
		const accountId = accountIds[channel]?.trim();
		return accountId ? [{
			channel,
			accountId
		}] : [];
	});
	if (bindTargets.length > 0) {
		const agentSummaries = await buildAgentSummaries(nextConfig);
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
		...opts.beforePersistentEffect ? { beforePersistentEffect: opts.beforePersistentEffect } : {},
		...opts.assertPersistentEffectCurrent ? { assertPersistentEffectCurrent: opts.assertPersistentEffectCurrent } : {}
	});
}
//#endregion
export { resolveInitialWizardChannelTarget, runChannelsAddWizardFlow, runChannelsSetupWizard, selectChannelSetupOwner };
