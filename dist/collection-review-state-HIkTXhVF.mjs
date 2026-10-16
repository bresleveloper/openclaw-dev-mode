import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as executeSkillWorkshopOperation } from "./store-client-BMKnc-Bx.mjs";
import path from "node:path";
//#region src/skills/workshop/collection-review-state.ts
async function recordSkillExperienceReviewOutcome(agentId, workspaceDir, review, options = {}) {
	const input = {
		agentId,
		workspaceDir: path.resolve(workspaceDir),
		review
	};
	const context = options.context ?? captureOpenClawStateWorkerContext(options);
	return executeSkillWorkshopOperation("workshop.experience.record", input, {
		env: context.environment,
		execution: {
			context,
			leases: []
		}
	});
}
function readSkillCollectionBackupDrops(agentId, backupId, options = {}) {
	return executeSkillWorkshopOperation("workshop.collection.drops", {
		agentId,
		backupId
	}, options);
}
function listSkillCollectionReviewOutcomes(agentId, options = {}) {
	return executeSkillWorkshopOperation("workshop.collection.list", agentId, options);
}
//#endregion
export { readSkillCollectionBackupDrops as n, recordSkillExperienceReviewOutcome as r, listSkillCollectionReviewOutcomes as t };
