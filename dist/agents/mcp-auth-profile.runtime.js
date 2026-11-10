import { f as loadAuthProfileStoreForRuntimeAsync } from "../store-runtime-CwqGD12G.mjs";
import { n as resolveApiKeyForProfile } from "../oauth-RJ_g0pTu.mjs";
//#region src/agents/mcp-auth-profile.runtime.ts
async function resolveMcpAuthProfileBearerToken(params) {
	const store = await loadAuthProfileStoreForRuntimeAsync(params.agentDir, {
		config: params.cfg,
		externalCliProfileIds: [params.profileId],
		readOnly: true,
		allowKeychainPrompt: false
	});
	const credential = store.profiles[params.profileId];
	if (!credential) throw new Error(`MCP server "${params.serverName}" references auth profile "${params.profileId}", but that profile was not found.`);
	if (credential.type !== "oauth") throw new Error(`MCP server "${params.serverName}" references auth profile "${params.profileId}", but ${credential.type} profiles are not refreshable. Use a refresh-capable OAuth profile.`);
	const resolved = await resolveApiKeyForProfile({
		cfg: params.cfg,
		store,
		profileId: params.profileId,
		agentDir: params.agentDir
	});
	if (!resolved || resolved.profileType !== "oauth" || !resolved.apiKey) throw new Error(`MCP server "${params.serverName}" could not resolve refreshable OAuth auth profile "${params.profileId}". Re-authenticate the profile and retry.`);
	if (!resolved.credential || resolved.credential.type !== "oauth" || typeof resolved.credential.access !== "string" || resolved.credential.access.trim().length === 0) throw new Error(`MCP server "${params.serverName}" resolved OAuth auth profile "${params.profileId}", but no raw access token was available for bearer projection.`);
	return resolved.credential.access;
}
//#endregion
export { resolveMcpAuthProfileBearerToken };
