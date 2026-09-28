import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as isNotFoundPathError, r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as resolveAgentDir, d as resolveAmbientOwnerAgentId, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { _ as resolveGatewayLockDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as withConsoleSubsystemsSuppressed } from "./console-DwqfhE-H.mjs";
import { c as closeOpenClawStateDatabaseByPathAsync } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { g as writeJsonAtomic, r as readDurableJsonFile } from "./json-files-C0HSMh2Z.mjs";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-zIYbDm7V.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { i as listAvailableManifestContractPlugins, o as loadManifestContractSnapshot } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { o as resolveAgentEffectiveModelPrimary, w as setAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import "./openclaw-state-db-BFK9cMiV.mjs";
import { p as materializeRuntimeConfig } from "./validation-core-DwJVlxTe.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-C1--BlNd.mjs";
import { l as openOpenClawAgentDatabase, o as disposeOpenClawAgentDatabaseByPath } from "./openclaw-agent-db-CaQAStOA.mjs";
import { a as unregisterOpenClawAgentDatabase, i as registerOpenClawAgentDatabase } from "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { r as clearRuntimeAuthProfileStoreSnapshot } from "./store-CTvq6MSF.mjs";
import { r as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-k2s7FqfS.mjs";
import { d as withSetupCredentialAccess } from "./order-BQhYF772.mjs";
import { l as loadAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-CzCVI_rv.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { a as sameDefaultInferenceRoute, i as resolveSystemAgentConfiguredRouteFromConfig, r as projectInferenceRoute } from "./inference-route-BGQ51WRL.mjs";
import { l as resolveOnboardingSetupTarget, n as applyOnboardingPrimaryModel, o as prepareAgentModelDefaults, r as applyOnboardingUtilityModel, s as projectAgentModelDefaults } from "./onboard-agent-target-pGC2ybZv.mjs";
import { n as commitSetupInferenceActivation, r as restoreSetupInferenceConfig } from "./setup-inference-transition-DrmybJHR.mjs";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.mjs";
import { t as isSetupCredentialReplacement } from "./setup-inference-credentials-WyDVPvW3.mjs";
import { a as revalidateStableSetupInferenceOwner, u as activateSavedSetupCredential } from "./setup-inference-turn-Dwchx-pp.mjs";
import { y as summarizeMigrationItems } from "./migration-DepQtnwV.mjs";
import { s as writeMigrationReport } from "./migration-runtime-BHf1AeHu.mjs";
import { n as runWizardWithPromptNavigationScope } from "./navigation-prompter-DZbGfNMu.mjs";
import { a as buildSetupMigrationPlanSourceSnapshot, c as prepareSetupMigrationAttemptBoundary, d as hashSetupMigrationConfig, i as assertFreshSetupMigrationTarget, l as preserveSetupMigrationOnboardingConsents, n as SetupMigrationTargetChangedError, o as buildSetupMigrationTargetSnapshot, s as inspectSetupMigrationFreshness, u as withSetupMigrationTargetLock } from "./setup.migration-snapshot-LPO-VgcK.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/wizard/setup.model-auth.ts
const loadAuthChoiceModule = createLazyRuntimeModule(() => import("./auth-choice-CGo9knSt.mjs"));
const loadModelPickerModule = createLazyRuntimeModule(() => import("./model-picker-D_dqjKFp.mjs"));
async function resolveAuthChoiceModelSelectionPolicy(params) {
	const preferredProvider = await params.resolvePreferredProviderForAuthChoice({
		choice: params.authChoice,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const [{ resolveManifestProviderAuthChoice }, { resolvePluginSetupProviderCore }] = await Promise.all([import("./provider-auth-choices-CELvXWSf.mjs"), import("./setup-registry-zoAAS0J1.mjs")]);
	const manifestChoice = resolveManifestProviderAuthChoice(params.authChoice, {
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includeUntrustedWorkspacePlugins: false
	});
	if (manifestChoice) {
		const setupProvider = resolvePluginSetupProviderCore({
			provider: manifestChoice.providerId,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			pluginIds: [manifestChoice.pluginId]
		});
		const setupPolicy = (setupProvider?.auth.find((method) => normalizeProviderId(method.id) === normalizeProviderId(manifestChoice.methodId)))?.wizard?.modelSelection ?? setupProvider?.wizard?.setup?.modelSelection;
		return {
			preferredProvider,
			promptWhenAuthChoiceProvided: setupPolicy?.promptWhenAuthChoiceProvided === true,
			allowKeepCurrent: setupPolicy?.allowKeepCurrent ?? true
		};
	}
	const { resolvePluginProviders, resolveProviderPluginChoice } = await import("./provider-auth-choice.runtime.js");
	const providers = resolvePluginProviders({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		mode: "setup"
	});
	const resolvedChoice = resolveProviderPluginChoice({
		providers,
		choice: params.authChoice
	});
	const matchedProvider = resolvedChoice?.provider ?? (() => {
		const preferredId = preferredProvider?.trim();
		if (!preferredId) return;
		return providers.find((provider) => typeof provider.id === "string" && provider.id.trim() === preferredId);
	})();
	const setupPolicy = resolvedChoice?.wizard?.modelSelection ?? matchedProvider?.wizard?.setup?.modelSelection;
	return {
		preferredProvider,
		promptWhenAuthChoiceProvided: setupPolicy?.promptWhenAuthChoiceProvided === true,
		allowKeepCurrent: setupPolicy?.allowKeepCurrent ?? true
	};
}
/**
* Run the provider auth-choice + default-model selection loop. When
* `opts.authChoice` is set the prompt is skipped and the flag drives the flow
* (public onboarding automation contract).
*/
async function runSetupModelAuthStep(params) {
	const { opts, prompter, runtime } = params;
	const env = params.stateDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} : void 0;
	let nextConfig = params.stagedCandidate?.config ?? params.config;
	let replacementBaseConfig = params.config;
	let authProfiles = params.stagedCandidate?.authProfiles ?? [];
	let persistAuthProfiles = params.stagedCandidate?.persistAuthProfiles ?? (async () => {});
	const authChoiceFromPrompt = opts.authChoice === void 0;
	let authChoice = opts.authChoice;
	let promptAuthChoiceGrouped;
	let isKeepCurrentAuthChoice;
	let detectedProviderIds;
	const target = resolveOnboardingSetupTarget(params.config, params.pendingAgent);
	if (authChoiceFromPrompt) {
		const [{ promptAuthChoiceGrouped: promptAuthChoice, isKeepCurrentAuthChoice: isKeepCurrentChoice }, { detectAvailableSetupProviderIds }] = await Promise.all([import("./auth-choice-prompt-D7LCTpFD.mjs"), import("./provider-setup-availability-B988bHHd.mjs")]);
		promptAuthChoiceGrouped = promptAuthChoice;
		isKeepCurrentAuthChoice = isKeepCurrentChoice;
		detectedProviderIds = await detectAvailableSetupProviderIds({
			config: nextConfig,
			workspaceDir: target.workspaceDir,
			env
		});
	}
	while (true) {
		if (authChoiceFromPrompt) authChoice = await promptAuthChoiceGrouped({
			prompter,
			includeSkip: true,
			config: nextConfig,
			workspaceDir: target.workspaceDir,
			allowKeepCurrentProvider: true,
			detectedProviderIds
		});
		if (authChoice === void 0) throw new WizardCancelledError(t("wizard.setup.authChoiceRequired"));
		if (isKeepCurrentAuthChoice?.(authChoice)) break;
		nextConfig = replacementBaseConfig;
		authProfiles = [];
		persistAuthProfiles = async () => {};
		if (authChoice === "custom-api-key") {
			const [{ promptCustomApiConfig }, { prepareCustomSetupCredentials }, { persistProviderAuthProfileBatch }] = await Promise.all([
				import("./onboard-custom-2eSclwYp.mjs"),
				import("./setup-inference-custom-ChBwJ3g8.mjs"),
				import("./provider-auth-persistence-ByCgUTMb.mjs")
			]);
			const custom = prepareCustomSetupCredentials(await promptCustomApiConfig({
				prompter,
				runtime,
				config: nextConfig,
				target,
				secretInputMode: opts.secretInputMode,
				setAsPrimary: !params.preserveExistingModelSelection,
				verification: "deferred"
			}));
			nextConfig = custom.config;
			authProfiles = custom.profiles;
			persistAuthProfiles = async (profiles = custom.profiles) => {
				await persistProviderAuthProfileBatch({
					profiles,
					config: custom.config,
					agentDir: params.agentDir ?? target.agentDir,
					stateDir: params.stateDir
				});
			};
			prompter.disableBackNavigation?.();
			break;
		}
		if (authChoice === "skip") {
			if (authChoiceFromPrompt) {
				const { promptDefaultModel } = await loadModelPickerModule();
				const modelSelection = await promptDefaultModel({
					config: nextConfig,
					prompter,
					allowKeep: true,
					ignoreAllowlist: true,
					includeProviderPluginSetups: false,
					loadCatalog: false,
					agentId: target.agentId,
					agentDir: target.agentDir,
					workspaceDir: target.workspaceDir,
					runtime
				});
				if (modelSelection.config) nextConfig = modelSelection.config;
				if (modelSelection.model) nextConfig = applyOnboardingPrimaryModel(nextConfig, target, modelSelection.model);
				const { warnIfModelConfigLooksOff } = await loadAuthChoiceModule();
				await warnIfModelConfigLooksOff(nextConfig, prompter, {
					agentId: target.agentId,
					agentDir: target.agentDir
				});
			}
			break;
		}
		const [{ prepareAuthChoice, resolvePreferredProviderForAuthChoice, warnIfModelConfigLooksOff }, { promptDefaultModel }] = await Promise.all([loadAuthChoiceModule(), loadModelPickerModule()]);
		prompter.disableBackNavigation?.();
		const agentScopedModels = nextConfig.agents?.ownership === "explicit";
		let authResult;
		try {
			authResult = await prepareAuthChoice({
				authChoice,
				config: agentScopedModels ? prepareAgentModelDefaults(nextConfig, target) : nextConfig,
				prompter,
				runtime,
				agentId: target.agentId,
				agentDir: params.agentDir ?? target.agentDir,
				workspaceDir: target.workspaceDir,
				setDefaultModel: true,
				preserveExistingDefaultModel: true,
				env,
				opts: {
					...opts,
					token: opts.authChoice === "apiKey" && opts.token ? opts.token : void 0
				}
			});
		} catch (error) {
			if (error instanceof WizardCancelledError || !authChoiceFromPrompt) throw error;
			await prompter.note([formatErrorMessage(error), t("wizard.setup.authChoiceFailedRetry")].join("\n"), t("wizard.setup.authChoiceFailedTitle"));
			continue;
		}
		nextConfig = agentScopedModels ? projectAgentModelDefaults(nextConfig, target, authResult.config) : authResult.config;
		authProfiles = authResult.authProfiles;
		persistAuthProfiles = authResult.persistAuthProfiles;
		if (authResult.retrySelection) {
			if (authChoiceFromPrompt) {
				replacementBaseConfig = nextConfig;
				continue;
			}
			break;
		}
		if (authResult.agentModelOverride) nextConfig = applyOnboardingPrimaryModel(nextConfig, target, authResult.agentModelOverride);
		if (authResult.utilityModelOverride) {
			nextConfig = applyOnboardingUtilityModel(nextConfig, target, authResult.utilityModelOverride);
			break;
		}
		const authChoiceModelSelectionPolicy = await resolveAuthChoiceModelSelectionPolicy({
			authChoice,
			config: nextConfig,
			workspaceDir: target.workspaceDir,
			resolvePreferredProviderForAuthChoice
		});
		if (authChoiceFromPrompt || authChoiceModelSelectionPolicy.promptWhenAuthChoiceProvided && (!params.preserveExistingModelSelection || !authChoiceModelSelectionPolicy.allowKeepCurrent)) {
			const modelSelection = await promptDefaultModel({
				config: nextConfig,
				prompter,
				allowKeep: authChoiceModelSelectionPolicy?.allowKeepCurrent ?? true,
				ignoreAllowlist: true,
				includeProviderPluginSetups: true,
				preferredProvider: authChoiceModelSelectionPolicy?.preferredProvider,
				browseCatalogOnDemand: true,
				agentId: target.agentId,
				agentDir: target.agentDir,
				workspaceDir: target.workspaceDir,
				runtime
			});
			if (modelSelection.config) nextConfig = modelSelection.config;
			if (modelSelection.model) nextConfig = applyOnboardingPrimaryModel(nextConfig, target, modelSelection.model);
		}
		await warnIfModelConfigLooksOff(nextConfig, prompter, {
			agentId: target.agentId,
			agentDir: target.agentDir,
			pendingAuthProfiles: authProfiles
		});
		break;
	}
	return {
		config: nextConfig,
		authProfiles,
		persistAuthProfiles
	};
}
//#endregion
//#region src/wizard/setup.inference-verification.ts
async function completeSetupModelAuth(params) {
	const { stagedCandidate, opts, baseConfig } = params;
	const replacementTarget = resolveOnboardingSetupTarget(baseConfig);
	if (stagedCandidate?.authProfiles.some(({ credential }) => isSetupCredentialReplacement({
		provider: credential.provider,
		baseConfig,
		agentDir: replacementTarget.agentDir
	})) === true || opts.nonInteractive !== true && !params.importedInferenceVerified && resolveAgentEffectiveModelPrimary(params.config, resolveAmbientOwnerAgentId(params.config)) !== void 0 && (params.usedImportFlow && params.keepExistingModelConfig || opts.authChoice !== "skip")) {
		const verificationTarget = resolveOnboardingSetupTarget(params.config);
		const verification = await offerLiveModelVerification({
			config: params.config,
			baseConfig,
			...stagedCandidate ? { initialCandidate: {
				...stagedCandidate,
				config: params.config
			} } : {},
			opts,
			prompter: params.prompter,
			runtime: params.runtime,
			workspaceDir: verificationTarget.workspaceDir,
			configTarget: params.configTarget,
			required: params.usedImportFlow && params.keepExistingModelConfig
		});
		let config = verification.config;
		if (!verification.verified && verification.attempted && stagedCandidate) {
			const inversePatch = createMergePatch(stagedCandidate.config, baseConfig);
			config = applyMergePatch(config, inversePatch);
		} else if (!verification.verified && stagedCandidate) await stagedCandidate.persistAuthProfiles();
		return {
			config,
			verified: verification.verified,
			persisted: verification.persisted
		};
	}
	await stagedCandidate?.persistAuthProfiles();
	return {
		config: params.config,
		verified: false,
		persisted: false
	};
}
async function offerLiveModelVerification(params) {
	const requiresCandidateVerification = (config) => {
		const provider = resolveDefaultModelForAgent({ cfg: config }).provider;
		return params.opts.nonInteractive !== true && config.models?.providers?.[provider]?.localService !== void 0;
	};
	const agentDir = params.agentDir ?? resolveAgentDir(params.config, resolveAmbientOwnerAgentId(params.config));
	const replacesCredential = params.initialCandidate?.authProfiles.some(({ credential }) => isSetupCredentialReplacement({
		provider: credential.provider,
		baseConfig: params.baseConfig ?? params.config,
		agentDir
	}));
	let required = params.required || params.initialCandidate !== void 0 && requiresCandidateVerification(params.initialCandidate.config);
	if (!required && !replacesCredential) {
		if (!await params.prompter.confirm({
			message: t("wizard.setup.testAiAccess"),
			initialValue: true
		})) return {
			config: params.config,
			attempted: false,
			persisted: false,
			verified: false
		};
	}
	const inference = await import("./system-agent/setup-inference.js");
	let shouldPersistCandidate = params.initialCandidate !== void 0;
	let savedProfile;
	let verifiedBinding;
	let verifiedConfig;
	const verify = async (candidate) => {
		const progress = params.prompter.progress(t("wizard.setup.testAiProgress"));
		let result;
		try {
			let config = migratePersistedImplicitMainRoster(candidate.config).config;
			const agentId = resolveAmbientOwnerAgentId(config);
			if (candidate.authProfiles.length > 0) {
				const { saveSetupCredential, selectSetupCredential } = await import("./setup-inference-credentials-BlvO2N_Z.mjs");
				const { projectSetupInferenceConfig } = await import("./setup-model-selection-CY5EmyNe.mjs");
				const model = resolveDefaultModelForAgent({
					cfg: config,
					agentId
				});
				const modelRef = `${model.provider}/${model.model}`;
				const profile = selectSetupCredential(candidate.authProfiles, modelRef, config);
				if (!profile) throw new Error(`The selected provider did not return credentials for ${modelRef}.`);
				const saved = await saveSetupCredential({
					profile,
					modelRef,
					config: candidate.config,
					baseConfig: params.baseConfig ?? params.config,
					agentDir: params.agentDir ?? resolveAgentDir(config, agentId),
					persistAuthProfiles: candidate.persistAuthProfiles
				});
				candidate.config = projectSetupInferenceConfig({
					base: saved.config,
					prepared: saved.config,
					modelRef,
					agentId,
					profileId: saved.profile.profileId,
					credential: saved.profile.credential
				});
				setAgentEffectiveModelPrimary(candidate.config, agentId, `${modelRef}@${saved.profile.profileId}`);
				candidate.authProfiles = [];
				config = migratePersistedImplicitMainRoster(candidate.config).config;
			}
			const profileId = splitTrailingAuthProfile(resolveAgentEffectiveModelPrimary(config, agentId) ?? "").profile;
			const credential = profileId ? loadAuthProfileStoreWithoutExternalProfiles(agentDir).profiles[profileId] : void 0;
			savedProfile = profileId && credential ? {
				profileId,
				credential
			} : void 0;
			verifiedBinding = void 0;
			verifiedConfig = savedProfile?.credential.setup?.replacement ? await params.configTarget.read() : void 0;
			const runVerification = () => withConsoleSubsystemsSuppressed(() => inference.verifySetupInferenceConfig({
				config,
				agentId,
				runtime: params.runtime,
				...savedProfile?.credential.setup?.replacement ? { onVerifiedExecution: (binding) => {
					verifiedBinding = binding;
				} } : {},
				...params.agentDir ? { agentDir: params.agentDir } : {}
			}));
			result = profileId ? await withSetupCredentialAccess({
				profileId,
				agentDir
			}, runVerification) : await runVerification();
			if (result.ok && profileId) {
				const verifiedCredential = loadAuthProfileStoreWithoutExternalProfiles(agentDir).profiles[profileId];
				savedProfile = verifiedCredential ? {
					profileId,
					credential: verifiedCredential
				} : void 0;
			}
		} finally {
			progress.stop();
		}
		if (result.ok) await params.prompter.note(t("wizard.setup.testAiSuccess", { seconds: (result.latencyMs / 1e3).toFixed(1) }), t("wizard.setup.testAiTitle"));
		else await params.prompter.note(t("wizard.setup.testAiFailure", { reason: result.error }), t("wizard.setup.testAiTitle"));
		return result;
	};
	let candidate = params.initialCandidate ?? {
		config: params.config,
		authProfiles: [],
		persistAuthProfiles: async () => {}
	};
	while (true) {
		const result = await verify(candidate);
		if (result.ok) {
			if (!shouldPersistCandidate) return {
				config: params.config,
				attempted: true,
				persisted: false,
				verified: true,
				modelRef: result.modelRef
			};
			if (savedProfile?.credential.setup?.replacement && (params.opts.nonInteractive || !await params.prompter.confirm({
				message: "Connection verified. Activate this saved sign-in?",
				initialValue: true
			}))) {
				await params.prompter.note("Saved but inactive. Your current connection is unchanged. Choose the saved sign-in in Model Setup to activate it.");
				return {
					config: params.config,
					attempted: true,
					persisted: false,
					verified: false
				};
			}
			const binding = verifiedBinding;
			const revalidateCredential = async (config) => {
				if (!savedProfile?.credential.setup?.replacement || !binding) return;
				await withSetupCredentialAccess({
					profileId: savedProfile.profileId,
					agentDir
				}, async () => {
					const route = await resolveSystemAgentConfiguredRouteFromConfig(config);
					if (!route) throw new Error("The verified connection is no longer available. Test the saved sign-in again.");
					await revalidateStableSetupInferenceOwner({
						route: {
							...route,
							agentDir
						},
						auth: binding.auth.proofKind === "runtime-owner" ? {
							...binding.auth,
							authFingerprint: void 0,
							runtimeOwnerFingerprint: binding.auth.authFingerprint
						} : binding.auth,
						stagedOwnerPluginArtifacts: binding,
						deps: {}
					});
				});
			};
			if (savedProfile?.credential.setup?.replacement) {
				if (!binding || !isDeepStrictEqual((await params.configTarget.read()).config, verifiedConfig?.config)) throw new Error("Connection settings changed or verification is incomplete. The saved sign-in is inactive; test it again.");
				await revalidateCredential(candidate.config);
			}
			const projectRoute = (config) => projectInferenceRoute(materializeRuntimeConfig(config), void 0, {}, config);
			const verifiedRoute = savedProfile?.credential.setup?.replacement ? await projectRoute(candidate.config) : void 0;
			return {
				config: await commitSetupInferenceActivation({
					config: candidate.config,
					configTarget: {
						...params.configTarget,
						write: verifiedConfig?.write ?? params.configTarget.write
					},
					assertCurrent: () => {},
					activate: async () => {
						if (savedProfile?.credential.setup?.replacement && verifiedRoute) {
							const latest = (await params.configTarget.read()).config;
							if (!sameDefaultInferenceRoute(await projectRoute(latest), verifiedRoute)) throw new Error("The connection changed before activation. Test the saved sign-in again.");
							await revalidateCredential(latest);
						}
						return savedProfile?.credential.setup ? await activateSavedSetupCredential({
							...savedProfile,
							agentDir,
							stateDir: params.stateDir
						}) : void 0;
					}
				}),
				attempted: true,
				persisted: true,
				verified: true,
				modelRef: result.modelRef
			};
		}
		if (params.opts.nonInteractive) return {
			config: params.config,
			attempted: true,
			persisted: false,
			verified: false
		};
		if (!required && await params.prompter.select({
			message: t("wizard.setup.testAiFailureChoice"),
			options: [{
				value: "fix",
				label: t("wizard.setup.testAiFix")
			}, {
				value: "continue",
				label: t("wizard.setup.testAiContinue")
			}]
		}) === "continue") return {
			config: params.config,
			attempted: true,
			persisted: false,
			verified: false
		};
		candidate = await runSetupModelAuthStep({
			config: params.config,
			stagedCandidate: candidate,
			opts: {
				...params.opts,
				authChoice: void 0
			},
			prompter: params.prompter,
			runtime: params.runtime,
			...params.agentDir ? { agentDir: params.agentDir } : {},
			...params.stateDir ? { stateDir: params.stateDir } : {}
		});
		shouldPersistCandidate = true;
		required ||= requiresCandidateVerification(candidate.config);
	}
}
//#endregion
//#region src/wizard/setup.migration-promotion.ts
const PROMOTION_JOURNAL_FILE = "onboarding-promotion.json";
/** Counts dangling leaf entries as present and propagates non-missing path errors. */
async function migrationPathEntryExists(candidate) {
	try {
		await fs.lstat(candidate);
		return true;
	} catch (error) {
		if (isNotFoundPathError(error)) return false;
		throw error;
	}
}
async function readLatestPromotionJournal(params) {
	const root = path.join(params.stateDir, "migration", params.providerId);
	let entries;
	try {
		entries = await fs.readdir(root, { withFileTypes: true });
	} catch (error) {
		if (isNotFoundPathError(error)) return;
		throw error;
	}
	for (const entry of entries.filter((candidate) => candidate.isDirectory()).toSorted((left, right) => right.name.localeCompare(left.name))) {
		const journalPath = path.join(root, entry.name, PROMOTION_JOURNAL_FILE);
		const value = await readDurableJsonFile(journalPath);
		if (value?.version === 1 && value.providerId === params.providerId) return {
			path: journalPath,
			journal: value
		};
	}
}
async function writePromotionJournal(journalPath, journal) {
	await writeJsonAtomic(journalPath, {
		...journal,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	}, {
		mode: 384,
		dirMode: 448,
		trailingNewline: true
	});
}
async function copyPromotionReportArtifacts(params) {
	let entries;
	try {
		entries = await fs.readdir(params.stagedReportDir, { withFileTypes: true });
	} catch (error) {
		if (isNotFoundPathError(error)) return;
		throw error;
	}
	await fs.mkdir(params.reportDir, {
		recursive: true,
		mode: 448
	});
	for (const entry of entries) {
		if (entry.name === "report.json" || entry.name === "summary.md" || entry.name === "onboarding-promotion.json") continue;
		await fs.cp(path.join(params.stagedReportDir, entry.name), path.join(params.reportDir, entry.name), {
			recursive: true,
			force: true
		});
	}
}
async function cleanupPromotionStaging(continuation) {
	await Promise.all(continuation.stagedRoots.map(async (root) => await fs.rm(root, {
		recursive: true,
		force: true
	})));
}
function createPromotionResume(journalPath, journal) {
	const continuation = journal.continuation;
	if (!continuation) throw new Error(`Onboarding migration continuation is missing from ${journalPath}.`);
	return {
		journalPath,
		continuation,
		copyReportArtifacts: async () => await copyPromotionReportArtifacts({
			stagedReportDir: continuation.stagedReportDir,
			reportDir: path.dirname(journalPath)
		}),
		async saveDeferredResult(result) {
			continuation.deferredResult = result;
			await writePromotionJournal(journalPath, journal);
		},
		async complete() {
			journal.status = "completed";
			await writePromotionJournal(journalPath, journal);
		},
		async acknowledge() {
			await Promise.all(journal.components.map(async (component) => {
				if (component.emptyTargetBackupPath) await fs.rm(component.emptyTargetBackupPath, {
					recursive: true,
					force: true
				});
			}));
			await fs.rm(journalPath, { force: true });
		},
		cleanup: async () => await cleanupPromotionStaging(continuation)
	};
}
async function removeCreatedPromotionParents(components) {
	const parents = [...new Set(components.flatMap((component) => component.createdParentPaths ?? []))].toSorted((left, right) => right.length - left.length || right.localeCompare(left));
	for (const parent of parents) try {
		await fs.rmdir(parent);
	} catch (error) {
		if (isNotFoundPathError(error)) continue;
		throw error;
	}
}
async function rollbackComponents(components) {
	try {
		for (const component of components.toReversed()) {
			const stagedExists = await migrationPathEntryExists(component.stagedPath);
			const finalExists = await migrationPathEntryExists(component.finalPath);
			const backupExists = component.emptyTargetBackupPath ? await migrationPathEntryExists(component.emptyTargetBackupPath) : false;
			if (!stagedExists && !finalExists) return false;
			if (finalExists && !stagedExists) {
				await fs.mkdir(path.dirname(component.stagedPath), {
					recursive: true,
					mode: 448
				});
				await fs.rename(component.finalPath, component.stagedPath);
			} else if (finalExists && stagedExists) {
				if (backupExists || !component.targetWasEmptyDirectory || (await fs.readdir(component.finalPath)).length > 0) return false;
			}
			if (backupExists) {
				if (await migrationPathEntryExists(component.finalPath)) return false;
				await fs.rename(component.emptyTargetBackupPath, component.finalPath);
			} else if (component.targetWasEmptyDirectory) await fs.mkdir(component.finalPath, {
				recursive: true,
				mode: 448
			});
			component.status = "rolled-back";
		}
		await removeCreatedPromotionParents(components);
		return true;
	} catch {
		return false;
	}
}
async function hasPublishedPromotionComponent(components) {
	for (const component of components) {
		if (component.status === "promoted") return true;
		const [stagedExists, finalExists] = await Promise.all([migrationPathEntryExists(component.stagedPath), migrationPathEntryExists(component.finalPath)]);
		if (!stagedExists && finalExists) return true;
	}
	return false;
}
/** Reconciles interrupted promotion and returns any committed finalization to resume. */
async function recoverSetupMigrationPromotion(params) {
	const found = await readLatestPromotionJournal(params);
	if (!found) return;
	const journal = found.journal;
	if (journal.status === "rolled-back") {
		if (journal.continuation) await cleanupPromotionStaging(journal.continuation);
		return;
	}
	if (journal.status === "indeterminate") throw new Error(`An onboarding migration promotion is indeterminate. Review ${found.path} and run openclaw doctor before retrying.`);
	const currentConfigHash = hashSetupMigrationConfig(await params.readConfigFile());
	const finalPaths = journal.components.map((component) => component.finalPath);
	const allFinal = (await Promise.all(finalPaths.map(migrationPathEntryExists))).every(Boolean);
	if (journal.status === "completed") return createPromotionResume(found.path, journal);
	if (journal.status === "committed") {
		if (allFinal) return createPromotionResume(found.path, journal);
		journal.status = "indeterminate";
		await writePromotionJournal(found.path, journal);
		throw new Error(`A committed onboarding migration no longer matches its promoted target. Review ${found.path} and run openclaw doctor before retrying.`);
	}
	if (currentConfigHash === journal.configHashTarget && allFinal) {
		journal.status = "committed";
		await writePromotionJournal(found.path, journal);
		return createPromotionResume(found.path, journal);
	}
	if (currentConfigHash === journal.configHashBefore) {
		if (await hasPublishedPromotionComponent(journal.components)) {
			journal.status = "indeterminate";
			await writePromotionJournal(found.path, journal);
			throw new Error(`An interrupted onboarding migration published local data before config commit. Review ${found.path} and run openclaw doctor before retrying.`);
		}
		if (await rollbackComponents(journal.components)) {
			journal.status = "rolled-back";
			await writePromotionJournal(found.path, journal);
			if (journal.continuation) await cleanupPromotionStaging(journal.continuation);
			return;
		}
	}
	journal.status = "indeterminate";
	await writePromotionJournal(found.path, journal);
	throw new Error(`Could not reconcile an interrupted onboarding migration. Review ${found.path} and run openclaw doctor before retrying.`);
}
async function listMissingPromotionParents(target) {
	const missing = [];
	let current = path.dirname(target);
	while (!await migrationPathEntryExists(current)) {
		missing.push(current);
		const parent = path.dirname(current);
		if (parent === current) throw new Error(`Could not find an existing parent for migration promotion at ${target}.`);
		current = parent;
	}
	return missing;
}
async function reserveEmptyTargetBackupPath(target) {
	const reserved = await fs.mkdtemp(path.join(path.dirname(target), ".openclaw-migration-empty-"));
	await fs.rmdir(reserved);
	return reserved;
}
async function recordPromotionTargetState(component) {
	component.createdParentPaths = await listMissingPromotionParents(component.finalPath);
	if (!await migrationPathEntryExists(component.finalPath)) return;
	if (!(await fs.lstat(component.finalPath)).isDirectory() || (await fs.readdir(component.finalPath)).length > 0) throw new SetupMigrationTargetChangedError(`Migration target changed before promotion: ${component.finalPath}`);
	component.targetWasEmptyDirectory = true;
	component.emptyTargetBackupPath = await reserveEmptyTargetBackupPath(component.finalPath);
}
async function moveRecordedEmptyTarget(component) {
	if (!component.targetWasEmptyDirectory) return;
	if ((await fs.readdir(component.finalPath)).length > 0) throw new SetupMigrationTargetChangedError(`Migration target changed before promotion: ${component.finalPath}`);
	if (component.emptyTargetBackupPath) await fs.rename(component.finalPath, component.emptyTargetBackupPath);
	else await fs.rmdir(component.finalPath);
}
async function usesCaseInsensitivePaths(directory) {
	const probe = await fs.mkdtemp(path.join(directory, ".openclaw-case-probe-"));
	try {
		const alias = path.join(path.dirname(probe), path.basename(probe).toUpperCase());
		if (alias === probe) return false;
		await fs.access(alias);
		return true;
	} catch (error) {
		if (isNotFoundPathError(error)) return false;
		throw error;
	} finally {
		await fs.rm(probe, {
			recursive: true,
			force: true
		});
	}
}
async function usesNormalizationInsensitivePaths(directory) {
	const probe = await fs.mkdtemp(path.join(directory, ".openclaw-normalization-é-"));
	try {
		const alias = path.join(path.dirname(probe), path.basename(probe).normalize("NFD"));
		if (alias === probe) return false;
		await fs.access(alias);
		return true;
	} catch (error) {
		if (isNotFoundPathError(error)) return false;
		throw error;
	} finally {
		await fs.rm(probe, {
			recursive: true,
			force: true
		});
	}
}
async function canonicalizePromotionPath(candidate) {
	const suffix = [];
	let current = path.resolve(candidate);
	while (true) try {
		const ancestor = await fs.realpath(current);
		const probeDirectory = (await fs.stat(ancestor)).isDirectory() ? ancestor : path.dirname(ancestor);
		return {
			path: path.join(ancestor, ...suffix.toReversed()),
			caseInsensitive: await usesCaseInsensitivePaths(probeDirectory),
			normalizationInsensitive: await usesNormalizationInsensitivePaths(probeDirectory)
		};
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
		const parent = path.dirname(current);
		if (parent === current) throw new Error(`Could not resolve a promotion target for ${candidate}.`, { cause: error });
		suffix.push(path.basename(current));
		current = parent;
	}
}
async function assertSupportedStagedStateTree(params) {
	const assertEntries = async (directory, allowed) => {
		let entries;
		try {
			entries = await fs.readdir(directory);
		} catch (error) {
			if (isNotFoundPathError(error)) return;
			throw error;
		}
		const unexpected = entries.filter((entry) => !allowed.has(entry));
		if (unexpected.length > 0) throw new Error(`Migration provider wrote unsupported staged state: ${unexpected.map((entry) => path.join(directory, entry)).join(", ")}.`);
	};
	await assertEntries(params.stagedStateDir, /* @__PURE__ */ new Set([
		"agents",
		"migration",
		"state"
	]));
	await assertEntries(path.join(params.stagedStateDir, "agents"), /* @__PURE__ */ new Set([params.agentId]));
	await assertEntries(path.join(params.stagedStateDir, "agents", params.agentId), /* @__PURE__ */ new Set(["agent"]));
	await assertEntries(path.join(params.stagedStateDir, "migration"), /* @__PURE__ */ new Set([params.providerId]));
	await assertEntries(path.join(params.stagedStateDir, "migration", params.providerId), /* @__PURE__ */ new Set([params.reportDirName]));
}
async function assertDisjointPromotionTargets(components) {
	const canonicalPaths = await Promise.all(components.map(async (component) => ({
		component,
		path: await canonicalizePromotionPath(component.finalPath)
	})));
	for (const [index, current] of canonicalPaths.entries()) for (const other of canonicalPaths.slice(index + 1)) {
		const caseInsensitive = current.path.caseInsensitive || other.path.caseInsensitive;
		const normalizationInsensitive = current.path.normalizationInsensitive || other.path.normalizationInsensitive;
		const normalizePath = (pathname) => {
			const normalized = normalizationInsensitive ? pathname.normalize("NFC") : pathname;
			return caseInsensitive ? normalized.toLocaleLowerCase("en-US") : normalized;
		};
		const currentPath = normalizePath(current.path.path);
		const otherPath = normalizePath(other.path.path);
		if (isPathInside(currentPath, otherPath) || isPathInside(otherPath, currentPath)) throw new Error(`Migration promotion targets overlap: ${current.component.finalPath} and ${other.component.finalPath}.`);
	}
}
//#endregion
//#region src/wizard/setup.migration-stage.ts
const DEFERRED_REASON = "deferred until durable onboarding promotion";
async function findExistingAncestor(candidate) {
	let current = path.resolve(candidate);
	while (!await migrationPathEntryExists(current)) {
		const parent = path.dirname(current);
		if (parent === current) throw new Error(`Could not find an existing parent for migration staging at ${candidate}.`);
		current = parent;
	}
	return current;
}
async function makePrivateStageNear(target, label) {
	const ancestor = await findExistingAncestor(path.dirname(path.resolve(target)));
	const staged = await fs.mkdtemp(path.join(ancestor, `.openclaw-${label}-`));
	await fs.chmod(staged, 448);
	return staged;
}
function replacePathPrefix(value, from, to) {
	if (value === from) return to;
	const prefix = `${from}${path.sep}`;
	return value.startsWith(prefix) ? `${to}${value.slice(from.length)}` : value;
}
function projectPath(value, mappings) {
	const mapping = mappings.filter(([from]) => value === from || value.startsWith(`${from}${path.sep}`)).toSorted(([left], [right]) => right.length - left.length)[0];
	return mapping ? replacePathPrefix(value, mapping[0], mapping[1]) : value;
}
function projectValue(value, mappings) {
	if (typeof value === "string") return projectPath(value, mappings);
	if (Array.isArray(value)) return value.map((entry) => projectValue(entry, mappings));
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, projectValue(entry, mappings)]));
}
function projectPlanTargets(plan, mappings) {
	return {
		...plan,
		...plan.target ? { target: projectValue(plan.target, mappings) } : {},
		items: plan.items.map((item) => ({
			...item,
			...item.target ? { target: projectValue(item.target, mappings) } : {}
		})),
		...plan.metadata ? { metadata: projectValue(plan.metadata, mappings) } : {}
	};
}
function createInMemoryConfigRuntime(params) {
	let finalConfig = structuredClone(params.finalConfig);
	let stagedConfig = structuredClone(params.stagedConfig);
	const mutateConfigFile = async (mutation) => {
		const stagedDraft = structuredClone(stagedConfig);
		const result = await mutation.mutate(stagedDraft, {
			snapshot: {},
			previousHash: null
		});
		stagedConfig = stagedDraft;
		finalConfig = params.projectToFinal(stagedDraft);
		return {
			nextConfig: stagedConfig,
			result,
			path: "<onboarding-migration-stage>",
			previousHash: null,
			snapshot: {},
			persistedHash: null,
			afterWrite: mutation.afterWrite,
			followUp: {
				mode: "none",
				reason: "staged migration config",
				requiresRestart: false
			}
		};
	};
	return {
		runtime: {
			current: () => stagedConfig,
			mutateConfigFile
		},
		getFinalConfig: () => structuredClone(finalConfig),
		getStagedConfig: () => structuredClone(stagedConfig),
		replaceConfigs(next) {
			finalConfig = structuredClone(next.finalConfig);
			stagedConfig = structuredClone(next.stagedConfig);
		}
	};
}
function phasePlan(plan, phase) {
	const items = plan.items.map((item) => {
		if ((item.applyPhase ?? "before-promotion") === phase || item.status !== "planned") return item;
		return {
			...item,
			status: "skipped",
			reason: DEFERRED_REASON
		};
	});
	return {
		...plan,
		items,
		summary: summarizeMigrationItems(items)
	};
}
function buildSetupMigrationPhasePlan(plan, phase) {
	return phasePlan(plan, phase);
}
function takeMatchingItem(items, item) {
	const index = items.findIndex((candidate) => candidate.id === item.id);
	if (index < 0) return;
	return items.splice(index, 1)[0];
}
function mergeSetupMigrationPhaseResults(params) {
	const stagedItems = [...params.staged.items];
	const deferredItems = [...params.deferred?.items ?? []];
	const items = params.plan.items.map((item) => {
		return takeMatchingItem(item.applyPhase === "after-promotion" ? deferredItems : stagedItems, item) ?? item;
	});
	const plannedItemIds = new Set(params.plan.items.map((item) => item.id));
	items.push(...stagedItems.filter((item) => !plannedItemIds.has(item.id)), ...deferredItems.filter((item) => !plannedItemIds.has(item.id)));
	return {
		...params.staged,
		items,
		summary: summarizeMigrationItems(items),
		warnings: [.../* @__PURE__ */ new Set([...params.staged.warnings ?? [], ...params.deferred?.warnings ?? []])],
		nextSteps: [.../* @__PURE__ */ new Set([...params.staged.nextSteps ?? [], ...params.deferred?.nextSteps ?? []])]
	};
}
async function createSetupMigrationStage(params) {
	const agentId = resolveDefaultAgentId(params.targetConfig);
	const finalEnv = {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const finalAgentDir = resolveAgentDir(params.targetConfig, agentId, finalEnv);
	const stagedStateDir = await makePrivateStageNear(params.stateDir, "migration-state");
	const stagedWorkspaceDir = await makePrivateStageNear(params.workspaceDir, "migration-workspace");
	const stagedAgentDir = path.join(stagedStateDir, "agents", agentId, "agent");
	const stagedReportDir = path.join(stagedStateDir, "migration", params.providerId, path.basename(params.reportDir));
	const stageEnv = {
		...process.env,
		OPENCLAW_STATE_DIR: stagedStateDir
	};
	const stagedConfig = {
		...structuredClone(params.targetConfig),
		agents: {
			...structuredClone(params.targetConfig.agents),
			defaults: {
				...structuredClone(params.targetConfig.agents?.defaults),
				workspace: stagedWorkspaceDir
			}
		}
	};
	const finalPaths = {
		stateDir: params.stateDir,
		workspaceDir: params.workspaceDir,
		agentDir: finalAgentDir,
		reportDir: params.reportDir
	};
	const stagedPaths = {
		stateDir: stagedStateDir,
		workspaceDir: stagedWorkspaceDir,
		agentDir: stagedAgentDir,
		reportDir: stagedReportDir
	};
	const toStage = [
		[finalPaths.workspaceDir, stagedPaths.workspaceDir],
		[finalPaths.agentDir, stagedPaths.agentDir],
		[finalPaths.stateDir, stagedPaths.stateDir],
		[finalPaths.reportDir, stagedPaths.reportDir]
	];
	const toFinal = toStage.map(([finalPath, stagedPath]) => [stagedPath, finalPath]);
	const projectConfigToFinal = (config) => projectValue(config, toFinal);
	const configs = createInMemoryConfigRuntime({
		finalConfig: params.targetConfig,
		stagedConfig,
		projectToFinal: projectConfigToFinal
	});
	const replaceStagedConfig = (config) => configs.replaceConfigs({
		stagedConfig: config,
		finalConfig: projectConfigToFinal(config)
	});
	const writeInferenceConfig = async (config, options, expected) => {
		const before = configs.getStagedConfig();
		if (expected && !isDeepStrictEqual(before, expected)) throw new SetupMigrationTargetChangedError("Staged connection settings changed before activation.");
		options.captureUndo(async () => {
			const restored = restoreSetupInferenceConfig(configs.getStagedConfig(), before, config);
			if (restored.written) replaceStagedConfig(restored.config);
			return restored;
		});
		replaceStagedConfig(config);
		return configs.getStagedConfig();
	};
	const inferenceConfigTarget = {
		write: writeInferenceConfig,
		read: async () => {
			const config = configs.getStagedConfig();
			return {
				config,
				write: (next, options) => writeInferenceConfig(next, options, config)
			};
		}
	};
	openOpenClawAgentDatabase({
		agentId,
		env: stageEnv
	});
	let databasesDisposed = false;
	let finalAgentDatabaseRegistered = false;
	let retainForRecovery = false;
	const disposeDatabases = async () => {
		if (databasesDisposed) return;
		clearRuntimeAuthProfileStoreSnapshot(stagedAgentDir);
		const stagedAgentDatabasePath = path.join(stagedAgentDir, "openclaw-agent.sqlite");
		disposeOpenClawAgentDatabaseByPath(stagedAgentDatabasePath, { env: stageEnv });
		await closeOpenClawStateDatabaseByPathAsync(resolveOpenClawStateSqlitePath(stageEnv));
		databasesDisposed = true;
	};
	return {
		staged: stagedPaths,
		final: finalPaths,
		configRuntime: configs.runtime,
		inferenceConfigTarget,
		getFinalConfig: configs.getFinalConfig,
		getStagedConfig: configs.getStagedConfig,
		replaceStagedConfig,
		projectPlanToStage: (plan) => projectPlanTargets(plan, toStage),
		projectResultToFinal: (result) => projectValue(result, toFinal),
		async promote({ expectedConfig, continuation, readConfigFile, commitConfigFile }) {
			await disposeDatabases();
			const gatewayLockDir = resolveGatewayLockDir(stagedStateDir);
			await fs.rm(gatewayLockDir, {
				recursive: true,
				force: true
			});
			try {
				await fs.rmdir(path.dirname(gatewayLockDir));
			} catch (error) {
				if (!isNotFoundPathError(error) && error.code !== "ENOTEMPTY") throw error;
			}
			const configBefore = await readConfigFile();
			if (hashSetupMigrationConfig(configBefore) !== hashSetupMigrationConfig(expectedConfig)) throw new SetupMigrationTargetChangedError("Migration config changed before promotion. Review it and retry.");
			const configTarget = configs.getFinalConfig();
			const components = [{
				name: "workspace",
				stagedPath: stagedWorkspaceDir,
				finalPath: params.workspaceDir,
				status: "staged"
			}, {
				name: "agent",
				stagedPath: stagedAgentDir,
				finalPath: finalAgentDir,
				status: "staged"
			}];
			const existingComponents = [];
			for (const component of components) {
				const { name, stagedPath } = component;
				if (name === "workspace" || await migrationPathEntryExists(stagedPath)) existingComponents.push(component);
			}
			await assertSupportedStagedStateTree({
				stagedStateDir,
				agentId,
				providerId: params.providerId,
				reportDirName: path.basename(params.reportDir)
			});
			await assertDisjointPromotionTargets([...existingComponents, { finalPath: params.reportDir }]);
			await fs.mkdir(params.reportDir, {
				recursive: true,
				mode: 448
			});
			for (const component of existingComponents) await recordPromotionTargetState(component);
			const journalPath = path.join(params.reportDir, PROMOTION_JOURNAL_FILE);
			const journal = {
				version: 1,
				status: "prepared",
				providerId: params.providerId,
				configHashBefore: hashSetupMigrationConfig(configBefore),
				configHashTarget: hashSetupMigrationConfig(configTarget),
				components: existingComponents,
				continuation: {
					...continuation,
					workspaceDir: params.workspaceDir,
					stagedReportDir,
					stagedRoots: [stagedStateDir, stagedWorkspaceDir]
				},
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			await writePromotionJournal(journalPath, journal);
			journal.status = "promoting";
			await writePromotionJournal(journalPath, journal);
			try {
				for (const component of journal.components) {
					if (component.targetWasEmptyDirectory) {
						await writePromotionJournal(journalPath, journal);
						await moveRecordedEmptyTarget(component);
					}
					await fs.mkdir(path.dirname(component.finalPath), {
						recursive: true,
						mode: 448
					});
					await fs.rename(component.stagedPath, component.finalPath);
					if (component.name === "agent") {
						registerOpenClawAgentDatabase({
							agentId,
							path: path.join(finalAgentDir, "openclaw-agent.sqlite"),
							env: finalEnv
						});
						finalAgentDatabaseRegistered = true;
					}
					component.status = "promoted";
					await writePromotionJournal(journalPath, journal);
				}
				let committed;
				try {
					committed = await commitConfigFile(configTarget, expectedConfig);
				} catch (error) {
					const current = await readConfigFile().catch(() => void 0);
					if (current && hashSetupMigrationConfig(current) === journal.configHashTarget) committed = current;
					else if (current && hashSetupMigrationConfig(current) === journal.configHashBefore) throw error;
					else {
						journal.status = "indeterminate";
						retainForRecovery = true;
						await writePromotionJournal(journalPath, journal);
						throw new Error(`Migration config commit is indeterminate. Review ${journalPath} and run openclaw doctor before retrying.`, { cause: error });
					}
				}
				journal.configHashTarget = hashSetupMigrationConfig(committed);
				journal.status = "committed";
				retainForRecovery = true;
				await writePromotionJournal(journalPath, journal);
				return {
					config: committed,
					resume: createPromotionResume(journalPath, journal)
				};
			} catch (error) {
				if (retainForRecovery) throw error;
				if (finalAgentDatabaseRegistered) {
					unregisterOpenClawAgentDatabase({
						agentId,
						path: path.join(finalAgentDir, "openclaw-agent.sqlite"),
						env: finalEnv
					});
					finalAgentDatabaseRegistered = false;
				}
				if (await rollbackComponents(journal.components)) {
					journal.status = "rolled-back";
					await writePromotionJournal(journalPath, journal);
					throw error;
				}
				journal.status = "indeterminate";
				retainForRecovery = true;
				await writePromotionJournal(journalPath, journal);
				throw new Error(`Migration promotion could not be rolled back. Review ${journalPath} and run openclaw doctor before retrying.`, { cause: error });
			}
		},
		async cleanup() {
			if (retainForRecovery) return;
			await disposeDatabases();
			await Promise.all([fs.rm(stagedStateDir, {
				recursive: true,
				force: true
			}), fs.rm(stagedWorkspaceDir, {
				recursive: true,
				force: true
			})]);
		}
	};
}
//#endregion
//#region src/wizard/setup.migration-finalize.ts
function withPromotionAcknowledgement(outcome, acknowledgePromotion) {
	Object.defineProperty(outcome, "acknowledgePromotion", {
		value: acknowledgePromotion,
		enumerable: false
	});
	return outcome;
}
function hasDeferredMigrationItems(plan) {
	return plan.items.some((item) => item.applyPhase === "after-promotion" && item.status === "planned");
}
function assertDeferredMigrationApplyContract(provider, plan) {
	if (hasDeferredMigrationItems(plan) && provider.deferredApply?.retrySafe !== true) throw new Error(`Migration provider "${provider.id}" cannot defer activation during onboarding because it does not declare retry-safe deferred apply.`);
}
function deferredRetryInstruction(providerId) {
	return `Some post-promotion migration activation steps are still pending. Retry only those steps with openclaw onboard --flow import --import-from ${providerId}.`;
}
function deferredMigrationFailure(plan, error) {
	const reason = formatErrorMessage(error);
	const retry = deferredRetryInstruction(plan.providerId);
	const items = plan.items.map((item) => item.applyPhase === "after-promotion" && (item.status === "planned" || item.status === "error") ? {
		...item,
		status: "warning",
		reason
	} : item);
	return {
		...plan,
		items,
		summary: summarizeMigrationItems(items),
		warnings: [.../* @__PURE__ */ new Set([...plan.warnings ?? [], retry])],
		nextSteps: [.../* @__PURE__ */ new Set([retry, ...plan.nextSteps ?? []])]
	};
}
const COMPLETED_AFTER_PROMOTION_REASON = "completed after promotion";
function isCompletedDeferredMigrationItem(item) {
	return item.status === "migrated" || item.deferredCompletion === true;
}
function buildPendingDeferredMigrationPlan(plan, result) {
	const completedItemIds = new Set(result?.items.filter((item) => item.applyPhase === "after-promotion" && isCompletedDeferredMigrationItem(item)).map((item) => item.id));
	const deferredPlan = buildSetupMigrationPhasePlan(plan, "after-promotion");
	const items = deferredPlan.items.map((item) => completedItemIds.has(item.id) ? {
		...item,
		status: "skipped",
		reason: COMPLETED_AFTER_PROMOTION_REASON,
		deferredCompletion: true
	} : item);
	return {
		...deferredPlan,
		items,
		summary: summarizeMigrationItems(items)
	};
}
function mergeDeferredMigrationResults(params) {
	if (!params.previous) return params.next;
	const previousById = new Map(params.previous.items.map((item) => [item.id, item]));
	const items = params.next.items.map((item) => item.status === "skipped" && item.reason === COMPLETED_AFTER_PROMOTION_REASON ? previousById.get(item.id) ?? item : item);
	const retry = deferredRetryInstruction(params.next.providerId);
	return {
		...params.next,
		items,
		summary: summarizeMigrationItems(items),
		warnings: [.../* @__PURE__ */ new Set([...(params.previous.warnings ?? []).filter((warning) => warning !== retry), ...params.next.warnings ?? []])],
		nextSteps: [.../* @__PURE__ */ new Set([...(params.previous.nextSteps ?? []).filter((nextStep) => nextStep !== retry), ...params.next.nextSteps ?? []])]
	};
}
function hasPendingDeferredMigrationItems(plan, result) {
	const resultById = new Map(result?.items.map((item) => [item.id, item]));
	return plan.items.some((item) => item.applyPhase === "after-promotion" && item.status === "planned" && !isCompletedDeferredMigrationItem(resultById.get(item.id) ?? item));
}
async function createPromotionConfigRuntime(config) {
	const { mutateConfigFile } = await import("./mutate-RdF5T4lL.mjs");
	let currentConfig = structuredClone(config);
	return {
		current: () => currentConfig,
		async mutateConfigFile(mutation) {
			const result = await mutateConfigFile(mutation);
			currentConfig = structuredClone(result.nextConfig);
			return result;
		}
	};
}
async function finalizeSetupMigrationPromotion(params) {
	const { continuation } = params.resume;
	const reportDir = path.dirname(params.resume.journalPath);
	await params.resume.copyReportArtifacts();
	const configRuntime = await createPromotionConfigRuntime(params.config);
	let deferredResult = continuation.deferredResult;
	if (hasDeferredMigrationItems(continuation.plan) && hasPendingDeferredMigrationItems(continuation.plan, deferredResult)) {
		const previousDeferredResult = deferredResult;
		const deferredPlan = buildPendingDeferredMigrationPlan(continuation.plan, previousDeferredResult);
		let preparation;
		let retryResult;
		try {
			const deferredContext = {
				config: params.config,
				configRuntime,
				stateDir: params.stateDir,
				logger: params.logger,
				reportDir,
				...continuation.source ? { source: continuation.source } : {},
				...continuation.includeSecrets !== void 0 ? { includeSecrets: continuation.includeSecrets } : {},
				...continuation.providerOptions ? { providerOptions: continuation.providerOptions } : {},
				overwrite: false
			};
			preparation = await params.provider.prepareApply?.(deferredContext);
			retryResult = mergeDeferredMigrationResults({
				previous: previousDeferredResult,
				next: await params.provider.apply(deferredContext, deferredPlan)
			});
			if (hasPendingDeferredMigrationItems(continuation.plan, retryResult)) retryResult = deferredMigrationFailure(retryResult, "activation did not complete every deferred item");
		} catch (error) {
			retryResult = mergeDeferredMigrationResults({
				previous: previousDeferredResult,
				next: deferredMigrationFailure(deferredPlan, error)
			});
		} finally {
			await preparation?.dispose?.();
		}
		deferredResult = retryResult;
		await params.resume.saveDeferredResult(deferredResult);
	}
	const finalResult = mergeSetupMigrationPhaseResults({
		plan: continuation.plan,
		staged: continuation.stagedResult,
		...deferredResult ? { deferred: deferredResult } : {}
	});
	finalResult.reportDir = reportDir;
	await writeMigrationReport(finalResult, { title: `${continuation.providerLabel} Migration Report` });
	const hasPendingActivation = hasPendingDeferredMigrationItems(continuation.plan, deferredResult);
	if (!hasPendingActivation) await params.resume.complete();
	await params.resume.cleanup();
	await params.prompter.note(params.formatMigrationResult(finalResult).join("\n"), t("wizard.migration.appliedTitle"));
	if (!continuation.continueOnboarding) await params.prompter.outro(t("wizard.migration.complete"));
	else await params.prompter.note(t("wizard.migration.continuing"), t("wizard.migration.appliedTitle"));
	return hasPendingActivation ? continuation.outcome : withPromotionAcknowledgement(continuation.outcome, params.resume.acknowledge);
}
//#endregion
//#region src/wizard/setup.migration-import.ts
const loadMigrationProviderRuntimeModule = createLazyRuntimeModule(() => import("./migration-provider-runtime-BcoF_ay9.mjs"));
const loadMigrationContextModule = createLazyRuntimeModule(() => import("./context-JPxPrJJO.mjs"));
const loadConfigPathsModule = createLazyRuntimeModule(() => import("./paths-bFNjVB0r.mjs"));
async function detectSetupMigrationSources(params) {
	const [{ withPluginMigrationProviders }, { createMigrationLogger }, { resolveStateDir }] = await Promise.all([
		loadMigrationProviderRuntimeModule(),
		loadMigrationContextModule(),
		loadConfigPathsModule()
	]);
	return await withPluginMigrationProviders({
		cfg: params.config,
		onCleanupError: (error) => {
			params.runtime.error(`Migration discovery result retained, but plugin cleanup failed: ${formatErrorMessage(error)}`);
		}
	}, async (providers) => {
		const stateDir = resolveStateDir();
		const logger = createMigrationLogger(params.runtime);
		const detections = [];
		for (const provider of providers) {
			if (!provider.detect) continue;
			try {
				const detection = await provider.detect({
					config: params.config,
					stateDir,
					logger
				});
				if (detection.found) detections.push({
					providerId: provider.id,
					label: detection.label ?? provider.label,
					...detection.source ? { source: detection.source } : {},
					...detection.message ? { message: detection.message } : {}
				});
			} catch (error) {
				logger.debug?.(`Migration provider ${provider.id} detection failed: ${formatErrorMessage(error)}`);
			}
		}
		return {
			detections,
			providerDescriptors: providers.map(describeSetupMigrationProvider)
		};
	});
}
function describeSetupMigrationProvider(provider) {
	return {
		providerId: provider.id,
		label: provider.label,
		description: provider.description
	};
}
function resolveImportSourceDefault(params) {
	const detected = params.detections.find((detection) => detection.providerId === params.providerId);
	if (detected?.source) return detected.source;
	return params.providerId === "hermes" ? "~/.hermes" : "";
}
function formatMigrationProviderId(providerId) {
	return providerId.split(/[-_]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
function resolveManifestMigrationProviderLabel(params) {
	return params.pluginName?.trim().replace(/\s+Migration$/i, "") || formatMigrationProviderId(params.providerId) || params.providerId;
}
function resolveManifestSetupMigrationProviders(baseConfig) {
	const snapshot = loadManifestContractSnapshot({ config: baseConfig });
	return listAvailableManifestContractPlugins({
		snapshot,
		contract: "migrationProviders",
		config: baseConfig
	}).flatMap((plugin) => (plugin.contracts?.migrationProviders ?? []).map((providerId) => {
		const provider = {
			providerId,
			label: resolveManifestMigrationProviderLabel({
				providerId,
				pluginName: plugin.name
			})
		};
		if (plugin.description) provider.description = plugin.description;
		return provider;
	}));
}
async function listSetupMigrationOptions(params) {
	const providers = [...(getLoadedRuntimePluginRegistry()?.migrationProviders ?? []).map(({ provider }) => describeSetupMigrationProvider(provider)), ...params.providerDescriptors ?? []].toSorted((left, right) => left.providerId.localeCompare(right.providerId));
	const options = [];
	const providerIds = /* @__PURE__ */ new Set();
	const addOption = (option) => {
		if (providerIds.has(option.providerId)) return;
		providerIds.add(option.providerId);
		options.push(option);
	};
	for (const detection of params.detections) addOption({
		providerId: detection.providerId,
		label: t("wizard.migration.importFrom", { source: detection.label }),
		...detection.source || detection.message ? { hint: detection.source ?? detection.message } : {}
	});
	for (const provider of providers) addOption({
		providerId: provider.providerId,
		label: t("wizard.migration.importFrom", { source: provider.label }),
		hint: provider.description ?? t("wizard.migration.sourcePathHint")
	});
	for (const provider of resolveManifestSetupMigrationProviders(params.baseConfig)) addOption({
		providerId: provider.providerId,
		label: t("wizard.migration.importFrom", { source: provider.label }),
		hint: provider.description ?? t("wizard.migration.sourcePathHint")
	});
	return options;
}
async function selectSetupMigrationProvider(params) {
	const options = await listSetupMigrationOptions({
		baseConfig: params.baseConfig,
		detections: params.detections,
		providerDescriptors: params.providerDescriptors
	});
	const requestedProviderId = params.opts.importFrom?.trim();
	if (requestedProviderId) return assertListedMigrationProvider(requestedProviderId, options);
	if (options.length === 0) throw new Error("No migration providers found.");
	const prompt = {
		message: t("wizard.migration.source"),
		options: options.map((option) => ({
			value: option.providerId,
			label: option.label,
			...option.hint ? { hint: option.hint } : {}
		})),
		initialValue: params.detections[0]?.providerId ?? options[0]?.providerId
	};
	if (!params.allowBack) {
		params.prompter.disableBackNavigation?.();
		return assertListedMigrationProvider(await params.prompter.select(prompt), options);
	}
	const selection = await runWizardWithPromptNavigationScope(params.prompter, async (prompter) => await prompter.select(prompt));
	if (selection.status === "back") return;
	return assertListedMigrationProvider(selection.value, options);
}
/**
* Rejects a provider id that is absent from the listed options, naming the ids that are present.
* `openclaw migrate` already answers an unknown provider this way; onboarding has to match, because
* a typed id is far likelier to be a typo here than a genuinely missing plugin. An undefined id
* means the operator dismissed the prompt, which is a cancellation rather than a bad choice.
*/
function assertListedMigrationProvider(providerId, options) {
	if (providerId === void 0 || options.some((option) => option.providerId === providerId)) return providerId;
	const available = options.map((option) => option.providerId);
	const suffix = available.length > 0 ? ` Available providers: ${available.join(", ")}.` : " No migration providers are installed.";
	const listCommand = formatCliCommand("openclaw migrate list");
	throw new Error(`Unknown migration provider "${providerId}".${suffix} Run ${listCommand} to see the current list.`);
}
async function withSetupMigrationProvider(params, run) {
	const { withPluginMigrationProviders } = await loadMigrationProviderRuntimeModule();
	return await withPluginMigrationProviders({
		cfg: params.baseConfig,
		providerId: params.providerId
	}, async (providers) => {
		const provider = providers.find((entry) => entry.id === params.providerId);
		if (!provider) throw new Error(`Migration provider "${params.providerId}" did not register after activation.`);
		return await run({
			provider,
			baseConfig: params.baseConfig
		});
	});
}
function hasCredentialCandidate(plan) {
	return plan.items.some((item) => item.kind === "auth" || item.kind === "secret" || item.sensitive === true);
}
async function createSetupMigrationPlan(params) {
	let ctx = {
		...params.ctx,
		includeSecrets: params.importSecrets
	};
	let plan = await params.provider.plan(ctx);
	if (params.nonInteractive || params.importSecrets || !hasCredentialCandidate(plan)) return {
		ctx,
		plan
	};
	if (!await params.prompter.confirm({
		message: t("wizard.migration.includeCredentials"),
		initialValue: true
	})) return {
		ctx,
		plan
	};
	ctx = {
		...ctx,
		includeSecrets: true
	};
	plan = await params.provider.plan(ctx);
	return {
		ctx,
		plan
	};
}
async function runSetupMigrationImport(params) {
	const [{ applyLocalSetupWorkspaceConfig, applySkipBootstrapConfig }, { createMigrationLogger, buildMigrationReportDir }, { assertApplySucceeded, assertConflictFreePlan, formatMigrationPreview, formatMigrationResult }, { resolveStateDir }, onboardHelpers] = await Promise.all([
		import("./onboard-config-luhByLu5.mjs"),
		loadMigrationContextModule(),
		import("./output-B_dpgR0g.mjs"),
		loadConfigPathsModule(),
		import("./onboard-helpers-Bs3xm5rG.mjs")
	]);
	const providerId = await selectSetupMigrationProvider({
		opts: params.opts,
		baseConfig: params.baseConfig,
		detections: params.detections,
		providerDescriptors: params.providerDescriptors,
		prompter: params.prompter,
		allowBack: params.allowProviderBack === true
	});
	if (!providerId) return { kind: "back" };
	params.prompter.disableBackNavigation?.();
	const workspaceInput = params.opts.workspace ?? (params.opts.nonInteractive ? params.baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE : await params.prompter.text({
		message: t("wizard.migration.targetWorkspace"),
		initialValue: params.baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE
	}));
	const workspaceDir = resolveUserPath(workspaceInput.trim() || onboardHelpers.DEFAULT_WORKSPACE);
	const stateDir = resolveStateDir();
	return await withSetupMigrationTargetLock(stateDir, async () => {
		const promotionResume = await recoverSetupMigrationPromotion({
			stateDir,
			providerId,
			readConfigFile: params.readConfigFile
		});
		if (promotionResume) {
			const committedConfig = await params.readConfigFile();
			return await withSetupMigrationProvider({
				providerId,
				baseConfig: committedConfig
			}, async (resolvedProvider) => {
				assertDeferredMigrationApplyContract(resolvedProvider.provider, promotionResume.continuation.plan);
				return await finalizeSetupMigrationPromotion({
					provider: resolvedProvider.provider,
					resume: promotionResume,
					config: committedConfig,
					stateDir,
					logger: createMigrationLogger(params.runtime),
					prompter: params.prompter,
					formatMigrationResult
				});
			});
		}
		const lockedBaseConfig = preserveSetupMigrationOnboardingConsents(await params.readConfigFile(), params.baseConfig);
		const freshness = await inspectSetupMigrationFreshness({
			baseConfig: lockedBaseConfig,
			stateDir,
			workspaceDir
		});
		assertFreshSetupMigrationTarget(freshness);
		return await withSetupMigrationProvider({
			providerId,
			baseConfig: lockedBaseConfig
		}, async (resolvedProvider) => {
			const planningBaseConfig = await params.readConfigFile();
			const planningTargetSnapshotHash = await buildSetupMigrationTargetSnapshot({
				config: planningBaseConfig,
				stateDir,
				workspaceDir
			});
			const migrationLogger = createMigrationLogger(params.runtime);
			const selectedDetections = [...params.detections];
			if (resolvedProvider.provider.detect && !selectedDetections.some((detection) => detection.providerId === providerId)) try {
				const detection = await resolvedProvider.provider.detect({
					config: resolvedProvider.baseConfig,
					stateDir,
					logger: migrationLogger
				});
				if (detection.found) selectedDetections.push({
					providerId,
					label: detection.label ?? resolvedProvider.provider.label,
					...detection.source ? { source: detection.source } : {},
					...detection.message ? { message: detection.message } : {}
				});
			} catch (error) {
				migrationLogger.debug?.(`Migration provider ${providerId} detection failed: ${formatErrorMessage(error)}`);
			}
			const sourceDefault = resolveImportSourceDefault({
				providerId,
				detections: selectedDetections
			});
			const sourceDir = params.opts.importSource?.trim() || sourceDefault || (params.opts.nonInteractive ? (() => {
				throw new Error("--import-source is required for non-interactive migration import.");
			})() : await params.prompter.text({
				message: t("wizard.migration.sourceAgentHome"),
				initialValue: providerId === "hermes" ? "~/.hermes" : void 0
			}));
			let targetConfig = applyLocalSetupWorkspaceConfig(resolvedProvider.baseConfig, workspaceDir);
			if (params.opts.skipBootstrap) targetConfig = applySkipBootstrapConfig(targetConfig);
			const initialCtx = {
				config: targetConfig,
				stateDir,
				source: sourceDir,
				overwrite: false,
				logger: migrationLogger
			};
			const planned = await createSetupMigrationPlan({
				provider: resolvedProvider.provider,
				ctx: initialCtx,
				importSecrets: Boolean(params.opts.importSecrets),
				nonInteractive: Boolean(params.opts.nonInteractive),
				prompter: params.prompter
			});
			const plannedSourceSnapshotHash = await buildSetupMigrationPlanSourceSnapshot(planned.plan);
			const ctx = planned.ctx;
			const plan = planned.plan;
			assertDeferredMigrationApplyContract(resolvedProvider.provider, plan);
			await params.prompter.note(formatMigrationPreview(plan).join("\n"), t("wizard.migration.previewTitle"));
			assertConflictFreePlan(plan, providerId);
			if (!(params.opts.nonInteractive === true ? true : await params.prompter.confirm({
				message: t("wizard.migration.apply"),
				initialValue: true
			}))) throw new WizardCancelledError(t("wizard.migration.cancelled"));
			targetConfig = onboardHelpers.applyWizardMetadata(targetConfig, {
				command: "onboard",
				mode: "local"
			});
			await prepareSetupMigrationAttemptBoundary({
				currentConfig: await params.readConfigFile(),
				targetConfig,
				stateDir,
				workspaceDir,
				plan,
				expectedTargetSnapshotHash: planningTargetSnapshotHash,
				expectedSourceSnapshotHash: plannedSourceSnapshotHash
			});
			const reportDir = buildMigrationReportDir(providerId, stateDir);
			const stage = await createSetupMigrationStage({
				providerId,
				stateDir,
				workspaceDir,
				reportDir,
				targetConfig
			});
			try {
				const stagedPlan = stage.projectPlanToStage(buildSetupMigrationPhasePlan(plan, "before-promotion"));
				const stagedRuntime = ctx.runtime ? {
					...ctx.runtime,
					config: {
						...ctx.runtime.config,
						current: stage.configRuntime.current,
						mutateConfigFile: stage.configRuntime.mutateConfigFile,
						replaceConfigFile: async () => {
							throw new Error("Full config replacement is unavailable during staged migration.");
						}
					}
				} : void 0;
				const stagedResult = await resolvedProvider.provider.apply({
					...ctx,
					...stagedRuntime ? { runtime: stagedRuntime } : {},
					config: stage.getStagedConfig(),
					configRuntime: stage.configRuntime,
					stateDir: stage.staged.stateDir,
					reportDir: stage.staged.reportDir
				}, stagedPlan);
				assertApplySucceeded(stagedResult);
				const projectedStagedResult = stage.projectResultToFinal(stagedResult);
				let outcome = { kind: "no-imported-inference" };
				if (resolveAgentModelPrimaryValue(stage.getStagedConfig().agents?.defaults?.model)) {
					const verification = await offerLiveModelVerification({
						config: stage.getStagedConfig(),
						opts: params.opts,
						prompter: params.prompter,
						runtime: params.runtime,
						workspaceDir: stage.staged.workspaceDir,
						agentDir: stage.staged.agentDir,
						stateDir: stage.staged.stateDir,
						configTarget: stage.inferenceConfigTarget,
						required: true
					});
					if (!verification.verified || !verification.modelRef) throw new Error("Imported inference was not verified.");
					stage.replaceStagedConfig(verification.config);
					outcome = {
						kind: "verified-inference",
						modelRef: verification.modelRef
					};
				}
				const [currentTargetSnapshotHash, currentSourceSnapshotHash] = await Promise.all([buildSetupMigrationTargetSnapshot({
					config: await params.readConfigFile(),
					stateDir,
					workspaceDir
				}), buildSetupMigrationPlanSourceSnapshot(plan)]);
				if (currentTargetSnapshotHash !== planningTargetSnapshotHash) throw new SetupMigrationTargetChangedError("Migration target changed before promotion. Review it and retry.");
				if (currentSourceSnapshotHash !== plannedSourceSnapshotHash) throw new Error("Migration source changed before promotion. Review it and retry.");
				const promoted = await stage.promote({
					expectedConfig: planningBaseConfig,
					continuation: {
						providerLabel: resolvedProvider.provider.label,
						...ctx.source ? { source: ctx.source } : {},
						...ctx.includeSecrets !== void 0 ? { includeSecrets: ctx.includeSecrets } : {},
						...ctx.providerOptions ? { providerOptions: ctx.providerOptions } : {},
						plan,
						stagedResult: projectedStagedResult,
						outcome,
						continueOnboarding: params.continueOnboarding === true
					},
					readConfigFile: params.readConfigFile,
					commitConfigFile: params.commitConfigFile
				});
				return await finalizeSetupMigrationPromotion({
					provider: resolvedProvider.provider,
					resume: promoted.resume,
					config: promoted.config,
					stateDir,
					logger: migrationLogger,
					prompter: params.prompter,
					formatMigrationResult
				});
			} finally {
				await stage.cleanup();
			}
		});
	});
}
//#endregion
export { runSetupModelAuthStep as a, completeSetupModelAuth as i, listSetupMigrationOptions as n, runSetupMigrationImport as r, detectSetupMigrationSources as t };
