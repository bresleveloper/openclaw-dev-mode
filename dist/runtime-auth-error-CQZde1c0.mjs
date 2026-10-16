//#region extensions/github-copilot/runtime-auth-error.ts
function buildCopilotRuntimeAuthMessage(failure) {
	if (failure.reason === "timeout") return `Copilot authentication failed: timed out after ${failure.timeoutMs}ms`;
	const message = `Copilot authentication failed: HTTP ${failure.status}`;
	if (failure.status !== 403) return message;
	return `${message}. Run \`openclaw models auth login-github-copilot\` in a terminal to authenticate again. If this still fails, verify that your GitHub account has Copilot access and that your organization or enterprise policy permits it.`;
}
var CopilotRuntimeAuthError = class extends Error {
	constructor(failure) {
		super(buildCopilotRuntimeAuthMessage(failure), failure.reason === "timeout" ? { cause: failure.cause } : void 0);
		this.code = "github_copilot_auth_failed";
		this.name = "CopilotRuntimeAuthError";
		this.reason = failure.reason;
		if (failure.reason === "http_error") this.status = failure.status;
		else this.timeoutMs = failure.timeoutMs;
	}
};
//#endregion
export { CopilotRuntimeAuthError as t };
