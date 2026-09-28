import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { Fn as object, Kt as custom } from "./schemas-BOYIvvln.mjs";
//#region src/worker/protocol-record.ts
function hasExactOwnKeys(value, required, optional = []) {
	const allowed = /* @__PURE__ */ new Set([...required, ...optional]);
	return required.every((key) => Object.hasOwn(value, key)) && optional.every((key) => Object.hasOwn(value, key) || !Reflect.has(value, key)) && Object.keys(value).every((key) => allowed.has(key));
}
/** Validate the received object's own keys before schema parsing copies its properties. */
function workerProtocolObject(shape) {
	const required = [];
	const optional = [];
	for (const [key, schema] of Object.entries(shape)) (schema.isOptional() ? optional : required).push(key);
	return custom((value) => isRecord(value) && hasExactOwnKeys(value, required, optional)).pipe(object(shape));
}
//#endregion
export { workerProtocolObject as n, hasExactOwnKeys as t };
