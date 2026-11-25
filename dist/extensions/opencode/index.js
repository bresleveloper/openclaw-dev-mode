import { OPENCODE_ZEN_DEFAULT_MODEL_REF, applyOpencodeZenProviderConfig } from "./onboard.js";
import { a as prepareOpencodeZenModel, c as openclaw_plugin_default, i as normalizeOpencodeZenBaseUrl, n as buildStaticOpencodeZenProviderConfig, o as resolveOpencodeZenModel, r as listOpencodeZenModelCatalogEntries, s as resolveOpencodeZenStarterModel, t as buildOpencodeZenLiveProviderConfig } from "./.setup/provider-catalog-7CVtc4r7.mjs";
import { resolveThinkingProfile } from "./provider-policy-api.js";
import { registerOpenCodeSessionCatalog } from "./session-catalog-plugin.js";
import { wrapOpencodeProviderStream } from "./stream.js";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { describeImageWithModelPayloadTransform, describeImagesWithModelPayloadTransform } from "openclaw/plugin-sdk/media-understanding";
import { buildOauthProviderAuthResult, resolveOAuthApiKeyMarker } from "openclaw/plugin-sdk/provider-auth";
import { runLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { resolveFirstProviderCatalogAuth } from "openclaw/plugin-sdk/provider-catalog-shared";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks, matchesExactOrPrefix } from "openclaw/plugin-sdk/provider-model-shared";
import { isRecord, normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/opencode/index.ts
const PROVIDER_ID = "opencode";
const loadConsoleOAuth = createLazyRuntimeModule(() => import("./console-oauth.js"));
async function signInWithOpencodeConsole(ctx) {
	const credentials = await (await loadConsoleOAuth()).loginOpencodeConsole(ctx);
	const notes = ["OpenClaw is signed in to the OpenCode Console workspace you picked. Tokens refresh automatically."];
	ctx.assertCurrent?.();
	const credentialOnly = {
		profiles: [{
			profileId: `${PROVIDER_ID}:default`,
			credential: {
				type: "oauth",
				provider: PROVIDER_ID,
				...credentials
			}
		}],
		notes
	};
	if (ctx.credentialOnly) return credentialOnly;
	const defaultModel = await resolveOpencodeZenStarterModel({
		apiKey: credentials.access,
		preferredModelRef: OPENCODE_ZEN_DEFAULT_MODEL_REF,
		...ctx.signal ? { signal: ctx.signal } : {}
	});
	ctx.assertCurrent?.();
	if (!defaultModel) return credentialOnly;
	return buildOauthProviderAuthResult({
		providerId: PROVIDER_ID,
		defaultModel,
		access: credentials.access,
		refresh: credentials.refresh,
		expires: credentials.expires,
		profileName: "default",
		notes
	});
}
const MINIMAX_MODERN_MODEL_MATCHERS = ["minimax-m2.7"];
const stripDisabledResponsesReasoning = (payload) => {
	if (!isRecord(payload)) return;
	const reasoning = payload.reasoning;
	if (reasoning === "none" || isRecord(reasoning) && reasoning.effort === "none") delete payload.reasoning;
};
const opencodeMediaUnderstandingProvider = {
	id: "opencode",
	capabilities: ["image"],
	defaultModels: { image: "minimax-m3" },
	describeImage: (request) => describeImageWithModelPayloadTransform(request, stripDisabledResponsesReasoning),
	describeImages: (request) => describeImagesWithModelPayloadTransform(request, stripDisabledResponsesReasoning)
};
function isModernOpencodeModel(modelId) {
	const lower = normalizeLowercaseStringOrEmpty(modelId);
	if (lower.endsWith("-free") || lower === "alpha-glm-4.7") return false;
	return !matchesExactOrPrefix(lower, MINIMAX_MODERN_MODEL_MATCHERS);
}
function normalizeZenBaseUrl(value) {
	const baseUrl = normalizeOpencodeZenBaseUrl(value);
	return baseUrl && baseUrl !== value.baseUrl ? {
		...value,
		baseUrl
	} : void 0;
}
var opencode_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "OpenCode Zen Provider",
	description: "OpenCode Zen provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "OpenCode Zen",
		docsPath: "/providers/models",
		envVars: ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
		manifestAuth: {
			hint: "Shared API key infrastructure for Zen + Go",
			promptMessage: "Enter OpenCode API key",
			profileIds: ["opencode:default", "opencode-go:default"],
			defaultModel: OPENCODE_ZEN_DEFAULT_MODEL_REF,
			resolveDefaultModel: async ({ apiKey, signal }) => await resolveOpencodeZenStarterModel({
				apiKey,
				preferredModelRef: OPENCODE_ZEN_DEFAULT_MODEL_REF,
				...signal ? { signal } : {}
			}),
			expectedProviders: ["opencode", "opencode-go"],
			applyConfig: applyOpencodeZenProviderConfig,
			noteMessage: [
				"One OpenCode API key can authenticate Zen and a separately subscribed Go catalog.",
				"Zen provides access to Claude, GPT, Gemini, and more models.",
				"Get your API key at: https://opencode.ai/auth",
				"Choose the Zen catalog when you want the curated multi-model proxy."
			].join("\n"),
			noteTitle: "OpenCode"
		},
		extraAuth: [{
			id: "oauth",
			label: "OpenCode Console browser sign-in",
			hint: "Sign in with your browser and pick a Console workspace",
			kind: "device_code",
			wizard: {
				choiceId: "opencode-console",
				choiceLabel: "OpenCode Console (browser sign-in)",
				choiceHint: "Sign in in your browser and pick an OpenCode Console workspace",
				groupId: "opencode",
				groupLabel: "OpenCode",
				groupHint: "Browser sign-in or shared Zen + Go API key"
			},
			run: signInWithOpencodeConsole
		}],
		refreshOAuth: async (credential) => (await loadConsoleOAuth()).refreshOpencodeConsoleCredential(credential),
		normalizeConfig: ({ providerConfig }) => normalizeZenBaseUrl(providerConfig),
		normalizeResolvedModel: ({ model }) => normalizeZenBaseUrl(model),
		normalizeTransport: ({ api, baseUrl }) => normalizeZenBaseUrl({
			api,
			baseUrl
		}),
		resolveDynamicModel: ({ modelId }) => resolveOpencodeZenModel(modelId),
		prepareDynamicModel: async (ctx) => {
			const profileProvider = ctx.authProfileId ? ctx.config?.auth?.profiles?.[ctx.authProfileId]?.provider : void 0;
			const ownsProfile = Boolean(ctx.authProfileId && (ctx.authProfileId.startsWith("opencode:") || ctx.authProfileId.startsWith("opencode-go:") || profileProvider === "opencode" || profileProvider === "opencode-go"));
			return Boolean(ownsProfile || ctx.providerConfig || ctx.config?.models?.providers?.opencode || ctx.config?.models?.providers?.["opencode-go"] || process.env.OPENCODE_API_KEY?.trim() || process.env.OPENCODE_ZEN_API_KEY?.trim()) ? await prepareOpencodeZenModel({ modelId: ctx.modelId }) : void 0;
		},
		catalog: {
			order: "simple",
			run: async (ctx) => {
				if (ctx.providerIds !== void 0 && !ctx.providerIds.includes(PROVIDER_ID)) return null;
				const oauth = ctx.resolveProviderAuth(PROVIDER_ID, { oauthMarker: resolveOAuthApiKeyMarker(PROVIDER_ID) });
				const auth = oauth.mode === "oauth" && oauth.discoveryApiKey ? oauth : resolveFirstProviderCatalogAuth(ctx.resolveProviderApiKey, [PROVIDER_ID, "opencode-go"]);
				if (!auth) return null;
				if (!auth.discoveryApiKey) return { provider: buildStaticOpencodeZenProviderConfig(auth.apiKey) };
				return await runLiveProviderCatalog({
					providerId: PROVIDER_ID,
					profileId: auth.profileId,
					run: async () => ({ provider: await buildOpencodeZenLiveProviderConfig({
						apiKey: auth.apiKey ?? auth.discoveryApiKey,
						discoveryApiKey: auth.discoveryApiKey
					}) })
				});
			},
			staticRun: async () => ({ provider: buildStaticOpencodeZenProviderConfig() })
		},
		augmentModelCatalog: () => listOpencodeZenModelCatalogEntries(),
		...buildProviderReplayFamilyHooks({ family: "passthrough-gemini" }),
		isModernModelRef: ({ modelId }) => isModernOpencodeModel(modelId),
		resolveThinkingProfile,
		classifyFailoverReason: ({ status, errorType, code, errorMessage }) => status === 403 && (errorType === "FreeTierError" || code === "FreeTierError" || /\bFreeTierError\b|OpenCode's free tier can only be used from within OpenCode/.test(errorMessage)) ? "model_not_found" : void 0,
		wrapStreamFn: wrapOpencodeProviderStream
	},
	register(api) {
		api.registerMediaUnderstandingProvider(opencodeMediaUnderstandingProvider);
		registerOpenCodeSessionCatalog(api);
	}
});
export { opencode_default as default };
