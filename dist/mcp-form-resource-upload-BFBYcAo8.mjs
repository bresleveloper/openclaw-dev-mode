//#region src/agents/mcp-form-resource-upload.ts
/** Select the workspace adapter only from the existing transport owner's local-file fact. */
async function prepareMcpAppFormUpload(origin) {
	origin.assertCurrent();
	if (origin.runtime.canReadLocalFiles?.(origin.serverName) !== true) return;
	const { createMcpAppWorkspaceUploadProvider } = await import("./mcp-app-form-resources-Br4wGVe9.mjs");
	const assertCurrent = () => {
		origin.assertCurrent();
		if (origin.runtime.canReadLocalFiles?.(origin.serverName) !== true) throw new Error("MCP form local-file transport changed");
	};
	assertCurrent();
	return createMcpAppWorkspaceUploadProvider({
		workspaceDir: origin.runtime.workspaceDir,
		sessionKey: origin.sessionKey,
		agentId: origin.agentId,
		assertCurrent
	});
}
//#endregion
export { prepareMcpAppFormUpload as t };
