import { b as loadPrivateQaCliModule, v as getSubCliEntriesCore } from "./argv-IYTsfFsq.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DszZF2nA.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as shouldEagerRegisterSubcommands } from "./command-registration-policy-DXto_g8D.mjs";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-CrthWODq.mjs";
import { t as removeCommandByName } from "./command-tree-CA1ToIBK.mjs";
import { i as registerCommandGroups, r as registerCommandGroupByName, t as findCommandGroupEntry } from "./register-command-groups-B0KGj8Ev.mjs";
//#region src/cli/program/command-group-descriptors.ts
/** Bind descriptors and registration arguments without importing the command modules. */
function buildCommandGroupEntries(descriptors, specs, ...args) {
	const descriptorsByName = new Map(descriptors.map((descriptor) => [descriptor.name, descriptor]));
	return specs.map(([commandNames, register]) => ({
		names: commandNames,
		placeholders: commandNames.map((name) => {
			const descriptor = descriptorsByName.get(name);
			if (!descriptor) throw new Error(`Unknown command descriptor: ${name}`);
			return descriptor;
		}),
		register: (program) => register(program, ...args)
	}));
}
//#endregion
//#region src/cli/program/register.subclis-core.ts
const pluginCliLoader = createLazyImportLoader(() => import("./cli-Go_PYGIx.mjs"));
function shouldRegisterGatewayRunOnly(name, argv) {
	if (name !== "gateway") return false;
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || invocation.commandPath[0] !== "gateway") return false;
	return invocation.commandPath.length === 1 || invocation.commandPath[1] === "run";
}
async function registerGatewayRunOnly(program) {
	const { addGatewayRunCommand } = await import("./run-command-OL0-NTGp.mjs");
	removeCommandByName(program, "gateway");
	addGatewayRunCommand(addGatewayRunCommand(program.command("gateway").description("Run, inspect, and query the WebSocket Gateway")).command("run").description("Run the WebSocket Gateway (foreground)"));
}
async function registerSubCliWithPluginCommands(program, argv, registerSubCli, pluginCliPosition) {
	const invocation = resolveCliArgvInvocation(argv);
	const shouldRegisterPluginCommands = !invocation.hasHelpOrVersion && resolveCliCommandPathPolicy(invocation.commandPath).loadPlugins !== "never";
	if (pluginCliPosition === "before" && shouldRegisterPluginCommands) {
		const { registerPluginCliCommandsFromValidatedConfig } = await pluginCliLoader.load();
		await registerPluginCliCommandsFromValidatedConfig(program);
	}
	await registerSubCli();
	if (pluginCliPosition === "after" && shouldRegisterPluginCommands) {
		const { registerPluginCliCommandsFromValidatedConfig } = await pluginCliLoader.load();
		await registerPluginCliCommandsFromValidatedConfig(program);
	}
}
const entrySpecs = [
	[["acp"], async (program) => (await import("./acp-cli-t6Ucsdki.mjs")).registerAcpCli(program)],
	[["gateway"], async (program) => (await import("./gateway-cli-CL962bFy.mjs")).registerGatewayCli(program)],
	[["daemon"], async (program) => (await import("./cli/daemon-cli.js")).registerDaemonCli(program)],
	[["logs"], async (program) => (await import("./logs-cli-CjxDMiEz.mjs")).registerLogsCli(program)],
	[["system"], async (program) => (await import("./system-cli-Riz6q7nx.mjs")).registerSystemCli(program)],
	[["models"], async (program) => (await import("./models-cli-D3T6Dgia.mjs")).registerModelsCli(program)],
	[["promos"], async (program) => (await import("./promos-cli-_OoKJaQb.mjs")).registerPromosCli(program)],
	[["telemetry"], async (program) => (await import("./telemetry-cli-CeuBjyum.mjs")).registerTelemetryCli(program)],
	[["infer", "capability"], async (program, argv) => (await import("./capability-cli-c0c6NTjh.mjs")).registerCapabilityCli(program, argv)],
	[["approvals", "exec-approvals"], async (program) => (await import("./exec-approvals-cli-CI4daH9a.mjs")).registerExecApprovalsCli(program)],
	[["exec-policy"], async (program) => (await import("./exec-policy-cli-mGIZwgkP.mjs")).registerExecPolicyCli(program)],
	[["nodes"], async (program, argv) => (await import("./nodes-cli-BDToCrhj.mjs")).registerNodesCli(program, argv)],
	[["devices"], async (program) => (await import("./devices-cli-CaHwlqUi.mjs")).registerDevicesCli(program)],
	[["users"], async (program) => (await import("./users-cli-BvK6ep3W.mjs")).registerUsersCli(program)],
	[["node"], async (program) => (await import("./node-cli-BhvAP0eG.mjs")).registerNodeCli(program)],
	[["connect"], async (program) => (await import("./connect-cli-Dx_po-IL.mjs")).registerConnectCli(program)],
	[["worker"], async (program) => (await import("./worker-cli-D8crcIAt.mjs")).registerWorkerCli(program)],
	[["sandbox"], async (program) => (await import("./sandbox-cli-Iih5424W.mjs")).registerSandboxCli(program)],
	[["fleet"], async (program) => (await import("./fleet-cli-CehUhmMw.mjs")).registerFleetCli(program)],
	[["worktrees"], async (program) => (await import("./worktrees-cli-BzSCjhxR.mjs")).registerWorktreesCli(program)],
	[["attach"], async (program) => (await import("./attach-cli-U3REZnuR.mjs")).registerAttachCli(program)],
	[[
		"tui",
		"terminal",
		"chat"
	], async (program) => (await import("./tui-cli-C4KS7aya.mjs")).registerTuiCli(program)],
	[["resume"], async (program) => (await import("./resume-cli-FyRIoMNH.mjs")).registerResumeCli(program)],
	[["cron", "automations"], async (program) => (await import("./cron-cli-Bvjfo0iD.mjs")).registerCronCli(program)],
	[["dns"], async (program) => (await import("./dns-cli-Ddww9uQC.mjs")).registerDnsCli(program)],
	[["docs"], async (program) => (await import("./docs-cli-CZUoCl74.mjs")).registerDocsCli(program)],
	[["qa"], async (program) => {
		const { registerQaLabCli } = await loadPrivateQaCliModule();
		if (typeof registerQaLabCli !== "function") throw new Error("Missing program command registrar: registerQaLabCli");
		await registerQaLabCli(program);
	}],
	[["proxy"], async (program) => (await import("./proxy-cli-BNdy6vt_.mjs")).registerProxyCli(program)],
	[["hooks"], async (program) => (await import("./hooks-cli-DpfIbxQt.mjs")).registerHooksCli(program)],
	[["webhooks"], async (program) => (await import("./webhooks-cli-LMCYxSNd.mjs")).registerWebhooksCli(program)],
	[["qr"], async (program) => (await import("./qr-cli-LPmtiw3O.mjs")).registerQrCli(program)],
	[["clawbot"], async (program) => (await import("./clawbot-cli-D5MdmwPH.mjs")).registerClawbotCli(program)],
	[["pairing"], async (program, argv) => {
		await registerSubCliWithPluginCommands(program, argv, async () => (await import("./pairing-cli-61xAybha.mjs")).registerPairingCli(program), "before");
	}],
	[["plugins"], async (program, argv) => {
		await registerSubCliWithPluginCommands(program, argv, async () => (await import("./plugins-cli-BpsoneOq.mjs")).registerPluginsCli(program), "after");
	}],
	[["channels"], async (program, argv, context) => (await import("./channels-cli-CDaI9hTZ.mjs")).registerChannelsCli(program, argv, { includeSetupOptions: context.purpose === "completion" })],
	[["directory"], async (program) => (await import("./directory-cli-0LorKSmZ.mjs")).registerDirectoryCli(program)],
	[["security"], async (program) => (await import("./security-cli-CGxG9HuG.mjs")).registerSecurityCli(program)],
	[["secrets"], async (program) => (await import("./secrets-cli-BpaOdSpO.mjs")).registerSecretsCli(program)],
	[["skills"], async (program) => (await import("./skills-cli-8no_6aRy.mjs")).registerSkillsCli(program)],
	[["update"], async (program) => (await import("./update-cli-ssOsNnC0.mjs")).registerUpdateCli(program)]
];
function resolveSubCliCommandGroups(argv, context = {}) {
	const descriptors = getSubCliEntriesCore();
	const descriptorNames = new Set(descriptors.map((descriptor) => descriptor.name));
	return buildCommandGroupEntries(descriptors, entrySpecs.filter(([commandNames]) => commandNames.every((name) => descriptorNames.has(name))), argv, context);
}
function getSubCliCompletionGroups(argv = process.argv) {
	const entries = resolveSubCliCommandGroups(argv, { purpose: "completion" });
	const groups = [];
	let previous;
	for (const { name } of getSubCliEntriesCore()) {
		const entry = findCommandGroupEntry(entries, name);
		if (entry && entry !== previous) groups.push({
			name,
			entry
		});
		previous = entry;
	}
	return groups;
}
async function registerSubCliByNameCore(program, name, argv = process.argv, context = {}) {
	if (shouldRegisterGatewayRunOnly(name, argv)) {
		await registerGatewayRunOnly(program);
		return true;
	}
	return registerCommandGroupByName(program, resolveSubCliCommandGroups(argv, context), name);
}
function registerSubCliCommandsCore(program, argv = process.argv) {
	const { primary } = resolveCliArgvInvocation(argv);
	registerCommandGroups(program, resolveSubCliCommandGroups(argv), {
		eager: shouldEagerRegisterSubcommands(),
		primary,
		registerPrimaryOnly: true
	});
}
//#endregion
export { buildCommandGroupEntries as i, registerSubCliByNameCore as n, registerSubCliCommandsCore as r, getSubCliCompletionGroups as t };
