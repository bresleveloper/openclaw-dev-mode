import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import { d as pathExists, w as root } from "./fs-safe-BAPek8At.mjs";
import { Jn as string, Nt as array, Pn as number, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./errors-DnjwnOju.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { s as acquireStateDatabaseCoordinator } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { c as resolveWorkspaceStateIdentity, o as resolveCanonicalWorkspacePath } from "./workspace-state-identity-CmGr5k4K.mjs";
import { t as movePathWithCopyFallback } from "./replace-file-DJtj9VLX.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { a as recordLegacyMigrationRun, o as recordLegacyMigrationSource, s as resolveLegacyMigrationSourceKey } from "./state-migrations.receipts-D6lbWbKJ.mjs";
import { n as isUpdateRehearsalReadOnlyPath, r as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-5kPjh__X.mjs";
import { a as readWorkspaceStateSnapshot, l as WORKSPACE_CONTENT_RELOCATION_MIGRATION_KIND, s as retireWorkspaceRelocationAttestation } from "./workspace-state-store-DTZ2RTNw.mjs";
import { c as assertWorkspaceStateMigrationReady } from "./workspace-legacy-state-6xtqRcEJ.mjs";
import { n as resolveCronJobsStorePathFromConfig } from "./paths-Bz2goYfd.mjs";
import { v as loadCronJobsStoreWithConfigJobsReadOnly } from "./store-CV1wrdMb.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-Bd-leLaO.mjs";
import { t as removePathWithinRoot } from "./fs-safe-remove-voSEe4IL.mjs";
import { E as readSkillProposalTargetTreeSha256, S as readSkillProposalRollback, a as readSkillProposal, d as resolveSkillProposalTarget, m as reconcileInterruptedSkillProposalApply, o as readSkillProposalBundle, r as importLegacySkillProposal, t as SkillProposalDraftMissingError, w as hashSkillProposalContent } from "./store-BH7wGiUH.mjs";
import { a as updateProposal, f as validateSkillProposalRecord, i as readStoredProposal, p as validateSkillProposalRollback, r as parseSkillProposalRow } from "./store-sqlite-record-B7LlWdpb.mjs";
import { i as transitionPendingSkillProposalToStale } from "./apply-transition-D00YCb_L.mjs";
import { a as readLegacyWorkshopJson, c as inferOwnerAgentId, d as readLegacyWorkshopSourceStat, f as resolveLegacyWorkshopWorkspaceDir, h as migrateLegacyCollectionBackups, l as isReadOnlyRehearsalProposal, m as listWorkspaceOwnerAgentIds, n as LEGACY_WORKSHOP_PROPOSALS_DIR, o as readWorkshopMigrationRecords, p as listPendingLegacyCollectionBackupRoots, r as LEGACY_WORKSHOP_PROPOSAL_ID_PATTERN, s as classifyWorkshopRelocation, t as LEGACY_WORKSHOP_MAX_RECORD_BYTES, u as planWorkshopRelocation } from "./doctor-skill-workshop-sources-D2hrCDhC.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/commands/doctor-skill-workshop-automations.ts
function automationFields(job) {
	const fields = [];
	if (job.payload.kind === "command") {
		fields.push(...job.payload.argv.map((value, index) => ({
			field: `payload.argv[${index}]`,
			value,
			completePath: true
		})));
		if (job.payload.cwd) fields.push({
			field: "payload.cwd",
			value: job.payload.cwd,
			completePath: true
		});
	} else if (job.payload.kind === "agentTurn") fields.push({
		field: "payload.message",
		value: job.payload.message,
		completePath: false
	});
	if (job.trigger) fields.push({
		field: "trigger.script",
		value: job.trigger.script,
		completePath: false
	});
	return fields;
}
function containsLiteralRoot(value, root) {
	for (let index = value.indexOf(root); index !== -1; index = value.indexOf(root, index + root.length)) {
		const before = value[index - 1];
		const after = value[index + root.length];
		if ((!before || /[\s"'`=([{,:;]/u.test(before)) && (!after || after === path.sep || /[\s"'`),\]};]/u.test(after))) return true;
	}
	return false;
}
async function existingPath(filename) {
	try {
		return await fs.realpath(filename);
	} catch (error) {
		if (isMissingPathError(error)) return;
		throw error;
	}
}
/** Historical apply events keep the original target after proposal retargeting. */
async function inspectWorkshopAutomationReferences(params) {
	const records = new Map(params.records.map((entry) => [entry.record.id, entry]));
	const relocations = /* @__PURE__ */ new Map();
	for (const event of params.appliedEvents) {
		const entry = records.get(event.proposalId);
		const originalFile = event.payload?.targetSkillFile;
		if (!entry || entry.record.kind !== "create" || entry.record.status !== "applied" || typeof originalFile !== "string" || !path.isAbsolute(originalFile) || path.basename(originalFile) !== "SKILL.md") continue;
		const source = path.dirname(originalFile);
		const destination = path.resolve(entry.record.target.skillDir);
		const { ownerAgentId } = inferOwnerAgentId({
			config: params.config,
			env: params.env,
			record: entry.record,
			workspaceDir: void 0,
			rowOwnerAgentId: entry.ownerAgentId
		});
		if (!ownerAgentId || !entry.ownerAgentId || source === destination || !resolveLegacyWorkshopWorkspaceDir(source, params.config, params.env) || !isPathInside(resolveWorkshopSkillsDir(params.config, ownerAgentId, params.env), destination)) continue;
		const destinations = relocations.get(source) ?? /* @__PURE__ */ new Set();
		destinations.add(destination);
		relocations.set(source, destinations);
	}
	if (relocations.size === 0) return [];
	const stateEnv = params.stateEnv ?? params.env;
	const { store } = await loadCronJobsStoreWithConfigJobsReadOnly(resolveCronJobsStorePathFromConfig(params.config, params.env, stateEnv), stateEnv);
	const references = [];
	const orderedRelocations = [...relocations].toSorted(([left], [right]) => left.localeCompare(right));
	for (const job of store.jobs.toSorted((left, right) => left.id.localeCompare(right.id))) for (const { field, value, completePath } of automationFields(job)) for (const [source, destinations] of orderedRelocations) {
		if (!containsLiteralRoot(value, source)) continue;
		const exactPath = completePath && path.isAbsolute(value) && isPathInside(source, value);
		if (await existingPath(exactPath ? value : source)) continue;
		let fixHint = "Relocation target unresolved: retained records do not identify one destination. Review this field manually.";
		if (destinations.size === 1) {
			const destination = [...destinations][0];
			const destinationRoot = await existingPath(destination);
			if (exactPath && destinationRoot) {
				const replacement = path.join(destination, path.relative(source, value));
				const resolved = await existingPath(replacement);
				fixHint = resolved && isPathInside(destinationRoot, resolved) ? `Verified replacement path: ${replacement}. Review this field manually; Doctor leaves automation content unchanged.` : "Replacement path unresolved: the mapped target is missing or outside the Workshop skill. Review this field manually.";
			} else if (destinationRoot) fixHint = `Recorded directory relocation: ${source} -> ${destination}. Embedded target unresolved; review this field manually. Doctor leaves automation content unchanged.`;
			else fixHint = "Replacement path unresolved: the recorded Workshop destination is missing. Review this field manually.";
		}
		references.push({
			automationId: job.id,
			field,
			message: `Automation ${job.id} ${field} references legacy Workshop path ${source}.`,
			fixHint
		});
	}
	return references;
}
//#endregion
//#region src/commands/doctor-skill-workshop-sidecars.ts
const WORKSHOP_DIR = "skill-workshop";
const MANIFEST_PATH = `${WORKSHOP_DIR}/proposals.json`;
const RECOVERY_PROPOSALS_DIR = `${`${WORKSHOP_DIR}/recovery`}/proposals`;
const MAX_ROLLBACK_BYTES = 134217728;
async function readLegacyRollback(stateRoot, proposalId) {
	try {
		const rollback = validateSkillProposalRollback(await readLegacyWorkshopJson(stateRoot, `${LEGACY_WORKSHOP_PROPOSALS_DIR}/${proposalId}/rollback.json`, MAX_ROLLBACK_BYTES));
		if (!rollback.ok) throw new Error(rollback.error.message);
		if (rollback.value.proposalId !== proposalId) throw new Error("invalid rollback metadata");
		return rollback.value;
	} catch (error) {
		if (isMissingPathError(error)) return;
		throw error;
	}
}
async function verifyImportedProposal(config, env, record, rollback) {
	const imported = (await readSkillProposal(record.id, {
		config,
		env
	}, {}, {
		config,
		reconcile: false
	}))?.record;
	if (!imported || imported.draftHash !== record.draftHash || imported.target.skillFile !== record.target.skillFile) throw new Error("SQLite verification failed");
	if (rollback && !await readSkillProposalRollback(record.id, { env })) throw new Error("SQLite rollback verification failed");
}
async function readLegacyProposalArtifacts(stateRoot, record, env) {
	const rollback = await readLegacyRollback(stateRoot, record.id);
	if (rollback && isUpdateRehearsalReadOnlyPath(rollback.targetSkillFile, env)) return null;
	const draft = await stateRoot.read(`${LEGACY_WORKSHOP_PROPOSALS_DIR}/${record.id}/PROPOSAL.md`, {
		hardlinks: "reject",
		maxBytes: LEGACY_WORKSHOP_MAX_RECORD_BYTES,
		symlinks: "reject"
	}).catch((error) => {
		if (rollback && isMissingPathError(error)) throw new Error("Legacy bundle has a missing draft and unfinished apply recovery; restore its draft before retrying Doctor.");
		throw error;
	});
	if (hashSkillProposalContent(draft.buffer.toString("utf8")) !== record.draftHash) throw new Error("proposal draft hash does not match proposal metadata");
	return rollback;
}
async function prepareLegacyProposal(params) {
	const proposalDir = `${LEGACY_WORKSHOP_PROPOSALS_DIR}/${params.proposalId}`;
	const record = validateSkillProposalRecord(await readLegacyWorkshopJson(params.stateRoot, `${proposalDir}/proposal.json`, LEGACY_WORKSHOP_MAX_RECORD_BYTES));
	if (!record.ok) throw new Error(record.error.message);
	if (record.value.id !== params.proposalId) throw new Error("invalid proposal metadata");
	if (isReadOnlyRehearsalProposal(record.value, params.env)) return null;
	const rollback = await readLegacyProposalArtifacts(params.stateRoot, record.value, params.env);
	if (rollback === null) return null;
	const workspaceDir = resolveLegacyWorkshopWorkspaceDir(record.value.target.skillDir, params.config, params.env);
	const owner = inferOwnerAgentId({
		config: params.config,
		env: params.env,
		record: record.value,
		workspaceDir
	});
	if (!owner.ownerAgentId) {
		if (rollback) throw new Error(`Legacy bundle has unfinished apply recovery at ${path.join(resolveStateDir(params.env), proposalDir, "rollback.json")}; resolve its owning agent and recover the retained apply before retrying Doctor.`);
		const candidates = workspaceDir ? listWorkspaceOwnerAgentIds(params.config, params.env, workspaceDir).toSorted() : [];
		const reason = owner.unconfiguredOwnerAgentId ? `owning agent "${owner.unconfiguredOwnerAgentId}" is not configured` : "owning agent could not be inferred";
		return { warning: `Preserved Skill Workshop proposal ${path.join(resolveStateDir(params.env), proposalDir)} for manual review: ${reason}; target ${record.value.target.skillDir} (candidate agents: ${candidates.join(", ") || "none"}). Review the retained metadata and configured workspace ownership before retrying Doctor.` };
	}
	return {
		record: record.value,
		ownerAgentId: owner.ownerAgentId
	};
}
async function migrateProposal(params) {
	const { record, ownerAgentId } = params.prepared;
	if (isReadOnlyRehearsalProposal(record, params.env)) return false;
	const proposalDir = `${LEGACY_WORKSHOP_PROPOSALS_DIR}/${record.id}`;
	const rollback = await readLegacyProposalArtifacts(params.stateRoot, record, params.env);
	if (rollback === null) return false;
	importLegacySkillProposal({
		record,
		rollback,
		ownerAgentId,
		store: { env: params.env }
	});
	await verifyImportedProposal(params.config, params.env, record, rollback);
	if (rollback) await params.stateRoot.remove(`${proposalDir}/rollback.json`);
	await params.stateRoot.remove(`${proposalDir}/proposal.json`);
	return true;
}
async function reconcileIncompleteProposal(params) {
	if ((await params.stateRoot.list(params.proposalDir, { withFileTypes: true })).length === 0) {
		await params.stateRoot.remove(params.proposalDir);
		return `Removed empty legacy Skill Workshop proposal directory ${params.proposalId}.`;
	}
	await params.stateRoot.mkdir(RECOVERY_PROPOSALS_DIR);
	const recoveryPath = `${RECOVERY_PROPOSALS_DIR}/${params.proposalId}-${randomUUID()}`;
	await params.stateRoot.move(params.proposalDir, recoveryPath, { overwrite: true });
	return `Quarantined incomplete Skill Workshop proposal ${params.proposalId} to ${recoveryPath} for manual recovery.`;
}
/** Import verified legacy proposal sidecars, then remove only the imported JSON metadata. */
async function importLegacySkillProposalSidecars(params) {
	const env = params.env ?? process.env;
	const stateDir = resolveStateDir(env);
	if (!await pathExists(path.join(stateDir, "skill-workshop/proposals"))) {
		if (!await pathExists(path.join(stateDir, MANIFEST_PATH))) return {
			changes: [],
			warnings: [],
			detected: 0,
			migrated: 0
		};
		await removePathWithinRoot({
			rootDir: stateDir,
			relativePath: MANIFEST_PATH
		});
		return {
			changes: ["Removed the empty legacy Skill Workshop proposal index."],
			warnings: [],
			detected: 0,
			migrated: 0
		};
	}
	const stateRoot = await root(stateDir);
	let entries;
	try {
		entries = await stateRoot.list(LEGACY_WORKSHOP_PROPOSALS_DIR, { withFileTypes: true });
	} catch (error) {
		if (hasErrnoCode(error, "not-found")) return {
			changes: [],
			warnings: [],
			detected: 0,
			migrated: 0
		};
		return {
			changes: [],
			warnings: [`Failed to inspect legacy Skill Workshop proposals: ${String(error)}`],
			detected: 0,
			migrated: 0
		};
	}
	const proposalIds = entries.filter((entry) => entry.isDirectory && LEGACY_WORKSHOP_PROPOSAL_ID_PATTERN.test(entry.name)).map((entry) => entry.name).toSorted((left, right) => left.localeCompare(right));
	const warnings = [];
	const changes = [];
	let recoverableWarningCount = 0;
	const prepared = /* @__PURE__ */ new Map();
	for (const proposalId of proposalIds) try {
		prepared.set(proposalId, await prepareLegacyProposal({
			config: params.config,
			env,
			proposalId,
			stateRoot
		}));
	} catch (error) {
		prepared.set(proposalId, { error });
	}
	const database = openOpenClawStateDatabase({ env });
	const kysely = getNodeSqliteKysely(database.db);
	let migrated = 0;
	let retainedForRehearsal = false;
	for (const proposalId of proposalIds) {
		const proposalDir = `${LEGACY_WORKSHOP_PROPOSALS_DIR}/${proposalId}`;
		const proposal = prepared.get(proposalId);
		if (proposal === null) {
			retainedForRehearsal = true;
			continue;
		}
		if ("warning" in proposal) {
			warnings.push(proposal.warning);
			recoverableWarningCount += 1;
			continue;
		}
		try {
			if ("error" in proposal) throw proposal.error;
			if (await migrateProposal({
				config: params.config,
				env,
				prepared: proposal,
				stateRoot
			})) migrated += 1;
			else retainedForRehearsal = true;
			continue;
		} catch (error) {
			if (!isMissingPathError(error)) {
				warnings.push(`Failed to migrate Skill Workshop proposal ${proposalId}: ${String(error)}`);
				continue;
			}
			const stored = tableExists(database.db, "skill_workshop_proposals") ? executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("skill_workshop_proposals").selectAll().where("proposal_id", "=", proposalId).where("owner_agent_id", "is not", null)) : void 0;
			if (stored && parseSkillProposalRow(stored)) continue;
			try {
				changes.push(await reconcileIncompleteProposal({
					proposalId,
					proposalDir,
					stateRoot
				}));
			} catch (reconcileError) {
				warnings.push(`Could not quarantine incomplete Skill Workshop proposal ${proposalId}: ${String(reconcileError)}. Manually move ${proposalDir} to ${RECOVERY_PROPOSALS_DIR} to recover it.`);
			}
		}
	}
	if (!retainedForRehearsal) await removePathWithinRoot({
		rootDir: stateDir,
		relativePath: MANIFEST_PATH
	}).catch((error) => {
		if (!isMissingPathError(error)) warnings.push(`Failed to remove legacy Skill Workshop proposal index: ${String(error)}`);
	});
	if (migrated > 0) changes.unshift(`Migrated ${migrated} Skill Workshop proposal${migrated === 1 ? "" : "s"} into shared SQLite.`);
	return {
		changes,
		warnings,
		...warnings.length > 0 && warnings.length === recoverableWarningCount ? { warningDisposition: "recoverable" } : {},
		detected: proposalIds.length,
		migrated
	};
}
//#endregion
//#region src/commands/doctor-skill-workshop-workspaces.ts
const MIGRATION_KIND = WORKSPACE_CONTENT_RELOCATION_MIGRATION_KIND;
const absolutePathSchema = string().refine((value) => path.isAbsolute(value) && path.resolve(value) === value);
const relocationSchema = strictObject({
	workspaceDir: absolutePathSchema,
	workspaceKey: string(),
	workspacePath: absolutePathSchema,
	directoryIdentity: string(),
	attestedAtMs: number().int().nonnegative(),
	moves: array(strictObject({
		source: absolutePathSchema,
		destination: absolutePathSchema,
		sha256: string().regex(/^[a-f0-9]{64}$/u)
	})).min(1)
});
async function directoryIdentity(directory) {
	try {
		const stat = await fs.stat(directory, { bigint: true });
		return stat.isDirectory() ? `${stat.dev}:${stat.ino}:${stat.birthtimeNs}` : void 0;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
async function containsOnlyMovingSkills(workspaceDir, sources, beforeMove) {
	const moving = new Set(beforeMove ? sources : []);
	const parents = /* @__PURE__ */ new Set();
	for (const source of sources) {
		if (!isPathInside(workspaceDir, source) || source === workspaceDir) return false;
		for (let parent = path.dirname(source); parent !== workspaceDir; parent = path.dirname(parent)) parents.add(parent);
	}
	const pending = [workspaceDir];
	while (pending.length > 0) {
		const directory = pending.pop();
		for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
			const entryPath = path.join(directory, entry.name);
			if (entry.name === ".DS_Store" && entry.isFile()) continue;
			if (!entry.isDirectory()) return false;
			if (moving.has(entryPath)) moving.delete(entryPath);
			else if (parents.has(entryPath)) pending.push(entryPath);
			else return false;
		}
	}
	return moving.size === 0;
}
/** Persist the pre-move facts; a retry must not infer them from an already empty workspace. */
async function prepareWorkshopWorkspaceRelocation(workspaceDir, moves, env) {
	if ([workspaceDir, ...moves.flatMap((move) => [move.source, move.destination])].some((filePath) => isUpdateRehearsalReadOnlyPath(filePath, env))) return;
	const sourceKey = resolveLegacyMigrationSourceKey(MIGRATION_KIND, workspaceDir);
	const database = openOpenClawStateDatabase({ env });
	const kysely = getNodeSqliteKysely(database.db);
	if (executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("migration_sources").select("status").where("source_key", "=", sourceKey))?.status === "prepared") return;
	const snapshot = await readWorkspaceStateSnapshot(workspaceDir, {
		env,
		readOnly: true
	});
	const attestation = snapshot.attestation;
	const now = Date.now();
	if (snapshot.setupExists || !attestation || attestation.generatedHashes.size > 0 || attestation.attestedAtMs > now || now - attestation.attestedAtMs > 864e5) return;
	const identity = await directoryIdentity(workspaceDir);
	if (!identity || !await containsOnlyMovingSkills(workspaceDir, moves.map((move) => move.source), true)) return;
	const captured = {
		workspaceDir,
		...snapshot.identity,
		directoryIdentity: identity,
		attestedAtMs: attestation.attestedAtMs,
		moves: await Promise.all(moves.map(async (move) => ({
			source: move.source,
			destination: move.destination,
			sha256: await readSkillProposalTargetTreeSha256(move.source, { includeRootMetadata: true })
		})))
	};
	if (await directoryIdentity(workspaceDir) !== identity) return;
	const reportJson = JSON.stringify(captured);
	runOpenClawStateWriteTransaction(({ db }) => {
		if (executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("migration_sources").select("status").where("source_key", "=", sourceKey))?.status === "prepared") return;
		const runId = randomUUID();
		recordLegacyMigrationRun(db, {
			runId,
			startedAt: now,
			finishedAt: null,
			status: "prepared",
			reportJson
		});
		recordLegacyMigrationSource(db, {
			sourceKey,
			migrationKind: MIGRATION_KIND,
			sourcePath: workspaceDir,
			targetTable: "workspace_setup_state",
			sourceSha256: null,
			sourceSizeBytes: null,
			sourceRecordCount: moves.length,
			runId,
			status: "prepared",
			importedAt: now,
			reportJson,
			upsert: true
		});
	}, { env });
}
/** Retire only obsolete skill-only evidence; missing, changed, and refreshed workspaces stay guarded. */
async function finishWorkshopWorkspaceRelocations(env) {
	const database = openOpenClawStateDatabase({ env });
	const kysely = getNodeSqliteKysely(database.db);
	const receipts = executeSqliteQuerySync(database.db, kysely.selectFrom("migration_sources").selectAll().where("migration_kind", "=", MIGRATION_KIND).where("status", "=", "prepared")).rows;
	for (const receipt of receipts) {
		const captured = relocationSchema.parse(JSON.parse(receipt.report_json));
		const retainedPaths = [
			captured.workspaceDir,
			captured.workspacePath,
			...captured.moves.flatMap((move) => [move.source, move.destination])
		];
		if (retainedPaths.some((filePath) => isUpdateRehearsalReadOnlyPath(filePath, env))) continue;
		const sources = captured.moves.map((move) => move.source);
		let complete = await directoryIdentity(captured.workspaceDir) === captured.directoryIdentity;
		if (complete) complete = await containsOnlyMovingSkills(captured.workspaceDir, sources, false);
		for (const move of complete ? captured.moves : []) if (await directoryIdentity(move.source) !== void 0 || await directoryIdentity(move.destination) === void 0 || await readSkillProposalTargetTreeSha256(move.destination, { includeRootMetadata: true }) !== move.sha256) {
			complete = false;
			break;
		}
		if (complete) complete = await directoryIdentity(captured.workspaceDir) === captured.directoryIdentity;
		runOpenClawStateWriteTransaction((writeDatabase) => {
			if (retainedPaths.some((filePath) => isUpdateRehearsalReadOnlyPath(filePath, env))) return;
			const { db } = writeDatabase;
			const current = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("migration_sources").selectAll().where("source_key", "=", receipt.source_key));
			if (current?.status !== "prepared" || current.report_json !== receipt.report_json) return;
			const retired = complete && retireWorkspaceRelocationAttestation({
				database: writeDatabase,
				identity: captured,
				attestedAtMs: captured.attestedAtMs
			});
			const status = retired ? "completed" : "superseded";
			const reportJson = JSON.stringify({
				...captured,
				outcome: retired ? "obsolete attestation retired" : "workspace or attestation changed"
			});
			executeSqliteQuerySync(db, kysely.updateTable("migration_sources").set({
				status,
				report_json: reportJson
			}).where("source_key", "=", receipt.source_key));
			recordLegacyMigrationRun(db, {
				runId: current.last_run_id,
				startedAt: current.imported_at,
				finishedAt: Date.now(),
				status,
				reportJson,
				upsert: true
			});
		}, { env });
	}
}
//#endregion
//#region src/commands/doctor-skill-workshop-sqlite.ts
async function inspectLegacySkillWorkshopMigration(params) {
	const env = params.env ?? process.env;
	const stateEnv = params.stateEnv ?? env;
	const { records, appliedEvents } = await readWorkshopMigrationRecords(stateEnv, true);
	const { external } = classifyWorkshopRelocation(records.filter(({ record }) => !isReadOnlyRehearsalProposal(record, env)), params.config, env);
	const backups = await listPendingLegacyCollectionBackupRoots(params.config, env);
	const automationReferences = await inspectWorkshopAutomationReferences({
		config: params.config,
		env,
		stateEnv,
		records,
		appliedEvents
	});
	return {
		externalProposalCount: external.length,
		externalProposalCountsByAgent: external.reduce((counts, plan) => {
			const ownerAgentId = plan.ownerAgentId ?? plan.unconfiguredOwnerAgentId ?? "unknown";
			counts[ownerAgentId] = (counts[ownerAgentId] ?? 0) + 1;
			return counts;
		}, {}),
		...external.length > 0 ? { externalProposalDetails: external.toSorted((left, right) => left.record.id.localeCompare(right.record.id)).slice(0, 20).map(({ record, ownerAgentId, unconfiguredOwnerAgentId }) => truncateWithMarker(`${record.id}: ${record.target.skillDir} (owner: ${ownerAgentId ?? unconfiguredOwnerAgentId ?? "unknown"})`, 2e3, {
			marker: "…",
			reserve: 1,
			trimEnd: true
		})) } : {},
		legacyBackupRootCount: backups.length,
		preservedLegacyBackupRootCount: backups.filter((backup) => "warning" in backup).length,
		...automationReferences.length > 0 ? { automationReferences } : {}
	};
}
async function relocateLegacyWorkshopTargets(config, env, backupRoots, unavailableWorkspaceDirs = /* @__PURE__ */ new Map()) {
	const database = openOpenClawStateDatabase({ env });
	const kysely = getNodeSqliteKysely(database.db);
	const readRows = () => tableExists(database.db, "skill_workshop_proposals") ? executeSqliteQuerySync(database.db, kysely.selectFrom("skill_workshop_proposals").selectAll()).rows : [];
	const deferredSources = /* @__PURE__ */ new Set();
	const recoverableDeferredSources = /* @__PURE__ */ new Set();
	const hasRollback = (proposalId) => tableExists(database.db, "skill_workshop_proposal_rollbacks") && executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("skill_workshop_proposal_rollbacks").select("proposal_id").where("proposal_id", "=", proposalId)) !== void 0;
	const recoveryWarnings = [];
	const readOnlyProposalIds = new Set(resolveUpdateRehearsalRoot(env) && tableExists(database.db, "skill_workshop_proposal_rollbacks") ? executeSqliteQuerySync(database.db, kysely.selectFrom("skill_workshop_proposal_rollbacks").select(["proposal_id", "target_skill_file"])).rows.filter((row) => isUpdateRehearsalReadOnlyPath(row.target_skill_file, env)).map((row) => row.proposal_id) : []);
	let missingDraftsRetired = 0;
	let recoverableWarningCount = 0;
	for (const row of readRows()) {
		const record = parseSkillProposalRow(row);
		if (!record || record.status !== "pending") continue;
		if (readOnlyProposalIds.has(record.id) || isReadOnlyRehearsalProposal(record, env)) {
			const source = resolveCanonicalWorkspacePath(record.target.skillDir);
			deferredSources.add(source);
			recoverableDeferredSources.add(source);
			continue;
		}
		const workspaceDir = resolveLegacyWorkshopWorkspaceDir(record.target.skillDir, config, env);
		const unavailableReason = workspaceDir && unavailableWorkspaceDirs.get(resolveWorkspaceStateIdentity(workspaceDir).workspacePath);
		if (unavailableReason && hasRollback(record.id)) {
			const source = resolveCanonicalWorkspacePath(record.target.skillDir);
			deferredSources.add(source);
			recoverableDeferredSources.add(source);
			recoveryWarnings.push(`Preserved Skill Workshop proposal ${record.id} and its unfinished apply recovery for manual review: ${unavailableReason}`);
			recoverableWarningCount += 1;
			continue;
		}
		try {
			await readSkillProposalBundle(record, {
				config,
				env
			});
		} catch (error) {
			if (!(error instanceof SkillProposalDraftMissingError)) {
				recoveryWarnings.push(`Could not inspect Skill Workshop proposal ${record.id}: ${String(error)}`);
				deferredSources.add(resolveCanonicalWorkspacePath(record.target.skillDir));
				continue;
			}
			if (hasRollback(record.id)) {
				recoveryWarnings.push(`Skill Workshop proposal ${record.id} has a missing draft and unfinished apply recovery; restore its draft before retrying Doctor.`);
				deferredSources.add(resolveCanonicalWorkspacePath(record.target.skillDir));
				continue;
			}
			transitionPendingSkillProposalToStale({
				record,
				reason: "Proposal draft is missing. Metadata and remaining files were preserved for recovery.",
				input: {
					config,
					env,
					eventActor: { type: "system" }
				}
			});
			missingDraftsRetired += 1;
			continue;
		}
		const { ownerAgentId } = inferOwnerAgentId({
			record,
			config,
			env,
			workspaceDir,
			rowOwnerAgentId: row.owner_agent_id
		});
		if (!workspaceDir || !ownerAgentId || isPathInside(resolveWorkshopSkillsDir(config, ownerAgentId, env), record.target.skillDir) || !await readSkillProposalRollback(record.id, { env })) continue;
		try {
			assertWorkspaceStateMigrationReady({
				workspaceDirs: [workspaceDir],
				env,
				operation: "doctor"
			});
			const sourceStat = await readLegacyWorkshopSourceStat(workspaceDir, record.target.skillDir);
			if (sourceStat?.isSymbolicLink()) continue;
			const skillsRoot = [path.join(workspaceDir, "skills"), path.join(workspaceDir, ".agents", "skills")].find((rootDir) => isPathInside(rootDir, record.target.skillDir));
			if (!skillsRoot) throw new Error("the original skill root could not be verified");
			const target = resolveSkillProposalTarget({
				skillName: record.target.skillKey,
				config,
				agentId: ownerAgentId,
				env
			});
			if (!sourceStat && await pathExists(target.skillDir)) throw new Error("the original skill is missing and its destination already exists");
			const store = {
				config,
				env,
				agentId: ownerAgentId
			};
			const proposal = await readSkillProposalBundle(record, store);
			if (!await reconcileInterruptedSkillProposalApply({
				record,
				expectedRecordJson: row.record_json,
				draftContent: proposal.content,
				skillsRoot,
				store
			})) throw new Error("the interrupted apply could not be verified or restored");
		} catch (error) {
			deferredSources.add(resolveCanonicalWorkspacePath(record.target.skillDir));
			recoveryWarnings.push(`Skill Workshop did not relocate ${record.target.skillDir}: ${String(error)}. Recovery for proposal ${record.id} remains pending; check its files and saved proposal before retrying Doctor.`);
		}
	}
	const rows = readRows();
	const initialRows = new Map(rows.map((row) => [row.proposal_id, row]));
	const records = rows.flatMap((row) => {
		const record = parseSkillProposalRow(row);
		return record && !readOnlyProposalIds.has(record.id) ? [{
			record,
			ownerAgentId: row.owner_agent_id
		}] : [];
	});
	const persistedUpdates = [];
	const persistUpdates = (updates) => {
		if (updates.length === 0 || updates.some(({ record }) => isReadOnlyRehearsalProposal(record, env))) return;
		if (runOpenClawStateWriteTransaction(({ db }) => {
			const currentUpdates = updates.map((update) => {
				const expected = initialRows.get(update.record.id);
				const current = readStoredProposal(update.record.id, { env });
				if (!current || current.row.record_json !== expected?.record_json || current.row.owner_agent_id !== expected?.owner_agent_id) throw new Error(`Skill proposal changed during relocation: ${update.record.id}`);
				return {
					update,
					current
				};
			});
			if (currentUpdates.some(({ current }) => isReadOnlyRehearsalProposal(current.record, env))) return false;
			for (const { update, current } of currentUpdates) updateProposal(db, current.row, update.record, update.ownerAgentId);
			return true;
		}, { env }, { operationLabel: "skill-workshop.relocation.commit" })) persistedUpdates.push(...updates);
	};
	const plan = await planWorkshopRelocation(records, config, env, deferredSources, unavailableWorkspaceDirs, recoverableDeferredSources);
	const workspaceMoves = /* @__PURE__ */ new Map();
	for (const move of plan.moves) {
		if (move.operation === "adopt") continue;
		const moves = workspaceMoves.get(move.workspaceDir) ?? [];
		moves.push(move);
		workspaceMoves.set(move.workspaceDir, moves);
	}
	for (const [workspaceDir, moves] of workspaceMoves) await prepareWorkshopWorkspaceRelocation(workspaceDir, moves, env);
	let movedSkills = 0;
	for (const move of plan.moves) {
		if ([move.source, move.destination].some((filePath) => isUpdateRehearsalReadOnlyPath(filePath, env)) || move.updates.some(({ record }) => isReadOnlyRehearsalProposal(record, env))) continue;
		if (move.operation === "move") {
			await fs.mkdir(path.dirname(move.destination), { recursive: true });
			await movePathWithCopyFallback({
				from: move.source,
				to: move.destination
			});
			movedSkills += 1;
		} else if (move.operation === "remove-source") await fs.rm(move.source, {
			recursive: true,
			force: false
		});
		persistUpdates(move.updates);
	}
	persistUpdates(plan.updates);
	await finishWorkshopWorkspaceRelocations(env);
	const backupMigration = await migrateLegacyCollectionBackups(config, env, backupRoots);
	const staleProposals = persistedUpdates.filter((update) => update.record.status === "stale").length;
	return {
		movedSkills,
		retargetedProposals: persistedUpdates.length - staleProposals,
		staleProposals: staleProposals + missingDraftsRetired,
		migratedBackupRoots: backupMigration.migrated,
		warnings: [
			...recoveryWarnings,
			...plan.warnings,
			...backupMigration.warnings
		],
		recoverableWarningCount: recoverableWarningCount + plan.recoverableWarningCount + backupMigration.recoverableWarningCount
	};
}
async function migrateLegacySkillWorkshopProposals(params) {
	const env = params.env ?? process.env;
	const coordinator = acquireStateDatabaseCoordinator({ databasePath: resolveOpenClawStateSqlitePath(env) });
	try {
		const backupRoots = await listPendingLegacyCollectionBackupRoots(params.config, env);
		const sidecars = await importLegacySkillProposalSidecars({
			config: params.config,
			env
		});
		const relocation = await relocateLegacyWorkshopTargets(params.config, env, backupRoots, params.unavailableWorkspaceDirs);
		if (relocation.movedSkills > 0 || relocation.retargetedProposals > 0 || relocation.staleProposals > 0 || relocation.migratedBackupRoots > 0) sidecars.changes.push(`Relocated ${relocation.movedSkills} Skill Workshop skill${relocation.movedSkills === 1 ? "" : "s"}, retargeted ${relocation.retargetedProposals} proposal${relocation.retargetedProposals === 1 ? "" : "s"}, marked ${relocation.staleProposals} stale, and migrated ${relocation.migratedBackupRoots} legacy collection backup root${relocation.migratedBackupRoots === 1 ? "" : "s"}.`);
		const warnings = [...sidecars.warnings, ...relocation.warnings];
		const recoverableWarningCount = (sidecars.warningDisposition === "recoverable" ? sidecars.warnings.length : 0) + relocation.recoverableWarningCount;
		return {
			changes: sidecars.changes,
			detected: sidecars.detected,
			migrated: sidecars.migrated,
			warnings,
			...warnings.length > 0 && warnings.length === recoverableWarningCount ? { warningDisposition: "recoverable" } : {}
		};
	} finally {
		coordinator.release();
	}
}
//#endregion
export { inspectLegacySkillWorkshopMigration, migrateLegacySkillWorkshopProposals };
