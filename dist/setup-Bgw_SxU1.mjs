import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-BPJp3Uyw.mjs";
import "./config-DryArA1l.mjs";
import { r as resolveGatewayProbeAuthSafeWithSecretInputs } from "./probe-auth-BaSdm1-m.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { l as resolveOnboardingSetupTarget } from "./onboard-agent-target-pGC2ybZv.mjs";
import { n as showSessionMigrationWarnings, t as promptFirstOnboardingAgent } from "./onboard-first-agent-BQnhoWCY.mjs";
import { a as readValidSetupConfigFile, c as resolveQuickstartGatewayDefaults, i as readSetupConfigFileSnapshot, l as writeWizardConfigFile, n as formatQuickstartGatewaySummary, o as requestTelemetryConsent, r as hasQuickstartGatewayOverrides, s as requireRiskAcknowledgement, t as createWizardInferenceConfigTarget } from "./setup.shared-BqTn8n33.mjs";
import { r as buildPluginCompatibilitySnapshotNotices } from "./status-DhtdnHwE.mjs";
import { t as formatPluginCompatibilityNotice } from "./status-compatibility-DdQ1VWdc.mjs";
import { t as runWizardWithPromptNavigation } from "./navigation-prompter-DZbGfNMu.mjs";
import { a as runSetupModelAuthStep, i as completeSetupModelAuth, n as listSetupMigrationOptions, r as runSetupMigrationImport, t as detectSetupMigrationSources } from "./setup.migration-import-Cq9aO1uh.mjs";
import { n as SetupMigrationTargetChangedError, t as SetupMigrationFreshnessError } from "./setup.migration-snapshot-LPO-VgcK.mjs";
import { t as resolveSetupSecretInputString } from "./setup.secret-input-ITwcxQGV.mjs";
import { t as resolveSetupWorkspaceSelection } from "./setup.workspace-c9v2e1c-.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/wizard/setup.ts
const loadConfigLoggingModule = createLazyRuntimeModule(() => import("./logging-B5OcKoGx.mjs"));
const loadOnboardConfigModule = createLazyRuntimeModule(() => import("./onboard-config-luhByLu5.mjs"));
async function runSetupWizard(opts, runtimeInput, prompter) {
	await runWizardWithPromptNavigation(prompter, async (navigationPrompter) => await runSetupWizardOnce(opts, runtimeInput, navigationPrompter));
}
async function runSetupWizardOnce(initialOpts, runtimeInput, prompter) {
	let opts = initialOpts;
	const runtime = runtimeInput ?? defaultRuntime;
	const onboardHelpers = await import("./onboard-helpers-Bs3xm5rG.mjs");
	await onboardHelpers.printWizardHeader(runtime);
	await prompter.intro(t("wizard.setup.intro"));
	const snapshot = await readSetupConfigFileSnapshot();
	let currentSetupSnapshot = snapshot;
	let baseConfig = snapshot.valid ? snapshot.runtimeConfig ?? snapshot.config : {};
	let setupConfigMergeBase = structuredClone(baseConfig);
	baseConfig = await requireRiskAcknowledgement({
		opts,
		prompter,
		config: baseConfig
	});
	const commitSetupConfigFile = async (config, optsLocal = {}) => {
		const committed = await writeWizardConfigFile(config, {
			...optsLocal,
			mergeBase: setupConfigMergeBase
		});
		setupConfigMergeBase = structuredClone(committed.nextConfig);
		return committed;
	};
	if (snapshot.exists && !snapshot.valid) {
		await prompter.note(onboardHelpers.summarizeExistingConfig(baseConfig), t("wizard.setup.invalidConfigTitle"));
		if (snapshot.issues.length > 0) await prompter.note([
			...snapshot.issues.map((iss) => `- ${iss.path}: ${iss.message}`),
			"",
			"Docs: https://docs.openclaw.ai/gateway/configuration"
		].join("\n"), "Config issues");
		await prompter.outro(`Config invalid. Run \`${formatCliCommand("openclaw doctor --fix")}\` to apply supported repairs, then re-run setup.`);
		runtime.exit(1);
		return;
	}
	baseConfig = await requestTelemetryConsent({
		opts,
		prompter,
		config: baseConfig
	});
	const compatibilityNotices = snapshot.valid ? buildPluginCompatibilitySnapshotNotices({ config: baseConfig }) : [];
	if (compatibilityNotices.length > 0) await prompter.note([
		`Detected ${compatibilityNotices.length} plugin compatibility notice${compatibilityNotices.length === 1 ? "" : "s"} in the current config.`,
		...compatibilityNotices.slice(0, 4).map((notice) => `- ${formatPluginCompatibilityNotice(notice)}`),
		...compatibilityNotices.length > 4 ? [`- ... +${compatibilityNotices.length - 4} more`] : [],
		"",
		`Review: ${formatCliCommand("openclaw doctor")}`,
		`Inspect: ${formatCliCommand("openclaw plugins inspect --all")}`
	].join("\n"), t("wizard.setup.pluginCompatibilityTitle"));
	const quickstartHint = t("wizard.setup.flowQuickstartHint", { command: formatCliCommand("openclaw configure") });
	const manualHint = t("wizard.setup.flowAdvancedHint");
	const hasExistingModelConfig = resolveAgentModelPrimaryValue(baseConfig.agents?.defaults?.model) !== void 0;
	const migrationDiscovery = await detectSetupMigrationSources({
		config: baseConfig,
		runtime
	});
	const migrationOptions = await listSetupMigrationOptions({
		baseConfig,
		...migrationDiscovery
	});
	const explicitFlowRaw = opts.flow?.trim();
	const normalizedExplicitFlow = explicitFlowRaw === "manual" ? "advanced" : explicitFlowRaw;
	if (normalizedExplicitFlow && normalizedExplicitFlow !== "quickstart" && normalizedExplicitFlow !== "advanced" && normalizedExplicitFlow !== "import") {
		runtime.error("Invalid --flow. Use quickstart, manual, advanced, or import. Example: openclaw onboard --flow quickstart");
		runtime.exit(1);
		return;
	}
	const explicitFlow = normalizedExplicitFlow === "quickstart" || normalizedExplicitFlow === "advanced" || normalizedExplicitFlow === "import" ? normalizedExplicitFlow : void 0;
	const keepModelOption = hasExistingModelConfig ? {
		value: "keep-model",
		label: t("wizard.setup.flowKeepModel"),
		hint: t("wizard.setup.flowKeepModelHint")
	} : void 0;
	const importIntent = Boolean(opts.importFrom?.trim() || opts.importSource?.trim() || opts.importSecrets);
	const promptSetupFlow = async () => await prompter.select({
		message: t("wizard.setup.setupMode"),
		options: [
			...keepModelOption ? [keepModelOption] : [],
			{
				value: "quickstart",
				label: t("wizard.setup.flowQuickstart"),
				hint: quickstartHint
			},
			{
				value: "advanced",
				label: t("wizard.setup.flowAdvanced"),
				hint: manualHint
			},
			...migrationOptions.length > 0 ? [{
				value: "import",
				label: t("wizard.migration.importFromAnotherAgent")
			}] : []
		],
		initialValue: hasExistingModelConfig ? "keep-model" : "quickstart"
	});
	const normalizeSetupFlow = async (choice) => {
		const keepExistingModelConfig = choice === "keep-model";
		let flow = keepExistingModelConfig ? "quickstart" : choice;
		if (opts.mode === "remote" && flow === "quickstart") {
			await prompter.note(t("wizard.setup.quickstartOnlyLocal"), t("wizard.setup.quickstartTitle"));
			flow = "advanced";
		}
		return {
			flow,
			keepExistingModelConfig
		};
	};
	const flowFromPrompt = explicitFlow === void 0 && !importIntent;
	let { flow, keepExistingModelConfig } = await normalizeSetupFlow(explicitFlow ?? (importIntent ? "import" : await promptSetupFlow()));
	if (snapshot.exists && !keepExistingModelConfig) await prompter.note(onboardHelpers.summarizeExistingConfig(baseConfig), t("wizard.setup.existingConfigTitle"));
	let usedImportFlow = false;
	let acknowledgeMigrationPromotion;
	let importedInferenceVerified = false;
	while (opts.importFrom || flow === "import" || flow.startsWith("import:")) {
		const importFrom = opts.importFrom ?? (flow.startsWith("import:") ? flow.slice(7) : void 0);
		let migrationOutcome;
		try {
			migrationOutcome = await runSetupMigrationImport({
				opts: {
					...opts,
					...importFrom ? { importFrom } : {}
				},
				baseConfig,
				...migrationDiscovery,
				prompter,
				runtime,
				readConfigFile: readValidSetupConfigFile,
				async commitConfigFile(cfg, expectedConfig) {
					const latest = await readSetupConfigFileSnapshot();
					if (!latest.valid) throw new Error("Migration target config became invalid. Run `openclaw doctor --fix` to apply supported repairs.");
					const latestConfig = latest.exists ? latest.sourceConfig ?? latest.config : {};
					if (!isDeepStrictEqual(latestConfig, expectedConfig)) throw new ConfigMutationConflictError("config changed during migration promotion");
					return (await writeWizardConfigFile(cfg, {
						allowConfigSizeDrop: true,
						baseSnapshot: latest,
						...latest.hash !== void 0 ? { baseHash: latest.hash } : {}
					})).nextConfig;
				},
				allowProviderBack: flowFromPrompt,
				continueOnboarding: true
			});
			if (migrationOutcome.kind === "back") {
				({flow, keepExistingModelConfig} = await normalizeSetupFlow(await promptSetupFlow()));
				continue;
			}
		} catch (error) {
			if (!(error instanceof SetupMigrationFreshnessError || error instanceof SetupMigrationTargetChangedError) || !flowFromPrompt) throw error;
			await prompter.note(formatErrorMessage(error), t("wizard.setup.existingConfigTitle"));
			({flow, keepExistingModelConfig} = await normalizeSetupFlow(await promptSetupFlow()));
			continue;
		}
		usedImportFlow = true;
		acknowledgeMigrationPromotion = migrationOutcome.acknowledgePromotion;
		const migratedSnapshot = await readSetupConfigFileSnapshot();
		if (!migratedSnapshot.valid) throw new Error("Migration produced an invalid OpenClaw config. Run `openclaw doctor --fix` to apply supported repairs.");
		currentSetupSnapshot = migratedSnapshot;
		baseConfig = migratedSnapshot.runtimeConfig ?? migratedSnapshot.config;
		setupConfigMergeBase = structuredClone(baseConfig);
		const importedModelRef = resolveAgentModelPrimaryValue(baseConfig.agents?.defaults?.model);
		importedInferenceVerified = migrationOutcome.kind === "verified-inference" && importedModelRef === migrationOutcome.modelRef;
		keepExistingModelConfig = importedInferenceVerified;
		flow = "quickstart";
		break;
	}
	const hasAuthoredRoster = hasResolvedRosterBeforeMigrations(currentSetupSnapshot);
	if (usedImportFlow && hasAuthoredRoster && opts.agentName !== void 0) {
		runtime.error("--agent-name cannot be combined with an import that supplies an agent roster. Remove --agent-name or choose an import without agents.");
		runtime.exit(1);
		return;
	}
	const wizardFlow = flow === "advanced" ? "advanced" : "quickstart";
	const hasExplicitQuickstartGatewayOverrides = wizardFlow === "quickstart" && hasQuickstartGatewayOverrides(opts);
	const quickstartGateway = resolveQuickstartGatewayDefaults(baseConfig, opts);
	if (flow === "quickstart") await prompter.note(formatQuickstartGatewaySummary(quickstartGateway, quickstartGateway.hasExisting && !hasExplicitQuickstartGatewayOverrides), "QuickStart");
	const localPort = quickstartGateway.port;
	const localUrl = `ws://127.0.0.1:${localPort}`;
	let localGatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
	try {
		const resolvedGatewayToken = await resolveSetupSecretInputString({
			config: baseConfig,
			value: quickstartGateway.token,
			path: "gateway.auth.token",
			env: process.env
		});
		if (resolvedGatewayToken) localGatewayToken = resolvedGatewayToken;
	} catch (error) {
		await prompter.note([t("wizard.setup.secretRefProbeFailed", { field: "gateway.auth.token" }), formatErrorMessage(error)].join("\n"), t("wizard.gateway.auth"));
	}
	let localGatewayPassword = process.env.OPENCLAW_GATEWAY_PASSWORD;
	try {
		const resolvedGatewayPassword = await resolveSetupSecretInputString({
			config: baseConfig,
			value: quickstartGateway.password,
			path: "gateway.auth.password",
			env: process.env
		});
		if (resolvedGatewayPassword) localGatewayPassword = resolvedGatewayPassword;
	} catch (error) {
		await prompter.note([t("wizard.setup.secretRefProbeFailed", { field: "gateway.auth.password" }), formatErrorMessage(error)].join("\n"), t("wizard.gateway.auth"));
	}
	const localProbe = await onboardHelpers.probeGatewayReachable({
		url: localUrl,
		token: localGatewayToken,
		password: localGatewayPassword
	});
	const storedRemoteUrl = normalizeOptionalString(baseConfig.gateway?.remote?.url);
	const optionRemoteUrl = normalizeOptionalString(opts.remoteUrl);
	const optionRemoteToken = normalizeOptionalString(opts.remoteToken);
	const optionRemotePassword = normalizeOptionalString(opts.remotePassword);
	const remoteUrlChanged = opts.remoteUrl !== void 0 && optionRemoteUrl !== storedRemoteUrl;
	const remoteSeedConfig = opts.remoteUrl === void 0 && opts.remoteToken === void 0 && opts.remotePassword === void 0 ? baseConfig : {
		...baseConfig,
		gateway: {
			...baseConfig.gateway,
			remote: {
				...baseConfig.gateway?.remote,
				...opts.remoteUrl !== void 0 ? { url: optionRemoteUrl } : {},
				...opts.remoteToken !== void 0 ? { token: optionRemoteToken } : opts.remotePassword !== void 0 || remoteUrlChanged ? { token: void 0 } : {},
				...opts.remotePassword !== void 0 ? { password: optionRemotePassword } : opts.remoteToken !== void 0 || remoteUrlChanged ? { password: void 0 } : {}
			}
		}
	};
	const seededRemoteUrl = remoteSeedConfig.gateway?.remote?.url?.trim() ?? "";
	const remoteOnboard = seededRemoteUrl ? await import("./onboard-remote-0N5SenLr.mjs") : null;
	const remoteUrl = seededRemoteUrl && remoteOnboard?.validateGatewayWebSocketUrl(seededRemoteUrl) === void 0 ? seededRemoteUrl : "";
	const remoteProbeAuth = remoteUrl ? await resolveGatewayProbeAuthSafeWithSecretInputs({
		cfg: remoteSeedConfig,
		env: process.env,
		mode: "remote",
		explicitAuth: {
			token: optionRemoteToken,
			password: optionRemotePassword
		},
		...remoteUrlChanged ? {
			urlOverride: optionRemoteUrl,
			urlOverrideSource: "cli"
		} : {}
	}) : null;
	if (remoteProbeAuth?.warning) await prompter.note(["Could not resolve remote gateway SecretRef for setup probe.", remoteProbeAuth.warning].join("\n"), "Gateway auth");
	const remoteProbe = remoteUrl ? await onboardHelpers.probeGatewayReachable({
		url: remoteUrl,
		config: baseConfig,
		originScopedDeviceAuth: true,
		token: remoteProbeAuth?.auth.token,
		...remoteProbeAuth?.auth.password ? { password: remoteProbeAuth.auth.password } : {}
	}) : null;
	const mode = opts.mode ?? (flow === "quickstart" ? "local" : await prompter.select({
		message: t("wizard.setup.whatSetup"),
		options: [{
			value: "local",
			label: t("wizard.setup.localGateway"),
			hint: localProbe.ok ? t("wizard.setup.localGatewayReachable", { url: localUrl }) : t("wizard.setup.localGatewayMissing", { url: localUrl })
		}, {
			value: "remote",
			label: t("wizard.setup.remoteGateway"),
			hint: !remoteUrl ? t("wizard.setup.remoteGatewayMissing") : remoteProbe?.ok ? t("wizard.setup.remoteGatewayReachable", { url: remoteUrl }) : t("wizard.setup.remoteGatewayUnreachable", { url: remoteUrl })
		}]
	}));
	if (mode === "remote") {
		const { promptRemoteGatewayConfig } = remoteOnboard ?? await import("./onboard-remote-0N5SenLr.mjs");
		const { applySkipBootstrapConfig } = await loadOnboardConfigModule();
		const { logConfigUpdated } = await loadConfigLoggingModule();
		let nextConfig = await promptRemoteGatewayConfig(remoteSeedConfig, prompter, {
			secretInputMode: opts.secretInputMode,
			...opts.remoteUrl !== void 0 ? { remoteOriginUrl: storedRemoteUrl } : {}
		});
		nextConfig = opts.skipBootstrap ? applySkipBootstrapConfig(nextConfig) : nextConfig;
		nextConfig = onboardHelpers.applyWizardMetadata(nextConfig, {
			command: "onboard",
			mode
		});
		prompter.disableBackNavigation?.();
		await commitSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
		logConfigUpdated(runtime);
		await prompter.outro(t("wizard.setup.remoteConfigured"));
		return;
	}
	const workspaceInput = opts.workspace ?? (flow === "quickstart" ? baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE : await prompter.text({
		message: t("wizard.setup.workspaceDirectory"),
		initialValue: baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE
	}));
	const requestedWorkspaceDir = resolveUserPath(workspaceInput.trim() || onboardHelpers.DEFAULT_WORKSPACE);
	const { applyLocalSetupWorkspaceConfig, applySkipBootstrapConfig } = await loadOnboardConfigModule();
	const { workspaceDir, allowWorkspaceChange } = await resolveSetupWorkspaceSelection({
		baseConfig,
		requestedWorkspaceDir,
		prompter,
		hasAuthoredRoster
	});
	if (opts.authChoice === void 0) {
		const { inferAuthChoiceFromFlags } = await import("./auth-choice-inference-B3fLSExm.mjs");
		const inferred = inferAuthChoiceFromFlags(opts, {
			config: baseConfig,
			workspaceDir
		});
		if (inferred.matches.length > 1) {
			runtime.error(`Multiple provider credential flags (${inferred.matches.map((match) => match.label).join(", ")}). Use one flag or pass --auth-choice explicitly.`);
			return runtime.exit(1);
		}
		opts = inferred.choice ? {
			...opts,
			authChoice: inferred.choice
		} : opts;
	}
	const firstAgent = await promptFirstOnboardingAgent(hasAuthoredRoster, opts.agentName, prompter, opts.nonInteractive);
	let nextConfig = applyLocalSetupWorkspaceConfig(baseConfig, requestedWorkspaceDir, { allowWorkspaceChange: allowWorkspaceChange || !hasAuthoredRoster });
	nextConfig = opts.skipBootstrap ? applySkipBootstrapConfig(nextConfig) : nextConfig;
	const preModelAuthConfig = nextConfig;
	let stagedModelAuth;
	if (!keepExistingModelConfig || opts.authChoice !== void 0 && opts.authChoice !== "skip") {
		stagedModelAuth = await runSetupModelAuthStep({
			config: nextConfig,
			opts,
			prompter,
			runtime,
			pendingAgent: firstAgent && {
				...firstAgent,
				workspaceDir
			},
			preserveExistingModelSelection: keepExistingModelConfig
		});
		nextConfig = stagedModelAuth.config;
	}
	const { configureGatewayForSetup } = await import("./setup.gateway-config-DpGI7Ekg.mjs");
	const gateway = await configureGatewayForSetup({
		flow: wizardFlow,
		baseConfig,
		nextConfig,
		localPort,
		quickstartGateway,
		secretInputMode: opts.secretInputMode,
		prompter,
		runtime
	});
	const { ensureOnboardingAgent } = await import("./onboard-agent-B2prhKlv.mjs");
	const onboardingAgent = await ensureOnboardingAgent({
		config: gateway.nextConfig,
		workspace: workspaceDir,
		preserveCandidateRoster: usedImportFlow && hasAuthoredRoster,
		baseConfig: setupConfigMergeBase,
		...firstAgent ? { firstAgent } : {}
	});
	nextConfig = onboardingAgent.config;
	setupConfigMergeBase = structuredClone(onboardingAgent.configBase);
	const migrationWarnings = onboardingAgent.sessionMigrationWarnings;
	await showSessionMigrationWarnings(prompter, migrationWarnings);
	const modelAuth = await completeSetupModelAuth({
		config: nextConfig,
		baseConfig: preModelAuthConfig,
		stagedCandidate: stagedModelAuth,
		opts,
		prompter,
		runtime,
		usedImportFlow,
		keepExistingModelConfig,
		importedInferenceVerified,
		configTarget: createWizardInferenceConfigTarget(commitSetupConfigFile)
	});
	nextConfig = modelAuth.config;
	const liveModelVerified = modelAuth.verified;
	if (!modelAuth.persisted) nextConfig = (await commitSetupConfigFile(nextConfig, { allowConfigSizeDrop: false })).nextConfig;
	prompter.disableBackNavigation?.();
	if (opts.skipChannels) await prompter.note(t("wizard.setup.skipChannels"), t("wizard.setup.channelsTitle"));
	else {
		const { listChannelPlugins } = await import("./plugins-aqMUFJ4z.mjs");
		const { createChannelSetupHooks, setupChannels } = await import("./onboard-channels-YoK_4PEl.mjs");
		const channelSetup = createChannelSetupHooks({ runtime });
		const quickstartAllowFromChannels = flow === "quickstart" ? listChannelPlugins().filter((plugin) => plugin.meta.quickstartAllowFrom).map((plugin) => plugin.id) : [];
		nextConfig = await setupChannels(nextConfig, runtime, prompter, {
			allowIMessageInstall: true,
			allowSignalInstall: true,
			deferStatusUntilSelection: flow === "quickstart",
			forceAllowFromChannels: quickstartAllowFromChannels,
			skipDmPolicyPrompt: flow === "quickstart",
			skipConfirm: flow === "quickstart",
			quickstartDefaults: flow === "quickstart",
			secretInputMode: opts.secretInputMode,
			onPostWriteHook: (hook) => channelSetup.onPostWriteHook(hook)
		});
		const committed = await commitSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
		await channelSetup.runPostWriteHooks(committed.path);
		nextConfig = committed.nextConfig;
	}
	if (opts.skipChannels) nextConfig = (await commitSetupConfigFile(nextConfig, { allowConfigSizeDrop: false })).nextConfig;
	let onboardingTarget = resolveOnboardingSetupTarget(nextConfig);
	const { logConfigUpdated } = await loadConfigLoggingModule();
	logConfigUpdated(runtime);
	await onboardHelpers.ensureWorkspaceAndSessions(onboardingTarget.workspaceDir, runtime, {
		skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
		skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles,
		agentId: onboardingTarget.agentId
	});
	if (!usedImportFlow) {
		const { runSetupMemoryImportStep } = await import("./setup.memory-import-3N6JOl3L.mjs");
		await runSetupMemoryImportStep({
			config: nextConfig,
			prompter,
			runtime
		});
	}
	if (opts.skipSearch) await prompter.note(t("wizard.setup.skipSearch"), t("wizard.setup.searchTitle"));
	else {
		const { runSearchSetupFlow } = await import("./search-setup-DzJdoswc.mjs");
		nextConfig = (await runSearchSetupFlow(nextConfig, runtime, prompter, {
			quickstartDefaults: flow === "quickstart",
			secretInputMode: opts.secretInputMode
		})).config;
	}
	if (opts.skipSkills) await prompter.note(t("wizard.setup.skipSkills"), t("wizard.setup.skillsTitle"));
	else {
		const { setupSkills } = await import("./onboard-skills-DAQC-l80.mjs");
		nextConfig = await setupSkills(nextConfig, onboardingTarget.workspaceDir, runtime, prompter, { nodeManager: opts.nodeManager });
	}
	let commitAppRecommendationResult;
	if (flow !== "quickstart") {
		const { setupOfficialPluginInstalls } = await import("./setup.official-plugins-C5z94sFC.mjs");
		nextConfig = await setupOfficialPluginInstalls({
			config: nextConfig,
			prompter,
			runtime,
			workspaceDir: onboardingTarget.workspaceDir
		});
		const { setupAppRecommendations } = await import("./setup.app-recommendations-B__gsKKY.mjs");
		const recommendationOutcome = await setupAppRecommendations({
			config: nextConfig,
			prompter,
			runtime,
			workspaceDir: onboardingTarget.workspaceDir,
			modelRouteVerified: liveModelVerified
		});
		nextConfig = recommendationOutcome.config;
		commitAppRecommendationResult = recommendationOutcome.commitResult;
		const { setupPluginConfig } = await import("./setup.plugin-config-Cg7Xdi_o.mjs");
		nextConfig = await setupPluginConfig({
			config: nextConfig,
			prompter,
			workspaceDir: onboardingTarget.workspaceDir
		});
	}
	if (!opts.skipHooks) {
		const { enableDefaultOnboardingInternalHooks } = await import("./onboard-hooks-B-PHirjM.mjs");
		nextConfig = enableDefaultOnboardingInternalHooks(nextConfig);
	}
	nextConfig = onboardHelpers.applyWizardMetadata(nextConfig, {
		command: "onboard",
		mode
	});
	nextConfig = (await commitSetupConfigFile(nextConfig, { allowConfigSizeDrop: false })).nextConfig;
	onboardingTarget = resolveOnboardingSetupTarget(nextConfig);
	await commitAppRecommendationResult?.();
	const { finalizeSetupWizard } = await import("./setup.finalize-BwILVJ8t.mjs");
	const finalizeResult = await finalizeSetupWizard({
		flow: wizardFlow,
		opts,
		baseConfig,
		hadExistingConfig: snapshot.exists,
		nextConfig,
		workspaceDir: onboardingTarget.workspaceDir,
		settings: gateway.settings,
		prompter,
		runtime
	});
	await acknowledgeMigrationPromotion?.();
	if (finalizeResult.launchedTui) runtime.exit(0);
}
//#endregion
export { runSetupWizard as t };
