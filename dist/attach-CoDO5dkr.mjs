import { u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { o as asRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { a as isAgentHarnessSessionKey, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE, s as isAgentHarnessSessionStoreEntryProtected } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { i as resolveSessionStoreKey } from "./session-store-key-BoleEY7N.mjs";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-CwzWysXO.mjs";
import "./session-utils-CJ7A982R.mjs";
import { i as createMcpAttachGrantServerConfig, o as getActiveMcpLoopbackRuntime } from "./mcp-http.loopback-runtime-CFrmBr1v.mjs";
import { i as mintAttachGrant, l as revokeAttachGrant } from "./mcp-grant-store-C4TWuDzs.mjs";
import { n as ensureMcpLoopbackServer } from "./mcp-http-B7_PVrSr.mjs";
//#region src/gateway/server-methods/attach.ts
const attachHandlers = {
	"attach.grant": async ({ params, respond, context }) => {
		const grantParams = asRecord(params);
		const cfg = context.getRuntimeConfig();
		const requestedSessionKey = normalizeOptionalString(grantParams.sessionKey) ?? "main";
		const requestedAgent = resolveRequestedSessionAgentId(cfg, requestedSessionKey, normalizeOptionalString(grantParams.agentId));
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const storageSessionKey = resolveSessionStoreKey({
			cfg,
			sessionKey: requestedSessionKey,
			storeAgentId: requestedAgent.agentId
		});
		const sessionKey = parseAgentSessionKey(storageSessionKey) ? storageSessionKey : `agent:${requestedAgent.agentId}:${storageSessionKey}`;
		const harnessEntry = isAgentHarnessSessionKey(storageSessionKey) ? resolveSessionEntryAccessTarget({
			cfg,
			sessionKey: storageSessionKey
		}).entry : void 0;
		if (isAgentHarnessSessionKey(storageSessionKey) && (!harnessEntry || isAgentHarnessSessionStoreEntryProtected(storageSessionKey, harnessEntry))) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE));
			return;
		}
		await ensureMcpLoopbackServer();
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
