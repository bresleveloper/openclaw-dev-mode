import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { i as OpenClawAgentDatabaseMediaMigrationRequiredError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-BnRd2KGO.mjs";
import { i as closeOpenClawAgentDatabaseByPath } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { a as isOpenClawAgentDatabaseOpen } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { a as stripRuntimeOnlySessionSkillsFields, l as hasLegacySessionEntryState, u as hasLegacySessionProviderState } from "./store-entry-shape-sjH_uIYB.mjs";
import { _ as scanDoctorSessionEntriesTolerant } from "./session-accessor-Czw4l8kI.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { n as createLegacyStateMigrationStepReceipt, t as DoctorStateMigrationRefusalError } from "./state-migrations.messages-CB0bXmSE.mjs";
import { r as listExistingAgentDatabaseTargets } from "./session-sqlite-migration-readers-CrMHjx1c.mjs";
import { t as migrateLegacySessionEntryState } from "./session-entry-shape-DbHda4lP.mjs";
import { n as normalizeLegacySessionEntryDelivery } from "./state-migrations.legacy-session-store-Dl_TES-P.mjs";
import { i as scanDoctorSessionEntryRecords, r as rewriteDoctorSessionEntries } from "./session-entry-rewrite-BDkjlbP2.mjs";
import { n as backupDoctorSqliteDatabases } from "./doctor-migration-backup-CaaJT0rP.mjs";
import { t as runDoctorAgentDatabaseOperation } from "./doctor-agent-database-operation--LF6LcEu.mjs";
//#region src/commands/doctor-session-delivery-state.ts
/** Scan or rewrite legacy delivery fields inside existing session row JSON. */
function repairCanonicalSessionDeliveryStates(params) {
	return repairCanonicalSessionEntries({
		...params,
		transform: normalizeLegacySessionEntryDelivery,
		updateDeliveryProjection: true
	});
}
function repairCanonicalSessionResolvedSkills(params) {
	return repairCanonicalSessionEntries({
		...params,
		transform: stripRuntimeOnlySessionSkillsFields,
		updateDeliveryProjection: false
	});
}
function prepareSessionEntryRepairs(params) {
	const targets = params.targets ?? listExistingAgentDatabaseTargets(params.cfg, params.env);
	const pending = targets.flatMap((target) => {
		const sessionKeys = [];
		const scope = {
			agentId: target.agentId,
			env: params.env,
			storePath: target.sqlitePath
		};
		const scan = () => {
			const identity = readDatabasePathIdentitySync(target.sqlitePath);
			if (params.source === "raw") scanDoctorSessionEntryRecords(scope, ({ entry, sessionKey }) => {
				if (params.rawNeedsRepair(entry)) sessionKeys.push(sessionKey);
			}, identity);
			else scanDoctorSessionEntriesTolerant(scope, ({ entry, recoveredFromProjections, sessionKey }) => {
				if (!recoveredFromProjections && params.transform(entry, sessionKey, "scan") !== entry) sessionKeys.push(sessionKey);
			});
			assertExistingDatabaseIdentity(target.sqlitePath, identity.key, identity.birthtime);
			return {
				target,
				scope,
				sessionKeys,
				identity
			};
		};
		try {
			const operation = params.source === "raw" ? {
				ok: true,
				value: scan()
			} : runDoctorAgentDatabaseOperation({
				agentId: target.agentId,
				path: target.sqlitePath,
				run: scan
			});
			return operation.ok && sessionKeys.length > 0 ? [operation.value] : [];
		} catch (error) {
			if (params.source === "raw" && params.deferSchemaRepair && (error instanceof SqliteSchemaMismatchError || error instanceof OpenClawAgentDatabaseMediaMigrationRequiredError)) {
				note(`- Session entry inspection awaits its database schema repair: ${formatErrorMessage(error)}`, "Session SQLite");
				return [];
			}
			throw error;
		}
	});
	return {
		targets,
		pending,
		found: pending.reduce((count, item) => count + item.sessionKeys.length, 0),
		scannedStores: targets.length,
		apply(assertCurrent) {
			let repaired = 0;
			for (const { target, scope, sessionKeys, identity } of pending) {
				const wasOpen = isOpenClawAgentDatabaseOpen(target.sqlitePath);
				try {
					repaired += rewriteDoctorSessionEntries({
						scope,
						sessionKeys,
						...params.source === "raw" ? { rawTransform: params.rawTransform } : { transform: (entry, sessionKey) => params.transform(entry, sessionKey, "repair") },
						expectedIdentity: identity,
						updateDeliveryProjection: params.updateDeliveryProjection,
						...assertCurrent ? { assertCurrent: () => assertCurrent(target) } : {}
					});
				} finally {
					if (!wasOpen) closeOpenClawAgentDatabaseByPath(target.sqlitePath);
				}
			}
			return repaired;
		}
	};
}
function repairCanonicalSessionEntries(params) {
	const plan = prepareSessionEntryRepairs({
		...params,
		source: "canonical"
	});
	return {
		found: plan.found,
		repaired: params.apply ? plan.apply() : 0,
		scannedStores: plan.scannedStores
	};
}
/** Raw repair and its backup precede all canonical session readers. */
async function repairLegacySessionEntryStates(params) {
	try {
		const plan = prepareSessionEntryRepairs({
			...params,
			source: "raw",
			rawNeedsRepair: hasLegacySessionEntryState,
			rawTransform: (entry, sessionKey, updatedAt) => {
				if (!hasLegacySessionEntryState(entry)) return entry;
				const next = migrateLegacySessionEntryState(entry, updatedAt, sessionKey);
				return hasLegacySessionProviderState(entry) ? normalizeLegacySessionEntryDelivery(next) : next;
			},
			updateDeliveryProjection: true
		});
		const report = {
			found: plan.found,
			repaired: 0,
			scannedStores: plan.scannedStores
		};
		if (!params.apply || plan.found === 0) return report;
		const maintenance = getOpenClawDatabaseMaintenanceScope();
		const authority = params.authority ?? (maintenance?.ownsSchemaMaintenance ? { assertCurrent: () => maintenance.assertAdmission() } : void 0);
		if (!authority) throw new Error("Session entry state repair requires Doctor maintenance ownership.");
		const identities = new Map(plan.pending.map(({ target, identity }) => [target, identity]));
		const assertTargetCurrent = (target) => {
			authority.assertCurrent();
			const identity = identities.get(target);
			assertExistingDatabaseIdentity(target.sqlitePath, identity.key, identity.birthtime);
		};
		const assertCurrent = () => {
			for (const target of identities.keys()) assertTargetCurrent(target);
		};
		assertCurrent();
		const backup = await backupDoctorSqliteDatabases({
			env: params.env,
			pendingDatabasePaths: plan.pending.map(({ target }) => target.sqlitePath),
			databasePaths: plan.targets.map((target) => target.sqlitePath),
			authority: { assertCurrent }
		});
		assertCurrent();
		note(backup.changes.map((change) => `- ${change}`).join("\n"), "Session SQLite backups");
		report.repaired = plan.apply(assertTargetCurrent);
		for (const { target, scope, identity } of plan.pending) {
			assertTargetCurrent(target);
			scanDoctorSessionEntryRecords(scope, ({ entry, sessionKey }) => {
				if (hasLegacySessionEntryState(entry)) throw new Error(`Legacy session state remains in ${sessionKey}; original rows are backed up. Resolve the remaining row repair before retrying Doctor.`);
			}, identity);
			assertTargetCurrent(target);
		}
		note(`- Canonicalized entry state for ${report.repaired} durable session row(s).`, "Session SQLite");
		return report;
	} catch (error) {
		const endpoints = [{
			kind: "owner",
			id: "session-entry-state"
		}];
		throw new DoctorStateMigrationRefusalError([createLegacyStateMigrationStepReceipt({
			id: "session-entry-state",
			phase: "final",
			source: endpoints,
			target: endpoints,
			requiredness: "required",
			reversibility: "checkpoint-required"
		}, {
			changes: [],
			warnings: [formatErrorMessage(error)]
		})]);
	}
}
//#endregion
export { repairLegacySessionEntryStates as i, repairCanonicalSessionEntries as n, repairCanonicalSessionResolvedSkills as r, repairCanonicalSessionDeliveryStates as t };
