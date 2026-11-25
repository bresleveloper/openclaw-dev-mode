import { n as __exportAll } from "./runtime-doctor-migrations-CSvRANPN.mjs";
import { AcpRuntimeError } from "../runtime-api.js";
import { sha256Hex } from "openclaw/plugin-sdk/node-crypto-runtime";
import { normalizeAgentId, parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
// extensions/acpx/src/session-resource.ts
var session_resource_exports = /* @__PURE__ */ __exportAll({ resolveAcpxSessionResource: () => resolveAcpxSessionResource });
/** Logical OpenClaw keys stay intact; only bare backend resource names need a namespace. */
function resolveAcpxSessionResource(target) {
	const sessionKey = target.sessionKey.trim().toLowerCase();
	const encodedOwner = parseAgentSessionKey(sessionKey)?.agentId;
	const agentId = target.agentId?.trim() ? normalizeAgentId(target.agentId) : encodedOwner;
	if (!sessionKey || encodedOwner && agentId !== encodedOwner || !encodedOwner && !agentId) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session owner is missing or disagrees with its logical key. Pass the OpenClaw agentId that owns this session.", { detailCode: "SESSION_OWNER_UNSUPPORTED" });
	if (encodedOwner) return sessionKey;
	return `openclaw-owner-v1-${sha256Hex(JSON.stringify([agentId, sessionKey]))}`;
}
export { session_resource_exports as n, resolveAcpxSessionResource as t };
