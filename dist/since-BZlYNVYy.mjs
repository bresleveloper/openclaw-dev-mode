//#region packages/gateway-protocol/src/schema/since.ts
/** Adds protocol-vintage metadata without changing the schema's validated value shape. */
function withSince(train, schema) {
	Object.assign(schema, { "x-openclaw-since": train });
	return schema;
}
//#endregion
export { withSince as t };
