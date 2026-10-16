//#region src/plugin-sdk/expect-runtime.ts
function expectDefined(value, context) {
	if (value === null || value === void 0) throw new Error("expected " + context + " to be defined");
	return value;
}
//#endregion
export { expectDefined as t };
