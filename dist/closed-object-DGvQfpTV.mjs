import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/closed-object.ts
const identityKey = "~openclawClosedObjectIdentity";
function closedObject(properties) {
	const schema = Type.Object(properties, { additionalProperties: false });
	Object.defineProperty(schema, identityKey, { value: Symbol("closedObject") });
	return schema;
}
//#endregion
export { closedObject as t };
