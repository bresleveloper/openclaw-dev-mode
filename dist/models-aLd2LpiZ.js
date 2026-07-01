import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import { ct as validateModelsListParams, t as formatValidationErrors } from "./src-CSp7rUPX.js";
import { t as buildModelsListResult } from "./models-list-result-DKIoIUx3.js";
//#region src/gateway/server-methods/models.ts
const modelsHandlers = { "models.list": async ({ params, respond, context }) => {
	if (!validateModelsListParams(params)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid models.list params: ${formatValidationErrors(validateModelsListParams.errors)}`));
		return;
	}
	try {
		respond(true, await buildModelsListResult({
			context,
			params
		}), void 0);
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
	}
} };
//#endregion
export { buildModelsListResult, modelsHandlers };
