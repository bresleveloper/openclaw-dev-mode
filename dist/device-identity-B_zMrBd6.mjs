import { f as asSafeIntegerInRange } from "./number-coercion-CLj0HTDM.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { _ as resolveGatewayLockDir } from "./paths-DehQwyE0.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as createSqliteLifecycleAggregateError, o as tryAcquireExclusiveSqliteCoordinator, r as ensurePrivateSqliteCoordinatorDirectory, t as SqliteCoordinatorError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { _ as resolveStateDatabaseCoordinatorPath, s as acquireStateDatabaseCoordinator, v as resolveStateLifecycleRuntimeDirectory } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { a as resolveOpenClawStateDirForDatabasePath, s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { c as normalizeEd25519PublicKeyBase64Url, d as verifyEd25519Signature, l as publicKeyRawBase64UrlFromEd25519Pem, n as deriveCanonicalEd25519PrivateKeyRaw, r as deriveCanonicalEd25519PublicKeyRaw, u as signEd25519Payload } from "./ed25519-signature-De1Kepnz.mjs";
import { t as pathMayExistSync } from "./path-existence-ZQl5cy75.mjs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/infra/device-identity-coordinator-paths.ts
function resolveDeviceIdentityCoordinatorFilename(databasePath) {
	const canonicalPath = resolvePathViaExistingAncestorSync(databasePath);
	return `device-identity.${sha256HexPrefixCore(canonicalPath, 8)}.lock.sqlite`;
}
function resolveDeviceIdentityCoordinatorPath(databasePath, lockDir) {
	return path.join(lockDir, resolveDeviceIdentityCoordinatorFilename(databasePath));
}
function resolveDeviceIdentityCoordinatorPaths(params) {
	const canonicalStateDir = resolvePathViaExistingAncestorSync(params.stateDir);
	return [path.join(resolveGatewayLockDir(canonicalStateDir, params.uid), resolveDeviceIdentityCoordinatorFilename(params.databasePath))];
}
//#endregion
//#region src/infra/device-identity-coordinator.ts
const DEFAULT_BUSY_TIMEOUT_MS = 5e3;
var DeviceIdentityCoordinatorError = class extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "DeviceIdentityCoordinatorError";
	}
};
function releaseCoordinators(coordinators) {
	const errors = [];
	for (const coordinator of coordinators.toReversed()) try {
		coordinator.release();
	} catch (error) {
		errors.push(error);
	}
	return errors;
}
function acquireCoordinator(coordinatorPath, busyTimeoutMs) {
	const message = "device identity migration or creation already owns this state database";
	try {
		const coordinator = tryAcquireExclusiveSqliteCoordinator(coordinatorPath, { busyTimeoutMs });
		if (coordinator) return coordinator;
		throw new DeviceIdentityCoordinatorError(message);
	} catch (error) {
		if (error instanceof DeviceIdentityCoordinatorError) throw error;
		throw new DeviceIdentityCoordinatorError(message, error);
	}
}
function ensurePrivateDeviceIdentityCoordinatorDirectory(directoryPath) {
	try {
		ensurePrivateSqliteCoordinatorDirectory(directoryPath, "device identity coordinator");
	} catch (error) {
		if (error instanceof SqliteCoordinatorError) throw new DeviceIdentityCoordinatorError(error.message, error.cause);
		throw error;
	}
}
function acquireDeviceIdentityCoordinator(params) {
	const timeout = Math.max(0, Math.trunc(params.busyTimeoutMs ?? DEFAULT_BUSY_TIMEOUT_MS));
	const coordinatorPaths = params.lockDir !== void 0 ? [resolveDeviceIdentityCoordinatorPath(params.databasePath, params.lockDir)] : resolveDeviceIdentityCoordinatorPaths({
		databasePath: params.databasePath,
		stateDir: params.stateDir,
		uid: typeof process.getuid === "function" ? process.getuid() : void 0
	});
	for (const coordinatorPath of coordinatorPaths) ensurePrivateDeviceIdentityCoordinatorDirectory(path.dirname(coordinatorPath));
	const stateCoordinatorPath = resolveStateDatabaseCoordinatorPath({
		databasePath: params.databasePath,
		runtimeDirectory: resolveStateLifecycleRuntimeDirectory(),
		uid: typeof process.getuid === "function" ? process.getuid() : void 0
	});
	const coordinators = [];
	try {
		coordinators.push(acquireStateDatabaseCoordinator({
			databasePath: params.databasePath,
			coordinatorPath: stateCoordinatorPath,
			busyTimeoutMs: timeout
		}));
		for (const coordinatorPath of coordinatorPaths) coordinators.push(acquireCoordinator(coordinatorPath, timeout));
	} catch (error) {
		const cleanupErrors = releaseCoordinators(coordinators);
		if (cleanupErrors.length === 0) {
			if (error instanceof SqliteCoordinatorError) throw new DeviceIdentityCoordinatorError("device identity migration or creation already owns this state database", error);
			throw error;
		}
		throw new DeviceIdentityCoordinatorError(error instanceof DeviceIdentityCoordinatorError ? `${error.message}; failed to clean up a partially acquired coordinator` : "failed to acquire and clean up device identity coordinators", new AggregateError([error, ...cleanupErrors]));
	}
	let released = false;
	return { release: () => {
		if (released) return;
		released = true;
		const releaseErrors = releaseCoordinators(coordinators);
		if (releaseErrors.length > 0) throw new DeviceIdentityCoordinatorError("failed to release device identity coordinator", releaseErrors.length === 1 ? releaseErrors[0] : new AggregateError(releaseErrors));
	} };
}
//#endregion
//#region src/infra/device-identity-process-cache.ts
const identities = /* @__PURE__ */ new Map();
function readProcessDeviceIdentity(cacheKey) {
	return identities.get(cacheKey);
}
function cacheProcessDeviceIdentity(cacheKey, identity) {
	const cached = identities.get(cacheKey);
	if (cached) return cached;
	pruneMapToMaxSize(identities, 31);
	identities.set(cacheKey, identity);
	return identity;
}
//#endregion
//#region src/infra/device-identity-store.ts
const PRIMARY_DEVICE_IDENTITY_KEY = "primary";
var DeviceIdentityStorageError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "DeviceIdentityStorageError";
	}
};
function normalizeIdentityKey(key) {
	const normalized = key ?? "primary";
	if (normalized.length === 0 || normalized !== normalized.trim()) throw new DeviceIdentityStorageError("Device identity key must be a non-empty string without surrounding whitespace.");
	if (normalized.length > 128) throw new DeviceIdentityStorageError("Device identity key exceeds 128 characters.");
	return normalized;
}
function invalidStoredIdentityError(identityKey, cause) {
	return new DeviceIdentityStorageError(`SQLite contains an invalid persisted device identity "${identityKey}". Run "openclaw doctor --fix" before starting the gateway or connecting this client.`, cause === void 0 ? void 0 : { cause });
}
function fingerprintPublicKey(publicKeyPem) {
	const raw = deriveCanonicalEd25519PublicKeyRaw(publicKeyPem);
	return crypto.createHash("sha256").update(raw).digest("hex");
}
/** Generate canonical Ed25519 material before entering a synchronous write transaction. */
function generateStoredDeviceIdentity(now = Date.now()) {
	const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
	const publicKeyPem = publicKey.export({
		type: "spki",
		format: "pem"
	});
	const privateKeyPem = privateKey.export({
		type: "pkcs8",
		format: "pem"
	});
	return {
		deviceId: fingerprintPublicKey(publicKeyPem),
		publicKeyPem,
		privateKeyPem,
		createdAtMs: now
	};
}
function keyPairMatches(publicKeyPem, privateKeyPem) {
	try {
		deriveCanonicalEd25519PublicKeyRaw(publicKeyPem);
		deriveCanonicalEd25519PrivateKeyRaw(privateKeyPem);
		const publicKey = crypto.createPublicKey(publicKeyPem);
		const privateKey = crypto.createPrivateKey(privateKeyPem);
		if (publicKey.asymmetricKeyType !== "ed25519" || privateKey.asymmetricKeyType !== "ed25519") return false;
		const derivedPublicKey = crypto.createPublicKey(privateKeyPem).export({
			type: "spki",
			format: "der"
		});
		const storedPublicKey = publicKey.export({
			type: "spki",
			format: "der"
		});
		return Buffer.from(derivedPublicKey).equals(Buffer.from(storedPublicKey));
	} catch {
		return false;
	}
}
function parseCreatedAtMs(value) {
	return asSafeIntegerInRange(value, { min: 0 }) ?? null;
}
/** Validate persisted key material and return the canonical runtime shape. */
function validateStoredDeviceIdentity(value, identityKey = PRIMARY_DEVICE_IDENTITY_KEY) {
	try {
		if (!value.deviceId || !/^[a-f0-9]{64}$/.test(value.deviceId) || !value.publicKeyPem || !value.privateKeyPem || parseCreatedAtMs(value.createdAtMs) === null || !keyPairMatches(value.publicKeyPem, value.privateKeyPem)) throw invalidStoredIdentityError(identityKey);
		if (fingerprintPublicKey(value.publicKeyPem) !== value.deviceId) throw invalidStoredIdentityError(identityKey);
		return {
			deviceId: value.deviceId,
			publicKeyPem: value.publicKeyPem,
			privateKeyPem: value.privateKeyPem
		};
	} catch (error) {
		if (error instanceof DeviceIdentityStorageError) throw error;
		throw invalidStoredIdentityError(identityKey, error);
	}
}
function rowToStoredIdentity(row, expectedIdentityKey) {
	if (row.identity_key !== expectedIdentityKey || typeof row.device_id !== "string" || typeof row.public_key_pem !== "string" || typeof row.private_key_pem !== "string" || parseCreatedAtMs(row.created_at_ms) === null || parseCreatedAtMs(row.updated_at_ms) === null) throw invalidStoredIdentityError(expectedIdentityKey);
	return {
		deviceId: row.device_id,
		publicKeyPem: row.public_key_pem,
		privateKeyPem: row.private_key_pem,
		createdAtMs: row.created_at_ms
	};
}
function salvageStoredIdentityRow(row, expectedIdentityKey, repairedAtMs) {
	if (row.identity_key !== expectedIdentityKey || typeof row.public_key_pem !== "string" || typeof row.private_key_pem !== "string") return null;
	try {
		const publicKey = crypto.createPublicKey(row.public_key_pem);
		const privateKey = crypto.createPrivateKey(row.private_key_pem);
		if (publicKey.asymmetricKeyType !== "ed25519" || privateKey.asymmetricKeyType !== "ed25519") return null;
		const canonicalPublicKeyPem = publicKey.export({
			type: "spki",
			format: "pem"
		});
		const canonicalPrivateKeyPem = privateKey.export({
			type: "pkcs8",
			format: "pem"
		});
		if (crypto.createPublicKey(canonicalPrivateKeyPem).export({
			type: "spki",
			format: "pem"
		}) !== canonicalPublicKeyPem) return null;
		const createdAtMs = parseCreatedAtMs(row.created_at_ms) ?? parseCreatedAtMs(row.updated_at_ms) ?? repairedAtMs;
		const salvaged = {
			deviceId: fingerprintPublicKey(canonicalPublicKeyPem),
			publicKeyPem: canonicalPublicKeyPem,
			privateKeyPem: canonicalPrivateKeyPem,
			createdAtMs
		};
		validateStoredDeviceIdentity(salvaged, expectedIdentityKey);
		return salvaged;
	} catch {
		return null;
	}
}
function storedIdentityToRow(identityKey, stored, updatedAtMs = stored.createdAtMs) {
	return {
		identity_key: identityKey,
		device_id: stored.deviceId,
		public_key_pem: stored.publicKeyPem,
		private_key_pem: stored.privateKeyPem,
		created_at_ms: stored.createdAtMs,
		updated_at_ms: updatedAtMs
	};
}
function readStoredIdentityRowFromDatabase(database, identityKey) {
	const db = getNodeSqliteKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("device_identities").selectAll().where("identity_key", "=", identityKey)) ?? null;
}
function readStoredIdentityFromDatabase(database, identityKey) {
	const row = readStoredIdentityRowFromDatabase(database, identityKey);
	return row ? rowToStoredIdentity(row, identityKey) : null;
}
function isEmptyBootstrapIdentityTableMiss(database, error) {
	if (!(error instanceof Error) || !hasErrnoCode(error, "ERR_SQLITE_ERROR") || !/\bno such table: device_identities\b/iu.test(error.message)) return false;
	const db = getNodeSqliteKysely(database.db);
	return !executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("sqlite_master").select("name").where("name", "not like", "sqlite_%").limit(1));
}
/** Resolve the concrete database and row identity used by process caches and diagnostics. */
function resolveDeviceIdentityStore(options = {}) {
	return {
		databasePath: path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env)),
		identityKey: normalizeIdentityKey(options.identityKey)
	};
}
/** Read through the writable shared-state lifecycle, validating any existing row. */
function readStoredDeviceIdentity(options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	const stored = readStoredIdentityFromDatabase(openOpenClawStateDatabase({
		env: options.env,
		path: resolved.databasePath
	}), resolved.identityKey);
	if (stored) validateStoredDeviceIdentity(stored, resolved.identityKey);
	return stored;
}
/** Read without creating, repairing, chmodding, or joining the writer lifecycle. */
function readStoredDeviceIdentityReadOnly(options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly((database) => {
		let stored;
		try {
			stored = readStoredIdentityFromDatabase(database, resolved.identityKey);
		} catch (error) {
			if (isEmptyBootstrapIdentityTableMiss(database, error)) return null;
			throw error;
		}
		if (stored) validateStoredDeviceIdentity(stored, resolved.identityKey);
		return stored;
	}, {
		env: options.env,
		path: resolved.databasePath
	}) ?? null;
}
/** Insert a candidate only when the key is still absent, then return the authoritative row. */
function insertStoredDeviceIdentityIfAbsent(candidate, options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	validateStoredDeviceIdentity(candidate, resolved.identityKey);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const existing = readStoredIdentityFromDatabase({ db }, resolved.identityKey);
		if (existing) validateStoredDeviceIdentity(existing, resolved.identityKey);
		else {
			const kysely = getNodeSqliteKysely(db);
			executeSqliteQuerySync(db, kysely.insertInto("device_identities").values(storedIdentityToRow(resolved.identityKey, candidate)).onConflict((conflict) => conflict.column("identity_key").doNothing()));
		}
		const authoritative = readStoredIdentityFromDatabase({ db }, resolved.identityKey);
		if (!authoritative) throw new DeviceIdentityStorageError(`SQLite device identity "${resolved.identityKey}" was not durable after insert.`);
		validateStoredDeviceIdentity(authoritative, resolved.identityKey);
		return authoritative;
	}, {
		env: options.env,
		path: resolved.databasePath
	}, { operationLabel: "device-identity.create" });
}
/** Replace only an invalid authoritative row; preserve a valid concurrent winner. */
function repairInvalidStoredDeviceIdentity(candidate, options = {}) {
	const resolved = resolveDeviceIdentityStore(options);
	validateStoredDeviceIdentity(candidate, resolved.identityKey);
	return runOpenClawStateWriteTransaction(({ db }) => {
		let repaired = false;
		let rotated = false;
		let existingRow = null;
		try {
			existingRow = readStoredIdentityRowFromDatabase({ db }, resolved.identityKey);
			const existing = existingRow ? rowToStoredIdentity(existingRow, resolved.identityKey) : null;
			if (existing) {
				validateStoredDeviceIdentity(existing, resolved.identityKey);
				return {
					identity: existing,
					repaired,
					rotated
				};
			}
		} catch (error) {
			if (!(error instanceof DeviceIdentityStorageError)) throw error;
		}
		if (existingRow) {
			const salvaged = salvageStoredIdentityRow(existingRow, resolved.identityKey, candidate.createdAtMs);
			if (salvaged) {
				executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("device_identities").set({
					device_id: salvaged.deviceId,
					public_key_pem: salvaged.publicKeyPem,
					private_key_pem: salvaged.privateKeyPem,
					created_at_ms: salvaged.createdAtMs,
					updated_at_ms: candidate.createdAtMs
				}).where("identity_key", "=", resolved.identityKey));
				const authoritative = readStoredIdentityFromDatabase({ db }, resolved.identityKey);
				if (!authoritative) throw new DeviceIdentityStorageError(`SQLite device identity "${resolved.identityKey}" was not durable after repair.`);
				validateStoredDeviceIdentity(authoritative, resolved.identityKey);
				return {
					identity: authoritative,
					repaired: true,
					rotated
				};
			}
			executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("device_identities").where("identity_key", "=", resolved.identityKey));
		}
		repaired = true;
		rotated = true;
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("device_identities").values(storedIdentityToRow(resolved.identityKey, candidate)).onConflict((conflict) => conflict.column("identity_key").doNothing()));
		const authoritative = readStoredIdentityFromDatabase({ db }, resolved.identityKey);
		if (!authoritative) throw new DeviceIdentityStorageError(`SQLite device identity "${resolved.identityKey}" was not durable after repair.`);
		validateStoredDeviceIdentity(authoritative, resolved.identityKey);
		return {
			identity: authoritative,
			repaired,
			rotated
		};
	}, {
		env: options.env,
		path: resolved.databasePath
	}, { operationLabel: "device-identity.doctor-repair" });
}
//#endregion
//#region src/infra/device-identity.ts
const LEGACY_DEVICE_IDENTITY_RELATIVE_PATH = path.join("identity", "device.json");
const DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const NATIVE_CLAIM_SUFFIX = ".native-importing";
function toDeviceIdentity(stored) {
	return {
		deviceId: stored.deviceId,
		publicKeyPem: stored.publicKeyPem,
		privateKeyPem: stored.privateKeyPem
	};
}
/** Exact retired file owned by Doctor migration code. */
function resolveLegacyDeviceIdentityPath(options = {}) {
	const { databasePath } = resolveDeviceIdentityStore(options);
	return path.join(resolveOpenClawStateDirForDatabasePath(databasePath), LEGACY_DEVICE_IDENTITY_RELATIVE_PATH);
}
function assertNoPendingLegacyIdentity(options) {
	const { identityKey } = resolveDeviceIdentityStore(options);
	if (identityKey !== "primary") return;
	const legacyPath = resolveLegacyDeviceIdentityPath(options);
	if (pathMayExistSync(`${legacyPath}${DOCTOR_CLAIM_SUFFIX}`) || pathMayExistSync(`${legacyPath}${NATIVE_CLAIM_SUFFIX}`) || pathMayExistSync(legacyPath)) throw new Error(`Legacy device identity exists at ${legacyPath}. Run "openclaw doctor --fix" before starting the gateway or connecting this client.`);
}
function withDeviceIdentityCoordinator(options, operation) {
	const resolved = resolveDeviceIdentityStore(options);
	const resolvedOptions = {
		...options,
		path: resolved.databasePath,
		identityKey: resolved.identityKey
	};
	const coordinator = acquireDeviceIdentityCoordinator({
		databasePath: resolved.databasePath,
		stateDir: resolveOpenClawStateDirForDatabasePath(resolved.databasePath)
	});
	let result;
	try {
		result = operation(resolved, resolvedOptions);
	} catch (operationError) {
		let releaseFailed = false;
		let releaseError;
		try {
			coordinator.release();
		} catch (error) {
			releaseFailed = true;
			releaseError = error;
		}
		if (releaseFailed) throw createSqliteLifecycleAggregateError([operationError, releaseError], "device identity operation and coordinator release both failed", operationError);
		throw operationError;
	}
	coordinator.release();
	return result;
}
function loadOrCreateDeviceIdentityOwned(options) {
	const { databasePath } = resolveDeviceIdentityStore(options);
	const existing = pathMayExistSync(databasePath) ? readStoredDeviceIdentity(options) : null;
	if (existing) return toDeviceIdentity(existing);
	assertNoPendingLegacyIdentity(options);
	return toDeviceIdentity(insertStoredDeviceIdentityIfAbsent(generateStoredDeviceIdentity(), options));
}
/** Load a valid canonical identity or atomically create its SQLite row. */
function loadOrCreateDeviceIdentity(options = {}) {
	return withDeviceIdentityCoordinator(options, (_resolved, resolvedOptions) => loadOrCreateDeviceIdentityOwned(resolvedOptions));
}
/** Keep one authoritative identity stable for the lifetime of a state-dir process. */
function loadOrCreateProcessDeviceIdentity(options = {}) {
	return withDeviceIdentityCoordinator(options, (resolved, resolvedOptions) => {
		const cacheKey = `${resolved.databasePath}\0${resolved.identityKey}`;
		const cached = readProcessDeviceIdentity(cacheKey);
		if (cached) return cached;
		return cacheProcessDeviceIdentity(cacheKey, loadOrCreateDeviceIdentityOwned(resolvedOptions));
	});
}
/** Load a valid persisted identity without creating or mutating SQLite state. */
function loadDeviceIdentityIfPresent(options = {}) {
	const stored = readStoredDeviceIdentityReadOnly(options);
	if (stored) return toDeviceIdentity(stored);
	assertNoPendingLegacyIdentity(options);
	return null;
}
/** Sign a UTF-8 payload with a PEM Ed25519 private key and return base64url bytes. */
function signDevicePayload(privateKeyPem, payload) {
	return signEd25519Payload(privateKeyPem, payload);
}
/** Normalize PEM or raw base64/base64url public keys to canonical raw base64url bytes. */
function normalizeDevicePublicKeyBase64Url(publicKey) {
	return normalizeEd25519PublicKeyBase64Url(publicKey);
}
/** Derive the stable device id from PEM or raw base64/base64url public key material. */
function deriveDeviceIdFromPublicKey(publicKey) {
	try {
		const normalized = normalizeEd25519PublicKeyBase64Url(publicKey);
		if (!normalized) return null;
		const raw = Buffer.from(normalized, "base64url");
		return crypto.createHash("sha256").update(raw).digest("hex");
	} catch {
		return null;
	}
}
/** Export a PEM Ed25519 public key as canonical raw base64url bytes. */
function publicKeyRawBase64UrlFromPem(publicKeyPem) {
	return publicKeyRawBase64UrlFromEd25519Pem(publicKeyPem);
}
/** Verify a UTF-8 payload signature against PEM or raw base64/base64url public key material. */
function verifyDeviceSignature(publicKey, payload, signatureBase64Url) {
	return verifyEd25519Signature({
		publicKey,
		payload,
		signatureBase64Url
	});
}
//#endregion
export { readProcessDeviceIdentity as _, loadOrCreateProcessDeviceIdentity as a, signDevicePayload as c, generateStoredDeviceIdentity as d, readStoredDeviceIdentityReadOnly as f, cacheProcessDeviceIdentity as g, validateStoredDeviceIdentity as h, loadOrCreateDeviceIdentity as i, verifyDeviceSignature as l, resolveDeviceIdentityStore as m, deriveDeviceIdFromPublicKey as n, normalizeDevicePublicKeyBase64Url as o, repairInvalidStoredDeviceIdentity as p, loadDeviceIdentityIfPresent as r, publicKeyRawBase64UrlFromPem as s, assertNoPendingLegacyIdentity as t, DeviceIdentityStorageError as u, acquireDeviceIdentityCoordinator as v };
