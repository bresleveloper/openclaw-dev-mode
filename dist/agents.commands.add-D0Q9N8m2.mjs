import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as listAgentEntries, S as tryResolveLegacyCompatibilityAgentId, a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import { t as ExpectedCliError } from "./failure-output-Cct-llrO.mjs";
import { l as resolveSharedMainAuthAgentDir } from "./path-resolve-Bm8Ih2d_.mjs";
import { a as inspectPersistedAuthProfileStoreRaw, h as resolveAuthProfileDatabasePath } from "./sqlite-BIg_k8qE.mjs";
import { a as loadPersistedAuthProfileStore, f as AuthProfileStoreUnreadableError } from "./persisted-B486xwB_.mjs";
import { g as buildPortableAuthProfileStoreForAgentCopy } from "./store-CTvq6MSF.mjs";
import "./legacy-source-diagnostic-_PHHNz0J.mjs";
import { l as loadAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-BcoYkagW.mjs";
import "./auth-profiles-CYVlYrag.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { s as transformConfigWithPendingPluginInstalls, t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-DDMKSyro.mjs";
import { t as applyAgentConfig } from "./agents.config-BnlRDoFW.mjs";
import { n as loadAgentRole } from "./agent-roles-DYbzEdi7.mjs";
import { a as ensureOnboardingAgentWorkspace, c as resolveOnboardingAgentTarget, r as applyOnboardingUtilityModel } from "./onboard-agent-target-pGC2ybZv.mjs";
import { t as describeBinding } from "./agents.binding-format-BRYI5aWJ.mjs";
import { n as buildChannelBindings, t as applyAgentBindings } from "./agents.bindings-BDLKxy0x.mjs";
import { n as createAgent, r as validateAgentIdInput, t as checkAgentCreationGate } from "./agent-create-CdQanvwX.mjs";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.mjs";
import { r as stageProviderAuthProfileBatch } from "./provider-auth-persistence-CqRKKZNC.mjs";
import { t as createClackPrompter } from "./clack-prompter-D8DhCvTT.mjs";
import { r as logConfigUpdated } from "./logging-DLCoHZv9.mjs";
import { r as requireValidConfigForWrite } from "./config-validation-CdWq9kXm.mjs";
import { i as setupChannels, n as createChannelSetupHooks } from "./onboard-channels-FjF6isyj.mjs";
import { n as promptAuthChoiceGrouped } from "./auth-choice-prompt-DBmMCjkm.mjs";
import { a as prepareAuthChoice, r as warnIfModelConfigLooksOff } from "./auth-choice-BlSCrVae.mjs";
import path from "node:path";
//#region src/commands/agents.commands.add.ts
function failAgentsAdd(message) {
	throw new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
function emptyBindingResult(config) {
	return {
		config,
		added: [],
		updated: [],
		skipped: [],
		conflicts: []
	};
}
function loadReadablePersistedAuthProfileStore(agentDir) {
	const store = loadPersistedAuthProfileStore(agentDir);
	if (!store && inspectPersistedAuthProfileStoreRaw(agentDir).status !== "missing") throw new AuthProfileStoreUnreadableError(resolveAuthProfileDatabasePath(agentDir));
	return store;
}
function hasOAuthProfiles(store, profileIds) {
	return profileIds.some((profileId) => store.profiles[profileId]?.type === "oauth");
}
function formatSkippedOAuthProfilesMessage(sourceAgentId, sourceIsInheritedMain) {
	return sourceIsInheritedMain ? `OAuth profiles stay shared from "${sourceAgentId}" unless this agent signs in separately.` : `OAuth profiles were not copied from "${sourceAgentId}"; sign in separately for this agent.`;
}
/** Create or update an agent through the non-interactive path or guided wizard. */
async function agentsAddCommand(opts, runtime = defaultRuntime, params) {
	if (opts.role !== void 0) try {
		await loadAgentRole(opts.role);
	} catch (error) {
		failAgentsAdd(error instanceof Error ? error.message : String(error));
	}
	const hasAutomationFlags = params?.hasAutomationFlags === true;
	const nonInteractive = opts.nonInteractive === true || hasAutomationFlags;
	const wizardOutput = opts.json ? process.stderr : process.stdout;
	if (!nonInteractive && !isTerminalInteractive(wizardOutput)) failAgentsAdd(`Agent creation needs an interactive TTY. Use \`${formatCliCommand("openclaw agents add <id> --non-interactive --workspace <dir>")}\` for automation.`);
	const writeSnapshot = await requireValidConfigForWrite(runtime);
	if (!writeSnapshot) return;
	const cfg = writeSnapshot.snapshot.sourceConfig;
	const workspaceFlag = opts.workspace?.trim();
	const nameInput = opts.name?.trim();
	if (nonInteractive) {
		if (!workspaceFlag && !opts.role) failAgentsAdd(`Non-interactive agent creation requires --workspace. Re-run ${formatCliCommand("openclaw agents add <id> --workspace <path>")} or omit flags to use the wizard.`);
		if (!nameInput) failAgentsAdd(`Agent name is required in non-interactive mode. Run ${formatCliCommand("openclaw agents add <id> --workspace <path>")}.`);
		const validation = validateAgentIdInput(nameInput);
		if (!validation.ok) failAgentsAdd(validation.reason === "reserved-id" ? `"${validation.agentId}" is reserved. Choose another name, or run ${formatCliCommand("openclaw agents list")} to inspect configured agents.` : validation.message);
		const agentId = validation.agentId;
		if (!opts.json && agentId !== nameInput) runtime.log(`Normalized agent id to "${agentId}".`);
		const created = await withPluginLifecycleLease({}, async () => {
			return await createAgent({
				name: nameInput,
				workspace: workspaceFlag,
				...opts.role ? { role: opts.role } : {},
				...opts.agentDir ? { agentDir: opts.agentDir } : {},
				...opts.model ? { model: opts.model } : {},
				...opts.bind?.length ? { bindingSpecs: opts.bind } : {},
				transformConfig: transformConfigWithPendingPluginInstalls
			});
		});
		if (created.status === "error") failAgentsAdd(created.reason === "reserved-id" ? `"${created.agentId}" is reserved. Choose another name, or run ${formatCliCommand("openclaw agents list")} to inspect configured agents.` : created.reason === "already-exists" ? `Agent "${created.agentId}" already exists.` : created.message);
		const bindingResult = created.bindingResult ?? emptyBindingResult(cfg);
		if (!opts.json) logConfigUpdated(runtime);
		const payload = {
			agentId: created.agentId,
			name: created.name,
			workspace: created.workspace,
			agentDir: created.agentDir,
			model: created.model,
			bindings: {
				added: bindingResult.added.map(describeBinding),
				updated: bindingResult.updated.map(describeBinding),
				skipped: bindingResult.skipped.map(describeBinding),
				conflicts: bindingResult.conflicts.map((conflict) => `${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`)
			}
		};
		if (opts.json) writeRuntimeJson(runtime, payload);
		else {
			runtime.log(`Agent: ${agentId}`);
			runtime.log(`Workspace: ${shortenHomePath(created.workspace)}`);
			runtime.log(`Agent dir: ${shortenHomePath(created.agentDir)}`);
			if (created.model) runtime.log(`Model: ${created.model}`);
			if (bindingResult.conflicts.length > 0) runtime.error(["Skipped bindings already claimed by another agent:", ...bindingResult.conflicts.map((conflict) => `- ${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`)].join("\n"));
		}
		return;
	}
	const prompter = createClackPrompter(wizardOutput);
	const wizardRuntime = opts.json ? {
		...runtime,
		log: (...args) => runtime.error(...args)
	} : runtime;
	try {
		await prompter.intro("Add OpenClaw agent");
		const name = nameInput ?? await prompter.text({
			message: "Agent name",
			validate: (value) => {
				if (!value?.trim()) return "Required";
				const validation = validateAgentIdInput(value);
				if (!validation.ok) return validation.reason === "reserved-id" ? `"${validation.agentId}" is reserved. Choose another name.` : validation.message;
			}
		});
		const agentName = normalizeOptionalString(name) ?? "";
		const validation = validateAgentIdInput(agentName);
		if (!validation.ok) {
			if (validation.reason === "reserved-id") {
				await prompter.outro(`"${validation.agentId}" is reserved. Choose another name.`);
				return;
			}
			await prompter.outro(validation.message);
			return;
		}
		const agentId = validation.agentId;
		if (agentName !== agentId) await prompter.note(`Normalized id to "${agentId}".`, "Agent id");
		const existingAgent = listAgentEntries(cfg).find((agent) => normalizeAgentId(agent.id) === agentId);
		if (existingAgent) {
			if (opts.role) failAgentsAdd(`Agent "${agentId}" already exists. Choose a new id to create an agent from a role.`);
			if (!await prompter.confirm({
				message: `Agent "${agentId}" already exists. Update it?`,
				initialValue: false
			})) {
				await prompter.outro("No changes made.");
				return;
			}
		} else {
			const gateError = await checkAgentCreationGate(agentId);
			if (gateError) {
				await prompter.outro(gateError.message);
				return;
			}
		}
		const workspaceDefault = resolveAgentWorkspaceDir(cfg, agentId);
		const workspaceInput = await prompter.text({
			message: "Workspace directory",
			initialValue: workspaceDefault,
			validate: (value) => value?.trim() ? void 0 : "Required"
		});
		const workspaceDir = resolveUserPath(normalizeOptionalString(workspaceInput) || workspaceDefault);
		const agentDir = resolveAgentDir(cfg, agentId);
		let nextConfig = applyAgentConfig(cfg, {
			agentId,
			name: agentName,
			workspace: workspaceDir,
			agentDir
		});
		const stagedAuthProfiles = [];
		let stagedAuthOrder;
		let reportPortableAuthCopy;
		const copySourceAgentId = tryResolveLegacyCompatibilityAgentId(cfg) ?? await prompter.select({
			message: "Copy auth profiles from another agent?",
			initialValue: "__skip__",
			options: [{
				value: "__skip__",
				label: "Skip copying auth profiles"
			}, ...listAgentEntries(cfg).map((agent) => normalizeAgentId(agent.id)).filter((id) => id !== agentId).map((id) => ({
				value: id,
				label: id
			}))]
		});
		if (copySourceAgentId !== "__skip__" && copySourceAgentId !== agentId) {
			const sourceAgentDir = resolveAgentDir(cfg, copySourceAgentId);
			const sourceAuthPath = resolveAuthProfileDatabasePath(sourceAgentDir);
			const destAuthPath = resolveAuthProfileDatabasePath(agentDir);
			const sharedMainAgentPath = resolveAuthProfileDatabasePath(resolveSharedMainAuthAgentDir());
			const sameAuthPath = normalizeLowercaseStringOrEmpty(path.resolve(sourceAuthPath)) === normalizeLowercaseStringOrEmpty(path.resolve(destAuthPath));
			const sourceIsInheritedMain = normalizeLowercaseStringOrEmpty(path.resolve(sourceAuthPath)) === normalizeLowercaseStringOrEmpty(path.resolve(sharedMainAgentPath));
			if (!sameAuthPath) {
				const sourceStore = sourceIsInheritedMain ? loadAuthProfileStoreWithoutExternalProfiles(sourceAgentDir) : loadReadablePersistedAuthProfileStore(sourceAgentDir);
				const destStore = loadReadablePersistedAuthProfileStore(agentDir);
				const portable = sourceStore ? buildPortableAuthProfileStoreForAgentCopy(sourceStore) : void 0;
				const skippedOAuthProfiles = sourceStore && portable ? hasOAuthProfiles(sourceStore, portable.skippedProfileIds) : false;
				if (sourceStore && portable && portable.copiedProfileIds.length > 0 && Object.keys(destStore?.profiles ?? {}).length === 0) {
					if (await prompter.confirm({
						message: `Copy portable auth profiles from "${copySourceAgentId}"?`,
						initialValue: false
					})) {
						const copiedProfileIds = portable.copiedProfileIds;
						const copiedOAuthProfileIds = copiedProfileIds.filter((profileId) => sourceStore.profiles[profileId]?.type === "oauth");
						const sourceAgentId = copySourceAgentId;
						const sourceInheritedMain = sourceIsInheritedMain;
						const destinationAgentDir = agentDir;
						for (const [profileId, credential] of Object.entries(portable.store.profiles)) stagedAuthProfiles.push({
							profileId,
							credential,
							replaceExisting: false
						});
						stagedAuthOrder = portable.store.order;
						reportPortableAuthCopy = async () => {
							const persisted = loadPersistedAuthProfileStore(destinationAgentDir);
							const persistedIds = new Set(Object.keys(persisted?.profiles ?? {}));
							const copiedCount = copiedProfileIds.filter((profileId) => persistedIds.has(profileId)).length;
							const skippedOAuth = skippedOAuthProfiles || copiedOAuthProfileIds.some((profileId) => !persistedIds.has(profileId));
							const copied = copiedCount ? `Copied ${copiedCount} portable auth profile${copiedCount === 1 ? "" : "s"} from "${sourceAgentId}".` : "";
							const skipped = skippedOAuth ? ` ${formatSkippedOAuthProfilesMessage(sourceAgentId, sourceInheritedMain)}` : "";
							await prompter.note(`${copied}${skipped}`.trim(), "Auth profiles");
						};
					}
				} else if (skippedOAuthProfiles) {
					const sourceAgentId = copySourceAgentId;
					const sourceInheritedMain = sourceIsInheritedMain;
					reportPortableAuthCopy = async () => {
						await prompter.note(formatSkippedOAuthProfilesMessage(sourceAgentId, sourceInheritedMain), "Auth profiles");
					};
				}
			}
		}
		if (await prompter.confirm({
			message: "Configure model/auth for this agent now?",
			initialValue: false
		})) while (true) {
			const authChoice = await promptAuthChoiceGrouped({
				prompter,
				includeSkip: true,
				config: nextConfig
			});
			const authResult = await prepareAuthChoice({
				authChoice,
				config: nextConfig,
				prompter,
				runtime: wizardRuntime,
				agentDir,
				setDefaultModel: false,
				agentId
			});
			nextConfig = authResult.config;
			if (authResult.retrySelection) continue;
			stagedAuthProfiles.push(...authResult.authProfiles);
			if (authResult.utilityModelOverride) nextConfig = applyOnboardingUtilityModel(nextConfig, resolveOnboardingAgentTarget(nextConfig, agentId), authResult.utilityModelOverride);
			if (authResult.agentModelOverride) nextConfig = applyAgentConfig(nextConfig, {
				agentId,
				model: authResult.agentModelOverride
			});
			break;
		}
		await warnIfModelConfigLooksOff(nextConfig, prompter, {
			agentId,
			agentDir,
			pendingAuthProfiles: stagedAuthProfiles.map(({ profileId, credential }) => ({
				profileId,
				credential
			}))
		});
		const channelSetup = createChannelSetupHooks({ runtime: wizardRuntime });
		let selection = [];
		const channelAccountIds = {};
		nextConfig = await setupChannels(nextConfig, wizardRuntime, prompter, {
			workspaceDir,
			deferStatusUntilSelection: true,
			allowIMessageInstall: true,
			allowSignalInstall: true,
			onSelection: (value) => {
				selection = value;
			},
			promptAccountIds: true,
			onAccountId: (channel, accountId) => {
				channelAccountIds[channel] = accountId;
			},
			onPostWriteHook: channelSetup.onPostWriteHook
		});
		if (selection.length > 0) {
			if (await prompter.confirm({
				message: "Route selected channels to this agent now? (bindings)",
				initialValue: false
			})) {
				const desiredBindings = buildChannelBindings({
					agentId,
					selection,
					config: nextConfig,
					accountIds: channelAccountIds
				});
				const result = applyAgentBindings(nextConfig, desiredBindings);
				nextConfig = result.config;
				if (result.conflicts.length > 0) await prompter.note(["Skipped bindings already claimed by another agent:", ...result.conflicts.map((conflict) => `- ${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`)].join("\n"), "Routing bindings");
			} else await prompter.note(["Routing unchanged. Add bindings when you're ready.", "Docs: https://docs.openclaw.ai/concepts/multi-agent"].join("\n"), "Routing");
		}
		const stagedEntry = existingAgent ? void 0 : listAgentEntries(nextConfig).find((candidate) => normalizeAgentId(candidate.id) === agentId);
		const stagedAuthBatch = stagedAuthProfiles.length > 0 ? {
			profiles: stagedAuthProfiles,
			...stagedAuthOrder ? { order: stagedAuthOrder } : {},
			agentDir,
			config: nextConfig
		} : void 0;
		let payload;
		if (existingAgent) {
			const target = resolveOnboardingAgentTarget(nextConfig, agentId);
			await ensureOnboardingAgentWorkspace(target, wizardRuntime, {
				skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
				skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
			});
			const authPersistence = stagedAuthBatch ? await stageProviderAuthProfileBatch(stagedAuthBatch) : void 0;
			try {
				const committed = await commitConfigWithPendingPluginInstalls({
					sourceConfig: nextConfig,
					writeOptions: writeSnapshot.writeOptions,
					baseHash: writeSnapshot.snapshot.hash
				});
				await channelSetup.runPostWriteHooks(committed.path);
				nextConfig = committed.nextConfig;
			} catch (error) {
				await authPersistence?.rollback();
				throw error;
			}
			await authPersistence?.commit();
			payload = {
				agentId: target.agentId,
				name: agentName,
				workspace: target.workspaceDir,
				agentDir: target.agentDir
			};
		} else {
			if (!stagedEntry) throw new Error(`staged agent "${agentId}" is missing from config`);
			const created = await withPluginLifecycleLease({}, async () => {
				return await createAgent({
					entry: {
						...stagedEntry,
						id: agentId
					},
					...opts.role ? { role: opts.role } : {},
					stagedConfig: {
						config: nextConfig,
						writeSnapshot
					},
					transformConfig: transformConfigWithPendingPluginInstalls,
					...stagedAuthBatch ? { prepareConfigCommit: async () => await stageProviderAuthProfileBatch(stagedAuthBatch) } : {}
				});
			});
			if (created.status === "error") {
				await prompter.outro(created.message);
				return;
			}
			nextConfig = created.config;
			payload = {
				agentId: created.agentId,
				name: created.name,
				workspace: created.workspace,
				agentDir: created.agentDir
			};
			await channelSetup.runPostWriteHooks(created.configPath);
		}
		await reportPortableAuthCopy?.();
		if (!opts.json) logConfigUpdated(runtime);
		if (opts.json) writeRuntimeJson(runtime, payload);
		await prompter.outro(`Agent "${agentId}" ready.`);
	} catch (err) {
		if (err instanceof WizardCancelledError) {
			runtime.exit(1);
			return;
		}
		throw err;
	}
}
//#endregion
export { agentsAddCommand };
