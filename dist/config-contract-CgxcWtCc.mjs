//#region src/agents/sandbox/config-contract.ts
function resolveSandboxScope(params) {
	return params.scope ?? "agent";
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
