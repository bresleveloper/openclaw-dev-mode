//#region packages/gateway-protocol/src/protocol-value-normalization.ts
/** Checks string presence without changing wire-significant whitespace. */
function isNonEmptyProtocolString(value) {
	return typeof value === "string" && value.length > 0;
}
//#endregion
export { isNonEmptyProtocolString as t };
