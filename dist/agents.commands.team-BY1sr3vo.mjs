import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as ExpectedCliError } from "./failure-output-Cct-llrO.mjs";
import { t as createAgentTeam } from "./agent-team-CxWt9C0c.mjs";
//#region src/commands/agents.commands.team.ts
async function agentsTeamCreateCommand(opts, runtime = defaultRuntime) {
	const result = await createAgentTeam(opts);
	if (result.status === "error") throw new ExpectedCliError({
		message: result.message,
		humanOutput: result.message,
		machineOutput: result.message
	});
	const note = result.ambientOwnerId !== result.coordinatorId ? `ambient owner stays ${result.ambientOwnerId}; talk to the coordinator by name` : void 0;
	const agents = result.agents.map(({ agentId, name, workspace, agentDir }) => ({
		agentId,
		name,
		workspace,
		agentDir
	}));
	if (opts.json) {
		writeRuntimeJson(runtime, {
			coordinatorId: result.coordinatorId,
			agents,
			ambientOwnerId: result.ambientOwnerId,
			...note ? { note } : {}
		});
		return;
	}
	runtime.log(`Created team with coordinator "${result.coordinatorId}":`);
	for (const agent of agents) runtime.log(`- ${agent.agentId}: ${shortenHomePath(agent.workspace)}`);
	if (note) runtime.log(note);
	runtime.log(`Talk to the coordinator: ${formatCliCommand(`openclaw agent --agent ${result.coordinatorId} --message "Describe your task"`)}`);
}
//#endregion
export { agentsTeamCreateCommand };
