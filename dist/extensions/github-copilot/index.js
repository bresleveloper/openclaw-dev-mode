import { h as resolveDefaultSecretProviderAlias } from "../../ref-contract-BVi3ykLT.mjs";
import { a as coerceSecretRef } from "../../types.secrets-B5xWSzLp.mjs";
import { t as normalizeOptionalSecretInput } from "../../normalize-secret-input-Df_qhWv_.mjs";
import { p as listProfilesForProvider } from "../../order-BQhYF772.mjs";
import { n as ensureAuthProfileStore } from "../../store-runtime-BcoYkagW.mjs";
import { t as applyAuthProfileConfig } from "../../provider-auth-helpers-CVzRzfCc.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import "../../provider-auth-eHeoP8se.mjs";
import { r as upsertAuthProfileWithLockCompat } from "../../provider-auth-write-compat-Bqnhrgo_.mjs";
import { i as resolveGithubCopilotDomain, r as normalizeGithubCopilotDomain, t as PUBLIC_GITHUB_COPILOT_DOMAIN } from "../../domain-Bbe8oFEv.mjs";
import { t as DEFAULT_COPILOT_MODEL } from "../../model-metadata-2b9VF8l_.mjs";
import { t as buildCopilotRuntimeHeaders } from "../../runtime-identity-BaI10xhs.mjs";
import { n as PROVIDER_ID } from "../../models-4bPcKrk0.mjs";
import { a as refreshGithubCopilotOAuth, i as parseGithubCopilotApiKey, n as formatGithubCopilotApiKey, r as loginGithubCopilotOAuth, t as buildGithubCopilotAuthDoctorHint } from "../../oauth-C6Y2gNjI.mjs";
import { t as resolveFirstGithubToken } from "../../auth-wtN2B4YS.mjs";
import { t as createGithubCopilotDynamicModelHooks } from "../../dynamic-models-CVqVNo1q.mjs";
import { t as githubCopilotMemoryEmbeddingProviderAdapter } from "../../embeddings-DU2Tkakx.mjs";
import { t as resolveThinkingProfile } from "../../provider-policy-api-D32-FhZg.mjs";
import { n as sanitizeGithubCopilotReplayHistory, t as buildGithubCopilotReplayPolicy } from "../../replay-policy-CAManWnX.mjs";
import { t as wrapCopilotProviderStream } from "../../stream-BeO17Moc.mjs";
//#region extensions/github-copilot/index.ts
const COPILOT_ENV_VAR = "COPILOT_GITHUB_TOKEN";
const DEFAULT_COPILOT_PROFILE_ID = "github-copilot:github";
const COPILOT_SECRET_STORE_NAME_PREFIX = "GITHUB_COPILOT_TOKEN";
async function loadGithubCopilotRuntime() {
	return await import("./register.runtime.js");
}
function resolveCopilotConfiguredPrimary(cfg) {
	const existingModel = (cfg.agents?.defaults)?.model;
	return typeof existingModel === "string" ? existingModel.trim() : typeof existingModel === "object" && typeof existingModel?.primary === "string" ? existingModel.primary.trim() : "";
}
function applyCopilotDefaultModel(cfg, modelRef) {
	if (resolveCopilotConfiguredPrimary(cfg)) return cfg;
	const defaults = cfg.agents?.defaults;
	const existingModel = defaults?.model;
	const fallbacks = typeof existingModel === "object" && existingModel !== null && "fallbacks" in existingModel ? existingModel.fallbacks : void 0;
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...defaults,
				model: {
					...fallbacks ? { fallbacks } : void 0,
					primary: modelRef
				},
				models: {
					...defaults?.models,
					[modelRef]: defaults?.models?.[modelRef] ?? {}
				}
			}
		}
	};
}
function resolveExistingCopilotTokenProfileId(agentDir) {
	const authStore = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
	return listProfilesForProvider(authStore, PROVIDER_ID).find((profileId) => {
		const profile = authStore.profiles[profileId];
		if (profile?.type !== "token") return false;
		return Boolean(normalizeOptionalSecretInput(profile.token) || coerceSecretRef(profile.tokenRef)?.id.trim());
	});
}
function resolveExistingCopilotAuthResult(agentDir) {
	const profileId = resolveExistingCopilotTokenProfileId(agentDir);
	if (!profileId) return null;
	const credential = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false }).profiles[profileId];
	if (!credential || credential.type !== "token") return null;
	return { profiles: [{
		profileId,
		credential
	}] };
}
async function resolveInteractiveCopilotStarterModel(params) {
	if (params.ctx.credentialOnly) return {};
	try {
		const { resolveCopilotStarterModel } = await loadGithubCopilotRuntime();
		return { defaultModel: await resolveCopilotStarterModel({
			githubToken: params.githubToken,
			env: params.ctx.env ?? process.env,
			githubDomain: params.githubDomain,
			config: params.ctx.config
		}) };
	} catch {
		return { notes: ["GitHub Copilot authentication succeeded, but no eligible live model could be selected. Choose a model after checking your Copilot plan and organization policy."] };
	}
}
function buildGithubCopilotDomainConfigPatch(domain) {
	const normalized = normalizeGithubCopilotDomain(domain);
	return { models: { providers: { [PROVIDER_ID]: { params: { githubDomain: normalized } } } } };
}
function clearGithubCopilotDomainConfigPatch() {
	return { models: { providers: { [PROVIDER_ID]: { params: { githubDomain: void 0 } } } } };
}
function applyGithubCopilotDomainToConfig(config, domain, previousDomain) {
	const isEnterprise = domain !== PUBLIC_GITHUB_COPILOT_DOMAIN;
	if (!isEnterprise && !(!isEnterprise && previousDomain !== "github.com")) return config;
	const models = config.models ?? {};
	const providers = models.providers ?? {};
	const provider = providers[PROVIDER_ID];
	const params = {};
	if (provider?.params) Object.assign(params, provider.params);
	if (isEnterprise) params.githubDomain = domain;
	else delete params.githubDomain;
	const nextProviders = { ...providers };
	if (provider) nextProviders[PROVIDER_ID] = {
		...provider,
		params
	};
	else Object.assign(nextProviders, { [PROVIDER_ID]: { params } });
	return {
		...config,
		models: {
			...models,
			providers: nextProviders
		}
	};
}
async function resolveCopilotNonInteractiveToken(ctx, flagValue) {
	const referenceMode = ctx.opts.secretInputMode === "ref";
	const resolved = await ctx.resolveApiKey({
		provider: PROVIDER_ID,
		...referenceMode ? {} : { flagValue },
		flagName: "--github-copilot-token",
		envVar: COPILOT_ENV_VAR,
		envVarName: COPILOT_ENV_VAR,
		allowProfile: false,
		required: false
	});
	if (!resolved && referenceMode && flagValue) {
		ctx.runtime.error("--github-copilot-token cannot be used with --secret-input-mode ref unless COPILOT_GITHUB_TOKEN is set in env. Set COPILOT_GITHUB_TOKEN and omit --github-copilot-token, or use --secret-input-mode plaintext.");
		ctx.runtime.exit(1);
	}
	return resolved;
}
async function runGitHubCopilotNonInteractiveAuth(ctx) {
	const opts = ctx.opts;
	const flagValue = normalizeOptionalSecretInput(opts?.githubCopilotToken);
	const resolved = await resolveCopilotNonInteractiveToken(ctx, flagValue);
	let profileId = DEFAULT_COPILOT_PROFILE_ID;
	let githubToken = resolved?.key ?? "";
	if (resolved) {
		if (ctx.opts.secretInputMode === "ref" && resolved.source === "env" && !resolved.envVarName) {
			ctx.runtime.error(["--secret-input-mode ref requires an explicit environment variable for provider \"github-copilot\".", "Set COPILOT_GITHUB_TOKEN in env and retry, or use --secret-input-mode plaintext."].join("\n"));
			ctx.runtime.exit(1);
			return null;
		}
	} else {
		if (flagValue && ctx.opts.secretInputMode === "ref") return null;
		const existingProfileId = resolveExistingCopilotTokenProfileId(ctx.agentDir);
		if (!existingProfileId) {
			ctx.runtime.error("Missing --github-copilot-token (or COPILOT_GITHUB_TOKEN env var) for --auth-choice github-copilot.");
			ctx.runtime.exit(1);
			return null;
		}
		profileId = existingProfileId;
		githubToken = (await resolveFirstGithubToken({
			agentDir: ctx.agentDir,
			config: ctx.config,
			env: process.env,
			profileId
		})).githubToken;
	}
	const resolvedDomain = resolveGithubCopilotDomain({ config: ctx.config });
	const previousDomain = resolveGithubCopilotDomain({
		env: {},
		config: ctx.config
	});
	const configWithDomain = applyGithubCopilotDomainToConfig(ctx.config, resolvedDomain, previousDomain);
	let starterModel;
	if (!resolveCopilotConfiguredPrimary(configWithDomain)) {
		const { resolveCopilotStarterModel } = await loadGithubCopilotRuntime();
		starterModel = await resolveCopilotStarterModel({
			githubToken,
			env: process.env,
			githubDomain: resolvedDomain,
			config: configWithDomain
		});
	} else if (resolved) {
		const { resolveCopilotRuntimeAuth } = await loadGithubCopilotRuntime();
		await resolveCopilotRuntimeAuth({
			githubToken,
			env: process.env,
			githubDomain: resolvedDomain,
			config: configWithDomain
		});
	}
	if (resolved) {
		const useTokenRef = ctx.opts.secretInputMode === "ref" && resolved.source === "env";
		await upsertAuthProfileWithLockCompat({
			profileId,
			credential: {
				type: "token",
				provider: PROVIDER_ID,
				...useTokenRef ? { tokenRef: {
					source: "env",
					provider: resolveDefaultSecretProviderAlias(ctx.baseConfig, "env", { preferFirstProviderForSource: true }),
					id: resolved.envVarName
				} } : { token: resolved.key }
			},
			agentDir: ctx.agentDir
		});
	}
	const configWithAuth = applyAuthProfileConfig(configWithDomain, {
		profileId,
		provider: PROVIDER_ID,
		mode: "token"
	});
	return starterModel ? applyCopilotDefaultModel(configWithAuth, starterModel) : configWithAuth;
}
var github_copilot_default = definePluginEntry({
	id: "github-copilot",
	name: "GitHub Copilot Provider",
	description: "Bundled GitHub Copilot provider plugin",
	register(api) {
		const dynamicModels = createGithubCopilotDynamicModelHooks();
		async function promptForEnterpriseDomain(ctx) {
			const envDomain = ctx.env?.COPILOT_GITHUB_DOMAIN?.trim();
			if (envDomain) {
				const normalizedEnv = normalizeGithubCopilotDomain(envDomain);
				await ctx.prompter.note(`Using the GitHub Enterprise domain from COPILOT_GITHUB_DOMAIN (${normalizedEnv}). Unset it to enter a different domain interactively.`, "GitHub Copilot");
				return normalizedEnv;
			}
			const current = resolveGithubCopilotDomain({
				env: ctx.env,
				config: ctx.config
			});
			const value = await ctx.prompter.text({
				message: "GitHub Enterprise domain (data residency)",
				placeholder: "your-org.ghe.com",
				initialValue: current === "github.com" ? "" : current,
				validate: (raw) => {
					const trimmed = raw.trim();
					if (!trimmed) return "Enter your GitHub Enterprise domain (for example your-org.ghe.com).";
					if (normalizeGithubCopilotDomain(trimmed) === "github.com" && trimmed.toLowerCase() !== "github.com") {
						if (trimmed.toLowerCase().endsWith(".ghe.com")) return "Enter your tenant root (for example your-org.ghe.com), not a service host like api.your-org.ghe.com — service endpoints are derived automatically.";
						return "Enter a github.com or *.ghe.com hostname without scheme or path (for example your-org.ghe.com).";
					}
				}
			});
			return normalizeGithubCopilotDomain(value);
		}
		async function runGitHubCopilotDeviceAuth(ctx, domain) {
			const normalizedDomain = normalizeGithubCopilotDomain(domain);
			const isEnterprise = normalizedDomain !== PUBLIC_GITHUB_COPILOT_DOMAIN;
			const previousDomain = resolveGithubCopilotDomain({
				env: {},
				config: ctx.config
			});
			const domainChanged = previousDomain !== normalizedDomain;
			const configPatch = isEnterprise ? buildGithubCopilotDomainConfigPatch(normalizedDomain) : previousDomain !== "github.com" ? clearGithubCopilotDomainConfigPatch() : void 0;
			const suppliedToken = ctx.opts?.tokenProvider === "github-copilot" ? normalizeOptionalSecretInput(ctx.opts.token) : void 0;
			if (suppliedToken) return {
				profiles: [{
					profileId: DEFAULT_COPILOT_PROFILE_ID,
					credential: {
						type: "token",
						provider: PROVIDER_ID,
						token: suppliedToken
					},
					...ctx.secretInputMode === "plaintext" ? {} : { secretStorage: {
						kind: "store",
						namePrefix: COPILOT_SECRET_STORE_NAME_PREFIX
					} }
				}],
				...!ctx.credentialOnly ? { defaultModel: DEFAULT_COPILOT_MODEL } : {},
				...configPatch ? { configPatch } : {}
			};
			const existing = ctx.credentialOnly ? null : resolveExistingCopilotAuthResult(ctx.agentDir);
			if (existing && !domainChanged) {
				if (!await ctx.prompter.confirm({
					message: "GitHub Copilot auth already exists. Re-run login?",
					initialValue: false
				})) {
					const profileId = existing.profiles[0]?.profileId;
					const { githubToken } = await resolveFirstGithubToken({
						agentDir: ctx.agentDir,
						config: ctx.config,
						env: ctx.env ?? process.env,
						...profileId ? { profileId } : {}
					});
					const starter = await resolveInteractiveCopilotStarterModel({
						ctx,
						githubToken,
						githubDomain: normalizedDomain
					});
					return {
						...existing,
						...starter,
						...configPatch ? { configPatch } : {}
					};
				}
			} else if (existing && domainChanged) await ctx.prompter.note(isEnterprise ? `Switching to ${normalizedDomain} requires a new tenant login to authorize Copilot for that domain.` : "Switching back to github.com requires a new login to authorize Copilot for the public domain.", "GitHub Copilot");
			await ctx.prompter.note([isEnterprise ? `This will open a GitHub Enterprise device login (${normalizedDomain}) to authorize Copilot.` : "This will open a GitHub device login to authorize Copilot.", "Requires an active GitHub Copilot subscription."].join("\n"), "GitHub Copilot");
			const { runGitHubCopilotDeviceFlow } = await import("./login.js");
			const result = await runGitHubCopilotDeviceFlow({
				showCode: async ({ verificationUrl, userCode, expiresInMs }) => {
					const expiresInMinutes = Math.max(1, Math.round(expiresInMs / 6e4));
					if (ctx.isRemote) await ctx.openUrl(verificationUrl);
					if (ctx.prompter.deviceCode) {
						await ctx.prompter.deviceCode({
							title: "Authorize GitHub Copilot",
							code: userCode,
							expiresInMinutes,
							message: "Enter this one-time code to authorize Copilot."
						});
						return;
					}
					await ctx.prompter.note([
						"Open this URL in your browser and enter the code below.",
						`URL: <${verificationUrl}>`,
						`Code: ${userCode}`,
						`Code expires in ${expiresInMinutes} minutes. Never share it.`,
						"",
						"If a browser does not open automatically after you continue, copy the URL manually."
					].join("\n"), "Authorize GitHub Copilot");
				},
				...ctx.isRemote ? {} : { openUrl: async (url) => {
					await ctx.openUrl(url);
				} },
				...ctx.signal ? { signal: ctx.signal } : {},
				...ctx.assertCurrent ? { assertCurrent: ctx.assertCurrent } : {}
			}, normalizedDomain);
			if (result.status === "access_denied") {
				await ctx.prompter.note("GitHub Copilot login was cancelled.", "GitHub Copilot");
				return { profiles: [] };
			}
			if (result.status === "expired") {
				await ctx.prompter.note("The GitHub device code expired. Retry login to get a new code.", "GitHub Copilot");
				return { profiles: [] };
			}
			const starter = await resolveInteractiveCopilotStarterModel({
				ctx,
				githubToken: result.accessToken,
				githubDomain: normalizedDomain
			});
			const persistInline = ctx.secretInputMode === "plaintext";
			const notes = [...starter.notes ?? [], ...persistInline ? ["Plaintext secret input mode was selected, so the GitHub Copilot token will remain inline in the auth profile and openclaw secrets audit --check will report it."] : []];
			return {
				profiles: [{
					profileId: DEFAULT_COPILOT_PROFILE_ID,
					credential: {
						type: "token",
						provider: PROVIDER_ID,
						token: result.accessToken
					},
					...!persistInline ? { secretStorage: {
						kind: "store",
						namePrefix: COPILOT_SECRET_STORE_NAME_PREFIX
					} } : {}
				}],
				...starter.defaultModel ? { defaultModel: starter.defaultModel } : {},
				...notes.length > 0 ? { notes } : {},
				...configPatch ? { configPatch } : {}
			};
		}
		async function runGitHubCopilotAuth(ctx) {
			return await runGitHubCopilotDeviceAuth(ctx, PUBLIC_GITHUB_COPILOT_DOMAIN);
		}
		async function runGitHubCopilotEnterpriseAuth(ctx) {
			const domain = await promptForEnterpriseDomain(ctx);
			if (!domain) {
				await ctx.prompter.note("Enterprise login cancelled.", "GitHub Copilot");
				return { profiles: [] };
			}
			if (domain === "github.com") {
				await ctx.prompter.note("github.com is the default — use the standard GitHub Copilot login instead of the enterprise (data residency) option.", "GitHub Copilot");
				return { profiles: [] };
			}
			return await runGitHubCopilotDeviceAuth(ctx, domain);
		}
		api.registerEmbeddingProvider(githubCopilotMemoryEmbeddingProviderAdapter);
		api.registerProvider({
			id: PROVIDER_ID,
			label: "GitHub Copilot",
			docsPath: "/providers/models",
			envVars: [COPILOT_ENV_VAR],
			auth: [{
				id: "device",
				label: "GitHub device login",
				hint: "Browser device-code flow",
				kind: "device_code",
				starterModel: DEFAULT_COPILOT_MODEL,
				run: async (ctx) => await runGitHubCopilotAuth(ctx),
				runNonInteractive: async (ctx) => await runGitHubCopilotNonInteractiveAuth(ctx)
			}, {
				id: "device-enterprise",
				label: "GitHub Enterprise device login (data residency)",
				hint: "Device-code flow against your *.ghe.com tenant",
				kind: "device_code",
				run: async (ctx) => await runGitHubCopilotEnterpriseAuth(ctx),
				wizard: {
					choiceId: "github-copilot-enterprise",
					choiceLabel: "GitHub Copilot (Enterprise / data residency)",
					choiceHint: "Device login against your GitHub Enterprise (*.ghe.com) tenant",
					methodId: "device-enterprise",
					assistantPriority: 2,
					modelSelection: { promptWhenAuthChoiceProvided: true }
				}
			}],
			wizard: { setup: {
				choiceId: "github-copilot",
				choiceLabel: "GitHub Copilot",
				choiceHint: "Device login with your GitHub account",
				methodId: "device",
				assistantPriority: 1,
				modelSelection: { promptWhenAuthChoiceProvided: true }
			} },
			catalog: {
				order: "late",
				run: dynamicModels.runCatalog
			},
			prepareDynamicModel: dynamicModels.prepareDynamicModel,
			resolveDynamicModel: dynamicModels.resolveDynamicModel,
			preferRuntimeResolvedModel: dynamicModels.preferRuntimeResolvedModel,
			formatApiKey: formatGithubCopilotApiKey,
			loginOAuth: loginGithubCopilotOAuth,
			refreshOAuth: async (credential) => refreshGithubCopilotOAuth(credential),
			buildAuthDoctorHint: buildGithubCopilotAuthDoctorHint,
			wrapStreamFn: wrapCopilotProviderStream,
			buildReplayPolicy: buildGithubCopilotReplayPolicy,
			sanitizeReplayHistory: sanitizeGithubCopilotReplayHistory,
			resolveThinkingProfile,
			prepareRuntimeAuth: async (ctx) => {
				const source = parseGithubCopilotApiKey(ctx.apiKey);
				const { resolveCopilotRuntimeAuth } = await loadGithubCopilotRuntime();
				const auth = await resolveCopilotRuntimeAuth({
					githubToken: source.githubToken,
					env: ctx.env,
					githubDomain: resolveGithubCopilotDomain({
						env: ctx.env,
						explicit: source.githubDomain,
						config: ctx.config
					})
				});
				return {
					apiKey: auth.apiKey,
					baseUrl: auth.baseUrl,
					request: { headers: buildCopilotRuntimeHeaders({
						config: ctx.config,
						headers: ctx.model.headers
					}) }
				};
			},
			resolveUsageAuth: async (ctx) => await ctx.resolveOAuthToken(),
			fetchUsageSnapshot: async (ctx) => {
				const source = parseGithubCopilotApiKey(ctx.token);
				const { fetchCopilotUsage } = await loadGithubCopilotRuntime();
				return await fetchCopilotUsage(source.githubToken, ctx.timeoutMs, ctx.fetchFn, resolveGithubCopilotDomain({
					env: ctx.env,
					explicit: source.githubDomain,
					config: ctx.config
				}));
			}
		});
	}
});
//#endregion
export { github_copilot_default as default };
