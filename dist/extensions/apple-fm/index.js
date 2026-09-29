import { r as createLazyRuntimeModule } from "../../lazy-runtime-BPNHa36e.mjs";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-D3wDLM3X.mjs";
import { i as APPLE_FM_PROVIDER_ID, t as APPLE_FM_LOCAL_AUTH_MARKER } from "../../defaults-p5LbrA8q.mjs";
import path from "node:path";
//#region extensions/apple-fm/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "apple-fm",
	name: "Apple Foundation Models",
	description: "On-device Apple Intelligence inference for lightweight setup and short tasks.",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefaultOnPlatforms: ["darwin"],
	autoEnableWhenConfiguredProviders: ["apple-fm"],
	providers: ["apple-fm"],
	syntheticAuthRefs: ["apple-fm"],
	nonSecretAuthMarkers: ["apple-fm-local"],
	modelPricing: { "providers": { "apple-fm": { "external": false } } },
	setup: { "providers": [{
		"id": "apple-fm",
		"authMethods": ["local"]
	}] },
	providerAuthChoices: [{
		"provider": "apple-fm",
		"method": "local",
		"choiceId": "apple-fm",
		"platforms": ["darwin"],
		"assistantVisibility": "detected-only",
		"modelTarget": "utility",
		"choiceLabel": "Apple Foundation Models (on-device)",
		"choiceHint": "Free on-device setup and utility tasks; choose a separate model for your agent",
		"groupId": "apple-fm",
		"groupLabel": "Apple Foundation Models",
		"groupHint": "On-device, no API key",
		"onboardingFeatured": true,
		"appGuidedDiscovery": true,
		"appGuidedActionLabel": "Set up on this Mac"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/apple-fm/index.ts
const loadSetup = createLazyRuntimeModule(() => import("./setup.js"));
const loadStream = createLazyRuntimeModule(() => import("./stream.js"));
var apple_fm_default = defineSingleProviderPluginEntry({
	id: APPLE_FM_PROVIDER_ID,
	name: "Apple Foundation Models",
	description: "On-device Apple Intelligence inference for lightweight OpenClaw setup",
	manifest: openclaw_plugin_default,
	provider: (api) => {
		const pluginRoot = api.rootDir ?? path.dirname(api.source);
		const loadNative = createLazyRuntimeModule(async () => (await import("./native.js")).createAppleFmNative(pluginRoot));
		const nativeStream = async (...args) => (await loadStream()).createAppleFmStream(await loadNative())(...args);
		return {
			label: "Apple Foundation Models",
			docsPath: "/plugins/apple-fm",
			extraAuth: [{
				id: "local",
				label: "Apple Foundation Models (on-device)",
				kind: "custom",
				wizard: { modelTarget: "utility" },
				run: async (ctx) => (await loadSetup()).runAppleFmSetup(ctx, await loadNative()),
				runNonInteractive: async (ctx) => (await loadSetup()).configureAppleFmNonInteractive(ctx, await loadNative()),
				validateNonInteractive: async (ctx) => (await loadSetup()).validateAppleFmNonInteractive(ctx, await loadNative()),
				appGuidedSetup: {
					detect: async (ctx) => (await loadSetup()).detectAppleFmSetup(ctx, await loadNative()),
					detectAvailability: async (ctx) => Boolean(await (await loadSetup()).detectAppleFmSetup(ctx, await loadNative())),
					prepare: async (ctx) => (await loadSetup()).prepareAppleFmSetup(ctx, await loadNative())
				}
			}],
			catalog: {
				order: "late",
				run: async (ctx) => {
					const provider = ctx.config.models?.providers?.[APPLE_FM_PROVIDER_ID];
					return provider && process.platform === "darwin" ? { provider } : null;
				}
			},
			resolveSyntheticAuth: ({ providerConfig }) => process.platform === "darwin" && providerConfig ? {
				apiKey: APPLE_FM_LOCAL_AUTH_MARKER,
				source: "on-device Apple Foundation Models",
				mode: "api-key"
			} : void 0,
			buildMissingAuthMessage: () => "Run openclaw onboard and select Apple Foundation Models on a supported Mac to prepare local inference. No API key is required.",
			createStreamFn: () => nativeStream,
			wrapSimpleCompletionStreamFn: () => nativeStream
		};
	}
});
//#endregion
export { apple_fm_default as default };
