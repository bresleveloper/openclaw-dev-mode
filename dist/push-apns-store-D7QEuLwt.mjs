import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { Et as _enum, Fn as object, Jn as string, Pn as number, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as normalizeHostname } from "./hostname-Db1ZcSGB.mjs";
//#region src/infra/push-apns-relay-url.ts
function readAllowHttp(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	return normalized === "1" || normalized === "true" || normalized === "yes";
}
function isLoopbackRelayHostname(hostname) {
	const normalized = normalizeHostname(hostname);
	return normalized === "localhost" || normalized === "::1" || normalized === "[::1]" || /^127(?:\.\d{1,3}){3}$/.test(normalized);
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
//#endregion
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
	const direct = registration.transport === "direct";
	return {
		node_id: registration.nodeId,
		transport: registration.transport,
		topic: registration.topic,
		environment: registration.environment,
		updated_at_ms: registration.updatedAtMs,
		token: direct ? registration.token : null,
		relay_handle: direct ? null : registration.relayHandle,
		send_grant: direct ? null : registration.sendGrant,
		installation_id: direct ? null : registration.installationId,
		relay_origin: direct ? null : registration.relayOrigin ?? null,
		distribution: direct ? null : registration.distribution,
		token_debug_suffix: direct ? null : registration.tokenDebugSuffix ?? null
	};
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
	const normalized = normalizeLowercaseStringOrEmpty(value).replace(/[^0-9a-z]/g, "");
	return normalized.length > 0 ? normalized.slice(-8) : void 0;
}
function isLikelyApnsToken(value) {
	return value.length <= MAX_APNS_TOKEN_HEX_LENGTH && /^[0-9a-f]{32,}$/i.test(value);
}
function normalizeDistribution(value) {
	return normalizeLowercaseStringOrEmpty(value) === "official" ? "official" : null;
}
function normalizeRelayOrigin(value, normalizeUrl = normalizeApnsRelayBaseUrl) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	const normalized = normalizeUrl(trimmed);
	return normalized.ok ? normalized.value : void 0;
}
function normalizeApnsEnvironment(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	return normalized === "sandbox" || normalized === "production" ? normalized : null;
}
const apnsNodeIdSchema = string().transform(normalizeApnsNodeId).refine(isValidApnsNodeId);
const apnsTopicSchema = string().transform(normalizeApnsTopic).refine(isValidApnsTopic);
const apnsEnvironmentSchema = unknown().transform(normalizeApnsEnvironment).pipe(_enum(["sandbox", "production"]));
const apnsUpdatedAtSchema = number().refine(Number.isSafeInteger).refine((value) => value >= 0);
const trimmedRelayIdentifierSchema = string().transform((value) => value.trim());
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
	relayHandle: trimmedRelayIdentifierSchema.refine(isValidRelayIdentifier),
	sendGrant: trimmedRelayIdentifierSchema.refine((value) => isValidRelayIdentifier(value, MAX_SEND_GRANT_LENGTH)),
	installationId: trimmedRelayIdentifierSchema.refine(isValidRelayIdentifier),
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
	const relayOrigin = normalizeRelayOrigin(result.data.relayOrigin, normalizeOrigin);
	const { relayOrigin: _rawRelayOrigin, ...registration } = result.data;
	return {
		...registration,
		...relayOrigin ? { relayOrigin } : {}
	};
}
function normalizeCanonicalApnsRegistration(record, env = process.env) {
	return normalizeCanonicalApnsRegistrationWithRelayOrigin(record, (origin) => normalizeApnsRelayBaseUrl(origin, env));
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
	}, normalizePersistedApnsRelayBaseUrl);
	if (!normalized) throw new Error("invalid APNs registration row");
	const canonical = apnsRegistrationToRow(normalized);
	if (canonical.node_id !== row.node_id || canonical.transport !== row.transport || canonical.token !== row.token || canonical.relay_handle !== row.relay_handle || canonical.send_grant !== row.send_grant || canonical.installation_id !== row.installation_id || canonical.relay_origin !== row.relay_origin || canonical.topic !== row.topic || canonical.environment !== row.environment || canonical.distribution !== row.distribution || canonical.token_debug_suffix !== row.token_debug_suffix || canonical.updated_at_ms !== row.updated_at_ms) throw new Error("non-canonical APNs registration row");
	return normalized;
}
async function registerApnsRegistration(params) {
	const nodeId = normalizeApnsNodeId(params.nodeId);
	const topic = normalizeApnsTopic(params.topic);
	if (!isValidApnsNodeId(nodeId)) throw new Error("nodeId required");
	if (!isValidApnsTopic(topic)) throw new Error("topic required");
	let candidate;
	if (params.transport === "relay") {
		const relayHandle = validateRelayIdentifier(params.relayHandle.trim(), "relayHandle");
		const sendGrant = validateRelayIdentifier(params.sendGrant.trim(), "sendGrant", MAX_SEND_GRANT_LENGTH);
		const installationId = validateRelayIdentifier(params.installationId.trim(), "installationId");
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
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
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
async function loadApnsRegistration(nodeId, baseDir) {
	const normalizedNodeId = normalizeApnsNodeId(nodeId);
	if (!normalizedNodeId) return null;
	const context = captureOpenClawStateWorkerContext(apnsStateDatabaseOptions(baseDir));
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return executeOpenClawStateWorker(context, {
		type: "apns.registration.read",
		input: normalizedNodeId
	});
}
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
	const uniqueNodeIds = [...new Set(normalizedByInput.map((entry) => entry.normalizedNodeId).filter(isValidApnsNodeId))];
	if (uniqueNodeIds.length === 0) return [];
	const context = captureOpenClawStateWorkerContext(apnsStateDatabaseOptions(baseDir));
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
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
	const context = captureOpenClawStateWorkerContext(apnsStateDatabaseOptions(params.baseDir));
	const input = {
		nodeId: normalizedNodeId,
		registration: { ...params.registration },
		nowMs: Date.now()
	};
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return executeOpenClawStateWorker(context, {
		type: "apns.registration.clearIfCurrent",
		input
	});
}
//#endregion
export { ApnsRegistrationPairingChangedError as _, isValidApnsTopic as a, normalizeApnsEnvironment as c, normalizeApnsTopic as d, normalizeCanonicalApnsRegistration as f, apnsRegistrationToRow as g, registerApnsRegistration as h, isValidApnsNodeId as i, normalizeApnsNodeId as l, readApnsRegistrationsFromDatabase as m, clearApnsRegistrationIfCurrent as n, loadApnsRegistration as o, readApnsRegistrationFromDatabase as p, isLikelyApnsToken as r, loadApnsRegistrations as s, apnsRegistrationFromRow as t, normalizeApnsToken as u, normalizeApnsRelayBaseUrl as v };
