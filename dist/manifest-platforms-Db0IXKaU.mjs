import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
//#region src/plugins/manifest-platforms.ts
const MANIFEST_PLATFORMS = /* @__PURE__ */ new Set([
	"aix",
	"android",
	"darwin",
	"freebsd",
	"haiku",
	"linux",
	"openbsd",
	"sunos",
	"win32",
	"cygwin",
	"netbsd"
]);
function normalizeManifestPlatforms(value) {
	return normalizeTrimmedStringList(value).filter((platform) => MANIFEST_PLATFORMS.has(platform));
}
//#endregion
export { normalizeManifestPlatforms as t };
