import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
//#region src/agents/agent-run-terminal-error.ts
/** Carries and discovers canonical terminal outcomes through thrown-error boundaries. */
/** Carries a canonical terminal outcome when an embedded attempt exits by throwing. */
var AgentRunTerminalOutcomeError = class extends Error {
	constructor(error, terminalOutcome) {
		super(error instanceof Error ? error.message : String(error), { cause: error });
		this.name = "AgentRunTerminalOutcomeError";
		this.terminalOutcome = terminalOutcome;
	}
};
/** Finds a canonical terminal outcome through ordinary error wrapper boundaries. */
function findAgentRunTerminalOutcome(error) {
	for (const candidate of collectNestedErrorCandidates(error)) if (candidate instanceof AgentRunTerminalOutcomeError) return candidate.terminalOutcome;
}
//#endregion
export { findAgentRunTerminalOutcome as n, AgentRunTerminalOutcomeError as t };
