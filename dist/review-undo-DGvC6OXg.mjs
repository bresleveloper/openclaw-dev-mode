import { c as resolveSystemEventQueueKey } from "./system-event-ownership-DAgHWXZ1.mjs";
import { s as enqueueSystemEvent } from "./system-events-Bf4ozS7L.mjs";
import { a as listWorkshopSkills, c as restoreWorkshopSkill, d as listWorkshopChanges, i as listWorkshopArchive, n as archiveWorkshopSkill, t as WorkshopWriteError } from "./library-lvOOduU2.mjs";
//#region src/skills/workshop/review-undo.ts
const REVIEW_RUN_PREFIX = "skill-workshop-review:";
const UNDO_RUN_PREFIX = "skill-workshop-undo:";
const MAX_RUN_CHANGES = 500;
/** Run id of one background review; `reviewId` is the id `/learn undo` takes. */
function workshopReviewRunId(reviewId) {
	return `${REVIEW_RUN_PREFIX}${reviewId}`;
}
function workshopReviewIdOf(runId) {
	return runId.startsWith(REVIEW_RUN_PREFIX) && runId.length > 22 ? runId.slice(22) : void 0;
}
/** The review id names no recorded change; callers word this differently from other refusals. */
var WorkshopReviewNotFoundError = class extends WorkshopWriteError {
	constructor(..._args) {
		super(..._args);
		this.name = "WorkshopReviewNotFoundError";
	}
};
/** "restored `a`; archived `b`" for the revert changes of one undo. */
function describeWorkshopReviewUndo(changes) {
	return changes.map((change) => `${change.action === "archive" ? "archived" : "restored"} \`${change.skillName}\``).join("; ");
}
function notifyReviewedSession(ctx, reviewChanges, reviewId, reverted) {
	const sessionKey = reviewChanges.find((change) => change.sessionKey)?.sessionKey;
	if (!sessionKey || reverted.length === 0) return;
	enqueueSystemEvent(`The user already undid background skill review ${reviewId} from its notice (${describeWorkshopReviewUndo(reverted)}). That skill change is reverted; do not revert it again if asked to undo it.`, { sessionKey: resolveSystemEventQueueKey(sessionKey, ctx.agentId) });
}
async function revertReview(ctx, runId, reviewId) {
	const reviewChanges = (await listWorkshopChanges(ctx.agentId, {
		runId,
		limit: MAX_RUN_CHANGES
	})).toReversed();
	const reviewStart = reviewChanges[0];
	if (!reviewStart) throw new WorkshopReviewNotFoundError(`No skill changes recorded for review ${runId}.`);
	const feed = await listWorkshopChanges(ctx.agentId, { limit: MAX_RUN_CHANGES });
	const oldestRetained = feed.at(-1);
	if (feed.length >= MAX_RUN_CHANGES && oldestRetained && oldestRetained.createdAtMs >= reviewStart.createdAtMs) throw new WorkshopWriteError(`Review ${reviewId} is too old to undo in one step: part of its history was pruned. Restore its skills one by one in the Skill Workshop.`);
	const undoRunId = `${UNDO_RUN_PREFIX}${reviewId}`;
	const undone = new Set((await listWorkshopChanges(ctx.agentId, {
		runId: undoRunId,
		limit: MAX_RUN_CHANGES
	})).map((change) => change.skillName));
	const firstBySkill = /* @__PURE__ */ new Map();
	for (const change of reviewChanges) if (!firstBySkill.has(change.skillName)) firstBySkill.set(change.skillName, change);
	const live = new Set((await listWorkshopSkills(ctx.config, ctx.agentId)).map((skill) => skill.name));
	const targets = [...firstBySkill.values()].filter(({ skillName, versionId }) => !undone.has(skillName) && (versionId || live.has(skillName)));
	const retained = new Map((await listWorkshopArchive(ctx.config, ctx.agentId)).map((skill) => [skill.name, new Set(skill.versions.map((version) => version.id))]));
	const pruned = targets.find(({ skillName, versionId }) => versionId && !retained.get(skillName)?.has(versionId));
	if (pruned) throw new WorkshopWriteError(`Cannot undo review ${reviewId}: the version of "${pruned.skillName}" saved before it is no longer kept. Restore that skill from the Skill Workshop.`);
	const undoCtx = {
		...ctx,
		runId: undoRunId
	};
	const changes = [];
	try {
		for (const { skillName: name, versionId } of targets) changes.push(versionId ? await restoreWorkshopSkill(undoCtx, {
			name,
			versionId,
			summary: "undid background review"
		}) : await archiveWorkshopSkill(undoCtx, {
			name,
			reason: "undo"
		}));
	} catch (error) {
		if (changes.length === 0) throw error;
		notifyReviewedSession(ctx, reviewChanges, reviewId, changes);
		const reason = error instanceof Error ? error.message : String(error);
		throw new WorkshopWriteError(`Partly undone (${describeWorkshopReviewUndo(changes)}); ${reason}`, { cause: error });
	}
	if (changes.length === 0) return {
		status: "already-undone",
		changes
	};
	notifyReviewedSession(ctx, reviewChanges, reviewId, changes);
	return {
		status: "undone",
		changes
	};
}
const inFlight = /* @__PURE__ */ new Map();
/**
* Reverts every skill one background review changed: restores the version saved before the
* review's first change of it, or archives a skill the review created. Reverts are recorded
* under the review's undo run id, so a repeated undo skips skills already reverted.
*/
async function undoWorkshopReview(ctx, params) {
	const reviewId = workshopReviewIdOf(params.runId);
	if (!reviewId) throw new WorkshopReviewNotFoundError(`No skill changes recorded for review ${params.runId}.`);
	const key = `${ctx.agentId}\0${reviewId}`;
	const run = (inFlight.get(key) ?? Promise.resolve()).catch(() => void 0).then(() => revertReview(ctx, params.runId, reviewId));
	inFlight.set(key, run);
	try {
		return await run;
	} finally {
		if (inFlight.get(key) === run) inFlight.delete(key);
	}
}
//#endregion
export { workshopReviewRunId as a, workshopReviewIdOf as i, describeWorkshopReviewUndo as n, undoWorkshopReview as r, WorkshopReviewNotFoundError as t };
