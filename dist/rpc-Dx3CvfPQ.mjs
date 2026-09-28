import { C as parseStrictNonNegativeInteger, w as parseStrictPositiveInteger, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { r as callGatewayFromCliWithTransport } from "./gateway-rpc-DXO3PHhc.mjs";
import { u as readConnectErrorDetailCode } from "./connect-error-details-HKRZ1hRc.mjs";
import { s as readMissingScopeError } from "./gateway-error-details-D85F07e9.mjs";
import { t as GatewayClientRequestError } from "./request-error-DXOPJLBU.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-G1LpD3Dj.mjs";
import { n as resolveNodeFromNodeList } from "./node-resolve-Cy3jnd18.mjs";
import { n as parsePairingList, t as parseNodeList } from "./node-list-parse-uI7vQ62q.mjs";
import { randomUUID } from "node:crypto";
//#region src/cli/nodes-cli/rpc.ts
const STORED_DEVICE_AUTH_FALLBACK_DETAIL_CODES = /* @__PURE__ */ new Set([
	"AUTH_REQUIRED",
	"AUTH_UNAUTHORIZED",
	"AUTH_TOKEN_MISMATCH",
	"AUTH_DEVICE_TOKEN_MISMATCH",
	"AUTH_SCOPE_MISMATCH",
	"PAIRING_REQUIRED"
]);
const NODE_PAIR_APPROVAL_GATEWAY_METHODS = /* @__PURE__ */ new Set(["node.pair.list", "node.pair.approve"]);
const DEFAULT_NODES_RPC_TIMEOUT_MS = 1e4;
function resolveNodesTransportTimeoutMs(opts, invokeTimeoutMs) {
	const transportTimeoutMs = parseTimeoutMsWithFallback(opts.timeout, DEFAULT_NODES_RPC_TIMEOUT_MS, { invalidType: "error" });
	if (invokeTimeoutMs === 0) return null;
	if (typeof invokeTimeoutMs !== "number" || !Number.isSafeInteger(invokeTimeoutMs) || invokeTimeoutMs <= 0) return transportTimeoutMs;
	return Math.max(transportTimeoutMs, invokeTimeoutMs + DEFAULT_NODES_RPC_TIMEOUT_MS);
}
function isDiagnosticsAuthFallbackError(value) {
	if (value instanceof Error && (value.name === "GatewayCredentialsRequiredError" || value.name === "GatewayStoredDeviceAuthUnavailableError" || value.name === "GatewayLocalBackendSharedAuthUnavailableError")) return true;
	if (!(value instanceof Error) || value.name !== "GatewayClientRequestError") return false;
	const details = value.details;
	const detailCode = readConnectErrorDetailCode(details);
	if (detailCode !== null && STORED_DEVICE_AUTH_FALLBACK_DETAIL_CODES.has(detailCode)) return true;
	return readMissingScopeError(value)?.missingScope === "operator.read";
}
function isUnknownGatewayMethodError(value, method) {
	return value instanceof GatewayClientRequestError && value.gatewayCode === "INVALID_REQUEST" && !value.retryable && value.message === `unknown method: ${method}` && (value.retryAfterMs === void 0 || Number.isInteger(value.retryAfterMs) && value.retryAfterMs >= 0);
}
/** Attach shared Gateway connection/json options to a node command. */
const nodesCallOpts = (cmd, defaults) => cmd.option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--timeout <ms>", "Timeout in ms", String(defaults?.timeoutMs ?? 1e4)).option("--json", "Output JSON", false);
/** Call a Gateway method through the lazily loaded node CLI RPC runtime. */
const callNodesGatewayCli = async (method, opts, params, callOpts) => {
	const invokeTimeoutMs = method === "node.invoke" && params !== null && typeof params === "object" && !Array.isArray(params) ? params.timeoutMs : void 0;
	const useLocalBackendSharedAuth = callOpts?.useLocalBackendSharedAuth === true;
	return await callGatewayFromCliWithTransport(method, opts, params, {
		label: `Nodes ${method}`,
		timeoutMs: resolveNodesTransportTimeoutMs(opts, invokeTimeoutMs),
		scopes: callOpts?.scopes,
		useStoredDeviceAuth: callOpts?.useStoredDeviceAuth,
		requiredStoredDeviceAuthScopes: callOpts?.requiredStoredDeviceAuthScopes,
		requireLocalBackendSharedAuth: useLocalBackendSharedAuth,
		clientName: useLocalBackendSharedAuth ? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT : GATEWAY_CLIENT_NAMES.CLI,
		mode: useLocalBackendSharedAuth ? GATEWAY_CLIENT_MODES.BACKEND : GATEWAY_CLIENT_MODES.CLI,
		sharedStateMode: "read-only"
	});
};
/** Read node diagnostics with pairing details when authorized, otherwise keep read-only access. */
const callNodeDiagnosticsGatewayCli = async (method, opts, params) => {
	try {
		return await callNodesGatewayCli(method, opts, params, {
			useStoredDeviceAuth: true,
			requiredStoredDeviceAuthScopes: ["operator.read", "operator.pairing"]
		});
	} catch (error) {
		if (!isDiagnosticsAuthFallbackError(error)) throw error;
	}
	try {
		return await callNodesGatewayCli(method, opts, params, {
			scopes: ["operator.read", "operator.pairing"],
			useLocalBackendSharedAuth: true
		});
	} catch (error) {
		if (!isDiagnosticsAuthFallbackError(error)) throw error;
	}
	return await callNodesGatewayCli(method, opts, params);
};
/** Call pairing approval methods with explicit operator scopes. */
const callNodePairApprovalGatewayCli = async (method, opts, params, callOpts) => {
	if (!NODE_PAIR_APPROVAL_GATEWAY_METHODS.has(method)) throw new Error(`unsupported node pair approval gateway method: ${method}`);
	return await callGatewayFromCliWithTransport(method, opts, params, {
		label: `Nodes ${method}`,
		timeoutMs: resolveNodesTransportTimeoutMs(opts),
		scopes: callOpts.scopes,
		clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
		mode: GATEWAY_CLIENT_MODES.BACKEND,
		sharedStateMode: "read-only"
	});
};
/** Build a node.invoke payload with an idempotency key and optional timeout. */
function buildNodeInvokeParams(params) {
	const invokeParams = {
		nodeId: params.nodeId,
		command: params.command,
		params: params.params,
		idempotencyKey: params.idempotencyKey ?? randomUUID()
	};
	if (typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)) invokeParams.timeoutMs = params.timeoutMs;
	return invokeParams;
}
function hasOptionalValue(value) {
	return value !== void 0 && value !== null;
}
/** Parse an optional positive integer node CLI flag. */
function parseOptionalNodePositiveInteger(value, flag) {
	if (!hasOptionalValue(value)) return;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw new Error(`${flag} must be a positive integer.`);
	return parsed;
}
/** Parse an optional non-negative integer node CLI flag. */
function parseOptionalNodeNonNegativeInteger(value, flag) {
	if (!hasOptionalValue(value)) return;
	const parsed = parseStrictNonNegativeInteger(value);
	if (parsed === void 0) throw new Error(`${flag} must be a non-negative integer.`);
	return parsed;
}
/** Parse an optional finite number node CLI flag with optional bounds. */
function parseOptionalNodeFiniteNumber(value, flag, bounds) {
	if (!hasOptionalValue(value)) return;
	const parsed = parseStrictFiniteNumber(value);
	if (parsed === void 0) throw new Error(`${flag} must be a finite number.`);
	if (bounds?.minExclusive !== void 0 && parsed <= bounds.minExclusive) throw new Error(`${flag} must be greater than ${bounds.minExclusive}.`);
	if (bounds?.minInclusive !== void 0 && parsed < bounds.minInclusive) throw new Error(`${flag} must be at least ${bounds.minInclusive}.`);
	if (bounds?.maxInclusive !== void 0 && parsed > bounds.maxInclusive) throw new Error(`${flag} must be at most ${bounds.maxInclusive}.`);
	return parsed;
}
/** Return the local-development hint for known unsigned Peekaboo bridge authorization failures. */
function unauthorizedHintForMessage(message) {
	const haystack = normalizeLowercaseStringOrEmpty(message);
	if (haystack.includes("unauthorizedclient") || haystack.includes("bridge client is not authorized") || haystack.includes("unsigned bridge clients are not allowed")) return [
		"peekaboo bridge rejected the client.",
		"sign the peekaboo CLI (TeamID Y5PE65HELJ) or launch the host with",
		"PEEKABOO_ALLOW_UNSIGNED_SOCKET_CLIENTS=1 for local dev."
	].join(" ");
	return null;
}
/** Resolve a node query to a node id via live node list or paired-node fallback. */
async function resolveCliNodeId(opts, query) {
	return (await resolveCliNode(opts, query)).nodeId;
}
/** Resolve a node through the pairing-aware diagnostics view when available. */
async function resolveNodeDiagnosticsId(opts, query) {
	try {
		const res = await callNodeDiagnosticsGatewayCli("node.list", opts, {});
		return resolveNodeFromNodeList(parseNodeList(res), query).nodeId;
	} catch (error) {
		if (!isUnknownGatewayMethodError(error, "node.list")) throw error;
		return await resolveCliNodeId(opts, query);
	}
}
/** Resolve a node query to the best available node record. */
async function resolveCliNode(opts, query) {
	let nodes;
	try {
		const res = await callNodesGatewayCli("node.list", opts, {});
		nodes = parseNodeList(res);
	} catch (error) {
		if (!isUnknownGatewayMethodError(error, "node.list")) throw error;
		const res = await callNodesGatewayCli("node.pair.list", opts, {});
		const { paired } = parsePairingList(res);
		nodes = paired.map((n) => ({
			nodeId: n.nodeId,
			displayName: n.displayName,
			platform: n.platform,
			version: n.version,
			remoteIp: n.remoteIp
		}));
	}
	return resolveNodeFromNodeList(nodes, query);
}
//#endregion
export { nodesCallOpts as a, parseOptionalNodePositiveInteger as c, resolveNodeDiagnosticsId as d, unauthorizedHintForMessage as f, callNodesGatewayCli as i, resolveCliNode as l, callNodeDiagnosticsGatewayCli as n, parseOptionalNodeFiniteNumber as o, callNodePairApprovalGatewayCli as r, parseOptionalNodeNonNegativeInteger as s, buildNodeInvokeParams as t, resolveCliNodeId as u };
