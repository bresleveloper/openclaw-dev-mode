import { a as resolveMainSessionKey } from "./main-session-D7Jmp9DO.js";
import "./sessions-BIAJdhW6.js";
import "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
import { i as createMcpAttachGrantServerConfig, o as getActiveMcpLoopbackRuntime } from "./mcp-http.loopback-runtime-DGZ9iwzQ.js";
import { a as mintAttachGrant, n as ensureMcpLoopbackServer, o as revokeAttachGrant } from "./mcp-http-DWOfc7xN.js";
//#region src/gateway/server-methods/attach.ts
function paramRecord(params) {
	return params && typeof params === "object" ? params : {};
}
function readString(params, key) {
	const value = params[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readPositiveNumber(params, key) {
	const value = params[key];
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
const attachHandlers = {
	"attach.grant": async ({ params, respond, context }) => {
		const grantParams = paramRecord(params);
		await ensureMcpLoopbackServer();
		const runtime = getActiveMcpLoopbackRuntime();
		if (!runtime) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "mcp loopback server unavailable"));
			return;
		}
		const grant = mintAttachGrant({
			sessionKey: readString(grantParams, "sessionKey") ?? resolveMainSessionKey(context.getRuntimeConfig()),
			ttlMs: readPositiveNumber(grantParams, "ttlMs")
		});
		respond(true, {
			sessionKey: grant.sessionKey,
			token: grant.token,
			expiresAtMs: grant.expiresAtMs,
			mcpConfig: createMcpAttachGrantServerConfig(runtime.port),
			env: { OPENCLAW_MCP_TOKEN: grant.token }
		});
	},
	"attach.revoke": async ({ params, respond }) => {
		const token = readString(paramRecord(params), "token");
		if (!token) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "token is required"));
			return;
		}
		respond(true, { revoked: revokeAttachGrant(token) });
	}
};
//#endregion
export { attachHandlers };
