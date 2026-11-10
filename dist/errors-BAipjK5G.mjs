//#region src/agents/harness/errors.ts
var MissingAgentHarnessError = class extends Error {
	constructor(harnessId) {
		super(`Requested agent harness "${harnessId}" is not registered.`);
		this.name = "MissingAgentHarnessError";
		this.harnessId = harnessId;
	}
};
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
/** Required native cleanup failed; the host must preserve the current session generation. */
var AgentHarnessSessionCleanupError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "AgentHarnessSessionCleanupError";
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
export { isAgentHarnessPreflightError as a, resolveAgentHarnessPreflightOwner as c, MissingAgentHarnessError as i, AgentHarnessSessionCleanupError as n, isMissingAgentHarnessError as o, AgentHarnessSessionSupersededError as r, recordAgentHarnessPreflightOwner as s, AgentHarnessPreflightError as t };
