import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
//#region src/infra/gateway-work-metrics.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.gatewayWorkMetrics"), () => ({
	snapshot: void 0,
	listeners: /* @__PURE__ */ new Set(),
	demandListeners: /* @__PURE__ */ new Set()
}));
/** The Gateway projection publishes after owner changes and clears on shutdown. */
function publishGatewayWorkMetrics(snapshot) {
	state.snapshot = snapshot;
	notifyListeners(state.listeners, snapshot);
}
/** Replay the current projection when an exporter starts or restarts. */
function onGatewayWorkMetrics(listener) {
	const wasEmpty = state.listeners.size === 0;
	const unsubscribe = registerListener(state.listeners, listener);
	if (wasEmpty) notifyListeners(state.demandListeners, void 0);
	notifyListeners([listener], state.snapshot);
	return () => {
		const subscribed = state.listeners.has(listener);
		unsubscribe();
		if (subscribed && state.listeners.size === 0) notifyListeners(state.demandListeners, void 0);
	};
}
function hasGatewayWorkMetricsListeners() {
	return state.listeners.size > 0;
}
function onGatewayWorkMetricsDemand(listener) {
	return registerListener(state.demandListeners, listener);
}
//#endregion
export { publishGatewayWorkMetrics as i, onGatewayWorkMetrics as n, onGatewayWorkMetricsDemand as r, hasGatewayWorkMetricsListeners as t };
