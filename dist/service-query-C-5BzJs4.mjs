import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { C as createSkillProposalEvent, a as readSkillProposal, c as readSkillProposalManifest, g as withSkillProposalCommitLock, j as resolveSkillProposalName, l as readSkillProposalRecord, s as readSkillProposalDraft, t as SkillProposalDraftMissingError, w as dispatchSkillProposalChanged, x as commitPendingSkillProposalTransition, y as readSkillProposalRollback } from "./store-AlmU8nKC.mjs";
import { r as assertInsideSkillsRoot, u as readWorkspaceSkillFile } from "./workspace-skill-write-Ch4M1BlA.mjs";
import { r as normalizeSkillIndexName } from "./skill-index-fJ6kPuHX.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-5Lc00M9N.mjs";
import { t as captureSkillWorkshopStoreOptions } from "./store-client-BMKnc-Bx.mjs";
//#region src/skills/workshop/service-query.ts
async function transitionPendingSkillProposalToStale(params) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const stale = {
		...params.record,
		status: "stale",
		updatedAt: now,
		staleAt: now,
		statusReason: params.reason
	};
	const commit = await commitPendingSkillProposalTransition({
		expected: params.record,
		record: stale,
		event: createSkillProposalEvent({
			record: stale,
			type: "stale",
			actor: params.input.eventActor,
			...params.input.correlationId ? { correlationId: params.input.correlationId } : {},
			occurredAt: now
		}),
		store: params.store ?? {
			...params.input.env ? { env: params.input.env } : {},
			...params.input.agentId ? { agentId: params.input.agentId } : {},
			config: params.input.config
		},
		operationLabel: "skill-workshop.stale.commit"
	});
	if (commit.state !== "committed") throw new Error("Failed to record stale Skill Workshop proposal.");
	return {
		record: stale,
		event: commit.event
	};
}
async function listSkillProposals(options) {
	const store = captureSkillWorkshopStoreOptions(options);
	const manifest = await readSkillProposalManifest(store, {
		agentId: store.agentId,
		status: "pending"
	});
	const missingDrafts = /* @__PURE__ */ new Set();
	for (const proposal of manifest.proposals) {
		if (proposal.status !== "pending") continue;
		try {
			const record = await readSkillProposalRecord(proposal.id, store, store, { config: store.config });
			if (record) await reconcilePendingSkillProposal(record, store);
		} catch (error) {
			if (!(error instanceof SkillProposalDraftMissingError)) throw error;
			missingDrafts.add(error.proposalId);
		}
	}
	const reconciled = await readSkillProposalManifest(store, { agentId: store.agentId });
	for (const proposal of reconciled.proposals) if (missingDrafts.has(proposal.id)) proposal.degradedState = "draft-missing";
	return reconciled;
}
async function inspectSkillProposal(proposalId, options) {
	const store = captureSkillWorkshopStoreOptions(options);
	const record = await readSkillProposalRecord(proposalId, store, store, { config: store.config });
	if (!record) return null;
	await reconcilePendingSkillProposal(record, store);
	return await readSkillProposal(proposalId, store, store, { config: store.config });
}
async function resolvePendingSkillProposal(input) {
	const store = captureSkillWorkshopStoreOptions(input);
	let proposalId = normalizeOptionalString(input.proposalId);
	if (!proposalId) {
		const name = normalizeOptionalString(input.name);
		if (!name) throw new Error("proposal_id or name required.");
		const matches = (await listSkillProposals(store)).proposals.filter((proposal) => proposal.status === "pending" && proposalMatchesName(proposal, name));
		if (matches.length === 0) throw new Error(`No pending skill proposal matched: ${name}`);
		if (matches.length > 1) {
			const candidates = matches.slice(0, 8).map((proposal) => `${proposal.id} (${resolveSkillProposalName(proposal.kind, proposal)})`).join(", ");
			throw new Error(`Multiple pending skill proposals matched ${name}: ${candidates}`);
		}
		proposalId = expectDefined(matches[0], "matches capture group 0").id;
	}
	const matched = await inspectSkillProposal(proposalId, store);
	if (!matched) throw new Error(`Skill proposal not found: ${proposalId}`);
	if (matched.record.status !== "pending") throw new Error(`Only pending proposals can be revised. Current status: ${matched.record.status}.`);
	return matched;
}
async function readRequiredProposal(proposalId, store, options = {}) {
	const read = await readSkillProposal(proposalId, store, { agentId: store.agentId }, {
		config: store.config,
		...options
	});
	if (!read) throw new Error(`Skill proposal not found: ${proposalId}`);
	return read;
}
async function reconcilePendingSkillProposal(record, options) {
	if (record.status !== "pending") return;
	const workshopDir = resolveWorkshopSkillsDir(options.config, options.agentId, options.env);
	const transition = await withSkillProposalCommitLock(record, async (store) => {
		const current = await readSkillProposalRecord(record.id, {
			...store,
			config: options.config
		}, options, {
			config: options.config,
			reconcile: false
		});
		if (!current || current.status !== "pending") return;
		await readSkillProposalDraft(current, store);
		if (current.kind !== "create" || !isPathInside(workshopDir, current.target.skillFile) || await readSkillProposalRollback(current.id, store)) return;
		assertInsideSkillsRoot(workshopDir, current.target.skillFile, "skill file");
		if (await readWorkspaceSkillFile(current.target.skillFile) === null) return;
		return transitionPendingSkillProposalToStale({
			record: current,
			store,
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
export { transitionPendingSkillProposalToStale as a, resolvePendingSkillProposal as i, listSkillProposals as n, readRequiredProposal as r, inspectSkillProposal as t };
