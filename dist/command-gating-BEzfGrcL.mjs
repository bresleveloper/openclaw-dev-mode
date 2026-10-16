//#region src/channels/command-gating.ts
/** Resolves whether any configured authorizer permits a control command. */
function resolveCommandAuthorizedFromAuthorizers(params) {
	const { useAccessGroups, authorizers } = params;
	const mode = params.modeWhenAccessGroupsOff ?? "allow";
	if (!useAccessGroups) {
		if (mode === "allow") return true;
		if (mode === "deny") return false;
		if (!authorizers.some((entry) => entry.configured)) return true;
	}
	return authorizers.some((entry) => entry.configured && entry.allowed);
}
/** Resolves command authorization and whether the current text command should be blocked. */
function resolveControlCommandGate(params) {
	const commandAuthorized = resolveCommandAuthorizedFromAuthorizers(params);
	return {
		commandAuthorized,
		shouldBlock: params.allowTextCommands && params.hasControlCommand && !commandAuthorized
	};
}
//#endregion
export { resolveControlCommandGate as n, resolveCommandAuthorizedFromAuthorizers as t };
