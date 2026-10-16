import { fn as validateLogsTailParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as readConfiguredLogTail } from "./log-tail-DwxGxkhZ.mjs";
import { r as defineValidatedGatewayMethod } from "./validation-Bu27N0nv.mjs";
//#region src/gateway/server-methods/logs.ts
const logsHandlers = { "logs.tail": defineValidatedGatewayMethod("logs.tail", validateLogsTailParams, async ({ params, respond }) => {
	respond(true, await readConfiguredLogTail(params), void 0);
}, (err) => errorShape(ErrorCodes.UNAVAILABLE, `log read failed: ${String(err)}`)) };
//#endregion
export { logsHandlers };
