import { et as removeCommandByName, x as loadPrivateQaCliModule, y as getSubCliEntriesCore } from "./argv-C7hqFLn5.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CJfjJu7L.mjs";
import { n as shouldEagerRegisterSubcommands } from "./command-registration-policy-Bsx-L4oT.mjs";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-u5WGwKHZ.mjs";
import { i as registerCommandGroups, r as registerCommandGroupByName, t as findCommandGroupEntry } from "./register-command-groups-Uzwp5G4x.mjs";
import { t as buildCommandGroupEntries } from "./command-group-descriptors-4_W-e0cp.mjs";
//#region src/cli/program/register.subclis.ts
function shouldRegisterGatewayRunOnly(name, argv) {
	if (name !== "gateway") return false;
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || invocation.commandPath[0] !== "gateway") return false;
	return invocation.commandPath.length === 1 || invocation.commandPath[1] === "run";
}
async function registerGatewayRunOnly(program) {
	const { addGatewayRunCommand } = await import("./run-command-Y2dyEL5E.mjs");
	removeCommandByName(program, "gateway");
	addGatewayRunCommand(addGatewayRunCommand(program.command("gateway").description("Run, inspect, and query the WebSocket Gateway")).command("run").description("Run the WebSocket Gateway (foreground)"));
}
async function registerPluginCommandsIfNeeded(program, argv) {
	const invocation = resolveCliArgvInvocation(argv);
	if (!invocation.hasHelpOrVersion && resolveCliCommandPathPolicy(invocation.commandPath).loadPlugins !== "never") {
		const { registerPluginCliCommandsFromValidatedConfig } = await import("./cli-_FnfqMvN.mjs");
		await registerPluginCliCommandsFromValidatedConfig(program);
	}
}
const entrySpecs = [
	[["acp"], async (program) => (await import("./acp-cli-BXYnGe1f.mjs")).registerAcpCli(program)],
	[["gateway"], async (program) => (await import("./gateway-cli-CoyZin2r.mjs")).registerGatewayCli(program)],
	[["daemon"], async (program) => (await import("./cli/daemon-cli.js")).registerDaemonCli(program)],
	[["logs"], async (program) => (await import("./logs-cli-DuzuYZ-q.mjs")).registerLogsCli(program)],
	[["system"], async (program) => (await import("./system-cli-Bv_hIUgV.mjs")).registerSystemCli(program)],
	[["models"], async (program) => (await import("./models-cli-Bga5RiJ2.mjs")).registerModelsCli(program)],
	[["promos"], async (program) => (await import("./promos-cli-BayEQ8iZ.mjs")).registerPromosCli(program)],
	[["telemetry"], async (program) => (await import("./telemetry-cli-FpJMrkiz.mjs")).registerTelemetryCli(program)],
	[["infer", "capability"], async (program, argv) => (await import("./capability-cli-zz0ip-Xv.mjs")).registerCapabilityCli(program, argv)],
	[["approvals", "exec-approvals"], async (program) => (await import("./exec-approvals-cli-C96TCU1b.mjs")).registerExecApprovalsCli(program)],
	[["exec-policy"], async (program) => (await import("./exec-policy-cli-DyZ1Aq3Q.mjs")).registerExecPolicyCli(program)],
	[["nodes"], async (program, argv) => (await import("./nodes-cli-DbldUYwZ.mjs")).registerNodesCli(program, argv)],
	[["devices"], async (program) => (await import("./devices-cli-DnDQVaCF.mjs")).registerDevicesCli(program)],
	[["users"], async (program) => (await import("./users-cli-Bl89Xt1y.mjs")).registerUsersCli(program)],
	[["node"], async (program) => (await import("./node-cli-DdV7zO_g.mjs")).registerNodeCli(program)],
	[["connect"], async (program) => (await import("./connect-cli-C70FBSSL.mjs")).registerConnectCli(program)],
	[["worker"], async (program) => (await import("./worker-cli-CPZaR2-c.mjs")).registerWorkerCli(program)],
	[["sandbox"], async (program) => (await import("./sandbox-cli-DxQpBHGv.mjs")).registerSandboxCli(program)],
	[["worktrees"], async (program) => (await import("./worktrees-cli-CL_AaK74.mjs")).registerWorktreesCli(program)],
	[["attach"], async (program) => (await import("./attach-cli-BdrZgv1L.mjs")).registerAttachCli(program)],
	[[
		"tui",
		"terminal",
		"chat"
	], async (program) => (await import("./tui-cli-Duu1YtK_.mjs")).registerTuiCli(program)],
	[["resume"], async (program) => (await import("./resume-cli-CYJsJk8l.mjs")).registerResumeCli(program)],
	[["cron", "automations"], async (program) => (await import("./cron-cli-jECs6LPF.mjs")).registerCronCli(program)],
	[["dns"], async (program) => (await import("./dns-cli-C63IK24u.mjs")).registerDnsCli(program)],
	[["docs"], async (program) => (await import("./docs-cli-CBZz_8Yy.mjs")).registerDocsCli(program)],
	[["qa"], async (program) => {
		const { registerQaLabCli } = await loadPrivateQaCliModule();
		if (typeof registerQaLabCli !== "function") throw new Error("Missing program command registrar: registerQaLabCli");
		await registerQaLabCli(program);
	}],
	[["proxy"], async (program) => (await import("./proxy-cli-Cvr5MgWr.mjs")).registerProxyCli(program)],
	[["hooks"], async (program) => (await import("./hooks-cli-DsG3haGe.mjs")).registerHooksCli(program)],
	[["webhooks"], async (program) => (await import("./webhooks-cli-uya7PBl3.mjs")).registerWebhooksCli(program)],
	[["qr"], async (program) => (await import("./qr-cli-DwkyRsur.mjs")).registerQrCli(program)],
	[["clawbot"], async (program) => (await import("./clawbot-cli-CW8Tbe_w.mjs")).registerClawbotCli(program)],
	[["pairing"], async (program, argv) => {
		await registerPluginCommandsIfNeeded(program, argv);
		(await import("./pairing-cli-BrxJz2Hl.mjs")).registerPairingCli(program);
	}],
	[["plugins"], async (program, argv) => {
		(await import("./plugins-cli-CsBYUoxT.mjs")).registerPluginsCli(program);
		await registerPluginCommandsIfNeeded(program, argv);
	}],
	[["channels"], async (program, argv, context) => (await import("./channels-cli-DJF8DTpM.mjs")).registerChannelsCli(program, argv, { includeSetupOptions: context.purpose === "completion" })],
	[["directory"], async (program) => (await import("./directory-cli-BHr8EO98.mjs")).registerDirectoryCli(program)],
	[["security"], async (program) => (await import("./security-cli-Bd6zvSFP.mjs")).registerSecurityCli(program)],
	[["secrets"], async (program) => (await import("./secrets-cli-BeUvJypl.mjs")).registerSecretsCli(program)],
	[["skills"], async (program) => (await import("./skills-cli-Byz1xkuN.mjs")).registerSkillsCli(program)],
	[["update"], async (program) => (await import("./update-cli-DAHy6atB.mjs")).registerUpdateCli(program)],
	[["completion"], async (program) => (await import("./completion-cli-av1lI7cI.mjs")).registerCompletionCli(program)]
];
function resolveSubCliCommandGroups(argv, context = {}) {
	return buildCommandGroupEntries(getSubCliEntriesCore(), entrySpecs, argv, context);
}
function getSubCliCompletionGroups(argv = process.argv) {
	const entries = resolveSubCliCommandGroups(argv, { purpose: "completion" });
	const groups = [];
	let previous;
	for (const { name } of getSubCliEntriesCore()) {
		const entry = name === "completion" ? void 0 : findCommandGroupEntry(entries, name);
		if (entry && entry !== previous) groups.push({
			name,
			entry
		});
		previous = entry;
	}
	return groups;
}
async function registerSubCliByName(program, name, argv = process.argv, context = {}) {
	if (shouldRegisterGatewayRunOnly(name, argv)) {
		await registerGatewayRunOnly(program);
		return true;
	}
	return registerCommandGroupByName(program, resolveSubCliCommandGroups(argv, context), name);
}
function registerSubCliCommands(program, argv = process.argv) {
	const { primary } = resolveCliArgvInvocation(argv);
	const entries = resolveSubCliCommandGroups(argv);
	const completion = findCommandGroupEntry(entries, "completion");
	const options = {
		eager: shouldEagerRegisterSubcommands(),
		primary,
		registerPrimaryOnly: true
	};
	registerCommandGroups(program, entries.filter((entry) => entry !== completion), options);
	if (completion) registerCommandGroups(program, [completion], options);
}
//#endregion
export { registerSubCliByName as n, registerSubCliCommands as r, getSubCliCompletionGroups as t };
