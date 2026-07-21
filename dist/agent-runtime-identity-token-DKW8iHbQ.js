import { u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { l as ensureExecApprovals, m as loadExecApprovals } from "./exec-approvals-BIKWP8_V.js";
import { createHmac, timingSafeEqual } from "node:crypto";
//#region src/gateway/agent-runtime-identity-token.ts
const AGENT_RUNTIME_IDENTITY_TOKEN_CONTEXT = "openclaw:gateway-agent-runtime-identity-token:v1";
const AGENT_RUNTIME_IDENTITY_TOKEN_KIND = "agent-runtime";
function readSharedAgentRuntimeIdentitySecret() {
	return loadExecApprovals().socket?.token?.trim() || null;
}
function requireSharedAgentRuntimeIdentitySecret() {
	const token = ensureExecApprovals().socket?.token?.trim();
	if (!token) throw new Error("Unable to mint agent runtime identity token without local socket credentials.");
	return token;
}
function signPayload(secret, payload) {
	return createHmac("sha256", secret).update(AGENT_RUNTIME_IDENTITY_TOKEN_CONTEXT).update("\0").update(payload).digest("base64url");
}
function signatureMatches(value, expected) {
	const valueBytes = Buffer.from(value);
	const expectedBytes = Buffer.from(expected);
	return valueBytes.length === expectedBytes.length && timingSafeEqual(valueBytes, expectedBytes);
}
function encodePayload(payload) {
	return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}
function decodePayload(value) {
	try {
		const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
		if (!parsed || typeof parsed !== "object") return;
		const raw = parsed;
		if (raw.kind !== AGENT_RUNTIME_IDENTITY_TOKEN_KIND || typeof raw.agentId !== "string" || typeof raw.sessionKey !== "string") return;
		const agentId = normalizeAgentId(raw.agentId);
		const sessionKey = raw.sessionKey.trim();
		if (!agentId || !sessionKey) return;
		return {
			kind: AGENT_RUNTIME_IDENTITY_TOKEN_KIND,
			agentId,
			sessionKey
		};
	} catch {
		return;
	}
}
/** Mint an opaque token that lets trusted local agent-tool clients identify their agent. */
function mintAgentRuntimeIdentityToken(params) {
	const payload = encodePayload({
		kind: AGENT_RUNTIME_IDENTITY_TOKEN_KIND,
		agentId: normalizeAgentId(params.agentId),
		sessionKey: params.sessionKey.trim()
	});
	return `${payload}.${signPayload(requireSharedAgentRuntimeIdentitySecret(), payload)}`;
}
/** Validate a presented agent runtime token and return the internal caller identity. */
function verifyAgentRuntimeIdentityToken(value) {
	const token = value?.trim();
	if (!token) return;
	const [payloadPart, signature, ...extra] = token.split(".");
	if (!payloadPart || !signature || extra.length > 0) return;
	const payload = decodePayload(payloadPart);
	if (!payload) return;
	const sharedSecret = readSharedAgentRuntimeIdentitySecret();
	if (!sharedSecret || !signatureMatches(signature, signPayload(sharedSecret, payloadPart))) return;
	return {
		kind: "agentRuntime",
		agentId: payload.agentId,
		sessionKey: payload.sessionKey
	};
}
//#endregion
export { verifyAgentRuntimeIdentityToken as n, mintAgentRuntimeIdentityToken as t };
