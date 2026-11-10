import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { n as normalizeConfigMachineStateKey } from "./config-machine-state-row-BRr4hJIX.mjs";
import { t as authProfileCredentialPublication } from "./user-model-account-authority-DFFjC5J5.mjs";
import { a as ensureConfigRevisionKeySchema } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { o as writeConfigMachineStateInDatabase } from "./config-machine-state-write-CmW-lLFq.mjs";
//#region src/gateway/config-revision-key.worker.ts
/** Return the installation key without rotating existing revision or response-session tokens. */
function loadOrCreateConfigRevisionKeyInDatabase(database, candidateKey) {
	ensureConfigRevisionKeySchema(database);
	const stored = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).insertInto("config_revision_keys").values({
		id: 1,
		hmac_key: candidateKey
	}).onConflict((conflict) => conflict.column("id").doUpdateSet((eb) => ({ hmac_key: eb.ref("config_revision_keys.hmac_key") }))).returning("hmac_key"));
	if (!stored) throw new Error("config revision key could not be created");
	return stored.hmac_key;
}
//#endregion
//#region src/state/config-machine-state.worker.ts
const machineStateOperations = {
	"machineState.configRevisionKey": (input, context) => context.write(({ db }) => loadOrCreateConfigRevisionKeyInDatabase(db, input.candidateKey), { operationLabel: "gateway.config-revision-key.load" }),
	"machineState.write": (input, context) => context.write(({ db }) => {
		const key = normalizeConfigMachineStateKey(input.key);
		if (key !== "authProfiles.store") return writeConfigMachineStateInDatabase(db, key, input.value);
		const { result, receipt } = authProfileCredentialPublication.capture(sqlPublicationAnchor(db), () => writeConfigMachineStateInDatabase(db, key, input.value));
		deferSqliteWorkerCommitReceipt(sqlPublicationAnchor(db), { authCredentials: authProfileCredentialPublication.bound(receipt) });
		return result;
	}, { operationLabel: "config-machine-state.write" })
};
//#endregion
export { machineStateOperations };
