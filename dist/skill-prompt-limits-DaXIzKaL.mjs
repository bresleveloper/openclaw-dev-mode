import { a as formatSkillsForPromptCore, i as formatSkillsCompactForPrompt } from "./skill-contract-BNrmgBMG.mjs";
//#region src/skills/loading/skill-prompt-limits.ts
const COMPACT_DESCRIPTION_MIN_CHARS = 4;
const DEFAULT_MAX_SKILLS_IN_PROMPT = 150;
const DEFAULT_MAX_SKILLS_PROMPT_CHARS = 18e3;
function largestFittingValue(min, max, fits) {
	let lo = min;
	let hi = max;
	while (lo < hi) {
		const mid = Math.ceil((lo + hi) / 2);
		if (fits(mid)) lo = mid;
		else hi = mid - 1;
	}
	return lo;
}
function buildSkillsLimitNote(params) {
	if (params.truncated) {
		const compactDetails = params.format.kind === "compact" ? ` (compact format, ${params.format.descriptionMaxChars > 0 ? "descriptions shortened" : "descriptions omitted"})` : "";
		return `⚠️ Skills truncated: included ${params.included} of ${params.total}${compactDetails}. Run \`openclaw skills check\` to audit.`;
	}
	if (params.format.kind === "compact") return `⚠️ Skills catalog using compact format (${params.format.descriptionMaxChars > 0 ? "descriptions shortened" : "descriptions omitted"}). Run \`openclaw skills check\` to audit.`;
	return "";
}
function buildRenderedSkillsPrompt(params) {
	const truncated = params.skills.length < params.total;
	return [params.includeLimitNote === false ? "" : buildSkillsLimitNote({
		truncated,
		format: params.format,
		included: params.skills.length,
		total: params.total
	}), params.format.kind === "compact" ? formatSkillsCompactForPrompt(params.skills, { descriptionMaxChars: params.format.descriptionMaxChars }) : formatSkillsForPromptCore(params.skills)].filter(Boolean).join("\n");
}
/** Render a deterministic skills catalog within the shared model-context budget. */
function formatSkillsForPromptBounded(params) {
	return prepareSkillsForPrompt(params).prompt;
}
/** Keep resource selection tied to the exact catalog admitted by the prompt budget. */
function prepareSkillsForPrompt(params) {
	const maxSkillsInPrompt = params.maxSkillsInPrompt ?? DEFAULT_MAX_SKILLS_IN_PROMPT;
	const maxSkillsPromptChars = params.maxSkillsPromptChars ?? DEFAULT_MAX_SKILLS_PROMPT_CHARS;
	const orderedSkills = params.preserveOrder ? params.skills : params.skills.toSorted((a, b) => a.name.localeCompare(b.name, "en"));
	const total = orderedSkills.length;
	const byCount = orderedSkills.slice(0, Math.max(0, maxSkillsInPrompt));
	let skillsForPrompt = byCount;
	const renderWithinLimit = (skills, format, includeLimitNote = true) => {
		const prompt = buildRenderedSkillsPrompt({
			skills,
			total,
			format,
			includeLimitNote
		});
		if (params.remoteNote && params.remoteNote.length + prompt.length + (prompt ? 1 : 0) <= maxSkillsPromptChars) return prompt ? `${params.remoteNote}\n${prompt}` : params.remoteNote;
		return prompt.length <= maxSkillsPromptChars ? prompt : void 0;
	};
	const fitsCompact = (skills, descriptionMaxChars, includeLimitNote = true) => renderWithinLimit(skills, {
		kind: "compact",
		descriptionMaxChars
	}, includeLimitNote) !== void 0;
	const fullPrompt = renderWithinLimit(skillsForPrompt, { kind: "full" });
	if (fullPrompt !== void 0) return {
		prompt: fullPrompt,
		skills: skillsForPrompt
	};
	if (!fitsCompact(skillsForPrompt, 0)) {
		const count = largestFittingValue(0, skillsForPrompt.length, (candidateCount) => fitsCompact(skillsForPrompt.slice(0, candidateCount), 0));
		skillsForPrompt = skillsForPrompt.slice(0, count);
	}
	if (skillsForPrompt.length === 0 && byCount.length > 0) {
		const fullWithoutNotice = renderWithinLimit(byCount, { kind: "full" }, false);
		if (fullWithoutNotice !== void 0) return {
			prompt: fullWithoutNotice,
			skills: byCount
		};
		const count = largestFittingValue(0, byCount.length, (candidateCount) => fitsCompact(byCount.slice(0, candidateCount), 0, false));
		if (count > 0) skillsForPrompt = byCount.slice(0, count);
	}
	const includeLimitNote = fitsCompact(skillsForPrompt, 0);
	let descriptionMaxChars = 0;
	if (skillsForPrompt.length > 0 && fitsCompact(skillsForPrompt, COMPACT_DESCRIPTION_MIN_CHARS, includeLimitNote)) descriptionMaxChars = largestFittingValue(COMPACT_DESCRIPTION_MIN_CHARS, 220, (chars) => fitsCompact(skillsForPrompt, chars, includeLimitNote));
	const prompt = renderWithinLimit(skillsForPrompt, {
		kind: "compact",
		descriptionMaxChars
	}, includeLimitNote) ?? "";
	return {
		prompt,
		skills: prompt ? skillsForPrompt : []
	};
}
//#endregion
export { prepareSkillsForPrompt as n, formatSkillsForPromptBounded as t };
