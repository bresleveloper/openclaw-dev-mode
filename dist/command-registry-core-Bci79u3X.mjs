import { R as getCoreCliCommandDescriptors, z as getCoreCliCommandNamesCore } from "./argv-C7hqFLn5.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CJfjJu7L.mjs";
import { i as registerCommandGroups, r as registerCommandGroupByName, t as findCommandGroupEntry } from "./register-command-groups-Uzwp5G4x.mjs";
import { t as buildCommandGroupEntries } from "./command-group-descriptors-4_W-e0cp.mjs";
//#region src/cli/program/command-registry-core.ts
const coreEntrySpecs = [
	[["setup", "crestodian"], async (program) => (await import("./register.setup-B1XLTIbj.mjs")).registerSetupCommand(program)],
	[["onboard"], async (program) => (await import("./register.onboard-CC3sQb1s.mjs")).registerOnboardCommand(program)],
	[["configure"], async (program) => (await import("./register.configure-CUcvVRK3.mjs")).registerConfigureCommand(program)],
	[["config"], async (program) => (await import("./config-cli-DQyQ7Zxo.mjs")).registerConfigCli(program)],
	[["claws"], async (program) => (await import("./claws-cli-COwzK4UX.mjs")).registerClawsCli(program)],
	[["backup"], async (program) => (await import("./register.backup-DgjRqCvn.mjs")).registerBackupCommand(program)],
	[["database"], async (program) => (await import("./register.database-BHvT2GTj.mjs")).registerDatabaseCommand(program)],
	[["migrate"], async (program) => (await import("./register.migrate-Bx1aF6hn.mjs")).registerMigrateCommand(program)],
	[["storage"], async (program) => (await import("./register.storage-C2rHWrXt.mjs")).registerStorageCommand(program)],
	[["audit"], async (program) => (await import("./register.audit-vfI7nsUx.mjs")).registerAuditCommand(program)],
	[[
		"doctor",
		"triage",
		"dashboard",
		"reset",
		"uninstall"
	], async (program, ctx) => (await import("./register.maintenance-i1MaT1Bw.mjs")).registerMaintenanceCommands(program, ctx)],
	[["message"], async (program, ctx) => (await import("./register.message-7oRk614R.mjs")).registerMessageCommands(program, ctx)],
	[["mcp"], async (program) => (await import("./mcp-cli-DbowmzeR.mjs")).registerMcpCli(program)],
	[["transcripts"], async (program) => (await import("./register.transcripts-DobxD89q.mjs")).registerTranscriptsCli(program)],
	[["agent"], async (program, ctx) => (await import("./register.agent-turn-NiNPMzqf.mjs")).registerAgentTurnCommand(program, { agentChannelOptions: ctx.agentChannelOptions })],
	[["agents"], async (program) => (await import("./register.agent-zxYL1sow.mjs")).registerAgentsCommands(program)],
	[[
		"status",
		"health",
		"sessions"
	], async (program) => (await import("./register.status-health-sessions-CTjDE1kV.mjs")).registerStatusHealthSessionsCommands(program)]
];
function resolveCoreCommandGroups(ctx) {
	return buildCommandGroupEntries(getCoreCliCommandDescriptors(), coreEntrySpecs, ctx);
}
function getCoreCliCompletionGroups(ctx) {
	const entries = resolveCoreCommandGroups(ctx);
	return getCoreCliCommandNamesCore().map((name) => findCommandGroupEntry(entries, name)).filter((entry, index, groups) => entry !== void 0 && entry !== groups[index - 1]);
}
async function registerCoreCliByName(program, ctx, name) {
	return registerCommandGroupByName(program, resolveCoreCommandGroups(ctx), name);
}
function registerCoreCliCommands(program, ctx, argv) {
	const { primary } = resolveCliArgvInvocation(argv);
	registerCommandGroups(program, resolveCoreCommandGroups(ctx), {
		eager: false,
		primary,
		registerPrimaryOnly: true
	});
}
//#endregion
export { registerCoreCliByName as n, registerCoreCliCommands as r, getCoreCliCompletionGroups as t };
