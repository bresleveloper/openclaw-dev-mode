import { o as optionalPositiveIntegerSchema } from "./typebox-DIBvVmm8.mjs";
import { Type } from "typebox";
//#region src/agents/tools/gateway-schema.ts
/**
* Shared Gateway tool schema fragments.
*
* Keeps gateway URL/token/timeout parameters aligned across tools that call Gateway methods.
*/
/** Returns optional gateway URL/token/timeout schema properties for tool params. */
function gatewayCallOptionSchemaProperties() {
	return {
		gatewayUrl: Type.Optional(Type.String()),
		gatewayToken: Type.Optional(Type.String()),
		timeoutMs: optionalPositiveIntegerSchema()
	};
}
//#endregion
export { gatewayCallOptionSchemaProperties as t };
