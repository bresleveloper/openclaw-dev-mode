import { r as WebPushSubscriptionBindingError } from "./push-web-store.records-CGk3CZmD.mjs";
import { a as findBoundWebPushSubscriptionByEndpointInDatabase, c as listBoundWebPushSubscriptionsInDatabase, d as listWebPushSubscriptionsInDatabase, f as prepareWebPushApprovalDeliveriesInDatabase, h as upsertWebPushSubscriptionInDatabase, l as listTerminalWebPushApprovalDeliveryIdsInDatabase, m as setWebPushSubscriptionPreferencesInDatabase, n as deleteWebPushApprovalDeliveryTargetsInDatabase, o as hasBoundWebPushSubscriptionsInDatabase, p as readPersistedVapidKeyPairInDatabase, r as deleteWebPushSubscriptionIfCurrentInDatabase, s as insertVapidKeyPairIfAbsentInDatabase, t as deleteBoundWebPushSubscriptionInDatabase, u as listWebPushApprovalDeliveryTargetsInDatabase } from "./push-web-store.kernel-Cb9JOWQ5.mjs";
//#region src/infra/push-web-store.worker.ts
const webPushOperations = {
	"webPush.findBoundWebPushSubscriptionByEndpoint": (input, { open }) => findBoundWebPushSubscriptionByEndpointInDatabase({
		...input,
		database: open()
	}),
	"webPush.setWebPushSubscriptionPreferences": (input, { open }) => setWebPushSubscriptionPreferencesInDatabase({
		...input,
		database: open()
	}),
	"webPush.listWebPushSubscriptions": (_input, { open }) => listWebPushSubscriptionsInDatabase(open()),
	"webPush.hasBoundWebPushSubscriptions": (_input, { open }) => hasBoundWebPushSubscriptionsInDatabase(open()),
	"webPush.listBoundWebPushSubscriptions": (_input, { open }) => listBoundWebPushSubscriptionsInDatabase(open()),
	"webPush.prepareWebPushApprovalDeliveries": (input, { open }) => prepareWebPushApprovalDeliveriesInDatabase({
		...input,
		database: open()
	}),
	"webPush.listWebPushApprovalDeliveryTargets": (input, { open }) => listWebPushApprovalDeliveryTargetsInDatabase({
		...input,
		database: open()
	}),
	"webPush.deleteWebPushApprovalDeliveryTargets": (input, { open }) => deleteWebPushApprovalDeliveryTargetsInDatabase({
		...input,
		database: open()
	}),
	"webPush.listTerminalWebPushApprovalDeliveryIds": (input, { open }) => listTerminalWebPushApprovalDeliveryIdsInDatabase({
		...input,
		database: open()
	}),
	"webPush.upsertWebPushSubscription": (input, { open }) => {
		const database = open();
		try {
			return { subscription: upsertWebPushSubscriptionInDatabase({
				...input,
				database
			}) };
		} catch (error) {
			if (error instanceof WebPushSubscriptionBindingError) return { bindingError: error.message };
			throw error;
		}
	},
	"webPush.deleteBoundWebPushSubscription": (input, { open }) => deleteBoundWebPushSubscriptionInDatabase({
		...input,
		database: open()
	}),
	"webPush.deleteWebPushSubscriptionIfCurrent": (input, { open }) => deleteWebPushSubscriptionIfCurrentInDatabase({
		...input,
		database: open()
	}),
	"webPush.readPersistedVapidKeyPair": (_input, { stateOptions }) => readPersistedVapidKeyPairInDatabase(stateOptions()),
	"webPush.insertVapidKeyPairIfAbsent": (input, { open }) => insertVapidKeyPairIfAbsentInDatabase({
		...input,
		database: open()
	})
};
//#endregion
export { webPushOperations };
