//#region src/plugin-sdk/inbound-event-delivery.ts
function resolveInboundEventDeliveryCorrelationKey(sessionKey, inboundEventKind) {
	const key = sessionKey?.trim();
	if (!key) return;
	return inboundEventKind === "room_event" ? `${key}:room_event` : key;
}
function createInboundEventDeliveryCorrelation(params) {
	const registry = /* @__PURE__ */ new Map();
	return {
		begin(sessionKey, event, options) {
			const key = resolveInboundEventDeliveryCorrelationKey(sessionKey, options?.inboundEventKind);
			if (!key) return () => {};
			registry.set(key, event);
			return () => {
				if (registry.get(key) === event) registry.delete(key);
			};
		},
		notify(notification) {
			const key = resolveInboundEventDeliveryCorrelationKey(notification.sessionKey, notification.inboundEventKind);
			if (!key) return;
			const event = registry.get(key);
			if (!event || !params.targetsMatch(event.outboundTo, notification.to)) return;
			if (event.outboundAccountId && notification.accountId && notification.accountId !== event.outboundAccountId) return;
			registry.delete(key);
			event.markInboundEventDelivered();
		}
	};
}
//#endregion
export { createInboundEventDeliveryCorrelation as t };
