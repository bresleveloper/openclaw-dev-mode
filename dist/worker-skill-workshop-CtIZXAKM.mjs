import { R as WorkerSessionToolResponseFrameSchema } from "./worker-admission-BB3C4gz4.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXfMhak.mjs";
import { a as SkillLibraryFileSchema } from "./skill-library-C7RO5Y8q.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/worker-skill-workshop.ts
const WORKER_SKILL_WORKSHOP_FEATURE = "worker-skill-workshop-v1";
const WorkerSkillWorkshopBindingSchema = Type.Object({ multipleProfiles: Type.Boolean() }, { additionalProperties: false });
const SkillLibraryWorkshopSchema = Type.Object({
	action: Type.Enum([
		"list",
		"read",
		"create",
		"update",
		"share",
		"unshare",
		"transfer",
		"activate",
		"remove",
		"rollback"
	], { type: "string" }),
	target: Type.Optional(Type.Literal("personal")),
	skill_id: Type.Optional(Type.String({ maxLength: 36 })),
	expected_revision: Type.Optional(Type.String({ pattern: "^[a-f0-9]{64}$" })),
	revision: Type.Optional(Type.String({ pattern: "^[a-f0-9]{64}$" })),
	name: Type.Optional(Type.String({
		maxLength: 63,
		description: "Human-facing slug, not the generated command name. Omit on update to preserve it."
	})),
	proposal_content: Type.Optional(Type.String({ maxLength: 32768 })),
	artifact_path: Type.Optional(Type.String({
		maxLength: 512,
		description: "Read one whole UTF-8 artifact; defaults to SKILL.md. Binary or oversized files require the UI or CLI."
	})),
	files: Type.Optional(Type.Array(Type.Object({
		...SkillLibraryFileSchema.properties,
		content: Type.String({ maxLength: 32768 })
	}, { additionalProperties: false }), {
		maxItems: 32,
		description: "Named support-file upserts. Other files and omitted executable flags are preserved."
	})),
	delete_files: Type.Optional(Type.Array(Type.String({ maxLength: 512 }), {
		maxItems: 32,
		description: "Exact supporting paths to remove intentionally; never SKILL.md."
	}))
}, { additionalProperties: false });
const WorkerSkillWorkshopParamsSchema = Type.Object({
	toolCallId: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	arguments: SkillLibraryWorkshopSchema
}, { additionalProperties: false });
const validateWorkerSkillWorkshopParams = /* @__PURE__ */ lazyCompile(WorkerSkillWorkshopParamsSchema);
const WorkerSkillWorkshopResponseFrameSchema = WorkerSessionToolResponseFrameSchema;
//#endregion
export { WorkerSkillWorkshopResponseFrameSchema as a, WorkerSkillWorkshopParamsSchema as i, WORKER_SKILL_WORKSHOP_FEATURE as n, validateWorkerSkillWorkshopParams as o, WorkerSkillWorkshopBindingSchema as r, SkillLibraryWorkshopSchema as t };
