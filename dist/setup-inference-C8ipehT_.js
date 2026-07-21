import { m as resolveUserPath } from "./utils-CRO4LGEB.js";
import { i as resolveAgentModelPrimaryValue, n as normalizeAgentModelRefForConfig } from "./model-input-B5RmygIK.js";
import "./agent-scope-B2Pk_xhT.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId } from "./agent-scope-config-BxAUeF6t.js";
import { W as createMergePatch } from "./io-DxnOT4sF.js";
import { t as applyMergePatch } from "./merge-patch-PFdHlc8i.js";
import { n as enablePluginInConfig } from "./enable-C_2G1hqP.js";
import { c as loadPersistedAuthProfileStore } from "./source-check-CsikPIZO.js";
import { n as resolvePluginProviders } from "./providers.runtime-CicU0C-Z.js";
import { m as updateAuthProfileStoreWithLock } from "./store-9jfx-1KO.js";
import { c as normalizeAuthProfileCredential } from "./profiles-Bs4Dh6yw.js";
import { o as normalizeProviderId } from "./model-selection-normalize-Cj03z3tC.js";
import { t as isCliProvider } from "./model-selection-cli-DB4l0L04.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-CFL1kjzt.js";
import { a as describeFailoverError } from "./failover-error-B2zFYEnG.js";
import { a as OPENAI_API_DEFAULT_MODEL_REF, i as GEMINI_CLI_DEFAULT_MODEL_REF, n as CLAUDE_CLI_DEFAULT_MODEL_REF, o as detectInferenceBackends, r as CODEX_APP_SERVER_DEFAULT_MODEL_REF, t as ANTHROPIC_API_DEFAULT_MODEL_REF } from "./onboard-inference-DmVigg0r.js";
import { i as resolveManifestProviderAuthChoices, r as resolveManifestProviderAuthChoice } from "./provider-auth-choices-DxcLKNxD.js";
import { i as runProviderPluginAuthMethodUnpersisted, n as applyProviderPluginAuthMethodResultConfig } from "./provider-auth-choice-Ck1mIsoq.js";
import { n as buildCodexAppServerPlannerConfig, t as buildCliPlannerConfig } from "./assistant-backends-C96KpxKv.js";
import { n as createQuickstartNotePrompter, t as applyCrestodianSetup } from "./setup-apply-DiGMcarT.js";
import { n as loadAuthoredSetupConfig } from "./onboarding-welcome-B85Jy9U0.js";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { randomUUID } from "node:crypto";
const SETUP_INFERENCE_TEST_PROMPT = "Reply with the single word OK. Do not use tools.";
const SETUP_INFERENCE_TEST_MAX_TOKENS = 32;
async function resolveSetupInferenceWorkspace(params) {
	const { authoredConfig, hasAuthoredSetup } = await loadAuthoredSetupConfig(params);
	const { DEFAULT_WORKSPACE } = await import("./onboard-helpers-C3VZoo6M.js");
	return {
		workspace: resolveUserPath(authoredConfig?.agents?.defaults?.workspace?.trim() || DEFAULT_WORKSPACE),
		hasAuthoredSetup
	};
}
function supportsTextInference(scopes) {
	return !scopes || scopes.includes("text-inference");
}
function supportsManualSecret(choice) {
	return supportsTextInference(choice.onboardingScopes) && choice.appGuidedSecret === true;
}
function listSetupInferenceManualProviders(authChoices) {
	const choices = /* @__PURE__ */ new Map();
	for (const choice of authChoices) {
		const id = choice.choiceId.trim();
		if (!id || choices.has(id) || !supportsManualSecret(choice)) continue;
		choices.set(id, {
			id,
			label: choice.choiceLabel,
			...choice.choiceHint?.trim() ? { hint: choice.choiceHint.trim() } : {}
		});
	}
	return [...choices.values()].toSorted((a, b) => a.label.localeCompare(b.label, "en") || a.id.localeCompare(b.id, "en"));
}
async function detectSetupInference(deps = {}) {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const snapshot = await readConfigFileSnapshot();
	const cfg = snapshot.exists && snapshot.valid ? snapshot.runtimeConfig ?? snapshot.config : {};
	const raw = await detectInferenceBackends({ config: cfg });
	const recommendedIndex = raw.findIndex((candidate) => candidate.credentials !== false);
	const candidates = raw.map((candidate, index) => ({
		...candidate,
		recommended: index === recommendedIndex
	}));
	const { workspace, hasAuthoredSetup } = await resolveSetupInferenceWorkspace({
		configExists: snapshot.exists,
		configValid: snapshot.valid
	});
	const configuredModel = raw.find((candidate) => candidate.kind === "existing-model")?.modelRef;
	return {
		candidates,
		manualProviders: listSetupInferenceManualProviders((deps.resolveManifestProviderAuthChoices ?? resolveManifestProviderAuthChoices)({
			config: cfg,
			workspaceDir: workspace,
			includeUntrustedWorkspacePlugins: false,
			includeWorkspacePlugins: false
		}).filter((choice) => enablePluginInConfig(cfg, choice.pluginId).enabled)),
		workspace,
		...configuredModel ? { configuredModel } : {},
		setupComplete: hasAuthoredSetup && Boolean(configuredModel)
	};
}
function extractRunText(result) {
	return result.meta?.finalAssistantVisibleText ?? result.meta?.finalAssistantRawText ?? result.payloads?.map((payload) => payload.text?.trim()).filter(Boolean).join("\n");
}
function parseRef(modelRef) {
	const slash = modelRef.indexOf("/");
	return slash === -1 ? {
		provider: modelRef,
		model: ""
	} : {
		provider: modelRef.slice(0, slash),
		model: modelRef.slice(slash + 1)
	};
}
function mapFailoverReasonToSetupStatus(reason) {
	if (reason === "auth" || reason === "auth_permanent") return "auth";
	if (reason === "rate_limit" || reason === "overloaded") return "rate_limit";
	if (reason === "billing") return "billing";
	if (reason === "timeout") return "timeout";
	if (reason === "format" || reason === "model_not_found") return "format";
	return "unknown";
}
async function buildTestPlan(params) {
	const { kind, cfg, workspaceDir } = params;
	switch (kind) {
		case "existing-model": {
			const ref = resolveDefaultModelForAgent({
				cfg,
				agentId: resolveDefaultAgentId(cfg)
			});
			const modelRef = `${ref.provider}/${ref.model}`;
			return {
				runner: isCliProvider(ref.provider, cfg) ? "cli" : "embedded",
				provider: ref.provider,
				model: ref.model,
				modelRef,
				config: cfg
			};
		}
		case "claude-cli": return {
			runner: "cli",
			...parseRef(CLAUDE_CLI_DEFAULT_MODEL_REF),
			modelRef: CLAUDE_CLI_DEFAULT_MODEL_REF,
			config: buildCliPlannerConfig(workspaceDir, CLAUDE_CLI_DEFAULT_MODEL_REF),
			persistModelRef: CLAUDE_CLI_DEFAULT_MODEL_REF
		};
		case "gemini-cli": return {
			runner: "cli",
			...parseRef(GEMINI_CLI_DEFAULT_MODEL_REF),
			modelRef: GEMINI_CLI_DEFAULT_MODEL_REF,
			config: buildCliPlannerConfig(workspaceDir, GEMINI_CLI_DEFAULT_MODEL_REF),
			persistModelRef: GEMINI_CLI_DEFAULT_MODEL_REF
		};
		case "codex-cli": return {
			runner: "embedded",
			...parseRef(CODEX_APP_SERVER_DEFAULT_MODEL_REF),
			modelRef: CODEX_APP_SERVER_DEFAULT_MODEL_REF,
			config: buildCodexAppServerPlannerConfig(workspaceDir),
			agentHarnessId: "codex",
			persistModelRef: CODEX_APP_SERVER_DEFAULT_MODEL_REF
		};
		case "openai-api-key": return {
			runner: "embedded",
			...parseRef(OPENAI_API_DEFAULT_MODEL_REF),
			modelRef: OPENAI_API_DEFAULT_MODEL_REF,
			config: buildCliPlannerConfig(workspaceDir, OPENAI_API_DEFAULT_MODEL_REF),
			persistModelRef: OPENAI_API_DEFAULT_MODEL_REF
		};
		case "anthropic-api-key": return {
			runner: "embedded",
			...parseRef(ANTHROPIC_API_DEFAULT_MODEL_REF),
			modelRef: ANTHROPIC_API_DEFAULT_MODEL_REF,
			config: buildCliPlannerConfig(workspaceDir, ANTHROPIC_API_DEFAULT_MODEL_REF),
			persistModelRef: ANTHROPIC_API_DEFAULT_MODEL_REF
		};
		case "api-key": {
			const apiKey = params.apiKey?.trim();
			if (!apiKey) return { error: "Enter an API key or token first." };
			const authChoice = params.authChoice?.trim();
			const choice = authChoice ? (params.deps.resolveManifestProviderAuthChoice ?? resolveManifestProviderAuthChoice)(authChoice, {
				config: cfg,
				workspaceDir: params.pluginWorkspaceDir,
				includeUntrustedWorkspacePlugins: false,
				includeWorkspacePlugins: false
			}) : void 0;
			if (!choice || !supportsManualSecret(choice)) return { error: "That key-based provider is not available on this Gateway." };
			const enableResult = (params.deps.enablePluginInConfig ?? enablePluginInConfig)(cfg, choice.pluginId);
			if (!enableResult.enabled) return { error: `${choice.choiceLabel} is disabled (${enableResult.reason ?? "blocked"}).` };
			const provider = (params.deps.resolvePluginProviders ?? resolvePluginProviders)({
				config: enableResult.config,
				workspaceDir: params.pluginWorkspaceDir,
				mode: "setup",
				includeUntrustedWorkspacePlugins: false,
				onlyPluginIds: [choice.pluginId]
			}).find((candidate) => candidate.pluginId === choice.pluginId && normalizeProviderId(candidate.id) === normalizeProviderId(choice.providerId));
			const method = provider?.auth.find((candidate) => candidate.id === choice.methodId);
			const resolved = provider && method ? {
				provider,
				method
			} : null;
			if (!resolved || !supportsTextInference(resolved.method.wizard?.onboardingScopes)) return { error: "That key-based provider is not available on this Gateway." };
			let result;
			let preparedConfig;
			try {
				if (resolved.method.kind === "api_key" || resolved.method.kind === "token") {
					result = await runProviderPluginAuthMethodUnpersisted({
						config: enableResult.config,
						runtime: params.runtime,
						prompter: createQuickstartNotePrompter(params.runtime),
						method: resolved.method,
						agentDir: params.agentDir,
						workspaceDir,
						secretInputMode: "plaintext",
						allowSecretRefPrompt: false,
						opts: {
							token: apiKey,
							tokenProvider: resolved.provider.id
						}
					});
					preparedConfig = applyProviderPluginAuthMethodResultConfig({
						config: enableResult.config,
						result
					});
				} else {
					const prepared = await runProviderManualSecretMethod({
						config: enableResult.config,
						baseConfig: cfg,
						choice,
						method: resolved.method,
						apiKey,
						agentDir: params.agentDir,
						workspaceDir
					});
					result = prepared.result;
					preparedConfig = prepared.config;
				}
			} catch {
				return { error: `${resolved.provider.label} could not prepare this credential for app-guided setup.` };
			}
			const modelRef = result.defaultModel ? normalizeAgentModelRefForConfig(result.defaultModel) : "";
			if (!modelRef || result.profiles.length === 0) return { error: `${resolved.provider.label} does not expose a starter model for app-guided setup.` };
			const ref = parseRef(modelRef);
			if (!ref.model) return { error: `${resolved.provider.label} returned an invalid starter model.` };
			const matchingProfile = result.profiles.find((profile) => normalizeProviderId(profile.credential.provider) === normalizeProviderId(ref.provider)) ?? result.profiles[0];
			return {
				runner: "embedded",
				...ref,
				modelRef,
				agentDir: params.agentDir,
				config: preparedConfig,
				authProfileId: matchingProfile.profileId,
				persistModelRef: modelRef,
				manualAuth: {
					profiles: result.profiles,
					configPatch: createMergePatch(enableResult.config, preparedConfig),
					...resolved.provider.pluginId ? { pluginId: resolved.provider.pluginId } : {}
				}
			};
		}
		default: return { error: `Unknown inference choice "${String(kind)}".` };
	}
}
async function runProviderManualSecretMethod(params) {
	const optionKey = params.choice.optionKey;
	const runNonInteractive = params.method.runNonInteractive;
	if (!optionKey || !params.choice.cliOption || !runNonInteractive) throw new Error("Provider does not expose app-guided secret setup.");
	let methodError = "";
	const isolatedRuntime = {
		log: () => {},
		error: (...args) => {
			methodError = args.map(String).join(" ");
		},
		exit: (code) => {
			throw new Error(methodError || `Provider setup exited with code ${code}.`);
		}
	};
	const configured = await runNonInteractive({
		authChoice: params.choice.choiceId,
		config: params.config,
		baseConfig: params.baseConfig,
		opts: {
			[optionKey]: params.apiKey,
			secretInputMode: "plaintext"
		},
		runtime: isolatedRuntime,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		resolveApiKey: async (input) => typeof input.flagValue === "string" && input.flagValue.trim() ? {
			key: input.flagValue.trim(),
			source: "flag"
		} : null,
		toApiKeyCredential: ({ provider, resolved, email, metadata }) => ({
			type: "api_key",
			provider,
			key: resolved.key,
			...email ? { email } : {},
			...metadata ? { metadata } : {}
		})
	});
	if (!configured) throw new Error(methodError || "Provider setup did not produce a configuration.");
	const store = loadPersistedAuthProfileStore(params.agentDir);
	const profiles = Object.entries(store?.profiles ?? {}).map(([profileId, credential]) => ({
		profileId,
		credential
	}));
	const previousModel = resolveAgentModelPrimaryValue(params.config.agents?.defaults?.model);
	const configuredModel = resolveAgentModelPrimaryValue(configured.agents?.defaults?.model);
	const configuredProvider = configuredModel ? parseRef(configuredModel).provider : void 0;
	const configuredModelOwnedByProvider = configuredProvider !== void 0 && normalizeProviderId(configuredProvider) === normalizeProviderId(params.choice.providerId);
	const defaultModel = configuredModel && (configuredModel !== previousModel || configuredModelOwnedByProvider) ? configuredModel : params.method.starterModel;
	if (profiles.length === 0 || !defaultModel) throw new Error("Provider setup did not produce credentials and a starter model.");
	return {
		result: {
			profiles,
			defaultModel
		},
		config: configured
	};
}
/**
* Test one candidate with a real completion, then persist it as the setup
* default. Manual credentials are tested from a temporary auth store and
* copied into the real agent store only after success, so failures leave no trace.
*/
async function activateSetupInference(params) {
	const deps = params.deps ?? {};
	const snapshot = await (deps.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot)();
	const cfg = snapshot.exists && snapshot.valid ? snapshot.runtimeConfig ?? snapshot.config : {};
	const workspace = params.workspace?.trim() ? resolveUserPath(params.workspace) : (await resolveSetupInferenceWorkspace({
		configExists: snapshot.exists,
		configValid: snapshot.valid
	})).workspace;
	const tempDir = await (deps.createTempDir ?? (() => fs.mkdtemp(path.join(os.tmpdir(), "openclaw-setup-inference-"))))();
	const agentDir = (deps.resolveAgentDir ?? resolveAgentDir)(cfg, resolveDefaultAgentId(cfg));
	const testAgentDir = path.join(tempDir, "agent");
	try {
		const plan = await buildTestPlan({
			kind: params.kind,
			...params.authChoice !== void 0 ? { authChoice: params.authChoice } : {},
			...params.apiKey !== void 0 ? { apiKey: params.apiKey } : {},
			cfg,
			workspaceDir: tempDir,
			pluginWorkspaceDir: workspace,
			agentDir: testAgentDir,
			runtime: params.runtime,
			deps
		});
		if ("error" in plan) return {
			ok: false,
			status: "unavailable",
			error: plan.error
		};
		if (plan.manualAuth) {
			if (!await persistManualAuthProfiles(plan.manualAuth.profiles, testAgentDir)) return {
				ok: false,
				status: "unknown",
				error: "Could not update the auth profile store; try again in a moment."
			};
		}
		const test = await runSetupInferenceTest({
			plan,
			tempDir,
			deps
		});
		if (!test.ok) return test;
		if (params.kind === "codex-cli") {
			if ((await (deps.ensureCodexRuntimePlugin ?? (await import("./codex-runtime-plugin-install-gGQJF7pN.js")).ensureCodexRuntimePluginForModelSelection)({
				cfg,
				model: plan.modelRef,
				prompter: createQuickstartNotePrompter(params.runtime),
				runtime: params.runtime,
				workspaceDir: tempDir
			})).required) await (deps.updateConfig ?? (await import("./shared-bL65PgfF.js")).updateConfig)((current) => enablePluginInConfig(current, "codex").config);
		}
		if (plan.manualAuth) {
			const manualAuth = plan.manualAuth;
			if (!await persistManualAuthProfiles(manualAuth.profiles, agentDir)) return {
				ok: false,
				status: "unknown",
				error: "Could not update the auth profile store; try again in a moment."
			};
			await (deps.updateConfig ?? (await import("./shared-bL65PgfF.js")).updateConfig)((current) => applyManualAuthConfig(current, manualAuth));
		}
		const applied = await (deps.applySetup ?? applyCrestodianSetup)({
			workspace,
			...plan.persistModelRef ? { model: plan.persistModelRef } : {},
			surface: params.surface,
			runtime: params.runtime
		});
		return {
			ok: true,
			modelRef: plan.modelRef,
			latencyMs: test.latencyMs,
			lines: applied.lines
		};
	} finally {
		await (deps.removeTempDir ?? ((dir) => fs.rm(dir, {
			recursive: true,
			force: true
		})))(tempDir);
	}
}
function applyManualAuthConfig(config, manualAuth) {
	let enabledConfig = config;
	if (manualAuth.pluginId) {
		const enableResult = enablePluginInConfig(config, manualAuth.pluginId);
		if (!enableResult.enabled) throw new Error(`Provider plugin ${manualAuth.pluginId} is ${enableResult.reason}.`);
		enabledConfig = enableResult.config;
	}
	return applyMergePatch(enabledConfig, manualAuth.configPatch);
}
async function persistManualAuthProfiles(profiles, agentDir) {
	return await updateAuthProfileStoreWithLock({
		agentDir,
		saveOptions: {
			filterExternalAuthProfiles: false,
			syncExternalCli: false
		},
		updater: (store) => {
			for (const profile of profiles) store.profiles[profile.profileId] = normalizeAuthProfileCredential(profile.credential);
			return true;
		}
	}) !== null;
}
async function runSetupInferenceTest(params) {
	const { plan, tempDir, deps } = params;
	const runId = `setup-inference-${randomUUID()}`;
	const sessionId = `${runId}-session`;
	const sessionFile = path.join(tempDir, "session.jsonl");
	const timeoutMs = deps.timeoutMs ?? 9e4;
	const started = Date.now();
	try {
		let result;
		if (plan.runner === "cli") result = await (deps.runCliAgent ?? (await import("./cli-runner-BK2Mhugs.js")).runCliAgent)({
			sessionId,
			sessionKey: `temp:setup-inference:${runId}`,
			agentId: "crestodian",
			trigger: "manual",
			sessionFile,
			workspaceDir: tempDir,
			...plan.agentDir ? { agentDir: plan.agentDir } : {},
			config: plan.config,
			prompt: SETUP_INFERENCE_TEST_PROMPT,
			provider: plan.provider,
			model: plan.model,
			timeoutMs,
			runId,
			messageChannel: "crestodian",
			messageProvider: "crestodian",
			cleanupCliLiveSessionOnRunEnd: true
		});
		else result = await (deps.runEmbeddedAgent ?? (await import("./embedded-agent-75K82y9l.js")).runEmbeddedAgent)({
			sessionId,
			sessionKey: `temp:setup-inference:${runId}`,
			agentId: "crestodian",
			trigger: "manual",
			sessionFile,
			workspaceDir: tempDir,
			...plan.agentDir ? { agentDir: plan.agentDir } : {},
			config: plan.config,
			prompt: SETUP_INFERENCE_TEST_PROMPT,
			provider: plan.provider,
			model: plan.model,
			...plan.authProfileId ? {
				authProfileId: plan.authProfileId,
				authProfileIdSource: "user"
			} : {},
			...plan.agentHarnessId ? {
				agentHarnessId: plan.agentHarnessId,
				cleanupBundleMcpOnRunEnd: true
			} : {},
			timeoutMs,
			runId,
			lane: `setup-inference:${plan.provider}`,
			thinkLevel: "off",
			reasoningLevel: "off",
			verboseLevel: "off",
			streamParams: { maxTokens: SETUP_INFERENCE_TEST_MAX_TOKENS },
			disableTools: true,
			modelRun: true,
			messageChannel: "crestodian",
			messageProvider: "crestodian"
		});
		if (!extractRunText(result)?.trim()) return {
			ok: false,
			status: "format",
			error: "The model started but did not send a reply. Try again or pick another option."
		};
		return {
			ok: true,
			latencyMs: Date.now() - started
		};
	} catch (error) {
		const described = describeFailoverError(error);
		const { redactSecrets } = await import("./format-Cnksu9YH.js");
		return {
			ok: false,
			status: mapFailoverReasonToSetupStatus(described.reason),
			error: redactSecrets(described.message)
		};
	}
}
//#endregion
export { activateSetupInference, detectSetupInference };
