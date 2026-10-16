import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { M as ZodISODateTime, N as ZodISODuration, P as ZodISOTime, _i as _isoDate, bi as _isoTime, j as ZodISODate, vi as _isoDateTime, yi as _isoDuration } from "./schemas-BOYIvvln.mjs";
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/iso.js
var iso_exports = /* @__PURE__ */ __exportAll({
	ZodISODate: () => ZodISODate,
	ZodISODateTime: () => ZodISODateTime,
	ZodISODuration: () => ZodISODuration,
	ZodISOTime: () => ZodISOTime,
	date: () => date,
	datetime: () => datetime,
	duration: () => duration,
	time: () => time
});
function datetime(params) {
	return _isoDateTime(ZodISODateTime, params);
}
function date(params) {
	return _isoDate(ZodISODate, params);
}
function time(params) {
	return _isoTime(ZodISOTime, params);
}
function duration(params) {
	return _isoDuration(ZodISODuration, params);
}
//#endregion
export { iso_exports as n, datetime as t };
