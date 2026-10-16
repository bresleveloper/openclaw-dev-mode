//#region src/agents/harness/errors.ts
/**
* Agent harness error helpers.
*
* Registry and runtime callers use this stable error type to distinguish missing
* harness selection from ordinary harness execution failures.
*/
/** Error thrown when a requested harness id is not registered. */
var MissingAgentHarnessError = class extends Error {
	constructor(harnessId) {
		super(`Requested agent harness "${harnessId}" is not registered.`);
		this.name = "MissingAgentHarnessError";
		this.harnessId = harnessId;
	}
};
/** Returns whether an error is a missing harness error. */
function isMissingAgentHarnessError(err) {
	return err instanceof MissingAgentHarnessError;
}
/** A harness lost ownership of the session generation before the attempt could start. */
var AgentHarnessSessionSupersededError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "AgentHarnessSessionSupersededError";
	}
};
/** A model-independent harness preflight failed before an attempt could start. */
var AgentHarnessPreflightError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "AgentHarnessPreflightError";
		this.scope = options?.scope;
		this.userMessage = options?.userMessage;
	}
};
const agentHarnessPreflightOwners = /* @__PURE__ */ new WeakMap();
function recordAgentHarnessPreflightOwner(error, harnessId) {
	if (isAgentHarnessPreflightError(error) && error.scope === "harness") agentHarnessPreflightOwners.set(error, harnessId);
}
function resolveAgentHarnessPreflightOwner(error) {
	return isAgentHarnessPreflightError(error) ? agentHarnessPreflightOwners.get(error) : void 0;
}
/** Returns whether fallback would only repeat the same harness preflight failure. */
function isAgentHarnessPreflightError(err) {
	return err instanceof AgentHarnessPreflightError;
}
//#endregion
export { isMissingAgentHarnessError as a, isAgentHarnessPreflightError as i, AgentHarnessSessionSupersededError as n, recordAgentHarnessPreflightOwner as o, MissingAgentHarnessError as r, resolveAgentHarnessPreflightOwner as s, AgentHarnessPreflightError as t };
