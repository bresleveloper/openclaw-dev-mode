import { t as lazyCompile } from "./protocol-validator-BeXfMhak.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/skill-library.ts
const SKILL_LIBRARY_MAX_FILES = 256;
const SKILL_LIBRARY_MAX_FILE_BYTES = 1048576;
const SKILL_LIBRARY_MAX_BUNDLE_BYTES = 8388608;
const SKILL_LIBRARY_MAX_SELECTIONS = 64;
const id = Type.String({ pattern: "^[a-f0-9-]{36}$" });
const revision = Type.String({ pattern: "^[a-f0-9]{64}$" });
const slug = Type.String({ pattern: "^[a-z0-9][a-z0-9-]{0,62}$" });
const sessionKey = Type.String({
	minLength: 1,
	maxLength: 512
});
const closed = { additionalProperties: false };
const SkillLibraryFileSchema = Type.Object({
	path: Type.String({
		minLength: 1,
		maxLength: 512
	}),
	content: Type.String({ maxLength: Math.ceil(SKILL_LIBRARY_MAX_FILE_BYTES / 3) * 4 }),
	encoding: Type.Optional(Type.Union([Type.Literal("utf8"), Type.Literal("base64")])),
	executable: Type.Optional(Type.Boolean())
}, closed);
const SkillLibrarySelectionSchema = Type.Object({
	skillId: id,
	revision,
	/** Persisted command identity: library collisions never shadow workspace names. */
	name: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	ownerProfileId: Type.Union([Type.String({ maxLength: 128 }), Type.Null()])
}, closed);
const SkillsLibraryListParamsSchema = Type.Object({
	sessionKey: Type.Optional(sessionKey),
	scope: Type.Optional(Type.Union([
		Type.Literal("mine"),
		Type.Literal("team"),
		Type.Literal("all")
	]))
}, closed);
const SkillsLibraryReadParamsSchema = Type.Object({
	skillId: id,
	revision: Type.Optional(revision),
	sessionKey: Type.Optional(sessionKey)
}, closed);
const SkillsLibrarySaveParamsSchema = Type.Object({
	skillId: Type.Optional(id),
	expectedRevision: Type.Union([revision, Type.Null()]),
	slug,
	content: Type.String({
		minLength: 1,
		maxLength: SKILL_LIBRARY_MAX_FILE_BYTES
	}),
	files: Type.Optional(Type.Array(SkillLibraryFileSchema, { maxItems: 255 }))
}, closed);
const SkillsLibraryMutateParamsSchema = Type.Object({
	skillId: id,
	expectedRevision: revision,
	action: Type.Union([
		Type.Literal("share"),
		Type.Literal("unshare"),
		Type.Literal("transfer"),
		Type.Literal("remove"),
		Type.Literal("enable"),
		Type.Literal("disable"),
		Type.Literal("rollback")
	]),
	revision: Type.Optional(revision)
}, closed);
const SkillsLibraryActivateParamsSchema = Type.Object({
	sessionKey,
	action: Type.Union([
		Type.Literal("attach"),
		Type.Literal("detach"),
		Type.Literal("refresh")
	]),
	skillId: Type.Optional(id),
	revision: Type.Optional(revision)
}, closed);
const SkillsLibraryImportParamsSchema = Type.Object({
	slug,
	source: Type.Object({
		kind: Type.Literal("clawhub"),
		slug: Type.String({
			minLength: 1,
			maxLength: 256
		}),
		version: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 128
		}))
	}, closed)
}, closed);
const SkillsLibraryUploadParamsSchema = Type.Union([
	Type.Object({
		action: Type.Literal("begin"),
		slug,
		sizeBytes: Type.Integer({
			minimum: 1,
			maximum: SKILL_LIBRARY_MAX_BUNDLE_BYTES
		}),
		sha256: revision
	}, closed),
	Type.Object({
		action: Type.Literal("chunk"),
		uploadId: id,
		offset: Type.Integer({ minimum: 0 }),
		data: Type.String({ maxLength: 35e4 })
	}, closed),
	Type.Object({
		action: Type.Literal("commit"),
		uploadId: id
	}, closed)
]);
const validateSkillsLibraryListParams = /* @__PURE__ */ lazyCompile(SkillsLibraryListParamsSchema);
const validateSkillsLibraryReadParams = /* @__PURE__ */ lazyCompile(SkillsLibraryReadParamsSchema);
const validateSkillsLibrarySaveParams = /* @__PURE__ */ lazyCompile(SkillsLibrarySaveParamsSchema);
const validateSkillsLibraryMutateParams = /* @__PURE__ */ lazyCompile(SkillsLibraryMutateParamsSchema);
const validateSkillsLibraryActivateParams = /* @__PURE__ */ lazyCompile(SkillsLibraryActivateParamsSchema);
const validateSkillsLibraryImportParams = /* @__PURE__ */ lazyCompile(SkillsLibraryImportParamsSchema);
const validateSkillsLibraryUploadParams = /* @__PURE__ */ lazyCompile(SkillsLibraryUploadParamsSchema);
//#endregion
export { validateSkillsLibraryMutateParams as _, SkillLibraryFileSchema as a, validateSkillsLibraryUploadParams as b, SkillsLibraryImportParamsSchema as c, SkillsLibraryReadParamsSchema as d, SkillsLibrarySaveParamsSchema as f, validateSkillsLibraryListParams as g, validateSkillsLibraryImportParams as h, SKILL_LIBRARY_MAX_SELECTIONS as i, SkillsLibraryListParamsSchema as l, validateSkillsLibraryActivateParams as m, SKILL_LIBRARY_MAX_FILES as n, SkillLibrarySelectionSchema as o, SkillsLibraryUploadParamsSchema as p, SKILL_LIBRARY_MAX_FILE_BYTES as r, SkillsLibraryActivateParamsSchema as s, SKILL_LIBRARY_MAX_BUNDLE_BYTES as t, SkillsLibraryMutateParamsSchema as u, validateSkillsLibraryReadParams as v, validateSkillsLibrarySaveParams as y };
