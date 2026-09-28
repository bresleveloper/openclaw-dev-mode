import { a as SkillLibraryFileSchema } from "./skill-library-C7RO5Y8q.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/skill-resources.ts
/** Portable, bounded skill resources; paths are relative to a worker-owned resource directory. */
const SkillResourceDeliverySchema = Type.Object({
	version: Type.Literal(1),
	skills: Type.Array(Type.Object({
		sourcePath: Type.Optional(Type.String({ maxLength: 4096 })),
		modelVisible: Type.Optional(Type.Boolean()),
		name: Type.String({
			minLength: 1,
			maxLength: 128
		}),
		displayName: Type.Optional(Type.String({ maxLength: 256 })),
		description: Type.String({ maxLength: 1024 }),
		revision: Type.String({ pattern: "^[a-f0-9]{64}$" }),
		files: Type.Array(SkillLibraryFileSchema, { maxItems: 256 })
	}, { additionalProperties: false }), { maxItems: 256 })
}, { additionalProperties: false });
const SKILL_RESOURCE_PROTOCOL_FEATURE = "skill-resources-v1";
//#endregion
export { SkillResourceDeliverySchema as n, SKILL_RESOURCE_PROTOCOL_FEATURE as t };
