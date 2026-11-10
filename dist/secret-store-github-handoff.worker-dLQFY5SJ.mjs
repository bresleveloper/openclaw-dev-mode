import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as classifyHiddenGitHubStoreName, r as GITHUB_SETUP_HANDOFF_MAX_AGE_MS } from "./secret-store-value-B2wKejcx.mjs";
import { t as withMissingSecretStoreFallback } from "./secret-store-sqlite-Bm3BSwuM.mjs";
import { i as readHiddenGitHubSecretInDatabase, n as deleteHiddenGitHubSecretInDatabase, o as writeHiddenGitHubSecretInDatabase, r as listHiddenGitHubSecretsInDatabase } from "./secret-store-hidden-github.kernel-oq1fy2PW.mjs";
//#region src/secrets/store/secret-store-github-handoff.worker.ts
const githubSetupOperations = {
	"githubSecrets.read": ({ name, now }, { open }) => readHiddenGitHubSecretInDatabase(open().db, name, now),
	"githubSecrets.list": ({ prefix, now }, { open }) => listHiddenGitHubSecretsInDatabase(open().db, prefix, now),
	"githubSecrets.write": (input, { write }) => write(({ db }) => writeHiddenGitHubSecretInDatabase(db, input), { operationLabel: "secrets.store.write" }),
	"githubSecrets.delete": ({ name }, { write }) => write(({ db }) => deleteHiddenGitHubSecretInDatabase(db, name), { operationLabel: "secrets.store.delete-hidden-github" }),
	"githubSetup.consume": ({ name, now }, context) => {
		if (classifyHiddenGitHubStoreName(name) !== "setup") return;
		return withMissingSecretStoreFallback(() => context.write(({ db }) => {
			return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).deleteFrom("secret_store_entries").where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", name).where("kind", "=", "secret").where("allowed_hosts", "is", null).where("created_at_ms", ">=", now - GITHUB_SETUP_HANDOFF_MAX_AGE_MS).where("created_at_ms", "<=", now).where("deleted_at_ms", "is", null).returning("value"))?.value;
		}, { operationLabel: "secrets.store.consume-github-setup-handoff" }), void 0);
	}
};
//#endregion
export { githubSetupOperations };
