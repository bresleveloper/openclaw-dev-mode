import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import path from "node:path";
//#region src/config/sessions/session-entry-cohort-scope.ts
function matchSessionEntryCohortScope(reader, input) {
	reader.assertCurrent();
	const key = resolveSqliteSessionKey(input.sessionKey, reader.logicalAgentId);
	if (key !== reader.sessionKey || input.agentId && normalizeAgentId(input.agentId) !== reader.logicalAgentId || input.storePath && !reader.storePaths.includes(path.resolve(input.storePath)) || input.env && resolveStateDir(input.env) !== resolveStateDir(reader.database.env)) return;
	return key;
}
function assertSessionEntryCohortScope(reader, input) {
	const key = matchSessionEntryCohortScope(reader, input);
	if (key === void 0) throw new Error("Session read differs from its original admitted target");
	return key;
}
//#endregion
export { matchSessionEntryCohortScope as n, assertSessionEntryCohortScope as t };
