import { u as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { p as isValidSecretRef } from "./ref-contract-D0kWy5jy.mjs";
import "./worker-protocol-primitives-BajTgPT4.mjs";
import "./worker-admission-CNeLWzVQ.mjs";
//#region src/gateway/worker-environments/state.ts
const WORKER_ENVIRONMENT_TERMINAL_STATES = [
	"destroyed",
	"failed",
	"orphaned"
];
function isTerminalWorkerEnvironmentState(state) {
	return WORKER_ENVIRONMENT_TERMINAL_STATES.some((terminal) => terminal === state);
}
const TRANSITIONS = {
	requested: ["provisioning", "failed"],
	provisioning: [
		"bootstrapping",
		"ready",
		"draining",
		"failed"
	],
	bootstrapping: [
		"ready",
		"draining",
		"orphaned"
	],
	ready: [
		"bootstrapping",
		"attached",
		"idle",
		"draining",
		"orphaned"
	],
	attached: [
		"idle",
		"draining",
		"orphaned"
	],
	idle: [
		"bootstrapping",
		"attached",
		"draining",
		"orphaned"
	],
	draining: ["destroying", "orphaned"],
	destroying: [
		"destroyed",
		"failed",
		"orphaned"
	],
	destroyed: [],
	failed: [],
	orphaned: []
};
function parseWorkerEnvironmentState(value) {
	if (typeof value !== "string" || !Object.hasOwn(TRANSITIONS, value)) throw new Error(`Invalid persisted worker environment state: ${String(value)}`);
	return value;
}
function canTransitionWorkerEnvironment(from, to) {
	return TRANSITIONS[from].some((candidate) => candidate === to);
}
function workerEnvironmentStateRequiresLease(state) {
	return state !== "requested" && state !== "provisioning" && state !== "failed";
}
//#endregion
//#region src/gateway/worker-environments/store-validation.ts
const WORKER_BUNDLE_HASH_PATTERN = /^[a-f0-9]{64}$/u;
const MAX_HOST_KEY_LENGTH = 16384;
const MAX_SSH_FALLBACK_PORTS = 10;
const WORKER_CREDENTIAL_HASH_PATTERN = /^[A-Za-z0-9_-]{43}$/u;
const OPENSSH_HOST_KEY_TYPE_PATTERN = /^(?:ssh|ecdsa-sha2|sk-(?:ssh|ecdsa-sha2))-[A-Za-z0-9@._+-]+$/u;
const OPENSSH_HOST_KEY_DATA_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/u;
function requireWorkerEnvironmentString(value, field) {
	if (typeof value !== "string" || !value.trim()) throw new Error(`Worker environment ${field} must be a non-empty string`);
	return value.trim();
}
function normalizeOpenSshHostKey(value) {
	if (typeof value !== "string" || value.length > MAX_HOST_KEY_LENGTH || value.includes("\n") || value.includes("\r")) throw new Error("Worker environment SSH host key must be one OpenSSH public-key line");
	const tokens = value.trim().split(/\s+/u);
	const [algorithm, encodedKey] = tokens;
	if (tokens.length !== 2 || !algorithm || !encodedKey || !OPENSSH_HOST_KEY_TYPE_PATTERN.test(algorithm) || !OPENSSH_HOST_KEY_DATA_PATTERN.test(encodedKey) || encodedKey.length % 4 !== 0) throw new Error("Worker environment SSH host key must use OpenSSH public-key format");
	return `${algorithm} ${encodedKey}`;
}
function normalizeBootstrapReceipt(value) {
	const bundleHash = requireWorkerEnvironmentString(value.bundleHash, "bootstrap bundle hash");
	if (!WORKER_BUNDLE_HASH_PATTERN.test(bundleHash)) throw new Error("Worker environment bootstrap bundle hash must be lowercase SHA-256 hex");
	if (!Array.isArray(value.protocolFeatures)) throw new Error("Worker environment bootstrap protocol features must be an array");
	if (value.protocolFeatures.length > 64 || value.protocolFeatures.some((feature) => typeof feature !== "string" || feature.trim().length > 128)) throw new Error("Worker environment bootstrap protocol features exceed admission limits");
	if (value.installKind !== void 0 && value.installKind !== "bundle" && value.installKind !== "local") throw new Error("Worker environment bootstrap install kind is invalid");
	return {
		bundleHash,
		openclawVersion: requireWorkerEnvironmentString(value.openclawVersion, "bootstrap OpenClaw version"),
		protocolFeatures: normalizeSortedUniqueTrimmedStringList(value.protocolFeatures),
		...value.installKind ? { installKind: value.installKind } : {}
	};
}
function normalizeCredentialHash(value) {
	const credentialHash = requireWorkerEnvironmentString(value, "credential hash");
	if (!WORKER_CREDENTIAL_HASH_PATTERN.test(credentialHash)) throw new Error("Worker credential hash must be a SHA-256 base64url digest");
	return credentialHash;
}
function normalizeSessionId(value) {
	if (value === null) return null;
	const sessionId = requireWorkerEnvironmentString(value, "credential session id");
	if (sessionId.length > 256) throw new Error("Worker credential session id exceeds the admission limit");
	return sessionId;
}
function normalizeAttachedSessionIds(value) {
	const sessionIds = normalizeSortedUniqueTrimmedStringList(value);
	for (const sessionId of sessionIds) if (sessionId.length > 256) throw new Error("Worker environment attached session id exceeds the admission limit");
	return sessionIds;
}
function assertCredentialSessionBinding(attachedSessionIds, sessionId) {
	if (sessionId !== (attachedSessionIds[0] ?? null)) throw new Error("Worker credential session does not match the environment attachment");
}
function normalizeRpcSetVersion(value) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) throw new Error("Worker credential RPC-set version must be a positive safe integer");
	return value;
}
function normalizeExpiry(value) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error("Worker credential expiry must be a non-negative safe integer");
	return value;
}
function normalizeWorkerSshEndpoint(value) {
	const host = requireWorkerEnvironmentString(value.host, "SSH host");
	const user = requireWorkerEnvironmentString(value.user, "SSH user");
	const hostKey = normalizeOpenSshHostKey(value.hostKey);
	if (!Number.isSafeInteger(value.port) || value.port < 1 || value.port > 65535) throw new Error("Worker environment SSH port must be an integer from 1 through 65535");
	if (!isValidSecretRef(value.keyRef)) throw new Error("Worker environment SSH key must be a canonical SecretRef");
	if (value.fallbackPorts !== void 0 && !Array.isArray(value.fallbackPorts)) throw new Error("Worker environment SSH fallback ports must be an array");
	const seen = /* @__PURE__ */ new Set([value.port]);
	const fallbackPorts = [];
	for (const port of value.fallbackPorts ?? []) {
		if (!Number.isSafeInteger(port) || port < 1 || port > 65535) throw new Error("Worker environment SSH fallback ports must be integers from 1 through 65535");
		if (!seen.has(port)) {
			seen.add(port);
			fallbackPorts.push(port);
		}
	}
	if (fallbackPorts.length > MAX_SSH_FALLBACK_PORTS) throw new Error(`Worker environment SSH fallback ports cannot exceed ${MAX_SSH_FALLBACK_PORTS}`);
	return {
		host,
		port: value.port,
		...fallbackPorts.length > 0 ? { fallbackPorts } : {},
		user,
		hostKey,
		keyRef: { ...value.keyRef }
	};
}
function assertShape(state, leaseId, nodeDeviceId, sshEndpoint, desktop, bootstrapReceipt, attachedSessionIds) {
	if (sshEndpoint && nodeDeviceId) throw new Error("Worker environment cannot retain both SSH and node transports");
	if (workerEnvironmentStateRequiresLease(state)) {
		if (!leaseId) throw new Error(`Worker environment state ${state} requires a provider lease`);
		if (state === "bootstrapping" && !sshEndpoint) throw new Error("Worker environment bootstrap requires an SSH endpoint reference");
		if (state === "ready" && !sshEndpoint && !nodeDeviceId) throw new Error("Ready worker environment requires a transport binding");
	} else if (leaseId || sshEndpoint || desktop) throw new Error(`Worker environment state ${state} cannot retain a provider lease`);
	if (state === "bootstrapping" && bootstrapReceipt) throw new Error("Bootstrapping worker environment cannot retain a stale bootstrap receipt");
	if (state === "attached" && attachedSessionIds.length !== 1) throw new Error("Attached worker environment requires exactly one session id");
	if (state !== "attached" && attachedSessionIds.length !== 0) throw new Error("Only an attached worker environment may retain a session id");
}
//#endregion
export { normalizeCredentialHash as a, normalizeSessionId as c, canTransitionWorkerEnvironment as d, isTerminalWorkerEnvironmentState as f, normalizeBootstrapReceipt as i, normalizeWorkerSshEndpoint as l, assertShape as n, normalizeExpiry as o, parseWorkerEnvironmentState as p, normalizeAttachedSessionIds as r, normalizeRpcSetVersion as s, assertCredentialSessionBinding as t, requireWorkerEnvironmentString as u };
