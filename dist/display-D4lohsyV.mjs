import { n as resolveAuthProfileMetadata } from "./identity-DVxLdta7.mjs";
//#region src/agents/auth-profiles/display.ts
function resolveAuthProfileDisplayLabel(params) {
	const { displayName, email } = resolveAuthProfileMetadata(params);
	const label = displayName || email;
	return label ? `${params.profileId} (${label})` : params.profileId;
}
//#endregion
export { resolveAuthProfileDisplayLabel as t };
