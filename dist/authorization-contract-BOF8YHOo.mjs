//#region src/agents/auth-profiles/authorization-contract.ts
/** Known lifetime loss differs from a temporarily unavailable authority observation.
* Keep the original MCP error name/codes for callers of the existing authority contract.
*/
var AuthProfileAuthorizationError = class extends Error {
	constructor(disposition) {
		super(disposition === "retired" ? "MCP authorization was disconnected or replaced" : "MCP authorization state is temporarily unavailable");
		this.name = "McpConnectionAuthorityError";
		this.code = disposition === "retired" ? "MCP_AUTHORIZATION_RETIRED" : "MCP_AUTHORIZATION_UNAVAILABLE";
	}
};
//#endregion
export { AuthProfileAuthorizationError as t };
