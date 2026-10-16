import { L as getCoreCliCommandDescriptors, R as getCoreCliCommandNamesCore } from "./argv-D_Nxd_3s.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CV_-dmd8.mjs";
import { i as registerCommandGroups, r as registerCommandGroupByName, t as findCommandGroupEntry } from "./register-command-groups-BiZzF1ua.mjs";
import { t as buildCommandGroupEntries } from "./command-group-descriptors-4_W-e0cp.mjs";
//#region src/cli/program/command-registry-core.ts
const coreEntrySpecs = [
	[["setup", "crestodian"], async (program) => (await import("./register.setup-jpKlAboh.mjs")).registerSetupCommand(program)],
	[["onboard"], async (program) => (await import("./register.onboard-G7EqE3KQ.mjs")).registerOnboardCommand(program)],
	[["configure"], async (program) => (await import("./register.configure-BUxRdt0t.mjs")).registerConfigureCommand(program)],
	[["config"], async (program) => (await import("./config-cli-DlApXN0u.mjs")).registerConfigCli(program)],
	[["claws"], async (program) => (await import("./claws-cli-Dx0NgCiq.mjs")).registerClawsCli(program)],
	[["backup"], async (program) => (await import("./register.backup-BH1xJX7U.mjs")).registerBackupCommand(program)],
	[["database"], async (program) => (await import("./register.database-Bbg6YhHB.mjs")).registerDatabaseCommand(program)],
	[["migrate"], async (program) => (await import("./register.migrate-DgxXIonI.mjs")).registerMigrateCommand(program)],
	[["storage"], async (program) => (await import("./register.storage-Ch039tRd.mjs")).registerStorageCommand(program)],
	[["audit"], async (program) => (await import("./register.audit-BZXkHiZg.mjs")).registerAuditCommand(program)],
	[[
		"doctor",
		"triage",
		"dashboard",
		"reset",
		"uninstall"
	], async (program, ctx) => (await import("./register.maintenance-D-c6YoAE.mjs")).registerMaintenanceCommands(program, ctx)],
	[["message"], async (program, ctx) => (await import("./register.message-3_ezAggv.mjs")).registerMessageCommands(program, ctx)],
	[["mcp"], async (program) => (await import("./mcp-cli-BmIvhG4A.mjs")).registerMcpCli(program)],
	[["transcripts"], async (program) => (await import("./register.transcripts-CzsQqSkr.mjs")).registerTranscriptsCli(program)],
	[["agent"], async (program, ctx) => (await import("./register.agent-turn-BJm6pAdR.mjs")).registerAgentTurnCommand(program, { agentChannelOptions: ctx.agentChannelOptions })],
	[["agents"], async (program) => (await import("./register.agent-BLnejzTK.mjs")).registerAgentsCommands(program)],
	[[
		"status",
		"health",
		"sessions"
	], async (program) => (await import("./register.status-health-sessions-Byo2utzy.mjs")).registerStatusHealthSessionsCommands(program)]
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
