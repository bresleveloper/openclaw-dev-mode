import { Ng as errorShape, jn as validateLogsTailParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as defineValidatedGatewayMethod } from "./validation--xIH1Pj-.mjs";
import { t as readConfiguredLogTail } from "./log-tail--fTVkumy.mjs";
//#region src/gateway/server-methods/logs.ts
const logsHandlers = { "logs.tail": defineValidatedGatewayMethod("logs.tail", validateLogsTailParams, async ({ params, respond }) => {
	respond(true, await readConfiguredLogTail(params), void 0);
}, (err) => errorShape(ErrorCodes.UNAVAILABLE, `log read failed: ${String(err)}`)) };
//#endregion
export { logsHandlers };
