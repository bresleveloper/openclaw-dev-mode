//#region src/gateway/remote-control-ui-ingress-host.ts
const hosts = /* @__PURE__ */ new WeakMap();
/** The listener owner publishes its adapters before plugin services start. */
function bindGatewayControlUiIngressHost(owner, host) {
	hosts.set(owner, host);
}
function getGatewayControlUiIngressHost(owner) {
	return hosts.get(owner);
}
//#endregion
export { getGatewayControlUiIngressHost as n, bindGatewayControlUiIngressHost as t };
