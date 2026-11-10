import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/agent-summary-enums.ts
const AgentKindSchema = Type.Union([Type.Literal("agent"), Type.Literal("system")]);
const AgentCreatedViaSchema = Type.Union([
	Type.Literal("operator"),
	Type.Literal("agent"),
	Type.Literal("claw")
]);
const AgentOwnershipSchema = Type.Union([
	Type.Literal("sole"),
	Type.Literal("legacy"),
	Type.Literal("explicit")
]);
//#endregion
export { AgentKindSchema as n, AgentOwnershipSchema as r, AgentCreatedViaSchema as t };
