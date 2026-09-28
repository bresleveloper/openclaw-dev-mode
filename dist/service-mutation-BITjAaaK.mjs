//#region src/daemon/service-mutation.ts
/** Isolate diagnostic observers from authoritative service-control mutations. */
function createGatewayLifecycleMutationReporter(onMutation) {
	return (mode) => {
		try {
			onMutation?.({ mode });
		} catch {}
	};
}
//#endregion
export { createGatewayLifecycleMutationReporter as t };
