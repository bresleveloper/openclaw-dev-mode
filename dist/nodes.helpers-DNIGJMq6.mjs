import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
//#region src/gateway/server-json.ts
function parseGatewayPayload(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	try {
		return JSON.parse(trimmed);
	} catch {
		return { payloadJSON: value };
	}
}
//#endregion
//#region src/gateway/server-methods/nodes.helpers.ts
/** Narrows successful node invoke results or responds with the node error details. */
function respondUnavailableOnNodeInvokeError(respond, res) {
	return respondUnavailableOnNodeInvokeErrorWithProvenance(respond, res);
}
function respondUnavailableOnNodeInvokeErrorWithProvenance(respond, res, provenance) {
	if (res.ok) return true;
	const nodeError = res.error && typeof res.error === "object" ? res.error : null;
	const nodeCode = normalizeOptionalString(nodeError?.code) ?? "";
	const nodeMessage = normalizeOptionalString(nodeError?.message) ?? "node invoke failed";
	const message = provenance?.message ?? (nodeCode ? `${nodeCode}: ${nodeMessage}` : nodeMessage);
	const details = {
		nodeError: res.error ?? null,
		...provenance ? { nodeCommandDispatched: provenance.nodeCommandDispatched } : {},
		...provenance?.permissionMissing ? { permissionMissing: provenance.permissionMissing } : {}
	};
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, { details }));
	return false;
}
//#endregion
export { respondUnavailableOnNodeInvokeErrorWithProvenance as n, parseGatewayPayload as r, respondUnavailableOnNodeInvokeError as t };
