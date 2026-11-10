import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { a as mintAttachGrant, u as revokeAttachGrant } from "./server-connection-work-CPT9-wld.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as resolveRequestedSessionStoreTarget } from "./session-store-key-DKpto8R6.mjs";
import { n as readResolvedSessionEntryInWorker } from "./session-accessor.entry-read-runtime-BoYobsOQ.mjs";
import { a as isAgentHarnessSessionKey, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE, s as isAgentHarnessSessionStoreEntryProtected } from "./agent-harness-session-key-zbrcLVpT.mjs";
import "./session-accessor.entry-BLpjjUTc.mjs";
import { i as createMcpAttachGrantServerConfig, o as getActiveMcpLoopbackRuntime } from "./mcp-http.loopback-runtime-DxTYlVrU.mjs";
import { n as ensureMcpLoopbackServer } from "./mcp-http-DG-PZ6Kr.mjs";
//#region src/gateway/server-methods/attach.ts
const attachHandlers = {
	"attach.grant": async ({ params, respond, context }) => {
		const grantParams = asRecord(params);
		const cfg = context.getRuntimeConfig();
		const requestedSessionKey = normalizeOptionalString(grantParams.sessionKey) ?? "main";
		const requestedAgent = resolveRequestedSessionStoreTarget(cfg, requestedSessionKey, normalizeOptionalString(grantParams.agentId));
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { sessionKey: storageSessionKey, agentId } = requestedAgent.value;
		const sessionKey = parseAgentSessionKey(storageSessionKey) ? storageSessionKey : `agent:${agentId}:${storageSessionKey}`;
		await ensureMcpLoopbackServer();
		const harnessEntry = isAgentHarnessSessionKey(storageSessionKey) ? await readResolvedSessionEntryInWorker({
			cfg,
			sessionKey: storageSessionKey
		}) : void 0;
		if (isAgentHarnessSessionKey(storageSessionKey) && (!harnessEntry || isAgentHarnessSessionStoreEntryProtected(storageSessionKey, harnessEntry))) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE));
			return;
		}
		const runtime = getActiveMcpLoopbackRuntime();
		if (!runtime) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "mcp loopback server unavailable"));
			return;
		}
		const grant = mintAttachGrant({
			sessionKey,
			ttlMs: asPositiveFiniteNumber(grantParams.ttlMs)
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
		const token = normalizeOptionalString(asRecord(params).token);
		if (!token) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "token is required"));
			return;
		}
		respond(true, { revoked: revokeAttachGrant(token) });
	}
};
//#endregion
export { attachHandlers };
