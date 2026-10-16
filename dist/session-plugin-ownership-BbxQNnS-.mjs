import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
//#region src/gateway/session-plugin-ownership.ts
/** Plugin callers may access an existing session only when they own its exact row. */
function resolvePluginSessionOwnershipError(params) {
	const pluginOwnerId = normalizeOptionalString(params.pluginOwnerId);
	if (!pluginOwnerId || !params.entry || normalizeOptionalString(params.entry.pluginOwnerId) === pluginOwnerId) return;
	return errorShape(ErrorCodes.INVALID_REQUEST, `Plugin "${pluginOwnerId}" cannot ${params.action} session "${params.key}" because it did not create it.`);
}
//#endregion
export { resolvePluginSessionOwnershipError as t };
