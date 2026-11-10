import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as assertOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { o as readComparisonClaim } from "./legacy-main-session-migration-claims-BdO-kk9b.mjs";
//#region src/config/sessions/session-retirement-read.worker.ts
function readSessionRetirementInWorker(input) {
	const request = input.request;
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		assertOpenClawAgentDatabaseIdentity(database, input.expectedIdentity);
		if (request.operation === "keys") {
			const query = getSessionKysely(database.db).selectFrom("session_nodes").select("session_key");
			return {
				operation: "keys",
				keys: executeSqliteQuerySync(database.db, request.ordered ? query.orderBy("session_key") : query).rows.map((row) => row.session_key)
			};
		}
		return {
			operation: "comparison-claims",
			claims: request.keys.flatMap(({ key, canonicalKey }) => {
				const claim = readComparisonClaim(database, request.store, key, canonicalKey);
				return claim ? [claim] : [];
			})
		};
	}, {
		...input.database,
		env: cloneEnvWithPlatformSemantics(input.env)
	});
	return result.found ? result.value : request.operation === "keys" ? {
		operation: "keys",
		keys: []
	} : {
		operation: "comparison-claims",
		claims: []
	};
}
//#endregion
export { readSessionRetirementInWorker };
