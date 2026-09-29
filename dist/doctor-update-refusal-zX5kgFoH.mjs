import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { n as resolveDiagnosticProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { s as readWindowsProcessStartTimeSync } from "./pid-alive-CXdZEzr_.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as getChildLogger } from "./logger--ALOusOG.mjs";
import { t as readFileWindowFully } from "./file-read-Csm265gq.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-i3x9UrUR.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { l as renderGatewayServiceStartHints } from "./shared-Ba-Zp0iU.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { i as executeGitCommand } from "./git-exec-B6ZpVpQV.mjs";
import { c as resolveUpdateInstallKind } from "./update-check-DLHVC0Oo.mjs";
import fs from "node:fs/promises";
//#region src/commands/doctor-update-refusal.ts
async function formatUpdateDoctorServiceStopRefusal(env) {
	const lines = [
		"The update parent must stop the managed Gateway before Doctor maintenance; Doctor left the service unchanged.",
		"The managed Gateway is still loaded or running. If the stop command already returned successfully, its managed-service shutdown did not complete.",
		`After the current update exits, run ${formatCliCommand("openclaw gateway stop", env)} from an independent shell, then retry ${formatCliCommand("openclaw update repair", env)}.`
	];
	if (process.platform === "darwin") {
		const { resolveLaunchAgentGuiDomain } = await import("./launchd-runtime-BfBggipp.mjs");
		lines.push(`If that command cannot unload the LaunchAgent, run launchctl bootout ${resolveLaunchAgentGuiDomain()}/${resolveLaunchAgentLabel(env)} from a terminal in the owning user's logged-in macOS GUI session.`);
	}
	return lines.join("\n");
}
async function readParentStartTime(parentPid) {
	if (process.platform === "win32") return readWindowsProcessStartTimeSync(parentPid);
	const result = await runCommandWithTimeout([
		"ps",
		"-o",
		"lstart=",
		"-p",
		String(parentPid)
	], {
		baseEnv: {
			...resolveDiagnosticProcessEnv(process.env),
			LC_ALL: "C",
			TZ: "UTC"
		},
		timeoutMs: 1e3
	});
	const startedAt = Date.parse(`${result.stdout.trim()} UTC`);
	return result.code === 0 && result.termination === "exit" && Number.isFinite(startedAt) ? startedAt : null;
}
async function readPreviousSwitchCommit(root) {
	const parentPid = process.ppid;
	const parentStartedAt = await readParentStartTime(parentPid);
	if (parentStartedAt === null) return;
	const git = async (args) => {
		const result = await executeGitCommand(root, args, { env: { GIT_NO_LAZY_FETCH: "1" } });
		if (result.code !== 0 || result.termination !== "exit") throw new Error("Git recovery evidence unavailable");
		return result.stdout.trim();
	};
	const head = await git(["rev-parse", "HEAD"]);
	const logPath = await git([
		"rev-parse",
		"--path-format=absolute",
		"--git-path",
		"logs/HEAD"
	]);
	const file = await fs.open(logPath, "r");
	let lines;
	try {
		const stat = await file.stat();
		if (!stat.isFile()) return;
		const start = Math.max(0, stat.size - 131072);
		const buffer = Buffer.alloc(stat.size - start);
		const read = await readFileWindowFully(file, buffer, start);
		lines = buffer.subarray(0, read).toString("utf8").split("\n");
		if (lines.pop() !== "") return;
		if (start > 0) lines.shift();
	} finally {
		await file.close();
	}
	const entries = [];
	for (const line of lines.toReversed()) {
		const match = /^([a-f0-9]{40}) ([a-f0-9]{40}) .* (\d+) [+-]\d{4}\t(.*)$/u.exec(line);
		if (!match) return;
		entries.push({
			previous: match[1],
			sha: match[2],
			atMs: Number(match[3]) * 1e3,
			action: match[4] ?? ""
		});
	}
	if (entries[0]?.sha !== head) return;
	const sequence = entries.findIndex((entry) => !(entry.atMs > parentStartedAt) || !/^(?:checkout: |rebase \((?:start|pick|finish)\): )/u.test(entry.action));
	if (sequence < 1) return;
	const switches = entries.slice(0, sequence);
	const checkout = switches.filter((entry) => entry.action.startsWith("checkout: "));
	if (checkout.length !== 1 || switches.at(-1) !== checkout[0] || switches.slice(0, -1).some((entry, index) => entry.previous !== switches[index + 1]?.sha)) return;
	const rebases = switches.filter((entry) => entry.action.startsWith("rebase "));
	if (rebases.length > 0 && (!rebases[0]?.action.startsWith("rebase (finish): ") || !rebases.at(-1)?.action.startsWith("rebase (start): ") || rebases.filter((entry) => entry.action.startsWith("rebase (start): ")).length !== 1 || rebases.filter((entry) => entry.action.startsWith("rebase (finish): ")).length !== 1)) return;
	const previous = checkout[0]?.previous;
	if (!previous || !/^[a-f0-9]{40}$/u.test(previous) || previous === head) return;
	const [previousTree, candidateTree] = (await git([
		"rev-parse",
		`${previous}^{tree}`,
		`${head}^{tree}`
	])).split("\n");
	const containsCandidate = await executeGitCommand(root, [
		"merge-base",
		"--is-ancestor",
		head,
		previous
	], { env: { GIT_NO_LAZY_FETCH: "1" } });
	if (previousTree === candidateTree || containsCandidate.termination !== "exit" || containsCandidate.code !== 1 || process.ppid !== parentPid || await git(["rev-parse", "HEAD"]) !== head) return;
	return previous;
}
/** Diagnostic guidance only: never changes the checkout, state, or service. */
async function resolveUpdateDoctorGitRecovery(params = {}) {
	if (process.env.OPENCLAW_UPDATE_IN_PROGRESS !== "1" || process.env.OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE !== "1" || process.env.OPENCLAW_UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART !== "1") return;
	const root = params.root === void 0 ? await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1]
	}) : params.root;
	if (!root || await resolveUpdateInstallKind(root).catch(() => "unknown") !== "git") return;
	if (params.stateRepaired) return {
		message: "Checking out the previous source is not enough: state repairs have already run. Follow the migration recovery instructions above before starting the Gateway.",
		commands: []
	};
	const quote = process.platform === "win32" ? quotePowerShellArg : quoteCliArg;
	const previous = await readPreviousSwitchCommit(root).catch(() => void 0);
	if (!previous) return {
		message: `The previous commit could not be determined; inspect git -C ${quote(root)} reflog.`,
		commands: []
	};
	const checkout = `git -C ${quote(root)} checkout ${previous}`;
	const enter = process.platform === "win32" ? `Set-Location -LiteralPath ${quote(root)}` : `cd ${quote(root)}`;
	const commands = [
		checkout,
		enter,
		"pnpm install",
		"pnpm build"
	];
	const shellCommand = process.platform === "win32" ? `${checkout}; if ($? -and $LASTEXITCODE -eq 0) { ${enter}; if ($?) { pnpm install; if ($? -and $LASTEXITCODE -eq 0) { pnpm build } } }` : commands.join(" && ");
	return {
		commands,
		message: [
			`The previous source is intact in Git. Previous source commit: ${previous}`,
			"After the updater exits, run each command from an independent shell only after the previous one succeeds:",
			shellCommand,
			`Service hints (choose the appropriate one): ${renderGatewayServiceStartHints().join("; ")}`,
			"Fix the refusal cause, then rerun openclaw update. Once the upgrade succeeds, subsequent updates validate before activation."
		].join("\n")
	};
}
function recordUpdateDoctorRefusal(message) {
	const logger = getChildLogger({ subsystem: "update" });
	for (const line of message.split("\n")) logger.warn(line);
}
//#endregion
export { recordUpdateDoctorRefusal as n, resolveUpdateDoctorGitRecovery as r, formatUpdateDoctorServiceStopRefusal as t };
