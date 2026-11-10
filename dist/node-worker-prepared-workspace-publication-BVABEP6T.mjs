import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as normalizeSecretInputString, h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { r as createStateDomainPublication } from "./state-domain-publication-CEKqcWHX.mjs";
import { t as materializeSecretInput } from "./resolve-secret-input-string-CzpOIZsG.mjs";
//#region src/node-host/gateway-cloudflare-access.ts
const CF_ACCESS_CLIENT_ID_ENV = "CF_ACCESS_CLIENT_ID";
const CF_ACCESS_CLIENT_SECRET_ENV = "CF_ACCESS_CLIENT_SECRET";
function normalizeCloudflareAccessSecretInput(value, path) {
	const ref = parseSecretRef(value);
	if (ref) return ref;
	const literal = normalizeSecretInputString(value);
	if (literal) return literal;
	throw new Error(`invalid node-host ${path}: expected a non-empty SecretInput`);
}
function normalizeNodeHostCloudflareAccessConfig(value) {
	if (value === void 0 || value === null) return;
	if (!isRecord(value) || Object.keys(value).length !== 2 || !("clientId" in value) || !("clientSecret" in value)) throw new Error("invalid node-host gateway.cloudflareAccess: expected clientId and clientSecret");
	return {
		clientId: normalizeCloudflareAccessSecretInput(value.clientId, "gateway.cloudflareAccess.clientId"),
		clientSecret: normalizeCloudflareAccessSecretInput(value.clientSecret, "gateway.cloudflareAccess.clientSecret")
	};
}
/** Persist conventional environment fallback as refs, never as copied plaintext. */
function nodeHostCloudflareAccessConfigFromEnv(env) {
	const clientId = normalizeSecretInputString(env[CF_ACCESS_CLIENT_ID_ENV]);
	const clientSecret = normalizeSecretInputString(env[CF_ACCESS_CLIENT_SECRET_ENV]);
	if (!clientId && !clientSecret) return;
	if (!clientId || !clientSecret) throw new Error(`${CF_ACCESS_CLIENT_ID_ENV} and ${CF_ACCESS_CLIENT_SECRET_ENV} must be configured together`);
	return {
		clientId: {
			source: "env",
			provider: "default",
			id: CF_ACCESS_CLIENT_ID_ENV
		},
		clientSecret: {
			source: "env",
			provider: "default",
			id: CF_ACCESS_CLIENT_SECRET_ENV
		}
	};
}
async function resolveNodeHostCloudflareAccess(params) {
	if (!params.value) return;
	const [clientId, clientSecret] = await Promise.all([params.value.clientId, params.value.clientSecret].map((value) => materializeSecretInput({
		config: params.config,
		value,
		env: params.env
	})));
	if (!clientId || !clientSecret) throw new Error("node-host Cloudflare Access credentials resolved empty");
	registerSecretValueForRedaction(clientId);
	registerSecretValueForRedaction(clientSecret);
	return {
		clientId,
		clientSecret
	};
}
function nodeHostGatewayOrigin(gateway) {
	const host = gateway.host ?? "127.0.0.1";
	const urlHost = host.includes(":") && !(host.startsWith("[") && host.endsWith("]")) ? `[${host}]` : host;
	const protocol = gateway.tls ? "https:" : "http:";
	const port = gateway.port ?? (gateway.tls ? 443 : 80);
	return new URL(`${protocol}//${urlHost}:${port}`);
}
function nodeHostGatewayMatchesUrl(gateway, target) {
	const configured = nodeHostGatewayOrigin(gateway);
	return configured.protocol === target.protocol && configured.host === target.host;
}
function nodeHostGatewaysShareOrigin(left, right) {
	return nodeHostGatewayMatchesUrl(left, nodeHostGatewayOrigin(right));
}
//#endregion
//#region src/node-host/config-shared.ts
function optionalNonEmptyString(value, label) {
	if (value === null || value === void 0) return;
	if (typeof value !== "string") throw new Error(`invalid node-host SQLite row: ${label} must be a string`);
	const normalized = value.trim();
	if (!normalized) throw new Error(`invalid node-host SQLite row: ${label} must not be empty`);
	return normalized;
}
function validatePort(value, label) {
	if (value === null || value === void 0) return;
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0 || value > 65535) throw new Error(`invalid node-host ${label}: expected an integer between 1 and 65535`);
	return value;
}
function normalizeStoredNodeHostConfig(value) {
	if (!isRecord(value)) throw new Error("invalid node-host SQLite row: expected a configuration object");
	if (value.version !== 1) throw new Error(`invalid node-host SQLite row: unsupported version ${String(value.version)}`);
	const nodeId = typeof value.nodeId === "string" ? value.nodeId.trim() : "";
	if (!nodeId) throw new Error("invalid node-host SQLite row: node_id must not be empty");
	const storedGateway = value.gateway;
	if (storedGateway !== void 0 && !isRecord(storedGateway)) throw new Error("invalid node-host SQLite row: gateway must be an object");
	const gatewayTls = storedGateway?.tls;
	if (gatewayTls !== void 0 && typeof gatewayTls !== "boolean") throw new Error("invalid node-host SQLite row: gateway_tls must be a boolean");
	if (value.installedAppsSharing !== void 0 && typeof value.installedAppsSharing !== "boolean") throw new Error("invalid node-host SQLite row: installed_apps_sharing must be a boolean");
	const gateway = storedGateway ? normalizeGatewayConfig({
		host: optionalNonEmptyString(storedGateway.host, "gateway_host"),
		port: validatePort(storedGateway.port, "SQLite gateway_port"),
		tls: typeof gatewayTls === "boolean" ? gatewayTls : void 0,
		tlsFingerprint: optionalNonEmptyString(storedGateway.tlsFingerprint, "gateway_tls_fingerprint"),
		contextPath: optionalNonEmptyString(storedGateway.contextPath, "gateway_context_path"),
		...cloudflareAccessEntry(normalizeNodeHostCloudflareAccessConfig(storedGateway.cloudflareAccess))
	}) : void 0;
	return {
		version: 1,
		nodeId,
		displayName: optionalNonEmptyString(value.displayName, "display_name"),
		gateway,
		installedAppsSharing: value.installedAppsSharing === true,
		...value.commands !== void 0 ? { commands: normalizeNodeHostCommands(value.commands) } : {}
	};
}
function normalizeNodeHostCommands(value) {
	if (!Array.isArray(value) || value.some((id) => typeof id !== "string" || !id.trim())) throw new Error("invalid node-host commands: expected an array of non-empty command ids");
	return [...new Set(value.map((id) => id.trim()))].toSorted();
}
function cloudflareAccessEntry(cloudflareAccess) {
	return cloudflareAccess ? { cloudflareAccess } : {};
}
function normalizeGatewayConfig(gateway) {
	const normalized = {
		host: normalizeOptionalString(gateway.host),
		port: validatePort(gateway.port, "gateway port"),
		tls: gateway.tls,
		tlsFingerprint: normalizeOptionalString(gateway.tlsFingerprint),
		contextPath: normalizeOptionalString(gateway.contextPath),
		...cloudflareAccessEntry(normalizeNodeHostCloudflareAccessConfig(gateway.cloudflareAccess))
	};
	return Object.values(normalized).some((value) => value !== void 0) ? normalized : void 0;
}
//#endregion
//#region src/node-host/node-worker-prepared-workspace-publication.ts
const nodePreparedWorkspacePublication = createStateDomainPublication({
	domain: "node-prepared-workspace",
	keyOf: (row) => row.preparation_key,
	isValue: (row) => isRecord(row) && [
		"preparation_key",
		"cache_key",
		"gateway_namespace",
		"environment_id",
		"workspace_dir",
		"home_dir",
		"source_manifest_ref",
		"prepared_manifest_ref",
		"state"
	].every((key) => typeof row[key] === "string") && ["session_id", "session_key"].every((key) => row[key] === null || typeof row[key] === "string") && typeof row.created_at_ms === "number" && [
		"owner_epoch",
		"bound_at_ms",
		"retired_at_ms"
	].every((key) => row[key] === null || typeof row[key] === "number")
});
//#endregion
export { nodeHostCloudflareAccessConfigFromEnv as a, normalizeNodeHostCloudflareAccessConfig as c, normalizeStoredNodeHostConfig as i, resolveNodeHostCloudflareAccess as l, normalizeGatewayConfig as n, nodeHostGatewayMatchesUrl as o, normalizeNodeHostCommands as r, nodeHostGatewaysShareOrigin as s, nodePreparedWorkspacePublication as t };
