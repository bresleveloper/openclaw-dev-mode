import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { a as coerceSecretRef, u as normalizeSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as materializeSecretInput } from "./resolve-secret-input-string-DtvH9AFh.mjs";
import { r as logInfo } from "./logger-BHMMVs5C.mjs";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/node-host/gateway-cloudflare-access.ts
const CF_ACCESS_CLIENT_ID_ENV = "CF_ACCESS_CLIENT_ID";
const CF_ACCESS_CLIENT_SECRET_ENV = "CF_ACCESS_CLIENT_SECRET";
function normalizeCloudflareAccessSecretInput(value, path) {
	const ref = coerceSecretRef(value);
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
	const [clientId, clientSecret] = await Promise.all([materializeSecretInput({
		config: params.config,
		value: params.value.clientId,
		env: params.env
	}), materializeSecretInput({
		config: params.config,
		value: params.value.clientSecret,
		env: params.env
	})]);
	if (!clientId || !clientSecret) throw new Error("node-host Cloudflare Access credentials resolved empty");
	registerSecretValueForRedaction(clientId);
	registerSecretValueForRedaction(clientSecret);
	return {
		clientId,
		clientSecret
	};
}
function nodeHostGatewayMatchesUrl(gateway, target) {
	const host = gateway.host ?? "127.0.0.1";
	const urlHost = host.includes(":") && !(host.startsWith("[") && host.endsWith("]")) ? `[${host}]` : host;
	const protocol = gateway.tls ? "https:" : "http:";
	const port = gateway.port ?? (gateway.tls ? 443 : 80);
	const configured = new URL(`${protocol}//${urlHost}:${port}`);
	return configured.protocol === target.protocol && configured.host === target.host;
}
function nodeHostGatewaysShareOrigin(left, right) {
	const host = right.host ?? "127.0.0.1";
	const urlHost = host.includes(":") && !(host.startsWith("[") && host.endsWith("]")) ? `[${host}]` : host;
	const protocol = right.tls ? "https:" : "http:";
	const port = right.port ?? (right.tls ? 443 : 80);
	return nodeHostGatewayMatchesUrl(left, new URL(`${protocol}//${urlHost}:${port}`));
}
//#endregion
//#region src/node-host/config.ts
/** Canonical shared-SQLite configuration for the node-host runner. */
const NODE_HOST_CONFIG_KEY = "nodeHost.config";
const LEGACY_NODE_HOST_CONFIG_FILE = "node.json";
const LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX = ".doctor-importing";
function databaseOptions(env) {
	return { env };
}
function resolveLegacyNodeHostConfigPath(env = process.env) {
	return path.join(resolveStateDir(env), LEGACY_NODE_HOST_CONFIG_FILE);
}
function resolveLegacyNodeHostConfigClaimPath(env = process.env) {
	return `${resolveLegacyNodeHostConfigPath(env)}${LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX}`;
}
function legacyPathMayExist(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw new Error(`unable to verify retired node-host state path ${filePath}`, { cause: error });
	}
}
/** Runtime must not choose between canonical SQLite state and a retired file store. */
function assertNodeHostLegacyStateMigrated(env = process.env) {
	const sourcePath = resolveLegacyNodeHostConfigPath(env);
	const claimPath = resolveLegacyNodeHostConfigClaimPath(env);
	if (!legacyPathMayExist(sourcePath) && !legacyPathMayExist(claimPath)) return;
	throw new Error(`retired node-host state remains at ${sourcePath}; stop the node host and run \`openclaw doctor --fix\``);
}
function optionalNonEmptyString(value, label) {
	if (value === null || value === void 0) return;
	if (typeof value !== "string") throw new Error(`invalid node-host SQLite row: ${label} must be a string`);
	const normalized = value.trim();
	if (!normalized) throw new Error(`invalid node-host SQLite row: ${label} must not be empty`);
	return normalized;
}
function optionalInputString(value) {
	return value?.trim() || void 0;
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
		host: optionalInputString(gateway.host),
		port: validatePort(gateway.port, "gateway port"),
		tls: gateway.tls,
		tlsFingerprint: optionalInputString(gateway.tlsFingerprint),
		contextPath: optionalInputString(gateway.contextPath),
		...cloudflareAccessEntry(normalizeNodeHostCloudflareAccessConfig(gateway.cloudflareAccess))
	};
	return Object.values(normalized).some((value) => value !== void 0) ? normalized : void 0;
}
async function readNodeHostConfig(env) {
	const selectedEnv = {
		...env,
		OPENCLAW_STATE_DIR: resolveStateDir(env)
	};
	assertNodeHostLegacyStateMigrated(selectedEnv);
	const reply = await executeExistingOpenClawStateRead(databaseOptions(selectedEnv), { type: NODE_HOST_CONFIG_KEY });
	assertNodeHostLegacyStateMigrated(selectedEnv);
	if (!reply) return null;
	if (!reply.ok || reply.type !== "nodeHost.config") throw new Error("Unexpected node-host configuration read result");
	const stored = reply.row;
	if (!stored) return null;
	const value = JSON.parse(stored.value_json);
	if (!Number.isSafeInteger(stored.updated_at_ms) || stored.updated_at_ms < 0) throw new Error("invalid node-host SQLite row: updated_at_ms must be a non-negative integer");
	return normalizeStoredNodeHostConfig(value);
}
/** Load canonical node-host state. Legacy files block the read until Doctor migrates them. */
async function loadNodeHostConfig(env = process.env) {
	return readNodeHostConfig(env);
}
/** Load existing node-host state without creating or joining the writable shared-state lifecycle. */
async function loadNodeHostConfigReadOnly(env = process.env) {
	return readNodeHostConfig(env);
}
/**
* Atomically create or replace the complete node-host snapshot.
* Candidate facts are prepared before BEGIN; the transaction rereads the authoritative row.
*/
async function configureNodeHost(params) {
	const env = params.env ?? process.env;
	assertNodeHostLegacyStateMigrated(env);
	const explicitNodeId = optionalInputString(params.nodeId);
	const explicitDisplayName = optionalInputString(params.displayName);
	const fallbackDisplayName = optionalInputString(params.fallbackDisplayName);
	const candidateNodeId = params.candidateNodeId?.trim() || crypto.randomUUID();
	const gateway = normalizeGatewayConfig(params.gateway);
	const commands = params.commands === void 0 ? void 0 : normalizeNodeHostCommands(params.commands);
	const updatedAtMs = params.nowMs ?? Date.now();
	if (!Number.isSafeInteger(updatedAtMs) || updatedAtMs < 0) throw new Error("invalid node-host updatedAtMs: expected a non-negative integer");
	let clearedCommands = false;
	const config = runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const stored = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("config_machine_state").select("value_json").where("state_key", "=", NODE_HOST_CONFIG_KEY));
		const existing = stored ? normalizeStoredNodeHostConfig(JSON.parse(stored.value_json)) : void 0;
		clearedCommands = params.allCommands === true && existing?.commands !== void 0;
		const nextCommands = params.allCommands ? void 0 : commands ?? existing?.commands;
		const next = {
			version: 1,
			nodeId: explicitNodeId ?? existing?.nodeId ?? candidateNodeId,
			displayName: explicitDisplayName ?? existing?.displayName ?? fallbackDisplayName,
			gateway,
			installedAppsSharing: params.installedAppsSharing ?? existing?.installedAppsSharing ?? false,
			...nextCommands !== void 0 ? { commands: nextCommands } : {}
		};
		const valueJson = JSON.stringify(next);
		executeSqliteQuerySync(db, stateDb.insertInto("config_machine_state").values({
			state_key: NODE_HOST_CONFIG_KEY,
			value_json: valueJson,
			updated_at_ms: updatedAtMs
		}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
			value_json: valueJson,
			updated_at_ms: updatedAtMs
		})));
		return next;
	}, databaseOptions(env));
	assertNodeHostLegacyStateMigrated(env);
	if (clearedCommands) logInfo("node-host: cleared saved command allowlist; advertising the full default command surface");
	return config;
}
//#endregion
export { loadNodeHostConfig as a, nodeHostGatewayMatchesUrl as c, resolveNodeHostCloudflareAccess as d, configureNodeHost as i, nodeHostGatewaysShareOrigin as l, LEGACY_NODE_HOST_CONFIG_FILE as n, loadNodeHostConfigReadOnly as o, NODE_HOST_CONFIG_KEY as r, nodeHostCloudflareAccessConfigFromEnv as s, LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX as t, normalizeNodeHostCloudflareAccessConfig as u };
