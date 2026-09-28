import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { un as validateLogsTailParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { t as readConfiguredLogTail } from "./log-tail-Dj1EcI26.mjs";
import { n as defineValidatedGatewayMethod } from "./validation-CFv_zneu.mjs";
//#region src/gateway/server-methods/logs.ts
/** Gateway handler for bounded reads from the configured gateway log. */
const logsHandlers = { "logs.tail": defineValidatedGatewayMethod("logs.tail", validateLogsTailParams, async ({ params, respond }) => {
	try {
		respond(true, await readConfiguredLogTail({
			cursor: params.cursor,
			limit: params.limit,
			maxBytes: params.maxBytes
		}), void 0);
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `log read failed: ${String(err)}`));
	}
}) };
//#endregion
export { logsHandlers };
