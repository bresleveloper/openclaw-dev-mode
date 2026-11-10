import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as parseProviderModelRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { l as normalizePluginTargetConfig } from "./config-state-DkDfCu7E.mjs";
import { a as resolveAgentDir, m as resolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-CQJv99I6.mjs";
import { r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { i as isTrustedOfficialPluginInstallRecord } from "./official-external-install-records-DU-ANq4S.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { b as readUtilityModelSetting } from "./model-selection-shared-CVU_V2PQ.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { n as enablePluginInConfig, r as enablePluginWithCapabilityConsent } from "./enable-yRbPluWX.mjs";
import { a as readNativeSessionCatalogPreference, n as hasLegacyNativeSessionCatalogDefault, o as shippedNativeSessionCatalogs, t as applyNativeSessionCatalogPreference } from "./native-session-catalog-config-Cw2NJHbW.mjs";
import { a as resolveAuthProfileOrder } from "./order-CElLtwMu.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { n as readCodexCliActiveApiKey } from "./cli-credentials-DmMCeh52.mjs";
import { k as isProviderAuthError } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { g as loadAuthProfileStoreWithoutExternalProfilesAsync } from "./store-runtime-CwqGD12G.mjs";
import { i as resolveManifestProviderAuthChoices, o as isProviderAuthChoicePlatformSupported } from "./provider-auth-choices-D2ZKE-Sc.mjs";
import { i as resolveConfiguredSetupModelForAgent, r as resolveConfiguredPrimaryModelForAgent } from "./utility-model-nsnbR10X.mjs";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-BJ9XbGmI.mjs";
import { s as stripPendingPluginInstallRecords } from "./install-record-commit-zYfMjC8g.mjs";
import { t as resolveApiKeyForProviderCore } from "./model-auth-provider-Dci0IxqM.mjs";
import "./model-auth-CMoPmop7.mjs";
import { b as toProviderAutoSetupKind, c as invalidSetupConfigError, h as resolveSetupInferenceWorkspace, p as resolveCandidatePresentation, r as SetupInferenceActivationIndeterminateError, v as setupInferenceLog, x as toSavedAuthSetupKind, y as throwIfSetupInferenceCancelled } from "./setup-inference-core-CZLQ-ncs.mjs";
import { a as listSetupInferenceManualProviders, c as supportsSetupTextInference, i as listSetupInferenceInstallOptions, n as listSetupInferenceAuthOptions, o as listSetupInferencePrepareOptions, r as listSetupInferenceEnableOptions, t as findSetupCredentialChoice } from "./setup-inference-auth-options-B80Cp2JV.mjs";
import { t as listRecommendedToolInstalls } from "./recommended-tool-installs-BMGbI_cP.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-P722AY9p.mjs";
import { n as createQuickstartNotePrompter } from "./setup-apply-DWhOAATA.mjs";
import { a as withCodexHomeScope } from "./setup-model-selection-0-TC67fp.mjs";
import { i as stageProviderAuthCandidate, n as saveSetupCredential } from "./setup-inference-credentials-_9S0MeER.mjs";
//#region src/system-agent/setup-inference-ranking.ts
function candidateRank(candidate) {
	if (candidate.modelTarget === "utility" || candidate.credentials === false) return;
	if (candidate.kind === "existing-model") return 0;
	if (candidate.kind.startsWith("saved-auth:")) return 1;
	if (candidate.kind === "codex-cli") return candidate.credentials === true ? 2 : void 0;
	if (candidate.kind === "claude-cli") return 3;
	if (candidate.kind === "openai-api-key") return 4;
	if (candidate.kind === "anthropic-api-key") return 5;
	if (candidate.kind.startsWith("provider-auto:")) switch (candidate.modelRef.split("/", 1)[0]) {
		case "ollama": return 6;
		case "lmstudio": return 7;
		case "llama-cpp": return 8;
		default: return;
	}
}
/** Shared first-run policy; manual discovery retains candidates outside this ladder. */
function rankSetupInferenceCandidates(candidates) {
	return candidates.map((candidate) => ({
		candidate,
		rank: candidateRank(candidate)
	})).filter((entry) => entry.rank !== void 0).toSorted((a, b) => a.rank - b.rank || a.candidate.kind.localeCompare(b.candidate.kind) || a.candidate.modelRef.localeCompare(b.candidate.modelRef)).map(({ candidate }) => candidate);
}
//#endregion
//#region src/system-agent/setup-native-session-catalogs.ts
function requiresSetupNativeSessionCatalogConsent(params) {
	if (params.catalogs.length === 0) return false;
	return params.catalogs.every(({ pluginId }) => {
		const enabled = readNativeSessionCatalogPreference(params.config, pluginId);
		return enabled === false || enabled === void 0 && (!params.configExists || !hasLegacyNativeSessionCatalogDefault(pluginId));
	});
}
function resolveSetupNativeSessionCatalogPreference(params) {
	return params.consentRequired ? params.requested ?? false : void 0;
}
function listSetupNativeSessionCatalogs(params) {
	const snapshot = params.metadataSnapshot ?? loadManifestMetadataSnapshot({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: process.env
	});
	const catalogs = new Map(shippedNativeSessionCatalogs.map((catalog) => [catalog.pluginId, catalog]));
	for (const plugin of snapshot.plugins) if (plugin.setup?.nativeSessionCatalog) catalogs.set(plugin.id, {
		pluginId: plugin.id,
		...plugin.setup.nativeSessionCatalog
	});
	return [...catalogs.values()].map(({ pluginId, label, description }) => Object.assign({
		pluginId,
		label
	}, description ? { detail: description } : {})).toSorted((a, b) => a.label.localeCompare(b.label, "en") || a.pluginId.localeCompare(b.pluginId, "en"));
}
function applySetupNativeSessionCatalogPreference(params) {
	return applyNativeSessionCatalogPreference(params.config, listSetupNativeSessionCatalogs(params).map(({ pluginId }) => pluginId), params.enabled, params.onlyUnset);
}
//#endregion
//#region src/system-agent/setup-inference-detect.ts
function recommendSetupInferenceCandidate(candidates) {
	const recommended = rankSetupInferenceCandidates(candidates)[0];
	return candidates.map((candidate) => ({
		...candidate,
		recommended: candidate === recommended
	}));
}
async function listSavedSetupInferenceCandidates(params) {
	const { withSetupProviderAuthMethod } = await import("./setup-provider-method-BILC1WuB.mjs");
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	const store = await loadAuthProfileStoreWithoutExternalProfilesAsync(agentDir);
	const candidates = [];
	for (const [profileId, credential] of Object.entries(store.profiles)) {
		params.signal.throwIfAborted();
		const saved = credential.setup;
		const choice = findSetupCredentialChoice(params.choices, credential);
		let modelRef = saved?.modelRef;
		if (!modelRef && choice) {
			const loaded = await withSetupProviderAuthMethod({
				...params,
				choice
			}, ({ method }) => ({ modelRef: method.starterModel }));
			params.signal.throwIfAborted();
			if (!("error" in loaded)) modelRef = loaded.modelRef;
		}
		if (!modelRef) continue;
		candidates.push({
			kind: toSavedAuthSetupKind(profileId),
			...choice?.modelTarget ? { modelTarget: choice.modelTarget } : {},
			modelRef,
			brandId: choice?.providerId ?? credential.provider,
			label: `Saved ${choice?.choiceLabel ?? credential.provider} sign-in`,
			detail: credential.setup?.replacement ? "Saved but inactive. Test this sign-in again, then choose whether to activate it." : "Verify this saved sign-in to use it. No new sign-in is needed.",
			recommended: false,
			credentials: true,
			...choice?.icon ? { icon: choice.icon } : {},
			...choice?.website ? { website: choice.website } : {}
		});
	}
	return candidates;
}
function resolveConfiguredCandidateKind(config, modelRef, agentId) {
	if (!modelRef) return;
	const ref = parseProviderModelRef(modelRef);
	if (!ref) return;
	const runtime = normalizeOptionalAgentRuntimeId(resolveModelRuntimePolicy({
		config,
		provider: ref.provider,
		modelId: ref.model,
		agentId: resolveAmbientOwnerAgentId(config ?? {}, agentId)
	}).policy?.id);
	if (runtime === "codex") return "codex-cli";
	if (runtime === "claude-cli") return "claude-cli";
}
async function prepareSetupInferenceOptions(deps, agentId) {
	const { readConfigFileSnapshotWithPluginMetadata } = await import("./config/config.js");
	const { snapshot, pluginMetadataSnapshot } = await readConfigFileSnapshotWithPluginMetadata();
	if (snapshot.exists && !snapshot.valid) throw new Error(invalidSetupConfigError(snapshot));
	const cfg = snapshot.runtimeConfig ?? snapshot.config;
	const targetAgentId = resolveAmbientOwnerAgentId(cfg, agentId);
	const workspace = resolveSetupInferenceWorkspace(snapshot);
	const allAuthChoices = (deps.resolveManifestProviderAuthChoices ?? resolveManifestProviderAuthChoices)({
		config: cfg,
		workspaceDir: workspace,
		metadataSnapshot: pluginMetadataSnapshot,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false,
		includeUnsupportedPlatforms: true
	});
	const supportedAuthChoices = allAuthChoices.filter((choice) => isProviderAuthChoicePlatformSupported(choice.platforms));
	const detectionRequiredProviders = new Set(allAuthChoices.filter((choice) => choice.assistantVisibility === "detected-only").map((choice) => normalizeProviderId(choice.providerId)));
	for (const choice of supportedAuthChoices) if (choice.assistantVisibility !== "detected-only") detectionRequiredProviders.delete(normalizeProviderId(choice.providerId));
	const authChoices = supportedAuthChoices.filter((choice) => (deps.enablePluginInConfig ?? enablePluginInConfig)(cfg, choice.pluginId).enabled);
	const disabledAuthChoices = supportedAuthChoices.filter((choice) => !authChoices.includes(choice));
	const setupComplete = Boolean(resolveConfiguredPrimaryModelForAgent({
		cfg,
		agentId: targetAgentId
	}));
	const setupSelection = resolveConfiguredSetupModelForAgent({
		cfg,
		agentId: targetAgentId
	});
	const utilitySetting = readUtilityModelSetting(cfg, targetAgentId);
	let utilityModel;
	if (utilitySetting.kind === "explicit") {
		const { resolveSimpleCompletionSelectionForAgent } = await import("./simple-completion-runtime-C1vIxH8v.mjs");
		const selection = resolveSimpleCompletionSelectionForAgent({
			cfg,
			agentId: targetAgentId,
			modelRef: utilitySetting.modelRef,
			manifestPlugins: pluginMetadataSnapshot
		});
		if (selection) utilityModel = `${selection.provider}/${selection.modelId}`;
	}
	const installOptions = listSetupInferenceInstallOptions(resolveProviderInstallCatalogEntries({
		config: cfg,
		workspaceDir: workspace,
		includeUntrustedWorkspacePlugins: false
	}), authChoices);
	const authOptions = [
		...listSetupInferenceAuthOptions(authChoices),
		...listSetupInferenceEnableOptions(disabledAuthChoices),
		...installOptions,
		{
			id: "custom-api-key",
			brandId: "custom",
			label: "Custom OpenAI/Anthropic-compatible endpoint",
			hint: "Connect a compatible endpoint running from this Gateway host.",
			kind: "custom",
			featured: false
		}
	].filter((option, index, options) => options.findIndex((entry) => entry.id === option.id) === index);
	const nativeSessionCatalogs = listSetupNativeSessionCatalogs({
		config: cfg,
		workspaceDir: workspace,
		metadataSnapshot: pluginMetadataSnapshot
	});
	return {
		cfg,
		targetAgentId,
		authChoices,
		detectionRequiredProviders,
		manual: {
			...utilityModel ? { utilityModel } : {},
			...utilityModel && setupSelection?.modelTarget === "utility" ? { setupModel: utilityModel } : {},
			manualProviders: listSetupInferenceManualProviders(authChoices),
			authOptions,
			prepareOptions: listSetupInferencePrepareOptions(authChoices),
			nativeSessionCatalogs,
			nativeSessionCatalogPreferenceRequired: requiresSetupNativeSessionCatalogConsent({
				configExists: snapshot.exists,
				config: snapshot.sourceConfig ?? snapshot.config,
				catalogs: nativeSessionCatalogs
			}),
			workspace,
			setupComplete
		},
		pluginMetadataSnapshot
	};
}
/** Manual setup options use only config and manifests, never machine or credential probes. */
async function listManualSetupInferenceOptions(deps = {}, agentId) {
	return (await prepareSetupInferenceOptions(deps, agentId)).manual;
}
async function detectSetupInference(deps = {}, agentId) {
	const prepared = await prepareSetupInferenceOptions(deps, agentId);
	let partial = {
		...prepared.manual,
		candidates: [],
		unavailableCandidates: [],
		recommendedInstalls: listRecommendedToolInstalls()
	};
	const controller = new AbortController();
	const timeoutMs = 3e4;
	return await raceWithTimeout(() => discoverSetupInference(prepared, deps, controller.signal, (detection) => {
		partial = detection;
		deps.onPartial?.(detection);
	}).catch((error) => {
		controller.abort(error);
		throw toErrorObject(error, "Setup inference discovery failed");
	}), timeoutMs, () => {
		controller.abort(/* @__PURE__ */ new Error("Setup inference discovery timed out"));
		setupInferenceLog.warn(`Setup inference detection timed out after ${timeoutMs}ms; returning partial detection.`);
		return partial;
	});
}
async function discoverSetupInference({ cfg, targetAgentId, authChoices, detectionRequiredProviders, manual, pluginMetadataSnapshot }, deps, signal, onPartial) {
	const { workspace } = manual;
	const requiresDetection = (candidate) => {
		const ref = parseProviderModelRef(candidate.modelRef);
		return ref !== null && detectionRequiredProviders.has(normalizeProviderId(ref.provider));
	};
	const appGuided = discoverAppGuidedCandidates({
		cfg,
		workspace,
		authChoices,
		metadataSnapshot: pluginMetadataSnapshot,
		deps,
		signal
	});
	const partial = {
		...manual,
		candidates: [],
		unavailableCandidates: [],
		recommendedInstalls: listRecommendedToolInstalls()
	};
	const local = Promise.all([listSavedSetupInferenceCandidates({
		cfg,
		agentId: targetAgentId,
		workspace,
		choices: authChoices,
		deps,
		signal
	}).then((saved) => {
		signal.throwIfAborted();
		onPartial({
			...partial,
			candidates: recommendSetupInferenceCandidate(saved.filter((candidate) => !requiresDetection(candidate)))
		});
		return saved;
	}), (async () => {
		return await (deps.detectInferenceBackends ?? (await import("./onboard-inference-CtmOW7Y-.mjs")).detectInferenceBackends)({
			config: cfg,
			agentId: targetAgentId
		});
	})()]);
	const [savedCandidates, detected] = await Promise.race([local, appGuided.then(() => local)]);
	signal.throwIfAborted();
	const configuredModel = detected.find((candidate) => candidate.kind === "existing-model")?.modelRef;
	const configuredCandidateKind = resolveConfiguredCandidateKind(cfg, configuredModel, targetAgentId);
	const candidates = detected.filter((candidate) => candidate.kind !== "gemini-cli" && !(candidate.kind === configuredCandidateKind && configuredModel && areRuntimeModelRefsEquivalent(candidate.modelRef, configuredModel, { config: cfg }))).map((candidate) => Object.assign(candidate, { recommended: false }, resolveCandidatePresentation(candidate, authChoices)));
	candidates.push(...savedCandidates);
	if (!configuredModel && manual.setupModel) candidates.push({
		kind: "existing-model",
		modelTarget: "utility",
		modelRef: manual.setupModel,
		label: "Configured setup utility",
		detail: `${manual.setupModel} — regular agent model still needed`,
		recommended: false,
		credentials: true
	});
	const pendingCandidates = candidates.filter(requiresDetection);
	const offeredCandidates = candidates.filter((candidate) => !requiresDetection(candidate));
	onPartial({
		...partial,
		candidates: recommendSetupInferenceCandidate(offeredCandidates),
		...configuredModel ? { configuredModel } : {},
		setupComplete: Boolean(configuredModel)
	});
	const available = await appGuided;
	offeredCandidates.push(...pendingCandidates.filter((candidate) => available.some((discoveredCandidate) => areRuntimeModelRefsEquivalent(candidate.modelRef, discoveredCandidate.modelRef, { config: cfg }))), ...available);
	return {
		...partial,
		candidates: recommendSetupInferenceCandidate(offeredCandidates),
		...configuredModel ? { configuredModel } : {},
		setupComplete: Boolean(configuredModel)
	};
}
async function discoverAppGuidedCandidates({ cfg, workspace, authChoices, metadataSnapshot, deps, signal }) {
	const discoveryChoices = authChoices.filter((choice) => choice.appGuidedDiscovery === true && supportsSetupTextInference(choice.onboardingScopes));
	if (discoveryChoices.length === 0) return [];
	const { probeSetupProviderChoices } = await import("./provider-setup-availability-BvqfXT0D.mjs");
	return (await probeSetupProviderChoices({
		config: cfg,
		workspaceDir: workspace,
		choices: discoveryChoices,
		metadataSnapshot,
		signal,
		enablePluginInConfig: deps.enablePluginInConfig,
		resolvePluginProviders: deps.resolvePluginProviders
	}, async (choice, provider, context) => {
		const method = provider?.auth.find((candidate) => candidate.id === choice.methodId);
		if (!method?.appGuidedSetup) return null;
		try {
			const candidate = await method.appGuidedSetup.detect({
				...context,
				signal
			});
			signal.throwIfAborted();
			if (!candidate) return null;
			const ref = parseProviderModelRef(candidate.modelRef);
			if (!ref || normalizeProviderId(ref.provider) !== normalizeProviderId(choice.providerId)) {
				setupInferenceLog.warn(`Ignoring invalid app-guided model ${candidate.modelRef} from ${choice.choiceId}.`);
				return null;
			}
			return Object.assign({
				kind: toProviderAutoSetupKind(choice.choiceId),
				brandId: choice.providerId,
				label: choice.choiceLabel,
				detail: candidate.detail?.trim() || "available locally",
				modelRef: candidate.modelRef,
				...choice.modelTarget ? { modelTarget: choice.modelTarget } : {},
				recommended: false,
				credentials: true
			}, choice.icon ? { icon: choice.icon } : {}, choice.website ? { website: choice.website } : {});
		} catch (error) {
			setupInferenceLog.debug(`App-guided discovery failed for ${choice.choiceId}: ${formatErrorMessage(error)}`);
			return null;
		}
	})).filter((candidate) => candidate !== null);
}
//#endregion
//#region src/system-agent/setup-inference-codex.ts
const acceptAutomaticCodexCapabilities = async (review) => {
	const source = review.source;
	if (review.pluginId !== "codex" || source?.kind !== "npm" || !isTrustedOfficialPluginInstallRecord({
		pluginId: "codex",
		packageName: "@openclaw/codex",
		record: {
			source: "npm",
			spec: source.spec,
			resolvedName: source.packageName
		}
	})) return;
	return { reviewToken: review.reviewToken };
};
async function prepareCodexRuntimePlugin(params) {
	if (params.automaticSetup) {
		const metadata = (params.resolveMetadata ?? (await import("./plugin-metadata-snapshot-COIVr8hb.mjs")).resolvePluginMetadataSnapshot)({
			config: params.cfg,
			workspaceDir: params.workspace,
			allowCurrent: false
		});
		const installed = metadata.index.plugins.find((plugin) => plugin.pluginId === "codex");
		const owner = installed && isInstalledPluginIndexInstallOwnerAmbiguous(installed) ? void 0 : installed && resolveInstalledPluginIndexInstallOwner(installed) || "codex";
		const record = owner ? metadata.index.installRecords[owner] : void 0;
		const official = getOfficialExternalPluginCatalogEntry("codex");
		const trustedBundled = official !== void 0 && installed?.origin === "bundled" && installed.packageName === official.name && (!record || record.source === "path" && record.sourcePath === installed.rootDir && record.installPath === installed.rootDir);
		const trustedInstall = record && isTrustedOfficialPluginInstallRecord({
			pluginId: "codex",
			packageName: installed?.packageName ?? official?.name,
			record
		});
		if ((installed || record) && !trustedBundled && !trustedInstall) return { error: "Automatic setup requires the official Codex plugin. Remove the conflicting Codex plugin source with openclaw plugins uninstall codex, then retry, or select it manually in Model Setup." };
	}
	const onCapabilityConsent = params.automaticSetup ? acceptAutomaticCodexCapabilities : params.prompter ? createPluginCapabilityConsentPrompter(params.prompter) : void 0;
	const enabled = await enablePluginWithCapabilityConsent(normalizePluginTargetConfig(stripPendingPluginInstallRecords(params.cfg), "codex"), "codex", {
		workspaceDir: params.workspace,
		beforePersistentEffect: params.beforePersistentEffect,
		beforePersistentApply: params.beforePersistentApply,
		onCapabilityConsent,
		recordOfficialCapabilities: params.automaticSetup
	});
	if (!enabled.enabled) return { error: `Could not enable the Codex runtime plugin: ${enabled.reason}.` };
	const ensured = await params.ensureCodex({
		cfg: enabled.config,
		model: params.modelRef,
		agentId: params.agentId,
		prompter: params.prompter ?? createQuickstartNotePrompter(params.runtime),
		runtime: params.runtime,
		workspaceDir: params.workspace,
		beforePersistentEffect: params.beforePersistentEffect,
		beforePersistentApply: params.beforePersistentApply,
		onCapabilityConsent,
		recordOfficialCapabilities: params.automaticSetup
	});
	if (!ensured.ok) return { error: ensured.message };
	const install = ensured.cfg.plugins?.installs?.codex;
	if (install?.source === "npm" && install.installPath) {
		if (!await (params.markRetained ?? (await import("./managed-npm-retention-PVMXGVPh.mjs")).markRetainedManagedNpmInstall)({
			packageDir: install.installPath,
			pluginId: "codex",
			reason: "openclaw-inference-activation-not-committed"
		})) throw new SetupInferenceActivationIndeterminateError("Could not retain the installed Codex package. Restart the Gateway before retrying setup.");
	}
	return { config: normalizePluginTargetConfig(ensured.cfg, "codex") };
}
/** Prepare the official runtime without starting an interactive provider login. */
async function prepareAutomaticSetupCodex(params) {
	const leaseOptions = {
		signal: params.signal,
		assertCurrent: params.beforePersistentApply
	};
	return await withPluginLifecycleLease(leaseOptions, async () => {
		const { ensureCodexRuntimePluginForSupervision } = await import("./codex-runtime-plugin-install-DlYFrR1C.mjs");
		const prepared = await prepareCodexRuntimePlugin({
			...params,
			automaticSetup: true,
			ensureCodex: ensureCodexRuntimePluginForSupervision
		});
		return "error" in prepared ? prepared : {
			ok: true,
			config: withCodexHomeScope(prepared.config, "agent")
		};
	});
}
async function stageCodexCandidate(ctx, modelRef) {
	const beforePersistentApply = () => throwIfSetupInferenceCancelled(ctx.params);
	const leaseOptions = {
		signal: ctx.params.signal,
		assertCurrent: beforePersistentApply
	};
	return await withPluginLifecycleLease(leaseOptions, async () => {
		const ensureCodex = ctx.deps.ensureCodexRuntimePlugin ?? (await import("./codex-runtime-plugin-install-DlYFrR1C.mjs")).ensureCodexRuntimePluginForModelSelection;
		const prepared = await prepareCodexRuntimePlugin({
			cfg: ctx.cfg,
			runtime: ctx.params.runtime,
			workspace: ctx.workspace,
			beforePersistentEffect: ctx.beforePersistentEffect,
			beforePersistentApply,
			prompter: ctx.params.prompter,
			automaticSetup: ctx.params.automaticSetup,
			modelRef,
			agentId: ctx.routeAgentId,
			ensureCodex,
			markRetained: ctx.deps.markRetainedManagedNpmInstall,
			resolveMetadata: ctx.deps.resolvePluginMetadataSnapshot
		});
		if ("error" in prepared) return prepared;
		const config = ctx.params.automaticSetup ? withCodexHomeScope(prepared.config, "user") : prepared.config;
		const pluginConfig = (config.plugins?.entries?.codex)?.config ?? {};
		const appServer = isRecord(pluginConfig.appServer) ? pluginConfig.appServer : {};
		if (typeof appServer.transport === "string" && appServer.transport !== "stdio") return { error: "Codex setup needs a local stdio app-server. Finish sign-in on the remote app-server host or remove the transport override before retrying." };
		const candidate = {
			modelRef,
			agentRuntimeId: "codex",
			pendingPluginInstalls: config.plugins?.installs,
			config
		};
		if (appServer.homeScope === "user") return candidate;
		const store = await loadAuthProfileStoreWithoutExternalProfilesAsync(ctx.agentDir);
		const existingProfileId = resolveAuthProfileOrder({
			cfg: config,
			store,
			provider: "openai",
			forModel: modelRef.slice(7)
		})[0];
		if (existingProfileId) return {
			...candidate,
			authProfileId: existingProfileId
		};
		try {
			const auth = await (ctx.deps.resolveApiKeyForProvider ?? resolveApiKeyForProviderCore)({
				cfg: config,
				store,
				provider: "openai",
				agentDir: ctx.agentDir,
				workspaceDir: ctx.workspace,
				allowAuthProfileFallback: false,
				skipSetupProviderFallback: true,
				secretSentinels: true
			});
			throwIfSetupInferenceCancelled(ctx.params);
			if (auth.apiKey) return {
				...candidate,
				authProfileId: auth.profileId
			};
		} catch (error) {
			if (!isProviderAuthError(error, "missing-provider-auth")) throw error;
		}
		throwIfSetupInferenceCancelled(ctx.params);
		const credential = (ctx.deps.readCodexCliActiveApiKey ?? readCodexCliActiveApiKey)({ allowKeychainPrompt: true });
		if (!credential) {
			const choices = (ctx.deps.resolveManifestProviderAuthChoices ?? resolveManifestProviderAuthChoices)({
				config,
				workspaceDir: ctx.workspace,
				includeUntrustedWorkspacePlugins: false,
				includeWorkspacePlugins: false
			});
			const options = listSetupInferenceAuthOptions(choices).filter((choice) => choice.brandId === "openai" && (choice.kind === "oauth" || choice.kind === "device-code"));
			const choice = options.find((option) => option.id === ctx.params.authChoice) ?? options[0];
			if (!choice) return { error: "OpenAI sign-in is unavailable. Connect OpenAI in Model Setup, then retry Codex setup." };
			return await stageProviderAuthCandidate({
				...ctx,
				cfg: config,
				params: {
					...ctx.params,
					modelRef,
					authChoice: choice.id
				}
			}, true, "codex");
		}
		registerSecretValueForRedaction(credential.key);
		const saved = await saveSetupCredential({
			profile: {
				profileId: "openai:codex-cli-api-key",
				credential
			},
			config,
			baseConfig: ctx.cfg,
			modelRef,
			pluginId: "codex",
			agentRuntimeId: "codex",
			agentDir: ctx.agentDir,
			beforePersistentEffect: () => ctx.beforePersistentEffect("credential"),
			beforeWrite: () => throwIfSetupInferenceCancelled(ctx.params)
		});
		ctx.effects.credentialsSaved = true;
		return {
			...candidate,
			authProfileId: saved.profile.profileId,
			config: saved.config
		};
	});
}
//#endregion
export { applySetupNativeSessionCatalogPreference as a, resolveSetupNativeSessionCatalogPreference as c, listManualSetupInferenceOptions as i, rankSetupInferenceCandidates as l, stageCodexCandidate as n, listSetupNativeSessionCatalogs as o, detectSetupInference as r, requiresSetupNativeSessionCatalogConsent as s, prepareAutomaticSetupCodex as t };
