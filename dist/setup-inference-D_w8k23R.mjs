import { s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir, m as resolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { d as resolvePluginMetadataSnapshotAsync } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { i as hashConfigRaw } from "./io.read-helpers-KYk5dB53.mjs";
import { f as materializeRuntimeConfig } from "./validation-core-ezn1vWYO.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-CeM8o97s.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-DXrnO3F4.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-COeXJqiY.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-D-eANYlX.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BDZ8eM01.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { s as resolveCliRuntimeCanonicalProvider } from "./cli-backends-BzVT3JSM.mjs";
import { g as loadAuthProfileStoreWithoutExternalProfilesAsync } from "./store-runtime-CwqGD12G.mjs";
import { n as WizardCancelledError, r as WizardNavigationError } from "./prompts-DLsO8MlU.mjs";
import { s as stripPendingPluginInstallRecords } from "./install-record-commit-zYfMjC8g.mjs";
import { r as resolveAgentHarnessSelectionDecision } from "./selection-decision-CRh-vMBN.mjs";
import { t as raceWithAbortSignal } from "./agent-tools.abort-Vm0F-Le2.mjs";
import { i as appendSystemAgentAuditEntry } from "./audit-DxyhTU4L.mjs";
import { n as projectInferenceRoute, r as resolveSystemAgentConfiguredRouteFromConfig } from "./inference-route-BKUtNPSd.mjs";
import { C as validateSetupModelTarget, S as validateSetupInferenceOwnerEvidence, a as SetupInferenceCancelledError, c as invalidSetupConfigError, d as parseSavedAuthSetupProfileId, f as redactSetupInferenceError, g as resolveSetupModel, h as resolveSetupInferenceWorkspace, i as SetupInferenceActivationUnavailableError, l as parseInferenceRef, o as SetupInferenceOwnerDriftError, r as SetupInferenceActivationIndeterminateError, s as describeSetupInferenceError, u as parseProviderAutoSetupChoiceId, y as throwIfSetupInferenceCancelled } from "./setup-inference-core-CZLQ-ncs.mjs";
import { i as setupConfigPatchConflicts, n as commitSetupInferenceActivation, t as captureSetupInferenceFileUndo } from "./setup-inference-transition-BIutiuYm.mjs";
import { t as captureSystemAgentOwnerPluginArtifacts } from "./verified-inference-DGxbE23j.mjs";
import "./setup-inference-auth-options-B80Cp2JV.mjs";
import { a as applySetupNativeSessionCatalogPreference, c as resolveSetupNativeSessionCatalogPreference, n as stageCodexCandidate, o as listSetupNativeSessionCatalogs, s as requiresSetupNativeSessionCatalogConsent } from "./setup-inference-codex-BgyzC41F.mjs";
import { a as OPENAI_API_DEFAULT_MODEL_REF, i as GEMINI_CLI_DEFAULT_MODEL_REF, n as CLAUDE_CLI_DEFAULT_MODEL_REF, r as CODEX_APP_SERVER_DEFAULT_MODEL_REF, t as ANTHROPIC_API_DEFAULT_MODEL_REF } from "./onboard-inference-ambient-Kk-cufr9.mjs";
import "./onboard-inference-FZUAKJUV.mjs";
import { n as createSystemAgentModelSelectionUpdater } from "./setup-model-selection-0-TC67fp.mjs";
import { a as stageProviderAutoCandidate, i as stageProviderAuthCandidate, o as stageSavedAuthCandidate } from "./setup-inference-credentials-_9S0MeER.mjs";
import { a as revalidateStableSetupInferenceOwner, d as withPreparedSetupCredentialAccess, l as activatePreparedSetupCredential, o as runSetupInferenceTurn, r as loadSetupInferencePluginGeneration } from "./setup-inference-turn-BC8jnZkF.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/system-agent/setup-inference-harness.ts
async function verifySetupHarness(params) {
	const { route, deps } = params;
	const runtime = route.runner === "embedded" ? route.agentHarnessRuntimeOverride : void 0;
	if (route.authProfileId || !runtime || runtime === "openclaw" || runtime === "auto") return;
	params.assertCurrent();
	const workspaceDir = resolveAgentWorkspaceDir(route.runConfig, route.agentId, process.env);
	const generation = await loadSetupInferencePluginGeneration({
		cache: params.cache,
		config: route.runConfig,
		workspaceDir,
		selection: {
			provider: route.provider,
			modelId: route.model,
			runtime,
			agentId: route.agentId
		},
		resolvePluginMetadataSnapshot: deps.resolvePluginMetadataSnapshot
	});
	params.assertCurrent();
	return await withPluginRuntimeGenerationScope(generation, async () => {
		const registration = getRegisteredAgentHarness(runtime);
		const harness = registration?.harness;
		if (!harness?.verifySetup || harness.authBootstrap !== "harness") return;
		const selection = resolveAgentHarnessSelectionDecision({
			provider: route.provider,
			modelId: route.model,
			config: route.runConfig,
			agentId: route.agentId,
			agentHarnessRuntimeOverride: runtime
		});
		if (selection.builtIn || selection.harness !== harness) return;
		const verify = harness.verifySetup.bind(harness);
		const ownerPluginId = registration?.ownerPluginId;
		if (!ownerPluginId) throw new Error("The setup verification harness has no plugin owner.");
		const capture = () => (deps.captureSystemAgentOwnerPluginArtifacts ?? captureSystemAgentOwnerPluginArtifacts)({
			config: route.runConfig,
			executionRoute: route,
			deps
		});
		const artifacts = capture();
		if (!artifacts.ownerPluginArtifacts.some((entry) => entry.pluginId === ownerPluginId)) throw new Error("The setup verification harness has no trusted runtime artifact.");
		const timeout = AbortSignal.timeout(deps.timeoutMs ?? 9e4);
		const signal = params.signal ? AbortSignal.any([params.signal, timeout]) : timeout;
		let open = true;
		const assertCurrent = () => {
			if (!open) throw new Error("The setup verification operation has closed.");
			signal.throwIfAborted();
			params.assertCurrent();
			if (getRegisteredAgentHarness(runtime)?.harness !== harness) throw new SetupInferenceOwnerDriftError("The setup verification harness changed.");
		};
		const started = Date.now();
		try {
			assertCurrent();
			await raceWithAbortSignal(verify({
				config: route.runConfig,
				provider: route.provider,
				modelId: route.model,
				workspaceDir,
				signal,
				assertCurrent
			}), signal);
			assertCurrent();
			if (!isDeepStrictEqual(artifacts, capture())) throw new SetupInferenceOwnerDriftError("The setup verification plugin changed during its check.");
			return {
				ok: true,
				latencyMs: Date.now() - started,
				binding: artifacts
			};
		} finally {
			open = false;
		}
	});
}
//#endregion
//#region src/system-agent/setup-inference-activate.ts
async function stageCandidate(ctx) {
	const { params, cfg } = ctx;
	const roleError = params.kind.startsWith("saved-auth:") || parseProviderAutoSetupChoiceId(params.kind) || params.kind === "existing-model" || params.kind === "provider-auth" || params.kind === "api-key" ? void 0 : validateSetupModelTarget(void 0, params.modelTarget);
	if (roleError) return roleError;
	if (params.kind.startsWith("saved-auth:")) {
		const profileId = parseSavedAuthSetupProfileId(params.kind);
		if (!profileId) return { error: "Invalid saved sign-in choice. Open Model Setup and choose again." };
		return await stageSavedAuthCandidate(ctx, profileId);
	}
	const choiceId = parseProviderAutoSetupChoiceId(params.kind);
	if (choiceId) return await stageProviderAutoCandidate(ctx, choiceId);
	switch (params.kind) {
		case "existing-model": {
			const route = await resolveSystemAgentConfiguredRouteFromConfig(cfg, params.agentId, {
				loadAuthProfileStoreForRuntimeAsync: ctx.deps.loadAuthProfileStoreForRuntimeAsync,
				...params.modelTarget ? { modelTarget: params.modelTarget } : {}
			}, ctx.snapshot);
			if (!route) return { error: "No configured default-agent inference route is available." };
			const routeRoleError = validateSetupModelTarget(route.modelTarget, params.modelTarget);
			if (routeRoleError) return routeRoleError;
			const requested = params.modelRef?.trim();
			if (requested && normalizeAgentModelRefForConfig(requested) !== route.modelLabel) return { error: `The configured default model changed from ${requested} to ${route.modelLabel}. Try setup again.` };
			return {
				modelRef: route.modelLabel,
				...route.modelTarget ? { modelTarget: route.modelTarget } : {},
				config: cfg,
				...route.authProfileId ? { authProfileId: route.authProfileId } : {}
			};
		}
		case "api-key": return await stageProviderAuthCandidate(ctx, false);
		case "provider-auth": return await stageProviderAuthCandidate(ctx, true);
		case "codex-cli":
		case "claude-cli":
		case "gemini-cli":
		case "openai-api-key":
		case "anthropic-api-key": {
			const defaultModel = {
				"codex-cli": CODEX_APP_SERVER_DEFAULT_MODEL_REF,
				"claude-cli": CLAUDE_CLI_DEFAULT_MODEL_REF,
				"gemini-cli": GEMINI_CLI_DEFAULT_MODEL_REF,
				"openai-api-key": OPENAI_API_DEFAULT_MODEL_REF,
				"anthropic-api-key": ANTHROPIC_API_DEFAULT_MODEL_REF
			}[params.kind];
			const modelRef = resolveSetupModel({
				label: params.kind,
				providerId: parseInferenceRef(defaultModel).provider,
				defaultModel,
				modelRef: params.modelRef
			});
			if (typeof modelRef !== "string") return modelRef;
			if (params.kind === "codex-cli") return await stageCodexCandidate(ctx, modelRef);
			if (params.kind === "claude-cli") {
				const ref = parseInferenceRef(modelRef);
				return {
					modelRef: `${resolveCliRuntimeCanonicalProvider({
						runtime: ref.provider,
						config: cfg,
						env: process.env,
						includeSetupRegistry: true
					}) ?? ref.provider}/${ref.model}`,
					agentRuntimeId: "claude-cli",
					config: cfg
				};
			}
			return {
				modelRef,
				...params.kind === "gemini-cli" ? {} : { agentRuntimeId: "openclaw" },
				config: cfg
			};
		}
		default: return { error: `Unknown inference choice "${params.kind}".` };
	}
}
async function withSetupInferenceErrorRedaction(operation, apiKey) {
	try {
		return await operation();
	} catch (error) {
		const redacted = await redactSetupInferenceError(error, apiKey);
		if (error instanceof WizardNavigationError) throw new WizardNavigationError(error.direction);
		if (error instanceof SetupInferenceCancelledError) throw new SetupInferenceCancelledError();
		throw new (([
			WizardCancelledError,
			SetupInferenceActivationUnavailableError,
			SetupInferenceOwnerDriftError,
			SetupInferenceActivationIndeterminateError
		].find((ErrorType) => error instanceof ErrorType)) ?? Error)(redacted);
	}
}
/** Save credentials once, confirm the candidate in memory, then commit its config. */
async function activateSetupInference(params) {
	try {
		return await withSetupInferenceErrorRedaction(async () => {
			const onActivationCompletion = params.onActivationCompletion;
			const result = await activateCandidate({
				...params,
				onActivationCompletion: onActivationCompletion ? (complete) => onActivationCompletion(() => withSetupInferenceErrorRedaction(complete, params.apiKey)) : void 0
			});
			return result.ok ? {
				...result,
				lines: await Promise.all(result.lines.map((line) => redactSetupInferenceError(line, params.apiKey)))
			} : {
				...result,
				error: await redactSetupInferenceError(result.error, params.apiKey)
			};
		}, params.apiKey);
	} catch (error) {
		if (error instanceof WizardCancelledError || error instanceof WizardNavigationError) throw error;
		if (error instanceof SetupInferenceCancelledError || params.signal?.aborted) return {
			ok: false,
			status: "unavailable",
			error: "Provider login was cancelled."
		};
		if (error instanceof SetupInferenceActivationUnavailableError) return {
			ok: false,
			status: "unavailable",
			error: error.message
		};
		if (error instanceof SetupInferenceOwnerDriftError) return {
			ok: false,
			status: "auth",
			error: error.message
		};
		throw error;
	}
}
async function activateCandidate(params) {
	const deps = params.deps ?? {};
	const snapshot = await (deps.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot)();
	if (snapshot.exists && !snapshot.valid) throw new Error(invalidSetupConfigError(snapshot));
	const cfg = snapshot.runtimeConfig ?? snapshot.config;
	const routeAgentId = resolveAmbientOwnerAgentId(cfg, params.agentId);
	const ctx = {
		params,
		deps,
		snapshot,
		cfg,
		routeAgentId,
		agentDir: resolveAgentDir(cfg, routeAgentId),
		workspace: params.workspace?.trim() ? resolveUserPath(params.workspace) : resolveSetupInferenceWorkspace(snapshot),
		effects: { credentialsSaved: false },
		beforePersistentEffect: async () => {
			throwIfSetupInferenceCancelled(params);
			await params.beforePersistentEffect?.();
			throwIfSetupInferenceCancelled(params);
		}
	};
	const staged = await stageCandidate(ctx);
	const failure = (result) => ({
		...result,
		...ctx.effects.credentialsSaved ? { error: `Credentials saved; default unchanged. ${result.error} Choose the saved sign-in in Model Setup to retry without signing in again.` } : {},
		disposition: "rejected-before-promotion"
	});
	if ("error" in staged) return failure({
		ok: false,
		status: "unavailable",
		error: staged.error
	});
	const verify = (runtimeCredential) => verifyAndActivateCandidate(ctx, staged, failure, runtimeCredential);
	if (!staged.authProfileId) return await verify();
	return await withPreparedSetupCredentialAccess(ctx, staged, staged.authProfileId, verify, failure);
}
async function verifyAndActivateCandidate(ctx, staged, failure, runtimeCredential) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { params, deps, snapshot, cfg, routeAgentId } = ctx;
		const source = snapshot.sourceConfig;
		const readSnapshot = deps.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot;
		const catalogPreference = params.automaticSetup ? false : resolveSetupNativeSessionCatalogPreference({
			consentRequired: requiresSetupNativeSessionCatalogConsent({
				configExists: snapshot.exists,
				config: source,
				catalogs: listSetupNativeSessionCatalogs({
					config: source,
					workspaceDir: ctx.workspace
				})
			}),
			...params.nativeSessionCatalogsEnabled !== void 0 ? { requested: params.nativeSessionCatalogsEnabled } : {}
		});
		const prepared = catalogPreference === void 0 ? staged.config : applySetupNativeSessionCatalogPreference({
			config: staged.config,
			enabled: catalogPreference,
			onlyUnset: params.automaticSetup === true,
			workspaceDir: ctx.workspace
		});
		const providerPatch = createMergePatch(cfg, stripPendingPluginInstallRecords(prepared));
		const selectModel = params.kind === "existing-model" ? (config) => config : await createSystemAgentModelSelectionUpdater({
			model: staged.modelRef,
			...staged.modelTarget ? { modelTarget: staged.modelTarget } : {},
			...params.agentId ? { targetAgentId: routeAgentId } : {},
			...staged.agentRuntimeId ? { agentRuntimeId: staged.agentRuntimeId } : {},
			runtimeInDefaults: !params.agentId && !hasResolvedRosterBeforeMigrations(snapshot),
			...staged.authProfileId ? { authProfileId: staged.authProfileId } : {}
		});
		const buildCandidate = (base) => {
			let patched = base;
			if (!isRecord(providerPatch) || Object.keys(providerPatch).length > 0) patched = applyMergePatch(base, providerPatch);
			const selected = params.selectModel === false ? patched : selectModel(patched, base);
			return staged.pendingPluginInstalls ? {
				...selected,
				plugins: {
					...selected.plugins,
					installs: staged.pendingPluginInstalls
				}
			} : selected;
		};
		const candidate = buildCandidate(cfg);
		const sourceCandidate = buildCandidate(source);
		const candidateRouteConfig = (config) => params.selectModel === false ? selectModel(config, config) : config;
		const resolveMetadata = deps.resolvePluginMetadataSnapshot ?? resolvePluginMetadataSnapshotAsync;
		const cache = _usingCtx$1.a(createPluginCache());
		const generation = staged.pendingPluginInstalls && Object.keys(staged.pendingPluginInstalls).length > 0 ? await withPluginLifecycleLease({ signal: params.signal }, async () => loadSetupInferencePluginGeneration({
			cache,
			config: candidate,
			workspaceDir: ctx.workspace,
			selection: {
				provider: parseInferenceRef(staged.modelRef).provider,
				modelId: parseInferenceRef(staged.modelRef).model,
				runtime: staged.agentRuntimeId ?? "openclaw",
				agentId: routeAgentId
			},
			pendingPluginInstalls: staged.pendingPluginInstalls,
			resolvePluginMetadataSnapshot: resolveMetadata
		})) : void 0;
		const metadata = generation?.metadataSnapshot ?? await resolveMetadata({
			config: candidate,
			workspaceDir: ctx.workspace,
			env: process.env
		});
		const routeDeps = {
			...staged.modelTarget ? { modelTarget: staged.modelTarget } : {},
			pluginMetadataPlugins: metadata.plugins,
			loadAuthProfileStoreForRuntimeAsync: deps.loadAuthProfileStoreForRuntimeAsync
		};
		const requestedAgentId = params.agentId ? routeAgentId : void 0;
		const project = (config, sourceConfig) => projectInferenceRoute(materializeRuntimeConfig(config, { manifestRegistry: { plugins: [...metadata.plugins] } }), requestedAgentId, routeDeps, sourceConfig);
		const resolveRoute = (config, currentSnapshot = snapshot) => resolveSystemAgentConfiguredRouteFromConfig(candidateRouteConfig(config), requestedAgentId, routeDeps, currentSnapshot);
		const route = await resolveRoute(candidate);
		if (!route || route.modelLabel !== staged.modelRef || staged.authProfileId && route.authProfileId !== staged.authProfileId) return failure({
			ok: false,
			status: "unavailable",
			error: "The candidate route does not match the selected provider, model, and credential. Review model runtime policy and retry."
		});
		const baselineRoute = await project(cfg, source);
		const verifiedRoute = await project(candidateRouteConfig(candidate), candidateRouteConfig(sourceCandidate));
		const withGeneration = (run) => generation ? withPluginRuntimeGenerationScope(generation, run) : run();
		const artifacts = withGeneration(() => (deps.captureSystemAgentOwnerPluginArtifacts ?? captureSystemAgentOwnerPluginArtifacts)({
			config: route.runConfig,
			executionRoute: route,
			deps
		}));
		params.onPreparationComplete?.();
		throwIfSetupInferenceCancelled(params);
		const progress = params.prompter?.progress("Testing your AI connection…");
		const verification = await withGeneration(async () => {
			try {
				const native = await verifySetupHarness({
					route,
					deps,
					cache,
					signal: params.signal,
					assertCurrent: () => throwIfSetupInferenceCancelled(params)
				});
				if (native) return native;
				return await runSetupInferenceTurn({
					route,
					deps,
					requireExecutionOwner: true,
					signal: params.signal,
					runtime: params.runtime
				});
			} catch (error) {
				return {
					ok: false,
					...describeSetupInferenceError(error, route)
				};
			}
		}).finally(() => progress?.stop());
		throwIfSetupInferenceCancelled(params);
		if (!verification.ok) return failure(verification);
		if ("auth" in verification) {
			const ownerFailure = validateSetupInferenceOwnerEvidence({
				runner: route.runner,
				configuredHarnessId: route.runner === "embedded" ? route.agentHarnessRuntimeOverride : void 0,
				auth: verification.auth
			});
			if (ownerFailure) return failure(ownerFailure);
		}
		const savedCredential = staged.authProfileId ? (await loadAuthProfileStoreWithoutExternalProfilesAsync(ctx.agentDir)).profiles[staged.authProfileId] : void 0;
		if (savedCredential?.setup?.replacement && !params.activationConfirmed) {
			if (!params.prompter || !await params.prompter.confirm({
				message: "Connection verified. Activate this saved sign-in?",
				initialValue: true
			})) return failure({
				ok: false,
				status: "unavailable",
				error: "Activation declined. The saved sign-in is inactive and your current connection is unchanged."
			});
			throwIfSetupInferenceCancelled(params);
		}
		const revalidateOwner = async (candidateRoute) => {
			if ("binding" in verification) {
				let current;
				try {
					current = await withGeneration(() => verifySetupHarness({
						route: candidateRoute,
						deps,
						cache,
						signal: params.signal,
						assertCurrent: () => throwIfSetupInferenceCancelled(params)
					}));
				} catch (error) {
					throw new SetupInferenceOwnerDriftError(`The native connection changed before activation. Retry setup. (${formatErrorMessage(error)})`, { cause: error });
				}
				if (!current || !isDeepStrictEqual(current.binding, verification.binding)) throw new SetupInferenceOwnerDriftError("The native setup verification owner changed before activation. Retry setup.");
				return;
			}
			await withGeneration(() => revalidateStableSetupInferenceOwner({
				route: candidateRoute,
				auth: verification.auth,
				stagedOwnerPluginArtifacts: artifacts,
				deps
			}));
		};
		const revalidate = async (currentSnapshot) => {
			const config = currentSnapshot.runtimeConfig ?? currentSnapshot.config;
			const sourceConfig = currentSnapshot.sourceConfig;
			if (!isDeepStrictEqual(await project(config, sourceConfig), baselineRoute) || setupConfigPatchConflicts(source, sourceConfig, createMergePatch(source, sourceCandidate))) throw new SetupInferenceOwnerDriftError("Connection settings changed during verification. Choose the saved sign-in to test the current connection.");
			const next = buildCandidate(config);
			if (!isDeepStrictEqual(await project(candidateRouteConfig(next), candidateRouteConfig(buildCandidate(sourceConfig))), verifiedRoute)) throw new SetupInferenceOwnerDriftError("The candidate route changed during verification. Retry setup before selecting it as the default.");
			const nextRoute = await resolveRoute(next, currentSnapshot);
			if (!nextRoute) throw new SetupInferenceOwnerDriftError("The selected inference route is no longer available.");
			await revalidateOwner(nextRoute);
		};
		const activateCredential = async (assertCurrent) => {
			if (!staged.authProfileId || !savedCredential?.setup) return;
			const profileId = staged.authProfileId;
			return await activatePreparedSetupCredential(ctx, profileId, savedCredential, runtimeCredential, async () => {
				const latest = await readSnapshot();
				const current = latest.runtimeConfig ?? latest.config;
				if (!isDeepStrictEqual(await project(current, latest.sourceConfig), verifiedRoute)) throw new SetupInferenceOwnerDriftError("The connection changed before credential activation. Test the saved sign-in again.");
				await revalidateOwner(route);
			}, assertCurrent);
		};
		if (!isDeepStrictEqual(sourceCandidate, source) || savedCredential?.setup) {
			const configTarget = {
				read: async () => ({
					config: (await readSnapshot()).sourceConfig,
					write: configTarget.write
				}),
				write: async (_candidate, { writeOptions, captureUndo }) => {
					return (await (deps.transformConfigWithPendingPluginInstalls ?? (await import("./install-record-commit--tS25mQG.mjs")).transformConfigWithPendingPluginInstalls)({
						base: "source",
						writeOptions,
						transform: async (current, context) => {
							await ctx.beforePersistentEffect();
							await revalidate(context.snapshot);
							throwIfSetupInferenceCancelled(params);
							params.onCommitStarted?.(current);
							const nextConfig = buildCandidate(current);
							captureUndo(captureSetupInferenceFileUndo({
								...context.snapshot,
								sourceConfig: stripPendingPluginInstallRecords(context.snapshot.sourceConfig)
							}, stripPendingPluginInstallRecords(nextConfig)));
							return { nextConfig };
						}
					})).nextConfig;
				}
			};
			await commitSetupInferenceActivation({
				preserveWorkingConnection: Boolean(savedCredential?.setup?.replacement || params.selectModel !== false && (baselineRoute.route || resolveAgentEffectiveModelPrimary(cfg, routeAgentId))),
				requireApplied: params.automaticSetup,
				assertCurrent: () => throwIfSetupInferenceCancelled(params),
				activate: activateCredential,
				deferCompletion: params.onActivationCompletion,
				configTarget,
				config: sourceCandidate
			});
		} else await revalidate(await readSnapshot());
		const lines = [`${staged.modelTarget === "utility" ? "Utility inference" : "Inference"} verified: ${staged.modelRef}`];
		if (params.surface === "gateway" && params.recordSetupAudit !== false) {
			const after = await readSnapshot().catch(() => null);
			try {
				await appendSystemAgentAuditEntry({
					operation: "openclaw.setup",
					summary: "Verified an AI access candidate through OpenClaw setup",
					configPath: after?.path ?? snapshot.path,
					configHashBefore: hashConfigRaw(snapshot.raw),
					configHashAfter: after ? hashConfigRaw(after.raw) : null,
					details: {
						modelRef: staged.modelRef,
						inferenceKind: params.kind,
						...params.automaticSetup ? { source: "automatic-setup" } : {}
					}
				});
			} catch (error) {
				const warning = `Inference was verified, but OpenClaw could not record its audit entry: ${formatErrorMessage(error)}`;
				params.runtime.error?.(warning);
				lines.push(warning);
			}
		}
		return {
			ok: true,
			modelRef: staged.modelRef,
			...staged.modelTarget ? { modelTarget: staged.modelTarget } : {},
			latencyMs: verification.latencyMs,
			lines
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { activateSetupInference as t };
