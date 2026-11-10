//#region src/config/sessions/session-actor-command.ts
/** Admission carries authority and receipt identity, not the resident transcript indexes. */
function projectSessionActorAuthority(state) {
	const { target, version, writeToken, dependencySessionIds, entry } = state;
	return {
		target,
		version,
		writeToken,
		dependencySessionIds,
		entry
	};
}
function isSessionActorCommand(command) {
	return command.type.startsWith("session.actor.");
}
//#endregion
export { projectSessionActorAuthority as n, isSessionActorCommand as t };
