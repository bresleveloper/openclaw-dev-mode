//#region src/agents/cli-runner/cli-backend-auth-policy.ts
const BUNDLED_CLI_BACKEND_AUTH_POLICIES = {
	"claude-cli": {
		strictSelectedProfile: true,
		oauthRefreshOwner: "core",
		nativeAuthProfileIds: ["anthropic:claude-cli"]
	},
	"google-gemini-cli": {
		strictSelectedProfile: false,
		oauthRefreshOwner: "cli"
	}
};
function resolveBundledCliBackendAuthPolicy(backendId) {
	return BUNDLED_CLI_BACKEND_AUTH_POLICIES[backendId];
}
//#endregion
export { resolveBundledCliBackendAuthPolicy as t };
