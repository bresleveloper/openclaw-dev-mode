import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import { t as hasExplicitOptions } from "./command-options-BDuSHeWG.mjs";
import { n as formatHelpExamples } from "./help-format-xds_bDSp.mjs";
import { t as collectOption } from "./helpers-Bbrcmhji.mjs";
//#region src/cli/program/register.agent.ts
async function runAgentsCommandAction(action) {
	const [{ defaultRuntime }, { runCommandWithRuntime }] = await Promise.all([import("./runtime-C3rISTtF.mjs"), import("./cli-utils-MPlWzGJh.mjs")]);
	await runCommandWithRuntime(defaultRuntime, () => action(defaultRuntime));
}
function registerAgentsCommands(program) {
	const agents = program.command("agents").description("Manage isolated agents (workspaces + auth + routing)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/agents", "docs.openclaw.ai/cli/agents")}\n`);
	agents.command("list").description("List configured agents").option("--json", "Output JSON instead of text", false).option("--bindings", "Include routing bindings", false).option("--tree", "Render agent creation hierarchy", false).action(async (opts) => {
		await runAgentsCommandAction(async (runtime) => {
			const { agentsListCommand } = await import("./agents.commands.list-CbFILzWy.mjs");
			await agentsListCommand(opts, runtime);
		});
	});
	agents.command("bindings").description("List routing bindings").option("--agent <id>", "Filter by agent id").option("--json", "Output JSON instead of text", false).action(async (opts) => {
		await runAgentsCommandAction(async (runtime) => {
			const { agentsBindingsCommand } = await import("./agents.commands.bind-U0GVlin1.mjs");
			await agentsBindingsCommand(opts, runtime);
		});
	});
	agents.command("bind").description("Add routing bindings for an agent").option("--agent <id>", "Agent id (defaults to current default agent)").option("--bind <channel[:accountId]>", "Binding to add (repeatable). If omitted, accountId is resolved by channel defaults/hooks.", collectOption, []).option("--json", "Output JSON summary", false).action(async (opts) => {
		await runAgentsCommandAction(async (runtime) => {
			const { agentsBindCommand } = await import("./agents.commands.bind-U0GVlin1.mjs");
			await agentsBindCommand(opts, runtime);
		});
	});
	agents.command("unbind").description("Remove routing bindings for an agent").option("--agent <id>", "Agent id (defaults to current default agent)").option("--bind <channel[:accountId]>", "Binding to remove (repeatable)", collectOption, []).option("--all", "Remove all bindings for this agent", false).option("--json", "Output JSON summary", false).action(async (opts) => {
		await runAgentsCommandAction(async (runtime) => {
			const { agentsUnbindCommand } = await import("./agents.commands.bind-U0GVlin1.mjs");
			await agentsUnbindCommand(opts, runtime);
		});
	});
	agents.command("add [name]").description("Add a new isolated agent").option("--workspace <dir>", "Workspace directory for the new agent").option("--role <role>", "Seed a role: coordinator, researcher, writer, reviewer").option("--model <id>", "Model id for this agent").option("--agent-dir <dir>", "Agent state directory for this agent").option("--bind <channel[:accountId]>", "Route channel binding (repeatable)", collectOption, []).option("--non-interactive", "Disable prompts; requires --workspace unless --role is set", false).option("--json", "Output JSON summary", false).action(async (name, opts, command) => {
		await runAgentsCommandAction(async (runtime) => {
			const hasAutomationFlags = hasExplicitOptions(command, [
				"workspace",
				"model",
				"agentDir",
				"bind",
				"nonInteractive"
			]);
			const { agentsAddCommand } = await import("./agents.commands.add-CEkC2mP6.mjs");
			await agentsAddCommand({
				...opts,
				name
			}, runtime, { hasAutomationFlags });
		});
	});
	agents.command("team").description("Create a coordinated team of agents").command("create").description("Create a coordinator and specialists from a bundled preset").option("--preset <name>", "Team preset (team)", "team").option("--coordinator <id>", "Coordinator agent id", "coordinator").option("--prefix <p>", "Prefix every team agent id with <p>-").option("--workspace-root <dir>", "Parent directory for separate team workspaces").option("--non-interactive", "Disable prompts", false).option("--json", "Output JSON summary", false).action(async (opts) => {
		await runAgentsCommandAction(async (runtime) => {
			const { agentsTeamCreateCommand } = await import("./agents.commands.team-BtS_FkEK.mjs");
			await agentsTeamCreateCommand(opts, runtime);
		});
	});
	agents.command("set-identity").description("Update an agent identity (name/theme/emoji/avatar)").option("--agent <id>", "Agent id to update").option("--workspace <dir>", "Locate the agent and IDENTITY.md; does not change the stored workspace").option("--identity-file <path>", "Explicit IDENTITY.md path to read").option("--from-identity", "Read values from IDENTITY.md", false).option("--name <name>", "Identity name").option("--theme <theme>", "Identity theme").option("--emoji <emoji>", "Identity emoji").option("--avatar <value>", "Identity avatar (workspace path, http(s) URL, or data URI)").option("--json", "Output JSON summary", false).addHelpText("after", () => `
${theme.heading("Examples:")}
${formatHelpExamples([
		["openclaw agents set-identity --agent main --name \"OpenClaw\" --emoji \"🦞\"", "Set name + emoji."],
		["openclaw agents set-identity --agent main --avatar avatars/openclaw.png", "Set avatar path."],
		["openclaw agents set-identity --workspace ~/.openclaw/workspace --from-identity", "Load from IDENTITY.md."],
		["openclaw agents set-identity --identity-file ~/.openclaw/workspace/IDENTITY.md --agent main", "Use a specific IDENTITY.md."]
	])}
`).action(async (opts) => {
		await runAgentsCommandAction(async (runtime) => {
			const { agentsSetIdentityCommand } = await import("./agents.commands.identity-8SH4qMIh.mjs");
			await agentsSetIdentityCommand(opts, runtime);
		});
	});
	agents.command("delete <id>").description("Delete an agent and prune workspace/state").option("--force", "Skip confirmation", false).option("--json", "Output JSON summary", false).action(async (id, opts) => {
		await runAgentsCommandAction(async (runtime) => {
			const { agentsDeleteCommand } = await import("./agents.commands.delete-Evk7cF_w.mjs");
			await agentsDeleteCommand({
				...opts,
				id
			}, runtime);
		});
	});
	agents.action(async () => {
		await runAgentsCommandAction(async (runtime) => {
			const { agentsListCommand } = await import("./agents.commands.list-CbFILzWy.mjs");
			await agentsListCommand({}, runtime);
		});
	});
}
//#endregion
export { registerAgentsCommands };
