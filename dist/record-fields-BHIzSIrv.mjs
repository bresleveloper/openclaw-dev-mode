//#region extensions/workboard/record-fields.ts
function definedFields(fields) {
	for (const key in fields) if (fields[key] === void 0) delete fields[key];
	return fields;
}
//#endregion
export { definedFields as t };
