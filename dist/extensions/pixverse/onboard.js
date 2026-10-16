import { DEFAULT_PIXVERSE_REGION, PIXVERSE_BASE_URL_BY_REGION, PIXVERSE_DEFAULT_VIDEO_MODEL_REF, PIXVERSE_PROVIDER_ID, normalizePixVerseRegion } from "./constants.js";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { applyAuthProfileConfig, buildApiKeyCredential, captureProviderApiKey, normalizeOptionalSecretInput, persistProviderApiKey } from "openclaw/plugin-sdk/provider-auth-api-key";
//#region extensions/pixverse/onboard.ts
const PROFILE_ID = `${PIXVERSE_PROVIDER_ID}:default`;
function applyPixVerseConfig(cfg, region, resetBaseUrl) {
	const existingProvider = cfg.models?.providers?.["pixverse"] ?? {};
	const selectedBaseUrl = PIXVERSE_BASE_URL_BY_REGION[region];
	const baseUrl = resetBaseUrl ? selectedBaseUrl : normalizeOptionalString(existingProvider.baseUrl) ?? selectedBaseUrl;
	const next = {
		...cfg,
		models: {
			...cfg.models,
			providers: {
				...cfg.models?.providers,
				[PIXVERSE_PROVIDER_ID]: {
					...existingProvider,
					baseUrl,
					models: existingProvider.models ?? [],
					region
				}
			}
		}
	};
	if (next.agents?.defaults?.mediaModels?.video) return next;
	return {
		...next,
		agents: {
			...next.agents,
			defaults: {
				...next.agents?.defaults,
				mediaModels: {
					...next.agents?.defaults?.mediaModels,
					video: { primary: PIXVERSE_DEFAULT_VIDEO_MODEL_REF }
				}
			}
		}
	};
}
async function runPixVerseApiKeyAuth(ctx) {
	const { input, mode } = await captureProviderApiKey(ctx, {
		token: normalizeOptionalSecretInput(ctx.opts?.pixverseApiKey) ?? normalizeOptionalSecretInput(ctx.opts?.token),
		tokenProvider: normalizeOptionalSecretInput(ctx.opts?.pixverseApiKey) ? PIXVERSE_PROVIDER_ID : normalizeOptionalSecretInput(ctx.opts?.tokenProvider),
		env: ctx.env,
		expectedProviders: [PIXVERSE_PROVIDER_ID],
		provider: PIXVERSE_PROVIDER_ID,
		envLabel: "PIXVERSE_API_KEY",
		promptMessage: "Enter PixVerse API key",
		missingInputMessage: "Missing PixVerse API key."
	});
	const region = await ctx.prompter.select({
		message: "Select PixVerse API region",
		initialValue: DEFAULT_PIXVERSE_REGION,
		options: [{
			value: "international",
			label: "International",
			hint: PIXVERSE_BASE_URL_BY_REGION.international
		}, {
			value: "cn",
			label: "CN",
			hint: PIXVERSE_BASE_URL_BY_REGION.cn
		}]
	});
	return {
		profiles: [{
			profileId: PROFILE_ID,
			credential: buildApiKeyCredential(PIXVERSE_PROVIDER_ID, input, void 0, mode ? {
				secretInputMode: mode,
				config: ctx.config
			} : void 0)
		}],
		configPatch: applyPixVerseConfig(ctx.config, region, true),
		notes: [`PixVerse endpoint: ${region === "cn" ? "CN" : "International"} (${PIXVERSE_BASE_URL_BY_REGION[region]})`]
	};
}
async function runPixVerseApiKeyAuthNonInteractive(ctx) {
	const resolved = await ctx.resolveApiKey({
		provider: PIXVERSE_PROVIDER_ID,
		flagValue: normalizeOptionalSecretInput(ctx.opts.pixverseApiKey),
		flagName: "--pixverse-api-key",
		envVar: "PIXVERSE_API_KEY"
	});
	if (!resolved) return null;
	if (!await persistProviderApiKey(ctx, PROFILE_ID, {
		provider: "pixverse",
		resolved
	})) return null;
	const next = applyAuthProfileConfig(ctx.config, {
		profileId: PROFILE_ID,
		provider: PIXVERSE_PROVIDER_ID,
		mode: "api_key"
	});
	const explicitRegion = normalizePixVerseRegion(ctx.opts.pixverseRegion);
	return applyPixVerseConfig(next, explicitRegion ?? "international", explicitRegion !== void 0);
}
function buildPixVerseApiKeyAuthMethod() {
	return {
		id: "api-key",
		label: "PixVerse API key",
		hint: "Video generation API key",
		kind: "api_key",
		wizard: {
			choiceId: "pixverse-api-key",
			choiceLabel: "PixVerse API key",
			choiceHint: "Prompts for International or CN endpoint",
			groupId: "pixverse",
			groupLabel: "PixVerse",
			groupHint: "Video generation",
			onboardingScopes: ["image-generation"]
		},
		run: runPixVerseApiKeyAuth,
		runNonInteractive: runPixVerseApiKeyAuthNonInteractive
	};
}
//#endregion
export { buildPixVerseApiKeyAuthMethod };
