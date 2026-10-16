//#region src/commands/doctor-skills-core.ts
function collectUnavailableAgentSkills(report) {
	return report.skills.filter((skill) => !skill.eligible && !skill.disabled && !skill.blockedByAllowlist && !skill.blockedByAgentFilter && !skill.platformIncompatible);
}
function formatMissingSkillSummary(skill) {
	return [
		["bins", skill.missing.bins],
		["any bins", skill.missing.anyBins],
		["env", skill.missing.env],
		["config", skill.missing.config],
		["os", skill.missing.os]
	].filter(([, values]) => values.length > 0).map(([label, values]) => `${label}: ${values.join(", ")}`).join("; ") || "unknown requirement";
}
/** Disables unavailable skills in config while preserving existing skill entries. */
function disableUnavailableSkillsInConfig(config, skills) {
	if (skills.length === 0) return config;
	const entries = { ...config.skills?.entries };
	for (const skill of skills) entries[skill.skillKey] = {
		...entries[skill.skillKey],
		enabled: false
	};
	return {
		...config,
		skills: {
			...config.skills,
			entries
		}
	};
}
//#endregion
export { disableUnavailableSkillsInConfig as n, formatMissingSkillSummary as r, collectUnavailableAgentSkills as t };
