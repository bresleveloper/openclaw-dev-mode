import { F as resolveTimerTimeoutMs, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { Et as _enum, Fn as object, Jn as string, Pn as number, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { a as loadOrCreateProcessDeviceIdentity, c as signDevicePayload } from "./device-identity-B_zMrBd6.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { t as normalizeHostname } from "./hostname-BEfh3sRX.mjs";
import { t as clearApnsRegistrationFromDatabase } from "./push-apns-store-transaction--RBZ168D.mjs";
import { URL } from "node:url";
//#region src/infra/push-apns-store.errors.ts
var ApnsRegistrationPairingChangedError = class extends Error {
	constructor() {
		super("node pairing changed before APNs registration");
		this.name = "ApnsRegistrationPairingChangedError";
	}
};
//#endregion
//#region src/infra/push-apns-store.rows.ts
function apnsRegistrationToRow(registration) {
	const base = {
		node_id: registration.nodeId,
		transport: registration.transport,
		topic: registration.topic,
		environment: registration.environment,
		updated_at_ms: registration.updatedAtMs
	};
	if (registration.transport === "direct") {
		const { token } = registration;
		return {
			...base,
			token,
			relay_handle: null,
			send_grant: null,
			installation_id: null,
			relay_origin: null,
			distribution: null,
			token_debug_suffix: null
		};
	}
	return {
		...base,
		token: null,
		relay_handle: registration.relayHandle,
		send_grant: registration.sendGrant,
		installation_id: registration.installationId,
		relay_origin: registration.relayOrigin ?? null,
		distribution: registration.distribution,
		token_debug_suffix: registration.tokenDebugSuffix ?? null
	};
}
//#endregion
//#region src/infra/push-apns.relay.ts
/** Hosted APNs relay origin used only when registrations prove they were minted there. */
const DEFAULT_APNS_RELAY_BASE_URL = "https://ios-push-relay.openclaw.ai";
const DEFAULT_APNS_SANDBOX_RELAY_BASE_URL = "https://ios-push-relay-sandbox.openclaw.ai";
const DEFAULT_APNS_RELAY_TIMEOUT_MS = 1e4;
const APNS_RELAY_MAX_RESPONSE_BYTES = 16777216;
const GATEWAY_DEVICE_ID_HEADER = "x-openclaw-gateway-device-id";
const GATEWAY_SIGNATURE_HEADER = "x-openclaw-gateway-signature";
const GATEWAY_SIGNED_AT_HEADER = "x-openclaw-gateway-signed-at-ms";
function normalizeNonEmptyString(value) {
	const trimmed = normalizeOptionalString(value) ?? "";
	return trimmed.length > 0 ? trimmed : null;
}
function throwIfApnsRelaySendAborted(signal) {
	if (!signal?.aborted) return;
	throw signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("APNs send invalidated");
}
async function requireCurrentApnsRelaySend(params) {
	throwIfApnsRelaySendAborted(params.signal);
	if (params.isCurrent && !await params.isCurrent()) throw new Error("APNs send invalidated");
	throwIfApnsRelaySendAborted(params.signal);
}
function normalizeTimeoutMs(value) {
	const raw = typeof value === "number" ? value : typeof value === "string" ? normalizeOptionalString(value) : void 0;
	if (raw === void 0 || raw === "") return DEFAULT_APNS_RELAY_TIMEOUT_MS;
	const parsed = typeof raw === "number" ? raw : parseStrictPositiveInteger(raw);
	return resolveTimerTimeoutMs(parsed, DEFAULT_APNS_RELAY_TIMEOUT_MS, 1e3);
}
function readAllowHttp(value) {
	const normalized = normalizeOptionalString(value) ? normalizeLowercaseStringOrEmpty(value) : void 0;
	return normalized === "1" || normalized === "true" || normalized === "yes";
}
function isLoopbackRelayHostname(hostname) {
	const normalized = normalizeHostname(hostname);
	return normalized === "localhost" || normalized === "::1" || normalized === "[::1]" || /^127(?:\.\d{1,3}){3}$/.test(normalized);
}
function parseReason(value) {
	return typeof value === "string" ? normalizeOptionalString(value) : void 0;
}
function parseRelayEnvironment(value) {
	const normalized = typeof value === "string" ? normalizeLowercaseStringOrEmpty(value) : "";
	if (normalized === "sandbox" || normalized === "production") return normalized;
}
function normalizeApnsRelayBaseUrlWithPolicy(baseUrl, allowLoopbackHttpWithoutEnvOptIn) {
	try {
		const parsed = new URL(baseUrl);
		if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("unsupported protocol");
		if (!parsed.hostname) throw new Error("host required");
		if (parsed.protocol === "http:" && !allowLoopbackHttpWithoutEnvOptIn) throw new Error("http relay URLs require OPENCLAW_APNS_RELAY_ALLOW_HTTP=true (development only)");
		if (parsed.protocol === "http:" && !isLoopbackRelayHostname(parsed.hostname)) throw new Error("http relay URLs are limited to loopback hosts");
		if (parsed.username || parsed.password) throw new Error("userinfo is not allowed");
		if (parsed.search || parsed.hash) throw new Error("query and fragment are not allowed");
		return {
			ok: true,
			value: parsed.toString().replace(/\/+$/, "")
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
/** Validate and canonicalize an APNs relay base URL for config and registration origins. */
function normalizeApnsRelayBaseUrl(baseUrl, env = process.env) {
	return normalizeApnsRelayBaseUrlWithPolicy(baseUrl, readAllowHttp(env.OPENCLAW_APNS_RELAY_ALLOW_HTTP));
}
/** Revalidate a canonical persisted relay URL without reapplying current input policy. */
function normalizePersistedApnsRelayBaseUrl(baseUrl) {
	return normalizeApnsRelayBaseUrlWithPolicy(baseUrl, true);
}
function buildRelayGatewaySignaturePayload(params) {
	return [
		"openclaw-relay-send-v1",
		params.gatewayDeviceId.trim(),
		String(Math.trunc(params.signedAtMs)),
		params.bodyJson
	].join("\n");
}
/** Resolve the relay endpoint from env/config and require it to match relay-minted registrations. */
function resolveApnsRelayConfigFromEnv(env = process.env, gatewayConfig, options = {}) {
	const configuredRelay = gatewayConfig?.push?.apns?.relay;
	const envBaseUrl = normalizeNonEmptyString(env.OPENCLAW_APNS_RELAY_BASE_URL);
	const configBaseUrl = normalizeNonEmptyString(configuredRelay?.baseUrl);
	const explicitBaseUrl = envBaseUrl ?? configBaseUrl;
	const normalizedRegistrationOrigin = options.registrationRelayOrigin ? normalizeApnsRelayBaseUrl(options.registrationRelayOrigin, env) : void 0;
	if (normalizedRegistrationOrigin && !normalizedRegistrationOrigin.ok) return {
		ok: false,
		error: `invalid relay registration origin (${options.registrationRelayOrigin}): ${normalizedRegistrationOrigin.error}`
	};
	const hostedRelayBaseUrl = normalizedRegistrationOrigin?.value === DEFAULT_APNS_RELAY_BASE_URL ? DEFAULT_APNS_RELAY_BASE_URL : normalizedRegistrationOrigin?.value === DEFAULT_APNS_SANDBOX_RELAY_BASE_URL ? DEFAULT_APNS_SANDBOX_RELAY_BASE_URL : void 0;
	const baseUrl = explicitBaseUrl ?? hostedRelayBaseUrl;
	const baseUrlSource = envBaseUrl ? "OPENCLAW_APNS_RELAY_BASE_URL" : configBaseUrl ? "gateway.push.apns.relay.baseUrl" : "default APNs relay base URL";
	if (!baseUrl) return {
		ok: false,
		error: "APNs relay config missing: set gateway.push.apns.relay.baseUrl or OPENCLAW_APNS_RELAY_BASE_URL for relay registrations without the hosted relay origin"
	};
	const normalizedBaseUrl = normalizeApnsRelayBaseUrl(baseUrl, env);
	if (!normalizedBaseUrl.ok) return {
		ok: false,
		error: `invalid ${baseUrlSource} (${baseUrl}): ${normalizedBaseUrl.error}`
	};
	if (normalizedRegistrationOrigin && normalizedRegistrationOrigin.value !== normalizedBaseUrl.value) return {
		ok: false,
		error: `APNs relay config origin mismatch: registration uses ${normalizedRegistrationOrigin.value} but ${baseUrlSource} is ${normalizedBaseUrl.value}`
	};
	return {
		ok: true,
		value: {
			baseUrl: normalizedBaseUrl.value,
			timeoutMs: normalizeTimeoutMs(normalizeNonEmptyString(env.OPENCLAW_APNS_RELAY_TIMEOUT_MS) ?? configuredRelay?.timeoutMs)
		}
	};
}
var ApnsRelayResponseTooLargeError = class extends Error {
	constructor(size, maxBytes) {
		super(`APNs relay response exceeded ${maxBytes} bytes (${size} bytes received)`);
		this.size = size;
		this.maxBytes = maxBytes;
		this.name = "ApnsRelayResponseTooLargeError";
	}
};
async function sendApnsRelayRequest(params) {
	await requireCurrentApnsRelaySend(params);
	const timeoutSignal = AbortSignal.timeout(params.relayConfig.timeoutMs);
	const signal = params.signal ? AbortSignal.any([params.signal, timeoutSignal]) : timeoutSignal;
	const response = await fetch(`${params.relayConfig.baseUrl}/v1/push/send`, {
		method: "POST",
		redirect: "manual",
		headers: {
			authorization: `Bearer ${params.sendGrant}`,
			"content-type": "application/json",
			[GATEWAY_DEVICE_ID_HEADER]: params.gatewayDeviceId,
			[GATEWAY_SIGNATURE_HEADER]: params.signature,
			[GATEWAY_SIGNED_AT_HEADER]: String(params.signedAtMs)
		},
		body: params.bodyJson,
		signal
	});
	if (response.status >= 300 && response.status < 400) {
		await response.body?.cancel().catch(() => void 0);
		return {
			ok: false,
			status: response.status,
			reason: "RelayRedirectNotAllowed"
		};
	}
	let json;
	try {
		const buffer = await readResponseWithLimit(response, APNS_RELAY_MAX_RESPONSE_BYTES, { onOverflow: ({ size, maxBytes }) => new ApnsRelayResponseTooLargeError(size, maxBytes) });
		json = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(buffer));
	} catch (err) {
		if (err instanceof ApnsRelayResponseTooLargeError) return {
			ok: false,
			status: response.status,
			reason: "RelayResponseTooLarge"
		};
		json = null;
	}
	const body = json && typeof json === "object" && !Array.isArray(json) ? json : {};
	const status = typeof body.status === "number" && Number.isFinite(body.status) ? Math.trunc(body.status) : response.status;
	const environment = parseRelayEnvironment(body.environment);
	return {
		ok: typeof body.ok === "boolean" ? body.ok : response.ok && status >= 200 && status < 300,
		status,
		apnsId: parseReason(body.apnsId),
		reason: parseReason(body.reason),
		...environment ? { environment } : {},
		tokenSuffix: parseReason(body.tokenSuffix)
	};
}
/** Sign and send an APNs relay push using the gateway device identity. */
async function sendApnsRelayPush(params) {
	await requireCurrentApnsRelaySend(params);
	const sender = params.requestSender ?? sendApnsRelayRequest;
	const gatewayIdentity = params.gatewayIdentity ?? loadOrCreateProcessDeviceIdentity();
	const signedAtMs = Date.now();
	const bodyJson = JSON.stringify({
		relayHandle: params.relayHandle,
		pushType: params.pushType,
		priority: Number(params.priority),
		payload: params.payload
	});
	const signature = signDevicePayload(gatewayIdentity.privateKeyPem, buildRelayGatewaySignaturePayload({
		gatewayDeviceId: gatewayIdentity.deviceId,
		signedAtMs,
		bodyJson
	}));
	return await sender({
		relayConfig: params.relayConfig,
		sendGrant: params.sendGrant,
		relayHandle: params.relayHandle,
		gatewayDeviceId: gatewayIdentity.deviceId,
		signature,
		signedAtMs,
		bodyJson,
		pushType: params.pushType,
		priority: params.priority,
		payload: params.payload,
		...params.signal ? { signal: params.signal } : {},
		...params.isCurrent ? { isCurrent: params.isCurrent } : {}
	});
}
//#endregion
//#region src/infra/push-apns-store.ts
const MAX_NODE_ID_LENGTH = 256;
const MAX_TOPIC_LENGTH = 255;
const MAX_APNS_TOKEN_HEX_LENGTH = 512;
const MAX_RELAY_IDENTIFIER_LENGTH = 256;
const MAX_SEND_GRANT_LENGTH = 1024;
const APNS_REGISTRATION_LOOKUP_CHUNK_SIZE = 500;
function apnsStateDatabaseOptions(stateDir) {
	return stateDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} } : { env: process.env };
}
function normalizeApnsNodeId(value) {
	return value.trim();
}
function isValidApnsNodeId(value) {
	return value.length > 0 && value.length <= MAX_NODE_ID_LENGTH;
}
function normalizeApnsToken(value) {
	return normalizeLowercaseStringOrEmpty(value.trim().replace(/[<>\s]/g, ""));
}
function normalizeRelayHandle(value) {
	return value.trim();
}
function normalizeInstallationId(value) {
	return value.trim();
}
function validateRelayIdentifier(value, fieldName, maxLength = MAX_RELAY_IDENTIFIER_LENGTH) {
	if (!value) throw new Error(`${fieldName} required`);
	if (value.length > maxLength) throw new Error(`${fieldName} too long`);
	if (/[^\x21-\x7e]/.test(value)) throw new Error(`${fieldName} invalid`);
	return value;
}
function isValidRelayIdentifier(value, maxLength = MAX_RELAY_IDENTIFIER_LENGTH) {
	return value.length > 0 && value.length <= maxLength && !/[^\x21-\x7e]/.test(value);
}
function normalizeApnsTopic(value) {
	return value.trim();
}
function isValidApnsTopic(value) {
	return value.length > 0 && value.length <= MAX_TOPIC_LENGTH;
}
function normalizeTokenDebugSuffix(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeLowercaseStringOrEmpty(value.trim()).replace(/[^0-9a-z]/g, "");
	return normalized.length > 0 ? normalized.slice(-8) : void 0;
}
function isLikelyApnsToken(value) {
	return value.length <= MAX_APNS_TOKEN_HEX_LENGTH && /^[0-9a-f]{32,}$/i.test(value);
}
function normalizeDistribution(value) {
	if (typeof value !== "string") return null;
	return (normalizeOptionalString(value) ? normalizeLowercaseStringOrEmpty(value) : void 0) === "official" ? "official" : null;
}
function normalizeRelayOrigin(value, env = process.env) {
	if (typeof value !== "string") return;
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	const normalized = normalizeApnsRelayBaseUrl(trimmed, env);
	return normalized.ok ? normalized.value : void 0;
}
function normalizePersistedRelayOrigin(value) {
	if (typeof value !== "string") return;
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	const normalized = normalizePersistedApnsRelayBaseUrl(trimmed);
	return normalized.ok ? normalized.value : void 0;
}
/** Normalizes the APNs environment string accepted by registration inputs. */
function normalizeApnsEnvironment(value) {
	if (typeof value !== "string") return null;
	const normalized = normalizeLowercaseStringOrEmpty(value);
	if (normalized === "sandbox" || normalized === "production") return normalized;
	return null;
}
const apnsNodeIdSchema = string().transform(normalizeApnsNodeId).refine(isValidApnsNodeId);
const apnsTopicSchema = string().transform(normalizeApnsTopic).refine(isValidApnsTopic);
const apnsEnvironmentSchema = unknown().transform(normalizeApnsEnvironment).pipe(_enum(["sandbox", "production"]));
const apnsUpdatedAtSchema = number().refine(Number.isSafeInteger).refine((value) => value >= 0);
const directApnsRegistrationSchema = object({
	nodeId: apnsNodeIdSchema,
	transport: string().transform(normalizeLowercaseStringOrEmpty).pipe(literal("direct")),
	token: string().transform(normalizeApnsToken).refine(isLikelyApnsToken),
	topic: apnsTopicSchema,
	environment: apnsEnvironmentSchema,
	updatedAtMs: apnsUpdatedAtSchema
});
const relayApnsRegistrationSchema = object({
	nodeId: apnsNodeIdSchema,
	transport: string().transform(normalizeLowercaseStringOrEmpty).pipe(literal("relay")),
	relayHandle: string().transform(normalizeRelayHandle).refine(isValidRelayIdentifier),
	sendGrant: string().transform((value) => value.trim()).refine((value) => isValidRelayIdentifier(value, MAX_SEND_GRANT_LENGTH)),
	installationId: string().transform(normalizeInstallationId).refine(isValidRelayIdentifier),
	topic: apnsTopicSchema,
	environment: apnsEnvironmentSchema,
	distribution: unknown().transform(normalizeDistribution).pipe(literal("official")),
	updatedAtMs: apnsUpdatedAtSchema,
	relayOrigin: unknown().optional(),
	tokenDebugSuffix: unknown().optional().transform(normalizeTokenDebugSuffix)
});
const canonicalApnsRegistrationSchema = union([directApnsRegistrationSchema, relayApnsRegistrationSchema]);
function normalizeCanonicalApnsRegistrationWithRelayOrigin(record, normalizeOrigin) {
	const result = canonicalApnsRegistrationSchema.safeParse(record);
	if (!result.success) return null;
	if (result.data.transport === "direct") return result.data;
	const relayOrigin = normalizeOrigin(result.data.relayOrigin);
	const { relayOrigin: _rawRelayOrigin, ...registration } = result.data;
	return {
		...registration,
		...relayOrigin ? { relayOrigin } : {}
	};
}
/** Normalizes one canonical registration with an explicit transport discriminator. */
function normalizeCanonicalApnsRegistration(record, env = process.env) {
	return normalizeCanonicalApnsRegistrationWithRelayOrigin(record, (value) => normalizeRelayOrigin(value, env));
}
function apnsRegistrationFromRow(row) {
	const { token } = row;
	const normalized = normalizeCanonicalApnsRegistrationWithRelayOrigin({
		nodeId: row.node_id,
		transport: row.transport,
		token,
		relayHandle: row.relay_handle ?? void 0,
		sendGrant: row.send_grant ?? void 0,
		installationId: row.installation_id ?? void 0,
		relayOrigin: row.relay_origin ?? void 0,
		topic: row.topic,
		environment: row.environment,
		distribution: row.distribution ?? void 0,
		tokenDebugSuffix: row.token_debug_suffix ?? void 0,
		updatedAtMs: row.updated_at_ms
	}, normalizePersistedRelayOrigin);
	if (!normalized) throw new Error("invalid APNs registration row");
	const canonical = apnsRegistrationToRow(normalized);
	if (canonical.node_id !== row.node_id || canonical.transport !== row.transport || canonical.token !== row.token || canonical.relay_handle !== row.relay_handle || canonical.send_grant !== row.send_grant || canonical.installation_id !== row.installation_id || canonical.relay_origin !== row.relay_origin || canonical.topic !== row.topic || canonical.environment !== row.environment || canonical.distribution !== row.distribution || canonical.token_debug_suffix !== row.token_debug_suffix || canonical.updated_at_ms !== row.updated_at_ms) throw new Error("non-canonical APNs registration row");
	return normalized;
}
function apnsRegistrationsEqual(left, right) {
	if (left.nodeId !== right.nodeId || left.transport !== right.transport || left.topic !== right.topic || left.environment !== right.environment || left.updatedAtMs !== right.updatedAtMs) return false;
	if (left.transport === "direct" && right.transport === "direct") return left.token === right.token;
	return left.transport === "relay" && right.transport === "relay" && left.relayHandle === right.relayHandle && left.sendGrant === right.sendGrant && left.installationId === right.installationId && left.distribution === right.distribution && left.relayOrigin === right.relayOrigin && left.tokenDebugSuffix === right.tokenDebugSuffix;
}
/** Persists a validated direct or relay APNs registration for one node id. */
async function registerApnsRegistration(params) {
	const nodeId = normalizeApnsNodeId(params.nodeId);
	const topic = normalizeApnsTopic(params.topic);
	if (!isValidApnsNodeId(nodeId)) throw new Error("nodeId required");
	if (!isValidApnsTopic(topic)) throw new Error("topic required");
	let candidate;
	if (params.transport === "relay") {
		const relayHandle = validateRelayIdentifier(normalizeRelayHandle(params.relayHandle), "relayHandle");
		const sendGrant = validateRelayIdentifier(params.sendGrant.trim(), "sendGrant", MAX_SEND_GRANT_LENGTH);
		const installationId = validateRelayIdentifier(normalizeInstallationId(params.installationId), "installationId");
		const environment = normalizeApnsEnvironment(params.environment);
		const distribution = normalizeDistribution(params.distribution);
		const relayOrigin = normalizeRelayOrigin(params.relayOrigin);
		if (!environment) throw new Error("relay registrations must use valid APNs environment");
		if (distribution !== "official") throw new Error("relay registrations must use official distribution");
		candidate = {
			nodeId,
			transport: "relay",
			relayHandle,
			sendGrant,
			installationId,
			topic,
			environment,
			distribution,
			updatedAtMs: 0,
			...relayOrigin ? { relayOrigin } : {},
			tokenDebugSuffix: normalizeTokenDebugSuffix(params.tokenDebugSuffix)
		};
	} else {
		const token = normalizeApnsToken(params.token);
		const environment = normalizeApnsEnvironment(params.environment) ?? "sandbox";
		if (!isLikelyApnsToken(token)) throw new Error("invalid APNs token");
		candidate = {
			nodeId,
			transport: "direct",
			token,
			topic,
			environment,
			updatedAtMs: 0
		};
	}
	const context = captureOpenClawStateWorkerContext(apnsStateDatabaseOptions(params.baseDir));
	const nowMs = Date.now();
	const expectedPairingGeneration = params.expectedPairingGeneration;
	const assertCurrent = params.assertCurrent;
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "apns.registration.register",
		input: {
			candidate,
			expectedPairingGeneration,
			nowMs
		}
	}), {
		assertCurrent,
		createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("APNs registration requires transaction admission");
				context.admission.assertCurrent();
				assertCurrent?.();
				grant();
			})
		})
	});
	if (result.status === "pairing-changed") throw new ApnsRegistrationPairingChangedError();
	return result.registration;
}
/** Loads one normalized APNs registration by node id. */
async function loadApnsRegistration(nodeId, baseDir) {
	const normalizedNodeId = normalizeApnsNodeId(nodeId);
	if (!normalizedNodeId) return null;
	const context = captureOpenClawStateWorkerContext(apnsStateDatabaseOptions(baseDir));
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	return executeOpenClawStateWorker(context, {
		type: "apns.registration.read",
		input: normalizedNodeId
	});
}
/** Read and decode one registration through the caller's canonical connection. */
function readApnsRegistrationFromDatabase(db, normalizedNodeId) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("apns_registrations").selectAll().where("node_id", "=", normalizedNodeId));
	return row ? apnsRegistrationFromRow(row) : null;
}
/** Loads normalized APNs registrations for the requested node ids, preserving request order. */
async function loadApnsRegistrations(nodeIds, baseDir) {
	const normalizedByInput = nodeIds.map((nodeId) => ({
		nodeId,
		normalizedNodeId: normalizeApnsNodeId(nodeId)
	}));
	const uniqueNodeIds = [...new Set(normalizedByInput.map((entry) => entry.normalizedNodeId).filter((nodeId) => isValidApnsNodeId(nodeId)))];
	if (uniqueNodeIds.length === 0) return [];
	const context = captureOpenClawStateWorkerContext(apnsStateDatabaseOptions(baseDir));
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	const registrations = await executeOpenClawStateWorker(context, {
		type: "apns.registrations.read",
		input: uniqueNodeIds
	});
	return normalizedByInput.flatMap(({ nodeId, normalizedNodeId }) => {
		const registration = registrations.get(normalizedNodeId);
		return registration ? [{
			nodeId,
			registration
		}] : [];
	});
}
/** Decode each bounded query before advancing to the next requested chunk. */
function readApnsRegistrationsFromDatabase(db, uniqueNodeIds) {
	const registrations = /* @__PURE__ */ new Map();
	const stateDb = getNodeSqliteKysely(db);
	for (let offset = 0; offset < uniqueNodeIds.length; offset += APNS_REGISTRATION_LOOKUP_CHUNK_SIZE) {
		const rows = executeSqliteQuerySync(db, stateDb.selectFrom("apns_registrations").selectAll().where("node_id", "in", uniqueNodeIds.slice(offset, offset + APNS_REGISTRATION_LOOKUP_CHUNK_SIZE))).rows;
		for (const row of rows) registrations.set(row.node_id, apnsRegistrationFromRow(row));
	}
	return registrations;
}
/** Clears a registration only if storage still contains the caller's observed value. */
async function clearApnsRegistrationIfCurrent(params) {
	const normalizedNodeId = normalizeApnsNodeId(params.nodeId);
	if (!normalizedNodeId) return false;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const currentRow = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registrations").selectAll().where("node_id", "=", normalizedNodeId));
		if (!currentRow || !apnsRegistrationsEqual(apnsRegistrationFromRow(currentRow), params.registration)) return false;
		return clearApnsRegistrationFromDatabase(db, normalizedNodeId);
	}, apnsStateDatabaseOptions(params.baseDir));
}
//#endregion
export { sendApnsRelayPush as _, isValidApnsTopic as a, normalizeApnsEnvironment as c, normalizeApnsTopic as d, normalizeCanonicalApnsRegistration as f, resolveApnsRelayConfigFromEnv as g, registerApnsRegistration as h, isValidApnsNodeId as i, normalizeApnsNodeId as l, readApnsRegistrationsFromDatabase as m, clearApnsRegistrationIfCurrent as n, loadApnsRegistration as o, readApnsRegistrationFromDatabase as p, isLikelyApnsToken as r, loadApnsRegistrations as s, apnsRegistrationFromRow as t, normalizeApnsToken as u, apnsRegistrationToRow as v, ApnsRegistrationPairingChangedError as y };
