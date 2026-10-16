import { $ as removeCommandByName, b as loadPrivateQaCliModule, v as getSubCliEntriesCore } from "./argv-D_Nxd_3s.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CV_-dmd8.mjs";
import { n as shouldEagerRegisterSubcommands } from "./command-registration-policy-BO2dweLS.mjs";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-Cfb4tLrw.mjs";
import { i as registerCommandGroups, r as registerCommandGroupByName, t as findCommandGroupEntry } from "./register-command-groups-BiZzF1ua.mjs";
import { t as buildCommandGroupEntries } from "./command-group-descriptors-4_W-e0cp.mjs";
//#region src/cli/program/register.subclis.ts
function shouldRegisterGatewayRunOnly(name, argv) {
	if (name !== "gateway") return false;
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || invocation.commandPath[0] !== "gateway") return false;
	return invocation.commandPath.length === 1 || invocation.commandPath[1] === "run";
}
async function registerGatewayRunOnly(program) {
	const { addGatewayRunCommand } = await import("./run-command-DSDJqQ_q.mjs");
	removeCommandByName(program, "gateway");
	addGatewayRunCommand(addGatewayRunCommand(program.command("gateway").description("Run, inspect, and query the WebSocket Gateway")).command("run").description("Run the WebSocket Gateway (foreground)"));
}
async function registerSubCliWithPluginCommands(program, argv, registerSubCli, pluginCliPosition) {
	const invocation = resolveCliArgvInvocation(argv);
	const shouldRegisterPluginCommands = !invocation.hasHelpOrVersion && resolveCliCommandPathPolicy(invocation.commandPath).loadPlugins !== "never";
	if (pluginCliPosition === "before" && shouldRegisterPluginCommands) {
		const { registerPluginCliCommandsFromValidatedConfig } = await import("./cli-BKVLPEnW.mjs");
		await registerPluginCliCommandsFromValidatedConfig(program);
	}
	await registerSubCli();
	if (pluginCliPosition === "after" && shouldRegisterPluginCommands) {
		const { registerPluginCliCommandsFromValidatedConfig } = await import("./cli-BKVLPEnW.mjs");
		await registerPluginCliCommandsFromValidatedConfig(program);
	}
}
const entrySpecs = [
	[["acp"], async (program) => (await import("./acp-cli-DMHQNgsi.mjs")).registerAcpCli(program)],
	[["gateway"], async (program) => (await import("./gateway-cli-C_NQekCO.mjs")).registerGatewayCli(program)],
	[["daemon"], async (program) => (await import("./cli/daemon-cli.js")).registerDaemonCli(program)],
	[["logs"], async (program) => (await import("./logs-cli-BPJiFj-v.mjs")).registerLogsCli(program)],
	[["system"], async (program) => (await import("./system-cli-BLExKQAU.mjs")).registerSystemCli(program)],
	[["models"], async (program) => (await import("./models-cli-Bd33Gcfo.mjs")).registerModelsCli(program)],
	[["promos"], async (program) => (await import("./promos-cli-B6GzEm8f.mjs")).registerPromosCli(program)],
	[["telemetry"], async (program) => (await import("./telemetry-cli-fvio8ZP9.mjs")).registerTelemetryCli(program)],
	[["infer", "capability"], async (program, argv) => (await import("./capability-cli-C6V7cfBe.mjs")).registerCapabilityCli(program, argv)],
	[["approvals", "exec-approvals"], async (program) => (await import("./exec-approvals-cli-DsjXghGy.mjs")).registerExecApprovalsCli(program)],
	[["exec-policy"], async (program) => (await import("./exec-policy-cli-DbH61Xve.mjs")).registerExecPolicyCli(program)],
	[["nodes"], async (program, argv) => (await import("./nodes-cli-D8jnLYHn.mjs")).registerNodesCli(program, argv)],
	[["devices"], async (program) => (await import("./devices-cli-BIMR1PuL.mjs")).registerDevicesCli(program)],
	[["users"], async (program) => (await import("./users-cli-CCH3sb1Q.mjs")).registerUsersCli(program)],
	[["node"], async (program) => (await import("./node-cli-D-XlMIMu.mjs")).registerNodeCli(program)],
	[["connect"], async (program) => (await import("./connect-cli-D5BVolnb.mjs")).registerConnectCli(program)],
	[["worker"], async (program) => (await import("./worker-cli-DqclJPNn.mjs")).registerWorkerCli(program)],
	[["sandbox"], async (program) => (await import("./sandbox-cli-5EfyMiZ3.mjs")).registerSandboxCli(program)],
	[["fleet"], async (program) => (await import("./fleet-cli-CIoik-wG.mjs")).registerFleetCli(program)],
	[["worktrees"], async (program) => (await import("./worktrees-cli-OQnyTk3Q.mjs")).registerWorktreesCli(program)],
	[["attach"], async (program) => (await import("./attach-cli-DyJTh14H.mjs")).registerAttachCli(program)],
	[[
		"tui",
		"terminal",
		"chat"
	], async (program) => (await import("./tui-cli-DA6ZAltC.mjs")).registerTuiCli(program)],
	[["resume"], async (program) => (await import("./resume-cli-BBFDQnnu.mjs")).registerResumeCli(program)],
	[["cron", "automations"], async (program) => (await import("./cron-cli-AohbRMA1.mjs")).registerCronCli(program)],
	[["dns"], async (program) => (await import("./dns-cli--mTu_G_r.mjs")).registerDnsCli(program)],
	[["docs"], async (program) => (await import("./docs-cli-CRVvcoue.mjs")).registerDocsCli(program)],
	[["qa"], async (program) => {
		const { registerQaLabCli } = await loadPrivateQaCliModule();
		if (typeof registerQaLabCli !== "function") throw new Error("Missing program command registrar: registerQaLabCli");
		await registerQaLabCli(program);
	}],
	[["proxy"], async (program) => (await import("./proxy-cli-Caw3MYKB.mjs")).registerProxyCli(program)],
	[["hooks"], async (program) => (await import("./hooks-cli-CfnHD3dq.mjs")).registerHooksCli(program)],
	[["webhooks"], async (program) => (await import("./webhooks-cli-0Awm27QY.mjs")).registerWebhooksCli(program)],
	[["qr"], async (program) => (await import("./qr-cli-pLGF3zd3.mjs")).registerQrCli(program)],
	[["clawbot"], async (program) => (await import("./clawbot-cli-C4Edhw7A.mjs")).registerClawbotCli(program)],
	[["pairing"], async (program, argv) => {
		await registerSubCliWithPluginCommands(program, argv, async () => (await import("./pairing-cli-CBMzkcMK.mjs")).registerPairingCli(program), "before");
	}],
	[["plugins"], async (program, argv) => {
		await registerSubCliWithPluginCommands(program, argv, async () => (await import("./plugins-cli-BXLf07Z6.mjs")).registerPluginsCli(program), "after");
	}],
	[["channels"], async (program, argv, context) => (await import("./channels-cli-BpfobQos.mjs")).registerChannelsCli(program, argv, { includeSetupOptions: context.purpose === "completion" })],
	[["directory"], async (program) => (await import("./directory-cli-fio-bcpr.mjs")).registerDirectoryCli(program)],
	[["security"], async (program) => (await import("./security-cli-Cwuzp0yM.mjs")).registerSecurityCli(program)],
	[["secrets"], async (program) => (await import("./secrets-cli-CczRCeiE.mjs")).registerSecretsCli(program)],
	[["skills"], async (program) => (await import("./skills-cli-YD-N1I5p.mjs")).registerSkillsCli(program)],
	[["update"], async (program) => (await import("./update-cli-2-VUxHVi.mjs")).registerUpdateCli(program)],
	[["completion"], async (program) => (await import("./completion-cli-DVQX0b9N.mjs")).registerCompletionCli(program)]
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
