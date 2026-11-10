//#region src/shared/effect-authority.ts
/** Transport callers retain the public handoff shape without cron receipt custody. */
function captureEffectAuthority() {
	return {
		active: false,
		run(run) {
			return run();
		},
		async initiate(effect) {
			return effect();
		}
	};
}
/** Independent owners, such as transport crypto maintenance, restore their own scope explicitly. */
function withEffectAuthority(authority, run) {
	return authority ? authority.run(run) : run();
}
//#endregion
export { withEffectAuthority as n, captureEffectAuthority as t };
