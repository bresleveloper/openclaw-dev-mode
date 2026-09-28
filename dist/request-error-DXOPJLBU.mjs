import { c as formatConnectErrorMessage } from "./connect-error-details-HKRZ1hRc.mjs";
import { t as GatewayProtocolRequestError } from "./protocol-request-BMUN1re6.mjs";
//#region packages/gateway-client/src/request-error.ts
var GatewayClientRequestError = class extends GatewayProtocolRequestError {
	constructor(error) {
		super({
			...error,
			message: formatConnectErrorMessage({
				message: error.message,
				details: error.details
			})
		});
		this.name = "GatewayClientRequestError";
	}
};
const GATEWAY_CONNECT_ASSEMBLY_ERROR = Symbol("gateway.connectAssemblyError");
function markGatewayConnectAssemblyError(error) {
	Object.defineProperty(error, GATEWAY_CONNECT_ASSEMBLY_ERROR, {
		configurable: true,
		value: true
	});
	return error;
}
function isGatewayConnectAssemblyError(value) {
	return value instanceof Error && value[GATEWAY_CONNECT_ASSEMBLY_ERROR] === true;
}
//#endregion
export { isGatewayConnectAssemblyError as n, markGatewayConnectAssemblyError as r, GatewayClientRequestError as t };
