//#region src/agents/auth-profiles/store.worker-contract.ts
function createAuthProfileUsageReceipt(store) {
	return {
		store,
		result: void 0,
		publication: {
			credentialsChanged: false,
			profileSetChanged: false,
			stateChanged: false,
			selectionChanged: false,
			profileIds: []
		}
	};
}
//#endregion
export { createAuthProfileUsageReceipt as t };
