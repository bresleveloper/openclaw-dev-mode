import { r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { n as runWithSqliteWorkerStateContext } from "./sqlite-worker-state-context-C9ABaq_h.mjs";
import { h as upsertWebPushSubscriptionInDatabase, m as setWebPushSubscriptionPreferencesInDatabase, t as deleteBoundWebPushSubscriptionInDatabase } from "./push-web-store.kernel-DCV7A944.mjs";
//#region src/infra/push-web-store.native.ts
function withNativeWebPushDatabase(context, operation) {
	context.admission.assertCurrent();
	return runWithSqliteWorkerStateContext(context, () => operation(openOpenClawStateDatabase({
		path: context.admission.databasePath,
		env: context.environment
	})));
}
function setNativeWebPushSubscriptionPreferences(params, context) {
	return withNativeWebPushDatabase(context, (database) => setWebPushSubscriptionPreferencesInDatabase({
		...params,
		database
	}));
}
function upsertNativeWebPushSubscription(params, context) {
	return withNativeWebPushDatabase(context, (database) => upsertWebPushSubscriptionInDatabase({
		...params,
		database
	}));
}
function deleteNativeBoundWebPushSubscription(params, context) {
	return withNativeWebPushDatabase(context, (database) => deleteBoundWebPushSubscriptionInDatabase({
		...params,
		database
	}));
}
//#endregion
export { deleteNativeBoundWebPushSubscription, setNativeWebPushSubscriptionPreferences, upsertNativeWebPushSubscription };
