import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { n as assertDatabasePathIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as resolveExistingSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as readConfigMachineStateRowInDatabase } from "./config-machine-state-row-BRr4hJIX.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import "./config-machine-state-DdwUh_Ff.mjs";
import { A as resetAuthProfileFailureState, s as personalCredentialPublication } from "./user-model-account-authority-DFFjC5J5.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { E as SHARED_AUTH_STORE_MIGRATION_KIND, N as readSharedAuthLegacyRowsFromDatabase, k as hasPendingSharedAuthCleanupInDatabase } from "./sqlite-BlFpr2YD.mjs";
import { a as parseSharedAuthStoreOwnership } from "./path-resolve-21Orzn6B.mjs";
import { i as SHARED_AUTH_STORE_STATE_KEY, l as readAuthProfileRows } from "./sqlite-json-Dyr7VLoH.mjs";
import { i as isMissingDatabasePath } from "./sqlite-read-pool-DiFi5Ms3.mjs";
import { o as writeConfigMachineStateInDatabase } from "./config-machine-state-write-CmW-lLFq.mjs";
import { f as readUserModelAuthProfile, g as updateUserModelAuthProfile, r as encodeUserModelAuthProfile } from "./user-model-accounts-CrjNQiMH.mjs";
import { n as sendAuthProfileUpdateValue } from "./store-update-transfer-2J4RGKmB.mjs";
import { i as reduceAuthProfileFailure } from "./usage-reduction-CowLLP6a.mjs";
import { t as enrollAuthProfileAuthorizationInDatabase } from "./authorization-enrollment-qxIdf8dG.mjs";
import { r as updateAuthProfileStoreInDatabase, t as recordAuthProfileUsageInDatabase } from "./usage-kernel-FASGF1bH.mjs";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { MessageChannel } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/shared-store-bootstrap.worker.ts
/** Hold the legacy source before shared state, matching auth writers and Doctor's exclusion. */
function bootstrapSharedAuthStoreInWorker(input, context) {
	const options = context.stateOptions();
	const initial = withExistingOpenClawStateDatabaseReadOnly(({ db: database }) => {
		const db = getNodeSqliteKysely(database);
		return executeSqliteQueryTakeFirstSync(database, db.selectNoFrom((expression) => [expression.selectFrom("config_machine_state").select("value_json").where("state_key", "=", SHARED_AUTH_STORE_STATE_KEY).as("ownership"), expression.exists(expression.selectFrom("migration_sources").select("source_key").where("migration_kind", "=", SHARED_AUTH_STORE_MIGRATION_KIND).where("source_path", "=", input.sourcePath).where("removed_source", "=", 0)).as("pendingCleanup")]));
	}, options);
	const initialOwnership = parseSharedAuthStoreOwnership(initial?.ownership == null ? void 0 : JSON.parse(initial.ownership));
	if (initialOwnership.location === "state-db" || initial?.pendingCleanup) return {
		ownership: initialOwnership,
		relocated: false
	};
	const commit = (emptySource) => {
		if (!emptySource) return {
			ownership: initialOwnership,
			relocated: false
		};
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const row = readConfigMachineStateRowInDatabase(db, SHARED_AUTH_STORE_STATE_KEY);
			const ownership = parseSharedAuthStoreOwnership(row ? JSON.parse(row.value_json) : void 0);
			const relocated = ownership.location === "legacy-main" && emptySource && !hasPendingSharedAuthCleanupInDatabase(db, input.sourcePath);
			const result = {
				ownership: relocated ? { location: "state-db" } : ownership,
				relocated
			};
			if (relocated) writeConfigMachineStateInDatabase(db, SHARED_AUTH_STORE_STATE_KEY, result.ownership);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			deferSqliteWorkerCommitReceipt(db, result);
			return result;
		}, options, { operationLabel: "auth-profiles.bootstrap" });
	};
	if (!input.sourceIdentity || input.legacySourcePaths.some((source) => fs.existsSync(source))) return commit(false);
	assertDatabasePathIdentity(input.sourcePath, input.sourceIdentity);
	if (!input.sourceIdentity.key.startsWith("file:")) return commit(true);
	let inspected = false;
	let source;
	try {
		source = openNodeSqliteDatabase(resolveExistingSqliteFileUri(input.sourcePath));
		return runSqliteImmediateTransactionSync(source, () => {
			assertDatabasePathIdentity(input.sourcePath, input.sourceIdentity);
			const rows = readSharedAuthLegacyRowsFromDatabase(source);
			inspected = true;
			return commit(!rows.store && !rows.state);
		}, { operationLabel: "auth-profiles.bootstrap-source" });
	} catch (error) {
		if (inspected) throw error;
		return commit(false);
	} finally {
		source?.close();
	}
}
//#endregion
//#region src/agents/auth-profiles/store.worker.ts
const authProfileOperations = {
	"authProfiles.enrollAuthorization": (input, { open, stateOptions }) => {
		const database = open();
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const result = enrollAuthProfileAuthorizationInDatabase(db, "shared-state", input);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return result;
		}, {
			...stateOptions(),
			database
		});
	},
	"authProfiles.bootstrap": bootstrapSharedAuthStoreInWorker,
	"authProfiles.personalReplace": (input, { open, stateOptions }) => {
		const database = open();
		const options = {
			...stateOptions(),
			database
		};
		let committed;
		personalCredentialPublication.capture(database.db, () => updateUserModelAuthProfile(input.profileId, (profile) => {
			if (!isDeepStrictEqual(profile, input.expected)) return false;
			profile.credential = input.next.credential;
			profile.usageStats = input.next.usageStats;
			return true;
		}, options, (operation) => {
			if (operation.stage === "transaction") requestSqliteWorkerOperationAdmission({
				stage: operation.stage,
				facts: void 0
			});
			else {
				committed = operation.profile;
				if (encodeUserModelAuthProfile(committed) !== encodeUserModelAuthProfile(input.next)) throw new Error("Personal credential codec changed the prepared update");
				const digest = createHash("sha256").update(stableStringify(committed)).digest("hex");
				requestSqliteWorkerOperationAdmission({
					stage: operation.stage,
					facts: digest
				});
				deferSqliteWorkerCommitReceipt(database.db, {
					digest,
					personalCredentials: personalCredentialPublication.capture(database.db, () => {}).receipt
				});
			}
		}));
		return committed;
	},
	"authProfiles.update": (input, { stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => {
		updateAuthProfileStoreInDatabase(db, "shared-state", input);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return true;
	}, stateOptions(), { operationLabel: "auth-profiles.update" }),
	"authProfiles.usage": (input, { stateOptions }) => runOpenClawStateWriteTransaction(({ db, path }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const receipt = recordAuthProfileUsageInDatabase(db, path, "shared-state", input);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return {
			ok: true,
			receipt
		};
	}, stateOptions(), { operationLabel: "auth-profiles.usage" }),
	"authProfiles.personalUsage": (input, { stateOptions }) => {
		let result;
		updateUserModelAuthProfile(input.profileId, (profile) => {
			if (!isDeepStrictEqual(profile.credential, input.reduction.expectedProfile)) return false;
			const now = Date.now();
			const previous = profile.usageStats;
			const next = input.reduction.kind === "success" ? resetAuthProfileFailureState(previous ?? {}, {
				lastUsed: input.reduction.lastUsed,
				lastProbeAt: now
			}, input.reduction.modelId) : reduceAuthProfileFailure(profile.credential, previous, input.reduction, now);
			if (!next) return false;
			profile.usageStats = next;
			result = {
				previous,
				next,
				now
			};
			return true;
		}, stateOptions(), ({ stage }) => requestSqliteWorkerOperationAdmission({
			stage,
			facts: void 0
		}));
		return result;
	},
	"authProfiles.read": (input, { stateOptions }) => {
		const read = () => {
			const options = stateOptions();
			const missing = {
				store: {
					status: "missing",
					reason: "database"
				},
				state: {
					status: "missing",
					reason: "database"
				},
				cacheable: false
			};
			try {
				return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readAuthProfileRows(db, options.path, "shared-state"), options) ?? missing;
			} catch {
				return isMissingDatabasePath(options.path) ? missing : {
					store: { status: "unreadable" },
					state: { status: "unreadable" },
					cacheable: false
				};
			}
		};
		const rows = input.artifactPreserving ? withArtifactPreservingStateReads(read) : read();
		const { port1, port2 } = new MessageChannel();
		try {
			sendAuthProfileUpdateValue(port1, rows);
			requestSqliteWorkerOperationAdmission({
				stage: "prepare",
				facts: {
					kind: "auth-store-read",
					port: port2
				}
			}, [port2]);
		} finally {
			port1.close();
			port2.close();
		}
	},
	"authProfiles.personal": (input, { stateOptions }) => {
		const read = () => readUserModelAuthProfile(input.profileId, stateOptions());
		return input.artifactPreserving ? withArtifactPreservingStateReads(read) : read();
	}
};
//#endregion
export { authProfileOperations };
