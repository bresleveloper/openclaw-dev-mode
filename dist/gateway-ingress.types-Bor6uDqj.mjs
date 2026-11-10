//#region src/plugins/gateway-ingress.types.ts
var GatewayControlUiIngressError = class extends Error {
	constructor(code, message) {
		super(message);
		this.name = "GatewayControlUiIngressError";
		this.code = code;
	}
};
//#endregion
export { GatewayControlUiIngressError as t };
