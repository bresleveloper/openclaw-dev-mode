import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
//#region src/infra/gateway-work-metrics-events.ts
const listeners = resolveGlobalSingleton(Symbol.for("openclaw.gatewayWorkMetricsListeners"), () => /* @__PURE__ */ new Set(), (value) => value.clear());
function onGatewayWorkMetricsChanged(listener) {
	return registerListener(listeners, listener);
}
function notifyGatewayWorkMetricsChanged() {
	notifyListeners(listeners, void 0);
}
//#endregion
export { onGatewayWorkMetricsChanged as n, notifyGatewayWorkMetricsChanged as t };
