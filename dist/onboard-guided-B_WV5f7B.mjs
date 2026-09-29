import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import "./session-key-CBvmC8zz.mjs";
import { l as withConsoleSubsystemsSuppressed } from "./console-DwqfhE-H.mjs";
import { n as formatConfigIssueLines } from "./issue-format-BQNShMey.mjs";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-BPJp3Uyw.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { t as isUnconfiguredConfigSource } from "./fresh-install-config-Bi-9QLEM.mjs";
import { c as resolveOnboardingAgentTarget, u as resolveSystemAgentOnboardingTarget } from "./onboard-agent-target-pGC2ybZv.mjs";
import { n as showSessionMigrationWarnings, t as promptFirstOnboardingAgent } from "./onboard-first-agent-BbcX_VoG.mjs";
import { o as requestTelemetryConsent, s as requireRiskAcknowledgement, u as getSecurityNoteTitle } from "./setup.shared-Co1UMZxa.mjs";
import { t as enableDefaultOnboardingInternalHooks } from "./onboard-hooks-Ca9woCpp.mjs";
import { n as runGuidedOnboardingHandoff, r as runInteractiveOnboarding, t as hasInteractiveOnboardingTty } from "./onboard-interactive-runner-BMHSi8fV.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/commands/onboard-guided-consent.ts
async function persistGuidedAccessMode(mode) {
	const { mutateConfigFileWithRetry } = await import("./config/config.js");
	await mutateConfigFileWithRetry({ mutate: (draft) => {
		if (draft.wizard?.accessMode === mode) return;
		draft.wizard = {
			...draft.wizard,
			accessMode: mode
		};
	} });
}
async function persistRiskAcknowledgement(config) {
	const securityAcknowledgedAt = config.wizard?.securityAcknowledgedAt;
	if (!securityAcknowledgedAt) return;
	const { mutateConfigFileWithRetry } = await import("./config/config.js");
	return (await mutateConfigFileWithRetry({ mutate: (draft) => {
		if (!draft.wizard?.securityAcknowledgedAt) draft.wizard = {
			...draft.wizard,
			securityAcknowledgedAt
		};
		if (config.telemetry?.consentedAt && !draft.telemetry?.consentedAt) draft.telemetry = config.telemetry;
	} })).nextConfig.wizard?.securityAcknowledgedAt;
}
async function requestGuidedOnboardingConsent(params) {
	const { opts, prompter, config: existingConfig, offerQuickstart } = params;
	let quickstart = false;
	if (offerQuickstart) {
		if (!existingConfig.wizard?.securityAcknowledgedAt) await prompter.note(t("wizard.guided.laneSecurityLine"), getSecurityNoteTitle());
		quickstart = await prompter.select({
			message: t("wizard.guided.laneQuestion"),
			options: [{
				value: "quick",
				label: t("wizard.guided.laneQuickLabel"),
				hint: t("wizard.guided.laneQuickHint")
			}, {
				value: "custom",
				label: t("wizard.guided.laneCustomLabel"),
				hint: t("wizard.guided.laneCustomHint")
			}],
			initialValue: "quick"
		}) === "quick";
	}
	let acknowledgedConfig = await requireRiskAcknowledgement({
		opts: quickstart ? {
			...opts,
			acceptRisk: true
		} : opts,
		prompter,
		config: existingConfig
	});
	if (!quickstart) acknowledgedConfig = await requestTelemetryConsent({
		opts,
		prompter,
		config: acknowledgedConfig
	});
	let securityAcknowledgedAt = acknowledgedConfig.wizard?.securityAcknowledgedAt;
	if (!existingConfig.wizard?.securityAcknowledgedAt || !existingConfig.telemetry?.consentedAt && acknowledgedConfig.telemetry?.consentedAt) {
		const persistedAcknowledgement = await (params.persistRiskAcknowledgement ?? persistRiskAcknowledgement)(acknowledgedConfig);
		if (persistedAcknowledgement) {
			securityAcknowledgedAt = persistedAcknowledgement;
			acknowledgedConfig = {
				...acknowledgedConfig,
				wizard: {
					...acknowledgedConfig.wizard,
					securityAcknowledgedAt
				}
			};
		}
	}
	const onboardingSecurityAcknowledgedAt = securityAcknowledgedAt;
	if (!onboardingSecurityAcknowledgedAt) throw new Error("Local onboarding requires its persisted security acknowledgement.");
	return {
		quickstart,
		config: acknowledgedConfig,
		securityAcknowledgedAt: onboardingSecurityAcknowledgedAt
	};
}
//#endregion
//#region src/commands/onboard-guided-manual.ts
const SETUP_FAILURE_REASON_KEYS = {
	auth: "wizard.guided.failureAuth",
	rate_limit: "wizard.guided.failureRateLimit",
	billing: "wizard.guided.failureBilling",
	timeout: "wizard.guided.failureTimeout",
	format: "wizard.guided.failureFormat",
	unavailable: "wizard.guided.failureUnavailable",
	unknown: "wizard.guided.failureUnknown"
};
async function noteActivationFailure(params) {
	await params.prompter.note(t("wizard.guided.testFailure", {
		label: params.label,
		reason: t(SETUP_FAILURE_REASON_KEYS[params.result.status]),
		detail: params.result.error
	}), t("wizard.guided.aiAccessTitle"));
}
async function runManualStage(params) {
	const detectedOptions = params.detection.candidates.map((candidate) => ({
		value: `candidate:${candidate.kind}`,
		label: t("wizard.guided.tryCandidate", {
			label: candidate.label,
			detail: candidate.detail
		})
	}));
	const additionalGroups = detectedOptions.length ? [{
		value: "detected-ai",
		label: t("wizard.guided.detectedGroupLabel"),
		hint: params.detection.candidates.map((candidate) => candidate.label).join(", "),
		methodMessage: t("wizard.guided.detectedGroupPrompt"),
		options: detectedOptions
	}] : [];
	const { promptAuthChoiceGrouped } = await import("./auth-choice-prompt-D7LCTpFD.mjs");
	while (true) {
		const choice = await promptAuthChoiceGrouped({
			prompter: params.prompter,
			includeSkip: true,
			assistantVisibleOnly: false,
			additionalGroups,
			config: params.config,
			workspaceDir: params.workspace
		});
		if (choice === "skip") return null;
		let candidate;
		if (choice.startsWith("candidate:")) {
			const kind = choice.slice(10);
			candidate = params.detection.candidates.find((item) => item.kind === kind);
			if (!candidate) continue;
		}
		const presentedOption = [
			...params.detection.manualProviders,
			...params.detection.authOptions,
			...params.detection.prepareOptions ?? []
		].find((option) => option.id === choice);
		const modelTarget = candidate ? candidate.modelTarget : presentedOption ? presentedOption.modelTarget : (await import("./provider-flow-C7PUAAcR.mjs")).resolveProviderSetupFlowContributions({
			config: params.config,
			workspaceDir: params.workspace
		}).find((entry) => entry.option.value === choice)?.option.modelTarget;
		const result = await withConsoleSubsystemsSuppressed(() => params.activate({
			kind: candidate?.kind ?? "provider-auth",
			...modelTarget ? { modelTarget } : {},
			...candidate ? { modelRef: candidate.modelRef } : { authChoice: choice },
			workspace: params.workspace,
			surface: "cli",
			runtime: params.runtime,
			prompter: params.prompter
		}));
		if (result.ok) return activationLines(result);
		await noteActivationFailure({
			prompter: params.prompter,
			label: candidate?.label ?? choice,
			result
		});
		if (candidate?.kind === "existing-model") await params.prompter.note(t("wizard.guided.existingModelKept"), t("wizard.guided.aiAccessTitle"));
	}
}
function activationLines(result) {
	return [...result.lines, t("wizard.guided.repliedIn", { seconds: (result.latencyMs / 1e3).toFixed(1) })];
}
//#endregion
//#region src/commands/onboard-guided.ts
async function runGuidedOnboardingFlow(opts, runtime, deps) {
	const onboardHelpers = await import("./onboard-helpers-Bs3xm5rG.mjs");
	const prompter = await (deps.createPrompter?.() ?? import("./clack-prompter-Cm44SoD8.mjs").then(({ createClackPrompter }) => createClackPrompter()));
	await onboardHelpers.printWizardHeader(runtime);
	await prompter.intro(t("wizard.guided.custodianIntro"));
	await prompter.note(t("wizard.guided.escapeHatches"), t("wizard.guided.welcomeTitle"));
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const snapshot = await readConfigFileSnapshot();
	if (snapshot.exists && !snapshot.valid) {
		const issues = snapshot.issues.length > 0 ? formatConfigIssueLines(snapshot.issues, "-").join("\n") : t("wizard.guided.invalidConfigUnknown");
		await prompter.note(t("wizard.guided.invalidConfigDetails", {
			path: shortenHomePath(snapshot.path),
			issues
		}), t("wizard.setup.invalidConfigTitle"));
		await prompter.outro(t("wizard.guided.invalidConfigRepair", {
			fixCommand: formatCliCommand("openclaw doctor --fix"),
			inspectCommand: formatCliCommand("openclaw config validate")
		}));
		runtime.exit(1);
		return null;
	}
	const existingConfig = snapshot.exists && snapshot.valid ? snapshot.sourceConfig ?? snapshot.config : {};
	const custodianMode = (deps.handoffMode ?? "hatch") === "hatch";
	const localOnboarding = custodianMode ? await import("./state/local-onboarding-state.js") : void 0;
	const previousLocalSetup = localOnboarding?.readLocalOnboardingState(snapshot.path);
	const consent = await requestGuidedOnboardingConsent({
		opts,
		prompter,
		config: existingConfig,
		offerQuickstart: custodianMode && (!snapshot.exists || isUnconfiguredConfigSource(existingConfig)) && existingConfig.wizard?.accessMode !== "guarded" && opts.nonInteractive !== true && opts.skipUi !== true && opts.tui !== true,
		persistRiskAcknowledgement: deps.persistRiskAcknowledgement
	});
	const { quickstart } = consent;
	const { config: acknowledgedConfig, securityAcknowledgedAt: onboardingSecurityAcknowledgedAt } = consent;
	let localSetup = snapshot.exists ? localOnboarding?.readLocalOnboardingStateForConfig(snapshot.path, existingConfig) : void 0;
	const resumingSetup = localSetup?.status === "pending";
	const hasAuthoredRoster = hasResolvedRosterBeforeMigrations(snapshot);
	if (opts.team && hasAuthoredRoster) throw new Error("An agent roster already exists. Use `openclaw agents team create` to add a team.");
	const firstAgent = resumingSetup && localSetup?.teamCoordinatorId && !hasAuthoredRoster ? {
		name: localSetup.teamCoordinatorId,
		team: true
	} : await promptFirstOnboardingAgent(hasAuthoredRoster, opts.agentName, prompter, quickstart, {
		team: opts.team,
		offerTeam: opts.nonInteractive !== true
	});
	if (previousLocalSetup?.status === "pending" && localSetup === void 0) {
		const currentSnapshot = await readConfigFileSnapshot();
		const currentAcknowledgement = currentSnapshot.valid ? (currentSnapshot.sourceConfig ?? currentSnapshot.config).wizard?.securityAcknowledgedAt : void 0;
		if (currentAcknowledgement === previousLocalSetup.securityAcknowledgedAt || currentAcknowledgement && currentAcknowledgement !== onboardingSecurityAcknowledgedAt) throw new Error("Another onboarding run already owns this installation. Retry setup.");
	}
	const replacePreviousSetup = !snapshot.exists || previousLocalSetup?.status === "pending" && localSetup === void 0 || previousLocalSetup?.status === "completed" && isUnconfiguredConfigSource(existingConfig);
	const handoffAgentId = firstAgent?.team ? normalizeAgentId(firstAgent.name) : resumingSetup && hasAuthoredRoster ? localSetup?.teamCoordinatorId ?? resolveSystemAgentOnboardingTarget(existingConfig).agentId : void 0;
	if (localSetup?.status === "pending" && opts.workspace?.trim() && resolveUserPath(opts.workspace.trim()) !== resolveUserPath(localSetup.workspace)) throw new Error("Another onboarding run owns a different workspace. Retry onboarding with its approved workspace.");
	const assertLocalSetupOwner = (config) => {
		if (localSetup?.status === "pending" && localOnboarding?.readLocalOnboardingStateForConfig(snapshot.path, config)?.runId !== localSetup.runId) throw new Error("Another onboarding run replaced this setup operation. Retry onboarding.");
	};
	let accessMode = "full";
	if (custodianMode && !quickstart) accessMode = await prompter.select({
		message: t("wizard.guided.accessQuestion"),
		options: [{
			value: "full",
			label: t("wizard.guided.accessFullLabel"),
			hint: t("wizard.guided.accessFullHint")
		}, {
			value: "guarded",
			label: t("wizard.guided.accessGuardedLabel"),
			hint: t("wizard.guided.accessGuardedHint")
		}],
		initialValue: existingConfig.wizard?.accessMode === "guarded" ? "guarded" : "full"
	}) === "guarded" ? "guarded" : "full";
	if (custodianMode && existingConfig.wizard?.accessMode !== accessMode) await (deps.persistAccessMode ?? persistGuidedAccessMode)(accessMode);
	const workspace = resolveUserPath(opts.workspace?.trim() || (resumingSetup ? localSetup?.workspace : void 0) || acknowledgedConfig.agents?.defaults?.workspace?.trim() || onboardHelpers.DEFAULT_WORKSPACE);
	const conversationWorkspace = handoffAgentId ? hasAuthoredRoster ? resolveOnboardingAgentTarget(existingConfig, handoffAgentId).workspaceDir : path.join(workspace, handoffAgentId) : workspace;
	let teamCoordinatorId = (resumingSetup ? localSetup?.teamCoordinatorId : void 0) ?? (firstAgent?.team ? normalizeAgentId(firstAgent.name) : void 0);
	if (resumingSetup && hasAuthoredRoster) {
		const { matchesLocalSetupWorkspace } = await import("./setup-recovery-B4NUI9Nn.mjs");
		if (localSetup?.teamCoordinatorId && !await matchesLocalSetupWorkspace(existingConfig, workspace, localSetup.teamCoordinatorId)) throw new Error("The pending team no longer matches its approved roster and workspace. Inspect `openclaw agents list` and repair the team before retrying setup.");
		if (!teamCoordinatorId && handoffAgentId && await matchesLocalSetupWorkspace(existingConfig, workspace, handoffAgentId)) teamCoordinatorId = handoffAgentId;
	}
	const activateInference = deps.activate ?? (await import("./system-agent/setup-inference.js")).activateSetupInference;
	const detect = deps.detect ?? (await import("./system-agent/setup-inference.js")).detectSetupInference;
	let detection;
	const claimLocalSetup = (sourceConfig) => {
		if (!localOnboarding) return;
		const committedSecurityAcknowledgedAt = sourceConfig.wizard?.securityAcknowledgedAt;
		if (committedSecurityAcknowledgedAt !== onboardingSecurityAcknowledgedAt) throw new Error("The onboarding configuration changed before inference could be saved. Retry onboarding.");
		if (localSetup?.status === "pending") {
			assertLocalSetupOwner(sourceConfig);
			return;
		}
		const runId = randomUUID();
		const claimedSetup = localOnboarding.beginLocalOnboarding({
			configPath: snapshot.path,
			workspace,
			...teamCoordinatorId ? { teamCoordinatorId } : {},
			securityAcknowledgedAt: committedSecurityAcknowledgedAt,
			runId,
			...replacePreviousSetup ? {
				replace: true,
				...previousLocalSetup ? { expectedRunId: previousLocalSetup.runId } : {}
			} : {}
		});
		if (claimedSetup.runId !== runId) throw new Error("Another onboarding run already owns this installation. Retry setup.");
		localSetup = claimedSetup;
	};
	const assertLocalSetupEffects = () => {
		if (!localSetup || !localOnboarding) return;
		const current = localOnboarding.readLocalOnboardingState(snapshot.path);
		if (current?.status !== "pending" || current.runId !== localSetup.runId || current.securityAcknowledgedAt !== localSetup.securityAcknowledgedAt) throw new Error("Another onboarding run replaced this setup operation. Retry onboarding.");
	};
	const activate = async (params) => {
		const activationParams = resumingSetup && hasAuthoredRoster && localSetup?.teamCoordinatorId ? {
			...params,
			agentId: localSetup.teamCoordinatorId
		} : params;
		if (!localOnboarding || !resumingSetup && (existingConfig.gateway || detection?.setupComplete === true)) return await activateInference(activationParams);
		return await activateInference({
			...activationParams,
			onCommitStarted: (sourceConfig) => {
				params.onCommitStarted?.(sourceConfig);
				claimLocalSetup(sourceConfig);
			}
		});
	};
	const wantsDiscovery = accessMode === "full" || await prompter.select({
		message: t("wizard.guided.lookAroundQuestion"),
		options: [{
			value: "look",
			label: t("wizard.guided.lookAroundYes")
		}, {
			value: "manual",
			label: t("wizard.guided.lookAroundManual")
		}],
		initialValue: "look"
	}) !== "manual";
	if (wantsDiscovery) {
		const detectionProgress = prompter.progress(t("wizard.guided.detecting"));
		detection = await detect();
		detectionProgress.stop(t("wizard.guided.detected"));
		if (detection.candidates.length === 0) {
			await prompter.note(t("wizard.guided.foundNothing"), t("wizard.guided.detectedTitle"));
			if (detection.recommendedInstalls.length > 0) {
				const recommendedInstalls = detection.recommendedInstalls.map((install) => t("wizard.guided.recommendedInstall", {
					label: install.label,
					hint: install.hint,
					website: install.website
				}));
				await prompter.note(recommendedInstalls.join("\n"), t("wizard.guided.recommendedInstallsTitle"));
			}
		} else {
			const candidates = detection.candidates.map((candidate) => t("wizard.guided.detectedCandidate", {
				label: candidate.label,
				detail: candidate.detail,
				recommended: ""
			}));
			await prompter.note(candidates.join("\n"), t("wizard.guided.detectedTitle"));
			const codingAgents = !custodianMode ? [] : detection.candidates.filter((candidate) => candidate.kind === "claude-cli" || candidate.kind === "codex-cli").map((candidate) => candidate.label);
			if (codingAgents.length > 0) await prompter.note(t("wizard.guided.codingAgentQuip", { labels: codingAgents.join(", ") }), t("wizard.guided.detectedTitle"));
		}
		if (detection.unavailableCandidates.length > 0) {
			const unavailable = detection.unavailableCandidates.map((candidate) => t("wizard.guided.unavailableCandidate", {
				label: candidate.label,
				detail: candidate.detail,
				reason: candidate.reason
			}));
			await prompter.note(unavailable.join("\n"), t("wizard.guided.unavailableTitle"));
		}
	} else detection = {
		candidates: [],
		unavailableCandidates: [],
		recommendedInstalls: [],
		...await (deps.listManualOptions ?? (await import("./system-agent/setup-inference.js")).listManualSetupInferenceOptions)()
	};
	const resultLines = await runManualStage({
		detection,
		config: existingConfig,
		workspace,
		runtime,
		prompter,
		activate
	});
	const skippedInference = resultLines === null;
	if (localOnboarding && (resumingSetup || !existingConfig.gateway && !detection.setupComplete)) {
		const { withConfigMutationExclusive } = await import("./config/config.js");
		await withConfigMutationExclusive(async (sourceConfig) => claimLocalSetup(sourceConfig));
	}
	if (resultLines?.length) await prompter.note(resultLines.join("\n"), t("wizard.guided.appliedTitle"));
	const persistedSnapshot = await readConfigFileSnapshot();
	let persistedConfig = persistedSnapshot.valid ? persistedSnapshot.sourceConfig ?? persistedSnapshot.config : acknowledgedConfig;
	if (!custodianMode) {
		if (skippedInference) {
			await prompter.note(t("wizard.guided.nextStepsWithoutAi", { workspace }), t("wizard.guided.nextStepsTitle"));
			return null;
		}
		if (wantsDiscovery) await (deps.runSetupMemoryImportStep ?? (await import("./setup.memory-import-52Yvd3k3.mjs")).runSetupMemoryImportStep)({
			config: persistedConfig,
			prompter,
			runtime,
			...handoffAgentId ? { agentId: handoffAgentId } : {}
		});
		return {
			workspace: conversationWorkspace,
			next: "chat",
			...firstAgent ? { agentName: firstAgent.name } : {}
		};
	}
	const alreadyConfigured = localSetup?.status !== "pending" && Boolean(detection?.setupComplete || existingConfig.gateway);
	let gatewayExternallyManaged = false;
	const { resolveSetupWorkspaceSelection } = await import("./setup.workspace-9IM55o4N.mjs");
	const workspaceSelection = await resolveSetupWorkspaceSelection({
		baseConfig: existingConfig,
		requestedWorkspaceDir: workspace,
		approvedWorkspaceDir: resumingSetup && teamCoordinatorId ? localSetup?.workspace : void 0,
		prompter,
		canConfirmMove: !alreadyConfigured
	});
	const { allowWorkspaceChange, conflict: workspaceConflict } = workspaceSelection;
	const appliedWorkspace = workspaceSelection.workspaceDir;
	if (localSetup?.status === "pending" && resolveUserPath(appliedWorkspace) !== localSetup.workspace) throw new Error("Another onboarding run owns a different workspace. Retry onboarding with its approved workspace.");
	if (alreadyConfigured) {
		if (!skippedInference) await prompter.note(t("wizard.guided.alreadySetUp"), t("wizard.guided.welcomeTitle"));
		if (workspaceConflict) await prompter.note(t("wizard.guided.workspaceConflictClassic", { command: formatCliCommand("openclaw onboard --classic") }), t("wizard.setup.workspaceConflictTitle"));
		if (firstAgent) {
			const { ensureOnboardingAgent } = await import("./onboard-agent-wGih_UzJ.mjs");
			const created = await ensureOnboardingAgent({
				config: persistedConfig,
				workspace: appliedWorkspace,
				baseConfig: persistedConfig,
				firstAgent
			});
			persistedConfig = created.config;
			await showSessionMigrationWarnings(prompter, created.sessionMigrationWarnings);
		}
	} else {
		const applyProgress = prompter.progress(t("wizard.guided.settingUp"));
		try {
			if (localSetup?.status === "pending") {
				const ownerSnapshot = await readConfigFileSnapshot();
				if (!ownerSnapshot.exists || !ownerSnapshot.valid || resolveUserPath(ownerSnapshot.path) !== localSetup.configPath) throw new Error("Another onboarding run replaced this setup operation. Retry onboarding.");
				assertLocalSetupOwner(ownerSnapshot.sourceConfig ?? ownerSnapshot.config);
			}
			const applySetup = deps.applySetup ?? (await import("./setup-apply-CvLX-CNu.mjs")).applySystemAgentSetup;
			const applied = await withConsoleSubsystemsSuppressed(() => applySetup({
				workspace,
				...firstAgent ? { firstAgent } : {},
				...teamCoordinatorId ? { teamCoordinatorId } : {},
				allowWorkspaceChange: allowWorkspaceChange || localSetup?.status === "pending",
				...resumingSetup ? { resume: true } : {},
				...localSetup?.status === "pending" ? { assertCommitPreconditions: assertLocalSetupOwner } : {},
				...!opts.skipHooks && !skippedInference ? { finalizeConfig: enableDefaultOnboardingInternalHooks } : {},
				surface: "cli",
				...quickstart || skippedInference ? { installDaemon: false } : {},
				runtime
			}, localSetup?.status === "pending" ? { beforePersistentApply: assertLocalSetupEffects } : void 0));
			if (applied.lines.length > 0) await prompter.note(applied.lines.join("\n"), t("wizard.guided.appliedTitle"));
			if (!applied.workspaceReady) throw new Error("The agent workspace could not be prepared. Retry onboarding to finish setup.");
			const gateway = applied.gateway;
			if (gateway.status === "failed") throw new Error(gateway.error);
			gatewayExternallyManaged = applied.gateway.status === "skipped" && applied.gateway.reason === "external";
			const appliedSnapshot = localSetup?.status === "pending" ? await (await import("./setup-recovery-B4NUI9Nn.mjs")).completeLocalSetupRecovery({
				owner: localSetup,
				appliedConfigPath: applied.configPath,
				teamCoordinatorId
			}) : await readConfigFileSnapshot();
			if (!appliedSnapshot.valid) throw new Error("Setup wrote an invalid OpenClaw config.");
			persistedConfig = appliedSnapshot.sourceConfig ?? appliedSnapshot.config;
			applyProgress.stop(t("wizard.guided.setupDone"));
		} catch (error) {
			applyProgress.stop(t("wizard.guided.testFailed"));
			if (teamCoordinatorId) throw new Error(`Onboarding did not complete: ${error instanceof Error ? error.message : String(error)} Run \`openclaw agents list\` to inspect the roster, then retry with the same --workspace after resolving the error.`, { cause: error });
			await prompter.note(t("wizard.guided.applyFailedFallback", { detail: error instanceof Error ? error.message : String(error) }), t("wizard.guided.aiAccessTitle"));
			if (skippedInference) throw error;
			return {
				workspace: conversationWorkspace,
				next: "chat",
				...firstAgent ? { agentName: firstAgent.name } : {}
			};
		}
	}
	const agentWorkspace = handoffAgentId ? resolveOnboardingAgentTarget(persistedConfig, handoffAgentId).workspaceDir : appliedWorkspace;
	if (skippedInference) {
		await prompter.note(t("wizard.guided.nextStepsWithoutAi", { workspace: agentWorkspace }), t("wizard.guided.nextStepsTitle"));
		await prompter.outro(t("wizard.guided.setupDone"));
		return null;
	}
	const { resolveConfiguredSetupModelForAgent } = await import("./utility-model-bWdwagEJ.mjs");
	const setupOnly = resolveConfiguredSetupModelForAgent({
		cfg: persistedConfig,
		agentId: handoffAgentId ?? resolveSystemAgentOnboardingTarget(persistedConfig).agentId
	})?.modelTarget === "utility";
	if (setupOnly) await prompter.note("Your setup and utility model is ready. It can help finish setup here. Choose a primary model in Model Setup or run openclaw onboard before regular agent chat.", "Setup and utility inference");
	if (wantsDiscovery && !quickstart && !setupOnly) {
		await (deps.runSetupMemoryImportStep ?? (await import("./setup.memory-import-52Yvd3k3.mjs")).runSetupMemoryImportStep)({
			config: persistedConfig,
			prompter,
			runtime,
			...handoffAgentId ? { agentId: handoffAgentId } : {}
		});
		const recommendationOutcome = await (deps.runAppRecommendations ?? (await import("./setup.app-recommendations-UFAcHEQ6.mjs")).setupAppRecommendations)({
			config: persistedConfig,
			prompter,
			runtime,
			workspaceDir: agentWorkspace,
			modelRouteVerified: true
		});
		const recommendedConfig = recommendationOutcome.config;
		if (recommendedConfig !== persistedConfig) {
			const { writeWizardConfigFile } = await import("./setup.shared-iQVFZJd6.mjs");
			persistedConfig = (await writeWizardConfigFile(recommendedConfig, {
				allowConfigSizeDrop: false,
				mergeBase: persistedConfig
			})).nextConfig;
		}
		await recommendationOutcome.commitResult();
	}
	const hatchWorkspace = handoffAgentId ? agentWorkspace : alreadyConfigured ? resolveUserPath(existingConfig.agents?.defaults?.workspace?.trim() || onboardHelpers.DEFAULT_WORKSPACE) : appliedWorkspace;
	if (quickstart && !gatewayExternallyManaged) {
		await prompter.outro(t("wizard.guided.setupDone"));
		return {
			workspace: hatchWorkspace,
			next: "foreground-gateway",
			...handoffAgentId ? { agentId: handoffAgentId } : {}
		};
	}
	if (opts.skipUi === true) {
		await prompter.outro(t("wizard.guided.complete"));
		return null;
	}
	if (opts.tui !== true) {
		if ((await (deps.runBrowserHandoff ?? (await import("./onboard-browser-handoff-D5RUe4CJ.mjs")).runBrowserHatchHandoff)({
			config: persistedConfig,
			prompter,
			...handoffAgentId ? { agentId: handoffAgentId } : {},
			...opts.suppressGatewayTokenOutput ? { suppressTokenOutput: true } : {}
		})).handedOff) {
			await prompter.outro(t("wizard.guided.browserHandoffReady"));
			return {
				workspace: hatchWorkspace,
				next: "browser"
			};
		}
	}
	if (setupOnly) {
		await prompter.outro("Continuing with the OpenClaw setup assistant.");
		return {
			workspace: hatchWorkspace,
			next: "chat"
		};
	}
	await prompter.note(t("wizard.guided.findMeLater"), t("wizard.guided.welcomeTitle"));
	await prompter.outro(t("wizard.guided.hatchingNow"));
	return {
		workspace: hatchWorkspace,
		next: "hatch",
		local: alreadyConfigured,
		...handoffAgentId ? { agentId: handoffAgentId } : {}
	};
}
async function runGuidedOnboarding(opts, runtime, deps = {}) {
	if (!hasInteractiveOnboardingTty()) {
		runtime.error(t("wizard.guided.ttyRequired"));
		runtime.exit(1);
		return;
	}
	const state = { handoff: null };
	await runInteractiveOnboarding(async () => {
		state.handoff = await runGuidedOnboardingFlow(opts, runtime, deps);
	}, runtime);
	await runGuidedOnboardingHandoff(state.handoff, opts, runtime, deps);
}
//#endregion
export { runGuidedOnboarding as t };
