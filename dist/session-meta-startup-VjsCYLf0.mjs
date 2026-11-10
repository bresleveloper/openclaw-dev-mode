import { s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { c as resolveOpenClawAgentSqlitePath, n as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { r as parseSqliteSessionEntryRecord } from "./session-entry-json-iiByG7LE.mjs";
import { _ as readAgentDatabaseAdmissionRefusal, m as listAgentDatabaseAdmissionRefusals } from "./agent-database-admission-CeDA0ojh.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as SessionStoreMigrationRequiredError } from "./migration-required-yTbtjJC4.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { n as buildAcpDatabaseSessionKey, t as acpSessionRowMatchesEntry } from "./session-meta-keys-BWMCJN-1.mjs";
import { n as resolveSessionStorePathForAcp } from "./session-meta-store-DksRcpO8.mjs";
import { t as legacyAcpSessionKeyCandidates } from "./session-meta-migration-keys-tz5TAmfV.mjs";
//#region src/acp/runtime/session-meta-startup.ts
function migrationRequired(source) {
	throw new SessionStoreMigrationRequiredError(`ACP metadata requires offline migration at ${source}. Stop the Gateway and run "openclaw doctor --fix" against the same state/config before starting OpenClaw.`);
}
/** Initial boot defers isolated stores; live readmission checks only its physical store. */
async function assertAcpSessionKeysMigratedForStartup(cfg, env, admittedAgentIds, admittedDatabase, assertCurrent) {
	assertCurrent?.();
	const result = await executeExistingOpenClawStateRead({ env }, { type: "acpSessions.list" });
	assertCurrent?.();
	if (!result) return;
	if (!result.ok || result.type !== "acpSessions.list") throw new Error("Could not inspect ACP metadata before session startup.");
	const candidateAgentIds = [.../* @__PURE__ */ new Set([...listAgentIds(cfg), ...admittedAgentIds])];
	const admittedPath = admittedDatabase ? resolveOpenClawAgentSqlitePath(admittedDatabase) : void 0;
	const refusedPaths = admittedDatabase ? [] : listAgentDatabaseAdmissionRefusals({ env }).flatMap(({ agentId }) => readAgentDatabaseAdmissionRefusal(agentId, { env })?.paths ?? []);
	const matchesPath = createOpenClawAgentDatabasePathMatcher();
	const candidatePath = (agentId, storePath, sessionKey) => resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolveSqliteReadScope({
		agentId,
		storePath,
		sessionKey,
		env
	})));
	const ownsPath = (agentId, storePath, sessionKey) => {
		if (admittedPath === void 0 && refusedPaths.length === 0) return true;
		const pathname = candidatePath(agentId, storePath, sessionKey);
		return admittedPath === void 0 ? !refusedPaths.some((refusedPath) => matchesPath(pathname, refusedPath)) : matchesPath(pathname, admittedPath);
	};
	for (const row of result.rows) {
		const identities = legacyAcpSessionKeyCandidates(row.session_key, candidateAgentIds);
		const candidates = [];
		for (const identity of identities) {
			let owner;
			try {
				owner = resolveSessionStorePathForAcp({
					cfg,
					env,
					sessionKey: identity.storeSessionKey,
					agentId: identity.agentId
				});
			} catch (error) {
				if (!(error instanceof AgentSelectionRequiredError)) throw error;
				const storePath = resolveSessionStorePathCore(cfg.session?.store, {
					agentId: identity.agentId,
					env
				});
				if (identity.ownerRecorded && ownsPath(identity.agentId, storePath, "")) migrationRequired(`unresolved shared ACP owner ${JSON.stringify(row.session_key)}`);
				continue;
			}
			candidates.push({
				owner,
				ownerRecorded: identity.ownerRecorded,
				local: ownsPath(owner.agentId, owner.storePath, owner.storeSessionKey)
			});
		}
		for (const candidate of candidates) {
			if (!candidate.local) continue;
			if (candidate.ownerRecorded && buildAcpDatabaseSessionKey(candidate.owner.storeSessionKey, candidate.owner.agentId) === row.session_key) continue;
			const { owner } = candidate;
			await withSessionEntryReadOnlyInWorker({
				agentId: owner.agentId,
				storePath: owner.storePath,
				env,
				sessionKey: owner.storeSessionKey
			}, () => assertCurrent?.(), async (read) => {
				if (!read.ok) migrationRequired(`unreadable ACP candidate store ${JSON.stringify(owner.storePath)}`);
				if (read.value && acpSessionRowMatchesEntry(row, read.value)) migrationRequired(`historical ACP key ${JSON.stringify(row.session_key)}`);
			});
			assertCurrent?.();
		}
	}
	if (!matchesPath.isCurrent()) throw new Error("ACP session store ownership changed during startup; retry admission.");
}
/** Boot admission only; ordinary reads never probe or normalize embedded metadata. */
function assertEmbeddedAcpMetadataMigratedForStartup(options) {
	const inspected = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getSessionKysely(database.db);
		for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
			"session_key",
			"entry_json",
			"current_session_id",
			"updated_at"
		]))) if (parseSqliteSessionEntryRecord(row)?.acp != null) return { session_key: row.session_key };
	}, options);
	if (inspected.found && inspected.value) migrationRequired(`agent ${JSON.stringify(options.agentId)} session ${JSON.stringify(inspected.value.session_key)}`);
}
//#endregion
export { assertAcpSessionKeysMigratedForStartup, assertEmbeddedAcpMetadataMigratedForStartup };
