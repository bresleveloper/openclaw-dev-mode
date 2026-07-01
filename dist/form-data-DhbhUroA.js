//#region src/infra/net/form-data.ts
function isFormDataLike(value) {
	return typeof value === "object" && value !== null && typeof value.entries === "function" && value[Symbol.toStringTag] === "FormData";
}
//#endregion
export { isFormDataLike as t };
