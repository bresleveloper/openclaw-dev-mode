//#region src/shared/presence-user.ts
/** Presence namespaces come from recorded identity, never display metadata or raw-id shape. */
function presenceUserKey(user) {
	return user.identity ? `profile:${user.identity.id}` : `raw:${user.id}`;
}
//#endregion
export { presenceUserKey as t };
