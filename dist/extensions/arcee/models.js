//#region extensions/arcee/models.ts
/** Default direct Arcee API base URL. */
const ARCEE_BASE_URL = "https://api.arcee.ai/api/v1";
/** Static Arcee model catalog used for provider registration. */
const ARCEE_MODEL_CATALOG = [
	{
		id: "trinity-mini",
		name: "Trinity Mini 26B",
		reasoning: false,
		input: ["text"],
		contextWindow: 131072,
		maxTokens: 8e4,
		cost: {
			input: .045,
			output: .15,
			cacheRead: .045,
			cacheWrite: .045
		}
	},
	{
		id: "trinity-large-preview",
		name: "Trinity Large Preview",
		reasoning: false,
		input: ["text"],
		contextWindow: 131072,
		maxTokens: 16384,
		cost: {
			input: .25,
			output: 1,
			cacheRead: .25,
			cacheWrite: .25
		}
	},
	{
		id: "trinity-large-thinking",
		name: "Trinity Large Thinking",
		reasoning: true,
		input: ["text"],
		contextWindow: 262144,
		maxTokens: 8e4,
		cost: {
			input: .25,
			output: .9,
			cacheRead: .25,
			cacheWrite: .25
		},
		compat: {
			supportsTools: false,
			supportsReasoningEffort: false
		}
	}
];
/** Build one OpenAI-compatible Arcee model definition. */
function buildArceeModelDefinition(model) {
	return {
		id: model.id,
		name: model.name,
		api: "openai-completions",
		reasoning: model.reasoning,
		input: model.input,
		cost: model.cost,
		contextWindow: model.contextWindow,
		maxTokens: model.maxTokens,
		...model.compat ? { compat: model.compat } : {}
	};
}
//#endregion
export { ARCEE_BASE_URL, ARCEE_MODEL_CATALOG, buildArceeModelDefinition };
