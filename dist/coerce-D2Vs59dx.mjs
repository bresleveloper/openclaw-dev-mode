import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { Br as _coercedBigint, Hr as _coercedDate, Ur as _coercedNumber, Vr as _coercedBoolean, Wr as _coercedString, Y as ZodNumber, _ as ZodDate, a as ZodBigInt, ot as ZodString, s as ZodBoolean } from "./schemas-BOYIvvln.mjs";
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/coerce.js
var coerce_exports = /* @__PURE__ */ __exportAll({
	bigint: () => bigint,
	boolean: () => boolean,
	date: () => date,
	number: () => number,
	string: () => string
});
function string(params) {
	return _coercedString(ZodString, params);
}
function number(params) {
	return _coercedNumber(ZodNumber, params);
}
function boolean(params) {
	return _coercedBoolean(ZodBoolean, params);
}
function bigint(params) {
	return _coercedBigint(ZodBigInt, params);
}
function date(params) {
	return _coercedDate(ZodDate, params);
}
//#endregion
export { string as n, coerce_exports as t };
