//#region extensions/apple-fm/defaults.ts
const APPLE_FM_PROVIDER_ID = "apple-fm";
const APPLE_FM_MODEL_ID = "system";
const APPLE_FM_MODEL_REF = `${APPLE_FM_PROVIDER_ID}/${APPLE_FM_MODEL_ID}`;
const APPLE_FM_LOCAL_AUTH_MARKER = "apple-fm-local";
const APPLE_FM_MIN_CONTEXT_WINDOW = 8192;
function buildAppleFmProviderConfig(facts) {
	return {
		baseUrl: "http://127.0.0.1",
		api: "openai-completions",
		authHeader: false,
		timeoutSeconds: 120,
		models: [{
			id: APPLE_FM_MODEL_ID,
			name: facts.modelName,
			reasoning: false,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: facts.contextWindow,
			maxTokens: 1024,
			compat: {
				supportsTools: true,
				supportsJsonSchemaResponseFormat: true,
				supportsDeveloperRole: false,
				supportsUsageInStreaming: true
			}
		}]
	};
}
//#endregion
export { buildAppleFmProviderConfig as a, APPLE_FM_PROVIDER_ID as i, APPLE_FM_MIN_CONTEXT_WINDOW as n, APPLE_FM_MODEL_REF as r, APPLE_FM_LOCAL_AUTH_MARKER as t };
