import { i as normalizeLegacyDotBetaVersion, r as isOpenClawCorrectionSemver, t as compareOpenClawSemver } from "./semver-aYpwYdrQ.mjs";
import { parse } from "semver";
//#region src/config/version.ts
/** Parses stable, prerelease, and legacy dot-beta OpenClaw versions. */
function parseOpenClawVersion(raw) {
	if (!raw) return null;
	const normalized = normalizeLegacyDotBetaVersion(raw.trim());
	return parse(normalized);
}
function normalizeOpenClawVersionBase(raw) {
	const parsed = parseOpenClawVersion(raw);
	if (!parsed) return null;
	return `${parsed.major}.${parsed.minor}.${parsed.patch}`;
}
function compareOpenClawVersions(a, b) {
	const parsedA = parseOpenClawVersion(a);
	const parsedB = parseOpenClawVersion(b);
	if (!parsedA || !parsedB) return null;
	return compareOpenClawSemver(parsedA, parsedB);
}
function shouldWarnOnTouchedVersion(current, touched) {
	const parsedCurrent = parseOpenClawVersion(current);
	const parsedTouched = parseOpenClawVersion(touched);
	if (parsedCurrent && parsedTouched && parsedCurrent.compareMain(parsedTouched) === 0) {
		if (parsedTouched.prerelease.length === 0 || isOpenClawCorrectionSemver(parsedTouched)) return false;
	}
	return parsedCurrent !== null && parsedTouched !== null ? compareOpenClawSemver(parsedCurrent, parsedTouched) < 0 : false;
}
//#endregion
export { normalizeOpenClawVersionBase as n, shouldWarnOnTouchedVersion as r, compareOpenClawVersions as t };
