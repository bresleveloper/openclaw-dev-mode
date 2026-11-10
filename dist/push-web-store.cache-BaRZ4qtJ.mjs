//#region src/infra/push-web-store.cache.ts
const boundWebPushSubscriptionsAdmission = {
	name: "state.web-push-bound-subscriptions",
	read: (value) => typeof value === "boolean" ? value : void 0
};
//#endregion
export { boundWebPushSubscriptionsAdmission as t };
