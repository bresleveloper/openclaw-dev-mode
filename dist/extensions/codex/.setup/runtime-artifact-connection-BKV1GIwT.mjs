import { t as codexAppServerStartOptionsKey } from "./config-options-ZyoXdPOW.mjs";
import "./config-runtime-DUl8J_Uu.mjs";
import { r as resolveCodexAppServerUnixSocketPath } from "./transport-websocket-ChqCf46P.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { sha256Hex } from "openclaw/plugin-sdk/node-crypto-runtime";
// extensions/codex/src/app-server/runtime-artifact-connection.ts
/** Configured-service identity, distinct from local executable attestation. */
const CONNECTION_ID_PREFIX = "codex-app-server:connection:v1:";
const CONNECTION_HASH_DOMAIN = "openclaw-codex-configured-connection-v1\0";
function captureCodexConfiguredConnection(start) {
	if (start.transport !== "websocket" && start.transport !== "unix" || start.transport === "websocket" && !start.url?.trim()) throw new Error("Verified remote Codex inference requires a configured socket endpoint");
	const unixSocketPath = resolveCodexAppServerUnixSocketPath(start);
	const key = codexAppServerStartOptionsKey({
		transport: start.transport,
		command: "",
		args: [],
		url: unixSocketPath ? `unix://${path.resolve(unixSocketPath)}` : start.url,
		authToken: start.authToken,
		headers: start.headers
	});
	return {
		kind: "configured-connection",
		transport: start.transport,
		selectionFingerprint: sha256Hex(key)
	};
}
function finalizeCodexConfiguredConnection(params) {
	const after = captureCodexConfiguredConnection(params.startOptions);
	if (JSON.stringify(after) !== JSON.stringify(params.before)) throw new Error("Codex configured connection changed during startup");
	const serverVersion = params.runtimeIdentity?.serverVersion?.trim();
	if (!serverVersion) throw new Error("Codex app-server did not report an initialized runtime identity");
	const descriptor = {
		...after,
		runtimeIdentityFingerprint: sha256Hex(JSON.stringify({
			serverVersion,
			userAgent: params.runtimeIdentity?.userAgent ?? null,
			codexHome: params.runtimeIdentity?.codexHome ?? null,
			platformFamily: params.runtimeIdentity?.platformFamily ?? null,
			platformOs: params.runtimeIdentity?.platformOs ?? null
		}))
	};
	return Object.freeze({
		id: encodeConnectionId(descriptor),
		fingerprint: fingerprint(descriptor)
	});
}
function isCodexConfiguredConnectionArtifact(id) {
	return id.startsWith(CONNECTION_ID_PREFIX);
}
function validateCodexConfiguredConnectionCapture(binding, capture) {
	try {
		const descriptor = decodeConnectionId(binding.id);
		return descriptor.transport === capture.transport && descriptor.selectionFingerprint === capture.selectionFingerprint && binding.fingerprint === fingerprint(descriptor);
	} catch {
		return false;
	}
}
function encodeConnectionId(descriptor) {
	return `${CONNECTION_ID_PREFIX}${Buffer.from(JSON.stringify(descriptor)).toString("base64url")}`;
}
function fingerprint(descriptor) {
	return sha256Hex(`${CONNECTION_HASH_DOMAIN}${JSON.stringify(descriptor)}`);
}
function decodeConnectionId(id) {
	if (!isCodexConfiguredConnectionArtifact(id) || Buffer.byteLength(id) > 2048) throw new Error("Invalid Codex configured connection artifact");
	const value = JSON.parse(Buffer.from(id.slice(31), "base64url").toString("utf8"));
	if (!isRecord(value) || value.kind !== "configured-connection" || value.transport !== "websocket" && value.transport !== "unix" || typeof value.selectionFingerprint !== "string" || !/^[a-f0-9]{64}$/u.test(value.selectionFingerprint) || typeof value.runtimeIdentityFingerprint !== "string" || !/^[a-f0-9]{64}$/u.test(value.runtimeIdentityFingerprint)) throw new Error("Invalid Codex configured connection descriptor");
	const descriptor = {
		kind: value.kind,
		transport: value.transport,
		selectionFingerprint: value.selectionFingerprint,
		runtimeIdentityFingerprint: value.runtimeIdentityFingerprint
	};
	if (encodeConnectionId(descriptor) !== id) throw new Error("Invalid noncanonical Codex configured connection artifact");
	return descriptor;
}
export { captureCodexConfiguredConnection, finalizeCodexConfiguredConnection, isCodexConfiguredConnectionArtifact, validateCodexConfiguredConnectionCapture };
