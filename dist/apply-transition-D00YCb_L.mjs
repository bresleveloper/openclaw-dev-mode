import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-Bd-leLaO.mjs";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-NJJr9z6k.mjs";
import { C as writeSkillProposalRollback, D as createSkillProposalEvent, E as readSkillProposalTargetTreeSha256, L as stripProposalFrontmatterForSkill, M as hashSkillProposalRevision, N as readProposalFrontmatter, O as dispatchSkillProposalChanged, _ as withSkillProposalCommitLock, b as readCommittedSkillProposalTransition, v as withSkillProposalTargetLock, w as hashSkillProposalContent, x as clearSkillProposalRollback, y as commitPendingSkillProposalTransition } from "./store-BH7wGiUH.mjs";
import { a as isWorkspaceSkillMutationApplied, c as prepareWorkspaceSkillMutation, f as restoreWorkspaceSkillMutation, n as applyWorkspaceSkillMutation, o as isWorkspaceSkillMutationRestored, r as assertInsideSkillsRoot, u as readWorkspaceSkillFile } from "./workspace-skill-write-BPRCkWOF.mjs";
import { i as snapshotCommittedSkillArtifactBestEffort, n as hasCommittedSkillChangeHooks, t as dispatchCommittedSkillChangeBestEffort } from "./skill-change-hook-B1sraZ1j.mjs";
import { n as scanProposalBundle } from "./proposal-scan-BQNS8RJy.mjs";
import { g as SKILL_WORKSHOP_ROLLBACK_SCHEMA, i as readStoredProposal } from "./store-sqlite-record-B7LlWdpb.mjs";
//#region src/skills/workshop/apply-transition.ts
const SKILL_PROPOSAL_APPLY_TRANSITIONS = {
	pending: {
		apply_failed: "pending",
		apply_succeeded: "applied",
		scan_failed: "quarantined",
		target_changed: "stale"
	},
	applied: {},
	rejected: {},
	quarantined: {},
	stale: {}
};
var SkillProposalLifecycleError = class extends Error {
	constructor(message, record, event) {
		super(message);
		this.record = record;
		this.event = event;
	}
};
function resolveSkillProposalApplyTransition(status, outcome) {
	return SKILL_PROPOSAL_APPLY_TRANSITIONS[status][outcome] ?? null;
}
async function applySkillProposalTransition(input, dependencies) {
	const recoveryReadOptions = { config: input.config };
	const lockedReadOptions = {
		config: input.config,
		reconcile: false
	};
	const initial = await dependencies.readRequiredProposal(input.proposalId, input.env, input.agentId, recoveryReadOptions);
	if (initial.record.status !== "pending") throw new Error(`Only pending proposals can be applied. Current status: ${initial.record.status}.`);
	dependencies.assertExpectedRevisionHash(initial.revisionHash, input.expectedRevisionHash);
	let evaluated;
	try {
		evaluated = await dependencies.evaluateSkillProposal({
			workspaceDir: input.workspaceDir,
			...input.agentId ? { agentId: input.agentId } : {},
			config: input.config,
			...input.eventActor ? { eventActor: input.eventActor } : {},
			...input.env ? { env: input.env } : {},
			proposalId: input.proposalId,
			expectedRevisionHash: initial.revisionHash,
			...input.correlationId ? { correlationId: input.correlationId } : {},
			trigger: "apply"
		});
	} catch (error) {
		if (dependencies.isCreateTargetConflict(error)) await withSkillProposalLifecycleDispatch(input, withSkillProposalTargetLock(initial.record, async () => {
			const current = await dependencies.readRequiredProposal(input.proposalId, input.env, input.agentId, lockedReadOptions);
			if (current.record.status === "pending" && current.record.kind === "create" && await readWorkspaceSkillFile(current.record.target.skillFile) !== null) await markSkillProposalStale({
				record: current.record,
				reason: "Target skill was created after proposal creation.",
				message: "Target skill was created after proposal creation; proposal marked stale.",
				input
			});
			throw error;
		}, storeOptions(input.env, input.agentId, input.config)));
		throw error;
	}
	const blocking = evaluated.evaluation.outcomes.find((outcome) => outcome.status === "completed" && outcome.result.decision === "block");
	if (blocking?.status === "completed") throw new Error(blocking.result.decisionReason || `Skill proposal apply blocked by evaluator ${blocking.evaluatorId}.`);
	const result = await withSkillProposalLifecycleDispatch(input, withSkillProposalCommitLock(evaluated.record, async () => {
		const read = await dependencies.readRequiredProposal(input.proposalId, input.env, input.agentId, lockedReadOptions);
		const { record, content } = read;
		if (record.status !== "pending") throw new Error(`Only pending proposals can be applied. Current status: ${record.status}.`);
		dependencies.assertExpectedRevisionHash(read.revisionHash, evaluated.evaluation.revisionHash);
		if (hashSkillProposalContent(content) !== record.draftHash) throw new Error("Proposal draft changed without updating proposal metadata.");
		const supportFiles = read.supportFiles ?? [];
		if (!readProposalFrontmatter(content)) throw new Error("Proposal draft must include proposal frontmatter.");
		const scan = scanProposalBundle(content, supportFiles);
		if (scan.state !== "clean") await quarantineSkillProposalAfterScan({
			input,
			record,
			scan
		});
		if (!input.agentId) throw new Error("Skill Workshop requires the active agent id.");
		const skillsRoot = resolveWorkshopSkillsDir(input.config, input.agentId, input.env);
		assertInsideSkillsRoot(skillsRoot, record.target.skillFile, "skill file");
		assertInsideSkillsRoot(skillsRoot, record.target.skillDir, "skill directory");
		if (record.evaluation?.id !== evaluated.evaluation.id) throw new Error("Skill proposal evaluation changed before apply; retry the operation.");
		if (evaluated.evaluation.targetTreeSha256) {
			let currentTargetTreeSha256;
			try {
				currentTargetTreeSha256 = await readSkillProposalTargetTreeSha256(record.target.skillDir);
			} catch {
				throw new Error("Skill target changed after evaluation; retry the operation.");
			}
			if (currentTargetTreeSha256 !== evaluated.evaluation.targetTreeSha256) throw new Error("Skill target changed after evaluation; retry the operation.");
		}
		const mutation = await prepareWorkspaceSkillMutation({
			skillsRoot,
			skillDir: record.target.skillDir,
			skillFile: record.target.skillFile,
			content: stripProposalFrontmatterForSkill(content),
			supportFiles,
			mode: record.kind
		});
		await assertApplyTargetUnchanged(record, mutation, input);
		const shouldDispatchSkillChange = hasCommittedSkillChangeHooks();
		const beforeSkill = shouldDispatchSkillChange && record.kind === "update" ? await snapshotCommittedSkillArtifactBestEffort({
			skillDir: record.target.skillDir,
			skillKey: record.target.skillKey,
			source: "workshop"
		}) : void 0;
		const rollback = createSkillProposalRollbackFromMutation(record, mutation);
		await writeSkillProposalRollback({
			proposalId: record.id,
			rollback,
			store: storeOptions(input.env, input.agentId, input.config)
		});
		try {
			await applyWorkspaceSkillMutation(mutation);
		} catch (error) {
			if (await isWorkspaceSkillMutationRestored(mutation).catch(() => false)) await clearSkillProposalRollback({
				proposalId: record.id,
				expectedRecordJson: JSON.stringify(record),
				store: storeOptions(input.env, input.agentId, input.config)
			}).catch(() => false);
			throw error;
		}
		const afterSkill = shouldDispatchSkillChange ? await snapshotCommittedSkillArtifactBestEffort({
			skillDir: record.target.skillDir,
			skillKey: record.target.skillKey,
			source: "workshop",
			sourceVersion: record.proposedVersion
		}) : void 0;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const applied = {
			...record,
			status: requiredApplyStatus("apply_succeeded"),
			updatedAt: now,
			appliedAt: now,
			statusReason: normalizeOptionalString(input.reason),
			scan
		};
		const eventInput = createSkillProposalEvent({
			record: applied,
			type: "applied",
			actor: input.eventActor,
			...input.correlationId ? { correlationId: input.correlationId } : {},
			occurredAt: now,
			payload: { targetSkillFile: record.target.skillFile }
		});
		let commit;
		try {
			commit = commitPendingSkillProposalTransition({
				expected: record,
				record: applied,
				event: eventInput,
				store: storeOptions(input.env, input.agentId, input.config),
				operationLabel: "skill-workshop.apply.commit"
			});
		} catch (error) {
			const recoveredEvent = await recoverAfterApplyCommitFailure({
				error,
				expected: record,
				applied,
				event: eventInput,
				mutation,
				env: input.env,
				agentId: input.agentId,
				config: input.config
			});
			if (!recoveredEvent) throw error;
			commit = {
				state: "committed",
				event: recoveredEvent
			};
		}
		if (commit.state === "conflict") {
			const error = /* @__PURE__ */ new Error("Skill proposal changed before apply status commit.");
			const recoveredEvent = await recoverAfterApplyCommitFailure({
				error,
				expected: record,
				applied,
				event: eventInput,
				mutation,
				env: input.env,
				agentId: input.agentId,
				config: input.config
			});
			if (!recoveredEvent) throw error;
			commit = {
				state: "committed",
				event: recoveredEvent
			};
		}
		bumpSkillsSnapshotVersion({
			reason: "workshop",
			changedPath: record.target.skillFile
		});
		return {
			result: {
				record: applied,
				targetSkillFile: record.target.skillFile
			},
			event: commit.event,
			skillChange: shouldDispatchSkillChange ? {
				before: beforeSkill,
				after: afterSkill
			} : void 0
		};
	}, storeOptions(input.env, input.agentId, input.config)));
	await dispatchSkillProposalChanged({
		event: result.event,
		record: result.result.record,
		workspaceDir: input.workspaceDir,
		...input.agentId ? { agentId: input.agentId } : {}
	});
	if (result.skillChange) await dispatchCommittedSkillChangeBestEffort({
		action: result.result.record.kind === "create" ? "created" : "updated",
		source: "workshop",
		workspaceDir: input.workspaceDir,
		before: result.skillChange.before,
		after: result.skillChange.after,
		proposal: {
			id: result.result.record.id,
			revision: result.result.record.proposedVersion,
			revisionSha256: hashSkillProposalRevision(result.result.record)
		}
	});
	return result.result;
}
async function withSkillProposalLifecycleDispatch(input, operation) {
	try {
		return await operation;
	} catch (error) {
		if (error instanceof SkillProposalLifecycleError) await dispatchSkillProposalChanged({
			event: error.event,
			record: error.record,
			workspaceDir: input.workspaceDir,
			...input.agentId ? { agentId: input.agentId } : {}
		});
		throw error;
	}
}
async function assertSkillProposalSupportTargetUnchanged(params) {
	const { record, file, currentContent } = params;
	if (file.targetExisted === false && currentContent !== null) await markSkillProposalStale({
		record,
		reason: `Target support file changed after proposal creation: ${file.path}`,
		message: "Target support file changed after proposal creation; proposal marked stale.",
		input: params.input
	});
	if (file.targetExisted === true) {
		if ((currentContent === null ? void 0 : hashSkillProposalContent(currentContent)) !== file.targetContentHash) await markSkillProposalStale({
			record,
			reason: `Target support file changed after proposal creation: ${file.path}`,
			message: "Target support file changed after proposal creation; proposal marked stale.",
			input: params.input
		});
	}
}
function transitionPendingSkillProposalToStale(params) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const stale = {
		...params.record,
		status: requiredApplyStatus("target_changed"),
		updatedAt: now,
		staleAt: now,
		statusReason: params.reason
	};
	const commit = commitPendingSkillProposalTransition({
		expected: params.record,
		record: stale,
		event: createSkillProposalEvent({
			record: stale,
			type: "stale",
			actor: params.input.eventActor,
			...params.input.correlationId ? { correlationId: params.input.correlationId } : {},
			occurredAt: now
		}),
		store: storeOptions(params.input.env, params.input.agentId, params.input.config),
		operationLabel: "skill-workshop.stale.commit"
	});
	if (commit.state !== "committed") throw new Error("Failed to record stale Skill Workshop proposal.");
	return {
		record: stale,
		event: commit.event
	};
}
async function markSkillProposalStale(params) {
	const transition = transitionPendingSkillProposalToStale(params);
	throw new SkillProposalLifecycleError(params.message, transition.record, transition.event);
}
function createSkillProposalRollback(params) {
	return {
		schema: SKILL_WORKSHOP_ROLLBACK_SCHEMA,
		proposalId: params.proposalId,
		writtenAt: (/* @__PURE__ */ new Date()).toISOString(),
		targetSkillFile: params.targetSkillFile,
		action: params.action,
		...params.previousContent !== void 0 ? {
			previousContent: params.previousContent,
			previousContentHash: hashSkillProposalContent(params.previousContent)
		} : {},
		...params.supportFiles && params.supportFiles.length > 0 ? { supportFiles: params.supportFiles } : {}
	};
}
async function quarantineSkillProposalAfterScan(params) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const updated = {
		...params.record,
		status: requiredApplyStatus("scan_failed"),
		updatedAt: now,
		quarantinedAt: now,
		scan: {
			...params.scan,
			state: "quarantined"
		},
		statusReason: "Proposal scan failed."
	};
	const commit = commitPendingSkillProposalTransition({
		expected: params.record,
		record: updated,
		event: createSkillProposalEvent({
			record: updated,
			type: "quarantined",
			actor: params.input.eventActor,
			...params.input.correlationId ? { correlationId: params.input.correlationId } : {},
			occurredAt: now
		}),
		store: storeOptions(params.input.env, params.input.agentId, params.input.config),
		operationLabel: "skill-workshop.quarantine.commit"
	});
	if (commit.state !== "committed") throw new Error("Failed to record quarantined Skill Workshop proposal.");
	throw new SkillProposalLifecycleError("Proposal scan failed; proposal was quarantined.", updated, commit.event);
}
async function assertApplyTargetUnchanged(record, mutation, input) {
	if (record.kind === "update" && record.target.currentContentHash && mutation.skillFile.previousContent !== null && hashSkillProposalContent(mutation.skillFile.previousContent) !== record.target.currentContentHash) await markSkillProposalStale({
		record,
		reason: "Target skill changed after proposal creation.",
		message: "Target skill changed after proposal creation; proposal marked stale.",
		input
	});
	for (const file of mutation.supportFiles) {
		const supportRecord = record.supportFiles?.find((entry) => entry.path === file.path);
		if (record.kind === "update" && supportRecord) await assertSkillProposalSupportTargetUnchanged({
			record,
			file: supportRecord,
			currentContent: file.previousContent,
			input
		});
	}
}
function createSkillProposalRollbackFromMutation(record, mutation) {
	return createSkillProposalRollback({
		proposalId: record.id,
		targetSkillFile: record.target.skillFile,
		action: record.kind,
		...mutation.skillFile.previousContent !== null ? { previousContent: mutation.skillFile.previousContent } : {},
		...mutation.supportFiles.length > 0 ? { supportFiles: mutation.supportFiles.map((file) => file.previousContent === null ? {
			path: file.path,
			existed: false
		} : {
			path: file.path,
			existed: true,
			previousContent: file.previousContent,
			previousContentHash: hashSkillProposalContent(file.previousContent)
		}) } : {}
	});
}
async function recoverAfterApplyCommitFailure(params) {
	const committed = readCommittedSkillProposalTransition({
		record: params.applied,
		event: params.event,
		store: storeOptions(params.env, params.agentId, params.config)
	});
	if (committed) return committed.event;
	if (readStoredProposal(params.expected.id, storeOptions(params.env, params.agentId, params.config))?.record.status === "applied") throw new Error("Applied Skill Workshop transition is missing its committed event.", { cause: params.error });
	requiredApplyStatus("apply_failed");
	if (!await isWorkspaceSkillMutationApplied(params.mutation).catch(() => false)) return null;
	try {
		try {
			await restoreWorkspaceSkillMutation(params.mutation);
		} finally {
			bumpSkillsSnapshotVersion({
				reason: "workshop",
				changedPath: params.expected.target.skillFile
			});
		}
	} catch (restoreError) {
		const failure = new Error("Skill proposal apply failed after filesystem mutation and requires reconciliation.", { cause: params.error });
		Object.assign(failure, { restoreError });
		throw failure;
	}
	await clearSkillProposalRollback({
		proposalId: params.expected.id,
		expectedRecordJson: JSON.stringify(params.expected),
		store: storeOptions(params.env, params.agentId, params.config)
	}).catch(() => false);
	return null;
}
function requiredApplyStatus(outcome) {
	const status = resolveSkillProposalApplyTransition("pending", outcome);
	if (!status) throw new Error(`Invalid pending Skill Workshop apply transition: ${outcome}`);
	return status;
}
function storeOptions(env, agentId, config) {
	return {
		...env ? { env } : {},
		...agentId ? { agentId } : {},
		config
	};
}
//#endregion
export { withSkillProposalLifecycleDispatch as a, transitionPendingSkillProposalToStale as i, assertSkillProposalSupportTargetUnchanged as n, markSkillProposalStale as r, applySkillProposalTransition as t };
