import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Jn as string, Kt as custom, Lt as boolean, Nt as array, Pn as number, Sn as looseObject, Tn as map, Yt as discriminatedUnion, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { s as normalizeWorkspaceSkillSupportPath } from "./workspace-skill-write-Ch4M1BlA.mjs";
//#region src/skills/workshop/types.ts
/** Schema id for persisted skill workshop proposal records. */
const SKILL_WORKSHOP_SCHEMA = "openclaw.skill-workshop.proposal.v1";
const SKILL_WORKSHOP_MANIFEST_SCHEMA = "openclaw.skill-workshop.proposals-manifest.v1";
const SKILL_WORKSHOP_ROLLBACK_SCHEMA = "openclaw.skill-workshop.rollback.v1";
const MAX_SKILL_PROPOSAL_ORIGIN_RUN_IDS = 4096;
//#endregion
//#region src/skills/workshop/proposal-origin-validation.ts
function isValidOrigin(value) {
	if (value === void 0) return true;
	if (!isRecord(value)) return false;
	return [
		"agentId",
		"sessionKey",
		"runId",
		"messageId"
	].every((key) => {
		const item = value[key];
		return item === void 0 || typeof item === "string";
	});
}
function isValidRunIds(value) {
	if (value === void 0) return true;
	if (!Array.isArray(value) || value.length > 4096) return false;
	const ids = /* @__PURE__ */ new Set();
	for (const item of value) {
		if (typeof item !== "string" || !item.trim() || ids.has(item)) return false;
		ids.add(item);
	}
	return true;
}
function isValidMutationCounts(value, originRunIds) {
	if (value === void 0) return true;
	if (!isRecord(value)) return false;
	const allowedIds = new Set(originRunIds);
	const entries = Object.entries(value);
	return entries.length <= 4096 && entries.every(([runId, count]) => Boolean(runId.trim()) && allowedIds.has(runId) && typeof count === "number" && Number.isSafeInteger(count) && count > 0);
}
function hasValidProposalOriginProvenance(value) {
	return isValidOrigin(value.origin) && isValidRunIds(value.originRunIds) && isValidMutationCounts(value.originRunMutationCounts, value.originRunIds);
}
//#endregion
//#region src/skills/workshop/store-record.ts
const PROPOSAL_DRAFT_FILE = "PROPOSAL.md";
const MAX_SKILL_PROPOSAL_EVALUATION_BYTES = 524288;
const PROPOSAL_ID_PATTERN = /^[a-z0-9][a-z0-9-]{5,120}$/;
const PROPOSAL_DRAFT_FILE_PATTERN = /^(?:PROPOSAL\.md|generations\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/PROPOSAL\.md)$/u;
const sha256Schema = string().regex(/^[a-f0-9]{64}$/i);
const skillProposalFindingSchema = looseObject({
	ruleId: string().min(1).max(256),
	severity: _enum([
		"info",
		"warn",
		"critical"
	]),
	message: string().min(1).max(4e3),
	file: string().max(1024).optional(),
	line: number().refine(Number.isSafeInteger).refine((value) => value >= 1).optional()
});
const skillProposalMetricValueSchema = union([
	string().max(4e3),
	number().finite(),
	boolean()
]);
const skillProposalMetricsSchema = custom(isRecord).transform((metrics) => new Map(Object.entries(metrics))).pipe(map(string().min(1).max(128), skillProposalMetricValueSchema)).refine((metrics) => metrics.size <= 64);
const skillProposalEvaluationResultSchema = looseObject({
	summary: string().max(8e3).optional(),
	evaluatorVersion: string().max(128).optional(),
	mode: string().max(128).optional(),
	decision: _enum([
		"pass",
		"revise",
		"block"
	]).optional(),
	decisionReason: string().max(2e3).optional(),
	findings: array(skillProposalFindingSchema).max(200).optional(),
	metrics: skillProposalMetricsSchema.optional()
});
const skillProposalEvaluationOutcomeBaseShape = {
	evaluatorId: string().min(1).max(128),
	pluginId: string().min(1).max(128),
	pluginVersion: string().max(128).optional()
};
const skillProposalEvaluationOutcomeSchema = discriminatedUnion("status", [
	looseObject({
		...skillProposalEvaluationOutcomeBaseShape,
		status: literal("skipped")
	}),
	looseObject({
		...skillProposalEvaluationOutcomeBaseShape,
		status: literal("error"),
		error: string().max(2e3)
	}),
	looseObject({
		...skillProposalEvaluationOutcomeBaseShape,
		status: literal("completed"),
		result: skillProposalEvaluationResultSchema
	})
]);
const skillProposalEvaluationSchema = looseObject({
	id: string().min(1).max(128),
	proposedVersion: string(),
	revisionHash: sha256Schema,
	trigger: _enum(["manual", "apply"]),
	startedAt: string(),
	completedAt: string(),
	correlationId: string().min(1).refine((value) => Array.from(value).length <= 256).optional(),
	targetTreeSha256: sha256Schema.optional(),
	outcomes: array(skillProposalEvaluationOutcomeSchema).max(64)
});
const skillProposalSupportFileSchema = looseObject({
	path: string(),
	hash: sha256Schema,
	sizeBytes: number().refine(Number.isSafeInteger).refine((value) => value >= 0 && value <= 262144),
	targetExisted: boolean().optional(),
	targetContentHash: sha256Schema.optional()
});
const skillProposalSupportFilesSchema = array(skillProposalSupportFileSchema).max(64).superRefine((files, context) => {
	const seen = /* @__PURE__ */ new Set();
	for (const [index, file] of files.entries()) {
		let normalized;
		try {
			normalized = normalizeWorkspaceSkillSupportPath(file.path);
		} catch {
			context.addIssue({
				code: "custom",
				message: "invalid support path",
				path: [index, "path"]
			});
			continue;
		}
		if (seen.has(normalized)) context.addIssue({
			code: "custom",
			message: "duplicate support path",
			path: [index, "path"]
		});
		seen.add(normalized);
	}
});
const skillProposalRecordSchema = looseObject({
	schema: literal(SKILL_WORKSHOP_SCHEMA),
	id: string().regex(PROPOSAL_ID_PATTERN),
	kind: _enum(["create", "update"]),
	status: _enum([
		"pending",
		"applied",
		"rejected",
		"quarantined",
		"stale"
	]),
	title: string(),
	description: string(),
	createdAt: string(),
	updatedAt: string(),
	autonomousCapture: literal(true).optional(),
	draftHash: string(),
	draftFile: string().regex(PROPOSAL_DRAFT_FILE_PATTERN),
	origin: unknown().optional(),
	originRunIds: unknown().optional(),
	originRunMutationCounts: unknown().optional(),
	supportFiles: skillProposalSupportFilesSchema.optional(),
	evaluation: skillProposalEvaluationSchema.optional(),
	target: looseObject({
		skillName: string(),
		skillKey: string(),
		skillDir: string(),
		skillFile: string()
	}),
	scan: custom((value) => value !== null && typeof value === "object")
}).refine(hasValidProposalOriginProvenance);
const skillProposalRollbackSchema = looseObject({
	schema: literal(SKILL_WORKSHOP_ROLLBACK_SCHEMA),
	proposalId: string().regex(PROPOSAL_ID_PATTERN),
	writtenAt: string(),
	targetSkillFile: string(),
	action: _enum(["create", "update"]),
	previousContentHash: sha256Schema.optional(),
	previousContent: string().optional(),
	supportFiles: array(unknown()).optional()
});
function assertSkillProposalEvaluationWithinLimit(evaluation) {
	if (Buffer.byteLength(JSON.stringify(evaluation), "utf8") > 524288) throw new Error(`Skill proposal evaluation exceeds ${MAX_SKILL_PROPOSAL_EVALUATION_BYTES} bytes.`);
}
function assertProposalId(proposalId) {
	if (!PROPOSAL_ID_PATTERN.test(proposalId)) throw new Error("Invalid skill proposal id.");
}
function validateSkillProposalRecord(raw) {
	if (!skillProposalRecordSchema.safeParse(raw).success) return invalidMetadata("proposal");
	return ok(raw);
}
function parseSkillProposalRecord(raw) {
	const result = validateSkillProposalRecord(raw);
	return result.ok ? result.value : null;
}
function parseSkillProposalEvaluation(raw) {
	return skillProposalEvaluationSchema.safeParse(raw).success ? raw : null;
}
function validateSkillProposalRollback(raw) {
	if (!skillProposalRollbackSchema.safeParse(raw).success) return invalidMetadata("rollback");
	return ok(raw);
}
function parseSkillProposalRollback(raw) {
	const result = validateSkillProposalRollback(raw);
	return result.ok ? result.value : null;
}
function invalidMetadata(kind) {
	return err({
		code: `invalid-${kind}-metadata`,
		message: `invalid ${kind} metadata`
	});
}
//#endregion
export { parseSkillProposalEvaluation as a, validateSkillProposalRecord as c, SKILL_WORKSHOP_MANIFEST_SCHEMA as d, SKILL_WORKSHOP_ROLLBACK_SCHEMA as f, assertSkillProposalEvaluationWithinLimit as i, validateSkillProposalRollback as l, PROPOSAL_DRAFT_FILE as n, parseSkillProposalRecord as o, SKILL_WORKSHOP_SCHEMA as p, assertProposalId as r, parseSkillProposalRollback as s, MAX_SKILL_PROPOSAL_EVALUATION_BYTES as t, MAX_SKILL_PROPOSAL_ORIGIN_RUN_IDS as u };
