import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-Dc6nN6HB.mjs";
import path from "node:path";
//#region src/cli/profile-utils.ts
const PROFILE_NAME_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
function isValidProfileName(value) {
	return PROFILE_NAME_RE.test(value);
}
function normalizeProfileName(raw) {
	const profile = raw?.trim();
	if (!profile) return null;
	if (normalizeLowercaseStringOrEmpty(profile) === "default") return null;
	if (!isValidProfileName(profile)) return null;
	return profile;
}
/** Resolve the canonical home-scoped state root for a validated CLI profile. */
function resolveProfileStateDir(profile, env, homedir) {
	const trimmed = profile.trim();
	if (!isValidProfileName(trimmed)) throw new Error(`Invalid profile name: ${JSON.stringify(profile)}`);
	const suffix = normalizeLowercaseStringOrEmpty(trimmed) === "default" ? "" : `-${trimmed}`;
	return path.join(resolveRequiredHomeDir(env, homedir), `.openclaw${suffix}`);
}
//#endregion
export { normalizeProfileName as n, resolveProfileStateDir as r, isValidProfileName as t };
