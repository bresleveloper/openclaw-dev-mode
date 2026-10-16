import { a as isGatewayTransportError } from "./transport-error-CsYJ5b9e.mjs";
import { u as isGatewayCredentialsRequiredError } from "./call-DnqhP17M.mjs";
//#region src/gateway/call-mutation-fallback.ts
/** Pre-dispatch failures permit local fallback only for the selected local backend. */
function resolveGatewayMutationFallback(params) {
	const { error, localTarget } = params;
	const reason = isGatewayTransportError(error) && error.kind === "closed" && error.code === void 0 ? "unreachable" : isGatewayCredentialsRequiredError(error) ? "credentials-required" : void 0;
	return reason && !localTarget ? "non-local" : reason;
}
//#endregion
export { resolveGatewayMutationFallback as t };
