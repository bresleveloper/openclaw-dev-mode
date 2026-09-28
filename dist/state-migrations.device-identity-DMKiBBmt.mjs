import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as recordLegacyMigrationReceipt, n as readLegacyMigrationReceipt, r as readLegacyMigrationReceiptFromDatabase, s as resolveLegacyMigrationSourceKey, t as markLegacyMigrationSourceRemoved } from "./state-migrations.receipts-D6lbWbKJ.mjs";
import { d as generateStoredDeviceIdentity, f as readStoredDeviceIdentityReadOnly, h as validateStoredDeviceIdentity, m as resolveDeviceIdentityStore, p as repairInvalidStoredDeviceIdentity, u as DeviceIdentityStorageError, v as acquireDeviceIdentityCoordinator } from "./device-identity-B_zMrBd6.mjs";
import { a as deriveEd25519PublicKeyRaw, i as deriveEd25519PrivateKeyRaw, o as ed25519PrivateKeyPemFromRaw, s as ed25519PublicKeyPemFromRaw, t as decodeCanonicalBase64OrBase64Url } from "./ed25519-signature-De1Kepnz.mjs";
import { t as pathMayExistSync } from "./path-existence-ZQl5cy75.mjs";
import { t as withLegacyMigrationStateLock } from "./state-migrations.lock-CC3fInLn.mjs";
import { l as resolveLegacyMigrationRelativePath, o as legacyMigrationSourceSnapshotsMatch, s as readLegacyMigrationSourceSnapshot } from "./state-migrations.source-snapshot-Bzxgpz55.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
import { root } from "@openclaw/fs-safe";
//#region src/infra/device-identity-legacy.ts
function fingerprintPublicKey(publicKeyPem) {
	return createHash("sha256").update(deriveEd25519PublicKeyRaw(publicKeyPem)).digest("hex");
}
function isValidCreatedAtMs$1(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function normalizeLegacyCreatedAtMs(value) {
	return isValidCreatedAtMs$1(value) ? value : Date.now();
}
function normalizeLegacyKeyPair(params) {
	try {
		const publicKeyRaw = deriveEd25519PublicKeyRaw(params.publicKeyPem);
		const privateKeyRaw = deriveEd25519PrivateKeyRaw(params.privateKeyPem);
		const publicKeyPem = ed25519PublicKeyPemFromRaw(publicKeyRaw);
		const privateKeyPem = ed25519PrivateKeyPemFromRaw(privateKeyRaw);
		const normalized = {
			deviceId: fingerprintPublicKey(publicKeyPem),
			publicKeyPem,
			privateKeyPem,
			createdAtMs: params.createdAtMs
		};
		validateStoredDeviceIdentity(normalized);
		return normalized;
	} catch {
		return null;
	}
}
/** Normalize a retired Node PEM or Swift raw-key payload for Doctor import. */
function normalizeLegacyDeviceIdentity(value) {
	if (isRecord(value) && value.version === 1 && typeof value.deviceId === "string" && typeof value.publicKeyPem === "string" && typeof value.privateKeyPem === "string") return normalizeLegacyKeyPair({
		createdAtMs: normalizeLegacyCreatedAtMs(value.createdAtMs),
		privateKeyPem: value.privateKeyPem,
		publicKeyPem: value.publicKeyPem
	});
	if (isRecord(value) && !("version" in value) && typeof value.deviceId === "string" && typeof value.publicKey === "string" && typeof value.privateKey === "string") try {
		const publicKeyRaw = decodeCanonicalBase64OrBase64Url(value.publicKey);
		const privateKeyRaw = decodeCanonicalBase64OrBase64Url(value.privateKey);
		return normalizeLegacyKeyPair({
			createdAtMs: normalizeLegacyCreatedAtMs(value.createdAtMs),
			privateKeyPem: ed25519PrivateKeyPemFromRaw(privateKeyRaw),
			publicKeyPem: ed25519PublicKeyPemFromRaw(publicKeyRaw)
		});
	} catch {
		return null;
	}
	return null;
}
//#endregion
//#region src/infra/state-migrations.device-identity-repair.ts
const LEGACY_IDENTITY_RELATIVE_PATH = path.join("identity", "device.json");
const DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const NATIVE_CLAIM_SUFFIX = ".native-importing";
const IDENTITY_KEY$1 = "primary";
/** Detect retired paths for an authorized importer; only Doctor may rotate invalid SQLite state. */
function detectLegacyDeviceIdentity(params) {
	const sourcePath = path.join(params.stateDir, LEGACY_IDENTITY_RELATIVE_PATH);
	const claimPath = `${sourcePath}${DOCTOR_CLAIM_SUFFIX}`;
	const nativeClaimPath = `${sourcePath}${NATIVE_CLAIM_SUFFIX}`;
	const doctorAuthorized = params.doctorOnlyStateMigrations === true;
	const importAuthorized = doctorAuthorized || params.allowLegacyDeviceIdentityImport === true;
	let hasInvalidCanonical = false;
	if (doctorAuthorized) try {
		readStoredDeviceIdentityReadOnly({
			env: {
				...params.env ?? process.env,
				OPENCLAW_STATE_DIR: params.stateDir
			},
			identityKey: IDENTITY_KEY$1
		});
	} catch (error) {
		hasInvalidCanonical = error instanceof DeviceIdentityStorageError;
	}
	return {
		sourcePath,
		claimPath,
		nativeClaimPath,
		hasLegacy: importAuthorized && (pathMayExistSync(claimPath) || pathMayExistSync(nativeClaimPath) || pathMayExistSync(sourcePath)),
		hasInvalidCanonical
	};
}
function hasLegacyDeviceIdentityPath(detected) {
	return pathMayExistSync(detected.claimPath) || pathMayExistSync(detected.nativeClaimPath) || pathMayExistSync(detected.sourcePath);
}
/** Generate a replacement only after the caller acquires Doctor's exclusive state lock. */
function repairInvalidCanonicalIdentity(env) {
	try {
		const result = repairInvalidStoredDeviceIdentity(generateStoredDeviceIdentity(), {
			env,
			identityKey: IDENTITY_KEY$1
		});
		if (!result.repaired) return {
			changes: [],
			warnings: []
		};
		if (!result.rotated) return {
			changes: ["Repaired invalid primary device identity metadata in SQLite."],
			warnings: []
		};
		return {
			changes: ["Replaced invalid primary device identity in SQLite."],
			warnings: [],
			notices: ["The repaired device has a new identity and must be approved again."]
		};
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed repairing invalid SQLite device identity: ${formatErrorMessage(error)}`]
		};
	}
}
//#endregion
//#region src/infra/state-migrations.device-identity.ts
const IDENTITY_KEY = "primary";
const MIGRATION_KIND = "legacy-device-identity-json";
const MAX_LEGACY_IDENTITY_BYTES = 131072;
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
function isValidCreatedAtMs(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function deviceIdentityKeyMaterialMatches(left, right) {
	try {
		return deriveEd25519PublicKeyRaw(left.publicKeyPem).equals(deriveEd25519PublicKeyRaw(right.publicKeyPem)) && deriveEd25519PrivateKeyRaw(left.privateKeyPem).equals(deriveEd25519PrivateKeyRaw(right.privateKeyPem));
	} catch {
		return false;
	}
}
function relativeLegacyPath(stateDir, filePath) {
	return resolveLegacyMigrationRelativePath(stateDir, filePath, "device identity", false);
}
async function readLegacySourceSnapshot(params) {
	const snapshot = await readLegacyMigrationSourceSnapshot({
		...params,
		maxBytes: MAX_LEGACY_IDENTITY_BYTES,
		label: "device identity"
	});
	const identity = normalizeLegacyDeviceIdentity(JSON.parse(utf8Decoder.decode(snapshot.buffer)));
	if (!identity) throw new Error("legacy device identity is invalid or unsupported");
	return {
		...snapshot,
		identity
	};
}
function classifyCanonicalRow(row, identity) {
	if (!isValidCreatedAtMs(row.updated_at_ms)) return "invalid";
	try {
		validateStoredDeviceIdentity({
			deviceId: row.device_id,
			publicKeyPem: row.public_key_pem,
			privateKeyPem: row.private_key_pem,
			createdAtMs: row.created_at_ms
		}, row.identity_key);
	} catch {
		return "invalid";
	}
	return row.identity_key === IDENTITY_KEY && row.device_id === identity.deviceId && deviceIdentityKeyMaterialMatches({
		deviceId: row.device_id,
		publicKeyPem: row.public_key_pem,
		privateKeyPem: row.private_key_pem
	}, identity) ? "same" : "different";
}
function readCanonicalIdentity(db) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("device_identities").selectAll().where("identity_key", "=", IDENTITY_KEY));
}
function verifyCanonicalIdentity(identity, env) {
	const { db } = openOpenClawStateDatabase({ env });
	const row = readCanonicalIdentity(db);
	if (!row || classifyCanonicalRow(row, identity) !== "same") throw new Error("canonical SQLite device identity no longer matches the legacy source");
}
function importAndRecordReceipt(params) {
	const sourceKey = resolveLegacyMigrationSourceKey("device-identity-json", params.sourcePath);
	const runId = `${sourceKey}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const existingReceipt = readLegacyMigrationReceiptFromDatabase(db, sourceKey);
		if (existingReceipt) {
			if (existingReceipt.sourceSha256 !== params.snapshot.sha256) throw new Error("migration receipt belongs to different device identity bytes");
			const existing = readCanonicalIdentity(db);
			if (!existing || classifyCanonicalRow(existing, params.snapshot.identity) !== "same") throw new Error("migration receipt does not match the canonical device identity");
			return {
				sourceKey,
				imported: false
			};
		}
		const existing = readCanonicalIdentity(db);
		const existingState = existing ? classifyCanonicalRow(existing, params.snapshot.identity) : void 0;
		if (existingState === "different") throw new Error("canonical SQLite device identity differs from the legacy identity");
		const imported = !existing || existingState === "invalid";
		const repaired = existingState === "invalid";
		if (!existing) executeSqliteQuerySync(db, stateDb.insertInto("device_identities").values({
			identity_key: IDENTITY_KEY,
			device_id: params.snapshot.identity.deviceId,
			public_key_pem: params.snapshot.identity.publicKeyPem,
			private_key_pem: params.snapshot.identity.privateKeyPem,
			created_at_ms: params.snapshot.identity.createdAtMs,
			updated_at_ms: now
		}));
		else if (repaired) executeSqliteQuerySync(db, stateDb.updateTable("device_identities").set({
			device_id: params.snapshot.identity.deviceId,
			public_key_pem: params.snapshot.identity.publicKeyPem,
			private_key_pem: params.snapshot.identity.privateKeyPem,
			created_at_ms: params.snapshot.identity.createdAtMs,
			updated_at_ms: now
		}).where("identity_key", "=", IDENTITY_KEY));
		const verified = readCanonicalIdentity(db);
		if (!verified || classifyCanonicalRow(verified, params.snapshot.identity) !== "same") throw new Error("SQLite verification failed for the primary device identity");
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND,
			target: "device_identities",
			identityKey: IDENTITY_KEY,
			deviceId: params.snapshot.identity.deviceId,
			sourceSha256: params.snapshot.sha256,
			importedRecordCount: imported ? 1 : 0,
			preservedSqliteRecordCount: existing ? 1 : 0,
			repairedSqliteRecordCount: repaired ? 1 : 0
		});
		recordLegacyMigrationReceipt(db, {
			sourceKey,
			migrationKind: MIGRATION_KIND,
			sourcePath: params.sourcePath,
			targetTable: "device_identities",
			sourceSha256: params.snapshot.sha256,
			sourceSizeBytes: params.snapshot.size,
			sourceRecordCount: 1,
			runId,
			now,
			reportJson
		});
		return {
			sourceKey,
			imported
		};
	}, { env: params.env });
}
async function removePath(params) {
	if (params.removeSource) {
		await params.removeSource(params.sourcePath);
		return;
	}
	await params.stateRoot.remove(relativeLegacyPath(params.stateDir, params.sourcePath));
}
async function restoreClaim(params) {
	try {
		if (!await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.claimPath))) return null;
		if (await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.sourcePath))) return `source path already exists: ${params.sourcePath}`;
		await params.stateRoot.move(relativeLegacyPath(params.stateDir, params.claimPath), relativeLegacyPath(params.stateDir, params.sourcePath));
		return null;
	} catch (error) {
		return String(error);
	}
}
async function cleanupReceiptSources(params) {
	if (await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.detected.nativeClaimPath))) return {
		changes: [],
		warnings: ["Native device identity import is pending; restart the native app before running Doctor cleanup."]
	};
	const changes = [];
	const warnings = [];
	const notices = [];
	let removed = 0;
	for (const candidate of [params.detected.sourcePath, params.detected.claimPath]) {
		if (!await params.stateRoot.exists(relativeLegacyPath(params.stateDir, candidate))) continue;
		let snapshot;
		try {
			snapshot = await readLegacySourceSnapshot({
				stateRoot: params.stateRoot,
				stateDir: params.stateDir,
				sourcePath: candidate
			});
		} catch (error) {
			warnings.push(`Retired device identity cleanup refused ${candidate}: ${String(error)}`);
			continue;
		}
		if (snapshot.sha256 !== params.receipt.sourceSha256) {
			try {
				if (readStoredDeviceIdentityReadOnly({
					env: params.env,
					identityKey: IDENTITY_KEY
				})) {
					notices.push(`Preserved retired device identity ${candidate}: bytes differ from the migration receipt; the canonical SQLite identity remains authoritative. Archive or delete the file to clear this notice.`);
					continue;
				}
			} catch {}
			warnings.push(`Retired device identity cleanup preserved ${candidate}: bytes differ from the migration receipt.`);
			continue;
		}
		try {
			verifyCanonicalIdentity(snapshot.identity, params.env);
			await removePath({
				...params,
				sourcePath: candidate
			});
			removed += 1;
		} catch (error) {
			warnings.push(`Retired device identity cleanup failed for ${candidate}: ${String(error)}`);
		}
	}
	if (warnings.length === 0 && (!params.receipt.removedSource || removed > 0) && (notices.length === 0 || removed > 0)) markLegacyMigrationSourceRemoved(params.receipt.sourceKey, params.env);
	if (removed > 0) changes.push("Removed retired device identity JSON covered by its SQLite receipt.");
	return {
		changes,
		warnings,
		notices
	};
}
async function migrateWithExclusiveStateOwnership(params) {
	const receipt = readLegacyMigrationReceipt(resolveLegacyMigrationSourceKey("device-identity-json", params.detected.sourcePath), params.env);
	if (receipt) return await cleanupReceiptSources({
		...params,
		receipt
	});
	if (await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.detected.nativeClaimPath))) return {
		changes: [],
		warnings: ["Native device identity import is pending; restart the native app before running Doctor."]
	};
	const hasSource = await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.detected.sourcePath));
	const hasClaim = await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.detected.claimPath));
	if (hasSource && hasClaim) return {
		changes: [],
		warnings: ["Failed migrating legacy device identity: source and interrupted claim both exist."]
	};
	const activePath = hasSource ? params.detected.sourcePath : hasClaim ? params.detected.claimPath : null;
	if (!activePath) return {
		changes: [],
		warnings: []
	};
	let snapshot;
	try {
		snapshot = await readLegacySourceSnapshot({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: activePath
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed reading legacy device identity: ${String(error)}`]
		};
	}
	if (activePath === params.detected.sourcePath) try {
		params.beforeClaim?.(params.detected.sourcePath);
		await params.stateRoot.move(relativeLegacyPath(params.stateDir, params.detected.sourcePath), relativeLegacyPath(params.stateDir, params.detected.claimPath));
		const claimed = await readLegacySourceSnapshot({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: params.detected.claimPath
		});
		if (!legacyMigrationSourceSnapshotsMatch(snapshot, claimed)) throw new Error("legacy device identity changed before Doctor could claim it");
		snapshot = claimed;
	} catch (error) {
		const restoreError = await restoreClaim({
			...params,
			...params.detected
		});
		return {
			changes: [],
			warnings: [`Failed migrating legacy device identity: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	let result;
	try {
		result = importAndRecordReceipt({
			env: params.env,
			sourcePath: params.detected.sourcePath,
			snapshot
		});
	} catch (error) {
		const restoreError = await restoreClaim({
			...params,
			...params.detected
		});
		return {
			changes: [],
			warnings: [`Failed migrating legacy device identity: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	try {
		params.beforeCleanup?.();
		if (await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.detected.sourcePath))) throw new Error("legacy device identity source reappeared during import");
		const finalSnapshot = await readLegacySourceSnapshot({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: params.detected.claimPath
		});
		if (!legacyMigrationSourceSnapshotsMatch(snapshot, finalSnapshot)) throw new Error("legacy device identity claim changed after SQLite import");
		verifyCanonicalIdentity(finalSnapshot.identity, params.env);
		await removePath({
			...params,
			sourcePath: params.detected.claimPath
		});
		if (await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.detected.claimPath))) throw new Error("legacy device identity Doctor claim remains after cleanup");
		markLegacyMigrationSourceRemoved(result.sourceKey, params.env);
	} catch (error) {
		return {
			changes: [],
			warnings: [`Device identity is in SQLite, but legacy cleanup failed: ${String(error)}`]
		};
	}
	return {
		changes: [result.imported ? "Migrated primary device identity to SQLite." : "Preserved identical primary device identity already in SQLite."],
		warnings: [],
		notices: ["Removed retired device identity JSON after verified SQLite import."]
	};
}
/**
* Import a verified retired primary identity under explicit Doctor or startup authority.
* Startup authority cannot repair or replace an invalid canonical identity.
*/
async function migrateLegacyDeviceIdentity(params) {
	if (!params.detected.hasLegacy && !params.detected.hasInvalidCanonical) return {
		changes: [],
		warnings: []
	};
	if (params.doctorOnlyStateMigrations !== true && params.allowLegacyDeviceIdentityImport !== true) return {
		changes: [],
		warnings: []
	};
	let identityCoordinator;
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy device identity",
		releaseLabel: "Device identity",
		errorLabel: "Failed reading legacy device identity state",
		beforeRelease: () => identityCoordinator?.release(),
		run: async (env) => {
			try {
				identityCoordinator = acquireDeviceIdentityCoordinator({
					databasePath: resolveDeviceIdentityStore({
						env,
						identityKey: IDENTITY_KEY
					}).databasePath,
					stateDir: params.stateDir
				});
			} catch (error) {
				return {
					changes: [],
					warnings: [`Failed migrating legacy device identity: identity state is busy (${formatErrorMessage(error)}).`]
				};
			}
			if (hasLegacyDeviceIdentityPath(params.detected)) {
				const stateRoot = await root(params.stateDir, {
					hardlinks: "reject",
					maxBytes: MAX_LEGACY_IDENTITY_BYTES,
					symlinks: "reject"
				});
				return await migrateWithExclusiveStateOwnership({
					...params,
					env,
					stateRoot
				});
			}
			return params.detected.hasInvalidCanonical ? repairInvalidCanonicalIdentity(env) : {
				changes: [],
				warnings: []
			};
		}
	});
}
//#endregion
export { detectLegacyDeviceIdentity as n, migrateLegacyDeviceIdentity as t };
