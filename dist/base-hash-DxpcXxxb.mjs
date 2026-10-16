import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/gateway/server-methods/base-hash.ts
/** Read the optional optimistic-write base hash from a gateway method payload. */
function resolveBaseHashParam(params) {
	return normalizeNullableString(params?.baseHash);
}
//#endregion
export { resolveBaseHashParam as t };
