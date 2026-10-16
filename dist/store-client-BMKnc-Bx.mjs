import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { f as syncDirectoryIfSupported } from "./directory-durability-CqSvP1tc.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { r as removePathWithinRoot } from "./fs-safe-remove-DuP7yp5L.mjs";
import { r as runWithOpenClawStateLeasesWorker } from "./openclaw-state-lease-worker-operation-zXIF5JPg.mjs";
import { n as PROPOSAL_DRAFT_FILE, r as assertProposalId } from "./store-record-CSGbu9Vk.mjs";
import { t as databaseOptions } from "./store-sqlite-schema-_R6vVtKb.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/skills/workshop/proposal-generation.ts
const PROPOSALS_REL_DIR = path.join("skill-workshop", "proposals");
const PROPOSAL_GENERATIONS_REL_DIR = "generations";
const GENERATION_DRAFT_PATTERN = /^generations\/([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\/PROPOSAL\.md$/u;
function resolveSkillWorkshopStateDir(options = {}) {
	return path.resolve(options.stateDir ?? resolveStateDir(options.env));
}
function proposalRelativeDir(proposalId) {
	assertProposalId(proposalId);
	return path.join(PROPOSALS_REL_DIR, proposalId);
}
function createSkillProposalGenerationDraftFile() {
	return `${PROPOSAL_GENERATIONS_REL_DIR}/${randomUUID()}/${PROPOSAL_DRAFT_FILE}`;
}
function proposalBundleRelativePath(record, relativePath) {
	return path.join(proposalRelativeDir(record.id), path.dirname(record.draftFile), relativePath);
}
async function stageSkillProposalGeneration(params) {
	const generationId = proposalGenerationId(params.record.draftFile);
	if (!generationId) throw new Error("Revised Skill Workshop proposals require a generation draft path.");
	const stateDir = resolveSkillWorkshopStateDir(params.store);
	const stateRoot = await root(stateDir, { assertBeforeMutation: params.assertCommitAllowed });
	const proposalDir = proposalRelativeDir(params.record.id);
	const stagingDir = path.join(proposalDir, PROPOSAL_GENERATIONS_REL_DIR, `.staging-${generationId}`);
	const generationsDir = path.join(proposalDir, PROPOSAL_GENERATIONS_REL_DIR);
	const generationDir = path.join(generationsDir, generationId);
	try {
		await stateRoot.mkdir(stagingDir);
		await stateRoot.create(path.join(stagingDir, PROPOSAL_DRAFT_FILE), params.content, { durable: "file" });
		for (const file of params.supportFiles ?? []) await stateRoot.create(path.join(stagingDir, file.path), file.content, { durable: "file" });
		await stateRoot.move(stagingDir, generationDir, { overwrite: true });
		await syncDirectoryIfSupported(path.join(stateDir, generationsDir));
	} catch (error) {
		await removeGenerationPath(stateDir, stagingDir).catch(() => void 0);
		await removeGenerationPath(stateDir, generationDir).catch(() => void 0);
		throw error;
	}
}
async function discardSkillProposalGeneration(record, store) {
	const generationId = proposalGenerationId(record.draftFile);
	if (!generationId) return;
	await removeGenerationPath(resolveSkillWorkshopStateDir(store), path.join(proposalRelativeDir(record.id), PROPOSAL_GENERATIONS_REL_DIR, generationId));
}
/** Removes generations left unowned by a pre-commit crash. Caller holds the target lease. */
async function cleanupSkillProposalGenerations(record, store) {
	const stateDir = resolveSkillWorkshopStateDir(store);
	const stateRoot = await root(stateDir);
	const proposalDir = proposalRelativeDir(record.id);
	const generationsDir = path.join(proposalDir, PROPOSAL_GENERATIONS_REL_DIR);
	let entries;
	try {
		entries = await stateRoot.list(generationsDir);
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "not-found") return;
		throw error;
	}
	const activeGenerationId = proposalGenerationId(record.draftFile);
	for (const entry of entries) {
		if (entry === activeGenerationId) continue;
		await removeGenerationPath(stateDir, path.join(generationsDir, entry));
	}
	if (!activeGenerationId) return;
	await retireLegacyProposalBundle(record, store);
}
function proposalGenerationId(draftFile) {
	return GENERATION_DRAFT_PATTERN.exec(draftFile)?.[1] ?? null;
}
async function retireLegacyProposalBundle(record, store) {
	const stateDir = resolveSkillWorkshopStateDir(store);
	const stateRoot = await root(stateDir);
	const proposalDir = proposalRelativeDir(record.id);
	let entries;
	try {
		entries = await stateRoot.list(proposalDir);
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "not-found") return;
		throw error;
	}
	for (const entry of entries) if (entry !== PROPOSAL_GENERATIONS_REL_DIR) await removeGenerationPath(stateDir, path.join(proposalDir, entry));
}
async function removeGenerationPath(stateDir, relativePath) {
	await removePathWithinRoot({
		rootDir: stateDir,
		relativePath,
		recursive: true
	});
}
//#endregion
//#region src/skills/workshop/store-client.ts
function captureSkillWorkshopStoreOptions(options) {
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	const stateDir = resolveSkillWorkshopStateDir({
		...options,
		env
	});
	const execution = options.execution ?? {
		context: captureOpenClawStateWorkerContext(databaseOptions({
			env,
			stateDir
		})),
		leases: []
	};
	return {
		...options,
		stateDir,
		env,
		execution
	};
}
function executeSkillWorkshopOperation(type, value, options = {}, assertCommitAllowed) {
	const captured = structuredClone(value);
	const store = captureSkillWorkshopStoreOptions(options);
	const { context, leases } = store.execution;
	const execute = async (scope, leaseIdentities) => {
		if (type !== "workshop.schema.ensure" && type !== "workshop.experience.record") await scope.execute({
			type: "workshop.schema.ensure",
			input: {
				value: void 0,
				agentId: store.agentId,
				leaseIdentities
			}
		});
		return scope.execute({
			type,
			input: {
				value: captured,
				agentId: store.agentId,
				leaseIdentities
			}
		});
	};
	if (leases.length > 0) return runWithOpenClawStateLeasesWorker(leases, context, execute, assertCommitAllowed ? { assertCurrent: assertCommitAllowed } : void 0);
	const assertCurrent = () => {
		assertCommitAllowed?.();
		context.admission.assertCurrent();
		context.maintenanceScope?.assertAdmission();
	};
	return runOpenClawStateWorkerOperation(context, execute, {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
function ensureSkillWorkshopStore(options = {}) {
	return executeSkillWorkshopOperation("workshop.schema.ensure", void 0, options);
}
function readStoredProposal(proposalId, options = {}) {
	return executeSkillWorkshopOperation("workshop.proposal.read", proposalId, options);
}
//#endregion
export { cleanupSkillProposalGenerations as a, proposalBundleRelativePath as c, readStoredProposal as i, resolveSkillWorkshopStateDir as l, ensureSkillWorkshopStore as n, createSkillProposalGenerationDraftFile as o, executeSkillWorkshopOperation as r, discardSkillProposalGeneration as s, captureSkillWorkshopStoreOptions as t, stageSkillProposalGeneration as u };
