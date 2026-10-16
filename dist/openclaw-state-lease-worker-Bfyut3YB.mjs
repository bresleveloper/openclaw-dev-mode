import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as getFileLockProcessStartTime } from "./pid-alive-CPS_shDt.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { a as createOpenClawStateLeaseLostError, n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import { i as requestSqliteWorkerOperationAdmission, s as takeSqliteWorkerOperationAdmissionAttachment } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as releaseOpenClawStateLeaseInTransaction, i as reclaimDeadOpenClawStateLeaseInTransaction, o as renewOpenClawStateLeaseInTransaction, t as acquireOpenClawStateLeaseInTransaction } from "./openclaw-state-lease-store-gySh31JU.mjs";
import { i as leaseHeartbeatState } from "./openclaw-state-lease-heartbeat-shared-BczGehzh.mjs";
import { c as withLeaseWriteTransaction, s as verifyOpenClawStateLeaseOwnership } from "./openclaw-state-lease-storage-CWBFhswN.mjs";
import { hostname } from "node:os";
import { isDeepStrictEqual } from "node:util";
//#region src/state/openclaw-state-lease-worker.ts
function takeLeaseExpiryObservation(identity) {
	const attachment = takeSqliteWorkerOperationAdmissionAttachment();
	if (!isRecord(attachment) || attachment.kind !== "state-lease-expiry" || !isDeepStrictEqual(attachment.identity, identity) || !(attachment.observation instanceof SharedArrayBuffer) || attachment.observation.byteLength !== (leaseHeartbeatState.startupPhase + 1) * BigInt64Array.BYTES_PER_ELEMENT) throw new Error("State lease worker requires its original expiry observation attachment");
	return new BigInt64Array(attachment.observation);
}
function publishLeaseExpiryObservation(shared, expiresAt) {
	if (Atomics.load(shared, leaseHeartbeatState.status) === leaseHeartbeatState.starting) Atomics.store(shared, leaseHeartbeatState.expiresAt, expiresAt);
}
function stageLeaseExpiryObservation(db, shared, expiresAt) {
	const value = BigInt(expiresAt ?? 0);
	if (!stageSqliteTransactionState(db, {
		stage() {},
		rollback() {},
		commit() {
			publishLeaseExpiryObservation(shared, value);
		}
	})) throw new Error("State lease expiry observation requires a coordinated transaction");
}
function readOwnedLeaseExpiry(database, identity) {
	return verifyOpenClawStateLeaseOwnership({
		...identity,
		leaseLabel: "state lease",
		transaction: database
	});
}
function assertOpenClawStateLeaseWorkerOwned(database, identity, purpose = "write", stage = "transaction") {
	const expiresAt = readOwnedLeaseExpiry(database, identity);
	requestSqliteWorkerOperationAdmission({
		stage,
		facts: {
			kind: purpose === "write" ? "state-lease" : `state-lease-${purpose}`,
			identity,
			expiresAt
		}
	});
	return readOwnedLeaseExpiry(database, identity);
}
/** The live owner grants this exact transaction; the receipt alone grants nothing. */
function assertOpenClawStateLeaseWorkerOwnedInTransaction(database, identity, purpose = "write", stage = "transaction") {
	if (!database.isTransaction) throw new Error("State lease worker ownership requires an active transaction");
	return assertOpenClawStateLeaseWorkerOwned(database, identity, purpose, stage);
}
/** One grant covers the complete lease set held by this transaction. */
function assertOpenClawStateLeasesWorkerOwnedInTransaction(database, identities, stage = "transaction") {
	if (!database.isTransaction) throw new Error("State lease worker ownership requires an active transaction");
	const keys = new Set(identities.map(({ scope, key }) => JSON.stringify([scope, key])));
	if (identities.length === 0 || keys.size !== identities.length) throw new Error("State lease worker transaction requires distinct live leases");
	const leases = identities.map((identity) => ({
		identity,
		expiresAt: readOwnedLeaseExpiry(database, identity)
	}));
	requestSqliteWorkerOperationAdmission({
		stage,
		facts: {
			kind: "state-leases",
			leases
		}
	});
	for (const identity of identities) readOwnedLeaseExpiry(database, identity);
}
function acquireOpenClawStateLeaseInWorker(input, databasePath, open) {
	const { identity, leaseMs, operationLabel, schemaPolicy } = input;
	const shared = input.observeExpiry ? takeLeaseExpiryObservation(identity) : void 0;
	const payloadJson = input.processBound ? JSON.stringify({ owner: {
		pid: process.pid,
		host: hostname(),
		startedAt: getFileLockProcessStartTime(process.pid, getSqliteWorkerStateContext().environment)
	} }) : null;
	try {
		return withLeaseWriteTransaction({
			scope: "shared",
			schemaPolicy,
			options: {
				...schemaPolicy === "existing" ? {} : { database: open() },
				path: databasePath,
				env: getSqliteWorkerStateContext().environment
			}
		}, operationLabel, (db) => {
			const facts = {
				kind: "state-lease-acquire",
				identity
			};
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts
			});
			reclaimDeadOpenClawStateLeaseInTransaction(db, identity);
			const result = acquireOpenClawStateLeaseInTransaction(db, identity, leaseMs, payloadJson);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts
			});
			if (shared && result.kind === "acquired") stageLeaseExpiryObservation(db, shared, result.expiresAt);
			return result;
		}, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
	} catch (cause) {
		throw new OpenClawStateLeaseError("State lease acquisition could not complete", {
			code: "OPENCLAW_STATE_LEASE_STORAGE_FAILED",
			cause
		});
	}
}
function executeOpenClawStateLeaseCommand(command, database) {
	if (command.type === "stateLease.verify") {
		const shared = takeLeaseExpiryObservation(command.input.identity);
		const expiresAt = assertOpenClawStateLeaseWorkerOwned(database.db, command.input.identity, "verify");
		publishLeaseExpiryObservation(shared, BigInt(expiresAt));
		return expiresAt;
	}
	const shared = command.type === "stateLease.renew" ? takeLeaseExpiryObservation(command.input.identity) : void 0;
	return runWithSqliteBusyTimeout(database.db, 0, () => runOpenClawStateWriteTransaction(({ db }) => {
		if (command.type === "stateLease.renew") {
			assertOpenClawStateLeaseWorkerOwnedInTransaction(db, command.input.identity, "renew");
			const expiresAt = renewOpenClawStateLeaseInTransaction(db, command.input.identity, command.input.leaseMs);
			if (expiresAt === void 0) throw createOpenClawStateLeaseLostError(command.input.identity);
			assertOpenClawStateLeaseWorkerOwnedInTransaction(db, command.input.identity, "renew", "commit");
			if (shared) stageLeaseExpiryObservation(db, shared, expiresAt);
			return expiresAt;
		}
		const facts = {
			kind: "state-lease-release",
			identity: command.input.identity
		};
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts
		});
		assertExistingDatabaseIdentity(database.path, command.input.databaseIdentity);
		releaseOpenClawStateLeaseInTransaction(db, command.input.identity);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts
		});
		assertExistingDatabaseIdentity(database.path, command.input.databaseIdentity);
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, {
		busyTimeoutMs: 0,
		operationLabel: command.input.operationLabel
	}));
}
//#endregion
export { executeOpenClawStateLeaseCommand as i, assertOpenClawStateLeaseWorkerOwnedInTransaction as n, assertOpenClawStateLeasesWorkerOwnedInTransaction as r, acquireOpenClawStateLeaseInWorker as t };
