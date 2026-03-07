import { F as getPositiveIntFlagValue, G as isValueToken, I as getPrimaryCommand, L as getVerboseFlag, M as getCommandPathWithRootOptions, N as getCommandPositionalsWithRootOptions, P as getFlagValue, R as hasFlag, z as hasHelpOrVersion } from "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import { d as defaultRuntime, r as enableConsoleCapture } from "./subsystem-D-lLN9nd.js";
import "./boolean-DTgd5CzD.js";
import { a as normalizeEnv, c as parseCliProfileArgs, o as normalizeWindowsArgv, r as isTruthyEnvValue, s as applyCliProfileEnv } from "./entry.js";
import { zn as loadDotEnv } from "./auth-profiles-gyYFUuWS.js";
import "./agent-scope-Cp0IkEKB.js";
import "./utils-DMInpDZe.js";
import "./openclaw-root-D_NGSHjv.js";
import "./logger-lJby90xW.js";
import "./exec-9-lXnoNH.js";
import "./github-copilot-token-CcBrBN3h.js";
import "./host-env-security-BnQcDbLl.js";
import { t as VERSION } from "./version-Bxx5bg6l.js";
import "./runtime-overrides-BrDRV8AG.js";
import "./registry-XwiWGUVE.js";
import "./manifest-registry-DpwUhr6x.js";
import "./dock-DXYDVeNl.js";
import "./tokens-CUD3GCdK.js";
import "./compact-XX-hsoMs.js";
import "./accounts-CCmToVwr.js";
import "./plugins-BlxnRrWB.js";
import "./logging-DE_Gv8EN.js";
import "./send-FWVmVFhT.js";
import "./send-DX33HORc.js";
import "./with-timeout-CurmEH4i.js";
import "./deliver-BUdkAC0t.js";
import "./diagnostic-C4jALEeI.js";
import "./accounts-D9cGmSBd.js";
import "./image-ops-ChuMRt4V.js";
import "./send-DX_jC4JY.js";
import "./pi-model-discovery-CUF-k9xj.js";
import "./message-channel-CBxyiPG1.js";
import "./pi-embedded-helpers-B5Fkq6oo.js";
import "./sandbox-D8HChyNU.js";
import "./tool-catalog-CFg6jrp9.js";
import "./chrome-C9-sDY0x.js";
import "./tailscale-DUAiX-L-.js";
import "./tailnet-_7OomAtX.js";
import "./ws-skc9U6x4.js";
import "./auth-yZ8XbKKh.js";
import "./server-context-3Ig2duxc.js";
import "./frontmatter-BXR2CPEl.js";
import "./env-overrides-0y0M3S6P.js";
import "./path-alias-guards-CNI693yM.js";
import "./skills-BNw7KbKP.js";
import "./paths-SRstzZpm.js";
import "./redact-DWAErDjv.js";
import { i as formatUncaughtError } from "./errors-LFbAe3gQ.js";
import "./fs-safe-DmQzjIXC.js";
import "./proxy-env-BMOu-Lae.js";
import "./store-CEVnidlh.js";
import "./ports-B4ivsR6D.js";
import "./trash-sFfWaYz5.js";
import "./server-middleware-CNN87dgY.js";
import "./sessions-BzabF1Rs.js";
import "./accounts-B9MZJeQz.js";
import "./paths-m-ckvfYo.js";
import "./chat-envelope-BCgyDMmT.js";
import "./tool-images-DCz3azK8.js";
import "./thinking-WUzZvd36.js";
import "./models-config-ZJ7RlkpC.js";
import "./exec-approvals-allowlist-BDcEhC4n.js";
import "./exec-safe-bin-runtime-policy-D4f1Abfw.js";
import "./model-catalog-Cht1UAhe.js";
import "./fetch-BhsN1WTe.js";
import { h as installUnhandledRejectionHandler } from "./audio-transcription-runner-Vpl4r9ni.js";
import "./fetch-guard-NqpaSn2l.js";
import "./image-DP_4KiO7.js";
import "./tool-display-Cg06RH6E.js";
import "./api-key-rotation-CgROanRn.js";
import "./proxy-fetch-D31pCVr7.js";
import "./ir-DkuCOJDA.js";
import "./render-DUIuuHKM.js";
import "./target-errors-ChS8lQ-P.js";
import "./commands-DTZsXlMV.js";
import "./commands-registry-D66o69fc.js";
import "./session-cost-usage-Bnl8KzY4.js";
import "./session-utils-B8xssbMk.js";
import "./sqlite-Ct8GNFrc.js";
import "./client-x1tOQWHk.js";
import "./call-CT_1cdY_.js";
import "./pairing-token-B2YLkyDu.js";
import "./fetch-D1iSQCKw.js";
import "./pairing-store-DhJ-pAR5.js";
import "./exec-approvals-AfA1ifUJ.js";
import "./nodes-screen-BB94g0BI.js";
import "./system-run-command-BDf7quul.js";
import "./skill-commands-BONUgMfl.js";
import "./pi-tools.policy-CYqcYC09.js";
import "./workspace-dirs-D1pQDA-D.js";
import "./channel-activity-ScNLkz6p.js";
import "./tables-Cdqv62uz.js";
import "./server-lifecycle-rKINtAdz.js";
import "./stagger-BTY-7SHc.js";
import "./channel-selection-DTWp1tvg.js";
import "./plugin-auto-enable-DD_twTLl.js";
import "./send-CFs1S_ec.js";
import "./outbound-attachment-BBM85xwt.js";
import "./delivery-queue-C194SQuq.js";
import "./send-CwX-Ohg9.js";
import "./proxy-BWiQqe6d.js";
import "./timeouts-BT0Jhu1T.js";
import "./runtime-config-collectors-jWlsdfoA.js";
import "./command-secret-targets-CJcKbZna.js";
import "./onboard-helpers-BTGTJOdS.js";
import "./prompt-style-Dnaodfgg.js";
import "./pairing-labels-mfolQ1Hi.js";
import "./memory-cli-CuEbXeqv.js";
import "./manager-Db4cJ-bt.js";
import "./links-CPpbuTOP.js";
import "./cli-utils-BQZi5I0U.js";
import "./help-format-D4-SjylN.js";
import "./progress-Dfes2lhw.js";
import { t as ensureOpenClawCliOnPath } from "./path-env-DWX_ZeY2.js";
import "./note-C1niKQJi.js";
import "./issue-format-StXK2M5y.js";
import { t as ensurePluginRegistryLoaded } from "./plugin-registry-DNyRJ1Og.js";
import { t as assertSupportedRuntime } from "./runtime-guard-vBGm4L6l.js";
import { t as emitCliBanner } from "./banner-Df4lRCHV.js";
import "./doctor-config-flow-CYnuCCVs.js";
import { n as ensureConfigReady } from "./config-guard-lnBjQHsd.js";
import process$1 from "node:process";
import "node:url";
//#region src/cli/program/routes.ts
const routeHealth = {
	match: (path) => path[0] === "health",
	loadPlugins: (argv) => !hasFlag(argv, "--json"),
	run: async (argv) => {
		const json = hasFlag(argv, "--json");
		const verbose = getVerboseFlag(argv, { includeDebug: true });
		const timeoutMs = getPositiveIntFlagValue(argv, "--timeout");
		if (timeoutMs === null) return false;
		const { healthCommand } = await import("./health-Cjo7QX_h.js").then((n) => n.i);
		await healthCommand({
			json,
			timeoutMs,
			verbose
		}, defaultRuntime);
		return true;
	}
};
const routeStatus = {
	match: (path) => path[0] === "status",
	loadPlugins: true,
	run: async (argv) => {
		const json = hasFlag(argv, "--json");
		const deep = hasFlag(argv, "--deep");
		const all = hasFlag(argv, "--all");
		const usage = hasFlag(argv, "--usage");
		const verbose = getVerboseFlag(argv, { includeDebug: true });
		const timeoutMs = getPositiveIntFlagValue(argv, "--timeout");
		if (timeoutMs === null) return false;
		const { statusCommand } = await import("./status-RmOQmHys.js").then((n) => n.t);
		await statusCommand({
			json,
			deep,
			all,
			usage,
			timeoutMs,
			verbose
		}, defaultRuntime);
		return true;
	}
};
const routeSessions = {
	match: (path) => path[0] === "sessions" && !path[1],
	run: async (argv) => {
		const json = hasFlag(argv, "--json");
		const allAgents = hasFlag(argv, "--all-agents");
		const agent = getFlagValue(argv, "--agent");
		if (agent === null) return false;
		const store = getFlagValue(argv, "--store");
		if (store === null) return false;
		const active = getFlagValue(argv, "--active");
		if (active === null) return false;
		const { sessionsCommand } = await import("./sessions-Caf7idx7.js").then((n) => n.n);
		await sessionsCommand({
			json,
			store,
			agent,
			allAgents,
			active
		}, defaultRuntime);
		return true;
	}
};
const routeAgentsList = {
	match: (path) => path[0] === "agents" && path[1] === "list",
	run: async (argv) => {
		const json = hasFlag(argv, "--json");
		const bindings = hasFlag(argv, "--bindings");
		const { agentsListCommand } = await import("./agents-DEWDR_sh.js").then((n) => n.t);
		await agentsListCommand({
			json,
			bindings
		}, defaultRuntime);
		return true;
	}
};
const routeMemoryStatus = {
	match: (path) => path[0] === "memory" && path[1] === "status",
	run: async (argv) => {
		const agent = getFlagValue(argv, "--agent");
		if (agent === null) return false;
		const json = hasFlag(argv, "--json");
		const deep = hasFlag(argv, "--deep");
		const index = hasFlag(argv, "--index");
		const verbose = hasFlag(argv, "--verbose");
		const { runMemoryStatus } = await import("./memory-cli-CuEbXeqv.js").then((n) => n.t);
		await runMemoryStatus({
			agent,
			json,
			deep,
			index,
			verbose
		});
		return true;
	}
};
function getFlagValues(argv, name) {
	const values = [];
	const args = argv.slice(2);
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (!arg || arg === "--") break;
		if (arg === name) {
			const next = args[i + 1];
			if (!isValueToken(next)) return null;
			values.push(next);
			i += 1;
			continue;
		}
		if (arg.startsWith(`${name}=`)) {
			const value = arg.slice(name.length + 1).trim();
			if (!value) return null;
			values.push(value);
		}
	}
	return values;
}
const routes = [
	routeHealth,
	routeStatus,
	routeSessions,
	routeAgentsList,
	routeMemoryStatus,
	{
		match: (path) => path[0] === "config" && path[1] === "get",
		run: async (argv) => {
			const positionals = getCommandPositionalsWithRootOptions(argv, {
				commandPath: ["config", "get"],
				booleanFlags: ["--json"]
			});
			if (!positionals || positionals.length !== 1) return false;
			const pathArg = positionals[0];
			if (!pathArg) return false;
			const json = hasFlag(argv, "--json");
			const { runConfigGet } = await import("./config-cli-CTAeTxzO.js");
			await runConfigGet({
				path: pathArg,
				json
			});
			return true;
		}
	},
	{
		match: (path) => path[0] === "config" && path[1] === "unset",
		run: async (argv) => {
			const positionals = getCommandPositionalsWithRootOptions(argv, { commandPath: ["config", "unset"] });
			if (!positionals || positionals.length !== 1) return false;
			const pathArg = positionals[0];
			if (!pathArg) return false;
			const { runConfigUnset } = await import("./config-cli-CTAeTxzO.js");
			await runConfigUnset({ path: pathArg });
			return true;
		}
	},
	{
		match: (path) => path[0] === "models" && path[1] === "list",
		run: async (argv) => {
			const provider = getFlagValue(argv, "--provider");
			if (provider === null) return false;
			const all = hasFlag(argv, "--all");
			const local = hasFlag(argv, "--local");
			const json = hasFlag(argv, "--json");
			const plain = hasFlag(argv, "--plain");
			const { modelsListCommand } = await import("./models-gYpHIXi5.js").then((n) => n.t);
			await modelsListCommand({
				all,
				local,
				provider,
				json,
				plain
			}, defaultRuntime);
			return true;
		}
	},
	{
		match: (path) => path[0] === "models" && path[1] === "status",
		run: async (argv) => {
			const probeProvider = getFlagValue(argv, "--probe-provider");
			if (probeProvider === null) return false;
			const probeTimeout = getFlagValue(argv, "--probe-timeout");
			if (probeTimeout === null) return false;
			const probeConcurrency = getFlagValue(argv, "--probe-concurrency");
			if (probeConcurrency === null) return false;
			const probeMaxTokens = getFlagValue(argv, "--probe-max-tokens");
			if (probeMaxTokens === null) return false;
			const agent = getFlagValue(argv, "--agent");
			if (agent === null) return false;
			const probeProfileValues = getFlagValues(argv, "--probe-profile");
			if (probeProfileValues === null) return false;
			const probeProfile = probeProfileValues.length === 0 ? void 0 : probeProfileValues.length === 1 ? probeProfileValues[0] : probeProfileValues;
			const json = hasFlag(argv, "--json");
			const plain = hasFlag(argv, "--plain");
			const check = hasFlag(argv, "--check");
			const probe = hasFlag(argv, "--probe");
			const { modelsStatusCommand } = await import("./models-gYpHIXi5.js").then((n) => n.t);
			await modelsStatusCommand({
				json,
				plain,
				check,
				probe,
				probeProvider,
				probeProfile,
				probeTimeout,
				probeConcurrency,
				probeMaxTokens,
				agent
			}, defaultRuntime);
			return true;
		}
	}
];
function findRoutedCommand(path) {
	for (const route of routes) if (route.match(path)) return route;
	return null;
}
//#endregion
//#region src/cli/route.ts
async function prepareRoutedCommand(params) {
	const suppressDoctorStdout = hasFlag(params.argv, "--json");
	emitCliBanner(VERSION, { argv: params.argv });
	await ensureConfigReady({
		runtime: defaultRuntime,
		commandPath: params.commandPath,
		...suppressDoctorStdout ? { suppressDoctorStdout: true } : {}
	});
	if (typeof params.loadPlugins === "function" ? params.loadPlugins(params.argv) : params.loadPlugins) ensurePluginRegistryLoaded();
}
async function tryRouteCli(argv) {
	if (isTruthyEnvValue(process.env.OPENCLAW_DISABLE_ROUTE_FIRST)) return false;
	if (hasHelpOrVersion(argv)) return false;
	const path = getCommandPathWithRootOptions(argv, 2);
	if (!path[0]) return false;
	const route = findRoutedCommand(path);
	if (!route) return false;
	await prepareRoutedCommand({
		argv,
		commandPath: path,
		loadPlugins: route.loadPlugins
	});
	return route.run(argv);
}
//#endregion
//#region src/cli/run-main.ts
function rewriteUpdateFlagArgv(argv) {
	const index = argv.indexOf("--update");
	if (index === -1) return argv;
	const next = [...argv];
	next.splice(index, 1, "update");
	return next;
}
function shouldSkipPluginCommandRegistration(params) {
	if (params.hasBuiltinPrimary) return true;
	if (!params.primary) return hasHelpOrVersion(params.argv);
	return false;
}
function shouldEnsureCliPath(argv) {
	if (hasHelpOrVersion(argv)) return false;
	const [primary, secondary] = getCommandPathWithRootOptions(argv, 2);
	if (!primary) return true;
	if (primary === "status" || primary === "health" || primary === "sessions") return false;
	if (primary === "config" && (secondary === "get" || secondary === "unset")) return false;
	if (primary === "models" && (secondary === "list" || secondary === "status")) return false;
	return true;
}
async function runCli(argv = process$1.argv) {
	let normalizedArgv = normalizeWindowsArgv(argv);
	const parsedProfile = parseCliProfileArgs(normalizedArgv);
	if (!parsedProfile.ok) throw new Error(parsedProfile.error);
	if (parsedProfile.profile) applyCliProfileEnv({ profile: parsedProfile.profile });
	normalizedArgv = parsedProfile.argv;
	loadDotEnv({ quiet: true });
	normalizeEnv();
	if (shouldEnsureCliPath(normalizedArgv)) ensureOpenClawCliOnPath();
	assertSupportedRuntime();
	if (await tryRouteCli(normalizedArgv)) return;
	enableConsoleCapture();
	const { buildProgram } = await import("./program-BXL-UnMa.js");
	const program = buildProgram();
	installUnhandledRejectionHandler();
	process$1.on("uncaughtException", (error) => {
		console.error("[openclaw] Uncaught exception:", formatUncaughtError(error));
		process$1.exit(1);
	});
	const parseArgv = rewriteUpdateFlagArgv(normalizedArgv);
	const primary = getPrimaryCommand(parseArgv);
	if (primary) {
		const { getProgramContext } = await import("./program-context-BQcJjcd4.js").then((n) => n.n);
		const ctx = getProgramContext(program);
		if (ctx) {
			const { registerCoreCliByName } = await import("./command-registry-D5aOjtT5.js").then((n) => n.t);
			await registerCoreCliByName(program, ctx, primary, parseArgv);
		}
		const { registerSubCliByName } = await import("./register.subclis-CQmr2U7E.js").then((n) => n.a);
		await registerSubCliByName(program, primary);
	}
	if (!shouldSkipPluginCommandRegistration({
		argv: parseArgv,
		primary,
		hasBuiltinPrimary: primary !== null && program.commands.some((command) => command.name() === primary)
	})) {
		const { registerPluginCliCommands } = await import("./cli-CusCaqkP.js");
		const { loadConfig } = await import("./auth-profiles-gyYFUuWS.js").then((n) => n.I);
		registerPluginCliCommands(program, loadConfig());
	}
	await program.parseAsync(parseArgv);
}
//#endregion
export { runCli };
