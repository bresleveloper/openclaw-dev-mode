//#region extensions/codex/src/app-server/auth-profile-recovery.ts
const CODEX_NATIVE_PROFILE_IMPORT_COMMAND = "openclaw models auth login --provider openai --method device-code";
var CodexAppServerAuthProfileUnavailableError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "selected_auth_profile_unavailable";
	}
};
function formatCodexAuthProfileUnavailableMessage(profileId) {
	const missing = `Codex app-server auth profile "${profileId}" was not found in the OpenClaw credential store. This is a local credential lookup failure.`;
	return profileId === "openai:default" ? `${missing} Since 2026.9.5, OpenClaw no longer supplies this profile from the native Codex login. Run \`${CODEX_NATIVE_PROFILE_IMPORT_COMMAND}\` to import that login or sign in through OpenClaw, then retry. For multiple agents, add \`--agent <id>\`.` : `${missing} Restore or select an existing OpenAI profile, then retry.`;
}
//#endregion
export { CodexAppServerAuthProfileUnavailableError as n, formatCodexAuthProfileUnavailableMessage as r, CODEX_NATIVE_PROFILE_IMPORT_COMMAND as t };
