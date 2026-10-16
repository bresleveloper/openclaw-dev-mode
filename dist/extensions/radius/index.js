import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { buildOauthProviderAuthResult, resolveOAuthApiKeyMarker } from "openclaw/plugin-sdk/provider-auth";
import { runLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
//#region extensions/radius/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "radius",
	name: "Radius",
	description: "Radius model gateway provider.",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["radius"],
	modelCatalog: { "discovery": { "radius": "refreshable" } },
	setup: { "providers": [{
		"id": "radius",
		"envVars": ["RADIUS_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "radius",
		"method": "oauth",
		"choiceId": "radius",
		"appGuidedAuth": "oauth",
		"credentialOnly": true,
		"channelLogin": {},
		"choiceLabel": "Radius (browser sign-in)",
		"groupId": "radius",
		"groupLabel": "Radius",
		"groupHint": "Browser sign-in or API key"
	}, {
		"provider": "radius",
		"method": "api-key",
		"choiceId": "radius-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Radius API key",
		"groupId": "radius",
		"groupLabel": "Radius",
		"groupHint": "Browser sign-in or API key",
		"optionKey": "radiusApiKey",
		"cliFlag": "--radius-api-key",
		"cliOption": "--radius-api-key <key>",
		"cliDescription": "Radius organization API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/radius/index.ts
const loadCatalog = createLazyRuntimeModule(() => import("./catalog.js"));
const loadOAuth = createLazyRuntimeModule(() => import("./oauth.js"));
const loadStream = createLazyRuntimeModule(() => import("./stream.js"));
function defaultModel(catalog) {
	const model = catalog.models.find((entry) => entry.id === "balanced") ?? catalog.models[0];
	if (!model) throw new Error("Radius returned no available models. Check your organization's model access.");
	return `radius/${model.id}`;
}
var radius_default = defineSingleProviderPluginEntry({
	id: "radius",
	name: "Radius Provider",
	description: "Radius model gateway with organization-scoped authentication and native streaming",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Radius",
		docsPath: "/providers/radius",
		manifestAuth: {
			noteTitle: "Radius",
			noteMessage: "Create an organization API key at https://radius.earendil.com. Requests use that organization's credits and policies.",
			resolveDefaultModel: async ({ apiKey, signal }) => defaultModel(await (await loadCatalog()).fetchRadiusCatalog(apiKey, signal))
		},
		extraAuth: [{
			id: "oauth",
			label: "Radius browser sign-in",
			hint: "Pair your browser and choose a Radius organization",
			kind: "device_code",
			wizard: {
				choiceId: "radius",
				choiceLabel: "Radius (browser sign-in)",
				groupId: "radius",
				groupLabel: "Radius",
				groupHint: "Browser sign-in or API key"
			},
			run: async (ctx) => {
				const credentials = await (await loadOAuth()).loginRadiusOAuth(ctx);
				const notes = ["Radius access is scoped to the organization selected in your browser. Tokens refresh automatically."];
				if (ctx.credentialOnly) {
					ctx.assertCurrent?.();
					return {
						profiles: [{
							profileId: "radius:default",
							credential: {
								type: "oauth",
								provider: "radius",
								...credentials
							}
						}],
						notes
					};
				}
				const catalog = await (await loadCatalog()).fetchRadiusCatalog(credentials.access, ctx.signal);
				ctx.assertCurrent?.();
				return buildOauthProviderAuthResult({
					providerId: "radius",
					defaultModel: defaultModel(catalog),
					access: credentials.access,
					refresh: credentials.refresh,
					expires: credentials.expires,
					notes
				});
			}
		}],
		catalog: {
			order: "profile",
			run: async (ctx) => {
				const { apiKey, discoveryApiKey, profileId } = ctx.resolveProviderAuth("radius", { oauthMarker: resolveOAuthApiKeyMarker("radius") });
				if (!discoveryApiKey) return null;
				return await runLiveProviderCatalog({
					providerId: "radius",
					profileId,
					run: async () => ({ provider: {
						...await (await loadCatalog()).fetchRadiusCatalog(discoveryApiKey),
						apiKey
					} })
				});
			}
		},
		prepareDynamicModel: async (ctx) => {
			const { resolveApiKeyForProvider } = await import("openclaw/plugin-sdk/provider-auth-runtime");
			const { apiKey } = await resolveApiKeyForProvider({
				provider: "radius",
				cfg: ctx.config,
				agentDir: ctx.agentDir,
				workspaceDir: ctx.workspaceDir,
				...ctx.authProfileId ? {
					profileId: ctx.authProfileId,
					lockedProfile: true
				} : {}
			});
			if (!apiKey) return;
			const catalog = await (await loadCatalog()).fetchRadiusCatalog(apiKey);
			const model = catalog.models.find((entry) => entry.id === ctx.modelId);
			return model ? {
				id: model.id,
				name: model.name,
				provider: "radius",
				api: "pi-messages",
				baseUrl: catalog.baseUrl,
				reasoning: model.reasoning,
				input: model.input,
				cost: model.cost,
				contextWindow: model.contextWindow,
				maxTokens: model.maxTokens,
				thinkingLevelMap: model.thinkingLevelMap
			} : void 0;
		},
		createStreamFn: () => async (...args) => (await loadStream()).createRadiusStreamFn()(...args),
		buildReplayPolicy: () => ({
			sanitizeToolCallIds: false,
			preserveSignatures: true,
			appendOnlyRuntimeContext: true,
			dropThinkingBlocks: false,
			dropReasoningFromHistory: false
		}),
		refreshOAuth: async (credential) => (await loadOAuth()).refreshRadiusOAuthCredential(credential)
	}
});
//#endregion
export { radius_default as default };
