import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as SkillLibraryFileSchema } from "./skill-library-Bgib5R_8.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/skill-resources.ts
/** Portable, bounded skill resources; paths are relative to a worker-owned resource directory. */
const SkillResourceDeliverySchema = closedObject({
	version: Type.Literal(1),
	skills: Type.Array(closedObject({
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
	}), { maxItems: 256 })
});
const SKILL_RESOURCE_PROTOCOL_FEATURE = "skill-resources-v1";
//#endregion
export { SkillResourceDeliverySchema as n, SKILL_RESOURCE_PROTOCOL_FEATURE as t };
