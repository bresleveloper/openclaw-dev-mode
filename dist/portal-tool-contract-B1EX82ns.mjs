import { Bc as PortalSummarySchema, Fc as PortalCloseResultSchema, Lc as PortalListResultSchema } from "./src-BRUl7oDv.mjs";
import { Type } from "typebox";
//#region src/agents/tools/portal-tool-contract.ts
const PORTAL_TOOL_DESCRIPTION = "Expose a local HTTP server or a conversation-attached environment's HTTP server (environmentId) through a portal route; verify browser access and app rendering in Control UI. Order matters: action=open with the port first, which returns the URL; then start the dev server as a background process on the same host, passing PORT and PUBLIC_URL from that result. Workspace may declare servers in .openclaw/portals.json. Proxies HTTP and WebSockets, so hot reload works; serves retry page until port listens. action=list and action=close manage portals. Use returned URLs unchanged; remote access requires private ingress or a reachable direct listener. Portals end at gateway restart.";
const PortalToolSchema = Type.Object({
	action: Type.String({
		enum: [
			"open",
			"list",
			"close"
		],
		description: "Portal action"
	}),
	port: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65535
	})),
	title: Type.Optional(Type.String({ minLength: 1 })),
	description: Type.Optional(Type.String()),
	path: Type.Optional(Type.String({ pattern: "^/" })),
	id: Type.Optional(Type.String({ minLength: 1 })),
	environmentId: Type.Optional(Type.String({
		minLength: 1,
		description: "Conversation-attached environment returned by the environment tool; omit for the current execution host."
	}))
}, { additionalProperties: false });
const PortalOutputSchema = Type.Union([
	PortalSummarySchema,
	PortalListResultSchema,
	PortalCloseResultSchema
]);
//#endregion
export { PortalOutputSchema as n, PortalToolSchema as r, PORTAL_TOOL_DESCRIPTION as t };
