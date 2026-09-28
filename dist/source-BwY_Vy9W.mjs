import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/skills/loading/source.ts
/** Returns the stable source label attached to a loaded skill. */
function resolveSkillSource(skill) {
	const compatSkill = skill;
	const canonical = normalizeOptionalString(compatSkill.source) ?? "";
	if (canonical) return canonical;
	return (normalizeOptionalString(compatSkill.sourceInfo?.source) ?? "") || "unknown";
}
function resolveSkillTelemetrySourceValue(value) {
	const source = normalizeOptionalString(value) ?? "";
	if (source === "bundled" || source === "openclaw-bundled" || source === "openclaw-custodian") return "bundled";
	if (source === "workspace" || source === "openclaw-workspace" || source === "openclaw-workshop" || source === "openclaw-managed" || source === "openclaw-extra" || source === "agents-skills-personal" || source === "agents-skills-project") return "workspace";
	return "unknown";
}
function resolveSkillTelemetrySource(skill) {
	return resolveSkillTelemetrySourceValue(resolveSkillSource(skill));
}
//#endregion
export { resolveSkillTelemetrySource as n, resolveSkillTelemetrySourceValue as r, resolveSkillSource as t };
