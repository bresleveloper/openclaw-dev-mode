//#region src/gateway/ws-logging.ts
let gatewayWsLogStyle = "auto";
function setGatewayWsLogStyle(style) {
	gatewayWsLogStyle = style;
}
function getGatewayWsLogStyle() {
	return gatewayWsLogStyle;
}
const DEFAULT_WS_SLOW_MS = 1e3;
//#endregion
export { getGatewayWsLogStyle as n, setGatewayWsLogStyle as r, DEFAULT_WS_SLOW_MS as t };
