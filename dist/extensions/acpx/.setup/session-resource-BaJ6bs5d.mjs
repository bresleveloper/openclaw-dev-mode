import { AcpRuntimeError } from "../runtime-api.js";
import "node:module";
import { createHash } from "node:crypto";
import { normalizeAgentId, parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region extensions/acpx/src/session-resource.ts
var session_resource_exports = /* @__PURE__ */ __exportAll({ resolveAcpxSessionResource: () => resolveAcpxSessionResource });
/** Logical OpenClaw keys stay intact; only bare backend resource names need a namespace. */
function resolveAcpxSessionResource(target) {
	const sessionKey = target.sessionKey.trim().toLowerCase();
	const encodedOwner = parseAgentSessionKey(sessionKey)?.agentId;
	const agentId = target.agentId?.trim() ? normalizeAgentId(target.agentId) : encodedOwner;
	if (!sessionKey || encodedOwner && agentId !== encodedOwner || !encodedOwner && !agentId) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session owner is missing or disagrees with its logical key. Pass the OpenClaw agentId that owns this session.", { detailCode: "SESSION_OWNER_UNSUPPORTED" });
	if (encodedOwner) return sessionKey;
	return `openclaw-owner-v1-${createHash("sha256").update(JSON.stringify([agentId, sessionKey])).digest("hex")}`;
}
//#endregion
export { session_resource_exports as n, resolveAcpxSessionResource as t };
