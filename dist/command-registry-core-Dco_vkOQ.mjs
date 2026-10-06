import { I as getCoreCliCommandDescriptors, L as getCoreCliCommandNamesCore } from "./argv-IYTsfFsq.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DszZF2nA.mjs";
import { i as registerCommandGroups, r as registerCommandGroupByName, t as findCommandGroupEntry } from "./register-command-groups-B0KGj8Ev.mjs";
import { i as buildCommandGroupEntries } from "./register.subclis-core-B1qNKdwQ.mjs";
//#region src/cli/program/command-registry-core.ts
const coreEntrySpecs = [
	[["setup", "crestodian"], async (program) => (await import("./register.setup-Czc9Z7LG.mjs")).registerSetupCommand(program)],
	[["onboard"], async (program) => (await import("./register.onboard-BU7nzbld.mjs")).registerOnboardCommand(program)],
	[["configure"], async (program) => (await import("./register.configure-8AT474pU.mjs")).registerConfigureCommand(program)],
	[["config"], async (program) => (await import("./config-cli-CatcqbyR.mjs")).registerConfigCli(program)],
	[["claws"], async (program) => (await import("./claws-cli-BsA9U-hF.mjs")).registerClawsCli(program)],
	[["backup"], async (program) => (await import("./register.backup-BW4jwSY6.mjs")).registerBackupCommand(program)],
	[["database"], async (program) => (await import("./register.database-BUMPh22l.mjs")).registerDatabaseCommand(program)],
	[["migrate"], async (program) => (await import("./register.migrate-DGUEvScX.mjs")).registerMigrateCommand(program)],
	[["audit"], async (program) => (await import("./register.audit--VqIoGyE.mjs")).registerAuditCommand(program)],
	[[
		"doctor",
		"triage",
		"dashboard",
		"reset",
		"uninstall"
	], async (program, ctx) => (await import("./register.maintenance-DJ7QkpY5.mjs")).registerMaintenanceCommands(program, ctx)],
	[["message"], async (program, ctx) => (await import("./register.message-BIxaU64n.mjs")).registerMessageCommands(program, ctx)],
	[["mcp"], async (program) => (await import("./mcp-cli-T4cBPnT6.mjs")).registerMcpCli(program)],
	[["transcripts"], async (program) => (await import("./register.transcripts-rNtXLu4Y.mjs")).registerTranscriptsCli(program)],
	[["agent"], async (program, ctx) => (await import("./register.agent-turn-BjO99XSC.mjs")).registerAgentTurnCommand(program, { agentChannelOptions: ctx.agentChannelOptions })],
	[["agents"], async (program) => (await import("./register.agent-DtQixjnu.mjs")).registerAgentsCommands(program)],
	[[
		"status",
		"health",
		"sessions",
		"tasks"
	], async (program) => (await import("./register.status-health-sessions-uAjU30rX.mjs")).registerStatusHealthSessionsCommands(program)]
];
function resolveCoreCommandGroups(ctx) {
	const descriptors = getCoreCliCommandDescriptors();
	const visibleCommandNames = new Set(descriptors.map((descriptor) => descriptor.name));
	const visibleEntrySpecs = coreEntrySpecs.filter(([commandNames]) => commandNames.every((name) => visibleCommandNames.has(name)));
	return buildCommandGroupEntries(descriptors, visibleEntrySpecs, ctx);
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
