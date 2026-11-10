import { o as writeRuntimeJson, r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { u as throwExpectedCliError } from "./failure-output-CpIKhMiV.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import { t as createAgentTeam } from "./agent-team-CRwdfazA.mjs";
//#region src/commands/agents.commands.team.ts
async function agentsTeamCreateCommand(opts, runtime = defaultRuntime) {
	const result = await runWithLocalStateOwner({
		method: "agents.team.create",
		params: {},
		target: "agent team",
		onForeignOwner: "refuse",
		runLocal: () => createAgentTeam(opts)
	});
	if (result.status === "error") throwExpectedCliError(result.message);
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
	for (const agent of agents) runtime.log(`- ${agent.agentId}: ${sanitizeTerminalText(shortenHomePath(agent.workspace))}`);
	if (note) runtime.log(sanitizeTerminalText(note));
	runtime.log(`Talk to the coordinator: ${formatCliCommand(`openclaw agent --agent ${result.coordinatorId} --message "Describe your task"`)}`);
}
//#endregion
export { agentsTeamCreateCommand };
