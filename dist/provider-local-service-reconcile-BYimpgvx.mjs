//#region src/agents/provider-local-service-reconcile.ts
const MODEL_PROVIDER_LOCAL_SERVICE_RECONCILER_SYMBOL = Symbol.for("openclaw.modelProviderLocalServiceReconciler");
/** Carry the prepared provider's reconcile hook through the model transport boundary. */
function attachModelProviderLocalServiceReconciler(model, reconcile) {
	const next = { ...model };
	next[MODEL_PROVIDER_LOCAL_SERVICE_RECONCILER_SYMBOL] = reconcile;
	return next;
}
function getModelProviderLocalServiceReconciler(model) {
	return model[MODEL_PROVIDER_LOCAL_SERVICE_RECONCILER_SYMBOL];
}
//#endregion
export { getModelProviderLocalServiceReconciler as n, attachModelProviderLocalServiceReconciler as t };
