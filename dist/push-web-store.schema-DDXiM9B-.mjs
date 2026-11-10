import { n as ensureColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
//#region src/infra/push-web-store.schema.ts
/** Shared by the worker store and offline legacy migration. */
function ensureWebPushSubscriptionBindingColumns(db) {
	ensureColumn(db, "web_push_subscriptions", "device_id TEXT");
	ensureColumn(db, "web_push_subscriptions", "user_profile_id TEXT");
	ensureColumn(db, "web_push_subscriptions", "preferences_json TEXT");
}
//#endregion
export { ensureWebPushSubscriptionBindingColumns as t };
