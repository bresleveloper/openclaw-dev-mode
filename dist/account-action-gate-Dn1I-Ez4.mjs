//#region src/channels/plugins/account-action-gate.ts
/**
* Creates an action gate where account-specific flags override channel-level defaults.
*/
function createAccountActionGate(params) {
	return (key, defaultValue = true) => params.accountActions?.[key] ?? params.baseActions?.[key] ?? defaultValue;
}
//#endregion
export { createAccountActionGate as t };
