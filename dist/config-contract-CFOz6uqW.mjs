//#region src/agents/sandbox/config-contract.ts
function resolveSandboxScope(params) {
	if (params.scope) return params.scope;
	if (typeof params.perSession === "boolean") return params.perSession ? "session" : "shared";
	return "agent";
}
function resolveSandboxDockerEnv(params) {
	const agentEnv = params.scope === "shared" ? void 0 : params.agentEnv;
	return agentEnv ? {
		...params.globalEnv ?? { LANG: "C.UTF-8" },
		...agentEnv
	} : params.globalEnv ?? { LANG: "C.UTF-8" };
}
//#endregion
export { resolveSandboxScope as n, resolveSandboxDockerEnv as t };
