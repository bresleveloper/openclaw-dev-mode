import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { a as normalizeSkillIndexName } from "./skill-index-Bh90u5mi.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-Bd-leLaO.mjs";
import { I as resolveSkillProposalName, O as dispatchSkillProposalChanged, S as readSkillProposalRollback, _ as withSkillProposalCommitLock, a as readSkillProposal, c as readSkillProposalManifest, l as readSkillProposalRecord, s as readSkillProposalDraft, t as SkillProposalDraftMissingError } from "./store-LdKLy4Ms.mjs";
import { r as assertInsideSkillsRoot, u as readWorkspaceSkillFile } from "./workspace-skill-write-BPRCkWOF.mjs";
import { i as transitionPendingSkillProposalToStale } from "./apply-transition-8OnY2_ai.mjs";
//#region src/skills/workshop/service-query.ts
async function listSkillProposals(options) {
	const manifest = await readSkillProposalManifest(options, options);
	const missingDrafts = /* @__PURE__ */ new Set();
	for (const proposal of manifest.proposals) {
		if (proposal.status !== "pending") continue;
		try {
			const record = await readSkillProposalRecord(proposal.id, options, options, { config: options.config });
			if (record) await reconcilePendingSkillProposal(record, options);
		} catch (error) {
			if (!(error instanceof SkillProposalDraftMissingError)) throw error;
			missingDrafts.add(error.proposalId);
		}
	}
	const reconciled = await readSkillProposalManifest(options, options);
	for (const proposal of reconciled.proposals) if (missingDrafts.has(proposal.id)) proposal.degradedState = "draft-missing";
	return reconciled;
}
async function inspectSkillProposal(proposalId, options) {
	const record = await readSkillProposalRecord(proposalId, options, options, { config: options.config });
	if (!record) return null;
	await reconcilePendingSkillProposal(record, options);
	return await readSkillProposal(proposalId, options, options, { config: options.config });
}
async function resolvePendingSkillProposal(input) {
	let proposalId = normalizeOptionalString(input.proposalId);
	if (!proposalId) {
		const name = normalizeOptionalString(input.name);
		if (!name) throw new Error("proposal_id or name required.");
		const matches = (await listSkillProposals({
			agentId: input.agentId,
			env: input.env,
			config: input.config
		})).proposals.filter((proposal) => proposal.status === "pending" && proposalMatchesName(proposal, name));
		if (matches.length === 0) throw new Error(`No pending skill proposal matched: ${name}`);
		if (matches.length > 1) {
			const candidates = matches.slice(0, 8).map((proposal) => `${proposal.id} (${resolveSkillProposalName(proposal.kind, proposal)})`).join(", ");
			throw new Error(`Multiple pending skill proposals matched ${name}: ${candidates}`);
		}
		proposalId = expectDefined(matches[0], "matches capture group 0").id;
	}
	const matched = await inspectSkillProposal(proposalId, input);
	if (!matched) throw new Error(`Skill proposal not found: ${proposalId}`);
	if (matched.record.status !== "pending") throw new Error(`Only pending proposals can be revised. Current status: ${matched.record.status}.`);
	return matched;
}
async function readRequiredProposal(proposalId, env, agentId, readOptions) {
	const read = await readSkillProposal(proposalId, {
		env,
		agentId,
		config: readOptions.config
	}, { agentId }, readOptions);
	if (!read) throw new Error(`Skill proposal not found: ${proposalId}`);
	return read;
}
async function reconcilePendingSkillProposal(record, options) {
	if (record.status !== "pending") return;
	const workshopDir = resolveWorkshopSkillsDir(options.config, options.agentId, options.env);
	const transition = await withSkillProposalCommitLock(record, async () => {
		const current = await readSkillProposalRecord(record.id, options, options, {
			config: options.config,
			reconcile: false
		});
		if (!current || current.status !== "pending") return;
		await readSkillProposalDraft(current, options);
		if (current.kind !== "create" || !isPathInside(workshopDir, current.target.skillFile) || await readSkillProposalRollback(current.id, options)) return;
		assertInsideSkillsRoot(workshopDir, current.target.skillFile, "skill file");
		if (await readWorkspaceSkillFile(current.target.skillFile) === null) return;
		return transitionPendingSkillProposalToStale({
			record: current,
			reason: "Target skill was created after proposal creation.",
			input: {
				agentId: options.agentId,
				config: options.config,
				eventActor: { type: "system" },
				...options.env ? { env: options.env } : {}
			}
		});
	}, options);
	if (transition) await dispatchSkillProposalChanged({
		event: transition.event,
		record: transition.record,
		workspaceDir: workshopDir,
		agentId: options.agentId
	});
}
function proposalMatchesName(proposal, name) {
	const normalizedName = normalizeSkillIndexName(name);
	return [
		proposal.id,
		proposal.skillName,
		proposal.skillKey,
		proposal.title,
		proposal.description
	].some((candidate) => {
		if (!candidate) return false;
		if (candidate === name || candidate.toLowerCase() === name.toLowerCase()) return true;
		const normalizedCandidate = normalizeSkillIndexName(candidate);
		return Boolean(normalizedName && normalizedCandidate && (normalizedCandidate === normalizedName || normalizedCandidate.includes(normalizedName) || normalizedName.includes(normalizedCandidate)));
	});
}
//#endregion
export { resolvePendingSkillProposal as i, listSkillProposals as n, readRequiredProposal as r, inspectSkillProposal as t };
