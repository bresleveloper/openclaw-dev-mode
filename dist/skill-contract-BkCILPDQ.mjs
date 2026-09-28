import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
//#region src/skills/loading/skill-contract.ts
function escapeSkillXml(str) {
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function decodeSkillXml(value) {
	return value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}
function truncateSkillDescription(description, maxChars) {
	const normalized = description.replace(/\s+/g, " ").trim();
	if (normalized.length <= maxChars) return normalized;
	if (maxChars <= 3) return truncateUtf16Safe(normalized, maxChars);
	return `${truncateUtf16Safe(normalized, maxChars - 3).trimEnd()}...`;
}
/** Project descriptions for a model without changing admitted identities or loading instructions. */
function compactSkillsPromptForContext(prompt, contextTokenBudget) {
	if (!contextTokenBudget || !Number.isFinite(contextTokenBudget) || contextTokenBudget <= 0) return prompt;
	const targetChars = Math.floor(contextTokenBudget / 5);
	if (prompt.length <= targetChars) return prompt;
	const start = prompt.indexOf("<available_skills>");
	const end = prompt.indexOf("</available_skills>", start);
	if (start < 0 || end < start) return prompt;
	const catalog = prompt.slice(start, end);
	const render = (maxChars) => prompt.slice(0, start) + catalog.replace(/<description>([\s\S]*?)<\/description>/gu, (_match, description) => `<description>${escapeSkillXml(truncateSkillDescription(decodeSkillXml(description), maxChars))}</description>`) + prompt.slice(end);
	let lo = 64;
	let hi = 220;
	let result = render(lo);
	while (lo <= hi) {
		const mid = Math.floor((lo + hi) / 2);
		const candidate = render(mid);
		if (candidate.length <= targetChars) {
			result = candidate;
			lo = mid + 1;
		} else hi = mid - 1;
	}
	return result.length < prompt.length ? result : prompt;
}
function formatSkillCatalog(skills, loadingInstructions, descriptionForSkill) {
	if (skills.length === 0) return "";
	const lines = [
		"\n\nThe following skills provide specialized instructions for specific tasks.",
		loadingInstructions,
		"When a skill file references a relative path, resolve it against the skill directory (parent of SKILL.md / dirname of the path) and use that absolute path in tool commands.",
		"",
		"<available_skills>"
	];
	for (const skill of skills) {
		lines.push("  <skill>");
		lines.push(`    <name>${escapeSkillXml(skill.name)}</name>`);
		const description = descriptionForSkill(skill);
		if (description !== void 0) lines.push(`    <description>${escapeSkillXml(description)}</description>`);
		lines.push(`    <location>${escapeSkillXml(skill.filePath)}</location>`);
		if (skill.locationNote) lines.push(`    <location_note>${escapeSkillXml(skill.locationNote)}</location_note>`);
		lines.push("  </skill>");
	}
	lines.push("</available_skills>");
	return lines.join("\n");
}
/** Render the full catalog without importing the session runtime or reapplying visibility. */
function formatSkillsForPromptCore(skills) {
	return formatSkillCatalog(skills, "Read a skill's file at its listed location when the task matches its description.", (skill) => skill.description);
}
/** Compact prompt catalog with descriptions bounded independently from identities. */
function formatSkillsCompactForPrompt(skills, opts) {
	if (skills.length === 0) return "";
	const descriptionMaxChars = Math.max(0, Math.floor(opts?.descriptionMaxChars ?? 220));
	return formatSkillCatalog(skills, descriptionMaxChars > 0 ? "Read a skill's file at its listed location when the task matches its name or description." : "Read a skill's file at its listed location when the task matches its name.", (skill) => descriptionMaxChars > 0 ? truncateSkillDescription(skill.description, descriptionMaxChars) || void 0 : void 0);
}
//#endregion
export { formatSkillsForPromptCore as a, formatSkillsCompactForPrompt as i, decodeSkillXml as n, escapeSkillXml as r, compactSkillsPromptForContext as t };
