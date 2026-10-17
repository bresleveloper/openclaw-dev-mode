import { $ as removeCommandByName, b as loadPrivateQaCliModule, v as getSubCliEntriesCore } from "./argv-D_Nxd_3s.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CV_-dmd8.mjs";
import { n as shouldEagerRegisterSubcommands } from "./command-registration-policy-BO2dweLS.mjs";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-Cfb4tLrw.mjs";
import { i as registerCommandGroups, r as registerCommandGroupByName, t as findCommandGroupEntry } from "./register-command-groups-CR5XGbKJ.mjs";
import { t as buildCommandGroupEntries } from "./command-group-descriptors-4_W-e0cp.mjs";
//#region src/cli/program/register.subclis.ts
function shouldRegisterGatewayRunOnly(name, argv) {
	if (name !== "gateway") return false;
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || invocation.commandPath[0] !== "gateway") return false;
	return invocation.commandPath.length === 1 || invocation.commandPath[1] === "run";
}
async function registerGatewayRunOnly(program) {
	const { addGatewayRunCommand } = await import("./run-command-CW1iPdq3.mjs");
	removeCommandByName(program, "gateway");
	addGatewayRunCommand(addGatewayRunCommand(program.command("gateway").description("Run, inspect, and query the WebSocket Gateway")).command("run").description("Run the WebSocket Gateway (foreground)"));
}
async function registerSubCliWithPluginCommands(program, argv, registerSubCli, pluginCliPosition) {
	const invocation = resolveCliArgvInvocation(argv);
	const shouldRegisterPluginCommands = !invocation.hasHelpOrVersion && resolveCliCommandPathPolicy(invocation.commandPath).loadPlugins !== "never";
	if (pluginCliPosition === "before" && shouldRegisterPluginCommands) {
		const { registerPluginCliCommandsFromValidatedConfig } = await import("./cli-B7tSx_Vn.mjs");
		await registerPluginCliCommandsFromValidatedConfig(program);
	}
	await registerSubCli();
	if (pluginCliPosition === "after" && shouldRegisterPluginCommands) {
		const { registerPluginCliCommandsFromValidatedConfig } = await import("./cli-B7tSx_Vn.mjs");
		await registerPluginCliCommandsFromValidatedConfig(program);
	}
}
const entrySpecs = [
	[["acp"], async (program) => (await import("./acp-cli-D9dfj3Qj.mjs")).registerAcpCli(program)],
	[["gateway"], async (program) => (await import("./gateway-cli-Ds6L8Jf4.mjs")).registerGatewayCli(program)],
	[["daemon"], async (program) => (await import("./cli/daemon-cli.js")).registerDaemonCli(program)],
	[["logs"], async (program) => (await import("./logs-cli-BE-xXHIZ.mjs")).registerLogsCli(program)],
	[["system"], async (program) => (await import("./system-cli-BLExKQAU.mjs")).registerSystemCli(program)],
	[["models"], async (program) => (await import("./models-cli-CIrOJPNy.mjs")).registerModelsCli(program)],
	[["promos"], async (program) => (await import("./promos-cli-DqawrxIf.mjs")).registerPromosCli(program)],
	[["telemetry"], async (program) => (await import("./telemetry-cli-W2KJSkQj.mjs")).registerTelemetryCli(program)],
	[["infer", "capability"], async (program, argv) => (await import("./capability-cli-_dWrEMki.mjs")).registerCapabilityCli(program, argv)],
	[["approvals", "exec-approvals"], async (program) => (await import("./exec-approvals-cli-BSYum4pD.mjs")).registerExecApprovalsCli(program)],
	[["exec-policy"], async (program) => (await import("./exec-policy-cli-CBHAHX_Q.mjs")).registerExecPolicyCli(program)],
	[["nodes"], async (program, argv) => (await import("./nodes-cli-DhRIQsCr.mjs")).registerNodesCli(program, argv)],
	[["devices"], async (program) => (await import("./devices-cli-BIMR1PuL.mjs")).registerDevicesCli(program)],
	[["users"], async (program) => (await import("./users-cli-CCH3sb1Q.mjs")).registerUsersCli(program)],
	[["node"], async (program) => (await import("./node-cli-BtMcOyx3.mjs")).registerNodeCli(program)],
	[["connect"], async (program) => (await import("./connect-cli-CL6ffPWn.mjs")).registerConnectCli(program)],
	[["worker"], async (program) => (await import("./worker-cli-CEr4-hMg.mjs")).registerWorkerCli(program)],
	[["sandbox"], async (program) => (await import("./sandbox-cli-B8cv3zkr.mjs")).registerSandboxCli(program)],
	[["fleet"], async (program) => (await import("./fleet-cli-CIoik-wG.mjs")).registerFleetCli(program)],
	[["worktrees"], async (program) => (await import("./worktrees-cli-BefR6iR3.mjs")).registerWorktreesCli(program)],
	[["attach"], async (program) => (await import("./attach-cli-Da3UajHV.mjs")).registerAttachCli(program)],
	[[
		"tui",
		"terminal",
		"chat"
	], async (program) => (await import("./tui-cli-CzHxDjBn.mjs")).registerTuiCli(program)],
	[["resume"], async (program) => (await import("./resume-cli-Cc7RoSKs.mjs")).registerResumeCli(program)],
	[["cron", "automations"], async (program) => (await import("./cron-cli-CqG-Q7LH.mjs")).registerCronCli(program)],
	[["dns"], async (program) => (await import("./dns-cli-DJd1JkBv.mjs")).registerDnsCli(program)],
	[["docs"], async (program) => (await import("./docs-cli-CRVvcoue.mjs")).registerDocsCli(program)],
	[["qa"], async (program) => {
		const { registerQaLabCli } = await loadPrivateQaCliModule();
		if (typeof registerQaLabCli !== "function") throw new Error("Missing program command registrar: registerQaLabCli");
		await registerQaLabCli(program);
	}],
	[["proxy"], async (program) => (await import("./proxy-cli-Caw3MYKB.mjs")).registerProxyCli(program)],
	[["hooks"], async (program) => (await import("./hooks-cli-BW3lJgj_.mjs")).registerHooksCli(program)],
	[["webhooks"], async (program) => (await import("./webhooks-cli-BeGpEdaA.mjs")).registerWebhooksCli(program)],
	[["qr"], async (program) => (await import("./qr-cli-DjGFYVMd.mjs")).registerQrCli(program)],
	[["clawbot"], async (program) => (await import("./clawbot-cli-DoNmS0uS.mjs")).registerClawbotCli(program)],
	[["pairing"], async (program, argv) => {
		await registerSubCliWithPluginCommands(program, argv, async () => (await import("./pairing-cli-CE9IBXhT.mjs")).registerPairingCli(program), "before");
	}],
	[["plugins"], async (program, argv) => {
		await registerSubCliWithPluginCommands(program, argv, async () => (await import("./plugins-cli-BR8GqEzq.mjs")).registerPluginsCli(program), "after");
	}],
	[["channels"], async (program, argv, context) => (await import("./channels-cli-AaL3SbCG.mjs")).registerChannelsCli(program, argv, { includeSetupOptions: context.purpose === "completion" })],
	[["directory"], async (program) => (await import("./directory-cli-CrdhX4c-.mjs")).registerDirectoryCli(program)],
	[["security"], async (program) => (await import("./security-cli-y8oezE34.mjs")).registerSecurityCli(program)],
	[["secrets"], async (program) => (await import("./secrets-cli-DRpwghTV.mjs")).registerSecretsCli(program)],
	[["skills"], async (program) => (await import("./skills-cli-B_EGWWLA.mjs")).registerSkillsCli(program)],
	[["update"], async (program) => (await import("./update-cli-CYJe3UPF.mjs")).registerUpdateCli(program)],
	[["completion"], async (program) => (await import("./completion-cli-BEaYvGMO.mjs")).registerCompletionCli(program)]
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
