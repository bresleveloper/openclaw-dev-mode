import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import { ot as validateLogsTailParams, t as formatValidationErrors } from "./src-CSp7rUPX.js";
import { t as readConfiguredLogTail } from "./log-tail-BfF7hMWx.js";
//#region src/gateway/server-methods/logs.ts
/** Gateway handler for bounded reads from the configured gateway log. */
const logsHandlers = { "logs.tail": async ({ params, respond }) => {
	if (!validateLogsTailParams(params)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid logs.tail params: ${formatValidationErrors(validateLogsTailParams.errors)}`));
		return;
	}
	const p = params;
	try {
		respond(true, await readConfiguredLogTail({
			cursor: p.cursor,
			limit: p.limit,
			maxBytes: p.maxBytes
		}), void 0);
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `log read failed: ${String(err)}`));
	}
} };
//#endregion
export { logsHandlers };
