import { asOptionalObjectRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveOptionalIntegerOption } from "openclaw/plugin-sdk/number-runtime";
//#region extensions/copilot/src/session-restrictions.ts
const COPILOT_ISOLATED_EXCLUDED_TOOLS = [
	"builtin:*",
	"mcp:*",
	"custom:*"
];
/** Disable every ambient SDK capability for a prompt-only or settled final turn. */
function createCopilotIsolatedSessionRestrictions() {
	return {
		availableTools: [],
		coauthorEnabled: false,
		customAgents: [],
		customAgentsLocalOnly: true,
		embeddingCacheStorage: "in-memory",
		enableConfigDiscovery: false,
		enableFileHooks: false,
		enableHostGitOperations: false,
		enableOnDemandInstructionDiscovery: false,
		enableSessionStore: false,
		enableSkills: false,
		excludedTools: [...COPILOT_ISOLATED_EXCLUDED_TOOLS],
		includeSubAgentStreamingEvents: false,
		infiniteSessions: { enabled: false },
		instructionDirectories: [],
		manageScheduleEnabled: false,
		mcpOAuthTokenStorage: "in-memory",
		mcpServers: {},
		memory: { enabled: false },
		pluginDirectories: [],
		remoteSession: "off",
		requestCanvasRenderer: false,
		requestExtensions: false,
		skillDirectories: [],
		skipCustomInstructions: true,
		skipEmbeddingRetrieval: true,
		tools: []
	};
}
//#endregion
//#region extensions/copilot/src/usage-bridge.ts
function normalizeCopilotUsage(data) {
	const source = asOptionalObjectRecord(data);
	if (!source) return;
	const input = resolveOptionalIntegerOption(source.inputTokens, { min: 0 });
	const output = resolveOptionalIntegerOption(source.outputTokens, { min: 0 });
	const cacheRead = resolveOptionalIntegerOption(source.cacheReadTokens, { min: 0 });
	const cacheWrite = resolveOptionalIntegerOption(source.cacheWriteTokens, { min: 0 });
	return {
		cacheRead,
		cacheWrite,
		input,
		output,
		total: (input ?? 0) + (output ?? 0) + (cacheRead ?? 0) + (cacheWrite ?? 0)
	};
}
function buildCopilotAssistantUsage(params) {
	const usage = params.usage ?? normalizeCopilotUsage({ outputTokens: params.fallbackOutputTokens });
	return {
		cacheRead: usage?.cacheRead ?? 0,
		cacheWrite: usage?.cacheWrite ?? 0,
		cost: {
			cacheRead: 0,
			cacheWrite: 0,
			input: 0,
			output: 0,
			total: 0
		},
		input: usage?.input ?? 0,
		output: usage?.output ?? 0,
		totalTokens: usage?.total ?? 0
	};
}
//#endregion
export { normalizeCopilotUsage as n, createCopilotIsolatedSessionRestrictions as r, buildCopilotAssistantUsage as t };
