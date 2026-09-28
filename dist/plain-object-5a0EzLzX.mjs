//#region src/infra/plain-object.ts
/**
* Config merge/patch accepts only `[object Object]` values, excluding Date/Map/Set/class instances.
* The stricter prototype contract prevents host objects from being merged as authored config.
*/
function isPlainObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]";
}
//#endregion
export { isPlainObject as t };
