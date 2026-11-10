import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import "./errors-DPfGDWk1.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { d as pathExists, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { o as resolveCanonicalWorkspacePath } from "./workspace-state-identity-hZ7UINpz.mjs";
import { r as isUpdateRehearsalReadOnlyPath } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { p as dropRetiredSkillWorkshopProposalTables } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as acquireGatewayLock } from "./gateway-lock-OT1e72lx.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-D4CgBm6V.mjs";
import { r as decodeUtf8Input } from "./utf8-input-n9WHttrc.mjs";
import { a as readWorkspaceSkillFile, i as prepareWorkspaceSkillRestoration, o as readWorkspaceSupportFile, s as restoreWorkspaceSkillMutation } from "./workspace-skill-write-C9CcQa0e.mjs";
import { rmSync } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
//#region src/commands/doctor-skill-workshop-retire-proposals.ts
const LEGACY_PROPOSALS_DIR = path.join("skill-workshop", "proposals");
const LEGACY_PROPOSALS_MANIFEST = path.join("skill-workshop", "proposals.json");
const PROPOSAL_ID_PATTERN = /^[a-z0-9][a-z0-9-]{5,120}$/u;
const DRAFT_FILE_PATTERN = /^(?:generations\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/)?PROPOSAL\.md$/u;
const MAX_EXPORT_FILE_BYTES = 8388608;
const MAX_ROLLBACK_BYTES = 134217728;
const EXPORTED_STATUSES = /* @__PURE__ */ new Set(["pending", "quarantined"]);
/** Reads only the export-relevant fields; malformed records keep their tables for manual review. */
function parseRetiredProposal(id, record, ownerAgentId) {
	if (!isRecord(record)) throw new Error("proposal record is not an object");
	const { draftFile = "PROPOSAL.md", supportFiles = [] } = record;
	if (typeof draftFile !== "string" || !DRAFT_FILE_PATTERN.test(draftFile)) throw new Error("proposal record has an invalid draft path");
	if (!Array.isArray(supportFiles)) throw new Error("proposal record has invalid support files");
	return {
		id,
		ownerAgentId,
		draftFile,
		supportFiles: supportFiles.map((file) => {
			const filePath = isRecord(file) ? file.path : void 0;
			if (typeof filePath !== "string" || path.posix.isAbsolute(filePath) || filePath.split("/").some((segment) => !segment || segment === "." || segment === "..") || filePath === "SKILL.md") throw new Error("proposal record has an invalid support file path");
			return filePath;
		})
	};
}
/**
* Pairs a rollback (SQLite row or legacy `rollback.json`) with the hashes its proposal wrote, so
* recovery only ever replaces bytes that apply itself put there.
*/
function parseUnfinishedApply(proposalId, record, rollback) {
	const target = isRecord(record) && isRecord(record.target) ? record.target : {};
	const skillFile = rollback.targetSkillFile;
	if (typeof skillFile !== "string" || !path.isAbsolute(skillFile) || path.basename(skillFile) !== "SKILL.md" || target.skillFile !== skillFile) throw new Error("rollback does not match its proposal target");
	const proposedHashes = new Map((isRecord(record) && Array.isArray(record.supportFiles) ? record.supportFiles : []).filter(isRecord).map((file) => [file.path, file.hash]));
	const rollbackSupport = rollback.supportFiles ?? [];
	if (!Array.isArray(rollbackSupport)) throw new Error("rollback has invalid support files");
	const supportFiles = rollbackSupport.map((file) => {
		const filePath = isRecord(file) ? file.path : void 0;
		const proposedContentHash = proposedHashes.get(filePath);
		const previousContent = isRecord(file) && file.existed === true ? file.previousContent : null;
		if (typeof filePath !== "string" || typeof proposedContentHash !== "string" || previousContent !== null && typeof previousContent !== "string") throw new Error("rollback has an invalid support file");
		return {
			path: filePath,
			previousContent,
			proposedContentHash
		};
	});
	const previousContent = rollback.previousContent ?? null;
	if (previousContent !== null && typeof previousContent !== "string") throw new Error("rollback has invalid previous content");
	return {
		proposalId,
		skillFile,
		previousContent,
		supportFiles
	};
}
function readDatabaseProposals(config, env) {
	const { db } = openOpenClawStateDatabase({ env });
	const hasTables = [
		"skill_workshop_proposals",
		"skill_workshop_proposal_events",
		"skill_workshop_proposal_rollbacks",
		"skill_workshop_collection_reviews"
	].some((table) => tableExists(db, table));
	const proposals = [];
	const unfinishedApplies = [];
	const recordedIds = /* @__PURE__ */ new Set();
	const failures = [];
	const result = {
		proposals,
		unfinishedApplies,
		recordedIds,
		failures,
		hasTables
	};
	if (!tableExists(db, "skill_workshop_proposals")) return result;
	const rows = db.prepare(`SELECT proposal_id, record_json, owner_agent_id, status FROM skill_workshop_proposals
        ORDER BY proposal_id`).all();
	for (const row of rows) {
		const id = String(row.proposal_id);
		recordedIds.add(id);
		if (!EXPORTED_STATUSES.has(String(row.status))) continue;
		try {
			const record = JSON.parse(String(row.record_json));
			const rowOwner = typeof row.owner_agent_id === "string" ? normalizeAgentId(row.owner_agent_id) : void 0;
			const ownerAgentId = rowOwner !== void 0 ? listAgentIds(config).includes(rowOwner) ? rowOwner : void 0 : isRecord(record) ? inferOwnerAgentId(record, config, env) : void 0;
			proposals.push(parseRetiredProposal(id, record, ownerAgentId));
		} catch (error) {
			failures.push(`Could not read Skill Workshop proposal ${id}: ${String(error)}`);
		}
	}
	const rollbackRows = tableExists(db, "skill_workshop_proposal_rollbacks") ? db.prepare(`SELECT r.proposal_id, r.target_skill_file, r.previous_content, r.support_files_json,
                  p.record_json
             FROM skill_workshop_proposal_rollbacks r
             JOIN skill_workshop_proposals p USING (proposal_id)
            WHERE p.status != 'applied'
            ORDER BY r.proposal_id`).all() : [];
	for (const row of rollbackRows) {
		const id = String(row.proposal_id);
		try {
			unfinishedApplies.push(parseUnfinishedApply(id, JSON.parse(String(row.record_json)), {
				targetSkillFile: row.target_skill_file,
				previousContent: row.previous_content,
				supportFiles: typeof row.support_files_json === "string" ? JSON.parse(row.support_files_json) : []
			}));
		} catch (error) {
			failures.push(`Could not read the unfinished apply of Skill Workshop proposal ${id}: ${String(error)}`);
		}
	}
	return result;
}
/**
* Records without an owner (legacy sidecars, NULL owner rows) use the recorded origin agent, else
* the one agent whose workspace or Workshop holds the target skill, else the sole configured
* agent. A recorded owner that is no longer configured is never reassigned; that proposal stays
* for manual recovery.
*/
function inferOwnerAgentId(record, config, env) {
	const agentIds = listAgentIds(config);
	const soleAgentId = agentIds.length === 1 ? agentIds[0] : void 0;
	const origin = isRecord(record.origin) ? record.origin : {};
	const recordedOwner = typeof origin.agentId === "string" && origin.agentId.trim() || (typeof origin.sessionKey === "string" ? parseAgentSessionKey(origin.sessionKey)?.agentId : void 0);
	if (recordedOwner) {
		const ownerAgentId = normalizeAgentId(recordedOwner);
		return agentIds.includes(ownerAgentId) ? ownerAgentId : void 0;
	}
	const target = isRecord(record.target) ? record.target : {};
	if (typeof target.skillDir !== "string") return soleAgentId;
	const skillDir = resolveCanonicalWorkspacePath(path.resolve(target.skillDir));
	const claims = agentIds.flatMap((agentId) => {
		const workspaceDir = resolveCanonicalWorkspacePath(resolveAgentWorkspaceDir(config, agentId, env));
		return [
			path.join(workspaceDir, "skills"),
			path.join(workspaceDir, ".agents", "skills"),
			resolveCanonicalWorkspacePath(resolveWorkshopSkillsDir(config, agentId, env))
		].filter((skillsRoot) => isPathInside(skillsRoot, skillDir)).map((skillsRoot) => ({
			agentId,
			skillsRoot
		}));
	});
	const innermost = Math.max(...claims.map(({ skillsRoot }) => skillsRoot.length));
	const owners = new Set(claims.filter(({ skillsRoot }) => skillsRoot.length === innermost).map(({ agentId }) => agentId));
	return owners.size === 1 ? [...owners][0] : owners.size === 0 ? soleAgentId : void 0;
}
/** Pre-SQLite bundles keep their record in `proposal.json`; SQLite-backed bundles have none. */
async function appendLegacyJsonProposals(params) {
	const { proposals, unfinishedApplies, failures, recordedIds } = params.inventory;
	const stateRoot = await root(params.stateDir);
	const readOptions = {
		hardlinks: "reject",
		symlinks: "reject"
	};
	for (const entry of await stateRoot.list(LEGACY_PROPOSALS_DIR, { withFileTypes: true })) {
		if (!entry.isDirectory || !PROPOSAL_ID_PATTERN.test(entry.name) || recordedIds.has(entry.name)) continue;
		const bundleDir = path.join(params.stateDir, LEGACY_PROPOSALS_DIR, entry.name);
		try {
			const read = await stateRoot.read(`${LEGACY_PROPOSALS_DIR}/${entry.name}/proposal.json`, {
				...readOptions,
				maxBytes: MAX_EXPORT_FILE_BYTES
			});
			const record = JSON.parse(decodeUtf8Input(read.buffer, `Skill Workshop proposal ${entry.name}`));
			if (!isRecord(record) || typeof record.status !== "string") throw new Error("proposal record has no status");
			if (record.status !== "applied") {
				const rollback = await stateRoot.read(`${LEGACY_PROPOSALS_DIR}/${entry.name}/rollback.json`, {
					...readOptions,
					maxBytes: MAX_ROLLBACK_BYTES
				}).catch((error) => {
					if (isMissingPathError(error)) return;
					throw error;
				});
				if (rollback) {
					const facts = JSON.parse(decodeUtf8Input(rollback.buffer, `Skill Workshop rollback ${entry.name}`));
					if (!isRecord(facts)) throw new Error("rollback is not an object");
					unfinishedApplies.push(parseUnfinishedApply(entry.name, record, facts));
				}
			}
			if (!EXPORTED_STATUSES.has(record.status)) continue;
			proposals.push(parseRetiredProposal(entry.name, record, inferOwnerAgentId(record, params.config, params.env)));
		} catch (error) {
			failures.push(isMissingPathError(error) ? `Skill Workshop proposal ${entry.name} has no record; kept ${bundleDir}. Copy anything worth keeping, delete that directory, then rerun openclaw doctor --fix.` : `Could not read Skill Workshop proposal ${entry.name}: ${String(error)}`);
		}
	}
}
/**
* Apply wrote support files first and SKILL.md last; its compensation restored support files
* first and SKILL.md last. SKILL.md at its pre-apply content means the apply never activated,
* so every support file it provably wrote is put back. SKILL.md past it with every support file
* at its proposed bytes means only the status commit was lost. Anything else stopped mid-way
* and keeps its rollback for the operator.
*/
async function undoUnfinishedApply(apply) {
	const skillDir = path.dirname(apply.skillFile);
	const support = await Promise.all(apply.supportFiles.map(async (file) => ({
		...file,
		current: await readWorkspaceSupportFile({
			skillDir,
			relativePath: file.path
		})
	})));
	if (await readWorkspaceSkillFile(apply.skillFile) !== apply.previousContent) {
		if (support.every(({ current, proposedContentHash }) => current !== null && sha256Hex(current) === proposedContentHash)) return false;
		throw new Error("SKILL.md is past its pre-apply content but its support files are not");
	}
	if (support.every(({ current, previousContent }) => current === previousContent)) return false;
	const restoration = await prepareWorkspaceSkillRestoration({
		skillsRoot: path.dirname(skillDir),
		skillDir,
		skillFile: apply.skillFile,
		previousContent: apply.previousContent,
		proposedContentHash: "",
		supportFiles: apply.supportFiles,
		mode: "update"
	});
	await restoreWorkspaceSkillMutation(restoration);
	if (apply.previousContent === null) {
		if ((await fs$1.readdir(skillDir, {
			recursive: true,
			withFileTypes: true
		})).every((entry) => entry.isDirectory())) await fs$1.rm(skillDir, { recursive: true });
	}
	return true;
}
/** Copies one draft bundle; an existing export is never overwritten. */
async function exportProposal(proposal, stateDir, exportRoot) {
	const destination = path.join(exportRoot, proposal.id);
	if (await pathExists(destination)) return "existing";
	const bundleDir = path.join(stateDir, LEGACY_PROPOSALS_DIR, proposal.id, path.posix.dirname(proposal.draftFile));
	const readOptions = {
		hardlinks: "reject",
		maxBytes: MAX_EXPORT_FILE_BYTES,
		symlinks: "reject"
	};
	let files;
	try {
		const bundle = await root(bundleDir);
		files = [["SKILL.md", (await bundle.read("PROPOSAL.md", readOptions)).buffer]];
		for (const supportFile of proposal.supportFiles) files.push([supportFile, (await bundle.read(supportFile, readOptions)).buffer]);
	} catch (error) {
		if (isMissingPathError(error) && !await pathExists(path.join(bundleDir, "PROPOSAL.md"))) return "missing-draft";
		throw error;
	}
	const staging = path.join(exportRoot, `.${proposal.id}.partial`);
	await fs$1.rm(staging, {
		recursive: true,
		force: true
	});
	for (const [relativePath, content] of files) {
		const target = path.join(staging, ...relativePath.split("/"));
		await fs$1.mkdir(path.dirname(target), { recursive: true });
		await fs$1.writeFile(target, content, { flag: "wx" });
	}
	await fs$1.rename(staging, destination);
	return "exported";
}
async function retireProposals(params) {
	const { config, env, assertCurrent } = params;
	const stateDir = resolveStateDir(env);
	const legacyDirExists = await pathExists(path.join(stateDir, LEGACY_PROPOSALS_DIR));
	const inventory = readDatabaseProposals(config, env);
	if (!inventory.hasTables && !legacyDirExists) return {
		changes: [],
		warnings: []
	};
	if (legacyDirExists) await appendLegacyJsonProposals({
		stateDir,
		inventory,
		config,
		env
	});
	const warnings = inventory.failures;
	let blocked = warnings.length > 0;
	const changes = [];
	const migrationResult = () => ({
		changes,
		warnings,
		...warnings.length > 0 ? { warningDisposition: "recoverable" } : {}
	});
	for (const apply of inventory.unfinishedApplies) {
		assertCurrent();
		const skillDir = path.dirname(apply.skillFile);
		if (isUpdateRehearsalReadOnlyPath(skillDir, env)) {
			blocked = true;
			continue;
		}
		try {
			if (await undoUnfinishedApply(apply)) changes.push(`Restored ${skillDir} from the unfinished apply of Skill Workshop proposal ${apply.proposalId}.`);
		} catch (error) {
			blocked = true;
			const causes = error instanceof AggregateError ? error.errors : [error];
			warnings.push(`Could not undo the unfinished apply of Skill Workshop proposal ${apply.proposalId} in ${skillDir}: ${causes.map(String).join("; ")}. Its proposal tables and files are kept with the recorded pre-apply contents; restore those files by hand, then rerun openclaw doctor --fix.`);
		}
	}
	const exportedIds = /* @__PURE__ */ new Set();
	const exportedByRoot = /* @__PURE__ */ new Map();
	for (const proposal of inventory.proposals) {
		assertCurrent();
		const proposalDir = path.join(stateDir, LEGACY_PROPOSALS_DIR, proposal.id);
		if (!await pathExists(proposalDir)) {
			warnings.push(`Skill Workshop proposal ${proposal.id} has no draft left to export; retired its record.`);
			exportedIds.add(proposal.id);
			continue;
		}
		if (!proposal.ownerAgentId) {
			blocked = true;
			warnings.push(`No configured agent owns Skill Workshop proposal ${proposal.id}; kept ${proposalDir}. To keep it, add its agent back to your config and rerun openclaw doctor --fix, or have an agent save that whole directory (draft and support files) with /learn and then delete the directory; otherwise delete the directory and rerun openclaw doctor --fix.`);
			continue;
		}
		const exportRoot = path.join(resolveWorkshopSkillsDir(config, proposal.ownerAgentId, env), ".archive", ".retired-proposals");
		if (isUpdateRehearsalReadOnlyPath(exportRoot, env)) {
			blocked = true;
			continue;
		}
		try {
			await fs$1.mkdir(exportRoot, { recursive: true });
			const outcome = await exportProposal(proposal, stateDir, exportRoot);
			if (outcome === "missing-draft") {
				blocked = true;
				warnings.push(`Skill Workshop proposal ${proposal.id} has no draft; kept ${proposalDir}. Copy anything worth keeping, delete that directory, then rerun openclaw doctor --fix.`);
				continue;
			}
			if (outcome === "exported") exportedByRoot.set(exportRoot, (exportedByRoot.get(exportRoot) ?? 0) + 1);
			exportedIds.add(proposal.id);
		} catch (error) {
			blocked = true;
			warnings.push(`Could not export Skill Workshop proposal ${proposal.id} to ${exportRoot}: ${String(error)}. Its proposal tables and files are kept; rerun openclaw doctor --fix after fixing the cause.`);
		}
	}
	for (const [exportRoot, count] of exportedByRoot) changes.push(`Exported ${count} pending Skill Workshop proposal draft${count === 1 ? "" : "s"} to ${exportRoot}${path.sep}.`);
	if (blocked) return migrationResult();
	assertCurrent();
	const dropped = runOpenClawStateWriteTransaction(({ db }) => {
		if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
		assertCurrent();
		if ((tableExists(db, "skill_workshop_proposals") ? db.prepare("SELECT proposal_id FROM skill_workshop_proposals WHERE status IN ('pending', 'quarantined')").all() : []).some((row) => !exportedIds.has(String(row.proposal_id)))) return;
		if (legacyDirExists) {
			rmSync(path.join(stateDir, LEGACY_PROPOSALS_DIR), {
				recursive: true,
				force: true
			});
			rmSync(path.join(stateDir, LEGACY_PROPOSALS_MANIFEST), { force: true });
		}
		return dropRetiredSkillWorkshopProposalTables(db);
	}, { env }, { operationLabel: "doctor.skill-workshop.retire-proposals" });
	if (dropped === void 0) {
		warnings.push("Skill Workshop proposals changed during export; rerun openclaw doctor --fix to finish retiring the proposal tables.");
		return migrationResult();
	}
	if (dropped) changes.push("Retired the Skill Workshop proposal tables.");
	if (legacyDirExists) changes.push(`Removed retired Skill Workshop proposal files from ${path.join(stateDir, LEGACY_PROPOSALS_DIR)}.`);
	return migrationResult();
}
/**
* Exports pending and quarantined Skill Workshop proposal drafts into each owning agent's
* Workshop archive, then drops the retired proposal tables and legacy proposal files.
*/
async function retireSkillWorkshopProposals(params) {
	const env = params.env ?? process.env;
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (maintenance?.ownsSchemaMaintenance) return await maintenance.run(() => retireProposals({
		config: params.config,
		env,
		assertCurrent: () => maintenance.assertOwnerCurrent()
	}));
	const owner = await acquireGatewayLock({
		env,
		role: "sqlite-maintenance",
		allowInTests: true
	});
	if (!owner) throw new Error("Skill Workshop proposal retirement requires exclusive state ownership");
	try {
		return await owner.run(() => retireProposals({
			config: params.config,
			env,
			assertCurrent: () => owner.assertCurrent()
		}));
	} finally {
		await owner.release();
	}
}
//#endregion
export { retireSkillWorkshopProposals };
