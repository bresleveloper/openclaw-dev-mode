import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { C as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CJQ8TR--.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { c as resolveClaudeModelIdentity, d as supportsClaudeNativeMaxEffort, f as supportsClaudeNativeXhighEffort, s as resolveClaudeFable5ModelIdentity, u as supportsClaudeAdaptiveThinking } from "./src-M7TBQdDX.js";
import { n as resolveClaudeThinkingProfile } from "./provider-claude-thinking-s2PAP2Wu.js";
import { t as parseDurationMs } from "./parse-duration-Da6doDTX.js";
import { s as upsertAuthProfileWithLock } from "./profiles-DswMRdru.js";
import { n as listProfilesForProvider } from "./profile-list-CtT2BW_g.js";
import { n as suggestOAuthProfileIdForLegacyDefault } from "./repair-DBYGZN0_.js";
import "./number-runtime-DBLVDypr.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { n as NATIVE_ANTHROPIC_REPLAY_HOOKS, u as cloneFirstTemplateModel } from "./provider-model-shared-pp09751S.js";
import { n as validateAnthropicSetupToken, t as buildTokenProfileId } from "./provider-auth-token-CH0Wu93I.js";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-sTwxNMVI.js";
import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-BJsVS391.js";
import "./provider-auth-DKbeFxjY.js";
import "./cli-runtime-Comrp7kq.js";
import { o as fetchClaudeUsage } from "./provider-usage-C1zSp9Hk.js";
import { n as readClaudeCliCredentialsForSetup, r as readClaudeCliCredentialsForSetupNonInteractive, t as readClaudeCliCredentialsForRuntime } from "./cli-auth-seam-BrT7pla9.js";
import { n as CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS, r as CLAUDE_CLI_DEFAULT_MODEL_REF, t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-DrUvDt2r.js";
import { n as CLAUDE_CLI_OFF_THINKING_PROFILE } from "./cli-shared-B4FSWhaK.js";
import { t as buildAnthropicCliBackend } from "./cli-backend-CkQ4PBJi.js";
import { t as buildClaudeCliCatalogEntries } from "./cli-catalog-DrFnMS-C.js";
import { t as buildAnthropicCliMigrationResult } from "./cli-migration-DqMymPfz.js";
import { n as normalizeAnthropicProviderConfigForProvider, t as applyAnthropicConfigDefaults } from "./config-defaults-BboXB6yv.js";
import { t as anthropicMediaUnderstandingProvider } from "./media-understanding-provider-BoUfXW5D.js";
import { l as wrapAnthropicProviderStream } from "./stream-wrappers-BSoC7VeV.js";
//#region extensions/anthropic/register.runtime.ts
/**
* Anthropic provider runtime registration. It owns API-key/setup-token/Claude
* CLI auth, dynamic model normalization, usage auth, media, and stream wrappers.
*/
const PROVIDER_ID = "anthropic";
const DEFAULT_ANTHROPIC_MODEL = "anthropic/claude-opus-4-8";
const ANTHROPIC_OPUS_48_MODEL_ID = "claude-opus-4-8";
const ANTHROPIC_OPUS_48_DOT_MODEL_ID = "claude-opus-4.8";
const ANTHROPIC_OPUS_47_MODEL_ID = "claude-opus-4-7";
const ANTHROPIC_OPUS_47_DOT_MODEL_ID = "claude-opus-4.7";
const ANTHROPIC_GA_1M_CONTEXT_TOKENS = 1048576;
const ANTHROPIC_FABLE_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS = 128e3;
const ANTHROPIC_OPUS_46_MODEL_ID = "claude-opus-4-6";
const ANTHROPIC_OPUS_46_DOT_MODEL_ID = "claude-opus-4.6";
const ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS = [ANTHROPIC_OPUS_46_MODEL_ID, ANTHROPIC_OPUS_46_DOT_MODEL_ID];
const ANTHROPIC_SONNET_46_MODEL_ID = "claude-sonnet-4-6";
const ANTHROPIC_SONNET_46_DOT_MODEL_ID = "claude-sonnet-4.6";
const ANTHROPIC_SETUP_TOKEN_NOTE_LINES = [
	"Anthropic setup-token auth is supported in OpenClaw.",
	"OpenClaw prefers Claude CLI reuse when it is available on the host.",
	"Anthropic staff told us this OpenClaw path is allowed again.",
	`If you want a direct API billing path instead, use ${formatCliCommand("openclaw models auth login --provider anthropic --method api-key --set-default")} or ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")}.`
];
const CLAUDE_CLI_CANONICAL_ALLOWLIST_REFS = CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS.map((ref) => ref.startsWith(`claude-cli/`) ? `anthropic/${ref.slice(CLAUDE_CLI_BACKEND_ID.length + 1)}` : ref);
async function upsertAuthProfileWithLockOrThrow(params) {
	if (!await upsertAuthProfileWithLock(params)) throw new Error("Failed to update auth profile store; the auth store lock may be busy. Wait a moment and retry.");
}
const CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF = CLAUDE_CLI_DEFAULT_MODEL_REF.startsWith(`claude-cli/`) ? `anthropic/${CLAUDE_CLI_DEFAULT_MODEL_REF.slice(CLAUDE_CLI_BACKEND_ID.length + 1)}` : CLAUDE_CLI_DEFAULT_MODEL_REF;
function normalizeAnthropicSetupTokenInput(value) {
	return value.replaceAll(/\s+/g, "").trim();
}
function resolveAnthropicSetupTokenProfileId(rawProfileId) {
	if (typeof rawProfileId === "string") {
		const trimmed = rawProfileId.trim();
		if (trimmed.length > 0) {
			if (trimmed.startsWith(`${PROVIDER_ID}:`)) return trimmed;
			return buildTokenProfileId({
				provider: PROVIDER_ID,
				name: trimmed
			});
		}
	}
	return `${PROVIDER_ID}:default`;
}
function resolveAnthropicSetupTokenExpiry(rawExpiresIn) {
	if (typeof rawExpiresIn !== "string" || rawExpiresIn.trim().length === 0) return;
	return resolveExpiresAtMsFromDurationMs(parseDurationMs(rawExpiresIn.trim(), { defaultUnit: "d" }));
}
async function runAnthropicSetupTokenAuth(ctx) {
	const token = (typeof ctx.opts?.token === "string" && ctx.opts.token.trim().length > 0 ? normalizeAnthropicSetupTokenInput(ctx.opts.token) : void 0) ?? normalizeAnthropicSetupTokenInput(await ctx.prompter.text({
		message: "Paste Anthropic setup-token",
		validate: (value) => validateAnthropicSetupToken(normalizeAnthropicSetupTokenInput(value))
	}));
	const tokenError = validateAnthropicSetupToken(token);
	if (tokenError) throw new Error(tokenError);
	const profileId = resolveAnthropicSetupTokenProfileId(ctx.opts?.tokenProfileId);
	const expires = resolveAnthropicSetupTokenExpiry(ctx.opts?.tokenExpiresIn);
	return {
		profiles: [{
			profileId,
			credential: {
				type: "token",
				provider: PROVIDER_ID,
				token,
				...expires ? { expires } : {}
			}
		}],
		defaultModel: DEFAULT_ANTHROPIC_MODEL,
		notes: [...ANTHROPIC_SETUP_TOKEN_NOTE_LINES]
	};
}
async function runAnthropicSetupTokenNonInteractive(ctx) {
	const rawToken = typeof ctx.opts.token === "string" ? normalizeAnthropicSetupTokenInput(ctx.opts.token) : "";
	const tokenError = validateAnthropicSetupToken(rawToken);
	if (tokenError) {
		ctx.runtime.error(["Anthropic setup-token auth requires --token with a valid setup-token.", tokenError].join("\n"));
		ctx.runtime.exit(1);
		return null;
	}
	const profileId = resolveAnthropicSetupTokenProfileId(ctx.opts.tokenProfileId);
	const expires = resolveAnthropicSetupTokenExpiry(ctx.opts.tokenExpiresIn);
	await upsertAuthProfileWithLockOrThrow({
		profileId,
		credential: {
			type: "token",
			provider: PROVIDER_ID,
			token: rawToken,
			...expires ? { expires } : {}
		},
		agentDir: ctx.agentDir
	});
	ctx.runtime.log(ANTHROPIC_SETUP_TOKEN_NOTE_LINES[0]);
	ctx.runtime.log(ANTHROPIC_SETUP_TOKEN_NOTE_LINES[1]);
	const withProfile = applyAuthProfileConfig(ctx.config, {
		profileId,
		provider: PROVIDER_ID,
		mode: "token"
	});
	const existingModelConfig = withProfile.agents?.defaults?.model && typeof withProfile.agents.defaults.model === "object" ? withProfile.agents.defaults.model : {};
	return {
		...withProfile,
		agents: {
			...withProfile.agents,
			defaults: {
				...withProfile.agents?.defaults,
				model: {
					...existingModelConfig,
					primary: DEFAULT_ANTHROPIC_MODEL
				}
			}
		}
	};
}
function resolveAnthropic46ForwardCompatModel(params) {
	const trimmedModelId = params.ctx.modelId.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
	if (trimmedModelId !== lower) return;
	if (!(lower === params.dashModelId || lower === params.dotModelId || lower.startsWith(`${params.dashModelId}-`) || lower.startsWith(`${params.dotModelId}-`))) return;
	const templateIds = [];
	if (lower.startsWith(params.dashModelId)) templateIds.push(lower.replace(params.dashModelId, params.dashTemplateId));
	if (lower.startsWith(params.dotModelId)) templateIds.push(lower.replace(params.dotModelId, params.dotTemplateId));
	templateIds.push(...params.fallbackTemplateIds);
	return cloneFirstTemplateModel({
		providerId: PROVIDER_ID,
		modelId: trimmedModelId,
		templateIds,
		ctx: params.ctx,
		patch: normalizeLowercaseStringOrEmpty(params.ctx.provider) === "claude-cli" ? { provider: CLAUDE_CLI_BACKEND_ID } : void 0
	});
}
function buildAnthropicForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
	const normalizedProvider = normalizeLowercaseStringOrEmpty(ctx.provider);
	if (trimmedModelId !== lower || !matchesAnthropicModernModel(lower)) return;
	if (isAnthropicFable5Model(lower) && normalizedProvider !== PROVIDER_ID) return;
	return {
		id: trimmedModelId,
		name: trimmedModelId,
		provider: normalizedProvider === "claude-cli" ? CLAUDE_CLI_BACKEND_ID : PROVIDER_ID,
		api: "anthropic-messages",
		baseUrl: "https://api.anthropic.com",
		reasoning: true,
		input: ["text", "image"],
		cost: isAnthropicFable5Model(trimmedModelId) ? {
			input: 10,
			output: 50,
			cacheRead: 1,
			cacheWrite: 12.5
		} : {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: resolveAnthropicFixedContextWindow(trimmedModelId) ?? 2e5,
		maxTokens: isAnthropic128kOutputModel(trimmedModelId) ? ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS : 64e3,
		...supportsClaudeNativeXhighEffort({ id: trimmedModelId }) ? { thinkingLevelMap: {
			xhigh: "xhigh",
			max: "max"
		} } : supportsAnthropicNativeMaxEffort(trimmedModelId) ? { thinkingLevelMap: { max: "max" } } : {}
	};
}
function resolveAnthropicForwardCompatModel(ctx) {
	return resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_OPUS_48_MODEL_ID,
		dotModelId: ANTHROPIC_OPUS_48_DOT_MODEL_ID,
		dashTemplateId: ANTHROPIC_OPUS_47_MODEL_ID,
		dotTemplateId: ANTHROPIC_OPUS_47_DOT_MODEL_ID,
		fallbackTemplateIds: ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS
	}) ?? resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_OPUS_47_MODEL_ID,
		dotModelId: ANTHROPIC_OPUS_47_DOT_MODEL_ID,
		dashTemplateId: ANTHROPIC_OPUS_46_MODEL_ID,
		dotTemplateId: ANTHROPIC_OPUS_46_DOT_MODEL_ID,
		fallbackTemplateIds: ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS
	}) ?? resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_OPUS_46_MODEL_ID,
		dotModelId: ANTHROPIC_OPUS_46_DOT_MODEL_ID,
		dashTemplateId: ANTHROPIC_OPUS_47_MODEL_ID,
		dotTemplateId: ANTHROPIC_OPUS_46_MODEL_ID,
		fallbackTemplateIds: ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS
	}) ?? resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_SONNET_46_MODEL_ID,
		dotModelId: ANTHROPIC_SONNET_46_DOT_MODEL_ID,
		dashTemplateId: ANTHROPIC_SONNET_46_MODEL_ID,
		dotTemplateId: ANTHROPIC_SONNET_46_MODEL_ID,
		fallbackTemplateIds: [ANTHROPIC_SONNET_46_MODEL_ID, ANTHROPIC_SONNET_46_DOT_MODEL_ID]
	}) ?? buildAnthropicForwardCompatModel(ctx);
}
function isAnthropicGa1MModel(modelId) {
	return supportsClaudeAdaptiveThinking({ id: modelId });
}
function isAnthropicFable5Model(modelId) {
	return resolveClaudeFable5ModelIdentity({ id: modelId }) !== void 0;
}
function resolveAnthropicFixedContextWindow(modelId) {
	if (isAnthropicFable5Model(modelId)) return ANTHROPIC_FABLE_CONTEXT_TOKENS;
	return isAnthropicGa1MModel(modelId) ? ANTHROPIC_GA_1M_CONTEXT_TOKENS : void 0;
}
function isAnthropic128kOutputModel(modelId) {
	if (isAnthropicFable5Model(modelId)) return true;
	return /^claude-opus-4-8(?=$|[^a-z0-9])/.test(resolveClaudeModelIdentity({ id: modelId }));
}
function isAnthropicOpus47OrNewerModel(modelId) {
	return supportsClaudeNativeXhighEffort({ id: modelId }) && !isAnthropicFable5Model(modelId);
}
function isAnthropicMythosPreviewModel(modelId) {
	return /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(resolveClaudeModelIdentity({ id: modelId }));
}
function supportsAnthropicNativeMaxEffort(modelId) {
	return supportsClaudeNativeMaxEffort({ id: modelId }) || isAnthropicMythosPreviewModel(modelId);
}
function hasConfiguredModelContextOverride(config, provider, modelId) {
	const providers = config?.models?.providers;
	if (!providers || typeof providers !== "object") return false;
	const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	for (const [providerId, providerConfig] of Object.entries(providers)) {
		if (normalizeLowercaseStringOrEmpty(providerId) !== normalizedProvider) continue;
		if (!Array.isArray(providerConfig?.models)) continue;
		for (const model of providerConfig.models) {
			if (normalizeLowercaseStringOrEmpty(typeof model?.id === "string" ? model.id : "") !== normalizedModelId) continue;
			if (typeof model?.contextTokens === "number" && model.contextTokens > 0 || typeof model?.contextWindow === "number" && model.contextWindow > 0) return true;
		}
	}
	return false;
}
function applyAnthropicFixedContextWindow(params) {
	const fixedContextWindow = resolveAnthropicFixedContextWindow(params.contractModelId);
	if (fixedContextWindow === void 0) return;
	if (hasConfiguredModelContextOverride(params.config, params.provider, params.modelId)) return;
	const exactContextWindow = isAnthropicFable5Model(params.contractModelId);
	const nextContextWindow = exactContextWindow ? fixedContextWindow : Math.max(params.model.contextWindow ?? 0, fixedContextWindow);
	const nextContextTokens = exactContextWindow ? fixedContextWindow : typeof params.model.contextTokens === "number" ? Math.max(params.model.contextTokens, fixedContextWindow) : fixedContextWindow;
	if (nextContextWindow === params.model.contextWindow && nextContextTokens === params.model.contextTokens) return;
	return {
		...params.model,
		contextWindow: nextContextWindow,
		contextTokens: nextContextTokens
	};
}
function applyAnthropicModernMaxTokens(params) {
	if (!isAnthropic128kOutputModel(params.modelId)) return;
	if ((params.model.maxTokens ?? 0) >= ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS) return;
	return {
		...params.model,
		maxTokens: ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS
	};
}
function applyAnthropicThinkingLevelMap(params) {
	const fable5 = isAnthropicFable5Model(params.modelId);
	const nativeXhigh = fable5 || isAnthropicOpus47OrNewerModel(params.modelId);
	if (!supportsAnthropicNativeMaxEffort(params.modelId)) return;
	const current = params.model.thinkingLevelMap;
	const nativeDefaults = isAnthropicMythosPreviewModel(params.modelId) ? { max: "max" } : {
		...fable5 ? {
			off: "low",
			minimal: "low"
		} : {},
		xhigh: nativeXhigh ? "xhigh" : null,
		max: "max"
	};
	const currentEfforts = current;
	if (Object.keys(nativeDefaults).every((level) => currentEfforts?.[level] !== void 0)) return;
	return {
		...params.model,
		thinkingLevelMap: {
			...nativeDefaults,
			...current
		}
	};
}
function matchesAnthropicModernModel(modelId) {
	return supportsClaudeAdaptiveThinking({ id: modelId }) || isAnthropicMythosPreviewModel(modelId);
}
function hasImageInput(input) {
	return Array.isArray(input) && input.includes("image");
}
function supportsAnthropicImageInput(modelId, modelName) {
	return [modelId, modelName].filter((value) => typeof value === "string").some((candidate) => matchesAnthropicModernModel(candidate));
}
function resolveAnthropicImageMediaInput(modelId, modelName) {
	if (!supportsAnthropicImageInput(modelId, modelName)) return;
	const largeImageModel = [modelId, modelName].filter((value) => typeof value === "string").some((ref) => isAnthropicFable5Model(ref) || isAnthropicOpus47OrNewerModel(ref));
	return { image: {
		maxSidePx: largeImageModel ? 2576 : 1568,
		preferredSidePx: largeImageModel ? 2576 : 1568,
		tokenMode: "provider"
	} };
}
function applyAnthropicImageInputCapability(params) {
	if (hasImageInput(params.model.input)) return;
	if (!supportsAnthropicImageInput(params.modelId, params.model.name)) return;
	return {
		...params.model,
		input: ["text", "image"]
	};
}
function normalizeAnthropicResolvedModel(ctx) {
	const contractModelId = resolveClaudeModelIdentity({
		id: ctx.modelId,
		params: ctx.model.params
	});
	if (isAnthropicFable5Model(contractModelId) && normalizeLowercaseStringOrEmpty(ctx.provider) !== PROVIDER_ID) return;
	const contractModel = isAnthropicFable5Model(contractModelId) && !ctx.model.reasoning ? {
		...ctx.model,
		reasoning: true
	} : ctx.model;
	const imageCapableModel = applyAnthropicImageInputCapability({
		modelId: contractModelId,
		model: contractModel
	}) ?? contractModel;
	const mediaInput = resolveAnthropicImageMediaInput(contractModelId, imageCapableModel.name);
	const mediaInputModel = mediaInput ? {
		...imageCapableModel,
		mediaInput: {
			...mediaInput,
			...imageCapableModel.mediaInput,
			image: {
				...mediaInput.image,
				...imageCapableModel.mediaInput?.image
			}
		}
	} : imageCapableModel;
	const outputModel = applyAnthropicModernMaxTokens({
		modelId: contractModelId,
		model: mediaInputModel
	}) ?? mediaInputModel;
	const thinkingLevelModel = applyAnthropicThinkingLevelMap({
		modelId: contractModelId,
		model: outputModel
	}) ?? outputModel;
	const contextWindowModel = applyAnthropicFixedContextWindow({
		config: ctx.config,
		provider: ctx.provider,
		modelId: ctx.modelId,
		contractModelId,
		model: thinkingLevelModel
	}) ?? thinkingLevelModel;
	return contextWindowModel === ctx.model ? void 0 : contextWindowModel;
}
function buildAnthropicAuthDoctorHint(params) {
	const legacyProfileId = params.profileId ?? "anthropic:default";
	const suggested = suggestOAuthProfileIdForLegacyDefault({
		cfg: params.config,
		store: params.store,
		provider: PROVIDER_ID,
		legacyProfileId
	});
	if (!suggested || suggested === legacyProfileId) return "";
	const storeOauthProfiles = listProfilesForProvider(params.store, PROVIDER_ID).filter((id) => params.store.profiles[id]?.type === "oauth").join(", ");
	const cfgMode = params.config?.auth?.profiles?.[legacyProfileId]?.mode;
	const cfgProvider = params.config?.auth?.profiles?.[legacyProfileId]?.provider;
	return [
		"Doctor hint (for GitHub issue):",
		`- provider: ${PROVIDER_ID}`,
		`- config: ${legacyProfileId}${cfgProvider || cfgMode ? ` (provider=${cfgProvider ?? "?"}, mode=${cfgMode ?? "?"})` : ""}`,
		`- auth store oauth profiles: ${storeOauthProfiles || "(none)"}`,
		`- suggested profile: ${suggested}`,
		`Fix: run "${formatCliCommand("openclaw doctor --yes")}"`
	].join("\n");
}
function resolveClaudeCliSyntheticAuth() {
	const credential = readClaudeCliCredentialsForRuntime();
	if (!credential) return;
	return credential.type === "oauth" ? {
		apiKey: credential.access,
		source: "Claude CLI native auth",
		mode: "oauth",
		expiresAt: credential.expires
	} : {
		apiKey: credential.token,
		source: "Claude CLI native auth",
		mode: "token",
		expiresAt: credential.expires
	};
}
async function runAnthropicCliMigration(ctx) {
	const credential = readClaudeCliCredentialsForSetup();
	if (!credential) throw new Error(["Claude CLI is not authenticated on this host.", `Run ${formatCliCommand("claude auth login")} first, then re-run this setup.`].join("\n"));
	return buildAnthropicCliMigrationResult(ctx.config, credential);
}
async function runAnthropicCliMigrationNonInteractive(ctx) {
	const credential = readClaudeCliCredentialsForSetupNonInteractive();
	if (!credential) {
		ctx.runtime.error(["Auth choice \"anthropic-cli\" requires Claude CLI auth on this host.", `Run ${formatCliCommand("claude auth login")} first.`].join("\n"));
		ctx.runtime.exit(1);
		return null;
	}
	const result = buildAnthropicCliMigrationResult(ctx.config, credential);
	const currentDefaults = ctx.config.agents?.defaults;
	const currentModel = currentDefaults?.model;
	const currentFallbacks = currentModel && typeof currentModel === "object" && "fallbacks" in currentModel ? currentModel.fallbacks : void 0;
	const migratedModel = result.configPatch?.agents?.defaults?.model;
	const migratedFallbacks = migratedModel && typeof migratedModel === "object" && "fallbacks" in migratedModel ? migratedModel.fallbacks : void 0;
	const nextFallbacks = Array.isArray(migratedFallbacks) ? migratedFallbacks : currentFallbacks;
	return {
		...ctx.config,
		...result.configPatch,
		agents: {
			...ctx.config.agents,
			...result.configPatch?.agents,
			defaults: {
				...currentDefaults,
				...result.configPatch?.agents?.defaults,
				model: {
					...Array.isArray(nextFallbacks) ? { fallbacks: nextFallbacks } : {},
					primary: result.defaultModel
				}
			}
		}
	};
}
async function resolveAnthropicUsageAuth(ctx) {
	const oauthToken = await ctx.resolveOAuthToken();
	if (oauthToken) return oauthToken;
	const apiKey = ctx.resolveApiKeyFromConfigAndStore();
	if (apiKey && validateAnthropicSetupToken(apiKey) === void 0) return { token: apiKey };
	return { handled: true };
}
/** Build the full Anthropic provider descriptor used by runtime registration. */
function buildAnthropicProvider() {
	const providerId = "anthropic";
	const defaultAnthropicModel = DEFAULT_ANTHROPIC_MODEL;
	return {
		id: providerId,
		label: "Anthropic",
		docsPath: "/providers/models",
		hookAliases: [CLAUDE_CLI_BACKEND_ID],
		envVars: ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"],
		oauthProfileIdRepairs: [{
			legacyProfileId: "anthropic:default",
			promptLabel: "Anthropic"
		}],
		auth: [
			{
				id: "cli",
				label: "Claude CLI",
				hint: "Reuse a local Claude CLI login and run Anthropic models through the Claude CLI runtime",
				kind: "custom",
				wizard: {
					choiceId: "anthropic-cli",
					choiceLabel: "Anthropic Claude CLI",
					choiceHint: "Reuse a local Claude CLI login on this host",
					assistantPriority: -20,
					groupId: "anthropic",
					groupLabel: "Anthropic",
					groupHint: "Claude CLI + API key",
					modelAllowlist: {
						allowedKeys: [...CLAUDE_CLI_CANONICAL_ALLOWLIST_REFS],
						initialSelections: [CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF],
						message: "Claude CLI models"
					}
				},
				run: async (ctx) => await runAnthropicCliMigration(ctx),
				runNonInteractive: async (ctx) => await runAnthropicCliMigrationNonInteractive({
					config: ctx.config,
					runtime: ctx.runtime,
					agentDir: ctx.agentDir
				})
			},
			{
				id: "setup-token",
				label: "Anthropic setup-token",
				hint: "Manual bearer token path",
				kind: "token",
				wizard: {
					choiceId: "setup-token",
					choiceLabel: "Anthropic setup-token",
					choiceHint: "Manual token path",
					assistantPriority: 40,
					groupId: "anthropic",
					groupLabel: "Anthropic",
					groupHint: "Claude CLI + API key + token"
				},
				run: async (ctx) => await runAnthropicSetupTokenAuth(ctx),
				runNonInteractive: async (ctx) => await runAnthropicSetupTokenNonInteractive(ctx)
			},
			createProviderApiKeyAuthMethod({
				providerId,
				methodId: "api-key",
				label: "Anthropic API key",
				hint: "Direct Anthropic API key",
				optionKey: "anthropicApiKey",
				flagName: "--anthropic-api-key",
				envVar: "ANTHROPIC_API_KEY",
				promptMessage: "Enter Anthropic API key",
				defaultModel: defaultAnthropicModel,
				expectedProviders: ["anthropic"],
				wizard: {
					choiceId: "apiKey",
					choiceLabel: "Anthropic API key",
					groupId: "anthropic",
					groupLabel: "Anthropic",
					groupHint: "Claude CLI + API key"
				}
			})
		],
		normalizeConfig: ({ provider, providerConfig }) => normalizeAnthropicProviderConfigForProvider({
			provider,
			providerConfig
		}),
		applyConfigDefaults: ({ config, env }) => applyAnthropicConfigDefaults({
			config,
			env
		}),
		resolveDynamicModel: (ctx) => {
			const model = resolveAnthropicForwardCompatModel(ctx);
			if (!model) return;
			return normalizeAnthropicResolvedModel({
				config: ctx.config,
				provider: ctx.provider,
				modelId: ctx.modelId,
				model
			}) ?? model;
		},
		normalizeResolvedModel: (ctx) => normalizeAnthropicResolvedModel(ctx),
		resolveSyntheticAuth: ({ provider }) => normalizeLowercaseStringOrEmpty(provider) === "claude-cli" ? resolveClaudeCliSyntheticAuth() : void 0,
		augmentModelCatalog: () => buildClaudeCliCatalogEntries(),
		...NATIVE_ANTHROPIC_REPLAY_HOOKS,
		isModernModelRef: ({ provider, modelId }) => matchesAnthropicModernModel(modelId) && (!isAnthropicFable5Model(modelId) || normalizeLowercaseStringOrEmpty(provider) === PROVIDER_ID),
		resolveReasoningOutputMode: () => "native",
		resolveThinkingProfile: ({ provider, modelId, params }) => {
			const contractModelId = resolveClaudeModelIdentity({
				id: modelId,
				params
			});
			return isAnthropicFable5Model(contractModelId) && normalizeLowercaseStringOrEmpty(provider) !== PROVIDER_ID ? CLAUDE_CLI_OFF_THINKING_PROFILE : resolveClaudeThinkingProfile(contractModelId, void 0, { includeNativeMax: [PROVIDER_ID, CLAUDE_CLI_BACKEND_ID].includes(normalizeLowercaseStringOrEmpty(provider)) });
		},
		wrapStreamFn: wrapAnthropicProviderStream,
		resolveUsageAuth: resolveAnthropicUsageAuth,
		fetchUsageSnapshot: async (ctx) => await fetchClaudeUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn),
		isCacheTtlEligible: () => true,
		buildAuthDoctorHint: (ctx) => buildAnthropicAuthDoctorHint({
			config: ctx.config,
			store: ctx.store,
			profileId: ctx.profileId
		})
	};
}
/** Register Anthropic provider, Claude CLI backend, and media understanding provider. */
function registerAnthropicPlugin(api) {
	api.registerCliBackend(buildAnthropicCliBackend());
	api.registerProvider(buildAnthropicProvider());
	api.registerMediaUnderstandingProvider(anthropicMediaUnderstandingProvider);
}
//#endregion
export { registerAnthropicPlugin as n, buildAnthropicProvider as t };
