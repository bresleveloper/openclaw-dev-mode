import { t as parseBoolean } from "./boolean-coercion-1HZNNkFl.mjs";
import { t as readSnakeCaseParamRaw } from "./param-key-J0cnwxlA.mjs";
//#region src/plugin-sdk/boolean-param.ts
/** Read boolean or string params from exact or snake_case tool-input keys. */
function readBooleanParam(params, key) {
	return parseBoolean(readSnakeCaseParamRaw(params, key));
}
//#endregion
export { readBooleanParam as t };
