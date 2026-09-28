import { types } from "node:util";
//#region src/plugins/plugin-return-value.ts
/** Capture a returned then method once without turning synchronous values into async work. */
function resolvePluginReturnPromise(value) {
	if (types.isPromise(value)) return Promise.resolve(value);
	if (value === null || typeof value !== "object" && typeof value !== "function") return;
	let then;
	try {
		then = Reflect.get(value, "then");
	} catch (error) {
		return Promise.reject(error);
	}
	if (typeof then !== "function") return;
	return Promise.resolve({ then(resolve, reject) {
		Reflect.apply(then, value, [resolve, reject]);
	} });
}
//#endregion
export { resolvePluginReturnPromise as t };
