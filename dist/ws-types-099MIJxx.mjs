//#region src/gateway/server/public-worker-ingress-context.ts
const publicWorkerIngressContexts = /* @__PURE__ */ new WeakMap();
/** Carry route-authenticated public ingress facts into the shared connection owner. */
function markPublicWorkerIngress(socket, context) {
	publicWorkerIngressContexts.set(socket, context);
}
function takePublicWorkerIngress(socket) {
	const context = publicWorkerIngressContexts.get(socket);
	publicWorkerIngressContexts.delete(socket);
	return context;
}
//#endregion
//#region src/gateway/server/ws-types.ts
const GATEWAY_WS_CONNECTION_KIND_PROPERTY = "__openclawConnectionKind";
const GATEWAY_WS_PREAUTH_BUDGET_PROPERTY = "__openclawPreauthBudget";
const WS_HANDSHAKE_PHASES = [
	"tcp_accepted",
	"ws_upgrade_started",
	"auth_credentials_received",
	"auth_validated",
	"session_attached",
	"hello_payload_prepared",
	"ready"
];
//#endregion
export { takePublicWorkerIngress as a, markPublicWorkerIngress as i, GATEWAY_WS_PREAUTH_BUDGET_PROPERTY as n, WS_HANDSHAKE_PHASES as r, GATEWAY_WS_CONNECTION_KIND_PROPERTY as t };
