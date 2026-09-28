import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { i as validateAgentTeamMemberIds, r as loadAgentTeamPreset } from "./agent-roles-DYbzEdi7.mjs";
import { n as validateFirstOnboardingAgentName } from "./onboard-agent-C6Cszn9G.mjs";
//#region src/commands/onboard-first-agent.ts
async function promptFirstOnboardingAgent(hasAuthoredRoster, requestedName, prompter, nonInteractive = false, options) {
	if (hasAuthoredRoster) return;
	const createTeam = options?.team ?? (options?.offerTeam === true && !requestedName && await prompter.select({
		message: "What would you like to create?",
		initialValue: "one",
		options: [{
			value: "one",
			label: "One agent"
		}, {
			value: "team",
			label: "A small team: a chief of staff plus specialists"
		}]
	}) === "team");
	const teamPreset = createTeam ? await loadAgentTeamPreset() : void 0;
	const specialistIds = teamPreset?.specialists.map(({ id }) => id) ?? [];
	const validateName = (value) => validateFirstOnboardingAgentName(value) ?? (teamPreset ? validateAgentTeamMemberIds([normalizeAgentId(value), ...specialistIds]) : void 0);
	const defaultName = teamPreset?.coordinator.id ?? "main";
	const name = requestedName ?? (nonInteractive ? defaultName : await prompter.text({
		message: createTeam ? "What should we call your chief of staff?" : "What should we call your first agent?",
		initialValue: defaultName,
		validate: validateName
	}));
	const error = validateName(name);
	if (error) throw new Error(error);
	return {
		name,
		...createTeam ? { team: true } : {}
	};
}
async function showSessionMigrationWarnings(prompter, warnings) {
	if (warnings?.length) await prompter.note(warnings.join("\n"), "Session history migration");
}
//#endregion
export { showSessionMigrationWarnings as n, promptFirstOnboardingAgent as t };
